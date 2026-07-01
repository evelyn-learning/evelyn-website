/**
 * AP Statistics — Unit 9 CED 9.1–9.3: Confidence Interval for the Slope
 * of a Regression Model.
 *
 * Hand-curated to the calibration standard (ap-stats-u2-*.ts) from the
 * source plan evelyn.ap.stats.slope-ci.v1. Theory covers the population
 * regression model, the t-CI formula, reading computer output, and the
 * LINER conditions; inline scatterplot shows the sample regression line
 * whose slope b is being estimated.
 *
 * KaTeX note: inline math must not START with a digit; every `$...$` opens
 * with a letter or command.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.slope-ci';

export const BASELINE_AP_STATS_SLOPE_CI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.slope-ci.v1',
  course: 'AP Statistics',
  cedUnit: 9,
  cedTopic: '9.1-9.3',
  cedTitle: 'Confidence Interval for a Slope',
  planId: 'evelyn.ap.stats.slope-ci.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.slope-ci.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Population regression model and the t-CI for the slope',
      content:
        'The POPULATION REGRESSION MODEL is $\\mu_y = \\alpha + \\beta x$ (equivalently $y = \\alpha + \\beta x + \\varepsilon$, with random error $\\varepsilon$ of mean 0 and constant SD $\\sigma$). A sample gives estimates $a$ and $b$ of $\\alpha$ and $\\beta$; $b$ is an UNBIASED estimator of the true slope $\\beta$. The t-CONFIDENCE INTERVAL for $\\beta$ is $b \\pm t^*\\,SE_b$, with $df = n-2$ — one fewer df than for the residual SD alone, since both $a$ and $b$ were estimated from the data.',
      diagram: {
        type: 'scatterplot_regression',
        params: {
          title: 'Sample regression: weight on height (n = 25)',
          xLabel: 'Height (cm)',
          yLabel: 'Weight (kg)',
          equationLabel: 'ŷ = −85.2 + 0.92x',
          rValue: 0.92,
          regression: { slope: 0.92, intercept: -85.2 },
          xMin: 155,
          xMax: 198,
          yMin: 55,
          yMax: 98,
          points: [
            [160, 61], [163, 64], [165, 67], [168, 68], [170, 72],
            [172, 71], [175, 77], [178, 79], [180, 81], [183, 82],
            [185, 86], [188, 87], [190, 91], [193, 92],
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading a computer regression output table',
      content:
        'AP output has the shape: **Predictor | Coef | SE Coef | T | P**, with one row for the constant (intercept $a$, $SE_a$) and one row for the x-variable (slope $b$, $SE_b$), plus $s = \\sqrt{MSE}$ and R-Sq below. Pull $b$ and $SE_b$ straight from the x-row — never recompute them by hand.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'LINER conditions for slope inference',
      content:
        'Check LINER before trusting the CI: **L**inear (scatterplot of y vs x is linear; residual plot shows random scatter, no curve). **I**ndependent (observations don\'t affect each other; 10% condition if sampling without replacement). **N**ormal (residuals at each x are roughly Normal — checked in practice with one histogram of all residuals). **E**qual SD (residual plot shows constant spread across x, no funnel). **R**andom (data from a random sample or randomized experiment).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Interpreting the interval — including when it contains 0',
      content:
        'Template: "We are C% confident that the true slope of the regression of [y] on [x] is between [lower] and [upper] [y-units] per [x-unit]." If 0 falls INSIDE the interval, that means plausible values of $\\beta$ include 0 — there is no convincing evidence of a linear association at that confidence level (not proof of "no relationship").',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'standard error of the slope, SE_b',
      content: 'the estimated standard deviation of the sampling distribution of $b$; read directly from the x-row of computer regression output.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'population slope β',
      content: 'the true (unknown) slope of the population regression line $\\mu_y = \\alpha + \\beta x$; the sample slope $b$ estimates it.',
    },
  ],
  methods: [
    {
      title: 'Construct and interpret a t confidence interval for the slope',
      when_to_use:
        'When a computer regression output (or b, SE_b, and n) is given and the question asks for a CI for the true slope β.',
      steps: [
        'Find degrees of freedom: $df = n-2$.',
        'Read $b$ (x-row Coef) and $SE_b$ (x-row SE Coef) directly from the output.',
        'Find $t^*$ for the requested confidence level with that df (table or invT).',
        'Compute the margin of error: $ME = t^*\\,SE_b$.',
        'Form the interval $b \\pm ME$.',
        'Interpret in context: "We are C% confident that the true slope of the regression of [y] on [x] is between [lower] and [upper] [y-units per x-unit]."',
      ],
      example: {
        problem:
          'A regression of weight (y, kg) on height (x, cm) for a random sample of 25 adults gives:\nPredictor | Coef | SE Coef | T | P\nConstant | −85.2 | 12.5 | −6.82 | 0.000\nHeight | 0.92 | 0.08 | 11.50 | 0.000\nConstruct and interpret a 95% CI for the slope β.',
        solution:
          'df = 25 − 2 = 23. b = 0.92, SE_b = 0.08. t* for 95% with df = 23 ≈ 2.069. ME = 2.069(0.08) ≈ 0.166. CI: 0.92 ± 0.166 = (0.754, 1.086). We are 95% confident that the true slope of the regression of weight on height is between 0.754 and 1.086 kg per cm — each additional cm of height is associated with a true mean weight increase of 0.75 to 1.09 kg.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Verify the LINER conditions for slope inference',
      when_to_use: 'Before constructing or trusting a CI (or test) for the slope — always check first.',
      steps: [
        'L — Linear: scatterplot of y vs x is linear, and the residual plot shows random scatter, no curve.',
        'I — Independent: observations don\'t affect each other; apply the 10% condition if sampling without replacement.',
        'N — Normal: residuals at each x are roughly Normal — checked in practice with a histogram of all residuals (a proxy).',
        'E — Equal SD: residual plot shows roughly constant spread across all x, no fan/funnel shape.',
        'R — Random: data come from a random sample or a randomized experiment.',
      ],
      example: {
        problem:
          'A residual plot for a regression of exam score on study hours shows random scatter with roughly the same vertical spread across all x-values, from an SRS of 40 students. Which LINER conditions does this evidence support?',
        solution:
          'The residual plot supports LINEAR (no curved pattern) and EQUAL SD (consistent spread, no funnel). The SRS supports RANDOM. INDEPENDENT still needs the 10% condition (40 from a population of at least 400). NORMAL cannot be judged from this residual plot alone — a histogram of the residuals is needed.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'CI for slope: $b \\pm t^*\\,SE_b$ with $df = n-2$ — one fewer df than for residuals alone.', kind: 'tip' },
    { content: 'Interpret in context with units: "the true slope of the regression of [y] on [x] is between ___ and ___ [y-units] per [x-unit]."', kind: 'frq-vocab' },
    { content: 'Do not use $df = n-1$ — slope inference costs an extra degree of freedom for estimating both $a$ and $b$, so $df = n-2$.', kind: 'common-error' },
    { content: 'If 0 is inside the CI, there is no convincing evidence the true slope differs from 0 — that is not proof of "no relationship."', kind: 'gotcha' },
    { content: 'When only $b$ and $SE_b$ are given (no raw data), you can still build the CI — but checking Normal/Equal-SD needs the residual plot or histogram.', kind: 'edge-case' },
  ],
};
