/**
 * AP Statistics — Unit 2 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u2-frq-practice.v1', title: 'U2 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u2-frq-practice', description: 'Apply Unit 2 two-variable techniques: scatterplots, correlation, regression, residuals.', standard: 'AP-STATS-2-FRQ' }],
  prerequisites: ['apstats.residuals'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 2 FRQs combining scatterplots, regression interpretation, and residual analysis. AP graders look for context, complete interpretations, and proper claims about linearity.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'DUFS for scatterplots; r for linear strength.',
      'b = r·s_y/s_x. a = ȳ − b·x̄. Line through (x̄, ȳ).',
      'Slope and intercept interpretation in context.',
      'Residuals + residual plot for model adequacy.',
      'Avoid extrapolation; correlation ≠ causation.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-regression', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Regression Interpretation. A regression of fuel consumption (y, gallons/100 miles) on car weight (x, thousands of lbs) gives ŷ = 0.5 + 1.2x with r = 0.88, s = 0.4. The data covers cars from 2.0 to 4.5 thousand lbs. (a) Interpret the slope. (b) Interpret r². (c) Predict fuel consumption for a 3.0-thousand-lb car. (d) Why might predicting for a 5.5-thousand-lb truck be unreliable?',
      expectedAnswer: '(a) "For each additional thousand pounds of car weight, predicted fuel consumption INCREASES by 1.2 gallons per 100 miles." (1.5)\n(b) r² = 0.88² = 0.7744. "About 77.4% of the variation in fuel consumption is explained by the linear regression on car weight." (1.5)\n(c) ŷ = 0.5 + 1.2(3.0) = 0.5 + 3.6 = 4.1 gallons per 100 miles. (1)\n(d) 5.5 thousand lbs is OUTSIDE the observed data range (2.0 to 4.5). This would be EXTRAPOLATION; the linear pattern may not hold for trucks heavier than any car in the dataset. (2)\nTotal: 6 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 1.5, scoringCriteria: 'States that predicted fuel consumption increases by 1.2 gallons per 100 miles for each additional thousand pounds of car weight (correct slope value, direction, and both variables in context).', modelResponse: 'For each additional thousand pounds of car weight, predicted fuel consumption INCREASES by 1.2 gallons per 100 miles.' },
        { criterionId: 'b', maxPoints: 1.5, scoringCriteria: 'Computes r² = 0.88² = 0.7744 and interprets it as the percent of variation in fuel consumption explained by the linear regression on car weight.', modelResponse: 'r² = 0.88² = 0.7744. About 77.4% of the variation in fuel consumption is explained by the linear regression on car weight.' },
        { criterionId: 'c', maxPoints: 1, scoringCriteria: 'Substitutes x = 3.0 into the regression equation and reports the correct predicted value.', modelResponse: 'ŷ = 0.5 + 1.2(3.0) = 0.5 + 3.6 = 4.1 gallons per 100 miles.' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Identifies that 5.5 thousand lbs falls outside the observed x range (2.0 to 4.5), names this extrapolation, and notes the linear pattern may not hold beyond the data.', modelResponse: '5.5 thousand lbs is OUTSIDE the observed data range (2.0 to 4.5). This would be EXTRAPOLATION; the linear pattern may not hold for trucks heavier than any car in the dataset.' },
      ] },
      responseFormat: 'frq', hints: ['Slope in context; r² as %; check x range.'], estimatedMinutes: 6 },
    { id: 'try-frq-residual', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Residual Analysis. A regression of plant height (y, cm) on days since planting (x) gives ŷ = 5 + 1.5x. The residual plot for x = 1 to x = 30 shows a clear PARABOLIC (U-shaped) pattern: residuals are positive at low x, negative around x = 15, positive again at high x. (a) Compute the residual for an observed point (x = 10, y = 25). (b) What does the U-shaped residual plot tell you about whether the linear model is appropriate? (c) Suggest a remedy.',
      expectedAnswer: '(a) ŷ = 5 + 1.5(10) = 20. Residual = 25 − 20 = +5. (1.5)\n(b) The U-shaped pattern means the linear model is NOT APPROPRIATE. The data has CURVATURE that the line fails to capture. The line UNDERPREDICTS at the extremes (low and high x) and OVERPREDICTS in the middle. (2.5)\n(c) Try a NONLINEAR model — e.g., a quadratic regression (ŷ = a + bx + cx²) or a transformation like ln(y) on x, depending on the curvature direction. Re-examining the residual plot for the new model should show random scatter. (2)\nTotal: 6 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 1.5, scoringCriteria: 'Computes ŷ at x = 10 and subtracts it from the observed y = 25 to get the correct signed residual.', modelResponse: 'ŷ = 5 + 1.5(10) = 20. Residual = 25 − 20 = +5.' },
        { criterionId: 'b', maxPoints: 2.5, scoringCriteria: 'States the linear model is not appropriate because of curvature the line fails to capture, and describes the under/over-prediction pattern (underpredicts at the extremes, overpredicts in the middle).', modelResponse: 'The U-shaped pattern means the linear model is NOT APPROPRIATE. The data has CURVATURE that the line fails to capture. The line UNDERPREDICTS at the extremes (low and high x) and OVERPREDICTS in the middle.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Recommends a nonlinear remedy (e.g., quadratic regression or a transformation) and notes the residual plot should be re-examined for random scatter.', modelResponse: 'Try a NONLINEAR model — e.g., a quadratic regression (ŷ = a + bx + cx²) or a transformation like ln(y) on x, depending on the curvature direction. Re-examining the residual plot for the new model should show random scatter.' },
      ] },
      responseFormat: 'frq', hints: ['Compute residual; recognize pattern; recommend transformation.'], estimatedMinutes: 6 },
    { id: 'try-frq-association', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Two-Variable Synthesis. A scatterplot of advertising budget (x, $1000s) vs sales (y, $1000s) for 30 stores shows: \n• Mostly linear, positive trend \n• r = 0.78 \n• Mean budget x̄ = 50, s_x = 15. Mean sales ȳ = 200, s_y = 40. \n• One store at (120, 250) is far to the right of all others. \n(a) Find the LSRL. (b) The store at (120, 250) — is it likely an influential point? Explain. (c) Use your equation to predict sales for a store with budget = $40k. (d) State a reasonable interpretation of r in context.',
      expectedAnswer: '(a) b = r·s_y/s_x = 0.78·(40/15) = 0.78·2.667 ≈ 2.08. a = ȳ − b·x̄ = 200 − 2.08(50) = 200 − 104 = 96. ŷ = 96 + 2.08x. (3)\n(b) The store at (120, 250) has VERY HIGH x (120 vs typical mean of 50, several SDs above the rest). It is HIGH-LEVERAGE. Whether it\'s INFLUENTIAL depends on whether it fits the trend. Plug into LSRL: ŷ at x=120 is 96 + 2.08(120) = 96 + 249.6 ≈ 346 — well above the actual 250. So this point has a LARGE NEGATIVE RESIDUAL (250 − 346 = -96) AND extreme x. It IS likely influential — its presence pulls the slope down. (3)\n(c) ŷ = 96 + 2.08(40) = 96 + 83.2 = 179.2. Predicted sales ≈ $179.2k. (1)\n(d) "There is a moderately strong, positive linear association between advertising budget and sales (r = 0.78). Stores with larger ad budgets tend to have higher sales." (1.5)\nTotal: 8.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Correctly computes the slope b = r·s_y/s_x and intercept a = ȳ − b·x̄, then states the full LSRL equation.', modelResponse: 'b = r·s_y/s_x = 0.78·(40/15) = 0.78·2.667 ≈ 2.08. a = ȳ − b·x̄ = 200 − 2.08(50) = 200 − 104 = 96. ŷ = 96 + 2.08x.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Identifies the point as high-leverage due to its extreme x, checks it against the LSRL to find a large negative residual, and concludes it is likely influential because it pulls the slope down.', modelResponse: 'The store at (120, 250) has VERY HIGH x (120 vs typical mean of 50, several SDs above the rest). It is HIGH-LEVERAGE. Whether it\'s INFLUENTIAL depends on whether it fits the trend. Plug into LSRL: ŷ at x=120 is 96 + 2.08(120) = 96 + 249.6 ≈ 346 — well above the actual 250. So this point has a LARGE NEGATIVE RESIDUAL (250 − 346 = -96) AND extreme x. It IS likely influential — its presence pulls the slope down.' },
        { criterionId: 'c', maxPoints: 1, scoringCriteria: 'Substitutes x = 40 into the fitted LSRL and reports the correct predicted sales value.', modelResponse: 'ŷ = 96 + 2.08(40) = 96 + 83.2 = 179.2. Predicted sales ≈ $179.2k.' },
        { criterionId: 'd', maxPoints: 1.5, scoringCriteria: 'States a contextual interpretation of r = 0.78 as a moderately strong, positive linear association between the two named variables.', modelResponse: 'There is a moderately strong, positive linear association between advertising budget and sales (r = 0.78). Stores with larger ad budgets tend to have higher sales.' },
      ] },
      responseFormat: 'frq', hints: ['LSRL formulas; check leverage and residual; predict; interpret.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Slope and r² interpretation in CONTEXT.',
      'Residual pattern → model adequacy.',
      'Influential = high leverage + off the trend.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2-FRQ', cedTitle: 'Unit 2 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-2 FRQs.' }] },
};
