/**
 * Algebra 1 — Unit 6 CED 6.3: Exponential Functions & Their Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.exponential-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U6_EXPONENTIAL_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.exponential-functions.v1',
  course: 'Algebra 1',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Exponential Functions & Their Graphs',
  planId: 'evelyn.hs.alg1.exponential-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.exponential-functions.v1' }],
  theory: [
    { loId: 'alg1.exponential-functions', kind: 'framework', title: 'The form', content: `THE FORM — an exponential function is y = a·bˣ, where the variable sits in the EXPONENT. Compare x² (variable in the base, a parabola) with 2ˣ (variable in the exponent, a whole different shape).` },
    { loId: 'alg1.exponential-functions', content: `a IS THE y-INTERCEPT — at x = 0 the power collapses, because b⁰ = 1, so y = a·1 = a. The graph always passes through (0, a). For y = 4·3ˣ the y-intercept is 4, never 3.` },
    { loId: 'alg1.exponential-functions', content: `b IS THE CONSTANT RATIO — every time x goes up by 1, y gets MULTIPLIED by b. That is the fingerprint: not "add b", multiply by b.` },
    { loId: 'alg1.exponential-functions', content: `GROWTH vs DECAY — b > 1 gives growth (the graph rises to the right); 0 < b < 1 gives decay (it falls to the right); b = 1 is the flat line y = a. Standard exponentials use b > 0.` },
    { loId: 'alg1.exponential-functions', kind: 'framework', title: 'Graph shape', content: `GRAPH SHAPE — with a > 0 the curve stays above the x-axis forever, flattening toward the horizontal asymptote y = 0 on one side and shooting up on the other. It never crosses zero, so an exponential has no x-intercept.` },
    { loId: 'alg1.exponential-functions', content: `LINEAR vs EXPONENTIAL FROM A TABLE — with x values equally spaced, subtract consecutive y values: a constant DIFFERENCE means linear. Divide consecutive y values instead: a constant RATIO means exponential.` },
    { loId: 'alg1.exponential-functions', kind: 'framework', title: 'Evaluating', content: `EVALUATING — exponent FIRST, then multiply by a. For y = 5·2ˣ at x = 4: 2⁴ = 16, then 5·16 = 80. Never fold the 5 into the base to get 10⁴.` },
    { loId: 'alg1.exponential-functions', kind: 'framework', title: 'Going left', content: `GOING LEFT — negative inputs divide instead of multiply, since b⁻¹ = 1/b. For y = 5·3ˣ at x = −1, y = 5·(1/3) = 5/3.` },
    { loId: 'alg1.exponential-functions', kind: 'definition', title: 'exponential function', content: 'a function of the form y = a·bˣ — the variable is the exponent.' },
    { loId: 'alg1.exponential-functions', kind: 'definition', title: 'constant ratio', content: 'the fixed number b that each y value is multiplied by per unit step in x.' },
    { loId: 'alg1.exponential-functions', kind: 'definition', title: 'growth / decay factor', content: `b > 1 makes y larger each step (growth); 0 < b < 1 makes y smaller each step (decay).` },
  ],
  methods: [
    {
      title: 'Worked read and evaluate',
      steps: [
        'Match to y = a·bˣ: a = 4 and b = 3.',
        'y-intercept: at x = 0, 3⁰ = 1, so y = 4·1 = 4. The graph passes through (0, 4).',
        `b = 3 is greater than 1, so this is growth — y triples every time x goes up by 1.`,
        'Evaluate at x = 3: exponent first, 3³ = 27, then 4·27 = 108.',
        `Sense-check with the table: 4, 12, 36, 108 for x = 0, 1, 2, 3 — each entry is 3 times the one before. ✓`,
      ],
      example: { problem: `For y = 4·3ˣ, state the y-intercept, say whether it is growth or decay, and find y when x = 3.`, solution: 'y-intercept 4; growth (b = 3); y = 108 at x = 3' },
      relatedLoIds: ['alg1.exponential-functions'],
    },
    {
      title: 'Worked decay order trap',
      steps: [
        `Here a = 96 and b = 1/2. Since 1/2 is between 0 and 1, this is DECAY — y halves each step.`,
        `THE TRAP: do not multiply 96·(1/2) = 48 first and then raise it to the 4th power. That gives 48⁴ = 5,308,416, which is absurd for a shrinking function.`,
        'Exponent first: (1/2)⁴ = 1/16.',
        'Now multiply by a: 96·(1/16) = 6.',
        'Sense-check by halving four times from the y-intercept: 96 → 48 → 24 → 12 → 6. ✓',
      ],
      example: { problem: 'Evaluate y = 96·(1/2)ˣ at x = 4, and classify the function.', solution: 'y = 6; decay, with y-intercept 96' },
      relatedLoIds: ['alg1.exponential-functions'],
    },
  ],
  pointers: [
    { content: `They are not the same function. At x = 2, 2·5² = 2·25 = 50, while 10² = 100. Order of operations raises b to the power FIRST, then multiplies by a. Their y-intercepts differ too: 2·5⁰ = 2 versus 10⁰ = 1.`, kind: 'common-error' },
    { content: 'y = a·bˣ — the variable is the exponent, not the base.', kind: 'tip' },
    { content: 'a is the y-intercept, because b⁰ = 1; the graph always passes through (0, a).', kind: 'tip' },
    { content: `b > 1 is growth, 0 < b < 1 is decay, and b is the constant ratio applied per step.`, kind: 'tip' },
    { content: `Linear tables have a constant difference; exponential tables have a constant ratio.`, kind: 'tip' },
    { content: 'Evaluate the power first, then multiply by a: 5·2⁴ = 80, not 10⁴.', kind: 'tip' },
    { content: `Never fold \`a\` into the base. In y = a·bˣ the exponent applies **only to b**. So 2·5ˣ ≠ 10ˣ — check x = 2: 2·25 = 50 but 10² = 100.`, kind: 'common-error' },
    { content: `Evaluate the power FIRST, then multiply by a. For 96·(1/2)⁴: (1/2)⁴ = 1/16, then 96/16 = 6. Multiplying 96·(1/2) = 48 and then powering gives 48⁴ — a huge number for a *shrinking* function.`, kind: 'gotcha' },
    { content: `The y-intercept is a, not b. For y = 4·3ˣ the graph hits (0, 4) because 3⁰ = 1. Students who read '3' are reporting the growth factor by mistake.`, kind: 'common-error' },
    { content: `b is a **multiplier**, not an amount added. 'Constant ratio 3' means divide consecutive y's to get 3 — it does NOT mean y goes up by 3. Say 'triples each step,' not 'adds 3 each step.'`, kind: 'vocab-note' },
    { content: `From a table: check that the x-values are **equally spaced** before subtracting or dividing. Constant difference → linear; constant ratio → exponential. Uneven x-steps make both tests meaningless.`, kind: 'edge-case' },
    { content: `x² and 2ˣ are not the same kind of function. Variable in the **base** = power function (parabola); variable in the **exponent** = exponential. Check where x sits before you classify.`, kind: 'vocab-note' },
    { content: `With a > 0 an exponential has **no x-intercept** — it approaches y = 0 forever but never touches it. Don't set a·bˣ = 0 looking for a zero, and don't draw the curve crossing the axis.`, kind: 'edge-case' },
    { content: `Negative x doesn't make y negative — it divides. For y = 5·3ˣ at x = −1, y = 5·(1/3) = 5/3, still positive. b⁻ⁿ = 1/bⁿ.`, kind: 'gotcha' },
  ],
};
