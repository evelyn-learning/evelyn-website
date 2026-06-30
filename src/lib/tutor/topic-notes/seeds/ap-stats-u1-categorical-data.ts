/**
 * AP Statistics — Unit 1 CED 1.1–1.4: Variables and Categorical Data.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.categorical-data.v1). Theory re-tagged with kind/title,
 * method humanized, pointers enriched with FRQ-vocab / gotcha / common-error
 * to the calibration standard set by ap-macro-u4-loanable-funds.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.categorical-data';

export const BASELINE_AP_STATS_CATEGORICAL_DATA: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.categorical-data.v1',
  course: 'AP Statistics',
  cedUnit: 1,
  cedTopic: '1.1-1.4',
  cedTitle: 'Variables and Categorical Data',
  planId: 'evelyn.ap.stats.categorical-data.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-06-30',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.categorical-data.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two types of variable',
      content:
        'A VARIABLE is any characteristic that varies from one individual to another. **Categorical** places each individual into a group (eye color, blood type, yes/no). **Quantitative** is a numerical measurement where arithmetic is meaningful (height, test score). The variable type decides which graphs and statistics are legal.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Labels vs measurements',
      content:
        'Numbers that LABEL rather than measure are CATEGORICAL — zip codes, jersey numbers, area codes, ID numbers. Test: does averaging it mean anything? Average jersey number is nonsense → categorical.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Frequency vs relative-frequency tables',
      content:
        'A FREQUENCY table lists the count in each category. A RELATIVE-FREQUENCY table lists the proportion (or percent) in each category — count ÷ total. Relative frequency is what makes groups of different sizes comparable.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-way tables: marginal & conditional',
      content:
        'A TWO-WAY (contingency) table cross-tabulates two categorical variables. **Marginal** distribution = the row or column totals (one variable, ignoring the other). **Conditional** distribution = the distribution of one variable WITHIN a fixed level of the other (e.g. commute method given Grade 12). Comparing conditional distributions is how you judge association between the two variables.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Displays for categorical data',
      content:
        'BAR CHART: bar heights encode counts or proportions; bars are SEPARATED by gaps (this is what distinguishes a bar chart from a histogram). PIE CHART: slice area is proportional to category share — valid only when categories partition a meaningful whole that sums to 100%.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'categorical variable',
      content: 'a variable that places each individual into a category — a label, not a measurement.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'two-way table',
      content: 'a table cross-tabulating two categorical variables; cells hold joint counts.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'marginal distribution',
      content:
        'the row or column totals of a two-way table — the distribution of one variable on its own, ignoring the other.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'conditional distribution',
      content:
        'the distribution of one variable within a fixed level of the other (condition on a single row or column, then convert to proportions).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'association',
      content:
        'two categorical variables are ASSOCIATED if the conditional distributions of one differ across the levels of the other. Association is not causation.',
    },
  ],
  methods: [
    {
      title: 'Read a two-way table: marginal and conditional distributions',
      when_to_use:
        'When an FRQ gives a two-way table (or raw counts) and asks for a marginal distribution, a conditional distribution, or whether two categorical variables are associated.',
      steps: [
        'Identify the two variables and which one the question conditions on ("given Grade 12" → fix the Grade-12 column/row).',
        'For a MARGINAL distribution: take the relevant row or column totals and divide each by the grand total.',
        'For a CONDITIONAL distribution: take the counts in the fixed row/column and divide each by THAT row/column total (not the grand total).',
        'Convert to proportions or percents and label them with the category names.',
        'To judge ASSOCIATION: compute the conditional distribution for each level and compare — if they differ noticeably, the variables are associated.',
        'Answer in context, citing the proportions with their values.',
      ],
      example: {
        problem:
          'A school surveys 200 students about commute method (Walk/Bike/Bus/Car) and grade level. 50 of the 200 are in Grade 12, of whom 5 walk, 10 bike, 15 take the bus, 20 drive. Find the conditional distribution of commute method given Grade 12.',
        solution:
          'Divide each Grade-12 count by 50: Walk 5/50 = 10%, Bike 10/50 = 20%, Bus 15/50 = 30%, Car 20/50 = 40%. Among Grade-12 students, driving (40%) is the most common method.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Variable types: CATEGORICAL (label) vs QUANTITATIVE (measurement). Type dictates legal graphs/statistics.', kind: 'tip' },
    { content: 'Numbers used as labels (zip codes, jersey numbers) are CATEGORICAL — averaging them is meaningless.', kind: 'gotcha' },
    { content: 'Two-way tables → MARGINAL = totals (÷ grand total); CONDITIONAL = within one row/column (÷ that subtotal).', kind: 'tip' },
    { content: 'Compare groups of different sizes by PROPORTIONS, never raw counts — this is the most common categorical-FRQ error.', kind: 'common-error' },
    { content: "FRQ vocab: to argue association, say the conditional distributions 'differ' and cite the percentages. Two separate descriptions are NOT a comparison.", kind: 'frq-vocab' },
    { content: 'Association ≠ causation. Differing conditional distributions show the variables are related, not that one causes the other.', kind: 'edge-case' },
    { content: 'A pie chart is only valid when the categories partition a whole and sum to 100% — not for counts that can overlap.', kind: 'gotcha' },
  ],
};
