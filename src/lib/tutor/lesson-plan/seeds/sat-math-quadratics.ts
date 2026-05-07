/**
 * SAT Math — Quadratics: Factoring, Formula, Vertex Form.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_QUADRATICS: LessonPlan = {
  id: 'evelyn.testprep.sat-math.quadratics.v1',
  title: 'SAT Math — Quadratics (Factoring, Formula, Vertex Form)',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.quadratics', description: 'Solve SAT quadratic problems via factoring, quadratic formula, and vertex form; identify maxima/minima.', standard: 'CCSS.MATH.HSA.REI.B.4' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Quadratics are ~5-7 SAT Math questions — and SAT likes the same patterns repeatedly.', script: 'SAT quadratic questions: factor, find vertex, identify maximum/minimum, find x-intercepts, "for what value of k does the equation have one solution?" Today: the toolkit + SAT-specific patterns.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Factoring, formula, vertex form, discriminant, SAT patterns.', keyIdeas: [
      'STANDARD FORM: y = ax² + bx + c. Constants: a, b, c.',
      'FACTORING (when integer roots):',
      '  ax² + bx + c → (px + q)(rx + s).',
      '  Find p, q, r, s such that pr = a, qs = c, ps + qr = b.',
      '  For x² + bx + c: find two numbers that multiply to c and add to b.',
      'QUADRATIC FORMULA (always works):',
      '  x = (−b ± √(b² − 4ac)) / (2a).',
      'DISCRIMINANT Δ = b² − 4ac.',
      '  Δ > 0: TWO real roots.',
      '  Δ = 0: ONE real root (double root; vertex on x-axis).',
      '  Δ < 0: NO real roots (complex roots; parabola doesn\'t cross x-axis).',
      'VERTEX FORM: y = a(x − h)² + k. Vertex at (h, k).',
      '  CONVERTING standard to vertex: complete the square OR use h = −b/(2a), k = c − b²/(4a).',
      '  a > 0: opens UP, vertex is MINIMUM.',
      '  a < 0: opens DOWN, vertex is MAXIMUM.',
      'SAT-COMMON questions:',
      '  "Find the maximum/minimum of [parabola]" → find vertex y-value.',
      '  "For what value of k does ax² + bx + k = 0 have one solution?" → set Δ = 0.',
      '  "Which is equivalent to ax² + bx + c?" → factor or expand vertex form.',
      '  "Find roots" → factor or quadratic formula.',
      'PRODUCT/SUM of ROOTS (Vieta\'s):',
      '  Sum: −b/a. Product: c/a.',
      '  Useful for "what is sum of solutions?" without solving.',
      'SAT TRAP: vertex form parens. "y = (x + 3)² − 5" → vertex at (−3, −5), NOT (3, −5).',
    ], vocabulary: [{ term: 'discriminant', definition: 'b² − 4ac; sign determines number of real roots.' }, { term: 'vertex', definition: 'highest or lowest point of a parabola; (h, k) in vertex form y = a(x − h)² + k.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'For what value of k does the equation x² + 6x + k = 0 have exactly ONE real solution?', steps: [
      'One solution = discriminant zero. Δ = b² − 4ac = 0.',
      'Identify a = 1, b = 6, c = k.',
      'Δ = 36 − 4(1)(k) = 36 − 4k. Set to 0: 36 − 4k = 0 → k = 9.',
      'Verify: x² + 6x + 9 = 0 = (x + 3)². Single root at x = −3. ✓',
    ], answer: 'k = 9', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A parabola has equation y = −2(x − 4)² + 18. Find the vertex and the maximum value.', expectedAnswer: 'Vertex form y = a(x − h)² + k → vertex at (h, k) = (4, 18). Coefficient a = −2 (negative) → opens DOWN → vertex is MAXIMUM. Max value = 18.', responseFormat: 'free', hints: ['Vertex form makes h, k visible.', 'Coefficient a sign tells you up/down.'], estimatedMinutes: 3 },
    { id: 'misconception-vertex-sign', kind: 'misconception_check', question: 'A student reads y = (x + 3)² − 5 as having vertex at (3, −5). What\'s wrong?', commonErrors: [{ answer: 'Vertex at (3, −5)', misconception: 'Reading the sign inside parens directly instead of as (x − h).', correctsTo: 'Vertex form is y = a(x − h)² + k. So (x + 3)² = (x − (−3))², making h = −3. Vertex is at (−3, −5). Memory: the vertex x-coordinate makes the inside of the parens equal ZERO. So (x + 3)² = 0 when x = −3. Always: solve "(x − h) = 0" to find h.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Δ = b² − 4ac. >0 two roots; =0 one; <0 none.', 'Vertex form: y = a(x − h)² + k → vertex (h, k).', 'a > 0 opens up; a < 0 opens down.', '"One solution" → Δ = 0.', '(x + 3)² → vertex x = −3, not +3.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
