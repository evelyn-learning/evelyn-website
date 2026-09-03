/**
 * Grade 6 World Geography — Unit 7 CED 7.4: Reading Geographic Graphs & Charts.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.reading-geographic-graphs-and-charts.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U7_READING_GEOGRAPHIC_GRAPHS_AND_CHARTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.reading-geographic-graphs-and-charts.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Reading Geographic Graphs & Charts',
  planId: 'evelyn.ms.m6geo.reading-geographic-graphs-and-charts.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.reading-geographic-graphs-and-charts.v1' }],
  theory: [
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `GEOGRAPHIC DATA CAN BE SHOWN THREE WAYS: A BAR GRAPH, A PIE CHART, OR A TABLE. A bar graph uses a bar for each category, and a longer or taller bar means a bigger number. A pie chart uses a circle cut into slices, and a bigger slice means a bigger share of that one whole. A table lays numbers out in rows and columns, so a single value is found by matching one row to one column. All three show the same kind of thing -- numbers attached to categories -- in a different shape.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `READING A BAR GRAPH MEANS READING EVERY BAR'S OWN NUMBER, WITH ITS UNIT, BEFORE COMPARING ANY TWO OF THEM. Each bar stands for one category, such as a month, a year, or a place. The number a bar stands for is always given with a unit -- days, millimeters, or lakes, for example -- and that unit has to travel with the number into any comparison.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `READING A PIE CHART MEANS TREATING THE WHOLE CIRCLE AS ONE HUNDRED PERCENT. Every slice's percent is that category's share of the one same whole, and all the slices in a single pie chart always add up to one hundred percent. A bigger slice is a bigger share of that circle's own whole -- but comparing percents from two DIFFERENT pie charts is not the same as comparing amounts, because the two circles can stand for two very different-sized wholes.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `READING A TABLE MEANS MATCHING ONE ROW TO ONE COLUMN TO FIND A SINGLE VALUE, THEN COMPARING ACROSS ROWS OR COLUMNS FOR THE BIGGER PICTURE. A table with regions down the side and one kind of number across the top lets a reader pick out any single region's number, or add several regions together before comparing that total with another region.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `A COMPARISON QUESTION NEEDS TWO NUMBERS READ CORRECTLY, NOT ONE. Answering it means finding the first number, finding the second number, keeping both units straight, and then saying how the two relate -- which one is bigger, by how much, or what share one is of the other.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', content: `READING ONE BAR, ONE SLICE, OR ONE TABLE CELL IS NEVER THE WHOLE ANSWER TO A COMPARISON QUESTION. The single biggest bar on a graph is only bigger than each other bar taken one at a time; it is not automatically bigger than several of the others added together. Checking a comparison means adding or comparing the actual numbers involved, never stopping at whichever single bar or slice looks biggest.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', kind: 'definition', title: 'bar graph', content: `a graph that uses a bar for each category, with a longer or taller bar standing for a bigger number.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', kind: 'definition', title: 'pie chart', content: `a circle divided into slices that show how a whole is split into shares, with every slice written as a percent and all the percents in one pie chart adding up to one hundred.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', kind: 'definition', title: 'table', content: `data arranged in rows and columns, so that a single value can be found by matching one row to one column.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', kind: 'definition', title: 'percent', content: `a share of a whole written as a number out of one hundred; the percents in one pie chart always add up to one hundred.` },
    { loId: 'm6geo.reading-geographic-graphs-and-charts', kind: 'definition', title: 'category', content: `one of the separate groups, places, or time periods that a bar graph, pie chart, or table compares against each other, such as a month, a region, or a year.` },
  ],
  methods: [
    {
      title: 'Worked bar graph group comparison',
      steps: [
        `Read every bar's own number first, with its unit. Spring is 18 days, Summer is 6 days, Fall is 15 days, and Winter is 21 days.`,
        `Add all four numbers to find the year's total: 18 + 6 + 15 + 21 = 60 days. Keeping this total lets the next step be checked.`,
        `Test one pairing. Winter and Spring together: 21 + 18 = 39 days. That leaves Summer and Fall together: 6 + 15 = 21 days.`,
        `Check the pairing against the total from step 2: 39 + 21 = 60 days, which matches the year's total exactly, so no rainy day has been left out or counted twice.`,
        `Compare the two pair totals: 39 days is more than 21 days, so Winter and Spring together have more rainy days, by 39 minus 21, which is 18 more days.`,
        `Now test a contrasting case, to be sure the routine is doing real work rather than just repeating a pattern. If Summer had 26 rainy days instead of 6, the new total would be 18 + 26 + 15 + 21 = 80 days. Winter and Spring would still total 39 days, but Summer and Fall would now total 26 + 15 = 41 days -- more than Winter and Spring. Changing one season's number can flip which pair actually has more, so the pairing has to be added up every time, never assumed.`,
      ],
      example: { problem: `A bar graph shows the number of rainy days in each season for the town of Cedar Hollow: Spring, 18 days. Summer, 6 days. Fall, 15 days. Winter, 21 days. Which two seasons together have more rainy days than the other two seasons combined, and by how many days?`, solution: `Winter and Spring together have more rainy days: 39 days, compared with 21 days for Summer and Fall combined -- 18 more rainy days.` },
      relatedLoIds: ['m6geo.reading-geographic-graphs-and-charts'],
    },
    {
      title: 'Worked pie chart percent vs amount',
      steps: [
        `Notice what the student is actually comparing: two percents, not two amounts. A percent is a share of that one country's own total, and two countries do not have to have the same-size total.`,
        `Find Fenwick's actual farmland. Forty-five percent of 200 square kilometers is 0.45 multiplied by 200, which is 90 square kilometers.`,
        `Find Bramblewood's actual farmland. Thirty percent of 500 square kilometers is 0.30 multiplied by 500, which is 150 square kilometers.`,
        `Compare the two actual amounts: 150 square kilometers is more than 90 square kilometers. WRONG: "a bigger percent always means a bigger amount." CORRECT: "Bramblewood actually has more farmland, even though its percent share is smaller, because Bramblewood's whole total is much bigger."`,
        `Check the arithmetic by rewinding it: 90 divided by 200 should give back 0.45, and 90 divided by 200 is exactly 0.45. 150 divided by 500 should give back 0.30, and 150 divided by 500 is exactly 0.30. Both check out.`,
        `Now test a contrasting case. If the two countries had the SAME total, say 300 square kilometers each, Fenwick's 45 percent would be 135 square kilometers and Bramblewood's 30 percent would be 90 square kilometers -- and then the bigger percent WOULD mean the bigger amount. The percent-to-amount trap only bites when the two totals are different, which is exactly why the totals have to be checked every time, never assumed to match.`,
      ],
      example: { problem: `A student compares two countries' land-use pie charts. Fenwick's pie chart shows Farmland at 45 percent, out of Fenwick's total land area of 200 square kilometers. Bramblewood's pie chart shows Farmland at 30 percent, out of Bramblewood's total land area of 500 square kilometers. The student says: "Fenwick has more farmland, in square kilometers, than Bramblewood, because forty-five percent is more than thirty percent." Is the student right? Find the actual farmland area for each country to check.`, solution: `No. Fenwick's farmland is 45 percent of 200 square kilometers, which is 90 square kilometers. Bramblewood's farmland is 30 percent of 500 square kilometers, which is 150 square kilometers. Bramblewood actually has more farmland, even though its percent share is smaller, because the two countries' total land areas are different.` },
      relatedLoIds: ['m6geo.reading-geographic-graphs-and-charts'],
    },
  ],
  pointers: [
    { content: `Students often say "Year 5 had more snow days than every other year combined, because it was the single highest year on the graph." — The largest single bar on a graph is only larger than each other bar taken one at a time; it is not automatically larger than several of them added together. Using the five years from Fernbridge's graph -- 12, 20, 9, 15 and 24 days -- Year 5's 24 days is the single highest year, but the other four years add up to 12 plus 20 plus 9 plus 15, which is 56 days, far more than 24. Being the largest single bar and being larger than everything else combined are two different claims, and only adding the rest up can show which one is true.`, kind: 'common-error' },
    { content: `Students often say "My home country must have more farmland, in square kilometers, than the bigger country, because 50 percent is more than 20 percent." — A percent is only a share of that one place's own total, and two places do not have to have the same-size total. Comparing percents from two different pie charts does not say which actual amount is bigger; the real amount has to be worked out by multiplying the percent by that place's own total land area, the way Fenwick's 45 percent of 200 square kilometers came out to 90 square kilometers while Bramblewood's smaller-looking 30 percent of 500 square kilometers came out to 150 square kilometers. WRONG: "a bigger percent always means a bigger amount." CORRECT: "a bigger percent means a bigger share of that same total; comparing actual amounts across two different totals needs the real numbers, not just the percents."`, kind: 'common-error' },
    { content: `Geographic data can be shown as a bar graph, a pie chart, or a table, and reading any of them means reading every number with its unit before comparing.`, kind: 'tip' },
    { content: `A bar graph's bars each stand for one category; comparing two bars, or two groups of bars, means adding or subtracting their actual numbers, not just glancing at which bar looks tallest.`, kind: 'tip' },
    { content: `A pie chart's whole circle is one hundred percent, and every slice's percent is its share of that one same whole; the slices in a single pie chart always add up to one hundred.`, kind: 'tip' },
    { content: `Comparing percents from two different pie charts does not say which actual amount is bigger unless the two wholes are the same size; multiply each percent by that place's own total to compare real amounts.`, kind: 'tip' },
    { content: `A table's value is found by matching one row to one column; comparing across rows or down columns, and adding several rows together when a question asks for it, finds the bigger comparison.`, kind: 'tip' },
    { content: `A comparison question always needs two numbers read correctly, not one; the single biggest bar, slice, or table value is never automatically bigger than several of the others added together.`, kind: 'tip' },
    { content: `A **percent from one pie chart cannot be directly compared to a percent from a different pie chart** to find which actual amount is bigger. Always multiply each percent by that place's own total first.`, kind: 'common-error' },
    { content: `The **single tallest or longest bar on a graph is NOT automatically bigger than several other bars added together**. Always add up the bars you're comparing before deciding.`, kind: 'common-error' },
    { content: `When reading a pie chart, **all slices in ONE circle must add up to exactly 100 percent**. If they don't, something is labeled wrong or you misread a value.`, kind: 'tip' },
    { content: `A comparison question **always needs two numbers**, not one. Reading just the tallest bar, biggest slice, or single cell is never a complete answer.`, kind: 'gotcha' },
    { content: `**Write the unit (days, square kilometers, lakes, percent) next to every number** when you read it from the graph, pie chart, or table. Never drop the unit before comparing.`, kind: 'vocab-note' },
    { content: `In a table, **add across rows or down columns only if the question asks for a total**. A single cell value is just one number; a sum is multiple numbers combined.`, kind: 'edge-case' },
    { content: `**Percent and percentage points are different in words but the same in math.** A change from 40% to 30% is '10 percentage points' or just '10 percent lower'—both mean subtract 40 minus 30.`, kind: 'vocab-note' },
  ],
};
