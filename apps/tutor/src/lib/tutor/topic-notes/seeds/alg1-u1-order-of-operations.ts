/**
 * Algebra 1 — Unit 1 CED 1.2: Order of Operations & Evaluating Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.order-of-operations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U1_ORDER_OF_OPERATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.order-of-operations.v1',
  course: 'Algebra 1',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Order of Operations & Evaluating Expressions',
  planId: 'evelyn.hs.alg1.order-of-operations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.order-of-operations.v1' }],
  theory: [
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'The order', content: `THE ORDER — 1) grouping symbols, innermost first, 2) exponents, 3) multiplication and division, 4) addition and subtraction. PEMDAS is a memory hook, not four separate steps.` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Same rank, left to right', content: `SAME RANK, LEFT TO RIGHT — × and ÷ tie, so you work left to right: 24 ÷ 4 · 3 = 6 · 3 = 18, NOT 24 ÷ 12. Likewise + and − tie: 8 − 2 + 3 = 6 + 3 = 9, NOT 8 − 5.` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Grouping is more than parentheses', content: `GROUPING IS MORE THAN PARENTHESES — brackets [ ], absolute value bars | |, the radicand under a √, and the bar of a fraction all group. They all mean "finish everything inside me first."` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'The fraction bar', content: `THE FRACTION BAR — (3 + 9)/(5 − 1) means evaluate the whole top, evaluate the whole bottom, then divide: 12/4 = 3. Never cancel or divide term-by-term across the bar.` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Nested grouping', content: `NESTED GROUPING — work outward from the innermost pair: in 2[3² − (7 − 4)] you do 7 − 4 first, then the exponent, then the bracket, then the multiply.` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Evaluating', content: `EVALUATING — to evaluate an expression at a value, substitute the value IN PARENTHESES, then run the order of operations. Write x² as ( )² first, so x = −3 becomes (−3)².` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Negatives and exponents', content: `NEGATIVES AND EXPONENTS — (−3)² = 9 because the parentheses say the whole −3 is squared, but −3² = −9 because the exponent grabs only the 3 and the minus sign is applied last. This one sign is the single most common evaluation error.` },
    { loId: 'alg1.order-of-operations', kind: 'framework', title: 'Subtracting a negative', content: `SUBTRACTING A NEGATIVE — after substituting, −x with x = −3 becomes −(−3) = +3. Substitute first, simplify signs second; do not try to do both in your head at once.` },
    { loId: 'alg1.order-of-operations', kind: 'definition', title: 'grouping symbol', content: `anything that wraps part of an expression — ( ), [ ], | |, √, or a fraction bar — signaling "evaluate me first."` },
    { loId: 'alg1.order-of-operations', kind: 'definition', title: 'evaluate', content: 'replace each variable with a given number and simplify to a single value.' },
  ],
  methods: [
    {
      title: 'Worked nested',
      steps: [
        'Innermost grouping first: 7 − 4 = 3, so the expression is 18 − 2[3² − 3] ÷ 3.',
        'Exponent inside the bracket: 3² = 9, giving 18 − 2[9 − 3] ÷ 3.',
        'Finish the bracket: 9 − 3 = 6, giving 18 − 2 · 6 ÷ 3.',
        `Multiplication and division tie, so go left to right: 2 · 6 = 12, then 12 ÷ 3 = 4.`,
        'Subtract last: 18 − 4 = 14.',
      ],
      example: { problem: 'Evaluate: 18 − 2[3² − (7 − 4)] ÷ 3', solution: '14' },
      relatedLoIds: ['alg1.order-of-operations'],
    },
    {
      title: 'Worked negative substitution',
      steps: [
        'Substitute with parentheses everywhere: ((−3)² − 5(−3))/((−3) + 1).',
        `Numerator, exponent first: (−3)² = 9 — the parentheses mean the whole −3 gets squared. Writing −3² = −9 here is the classic trap.`,
        'Numerator, then multiply: −5(−3) = +15, so the top is 9 + 15 = 24.',
        `Denominator: −3 + 1 = −2. The fraction bar groups, so the bottom is finished on its own before any dividing happens.`,
        'Divide last: 24 ÷ (−2) = −12.',
        `Trap check: a student who used −3² = −9 gets (−9 + 15)/(−2) = 6/(−2) = −3 — a wrong answer that looks perfectly reasonable.`,
      ],
      example: { problem: 'Evaluate (x² − 5x)/(x + 1) when x = −3', solution: '−12' },
      relatedLoIds: ['alg1.order-of-operations'],
    },
  ],
  pointers: [
    { content: `Addition and subtraction share one rank, so they are done left to right: 8 − 2 = 6, then 6 + 3 = 9. The same tie applies to × and ÷.`, kind: 'common-error' },
    { content: 'Grouping (innermost first) → exponents → × and ÷ → + and −.', kind: 'tip' },
    { content: '× ties with ÷ and + ties with −: same rank means left to right.', kind: 'tip' },
    { content: `Brackets, absolute value bars, radicals, and the fraction bar are all grouping symbols.`, kind: 'tip' },
    { content: 'Substitute values in parentheses: (−3)² = 9 but −3² = −9.', kind: 'tip' },
    { content: `\`(−3)²\` = 9 but \`−3²\` = −9. The exponent only grabs what it's directly attached to. When substituting, write \`x²\` as \`( )²\` first, then drop the number in — never write \`−3²\` when you meant \`(−3)²\`.`, kind: 'common-error' },
    { content: `PEMDAS is four tiers, not six steps. M/D tie and A/S tie, so both are resolved left to right: 8 − 2 + 3 = 9 (not 3), and 24 ÷ 4 · 3 = 18 (not 2).`, kind: 'gotcha' },
    { content: `The fraction bar is a grouping symbol: finish the entire top and the entire bottom before dividing. Never cancel a term on top against a term on the bottom — (3+9)/(5−1) is 12/4, not 3/5 + 9/1.`, kind: 'common-error' },
    { content: `"Grouping symbol" isn't just parentheses — brackets [ ], absolute value bars | |, the radicand under √, and a fraction bar all mean "finish inside me first." Say "grouping symbol," not "parentheses," when describing the rule.`, kind: 'vocab-note' },
    { content: `Substitute first, simplify signs second. With x = −3, \`−x\` becomes \`−(−3)\` = +3 and \`−5x\` becomes \`−5(−3)\` = +15. Doing the substitution and the sign in your head at once is where signs get lost.`, kind: 'tip' },
    { content: `With nested grouping, work from the innermost pair outward — in 2[3² − (7 − 4)] do 7 − 4 first, not 3². Don't start with the exponent just because E comes before the brackets in your head.`, kind: 'edge-case' },
    { content: `"Evaluate" means substitute the given values and produce ONE number. If your final answer still contains a variable, you haven't evaluated — you've simplified.`, kind: 'vocab-note' },
    { content: `Rewrite the whole expression after each step instead of doing two operations at once. Then check: is the operation I'm doing the highest-ranked one left, and the leftmost of its rank?`, kind: 'tip' },
  ],
};
