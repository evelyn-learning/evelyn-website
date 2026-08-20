/**
 * Grade 7 Math — Probability: Compound Events & Counting Outcomes.
 *
 * The last lesson of Grade 7 Math (CCSS 7.SP.C.8a, 7.SP.C.8b). Sample spaces
 * for two-stage events built with organized lists, tables and tree diagrams,
 * the counting principle, and multiplying probabilities for independent
 * events. The hard idea, and the one the misconception check is aimed at, is
 * WITH replacement against WITHOUT replacement: on a second draw with no
 * replacement, the numerator AND the denominator both drop.
 *
 * Every table and tree is written so it can be read ALOUD — the tutor may be
 * speaking it, so no layout carries meaning on its own.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U10_COMPOUND_EVENTS: LessonPlan = {
  id: 'evelyn.ms.m7math.compound-events.v1',
  title: 'Compound Events & Counting Outcomes',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.compound-events',
      standard: 'M7MATH-10.4',
      description:
        'List the sample space of a compound event using an organized list, a table or a tree diagram, count total and favorable outcomes, multiply probabilities for independent events, and distinguish drawing with replacement from drawing without replacement (CCSS 7.SP.C.8a, 7.SP.C.8b).',
    },
  ],
  prerequisites: ['m7math.probability-models-and-simulations'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a two-dice board-game moment the student has already argued about.',
      script:
        'You are playing a board game and you need a total of 7 on two number cubes to land on the winning square. Your friend says 7 is just a lucky number and every total is the same. You are not so sure, because 7 seems to come up all the time while 12 almost never does. One of you is right, and counting settles it. Today we handle two things happening at once: two cubes, a coin and a spinner, two marbles out of a bag. We count every way it can go, and then we can answer the question.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-compound-events',
      kind: 'concept',
      goal: 'Build sample spaces for two-stage events with lists, tables and trees, then multiply for independent events and separate with-replacement from without-replacement.',
      keyIdeas: [
        'A COMPOUND EVENT IS TWO THINGS AT ONCE — flipping a coin AND spinning a spinner, or drawing two marbles. The probability rule has not changed at all: it is still favorable outcomes over total outcomes. What is harder is counting them, because now every first outcome pairs with every second one.',
        'THREE WAYS TO LIST THE SAMPLE SPACE — an ORGANIZED LIST goes in strict order so nothing is missed: heads-red, heads-blue, heads-green, tails-red, tails-blue, tails-green. A TABLE puts the first event down the side and the second across the top, so two number cubes make a table with 6 rows and 6 columns, and each of the 36 cells holds one pair such as row 4 column 3. A TREE DIAGRAM starts with one branch per first outcome, then splits EACH of those into one branch per second outcome; reading a path from start to tip gives one outcome, and there is one path per outcome.',
        'THE COUNTING PRINCIPLE MULTIPLIES THE OPTIONS — you do not have to write out every path to know how many there are. Two coin sides times three spinner sections is 6 outcomes. Six cube faces times six cube faces is 36 outcomes. Three shirts times four pairs of shorts is 12 outfits. Multiply the number of choices at each stage.',
        'FOR INDEPENDENT EVENTS, MULTIPLY THE PROBABILITIES — two events are independent when the first does not change the second. A coin flip cannot affect a spinner, so P(heads and green) = P(heads) times P(green) = 1/2 times 1/3 = 1/6. That agrees with the list, which had 6 outcomes and one of them was heads-green. Two different routes, one answer.',
        'WITH REPLACEMENT KEEPS EVERYTHING THE SAME — if you draw a marble, look at it, and put it BACK before drawing again, the bag is identical for the second draw. The two draws are independent and the fractions are identical: from 5 red in 8 marbles, P(red then red) = 5/8 times 5/8 = 25/64.',
        'WITHOUT REPLACEMENT CHANGES BOTH NUMBERS — if you keep the first marble out, the second draw happens in a smaller bag. Take a red one out of 5 red in 8 and only 4 red remain out of 7 marbles, so P(red then red) = 5/8 times 4/7 = 20/56 = 5/14. Notice that the top AND the bottom went down by one. Dropping only the numerator, or only the denominator, is the classic slip. These events are DEPENDENT, because the first draw genuinely changed the second.',
      ],
      vocabulary: [
        { term: 'compound event', definition: 'an event made of two or more simpler events happening together or one after the other.' },
        { term: 'tree diagram', definition: 'a branching list of a sample space: one branch per first outcome, each splitting into the possible second outcomes.' },
        { term: 'independent events', definition: 'events where the first one does not change the probability of the second, so the probabilities multiply.' },
        { term: 'without replacement', definition: 'drawing again without putting the first item back, so one fewer item is available on the second draw.' },
      ],
      suggestedTools: ['show_table', 'show_tree'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-coin-and-spinner-tree',
      kind: 'worked_example',
      problem: 'A coin is flipped and a spinner with 3 equal sections (red, blue, green) is spun. Find P(heads and green).',
      steps: [
        'Build the tree in words. Start with two branches for the coin: heads and tails. Split the heads branch into three branches, red, blue and green. Split the tails branch into the same three. Six paths in total.',
        'Read the paths off in order, which is also the organized list: heads-red, heads-blue, heads-green, tails-red, tails-blue, tails-green. Six outcomes, and they are all equally likely because the coin is fair and the sections are equal.',
        'Check that count with the counting principle: 2 coin outcomes times 3 spinner outcomes is 6. It matches the list, so nothing was missed.',
        'Count the favorable outcomes. Exactly one path is heads-green, so P(heads and green) = 1/6.',
        'Check by multiplying instead. The coin cannot affect the spinner, so these are independent: P(heads) times P(green) = 1/2 times 1/3 = 1/6. Same answer, so both methods hold.',
        'One more from the same list: P(tails and not red) counts tails-blue and tails-green, which is 2 out of 6, so 1/3.',
      ],
      answer: 'P(heads and green) = 1/6, from 1 favorable path out of 6, and also from 1/2 times 1/3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-with-and-without-replacement',
      kind: 'worked_example',
      problem: 'A bag holds 5 red marbles and 3 blue marbles. Two marbles are drawn. Find P(both red) when the first marble IS put back, and when it is NOT put back.',
      steps: [
        'Set up the bag: 5 + 3 = 8 marbles, so P(red) on the first draw is 5/8 either way. The first draw is the same in both stories.',
        'WITH replacement: the marble goes back, so the second draw faces the same 5 red out of 8. Multiply: 5/8 times 5/8 = 25/64. As a decimal that is about 0.391, or about 39.1 percent.',
        'WITHOUT replacement: the red marble stays out. Now 4 red marbles remain and only 7 marbles are left in the bag, so the second probability is 4/7.',
        'Multiply: 5/8 times 4/7 = 20/56. Divide top and bottom by 4 to get 5/14, which is about 0.357, or about 35.7 percent.',
        'Compare the two answers. Without replacement is smaller, and that makes sense: you used up one of the red marbles, so red is a little harder to hit the second time.',
        'Name the slip to avoid. WRONG answer to avoid: 5/8 times 4/8 = 20/64 = 5/16, which drops a red marble from the top but forgets that the bag also got smaller. RIGHT answer: 5/8 times 4/7 = 5/14. If the marble is gone, it is gone from BOTH numbers.',
      ],
      answer: 'With replacement, 25/64 which is about 0.391; without replacement, 5/14 which is about 0.357',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sum-of-seven',
      kind: 'try_yourself',
      problem: 'Two fair number cubes are rolled and the two faces are added. What is P(sum of 7)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/6', correct: true },
        { id: 'b', text: '1/12' },
        { id: 'c', text: '1/36' },
        { id: 'd', text: '7/36' },
      ],
      expectedAnswer: '1/6',
      hints: [
        'The table has 6 rows and 6 columns, so start by writing down how many cells it has in total.',
        'List the pairs that add to 7, and remember that a 2 on the first cube with a 5 on the second is a different cell from a 5 then a 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-second-draw',
      kind: 'try_yourself',
      problem: 'A bag holds 4 green counters and 6 purple counters. You draw one counter, it is green, and you keep it out of the bag. What is the probability that the next counter you draw is also green?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/3', correct: true },
        { id: 'b', text: '2/5' },
        { id: 'c', text: '3/10' },
        { id: 'd', text: '4/9' },
      ],
      expectedAnswer: '1/3',
      hints: [
        'Rebuild the bag before the second draw. How many green counters are left, and how many counters are left in total?',
        'One green counter left the bag, so BOTH numbers change: 3 green out of 9 counters. Now reduce that fraction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-counting-principle',
      kind: 'try_yourself',
      problem: 'A sandwich shop offers 3 kinds of bread, 4 fillings and 2 sauces. A sandwich is one bread, one filling and one sauce. How many different sandwiches are possible? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '24',
      hints: [
        'Use the counting principle instead of writing out the whole list: multiply the number of choices at each stage.',
        'Bread choices times filling choices times sauce choices: 3 times 4 times 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-replacement-denominator',
      kind: 'misconception_check',
      question: 'A bag holds 5 red and 3 blue marbles. A student wants P(both red) when the first marble is NOT put back, and writes 5/8 times 5/8 = 25/64. What went wrong?',
      commonErrors: [
        {
          answer: '25/64',
          misconception: 'Treating the two draws as independent, as if the bag reset itself between them. That is the WITH-replacement calculation being used on a without-replacement question.',
          correctsTo: 'The first marble never came back, so the second draw happens in a changed bag: 4 red marbles left out of 7 marbles left. The correct work is 5/8 times 4/7 = 20/56 = 5/14, which is about 0.357. Compare it with the with-replacement answer 25/64, about 0.391, and notice the without-replacement answer is smaller, exactly as it should be.',
        },
        {
          answer: '5/16, from 5/8 times 4/8',
          misconception: 'Remembering that one red marble is gone, so lowering the numerator to 4, but leaving the denominator at 8 as though the bag still held all its marbles.',
          correctsTo: 'A marble that is out of the bag is missing from the total as well as from its own color. If 4 red remain, then 4 red plus 3 blue is 7 marbles, so the second fraction is 4/7 and never 4/8. WRONG answer to avoid: 5/16. RIGHT answer: 5/14.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A compound event still uses favorable over total; the work is in counting the sample space with an organized list, a table or a tree diagram.',
        'The counting principle multiplies the choices at each stage: 6 faces times 6 faces is 36 outcomes, and 3 breads times 4 fillings times 2 sauces is 24 sandwiches.',
        'Independent events multiply their probabilities: P(heads and green) = 1/2 times 1/3 = 1/6, which matches the list.',
        'With replacement, the bag resets and both fractions stay the same: 5/8 times 5/8 = 25/64.',
        'Without replacement, the numerator AND the denominator both drop: 5/8 times 4/7 = 5/14, never 4/8.',
        'That is the end of Grade 7 Math. You began the year putting integers on a number line, and you are finishing it able to count every way something can happen and put a number on the chance of it. Well done.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Compound Events & Counting Outcomes' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
