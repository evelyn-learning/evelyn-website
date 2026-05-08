/**
 * AP Macroeconomics — CED Unit 4.7: The Loanable Funds Market.
 *
 * Real-interest-rate determination via supply (saving) and demand
 * (investment + government borrowing). The model behind crowding-out.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_LOANABLE_FUNDS: LessonPlan = {
  id: 'evelyn.ap.macro.loanable-funds-market.v1',
  title: 'The Loanable Funds Market',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.loanable-funds-market',
      description:
        'Construct the loanable funds market diagram with upward-sloping S (saving) and downward-sloping D (investment + government borrowing), identify what shifts each curve, and use the model to explain crowding-out from government deficit financing.',
      standard: 'AP-MACRO-4.7',
    },
  ],
  prerequisites: ['apmacro.monetary-policy'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the loanable funds market as where REAL interest rates are set.',
      script:
        "The money market sets the nominal interest rate. The loanable funds market sets the REAL interest rate — the one firms care about for investment, the one savers care about for purchasing-power return. These are the same physical economy seen through different lenses; AP wants you to know both.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-loanable-funds',
      kind: 'concept',
      goal: 'Cover the loanable funds diagram, what shifts each curve, and the crowding-out application.',
      keyIdeas: [
        'AXES: y-axis is REAL INTEREST RATE (r). x-axis is QUANTITY OF LOANABLE FUNDS. AP convention.',
        'SUPPLY (S): UPWARD-SLOPING. Higher real interest rates encourage MORE SAVING (households defer consumption to earn the higher real return). At any rate, supply comes from household savings + business retained earnings + government surpluses (rare) + foreign saving (capital inflows).',
        'DEMAND (D): DOWNWARD-SLOPING. Higher real interest rates make borrowing for investment LESS attractive (more projects fail the cost-benefit test). At any rate, demand comes from firms (investment), households (mortgages, durable goods), and government (deficit financing).',
        'EQUILIBRIUM REAL INTEREST RATE: where S intersects D. At r*, quantity of saving supplied equals quantity of borrowing demanded.',
        'WHAT SHIFTS S: (a) household saving rate changes (cultural shifts, demographic changes, retirement-account incentives). (b) Tax policy on savings (higher cap-gains tax discourages, lower encourages). (c) Foreign capital inflows / outflows. (d) Government surplus or deficit changes (surplus increases public saving; deficit decreases it).',
        'WHAT SHIFTS D: (a) firms\' investment-opportunity expectations (better tech outlook → D right; recession fears → D left). (b) Government deficit borrowing (deficit raises D; surplus or smaller deficit lowers D). (c) Household borrowing demand (consumer confidence, housing market). (d) Foreign borrowing.',
        'CROWDING-OUT VIA THIS MODEL: when government runs a DEFICIT, it competes with private borrowers for loanable funds. Government borrowing shifts D RIGHTWARD. Equilibrium r RISES. Higher real rates discourage private I (firms postpone projects). Some of the fiscal stimulus is OFFSET by reduced private investment. This is the loanable-funds-market mechanism behind crowding-out (mentioned in U3.8).',
        'CONNECTION TO MONEY MARKET: nominal i (money market) = real r (loanable funds) + expected inflation. Both markets respond to similar shocks but through different curves. AP often gives FRQs that ask you to draw BOTH and trace effects through both.',
      ],
      vocabulary: [
        { term: 'loanable funds market', definition: 'the market in which savers (suppliers) and borrowers (demanders) interact to determine the real interest rate.' },
        { term: 'crowding out', definition: 'reduction in private investment due to government deficit financing raising the real interest rate.' },
      ],
      suggestedTools: ['loanable_funds'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-deficit-crowding',
      kind: 'worked_example',
      problem:
        "The U.S. government enacts a $1 trillion fiscal stimulus financed entirely by deficit borrowing. (a) Identify the effect on the loanable funds market — which curve shifts and in which direction. (b) Identify the effect on the equilibrium real interest rate. (c) Identify the effect on private investment (I). (d) Explain how this is the loanable-funds-market mechanism behind \"crowding out.\"",
      steps: [
        'STEP 1 — EVENT: government issues $1T in new bonds to finance the deficit. This is government BORROWING from the loanable funds market.',
        'STEP 2 — DEMAND CURVE SHIFTS RIGHTWARD. At any given real interest rate, total demand for loanable funds is now $1T higher (government adds its borrowing on top of private demand).',
        'STEP 3 — NEW EQUILIBRIUM. With unchanged S and rightward-shifted D, equilibrium r RISES. Higher real interest rate.',
        'STEP 4 — EFFECT ON PRIVATE INVESTMENT. At the new higher r, fewer private investment projects clear the cost-benefit threshold. Private I FALLS. The amount of decline depends on the elasticity of D — how responsive private borrowing is to interest-rate changes.',
        'STEP 5 — CROWDING-OUT INTERPRETATION. The fiscal stimulus added $1T of government spending (ΔG) but the higher real interest rate suppressed private I. The NET effect on AD is the multiplier × ΔG MINUS the I reduction. The actual AD shift is smaller than the textbook multiplier alone implies. This is "crowding out" — government borrowing crowds private borrowers out of the loanable funds market.',
        'STEP 6 — DIAGRAM. On loanable funds: D shifts right; new equilibrium at higher r and higher Q. The Q increase reflects total borrowing (gov\'t + reduced private). The r increase reduces the share that goes to private I.',
        'STEP 7 — MAGNITUDE NOTE. Crowding-out is partial in most economies and often near-zero in deep recessions (when private investment demand is weak independently). At full employment with strong private demand, crowding-out is largest.',
      ],
      answer: 'D shifts RIGHT → r RISES → private I FALLS. Government borrowing crowds out private investment via higher real rates.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-shifters',
      kind: 'try_yourself',
      problem:
        'For each event, identify the curve shifted (S or D), direction, and resulting effect on equilibrium real interest rate. (a) Tax incentives encourage retirement saving. (b) Firms become pessimistic about future demand and reduce investment plans. (c) The government runs a budget surplus. (d) Foreign investors move funds into the country (capital inflow).',
      expectedAnswer:
        '(a) "Retirement saving incentives": households save more at any rate → S shifts RIGHT. Equilibrium r FALLS; quantity Q rises. (b) "Firms pessimistic, less I demand": firms borrow less at any rate → D shifts LEFT. Equilibrium r FALLS; quantity Q falls. (c) "Government surplus": government is now a SAVER in the loanable funds market (instead of a borrower). Effective S shifts RIGHT (or D shifts left if you treat government as net-borrower). Either way: equilibrium r FALLS, available funds for private I increase. (Some texts explicitly add government saving to S; some treat it as a leftward D shift. Either is acceptable.) (d) "Foreign capital inflow": foreigners supply more loanable funds → S shifts RIGHT. Equilibrium r FALLS; Q rises.',
      responseFormat: 'free',
      hints: [
        'Saving = supply. Borrowing = demand.',
        'Government deficit RAISES D; surplus LOWERS D (or RAISES S).',
        'More S or less D pushes r DOWN.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-money-vs-loanable',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Both the money market and the loanable funds market are about interest rates. Distinguish the two: identify which interest rate each market sets, what determines supply and demand in each, and give one specific economic event whose effect can be analyzed in BOTH markets.',
      expectedAnswer:
        'MONEY MARKET: sets the NOMINAL interest rate. Supply (Ms) is set by the central bank (vertical). Demand (Md) is from households/firms wanting to hold money for transactions and as a portfolio choice; downward-sloping in i because higher i raises the opportunity cost of holding money. LOANABLE FUNDS MARKET: sets the REAL interest rate. Supply (S) is from savers (households, businesses, government surpluses, foreign capital); upward-sloping because higher r encourages more saving. Demand (D) is from borrowers (firms\' I, household borrowing, government deficits); downward-sloping because higher r discourages borrowing. EVENT IN BOTH MARKETS — example "Fed conducts an expansionary OMO purchase of $50B in bonds": (1) IN MONEY MARKET — Ms shifts RIGHTWARD; equilibrium NOMINAL i falls. (2) IN LOANABLE FUNDS MARKET — the increase in money supply increases the supply of loanable funds (more bank lending capacity); S shifts RIGHTWARD; equilibrium REAL r falls (assuming inflation expectations stable). Both markets show lower interest rates — the money market shows it via lower nominal i, the loanable funds market via lower real r. Strong answers explicitly identify both rates (nominal vs real), both supply/demand mechanisms, and trace one event consistently through both diagrams.',
      responseFormat: 'frq',
      hints: [
        'Nominal vs real distinction is the key.',
        'Money market supply is vertical (Fed sets it); loanable funds supply is upward-sloping (savers).',
        'Many events shift curves in both markets.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Loanable funds market: sets REAL interest rate. S upward; D downward.',
        'S shifters: saving incentives, foreign capital, government surplus.',
        'D shifters: investment demand, government deficit, household borrowing.',
        'Government deficit → D shifts RIGHT → r RISES → private I FALLS = CROWDING OUT.',
        'Money market sets nominal i; loanable funds sets real r. Connected via Fisher: nominal = real + expected inflation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.7',
    cedTitle: 'The Loanable Funds Market',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — loanable funds market, crowding out via higher r.' },
    ],
  },
};
