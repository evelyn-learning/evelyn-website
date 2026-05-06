/**
 * ACT Science — Data Representation passages.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_SCIENCE_DATA_REP: LessonPlan = {
  id: 'evelyn.testprep.act.science.data-rep.v1',
  title: 'ACT Science — Data Representation Passages',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-science',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.science.data-rep',
      description: 'Drill ACT Data Representation passages: read graphs, tables, and charts to extract values, identify trends, and answer interpretation questions.',
      standard: 'ACT-SCIENCE',
    },
  ],
  prerequisites: ['testprep.act.science'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Data Representation passages test ONLY graph reading + extrapolation — no science background needed.',
      script: 'Most ACT Science questions don\'t require any science you don\'t already know. They test whether you can READ A GRAPH carefully under time pressure. Today: the graph-reading habits that turn most Data Rep questions into 30-second wins.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-data-rep',
      kind: 'concept',
      goal: 'Passage shape, axis reading, trends, extrapolation, common traps.',
      keyIdeas: [
        'DATA REPRESENTATION passages: typically 1 short intro paragraph + 1-3 figures (graphs, tables, schematics) + 5-6 questions.',
        'PASSAGE TIME budget: ~5 min (less than Research Summaries or Conflicting Viewpoints, which need more reading).',
        'AXIS READING discipline:',
        '  Identify the X and Y variables AND units before answering anything.',
        '  Note the SCALE — is it linear, log, or with a break?',
        '  Note the RANGE — what values are shown.',
        'TREND identification:',
        '  Increasing/decreasing.',
        '  Linear vs curved (exponential, asymptotic, sinusoidal).',
        '  Maximum / minimum points.',
        '  Multiple curves: which is steepest? Which has highest peak?',
        'TYPICAL QUESTION TYPES:',
        '  Direct read-off: "What is Y when X = 5?" Find X = 5 on x-axis, trace up to curve, read Y.',
        '  Trend: "As X increases from 0 to 10, Y..." Pick "increases," "decreases," or "first increases then decreases."',
        '  Extrapolation: "What would Y be at X = 15 (beyond the graph)?" Continue the trend; usually one option fits the pattern.',
        '  Inter-figure comparison: "Across Figures 1 and 2, when X = 3, which Y is higher?"',
        'TRAPS:',
        '  Answers in wrong units (g vs kg, L vs mL).',
        '  Confusing two curves on the same plot — DOUBLE-CHECK which curve.',
        '  Misreading log scales (each step is ×10, not +10).',
      ],
      vocabulary: [
        { term: 'extrapolation', definition: 'extending a trend beyond the data shown; risky if the underlying mechanism may change outside the range.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Figure 1 shows reaction rate (mol/min) vs temperature (°C) for two catalysts, A and B. Catalyst A peaks at 60°C with rate 12; Catalyst B peaks at 80°C with rate 9. Question: At 70°C, which catalyst gives a higher rate?',
      steps: [
        'Identify both axes: x = temp, y = rate.',
        'Find x = 70°C. For catalyst A: peak was 60, so at 70 it has DESCENDED somewhat (depends on shape, but past peak). For catalyst B: peak is 80, so at 70 it\'s still RISING.',
        'Without specific values, estimate: A ≈ 9-10 (descending from 12), B ≈ 8-9 (rising toward 9 peak).',
        'Likely A is still slightly higher at 70°C.',
        'Real ACT problems: trace each curve at x = 70 and compare y-values directly. The answer is the one with the higher trace.',
      ],
      answer: 'Catalyst A (depends on exact curves; trace each at x = 70).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A graph shows pressure (atm) vs volume (L) for a gas, with the curve dropping from (1, 10) to (10, 1). What is the relationship?',
      expectedAnswer: 'Inverse: as volume increases, pressure decreases. Specifically PV ≈ constant (10 = 1×10 = 10×1) — Boyle\'s law shape. The curve is hyperbolic.',
      responseFormat: 'free',
      hints: [
        'What happens to one variable when the other doubles?',
        'Multiply pressure × volume at each point — is it constant?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-axis-skip',
      kind: 'misconception_check',
      question: 'A student starts answering questions before reading the axis labels. Why is this often disastrous?',
      commonErrors: [
        {
          answer: 'Skip axis labels',
          misconception: 'Treating graphs as universally formatted.',
          correctsTo: 'Axis labels include UNITS and SCALE TYPE. Skipping them costs you when:\n- The y-axis is in mg but the question asks for grams (1000× error).\n- The x-axis is log-scale but you read it linearly (huge error in trend interpretation).\n- A break in the axis hides a region you assumed was zero.\nThe 10 seconds spent reading axes saves time later by preventing nonsense answers. ALWAYS check before any read-off.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Data Rep ≈ 5 min/passage; needs only graph-reading.',
        'Read axes (variable, units, scale) BEFORE answering.',
        'Trace curves carefully — don\'t confuse two curves.',
        'Extrapolation: continue the trend; flag if mechanism could change.',
        'Watch for unit traps in answer choices.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
