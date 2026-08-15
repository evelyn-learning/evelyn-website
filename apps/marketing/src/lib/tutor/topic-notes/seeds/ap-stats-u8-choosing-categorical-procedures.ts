/**
 * AP Statistics — Unit 8 CED 8.7: Choosing the Right Categorical Procedure.
 *
 * Hand-curated from the source lesson plan
 * (evelyn.ap.stats.choosing-categorical-procedures.v1). Theory frames the
 * decision tree (one variable vs two; category count; sampling design) and
 * the 2×2 z/chi-square equivalence; methods split identification from
 * execution, the second carrying a full chi-square test; pointers enriched
 * to the calibration standard set by ap-stats-u1/u2-*.ts.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.choosing-categorical-procedures';

export const BASELINE_AP_STATS_CHOOSING_CATEGORICAL_PROCEDURES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.choosing-categorical-procedures.v1',
  course: 'AP Statistics',
  cedUnit: 8,
  cedTopic: '8.7',
  cedTitle: 'Choosing the Right Procedure',
  planId: 'evelyn.ap.stats.choosing-categorical-procedures.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.choosing-categorical-procedures.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The decision tree',
      content:
        '**Q1** — one categorical variable or two? **One variable**: two categories → **one-proportion z-test**; three or more categories → **chi-square goodness-of-fit**. **Two variables** (two-way table): separate samples from multiple populations, or random assignment to treatments → **chi-square homogeneity**; one sample classified by both variables → **chi-square independence**. When both variables have exactly two categories, a **two-proportion z-test** is also valid.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why the design matters, not just the table shape',
      content:
        'The SAME two-way table of counts can be a homogeneity test OR an independence test depending on how the data were collected — reason backward from the study design (how many samples? drawn how?), not just from the numbers in the cells.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Two-proportion z and chi-square agree at 2×2',
      content:
        'When each of two categorical variables has only two categories, the two-proportion z-test and the chi-square test give equivalent results: $z^2 = \\chi^2$. Either procedure is correct; pick whichever the question\'s phrasing suggests — a difference in proportions, or a table of counts.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'one-proportion z-test',
      content: 'tests a single population proportion against a claimed value; used when there is one categorical variable with exactly two categories (Unit 6).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'chi-square goodness-of-fit',
      content: 'tests whether one categorical variable, having three or more categories, matches a claimed distribution.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'chi-square homogeneity / independence',
      content: "two-way-table tests sharing one formula — homogeneity compares one variable's distribution across separate populations; independence asks whether two variables are associated within one population.",
    },
  ],
  methods: [
    {
      title: 'Identify the correct categorical procedure',
      when_to_use: "At the start of any AP categorical-data FRQ or MCQ that doesn't name the test — before doing any arithmetic.",
      steps: [
        'Count the categorical variables: one, or two?',
        'If one variable: count its categories — two → one-proportion z; three or more → chi-square GOF.',
        'If two variables: determine how the data were collected — separate samples/random assignment → homogeneity; one sample classified by both → independence.',
        'If both variables have exactly two categories, note that two-proportion z and chi-square are both acceptable.',
        'State the procedure name explicitly and justify it in one sentence — AP rubrics award or deny credit here.',
      ],
      example: {
        problem:
          'A pollster takes ONE random sample of 1000 people and records both their political party (D, R, I) and their preferred news source (TV, online, print, radio). Identify the correct test and state its degrees of freedom.',
        solution:
          'One sample classified by TWO categorical variables → chi-square test for INDEPENDENCE. H₀: party and news source are independent. Hₐ: they are associated. df = (r−1)(c−1) = (3−1)(4−1) = 6.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Carry out the chosen test once identified',
      when_to_use: 'After naming the procedure, when the problem also asks you to complete the test — not just identify it.',
      steps: [
        'Set up $H_0$/$H_a$ using the template that matches the chosen procedure (GOF, homogeneity, or independence).',
        'Compute expected counts: $E_i = np_i$ for GOF, or $E=(\\text{row total})(\\text{col total})/\\text{grand total}$ for a two-way table.',
        'Check Random, Large Counts (all $E \\ge 5$), and 10% conditions.',
        'Compute $\\chi^2=\\sum(O-E)^2/E$ and the matching df.',
        'Find the p-value, compare to $\\alpha$, and conclude in context, in the wording that matches the chosen procedure.',
      ],
      example: {
        problem:
          'Two vending machines (A and B) are each sampled: 60 transactions from A, 60 from B, and each purchase is classified as Snack or Drink. Observed: A → 40 snack, 20 drink; B → 25 snack, 35 drink. Test at α = 0.05 whether the two machines have the same snack/drink split (homogeneity).',
        solution:
          'H₀: the snack/drink distribution is the same for A and B. Hₐ: it differs. Row totals 60 each; column totals: snack 65, drink 55; grand total 120. Expected: E_A,snack = 60·65/120 = 32.5; E_A,drink = 60·55/120 = 27.5; E_B,snack = 32.5; E_B,drink = 27.5 (all ≥ 5 ✓). χ² = (40−32.5)²/32.5 + (20−27.5)²/27.5 + (25−32.5)²/32.5 + (35−27.5)²/27.5 = 1.731 + 2.045 + 1.731 + 2.045 = 7.55. df = (2−1)(2−1) = 1. p-value = P(χ²₁ ≥ 7.55) ≈ 0.006. Since 0.006 < 0.05, we reject H₀ — evidence the two machines\' snack/drink distributions differ. (This is also verifiable with a two-proportion z-test since both variables are binary: z² ≈ 7.55 = χ².)',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Start every categorical FRQ with the decision tree: how many variables, how many categories, how was the data collected?', kind: 'tip' },
    { content: "State the procedure by NAME (e.g. 'chi-square test for independence') and justify it in one sentence — naming it correctly is often its own rubric point.", kind: 'frq-vocab' },
    { content: "Don't assume two-way table = homogeneity; check whether the samples were SEPARATE (homogeneity) or ONE sample with two variables recorded (independence).", kind: 'common-error' },
    { content: "'Random assignment to treatments' with a categorical outcome is tested as HOMOGENEITY, even though there was only one initial pool of subjects.", kind: 'gotcha' },
    { content: 'At 2×2 (both variables binary), two-proportion z and chi-square independence/homogeneity are mathematically equivalent ($z^2=\\chi^2$) — either answer is correct.', kind: 'edge-case' },
  ],
};
