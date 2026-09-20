/**
 * Grade 8 Math — Unit 4 CED 4.2: Equations with Distribution & Like Terms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.equations-with-distribution-and-like-terms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U4_EQUATIONS_WITH_DISTRIBUTION_AND_LIKE_TERMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.equations-with-distribution-and-like-terms.v1',
  course: 'Grade 8 Math',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Equations with Distribution & Like Terms',
  planId: 'evelyn.ms.m8math.equations-with-distribution-and-like-terms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.equations-with-distribution-and-like-terms.v1' }],
  theory: [
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: 'The brackets have to go first', content: `THE BRACKETS HAVE TO GO FIRST — in 3(x - 4) + 2x = 2(x + 5) - 1, part of the x is locked inside parentheses, and you cannot collect a term you cannot see. Distribute every bracket before anything else: 3(x - 4) = 3x - 12 and 2(x + 5) = 2x + 10. The factor multiplies EVERY term inside, so 3(x - 4) is 3x - 12, never 3x - 4.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: 'A negative multiplier flips every sign', content: `A NEGATIVE MULTIPLIER FLIPS EVERY SIGN — this is the same rule you already use for expanding expressions, and it is where most of the mistakes in this lesson live. In -2(x - 3), the multiplier is -2, minus included. -2 times x is -2x, and -2 times -3 is +6, because a negative times a negative is positive. So -2(x - 3) = -2x + 6, not -2x - 6. Decide each sign on its own.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: 'Tidy each side on its own', content: `TIDY EACH SIDE ON ITS OWN — after distributing, the equation reads 3x - 12 + 2x = 2x + 10 - 1. Combine like terms on the left to get 5x - 12, and separately on the right to get 2x + 9. While you are tidying, the equals sign is a wall: a term only combines with terms on its own side.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: `Then it is last lesson's equation`, content: `THEN IT IS LAST LESSON'S EQUATION — 5x - 12 = 2x + 9 has the variable on both sides with nothing hidden, which is exactly the kind you solved last time. Subtract 2x from both sides to get 3x - 12 = 9, add 12 to get 3x = 21, divide by 3 to get x = 7. Nothing new happens after the tidying; the new part is getting there.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: 'Never combine across a bracket', content: `NEVER COMBINE ACROSS A BRACKET — in 6x - 2(x - 4), the -2 belongs to the bracket, so 6x - 2 is not a pair of like terms and cannot become 4. Distribute first, 6x - 2x + 8, and only then combine to get 4x + 8. The order of moves is fixed: distribute, combine, collect, finish.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'framework', title: 'Check in the original, brackets and all', content: `CHECK IN THE ORIGINAL, BRACKETS AND ALL — put the answer back into the equation exactly as it was written and work out each side. For x = 7: left is 3(7 - 4) + 2(7) = 3(3) + 14 = 23, right is 2(7 + 5) - 1 = 2(12) - 1 = 23. Both sides land on 23. If they do not match, the first place to look is the sign on a negative multiplier.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'definition', title: 'distribute', content: `multiply the factor outside a bracket by every term inside it: 3(x - 4) becomes 3x - 12.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'definition', title: 'like terms', content: `terms whose variable part matches exactly, such as 3x and 2x, or two plain numbers; only like terms can be combined into one.` },
    { loId: 'm8math.equations-with-distribution-and-like-terms', kind: 'definition', title: 'expanded form', content: `an equation with every bracket multiplied out, so that each side is a list of terms with no parentheses left.` },
  ],
  methods: [
    {
      title: 'Worked trampoline tickets',
      steps: [
        `Distribute every bracket. On the left, 3(x - 4) = 3x - 12. On the right, 2(x + 5) = 2x + 10. The equation now reads 3x - 12 + 2x = 2x + 10 - 1, with no parentheses left.`,
        `Combine like terms on each side separately. Left: 3x + 2x = 5x, so the left side is 5x - 12. Right: 10 - 1 = 9, so the right side is 2x + 9. The equation is 5x - 12 = 2x + 9.`,
        `Now the variable is on both sides with nothing hidden, so collect it the way you did last lesson. Subtract the smaller variable term, 2x, from BOTH sides: 5x - 2x - 12 = 9, which is 3x - 12 = 9.`,
        `Finish the two-step equation. Add 12 to both sides: 3x = 21. Divide both sides by 3: x = 7.`,
        `Check in the ORIGINAL equation, brackets and all. Left: 3(7 - 4) + 2(7) = 3(3) + 14 = 9 + 14 = 23. Right: 2(7 + 5) - 1 = 2(12) - 1 = 24 - 1 = 23. Both sides give 23, so x = 7 holds.`,
        `Read it back into the story: a ticket costs $7. Devon pays 3 × $3 + 2 × $7 = $9 + $14 = $23, and Sam pays 2 × $12 - $1 = $24 - $1 = $23. Same bill, which is what the equation said.`,
      ],
      example: { problem: `Devon pays for 3 tickets with a $4-off coupon on each plus 2 full-price tickets. Sam pays for 2 tickets with $5 grip socks on each and gets $1 off the total. Both groups pay the same. Solve 3(x - 4) + 2x = 2(x + 5) - 1 to find the ticket price x.`, solution: 'x = 7 (a ticket costs $7 and each group pays $23)' },
      relatedLoIds: ['m8math.equations-with-distribution-and-like-terms'],
    },
    {
      title: 'Worked negative multiplier',
      steps: [
        `Distribute every bracket, and read the multiplier on the left bracket carefully: it is -2, minus included. -2 times x is -2x, and -2 times -3 is +6, because a negative times a negative is positive. So -2(x - 3) = -2x + 6. On the right, 4(x + 1) = 4x + 4. The equation reads 5x - 2x + 6 = 4x + 4 + 8.`,
        `WRONG: writing -2(x - 3) as -2x - 6, keeping the minus on the 3, which leads to 3x - 6 = 4x + 12 and x = -18. CORRECT: the -2 multiplies the -3 as well, and a negative times a negative is positive, so the term is +6. The check exposes the slip: for x = -18, the left is 5(-18) - 2(-18 - 3) = -90 - 2(-21) = -90 + 42 = -48, and the right is 4(-18 + 1) + 8 = 4(-17) + 8 = -68 + 8 = -60. They do not match.`,
        `Combine like terms on each side separately. Left: 5x - 2x = 3x, so the left side is 3x + 6. Right: 4 + 8 = 12, so the right side is 4x + 12. The equation is 3x + 6 = 4x + 12.`,
        `Collect the variable terms. Subtract the smaller variable term, 3x, from BOTH sides: 6 = 4x - 3x + 12, which is 6 = x + 12.`,
        'Finish: subtract 12 from both sides, 6 - 12 = x, so x = -6.',
        `Check in the ORIGINAL, brackets and all. Left: 5(-6) - 2(-6 - 3) = -30 - 2(-9) = -30 + 18 = -12. Right: 4(-6 + 1) + 8 = 4(-5) + 8 = -20 + 8 = -12. Both sides give -12, so x = -6 is the solution.`,
      ],
      example: { problem: 'Solve: 5x - 2(x - 3) = 4(x + 1) + 8', solution: 'x = -6' },
      relatedLoIds: ['m8math.equations-with-distribution-and-like-terms'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 12" — The -2 multiplies the -4 as well, and a negative times a negative is positive: -2(x - 4) = -2x + 8. The equation then tidies to 4x + 8 = 3x + 4, so subtracting 3x gives x + 8 = 4 and x = -4. The check tells the story: for x = 12, the left is 6(12) - 2(12 - 4) = 72 - 16 = 56 and the right is 3(12 - 1) + 7 = 33 + 7 = 40, which do not match. For x = -4, the left is 6(-4) - 2(-4 - 4) = -24 + 16 = -8 and the right is 3(-4 - 1) + 7 = -15 + 7 = -8.`, kind: 'common-error' },
    { content: `Students often say "x = 20" — The -2 is the multiplier of the bracket, not a term that can be combined with 6x. Distribute first: 6x - 2x + 8. Only then combine like terms to get 4x + 8. The right side is 3x - 3 + 7 = 3x + 4, so the equation is 4x + 8 = 3x + 4 and x = -4. The check exposes x = 20: the left is 6(20) - 2(20 - 4) = 120 - 32 = 88 and the right is 3(20 - 1) + 7 = 57 + 7 = 64, nowhere near equal.`, kind: 'common-error' },
    { content: `When the variable is locked inside parentheses, distribute every bracket before anything else. The factor multiplies EVERY term inside.`, kind: 'tip' },
    { content: `A negative multiplier flips every sign inside the bracket: -2(x - 3) = -2x + 6, never -2x - 6.`, kind: 'tip' },
    { content: `Combine like terms on each side separately. While you tidy, the equals sign is a wall.`, kind: 'tip' },
    { content: `Never combine a term with a factor that has not been distributed yet: in 6x - 2(x - 4), the -2 belongs to the bracket.`, kind: 'tip' },
    { content: `After tidying, the equation has the variable on both sides with nothing hidden: collect the variable terms, then finish as a two-step equation.`, kind: 'tip' },
    { content: `Check by substituting into BOTH sides of the original equation, brackets and all. Both sides must land on the same number.`, kind: 'tip' },
  ],
};
