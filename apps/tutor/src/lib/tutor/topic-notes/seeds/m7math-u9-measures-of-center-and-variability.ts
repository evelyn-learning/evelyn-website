/**
 * Grade 7 Math — Unit 9 CED 9.3: Measures of Center & Variability.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.measures-of-center-and-variability.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U9_MEASURES_OF_CENTER_AND_VARIABILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.measures-of-center-and-variability.v1',
  course: 'Grade 7 Math',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Measures of Center & Variability',
  planId: 'evelyn.ms.m7math.measures-of-center-and-variability.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.measures-of-center-and-variability.v1' }],
  theory: [
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'The mean is the balance point', content: `THE MEAN IS THE BALANCE POINT — add every value, then divide by how many values there are. For 12, 15, 15, 18, 20, 22, 24 the sum is 126 and there are 7 values, so the mean is 126 divided by 7, which is 18. The mean uses every number, which is its strength and also its weakness: one extreme value drags it.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'The median is the middle', content: `THE MEDIAN IS THE MIDDLE — put the values in order, then take the one in the middle. With 7 values the median is the 4th one. With an EVEN number of values there is no single middle, so take the two middle values and average them: for 2, 3, 3, 5, 6, 9 the middle two are 3 and 5, and the median is 4. Order the list first, every single time.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'The mode is the repeater', content: `THE MODE IS THE REPEATER — the value that appears most often. A data set can have one mode, several modes, or none at all. Mode is useful for things you cannot average, such as favorite color, but it is a weak description of center for numbers.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'Range is the roughest measure of spread', content: `RANGE IS THE ROUGHEST MEASURE OF SPREAD — subtract the smallest value from the largest. It is quick, but it looks at only two numbers in the whole set and ignores everything in between, so one strange value can blow it up.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'Mean absolute deviation measures typical distance from the mean', content: `MEAN ABSOLUTE DEVIATION MEASURES TYPICAL DISTANCE FROM THE MEAN — the MAD is the star of this lesson. Three steps. First, find the mean. Second, find how far each value sits from the mean, always as a positive distance. Third, average those distances. A small MAD means the values huddle close to the mean; a large MAD means they are scattered. Two data sets can share the same mean and be nothing alike, and the MAD is what tells them apart.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'framework', title: 'An outlier pulls the mean and barely moves the median', content: `AN OUTLIER PULLS THE MEAN AND BARELY MOVES THE MEDIAN — an outlier is a value far away from the rest. The mean is a balance point, so an extreme value tugs it hard. The median only counts positions, so an extreme value shifts it by at most one spot. When a data set has an outlier, report the median as the typical value.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'mean', content: 'the sum of all values divided by how many values there are.' },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'median', content: `the middle value of an ordered list, or the average of the two middle values when the count is even.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'mode', content: 'the value that appears most often in a data set.' },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'range', content: 'the largest value minus the smallest value.' },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'mean absolute deviation', content: `the average distance of the values from the mean, written MAD and never negative.` },
    { loId: 'm7math.measures-of-center-and-variability', kind: 'definition', title: 'outlier', content: 'a value that sits far away from the rest of the data.' },
  ],
  methods: [
    {
      title: 'Worked outlier mean vs median',
      steps: [
        'The list is already in order, which makes both jobs easier. Always order first.',
        `Mean of the six: add them. 10 plus 12 is 22, plus 15 is 37, plus 15 is 52, plus 18 is 70, plus 20 is 90. The sum is 90 and there are 6 values, so the mean is 90 divided by 6, which is 15 dollars.`,
        `Median of the six: 6 is even, so there is no single middle. The two middle values are the 3rd and 4th, which are 15 and 15. Their average is 15, so the median is 15 dollars. Mean and median agree, which is what happens when nothing extreme is present.`,
        `Now add the 85. The ordered list is 10, 12, 15, 15, 18, 20, 85. The new sum is 90 plus 85, which is 175, and there are now 7 values, so the new mean is 175 divided by 7, which is 25 dollars.`,
        `New median: 7 values, so the median is the 4th one in order. Counting in from the left, 10, 12, 15, 15 — the median is still 15 dollars.`,
        `Compare what the 85 did. The mean jumped from 15 to 25, a move of 10 dollars, and 25 is more than six of the seven friends actually received. The median did not move at all. The range also exploded, from 20 minus 10 which is 10, to 85 minus 10 which is 75.`,
        `So the median, 15 dollars, is the honest description of a typical gift in this group. The mode is 15 as well, since 15 is the only repeated value. WRONG answer to avoid: a typical gift here is 25 dollars. RIGHT answer: a typical gift here is 15 dollars, and one friend got a very unusual 85.`,
      ],
      example: { problem: `Six friends got these amounts of birthday money, in dollars: 10, 12, 15, 15, 18, 20. Find the mean and the median. Then a seventh friend joins the group with 85 dollars. Find the new mean and the new median, and say which one describes the group better.`, solution: `Six friends: mean 15 dollars, median 15 dollars. With the 85: mean 25 dollars, median 15 dollars. The median describes the group better.` },
      relatedLoIds: ['m7math.measures-of-center-and-variability'],
    },
    {
      title: 'Worked compute mad',
      steps: [
        `Step one, find the mean. Add the values: 20 plus 25 is 45, plus 30 is 75, plus 35 is 110, plus 40 is 150, plus 30 is 180. The sum is 180 and there are 6 nights, so the mean is 180 divided by 6, which is 30 minutes.`,
        `Step two, find each distance from the mean of 30. Distance is always positive, because it is a distance. From 20 the distance is 10. From 25 it is 5. From 30 it is 0. From 35 it is 5. From 40 it is 10. From the second 30 it is 0.`,
        `List those six distances: 10, 5, 0, 5, 10, 0. Notice that none of them is negative. If you write minus 10 here you have measured a direction, not a distance, and the whole calculation collapses to zero.`,
        `Step three, average the distances. Add them: 10 plus 5 is 15, plus 0 is 15, plus 5 is 20, plus 10 is 30, plus 0 is 30. The sum of the distances is 30. Divide by 6 nights: 30 divided by 6 is 5.`,
        `So the MAD is 5 minutes. Read it out in words: on a typical night, Sam is about 5 minutes away from his own average of 30 minutes.`,
        `Sanity check the size. The values run from 20 to 40, so distances from 30 can never be more than 10, and they cannot be less than 0. A MAD of 5 sits comfortably between 0 and 10, so it is believable. A MAD bigger than the range would be impossible.`,
      ],
      example: { problem: `Sam recorded how many minutes he spent on homework on six nights: 20, 25, 30, 35, 40, 30. Find the mean and the mean absolute deviation.`, solution: 'Mean 30 minutes, MAD 5 minutes' },
      relatedLoIds: ['m7math.measures-of-center-and-variability'],
    },
  ],
  pointers: [
    { content: `Students often say "0" — The mean is 6, and the signed differences are minus 3, minus 1, plus 1 and plus 3, which really do add to 0. That happens for EVERY data set, which is a clue that this cannot be the calculation. MAD asks for distance, and distance is never negative, so use the absolute values: 3, 1, 1, 3. Those add to 8, and 8 divided by 4 is 2. The MAD is 2.`, kind: 'common-error' },
    { content: `Students often say "The median of 2, 3, 3, 5, 6, 9 is 3." — Six values have no single middle. The two middle values are the 3rd and the 4th, which are 3 and 5. Average them: 3 plus 5 is 8, and 8 divided by 2 is 4. The median is 4, and notice that the median does not have to be a value that appears in the list at all.`, kind: 'common-error' },
    { content: `Mean is the sum divided by the count; median is the middle of the ORDERED list, averaging the two middle values when the count is even; mode is the value that repeats most.`, kind: 'tip' },
    { content: `Range is the largest value minus the smallest, and it uses only those two numbers.`, kind: 'tip' },
    { content: `MAD has three steps: find the mean, find each distance from the mean as a positive number, then average those distances.`, kind: 'tip' },
    { content: `Never keep the signs when finding MAD. The signed differences always add to zero, for every data set.`, kind: 'tip' },
    { content: `An outlier drags the mean and barely moves the median, so report the median as the typical value when one is present.`, kind: 'tip' },
    { content: `Order the list BEFORE finding the median — every time. The median is the middle of the *ordered* list, not the middle of the list as it was handed to you.`, kind: 'common-error' },
    { content: `Even count = no single middle. Average the two middle values. For 2, 3, 3, 5, 6, 9 the middle two are 3 and 5, so the median is 4 — not 3.`, kind: 'edge-case' },
    { content: `The median does not have to be a number that appears in the data. A median of 4 for 2, 3, 3, 5, 6, 9 is fine even though no one scored 4.`, kind: 'gotcha' },
    { content: `For MAD, drop the signs. If you keep them, the pluses and minuses cancel and you get 0 — for EVERY data set. Getting 0 is your warning that you skipped the absolute value.`, kind: 'common-error' },
    { content: `Say MAD out loud to check it: "a typical value is about ___ away from the mean." MAD is never negative and never bigger than the range. If it is, redo the distances.`, kind: 'tip' },
    { content: `Don't mix up range and MAD. Range = biggest − smallest (uses 2 numbers only). MAD = average distance from the mean (uses every number). Both measure spread; they are not the same.`, kind: 'vocab-note' },
    { content: `When an outlier is present, report the MEDIAN as typical. The mean gets dragged toward the outlier: with 10, 12, 15, 15, 18, 20, 85 the mean of 25 is bigger than six of the seven values.`, kind: 'gotcha' },
    { content: `Mode can be missing or doubled. A set can have no mode (nothing repeats) or several modes. "No mode" is a real answer — don't invent one by picking the largest value.`, kind: 'edge-case' },
  ],
};
