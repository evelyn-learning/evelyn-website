/**
 * Digital SAT — Unit 1 CED 1.3: Linear Equations in Two Variables & Their Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.linear-equations-two-vars.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_LINEAR_EQUATIONS_TWO_VARS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.linear-equations-two-vars.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Linear Equations in Two Variables & Their Graphs',
  planId: 'evelyn.testprep.dsat.linear-equations-two-vars.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.linear-equations-two-vars.v1' }],
  theory: [
    { loId: 'dsat.linear-equations-two-vars', kind: 'framework', title: 'Three forms', content: `THREE FORMS — slope-intercept y = mx + b (m = slope, b = y-intercept), standard form Ax + By = C, and point-slope y − y₁ = m(x − x₁). The SAT tests moving between all three, often forcing a rearrangement before the question can be answered.` },
    { loId: 'dsat.linear-equations-two-vars', content: `SLOPE FROM TWO POINTS: m = (y₂ − y₁) / (x₂ − x₁). SLOPE FROM STANDARD FORM: m = −A/B — a shortcut that skips fully solving for y.` },
    { loId: 'dsat.linear-equations-two-vars', content: `Y-INTERCEPT is the value of y when x = 0 — the graph's crossing point on the y-axis, and in context the STARTING VALUE. X-INTERCEPT is the value of x when y = 0 — set the other variable to zero and solve.` },
    { loId: 'dsat.linear-equations-two-vars', content: `PARALLEL LINES have the SAME slope and different intercepts. PERPENDICULAR LINES have slopes that are NEGATIVE RECIPROCALS of each other — multiply to −1.` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'framework', title: 'Graph-matching trap', content: `GRAPH-MATCHING TRAP — given an equation, pick its graph (or vice versa). Check slope SIGN first (rising vs falling), then steepness, then the y-intercept — usually enough to eliminate 3 of 4 choices without plotting every point.` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'framework', title: 'Word-problem context', content: `WORD-PROBLEM CONTEXT — the SAT loves "what does [the slope / the y-intercept] represent" questions. Slope = rate of change ("per unit"); y-intercept = the value when the input is zero (a flat fee, a starting amount, an initial population).` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — graph a given equation and each candidate answer to instantly compare slope and intercept, or type two points to have Desmos draw the line and read the equation off the display.` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'definition', title: 'standard form', content: `a linear equation written as Ax + By = C; slope = −A/B and intercepts come from setting x or y to zero.` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'definition', title: 'point-slope form', content: `y − y₁ = m(x − x₁), built directly from one known point and the slope — useful before you know the y-intercept.` },
    { loId: 'dsat.linear-equations-two-vars', kind: 'definition', title: 'x-intercept', content: `the point where a line crosses the x-axis, found by setting y = 0 and solving for x.` },
  ],
  methods: [
    {
      title: 'Worked point slope',
      steps: [
        `Start from point-slope form: y − y₁ = m(x − x₁), using m = 4 and (x₁, y₁) = (2, 5).`,
        'y − 5 = 4(x − 2) → y − 5 = 4x − 8.',
        'Add 5 to both sides: y = 4x − 3.',
        'Check: at x = 2, y = 4(2) − 3 = 5. ✓ Matches the given point.',
      ],
      example: { problem: `A line has slope 4 and passes through the point (2, 5). Write its equation in slope-intercept form.`, solution: 'y = 4x − 3' },
      relatedLoIds: ['dsat.linear-equations-two-vars'],
    },
    {
      title: 'Worked perpendicular standard form',
      steps: [
        `Find the slope of k. Solve for y: 6y = −3x + 12 → y = −(1/2)x + 2, so slope of k = −1/2. (Shortcut: for Ax + By = C, slope = −A/B = −3/6 = −1/2 — same answer without fully isolating y.)`,
        'A perpendicular slope is the NEGATIVE RECIPROCAL: flip and negate −1/2 to get 2.',
        'The new line passes through (0, 1) — that point IS the y-intercept, so b = 1.',
        'Equation: y = 2x + 1.',
        'Check: slopes multiply to −1: (−1/2)(2) = −1. ✓ Perpendicular confirmed.',
      ],
      example: { problem: `Line k is given by 3x + 6y = 12. A line perpendicular to k passes through (0, 1). Write its equation in slope-intercept form.`, solution: 'y = 2x + 1' },
      relatedLoIds: ['dsat.linear-equations-two-vars'],
    },
  ],
  pointers: [
    { content: `For Ax + By = C, the slope is −A/B, not A/B — rearranging toward y = mx + b flips a sign. Here slope = −4/2 = −2. Check by solving fully: 2y = −4x + 10 → y = −2x + 5, confirming slope = −2.`, kind: 'common-error' },
    { content: `y = mx + b: m is slope (rate of change), b is y-intercept (starting value); standard form gives slope as −A/B.`, kind: 'tip' },
    { content: `Slope from two points: (y₂ − y₁)/(x₂ − x₁). Intercepts: set the OTHER variable to zero and solve.`, kind: 'tip' },
    { content: `Parallel lines share slope; perpendicular slopes are negative reciprocals (product = −1).`, kind: 'tip' },
    { content: `On graph-matching questions, check slope sign and steepness before the y-intercept — Desmos verifies any candidate instantly.`, kind: 'tip' },
    { content: `Slope formula sign trap: keep both subtractions in the SAME order. (y₂−y₁)/(x₂−x₁), never (y₂−y₁)/(x₁−x₂). Flipping one gives the negative of the true slope — an answer the SAT always plants as a choice.`, kind: 'common-error' },
    { content: `"Y-intercept" can mean the number b OR the point (0, b). If a student-produced response asks for the y-intercept, grid the number only; on multiple choice, check whether choices are ordered pairs before picking.`, kind: 'vocab-note' },
    { content: `Negative reciprocal ≠ just flipping or just negating. Slope 3 → −1/3 (not 1/3, not −3). Slope −2/5 → 5/2. Verify by multiplying: product must equal −1. Both wrong versions appear as answer choices.`, kind: 'gotcha' },
    { content: `Read the question stem to the last word: "slope," "y-intercept," "x-intercept," and "value of y when x = 0" all look alike when skimming. Many missed problems are correct lines with the wrong quantity reported.`, kind: 'tip' },
    { content: `Horizontal line y = 5 has slope 0; vertical line x = 5 has UNDEFINED slope and can't be written as y = mx + b. Their perpendiculars are each other — the negative-reciprocal rule breaks down here, so handle by inspection.`, kind: 'edge-case' },
    { content: `In context questions, units decode the answer: slope carries "per" units (dollars per mile, people per year); the intercept carries the bare unit (dollars, people). Match the units in the choice to the quantity before reading the words.`, kind: 'tip' },
    { content: `Standard form slope is −A/B, but only after the equation is written as Ax + By = C. For 12 = 5y − 2x, rewrite as −2x + 5y = 12 first: slope = 2/5, not −2/5 or 5/2.`, kind: 'gotcha' },
    { content: `"Parallel" questions need the given point too — same slope alone doesn't determine the line. If a choice matches the slope but fails when you plug in the point, it's the trap answer (often the original equation itself).`, kind: 'common-error' },
  ],
};
