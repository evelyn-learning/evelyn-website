/** GreenApple T2 figure items — group "stats-stemplot". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, falseOne, type Ctx, type Item } from './kit';

const stat = (c: Ctx, s: string, side?: string): number => c.num('stem_stat', side ? { stat: s, side } : { stat: s });
const between = (c: Ctx, lo: number, hi: number): number => c.num('stem_count_where', { op: 'between', value: lo, to: hi });

export const ITEMS: Item[] = [
  ...G('apstats.quantitative-graphs', 'Reading a stemplot through its key and regrouping it', [
    {
      t: 'count read through a decimal key', d: 2, need: 'calc',
      spec: S('stemplot', {
        title: '100-meter dash times',
        key: { stem: 13, leaf: 5 }, units: 'seconds', leafUnit: 0.1,
        stems: [12, 13, 14, 15, 16],
        leaves: [[4, 8], [0, 2, 5, 5, 7, 9], [1, 1, 3, 4, 6, 8], [0, 2, 7], [3]],
        stemLabel: 'Stem', leafLabel: 'Leaf',
      }),
      alt: 'The plot shows the 100-meter dash times of 18 runners, with stems 12 to 16 and a key reading 13 | 5 as 13.5 seconds.',
      q: 'The stemplot shows the 100-meter dash times of 18 runners. How many runners had a time of 13.5 seconds or less?',
      n: '6',
      ck: ['stem_count_where', { op: 'le', value: 13.5 }],
      h: ['Use the key to turn a stem and a leaf into a time: the leaf is the tenths digit.', 'Count every leaf on the rows whose times are at or below the stated time, stopping partway through a row if you need to.'],
      s: 'Read from the figure: the key says 13 | 5 = 13.5 seconds. Stem 12 gives 12.4 and 12.8 (2 times). Stem 13 gives 13.0, 13.2, 13.5, 13.5 at or below 13.5 (4 times); 13.7 and 13.9 are slower. 2 + 4 = 6 runners.',
    },
    {
      t: 'tallest bar of a histogram built from a split-stem plot', d: 3, need: 'calc',
      spec: S('stemplot', {
        title: 'Resting heart rates',
        key: { stem: 6, leaf: 8 }, units: 'beats per minute', split: true,
        stems: [5, 6, 6, 7, 7, 8, 8],
        leaves: [[7, 9], [0, 2, 3], [5, 6, 7, 8, 8, 9], [0, 1, 1, 4], [5, 6, 9], [1, 3], [8]],
      }),
      alt: 'The plot shows the resting heart rates of 21 people on split stems: stems 6, 7 and 8 each take two rows (low leaves, then high leaves) and stem 5 has only its high row.',
      q: 'The split-stem plot shows the resting heart rates of 21 people. The same data are to be shown in a histogram with bins of width 10 beats per minute: 50 to under 60, 60 to under 70, and so on. How many people would the tallest bar of the histogram stand for?',
      n: '9',
      calc: ['the largest count of values in 50–59, 60–69, 70–79, 80–89, each by stem_count_where between', (c) => Math.max(...[50, 60, 70, 80].map((v) => between(c, v, v + 9)))],
      h: ['A bin of width 10 here covers both rows of one stem: its low-leaf row and its high-leaf row together.', 'Add the leaf counts of the two rows of each stem, then pick the largest total.'],
      s: 'Read from the figure: stem 5 has one row with 2 leaves (57, 59). Stem 6 has 3 + 6 = 9 leaves (60–69). Stem 7 has 4 + 3 = 7 leaves (70–79). Stem 8 has 2 + 1 = 3 leaves (80–89). The bins of width 10 hold 2, 9, 7 and 3 people, so the tallest bar stands for 9 people. The longest single row (6 leaves) is only half a bin.',
    },
    {
      t: 'false statement about a plot with a leaf unit of ten', d: 2, need: 'reason',
      spec: S('stemplot', {
        title: 'Lengths of library books',
        key: { stem: 2, leaf: 4 }, units: 'pages', leafUnit: 10,
        stems: [1, 2, 3, 4, 5],
        leaves: [[5, 8], [0, 2, 4, 4, 7], [1, 3, 6, 9], [2], [0]],
      }),
      alt: 'The plot shows the lengths of 13 library books, with stems 1 to 5 and a key reading 2 | 4 as 240 pages.',
      q: 'The stemplot shows the lengths of 13 library books, to the nearest 10 pages. Which statement about the books is FALSE?',
      o: [
        ['The shortest book has 15 pages.', 'correct'],
        ['The longest book has 500 pages.', 'reads the last row as 50 pages by ignoring the key, which makes each leaf a tens digit'],
        ['Two of the books have 240 pages.', 'misses that a repeated leaf is a repeated value'],
        ['Five books have 200 to 290 pages.', 'counts only distinct leaves on the stem-2 row, or reads the row as 20 to 29 pages'],
      ],
      holds: falseOne('each statement tested on the values of the spec: min = 15, max = 500, count of 240 = 2, count from 200 to 290 = 5', [
        (c) => stat(c, 'min') === 15,
        (c) => stat(c, 'max') === 500,
        (c) => c.num('stem_count_where', { op: 'eq', value: 240 }) === 2,
        (c) => between(c, 200, 290) === 5,
      ]),
      h: ['Read the key first: it tells you what one stem and one leaf stand for, including the place value of the leaf.', 'Turn the leaves you need into page counts with the key, then test each statement in turn.'],
      s: 'Read from the figure: the key says 2 | 4 = 240 pages, so a leaf is the tens digit. The first row 1 | 5 8 is 150 and 180 pages, so the shortest book has 150 pages, not 15 — that statement is false. The last row 5 | 0 is 500 pages, two leaves 4 on stem 2 are two books of 240 pages, and stem 2 holds 5 leaves (200, 220, 240, 240, 270).',
    },
  ]),

  ...G('apstats.distribution-shape', 'Shape and center read from a stemplot', [
    {
      t: 'shape named from where the leaves trail off', d: 2, need: 'reason',
      spec: S('stemplot', {
        title: 'Clinic wait times',
        key: { stem: 2, leaf: 3 }, units: 'minutes',
        stems: [0, 1, 2, 3, 4, 5, 6],
        leaves: [[3, 5, 6, 8, 9], [0, 1, 2, 2, 4, 5, 7], [0, 3, 6, 8], [1, 5], [2], [], [4]],
      }),
      alt: 'The plot shows the wait times of 20 patients at a clinic, with stems 0 to 6 (stem 5 empty) and a key reading 2 | 3 as 23 minutes.',
      q: 'The stemplot shows the wait times of 20 patients at a clinic. Which description of the shape of the distribution is best?',
      o: [
        ['Skewed right, with a long tail toward the longer waits', 'correct'],
        ['Skewed left, with a long tail toward the shorter waits', 'names the skew for the side where the data pile up, not the side of the long tail'],
        ['Roughly symmetric about the middle stem, stem 3', 'judges the balance by the stems listed rather than by where the leaves are'],
        ['Roughly uniform, with similar counts on every stem', 'ignores that the row lengths fall steadily from 7 leaves to 1 or none'],
      ],
      holds: ['the shape word of stem_shape on the spec (two measures agree), and the uniform option tested by the row lengths (max − min ≤ 1)', [
        (c) => c.txt('stem_shape') === 'skewed right',
        (c) => c.txt('stem_shape') === 'skewed left',
        (c) => c.txt('stem_shape').includes('symmetric'),
        (c) => { const n = (c.p.leaves as unknown[][]).map((r) => r.length); return Math.max(...n) - Math.min(...n) <= 1; },
      ]],
      h: ['Turn the plot on its side in your mind: the stems become a number line with small values on the left.', 'Find where most leaves pile up, then see in which direction the rows thin out over a long stretch.'],
      s: 'Read from the figure: the rows hold 5, 7, 4, 2, 1, 0 and 1 leaves for stems 0 to 6. Most waits are under 30 minutes, and the rows thin out slowly toward the larger stems, out to 64 minutes. The long tail is toward the longer waits, so the distribution is skewed right (its mean, 19.55 minutes, is above its median, 14.5 minutes).',
    },
    {
      t: 'median minus mean as evidence of skew', d: 3, need: 'calc',
      spec: S('stemplot', {
        title: 'Final exam scores',
        key: { stem: 8, leaf: 5 }, units: 'points',
        stems: [4, 5, 6, 7, 8, 9],
        leaves: [[5], [8], [2, 6], [0, 4, 7, 9], [1, 2, 3, 5, 6, 8, 8], [0, 1, 3, 4, 6]],
      }),
      alt: 'The plot shows the final exam scores of 20 students, with stems 4 to 9 and a key reading 8 | 5 as 85 points.',
      q: 'The stemplot shows the final exam scores of 20 students. Find the mean and the median of the scores. By how many points is the median greater than the mean?',
      n: '3.1',
      calc: ['median − mean of the spec\'s values (stem_stat)', (c) => stat(c, 'median') - stat(c, 'mean')],
      h: ['For 20 values the median is the average of the 10th and 11th values in order; count leaves from the top row down.', 'For the mean, add all 20 scores (adding row by row helps) and divide by 20; then subtract.'],
      s: 'Read from the figure: the scores are 45, 58, 62, 66, 70, 74, 77, 79, 81, 82, 83, 85, 86, 88, 88, 90, 91, 93, 94, 96. The 10th and 11th are 82 and 83, so the median is 82.5. The sum is 1588, so the mean is 1588 ÷ 20 = 79.4. The median exceeds the mean by 82.5 − 79.4 = 3.1 points: the low tail (45, 58) drags the mean down, a sign of left skew.',
    },
    {
      t: 'hidden value worked back from a stated mean', d: 3, need: 'calc',
      spec: S('stemplot', {
        title: 'Daily high temperatures',
        key: { stem: 7, leaf: 2 }, units: '°F',
        stems: [5, 6, 7, 8],
        leaves: [[4, 8], [1, 3, '?', 7, 9], [0, 2, 5, 6], [6]],
      }),
      alt: 'The plot shows 12 daily high temperatures, with stems 5 to 8, a key reading 7 | 2 as 72 °F, and one leaf on the stem-6 row hidden by a box with a question mark.',
      q: 'The stemplot shows the daily high temperatures for 12 days; one leaf is hidden by "?". The mean of the 12 temperatures is 68 °F. What temperature, in °F, is hidden?',
      n: '65',
      ck: ['stem_missing_leaf', { mean: 68 }],
      h: ['The mean times the number of values gives the total of all the values.', 'Add the 11 temperatures you can read and subtract that from the total.'],
      s: 'Read from the figure: the 11 visible temperatures are 54, 58, 61, 63, 67, 69, 70, 72, 75, 76 and 86, which add to 751. All 12 must add to 12 × 68 = 816, so the hidden temperature is 816 − 751 = 65 °F — a leaf of 5 on stem 6, which fits between 63 and 67.',
    },
  ]),

  ...G('apstats.comparing-distributions', 'Comparing two groups on a back-to-back stemplot', [
    {
      t: 'difference of the two medians', d: 2, need: 'calc',
      spec: S('stemplot', {
        title: 'Plant heights after six weeks',
        key: { stem: 3, leaf: 5, leftLeaf: 1 }, units: 'cm',
        stems: [1, 2, 3, 4, 5],
        left: { label: 'No fertilizer', leaves: [[5, 8], [0, 2, 3, 6, 7, 9], [1, 4, 4, 8], [2], []] },
        right: { label: 'Fertilizer', leaves: [[], [4, 8], [0, 2, 5, 5, 7, 9], [1, 3, 6, 8], [0, 3]] },
      }),
      alt: 'The back-to-back plot compares the heights of 13 plants grown with no fertilizer (left) and 14 plants grown with fertilizer (right) on stems 1 to 5.',
      q: 'The back-to-back stemplot shows the heights, in cm, of plants grown with no fertilizer and plants grown with fertilizer. How many centimeters greater is the median height of the plants given fertilizer than the median height of the plants given none?',
      n: '11',
      ck: ['stem_compare_difference', { stat: 'median' }],
      h: ['On the left side the leaves increase outward, away from the stem, so read them from the stem toward the left.', 'Find each group\'s median from its own count of values (odd count: the middle value; even count: the average of the middle two), then subtract.'],
      s: 'Read from the figure: No fertilizer (13 plants) has values 15, 18, 20, 22, 23, 26, 27, 29, 31, 34, 34, 38, 42; its median is the 7th value, 27 cm. Fertilizer (14 plants) has 24, 28, 30, 32, 35, 35, 37, 39, 41, 43, 46, 48, 50, 53; its median is (37 + 39) ÷ 2 = 38 cm. The difference is 38 − 27 = 11 cm.',
    },
    {
      t: 'difference of the two IQRs', d: 3, need: 'calc',
      spec: S('stemplot', {
        title: 'Commute times',
        key: { stem: 2, leaf: 3, leftLeaf: 1 }, units: 'minutes',
        stems: [0, 1, 2, 3, 4, 5],
        left: { label: 'Cyclists', leaves: [[6, 9], [1, 2, 4, 5, 5, 7, 8], [0, 1, 3, 6], [0], [], []] },
        right: { label: 'Bus riders', leaves: [[], [2, 6, 9], [0, 3, 4, 7, 8], [1, 5, 6, 9], [2, 4, 8], [5]] },
      }),
      alt: 'The back-to-back plot compares the commute times of 14 cyclists (left) and 16 bus riders (right) on stems 0 to 5.',
      q: 'The back-to-back stemplot shows the commute times of cyclists and bus riders. Using the interquartile range (IQR) as the measure of spread, how many minutes larger is the IQR of the bus riders\' times than the IQR of the cyclists\' times?',
      n: '10',
      ck: ['stem_compare_difference', { stat: 'iqr' }],
      h: ['For each group, split its ordered values into a lower half and an upper half; Q1 and Q3 are the medians of those halves.', 'IQR = Q3 − Q1 for each group; compare the two IQRs by subtracting.'],
      s: 'Read from the figure: Cyclists (14): 6, 9, 11, 12, 14, 15, 15 | 17, 18, 20, 21, 23, 26, 30, so Q1 = 12, Q3 = 21 and IQR = 9 minutes. Bus riders (16): 12, 16, 19, 20, 23, 24, 27, 28 | 31, 35, 36, 39, 42, 44, 48, 55, so Q1 = (20 + 23) ÷ 2 = 21.5, Q3 = (39 + 42) ÷ 2 = 40.5 and IQR = 19 minutes. The difference is 19 − 9 = 10 minutes.',
    },
    {
      t: 'center and spread compared in one statement', d: 3, need: 'reason',
      spec: S('stemplot', {
        title: 'Typing speeds',
        key: { stem: 5, leaf: 2, leftLeaf: 1 }, units: 'words per minute',
        stems: [2, 3, 4, 5, 6, 7],
        left: { label: 'Freshmen', leaves: [[5, 8], [1, 3, 6, 9], [0, 2, 4, 5, 7, 8], [1, 3, 6], [2, 8], []] },
        right: { label: 'Seniors', leaves: [[2], [], [3, 5, 6, 8, 9], [0, 1, 2, 3, 4, 6, 7], [0, 2, 5], [1]] },
      }),
      alt: 'The back-to-back plot compares the typing speeds of 17 freshmen (left) and 17 seniors (right) on stems 2 to 7.',
      q: 'The back-to-back stemplot shows the typing speeds of 17 freshmen and 17 seniors. Which statement correctly compares the centers (medians) and the spreads (IQRs) of the two groups?',
      o: [
        ['The seniors have the higher median; the freshmen have the larger IQR.', 'correct'],
        ['The seniors have the higher median; the seniors have the larger IQR.', 'judges spread by the range, which the single low speed of 22 stretches'],
        ['The freshmen have the higher median; the freshmen have the larger IQR.', 'compares the lowest speeds (the seniors\' 22) instead of the medians'],
        ['The freshmen have the higher median; the seniors have the larger IQR.', 'compares the lowest speeds for center and the ranges for spread'],
      ],
      holds: ['medians and IQRs of each side by stem_stat (AP quartiles): each option holds when both of its comparisons are true', (() => {
        const mS = (c: Ctx) => stat(c, 'median', 'Seniors') > stat(c, 'median', 'Freshmen');
        const iF = (c: Ctx) => stat(c, 'iqr', 'Freshmen') > stat(c, 'iqr', 'Seniors');
        return [
          (c: Ctx) => mS(c) && iF(c),
          (c: Ctx) => mS(c) && !iF(c),
          (c: Ctx) => !mS(c) && iF(c),
          (c: Ctx) => !mS(c) && !iF(c),
        ];
      })()],
      h: ['Each group has 17 values, so its median is the 9th value in order; read the left side outward from the stem.', 'Q1 and Q3 are the medians of the 8 values below and the 8 values above the median; IQR = Q3 − Q1. Do not use the range for spread.'],
      s: 'Read from the figure: the freshmen\'s speeds are 25, 28, 31, 33, 36, 39, 40, 42, 44, 45, 47, 48, 51, 53, 56, 62, 68: median 44, Q1 = 34.5, Q3 = 52, IQR = 17.5. The seniors\' speeds are 22, 43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 56, 57, 60, 62, 65, 71: median 52, Q1 = 47, Q3 = 58.5, IQR = 11.5. The seniors have the higher median (52 vs 44 words per minute); the freshmen have the larger IQR (17.5 vs 11.5), even though the seniors have the larger range because of their low value of 22.',
    },
  ]),
];
