/**
 * Grade 8 Math — Linear Functions as Models: Constructing Linear Models from
 * Descriptions.
 *
 * PROCEDURE-LED. The student already writes y = kx from a rate and already
 * turns a one-unknown story into a one- or two-step equation; what is new is
 * a story with TWO numbers doing two different jobs — a starting amount that
 * happens once and a constant rate that happens again for every unit — and
 * the skill of sorting those two numbers into the m and the b of y = mx + b
 * (CCSS 8.F.B.4). The concept segment is a short recipe: name x and y, find
 * the "per" (that is m), find the once-only amount (that is b), write the
 * equation, check it against the story at x = 0 and x = 1. Both worked
 * examples run the same recipe, the second with a rate that takes away so
 * the minus sign on m is earned rather than announced. Two traps this plan is
 * built to kill: swapping m and b because one number was stated first in the
 * sentence, and writing a decreasing situation with a positive rate.
 *
 * SCOPE GUARD: Grade 8 row 7.2 translates a verbal situation with a starting
 * amount and a constant rate (a $20 sign-up fee plus $5 per class; a 12 cm
 * candle burning 0.5 cm per hour) into y = mx + b, deciding which quantity
 * is m and which is b, including negative rates. Withholds: exponential
 * growth/decay models -> `alg1-u6-exponential-growth-decay.ts`; two
 * competing models -> row 5.4. Concretely: every rate in this plan is a fixed
 * amount added or taken away per unit of x, never a percent of what is
 * already there, so every model is linear; no item ever sets two models
 * against each other or asks when two amounts are equal — the two equations
 * in the misconception check are two attempts at ONE situation, not two
 * competing models. Sideways: the plan never extracts m and b from a table,
 * a graph, or two given points (row 7.1), never reads them off a graph that
 * shows the intercept (row 3.4), and never predicts an output for a chosen
 * input or solves for the input that gives a target output (row 7.3).
 * Substitution DOES appear here, and deliberately: once an equation is
 * written, it is checked against the story at x = 0 (which must return b)
 * and at x = 1 or another small x (which must return b plus or minus one
 * rate). That check is how the student verifies the construction, exactly
 * as a solved equation is checked by substitution; no item's keyed answer is
 * ever a value of y or of x, only an equation, an m, or a diagnosis of a
 * wrongly built equation. Every starting amount
 * in this plan is positive; rates are positive or negative. Below, assumed
 * and recalled in a sentence, never re-taught: writing one- and two-step
 * equations from words (`m7math-u6-writing-equations-from-word-problems.ts`)
 * and y = kx from a constant of proportionality
 * (`m7math-u3-constant-of-proportionality.ts`), which appears here only as
 * the case with no starting amount, so b = 0.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U7_CONSTRUCTING_LINEAR_MODELS_FROM_DESCRIPTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.constructing-linear-models-from-descriptions.v1',
  title: 'Constructing Linear Models from Descriptions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.constructing-linear-models-from-descriptions',
      standard: 'M8MATH-7.2',
      description:
        'Translate a verbal situation with a starting amount and a constant rate (a $20 sign-up fee plus $5 per class; a 12 cm candle burning 0.5 cm per hour) into y = mx + b, deciding which quantity is m and which is b, including negative rates (CCSS 8.F.B.4).',
    },
  ],
  prerequisites: ['m8math.rate-of-change-and-initial-value-from-tables-and-graphs'],
  followUps: ['m8math.interpreting-and-using-linear-models'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a starting amount and a repeating rate side by side in one story, so the student feels that the two numbers do two different jobs before either is named m or b.',
      script:
        'Your cousin is saving for a pair of sneakers. She already has $35 in a jar, and every Saturday her babysitting job adds another $10. How much is in the jar after 1 week? After 2? After any number of weeks? Look at what each number in that story is doing. The $35 was there before a single week passed, and it never shows up again. The $10 shows up again every single week, once per week. Call the number of weeks w, and the jar holds 10w + 35 dollars. You already write y = kx when a story has only a rate; today you write the version with a starting amount attached, y = mx + b, and the whole skill is deciding which number in the story is the m and which is the b. Some rates take away instead of adding, like a candle burning down or a phone battery draining, and those rates carry a minus sign, so you will meet those today too.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-find-the-per',
      kind: 'concept',
      goal: 'Install the name-x-and-y, find-the-per, find-the-once recipe for building y = mx + b from a description, with the sign of the rate decided by direction and a check at x = 0 and x = 1.',
      keyIdeas: [
        'TWO JOBS IN EVERY STORY — a starting-amount-plus-rate story always has one number that happens ONCE and one number that happens AGAIN for every unit. In "a $20 sign-up fee plus $5 per class", the $20 is paid one time and the $5 is paid once for each class. Sorting the two numbers by their job is the entire skill.',
        'NAME x AND y BEFORE YOU WRITE — x is the count that the rate is "per": classes, hours, weeks. y is the total that changes as x grows: cost, height, money in the jar. Say it in words before touching the equation: "x is the number of classes, y is the total cost in dollars." A model with unnamed variables is a guess.',
        'THE "PER" NUMBER IS m — the rate multiplies x because it is charged once for every unit of x. $5 per class, x classes, 5x dollars. Hunt for "per", "each", "every", "a week", "an hour": whatever number is attached to that word is the rate of change, and it goes in front of x.',
        'THE ONCE-ONLY NUMBER IS b — the starting amount stands alone because it does not depend on x. A sign-up fee, the height a candle starts at, the money already in the jar: each one is the value of y when x = 0, and each one is added on once. So the gym costs y = 5x + 20. Writing it as y = 20 + 5x is the same equation, just with the terms in the other order; y = mx + b puts the rate first.',
        'THE SENTENCE ORDER DOES NOT DECIDE — "a $20 fee plus $5 per class" and "classes are $5 each after a $20 fee" are the same story and the same equation, y = 5x + 20. The number stated first is not automatically m or automatically b. The job decides, never the position in the sentence. When the story has no once-only amount at all, b is 0 and the model is the y = kx you already own.',
        'A RATE THAT TAKES AWAY IS NEGATIVE — a 12 cm candle burning 0.5 cm per hour gets shorter, so the rate pulls height away: m = -0.5 and the model is y = -0.5x + 12. The starting amount stays positive, because the candle really does start at 12 cm. If y goes down as x goes up, m is negative; if y goes up, m is positive. Then check the finished equation against the story: at x = 0 it must give the starting amount, and at x = 1 it must give the starting amount plus or minus one rate. For the candle, -0.5(0) + 12 = 12 and -0.5(1) + 12 = 11.5, both exactly what the story says.',
      ],
      vocabulary: [
        { term: 'linear model', definition: 'an equation of the form y = mx + b that describes a real situation whose total changes by the same amount for every unit of x.' },
        { term: 'rate of change', definition: 'the amount y changes for each 1 unit of x, the "per" number in the story; it is the m in y = mx + b and it is negative when y decreases.' },
        { term: 'initial value', definition: 'the starting amount, the value of y when x = 0; it is the b in y = mx + b.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-climbing-gym',
      kind: 'worked_example',
      problem: 'A climbing gym charges a $20 sign-up fee, and after that each class costs $5. Write a linear model for the total cost y, in dollars, of taking x classes.',
      steps: [
        'Name the variables first. x is the number of classes, because that is what the $5 is "per". y is the total cost in dollars, because that is what changes as classes are added.',
        'Find the "per". $5 per class is charged once for every class, so it multiplies x. That makes m = 5, and the rate part of the model is 5x.',
        'Find the once-only amount. The $20 sign-up fee is paid one time, whether you take 1 class or 30, so it stands alone. That makes b = 20.',
        'Write y = mx + b with the numbers in place: y = 5x + 20.',
        'Check it against the story. At x = 0 classes, y = 5(0) + 20 = 20, which is just the fee. At x = 1 class, y = 5(1) + 20 = 25, the fee plus one class. At x = 4 classes, y = 5(4) + 20 = 20 + 20 = 40, and counting it out by hand, a $20 fee plus $5 four times is $20 + $20 = $40. The equation and the story agree.',
        'The same story in a different order, "classes are $5 each once you have paid the $20 sign-up fee", gives the same equation, y = 5x + 20. The order of the words does not decide which number is m; the job each number does decides.',
      ],
      answer: 'y = 5x + 20',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-burning-candle',
      kind: 'worked_example',
      problem: 'A candle is 12 cm tall when it is lit, and it burns down 0.5 cm every hour. Write a linear model for the height y, in centimeters, after x hours of burning.',
      steps: [
        'Name the variables. x is the number of hours, since the 0.5 cm is "every hour". y is the height in centimeters, the thing that changes.',
        'Find the "per". 0.5 cm every hour is the rate, so it goes with x. Now look at the direction: the candle gets SHORTER each hour, so the rate takes height away. That makes m = -0.5, not 0.5.',
        'Find the once-only amount. The candle starts at 12 cm before any burning happens, so b = 12. It stays positive, because the starting height is a real 12 cm; only the rate carries the minus sign.',
        'Write it: y = -0.5x + 12.',
        'WRONG: y = 0.5x + 12. CORRECT: y = -0.5x + 12. Test the wrong one at x = 2: 0.5(2) + 12 = 13, and a burning candle does not grow 1 cm taller in two hours. The minus sign on m is what makes the height fall.',
        'WRONG: y = 12x - 0.5. CORRECT: y = -0.5x + 12. Nothing in the story happens "12 per hour", so 12 cannot be the rate; it is the starting height. The number attached to "every hour" is the m, and the number described as the starting size is the b, no matter which one the sentence says first.',
        'Check the correct model against the story. At x = 0, y = -0.5(0) + 12 = 12, the starting height. At x = 2, y = -0.5(2) + 12 = -1 + 12 = 11, and two hours of burning at 0.5 cm each takes off 1 cm, leaving 11 cm. At x = 10, y = -0.5(10) + 12 = -5 + 12 = 7. Story and equation agree at every point checked.',
      ],
      answer: 'y = -0.5x + 12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-phone-plan',
      kind: 'try_yourself',
      problem: 'A phone plan costs $25 a month, plus $4 for every gigabyte of data used past the plan limit. Let x be the number of gigabytes past the limit and y the monthly bill in dollars. Which equation models the bill?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 25x + 4' },
        { id: 'b', text: 'y = 4x + 25', correct: true },
        { id: 'c', text: 'y = 29x' },
        { id: 'd', text: 'y = 4x - 25' },
      ],
      expectedAnswer: 'y = 4x + 25',
      hints: [
        'Find the "per" first. Which number is charged once for every gigabyte, and which number is charged once a month no matter how much data is used?',
        'The per-gigabyte number multiplies x, and the flat monthly charge stands alone with a plus sign, because it is money added to the bill, not taken off. Check at x = 0: with no extra data, the bill should be just the monthly charge.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-battery-drain',
      kind: 'try_yourself',
      problem: 'A phone battery reads 80% when you unplug it, and a game makes the reading drop by 6 every hour of play. Let x be the hours of play and y the battery reading. Which equation models the battery reading?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 6x + 80' },
        { id: 'b', text: 'y = 80x - 6' },
        { id: 'c', text: 'y = -6x - 80' },
        { id: 'd', text: 'y = -6x + 80', correct: true },
      ],
      expectedAnswer: 'y = -6x + 80',
      hints: [
        'The number with "every hour" is the rate, and the reading is going DOWN as the hours go up, so ask what sign that rate needs.',
        'The starting 80 is real and positive, so it keeps its plus sign; only the rate is negative. Check at x = 1: the reading should be 74, which is 80 with 6 taken away.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pool-drain',
      kind: 'try_yourself',
      problem: 'A backyard pool holds 500 gallons of water, and a pump drains it at 20 gallons per minute. Write a linear model y = mx + b for the gallons left in the pool, y, after x minutes of pumping. What is the value of m? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-20',
      hints: [
        'The number with "per minute" is the rate, which is m. The 500 gallons is the starting amount, which is b, and b is not what the question asks for.',
        'The pool is losing water, so the rate takes gallons away each minute, and a rate that takes away is negative. Check: after 1 minute the pool should hold 480 gallons, and 500 plus your m must give 480.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-swap-and-sign',
      kind: 'misconception_check',
      question: 'Priya and Marcus each write a model for this story: "A snow pile is 30 inches deep and melts 2 inches every day." Let x be the number of days and y the depth in inches. Priya writes y = 30x + 2. Marcus writes y = 2x + 30. Check each equation at x = 0 and at x = 1. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'y = 30x + 2',
          misconception: 'Taking the number stated first in the sentence as the rate, so 30 becomes m and 2 becomes b.',
          correctsTo:
            'The job decides, not the position in the sentence. The number attached to "every day" is the rate, so m is built from the 2, and the 30 inches is the depth before any melting, so b = 30. The check exposes the swap immediately: at x = 0, Priya gets 30(0) + 2 = 2, but the pile starts at 30 inches, not 2. The pile is melting, so the rate is negative and the correct model is y = -2x + 30, which gives -2(0) + 30 = 30 at x = 0 and -2(1) + 30 = 28 at x = 1, exactly a 30 inch pile with 2 inches gone after one day.',
        },
        {
          answer: 'y = 2x + 30',
          misconception: 'Sorting m and b correctly but keeping the rate positive, even though the pile gets smaller every day.',
          correctsTo:
            'Marcus put 2 with x and 30 alone, which is the right sorting, but a pile that melts is losing depth, so the rate takes away and must be negative. His check shows the problem: at x = 1, 2(1) + 30 = 32, and a melting pile does not grow 2 inches deeper in a day. The correct model is y = -2x + 30. At x = 0 it gives 30, the starting depth, and at x = 1 it gives -2 + 30 = 28, which is 30 with 2 melted away.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every starting-amount-plus-rate story becomes y = mx + b: the rate is m and the starting amount is b.',
        'Name x and y in words before writing: x is the count the rate is "per", y is the total that changes.',
        'Find the "per": the number charged or changed once for EVERY unit of x is the rate, so it multiplies x.',
        'The number that is there once, before any x happens (a fee, a starting height, money already saved), is b and stands alone. The order of the words in the sentence does not decide which number is which; the job does.',
        'If y goes down as x grows (burning, draining, melting), the rate is negative and the starting amount stays positive.',
        'Check the finished equation at x = 0 (it must give b) and at x = 1 (b plus or minus one rate) before you trust it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Constructing Linear Models from Descriptions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
