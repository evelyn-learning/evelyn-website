/**
 * Grade 8 Math — Linear Equations in One Variable: Equations with Rational
 * Coefficients.
 *
 * PROCEDURE-LED. The student already collects variable terms from both sides
 * and finishes a two-step equation; what is new is a coefficient or constant
 * that is a fraction or a decimal, and the one move that removes it BEFORE
 * any solving starts (CCSS 8.EE.C.7b): multiply every term on both sides by
 * the least common denominator, or, for decimals, either work directly or
 * multiply every term by 10 or 100. The concept segment is a short ordered
 * recipe: find the LCD, multiply EVERY term (the plain numbers too), then
 * run the moves the student already owns, then check in the ORIGINAL
 * equation. Two traps this plan is built to kill: multiplying only the terms
 * that visibly carry a fraction and leaving a plain constant untouched, and
 * dividing by the digits of a decimal coefficient (1.8 ÷ 3) instead of by
 * the coefficient itself (1.8 ÷ 0.3).
 *
 * SCOPE GUARD: Grade 8 row 4.3 solves linear equations whose coefficients
 * and constants are fractions or decimals, by clearing fractions with the
 * LCD or by working directly with decimals (or clearing them with a power of
 * ten), then finishing with the collect-then-two-step moves of row 4.1 and
 * checking in the original equation. Withholds: nothing further at G8;
 * `alg1-u2-multi-step-equations.ts` repeats fraction clearing as HS review.
 * Below, assumed and recalled in at most a sentence, never re-taught: a
 * single fraction coefficient in a one-step equation ((2/3)x = 10 in
 * `m7math-u6-one-step-equations.ts`), two-step equations
 * (`m7math-u6-two-step-equations.ts`), common denominators and decimal
 * multiplication and division (elementary arithmetic), and collecting
 * variable terms from both sides (row 4.1), which every cleared equation in
 * this plan needs and uses. Sideways: no equation to be solved contains a
 * sum inside parentheses that must be distributed (row 4.2) — the
 * parentheses that do appear group a fraction coefficient, such as (2/3)x,
 * or a substituted value, such as 0.5(6) — and the distributive property is
 * named only as the reason that multiplying a side by the LCD multiplies
 * each of its terms. Every equation here has exactly one solution (row 4.4
 * owns the none / infinitely-many outcomes), and no inequality appears.
 * Every keyed or worked solution in this plan is an integer; the fractions
 * and decimals that appear are coefficients, constants, values inside a
 * substitution check (both sides of one check land on -17/6), or a wrong
 * answer being exposed.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U4_EQUATIONS_WITH_RATIONAL_COEFFICIENTS: LessonPlan = {
  id: 'evelyn.ms.m8math.equations-with-rational-coefficients.v1',
  title: 'Equations with Rational Coefficients',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.equations-with-rational-coefficients',
      standard: 'M8MATH-4.3',
      description:
        'Solve linear equations whose coefficients are fractions or decimals -- clear fractions by multiplying EVERY term by the LCD ((2/3)x + 1/2 = (1/6)x - 2) or work directly with decimals (0.5x + 1.2 = 0.2x + 3) -- and check by substitution (CCSS 8.EE.C.7b).',
    },
  ],
  prerequisites: ['m8math.equations-with-distribution-and-like-terms'],
  followUps: ['m8math.one-none-or-infinitely-many-solutions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a fraction coefficient inside a real question, let the old moves solve it the slow way, then reveal the one multiplication that makes the fraction vanish.',
      script:
        'Dev walks dogs on weekends. He spends three quarters of what he earns on a game pass and has $6 left over, and he wants to know what he earned. Call it m. Three quarters of m is (3/4)m, so the equation is (3/4)m + 6 = m. Every move you already own still works here: subtract (3/4)m from both sides and you get 6 = (1/4)m, then multiply both sides by 4 and m = 24. It works, but that fraction rode along through every line, and with three or four fractions in one equation the ride gets ugly fast. Today you learn a move that happens BEFORE any solving: multiply every term by one well-chosen number and the fractions disappear on the spot. For Dev that number is 4, and 4 times every term turns (3/4)m + 6 = m into 3m + 24 = 4m, an equation you could solve in your sleep. Decimals get the same treatment, with 10 or 100 doing the job that 4 did here.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-clear-then-solve',
      kind: 'concept',
      goal: 'Install the find-the-LCD, multiply-every-term recipe, the two roads for decimals, and the check in the original equation.',
      keyIdeas: [
        'FRACTIONS AND DECIMALS ARE JUST COEFFICIENTS — in (2/3)x + 1/2 = (1/6)x - 2, the coefficient of x on the left is 2/3 and on the right it is 1/6, and every move you already own (collect the variable terms, clear the constant, divide by the coefficient) still works on them. The trouble is that each move drags the fractions along, so the smart first move is to get rid of them before you solve anything.',
        'THE LCD IS THE NUMBER THAT CLEARS THEM ALL — the least common denominator is the smallest number that every denominator in the equation divides into evenly. For denominators 3, 2 and 6 it is 6; for 4 and 6 it is 12, not 24. Any common multiple would work, but the smallest one keeps the numbers you carry afterward as small as possible.',
        'MULTIPLY EVERY TERM BY THE LCD, INCLUDING THE ONES WITHOUT A FRACTION — multiplying a whole side by 6 means every term on that side is multiplied by 6, which is the distributive property you already use. So 6 times each term of (2/3)x + 1/2 = (1/6)x - 2 gives 4x + 3 = x - 12: the 6 cancels each denominator (6 × 2/3 = 4, 6 × 1/2 = 3, 6 × 1/6 = 1), and the plain -2 becomes -12. Forgetting the plain term is the mistake this lesson is built to kill.',
        'DECIMALS: SOLVE DIRECTLY, OR CLEAR THEM WITH A POWER OF TEN — 0.5x + 1.2 = 0.2x + 3 can be solved as it stands, because 0.5x - 0.2x = 0.3x and 1.8 ÷ 0.3 = 6 are decimal arithmetic you already do. Or multiply every term by 10 to get 5x + 12 = 2x + 30 and work with whole numbers. Pick 10 when the longest decimal has one place and 100 when it has two, and multiply EVERY term, so the plain 3 becomes 30.',
        'AFTER THE CLEAR, IT IS AN EQUATION YOU ALREADY SOLVE — 4x + 3 = x - 12 has whole-number coefficients and the variable on both sides, so collect the variable terms, clear the constant, then divide. The new move is the multiplication at the start; every move after it is one you already own.',
        'CHECK IN THE ORIGINAL EQUATION, FRACTIONS AND ALL — substitute into the equation you were GIVEN, not the cleared one, because a term you forgot to multiply is invisible in the cleared version and shows up only in the original. Both sides may land on a fraction, such as -17/6 and -17/6, and that is fine, as long as they land on the same one.',
      ],
      vocabulary: [
        { term: 'rational coefficient', definition: 'a coefficient that is a fraction or a decimal, such as the 2/3 in (2/3)x or the 0.5 in 0.5x.' },
        { term: 'least common denominator (LCD)', definition: 'the smallest number that every denominator in the equation divides into evenly.' },
        { term: 'clearing fractions', definition: 'multiplying every term on both sides of an equation by the LCD so that no fraction remains.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-clear-fractions-with-lcd',
      kind: 'worked_example',
      problem: 'Solve: (2/3)x + 1/2 = (1/6)x - 2',
      steps: [
        'List the denominators: 3, 2 and 6. The LCD is 6, because 6 is the smallest number that 3, 2 and 6 all divide into evenly.',
        'Multiply EVERY term by 6. Left side: 6 × (2/3)x = 4x, since 6 ÷ 3 = 2 and 2 × 2 = 4; 6 × 1/2 = 3. Right side: 6 × (1/6)x = x; 6 × (-2) = -12. The equation is now 4x + 3 = x - 12, with no fraction anywhere.',
        'WRONG: multiplying only the terms that show a fraction and leaving the -2 alone, so the equation becomes 4x + 3 = x - 2, then 3x = -5 and x = -5/3. CORRECT: the -2 is a term on the right side, and the whole right side was multiplied by 6, so the -2 becomes -12. Every term gets the LCD, fraction or not.',
        'Collect the variable terms. Subtract x from both sides: 4x - x + 3 = -12, which is 3x + 3 = -12.',
        'Finish the two-step equation. Subtract 3 from both sides: 3x = -15. Divide both sides by 3: x = -5.',
        'Check in the ORIGINAL equation. Left: (2/3)(-5) + 1/2 = -10/3 + 1/2 = -20/6 + 3/6 = -17/6. Right: (1/6)(-5) - 2 = -5/6 - 12/6 = -17/6. Both sides give -17/6, so x = -5 holds. Try the wrong answer -5/3 instead and the two sides come out as -11/18 and -41/18, nowhere near equal.',
      ],
      answer: 'x = -5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-decimals-two-roads',
      kind: 'worked_example',
      problem: 'Solve: 0.5x + 1.2 = 0.2x + 3',
      steps: [
        'Road one, work with the decimals directly. Subtract the smaller variable term, 0.2x, from both sides: 0.5x - 0.2x = 0.3x, so the equation is 0.3x + 1.2 = 3.',
        'Clear the constant: subtract 1.2 from both sides, 0.3x = 1.8.',
        'Divide both sides by 0.3. To divide by a decimal, shift both decimal points one place: 1.8 ÷ 0.3 = 18 ÷ 3 = 6. So x = 6.',
        'WRONG: dividing 1.8 by the digit 3 and ignoring the decimal point, so x = 0.6. CORRECT: the coefficient is 0.3, so the division is by 0.3, and 1.8 ÷ 0.3 = 6. The check exposes the slip: for x = 0.6, the left is 0.5(0.6) + 1.2 = 0.3 + 1.2 = 1.5 and the right is 0.2(0.6) + 3 = 0.12 + 3 = 3.12, nowhere near equal.',
        'Road two, clear the decimals first. The longest decimal has one place, so multiply EVERY term by 10: 5x + 12 = 2x + 30. Subtract 2x: 3x + 12 = 30. Subtract 12: 3x = 18. Divide by 3: x = 6. Same answer, whole numbers the whole way.',
        'Check in the ORIGINAL equation. Left: 0.5(6) + 1.2 = 3 + 1.2 = 4.2. Right: 0.2(6) + 3 = 1.2 + 3 = 4.2. Both sides give 4.2, so x = 6 holds.',
      ],
      answer: 'x = 6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-halves-and-fifths',
      kind: 'try_yourself',
      problem: 'Solve for x: (1/2)x + 3 = (1/5)x + 6',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 1' },
        { id: 'b', text: 'x = 9' },
        { id: 'c', text: 'x = 30' },
        { id: 'd', text: 'x = 10', correct: true },
      ],
      expectedAnswer: 'x = 10',
      hints: [
        'The denominators are 2 and 5, so the LCD is 10. Multiply every term by 10, including the plain 3 and the plain 6.',
        'That gives 5x + 30 = 2x + 60. Subtract 2x from both sides, then subtract 30, then divide by 3. Check in the original equation: half of your answer plus 3 must equal a fifth of it plus 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-first-move-lcd',
      kind: 'try_yourself',
      problem: 'A student wants to clear the fractions from (3/4)x - 2 = (1/6)x + 5 by multiplying every term by the LCD. Which equation is the correct result?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9x - 2 = 2x + 5' },
        { id: 'b', text: '9x - 24 = 2x + 60', correct: true },
        { id: 'c', text: '3x - 2 = x + 5' },
        { id: 'd', text: '3x - 24 = 2x + 60' },
      ],
      expectedAnswer: '9x - 24 = 2x + 60',
      hints: [
        'The denominators are 4 and 6. The LCD is the smallest number both divide into evenly, which is 12, not 24. Every term gets multiplied by it, including the -2 and the 5.',
        '12 × (3/4)x: 12 ÷ 4 = 3, then 3 × 3 = 9, so the term is 9x. 12 × (1/6)x = 2x. Then 12 × (-2) = -24 and 12 × 5 = 60.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-decimals',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 0.4x + 2.5 = 0.15x + 4.5',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Either work directly (0.4x - 0.15x = 0.25x) or clear the decimals first: the longest decimal, 0.15, has two places, so multiply every term by 100.',
        'Clearing by 100 gives 40x + 250 = 15x + 450. Subtract 15x from both sides, then subtract 250, then divide by 25. Check your answer in the original equation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forgotten-term-and-decimal-divide',
      kind: 'misconception_check',
      question: 'Ana solves (1/3)x + 4 = (1/4)x + 6 and gets x = 2. Ben solves 0.6x - 1 = 0.2x + 0.2 and gets x = 0.3. Substitute each answer into both sides of its original equation. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 2',
          misconception: 'Multiplying only the fraction terms by the LCD of 12 and leaving the plain 4 and 6 untouched, so the equation becomes 4x + 4 = 3x + 6 and x = 2.',
          correctsTo:
            'Every term on both sides gets multiplied by 12, fraction or not: 4x + 48 = 3x + 72. Subtract 3x to get x + 48 = 72, then subtract 48 to get x = 24. The check tells the story: for x = 2, the left is (1/3)(2) + 4 = 2/3 + 4 = 14/3 and the right is (1/4)(2) + 6 = 1/2 + 6 = 13/2, which are not equal. For x = 24, the left is 24/3 + 4 = 8 + 4 = 12 and the right is 24/4 + 6 = 6 + 6 = 12.',
        },
        {
          answer: 'x = 0.3',
          misconception: 'Collecting correctly to 0.4x = 1.2, then dividing 1.2 by the digit 4 instead of by 0.4, as if the decimal point in the coefficient were not there.',
          correctsTo:
            'The coefficient is 0.4, so the last step divides by 0.4: 1.2 ÷ 0.4 = 12 ÷ 4 = 3, so x = 3. The other road avoids the decimal division entirely: multiply every term by 10 to get 6x - 10 = 2x + 2, then 4x = 12 and x = 3. The check exposes x = 0.3: the left is 0.6(0.3) - 1 = 0.18 - 1 = -0.82 and the right is 0.2(0.3) + 0.2 = 0.06 + 0.2 = 0.26, nowhere near equal. For x = 3, the left is 0.6(3) - 1 = 1.8 - 1 = 0.8 and the right is 0.2(3) + 0.2 = 0.6 + 0.2 = 0.8.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Fractions and decimals are ordinary coefficients; the only new move is clearing them BEFORE you solve.',
        'Find the LCD, the smallest number every denominator divides into evenly, and multiply EVERY term on both sides by it, including the terms with no fraction.',
        'For decimals, either work directly or multiply every term by 10 or 100, chosen by the longest decimal, and always divide by the whole coefficient, decimal point included.',
        'After the clear, the equation has whole-number coefficients: collect the variable terms, clear the constant, divide.',
        'Check by substituting into the ORIGINAL equation, fractions and all; a term you forgot to multiply only shows up there.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Equations with Rational Coefficients' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
