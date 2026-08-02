/**
 * Geometry — Unit 4 CED 4.3: Rotations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.rotations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U4_ROTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.rotations.v1',
  course: 'Geometry',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Rotations',
  planId: 'evelyn.hs.geom.rotations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.rotations.v1' }],
  theory: [
    { loId: 'geom.rotations', kind: 'framework', title: 'What a rotation is', content: `WHAT A ROTATION IS — a turn of every point about a fixed CENTER through a given ANGLE. Each point travels along a circular arc, and its distance from the center never changes. Notation: R(P, 90°) means "rotate 90° about center P".` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Three things define it', content: `THREE THINGS DEFINE IT — center, angle, direction. Missing any one makes the instruction ambiguous: "rotate 90°" is not an answer until you say about WHAT and which WAY.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Direction convention', content: `DIRECTION CONVENTION — counterclockwise is POSITIVE, clockwise is NEGATIVE. A full turn is 360°, so every clockwise turn has a counterclockwise twin: 90° clockwise = 270° counterclockwise, and 180° is the same either way.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'The origin rules', content: `THE ORIGIN RULES — about the origin: 90° counterclockwise (x, y) → (-y, x); 180° (x, y) → (-x, -y); 270° counterclockwise (x, y) → (y, -x). The two quarter-turns both SWAP the coordinates and negate exactly ONE of them — which one is the whole difference between them.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Center is the only fixed point', content: `CENTER IS THE ONLY FIXED POINT — the center maps to itself and nothing else does (short of a full 360° turn). The center does not have to be the origin, and it does not have to sit inside the figure — it can be a vertex, a midpoint, or a point off in space.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Any center, three steps', content: `ANY CENTER, THREE STEPS — to rotate about center (a, b): subtract the center from each point, apply the origin rule, then add the center back. For a 180° turn this collapses to a shortcut: the image of (x, y) is (2a - x, 2b - y), because the center is the midpoint of every point and its image.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Rigid motion, orientation kept', content: `RIGID MOTION, ORIENTATION KEPT — rotations preserve segment lengths, angle measures, and parallelism, so the image is CONGRUENT to the preimage. Unlike a reflection, a rotation does NOT reverse orientation: a clockwise-lettered triangle stays clockwise-lettered.` },
    { loId: 'geom.rotations', kind: 'framework', title: 'Classic errors', content: `CLASSIC ERRORS — using the counterclockwise rule for a clockwise turn (the two quarter-turn rules get swapped); negating both coordinates for a 90° turn (that is the 180° rule); and applying an origin rule when the center is not the origin, which drags the center itself off its own spot.` },
    { loId: 'geom.rotations', kind: 'definition', title: 'center of rotation', content: `the fixed point every other point turns around — the only point that maps to itself.` },
    { loId: 'geom.rotations', kind: 'definition', title: 'angle of rotation', content: `the directed turn amount, counterclockwise when positive and clockwise when negative.` },
  ],
  methods: [
    {
      title: 'Worked quarter turn origin',
      steps: [
        `Pick the rule for the named turn: 90° counterclockwise about the origin is (x, y) → (-y, x) — swap the coordinates, then negate the new first coordinate.`,
        'A(1, 2) → (-2, 1). Swap gives (2, 1); negating the first entry gives (-2, 1).',
        `B(4, 2) → (-2, 4), and C(1, 6) → (-6, 1). Apply the same rule to every vertex — never mix rules within one rotation.`,
        `Check that the motion is rigid: A is √5 from the origin and A′(-2, 1) is also √5 from the origin, and leg AB had length 3 while A′B′ runs from (-2, 1) to (-2, 4), length 3. ✓ Lengths preserved.`,
      ],
      example: { problem: `Triangle ABC has vertices A(1, 2), B(4, 2), and C(1, 6). Rotate △ABC 90° counterclockwise about the origin and give the coordinates of the image △A′B′C′.`, solution: 'A′(-2, 1), B′(-2, 4), C′(-6, 1)' },
      relatedLoIds: ['geom.rotations'],
    },
    {
      title: 'Worked clockwise trap',
      steps: [
        `Diagnose the rule: (x, y) → (-y, x) is the 90° COUNTERclockwise rule. The student grabbed the wrong twin.`,
        `Convert the direction so a known rule applies: 90° clockwise is the same turn as 270° counterclockwise, whose rule is (x, y) → (y, -x).`,
        `Apply it: P(5, -3) → (-3, -5). Swap to get (-3, 5), then negate the new second coordinate.`,
        `Sanity-check with the quadrants: P(5, -3) sits in Quadrant IV, and a quarter turn clockwise from Quadrant IV lands in Quadrant III, where both coordinates are negative. The student's (3, 5) is in Quadrant I — a counterclockwise landing, which is exactly the tell.`,
      ],
      example: { problem: `A student rotates P(5, -3) 90° CLOCKWISE about the origin, writes (x, y) → (-y, x), and reports the image (3, 5). Find the correct image and explain the error.`, solution: `P′(-3, -5) — the student used the counterclockwise rule (-y, x) instead of the clockwise rule (y, -x)` },
      relatedLoIds: ['geom.rotations'],
    },
  ],
  pointers: [
    { content: `The center is the ONE point that must stay put, so A′ has to be A(3, 1) — the moment A moves, the work is wrong. Shift so the center becomes the origin (subtract A: B → (4, 0), C → (0, 3)), apply (x, y) → (-y, x) (B → (0, 4), C → (-3, 0)), then add A back: A′(3, 1), B′(3, 5), C′(0, 1).`, kind: 'common-error' },
    { content: `A rotation needs all three: center, angle, and direction — counterclockwise is positive, clockwise is negative.`, kind: 'tip' },
    { content: `About the origin: 90° counterclockwise (x, y) → (-y, x); 180° (x, y) → (-x, -y); 270° counterclockwise (x, y) → (y, -x).`, kind: 'tip' },
    { content: `Non-origin center (a, b): subtract the center, apply the origin rule, add the center back. The center never moves.`, kind: 'tip' },
    { content: `Rotations are rigid motions — lengths and angles are preserved, the image is congruent, and orientation is NOT reversed (that is the reflection's job).`, kind: 'tip' },
    { content: `The two quarter-turn rules differ by *which* coordinate gets the minus sign: 90° CCW is (x, y) → (-y, x); 270° CCW (= 90° CW) is (x, y) → (y, -x). Both swap. Say the direction out loud before you pick.`, kind: 'common-error' },
    { content: `Never negate both coordinates for a 90° turn — (-x, -y) is the 180° rule. If your image is on the opposite ray through the origin from the preimage, you did a half turn, not a quarter turn.`, kind: 'gotcha' },
    { content: `Before you touch an origin rule, check where the center is. If the center isn't the origin, subtract it first — otherwise the center itself moves, and the center is the ONE point that must map to itself.`, kind: 'common-error' },
    { content: `Self-check with quadrants: a CCW quarter turn moves Q IV → Q I → Q II → Q III. If your image landed in the quadrant on the other side, you used the wrong twin rule. This catches direction errors in seconds.`, kind: 'tip' },
    { content: `"Rotate 90°" is not a complete instruction. Write the center, the angle, AND the direction — e.g. R(P, 90°) with CCW understood as positive, CW as negative. A missing center is the most common omission.`, kind: 'vocab-note' },
    { content: `For 180° about (a, b) use (x, y) → (2a - x, 2b - y). The center is the midpoint of every point and its image — so check by averaging: midpoint of Q and Q′ should be exactly the center.`, kind: 'tip' },
    { content: `Rotations preserve orientation — a triangle lettered clockwise stays clockwise. If your image reads in the reverse order, you reflected, not rotated. Reversal is the reflection's signature, never a rotation's.`, kind: 'gotcha' },
    { content: `The center of rotation does not have to be inside the figure or even on it — it can be a vertex, a midpoint, or a point far away. When it's a vertex, that vertex is its own image; don't recompute it.`, kind: 'edge-case' },
  ],
};
