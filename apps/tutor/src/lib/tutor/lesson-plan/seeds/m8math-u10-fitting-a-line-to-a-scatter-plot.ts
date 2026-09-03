/**
 * Grade 8 Math — Bivariate Data: Fitting a Line to a Scatter Plot.
 *
 * PROCEDURE-LED. The student arrives already able to read a scatter plot
 * and say whether its points follow a straight-line pattern (row 10.1), and
 * already able to write y = mx + b from any two points (row 7.1). What is
 * new is the line itself (CCSS 8.SP.A.2): where to draw ONE straight line
 * through a cloud of points that no line passes through, how to tell whether
 * the drawn line is a good one, and how to turn a line drawn by eye into an
 * equation. The concept segment is an ordered recipe: confirm the cloud is
 * linear-looking, lay a ruler along the tilt through the middle, run two
 * fit checks (about as many points above as below; every vertical gap
 * small), read two grid points ON THE LINE, then compute m and b the way the
 * student already does, and check with the second point. Both worked
 * examples run the same moves, one on a rising cloud and one on a falling
 * cloud, and each ends by using the finished equation to measure the vertical
 * gaps exactly. Three traps this plan is built to kill: forcing the line
 * through the origin (a habit carried over from proportional relationships),
 * connecting the first and last data points instead of fitting the middle,
 * and taking the two points for the equation from the DATA instead of from
 * the drawn line.
 *
 * SCOPE GUARD: Grade 8 row 10.2 informally fits a straight line by eye to a
 * scatter plot whose points already follow a straight-line pattern, judges
 * the fit with two checks (about as many points above the line as below;
 * every vertical gap small), and writes the line's equation from two points
 * on the drawn line. Withholds: least-squares/technology regression,
 * residuals and the correlation coefficient →
 * `alg1-u10-scatterplots-trend-lines.ts` (cites S-ID.B.6/C.8). Sideways:
 * describing the association (positive/negative/none, linear vs nonlinear,
 * clusters and outliers) is row 10.1 and is recalled in a clause, never
 * re-taught; interpreting the slope or the intercept in the situation's
 * units and using the line to predict a value are row 10.3 and never happen
 * here. The line's height IS computed at x-values the data already has, but
 * only to measure a vertical gap between the line and a data point, which is
 * this row's fit check and not a prediction. Below, assumed and not
 * re-taught: slope from two points and b = y - mx (row 7.1, recalled in a
 * sentence as a skill the student owns); plotting points (`m6math` row 6.1);
 * the through-the-origin test of `m7math-u3-proportional-relationships.ts`,
 * which appears only as the source of the origin-forcing trap. Concretely:
 * the words "residual", "least squares", "regression", "correlation",
 * "strong", "weak" and "predict" do not appear in any spoken field; a
 * vertical gap is never named as anything but a gap; the y-intercept of a
 * fitted line is never read as a starting value in the story; every correct
 * slope and intercept in this plan is an integer, and the only non-integers
 * that appear (the 0.5 slope of an MCQ distractor, and the 3.5 and 5.5 of
 * the misconception check) are the products of named errors, not of a fit.
 * Salvaged from `g8-math-bivariate-data.ts`: the by-eye procedure only; its
 * correlation-versus-causation material belongs to Algebra 1 and was left
 * behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U10_FITTING_A_LINE_TO_A_SCATTER_PLOT: LessonPlan = {
  id: 'evelyn.ms.m8math.fitting-a-line-to-a-scatter-plot.v1',
  title: 'Fitting a Line to a Scatter Plot',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.fitting-a-line-to-a-scatter-plot',
      standard: 'M8MATH-10.2',
      description:
        'Informally fit a straight line to a linear-looking scatter plot by eye, judge the fit (about as many points above as below, small vertical gaps), and write the line\'s equation from two points on the drawn line (CCSS 8.SP.A.2).',
    },
  ],
  prerequisites: ['m8math.scatter-plots-and-association'],
  followUps: ['m8math.using-a-linear-model-with-bivariate-data'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a rising cloud of real points in front of the student and make the wish for ONE line, with an equation, feel natural before the recipe is given.',
      script:
        'Every player on the school basketball team has two numbers next to their name this season: minutes played and points scored. Plot each player as one dot, minutes across and points up, and you get a cloud that rises from left to right, because more minutes usually means more points. Usually, not always: one player scored 20 points in only 60 minutes, and another played 120 minutes and scored 25. No single straight line runs through all of those dots. Now the coach wants one straight line that stands in for the whole team, a line with an equation, so the pattern of the team can be written down as y = mx + b. Where does that line go, and how do you know it is a good one? That is today. Drawing the line takes a ruler and two checks, and once it is drawn, its equation comes from two points on it, exactly the way you already write y = mx + b from any two points.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-fit-judge-equation',
      kind: 'concept',
      goal: 'Install the recipe: confirm the cloud is linear-looking, draw one line through the middle, run the two fit checks, read two points on the line, and write the equation the way the student already does.',
      keyIdeas: [
        'FIT A LINE ONLY WHEN THE CLOUD LOOKS LIKE A LINE — last lesson you learned to say whether a scatter plot rises, falls, or shows no pattern, and whether its points follow a straight-line path or a curve. A line of fit belongs only on a plot whose points follow a straight-line path. If the points curve or scatter with no tilt, a straight line would describe nothing, so you do not draw one.',
        'ONE STRAIGHT LINE THROUGH THE MIDDLE — lay a ruler along the tilt of the cloud so the line runs through the middle of the points, then draw it. Do not connect the dots, do not bend the line, and do not aim for any particular dot. A good line of fit often touches no data point at all, because it stands in for all of them, not for any one of them.',
        'CHECK ONE: ABOUT AS MANY ABOVE AS BELOW — count the points above your line and the points below it. If six of eight points sit on one side, the line is too high, too low, or tilted wrong; slide or turn the ruler until the two counts are close. Exactly equal is not required; four and four, or four and three, is balanced.',
        'CHECK TWO: SMALL VERTICAL GAPS — for each point, look straight up or straight down to the line. That up-and-down distance is the vertical gap, and every gap should be small compared with the numbers on the y-axis. A line with balanced counts but one point sitting far from it, or with all the points far from it, is not a good fit either. Two traps fail these checks on purpose: a line forced to start at (0, 0), and a line drawn through the first and last data points. Nothing about a line of fit requires either one; the data decide where the line goes.',
        'READ TWO POINTS ON THE LINE, NOT TWO DATA POINTS — to write the equation you need two points that sit ON your drawn line. Pick two places where the line crosses grid intersections, far apart so the slope comes out accurate. They do not have to be data points, and a data point counts only if the line actually passes through it. Two points from the data that sit above or below the line give the equation of a different line.',
        'WRITE THE EQUATION THE WAY YOU ALREADY DO — from the two points on the line, m is the change in y over the change in x, subtracting in the same order top and bottom, and a falling line gives a negative m. Then b = y - mx using either point, and the other point is your check. Two careful people fitting the same cloud by eye can end up with slightly different lines, and both equations are fine if both lines pass the two checks, because a line of fit is an estimate of the pattern, not an exact fact.',
      ],
      vocabulary: [
        { term: 'scatter plot', definition: 'a graph of paired measurements, one point per pair, with one quantity on each axis.' },
        { term: 'line of fit', definition: 'one straight line drawn by eye through the middle of a linear-looking scatter plot to stand in for the whole pattern; also called a trend line.' },
        { term: 'vertical gap', definition: 'the up-and-down distance between a data point and the line directly above or below it, measured in the units of the y-axis.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-car-wash',
      kind: 'worked_example',
      problem:
        'The student council ran a car wash on seven Saturdays and logged how many volunteers showed up and how many cars got washed, written as (volunteers, cars): (3, 14), (4, 21), (5, 22), (6, 30), (7, 31), (8, 38), (9, 40). Fit a line by eye, judge the fit, and write the equation of your line.',
      steps: [
        'Look at the cloud first. The points climb steadily from (3, 14) up to (9, 40) with no bend and no stray point far from the others, so a straight line makes sense here.',
        'Lay the ruler along the upward tilt, through the middle of the points, and draw the line. Suppose the line you settle on crosses the grid at (4, 20) and at (9, 40). Notice that (4, 20) is not a data point: the data point at 4 volunteers is (4, 21), sitting just above the line. That is fine, because the line does not have to touch any dot.',
        'Judge it by eye. The dots at 3, 5 and 7 volunteers sit just under the line, the dots at 4, 6 and 8 sit just over it, and the dot at 9 is on it. Three above, three below, all close. Both checks pass, so keep the line.',
        'Now the equation, from the two points ON the line, (4, 20) and (9, 40). Slope: m = (40 - 20) ÷ (9 - 4) = 20 ÷ 5 = 4. Then b from (4, 20): 20 = 4(4) + b, so 20 = 16 + b and b = 4. The line is y = 4x + 4.',
        'Check with the other point: 4(9) + 4 = 36 + 4 = 40, which matches (9, 40). The equation is right.',
        'The equation also lets you measure the gaps exactly instead of eyeballing them. At x = 3 through 9, y = 4x + 4 gives 16, 20, 24, 28, 32, 36, 40. Against the data 14, 21, 22, 30, 31, 38, 40 the gaps are 2 below, 1 above, 2 below, 2 above, 1 below, 2 above, and 0. The biggest gap is 2 cars on a plot where the cars run from 14 to 40, which is small. Three above and three below, all gaps small: this is a good line of fit.',
      ],
      answer: 'y = 4x + 4 (three points above the line, three below, one on it; largest vertical gap 2)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-console-resale',
      kind: 'worked_example',
      problem:
        'Seven used game consoles of the same model were listed for resale. Each is written as (age in years, price in dollars): (1, 220), (2, 185), (3, 170), (4, 130), (5, 120), (6, 85), (7, 70). Fit a line by eye, judge the fit, and write the equation of your line.',
      steps: [
        'Look at the cloud first. The points fall steadily from left to right in a straight-line pattern, so a line makes sense, and because the line falls, its slope is going to be negative.',
        'Lay the ruler along the downward tilt through the middle of the points. Suppose your line crosses the grid at (2, 190) and at (6, 90). Neither is a data point: (2, 185) and (6, 85) each sit 5 dollars below the line.',
        'Judge it by eye. The dots at 1, 3, 5 and 7 years sit a little above the line, and the dots at 2, 4 and 6 years sit a little below. Four above, three below, all close. Balanced enough, so keep the line.',
        'Slope from the two points ON the line, subtracting in the same order top and bottom: m = (90 - 190) ÷ (6 - 2) = -100 ÷ 4 = -25.',
        'WRONG: m = (190 - 90) ÷ (6 - 2) = 100 ÷ 4 = 25, taking the y-values in one order and the x-values in the other. CORRECT: a positive slope belongs to a line that climbs, and this line falls, so the sign must be negative. Keep the same order in both subtractions: 90 - 190 on top goes with 6 - 2 on the bottom, and m = -25.',
        'Then b from (2, 190): 190 = -25(2) + b, so 190 = -50 + b and b = 240. The line is y = -25x + 240.',
        'Check with the other point: -25(6) + 240 = -150 + 240 = 90, which matches (6, 90). Then the exact gaps: at x = 1 through 7 the line gives 215, 190, 165, 140, 115, 90, 65, and the data are 220, 185, 170, 130, 120, 85, 70, so the gaps are 5 above, 5 below, 5 above, 10 below, 5 above, 5 below, 5 above. The biggest gap is $10 on prices that run from $70 to $220, which is small. Good line.',
      ],
      answer: 'y = -25x + 240 (four points above the line, three below; largest vertical gap $10)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-fit-line',
      kind: 'try_yourself',
      problem:
        'Eight points on a scatter plot rise from left to right in a straight-line pattern. Four students each draw a line to fit them. Whose line is the best fit?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Jada: a straight line through the middle of the cloud, with four points a little above it and four a little below', correct: true },
        { id: 'b', text: 'Theo: a straight line from the leftmost point to the rightmost point, with six of the other points below it' },
        { id: 'c', text: 'Priya: a straight line starting at (0, 0) that passes through two of the points, with the other six points above it' },
        { id: 'd', text: 'Sam: a path that bends from point to point so that it touches all eight' },
      ],
      expectedAnswer: 'Jada: a straight line through the middle of the cloud, with four points a little above it and four a little below',
      hints: [
        'A line of fit is one straight line, and it does not need to touch any point. Run check one: how many points sit above each line, and how many below?',
        'Six points on one side means the line is shifted or tilted away from the middle. A line that starts at (0, 0) was forced there, not fitted. A path that bends is not a line at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-from-two-points',
      kind: 'try_yourself',
      problem: 'A line of fit drawn by eye crosses the grid at (2, 9) and at (6, 17), and both of those points sit on the line. Which equation describes the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 2x + 9' },
        { id: 'b', text: 'y = 0.5x + 8' },
        { id: 'c', text: 'y = 2x + 5', correct: true },
        { id: 'd', text: 'y = 2x + 13' },
      ],
      expectedAnswer: 'y = 2x + 5',
      hints: [
        'Slope first: the change in y over the change in x between the two points, subtracting in the same order on top and bottom.',
        'm = 8 ÷ 4 = 2. Then use one point: 9 = 2(2) + b, so subtract to find b. The y-value of a point is not b unless that point has x = 0. Check your equation with (6, 17).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-vertical-gap',
      kind: 'try_yourself',
      problem:
        'Ava fits a line by eye to a scatter plot. Her line crosses the grid at (1, 10) and at (4, 22). One of the data points is (3, 13), and it sits below her line. What is the vertical gap between that point and the line, in units on the y-axis? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'First write the equation of the line from the two points on it: find m from the change in y over the change in x, then b = y - mx from one of the points.',
        'm = 12 ÷ 3 = 4 and b = 6. Find the height of the line at x = 3, then subtract the y-value of the data point, 13.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-origin-and-data-points',
      kind: 'misconception_check',
      question:
        'Two students fit a line to the same scatter plot of seven points that rise in a straight-line pattern from (1, 9) to (7, 30). Leo draws his line starting at (0, 0) and ends up with six of the seven points above it. Nina draws a balanced line, but to write its equation she uses the data points (1, 9) and (7, 30), even though both of them sit above her line. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Leo: the line has to start at (0, 0).',
          misconception: 'Carrying the through-the-origin habit from proportional relationships into a line of fit, when nothing about fitting a line requires b to be 0.',
          correctsTo:
            'A line of fit is placed by the data, not by the origin. Six points above the line means the line sits too low, so it fails check one. Slide the ruler up, and turn it if the tilt is off, until about as many points sit above the line as below and every point is close to it. If a balanced line happens to pass through (0, 0), then b comes out 0, but that is a result of the fit, not a rule you start from.',
        },
        {
          answer: 'Nina: y = 3.5x + 5.5, computed from (1, 9) and (7, 30).',
          misconception: 'Taking the two points for the equation from the DATA instead of from the drawn line, because data points feel more real than grid points.',
          correctsTo:
            'The equation belongs to the line, so both points must sit ON the line. The slope she computed, (30 - 9) ÷ (7 - 1) = 21 ÷ 6 = 3.5, and the intercept 9 - 3.5(1) = 5.5, describe the line through those two data points, which runs above her drawn line and is not the line she judged to be a good fit. Read two places where her drawn line crosses grid intersections, far apart so the slope is accurate, and compute m and b from those. A data point counts only if the line actually passes through it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Fit a line only to a scatter plot whose points follow a straight-line pattern; draw one straight line through the middle of the cloud, and never connect the dots.',
        'Judge the fit two ways: about as many points above the line as below, and every vertical gap small.',
        'Do not force the line through (0, 0) or through the first and last data points; the data decide where the line goes.',
        'Get the equation from two points ON THE DRAWN LINE, far apart and easy to read; they do not have to be data points.',
        'm is the change in y over the change in x in the same order, a falling line gives a negative m, then b = y - mx from one point, and the other point is the check.',
        'A line drawn by eye is an estimate of the pattern, so two careful lines can differ a little and both be good fits.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Fitting a Line to a Scatter Plot' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
