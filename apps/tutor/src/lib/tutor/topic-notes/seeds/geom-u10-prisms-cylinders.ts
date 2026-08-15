/**
 * Geometry — Unit 10 CED 10.3: Surface Area & Volume: Prisms & Cylinders.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.prisms-cylinders.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U10_PRISMS_CYLINDERS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.prisms-cylinders.v1',
  course: 'Geometry',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Surface Area & Volume: Prisms & Cylinders',
  planId: 'evelyn.hs.geom.prisms-cylinders.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.prisms-cylinders.v1' }],
  theory: [
    { loId: 'geom.prisms-cylinders', kind: 'framework', title: 'One volume rule', content: `ONE VOLUME RULE — every prism and every cylinder has V = Bh, where B is the AREA of one base (square units) and h is the height. Rectangular prism: B = lw, so V = lwh. Triangular prism: B = ½(base)(height of the triangle). Cylinder: B = πr², so V = πr²h. Learn B, and the volume follows.` },
    { loId: 'geom.prisms-cylinders', kind: 'framework', title: 'Which face is the base', content: `WHICH FACE IS THE BASE — the bases are the two parallel congruent faces, not "whichever face is on the ground". A triangular prism resting on a rectangular side still has the TRIANGLES as its bases, and h is the distance between them.` },
    { loId: 'geom.prisms-cylinders', kind: 'framework', title: 'Height is perpendicular', content: `HEIGHT IS PERPENDICULAR — h is measured perpendicular to the bases. A slanted edge, a diagonal, or the length of a leaning axis is longer than h and never belongs in V = Bh.` },
    { loId: 'geom.prisms-cylinders', kind: 'framework', title: `Cavalieri's principle`, content: `CAVALIERI'S PRINCIPLE — if two solids have the same height and their cross-sections at every level have equal area, they have equal volume. Push a stack of coins sideways: every cross-section is still the same circle, so the leaning (oblique) stack holds exactly what the straight one held. That is why V = Bh works for oblique prisms and cylinders too.` },
    { loId: 'geom.prisms-cylinders', content: `SURFACE AREA = 2 BASES + LATERAL — SA = 2B + Ph, where P is the PERIMETER of the base. Unroll the side faces of a right prism or cylinder and they flatten into one rectangle P wide and h tall, so lateral area = Ph. Cylinder: P = 2πr, giving SA = 2πr² + 2πrh.` },
    { loId: 'geom.prisms-cylinders', content: `ERROR: DIAMETER FOR RADIUS — cylinder problems love to hand you the diameter (a can "6 cm across"). Halve it first. Using d in place of r makes the volume 4 times too large, because the radius gets squared.` },
    { loId: 'geom.prisms-cylinders', content: `ERROR: UNITS — volume is CUBIC (cm³, ft³, m³); surface area is SQUARE (cm², ft²). Convert mixed units before substituting, never after. Capacity link: 1 cm³ = 1 mL, so 1000 cm³ = 1 L.` },
    { loId: 'geom.prisms-cylinders', kind: 'framework', title: 'Scaling', content: `SCALING — multiply every dimension of a solid by k and the surface area multiplies by k², the volume by k³. Doubling a can's dimensions needs 4 times the metal but holds 8 times the soup.` },
    { loId: 'geom.prisms-cylinders', kind: 'definition', title: 'lateral area', content: `the combined area of the side faces of a solid, excluding the bases; for a right prism or cylinder it equals Ph.` },
    { loId: 'geom.prisms-cylinders', kind: 'definition', title: 'oblique prism', content: `a prism whose lateral edges are not perpendicular to the bases — it leans, but its volume is still B times the perpendicular height.` },
  ],
  methods: [
    {
      title: 'Worked triangular prism',
      steps: [
        `Identify the bases: the two congruent triangles. Their area is B = ½(9)(12) = 54 cm². The height of the prism is the distance between them, h = 10 cm.`,
        'Volume: V = Bh = 54 × 10 = 540 cm³ — cubic units, because it is a volume.',
        `Lateral area: the perimeter of the triangular base is P = 9 + 12 + 15 = 36 cm, so the three rectangular faces unroll into one 36 by 10 rectangle: Ph = 36 × 10 = 360 cm².`,
        `Total surface area: SA = 2B + Ph = 2(54) + 360 = 108 + 360 = 468 cm². Sanity check: the two triangles are the small part of the total, and every surface-area unit is squared. ✓`,
      ],
      example: { problem: `A ramp is a right triangular prism. Its two triangular bases are right triangles with legs 9 cm and 12 cm and hypotenuse 15 cm, and the prism is 10 cm deep (the distance between the two triangles). Find the volume and the total surface area.`, solution: 'V = 540 cm³ and SA = 468 cm²' },
      relatedLoIds: ['geom.prisms-cylinders'],
    },
    {
      title: 'Worked oblique slant trap',
      steps: [
        `Name the error: 15 in is the SLANT — the length of the leaning axis — not the height. Straightening the stack shows it is the hypotenuse of a right triangle with legs 9 (the vertical rise) and 12 (the sideways lean).`,
        `Apply Cavalieri's principle: at every level the cross-section is still a circle of radius 4, identical to the right cylinder of height 9. Equal cross-sections at equal heights → equal volumes, so leaning changes nothing.`,
        'Base area: B = πr² = π(4)² = 16π in².',
        `Volume: V = Bh with the PERPENDICULAR height h = 9, so V = 16π × 9 = 144π in³ ≈ 452 in³. The student's 240π was inflated by using the slant.`,
      ],
      example: { problem: `A leaning stack of poker chips forms an oblique cylinder. Each circular base has radius 4 in, the perpendicular distance between the bottom and top bases is 9 in, and the slanted axis of the stack measures 15 in. A student writes V = π(4)²(15) = 240π in³. Find the correct volume and explain the error.`, solution: 'V = 144π in³ ≈ 452 in³ — the perpendicular height is 9 in, not the 15 in slant' },
      relatedLoIds: ['geom.prisms-cylinders'],
    },
  ],
  pointers: [
    { content: `Every circle formula uses the RADIUS. Diameter 8 → r = 4, so V = π(4)²(20) = 320π cm³ ≈ 1005 cm³. Because the radius is squared, using d instead of r inflates the answer by a factor of 4 — the fastest habit-fix is to write "r = ___" on the page before touching the formula.`, kind: 'common-error' },
    { content: `V = Bh for every prism and cylinder — find the base AREA first (lw, ½bh, or πr²), then multiply by the height.`, kind: 'tip' },
    { content: `h is the PERPENDICULAR distance between the bases; slant lengths and leaning axes never go into V = Bh.`, kind: 'tip' },
    { content: `Cavalieri's principle: same height plus equal cross-sections at every level → equal volume, so oblique solids use the same formula.`, kind: 'tip' },
    { content: `SA = 2B + Ph — two bases plus the lateral surface unrolled into a P by h rectangle; cylinder: 2πr² + 2πrh.`, kind: 'tip' },
    { content: `Halve the diameter before using it as r, and keep units straight: volume cubic, surface area square.`, kind: 'tip' },
    { content: `Write "r = ___" on your page before touching any circle formula. If a problem says "6 cm across", "6 cm wide", or "diameter 6", then r = 3. Since r is squared, using d instead makes volume 4× too big.`, kind: 'common-error' },
    { content: `In V = Bh, B is an AREA (square units), not a length. If your B has units like cm instead of cm², you multiplied the wrong things — for a triangular prism B = ½(base)(triangle's height), not ½(base)(prism depth).`, kind: 'common-error' },
    { content: `The bases are the two parallel congruent faces — not whichever face is resting on the table. A triangular prism lying on a rectangular side still has TRIANGLE bases, and h is the distance between those triangles.`, kind: 'gotcha' },
    { content: `h is the PERPENDICULAR distance between the bases. A slant axis, slanted edge, or hypotenuse given in an oblique problem is a distractor — it is always longer than h and never goes into V = Bh.`, kind: 'gotcha' },
    { content: `In SA = 2B + Ph, P is the PERIMETER of the base, not its area — for a cylinder P = 2πr (circumference), giving lateral area 2πrh. Mixing up B and P turns 2πr² + 2πrh into πr² + πr²h.`, kind: 'vocab-note' },
    { content: `SA = 2B + Ph assumes TWO bases. Open-top containers, pipes, and troughs need you to subtract a base (or both): an open can is B + Ph, an open-ended pipe is just Ph.`, kind: 'edge-case' },
    { content: `"Filled to a depth of 10 in" means h = 10, not the tank's height. Use the water level, not the container, whenever the question asks for volume of liquid.`, kind: 'edge-case' },
    { content: `Scaling: multiply every dimension by k → surface area × k², volume × k³. Don't multiply volume by k. Also convert mixed units BEFORE substituting, and remember 1 cm³ = 1 mL.`, kind: 'tip' },
  ],
};
