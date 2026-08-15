/**
 * Algebra 1 — Unit 5 CED 5.2: Solving Systems by Substitution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.systems-substitution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U5_SYSTEMS_SUBSTITUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.systems-substitution.v1',
  course: 'Algebra 1',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Solving Systems by Substitution',
  planId: 'evelyn.hs.alg1.systems-substitution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.systems-substitution.v1' }],
  theory: [
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'What a solution is', content: `WHAT A SOLUTION IS — an (x, y) pair that makes BOTH equations true at once. On a graph that is the single point where the two lines cross.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'The routine', content: `THE ROUTINE — 1) ISOLATE one variable in one equation, 2) SUBSTITUTE that expression into the OTHER equation, 3) SOLVE the resulting one-variable equation, 4) BACK-SUBSTITUTE to get the second coordinate.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'Pick the easy variable', content: `PICK THE EASY VARIABLE — isolate a variable whose coefficient is already 1 or −1, so no fractions appear. In x + y = 5 either variable is easy; in 4x − 2y = 8 neither is.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'Parentheses always', content: `PARENTHESES ALWAYS — you are replacing a variable with a whole EXPRESSION, so wrap it: substituting y = 5 − x into 4x − 2y gives 4x − 2(5 − x), which distributes to 4x − 10 + 2x. Writing 4x − 2·5 − x loses the sign flip and wrecks the answer.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'Step 2 must use the other equation', content: `STEP 2 MUST USE THE OTHER EQUATION — substituting back into the equation you just rearranged only gives you something like 5 = 5, which is true and useless.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'You are not done at one number', content: `YOU ARE NOT DONE AT ONE NUMBER — a system solution is a POINT. After solving for x, back-substitute into the isolated equation (the easiest one) to get y, and write the answer as an ordered pair.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'When substitution wins', content: `WHEN SUBSTITUTION WINS — when an equation is already solved for a variable (y = 3x − 4) or has a coefficient of ±1. When the two equations have matching or opposite coefficients instead, elimination is the faster tool.` },
    { loId: 'alg1.systems-substitution', kind: 'framework', title: 'Two special endings', content: `TWO SPECIAL ENDINGS — if the variables cancel into a false statement like 0 = 6, there is NO solution (parallel lines); into a true statement like 0 = 0, there are infinitely many (the same line twice).` },
    { loId: 'alg1.systems-substitution', kind: 'definition', title: 'system of equations', content: `two or more equations taken together; a solution must satisfy all of them simultaneously.` },
    { loId: 'alg1.systems-substitution', kind: 'definition', title: 'back-substitution', content: 'plugging a found value back into an equation to recover the other variable.' },
  ],
  methods: [
    {
      title: 'Worked already isolated',
      steps: [
        'Equation 1 is already isolated for y, so step 1 is free.',
        'Substitute the expression into the OTHER equation: 2x + (3x − 4) = 11.',
        'Combine like terms: 5x − 4 = 11, so 5x = 15 and x = 3.',
        'Back-substitute into the isolated equation: y = 3(3) − 4 = 5.',
        'Solution: (3, 5). Check in equation 2: 2(3) + 5 = 11. ✓',
      ],
      example: { problem: 'Solve by substitution: y = 3x − 4 and 2x + y = 11', solution: '(x, y) = (3, 5)' },
      relatedLoIds: ['alg1.systems-substitution'],
    },
    {
      title: 'Worked parentheses trap',
      steps: [
        `Neither equation is isolated, so pick the easy one: x + y = 3 has coefficients of 1. Isolate y: y = 3 − x.`,
        'Substitute into the other equation WITH PARENTHESES: 3x − 2(3 − x) = 4.',
        `Distribute the −2 across both terms: 3x − 6 + 2x = 4. Note the +2x — the minus times the minus flips the sign.`,
        'Combine and solve: 5x − 6 = 4, so 5x = 10 and x = 2.',
        `Back-substitute: y = 3 − 2 = 1. Solution: (2, 1). Check: 3(2) − 2(1) = 4 ✓ and 2 + 1 = 3 ✓.`,
        `THE TRAP: dropping the parentheses gives 3x − 6 − x = 4, so 2x = 10 and x = 5, y = −2. Test it: 3(5) − 2(−2) = 19, not 4. Wrong.`,
      ],
      example: { problem: 'Solve by substitution: 3x − 2y = 4 and x + y = 3', solution: '(x, y) = (2, 1)' },
      relatedLoIds: ['alg1.systems-substitution'],
    },
  ],
  pointers: [
    { content: `Replacing y with an expression means writing it inside parentheses: 3x − (8 − x) = 3x − 8 + x = 4x − 8. Then 4x = 12 and x = 3. Sanity check the wrong route: x = 6 gives y = 2 and 3(6) − 2 = 16, not 4.`, kind: 'common-error' },
    { content: `A system solution is a POINT. Back-substitute: y = 8 − 3 = 5, so the solution is (3, 5). Check both: 3 + 5 = 8 ✓ and 3(3) − 5 = 4 ✓.`, kind: 'common-error' },
    { content: `Isolate, substitute, solve, back-substitute — and substitute into the OTHER equation.`, kind: 'tip' },
    { content: 'Wrap the substituted expression in parentheses, then distribute the sign.', kind: 'tip' },
    { content: 'Isolate the variable with coefficient 1 or −1 to avoid fractions.', kind: 'tip' },
    { content: `The answer is an ordered pair (x, y), not a single number — check it in both equations.`, kind: 'tip' },
    { content: `Variables cancel into a false statement → no solution; into a true statement → infinitely many.`, kind: 'tip' },
    { content: `Always wrap the substituted expression in parentheses. Replacing y with 8 − x in 3x − y gives 3x − (8 − x) = 3x − 8 + x. Writing 3x − 8 − x flips only one sign and gives a wrong answer every time.`, kind: 'common-error' },
    { content: `Substitute into the OTHER equation, never back into the one you just rearranged. If you end up with 5 = 5 or 8 = 8, you looped — go redo step 2 with the second equation.`, kind: 'gotcha' },
    { content: `One number is not an answer. A system solution is an ordered pair — after finding x, back-substitute to get y and write (x, y). Even when a question asks only for y, you usually have to find x first.`, kind: 'common-error' },
    { content: `Choose the variable with coefficient 1 or −1 to isolate. Isolating y in 4x − 2y = 8 when x + y = 5 is sitting right there just invites fractions and arithmetic slips.`, kind: 'tip' },
    { content: `If both variables vanish, read the leftover statement carefully: 0 = 6 (false) means NO solution / parallel lines; 0 = 0 (true) means infinitely many / same line. Don't write 'x = 0' in either case.`, kind: 'edge-case' },
    { content: `"Back-substitution" means plugging your found value in to get the *other* coordinate — not re-checking the value you already have. Use the already-isolated equation; it's the fastest.`, kind: 'vocab-note' },
    { content: `Verify in BOTH equations, not just the one you substituted into. A sign error can produce a pair that satisfies one equation while failing the other.`, kind: 'tip' },
    { content: `Substitution is not always the fastest tool: reach for it when an equation already reads y = ... or has a ±1 coefficient. When coefficients match or are opposites (3x + 2y and 3x − 2y), elimination beats it.`, kind: 'gotcha' },
  ],
};
