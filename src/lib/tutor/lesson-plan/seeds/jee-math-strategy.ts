/**
 * JEE — Math subject-specific strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MATH_STRATEGY: LessonPlan = {
  id: 'evelyn.jee.math.strategy.v1',
  title: 'JEE Math strategy',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'math',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'jee.math-strategy',
      description: 'Apply subject-specific strategy to JEE Math: high-yield chapters, problem-solving frameworks, calculator-free shortcuts, and avoiding silly errors.',
      standard: 'JEE-MATH',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Math has the highest scoring ceiling on JEE.',
      script: 'JEE Math is the section where top rankers SEPARATE from the pack. The questions are challenging but fair — every problem has a clean solution method. Speed AND accuracy both matter. Master the high-yield chapters (calculus, coordinate geometry, algebra, vectors+3D, trig) and you can clean up. Math Time = Bank Time on the JEE.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'High-yield chapters, frameworks, common errors, books.',
      keyIdeas: [
        'HIGH-YIELD TOPICS (heaviest weighted): CALCULUS (limits, continuity, differentiation, application of derivatives, integration, definite integrals, area, differential equations), COORDINATE GEOMETRY (lines, circles, parabola, ellipse, hyperbola, 3D), ALGEBRA (quadratics, complex numbers, sequences, permutations + combinations, probability, binomial), VECTORS + 3D, TRIGONOMETRY (functions, identities, equations, inverse trig).',
        'FRAMEWORK: 1) READ the question completely. 2) IDENTIFY which chapter / sub-topic. 3) RECALL the standard method (most JEE math problems have a "type"). 4) EXECUTE the method. 5) VERIFY by plugging into original or testing limits.',
        'CALCULATOR-FREE: JEE allows NO calculators. Internalize squares (up to 30²), common cubes, log values for 2, 3, 5, 7, sin/cos/tan of standard angles, e ≈ 2.718, π ≈ 3.14159.',
        'STANDARD METHODS to internalize: substitution + integration by parts for integration, parameter differentiation, partial fractions, completing the square, cross-multiplication for systems, locus method for coordinate geometry.',
        'SILLY ERRORS: sign errors in integration, miscounted limits, dropped factor of 2 in derivatives, wrong quadrant in inverse trig. Slow down on the LAST STEP — that\'s where 80% of silly errors hide.',
        'BOOKS: NCERT for foundation, RD Sharma for breadth, Cengage / Arihant series for JEE-style problems, ML Khanna for hardest. Don\'t hop between books — pick one set + master it.',
        'GRAPH-FIRST: many calculus / coord geo questions become trivial with a quick sketch. Train yourself to sketch in <30 seconds.',
        'CONNECTIONS: trig + complex numbers, vectors + 3D + coord geo, calculus + algebra. JEE Advanced loves to combine — practice cross-topic problems.',
        'TIME: in JEE Main, 30 math Qs in ~50-60 min. Top rankers finish in 45 min and use the buffer for hard ones. Pace yourself.',
      ],
      vocabulary: [
        { term: 'locus', definition: 'the set of points satisfying a given geometric condition; key concept in coordinate geometry.' },
        { term: 'parameter differentiation', definition: 'differentiating x = f(t) and y = g(t) separately, then dy/dx = (dy/dt) / (dx/dt).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-integration',
      kind: 'worked_example',
      problem: 'Evaluate ∫ from 0 to π/2 of sin²(x) dx. Use the standard JEE technique.',
      steps: [
        'IDEA: use the identity sin²(x) = (1 − cos(2x)) / 2.',
        '∫₀^(π/2) sin²(x) dx = ∫₀^(π/2) (1 − cos 2x)/2 dx',
        '= (1/2) [x − sin(2x)/2] from 0 to π/2',
        '= (1/2) [(π/2 − sin(π)/2) − (0 − 0)]',
        '= (1/2) [π/2 − 0]',
        '= π/4.',
        'ALTERNATIVE: by symmetry, ∫₀^(π/2) sin²x dx = ∫₀^(π/2) cos²x dx = (1/2) ∫₀^(π/2) (sin²x + cos²x) dx = (1/2)(π/2) = π/4. Faster!',
        'JEE LESSON: always look for symmetry / identities BEFORE doing substitution. Saves time.',
      ],
      answer: 'π/4',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How many tangent lines can be drawn to the circle x² + y² = 25 from the point (5, 0)?',
      expectedAnswer: '1 — the point (5, 0) lies ON the circle (since 5² + 0² = 25). Only one tangent at any point on a circle. If the point were outside, two tangents; if inside, zero.',
      responseFormat: 'free',
      hints: [
        'Where does the point (5, 0) lie relative to the circle?',
        'Plug in: 5² + 0² = 25 = r². On the circle.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-formulas',
      kind: 'misconception_check',
      question: 'Is JEE Math mostly about memorizing formulas?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating math as memorization.',
          correctsTo: 'Partly — but more about UNDERSTANDING WHY each formula works. You need ~100 formulas at instant recall (trig identities, integration formulas, conic equations). But many JEE problems can\'t be solved by formula plug-and-chug — they require RECOGNIZING the underlying method (substitution, parametric, partial fractions). Mastering 5-10 standard methods deeply matters more than memorizing 200 formulas shallowly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'High-yield: calculus, coord geo, algebra, vectors+3D, trig.',
        'Sketch graphs first; many problems become obvious.',
        'Internalize identities + standard methods (substitution, parts, parametric).',
        'Slow down on the LAST step — silly errors hide there.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the substitution u = π/2 − x particularly powerful for definite integrals from 0 to π/2?',
      hint: 'It exchanges sin ↔ cos, and the limits map 0 → π/2 → 0. So ∫₀^(π/2) sin^n x dx = ∫₀^(π/2) cos^n x dx. Many JEE integrals reduce to (1/2) ∫₀^(π/2) (sin^n x + cos^n x) dx, which simplifies via Pythagoras. Master this — it appears EVERY year on JEE.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
