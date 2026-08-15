/**
 * Geometry — Right Triangles & Trigonometry: Trigonometric Ratios.
 *
 * SOH-CAH-TOA as a consequence of similarity (CCSS G-SRT.C.6, G-SRT.C.7):
 * every right triangle with the same acute angle is similar, so the
 * side ratios depend only on the angle. Numeric answers stay on
 * Pythagorean-triple triangles so decimals come out exact.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U7_TRIG_RATIOS: LessonPlan = {
  id: 'evelyn.hs.geom.trig-ratios.v1',
  title: 'Trigonometric Ratios: Sine, Cosine & Tangent',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.trig-ratios',
      standard: 'GEOM-7.3',
      description:
        'Define the sine, cosine, and tangent ratios in right triangles, explain why they depend only on the acute angle via similarity, and use the sine-cosine relationship for complementary angles (CCSS G-SRT.C.6, G-SRT.C.7).',
    },
  ],
  prerequisites: ['geom.special-right-triangles'],
  followUps: ['geom.solving-right-triangles'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trig as the tool that turns one angle plus one side into every other measurement — no ladder required.',
      script:
        'How do you measure the height of a flagpole without climbing it? Stand back, measure the angle up to the top, measure your distance from the base — and trigonometry hands you the height. The trick is that in a right triangle, one acute angle locks in the RATIOS of all the sides. Learn three ratios — sine, cosine, tangent — and any right triangle becomes solvable from almost nothing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sohcahtoa',
      kind: 'concept',
      goal: 'The three ratios, the similarity reason they work, and the labeling discipline.',
      keyIdeas: [
        'LABEL FROM THE ANGLE — pick the acute angle A you care about. The HYPOTENUSE is always opposite the right angle; the OPPOSITE side faces angle A; the ADJACENT side touches angle A (and is not the hypotenuse). Switch angles and opposite/adjacent swap roles.',
        'THE THREE RATIOS — sin A = opposite/hypotenuse, cos A = adjacent/hypotenuse, tan A = opposite/adjacent. Memory hook: SOH-CAH-TOA.',
        'WHY IT WORKS: SIMILARITY — every right triangle with a given acute angle A is similar (AA: the right angle plus A). Similar triangles have equal side ratios — so sin 35° is the SAME number in a pocket-sized triangle and a football field. The ratio belongs to the ANGLE, not the triangle.',
        'RATIOS ARE UNITLESS — a length divided by a length. sin and cos are always between 0 and 1 (the hypotenuse is the longest side); tan can be any positive number.',
        'COFUNCTIONS — the two acute angles add to 90°, and the opposite side of one is the adjacent side of the other, so sin A = cos(90° - A). sin 30° = cos 60°.',
        'WHICH RATIO? — the ratio that connects the two sides in play: no hypotenuse involved → tan; hypotenuse + opposite → sin; hypotenuse + adjacent → cos.',
      ],
      vocabulary: [
        { term: 'hypotenuse', definition: 'the side opposite the right angle — always the longest side.' },
        { term: 'tangent', definition: 'for acute angle A, the ratio opposite/adjacent.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-three-ratios',
      kind: 'worked_example',
      problem:
        'In right triangle ABC, the right angle is at C. AB = 5 (hypotenuse), BC = 3, and AC = 4. Find sin A, cos A, and tan A.',
      steps: [
        'Label from angle A: the hypotenuse is AB = 5; the side OPPOSITE angle A is BC = 3; the side ADJACENT to A is AC = 4.',
        'sin A = opposite/hypotenuse = 3/5 = 0.6.',
        'cos A = adjacent/hypotenuse = 4/5 = 0.8.',
        'tan A = opposite/adjacent = 3/4 = 0.75. Sanity check: sin and cos are both below 1, and tan = sin/cos = 0.6/0.8 = 0.75. ✓',
      ],
      answer: 'sin A = 0.6, cos A = 0.8, tan A = 0.75',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-angle-trap',
      kind: 'worked_example',
      problem:
        'Using the same triangle (right angle at C, AB = 5, BC = 3, AC = 4), a student computes sin B = 3/5 and is marked wrong. Find the correct sin B and explain the error.',
      steps: [
        'Relabel from angle B — opposite/adjacent are angle-dependent: the side OPPOSITE angle B is AC = 4, and the side adjacent to B is BC = 3.',
        'The student recycled the labels from angle A, where the opposite side was BC = 3. That 3/5 is sin A, not sin B.',
        'sin B = opposite/hypotenuse = 4/5 = 0.8.',
        'Notice sin B = cos A — B and A are complementary (they add to 90°), so sin B = cos(90° - B) = cos A. The cofunction identity is a built-in answer check.',
      ],
      answer: 'sin B = 0.8 — the opposite side must be relabeled for each angle',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-ratio',
      kind: 'try_yourself',
      problem:
        'A ramp rises to a door. You know the angle the ramp makes with the ground and the horizontal distance from the ramp base to the wall, and you want the vertical rise. The rise is opposite the angle; the horizontal distance is adjacent to it. Which ratio finds the rise?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Tangent — it links the opposite and adjacent sides', correct: true },
        { id: 'b', text: 'Sine — it links the opposite side and the hypotenuse' },
        { id: 'c', text: 'Cosine — it links the adjacent side and the hypotenuse' },
        { id: 'd', text: 'Any ratio works for any pair of sides' },
      ],
      expectedAnswer: 'Tangent — it links the opposite and adjacent sides',
      hints: [
        'Which two sides are in play — and is the hypotenuse one of them?',
        'Opposite and adjacent, no hypotenuse → TOA.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cofunction',
      kind: 'try_yourself',
      problem: 'Which value is equal to sin 25°?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'cos 65°', correct: true },
        { id: 'b', text: 'cos 25°' },
        { id: 'c', text: 'tan 65°' },
        { id: 'd', text: 'sin 65°' },
      ],
      expectedAnswer: 'cos 65°',
      hints: [
        'sin A = cos(90° - A) — the cofunction identity for complementary angles.',
        '90° - 25° = 65°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In a right triangle, the side opposite angle A is 6 and the hypotenuse is 10. Type sin A as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '0.6',
      hints: [
        'sin A = opposite/hypotenuse = 6/10.',
        'Write 6/10 as a decimal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-labels',
      kind: 'misconception_check',
      question:
        'A student writes "the opposite side of this triangle is 8" on their diagram and uses 8 as the opposite side for BOTH acute angles. What went wrong?',
      commonErrors: [
        {
          answer: 'Opposite = 8 for both angles',
          misconception: 'Treating opposite and adjacent as fixed properties of the triangle instead of labels relative to the chosen angle.',
          correctsTo:
            'Only the hypotenuse is fixed. Opposite and adjacent swap when you switch acute angles — relabel from scratch for each angle before writing any ratio.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj — always labeled from the chosen angle.',
        'Similarity is why it works: the ratio depends only on the angle, not the triangle size.',
        'sin and cos are between 0 and 1; tan = sin/cos can be any positive number.',
        'Cofunctions: sin A = cos(90° - A) — sine of an angle equals cosine of its complement.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Trigonometric Ratios: Sine, Cosine & Tangent' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
