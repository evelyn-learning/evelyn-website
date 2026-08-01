/**
 * Algebra 1 — Unit 10 CED 10.2: Scatterplots, Trend Lines & Correlation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.scatterplots-trend-lines.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U10_SCATTERPLOTS_TREND_LINES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.scatterplots-trend-lines.v1',
  course: 'Algebra 1',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Scatterplots, Trend Lines & Correlation',
  planId: 'evelyn.hs.alg1.scatterplots-trend-lines.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.scatterplots-trend-lines.v1' }],
  theory: [
    { loId: 'alg1.scatterplots-trend-lines', content: `ASSOCIATION (DIRECTION) — POSITIVE means as x increases y tends to increase (cloud rises left to right); NEGATIVE means as x increases y tends to decrease (cloud falls); NO ASSOCIATION means the dots scatter with no tilt at all. Read the axis labels FIRST so you know which quantity is x.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Strength', content: `STRENGTH — how tightly the dots hug a straight line. STRONG = a narrow band you could almost trace; WEAK = a wide fuzzy cloud that still tilts. Direction and strength are separate: an association can be strong negative, weak positive, and so on. Watch for an outlier far from the pattern, or a curved cloud, where no straight line describes the data well.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Fitting a trend line by eye', content: `FITTING A TREND LINE BY EYE — draw ONE straight line that follows the overall tilt, running through the middle of the cloud with roughly as many points above it as below. Do NOT connect the dots, do NOT bend the line, and do NOT force it through (0, 0) or through the first and last points just because they are on the ends.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Getting its equation', content: `GETTING ITS EQUATION — pick two convenient points ON YOUR LINE (they do not have to be data points), compute slope m = (change in y)/(change in x), then substitute one point into y = mx + b and solve for b.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Slope in context', content: `SLOPE IN CONTEXT — m is the PREDICTED change in y for a one-unit increase in x, stated in the real units: "about 3 more cups sold per additional degree." It is a prediction about the trend, not a promise about any single dot.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Intercept in context', content: `INTERCEPT IN CONTEXT — b is the predicted y when x = 0. It is only meaningful if x = 0 makes sense AND sits near the data; otherwise it is just the number that positions the line, and can even come out negative or impossible.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Predicting', content: `PREDICTING — INTERPOLATION means plugging in an x INSIDE the range the data actually covers; that is the trustworthy kind. EXTRAPOLATION means plugging in an x far outside that range, which assumes the same straight-line trend keeps going forever — real quantities usually stop, level off, or bend.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'framework', title: 'Correlation is not causation', content: `CORRELATION IS NOT CAUSATION — however tight the band, a trend line only says the two quantities move together. A third, lurking variable can drive both, or the cause can run the other direction. Association is evidence to investigate, never proof of a cause.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'definition', title: 'scatterplot', content: 'a graph of paired (x, y) measurements, one dot per individual in the data set.' },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'definition', title: 'trend line', content: `a single straight line drawn to summarize the overall pattern of a scatterplot; also called a line of best fit.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'definition', title: 'interpolation', content: `predicting at an x-value inside the range of the observed data — the reliable kind of prediction.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'definition', title: 'extrapolation', content: `predicting at an x-value outside the observed range, which assumes the trend continues and is much less reliable.` },
    { loId: 'alg1.scatterplots-trend-lines', kind: 'definition', title: 'lurking variable', content: `a third quantity that influences both x and y, producing an association without either one causing the other.` },
  ],
  methods: [
    {
      title: 'Worked fit and predict',
      steps: [
        'Slope: m = (130 − 40)/(90 − 60) = 90/30 = 3.',
        `Find b using the point (60, 40): 40 = 3(60) + b, so 40 = 180 + b and b = −140. The trend line is y = 3x − 140.`,
        `Slope in context: for each additional 1°F in the daily high, the line predicts about 3 more iced coffees sold.`,
        `Intercept in context: b = −140 would mean −140 coffees at 0°F — impossible, and 0°F is nowhere near the 55–95°F data. Here the intercept only positions the line; it has no real-world meaning.`,
        `Predict at x = 75: y = 3(75) − 140 = 225 − 140 = 85. Since 75°F is inside the observed 55–95°F range, this interpolation is a reasonable prediction: about 85 iced coffees.`,
      ],
      example: { problem: `A cafe records the daily high temperature x (in °F) and the number of iced coffees sold y for 30 days, with temperatures ranging from 55°F to 95°F. A trend line drawn through the cloud passes through the points (60, 40) and (90, 130). Find the equation of the trend line, interpret its slope and its y-intercept, and predict sales on a 75°F day.`, solution: `y = 3x − 140; slope = about 3 more coffees per additional °F; the intercept is not meaningful here; predicted sales at 75°F is about 85 coffees.` },
      relatedLoIds: ['alg1.scatterplots-trend-lines'],
    },
    {
      title: 'Worked extrapolation trap',
      steps: [
        `Plug x = 30 into the model: y = 2.5(30) + 8 = 75 + 8 = 83, so the line predicts 83 cm.`,
        `Check the data range: the measurements only cover weeks 1 through 12. Week 30 is far outside that range, so this is EXTRAPOLATION, not interpolation.`,
        `The trend line only claims that growth looked steady at about 2.5 cm per week during weeks 1–12. Nothing in the data says the plant keeps growing at that rate — sunflowers level off once they mature.`,
        `Contrast with a safe prediction: at week 6, y = 2.5(6) + 8 = 15 + 8 = 23 cm. Week 6 is inside the observed range, so 23 cm is a trustworthy prediction from the same line.`,
      ],
      example: { problem: `A student measures a sunflower's height y (in centimeters) once a week for the first 12 weeks after planting, and fits the trend line y = 2.5x + 8, where x is the number of weeks since planting. She uses it to predict the height at week 30. What does the model give, and why should she not trust it?`, solution: `The model gives 83 cm, but that is unreliable extrapolation — week 30 is far outside the weeks 1–12 the line was built from.` },
      relatedLoIds: ['alg1.scatterplots-trend-lines'],
    },
  ],
  pointers: [
    { content: `A trend line only shows that the two quantities move together. Here a lurking variable — hot weather — drives BOTH: hot days send people to buy ice cream and to swim. Banning cones would change nothing about the rescues. Strong association is a reason to investigate a cause, never proof of one.`, kind: 'common-error' },
    { content: `Flipping the arrow is still a causal claim the scatterplot cannot support. From association alone you may say "as ice cream sales rise, rescues tend to rise," and stop there. Establishing cause requires a controlled experiment, not a scatterplot.`, kind: 'common-error' },
    { content: `Describe an association with BOTH direction (positive, negative, none) and strength (how tightly the dots hug a line).`, kind: 'tip' },
    { content: `Fit a trend line through the middle of the cloud, then get its equation from two points ON THE LINE: find m = rise/run, then solve for b.`, kind: 'tip' },
    { content: `Say the slope as a sentence with units — predicted change in y per one-unit increase in x; the intercept is the predicted y at x = 0 and is meaningless when x = 0 sits far from the data.`, kind: 'tip' },
    { content: `Predicting inside the observed x-range (interpolation) is trustworthy; far outside it (extrapolation) assumes a trend that may not continue.`, kind: 'tip' },
    { content: `A trend line shows association, never causation — a lurking variable can drive both quantities.`, kind: 'tip' },
    { content: `When getting the equation, use two points **on your trend line**, not two data dots. Grabbing the first and last data points is the #1 way to get a slope that doesn't match the line you drew.`, kind: 'common-error' },
    { content: `Direction and strength are two separate answers. "Negative" alone or "strong" alone is half a description — always say both, e.g. "strong negative" or "weak positive."`, kind: 'vocab-note' },
    { content: `A negative slope means the association is negative — it does NOT mean the association is weak. y = −1.4x + 22 can describe a very tight band. Steepness isn't strength either.`, kind: 'gotcha' },
    { content: `Before you trust a prediction, check the given x-range. Inside it = interpolation (fine); far outside = extrapolation (say so and flag it). The algebra works either way — the model is what fails.`, kind: 'tip' },
    { content: `A negative or absurd intercept is not a mistake in your work. b = −140 coffees at 0°F just positions the line; when x = 0 sits outside the data, say "no real-world meaning" instead of hunting for an error.`, kind: 'edge-case' },
    { content: `State slope as a *predicted* change with units: "about 3 more coffees per additional 1°F." Not "3 coffees" and not "every day it goes up by 3" — the line predicts a trend, not what any single dot does.`, kind: 'vocab-note' },
    { content: `From a scatterplot you may only say the quantities "tend to move together." Reversing the arrow ("rescues cause ice cream sales") is still a causal claim — look for a lurking variable like hot weather instead.`, kind: 'common-error' },
    { content: `If the cloud curves or one point sits far off the pattern, a straight trend line is the wrong summary — note it rather than forcing a line and predicting from it.`, kind: 'edge-case' },
  ],
};
