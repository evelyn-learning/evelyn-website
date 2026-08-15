/**
 * GRE Quant — Data Interpretation.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_DATA_INTERPRETATION: LessonPlan = {
  id: 'evelyn.gre.q.data-interpretation.v1',
  title: 'GRE Quant — Data Interpretation',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.data-interpretation',
      description: 'Read tables, bar charts, line graphs, pie charts, and scatter plots; perform arithmetic on the values.',
      standard: 'GRE-Q-DI',
    },
  ],
  prerequisites: ['gre.q.3d-geometry'],
  followUps: ['gre.q.statistics'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Data Interpretation sets contribute multiple questions and reward careful reading more than maths.',
      script: 'A DI set on the GRE typically gives 2-3 figures (bar chart, table, pie chart) and asks 3 questions. The hardest part is precision: reading the right bar, the right column, the right axis units. Today we drill the read-then-compute workflow.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-di',
      kind: 'concept',
      goal: 'Reading techniques + common chart traps + workflow.',
      keyIdeas: [
        'AXIS UNITS: always check axis scales, especially for bar/line graphs. "Percentage" vs "absolute number" vs "thousands" vs "millions" totally changes the answer.',
        'PIE CHARTS: each slice is a percentage of the total. Without knowing the total, you can\'t compute absolute numbers.',
        'DOUBLE-AXIS GRAPHS: a line for one quantity, bars for another, with two y-axes. Always check which axis a series uses.',
        'STACKED BAR: each bar is divided into colour-coded sections. Section sizes are shares of that bar\'s total.',
        'PERCENT vs PERCENTAGE POINT: "rose 5 percentage points" means absolute change in percent (e.g. 30% → 35%). "Rose 5%" means relative change (30% → 31.5%).',
        'TABLE READING: trace the row and column carefully. GRE tables are often dense — use a finger or pencil.',
        'WORKFLOW: 1) Read the question entirely. 2) Identify exactly what value(s) you need. 3) Locate them. 4) Compute. Don\'t front-load reading the chart before knowing the question.',
        'TIME TRAP: GRE DI questions often come 2-3 in a row. Don\'t skip the easier ones to grind a hard one.',
      ],
      vocabulary: [
        { term: 'percentage point', definition: 'an absolute difference between two percentages; "5 percentage points" ≠ "5 percent".' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-di',
      kind: 'worked_example',
      problem: 'A pie chart shows that 30% of a company\'s budget goes to salaries, 25% to rent, 20% to materials, and the rest to "other". If the total budget is $400,000, find the dollar amount spent on "other".',
      steps: [
        'Percentages: 30 + 25 + 20 = 75. Other = 100 − 75 = 25%.',
        'Dollar amount: 0.25 × 400,000 = $100,000.',
      ],
      answer: '$100,000',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bar chart shows quarterly revenues: Q1 = $80k, Q2 = $100k, Q3 = $120k, Q4 = $100k. By what percent did revenue increase from Q1 to Q3?',
      expectedAnswer: '50%',
      responseFormat: 'numeric',
      hints: [
        'Percent change = (new − old)/old × 100%.',
        '(120 − 80)/80 × 100% = 40/80 × 100% = 50%.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-percent-point',
      kind: 'misconception_check',
      question: 'A graph shows the unemployment rate dropped from 8% to 6%. A student says "it dropped 2%". Why might this be misleading?',
      commonErrors: [
        {
          answer: '"Dropped 2%"',
          misconception: 'Conflating percentage points with relative percent change.',
          correctsTo: 'Strictly speaking, the rate dropped 2 PERCENTAGE POINTS (8 − 6 = 2). The PERCENT change is (8 − 6)/8 × 100% = 25% — a much bigger-sounding figure. GRE distinguishes carefully: "X percent change" means relative, "X percentage points" means absolute. Read the question wording closely.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Always check axis units and scales.',
        'Pie chart needs total to convert percentages to absolutes.',
        'Percent change ≠ percentage points.',
        'Read the question first, THEN consult the chart.',
        'Don\'t spend more than 90 seconds on any single DI question.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In 2020 a company had 200 employees. In 2025 it has 280. By what percent did headcount grow?',
      hint: '(280 − 200)/200 × 100% = 80/200 × 100% = 40%.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
