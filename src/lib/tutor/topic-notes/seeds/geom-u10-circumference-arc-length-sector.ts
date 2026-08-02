/**
 * Geometry — Unit 10 CED 10.2: Circumference, Arc Length & Sector Area.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.circumference-arc-length-sector.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U10_CIRCUMFERENCE_ARC_LENGTH_SECTOR: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.circumference-arc-length-sector.v1',
  course: 'Geometry',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Circumference, Arc Length & Sector Area',
  planId: 'evelyn.hs.geom.circumference-arc-length-sector.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.circumference-arc-length-sector.v1' }],
  theory: [
    { loId: 'geom.circumference-arc-length-sector', kind: 'framework', title: 'The two whole-circle formulas', content: `THE TWO WHOLE-CIRCLE FORMULAS — circumference C = 2πr = πd (a length, measured in cm, ft, m) and area A = πr² (a region, measured in cm², ft², m²). π is the constant ratio of circumference to diameter, the same number for every circle in the world.` },
    { loId: 'geom.circumference-arc-length-sector', content: `THE ONE BIG IDEA: FRACTION OF 360 — a central angle (vertex at the center) of θ° cuts off θ/360 of the entire circle. So arc length = (θ/360) × 2πr and sector area = (θ/360) × πr². A 90° angle takes a quarter; a 60° angle takes a sixth. Learn the fraction, not four separate formulas.` },
    { loId: 'geom.circumference-arc-length-sector', content: `ARC MEASURE ≠ ARC LENGTH — the MEASURE of an arc is its central angle, reported in degrees, and it does not depend on how big the circle is. The LENGTH of an arc is a distance, reported in units, and it grows with the radius. A 60° arc in a radius-5 circle and a 60° arc in a radius-15 circle have the SAME measure and three times different lengths.` },
    { loId: 'geom.circumference-arc-length-sector', content: `TRAP: DIAMETER FED IN AS RADIUS — problems love to hand you the diameter ("a 20-foot circular garden"). Halve it first. Using d in place of r doubles a length answer and QUADRUPLES an area answer.` },
    { loId: 'geom.circumference-arc-length-sector', content: `TRAP: WRONG FORMULA, WRONG UNITS — arc length is linear in r, sector area uses r². If your arc answer carries square units, or your sector answer carries plain units, you grabbed the wrong formula. Units are a free error check on every problem.` },
    { loId: 'geom.circumference-arc-length-sector', kind: 'framework', title: 'Exact vs approximate', content: `EXACT VS APPROXIMATE — leave the answer in terms of π (like 2π cm) unless the problem asks for a decimal; only then substitute π ≈ 3.14. Rounding early and then multiplying spreads the rounding error through the whole answer.` },
    { loId: 'geom.circumference-arc-length-sector', kind: 'framework', title: 'Why the ratio matters', content: `WHY THE RATIO MATTERS — for a fixed central angle, arc length divided by radius is the SAME number in every circle. That constant ratio is exactly what radian measure names later, and it is the reason similar circular shapes scale so cleanly.` },
    { loId: 'geom.circumference-arc-length-sector', kind: 'definition', title: 'arc length', content: `the distance along a circle between the two endpoints of an arc — a length in units, not a degree measure.` },
    { loId: 'geom.circumference-arc-length-sector', kind: 'definition', title: 'sector', content: `the "pie slice" region of a circle bounded by two radii and the arc between them.` },
  ],
  methods: [
    {
      title: 'Worked arc and sector',
      steps: [
        `Find the fraction of the circle: the central angle is 40°, so the piece is 40/360 = 1/9 of the whole circle.`,
        'Whole circumference: C = 2πr = 2π(9) = 18π cm. Arc length = (1/9) × 18π = 2π cm.',
        'Whole area: A = πr² = π(9²) = 81π cm². Sector area = (1/9) × 81π = 9π cm².',
        `Check the units: the arc came out in cm (a length) and the sector in cm² (a region). ✓ Note the arc MEASURE is 40°, while the arc LENGTH is 2π cm — two different quantities.`,
      ],
      example: { problem: `A circle has center O and radius 9 cm. Points A and B lie on the circle so that central angle ∠AOB measures 40°. Find the length of arc AB and the area of sector AOB, in exact form.`, solution: 'Arc AB = 2π cm; sector AOB = 9π cm²' },
      relatedLoIds: ['geom.circumference-arc-length-sector'],
    },
    {
      title: 'Worked diameter trap',
      steps: [
        `Read the given quantity carefully: 20 ft is the DIAMETER, not the radius. The radius is r = 20/2 = 10 ft.`,
        `The student substituted the diameter into A = πr², squaring 20 instead of 10 — and since 20² = 400 is four times 10² = 100, the answer came out 4 times too big.`,
        `Correct fraction and area: 90/360 = 1/4, and the whole circle is π(10²) = 100π ft². Sector area = (1/4) × 100π = 25π ft².`,
        `Bonus check on the wet edge: arc length = (1/4) × 2π(10) = (1/4) × 20π = 5π ft. Squaring a diameter is the single most expensive slip in circle problems — halve first, always.`,
      ],
      example: { problem: `A circular garden has a diameter of 20 ft. A sprinkler at the center sweeps a 90° sector. A student computes the watered area as (90/360) × π × 20² = 100π ft². Find the correct area and explain the error.`, solution: '25π ft² — the student used the diameter 20 as the radius, quadrupling the area' },
      relatedLoIds: ['geom.circumference-arc-length-sector'],
    },
  ],
  pointers: [
    { content: `The arc measure is 80°; the arc LENGTH is a distance that depends on the radius: (80/360) × 2π(9) = (2/9) × 18π = 4π units. Degrees tell you what fraction of the circle you have — you still have to multiply that fraction by the circumference to get a length.`, kind: 'common-error' },
    { content: `Whole circle: C = 2πr = πd (a length) and A = πr² (a region) — check units to confirm which one you needed.`, kind: 'tip' },
    { content: `A central angle of θ° claims θ/360 of the circle: arc length = (θ/360) × 2πr, sector area = (θ/360) × πr².`, kind: 'tip' },
    { content: `Arc measure is degrees and ignores the radius; arc length is a distance and grows with the radius — never report one for the other.`, kind: 'tip' },
    { content: `If the problem gives a diameter, halve it first — using d for r doubles a length and quadruples an area.`, kind: 'tip' },
    { content: `Leave π in the answer unless a decimal is requested; the same fraction idea runs backward to solve for θ or r.`, kind: 'tip' },
    { content: `Never report degrees as a length. "Arc AB = 80°" is a MEASURE; "arc AB = 4π cm" is a LENGTH. If a problem says "find the length of arc AB" and your answer has a degree symbol, you stopped one step early — multiply the fraction θ/360 by the circumference.`, kind: 'common-error' },
    { content: `Underline the word *diameter* the moment you see it, then write r = d/2 before touching a formula. Feeding d into 2πr doubles a length; feeding d into πr² quadruples an area (20² = 400 vs 10² = 100).`, kind: 'gotcha' },
    { content: `Use units as a free error check: arc length ends in cm, in, ft (linear); sector area ends in cm², in², ft² (squared). Square units on an arc answer or plain units on a sector answer means you grabbed the wrong whole-circle formula.`, kind: 'tip' },
    { content: `The angle must be a CENTRAL angle — vertex at the center, sides are radii — for θ/360 to work. An angle with its vertex on the circle or inside/outside it does not cut off θ/360 of the circle, so don't plug it in.`, kind: 'edge-case' },
    { content: `Don't reduce θ/360 sloppily and don't round π early. Keep exact form: (40/360)(18π) = 2π cm. Substituting 3.14 first, then multiplying, spreads rounding error — only decimalize if the problem asks for a decimal.`, kind: 'tip' },
    { content: `Sector ≠ arc. A *sector* is the pie-slice REGION bounded by two radii and the arc (area). An *arc* is just the curved edge (length). If a problem asks for the watered ground, that's the sector; the wet outer edge is the arc.`, kind: 'vocab-note' },
    { content: `Same central angle, different circles: the arc MEASURES are equal (60° = 60°) but the LENGTHS scale with r. Tripling the radius triples arc length and multiplies sector area by 9 — length is linear in r, area is quadratic.`, kind: 'gotcha' },
    { content: `Run the fraction backward when θ is unknown: (arc length)/(circumference) = θ/360. With arc 20 cm and C = 72 cm, θ = (20/72)(360) = 100°. Don't hunt for a new formula — solve the same proportion for the missing piece.`, kind: 'tip' },
  ],
};
