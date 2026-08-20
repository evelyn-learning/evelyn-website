/**
 * Grade 7 Math — Unit 5 CED 5.3: Combining Like Terms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.combining-like-terms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U5_COMBINING_LIKE_TERMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.combining-like-terms.v1',
  course: 'Grade 7 Math',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Combining Like Terms',
  planId: 'evelyn.ms.m7math.combining-like-terms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.combining-like-terms.v1' }],
  theory: [
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'A term is one piece', content: `A TERM IS ONE PIECE — an expression splits into terms at every + and − sign. In 6x + 4 − 11x − 9 the terms are 6x, +4, −11x, and −9. The sign on the left BELONGS to the term it sits in front of. In 5x − 8x the second term is −8x, not 8x. Losing that minus sign is the most common mistake in this whole lesson.` },
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'Like terms match exactly', content: `LIKE TERMS MATCH EXACTLY — two terms are like terms only when the variable part is identical, the letter AND the exponent. So 5x and −8x are like terms. But 3x and 3x² are NOT like terms, even though both show a 3 and an x: 3x counts copies of x, and 3x² counts copies of x times x. Those are different things, so they do not add up. For the same reason 4x and 4y are not like terms.` },
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'A plain number is not like a variable term', content: `A PLAIN NUMBER IS NOT LIKE A VARIABLE TERM — in 5x + 2 there is nothing left to combine, because 2 is always 2 while 5x changes with x. Writing 5x + 2 = 7x is wrong. Plain numbers are called constants, and constants are like terms only with each other: −3 and +8 combine to 5.` },
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'Combine by adding the coefficients', content: `COMBINE BY ADDING THE COEFFICIENTS — 5x − 8x means (5 − 8)x, which is −3x. Add or subtract the numbers in front, then copy the variable part down unchanged. The exponent never changes and never adds, so 5x + 2x = 7x and never 7x².` },
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'A lone variable carries a silent 1', content: `A LONE VARIABLE CARRIES A SILENT 1 — a means 1a, and −a means −1a. So 4a − a = 3a, not 4a and not 4. That invisible 1 is easy to skip right over, so write it in whenever it helps.` },
    { loId: 'm7math.combining-like-terms', kind: 'framework', title: 'Check by substituting', content: `CHECK BY SUBSTITUTING — pick any number for the variable, put it into the original expression and into your simplified one, and compare the results. If 7y − 3 − 9y + 8 really equals −2y + 5, then y = 2 has to give the same value both times. It does: both give 1.` },
    { loId: 'm7math.combining-like-terms', kind: 'definition', title: 'term', content: `one piece of an expression, separated from the next by a + or − sign, with that sign included.` },
    { loId: 'm7math.combining-like-terms', kind: 'definition', title: 'coefficient', content: 'the number multiplying the variable part of a term — the −8 in −8x.' },
    { loId: 'm7math.combining-like-terms', kind: 'definition', title: 'like terms', content: `terms whose variable parts are exactly the same, letter and exponent: 5x and −8x.` },
    { loId: 'm7math.combining-like-terms', kind: 'definition', title: 'constant', content: 'a term that is just a number, with no variable attached, such as −3 or 8.' },
  ],
  methods: [
    {
      title: 'Worked combine with negatives',
      steps: [
        `Split it into terms and carry each sign along with its term: 7y, then −3, then −9y, then +8. The third term is −9y, minus included.`,
        `Sort into two piles. The y pile holds 7y and −9y. The number pile holds −3 and +8.`,
        `Combine the y pile: 7 − 9 = −2, so 7y − 9y = −2y. Starting at 7 and going down 9 lands two below zero.`,
        'Combine the number pile: −3 + 8 = 5.',
        `Write the two results side by side: −2y + 5. The piles cannot mix, so that is simplest form.`,
        `Check with y = 2. Original: 7(2) − 3 − 9(2) + 8 = 14 − 3 − 18 + 8 = 1. Simplified: −2(2) + 5 = −4 + 5 = 1. Both give 1, so the work holds up.`,
      ],
      example: { problem: 'Simplify: 7y − 3 − 9y + 8', solution: '−2y + 5' },
      relatedLoIds: ['m7math.combining-like-terms'],
    },
    {
      title: 'Worked two variable families',
      steps: [
        `Two different letters means two different piles. List the terms with their signs: 4a, +2b, −a, +5b.`,
        `Watch the third term. It is −a, and −a means −1a. Write that 1 in so the subtraction is easy to see.`,
        'Combine the a pile: 4a − 1a = 3a, because 4 − 1 = 3.',
        'Combine the b pile: 2b + 5b = 7b, because 2 + 5 = 7.',
        `a and b are different letters, so the piles never merge. The answer is 3a + 7b and it stays as two terms. WRONG answer to avoid: 10ab, which comes from adding every number in sight and gluing the letters together. RIGHT answer: 3a + 7b.`,
        `Check with a = 2 and b = 3. Original: 4(2) + 2(3) − 2 + 5(3) = 8 + 6 − 2 + 15 = 27. Simplified: 3(2) + 7(3) = 6 + 21 = 27. Both give 27.`,
      ],
      example: { problem: 'Simplify: 4a + 2b − a + 5b', solution: '3a + 7b' },
      relatedLoIds: ['m7math.combining-like-terms'],
    },
  ],
  pointers: [
    { content: `Students often say "8x²" — 4x means four copies of x. 4x² means four copies of x times x. Those count different things, the way pencils and backpacks count different things, so they cannot be added into one pile. 4x + 4x² is ALREADY in simplest form — there is nothing to combine. Terms are like terms only when the letter and the exponent both match.`, kind: 'common-error' },
    { content: `Students often say "8x³" — Exponents add when terms are MULTIPLIED, never when they are added. Combining like terms changes only the number in front and copies the variable part down exactly as it was. Since 4x and 4x² are not like terms here, nothing changes: the answer stays 4x + 4x².`, kind: 'common-error' },
    { content: `The sign in front of a term belongs to that term. In 5x − 8x the second term is −8x.`, kind: 'tip' },
    { content: `Terms are like terms only when the letter AND the exponent match, so 3x and 3x² never combine.`, kind: 'tip' },
    { content: `Combine like terms by adding the coefficients and copying the variable part: 5x − 8x = −3x.`, kind: 'tip' },
    { content: `A plain number never joins a variable pile, and a lone variable carries a silent 1: 5x + 2 is already simplest, and 4a − a = 3a.`, kind: 'tip' },
    { content: `To check yourself, substitute a number into both the original and the simplified expression and make sure they match.`, kind: 'tip' },
    { content: `The minus sign belongs to the term AFTER it. In \`7y − 3 − 9y + 8\` the third term is **−9y**, not 9y. Circle each sign together with its term before you sort into piles.`, kind: 'common-error' },
    { content: `A lone variable has a silent 1: \`a\` = 1a and \`−a\` = −1a. So 4a − a = 3a — not 4a (ignoring it) and not 4 (erasing the letter). Write the 1 in until you stop forgetting.`, kind: 'gotcha' },
    { content: `Same letter is not enough — the exponent must match too. 3x and 3x² are NOT like terms, so \`4x + 4x²\` is already simplest. Leave it alone.`, kind: 'edge-case' },
    { content: `When you combine, only the coefficient changes. The variable part gets copied down exactly. \`5x + 2x = 7x\`, never 7x². Exponents add when you MULTIPLY terms, never when you add them.`, kind: 'common-error' },
    { content: `Different letters stay separate. \`4a + 2b − a + 5b = 3a + 7b\`, two terms in the answer. Adding every number and gluing letters together to get 10ab is wrong.`, kind: 'gotcha' },
    { content: `A constant never joins a variable pile. \`5x + 2\` is already in simplest form — writing 7x is wrong. Constants combine only with other constants: −3 + 8 = 5.`, kind: 'common-error' },
    { content: `Say it right: the **coefficient** is the number in front WITH its sign. In \`6x + 4 − 11x − 9\` the x-coefficients are 6 and −11, so the simplified coefficient is −5, not 5 or 17.`, kind: 'vocab-note' },
    { content: `Check yourself: plug the same number (try 2) into the original and your simplified expression. If both give the same value, you're probably right. If not, hunt for a lost minus sign.`, kind: 'tip' },
  ],
};
