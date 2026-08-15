/**
 * Digital SAT — Math / Geometry & Trigonometry: Right Triangles & Trigonometry.
 *
 * Core right-triangle trig for the digital test: SOHCAHTOA, the two
 * memorized special-triangle ratios (45-45-90 and 30-60-90), and the
 * complementary-angle identity sin(x) = cos(90 − x) — a pattern the SAT
 * reuses constantly, often with no triangle drawn at all. Desmos is
 * allowed on every math question; it verifies decimal trig values but
 * won't hand you the special-triangle ratios — those must be memorized.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U4_RIGHT_TRIANGLE_TRIG: LessonPlan = {
  id: 'evelyn.testprep.dsat.right-triangle-trig.v1',
  title: 'Right Triangles & Trigonometry',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.right-triangle-trig',
      standard: 'DSAT-4.3',
      description:
        'Apply SOHCAHTOA, the special right-triangle ratios (45-45-90 and 30-60-90), and the complementary-angle identity sin(x) = cos(90 − x) to solve right-triangle problems on the digital SAT.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Geometry & Trigonometry as roughly 15 percent of SAT Math, with right-triangle trig as the single most recurring pattern in that domain.',
      script:
        'Geometry and Trigonometry make up about 15 percent of SAT Math — around 5 to 7 questions a test. Within that domain, right-triangle trig is the pattern you will see over and over: SOHCAHTOA, the two special triangles, and one identity the SAT loves to disguise. Learn these cold and they become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-right-triangle-trig',
      kind: 'concept',
      goal: 'SOHCAHTOA, the two memorized special-triangle ratios, and the complementary-angle identity, plus the traps around each.',
      keyIdeas: [
        'SOHCAHTOA — sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Always re-identify opposite and adjacent relative to whichever angle is the reference.',
        'HYPOTENUSE is always the side across from the right angle (the longest side). OPPOSITE and ADJACENT depend on which acute angle you pick as θ — pick the other acute angle and opposite/adjacent SWAP.',
        '45-45-90 TRIANGLE — legs are equal; ratio leg : leg : hypotenuse = x : x : x√2. So hypotenuse = leg × √2, and leg = hypotenuse / √2.',
        '30-60-90 TRIANGLE — ratio short leg : long leg : hypotenuse = x : x√3 : 2x. The short leg is opposite the 30° angle; the long leg is opposite the 60° angle; the hypotenuse is always 2× the short leg.',
        'TRAP — SPECIAL-TRIANGLE SHORTCUT. When a triangle has a 45°, 30°, or 60° angle, use the memorized ratio directly instead of grinding through the Pythagorean theorem with decimals — it is faster and avoids rounding errors.',
        'COMPLEMENTARY ANGLE IDENTITY — in ANY right triangle, the two acute angles sum to 90°, so they are complements of each other. That means sin(x) = cos(90° − x) and cos(x) = sin(90° − x) for any acute angle x.',
        'TRAP — the SAT often gives sin(x°) = a value and asks for cos(90° − x)° with NO triangle drawn. Apply the identity directly — do NOT solve for x with sin⁻¹ first.',
        'DESMOS CHECK — the calculator can verify decimal values (type sin(30) to confirm 0.5) but won\'t hand you the special-triangle ratios — memorize x : x√3 : 2x and x : x : x√2 cold.',
      ],
      vocabulary: [
        { term: 'SOHCAHTOA', definition: 'mnemonic for the three ratios: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.' },
        { term: 'complementary angles', definition: 'two angles that sum to 90°; in a right triangle the two acute angles are always complementary.' },
        { term: '45-45-90 triangle', definition: 'isosceles right triangle; side ratio leg : leg : hypotenuse = x : x : x√2.' },
        { term: '30-60-90 triangle', definition: 'right triangle formed by bisecting an equilateral triangle; side ratio short leg : long leg : hypotenuse = x : x√3 : 2x.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sohcahtoa',
      kind: 'worked_example',
      problem: 'In right triangle ABC, angle C = 90°. AB (the hypotenuse) = 13 and BC = 5. What is cos A?',
      steps: [
        'The hypotenuse is the side across the right angle: AB = 13.',
        'cos A needs the side ADJACENT to angle A, not BC (which is opposite A). Find AC with the Pythagorean theorem: AC² = AB² − BC² = 169 − 25 = 144 → AC = 12.',
        'cos A = adjacent / hypotenuse = AC / AB = 12/13.',
      ],
      answer: 'cos A = 12/13',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-special-triangle-trap',
      kind: 'worked_example',
      problem:
        'In right triangle PQR, angle R = 90° and angle P = 60°. QR (the side opposite angle P) = 9√3. What is PQ, the hypotenuse?',
      steps: [
        'Angle P = 60° and angle R = 90°, so angle Q = 30° — this is a 30-60-90 triangle with ratio short leg : long leg : hypotenuse = x : x√3 : 2x.',
        'QR is opposite the 60° angle, so QR is the LONG leg = x√3. Given QR = 9√3, that gives x = 9.',
        'TRAP: don\'t grind through the Pythagorean theorem with decimals — the hypotenuse is simply 2x by the memorized ratio: PQ = 2(9) = 18.',
      ],
      answer: 'PQ = 18',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identity',
      kind: 'try_yourself',
      problem: 'For an acute angle x in a right triangle, sin(x°) = 5/13. What is cos(90° − x)°?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12/13' },
        { id: 'b', text: '5/13', correct: true },
        { id: 'c', text: '13/5' },
        { id: 'd', text: '8/13' },
      ],
      expectedAnswer: '5/13',
      hints: [
        'Do you need to find x first? Think about the complementary-angle identity.',
        'sin(x) = cos(90° − x) — apply it directly, no triangle or inverse sine needed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-45-45-90',
      kind: 'try_yourself',
      problem: 'In right triangle XYZ, angle Y = 90°, angle X = 45°, and leg XY = 8. What is the hypotenuse, XZ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8' },
        { id: 'b', text: '8√2', correct: true },
        { id: 'c', text: '16' },
        { id: 'd', text: '4√2' },
      ],
      expectedAnswer: '8√2',
      hints: [
        'Angle X = 45° makes this a 45-45-90 triangle — both legs are equal.',
        'Ratio: leg : leg : hypotenuse = x : x : x√2, so hypotenuse = leg × √2 = 8√2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr-45-45-90',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): In right triangle ABC, angle C = 90°, angle A = 45°, and hypotenuse AB = 10√2. What is the length of leg BC?',
      responseFormat: 'numeric',
      expectedAnswer: '10',
      hints: [
        'Angle A = 45° makes this a 45-45-90 triangle.',
        'Ratio: leg = hypotenuse / √2 = 10√2 / √2 = 10.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-identity-overgeneralize',
      kind: 'misconception_check',
      question:
        'A student notices sin 40° = cos 50° and concludes "sin θ = cos θ for all θ." What went wrong?',
      commonErrors: [
        {
          answer: 'sin θ = cos θ for all θ',
          misconception:
            'Overgeneralizing the complementary-angle identity — it equates sin and cos of COMPLEMENTARY angles (summing to 90°), not equal angles.',
          correctsTo:
            'The identity is sin(x) = cos(90° − x). sin 40° = cos 50° works because 40 + 50 = 90. sin θ = cos θ is only true at θ = 45° specifically — not as a general rule for every θ.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SOHCAHTOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj — re-check opposite/adjacent for whichever angle is the reference.',
        '45-45-90 ratio: x : x : x√2. 30-60-90 ratio: x : x√3 : 2x (short leg : long leg : hypotenuse).',
        'Complementary identity: sin(x) = cos(90° − x). Apply it directly — never solve for the angle first.',
        'Desmos verifies decimal trig values but does not replace memorizing the special-triangle ratios.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Right Triangles & Trigonometry' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
