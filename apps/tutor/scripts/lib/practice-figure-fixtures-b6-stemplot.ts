/**
 * Batch-6 fixtures, part "stemplot" (stem-and-leaf plots, single and
 * back-to-back) — see practice-figure-fixtures-batch5.ts for the conventions.
 *
 * Kept LOCAL (not pushed into FIGURE_FIXTURES): the global list feeds the
 * byte-pin files scripts/lib/practice-figure-pins-*.json.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'stem-simple-test-scores',
    note: 'simple: the AP seed stemplot (14 test scores, stems 6–9) with Stem / Leaf headers and a key',
    question: 'The stemplot shows 14 test scores. What is the median score?',
    alt: 'A stem-and-leaf plot of test scores, stems 6 to 9, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        title: 'Unit test scores',
        key: { stem: 6, leaf: 2 }, units: 'points',
        stems: [6, 7, 8, 9],
        leaves: [[2, 6], [0, 3, 5, 8, 9], [0, 1, 2, 4, 8], [1, 5]],
        stemLabel: 'Stem', leafLabel: 'Leaf',
      },
    },
  },
  {
    id: 'stem-skewed-commute-outlier',
    note: 'simple: a right-skewed distribution with an empty stem and one high outlier by the 1.5×IQR rule',
    question: 'The stemplot shows the commute times of 18 workers. Which commute time is an outlier by the 1.5 × IQR rule?',
    alt: 'A stem-and-leaf plot of commute times in minutes, stems 0 to 5, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        title: 'Commute times',
        key: { stem: 2, leaf: 5 }, units: 'minutes',
        stems: [0, 1, 2, 3, 4, 5],
        leaves: [[5, 8], [0, 2, 2, 4, 5, 7, 8], [0, 1, 3, 5, 8], [0, 4], [1], [8]],
      },
    },
  },
  {
    id: 'stem-back-to-back-classes',
    note: 'simple: back-to-back — Class A leaves to the left (increasing outward), Class B to the right, one empty side',
    question: 'The back-to-back stemplot shows quiz scores for two classes. Which class has the greater median score?',
    alt: 'A back-to-back stem-and-leaf plot comparing quiz scores of Class A and Class B, stems 5 to 9, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        title: 'Quiz scores',
        key: { stem: 7, leaf: 4, leftLeaf: 1 }, units: 'points',
        stems: [5, 6, 7, 8, 9],
        left: { label: 'Class A', leaves: [[8], [2, 5, 7], [0, 1, 4, 6, 8], [2, 3, 5], [1]] },
        right: { label: 'Class B', leaves: [[], [4, 9], [2, 5, 8], [0, 3, 4, 6, 7, 9], [0, 2, 5]] },
      },
    },
  },
  {
    id: 'stem-split-decimal-battery',
    note: 'simple: split stems (each stem twice: leaves 0–4, then 5–9) with a leaf unit of 0.1 hour',
    question: 'The stemplot shows battery life in hours for 15 phones. How many phones lasted more than 4.4 hours?',
    alt: 'A stem-and-leaf plot with split stems of battery life in hours, stems 3 to 5, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        title: 'Battery life',
        key: { stem: 4, leaf: 3 }, units: 'hours', leafUnit: 0.1, split: true,
        stems: [3, 3, 4, 4, 5, 5],
        leaves: [[1, 4], [5, 7, 8, 9], [0, 0, 2, 3, 4], [5, 6, 8], [], [9]],
      },
    },
  },
  {
    id: 'stem-dense-reaction-times',
    note: 'dense: 12 stems and 28 leaves on the longest row, at the tightest leaf spacing (warns: crowded)',
    question: 'The stemplot shows reaction times. How many times are at least 150 milliseconds?',
    alt: 'A stem-and-leaf plot of reaction times in milliseconds, stems 10 to 21, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        title: 'Reaction times',
        key: { stem: 15, leaf: 2 }, units: 'ms',
        stems: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        leaves: [
          [4, 8], [0, 1, 3, 5, 5, 7, 9], [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 9, 9],
          [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9],
          [0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9], [0, 1, 2, 4, 5, 7, 8], [1, 3, 6, 9], [2, 5], [0, 7], [], [3], [6],
        ],
      },
    },
  },
  {
    id: 'stem-dense-back-to-back-pulse',
    note: 'dense: back-to-back with 15 leaves on the widest side and long group names',
    question: 'The stemplot shows resting pulse rates. What is the range of the rates for the group that exercises?',
    alt: 'A back-to-back stem-and-leaf plot comparing pulse rates of students who exercise and students who do not, stems 5 to 10, with a key.',
    spec: {
      type: 'stemplot',
      params: {
        key: { stem: 7, leaf: 2, leftLeaf: 8 }, units: 'beats per minute',
        stems: [5, 6, 7, 8, 9, 10],
        left: { label: 'Exercise regularly', leaves: [[2, 4, 6, 8, 9], [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9], [0, 1, 2, 4, 8], [3], [], []] },
        right: { label: 'Do not exercise', leaves: [[], [4, 8], [0, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8, 9], [0, 0, 2, 3, 4, 6, 8], [1, 5, 7], [2]] },
      },
    },
  },
  {
    id: 'stem-blank-missing-leaf',
    note: 'blank: one leaf left out as a "?" box — the mean is given, so the missing value can be found',
    question: 'The mean of the 10 values is 32. What value is hidden by the "?"?',
    alt: 'A stem-and-leaf plot of ten values, stems 1 to 4, with one leaf hidden by a question mark, and a key.',
    spec: {
      type: 'stemplot',
      params: {
        key: { stem: 3, leaf: 1 },
        stems: [1, 2, 3, 4],
        leaves: [[8], [2, 5, 9], [0, 3, '?', 6], [4, 7]],
      },
    },
  },
];
