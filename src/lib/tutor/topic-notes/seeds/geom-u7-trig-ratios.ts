/**
 * Geometry — Unit 7 CED 7.3: Trigonometric Ratios: Sine, Cosine & Tangent.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.trig-ratios.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U7_TRIG_RATIOS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.trig-ratios.v1',
  course: 'Geometry',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Trigonometric Ratios: Sine, Cosine & Tangent',
  planId: 'evelyn.hs.geom.trig-ratios.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.trig-ratios.v1' }],
  theory: [
    { loId: 'geom.trig-ratios', kind: 'framework', title: 'Label from the angle', content: `LABEL FROM THE ANGLE — pick the acute angle A you care about. The HYPOTENUSE is always opposite the right angle; the OPPOSITE side faces angle A; the ADJACENT side touches angle A (and is not the hypotenuse). Switch angles and opposite/adjacent swap roles.` },
    { loId: 'geom.trig-ratios', kind: 'framework', title: 'The three ratios', content: `THE THREE RATIOS — sin A = opposite/hypotenuse, cos A = adjacent/hypotenuse, tan A = opposite/adjacent. Memory hook: SOH-CAH-TOA.` },
    { loId: 'geom.trig-ratios', content: `WHY IT WORKS: SIMILARITY — every right triangle with a given acute angle A is similar (AA: the right angle plus A). Similar triangles have equal side ratios — so sin 35° is the SAME number in a pocket-sized triangle and a football field. The ratio belongs to the ANGLE, not the triangle.` },
    { loId: 'geom.trig-ratios', kind: 'framework', title: 'Ratios are unitless', content: `RATIOS ARE UNITLESS — a length divided by a length. sin and cos are always between 0 and 1 (the hypotenuse is the longest side); tan can be any positive number.` },
    { loId: 'geom.trig-ratios', kind: 'framework', title: 'Cofunctions', content: `COFUNCTIONS — the two acute angles add to 90°, and the opposite side of one is the adjacent side of the other, so sin A = cos(90° - A). sin 30° = cos 60°.` },
    { loId: 'geom.trig-ratios', content: `WHICH RATIO? — the ratio that connects the two sides in play: no hypotenuse involved → tan; hypotenuse + opposite → sin; hypotenuse + adjacent → cos.` },
    { loId: 'geom.trig-ratios', kind: 'definition', title: 'hypotenuse', content: 'the side opposite the right angle — always the longest side.' },
    { loId: 'geom.trig-ratios', kind: 'definition', title: 'tangent', content: 'for acute angle A, the ratio opposite/adjacent.' },
  ],
  methods: [
    {
      title: 'Worked three ratios',
      steps: [
        `Label from angle A: the hypotenuse is AB = 5; the side OPPOSITE angle A is BC = 3; the side ADJACENT to A is AC = 4.`,
        'sin A = opposite/hypotenuse = 3/5 = 0.6.',
        'cos A = adjacent/hypotenuse = 4/5 = 0.8.',
        `tan A = opposite/adjacent = 3/4 = 0.75. Sanity check: sin and cos are both below 1, and tan = sin/cos = 0.6/0.8 = 0.75. ✓`,
      ],
      example: { problem: `In right triangle ABC, the right angle is at C. AB = 5 (hypotenuse), BC = 3, and AC = 4. Find sin A, cos A, and tan A.`, solution: 'sin A = 0.6, cos A = 0.8, tan A = 0.75' },
      relatedLoIds: ['geom.trig-ratios'],
    },
    {
      title: 'Worked wrong angle trap',
      steps: [
        `Relabel from angle B — opposite/adjacent are angle-dependent: the side OPPOSITE angle B is AC = 4, and the side adjacent to B is BC = 3.`,
        `The student recycled the labels from angle A, where the opposite side was BC = 3. That 3/5 is sin A, not sin B.`,
        'sin B = opposite/hypotenuse = 4/5 = 0.8.',
        `Notice sin B = cos A — B and A are complementary (they add to 90°), so sin B = cos(90° - B) = cos A. The cofunction identity is a built-in answer check.`,
      ],
      example: { problem: `Using the same triangle (right angle at C, AB = 5, BC = 3, AC = 4), a student computes sin B = 3/5 and is marked wrong. Find the correct sin B and explain the error.`, solution: 'sin B = 0.8 — the opposite side must be relabeled for each angle' },
      relatedLoIds: ['geom.trig-ratios'],
    },
  ],
  pointers: [
    { content: `Only the hypotenuse is fixed. Opposite and adjacent swap when you switch acute angles — relabel from scratch for each angle before writing any ratio.`, kind: 'common-error' },
    { content: `SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj — always labeled from the chosen angle.`, kind: 'tip' },
    { content: `Similarity is why it works: the ratio depends only on the angle, not the triangle size.`, kind: 'tip' },
    { content: 'sin and cos are between 0 and 1; tan = sin/cos can be any positive number.', kind: 'tip' },
    { content: `Cofunctions: sin A = cos(90° - A) — sine of an angle equals cosine of its complement.`, kind: 'tip' },
    { content: `Only the hypotenuse is a fixed label. "Opposite" and "adjacent" belong to the angle you chose — relabel the diagram from scratch before writing sin B after you wrote sin A.`, kind: 'common-error' },
    { content: `Always write the angle: \`sin A = 3/5\`, not \`sin = 3/5\`. A bare "sin" means nothing, and dropping the angle name is exactly how the wrong-angle mix-up starts.`, kind: 'vocab-note' },
    { content: `If you get sin or cos greater than 1, you divided by the wrong side — the hypotenuse is the longest side, so it must be the denominator (and the biggest number) for sine and cosine.`, kind: 'tip' },
    { content: `Tangent has no hypotenuse in it and no upper bound. Values like tan A = 4 or tan A = 0.25 are perfectly fine — don't 'correct' them to be under 1.`, kind: 'edge-case' },
    { content: `Cofunction means sin A = cos(90° − A), NOT sin A = cos A. Subtract from 90°, and only swap sine with cosine — there's no such shortcut for tangent to itself.`, kind: 'gotcha' },
    { content: `In a right triangle, sin A = cos B for the two acute angles. Use it as a free answer check: your sin A and cos B should come out identical.`, kind: 'tip' },
    { content: `Trig ratios are unitless. If lengths are in cm, sin A is still just a number — never write "sin A = 0.6 cm".`, kind: 'common-error' },
    { content: `Doubling every side does NOT change sin, cos, or tan — the triangles are similar. Only changing the ANGLE changes the ratio. Don't hunt for a 'bigger' answer in a bigger triangle.`, kind: 'gotcha' },
  ],
};
