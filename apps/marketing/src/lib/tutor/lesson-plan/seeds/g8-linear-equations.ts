/**
 * G8 — Solving linear equations in one variable.
 *
 * The bridge from arithmetic to algebra. Student learns to "undo"
 * operations symmetrically (whatever you do to one side, do to the
 * other) and to recognize the goal: isolate the variable.
 * Uses show_equation extensively, with a try-yourself the brain
 * verifies via direct substitution.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_LINEAR_EQUATIONS: LessonPlan = {
  id: 'evelyn.g8.math.algebra.linear-equations.v1',
  title: 'Solving Linear Equations in One Variable',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'algebra',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ee.b.4',
      description: 'Use variables to represent quantities and construct simple equations to solve problems.',
      standard: 'CCSS.MATH.CONTENT.7.EE.B.4',
    },
    {
      id: 'ccss.math.8.ee.c.7',
      description: 'Solve linear equations in one variable, including those with rational-number coefficients.',
      standard: 'CCSS.MATH.CONTENT.8.EE.C.7',
    },
    {
      id: 'ncert.math.g8.linear-equations',
      description: 'Solve linear equations in one variable.',
      standard: 'NCERT-Math-Class-8-Ch-2',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.2', 'ccss.math.6.ee.b.5'],
  followUps: ['ccss.math.8.ee.c.8', 'ccss.math.hsa.rei.b.3'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame algebra as a "find the unknown" puzzle, not a new mysterious subject.',
      script: 'A balance scale has a mystery weight x on one side and a 5-kg block plus a 3-kg block on the other side. How heavy is x? You\'ve been doing this kind of puzzle since first grade — algebra just gives it a fancier name.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-balance',
      kind: 'concept',
      goal: 'An equation is a balance — both sides are equal. Whatever you do to one side, you must do to the other to keep it balanced.',
      keyIdeas: [
        'An equation says "left side EQUALS right side".',
        'To find the unknown, we want it ALONE on one side.',
        'We can add, subtract, multiply, or divide BOTH sides by the same thing — the equation stays true.',
        'We use INVERSE operations to undo what\'s in the way: subtraction undoes addition; division undoes multiplication.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a letter that stands for an unknown number, like x.' },
        { term: 'isolate', definition: 'get the variable alone on one side.' },
        { term: 'inverse operation', definition: 'the operation that undoes another (− undoes +, ÷ undoes ×).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-one-step',
      kind: 'worked_example',
      problem: 'Solve x + 7 = 12.',
      steps: [
        'We want x alone. Right now there\'s a "+ 7" in the way.',
        'Use the INVERSE: subtract 7 from both sides.',
        'x + 7 − 7 = 12 − 7  →  x = 5.',
        'CHECK: substitute back. 5 + 7 = 12. ✓',
      ],
      answer: 'x = 5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-step',
      kind: 'worked_example',
      problem: 'Solve 3x − 4 = 11.',
      steps: [
        'Two things in the way: a "− 4" and a "× 3". Undo OUTSIDE-IN.',
        'First the −4: add 4 to both sides. 3x = 15.',
        'Now the × 3: divide both sides by 3. x = 5.',
        'CHECK: 3(5) − 4 = 15 − 4 = 11. ✓',
      ],
      answer: 'x = 5',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve 2x + 9 = 25. Show me your steps.',
      expectedAnswer: 'x = 8',
      responseFormat: 'frq',
      hints: [
        'Two things in the way. Which one will you undo FIRST? (Hint: the one farther from x.)',
        'Subtract 9 from both sides first to get 2x = 16. Then divide by 2.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-one-side-only',
      kind: 'misconception_check',
      question: 'A friend solves x + 5 = 12 like this: "x = 12 + 5, so x = 17." Where did they go wrong?',
      commonErrors: [
        {
          answer: '17',
          misconception: 'Moving the +5 to the other side without changing its sign — i.e. not actually doing the inverse operation.',
          correctsTo: 'To undo +5 you SUBTRACT 5, not add it. x = 12 − 5 = 7. Substitution check: 7 + 5 = 12. ✓',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An equation is a balance — both sides stay equal.',
        'Use INVERSE operations to peel away what\'s in the way.',
        'Whatever you do to ONE side, do to the OTHER.',
        'Always CHECK by substituting your answer back.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve 4(x − 3) = 2x + 6.',
      hint: 'Distribute first, then collect like terms before isolating.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
