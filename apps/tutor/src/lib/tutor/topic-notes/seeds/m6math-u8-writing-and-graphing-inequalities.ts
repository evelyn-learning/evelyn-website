/**
 * Grade 6 Math — Unit 8 CED 8.3: Writing & Graphing Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.writing-and-graphing-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U8_WRITING_AND_GRAPHING_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.writing-and-graphing-inequalities.v1',
  course: 'Grade 6 Math',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Writing & Graphing Inequalities',
  planId: 'evelyn.ms.m6math.writing-and-graphing-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.writing-and-graphing-inequalities.v1' }],
  theory: [
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'framework', title: 'A constraint describes a boundary, not one number', content: `A CONSTRAINT DESCRIBES A BOUNDARY, NOT ONE NUMBER — many real-world rules do not name a single value. A roller coaster does not require riders to be exactly one height; it requires them to be taller than some minimum height. Words like "more than," "greater than," "over," "fewer than," "less than," and "under" all describe a boundary a quantity must sit on one side of.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'framework', title: 'Let a variable stand for the unknown quantity', content: `LET A VARIABLE STAND FOR THE UNKNOWN QUANTITY — before writing any symbol, name what the letter represents and its units, such as h for a rider's height in inches or n for the number of books checked out. Every inequality in this lesson starts by naming its variable.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'framework', title: 'Translate the phrase into a symbol', content: `TRANSLATE THE PHRASE INTO A SYMBOL — "more than," "greater than," and "over" all become the symbol >. "Fewer than," "less than," and "under" all become the symbol <. The boundary number itself is never included, because none of these phrases mean "or equal to."` },
    { loId: 'm6math.writing-and-graphing-inequalities', content: `AN INEQUALITY LIKE x > c HAS INFINITELY MANY SOLUTIONS — an equation such as x = 7 has exactly one number that makes it true. An inequality such as h > 48 is true for 48.5, 49, 60, 1000, and every other number bigger than 48, with no biggest one and no way to list them all. That is what "infinitely many solutions" means.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'framework', title: 'The number line shows every solution at once', content: `THE NUMBER LINE SHOWS EVERY SOLUTION AT ONCE — since the solutions cannot be listed, a number line pictures them all in one drawing: mark the boundary number, then shade every point in the direction the solutions extend, with an arrow to show the shading keeps going forever.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'framework', title: 'The circle at the boundary stays open', content: `THE CIRCLE AT THE BOUNDARY STAYS OPEN — draw an open, unfilled circle at the boundary number, because that number itself does NOT make a strict inequality true. A rider exactly 48 inches tall is not taller than 48 inches, so 48 is marked but not included. Shade right for > and shade left for <.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'definition', title: 'inequality', content: `a mathematical statement built with the symbol > or < that describes every number on one side of a boundary, rather than naming a single number.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'definition', title: 'solution of an inequality', content: `any number that makes the inequality a true statement when it replaces the variable.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'definition', title: 'boundary number', content: `the number that separates the solutions of an inequality from the numbers that are not solutions; written as c in x > c or x < c.` },
    { loId: 'm6math.writing-and-graphing-inequalities', kind: 'definition', title: 'open circle', content: `an unfilled circle drawn at the boundary number on a number-line graph, showing that the boundary number itself is not a solution.` },
  ],
  methods: [
    {
      title: 'Worked roller coaster height',
      steps: [
        `Name the variable first: h stands for a rider's height, in inches.`,
        'Find the boundary number in the rule: 48 inches.',
        `The phrase "taller than" means strictly more than, so it translates to the symbol >, not the symbol for "or equal to." Being exactly 48 inches tall is not taller than 48 inches.`,
        'Write the inequality: h > 48.',
        `This inequality has infinitely many solutions: 48.5, 49, 60, and 1000 are all solutions, and there is no biggest height a solution could be, so the full list can never be written out.`,
        `Graph the solutions: draw a number line, mark 48 with an OPEN circle because 48 itself is not a solution, then shade every point to the RIGHT of 48 and draw an arrow to show the shading continues without end.`,
        `Check by testing a number in the shaded region and the boundary number itself: 50 > 48 is true, so 50 belongs in the shaded region. 48 > 48 is false, so 48 correctly stays outside the shading, marked with the open circle.`,
      ],
      example: { problem: `The Thunder Loop roller coaster has a sign: "Riders must be taller than 48 inches." Let h stand for a rider's height, in inches. Write an inequality for the height rule, then describe how to graph its solutions on a number line.`, solution: 'h > 48; open circle at 48, shaded to the right with an arrow.' },
      relatedLoIds: ['m6math.writing-and-graphing-inequalities'],
    },
    {
      title: 'Worked library book limit',
      steps: [
        'Name the variable: n stands for the number of books a student checks out.',
        'Find the boundary number: 5 books.',
        `The phrase "fewer than" means strictly less than, so it translates to the symbol <, not the symbol for "or equal to." Checking out exactly 5 books is not fewer than 5 books.`,
        'Write the inequality: n < 5.',
        `WRONG: drawing an open circle at 5 and shading to the RIGHT, toward 6, 7, and 8. CORRECT: since the symbol is <, the solutions are the numbers SMALLER than 5, so the shading goes to the LEFT of the open circle at 5, toward 4, 3, 2, and beyond.`,
        `Check by testing a number in each direction: 3 < 5 is true, so 3 belongs in the shaded region to the left. 7 < 5 is false, so 7 correctly stays out of the shading.`,
        `This inequality also has infinitely many solutions: every number less than 5 works, and the shading keeps going without a smallest number ever marked.`,
      ],
      example: { problem: `A school library rule says a student may check out fewer than 5 books at one time. Let n stand for the number of books a student checks out. Write an inequality for the rule, then graph its solutions on a number line.`, solution: 'n < 5; open circle at 5, shaded to the left with an arrow.' },
      relatedLoIds: ['m6math.writing-and-graphing-inequalities'],
    },
  ],
  pointers: [
    { content: `Students often say "a > 15 graphed with a closed, filled circle at 15" — The rule says "older than 15," which is a strict inequality, so 15 itself is not a solution: a lifeguard who is exactly 15 is not older than 15. The circle at 15 must stay OPEN and unfilled. Only the shaded ray to the right, every age greater than 15, is part of the solution.`, kind: 'common-error' },
    { content: `Students often say "p < 20 graphed with shading to the right of 20" — The rule p < 20 means the weight must be LESS than 20 pounds, so the solutions are the smaller numbers, to the LEFT of 20. Shading to the right would show weights greater than 20, which is the opposite of what the rule requires. The open circle at 20 is correct in this graph; only the direction of the shading needs to move to the left.`, kind: 'common-error' },
    { content: `Words like "more than," "greater than," and "over" translate to the symbol >. Words like "fewer than," "less than," and "under" translate to the symbol <.`, kind: 'tip' },
    { content: `An inequality such as x > c or x < c has infinitely many solutions; there is no way to list every one, which is why a number-line graph is used instead.`, kind: 'tip' },
    { content: `On the graph, the boundary number gets an OPEN, unfilled circle, because a strict inequality never includes its own boundary number.`, kind: 'tip' },
    { content: `Shade to the RIGHT of the open circle for > and to the LEFT of the open circle for <, with an arrow showing the shading continues forever.`, kind: 'tip' },
    { content: `Always name the variable and its units before writing the inequality, so the symbol and the story stay connected.`, kind: 'tip' },
    { content: `Check an inequality by testing one number inside the shaded region and the boundary number itself; the shaded number should make the inequality true and the boundary number should make it false.`, kind: 'tip' },
  ],
};
