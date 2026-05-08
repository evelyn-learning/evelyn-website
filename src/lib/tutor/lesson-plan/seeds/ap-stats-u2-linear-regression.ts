/**
 * AP Statistics — CED Unit 2.6+2.8: Linear Regression Models and Least
 * Squares Regression.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_LINEAR_REGRESSION: LessonPlan = {
  id: 'evelyn.ap.stats.linear-regression.v1', title: 'U2.6 Least Squares Regression',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.linear-regression', description: 'Construct, interpret, and apply the least-squares regression line ŷ = a + bx. Interpret slope and intercept in context. Use ŷ = ȳ + r(s_y/s_x)(x − x̄). Avoid extrapolation.', standard: 'AP-STATS-2.6-2.8' }],
  prerequisites: ['apstats.correlation'], followUps: ['apstats.residuals'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame regression as the prediction line.', script: "When two variables are linearly related, we draw the LEAST SQUARES regression line — the line that minimizes the sum of squared vertical distances from points. This line predicts y from x.", estimatedMinutes: 2 },
    { id: 'concept-regression', kind: 'concept', goal: 'Cover regression equation, slope, intercept, predictions.',
      keyIdeas: [
        'REGRESSION EQUATION: ŷ = a + bx (some books: ŷ = b₀ + b₁x). The hat means PREDICTED.',
        'SLOPE b: predicted CHANGE in y per UNIT increase in x.',
        '  • Formula: b = r · (s_y / s_x).',
        '  • Interpretation in context: "For each additional [unit of x], the predicted [y] INCREASES (or decreases) by [b] [units of y]."',
        'INTERCEPT a: predicted y when x = 0. Often not meaningful in context (e.g., x = 0 hours of study).',
        '  • Formula: a = ȳ − b·x̄. So the line ALWAYS passes through (x̄, ȳ).',
        'POINT-SLOPE FORM: ŷ − ȳ = b(x − x̄). Equivalent to ŷ = a + bx.',
        'PREDICTION: plug an x value into the regression equation to get ŷ.',
        'EXTRAPOLATION: predicting y for an x value OUTSIDE the range of observed x values. AVOID — the linear pattern may not hold.',
        'COEFFICIENT OF DETERMINATION r²: proportion of variation in y explained by the linear regression on x. 0 ≤ r² ≤ 1. Interpret as a percentage.',
        '  • Example: r² = 0.72 → "72% of the variation in y is explained by the linear regression on x."',
      ],
      vocabulary: [
        { term: 'least squares regression line', definition: 'the line ŷ = a + bx minimizing Σ(y_i − ŷ_i)².' },
        { term: 'extrapolation', definition: 'predicting outside the observed x range — risky.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-line', kind: 'worked_example',
      problem: 'A regression of weight (y, kg) on height (x, cm) for adult men gives ŷ = -85 + 0.95x with r = 0.85. (a) Interpret the slope. (b) Interpret the intercept (and why it might not be meaningful). (c) Predict weight for someone 175 cm tall. (d) Compute and interpret r².',
      steps: [
        '(a) Slope b = 0.95: "For each additional cm of height, predicted weight increases by 0.95 kg."',
        '(b) Intercept a = -85 kg: "For someone 0 cm tall (impossible), the predicted weight would be -85 kg." Not meaningful — extrapolation outside human heights.',
        '(c) Predict at x = 175: ŷ = -85 + 0.95(175) = -85 + 166.25 = 81.25 kg.',
        '(d) r² = (0.85)² = 0.7225. About 72.25% of the variation in weight is explained by the linear regression on height.',
      ],
      answer: 'Slope: +0.95 kg per cm. Intercept: -85 kg (not meaningful). Predicted weight at 175 cm: 81.25 kg. r² = 0.7225 (72%).', estimatedMinutes: 5 },
    { id: 'try-slope-intercept', kind: 'try_yourself',
      problem: 'Regression equation for car age (x, years) vs resale value (y, $1000s): ŷ = 25 − 1.8x. (a) Interpret the slope. (b) Interpret the intercept. (c) Predict resale value at age 5.',
      expectedAnswer: '(a) "For each additional year of age, predicted resale value DECREASES by $1,800." (Slope is negative.) (b) "A brand-new car (x = 0) has predicted resale value $25,000." (c) ŷ = 25 − 1.8(5) = 25 − 9 = 16. Predicted resale value: $16,000.',
      responseFormat: 'numeric', hints: ['Slope sign, intercept meaning, plug-in.'], estimatedMinutes: 3 },
    { id: 'try-extrapolation', kind: 'try_yourself',
      problem: 'A regression of cricket chirps per minute (x) on temperature (y, °F) was built from data with x ranging from 60 to 200. The equation is ŷ = 25 + 0.25x. (a) Predict the temperature when chirps = 100. (b) Predict when chirps = 400. Which prediction is risky?',
      expectedAnswer: '(a) ŷ = 25 + 0.25(100) = 50°F. Within data range; reasonable. (b) ŷ = 25 + 0.25(400) = 125°F. EXTRAPOLATION (400 > 200) — risky. The linear pattern may not extend to such high chirp rates.',
      responseFormat: 'numeric', hints: ['Check whether x is in the observed range.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. Data on student GPA (x) and starting salary (y, $1000s) gives x̄ = 3.0, s_x = 0.4, ȳ = 50, s_y = 12, r = 0.6. (a) Find the regression equation. (b) Compute r² and interpret. (c) Predict salary for GPA = 3.5.',
      expectedAnswer: '(a) Slope b = r·s_y/s_x = 0.6·(12/0.4) = 0.6·30 = 18. Intercept a = ȳ − b·x̄ = 50 − 18(3.0) = 50 − 54 = -4. Equation: ŷ = -4 + 18x. (3)\n(b) r² = (0.6)² = 0.36. About 36% of the variation in starting salary is explained by the linear regression on GPA. (1.5)\n(c) ŷ = -4 + 18(3.5) = -4 + 63 = 59. Predicted salary: $59,000. (1.5)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Use b = r·s_y/s_x; a = ȳ − b·x̄.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'b = r · (s_y / s_x). a = ȳ − b·x̄.',
      'Line ALWAYS passes through (x̄, ȳ).',
      'Slope = predicted change in y per unit change in x — interpret IN CONTEXT.',
      'r² = proportion of variation in y explained by linear regression.',
      'Avoid extrapolation.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2.6-2.8', cedTitle: 'Linear Regression', sources: [{ type: 'concept', book: 'tps5e', chapter: '3', note: 'Standard least-squares regression.' }] },
};
