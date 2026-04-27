/**
 * G4 — Multiplication as arrays.
 *
 * Multiplication intro built on a visual array model — 3 rows of 4
 * dots IS 3×4. The student should be able to switch between "rows
 * times columns" and "groups of equal size" thinking. Uses the
 * show_early_math (array) renderer + skip_count to connect to
 * repeated addition. Concrete-pictorial-abstract progression: blocks
 * → array → equation.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MULTIPLICATION_AS_ARRAYS: LessonPlan = {
  id: 'evelyn.g4.math.multiplication.arrays.v1',
  title: 'Multiplication as Arrays',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'multiplication',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.oa.a.1',
      description: 'Interpret products of whole numbers — e.g. 5×7 as the total number of objects in 5 groups of 7.',
      standard: 'CCSS.MATH.CONTENT.3.OA.A.1',
    },
    {
      id: 'ccss.math.3.oa.a.3',
      description: 'Use multiplication and division within 100 to solve word problems with arrays.',
      standard: 'CCSS.MATH.CONTENT.3.OA.A.3',
    },
  ],
  prerequisites: ['ccss.math.2.oa.c.4'],
  followUps: ['ccss.math.3.oa.b.5', 'ccss.math.4.oa.a.1'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that counting groups one-by-one is slow, and there\'s a faster way.',
      script: 'Imagine 4 plates with 6 cookies each. How many cookies in total? You COULD count them one by one… but there\'s a much faster way. Want to see it?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arrays',
      kind: 'concept',
      goal: 'A multiplication problem is just a rectangle of equal rows. Rows × columns = total.',
      keyIdeas: [
        'When equal groups line up, they make a rectangle — an array.',
        '3 × 4 means 3 ROWS of 4 things — or 4 columns of 3, depending on how you look at it.',
        'Either way, the total is the same. That\'s the COMMUTATIVE property.',
        'Multiplication is just FAST repeated addition.',
      ],
      vocabulary: [
        { term: 'array', definition: 'a rectangle of objects in equal rows and columns.' },
        { term: 'product', definition: 'the answer to a multiplication problem.' },
        { term: 'commutative', definition: 'the order doesn\'t matter — 3 × 4 and 4 × 3 give the same answer.' },
      ],
      suggestedTools: ['show_early_math'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-3x4',
      kind: 'worked_example',
      problem: 'What is 3 × 4? Show it as an array.',
      steps: [
        'Use show_early_math kind=array with rows=3, cols=4.',
        'Point to one row: "Here\'s one row — that\'s 4 dots."',
        'Point to all three rows: "Three rows, each with 4 dots."',
        'Show repeated addition: 4 + 4 + 4 = 12.',
        'Conclude: "So 3 × 4 = 12."',
      ],
      answer: '12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You try! Show me 4 × 6 as an array, and tell me the product.',
      expectedAnswer: '24',
      responseFormat: 'numeric',
      hints: [
        'You can think of it as 4 rows of 6, or 6 rows of 4 — same answer.',
        'Try repeated addition: 6 + 6 + 6 + 6.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-rows-cols',
      kind: 'misconception_check',
      question: 'A friend draws 3 × 4 as 3 columns of 4 instead of 3 rows of 4. Is that wrong?',
      commonErrors: [
        {
          answer: 'wrong',
          misconception: 'Thinking rows and columns are interchangeable in the wrong way — they ARE for the product, but the convention "rows × columns" matters when comparing.',
          correctsTo: 'Both arrays have 12 dots — the COMMUTATIVE property says 3×4 = 4×3. So the friend isn\'t wrong; they just drew it the other way.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An array is a rectangle of equal rows.',
        'rows × columns = total.',
        'You can multiply in either order — same answer.',
        'Multiplication is just repeated addition done quickly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What if you have 7 × 8? Use the array idea — but you don\'t have to draw all 56 dots! Can you split it into pieces you already know? (Like 7 × 4 + 7 × 4.)',
      hint: 'This is the DISTRIBUTIVE property. You\'ll see it again in algebra.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
