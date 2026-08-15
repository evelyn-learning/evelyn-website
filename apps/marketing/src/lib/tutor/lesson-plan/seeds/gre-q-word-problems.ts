/**
 * GRE Quant — Word Problems: Rate, Work, Mixture.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_WORD_PROBLEMS: LessonPlan = {
  id: 'evelyn.gre.q.word-problems.v1',
  title: 'GRE Quant — Word Problems (Rate, Work, Mixture)',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.word-problems',
      description: 'Translate verbal rate, work, and mixture problems into algebraic equations and solve under time pressure.',
      standard: 'GRE-Q-WORD',
    },
  ],
  prerequisites: ['gre.q.algebra-equations'],
  followUps: ['gre.q.coordinate-geometry'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Word problems aren\'t about reading speed — they\'re about pattern matching to one of three setups: rate, work, or mixture.',
      script: 'Distance-rate-time. Workers completing a job. Mixing solutions of different concentrations. Three patterns generate maybe 80% of GRE word problems. Once you can spot which pattern you\'re in, the equations write themselves.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-patterns',
      kind: 'concept',
      goal: 'Three setups + their formulas + a reusable variable-naming approach.',
      keyIdeas: [
        'RATE-DISTANCE-TIME: distance = rate × time. Rearrange as needed: time = d/r, rate = d/t.',
        'AVERAGE RATE for round trips: total distance / total time. NOT the average of the rates.',
        'WORK PROBLEMS: if a worker takes T hours alone, their rate is 1/T per hour. Two workers together: rates add. (1/T₁ + 1/T₂)·t = 1 (one job done).',
        'COMBINED-WORKER FORMULA: if A takes a hours and B takes b hours alone, together they take ab/(a + b).',
        'MIXTURE PROBLEMS: track ONE substance through the mixing. (concentration × volume) for each input = (concentration × volume) for the output. amount of solute conserved.',
        'NAMING TIP: assign x to the unknown the question asks for; other variables follow from constraints.',
        'PRESENT/PAST AGE PROBLEMS: assign current ages, then add/subtract years per the question. Algebraic relations unfold.',
        'GRE TIME RULE: if you spend more than 2 minutes parsing a word problem, plug in answer choices instead — work backwards from each option.',
      ],
      vocabulary: [
        { term: 'rate', definition: 'amount per unit time (e.g. mph, jobs per hour).' },
        { term: 'concentration', definition: 'amount of solute per unit volume of solution; e.g. 30% means 0.30 fraction.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mixture',
      kind: 'worked_example',
      problem: '40 litres of a 25% acid solution is mixed with x litres of a 60% acid solution to make a 50% solution. Find x.',
      steps: [
        'Track acid amount: 0.25·40 + 0.60·x = 0.50·(40 + x).',
        '10 + 0.60x = 20 + 0.50x.',
        '0.10x = 10 → x = 100 litres.',
        'CHECK: total volume = 140 L. Acid total = 10 + 60 = 70 L. 70/140 = 0.50 ✓.',
      ],
      answer: 'x = 100 L',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Worker A takes 6 hours to complete a job. Worker B takes 4 hours. Together, how long do they take?',
      expectedAnswer: '12/5 = 2.4 hours',
      responseFormat: 'free',
      hints: [
        'Combined rate = 1/6 + 1/4 = 2/12 + 3/12 = 5/12 jobs per hour.',
        'Time = 1 / rate = 1 / (5/12) = 12/5.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-average-rate',
      kind: 'misconception_check',
      question: 'A car travels 60 mph going there and 40 mph coming back over the same route. A student says the average speed is 50 mph. Correct?',
      commonErrors: [
        {
          answer: '50 mph',
          misconception: 'Averaging the rates instead of computing total distance over total time.',
          correctsTo: 'Average speed = total distance / total time, NEVER the arithmetic mean of rates. Let one-way distance = d. Time out = d/60. Time back = d/40. Total time = d/60 + d/40 = 2d/120 + 3d/120 = 5d/120 = d/24. Total distance = 2d. Average = 2d / (d/24) = 48 mph. Always less than the simple average when speeds differ — the slower leg takes more time, weighting it more.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'd = rt. For round trips, average rate = total d / total t (NOT mean of rates).',
        'Work: rate = 1/T per hour. Combined T = ab/(a+b) for two workers.',
        'Mixture: track ONE substance through. Concentration × volume conserved.',
        'When stuck, plug answer choices back into the problem.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A and B together take 4 hours to do a job. A alone takes 6 hours. How long does B alone take?',
      hint: 'Combined rate: 1/4 = 1/6 + 1/B → 1/B = 1/4 − 1/6 = 3/12 − 2/12 = 1/12 → B = 12 hours.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
