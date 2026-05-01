/**
 * AP Calculus AB — Unit 1: Limits and Continuity.
 *
 * Foundation of all later units. AP exam asks 1-2 limit MCQs and embeds
 * limits inside FRQs throughout. Indeterminate forms, IVT, removable discontinuities.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_LIMITS_CONTINUITY: LessonPlan = {
  id: 'evelyn.ap.calc.limits-continuity.v1',
  title: 'AP Calc AB — Unit 1: Limits, Continuity, and the IVT',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ap.calc.limits-continuity',
      description: 'Evaluate limits algebraically and graphically, identify indeterminate forms, recognize and classify discontinuities, apply the Intermediate Value Theorem, and use the formal (ε-δ optional) understanding of continuity.',
      standard: 'AP-CALC-AB-1',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Limits drive every later calculus topic.',
      script: 'Unit 1 of AP Calc AB looks easy compared to derivatives + integrals, but it\'s the foundation for everything that follows. Every derivative is a limit (definition: f\'(a) = lim h→0 [f(a+h)−f(a)]/h). Every integral is a limit (Riemann sum). The AP exam asks 1-2 direct limit questions per MCQ section and weaves limits into FRQs constantly. Master the algebraic + graphical methods, the indeterminate-form patterns, and the IVT statement, and the rest of AB clicks into place.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-evaluating-limits',
      kind: 'concept',
      goal: 'How to evaluate limits — three main methods.',
      keyIdeas: [
        'METHOD 1 — DIRECT SUBSTITUTION: if the function is continuous at x = a, lim_{x→a} f(x) = f(a). Always TRY this first.',
        'METHOD 2 — ALGEBRAIC MANIPULATION (when substitution gives 0/0): factor + cancel, rationalize, combine fractions, expand. The 0/0 indicates a "removable" issue.',
        'METHOD 3 — GRAPHICAL/TABLE: read the limit from a graph or value table. Watch for asymptotes (limit doesn\'t exist if f → ∞) and jumps (left + right limits differ).',
        'INDETERMINATE FORMS: 0/0, ∞/∞, 0·∞, ∞−∞, 0⁰, ∞⁰, 1^∞. Don\'t simplify directly — must use algebra, L\'Hôpital (Unit 4 topic), or special limits.',
        'DETERMINATE FORMS that SAY THE ANSWER directly: 5/0 → ±∞ (sign by analysis), nonzero/nonzero → number, ∞ + ∞ → ∞, ∞·5 → ±∞.',
        'ONE-SIDED LIMITS: lim_{x→a⁻} (left side, x < a) and lim_{x→a⁺} (right side, x > a). Two-sided limit exists ONLY IF both one-sided limits exist + are EQUAL.',
        'INFINITY LIMITS: lim_{x→∞} f(x) describes end behavior. For rational functions: compare degrees. Same degree → ratio of leading coefficients. Numerator degree higher → ±∞. Denominator higher → 0.',
        'KEY SPECIAL LIMITS to memorize: lim_{x→0} sin(x)/x = 1; lim_{x→0} (1−cos(x))/x = 0; lim_{x→0} (1−cos(x))/x² = 1/2.',
      ],
      vocabulary: [
        { term: 'limit', definition: 'lim_{x→a} f(x) = L means f(x) gets arbitrarily close to L as x approaches a (without necessarily reaching a).' },
        { term: 'indeterminate form', definition: 'an expression like 0/0 or ∞/∞ that doesn\'t directly give a numerical limit; requires algebraic or analytical work.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-continuity',
      kind: 'concept',
      goal: 'Continuity definition + types of discontinuity + IVT.',
      keyIdeas: [
        'CONTINUITY at x = a requires THREE conditions: (1) f(a) is DEFINED. (2) lim_{x→a} f(x) EXISTS. (3) lim_{x→a} f(x) = f(a).',
        'TYPES OF DISCONTINUITY:',
        '  REMOVABLE (HOLE): the limit exists but f(a) is undefined or ≠ limit. E.g., (x²−1)/(x−1) has a hole at x = 1; can be "removed" by redefining f(1) = 2.',
        '  JUMP: left and right limits exist but differ. Common in piecewise functions.',
        '  INFINITE (VERTICAL ASYMPTOTE): function → ±∞ at the point. E.g., 1/x at x = 0.',
        '  OSCILLATING: function oscillates infinitely fast near point (e.g., sin(1/x) at x = 0). Less common on AP.',
        'CONTINUOUS ON INTERVAL: continuous at every point in the interval. AP often requires showing this for IVT or theorem application.',
        'INTERMEDIATE VALUE THEOREM (IVT): if f is CONTINUOUS on [a, b] AND k is between f(a) and f(b), then THERE EXISTS some c in (a, b) where f(c) = k.',
        'IVT APPLICATION on AP: prove a function takes a particular value or has a root. Format: "f is continuous on [a,b] (justify); f(a) = ... and f(b) = ...; since 0 is between them, by IVT there exists c in (a,b) with f(c) = 0."',
        'EXTREME VALUE THEOREM (EVT): if f is continuous on a CLOSED [a, b], f attains an absolute max + absolute min on the interval. (Useful in Unit 5 optimization.)',
      ],
      vocabulary: [
        { term: 'continuous function', definition: 'f is continuous at a if f(a) is defined, lim_{x→a} f(x) exists, and the two are equal.' },
        { term: 'Intermediate Value Theorem', definition: 'continuous f on [a,b] takes every value between f(a) and f(b) at some point in (a,b).' },
        { term: 'removable discontinuity', definition: 'a discontinuity where the limit exists; can be "fixed" by redefining f(a) to equal the limit.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-limit',
      kind: 'worked_example',
      problem: 'Evaluate lim_{x→3} (x² − 9) / (x − 3).',
      steps: [
        'STEP 1 — try direct substitution: (3² − 9)/(3 − 3) = 0/0. INDETERMINATE.',
        'STEP 2 — factor: x² − 9 = (x−3)(x+3). So expression = (x−3)(x+3)/(x−3).',
        'STEP 3 — cancel (x−3) (valid for x ≠ 3, which is fine because we\'re taking a limit, not evaluating at x = 3): expression simplifies to (x + 3).',
        'STEP 4 — substitute x = 3 into the simplified expression: 3 + 3 = 6.',
        'ANSWER: lim_{x→3} (x² − 9)/(x − 3) = 6. The original function has a REMOVABLE discontinuity at x = 3 (a hole at point (3, 6)).',
        'CHECK with graphical sense: y = x + 3 with a hole at x = 3 — graph passes through (3, 6) without actually being defined there.',
      ],
      answer: '6',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find lim_{x→0} sin(5x)/x.',
      expectedAnswer: '5. Use the special limit lim_{u→0} sin(u)/u = 1. Rewrite sin(5x)/x = 5·sin(5x)/(5x). As x → 0, 5x → 0, so sin(5x)/(5x) → 1. Therefore the whole expression → 5·1 = 5.',
      responseFormat: 'numeric',
      hints: [
        'Special limit: sin(u)/u → 1 as u → 0.',
        'Multiply by 5/5 to set up the special form.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-limit-equals-value',
      kind: 'misconception_check',
      question: 'If lim_{x→a} f(x) = L, then f(a) must equal L. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Conflating limit value with function value.',
          correctsTo: 'False. The limit describes what f(x) APPROACHES as x approaches a — but f(a) itself can be (1) a different value, (2) undefined, or (3) the same as the limit. Only when ALL THREE continuity conditions hold do we have lim = f(a). Example: f(x) = (x²−1)/(x−1) has lim_{x→1} f(x) = 2 but f(1) is UNDEFINED (0/0). Or define g(x) = (x²−1)/(x−1) for x ≠ 1, g(1) = 5. Then lim = 2 but g(1) = 5 — they differ. AP loves to test this distinction in MCQs about removable discontinuities.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Try direct substitution first; if 0/0 indeterminate, factor/rationalize/special limit.',
        'Two-sided limit exists iff both one-sided limits exist and are equal.',
        'Continuity at a: f(a) defined, limit exists, limit = f(a) — all three.',
        'Discontinuity types: removable (hole), jump, infinite, oscillating.',
        'IVT: continuous on [a,b] + k between f(a),f(b) → exists c in (a,b) with f(c)=k.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the IVT require the function to be CONTINUOUS, and what kind of failure can occur if continuity fails?',
      hint: 'IVT depends on the function having NO BREAKS — its graph traces a continuous curve from (a, f(a)) to (b, f(b)). If the curve passes from below k to above k, the curve must CROSS k (graphically obvious; rigorously requires the completeness of real numbers). With a JUMP DISCONTINUITY, the function can "leap" past k without ever taking k as a value. Example: f(x) = 0 for x < 0 and f(x) = 1 for x ≥ 0. f(−1) = 0, f(1) = 1, but f never equals 0.5 anywhere — the jump bypassed it. The continuity hypothesis is what RULES OUT such leaps. AP often tests IVT applications by asking students to JUSTIFY continuity; without that justification, the application is incomplete and loses points.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
