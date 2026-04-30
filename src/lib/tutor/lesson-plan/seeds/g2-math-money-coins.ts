/**
 * G2 — Counting money: coins.
 *
 * Penny=1¢, nickel=5¢, dime=10¢, quarter=25¢. Counting mixed coins.
 * Building toward dollars and decimal money in G3.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_MATH_MONEY_COINS: LessonPlan = {
  id: 'evelyn.g2.math.measurement.money-coins.v1',
  title: 'Counting coins: pennies, nickels, dimes, quarters',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.2.md.c.8',
      description: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols.',
      standard: 'CCSS.MATH.CONTENT.2.MD.C.8',
    },
  ],
  prerequisites: ['ccss.math.1.oa.a.1'],
  followUps: ['ccss.math.3.md.a.1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make money concrete by tying it to something the student wants to buy.',
      script: 'If a sticker costs 25 cents, what coins could you use to pay? Quarters? Nickels? Today we\'ll figure out exactly which coins add up to what.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-coin-values',
      kind: 'concept',
      goal: 'Each coin has a fixed value, and we count by combining them.',
      keyIdeas: [
        'PENNY = 1 cent (¢). The smallest coin value.',
        'NICKEL = 5 cents.',
        'DIME = 10 cents. (Smaller than a nickel but worth MORE!)',
        'QUARTER = 25 cents.',
        'To count coins: start with the BIGGEST and work down. Quarters first, then dimes, nickels, pennies.',
      ],
      vocabulary: [
        { term: 'cent', definition: 'a unit of money. 100 cents = 1 dollar.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-30-cents',
      kind: 'worked_example',
      problem: 'You have 1 quarter and 1 nickel. How much money is that?',
      steps: [
        'Start with the biggest: 1 QUARTER = 25¢.',
        'Add the nickel: 25 + 5 = 30.',
        'Total: 30 cents (or 30¢).',
      ],
      answer: '30¢',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You have 2 dimes and 3 pennies. How much money is that?',
      expectedAnswer: '23',
      responseFormat: 'numeric',
      hints: [
        'Each dime is 10¢, so 2 dimes = ?',
        'Each penny is 1¢, so 3 pennies = ?',
        'Add them together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dime-smaller',
      kind: 'misconception_check',
      question: 'Is a nickel worth more than a dime because it\'s bigger in size?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Assuming bigger coins are worth more.',
          correctsTo: 'No — a DIME is worth more (10¢) even though it\'s smaller than a NICKEL (5¢). Coin size doesn\'t match value.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Penny=1¢, Nickel=5¢, Dime=10¢, Quarter=25¢.',
        'Count from biggest coin to smallest.',
        'Coin SIZE doesn\'t match VALUE — a dime is small but worth 10¢.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find THREE different ways to make 30 cents using these coins.',
      hint: 'Try: 1 quarter + 1 nickel. Or 3 dimes. Or 6 nickels. What else?',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
