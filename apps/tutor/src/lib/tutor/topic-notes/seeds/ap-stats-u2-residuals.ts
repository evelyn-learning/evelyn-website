/**
 * AP Statistics — Unit 2 CED 2.7–2.9: Residuals & Departures from Linearity.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.residuals.v1). Bullet-fragments consolidated into
 * framework/formula entries + an inline scatterplot with residual segments,
 * method humanized, pointers enriched to the calibration standard.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.residuals';

export const BASELINE_AP_STATS_RESIDUALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.residuals.v1',
  course: 'AP Statistics',
  cedUnit: 2,
  cedTopic: '2.7-2.9',
  cedTitle: 'Residuals & Departures from Linearity',
  planId: 'evelyn.ap.stats.residuals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.residuals.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Residual = actual − predicted',
      content:
        'A RESIDUAL is $y - \\hat{y}$ (actual minus predicted). A POSITIVE residual means the point sits ABOVE the line — the model UNDERpredicted; a NEGATIVE residual means it sits BELOW — the model OVERpredicted. For the least-squares line the residuals always sum to 0.',
      diagram: {
        type: 'scatterplot_regression',
        params: {
          title: 'Residuals: vertical gaps from each point to the LSRL',
          xLabel: 'x',
          yLabel: 'y',
          showResiduals: true,
          regression: { slope: 2, intercept: 5 },
          xMin: 0,
          xMax: 7,
          yMin: 0,
          yMax: 22,
          points: [
            [1, 8], [2, 7], [3, 14], [4, 12], [5, 16], [6, 18],
          ],
          highlightPoint: { x: 3, y: 14, label: 'residual +3' },
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading a residual plot',
      content:
        'A RESIDUAL PLOT graphs the residuals against x. **Random scatter** (no pattern) → the linear model is APPROPRIATE. A **curved** pattern (U- or arch-shape) → the true relationship is nonlinear, so a line is not appropriate. A **funnel** shape (spread growing or shrinking across x) → the variability is not constant. The residual plot, not $r$ or $r^2$, is the tool for judging whether a line fits.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Standard deviation of the residuals, s',
      content:
        'The typical size of a residual is $s = \\sqrt{\\dfrac{\\sum (y_i - \\hat{y}_i)^2}{n-2}}$. Interpret it as "predictions from this model are typically off by about s [y-units]." Smaller s means the points fall closer to the line.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Outliers, leverage, and influence',
      content:
        'A regression OUTLIER has a large residual (far from the line vertically). A HIGH-LEVERAGE point has an extreme x (far from $\\bar{x}$). An INFLUENTIAL point is one whose removal noticeably changes the slope, intercept, or r — typically a high-leverage point that also does not fit the trend. Leverage is about x-position; influence is about effect on the line.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'residual',
      content: '$y - \\hat{y}$: the actual y minus the value the regression line predicts.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'influential point',
      content: 'a data point whose removal substantially changes the regression line (slope, intercept, or r).',
    },
  ],
  methods: [
    {
      title: 'Compute and interpret a residual',
      when_to_use:
        'When given a regression equation and a data point, or asked whether a residual plot supports a linear model.',
      steps: [
        'Predict: substitute the point’s x into $\\hat{y} = a + bx$.',
        'Residual = actual y − predicted $\\hat{y}$.',
        'Interpret the SIGN: positive → actual above the line (underpredicted); negative → below (overpredicted).',
        'If asked about model fit, read the RESIDUAL PLOT: random scatter supports a line; a clear pattern does not.',
      ],
      example: {
        problem: 'A regression gives $\\hat{y} = 5 + 2x$ and the point (3, 14) is in the data. Find and interpret the residual.',
        solution:
          'Predicted ŷ = 5 + 2(3) = 11. Residual = 14 − 11 = +3. The residual is positive, so the actual value (14) lies above the line — the model underpredicted this point by 3 units.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'Residual = actual − predicted ($y - \\hat{y}$). Positive = point above the line; least-squares residuals sum to 0.', kind: 'tip' },
    { content: 'Judge linearity from the RESIDUAL PLOT, not from r or r²: random scatter = line OK; a curve/funnel = line not appropriate.', kind: 'frq-vocab' },
    { content: 'Do not confuse leverage (extreme x) with influence (changes the line) with outlier (large residual) — they are three distinct ideas.', kind: 'common-error' },
    { content: 's is the TYPICAL prediction error in y-units — not a percentage and not r².', kind: 'gotcha' },
    { content: 'A high-leverage point that fits the trend may not be influential; influence is confirmed by refitting the line without it.', kind: 'edge-case' },
  ],
};
