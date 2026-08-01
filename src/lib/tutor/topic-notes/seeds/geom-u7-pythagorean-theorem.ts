/**
 * Geometry — Unit 7 CED 7.1: The Pythagorean Theorem & Its Converse.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.pythagorean-theorem.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U7_PYTHAGOREAN_THEOREM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.pythagorean-theorem.v1',
  course: 'Geometry',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'The Pythagorean Theorem & Its Converse',
  planId: 'evelyn.hs.geom.pythagorean-theorem.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.pythagorean-theorem.v1' }],
  theory: [
    { loId: 'geom.pythagorean-theorem', kind: 'framework', title: 'The statement', content: `THE STATEMENT — in a RIGHT triangle with legs a and b and hypotenuse c: a² + b² = c². The legs are the two sides that form the right angle; the hypotenuse is the side across from it, and it is always the longest side.` },
    { loId: 'geom.pythagorean-theorem', content: `c IS NEVER OPTIONAL — the biggest error in this unit is dropping the two GIVEN sides into a and b when one of them is the hypotenuse. Identify the hypotenuse FIRST (it sits opposite the right angle), then decide whether you are adding or subtracting.` },
    { loId: 'geom.pythagorean-theorem', content: `FIND HYPOTENUSE → ADD; FIND LEG → SUBTRACT — legs 9 and 12 give c = √(81 + 144) = 15. Hypotenuse 15 with leg 9 gives b = √(225 - 81) = 12. Sanity check every answer: a leg must come out SHORTER than the hypotenuse.` },
    { loId: 'geom.pythagorean-theorem', content: `WHY IT IS TRUE (SIMILARITY) — drop the altitude from the right angle to the hypotenuse. It splits the triangle into two smaller triangles, each similar to the original by AA. The proportions from those similar triangles give a² = c·(part of c under a) and b² = c·(part under b); adding them gives a² + b² = c·c = c². The theorem is a proportionality result, not a coincidence.` },
    { loId: 'geom.pythagorean-theorem', kind: 'framework', title: 'The converse', content: `THE CONVERSE — the arrow runs the other way: IF the three sides of a triangle satisfy a² + b² = c² with c the LONGEST side, THEN the angle opposite c is a right angle. This is how three tape-measure readings prove a corner is square.` },
    { loId: 'geom.pythagorean-theorem', kind: 'framework', title: 'Classifying by comparison', content: `CLASSIFYING BY COMPARISON — always let c be the longest side, then compare a² + b² to c². Equal → right. Bigger (a² + b² > c²) → ACUTE. Smaller (a² + b² < c²) → OBTUSE. Memory hook: the bigger the square on the longest side, the more the triangle has "opened up".` },
    { loId: 'geom.pythagorean-theorem', kind: 'framework', title: 'Triples save time, but verify', content: `TRIPLES SAVE TIME, BUT VERIFY — 3-4-5, 5-12-13, 8-15-17, 7-24-25 and all their multiples (6-8-10, 9-12-15, 10-24-26) are whole-number right triangles. Spotting one is a shortcut, but only if the largest number really is the hypotenuse — 6, 8, 11 is NOT a 6-8-10 triangle.` },
    { loId: 'geom.pythagorean-theorem', content: `EXACT vs ROUNDED — legs 6 and 6 give c = √72 = 6√2, not 8.49. Simplify the radical and leave it exact unless the problem asks for a decimal; rounding early wrecks any later step.` },
    { loId: 'geom.pythagorean-theorem', kind: 'definition', title: 'hypotenuse', content: 'the side of a right triangle opposite the right angle — always the longest side.' },
    { loId: 'geom.pythagorean-theorem', kind: 'definition', title: 'Pythagorean triple', content: `a set of three whole numbers a, b, c with a² + b² = c², such as 3-4-5 or 5-12-13.` },
  ],
  methods: [
    {
      title: 'Worked find hypotenuse',
      steps: [
        `Locate the hypotenuse: the right angle is at A, so the side opposite it — BC, the brace — is the hypotenuse. The two legs are the given 9 and 12.`,
        `Both legs are known and the hypotenuse is missing, so this is the ADD direction: 9² + 12² = BC².`,
        'Compute: 81 + 144 = 225, so BC² = 225.',
        `Take the positive square root: BC = 15 feet. (Negative lengths are meaningless here.)`,
        `Check: 15 is longer than both 9 and 12, as a hypotenuse must be — and 9-12-15 is just the 3-4-5 triple tripled. ✓`,
      ],
      example: { problem: `A rectangular gate is 9 feet wide and 12 feet tall. A carpenter wants to nail a straight brace from the bottom-left corner to the top-right corner. In right triangle ABC formed by the bottom edge, the left edge, and the brace, the right angle is at A, AB = 9 ft, and AC = 12 ft. How long is the brace BC?`, solution: 'BC = 15 feet' },
      relatedLoIds: ['geom.pythagorean-theorem'],
    },
    {
      title: 'Worked hypotenuse mixup',
      steps: [
        `Spot the setup: the ladder is opposite the right angle at Q, so PR = 26 is the HYPOTENUSE, not a leg. The unknown wall height QR is a LEG.`,
        `Test the student answer against reality: 27.9 ft would be LONGER than the 26-ft ladder. A leg can never exceed the hypotenuse, so the answer is impossible before any arithmetic is rechecked.`,
        'Set it up correctly with the hypotenuse alone on the right: 10² + QR² = 26².',
        'Compute: 100 + QR² = 676, so QR² = 576 and QR = 24 feet.',
        `Diagnose the error: the student added because both given numbers were treated as legs. Whenever the hypotenuse is one of the KNOWN sides, you SUBTRACT. Check: 10² + 24² = 100 + 576 = 676 = 26². ✓`,
      ],
      example: { problem: `A 26-foot ladder leans against a wall, with its base 10 feet from the wall. In right triangle PQR, the right angle is at Q (where the wall meets the ground), PQ = 10 ft along the ground, and the ladder PR = 26 ft. A student writes 10² + 26² = x² and gets x ≈ 27.9 ft for the wall height. Find the correct height and explain the error.`, solution: `QR = 24 feet — the 26-ft ladder is the hypotenuse, so the setup subtracts rather than adds` },
      relatedLoIds: ['geom.pythagorean-theorem'],
    },
  ],
  pointers: [
    { content: `The theorem holds ONLY when the angle between the two sides is exactly 90°. Here that angle is 50°, so the triangle is not right and the equation does not apply — the third side is actually shorter than 11.4, because a smaller included angle pulls the far vertices closer together. Non-right triangles need a different tool (the Law of Cosines, in later courses). Before writing a² + b² = c², confirm a right angle is given or proved.`, kind: 'common-error' },
    { content: `a² + b² = c² applies to RIGHT triangles only, and c is always the hypotenuse — the side opposite the right angle.`, kind: 'tip' },
    { content: `Missing hypotenuse → add the leg squares; missing leg → subtract from the hypotenuse squared. A leg must come out shorter than the hypotenuse.`, kind: 'tip' },
    { content: `The converse runs backwards: with c the longest side, a² + b² = c² proves a right angle; > c² means acute, < c² means obtuse.`, kind: 'tip' },
    { content: `Know the triples (3-4-5, 5-12-13, 8-15-17, 7-24-25 and multiples), but verify the largest side is really the hypotenuse before using one.`, kind: 'tip' },
    { content: `Leave radical answers exact and simplified (√72 = 6√2); round only when the problem asks.`, kind: 'tip' },
    { content: `Before writing a² + b² = c², confirm the triangle actually has a right angle. Given two sides and a 50° included angle, √(7²+9²) is meaningless — the theorem is not a general "third side" formula.`, kind: 'common-error' },
    { content: `Identify the hypotenuse FIRST (opposite the right angle), then decide add vs. subtract. If the hypotenuse is one of the GIVEN sides, you subtract: leg² = c² − other leg². Adding both givens is the #1 error in this unit.`, kind: 'gotcha' },
    { content: `Sanity-check every answer against size: a leg must be SHORTER than the hypotenuse. A 26-ft ladder can't reach 27.9 ft up a wall — that answer is impossible before you even recheck arithmetic.`, kind: 'tip' },
    { content: `In the converse, c must be the LONGEST side before you compare. Then: a² + b² = c² → right, **> c² → acute**, **< c² → obtuse**. Students flip these two — bigger square on the longest side means the triangle has opened up (obtuse).`, kind: 'common-error' },
    { content: `Recognizing a triple only helps if the largest number is truly the hypotenuse — and if the numbers really match. 6, 8, 11 is NOT 6-8-10; check 6² + 8² = 100 ≠ 121 instead of pattern-matching.`, kind: 'edge-case' },
    { content: `Leave answers as simplified exact radicals unless a decimal is requested: √72 = 6√2, not 8.49. Rounding mid-problem corrupts anything you compute next.`, kind: 'tip' },
    { content: `"Hypotenuse" is defined by position (opposite the right angle), not by which number looks biggest in the problem. And it only exists in a right triangle — never call a side of an obtuse triangle a hypotenuse.`, kind: 'vocab-note' },
    { content: `When you solve c² = 225, take only the positive root. The equation has two solutions, but lengths can't be negative — write c = 15, not c = ±15.`, kind: 'gotcha' },
  ],
};
