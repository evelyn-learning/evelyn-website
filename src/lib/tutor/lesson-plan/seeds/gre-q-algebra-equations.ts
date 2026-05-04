/**
 * GRE Quant — Algebra: Equations & Inequalities.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_ALGEBRA_EQUATIONS: LessonPlan = {
  id: 'evelyn.gre.q.algebra-equations.v1',
  title: 'GRE Quant — Algebra Equations & Inequalities',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.algebra-equations',
      description: 'Solve linear and quadratic equations, systems, and inequalities; recognise GRE algebra patterns.',
      standard: 'GRE-Q-ALGEBRA',
    },
  ],
  prerequisites: ['gre.q.exponents-roots'],
  followUps: ['gre.q.word-problems'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Algebra on the GRE rewards pattern recognition more than algebra fluency — knowing the typical setup beats grinding the maths.',
      script: 'GRE algebra usually fits into one of five patterns: solve a linear, solve a quadratic, solve a 2-equation system, solve an inequality, or simplify an algebraic expression. Memorise the patterns, recognise which you\'re facing, and the path is clear.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-algebra',
      kind: 'concept',
      goal: 'Solving toolkit + inequality conventions + GRE traps.',
      keyIdeas: [
        'LINEAR: ax + b = c → x = (c − b)/a. Always isolate the variable.',
        'QUADRATIC: factor first if possible. Otherwise quadratic formula x = [−b ± √(b² − 4ac)]/(2a).',
        'DIFFERENCE OF SQUARES: a² − b² = (a − b)(a + b). High-yield GRE shortcut.',
        'PERFECT SQUARES: a² + 2ab + b² = (a + b)². Sometimes hidden inside a question.',
        'TWO-EQUATION SYSTEM: substitute or eliminate. Ensure consistent (same line: infinite solutions; parallel lines: none).',
        'INEQUALITY: same operations as equations EXCEPT multiplying/dividing by NEGATIVE flips the sign.',
        '|x| < a means −a < x < a. |x| > a means x < −a OR x > a.',
        'COMMON SUBSTITUTION TRICK: if the question gives x + 1/x = 5 and asks for x² + 1/x², use (x + 1/x)² = x² + 2 + 1/x² → x² + 1/x² = 25 − 2 = 23.',
        'GRE TRAP: when a quadratic has TWO roots, the answer might require both. Read carefully whether the question wants "the value" (one) or "all values" (multiple).',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'b² − 4ac for ax² + bx + c = 0; sign tells you the number of real solutions.' },
        { term: 'absolute value', definition: '|x| is the distance from x to 0 on the number line; always non-negative.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-system',
      kind: 'worked_example',
      problem: 'Solve the system: 2x + 3y = 16; 5x − y = 23.',
      steps: [
        'Use elimination or substitution. Solve the second for y: y = 5x − 23.',
        'Substitute into the first: 2x + 3(5x − 23) = 16 → 2x + 15x − 69 = 16 → 17x = 85 → x = 5.',
        'Back-substitute: y = 5·5 − 23 = 25 − 23 = 2.',
        'Solution: (x, y) = (5, 2).',
        'CHECK: 2·5 + 3·2 = 10 + 6 = 16 ✓; 5·5 − 2 = 23 ✓.',
      ],
      answer: 'x = 5, y = 2',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve −3(x − 4) > 12 for x.',
      expectedAnswer: 'x < 0',
      responseFormat: 'free',
      hints: [
        'Distribute: −3x + 12 > 12 → −3x > 0.',
        'Divide by −3 and FLIP the inequality: x < 0.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-flip-sign',
      kind: 'misconception_check',
      question: 'Solving 5 − 2x ≥ 9. A student writes −2x ≥ 4, then x ≥ −2. What\'s wrong?',
      commonErrors: [
        {
          answer: 'x ≥ −2',
          misconception: 'Forgetting to flip the inequality sign when dividing by a negative.',
          correctsTo: 'Divide both sides by −2. Dividing by NEGATIVE reverses the inequality: x ≤ −2 (NOT ≥). Test: x = −5: 5 − 2(−5) = 15 ≥ 9 ✓ (so −5 satisfies). x = 0: 5 − 0 = 5 not ≥ 9 ✗. So solutions ARE x ≤ −2, not x ≥ −2.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quadratic: try factoring before invoking the formula.',
        'Difference of squares a² − b² = (a−b)(a+b) — high-yield.',
        'Inequalities: flip sign when multiplying/dividing by negative.',
        '|x| < a ↔ −a < x < a. |x| > a ↔ x < −a or x > a.',
        '(x + 1/x)² = x² + 2 + 1/x² — useful identity for symmetric expressions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If x² − 5x + 6 = 0, find x³ − 5x² + 6x.',
      hint: 'Factor x out: x³ − 5x² + 6x = x(x² − 5x + 6) = x · 0 = 0. Pattern: when a polynomial expression has the original quadratic as a factor, the value is zero. No need to find x explicitly.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
