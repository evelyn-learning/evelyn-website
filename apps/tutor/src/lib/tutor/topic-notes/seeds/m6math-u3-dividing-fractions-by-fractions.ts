/**
 * Grade 6 Math — Unit 3 CED 3.2: Dividing Fractions by Fractions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.dividing-fractions-by-fractions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U3_DIVIDING_FRACTIONS_BY_FRACTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.dividing-fractions-by-fractions.v1',
  course: 'Grade 6 Math',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Dividing Fractions by Fractions',
  planId: 'evelyn.ms.m6math.dividing-fractions-by-fractions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.dividing-fractions-by-fractions.v1' }],
  theory: [
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Division asks how many fit', content: `DIVISION ASKS HOW MANY FIT — 3/4 divided by 1/2 asks how many halves fit inside three-fourths. Holding on to that question is what makes an answer believable, especially when the answer comes out bigger than the number you started with.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Every fraction has a reciprocal', content: `EVERY FRACTION HAS A RECIPROCAL — the reciprocal of a fraction is that fraction flipped over. The reciprocal of 2/5 is 5/2, and the reciprocal of 3/4 is 4/3. A fraction times its own reciprocal is always 1, because 3/4 × 4/3 = 12/12 = 1. Here is why that makes the rule below work: multiply BOTH numbers in the division by the reciprocal of the second one, and the second one turns into 1. Dividing by 1 leaves a number alone, so what is left is the first fraction times that reciprocal, which is exactly the rule.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Keep, change, flip', content: `KEEP, CHANGE, FLIP — keep the first fraction exactly as it is, change the division sign into a multiplication sign, and flip the second fraction into its reciprocal. Then multiply straight across: top times top, bottom times bottom.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Only the second fraction flips', content: `ONLY THE SECOND FRACTION FLIPS — the fraction that gets turned upside down is the one you are dividing BY, the one written after the division sign. Flipping the first one instead produces a completely different number. Say it out loud before you write anything: the second one flips.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Simplify, then check by multiplying back', content: `SIMPLIFY, THEN CHECK BY MULTIPLYING BACK — after multiplying, reduce the fraction by any factor the top and the bottom share. Then check: your answer times the second fraction should give the first fraction back. If it does not, one of the three moves went wrong.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'framework', title: 'Dividing by a number less than 1 makes the answer bigger', content: `DIVIDING BY A NUMBER LESS THAN 1 MAKES THE ANSWER BIGGER — this feels wrong at first, because dividing whole numbers always makes things smaller. But three-fourths of a cup fills more than one half-cup bag, so the answer has to be more than 1. Run that size test before you trust your arithmetic.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'definition', title: 'reciprocal', content: `a fraction flipped over, so the reciprocal of 3/4 is 4/3; a fraction times its reciprocal equals 1.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'definition', title: 'divisor', content: `the number you are dividing by, written after the division sign. In a fraction division, this is the fraction that flips.` },
    { loId: 'm6math.dividing-fractions-by-fractions', kind: 'definition', title: 'simplify', content: `to rewrite a fraction with the smallest whole numbers possible by dividing the top and the bottom by a common factor.` },
  ],
  methods: [
    {
      title: 'Worked three fourths by one half',
      steps: [
        `Read the question in words first: how many half-cups fit inside three-fourths of a cup? Three-fourths is more than one half, so the answer will be more than 1. Now you know roughly where to land.`,
        'KEEP the first fraction exactly as it is: 3/4.',
        'CHANGE the division sign into a multiplication sign.',
        `FLIP the second fraction into its reciprocal: 1/2 becomes 2/1. The problem is now 3/4 × 2/1.`,
        'Multiply straight across. Top: 3 × 2 = 6. Bottom: 4 × 1 = 4. That gives 6/4.',
        `Simplify. Both 6 and 4 divide by 2, so 6/4 becomes 3/2, which is the same as 1 and 1/2.`,
        `Check by multiplying back: 3/2 × 1/2 = 3/4, which is exactly the amount you started with, so the answer holds. It is also bigger than 1, just as the size test predicted.`,
        `Read it back into the story: one full bag and half of a second bag, which is what three-fourths of a cup poured into half-cup bags actually looks like.`,
      ],
      example: { problem: `You have 3/4 of a cup of trail mix and each snack bag holds 1/2 a cup. Work out 3/4 ÷ 1/2.`, solution: '3/2, which is 1 and 1/2' },
      relatedLoIds: ['m6math.dividing-fractions-by-fractions'],
    },
    {
      title: 'Worked three eighths by three fourths',
      steps: [
        `Size test first. You are dividing by 3/4, which is less than 1, so the answer will be bigger than 3/8. It will still be a small number, because 3/4 is nearly a whole.`,
        'KEEP the first fraction: 3/8.',
        `CHANGE the sign to multiplication, and FLIP the second fraction: 3/4 becomes 4/3. The problem is now 3/8 × 4/3.`,
        'Multiply straight across. Top: 3 × 4 = 12. Bottom: 8 × 3 = 24. That gives 12/24.',
        'Simplify. Both 12 and 24 divide by 12, so 12/24 becomes 1/2.',
        `WRONG: flipping the FIRST fraction instead, which turns the problem into 8/3 × 3/4 = 24/12 = 2. CORRECT: only the second fraction flips, so the answer is 1/2. Notice how far apart 2 and 1/2 are. Flipping the wrong fraction is not a small slip; it lands nowhere near the right answer.`,
        `Check by multiplying back: 1/2 × 3/4 = 3/8, the number you started with. And 1/2 is bigger than 3/8, which is exactly what the size test predicted.`,
      ],
      example: { problem: 'Work out 3/8 ÷ 3/4.', solution: '1/2' },
      relatedLoIds: ['m6math.dividing-fractions-by-fractions'],
    },
  ],
  pointers: [
    { content: `Students often say "8/15" — Nothing was flipped, so 4/5 × 2/3 = 8/15 answers a different question. Run the three moves: keep 4/5, change the sign, flip 2/3 into 3/2. Then 4/5 × 3/2 = 12/10, which simplifies to 6/5. The size test catches this one on its own: 2/3 is less than 1, so the answer must be BIGGER than 4/5, and 8/15 is smaller than 4/5. Check the real answer by multiplying back: 6/5 × 2/3 = 12/15 = 4/5.`, kind: 'common-error' },
    { content: `Students often say "5/6" — The fraction that flips is always the divisor, the one written after the division sign. Here that is 2/3, whose reciprocal is 3/2, so 4/5 ÷ 2/3 = 4/5 × 3/2 = 12/10 = 6/5. Multiplying back exposes the mistake: 5/6 × 2/3 = 10/18 = 5/9, and 5/9 is not 4/5, so 5/6 cannot be the answer.`, kind: 'common-error' },
    { content: `Dividing by a fraction asks how many of the second fraction fit inside the first.`, kind: 'tip' },
    { content: `The reciprocal of a fraction is that fraction flipped: the reciprocal of 3/4 is 4/3, and 3/4 × 4/3 = 1.`, kind: 'tip' },
    { content: `Keep, change, flip: keep the first fraction, change the division sign to multiplication, flip the SECOND fraction, then multiply straight across.`, kind: 'tip' },
    { content: `Only the second fraction flips. Flipping the first one gives a completely different number, not a near miss.`, kind: 'tip' },
    { content: `Simplify the result, then check by multiplying back: the answer times the second fraction must return the first fraction.`, kind: 'tip' },
    { content: `Dividing by a number less than 1 makes the answer bigger, so size-test every answer before you trust it.`, kind: 'tip' },
    { content: `Only the SECOND fraction flips—the one after the division sign. Flipping the first one is not a small mistake; it lands you nowhere near the right answer.`, kind: 'common-error' },
    { content: `Say it out loud: 'The second one flips.' Do this before you write anything down. It takes 3 seconds and catches the most common mistake.`, kind: 'tip' },
    { content: `Dividing by a fraction less than 1 makes your answer BIGGER, not smaller. Run the size test first: if the divisor is less than 1, your answer must be bigger than the first fraction.`, kind: 'gotcha' },
    { content: `The divisor is the fraction you divide BY—the one written after ÷. That is the one whose reciprocal you use. Do not mix up divisor with dividend.`, kind: 'vocab-note' },
    { content: `After multiplying, always simplify. Then always check by multiplying your answer times the second fraction. It must give you the first fraction back, or something went wrong.`, kind: 'tip' },
    { content: `The reciprocal of a fraction flipped is the fraction flipped. 2/5 flipped is 5/2. If you forget which way to flip, remember: numerator and denominator swap places, that's it.`, kind: 'vocab-note' },
    { content: `Do not just multiply the two fractions as they stand. If you skip Keep-Change-Flip and write 4/5 × 2/3, you are answering a different question entirely—and the size test will catch you.`, kind: 'common-error' },
    { content: `Before you do any arithmetic, ask: 'How many of the second fraction fit inside the first?' This one question will tell you if your final answer is roughly in the right ballpark.`, kind: 'tip' },
  ],
};
