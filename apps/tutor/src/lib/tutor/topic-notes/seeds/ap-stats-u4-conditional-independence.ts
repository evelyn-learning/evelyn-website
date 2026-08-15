/**
 * AP Statistics — Unit 4 CED 4.4–4.5: Conditional Probability and
 * Independence.
 *
 * Curated from the source lesson plan (evelyn.ap.stats.conditional-independence.v1).
 * Theory tagged with kind/title to the calibration standard set by
 * ap-stats-u1-normal-distribution.ts / ap-stats-u2-correlation.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.conditional-independence';

export const BASELINE_AP_STATS_CONDITIONAL_INDEPENDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.conditional-independence.v1',
  course: 'AP Statistics',
  cedUnit: 4,
  cedTopic: '4.4-4.5',
  cedTitle: 'Conditional and Independence',
  planId: 'evelyn.ap.stats.conditional-independence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.conditional-independence.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditional probability',
      content:
        'CONDITIONAL PROBABILITY asks: given that B has happened, what is the chance of A? $P(A\\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$, provided $P(B) > 0$. Interpretation: restrict the sample space to outcomes where B occurred, then ask what fraction of THOSE also has A. In general $P(A\\mid B) \\ne P(B\\mid A)$ — conditioning direction matters.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Independence: definition and test',
      content:
        'Events A and B are INDEPENDENT if knowing B occurred does not change the probability of A: $P(A\\mid B) = P(A)$, equivalently $P(A \\cap B) = P(A)\\cdot P(B)$. Otherwise they are DEPENDENT. CRITICAL distinction: independence is not the same as mutually exclusive. Mutually exclusive means $P(A \\cap B) = 0$; if A and B both have positive probability, they are NOT independent — knowing B happened tells you A definitely did not (that is strong dependence, not none).',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'General multiplication rule',
      content:
        '$P(A \\cap B) = P(A)\\cdot P(B\\mid A) = P(B)\\cdot P(A\\mid B)$ — this holds for ANY two events, dependent or not. When A and B are independent, $P(B\\mid A) = P(B)$, so it collapses to the simpler $P(A \\cap B) = P(A)\\cdot P(B)$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'conditional probability',
      content: '$P(A\\mid B) = P(A \\cap B)/P(B)$ — the probability of A, restricted to outcomes where B occurred.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'independent events',
      content: 'events where $P(A\\mid B) = P(A)$; knowing one occurred does not change the probability of the other.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'two-way table',
      content: 'a table cross-tabulating two variables by counts — divide a cell (or set of cells) by the appropriate row or column total to get a conditional probability.',
    },
  ],
  methods: [
    {
      title: 'Read conditional probabilities from a two-way table',
      when_to_use:
        'When a two-way table (or raw counts) is given and the question asks for P(A | B) — a very common FRQ format.',
      steps: [
        'Identify the condition (the "given" event) — this fixes one row or column of the table.',
        'Find the total for that fixed row/column (the denominator).',
        'Find the count of the outcome of interest WITHIN that fixed row/column (the numerator).',
        'Divide: P(outcome | condition) = (count within the condition) / (total for the condition).',
        'If asked for the reverse conditional (swap what is given), repeat with the other row/column as the denominator — do not assume the two are equal.',
      ],
      example: {
        problem:
          'A two-way table of 60 students by gender × glasses: Males — 25 with glasses, 15 without (40 total). Females — 10 with glasses, 10 without (20 total). Find P(glasses | male) and P(male | glasses).',
        solution:
          'P(glasses | male) = 25/40 = 0.625. Total with glasses = 25 + 10 = 35, so P(male | glasses) = 25/35 ≈ 0.714. The two conditionals differ because they condition on different totals.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Test two events for independence',
      when_to_use:
        'When asked to determine (and justify) whether two events are independent, given their individual and joint probabilities.',
      steps: [
        'Compute P(A) and P(B) individually.',
        'Compute P(A and B) from the problem (joint probability).',
        'Compute the product P(A)·P(B) and compare it to P(A and B).',
        'If they are equal, the events are independent; if not, they are dependent.',
        'State the conclusion in a full sentence referencing the comparison.',
      ],
      example: {
        problem:
          'In a standard deck: P(king) = 1/13, P(heart) = 1/4, P(king and heart) = 1/52. Are king and heart independent?',
        solution:
          'P(king)·P(heart) = (1/13)(1/4) = 1/52, which equals P(king and heart) = 1/52. The two are equal, so king and heart ARE independent — knowing a card is a heart does not change the probability it is a king.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Two-way tables: divide the count within the condition by that row/column total, not the grand total.', kind: 'tip' },
    { content: 'FRQ vocab: justify independence with the actual comparison — "P(A)·P(B) = ___ , which equals/does not equal P(A and B) = ___."', kind: 'frq-vocab' },
    { content: 'Classic error: confusing P(A | B) with P(B | A) — e.g. P(disease | positive test) ≠ P(positive test | disease). Read which event is "given" carefully.', kind: 'common-error' },
    { content: 'Independence ≠ mutually exclusive. If A and B are mutually exclusive and both have positive probability, they are NOT independent.', kind: 'gotcha' },
    { content: 'Drawing WITHOUT replacement makes successive draws dependent — the multiplication rule still applies, but P(B | A) ≠ P(B).', kind: 'edge-case' },
  ],
};
