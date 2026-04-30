/**
 * G8 — Square roots and irrational numbers.
 *
 * The inverse of squaring. Perfect squares (1, 4, 9, 16, 25, ...) and
 * their square roots come out clean. Most square roots don't —
 * √2, √3, √5 are irrational (decimals never repeat or terminate).
 * Estimating non-perfect square roots between two perfect squares.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_SQUARE_ROOTS_IRRATIONALS: LessonPlan = {
  id: 'evelyn.g8.math.square-roots-irrationals.v1',
  title: 'Square Roots and Irrational Numbers',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'number-system',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.ns.a.1',
      description: 'Know that numbers that are not rational are called irrational.',
      standard: 'CCSS.MATH.CONTENT.8.NS.A.1',
    },
    {
      id: 'ccss.math.8.ee.a.2',
      description: 'Use square root and cube root symbols to represent solutions to equations.',
      standard: 'CCSS.MATH.CONTENT.8.EE.A.2',
    },
  ],
  prerequisites: ['ccss.math.6.ns.b.4'],
  followUps: ['ccss.math.hsn.rn.a.1'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up "what number, when squared, gives me X?" as the question √ answers.',
      script: 'Squaring is easy: 5² = 25. But what if I gave you the answer first — what number squared gives 25? You\'d say 5. That backwards question has a name: square root. And it leads to one of the strangest discoveries in math: most square roots aren\'t nice clean numbers.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-roots-and-rationals',
      kind: 'concept',
      goal: 'Square root inverts squaring; perfect squares give clean roots; most don\'t (irrationals).',
      keyIdeas: [
        'SQUARE ROOT of x is the number that, when squared, gives x. Symbol: √.',
        '√25 = 5 because 5 × 5 = 25. √64 = 8. √100 = 10.',
        'Numbers like 1, 4, 9, 16, 25, 36, 49, 64, 81, 100… are called PERFECT SQUARES — their square roots are whole numbers.',
        'Most numbers AREN\'T perfect squares. √2, √3, √5, √7, √10 are decimals that never repeat and never end. These are IRRATIONAL NUMBERS.',
        'A RATIONAL number can be written as a fraction p/q (whole over whole). An IRRATIONAL number cannot.',
        'π and e are also irrational, even though they\'re not square roots.',
        'To ESTIMATE an irrational square root: find the perfect squares it sits between. √20 is between √16 = 4 and √25 = 5, closer to √25 because 20 is closer to 25.',
      ],
      vocabulary: [
        { term: 'square root', definition: 'a number that, when squared, equals the original.' },
        { term: 'perfect square', definition: 'a whole number whose square root is also a whole number.' },
        { term: 'rational', definition: 'a number that can be written as a fraction of two integers.' },
        { term: 'irrational', definition: 'a number that cannot be written as a fraction; decimal never repeats or ends.' },
      ],
      suggestedTools: ['show_equation', 'show_number_line'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-perfect-squares',
      kind: 'worked_example',
      problem: 'Find √81 and √144.',
      steps: [
        '√81: what whole number squared gives 81? 9 × 9 = 81. So √81 = 9.',
        '√144: what whole number squared gives 144? 12 × 12 = 144. So √144 = 12.',
        'Both inputs are perfect squares — clean integer answers.',
      ],
      answer: '√81 = 9, √144 = 12',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-estimate',
      kind: 'worked_example',
      problem: 'Estimate √50 to the nearest tenth.',
      steps: [
        'Find the nearby perfect squares. 7² = 49, 8² = 64. So √50 is between 7 and 8.',
        '50 is much closer to 49 than to 64, so √50 is just barely above 7.',
        'Try 7.1: 7.1² = 50.41. Slightly too big.',
        'Try 7.07: 7.07² ≈ 49.98. Very close.',
        '√50 ≈ 7.1 (to the nearest tenth).',
      ],
      answer: '≈ 7.1',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Between which two whole numbers is √30?',
      expectedAnswer: '5 and 6',
      responseFormat: 'free',
      hints: [
        'Find the perfect squares just below and just above 30.',
        '5² = 25 and 6² = 36.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-irrational',
      kind: 'misconception_check',
      question: 'Anu writes √2 as 1.41 and says "irrational just means it can\'t be exact, but you can round it." What\'s misleading?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Equating irrational with "approximately a finite decimal".',
          correctsTo: '1.41 is an APPROXIMATION of √2, not its exact value. The actual decimal goes on forever without repeating: 1.41421356... You can round √2, but the symbol √2 itself names the EXACT irrational number. Irrational means no fraction representation exists at all.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Square root inverts squaring: √x is the number that squared gives x.',
        'Perfect squares (1, 4, 9, 16, 25, ...) have whole-number roots.',
        'Most square roots are irrational — non-repeating, non-terminating decimals.',
        'Rational = fraction-form; irrational = no fraction representation.',
        'Estimate by squeezing between nearby perfect squares.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve x² = 49.',
      hint: 'Take the square root of both sides. x = ±7 (positive AND negative — both square to 49).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
