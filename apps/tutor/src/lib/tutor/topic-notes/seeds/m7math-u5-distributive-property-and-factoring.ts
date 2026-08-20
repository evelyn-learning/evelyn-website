/**
 * Grade 7 Math — Unit 5 CED 5.4: Distributive Property & Factoring.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.distributive-property-and-factoring.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U5_DISTRIBUTIVE_PROPERTY_AND_FACTORING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.distributive-property-and-factoring.v1',
  course: 'Grade 7 Math',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Distributive Property & Factoring',
  planId: 'evelyn.ms.m7math.distributive-property-and-factoring.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.distributive-property-and-factoring.v1' }],
  theory: [
    { loId: 'm7math.distributive-property-and-factoring', kind: 'framework', title: 'Distribute means hand it to every term', content: `DISTRIBUTE MEANS HAND IT TO EVERY TERM — a(b + c) = ab + ac. The factor outside the parentheses multiplies each term inside, not just the first one. So 4(x + 3) = 4x + 12. Handing it only to the x and writing 4x + 3 is the most common way to lose this problem. It works with subtraction the same way: a(b − c) = ab − ac, so 4(x − 3) = 4x − 12.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'framework', title: 'A negative multiplier flips every sign', content: `A NEGATIVE MULTIPLIER FLIPS EVERY SIGN — this is the case students get wrong. In −2(x − 5), the multiplier is −2 and it hits both terms. First: −2 times x = −2x. Second: −2 times −5 = +10, because a negative times a negative is positive. So −2(x − 5) = −2x + 10. It is NOT −2x − 10. Carry the minus sign into both products, then decide each sign on its own.` },
    { loId: 'm7math.distributive-property-and-factoring', content: `A BARE MINUS IN FRONT OF PARENTHESES IS A HIDDEN −1 — 9 − (x − 4) means 9 plus (−1)(x − 4), which is 9 − x + 4, which simplifies to 13 − x. Every sign inside the parentheses flips. Writing the invisible 1 in as −1 before you distribute makes this one much safer.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'framework', title: 'Distribute first, then combine like terms', content: `DISTRIBUTE FIRST, THEN COMBINE LIKE TERMS — expanding usually leaves terms that belong to the same pile, and sorting those piles is exactly the skill from last lesson. In 3(2x + 1) + 4x, distribute to get 6x + 3 + 4x, then combine the x pile: 6x + 4x = 10x, so the answer is 10x + 3. The 3 has no variable, so it stays on its own.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'framework', title: 'Factoring is the same rule read backwards', content: `FACTORING IS THE SAME RULE READ BACKWARDS — instead of opening parentheses, you build them. Find the greatest common factor of the numbers, write it outside, and write what is left inside: 6x + 9 = 3(2x + 3), because 6 divided by 3 is 2 and 9 divided by 3 is 3. Check by distributing back: 3 times 2x is 6x, and 3 times 3 is 9. If distributing your answer does not rebuild the original, the factoring is wrong.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'framework', title: 'Greatest means greatest', content: `GREATEST MEANS GREATEST — 8x − 20 can be written as 2(4x − 10), and that is true, but it is not finished, because 4 and 10 still share a factor of 2. The greatest common factor of 8 and 20 is 4, so the fully factored form is 4(2x − 5). Keep asking whether the numbers left inside still share anything.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'definition', title: 'distributive property', content: `the rule a(b + c) = ab + ac — the outside factor multiplies every term inside the parentheses.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'definition', title: 'expand', content: `to use the distributive property to remove parentheses: 4(x + 3) becomes 4x + 12.` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'definition', title: 'factor', content: `to write a sum as a product by pulling a common factor outside parentheses: 6x + 9 becomes 3(2x + 3).` },
    { loId: 'm7math.distributive-property-and-factoring', kind: 'definition', title: 'greatest common factor', content: `the largest number that divides every coefficient in the expression — the 4 in 8x − 20.` },
  ],
  methods: [
    {
      title: 'Worked negative multiplier',
      steps: [
        `Name the multiplier before doing anything. The factor glued to the parentheses is −2, minus sign included. Carry that minus into both products.`,
        'First product: −2 times x = −2x.',
        `Second product: −2 times −5 = +10. A negative times a negative is positive, so the sign flips here. WRONG answer to avoid: −2x − 10, which comes from carrying the minus into the first product only. RIGHT answer so far: −2x + 10.`,
        'Rewrite the whole expression with the parentheses gone: −2x + 10 + 3x.',
        `Now combine like terms, exactly as in the last lesson. The x pile holds −2x and +3x, and −2 + 3 = 1, so it combines to 1x, which we write as x. The 10 has no variable, so it stays where it is.`,
        `Final answer: x + 10. Check by substituting x = 4. Original: −2(4 − 5) + 3(4) = −2(−1) + 12 = 2 + 12 = 14. Simplified: 4 + 10 = 14. Both give 14.`,
      ],
      example: { problem: 'Simplify: −2(x − 5) + 3x', solution: 'x + 10' },
      relatedLoIds: ['m7math.distributive-property-and-factoring'],
    },
    {
      title: 'Worked factoring GCF',
      steps: [
        `Part (a) — look only at the numbers, 6 and 9. What is the largest number that divides both? The factors of 6 are 1, 2, 3, 6 and the factors of 9 are 1, 3, 9, so the greatest common factor is 3.`,
        `Write the 3 outside and divide each term by it: 6x divided by 3 is 2x, and 9 divided by 3 is 3. That gives 3(2x + 3).`,
        `Check by distributing back: 3 times 2x = 6x, and 3 times 3 = 9, which rebuilds 6x + 9. Part (a) is done.`,
        `Part (b) — the numbers are 8 and 20. Common factors are 1, 2 and 4, so the greatest common factor is 4. Keep the subtraction sign with the second term.`,
        `8x divided by 4 is 2x, and 20 divided by 4 is 5, so the answer is 4(2x − 5). Check: 4 times 2x = 8x, and 4 times −5 = −20, which rebuilds 8x − 20.`,
        `Notice what NOT to stop at. Pulling out only a 2 gives 2(4x − 10), which is true but unfinished, because 4 and 10 still share a factor of 2. Always ask whether the numbers left inside still have something in common.`,
      ],
      example: { problem: 'Factor completely: (a) 6x + 9, (b) 8x − 20', solution: '(a) 3(2x + 3)   (b) 4(2x − 5)' },
      relatedLoIds: ['m7math.distributive-property-and-factoring'],
    },
  ],
  pointers: [
    { content: `Students often say "−2x − 10" — Both terms get multiplied by the full multiplier −2, sign included. The second product is −2 times −5, and a negative times a negative is positive, so it is +10. The correct expansion is −2x + 10. Check with x = 5: the original is −2(5 − 5) = −2(0) = 0. The correct answer gives −2(5) + 10 = −10 + 10 = 0. The wrong answer gives −10 − 10 = −20, so it cannot be right.`, kind: 'common-error' },
    { content: `Students often say "−2x + 5" — The factor outside multiplies EVERY term inside, which is the whole point of a(b + c) = ab + ac. Leaving the second term unmultiplied changes the value of the expression. Distribute to both and the answer is −2x + 10.`, kind: 'common-error' },
    { content: `Distribute means multiply the outside factor by EVERY term inside: 4(x + 3) = 4x + 12.`, kind: 'tip' },
    { content: `A negative multiplier changes the sign of both products: −2(x − 5) = −2x + 10, not −2x − 10.`, kind: 'tip' },
    { content: `A bare minus in front of parentheses is a hidden −1, so every sign inside flips: 9 − (x − 4) = 13 − x.`, kind: 'tip' },
    { content: `Distribute first, then combine like terms: 3(2x + 1) + 4x = 6x + 3 + 4x = 10x + 3.`, kind: 'tip' },
    { content: `Factoring is the same rule backwards — pull out the greatest common factor: 6x + 9 = 3(2x + 3).`, kind: 'tip' },
    { content: `Check any factoring by distributing it back. If it does not rebuild the original expression, it is wrong.`, kind: 'tip' },
    { content: `The multiplier includes its minus sign. In −2(x − 5), the multiplier is **−2**, not 2. Say it out loud before you multiply: "negative two times x, negative two times negative five." That gives −2x + 10, not −2x − 10.`, kind: 'common-error' },
    { content: `A bare minus in front of parentheses is a hidden −1. Write it in: 9 − (x − 4) → 9 + (−1)(x − 4) = 9 − x + 4 = 13 − x. Don't just erase the parentheses and copy the signs.`, kind: 'gotcha' },
    { content: `Distribute to EVERY term, not just the first. 4(x + 3) = 4x + 12, never 4x + 3. If a number inside the parentheses comes out unchanged, you skipped a multiplication.`, kind: 'common-error' },
    { content: `"Greatest" is part of the job. 8x − 20 = 2(4x − 10) is true but unfinished — 4 and 10 still share a 2. After factoring, check whether the numbers left inside still have a common factor.`, kind: 'edge-case' },
    { content: `Check factoring by distributing back. If 3(2x + 3) doesn't rebuild 6x + 9 exactly, your factoring is wrong. This takes ten seconds and catches almost every mistake.`, kind: 'tip' },
    { content: `Expand and factor are opposites, not synonyms. Expand removes parentheses (4(x+3) → 4x+12); factor builds them (6x+9 → 3(2x+3)). Read the instruction word before you start.`, kind: 'vocab-note' },
    { content: `Distribute first, THEN combine like terms. In 3(2x + 1) + 4x you can't add 3 and 4x, and you can't touch the 4x until the parentheses are gone. Get 6x + 3 + 4x first.`, kind: 'gotcha' },
    { content: `When the x pile combines to 1x or −1x, write x or −x. And if a coefficient becomes 0, that whole term disappears — don't leave "0x" in your final answer.`, kind: 'edge-case' },
  ],
};
