/**
 * AP Macroeconomics — CED Unit 3.8: Fiscal Policy.
 *
 * Discretionary fiscal policy — government use of spending and taxes to
 * shift AD. Expansionary vs contractionary, multiplier interactions,
 * crowding out, debt vs deficit, lags. Supersedes the existing
 * ap-macro-fiscal-policy.v1 plan (will be deleted at end-of-Unit-6 ship).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_FISCAL_POLICY: LessonPlan = {
  id: 'evelyn.ap.macro.fiscal-policy.v1',
  title: 'U3.8 Fiscal Policy',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fiscal-policy',
      description:
        'Apply expansionary and contractionary fiscal policy in the AD-AS model, compute the resulting AD shift using the spending and tax multipliers, identify crowding out, distinguish budget deficit from national debt, and articulate the time-lag limitations.',
      standard: 'AP-MACRO-3.8',
    },
  ],
  prerequisites: ['apmacro.long-run-self-adjustment', 'apmacro.multipliers'],
  followUps: ['apmacro.automatic-stabilizers'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame fiscal policy as the deliberate counterpart to monetary policy.',
      script:
        "When a recession hits, governments don't just sit and watch. They cut taxes. They spend more on infrastructure. They send checks to households. That is fiscal policy: using the government's budget to push the economy. Done right, it shortens recessions. Done wrong, it leaves debt and inflation for the next generation. Knowing when each tool works is half of macroeconomics.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-fiscal',
      kind: 'concept',
      goal: 'Cover discretionary fiscal policy: tools, AD effects, multiplier interactions, crowding out, debt vs deficit, lags.',
      keyIdeas: [
        'FISCAL POLICY: government changes in spending (G) or taxes (T) to influence AD. EXPANSIONARY = G up and/or T down → AD right. Used in recession. CONTRACTIONARY = G down and/or T up → AD left. Used to cool overheating.',
        'EXPANSIONARY FISCAL POLICY MECHANICS: increase in G shifts AD right by spending multiplier × ΔG. Tax cut shifts AD right by |tax multiplier| × ΔT. Combined effects can be calculated and added.',
        'CONTRACTIONARY FISCAL POLICY: opposite directions. Used when economy is in inflationary gap or when policymakers want to slow inflation.',
        'CROWDING OUT: when the government borrows to fund deficit spending, it competes with private borrowers in the loanable-funds market. Real interest rates rise; private investment (I) falls; some of the fiscal stimulus is offset. Magnitude of crowding-out varies; it is partial, not total — fiscal policy still has SOME effect, just less than the multiplier alone implies.',
        'BUDGET DEFICIT (annual): government spending > revenue THIS YEAR. NATIONAL DEBT (cumulative): sum of all past deficits minus surpluses. AP frequently tests this distinction. Deficit is a flow; debt is a stock.',
        'TIME LAGS limit fiscal-policy precision: (1) RECOGNITION lag — data on GDP/unemployment is reported with delay. (2) LEGISLATIVE lag — Congress is slow to pass spending or tax legislation. (3) IMPLEMENTATION lag — programs take time to start and money to flow. By the time stimulus reaches the economy, the underlying conditions may have changed. This is one reason monetary policy (faster to deploy) often takes the lead in stabilization.',
        'DISCRETIONARY vs AUTOMATIC: this plan covers DISCRETIONARY fiscal policy — actions requiring new legislation. AUTOMATIC STABILIZERS (next plan) operate without legislation.',
        'FISCAL MULTIPLIER on AD: the effect on real GDP depends on (i) the size of ΔG and ΔT, (ii) the relevant multipliers (spending vs tax, both function of MPC), (iii) crowding out, (iv) the AD-AS situation (multiplier dampens at full employment when SRAS is steep).',
      ],
      vocabulary: [
        { term: 'discretionary fiscal policy', definition: 'changes in government spending or taxes that require legislation; deliberate macro stabilization.' },
        { term: 'crowding out', definition: 'reduction in private investment caused by government deficit borrowing pushing up interest rates.' },
        { term: 'budget deficit', definition: 'government spending exceeds revenue in a given year (annual flow).' },
        { term: 'national debt', definition: 'cumulative sum of past deficits minus surpluses (stock).' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fiscal-mix',
      kind: 'worked_example',
      problem:
        "An economy is in a recessionary gap of $400B (potential = $5.0T, actual = $4.6T). MPC = 0.75. The legislature is considering two options: (i) increase G by $100B, OR (ii) cut taxes by $100B. (a) Compute the AD shift produced by each option. (b) Which option closes more of the gap? (c) What combined fiscal mix would EXACTLY close the gap?",
      steps: [
        'STEP 1 — MULTIPLIERS. Spending multiplier = 1/(1−0.75) = 4. Tax multiplier = −0.75/0.25 = −3.',
        'STEP 2 — OPTION (i): ΔG = +$100B → ΔAD = 4 × $100B = +$400B. AD shifts right by $400B.',
        'STEP 3 — OPTION (ii): ΔT = −$100B → ΔAD = −3 × (−$100B) = +$300B. AD shifts right by $300B.',
        'STEP 4 — COMPARISON. Option (i) produces a $400B AD shift; option (ii) produces $300B. SAME dollar amount of fiscal action; spending shifts AD by more because the spending multiplier is larger in magnitude (the government dollar enters the cycle in full; only MPC of a tax cut enters initially).',
        'STEP 5 — CLOSING THE $400B GAP. Option (i) alone closes the gap exactly: ΔAD = $400B = gap. Option (ii) alone closes only $300B of the $400B gap.',
        'STEP 6 — COMBINED FISCAL MIX. To close the gap exactly with a balanced-budget operation (ΔG = ΔT, both positive — i.e., spending hike financed by tax hike): balanced-budget multiplier = 1, so ΔAD = ΔG. To produce ΔAD = +$400B requires ΔG = $400B and ΔT = $400B. Or alternative: any combination satisfying 4 × ΔG + 3 × |ΔT cut| = $400B. E.g. ΔG = $50B + ΔT = -$67B → ΔAD = 200 + 200 = $400B.',
        'STEP 7 — CAVEAT: ignored crowding out (would partially offset the AD shift) and assumed price level fixed (true only at deep recessionary gap with flat SRAS). Real-world fiscal-multiplier estimates run 0.5-2.0, often below the textbook value.',
      ],
      answer: 'Option (i): ΔAD +$400B (closes gap exactly). Option (ii): ΔAD +$300B (closes 75%). Combined balanced-budget G+T of $400B each closes the gap.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-deficit-vs-debt',
      kind: 'try_yourself',
      problem:
        "Distinguish a BUDGET DEFICIT from the NATIONAL DEBT in two sentences each. Then state which of these is a STOCK and which is a FLOW.",
      expectedAnswer:
        'BUDGET DEFICIT: the amount by which government spending exceeds tax revenue IN A GIVEN YEAR. Measured annually. If the government spends $4.5T and collects $4.0T in taxes this year, the deficit is $500B for this year. NATIONAL DEBT: the CUMULATIVE total of all past deficits minus past surpluses. Measured at a point in time. If a country has run deficits of $500B for 30 years, the national debt is roughly $15T (plus interest accumulation). FLOW = the budget deficit (a per-period quantity). STOCK = the national debt (a snapshot at a moment).',
      responseFormat: 'free',
      hints: [
        'Deficit is per-year. Debt is the running total.',
        'Flow vs stock is a standard accounting distinction — one is a rate over time, the other is a level at a moment.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-fiscal-classify',
      kind: 'try_yourself',
      problem:
        'For each policy action, identify whether it is EXPANSIONARY or CONTRACTIONARY fiscal policy, and identify the typical macro situation in which each would be used.',
      expectedAnswer:
        '(Examples — typical AP problem; sample answers below.) (a) "Government cuts personal income tax rates by 5 percentage points": EXPANSIONARY (T down → C up → AD right). Used in recessionary gap. (b) "Government raises corporate taxes by 4 percentage points": CONTRACTIONARY (T up → C and possibly I down → AD left). Used in inflationary gap. (c) "Government passes a $700B infrastructure investment bill": EXPANSIONARY (G up → AD right). Used in recessionary gap. (d) "Federal spending freeze across all agencies": CONTRACTIONARY (G effectively decreases relative to baseline → AD left). Used in inflationary gap.',
      responseFormat: 'free',
      hints: [
        'G or T moving up vs down; identify direction of AD shift.',
        'Match fiscal action to macroeconomic gap (recessionary or inflationary).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-crowding-out',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The government enacts a $300B fiscal stimulus financed by deficit spending. (a) Identify the direct mechanism by which this would shift AD. (b) Explain why the actual AD increase will likely be SMALLER than the textbook multiplier predicts. (c) Identify ONE situation in which crowding out would be especially LARGE, and ONE in which it would be especially SMALL.',
      expectedAnswer:
        '(a) Direct mechanism: $300B in new government spending enters the circular flow as G in Y = C+I+G+NX. Recipients spend MPC of their new income on consumption (entering C), and so on through the multiplier. Total textbook AD shift = spending multiplier × $300B. (b) Actual AD shift will be smaller than textbook because of CROWDING OUT. To finance the deficit, the government issues bonds. Bond issuance increases the supply of bonds, raising interest rates. Higher interest rates reduce private investment (I) and may reduce some interest-rate-sensitive consumption (cars, houses). The reduction in I OFFSETS part of the gain in G — the net AD shift is the spending multiplier effect minus the crowding-out offset. (c) LARGE crowding-out scenario: the economy is at FULL EMPLOYMENT (steep SRAS). Government bond demand is competing for genuinely scarce loanable funds; rates rise sharply; private I falls substantially; net AD effect is small. SMALL crowding-out scenario: deep RECESSION with abundant idle savings. Loanable funds are plentiful; bond issuance pushes rates up only slightly; private I is barely affected. Some economists argue crowding out is essentially zero in deep recessions (the "fiscal multiplier is high in slumps" hypothesis). Strong answers tie crowding-out magnitude to the AD-AS situation (slack vs full employment) and explicitly identify the loanable-funds mechanism.',
      responseFormat: 'frq',
      hints: [
        'How does deficit financing affect interest rates?',
        'How does that affect private investment?',
        'When is loanable-funds slack large (recession) vs tight (full employment)?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Expansionary fiscal: G up and/or T down → AD right. For recessions.',
        'Contractionary fiscal: G down and/or T up → AD left. For overheating.',
        'Spending multiplier > |tax multiplier|. ΔG hits harder dollar-for-dollar.',
        'Crowding out: deficit financing raises rates → I falls → partial offset of stimulus.',
        'Deficit (flow, annual) ≠ debt (stock, cumulative).',
        'Lags: recognition + legislative + implementation. Fiscal policy is slow.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.8',
    cedTitle: 'Fiscal Policy',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — discretionary fiscal policy, multiplier interactions, crowding out.' },
    ],
  },
};
