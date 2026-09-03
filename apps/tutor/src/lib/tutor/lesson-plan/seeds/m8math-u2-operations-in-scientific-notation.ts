/**
 * Grade 8 Math — Integer Exponents & Scientific Notation: Operations in
 * Scientific Notation.
 *
 * PROCEDURE-LED. The student already writes a number as a × 10ⁿ with
 * 1 ≤ a < 10 and already owns the product and quotient rules for powers of
 * ten; what is new is doing arithmetic on two such numbers without ever
 * writing out the zeros (CCSS 8.EE.A.4). The concept segment is an ordered
 * recipe: split every number into its two parts, do the coefficients' job and
 * the powers of ten's job separately, tidy the coefficient back into the
 * 1-to-10 range, and, for a sum or difference, match the exponents BEFORE
 * touching the coefficients. Both worked examples end by multiplying back or
 * converting back to check, and the second one turns an unreadable number of
 * seconds into a number of years, which is the unit-choice half of the
 * standard. Two traps this plan is built to kill: multiplying the exponents
 * when the numbers are multiplied, and adding coefficients whose powers of
 * ten do not match.
 *
 * SCOPE GUARD: Grade 8 row 2.4 multiplies and divides numbers in scientific
 * notation (coefficients together, exponents added or subtracted, the result
 * renormalized whenever the coefficient leaves [1, 10)), adds and subtracts
 * after matching exponents, chooses a sensible unit for a result, and reads a
 * calculator's E notation. Withholds: nothing further at G8;
 * `alg1-u6-negative-exponents-scientific-notation.ts` repeats
 * convert/multiply/divide as HS review. Sideways: writing an ordinary number
 * in scientific notation and the 1 ≤ a < 10 normalization rule are row 2.3's
 * skill and are only recalled here (an ordinary number that enters a
 * calculation is rewritten in one clause, never taught); row 2.3's "how many
 * times as large" comparison is not re-taught — no quotient in this plan is
 * framed as comparing the sizes of two numbers; the bare quotients in the
 * concept segment are practice on the rule, and every quotient inside a story
 * is a quantity (songs that fit, years of watch time). Below, assumed and not
 * re-taught: the product and quotient rules for powers of ten (row 2.1,
 * recalled in a clause) and negative exponents (row 2.2), which appear in this
 * plan only in reading a calculator display (2.5E-3); subtracting exponents
 * such as 10⁷⁻³ is the quotient rule, not a negative exponent. Above: every
 * base in this plan is 10, every coefficient is a specific number, and there
 * is no variable base, no monomial, and no exponential function anywhere in
 * the file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U2_OPERATIONS_IN_SCIENTIFIC_NOTATION: LessonPlan = {
  id: 'evelyn.ms.m8math.operations-in-scientific-notation.v1',
  title: 'Operations in Scientific Notation',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.operations-in-scientific-notation',
      standard: 'M8MATH-2.4',
      description:
        'Multiply and divide numbers in scientific notation (multiply/divide the coefficients, add/subtract the exponents, renormalize when the coefficient leaves [1, 10)), add and subtract after matching exponents, choose sensible units for the result (seconds vs years), and read calculator "E" notation (CCSS 8.EE.A.4).',
    },
  ],
  prerequisites: ['m8math.scientific-notation'],
  followUps: ['m8math.unit-rate-as-slope'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a division that is hopeless with zeros written out, so the student feels why the two parts of scientific notation get worked separately.',
      script:
        'The box your phone came in says 256 GB. Written out, that is 256,000,000,000 bytes, and in the scientific notation you already know how to write, it is 2.56 × 10¹¹ bytes. One song saved for offline listening takes about 4 × 10⁶ bytes. So how many songs fit on the phone? That is a division, 2.56 × 10¹¹ divided by 4 × 10⁶, and if you try it with all the zeros written out, you will lose one somewhere. Scientific notation was built for exactly this. There are two small numbers to divide and two small exponents to subtract, and then one tidy-up at the end. By the end of today you will also know why a calculator answers 6.4E4, and what to do when two numbers you need to add do not have the same power of ten.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-parts-two-jobs',
      kind: 'concept',
      goal: 'Install the coefficients-together, powers-of-ten-together recipe for multiplying and dividing, the renormalizing tidy-up, the match-exponents-first rule for adding and subtracting, and the habits of choosing a readable unit and reading a calculator display.',
      keyIdeas: [
        'TWO PARTS, TWO SEPARATE JOBS — a number in scientific notation has a coefficient (a number from 1 up to, but not including, 10) and a power of 10. When you multiply two of them, the coefficients get multiplied together and the powers of 10 get multiplied together: (3 × 10⁴) × (2 × 10⁵) = (3 × 2) × (10⁴ × 10⁵) = 6 × 10⁹. Regrouping like that is legal because every piece is being multiplied, and order does not matter in multiplication.',
        'MULTIPLY THE COEFFICIENTS, ADD THE EXPONENTS; DIVIDE THE COEFFICIENTS, SUBTRACT THE EXPONENTS — the powers of 10 follow the product and quotient rules you already own: 10⁴ × 10⁵ = 10⁹ because four tens times five tens is nine tens, and 10⁷ ÷ 10³ = 10⁴. So (8 × 10⁷) ÷ (2 × 10³) = (8 ÷ 2) × 10⁷⁻³ = 4 × 10⁴. The exponents are never multiplied and never divided; that is the single most common slip in this lesson.',
        'RENORMALIZE WHEN THE COEFFICIENT LEAVES THE 1-TO-10 RANGE — 6 × 4 = 24, so (6 × 10³) × (4 × 10⁴) comes out as 24 × 10⁷, and 24 is not allowed as a coefficient. Divide the coefficient by 10 and add 1 to the exponent: 2.4 × 10⁸. It works the other way too: 0.4 × 10³ has a coefficient below 1, so multiply the coefficient by 10 and take 1 off the exponent: 4 × 10². Each trade leaves the number itself unchanged, because 24 × 10,000,000 and 2.4 × 100,000,000 are both 240,000,000.',
        'TO ADD OR SUBTRACT, MATCH THE EXPONENTS FIRST — 3.2 × 10⁵ + 4 × 10⁴ cannot be added as it stands, because 3.2 counts hundred-thousands and 4 counts ten-thousands. Rewrite the smaller power to match the larger: 4 × 10⁴ = 0.4 × 10⁵. Now add the coefficients and keep the shared power of 10: 3.2 + 0.4 = 3.6, so the sum is 3.6 × 10⁵. Subtraction is the same move: 7.5 × 10⁶ - 2 × 10⁵ = 7.5 × 10⁶ - 0.2 × 10⁶ = 7.3 × 10⁶. If one of the numbers arrives written the ordinary way, such as 50,000, write it as 5 × 10⁴ first and then match.',
        'CHOOSE A UNIT THAT A PERSON CAN PICTURE — 1.89 × 10⁹ seconds is a true answer and a useless one, because nobody knows how long 1.89 billion seconds is. There are about 3.15 × 10⁷ seconds in a year (60 × 60 × 24 × 365 = 31,536,000), so divide: (1.89 × 10⁹) ÷ (3.15 × 10⁷) = 0.6 × 10² = 6 × 10¹ = 60 years. Same amount of time, and now it means something. When an answer in one unit has an exponent that is hard to picture, look for a bigger unit for a huge quantity or a smaller unit for a tiny one.',
        'A CALCULATOR WRITES E INSTEAD OF × 10 — when the answer is too long for the screen, a calculator shows something like 6.4E4, which means 6.4 × 10⁴, or 2.5E-3, which means 2.5 × 10⁻³. The E is short for "times ten to the", and the number after it is the exponent. It is not an error message and it is not a letter to copy into your answer; some calculators show a small e or a raised 10 instead, and they all mean the same thing.',
      ],
      vocabulary: [
        { term: 'coefficient', definition: 'the number in front of the power of 10 in scientific notation, which must be at least 1 and less than 10.' },
        { term: 'power of 10', definition: 'the 10ⁿ part of a number in scientific notation; its exponent n tells how many places the decimal point has moved.' },
        { term: 'renormalize', definition: 'to fix a result whose coefficient has left the 1-to-10 range by moving its decimal point one place and changing the exponent by 1 in the opposite direction.' },
        { term: 'E notation', definition: 'a calculator\'s shorthand for scientific notation, in which 6.4E4 means 6.4 × 10⁴.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-songs-on-a-phone',
      kind: 'worked_example',
      problem:
        'A phone has 256 GB of storage, which is 2.56 × 10¹¹ bytes. One downloaded song takes about 4 × 10⁶ bytes. How many songs fit? Give the answer in scientific notation, then as an ordinary number.',
      steps: [
        'Songs that fit = total bytes ÷ bytes per song, so the calculation is (2.56 × 10¹¹) ÷ (4 × 10⁶). Split it into the two jobs: the coefficients 2.56 ÷ 4, and the powers of ten 10¹¹ ÷ 10⁶.',
        'Coefficients: 2.56 ÷ 4 = 0.64. Powers of ten: subtract the exponents, 11 - 6 = 5, so 10¹¹ ÷ 10⁶ = 10⁵. The raw result is 0.64 × 10⁵.',
        'Renormalize. The coefficient 0.64 is below 1, so it is not allowed yet. Multiply the coefficient by 10 to get 6.4 and take 1 off the exponent to get 10⁴: the answer is 6.4 × 10⁴. Both forms say the same number, since 0.64 × 100,000 and 6.4 × 10,000 are both 64,000.',
        'Check by multiplying back. Songs times bytes per song should give the total: (6.4 × 10⁴) × (4 × 10⁶) = (6.4 × 4) × 10⁴⁺⁶ = 25.6 × 10¹⁰ = 2.56 × 10¹¹. That is the storage we started with, so the division is right.',
        'Read the answer: 6.4 × 10⁴ is 64,000 songs. If you had typed the division into a calculator, the screen would show 6.4E4, which is the calculator\'s way of writing 6.4 × 10⁴, the same number.',
      ],
      answer: '6.4 × 10⁴ songs, which is 64,000 songs',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-watch-time-in-years',
      kind: 'worked_example',
      problem:
        'A video has 4.5 × 10⁶ views, and the average viewer watches it for 4.2 × 10² seconds. (a) Find the total watch time in seconds, in scientific notation. (b) There are about 3.15 × 10⁷ seconds in a year. Express the total watch time in years.',
      steps: [
        '(a) Total seconds = views × seconds per view = (4.5 × 10⁶) × (4.2 × 10²). Two jobs again: the coefficients 4.5 × 4.2, and the powers of ten 10⁶ × 10².',
        'Coefficients: 4.5 × 4.2 = 18.9, because 4.5 × 4 = 18 and 4.5 × 0.2 = 0.9. Powers of ten: add the exponents, 6 + 2 = 8, so 10⁶ × 10² = 10⁸. The raw result is 18.9 × 10⁸.',
        'WRONG: multiplying the exponents, 6 × 2 = 12, and writing 18.9 × 10¹². CORRECT: 10⁶ × 10² is six tens times two more tens, eight tens in all, so the exponents ADD and the power is 10⁸. A product of 10¹² would be ten thousand times too big.',
        'Renormalize. The coefficient 18.9 is 10 or more, so divide it by 10 to get 1.89 and add 1 to the exponent to get 10⁹. The total watch time is 1.89 × 10⁹ seconds.',
        '(b) Nobody can picture 1.89 × 10⁹ seconds, so change the unit. Years = total seconds ÷ seconds per year = (1.89 × 10⁹) ÷ (3.15 × 10⁷). Coefficients: 1.89 ÷ 3.15 = 0.6, since 3.15 × 0.6 = 1.89. Powers of ten: 9 - 7 = 2. The raw result is 0.6 × 10², which renormalizes to 6 × 10¹, and 6 × 10¹ is 60. The total watch time is about 60 years.',
        'Check by converting back: 60 years × 3.15 × 10⁷ seconds per year = (6 × 10¹) × (3.15 × 10⁷) = (6 × 3.15) × 10⁸ = 18.9 × 10⁸ = 1.89 × 10⁹ seconds, which matches part (a). And 60 years is a number a person can actually picture, which is why the unit change was worth doing.',
      ],
      answer: '(a) 1.89 × 10⁹ seconds; (b) about 60 years',
      estimatedMinutes: 3,
    },
    {
      id: 'try-multiply-and-renormalize',
      kind: 'try_yourself',
      problem: 'Multiply (3 × 10⁴) × (5 × 10³) and write the product in scientific notation.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '15 × 10⁷' },
        { id: 'b', text: '1.5 × 10⁷' },
        { id: 'c', text: '1.5 × 10⁸', correct: true },
        { id: 'd', text: '15 × 10⁸' },
      ],
      expectedAnswer: '1.5 × 10⁸',
      hints: [
        'Multiply the coefficients and add the exponents. Then look at the coefficient you got: is it at least 1 and less than 10?',
        '3 × 5 = 15 and 10⁴ × 10³ = 10⁷, so the raw result is 15 × 10⁷. A coefficient of 15 is too big. Divide it by 10, and the exponent must go up by 1 to keep the number the same.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-add-after-matching',
      kind: 'try_yourself',
      problem: 'Add 6.2 × 10⁵ + 3 × 10⁴ and write the sum in scientific notation.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6.5 × 10⁵', correct: true },
        { id: 'b', text: '9.2 × 10⁵' },
        { id: 'c', text: '9.2 × 10⁹' },
        { id: 'd', text: '6.5 × 10⁹' },
      ],
      expectedAnswer: '6.5 × 10⁵',
      hints: [
        'You cannot add the coefficients until both numbers use the same power of 10. Rewrite 3 × 10⁴ so that it uses 10⁵.',
        '3 × 10⁴ = 0.3 × 10⁵. Now add the coefficients, 6.2 + 0.3, and keep the shared 10⁵. Adding never changes the exponent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-seconds-to-years',
      kind: 'try_yourself',
      problem:
        'A video has a total watch time of 6.3 × 10⁸ seconds. There are about 3.15 × 10⁷ seconds in a year. How many years of watch time is that? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: [
        'Years = total seconds ÷ seconds per year. Divide the coefficients, 6.3 ÷ 3.15, and subtract the exponents, 8 - 7.',
        'That gives 2 × 10¹. Write 2 × 10¹ as an ordinary number, and that is the number of years.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-multiply-exponents-and-add-unmatched',
      kind: 'misconception_check',
      question:
        'Devin multiplies (2 × 10³) × (4 × 10⁵) and gets 8 × 10¹⁵. Lena adds 4 × 10⁶ + 4 × 10⁵ and gets 8 × 10⁶. Write each number out the long way to test the answers. What went wrong in each case?',
      commonErrors: [
        {
          answer: '8 × 10¹⁵',
          misconception: 'Multiplying the exponents, 3 × 5 = 15, when two powers of 10 are multiplied, instead of adding them.',
          correctsTo:
            '10³ × 10⁵ is three tens times five tens, which is eight tens, so 10³ × 10⁵ = 10⁸, and the exponents ADD. The coefficients multiply as usual, 2 × 4 = 8, so the product is 8 × 10⁸. The long way agrees: 2,000 × 400,000 = 800,000,000, which is 8 followed by eight zeros. Devin\'s 8 × 10¹⁵ is 8 followed by fifteen zeros, ten million times too big.',
        },
        {
          answer: '8 × 10⁶',
          misconception: 'Adding the coefficients, 4 + 4 = 8, without first matching the powers of 10, as if 4 × 10⁶ and 4 × 10⁵ were the same size.',
          correctsTo:
            'The two numbers are not the same size, because 4 × 10⁶ is 4,000,000 and 4 × 10⁵ is only 400,000. Match the exponents first: 4 × 10⁵ = 0.4 × 10⁶. Then add the coefficients and keep the shared power: 4 + 0.4 = 4.4, so the sum is 4.4 × 10⁶. The long way agrees: 4,000,000 + 400,000 = 4,400,000. Lena\'s 8 × 10⁶ would mean the second number was as big as the first, and it is only a tenth as big.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multiply: multiply the coefficients and ADD the exponents. Divide: divide the coefficients and SUBTRACT the exponents. The exponents themselves are never multiplied or divided.',
        'Renormalize when the coefficient leaves the 1-to-10 range: divide it by 10 and add 1 to the exponent, or multiply it by 10 and take 1 off the exponent. The number does not change.',
        'To add or subtract, match the exponents first, then add or subtract the coefficients and keep the shared power of 10.',
        'A number written the ordinary way gets rewritten in scientific notation before it joins the calculation.',
        'Choose a unit a person can picture: 1.89 × 10⁹ seconds is about 60 years, using 3.15 × 10⁷ seconds per year.',
        'On a calculator, 6.4E4 means 6.4 × 10⁴. The E stands for "times ten to the" and is not part of the answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Operations in Scientific Notation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
