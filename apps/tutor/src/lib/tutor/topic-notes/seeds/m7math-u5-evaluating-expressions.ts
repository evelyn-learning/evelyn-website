/**
 * Grade 7 Math — Unit 5 CED 5.2: Evaluating Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.evaluating-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U5_EVALUATING_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.evaluating-expressions.v1',
  course: 'Grade 7 Math',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Evaluating Expressions',
  planId: 'evelyn.ms.m7math.evaluating-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.evaluating-expressions.v1' }],
  theory: [
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'Evaluate means two jobs in order', content: `EVALUATE MEANS TWO JOBS IN ORDER — first SUBSTITUTE, which is swapping the given number in for every copy of the letter, and only then COMPUTE. Do not start the arithmetic while letters are still standing. Finish the swap for the whole expression, write the new line down, then work.` },
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'Wrap the substituted number in parentheses', content: `WRAP THE SUBSTITUTED NUMBER IN PARENTHESES — every time, not just when it feels risky. In 3x with x = 5 write 3(5), which is 15. If x = −4, write 3(−4), which is −12. Writing 3 − 4 instead turns a multiplication into a subtraction and quietly gives you −1. The parentheses are what keep the number and the operation from blurring together.` },
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'The squared-negative trap', content: `THE SQUARED-NEGATIVE TRAP — this is the big one. If x = −4, then x² means (−4)², which is (−4) times (−4) = 16, because a negative times a negative is positive. Written without the parentheses it becomes −4², which means take 4² = 16 and THEN make it negative, giving −16. Same digits, opposite answers. So (−4)² = 16 and −4² = −16, and the parentheses habit is what gets you the right one.` },
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'Order of operations runs the rest', content: `ORDER OF OPERATIONS RUNS THE REST — once every letter is a number, work in the usual order: parentheses first, then exponents, then multiplying and dividing from left to right, then adding and subtracting from left to right. A coefficient always means multiply, so 5n with n = 3 is 5 times 3 = 15, never the two digits pushed together.` },
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'Two variables, two swaps', content: `TWO VARIABLES, TWO SWAPS — when an expression has more than one letter, substitute both before you compute, and keep straight which number belongs to which letter. If a = 7 and b = −2, then 2a − 3b becomes 2(7) − 3(−2). Swapping the two values by accident is one of the most common ways to lose a correct method.` },
    { loId: 'm7math.evaluating-expressions', kind: 'framework', title: 'Subtracting a negative still adds', content: `SUBTRACTING A NEGATIVE STILL ADDS — after substituting you will often meet something like 14 − (−6). That is 14 + 6 = 20. The parentheses make the two signs sit side by side where you can see them instead of hiding one inside the other.` },
    { loId: 'm7math.evaluating-expressions', kind: 'definition', title: 'substitute', content: `to replace a variable with a given number, written inside parentheses: replacing x with −4 gives (−4).` },
    { loId: 'm7math.evaluating-expressions', kind: 'definition', title: 'evaluate', content: `to substitute the given values and then compute, so the expression becomes a single number.` },
    { loId: 'm7math.evaluating-expressions', kind: 'definition', title: 'order of operations', content: `the agreed order for computing: parentheses, exponents, multiply and divide left to right, add and subtract left to right.` },
  ],
  methods: [
    {
      title: 'Worked negative squared',
      steps: [
        `Substitute first, and put the −4 in parentheses: 3(−4)² − 5. Nothing has been computed yet; the letter is simply gone.`,
        `Order of operations says exponents before multiplying, so square first: (−4)² means (−4) times (−4), which is 16. A negative times a negative is positive.`,
        'Now multiply: 3 times 16 = 48. The expression is 48 − 5.',
        'Subtract: 48 − 5 = 43.',
        `Look hard at that second step. WRONG answer to avoid: −53, which is what you get from writing −4² = −16, then 3(−16) = −48, then −48 − 5 = −53. RIGHT answer: 43. The parentheses around the −4 are the whole difference.`,
        `The rule to keep: (−4)² = 16, because the parentheses say the negative is part of what gets squared. But −4² = −16, because there the squaring happens first and the minus sign waits outside.`,
      ],
      example: { problem: 'Evaluate 3x² − 5 when x = −4.', solution: '43' },
      relatedLoIds: ['m7math.evaluating-expressions'],
    },
    {
      title: 'Worked two variables',
      steps: [
        `Write down which number belongs to which letter before you touch the expression: a is 7, b is −2. Mixing these up is the easiest way to lose a problem you actually know how to do.`,
        'Substitute both, each in parentheses: 2(7) − 3(−2).',
        `Multiply left to right. 2(7) = 14. Then 3(−2) = −6, so the expression reads 14 − (−6).`,
        'Subtracting a negative adds: 14 − (−6) = 14 + 6 = 20.',
        `WRONG answer to avoid: 8, which comes from writing 14 − 6 and letting the negative on b disappear. RIGHT answer: 20. The b value was negative, and that minus sign has to survive the trip.`,
        `Quick sense check by swapping nothing and rereading: 2a is 14, and we are taking away 3b, which is a negative six. Taking away something negative makes the total bigger, so an answer above 14 is exactly what we should expect.`,
      ],
      example: { problem: 'Evaluate 2a − 3b when a = 7 and b = −2.', solution: '20' },
      relatedLoIds: ['m7math.evaluating-expressions'],
    },
  ],
  pointers: [
    { content: `Students often say "−36" — Substitute in parentheses: x² with x = −6 is (−6)², which is (−6) times (−6) = 36. A negative times a negative is positive. Compare the two forms carefully: (−6)² = 36, while −6² = −36. Only the first one is what x² asks for when x is −6.`, kind: 'common-error' },
    { content: `Students often say "−12" — An exponent counts copies of the base being multiplied, so x² means x times x, not x times 2. With x = −6 that is (−6)(−6) = 36. It is worth checking with a friendly number too: with x = 5, x² = 25 while 2x = 10, so the two are clearly not the same instruction.`, kind: 'common-error' },
    { content: `Evaluate means substitute first, compute second. Finish every swap before any arithmetic.`, kind: 'tip' },
    { content: 'Put every substituted number in parentheses: x = −4 in 3x gives 3(−4) = −12.', kind: 'tip' },
    { content: 'Parentheses decide the squared-negative case: (−4)² = 16, but −4² = −16.', kind: 'tip' },
    { content: `After substituting, follow the order of operations: parentheses, exponents, multiply and divide, add and subtract.`, kind: 'tip' },
    { content: `With two variables, write down which number belongs to which letter, then substitute both: 2a − 3b at a = 7, b = −2 is 2(7) − 3(−2) = 20.`, kind: 'tip' },
    { content: `Substituting is also how you check yourself later — put the same number into two expressions and see whether they agree.`, kind: 'tip' },
    { content: `\`(−4)² = 16\` but \`−4² = −16\`. Same digits, opposite signs. When x = −4, x² means **(−4)²**, so write the parentheses every single time you substitute a negative.`, kind: 'gotcha' },
    { content: `x² does NOT mean 2x. The exponent counts copies of the base being multiplied: x² = x·x. Test it with a friendly number — at x = 5, x² = 25 but 2x = 10.`, kind: 'common-error' },
    { content: `3x with x = 5 is 3(5) = 15, not 35. A number written next to a letter always means multiply — never push the digits together.`, kind: 'common-error' },
    { content: `Don't drop the minus sign from a negative value. If b = −2, then 3b = −6 and the expression reads 14 − (−6) = 20, not 14 − 6 = 8.`, kind: 'gotcha' },
    { content: `Before substituting two variables, write "a = 7, b = −2" off to the side. Swapping which number goes with which letter ruins a problem you actually know how to do.`, kind: 'tip' },
    { content: `"Evaluate" = substitute, THEN compute. Finish replacing every copy of the letter and write that whole new line down before you do any arithmetic.`, kind: 'vocab-note' },
    { content: `Substituting doesn't mean "do it left to right." Once the letters are gone, exponents come before multiplying: 3(−4)² − 5 is 3(16) − 5 = 43, not (3·−4)² − 5.`, kind: 'edge-case' },
    { content: `Sense-check negatives: subtracting a negative makes the answer bigger. In 2a − 3b with b negative, expect an answer above 2a. If yours came out smaller, a sign got lost.`, kind: 'tip' },
  ],
};
