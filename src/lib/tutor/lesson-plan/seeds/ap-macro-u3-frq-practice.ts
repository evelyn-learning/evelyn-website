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
  title: 'U3 FRQ Practice',
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
    'apmacro.fiscal-policy',
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
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria: 'Correct spending multiplier: 1/(1−MPC) = 1/(1−0.8) = 5. Award for the correct value with the formula shown.',
            modelResponse: 'Spending multiplier = 1/(1−MPC) = 1/(1−0.8) = 1/0.2 = 5.',
          },
          {
            criterionId: 'b',
            maxPoints: 2,
            scoringCriteria: 'One point for the setup ΔAD = multiplier × ΔG = 5 × $50B; one point for the correct result $250B.',
            modelResponse: 'ΔAD = spending multiplier × ΔG = 5 × $50B = $250B.',
          },
          {
            criterionId: 'c',
            maxPoints: 2,
            scoringCriteria: 'One point for "No"; one point for the justification that the $250B AD shift is smaller than the $300B gap, leaving a residual $50B recessionary gap.',
            modelResponse: 'No. The gap is $300B but the AD shift is only $250B, so the economy remains $50B below potential — a smaller but still open recessionary gap.',
          },
          {
            criterionId: 'd',
            maxPoints: 1,
            scoringCriteria: 'Any one valid reason the real AD shift is smaller: crowding out, lower effective MPC, import leakage, or the price-level/SRAS effect.',
            modelResponse: 'Crowding out: deficit-financed spending raises real interest rates, reducing private investment, so the net AD shift is less than the full multiplier effect.',
          },
          {
            criterionId: 'e',
            maxPoints: 3,
            scoringCriteria: 'One point for correct axes (PL on Y, Real GDP on X) plus three curves (AD, SRAS, LRAS); one point for an initial recessionary-gap equilibrium left of LRAS; one point for AD shifting right with the new equilibrium still left of LRAS.',
            modelResponse: 'Axes: Price Level (Y), Real GDP (X). AD downward, SRAS upward, LRAS vertical at Y_potential. Initial equilibrium E_0 = AD ∩ SRAS left of LRAS (recessionary gap). AD shifts right to AD′; new equilibrium E_1 = AD′ ∩ SRAS, right of E_0 but still left of LRAS.',
          },
        ],
      },
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
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria: 'Identifies SRAS shifting leftward.',
            modelResponse: 'The oil shock raises input prices, so SRAS shifts leftward.',
          },
          {
            criterionId: 'b',
            maxPoints: 2,
            scoringCriteria: 'Correct direction of all three short-run effects: price level rises, real GDP falls, unemployment rate rises. Award full credit only for all three correct.',
            modelResponse: 'Price level rises, real GDP falls, and the unemployment rate rises (stagflation).',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria: 'Classifies the inflation as cost-push, consistent with the leftward SRAS shift and falling output.',
            modelResponse: 'Cost-push inflation — rising prices accompany falling real GDP, the signature of a leftward SRAS shift.',
          },
          {
            criterionId: 'd',
            maxPoints: 3,
            scoringCriteria: 'One point each for the rate-cut trade-off (closes recession but worsens inflation) and the rate-hike trade-off (tames inflation but deepens recession); one point for recognizing AD-side tools cannot resolve an SRAS-side shock without a trade-off.',
            modelResponse: 'Rate cut shifts AD right — raises Y and lowers UR but worsens inflation. Rate hike shifts AD left — lowers inflation but deepens the recession and raises UR. Both trade off because monetary policy moves AD, and an AD-side tool cannot fix an SRAS-side problem.',
          },
          {
            criterionId: 'e',
            maxPoints: 2,
            scoringCriteria: 'One point for the self-adjustment mechanism (high unemployment → lower wages → SRAS shifts back rightward to potential); one point for identifying the cost as the time/output loss endured during the adjustment.',
            modelResponse: 'With high cyclical unemployment, workers accept lower wages; falling costs shift SRAS back rightward, returning the economy to potential GDP at a lower price level. The cost is time — the recessionary gap and its unemployment persist for the years the adjustment takes.',
          },
        ],
      },
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
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria: 'Defines an automatic stabilizer as a budget feature that adjusts counter-cyclically without new legislation.',
            modelResponse: 'An automatic stabilizer is a built-in budget feature that adjusts counter-cyclically on its own, without new legislation — cushioning both recessions and expansions.',
          },
          {
            criterionId: 'b',
            maxPoints: 3,
            scoringCriteria: 'Up to two valid examples (progressive income tax, unemployment insurance, means-tested transfers, corporate tax revenue), each with its counter-cyclical mechanism. Award the third point when both mechanisms are explained accurately (not just named).',
            modelResponse: 'Progressive income tax: in a recession incomes fall, taxpayers drop into lower brackets, average tax rates fall, and disposable income (hence C) is cushioned. Unemployment insurance: job losers automatically receive benefits they largely spend, supporting AD; payments recede as unemployment falls.',
          },
          {
            criterionId: 'c',
            maxPoints: 2,
            scoringCriteria: 'Two concrete distinctions from discretionary policy (legislation required, timing/lags, reversibility, or proportionality). One point each.',
            modelResponse: 'First, discretionary policy needs new legislation while stabilizers operate automatically. Second, stabilizers act in real time whereas discretionary policy suffers recognition, legislative, and implementation lags.',
          },
          {
            criterionId: 'd',
            maxPoints: 3,
            scoringCriteria: 'One point that stabilizers cushion but do not fully offset a deep gap; one point that discretionary stimulus (e.g. ARRA) adds a large concentrated AD shift; one point for the complementarity argument — stabilizers act immediately and scale, discretionary bridges the remaining deeper gap.',
            modelResponse: 'Automatic stabilizers cushion the downturn immediately and scale with its depth but cannot fully close a severe gap like 2008-09. Discretionary stimulus (ARRA, ~$800B) adds a large one-time AD shift. Together, stabilizers cover the lag-free early phase while discretionary bridges the deeper gap — each doing what the other cannot.',
          },
        ],
      },
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
