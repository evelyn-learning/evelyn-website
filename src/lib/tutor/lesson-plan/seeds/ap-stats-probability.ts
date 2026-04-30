/**
 * AP Stats — Probability Foundations.
 *
 * Sample spaces, addition / multiplication rules, conditional probability, independence.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_STATS_PROBABILITY: LessonPlan = {
  id: 'evelyn.ap.stats.probability.v1',
  title: 'Probability Foundations',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'apstats.probability',
      description: 'Apply addition, multiplication, and conditional probability rules; identify independent events; compute probabilities from two-way tables.',
      standard: 'AP-STATS-VAR-4',
    },
  ],
  prerequisites: ['apstats.descriptive'],
  followUps: ['apstats.sampling-distributions'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Probability rules apply to real life, not just dice.',
      script: 'A doctor reads a positive test result. A meteorologist forecasts a 70% chance of rain. A baseball coach decides whether to bunt. All three are doing probability with the same handful of rules. Get the rules right, and the rest is arithmetic.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Five core probability rules.',
      keyIdeas: [
        'SAMPLE SPACE: list of all possible outcomes. Probabilities sum to 1. Each outcome has P between 0 and 1.',
        'COMPLEMENT RULE: P(not A) = 1 − P(A).',
        'ADDITION RULE: P(A or B) = P(A) + P(B) − P(A and B). The subtraction prevents double-counting outcomes that satisfy both. If A and B are MUTUALLY EXCLUSIVE (can\'t happen together), P(A and B) = 0.',
        'MULTIPLICATION RULE: P(A and B) = P(A) · P(B|A). The "given A" part is conditional probability.',
        'INDEPENDENCE: A and B are independent if P(B|A) = P(B). Then P(A and B) = P(A) · P(B). Knowing A gives no info about B.',
        'CONDITIONAL PROBABILITY: P(B|A) = P(A and B) / P(A). "Among the cases where A happened, what fraction also had B?"',
        'TWO-WAY TABLES: rows for one variable, columns for another, cells for joint counts. To find P(B|A): row total of A is the denominator; cell at (A,B) is the numerator.',
        'COMMON TRAP: confusing P(A|B) with P(B|A). They\'re different. P(positive test | disease) ≠ P(disease | positive test). The latter depends on how rare the disease is — Bayes\' rule.',
      ],
      vocabulary: [
        { term: 'mutually exclusive', definition: 'two events that cannot both happen on the same trial.' },
        { term: 'independent events', definition: 'two events where one\'s occurrence doesn\'t change the other\'s probability.' },
        { term: 'conditional probability', definition: 'P(B|A) = probability of B given A has occurred.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-table',
      kind: 'worked_example',
      problem: 'A school surveys 200 students. 90 like math, 110 like English. 50 like both. Find P(likes math OR English) and P(likes English | likes math).',
      steps: [
        'P(M) = 90/200 = 0.45. P(E) = 110/200 = 0.55. P(M and E) = 50/200 = 0.25.',
        'P(M or E) = P(M) + P(E) − P(M and E) = 0.45 + 0.55 − 0.25 = 0.75.',
        'P(E | M) = P(M and E) / P(M) = 0.25 / 0.45 ≈ 0.556.',
        'INTERPRETATION: 75% of students like at least one. Among math-likers, 56% also like English.',
        'INDEPENDENCE CHECK: P(E) = 0.55 vs P(E|M) = 0.556. Very close — almost independent.',
      ],
      answer: 'P(M or E) = 0.75, P(E | M) ≈ 0.556',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A fair die is rolled twice. Find P(first roll is 6 AND second roll is even).',
      expectedAnswer: '1/12',
      responseFormat: 'free',
      hints: [
        'Independent events: P(A and B) = P(A) · P(B).',
        'P(first = 6) = 1/6. P(second is even) = 3/6 = 1/2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rare-disease',
      kind: 'misconception_check',
      question: 'A test for a rare disease is 95% accurate. You test positive. Is your chance of having the disease 95%?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing P(positive | disease) with P(disease | positive).',
          correctsTo: 'No — usually much lower. The 95% is P(positive | disease). What you want is P(disease | positive), which depends on how RARE the disease is. Concrete example: disease in 1% of population. Of 10,000 people: 100 have it (95 test positive). 9,900 don\'t (495 false positives at 5% false-positive rate). Total positives = 590. P(disease | positive) = 95/590 ≈ 16%. Not 95%. This is the heart of Bayesian reasoning — base rates matter.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Addition: P(A or B) = P(A)+P(B)−P(A and B).',
        'Multiplication: P(A and B) = P(A)·P(B|A). If independent: P(A)·P(B).',
        'Conditional: P(B|A) = P(A and B) / P(A).',
        'Two-way tables: row totals → conditioning. Don\'t confuse P(A|B) with P(B|A).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A bag has 3 red and 2 blue marbles. Draw two without replacement. Find P(both red).',
      hint: 'NOT independent — first draw changes the bag. P(red 1st) = 3/5. After drawing red, 2 red and 2 blue remain. P(red 2nd | red 1st) = 2/4 = 1/2. P(both red) = 3/5 · 1/2 = 3/10.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
