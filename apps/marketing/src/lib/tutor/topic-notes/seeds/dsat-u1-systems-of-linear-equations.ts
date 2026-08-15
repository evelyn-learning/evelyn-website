/**
 * Digital SAT — Unit 1 CED 1.4: Systems of Two Linear Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.systems-of-linear-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_SYSTEMS_OF_LINEAR_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.systems-of-linear-equations.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Systems of Two Linear Equations',
  planId: 'evelyn.testprep.dsat.systems-of-linear-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.systems-of-linear-equations.v1' }],
  theory: [
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Base procedure', content: `BASE PROCEDURE — SUBSTITUTION. Solve one equation for one variable, plug it into the other equation, solve the resulting one-variable equation, then back-substitute. Best when a variable is already isolated (e.g., y = 3x + 2).` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Base procedure', content: `BASE PROCEDURE — ELIMINATION. Multiply one or both equations so a variable's coefficients become equal (to subtract) or equal-and-opposite (to add), then combine the equations to cancel that variable. Best when neither equation is already solved for a variable — most SAT word-problem systems.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Trap', content: `TRAP — SCALE BEFORE YOU ELIMINATE. Many systems need BOTH equations multiplied by different constants before a variable cancels cleanly. Don't force-add two equations just because it's tempting — check the coefficients first, and when subtracting, distribute the negative sign across EVERY term of the equation being subtracted.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Trap', content: `TRAP — SOLUTION COUNT FROM COEFFICIENT RATIOS. Compare the x-coefficient ratio to the y-coefficient ratio between the two equations. If those ratios are EQUAL, the lines are parallel or identical. Then compare the constant ratio: matches too → INFINITELY MANY solutions (same line); doesn't match → NO solution (parallel, distinct lines).` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Trap', content: `TRAP — VARIABLE-COEFFICIENT k QUESTIONS. "For what value of k does this system have no solution / infinitely many solutions?" When k sits in a coefficient (not a constant), first solve for the k that makes the coefficient ratios match — that's the unique value. Then check whether the constants also match at that k to decide no-solution vs infinitely-many.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Trap', content: `TRAP — COMBINATION SHORTCUT. Some questions ask for x + y (or 2x − y, etc.) rather than each variable. Before solving for x and y individually, check whether adding, subtracting, or scaling the two equations directly produces that exact combination — it's often faster than a full solve.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the built-in calculator is available on EVERY math question. Typing both equations in and reading the intersection point instantly gives the solution, and instantly shows parallel (no intersection) or coincident (fully overlapping) lines for classification questions.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'definition', title: 'system of linear equations', content: `two or more linear equations in the same variables, considered together — a solution must satisfy all of them.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'definition', title: 'elimination method', content: 'scaling and adding or subtracting equations so one variable cancels out.' },
    { loId: 'dsat.systems-of-linear-equations', kind: 'definition', title: 'no solution (parallel lines)', content: `coefficient ratios match but the constant ratio doesn't — the lines never intersect.` },
    { loId: 'dsat.systems-of-linear-equations', kind: 'definition', title: 'infinitely many solutions (coincident lines)', content: `coefficient AND constant ratios all match — the two equations describe the same line.` },
  ],
  methods: [
    {
      title: 'Worked elimination scaled',
      steps: [
        `Neither variable's coefficients are equal-and-opposite yet, so scale first: multiply the second equation by 3 to match the x-coefficients: 3x + 12y = 66.`,
        `Subtract the first equation from this scaled version, distributing the subtraction across every term: (3x + 12y) − (3x + 2y) = 66 − 16 → 10y = 50 → y = 5.`,
        'Back-substitute into the second original equation: x + 4(5) = 22 → x = 2.',
        'Check in the first equation: 3(2) + 2(5) = 6 + 10 = 16 ✓.',
      ],
      example: { problem: 'Solve the system: 3x + 2y = 16 and x + 4y = 22. What is the value of y?', solution: 'y = 5 (and x = 2)' },
      relatedLoIds: ['dsat.systems-of-linear-equations'],
    },
    {
      title: 'Worked k trap',
      steps: [
        `k sits in a coefficient position, so first force the coefficient ratios to match: x-coefficient ratio is 4/k, y-coefficient ratio is 3/6. Set them equal: 4/k = 3/6 → 4/k = 1/2 → k = 8.`,
        `At k = 8, check whether the constants also match that same ratio (which would make it infinitely many instead of no solution): the second equation becomes 8x + 6y = 20, which divides by 2 to 4x + 3y = 10.`,
        `Compare to the first equation, 4x + 3y = 9. The constants (10 vs 9) do NOT match, so the lines are parallel but distinct — confirming NO solution at k = 8.`,
      ],
      example: { problem: `For what value of k does the system 4x + 3y = 9 and kx + 6y = 20 have NO solution?`, solution: 'k = 8' },
      relatedLoIds: ['dsat.systems-of-linear-equations'],
    },
  ],
  pointers: [
    { content: `Distribute the subtraction across every term: (5x + 2y) − (5x − 3y) = 5x + 2y − 5x + 3y = 5y. So 5y = 16 − 1 = 15 → y = 3. Then 5x + 2(3) = 16 → x = 2. Check equation 2: 5(2) − 3(3) = 10 − 9 = 1 ✓.`, kind: 'common-error' },
    { content: `Check coefficients before combining equations — scale one or both first, and distribute the negative sign across every term when subtracting.`, kind: 'tip' },
    { content: `Equal coefficient ratios mean parallel or identical lines; matching constant ratio too → infinitely many, mismatched → no solution.`, kind: 'tip' },
    { content: `k-in-a-coefficient questions: force the coefficient ratio match to find k first, then check the constants to classify no-solution vs infinitely-many.`, kind: 'tip' },
    { content: `Desmos graphs both lines and shows the intersection (or confirms parallel/overlapping) instantly — use it to solve or verify.`, kind: 'tip' },
    { content: `Read the last line before solving. Systems questions often ask for **y**, for **x + y**, or for **3x − 2y** — not for x. Circle what's requested; getting x = 2 correct and gridding it when the question wanted y = 5 is the single most common loss on this topic.`, kind: 'gotcha' },
    { content: `Wrong-variable answers are planted as choices. If you solve and your value appears as an option, that's no confirmation — the other variable's value is almost always also listed. Verify against the actual question stem, not against the answer list.`, kind: 'common-error' },
    { content: `For no-solution/infinitely-many questions, put both equations in the SAME form (both ax + by = c) before comparing ratios. Comparing y = 2x + 3 to 4x − 2y = 6 by eyeballing coefficients gives garbage — rearrange first.`, kind: 'common-error' },
    { content: `Combination questions signal themselves: 'What is the value of x + y?' with no answer choices for x or y alone. Try adding the two equations raw first — if the x-coefficients sum to 1 and the y-coefficients sum to 1, you're done in one line.`, kind: 'tip' },
    { content: `In k-questions, watch where k lives. k in a **coefficient** → solve the coefficient ratio for k. k in the **constant** (like \`6x + 15y = c\`) → the coefficient ratio is already fixed, so scale the whole first equation and read c off directly.`, kind: 'edge-case' },
    { content: `Subtracting equations: rewrite it as ADDING the negated equation. \`(5x + 2y) − (5x − 3y)\` becomes \`5x + 2y − 5x + 3y = 5y\`. Flipping every sign on paper beats trying to hold the distribution in your head under time pressure.`, kind: 'tip' },
    { content: `'No solution' ≠ 'x = 0' and 'infinitely many solutions' ≠ 'any x works for a specific y'. No solution means the two lines never meet at all; infinitely many means the equations are literally the same line rescaled.`, kind: 'vocab-note' },
    { content: `Desmos won't help if the system has a variable k or c in it — it needs numbers. Use a slider only if you already know what to look for; otherwise do the ratio algebra, then plug your k back in and graph to confirm parallel vs. overlapping.`, kind: 'edge-case' },
  ],
};
