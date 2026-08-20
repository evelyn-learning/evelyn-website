/**
 * Grade 7 Math — Unit 2 CED 2.2: Subtracting Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.subtracting-rational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U2_SUBTRACTING_RATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.subtracting-rational-numbers.v1',
  course: 'Grade 7 Math',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Subtracting Rational Numbers',
  planId: 'evelyn.ms.m7math.subtracting-rational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.subtracting-rational-numbers.v1' }],
  theory: [
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'There is only one rule', content: `THERE IS ONLY ONE RULE — a − b = a + (−b). Change the subtraction sign to a plus, and change the number right after it to its opposite. Then you are back in the last lesson and the addition rules finish the job. Nothing new gets memorized. So 5 − 8 becomes 5 + (−8) = −3.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'Two minus signs in a row mean add', content: `TWO MINUS SIGNS IN A ROW MEAN ADD — this is the step people drop, so slow down here. In 5 − (−3), the opposite of −3 is 3, so the whole thing becomes 5 + 3 = 8. On the number line, subtracting a negative moves you RIGHT, which means the answer gets BIGGER than where you started. If your answer after subtracting a negative came out smaller, you missed the rewrite.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'Rewrite first, compute second', content: `REWRITE FIRST, COMPUTE SECOND — write the plus-and-opposite version on paper before you calculate anything. Doing the rewrite and the arithmetic in one mental jump is where sign errors live. So −7 − 4 gets written as −7 + (−4) first, and only then does it become −11.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'Order matters in subtraction', content: `ORDER MATTERS IN SUBTRACTION — 3 − 8 = −5 but 8 − 3 = 5, so you cannot swap the two numbers. You may only swap AFTER the rewrite, because addition does allow it: 3 + (−8) is the same as −8 + 3.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'Fractions and decimals follow the same path', content: `FRACTIONS AND DECIMALS FOLLOW THE SAME PATH — rewrite as adding the opposite, then find a common denominator or line up the decimal points. So 1/3 − (−1/4) becomes 1/3 + 1/4, which is 4/12 + 3/12 = 7/12.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'framework', title: 'Distance is the absolute value of the difference', content: `DISTANCE IS THE ABSOLUTE VALUE OF THE DIFFERENCE — how far apart two rational numbers sit is |a − b|. From −2.5 to 6 the distance is |−2.5 − 6| = |−8.5| = 8.5. Because it is a distance it is never negative, and it comes out the same either way around: |6 − (−2.5)| = |8.5| = 8.5 too.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'definition', title: 'difference', content: 'the result of subtracting one number from another.' },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'definition', title: 'opposite', content: `the number the same distance from zero but on the other side; the opposite of −3 is 3.` },
    { loId: 'm7math.subtracting-rational-numbers', kind: 'definition', title: 'distance between two numbers', content: `how far apart they sit on the number line, found with |a − b| and never negative.` },
  ],
  methods: [
    {
      title: 'Worked rewrite three cases',
      steps: [
        `(a) The number after the subtraction sign is −3, and the opposite of −3 is 3. So 5 − (−3) becomes 5 + 3. Same signs, so add: the answer is 8. Notice 8 is BIGGER than the 5 you started from, which is exactly what subtracting a negative does.`,
        `(b) The number after the subtraction sign is 4, and the opposite of 4 is −4. So −7 − 4 becomes −7 + (−4). Both are negative, so add the absolute values and keep the sign: 7 + 4 = 11, giving −11.`,
        `(c) The number after the subtraction sign is −9, and the opposite of −9 is 9. So −2 − (−9) becomes −2 + 9. Different signs, so subtract: 9 − 2 = 7, and the 9 had the larger absolute value and was positive, so the answer is 7.`,
        `Look back at (c). It started with two negative-looking numbers and finished with a positive 7. WRONG answer to avoid: −11, which comes from adding the absolute values as if it were −2 + (−9). RIGHT answer: 7. The rewrite is what keeps them apart.`,
      ],
      example: { problem: 'Rewrite each as addition, then compute: (a) 5 − (−3), (b) −7 − 4, (c) −2 − (−9)', solution: '(a) 8, (b) −11, (c) 7' },
      relatedLoIds: ['m7math.subtracting-rational-numbers'],
    },
    {
      title: 'Worked fractions and distance',
      steps: [
        `(a) Rewrite before anything else. The opposite of −1/2 is 1/2, so −3/5 − (−1/2) becomes −3/5 + 1/2.`,
        `(a) Now the pieces need to match. The smallest number 5 and 2 both divide into is 10, so −3/5 = −6/10 and 1/2 = 5/10. The problem reads −6/10 + 5/10.`,
        `(a) Different signs, so subtract the smaller absolute value from the larger: 6/10 − 5/10 = 1/10. The larger absolute value belonged to −6/10, which is negative, so the answer is −1/10. Check with decimals: −0.6 + 0.5 = −0.1, and −1/10 is −0.1.`,
        `(b) Distance is the absolute value of the difference, so compute |−4.75 − 2.5|. Rewrite the inside as adding the opposite: −4.75 + (−2.5). Same signs, so add the absolute values: 4.75 + 2.50 = 7.25, and both were negative, so the inside is −7.25.`,
        `(b) Finish the bars: |−7.25| = 7.25. The two numbers sit 7.25 apart. Sanity check by counting: from −4.75 up to 0 is 4.75, and from 0 up to 2.5 is 2.5, and 4.75 + 2.5 = 7.25.`,
      ],
      example: { problem: `Compute: (a) −3/5 − (−1/2). (b) How far apart are −4.75 and 2.5 on the number line?`, solution: '(a) −1/10, (b) 7.25' },
      relatedLoIds: ['m7math.subtracting-rational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "3" — Rewrite as adding the opposite: the opposite of −5 is 5, so 8 − (−5) = 8 + 5 = 13. Subtracting a negative moves you RIGHT on the number line, so the answer must end up bigger than 8. An answer of 3 is smaller than 8, which is the signal that the rewrite got skipped.`, kind: 'common-error' },
    { content: `Students often say "−13" — 8 − (−5) means start at 8. Rewrite it as 8 + 5 = 13. Flipping to −5 − 8 asks a different question and gives −13. Keep the first number first, do the rewrite, and only then use the addition rules: the answer is 13.`, kind: 'common-error' },
    { content: `Every subtraction becomes addition: a − b = a + (−b). Rewrite on paper before you compute.`, kind: 'tip' },
    { content: `Two minus signs in a row mean add: 5 − (−3) = 5 + 3 = 8, and the answer gets bigger, not smaller.`, kind: 'tip' },
    { content: `Order matters: 3 − 8 = −5 but 8 − 3 = 5, so never swap the numbers before the rewrite.`, kind: 'tip' },
    { content: 'Fractions and decimals use the same rule: 1/3 − (−1/4) = 1/3 + 1/4 = 7/12.', kind: 'tip' },
    { content: `Distance between two numbers is |a − b|, and it is never negative: from −2.5 to 6 is 8.5.`, kind: 'tip' },
    { content: `Only the number RIGHT AFTER the subtraction sign flips. In −7 − 4, the −7 stays −7; you rewrite as −7 + (−4). Students who also flip the first number get 7 + (−4) = 3 instead of −11.`, kind: 'common-error' },
    { content: `After subtracting a negative, check that your answer got BIGGER than the number you started with. 8 − (−5) must be more than 8, so 13 is right and 3 is a warning sign that you skipped the rewrite.`, kind: 'tip' },
    { content: `Never swap the two numbers before the rewrite. 8 − (−5) is NOT −5 − 8. You may swap only after rewriting, because addition allows it: 3 + (−8) = −8 + 3.`, kind: 'gotcha' },
    { content: `Two negative-looking numbers do not guarantee a negative answer. −2 − (−9) rewrites to −2 + 9 = 7, not −11. The rewrite decides the sign, not how the problem looks.`, kind: 'edge-case' },
    { content: `Distance is |a − b| and can never be negative. If you write the distance from −3.5 to 4.25 as −7.75, you forgot the absolute value bars. Both orders give the same distance: |a − b| = |b − a|.`, kind: 'vocab-note' },
    { content: `"Difference" and "distance" are not the same. The difference 3 − 8 = −5 can be negative; the distance |3 − 8| = 5 cannot. Read the question to see which one it wants.`, kind: 'vocab-note' },
    { content: `With fractions, rewrite as adding the opposite FIRST, then find the common denominator. Don't try to do both steps at once: 1/4 − 3/8 → 1/4 + (−3/8) → 2/8 + (−3/8) = −1/8.`, kind: 'tip' },
    { content: `When the negative sign sits on a fraction, it belongs to the whole fraction: −3/5 means −0.6. Keep the sign with the numerator when you rebuild it, so −3/5 = −6/10, not 6/10.`, kind: 'gotcha' },
  ],
};
