/**
 * Geometry — Unit 4 CED 4.2: Reflections.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.reflections.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U4_REFLECTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.reflections.v1',
  course: 'Geometry',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Reflections',
  planId: 'evelyn.hs.geom.reflections.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.reflections.v1' }],
  theory: [
    { loId: 'geom.reflections', kind: 'framework', title: 'The definition', content: `THE DEFINITION — a reflection across line m sends each point P to the point P' such that m is the perpendicular bisector of segment PP'. In plain words: P and P' sit on opposite sides of m, the same distance from m, and PP' ⊥ m. Everything else in this lesson is a shortcut for that sentence.` },
    { loId: 'geom.reflections', kind: 'framework', title: 'Points on the mirror do not move', content: `POINTS ON THE MIRROR DO NOT MOVE — if P is on line m, then P' = P. Those fixed points are what pins a reflection in place, and they are why a reflected figure can overlap the original.` },
    { loId: 'geom.reflections', kind: 'framework', title: 'The four standard rules', content: `THE FOUR STANDARD RULES — across the x-axis: (x, y) → (x, -y). Across the y-axis: (x, y) → (-x, y). Across y = x: (x, y) → (y, x) — the coordinates SWAP, no sign change. Across y = -x: (x, y) → (-y, -x).` },
    { loId: 'geom.reflections', kind: 'framework', title: 'Any horizontal or vertical mirror', content: `ANY HORIZONTAL OR VERTICAL MIRROR — across y = k: (x, y) → (x, 2k - y). Across x = h: (2h - x, y). You never have to memorize these: count how far the point is from the line, then count the same distance to the other side.` },
    { loId: 'geom.reflections', kind: 'framework', title: 'Rigid motion', content: `RIGID MOTION — a reflection preserves every length and every angle measure, so the image is CONGRUENT to the original: △ABC ≅ △A'B'C'. Only positions change, never sizes.` },
    { loId: 'geom.reflections', kind: 'framework', title: 'Orientation reverses', content: `ORIENTATION REVERSES — this is the signature of a reflection. If A, B, C read counterclockwise around the original triangle, then A', B', C' read CLOCKWISE around the image. Translations and rotations never do this, so no slide or turn can ever reproduce a single reflection.` },
    { loId: 'geom.reflections', content: `THE CLASSIC ERROR: NEGATING THE WRONG COORDINATE — reflecting across the x-axis changes the y-coordinate, because y measures distance FROM the x-axis. Name the mirror, ask which coordinate measures distance from it, and flip only that one.` },
    { loId: 'geom.reflections', kind: 'definition', title: 'line of reflection', content: `the mirror line — the perpendicular bisector of every segment joining a point to its image.` },
    { loId: 'geom.reflections', kind: 'definition', title: 'orientation', content: `the rotational order (clockwise or counterclockwise) in which a figure's labeled vertices are read; a reflection reverses it.` },
  ],
  methods: [
    {
      title: 'Worked reflect y axis',
      steps: [
        `Identify the mirror: the y-axis is the vertical line x = 0, so the x-coordinate measures distance from it — the rule is (x, y) → (-x, y).`,
        `Apply it vertex by vertex: D(2, 1) → D'(-2, 1); E(6, 1) → E'(-6, 1); F(2, 4) → F'(-2, 4).`,
        `Check with the definition, not the rule: D is 2 units right of the y-axis, and D' is 2 units left of it, on the same horizontal line — so the y-axis bisects DD' perpendicularly. ✓`,
        `Check congruence: DE was 6 - 2 = 4 units long; D'E' is from -2 to -6, also 4 units. Lengths survived, as they must for a rigid motion.`,
        `Orientation: reading D → E → F you travel counterclockwise; reading D' → E' → F' you travel clockwise. The reflection flipped the orientation while keeping the triangle congruent.`,
      ],
      example: { problem: `Triangle DEF has vertices D(2, 1), E(6, 1), and F(2, 4). Reflect it across the y-axis and give the coordinates of D', E', and F'. Then state how the orientation changed.`, solution: `D'(-2, 1), E'(-6, 1), F'(-2, 4) — congruent to △DEF, with orientation reversed from counterclockwise to clockwise.` },
      relatedLoIds: ['geom.reflections'],
    },
    {
      title: 'Worked horizontal line trap',
      steps: [
        `Name the mirror: y = 3 is a horizontal line, so vertical distance is what matters and only the y-coordinate changes. The x-coordinates stay 5, 5, and 1.`,
        `Reflect A by counting: A(5, 8) is 8 - 3 = 5 units ABOVE the line, so A' is 5 units below it, at y = 3 - 5 = -2. A'(5, -2).`,
        `Reflect B and C: both sit at y = 3, which is ON the mirror line — so they do not move. B'(5, 3) and C'(1, 3).`,
        `Same answer from the rule (x, y) → (x, 2k - y) with k = 3: A gives (5, 6 - 8) = (5, -2); B gives (5, 6 - 3) = (5, 3). ✓`,
        `The error: "flip the y-sign" is the rule for the x-axis only, because y = 0 is the ONLY horizontal line whose reflection sends y to -y. The classmate reflected across y = 0 instead of y = 3, and even moved B and C, which were sitting on the mirror.`,
      ],
      example: { problem: `Reflect the points A(5, 8), B(5, 3), and C(1, 3) across the horizontal line y = 3. A classmate answers A'(5, -8), B'(5, -3), C'(1, -3) by "flipping the y-signs." Find the correct images and explain the error.`, solution: `A'(5, -2), B'(5, 3), C'(1, 3) — points on the line of reflection stay fixed, and (x, y) → (x, -y) is only valid for the x-axis.` },
      relatedLoIds: ['geom.reflections'],
    },
  ],
  pointers: [
    { content: `The x-axis is the mirror, and the y-coordinate is what measures distance from the x-axis — so y flips and x stays: (-4, 5) → (-4, -5). Check it against the definition: the point is 5 units above the x-axis, so the image is 5 units below, directly underneath. The answer (4, 5) is the reflection across the y-axis instead.`, kind: 'common-error' },
    { content: `Definition first: the line of reflection is the perpendicular bisector of every segment joining a point to its image — equal distance, opposite sides, PP' ⊥ m.`, kind: 'tip' },
    { content: `Rules: x-axis (x, y) → (x, -y); y-axis (x, y) → (-x, y); y = x (x, y) → (y, x); y = k (x, y) → (x, 2k - y); x = h (2h - x, y).`, kind: 'tip' },
    { content: 'Points sitting on the line of reflection do not move.', kind: 'tip' },
    { content: `Reflections are rigid motions: the image is congruent — every length and angle is preserved.`, kind: 'tip' },
    { content: `Orientation reverses. That flip is the fingerprint of a reflection, and no translation or rotation can imitate it.`, kind: 'tip' },
    { content: `Name the mirror, then ask which coordinate measures distance from it. Reflecting across the **x-axis** flips **y**: (x, y) → (x, −y). Across the **y-axis** flips **x**. The axis in the name is NOT the coordinate you negate.`, kind: 'common-error' },
    { content: `Across y = x the coordinates **swap** with no sign change: (5, −2) → (−2, 5). Across y = −x you swap AND negate both: (x, y) → (−y, −x). Don't add stray negatives to the y = x rule.`, kind: 'gotcha' },
    { content: `"Flip the y-sign" only works for y = 0. For y = 3, count distance: (5, 8) is 5 above, so the image is 5 below at (5, −2) — not (5, −8). Same idea for x = h vertical mirrors.`, kind: 'common-error' },
    { content: `Check every vertex for sitting ON the mirror before you move it. If P is on line m, then P' = P — identical coordinates, no change. A reflected figure can genuinely overlap the original.`, kind: 'edge-case' },
    { content: `Say "line of reflection" or "mirror line," not "line of symmetry" — a figure may have no symmetry at all and still be reflected across a line. And "orientation" means the clockwise/counterclockwise reading order of labeled vertices, not which way the figure points.`, kind: 'vocab-note' },
    { content: `Reflection reverses orientation; translations and rotations preserve it. So if △A'B'C' reads the opposite way around from △ABC, no single slide or turn can produce it — a reflection (or an odd number of them) is involved.`, kind: 'tip' },
    { content: `"Congruent" survives every reflection: if your image has a side longer or shorter than the original, you made an arithmetic slip. Recompute one side length as a self-check before writing the answer.`, kind: 'tip' },
    { content: `Verify with the definition, not the rule you just used: are P and P' on opposite sides, the same distance from m, with PP' ⊥ m? Circular checking (reapplying the same memorized rule) catches nothing.`, kind: 'gotcha' },
  ],
};
