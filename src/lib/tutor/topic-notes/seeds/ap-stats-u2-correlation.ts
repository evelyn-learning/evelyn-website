/**
 * AP Statistics — Unit 2 CED 2.5: Correlation.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.correlation.v1). Bullet-fragments consolidated into
 * formula/framework entries + an inline scatterplot with r, method humanized,
 * pointers enriched to the calibration standard (ap-stats-u1-*.ts).
 *
 * KaTeX note: inline math must not START with a digit (currency renderer),
 * so bounds are written `$-1 \le r \le 1$` / `$|r|$`, never `$0 \le ...$`.
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.correlation';

export const BASELINE_AP_STATS_CORRELATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.correlation.v1',
  course: 'AP Statistics',
  cedUnit: 2,
  cedTopic: '2.5',
  cedTitle: 'Correlation',
  planId: 'evelyn.ap.stats.correlation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.correlation.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'The correlation coefficient r',
      content:
        'The CORRELATION COEFFICIENT r measures the strength and direction of the LINEAR association between two quantitative variables: $r = \\dfrac{1}{n-1}\\sum \\left(\\dfrac{x_i-\\bar{x}}{s_x}\\right)\\!\\left(\\dfrac{y_i-\\bar{y}}{s_y}\\right)$ — the average product of the standardized x and y values. Always $-1 \\le r \\le 1$.',
      diagram: {
        type: 'scatterplot_regression',
        params: {
          title: 'Strong positive linear association, r = 0.85',
          xLabel: 'Hours studied',
          yLabel: 'Exam score',
          xMin: 0,
          xMax: 8,
          yMin: 40,
          yMax: 100,
          rValue: 0.85,
          regression: { slope: 6.2, intercept: 52 },
          points: [
            [1, 55], [1, 60], [2, 66], [2, 70], [3, 71], [3, 78],
            [4, 76], [4, 82], [5, 84], [5, 90], [6, 88], [6, 95], [7, 96],
          ],
        },
      },
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Reading the value of r',
      content:
        '$r = +1$ is a perfect increasing line and $r = -1$ a perfect decreasing line; $r = 0$ means no LINEAR association (a strong nonlinear pattern can still give $r \\approx 0$). As a rough scale: $|r| > 0.8$ strong, $0.5 < |r| \\le 0.8$ moderate, $|r| \\le 0.5$ weak. State the sign (direction) and the magnitude (strength) together, in context.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Properties of r',
      content:
        'r is **unit-free** (identical whether x is in inches or cm) and **symmetric** ($r_{xy}=r_{yx}$), so it does not depend on which variable is called explanatory. It is **sensitive to outliers** — one point can swing it dramatically — and it captures **only linear** association. Crucially, correlation is NOT causation: a large $|r|$ is equally consistent with a lurking variable. On the calculator, LinReg(a+bx) reports r with the regression line.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'correlation coefficient',
      content: 'r — a unit-free measure of the strength and direction of linear association, with $-1 \\le r \\le 1$.',
    },
  ],
  methods: [
    {
      title: 'Interpret a correlation coefficient in context',
      when_to_use:
        'When asked to interpret r (not r²) for two quantitative variables — a very common short-answer FRQ prompt.',
      steps: [
        'Read the SIGN of r to get the direction (positive or negative).',
        'Read the MAGNITUDE |r| to get the strength (strong / moderate / weak).',
        'State that r measures LINEAR association specifically.',
        'Write one context sentence combining direction + strength + the variable names.',
      ],
      example: {
        problem: 'A scatterplot of study hours vs exam score has $r = 0.85$. Interpret r in context.',
        solution:
          'There is a strong, positive, linear association between hours studied and exam score (r = 0.85): students who study more hours tend to score higher.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'r measures LINEAR association only, and always $-1 \\le r \\le 1$.', kind: 'tip' },
    { content: '$r \\approx 0$ does NOT mean "no relationship" — a strong curved pattern can have r near 0. Look at the scatterplot.', kind: 'common-error' },
    { content: 'r is unit-free and symmetric but very sensitive to outliers — one influential point can inflate or deflate it.', kind: 'gotcha' },
    { content: 'Correlation ≠ causation. A high |r| never by itself justifies a cause-and-effect claim (a lurking variable may drive both).', kind: 'edge-case' },
    { content: 'Interpreting r: name the DIRECTION and the STRENGTH and say "linear," in context — a value with no context earns no credit.', kind: 'frq-vocab' },
  ],
};
