/**
 * Geometry — Unit 9 CED 9.1: Circles: Radii, Chords & Arcs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.circle-basics-arcs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U9_CIRCLE_BASICS_ARCS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.circle-basics-arcs.v1',
  course: 'Geometry',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Circles: Radii, Chords & Arcs',
  planId: 'evelyn.hs.geom.circle-basics-arcs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.circle-basics-arcs.v1' }],
  theory: [
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'The defining rule', content: `THE DEFINING RULE — a circle is every point a fixed distance (the RADIUS) from the CENTER, and it is named by its center: circle O. So every radius is congruent: OA ≅ OB ≅ OC, always. Two radii drawn to the same chord therefore build an ISOSCELES triangle for free — that is the most-missed given in the whole unit.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'The segments and lines', content: `THE SEGMENTS AND LINES — CHORD: a segment with both endpoints on the circle. DIAMETER: a chord through the center, d = 2r, and the longest chord there is. SECANT: a line that cuts the circle at two points. TANGENT: a line touching the circle at exactly one point.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'Arcs come in three sizes', content: `ARCS COME IN THREE SIZES — a MINOR arc is less than 180° and is named with 2 letters (arc AB); a MAJOR arc is more than 180° and MUST be named with 3 letters (arc ACB, where C is a point on the long way around); a SEMICIRCLE is exactly 180°, its endpoints being the ends of a diameter. Naming a major arc with only two letters is the classic slip — arc AB always means the short way.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'Arc measure comes from the central angle', content: `ARC MEASURE COMES FROM THE CENTRAL ANGLE — a CENTRAL ANGLE has its vertex at the center, and the minor arc it cuts off has the same measure as the angle. Then major arc = 360° − minor arc, and all the arcs around a full circle add to 360°. ARC ADDITION: arcs that share an endpoint add, so arc AB + arc BC = arc ABC.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'Measure is not length', content: `MEASURE IS NOT LENGTH — arc measure is in DEGREES and ignores the size of the circle; arc length is in UNITS and grows with the radius. A 60° arc on a bike wheel and a 60° arc on a stadium track have the same measure and wildly different lengths. That is also why congruent arcs must have equal measure AND live in the same circle (or in congruent circles).` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'The perpendicular-from-the-center theorem', content: `THE PERPENDICULAR-FROM-THE-CENTER THEOREM — a radius or diameter that is PERPENDICULAR to a chord bisects that chord and its arc. Running it backwards: the perpendicular bisector of any chord passes through the center. The word perpendicular does all the work — a random segment from the center to a chord bisects nothing.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'Equal chords sit at equal distances', content: `EQUAL CHORDS SIT AT EQUAL DISTANCES — in one circle, two chords are congruent exactly when they are the same distance from the center (distance meaning the PERPENDICULAR distance). So the closer a chord is to the center, the longer it is, and the diameter — distance 0 — is the longest of all.` },
    { loId: 'geom.circle-basics-arcs', kind: 'framework', title: 'The workhorse right triangle', content: `THE WORKHORSE RIGHT TRIANGLE — drop the perpendicular from the center to a chord and a right triangle appears: the radius is the HYPOTENUSE, the center-to-chord distance is one leg, and HALF the chord is the other leg, so r² = (distance)² + (half-chord)². The classic error is feeding the FULL chord into that leg; the second classic error is stopping at the half-chord instead of doubling back to the whole chord.` },
    { loId: 'geom.circle-basics-arcs', kind: 'definition', title: 'chord', content: `a segment whose two endpoints both lie on the circle; a diameter is the special chord that passes through the center.` },
    { loId: 'geom.circle-basics-arcs', kind: 'definition', title: 'arc measure', content: `the size of an arc in degrees, equal to its central angle — a property of the angle, not of how long the arc physically is.` },
  ],
  methods: [
    {
      title: 'Worked chord distance',
      steps: [
        `Draw the radius OA. Every radius of circle O is 13, so OA = 13 — that is the hypotenuse of the triangle we are about to use.`,
        `Because OM ⊥ AB, triangle OMA has a right angle at M, with legs OM = 5 and AM, and hypotenuse OA = 13.`,
        `Apply the Pythagorean Theorem: 5² + AM² = 13², so AM² = 169 − 25 = 144 and AM = 12. (It is the 5-12-13 triple.)`,
        `AM is only HALF the chord: the perpendicular from the center bisects AB, so M is the midpoint. Double it: AB = 2(12) = 24.`,
      ],
      example: { problem: `Circle O has radius 13. Chord AB is drawn, and OM is the segment from center O to point M on AB with OM ⊥ AB and OM = 5. Find the length of AB.`, solution: 'AB = 24' },
      relatedLoIds: ['geom.circle-basics-arcs'],
    },
    {
      title: 'Worked measure vs length',
      steps: [
        `Check the measures first: a minor arc equals its central angle, so both arcs measure 60°. That part of the claim is true.`,
        `Now compare the actual lengths. In circle P the arc is 60/360 = 1/6 of the circumference: (1/6)(2π · 3) = π ≈ 3.1 units.`,
        `In circle Q the same fraction gives (1/6)(2π · 12) = 4π ≈ 12.6 units — four times as long, exactly the ratio of the radii.`,
        `Congruent arcs must match in measure AND sit in the same circle or in congruent circles. These circles are not congruent, so the arcs have equal MEASURE but are not congruent arcs.`,
      ],
      example: { problem: `Circle P has radius 3 and circle Q has radius 12. Each has a 60° central angle cutting off an arc. A classmate says "both arcs are 60°, so the two arcs are congruent." Is that right?`, solution: `No — both arcs measure 60°, but their lengths are π and 4π, so they are not congruent arcs.` },
      relatedLoIds: ['geom.circle-basics-arcs'],
    },
  ],
  pointers: [
    { content: `Only a segment from the center that is PERPENDICULAR to the chord bisects it. A slanted OM lands off-center and splits AB into two unequal pieces. Before splitting a chord in half — or building the r² = (distance)² + (half-chord)² right triangle — confirm the ⊥ mark is actually given.`, kind: 'common-error' },
    { content: `Every radius of a circle is congruent — that free given turns two radii into an isosceles triangle, and d = 2r.`, kind: 'tip' },
    { content: `Minor arc = its central angle, major arc = 360° − minor, and a major arc needs three letters; adjacent arcs add.`, kind: 'tip' },
    { content: `Arc MEASURE is degrees and size-blind; arc LENGTH is units and grows with the radius. Congruent arcs need equal measure in the same or congruent circles.`, kind: 'tip' },
    { content: `A radius perpendicular to a chord bisects the chord and its arc — and the perpendicular bisector of a chord runs through the center.`, kind: 'tip' },
    { content: `Chord right triangle: r² = (center-to-chord distance)² + (half the chord)². Remember to double the half-chord back to the full chord.`, kind: 'tip' },
    { content: `Write major arcs with **three** letters. "Arc AB" always means the minor (short-way) arc, so a 250° arc must be written arc ACB with a point C on the long way around. Two letters on a reflex arc is the classic slip.`, kind: 'vocab-note' },
    { content: `No ⊥ mark, no bisecting. A segment from the center only cuts a chord in half if it's perpendicular to it. Check for the right-angle mark (or a stated perpendicular) *before* you halve a chord or build the right triangle.`, kind: 'common-error' },
    { content: `In r² = d² + (half-chord)², the leg is HALF the chord — and your final answer usually needs the WHOLE chord. Chord 8 in circle of radius 8 → leg is 4, not 8, giving distance 4√3. Then reread the question: did it ask for half or all of it?`, kind: 'gotcha' },
    { content: `"Equal measure" ≠ "congruent." Two 60° arcs in circles of radius 3 and 12 both measure 60° but have lengths π and 4π. Congruent arcs need equal measure AND the same circle (or congruent circles).`, kind: 'vocab-note' },
    { content: `Label units to keep yourself honest: arc measure gets a degree symbol, arc length gets cm/in/units. If your answer to "find the arc measure" has a π in it, you computed length instead.`, kind: 'tip' },
    { content: `Two radii to the endpoints of a chord make an isosceles triangle for free — base angles equal, no extra given needed. Look for it whenever a chord and the center are in the same picture.`, kind: 'tip' },
    { content: `All arcs around a circle sum to 360°, not 180°. With three points A, B, C in order, arc CA = 360 − (arc AB + arc BC). Don't subtract from 180 out of triangle habit.`, kind: 'common-error' },
    { content: `A diameter is a chord (the longest one, distance 0 from the center); a secant is a LINE through two points, a chord is a SEGMENT between them. Don't call a tangent a secant — tangents hit the circle exactly once.`, kind: 'edge-case' },
  ],
};
