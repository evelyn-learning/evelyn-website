/**
 * Algebra 1 — Unit 2 CED 2.3: Literal Equations & Rearranging Formulas.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.literal-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U2_LITERAL_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.literal-equations.v1',
  course: 'Algebra 1',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Literal Equations & Rearranging Formulas',
  planId: 'evelyn.hs.alg1.literal-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.literal-equations.v1' }],
  theory: [
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'Same rules, new goal', content: `SAME RULES, NEW GOAL — a literal equation is an equation with several letters. Solving for one of them means getting it alone on one side; every move is still "do the same thing to both sides."` },
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'Treat the other letters as numbers', content: `TREAT THE OTHER LETTERS AS NUMBERS — in P = 2l + 2w solved for w, pretend l is 7 and P is 40. Whatever you would do to those numbers, do to the letters instead. The answer just stays in letter form.` },
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'The routine', content: `THE ROUTINE — 1) get every term containing your target on one side, 2) combine or factor so the target appears once, 3) divide both sides by whatever is multiplying the target.` },
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'Dividing by a variable factor is fine', content: `DIVIDING BY A VARIABLE FACTOR IS FINE — from A = bh, dividing both sides by b gives h = A/b. You do not need to know what b is; you only need it to be nonzero, which is why textbooks say "b ≠ 0."` },
    { loId: 'alg1.literal-equations', content: `TARGET APPEARS TWICE → FACTOR — for A = P + Prt, the P is in two terms, so factor: A = P(1 + rt), then divide by the whole factor to get P = A/(1 + rt).` },
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'Fraction coefficients', content: `FRACTION COEFFICIENTS — multiply by the reciprocal, not by the fraction. From A = (1/2)bh, multiply both sides by 2 first: 2A = bh, so h = 2A/b.` },
    { loId: 'alg1.literal-equations', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — DIVIDING ONLY ONE TERM: from P = 2l + 2w you cannot "cancel" the 2 off just one term. Either subtract 2l first, or divide EVERY term: P/2 = l + w.` },
    { loId: 'alg1.literal-equations', content: `CHECK YOUR REARRANGEMENT by plugging real numbers into both the original and your rearranged version — if they disagree, the algebra slipped.` },
    { loId: 'alg1.literal-equations', kind: 'definition', title: 'literal equation', content: 'an equation written mostly with letters, such as a formula like d = rt.' },
    { loId: 'alg1.literal-equations', kind: 'definition', title: 'isolate', content: 'to get the target variable alone on one side of the equal sign.' },
  ],
  methods: [
    {
      title: 'Worked perimeter',
      steps: [
        'The target is w. It sits inside the term 2w, and the 2l term is in the way.',
        'Subtract 2l from both sides: P − 2l = 2w.',
        'Divide both sides — the WHOLE side, not one term — by 2: (P − 2l)/2 = w.',
        `So w = (P − 2l)/2. Check with numbers: if P = 40 and l = 12, then w = (40 − 24)/2 = 8, and 2(12) + 2(8) = 40. ✓`,
      ],
      example: { problem: 'The perimeter of a rectangle is P = 2l + 2w. Solve for w.', solution: 'w = (P − 2l)/2' },
      relatedLoIds: ['alg1.literal-equations'],
    },
    {
      title: 'Worked factor out',
      steps: [
        `The target P shows up in TWO terms, so you cannot divide it away yet — first make it appear once.`,
        `Factor P out of the right side: A = P(1 + rt). Both terms had a P, and P + Prt = P(1 + rt).`,
        `Now P is multiplied by the single factor (1 + rt), so divide both sides by that whole factor: A/(1 + rt) = P.`,
        `So P = A/(1 + rt). Check with numbers: if r = 0.05 and t = 4, then 1 + rt = 1.2; starting from P = 1050 the original gives A = 1050 + 1050(0.2) = 1260, and 1260/1.2 = 1050. ✓`,
        `Watch the trap: dividing A = P + Prt by P first would give A/P = 1 + rt, which still hides P on the left — factoring is the move.`,
      ],
      example: { problem: 'Simple interest gives the final amount A = P + Prt. Solve for P.', solution: 'P = A/(1 + rt)' },
      relatedLoIds: ['alg1.literal-equations'],
    },
  ],
  pointers: [
    { content: `Undo a multiplication by 1/2 by multiplying both sides by 2: 2A = bh. Then divide by b to get h = 2A/b. Quick numeric check: A = 12 and b = 4 give h = 24/4 = 6, and (1/2)(4)(6) = 12. ✓`, kind: 'common-error' },
    { content: `Solving for a letter is the same routine as solving for x — every other letter acts like a number.`, kind: 'tip' },
    { content: `Undo operations in reverse order, then divide by whatever multiplies the target, even if that is a variable.`, kind: 'tip' },
    { content: `If the target appears in two terms, factor it out first, then divide by the whole factor.`, kind: 'tip' },
    { content: `Never cancel off a single term: divide the ENTIRE side, or subtract the extra term first.`, kind: 'tip' },
    { content: 'Check any rearrangement by plugging real numbers into the original formula.', kind: 'tip' },
    { content: `Never cancel a factor off just one term. From $P = 2l + 2w$, crossing the 2 out of $2w$ only leaves $P = 2l + w$ — wrong. Either subtract $2l$ first, or divide the WHOLE side: $P/2 = l + w$.`, kind: 'common-error' },
    { content: `Multiplying by $\\frac{1}{2}$ is undone by multiplying by 2, not dividing by 2. From $A = \\frac{1}{2}bh$, write $2A = bh$ so $h = \\frac{2A}{b}$ — never $h = \\frac{A}{2b}$.`, kind: 'common-error' },
    { content: `If your target appears in two terms, DON'T divide by it. Dividing $A = P + Prt$ by $P$ gives $A/P = 1 + rt$ — $P$ is still stuck. Factor first: $A = P(1+rt)$, then divide by the entire factor $(1+rt)$.`, kind: 'gotcha' },
    { content: `When you divide by the factor $(1 + rt)$, keep the parentheses: $P = \\frac{A}{1+rt}$ means the whole binomial is the denominator. Writing $\\frac{A}{1} + rt$ or $\\frac{A}{1}+\\frac{A}{rt}$ changes the value entirely.`, kind: 'gotcha' },
    { content: `"Solve for $h$" means $h$ alone on one side and NO $h$ anywhere else. An answer like $h = \\frac{A}{bh}$ or $2A = bh$ is not finished — check that your target appears exactly once, by itself.`, kind: 'vocab-note' },
    { content: `Dividing by a letter is legal — you don't need its value. But it only works if that letter isn't zero, which is why formulas say $b \\neq 0$ or $r \\neq 0$. That's the one restriction, not a reason to avoid the step.`, kind: 'edge-case' },
    { content: `Undo in reverse order. For $F = \\frac{9}{5}C + 32$, subtract 32 FIRST, then handle the $\\frac{9}{5}$. Multiplying by $\\frac{5}{9}$ before subtracting forces you to distribute to the 32 too — a common source of a stray $\\frac{160}{9}$.`, kind: 'tip' },
    { content: `Test any rearrangement with easy numbers: pick values, run the original, then run your version. If $A=12$, $b=4$ gives $h=6$ and $\\frac{1}{2}(4)(6)=12$, you're safe. Disagreement means the algebra slipped, not the arithmetic.`, kind: 'tip' },
  ],
};
