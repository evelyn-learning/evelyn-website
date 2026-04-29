/**
 * G4 — Multi-digit multiplication (area model + standard algorithm).
 *
 * Builds 2-digit × 1-digit and 2-digit × 2-digit by decomposing into
 * place-value pieces (the area / box model) before introducing the
 * standard algorithm. The area model is the conceptual anchor — the
 * algorithm is shorthand once the student can see WHY it works.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_MULTI_DIGIT_MULTIPLICATION: LessonPlan = {
  id: 'evelyn.g4.math.multi-digit-multiplication.v1',
  title: 'Multi-Digit Multiplication',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'multiplication',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.nbt.b.5',
      description: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers.',
      standard: 'CCSS.MATH.CONTENT.4.NBT.B.5',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1', 'ccss.math.3.nbt.a.1'],
  followUps: ['ccss.math.5.nbt.b.5'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that multi-digit multiplication is just smaller multiplications added together.',
      script: 'Quick: 24 × 6 in your head. Tough? Try this — split 24 into 20 and 4. Now 20 × 6 is just 6 sixes plus a zero (120). And 4 × 6 is 24. Add them: 144. We just turned a hard problem into two easy ones.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-area-model',
      kind: 'concept',
      goal: 'The area / box model decomposes multi-digit multiplication into place-value rectangles.',
      keyIdeas: [
        'Any 2-digit number splits by place value: 24 = 20 + 4. 37 = 30 + 7.',
        'To multiply, draw a rectangle and split each side by place value. Each smaller rectangle is one easy multiplication.',
        'Add up the smaller rectangles for the total. This is the DISTRIBUTIVE PROPERTY in action.',
        '24 × 6 = (20 × 6) + (4 × 6) = 120 + 24 = 144.',
        'For 2-digit × 2-digit: 4 sub-rectangles. 23 × 14 = (20×10) + (20×4) + (3×10) + (3×4).',
        'The standard algorithm is the same work — just stacked vertically and the partial products combined.',
      ],
      vocabulary: [
        { term: 'partial product', definition: 'one of the smaller multiplications that you add up at the end.' },
        { term: 'distributive property', definition: 'a × (b + c) = a×b + a×c — the rule that lets us split numbers and multiply each part.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-32x4',
      kind: 'worked_example',
      problem: 'Compute 32 × 4 using the area model.',
      steps: [
        'Split 32 into 30 + 2.',
        'Draw a 2-row box: top row 30 wide, bottom row 2 wide. Both 4 tall.',
        'Top rectangle area: 30 × 4 = 120.',
        'Bottom rectangle area: 2 × 4 = 8.',
        'Add: 120 + 8 = 128.',
        'Confirm: 32 × 4 = 128.',
      ],
      answer: '128',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-23x14',
      kind: 'worked_example',
      problem: 'Compute 23 × 14 using the area model.',
      steps: [
        'Split 23 into 20 + 3 (top side). Split 14 into 10 + 4 (left side).',
        'Four sub-rectangles: 20×10, 20×4, 3×10, 3×4.',
        'Compute each: 200, 80, 30, 12.',
        'Add the partial products: 200 + 80 + 30 + 12 = 322.',
        '23 × 14 = 322.',
      ],
      answer: '322',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use the area model to find 47 × 6.',
      expectedAnswer: '282',
      responseFormat: 'numeric',
      hints: [
        'Split 47 into 40 + 7.',
        'Compute 40 × 6 and 7 × 6 separately, then add.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-place-value',
      kind: 'misconception_check',
      question: 'Lila splits 32 × 4 as (3 × 4) + (2 × 4) = 20. What did she miss?',
      commonErrors: [
        {
          answer: 'nothing — that\'s how you split it',
          misconception: 'Splitting digits without keeping track of place value.',
          correctsTo: 'The 3 in 32 isn\'t worth 3 — it\'s worth 30 (three tens). So the split should be 30 × 4 = 120, plus 2 × 4 = 8, total 128. Place value is the whole point.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multi-digit multiplication = smaller multiplications + add.',
        'Split by place value (tens and ones), not by digits.',
        'The area model and the standard algorithm do the SAME work.',
        'Distributive property is the underlying rule.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Use the area model for 125 × 8. Split 125 into 100 + 20 + 5.',
      hint: 'Three partial products: 100×8 = 800, 20×8 = 160, 5×8 = 40. Total: 1000.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
