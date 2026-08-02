/**
 * ACT — Unit 2 CED 2.9: Trigonometry.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.trigonometry.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_TRIGONOMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.trigonometry.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.9',
  cedTitle: 'Trigonometry',
  planId: 'evelyn.testprep.act.trigonometry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.trigonometry.v1' }],
  theory: [
    { loId: 'act.trigonometry', content: `SOHCAHTOA: sin θ = opposite/hypotenuse; cos θ = adjacent/hypotenuse; tan θ = opposite/adjacent. Always confirm WHICH angle θ is before labeling sides — opposite and adjacent flip depending on the angle.` },
    { loId: 'act.trigonometry', content: `RADIANS: π radians = 180°. Convert with θ_rad = θ_deg × (π/180) and θ_deg = θ_rad × (180/π). The ACT mixes both units, so check which one a problem is using before you compute anything.` },
    { loId: 'act.trigonometry', content: `UNIT CIRCLE: the circle of radius 1 centered at the origin. For any angle θ measured counterclockwise from the positive x-axis, the point on the circle is (cos θ, sin θ) — cosine is the x-coordinate, sine is the y-coordinate.` },
    { loId: 'act.trigonometry', content: `QUADRANT SIGNS: in Quadrant I all ratios are positive; in QII only sine (and csc) is positive; in QIII only tangent (and cot) is positive; in QIV only cosine (and sec) is positive. Mnemonic: All Students Take Calculus.` },
    { loId: 'act.trigonometry', content: `REFERENCE ANGLE: the acute angle between an angle's terminal side and the x-axis. A trig value of any angle equals the same trig value of its reference angle, with the sign set by the quadrant.` },
    { loId: 'act.trigonometry', content: `PYTHAGOREAN IDENTITY: sin²θ + cos²θ = 1 for any angle θ. Given one ratio, solve for the magnitude of the other — but the identity alone never tells you the sign; the quadrant does.` },
    { loId: 'act.trigonometry', content: `LAWS OF SINES/COSINES: for triangles that aren't right triangles, the ACT GIVES you the formula in the problem when you need it — Law of Sines: a/sin A = b/sin B = c/sin C. Law of Cosines: c² = a² + b² − 2ab·cos C. Your job is to recognize when a triangle isn't right and plug the given numbers in correctly.` },
    { loId: 'act.trigonometry', content: `TRAP PATTERN: distractors routinely swap which side is "opposite" vs "adjacent" to the angle in question, or drop the sign that a quadrant should have added to an identity-derived value.` },
    { loId: 'act.trigonometry', kind: 'definition', title: 'radian', content: `a unit of angle measure where 2π radians = 360°; commonly appears as fractions of π on the ACT (e.g. π/6, 2π/3).` },
    { loId: 'act.trigonometry', kind: 'definition', title: 'unit circle', content: `the circle of radius 1 centered at the origin, used to define sin θ and cos θ as coordinates for any angle, not just acute ones.` },
    { loId: 'act.trigonometry', kind: 'definition', title: 'reference angle', content: `the acute angle between an angle's terminal side and the x-axis — used to find trig values for angles outside Quadrant I.` },
    { loId: 'act.trigonometry', kind: 'definition', title: 'Law of Sines / Law of Cosines', content: `formulas relating the sides and angles of ANY triangle, not just right triangles; the ACT always supplies the formula when a problem needs it.` },
  ],
  methods: [
    {
      title: 'Worked sohcahtoa',
      steps: [
        `Find the missing leg with the Pythagorean theorem: 7² + b² = 25² ⟹ 49 + b² = 625 ⟹ b² = 576 ⟹ b = 24. (This is a 7-24-25 triple.)`,
        `θ is the angle between the hypotenuse and the leg of length 24 — so relative to θ, that leg of length 24 is ADJACENT, and the hypotenuse is 25.`,
        'cos θ = adjacent/hypotenuse = 24/25.',
      ],
      example: { problem: `A right triangle has a hypotenuse of 25 and one leg of length 7. Find cos θ, where θ is the angle between the hypotenuse and the other leg.`, solution: 'cos θ = 24/25' },
      relatedLoIds: ['act.trigonometry'],
    },
    {
      title: 'Worked quadrant sign trap',
      steps: [
        'Start from sin²θ + cos²θ = 1.',
        'cos²θ = 1 − sin²θ = 1 − (3/5)² = 1 − 9/25 = 16/25.',
        `cos θ = ±4/5 — the identity alone can't tell you the sign; only the quadrant can.`,
        `TRAP: θ is in Quadrant II, where cosine is NEGATIVE (only sine is positive there). So cos θ = −4/5, not +4/5.`,
      ],
      example: { problem: `θ is an angle in Quadrant II (90° < θ < 180°) with sin θ = 3/5. Use the Pythagorean identity to find cos θ.`, solution: 'cos θ = −4/5' },
      relatedLoIds: ['act.trigonometry'],
    },
  ],
  pointers: [
    { content: `Always check the mode indicator before evaluating a trig expression. "30" in radian mode means 30 radians (way more than one full rotation), not 30°. Switched to degree mode, sin(30°) = 0.5. If a problem instead gives an angle in radians (e.g. sin(π/6)), switch to radian mode. Mixing up degree/radian mode is one of the most common wrong-answer traps on ACT trig items.`, kind: 'common-error' },
    { content: `SOHCAHTOA: pin down WHICH angle you're finding before labeling opposite/adjacent — the same triangle gives different ratios for different angles.`, kind: 'tip' },
    { content: `The unit circle defines cos θ and sin θ as the x- and y-coordinates of a point at angle θ — their signs flip by quadrant (All Students Take Calculus).`, kind: 'tip' },
    { content: `sin²θ + cos²θ = 1 only gives you a magnitude; use the quadrant to choose the sign.`, kind: 'tip' },
    { content: `Check your calculator's angle mode (degrees vs radians) before evaluating — and trust the Law of Sines/Cosines formulas whenever the ACT hands them to you.`, kind: 'tip' },
    { content: `The ACT loves answers left in ratio form with an unrationalized radical. If you get tan θ = 1/√3 and don't see it, look for √3/3 — same value, different skin. Same for 1/√2 = √2/2. Don't assume you erred.`, kind: 'gotcha' },
    { content: `"Angle of elevation/depression" word problems: depression is measured from the HORIZONTAL down, not from the vertical. Sketch the horizontal dashed line first, then the angle — mislabeling it swaps sin and cos and lands you on a trap choice.`, kind: 'common-error' },
    { content: `When a triangle side is unknown and you must SOLVE for it, tan is often faster than sin/cos — no hypotenuse needed. If the problem never mentions the hypotenuse, that's a signal tangent is the intended ratio.`, kind: 'tip' },
    { content: `Law of Cosines is for SAS or SSS; Law of Sines is for ASA/AAS or SSA. If you're given two sides and the angle BETWEEN them, Law of Sines is useless — no side/opposite-angle pair is complete.`, kind: 'edge-case' },
    { content: `Don't confuse sin⁻¹ with 1/sin. sin⁻¹(0.5) = 30°, but (sin 30°)⁻¹ = csc 30° = 2. Answer choices sometimes include both. "Inverse" in a question stem means arcsine — find the ANGLE.`, kind: 'vocab-note' },
    { content: `A negative or >360° angle still has a reference angle. For −150° or 480°, add/subtract 360° until you land in [0°, 360°), THEN find the quadrant and reference angle. The trig value is identical.`, kind: 'edge-case' },
    { content: `Sine and cosine outputs always live in [−1, 1]. If an identity or unit-circle problem gives you 5/4 or 1.3, you flipped a fraction. Tangent has no such limit — don't apply the check to tan.`, kind: 'tip' },
    { content: `Watch for triangles that LOOK right but aren't labeled with the square symbol. If no right angle is marked and no 90° is stated, SOHCAHTOA and the Pythagorean theorem are off-limits — the problem wants Law of Sines/Cosines.`, kind: 'gotcha' },
  ],
};
