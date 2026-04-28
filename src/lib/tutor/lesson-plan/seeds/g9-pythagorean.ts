/**
 * G9 — Pythagorean theorem.
 *
 * The first big "right-angle special rule" the student meets. Builds
 * intuition (square-on-the-hypotenuse equals sum of squares-on-legs)
 * and the mechanics (find a missing side). Uses show_geometry for the
 * triangle + squares, and show_equation for the algebra.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_PYTHAGOREAN: LessonPlan = {
  id: 'evelyn.g9.math.geometry.pythagorean.v1',
  title: 'The Pythagorean Theorem',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.g.b.6',
      description: 'Explain a proof of the Pythagorean theorem and its converse.',
      standard: 'CCSS.MATH.CONTENT.8.G.B.6',
    },
    {
      id: 'ccss.math.8.g.b.7',
      description: 'Apply the Pythagorean theorem to determine unknown side lengths in right triangles.',
      standard: 'CCSS.MATH.CONTENT.8.G.B.7',
    },
    {
      id: 'ncert.math.g9.triangles.pythagoras',
      description: 'Apply the Pythagoras theorem in problems.',
      standard: 'NCERT-Math-Class-9-Ch-7',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.1'],
  followUps: ['ccss.math.hsg.srt.c.6', 'ccss.math.8.g.b.8'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student curious why right triangles have a "magic" relationship between their sides.',
      script: 'A 5-foot ladder leans against a wall. Its base is 3 feet from the wall. How high up the wall does the ladder reach? You don\'t need a tape measure — just one rule that\'s 2,500 years old.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-statement',
      kind: 'concept',
      goal: 'In a right triangle with legs a and b and hypotenuse c, a² + b² = c². The squares of the legs add to the square of the hypotenuse.',
      keyIdeas: [
        'A right triangle has exactly ONE 90° angle.',
        'The two shorter sides are LEGS; the longest side (across from the right angle) is the HYPOTENUSE.',
        'a² + b² = c²  — the hypotenuse-squared equals the sum of the two legs-squared.',
        'This is ONLY true for right triangles. For other triangles a different rule applies.',
      ],
      vocabulary: [
        { term: 'leg', definition: 'one of the two shorter sides of a right triangle (touching the right angle).' },
        { term: 'hypotenuse', definition: 'the longest side of a right triangle, across from the right angle.' },
      ],
      suggestedTools: ['show_geometry', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-find-hypotenuse',
      kind: 'worked_example',
      problem: 'A right triangle has legs of length 3 and 4. Find the hypotenuse.',
      steps: [
        'Plug into a² + b² = c²:  3² + 4² = c².',
        'Compute: 9 + 16 = c²  →  c² = 25.',
        'Take the positive square root: c = 5.',
        'CHECK: 3² + 4² = 9 + 16 = 25 = 5². ✓',
      ],
      answer: '5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-leg',
      kind: 'worked_example',
      problem: 'A right triangle has hypotenuse 13 and one leg 5. Find the other leg.',
      steps: [
        'Plug in:  5² + b² = 13².',
        'Compute: 25 + b² = 169.',
        'Subtract 25 from both sides: b² = 144.',
        'Take the positive root: b = 12.',
        'CHECK: 5² + 12² = 25 + 144 = 169 = 13². ✓',
      ],
      answer: '12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A right triangle has legs 6 and 8. What\'s the hypotenuse?',
      expectedAnswer: '10',
      responseFormat: 'numeric',
      hints: [
        'Use a² + b² = c² with a = 6 and b = 8.',
        '6² + 8² = 36 + 64 = 100. So c² = 100, c = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-which-side',
      kind: 'misconception_check',
      question: 'A friend computes 5² + 12² to find a side and gets c² = 169, then says "so the missing side is 13." But the problem said the hypotenuse was 13 and one leg was 5. Where did they go wrong?',
      commonErrors: [
        {
          answer: '13',
          misconception: 'Always plugging the two known sides as a and b, regardless of whether one of them is the HYPOTENUSE.',
          correctsTo: 'In a² + b² = c², c is ALWAYS the hypotenuse. If 13 is the hypotenuse, c = 13, and one leg is 5: 5² + b² = 13² → b = 12. The hypotenuse is the longest side; that\'s how you tell.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a² + b² = c² is for RIGHT triangles only.',
        'c is ALWAYS the hypotenuse — the longest side, across from the right angle.',
        'To find the hypotenuse: add the squared legs, then square root.',
        'To find a leg: subtract the known leg² from the hypotenuse², then square root.',
        'Always check by plugging the answer back in.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A baseball diamond is a square with sides 90 ft. How far is it from home plate to second base (the diagonal)?',
      hint: 'The diagonal of a square is the hypotenuse of a right triangle whose legs are the square\'s sides.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
