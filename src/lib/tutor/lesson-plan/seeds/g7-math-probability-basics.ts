/**
 * G7 — Probability basics.
 *
 * Probability of single events. Theoretical vs experimental.
 * Independent vs dependent events.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_PROBABILITY_BASICS: LessonPlan = {
  id: 'evelyn.g7.math.probability.intro.v1',
  title: 'Probability basics',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'probability',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.sp.c.5',
      description: 'Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring.',
      standard: 'CCSS.MATH.CONTENT.7.SP.C.5',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.7.sp.c.7'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make probability feel intuitive with a coin.',
      script: 'Flip a fair coin. Heads or tails? You don\'t KNOW, but you do know it\'s 50/50. That number — 1/2 — is the probability. Math gives us tools to predict the unpredictable.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Probability scale + theoretical vs experimental + independence.',
      keyIdeas: [
        'PROBABILITY is a number from 0 to 1 (or 0% to 100%).',
        '0 = impossible. 1 = certain. 0.5 = equally likely either way.',
        'P(event) = (favorable outcomes) / (total outcomes), assuming all outcomes are EQUALLY LIKELY.',
        'EXAMPLE: rolling a 6 on a fair die: P = 1/6 (one favorable out of six total).',
        'COMPLEMENT: P(NOT event) = 1 − P(event).',
        'THEORETICAL: based on math (1/6 for a die).',
        'EXPERIMENTAL: based on actually doing it many times. Roll a die 60 times, count how often 6 came up. Should approach 1/6 as trials grow.',
        'INDEPENDENT EVENTS: one doesn\'t affect the other. Coin flip + die roll. Multiply: P(A and B) = P(A) × P(B).',
        'DEPENDENT EVENTS: one affects the other. Drawing two cards without replacement.',
      ],
      vocabulary: [
        { term: 'probability', definition: 'a number from 0 to 1 measuring how likely an event is.' },
        { term: 'outcome', definition: 'a possible result of an experiment.' },
        { term: 'independent events', definition: 'events where one\'s outcome doesn\'t affect the other.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-die',
      kind: 'worked_example',
      problem: 'Find P(rolling an even number on a fair die).',
      steps: [
        'Total outcomes: 1, 2, 3, 4, 5, 6 = 6 equally likely.',
        'Favorable (even): 2, 4, 6 = 3 outcomes.',
        'P(even) = 3/6 = 1/2.',
        'Same as a coin flip — makes sense, half the die is even.',
      ],
      answer: '1/2',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-two-events',
      kind: 'worked_example',
      problem: 'Find P(flipping heads AND rolling a 6).',
      steps: [
        'Coin and die are INDEPENDENT — they don\'t affect each other.',
        'P(heads) = 1/2.',
        'P(6) = 1/6.',
        'Multiply: P(heads and 6) = 1/2 × 1/6 = 1/12.',
      ],
      answer: '1/12',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bag has 4 red marbles and 6 blue marbles. What is P(picking blue)?',
      expectedAnswer: '6/10 or 3/5 or 0.6',
      responseFormat: 'free',
      hints: [
        'Total marbles = 4 + 6 = 10.',
        'Favorable (blue) = 6.',
        'P = favorable / total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-due-for-tails',
      kind: 'misconception_check',
      question: 'A fair coin lands heads 5 times in a row. Is the next flip MORE likely to be tails because it\'s "due"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'The "gambler\'s fallacy".',
          correctsTo: 'No — coin flips are INDEPENDENT. Each flip is still 50/50, regardless of past results. The coin has no memory. (Yes, 5 heads in a row is unusual, but that doesn\'t change the next flip.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'P(event) = favorable / total.',
        'P ranges 0 (impossible) to 1 (certain).',
        'Independent events: multiply probabilities.',
        'Past results don\'t affect future independent events.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does experimental probability USUALLY get closer to theoretical with more trials?',
      hint: 'Law of Large Numbers. With 10 flips you might get 7 heads (random fluctuation). With 10,000 flips, the proportion converges to 0.5 because random ups and downs average out.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
