/**
 * Grade 8 Math — Unit 10 CED 10.2: Fitting a Line to a Scatter Plot.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U10_FITTING_A_LINE_TO_A_SCATTER_PLOT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1',
  course: 'Grade 8 Math',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Fitting a Line to a Scatter Plot',
  planId: 'evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1' }],
  theory: [
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'framework', title: 'Fit a line only when the cloud looks like a line', content: `FIT A LINE ONLY WHEN THE CLOUD LOOKS LIKE A LINE — last lesson you learned to say whether a scatter plot rises, falls, or shows no pattern, and whether its points follow a straight-line path or a curve. A line of fit belongs only on a plot whose points follow a straight-line path. If the points curve or scatter with no tilt, a straight line would describe nothing, so you do not draw one.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'framework', title: 'One straight line through the middle', content: `ONE STRAIGHT LINE THROUGH THE MIDDLE — lay a ruler along the tilt of the cloud so the line runs through the middle of the points, then draw it. Do not connect the dots, do not bend the line, and do not aim for any particular dot. A good line of fit often touches no data point at all, because it stands in for all of them, not for any one of them.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', content: `CHECK ONE: ABOUT AS MANY ABOVE AS BELOW — count the points above your line and the points below it. If six of eight points sit on one side, the line is too high, too low, or tilted wrong; slide or turn the ruler until the two counts are close. Exactly equal is not required; four and four, or four and three, is balanced.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', content: `CHECK TWO: SMALL VERTICAL GAPS — for each point, look straight up or straight down to the line. That up-and-down distance is the vertical gap, and every gap should be small compared with the numbers on the y-axis. A line with balanced counts but one point sitting far from it, or with all the points far from it, is not a good fit either. Two traps fail these checks on purpose: a line forced to start at (0, 0), and a line drawn through the first and last data points. Nothing about a line of fit requires either one; the data decide where the line goes.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'framework', title: 'Read two points on the line, not two data points', content: `READ TWO POINTS ON THE LINE, NOT TWO DATA POINTS — to write the equation you need two points that sit ON your drawn line. Pick two places where the line crosses grid intersections, far apart so the slope comes out accurate. They do not have to be data points, and a data point counts only if the line actually passes through it. Two points from the data that sit above or below the line give the equation of a different line.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'framework', title: 'Write the equation the way you already do', content: `WRITE THE EQUATION THE WAY YOU ALREADY DO — from the two points on the line, m is the change in y over the change in x, subtracting in the same order top and bottom, and a falling line gives a negative m. Then b = y - mx using either point, and the other point is your check. Two careful people fitting the same cloud by eye can end up with slightly different lines, and both equations are fine if both lines pass the two checks, because a line of fit is an estimate of the pattern, not an exact fact.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'definition', title: 'scatter plot', content: `a graph of paired measurements, one point per pair, with one quantity on each axis.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'definition', title: 'line of fit', content: `one straight line drawn by eye through the middle of a linear-looking scatter plot to stand in for the whole pattern; also called a trend line.` },
    { loId: 'm8math.fitting-a-line-to-a-scatter-plot', kind: 'definition', title: 'vertical gap', content: `the up-and-down distance between a data point and the line directly above or below it, measured in the units of the y-axis.` },
  ],
  methods: [
    {
      title: 'Worked car wash',
      steps: [
        `Look at the cloud first. The points climb steadily from (3, 14) up to (9, 40) with no bend and no stray point far from the others, so a straight line makes sense here.`,
        `Lay the ruler along the upward tilt, through the middle of the points, and draw the line. Suppose the line you settle on crosses the grid at (4, 20) and at (9, 40). Notice that (4, 20) is not a data point: the data point at 4 volunteers is (4, 21), sitting just above the line. That is fine, because the line does not have to touch any dot.`,
        `Judge it by eye. The dots at 3, 5 and 7 volunteers sit just under the line, the dots at 4, 6 and 8 sit just over it, and the dot at 9 is on it. Three above, three below, all close. Both checks pass, so keep the line.`,
        `Now the equation, from the two points ON the line, (4, 20) and (9, 40). Slope: m = (40 - 20) ÷ (9 - 4) = 20 ÷ 5 = 4. Then b from (4, 20): 20 = 4(4) + b, so 20 = 16 + b and b = 4. The line is y = 4x + 4.`,
        `Check with the other point: 4(9) + 4 = 36 + 4 = 40, which matches (9, 40). The equation is right.`,
        `The equation also lets you measure the gaps exactly instead of eyeballing them. At x = 3 through 9, y = 4x + 4 gives 16, 20, 24, 28, 32, 36, 40. Against the data 14, 21, 22, 30, 31, 38, 40 the gaps are 2 below, 1 above, 2 below, 2 above, 1 below, 2 above, and 0. The biggest gap is 2 cars on a plot where the cars run from 14 to 40, which is small. Three above and three below, all gaps small: this is a good line of fit.`,
      ],
      example: { problem: `The student council ran a car wash on seven Saturdays and logged how many volunteers showed up and how many cars got washed, written as (volunteers, cars): (3, 14), (4, 21), (5, 22), (6, 30), (7, 31), (8, 38), (9, 40). Fit a line by eye, judge the fit, and write the equation of your line.`, solution: `y = 4x + 4 (three points above the line, three below, one on it; largest vertical gap 2)` },
      relatedLoIds: ['m8math.fitting-a-line-to-a-scatter-plot'],
    },
    {
      title: 'Worked console resale',
      steps: [
        `Look at the cloud first. The points fall steadily from left to right in a straight-line pattern, so a line makes sense, and because the line falls, its slope is going to be negative.`,
        `Lay the ruler along the downward tilt through the middle of the points. Suppose your line crosses the grid at (2, 190) and at (6, 90). Neither is a data point: (2, 185) and (6, 85) each sit 5 dollars below the line.`,
        `Judge it by eye. The dots at 1, 3, 5 and 7 years sit a little above the line, and the dots at 2, 4 and 6 years sit a little below. Four above, three below, all close. Balanced enough, so keep the line.`,
        `Slope from the two points ON the line, subtracting in the same order top and bottom: m = (90 - 190) ÷ (6 - 2) = -100 ÷ 4 = -25.`,
        `WRONG: m = (190 - 90) ÷ (6 - 2) = 100 ÷ 4 = 25, taking the y-values in one order and the x-values in the other. CORRECT: a positive slope belongs to a line that climbs, and this line falls, so the sign must be negative. Keep the same order in both subtractions: 90 - 190 on top goes with 6 - 2 on the bottom, and m = -25.`,
        `Then b from (2, 190): 190 = -25(2) + b, so 190 = -50 + b and b = 240. The line is y = -25x + 240.`,
        `Check with the other point: -25(6) + 240 = -150 + 240 = 90, which matches (6, 90). Then the exact gaps: at x = 1 through 7 the line gives 215, 190, 165, 140, 115, 90, 65, and the data are 220, 185, 170, 130, 120, 85, 70, so the gaps are 5 above, 5 below, 5 above, 10 below, 5 above, 5 below, 5 above. The biggest gap is $10 on prices that run from $70 to $220, which is small. Good line.`,
      ],
      example: { problem: `Seven used game consoles of the same model were listed for resale. Each is written as (age in years, price in dollars): (1, 220), (2, 185), (3, 170), (4, 130), (5, 120), (6, 85), (7, 70). Fit a line by eye, judge the fit, and write the equation of your line.`, solution: `y = -25x + 240 (four points above the line, three below; largest vertical gap $10)` },
      relatedLoIds: ['m8math.fitting-a-line-to-a-scatter-plot'],
    },
  ],
  pointers: [
    { content: `Students often say "Leo: the line has to start at (0, 0)." — A line of fit is placed by the data, not by the origin. Six points above the line means the line sits too low, so it fails check one. Slide the ruler up, and turn it if the tilt is off, until about as many points sit above the line as below and every point is close to it. If a balanced line happens to pass through (0, 0), then b comes out 0, but that is a result of the fit, not a rule you start from.`, kind: 'common-error' },
    { content: `Students often say "Nina: y = 3.5x + 5.5, computed from (1, 9) and (7, 30)." — The equation belongs to the line, so both points must sit ON the line. The slope she computed, (30 - 9) ÷ (7 - 1) = 21 ÷ 6 = 3.5, and the intercept 9 - 3.5(1) = 5.5, describe the line through those two data points, which runs above her drawn line and is not the line she judged to be a good fit. Read two places where her drawn line crosses grid intersections, far apart so the slope is accurate, and compute m and b from those. A data point counts only if the line actually passes through it.`, kind: 'common-error' },
    { content: `Fit a line only to a scatter plot whose points follow a straight-line pattern; draw one straight line through the middle of the cloud, and never connect the dots.`, kind: 'tip' },
    { content: `Judge the fit two ways: about as many points above the line as below, and every vertical gap small.`, kind: 'tip' },
    { content: `Do not force the line through (0, 0) or through the first and last data points; the data decide where the line goes.`, kind: 'tip' },
    { content: `Get the equation from two points ON THE DRAWN LINE, far apart and easy to read; they do not have to be data points.`, kind: 'tip' },
    { content: `m is the change in y over the change in x in the same order, a falling line gives a negative m, then b = y - mx from one point, and the other point is the check.`, kind: 'tip' },
    { content: `A line drawn by eye is an estimate of the pattern, so two careful lines can differ a little and both be good fits.`, kind: 'tip' },
    { content: `Don't read the two points for your equation from the data points on the plot. Read them from where your drawn line crosses grid lines. A data point counts only if your line actually passes through it.`, kind: 'common-error' },
    { content: `When you subtract to find slope, subtract the y-values in the same order as the x-values (top to bottom on both). If you mix the order, you'll flip the sign of m.`, kind: 'gotcha' },
    { content: `A good line of fit often touches no data points at all. It stands in for the whole pattern, not for any single dot. Don't aim for any particular point.`, kind: 'tip' },
    { content: `Never force a line to pass through (0, 0). The data decide where the line goes. A line of fit that passes through the origin is a coincidence, not a rule.`, kind: 'common-error' },
    { content: `Check 'about as many above as below' means roughly equal counts, not exactly equal. Three above and four below, or four above and three below, both pass the balance check.`, kind: 'vocab-note' },
    { content: `The vertical gap is always measured straight up or straight down from the data point to the line, in the units of the y-axis. It's not a slant distance.`, kind: 'vocab-note' },
    { content: `If the scatter plot points follow a curve or show no pattern at all, do not draw a line of fit. A line only makes sense when the cloud looks like a straight-line path.`, kind: 'edge-case' },
    { content: `Two people fitting the same plot by eye may end up with slightly different lines. Both equations are fine if both lines pass the two checks: balanced counts and small gaps.`, kind: 'tip' },
  ],
};
