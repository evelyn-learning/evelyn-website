/**
 * Digital SAT — Unit 4 CED 4.1: Area & Volume.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.area-volume.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U4_AREA_VOLUME: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.area-volume.v1',
  course: 'Digital SAT',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Area & Volume',
  planId: 'evelyn.testprep.dsat.area-volume.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.area-volume.v1' }],
  theory: [
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Reference sheet', content: `REFERENCE SHEET — every digital SAT math section opens with a formula sheet: rectangle area A = lw, triangle area A = (1/2)bh, circle area A = πr² and circumference C = 2πr, plus volumes for a rectangular prism V = lwh, cylinder V = πr²h, sphere V = (4/3)πr³, and cone V = (1/3)πr²h, and the 30-60-90 / 45-45-90 special right-triangle ratios. You do not memorize these — you recognize which one a question needs.` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Composite figures', content: `COMPOSITE FIGURES — many questions describe a shape built from two or more basic pieces (a rectangle with a semicircle on top, a cylinder with a cone drilled out). Break it into named pieces, apply the sheet formula to each, then ADD or SUBTRACT.` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Units', content: `UNITS — area is in squared units, volume in cubed units. If dimensions are given in mixed units (feet and inches), convert to one unit BEFORE plugging into a formula.` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'The scale-factor trap', content: `THE SCALE-FACTOR TRAP — when every linear dimension of a figure is multiplied by a scale factor k, AREA is multiplied by k², and VOLUME is multiplied by k³. It is NOT multiplied by k. Double a radius (k = 2): area × 4, volume × 8. Triple a side (k = 3): area × 9, volume × 27.` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Spotting the trap', content: `SPOTTING THE TRAP — the giveaway is wording like "similar," "scaled by a factor of," or "every dimension multiplied by," instead of two sets of raw numbers. That phrasing means apply kⁿ directly — you almost never need the original dimensions, only the original area/volume and k.` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Working backwards', content: `WORKING BACKWARDS — if a question gives the old and new area or volume and asks for the scale factor, solve kⁿ = (new ÷ old), then take the nth root (square root for area, cube root for volume).` },
    { loId: 'dsat.area-volume', kind: 'framework', title: 'Desmos', content: `DESMOS — the calculator is available on every math question. For a direct plug-in problem, just compute both values. For a scale-factor problem with no raw dimensions given, Desmos cannot save you — the kⁿ relationship is the only path.` },
    { loId: 'dsat.area-volume', kind: 'definition', title: 'scale factor', content: `the ratio k by which every linear dimension of a figure is multiplied to produce a similar figure.` },
    { loId: 'dsat.area-volume', kind: 'definition', title: 'similar figures', content: `figures with the same shape — corresponding angles equal, corresponding linear dimensions in a constant ratio k.` },
  ],
  methods: [
    {
      title: 'Worked composite',
      steps: [
        'Split into two named pieces: the rectangle and the semicircle.',
        'Rectangle area: 4 × 6 = 24 square feet.',
        `Semicircle: diameter = 4, so radius = 2. Full circle area = π(2)² = 4π; a semicircle is half of that = 2π square feet.`,
        'Total area = 24 + 2π square feet.',
      ],
      example: { problem: `A window is a rectangle 4 feet wide and 6 feet tall, topped by a semicircle whose diameter equals the rectangle's width. Find the total area of the window, in terms of π.`, solution: '(24 + 2π) square feet' },
      relatedLoIds: ['dsat.area-volume'],
    },
    {
      title: 'Worked scale factor',
      steps: [
        `This is a scale-factor question, not a plug-in-the-formula question — no radius is given, and none is needed.`,
        `Volume scales by k³ for a linear scale factor k. Here k = 2, so volume is multiplied by 2³ = 8.`,
        `New volume = 36π × 8 = 288π cubic inches. (A student who doubles 36π to 72π has fallen for the trap — that treats volume as if it scaled linearly.)`,
      ],
      example: { problem: `A sphere has volume 36π cubic inches. A second sphere is similar to the first, with every linear dimension scaled by a factor of 2. What is the volume of the second sphere?`, solution: '288π cubic inches' },
      relatedLoIds: ['dsat.area-volume'],
    },
  ],
  pointers: [
    { content: `The scale factor is k = 8/4 = 2, but volume scales by k³ = 8, not by k. The second sphere's volume is 8V, not 2V. (Direct check: V = (4/3)πr³, so doubling r multiplies V by 2³ = 8.)`, kind: 'common-error' },
    { content: `Every reference-sheet formula (rectangle, triangle, circle areas; prism, cylinder, sphere, cone volumes) is given — know when to reach for each, not how to derive it.`, kind: 'tip' },
    { content: 'Composite figures: break into named pieces, then add or subtract areas/volumes.', kind: 'tip' },
    { content: `SCALE FACTOR: if every linear dimension scales by k, area scales by k² and volume scales by k³ — never by k itself.`, kind: 'tip' },
    { content: `Watch for "similar," "scaled by," or "dimensions multiplied by" language — that's the signal to apply kⁿ directly instead of recomputing from raw dimensions.`, kind: 'tip' },
    { content: `Diameter vs. radius is the #1 silent error here. Circle/sphere/cylinder problems often hand you a diameter ("a can 10 inches across"), and every wrong answer choice is built from plugging 10 in for r. Halve it first, then square or cube.`, kind: 'common-error' },
    { content: `Only one dimension changed? Then k-squared/k-cubed does NOT apply. "The height of a cylinder is doubled" multiplies volume by 2 (height is a linear factor in V = πr²h); "the radius is doubled" multiplies it by 4. Reserve k³ for *every* dimension scaling.`, kind: 'gotcha' },
    { content: `"Similar," "scaled by a factor of," and "each dimension multiplied by" mean k-power. "Twice as large" or "the volume is doubled" describes the *result*, not a linear scale factor. Read which quantity the sentence is scaling — the side or the volume.`, kind: 'vocab-note' },
    { content: `Working backwards: area ratio 25 means k = 5, volume ratio 64 means k = 4. Take the root, don't divide. And if asked for the *new side length*, multiply the old side by k — not by the area ratio.`, kind: 'edge-case' },
    { content: `Composite "shaded region" problems: the answer is big shape minus hole, and the hole's area often needs a radius you must derive from the outer shape (e.g., circle inscribed in a square of side 8 → r = 4). Label that hidden dimension before computing.`, kind: 'tip' },
    { content: `Mixed units are a trap, not a typo. "A tank 3 feet long and 18 inches wide" needs one unit BEFORE multiplying — and if the answer is requested in cubic feet after you worked in inches, divide by 1728, not 12.`, kind: 'common-error' },
    { content: `"In terms of π" means leave π symbolic: 36 + 2π, not 30.28. If you decimal-approximate in Desmos and the choices are all in π-form, you'll have to reverse-engineer. Check the answer format before you hit enter.`, kind: 'tip' },
    { content: `Half a cone/sphere/cylinder: apply the full formula, THEN halve. A hemisphere is (1/2)(4/3)πr³ = (2/3)πr³ — not (4/3)π(r/2)³. Never shrink the radius to represent "half the solid."`, kind: 'edge-case' },
  ],
};
