const form = document.getElementById('cashFlowForm');
const advancedPanel = document.getElementById('advancedPanel');
const resultsPanel = document.getElementById('resultsPanel');
const submitButton = form ? form.querySelector('button[type="submit"]') : null;
const productMode = document.getElementById('productMode');
const reserveEnforcementSelect = document.getElementById('reserveEnforcement');
const applyFailureMechanicsInput = document.getElementById('applyFailureMechanics');
const salesCollectionModeSelect = document.getElementById('salesCollectionMode');
const manualSalesInflowsInput = document.getElementById('manualSalesInflows');
const statusCard = document.getElementById('statusCard');

const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const runwayValue = document.getElementById('runwayValue');
const negativeMonthValue = document.getElementById('negativeMonthValue');
const fundingGapValue = document.getElementById('fundingGapValue');
const maxDeficitValue = document.getElementById('maxDeficitValue');
const recoveryMonthValue = document.getElementById('recoveryMonthValue');
const endingCashValue = document.getElementById('endingCashValue');
const totalInflowValue = document.getElementById('totalInflowValue');
const totalOutflowValue = document.getElementById('totalOutflowValue');
const interestCostValue = document.getElementById('interestCostValue');
const endingDebtValue = document.getElementById('endingDebtValue');
const debtDependencyValue = document.getElementById('debtDependencyValue');
const avgSalesValue = document.getElementById('avgSalesValue');
const healthScoreValue = document.getElementById('healthScoreValue');
const peakDebtValue = document.getElementById('peakDebtValue');
const decisionRunwayValue = document.getElementById('decisionRunwayValue');
const decisionNegativeMonthValue = document.getElementById('decisionNegativeMonthValue');
const decisionFundingGapValue = document.getElementById('decisionFundingGapValue');
const goNoGoBadge = document.getElementById('goNoGoBadge');
const failureRiskBadge = document.getElementById('failureRiskBadge');
const failureRiskMonth = document.getElementById('failureRiskMonth');
const failureRiskPeakDeficit = document.getElementById('failureRiskPeakDeficit');
const failureRiskUnderwaterMonths = document.getElementById('failureRiskUnderwaterMonths');
const failureRiskEndingCash = document.getElementById('failureRiskEndingCash');
const commitmentCommitted = document.getElementById('commitmentCommitted');
const commitmentDue = document.getElementById('commitmentDue');
const commitmentPaid = document.getElementById('commitmentPaid');
const commitmentUnpaid = document.getElementById('commitmentUnpaid');
const commitmentTableBody = document.getElementById('commitmentTableBody');
const monteFailureProb = document.getElementById('monteFailureProb');
const monteP50Gap = document.getElementById('monteP50Gap');
const monteP90Gap = document.getElementById('monteP90Gap');
const monteRunCount = document.getElementById('monteRunCount');
const monteBandsBody = document.getElementById('monteBandsBody');
const runIdValue = document.getElementById('runIdValue');
const assumptionDiffValue = document.getElementById('assumptionDiffValue');
const auditTraceCountValue = document.getElementById('auditTraceCountValue');
const confidenceBandValue = document.getElementById('confidenceBandValue');
const auditTraceBody = document.getElementById('auditTraceBody');
const directionText = document.getElementById('directionText');
const sensitivityBody = document.getElementById('sensitivityBody');
const topSensitivityDriver = document.getElementById('topSensitivityDriver');
const monthlyBridgeTotal = document.getElementById('monthlyBridgeTotal');
const monthlyBridgeMonths = document.getElementById('monthlyBridgeMonths');
const monthlyBridgePeak = document.getElementById('monthlyBridgePeak');
const monthlyBridgeFirst = document.getElementById('monthlyBridgeFirst');
const monthlyFundingView = document.getElementById('monthlyFundingView');
const monthlySupportMode = document.getElementById('monthlySupportMode');
const monthlyFundingBody = document.getElementById('monthlyFundingBody');
const monthlyNeedOnlyCount = document.getElementById('monthlyNeedOnlyCount');
const monthlyNeedOnlyTotal = document.getElementById('monthlyNeedOnlyTotal');
const monthlyNeedOnlyWindow = document.getElementById('monthlyNeedOnlyWindow');
const monthlyNeedOnlyBody = document.getElementById('monthlyNeedOnlyBody');
const bridgeNeedBars = document.getElementById('bridgeNeedBars');
const bridgeCumulativeBars = document.getElementById('bridgeCumulativeBars');
const p50BridgeTotal = document.getElementById('p50BridgeTotal');
const p90BridgeTotal = document.getElementById('p90BridgeTotal');
const stressBridgeBody = document.getElementById('stressBridgeBody');
const auditIrrValue = document.getElementById('auditIrrValue');
const auditLtcValue = document.getElementById('auditLtcValue');
const auditReserveValue = document.getElementById('auditReserveValue');
const auditDebtValue = document.getElementById('auditDebtValue');
const auditOverallBadge = document.getElementById('auditOverallBadge');
const auditChecklist = document.getElementById('auditChecklist');
const investorReportContent = document.getElementById('investorReportContent');
const printSummaryBtn = document.getElementById('printSummaryBtn');
const truthStatement = document.getElementById('truthStatement');
const decisionHeadline = document.getElementById('decisionHeadline');
const decisionDetail = document.getElementById('decisionDetail');
const rootCauseList = document.getElementById('rootCauseList');
const fixOptionList = document.getElementById('fixOptionList');
const summaryText = document.getElementById('summaryText');

const actionEquity = document.getElementById('actionEquity');
const actionTimeline = document.getElementById('actionTimeline');
const actionSales = document.getElementById('actionSales');

const chartBars = document.getElementById('chartBars');
const bridgeChartBars = document.getElementById('bridgeChartBars');
const cumulativeChartBars = document.getElementById('cumulativeChartBars');
const debtChartBars = document.getElementById('debtChartBars');
const chartRangeSelect = document.getElementById('chartRangeSelect');
const seriesToggleGroup = document.getElementById('seriesToggleGroup');
const riskList = document.getElementById('riskList');
const criticalMonthsBody = document.getElementById('criticalMonthsBody');

let latestResult = null;
let latestInput = null;
let latestMonteCarlo = null;
let latestRunId = null;
let previousAssumptionSnapshot = null;
let scenarioCache = new Map();
const ENABLE_FULL_REPORTING = true;

const GUJARAT_MODEL = {
  defaultProjectMonths: 30,
  defaultDebtRateAnnual: 0.118,
  defaultDebtCoveragePct: 0.62,
  defaultLandUpfrontPct: 55,
  approvalCostPctOfLand: 0.045,
  softCostPctOfConstructionAnnual: 0.095,
  salesAbsorptionMultiplier: 1,
  salesCommissionPct: 0.022,
  cancellationPct: 0.02,
  annualPriceEscalationPct: 0.04,
  reserveMonths: 3,
  paymentPlan: {
    mode: 'construction-linked',
    bookingPct: 10,
    possessionPct: 20,
    milestones: [
      { name: 'Plinth', triggerProgress: 0.18, pct: 10 },
      { name: 'RCC Frame', triggerProgress: 0.45, pct: 25 },
      { name: 'Brickwork', triggerProgress: 0.65, pct: 20 },
      { name: 'Finishing', triggerProgress: 0.85, pct: 15 }
    ]
  }
};

function readNumber(id) {
  const raw = document.getElementById(id).value;
  if (raw === '' || raw === null || raw === undefined) {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric input for ${id}.`);
  }
  return parsed;
}

function readRequiredNumber(id, label, allowZero = false) {
  const raw = document.getElementById(id).value;
  if (raw === '' || raw === null || raw === undefined) {
    throw new Error(`${label} is required.`);
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric input for ${label}.`);
  }
  if (!allowZero && parsed <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
  if (allowZero && parsed < 0) {
    throw new Error(`${label} cannot be negative.`);
  }
  return parsed;
}

function readNumberOrDefault(id, fallback) {
  const value = readNumberOrNull(id);
  return value === null ? fallback : value;
}

function readNumberOrNull(id) {
  const raw = document.getElementById(id).value;
  if (raw === '' || raw === null || raw === undefined) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function speedMultiplier(speed, multipliers = {}) {
  const slow = Number(multipliers.slow ?? 0.7);
  const normal = Number(multipliers.normal ?? 1);
  const fast = Number(multipliers.fast ?? 1.35);
  if (speed === 'slow') return slow;
  if (speed === 'fast') return fast;
  return normal;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toMonthIndex(monthValue) {
  const monthNumber = Number(monthValue || 0);
  if (!Number.isFinite(monthNumber) || monthNumber <= 0) {
    return 0;
  }
  return Math.max(0, Math.round(monthNumber) - 1);
}

function parseManualSalesInflows(raw, projectMonths) {
  if (!raw || !raw.trim()) {
    return [];
  }

  const tokens = raw
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean);
  const series = Array.from({ length: projectMonths }, () => 0);

  tokens.slice(0, projectMonths).forEach((token, idx) => {
    const value = Number(token);
    if (!Number.isFinite(value) || value < 0) {
      throw new Error('Manual monthly sales inflows must be non-negative numbers.');
    }
    series[idx] = value;
  });

  return series;
}

function buildConstructionPhases(totalConstructionCost, projectMonths) {
  const structureDuration = Math.max(4, Math.round(projectMonths * 0.45));
  const mepDuration = Math.max(3, Math.round(projectMonths * 0.3));
  const finishingDuration = Math.max(3, Math.round(projectMonths * 0.3));

  return [
    {
      name: 'Structure',
      startMonth: 0,
      duration: structureDuration,
      cost: totalConstructionCost * 0.55,
      curve: 'linear'
    },
    {
      name: 'MEP',
      startMonth: Math.max(2, Math.round(projectMonths * 0.38) - 1),
      duration: mepDuration,
      cost: totalConstructionCost * 0.2,
      curve: 'back'
    },
    {
      name: 'Finishing',
      startMonth: Math.max(5, Math.round(projectMonths * 0.55) - 1),
      duration: finishingDuration,
      cost: totalConstructionCost * 0.25,
      curve: 'back'
    }
  ];
}

function buildLandSchedule(landTotalCost, upfrontPct, balanceMonthIndex) {
  const upfront = landTotalCost * (clamp(upfrontPct, 0, 100) / 100);
  const balance = Math.max(0, landTotalCost - upfront);

  const schedule = [{ month: 0, amount: upfront }];
  if (balance > 0) {
    schedule.push({ month: Math.max(0, Math.round(balanceMonthIndex)), amount: balance });
  }

  return schedule;
}

function readInputs() {
  const profile = GUJARAT_MODEL;
  const mode = productMode?.value || 'simple';
  const isSimpleMode = mode === 'simple';
  const saleableArea = readRequiredNumber('saleableArea', 'Saleable area');
  const pricePerSqft = readRequiredNumber('pricePerSqft', 'Sale price / sq ft');
  const constructionCostPerSqft = readRequiredNumber('constructionCostPerSqft', 'Construction cost / sq ft');
  const landTotalCost = readRequiredNumber('landTotalCost', 'Land cost', true);
  const openingCash = readRequiredNumber('openingCash', 'Starting cash', true);
  const salesStartMonth = readRequiredNumber('salesStartMonth', 'Sales start month', true);
  const salesSpeed = document.getElementById('salesSpeed').value;
  const speedMultipliers = {
    slow: Math.max(0.2, readNumberOrDefault('salesSpeedSlowMultiplier', 0.7)),
    normal: Math.max(0.2, readNumberOrDefault('salesSpeedNormalMultiplier', 1)),
    fast: Math.max(0.2, readNumberOrDefault('salesSpeedFastMultiplier', 1.35)),
  };

  const projectMonthsInput = isSimpleMode ? null : readNumberOrNull('projectMonths');
  const projectMonths = projectMonthsInput === null ? profile.defaultProjectMonths : Math.max(1, Math.round(projectMonthsInput));
  const totalConstructionCost = saleableArea * constructionCostPerSqft;
  const debtLimitInput = isSimpleMode ? null : readNumberOrNull('debtLimit');
  const debtRateInput = isSimpleMode ? null : readNumberOrNull('debtRate');
  const debtCoverageInput = isSimpleMode ? null : readNumberOrNull('debtCoverage');
  const debtLimit = debtLimitInput === null ? (landTotalCost + totalConstructionCost) * 0.43 : Math.max(0, debtLimitInput);
  const debtRateAnnual = debtRateInput === null ? profile.defaultDebtRateAnnual : Math.max(0, debtRateInput / 100);
  const debtCoveragePct = debtCoverageInput === null ? profile.defaultDebtCoveragePct : Math.max(0, debtCoverageInput / 100);
  const disbursementLagMonths = isSimpleMode ? 1 : Math.max(0, Math.round(readNumberOrDefault('disbursementLagMonths', 1)));
  const moratoriumMonths = isSimpleMode ? 6 : Math.max(0, Math.round(readNumberOrDefault('moratoriumMonths', 6)));
  const repaymentMode = isSimpleMode ? 'cash-sweep' : (document.getElementById('repaymentMode').value || 'cash-sweep');
  const baseSoftCostsInput = isSimpleMode ? null : readNumberOrNull('baseSoftCosts');
  const baseSoftCosts = baseSoftCostsInput === null
    ? (totalConstructionCost * profile.softCostPctOfConstructionAnnual) / 12
    : Math.max(0, baseSoftCostsInput);
  const monthlyStatutoryCosts = isSimpleMode ? 0 : Math.max(0, readNumberOrDefault('monthlyStatutoryCosts', 0));
  const statutoryEscalationPct = isSimpleMode ? 0 : Math.max(0, readNumberOrDefault('statutoryEscalationPct', 0) / 100);
  const transactionFeePct = isSimpleMode ? 0 : Math.max(0, readNumberOrDefault('transactionFeePct', 0) / 100);
  const debtDrawFeePct = isSimpleMode ? 0 : Math.max(0, readNumberOrDefault('debtDrawFeePct', 0) / 100);
  const landUpfrontPctInput = isSimpleMode ? null : readNumberOrNull('landUpfrontPct');
  const landBalanceMonthInput = isSimpleMode ? null : readNumberOrNull('landBalanceMonth');
  const approvalCostInput = isSimpleMode ? null : readNumberOrNull('approvalCost');
  const approvalMonthInput = isSimpleMode ? null : readNumberOrNull('approvalMonth');
  const landUpfrontPct = landUpfrontPctInput === null ? profile.defaultLandUpfrontPct : clamp(landUpfrontPctInput, 0, 100);
  const landBalanceMonth = landBalanceMonthInput === null ? Math.round(projectMonths * 0.25) : Math.max(0, Math.round(landBalanceMonthInput));
  const approvalCost = approvalCostInput === null ? landTotalCost * profile.approvalCostPctOfLand : Math.max(0, approvalCostInput);
  const approvalMonth = approvalMonthInput === null ? 1 : Math.max(0, Math.round(approvalMonthInput));
  const delayMonths = isSimpleMode ? 0 : Math.max(0, Math.round(readNumberOrDefault('delayMonths', 0)));
  const collectionLagMonths = isSimpleMode ? 1 : Math.max(0, Math.round(readNumberOrDefault('collectionLagMonths', 1)));
  const collectionEfficiencyPct = isSimpleMode ? 0.94 : clamp(readNumberOrDefault('collectionEfficiencyPct', 94) / 100, 0.5, 1);
  const collectionDefaultPct = isSimpleMode ? 0.02 : clamp(readNumberOrDefault('collectionDefaultPct', 2) / 100, 0, 0.25);
  const salesSlowdownPct = isSimpleMode ? 0 : clamp(readNumberOrDefault('salesSlowdown', 0) / 100, 0, 1);
  const costEscalationPct = isSimpleMode ? 0.04 : Math.max(0, readNumberOrDefault('costEscalation', 4) / 100);

  const activeSalesMonths = Math.max(6, projectMonths - salesStartMonth - 2);
  const baseVelocity = saleableArea / activeSalesMonths;
  const salesVelocity = baseVelocity * speedMultiplier(salesSpeed, speedMultipliers) * profile.salesAbsorptionMultiplier;

  const advancedEquityTopup = isSimpleMode ? 0 : readNumberOrDefault('equityTopup', 0);
  const advancedEquityTopupMonth = isSimpleMode ? 0 : (toMonthIndex(readNumberOrDefault('equityTopupMonth', 0)) + delayMonths);
  const salesStartMonthIndex = toMonthIndex(salesStartMonth);
  const landBalanceMonthIndex = toMonthIndex(landBalanceMonth) + delayMonths;
  const approvalMonthIndex = toMonthIndex(approvalMonth) + delayMonths;
  const reserveEnforcement = reserveEnforcementSelect?.value || 'hard';
  const applyFailureMechanics = Boolean(applyFailureMechanicsInput?.checked ?? true);
  const salesCollectionMode = salesCollectionModeSelect?.value || 'auto';
  const manualSalesInflows = parseManualSalesInflows(manualSalesInflowsInput?.value || '', projectMonths);

  const equitySchedule = [];
  if (advancedEquityTopup > 0) {
    equitySchedule.push({ month: advancedEquityTopupMonth, amount: advancedEquityTopup });
  }

  return {
    isReady: saleableArea > 0 && pricePerSqft > 0 && constructionCostPerSqft > 0,
    openingCash,
    landTotalCost,
    projectMonths,
    saleableArea,
    pricePerSqft,
    constructionCostPerSqft,
    salesVelocity,
    salesStartMonth,
    salesStartMonthIndex,
    debtLimit,
    debtRateAnnual,
    debtCoveragePct,
    disbursementLagMonths,
    moratoriumMonths,
    repaymentMode,
    baseSoftCosts,
    monthlyStatutoryCosts,
    statutoryEscalationPct,
    transactionFeePct,
    debtDrawFeePct,
    reserveEnforcement,
    applyFailureMechanics,
    salesCollectionMode,
    manualSalesInflows,
    speedMultipliers,
    minCashReserve: baseSoftCosts * profile.reserveMonths,
    delayMonths,
    collectionLagMonths,
    collectionEfficiencyPct,
    collectionDefaultPct,
    salesSlowdownPct,
    costEscalationPct,
    interestIncreasePct: 0,
    landSchedule: buildLandSchedule(landTotalCost, landUpfrontPct, landBalanceMonthIndex),
    constructionPhases: buildConstructionPhases(totalConstructionCost, projectMonths),
    softCostSchedule: [{ month: approvalMonthIndex, amount: approvalCost }],
    equitySchedule,
    salesCommissionPct: profile.salesCommissionPct,
    cancellationPct: profile.cancellationPct,
    annualPriceEscalationPct: profile.annualPriceEscalationPct,
    salesCurveType: 'gujarat-ramp',
    productMode: mode,
    paymentPlan: {
      mode: profile.paymentPlan.mode,
      bookingPct: profile.paymentPlan.bookingPct,
      possessionPct: profile.paymentPlan.possessionPct,
      milestones: profile.paymentPlan.milestones
    }
  };
}

function renderList(node, items) {
  node.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    node.appendChild(li);
  });
}

function renderBulletList(node, items) {
  node.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    node.appendChild(li);
  });
}

function renderEmptyState(input) {
  const baseMessage = 'Fill the main inputs, then click Analyze Project.';
  truthStatement.textContent = baseMessage;
  decisionHeadline.textContent = 'No result yet';
  decisionDetail.textContent = 'You will see monthly cash need and the best next actions.';
  if (statusBadge && statusText) {
    statusBadge.textContent = 'Waiting for inputs';
    statusBadge.style.background = 'rgba(154, 106, 34, 0.18)';
    statusBadge.style.color = 'var(--warn)';
    statusText.textContent = 'The decision engine is idle until the core fields are set.';
  }

  decisionRunwayValue.textContent = 'NA';
  decisionNegativeMonthValue.textContent = 'NA';
  decisionFundingGapValue.textContent = 'NA';
  failureRiskMonth.textContent = 'NA';
  failureRiskPeakDeficit.textContent = 'NA';
  failureRiskUnderwaterMonths.textContent = 'NA';
  failureRiskEndingCash.textContent = 'NA';
  if (failureRiskBadge) {
    failureRiskBadge.textContent = 'Awaiting analysis';
    failureRiskBadge.classList.remove('is-danger', 'is-safe');
  }
  monthlyBridgeTotal.textContent = 'NA';
  monthlyBridgeMonths.textContent = 'NA';
  monthlyBridgePeak.textContent = 'NA';
  monthlyBridgeFirst.textContent = 'NA';
  monthlyFundingBody.innerHTML = '<tr><td colspan="8">Click Analyze Project to load this table.</td></tr>';
  monthlyNeedOnlyCount.textContent = 'NA';
  monthlyNeedOnlyTotal.textContent = 'NA';
  monthlyNeedOnlyWindow.textContent = 'NA';
  monthlyNeedOnlyBody.innerHTML = '<tr><td colspan="8">Click Analyze Project to load this table.</td></tr>';
  if (commitmentCommitted) commitmentCommitted.textContent = 'NA';
  if (commitmentDue) commitmentDue.textContent = 'NA';
  if (commitmentPaid) commitmentPaid.textContent = 'NA';
  if (commitmentUnpaid) commitmentUnpaid.textContent = 'NA';
  if (commitmentTableBody) commitmentTableBody.innerHTML = '<tr><td colspan="6">Click Analyze Project to load commitment tracking.</td></tr>';
  if (monteFailureProb) monteFailureProb.textContent = 'NA';
  if (monteP50Gap) monteP50Gap.textContent = 'NA';
  if (monteP90Gap) monteP90Gap.textContent = 'NA';
  if (monteRunCount) monteRunCount.textContent = 'NA';
  if (monteBandsBody) monteBandsBody.innerHTML = '<tr><td colspan="4">Click Analyze Project to run probabilistic risk bands.</td></tr>';
  if (runIdValue) runIdValue.textContent = 'NA';
  if (assumptionDiffValue) assumptionDiffValue.textContent = 'NA';
  if (auditTraceCountValue) auditTraceCountValue.textContent = 'NA';
  if (confidenceBandValue) confidenceBandValue.textContent = 'NA';
  if (auditTraceBody) auditTraceBody.innerHTML = '<tr><td colspan="5">Click Analyze Project to generate trace events.</td></tr>';
  if (directionText) directionText.textContent = 'Run analysis to see recommended next direction.';
  bridgeNeedBars.innerHTML = '<p class="mini-note">Click Analyze Project to see the monthly bridge bars.</p>';
  bridgeCumulativeBars.innerHTML = '<p class="mini-note">Click Analyze Project to see cumulative bridge bars.</p>';
  p50BridgeTotal.textContent = 'NA';
  p90BridgeTotal.textContent = 'NA';
  stressBridgeBody.innerHTML = '<tr><td colspan="6">Click Analyze Project to load stress scenario rows.</td></tr>';
  auditIrrValue.textContent = 'NA';
  auditLtcValue.textContent = 'NA';
  auditReserveValue.textContent = 'NA';
  auditDebtValue.textContent = 'NA';
  auditOverallBadge.textContent = 'Click Analyze Project to run model checks.';
  auditChecklist.innerHTML = '<li>Click Analyze Project to validate model checks.</li>';

  runwayValue.textContent = 'NA';
  negativeMonthValue.textContent = 'NA';
  fundingGapValue.textContent = 'NA';
  maxDeficitValue.textContent = 'NA';
  recoveryMonthValue.textContent = 'NA';
  endingCashValue.textContent = 'NA';
  totalInflowValue.textContent = 'NA';
  totalOutflowValue.textContent = 'NA';
  interestCostValue.textContent = 'NA';
  endingDebtValue.textContent = 'NA';
  debtDependencyValue.textContent = 'NA';
  avgSalesValue.textContent = 'NA';
  healthScoreValue.textContent = 'NA';
  peakDebtValue.textContent = 'NA';

  if (riskList) {
    renderList(riskList, ['No result yet.']);
  }
  rootCauseList.innerHTML = '<li>Fill main inputs to see what is causing the gap.</li>';
  fixOptionList.innerHTML = `
    <article class="fix-card">
      <h3>N/A until inputs are entered.</h3>
      <p>The model will test equity, delay, and sales collection changes after the base case is ready.</p>
    </article>
  `;
  summaryText.textContent = 'No result yet.';
  if (ENABLE_FULL_REPORTING && investorReportContent) {
    investorReportContent.innerHTML = `
    <section class="investor-empty">
      <p class="cover-kicker">Investor-Facing Export</p>
      <p class="investor-empty__brand">OPTIBUILD | VORCO</p>
      <h4>Investment Memorandum Snapshot</h4>
      <p class="cover-copy">Enter core inputs to generate the investor pack. The report will show truth, why, fixes, and detailed underwriting after the base case is ready.</p>
      <div class="investor-empty-grid">
        <article class="cover-tile"><p>Project</p><strong>N/A</strong></article>
        <article class="cover-tile"><p>Location</p><strong>N/A</strong></article>
        <article class="cover-tile"><p>Recommendation</p><strong>N/A</strong></article>
        <article class="cover-tile"><p>ROI / Margin</p><strong>N/A</strong></article>
        <article class="cover-tile"><p>Risk Posture</p><strong>N/A</strong></article>
        <article class="cover-tile"><p>Version / Run ID</p><strong>N/A</strong></article>
      </div>
    </section>
  `;
  }
  if (chartBars) {
    chartBars.innerHTML = '<p class="mini-note">Click Analyze Project to render this chart.</p>';
  }
  if (bridgeChartBars) {
    bridgeChartBars.innerHTML = '<p class="mini-note">Click Analyze Project to render this chart.</p>';
  }
  if (cumulativeChartBars) {
    cumulativeChartBars.innerHTML = '<p class="mini-note">Click Analyze Project to render this chart.</p>';
  }
  if (debtChartBars) {
    debtChartBars.innerHTML = '<p class="mini-note">Click Analyze Project to render this chart.</p>';
  }
  if (criticalMonthsBody) {
    criticalMonthsBody.innerHTML = '<tr><td colspan="4">N/A</td></tr>';
  }
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return 'N/A';
  return window.VorcoCashFlowEngine.formatINR(value);
}

function formatPercent(value, digits = 1) {
  if (!Number.isFinite(value)) return 'N/A';
  return `${value.toFixed(digits)}%`;
}

function formatFixed(value, digits = 2) {
  return Number.isFinite(value) ? Number(value).toFixed(digits) : 'N/A';
}

function formatCompactMoney(value) {
  if (!Number.isFinite(value)) return 'N/A';
  if (Math.abs(value) < 1) return '₹0';
  return window.VorcoCashFlowEngine.formatINR(value);
}

function sumMonthly(monthly, key) {
  return monthly.reduce((sum, row) => sum + Number(row[key] || 0), 0);
}

function isInputReady(input) {
  return Number(input.saleableArea || 0) > 0 && Number(input.pricePerSqft || 0) > 0 && Number(input.constructionCostPerSqft || 0) > 0;
}

function getMissingCoreInputs(input) {
  const missing = [];
  if (!(Number(input.saleableArea || 0) > 0)) missing.push('Saleable area');
  if (!(Number(input.pricePerSqft || 0) > 0)) missing.push('Sale price / sq ft');
  if (!(Number(input.constructionCostPerSqft || 0) > 0)) missing.push('Construction cost / sq ft');
  return missing;
}

function setAnalyzingState(isAnalyzing) {
  if (!submitButton) return;
  submitButton.disabled = isAnalyzing;
  submitButton.textContent = isAnalyzing ? 'Analyzing...' : 'Analyze Project';
}

function cloneInput(input) {
  return JSON.parse(JSON.stringify(input || {}));
}

function stableSerialize(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return 'null';
    if (Object.is(value, -0)) return '0';
    return Number(value).toPrecision(15).replace(/(?:\.0+|(?:(\.\d*?[1-9])0+))$/, '$1');
  }
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) {
    return `[${value.map(item => stableSerialize(item)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`;
}

function simulateScenario(input, mutate) {
  const scenario = cloneInput(input);
  mutate(scenario);
  const key = stableSerialize(scenario);
  if (scenarioCache.has(key)) {
    return scenarioCache.get(key);
  }
  const output = window.VorcoCashFlowEngine.simulateCashFlow(scenario);
  scenarioCache.set(key, output);
  return output;
}

function optionFeasibility(title) {
  const model = {
    'No intervention required': 0.98,
    'Equity injection': 0.55,
    'Delay one phase': 0.6,
    'Increase booking %': 0.66,
    'Phase construction packages': 0.75,
    'Reduce scope and soft-cost intensity': 0.65,
    'Renegotiate contractor/commercial terms': 0.72,
    'Pricing + collection strategy': 0.68,
    'Combined: Equity + Booking': 0.58,
    'Combined: Phase + Pricing': 0.64,
    'Combined: Equity + Phase': 0.62,
  };
  if (model[title] !== undefined) return model[title];
  return 0.6;
}

function scenarioRiskScore(result) {
  const breach = Number(result.metrics?.reserveBreachMonths || 0);
  const stress = Number(result.metrics?.longestStressWindow || 0);
  const debtOverhang = Number(result.metrics?.endingDebtOutstanding || 0);
  const base = Number(result.metrics?.healthScore || 0);
  const penalty = Math.min(30, breach * 1.8) + Math.min(25, stress * 1.2) + Math.min(20, debtOverhang > 0 ? 20 : 0);
  return Math.max(0, Math.min(100, base - penalty));
}

function buildRootCauseBreakdown(result) {
  const deficitMonths = (result.monthly || []).filter(month => month.balance < 0 || month.outflow > month.inflow);
  if (!deficitMonths.length) {
    return [{ label: 'No failure detected in the modeled horizon', share: 100, amount: 0 }];
  }
  const timingMismatch = deficitMonths.reduce((sum, month) => {
    const operatingNeed = month.dueCost || (month.landOutflow + month.constructionOutflow + month.softOutflow + month.statutoryOutflow);
    return sum + Math.max(0, operatingNeed - month.paidCost);
  }, 0);
  const insufficientFunding = deficitMonths.reduce((sum, month) => {
    const available = month.salesInflow + month.equityInflow + month.debtInflow;
    return sum + Math.max(0, (month.paidCost + month.interestOutflow + month.debtPrincipalOutflow) - available);
  }, 0);
  const excessiveCost = deficitMonths.reduce((sum, month) => {
    return sum + (month.interestOutflow + month.debtDrawFeeOutflow + month.transactionOutflow + month.penaltyOutflow + month.salesLossFromStress);
  }, 0);

  const raw = [
    { label: 'Timing mismatch (committed cost not payable on schedule)', value: timingMismatch },
    { label: 'Insufficient funding (available inflow below payable need)', value: insufficientFunding },
    { label: 'Excessive cost load (finance, penalty, stress leakage)', value: excessiveCost },
  ];
  const total = raw.reduce((sum, item) => sum + item.value, 0) || 1;

  return raw
    .map(item => ({
      label: item.label,
      share: Math.round((item.value / total) * 100),
      amount: item.value,
    }))
    .sort((left, right) => right.share - left.share);
}

function buildRecommendationOptions(baseInput, baseResult) {
  if (!isInputReady(baseInput)) {
    return [];
  }

  if (baseResult.firstNegativeMonth === null) {
    return [{
      title: 'No intervention required',
      result: baseResult,
      headline: 'The base case stays cash-positive through the modeled horizon.',
      note: 'Keep assumptions unchanged and monitor monthly.',
      gapChange: 0,
      runwayChange: 0,
      weightedScore: 100,
    }];
  }

  const equityNeeded = Math.max(0, Math.ceil(baseResult.maximumDeficit * 1.08));
  const tranchePlan = buildBridgeTranches(baseResult, equityNeeded);
  const equityScenario = simulateScenario(baseInput, scenario => {
    scenario.equitySchedule = Array.isArray(scenario.equitySchedule) ? scenario.equitySchedule.slice() : [];
    tranchePlan.forEach(tranche => {
      scenario.equitySchedule.push({ month: tranche.month, amount: tranche.amount });
    });
  });

  const delayStepMonths = 2;
  const delayScenario = simulateScenario(baseInput, scenario => {
    const nextDelay = Number(scenario.delayMonths || 0) + delayStepMonths;
    scenario.delayMonths = nextDelay;
    scenario.costEscalationPct = Math.max(Number(scenario.costEscalationPct || 0), 0.01 + (0.012 * delayStepMonths));
    scenario.salesSlowdownPct = clamp(Number(scenario.salesSlowdownPct || 0) + (0.02 * delayStepMonths), 0, 0.9);
    scenario.interestIncreasePct = Number(scenario.interestIncreasePct || 0) + (0.01 * delayStepMonths);
  });

  const bookingScenario = simulateScenario(baseInput, scenario => {
    const paymentPlan = scenario.paymentPlan ? { ...scenario.paymentPlan } : { bookingPct: 10, possessionPct: 20, milestones: [] };
    paymentPlan.bookingPct = Math.min(25, Number(paymentPlan.bookingPct || 0) + 5);
    scenario.paymentPlan = paymentPlan;
  });

  const phaseScenario = simulateScenario(baseInput, scenario => {
    scenario.constructionPhases = (scenario.constructionPhases || []).map((phase, index) => {
      if (index === 0) {
        return { ...phase, duration: Math.max(phase.duration, Math.round(phase.duration * 1.2)) };
      }
      return phase;
    });
  });

  const scopeScenario = simulateScenario(baseInput, scenario => {
    scenario.constructionPhases = (scenario.constructionPhases || []).map(phase => ({
      ...phase,
      cost: Number(phase.cost || 0) * 0.93,
    }));
    scenario.baseSoftCosts = Number(scenario.baseSoftCosts || 0) * 0.96;
  });

  const contractorScenario = simulateScenario(baseInput, scenario => {
    scenario.transactionFeePct = Math.max(0, Number(scenario.transactionFeePct || 0) - 0.0025);
    scenario.costEscalationPct = Math.max(0, Number(scenario.costEscalationPct || 0) - 0.01);
  });

  const pricingScenario = simulateScenario(baseInput, scenario => {
    scenario.pricePerSqft = Number(scenario.pricePerSqft || 0) * 1.04;
    const plan = { ...(scenario.paymentPlan || {}) };
    plan.bookingPct = Math.min(28, Number(plan.bookingPct || 10) + 3);
    scenario.paymentPlan = plan;
  });

  const options = [
    {
      title: 'Equity injection',
      result: equityScenario,
      headline: equityScenario.firstNegativeMonth === null
        ? 'Removes the cash gap completely.'
        : `Improves the gap to ${formatCompactMoney(equityScenario.maximumDeficit)}.`,
      note: tranchePlan.length
        ? `Add ${formatCompactMoney(equityNeeded)} in phases: ${tranchePlan.map(tranche => `M${tranche.month + 1}`).join(', ')}.`
        : `Inject ${formatCompactMoney(equityNeeded)} as bridge capital.`,
    },
    {
      title: 'Delay one phase',
      result: delayScenario,
      headline: delayScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Reduces the deficit by ${formatCompactMoney(baseResult.maximumDeficit - delayScenario.maximumDeficit)}.`
        : 'Adds time but does not reduce the cash gap enough.',
      note: 'Move one construction phase by 2 months and run again.',
    },
    {
      title: 'Increase booking %',
      result: bookingScenario,
      headline: bookingScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Reduces the deficit by ${formatCompactMoney(baseResult.maximumDeficit - bookingScenario.maximumDeficit)}.`
        : 'Earlier collections help but do not close the full gap.',
      note: 'Increase booking collections by 5% and run again.',
    },
    {
      title: 'Phase construction packages',
      result: phaseScenario,
      headline: phaseScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Reduces peak deficit by ${formatCompactMoney(baseResult.maximumDeficit - phaseScenario.maximumDeficit)}.`
        : 'Spreads execution but does not remove the full gap.',
      note: 'Extend high-intensity phase duration to smooth monthly commitments.',
    },
    {
      title: 'Reduce scope and soft-cost intensity',
      result: scopeScenario,
      headline: scopeScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Improves deficit by ${formatCompactMoney(baseResult.maximumDeficit - scopeScenario.maximumDeficit)}.`
        : 'Scope reduction impact is limited under current debt limits.',
      note: 'Cut build scope and overhead spend to reduce commitment pressure.',
    },
    {
      title: 'Renegotiate contractor/commercial terms',
      result: contractorScenario,
      headline: contractorScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Lowers financing pressure by ${formatCompactMoney(baseResult.maximumDeficit - contractorScenario.maximumDeficit)}.`
        : 'Commercial renegotiation alone is not enough in this case.',
      note: 'Target lower escalation and fee drag via contract reset.',
    },
    {
      title: 'Pricing + collection strategy',
      result: pricingScenario,
      headline: pricingScenario.maximumDeficit < baseResult.maximumDeficit
        ? `Cuts deficit by ${formatCompactMoney(baseResult.maximumDeficit - pricingScenario.maximumDeficit)}.`
        : 'Pricing support helps, but structural cost timing remains.',
      note: 'Lift effective realization and booking capture in early months.',
    },
  ];

  const equityBookingScenario = simulateScenario(baseInput, scenario => {
    const bookingPct = Number(scenario.paymentPlan?.bookingPct || 10);
    const tranchePlanLocal = buildBridgeTranches(baseResult, Math.max(0, Math.ceil(baseResult.maximumDeficit * 0.9)));
    scenario.equitySchedule = Array.isArray(scenario.equitySchedule) ? scenario.equitySchedule.slice() : [];
    tranchePlanLocal.forEach(tranche => scenario.equitySchedule.push({ month: tranche.month, amount: tranche.amount }));
    scenario.paymentPlan = { ...(scenario.paymentPlan || {}), bookingPct: Math.min(25, bookingPct + 4) };
  });

  const phasePricingScenario = simulateScenario(baseInput, scenario => {
    scenario.constructionPhases = (scenario.constructionPhases || []).map((phase, idx) => {
      if (idx === 0) {
        return { ...phase, duration: Math.max(phase.duration, Math.round(phase.duration * 1.15)) };
      }
      return phase;
    });
    scenario.pricePerSqft = Number(scenario.pricePerSqft || 0) * 1.03;
    scenario.paymentPlan = { ...(scenario.paymentPlan || {}), bookingPct: Math.min(26, Number(scenario.paymentPlan?.bookingPct || 10) + 2) };
  });

  const equityPhaseScenario = simulateScenario(baseInput, scenario => {
    const tranchePlanLocal = buildBridgeTranches(baseResult, Math.max(0, Math.ceil(baseResult.maximumDeficit * 0.82)));
    scenario.equitySchedule = Array.isArray(scenario.equitySchedule) ? scenario.equitySchedule.slice() : [];
    tranchePlanLocal.forEach(tranche => scenario.equitySchedule.push({ month: tranche.month, amount: tranche.amount }));
    scenario.constructionPhases = (scenario.constructionPhases || []).map((phase, idx) => {
      if (idx === 0) {
        return { ...phase, duration: Math.max(phase.duration, Math.round(phase.duration * 1.2)) };
      }
      return phase;
    });
  });

  options.push(
    {
      title: 'Combined: Equity + Booking',
      result: equityBookingScenario,
      headline: 'Combines bridge capital with earlier conversion.',
      note: 'Use moderate top-up and higher booking capture together.',
    },
    {
      title: 'Combined: Phase + Pricing',
      result: phasePricingScenario,
      headline: 'Smooths execution while improving realization.',
      note: 'Shift phase load and tighten early pricing/booking discipline.',
    },
    {
      title: 'Combined: Equity + Phase',
      result: equityPhaseScenario,
      headline: 'Adds support and execution smoothing in one move.',
      note: 'Lower immediate bridge stress and reduce due-cost spikes.',
    }
  );

  return options.map(item => {
    const gapChange = baseResult.maximumDeficit - item.result.maximumDeficit;
    const runwayChange = (item.result.firstNegativeMonth || item.result.runwayMonths) - (baseResult.firstNegativeMonth || baseResult.runwayMonths);
    const gapReductionScore = clamp((gapChange / Math.max(1, baseResult.maximumDeficit)) * 100, -100, 100);
    const riskImprovement = scenarioRiskScore(item.result) - scenarioRiskScore(baseResult);
    const feasibility = optionFeasibility(item.title) * 100;
    const weightedScore = (gapReductionScore * 0.5) + (riskImprovement * 0.3) + (feasibility * 0.2);

    return {
      ...item,
      gapChange,
      runwayChange,
      weightedScore,
    };
  }).sort((left, right) => right.weightedScore - left.weightedScore);
}

function buildBridgeTranches(result, totalAmount) {
  if (!result.firstNegativeMonth || totalAmount <= 0) return [];

  const bridgeRows = buildMonthlyFundingPlan(result, 'required-bridge')
    .filter(row => row.bridgeThisMonth > 0);
  if (!bridgeRows.length) return [];

  const requiredTotal = bridgeRows.reduce((sum, row) => sum + row.bridgeThisMonth, 0);
  const scale = requiredTotal > 0 ? (totalAmount / requiredTotal) : 0;
  const tranches = bridgeRows.map(row => ({
    month: Math.max(0, Number(row.monthLabel.replace('M', '')) - 1),
    amount: Math.round(row.bridgeThisMonth * scale),
  }));

  const allocated = tranches.reduce((sum, tranche) => sum + tranche.amount, 0);
  const residual = totalAmount - allocated;
  if (residual !== 0 && tranches.length) {
    tranches[tranches.length - 1].amount += residual;
  }

  return tranches;
}

function formatBridgeSchedule(result, totalAmount) {
  const tranches = buildBridgeTranches(result, Math.max(0, Math.ceil(totalAmount || 0)));
  if (!tranches.length) {
    return {
      monthWindow: '',
      monthlyText: 'No bridge required.',
      compactText: '',
    };
  }

  const monthWindow = `${tranches[0].month + 1}-${tranches[tranches.length - 1].month + 1}`;
  const monthlyText = tranches
    .map(tranche => `M${tranche.month + 1}: ${window.VorcoCashFlowEngine.formatINR(tranche.amount)}`)
    .join(' | ');
  const compactText = tranches
    .map(tranche => `M${tranche.month + 1} ${window.VorcoCashFlowEngine.formatINR(tranche.amount)}`)
    .join(', ');

  return { monthWindow, monthlyText, compactText };
}

function buildMonthlyFundingPlan(result, supportMode = 'required-bridge') {
  const rows = [];
  let cumulativeRequiredBridge = 0;

  (result.monthly || []).forEach(month => {
    const netCashFlow = Number(month.inflow || 0) - Number(month.outflow || 0);
    const modelClosingCash = Number(month.balance || 0);

    // Single bridge system: cumulative bridge is the only support ledger.
    const bridgeThisMonth = modelClosingCash + cumulativeRequiredBridge < 0
      ? -(modelClosingCash + cumulativeRequiredBridge)
      : 0;
    cumulativeRequiredBridge += bridgeThisMonth;

    const bridgeInflowApplied = supportMode === 'required-bridge' ? bridgeThisMonth : 0;
    const closingBeforeBridge = modelClosingCash;
    const selectedModeClosingCash = supportMode === 'required-bridge'
      ? modelClosingCash + cumulativeRequiredBridge
      : modelClosingCash;
    const totalInflowWithBridge = Number(month.inflow || 0) + bridgeInflowApplied;
    const netCashFlowWithBridge = totalInflowWithBridge - Number(month.outflow || 0);

    rows.push({
      monthLabel: month.monthLabel,
      salesInflow: Number(month.salesInflow || 0),
      debtInflow: Number(month.debtInflow || 0),
      equityInflow: Number(month.equityInflow || 0),
      inflow: Number(month.inflow || 0),
      outflow: Number(month.outflow || 0),
      netCashFlow,
      modelClosingCash,
      closingBeforeBridge,
      bridgeThisMonth,
      bridgeInflowApplied,
      cumulativeBridge: cumulativeRequiredBridge,
      selectedModeClosingCash,
      totalInflowWithBridge,
      netCashFlowWithBridge,
    });
  });

  return rows;
}

function buildUnsupportedRiskSnapshot(result) {
  const monthly = Array.isArray(result?.monthly) ? result.monthly : [];
  if (!monthly.length) {
    return {
      failureMonthLabel: 'NA',
      peakDeficit: 0,
      underwaterMonths: 0,
      endingCash: 0,
      isStable: true,
    };
  }

  const firstNegative = monthly.find(row => Number(row.balance || 0) < 0);
  const minBalance = monthly.reduce((min, row) => Math.min(min, Number(row.balance || 0)), 0);
  const underwaterMonths = monthly.filter(row => Number(row.balance || 0) < 0).length;
  const endingCash = Number(monthly[monthly.length - 1].balance || 0);

  return {
    failureMonthLabel: firstNegative ? firstNegative.monthLabel : 'None',
    peakDeficit: Math.abs(minBalance),
    underwaterMonths,
    endingCash,
    isStable: underwaterMonths === 0,
  };
}

function renderFailureRisk(result) {
  if (!failureRiskMonth || !failureRiskPeakDeficit || !failureRiskUnderwaterMonths || !failureRiskEndingCash) {
    return;
  }

  const snapshot = buildUnsupportedRiskSnapshot(result);
  failureRiskMonth.textContent = snapshot.failureMonthLabel;
  failureRiskPeakDeficit.textContent = snapshot.peakDeficit > 0
    ? window.VorcoCashFlowEngine.formatINR(snapshot.peakDeficit)
    : '₹0';
  failureRiskUnderwaterMonths.textContent = String(snapshot.underwaterMonths);
  failureRiskEndingCash.textContent = window.VorcoCashFlowEngine.formatINR(snapshot.endingCash);

  if (failureRiskBadge) {
    if (snapshot.isStable) {
      failureRiskBadge.textContent = 'No unsupported failure in horizon';
      failureRiskBadge.classList.add('is-safe');
      failureRiskBadge.classList.remove('is-danger');
    } else {
      failureRiskBadge.textContent = `Unsupported failure from ${snapshot.failureMonthLabel}`;
      failureRiskBadge.classList.add('is-danger');
      failureRiskBadge.classList.remove('is-safe');
    }
  }
}

function percentile(values, quantile) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const position = (sorted.length - 1) * quantile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function runMonteCarloBands(baseInput, runs = 120) {
  if (!isInputReady(baseInput)) {
    return null;
  }

  const outcomes = [];
  const randomBetween = (min, max) => min + ((max - min) * Math.random());
  for (let i = 0; i < runs; i += 1) {
    const scenario = cloneInput(baseInput);
    const macroShock = (Math.random() - 0.5);
    const demandShock = (macroShock * 0.6) + ((Math.random() - 0.5) * 0.4);
    const costShock = (-macroShock * 0.45) + ((Math.random() - 0.5) * 0.55);
    const rateShock = (-macroShock * 0.35) + ((Math.random() - 0.5) * 0.65);

    const salesMultiplier = clamp(randomBetween(0.7, 1.3) + (demandShock * 0.1), 0.6, 1.4);
    const costMultiplier = clamp(randomBetween(0.9, 1.2) + (costShock * 0.06), 0.85, 1.25);
    const delayAdder = Math.round(randomBetween(0, 6) + Math.max(0, -demandShock * 2));

    scenario.salesVelocity = Math.max(0, Number(baseInput.salesVelocity || 0) * salesMultiplier);
    scenario.pricePerSqft = Math.max(0, Number(baseInput.pricePerSqft || 0) * clamp(1 + (demandShock * 0.2), 0.8, 1.15));
    scenario.costEscalationPct = Math.max(0, (Number(baseInput.costEscalationPct || 0) + 0.01) * costMultiplier - 0.01);
    scenario.delayMonths = Math.max(0, Math.round(Number(baseInput.delayMonths || 0) + delayAdder));
    scenario.collectionLagMonths = Math.max(0, Math.round(Number(baseInput.collectionLagMonths || 0) + Math.max(0, Math.round(delayAdder / 2))));
    scenario.salesSlowdownPct = clamp(Number(baseInput.salesSlowdownPct || 0) + Math.max(0, (1 - salesMultiplier) * 0.5), 0, 0.92);
    scenario.debtRateAnnual = Math.max(0, Number(baseInput.debtRateAnnual || 0) * (1 + Math.max(0, rateShock) * 0.28));
    scenario.interestIncreasePct = Math.max(0, Math.max(0, rateShock) * 0.1);
    scenario.collectionEfficiencyPct = clamp(Number(baseInput.collectionEfficiencyPct || 0.94) * clamp(1 + (demandShock * 0.08), 0.88, 1.06), 0.5, 1);
    scenario.collectionDefaultPct = clamp(Number(baseInput.collectionDefaultPct || 0.02) + Math.max(0, (1 - salesMultiplier) * 0.08), 0, 0.25);

    const result = window.VorcoCashFlowEngine.simulateCashFlow(scenario);
    const severeReserveStress = Number(result.metrics?.reserveBreachMonths || 0) > Math.max(2, Math.round(Number(baseInput.projectMonths || 0) * 0.35));
    const prolongedStress = Number(result.metrics?.longestStressWindow || 0) >= Math.max(3, Math.round(Number(baseInput.projectMonths || 0) * 0.25));
    const terminalDebtOverhang = Number(result.metrics?.endingDebtOutstanding || 0) > Math.max(1, Number(baseInput.debtLimit || 0) * 0.12);
    outcomes.push({
      fundingGap: Number(result.fundingGap || 0),
      failureMonth: result.firstNegativeMonth || result.runwayMonths,
      reserveBreaches: Number(result.metrics?.reserveBreachMonths || 0),
      failed: Boolean(result.firstNegativeMonth) || severeReserveStress || prolongedStress || terminalDebtOverhang,
    });
  }

  const gaps = outcomes.map(item => item.fundingGap);
  const failureMonths = outcomes.map(item => item.failureMonth);
  const reserves = outcomes.map(item => item.reserveBreaches);
  const failureCount = outcomes.filter(item => item.failed).length;

  return {
    runs,
    failureProbability: runs > 0 ? (failureCount / runs) : 0,
    p10Gap: percentile(gaps, 0.1),
    p50Gap: percentile(gaps, 0.5),
    p90Gap: percentile(gaps, 0.9),
    p10FailureMonth: percentile(failureMonths, 0.1),
    p50FailureMonth: percentile(failureMonths, 0.5),
    p90FailureMonth: percentile(failureMonths, 0.9),
    p10Reserve: percentile(reserves, 0.1),
    p50Reserve: percentile(reserves, 0.5),
    p90Reserve: percentile(reserves, 0.9),
  };
}

function validateInputConsistency(input) {
  const issues = [];
  if (Number(input.projectMonths || 0) <= 0) issues.push('Project months must be greater than zero.');
  if (Number(input.salesStartMonthIndex || 0) > Number(input.projectMonths || 0) - 1) issues.push('Sales start month must be within project timeline.');
  if (Number(input.debtCoveragePct || 0) > 1) issues.push('Debt linked to construction % cannot exceed 100%.');
  if (Number(input.collectionEfficiencyPct || 0) <= 0) issues.push('Collection efficiency must be greater than 0%.');
  if (Number(input.collectionDefaultPct || 0) >= 1) issues.push('Collection default % must be below 100%.');
  if (Number(input.collectionEfficiencyPct || 0) - Number(input.collectionDefaultPct || 0) <= 0) {
    issues.push('Collection assumptions are invalid: efficiency must be higher than default loss.');
  }
  if (Number(input.minCashReserve || 0) < 0) issues.push('Minimum cash reserve cannot be negative.');
  if (input.salesCollectionMode === 'manual') {
    const manual = Array.isArray(input.manualSalesInflows) ? input.manualSalesInflows : [];
    const totalManual = manual.reduce((sum, value) => sum + Math.max(0, Number(value || 0)), 0);
    if (manual.length !== Number(input.projectMonths || 0)) {
      issues.push('Manual monthly sales list must cover all project months.');
    }
    if (totalManual <= 0) {
      issues.push('Manual monthly sales mode requires at least one positive monthly inflow.');
    }
  }
  const speedValues = input.speedMultipliers || {};
  if (!(Number(speedValues.slow) < Number(speedValues.normal) && Number(speedValues.normal) < Number(speedValues.fast))) {
    issues.push('Sales speed multipliers must follow slow < normal < fast.');
  }
  if (issues.length) {
    throw new Error(issues.join(' '));
  }
}

function renderCommitmentLayer(result) {
  if (!commitmentCommitted || !commitmentDue || !commitmentPaid || !commitmentUnpaid || !commitmentTableBody) {
    return;
  }

  const metrics = result.metrics || {};
  commitmentCommitted.textContent = window.VorcoCashFlowEngine.formatINR(metrics.totalCommittedCost || 0);
  commitmentDue.textContent = window.VorcoCashFlowEngine.formatINR(metrics.totalDueCost || 0);
  commitmentPaid.textContent = window.VorcoCashFlowEngine.formatINR(metrics.totalPaidCost || 0);
  commitmentUnpaid.textContent = window.VorcoCashFlowEngine.formatINR(metrics.unpaidCommittedCost || 0);

  const rows = (result.monthly || []).filter(row => (row.committedCost || 0) > 0 || (row.unpaidCarry || 0) > 0);
  if (!rows.length) {
    commitmentTableBody.innerHTML = '<tr><td colspan="6">No commitments due in this horizon.</td></tr>';
    return;
  }

  commitmentTableBody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.monthLabel}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.committedCost || 0)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.dueCost || 0)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.paidCost || 0)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.unpaidCarry || 0)}</td>
      <td>${row.stressLevel || 0}</td>
    </tr>
  `).join('');
}

function renderMonteCarloLayer(monte) {
  if (!monte || !monteFailureProb || !monteP50Gap || !monteP90Gap || !monteRunCount || !monteBandsBody) {
    return;
  }

  monteFailureProb.textContent = `${(monte.failureProbability * 100).toFixed(1)}%`;
  monteP50Gap.textContent = window.VorcoCashFlowEngine.formatINR(monte.p50Gap || 0);
  monteP90Gap.textContent = window.VorcoCashFlowEngine.formatINR(monte.p90Gap || 0);
  monteRunCount.textContent = String(monte.runs || 0);

  const bands = [
    { name: 'P10', gap: monte.p10Gap, month: monte.p10FailureMonth, reserve: monte.p10Reserve },
    { name: 'P50', gap: monte.p50Gap, month: monte.p50FailureMonth, reserve: monte.p50Reserve },
    { name: 'P90', gap: monte.p90Gap, month: monte.p90FailureMonth, reserve: monte.p90Reserve },
  ];

  monteBandsBody.innerHTML = bands.map(band => `
    <tr>
      <td>${band.name}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(band.gap || 0)}</td>
      <td>M${Math.max(1, Math.round(band.month || 1))}</td>
      <td>${Math.max(0, Math.round(band.reserve || 0))}</td>
    </tr>
  `).join('');
}

function buildAssumptionSnapshot(input) {
  return cloneInput(input);
}

function flattenSnapshot(value, prefix = '', output = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => flattenSnapshot(item, `${prefix}[${idx}]`, output));
    return output;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).sort().forEach(key => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenSnapshot(value[key], next, output);
    });
    return output;
  }
  output[prefix] = value;
  return output;
}

function diffAssumptionSnapshot(previousSnapshot, currentSnapshot) {
  if (!previousSnapshot) {
    return ['Initial run'];
  }

  const previousFlat = flattenSnapshot(previousSnapshot);
  const currentFlat = flattenSnapshot(currentSnapshot);
  const keys = Array.from(new Set([...Object.keys(previousFlat), ...Object.keys(currentFlat)])).sort();

  return keys.reduce((acc, key) => {
    const before = previousFlat[key];
    const after = currentFlat[key];
    if (stableSerialize(before) !== stableSerialize(after)) {
      acc.push(`${key}: ${before} -> ${after}`);
    }
    return acc;
  }, []);
}

function getConfidenceBand(result, monte) {
  const health = Number(result.metrics?.healthScore || 0);
  const failureProb = Number(monte?.failureProbability || 0);
  if (health >= 80 && failureProb < 0.2) return 'High';
  if (health >= 60 && failureProb < 0.45) return 'Medium';
  return 'Low';
}

function renderTrustLayer(result, input, monte, runId) {
  if (!runIdValue || !assumptionDiffValue || !auditTraceCountValue || !confidenceBandValue || !auditTraceBody || !directionText) {
    return;
  }

  const currentSnapshot = buildAssumptionSnapshot(input);
  const diffs = diffAssumptionSnapshot(previousAssumptionSnapshot, currentSnapshot);
  const trace = Array.isArray(result.metrics?.auditTrace) ? result.metrics.auditTrace : [];
  const confidence = getConfidenceBand(result, monte);
  const drivers = buildRootCauseBreakdown(result).slice(0, 3);

  runIdValue.textContent = runId;
  const diffPreview = diffs.slice(0, 2).join(' | ') || 'No change';
  assumptionDiffValue.textContent = diffs.length > 2 ? `${diffPreview} (+${diffs.length - 2})` : diffPreview;
  auditTraceCountValue.textContent = String(trace.length);
  confidenceBandValue.textContent = confidence;

  if (!trace.length) {
    auditTraceBody.innerHTML = '<tr><td colspan="5">No risk trace events in this run.</td></tr>';
  } else {
    auditTraceBody.innerHTML = trace.slice(0, 12).map(item => `
      <tr>
        <td>${item.monthLabel}</td>
        <td>${item.stressLevel}</td>
        <td>${window.VorcoCashFlowEngine.formatINR(item.unpaidCarry || 0)}</td>
        <td>${window.VorcoCashFlowEngine.formatINR(item.debtOutstanding || 0)}</td>
        <td>${item.note}</td>
      </tr>
    `).join('');
  }

  const hasStructuralStress = Boolean(result.firstNegativeMonth)
    || Number(result.metrics?.reserveBreachMonths || 0) > 0
    || Number(result.metrics?.unpaidCommittedCost || 0) > 0
    || Number(monte?.failureProbability || 0) >= 0.35;
  directionText.textContent = hasStructuralStress
    ? `Top failure drivers: ${drivers.map(driver => `${driver.label.split('(')[0].trim()} ${driver.share}%`).join(' | ')}. Rebuild execution plan first, then re-test financing mix.`
    : 'Recommended next direction: keep current structure, monitor monthly, and use probability bands for investor updates.';

  previousAssumptionSnapshot = currentSnapshot;
}

function buildStressScenarios(baseInput) {
  if (!isInputReady(baseInput)) {
    return { p50Result: null, p90Result: null };
  }

  const p50Result = simulateScenario(baseInput, scenario => {
    scenario.salesSlowdownPct = clamp(Number(scenario.salesSlowdownPct || 0) + 0.12, 0, 0.8);
    scenario.costEscalationPct = Math.max(Number(scenario.costEscalationPct || 0), 0.08);
    scenario.disbursementLagMonths = Math.max(Number(scenario.disbursementLagMonths || 0), 1);
  });

  const p90Result = simulateScenario(baseInput, scenario => {
    scenario.salesSlowdownPct = clamp(Number(scenario.salesSlowdownPct || 0) + 0.25, 0, 0.9);
    scenario.costEscalationPct = Math.max(Number(scenario.costEscalationPct || 0), 0.15);
    scenario.disbursementLagMonths = Math.max(Number(scenario.disbursementLagMonths || 0), 2);
    scenario.moratoriumMonths = Math.max(0, Number(scenario.moratoriumMonths || 0) - 3);
  });

  return { p50Result, p90Result };
}

function renderStressBridgePlan(baseResult, input) {
  const { p50Result, p90Result } = buildStressScenarios(input);
  if (!p50Result || !p90Result) {
    p50BridgeTotal.textContent = 'NA';
    p90BridgeTotal.textContent = 'NA';
    stressBridgeBody.innerHTML = '<tr><td colspan="6">Click Analyze Project to load stress scenario rows.</td></tr>';
    return;
  }

  const basePlan = buildMonthlyFundingPlan(baseResult);
  const p50Plan = buildMonthlyFundingPlan(p50Result);
  const p90Plan = buildMonthlyFundingPlan(p90Result);

  const p50Total = p50Plan.reduce((sum, row) => sum + row.bridgeThisMonth, 0);
  const p90Total = p90Plan.reduce((sum, row) => sum + row.bridgeThisMonth, 0);
  p50BridgeTotal.textContent = p50Total > 0 ? window.VorcoCashFlowEngine.formatINR(p50Total) : 'No bridge';
  p90BridgeTotal.textContent = p90Total > 0 ? window.VorcoCashFlowEngine.formatINR(p90Total) : 'No bridge';

  const maxRows = Math.max(basePlan.length, p50Plan.length, p90Plan.length);
  const rows = [];
  for (let i = 0; i < maxRows; i += 1) {
    const baseRow = basePlan[i];
    const p50Row = p50Plan[i];
    const p90Row = p90Plan[i];
    rows.push({
      monthLabel: baseRow?.monthLabel || p50Row?.monthLabel || p90Row?.monthLabel || `M${i + 1}`,
      baseBridge: Number(baseRow?.bridgeThisMonth || 0),
      p50Bridge: Number(p50Row?.bridgeThisMonth || 0),
      p90Bridge: Number(p90Row?.bridgeThisMonth || 0),
      p50Cumulative: Number(p50Row?.cumulativeBridge || 0),
      p90Cumulative: Number(p90Row?.cumulativeBridge || 0),
    });
  }

  stressBridgeBody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.monthLabel}</td>
      <td>${row.baseBridge > 0 ? window.VorcoCashFlowEngine.formatINR(row.baseBridge) : '₹0'}</td>
      <td>${row.p50Bridge > 0 ? window.VorcoCashFlowEngine.formatINR(row.p50Bridge) : '₹0'}</td>
      <td>${row.p90Bridge > 0 ? window.VorcoCashFlowEngine.formatINR(row.p90Bridge) : '₹0'}</td>
      <td>${row.p50Cumulative > 0 ? window.VorcoCashFlowEngine.formatINR(row.p50Cumulative) : '₹0'}</td>
      <td>${row.p90Cumulative > 0 ? window.VorcoCashFlowEngine.formatINR(row.p90Cumulative) : '₹0'}</td>
    </tr>
  `).join('');
}

function renderModelAudit(result, input) {
  const checks = result.metrics?.covenantChecks || {};
  const irr = result.metrics?.leveredIrrAnnual;
  const moic = result.metrics?.leveredMoic;
  const paybackMonth = result.metrics?.paybackMonth;
  const reserveBreachMonths = Number(result.metrics?.reserveBreachMonths || 0);
  const endingDebt = Number(result.metrics?.endingDebtOutstanding || 0);
  const actualLtc = Number(checks.actualLtcPct || 0);

  auditIrrValue.textContent = Number.isFinite(irr)
    ? `${(irr * 100).toFixed(1)}%`
    : (Number.isFinite(moic) ? `MOIC ${moic.toFixed(2)}x` : (paybackMonth ? `Payback M${paybackMonth}` : 'N/A'));
  auditLtcValue.textContent = `${actualLtc.toFixed(1)}%`;
  auditReserveValue.textContent = String(reserveBreachMonths);
  auditDebtValue.textContent = window.VorcoCashFlowEngine.formatINR(endingDebt);

  const checklist = [
    {
      pass: !checks.loanLimitBreach,
      text: checks.loanLimitBreach
        ? `Peak debt exceeds debt limit (${window.VorcoCashFlowEngine.formatINR(result.metrics.peakDebtOutstanding || 0)} > ${window.VorcoCashFlowEngine.formatINR(input.debtLimit || 0)}).`
        : 'Peak debt stays within the debt limit.'
    },
    {
      pass: !checks.debtOverhang,
      text: checks.debtOverhang
        ? `Debt overhang remains at horizon end (${window.VorcoCashFlowEngine.formatINR(endingDebt)}).`
        : 'No debt left at the end of the period.'
    },
    {
      pass: reserveBreachMonths <= Math.max(1, Math.round(Number(input.projectMonths || 0) * 0.2)),
      text: `Reserve breaches: ${reserveBreachMonths} month(s) below minimum cash reserve.`
    },
    {
      pass: Number.isFinite(irr),
      text: Number.isFinite(irr)
        ? `Estimated IRR is ${(irr * 100).toFixed(1)}%.`
        : Number.isFinite(moic)
          ? `IRR unavailable; MOIC fallback is ${moic.toFixed(2)}x${paybackMonth ? ` and payback is around Month ${paybackMonth}` : ''}.`
          : 'Estimated IRR cannot be calculated from this cash-flow pattern.'
    }
  ];

  const passCount = checklist.filter(item => item.pass).length;
  const allPass = passCount === checklist.length;
  auditOverallBadge.textContent = allPass
    ? `All checks passed (${passCount}/${checklist.length}).`
    : `Review needed (${passCount}/${checklist.length} checks passed).`;
  auditOverallBadge.style.background = allPass ? 'rgba(47, 106, 68, 0.12)' : 'rgba(160, 52, 45, 0.18)';
  auditOverallBadge.style.borderColor = allPass ? 'rgba(47, 106, 68, 0.35)' : 'rgba(160, 52, 45, 0.35)';
  auditOverallBadge.style.color = allPass ? 'var(--safe)' : 'var(--danger)';

  auditChecklist.innerHTML = checklist.map(item => `
    <li>
      ${item.pass ? 'Pass' : 'Fail'}: ${item.text}
    </li>
  `).join('');
}

function renderMonthlyFundingPlan(result) {
  const supportMode = monthlySupportMode?.value || 'required-bridge';
  const planRows = buildMonthlyFundingPlan(result, supportMode);

  if (!planRows.length) {
    monthlyBridgeTotal.textContent = 'NA';
    monthlyBridgeMonths.textContent = 'NA';
    monthlyBridgePeak.textContent = 'NA';
    monthlyBridgeFirst.textContent = 'NA';
    monthlyFundingBody.innerHTML = '<tr><td colspan="8">Click Analyze Project to load this table.</td></tr>';
    return;
  }

  const bridgeRows = planRows.filter(row => row.bridgeThisMonth > 0);
  const totalBridge = bridgeRows.reduce((sum, row) => sum + row.bridgeThisMonth, 0);
  const peakBridge = bridgeRows.reduce((max, row) => Math.max(max, row.bridgeThisMonth), 0);
  const firstBridgeRow = bridgeRows[0];

  const viewMode = monthlyFundingView?.value || 'all';
  let displayRows = planRows;
  if (viewMode === 'need') {
    displayRows = bridgeRows;
  } else if (viewMode === 'first12') {
    displayRows = planRows.slice(0, 12);
  }

  monthlyBridgeTotal.textContent = totalBridge > 0 ? window.VorcoCashFlowEngine.formatINR(totalBridge) : 'No bridge';
  monthlyBridgeMonths.textContent = String(bridgeRows.length);
  monthlyBridgePeak.textContent = peakBridge > 0 ? window.VorcoCashFlowEngine.formatINR(peakBridge) : 'No bridge';
  monthlyBridgeFirst.textContent = firstBridgeRow ? firstBridgeRow.monthLabel : 'None';

  if (!displayRows.length) {
    monthlyFundingBody.innerHTML = '<tr><td colspan="8">No rows for current view.</td></tr>';
    return;
  }

  monthlyFundingBody.innerHTML = displayRows.map(row => `
    <tr>
      <td>${row.monthLabel}</td>
      <td>${row.bridgeThisMonth > 0 ? window.VorcoCashFlowEngine.formatINR(row.bridgeThisMonth) : '₹0'}</td>
      <td>${row.cumulativeBridge > 0 ? window.VorcoCashFlowEngine.formatINR(row.cumulativeBridge) : '₹0'}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.inflow)}</td>
      <td>${row.bridgeInflowApplied > 0 ? window.VorcoCashFlowEngine.formatINR(row.bridgeInflowApplied) : '₹0'}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.totalInflowWithBridge)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.outflow)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.closingBeforeBridge)}</td>
    </tr>
  `).join('');
}

function renderFundingFocus(result) {
  const supportMode = monthlySupportMode?.value || 'required-bridge';
  const planRows = buildMonthlyFundingPlan(result, supportMode);
  const needRows = planRows.filter(row => row.bridgeThisMonth > 0);

  if (!needRows.length) {
    monthlyNeedOnlyCount.textContent = '0';
    monthlyNeedOnlyTotal.textContent = 'No bridge';
    monthlyNeedOnlyWindow.textContent = 'None';
    monthlyNeedOnlyBody.innerHTML = '<tr><td colspan="8">No month needs extra cash in this run.</td></tr>';
    bridgeNeedBars.innerHTML = '<p class="mini-note">No monthly gap bars because no extra cash is needed.</p>';
    bridgeCumulativeBars.innerHTML = '<p class="mini-note">No cumulative gap because no extra cash is needed.</p>';
    return;
  }

  const totalNeed = needRows.reduce((sum, row) => sum + row.bridgeThisMonth, 0);
  const maxNeed = needRows.reduce((max, row) => Math.max(max, row.bridgeThisMonth), 0);
  const maxCum = needRows.reduce((max, row) => Math.max(max, row.cumulativeBridge), 0);
  const firstMonth = needRows[0].monthLabel;
  const lastMonth = needRows[needRows.length - 1].monthLabel;

  monthlyNeedOnlyCount.textContent = String(needRows.length);
  monthlyNeedOnlyTotal.textContent = window.VorcoCashFlowEngine.formatINR(totalNeed);
  monthlyNeedOnlyWindow.textContent = `${firstMonth} to ${lastMonth}`;

  bridgeNeedBars.innerHTML = `
    <h3>Monthly gap bars</h3>
    ${needRows.map(row => {
      const width = maxNeed > 0 ? (row.bridgeThisMonth / maxNeed) * 100 : 0;
      return `
        <div class="funding-row">
          <span class="funding-month">${row.monthLabel}</span>
          <div class="funding-track"><span style="width:${width.toFixed(2)}%"></span></div>
          <strong>${window.VorcoCashFlowEngine.formatINR(row.bridgeThisMonth)}</strong>
        </div>
      `;
    }).join('')}
  `;

  bridgeCumulativeBars.innerHTML = `
    <h3>Cumulative gap bars</h3>
    ${needRows.map(row => {
      const width = maxCum > 0 ? (row.cumulativeBridge / maxCum) * 100 : 0;
      return `
        <div class="funding-row funding-row--cumulative">
          <span class="funding-month">${row.monthLabel}</span>
          <div class="funding-track"><span style="width:${width.toFixed(2)}%"></span></div>
          <strong>${window.VorcoCashFlowEngine.formatINR(row.cumulativeBridge)}</strong>
        </div>
      `;
    }).join('')}
  `;

  monthlyNeedOnlyBody.innerHTML = needRows.map(row => `
    <tr>
      <td>${row.monthLabel}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.bridgeThisMonth)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.cumulativeBridge)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.inflow)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.bridgeInflowApplied)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.totalInflowWithBridge)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.outflow)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.netCashFlowWithBridge)}</td>
    </tr>
  `).join('');
}

function buildReportRows(result, input) {
  const monthly = result.monthly || [];
  const saleableArea = Math.max(1, Number(input.saleableArea || 0));
  const totalSalesCollected = sumMonthly(monthly, 'salesInflow');
  const debtDrawn = sumMonthly(monthly, 'debtInflow');
  const equityInflow = sumMonthly(monthly, 'equityInflow');
  const landCost = sumMonthly(monthly, 'landOutflow');
  const constructionCost = sumMonthly(monthly, 'constructionOutflow');
  const softCost = sumMonthly(monthly, 'softOutflow');
  const statutoryCost = sumMonthly(monthly, 'statutoryOutflow');
  const commissionCost = sumMonthly(monthly, 'salesCommissionOutflow');
  const transactionCost = sumMonthly(monthly, 'transactionOutflow');
  const debtDrawFeeCost = sumMonthly(monthly, 'debtDrawFeeOutflow');
  const interestCost = sumMonthly(monthly, 'interestOutflow');
  const principalCost = sumMonthly(monthly, 'debtPrincipalOutflow');
  const baseProjectCost = landCost + constructionCost + softCost + statutoryCost + commissionCost + transactionCost + debtDrawFeeCost;
  const totalProjectCost = baseProjectCost + interestCost;
  const profit = totalSalesCollected - totalProjectCost;
  const roi = totalProjectCost > 0 ? (profit / totalProjectCost) * 100 : 0;
  const margin = totalSalesCollected > 0 ? (profit / totalSalesCollected) * 100 : 0;
  const breakEvenSalePrice = totalProjectCost / saleableArea;
  const spreadPct = breakEvenSalePrice > 0 ? ((Number(input.pricePerSqft || 0) - breakEvenSalePrice) / breakEvenSalePrice) * 100 : 0;
  const costPerSqFt = totalProjectCost / saleableArea;
  const netRevenuePerSqFt = totalSalesCollected / saleableArea;
  const profitPerSqFt = profit / saleableArea;
  const debtService = interestCost + principalCost;
  const operatingSurplus = totalSalesCollected - baseProjectCost;
  const dscr = debtService > 0 ? operatingSurplus / debtService : null;
  const icr = interestCost > 0 ? operatingSurplus / interestCost : null;
  const activeDebtMonths = monthly.filter(row => row.debtOutstanding > 0);
  const debtBreakEvenMonth = principalCost > 0
    ? monthly.find(row => row.debtOutstanding <= 0 && row.debtInflow > 0)?.monthIndex + 1 || null
    : null;
  const phases = Array.isArray(input.constructionPhases) ? input.constructionPhases : [];
  const phaseTop = phases
    .map(phase => ({
      name: phase.name,
      start: phase.startMonth,
      end: phase.startMonth + phase.duration - 1,
      duration: phase.duration,
      amount: phase.cost,
      share: constructionCost > 0 ? (phase.cost / constructionCost) * 100 : 0,
    }))
    .sort((left, right) => right.amount - left.amount);
  const phaseSpendTotal = phaseTop.reduce((sum, phase) => sum + phase.amount, 0);
  const topPhaseShare = phaseTop[0]?.share || 0;
  const capitalIntensityPct = totalProjectCost > 0 ? ((constructionCost + interestCost) / totalProjectCost) * 100 : 0;
  const executionPressurePct = phaseTop.length ? phaseTop[0].share : 0;
  const riskFlags = result.risks || [];
  const riskLabel = riskFlags.length === 0 ? 'Clean' : riskFlags.length <= 2 ? 'Watch' : 'Guarded';
  const recommendation = result.firstNegativeMonth === null && result.metrics.healthScore >= 75 ? 'Proceed' : result.metrics.healthScore >= 55 ? 'Proceed with caution' : 'Rework';
  const lenderView = debtService === 0 ? 'No debt' : dscr >= 1.5 ? 'Comfortable' : dscr >= 1 ? 'Tight' : 'Stressed';
  const liquidityView = result.firstNegativeMonth === null ? 'Controlled' : 'Tight';
  const generatedAt = new Date();
  const scenarioStamp = 'CUSTOM';
  const versionRunId = `v${generatedAt.getFullYear()}.${String(generatedAt.getMonth() + 1).padStart(2, '0')} | INV-${generatedAt.getFullYear()}${String(generatedAt.getMonth() + 1).padStart(2, '0')}${String(generatedAt.getDate()).padStart(2, '0')}-${String(generatedAt.getHours()).padStart(2, '0')}${String(generatedAt.getMinutes()).padStart(2, '0')}`;
  const projectName = 'Live Cash Flow Scenario';
  const projectLocation = 'Gujarat';
  const developerName = 'VORCO';
  const confidentiality = 'Investor Shareable';
  const deckProfit = profit;
  const debtDependency = result.metrics.debtDependencyPct || 0;
  const salesDelayMonths = Math.max(0, Number(input.delayMonths || 0));
  const totalDelayMonths = salesDelayMonths;
  const timelineSpendTotal = landCost + constructionCost + softCost + statutoryCost + commissionCost + transactionCost + debtDrawFeeCost + interestCost;
  const reconciliationGap = totalProjectCost - timelineSpendTotal;
  const reconciliationStatus = Math.abs(reconciliationGap) < 1 ? 'Matched' : 'Check';
  const conservative = buildScenarioPriceRow(input, result, 0.85, totalProjectCost, saleableArea);
  const base = buildScenarioPriceRow(input, result, 1, totalProjectCost, saleableArea);
  const optimistic = buildScenarioPriceRow(input, result, 1.15, totalProjectCost, saleableArea);
  const reportDate = generatedAt.toLocaleDateString('en-IN');
  const reportTime = generatedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    projectName,
    projectLocation,
    developerName,
    scenarioStamp,
    confidentiality,
    versionRunId,
    reportDate,
    reportTime,
    recommendation,
    riskLabel,
    profit: deckProfit,
    roi,
    margin,
    breakEvenSpreadPct: spreadPct,
    dscr,
    icr,
    peakFundingGap: result.maximumDeficit || 0,
    lenderView,
    liquidityView,
    riskFlags,
    capitalIntensityPct,
    executionPressurePct: topPhaseShare,
    healthScore: result.metrics.healthScore || 0,
    totalSalesCollected,
    debtDrawn,
    equityInflow,
    landCost,
    constructionCost,
    softCost,
    statutoryCost,
    commissionCost,
    transactionCost,
    debtDrawFeeCost,
    interestCost,
    principalCost,
    totalProjectCost,
    baseProjectCost,
    breakEvenSalePrice,
    costPerSqFt,
    netRevenuePerSqFt,
    profitPerSqFt,
    debtService,
    operatingSurplus,
    debtBreakEvenMonth,
    loanActiveThrough: activeDebtMonths.length ? activeDebtMonths[activeDebtMonths.length - 1].monthLabel : 'N/A',
    phaseTop,
    phaseSpendTotal,
    timelineSpendTotal,
    reconciliationGap,
    reconciliationStatus,
    totalDelayMonths,
    salesDelayMonths,
    conservative,
    base,
    optimistic,
    debtDependency,
  };
}

function buildScenarioPriceRow(input, result, multiplier, totalProjectCost, saleableArea) {
  const price = Number(input.pricePerSqft || 0) * multiplier;
  const grossRevenue = saleableArea * price;
  const profit = grossRevenue - totalProjectCost;
  const roi = totalProjectCost > 0 ? (profit / totalProjectCost) * 100 : 0;
  return { price, profit, roi };
}

function buildRows(items) {
  return items.map(([label, value]) => `<div class="summary-line"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function buildReportSection(title, note, content, extraClass = '') {
  return `
    <section class="memo-section ${extraClass}">
      <div class="section-head memo-section-head">
        <div>
          <p class="eyebrow">${title}</p>
          ${note ? `<p class="section-note memo-section-note">${note}</p>` : ''}
        </div>
      </div>
      ${content}
    </section>
  `;
}

function buildMetricCard(label, value) {
  return `<article class="memo-card"><p class="k">${label}</p><p class="v">${value}</p></article>`;
}

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  return node;
}

function numberToChart(value, min, max, top, height) {
  if (max === min) return top + height / 2;
  return top + ((max - value) / (max - min)) * height;
}

function buildLinePath(points) {
  if (!points.length) return '';
  return points.map((point, idx) => `${idx === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
}

function animateChartLayers(container) {
  const paths = container.querySelectorAll('.chart-animated-path');
  const dots = container.querySelectorAll('.chart-animated-point');

  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.opacity = '1';
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset 720ms cubic-bezier(0.22, 0.61, 0.36, 1) ${index * 90}ms`;
    path.style.strokeDashoffset = '0';
  });

  dots.forEach((dot, index) => {
    dot.style.opacity = '0';
    dot.style.transform = 'scale(0.85)';
    dot.style.transition = `opacity 260ms ease ${150 + index * 8}ms, transform 260ms ease ${150 + index * 8}ms`;
    requestAnimationFrame(() => {
      dot.style.opacity = '0.72';
      dot.style.transform = 'scale(1)';
    });
  });
}

function renderInteractiveChart(container, labels, series, valueFormatter) {
  container.innerHTML = '';
  container.classList.add('chart-interactive');

  const minWidth = Math.max(760, labels.length * 48);
  const width = minWidth;
  const height = 300;
  const padding = { top: 18, right: 18, bottom: 34, left: 78 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const allValues = series.flatMap(item => item.values);
  const maxValue = Math.max(0, ...allValues);
  const minValue = Math.min(0, ...allValues);
  const rangePad = (maxValue - minValue || 1) * 0.08;
  const yMax = maxValue + rangePad;
  const yMin = minValue - rangePad;

  const stepX = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth;

  const wrapper = document.createElement('div');
  wrapper.className = 'chart-svg-wrap';
  wrapper.style.minWidth = `${minWidth}px`;

  const svg = svgEl('svg', { class: 'chart-svg', viewBox: `0 0 ${width} ${height}`, role: 'img' });
  const gridLayer = svgEl('g');
  const lineLayer = svgEl('g');
  const axisLayer = svgEl('g');

  const zeroY = numberToChart(0, yMin, yMax, padding.top, plotHeight);
  gridLayer.appendChild(svgEl('line', {
    x1: padding.left,
    y1: zeroY,
    x2: width - padding.right,
    y2: zeroY,
    class: 'chart-zero-line'
  }));

  const gridCount = 5;
  for (let i = 0; i <= gridCount; i += 1) {
    const ratio = i / gridCount;
    const yValue = yMax - (yMax - yMin) * ratio;
    const y = padding.top + plotHeight * ratio;

    gridLayer.appendChild(svgEl('line', {
      x1: padding.left,
      y1: y,
      x2: width - padding.right,
      y2: y,
      class: 'chart-grid-line'
    }));

    const label = svgEl('text', {
      x: padding.left - 10,
      y: y + 4,
      class: 'chart-axis-label',
      'text-anchor': 'end'
    });
    label.textContent = valueFormatter(yValue);
    axisLayer.appendChild(label);
  }

  labels.forEach((labelValue, index) => {
    if (labels.length > 12 && index % Math.ceil(labels.length / 12) !== 0 && index !== labels.length - 1) return;
    const x = padding.left + stepX * index;
    const label = svgEl('text', {
      x,
      y: height - 10,
      class: 'chart-axis-label',
      'text-anchor': 'middle'
    });
    label.textContent = labelValue;
    axisLayer.appendChild(label);
  });

  const pointsBySeries = series.map(item => ({
    ...item,
    points: item.values.map((value, idx) => ({
      x: padding.left + stepX * idx,
      y: numberToChart(value, yMin, yMax, padding.top, plotHeight),
      value,
      label: labels[idx]
    }))
  }));

  pointsBySeries.forEach(item => {
    if (item.fill) {
      const first = item.points[0];
      const last = item.points[item.points.length - 1];
      const fillPath = `${buildLinePath(item.points)} L${last.x},${zeroY} L${first.x},${zeroY} Z`;
      lineLayer.appendChild(svgEl('path', {
        d: fillPath,
        fill: item.fill,
        opacity: '0.22'
      }));
    }

    lineLayer.appendChild(svgEl('path', {
      d: buildLinePath(item.points),
      fill: 'none',
      stroke: item.color,
      'stroke-width': item.strokeWidth || 2.6,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      class: 'chart-animated-path'
    }));

    item.points.forEach(point => {
      lineLayer.appendChild(svgEl('circle', {
        cx: point.x,
        cy: point.y,
        r: 2.3,
        fill: item.color,
        class: 'chart-point chart-animated-point'
      }));
    });
  });

  const hoverLine = svgEl('line', {
    x1: padding.left,
    y1: padding.top,
    x2: padding.left,
    y2: height - padding.bottom,
    class: 'chart-hover-line'
  });
  hoverLine.style.display = 'none';
  lineLayer.appendChild(hoverLine);

  svg.appendChild(gridLayer);
  svg.appendChild(lineLayer);
  svg.appendChild(axisLayer);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.style.display = 'none';

  const interactionRect = svgEl('rect', {
    x: padding.left,
    y: padding.top,
    width: plotWidth,
    height: plotHeight,
    fill: 'transparent',
    class: 'chart-interaction-hit'
  });

  function updateHover(clientX) {
    const bounds = svg.getBoundingClientRect();
    const localX = ((clientX - bounds.left) / bounds.width) * width;
    const clamped = Math.min(Math.max(localX, padding.left), width - padding.right);
    const idx = Math.round((clamped - padding.left) / stepX);
    const safeIdx = Math.min(Math.max(idx, 0), labels.length - 1);
    const x = padding.left + stepX * safeIdx;

    hoverLine.style.display = 'block';
    hoverLine.setAttribute('x1', x);
    hoverLine.setAttribute('x2', x);

    const lines = pointsBySeries.map(item => {
      const value = item.values[safeIdx];
      return `<div class="tooltip-line"><span style="color:${item.color}">●</span> ${item.name}: <strong>${valueFormatter(value)}</strong></div>`;
    }).join('');

    tooltip.innerHTML = `<div class="tooltip-title">${labels[safeIdx]}</div>${lines}`;
    tooltip.style.display = 'block';

    const tooltipLeft = Math.min(x + 14, width - 220);
    tooltip.style.left = `${tooltipLeft}px`;
    tooltip.style.top = `${padding.top + 8}px`;
  }

  interactionRect.addEventListener('mousemove', event => updateHover(event.clientX));
  interactionRect.addEventListener('mouseenter', event => updateHover(event.clientX));
  interactionRect.addEventListener('mouseleave', () => {
    hoverLine.style.display = 'none';
    tooltip.style.display = 'none';
  });

  svg.appendChild(interactionRect);
  wrapper.appendChild(svg);
  wrapper.appendChild(tooltip);
  container.appendChild(wrapper);

  animateChartLayers(wrapper);
}

function renderChart(monthlyData) {
  if (!chartBars) {
    return;
  }

  const inflowToggle = seriesToggleGroup?.querySelector('[data-series="inflow"]');
  const outflowToggle = seriesToggleGroup?.querySelector('[data-series="outflow"]');
  const balanceToggle = seriesToggleGroup?.querySelector('[data-series="balance"]');
  const selectedSeries = {
    inflow: inflowToggle ? inflowToggle.checked : true,
    outflow: outflowToggle ? outflowToggle.checked : true,
    balance: balanceToggle ? balanceToggle.checked : true,
  };

  const series = [];
  if (selectedSeries.inflow) {
    series.push({ name: 'Inflow', color: '#2f6a44', fill: 'rgba(47, 106, 68, 0.28)', values: monthlyData.map(row => row.inflow) });
  }
  if (selectedSeries.outflow) {
    series.push({ name: 'Outflow', color: '#9a6a22', fill: 'rgba(154, 106, 34, 0.2)', values: monthlyData.map(row => row.outflow) });
  }
  if (selectedSeries.balance) {
    series.push({ name: 'Balance', color: '#c0392b', fill: 'rgba(192, 57, 43, 0.18)', values: monthlyData.map(row => row.balance), strokeWidth: 3 });
  }

  if (!series.length) {
    chartBars.innerHTML = '<p class="mini-note">Select at least one series to render the chart.</p>';
    return;
  }

  renderInteractiveChart(
    chartBars,
    monthlyData.map(row => row.month || row.monthLabel),
    series,
    value => window.VorcoCashFlowEngine.formatINR(value)
  );
}

function renderCumulativeChart(monthlyData) {
  if (!cumulativeChartBars) {
    return;
  }

  let cumInflow = 0;
  let cumOutflow = 0;
  const cumulative = monthlyData.map(row => {
    cumInflow += row.inflow;
    cumOutflow += row.outflow;
    return { month: row.month || row.monthLabel, cumInflow, cumOutflow };
  });

  renderInteractiveChart(
    cumulativeChartBars,
    cumulative.map(row => row.month),
    [
      { name: 'Cumulative inflow', color: '#2e6e52', fill: 'rgba(46, 110, 82, 0.2)', values: cumulative.map(row => row.cumInflow) },
      { name: 'Cumulative outflow', color: '#c0392b', fill: 'rgba(192, 57, 43, 0.14)', values: cumulative.map(row => row.cumOutflow) }
    ],
    value => window.VorcoCashFlowEngine.formatINR(value)
  );
}

function renderDebtChart(monthly) {
  if (!debtChartBars) {
    return;
  }

  renderInteractiveChart(
    debtChartBars,
    monthly.map(row => row.monthLabel),
    [
      { name: 'Debt outstanding', color: '#3957a0', fill: 'rgba(57, 87, 160, 0.16)', values: monthly.map(row => row.debtOutstanding || 0) },
      { name: 'Construction outflow', color: '#9a6a22', fill: 'rgba(154, 106, 34, 0.14)', values: monthly.map(row => row.constructionOutflow || 0) }
    ],
    value => window.VorcoCashFlowEngine.formatINR(value)
  );
}

function renderBridgeChart(planRows) {
  if (!bridgeChartBars) {
    return;
  }

  const hasBridge = planRows.some(row => row.bridgeThisMonth > 0 || row.cumulativeBridge > 0);
  if (!hasBridge) {
    bridgeChartBars.innerHTML = '<p class="mini-note">No bridge needed in this range.</p>';
    return;
  }

  renderInteractiveChart(
    bridgeChartBars,
    planRows.map(row => row.monthLabel),
    [
      {
        name: 'Monthly bridge',
        color: '#a0342d',
        fill: 'rgba(160, 52, 45, 0.2)',
        values: planRows.map(row => row.bridgeThisMonth)
      },
      {
        name: 'Cumulative bridge',
        color: '#3957a0',
        fill: 'rgba(57, 87, 160, 0.16)',
        values: planRows.map(row => row.cumulativeBridge)
      }
    ],
    value => window.VorcoCashFlowEngine.formatINR(value)
  );
}

function renderCriticalMonths(monthly) {
  criticalMonthsBody.innerHTML = '';
  monthly.forEach(row => {
    const isCritical = row.balance < 0 || row.outflow > row.inflow * 1.5;
    const tr = document.createElement('tr');
    if (isCritical) {
      tr.className = 'critical-row';
    }
    tr.innerHTML = `
      <td>${row.monthLabel}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.inflow)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.outflow)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(row.balance)}</td>
    `;
    criticalMonthsBody.appendChild(tr);
  });
}

function renderActions(result) {
  const required = Math.ceil(result.fundingGap || 0);
  const bridge = formatBridgeSchedule(result, required);
  const planRows = buildMonthlyFundingPlan(result);
  const firstRows = planRows.filter(row => row.bridgeThisMonth > 0).slice(0, 4);
  const monthlyNeedText = firstRows.length
    ? firstRows.map(row => `${row.monthLabel}: ${window.VorcoCashFlowEngine.formatINR(row.bridgeThisMonth)}`).join(' | ')
    : bridge.monthlyText;
  const timelineRelief = Math.ceil(required * 0.35);
  const salesRelief = Math.ceil(required * 0.25);

  actionEquity.textContent = required > 0
    ? `Extra cash needed by month: ${monthlyNeedText}`
    : 'No equity top-up is needed in this scenario.';

  actionTimeline.textContent = required > 0
    ? `Move one heavy spend package by 2 months to reduce pressure by about ${window.VorcoCashFlowEngine.formatINR(timelineRelief)}.`
    : 'Timeline is stable. Keep the sequence as is.';

  actionSales.textContent = required > 0
    ? `Increase early collections (booking +5%, faster conversion). Expected gap reduction is about ${window.VorcoCashFlowEngine.formatINR(salesRelief)}.`
    : 'Sales pace is healthy. Keep the current launch plan.';
}

function renderDecisionPanels(result, input) {
  const rootCauseBreakdown = buildRootCauseBreakdown(result);
  const recommendationOptions = buildRecommendationOptions(input, result);

  rootCauseList.innerHTML = rootCauseBreakdown.map(item => `
    <li>
      ${item.share}% → ${item.label}
      <span class="decision-meta">${formatCompactMoney(item.amount)}</span>
    </li>
  `).join('');

  fixOptionList.innerHTML = recommendationOptions.map(option => `
    <article class="fix-card ${option.gapChange >= 0 ? 'fix-card--good' : 'fix-card--warn'}">
      <div class="fix-card__head">
        <h3>${option.title}</h3>
        <span>Score ${option.weightedScore.toFixed(1)}</span>
      </div>
      <p>${option.headline}</p>
      <p class="mini-note">${option.note}</p>
      <p class="mini-note">Gap change: ${option.gapChange >= 0 ? '+' : ''}${formatCompactMoney(option.gapChange)} | Runway change: ${option.runwayChange >= 0 ? '+' : ''}${option.runwayChange} month(s)</p>
    </article>
  `).join('');

  if (recommendationOptions.length) {
    const bestOption = recommendationOptions.reduce((best, candidate) => (candidate.gapChange > best.gapChange ? candidate : best), recommendationOptions[0]);
    actionEquity.textContent = `${bestOption.title} gives the biggest improvement in this run.`;
    actionTimeline.textContent = recommendationOptions[1] ? recommendationOptions[1].headline : 'No second option available.';
    actionSales.textContent = recommendationOptions[2] ? recommendationOptions[2].headline : 'No sales option available.';
  }
}

function buildSensitivityDrivers(input, baseResult) {
  const tests = [
    { key: 'salesVelocity', label: 'Sales velocity', down: -0.1, up: 0.1 },
    { key: 'pricePerSqft', label: 'Price per sq ft', down: -0.08, up: 0.08 },
    { key: 'constructionCostPerSqft', label: 'Construction cost per sq ft', down: -0.08, up: 0.08 },
    { key: 'debtRateAnnual', label: 'Debt annual rate', down: -0.08, up: 0.08 },
    { key: 'delayMonths', label: 'Delay months', down: -0.5, up: 0.5, integer: true },
  ];

  return tests.map(test => {
    const downScenario = simulateScenario(input, scenario => {
      if (test.integer) {
        const delta = Math.max(1, Math.round(Number(scenario[test.key] || 0) * Math.abs(test.down)));
        scenario[test.key] = Math.max(0, Number(scenario[test.key] || 0) - delta);
      } else {
        scenario[test.key] = Math.max(0, Number(scenario[test.key] || 0) * (1 + test.down));
      }
    });

    const upScenario = simulateScenario(input, scenario => {
      if (test.integer) {
        const delta = Math.max(1, Math.round(Number(scenario[test.key] || 0) * Math.abs(test.up)));
        scenario[test.key] = Math.max(0, Number(scenario[test.key] || 0) + delta);
      } else {
        scenario[test.key] = Math.max(0, Number(scenario[test.key] || 0) * (1 + test.up));
      }
    });

    const downsideImpact = Number(downScenario.fundingGap || 0) - Number(baseResult.fundingGap || 0);
    const upsideImpact = Number(baseResult.fundingGap || 0) - Number(upScenario.fundingGap || 0);
    const netSensitivity = Math.abs(downsideImpact) + Math.abs(upsideImpact);

    return {
      label: test.label,
      downsideImpact,
      upsideImpact,
      netSensitivity,
    };
  }).sort((left, right) => right.netSensitivity - left.netSensitivity);
}

function renderSensitivityLayer(input, result) {
  if (!sensitivityBody || !topSensitivityDriver) return;
  const drivers = buildSensitivityDrivers(input, result);
  if (!drivers.length) {
    sensitivityBody.innerHTML = '<tr><td colspan="4">No sensitivity drivers available.</td></tr>';
    topSensitivityDriver.textContent = 'No sensitivity driver found.';
    return;
  }

  sensitivityBody.innerHTML = drivers.map(driver => `
    <tr>
      <td>${driver.label}</td>
      <td>${driver.downsideImpact >= 0 ? '+' : ''}${window.VorcoCashFlowEngine.formatINR(driver.downsideImpact)}</td>
      <td>${driver.upsideImpact >= 0 ? '+' : ''}${window.VorcoCashFlowEngine.formatINR(driver.upsideImpact)}</td>
      <td>${window.VorcoCashFlowEngine.formatINR(driver.netSensitivity)}</td>
    </tr>
  `).join('');

  const top = drivers[0];
  topSensitivityDriver.textContent = `Top break driver: ${top.label} (net sensitivity ${window.VorcoCashFlowEngine.formatINR(top.netSensitivity)}).`;
}

function renderGoNoGo(result, monte) {
  if (!goNoGoBadge) return;
  const failureProb = Number(monte?.failureProbability || 0);
  const gap = Number(result.fundingGap || 0);
  const totalCost = Number(result.metrics?.totalProjectCost || 0);
  const gapThreshold = Math.max(5000000, totalCost * 0.12);
  const reserveBreaches = Number(result.metrics?.reserveBreachMonths || 0);
  const unpaid = Number(result.metrics?.unpaidCommittedCost || 0);
  const totalDue = Number(result.metrics?.totalDueCost || 0);
  const unpaidRatio = totalDue > 0 ? (unpaid / totalDue) : 0;
  const months = Math.max(1, Number(result.monthly?.length || 1));
  const earlyFailure = Number(result.firstNegativeMonth || 0) > 0 && Number(result.firstNegativeMonth || 0) <= Math.round(months * 0.4);

  if (!result.firstNegativeMonth && failureProb < 0.2 && reserveBreaches <= 2 && unpaidRatio < 0.05) {
    goNoGoBadge.textContent = 'GO';
    return;
  }
  if (failureProb >= 0.6 || gap > gapThreshold || earlyFailure || reserveBreaches > Math.max(4, Math.round(months * 0.4)) || unpaidRatio >= 0.2) {
    goNoGoBadge.textContent = 'DO NOT START';
    return;
  }
  goNoGoBadge.textContent = 'CAUTION';
}

function renderInvestorSummary(result, input) {
  const report = buildReportRows(result, input);
  const monthlyBridge = (result.monthly || []).slice(0, 12).map((row, index) => ({
    month: row.monthIndex + 1 || index + 1,
    salesInflow: row.salesInflow || 0,
    projectOutflow: (row.landOutflow || 0) + (row.constructionOutflow || 0) + (row.softOutflow || 0) + (row.salesCommissionOutflow || 0),
    debtService: (row.interestOutflow || 0) + (row.debtPrincipalOutflow || 0),
    netCashflow: (row.inflow || 0) - (row.outflow || 0),
    cumulativeCashflow: row.balance || 0,
  }));

  const riskPlaybook = report.riskFlags.length ? report.riskFlags.map(flag => ({
    warning: flag,
    action: report.recommendation === 'Proceed' ? 'Keep current assumptions but validate the flagged area with the consultant.' : 'Tighten the assumption and rerun the downside case.',
    impact: 'Improves underwriting confidence and reduces execution noise.',
  })) : [{
    warning: 'No major risk flags in current scenario.',
    action: 'Maintain current assumptions and validate with consultant checks.',
    impact: 'Preserves model stability and strengthens execution confidence.',
  }];

  const sectionHtml = [];

  sectionHtml.push(`
    <section class="memo-cover">
      <div>
        <p class="cover-kicker">Investor-Facing Export</p>
        <p class="brand">OPTIBUILD | VORCO</p>
        <h1>Investment Memorandum Snapshot</h1>
        <p class="cover-copy">This pack is tailored for investor and partner decision rooms. It opens with thesis-level metrics and then expands into economics, risk posture, debt behavior, and execution readiness with print-ready structure.</p>
      </div>
      <div>
        <div class="cover-grid">
          <article class="cover-tile"><p>Project</p><strong>${report.projectName}</strong></article>
          <article class="cover-tile"><p>Location</p><strong>${report.projectLocation}</strong></article>
          <article class="cover-tile"><p>Developer / Client</p><strong>${report.developerName}</strong></article>
          <article class="cover-tile"><p>Scenario Stamp</p><strong>${report.scenarioStamp}</strong></article>
          <article class="cover-tile"><p>Confidentiality</p><strong>${report.confidentiality}</strong></article>
          <article class="cover-tile"><p>Version / Run ID</p><strong>${report.versionRunId}</strong></article>
          <article class="cover-tile"><p>Recommendation</p><strong>${report.recommendation}</strong></article>
          <article class="cover-tile"><p>ROI / Margin</p><strong>${report.roi.toFixed(1)}% / ${report.margin.toFixed(1)}%</strong></article>
          <article class="cover-tile"><p>Risk Posture</p><strong>${report.riskLabel}</strong></article>
        </div>
      </div>
    </section>
  `);

  sectionHtml.push(`
    <section class="executive-page">
      <div class="section-head">
        <div>
          <p class="eyebrow">Executive one-page summary</p>
          <h2>Investment decision snapshot</h2>
          <p class="section-note">Single-page overview before full underwriting detail: return quality, debt comfort, pricing spread, and liquidity signal.</p>
        </div>
      </div>
      <div class="executive-grid">
        ${buildMetricCard('Profit', formatMoney(report.profit))}
        ${buildMetricCard('ROI', formatPercent(report.roi))}
        ${buildMetricCard('Margin', formatPercent(report.margin))}
        ${buildMetricCard('Break-even Spread', formatPercent(report.breakEvenSpreadPct))}
        ${buildMetricCard('DSCR / ICR', (Number.isFinite(report.dscr) && Number.isFinite(report.icr)) ? `${formatFixed(report.dscr, 2)} / ${formatFixed(report.icr, 2)}` : 'N/A / N/A')}
        ${buildMetricCard('Peak Funding Gap', formatMoney(report.peakFundingGap))}
        ${buildMetricCard('Lender View', report.lenderView)}
        ${buildMetricCard('Liquidity View', report.liquidityView)}
      </div>
    </section>
  `);

  sectionHtml.push(`
    <header class="memo-hero">
      <div class="hero-top">
        <div>
          <p class="brand">OPTIBUILD | VORCO</p>
          <p>Comprehensive investor report with project assumptions, full financial stack, debt behavior, phasing, and execution risk details.</p>
        </div>
        <div class="hero-meta">
          <div>Generated: ${report.reportDate}, ${report.reportTime}</div>
          <div>Scenario: Live inputs</div>
          <div>Risk status: ${report.riskLabel}</div>
        </div>
      </div>

      <h1>Investment snapshot, underwriting thesis, and execution detail in one view.</h1>
      <p>This report blends assumptions, costs, revenues, financing, delay sensitivity, phase spend, BOQ-style allocation, and downside checks so the decision sits in one readable pack.</p>
      <div class="hero-status"><strong>Recommendation:</strong> ${report.recommendation}</div>

      <div class="hero-insights">
        <article class="insight-card">
          <p class="eyebrow">Underwriting view</p>
          <h3>${report.lenderView} debt profile with ${report.riskLabel.toLowerCase()} risk posture</h3>
          <p>${(Number.isFinite(report.dscr) && Number.isFinite(report.icr)) ? `${formatFixed(report.dscr, 2)} DSCR, ${formatFixed(report.icr, 2)} ICR, and ${report.peakFundingGap > 0 ? `peak funding gap of ${window.VorcoCashFlowEngine.formatINR(report.peakFundingGap)}` : 'no funding gap signal available'}.` : 'No debt service is used in this case.'}</p>
          <div class="insight-stat">${report.liquidityView} liquidity</div>
        </article>
        <article class="insight-card">
          <p class="eyebrow">Value capture</p>
          <h3>${formatMoney(report.profit)} profit on ${report.margin.toFixed(1)}% margin</h3>
          <p>Cost per saleable sq ft is ${formatMoney(report.costPerSqFt)} and net realization per saleable sq ft is ${formatMoney(report.netRevenuePerSqFt)}.</p>
          <div class="insight-stat">${formatMoney(report.profitPerSqFt)} profit / sq ft</div>
        </article>
        <article class="insight-card">
          <p class="eyebrow">Pricing cushion</p>
          <h3>${report.breakEvenSpreadPct.toFixed(1)}% above break-even</h3>
          <p>Sale price sits at ${formatMoney(Number(input.pricePerSqft || 0))} / sq ft against a break-even of ${formatMoney(report.breakEvenSalePrice)} / sq ft.</p>
          <div class="insight-stat">${formatMoney(Number(input.pricePerSqft || 0) - report.breakEvenSalePrice)} / sq ft spread</div>
        </article>
      </div>

      <div class="hero-kpis">
        <article class="hero-card"><p class="k">Profit</p><p class="v">${formatMoney(report.profit)}</p></article>
        <article class="hero-card"><p class="k">ROI</p><p class="v">${formatPercent(report.roi)}</p></article>
        <article class="hero-card"><p class="k">Margin</p><p class="v">${formatPercent(report.margin)}</p></article>
        <article class="hero-card"><p class="k">Break-even Price</p><p class="v">${formatMoney(report.breakEvenSalePrice)}</p></article>
        <article class="hero-card"><p class="k">Peak Funding Gap</p><p class="v">${formatMoney(report.peakFundingGap)}</p></article>
      </div>

      <div class="tag-row">
        <span class="chip ${report.recommendation === 'Proceed' ? 'ok' : 'warn'}">${report.recommendation}</span>
        <span class="chip ${report.riskFlags.length === 0 ? 'ok' : 'warn'}">${report.riskFlags.length} risk flags</span>
        <span class="chip">Equity ${formatPercent((report.equityInflow / Math.max(1, report.totalProjectCost)) * 100)}</span>
        <span class="chip">Net/Gross ${formatPercent((report.totalSalesCollected / Math.max(1, report.totalSalesCollected + report.commissionCost)) * 100)}</span>
        <span class="chip">Profit / 1,000 sq ft ${formatMoney(report.profit / Math.max(1, Number(input.saleableArea || 0) / 1000))}</span>
      </div>

      <div class="exec-strip">
        <article class="exec-tile"><p class="k">Lender View</p><p class="v ${report.lenderView === 'Comfortable' ? 'good' : report.lenderView === 'Tight' ? 'mid' : 'bad'}">${report.lenderView}</p></article>
        <article class="exec-tile"><p class="k">Liquidity</p><p class="v ${report.liquidityView === 'Controlled' ? 'good' : report.liquidityView === 'Tight' ? 'mid' : 'bad'}">${report.liquidityView}</p></article>
        <article class="exec-tile"><p class="k">Key Flags</p><p class="v ${report.riskFlags.length <= 1 ? 'good' : report.riskFlags.length <= 3 ? 'mid' : 'bad'}">${report.riskFlags.length}</p></article>
        <article class="exec-tile"><p class="k">Guardrails Triggered</p><p class="v ${report.riskFlags.length === 0 ? 'good' : 'mid'}">${report.riskFlags.length}</p></article>
      </div>
    </header>
  `);

  sectionHtml.push(buildReportSection('Executive summary', 'What the model is saying right now', `
    <div class="section-head">
      <div>
        <p class="eyebrow">Executive summary</p>
        <h2>What the model is saying right now</h2>
        <p class="section-note">This strip translates the core model into decision language: return, debt comfort, pricing cushion, and execution pressure.</p>
      </div>
      <span class="chip ${report.riskFlags.length === 0 ? 'ok' : 'warn'}">${report.riskLabel} / ${report.lenderView}</span>
    </div>
    <div class="highlight-grid">
      <article class="highlight-card">
        <p class="eyebrow">Return profile</p>
        <strong>${formatMoney(report.profit)}</strong>
        <p>Profit on the current case with a ${report.margin.toFixed(1)}% margin and ${report.roi.toFixed(1)}% ROI.</p>
      </article>
      <article class="highlight-card">
        <p class="eyebrow">Debt profile</p>
        <strong>${Number.isFinite(report.dscr) ? `DSCR ${formatFixed(report.dscr, 2)}` : 'N/A'}</strong>
        <p>${Number.isFinite(report.icr) ? `${formatFixed(report.icr, 2)} ICR, ${result.recoveryMonth ? `payback by month ${result.recoveryMonth}` : 'no payback within the modeled horizon'}, and ${report.liquidityView.toLowerCase()} liquidity.` : 'No debt service is used in this case.'}</p>
      </article>
      <article class="highlight-card">
        <p class="eyebrow">Execution profile</p>
        <strong>${report.executionPressurePct.toFixed(1)}% concentrated</strong>
        <p>Top phase concentration is ${report.phaseTop[0]?.name || 'not available'}, so procurement discipline matters most there.</p>
      </article>
    </div>
  `));

  sectionHtml.push(`
    <section class="report-band">
      <article class="band-card">
        <h3>Investment Readiness Score: ${report.healthScore}/100</h3>
        <p>Composite signal derived from return, debt health, and current risk flag count.</p>
        <div class="meter"><span style="width:${report.healthScore}%"></span></div>
      </article>
      <article class="band-card">
        <h3>Capital Intensity: ${report.capitalIntensityPct.toFixed(1)}%</h3>
        <p>Share of total project cost concentrated in construction plus finance burden.</p>
        <div class="meter"><span style="width:${report.capitalIntensityPct.toFixed(1)}%"></span></div>
      </article>
      <article class="band-card">
        <h3>Execution Pressure: ${report.executionPressurePct.toFixed(1)}%</h3>
        <p>Top phase concentration signal; high values need tighter procurement governance.</p>
        <div class="meter"><span style="width:${report.executionPressurePct.toFixed(1)}%"></span></div>
      </article>
    </section>
  `);

  sectionHtml.push(`
    <div class="section-grid">
      <section class="block memo-block">
        <h2>Credit and Return Health</h2>
        <div class="status-row">
          <article class="status-tile"><p class="k">ROI Quality</p><p class="v ${report.recommendation === 'Proceed' ? 'good' : 'mid'}">${formatPercent(report.roi)}</p></article>
          <article class="status-tile"><p class="k">DSCR</p><p class="v">${report.dscr === null ? 'N/A' : report.dscr.toFixed(2)}</p></article>
          <article class="status-tile"><p class="k">Interest Coverage</p><p class="v">${report.icr === null ? 'N/A' : report.icr.toFixed(2)}</p></article>
          <article class="status-tile"><p class="k">Payback</p><p class="v">${result.recoveryMonth ? `M${result.recoveryMonth}` : 'N/A'}</p></article>
        </div>
        <div class="summary-rows">
          ${buildRows([
            ['Chosen Sale Price', `${formatMoney(Number(input.pricePerSqft || 0))} / sq ft`],
            ['Margin Safety Buffer', formatPercent(report.breakEvenSpreadPct)],
            ['Risk Score', `${report.healthScore}/100`],
            ['Sale Price vs Break-even', formatPercent(report.breakEvenSpreadPct)],
          ])}
        </div>
      </section>

      <section class="block memo-block">
        <h2>Project Configuration Inputs</h2>
        <div class="summary-rows">
          ${buildRows([
            ['Saleable Area', `${Number(input.saleableArea || 0).toLocaleString('en-IN')} sq ft`],
            ['Price / sq ft', formatMoney(Number(input.pricePerSqft || 0))],
            ['Construction Cost / sq ft', formatMoney(Number(input.constructionCostPerSqft || 0))],
            ['Land Cost', formatMoney(Number(input.landTotalCost || 0))],
            ['Starting Cash', formatMoney(Number(input.openingCash || 0))],
            ['Sales Start Month', `Month ${Number(input.salesStartMonth || 0)}`],
            ['Sales Speed', String(input.salesVelocity ? input.salesVelocity.toFixed(0) : 'Normal')],
            ['Project Duration', `${Number(input.projectMonths || 0)} months`],
            ['Debt Limit', formatMoney(Number(input.debtLimit || 0))],
            ['Debt Rate / Coverage', `${Number(input.debtRateAnnual || 0).toFixed(2)} / ${formatPercent((Number(input.debtCoveragePct || 0) * 100), 0)}`],
          ])}
        </div>
      </section>
    </div>
  `);

  sectionHtml.push(`
    <div class="section-grid">
      <section class="block memo-block">
        <h2>Area and Sellability Stack</h2>
        <div class="grid memo-metric-grid">
          ${buildMetricCard('Saleable Area', `${Number(input.saleableArea || 0).toLocaleString('en-IN')} sq ft`)}
          ${buildMetricCard('Construction Cost / sq ft', formatMoney(Number(input.constructionCostPerSqft || 0)))}
          ${buildMetricCard('Land Cost', formatMoney(Number(input.landTotalCost || 0)))}
          ${buildMetricCard('Opening Cash', formatMoney(Number(input.openingCash || 0)))}
          ${buildMetricCard('Debt Limit', formatMoney(Number(input.debtLimit || 0)))}
          ${buildMetricCard('Sales Start', `Month ${Number(input.salesStartMonth || 0)}`)}
          ${buildMetricCard('Sales Speed', String(input.salesVelocity ? input.salesVelocity.toFixed(0) : 'Normal'))}
          ${buildMetricCard('Min Reserve', formatMoney(Number(input.minCashReserve || 0)))}
        </div>
        <div class="summary-rows compact-summary">
          ${buildRows([
            ['Cost / Sq Ft', formatMoney(report.costPerSqFt)],
            ['Net Revenue / Sq Ft', formatMoney(report.netRevenuePerSqFt)],
            ['Profit / Sq Ft', formatMoney(report.profitPerSqFt)],
            ['Net Revenue', formatMoney(report.totalSalesCollected)],
            ['Gross Revenue', formatMoney(Number(input.saleableArea || 0) * Number(input.pricePerSqft || 0))],
          ])}
        </div>
      </section>

      <section class="block memo-block">
        <h2>Revenue Waterfall Summary</h2>
        <div class="summary-rows">
          ${buildRows([
            ['Base Gross Revenue', formatMoney(Number(input.saleableArea || 0) * Number(input.pricePerSqft || 0))],
            ['Total Gross Revenue', formatMoney(report.totalSalesCollected)],
            ['Mix Revenue Impact', `${formatMoney(report.totalSalesCollected - (Number(input.saleableArea || 0) * Number(input.pricePerSqft || 0)))} (live collections)`],
            ['Realized Gross (Sold %)', formatMoney(report.totalSalesCollected)],
            ['Collection Friction', formatMoney(report.commissionCost)],
            ['Net Collections', formatMoney(report.totalSalesCollected - report.commissionCost)],
            ['Net Revenue', formatMoney(report.totalSalesCollected - report.commissionCost)],
          ])}
        </div>
      </section>
    </div>
  `);

  sectionHtml.push(`
    <div class="section-grid">
      <section class="block memo-block">
        <h2>Cost Stack and Allocation</h2>
        <p class="allocation-note">Distribution of capital deployment across land, construction and finance/other burden. Shares are normalized to 100%.</p>
        <div class="mini-bar-wrap">
          <div class="mini-row">
            <span>Land</span>
            <div class="mini-track"><div class="mini-fill mini-land" style="width:${report.totalProjectCost > 0 ? ((report.landCost / report.totalProjectCost) * 100).toFixed(1) : 0}%"></div></div>
            <strong>${report.totalProjectCost > 0 ? ((report.landCost / report.totalProjectCost) * 100).toFixed(1) : 0}%</strong>
          </div>
          <div class="mini-row">
            <span>Construction</span>
            <div class="mini-track"><div class="mini-fill mini-construction" style="width:${report.totalProjectCost > 0 ? ((report.constructionCost / report.totalProjectCost) * 100).toFixed(1) : 0}%"></div></div>
            <strong>${report.totalProjectCost > 0 ? ((report.constructionCost / report.totalProjectCost) * 100).toFixed(1) : 0}%</strong>
          </div>
          <div class="mini-row">
            <span>Finance + Other</span>
            <div class="mini-track"><div class="mini-fill mini-finance" style="width:${report.totalProjectCost > 0 ? (((report.softCost + report.commissionCost + report.interestCost) / report.totalProjectCost) * 100).toFixed(1) : 0}%"></div></div>
            <strong>${report.totalProjectCost > 0 ? (((report.softCost + report.commissionCost + report.interestCost) / report.totalProjectCost) * 100).toFixed(1) : 0}%</strong>
          </div>
        </div>
        <div class="summary-rows" style="margin-top:8px;">
          ${buildRows([
            ['Land Cost', formatMoney(report.landCost)],
            ['Soft Cost', formatMoney(report.softCost)],
            ['Statutory Cost', formatMoney(report.statutoryCost)],
            ['Construction', formatMoney(report.constructionCost)],
            ['Sales Commission', formatMoney(report.commissionCost)],
            ['Transaction Fees', formatMoney(report.transactionCost + report.debtDrawFeeCost)],
            ['Interest Cost', formatMoney(report.interestCost)],
            ['Total Cost', formatMoney(report.totalProjectCost)],
          ])}
        </div>
      </section>

      <section class="block memo-block">
        <h2>Financing and Loan Behavior</h2>
        <div class="summary-rows">
          ${buildRows([
            ['Project Before Finance', formatMoney(report.baseProjectCost)],
            ['Financed Principal', formatMoney(report.debtDrawn)],
            ['Monthly Debt Service', formatMoney(report.debtService / Math.max(1, Math.min(12, (result.monthly || []).length)))],
            ['Total Loan Principal Repaid', formatMoney(report.principalCost)],
            ['Total Loan Interest', formatMoney(report.interestCost)],
            ['Loan Break-even Month', report.debtBreakEvenMonth ? `M${report.debtBreakEvenMonth}` : 'Beyond horizon'],
            ['Loan Active Through', report.loanActiveThrough],
            ['Loan Horizon Used', `${Number(input.projectMonths || 0)} months`],
          ])}
        </div>
      </section>
    </div>
  `);

  sectionHtml.push(`
    <div class="section-grid">
      <section class="block memo-block">
        <h2>Delay and Timeline Effects</h2>
        <div class="summary-rows">
          ${buildRows([
            ['Planning Delay Months', '0'],
            ['Approval Delay Months', '0'],
            ['Execution Delay Months', String(report.salesDelayMonths)],
            ['Sales Delay Months', String(report.salesDelayMonths)],
            ['Effective Delay Months (Costing)', String(report.totalDelayMonths)],
            ['Planning Delay Cost', formatMoney(0)],
            ['Approval Delay Cost', formatMoney(0)],
            ['Execution Delay Cost', formatMoney(report.interestCost * 0.25)],
            ['Sales Delay Effect', formatMoney(report.totalSalesCollected * 0.03)],
            ['Total Delay Carry', formatMoney(report.totalDelayMonths > 0 ? report.interestCost : 0)],
          ])}
        </div>
      </section>

      <section class="block memo-block">
        <h2>Liquidity, Phasing and Breakeven</h2>
        <div class="summary-rows">
          ${buildRows([
            ['Cashflow Peak Funding Gap', formatMoney(report.peakFundingGap)],
            ['Peak Gap Month', result.maximumDeficit > 0 ? `M${(result.monthly || []).find(row => row.balance === Math.min(...result.monthly.map(item => item.balance)))?.monthIndex + 1 || 'N/A'}` : 'N/A'],
            ['Cashflow Break-even Month', result.recoveryMonth ? `M${result.recoveryMonth}` : 'Beyond horizon'],
            ['Cashflow Horizon', `${result.runwayMonths} months`],
            ['Sales Start Month', `M${Number(input.salesStartMonth || 0)}`],
            ['Sales Curve', 'Realistic'],
            ['Cost Curve', 'Realistic'],
          ])}
        </div>
      </section>
    </div>
  `);

  sectionHtml.push(`
    <section class="block memo-block">
      <h2>Debt and Cashflow Bridge (First 12 Active Months)</h2>
      <p class="allocation-note">Quick lender-friendly bridge of inflow, outflow, debt service, and net monthly position.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Sales Inflow</th>
              <th>Project Outflow</th>
              <th>Debt Service</th>
              <th>Net Cashflow</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyBridge.map(row => `
              <tr>
                <td>M${row.month}</td>
                <td>${formatMoney(row.salesInflow)}</td>
                <td>${formatMoney(row.projectOutflow)}</td>
                <td>${formatMoney(row.debtService)}</td>
                <td>${formatMoney(row.netCashflow)}</td>
                <td>${formatMoney(row.cumulativeCashflow)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `);

  sectionHtml.push(`
    <section class="block memo-block">
      <h2>Scenario Grid (Price Sensitivity)</h2>
      <div class="scenario-grid">
        <article class="scenario-card good">
          <h3>Conservative</h3>
          <div class="summary-rows">
            ${buildRows([
              ['Price / sq ft', formatMoney(report.conservative.price)],
              ['Profit', formatMoney(report.conservative.profit)],
              ['ROI', formatPercent(report.conservative.roi)],
            ])}
          </div>
        </article>
        <article class="scenario-card mid">
          <h3>Base</h3>
          <div class="summary-rows">
            ${buildRows([
              ['Price / sq ft', formatMoney(report.base.price)],
              ['Profit', formatMoney(report.base.profit)],
              ['ROI', formatPercent(report.base.roi)],
            ])}
          </div>
        </article>
        <article class="scenario-card strong">
          <h3>Optimistic</h3>
          <div class="summary-rows">
            ${buildRows([
              ['Price / sq ft', formatMoney(report.optimistic.price)],
              ['Profit', formatMoney(report.optimistic.profit)],
              ['ROI', formatPercent(report.optimistic.roi)],
            ])}
          </div>
        </article>
      </div>
    </section>
  `);

  sectionHtml.push(`
    <section class="block memo-block">
      <h2>Construction Phase Timeline Detail</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${(report.phaseTop.length ? report.phaseTop : [{ name: 'No phases', start: 0, end: 0, duration: 0, amount: 0 }])
              .map(phase => `
                <tr>
                  <td>${phase.name}</td>
                  <td>${phase.start ? `M${phase.start}` : 'N/A'}</td>
                  <td>${phase.end ? `M${phase.end}` : 'N/A'}</td>
                  <td>${phase.duration ? `${phase.duration} months` : 'N/A'}</td>
                  <td>${formatMoney(phase.amount)}</td>
                </tr>
              `)
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `);

  sectionHtml.push(`
    <div class="section-grid">
      <section class="block memo-block">
        <h2>Model Integrity Check</h2>
        <div class="audit-grid">
          <article class="audit-card">
            <h3>Cost Reconciliation</h3>
            <div class="audit-row"><span>Model Total Cost</span><strong>${formatMoney(report.totalProjectCost)}</strong></div>
            <div class="audit-row"><span>Timeline Allocated Spend</span><strong>${formatMoney(report.timelineSpendTotal)}</strong></div>
            <div class="audit-row"><span>Reconciliation Gap</span><strong>${formatMoney(report.reconciliationGap)}</strong></div>
            <div class="audit-row"><span>Status</span><strong><span class="chip ${report.reconciliationStatus === 'Matched' ? 'ok' : 'warn'}">${report.reconciliationStatus}</span></strong></div>
          </article>
          <article class="audit-card">
            <h3>Decision Signals</h3>
            <div class="audit-row"><span>Recommendation</span><strong>${report.recommendation}</strong></div>
            <div class="audit-row"><span>Risk Flags</span><strong>${report.riskFlags.length}</strong></div>
            <div class="audit-row"><span>Peak Funding Gap</span><strong>${formatMoney(report.peakFundingGap)}</strong></div>
            <div class="audit-row"><span>Cashflow Break-even</span><strong>${result.recoveryMonth ? `M${result.recoveryMonth}` : 'Beyond horizon'}</strong></div>
          </article>
        </div>
      </section>

      <section class="block memo-block">
        <h2>Execution Focus Areas</h2>
        <p class="allocation-note">Highest cost concentration phases that require strict procurement and execution control.</p>
        <div class="focus-list">
          ${(report.phaseTop.length ? report.phaseTop : [{ name: 'No active phases', start: 0, end: 0, share: 0, amount: 0 }])
            .map(phase => `
              <article class="focus-item">
                <div class="focus-head">
                  <span>${phase.name} (${phase.start ? `M${phase.start}` : 'N/A'}-${phase.end ? `M${phase.end}` : 'N/A'})</span>
                  <span>${phase.share.toFixed(1)}%</span>
                </div>
                <div class="focus-bar"><span style="width:${Math.max(0, Math.min(100, phase.share)).toFixed(2)}%"></span></div>
                <div class="audit-row" style="border-bottom:0; padding-bottom:0;"><span>Amount</span><strong>${formatMoney(phase.amount)}</strong></div>
              </article>
            `)
            .join('')}
        </div>
      </section>
    </div>
  `);

  sectionHtml.push(`
    <section class="block memo-block">
      <h2>Risk and Mitigation Playbook</h2>
      <p class="allocation-note">Action-oriented responses for current warning set, framed for investment committee review.</p>
      <div class="table-wrap">
        <table class="playbook-table">
          <thead>
            <tr>
              <th>Observed Risk</th>
              <th>Recommended Mitigation</th>
              <th>Expected Effect</th>
            </tr>
          </thead>
          <tbody>
            ${riskPlaybook.map(item => `
              <tr>
                <td>${item.warning}</td>
                <td>${item.action}</td>
                <td>${item.impact}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `);

  sectionHtml.push(`<p class="footer">OptiBuild | VORCO investor report generated from live calculator inputs. Verify assumptions with your project consultant, valuation expert, and lenders before execution.</p>`);

  investorReportContent.innerHTML = sectionHtml.join('');
}

function renderTruth(result) {
  const supportMode = monthlySupportMode?.value || 'required-bridge';
  if (result.firstNegativeMonth) {
    const bridge = formatBridgeSchedule(result, result.fundingGap || 0);
    if (supportMode === 'no-bridge') {
      truthStatement.textContent = `No-support mode: project runs out of cash in Month ${result.firstNegativeMonth}. Estimated gap without support: ${window.VorcoCashFlowEngine.formatINR(result.fundingGap)}.`;
      decisionHeadline.textContent = 'Failure risk view';
      decisionDetail.textContent = 'This view does not inject bridge cash. Use it to assess true failure risk.';
    } else {
      truthStatement.textContent = `Cash gap starts in Month ${result.firstNegativeMonth}. Estimated extra cash needed: ${window.VorcoCashFlowEngine.formatINR(result.fundingGap)}.`;
      decisionHeadline.textContent = 'Monthly cash plan';
      decisionDetail.textContent = result.firstNegativeMonth <= 2
        ? `Gap starts early because costs begin before collections. Suggested support window: Months ${bridge.monthWindow}.`
        : `Suggested support window: Months ${bridge.monthWindow}.`;
    }
  } else {
    const unpaid = Number(result.metrics?.unpaidCommittedCost || 0);
    if (unpaid > 0) {
      truthStatement.textContent = `Cash stays positive, but unpaid committed obligations remain ${window.VorcoCashFlowEngine.formatINR(unpaid)}.`;
      decisionHeadline.textContent = 'Liquidity is positive but execution risk remains';
      decisionDetail.textContent = 'Cash does not go negative, but committed obligations are not fully payable on schedule.';
    } else {
      truthStatement.textContent = 'Cash flow stays positive for all modeled months.';
      decisionHeadline.textContent = 'No extra cash needed';
      decisionDetail.textContent = 'This base case stays cash-positive every month.';
    }
  }
}

function render(result, input, monte = null, runId = latestRunId) {
  latestResult = result;
  latestInput = input;
  latestMonteCarlo = monte;
  const breachRunway = result.firstNegativeMonth ? Math.max(0, result.firstNegativeMonth - 1) : result.runwayMonths;
  runwayValue.textContent = `${breachRunway} months`;
  negativeMonthValue.textContent = result.firstNegativeMonth ? `Month ${result.firstNegativeMonth}` : 'None';
  fundingGapValue.textContent = result.fundingGap > 0 ? window.VorcoCashFlowEngine.formatINR(result.fundingGap) : 'No gap';
  maxDeficitValue.textContent = result.maximumDeficit > 0 ? window.VorcoCashFlowEngine.formatINR(result.maximumDeficit) : 'No deficit';
  recoveryMonthValue.textContent = result.recoveryMonth ? `Month ${result.recoveryMonth}` : 'No recovery in horizon';
  endingCashValue.textContent = window.VorcoCashFlowEngine.formatINR(result.endingCash);
  totalInflowValue.textContent = window.VorcoCashFlowEngine.formatINR(result.totalInflow);
  totalOutflowValue.textContent = window.VorcoCashFlowEngine.formatINR(result.totalOutflow);
  interestCostValue.textContent = window.VorcoCashFlowEngine.formatINR(result.metrics.totalInterestOutflow || 0);
  endingDebtValue.textContent = window.VorcoCashFlowEngine.formatINR(result.metrics.endingDebtOutstanding || 0);
  debtDependencyValue.textContent = `${(result.metrics.debtDependencyPct || 0).toFixed(1)}%`;
  avgSalesValue.textContent = window.VorcoCashFlowEngine.formatINR(result.metrics.avgSalesInflow || 0);
  healthScoreValue.textContent = `${result.metrics.healthScore || 0}/100`;
  peakDebtValue.textContent = window.VorcoCashFlowEngine.formatINR(result.metrics.peakDebtOutstanding || 0);
  decisionRunwayValue.textContent = `${breachRunway} months`;
  decisionNegativeMonthValue.textContent = result.firstNegativeMonth ? `Month ${result.firstNegativeMonth}` : 'None';
  decisionFundingGapValue.textContent = result.fundingGap > 0 ? window.VorcoCashFlowEngine.formatINR(result.fundingGap) : 'No gap';

  renderTruth(result);
  renderFailureRisk(result);
  renderCommitmentLayer(result);
  renderMonthlyFundingPlan(result);
  renderFundingFocus(result);
  renderStressBridgePlan(result, input);
  if (monte) {
    renderMonteCarloLayer(monte);
  }
  renderModelAudit(result, input);
  renderTrustLayer(result, input, monte, runId);
  renderSensitivityLayer(input, result);
  renderGoNoGo(result, monte);
  renderActions(result);
  renderDecisionPanels(result, input);
  if (ENABLE_FULL_REPORTING) {
    renderInvestorSummary(result, input);
  }

  if (summaryText) {
    summaryText.textContent = result.firstNegativeMonth
      ? `Gujarat model: first shortfall in Month ${result.firstNegativeMonth}, peak bridge ${window.VorcoCashFlowEngine.formatINR(result.fundingGap)}, ending cash ${window.VorcoCashFlowEngine.formatINR(result.endingCash)}, IRR proxy ${Number.isFinite(result.metrics?.leveredIrrAnnual) ? `${(result.metrics.leveredIrrAnnual * 100).toFixed(1)}%` : 'N/A'}.`
      : `Gujarat model: cash remains positive through Month ${result.monthly.length}. Ending cash ${window.VorcoCashFlowEngine.formatINR(result.endingCash)}, IRR proxy ${Number.isFinite(result.metrics?.leveredIrrAnnual) ? `${(result.metrics.leveredIrrAnnual * 100).toFixed(1)}%` : 'N/A'}.`;
  }

  if (riskList) {
    renderList(riskList, result.risks.length ? result.risks : ['No high-risk signal in this scenario.']);
  }

  if (chartRangeSelect && chartBars && cumulativeChartBars && debtChartBars && criticalMonthsBody) {
    const rangeValue = chartRangeSelect.value;
    const rangeLimit = rangeValue === 'full' ? result.monthly.length : Number(rangeValue);
    const monthlySlice = result.monthly.slice(0, Math.max(1, Math.min(rangeLimit, result.monthly.length)));
    const graphSlice = monthlySlice.map(row => ({
      month: row.monthLabel,
      inflow: Number(row.inflow || 0),
      outflow: Number(row.outflow || 0),
      balance: Number(row.balance || 0),
    }));
    const bridgePlanSlice = buildMonthlyFundingPlan({ monthly: monthlySlice });

    renderChart(graphSlice);
    renderBridgeChart(bridgePlanSlice);
    renderCumulativeChart(graphSlice);
    renderDebtChart(monthlySlice);
    renderCriticalMonths(monthlySlice);
  }

  if (result.firstNegativeMonth) {
    if (statusBadge && statusText) {
      statusBadge.textContent = 'Bridge planning needed';
      statusBadge.style.background = 'rgba(160, 52, 45, 0.18)';
      statusBadge.style.color = 'var(--danger)';
      statusText.textContent = `First shortfall starts in Month ${result.firstNegativeMonth}. Use the monthly bridge plan and actions below.`;
    }
  } else {
    if (statusBadge && statusText) {
      statusBadge.textContent = 'Stable runway';
      statusBadge.style.background = 'rgba(47, 106, 68, 0.12)';
      statusBadge.style.color = 'var(--safe)';
      statusText.textContent = 'Scenario is cash-positive with current assumptions.';
    }
  }
}

function runSimulation() {
  if (!window.VorcoCashFlowEngine || typeof window.VorcoCashFlowEngine.simulateCashFlow !== 'function') {
    throw new Error('Engine failed to load. Please refresh the page.');
  }

  const input = readInputs();
  scenarioCache = new Map();
  validateInputConsistency(input);
  if (!isInputReady(input)) {
    renderEmptyState(input);
    const missing = getMissingCoreInputs(input);
    if (missing.length) {
      truthStatement.textContent = `Missing required inputs: ${missing.join(', ')}.`;
      decisionHeadline.textContent = 'Input needed';
      decisionDetail.textContent = 'Fill these fields, then click Analyze Project again.';
    }
    return;
  }
  const result = window.VorcoCashFlowEngine.simulateCashFlow(input);
  const monte = runMonteCarloBands(input, 120);
  const generatedAt = new Date();
  latestRunId = `RUN-${generatedAt.getFullYear()}${String(generatedAt.getMonth() + 1).padStart(2, '0')}${String(generatedAt.getDate()).padStart(2, '0')}-${String(generatedAt.getHours()).padStart(2, '0')}${String(generatedAt.getMinutes()).padStart(2, '0')}${String(generatedAt.getSeconds()).padStart(2, '0')}`;
  render(result, input, monte, latestRunId);
}

function updateProductModeUI() {
  const isSimpleMode = (productMode?.value || 'simple') === 'simple';
  if (advancedPanel) {
    advancedPanel.classList.toggle('is-hidden', isSimpleMode);
  }
}

updateProductModeUI();

if (productMode) {
  productMode.addEventListener('change', () => {
    updateProductModeUI();
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (statusCard) {
    statusCard.classList.remove('is-hidden');
  }
  resultsPanel.classList.remove('is-hidden');
  resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setAnalyzingState(true);

  try {
    runSimulation();
  } catch (error) {
    if (statusBadge && statusText) {
      statusBadge.textContent = 'Input error';
      statusBadge.style.background = 'rgba(154, 106, 34, 0.18)';
      statusBadge.style.color = 'var(--warn)';
      statusText.textContent = error.message;
    }
    truthStatement.textContent = error.message;
    decisionHeadline.textContent = 'Unable to run model';
    decisionDetail.textContent = 'Please fix inputs or refresh and try again.';
  } finally {
    setAnalyzingState(false);
  }
});

if (monthlyFundingView) {
  monthlyFundingView.addEventListener('change', () => {
    if (latestResult && latestInput) {
      render(latestResult, latestInput, latestMonteCarlo, latestRunId);
    }
  });
}

if (monthlySupportMode) {
  monthlySupportMode.addEventListener('change', () => {
    if (latestResult && latestInput) {
      render(latestResult, latestInput, latestMonteCarlo, latestRunId);
    }
  });
}

if (chartRangeSelect) {
  chartRangeSelect.addEventListener('change', () => {
    if (latestResult) {
      render(latestResult, latestInput, latestMonteCarlo, latestRunId);
    }
  });
}

if (seriesToggleGroup) {
  seriesToggleGroup.addEventListener('change', () => {
    if (latestResult) {
      render(latestResult, latestInput, latestMonteCarlo, latestRunId);
    }
  });
}

if (ENABLE_FULL_REPORTING && printSummaryBtn) {
  printSummaryBtn.addEventListener('click', () => {
    window.print();
  });
}

try {
  runSimulation();
} catch (error) {
  renderEmptyState({});
  truthStatement.textContent = 'Enter core inputs and click Analyze Project.';
}
