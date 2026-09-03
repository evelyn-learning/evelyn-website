/**
 * Grade 8 Math — Real Numbers: Rational & Irrational Numbers.
 *
 * CONCEPT-LED. The student arrives owning one fact from the previous row:
 * every rational number has a decimal that terminates or repeats. This
 * lesson builds the one new mental model of CCSS 8.NS.A.1: some decimals do
 * NEITHER, those numbers are called irrational, and they cannot be written
 * as a fraction of two integers at all. The whole plan is a classification
 * skill run on the five numbers the standard's row names (π, √2, √9, 22/7,
 * 0.101001000...) plus the one rule that decides every square root of a
 * whole number: √n is rational exactly when n is a perfect square. Four
 * misreadings are shown to be harmless or wrong: a long decimal is not
 * automatically irrational, a decimal with a pattern is not automatically
 * repeating, a fraction is rational no matter which famous number it is
 * close to, and a root sign does not by itself make a number irrational.
 *
 * SCOPE GUARD: Grade 8 row 1.2 defines an irrational number as one whose
 * decimal neither terminates nor repeats; classifies π, √2, √9, 22/7,
 * 0.101001000...; and knows √n is irrational whenever n is not a perfect
 * square and rational when it is. Withholds: proving √2 irrational;
 * simplifying radicals (√50 = 5√2) → Algebra 1 `alg1-u9-simplifying-radicals.ts`;
 * the real-number hierarchy and field properties → `alg1-u1-real-numbers-operations.ts`
 * (which re-classifies rational vs irrational as HS review). Concretely: √2
 * and π are asserted to be irrational with their decimals shown, and no
 * step argues WHY √2 cannot be a fraction; √50 and √10 are classified and
 * never rewritten or estimated; the words "real number", "integer",
 * "natural" and "whole" are never arranged into a hierarchy or a diagram,
 * and no property (closure, commutativity) is named. Sideways: square roots
 * of perfect squares such as √9, √16 and √36 are evaluated here ONLY as the
 * step that shows they are whole numbers and therefore rational; evaluating
 * roots as a skill, cube roots, and solving x² = p are row 1.3
 * (`square-roots-and-cube-roots`), and trapping a root between two
 * consecutive perfect squares, refining it to a decimal place, or placing
 * it on a number line is row 1.4 (`estimating-and-locating-irrational-numbers`),
 * so a non-perfect-square root is checked against the perfect-square list
 * and nothing more. Below, assumed and recalled in a sentence, never
 * re-taught: rational = fraction of integers with a terminating or
 * repeating decimal, and the repeating-decimal-to-fraction method (row 1.1,
 * `repeating-decimals-to-fractions`); fraction → decimal by division
 * (`m7math-u1-rational-numbers-on-the-number-line.ts`). Salvaged from
 * `g8-math-square-roots-irrationals.ts`: the perfect-square list and the
 * "most square roots do not come out clean" framing only; its two-standard
 * shape, its root-evaluation examples and its estimation example belong to
 * rows 1.3 and 1.4 and were left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U1_RATIONAL_AND_IRRATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m8math.rational-and-irrational-numbers.v1',
  title: 'Rational & Irrational Numbers',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.rational-and-irrational-numbers',
      standard: 'M8MATH-1.2',
      description:
        'Define an irrational number as one whose decimal neither terminates nor repeats; classify π, √2, √9, 22/7, 0.101001000…; know √n is irrational whenever n is not a perfect square and rational when it is (CCSS 8.NS.A.1).',
    },
  ],
  prerequisites: ['m8math.repeating-decimals-to-fractions'],
  followUps: ['m8math.square-roots-and-cube-roots'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show two calculator screens that look identical so the student feels that "long decimal" cannot be the whole story, before the word irrational is defined.',
      script:
        'Open the calculator on your phone and type 1 divided by 3. The screen fills up: 0.3333333333, and then it runs out of room. You know what it cut off, because it is threes forever, and last lesson you turned exactly that kind of decimal back into a fraction. Now clear it, type 2, and press the square root key. The screen fills up again: 1.414213562. Same-looking screen, ten digits and then nothing. But this time, if the screen were a mile wide, the digits would keep coming and never settle into a block that repeats. No fraction of two whole numbers makes that decimal, and nobody will ever find one. Today you learn the name for numbers like that, the one question that sorts every number into its side, and the shortcut that decides every square root in one glance.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-terminate-repeat-or-neither',
      kind: 'concept',
      goal: 'Define irrational as the decimal that neither terminates nor repeats, sort the five named numbers with that definition, and install the perfect-square rule for square roots.',
      keyIdeas: [
        'THE TWO KINDS OF DECIMAL YOU ALREADY OWN — a rational number is any number that can be written as a fraction of two integers, and last lesson you saw what its decimal must do: it either stops, like 3/8 = 0.375, or it repeats a block forever, like 1/3 = 0.333... and 5/11 = 0.454545... That is the whole rational family, and every fraction you have ever written belongs to it.',
        'IRRATIONAL MEANS NEITHER — an irrational number has a decimal that never stops AND never settles into a repeating block, so it cannot be written as a fraction of two integers. π = 3.14159265... and √2 = 1.41421356... are the two you will meet most often. Every number on the number line is one or the other: rational or irrational, with no third option.',
        'A ROOT SIGN DOES NOT MAKE A NUMBER IRRATIONAL — the perfect squares are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, and so on, each one a whole number times itself. For a whole number n, √n is rational exactly when n is a perfect square, because then the root is a whole number: √49 = 7. When n is NOT a perfect square, √n is irrational: √2, √3, √5, √10, √50. Most whole numbers are not perfect squares, so most square roots do not come out clean.',
        'A PATTERN IS NOT A REPEAT — 0.101001000100001... follows a clear rule, one more zero every time, but repeating means the SAME block coming back unchanged forever, and here the block keeps growing. No block ever repeats, so this number is irrational. Having a pattern and repeating are different things.',
        'A FRACTION IS RATIONAL NO MATTER WHAT IT IS CLOSE TO — 22/7 is a fraction of two integers, so it is rational, and its decimal is 3.142857142857..., repeating the block 142857. People use it as a stand-in for π because it is close, but π = 3.141592..., and the two part ways at the third decimal place. The same goes for 3.14: it stops, so it is rational, and it is not π either.',
        'THE CALCULATOR CANNOT DECIDE FOR YOU — a screen shows about ten digits and then stops, for every number, so 0.3333333333 and 1.414213562 look like the same kind of thing. Neither is "long" or "short" in reality; one repeats forever and one never does. What sorts a number is whether it is a fraction of integers, or a root of a perfect square, not how many digits you happen to see.',
      ],
      vocabulary: [
        { term: 'rational number', definition: 'a number that can be written as a fraction of two integers; its decimal terminates or repeats.' },
        { term: 'irrational number', definition: 'a number that cannot be written as a fraction of two integers; its decimal never terminates and never repeats.' },
        { term: 'terminating decimal', definition: 'a decimal that stops after a certain number of digits, such as 0.375.' },
        { term: 'repeating decimal', definition: 'a decimal in which one block of digits comes back unchanged forever, such as 0.454545...' },
        { term: 'perfect square', definition: 'a whole number that is some whole number times itself, such as 49 = 7 × 7.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-five-numbers',
      kind: 'worked_example',
      problem:
        'Classify each number as rational or irrational, and say why: 22/7, √9, π, √2, and 0.101001000100001... (the number of zeros between the 1s keeps growing by one).',
      steps: [
        'Run the same question on all five: can this number be written as a fraction of two integers? If it can, its decimal stops or repeats and it is rational. If its decimal never stops and never repeats, it is irrational.',
        '22/7 is already a fraction of two integers, so it is rational before you do anything. To see its decimal, divide: 22 ÷ 7 = 3.142857142857..., and the block 142857 comes back unchanged forever. A repeating decimal is exactly what a fraction produces.',
        '√9 asks for the number that times itself gives 9, and 3 × 3 = 9, so √9 = 3. The number 3 is the fraction 3/1, so √9 is rational. The root sign was hiding a plain whole number, because 9 is a perfect square.',
        'π = 3.14159265358979... The digits never stop and never settle into a repeating block, so π is irrational. It is not 22/7: line them up, 3.1415... against 3.1428..., and they split at the third decimal place. It is not 3.14 either, since 3.14 stops.',
        '√2 = 1.41421356... The number 2 is not on the perfect-square list, so no whole number times itself gives 2, and the decimal never stops and never repeats. √2 is irrational.',
        '0.101001000100001... has a rule, one more zero each time, so it is tempting to call it repeating. Repeating means one block comes back the same forever, and here every block is longer than the last, so nothing ever repeats. The decimal also never stops. It is irrational.',
        'Check the sort by counting the fraction side: 22/7 and √9 = 3 = 3/1 can both be written as fractions of integers, so those two are rational. The other three cannot, so π, √2 and 0.101001000... are irrational.',
      ],
      answer: 'Rational: 22/7 and √9 (which equals 3). Irrational: π, √2 and 0.101001000100001...',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sort-square-roots',
      kind: 'worked_example',
      problem: 'Sort these six square roots into rational and irrational: √25, √26, √36, √40, √49, √50.',
      steps: [
        'For a square root of a whole number, the only question is whether the number under the root sign is a perfect square. Write the list you need: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.',
        '25, 36 and 49 are on the list: 5 × 5 = 25, 6 × 6 = 36, 7 × 7 = 49. So √25 = 5, √36 = 6 and √49 = 7, all whole numbers, all rational.',
        '26, 40 and 50 are not on the list. No whole number times itself gives 26, 40 or 50, so √26, √40 and √50 all have decimals that never stop and never repeat. All three are irrational.',
        'WRONG: saying √50 is rational because 50 is so close to 49, or because 50 is an even number that "divides nicely". CORRECT: close does not count and even does not count. 50 is not a perfect square, full stop, so √50 is irrational. Being one away from a perfect square changes nothing about whether a decimal repeats.',
        'WRONG: saying √36 is irrational because it has a root sign, and root signs mean irrational. CORRECT: 6 × 6 = 36, so √36 is just the whole number 6 wearing a root sign. The sign never decides the answer; the number under it does.',
        'Check by squaring the rational ones back: 5 × 5 = 25, 6 × 6 = 36, 7 × 7 = 49, each landing exactly on the number under its root sign. Try the same with the irrational ones and there is nothing to square, because no whole number lands on 26, 40 or 50.',
      ],
      answer: 'Rational: √25 = 5, √36 = 6, √49 = 7. Irrational: √26, √40, √50',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-is-irrational',
      kind: 'try_yourself',
      problem: 'Which of these numbers is irrational?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '22/7' },
        { id: 'b', text: '0.272727...' },
        { id: 'c', text: '√16' },
        { id: 'd', text: '√10', correct: true },
      ],
      expectedAnswer: '√10',
      hints: [
        'Two of the choices can already be written as a fraction of two integers: one is a fraction as it stands, and one is a repeating decimal, which you turned into a fraction last lesson.',
        'For a square root, ask whether the number under the root sign is a perfect square. 16 is one, since 4 × 4 = 16. Is 10?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pattern-versus-repeat',
      kind: 'try_yourself',
      problem:
        'The decimal 0.202002000200002... continues forever, with one more zero between each pair of 2s than the pair before. Which statement about this number is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is rational, because its digits follow a pattern' },
        { id: 'b', text: 'It is irrational, because no block of digits repeats forever', correct: true },
        { id: 'c', text: 'It is rational, because it is written as a decimal' },
        { id: 'd', text: 'It is irrational, because its decimal never ends' },
      ],
      expectedAnswer: 'It is irrational, because no block of digits repeats forever',
      hints: [
        'Never ending is not the test. 0.333... never ends either, and it is 1/3. The test is whether one block of digits comes back unchanged forever.',
        'Look at the blocks: 20, then 200, then 2000. Each one is longer than the last, so no block ever comes back the same. Having a pattern is not the same as repeating.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-next-rational-root',
      kind: 'try_yourself',
      problem:
        'What is the smallest whole number greater than 50 whose square root is rational? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '64',
      hints: [
        'The square root of a whole number is rational only when that number is a perfect square. 7 × 7 = 49, and 49 is not greater than 50, so keep going.',
        'The next whole number after 7 is 8. Multiply 8 by itself; that product is the first perfect square past 50.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-close-to-pi-and-long-block',
      kind: 'misconception_check',
      question:
        'Two students are sorting numbers. Dev says 22/7 is irrational because it is π. Lena says 0.142857142857... is irrational because it has too many different digits to be a fraction. What went wrong in each case?',
      commonErrors: [
        {
          answer: '22/7 is irrational, because it is π.',
          misconception: 'Believing a fraction that is used as a stand-in for π actually equals π, and so inherits being irrational.',
          correctsTo:
            '22/7 is a fraction of two integers, so it is rational, and nothing can change that. Its decimal is 3.142857142857..., a repeating block, which is exactly what fractions produce. π is 3.141592..., and the two split at the third decimal place: 3.1415... against 3.1428... 22/7 is a convenient neighbor of π, not π itself, and π is the one that is irrational.',
        },
        {
          answer: '0.142857142857... is irrational, because it has too many different digits to be a fraction.',
          misconception: 'Treating a long repeating block, or a decimal with many different digits, as a sign of irrationality, when the only test is whether a block repeats.',
          correctsTo:
            'Look past the length and watch for the block: 142857, then 142857 again, then 142857 again, unchanged forever. A repeating decimal is always rational, no matter how long its block is. The method from last lesson turns it into 142857/999999, which reduces to 1/7, since 142857 × 7 = 999999. Many different digits inside the block is fine; what would make it irrational is a decimal that never settles into any block at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A rational number can be written as a fraction of two integers, and its decimal either terminates or repeats a block forever.',
        'An irrational number has a decimal that never terminates and never repeats, so it cannot be written as a fraction of two integers. π and √2 are irrational.',
        'For a whole number n, √n is rational exactly when n is a perfect square (1, 4, 9, 16, 25, 36, 49, ...), because then the root is a whole number. Otherwise √n is irrational.',
        'A pattern is not a repeat: 0.101001000... has a rule but no repeating block, so it is irrational.',
        'A fraction is rational no matter what it is close to: 22/7 and 3.14 are rational, and neither one is π.',
        'Never ending is not the test, and a calculator screen cannot decide for you. Ask whether it is a fraction of integers or a root of a perfect square.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Rational & Irrational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
