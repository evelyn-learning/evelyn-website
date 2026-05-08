/**
 * AP Calculus BC — CED Unit 1.3 + 1.4: Estimating Limit Values from
 * Graphs and Tables. Combined plan covering both representations.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_GRAPHS_TABLES: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-graphs-tables.v1',
  title: 'U1.3 Estimating Limits from Graphs and Tables',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-graphs-tables',
      description:
        'Estimate lim_{x→a} f(x) by reading values off a graph (left-side and right-side approach), and by inspecting a table of values for x near a from both sides.',
      standard: 'AP-CALCBC-1.3-1.4',
    },
  ],
  prerequisites: ['apcalcbc.defining-limits'],
  followUps: ['apcalcbc.limits-algebraic-properties'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame graphs and tables as parallel ways to "see" a limit numerically.',
      script:
        "Before we learn algebra tricks for finding limits, we should build intuition: GRAPHICALLY by reading what y-value a curve approaches, and NUMERICALLY by tabulating f(x) for x close to the target. Both methods estimate the same number — and AP exam questions often ask you to read limits off a given graph or table.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-graph-table',
      kind: 'concept',
      goal: 'Cover both methods, when each fails, and how to detect DNE.',
      keyIdeas: [
        'GRAPHICAL ESTIMATION. To find lim_{x→a} f(x): trace the curve as x approaches a from the LEFT and from the RIGHT. The y-value the curve approaches from each side is the one-sided limit. If both sides agree, the two-sided limit equals that value.',
        'GRAPH FEATURES TO RECOGNIZE: open circle at (a, L) typically indicates the limit IS L but f(a) ≠ L. Closed circle at (a, L) indicates f(a) = L. Vertical asymptote at x = a indicates infinite limit (DNE finite). Jump in graph indicates one-sided limits disagree (DNE).',
        'TABULAR ESTIMATION. Build a table with x-values approaching a from BOTH sides — e.g. x = 1.9, 1.99, 1.999 from the left; x = 2.001, 2.01, 2.1 from the right. Compute f(x) at each. If the f-values converge to the same number from both sides, that\'s the limit estimate.',
        'WHY BOTH SIDES MATTER. Tabulating only x = 2.001, 2.01, 2.1 (only right side) misses if the left-side limit differs. AP regularly tests left-and-right-side awareness.',
        'SAMPLE SIZE matters. Using too few x-values (just x = 1.9 and x = 2.1) gives weak evidence. Using values progressively closer (1.9 → 1.99 → 1.999) shows convergence.',
        'GRAPH AND TABLE complement each other. Graph shows shape and DNE patterns visually. Table provides numerical convergence evidence. AP problems may give one or the other — sometimes both, asking students to confirm consistency.',
        'WHEN BOTH FAIL. Highly oscillatory functions (e.g. sin(1/x) as x → 0) defy both graphical (curve oscillates infinitely fast near 0) and tabular (table shows wildly different f-values for tiny x changes) estimation. These signal DNE.',
      ],
      vocabulary: [
        { term: 'open circle', definition: 'graphical convention indicating the function value at that x is NOT defined at the marked y; often used to show a limit value where f(a) ≠ L.' },
        { term: 'closed circle', definition: 'graphical convention indicating the function value at that x IS the marked y.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-table',
      kind: 'worked_example',
      problem:
        'Estimate lim_{x→3} f(x) given the following table of values. x = 2.9 → f(x) = 5.97. x = 2.99 → 5.997. x = 2.999 → 5.9997. x = 3.001 → 6.0003. x = 3.01 → 6.003. x = 3.1 → 6.03. (a) Estimate the left-side limit. (b) Estimate the right-side limit. (c) State the two-sided limit (or DNE).',
      steps: [
        'STEP 1 — LEFT-SIDE: x = 2.9, 2.99, 2.999 yields f(x) = 5.97, 5.997, 5.9997. Trend converges to 6 as x → 3⁻. lim_{x→3⁻} f(x) ≈ 6.',
        'STEP 2 — RIGHT-SIDE: x = 3.001, 3.01, 3.1 yields f(x) = 6.0003, 6.003, 6.03. Trend converges to 6 as x → 3⁺. lim_{x→3⁺} f(x) ≈ 6.',
        'STEP 3 — TWO-SIDED. Both one-sided limits ≈ 6. They\'re equal. lim_{x→3} f(x) ≈ 6.',
        'STEP 4 — INTERPRET. This is consistent with a continuous function (or a function with a removable discontinuity at x = 3). The table doesn\'t tell us f(3) directly — that requires direct evaluation.',
        'STEP 5 — RIGOR CHECK. Tabular estimation gives an APPROXIMATION based on the trend. To prove the limit exactly equals 6 we\'d use algebraic methods (Unit 1.5-1.6) or the formal ε-δ definition (beyond AP scope).',
      ],
      answer: '(a) Left ≈ 6. (b) Right ≈ 6. (c) lim_{x→3} f(x) ≈ 6.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-table-jump',
      kind: 'try_yourself',
      problem:
        'Estimate lim_{x→0} f(x) from the table. Left side: x = -0.1 → f = -3, x = -0.01 → -2.97, x = -0.001 → -2.997. Right side: x = 0.001 → 4.001, x = 0.01 → 4.01, x = 0.1 → 4.1. Does the limit exist?',
      expectedAnswer:
        'Left-side: f-values converge to about -3 as x → 0⁻. Right-side: f-values converge to about 4 as x → 0⁺. The two one-sided limits are UNEQUAL (-3 ≠ 4). So lim_{x→0} f(x) DOES NOT EXIST. (This is a jump discontinuity at x = 0.)',
      responseFormat: 'free',
      hints: [
        'Compare left-trend and right-trend.',
        'When they disagree, the two-sided limit DNE.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-graph',
      kind: 'try_yourself',
      problem:
        "From a given graph of f, lim_{x→2⁻} f(x) appears to approach 4, lim_{x→2⁺} f(x) appears to approach 4, and the graph has an OPEN CIRCLE at (2, 4) and a CLOSED CIRCLE at (2, 7). (a) State the two-sided limit at x = 2. (b) State the value of f(2). (c) Is f continuous at x = 2?",
      expectedAnswer:
        '(a) Both one-sided limits = 4 → lim_{x→2} f(x) = 4. (b) Closed circle at (2, 7) means f(2) = 7. Open circle at (2, 4) means the function does NOT take value 4 at x = 2 (only approaches it). (c) NO, f is not continuous at x = 2 because lim_{x→2} f(x) = 4 ≠ f(2) = 7. This is a removable discontinuity (the limit exists but disagrees with the function value).',
      responseFormat: 'free',
      hints: [
        'Open circle = limit value (function doesn\'t reach there).',
        'Closed circle = actual function value.',
        'Continuity requires limit = function value.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-tabular-limits-fragility',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. A student computes a table with x = 1.5, 1.9, 2.5 and concludes lim_{x→2} f(x) ≈ 7. (a) Identify TWO problems with this approach to estimating limits. (b) Suggest a better tabular setup.",
      expectedAnswer:
        '(a) PROBLEMS: (1) X-VALUES NOT CLOSE ENOUGH TO 2. The values 1.5, 1.9, 2.5 are far from 2; they don\'t reveal the LIMIT behavior, only general function values. A limit estimate requires x values arbitrarily close to a — typically within 0.001 or closer. (2) ASYMMETRIC SAMPLING. Using mostly x < 2 (1.5 and 1.9) gives mostly left-side info; only x = 2.5 is right-side, and it\'s far. The student is implicitly assuming the limit equals the value at distant points, which can be wildly wrong if there\'s a discontinuity near 2. (3) NO DNE CHECK. The student needs to check whether left and right trends DISAGREE. Three points can\'t establish trend reliability. (b) BETTER SETUP: take x = 1.9, 1.99, 1.999 from the left AND x = 2.001, 2.01, 2.1 from the right (six values total, three on each side, progressively closer). Compute f at each. Verify (i) left trend converges to some value L₁, (ii) right trend converges to L₂, (iii) L₁ ≈ L₂ → estimate is L. If L₁ ≠ L₂ → limit DNE. Strong answers: (i) name "too far from a", (ii) name "asymmetric/inadequate two-sided coverage", (iii) propose a better symmetric, progressively-closer setup.',
      responseFormat: 'frq',
      hints: [
        'Are the x-values close enough to 2?',
        'Is each side evenly sampled?',
        'How would you spot a one-sided disagreement from this table?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Graphical: trace curve from both sides; open circle = limit value, closed = actual.',
        'Tabular: x-values progressively closer from both sides; trend convergence is the limit estimate.',
        'BOTH SIDES needed; one-sided disagreement = DNE.',
        'Estimation ≠ proof. Algebraic methods (next plan) prove limits exactly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.3-1.4',
    cedTitle: 'Estimating Limits from Graphs and Tables',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard AP calc graph + table introduction to limits.' },
    ],
  },
};
