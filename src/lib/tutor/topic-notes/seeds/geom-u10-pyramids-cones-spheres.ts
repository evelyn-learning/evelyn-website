/**
 * Geometry — Unit 10 CED 10.4: Volume: Pyramids, Cones & Spheres.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.pyramids-cones-spheres.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U10_PYRAMIDS_CONES_SPHERES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.pyramids-cones-spheres.v1',
  course: 'Geometry',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Volume: Pyramids, Cones & Spheres',
  planId: 'evelyn.hs.geom.pyramids-cones-spheres.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.pyramids-cones-spheres.v1' }],
  theory: [
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'The one-third pattern', content: `THE ONE-THIRD PATTERN — a pyramid is one third of the prism sharing its base and height: V = (1/3)Bh. A cone is one third of the matching cylinder: V = (1/3)πr²h. Same idea, round base. If you know the prism or cylinder volume, just divide by 3.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'B is the area of the base', content: `B IS THE AREA OF THE BASE — B is whatever the base shape happens to be: a square base of side s gives B = s², a triangular base gives B = (1/2)bh of that triangle, a circular base gives B = πr². Compute B FIRST as its own number, then multiply by h and by 1/3.` },
    { loId: 'geom.pyramids-cones-spheres', content: `h IS PERPENDICULAR, NEVER SLANT — the height h runs from the apex straight down, perpendicular to the base plane. The SLANT height ℓ runs along a lateral face or edge and is always LONGER. Substituting ℓ for h is the single most common volume error.` },
    { loId: 'geom.pyramids-cones-spheres', content: `RECOVERING h FROM SLANT HEIGHT — in a right cone the radius, the height, and the slant height form a right triangle with ℓ as the hypotenuse: r² + h² = ℓ². So h = √(ℓ² - r²). For a right pyramid, the leg is the distance from the base center to the midpoint of a base edge (the apothem).` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'Sphere', content: `SPHERE — V = (4/3)πr³, the odd one out with no base and no height, only a radius. A HEMISPHERE (a dome) is exactly half: V = (2/3)πr³.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'Radius, not diameter', content: `RADIUS, NOT DIAMETER — problems hand you diameters on purpose. Halve it before it touches a formula. In a sphere the radius is cubed, so using d instead of r inflates the answer by a factor of 2³ = 8.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'Exact versus decimal', content: `EXACT VERSUS DECIMAL — leave answers "in terms of π" (36π) when asked; only multiply by 3.14 or the calculator π when a decimal is requested. Volume always carries CUBIC units: cm³, ft³, m³.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'framework', title: 'Scaling and oblique solids', content: `SCALING AND OBLIQUE SOLIDS — multiply every linear dimension by k and the volume multiplies by k³, not by k. And by Cavalieri's principle, a leaning (oblique) cone or pyramid has the SAME volume as the upright one with the same base and perpendicular height — tilt does not change the formula.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'definition', title: 'slant height', content: `the distance from the apex measured along a lateral face or edge — always longer than the perpendicular height, and never used in a volume formula.` },
    { loId: 'geom.pyramids-cones-spheres', kind: 'definition', title: 'apex', content: `the single point where the lateral faces of a pyramid or the curved surface of a cone meet.` },
  ],
  methods: [
    {
      title: 'Worked square pyramid',
      steps: [
        'Choose the formula: pyramid → V = (1/3)Bh, where B is the area of the base.',
        `Compute B on its own: the base is a square of side 9, so B = 9² = 81 square meters.`,
        `The height given is the perpendicular distance from the apex down to the base — exactly the h the formula wants. h = 12.`,
        'Substitute: V = (1/3)(81)(12) = (1/3)(972) = 324.',
        `Sanity check against the matching prism: a 9-by-9-by-12 box would hold 972 m³, and the pyramid is one third of that. ✓ Volume = 324 m³.`,
      ],
      example: { problem: `A monument is a right square pyramid. Its square base has side length 9 meters, and the apex sits 12 meters above the center of the base. Find its volume.`, solution: '324 m³' },
      relatedLoIds: ['geom.pyramids-cones-spheres'],
    },
    {
      title: 'Worked slant height trap',
      steps: [
        `Name what was given: 10 cm measured along the outside surface is the SLANT height ℓ, not the perpendicular height h. The student plugged ℓ straight into the formula.`,
        `Build the right triangle inside the cone: the radius r = 6 (base), the height h (from apex perpendicular to the base center), and the slant height ℓ = 10 as the hypotenuse. So r² + h² = ℓ².`,
        `Solve for h: 6² + h² = 10² → 36 + h² = 100 → h² = 64 → h = 8 cm. (This is the 6-8-10 Pythagorean triple.)`,
        `Now use the cone formula with the perpendicular height: V = (1/3)π(6²)(8) = (1/3)π(36)(8) = (1/3)(288π) = 96π cm³.`,
        `The student's 120π is too big, and it always will be — the slant height is the hypotenuse, so ℓ > h for every cone.`,
      ],
      example: { problem: `A paper cone has a base radius of 6 cm, and the distance from the apex down along the outside of the cone to the rim is 10 cm. A student writes V = (1/3)π(6²)(10) = 120π cm³. Find the correct volume and explain the error.`, solution: `96π cm³ — the 10 cm was the slant height, so the true height is √(10² - 6²) = 8 cm` },
      relatedLoIds: ['geom.pyramids-cones-spheres'],
    },
  ],
  pointers: [
    { content: `The formula needs r, so halve the diameter first: r = 12/2 = 6. Then V = (4/3)π(6³) = (4/3)π(216) = 288π cubic feet. Because the radius is CUBED, using d for r inflates the answer by 2³ = 8 — and 2304π is exactly 8 × 288π. Circle the word "diameter" the moment you read it and write r = d/2 before touching the formula.`, kind: 'common-error' },
    { content: `Pointy solids are one third of their match: pyramid V = (1/3)Bh, cone V = (1/3)πr²h — compute the base area B first.`, kind: 'tip' },
    { content: 'Sphere V = (4/3)πr³; a hemisphere is half of that, (2/3)πr³.', kind: 'tip' },
    { content: `h is the PERPENDICULAR height. Given the slant height ℓ, recover it with h = √(ℓ² - r²) before using any volume formula.`, kind: 'tip' },
    { content: `Halve every diameter before it enters a formula — in a sphere that mistake multiplies the answer by 8.`, kind: 'tip' },
    { content: `Volume is always in cubic units, and scaling every dimension by k multiplies volume by k³.`, kind: 'tip' },
    { content: `Slant height ℓ never enters a volume formula. If a problem says "along the surface," "to the rim," or "up the face," that's ℓ — convert first: h = √(ℓ² − r²). Since ℓ is the hypotenuse, plugging ℓ in always makes your volume too big.`, kind: 'common-error' },
    { content: `Circle the word **diameter** the instant you read it and write r = d/2 before touching anything. In a sphere r is cubed, so using d gives an answer 8× too large — not 2×.`, kind: 'gotcha' },
    { content: `In V = (1/3)Bh, B is an AREA, not a side length. Compute B as its own number first: square base of side 9 → B = 81, triangular base → B = (1/2)bh, circular base → B = πr². Writing (1/3)(9)(12) instead of (1/3)(81)(12) is a classic slip.`, kind: 'vocab-note' },
    { content: `For a right *pyramid*, the leg paired with the slant height is the apothem (center of base to the MIDPOINT of a base edge), not half the diagonal. Half the diagonal pairs with the lateral *edge* length instead. Read which segment you were given.`, kind: 'edge-case' },
    { content: `A leaning (oblique) cone or pyramid uses the exact same formula — Cavalieri's principle. Don't hunt for a different formula or use the slanted axis; you still need the perpendicular height from apex to base plane.`, kind: 'edge-case' },
    { content: `A sphere has no h. If you find yourself looking for a height in (4/3)πr³, stop — radius is the only input. A hemisphere is (2/3)πr³, i.e. half the sphere, NOT (1/3) of anything.`, kind: 'gotcha' },
    { content: `Working backward from a given volume? Don't drop the 1/3. From 96 = (1/3)(36)h you get h = 8, but 96 = 36h gives 2.67. Multiply both sides by 3 as your first move.`, kind: 'common-error' },
    { content: `Label answers in cubic units (cm³, ft³) and keep π symbolic unless a decimal is requested — 36π is a finished exact answer, not an unsimplified one. Area units (cm²) on a volume answer is an automatic red flag.`, kind: 'tip' },
  ],
};
