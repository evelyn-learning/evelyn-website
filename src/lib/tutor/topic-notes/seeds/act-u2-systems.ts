/**
 * ACT — Unit 2 CED 2.3: Systems of Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.systems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_SYSTEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.systems.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Systems of Equations',
  planId: 'evelyn.testprep.act.systems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.systems.v1' }],
  theory: [
    { loId: 'act.systems', content: `SUBSTITUTION: solve one equation for a variable (best when a variable already has coefficient 1, or one equation is already "y = …"), then plug that expression into the other equation.` },
    { loId: 'act.systems', content: `ELIMINATION: add or subtract the two equations (scaling one first if needed) so one variable cancels. Fastest when coefficients are already equal, opposite, or easy multiples.` },
    { loId: 'act.systems', content: `SPEED TRICK: if the question asks for a COMBINATION like x + y, 2x − y, or 3x + 3y directly, look for a way to add/subtract/scale the given equations to land on exactly that combination — you often never need x and y separately.` },
    { loId: 'act.systems', content: `NUMBER OF SOLUTIONS from two linear equations: different slopes → exactly ONE solution (lines cross once). Same slope, different intercept → NO solution (parallel lines; reducing the system gives a false statement like 0 = 5). Same slope AND same intercept (one equation is a multiple of the other) → INFINITELY MANY solutions.` },
    { loId: 'act.systems', kind: 'framework', title: 'Trap', content: `TRAP — SIGN ERRORS: when subtracting one equation from another, distribute the subtraction to EVERY term on that side, including the constant. A dropped sign flips the answer.` },
    { loId: 'act.systems', content: `WORD PROBLEMS: name your two unknowns explicitly, then find two SEPARATE pieces of given information (e.g., a total count AND a total cost) to write your two equations — mixing the same fact into both equations gives an unsolvable or redundant system.` },
    { loId: 'act.systems', content: `ALWAYS check the final (x, y) pair in BOTH original equations, not just the one you used last — a value that satisfies only one equation is not the answer.` },
    { loId: 'act.systems', kind: 'definition', title: 'system of equations', content: `two or more equations sharing the same variables, solved together for values that satisfy all of them at once.` },
    { loId: 'act.systems', kind: 'definition', title: 'substitution', content: `solving one equation for a variable, then replacing that variable with the resulting expression in the other equation.` },
    { loId: 'act.systems', kind: 'definition', title: 'elimination', content: `adding or subtracting (scaled) equations so that one variable's terms cancel out.` },
    { loId: 'act.systems', kind: 'definition', title: 'coefficient', content: 'the number multiplying a variable, e.g., the 3 in 3x.' },
  ],
  methods: [
    {
      title: 'Worked elimination',
      steps: [
        `Look for a fast cancellation: the first equation has +y, the second has −y — adding the equations cancels y immediately.`,
        'Add term-by-term: (2x + y) + (x − y) = 11 + 1 → 3x = 12.',
        'Divide: x = 4.',
        `Back-substitute into the simpler equation to find y: x − y = 1 → 4 − y = 1 → y = 3.`,
        'Check in BOTH originals: 2(4) + 3 = 11 ✓ and 4 − 3 = 1 ✓.',
      ],
      example: { problem: 'Solve the system: 2x + y = 11 and x − y = 1. What is the value of x?', solution: 'x = 4 (and y = 3)' },
      relatedLoIds: ['act.systems'],
    },
    {
      title: 'Worked no solution trap',
      steps: [
        `Try elimination: scale the second equation by 2 so the x-coefficients match: 2(2x − 3y) = 2(5) → 4x − 6y = 10.`,
        'Compare to the first equation: 4x − 6y = 12.',
        `Same left side, DIFFERENT right side (12 ≠ 10) — this is a contradiction, not a solvable system.`,
        `TRAP: a student who subtracts carelessly gets 0 = 2, a false statement, and may think they made an arithmetic mistake and keep hunting for x and y. Instead, a false numeric statement is the SIGNAL to stop: it means the two lines are parallel (same slope, different intercepts).`,
        'Conclusion: the system has NO solution.',
      ],
      example: { problem: 'What can you conclude about the system: 4x − 6y = 12 and 2x − 3y = 5?', solution: 'No solution — the lines are parallel and never intersect.' },
      relatedLoIds: ['act.systems'],
    },
  ],
  pointers: [
    { content: `Subtract term-by-term on every part of both equations: (5x − 2x) + (3y − 3y) = 22 − 10 → 3x + 0 = 12 → 3x = 12, so x = 4.`, kind: 'common-error' },
    { content: `Elimination: add or scale-then-combine equations to cancel a variable; substitution: solve one equation for a variable and plug it into the other.`, kind: 'tip' },
    { content: `If the question asks for a combination like x + y or 2x − y directly, look for a shortcut combo of the two equations before solving for x and y separately.`, kind: 'tip' },
    { content: `Different slopes → one solution; same slope + different intercept → no solution; same line → infinitely many solutions.`, kind: 'tip' },
    { content: `Check your (x, y) pair in BOTH original equations — about 60 seconds per question.`, kind: 'tip' },
    { content: `Read the last line before you celebrate: the ACT often solves for x but asks for **y**, or for x + y, xy, or y − x. Circle the requested quantity before you start eliminating — the value you naturally get first is usually a trap answer choice.`, kind: 'gotcha' },
    { content: `"No solution" and "infinitely many" get decided by the CONSTANTS, not the variable terms. Once you scale so the x- and y-terms match, only compare the two right-hand numbers: equal → infinitely many, unequal → none.`, kind: 'tip' },
    { content: `If choices are simple numbers, plugging in beats algebra. Test a choice as x (or as the requested quantity) in BOTH equations — with the calculator this is often under 20 seconds, especially when coefficients are ugly fractions or decimals.`, kind: 'tip' },
    { content: `Watch for systems written in mismatched forms: one in y = mx + b, one in Ax + By = C. Don't assume different-looking equations are different lines — 'y = 2x + 3' and '4x − 2y = −6' are the SAME line (infinitely many solutions).`, kind: 'edge-case' },
    { content: `For 'for what value of k does the system have no solution?', set the coefficient ratios equal (a₁/a₂ = b₁/b₂) and ignore the constants — then verify the constants DON'T match. Same setup with matching constants gives infinitely many.`, kind: 'gotcha' },
    { content: `In word problems, check units before writing equation two: one equation counts items (a + c = 5), the other counts dollars (9a + 6c = 39). Two equations both counting the same thing means you missed a given fact.`, kind: 'common-error' },
    { content: `Elimination subtraction: rewrite as ADDING the negated equation. Turn 2x + 3y = 10 into −2x − 3y = −10 and add. This kills the dropped-sign error on the constant, which is where most systems mistakes actually happen.`, kind: 'common-error' },
    { content: `'Solution to the system' means the intersection POINT — an ordered pair. If choices are points, don't stop at x; if a graph is shown, the answer is where the lines cross, not an intercept or the point where either line meets an axis.`, kind: 'vocab-note' },
  ],
};
