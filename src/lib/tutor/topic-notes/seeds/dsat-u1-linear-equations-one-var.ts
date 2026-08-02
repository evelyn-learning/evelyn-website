/**
 * Digital SAT — Unit 1 CED 1.1: Linear Equations in One Variable.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.linear-equations-one-var.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_LINEAR_EQUATIONS_ONE_VAR: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.linear-equations-one-var.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Linear Equations in One Variable',
  planId: 'evelyn.testprep.dsat.linear-equations-one-var.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.linear-equations-one-var.v1' }],
  theory: [
    { loId: 'dsat.linear-equations-one-var', kind: 'framework', title: 'Base procedure', content: `BASE PROCEDURE — distribute, collect variable terms on one side and constants on the other, divide. Every one-variable linear equation yields to this.` },
    { loId: 'dsat.linear-equations-one-var', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — FRACTION COEFFICIENTS. (2/3)x − 5 = 7. Clear fractions FIRST: multiply every term by the denominator. Multiplying through by 3 gives 2x − 15 = 21 → x = 18.` },
    { loId: 'dsat.linear-equations-one-var', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — SOLUTION COUNT. If simplifying collapses to a false statement (0 = 7), NO solution. If it collapses to a true one (0 = 0), INFINITELY MANY. The SAT asks for the value of a constant k that forces one of these — match coefficients, mismatch (or match) constants.` },
    { loId: 'dsat.linear-equations-one-var', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — SOLVE FOR AN EXPRESSION. "If 4x + 2 = 26, what is 4x + 8?" Do NOT solve for x. The target is the given plus 6, so the answer is 32. The SAT rewards seeing the shortcut.` },
    { loId: 'dsat.linear-equations-one-var', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — the built-in calculator is available on EVERY math question. Typing y = left side and y = right side and reading the intersection is a legitimate 15-second verification.` },
    { loId: 'dsat.linear-equations-one-var', kind: 'definition', title: 'no solution', content: 'simplification produces a false statement — the equation holds for no x.' },
    { loId: 'dsat.linear-equations-one-var', kind: 'definition', title: 'infinitely many solutions', content: 'simplification produces an identity — every x works.' },
  ],
  methods: [
    {
      title: 'Worked fractions',
      steps: [
        'Multiply every term by 4 (the least common denominator): 3x − 8 = 2x + 20.',
        'Collect: 3x − 2x = 20 + 8 → x = 28.',
        'Check in the original: (3/4)(28) − 2 = 19 and (1/2)(28) + 5 = 19. ✓',
      ],
      example: { problem: 'Solve: (3/4)x − 2 = (1/2)x + 5', solution: 'x = 28' },
      relatedLoIds: ['dsat.linear-equations-one-var'],
    },
    {
      title: 'Worked solution count',
      steps: [
        'Distribute the right side: 6x + 12 = 6x + 2k.',
        `The x-coefficients already match, so the equation is an identity exactly when the constants match: 12 = 2k.`,
        `k = 6. (Any other k gives 12 = 2k false → NO solution — the SAT asks that variant too.)`,
      ],
      example: { problem: 'For what value of k does 6x + 12 = 2(3x + k) have infinitely many solutions?', solution: 'k = 6' },
      relatedLoIds: ['dsat.linear-equations-one-var'],
    },
  ],
  pointers: [
    { content: 'Divide both sides by −2: x = −5. The sign travels with the coefficient.', kind: 'common-error' },
    { content: 'Clear fractions first by multiplying through by the LCD.', kind: 'tip' },
    { content: `False statement → no solution; identity → infinitely many. Constant-k questions hinge on matching coefficients vs constants.`, kind: 'tip' },
    { content: 'When asked for an expression, look for the shortcut before solving for x.', kind: 'tip' },
    { content: 'Desmos is available on every question — use it to verify, not to think for you.', kind: 'tip' },
    { content: `When multiplying an equation by the LCD, multiply **every** term — including the ones with no fraction. In (3/4)x − 2 = (1/2)x + 5, forgetting the −2 and +5 gives 3x − 2 = 2x + 5 and a wrong x. Count terms before and after: same number both times.`, kind: 'common-error' },
    { content: `"Infinitely many" needs BOTH sides identical; "no solution" needs matching x-coefficients but mismatched constants. If the x-coefficients differ, the equation has exactly one solution no matter what the constant is — that choice is a decoy.`, kind: 'gotcha' },
    { content: `Read the target expression twice. "3x − 7 = 20, find 6x − 7" is not "add 6" — you must double 3x first (3x = 27 → 6x = 54 → 54 − 7 = 47). Ask: is the target the given expression shifted, scaled, or both?`, kind: 'gotcha' },
    { content: `The sign travels with the coefficient. −2x = 10 → x = −5, and 5 − x = 12 → −x = 7 → x = −7. After dividing by a negative, plug back in for 3 seconds; a sign flip is the cheapest point to lose.`, kind: 'common-error' },
    { content: `Watch for a minus sign in front of parentheses: 5 − 3(x − 4) means −3x + 12, not −3x − 12. Distribute the sign to every term inside before collecting anything.`, kind: 'common-error' },
    { content: `Question stems signal the type: "has no solution" / "is true for all values of x" (= infinitely many) / "what is the value of" a full expression. "True for all x" and "for exactly one x" are opposite tasks — underline that phrase before computing.`, kind: 'vocab-note' },
    { content: `On student-produced response items, type only the number — no "x =", no units, no commas. If the answer is negative, include the minus sign; fractions like −7/2 and their decimal −3.5 are both accepted.`, kind: 'tip' },
    { content: `Desmos verifies but doesn't classify well: parallel lines (no solution) look like two separate lines with no intersection, and an identity plots as one line on top of another. If you see only one line, suspect infinitely many — then confirm algebraically.`, kind: 'edge-case' },
  ],
};
