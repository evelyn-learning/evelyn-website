/**
 * Grade 6 Math — Unit 10 CED 10.3: Measures of Center.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.measures-of-center.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U10_MEASURES_OF_CENTER: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.measures-of-center.v1',
  course: 'Grade 6 Math',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Measures of Center',
  planId: 'evelyn.ms.m6math.measures-of-center.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.measures-of-center.v1' }],
  theory: [
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'Two ways to name the center', content: `TWO WAYS TO NAME THE CENTER — the mean and the median are both single numbers that stand in for a whole data set. Both are called measures of center, and finding them is the first step toward describing what a data set looks like.` },
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'Finding the mean', content: `FINDING THE MEAN — add up every value in the data set, then divide that total by how many values there are. The mean uses every single value, so one very unusual value pulls it toward itself.` },
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'Finding the median', content: `FINDING THE MEDIAN — put every value in order from least to greatest. With an odd number of values, the median is the one exactly in the middle. With an even number of values, there is no single middle value, so the median is the mean of the two middle values.` },
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'An outlier is a value far from the rest', content: `AN OUTLIER IS A VALUE FAR FROM THE REST — most data sets cluster together, but sometimes one value sits far above or far below the others. That value is called an outlier.` },
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'An outlier drags the mean but not the median', content: `AN OUTLIER DRAGS THE MEAN BUT NOT THE MEDIAN — because the mean divides the total by the count, one extreme value changes the total enough to shift the mean noticeably, even though only one value moved. The median only cares about order, so an outlier at one end barely changes which value ends up in the middle.` },
    { loId: 'm6math.measures-of-center', kind: 'framework', title: 'Choosing the better measure', content: `CHOOSING THE BETTER MEASURE — when a data set has no outlier, the mean and the median usually land close together, and either one describes the data well. When a data set has an outlier, the median usually describes the typical value better, because the mean has been pulled away from where most of the data actually sits.` },
    { loId: 'm6math.measures-of-center', kind: 'definition', title: 'mean', content: `the sum of every value in a data set divided by how many values there are; also called the average.` },
    { loId: 'm6math.measures-of-center', kind: 'definition', title: 'median', content: `the middle value of a data set once it is ordered from least to greatest; the mean of the two middle values when there is an even number of values.` },
    { loId: 'm6math.measures-of-center', kind: 'definition', title: 'outlier', content: `a value in a data set that is much higher or much lower than the rest of the values.` },
  ],
  methods: [
    {
      title: 'Worked piano practice no outlier',
      steps: [
        'The values are already in order from least to greatest: 12, 15, 15, 18, 20, 22.',
        `Find the mean. Add every value: 12 + 15 + 15 + 18 + 20 + 22 = 102. Divide by how many kids there are, 6: 102 / 6 = 17 minutes.`,
        `Find the median. There is an even number of values, 6, so there is no single middle value. The two middle values are the 3rd and 4th: 15 and 18. The median is their mean: (15 + 18) / 2 = 16.5 minutes.`,
        `Compare the two answers to the data: the mean is 17 minutes, and the median is 16.5 minutes. They land close together, and every one of the six practice times is fairly close to both numbers, so there is no outlier pulling anything away.`,
        `Check the mean by working backward: 17 x 6 = 102, which matches the total from the data. The mean and the median calculations both check out.`,
      ],
      example: { problem: `Six kids in a music class practiced piano last night for these numbers of minutes: 12, 15, 15, 18, 20, 22. Find the mean and the median practice time.`, solution: `Mean: 17 minutes; median: 16.5 minutes. Both are close together and either one describes a typical practice time well, since none of the six times is an outlier.` },
      relatedLoIds: ['m6math.measures-of-center'],
    },
    {
      title: 'Worked backpack prices with outlier',
      steps: [
        'The values are already in order: 20, 22, 24, 25, 28, 130.',
        `Find the mean. Add every value: 20 + 22 + 24 + 25 + 28 + 130 = 249. Divide by how many backpacks there are, 6: 249 / 6 = 41.5, so the mean price is $41.50.`,
        `Find the median. There is an even number of values, 6, so average the 3rd and 4th values: 24 and 25. The median is (24 + 25) / 2 = 24.5, so the median price is $24.50.`,
        `Compare both numbers to the data. Five of the six backpacks cost between $20 and $28. The mean, $41.50, is higher than every one of those five prices, because the single $130 backpack pulled it up. The median, $24.50, sits right inside that $20-$28 cluster, which is where most of the backpacks are actually priced.`,
        `WRONG: reporting $41.50, the mean, as the price of a typical backpack. No backpack in the store is actually close to $41.50, except the one designer backpack that pulled the mean up. CORRECT: report $24.50, the median, because it matches where most of the prices sit, and it is not distorted by the one unusually expensive backpack.`,
        `Check: the median, 24.5, sits between the two middle values 24 and 25, and both of those are inside the low cluster of prices, so the median calculation looks right.`,
      ],
      example: { problem: `The school store lists the prices, in dollars, of six backpacks: 20, 22, 24, 25, 28, 130. One backpack is a designer brand and costs far more than the others. Find the mean and the median price, and decide which one better describes the price of a TYPICAL backpack at the store.`, solution: `Mean: $41.50; median: $24.50. The median is the more appropriate measure here, because the $130 backpack is an outlier that pulls the mean away from where most of the prices sit.` },
      relatedLoIds: ['m6math.measures-of-center'],
    },
  ],
  pointers: [
    { content: `Students often say "11" — With six values in order (8, 9, 11, 12, 14, 15), there is no single middle value. The two middle values are 11 and 12. The median is their mean: (11 + 12) / 2 = 11.5, not 11.`, kind: 'common-error' },
    { content: `Students often say "The mean is always a better way to describe a typical value than the median." — The mean does use every value, and that is exactly why one very large or very small value can drag it away from the rest of the data. When a data set has an outlier, the median usually describes the typical value better, because it depends only on the order of the values, not on how far away the extreme value sits. Compute both, look at where most of the data actually sits, and choose the one that matches it.`, kind: 'common-error' },
    { content: `The mean is the sum of every value in a data set divided by how many values there are.`, kind: 'tip' },
    { content: `The median is the middle value once the data set is in order; with an even number of values, it is the mean of the two middle values.`, kind: 'tip' },
    { content: 'Both the mean and the median are called measures of center.', kind: 'tip' },
    { content: 'An outlier is a value far above or far below the rest of the data.', kind: 'tip' },
    { content: `An outlier drags the mean toward itself, but the median barely moves, because the median depends only on order.`, kind: 'tip' },
    { content: `When a data set has no outlier, the mean and the median usually land close together and either one works well; when it has an outlier, the median usually describes the typical value better.`, kind: 'tip' },
    { content: `Finding the center is the first step in describing a data set; how spread out it is comes next.`, kind: 'tip' },
    { content: `With an **even** number of values, the median is NOT one of the middle values—it's the mean of the two middle values. Always average them.`, kind: 'common-error' },
    { content: `Before you pick 'mean' or 'median,' always scan the data for an outlier. Look at a rough sketch or ask: 'Is one value far away from the rest?'`, kind: 'tip' },
    { content: `The mean **uses** every single value, which is why an outlier pulls it so hard. That's not a strength when one extreme value doesn't represent the group.`, kind: 'gotcha' },
    { content: `The median depends only on **order**, not on how far away the biggest or smallest value sits. So it ignores outliers naturally.`, kind: 'vocab-note' },
    { content: `Don't just report the mean or median—explain *why* you chose it. Say 'The median better describes a typical value because...' or 'The mean and median are close, so...'`, kind: 'tip' },
    { content: `Check your mean by multiplying it back: (mean) × (count) should equal the sum. If it doesn't, you made an arithmetic error.`, kind: 'tip' },
    { content: `An outlier doesn't have to be huge or tiny in absolute terms—it just has to sit far away from where the rest of the data clusters. Context matters.`, kind: 'edge-case' },
  ],
};
