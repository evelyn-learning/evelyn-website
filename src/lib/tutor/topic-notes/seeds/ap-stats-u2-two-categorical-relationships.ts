/**
 * AP Statistics — Unit 2 CED 2.1–2.3: Two Categorical Variables.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.two-categorical-relationships.v1). Theory re-tagged with
 * kind/title + an inline bar_chart of conditional distributions, method
 * humanized, pointers enriched to the calibration standard
 * (ap-macro-u4-loanable-funds.ts / ap-stats-u1-categorical-data.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.two-categorical-relationships';

export const BASELINE_AP_STATS_TWO_CATEGORICAL_RELATIONSHIPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.two-categorical-relationships.v1',
  course: 'AP Statistics',
  cedUnit: 2,
  cedTopic: '2.1-2.3',
  cedTitle: 'Two Categorical Variables',
  planId: 'evelyn.ap.stats.two-categorical-relationships.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.two-categorical-relationships.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-way tables: joint, marginal, conditional',
      content:
        'A TWO-WAY (contingency) table cross-tabulates two categorical variables — rows are the levels of one, columns the levels of the other. A **joint** count is a single cell; a **joint relative frequency** is that cell ÷ grand total. A **marginal** distribution is the row or column totals (one variable on its own). A **conditional** distribution is the distribution of one variable WITHIN a fixed level of the other — divide by that row/column subtotal, not the grand total.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Association between two categorical variables',
      content:
        'Two categorical variables are ASSOCIATED when the conditional distributions of one variable DIFFER across the levels of the other. If every conditional distribution is (roughly) identical, there is NO association — knowing one variable tells you nothing extra about the other. Judging association therefore means comparing conditional distributions, never raw counts.',
      diagram: {
        type: 'bar_chart',
        params: {
          title: 'Conditional distributions: % getting 8+ hrs sleep',
          yLabel: '% with 8+ hrs sleep',
          categories: ['Exercises daily', 'Does not exercise'],
          values: [66.7, 37.5],
          colors: ['#3b82f6', '#f59e0b'],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Displays: segmented bar graphs & mosaic plots',
      content:
        'A SEGMENTED (stacked) BAR GRAPH draws one bar per level of a variable, each split into segments for the conditional distribution of the other variable — identical stacks signal no association, differing stacks signal association. A MOSAIC PLOT is a segmented bar graph whose bar WIDTHS also encode the marginal frequencies, so it shows joint and conditional structure at once.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'joint relative frequency',
      content: 'a single cell count ÷ the grand total — the proportion of all individuals in that specific row-and-column combination.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'conditional distribution',
      content: 'the distribution of one variable within a single fixed level of the other; each entry is a cell ÷ its row (or column) subtotal.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'association',
      content: 'two categorical variables are associated if their conditional distributions differ across levels of the other variable. Association is not causation.',
    },
  ],
  methods: [
    {
      title: 'Decide whether two categorical variables are associated',
      when_to_use:
        'When an FRQ hands you a two-way table (or raw counts) and asks for a conditional distribution or whether an association exists.',
      steps: [
        'Pick the conditioning variable from the question ("of those who exercise…" → condition on the exercise rows).',
        'For each level, divide the cell counts by THAT level’s subtotal to get its conditional distribution (as percents).',
        'Compare the conditional distributions across levels.',
        'If they differ noticeably, state that an association exists; if they are essentially the same, state there is no association.',
        'Answer in context, citing the specific percentages you compared.',
      ],
      example: {
        problem:
          'A school surveys 200 students on whether they exercise daily and whether they get 8+ hours of sleep. Of the 120 who exercise, 80 get 8+ hours; of the 80 who do not, 30 get 8+ hours. Is there an association?',
        solution:
          'Conditional distribution of sleep given exercise: 80/120 = 66.7% get 8+ hours. Given no exercise: 30/80 = 37.5%. These differ substantially (66.7% vs 37.5%), so there IS an association: daily exercisers are more likely to get 8+ hours of sleep.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Marginal = row/column totals (÷ grand total). Conditional = within one row/column (÷ that subtotal).', kind: 'tip' },
    { content: 'To argue association, say the conditional distributions "differ" and cite the percentages — two separate descriptions are NOT a comparison.', kind: 'frq-vocab' },
    { content: 'Compare groups of different sizes with PROPORTIONS, never raw counts — the single most common two-way-table error.', kind: 'common-error' },
    { content: 'Identical segmented bars = no association; visibly different bars = association. Pick one conditioning direction and keep the percents in each bar summing to 100%.', kind: 'gotcha' },
    { content: 'Association ≠ causation — differing conditional distributions show the variables are related, not that one causes the other (a lurking variable may drive both).', kind: 'edge-case' },
  ],
};
