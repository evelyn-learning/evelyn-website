/**
 * ACT — Unit 2 CED 2.2: Linear Equations & Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.linear-equations-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_LINEAR_EQUATIONS_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.linear-equations-inequalities.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Linear Equations & Inequalities',
  planId: 'evelyn.testprep.act.linear-equations-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.linear-equations-inequalities.v1' }],
  theory: [
    { loId: 'act.linear-equations-inequalities', content: `PACE: these are usually early, "bankable" questions — solve fast, check fast, move on.` },
    { loId: 'act.linear-equations-inequalities', content: `ISOLATE THE VARIABLE: distribute first, combine like terms on each side, then move all variable terms to one side and all constants to the other.` },
    { loId: 'act.linear-equations-inequalities', content: `CLEAR FRACTIONS/DECIMALS EARLY: multiply the whole equation by the LCD (or by 10, 100…) before isolating — this avoids messy fraction arithmetic mid-solve.` },
    { loId: 'act.linear-equations-inequalities', kind: 'framework', title: 'Inequalities solve like equations', content: `INEQUALITIES SOLVE LIKE EQUATIONS — with ONE extra rule: multiplying or dividing both sides by a NEGATIVE number flips the inequality sign.` },
    { loId: 'act.linear-equations-inequalities', content: `TRANSLATING PHRASES: "at least" → ≥, "at most" / "no more than" → ≤, "more than" → >, "fewer than" / "less than" → <, "no less than" → ≥.` },
    { loId: 'act.linear-equations-inequalities', kind: 'framework', title: 'Trap', content: `TRAP — DISTRIBUTING A NEGATIVE: -(2x - 5) = -2x + 5, NOT -2x - 5. This single sign slip is one of the most common ACT algebra mistakes.` },
    { loId: 'act.linear-equations-inequalities', kind: 'framework', title: 'Trap', content: `TRAP — VARIABLE ON BOTH SIDES: move all variable terms to one side BEFORE combining constants; don't accidentally combine a variable term with a constant.` },
    { loId: 'act.linear-equations-inequalities', content: `CHECK BY SUBSTITUTION: plug your solution back into the ORIGINAL equation or inequality — costs 10 seconds and catches sign errors before you bubble the wrong answer.` },
    { loId: 'act.linear-equations-inequalities', kind: 'definition', title: 'coefficient', content: 'the number multiplying a variable, e.g. the 3 in 3x.' },
    { loId: 'act.linear-equations-inequalities', kind: 'definition', title: 'compound inequality', content: `two inequalities joined by "and" that the variable must satisfy simultaneously, e.g. -2 < x ≤ 5.` },
    { loId: 'act.linear-equations-inequalities', kind: 'definition', title: 'literal equation', content: `an equation with multiple variables, solved for one variable in terms of the others (e.g. solve d = rt for t).` },
  ],
  methods: [
    {
      title: 'Worked multistep equation',
      steps: [
        'Distribute the 3: 3x - 12 + 5 = 2x + 7, which simplifies to 3x - 7 = 2x + 7.',
        'Move variable terms to one side: subtract 2x from both sides → x - 7 = 7.',
        'Move constants to the other side: add 7 to both sides → x = 14.',
        `Check in the ORIGINAL equation: 3(14 - 4) + 5 = 3(10) + 5 = 35, and 2(14) + 7 = 28 + 7 = 35. ✓`,
      ],
      example: { problem: 'Solve for x: 3(x - 4) + 5 = 2x + 7', solution: 'x = 14' },
      relatedLoIds: ['act.linear-equations-inequalities'],
    },
    {
      title: 'Worked inequality flip',
      steps: [
        `Distribute the negative carefully: -4(x + 2) = -4x - 8, so the inequality is -4x - 8 ≥ x - 17.`,
        'Move variable terms to one side: subtract x from both sides → -5x - 8 ≥ -17.',
        'Move constants: add 8 to both sides → -5x ≥ -9.',
        'Divide both sides by -5 — a NEGATIVE number, so FLIP the inequality: x ≤ 9/5.',
        `Check with a value that should work, x = 0: -4(0 + 2) = -8, and 0 - 17 = -17. Is -8 ≥ -17? Yes. ✓ And a value that should fail, x = 2: -4(4) = -16 vs 2 - 17 = -15; -16 ≥ -15 is false, correctly excluded since 2 > 9/5.`,
      ],
      example: { problem: 'Solve for x: -4(x + 2) ≥ x - 17', solution: 'x ≤ 9/5 (i.e., x ≤ 1.8)' },
      relatedLoIds: ['act.linear-equations-inequalities'],
    },
  ],
  pointers: [
    { content: `Dividing (or multiplying) both sides of an inequality by a NEGATIVE number flips the direction of the inequality. -2x < 8 → divide by -2 AND flip the sign → x > -4.`, kind: 'common-error' },
    { content: `Distribute first, then combine like terms on each side before isolating the variable.`, kind: 'tip' },
    { content: `Clear fractions/decimals early by multiplying the whole equation by the LCD or a power of 10.`, kind: 'tip' },
    { content: `Multiplying or dividing an inequality by a NEGATIVE number flips the sign — the #1 ACT trap here.`, kind: 'tip' },
    { content: `Translate phrases carefully: "at least" = ≥, "at most/no more than" = ≤, "more than" = >, "fewer/less than" = <.`, kind: 'tip' },
    { content: `Subtracting a variable term does NOT flip the sign. Only multiplying/dividing by a negative does. In -5x - 8 ≥ -17, adding 8 changes nothing about direction — students over-flip almost as often as they under-flip.`, kind: 'common-error' },
    { content: `Watch for the variable ending up on the negative side: 12 > 4x is x < 3, but 12 > -4x is x > -3. If your final line reads like \`9 ≥ x\`, rewrite it as \`x ≤ 9\` before matching answer choices — the ACT lists choices variable-first.`, kind: 'gotcha' },
    { content: `'Less than' means < in an inequality but means SUBTRACT and reverses order in a phrase: '5 less than x' = x - 5, not 5 - x. Decide which use the sentence has before writing anything.`, kind: 'vocab-note' },
    { content: `If x is a count of people, tickets, or trips, an answer like x ≤ 7.4 means the max whole answer is 7. ACT word problems often ask for 'the greatest number of…' — round toward the feasible side, not by standard rounding rules.`, kind: 'edge-case' },
    { content: `When you multiply by the LCD, multiply EVERY term — including the lone integer with no fraction. (x/3) + 4 = (x/2) times 6 gives 2x + 24 = 3x, not 2x + 4 = 3x.`, kind: 'common-error' },
    { content: `If all x terms cancel, don't guess. A true statement (6 = 6) means infinitely many solutions / all real numbers; a false one (6 = 9) means no solution. The ACT lists both as answer choices for these.`, kind: 'edge-case' },
    { content: `For literal equations (solve d = rt for t, or A = P + Prt for r), factor out the target variable before dividing: A - P = Prt → r = (A - P)/(Pt). Answer choices differ only in what stays inside the parentheses.`, kind: 'tip' },
    { content: `With answer choices this simple, backsolving beats algebra when the equation has ugly decimals. Plug choices into the ORIGINAL equation — start with the middle value so a miss tells you which direction to go.`, kind: 'tip' },
  ],
};
