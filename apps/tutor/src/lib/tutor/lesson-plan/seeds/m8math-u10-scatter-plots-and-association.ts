/**
 * Grade 8 Math — Bivariate Data: Scatter Plots & Association.
 *
 * CONCEPT-LED. The student already plots points; what is new is that a whole
 * set of paired measurements can be turned into a cloud of dots, and that the
 * cloud has a SHAPE worth describing (CCSS 8.SP.A.1). The lesson builds one
 * mental model: every individual becomes exactly one dot, and the cloud is
 * then read for four things, in a fixed order — which way it tilts (positive,
 * negative, or no association), whether it follows a straight band or bends
 * (linear or nonlinear), whether the dots bunch into clusters, and whether any
 * single dot sits far from the pattern (an outlier). The word "tends" carries
 * the lesson: an association is a statement about the whole cloud, so a dot
 * that steps against the tilt, or one outlier, does not erase it. The two
 * traps this plan is built to kill are expecting the dots to sit exactly on a
 * line before calling the pattern linear (or calling it an association at
 * all), and letting one outlier overturn what the other dots show.
 *
 * SCOPE GUARD: Grade 8 row 10.1 constructs a scatter plot from bivariate
 * measurement data and describes clustering, outliers, positive/negative/no
 * association and linear vs nonlinear pattern. Builds on `m6math` row 6.1
 * (plotting points — assumed); does not revisit one-variable statistics from
 * `m7math-u9-*`. Withholds: fitting a line (row 10.2); strength language and
 * correlation vs causation → `alg1-u10-scatterplots-trend-lines.ts`.
 * Concretely: no line is ever drawn through a cloud, no equation of a line is
 * written, and no prediction is read off a plot (rows 10.2 and 10.3); the
 * words "strong", "weak", "strength", "correlation" and "causation" appear
 * nowhere in the plan body below this comment, and no sentence claims that
 * one measurement makes the other happen — the plan says only that larger
 * x-values "tend to go with" larger or smaller y-values; no mean, median, or
 * MAD is computed. The word "linear" is used only as the name of a
 * straight-band SHAPE: the concept segment defines it that way (the dots need
 * not sit on one line, and no line is drawn), and the worked examples,
 * misconception check and recap repeat that definition wherever they judge a
 * shape. Plotting a pair as a point is recalled in a clause, never re-taught.
 * Salvaged from `g8-math-bivariate-data.ts`: the shape of its
 * positive/negative/none examples (practice against shots made, screen time
 * against sleep) only; its "correlation" wording, its strength keyIdea, its
 * line of best fit, and its correlation-is-not-causation material were
 * deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U10_SCATTER_PLOTS_AND_ASSOCIATION: LessonPlan = {
  id: 'evelyn.ms.m8math.scatter-plots-and-association.v1',
  title: 'Scatter Plots & Association',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.scatter-plots-and-association',
      standard: 'M8MATH-10.1',
      description:
        'Construct a scatter plot from bivariate measurement data and describe clustering, outliers, positive/negative/no association and linear vs nonlinear pattern (CCSS 8.SP.A.1).',
    },
  ],
  prerequisites: ['m8math.pythagorean-applications-and-distance-between-points'],
  followUps: ['m8math.fitting-a-line-to-a-scatter-plot'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn a two-column table the student cannot read at a glance into a cloud of dots whose shape says something, before any of the shape words are defined.',
      script:
        'The cross-country team keeps a whiteboard in the locker room with two numbers next to every runner: miles run last week, and their latest 5K time. Eight runners, sixteen numbers, and staring at the list tells you almost nothing. Now turn each runner into a single dot, with miles across and time up. Eight dots, and suddenly the whole team has a shape: the dots slide downhill from left to right, so the runners who logged more miles tend to have faster times. That picture is a scatter plot. Today you build one from a table, and then you learn the four things to say about the shape you see: which way it tilts, whether it follows a straight band or bends, whether the dots bunch into clusters, and whether any dot sits far away from the rest.',
      suggestedTools: ['show_scatter_plot'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-cloud',
      kind: 'concept',
      goal: 'Build a scatter plot from bivariate data and install the four things to say about its shape: the tilt (positive, negative, or none), straight or bent, clusters, and outliers.',
      keyIdeas: [
        'TWO NUMBERS PER INDIVIDUAL, ONE DOT EACH — data is bivariate when every individual in the set has two measurements: one runner has 15 miles AND a 24-minute 5K, one phone has an age AND a resale price. A scatter plot turns each individual into exactly one dot, plotted as the pair (first measurement, second measurement) the same way you plot any point. Fifteen phones make fifteen dots, never a bar and never a connected line.',
        'BUILDING THE PLOT — put one measurement on the horizontal axis and the other on the vertical axis, label both with the quantity and its unit (miles per week, minutes), and choose a scale that fits the smallest and largest values with a little room to spare. An axis does not have to start at zero: if the times run from 20 to 30 minutes, a vertical axis from 18 to 32 shows the shape far better than one from 0 to 32. Then plot every pair, and check that the number of dots equals the number of individuals.',
        'POSITIVE, NEGATIVE, OR NO ASSOCIATION — read the cloud from left to right. If the dots tend to climb as x gets larger, that is a positive association: more practice minutes tend to go with more free throws made. If the dots tend to fall, that is a negative association: more miles tend to go with lower 5K times. If the cloud has no tilt at all, so that large x-values and small x-values both come with a full mix of y-values, there is no association. The word "tend" matters, because the description is about the whole cloud, not about any single dot.',
        'LINEAR OR NONLINEAR — once you know the tilt, ask about the shape. If the dots follow a straight band, the pattern is linear, even though the dots do not sit exactly on one line and you do not draw one. If the band bends, the pattern is nonlinear: the height of a thrown ball plotted against time rises and then falls in an arch, and no straight band can follow that. Scattered dots inside a straight band are still a linear pattern.',
        'CLUSTERS — sometimes the dots bunch into groups with an empty gap between them, and each bunch is a cluster. On a plot of practice minutes against free throws made, four players who all practice five to ten minutes a day form a cluster at the left, separate from the players who practice thirty minutes or more. Naming a cluster tells the reader that the individuals come in groups, which the tilt alone does not say.',
        'OUTLIERS — an outlier is a dot that sits far from the pattern the other dots make: a player with 45 minutes of practice and only 9 free throws made, when every other player past 15 minutes made 14 or more. You name it with its coordinates, you wonder about it, and you keep describing the cloud around it. One outlier does not erase an association that the rest of the dots show.',
      ],
      vocabulary: [
        { term: 'bivariate data', definition: 'a data set in which every individual has two measurements, such as miles run and 5K time.' },
        { term: 'scatter plot', definition: 'a graph with one dot per individual, placed at the point (first measurement, second measurement).' },
        { term: 'association', definition: 'the tilt of the cloud: positive if the dots tend to climb from left to right, negative if they tend to fall, none if there is no tilt.' },
        { term: 'cluster', definition: 'a bunch of dots grouped together with an empty gap between it and the rest of the plot.' },
        { term: 'outlier', definition: 'a single dot that sits far from the pattern the other dots make.' },
      ],
      suggestedTools: ['show_scatter_plot', 'show_table', 'show_coordinate_plane'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cross-country-plot',
      kind: 'worked_example',
      problem:
        'The eight runners on the cross-country team logged these miles last week and ran these 5K times, in minutes. Miles: 5, 8, 10, 12, 15, 18, 20, 24. Time: 30, 27, 28, 25, 24, 22, 23, 20. Build the scatter plot and describe what it shows.',
      steps: [
        'Each runner has two measurements, so the data is bivariate and each runner becomes one dot. Pair them up in order: (5, 30), (8, 27), (10, 28), (12, 25), (15, 24), (18, 22), (20, 23), (24, 20). Eight runners, eight pairs.',
        'Set up the axes. Miles go across, labeled "miles per week", from 0 to 25 with a mark every 5. Time goes up, labeled "5K time (minutes)". The times run from 20 to 30, so start the vertical axis at 18 and run it to 32 with a mark every 2; starting at 0 would squash all eight dots into the top of the picture.',
        'Plot every pair: (5, 30) is 5 across and 30 up, (8, 27) is 8 across and 27 up, and so on through (24, 20). Count the dots when you finish: eight dots for eight runners.',
        'Read the tilt from left to right. The first dot, (5, 30), is at the upper left and the last dot, (24, 20), is at the lower right, and the dots between them slide downhill. More miles tend to go with lower 5K times, so the association is negative.',
        'Notice the word "tend". From 8 miles to 10 miles the time goes UP, from 27 to 28, and from 18 miles to 20 miles it goes up again, from 22 to 23. Two steps go against the tilt, and the cloud as a whole still falls. That is what a negative association looks like in real data.',
        'Now the shape. The dots stay inside one straight downhill band with no bend, so the pattern is linear. There is no empty gap splitting the dots into groups, so there is no cluster, and no dot sits far from the band, so there is no outlier.',
      ],
      answer: 'Negative association with a linear pattern; no clusters and no outliers',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-free-throws-cluster-outlier',
      kind: 'worked_example',
      problem:
        'Nine players on the basketball team recorded their daily free-throw practice, in minutes, and how many of 25 free throws they made at Friday practice. The pairs are (5, 8), (5, 10), (10, 11), (10, 12), (15, 14), (20, 16), (30, 19), (40, 22), (45, 9). Plot the data and describe the association, the shape, any cluster, and any outlier.',
      steps: [
        'One dot per player. Practice minutes go across, from 0 to 50 with a mark every 5, and free throws made go up, from 0 to 25 with a mark every 5. Plot all nine pairs and count nine dots.',
        'Read the tilt. Cover the dot at (45, 9) with your thumb for a moment: the other eight dots climb from (5, 8) at the lower left to (40, 22) at the upper right. More practice minutes tend to go with more free throws made, so the association is positive.',
        'Read the shape. Those eight dots stay inside one straight rising band, with no bend, so the pattern is linear.',
        'Look for clusters. Four dots sit bunched at 5 to 10 minutes, at (5, 8), (5, 10), (10, 11) and (10, 12), and then there is a gap before the next dot at 15 minutes. That bunch is a cluster: four players who practice only a little.',
        'Now lift your thumb. The dot at (45, 9) is far below the band: 45 minutes of practice, but only 9 made, when every other player past 15 minutes made 14 or more. That dot is an outlier. Name it with its coordinates and keep it on the plot.',
        'WRONG: saying the dot at (45, 9) proves there is no association. CORRECT: an association describes the whole cloud, and eight of the nine dots rise together. The outlier is worth a question, such as whether that player was shooting with a sore wrist, but it does not change what the other dots show. WRONG: saying the pattern is nonlinear because the dots do not all sit on one line. CORRECT: linear means a straight band, not a perfect line, and these dots wobble inside a straight band.',
      ],
      answer: 'Positive association with a linear pattern, a cluster at 5 to 10 minutes, and an outlier at (45, 9)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-phone-prices-direction',
      kind: 'try_yourself',
      problem:
        'A scatter plot shows fifteen used phones. Each dot is one phone: the months since it was bought (x) and its resale price in dollars (y). The dots run from the upper left to the lower right inside a straight band, and no dot sits far from the others. Which statement describes the association?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Positive, because age and price are both quantities that can only grow over time' },
        { id: 'b', text: 'Positive, because the highest dots are on the left side of the plot' },
        { id: 'c', text: 'No association, because the dots do not all lie on one straight line' },
        { id: 'd', text: 'Negative, because as the months go up the prices tend to go down', correct: true },
      ],
      expectedAnswer: 'Negative, because as the months go up the prices tend to go down',
      hints: [
        'Follow the cloud from left to right. As the months since purchase get larger, do the prices tend to get larger or smaller?',
        'Dots that slide downhill from left to right show a negative association. The dots do not have to sit on one line for the association to be there; they only have to tend one way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-plot-is-nonlinear',
      kind: 'try_yourself',
      problem: 'Four scatter plots are described below. Which one shows a NONLINEAR pattern?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hours of babysitting in a month and dollars earned: the dots rise from lower left to upper right inside a straight band' },
        { id: 'b', text: 'Minutes since a cup of hot chocolate was poured and its temperature: the dots drop quickly at first, then flatten out along a curve', correct: true },
        { id: 'c', text: 'Age of a bike in years and its resale price: the dots fall from upper left to lower right inside a straight band, with one dot far below the others' },
        { id: 'd', text: 'Shoe size and number of pets at home: the dots are spread all over with no tilt at all' },
      ],
      expectedAnswer: 'Minutes since a cup of hot chocolate was poured and its temperature: the dots drop quickly at first, then flatten out along a curve',
      hints: [
        'Linear or nonlinear is a question about the shape of the band, not about the tilt. A rising band and a falling band are both straight.',
        'One outlier does not bend a band, and a cloud with no tilt is not the same as a bent one. Look for the description where the band itself curves.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-count-dots',
      kind: 'try_yourself',
      problem:
        'Ten students each recorded their screen time yesterday, in hours, and how many hours they slept last night. The dots on the scatter plot are (1, 9), (2, 8.5), (2, 8), (3, 8), (3, 7), (4, 7.5), (4, 6.5), (5, 6), (6, 6.5), (7, 5.5). How many dots show a student with at least 4 hours of screen time AND fewer than 7 hours of sleep? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        '"At least 4 hours" means 4 or more, so start by listing every dot whose first number is 4, 5, 6, or 7.',
        'Of those dots, keep only the ones whose second number is below 7. A dot at exactly 7.5 hours of sleep does not count.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-perfect-line-and-outlier',
      kind: 'misconception_check',
      question:
        'Two students look at the free-throw plot from the second worked example. Dev says the plot shows no association, because the dots do not lie on one straight line. Lena says the plot shows no association either, because the player at (45, 9) practiced the most and still made only 9. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'No association, because the dots do not lie on one straight line.',
          misconception: 'Expecting the dots of an association to sit exactly on a line, when an association is a tendency across the whole cloud.',
          correctsTo:
            'Read the tilt, not the exactness. Eight of the nine dots climb from (5, 8) at the left to (40, 22) at the right, so more practice minutes tend to go with more free throws made: a positive association. The dots wobble inside a straight band, which is exactly what a linear pattern in real data looks like. Dots that all sat on one line would be a surprise, not a requirement.',
        },
        {
          answer: 'No association, because the player at (45, 9) practiced the most and still made only 9.',
          misconception: 'Letting a single outlier overturn the pattern that the rest of the dots show.',
          correctsTo:
            'One dot far from the pattern is an outlier, and the right move is to name it, not to let it speak for the whole team. Cover (45, 9) with your thumb and the other eight dots still rise together, so the description is a positive association with an outlier at (45, 9). The outlier is worth a question, such as whether that player was shooting with a sore wrist, but it does not change the description of the cloud.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bivariate data gives every individual two measurements, and a scatter plot turns each individual into exactly one dot at (first measurement, second measurement).',
        'To build one: label both axes with the quantity and its unit, choose scales that fit the data (an axis does not have to start at zero), plot every pair, and check the number of dots against the number of individuals.',
        'Read the tilt from left to right: dots that tend to climb show a positive association, dots that tend to fall show a negative association, and a cloud with no tilt shows no association.',
        'Linear means the dots follow a straight band; nonlinear means the band bends. The dots do not have to sit on one line, and no line gets drawn.',
        'A cluster is a bunch of dots with an empty gap around it. An outlier is one dot far from the pattern; name it with its coordinates and keep describing the rest.',
        'The description is about the whole cloud. A few dots that step against the tilt, or one outlier, do not erase the association.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Scatter Plots & Association' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
