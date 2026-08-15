/**
 * AP Statistics — Unit 2 CED 2.6–2.8: Least-Squares Regression.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.linear-regression.v1). Bullet-fragments consolidated into
 * formula/framework entries + an inline LSRL scatterplot, method humanized,
 * pointers enriched to the calibration standard (ap-stats-u1-*.ts).
 *
 * KaTeX note: inline math must not START with a digit; bounds/percentages are
 * phrased so each `$...$` opens with a letter or command.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.linear-regression';

export const BASELINE_AP_STATS_LINEAR_REGRESSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.linear-regression.v1',
  course: 'AP Statistics',
  cedUnit: 2,
  cedTopic: '2.6-2.8',
  cedTitle: 'Least-Squares Regression',
  planId: 'evelyn.ap.stats.linear-regression.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.linear-regression.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The least-squares regression line (LSRL)',
      content:
        'The LSRL is the line $\\hat{y} = a + bx$ that minimizes the sum of squared residuals $\\sum (y_i - \\hat{y}_i)^2$. The hat on $\\hat{y}$ marks it as a PREDICTED value. Slope and intercept come from the summary statistics: $b = r\\,\\dfrac{s_y}{s_x}$ and $a = \\bar{y} - b\\bar{x}$, so the line always passes through the point $(\\bar{x}, \\bar{y})$.',
      diagram: {
        type: 'scatterplot_regression',
        params: {
          title: 'LSRL: ŷ = −85 + 0.95x (weight on height)',
          xLabel: 'Height (cm)',
          yLabel: 'Weight (kg)',
          equationLabel: 'ŷ = −85 + 0.95x',
          rValue: 0.85,
          rSquared: 0.72,
          regression: { slope: 0.95, intercept: -85 },
          xMin: 155,
          xMax: 195,
          yMin: 55,
          yMax: 105,
          points: [
            [160, 62], [165, 72], [168, 70], [170, 78], [172, 74],
            [175, 82], [178, 80], [180, 90], [183, 88], [188, 96], [190, 92],
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Interpreting slope and intercept',
      content:
        'SLOPE b is the predicted CHANGE in y for each one-unit increase in x — "for each additional [x-unit], the predicted [y] changes by b [y-units]." INTERCEPT a is the predicted y when $x = 0$; it is often not meaningful in context (e.g. a person of height 0). Both interpretations must name the real variables and the word "predicted."',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Prediction, extrapolation, and r²',
      content:
        'To PREDICT, substitute an x into the equation to get $\\hat{y}$. EXTRAPOLATION — predicting for an x outside the observed range — is unreliable because the linear pattern may not continue. The COEFFICIENT OF DETERMINATION $r^2$ is the proportion of the variation in y explained by the linear regression on x; report it as a percent, e.g. "$r^2 = 0.72$ means about 72% of the variation in y is explained by the regression on x."',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'least-squares regression line',
      content: 'the line $\\hat{y}=a+bx$ that minimizes $\\sum(y_i-\\hat{y}_i)^2$; passes through $(\\bar{x},\\bar{y})$.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'extrapolation',
      content: 'predicting y for an x-value outside the range of the observed data — unreliable and to be avoided.',
    },
  ],
  methods: [
    {
      title: 'Interpret and use a least-squares regression line',
      when_to_use:
        'When an FRQ gives a regression equation (or its slope, intercept, and r) and asks you to interpret coefficients, predict, or find r².',
      steps: [
        'Interpret the SLOPE: "for each additional [x-unit], the predicted [y] increases/decreases by b [y-units]."',
        'Interpret the INTERCEPT as the predicted y at $x = 0$, noting when that is outside the data (not meaningful).',
        'PREDICT by substituting the requested x into $\\hat{y} = a + bx$; flag it if the x is outside the observed range (extrapolation).',
        'Compute $r^2$ (square r) and interpret it as the percent of variation in y explained by the regression.',
      ],
      example: {
        problem:
          'A regression of weight (y, kg) on height (x, cm) for adult men gives $\\hat{y} = -85 + 0.95x$ with $r = 0.85$. (a) Interpret the slope. (b) Interpret the intercept. (c) Predict weight at 175 cm. (d) Find and interpret r².',
        solution:
          '(a) For each additional cm of height, predicted weight increases by 0.95 kg. (b) Intercept −85 kg is the predicted weight at 0 cm — impossible, so not meaningful (far below the data). (c) ŷ = −85 + 0.95(175) = 81.25 kg. (d) r² = 0.85² = 0.7225, so about 72% of the variation in weight is explained by the regression on height.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Slope $b = r\\,s_y/s_x$; intercept $a = \\bar{y} - b\\bar{x}$; the LSRL always passes through $(\\bar{x}, \\bar{y})$.', kind: 'tip' },
    { content: 'Slope interpretation must say "PREDICTED change in y" per unit x, in context — "y increases by b" (no "predicted") loses credit.', kind: 'frq-vocab' },
    { content: '$r^2$ is the percent of variation in y explained by the regression — do not confuse it with r or call it "the percent of points on the line."', kind: 'common-error' },
    { content: 'Never extrapolate: predicting outside the observed x-range assumes a linear pattern that may not hold.', kind: 'gotcha' },
    { content: 'Intercept is often meaningless (x = 0 outside the data) — say so rather than forcing a real-world reading.', kind: 'edge-case' },
  ],
};
