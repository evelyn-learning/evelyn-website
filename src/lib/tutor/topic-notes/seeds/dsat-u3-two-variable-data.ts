/**
 * Digital SAT — Unit 3 CED 3.4: Two-Variable Data: Scatterplots & Lines of Best Fit.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.two-variable-data.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_TWO_VARIABLE_DATA: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.two-variable-data.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Two-Variable Data: Scatterplots & Lines of Best Fit',
  planId: 'evelyn.testprep.dsat.two-variable-data.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.two-variable-data.v1' }],
  theory: [
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Association', content: `ASSOCIATION — positive (as x increases, y increases), negative (as x increases, y decreases), or no association (random scatter). Read the axis labels FIRST — the SAT loves swapping which variable is x and which is y in the answer choices.` },
    { loId: 'dsat.two-variable-data', content: `LINE OF BEST FIT gives a linear MODEL: y = (slope)x + (intercept). SLOPE = predicted change in y per ONE-unit increase in x, in the stated units. Y-INTERCEPT = predicted y when x = 0.` },
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Predicting', content: `PREDICTING — plug the given x into the equation to predict y (or solve algebraically for x given a target y). This is the single most common two-variable-data question type on the digital SAT.` },
    { loId: 'dsat.two-variable-data', content: `RESIDUAL = actual value − predicted value (from the line). A point ABOVE the line has a POSITIVE residual (actual > predicted); a point BELOW the line has a NEGATIVE residual.` },
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Trap', content: `TRAP — EXTRAPOLATION. Predicting far outside the x-range the data actually covered assumes the same linear trend keeps holding, which real-world data often doesn't. Predictions WITHIN the observed range (interpolation) are more trustworthy than ones far outside it.` },
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Trap', content: `TRAP — CORRELATION ≠ CAUSATION. However tightly the points cluster around the line, the fitted line only describes an association. It never proves x causes y — a third (lurking) variable can drive both.` },
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Trap', content: `TRAP — SWAPPED INTERPRETATION. Wrong answer choices often flip which variable changes with which, or describe the y-intercept as if it were the slope. Restate the interpretation in the ORIGINAL context's units before matching to a choice.` },
    { loId: 'dsat.two-variable-data', kind: 'framework', title: 'Desmos', content: `DESMOS — pasting (x, y) data pairs into a Bluebook table and typing y₁ ~ a·x₁ + b returns the best-fit slope and intercept instantly; useful when a question gives a full data table instead of the equation directly.` },
    { loId: 'dsat.two-variable-data', kind: 'definition', title: 'line of best fit', content: 'a linear model, y = mx + b, that approximates the trend in scatterplot data.' },
    { loId: 'dsat.two-variable-data', kind: 'definition', title: 'residual', content: `actual value minus predicted value (from the line of best fit); positive means the point lies above the line.` },
    { loId: 'dsat.two-variable-data', kind: 'definition', title: 'extrapolation', content: `using a model to predict a value outside the range of x-values actually observed in the data — less reliable than interpolation.` },
    { loId: 'dsat.two-variable-data', kind: 'definition', title: 'association', content: `the pattern relating two variables in a scatterplot (positive, negative, or none) — not proof of causation.` },
  ],
  methods: [
    {
      title: 'Worked prediction',
      steps: [
        `The model is y = 3.2x + 45, where x = advertising spend (thousands of $) and y = predicted monthly sales (thousands of $).`,
        'Plug x = 10: y = 3.2(10) + 45 = 32 + 45.',
        'y = 77, so predicted sales are $77,000.',
      ],
      example: { problem: `A scatterplot plots a company's monthly advertising spending x (in thousands of dollars) against monthly sales y (in thousands of dollars) for 10 months. The line of best fit is y = 3.2x + 45. Based on this model, what is the predicted monthly sales when advertising spending is $10,000 (x = 10)?`, solution: '$77,000 (y = 77 thousand dollars)' },
      relatedLoIds: ['dsat.two-variable-data'],
    },
    {
      title: 'Worked extrapolation',
      steps: [
        `The model is y = 2.5x + 8, fit only from data at x = 1 through x = 12 (weeks 1–12).`,
        'Plug x = 30: y = 2.5(30) + 8 = 75 + 8 = 83, so the model predicts 83 cm.',
        `TRAP: week 30 is far outside the observed range (1–12) — this is EXTRAPOLATION. The linear trend that fit weeks 1–12 well is not guaranteed to hold that far out (plants often stop growing at a constant rate), so 83 cm is a far less trustworthy prediction than one made inside the data range.`,
      ],
      example: { problem: `A scatterplot tracks a plant's height y (in centimeters) versus the number of weeks since planting x, using data collected only for x = 1 through x = 12. The line of best fit is y = 2.5x + 8. A student uses the model to predict the height at week 30. What does the model predict, and why is this prediction much less trustworthy than a week-5 or week-10 prediction?`, solution: `83 cm predicted by the model, but unreliable — the prediction extrapolates far beyond the observed x-range (weeks 1–12).` },
      relatedLoIds: ['dsat.two-variable-data'],
    },
  ],
  pointers: [
    { content: `A line of best fit only describes an ASSOCIATION between x and y — it never establishes cause and effect, no matter how tightly the points cluster. A third factor (e.g., a student's baseline motivation or prior preparation) could drive BOTH more study hours and higher scores. The SAT tests this by asking which statement is best supported by the data and including a causal-claim choice as the trap.`, kind: 'common-error' },
    { content: `Line of best fit slope = predicted change in y per unit x; y-intercept = predicted y when x = 0 — match units and direction, don't swap x and y.`, kind: 'tip' },
    { content: `To predict, plug the given x (or y) into the fitted equation; residual = actual − predicted (positive means the point sits ABOVE the line).`, kind: 'tip' },
    { content: `Predictions far outside the data's observed x-range are EXTRAPOLATION and less reliable than predictions within the range (interpolation).`, kind: 'tip' },
    { content: `A line of best fit shows ASSOCIATION, never CAUSATION — a lurking variable can drive both quantities.`, kind: 'tip' },
    { content: `Watch for units hidden in the axis label: "x = spending, in thousands of dollars" means $10,000 → plug in x = 10, not 10000. Answer choices include both the raw-number and the scaled version. Convert once at the start and once at the end.`, kind: 'gotcha' },
    { content: `"How many more/fewer than predicted?" is a residual question in disguise. Compute predicted from the line, subtract from the actual data point (or read the vertical gap on the graph) — don't just report the actual value.`, kind: 'vocab-note' },
    { content: `Some questions ask you to read a point off the SCATTERPLOT, others off the LINE. "According to the line of best fit" = use the line; "of the data points shown" or "one of the 12 cities" = use an actual plotted dot. Circle which one the stem names.`, kind: 'gotcha' },
    { content: `Negative slope still means "increases by 1 unit of x." For y = −1.8x + 24, the correct interpretation is "each additional year, predicted value DECREASES by 1.8 thousand dollars" — not "increases by −1.8" and not "decreases by 1.8 each 1.8 years."`, kind: 'common-error' },
    { content: `Y-intercept interpretation must say "when x = 0," in x's units: for y = 4.5x − 120, it's predicted cones at 0°F — and a negative intercept can be meaningless in context. If a choice calls the intercept a rate of change, it's the swapped-interpretation trap.`, kind: 'common-error' },
    { content: `"Which conclusion is best supported by the data?" — eliminate any choice with causal verbs (causes, leads to, results in, because of) and any that generalizes beyond the sampled group. Association language ("is associated with," "tend to") survives.`, kind: 'tip' },
    { content: `Given a target y, don't guess-and-check — solve algebraically. y = 3.2x + 45 with y = 109 → x = 20. If the resulting x lies outside the plotted x-range, expect an accompanying "is this reliable?" question about extrapolation.`, kind: 'edge-case' },
    { content: `Don't confuse the line of best fit with an exponential-growth model from the same unit. If the scatterplot curves and choices mention percent change per unit, it's not a linear fit — linear slope is a CONSTANT amount added, never a percentage.`, kind: 'gotcha' },
  ],
};
