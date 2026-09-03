/**
 * Grade 8 Math — Bivariate Data: Using a Linear Model with Bivariate Data.
 *
 * CONCEPT-LED row 10.3. In row 7.3 the student read m and b off an EXACT rule
 * (a posted price, a burn rate) and every prediction came out exactly. Here
 * the line arrives already fitted through scattered measurements (row 10.2
 * drew it), and the mental model this plan builds is that such a line is a
 * SUMMARY of the data rather than a rule the data obey (CCSS 8.SP.A.3). Three
 * things follow, and the lesson is organized around them: the slope is an
 * "about ___ more for each additional ___" sentence with two units, the
 * intercept is the model's value at x = 0 and has to be checked against
 * whether any data sit there, and a prediction is trustworthy only inside the
 * span of x-values the points actually cover; stretching the line past the
 * data is extrapolation and gets flagged, not reported as a fact. Two traps
 * this plan is built to kill: treating the fitted line as an exact rule (so a
 * point that sits off the line "must be a mistake"), and plugging any x into
 * the equation as if the line were true forever.
 *
 * SCOPE GUARD: Given a linear model fitted to data (the standard's example:
 * an additional hour of sunlight ≈ 1.5 cm more plant height), interpret the
 * slope as a per-unit change and the intercept in context, predict a value,
 * and flag predictions that extrapolate beyond the data; extends row 7.3 from
 * an exact model to a fitted one. Withholds: causation judgments ->
 * `alg1-u10-scatterplots-trend-lines.ts`. Concretely, in the plan body
 * beneath this comment: every line arrives already fitted, with its equation
 * written and the span of the data's x-values stated, so the plan never draws
 * a line by eye, never judges how well a line fits, and never computes m or b
 * from two points (rows 10.2 and 7.1); it never uses the words correlation,
 * causation, residual, least squares, strong or weak, and never says or asks
 * whether x CAUSES y — every slope sentence in the body reads "goes with"
 * (`alg1-u10-scatterplots-trend-lines.ts` owns the causation question).
 * Wherever the intercept is interpreted in context it is read as the model's
 * y-value at x = 0 and, where x = 0 lies outside the data, that is said in
 * plain words. The prediction direction is x in, y out only; solving for the
 * input that gives a target output is row 7.3's skill and does not appear
 * here. The word
 * "extrapolation" is named because the row's own scope names it; its partner
 * word for predicting inside the data is not introduced. Sideways: clustering,
 * outliers and the type of association are never taught or assessed (row
 * 10.1) and no two-way table appears (row 10.4). Below, assumed and not
 * re-taught: plotting points (`m6math` row 6.1), one-variable statistics
 * (`m7math-u9-*`, never
 * revisited), and the two-step arithmetic of evaluating y = mx + b at a given
 * x, which is used without comment. A negative slope DOES appear (the phone
 * prices in the second worked example), because a fitted line may fall as
 * easily as rise and its per-unit sentence then reads "about $90 LESS for
 * each additional year".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U10_USING_A_LINEAR_MODEL_WITH_BIVARIATE_DATA: LessonPlan = {
  id: 'evelyn.ms.m8math.using-a-linear-model-with-bivariate-data.v1',
  title: 'Using a Linear Model with Bivariate Data',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.using-a-linear-model-with-bivariate-data',
      standard: 'M8MATH-10.3',
      description:
        'Given a linear model fitted to data (the standard\'s example: an additional hour of sunlight ≈ 1.5 cm more plant height), interpret the slope as a per-unit change and the intercept in context, predict a value, and flag predictions that extrapolate beyond the data (CCSS 8.SP.A.3).',
    },
  ],
  prerequisites: ['m8math.fitting-a-line-to-a-scatter-plot'],
  followUps: ['m8math.two-way-tables-and-relative-frequencies'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a fitted line next to the scattered points it came from, so the student feels that its numbers are summaries with units, not exact rules.',
      script:
        'Your science class grew eight bean plants on the lab table, each one under a lamp for a different number of hours a day, from 2 hours up to 8. After three weeks you measured every plant and plotted hours of light against height. The points climbed, but not in a perfect line: the plant that got 5 hours was 14 cm, and one of the plants that got 6 hours was also 14 cm. Last lesson you drew a line through the middle of that scatter and found its equation, y = 1.5x + 6. Now the questions start. What does the 1.5 actually say about beans and light? What does the 6 say, when no plant got zero hours? If a friend grows a plant with 5 hours of light, how tall should she expect it? And if somebody asks about a plant under a lamp 20 hours a day, is the line even allowed to answer? A line that came from data is a different kind of tool from the candle that burned exactly half a centimeter an hour, and today you learn how to use it honestly.',
      suggestedTools: ['show_scatter_plot', 'show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-summary-not-rule',
      kind: 'concept',
      goal: 'Build the mental model that a fitted line summarizes data, then read its slope and intercept in context with units, predict inside the data, and flag predictions that reach outside it.',
      keyIdeas: [
        'A FITTED LINE IS A SUMMARY, NOT A RULE — the candle model y = -0.5x + 12 was an exact rule, so every prediction came out exactly. The bean-plant line y = 1.5x + 6 was drawn through scattered points, and most of the points sit a little above or a little below it. So every number this line hands you is "about", and a point that sits off the line is normal, not a mistake.',
        'THE SLOPE IS A PER-UNIT SENTENCE WITH TWO UNITS — the slope 1.5 is the rise for every 1 unit of run, so it reads: each additional hour of light per day goes with about 1.5 cm more height. Say the two units out loud, centimeters per hour, and say the word "additional": the slope compares one plant with a plant that got ONE MORE hour. It is a description of how the heights and the hours climb together across the eight plants, nothing more.',
        'THE INTERCEPT IS THE MODEL\'S VALUE AT x = 0 — the 6 is the height the line gives when x is 0 hours of light. Before you read meaning into it, check whether any data sit near x = 0. No plant got fewer than 2 hours, so 6 cm is where the line starts on the axis, not a plant anybody measured. Some intercepts are sensible starting values, like the price of a phone that is 0 years old, and some are only the line reaching the axis; in both cases you say what the model claims and where the data actually begin.',
        'PREDICT BY PUTTING x INTO THE EQUATION — for a plant getting 5 hours, y = 1.5(5) + 6 = 7.5 + 6 = 13.5, so the model predicts about 13.5 cm. The plant in the data that got 5 hours measured 14 cm, which is close and not identical, exactly what a fitted line should do. On the graph, the same prediction is the height of the line directly above x = 5.',
        'STAY INSIDE THE DATA — the eight plants got between 2 and 8 hours, so the line has earned trust only from x = 2 to x = 8. Asking it about 20 hours is EXTRAPOLATION: stretching the line past the data and assuming the pattern keeps going, when nothing in the experiment says it does. You can still compute 1.5(20) + 6 = 36, but you report it with a flag, "the data stop at 8 hours, so this is a guess the line was never checked against", or you decline to predict. The clearest warning sign is a prediction that is impossible, like a negative price for an old phone; that is the line telling you it has been stretched too far.',
      ],
      vocabulary: [
        { term: 'linear model', definition: 'an equation y = mx + b that was fitted to scattered data points to summarize the pattern they make.' },
        { term: 'slope of a fitted line', definition: 'the change in y that goes with each additional 1 unit of x, stated as an "about" amount with both units.' },
        { term: 'intercept', definition: 'the y-value the model gives when x is 0; meaningful only if the situation and the data make sense there.' },
        { term: 'data span', definition: 'the span from the smallest x-value in the data to the largest, the only stretch where the line has been checked against real points.' },
        { term: 'extrapolation', definition: 'using the line to predict at an x-value outside the data span, which assumes the pattern continues where nobody measured.' },
      ],
      suggestedTools: ['show_scatter_plot', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bean-plants',
      kind: 'worked_example',
      problem:
        'Eight bean plants got between 2 and 8 hours of lamp light a day, and after three weeks their heights were plotted against their hours of light. The line fitted to the scatter plot has the equation y = 1.5x + 6, where x is hours of light per day and y is height in centimeters. (a) What does the slope mean? (b) What does the intercept mean? (c) Predict the height of a plant that gets 5 hours a day; the plant in the data with 5 hours measured 14 cm. (d) A student wants to predict the height of a plant under a lamp 20 hours a day. What should the model say?',
      steps: [
        'Say what kind of line this is before touching the numbers. It was drawn through scattered points, so it is a summary of the eight plants, and every answer it gives is "about" rather than exact.',
        '(a) The slope is 1.5, which is the rise for every 1 unit of run, so it means: each additional hour of light per day goes with about 1.5 cm more height. Both units belong in the sentence, centimeters per hour. Check it on the line itself: at 4 hours, y = 1.5(4) + 6 = 6 + 6 = 12, and at 5 hours, y = 1.5(5) + 6 = 7.5 + 6 = 13.5. One more hour, 13.5 - 12 = 1.5 cm more.',
        '(b) The intercept is 6, the height the line gives at x = 0. In context that is the model\'s height for a plant with no lamp light at all: about 6 cm. Now check the data: the plant with the least light got 2 hours, so nobody measured a plant at 0 hours. The 6 cm is where the line reaches the axis, and it is a claim the experiment never tested, so say exactly that.',
        '(c) Put x = 5 into the equation: y = 1.5(5) + 6 = 7.5 + 6 = 13.5. The model predicts about 13.5 cm. The real plant with 5 hours measured 14 cm, half a centimeter above the line, which is normal for a fitted line. On the graph, 13.5 is the height of the line directly above x = 5, and the data point sits just above it.',
        '(d) The equation still computes: y = 1.5(20) + 6 = 30 + 6 = 36 cm. But the data run from 2 hours to 8 hours, and 20 hours is far past that. This is extrapolation. Nothing in the experiment says the plants keep gaining 1.5 cm per hour once the light goes past 8 hours, so the honest answer is: the line gives 36 cm, but the data stop at 8 hours, and this prediction was never checked against a real plant.',
        'Read the whole thing back as sentences about beans, not about x and y: each extra hour of light goes with about 1.5 cm more growth, the line starts at 6 cm on the axis where no plant was grown, a 5-hour plant should be about 13.5 cm, and 20 hours is a question the data cannot answer.',
      ],
      answer:
        'Slope: about 1.5 cm more height for each additional hour of light; intercept: the model gives 6 cm at 0 hours, but no plant in the data got less than 2 hours; 5 hours: about 13.5 cm (the real plant was 14 cm); 20 hours: the equation gives 36 cm, but that is extrapolation past the 2-to-8-hour data and cannot be trusted',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-used-phones',
      kind: 'worked_example',
      problem:
        'A class collected the ages and asking prices of used phones of one model for sale online. The phones were between 1 and 4 years old. The line fitted to the scatter plot is y = -90x + 520, where x is the age in years and y is the price in dollars. (a) What does the slope mean? (b) What does the intercept mean? (c) Predict the price of a phone that is 2.5 years old. (d) A student uses the line for a phone that is 8 years old. What happens?',
      steps: [
        'The slope is negative this time, -90, so the line falls as x grows. The per-unit sentence has to say so: each additional year of age goes with about $90 LESS in price. Units: dollars per year.',
        'WRONG: reading the slope as "the phone loses $90". CORRECT: the slope is per year, not total. A phone 3 years older than another sits about 3 × 90 = $270 lower on the line, not $90 lower. The word "additional" is what keeps the slope a rate.',
        '(b) The intercept is 520, the price the line gives at x = 0. A phone that is 0 years old is brand new, so the model says a new phone of this model goes for about $520. The data start at 1 year, so 0 years is just past the edge of the data; it is a sensible starting value, but it is still the line reaching the axis, not a phone anybody listed.',
        '(c) Put x = 2.5 into the equation: y = -90(2.5) + 520 = -225 + 520 = 295. A phone that is 2.5 years old should be listed for about $295. That age sits inside the 1-to-4-year data, so the prediction is one the line has earned.',
        '(d) The equation computes y = -90(8) + 520 = -720 + 520 = -200, a price of negative two hundred dollars. WRONG: writing -$200 as the answer. CORRECT: a negative price is impossible, and the impossible number is the line telling you it has been stretched too far. The oldest phone in the data is 4 years, and 8 years is twice that. Real prices flatten out near some small amount instead of dropping through zero, so this is extrapolation and the model should not be used at 8 years.',
        'Check (c) by working backward on the line: at 2 years the line gives -90(2) + 520 = -180 + 520 = 340, and at 3 years it gives -90(3) + 520 = -270 + 520 = 250. The 2.5-year prediction of 295 sits exactly halfway between 340 and 250, which is what a straight line must do.',
      ],
      answer:
        'Slope: about $90 less for each additional year of age; intercept: about $520 for a 0-year-old (new) phone, just outside the 1-to-4-year data; 2.5 years: about $295; 8 years: the equation gives -$200, an impossible extrapolation, so the model cannot be used there',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-meaning',
      kind: 'try_yourself',
      problem:
        'Players on the basketball team recorded how many minutes a day they practice free throws (x, from 5 to 30 minutes) and how many free throws out of 20 they made in a test (y). The line fitted to the scatter plot is y = 0.4x + 5. What does the slope 0.4 mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each additional free throw made goes with about 0.4 more minutes of practice' },
        { id: 'b', text: 'Each additional minute of daily practice goes with about 0.4 more free throws made', correct: true },
        { id: 'c', text: 'Every player makes exactly 0.4 more free throws for every minute, with no exceptions' },
        { id: 'd', text: 'A player who does not practice at all makes about 0.4 free throws' },
      ],
      expectedAnswer: 'Each additional minute of daily practice goes with about 0.4 more free throws made',
      hints: [
        'The slope is the rise for every 1 unit of run. Here x is minutes of practice and y is free throws made, so the slope is a change in free throws for one more minute, not the other way around.',
        'This line was fitted to scattered points, so its slope is an "about" amount, not an exact rule for every player. And the number the line gives at 0 minutes is the intercept, 5, which is a different question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-extrapolation-flag',
      kind: 'try_yourself',
      problem:
        'A scatter plot shows the ages (x, in months, from 3 to 18) and weights (y, in pounds) of puppies at an animal shelter. The line fitted to the data is y = 2x + 5. A student uses it to predict the weight of a dog of the same breed at 60 months old: 2(60) + 5 = 125 pounds. Which statement about this prediction is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is reliable, because the equation accepts any x-value and the arithmetic is correct' },
        { id: 'b', text: 'It is reliable, because the line rises, so the weight keeps rising at the same rate at every age' },
        { id: 'c', text: 'It is unreliable, because the student forgot the intercept and the answer should be 120' },
        { id: 'd', text: 'It is unreliable, because 60 months is far outside the 3-to-18-month ages in the data', correct: true },
      ],
      expectedAnswer: 'It is unreliable, because 60 months is far outside the 3-to-18-month ages in the data',
      hints: [
        'First find the data span: the youngest puppy was 3 months and the oldest was 18 months. Where does 60 months sit compared with that span?',
        'A fitted line has only been checked against points inside the data span. Past 18 months the line is a guess, and puppies do not keep gaining 2 pounds a month forever. The arithmetic 2(60) + 5 = 125 is correct; the problem is where it was used.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-predict-inside',
      kind: 'try_yourself',
      problem:
        'A student who walks dogs recorded, for each of ten weeks, the number of walks that week (x, from 3 to 15) and the tips earned that week in dollars (y). The line fitted to the scatter plot is y = 2.5x + 4. Use the model to predict the tips for a week with 10 walks. Type your answer as a number, in dollars without the dollar sign.',
      responseFormat: 'numeric',
      expectedAnswer: '29',
      hints: [
        'Check that 10 walks sits inside the data span of 3 to 15 walks, so the prediction is one the line has earned. Then put x = 10 into the equation.',
        'Multiply first: 2.5 × 10 = 25. Then add the intercept, 4. Type only the number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exact-rule-and-any-x',
      kind: 'misconception_check',
      question:
        'Two students look at the bean-plant model y = 1.5x + 6, fitted to plants that got 2 to 8 hours of light a day. Devon says the plant that got 5 hours must have been measured wrong, because the model says 13.5 cm and the data sheet says 14 cm. Lena says a plant under a grow lamp 24 hours a day will be 1.5(24) + 6 = 42 cm tall. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The 5-hour plant was measured wrong, because the model says 13.5 cm and the sheet says 14 cm.',
          misconception: 'Treating the fitted line as an exact rule the data must obey, when it is a summary drawn through scattered points.',
          correctsTo:
            'The line was drawn through the middle of eight points that do not sit in a perfect line, so almost every plant is a little above or a little below it. The model predicts about 13.5 cm for 5 hours, and a real plant at 14 cm is half a centimeter off, which is normal, not an error. The data came first; the line is the summary. If every point matched the line exactly, the line would be an exact rule like the candle, and this one is not.',
        },
        {
          answer: 'A plant under a lamp 24 hours a day will be 42 cm tall, because 1.5(24) + 6 = 42.',
          misconception: 'Plugging any x-value into the equation as if the line were true at every x, when it was only checked against data from 2 to 8 hours.',
          correctsTo:
            'The arithmetic is right, 1.5(24) + 6 = 36 + 6 = 42, but 24 hours is three times the most light any plant in the data received. That is extrapolation: the line is being stretched far past the data and asked to keep climbing 1.5 cm per hour where nothing was ever measured. Plants under constant light may stop growing faster, or may grow worse. The honest answer is that the model cannot say what happens at 24 hours, and any number it gives there needs a flag, not a claim.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A line fitted to scattered data is a summary of the points, not an exact rule, so every number it gives is "about" and a point off the line is normal.',
        'The slope is a per-unit sentence with two units: each additional 1 unit of x goes with about m more (or less, if m is negative) of y.',
        'The intercept is the model\'s y-value at x = 0. Say what it claims, then check whether any data actually sit near x = 0 before treating it as real.',
        'To predict, put the x-value into y = mx + b and report the result as "about"; on the graph it is the height of the line directly above that x.',
        'A prediction can be trusted only inside the data span. Predicting past the smallest or largest x in the data is extrapolation, and it must be flagged or declined.',
        'An impossible prediction, like a negative price, is the line telling you it has been stretched too far past the data.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Using a Linear Model with Bivariate Data' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
