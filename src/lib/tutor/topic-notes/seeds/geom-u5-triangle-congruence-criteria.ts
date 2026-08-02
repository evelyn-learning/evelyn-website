/**
 * Geometry — Unit 5 CED 5.2: Triangle Congruence: SSS, SAS, ASA & AAS.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.triangle-congruence-criteria.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U5_TRIANGLE_CONGRUENCE_CRITERIA: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.triangle-congruence-criteria.v1',
  course: 'Geometry',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Triangle Congruence: SSS, SAS, ASA & AAS',
  planId: 'evelyn.hs.geom.triangle-congruence-criteria.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.triangle-congruence-criteria.v1' }],
  theory: [
    { loId: 'geom.triangle-congruence-criteria', kind: 'framework', title: 'What congruent means', content: `WHAT CONGRUENT MEANS — △ABC ≅ △DEF says every corresponding part matches: AB = DE, BC = EF, CA = FD, ∠A = ∠D, ∠B = ∠E, ∠C = ∠F. The letter ORDER carries the matching: A↔D, B↔E, C↔F.` },
    { loId: 'geom.triangle-congruence-criteria', kind: 'framework', title: 'The four shortcuts', content: `THE FOUR SHORTCUTS — SSS (three sides), SAS (two sides and the INCLUDED angle), ASA (two angles and the INCLUDED side), AAS (two angles and a NON-included side). Any one of them forces all six parts to match.` },
    { loId: 'geom.triangle-congruence-criteria', kind: 'framework', title: 'Included means between', content: `INCLUDED MEANS BETWEEN — in SAS the angle must sit between the two sides; in ASA the side must connect the two angles. ∠B is included between sides AB and BC.` },
    { loId: 'geom.triangle-congruence-criteria', content: `IMPOSTOR 1: AAA — three matching angles fix the SHAPE but not the SIZE. A small triangle and a billboard-sized copy have identical angles. AAA gives similarity (Unit 6), never congruence.` },
    { loId: 'geom.triangle-congruence-criteria', content: `IMPOSTOR 2: SSA — two sides and a non-included angle can close in two different ways (the swinging-door problem): the third side can swing to two different lengths. Same three measurements, two different triangles.` },
    { loId: 'geom.triangle-congruence-criteria', kind: 'framework', title: 'Hidden givens', content: `HIDDEN GIVENS — diagrams donate free parts: a shared side equals itself (Reflexive Property), and vertical angles are congruent. Most "not enough information" mistakes are really missed hidden givens.` },
    { loId: 'geom.triangle-congruence-criteria', kind: 'definition', title: 'included angle', content: 'the angle formed by (between) two given sides of a triangle.' },
    { loId: 'geom.triangle-congruence-criteria', kind: 'definition', title: 'corresponding parts', content: `sides or angles in matching positions of two triangles, given by the letter order of the congruence statement.` },
  ],
  methods: [
    {
      title: 'Worked identify criterion',
      steps: [
        'List the given pairs: AB = CB (side) and ∠ABD = ∠CBD (angle).',
        `Hunt the hidden given: BD is shared by both triangles, and BD = BD by the Reflexive Property (side).`,
        `Arrange the parts in position order: side AB, angle ∠ABD, side BD — the angle sits BETWEEN the two sides.`,
        'Two sides and the included angle → SAS. So △ABD ≅ △CBD by SAS.',
      ],
      example: { problem: `Triangles ABD and CBD share side BD. Given: AB = CB and ∠ABD = ∠CBD. Which congruence criterion proves △ABD ≅ △CBD?`, solution: 'SAS (using the shared side BD by the Reflexive Property)' },
      relatedLoIds: ['geom.triangle-congruence-criteria'],
    },
    {
      title: 'Worked ssa fails',
      steps: [
        `Name the pattern: side (8), side (5), and a NON-included angle (30°) — this is SSA, not SAS.`,
        `Picture the 5-side as a door hinged at the far end of the 8-side, swinging until its tip touches the base ray.`,
        `The swinging side can land in TWO spots — leaning toward the 30° angle or away from it — closing the triangle with two different third sides.`,
        `Two different triangles share those three measurements, so the three parts do not force congruence. SSA proves nothing without extra information.`,
      ],
      example: { problem: `A classmate claims: "Two triangles each have sides of 8 and 5 and a 30° angle at the end of the 8 side (not between the given sides). That is three matching parts, so the triangles must be congruent." What is wrong?`, solution: `The pattern is SSA, which is not a congruence criterion — the triangle can close in two different ways.` },
      relatedLoIds: ['geom.triangle-congruence-criteria'],
    },
  ],
  pointers: [
    { content: `AAA fixes only the shape, not the size — the triangles are SIMILAR. Congruence needs at least one pair of corresponding sides: upgrade AAA to ASA or AAS with a side.`, kind: 'common-error' },
    { content: 'Valid shortcuts: SSS, SAS, ASA, AAS — three well-chosen parts force all six.', kind: 'tip' },
    { content: `Included means between: SAS needs the angle between the sides, ASA the side between the angles.`, kind: 'tip' },
    { content: `AAA → similarity only; SSA → ambiguous (the swinging door). Neither proves congruence.`, kind: 'tip' },
    { content: `Hunt hidden givens: shared sides (Reflexive Property) and vertical angles are free matching parts.`, kind: 'tip' },
    { content: `Write congruence statements with vertices in matching order. △ABC ≅ △DEF means A↔D, B↔E, C↔F — so writing △ABC ≅ △EFD claims a completely different set of equal parts. Reorder the letters, and your "corresponding" sides change too.`, kind: 'common-error' },
    { content: `Before deciding SAS vs. AAS vs. ASA, list the parts in the order they appear around the triangle (side–angle–side, angle–side–angle). Naming the letters without checking position is how SAS/SSA and ASA/AAS get swapped.`, kind: 'tip' },
    { content: `"Included" is not a synonym for "given." ∠B is included between AB and BC only because B is an endpoint of both. If the angle's vertex is not shared by both named sides, you have SSA — not SAS.`, kind: 'vocab-note' },
    { content: `SSA is not "almost congruent" — it can produce two genuinely different triangles (swinging door). Don't write "congruent by SSA" or "by ASS"; the correct conclusion is *not enough information*.`, kind: 'common-error' },
    { content: `AAA and AA give SIMILAR triangles (same shape, any size), never congruent. To upgrade, you need one pair of corresponding SIDES — that turns it into ASA or AAS.`, kind: 'gotcha' },
    { content: `If a problem looks like it's one part short, hunt hidden givens: a shared side is congruent to itself (Reflexive Property) and vertical angles are congruent. Cite the reason — don't just assume the part.`, kind: 'tip' },
    { content: `Don't take equality from the picture. Sides that look equal, angles that look right, or a segment that looks like a midpoint prove nothing unless marked, given, or derived.`, kind: 'edge-case' },
    { content: `In numeric problems, set the expression equal to its CORRESPONDING part, then solve. With △ABC ≅ △DEF and AB = 3x − 4, DE = 17: 3x − 4 = 17, x = 7 — not x = 17 or x = 21/3.`, kind: 'common-error' },
  ],
};
