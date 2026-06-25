/**
 * AP Calculus BC — CED Unit 5.12: Exploring Behaviors of Implicit
 * Relations.
 *
 * Using implicit differentiation to analyze curves that are not functions:
 * locating horizontal tangents (dy/dx = 0), vertical tangents (dy/dx
 * undefined), and concavity via the second derivative of an implicit
 * relation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_IMPLICIT_BEHAVIORS: LessonPlan = {
  id: 'evelyn.ap.calcbc.implicit-behaviors.v1',
  title: 'U5.12 Exploring Behaviors of Implicit Relations',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.implicit-behaviors',
      description:
        'Apply the analytical tools of differentiation to implicitly defined relations: locate horizontal tangents (dy/dx = 0), vertical tangents (dy/dx undefined / denominator = 0), and determine concavity using the second derivative of an implicit relation.',
      standard: 'AP-CALCBC-5.12',
    },
  ],
  prerequisites: ['apcalcbc.implicit-differentiation', 'apcalcbc.concavity-second-derivative'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame implicit relations as curves that fail the vertical-line test but still have analyzable tangents and concavity.',
      script:
        "A circle x² + y² = 25 isn't a function — it fails the vertical-line test, so the increasing/decreasing and concavity machinery from earlier in this unit seems off the table. But it isn't. Implicit differentiation lets us find dy/dx and d²y/dx² for these curves too, so we can still ask the unit's signature questions: where is the tangent flat? where is it vertical? where does the curve bow up or down? Today we point Unit 5's analytical toolkit at curves that aren't functions.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-implicit-behavior',
      kind: 'concept',
      goal: 'Cover horizontal/vertical tangents and concavity for implicit relations.',
      keyIdeas: [
        'SETUP. An implicit relation (e.g. x² + y² = 25, or x² + xy + y² = 7) defines a curve where y is not a single function of x. Implicit differentiation gives dy/dx as an expression in BOTH x and y — typically a FRACTION, dy/dx = N(x, y) / D(x, y).',
        'HORIZONTAL TANGENT ⇔ dy/dx = 0. A fraction equals zero exactly when its NUMERATOR = 0 (and the denominator ≠ 0). So set N(x, y) = 0, combine with the original relation to solve for the point(s), and you have where the tangent is flat.',
        'VERTICAL TANGENT ⇔ dy/dx is UNDEFINED. A fraction is undefined when its DENOMINATOR = 0 (and the numerator ≠ 0). So set D(x, y) = 0, combine with the original relation, and you have where the tangent is vertical (the curve momentarily runs straight up/down).',
        'WATCH THE 0/0 CASE. If numerator AND denominator are both 0 at a point, dy/dx is indeterminate there — the point may be a crossing, cusp, or corner. AP problems usually avoid this, but recognize it: a 0/0 reading is NOT automatically a horizontal or vertical tangent.',
        'EXAMPLE — circle x² + y² = 25. Implicit diff: 2x + 2y·y′ = 0 → y′ = −x/y. Horizontal tangent where numerator −x = 0 ⇒ x = 0 ⇒ points (0, 5) and (0, −5) (top and bottom). Vertical tangent where denominator y = 0 ⇒ points (5, 0) and (−5, 0) (left and right). This matches the picture perfectly.',
        'CONCAVITY — second derivative implicitly. Differentiate dy/dx = N/D AGAIN with respect to x, using the quotient rule and substituting y′ wherever it appears. The result d²y/dx² is an expression in x, y (and after substituting y′, in x and y only). Then: d²y/dx² > 0 ⇒ curve CONCAVE UP at that point; < 0 ⇒ CONCAVE DOWN.',
        'THE KEY SUBSTITUTION STEP. When you compute d²y/dx², the algebra will contain y′. Replace EVERY y′ with the first-derivative expression N/D, then simplify — often using the original relation to clean up (e.g. replace x² + y² with 25). Forgetting to substitute y′ is the #1 error.',
        'INTERPRETATION stays the same as for functions: dy/dx sign → increasing/decreasing as you move along the curve; d²y/dx² sign → concavity. Implicit relations just require carrying y through the algebra.',
      ],
      vocabulary: [
        { term: 'horizontal tangent', definition: 'a point where dy/dx = 0 (numerator of the derivative is zero); the tangent line is flat.' },
        { term: 'vertical tangent', definition: 'a point where dy/dx is undefined (denominator of the derivative is zero); the tangent line is vertical.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ellipse-tangents',
      kind: 'worked_example',
      problem:
        'For the ellipse x² + xy + y² = 7, find every point where the tangent line is horizontal.',
      steps: [
        'STEP 1 — IMPLICIT DIFFERENTIATION. Differentiate both sides w.r.t. x, using the product rule on xy: 2x + (1·y + x·y′) + 2y·y′ = 0.',
        'STEP 2 — SOLVE FOR y′. Group y′ terms: 2x + y + (x + 2y)y′ = 0 ⇒ y′ = −(2x + y)/(x + 2y). So N(x,y) = −(2x + y) and D(x,y) = (x + 2y).',
        'STEP 3 — HORIZONTAL TANGENT CONDITION. Set the numerator = 0: 2x + y = 0 ⇒ y = −2x. (Also require the denominator x + 2y ≠ 0 to make sure dy/dx is genuinely 0, not 0/0.)',
        'STEP 4 — SUBSTITUTE INTO THE ORIGINAL RELATION. Put y = −2x into x² + xy + y² = 7: x² + x(−2x) + (−2x)² = 7 ⇒ x² − 2x² + 4x² = 7 ⇒ 3x² = 7 ⇒ x² = 7/3 ⇒ x = ±√(7/3).',
        'STEP 5 — FIND THE POINTS. For each x, y = −2x. So x = √(7/3) gives (√(7/3), −2√(7/3)); x = −√(7/3) gives (−√(7/3), 2√(7/3)). Check the denominator x + 2y = x + 2(−2x) = −3x ≠ 0 at both (since x ≠ 0), so these are genuine horizontal tangents.',
        'STEP 6 — STATE THE ANSWER. Horizontal tangents at (√(7/3), −2√(7/3)) and (−√(7/3), 2√(7/3)). Numerically, √(7/3) ≈ 1.528, so approximately (1.528, −3.055) and (−1.528, 3.055).',
      ],
      answer: 'Horizontal tangents at (±√(7/3), ∓2√(7/3)) ≈ (1.528, −3.055) and (−1.528, 3.055).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-vertical-tangent',
      kind: 'try_yourself',
      problem:
        'For the circle x² + y² = 25, find every point where the tangent line is VERTICAL, and explain the condition you used.',
      expectedAnswer:
        'Implicit differentiation: 2x + 2y·y′ = 0 ⇒ y′ = −x/y. A vertical tangent occurs where dy/dx is UNDEFINED, i.e. where the DENOMINATOR y = 0 (with numerator −x ≠ 0). Set y = 0 and substitute into x² + y² = 25: x² = 25 ⇒ x = ±5. So vertical tangents at (5, 0) and (−5, 0) — the rightmost and leftmost points of the circle. Check numerator −x ≠ 0 there (−5 and 5, both nonzero), confirming genuine vertical tangents. This matches the picture: the circle runs straight up-and-down at its left and right edges.',
      responseFormat: 'free',
      hints: [
        'Vertical tangent ⇔ dy/dx undefined ⇔ denominator = 0.',
        'Set y = 0, substitute back into the circle equation.',
        'Confirm the numerator is nonzero so it is not 0/0.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concavity',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. For x² + y² = 25, you found y′ = −x/y. (a) Find d²y/dx² and simplify using the original relation. (b) Determine the concavity at the point (3, 4), and (c) explain why your sign answer makes sense geometrically.',
      expectedAnswer:
        "(a) SECOND DERIVATIVE. Differentiate y′ = −x/y with the quotient rule: d²y/dx² = −[(1)(y) − (x)(y′)] / y² = −(y − x·y′)/y². Now SUBSTITUTE y′ = −x/y: d²y/dx² = −(y − x·(−x/y))/y² = −(y + x²/y)/y² = −((y² + x²)/y)/y² = −(x² + y²)/y³. Use the original relation x² + y² = 25: d²y/dx² = −25/y³. (b) AT (3, 4): d²y/dx² = −25/(4³) = −25/64 < 0, so the curve is CONCAVE DOWN at (3, 4). (c) GEOMETRIC SENSE: (3, 4) is on the UPPER half of the circle, which arches like a dome — concave down. (On the lower half, y < 0 makes y³ < 0, so −25/y³ > 0 → concave up, which also matches the upward-bowing bottom of the circle.) Strong answers (i) apply the quotient rule, (ii) substitute y′ back in — the critical step — (iii) simplify via x² + y² = 25, and (iv) connect the sign to the geometry of the circle's upper arc.",
      responseFormat: 'frq',
      hints: [
        'Quotient-rule y′ = −x/y, then substitute y′ = −x/y everywhere it appears.',
        'Use x² + y² = 25 to collapse the numerator.',
        'Plug in (3, 4); the sign tells you the concavity.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Implicit dy/dx is a fraction N/D in x and y.',
        'Horizontal tangent: numerator N = 0 (denominator ≠ 0).',
        'Vertical tangent: denominator D = 0 (numerator ≠ 0).',
        'Both 0 ⇒ indeterminate (cusp/crossing) — not automatically horizontal or vertical.',
        'For d²y/dx², differentiate again and SUBSTITUTE y′ back in; simplify with the original relation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.12',
    cedTitle: 'Exploring Behaviors of Implicit Relations',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Implicit differentiation applied to tangents and concavity of non-function curves.' },
    ],
  },
};
