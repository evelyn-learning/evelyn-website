/**
 * AP Statistics — Unit 2 CED 2.4: Scatterplots.
 *
 * Hand-curated from the auto-extracted draft (source plan
 * evelyn.ap.stats.scatterplots.v1). DUFS bullet-fragments consolidated into a
 * single framework entry + an inline scatterplot, method humanized, pointers
 * enriched to the calibration standard (ap-stats-u1-*.ts).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apstats.scatterplots';

export const BASELINE_AP_STATS_SCATTERPLOTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.stats.scatterplots.v1',
  course: 'AP Statistics',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Scatterplots',
  planId: 'evelyn.ap.stats.scatterplots.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-01',
  sources: [{ type: 'plan', planId: 'evelyn.ap.stats.scatterplots.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Explanatory vs response; one point per individual',
      content:
        'A SCATTERPLOT displays two quantitative variables measured on the same individuals. The EXPLANATORY variable (predictor) goes on the x-axis; the RESPONSE variable goes on the y-axis — x is what we use to predict or explain y. Each plotted point is a single individual at its $(x, y)$ pair.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'DUFS — describing a scatterplot',
      content:
        'Describe every scatterplot with four features, ALWAYS in context: **Direction** — positive (y rises with x), negative (y falls), or none. **Unusual features** — outliers, clusters, gaps. **Form** — linear, curved, or none. **Strength** — strong (points hug the pattern), moderate, or weak (lots of scatter). Direction is about the trend’s sign; Form is about its shape — a curve can be increasing AND nonlinear, so these are independent.',
      diagram: {
        type: 'scatterplot_regression',
        params: {
          title: 'Positive, linear, moderately strong — with one outlier',
          xLabel: 'Hours studied',
          yLabel: 'Exam score',
          xMin: 0,
          xMax: 9,
          yMin: 40,
          yMax: 100,
          points: [
            [1, 55], [1, 62], [2, 60], [2, 71], [3, 68], [3, 74],
            [4, 78], [4, 72], [5, 83], [5, 88], [6, 90], [6, 85],
            [8, 50, 'outlier'],
          ],
          highlightPoint: { x: 8, y: 50, label: 'outlier' },
        },
      },
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'explanatory variable',
      content: 'the predictor (independent) variable, plotted on the x-axis.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'response variable',
      content: 'the outcome being predicted or explained, plotted on the y-axis.',
    },
  ],
  methods: [
    {
      title: 'Describe a scatterplot with DUFS',
      when_to_use:
        'Any FRQ that shows a scatterplot and asks you to "describe the relationship" between two quantitative variables.',
      steps: [
        'Name the variables and identify explanatory (x) vs response (y).',
        'DIRECTION: state positive, negative, or none.',
        'UNUSUAL FEATURES: call out any outliers, clusters, or gaps with their approximate coordinates.',
        'FORM: state linear, curved, or none.',
        'STRENGTH: state strong, moderate, or weak.',
        'Write one sentence tying direction + form + strength together, in context, then note the unusual feature separately.',
      ],
      example: {
        problem:
          'A scatterplot shows hours studied (x) vs exam score (y) for 30 students: a roughly straight, upward, fairly tight cloud, except one student who studied 8 hours but scored 50. Describe it.',
        solution:
          'There is a moderately strong, positive, linear relationship between hours studied and exam score — students who study more tend to score higher. One outlier at about (8, 50) studied a lot yet scored low and does not fit the pattern.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    { content: 'DUFS: Direction, Unusual features, Form, Strength — and always tie it to the CONTEXT of the variables.', kind: 'tip' },
    { content: 'Direction (positive/negative/none) ≠ Form (linear/curved/none). A curve can be increasing yet nonlinear.', kind: 'common-error' },
    { content: 'Explanatory (x) predicts response (y); swapping the axes is a context error graders penalize.', kind: 'frq-vocab' },
    { content: 'Missing any one of the four DUFS pieces, or describing shape without context, typically costs a point on the AP rubric.', kind: 'gotcha' },
    { content: 'A scatterplot needs TWO quantitative variables — a categorical x belongs in a bar chart, not a scatterplot.', kind: 'edge-case' },
  ],
};
