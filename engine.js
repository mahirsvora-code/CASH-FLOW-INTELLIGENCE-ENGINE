(function attachVorcoCashFlowEngine() {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function monthLabel(index) {
    return `M${index + 1}`;
  }

  function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function normalizeWeights(duration, curveType) {
    const weights = [];
    for (let i = 0; i < duration; i += 1) {
      const t = duration === 1 ? 0 : i / (duration - 1);
      if (curveType === 'front') {
        weights.push(1.5 - 0.8 * t);
      } else if (curveType === 'back') {
        weights.push(0.7 + 0.8 * t);
      } else if (curveType === 'bell') {
        const distance = Math.abs(t - 0.5);
        weights.push(1.4 - distance * 1.4);
      } else {
        weights.push(1);
      }
    }

    const total = weights.reduce((sum, item) => sum + item, 0) || 1;
    return weights.map(item => item / total);
  }

  function spreadPhaseOutflow(months, phase, delayMonths, escalationPct) {
    const start = Math.max(0, Number(phase.startMonth || 0) + delayMonths);
    const duration = Math.max(1, Number(phase.duration || 1));
    const baseCost = Math.max(0, Number(phase.cost || 0));
    const weights = normalizeWeights(duration, phase.curve || 'linear');

    for (let offset = 0; offset < duration; offset += 1) {
      const monthIndex = start + offset;
      if (monthIndex >= months.length) continue;
      const escalationFactor = Math.pow(1 + escalationPct, monthIndex / 12);
      months[monthIndex].constructionOutflow += baseCost * weights[offset] * escalationFactor;
    }
  }

  function addScheduledAmount(months, schedule, key) {
    schedule.forEach(item => {
      const monthIndex = Number(item.month);
      const amount = Math.max(0, Number(item.amount || 0));
      if (!Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex >= months.length) return;
      months[monthIndex][key] += amount;
    });
  }

  function salesCurveFactor(relativeMonth, totalMonths, curveType) {
    if (curveType !== 'gujarat-ramp') {
      return 1;
    }

    const progress = totalMonths > 1 ? relativeMonth / (totalMonths - 1) : 0;
    if (progress < 0.12) return 0.55;
    if (progress < 0.25) return 0.78;
    if (progress < 0.65) return 1.12;
    if (progress < 0.85) return 0.95;
    return 0.7;
  }

  function applySalesCollections(months, input, config, constructionProgressSeries) {
    const salesCollectionMode = input.salesCollectionMode || 'auto';
    const velocity = Math.max(0, input.salesVelocity * (1 - input.salesSlowdownPct));
    const price = Math.max(0, input.pricePerSqft);
    const areaCap = Math.max(0, input.saleableArea);
    const cancellationPct = clamp(Number(input.cancellationPct || 0), 0, 0.2);
    const annualPriceEscalationPct = Math.max(0, Number(input.annualPriceEscalationPct || 0));
    const collectionLagMonths = Math.max(0, Math.round(Number(input.collectionLagMonths || 0)));
    const collectionEfficiencyPct = clamp(Number(input.collectionEfficiencyPct ?? 0.94), 0.5, 1);
    const collectionDefaultPct = clamp(Number(input.collectionDefaultPct ?? 0.02), 0, 0.25);
    const salesStartIndex = Number.isFinite(Number(input.salesStartMonthIndex))
      ? Math.max(0, Math.round(Number(input.salesStartMonthIndex)))
      : Math.max(0, Math.round(Number(input.salesStartMonth || 0)) - 1);
    const launchMonth = salesStartIndex + Math.max(0, Math.round(Number(input.delayMonths || 0)));
    const effectiveSalesMonths = Math.max(1, months.length - launchMonth);
    const bookingPct = clamp(Number(config.bookingPct || 0) / 100, 0, 1);
    const possessionPct = clamp(Number(config.possessionPct || 0) / 100, 0, 1);
    const milestoneConfig = Array.isArray(config.milestones) ? config.milestones : [];

    const milestoneTotal = milestoneConfig.reduce((sum, item) => sum + clamp(Number(item.pct || 0) / 100, 0, 1), 0);
    const totalPct = bookingPct + possessionPct + milestoneTotal;
    const normalizer = totalPct > 0 ? totalPct : 1;

    const normalizedBooking = bookingPct / normalizer;
    const normalizedPossession = possessionPct / normalizer;
    const normalizedMilestones = milestoneConfig.map(item => ({
      name: item.name || 'Milestone',
      triggerProgress: clamp(Number(item.triggerProgress || 0), 0, 1),
      pct: (clamp(Number(item.pct || 0) / 100, 0, 1)) / normalizer,
    }));

    if (salesCollectionMode === 'manual') {
      const manualSeries = Array.isArray(input.manualSalesInflows) ? input.manualSalesInflows : [];
      let totalManualCollections = 0;
      for (let monthIndex = 0; monthIndex < months.length; monthIndex += 1) {
        const amount = Math.max(0, Number(manualSeries[monthIndex] || 0));
        months[monthIndex].salesInflow += amount;
        totalManualCollections += amount;
      }

      const soldArea = price > 0 ? Math.min(areaCap, totalManualCollections / price) : 0;
      return {
        soldArea,
        unsoldArea: Math.max(0, areaCap - soldArea),
        overflowReceipts: 0,
        launchMonth,
      };
    }

    const cohorts = [];
    let soldArea = 0;

    let overflowReceipts = 0;

    function postSalesReceipt(sourceMonthIndex, amount) {
      const receiptMonthIndex = sourceMonthIndex + collectionLagMonths;
      if (receiptMonthIndex < months.length) {
        months[receiptMonthIndex].salesInflow += amount;
      } else {
        overflowReceipts += amount;
      }
    }

    for (let monthIndex = 0; monthIndex < months.length; monthIndex += 1) {
      if (monthIndex < launchMonth) continue;
      const progressNow = constructionProgressSeries[monthIndex] || 0;

      if (soldArea < areaCap) {
        const relativeSalesMonth = monthIndex - launchMonth;
        const curveFactor = salesCurveFactor(relativeSalesMonth, effectiveSalesMonths, input.salesCurveType);
        const saleThisMonth = Math.min(velocity * curveFactor, areaCap - soldArea);
        soldArea += saleThisMonth;
        const escalatedPrice = price * Math.pow(1 + annualPriceEscalationPct, monthIndex / 12);
        const grossSaleValue = saleThisMonth * escalatedPrice;
        const netSaleValue = grossSaleValue * (1 - cancellationPct) * collectionEfficiencyPct * (1 - collectionDefaultPct);

        if (netSaleValue > 0) {
          const cohort = {
            month: monthIndex,
            saleValue: netSaleValue,
            bookingCollected: false,
            milestonesCollected: normalizedMilestones.map(() => false),
            possessionCollected: false,
          };
          cohorts.push(cohort);
        }
      }

      cohorts.forEach(cohort => {
        if (!cohort.bookingCollected) {
          postSalesReceipt(monthIndex, cohort.saleValue * normalizedBooking);
          cohort.bookingCollected = true;
        }

        normalizedMilestones.forEach((milestone, idx) => {
          if (cohort.milestonesCollected[idx]) return;
          if (monthIndex < cohort.month) return;
          if (progressNow >= milestone.triggerProgress) {
            postSalesReceipt(monthIndex, cohort.saleValue * milestone.pct);
            cohort.milestonesCollected[idx] = true;
          }
        });

        if (!cohort.possessionCollected && progressNow >= 1) {
          postSalesReceipt(monthIndex, cohort.saleValue * normalizedPossession);
          cohort.possessionCollected = true;
        }
      });
    }

    return {
      soldArea,
      unsoldArea: Math.max(0, areaCap - soldArea),
      overflowReceipts,
      launchMonth,
    };
  }

  function calculateEmi(principal, monthlyRate, tenureMonths) {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    if (monthlyRate <= 0) return principal / tenureMonths;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
  }

  function npvAtRate(cashFlows, monthlyRate) {
    return cashFlows.reduce((sum, cf, idx) => sum + (cf / Math.pow(1 + monthlyRate, idx + 1)), 0);
  }

  function estimateAnnualizedIrr(cashFlows) {
    if (!cashFlows.length || !cashFlows.some(cf => cf > 0) || !cashFlows.some(cf => cf < 0)) {
      return null;
    }

    let low = -0.95;
    let high = 2;
    let npvLow = npvAtRate(cashFlows, low);
    let npvHigh = npvAtRate(cashFlows, high);

    if (!Number.isFinite(npvLow) || !Number.isFinite(npvHigh) || npvLow * npvHigh > 0) {
      return null;
    }

    for (let i = 0; i < 80; i += 1) {
      const mid = (low + high) / 2;
      const npvMid = npvAtRate(cashFlows, mid);
      if (!Number.isFinite(npvMid)) return null;
      if (Math.abs(npvMid) < 1e-7) {
        return Math.pow(1 + mid, 12) - 1;
      }
      if (npvLow * npvMid <= 0) {
        high = mid;
        npvHigh = npvMid;
      } else {
        low = mid;
        npvLow = npvMid;
      }
    }

    const monthlyRate = (low + high) / 2;
    return Math.pow(1 + monthlyRate, 12) - 1;
  }

  function simulateCashFlow(input) {
    const months = Array.from({ length: input.projectMonths }, (_, index) => ({
      monthIndex: index,
      monthLabel: monthLabel(index),
      inflow: 0,
      outflow: 0,
      balance: 0,
      salesInflow: 0,
      debtInflow: 0,
      equityInflow: 0,
      landOutflow: 0,
      constructionOutflow: 0,
      softOutflow: 0,
      statutoryOutflow: 0,
      salesCommissionOutflow: 0,
      transactionOutflow: 0,
      debtDrawFeeOutflow: 0,
      interestOutflow: 0,
      capitalizedInterest: 0,
      debtPrincipalOutflow: 0,
      debtOutstanding: 0,
      committedCost: 0,
      dueCost: 0,
      paidCost: 0,
      unpaidCarry: 0,
      penaltyOutflow: 0,
      reserveBreach: false,
      stressLevel: 0,
      salesLossFromStress: 0,
      flags: [],
    }));

    const escalationPct = input.costEscalationPct;
    const statutoryEscalationPct = Math.max(0, Number(input.statutoryEscalationPct || 0));
    const monthlyStatutoryCosts = Math.max(0, Number(input.monthlyStatutoryCosts || 0));
    const transactionFeePct = Math.max(0, Number(input.transactionFeePct || 0));
    const debtDrawFeePct = Math.max(0, Number(input.debtDrawFeePct || 0));
    const disbursementLagMonths = Math.max(0, Math.round(Number(input.disbursementLagMonths || 0)));
    const moratoriumMonths = Math.max(0, Math.round(Number(input.moratoriumMonths || 0)));
    const repaymentMode = input.repaymentMode || 'cash-sweep';
    const reserveEnforcement = input.reserveEnforcement || 'hard';
    const applyFailureMechanics = input.applyFailureMechanics !== false;

    addScheduledAmount(months, input.landSchedule, 'landOutflow');
    addScheduledAmount(months, input.softCostSchedule, 'softOutflow');
    addScheduledAmount(months, input.equitySchedule, 'equityInflow');

    input.constructionPhases.forEach(phase => {
      spreadPhaseOutflow(months, phase, input.delayMonths, escalationPct);
    });

    for (let i = 0; i < months.length; i += 1) {
      months[i].softOutflow += Math.max(0, input.baseSoftCosts) * Math.pow(1 + escalationPct, i / 12);
      months[i].statutoryOutflow += monthlyStatutoryCosts * Math.pow(1 + statutoryEscalationPct, i / 12);
    }

    const totalConstructionOutflow = months.reduce((sum, month) => sum + month.constructionOutflow, 0);
    let cumulativeConstruction = 0;
    const constructionProgressSeries = months.map(month => {
      cumulativeConstruction += month.constructionOutflow;
      return totalConstructionOutflow > 0 ? clamp(cumulativeConstruction / totalConstructionOutflow, 0, 1) : 0;
    });

    const salesStats = applySalesCollections(months, input, input.paymentPlan, constructionProgressSeries) || {
      soldArea: 0,
      unsoldArea: Math.max(0, Number(input.saleableArea || 0)),
      overflowReceipts: 0,
      launchMonth: 0,
    };

    let debtOutstanding = 0;
    let debtDrawn = 0;
    let debtReservedForDisbursement = 0;
    let cumulativeDebtEligibility = 0;
    let cash = input.openingCash;
    const minCashReserve = Math.max(0, Number(input.minCashReserve || 0));
    const pendingDebtDraws = Array.from({ length: months.length }, () => 0);
    const auditTrace = [];

    let firstNegativeMonth = null;
    let minBalance = cash;
    let maxDeficit = 0;
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalSalesInflow = 0;
    let totalDebtInflow = 0;
    let totalInterestOutflow = 0;
    let totalPrincipalOutflow = 0;
    let totalStatutoryOutflow = 0;
    let totalTransactionOutflow = 0;
    let totalDebtDrawFeeOutflow = 0;
    let totalCapitalizedInterest = 0;
    let debtCapInterestSpill = 0;
    let debtBlockedByCap = 0;
    let cashIdentityMaxDrift = 0;
    let totalCommittedCost = 0;
    let totalDueCost = 0;
    let totalPaidCost = 0;
    let totalPenaltyOutflow = 0;
    let totalStressSalesLoss = 0;
    let worstDebtShortfall = 0;
    let peakDebtOutstanding = 0;
    let unpaidDueCarry = 0;
    let deferredExecutionCarry = 0;
    let consecutiveStressMonths = 0;
    let consecutiveReserveBreachMonths = 0;
    let cumulativeLiquidityGap = 0;
    let longestStressWindow = 0;
    let currentStressWindow = 0;
    let cumulativePaidConstruction = 0;

    months.forEach(month => {
      const scheduledDraw = pendingDebtDraws[month.monthIndex] || 0;
      debtReservedForDisbursement = Math.max(0, debtReservedForDisbursement - scheduledDraw);
      const scheduledHeadroom = Math.max(0, input.debtLimit - debtOutstanding);
      const appliedScheduledDraw = Math.min(scheduledDraw, scheduledHeadroom);
      const blockedScheduledDraw = Math.max(0, scheduledDraw - appliedScheduledDraw);
      month.debtInflow += appliedScheduledDraw;
      debtDrawn += appliedScheduledDraw;
      debtOutstanding += appliedScheduledDraw;
      debtBlockedByCap += blockedScheduledDraw;

      const monthOpeningCash = cash;
      const plannedLand = month.landOutflow;
      const plannedConstruction = month.constructionOutflow;
      const plannedSoft = month.softOutflow;
      const plannedStatutory = month.statutoryOutflow;
      const plannedBaseOutflow = plannedLand + plannedConstruction + plannedSoft + plannedStatutory;

      const stressLevel = !applyFailureMechanics
        ? 0
        : consecutiveStressMonths >= 5 ? 3 : consecutiveStressMonths >= 3 ? 2 : consecutiveStressMonths >= 1 ? 1 : 0;
      const freezeActive = applyFailureMechanics && reserveEnforcement === 'hard' && consecutiveReserveBreachMonths >= 2;
      const constructionSlowdownFactor = !applyFailureMechanics
        ? 1
        : stressLevel >= 3 ? 0.58 : stressLevel >= 2 ? 0.7 : stressLevel >= 1 ? 0.86 : 1;
      const executionFactor = freezeActive
        ? Math.max(0.15, constructionSlowdownFactor * 0.6)
        : constructionSlowdownFactor;
      const salesCollectionFactor = !applyFailureMechanics
        ? 1
        : stressLevel >= 3 ? 0.65 : stressLevel >= 2 ? 0.8 : stressLevel >= 1 ? 0.92 : 1;
      const distressCostMultiplier = !applyFailureMechanics
        ? 1
        : stressLevel >= 3 ? 1.16 : stressLevel >= 2 ? 1.1 : stressLevel >= 1 ? 1.04 : 1;
      const debtStressSpreadPct = !applyFailureMechanics
        ? 0
        : stressLevel >= 3 ? 0.16 : stressLevel >= 2 ? 0.1 : stressLevel >= 1 ? 0.04 : 0;

      const stressAdjustedSales = month.salesInflow * salesCollectionFactor;
      month.salesLossFromStress = Math.max(0, month.salesInflow - stressAdjustedSales);
      month.salesInflow = stressAdjustedSales;
      totalStressSalesLoss += month.salesLossFromStress;

      const executableBase = (plannedBaseOutflow + deferredExecutionCarry) * executionFactor;
      deferredExecutionCarry = Math.max(0, plannedBaseOutflow + deferredExecutionCarry - executableBase);
      const stressedCommitted = executableBase * distressCostMultiplier;
      month.committedCost = stressedCommitted;
      month.dueCost = stressedCommitted + unpaidDueCarry;

      const ratioLand = plannedBaseOutflow > 0 ? plannedLand / plannedBaseOutflow : 0;
      const ratioConstruction = plannedBaseOutflow > 0 ? plannedConstruction / plannedBaseOutflow : 0;
      const ratioSoft = plannedBaseOutflow > 0 ? plannedSoft / plannedBaseOutflow : 0;
      const ratioStatutory = plannedBaseOutflow > 0 ? plannedStatutory / plannedBaseOutflow : 0;
      const committedConstruction = stressedCommitted * ratioConstruction;

      const nonDebtInflow = month.salesInflow + month.equityInflow;
      month.salesCommissionOutflow = month.salesInflow * Math.max(0, Number(input.salesCommissionPct || 0));
      month.transactionOutflow = (month.salesInflow + month.equityInflow) * transactionFeePct;
      month.debtDrawFeeOutflow = month.debtInflow * debtDrawFeePct;

      const monthlyRate = (input.debtRateAnnual / 12) * (1 + input.interestIncreasePct + debtStressSpreadPct);
      const accruedInterest = debtOutstanding * monthlyRate;
      const inMoratorium = month.monthIndex < moratoriumMonths;
      if (inMoratorium) {
        const capitalizableHeadroom = Math.max(0, input.debtLimit - debtOutstanding);
        month.capitalizedInterest = Math.min(accruedInterest, capitalizableHeadroom);
        month.interestOutflow = Math.max(0, accruedInterest - month.capitalizedInterest);
      } else {
        month.capitalizedInterest = 0;
        month.interestOutflow = accruedInterest;
      }

      if (month.capitalizedInterest > 0) {
        debtOutstanding += month.capitalizedInterest;
      }
      if (inMoratorium && month.interestOutflow > 0) {
        debtCapInterestSpill += month.interestOutflow;
      }

      cumulativeDebtEligibility += cumulativePaidConstruction < 0 ? 0 : (committedConstruction * input.debtCoveragePct);
      const eligibleDebtTotal = Math.min(input.debtLimit, cumulativeDebtEligibility);
      const debtHeadroom = Math.max(0, input.debtLimit - (debtOutstanding + debtReservedForDisbursement));
      const eligibilityHeadroom = Math.max(0, eligibleDebtTotal - (debtDrawn + debtReservedForDisbursement));
      const remainingEligibleDraw = debtOutstanding >= input.debtLimit
        ? 0
        : Math.max(0, Math.min(eligibilityHeadroom, debtHeadroom));

      const mandatoryChargesBeforePrincipal = month.salesCommissionOutflow + month.transactionOutflow + month.debtDrawFeeOutflow + month.interestOutflow;
      const projectedCashPreDebt = cash + nonDebtInflow + month.debtInflow - mandatoryChargesBeforePrincipal - month.dueCost;
      const reserveTarget = reserveEnforcement === 'none' ? 0 : minCashReserve;
      const requiredDebt = debtOutstanding >= input.debtLimit
        ? 0
        : Math.max(0, reserveTarget - projectedCashPreDebt);
      const debtToCommit = Math.min(remainingEligibleDraw, requiredDebt);

      if (debtToCommit > 0) {
        const lagPenalty = applyFailureMechanics && stressLevel >= 2 ? 1 : 0;
        const effectiveLag = disbursementLagMonths + lagPenalty;
        const disbursementMonth = Math.min(months.length - 1, month.monthIndex + effectiveLag);
        pendingDebtDraws[disbursementMonth] += debtToCommit;
        if (disbursementMonth > month.monthIndex) {
          debtReservedForDisbursement += debtToCommit;
        }

        if (disbursementMonth === month.monthIndex) {
          const sameMonthHeadroom = Math.max(0, input.debtLimit - debtOutstanding);
          const appliedSameMonthDraw = Math.min(debtToCommit, sameMonthHeadroom);
          const blockedSameMonthDraw = Math.max(0, debtToCommit - appliedSameMonthDraw);

          month.debtInflow += appliedSameMonthDraw;
          debtDrawn += appliedSameMonthDraw;
          debtOutstanding += appliedSameMonthDraw;
          month.debtDrawFeeOutflow += appliedSameMonthDraw * debtDrawFeePct;
          debtBlockedByCap += blockedSameMonthDraw;
        }
      }

      if (requiredDebt > debtToCommit || disbursementLagMonths > 0) {
        const debtShortfall = Math.max(0, requiredDebt - debtToCommit) + (disbursementLagMonths > 0 ? debtToCommit : 0);
        worstDebtShortfall = Math.max(worstDebtShortfall, debtShortfall);
      }

      const mandatoryCharges = month.salesCommissionOutflow + month.transactionOutflow + month.debtDrawFeeOutflow + month.interestOutflow;
      const availableBeforeProjectPayments = cash + month.salesInflow + month.equityInflow + month.debtInflow - mandatoryCharges;
      const payableLimit = reserveEnforcement === 'hard'
        ? Math.max(0, availableBeforeProjectPayments - minCashReserve)
        : reserveEnforcement === 'soft'
          ? Math.max(0, availableBeforeProjectPayments - (minCashReserve * 0.5))
          : Math.max(0, availableBeforeProjectPayments);
      const hardReserveFreeze = reserveEnforcement === 'hard' && availableBeforeProjectPayments < minCashReserve;
      month.paidCost = hardReserveFreeze ? 0 : Math.min(month.dueCost, payableLimit);
      unpaidDueCarry = Math.max(0, month.dueCost - month.paidCost);
      month.unpaidCarry = unpaidDueCarry;

      const dueConstruction = month.dueCost * ratioConstruction;
      const paidConstruction = month.dueCost > 0 ? dueConstruction * (month.paidCost / month.dueCost) : 0;
      cumulativePaidConstruction += paidConstruction;

      let cashAfterProjectCost = availableBeforeProjectPayments - month.paidCost;
      month.penaltyOutflow = applyFailureMechanics
        ? (unpaidDueCarry * (0.01 + stressLevel * 0.005))
        : 0;
      if (reserveEnforcement === 'soft' && availableBeforeProjectPayments < minCashReserve) {
        month.penaltyOutflow += (minCashReserve - availableBeforeProjectPayments) * 0.01;
      }
      cashAfterProjectCost -= month.penaltyOutflow;

      let principalRepayment = 0;
      const cashAvailableForDebt = Math.max(0, cashAfterProjectCost - minCashReserve);
      if (debtOutstanding > 0) {
        if (repaymentMode === 'bullet') {
          if (month.monthIndex === months.length - 1) {
            principalRepayment = Math.min(debtOutstanding, cashAvailableForDebt);
          }
        } else if (repaymentMode === 'emi') {
          const emiStartMonth = Math.min(months.length - 1, moratoriumMonths);
          if (month.monthIndex >= emiStartMonth) {
            const remainingTenure = Math.max(1, months.length - month.monthIndex);
            const emiPayment = calculateEmi(debtOutstanding, monthlyRate, remainingTenure);
            const principalDue = Math.min(debtOutstanding, Math.max(0, emiPayment - month.interestOutflow));
            principalRepayment = Math.min(principalDue, cashAvailableForDebt);
          }
        } else if (cashAfterProjectCost > minCashReserve) {
          const repayCapacity = (cashAfterProjectCost - minCashReserve) * 0.6;
          principalRepayment = Math.min(debtOutstanding, repayCapacity, cashAvailableForDebt);
        }
      }

      month.debtPrincipalOutflow = principalRepayment;
      debtOutstanding -= principalRepayment;

      month.inflow = month.salesInflow + month.debtInflow + month.equityInflow;
      month.outflow = month.paidCost + mandatoryCharges + month.penaltyOutflow + month.debtPrincipalOutflow;
      cash = cashAfterProjectCost - principalRepayment;
      month.inflow = roundMoney(month.inflow);
      month.outflow = roundMoney(month.outflow);
      cash = roundMoney(cash);
      month.balance = cash;
      month.debtOutstanding = debtOutstanding;
      month.stressLevel = stressLevel;
      month.reserveBreach = month.balance < minCashReserve;

      if (debtOutstanding > peakDebtOutstanding) {
        peakDebtOutstanding = debtOutstanding;
      }

      totalCommittedCost += month.committedCost;
      totalDueCost += month.dueCost;
      totalPaidCost += month.paidCost;
      totalPenaltyOutflow += month.penaltyOutflow;
      totalInflow += month.inflow;
      totalOutflow += month.outflow;
      totalSalesInflow += month.salesInflow;
      totalDebtInflow += month.debtInflow;
      totalInterestOutflow += month.interestOutflow;
      totalPrincipalOutflow += month.debtPrincipalOutflow;
      totalStatutoryOutflow += month.statutoryOutflow;
      totalTransactionOutflow += month.transactionOutflow;
      totalDebtDrawFeeOutflow += month.debtDrawFeeOutflow;
      totalCapitalizedInterest += month.capitalizedInterest;

      if (month.balance < 0 && firstNegativeMonth === null) {
        firstNegativeMonth = month.monthIndex + 1;
        month.flags.push('negative-balance');
      }

      if (month.unpaidCarry > 0) {
        month.flags.push('cost-carry-forward');
      }
      if (month.reserveBreach) {
        month.flags.push('reserve-breach');
      }
      if (freezeActive) {
        month.flags.push('reserve-freeze');
      }
      if (hardReserveFreeze) {
        month.flags.push('reserve-breach-freeze');
      }
      if (debtOutstanding >= input.debtLimit) {
        month.flags.push('debt-limit-near');
      }

      if (month.balance < minBalance) {
        minBalance = month.balance;
      }
      if (month.balance < 0) {
        maxDeficit = Math.max(maxDeficit, Math.abs(month.balance));
      }

      const stressTrigger = month.reserveBreach || month.unpaidCarry > 0 || month.balance < 0;
      if (stressTrigger) {
        consecutiveStressMonths += 1;
        currentStressWindow += 1;
        cumulativeLiquidityGap += Math.max(0, minCashReserve - month.balance);
      } else {
        consecutiveStressMonths = 0;
        longestStressWindow = Math.max(longestStressWindow, currentStressWindow);
        currentStressWindow = 0;
      }

      if (month.reserveBreach) {
        consecutiveReserveBreachMonths += 1;
      }

      if (month.unpaidCarry > 0 || month.reserveBreach || month.flags.includes('debt-limit-near')) {
        auditTrace.push({
          monthLabel: month.monthLabel,
          stressLevel,
          unpaidCarry: month.unpaidCarry,
          reserveBreach: month.reserveBreach,
          debtOutstanding: month.debtOutstanding,
          note: month.unpaidCarry > 0
            ? 'Committed costs could not be fully paid; carry-forward applied.'
            : month.reserveBreach
              ? 'Cash balance fell below reserve threshold.'
              : 'Debt outstanding reached lender limit band.',
        });
      }

      const identityBalance = monthOpeningCash + month.inflow - month.outflow;
      const identityDrift = Math.abs(identityBalance - month.balance);
      if (identityDrift > cashIdentityMaxDrift) {
        cashIdentityMaxDrift = identityDrift;
      }
      if (identityDrift > 1) {
        throw new Error(`Cash flow mismatch at ${month.monthLabel}: ${formatINR(identityDrift)} drift.`);
      }

      if (debtOutstanding > (input.debtLimit + 1e-6)) {
        throw new Error(`Debt limit exceeded at ${month.monthLabel}.`);
      }
    });

    longestStressWindow = Math.max(longestStressWindow, currentStressWindow);

    const runwayMonths = firstNegativeMonth || input.projectMonths;
    const recoveredMonth = firstNegativeMonth
      ? months.find(month => month.monthIndex + 1 > firstNegativeMonth && month.balance >= minCashReserve)
      : null;
    const recoveryMonth = recoveredMonth ? recoveredMonth.monthIndex + 1 : null;
    const avgSalesInflow = totalSalesInflow / input.projectMonths;
    const avgSpend = totalOutflow / input.projectMonths;
    const spendMismatchMonths = months.filter(month => month.outflow > month.inflow * 1.2).length;
    const reserveBreachMonths = months.filter(month => month.balance < minCashReserve).length;
    const totalProjectCost = months.reduce((sum, month) => sum + month.paidCost + month.salesCommissionOutflow + month.transactionOutflow + month.debtDrawFeeOutflow + month.interestOutflow + month.penaltyOutflow, 0);
    const actualLtcPct = totalProjectCost > 0 ? (peakDebtOutstanding / totalProjectCost) * 100 : 0;
    const maxLtcPct = totalProjectCost > 0 ? (input.debtLimit / totalProjectCost) * 100 : 0;
    const loanLimitBreach = peakDebtOutstanding > input.debtLimit + 1;
    const debtOverhang = debtOutstanding > 1;

    const leveredCashFlows = months.map(month => {
      const operatingOutflow = month.paidCost + month.salesCommissionOutflow + month.transactionOutflow + month.debtDrawFeeOutflow + month.interestOutflow + month.penaltyOutflow + month.debtPrincipalOutflow;
      return month.salesInflow - operatingOutflow - month.equityInflow;
    });
    if (leveredCashFlows.length) {
      leveredCashFlows[leveredCashFlows.length - 1] += (cash - debtOutstanding + salesStats.overflowReceipts);
    }
    const leveredIrrAnnual = estimateAnnualizedIrr(leveredCashFlows);
    const totalPositive = leveredCashFlows.reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0);
    const totalNegative = Math.abs(leveredCashFlows.reduce((sum, cf) => sum + (cf < 0 ? cf : 0), 0));
    const leveredMoic = totalNegative > 0 ? totalPositive / totalNegative : null;
    let runningPayback = 0;
    let paybackMonth = null;
    leveredCashFlows.forEach((cf, idx) => {
      runningPayback += cf;
      if (paybackMonth === null && runningPayback >= 0) {
        paybackMonth = idx + 1;
      }
    });

    const covenantChecks = {
      loanLimitBreach,
      debtOverhang,
      reserveBreachMonths,
      actualLtcPct,
      maxLtcPct,
      pass: !loanLimitBreach && !debtOverhang && reserveBreachMonths <= Math.max(1, Math.round(input.projectMonths * 0.2)),
    };

    let healthScore = 100;
    if (firstNegativeMonth !== null) healthScore -= 35;
    healthScore -= Math.min(20, (worstDebtShortfall / Math.max(1, totalOutflow)) * 120);
    healthScore -= Math.min(15, Math.max(0, ((avgSpend - avgSalesInflow) / Math.max(1, avgSpend)) * 30));
    healthScore -= Math.min(15, (totalInflow > 0 ? (totalDebtInflow / totalInflow) * 20 : 0));
    healthScore -= Math.min(10, (spendMismatchMonths / Math.max(1, input.projectMonths)) * 18);
    healthScore -= Math.min(10, (totalStressSalesLoss / Math.max(1, totalSalesInflow + totalStressSalesLoss)) * 100);
    healthScore = Math.max(0, Math.round(healthScore));

    const risks = [];
    if (firstNegativeMonth !== null) {
      risks.push(`Negative cash balance appears in Month ${firstNegativeMonth}.`);
    }
    if (worstDebtShortfall > 0) {
      risks.push(`Debt disbursement capacity is insufficient by up to ${formatINR(worstDebtShortfall)} in peak months.`);
    }
    if (reserveBreachMonths > 0) {
      risks.push(`Cash reserve is breached in ${reserveBreachMonths} month(s).`);
    }
    if (totalDueCost - totalPaidCost > 0) {
      risks.push(`Committed cost carry-forward remains ${formatINR(totalDueCost - totalPaidCost)}.`);
    }
    if (salesStats.unsoldArea > input.saleableArea * 0.08) {
      risks.push(`Unsold inventory remains ${Math.round(salesStats.unsoldArea).toLocaleString('en-IN')} sq ft.`);
    }
    if (cashIdentityMaxDrift > 1) {
      risks.push(`Cash flow identity drift detected up to ${formatINR(cashIdentityMaxDrift)}.`);
    }

    const recommendations = [];
    if (firstNegativeMonth !== null) {
      recommendations.push(`Inject ${formatINR(Math.round(maxDeficit * 1.1))} equity before Month ${Math.max(1, firstNegativeMonth - 1)}.`);
      recommendations.push('Phase high-intensity construction packages into smaller tranches until reserve breaches stop.');
      recommendations.push('Renegotiate contractor milestones to reduce upfront due-cost concentration.');
      recommendations.push('Apply targeted pricing/collection strategy in slower sales months to improve early cash conversion.');
    } else {
      recommendations.push('Liquidity remains stable in this simulation. Continue monthly monitoring and rerun with downside scenarios.');
    }

    return {
      assumptions: {
        openingCash: input.openingCash,
        projectMonths: input.projectMonths,
        saleableArea: input.saleableArea,
        salesVelocity: input.salesVelocity,
        debtLimit: input.debtLimit,
        debtRateAnnual: input.debtRateAnnual,
        debtCoveragePct: input.debtCoveragePct,
        salesStartMonth: input.salesStartMonth,
        reserveEnforcement,
        applyFailureMechanics,
        landSchedule: input.landSchedule,
      },
      monthly: months,
      monthlyCashBalance: months.map(month => month.balance),
      firstNegativeMonth,
      maximumDeficit: maxDeficit,
      fundingGap: firstNegativeMonth === null ? 0 : maxDeficit,
      runwayMonths,
      recoveryMonth,
      endingCash: cash,
      endingCashWithOverflow: cash + salesStats.overflowReceipts,
      totalInflow,
      totalOutflow,
      graphData: months.map(month => ({
        month: month.monthLabel,
        inflow: month.inflow,
        outflow: month.outflow,
        balance: month.balance,
      })),
      risks,
      recommendations,
      metrics: {
        avgSalesInflow,
        avgSpend,
        totalInterestOutflow,
        totalPrincipalOutflow,
        totalStatutoryOutflow,
        totalTransactionOutflow,
        totalDebtDrawFeeOutflow,
        totalCapitalizedInterest,
        debtCapInterestSpill,
        debtBlockedByCap,
        cashIdentityMaxDrift,
        totalPenaltyOutflow,
        peakDebtOutstanding,
        healthScore,
        leveredIrrAnnual,
        leveredMoic,
        paybackMonth,
        leveredCashFlows,
        reserveBreachMonths,
        consecutiveReserveBreachMonths,
        totalProjectCost,
        covenantChecks,
        endingDebtOutstanding: debtOutstanding,
        worstDebtShortfall,
        debtDependencyPct: totalInflow > 0 ? (totalDebtInflow / totalInflow) * 100 : 0,
        totalCommittedCost,
        totalDueCost,
        totalPaidCost,
        unpaidCommittedCost: Math.max(0, totalDueCost - totalPaidCost),
        longestStressWindow,
        cumulativeLiquidityGap,
        stressSalesLoss: totalStressSalesLoss,
        soldArea: salesStats.soldArea,
        unsoldArea: salesStats.unsoldArea,
        overflowReceipts: salesStats.overflowReceipts,
        salesCollectionMode: input.salesCollectionMode || 'auto',
        auditTrace,
      },
    };
  }

  function formatINR(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
  }

  window.VorcoCashFlowEngine = {
    simulateCashFlow,
    formatINR,
  };
})();
