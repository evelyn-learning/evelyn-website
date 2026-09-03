/**
 * Grade 6 Math — Unit 1 CED 1.2: Representing Ratios with Tables & Diagrams.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.representing-ratios-with-tables-and-diagrams.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U1_REPRESENTING_RATIOS_WITH_TABLES_AND_DIAGRAMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.representing-ratios-with-tables-and-diagrams.v1',
  course: 'Grade 6 Math',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Representing Ratios with Tables & Diagrams',
  planId: 'evelyn.ms.m6math.representing-ratios-with-tables-and-diagrams.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.representing-ratios-with-tables-and-diagrams.v1' }],
  theory: [
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'Equivalent ratios come from multiplying both numbers by the same factor', content: `EQUIVALENT RATIOS COME FROM MULTIPLYING BOTH NUMBERS BY THE SAME FACTOR — the ratio 2:3 stays the same mix when both numbers are multiplied by the same amount: times 2 gives 4:6, times 3 gives 6:9, times 4 gives 8:12. All four of these represent the identical relationship, because the same factor was applied to both numbers every time.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'A ratio table lines up equivalent ratios in columns', content: `A RATIO TABLE LINES UP EQUIVALENT RATIOS IN COLUMNS — one row lists one quantity, the row underneath lists the matching quantity, and each new column is built by multiplying the first column by a scale factor. Reading straight down a column always gives one equivalent ratio.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'A tape diagram splits a bar into equal-size parts', content: `A TAPE DIAGRAM SPLITS A BAR INTO EQUAL-SIZE PARTS — a bar cut into 2 parts labeled yellow and 3 parts labeled blue shows the ratio 2:3 directly, because every part is the same size. Making each part represent a bigger amount scales the whole diagram up while the 2-to-3 split of the parts never changes.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'A double number line stacks two number lines with matching tick marks', content: `A DOUBLE NUMBER LINE STACKS TWO NUMBER LINES WITH MATCHING TICK MARKS — one line counts one quantity, the line directly below it counts the matching quantity, and every pair of tick marks that lines up vertically is an equivalent ratio.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'All three are the same relationship in different pictures', content: `ALL THREE ARE THE SAME RELATIONSHIP IN DIFFERENT PICTURES — a ratio table, a tape diagram, and a double number line built from 2:3 all show the exact same set of equivalent ratios. Pick whichever picture makes the numbers you need easiest to see.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'framework', title: 'Scale by multiplying, never by adding the same amount', content: `SCALE BY MULTIPLYING, NEVER BY ADDING THE SAME AMOUNT — going from 2 to 6 means multiplying by 3, not adding 4. Adding the same amount to both numbers of a ratio feels like a natural way to keep going, but it breaks the mix every time.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'definition', title: 'ratio table', content: `a table that lists a ratio and its equivalent ratios side by side, with each column scaled from the first by a whole-number factor.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'definition', title: 'tape diagram', content: `a bar split into equal-size parts, with one count of parts for each quantity in a ratio.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'definition', title: 'double number line', content: `two number lines, one for each quantity in a ratio, lined up so that matching tick marks show an equivalent ratio.` },
    { loId: 'm6math.representing-ratios-with-tables-and-diagrams', kind: 'definition', title: 'scale factor', content: `the number both quantities in a ratio are multiplied by to produce an equivalent ratio.` },
  ],
  methods: [
    {
      title: 'Worked ratio table beads',
      steps: [
        `Set up a ratio table with red beads in the top row and blue beads in the bottom row. Write the first column straight from the pattern: 2 red, 3 blue.`,
        `Build more columns by multiplying both numbers in a column by the same scale factor. Times 2: 4 red, 6 blue. Times 3: 6 red, 9 blue. Times 4: 8 red, 12 blue. Times 5: 10 red, 15 blue.`,
        `10 red beads matches the column scaled by 5, since 2 × 5 = 10, and the same factor of 5 has to be used for the blue-bead row of that column.`,
        'Read the answer straight down that column: 15 blue beads.',
        `Check by dividing back down: 10 red beads / 5 = 2 red beads, and 15 blue beads / 5 = 3 blue beads. That returns the original pattern, 2:3, so the answer holds.`,
      ],
      example: { problem: `Ava is making friendship bracelets. Her pattern uses 2 red beads for every 3 blue beads. Complete a ratio table to find how many blue beads she needs if she uses 10 red beads.`, solution: '15 blue beads' },
      relatedLoIds: ['m6math.representing-ratios-with-tables-and-diagrams'],
    },
    {
      title: 'Worked double number line punch',
      steps: [
        `Draw two number lines, one on top counting cups of juice and one underneath counting cups of soda, with matching tick marks stacked directly above each other.`,
        `Mark the first known pair from the recipe: 2 cups of juice lines up with 5 cups of soda.`,
        `Find the scale factor that turns 2 cups of juice into 6 cups of juice: 6 / 2 = 3.`,
        `WRONG: noticing that 2 became 6 by adding 4, and adding that same 4 to the soda side to get 5 + 4 = 9 cups of soda. CORRECT: a ratio scales by multiplying both numbers by the same factor, never by adding the same amount to both. The scale factor here is 3, not an addition of 4.`,
        'Multiply the soda number by the same scale factor: 5 × 3 = 15 cups of soda.',
        `Mark the new tick on the double number line: 6 cups of juice lines up with 15 cups of soda.`,
        `Check by dividing back down: 6 / 3 = 2 cups of juice, and 15 / 3 = 5 cups of soda, which matches the original recipe exactly.`,
      ],
      example: { problem: `A fruit punch recipe uses 2 cups of juice for every 5 cups of soda. Use a double number line to find how much soda is needed for 6 cups of juice.`, solution: '15 cups of soda' },
      relatedLoIds: ['m6math.representing-ratios-with-tables-and-diagrams'],
    },
  ],
  pointers: [
    { content: `Students often say "6:8" — An equivalent ratio comes from multiplying, not from keeping a constant difference. Multiplying both 3 and 5 by 2 gives the true equivalent ratio, 6:10. Check the difference: dividing 6:8 back down by 2 gives 3:4, which is a different ratio from 3:5 entirely, so 6:8 does not match.`, kind: 'common-error' },
    { content: `Students often say "3:7" — An equivalent ratio has to scale BOTH numbers by the same factor. Starting from 3:5 and multiplying both numbers by 3 gives 9:15, which is equivalent. 3:7 changes only the second number and leaves the first alone, so it does not represent the same relationship as 3:5 at all.`, kind: 'common-error' },
    { content: `An equivalent ratio comes from multiplying both quantities by the same scale factor, never from adding the same amount to both.`, kind: 'tip' },
    { content: `A ratio table lines up a ratio and its equivalent ratios in columns, each column scaled from the first by its own factor.`, kind: 'tip' },
    { content: `A tape diagram splits a bar into equal-size parts, with one count of parts for each quantity in the ratio.`, kind: 'tip' },
    { content: `A double number line stacks two number lines with matching tick marks, so every vertical pair of ticks is an equivalent ratio.`, kind: 'tip' },
    { content: `A ratio table, a tape diagram, and a double number line for the same ratio all show the identical set of equivalent ratios — they are the same relationship in different pictures.`, kind: 'tip' },
    { content: `Check any equivalent ratio by dividing both numbers back down by the scale factor; the result must return the original ratio.`, kind: 'tip' },
  ],
};
