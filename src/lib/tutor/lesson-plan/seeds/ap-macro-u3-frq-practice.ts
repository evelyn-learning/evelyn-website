/**
 * AP Macroeconomics — Unit 3 FRQ Practice.
 *
 * Three multi-part FRQs covering AD-AS analysis, multiplier computations,
 * and fiscal policy effects. Modeled on past AP Macro Unit-3 patterns;
 * verbatim swap-in queued for when scrape-ced-frqs.ts ships.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u3-frq-practice.v1',
  title: 'Unit 3 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u3-frq-practice',
      description:
        'Apply Unit 3 concepts (AD, AD shifters, SRAS, LRAS, equilibrium, gaps, fiscal policy, multipliers, automatic stabilizers) to multi-part free-response problems with AP-style rubric scoring and AD-AS diagram requirements.',
      standard: 'AP-MACRO-3-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.aggregate-demand',
    'apmacro.multipliers',
    'apmacro.short-run-aggregate-supply',
    'apmacro.long-run-aggregate-supply',
    'apmacro.equilibrium-ad-as',
    'apmacro.changes-ad-as-short-run',
    'apmacro.long-run-self-adjustment',
    'apmacro.fiscal-policy-v2',
    'apmacro.automatic-stabilizers',
  ],
  followUps: [],
  estimatedMinutes: 36,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 3 FRQ stakes — biggest unit, heaviest on graphing.',
      script:
        "Unit 3 is the biggest content area on the AP Macro exam — about a quarter of the entire test. Most of these FRQs require you to draw and label an AD-AS diagram correctly, then trace through shifts. Three multi-part problems incoming, each scored on rubric: graph correctness, calculations, explanations.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-graph-rubric',
      kind: 'concept',
      goal: 'Cover the AD-AS graph rubric conventions used by AP graders.',
      keyIdeas: [
        'AP AD-AS GRAPH RUBRIC typically scores: (1) AXES correctly labeled (Price Level on Y, Real GDP on X). (2) THREE CURVES drawn: AD downward-sloping, SRAS upward-sloping, LRAS vertical. (3) CURVES correctly labeled (AD, SRAS, LRAS). (4) INITIAL EQUILIBRIUM marked at AD ∩ SRAS, with reference lines to PL₀ and Y₀. (5) SHIFTS shown as new curves (dashed convention) labeled with prime (AD\', SRAS\'). (6) NEW EQUILIBRIUM marked, with reference lines to PL₁ and Y₁. (7) DIRECTION of changes consistent with the verbal explanation.',
        'COMMON POINT-LOSERS: forgetting to label axes, omitting LRAS when the question asks about it, drawing AD upward, drawing SRAS downward, mislabeling shifted curves as movement-along, putting equilibrium at wrong intersection (e.g. on LRAS instead of AD ∩ SRAS).',
        'CALCULATION-FRQ rubric: (1) state the formula. (2) substitute the given values. (3) compute. (4) label units. Skipping any of these costs partial credit.',
        'EXPLANATION-FRQ rubric: (1) name the mechanism (e.g. "wealth effect," "crowding out"). (2) trace the chain of cause-effect. (3) connect to the variable asked about (Y, P, UR).',
        'TIME BUDGET on the actual exam: ~10 minutes for the long FRQ, ~5-7 for short FRQs. Don\'t over-perfect any one — better to attempt every part with partial-credit-quality answers.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-fiscal-stim',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 1 — Fiscal Stimulus & Multiplier. Country X is in a recessionary gap of $300B. MPC = 0.8. The government considers a $50B increase in spending. (a) Compute the spending multiplier. (b) Compute the AD shift produced by the $50B G increase. (c) Does the $50B G increase fully close the recessionary gap? Justify with calculation. (d) Identify ONE reason the actual AD shift in real life would likely be SMALLER than the multiplier-implied shift in (b). (e) Draw a correctly-labeled AD-AS diagram showing: initial recessionary equilibrium, the AD shift from the fiscal stimulus, and the new short-run equilibrium. (Verbal description sufficient if drawing tools unavailable.)",
      expectedAnswer:
        '(a) Spending multiplier = 1/(1−MPC) = 1/(1−0.8) = 1/0.2 = 5. (1 point)\n(b) ΔAD = 5 × $50B = $250B. (2 points: 1 for setup, 1 for correct number)\n(c) NO. The gap is $300B; the AD shift is only $250B. After the stimulus, the economy is still $50B below potential, in a smaller (but persistent) recessionary gap. (1 point)\n(d) ONE reason (any of the following): (i) CROWDING OUT — deficit financing raises real interest rates, reducing private investment; the net AD shift is the spending multiplier effect minus the I reduction. (ii) PARTIAL CROWDING — even if not eliminated, some private I is displaced. (iii) MPC IS LOWER for stimulus recipients — if recipients save more than typical (e.g. high-saving households or businesses), the actual multiplier is smaller. (iv) IMPORTS — some of the new spending goes to foreign goods, leaking out of the domestic multiplier. (v) PRICE-LEVEL EFFECT — at higher AD, prices rise; SRAS is upward-sloping; some of the AD shift becomes higher P rather than higher Y. (1 point)\n(e) DESCRIPTION OF DIAGRAM: axes labeled Price Level (Y) and Real GDP (X). Three curves: AD downward, SRAS upward, LRAS vertical at potential GDP (call it Y_potential). Initial equilibrium at AD ∩ SRAS, marked E_0, located to the LEFT of LRAS (recessionary gap). Reference lines from E_0 to PL_0 on Y-axis and Y_0 on X-axis. After the fiscal stimulus, AD shifts RIGHT to AD\' (dashed). New equilibrium E_1 = AD\' ∩ SRAS, located to the right of E_0 but still to the LEFT of LRAS (since the shift didn\'t close the full gap). Reference lines from E_1 to PL_1 (above PL_0) and Y_1 (right of Y_0, still left of Y_potential). Y_1 < Y_potential indicates the gap is smaller but not closed. (3 points: 1 for correct axes + 3 curves, 1 for initial recessionary-gap equilibrium, 1 for AD shift right with new equilibrium still left of LRAS)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Spending multiplier = 1/(1-MPC).',
        'Compare AD shift to gap size to answer (c).',
        'For the diagram, get axes + 3 curves + 2 equilibria + reference lines.',
      ],
      estimatedMinutes: 9,
    },
    {
      id: 'try-frq-supply-shock',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — Supply Shock & Stagflation. Country Y is initially in long-run equilibrium. A major oil shock doubles the price of oil. (a) Identify which curve shifts and the direction. (b) Describe the short-run effects on price level, real GDP, and the unemployment rate. (c) Classify the resulting inflation as demand-pull, cost-push, or neither. (d) Country Y's central bank considers two responses: (i) cut interest rates to boost AD, or (ii) raise interest rates to fight inflation. For each, describe the trade-off the bank faces. (e) Some economists argue the central bank should do NEITHER — let the economy self-adjust. Explain how self-adjustment would work in this case AND what its cost would be.",
      expectedAnswer:
        '(a) SRAS shifts LEFTWARD (rising input prices reduce production at any price level). (1 point)\n(b) Short-run effects: price level RISES; real GDP FALLS; unemployment rate RISES (cyclical UE > 0 since output is below new potential — though potential itself may also fall slightly with persistent oil shock). (1.5 points: 0.5 each)\n(c) COST-PUSH inflation. Inflation accompanies falling Y, characteristic of an SRAS leftward shift. (1 point)\n(d) Trade-offs: (i) RATE CUT (boost AD): shifts AD right, raising Y back toward potential and lowering UR. BUT inflation gets worse (P rises further; demand-pull inflation added on top of cost-push). The bank ADDRESSES the recession but WORSENS the inflation. (ii) RATE HIKE (fight inflation): shifts AD left, lowering inflation. BUT real GDP falls further, deepening the recession; UR rises further. The bank ADDRESSES the inflation but DEEPENS the recession. Both responses face a fundamental TRADE-OFF because monetary tools shift AD; AD-side tools cannot fix an SRAS-side problem. (2 points)\n(e) Self-adjustment: with high cyclical unemployment, workers eventually accept lower wages. Falling wages reduce firms\' costs → SRAS shifts back RIGHTWARD over time. The economy returns to LRAS at the original potential GDP, but at a LOWER price level than the post-shock short-run equilibrium. COST: time. Self-adjustment can take years. During those years, real human suffering accumulates (sustained unemployment, wage cuts, lost output). The economy "pays" for the supply shock with a recessionary gap that persists until SRAS shifts back. Strong answers explicitly trace SRAS shift back rightward and identify the time-cost as the main downside. (1.5 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Oil shock = input price rise = SRAS shift.',
        'Stagflation pattern: P up, Y down, UR up.',
        'AD-side tools (monetary policy) face a trade-off when the problem is on SRAS.',
        'Self-adjustment via wage / SRAS movement; it works but is slow.',
      ],
      estimatedMinutes: 9,
    },
    {
      id: 'try-frq-stabilizers',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — Automatic Stabilizers. (a) Define the term 'automatic stabilizer.' (b) Identify TWO specific examples of automatic stabilizers in the U.S. and briefly explain how each operates counter-cyclically. (c) Distinguish automatic stabilizers from discretionary fiscal policy in TWO concrete ways. (d) During the 2008-09 recession, both automatic stabilizers and discretionary stimulus (the American Recovery and Reinvestment Act) were active. Explain why economists generally consider the COMBINATION more effective than either alone.",
      expectedAnswer:
        '(a) An automatic stabilizer is a feature of the budget that adjusts counter-cyclically WITHOUT new legislation — automatically softening expansions and recessions through built-in program design. (1 point)\n(b) Two examples (any two of the following): (i) PROGRESSIVE INCOME TAX — in a recession, household incomes fall; people move into lower tax brackets; average tax rate falls; disposable income falls less than gross income; consumption is cushioned. The tax structure itself does the counter-cyclical work without new legislation. (ii) UNEMPLOYMENT INSURANCE — when workers lose jobs, UI payments automatically begin (eligibility is built into the program). Recipients spend most of UI on essentials, supporting C and AD. As recovery proceeds and unemployment falls, UI payments naturally decline. (iii) MEANS-TESTED TRANSFERS (SNAP, Medicaid, TANF) — eligibility expands as incomes fall; enrollment rises in recessions, falls in expansions. (iv) CORPORATE TAX REVENUE — corporate profits fall sharply in recessions, dropping tax revenue more than proportionally; this counter-cyclical revenue swing acts as an automatic budget loosening. (2 points: 1 per example with mechanism)\n(c) Two distinctions: (i) LEGISLATION REQUIRED — discretionary policy requires new legislation (a vote in Congress); automatic stabilizers do not. (ii) TIMING — automatic stabilizers respond in real time; discretionary policy faces lags (recognition + legislative + implementation). (iii) REVERSIBILITY — automatic stabilizers self-reverse as the economy recovers; discretionary stimulus may be politically hard to remove. (iv) PROPORTIONALITY — automatic stabilizers scale to the depth of the downturn (more UI for deeper recessions); discretionary is a fixed-size action. (2 points)\n(d) The combination is more effective because automatic stabilizers SOFTEN the cycle but do not fully OFFSET it — they provide a partial cushion, particularly in mild recessions. In severe recessions like 2008-09, the gap is deeper than stabilizers alone can close. Discretionary stimulus (ARRA: ~$800B over 2009-2012) added a one-time additional AD shift on top of the automatic effects. The two together: stabilizers covered the early phase (immediately, no lags) and the proportional response (more UI as more people lost jobs); discretionary added a large concentrated shift to bridge the deeper gap. Without stabilizers, the early recession would have been deeper before discretionary policy took effect. Without discretionary, stabilizers alone would not have closed the very large gap. (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Define carefully: built-in vs requiring legislation.',
        'For (b), examples need both a name and the mechanism.',
        'For (c), pick distinctions that are concrete (lags, legislation, reversal).',
        'For (d), the argument is about complementarity — each addresses what the other can\'t.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AD-AS graph rubric: axes, 3 curves, equilibria, reference lines, shifts dashed.',
        'Always: state formula → substitute → compute → label units.',
        'Demand-pull: AD right, P↑ Y↑. Cost-push: SRAS left, P↑ Y↓ (stagflation).',
        'AD-side tools cannot fix SRAS-side problems.',
        'Stabilizers + discretionary work together: stabilizers cushion, discretionary closes deeper gaps.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ',
    cedTitle: 'Unit 3 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on past AP Macro Unit-3 FRQ patterns. Verbatim CB FRQs to swap in once scrape-ced-frqs.ts ships.' },
    ],
  },
};
