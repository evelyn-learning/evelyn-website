/**
 * AP Statistics — CED Unit 1.1+1.2+1.3+1.4: Variables and categorical
 * data displays.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_CATEGORICAL_DATA: LessonPlan = {
  id: 'evelyn.ap.stats.categorical-data.v1', title: 'U1.1 Variables and Categorical Data',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.categorical-data', description: 'Distinguish categorical vs. quantitative variables. Construct and interpret frequency tables, relative frequency tables, two-way tables, bar charts, and pie charts.', standard: 'AP-STATS-1.1-1.4' }],
  prerequisites: [], followUps: ['apstats.quantitative-graphs'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame statistics as the science of variation.', script: "Statistics is the science of learning from DATA — but data varies. Two students take the same SAT and score differently. Two cities the same size have different crime rates. Statistics gives us tools to describe, compare, and reason about that variation. Today we start with categorical variables — labels, not numbers.", estimatedMinutes: 2 },
    { id: 'concept-types', kind: 'concept', goal: 'Cover variable types + categorical displays.',
      keyIdeas: [
        'A VARIABLE is any characteristic that varies from one individual to another. Two big types:',
        '  • CATEGORICAL VARIABLE: places each individual into a category (e.g., eye color, blood type, yes/no).',
        '  • QUANTITATIVE VARIABLE: a numerical measurement where arithmetic makes sense (e.g., height, test score).',
        'WATCH OUT — numbers that LABEL rather than measure (zip codes, jersey numbers) are CATEGORICAL.',
        'FREQUENCY TABLE: counts in each category. RELATIVE FREQUENCY TABLE: proportions (or percentages).',
        'TWO-WAY TABLE: cross-tabulates TWO categorical variables. MARGINAL distributions are row/column totals; CONDITIONAL distributions condition on a row or column.',
        'BAR CHART: bars whose HEIGHTS encode counts/proportions. Bars are SEPARATED (gaps between) — distinguishes from histograms.',
        'PIE CHART: slice areas proportional to category share. Use only when all categories sum to a meaningful whole.',
        'COMMON MISTAKE: comparing two groups by RAW counts when the groups have different sizes. Always use PROPORTIONS for fair comparison.',
      ],
      vocabulary: [
        { term: 'categorical variable', definition: 'a variable that places each individual into a category (label, not measurement).' },
        { term: 'two-way table', definition: 'a table cross-tabulating two categorical variables.' },
        { term: 'marginal distribution', definition: 'row or column totals of a two-way table — distribution of one variable, ignoring the other.' },
        { term: 'conditional distribution', definition: 'distribution of one variable WITHIN a fixed level of the other.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-twoway', kind: 'worked_example',
      problem: 'A school surveys 200 students about commute method (Walk/Bike/Bus/Car) and grade level (9, 10, 11, 12). Find the marginal distribution of commute method and the conditional distribution of commute method given Grade 12 if 50 of the 200 are in Grade 12, of whom 5 walk, 10 bike, 15 bus, 20 car.',
      steps: [
        'STEP 1 — MARGINAL distribution of commute method = totals across grades. (Stated values aren\'t given, so we can\'t compute exactly without the full table — focus on the conditional.)',
        'STEP 2 — CONDITIONAL distribution given Grade 12: divide each Grade 12 count by the Grade 12 total of 50.',
        'STEP 3 — Walk: 5/50 = 10%. Bike: 10/50 = 20%. Bus: 15/50 = 30%. Car: 20/50 = 40%.',
        'STEP 4 — Interpret: among Grade-12 students, 40% drive — the most common method.',
      ],
      answer: 'Conditional distribution given Grade 12: Walk 10%, Bike 20%, Bus 30%, Car 40%.', estimatedMinutes: 4 },
    { id: 'try-types', kind: 'try_yourself',
      problem: 'Classify each variable as categorical or quantitative: (a) ZIP code, (b) hours of sleep, (c) favorite color, (d) student ID number, (e) heart rate.',
      expectedAnswer: '(a) categorical (label). (b) quantitative. (c) categorical. (d) categorical (label). (e) quantitative.',
      responseFormat: 'free', hints: ['Ask: does arithmetic make sense?'], estimatedMinutes: 2 },
    { id: 'try-comparison', kind: 'try_yourself',
      problem: 'AP-style synthesis. School A reports 200 students taking AP Calc; School B reports 50. Of those, 80 at A and 25 at B passed. Which school has higher pass rate?',
      expectedAnswer: 'A: 80/200 = 40%. B: 25/50 = 50%. School B has higher pass rate. Comparing raw counts (80 vs 25) would mislead — sample sizes differ.',
      responseFormat: 'numeric', hints: ['Compute proportions, not counts.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Variable types: CATEGORICAL (label) vs QUANTITATIVE (measurement).',
      'Numbers used as labels (zip codes) are categorical.',
      'Two-way tables → marginal (totals) vs conditional (given a row/column) distributions.',
      'Compare groups by PROPORTIONS, not raw counts.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.1-1.4', cedTitle: 'Variables and Categorical Data', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard intro to variable types and categorical displays.' }] },
};
