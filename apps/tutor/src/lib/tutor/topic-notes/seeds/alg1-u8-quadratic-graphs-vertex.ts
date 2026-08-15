/**
 * Algebra 1 — Unit 8 CED 8.1: Quadratic Functions: Graphs & Vertex Form.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.quadratic-graphs-vertex.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U8_QUADRATIC_GRAPHS_VERTEX: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1',
  course: 'Algebra 1',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Quadratic Functions: Graphs & Vertex Form',
  planId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.quadratic-graphs-vertex.v1' }],
  theory: [
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'Anatomy', content: `ANATOMY — every quadratic graphs as a parabola: a U-shaped curve with exactly one turning point, the VERTEX, and a vertical mirror line through it, the AXIS OF SYMMETRY. Naming those two things is most of graphing.` },
    { loId: 'alg1.quadratic-graphs-vertex', content: `THE SIGN OF a DECIDES THE DIRECTION — a > 0 opens UP so the vertex is the lowest point (a MINIMUM); a < 0 opens DOWN so the vertex is the highest point (a MAXIMUM). Nothing else in the equation changes this.` },
    { loId: 'alg1.quadratic-graphs-vertex', content: `THE SIZE OF a ONLY CHANGES WIDTH — |a| > 1 makes the parabola narrower, 0 < |a| < 1 makes it wider. It never moves the vertex.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'Vertex form', content: `VERTEX FORM — y = a(x − h)² + k hands you the vertex (h, k) for free, and the axis of symmetry is the line x = h. That is the whole reason this form exists.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'The sign-of-h trap', content: `THE SIGN-OF-H TRAP — the form SUBTRACTS h, so what you see inside the parentheses is the opposite of h. y = (x + 5)² − 2 is really (x − (−5))² − 2, so h = −5 and the vertex is (−5, −2), not (5, −2). Safety check: h is the x-value that makes the inside equal zero.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'K does not flip', content: `K DOES NOT FLIP — k is ADDED, so you read it off exactly as written. Only the inside of the parentheses plays the sign game; the second coordinate does not.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'Vertex from standard form', content: `VERTEX FROM STANDARD FORM — for y = ax² + bx + c the axis of symmetry is x = −b/(2a). Compute that x, then SUBSTITUTE it back into the equation to get the y-coordinate. Do not use c as the y-coordinate — c is the y-intercept (0, c), a completely different point.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'framework', title: 'Max/min in context', content: `MAX/MIN IN CONTEXT — in a real model the vertex answers two different questions: the x-coordinate is WHEN or AT WHAT INPUT the best case happens, the y-coordinate is HOW MUCH it is. Read the question to see which one it wants.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'definition', title: 'vertex', content: `the single turning point of a parabola — its highest or lowest point; (h, k) in vertex form.` },
    { loId: 'alg1.quadratic-graphs-vertex', kind: 'definition', title: 'axis of symmetry', content: `the vertical line x = h that folds the parabola onto itself, so every point has a mirror twin.` },
  ],
  methods: [
    {
      title: 'Worked read vertex form',
      steps: [
        'Match to y = a(x − h)² + k: a = 2, h = 3, k = −8.',
        'Vertex is (h, k) = (3, −8). Axis of symmetry is x = 3.',
        `a = 2 is positive, so the parabola opens UP and the vertex is a minimum — the smallest y-value this function ever reaches is −8.`,
        `y-intercept: substitute x = 0. y = 2(0 − 3)² − 8 = 2(9) − 8 = 18 − 8 = 10, giving the point (0, 10).`,
        `Symmetry gives a free point: (0, 10) is 3 units left of the axis x = 3, so its mirror twin is 3 units right, at (6, 10).`,
        `x-intercepts: set y = 0. 2(x − 3)² = 8, so (x − 3)² = 4, so x − 3 = ±2, giving x = 5 and x = 1 — points (1, 0) and (5, 0).`,
        `Sketch: an upward U with its bottom at (3, −8), crossing the x-axis at 1 and 5 and the y-axis at 10.`,
      ],
      example: { problem: `For y = 2(x − 3)² − 8, name the vertex, the axis of symmetry, and the direction it opens — then find enough points to sketch it.`, solution: 'Vertex (3, −8); axis of symmetry x = 3; opens up (minimum value −8)' },
      relatedLoIds: ['alg1.quadratic-graphs-vertex'],
    },
    {
      title: 'Worked standard form max',
      steps: [
        `This is standard form with a = −16, b = 64, c = 5. Since a is negative the parabola opens DOWN, so the vertex is a MAXIMUM — good, the question asks for a highest point.`,
        'Axis of symmetry: t = −b/(2a) = −(64)/(2 · (−16)) = −64/(−32) = 2 seconds.',
        `WATCH THE SIGN: the formula is −b/(2a), not b/(2a). Dropping that leading minus gives 64/(−32) = −2 seconds — a time before the jet started, which is your signal that a sign got lost.`,
        `Now substitute t = 2 back into the ORIGINAL equation for the height: h = −16(2)² + 64(2) + 5 = −16(4) + 128 + 5 = −64 + 128 + 5 = 69.`,
        `Do not answer 5. The c-value 5 is the starting height at t = 0 (the y-intercept), not the maximum.`,
        'Vertex is (2, 69): the jet peaks 2 seconds in, at a height of 69 feet.',
      ],
      example: { problem: `A water jet leaves a fountain nozzle and its height in feet after t seconds is h = −16t² + 64t + 5. When does the jet reach its highest point, and how high is it?`, solution: 'Maximum height 69 feet, reached at t = 2 seconds' },
      relatedLoIds: ['alg1.quadratic-graphs-vertex'],
    },
  ],
  pointers: [
    { content: `The x = 3 is right, but the y-coordinate must come from the equation: y = (3)² − 6(3) + 5 = 9 − 18 + 5 = −4. The vertex is (3, −4). The point (0, 5) is the y-intercept — a different point on the same parabola. Rule: −b/(2a) gives you only HALF the vertex; you always have to plug it back in.`, kind: 'common-error' },
    { content: 'y = a(x − h)² + k → vertex (h, k), axis of symmetry x = h.', kind: 'tip' },
    { content: `The sign inside the parentheses is OPPOSITE h: (x + 5)² means h = −5. k is read straight off.`, kind: 'tip' },
    { content: `a > 0 opens up, vertex is a minimum; a < 0 opens down, vertex is a maximum. |a| only changes the width.`, kind: 'tip' },
    { content: `From standard form: x = −b/(2a), then SUBSTITUTE back for the y-coordinate — never use c.`, kind: 'tip' },
    { content: `In a word problem the vertex x tells you WHEN/at what input, the vertex y tells you HOW MUCH.`, kind: 'tip' },
    { content: `In \`y = a(x − h)² + k\`, flip the sign of what's inside the parentheses but NOT of k. \`(x + 5)² − 7\` → vertex (−5, −7). Safety check: h is the x-value that makes the inside equal zero.`, kind: 'common-error' },
    { content: `\`x = −b/(2a)\` gives you only HALF the vertex. Always substitute that x back into the original equation for the y-coordinate — never grab c.`, kind: 'common-error' },
    { content: `Don't confuse the vertex with the y-intercept. In standard form, c gives the point (0, c) — a starting value or where the graph crosses the y-axis, not the max or min.`, kind: 'vocab-note' },
    { content: `Keep the leading minus in \`−b/(2a)\`. If b is already negative, \`−b\` becomes positive: for \`y = 2x² − 12x + 5\`, x = −(−12)/(2·2) = 3, not −3. Two negatives, two chances to slip.`, kind: 'gotcha' },
    { content: `Answer the question that was asked: the vertex x tells you WHEN (or at what input) the best case happens; the vertex y tells you HOW MUCH. "Largest area" wants the y-value; "what width" wants the x-value.`, kind: 'tip' },
    { content: `Write the axis of symmetry as an equation, \`x = 3\`, not as the number 3 or as \`y = 3\`. It's a vertical line, so it's always x = something.`, kind: 'vocab-note' },
    { content: `\`a\` never moves the vertex. Changing a from 2 to 1/2 only widens the curve; only h and k relocate it. And a negative a means opens down — it does not mean the vertex is below the x-axis.`, kind: 'gotcha' },
    { content: `A parabola can have 2, 1, or 0 x-intercepts — but always exactly one vertex and one y-intercept. If \`(x − h)² = negative\` when you set y = 0, the graph simply never crosses the x-axis.`, kind: 'edge-case' },
  ],
};
