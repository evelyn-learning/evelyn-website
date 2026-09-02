/**
 * Grade 6 World Geography — Geographic Technology & Data Skills: Reading
 * Geographic Graphs & Charts.
 *
 * PROCEDURE-LED exemplar shape (National Geography Standard 1). One routine
 * runs the whole lesson: read every bar, slice, or table cell's own number
 * with its unit, then combine or relate two (or more) of those numbers to
 * answer a COMPARISON question -- never stop at reading a single value, which
 * is a different and easier skill than this row teaches. The lesson covers
 * all three formats the row's scope line names -- a bar graph, a pie chart,
 * and a table -- one format per try_yourself item, and both worked examples
 * chase the two traps that make a comparison come out wrong even when every
 * single number was read correctly: (1) mistaking the single largest bar or
 * slice for something bigger than several of the others added together, and
 * (2) comparing two percents from two different pie charts as if a bigger
 * percent always means a bigger actual amount.
 *
 * SCOPE GUARD: this row reads a bar graph, a pie chart, or a table of
 * geographic data that is printed out in full in the item text, and answers
 * a comparison question about it by adding, subtracting, or multiplying the
 * numbers already given. It does not compute a mean, a median, a mode, a
 * trend, or any other statistical measure beyond a sum or a difference; it
 * does not ask the student to draw, plot, or construct a chart; and it never
 * reads a colored map's legend or key, which is row 7.3's
 * (`reading-a-thematic-map`) territory, not this one's. Unit 7 has no Grade 7
 * counterpart in the signed curriculum -- GIS, satellite imagery, GPS, and
 * thematic-map or graph reading are genuinely new ground this course opens on
 * its own -- so the guard against drift here is not a deeper Grade 7 pass on
 * the same subject but the two adjacent things a "geographic data" chart
 * could easily reach for and must not: (a) formal statistics of the kind a
 * math course owns, and (b) the population, economic, and demographic content
 * the signed curriculum's excluded list reserves for Grade 7 Units 3 and 5.
 * Every number in every chart in this file is invented for this lesson --
 * rainy days, snow days, land-use shares, and lake counts for places that do
 * not exist -- so nothing charted here is a real-world claim a student could
 * look up and find changed a year later; only the arithmetic performed on
 * those invented numbers is checkable, and every step of it is shown in full.
 * What IS deliberately allowed, because it is the exact skill the row's own
 * scope line asks for: adding two or more categories together before
 * comparing that total against another category or group (worked example 1,
 * try-table-lake-counts), and multiplying a percent by a whole to find an
 * actual amount before comparing two amounts across two different wholes
 * (worked example 2, try-pie-chart-percentage-points). Both are arithmetic
 * operations on numbers the item already states, not a named geographic
 * mechanism or a closed typology, and NGS 1 itself names "process" as part of
 * what this standard covers.
 *
 * THERE ARE NO IMAGES, GRAPHS, OR CHARTS ANYWHERE IN THIS FILE. Every bar
 * graph, pie chart, and table in this lesson is written out as a plain list
 * of categories and numbers with their units stated, the way the sibling
 * Grade 6 science course's `m6sci-u8-reading-climate-graphs.ts` handles a
 * climatograph the student cannot see. No item ever says "look at the chart"
 * or "as shown above"; every item is solvable entirely from the numbers
 * printed inside it.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full, nameable wrong arithmetic step
 * rather than a short wrong label, and no key was built to be the longest
 * choice BECAUSE it is the key. Measured as a diagnostic, not as a score: the
 * key is the strictly longest choice in 0 of the 3 items -- character counts
 * (a,b,c,d): try-bar-graph-snow-days 113,128,110,116 (key a); try-pie-chart-
 * percentage-points 142,145,158,185 (key b); try-table-lake-counts
 * 152,152,137,182 (key c). The key runs slightly on the short side in this
 * file (distractors each narrate a wrong arithmetic step, which naturally
 * runs longer than stating the right one), never the longest, and 0/3 is not
 * itself evidence of anything at file scale; see the note in
 * `m6geo-u3-earths-moving-plates.ts`. The three keys sit at ids a, b and c --
 * the id set `(7 + 4) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 7.3
 * (`m6geo.reading-a-thematic-map`) -> 7.4 (this row) -> 8.1
 * (`m6geo.what-makes-a-place-unique`), per the lesson brief and the
 * fan-out contract's chain table. `lint-ms-plans` will resolve these once the
 * full 40-row batch is registered together.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U7_READING_GEOGRAPHIC_GRAPHS_AND_CHARTS: LessonPlan = {
  id: 'evelyn.ms.m6geo.reading-geographic-graphs-and-charts.v1',
  title: 'Reading Geographic Graphs & Charts',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.reading-geographic-graphs-and-charts',
      standard: 'M6GEO-7.4',
      description:
        'Read a simple bar graph, pie chart, or table of geographic data and answer a comparison question about it (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.reading-a-thematic-map'],
  followUps: ['m6geo.what-makes-a-place-unique'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe a chart as a set of numbers to compare, not a shape to glance at.',
      script:
        'Your class is picking a weekend for an outdoor field day, and the teacher hands out a chart showing how many rainy days each month usually has. Somebody looks at May and sees a short bar, and says field day should be in May. Somebody else asks a better question: which two months TOGETHER have the fewest rainy days, in case the class needs a backup date too? That second question cannot be answered by glancing at one bar. It needs two numbers, read correctly, and then compared. Today you learn to read a bar graph, a pie chart, and a table of geographic data, and to answer a comparison question about each one -- not just a which-one-is-biggest question, which any glance can answer without the numbers at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-charts-and-comparing-values',
      kind: 'concept',
      goal: 'Install what each of the three chart types shows, and the two-number routine a comparison question always needs.',
      keyIdeas: [
        'GEOGRAPHIC DATA CAN BE SHOWN THREE WAYS: A BAR GRAPH, A PIE CHART, OR A TABLE. A bar graph uses a bar for each category, and a longer or taller bar means a bigger number. A pie chart uses a circle cut into slices, and a bigger slice means a bigger share of that one whole. A table lays numbers out in rows and columns, so a single value is found by matching one row to one column. All three show the same kind of thing -- numbers attached to categories -- in a different shape.',
        "READING A BAR GRAPH MEANS READING EVERY BAR'S OWN NUMBER, WITH ITS UNIT, BEFORE COMPARING ANY TWO OF THEM. Each bar stands for one category, such as a month, a year, or a place. The number a bar stands for is always given with a unit -- days, millimeters, or lakes, for example -- and that unit has to travel with the number into any comparison.",
        "READING A PIE CHART MEANS TREATING THE WHOLE CIRCLE AS ONE HUNDRED PERCENT. Every slice's percent is that category's share of the one same whole, and all the slices in a single pie chart always add up to one hundred percent. A bigger slice is a bigger share of that circle's own whole -- but comparing percents from two DIFFERENT pie charts is not the same as comparing amounts, because the two circles can stand for two very different-sized wholes.",
        'READING A TABLE MEANS MATCHING ONE ROW TO ONE COLUMN TO FIND A SINGLE VALUE, THEN COMPARING ACROSS ROWS OR COLUMNS FOR THE BIGGER PICTURE. A table with regions down the side and one kind of number across the top lets a reader pick out any single region\'s number, or add several regions together before comparing that total with another region.',
        'A COMPARISON QUESTION NEEDS TWO NUMBERS READ CORRECTLY, NOT ONE. Answering it means finding the first number, finding the second number, keeping both units straight, and then saying how the two relate -- which one is bigger, by how much, or what share one is of the other.',
        'READING ONE BAR, ONE SLICE, OR ONE TABLE CELL IS NEVER THE WHOLE ANSWER TO A COMPARISON QUESTION. The single biggest bar on a graph is only bigger than each other bar taken one at a time; it is not automatically bigger than several of the others added together. Checking a comparison means adding or comparing the actual numbers involved, never stopping at whichever single bar or slice looks biggest.',
      ],
      vocabulary: [
        { term: 'bar graph', definition: "a graph that uses a bar for each category, with a longer or taller bar standing for a bigger number." },
        { term: 'pie chart', definition: 'a circle divided into slices that show how a whole is split into shares, with every slice written as a percent and all the percents in one pie chart adding up to one hundred.' },
        { term: 'table', definition: 'data arranged in rows and columns, so that a single value can be found by matching one row to one column.' },
        { term: 'percent', definition: 'a share of a whole written as a number out of one hundred; the percents in one pie chart always add up to one hundred.' },
        { term: 'category', definition: 'one of the separate groups, places, or time periods that a bar graph, pie chart, or table compares against each other, such as a month, a region, or a year.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bar-graph-group-comparison',
      kind: 'worked_example',
      problem:
        'A bar graph shows the number of rainy days in each season for the town of Cedar Hollow: Spring, 18 days. Summer, 6 days. Fall, 15 days. Winter, 21 days. Which two seasons together have more rainy days than the other two seasons combined, and by how many days?',
      steps: [
        'Read every bar\'s own number first, with its unit. Spring is 18 days, Summer is 6 days, Fall is 15 days, and Winter is 21 days.',
        'Add all four numbers to find the year\'s total: 18 + 6 + 15 + 21 = 60 days. Keeping this total lets the next step be checked.',
        'Test one pairing. Winter and Spring together: 21 + 18 = 39 days. That leaves Summer and Fall together: 6 + 15 = 21 days.',
        'Check the pairing against the total from step 2: 39 + 21 = 60 days, which matches the year\'s total exactly, so no rainy day has been left out or counted twice.',
        'Compare the two pair totals: 39 days is more than 21 days, so Winter and Spring together have more rainy days, by 39 minus 21, which is 18 more days.',
        'Now test a contrasting case, to be sure the routine is doing real work rather than just repeating a pattern. If Summer had 26 rainy days instead of 6, the new total would be 18 + 26 + 15 + 21 = 80 days. Winter and Spring would still total 39 days, but Summer and Fall would now total 26 + 15 = 41 days -- more than Winter and Spring. Changing one season\'s number can flip which pair actually has more, so the pairing has to be added up every time, never assumed.',
      ],
      answer:
        'Winter and Spring together have more rainy days: 39 days, compared with 21 days for Summer and Fall combined -- 18 more rainy days.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pie-chart-percent-vs-amount',
      kind: 'worked_example',
      problem:
        'A student compares two countries\' land-use pie charts. Fenwick\'s pie chart shows Farmland at 45 percent, out of Fenwick\'s total land area of 200 square kilometers. Bramblewood\'s pie chart shows Farmland at 30 percent, out of Bramblewood\'s total land area of 500 square kilometers. The student says: "Fenwick has more farmland, in square kilometers, than Bramblewood, because forty-five percent is more than thirty percent." Is the student right? Find the actual farmland area for each country to check.',
      steps: [
        'Notice what the student is actually comparing: two percents, not two amounts. A percent is a share of that one country\'s own total, and two countries do not have to have the same-size total.',
        'Find Fenwick\'s actual farmland. Forty-five percent of 200 square kilometers is 0.45 multiplied by 200, which is 90 square kilometers.',
        'Find Bramblewood\'s actual farmland. Thirty percent of 500 square kilometers is 0.30 multiplied by 500, which is 150 square kilometers.',
        'Compare the two actual amounts: 150 square kilometers is more than 90 square kilometers. WRONG: "a bigger percent always means a bigger amount." CORRECT: "Bramblewood actually has more farmland, even though its percent share is smaller, because Bramblewood\'s whole total is much bigger."',
        'Check the arithmetic by rewinding it: 90 divided by 200 should give back 0.45, and 90 divided by 200 is exactly 0.45. 150 divided by 500 should give back 0.30, and 150 divided by 500 is exactly 0.30. Both check out.',
        'Now test a contrasting case. If the two countries had the SAME total, say 300 square kilometers each, Fenwick\'s 45 percent would be 135 square kilometers and Bramblewood\'s 30 percent would be 90 square kilometers -- and then the bigger percent WOULD mean the bigger amount. The percent-to-amount trap only bites when the two totals are different, which is exactly why the totals have to be checked every time, never assumed to match.',
      ],
      answer:
        'No. Fenwick\'s farmland is 45 percent of 200 square kilometers, which is 90 square kilometers. Bramblewood\'s farmland is 30 percent of 500 square kilometers, which is 150 square kilometers. Bramblewood actually has more farmland, even though its percent share is smaller, because the two countries\' total land areas are different.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bar-graph-snow-days',
      kind: 'try_yourself',
      problem:
        'A bar graph shows how many days of snow fell in the town of Fernbridge over five years: Year 1, 12 days. Year 2, 20 days. Year 3, 9 days. Year 4, 15 days. Year 5, 24 days. How many more snow days did Year 5 have than Year 3?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "15 more days, because Year 5's 24 days minus Year 3's 9 days is the correct comparison, and 24 minus 9 equals 15.", correct: true },
        { id: 'b', text: "33 more days, because the student added Year 5's 24 days and Year 3's 9 days together instead of subtracting one from the other." },
        { id: 'c', text: "24 more days, because the student read only Year 5's own number and forgot to subtract Year 3's number at all." },
        { id: 'd', text: "9 more days, because the student subtracted Year 4's 15 days from Year 5's 24 days instead of using Year 3's 9 days." },
      ],
      expectedAnswer: "15 more days, because Year 5's 24 days minus Year 3's 9 days is the correct comparison, and 24 minus 9 equals 15.",
      hints: [
        "Read Year 5's own number and Year 3's own number separately before comparing them.",
        'The question asks how many MORE days Year 5 had, so subtract Year 3\'s number from Year 5\'s number, in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pie-chart-percentage-points',
      kind: 'try_yourself',
      problem:
        "A pie chart shows how the town of Millbrook's parkland is divided among four uses: Grass, 40 percent. Trees, 25 percent. Water, 20 percent. Playground, 15 percent. How many more percentage points is Grass's share than Playground's share?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "55 percentage points more, because the student added Grass's 40 percent and Playground's 15 percent instead of subtracting one from the other." },
        { id: 'b', text: "25 percentage points more, because Grass's 40 percent minus Playground's 15 percent is the correct comparison to make, and 40 minus 15 equals 25.", correct: true },
        { id: 'c', text: "5 percentage points more, because the student compared Water's 20 percent to Playground's 15 percent instead of comparing Grass's share to Playground's share." },
        { id: 'd', text: "60 percentage points more, because the student found the share that is not Grass (100 minus 40 equals 60) and used that number as if it were the difference between Grass and Playground." },
      ],
      expectedAnswer: "25 percentage points more, because Grass's 40 percent minus Playground's 15 percent is the correct comparison to make, and 40 minus 15 equals 25.",
      hints: [
        "Read Grass's own share and Playground's own share separately before comparing them.",
        "The question asks how many MORE percentage points Grass has, so subtract Playground's share from Grass's share, in that order.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-table-lake-counts',
      kind: 'try_yourself',
      problem:
        'A table shows the number of lakes in four regions: Region North, 14 lakes. Region South, 6 lakes. Region East, 20 lakes. Region West, 11 lakes. How many more lakes does Region East have than Region South and Region West combined?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "14 more lakes, because the student subtracted only Region South's 6 lakes from Region East's 20 lakes, and forgot to include Region West's lakes at all." },
        { id: 'b', text: "9 more lakes, because the student subtracted only Region West's 11 lakes from Region East's 20 lakes, and forgot to include Region South's lakes at all." },
        { id: 'c', text: "3 more lakes, because Region South and Region West together have 17 lakes (6 plus 11), and Region East's 20 lakes minus that 17 equals 3.", correct: true },
        { id: 'd', text: "37 more lakes, because the student added all three regions' lake counts together (20 plus 6 plus 11 equals 37) instead of subtracting the combined total from Region East's own total." },
      ],
      expectedAnswer: "3 more lakes, because Region South and Region West together have 17 lakes (6 plus 11), and Region East's 20 lakes minus that 17 equals 3.",
      hints: [
        'Region South and Region West have to be combined into one number before that combined number is compared with Region East.',
        "Add Region South's lakes and Region West's lakes together first, then subtract that combined total from Region East's own total.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-value-and-percent-vs-amount',
      kind: 'misconception_check',
      question:
        'A student looks at a bar graph and says: "Year 5 had the most snow days of any year, so Year 5 had more snow days than every other year combined." The same student then looks at two countries\' pie charts and says: "My home country\'s pie chart shows Farmland at 50 percent, and a much bigger country\'s pie chart shows Farmland at only 20 percent, so my home country must have more farmland, in square kilometers, than the bigger country." What is wrong with each statement?',
      commonErrors: [
        {
          answer: 'Year 5 had more snow days than every other year combined, because it was the single highest year on the graph.',
          misconception:
            'Treating the single largest bar on a graph as automatically larger than several of the other bars added together, without actually adding the other bars up to check.',
          correctsTo:
            "The largest single bar on a graph is only larger than each other bar taken one at a time; it is not automatically larger than several of them added together. Using the five years from Fernbridge's graph -- 12, 20, 9, 15 and 24 days -- Year 5's 24 days is the single highest year, but the other four years add up to 12 plus 20 plus 9 plus 15, which is 56 days, far more than 24. Being the largest single bar and being larger than everything else combined are two different claims, and only adding the rest up can show which one is true.",
        },
        {
          answer: 'My home country must have more farmland, in square kilometers, than the bigger country, because 50 percent is more than 20 percent.',
          misconception:
            'Assuming that a bigger percent always means a bigger actual amount, without checking whether the two pie charts represent land areas of the same size.',
          correctsTo:
            'A percent is only a share of that one place\'s own total, and two places do not have to have the same-size total. Comparing percents from two different pie charts does not say which actual amount is bigger; the real amount has to be worked out by multiplying the percent by that place\'s own total land area, the way Fenwick\'s 45 percent of 200 square kilometers came out to 90 square kilometers while Bramblewood\'s smaller-looking 30 percent of 500 square kilometers came out to 150 square kilometers. WRONG: "a bigger percent always means a bigger amount." CORRECT: "a bigger percent means a bigger share of that same total; comparing actual amounts across two different totals needs the real numbers, not just the percents."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Geographic data can be shown as a bar graph, a pie chart, or a table, and reading any of them means reading every number with its unit before comparing.',
        "A bar graph's bars each stand for one category; comparing two bars, or two groups of bars, means adding or subtracting their actual numbers, not just glancing at which bar looks tallest.",
        "A pie chart's whole circle is one hundred percent, and every slice's percent is its share of that one same whole; the slices in a single pie chart always add up to one hundred.",
        'Comparing percents from two different pie charts does not say which actual amount is bigger unless the two wholes are the same size; multiply each percent by that place\'s own total to compare real amounts.',
        "A table's value is found by matching one row to one column; comparing across rows or down columns, and adding several rows together when a question asks for it, finds the bigger comparison.",
        'A comparison question always needs two numbers read correctly, not one; the single biggest bar, slice, or table value is never automatically bigger than several of the others added together.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Reading Geographic Graphs & Charts' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
