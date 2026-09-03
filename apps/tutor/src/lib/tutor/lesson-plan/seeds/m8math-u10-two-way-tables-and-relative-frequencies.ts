/**
 * Grade 8 Math — Bivariate Data: Scatter Plots & Two-Way Tables: Two-Way
 * Tables & Relative Frequencies.
 *
 * PROCEDURE-LED plan for the m8math fan-out (row 10.4, CCSS 8.SP.A.4). The
 * rest of Unit 10 worked with two MEASUREMENTS per student, plotted as
 * points; here each student answers two yes/no questions, and yes/no answers
 * are categories with nothing to plot. The concept segment is an ordered
 * recipe: set up the two-way frequency table with its margins, fill the
 * missing cells by subtraction and check the totals, turn counts into
 * relative frequencies by dividing each cell by the total of the group the
 * question names (row total or column total), then compare the same relative
 * frequency across the two groups to describe a possible association. Both
 * worked examples run the same moves, one on a row question that shows an
 * association and one on a column question that shows none, and every solve
 * ends with a work-backward check (relative frequency × group total rebuilds
 * the cell). Two traps this plan is built to kill: comparing raw cell counts
 * across groups of different sizes, and dividing a cell by the grand total
 * when the question is about one group.
 *
 * SCOPE GUARD: Grade 8 row 10.4 organizes bivariate categorical data in a
 * two-way frequency table, computes row and column relative frequencies, and
 * uses them to describe a possible association (do students with a curfew
 * tend to have chores?). Withholds: conditional-probability language and
 * independence tests — no shipped HS seed covers two-way tables (verified
 * against all 40 `alg1-*` and 40 `geom-*` LO descriptions), so nothing is
 * handed up from this row. Concretely: a relative frequency is always called
 * a relative frequency and never a probability or a chance, the words
 * "probability", "conditional" and "independent" never appear, no expected
 * count is computed, and the comparison across groups is described in plain
 * words ("clearly different" or "about the same"), never as a test with a
 * threshold. Sideways: rows 10.1-10.3 own measurement data, scatter plots,
 * by-eye lines and fitted models; none of that is taught or assessed here,
 * and scatter plots are mentioned only in the hook, to contrast categories
 * with numbers. Below, assumed and never re-taught: sampling and inference
 * from `m7math-u9-*` (the word "possible" in "possible association" is
 * explained in one sentence, not as a sampling lesson), all probability from
 * `m7math-u10-*` (never borrowed down), and the decimal-to-percent conversion
 * (recalled in one clause). Every count and total in this plan is chosen so
 * that each relative frequency is a terminating decimal of at most two
 * decimal places, and relative frequencies are written as decimals, not
 * fractions. Salvage: none.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U10_TWO_WAY_TABLES_AND_RELATIVE_FREQUENCIES: LessonPlan = {
  id: 'evelyn.ms.m8math.two-way-tables-and-relative-frequencies.v1',
  title: 'Two-Way Tables & Relative Frequencies',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.two-way-tables-and-relative-frequencies',
      standard: 'M8MATH-10.4',
      description:
        'Organize bivariate categorical data in a two-way frequency table, compute row and column relative frequencies, and use them to describe a possible association (do students with a curfew tend to have chores?) (CCSS 8.SP.A.4).',
    },
  ],
  prerequisites: ['m8math.using-a-linear-model-with-bivariate-data'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two yes/no questions in front of the student and show that neither the raw pile of answers nor a single count can say whether the two answers travel together.',
      script:
        'Your science teacher runs a two-question survey on the board before class starts: do you have a curfew on school nights, and do you have chores at home? Forty students answer both, and what lands on the desk is a pile of forty answer pairs: yes-yes, yes-no, no-yes, no-no. Then someone in the back asks the real question. Are the kids with a curfew the same kids stuck doing chores? You cannot answer that from the pile, and you cannot answer it by counting curfews and counting chores separately, because the question is about how the two answers go TOGETHER for each student. The scatter plots you made earlier in this unit needed two numbers for every student, and a yes or a no is not a number, so there is no point to plot. Instead the forty pairs get sorted into a table with two rows and two columns, and today you learn how to fill that table, how to turn its counts into relative frequencies, and how to read an answer to the question from the back of the room.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-build-then-divide',
      kind: 'concept',
      goal: 'Install the recipe: set up the two-way table with margins, fill it by subtraction, divide each cell by the total of the group the question names, and compare across groups to describe a possible association.',
      keyIdeas: [
        'TWO QUESTIONS, ONE TABLE — when every student answers two yes/no questions, the answers are categories, not measurements, so there is nothing to plot. Instead they go into a two-way frequency table: the rows hold the answers to one question (curfew: yes or no), the columns hold the answers to the other (chores: yes or no), and each student is counted in exactly one of the four cells. The margins hold the totals: a total for each row, a total for each column, and the grand total in the corner.',
        'FILL THE TABLE BY SUBTRACTION — every row adds up to its row total and every column adds up to its column total, so a missing cell is its total minus the cells you already know. If 25 students have a curfew and 20 of them have chores, the curfew-but-no-chores cell is 25 - 20 = 5. Finish by checking that the row totals and the column totals both add to the grand total; if they do not, a cell is wrong.',
        'A RAW COUNT CANNOT COMPARE GROUPS OF DIFFERENT SIZES — 20 curfew students have chores and only 6 no-curfew students do, but there are 25 students in the first group and 15 in the second, so the bigger group wins the count before anyone looks at the data. To compare the groups fairly, turn each count into a relative frequency: the cell divided by the total of the group it belongs to.',
        'ROW RELATIVE FREQUENCY — divide a cell by its ROW total. In the curfew row, 20 ÷ 25 = 0.80 have chores and 5 ÷ 25 = 0.20 do not, and the two add to 1 because the row has been split into parts of one whole. A row relative frequency answers "of the students WITH a curfew, what fraction have chores?" Writing 0.80 as 80% is the same conversion you already own.',
        'COLUMN RELATIVE FREQUENCY — divide a cell by its COLUMN total, which answers the flipped question: "of the students WITH chores, what fraction have a curfew?" The group named in the question decides the divider. If the question says "of the students with a curfew", the curfew row total is the divider; if it says "of the students with chores", the chores column total is. Dividing by the grand total instead gives the cell as a share of the whole survey, which does not compare the two groups at all.',
        'COMPARE ACROSS THE TWO GROUPS TO DESCRIBE A POSSIBLE ASSOCIATION — line up the same relative frequency for both rows (or both columns). If they are clearly different, 0.80 against 0.40, the two answers travel together and there is a possible association: students with a curfew tend to have chores. If they are about the same, 0.75 against 0.75, there is no association, and knowing one answer tells you nothing about the other. Call it a possible association, because a survey describes only the group that was asked.',
      ],
      vocabulary: [
        { term: 'two-way frequency table', definition: 'a table that sorts every person by the answers to two questions at once, with one question across the rows and the other down the columns, plus a total for each row, each column and the whole group.' },
        { term: 'cell', definition: 'one box inside the table, holding the count of people who gave one particular pair of answers, such as curfew-yes and chores-yes.' },
        { term: 'relative frequency', definition: 'a count divided by the total of the group it belongs to, written as a decimal between 0 and 1.' },
        { term: 'row relative frequency', definition: 'a cell divided by its row total; the fraction of that row\'s group that falls in that column.' },
        { term: 'column relative frequency', definition: 'a cell divided by its column total; the fraction of that column\'s group that falls in that row.' },
        { term: 'association', definition: 'a pattern in which the answer to one question tends to go with a particular answer to the other, seen when the relative frequencies for the two groups are clearly different.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-curfew-and-chores',
      kind: 'worked_example',
      problem:
        'Forty students answered the survey from the hook. 25 of them have a curfew, and 20 of those 25 also have chores. Of the students with no curfew, 6 have chores. Build the two-way table and use row relative frequencies to answer: do students with a curfew tend to have chores?',
      steps: [
        'Set up the table. Rows: curfew yes, curfew no. Columns: chores yes, chores no. Add a total column on the right, a total row along the bottom, and the grand total of 40 in the corner.',
        'Place what you were told. Curfew-yes row total: 25. Curfew-yes and chores-yes cell: 20. Curfew-no and chores-yes cell: 6. Grand total: 40.',
        'Fill the rest by subtraction. Curfew-yes and chores-no: 25 - 20 = 5. Curfew-no row total: 40 - 25 = 15. Curfew-no and chores-no: 15 - 6 = 9. Chores-yes column total: 20 + 6 = 26. Chores-no column total: 5 + 9 = 14.',
        'Check the margins. Row totals: 25 + 15 = 40. Column totals: 26 + 14 = 40. Both match the grand total, so the table is filled correctly.',
        'The question names the group "students with a curfew", so it is a row question, and each row total is the divider. Curfew-yes row: 20 ÷ 25 = 0.80 have chores, 5 ÷ 25 = 0.20 do not, and 0.80 + 0.20 = 1. Curfew-no row: 6 ÷ 15 = 0.40 have chores, 9 ÷ 15 = 0.60 do not, and 0.40 + 0.60 = 1.',
        'Compare the same relative frequency across the two rows: 0.80 of the curfew students have chores, against 0.40 of the no-curfew students. Those are clearly different, so there is a possible association: students with a curfew tend to have chores.',
        'Check by working backward: 0.80 × 25 = 20 and 0.40 × 15 = 6, which are exactly the two chores-yes cells. The relative frequencies rebuild the counts, so the division was right.',
      ],
      answer: 'Curfew row: 0.80 have chores. No-curfew row: 0.40 have chores. Students with a curfew tend to have chores, a possible association.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sport-and-lunch',
      kind: 'worked_example',
      problem:
        'Sixty students were asked whether they play on a school sports team and whether they pack their lunch or buy it. 36 play on a team, and 27 of those 36 pack lunch. Of the 24 who do not play on a team, 18 pack lunch. Do students who pack lunch tend to play on a team?',
      steps: [
        'Set up and fill the table. Team row: 27 pack, 36 - 27 = 9 buy, total 36. No-team row: 18 pack, 24 - 18 = 6 buy, total 24. Pack column total: 27 + 18 = 45. Buy column total: 9 + 6 = 15. Check: 36 + 24 = 60 and 45 + 15 = 60.',
        'The question names the group "students who pack lunch", which is a column, so this is a column question and each column total is the divider. Pack column: 27 ÷ 45 = 0.60 play on a team, 18 ÷ 45 = 0.40 do not. Buy column: 9 ÷ 15 = 0.60 play on a team, 6 ÷ 15 = 0.40 do not.',
        'Compare across the two columns: 0.60 of the lunch packers play on a team, and 0.60 of the lunch buyers play on a team. Those are the same, so there is no association. Knowing that a student packs lunch tells you nothing about whether they play on a team.',
        'WRONG: "27 team players pack lunch and only 18 non-players do, so team players tend to pack lunch." CORRECT: those counts come from a group of 36 and a group of 24, so the bigger group was always going to have the bigger count. Divide each by its own row total: 27 ÷ 36 = 0.75 and 18 ÷ 24 = 0.75. The rows agree with the columns: no association either way.',
        'Check by working backward: 0.60 × 45 = 27 and 0.60 × 15 = 9, the two team-row cells. One more check that the 0.60 makes sense: 36 of the 60 students play on a team, and 36 ÷ 60 = 0.60, so each column simply matches the whole group.',
      ],
      answer: 'Pack column: 0.60 play on a team. Buy column: 0.60 play on a team. No association: packing lunch does not go with playing on a team.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fill-the-missing-cell',
      kind: 'try_yourself',
      problem:
        'A survey of 50 students asks whether they ride the bus to school and whether they own a bike. 30 students ride the bus. 18 students ride the bus and own a bike. 8 students do neither: they do not ride the bus and do not own a bike. How many students own a bike but do not ride the bus?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '22' },
        { id: 'b', text: '20' },
        { id: 'c', text: '12', correct: true },
        { id: 'd', text: '32' },
      ],
      expectedAnswer: '12',
      hints: [
        'Start with the row for students who do NOT ride the bus. Its row total is the 50 students minus the 30 bus riders.',
        'That row holds 20 students, and 8 of them are the neither group. Every other student in that row owns a bike, so subtract. Then check: the bus row is 18 + 12 = 30, and the two bike cells plus the two no-bike cells must add to 50.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-statement',
      kind: 'try_yourself',
      problem:
        'A survey of 50 eighth graders sorts each student by whether they play on a school team and whether they have an after-school job such as babysitting or dog-walking. Team row: 12 have a job, 28 do not, 40 in the row. No-team row: 6 have a job, 4 do not, 10 in the row. Which statement do the row relative frequencies support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Students not on a team tend to have a job, because 6 ÷ 10 = 0.60 is larger than 12 ÷ 40 = 0.30', correct: true },
        { id: 'b', text: 'Team players tend to have a job, because 12 team players have a job and only 6 non-players do' },
        { id: 'c', text: 'Team players tend to have a job, because 12 ÷ 50 = 0.24 is larger than 6 ÷ 50 = 0.12' },
        { id: 'd', text: 'There is no association, because both rows contain students with a job and students without one' },
      ],
      expectedAnswer: 'Students not on a team tend to have a job, because 6 ÷ 10 = 0.60 is larger than 12 ÷ 40 = 0.30',
      hints: [
        'A row relative frequency divides a cell by its OWN row total: 40 for the team row and 10 for the no-team row. Neither the grand total of 50 nor a raw count can compare two groups of such different sizes.',
        'Compute 12 ÷ 40 and 6 ÷ 10, then compare the two decimals. The larger one names the group that tends to have a job, and "clearly different" is what a possible association looks like.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-row-relative-frequency',
      kind: 'try_yourself',
      problem:
        'In a survey of 50 eighth graders, 20 students walk to school, and 15 of those 20 arrive before the first bell. Of the 30 students who do not walk, 18 arrive before the first bell. What is the row relative frequency of arriving before the first bell among the students who walk? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '0.75',
      hints: [
        'The question names the group "students who walk", so that row total is the divider, not the 50 students in the whole survey and not the number who arrive before the bell.',
        'Divide 15 by 20. Check by working backward: your decimal times 20 should give 15 back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-raw-counts-and-grand-total',
      kind: 'misconception_check',
      question:
        'A survey of 50 students asks whether they stream music while doing homework and whether they usually finish homework before dinner. Of the 40 who stream music, 28 finish before dinner. Of the 10 who do not stream music, 9 finish before dinner. Dev says students who stream music tend to finish before dinner, because 28 is more than 9. Lena says the same thing, because 28 ÷ 50 = 0.56 is larger than 9 ÷ 50 = 0.18. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Students who stream music tend to finish before dinner, because 28 is more than 9.',
          misconception: 'Comparing raw cell counts from two groups of very different sizes, 40 streamers against 10 non-streamers, so the bigger group wins before the data is looked at.',
          correctsTo:
            'Divide each cell by its own row total. Streaming row: 28 ÷ 40 = 0.70 finish before dinner. Non-streaming row: 9 ÷ 10 = 0.90 finish before dinner. Now the comparison is fair, and 0.90 is larger than 0.70, so the students who do NOT stream music tend to finish before dinner, the opposite of what the raw counts suggested. Check by working backward: 0.70 × 40 = 28 and 0.90 × 10 = 9.',
        },
        {
          answer: 'Students who stream music tend to finish before dinner, because 28 ÷ 50 = 0.56 is larger than 9 ÷ 50 = 0.18.',
          misconception: 'Dividing each cell by the grand total instead of its row total. Those decimals are each cell as a share of the whole survey, and the bigger group automatically gets the bigger share, so they cannot compare the two groups.',
          correctsTo:
            'The question is about the streaming group and the non-streaming group separately, so each cell is divided by its own row total: 28 ÷ 40 = 0.70 and 9 ÷ 10 = 0.90. The 0.56 and 0.18 are not wrong numbers, they just answer a different question: 0.56 + 0.18 = 0.74 is the share of ALL 50 students who finish before dinner. To compare the groups, the row totals are the dividers, and 0.90 against 0.70 says the non-streamers tend to finish before dinner.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two yes/no questions per student go into a two-way frequency table: one question across the rows, the other down the columns, every student in exactly one cell, totals in the margins.',
        'Fill a missing cell by subtracting from its row or column total, then check that the row totals and the column totals both add to the grand total.',
        'A raw count cannot compare groups of different sizes. Divide each cell by the total of the group the question names: the row total for a row question, the column total for a column question, never the grand total.',
        'Compare the same relative frequency across the two groups. Clearly different, such as 0.80 against 0.40, means a possible association; about the same, such as 0.75 against 0.75, means no association.',
        'Check by working backward: relative frequency × group total must rebuild the cell count.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Two-Way Tables & Relative Frequencies' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
