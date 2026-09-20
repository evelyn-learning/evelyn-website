/**
 * Grade 8 Math — Unit 8 CED 8.2: Rotations About the Origin.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.rotations-about-the-origin.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U8_ROTATIONS_ABOUT_THE_ORIGIN: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.rotations-about-the-origin.v1',
  course: 'Grade 8 Math',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Rotations About the Origin',
  planId: 'evelyn.ms.m8math.rotations-about-the-origin.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.rotations-about-the-origin.v1' }],
  theory: [
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'A rotation is a turn about a fixed point', content: `A ROTATION IS A TURN ABOUT A FIXED POINT — the fixed point is the center of rotation, and in this lesson the center is always the origin, (0, 0). Every point of the figure swings around the origin and stays exactly as far from the origin as it was; the origin itself does not move. The angle says how far: 90° is a quarter turn, 180° is a half turn, and 270° is three quarters of a turn.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'Counterclockwise is the standard direction', content: `COUNTERCLOCKWISE IS THE STANDARD DIRECTION — unless a problem says clockwise, a rotation turns counterclockwise, the opposite of the way the hands of a clock move. Every rule below is for counterclockwise turns. A clockwise turn is just a counterclockwise turn of a different size: 90° clockwise lands in the same place as 270° counterclockwise, 270° clockwise lands where 90° counterclockwise does, and 180° lands in the same place either way.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'Three rules, one for each turn', content: `THREE RULES, ONE FOR EACH TURN — 90°: (x, y) becomes (-y, x). 180°: (x, y) becomes (-x, -y). 270°: (x, y) becomes (y, -x). Take the point (3, 1): a 90° turn sends it to (-1, 3), a 180° turn sends it to (-3, -1), and a 270° turn sends it to (1, -3). The two quarter turns SWAP the coordinates and flip the sign of exactly one of them; the half turn swaps nothing and flips both signs. Apply the one rule you chose to every vertex, not just the first.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'Check the landing quadrant', content: `CHECK THE LANDING QUADRANT — a point in quadrant I turns counterclockwise into quadrant II after 90°, into quadrant III after 180°, and into quadrant IV after 270°. So (3, 1), which sits in quadrant I, must land at negative x and positive y after a 90° turn, and (-1, 3) does. The fastest check of all is a point on an axis: (3, 0) on the positive x-axis turns 90° to (0, 3) on the positive y-axis, and the x-axis swinging up into the y-axis IS a counterclockwise turn.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'What a rotation keeps', content: `WHAT A ROTATION KEEPS — a rotation is a rigid motion, like the translations and reflections you already use. Lines stay lines, every side keeps its length, every angle keeps its measure, and sides that were parallel stay parallel, so the image is congruent to the original figure. What changes is only where the figure sits and which way it is turned. You can verify a kept length on a horizontal or vertical side by counting units before and after the turn.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'framework', title: 'Read the turn off a pair', content: `READ THE TURN OFF A PAIR — given a figure and its image, take one vertex and compare it with its image. If both coordinates flipped sign and nothing swapped, the turn was 180°. If the coordinates swapped, test the two quarter-turn rules on that vertex: the one that produces the image point names the turn, 90° for (-y, x) and 270° for (y, -x). Then confirm with a second vertex, because one vertex can agree with a rule by accident.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'definition', title: 'rotation', content: 'a turn of a figure about a fixed point through a stated angle.' },
    { loId: 'm8math.rotations-about-the-origin', kind: 'definition', title: 'center of rotation', content: `the fixed point the figure turns around; in this lesson it is always the origin, (0, 0).` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'definition', title: 'counterclockwise', content: `the standard direction for a rotation, opposite to the way the hands of a clock move.` },
    { loId: 'm8math.rotations-about-the-origin', kind: 'definition', title: 'preimage and image', content: `the figure before the turn and the figure after it; an image vertex is marked with a prime, so A turns into A-prime.` },
  ],
  methods: [
    {
      title: 'Worked quarter turn triangle',
      steps: [
        `Confirm the direction and pick the rule. The instruction says counterclockwise, the angle is 90°, so the rule is (x, y) becomes (-y, x): the y-coordinate moves to the front with its sign flipped, and the old x-coordinate moves to the back.`,
        `Apply the rule to every vertex. A(2, 1) becomes (-1, 2). B(5, 1) becomes (-1, 5). C(5, 5) becomes (-5, 5). Write them as A-prime (-1, 2), B-prime (-1, 5), C-prime (-5, 5).`,
        `Check the landing quadrant. A(2, 1) sits in quadrant I, and a quarter turn counterclockwise should carry it into quadrant II, where x is negative and y is positive. A-prime (-1, 2) is in quadrant II, so the direction is right.`,
        `Check by working backward. A 270° turn undoes a 90° turn, and its rule is (x, y) becomes (y, -x). Apply it to A-prime (-1, 2): (2, 1), which is A. The rule was applied correctly.`,
        `Verify the preserved lengths on the horizontal and vertical sides by counting units. Side AB runs from x = 2 to x = 5 at height 1, so AB is 3 units long. Its image A-prime B-prime runs from y = 2 to y = 5 at x = -1, so it is 3 units long. Side BC runs from y = 1 to y = 5 at x = 5, so BC is 4 units long. Its image B-prime C-prime runs from x = -1 to x = -5 at height 5, so it is 4 units long.`,
        `Verify the angle. At B, the horizontal side AB meets the vertical side BC, so angle B is a right angle. At B-prime, the vertical side A-prime B-prime meets the horizontal side B-prime C-prime, so angle B-prime is also a right angle. The triangle turned, but nothing about its size or shape changed.`,
      ],
      example: { problem: `Triangle ABC has vertices A(2, 1), B(5, 1) and C(5, 5). Rotate it 90° counterclockwise about the origin, give the image vertices, and verify that the side lengths and the right angle are preserved.`, solution: `A-prime (-1, 2), B-prime (-1, 5), C-prime (-5, 5); AB and A-prime B-prime are both 3 units, BC and B-prime C-prime are both 4 units, and the right angle at B is still a right angle at B-prime` },
      relatedLoIds: ['m8math.rotations-about-the-origin'],
    },
    {
      title: 'Worked half turn and identify',
      steps: [
        `(a) The angle is 180°, so the rule is (x, y) becomes (-x, -y): flip both signs, swap nothing. D(-3, 2) becomes (3, -2). E(-1, 2) becomes (1, -2). F(-1, 6) becomes (1, -6).`,
        `Check a length. DE runs from x = -3 to x = -1 at height 2, so DE is 2 units. D-prime E-prime runs from x = 1 to x = 3 at height -2, so it is 2 units as well. EF runs from y = 2 to y = 6 at x = -1, so EF is 4 units, and E-prime F-prime runs from y = -6 to y = -2 at x = 1, also 4 units. Lengths preserved.`,
        `(b) Compare D(-3, 2) with its image (2, 3). The coordinates swapped places, so this is a quarter turn, and the only question is which one.`,
        `WRONG: seeing that the coordinates swapped and answering 90° without testing the rule. CORRECT: test it. The 90° rule (-y, x) sends D(-3, 2) to (-2, -3), which is not the image point. The 270° rule (y, -x) sends D(-3, 2) to (2, 3), which is. So the turn was 270° counterclockwise, which is the same landing as 90° clockwise.`,
        `Confirm with a second vertex, because one match could be luck. The 270° rule sends E(-1, 2) to (2, 1) and F(-1, 6) to (6, 1), and both match the given image. The rotation is 270° counterclockwise about the origin.`,
        `Check the quadrant. D(-3, 2) sits in quadrant II. Three quarter turns counterclockwise carry quadrant II to quadrant III, then IV, then I. The image (2, 3) is in quadrant I, so a 270° turn is exactly what the picture shows.`,
      ],
      example: { problem: `Triangle DEF has vertices D(-3, 2), E(-1, 2) and F(-1, 6). (a) Rotate it 180° about the origin. (b) A second image of the same triangle has vertices (2, 3), (2, 1) and (6, 1). Which rotation about the origin produced it?`, solution: `(a) D-prime (3, -2), E-prime (1, -2), F-prime (1, -6); (b) a rotation of 270° counterclockwise about the origin` },
      relatedLoIds: ['m8math.rotations-about-the-origin'],
    },
  ],
  pointers: [
    { content: `Students often say "(6, -2)" — Counterclockwise is the standard direction, and the 90° counterclockwise rule is (x, y) becomes (-y, x), so (2, 6) becomes (-6, 2). The quadrant check exposes the slip: (2, 6) sits in quadrant I, and a quarter turn counterclockwise lands in quadrant II, where x is negative and y is positive. (-6, 2) is in quadrant II. (6, -2) is in quadrant IV, which is where a CLOCKWISE quarter turn lands. That rule, (y, -x), belongs to the 270° counterclockwise turn.`, kind: 'common-error' },
    { content: `Students often say "(-2, -6)" — A quarter turn always SWAPS the two coordinates and flips exactly one sign. Flipping both signs with no swap is the half-turn rule, so (-2, -6) is where (2, 6) lands after 180°, not 90°. The fastest way to see it is a point on an axis: (2, 0) turned 90° counterclockwise lands on the positive y-axis at (0, 2), and the coordinates clearly traded places. Flipping both signs would send (2, 0) to (-2, 0), straight across the origin, which is a half turn. For (2, 6), swap to get (6, 2), then flip the sign of the new first coordinate: (-6, 2).`, kind: 'common-error' },
    { content: `A rotation turns a figure about a fixed center; in this lesson the center is always the origin, and the origin is the one point that does not move.`, kind: 'tip' },
    { content: `Counterclockwise is the standard direction. 90° clockwise lands where 270° counterclockwise does, and 180° is the same either way.`, kind: 'tip' },
    { content: `The three rules about the origin: 90° sends (x, y) to (-y, x); 180° sends (x, y) to (-x, -y); 270° sends (x, y) to (y, -x). Apply the one rule to every vertex.`, kind: 'tip' },
    { content: `A quarter turn swaps the coordinates and flips exactly one sign; a half turn swaps nothing and flips both.`, kind: 'tip' },
    { content: `Check the landing quadrant: counterclockwise carries quadrant I to II, then III, then IV. A point on an axis is the quickest test of direction.`, kind: 'tip' },
    { content: `A rotation preserves side lengths, angle measures and parallel sides, so the image is congruent to the original.`, kind: 'tip' },
    { content: `To name a rotation from a preimage/image pair, test the three rules on one vertex, then confirm with a second vertex.`, kind: 'tip' },
    { content: `Don't mix up 90° counterclockwise with 90° clockwise. Counterclockwise is the default. If the problem doesn't say clockwise, use (x, y) → (-y, x). Clockwise 90° uses (y, -x) and lands in a different quadrant.`, kind: 'common-error' },
    { content: `For a 90° turn, always SWAP the coordinates AND flip one sign. For 180°, flip BOTH signs and swap nothing. Don't flip both signs for a quarter turn—that's a half turn.`, kind: 'gotcha' },
    { content: `Use the quadrant check as your fastest error detector. After a 90° counterclockwise turn, a point in quadrant I must land in quadrant II (negative x, positive y). If it doesn't, you used the wrong rule.`, kind: 'tip' },
    { content: `When you identify a rotation from a preimage and image, test the rule on TWO vertices, not one. One vertex can match a rule by accident; two confirms the rotation.`, kind: 'common-error' },
    { content: `The origin (0, 0) never moves. It's the center, not a point that rotates. Every other point swings around it and stays the same distance from it.`, kind: 'vocab-note' },
    { content: `For quarter turns, use a point on an axis to verify direction fast: (3, 0) on the x-axis turns 90° counterclockwise to (0, 3) on the y-axis. The axis rotates up, which IS counterclockwise.`, kind: 'tip' },
    { content: `A 180° turn lands the same way whether you go clockwise or counterclockwise. But 90° clockwise is NOT the same as 90° counterclockwise—it's the same as 270° counterclockwise.`, kind: 'edge-case' },
    { content: `Apply your rule to EVERY vertex of the figure, not just the first one. Common error: rotate one point correctly, then forget to rotate the rest.`, kind: 'common-error' },
  ],
};
