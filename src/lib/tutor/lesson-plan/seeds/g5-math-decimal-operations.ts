/**
 * G5 — Decimal operations (add, subtract, multiply, divide by powers of 10).
 *
 * Builds on G4 decimals intro. Two key ideas: (1) line up the decimal
 * point when adding / subtracting (place values must match);
 * (2) multiplying / dividing by 10, 100, 1000 just shifts the decimal
 * — no actual computation. Includes the "where does the decimal go in
 * the answer" rule for general multiplication.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_DECIMAL_OPERATIONS: LessonPlan = {
  id: 'evelyn.g5.math.decimal-operations.v1',
  title: 'Adding, Subtracting, and Multiplying Decimals',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'decimals',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.nbt.b.7',
      description: 'Add, subtract, multiply, and divide decimals to hundredths.',
      standard: 'CCSS.MATH.CONTENT.5.NBT.B.7',
    },
    {
      id: 'ccss.math.5.nbt.a.2',
      description: 'Explain patterns when multiplying or dividing by powers of 10.',
      standard: 'CCSS.MATH.CONTENT.5.NBT.A.2',
    },
  ],
  prerequisites: ['ccss.math.4.nf.c.6'],
  followUps: ['ccss.math.6.ns.b.3'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Real-world stakes — wrong decimal placement makes a $5 bill into 50 cents.',
      script: 'You\'re paying for two snacks: $1.45 and $0.75. Quick — what\'s the total? If you stack them like 145 + 75 you\'d get nonsense, but lining up the decimal points first makes it easy: $2.20. The decimal point is where it ALL turns out right or wrong.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-add-subtract',
      kind: 'concept',
      goal: 'Lining up the decimal points puts matching place values on top of each other.',
      keyIdeas: [
        'For adding or subtracting decimals, LINE UP THE DECIMAL POINTS first.',
        'Add zeros at the end if needed so both numbers have the same number of decimal places.',
        'Then add or subtract column by column, just like whole numbers. Carry the decimal straight down.',
        'Example: 1.45 + 0.7 → write 1.45 + 0.70. Add: 2.15.',
        'Why? Tenths must be added to tenths, hundredths to hundredths. Lining up the decimal makes the place values line up.',
      ],
      vocabulary: [
        { term: 'decimal place', definition: 'a digit\'s position to the right of the decimal point.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-multiply',
      kind: 'concept',
      goal: 'Multiplying decimals: ignore the decimal points, multiply, then count places at the end.',
      keyIdeas: [
        'For multiplying, you do NOT need to line up decimal points.',
        'Step 1: ignore the decimal points and multiply as whole numbers.',
        'Step 2: count the TOTAL number of decimal places in both factors.',
        'Step 3: place the decimal in the answer so it has that many decimal places, counting from the right.',
        'Example: 0.4 × 0.3. Ignore decimals: 4 × 3 = 12. Total decimal places in factors: 1 + 1 = 2. Answer has 2 places: 0.12.',
        'For ×10 / ×100 / ×1000: just shift the decimal point right by 1 / 2 / 3 places. Each "× 10" makes the number 10× bigger, which means each digit\'s value steps up one place.',
        'For ÷10 / ÷100 / ÷1000: shift the decimal LEFT by 1 / 2 / 3 places.',
      ],
      vocabulary: [
        { term: 'power of ten', definition: '10, 100, 1000, etc. — what you get by multiplying 10 by itself.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-add',
      kind: 'worked_example',
      problem: 'Compute 3.4 + 2.75.',
      steps: [
        'Line up the decimal points. Pad 3.4 to 3.40 so both have 2 decimal places.',
        '  3.40',
        '+ 2.75',
        'Add the hundredths column: 0 + 5 = 5.',
        'Add the tenths column: 4 + 7 = 11. Write 1, carry 1.',
        'Add the ones: 3 + 2 + 1 (carry) = 6.',
        'Bring the decimal point straight down: 6.15.',
      ],
      answer: '6.15',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-multiply',
      kind: 'worked_example',
      problem: 'Compute 1.2 × 0.5.',
      steps: [
        'Ignore the decimal points: 12 × 5 = 60.',
        'Count decimal places in factors: 1.2 has 1 place, 0.5 has 1 place. Total: 2.',
        'Place the decimal so the answer has 2 places: 0.60 (or 0.6).',
        '1.2 × 0.5 = 0.6.',
      ],
      answer: '0.6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute 4.85 × 100.',
      expectedAnswer: '485',
      responseFormat: 'numeric',
      hints: [
        '× 100 means shift the decimal point 2 places to the right.',
        '4.85 → 48.5 (one shift) → 485 (two shifts).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mult-decimal-places',
      kind: 'misconception_check',
      question: 'Aria multiplies 0.6 × 0.4 and says the answer is 2.4. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Multiplying as whole numbers and forgetting to count total decimal places.',
          correctsTo: 'No. 6 × 4 = 24, but the factors have 1 + 1 = 2 decimal places, so the answer must too: 0.24. Sense-check — both factors are less than 1, so the answer should be less than either of them, not bigger.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Add/subtract decimals: line up the decimal points, pad with zeros if needed.',
        'Multiply decimals: ignore decimals, multiply as whole numbers, count total decimal places, place in answer.',
        '× 10 / 100 / 1000: shift decimal RIGHT.',
        '÷ 10 / 100 / 1000: shift decimal LEFT.',
        'Sense-check: multiplying by something LESS THAN 1 makes the answer smaller, not bigger.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute 0.025 × 1000.',
      hint: '× 1000 shifts the decimal 3 places right. 0.025 → 25. (Pad with zeros if you run out of digits to shift past.)',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
