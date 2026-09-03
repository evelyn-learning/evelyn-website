/**
 * Grade 8 Math — Functions & Volume: Comparing Functions in Different
 * Representations.
 *
 * PROCEDURE-LED. Row 3.2 compared two proportional relationships by pulling
 * ONE number, the unit rate, out of each form. This row does the same job
 * for general linear functions (CCSS 8.F.A.2), where each function is TWO
 * numbers: a rate of change and an initial value. Two linear functions
 * arrive in two different forms — a table, a graph, an equation, or a
 * sentence — and the student extracts both numbers from each, then answers
 * three separate questions: which starts higher (compare the initial
 * values), which grows faster (compare the rates), and where they meet
 * (starting gap ÷ rate difference, checked by plugging that x into both).
 * The concept segment is a short recipe, one extraction move per
 * representation, rather than a new mental model. Both worked examples run
 * the same moves so the pattern is unmistakable. Three traps this plan is
 * built to kill: dividing y by x at a marked point on a graph that does not
 * pass through the origin (the proportional shortcut, carried over from row
 * 3.2), swapping the rate and the initial value when reading an equation or
 * a sentence, and letting the higher start decide the whole comparison.
 *
 * SCOPE GUARD: Grade 8 row 6.3 compares two linear functions given as a
 * table, a graph, an equation, and a verbal description by extracting each
 * rate of change AND initial value (which grows faster, which starts higher,
 * where they meet); extends row 3.2 from proportional to general linear.
 * Withholds: building models from scratch (Unit 7). Concretely: every table
 * in this plan lists an x = 0 row and every graph is described with the
 * height where it crosses the vertical axis, so the initial value is always
 * READ, never backed out as b = y - mx from a table or graph that hides it
 * (row 7.1); every verbal description states its starting amount and its
 * per-unit rate in plain words, and the plan never asks the student to write
 * y = mx + b from a description as a deliverable (row 7.2) — from words it
 * only names the two numbers. Every function in this plan is already known
 * to be linear, and every rate of change in it is positive; the constant-rate
 * table test is used as a tool from row 6.2, never as the objective. The
 * meeting point is found as (starting gap) ÷ (rate difference) and checked
 * by plugging the result into both functions; where a worked example shows
 * the same result by setting the two expressions equal, that is the
 * variables-on-both-sides move (row 4.1) and the two-plans setup (row 5.4)
 * recalled in one sentence, never re-taught, and the word "system" is not
 * used. Reading m and b from a graph that shows its intercept is row 3.4
 * ground, assumed; the unit-rate comparison of row 3.2 is recalled only to
 * say that its divide-y-by-x shortcut fails once the line leaves the origin.
 * Above, withheld: no f(x) notation, no domain or range, no average rate of
 * change over an interval (`alg1-u4-relations-functions.ts`); no zero or
 * undefined slope classification (`alg1-u4-slope-rate-of-change.ts`); the
 * one clause about two equal rates says only that the gap never changes and
 * the functions never meet, in plain words, with no parallel-line or
 * no-solution vocabulary (`alg1-u5-systems-by-graphing.ts`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U6_COMPARING_FUNCTIONS_IN_DIFFERENT_REPRESENTATIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.comparing-functions-in-different-representations.v1',
  title: 'Comparing Functions in Different Representations',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.comparing-functions-in-different-representations',
      standard: 'M8MATH-6.3',
      description:
        'Compare two linear functions given as a table, a graph, an equation, and a verbal description by extracting each rate of change AND initial value (which grows faster, which starts higher, where they meet) (CCSS 8.F.A.2).',
    },
  ],
  prerequisites: ['m8math.linear-vs-nonlinear-functions'],
  followUps: ['m8math.volume-of-cylinders-cones-and-spheres'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hand the student two linear functions in two different forms, so the need for TWO numbers per function, and for three separate questions, is felt before the recipe is given.',
      script:
        'Your phone and your friend Sam\'s phone are both plugged in at the same wall outlet before practice. Your phone shows its charge as a table on the battery screen: 0 minutes, 20 percent; 5 minutes, 30 percent; 10 minutes, 40 percent; 15 minutes, 50 percent. Sam\'s phone shows no table at all, just one line of text: "35 percent when plugged in, gaining 1.5 percent every minute." Sam\'s phone is ahead right now, but yours seems to be climbing quickly. Three questions matter: which phone started higher, which one charges faster, and after how many minutes will the two phones show the same number? When you compared proportional relationships, one number, the unit rate, described the whole relationship. A charging phone does not start at zero, so each of these functions needs TWO numbers, a starting value and a rate of change, and one comparison becomes two. Today you learn to pull those two numbers out of a table, a graph, an equation, or a sentence, and to answer all three questions.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-numbers-per-function',
      kind: 'concept',
      goal: 'Install the extract-both-numbers recipe, one move per representation, the two separate comparisons, and the head-start-over-rate-gap way to find where two functions meet.',
      keyIdeas: [
        'A LINEAR FUNCTION IS TWO NUMBERS — every linear function is y = mx + b: m is the rate of change, how much y goes up for each 1 unit of x, and b is the initial value, the y when x is 0. A savings plan that starts at $40 and adds $8 a week has initial value 40 and rate of change 8. When every relationship went through the origin, one number told the whole story; now that the start can be anything, you need both numbers, and comparing two linear functions means comparing two pairs of numbers.',
        'FROM AN EQUATION OR A SENTENCE — in y = 8x + 40 the rate is the number in front of x, 8, and the initial value is the number standing alone, 40. The order does not matter: 40 + 8x is the same function. In a sentence, the amount "per week", "per minute", or "for each person" is the rate, and the amount that is there before anything happens, "starts with", "already has", "to book", is the initial value.',
        'FROM A TABLE — the initial value is the y-value in the row where x is 0. The rate of change is the change in y for one step of 1 in x, so when x goes 0, 1, 2, 3, subtract neighboring y-values. When x steps by 5, or by 2, divide the change in y by the change in x: from (0, 20) to (5, 30), the rate is 10 ÷ 5 = 2. This is the constant rate you tested for last lesson; in a linear table it comes out the same between any two rows, so use whichever two rows are easiest.',
        'FROM A GRAPH, SUBTRACT BEFORE YOU DIVIDE — the initial value is the height where the line crosses the vertical axis, at x = 0. The rate of change is rise over run from that crossing to a marked point: from a crossing at 60 to the point (4, 100), the rise is 100 - 60 = 40, the run is 4, and the rate is 40 ÷ 4 = 10. Dividing 100 by 4 only gave the rate when you compared proportional relationships, because those lines passed through the origin; a line that starts at 60 has a rise of 40, not 100.',
        'HIGHER START AND FASTER GROWTH ARE SEPARATE QUESTIONS — compare the two initial values to see which starts higher, and compare the two rates to see which grows faster. The one that starts higher does not have to grow faster: $60 plus $10 a week starts higher than $25 plus $15 a week, and grows slower. When each question has a different winner, the slower one is ahead at first and the faster one catches up.',
        'WHERE THEY MEET — the gap at the start is the difference between the two initial values, and every unit of x the gap shrinks by the difference between the two rates. The two functions meet after (starting gap) ÷ (rate difference) units: a $35 head start closing at $5 a week is gone after 35 ÷ 5 = 7 weeks. Check by putting that x into both functions; both must give the same y. If the two rates are equal, the gap never changes and the two functions never meet.',
      ],
      vocabulary: [
        { term: 'rate of change', definition: 'how much y changes for each 1 unit of x; in y = mx + b it is m, the number in front of x, and on a graph it is rise over run.' },
        { term: 'initial value', definition: 'the value of y when x is 0; in y = mx + b it is b, in a table it is the x = 0 row, and on a graph it is where the line crosses the vertical axis.' },
        { term: 'linear function', definition: 'a function of the form y = mx + b, whose graph is a straight line and whose rate of change is the same between any two points.' },
      ],
      suggestedTools: ['show_function_graph', 'show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-phones-table-vs-sentence',
      kind: 'worked_example',
      problem:
        'Your phone\'s charge is a table: 0 minutes, 20 percent; 5 minutes, 30 percent; 10 minutes, 40 percent; 15 minutes, 50 percent. Sam\'s phone reads "35 percent when plugged in, gaining 1.5 percent every minute." Which phone started higher, which charges faster, and after how many minutes do they show the same charge?',
      steps: [
        'Extract your phone\'s two numbers from the table. The row where minutes is 0 gives the initial value: 20 percent. For the rate, take two rows and divide the change in percent by the change in minutes: from (0, 20) to (5, 30), that is 10 ÷ 5 = 2 percent per minute. The next rows agree, 40 - 30 = 10 over 5 minutes is again 2 per minute, so the rate is 2.',
        'Extract Sam\'s two numbers from the sentence. "35 percent when plugged in" is the initial value, 35. "Gaining 1.5 percent every minute" is the rate of change, 1.5.',
        'Compare the starts: 35 is bigger than 20, so Sam\'s phone started higher. Compare the rates: 2 is bigger than 1.5, so your phone charges faster. The two questions have different winners, which means yours will catch up.',
        'Find where they meet. The starting gap is 35 - 20 = 15 percent, and every minute the gap shrinks by 2 - 1.5 = 0.5 percent. The gap is gone after 15 ÷ 0.5 = 30 minutes.',
        'Check by plugging 30 minutes into both. Yours: 20 + 2 × 30 = 20 + 60 = 80 percent. Sam\'s: 35 + 1.5 × 30 = 35 + 45 = 80 percent. Both phones read 80 percent at 30 minutes, so the meeting point holds. Setting the two amounts equal, 20 + 2t = 35 + 1.5t, and collecting the variable terms the way you already do gives 0.5t = 15 and t = 30, the same arithmetic.',
        'Read it back into the story. At 15 minutes the table says yours is at 50, while Sam\'s is at 35 + 1.5 × 15 = 35 + 22.5 = 57.5, still ahead. Sam\'s lead was 15 points, it lost 0.5 of a point every minute, and 30 minutes is when the lead runs out.',
      ],
      answer: 'Sam\'s phone started higher (35 versus 20 percent); yours charges faster (2 versus 1.5 percent per minute); they meet at 30 minutes, both at 80 percent',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-skateboard-graph-vs-equation',
      kind: 'worked_example',
      problem:
        'Theo and Nia are both saving for the same skateboard. Theo\'s savings are shown by a graph, weeks across and dollars up: the line crosses the vertical axis at 60 and passes through the point (4, 100). Nia\'s savings follow the equation s = 15w + 25, where s is dollars and w is weeks. Who started with more, who saves faster, and after how many weeks do they have the same amount?',
      steps: [
        'Extract Theo\'s two numbers from the graph. The line crosses the vertical axis at 60, so the initial value is 60: that is what Theo had at week 0. For the rate, use the crossing and the marked point: from (0, 60) to (4, 100), the rise is 100 - 60 = 40 and the run is 4 - 0 = 4, so the rate is 40 ÷ 4 = 10 dollars per week.',
        'WRONG: dividing 100 by 4 to get a rate of 25 dollars per week. CORRECT: dividing y by x at a point only gives the rate when the line passes through the origin, and this line starts at 60. The rise from week 0 to week 4 is 40, not 100. The graph itself exposes the slip: at 25 a week Theo would have 60 + 25 × 4 = 160 at week 4, but the marked point says 100.',
        'Extract Nia\'s two numbers from the equation. In s = 15w + 25, the number in front of w is the rate, 15 dollars per week, and the number standing alone is the initial value, 25 dollars.',
        'Compare the starts: 60 is bigger than 25, so Theo started with more. Compare the rates: 15 is bigger than 10, so Nia saves faster. Different winners, so Nia catches up.',
        'Find where they meet. The starting gap is 60 - 25 = 35 dollars, and each week it shrinks by 15 - 10 = 5 dollars, so the gap is gone after 35 ÷ 5 = 7 weeks.',
        'Check by plugging 7 weeks into both. Theo: 60 + 10 × 7 = 60 + 70 = 130. Nia: 15 × 7 + 25 = 105 + 25 = 130. Both have $130 after 7 weeks, so the answer holds, and from week 8 on Nia has more: 140 for Theo against 145 for Nia.',
      ],
      answer: 'Theo started with more ($60 versus $25); Nia saves faster ($15 versus $10 per week); they have the same amount, $130, after 7 weeks',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plants-table-vs-equation',
      kind: 'try_yourself',
      problem:
        'Two plants are measured every week. Plant P\'s height is a table: week 0, 12 cm; week 1, 15 cm; week 2, 18 cm; week 3, 21 cm. Plant Q\'s height follows the equation h = 4w + 8, where h is centimeters and w is weeks. Which statement is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plant P starts taller and grows faster' },
        { id: 'b', text: 'Plant P starts taller, but Plant Q grows faster', correct: true },
        { id: 'c', text: 'Plant Q starts taller, but Plant P grows faster' },
        { id: 'd', text: 'Plant Q starts taller and grows faster' },
      ],
      expectedAnswer: 'Plant P starts taller, but Plant Q grows faster',
      hints: [
        'Two separate questions. For the start, compare the table\'s week 0 entry with the number standing alone in Plant Q\'s equation. For growth, compare how much each plant adds per week.',
        'Plant P adds 15 - 12 = 3 cm each week; the 15 is a height, not a rate. In h = 4w + 8, the 4 is the growth per week and the 8 is the starting height.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trampoline-graph-vs-sentence',
      kind: 'try_yourself',
      problem:
        'Two trampoline parks price a group visit. Park J\'s price is a graph, people across and dollars up: the line crosses the vertical axis at 20 and passes through the point (5, 60). Park K charges $30 to book plus $6 for each person. Which statement is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Park J costs more to book, and Park J charges more per person' },
        { id: 'b', text: 'Park K costs more to book, and Park K charges more per person' },
        { id: 'c', text: 'Park J costs more to book, but Park K charges more per person' },
        { id: 'd', text: 'Park K costs more to book, but Park J charges more per person', correct: true },
      ],
      expectedAnswer: 'Park K costs more to book, but Park J charges more per person',
      hints: [
        'Park J\'s booking cost is where its line crosses the vertical axis, not the height of the marked point. Its per-person charge is rise over run from that crossing to the point: subtract before you divide, and keep dollars on top.',
        'Park J rises 60 - 20 = 40 dollars over 5 people. Compare that per-person rate with Park K\'s $6, and compare Park J\'s crossing at 20 with Park K\'s $30 booking fee.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-followers-meeting-week',
      kind: 'try_yourself',
      problem:
        'Dev\'s follower count follows n = 25w + 140, where n is followers and w is weeks from now. Lena\'s follower count is a table: week 0, 200; week 2, 230; week 4, 260; week 6, 290. After how many weeks will they have the same number of followers? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Pull two numbers out of each. Dev\'s rate and start are in the equation. Lena\'s start is the week 0 row, and her rate is the change in followers divided by the change in weeks, because the table steps by 2 weeks, not 1.',
        'Lena starts 200 - 140 = 60 followers ahead, and Dev gains on her by 25 - 15 = 10 followers every week. Divide the head start by the rate difference, then check both counts at that week.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divide-at-point-and-higher-start-wins',
      kind: 'misconception_check',
      question:
        'Jonah and Ria are each saving for concert tickets. Jonah\'s savings are a graph, weeks across and dollars up: the line crosses the vertical axis at 50 and passes through the point (6, 110). Ria says, "I have $20 and I add $16 every week." One student says Jonah saves faster, because 110 ÷ 6 is about 18.3, and 18.3 is bigger than 16. Another student says Jonah has more money now, so Jonah will always have more. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Jonah saves faster, because 110 ÷ 6 is about 18.3 and that is bigger than 16.',
          misconception: 'Dividing y by x at a marked point to get the rate, which only works for a line through the origin; this line starts at 50, so the rise to the point is smaller than the point\'s height.',
          correctsTo:
            'Subtract before you divide. From the crossing at (0, 50) to the point (6, 110), the rise is 110 - 50 = 60 and the run is 6, so Jonah\'s rate is 60 ÷ 6 = 10 dollars per week. Ria adds 16 dollars per week, and 16 is bigger than 10, so Ria saves faster. A quick check: at 10 a week Jonah has 50 + 10 × 6 = 110 at week 6, exactly the marked point; at 18.3 a week he would have about 160, which the graph does not show.',
        },
        {
          answer: 'Jonah has more money now, so Jonah will always have more.',
          misconception: 'Letting the higher initial value decide the whole comparison, when the rates decide who is ahead later.',
          correctsTo:
            'Starting higher and growing faster are separate questions. Jonah starts higher, 50 against 20, but Ria grows faster, 16 against 10 per week, so Ria catches up. The gap is 50 - 20 = 30 dollars and it shrinks by 16 - 10 = 6 dollars a week, so it is gone after 30 ÷ 6 = 5 weeks: Jonah has 50 + 10 × 5 = 100 and Ria has 20 + 16 × 5 = 100. By week 6, Jonah has 110, the marked point, and Ria has 20 + 16 × 6 = 116, so Ria is ahead.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A linear function is two numbers: the rate of change (the number in front of x, the "per" amount) and the initial value (the number standing alone, the y when x is 0).',
        'From a table, the initial value is the x = 0 row and the rate is the change in y divided by the change in x between any two rows. From a graph, the initial value is where the line crosses the vertical axis and the rate is rise over run from that crossing to a marked point.',
        'On a graph that does not pass through the origin, subtract before you divide: the rise is the point\'s height minus the crossing, not the height by itself.',
        'Which starts higher is decided by the initial values; which grows faster is decided by the rates. They are separate questions and can have different winners.',
        'Two functions with different winners meet after (starting gap) ÷ (rate difference) units; check by plugging that x into both and getting the same y.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Comparing Functions in Different Representations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
