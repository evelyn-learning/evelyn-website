/**
 * G10 — Right-triangle trigonometry (sin, cos, tan).
 *
 * The bridge from "ratios in similar triangles" to "trig functions of an
 * angle." SOH-CAH-TOA is the mnemonic but the lesson grounds it in why
 * the ratio depends only on the angle (similar triangles).
 */

import type { LessonPlan } from '../types';

export const SEED_G10_RIGHT_TRIANGLE_TRIG: LessonPlan = {
  id: 'evelyn.g10.math.trigonometry.right-triangle.v1',
  title: 'Right-Triangle Trigonometry — Sin, Cos, Tan',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'trigonometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.srt.c.6',
      description: 'Understand that side ratios in right triangles are properties of the angles, leading to definitions of trig ratios.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.C.6',
    },
    {
      id: 'ccss.math.hsg.srt.c.7',
      description: 'Explain and use the relationship between sine and cosine of complementary angles.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.C.7',
    },
    {
      id: 'ccss.math.hsg.srt.c.8',
      description: 'Use trig ratios and the Pythagorean theorem to solve right triangles in applied problems.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.C.8',
    },
  ],
  prerequisites: ['ccss.math.8.g.b.7'],
  followUps: ['ccss.math.hsf.tf.a.2'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student wonder why "the ratio of two sides" tells us the angle. Connect to similar triangles.',
      script: 'Two right triangles, both with a 30° angle, but one is twice as big. Are they similar? Yes. So a SPECIFIC ratio of their sides is identical in both — even though the actual lengths are different. That ratio is what we\'ll call "sin 30°", and it\'s the same in every right triangle with a 30° angle, anywhere in the universe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-soh-cah-toa',
      kind: 'concept',
      goal: 'Define sin, cos, tan as ratios of sides in a right triangle, relative to a chosen acute angle.',
      keyIdeas: [
        'Pick one of the two acute angles. Call it θ (theta).',
        'The side ACROSS from θ is the OPPOSITE.',
        'The side TOUCHING θ that is NOT the hypotenuse is the ADJACENT.',
        'The hypotenuse is always the side across from the right angle (longest side).',
        'sin θ = opposite / hypotenuse  (SOH).',
        'cos θ = adjacent / hypotenuse  (CAH).',
        'tan θ = opposite / adjacent  (TOA).',
        'These ratios depend ONLY on θ, not on the size of the triangle. That\'s why a calculator can compute "sin 30°" without seeing a triangle.',
      ],
      vocabulary: [
        { term: 'opposite', definition: 'the leg across from the chosen angle.' },
        { term: 'adjacent', definition: 'the leg touching the chosen angle (not the hypotenuse).' },
        { term: 'hypotenuse', definition: 'the longest side, across from the right angle.' },
      ],
      suggestedTools: ['show_geometry', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-find-side',
      kind: 'worked_example',
      problem: 'A right triangle has hypotenuse 10 and one acute angle of 30°. Find the side opposite the 30° angle.',
      steps: [
        'We know the hypotenuse and the angle, and we want the opposite. Which ratio uses opposite + hypotenuse? sin.',
        'sin 30° = opposite / 10.',
        'sin 30° = 1/2 (this is one to memorize).',
        '1/2 = opposite / 10  →  opposite = 5.',
        'Sanity check: opposite < hypotenuse, as it must be in a right triangle. ✓',
      ],
      answer: '5',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-find-angle',
      kind: 'worked_example',
      problem: 'A right triangle has opposite = 7 and adjacent = 24. Find θ to the nearest degree.',
      steps: [
        'Opposite and adjacent — the ratio that uses both is tan.',
        'tan θ = 7 / 24 ≈ 0.292.',
        'To "undo" tan, take the inverse tangent: θ = tan⁻¹(0.292) ≈ 16.3°.',
        'Round to nearest degree: θ ≈ 16°.',
      ],
      answer: '16°',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A right triangle has hypotenuse 12 and θ = 60°. Find the side adjacent to θ.',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        'Adjacent + hypotenuse — which ratio?',
        'cos 60° = 1/2. So adjacent = (1/2) × 12.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-which-ratio',
      kind: 'misconception_check',
      question: 'A friend has angle θ, knows the opposite leg, and wants the hypotenuse. They use cos. Where did they go wrong?',
      commonErrors: [
        {
          answer: 'cos',
          misconception: 'Picking a ratio without checking which two sides it actually uses.',
          correctsTo: 'cos uses adjacent and hypotenuse — but the friend has OPPOSITE and wants HYPOTENUSE. The ratio with those two is sin (opposite / hypotenuse). Always match the ratio to the two sides involved.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.',
        'Pick the ratio based on which two sides you have / want.',
        'Trig ratios depend only on the angle, not on triangle size.',
        'To find an angle from a ratio, use the inverse (sin⁻¹, cos⁻¹, tan⁻¹).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is sin 30° + cos 60° = 1, not just numerically but conceptually?',
      hint: '30° and 60° are complementary (add to 90°). In a right triangle, what angles do they correspond to? What sides?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
