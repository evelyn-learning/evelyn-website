/**
 * Algebra 1 — Data & Statistics: Scatterplots, Trend Lines & Correlation.
 *
 * Where linear equations meet real, messy data (CCSS S-ID.B.6, S-ID.C.7–9):
 * describe the association, draw a trend line through the cloud, read its
 * slope and intercept as sentences about the situation, predict with it —
 * and know when the prediction (or the causal story) is not trustworthy.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U10_SCATTERPLOTS_TREND_LINES: LessonPlan = {
  id: 'evelyn.hs.alg1.scatterplots-trend-lines.v1',
  title: 'Scatterplots, Trend Lines & Correlation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.scatterplots-trend-lines',
      standard: 'ALG1-10.2',
      description:
        'Describe the direction and strength of the association in a scatterplot, fit a trend line and find its equation, interpret its slope and intercept in context, use it to predict, and distinguish correlation from causation (CCSS S-ID.B.6, S-ID.C.7, S-ID.C.8, S-ID.C.9).',
    },
  ],
  prerequisites: ['alg1.one-variable-statistics'],
  followUps: ['alg1.sequences'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the trend line as the moment y = mx + b stops being homework and starts describing the real world.',
      script:
        'Real data never lands on a perfect line. Plot temperature against iced-coffee sales, practice time against free-throw percentage, car age against resale price — you get a cloud of dots, not a line. The whole idea today is that a cloud can still have a direction, and a single straight line drawn through it lets you say what the pattern is and predict what happens next. Same y = mx + b you already know — but now m and b mean something about coffee, or cars, or free throws.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trend-lines',
      kind: 'concept',
      goal: 'Read association and strength, fit a trend line and find its equation, interpret slope and intercept in context, predict safely, and refuse causation.',
      keyIdeas: [
        'ASSOCIATION (DIRECTION) — POSITIVE means as x increases y tends to increase (cloud rises left to right); NEGATIVE means as x increases y tends to decrease (cloud falls); NO ASSOCIATION means the dots scatter with no tilt at all. Read the axis labels FIRST so you know which quantity is x.',
        'STRENGTH — how tightly the dots hug a straight line. STRONG = a narrow band you could almost trace; WEAK = a wide fuzzy cloud that still tilts. Direction and strength are separate: an association can be strong negative, weak positive, and so on. Watch for an outlier far from the pattern, or a curved cloud, where no straight line describes the data well.',
        'FITTING A TREND LINE BY EYE — draw ONE straight line that follows the overall tilt, running through the middle of the cloud with roughly as many points above it as below. Do NOT connect the dots, do NOT bend the line, and do NOT force it through (0, 0) or through the first and last points just because they are on the ends.',
        'GETTING ITS EQUATION — pick two convenient points ON YOUR LINE (they do not have to be data points), compute slope m = (change in y)/(change in x), then substitute one point into y = mx + b and solve for b.',
        'SLOPE IN CONTEXT — m is the PREDICTED change in y for a one-unit increase in x, stated in the real units: "about 3 more cups sold per additional degree." It is a prediction about the trend, not a promise about any single dot.',
        'INTERCEPT IN CONTEXT — b is the predicted y when x = 0. It is only meaningful if x = 0 makes sense AND sits near the data; otherwise it is just the number that positions the line, and can even come out negative or impossible.',
        'PREDICTING — INTERPOLATION means plugging in an x INSIDE the range the data actually covers; that is the trustworthy kind. EXTRAPOLATION means plugging in an x far outside that range, which assumes the same straight-line trend keeps going forever — real quantities usually stop, level off, or bend.',
        'CORRELATION IS NOT CAUSATION — however tight the band, a trend line only says the two quantities move together. A third, lurking variable can drive both, or the cause can run the other direction. Association is evidence to investigate, never proof of a cause.',
      ],
      vocabulary: [
        { term: 'scatterplot', definition: 'a graph of paired (x, y) measurements, one dot per individual in the data set.' },
        { term: 'trend line', definition: 'a single straight line drawn to summarize the overall pattern of a scatterplot; also called a line of best fit.' },
        { term: 'interpolation', definition: 'predicting at an x-value inside the range of the observed data — the reliable kind of prediction.' },
        { term: 'extrapolation', definition: 'predicting at an x-value outside the observed range, which assumes the trend continues and is much less reliable.' },
        { term: 'lurking variable', definition: 'a third quantity that influences both x and y, producing an association without either one causing the other.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fit-and-predict',
      kind: 'worked_example',
      problem:
        'A cafe records the daily high temperature x (in °F) and the number of iced coffees sold y for 30 days, with temperatures ranging from 55°F to 95°F. A trend line drawn through the cloud passes through the points (60, 40) and (90, 130). Find the equation of the trend line, interpret its slope and its y-intercept, and predict sales on a 75°F day.',
      steps: [
        'Slope: m = (130 − 40)/(90 − 60) = 90/30 = 3.',
        'Find b using the point (60, 40): 40 = 3(60) + b, so 40 = 180 + b and b = −140. The trend line is y = 3x − 140.',
        'Slope in context: for each additional 1°F in the daily high, the line predicts about 3 more iced coffees sold.',
        'Intercept in context: b = −140 would mean −140 coffees at 0°F — impossible, and 0°F is nowhere near the 55–95°F data. Here the intercept only positions the line; it has no real-world meaning.',
        'Predict at x = 75: y = 3(75) − 140 = 225 − 140 = 85. Since 75°F is inside the observed 55–95°F range, this interpolation is a reasonable prediction: about 85 iced coffees.',
      ],
      answer: 'y = 3x − 140; slope = about 3 more coffees per additional °F; the intercept is not meaningful here; predicted sales at 75°F is about 85 coffees.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extrapolation-trap',
      kind: 'worked_example',
      problem:
        'A student measures a sunflower\'s height y (in centimeters) once a week for the first 12 weeks after planting, and fits the trend line y = 2.5x + 8, where x is the number of weeks since planting. She uses it to predict the height at week 30. What does the model give, and why should she not trust it?',
      steps: [
        'Plug x = 30 into the model: y = 2.5(30) + 8 = 75 + 8 = 83, so the line predicts 83 cm.',
        'Check the data range: the measurements only cover weeks 1 through 12. Week 30 is far outside that range, so this is EXTRAPOLATION, not interpolation.',
        'The trend line only claims that growth looked steady at about 2.5 cm per week during weeks 1–12. Nothing in the data says the plant keeps growing at that rate — sunflowers level off once they mature.',
        'Contrast with a safe prediction: at week 6, y = 2.5(6) + 8 = 15 + 8 = 23 cm. Week 6 is inside the observed range, so 23 cm is a trustworthy prediction from the same line.',
      ],
      answer: 'The model gives 83 cm, but that is unreliable extrapolation — week 30 is far outside the weeks 1–12 the line was built from.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-interpretation',
      kind: 'try_yourself',
      problem:
        'A dealership plots the age x (in years) of 40 used cars against resale value y (in thousands of dollars). The trend line is y = −1.4x + 22. Which statement best interprets the slope in context?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For each additional year of age, the predicted resale value drops by about 1.4 thousand dollars.', correct: true },
        { id: 'b', text: 'For each 1 thousand dollar drop in resale value, a car gets about 1.4 years older.' },
        { id: 'c', text: 'A brand-new car (age 0) is predicted to be worth about 1.4 thousand dollars.' },
        { id: 'd', text: 'Every car in the data set loses exactly 1.4 thousand dollars in value each year.' },
      ],
      expectedAnswer: 'For each additional year of age, the predicted resale value drops by about 1.4 thousand dollars.',
      hints: [
        'Name x and y first: x is age in years, y is value in thousands of dollars. Slope is the change in y per one-unit increase in x.',
        'One choice swaps x and y, one describes the intercept instead of the slope, and one treats the prediction as exact for every single car.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-association',
      kind: 'try_yourself',
      problem:
        'A scatterplot shows hours of phone screen time x against remaining battery percentage y. The dots fall in a narrow band that falls steadily from the upper left to the lower right. How is the association best described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Strong positive association' },
        { id: 'b', text: 'Strong negative association', correct: true },
        { id: 'c', text: 'Weak negative association' },
        { id: 'd', text: 'No association' },
      ],
      expectedAnswer: 'Strong negative association',
      hints: [
        'Direction comes from the tilt: does y go up or down as x increases?',
        'Strength comes from the spread: a narrow band means strong, a wide fuzzy cloud means weak.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-predict',
      kind: 'try_yourself',
      problem:
        'Students plot study time x (in minutes, ranging from 10 to 70) against quiz score y. A trend line through the cloud passes through (20, 62) and (60, 86). Using this trend line, what score does it predict for a student who studies 45 minutes? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '77',
      hints: [
        'Slope first: m = (86 − 62)/(60 − 20) = 24/40 = 0.6.',
        'Use (20, 62) to get b: 62 = 0.6(20) + b, so b = 50. Now evaluate y = 0.6x + 50 at x = 45.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-causation',
      kind: 'misconception_check',
      question:
        'A city plots daily ice cream cones sold x against the number of swimming-pool rescues y for one summer. The dots form a tight upward band, and the trend line is y = 0.02x + 1. A student concludes that selling ice cream causes pool rescues, so the city should limit ice cream sales. What is wrong with that reasoning?',
      commonErrors: [
        {
          answer: 'The band is tight and clearly rising, so ice cream sales must be causing the rescues.',
          misconception: 'Reading a strong correlation as proof of cause and effect.',
          correctsTo:
            'A trend line only shows that the two quantities move together. Here a lurking variable — hot weather — drives BOTH: hot days send people to buy ice cream and to swim. Banning cones would change nothing about the rescues. Strong association is a reason to investigate a cause, never proof of one.',
        },
        {
          answer: 'Then it must be the reverse: pool rescues cause people to buy ice cream.',
          misconception: 'Accepting that a cause exists and only arguing about its direction.',
          correctsTo:
            'Flipping the arrow is still a causal claim the scatterplot cannot support. From association alone you may say "as ice cream sales rise, rescues tend to rise," and stop there. Establishing cause requires a controlled experiment, not a scatterplot.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Describe an association with BOTH direction (positive, negative, none) and strength (how tightly the dots hug a line).',
        'Fit a trend line through the middle of the cloud, then get its equation from two points ON THE LINE: find m = rise/run, then solve for b.',
        'Say the slope as a sentence with units — predicted change in y per one-unit increase in x; the intercept is the predicted y at x = 0 and is meaningless when x = 0 sits far from the data.',
        'Predicting inside the observed x-range (interpolation) is trustworthy; far outside it (extrapolation) assumes a trend that may not continue.',
        'A trend line shows association, never causation — a lurking variable can drive both quantities.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Scatterplots, Trend Lines & Correlation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
