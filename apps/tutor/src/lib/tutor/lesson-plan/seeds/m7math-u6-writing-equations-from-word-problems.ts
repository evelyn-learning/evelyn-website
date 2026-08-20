/**
 * Grade 7 Math — Equations & Inequalities: Equations from Word Problems.
 *
 * The bridge between a story and a solve (CCSS 7.EE.B.4a, 7.EE.B.3). Three
 * habits carry the lesson: define the variable in writing before anything
 * else, find the word that means equals, and interpret the number at the end
 * back into the situation with its units. The reversal trap from 5.1 returns
 * with an equals sign attached — "7 less than twice a number is 15" is
 * 2n − 7 = 15, never 7 − 2n = 15.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U6_WRITING_EQUATIONS_FROM_WORD_PROBLEMS: LessonPlan = {
  id: 'evelyn.ms.m7math.writing-equations-from-word-problems.v1',
  title: 'Equations from Word Problems',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.writing-equations-from-word-problems',
      standard: 'M7MATH-6.3',
      description:
        'Define a variable, write a one-step or two-step equation that models a real situation, solve it, and interpret the solution in the context of the problem with correct units (CCSS 7.EE.B.4a, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.two-step-equations'],
  followUps: ['m7math.solving-and-graphing-inequalities'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the hard part of a word problem is the setup, not the solving.',
      script:
        'Nobody ever walks up to you and says solve 3x plus 5 equals 20. What they say is: the bowling alley charges 5 dollars for shoes and 3 dollars a game, I spent 20 dollars, how many games did I bowl? You already know how to finish that once it is written in symbols. Today is about the step before that, turning the sentence into the symbols. And there is a step after it too, because the answer is not 5, it is five games.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-story-to-equation',
      kind: 'concept',
      goal: 'Install the four-move routine: define the variable, find the equals, build the sides, interpret the answer.',
      keyIdeas: [
        'STEP ONE IS ALWAYS THE SAME — write down what the variable stands for, in words, with units. Not "let g = games" but "let g = the number of games bowled". A variable with no definition is where most word-problem mistakes are born, because halfway through you forget whether it meant games or dollars.',
        'FIND THE WORD THAT MEANS EQUALS — words like is, was, costs, totals, in all, and altogether are the equals sign in disguise. Whatever comes before it goes on the left, whatever comes after it goes on the right.',
        'MOST SITUATIONS HAVE THE SAME SHAPE — one fixed amount that happens once, plus a rate times a quantity. Shoes cost 5 once, games cost 3 each, so the total is 5 + 3g. The word each or per tells you which number is the coefficient, and the one-time number is the constant.',
        'THE REVERSAL TRAP — the phrases less than and subtracted from flip the order you read them in. "7 less than twice a number is 15" means you start at twice the number and take 7 away, so it is 2n − 7 = 15, NOT 7 − 2n = 15. Test any phrase with a friendly number: 7 less than 20 is 13, and 20 − 7 = 13, so the big quantity goes first. More than does not flip, because addition can be written either way.',
        'SOLVE, THEN ANSWER THE QUESTION THAT WAS ASKED — the number you get is not the answer by itself. Put the units back on it and read the question again. Five games, or six months, or 12 dollars. If the question asked something different from what the variable stands for, there is still one more step to do.',
        'MAKE THE ANSWER MAKE SENSE — you cannot hire 3.45 buses or buy 2.7 packs. When the thing being counted comes in whole pieces and everyone has to fit, round UP to the next whole number, even when the decimal is small. Then ask yourself whether the size of the answer is believable at all.',
      ],
      vocabulary: [
        { term: 'define the variable', definition: 'writing in words, with units, exactly what quantity the letter stands for.' },
        { term: 'constant', definition: 'the one-time amount in a situation, which does not change with the variable.' },
        { term: 'rate', definition: 'an amount per one unit of something, such as 3 dollars per game; it becomes the coefficient.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fixed-plus-rate',
      kind: 'worked_example',
      problem:
        'A skate park charges 5 dollars to get in, plus 3 dollars for every hour you rent skates. Maya spent 20 dollars in all. How many hours did she rent skates?',
      steps: [
        'Define the variable: let h = the number of hours Maya rented skates. Write that down before touching any numbers.',
        'Sort the numbers. The 5 dollars happens once no matter what, so it is the constant. The 3 dollars happens every hour, so it is the rate and it multiplies h, giving 3h.',
        'Find the equals. The words "in all" mean the two parts together came to 20, so the equation is 5 + 3h = 20.',
        'Solve it as a two-step equation. Subtract 5 from both sides: 3h = 15. Divide both sides by 3: h = 5.',
        'Check in the original equation: 5 + 3(5) = 5 + 15 = 20. Both sides are 20.',
        'Interpret the answer. The question asked for hours, and h stands for hours, so Maya rented skates for 5 hours. Sanity check: 5 hours of skates is 15 dollars, plus the 5 dollar entry, which is the 20 she spent.',
      ],
      answer: '5 + 3h = 20, so h = 5 hours',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reversal-trap',
      kind: 'worked_example',
      problem: 'Write an equation and solve: 7 less than twice a number is 15.',
      steps: [
        'Define the variable: let n = the unknown number.',
        'Build the inside piece first. "Twice a number" is 2n.',
        'Now apply "7 less than". This phrase REVERSES the reading order: you begin with 2n and take 7 off it, giving 2n − 7. The word "is" supplies the equals sign, so the equation is 2n − 7 = 15.',
        'WRONG equation to avoid: 7 − 2n = 15, which reads the words straight left to right. Test the reversal with a plain number: 7 less than 20 means 13, and 20 − 7 = 13, not 7 − 20. The bigger quantity comes first.',
        'Solve 2n − 7 = 15. Add 7 to both sides: 2n = 22. Divide both sides by 2: n = 11.',
        'Check in words, not just in symbols: twice 11 is 22, and 7 less than 22 is 15. That matches the sentence exactly. The wrong equation would have given n = −4, and twice −4 is −8, with 7 less being −15, which does not match.',
      ],
      answer: '2n − 7 = 15, so n = 11',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translate-reversal',
      kind: 'try_yourself',
      problem: 'Which equation matches "9 less than three times a number n is 24"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9 − 3n = 24' },
        { id: 'b', text: '3(n − 9) = 24' },
        { id: 'c', text: '3n − 9 = 24', correct: true },
        { id: 'd', text: '9n − 3 = 24' },
      ],
      expectedAnswer: '3n − 9 = 24',
      hints: [
        'Build the inner piece first. "Three times a number n" is 3n. Then decide what happens to it.',
        '"Less than" flips the order. Test it with a plain number: 9 less than 30 is 21, which is 30 − 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-model-a-situation',
      kind: 'try_yourself',
      problem:
        'A gym charges 20 dollars once to join, plus 15 dollars every month. Tia has paid 110 dollars in all. Which equation finds m, the number of months she has been a member?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '15 + 20m = 110' },
        { id: 'b', text: '20 + 15m = 110', correct: true },
        { id: 'c', text: '35m = 110' },
        { id: 'd', text: '15m − 20 = 110' },
      ],
      expectedAnswer: '20 + 15m = 110',
      hints: [
        'Which number happens only once, and which number happens again every single month?',
        'The repeating amount is the one that multiplies m. The one-time amount is added on by itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-interpret-context',
      kind: 'try_yourself',
      problem:
        'A grade of 138 students is going on a field trip. Each bus holds 40 students. How many buses does the school need? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Let b = the number of buses needed, and write the equation 40b = 138.',
        'Dividing gives 3.45, which is not a number of buses. Ask what happens to the students who do not fit on three buses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reversal-and-interpretation',
      kind: 'misconception_check',
      question: 'A student writes "4 less than twice a number is 10" as 4 − 2n = 10 and gets n = −3. Read the sentence back with that number. What went wrong?',
      commonErrors: [
        {
          answer: '4 − 2n = 10, so n = −3',
          misconception: 'Translating the words straight left to right, so the 4 lands in front. The phrase "less than" names the amount being taken away BEFORE it names what it is taken from, which is the opposite of the symbol order.',
          correctsTo: 'Start with twice the number, 2n, and take 4 off it: 2n − 4 = 10. Add 4 to both sides to get 2n = 14, then divide by 2 to get n = 7. Read it back: twice 7 is 14, and 4 less than 14 is 10, which matches the sentence. Read the wrong version back and it fails: twice −3 is −6, and 4 less than −6 is −10, not 10.',
        },
        {
          answer: '3.45 buses',
          misconception: 'Stopping at the number the arithmetic produced without asking whether that number can exist in the situation. A calculator will happily report a fraction of a bus.',
          correctsTo: 'Buses come in whole numbers, and the 18 students left over after three buses still need a ride. Round UP to 4 buses. The rule is not ordinary rounding: any leftover at all, even 0.1 of a bus, means one more whole bus.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Define the variable in writing, with units, before you write any equation.',
        'Words like is, costs, and in all are the equals sign; the one-time amount is the constant and the per-something amount is the coefficient.',
        '"Less than" reverses the order: 7 less than twice a number is 2n − 7, never 7 − 2n.',
        'Solve, then put the units back on and answer the question that was actually asked.',
        'Make the answer make sense in the story, and round up whenever the leftover still needs a whole one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Equations from Word Problems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
