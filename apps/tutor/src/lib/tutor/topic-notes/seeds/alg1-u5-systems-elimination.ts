/**
 * Algebra 1 — Unit 5 CED 5.3: Solving Systems by Elimination.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.systems-elimination.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U5_SYSTEMS_ELIMINATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.systems-elimination.v1',
  course: 'Algebra 1',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Solving Systems by Elimination',
  planId: 'evelyn.hs.alg1.systems-elimination.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.systems-elimination.v1' }],
  theory: [
    { loId: 'alg1.systems-elimination', kind: 'framework', title: 'Why it is legal', content: `WHY IT IS LEGAL — equals added to equals stay equal. If A = B and C = D then A + C = B + D, so you may add two true equations term by term and the result is still true. Multiplying an entire equation by a nonzero constant is legal too — as long as BOTH sides get multiplied.` },
    { loId: 'alg1.systems-elimination', content: `OPPOSITE COEFFICIENTS → ADD — if one variable appears as +2y in one equation and −2y in the other, adding the equations cancels it: 3x + 2y = 12 plus 5x − 2y = 4 gives 8x = 16.` },
    { loId: 'alg1.systems-elimination', content: `MATCHING COEFFICIENTS → SUBTRACT — if the variable appears as +2y in both, subtract one equation from the other and it cancels.` },
    { loId: 'alg1.systems-elimination', content: `NEITHER MATCHES → SCALE FIRST — multiply one or both equations so the target variable's coefficients become equal or opposite. To kill y in 3x + 2y = 18 and 2x + 5y = 23, multiply the first by 5 and the second by 2: 15x + 10y = 90 and 4x + 10y = 46, then subtract. Aim for the least common multiple of the two coefficients.` },
    { loId: 'alg1.systems-elimination', kind: 'framework', title: 'The subtraction trap', content: `THE SUBTRACTION TRAP — subtracting an equation means subtracting EVERY term of it. (5x + 2y) − (3x + 2y) = 2x, not 2x + 4y. Students who drop the parentheses distribute the minus to the first term only. Safer habit: multiply the second equation by −1 and ADD, so there is nothing to distribute.` },
    { loId: 'alg1.systems-elimination', kind: 'framework', title: 'Finish the job', content: `FINISH THE JOB — solving the one-variable equation is only half. Back-substitute into an ORIGINAL equation (never a scaled one, where an error would hide), then check the pair in the OTHER original equation.` },
    { loId: 'alg1.systems-elimination', kind: 'framework', title: 'Ending 1', content: `ENDING 1 — NO SOLUTION: both variables cancel and you are left with something false like 0 = 24. The lines are parallel — same slope, different intercepts — so they never meet.` },
    { loId: 'alg1.systems-elimination', kind: 'framework', title: 'Ending 2', content: `ENDING 2 — INFINITELY MANY: both variables cancel into something true like 0 = 0. The two equations describe the SAME line, so every point on it is a solution.` },
    { loId: 'alg1.systems-elimination', kind: 'definition', title: 'elimination', content: `combining two equations so one variable cancels, leaving a single equation in one variable.` },
    { loId: 'alg1.systems-elimination', kind: 'definition', title: 'standard form', content: `a linear equation written as Ax + By = C, with the variable terms lined up on the left.` },
  ],
  methods: [
    {
      title: 'Worked scale both',
      steps: [
        `Choose a variable to cancel. The y-coefficients are +2 and −3; their least common multiple is 6, and they already have opposite signs, so y is the easy target.`,
        'Multiply the first equation by 3 (both sides): 9x + 6y = 48.',
        'Multiply the second equation by 2 (both sides): 4x − 6y = −22.',
        'Add the two scaled equations: +6y and −6y cancel, leaving 13x = 26, so x = 2.',
        `Back-substitute into the ORIGINAL first equation: 3(2) + 2y = 16 → 2y = 10 → y = 5.`,
        'Check in the other original equation: 2(2) − 3(5) = 4 − 15 = −11. ✓',
      ],
      example: { problem: 'Solve by elimination: 3x + 2y = 16 and 2x − 3y = −11', solution: '(x, y) = (2, 5)' },
      relatedLoIds: ['alg1.systems-elimination'],
    },
    {
      title: 'Worked subtract no solution',
      steps: [
        `Scale the second equation by 2 so the x-terms match: 6x − 4y = 16. Note both coefficients matched up at once — that is the warning sign.`,
        `Subtract the scaled equation from the first, in full: (6x − 4y) − (6x − 4y) = 10 − 16. Keep the parentheses so the minus reaches every term.`,
        `The left side collapses to 0 and the right side to −6, giving 0 = −6 — a FALSE statement with no variable left.`,
        `False means NO SOLUTION. Dividing the first equation by 2 shows why: 3x − 2y = 5 and 3x − 2y = 8 are parallel lines, same slope, different intercepts.`,
        `Contrast the near-miss: had the second equation been 3x − 2y = 5, the subtraction would give 0 = 0 — TRUE — and the answer would be infinitely many solutions, because both equations name the same line.`,
      ],
      example: { problem: 'Solve by elimination: 6x − 4y = 10 and 3x − 2y = 8', solution: 'No solution (the lines are parallel)' },
      relatedLoIds: ['alg1.systems-elimination'],
    },
  ],
  pointers: [
    { content: `Subtract the WHOLE equation: (5x + 2y) − (3x + 2y) = 24 − 16 gives 2x = 8, so x = 4. Back-substitute into 3x + 2y = 16: 12 + 2y = 16 → y = 2. Check in 5x + 2y = 24: 20 + 4 = 24 ✓. To avoid the trap entirely, multiply the second equation by −1 and add instead of subtracting.`, kind: 'common-error' },
    { content: `Opposite coefficients → add; matching coefficients → subtract; neither → scale one or both equations first.`, kind: 'tip' },
    { content: 'When you scale, multiply BOTH sides of the equation.', kind: 'tip' },
    { content: `Subtracting means subtracting every term — keep the parentheses, or multiply by −1 and add.`, kind: 'tip' },
    { content: 'Back-substitute into an ORIGINAL equation, then check the pair in the other one.', kind: 'tip' },
    { content: `Variables cancel into a FALSE statement → no solution (parallel lines); into a TRUE statement → infinitely many (same line).`, kind: 'tip' },
    { content: `Subtracting an equation means subtracting **every** term — write parentheses: (5x + 2y) − (3x + 2y). Dropping them gives 5x + 2y − 3x + 2y, so the y-terms add instead of cancelling. Safest habit: multiply the second equation by −1 and ADD.`, kind: 'common-error' },
    { content: `When you scale an equation, multiply the constant on the right too. 3x + 2y = 18 times 5 is 15x + 10y = 90, not 15x + 10y = 18. Circle the right side before you multiply.`, kind: 'common-error' },
    { content: `Back-substitute into an **original** equation, not a scaled one. If you mis-scaled, the scaled equation will happily confirm your wrong answer; the original won't.`, kind: 'tip' },
    { content: `0 = 24 means NO solution; 0 = 0 means INFINITELY many. Don't write 'x = 0' or '(0, 0)' — no variable survived, so there is no coordinate to report. State the answer in words.`, kind: 'gotcha' },
    { content: `If BOTH variables cancel at once after scaling, that's the signal you're in a special case — stop and read the numeric statement instead of hunting for an arithmetic mistake.`, kind: 'edge-case' },
    { content: `Signs decide add vs. subtract. +2y and −2y are OPPOSITE → add. +2y and +2y MATCH → subtract. Check the sign in front of the coefficient, not just the number.`, kind: 'vocab-note' },
    { content: `Aim for the least common multiple of the two coefficients when scaling — for 2y and 5y use 5 and 2 to reach 10y, not 5 and 5. Bigger numbers still work but multiply your arithmetic slips.`, kind: 'tip' },
    { content: `Finish the job: one variable's value is half an answer. Write the solution as an ordered pair (x, y) and verify it in the equation you did NOT use for back-substitution.`, kind: 'common-error' },
  ],
};
