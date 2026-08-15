/**
 * Algebra 1 — Unit 2 CED 2.2: Multi-Step Equations with Variables on Both Sides.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.multi-step-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U2_MULTI_STEP_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.multi-step-equations.v1',
  course: 'Algebra 1',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Multi-Step Equations with Variables on Both Sides',
  planId: 'evelyn.hs.alg1.multi-step-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.multi-step-equations.v1' }],
  theory: [
    { loId: 'alg1.multi-step-equations', kind: 'framework', title: 'The routine', content: `THE ROUTINE — 1) clear fractions (multiply every term by the LCD), 2) distribute to remove parentheses, 3) collect variable terms on one side and constants on the other, 4) divide by the coefficient.` },
    { loId: 'alg1.multi-step-equations', kind: 'framework', title: 'Variables on both sides', content: `VARIABLES ON BOTH SIDES — move the smaller variable term across to keep the coefficient positive: for 7x − 4 = 3x + 16, subtract 3x from both sides to get 4x − 4 = 16.` },
    { loId: 'alg1.multi-step-equations', content: `EVERY MOVE IS LEGAL because you do the same thing to both sides — the equation stays balanced. That is why you can check any answer by substituting it back.` },
    { loId: 'alg1.multi-step-equations', kind: 'framework', title: 'Ending 1', content: `ENDING 1 — NO SOLUTION: if the variables cancel and you are left with a false statement like 0 = 7, no value of x works.` },
    { loId: 'alg1.multi-step-equations', kind: 'framework', title: 'Ending 2', content: `ENDING 2 — IDENTITY: if the variables cancel into a true statement like 5 = 5, every value of x works — infinitely many solutions.` },
    { loId: 'alg1.multi-step-equations', kind: 'framework', title: 'Sign discipline', content: `SIGN DISCIPLINE — the two most common errors are dropping a negative while distributing, e.g. −2(x − 3) = −2x + 6 not −2x − 6, and dividing by a negative without flipping the sign of the answer.` },
    { loId: 'alg1.multi-step-equations', kind: 'definition', title: 'like terms', content: 'terms with the same variable part — only these can be combined.' },
    { loId: 'alg1.multi-step-equations', kind: 'definition', title: 'identity', content: 'an equation true for every value of the variable.' },
  ],
  methods: [
    {
      title: 'Worked both sides',
      steps: [
        'Distribute the 5: 5x − 15 = 2x + 9.',
        'Subtract 2x from both sides: 3x − 15 = 9.',
        'Add 15 to both sides: 3x = 24.',
        'Divide by 3: x = 8. Check: 5(8 − 3) = 25 and 2(8) + 9 = 25. ✓',
      ],
      example: { problem: 'Solve: 5(x − 3) = 2x + 9', solution: 'x = 8' },
      relatedLoIds: ['alg1.multi-step-equations'],
    },
    {
      title: 'Worked fractions identity',
      steps: [
        'Distribute the 1/2: 3x + 4 = 3x + 4.',
        `Subtract 3x from both sides: 4 = 4 — the variable is gone and the statement is TRUE.`,
        `A true statement with no variable left means every x works: infinitely many solutions (an identity).`,
        `Contrast: if the constants had disagreed (like 4 = 7), the answer would be NO solution.`,
      ],
      example: { problem: 'Solve: (1/2)(6x + 8) = 3x + 4', solution: 'Infinitely many solutions (identity)' },
      relatedLoIds: ['alg1.multi-step-equations'],
    },
  ],
  pointers: [
    { content: `Distribute first: 10 − 2(x − 3) = 10 − 2x + 6 = 16 − 2x. Order of operations puts multiplication before subtraction.`, kind: 'common-error' },
    { content: 'The routine: clear fractions, distribute, collect, divide.', kind: 'tip' },
    { content: 'Move the smaller variable term to keep coefficients positive.', kind: 'tip' },
    { content: `Variables cancel into a FALSE statement → no solution; into a TRUE statement → infinitely many.`, kind: 'tip' },
    { content: 'Distribute negatives carefully: −2(x − 3) = −2x + 6.', kind: 'tip' },
    { content: `When a minus sign sits in front of parentheses, the coefficient being distributed is negative. Write \`−2(x − 3) = −2x + 6\`, not \`−2x − 6\`. Rewrite subtraction as adding a negative if it helps you keep track.`, kind: 'common-error' },
    { content: `In \`10 − 2(x − 3)\`, you cannot do 10 − 2 first. The 2 is multiplied by the parentheses, so distribute before you combine: 10 − 2x + 6 = 16 − 2x.`, kind: 'gotcha' },
    { content: `When clearing fractions, multiply **every single term** on both sides by the LCD — including whole-number terms and terms with no denominator. Multiplying only the fractions unbalances the equation.`, kind: 'common-error' },
    { content: `"No solution" and "x = 0" are not the same. If you get \`0 = 7\`, no value works. If you get \`5x = 0\`, then x = 0 is a perfectly good solution. Say which one you mean.`, kind: 'vocab-note' },
    { content: `Only declare no solution / infinitely many when the variable term has **completely vanished** from both sides. If any x is still present, keep solving — you're not done.`, kind: 'edge-case' },
    { content: `For an identity, the answer is "infinitely many solutions," not "4 = 4" and not "x = 4." Write the classification in words as your final answer.`, kind: 'vocab-note' },
    { content: `Move the variable term with the **smaller** coefficient. In 4x + 7 = 9x − 13, subtract 4x (not 9x) so you get 5x, not −5x — one fewer chance for a sign slip.`, kind: 'tip' },
    { content: `Check by substituting into the **original** equation, not your rewritten line. If you distributed wrong in step one, checking against your own error will confirm a wrong answer.`, kind: 'tip' },
  ],
};
