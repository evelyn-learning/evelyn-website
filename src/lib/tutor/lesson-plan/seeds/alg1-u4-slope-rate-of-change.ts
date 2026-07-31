/**
 * Algebra 1 — Linear Functions: Slope & Rate of Change.
 *
 * The number that turns a line into a story (CCSS F-IF.B.6, bridging 8.F):
 * rise over run from two points, slope read as a real-world unit rate, and
 * the four slope types — positive, negative, zero, undefined. Every graphing
 * and modeling skill in the rest of Unit 4 starts here.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U4_SLOPE_RATE_OF_CHANGE: LessonPlan = {
  id: 'evelyn.hs.alg1.slope-rate-of-change.v1',
  title: 'Slope & Rate of Change',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.slope-rate-of-change',
      standard: 'ALG1-4.2',
      description:
        'Compute the slope of a line from two points as rise over run, interpret slope as a unit rate of change with units in context, and classify slopes as positive, negative, zero, or undefined (CCSS F-IF.B.6, 8.F.B.4).',
    },
  ],
  prerequisites: ['alg1.relations-functions'],
  followUps: ['alg1.slope-intercept-form'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame slope as the single number that tells you how fast something is changing — the idea behind speed, pay rates, and every straight-line model.',
      script:
        'Miles per hour. Dollars per hour. Centimeters per year. Every one of those is a slope. When a relationship changes at a steady pace, one number captures the whole story — how much the output moves for every one step of the input. Learn to pull that number out of two points, and you can read any straight line like a sentence.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope',
      kind: 'concept',
      goal: 'Rise over run, the two-point formula with matched subtraction order, slope as a unit rate with units, and the four slope types.',
      keyIdeas: [
        'SLOPE IS RISE OVER RUN — slope measures how much y changes for each 1 unit that x increases. Slope = rise/run = (change in y)/(change in x) = Δy/Δx.',
        'THE TWO-POINT FORMULA — for points (x₁, y₁) and (x₂, y₂), m = (y₂ − y₁)/(x₂ − x₁). Subtracting in the other order in BOTH the top and the bottom gives the same answer, because the two sign flips cancel.',
        'ORDER TRAP — the #1 error is mismatching the order: (y₂ − y₁)/(x₁ − x₂). That flips only one sign, so you get the right size with the WRONG sign. Lock the same point in as "point 2" on the top and the bottom.',
        'INVERSION TRAP — the #2 error is writing run/rise. The change in y always goes on TOP. A quick sanity check: if the line looks steep, slope should be bigger than 1, not smaller.',
        'SLOPE IS A UNIT RATE IN CONTEXT — say it as "y-units per one x-unit," e.g. a slope of −3 on a graph of candle height (cm) vs time (hours) means the candle burns down 3 cm per hour. Always attach units and always keep the sign.',
        'FOUR SLOPE TYPES — POSITIVE: line rises left to right (y grows as x grows). NEGATIVE: line falls left to right. ZERO: horizontal, rise = 0, so m = 0/run = 0 — y never changes. UNDEFINED: vertical, run = 0, so m = rise/0 — division by zero, so there is no slope number.',
        'ZERO vs UNDEFINED — "flat" is zero (two points share the same y, like (1, 5) and (9, 5)); "straight up" is undefined (two points share the same x, like (3, 1) and (3, 7)). Mixing these up is the classic vertical-line mistake.',
        'ANY TWO POINTS WORK — on a straight line the ratio Δy/Δx is the same no matter which two points you pick. That constant rate of change is exactly what makes the relationship linear.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'the constant rate of change of a line: Δy/Δx, the same between any two of its points.' },
        { term: 'rate of change', definition: 'the real-world meaning of slope — output units per one input unit, e.g. dollars per month.' },
        { term: 'undefined slope', definition: 'what a vertical line has: the run is 0, so the slope ratio would require dividing by zero.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-points',
      kind: 'worked_example',
      problem: 'Find the slope of the line through (−3, 4) and (2, 19).',
      steps: [
        'Label the points: (x₁, y₁) = (−3, 4) and (x₂, y₂) = (2, 19).',
        'Rise (top): y₂ − y₁ = 19 − 4 = 15.',
        'Run (bottom): x₂ − x₁ = 2 − (−3) = 2 + 3 = 5. Subtracting a negative adds.',
        'm = 15/5 = 3. Positive slope, so the line rises left to right.',
        'Check by swapping which point is "first": (4 − 19)/(−3 − 2) = (−15)/(−5) = 3. ✓ Same answer, as long as BOTH subtractions use the same order.',
      ],
      answer: 'm = 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-trap-context',
      kind: 'worked_example',
      problem:
        'A hiker walks down from a ridge at a steady pace. After 2 hours she is at 1400 meters of elevation; after 5 hours she is at 800 meters. Find the rate of change of her elevation and state what it means.',
      steps: [
        'The two points are (2, 1400) and (5, 800), with time on the x-axis and elevation on the y-axis.',
        'Take point 2 to be (5, 800) on BOTH the top and the bottom: m = (800 − 1400)/(5 − 2).',
        'm = (−600)/3 = −200.',
        'TRAP: a student who computes (1400 − 800)/(5 − 2) = 200 has used point (2, 1400) on top but point (5, 800) on the bottom. That mismatch flips the sign and says she is climbing, which contradicts the story.',
        'Interpret with units and sign: the slope is −200 meters per hour — her elevation drops 200 meters for every hour she walks.',
      ],
      answer: 'm = −200 meters per hour (elevation falls 200 m each hour).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-points',
      kind: 'try_yourself',
      problem: 'What is the slope of the line through (4, −1) and (7, 8)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/3' },
        { id: 'b', text: '3', correct: true },
        { id: 'c', text: '−3' },
        { id: 'd', text: '7/3' },
      ],
      expectedAnswer: '3',
      hints: [
        'Rise goes on top: (8 − (−1)) over (7 − 4).',
        'Subtracting a negative adds: the top is 8 + 1 = 9, and the bottom is 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-slope-type',
      kind: 'try_yourself',
      problem: 'A line passes through (−2, 5) and (6, 5). What is its slope?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Undefined' },
        { id: 'b', text: '5' },
        { id: 'c', text: '0', correct: true },
        { id: 'd', text: '8' },
      ],
      expectedAnswer: '0',
      hints: [
        'Compute the rise first: both points have the same y-value.',
        'A rise of 0 over a run of 8 is 0/8 — that is a horizontal line, not a vertical one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-rate',
      kind: 'try_yourself',
      problem:
        'A drone descends at a constant rate. At 4 seconds it is 96 meters above the ground; at 10 seconds it is 60 meters above the ground. What is its rate of change in meters per second? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-6',
      hints: [
        'Use the points (4, 96) and (10, 60): m = (60 − 96)/(10 − 4).',
        'The top is −36 and the bottom is 6 — keep the negative sign, since the drone is descending.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-inversion-and-vertical',
      kind: 'misconception_check',
      question:
        'Two students report slopes. Student A finds the slope through (1, 2) and (5, 14) by computing 4/12 = 1/3. Student B says the line through (3, 1) and (3, 7) has a slope of 0. What went wrong in each case?',
      commonErrors: [
        {
          answer: '1/3',
          misconception: 'Writing run over rise — the horizontal change ended up on top of the fraction.',
          correctsTo:
            'Slope is rise over run, so the change in y goes on TOP: (14 − 2)/(5 − 1) = 12/4 = 3. Sanity check: y climbed 12 while x moved only 4, so the line is steep and the slope must be greater than 1.',
        },
        {
          answer: '0',
          misconception: 'Treating a run of 0 as a slope of 0 — confusing a vertical line with a horizontal one.',
          correctsTo:
            'Here the run is 3 − 3 = 0 and the rise is 7 − 1 = 6, so the slope would be 6/0, which is UNDEFINED. Zero slope means the RISE is 0 (a flat, horizontal line); undefined slope means the RUN is 0 (a vertical line).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slope = rise/run = Δy/Δx = (y₂ − y₁)/(x₂ − x₁) — the change in y always goes on top.',
        'Use the SAME point order on the top and the bottom; mismatching the order flips the sign.',
        'In context, slope is a unit rate: state it as y-units per one x-unit, with the sign kept.',
        'Positive rises, negative falls, zero is horizontal (rise = 0), undefined is vertical (run = 0).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Slope & Rate of Change' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
