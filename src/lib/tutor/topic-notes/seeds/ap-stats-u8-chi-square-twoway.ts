/**
 * AP Statistics — Unit 8 CED 8.4–8.6: Chi-Square Tests for Two-Way Tables
 * (Homogeneity and Independence).
 *
 * Hand-curated from the source lesson plan (evelyn.ap.stats.chi-square-twoway.v1).
 * Theory keeps homogeneity and independence carefully distinct (same
 * mechanics, different design/hypotheses/conclusion wording); the method
 * carries a full two-way chi-square test end to end; pointers enriched to
 * the calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.chi-square-twoway';

export const BASELINE_AP_STATS_CHI_SQUARE_TWOWAY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.chi-square-twoway.v1',
  course: 'AP Statistics',
  cedUnit: 8,
  cedTopic: '8.4-8.6',
  cedTitle: 'Chi-Square Tests for Two-Way Tables',
  planId: 'evelyn.ap.stats.chi-square-twoway.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.chi-square-twoway.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Homogeneity vs independence — same math, different design',
      content:
        'Both use a two-way table of TWO categorical variables and the same statistic, but the SETUP differs. **Homogeneity**: separate samples from two or more populations (or treatment groups), asking whether one variable\'s distribution is the SAME across them. **Independence**: ONE sample classified by two variables, asking whether they are associated. Random ASSIGNMENT to treatments with a categorical response is analyzed as homogeneity.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Expected count in a two-way table',
      content:
        'For any cell, $E = \\dfrac{\\text{row total} \\times \\text{column total}}{\\text{grand total}}$. This is what the cell count would be if the row and column variables were unrelated, proportional to both margins.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Test statistic and degrees of freedom',
      content:
        '$\\chi^2 = \\sum \\dfrac{(O-E)^2}{E}$, summed over ALL cells of the table. $df = (r-1)(c-1)$ where r is the number of rows and c is the number of columns.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Conditions',
      content:
        '**Random**: independent random samples (homogeneity), one random sample (independence), or random assignment. **Large Counts**: every expected count in the table is at least 5. **10%**: check when sampling without replacement from a finite population.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Matching the conclusion to the design',
      content:
        "Homogeneity: 'there is evidence that the distribution of [response] DIFFERS across [populations/groups].' Independence: 'there is evidence of an ASSOCIATION between [variable A] and [variable B].' Using the wrong template can cost credit even with correct arithmetic.",
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'chi-square test for homogeneity',
      content: 'tests whether the distribution of one categorical variable is the same across two or more separate populations or treatment groups.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'chi-square test for independence',
      content: 'tests whether two categorical variables are independent (unassociated) within one population, based on one random sample.',
    },
  ],
  methods: [
    {
      title: 'Carry out a chi-square test for a two-way table',
      when_to_use:
        'When you have a two-way table of two categorical variables and need to test homogeneity (separate populations) or independence (one population, two variables) — the computation is identical either way.',
      steps: [
        'Decide homogeneity or independence from the study design, and state $H_0$/$H_a$ using the matching template.',
        'Find each row total, column total, and the grand total.',
        'Compute expected counts for every cell: $E = (\\text{row total})(\\text{column total})/\\text{grand total}$.',
        'Check conditions: Random, Large Counts (all $E \\ge 5$), 10%.',
        'Compute $\\chi^2 = \\sum (O-E)^2/E$ over all cells and $df = (r-1)(c-1)$.',
        'Find the p-value, compare to $\\alpha$, and conclude using the design-matched wording.',
      ],
      example: {
        problem:
          'Two groups A and B (row totals 100 each, grand total 200) are classified into three categories with column totals 80, 70, 50. Observed counts: A = 30, 40, 30; B = 50, 30, 20. Test at α = 0.05 whether the two groups\' distributions differ (homogeneity).',
        solution:
          'H₀: the distributions are the same in A and B. Hₐ: they differ. Expected: E = (row total)(col total)/200 → A: 100·80/200 = 40, 100·70/200 = 35, 100·50/200 = 25; B: same, 40, 35, 25 (row totals equal). All E ≥ 5 ✓. χ² = (30−40)²/40 + (40−35)²/35 + (30−25)²/25 + (50−40)²/40 + (30−35)²/35 + (20−25)²/25 = 2.5 + 0.714 + 1 + 2.5 + 0.714 + 1 = 8.43. df = (2−1)(3−1) = 2. p-value = P(χ²₂ ≥ 8.43) ≈ 0.015. Since 0.015 < 0.05, we reject H₀ — there is convincing evidence the two groups\' distributions differ.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Same formula either way: $\\chi^2=\\sum(O-E)^2/E$ with $E=(\\text{row total})(\\text{col total})/\\text{grand total}$ and $df=(r-1)(c-1)$.', kind: 'tip' },
    { content: "FRQ vocab: 'evidence the distribution DIFFERS across groups' for homogeneity, or 'evidence of an ASSOCIATION' for independence — match the wording to the design.", kind: 'frq-vocab' },
    { content: 'Confusing which design you have is the top error: separate samples/random assignment → homogeneity; ONE sample with two variables → independence.', kind: 'common-error' },
    { content: 'Row and column totals must come from the SAME table as the observed counts — recompute them from the data given, never assume.', kind: 'gotcha' },
    { content: 'When each variable has only two categories, chi-square and a two-proportion z-test give equivalent results ($z^2 = \\chi^2$); either is acceptable.', kind: 'edge-case' },
  ],
};
