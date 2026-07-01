/**
 * AP Statistics — CED Unit 4.1+4.2+4.3: Probability foundations.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_PROBABILITY_BASICS: LessonPlan = {
  id: 'evelyn.ap.stats.probability-basics.v1', title: 'U4.1 Probability Foundations',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.probability-basics', description: 'Define probability via long-run relative frequency. Apply the basic rules: 0 ≤ P(A) ≤ 1, P(S) = 1, complement, addition for mutually exclusive events. Use simulation to estimate probabilities.', standard: 'AP-STATS-4.1-4.3' }],
  prerequisites: [], followUps: ['apstats.conditional-independence'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame probability as long-run frequency.', script: "Probability is the long-run RELATIVE FREQUENCY of an event. Flip a fair coin many times — the proportion of heads converges to 0.5. Today: rules for combining probabilities.", estimatedMinutes: 2 },
    { id: 'concept-rules', kind: 'concept', goal: 'Cover probability rules.',
      keyIdeas: [
        'PROBABILITY P(A): the long-run proportion of times event A occurs in repeated random trials. Always 0 ≤ P(A) ≤ 1.',
        'SAMPLE SPACE S: all possible outcomes. P(S) = 1 (something must happen).',
        'COMPLEMENT RULE: P(not A) = 1 − P(A).',
        'MUTUALLY EXCLUSIVE (DISJOINT): events A and B cannot occur together. P(A and B) = 0.',
        'ADDITION RULE for mutually exclusive: P(A or B) = P(A) + P(B).',
        'GENERAL ADDITION RULE: P(A or B) = P(A) + P(B) − P(A and B). Subtracts the overlap (= 0 if mutually exclusive).',
        'SIMULATION: estimate probabilities by repeating a random process many times. Steps:',
        '  1. Describe the random process (e.g., "spin a fair spinner 5 times").',
        '  2. Define the EVENT of interest.',
        '  3. Run many trials (n = 100, 1000, ...) using a random number generator or table.',
        '  4. Estimate P(event) = (number of trials event occurred) / n.',
        'LAW OF LARGE NUMBERS: as n grows, the simulated proportion converges to the true probability.',
        'AP STYLE: when describing a simulation, specify how RANDOM DIGITS (or RNG) are used. Example: "Use digits 0-4 = boy, 5-9 = girl. Read 4 digits at a time. Repeat 100 times."',
      ],
      vocabulary: [
        { term: 'mutually exclusive', definition: 'cannot both occur — overlap is empty.' },
        { term: 'sample space', definition: 'set of all possible outcomes; P(S) = 1.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-rules', kind: 'worked_example',
      problem: 'In a deck of 52 cards: P(face card) = 12/52 = 3/13. P(red) = 26/52 = 1/2. P(face card AND red) = 6/52 = 3/26. Find P(face card OR red).',
      steps: [
        'STEP 1 — General addition rule: P(A or B) = P(A) + P(B) − P(A and B).',
        'STEP 2 — = 12/52 + 26/52 − 6/52 = 32/52 = 8/13.',
        'STEP 3 — Verify: red face cards (6) + non-face red (20) + black face cards (6) = 32 cards. ✓',
      ],
      answer: 'P(face or red) = 8/13.', estimatedMinutes: 3 },
    { id: 'try-complement', kind: 'try_yourself',
      problem: 'A six-sided die is rolled. (a) P(rolling at least one 6 in two rolls)? Use complement.',
      expectedAnswer: 'P(no 6 on a single roll) = 5/6. P(no 6 on either of two rolls) = (5/6)² = 25/36. P(at least one 6) = 1 − 25/36 = 11/36.',
      responseFormat: 'free', hints: ['"At least one" → use complement of "none."'], estimatedMinutes: 3 },
    { id: 'try-mutually-exclusive', kind: 'try_yourself',
      problem: 'A class survey: 30% wear glasses, 20% have braces, 5% have both. Find P(glasses or braces).',
      expectedAnswer: 'P(G or B) = P(G) + P(B) − P(G and B) = 0.30 + 0.20 − 0.05 = 0.45. (NOT mutually exclusive — overlap of 5%.)',
      responseFormat: 'free', hints: ['Subtract overlap.'], estimatedMinutes: 2 },
    { id: 'try-simulation', kind: 'try_yourself',
      problem: 'AP-style synthesis. Suppose a factory finds 8% of widgets are defective. Use a simulation to estimate the probability that at least one of 5 randomly selected widgets is defective. Describe the simulation in detail.',
      expectedAnswer: 'Use a random number table or RNG. Assign digits 00-07 = "defective" (since 8% = 8 outcomes per 100), 08-99 = "not defective." For each trial, generate 5 two-digit random numbers. If any of the 5 is in 00-07, count this trial as a "yes." Repeat 1000 trials. Estimate = (number of yes trials) / 1000. \nExpected (analytic check): P(at least 1 defective) = 1 − (0.92)⁵ ≈ 1 − 0.659 = 0.341, so simulation should yield ~34%.',
      responseFormat: 'free', hints: ['Map digits to event; describe trial; count.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      '0 ≤ P(A) ≤ 1; P(S) = 1.',
      'Complement: P(not A) = 1 − P(A).',
      'Addition (general): P(A or B) = P(A) + P(B) − P(A and B).',
      'Simulation: assign digits → trial → count → estimate.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.1-4.3', cedTitle: 'Probability Basics', sources: [{ type: 'concept', book: 'tps5e', chapter: '5', note: 'Standard probability rules.' }] },
};
