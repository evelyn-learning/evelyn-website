/**
 * AP Calculus BC — CED Unit 1.9: Connecting Multiple Representations of
 * Limits.
 *
 * Translating a single limit statement across its graphical, numerical
 * (table), and analytical (algebraic) forms — and recognizing when the
 * three agree, when a limit fails to exist, and how one-sided limits show
 * up in each representation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_REPRESENTATIONS: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-representations.v1',
  title: 'U1.9 Connecting Multiple Representations of Limits',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-representations',
      description:
        'Translate a limit statement among its graphical, numerical (table of values), and analytical (algebraic) representations; read one-sided and two-sided limits off each form; and determine from any representation whether a limit exists.',
      standard: 'AP-CALCBC-1.9',
    },
  ],
  prerequisites: ['apcalcbc.squeeze-theorem'],
  followUps: ['apcalcbc.discontinuity-types'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the limit as one idea wearing three different costumes.',
      script:
        "A limit is one idea, but the AP exam shows it to you in three different costumes: a GRAPH, a TABLE of values, and an ALGEBRAIC expression. The skill that separates a 5 from a 3 is fluency — seeing a table and picturing the graph, seeing a graph and predicting the algebra. Today we connect all three so that no matter which costume the exam hands you, you read the same limit underneath.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-representations',
      kind: 'concept',
      goal: 'Cover the three representations, how each shows one-sided limits, and what each looks like when the limit DNE.',
      keyIdeas: [
        'THREE REPRESENTATIONS of a limit lim_{x→a} f(x): (1) GRAPHICAL — trace the curve as x approaches a from each side and see what height y the curve heads toward. (2) NUMERICAL — a TABLE of f(x) for x values creeping toward a (e.g. 1.9, 1.99, 1.999 and 2.1, 2.01, 2.001). (3) ANALYTICAL — an algebraic rule for f(x) you evaluate with substitution / factoring / manipulation.',
        'THE CORE PRINCIPLE: the limit is about the value f(x) APPROACHES, not the value f(a) ACTUALLY IS. All three representations report the approach; the function may be undefined or take a different value AT a (a hole or jump) without changing the limit.',
        'ONE-SIDED LIMITS in each form. GRAPH: approach a from the left (x → a⁻) by tracing the curve from the left; from the right (x → a⁺) by tracing from the right. TABLE: the rows with x BELOW a give the left limit; rows ABOVE a give the right limit. ANALYTICAL: piecewise rules or sign analysis (e.g. for 1/(x−a)) give each side.',
        'EXISTENCE RULE: lim_{x→a} f(x) EXISTS ⇔ left-hand limit = right-hand limit (both finite and equal). If the two sides disagree, the two-sided limit DOES NOT EXIST (DNE).',
        'WHAT "DNE" LOOKS LIKE in each form. JUMP: graph leaps between two heights / table settles on two different values from the two sides. UNBOUNDED (vertical asymptote): graph shoots to ±∞ / table values grow without bound. OSCILLATION: graph wiggles infinitely fast (e.g. sin(1/x)) / table values never settle.',
        'READING A TABLE — the tell. If f(1.999) ≈ 4.997 and f(2.001) ≈ 5.003, both sides are marching toward 5: estimate lim = 5. If the left rows head to 3 and the right rows head to 7, the sides disagree → limit DNE (but each one-sided limit exists).',
        'CONSISTENCY CHECK — the AP move. Given any two representations, confirm they tell the same story. A table heading to 5 should match a graph approaching height 5 and algebra that simplifies to 5. If a representation seems to disagree, suspect a hole, a jump, or a misread of which side you are on.',
        'CAUTION — tables can mislead. A table can only sample finitely many points; rapidly oscillating functions (sin(1/x) near 0) can produce a deceptively "settled-looking" table. Treat a numerical table as ESTIMATION evidence, confirmed by graph or algebra when available.',
      ],
      vocabulary: [
        { term: 'one-sided limit', definition: 'the value f(x) approaches as x → a from a single side (left, x→a⁻, or right, x→a⁺).' },
        { term: 'limit DNE', definition: 'the two-sided limit does not exist — typically because the one-sided limits disagree, the function is unbounded, or it oscillates.' },
      ],
      suggestedTools: ['show_function_graph', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-table-to-limit',
      kind: 'worked_example',
      problem:
        'A function f is sampled near x = 3 with these values: f(2.9) = 6.80, f(2.99) = 6.98, f(2.999) = 6.998; f(3.1) = 7.20, f(3.01) = 7.02, f(3.001) = 7.002. The function is undefined at x = 3. (a) Estimate the left- and right-hand limits. (b) State whether lim_{x→3} f(x) exists, and (c) describe what the graph must look like near x = 3.',
      steps: [
        'STEP 1 — SORT THE ROWS BY SIDE. Values with x < 3 (2.9, 2.99, 2.999) give the LEFT approach; values with x > 3 (3.1, 3.01, 3.001) give the RIGHT approach.',
        'STEP 2 — LEFT-HAND LIMIT. As x climbs 2.9 → 2.99 → 2.999 (toward 3 from below), f goes 6.80 → 6.98 → 6.998. These march toward 7. So lim_{x→3⁻} f(x) ≈ 7.',
        'STEP 3 — RIGHT-HAND LIMIT. As x falls 3.1 → 3.01 → 3.001 (toward 3 from above), f goes 7.20 → 7.02 → 7.002. These also march toward 7. So lim_{x→3⁺} f(x) ≈ 7.',
        'STEP 4 — EXISTENCE. Left limit (7) = right limit (7). Both sides agree, so lim_{x→3} f(x) = 7 EXISTS, even though f(3) itself is undefined.',
        'STEP 5 — GRAPH PICTURE. The curve approaches the height y = 7 from both sides but has a HOLE (open circle) at the point (3, 7), since f is not defined there. This is exactly the graphical signature of a removable discontinuity — the bridge to Topic 1.10.',
      ],
      answer: 'Left limit ≈ 7, right limit ≈ 7; lim_{x→3} f(x) = 7 exists. Graph approaches height 7 from both sides with a hole at (3, 7).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-graph-read',
      kind: 'try_yourself',
      problem:
        'From a graph you are told: as x → 1 from the left the curve rises toward height 2; as x → 1 from the right the curve sits at height 5; and there is a solid dot at (1, 5). Give (i) lim_{x→1⁻} f(x), (ii) lim_{x→1⁺} f(x), (iii) lim_{x→1} f(x), and (iv) f(1).',
      expectedAnswer:
        '(i) lim_{x→1⁻} f(x) = 2 (the left branch heads to height 2). (ii) lim_{x→1⁺} f(x) = 5 (the right branch heads to height 5). (iii) lim_{x→1} f(x) DOES NOT EXIST — the one-sided limits disagree (2 ≠ 5), which is a JUMP discontinuity. (iv) f(1) = 5 (the solid dot gives the actual function value). Key point: the two-sided limit DNE even though BOTH one-sided limits exist and f(1) is defined — the value of the function at the point is irrelevant to whether the limit exists.',
      responseFormat: 'free',
      hints: [
        'Left branch height = left limit; right branch height = right limit.',
        'Two-sided limit exists only if the two sides agree.',
        'A solid dot gives f(a); it does not affect the limit.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-match-representations',
      kind: 'try_yourself',
      problem:
        'For f(x) = (x² − 4)/(x − 2): (a) find lim_{x→2} f(x) ANALYTICALLY, (b) predict what a table of f(1.99) and f(2.01) would show, and (c) describe the graph at x = 2.',
      expectedAnswer:
        '(a) ANALYTICAL: factor the numerator: (x² − 4)/(x − 2) = (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2. So lim_{x→2} f(x) = 2 + 2 = 4. (b) NUMERICAL: since f(x) = x + 2 away from 2, f(1.99) ≈ 3.99 and f(2.01) ≈ 4.01 — both sides march to 4, confirming the analytical answer. (c) GRAPHICAL: the graph is the line y = x + 2 with a HOLE (open circle) at (2, 4), because the original f is undefined at x = 2 (0/0). All three representations agree on the limit value 4; they differ only in how they display the hole.',
      responseFormat: 'free',
      hints: [
        'Factor and cancel to evaluate the limit algebraically.',
        'Plug x-values just below and above 2 into the simplified form.',
        '0/0 at a point with a cancelable factor ⇒ a hole, not an asymptote.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-dne-synthesis',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A student claims "the table shows f(−0.1) = 0.5, f(−0.01) = 0.5, f(0.1) = 0.5, f(0.01) = 0.5, so lim_{x→0} f(x) = 0.5" for f(x) = cos(1/x) sampled at convenient points. Critique the reasoning: is the conclusion justified? Explain using the connection between representations.',
      expectedAnswer:
        'The conclusion is NOT justified. The student fell into the table-can-mislead trap. f(x) = cos(1/x) OSCILLATES infinitely fast as x → 0: cos(1/x) takes every value in [−1, 1] over and over as x → 0. The chosen sample points happen to land where cos(1/x) = 0.5, producing a deceptively consistent table, but BETWEEN those points the function swings across the whole range [−1, 1]. GRAPHICALLY the curve wiggles without settling; ANALYTICALLY there is no single value it approaches. Therefore lim_{x→0} cos(1/x) DOES NOT EXIST. The lesson: a numerical table samples only finitely many points and can hide oscillation — it provides ESTIMATION evidence only, and must be cross-checked against the graph or algebra. Strong answers explicitly (i) identify the infinite oscillation, (ii) note the sampling artifact, and (iii) conclude DNE with the cross-representation justification.',
      responseFormat: 'frq',
      hints: [
        'What does cos(1/x) do as x → 0?',
        'Could the chosen sample points be hiding the behavior between them?',
        'A table is estimation evidence, not proof.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A limit has three representations — graph, table, algebra — that must agree.',
        'Limit exists ⇔ left-hand limit = right-hand limit.',
        'The limit reports what f APPROACHES, independent of f(a).',
        'DNE signatures: jump (sides disagree), unbounded (→ ±∞), oscillation (never settles).',
        'Tables only sample finitely many points — confirm with graph or algebra.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.9',
    cedTitle: 'Connecting Multiple Representations of Limits',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Graphical, numerical, and analytical views of limits and their consistency.' },
    ],
  },
};
