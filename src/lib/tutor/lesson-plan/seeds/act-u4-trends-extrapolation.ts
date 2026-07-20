/**
 * ACT — Science / Trends, Interpolation & Extrapolation.
 *
 * Builds past 4.1's basic figure lookup: once a student can find a value
 * that's already printed in a table or graph, the next most common Data
 * Representation pattern asks them to characterize the RELATIONSHIP
 * (direct vs inverse) and estimate a value that ISN'T printed — either
 * between two measured points (interpolation, usually safe) or beyond
 * the measured range (extrapolation, riskier — the passage often signals
 * a mechanism change that breaks a straight-line guess). No outside
 * science knowledge needed; all stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_TRENDS_EXTRAPOLATION: LessonPlan = {
  id: 'evelyn.testprep.act.trends-extrapolation.v1',
  title: 'Trends, Interpolation & Extrapolation',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.trends-extrapolation',
      standard: 'ACT-4.2',
      description:
        'Identify direct and inverse trends in tables and graphs, interpolate values between measured data points, and cautiously extrapolate beyond the data by checking whether the passage signals a change in mechanism.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe trend questions as the natural next step after lookup: same ~52-second pace, but now you estimate instead of just read.',
      script:
        'Once you can find a printed value on a table or graph, the ACT Science section asks you to go one step further: describe the TREND, then estimate a value that isn\'t printed at all. These questions still run at about 52 seconds each, and most of them are won or lost on one distinction — is the value you\'re estimating BETWEEN two data points you already have, or BEYOND all of them? Today we build the habit of telling those two apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trends-interp-extrap',
      kind: 'concept',
      goal: 'Direct vs inverse trends, interpolation vs extrapolation, and the named traps around each.',
      keyIdeas: [
        'DIRECT RELATIONSHIP: as one variable increases, the other increases too (both go up together, or both go down together).',
        'INVERSE RELATIONSHIP: as one variable increases, the other decreases.',
        'INTERPOLATION: estimating a value for an x between two x-values you already have data for. Usually SAFE — the trend is confirmed on both sides of your target.',
        'EXTRAPOLATION: estimating a value for an x outside the entire range of data given. Riskier — you\'re assuming the same relationship (and the same underlying mechanism) keeps holding past where anyone actually measured it.',
        'METHOD: find the two nearest known points, compute the rate of change between them (change in y ÷ change in x), then apply that rate to your target x.',
        'TRAP 1 — STRAIGHT-LINE OVERREACH: extending a linear trend far past the data without checking for a note about the process leveling off, reversing, or saturating (common ACT Science passage language: "activity plateaus," "approaches a maximum," "levels off").',
        'TRAP 2 — DIRECTION FLIP: misreading an inverse trend as direct (or vice versa) and adding when you should subtract, or subtracting when you should add.',
        'TRAP 3 — WRONG NEIGHBORS: interpolating using the two nearest ROWS as printed, instead of the two nearest x-VALUES to your target — same condition-matching discipline as basic lookup, now applied to estimation.',
      ],
      vocabulary: [
        { term: 'interpolation', definition: 'estimating a value between two data points that were actually measured.' },
        { term: 'extrapolation', definition: 'estimating a value beyond the full range of measured data.' },
        { term: 'direct relationship', definition: 'both variables increase together (or decrease together).' },
        { term: 'inverse relationship', definition: 'one variable increases as the other decreases.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-interpolation',
      kind: 'worked_example',
      problem:
        'Table 1 tracks a crystal\'s mass as it grows. Time (hr): 0, 3, 6, 9; Mass (g): 4, 10, 16, 22. Based on Table 1, the crystal\'s mass at hour 4.5 is closest to what value?',
      steps: [
        'Hour 4.5 falls BETWEEN two measured points (hour 3 and hour 6) — this is interpolation, so the trend is confirmed on both sides.',
        'Identify the relationship: as time increases, mass increases — direct relationship.',
        'Compute the rate between the nearest known points: from hour 3 (10 g) to hour 6 (16 g), mass rose 6 g over 3 hr = 2 g/hr.',
        'Apply the rate: hour 4.5 is 1.5 hr past hour 3, so add 2 g/hr × 1.5 hr = 3 g to 10 g.',
        'Sanity-check: 13 g sits neatly between 10 g (hour 3) and 16 g (hour 6). ✓',
      ],
      answer: '13 g',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extrapolation-trap',
      kind: 'worked_example',
      problem:
        'Table 2 tracks a cooling liquid. Time (min): 0, 5, 10, 15; Temperature (°C): 80, 60, 40, 20. A note in the passage states the liquid cools toward, and never below, room temperature (22°C). A student extrapolates the straight-line trend to minute 30 and predicts −40°C. What is wrong with that prediction, and what is a more reasonable estimate?',
      steps: [
        'The measured trend (minutes 0–15) is inverse and linear: temperature falls 4°C/min (80 → 60 → 40 → 20).',
        'A pure straight-line extrapolation to minute 30 (15 min past the last data point) gives 20 − 4×15 = −40°C.',
        'But minute 30 is well OUTSIDE the measured range, and the passage explicitly flags a mechanism limit: the liquid cannot cool below room temperature (22°C).',
        'The straight-line answer (−40°C) ignores that note — this is the classic extrapolation trap.',
        'A reasonable estimate instead: the cooling rate slows as the liquid nears 22°C, so temperature at minute 30 is somewhat above 22°C, not below it — nowhere near −40°C.',
      ],
      answer: 'Somewhat above 22°C (room temperature) — not −40°C; the straight-line extrapolation ignores the passage\'s stated cooling limit.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-interpolate-direct',
      kind: 'try_yourself',
      problem:
        'Table 3 shows a car\'s odometer reading during a road trip at constant speed. Time (hr): 1, 2, 3, 4; Distance (km): 60, 120, 180, 240. Based on Table 3, the distance traveled at hour 2.5 is closest to:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '135 km' },
        { id: 'b', text: '150 km', correct: true },
        { id: 'c', text: '165 km' },
        { id: 'd', text: '180 km' },
      ],
      expectedAnswer: '150 km',
      hints: [
        'Hour 2.5 is between two measured points (hour 2 and hour 3) — this is interpolation.',
        'Rate is constant at 60 km/hr; hour 2 gives 120 km, so add 60 km/hr × 0.5 hr = 30 km.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-extrapolate-direct',
      kind: 'try_yourself',
      problem:
        'Using the same Table 3 (Time (hr): 1, 2, 3, 4; Distance (km): 60, 120, 180, 240) and assuming the car keeps the same constant speed, the distance traveled at hour 6 is closest to:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '300 km' },
        { id: 'b', text: '330 km' },
        { id: 'c', text: '360 km', correct: true },
        { id: 'd', text: '420 km' },
      ],
      expectedAnswer: '360 km',
      hints: [
        'Hour 6 is beyond the last measured point (hour 4) — this is extrapolation.',
        'Rate is 60 km/hr; from hour 4 (240 km), add 60 km/hr × 2 hr = 120 km.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-extrapolation-flaw',
      kind: 'try_yourself',
      problem:
        'A table shows enzyme activity rising steadily with substrate concentration from 1–4 mM. A note in the passage states that at high concentrations the enzyme\'s binding sites become fully saturated and activity levels off. A student extrapolates the 1–4 mM linear trend all the way out to 20 mM to predict activity. What is the most likely flaw in that reasoning?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'None — a linear trend can always be extended indefinitely.' },
        {
          id: 'b',
          text: 'The extrapolation ignores the passage\'s note that the mechanism changes (saturation) outside the measured range.',
          correct: true,
        },
        { id: 'c', text: 'The table does not show a real trend, so no prediction is possible at all.' },
        { id: 'd', text: 'The relationship is inverse, not direct, so the student should have subtracted instead of added.' },
      ],
      expectedAnswer:
        'The extrapolation ignores the passage\'s note that the mechanism changes (saturation) outside the measured range.',
      hints: [
        'Extrapolation assumes the SAME mechanism continues past the measured data.',
        'The passage explicitly warns the enzyme saturates — that stated mechanism change is exactly what the straight-line extrapolation ignores.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equal-confidence',
      kind: 'misconception_check',
      question:
        'A student says: "Interpolating and extrapolating are basically the same thing — both are just using the trend to estimate a value I don\'t have." What is wrong with this claim?',
      commonErrors: [
        {
          answer: 'Treating extrapolation and interpolation as equally reliable.',
          misconception:
            'Assuming a trend holds with the same confidence outside the measured data range as it does within it.',
          correctsTo:
            'Interpolation is usually safe because the trend is confirmed by data on BOTH sides of your target. Extrapolation is riskier because you are assuming — not confirming — that the same relationship and mechanism continue; real processes often plateau, reverse, or change slope outside the tested range, and ACT passages frequently say so directly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Direct relationship: both variables rise (or fall) together. Inverse: one rises as the other falls.',
        'Interpolation (between two measured points) is usually safe — the trend is confirmed on both sides.',
        'Extrapolation (beyond the measured data) is riskier — watch for passage language about leveling off, saturating, or hitting a limit.',
        'Always compute the rate of change between the two known points nearest your target before estimating.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Trends, Interpolation & Extrapolation' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
