/**
 * Geometry — Unit 5 CED 5.4: Isosceles & Equilateral Triangles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.isosceles-equilateral.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U5_ISOSCELES_EQUILATERAL: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.isosceles-equilateral.v1',
  course: 'Geometry',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Isosceles & Equilateral Triangles',
  planId: 'evelyn.hs.geom.isosceles-equilateral.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.isosceles-equilateral.v1' }],
  theory: [
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'The parts, named first', content: `THE PARTS, NAMED FIRST — an isosceles triangle has two congruent LEGS, a BASE (the third side), a VERTEX ANGLE (the angle between the legs), and two BASE ANGLES (the angles that touch the base). Label these before computing anything.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'Isosceles triangle theorem', content: `ISOSCELES TRIANGLE THEOREM — if two sides of a triangle are congruent, then the angles OPPOSITE those sides are congruent. In △ABC with AB ≅ AC, the base angles ∠B and ∠C are congruent. Proof sketch: draw the bisector of ∠A, get △ABD ≅ △ACD by SAS, then ∠B ≅ ∠C by CPCTC.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'The converse is also true', content: `THE CONVERSE IS ALSO TRUE — if two angles of a triangle are congruent, the sides opposite them are congruent. So you can prove a triangle is isosceles from angle measures alone, with no ruler involved.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'The angle arithmetic', content: `THE ANGLE ARITHMETIC — vertex angle + 2(base angle) = 180°. Rearranged: base angle = (180° − vertex)/2, and vertex = 180° − 2(base angle). One known angle gives you the other two.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'Equilateral means equiangular, both ways', content: `EQUILATERAL MEANS EQUIANGULAR, BOTH WAYS — apply the theorem to each pair of sides: all three sides congruent forces all three angles congruent, so each is 60°. The converse runs the same way — three 60° angles force three congruent sides.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'The apex segment does triple duty', content: `THE APEX SEGMENT DOES TRIPLE DUTY — the segment from the vertex angle to the midpoint of the base is simultaneously a median, an altitude (⊥ to the base), and the bisector of the vertex angle. It splits the triangle into two congruent right triangles.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — PAIRING BY LETTERS: given AB ≅ AC a student pairs ∠A with ∠B because the letters look alike. Match each congruent side to the angle ACROSS from it: side AB is opposite ∠C, side AC is opposite ∠B, so ∠B ≅ ∠C.` },
    { loId: 'geom.isosceles-equilateral', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — ASSUMING THE GIVEN ANGLE IS THE VERTEX ANGLE: before you subtract from 180 and halve, check whether the angle you were handed sits between the legs (vertex) or touches the base (base angle). Halving a base angle problem is the single most common wrong answer in this unit.` },
    { loId: 'geom.isosceles-equilateral', kind: 'definition', title: 'vertex angle', content: 'in an isosceles triangle, the angle formed by (between) the two congruent legs.' },
    { loId: 'geom.isosceles-equilateral', kind: 'definition', title: 'base angles', content: `the two angles that touch the base of an isosceles triangle; they are the angles opposite the congruent legs, and they are always congruent.` },
  ],
  methods: [
    {
      title: 'Worked fill in triangle',
      steps: [
        `Identify the parts: AB and AC are the legs, so BC is the base, ∠A is the vertex angle, and ∠B and ∠C are the base angles.`,
        `Isosceles Triangle Theorem: the angles opposite the congruent legs are congruent, so ∠C ≅ ∠B and m∠C = 64°.`,
        `Use the angle sum: m∠A = 180° − 64° − 64° = 52°. (Same thing as vertex = 180° − 2(base angle).)`,
        `AM runs from the vertex angle to the midpoint of the base, so it is the median — and in an isosceles triangle that segment is also the altitude, meaning AM ⊥ BC.`,
        'Perpendicular means the angle at M is a right angle, so m∠AMB = 90°.',
      ],
      example: { problem: `In △ABC, AB ≅ AC and ∠B measures 64°. Point M is the midpoint of BC, and segment AM is drawn. Find m∠C, m∠A, and m∠AMB.`, solution: 'm∠C = 64°, m∠A = 52°, m∠AMB = 90°' },
      relatedLoIds: ['geom.isosceles-equilateral'],
    },
    {
      title: 'Worked which angles match',
      steps: [
        `Find the shared vertex of the congruent sides: JK and KL both contain K, so the legs meet at K and ∠K is the VERTEX angle. The base is JL.`,
        `Match each leg to the angle across from it: leg JK is opposite ∠L, leg KL is opposite ∠J. So the congruent pair is ∠J ≅ ∠L — the base angles — not ∠J and ∠K.`,
        `The student paired by shared letters instead of by opposite position, which is why a 104° answer appeared for a base angle.`,
        `Compute correctly: the two base angles share 180° − 104° = 76°, so each is 76°/2 = 38°.`,
        `Sanity check: 38° + 38° + 104° = 180°, and the vertex angle being the obtuse one matches the picture of two long legs leaning apart.`,
      ],
      example: { problem: `In △JKL, JK ≅ KL and m∠K = 104°. A student writes "∠J ≅ ∠K, because J and K are the letters in the congruent side JK," then reports m∠J = 104°. Find the correct measures and pinpoint the error.`, solution: `m∠J = m∠L = 38°; the error was pairing angles by shared letters instead of using the angles opposite the congruent sides.` },
      relatedLoIds: ['geom.isosceles-equilateral'],
    },
  ],
  pointers: [
    { content: `The CONVERSE is a theorem too: if two angles are congruent, the sides opposite them are congruent. ∠D is opposite EF and ∠F is opposite DE, so EF ≅ DE and △DEF is isosceles with vertex angle ∠E — proved from angles alone.`, kind: 'common-error' },
    { content: `Congruent sides give congruent angles OPPOSITE them, and the converse holds: congruent angles give congruent opposite sides.`, kind: 'tip' },
    { content: `Match by opposite position, never by shared letters — with AB ≅ AC the congruent angles are ∠B and ∠C.`, kind: 'tip' },
    { content: `Angle arithmetic: vertex + 2(base angle) = 180°. Check which kind of angle you were given before halving.`, kind: 'tip' },
    { content: `Equilateral and equiangular are the same condition: every side congruent exactly when every angle is 60°.`, kind: 'tip' },
    { content: `From the vertex angle, the median to the base is also the altitude and the angle bisector — one segment, three jobs.`, kind: 'tip' },
    { content: `Match congruent **sides** to the angles **opposite** them, never by shared letters. With AB ≅ AC the congruent angles are ∠B and ∠C (not ∠A and ∠B). Find the letter both legs share — that's the vertex angle.`, kind: 'common-error' },
    { content: `Before you do 180 − x then ÷ 2, ask: is the given angle the vertex angle or a base angle? If you were given a BASE angle, don't halve anything — double it and subtract from 180.`, kind: 'gotcha' },
    { content: `Say "legs, base, vertex angle, base angles" — and label them on the figure first. Base angles are the angles opposite the LEGS, not the angles opposite the base (only one angle is opposite the base: the vertex angle).`, kind: 'vocab-note' },
    { content: `The Isosceles Triangle Theorem runs both ways. Two congruent angles prove two congruent sides — you never need a ruler or a side length to conclude a triangle is isosceles.`, kind: 'common-error' },
    { content: `The vertex angle can be obtuse or right; base angles never can. If your computed base angle is ≥ 90°, you've mislabeled the given angle — two base angles of 90° already use up all 180°.`, kind: 'edge-case' },
    { content: `"One segment, three jobs" applies ONLY to the segment from the vertex angle to the base — not to the median/altitude from a base angle. Drawing it lets you claim ⊥ (90°) at the base, midpoint, and a bisected vertex angle all at once.`, kind: 'gotcha' },
    { content: `Equilateral ⇔ equiangular ⇔ every angle 60°. Two 60° angles are already enough: the third is forced to 60°, so the triangle is equilateral — you don't need all three given.`, kind: 'tip' },
    { content: `Finish every problem with the angle-sum check: base + base + vertex = 180°. It catches halving errors and letter-pairing errors in one line (e.g. 38 + 38 + 104 = 180 ✓).`, kind: 'tip' },
  ],
};
