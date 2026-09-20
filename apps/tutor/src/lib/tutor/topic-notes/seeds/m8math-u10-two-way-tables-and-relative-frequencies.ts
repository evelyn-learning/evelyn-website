/**
 * Grade 8 Math — Unit 10 CED 10.4: Two-Way Tables & Relative Frequencies.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.two-way-tables-and-relative-frequencies.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U10_TWO_WAY_TABLES_AND_RELATIVE_FREQUENCIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.two-way-tables-and-relative-frequencies.v1',
  course: 'Grade 8 Math',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Two-Way Tables & Relative Frequencies',
  planId: 'evelyn.ms.m8math.two-way-tables-and-relative-frequencies.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.two-way-tables-and-relative-frequencies.v1' }],
  theory: [
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'Two questions, one table', content: `TWO QUESTIONS, ONE TABLE — when every student answers two yes/no questions, the answers are categories, not measurements, so there is nothing to plot. Instead they go into a two-way frequency table: the rows hold the answers to one question (curfew: yes or no), the columns hold the answers to the other (chores: yes or no), and each student is counted in exactly one of the four cells. The margins hold the totals: a total for each row, a total for each column, and the grand total in the corner.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'Fill the table by subtraction', content: `FILL THE TABLE BY SUBTRACTION — every row adds up to its row total and every column adds up to its column total, so a missing cell is its total minus the cells you already know. If 25 students have a curfew and 20 of them have chores, the curfew-but-no-chores cell is 25 - 20 = 5. Finish by checking that the row totals and the column totals both add to the grand total; if they do not, a cell is wrong.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'A raw count cannot compare groups of different sizes', content: `A RAW COUNT CANNOT COMPARE GROUPS OF DIFFERENT SIZES — 20 curfew students have chores and only 6 no-curfew students do, but there are 25 students in the first group and 15 in the second, so the bigger group wins the count before anyone looks at the data. To compare the groups fairly, turn each count into a relative frequency: the cell divided by the total of the group it belongs to.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'Row relative frequency', content: `ROW RELATIVE FREQUENCY — divide a cell by its ROW total. In the curfew row, 20 ÷ 25 = 0.80 have chores and 5 ÷ 25 = 0.20 do not, and the two add to 1 because the row has been split into parts of one whole. A row relative frequency answers "of the students WITH a curfew, what fraction have chores?" Writing 0.80 as 80% is the same conversion you already own.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'Column relative frequency', content: `COLUMN RELATIVE FREQUENCY — divide a cell by its COLUMN total, which answers the flipped question: "of the students WITH chores, what fraction have a curfew?" The group named in the question decides the divider. If the question says "of the students with a curfew", the curfew row total is the divider; if it says "of the students with chores", the chores column total is. Dividing by the grand total instead gives the cell as a share of the whole survey, which does not compare the two groups at all.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'framework', title: 'Compare across the two groups to describe a possible association', content: `COMPARE ACROSS THE TWO GROUPS TO DESCRIBE A POSSIBLE ASSOCIATION — line up the same relative frequency for both rows (or both columns). If they are clearly different, 0.80 against 0.40, the two answers travel together and there is a possible association: students with a curfew tend to have chores. If they are about the same, 0.75 against 0.75, there is no association, and knowing one answer tells you nothing about the other. Call it a possible association, because a survey describes only the group that was asked.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'two-way frequency table', content: `a table that sorts every person by the answers to two questions at once, with one question across the rows and the other down the columns, plus a total for each row, each column and the whole group.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'cell', content: `one box inside the table, holding the count of people who gave one particular pair of answers, such as curfew-yes and chores-yes.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'relative frequency', content: `a count divided by the total of the group it belongs to, written as a decimal between 0 and 1.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'row relative frequency', content: `a cell divided by its row total; the fraction of that row's group that falls in that column.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'column relative frequency', content: `a cell divided by its column total; the fraction of that column's group that falls in that row.` },
    { loId: 'm8math.two-way-tables-and-relative-frequencies', kind: 'definition', title: 'association', content: `a pattern in which the answer to one question tends to go with a particular answer to the other, seen when the relative frequencies for the two groups are clearly different.` },
  ],
  methods: [
    {
      title: 'Worked curfew and chores',
      steps: [
        `Set up the table. Rows: curfew yes, curfew no. Columns: chores yes, chores no. Add a total column on the right, a total row along the bottom, and the grand total of 40 in the corner.`,
        `Place what you were told. Curfew-yes row total: 25. Curfew-yes and chores-yes cell: 20. Curfew-no and chores-yes cell: 6. Grand total: 40.`,
        `Fill the rest by subtraction. Curfew-yes and chores-no: 25 - 20 = 5. Curfew-no row total: 40 - 25 = 15. Curfew-no and chores-no: 15 - 6 = 9. Chores-yes column total: 20 + 6 = 26. Chores-no column total: 5 + 9 = 14.`,
        `Check the margins. Row totals: 25 + 15 = 40. Column totals: 26 + 14 = 40. Both match the grand total, so the table is filled correctly.`,
        `The question names the group "students with a curfew", so it is a row question, and each row total is the divider. Curfew-yes row: 20 ÷ 25 = 0.80 have chores, 5 ÷ 25 = 0.20 do not, and 0.80 + 0.20 = 1. Curfew-no row: 6 ÷ 15 = 0.40 have chores, 9 ÷ 15 = 0.60 do not, and 0.40 + 0.60 = 1.`,
        `Compare the same relative frequency across the two rows: 0.80 of the curfew students have chores, against 0.40 of the no-curfew students. Those are clearly different, so there is a possible association: students with a curfew tend to have chores.`,
        `Check by working backward: 0.80 × 25 = 20 and 0.40 × 15 = 6, which are exactly the two chores-yes cells. The relative frequencies rebuild the counts, so the division was right.`,
      ],
      example: { problem: `Forty students answered the survey from the hook. 25 of them have a curfew, and 20 of those 25 also have chores. Of the students with no curfew, 6 have chores. Build the two-way table and use row relative frequencies to answer: do students with a curfew tend to have chores?`, solution: `Curfew row: 0.80 have chores. No-curfew row: 0.40 have chores. Students with a curfew tend to have chores, a possible association.` },
      relatedLoIds: ['m8math.two-way-tables-and-relative-frequencies'],
    },
    {
      title: 'Worked sport and lunch',
      steps: [
        `Set up and fill the table. Team row: 27 pack, 36 - 27 = 9 buy, total 36. No-team row: 18 pack, 24 - 18 = 6 buy, total 24. Pack column total: 27 + 18 = 45. Buy column total: 9 + 6 = 15. Check: 36 + 24 = 60 and 45 + 15 = 60.`,
        `The question names the group "students who pack lunch", which is a column, so this is a column question and each column total is the divider. Pack column: 27 ÷ 45 = 0.60 play on a team, 18 ÷ 45 = 0.40 do not. Buy column: 9 ÷ 15 = 0.60 play on a team, 6 ÷ 15 = 0.40 do not.`,
        `Compare across the two columns: 0.60 of the lunch packers play on a team, and 0.60 of the lunch buyers play on a team. Those are the same, so there is no association. Knowing that a student packs lunch tells you nothing about whether they play on a team.`,
        `WRONG: "27 team players pack lunch and only 18 non-players do, so team players tend to pack lunch." CORRECT: those counts come from a group of 36 and a group of 24, so the bigger group was always going to have the bigger count. Divide each by its own row total: 27 ÷ 36 = 0.75 and 18 ÷ 24 = 0.75. The rows agree with the columns: no association either way.`,
        `Check by working backward: 0.60 × 45 = 27 and 0.60 × 15 = 9, the two team-row cells. One more check that the 0.60 makes sense: 36 of the 60 students play on a team, and 36 ÷ 60 = 0.60, so each column simply matches the whole group.`,
      ],
      example: { problem: `Sixty students were asked whether they play on a school sports team and whether they pack their lunch or buy it. 36 play on a team, and 27 of those 36 pack lunch. Of the 24 who do not play on a team, 18 pack lunch. Do students who pack lunch tend to play on a team?`, solution: `Pack column: 0.60 play on a team. Buy column: 0.60 play on a team. No association: packing lunch does not go with playing on a team.` },
      relatedLoIds: ['m8math.two-way-tables-and-relative-frequencies'],
    },
  ],
  pointers: [
    { content: `Students often say "Students who stream music tend to finish before dinner, because 28 is more than 9." — Divide each cell by its own row total. Streaming row: 28 ÷ 40 = 0.70 finish before dinner. Non-streaming row: 9 ÷ 10 = 0.90 finish before dinner. Now the comparison is fair, and 0.90 is larger than 0.70, so the students who do NOT stream music tend to finish before dinner, the opposite of what the raw counts suggested. Check by working backward: 0.70 × 40 = 28 and 0.90 × 10 = 9.`, kind: 'common-error' },
    { content: `Students often say "Students who stream music tend to finish before dinner, because 28 ÷ 50 = 0.56 is larger than 9 ÷ 50 = 0.18." — The question is about the streaming group and the non-streaming group separately, so each cell is divided by its own row total: 28 ÷ 40 = 0.70 and 9 ÷ 10 = 0.90. The 0.56 and 0.18 are not wrong numbers, they just answer a different question: 0.56 + 0.18 = 0.74 is the share of ALL 50 students who finish before dinner. To compare the groups, the row totals are the dividers, and 0.90 against 0.70 says the non-streamers tend to finish before dinner.`, kind: 'common-error' },
    { content: `Two yes/no questions per student go into a two-way frequency table: one question across the rows, the other down the columns, every student in exactly one cell, totals in the margins.`, kind: 'tip' },
    { content: `Fill a missing cell by subtracting from its row or column total, then check that the row totals and the column totals both add to the grand total.`, kind: 'tip' },
    { content: `A raw count cannot compare groups of different sizes. Divide each cell by the total of the group the question names: the row total for a row question, the column total for a column question, never the grand total.`, kind: 'tip' },
    { content: `Compare the same relative frequency across the two groups. Clearly different, such as 0.80 against 0.40, means a possible association; about the same, such as 0.75 against 0.75, means no association.`, kind: 'tip' },
    { content: `Check by working backward: relative frequency × group total must rebuild the cell count.`, kind: 'tip' },
    { content: `**Row question = row total divider; column question = column total divider.** Read the question carefully. If it says "of students WITH a curfew", use the curfew row total. If it says "of students WITH chores", use the chores column total. Dividing by the grand total compares nothing.`, kind: 'common-error' },
    { content: `Raw counts from unequal groups lie. 28 > 9, but if one group has 40 students and the other has 10, the bigger group wins automatically. Always divide by the group total first: 28÷40 = 0.70 vs. 9÷10 = 0.90 tells the true story.`, kind: 'gotcha' },
    { content: `Both row totals and column totals must add to the grand total. If they don't match, a cell is wrong—go back and check subtraction. Missing cell = its total minus what you already know.`, kind: 'tip' },
    { content: `Relative frequencies in a row or column always add to 1. If 0.80 and 0.20, or 0.75 and 0.25, you've split one whole. If they don't add to 1, you divided by the wrong total.`, kind: 'tip' },
    { content: `"Possible association" means the two relative frequencies are *clearly* different, like 0.80 vs. 0.40. Small differences like 0.75 vs. 0.72 are "no association." Use your judgment; the numbers tell the story.`, kind: 'vocab-note' },
    { content: `Check your work backward: relative frequency × group total should rebuild the cell count exactly. If 0.60 × 45 ≠ 27, the division was wrong.`, kind: 'tip' },
    { content: `The question's wording determines what you divide by. "Of students WITH a curfew" (row named) → row total. "Of students WITH chores" (column named) → column total. Always underline the group name before you divide.`, kind: 'common-error' },
    { content: `Relative frequencies let you compare groups of different sizes fairly. A 40-student row and a 10-student row are equal partners once you divide: 0.70 and 0.90 stand on equal ground.`, kind: 'edge-case' },
  ],
};
