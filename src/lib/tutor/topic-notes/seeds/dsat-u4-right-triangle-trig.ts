/**
 * Digital SAT — Unit 4 CED 4.3: Right Triangles & Trigonometry.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.right-triangle-trig.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U4_RIGHT_TRIANGLE_TRIG: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.right-triangle-trig.v1',
  course: 'Digital SAT',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Right Triangles & Trigonometry',
  planId: 'evelyn.testprep.dsat.right-triangle-trig.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.right-triangle-trig.v1' }],
  theory: [
    { loId: 'dsat.right-triangle-trig', kind: 'framework', title: 'Sohcahtoa', content: `SOHCAHTOA — sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Always re-identify opposite and adjacent relative to whichever angle is the reference.` },
    { loId: 'dsat.right-triangle-trig', content: `HYPOTENUSE is always the side across from the right angle (the longest side). OPPOSITE and ADJACENT depend on which acute angle you pick as θ — pick the other acute angle and opposite/adjacent SWAP.` },
    { loId: 'dsat.right-triangle-trig', content: `45-45-90 TRIANGLE — legs are equal; ratio leg : leg : hypotenuse = x : x : x√2. So hypotenuse = leg × √2, and leg = hypotenuse / √2.` },
    { loId: 'dsat.right-triangle-trig', content: `30-60-90 TRIANGLE — ratio short leg : long leg : hypotenuse = x : x√3 : 2x. The short leg is opposite the 30° angle; the long leg is opposite the 60° angle; the hypotenuse is always 2× the short leg.` },
    { loId: 'dsat.right-triangle-trig', kind: 'framework', title: 'Trap', content: `TRAP — SPECIAL-TRIANGLE SHORTCUT. When a triangle has a 45°, 30°, or 60° angle, use the memorized ratio directly instead of grinding through the Pythagorean theorem with decimals — it is faster and avoids rounding errors.` },
    { loId: 'dsat.right-triangle-trig', kind: 'framework', title: 'Complementary angle identity', content: `COMPLEMENTARY ANGLE IDENTITY — in ANY right triangle, the two acute angles sum to 90°, so they are complements of each other. That means sin(x) = cos(90° − x) and cos(x) = sin(90° − x) for any acute angle x.` },
    { loId: 'dsat.right-triangle-trig', kind: 'framework', title: 'Trap', content: `TRAP — the SAT often gives sin(x°) = a value and asks for cos(90° − x)° with NO triangle drawn. Apply the identity directly — do NOT solve for x with sin⁻¹ first.` },
    { loId: 'dsat.right-triangle-trig', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the calculator can verify decimal values (type sin(30) to confirm 0.5) but won't hand you the special-triangle ratios — memorize x : x√3 : 2x and x : x : x√2 cold.` },
    { loId: 'dsat.right-triangle-trig', kind: 'definition', title: 'SOHCAHTOA', content: 'mnemonic for the three ratios: sin = opp/hyp, cos = adj/hyp, tan = opp/adj.' },
    { loId: 'dsat.right-triangle-trig', kind: 'definition', title: 'complementary angles', content: `two angles that sum to 90°; in a right triangle the two acute angles are always complementary.` },
    { loId: 'dsat.right-triangle-trig', kind: 'definition', title: '45-45-90 triangle', content: 'isosceles right triangle; side ratio leg : leg : hypotenuse = x : x : x√2.' },
    { loId: 'dsat.right-triangle-trig', kind: 'definition', title: '30-60-90 triangle', content: `right triangle formed by bisecting an equilateral triangle; side ratio short leg : long leg : hypotenuse = x : x√3 : 2x.` },
  ],
  methods: [
    {
      title: 'Worked sohcahtoa',
      steps: [
        'The hypotenuse is the side across the right angle: AB = 13.',
        `cos A needs the side ADJACENT to angle A, not BC (which is opposite A). Find AC with the Pythagorean theorem: AC² = AB² − BC² = 169 − 25 = 144 → AC = 12.`,
        'cos A = adjacent / hypotenuse = AC / AB = 12/13.',
      ],
      example: { problem: `In right triangle ABC, angle C = 90°. AB (the hypotenuse) = 13 and BC = 5. What is cos A?`, solution: 'cos A = 12/13' },
      relatedLoIds: ['dsat.right-triangle-trig'],
    },
    {
      title: 'Worked special triangle trap',
      steps: [
        `Angle P = 60° and angle R = 90°, so angle Q = 30° — this is a 30-60-90 triangle with ratio short leg : long leg : hypotenuse = x : x√3 : 2x.`,
        `QR is opposite the 60° angle, so QR is the LONG leg = x√3. Given QR = 9√3, that gives x = 9.`,
        `TRAP: don't grind through the Pythagorean theorem with decimals — the hypotenuse is simply 2x by the memorized ratio: PQ = 2(9) = 18.`,
      ],
      example: { problem: `In right triangle PQR, angle R = 90° and angle P = 60°. QR (the side opposite angle P) = 9√3. What is PQ, the hypotenuse?`, solution: 'PQ = 18' },
      relatedLoIds: ['dsat.right-triangle-trig'],
    },
  ],
  pointers: [
    { content: `The identity is sin(x) = cos(90° − x). sin 40° = cos 50° works because 40 + 50 = 90. sin θ = cos θ is only true at θ = 45° specifically — not as a general rule for every θ.`, kind: 'common-error' },
    { content: `SOHCAHTOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj — re-check opposite/adjacent for whichever angle is the reference.`, kind: 'tip' },
    { content: `45-45-90 ratio: x : x : x√2. 30-60-90 ratio: x : x√3 : 2x (short leg : long leg : hypotenuse).`, kind: 'tip' },
    { content: `Complementary identity: sin(x) = cos(90° − x). Apply it directly — never solve for the angle first.`, kind: 'tip' },
    { content: `Desmos verifies decimal trig values but does not replace memorizing the special-triangle ratios.`, kind: 'tip' },
    { content: `Desmos evaluates trig in RADIANS by default. If you type sin(30) to check a degree answer, you'll get −0.988, not 0.5. Type sin(30°) using the degree symbol (or set the angle mode) before trusting the number.`, kind: 'gotcha' },
    { content: `Similar-triangle setups: the SAT gives triangle ABC ~ triangle DEF and says sin A = 3/5, then asks for sin D. The answer is 3/5 — trig ratios depend only on the ANGLE, not the size. Don't rescale anything.`, kind: 'gotcha' },
    { content: `In 30-60-90, the SHORT leg pairs with 30° and the LONG leg with 60°. Students who match "30 → 30-ish is the bigger number" invert x and x√3. Always anchor: shortest side sits across from the smallest angle.`, kind: 'common-error' },
    { content: `tan has NO hypotenuse. If a problem gives only the two legs, tan is computable immediately; if it gives a leg and the hypotenuse, sin or cos is the direct route. Match the given sides to the ratio instead of defaulting to Pythagoras.`, kind: 'tip' },
    { content: `sin(x) = cos(90 − x) links sin to COS only. sin(x) = sin(90 − x) and tan(x) = tan(90 − x) are false. Also watch cos(x) = sin(90 − x) — same identity, read the function names before answering.`, kind: 'edge-case' },
    { content: `When the SAT says sin(a°) = cos(b°) and asks for a + b, the answer is 90 — no angle solving needed. Same idea if it gives sin(2x) = cos(x + 30): set 2x + (x + 30) = 90.`, kind: 'tip' },
    { content: `In a right triangle, sin and cos are always between 0 and 1 (a leg can't exceed the hypotenuse). If your ratio comes out ≥ 1, you put a leg over a leg or flipped the fraction. tan has no such cap.`, kind: 'common-error' },
    { content: `"Opposite" and "adjacent" are relative to the reference angle only. In the same triangle, sin A = cos B and cos A = sin B when A and B are the two acute angles — switching angles swaps the two legs' roles.`, kind: 'vocab-note' },
  ],
};
