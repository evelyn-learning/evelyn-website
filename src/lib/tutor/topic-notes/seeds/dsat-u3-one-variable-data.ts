/**
 * Digital SAT — Unit 3 CED 3.3: One-Variable Data: Center, Spread & Boxplots.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.one-variable-data.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U3_ONE_VARIABLE_DATA: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.one-variable-data.v1',
  course: 'Digital SAT',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'One-Variable Data: Center, Spread & Boxplots',
  planId: 'evelyn.testprep.dsat.one-variable-data.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.one-variable-data.v1' }],
  theory: [
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Five-number summary', content: `FIVE-NUMBER SUMMARY — min, Q1 (first quartile), median, Q3 (third quartile), max. A boxplot IS this summary drawn as a picture: a box from Q1 to Q3 with a line at the median, and whiskers extending out to min and max.` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Finding quartiles', content: `FINDING QUARTILES — sort the data. The median splits it in half. Q1 = the median of the LOWER half; Q3 = the median of the UPPER half. With an odd count, exclude the middle value from both halves before splitting.` },
    { loId: 'dsat.one-variable-data', content: `IQR (interquartile range) = Q3 − Q1 = the spread of the MIDDLE 50% of the data. A larger IQR means the middle of the distribution is more spread out.` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Trap', content: `TRAP — BOXPLOT SECTIONS ARE EQUAL-COUNT, NOT EQUAL-DENSITY. Each of the four sections (below Q1, Q1-to-median, median-to-Q3, above Q3) holds exactly 25% of the data, no matter how wide or narrow it looks. A long whisker means that quarter is SPREAD OUT, not that it contains more points — a short section means that quarter is tightly CLUSTERED.` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Mean vs median', content: `MEAN VS MEDIAN — mean = sum ÷ count, and it gets pulled toward outliers and skew. Median = the middle value, and it is resistant to outliers. On a skewed or outlier-heavy data set, median (with IQR) describes it better than mean (with standard deviation).` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Skew', content: `SKEW — right-skewed (long right tail): mean > median. Left-skewed (long left tail): mean < median. Roughly symmetric: mean ≈ median.` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Standard deviation', content: `STANDARD DEVIATION — a measure of typical distance from the mean. The SAT almost always tests it qualitatively ("which data set has the greater standard deviation?") rather than by formula: more spread out = larger SD, more tightly clustered = smaller SD.` },
    { loId: 'dsat.one-variable-data', kind: 'framework', title: 'Comparing two distributions', content: `COMPARING TWO DISTRIBUTIONS — when two boxplots (or dot plots) are shown side by side, compare CENTER (medians or means) and SPREAD (IQR or range) SEPARATELY. A higher median does not imply a smaller spread, and vice versa.` },
    { loId: 'dsat.one-variable-data', kind: 'definition', title: 'interquartile range (IQR)', content: 'Q3 minus Q1 — the range spanned by the middle 50% of the data.' },
    { loId: 'dsat.one-variable-data', kind: 'definition', title: 'five-number summary', content: 'min, Q1, median, Q3, max — the five values a boxplot displays.' },
    { loId: 'dsat.one-variable-data', kind: 'definition', title: 'outlier', content: 'a value far from the rest of the data; pulls the mean but not the median.' },
  ],
  methods: [
    {
      title: 'Worked five number summary',
      steps: [
        'n = 11, so the median is the 6th value: 27.',
        `Lower half (values before the median): 10, 14, 18, 20, 24 — its median is the 3rd value, Q1 = 18.`,
        `Upper half (values after the median): 30, 33, 36, 40, 45 — its median is the 3rd value, Q3 = 36.`,
        'Five-number summary: min = 10, Q1 = 18, median = 27, Q3 = 36, max = 45.',
        'IQR = Q3 − Q1 = 36 − 18 = 18.',
      ],
      example: { problem: `A set of 11 daily high temperatures (°F), sorted: 10, 14, 18, 20, 24, 27, 30, 33, 36, 40, 45. Find the five-number summary and the IQR.`, solution: 'Five-number summary: 10, 18, 27, 36, 45; IQR = 18' },
      relatedLoIds: ['dsat.one-variable-data'],
    },
    {
      title: 'Worked boxplot density trap',
      steps: [
        'The interval from 20 to 32 is exactly Q1 to Q3 — the box itself.',
        `By definition, each of a boxplot’s four sections (below Q1, Q1-to-median, median-to-Q3, above Q3) contains exactly 25% of the data, regardless of how wide or narrow it is drawn.`,
        `The box combines two of those sections (Q1-to-median and median-to-Q3): 25% + 25% = 50%.`,
        `So exactly 50% of the values lie between 20 and 32 — even though the whisker from 32 to 48 looks "wider," it holds the SAME 25% as the narrow section from 25 to 32. Width shows spread, not headcount.`,
      ],
      example: { problem: `A boxplot has five-number summary: min = 12, Q1 = 20, median = 25, Q3 = 32, max = 48. Approximately what percentage of the data values lie between 20 and 32?`, solution: '50%' },
      relatedLoIds: ['dsat.one-variable-data'],
    },
  ],
  pointers: [
    { content: `A boxplot splits the data into four EQUAL-COUNT sections (25% each), regardless of how far apart the values in each section are. A long whisker means that quarter of the data is spread over a WIDE range of values — not that it contains MORE points. A narrow box means the middle 50% of values are clustered close together. Length shows spread (sparse vs. dense), never headcount.`, kind: 'common-error' },
    { content: `Five-number summary: min, Q1, median, Q3, max — a boxplot is just this drawn as a box (Q1 to Q3) with whiskers to min and max.`, kind: 'tip' },
    { content: `IQR = Q3 − Q1 = spread of the middle 50%. Every boxplot section holds 25% of the data no matter how wide or narrow it’s drawn — length shows spread, not headcount.`, kind: 'tip' },
    { content: `Median is resistant to outliers; mean is not. Use median + IQR for skewed/outlier-heavy data, mean + SD for roughly symmetric data.`, kind: 'tip' },
    { content: `Comparing two boxplots: compare medians for center and box width (IQR) or whisker spread for variability — separately, never one for the other.`, kind: 'tip' },
    { content: `Frequency-table trap: when data is given as a table of values with counts (or a dot plot), the median is the middle *data point*, not the middle row. With 40 total values, find the 20th–21st values by running a cumulative count — don't average the value column.`, kind: 'common-error' },
    { content: `"Which data set has the greater standard deviation?" almost never needs a calculation. Compare how far values sit from their own mean — a set clustered near its center has smaller SD, even if its values are much larger numbers.`, kind: 'tip' },
    { content: `Adding a constant to every value shifts mean and median by that constant but leaves range, IQR, and SD unchanged. Questions phrased "each value is increased by 5 — which measure is unchanged?" are testing exactly this.`, kind: 'edge-case' },
    { content: `Watch the words: **range** = max − min (one subtraction, uses the extremes), **IQR** = Q3 − Q1 (middle 50%). Answer choices deliberately include both. Circle which one the stem asks for before computing.`, kind: 'vocab-note' },
    { content: `Removing or adding one extreme value: the mean moves noticeably, the median usually barely moves or not at all. If a question asks "which changes the most?" with an outlier removed, the answer is mean or SD — not median or IQR.`, kind: 'gotcha' },
    { content: `Skew direction is named for the TAIL, not the bump. A long right tail = right-skewed = mean > median, even though most data sits on the left. Don't read 'the data leans left' as left-skewed.`, kind: 'gotcha' },
    { content: `In a boxplot, a whisker can have zero length and the median line can sit flush against Q1 or Q3 — that's legal, not an error. It just means those 25% chunks are identical or nearly identical values.`, kind: 'edge-case' },
    { content: `For an odd count, the median value itself is excluded from BOTH halves when finding Q1 and Q3. Including it shifts both quartiles and gives an IQR that matches a wrong answer choice.`, kind: 'common-error' },
  ],
};
