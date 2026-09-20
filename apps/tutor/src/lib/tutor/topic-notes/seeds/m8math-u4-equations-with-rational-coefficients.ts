/**
 * Grade 8 Math — Unit 4 CED 4.3: Equations with Rational Coefficients.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.equations-with-rational-coefficients.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U4_EQUATIONS_WITH_RATIONAL_COEFFICIENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.equations-with-rational-coefficients.v1',
  course: 'Grade 8 Math',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Equations with Rational Coefficients',
  planId: 'evelyn.ms.m8math.equations-with-rational-coefficients.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.equations-with-rational-coefficients.v1' }],
  theory: [
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'framework', title: 'Fractions and decimals are just coefficients', content: `FRACTIONS AND DECIMALS ARE JUST COEFFICIENTS — in (2/3)x + 1/2 = (1/6)x - 2, the coefficient of x on the left is 2/3 and on the right it is 1/6, and every move you already own (collect the variable terms, clear the constant, divide by the coefficient) still works on them. The trouble is that each move drags the fractions along, so the smart first move is to get rid of them before you solve anything.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'framework', title: 'The lcd is the number that clears them all', content: `THE LCD IS THE NUMBER THAT CLEARS THEM ALL — the least common denominator is the smallest number that every denominator in the equation divides into evenly. For denominators 3, 2 and 6 it is 6; for 4 and 6 it is 12, not 24. Any common multiple would work, but the smallest one keeps the numbers you carry afterward as small as possible.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'framework', title: 'Multiply every term by the lcd, including the ones without a fraction', content: `MULTIPLY EVERY TERM BY THE LCD, INCLUDING THE ONES WITHOUT A FRACTION — multiplying a whole side by 6 means every term on that side is multiplied by 6, which is the distributive property you already use. So 6 times each term of (2/3)x + 1/2 = (1/6)x - 2 gives 4x + 3 = x - 12: the 6 cancels each denominator (6 × 2/3 = 4, 6 × 1/2 = 3, 6 × 1/6 = 1), and the plain -2 becomes -12. Forgetting the plain term is the mistake this lesson is built to kill.` },
    { loId: 'm8math.equations-with-rational-coefficients', content: `DECIMALS: SOLVE DIRECTLY, OR CLEAR THEM WITH A POWER OF TEN — 0.5x + 1.2 = 0.2x + 3 can be solved as it stands, because 0.5x - 0.2x = 0.3x and 1.8 ÷ 0.3 = 6 are decimal arithmetic you already do. Or multiply every term by 10 to get 5x + 12 = 2x + 30 and work with whole numbers. Pick 10 when the longest decimal has one place and 100 when it has two, and multiply EVERY term, so the plain 3 becomes 30.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'framework', title: 'After the clear, it is an equation you already solve', content: `AFTER THE CLEAR, IT IS AN EQUATION YOU ALREADY SOLVE — 4x + 3 = x - 12 has whole-number coefficients and the variable on both sides, so collect the variable terms, clear the constant, then divide. The new move is the multiplication at the start; every move after it is one you already own.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'framework', title: 'Check in the original equation, fractions and all', content: `CHECK IN THE ORIGINAL EQUATION, FRACTIONS AND ALL — substitute into the equation you were GIVEN, not the cleared one, because a term you forgot to multiply is invisible in the cleared version and shows up only in the original. Both sides may land on a fraction, such as -17/6 and -17/6, and that is fine, as long as they land on the same one.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'definition', title: 'rational coefficient', content: `a coefficient that is a fraction or a decimal, such as the 2/3 in (2/3)x or the 0.5 in 0.5x.` },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'definition', title: 'least common denominator (LCD)', content: 'the smallest number that every denominator in the equation divides into evenly.' },
    { loId: 'm8math.equations-with-rational-coefficients', kind: 'definition', title: 'clearing fractions', content: `multiplying every term on both sides of an equation by the LCD so that no fraction remains.` },
  ],
  methods: [
    {
      title: 'Worked clear fractions with lcd',
      steps: [
        `List the denominators: 3, 2 and 6. The LCD is 6, because 6 is the smallest number that 3, 2 and 6 all divide into evenly.`,
        `Multiply EVERY term by 6. Left side: 6 × (2/3)x = 4x, since 6 ÷ 3 = 2 and 2 × 2 = 4; 6 × 1/2 = 3. Right side: 6 × (1/6)x = x; 6 × (-2) = -12. The equation is now 4x + 3 = x - 12, with no fraction anywhere.`,
        `WRONG: multiplying only the terms that show a fraction and leaving the -2 alone, so the equation becomes 4x + 3 = x - 2, then 3x = -5 and x = -5/3. CORRECT: the -2 is a term on the right side, and the whole right side was multiplied by 6, so the -2 becomes -12. Every term gets the LCD, fraction or not.`,
        `Collect the variable terms. Subtract x from both sides: 4x - x + 3 = -12, which is 3x + 3 = -12.`,
        `Finish the two-step equation. Subtract 3 from both sides: 3x = -15. Divide both sides by 3: x = -5.`,
        `Check in the ORIGINAL equation. Left: (2/3)(-5) + 1/2 = -10/3 + 1/2 = -20/6 + 3/6 = -17/6. Right: (1/6)(-5) - 2 = -5/6 - 12/6 = -17/6. Both sides give -17/6, so x = -5 holds. Try the wrong answer -5/3 instead and the two sides come out as -11/18 and -41/18, nowhere near equal.`,
      ],
      example: { problem: 'Solve: (2/3)x + 1/2 = (1/6)x - 2', solution: 'x = -5' },
      relatedLoIds: ['m8math.equations-with-rational-coefficients'],
    },
    {
      title: 'Worked decimals two roads',
      steps: [
        `Road one, work with the decimals directly. Subtract the smaller variable term, 0.2x, from both sides: 0.5x - 0.2x = 0.3x, so the equation is 0.3x + 1.2 = 3.`,
        'Clear the constant: subtract 1.2 from both sides, 0.3x = 1.8.',
        `Divide both sides by 0.3. To divide by a decimal, shift both decimal points one place: 1.8 ÷ 0.3 = 18 ÷ 3 = 6. So x = 6.`,
        `WRONG: dividing 1.8 by the digit 3 and ignoring the decimal point, so x = 0.6. CORRECT: the coefficient is 0.3, so the division is by 0.3, and 1.8 ÷ 0.3 = 6. The check exposes the slip: for x = 0.6, the left is 0.5(0.6) + 1.2 = 0.3 + 1.2 = 1.5 and the right is 0.2(0.6) + 3 = 0.12 + 3 = 3.12, nowhere near equal.`,
        `Road two, clear the decimals first. The longest decimal has one place, so multiply EVERY term by 10: 5x + 12 = 2x + 30. Subtract 2x: 3x + 12 = 30. Subtract 12: 3x = 18. Divide by 3: x = 6. Same answer, whole numbers the whole way.`,
        `Check in the ORIGINAL equation. Left: 0.5(6) + 1.2 = 3 + 1.2 = 4.2. Right: 0.2(6) + 3 = 1.2 + 3 = 4.2. Both sides give 4.2, so x = 6 holds.`,
      ],
      example: { problem: 'Solve: 0.5x + 1.2 = 0.2x + 3', solution: 'x = 6' },
      relatedLoIds: ['m8math.equations-with-rational-coefficients'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 2" — Every term on both sides gets multiplied by 12, fraction or not: 4x + 48 = 3x + 72. Subtract 3x to get x + 48 = 72, then subtract 48 to get x = 24. The check tells the story: for x = 2, the left is (1/3)(2) + 4 = 2/3 + 4 = 14/3 and the right is (1/4)(2) + 6 = 1/2 + 6 = 13/2, which are not equal. For x = 24, the left is 24/3 + 4 = 8 + 4 = 12 and the right is 24/4 + 6 = 6 + 6 = 12.`, kind: 'common-error' },
    { content: `Students often say "x = 0.3" — The coefficient is 0.4, so the last step divides by 0.4: 1.2 ÷ 0.4 = 12 ÷ 4 = 3, so x = 3. The other road avoids the decimal division entirely: multiply every term by 10 to get 6x - 10 = 2x + 2, then 4x = 12 and x = 3. The check exposes x = 0.3: the left is 0.6(0.3) - 1 = 0.18 - 1 = -0.82 and the right is 0.2(0.3) + 0.2 = 0.06 + 0.2 = 0.26, nowhere near equal. For x = 3, the left is 0.6(3) - 1 = 1.8 - 1 = 0.8 and the right is 0.2(3) + 0.2 = 0.6 + 0.2 = 0.8.`, kind: 'common-error' },
    { content: `Fractions and decimals are ordinary coefficients; the only new move is clearing them BEFORE you solve.`, kind: 'tip' },
    { content: `Find the LCD, the smallest number every denominator divides into evenly, and multiply EVERY term on both sides by it, including the terms with no fraction.`, kind: 'tip' },
    { content: `For decimals, either work directly or multiply every term by 10 or 100, chosen by the longest decimal, and always divide by the whole coefficient, decimal point included.`, kind: 'tip' },
    { content: `After the clear, the equation has whole-number coefficients: collect the variable terms, clear the constant, divide.`, kind: 'tip' },
    { content: `Check by substituting into the ORIGINAL equation, fractions and all; a term you forgot to multiply only shows up there.`, kind: 'tip' },
    { content: `Multiply EVERY term by the LCD, even the plain numbers with no fraction. The -2 in (2/3)x + 1/2 = (1/6)x - 2 becomes -12 when you multiply by 6, not -2. Forgetting one plain term is the mistake this lesson stops.`, kind: 'common-error' },
    { content: `The LCD is the smallest number all denominators divide into evenly—not just any common multiple. For 3, 2, and 6, it's 6, not 12 or 18. Smaller LCD keeps your numbers smaller.`, kind: 'vocab-note' },
    { content: `When dividing by a decimal coefficient like 0.4, don't ignore the decimal point. Dividing 1.2 by 0.4 is the same as 12 ÷ 4 = 3, not 1.2 ÷ 4 = 0.3. Shift both decimals the same way.`, kind: 'common-error' },
    { content: `Always check your answer in the ORIGINAL equation with fractions or decimals, not the cleared one. A forgotten term won't show up in the cleared version but will fail the check in the original.`, kind: 'tip' },
    { content: `After you clear the fractions or decimals, stop and notice you now have a regular equation with whole-number coefficients. Use the same two-step or multi-step moves you always do—nothing changes except you started with a multiplication.`, kind: 'gotcha' },
    { content: `For decimals, you can solve directly (0.5x - 0.2x = 0.3x) OR multiply by 10 or 100 first. Both roads get the same answer. Choose 10 if the longest decimal has one place, 100 if two places.`, kind: 'edge-case' },
    { content: `Don't confuse the coefficient with the digit inside it. In 0.4x = 1.2, the coefficient is 0.4 (a decimal number), so divide 1.2 by 0.4, not by 4. The decimal point is part of the coefficient.`, kind: 'vocab-note' },
  ],
};
