/**
 * AP Calculus AB — Unit 5: Analytical Applications of Differentiation.
 *
 * Critical points, first/second derivative tests, concavity, curve sketching,
 * Mean Value Theorem. Heavily tested in AP FRQs ("describe behavior of f").
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_CURVE_SKETCHING: LessonPlan = {
  id: 'evelyn.ap.calc.curve-sketching.v1',
  title: 'AP Calc AB — Unit 5: Critical Points, Concavity, Curve Sketching, MVT',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ap.calc.curve-sketching',
      description: 'Find critical points, classify extrema using first/second derivative tests, identify intervals of increase/decrease and concavity, locate inflection points, and apply the Mean Value Theorem.',
      standard: 'AP-CALC-AB-5',
    },
  ],
  prerequisites: ['ap.calc.chain-implicit'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Unit 5 = the most justification-heavy AB unit.',
      script: 'Unit 5 takes derivative information and uses it to describe a function\'s behavior — where it\'s increasing, where it has maxima, where the graph bends. AP FRQs in this unit are JUSTIFICATION-HEAVY: every claim about behavior needs a reason citing the derivative. The mechanics are straightforward, but the writing matters. Master the four key justifications (sign changes of f\', critical points, second derivative test, concavity) and FRQ scoring becomes systematic.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-extrema-first-derivative',
      kind: 'concept',
      goal: 'Critical points + first derivative test.',
      keyIdeas: [
        'CRITICAL POINT: a value x = c where f\'(c) = 0 OR f\'(c) is undefined (and c is in domain of f). Local extrema can ONLY occur at critical points (or at endpoints of closed intervals).',
        'INCREASING/DECREASING: f is INCREASING where f\' > 0; DECREASING where f\' < 0.',
        'FIRST DERIVATIVE TEST: at a critical point c where f\' changes sign:',
        '  f\' goes + to − → LOCAL MAXIMUM.',
        '  f\' goes − to + → LOCAL MINIMUM.',
        '  f\' doesn\'t change sign → NEITHER (point of inflection or constant region).',
        'AP JUSTIFICATION FORMAT: "f has a local maximum at x = c because f\' changes from positive to negative at c." Always cite the SIGN CHANGE.',
        'ABSOLUTE EXTREMA on closed [a, b]: by EVT, both exist. Find them by evaluating f at all critical points + endpoints, then comparing values.',
        'CANDIDATES TEST (sometimes called the closed-interval method): list all CRITICAL VALUES in [a,b] + the endpoints; evaluate f at each; the largest f-value is absolute max, smallest is absolute min.',
        'COMMON ERROR: forgetting endpoints when looking for absolute extrema on closed intervals.',
      ],
      vocabulary: [
        { term: 'critical point', definition: 'x = c in the domain of f where f\'(c) = 0 or f\'(c) does not exist; only places where local extrema can occur.' },
        { term: 'first derivative test', definition: 'classifies a critical point by the sign change of f\': +→− is local max, −→+ is local min.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-concavity-second',
      kind: 'concept',
      goal: 'Concavity + second derivative test + inflection points.',
      keyIdeas: [
        'CONCAVITY: f is CONCAVE UP where f\'\' > 0 (graph bends like a smile / cup-up). f is CONCAVE DOWN where f\'\' < 0 (graph bends like a frown / cup-down).',
        'INFLECTION POINT: a point where f changes concavity AND f is continuous there. Found where f\'\' = 0 OR f\'\' is undefined, AND f\'\' changes sign across that point.',
        'SECOND DERIVATIVE TEST: at a critical point c where f\'(c) = 0:',
        '  f\'\'(c) > 0 → LOCAL MIN (graph concave up there).',
        '  f\'\'(c) < 0 → LOCAL MAX (graph concave down there).',
        '  f\'\'(c) = 0 → INCONCLUSIVE; must use first derivative test instead.',
        'AP JUSTIFICATION FORMAT: "f has a point of inflection at x = c because f\'\' changes from positive to negative at c." Cite the SIGN CHANGE of f\'\'.',
        'COMMON ERROR — confusing extrema with inflection: f\' = 0 indicates extremum candidate; f\'\' = 0 indicates inflection candidate. Different tests, different conclusions.',
        'GRAPH VOCAB AP loves: "f is concave up on (a, b)," "f has a relative maximum at x = c," "f has a point of inflection at x = c." Use these phrases verbatim on FRQs.',
      ],
      vocabulary: [
        { term: 'concave up', definition: 'where f\'\' > 0; graph bends upward like a cup; tangent lines lie below the graph.' },
        { term: 'inflection point', definition: 'a point where f changes concavity (f\'\' changes sign) and f is continuous; not necessarily where f\' = 0.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-mvt-rolle',
      kind: 'concept',
      goal: 'Mean Value Theorem + Rolle\'s Theorem.',
      keyIdeas: [
        'MEAN VALUE THEOREM (MVT): if f is continuous on [a, b] AND differentiable on (a, b), then there exists c in (a, b) where f\'(c) = (f(b) − f(a))/(b − a). Geometrically: somewhere on the curve the TANGENT LINE has the same slope as the secant line connecting endpoints.',
        'ROLLE\'S THEOREM (special case of MVT): if f is continuous on [a, b], differentiable on (a, b), AND f(a) = f(b), then there exists c in (a, b) where f\'(c) = 0.',
        'MVT APPLICATION on AP: when given f(a) and f(b) values, asked to show some c exists with f\'(c) = a particular slope. JUSTIFICATION must state continuity + differentiability + invoke MVT.',
        'TYPICAL FRQ: "Selected values of differentiable function f are given. Show there must exist a value c in (1, 5) where f\'(c) = 4." → cite MVT: f continuous + differentiable on [1,5], (f(5)−f(1))/(5−1) = 4, so by MVT some c exists.',
        'ALSO: MVT can prove that two functions with the same derivative differ by a constant (foundation for antiderivatives).',
        'CAUTION: MVT requires continuity on closed AND differentiability on open. Discontinuity OR non-differentiability at any point in the interval breaks the theorem.',
      ],
      vocabulary: [
        { term: 'Mean Value Theorem', definition: 'on a continuous + differentiable [a,b], some c exists with f\'(c) equal to the average rate of change (f(b)−f(a))/(b−a).' },
        { term: 'Rolle\'s Theorem', definition: 'special case of MVT — when f(a) = f(b), there must exist c in (a,b) with f\'(c) = 0.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-curve',
      kind: 'worked_example',
      problem: 'For f(x) = x³ − 3x² − 9x + 5, find all critical points, classify each, and find inflection points.',
      steps: [
        'STEP 1 — find f\'(x) = 3x² − 6x − 9 = 3(x² − 2x − 3) = 3(x − 3)(x + 1). Set f\'(x) = 0 → x = 3 or x = −1. Both critical points (no undefined values).',
        'STEP 2 — sign analysis of f\': test intervals (−∞, −1), (−1, 3), (3, ∞). At x = −2: f\'(−2) = 3·(−5)(−1) = +15 > 0. At x = 0: f\'(0) = 3·(−3)(1) = −9 < 0. At x = 4: f\'(4) = 3·(1)(5) = +15 > 0.',
        'STEP 3 — first derivative test: at x = −1, f\' changes + to − → LOCAL MAX. At x = 3, f\' changes − to + → LOCAL MIN.',
        'STEP 4 — find values: f(−1) = −1 − 3 + 9 + 5 = 10. f(3) = 27 − 27 − 27 + 5 = −22.',
        'STEP 5 — find f\'\'(x) = 6x − 6. Set f\'\'(x) = 0 → x = 1. f\'\' < 0 for x < 1 (concave down), f\'\' > 0 for x > 1 (concave up). Sign changes → INFLECTION POINT at x = 1. f(1) = 1 − 3 − 9 + 5 = −6 → inflection at (1, −6).',
        'CONFIRM with second derivative test: f\'\'(−1) = −12 < 0 → max ✓. f\'\'(3) = 12 > 0 → min ✓.',
      ],
      answer: 'Local max at (−1, 10); local min at (3, −22); inflection point at (1, −6). Concave down on (−∞, 1); concave up on (1, ∞).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Apply the Mean Value Theorem to f(x) = x² on [0, 4]. Find the value c that satisfies the conclusion.',
      expectedAnswer: 'c = 2. f is continuous on [0,4] and differentiable on (0,4) ✓. Average rate = (f(4) − f(0))/(4 − 0) = (16 − 0)/4 = 4. f\'(x) = 2x. Set 2x = 4 → x = 2. Since 2 is in (0,4), c = 2 satisfies MVT.',
      responseFormat: 'numeric',
      hints: [
        'Average rate of change = (f(b) − f(a))/(b − a).',
        'Set f\'(c) equal to the average rate, solve for c.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-inflection-zero',
      kind: 'misconception_check',
      question: 'If f\'\'(c) = 0, then x = c must be an inflection point. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating f\'\' = 0 as sufficient for inflection.',
          correctsTo: 'False. f\'\'(c) = 0 is only NECESSARY (a candidate condition), not sufficient. To confirm an inflection point at x = c, the SECOND DERIVATIVE MUST CHANGE SIGN at c. Counter-example: f(x) = x⁴. f\'\'(x) = 12x², which equals 0 at x = 0 — but f\'\' doesn\'t change sign (it\'s ≥ 0 everywhere). Graph of x⁴ is concave up everywhere; no inflection at 0. AP FRQs frequently test this — students who skip the sign-change check lose justification points. Standard procedure: find candidates (f\'\' = 0 or undefined), then VERIFY sign change before declaring inflection.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Critical point: f\'(c) = 0 or undefined. First derivative test: +→− max, −→+ min.',
        'Concavity: f\'\'>0 up, f\'\'<0 down. Inflection requires f\'\' SIGN CHANGE (not just zero).',
        'Second derivative test at critical point c (f\'(c)=0): f\'\'(c)>0 min; f\'\'(c)<0 max; f\'\'(c)=0 inconclusive.',
        'Absolute extrema on [a,b]: candidates test — evaluate f at critical points + endpoints.',
        'MVT: continuous + differentiable → exists c with f\'(c) = (f(b)−f(a))/(b−a).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the Mean Value Theorem REQUIRE the function to be differentiable on the OPEN (a,b) but only continuous on the CLOSED [a,b]?',
      hint: 'The asymmetric hypothesis matches what the theorem actually needs. CONTINUITY ON CLOSED [a,b] is needed because the secant line connects (a, f(a)) and (b, f(b)) — both endpoints must be DEFINED (i.e., f(a) and f(b) exist), so f must include the endpoints. DIFFERENTIABILITY ON OPEN (a,b) is needed because the conclusion guarantees an INTERIOR c — the proof finds c in the open interval. The MVT doesn\'t care whether f\'(a) or f\'(b) exists; it only needs derivatives in the middle. EXAMPLE THAT ILLUSTRATES: f(x) = √x on [0, 1]. f is continuous on [0,1], differentiable on (0,1) (but NOT at x = 0 — vertical tangent). MVT still applies: f\'(c) = (1 − 0)/(1 − 0) = 1, and 1/(2√c) = 1 → c = 1/4. The non-differentiability at the closed endpoint doesn\'t break the theorem. AP often slips this asymmetry into MVT problems where the endpoint has a cusp or corner.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
