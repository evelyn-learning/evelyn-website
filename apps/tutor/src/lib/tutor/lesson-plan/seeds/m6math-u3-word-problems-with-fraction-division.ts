/**
 * Grade 6 Math — Dividing Fractions: Word Problems with Fraction Division.
 *
 * Last row of the unit. Rows 3.1-3.3 already built the meaning, the algorithm,
 * and mixed-number division (CCSS 6.NS.A.1). This lesson does not add a new
 * computation — it teaches the move that comes BEFORE any computation: reading
 * a word problem, recognizing that it calls for division rather than
 * multiplication, and setting up total divided by group size in the correct
 * order. Two traps this plan is built to kill: setting the division up
 * backward (group size divided by total), and rounding a leftover quotient up
 * to the nearest whole number instead of down to a whole, usable group.
 *
 * SCOPE GUARD: this lesson teaches the INTERPRETIVE move — reading a word
 * problem, deciding it calls for fraction division, and setting up total
 * divided by group size in the correct order — not the division algorithm
 * itself. Keep-change-flip (row 3.2) and converting a mixed number to an
 * improper fraction (row 3.3) are APPLIED here as already-known tools and are
 * never re-taught or re-derived: no step in this file explains why keep-
 * change-flip works, it is only run. Mixed-number totals and group sizes
 * appear in several of this lesson's items, since row 3.3 already covers
 * dividing them; naming or converting a mixed number is prior work being
 * used, not new content. No negative numbers, no percent, no proportional-
 * relationship setup, and no equation-solving appear anywhere in this file —
 * those belong to Grade 7 or to later Grade 6 units. Interpreting what a
 * quotient MEANS in context — rounding down to a whole number of usable
 * groups, then finding what amount is left over — is squarely this row's
 * territory, because deciding what an answer means is exactly the skill a
 * word problem adds on top of arithmetic the student already has.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U3_WORD_PROBLEMS_WITH_FRACTION_DIVISION: LessonPlan = {
  id: 'evelyn.ms.m6math.word-problems-with-fraction-division.v1',
  title: 'Word Problems with Fraction Division',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.word-problems-with-fraction-division',
      standard: 'M6MATH-3.4',
      description:
        'Solve real-world word problems that require dividing a fraction (or mixed number) by a fraction (CCSS 6.NS.A.1).',
    },
  ],
  prerequisites: ['m6math.dividing-mixed-numbers'],
  followUps: ['m6math.dividing-multi-digit-whole-numbers'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student stop and choose the operation and the order before calculating, instead of diving straight into a procedure.',
      script:
        'You are wrapping gifts for a class party. You have 5 and 1/4 feet of ribbon left on the spool. Each gift bag takes 3/4 foot to tie a bow. Before you touch a single number, stop and ask two questions. Is this a multiply question or a divide question? And if it is divide, which number is the total, and which number is the size of one bag? Today is not about how to divide fractions. You already know how to do that from the last two lessons. Today is about deciding when a word problem calls for division, and setting it up in the right order before you compute anything.',
      suggestedTools: ['show_fraction_bar'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-deciding-and-setting-up',
      kind: 'concept',
      goal: 'Install the two questions that flag a fraction-division word problem and the total-first, group-size-second setup rule, using the already-known algorithm only to finish the job.',
      keyIdeas: [
        'HOW MANY GROUPS FIT INSIDE — most fraction word problems in this lesson ask one question in different clothes: how many groups of a certain size fit inside a total amount? "How many bags," "how many bows," "how many bottles," and "how many batches" are all that same question, and that question is division.',
        'THE TOTAL COMES FIRST, THE GROUP SIZE COMES SECOND — call the amount you start with the total, and the size of one bag, bow, or batch the group size. The division always reads total divided by group size, never the other way around. Setting it up backward answers a completely different question.',
        'THE WORD "OF" IS A MULTIPLY SIGNAL, NOT A DIVIDE SIGNAL — a problem that asks for a fraction OF an amount, like "what is 2/3 of 9 dollars," is multiplication. A problem that asks how many equal-sized pieces fit inside an amount is division. Read for which question is actually being asked before you pick an operation.',
        'A MIXED NUMBER IS JUST ANOTHER NUMBER IN THE SETUP — if the total or the group size is a mixed number, convert it to an improper fraction first, the same way you learned in the last lesson. The rule for which number is the total and which is the group size does not change just because one of the numbers is mixed.',
        'CHECK THE SETUP, THEN CHECK THE ANSWER — before you compute, say the division out loud as a full sentence and make sure it matches the question. After you compute, check the answer two ways: does its size make sense, and if the question asks for whole groups, does any leftover amount need to be reported separately instead of rounded into the count?',
      ],
      vocabulary: [
        { term: 'dividend', definition: 'the total amount you start with in a division word problem; it is written first, before the division sign.' },
        { term: 'divisor', definition: 'the size of one group or one share in a division word problem; it is written second, after the division sign.' },
        { term: 'quotient', definition: 'the answer to a division problem; in a word problem it tells you how many groups you can make, or how much is in one share.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ribbon-gift-bags',
      kind: 'worked_example',
      problem: 'You have 5 and 1/4 feet of ribbon. Each gift bag takes 3/4 foot to tie a bow. How many gift bags can you tie?',
      steps: [
        'Name what you know and what you want. Known: total ribbon is 5 and 1/4 feet, one bow takes 3/4 foot. Unknown: how many bags.',
        'Restate the question as "how many groups of 3/4 foot fit inside 5 and 1/4 feet?" That phrasing signals division, not multiplication.',
        'Decide the setup. The total amount you start with, 5 and 1/4 feet, is the dividend. The size of one group, 3/4 foot, is the divisor. So the division is 5 and 1/4 divided by 3/4, not the other way around.',
        'WRONG: setting it up backward as 3/4 divided by 5 and 1/4. That asks how many 5-and-1/4-foot pieces fit inside 3/4 foot of ribbon, which is not the question at all, and gives 3/4 divided by 21/4 = 3/4 x 4/21 = 12/84 = 1/7, an answer smaller than 1 — that cannot be the number of bags a big spool of ribbon fills. CORRECT: the total goes first, so the setup is 5 and 1/4 divided by 3/4.',
        'Convert the mixed number: 5 and 1/4 = 21/4.',
        'Run the algorithm you already know. Keep 21/4, change the sign to multiplication, and flip 3/4 to 4/3: 21/4 x 4/3 = 84/12 = 7.',
        'Check by multiplying back: 7 x 3/4 = 21/4 = 5 and 1/4, which matches the total exactly, so all of the ribbon is used with nothing left over.',
      ],
      answer: '7 gift bags',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ribbon-spool-bows-with-leftover',
      kind: 'worked_example',
      problem: 'A different spool holds 8 and 1/2 feet of ribbon. Each bow still takes 3/4 foot. How many whole bows can be made, and how much ribbon is left over?',
      steps: [
        'Restate the question the same way as before: how many groups of 3/4 foot fit inside 8 and 1/2 feet? The total, 8 and 1/2 feet, is the dividend again.',
        'Convert the mixed number: 8 and 1/2 = 17/2.',
        'Run keep-change-flip: 17/2 x 4/3 = 68/6.',
        'Simplify: 68/6 = 34/3, which is 11 and 1/3.',
        'Interpret the fraction part. 11 and 1/3 means 11 full groups of 3/4 foot fit inside the ribbon, plus 1/3 of one more group. A bow needs a FULL 3/4 foot, so that leftover third of a group is not enough to tie another bow.',
        'WRONG: rounding 11 and 1/3 up to 12 bows because 1/3 seems close enough. A bow cannot be tied from part of the ribbon it needs, so any leftover amount smaller than a full group rounds DOWN, never up. CORRECT: keep only the whole number of groups, 11 bows.',
        'Find the leftover ribbon. The leftover is 1/3 of one group, and one group is 3/4 foot, so the leftover ribbon is 1/3 x 3/4 = 3/12 = 1/4 foot.',
        'Check by adding back: 11 bows use 11 x 3/4 = 33/4 = 8 and 1/4 feet. Adding the leftover, 8 and 1/4 plus 1/4 = 8 and 1/2 feet, which matches the total. And 1/4 foot is less than the 3/4 foot a twelfth bow would need, so 11 is truly the most bows possible.',
      ],
      answer: '11 bows, with 1/4 foot of ribbon left over',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-the-setup',
      kind: 'try_yourself',
      problem: 'A recipe uses 2/3 cup of oats for one batch of granola bars. You have 5 cups of oats. Which expression tells you how many batches you can make?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2/3 ÷ 5' },
        { id: 'b', text: '2/3 × 5' },
        { id: 'c', text: '5 + 2/3' },
        { id: 'd', text: '5 ÷ 2/3', correct: true },
      ],
      expectedAnswer: '5 ÷ 2/3',
      hints: [
        'Restate the question: how many groups of 2/3 cup fit inside 5 cups? The total amount always comes first in the division.',
        'The total, 5 cups, is the dividend. The amount used in one batch, 2/3 cup, is the divisor. Total divided by group size.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bookmarks-from-ribbon',
      kind: 'try_yourself',
      problem: 'A ribbon is 6 feet long. Each bookmark uses 3/4 foot of ribbon. How many bookmarks can be made from the ribbon?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/8' },
        { id: 'b', text: '8', correct: true },
        { id: 'c', text: '4 and 1/2' },
        { id: 'd', text: '24' },
      ],
      expectedAnswer: '8',
      hints: [
        'Restate the question: how many groups of 3/4 foot fit inside 6 feet? The total, 6 feet, is the dividend, so write 6 as 6/1 first.',
        'Keep-change-flip: 6/1 × 4/3. Multiply straight across, top times top and bottom times bottom, before you simplify.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-hike-water-bottles',
      kind: 'try_yourself',
      problem:
        'A team is filling water bottles before a hike. They have 9 and 3/4 liters of water. Each bottle holds 3/4 liter. How many full bottles can they fill? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Restate the question: how many groups of 3/4 liter fit inside 9 and 3/4 liters? Convert the mixed number first: 9 and 3/4 = 39/4.',
        'Set up total divided by group size: 39/4 ÷ 3/4. Keep, change, flip, then simplify before you check by multiplying back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-backward-setup-and-multiplying-instead',
      kind: 'misconception_check',
      question:
        'A tailor has 7 and 1/2 yards of fabric. Each scarf uses 5/6 yard. One student solves this and writes 5/6 ÷ 7 and 1/2 = 1/9 scarves. A second student writes 7 and 1/2 × 5/6 = 6 and 1/4 scarves. What went wrong in each case, and how many scarves can actually be made?',
      commonErrors: [
        {
          answer: '1/9',
          misconception: 'Setting up the division backward, dividing the group size by the total instead of the total by the group size.',
          correctsTo:
            'The total amount of fabric, 7 and 1/2 yards, is always the dividend in a "how many groups fit inside" problem. The correct setup is 7 and 1/2 ÷ 5/6 = 15/2 ÷ 5/6 = 15/2 × 6/5 = 90/10 = 9. Check by multiplying back: 9 × 5/6 = 45/6 = 7 and 1/2, which matches the fabric on hand.',
        },
        {
          answer: '6 and 1/4',
          misconception: 'Multiplying the two amounts instead of dividing, as if the problem asked for a fraction OF the total instead of counting equal-sized pieces inside it.',
          correctsTo:
            'The phrase "how many scarves" signals counting equal-sized pieces inside a total, which is division, not multiplication. The correct setup is 7 and 1/2 ÷ 5/6 = 9 scarves, and multiplying back confirms it: 9 × 5/6 = 7 and 1/2 yards, all of the fabric used with none left over.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Division word problems usually ask "how many groups of a certain size fit inside a total" — that phrasing is the signal to divide.',
        'The total amount you start with is the dividend; the size of one group or share is the divisor: total divided by group size, always in that order.',
        'Setting up the division backward answers a completely different question, so name the total before you write anything.',
        'The word "of" between two amounts usually signals multiplication, not division.',
        'Convert any mixed number to an improper fraction first; the rule for which number is the total and which is the group size does not change.',
        'When a problem asks for whole groups, round the quotient DOWN to a whole number, and find the leftover amount separately if the problem asks for it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Word Problems with Fraction Division' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
