/**
 * Algebra 1 — Unit 4 CED 4.3: Graphing with Slope-Intercept Form.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.slope-intercept-form.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U4_SLOPE_INTERCEPT_FORM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.slope-intercept-form.v1',
  course: 'Algebra 1',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Graphing with Slope-Intercept Form',
  planId: 'evelyn.hs.alg1.slope-intercept-form.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.slope-intercept-form.v1' }],
  theory: [
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'The form', content: `THE FORM — y = mx + b. Only two numbers matter: m, the number multiplied by x, and b, the number added on. Everything else in this lesson is reading them or using them.` },
    { loId: 'alg1.slope-intercept-form', content: `m IS THE SLOPE — rise over run, the change in y for every 1 unit increase in x. Positive m rises left to right, negative m falls, m = 0 is a horizontal line.` },
    { loId: 'alg1.slope-intercept-form', content: `b IS THE y-INTERCEPT — the value of y when x = 0, which is the point (0, b) where the line crosses the y-AXIS. It is not where the line crosses the x-axis.` },
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'Graphing from the equation', content: `GRAPHING FROM THE EQUATION — 1) plot (0, b), 2) from that point step the slope as rise/run, 3) plot the new point and draw the line through both. For y = (3/4)x − 2: start at (0, −2), go up 3 and right 4 to (4, 1).` },
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'Negative slope', content: `NEGATIVE SLOPE — write it over 1: m = −3 means −3/1, so from your starting point go right 1 and DOWN 3. Going down-and-right and up-and-left both work; they land on the same line.` },
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'Writing the equation from a graph', content: `WRITING THE EQUATION FROM A GRAPH — read b where the line crosses the y-axis, then count rise/run between two points the line passes through exactly, and assemble y = mx + b. Given a slope and any point instead, substitute the point into y = mx + b and solve for b.` },
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'In context', content: `IN CONTEXT — m is the "per one unit of x" amount (per mile, per hour, per month) and b is the starting amount before any x has accumulated. Units matter: for C = 25x + 40, m is 25 dollars per month and b is 40 dollars.` },
    { loId: 'alg1.slope-intercept-form', kind: 'framework', title: 'Order trap', content: `ORDER TRAP — y = 4 − 2x is still slope-intercept form; rewrite it as y = −2x + 4 to see that m = −2 and b = 4. m is whatever multiplies x, not whichever number is written first.` },
    { loId: 'alg1.slope-intercept-form', kind: 'definition', title: 'slope', content: `the rise over the run between any two points on a line — how much y changes per 1 unit of x.` },
    { loId: 'alg1.slope-intercept-form', kind: 'definition', title: 'y-intercept', content: 'the y-value where the line crosses the y-axis; the output when the input is 0.' },
  ],
  methods: [
    {
      title: 'Worked graph from equation',
      steps: [
        'Read the two numbers off the form: m = 3/4 and b = −2.',
        'Plot the y-intercept first: the point (0, −2) on the y-axis.',
        'Step the slope as rise/run: from (0, −2) go up 3 and right 4, landing on (4, 1).',
        `Do it once more for a third point: from (4, 1) go up 3 and right 4 to (8, 4). Draw the line through all three.`,
        `Check with the equation: at x = 8, y = (3/4)(8) − 2 = 6 − 2 = 4 ✓. Slope 3/4, y-intercept −2.`,
      ],
      example: { problem: 'Graph y = (3/4)x − 2 and state the slope and y-intercept.', solution: 'Slope m = 3/4, y-intercept b = −2; line through (0, −2), (4, 1), (8, 4).' },
      relatedLoIds: ['alg1.slope-intercept-form'],
    },
    {
      title: 'Worked reordered negative',
      steps: [
        `The student read left to right. m is the number MULTIPLIED by x, so rewrite in order: y = −2x + 4.`,
        'Now the two numbers are clear: m = −2 and b = 4.',
        'Plot the y-intercept (0, 4).',
        `Write the slope over 1: −2/1. From (0, 4) go right 1 and down 2 to (1, 2); again to (2, 0).`,
        `Check with the equation: at x = 2, y = 4 − 2(2) = 0 ✓, and at x = 3, y = 4 − 6 = −2, matching the point (3, −2) on the same line.`,
      ],
      example: { problem: `Graph y = 4 − 2x. A student says m = 4 and b = −2. Fix the reading, then graph it.`, solution: 'm = −2 and b = 4; line falls through (0, 4), (1, 2), (2, 0).' },
      relatedLoIds: ['alg1.slope-intercept-form'],
    },
  ],
  pointers: [
    { content: `Slope is RISE over RUN, so 2/5 means up 2 and right 5: from (0, 1) the next point is (5, 3). Check it in the equation: (2/5)(5) + 1 = 2 + 1 = 3 ✓. The student's point fails the same check — at x = 2 the line is only at (2/5)(2) + 1 = 1.8, not 6.`, kind: 'common-error' },
    { content: `y = mx + b: m is the slope (rise/run, the per-unit rate), b is the y-intercept (the value at x = 0).`, kind: 'tip' },
    { content: `Graph it by plotting (0, b) first, then stepping rise over run — a negative slope goes over 1 and down.`, kind: 'tip' },
    { content: `From a graph: read b at the y-axis, count rise/run between two points. From a slope and a point: substitute and solve for b.`, kind: 'tip' },
    { content: `y = 4 − 2x means m = −2, b = 4 — m is whatever multiplies x, not the first number written.`, kind: 'tip' },
    { content: `In y = mx + b, m is whatever multiplies x — not whichever number appears first. For y = 4 − 2x, rewrite as y = −2x + 4 before reading anything: m = −2, b = 4.`, kind: 'common-error' },
    { content: `Slope is RISE over RUN: the top number is the vertical move. For m = 2/5, go up 2 and right 5 — not right 2 and up 5. Swapping them gives a completely different line.`, kind: 'common-error' },
    { content: `b is where the line crosses the **y-axis**, at (0, b) — never the x-axis. Say 'y-intercept' and write the point with the 0 first: (0, −2), not (−2, 0).`, kind: 'vocab-note' },
    { content: `For a whole-number slope, write it as a fraction over 1 before stepping. m = −3 is −3/1: right 1, down 3. Without the /1, students often move 3 sideways instead.`, kind: 'tip' },
    { content: `Put the negative sign on ONE part of the step, not both. For m = −2/1 go right 1 and down 2, OR left 1 and up 2 — both land on the same line. Down AND left gives the wrong line.`, kind: 'gotcha' },
    { content: `Given a slope and a point that is NOT on the y-axis, you can't just read b — substitute the point's x and y into y = mx + b and solve. Slope 4 through (2, 11): 11 = 8 + b, so b = 3.`, kind: 'gotcha' },
    { content: `m = 0 gives y = b, a flat horizontal line — still slope-intercept form. A vertical line like x = 3 has undefined slope and can never be written as y = mx + b.`, kind: 'edge-case' },
    { content: `In context, attach units to both numbers: for C = 25x + 40, m = 25 dollars **per month** and b = 40 dollars **at month 0**. b is a one-time starting amount, not a monthly charge.`, kind: 'tip' },
  ],
};
