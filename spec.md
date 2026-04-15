# Cash Flow Intelligence Engine Spec

## Problem
Developers lose projects when cash inflows and outflows are not aligned in time.

## Primary user
Real estate developers and project finance teams.

## Core output
- Cash runway by month
- Funding gap alerts
- Cash shortfall month
- Suggested actions to reduce liquidity pressure

## Product promise
Tell the user when the project will run out of cash, why it happens, and what action can fix it.

## Success criteria
- The user can see monthly cash position for the full project timeline
- The user can identify the first negative cash month
- The user can test delays and funding changes quickly
- The user can see a simple recommendation for the best next move

## Key modules
### 1. Cash timeline
Tracks opening cash, inflows, outflows, and closing cash by month.

### 2. Scenario engine
Lets the user test delay, sales slowdown, cost escalation, or funding changes.

### 3. Alert engine
Flags the first month of negative cash and any funding gaps before they happen.

### 4. Recommendation engine
Suggests practical fixes such as delaying a phase, shifting payments, or reducing short-term spend.

## Main user
Real estate developer, project controller, or consultant managing project finance.

## Secondary users
- Investor or lender reviewing project viability
- Architect or consultant checking whether design choices affect cash pressure

## MVP scope
- Monthly cash flow table
- Runway chart or timeline
- Funding gap detection
- Delay scenario comparison
- Recommendation block

## Non-goals for MVP
- Full accounting system
- Tax reporting
- Multi-project portfolio dashboard
- Deep ERP integration

## Inputs
- Construction timeline
- Sales inflow schedule
- Loan drawdowns
- Contractor payments
- Material payments
- Interest outflow

## First MVP scope
- Monthly cash flow model
- Scenario switching
- Delay impact on runway
- Simple recommendation output
