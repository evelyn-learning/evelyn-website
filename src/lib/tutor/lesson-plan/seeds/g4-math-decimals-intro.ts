/**
 * G4 — Decimals Intro (tenths and hundredths, fraction-decimal bridge).
 *
 * Decimals as a different way of writing fractions whose denominator
 * is a power of ten. Anchored on the place-value chart extending to
 * the right of the ones place: tenths, hundredths. The "decimal point"
 * separates whole numbers from fractional parts. Reads, writes, and
 * compares decimals to the hundredths.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_DECIMALS_INTRO: LessonPlan = {
  id: 'evelyn.g4.math.decimals.intro.v1',
  title: 'Decimals: Tenths and Hundredths',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'decimals',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.nf.c.6',
      description: 'Use decimal notation for fractions with denominators 10 or 100.',
      standard: 'CCSS.MATH.CONTENT.4.NF.C.6',
    },
    {
      id: 'ccss.math.4.nf.c.7',
      description: 'Compare two decimals to hundredths by reasoning about their size.',
      standard: 'CCSS.MATH.CONTENT.4.NF.C.7',
    },
  ],
  prerequisites: ['ccss.math.4.nf.a.1'],
  followUps: ['ccss.math.5.nbt.a.3'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use money — something the student already reads as a decimal — to introduce the decimal point.',
      script: 'A pack of gum costs $1.45. The "1" is one whole dollar. The "45" is part of a dollar — 45 cents. The dot in between has a name: it\'s a DECIMAL POINT, and it separates whole numbers from pieces of a whole.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-place-value',
      kind: 'concept',
      goal: 'Place values continue past the ones place into tenths and hundredths.',
      keyIdeas: [
        'Place values to the LEFT of the decimal: ones, tens, hundreds, thousands.',
        'Place values to the RIGHT of the decimal: tenths, hundredths, thousandths.',
        'The decimal point is the boundary between whole numbers and fractional parts.',
        '0.7 means 7 tenths — same as the fraction 7/10.',
        '0.45 means 4 tenths and 5 hundredths — same as 45/100.',
        'Adding a 0 at the END of a decimal doesn\'t change its value: 0.4 = 0.40 (because 4/10 = 40/100).',
      ],
      vocabulary: [
        { term: 'decimal', definition: 'a number that uses a decimal point to write fractional parts.' },
        { term: 'tenths place', definition: 'the FIRST digit after the decimal point — pieces of 1/10.' },
        { term: 'hundredths place', definition: 'the SECOND digit after the decimal point — pieces of 1/100.' },
      ],
      suggestedTools: ['show_equation', 'show_fraction_bar'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fraction-to-decimal',
      kind: 'worked_example',
      problem: 'Write 7/10 as a decimal. Then write 23/100 as a decimal.',
      steps: [
        '7/10: 7 tenths. Tenths is the FIRST place after the decimal. Write 0.7.',
        '23/100: 2 tenths and 3 hundredths. Write the 2 in the tenths place and the 3 in the hundredths place: 0.23.',
        'Read aloud: "zero point seven", "zero point two three" (or "twenty-three hundredths").',
      ],
      answer: '0.7 and 0.23',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compare',
      kind: 'worked_example',
      problem: 'Which is bigger: 0.6 or 0.45?',
      steps: [
        'First instinct says 0.45 because it has more digits. WRONG instinct.',
        'Compare place by place, left to right. Tenths first.',
        '0.6 has 6 in the tenths place. 0.45 has 4.',
        '6 tenths > 4 tenths, so 0.6 > 0.45.',
        'Tip: rewrite as the same number of places. 0.6 = 0.60. Now compare 60 hundredths to 45 hundredths — 60 > 45.',
      ],
      answer: '0.6',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which is bigger: 0.3 or 0.29?',
      expectedAnswer: '0.3',
      responseFormat: 'free',
      hints: [
        'Don\'t count digits. Compare the tenths place first.',
        'Rewrite 0.3 as 0.30 if it helps.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-longer-bigger',
      kind: 'misconception_check',
      question: 'Eli says "0.108 is bigger than 0.5 because it has more digits." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Counting digits as if more digits means a bigger number, like with whole numbers.',
          correctsTo: 'No. With decimals, place value matters. 0.5 = 5 tenths; 0.108 = 1 tenth and a tiny bit. 0.5 > 0.108. Digit count doesn\'t tell you the size.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Decimals are fractions with denominators 10, 100, 1000…',
        'The decimal point separates whole numbers from fractional parts.',
        'Tenths is the first place after the decimal. Hundredths is the second.',
        'To compare decimals, line up the decimal points and compare place by place from the left.',
        'Adding zeros at the end doesn\'t change the value: 0.4 = 0.40.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Order from smallest to largest: 0.7, 0.07, 0.77, 0.7.',
      hint: 'Rewrite all with two decimal places: 0.70, 0.07, 0.77, 0.70. Order: 0.07, 0.70, 0.70, 0.77.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
