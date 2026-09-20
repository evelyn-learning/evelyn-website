/**
 * Grade 8 Math — Unit 10 CED 10.1: Scatter Plots & Association.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.scatter-plots-and-association.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U10_SCATTER_PLOTS_AND_ASSOCIATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.scatter-plots-and-association.v1',
  course: 'Grade 8 Math',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Scatter Plots & Association',
  planId: 'evelyn.ms.m8math.scatter-plots-and-association.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.scatter-plots-and-association.v1' }],
  theory: [
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Two numbers per individual, one dot each', content: `TWO NUMBERS PER INDIVIDUAL, ONE DOT EACH — data is bivariate when every individual in the set has two measurements: one runner has 15 miles AND a 24-minute 5K, one phone has an age AND a resale price. A scatter plot turns each individual into exactly one dot, plotted as the pair (first measurement, second measurement) the same way you plot any point. Fifteen phones make fifteen dots, never a bar and never a connected line.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Building the plot', content: `BUILDING THE PLOT — put one measurement on the horizontal axis and the other on the vertical axis, label both with the quantity and its unit (miles per week, minutes), and choose a scale that fits the smallest and largest values with a little room to spare. An axis does not have to start at zero: if the times run from 20 to 30 minutes, a vertical axis from 18 to 32 shows the shape far better than one from 0 to 32. Then plot every pair, and check that the number of dots equals the number of individuals.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Positive, negative, or no association', content: `POSITIVE, NEGATIVE, OR NO ASSOCIATION — read the cloud from left to right. If the dots tend to climb as x gets larger, that is a positive association: more practice minutes tend to go with more free throws made. If the dots tend to fall, that is a negative association: more miles tend to go with lower 5K times. If the cloud has no tilt at all, so that large x-values and small x-values both come with a full mix of y-values, there is no association. The word "tend" matters, because the description is about the whole cloud, not about any single dot.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Linear or nonlinear', content: `LINEAR OR NONLINEAR — once you know the tilt, ask about the shape. If the dots follow a straight band, the pattern is linear, even though the dots do not sit exactly on one line and you do not draw one. If the band bends, the pattern is nonlinear: the height of a thrown ball plotted against time rises and then falls in an arch, and no straight band can follow that. Scattered dots inside a straight band are still a linear pattern.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Clusters', content: `CLUSTERS — sometimes the dots bunch into groups with an empty gap between them, and each bunch is a cluster. On a plot of practice minutes against free throws made, four players who all practice five to ten minutes a day form a cluster at the left, separate from the players who practice thirty minutes or more. Naming a cluster tells the reader that the individuals come in groups, which the tilt alone does not say.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'framework', title: 'Outliers', content: `OUTLIERS — an outlier is a dot that sits far from the pattern the other dots make: a player with 45 minutes of practice and only 9 free throws made, when every other player past 15 minutes made 14 or more. You name it with its coordinates, you wonder about it, and you keep describing the cloud around it. One outlier does not erase an association that the rest of the dots show.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'definition', title: 'bivariate data', content: `a data set in which every individual has two measurements, such as miles run and 5K time.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'definition', title: 'scatter plot', content: `a graph with one dot per individual, placed at the point (first measurement, second measurement).` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'definition', title: 'association', content: `the tilt of the cloud: positive if the dots tend to climb from left to right, negative if they tend to fall, none if there is no tilt.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'definition', title: 'cluster', content: `a bunch of dots grouped together with an empty gap between it and the rest of the plot.` },
    { loId: 'm8math.scatter-plots-and-association', kind: 'definition', title: 'outlier', content: 'a single dot that sits far from the pattern the other dots make.' },
  ],
  methods: [
    {
      title: 'Worked cross country plot',
      steps: [
        `Each runner has two measurements, so the data is bivariate and each runner becomes one dot. Pair them up in order: (5, 30), (8, 27), (10, 28), (12, 25), (15, 24), (18, 22), (20, 23), (24, 20). Eight runners, eight pairs.`,
        `Set up the axes. Miles go across, labeled "miles per week", from 0 to 25 with a mark every 5. Time goes up, labeled "5K time (minutes)". The times run from 20 to 30, so start the vertical axis at 18 and run it to 32 with a mark every 2; starting at 0 would squash all eight dots into the top of the picture.`,
        `Plot every pair: (5, 30) is 5 across and 30 up, (8, 27) is 8 across and 27 up, and so on through (24, 20). Count the dots when you finish: eight dots for eight runners.`,
        `Read the tilt from left to right. The first dot, (5, 30), is at the upper left and the last dot, (24, 20), is at the lower right, and the dots between them slide downhill. More miles tend to go with lower 5K times, so the association is negative.`,
        `Notice the word "tend". From 8 miles to 10 miles the time goes UP, from 27 to 28, and from 18 miles to 20 miles it goes up again, from 22 to 23. Two steps go against the tilt, and the cloud as a whole still falls. That is what a negative association looks like in real data.`,
        `Now the shape. The dots stay inside one straight downhill band with no bend, so the pattern is linear. There is no empty gap splitting the dots into groups, so there is no cluster, and no dot sits far from the band, so there is no outlier.`,
      ],
      example: { problem: `The eight runners on the cross-country team logged these miles last week and ran these 5K times, in minutes. Miles: 5, 8, 10, 12, 15, 18, 20, 24. Time: 30, 27, 28, 25, 24, 22, 23, 20. Build the scatter plot and describe what it shows.`, solution: 'Negative association with a linear pattern; no clusters and no outliers' },
      relatedLoIds: ['m8math.scatter-plots-and-association'],
    },
    {
      title: 'Worked free throws cluster outlier',
      steps: [
        `One dot per player. Practice minutes go across, from 0 to 50 with a mark every 5, and free throws made go up, from 0 to 25 with a mark every 5. Plot all nine pairs and count nine dots.`,
        `Read the tilt. Cover the dot at (45, 9) with your thumb for a moment: the other eight dots climb from (5, 8) at the lower left to (40, 22) at the upper right. More practice minutes tend to go with more free throws made, so the association is positive.`,
        `Read the shape. Those eight dots stay inside one straight rising band, with no bend, so the pattern is linear.`,
        `Look for clusters. Four dots sit bunched at 5 to 10 minutes, at (5, 8), (5, 10), (10, 11) and (10, 12), and then there is a gap before the next dot at 15 minutes. That bunch is a cluster: four players who practice only a little.`,
        `Now lift your thumb. The dot at (45, 9) is far below the band: 45 minutes of practice, but only 9 made, when every other player past 15 minutes made 14 or more. That dot is an outlier. Name it with its coordinates and keep it on the plot.`,
        `WRONG: saying the dot at (45, 9) proves there is no association. CORRECT: an association describes the whole cloud, and eight of the nine dots rise together. The outlier is worth a question, such as whether that player was shooting with a sore wrist, but it does not change what the other dots show. WRONG: saying the pattern is nonlinear because the dots do not all sit on one line. CORRECT: linear means a straight band, not a perfect line, and these dots wobble inside a straight band.`,
      ],
      example: { problem: `Nine players on the basketball team recorded their daily free-throw practice, in minutes, and how many of 25 free throws they made at Friday practice. The pairs are (5, 8), (5, 10), (10, 11), (10, 12), (15, 14), (20, 16), (30, 19), (40, 22), (45, 9). Plot the data and describe the association, the shape, any cluster, and any outlier.`, solution: `Positive association with a linear pattern, a cluster at 5 to 10 minutes, and an outlier at (45, 9)` },
      relatedLoIds: ['m8math.scatter-plots-and-association'],
    },
  ],
  pointers: [
    { content: `Students often say "No association, because the dots do not lie on one straight line." — Read the tilt, not the exactness. Eight of the nine dots climb from (5, 8) at the left to (40, 22) at the right, so more practice minutes tend to go with more free throws made: a positive association. The dots wobble inside a straight band, which is exactly what a linear pattern in real data looks like. Dots that all sat on one line would be a surprise, not a requirement.`, kind: 'common-error' },
    { content: `Students often say "No association, because the player at (45, 9) practiced the most and still made only 9." — One dot far from the pattern is an outlier, and the right move is to name it, not to let it speak for the whole team. Cover (45, 9) with your thumb and the other eight dots still rise together, so the description is a positive association with an outlier at (45, 9). The outlier is worth a question, such as whether that player was shooting with a sore wrist, but it does not change the description of the cloud.`, kind: 'common-error' },
    { content: `Bivariate data gives every individual two measurements, and a scatter plot turns each individual into exactly one dot at (first measurement, second measurement).`, kind: 'tip' },
    { content: `To build one: label both axes with the quantity and its unit, choose scales that fit the data (an axis does not have to start at zero), plot every pair, and check the number of dots against the number of individuals.`, kind: 'tip' },
    { content: `Read the tilt from left to right: dots that tend to climb show a positive association, dots that tend to fall show a negative association, and a cloud with no tilt shows no association.`, kind: 'tip' },
    { content: `Linear means the dots follow a straight band; nonlinear means the band bends. The dots do not have to sit on one line, and no line gets drawn.`, kind: 'tip' },
    { content: `A cluster is a bunch of dots with an empty gap around it. An outlier is one dot far from the pattern; name it with its coordinates and keep describing the rest.`, kind: 'tip' },
    { content: `The description is about the whole cloud. A few dots that step against the tilt, or one outlier, do not erase the association.`, kind: 'tip' },
    { content: `Don't expect dots to sit exactly on one line. Linear means a straight BAND with wobble inside it, not a perfect line. Real data always scatters.`, kind: 'common-error' },
    { content: `Don't let one outlier kill the association. Name it, keep it on the plot, and describe what the other dots show. One weird dot ≠ no pattern.`, kind: 'gotcha' },
    { content: `Count your dots before you describe. Number of dots = number of individuals. If they don't match, you missed one or plotted twice.`, kind: 'tip' },
    { content: `Association is about the whole cloud's tilt, not single dots. A few dots can go against the trend (like 8→10 minutes, time goes UP) and the association still holds.`, kind: 'vocab-note' },
    { content: `Axes don't have to start at zero. If times run 20–30 minutes, use 18–32 on the y-axis to show the shape clearly, not 0–32.`, kind: 'tip' },
    { content: `A cluster needs an empty gap. Dots bunched together with space between them and the rest = cluster. Dots spread across the whole range = no cluster.`, kind: 'vocab-note' },
    { content: `Name outliers with their coordinates: (45, 9), not just 'the point on the right.' The coordinates tell the reader exactly what's unusual.`, kind: 'vocab-note' },
    { content: `Nonlinear = the band bends, not 'dots are messy.' A curve that rises then flattens, or dips then rises, is nonlinear even if dots stay close to it.`, kind: 'common-error' },
  ],
};
