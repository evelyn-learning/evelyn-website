/**
 * Grade 8 Math — Integer Exponents & Scientific Notation: Writing & Comparing
 * Numbers in Scientific Notation.
 *
 * PROCEDURE-LED. The student arrives owning powers of ten, the quotient rule,
 * and 10⁻ⁿ = 1/10ⁿ from the two rows before this one; what is new is a fixed
 * recipe for turning a wall of zeros into a × 10ⁿ and back (CCSS 8.EE.A.3).
 * The concept segment is that recipe in order: the coefficient rule
 * 1 ≤ a < 10, count decimal-point MOVES (never zeros) for a large number,
 * count moves and go negative for a small number, reverse the moves to return
 * to standard form, round the coefficient to a single digit when only size
 * matters, and answer "how many times as large" by comparing the powers of
 * ten first and adjusting by the digits second. Both worked examples run the
 * same moves and end with a work-backward check. Three traps this plan is
 * built to kill: counting zeros instead of decimal-point moves, reading the
 * difference of two exponents as the multiplier ("10⁸ is 4 times 10⁴"), and
 * treating a more negative exponent as a larger number.
 *
 * SCOPE GUARD: Grade 8 row 2.3 writes very large and very small numbers as
 * a × 10ⁿ with 1 ≤ a < 10 (negative n for small), converts back to standard
 * form, estimates a quantity as a single digit times a power of 10, and
 * compares two such numbers by "how many times as large" (3 × 10⁸ vs 6 × 10⁴
 * → 5 × 10³ times). Withholds: general operations (row 2.4). Concretely: the
 * "how many times as large" comparison IS a division of two single-digit
 * estimates, and it is in scope here because the row's own Scope cell asks for
 * it; this plan does it as "powers of ten first, then the digits", using the
 * quotient rule for powers of ten that rows 2.1-2.2 already own and plain
 * arithmetic for the digit ratio (half of 10,000 is 5,000, then written as
 * 5 × 10³). What this plan does state, in the recap, is that comparison move
 * only: subtract the exponents, divide the digits, check by multiplying back.
 * It never multiplies two numbers in scientific notation, never states
 * renormalization (rewriting 0.5 × 10⁴ as 5 × 10³) as a rule for a coefficient
 * that has left [1, 10), and never adds or subtracts after matching exponents,
 * chooses units for a result, or reads calculator E notation; all of that is
 * row 2.4. Below, assumed and not re-taught:
 * whole-number powers of ten, the quotient rule with numerical bases, and
 * 10⁻ⁿ = 1/10ⁿ (rows 2.1-2.2, recalled in a sentence each). Above:
 * `alg1-u6-negative-exponents-scientific-notation.ts` repeats convert,
 * multiply and divide as HS review; this row is written as the first teach
 * and is not thinned for it. Every quantity written in scientific notation in
 * this plan is positive, so the coefficient rule is stated as 1 ≤ a < 10
 * without absolute-value bars; only exponents go negative. Salvaged from
 * `g8-math-exponents-scientific-notation.ts`: the normalization-rule framing
 * only; its two-standards-in-one-plan shape and its exponent-rule content
 * were deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U2_SCIENTIFIC_NOTATION: LessonPlan = {
  id: 'evelyn.ms.m8math.scientific-notation.v1',
  title: 'Writing & Comparing Numbers in Scientific Notation',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.scientific-notation',
      standard: 'M8MATH-2.3',
      description:
        'Write very large and very small numbers as a × 10ⁿ with 1 ≤ a < 10 (negative n for small), convert back to standard form, estimate a quantity as a single digit times a power of 10, and compare two such numbers by "how many times as large" (3 × 10⁸ is 5 × 10³ times as large as 6 × 10⁴) (CCSS 8.EE.A.3).',
    },
  ],
  prerequisites: ['m8math.zero-and-negative-exponents'],
  followUps: ['m8math.operations-in-scientific-notation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a wall-of-zeros number and a wall-of-decimal-zeros number side by side, so the student feels why a shortcut that handles both is worth learning.',
      script:
        'The most-played song on your streaming app shows 2,400,000,000 plays. A single strand of your hair is about 0.00007 meters wide. One of those is a wall of zeros and the other is a wall of zeros after a decimal point, and both are easy to misread by one zero, which is the same as being wrong by ten times. Scientists, engineers, and the code behind that app all use one shortcut for both: 2.4 × 10⁹ plays and 7 × 10⁻⁵ meters. Every number becomes a small number between 1 and 10 times a power of ten, and the power of ten does the heavy lifting. Today you learn to write any number that way, read it back into ordinary digits, and answer the question people actually want answered: how many times as large is this one compared with that one?',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-write-read-compare',
      kind: 'concept',
      goal: 'Install the coefficient rule, the count-the-moves recipe in both directions, single-digit estimation, and the powers-of-ten-first comparison.',
      keyIdeas: [
        'THE FORM IS a × 10ⁿ, WITH a BETWEEN 1 AND 10 — scientific notation writes a number as a coefficient a times a power of ten, and the coefficient must satisfy 1 ≤ a < 10: exactly one nonzero digit sits in front of the decimal point. So 3.4 × 10⁶ is scientific notation. The values 34 × 10⁵ and 0.34 × 10⁷ equal the very same number, but neither is in scientific notation, because 34 is too big and 0.34 is too small to be the coefficient.',
        'A LARGE NUMBER GETS A POSITIVE EXPONENT — to write 4,500,000, put the decimal point right after the first nonzero digit to get 4.5, then count how many places the point moved from the end of the number: 6 places. That count is the exponent, so 4,500,000 = 4.5 × 10⁶. Check it: 4.5 × 1,000,000 = 4,500,000. Count the places the point moves, not the zeros; 4,500,000 has five zeros, but the point moves six places.',
        'A SMALL NUMBER GETS A NEGATIVE EXPONENT — to write 0.00032, move the decimal point to the right until it sits just after the first nonzero digit, giving 3.2, and count the moves: 4 places. A number less than 1 needs a negative exponent, so 0.00032 = 3.2 × 10⁻⁴. You already know that 10⁻⁴ = 1/10⁴ = 0.0001, and 3.2 × 0.0001 = 0.00032, so the check works. The sign of the exponent tells the size: positive for a number that is 10 or more, negative for a number less than 1, and zero for a number already between 1 and 10.',
        'BACK TO STANDARD FORM, THE EXPONENT SAYS HOW FAR TO MOVE — for 6.02 × 10⁵, move the decimal point 5 places to the right, filling the empty places with zeros: 602,000. For 9 × 10⁻³, move the point 3 places to the left, filling with zeros: 0.009. Positive exponent, the number grows and the point goes right; negative exponent, the number shrinks and the point goes left.',
        'ESTIMATE WITH A SINGLE DIGIT TIMES A POWER OF TEN — when the question is about size rather than exact value, round the coefficient to one digit. The United States has about 340,000,000 people, which is 3.4 × 10⁸, and for a size comparison 3 × 10⁸ is enough. The world has about 8,100,000,000 people, and 8 × 10⁹ is enough. The power of ten carries the size and the single digit carries the fine tuning.',
        'HOW MANY TIMES AS LARGE: POWERS OF TEN FIRST, THEN THE DIGITS — to compare 8 × 10⁹ with 3 × 10⁸, first compare the powers of ten: 10⁹ ÷ 10⁸ = 10¹ = 10, by the quotient rule you already own, so the exponents alone say 10 times. Then adjust by the digits: 8 ÷ 3 is a little under 3. Put them together and the world has 10 × (a little under 3) times the United States population, about 27 times. When the digits divide evenly the answer is exact: 6 × 10⁸ is 2 × 10⁴ = 20,000 times as large as 3 × 10⁴, since 10⁸ ÷ 10⁴ = 10⁴ and 6 ÷ 3 = 2.',
      ],
      vocabulary: [
        { term: 'scientific notation', definition: 'a way of writing a number as a × 10ⁿ, where a is at least 1 and less than 10 and n is an integer.' },
        { term: 'coefficient', definition: 'the number a in a × 10ⁿ; it must be at least 1 and less than 10, so exactly one nonzero digit sits in front of the decimal point.' },
        { term: 'standard form', definition: 'a number written out with all of its digits in the usual way, such as 4,500,000 or 0.00032.' },
        { term: 'power of ten', definition: 'a number such as 10⁶ or 10⁻³; its exponent counts how many places the decimal point moves.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-phone-and-silk',
      kind: 'worked_example',
      problem:
        'A 512 GB phone holds about 512,000,000,000 bytes. A strand of spider silk is about 0.000004 meters thick. Write both numbers in scientific notation, then write 3.7 × 10⁵ in standard form.',
      steps: [
        'Start with 512,000,000,000. The first nonzero digit is 5, so the coefficient will be 5.12. The decimal point currently sits at the end of the number, after the last zero; moving it to just after the 5 takes 11 places. Large number, so the exponent is positive: 512,000,000,000 = 5.12 × 10¹¹.',
        'Check by working backward: 5.12 × 10¹¹ means move the point 11 places to the right. 5.12 becomes 512 after 2 places, and the other 9 places add 9 zeros: 512,000,000,000. It matches.',
        'Now 0.000004. Move the decimal point to the right until it sits just after the 4: it passes five zeros and then the 4, which is 6 places. Small number, so the exponent is negative: 0.000004 = 4 × 10⁻⁶. Check: 10⁻⁶ = 0.000001, and 4 × 0.000001 = 0.000004.',
        'Finally 3.7 × 10⁵. The exponent is positive 5, so move the point 5 places to the right: 3.7 becomes 37 after 1 place, and the other 4 places add 4 zeros: 370,000.',
        'Check the last one by going the other way: the first nonzero digit of 370,000 is 3, the coefficient is 3.7, and the point moves 5 places from the end back to just after the 3. That gives 3.7 × 10⁵, the number we started from.',
      ],
      answer: '5.12 × 10¹¹ bytes; 4 × 10⁻⁶ meters; 370,000',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-views-comparison',
      kind: 'worked_example',
      problem:
        'A dance clip on a video app has 312,000,000 views. Your own clip has 58,000 views. Estimate each count as a single digit times a power of ten, then find about how many times as many views the dance clip has.',
      steps: [
        'Estimate the big count. 312,000,000 = 3.12 × 10⁸, because the point moves 8 places from the end to sit after the 3. Rounding the coefficient to one digit gives 3 × 10⁸.',
        'Estimate the small count. 58,000 = 5.8 × 10⁴, because the point moves 4 places. Rounding 5.8 to one digit gives 6 × 10⁴.',
        'Compare the powers of ten first: 10⁸ ÷ 10⁴ = 10⁴ = 10,000. If the digits were equal, the dance clip would have 10,000 times as many views.',
        'WRONG: reading the exponents 8 and 4, subtracting to get 4, and answering "4 times as many views". CORRECT: the difference in the exponents counts powers of ten, not plain units. Four more in the exponent means 10 × 10 × 10 × 10 = 10,000 times, and 312,000,000 is obviously far more than 4 times 58,000.',
        'Now adjust by the digits: 3 ÷ 6 = 0.5, so the dance clip has only half the digit that your clip has. Half of 10,000 is 5,000. The dance clip has about 5,000 = 5 × 10³ times as many views.',
        'Check with the standard-form numbers: 6 × 10⁴ = 60,000, and 60,000 × 5,000 = 300,000,000 = 3 × 10⁸. The multiplier takes the small estimate to the large one, so 5 × 10³ times is right. With the original counts, 58,000 × 5,000 = 290,000,000, close to 312,000,000, so the estimate is sensible.',
      ],
      answer: '3 × 10⁸ views and 6 × 10⁴ views; about 5 × 10³ (5,000) times as many',
      estimatedMinutes: 3,
    },
    {
      id: 'try-write-small-number',
      kind: 'try_yourself',
      problem: 'Which of these is 0.00058 written in scientific notation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5.8 × 10⁻⁵' },
        { id: 'b', text: '5.8 × 10⁻⁴', correct: true },
        { id: 'c', text: '5.8 × 10⁴' },
        { id: 'd', text: '58 × 10⁻⁵' },
      ],
      expectedAnswer: '5.8 × 10⁻⁴',
      hints: [
        'Put the decimal point just after the first nonzero digit, which gives 5.8, and count how many places the point moved to get there. Do not count every digit after the point.',
        'The point moved 4 places to the right, and a number less than 1 always gets a negative exponent. The coefficient has to be at least 1 and less than 10, so a choice with 58 in front cannot be scientific notation even if its value is right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-city-and-town',
      kind: 'try_yourself',
      problem: 'A city has about 8 × 10⁶ people and a small town has about 2 × 10³ people. How many times as many people live in the city?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4 times as many' },
        { id: 'b', text: '1,000 times as many' },
        { id: 'c', text: '4 × 10⁹ times as many' },
        { id: 'd', text: '4 × 10³ times as many', correct: true },
      ],
      expectedAnswer: '4 × 10³ times as many',
      hints: [
        'Compare the powers of ten first: 10⁶ ÷ 10³ = 10³. Then adjust by the digits: 8 ÷ 2.',
        'The powers of ten give 1,000 times and the digits give 4 times, so put the two parts together. Check it: 2,000 × 4,000 should give 8,000,000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-tv-multiplier',
      kind: 'try_yourself',
      problem:
        'About 9 × 10⁷ people watched the championship game on TV, and about 3 × 10⁴ people were in the stadium. How many times as many people watched on TV as were in the stadium? Type your answer as a whole number, with no commas.',
      responseFormat: 'numeric',
      expectedAnswer: '3000',
      hints: [
        'Powers of ten first: 10⁷ ÷ 10⁴ = 10³ = 1,000. Then the digits: 9 ÷ 3 = 3.',
        'Put the two parts together: 3 × 10³. Write that out in standard form to type it, and check that 30,000 times your answer gives 90,000,000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-count-zeros-and-negative-exponent-size',
      kind: 'misconception_check',
      question:
        'Leo writes 4,500,000 = 4.5 × 10⁵ because he counts five zeros. Nia says 2 × 10⁻⁷ is larger than 7 × 10⁻⁵ because 7 is bigger than 5. What went wrong in each case?',
      commonErrors: [
        {
          answer: '4,500,000 = 4.5 × 10⁵',
          misconception: 'Counting the zeros in the number instead of counting how many places the decimal point moves.',
          correctsTo:
            'The exponent counts decimal-point moves, not zeros. In 4,500,000 the point starts at the end and moves 6 places to sit just after the 4, so the number is 4.5 × 10⁶. The check settles it: 4.5 × 10⁵ = 450,000, which is ten times too small, while 4.5 × 10⁶ = 4,500,000. Zeros and moves agree only when every digit after the first one is a zero, as in 4,000,000 = 4 × 10⁶.',
        },
        {
          answer: '2 × 10⁻⁷ is larger than 7 × 10⁻⁵',
          misconception: 'Ignoring the negative sign and treating a larger digit in the exponent as a larger power of ten, when a more negative exponent means a smaller number.',
          correctsTo:
            'Write both out. 10⁻⁵ = 0.00001 and 10⁻⁷ = 0.0000001, so 7 × 10⁻⁵ = 0.00007 and 2 × 10⁻⁷ = 0.0000002, and the first number is larger. Compare the powers of ten first: 10⁻⁵ ÷ 10⁻⁷ = 10² = 100, so 10⁻⁵ is 100 times 10⁻⁷, and 7 ÷ 2 = 3.5 makes 7 × 10⁻⁵ exactly 350 times as large as 2 × 10⁻⁷. Check: 0.0000002 × 350 = 0.00007.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scientific notation is a × 10ⁿ with 1 ≤ a < 10: exactly one nonzero digit in front of the decimal point.',
        'To write a number, put the point just after the first nonzero digit and count the places it moved; that count is the exponent. Count moves, not zeros.',
        'A number that is 10 or more gets a positive exponent; a number less than 1 gets a negative exponent.',
        'To go back to standard form, move the point the number of places the exponent says: right for positive, left for negative, filling with zeros.',
        'For a size comparison, round each number to a single digit times a power of ten.',
        'How many times as large: compare the powers of ten first by subtracting exponents, then adjust by dividing the digits, and check that the small number times your multiplier gives the large one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Writing & Comparing Numbers in Scientific Notation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
