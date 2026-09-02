/**
 * Grade 6 Math — Understanding Ratios & Rates: Representing Ratios with
 * Tables & Diagrams.
 *
 * PROCEDURE-LED lesson for the m6math fan-out (row 1.2, CCSS 6.RP.A.3a). Row
 * 1.1 built the language of a ratio; this lesson turns that language into
 * three pictures a student can build and extend: a ratio table, a tape
 * diagram, and a double number line. All three run on one rule — multiply
 * both quantities by the same scale factor — and the lesson is built so that
 * rule is impossible to miss. The single biggest trap here is treating "the
 * same amount added to both numbers" as if it were "the same factor," which
 * looks like it keeps the ratio going but actually breaks it every time.
 *
 * SCOPE GUARD: This lesson builds and reads three representations of a
 * ratio — the ratio table, the tape diagram, and the double number line —
 * and uses each one to generate an equivalent ratio by multiplying both
 * quantities by the same scale factor. Landing on one missing number inside
 * a table or diagram is the mechanism of building it, so that appears here;
 * it is not the same as row 1.3's job, which is solving a missing-value
 * ratio problem posed as a stand-alone word problem and then plotting the
 * resulting ratio pairs on the coordinate plane — no ordered pair, axis, or
 * graph appears anywhere in this file, because that is entirely row 1.3.
 * This lesson also never computes a unit rate (a divided by b) to compare
 * prices, which is row 1.4, and never touches percent, which is Unit 2.
 * Every quantity here is a positive whole number, and no constant of
 * proportionality or equation such as y = kx appears; that escalation is
 * Grade 7 (m7math Unit 3) and does not belong in Grade 6.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.1 -> 1.2 ->
 * 1.3, per the fan-out contract's course table. Rows 1.1 and 1.3 are
 * authored by sibling agents in this same batch and are not yet on disk, but
 * the controller registers and lints all 40 rows together, so both arrays
 * are populated here with their real loIds rather than left empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U1_REPRESENTING_RATIOS_WITH_TABLES_AND_DIAGRAMS: LessonPlan = {
  id: 'evelyn.ms.m6math.representing-ratios-with-tables-and-diagrams.v1',
  title: 'Representing Ratios with Tables & Diagrams',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.representing-ratios-with-tables-and-diagrams',
      standard: 'M6MATH-1.2',
      description:
        'Build ratio tables, tape diagrams, and double number lines to represent a ratio and generate a sequence of equivalent ratios by scaling both quantities by the same factor (CCSS 6.RP.A.3a).',
    },
  ],
  prerequisites: ['m6math.ratio-language-and-notation'],
  followUps: ['m6math.solving-missing-value-ratio-problems'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a ratio has to be scaled with a rule, not guessed at, before the student meets any representation.',
      script:
        'Your art class is mixing forest-green paint for a mural. The recipe is 2 cups of yellow paint for every 3 cups of blue paint. That small batch looks perfect, but the mural is huge, so you need a much bigger batch of the exact same green. You cannot just pour in more yellow and more blue and hope it still matches. Every batch has to keep the same 2-to-3 mix, no matter how big it gets. Today you learn three ways to picture that mix and scale it up, or down, without ever guessing: a ratio table, a tape diagram, and a double number line.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-pictures-one-rule',
      kind: 'concept',
      goal: 'Build the ratio table, the tape diagram, and the double number line, and install the one rule that makes every scaled version equivalent.',
      keyIdeas: [
        'EQUIVALENT RATIOS COME FROM MULTIPLYING BOTH NUMBERS BY THE SAME FACTOR — the ratio 2:3 stays the same mix when both numbers are multiplied by the same amount: times 2 gives 4:6, times 3 gives 6:9, times 4 gives 8:12. All four of these represent the identical relationship, because the same factor was applied to both numbers every time.',
        'A RATIO TABLE LINES UP EQUIVALENT RATIOS IN COLUMNS — one row lists one quantity, the row underneath lists the matching quantity, and each new column is built by multiplying the first column by a scale factor. Reading straight down a column always gives one equivalent ratio.',
        'A TAPE DIAGRAM SPLITS A BAR INTO EQUAL-SIZE PARTS — a bar cut into 2 parts labeled yellow and 3 parts labeled blue shows the ratio 2:3 directly, because every part is the same size. Making each part represent a bigger amount scales the whole diagram up while the 2-to-3 split of the parts never changes.',
        'A DOUBLE NUMBER LINE STACKS TWO NUMBER LINES WITH MATCHING TICK MARKS — one line counts one quantity, the line directly below it counts the matching quantity, and every pair of tick marks that lines up vertically is an equivalent ratio.',
        'ALL THREE ARE THE SAME RELATIONSHIP IN DIFFERENT PICTURES — a ratio table, a tape diagram, and a double number line built from 2:3 all show the exact same set of equivalent ratios. Pick whichever picture makes the numbers you need easiest to see.',
        'SCALE BY MULTIPLYING, NEVER BY ADDING THE SAME AMOUNT — going from 2 to 6 means multiplying by 3, not adding 4. Adding the same amount to both numbers of a ratio feels like a natural way to keep going, but it breaks the mix every time.',
      ],
      vocabulary: [
        { term: 'ratio table', definition: 'a table that lists a ratio and its equivalent ratios side by side, with each column scaled from the first by a whole-number factor.' },
        { term: 'tape diagram', definition: 'a bar split into equal-size parts, with one count of parts for each quantity in a ratio.' },
        { term: 'double number line', definition: 'two number lines, one for each quantity in a ratio, lined up so that matching tick marks show an equivalent ratio.' },
        { term: 'scale factor', definition: 'the number both quantities in a ratio are multiplied by to produce an equivalent ratio.' },
      ],
      suggestedTools: ['show_table', 'show_diagram', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ratio-table-beads',
      kind: 'worked_example',
      problem:
        'Ava is making friendship bracelets. Her pattern uses 2 red beads for every 3 blue beads. Complete a ratio table to find how many blue beads she needs if she uses 10 red beads.',
      steps: [
        'Set up a ratio table with red beads in the top row and blue beads in the bottom row. Write the first column straight from the pattern: 2 red, 3 blue.',
        'Build more columns by multiplying both numbers in a column by the same scale factor. Times 2: 4 red, 6 blue. Times 3: 6 red, 9 blue. Times 4: 8 red, 12 blue. Times 5: 10 red, 15 blue.',
        '10 red beads matches the column scaled by 5, since 2 × 5 = 10, and the same factor of 5 has to be used for the blue-bead row of that column.',
        'Read the answer straight down that column: 15 blue beads.',
        'Check by dividing back down: 10 red beads / 5 = 2 red beads, and 15 blue beads / 5 = 3 blue beads. That returns the original pattern, 2:3, so the answer holds.',
      ],
      answer: '15 blue beads',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-double-number-line-punch',
      kind: 'worked_example',
      problem:
        'A fruit punch recipe uses 2 cups of juice for every 5 cups of soda. Use a double number line to find how much soda is needed for 6 cups of juice.',
      steps: [
        'Draw two number lines, one on top counting cups of juice and one underneath counting cups of soda, with matching tick marks stacked directly above each other.',
        'Mark the first known pair from the recipe: 2 cups of juice lines up with 5 cups of soda.',
        'Find the scale factor that turns 2 cups of juice into 6 cups of juice: 6 / 2 = 3.',
        'WRONG: noticing that 2 became 6 by adding 4, and adding that same 4 to the soda side to get 5 + 4 = 9 cups of soda. CORRECT: a ratio scales by multiplying both numbers by the same factor, never by adding the same amount to both. The scale factor here is 3, not an addition of 4.',
        'Multiply the soda number by the same scale factor: 5 × 3 = 15 cups of soda.',
        'Mark the new tick on the double number line: 6 cups of juice lines up with 15 cups of soda.',
        'Check by dividing back down: 6 / 3 = 2 cups of juice, and 15 / 3 = 5 cups of soda, which matches the original recipe exactly.',
      ],
      answer: '15 cups of soda',
      estimatedMinutes: 3,
    },
    {
      id: 'try-tape-diagram-lemonade',
      kind: 'try_yourself',
      problem:
        'A tape diagram for a lemonade recipe is split into 5 equal-size parts: 2 parts lemon juice and 3 parts water. Each part represents 4 cups. How many cups of lemon juice are in the recipe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8 cups', correct: true },
        { id: 'b', text: '12 cups' },
        { id: 'c', text: '20 cups' },
        { id: 'd', text: '6 cups' },
      ],
      expectedAnswer: '8 cups',
      hints: [
        'Lemon juice takes up 2 of the 5 equal parts in the diagram. Find the value of one part first.',
        'Each part is 4 cups, and lemon juice takes up 2 parts, so multiply 2 × 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equivalent-ratio-eggs-flour',
      kind: 'try_yourself',
      problem: 'A recipe uses 3 eggs for every 4 cups of flour. Which pair of numbers is an equivalent ratio to 3:4?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9 eggs to 12 cups of flour', correct: true },
        { id: 'b', text: '9 eggs to 10 cups of flour' },
        { id: 'c', text: '9 eggs to 4 cups of flour' },
        { id: 'd', text: '4 eggs to 3 cups of flour' },
      ],
      expectedAnswer: '9 eggs to 12 cups of flour',
      hints: [
        'Find the scale factor that turns 3 eggs into 9 eggs, then use that same factor for the flour.',
        '3 eggs became 9 eggs by multiplying by 3, so multiply the 4 cups of flour by 3 as well, not by adding a number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-orange-pineapple',
      kind: 'try_yourself',
      problem:
        'A juice stand mixes orange juice and pineapple juice in a ratio of 4 cups orange to 6 cups pineapple. Using the same ratio, how many cups of pineapple juice pair with 12 cups of orange juice? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '18',
      hints: [
        'Find the scale factor that turns 4 cups of orange juice into 12 cups of orange juice.',
        '4 cups became 12 cups by multiplying by 3, so multiply 6 cups of pineapple juice by 3 as well.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-constant-difference-and-one-sided-change',
      kind: 'misconception_check',
      question:
        'Two students are each asked to write a ratio equivalent to 3:5. One writes 6:8. Another writes 3:7. What went wrong in each case?',
      commonErrors: [
        {
          answer: '6:8',
          misconception:
            'Keeping the difference between the two numbers the same (5 - 3 = 2, and 8 - 6 = 2 also) instead of multiplying both numbers by the same scale factor.',
          correctsTo:
            'An equivalent ratio comes from multiplying, not from keeping a constant difference. Multiplying both 3 and 5 by 2 gives the true equivalent ratio, 6:10. Check the difference: dividing 6:8 back down by 2 gives 3:4, which is a different ratio from 3:5 entirely, so 6:8 does not match.',
        },
        {
          answer: '3:7',
          misconception: 'Changing only one number in the ratio (5 became 7) and leaving the other number unchanged.',
          correctsTo:
            'An equivalent ratio has to scale BOTH numbers by the same factor. Starting from 3:5 and multiplying both numbers by 3 gives 9:15, which is equivalent. 3:7 changes only the second number and leaves the first alone, so it does not represent the same relationship as 3:5 at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An equivalent ratio comes from multiplying both quantities by the same scale factor, never from adding the same amount to both.',
        'A ratio table lines up a ratio and its equivalent ratios in columns, each column scaled from the first by its own factor.',
        'A tape diagram splits a bar into equal-size parts, with one count of parts for each quantity in the ratio.',
        'A double number line stacks two number lines with matching tick marks, so every vertical pair of ticks is an equivalent ratio.',
        'A ratio table, a tape diagram, and a double number line for the same ratio all show the identical set of equivalent ratios — they are the same relationship in different pictures.',
        'Check any equivalent ratio by dividing both numbers back down by the scale factor; the result must return the original ratio.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Representing Ratios with Tables & Diagrams' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
