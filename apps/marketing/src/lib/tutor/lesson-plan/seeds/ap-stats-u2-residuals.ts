/**
 * AP Statistics — CED Unit 2.7+2.9: Residuals and Departures from
 * Linearity.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_RESIDUALS: LessonPlan = {
  id: 'evelyn.ap.stats.residuals.v1', title: 'U2.7 Residuals and Residual Plots',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.residuals', description: 'Compute residuals (y − ŷ). Construct and interpret residual plots to assess whether a linear model is appropriate. Identify departures from linearity, influential points, and high-leverage points.', standard: 'AP-STATS-2.7-2.9' }],
  prerequisites: ['apstats.linear-regression'], followUps: [], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame residuals as how wrong the line is.', script: "Every prediction has error. RESIDUAL = actual − predicted = y − ŷ. The pattern of residuals tells us whether a LINEAR model is appropriate.", estimatedMinutes: 2 },
    { id: 'concept-residuals', kind: 'concept', goal: 'Cover residuals + residual plots + influential points.',
      keyIdeas: [
        'RESIDUAL: residual = y − ŷ (actual minus predicted).',
        '  • POSITIVE residual: actual is ABOVE the line — model UNDERPREDICTED.',
        '  • NEGATIVE residual: actual is BELOW the line — model OVERPREDICTED.',
        '  • Sum of residuals from the LSRL is always 0.',
        'RESIDUAL PLOT: scatterplot of (x, residual) — same x as original scatterplot but residual on the y-axis.',
        'INTERPRETING the residual plot:',
        '  • RANDOM SCATTER (no pattern) → linear model is APPROPRIATE.',
        '  • CURVED PATTERN (U-shape, S-shape) → linear model is NOT appropriate; data has curvature.',
        '  • FUNNEL SHAPE (variance increasing or decreasing across x) → constant-variance assumption fails; consider transformation.',
        'STANDARD DEVIATION OF RESIDUALS s: typical size of a residual. Tells how far actual y values typically fall from the line.',
        '  • s = √(Σ residuals² / (n − 2)).',
        '  • Interpretation: "Predictions using this model are typically off by about [s] [units of y]."',
        'INFLUENTIAL POINTS: removing them dramatically changes the regression line. Often points with EXTREME x AND that don\'t fit the trend.',
        'HIGH-LEVERAGE POINT: extreme x value (far from x̄). May or may not be influential — depends on whether it fits the line.',
        'OUTLIER (in regression): point with a LARGE RESIDUAL — far from the line vertically.',
      ],
      vocabulary: [
        { term: 'residual', definition: 'y − ŷ — actual y minus predicted y.' },
        { term: 'influential point', definition: 'a data point whose removal substantially changes the regression line.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-residual', kind: 'worked_example',
      problem: 'A regression gives ŷ = 5 + 2x. The point (3, 14) is in the data. (a) Compute the predicted value and residual. (b) Interpret.',
      steps: [
        '(a) ŷ = 5 + 2(3) = 11. Residual = y − ŷ = 14 − 11 = 3.',
        '(b) The residual is +3. Actual y (14) is ABOVE the predicted (11). The model underpredicted by 3 units.',
      ],
      answer: 'Predicted = 11. Residual = +3 (actual exceeds prediction).', estimatedMinutes: 3 },
    { id: 'try-pattern', kind: 'try_yourself',
      problem: 'A residual plot of x vs residuals shows a clear U-SHAPE (negative residuals in the middle, positive at both ends). What does this tell you?',
      expectedAnswer: 'The U-shape indicates a CURVED relationship between x and y. The linear model is NOT appropriate; the data has nonlinear (likely quadratic) structure that the line fails to capture. Consider a transformation (log, square, etc.) or a quadratic model.',
      responseFormat: 'free', hints: ['Pattern in residuals = unmodeled structure.'], estimatedMinutes: 3 },
    { id: 'try-influential', kind: 'try_yourself',
      problem: 'A scatterplot has 20 points clustered tightly around an upward line, plus one point far to the right at high x but low y (clearly off the trend). (a) Is this point an outlier (in residual sense), influential, high-leverage, or all three? (b) What happens to the slope if we remove the point?',
      expectedAnswer: '(a) High-leverage (extreme x, far from x̄). Outlier (large residual — y is far below the line at that x). Influential (because both — removing it would change the line). All three. (b) Slope would INCREASE (become steeper, more positive) since the offending point\'s low y was pulling the right end of the line down.',
      responseFormat: 'free', hints: ['Influential = removal changes line. Leverage = extreme x.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A regression of y on x gives ŷ = 12 + 3x with s = 4 (SD of residuals). (a) For an observed point (x = 5, y = 30), find residual. (b) Interpret s in context. (c) The residual plot has random scatter. What does this tell you about the model?',
      expectedAnswer: '(a) ŷ = 12 + 3(5) = 27. Residual = 30 − 27 = +3. (1.5)\n(b) "Predictions of y using this regression are typically off by about 4 units (in whatever units y is measured)." (1.5)\n(c) Random scatter in the residual plot indicates that the LINEAR MODEL IS APPROPRIATE for these data. There\'s no unmodeled curvature or pattern. (2)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Compute residual; describe s; interpret residual plot.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Residual = y − ŷ. Sum of residuals from LSRL = 0.',
      'Residual plot: random scatter = linear OK; pattern = linear not appropriate.',
      's = typical prediction error.',
      'Influential = removal changes line. Leverage = extreme x. Outlier (regression) = large residual.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2.7-2.9', cedTitle: 'Residuals', sources: [{ type: 'concept', book: 'tps5e', chapter: '3', note: 'Standard residual analysis.' }] },
};
