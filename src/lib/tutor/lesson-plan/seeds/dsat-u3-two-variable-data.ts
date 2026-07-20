/**
 * Digital SAT — Math / Problem-Solving and Data Analysis: Two-Variable Data
 * (Scatterplots & Lines of Best Fit).
 *
 * A recurring PSDA pattern: the SAT gives a fitted line's equation (or a
 * described scatterplot) and asks you to predict a value, interpret slope /
 * intercept in context, or reason about a residual. The arithmetic is a
 * simple plug-in — the traps are all about reading direction, units, range,
 * and not overclaiming causation. Desmos is allowed on every math question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_TWO_VARIABLE_DATA: LessonPlan = {
  id: 'evelyn.testprep.dsat.two-variable-data.v1',
  title: 'Two-Variable Data: Scatterplots & Lines of Best Fit',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.two-variable-data',
      standard: 'DSAT-3.4',
      description:
        'Interpret scatterplots and lines of best fit for two-variable data: describe association, use the fitted line\'s equation to predict values and interpret slope and intercept in context, and evaluate residuals and the reliability of extrapolated predictions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame two-variable data / scatterplot questions as a small but near-guaranteed slice of PSDA — pure equation plug-in once the reading traps are known.',
      script:
        'Problem-Solving and Data Analysis is about 15 percent of Digital SAT Math — 5 to 7 of the 44 questions — and two-variable data questions (scatterplots and lines of best fit) are one of the most frequent patterns inside that domain, showing up on nearly every test. The math itself is just plugging a number into y = mx + b. The SAT\'s traps are all about correctly reading direction, units, range, and not overclaiming what the data proves.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scatterplots',
      kind: 'concept',
      goal: 'Reading scatterplots and lines of best fit: association, slope/intercept interpretation, prediction, residuals, and the extrapolation + causation traps.',
      keyIdeas: [
        'ASSOCIATION — positive (as x increases, y increases), negative (as x increases, y decreases), or no association (random scatter). Read the axis labels FIRST — the SAT loves swapping which variable is x and which is y in the answer choices.',
        'LINE OF BEST FIT gives a linear MODEL: y = (slope)x + (intercept). SLOPE = predicted change in y per ONE-unit increase in x, in the stated units. Y-INTERCEPT = predicted y when x = 0.',
        'PREDICTING — plug the given x into the equation to predict y (or solve algebraically for x given a target y). This is the single most common two-variable-data question type on the digital SAT.',
        'RESIDUAL = actual value − predicted value (from the line). A point ABOVE the line has a POSITIVE residual (actual > predicted); a point BELOW the line has a NEGATIVE residual.',
        'TRAP — EXTRAPOLATION. Predicting far outside the x-range the data actually covered assumes the same linear trend keeps holding, which real-world data often doesn\'t. Predictions WITHIN the observed range (interpolation) are more trustworthy than ones far outside it.',
        'TRAP — CORRELATION ≠ CAUSATION. However tightly the points cluster around the line, the fitted line only describes an association. It never proves x causes y — a third (lurking) variable can drive both.',
        'TRAP — SWAPPED INTERPRETATION. Wrong answer choices often flip which variable changes with which, or describe the y-intercept as if it were the slope. Restate the interpretation in the ORIGINAL context\'s units before matching to a choice.',
        'DESMOS — pasting (x, y) data pairs into a Bluebook table and typing y₁ ~ a·x₁ + b returns the best-fit slope and intercept instantly; useful when a question gives a full data table instead of the equation directly.',
      ],
      vocabulary: [
        { term: 'line of best fit', definition: 'a linear model, y = mx + b, that approximates the trend in scatterplot data.' },
        { term: 'residual', definition: 'actual value minus predicted value (from the line of best fit); positive means the point lies above the line.' },
        { term: 'extrapolation', definition: 'using a model to predict a value outside the range of x-values actually observed in the data — less reliable than interpolation.' },
        { term: 'association', definition: 'the pattern relating two variables in a scatterplot (positive, negative, or none) — not proof of causation.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-prediction',
      kind: 'worked_example',
      problem:
        'A scatterplot plots a company\'s monthly advertising spending x (in thousands of dollars) against monthly sales y (in thousands of dollars) for 10 months. The line of best fit is y = 3.2x + 45. Based on this model, what is the predicted monthly sales when advertising spending is $10,000 (x = 10)?',
      steps: [
        'The model is y = 3.2x + 45, where x = advertising spend (thousands of $) and y = predicted monthly sales (thousands of $).',
        'Plug x = 10: y = 3.2(10) + 45 = 32 + 45.',
        'y = 77, so predicted sales are $77,000.',
      ],
      answer: '$77,000 (y = 77 thousand dollars)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extrapolation',
      kind: 'worked_example',
      problem:
        'A scatterplot tracks a plant\'s height y (in centimeters) versus the number of weeks since planting x, using data collected only for x = 1 through x = 12. The line of best fit is y = 2.5x + 8. A student uses the model to predict the height at week 30. What does the model predict, and why is this prediction much less trustworthy than a week-5 or week-10 prediction?',
      steps: [
        'The model is y = 2.5x + 8, fit only from data at x = 1 through x = 12 (weeks 1–12).',
        'Plug x = 30: y = 2.5(30) + 8 = 75 + 8 = 83, so the model predicts 83 cm.',
        'TRAP: week 30 is far outside the observed range (1–12) — this is EXTRAPOLATION. The linear trend that fit weeks 1–12 well is not guaranteed to hold that far out (plants often stop growing at a constant rate), so 83 cm is a far less trustworthy prediction than one made inside the data range.',
      ],
      answer: '83 cm predicted by the model, but unreliable — the prediction extrapolates far beyond the observed x-range (weeks 1–12).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-interpretation',
      kind: 'try_yourself',
      problem:
        'A researcher records the outside temperature x (in degrees Fahrenheit) and the number of ice cream cones sold y at a shop for 15 days. The line of best fit is y = 4.5x − 120. Which of the following best interprets the slope in this context?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For each additional cone sold, the temperature increases by 4.5 degrees.' },
        { id: 'b', text: 'For each 1-degree increase in temperature, the predicted number of cones sold increases by 4.5.', correct: true },
        { id: 'c', text: 'When the temperature is 0°F, the shop is predicted to sell 4.5 cones.' },
        { id: 'd', text: 'The shop sells an average of 4.5 cones per day, regardless of temperature.' },
      ],
      expectedAnswer: 'For each 1-degree increase in temperature, the predicted number of cones sold increases by 4.5.',
      hints: [
        'Identify which variable is x (temperature) and which is y (cones sold) before reading the choices.',
        'Slope = predicted change in y per one-unit increase in x — here, per 1°F.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-residual',
      kind: 'try_yourself',
      problem:
        'Using the line of best fit y = 4.5x − 120 from the ice cream sales data, actual sales on a day when the temperature was 80°F were 250 cones. What is the residual (actual − predicted) for this day?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-10' },
        { id: 'b', text: '10', correct: true },
        { id: 'c', text: '240' },
        { id: 'd', text: '250' },
      ],
      expectedAnswer: '10',
      hints: [
        'First find the predicted value: plug x = 80 into y = 4.5x − 120.',
        'Residual = actual − predicted, not predicted − actual.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): A scatterplot relates a car\'s age x (in years) to its resale value y (in thousands of dollars). The line of best fit is y = −1.8x + 24. Based on this model, what is the predicted resale value, in thousands of dollars, of a 5-year-old car?',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: ['Plug x = 5 into y = −1.8x + 24.', '−1.8 × 5 = −9; then 24 − 9 = 15.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-causation',
      kind: 'misconception_check',
      question:
        'A scatterplot of study hours (x) versus exam score (y) has a line of best fit y = 6x + 50, and the points cluster tightly around the line. A student concludes that studying more hours CAUSES a higher exam score. What\'s wrong with this conclusion?',
      commonErrors: [
        {
          answer: 'Studying causes higher scores — that\'s clearly what the tight line shows.',
          misconception: 'Treating a strong correlation (tight linear association) as proof of causation.',
          correctsTo:
            'A line of best fit only describes an ASSOCIATION between x and y — it never establishes cause and effect, no matter how tightly the points cluster. A third factor (e.g., a student\'s baseline motivation or prior preparation) could drive BOTH more study hours and higher scores. The SAT tests this by asking which statement is best supported by the data and including a causal-claim choice as the trap.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Line of best fit slope = predicted change in y per unit x; y-intercept = predicted y when x = 0 — match units and direction, don\'t swap x and y.',
        'To predict, plug the given x (or y) into the fitted equation; residual = actual − predicted (positive means the point sits ABOVE the line).',
        'Predictions far outside the data\'s observed x-range are EXTRAPOLATION and less reliable than predictions within the range (interpolation).',
        'A line of best fit shows ASSOCIATION, never CAUSATION — a lurking variable can drive both quantities.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Two-Variable Data: Scatterplots & Lines of Best Fit' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
