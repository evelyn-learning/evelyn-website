/**
 * AP Macroeconomics — CED Unit 2.5: Costs of Inflation.
 *
 * Menu costs, shoe-leather costs, redistribution between creditors and
 * debtors, anticipated vs unanticipated inflation, and the Fisher
 * equation linking real and nominal interest rates. AP often tests
 * "who is helped vs hurt" by unexpected inflation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_COSTS_OF_INFLATION: LessonPlan = {
  id: 'evelyn.ap.macro.costs-of-inflation.v1',
  title: 'Costs of Inflation',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.costs-of-inflation',
      description:
        'Identify the costs of inflation (menu, shoe-leather, redistribution), distinguish anticipated from unanticipated inflation, apply the Fisher equation to convert between nominal and real interest rates, and identify who is helped or hurt by unexpected inflation.',
      standard: 'AP-MACRO-2.5',
    },
  ],
  prerequisites: ['apmacro.price-indices-inflation'],
  followUps: ['apmacro.real-vs-nominal-gdp'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make inflation feel uneven — winners and losers, not "everyone loses".',
      script:
        "When inflation rises, it doesn't make everyone equally poorer. Some people gain — anyone who borrowed money at a fixed rate watches their debt's real value shrink. Some people lose — anyone holding cash or fixed-income assets sees real value erode. The redistribution between creditors and debtors is one of the most consequential effects of inflation, and AP loves to test who wins and who loses.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-costs',
      kind: 'concept',
      goal: 'Cover all the canonical costs and the anticipated/unanticipated split.',
      keyIdeas: [
        'MENU COSTS: the literal cost of changing prices — reprinting menus, updating price tags, reprogramming registers, communicating new prices. Small per change but accumulates when inflation is high. Modern e-commerce has reduced these costs; the term remains in AP usage.',
        'SHOE-LEATHER COSTS: the cost of holding less cash to avoid the erosion from inflation. People make more frequent trips to the bank, hold smaller cash balances, spend more time managing money. Named "shoe leather" from the days of walking to a bank teller — figurative but accurate cost.',
        'REDISTRIBUTION FROM CREDITORS TO DEBTORS (when inflation is HIGHER than expected): a creditor lends $10,000 expecting 3% inflation. If actual inflation turns out to be 8%, the dollars repaid have less purchasing power than the lender expected. The borrower benefits; the lender loses.',
        'WHO IS HURT BY UNANTICIPATED INFLATION: (1) Lenders/creditors locked into fixed nominal interest rates. (2) Workers with fixed nominal wages (their real wage falls). (3) People with fixed-income retirement (pensions paying $X/month with no COLA). (4) Holders of cash and money-like assets.',
        'WHO IS HELPED BY UNANTICIPATED INFLATION: (1) Borrowers with fixed-rate debt (their real debt burden falls). (2) Workers in unionized contracts with strong COLA escalators. (3) Owners of real assets (land, homes, gold) whose nominal values rise with inflation.',
        'ANTICIPATED INFLATION is much LESS damaging than unanticipated: when borrowers + lenders correctly forecast inflation, they bake it into nominal interest rates upfront. No surprise redistribution occurs. The remaining costs are menu, shoe-leather, and tax distortions (since income tax brackets and capital-gains taxes are typically indexed imperfectly to inflation).',
        'FISHER EQUATION (real vs nominal interest rates): NOMINAL interest rate ≈ REAL interest rate + EXPECTED inflation rate. Or: REAL = NOMINAL − INFLATION (approximately, for low rates). When inflation rises and lenders ANTICIPATE it, nominal rates rise to compensate.',
        'HYPERINFLATION: when inflation runs above ~50% per month, the value of currency erodes so fast that normal economic life breaks down. Examples: Weimar Germany, Zimbabwe, Venezuela. Money loses its store-of-value function; people barter or switch to foreign currency.',
      ],
      vocabulary: [
        { term: 'menu costs', definition: 'the resource cost of changing posted prices when inflation requires re-pricing.' },
        { term: 'shoe-leather costs', definition: 'costs incurred from holding smaller cash balances to avoid inflation erosion (more bank trips, time on money management).' },
        { term: 'Fisher equation', definition: 'nominal interest rate ≈ real interest rate + expected inflation rate.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fisher',
      kind: 'worked_example',
      problem:
        'A bank issues a 5-year loan at a 7% NOMINAL interest rate. At the time of the loan, both bank and borrower expected inflation to average 3% over the 5 years. (a) Compute the EXPECTED real interest rate. (b) Suppose actual inflation turns out to be 6% per year over the 5 years. Compute the ACTUAL real interest rate the bank earns. (c) Identify who benefits from this surprise inflation, and explain why.',
      steps: [
        'STEP 1 — APPLY FISHER EQUATION (approximate form): real ≈ nominal − inflation. EXPECTED real = 7% − 3% = 4%. The bank thought it was earning 4% real on the loan.',
        'STEP 2 — ACTUAL real rate. Real ≈ nominal − ACTUAL inflation = 7% − 6% = 1%. The bank actually earns only 1% real.',
        'STEP 3 — WHO BENEFITS? The BORROWER. Their nominal payment is fixed by contract at 7%, but the dollars they pay back are less valuable than expected because inflation eroded purchasing power faster than anticipated. They effectively repay only 1% real interest instead of 4% real.',
        'STEP 4 — WHO LOSES? The BANK (lender). They locked in 7% nominal, expecting 4% real return. Surprise inflation reduced their actual real return to 1%. They cannot raise the rate retroactively.',
        'STEP 5 — INTUITION. Unanticipated inflation transfers wealth from CREDITORS to DEBTORS. A homeowner with a fixed-rate 30-year mortgage benefits when inflation surges; the bank holding the mortgage suffers. AP tests this scenario reliably — know the direction.',
      ],
      answer: 'Expected real = 4%. Actual real = 1%. Borrower benefits; bank (creditor) loses 3 pp of real return per year.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-fisher',
      kind: 'try_yourself',
      problem:
        'A savings account pays a NOMINAL interest rate of 4%. Annual inflation is 5%. (a) Compute the REAL interest rate. (b) Is a depositor with money in this account gaining or losing purchasing power over time? Briefly explain.',
      expectedAnswer:
        '(a) Real ≈ nominal − inflation = 4% − 5% = −1%. (b) The depositor is LOSING purchasing power at about 1% per year. Although their dollar balance is growing at 4% nominally, prices are growing faster (5%), so the real value of what they can buy with the balance is shrinking. A negative real rate means money in the account has less purchasing power next year than this year, despite the positive nominal growth.',
      responseFormat: 'numeric',
      hints: [
        'Apply the Fisher equation: real ≈ nominal − inflation.',
        'A negative real rate means purchasing power is shrinking even as the balance grows.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-winners-losers',
      kind: 'try_yourself',
      problem:
        'For each person below, identify whether they are HELPED or HURT by an UNANTICIPATED rise in inflation. Briefly justify each.',
      expectedAnswer:
        '(Sample scenarios — AP would give 4-5; sample answers below.) (a) "A retiree on a fixed pension that pays $2000/month, no cost-of-living adjustment": HURT. The $2000 buys less each year as inflation erodes purchasing power. Real income falls. (b) "A homeowner paying a 30-year fixed-rate mortgage at 4%": HELPED. The nominal payment is fixed by contract, so as inflation pushes wages and prices up, the same monthly payment becomes a smaller share of the borrower\'s nominal income. Real debt burden falls. (c) "A bank that issued the mortgage in (b)": HURT. Same logic in reverse — the bank receives the same nominal payments but their real value has eroded. (d) "A worker in a multi-year fixed nominal-wage contract": HURT. Real wage falls as prices rise faster than the contracted nominal wage. (e) "Someone holding $50,000 in cash under their mattress": HURT. Cash has zero nominal return; positive inflation means the cash buys less each year.',
      responseFormat: 'free',
      hints: [
        'Borrowers with fixed-rate debt: who benefits when their dollars become cheaper?',
        'Lenders with fixed-rate loans: who suffers when those dollars come back smaller in real terms?',
        'People with fixed nominal income lose; people with real-asset positions benefit.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-anticipated',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is unanticipated inflation more economically damaging than fully anticipated inflation? Use the Fisher equation in your answer.',
      expectedAnswer:
        'Unanticipated inflation creates SURPRISE REDISTRIBUTION between creditors and debtors that neither side could plan for. With fully ANTICIPATED inflation, both lenders and borrowers can BAKE the expected inflation into NOMINAL interest rates upfront via the Fisher equation: nominal ≈ real + expected inflation. If both parties expect 5% inflation and want a 3% real return, they negotiate an 8% nominal rate. The expected real return holds, no surprise wealth transfer occurs. With UNANTICIPATED inflation, the nominal rate set in advance is wrong: actual inflation differs from expectations, and the actual real return diverges from the expected real return. Creditors and debtors didn\'t agree to this redistribution — it just happens. Beyond redistribution, anticipated inflation still imposes MENU COSTS, SHOE-LEATHER COSTS, and TAX DISTORTIONS (because tax brackets are imperfectly indexed), so even fully-anticipated inflation has SOME costs. But unanticipated inflation adds the redistributive wealth transfer on top, making it the more damaging form. Strong answers explicitly distinguish "redistribution surprise" (unanticipated only) from "menu/shoe-leather/tax" (both forms).',
      responseFormat: 'frq',
      hints: [
        'What can people do PROACTIVELY when inflation is anticipated?',
        'What costs remain even when inflation is anticipated?',
        'Why is the surprise the bigger problem?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-everyone-loses',
      kind: 'misconception_check',
      question:
        "A student says: 'Inflation makes everyone poorer because everything costs more.' Is this right?",
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating inflation as uniformly damaging without recognizing the redistribution mechanism.',
          correctsTo:
            'NO. Inflation REDISTRIBUTES wealth — it does not uniformly destroy it. When inflation surprises markets to the upside, BORROWERS WITH FIXED-RATE DEBT BENEFIT (the real value of what they owe shrinks), HOLDERS OF REAL ASSETS BENEFIT (real estate, gold, equities tend to track inflation), and DEBTORS WITH NOMINAL OBLIGATIONS GAIN. Meanwhile, LENDERS WITH FIXED-RATE CLAIMS LOSE, HOLDERS OF CASH LOSE, and WORKERS WITH FIXED NOMINAL WAGES LOSE. Everyone who BUYS goods sees prices rise — but most people also EARN income (or own assets) whose value also tends to rise with inflation, so their real position depends on the BALANCE of their assets, debts, and income contracts. The mantra "inflation makes everyone poorer" is politically common but economically wrong; AP tests this precisely.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Costs: menu, shoe-leather, redistribution (creditors → debtors when unanticipated), tax distortions.',
        'Fisher: nominal ≈ real + expected inflation. → real ≈ nominal − actual inflation.',
        'UNANTICIPATED inflation HELPS borrowers (fixed-rate debt) and HURTS creditors / cash-holders / fixed-income.',
        'Anticipated inflation has menu/shoe-leather/tax costs but no surprise redistribution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.5',
    cedTitle: 'Costs of Inflation',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '9', note: 'OpenStax Macro AP — costs of inflation, Fisher equation framing.' },
    ],
  },
};
