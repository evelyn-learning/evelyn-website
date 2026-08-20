/**
 * Grade 7 Math — Unit 8 CED 8.4: Volume of Prisms & Composite Solids.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.volume-of-prisms-and-composite-solids.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U8_VOLUME_OF_PRISMS_AND_COMPOSITE_SOLIDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.volume-of-prisms-and-composite-solids.v1',
  course: 'Grade 7 Math',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Volume of Prisms & Composite Solids',
  planId: 'evelyn.ms.m7math.volume-of-prisms-and-composite-solids.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.volume-of-prisms-and-composite-solids.v1' }],
  theory: [
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'Volume counts cubes', content: `VOLUME COUNTS CUBES — volume is how many unit cubes fit inside a solid, so every volume answer ends in cubic units: cm³, m³, in³. Surface area wraps the outside and stays in square units. Same solid, two completely different questions, and the units are how you tell your reader which one you answered. A volume answer written in cm² is wrong even when the number is right.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'One formula for every prism', content: `ONE FORMULA FOR EVERY PRISM — V = Bh. The capital B is the AREA OF THE BASE, and the little h is how far the solid stretches from one base to the other. Fill the base with a single layer of cubes, then stack h of those layers. That is the whole idea, and it does not care whether the base is a rectangle, a triangle or a hexagon.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'Finding b is the real work', content: `FINDING B IS THE REAL WORK — the base is one of the two identical parallel faces. Work out its area with whatever 2-D formula fits: a rectangle base is l × w, a triangle base is ½bh, and so on. B is an AREA, so write it with square units, and it becomes cubic units only after you multiply by the height.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'A rectangular prism is the familiar case', content: `A RECTANGULAR PRISM IS THE FAMILIAR CASE — with a rectangle base, V = Bh becomes length × width × height. That is not a separate rule to memorize. It is V = Bh with B = l × w already multiplied out.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'The height is perpendicular, and it may lie on its side', content: `THE HEIGHT IS PERPENDICULAR, AND IT MAY LIE ON ITS SIDE — h is the straight-across distance between the two bases, never a slanted edge. For a triangular prism lying down like a tent, the two triangles are the ends, so B is the triangle area and h is how LONG the tent is. Do not be fooled because that measurement runs sideways.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'framework', title: 'Composite solids get chopped up', content: `COMPOSITE SOLIDS GET CHOPPED UP — a solid built from more than one prism has no formula of its own. Slice it into ordinary prisms, find V = Bh for each piece, and add the results. If a chunk has been hollowed out instead, find the whole solid and subtract the missing chunk. Keep the units on every line so the pieces add up honestly.` },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'definition', title: 'volume', content: 'the amount of space a solid holds, measured in cubic units such as cm³.' },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'definition', title: 'prism', content: 'a solid with two identical parallel bases joined by flat sides.' },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'definition', title: 'base area (B)', content: 'the area of one of the two identical parallel faces, written in square units.' },
    { loId: 'm7math.volume-of-prisms-and-composite-solids', kind: 'definition', title: 'composite solid', content: `a solid made by joining simpler solids together, or by cutting a piece out of one.` },
  ],
  methods: [
    {
      title: 'Worked triangular prism',
      steps: [
        `Find the two identical parallel faces. They are the triangles at the front and the back of the tent, so the triangle is the base and B is its area.`,
        `Compute B with the triangle formula: B = ½ × 6 × 4 = 12 ft². Square feet, because B is an area.`,
        `Now find h, the distance between those two triangles. That is the length of the tent, 10 ft. It runs sideways, and that is fine — h just has to be perpendicular to the base, not pointing at the sky.`,
        'Apply V = Bh: V = 12 × 10 = 120.',
        'Attach the units. An area in ft² times a length in ft gives ft³, so V = 120 ft³.',
        `WRONG answer to avoid: 6 × 4 × 10 = 240 ft³, which comes from skipping the ½ and treating the tent as a box. RIGHT answer: 120 ft³, exactly half of the box, because the end is a triangle and not a rectangle.`,
      ],
      example: { problem: `A camping tent is a triangular prism. Its triangular end has a base of 6 ft and a height of 4 ft, and the tent is 10 ft long. How much air is inside?`, solution: '120 ft³' },
      relatedLoIds: ['m7math.volume-of-prisms-and-composite-solids'],
    },
    {
      title: 'Worked composite step block',
      steps: [
        `There is no stair formula, so break the solid into pieces that ARE prisms. Two rectangular prisms, one on top of the other.`,
        `Bottom block first. Its base is the 10 cm by 4 cm rectangle, so B = 10 × 4 = 40 cm². Its height is 3 cm.`,
        'V of the bottom block = Bh = 40 × 3 = 120 cm³.',
        `Top block next. Its base is 4 cm by 4 cm, so B = 4 × 4 = 16 cm². Its height is 5 cm.`,
        'V of the top block = Bh = 16 × 5 = 80 cm³.',
        `Add the pieces: 120 + 80 = 200 cm³. Both pieces were already in cubic centimeters, so they add directly. If one piece had been hollowed OUT of the other instead of stacked on top, the only change would be subtracting instead of adding.`,
      ],
      example: { problem: `A concrete step is made of two rectangular blocks stacked to look like a stair. The bottom block is 10 cm by 4 cm on the ground and 3 cm tall. The top block sits on it and is 4 cm by 4 cm on the bottom and 5 cm tall. Find the total volume.`, solution: '200 cm³' },
      relatedLoIds: ['m7math.volume-of-prisms-and-composite-solids'],
    },
  ],
  pointers: [
    { content: `Students often say "94 cm²" — Surface area wraps the outside; volume fills the inside. This problem asked how much fits in, so use V = Bh: the base is 5 × 4 = 20 cm², and the height is 3 cm, giving V = 20 × 3 = 60 cm³. The units are the giveaway — 94 cm² is measured in squares, and volume is never measured in squares. When an answer comes out in cm² but the question said volume, you have solved the wrong problem.`, kind: 'common-error' },
    { content: `Students often say "60 cm²" — The number 60 is correct, but three lengths were multiplied together, so the units multiply too: cm × cm × cm = cm³. The answer is 60 cm³. Area comes from two lengths and gets square units; volume comes from three and gets cubic units. Carry the units through the multiplication and they will label themselves.`, kind: 'common-error' },
    { content: `Volume fills a solid and is measured in cubic units such as cm³ or ft³; surface area wraps it and stays in square units.`, kind: 'tip' },
    { content: `One formula covers every prism: V = Bh, where B is the area of the base and h is the distance between the two bases.`, kind: 'tip' },
    { content: `Find B with the right 2-D formula first — l × w for a rectangle base, ½bh for a triangle base — and write it in square units.`, kind: 'tip' },
    { content: `For a rectangular prism V = Bh is just length × width × height, and h may run sideways, as with the length of a tent.`, kind: 'tip' },
    { content: `For a composite solid, chop it into prisms, find V = Bh for each piece, then add — or subtract a piece that was hollowed out.`, kind: 'tip' },
    { content: `Volume answers end in **cubic** units (cm³, ft³, in³). If you wrote cm² on a volume answer, it's marked wrong even if the number is right — three lengths multiplied means three little cm's, so cm × cm × cm = cm³.`, kind: 'common-error' },
    { content: `Two different letters, both called 'base': capital **B** is the AREA of the whole base face (square units), lowercase **b** is just the bottom LENGTH of a triangle. In ½bh you use little b; in V = Bh you use big B.`, kind: 'vocab-note' },
    { content: `For a triangular prism, don't forget the ½. A tent 6 ft by 4 ft by 10 ft is 120 ft³, not 240 ft³. Quick check: a triangular prism is always exactly half the box it fits inside.`, kind: 'common-error' },
    { content: `h doesn't have to point up. For a tent lying down, the two triangles are the ends, so h is how LONG the tent is. Find the two identical parallel faces FIRST, then h is the distance between them — no matter which way that runs.`, kind: 'gotcha' },
    { content: `Never use a slanted edge as h. The height is the straight-across, perpendicular distance between the two bases. A diagram may show a longer slant measurement just to trick you.`, kind: 'edge-case' },
    { content: `Before you compute, reread the question: 'how much fits inside / holds / air / water' means volume. 'How much wrapping paper / paint' means surface area. Right arithmetic on the wrong question earns nothing.`, kind: 'tip' },
    { content: `In a composite solid, each piece has its OWN base and its OWN height. Recompute B for every block — don't reuse the bottom block's base area for the top one.`, kind: 'common-error' },
    { content: `Adding pieces? Both must be in the same cubic unit. And read carefully: a chunk stacked ON goes with **+**, a chunk cut OUT (a hole, a notch) goes with **−**. Sketch the solid and label each piece + or − before you add.`, kind: 'edge-case' },
  ],
};
