/**
 * Algebra 1 — Unit 2 CED 2.1: One- & Two-Step Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.one-two-step-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U2_ONE_TWO_STEP_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.one-two-step-equations.v1',
  course: 'Algebra 1',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'One- & Two-Step Equations',
  planId: 'evelyn.hs.alg1.one-two-step-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.one-two-step-equations.v1' }],
  theory: [
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Inverse operations', content: `INVERSE OPERATIONS — addition and subtraction undo each other; multiplication and division undo each other. Solving means peeling operations off x one at a time with their inverses until x stands alone.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'One step first', content: `ONE STEP FIRST — x + 7 = 12 needs one inverse (subtract 7 → x = 5); 5x = 45 needs one inverse (divide by 5 → x = 9). A two-step equation is just two of these in a row.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Undo in reverse order', content: `UNDO IN REVERSE ORDER — order of operations built the expression, so unwind it backwards: undo addition and subtraction FIRST, multiplication and division LAST. For 3x + 8 = 26, subtract 8 before dividing by 3, never the other way around.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Balance', content: `BALANCE — whatever you do to one side you do to the other, and to EVERY term on that side. That is the only rule that makes any of these moves legal.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Negative coefficients', content: `NEGATIVE COEFFICIENTS — −4x = 20 means divide both sides by −4, so x = −5. The sign travels with the coefficient. And −x is really −1x, so it still needs dividing by −1.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Fraction form', content: `FRACTION FORM — x/4 means (1/4)x, so its inverse is multiplying by 4. You may clear the fraction first, but then you must multiply EVERY term by 4, including the constants.` },
    { loId: 'alg1.one-two-step-equations', kind: 'framework', title: 'Check by substitution', content: `CHECK BY SUBSTITUTION — put your answer back into the ORIGINAL equation and evaluate both sides. If they match, you are done; if they do not, you caught your own mistake for free.` },
    { loId: 'alg1.one-two-step-equations', kind: 'definition', title: 'inverse operation', content: `the operation that undoes another — subtraction undoes addition, division undoes multiplication.` },
    { loId: 'alg1.one-two-step-equations', kind: 'definition', title: 'coefficient', content: `the number multiplying the variable, sign included: in −4x the coefficient is −4.` },
  ],
  methods: [
    {
      title: 'Worked two step',
      steps: [
        `Two operations are wrapped around x: times 5, then minus 8. Undo them in reverse order.`,
        'Undo the subtraction first — add 8 to both sides: 5x = 35.',
        'Undo the multiplication — divide both sides by 5: x = 7.',
        'Check in the original: 5(7) − 8 = 35 − 8 = 27. ✓',
      ],
      example: { problem: 'Solve: 5x − 8 = 27', solution: 'x = 7' },
      relatedLoIds: ['alg1.one-two-step-equations'],
    },
    {
      title: 'Worked fraction form',
      steps: [
        `THE TEMPTING WRONG MOVE — multiply by 4 right away and write x − 3 = 8, which gives x = 11. Substituting back: 11/4 − 3 = 2.75 − 3 = −0.25, not 2. The 4 was only applied to some of the terms, so the equation stopped being balanced.`,
        `ROUTE 1, undo in reverse order: add 3 to both sides → x/4 = 5, then multiply both sides by 4 → x = 20.`,
        `ROUTE 2, clear the fraction but multiply EVERY term by 4: x − 12 = 8, then add 12 → x = 20. Same answer, which is the point.`,
        'Check in the original: 20/4 − 3 = 5 − 3 = 2. ✓',
      ],
      example: { problem: 'Solve: x/4 − 3 = 2', solution: 'x = 20' },
      relatedLoIds: ['alg1.one-two-step-equations'],
    },
  ],
  pointers: [
    { content: '−x is −1x, so divide both sides by −1: x = −4. Check: −(−4) + 6 = 4 + 6 = 10. ✓', kind: 'common-error' },
    { content: 'Solving is undoing: subtraction undoes addition, division undoes multiplication.', kind: 'tip' },
    { content: `Unwind in reverse order — addition and subtraction first, multiplication and division last.`, kind: 'tip' },
    { content: 'The sign belongs to the coefficient: −3x = 15 gives x = −5, and −x means −1x.', kind: 'tip' },
    { content: `Clearing a fraction means multiplying EVERY term, not just the one with the variable.`, kind: 'tip' },
    { content: `Always substitute your answer back into the original equation — both sides must match.`, kind: 'tip' },
    { content: `\`−x = 4\` is **not** solved. \`−x\` means \`−1x\`, so divide both sides by −1: \`x = −4\`. Never let a bare minus sign in front of the variable go unprocessed.`, kind: 'common-error' },
    { content: `In \`10 − 3x = 25\` the coefficient is **−3**, not 3. The subtraction sign belongs to the term after it. Rewrite as \`10 + (−3x) = 25\` if that helps you keep the sign attached.`, kind: 'vocab-note' },
    { content: `Multiplying to clear a fraction? Multiply **every** term on **both** sides. \`x/4 − 3 = 2\` becomes \`x − 12 = 8\`, not \`x − 3 = 8\`. Forgetting the constant is the classic wrong answer here.`, kind: 'gotcha' },
    { content: `Undo in reverse of order of operations: strip the added/subtracted constant first, divide by the coefficient last. Dividing \`3x + 8 = 26\` by 3 first is legal only if you divide the 8 too — messier, and where errors sneak in.`, kind: 'tip' },
    { content: `Substitute into the **original** equation, not the line you rewrote. Checking against your own rewritten step will confirm an error instead of catching it.`, kind: 'common-error' },
    { content: `\`x/4\` means multiply by 1/4, so its inverse is multiplying by 4 — not dividing by 4. Watch the direction when the variable is on top of a fraction.`, kind: 'vocab-note' },
    { content: `A negative answer is not automatically a mistake. \`−4x = 20\` gives \`x = −5\`, and \`10 − 3x = 25\` also gives \`x = −5\`. Let the substitution check decide, not your gut.`, kind: 'edge-case' },
    { content: `Do the same operation to whole sides, not to single terms. Adding 8 to just the \`5x\` in \`5x − 8 = 27\` breaks balance — write the \`+8\` under both sides so you can see it.`, kind: 'tip' },
  ],
};
