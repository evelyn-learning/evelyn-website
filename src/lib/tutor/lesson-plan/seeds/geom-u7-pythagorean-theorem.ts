/**
 * Geometry — Right Triangles & Trigonometry: The Pythagorean Theorem & Its Converse.
 *
 * The right-triangle workhorse (CCSS G-SRT.B.4): a² + b² = c², proved from
 * the similar triangles the altitude to the hypotenuse creates, plus the
 * converse that turns three side lengths into a right-angle TEST. Numeric
 * work stays on Pythagorean triples so answers land on whole numbers;
 * radical answers live in the multiple-choice options.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U7_PYTHAGOREAN_THEOREM: LessonPlan = {
  id: 'evelyn.hs.geom.pythagorean-theorem.v1',
  title: 'The Pythagorean Theorem & Its Converse',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.pythagorean-theorem',
      standard: 'GEOM-7.1',
      description:
        'Use the Pythagorean Theorem to find unknown side lengths in right triangles, justify it from the similar triangles formed by the altitude to the hypotenuse, and apply its converse to classify a triangle as right, acute, or obtuse from its three side lengths (CCSS G-SRT.B.4).',
    },
  ],
  prerequisites: ['geom.proportionality-theorems'],
  followUps: ['geom.special-right-triangles'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the theorem and its converse as the two tools a builder actually uses — one measures, one checks square.',
      script:
        'Walk onto any construction site and you will see someone measure 3 feet along one wall, 4 feet along the other, and check that the diagonal between those marks is exactly 5 feet. If it is, the corner is perfectly square. That is not the Pythagorean Theorem — that is its CONVERSE, running backwards from three lengths to a guaranteed 90° angle. Today you get both directions: the theorem that hands you a missing side, and the converse that tells you whether a triangle is right, acute, or obtuse without measuring a single angle.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-theorem-converse',
      kind: 'concept',
      goal: 'The equation, which letter is which, the similarity proof, the converse as a classification test, and the errors that eat the most points.',
      keyIdeas: [
        'THE STATEMENT — in a RIGHT triangle with legs a and b and hypotenuse c: a² + b² = c². The legs are the two sides that form the right angle; the hypotenuse is the side across from it, and it is always the longest side.',
        'c IS NEVER OPTIONAL — the biggest error in this unit is dropping the two GIVEN sides into a and b when one of them is the hypotenuse. Identify the hypotenuse FIRST (it sits opposite the right angle), then decide whether you are adding or subtracting.',
        'FIND HYPOTENUSE → ADD; FIND LEG → SUBTRACT — legs 9 and 12 give c = √(81 + 144) = 15. Hypotenuse 15 with leg 9 gives b = √(225 - 81) = 12. Sanity check every answer: a leg must come out SHORTER than the hypotenuse.',
        'WHY IT IS TRUE (SIMILARITY) — drop the altitude from the right angle to the hypotenuse. It splits the triangle into two smaller triangles, each similar to the original by AA. The proportions from those similar triangles give a² = c·(part of c under a) and b² = c·(part under b); adding them gives a² + b² = c·c = c². The theorem is a proportionality result, not a coincidence.',
        'THE CONVERSE — the arrow runs the other way: IF the three sides of a triangle satisfy a² + b² = c² with c the LONGEST side, THEN the angle opposite c is a right angle. This is how three tape-measure readings prove a corner is square.',
        'CLASSIFYING BY COMPARISON — always let c be the longest side, then compare a² + b² to c². Equal → right. Bigger (a² + b² > c²) → ACUTE. Smaller (a² + b² < c²) → OBTUSE. Memory hook: the bigger the square on the longest side, the more the triangle has "opened up".',
        'TRIPLES SAVE TIME, BUT VERIFY — 3-4-5, 5-12-13, 8-15-17, 7-24-25 and all their multiples (6-8-10, 9-12-15, 10-24-26) are whole-number right triangles. Spotting one is a shortcut, but only if the largest number really is the hypotenuse — 6, 8, 11 is NOT a 6-8-10 triangle.',
        'EXACT vs ROUNDED — legs 6 and 6 give c = √72 = 6√2, not 8.49. Simplify the radical and leave it exact unless the problem asks for a decimal; rounding early wrecks any later step.',
      ],
      vocabulary: [
        { term: 'hypotenuse', definition: 'the side of a right triangle opposite the right angle — always the longest side.' },
        { term: 'Pythagorean triple', definition: 'a set of three whole numbers a, b, c with a² + b² = c², such as 3-4-5 or 5-12-13.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-find-hypotenuse',
      kind: 'worked_example',
      problem:
        'A rectangular gate is 9 feet wide and 12 feet tall. A carpenter wants to nail a straight brace from the bottom-left corner to the top-right corner. In right triangle ABC formed by the bottom edge, the left edge, and the brace, the right angle is at A, AB = 9 ft, and AC = 12 ft. How long is the brace BC?',
      steps: [
        'Locate the hypotenuse: the right angle is at A, so the side opposite it — BC, the brace — is the hypotenuse. The two legs are the given 9 and 12.',
        'Both legs are known and the hypotenuse is missing, so this is the ADD direction: 9² + 12² = BC².',
        'Compute: 81 + 144 = 225, so BC² = 225.',
        'Take the positive square root: BC = 15 feet. (Negative lengths are meaningless here.)',
        'Check: 15 is longer than both 9 and 12, as a hypotenuse must be — and 9-12-15 is just the 3-4-5 triple tripled. ✓',
      ],
      answer: 'BC = 15 feet',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hypotenuse-mixup',
      kind: 'worked_example',
      problem:
        'A 26-foot ladder leans against a wall, with its base 10 feet from the wall. In right triangle PQR, the right angle is at Q (where the wall meets the ground), PQ = 10 ft along the ground, and the ladder PR = 26 ft. A student writes 10² + 26² = x² and gets x ≈ 27.9 ft for the wall height. Find the correct height and explain the error.',
      steps: [
        'Spot the setup: the ladder is opposite the right angle at Q, so PR = 26 is the HYPOTENUSE, not a leg. The unknown wall height QR is a LEG.',
        'Test the student answer against reality: 27.9 ft would be LONGER than the 26-ft ladder. A leg can never exceed the hypotenuse, so the answer is impossible before any arithmetic is rechecked.',
        'Set it up correctly with the hypotenuse alone on the right: 10² + QR² = 26².',
        'Compute: 100 + QR² = 676, so QR² = 576 and QR = 24 feet.',
        'Diagnose the error: the student added because both given numbers were treated as legs. Whenever the hypotenuse is one of the KNOWN sides, you SUBTRACT. Check: 10² + 24² = 100 + 576 = 676 = 26². ✓',
      ],
      answer: 'QR = 24 feet — the 26-ft ladder is the hypotenuse, so the setup subtracts rather than adds',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'A triangle has side lengths 6, 8, and 11. Using the converse of the Pythagorean Theorem, classify the triangle.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Obtuse, because 6² + 8² < 11²', correct: true },
        { id: 'b', text: 'Right, because 6 and 8 are legs of a 6-8-10 right triangle' },
        { id: 'c', text: 'Acute, because 6² + 8² < 11²' },
        { id: 'd', text: 'Right, because 6² + 8² = 11²' },
      ],
      expectedAnswer: 'Obtuse, because 6² + 8² < 11²',
      hints: [
        'Let c be the LONGEST side (11), then compare 6² + 8² to 11². Do not assume the familiar 6-8-10 pattern.',
        '36 + 64 = 100 and 11² = 121. The sum of the leg squares falls SHORT of c², so the angle opposite 11 has opened past 90°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exact-radical',
      kind: 'try_yourself',
      problem:
        'A square patio tile measures 6 inches on each side. A crack runs corner to corner along the diagonal, forming a right triangle whose legs are two sides of the tile. What is the exact length of the diagonal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6√2 inches', correct: true },
        { id: 'b', text: '12 inches' },
        { id: 'c', text: '72 inches' },
        { id: 'd', text: '√12 inches' },
      ],
      expectedAnswer: '6√2 inches',
      hints: [
        'The two legs are both 6, so 6² + 6² = c². Work out c² first, then take the square root.',
        'c² = 36 + 36 = 72, so c = √72. Simplify: √72 = √(36 · 2) = 6√2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A rectangular tabletop measures 5 feet by 12 feet. A metal support runs straight from one corner to the opposite corner. How long is the support, in feet? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'The two sides of the rectangle meet at a right angle, so they are the legs: 5² + 12² = c².',
        '25 + 144 = 169, so c² = 169. Take the positive square root.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-non-right-triangle',
      kind: 'misconception_check',
      question:
        'In △XYZ, XY = 7, YZ = 9, and the angle at Y measures 50°. A student computes √(7² + 9²) ≈ 11.4 and reports that as the length of XZ. What went wrong?',
      commonErrors: [
        {
          answer: 'XZ ≈ 11.4',
          misconception:
            'Treating a² + b² = c² as a rule for every triangle, so any two known sides get squared and added.',
          correctsTo:
            'The theorem holds ONLY when the angle between the two sides is exactly 90°. Here that angle is 50°, so the triangle is not right and the equation does not apply — the third side is actually shorter than 11.4, because a smaller included angle pulls the far vertices closer together. Non-right triangles need a different tool (the Law of Cosines, in later courses). Before writing a² + b² = c², confirm a right angle is given or proved.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'a² + b² = c² applies to RIGHT triangles only, and c is always the hypotenuse — the side opposite the right angle.',
        'Missing hypotenuse → add the leg squares; missing leg → subtract from the hypotenuse squared. A leg must come out shorter than the hypotenuse.',
        'The converse runs backwards: with c the longest side, a² + b² = c² proves a right angle; > c² means acute, < c² means obtuse.',
        'Know the triples (3-4-5, 5-12-13, 8-15-17, 7-24-25 and multiples), but verify the largest side is really the hypotenuse before using one.',
        'Leave radical answers exact and simplified (√72 = 6√2); round only when the problem asks.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'The Pythagorean Theorem & Its Converse' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
