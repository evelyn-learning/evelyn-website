/**
 * Grade 6 Math — Unit 8 CED 8.4: Dependent & Independent Variables.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.dependent-and-independent-variables.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U8_DEPENDENT_AND_INDEPENDENT_VARIABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.dependent-and-independent-variables.v1',
  course: 'Grade 6 Math',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Dependent & Independent Variables',
  planId: 'evelyn.ms.m6math.dependent-and-independent-variables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.dependent-and-independent-variables.v1' }],
  theory: [
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'Two quantities that change together', content: `TWO QUANTITIES THAT CHANGE TOGETHER — a real-world relationship has two quantities that move together: one you choose or control, and one that responds to that choice. Mia chooses how many walks she does. The money she earns responds to that choice.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'Independent goes in, dependent comes out', content: `INDEPENDENT GOES IN, DEPENDENT COMES OUT — the quantity that gets chosen is the INDEPENDENT VARIABLE. The quantity that depends on it is the DEPENDENT VARIABLE. To tell them apart, ask "which one depends on the other?" Money earned depends on the number of walks, so money earned is dependent. The number of walks does not depend on the money, so it is independent.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'Write one equation for the situation', content: `WRITE ONE EQUATION FOR THE SITUATION — pick a letter for each quantity, then write a single equation that shows exactly how to compute the dependent variable once you know the independent one. Mia earns $6 per walk, so if w is the number of walks and m is the money earned, the equation is m = 6w. Plug in a value of w and the equation hands you m.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'A table lists input and output together', content: `A TABLE LISTS INPUT AND OUTPUT TOGETHER — a table of values puts the independent variable in one column and the matching dependent-variable value, computed from the equation, in the column beside it. Every row is one pair: an independent value and the dependent value it produces.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'On a graph, independent goes on the x-axis', content: `ON A GRAPH, INDEPENDENT GOES ON THE X-AXIS — plot each table row as a point, with the independent variable on the x-axis and the dependent variable on the y-axis. The point for "1 walk, $6 earned" is plotted at x = 1, y = 6.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'framework', title: 'Not every equation starts at zero', content: `NOT EVERY EQUATION STARTS AT ZERO — some situations already have a fixed amount in place before the independent variable contributes anything, and that fixed amount gets ADDED, never multiplied. Check any equation by asking what it gives when the independent variable is 0; that tells you whether the situation has a head start.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'definition', title: 'independent variable', content: `the quantity in a relationship that is chosen or controlled, and that the other quantity depends on.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'definition', title: 'dependent variable', content: `the quantity in a relationship whose value depends on the independent variable; it is the one the equation computes.` },
    { loId: 'm6math.dependent-and-independent-variables', kind: 'definition', title: 'table of values', content: `a list of independent-variable values next to the dependent-variable value the equation produces for each one.` },
  ],
  methods: [
    {
      title: 'Worked dog walking',
      steps: [
        `Decide which variable is independent and which is dependent. Mia chooses how many walks to do, so w is independent. The money she earns follows from that choice, so m is dependent, and the equation is written for m.`,
        `Each walk earns $6, so multiply the number of walks by 6 to get the money earned: m = 6w.`,
        `Check the equation with a value you already know: one walk should earn $6. m = 6 × 1 = 6. That matches.`,
        `Build the table. Put w in the left column and the matching m, computed from the equation, in the right column: w = 0 gives m = 6 × 0 = 0; w = 1 gives m = 6; w = 2 gives m = 12; w = 3 gives m = 18.`,
        `WRONG: plotting money earned (m) on the x-axis and number of walks (w) on the y-axis. CORRECT: the independent variable w goes on the x-axis and the dependent variable m goes on the y-axis, because w is what gets chosen and m is what responds to it.`,
        `Plot the points (0, 0), (1, 6), (2, 12), (3, 18). Each point sits $6 higher than the one before it, matching the $6-per-walk rate in the equation.`,
      ],
      example: { problem: `Mia earns $6 every time she walks the neighbor's dog. Let w stand for the number of walks she does in a week, and let m stand for the money she earns that week. Write an equation for m in terms of w, make a table for w = 0, 1, 2, 3, and describe how to plot the points.`, solution: 'm = 6w; table: (0, 0), (1, 6), (2, 12), (3, 18)' },
      relatedLoIds: ['m6math.dependent-and-independent-variables'],
    },
    {
      title: 'Worked book fair',
      steps: [
        `Decide which variable is independent and which is dependent. The number of books sold, b, is what changes as the fair goes on, so it is independent. The total donations, d, depend on how many books have sold so far, so it is dependent.`,
        `There is already $40 before any books sell, and every book sold adds $4 more. The $40 is a fixed amount that gets added once, not multiplied by b, so the equation is d = 40 + 4b.`,
        `Check with a value you already know: before any books sell, b = 0, and d should be exactly the starting $40. d = 40 + 4 × 0 = 40. That matches.`,
        'Find d when b = 5: d = 40 + 4 × 5 = 40 + 20 = 60.',
        `WRONG: leaving out the starting amount and writing d = 4b, which gives d = 20 when b = 5. CORRECT: the $40 head start is already there no matter how many books sell, so it stays in the equation: d = 40 + 4b, which gives d = 60 when b = 5.`,
        `Notice the difference from Mia's equation: a table for this situation would start at (0, 40), not (0, 0), because this relationship has a fixed amount before the independent variable adds anything. Not every relationship starts at zero.`,
      ],
      example: { problem: `The school book fair already had $40 donated before it opened. Each book sold adds $4 more. Let b stand for the number of books sold, and let d stand for the total donations in dollars. Write an equation for d in terms of b, then find d when b = 5.`, solution: 'd = 40 + 4b; d = 60 when b = 5' },
      relatedLoIds: ['m6math.dependent-and-independent-variables'],
    },
  ],
  pointers: [
    { content: `Students often say "c = 8h + 2" — The $8 flat fee is charged once, no matter how many hours the bike is rented, so it never multiplies by h; it is simply added. The $2 per hour is the part that grows with h, so that is the part that multiplies. The correct equation is c = 8 + 2h. Check it: at h = 0 hours, c = 8 + 2 × 0 = 8, exactly the flat fee, before any hours have passed.`, kind: 'common-error' },
    { content: `Students often say "c = 2h" — The flat fee is not optional. It is charged the moment the bike leaves the rack, before a single hour has passed. Every part of the situation belongs in the equation, so the flat fee has to be added: c = 8 + 2h. Check it: at h = 0, this equation gives c = 8, matching the flat fee, while c = 2h would wrongly say the bike costs nothing until an hour goes by.`, kind: 'common-error' },
    { content: `A real-world relationship has an independent variable, which is chosen, and a dependent variable, which responds to that choice.`, kind: 'tip' },
    { content: `Write one equation that computes the dependent variable from the independent variable, using letters tied to the specific situation.`, kind: 'tip' },
    { content: `A table lists each independent-variable value next to the dependent-variable value the equation produces for it.`, kind: 'tip' },
    { content: `On a graph, the independent variable goes on the x-axis and the dependent variable goes on the y-axis.`, kind: 'tip' },
    { content: `Some equations start with a fixed amount that is added once, not multiplied by the independent variable — check this by finding what the equation gives when the independent variable is 0.`, kind: 'tip' },
    { content: `Check every equation against a value you already know before trusting it for a value you do not.`, kind: 'tip' },
    { content: `Ask "which one depends on the other?" to find independent vs. dependent. The one that depends is dependent; the one chosen or controlled is independent.`, kind: 'tip' },
    { content: `A fixed amount (head start, flat fee, initial balance) gets ADDED once, never multiplied by the independent variable. Check by plugging in 0: you should get exactly that fixed amount.`, kind: 'common-error' },
    { content: `Independent variable ALWAYS goes on the x-axis, dependent on the y-axis—no exceptions. Plot (independent, dependent) as (x, y).`, kind: 'gotcha' },
    { content: `Every row in a table is one pair: pick a value for the independent variable, plug it into the equation, write down what you get for the dependent variable.`, kind: 'vocab-note' },
    { content: `Don't leave parts of the situation out of your equation. If the problem mentions a head start, flat fee, or starting amount, it must appear in the equation.`, kind: 'common-error' },
    { content: `Write the equation for the dependent variable, not the independent one. The equation should compute m from w, not w from m.`, kind: 'vocab-note' },
    { content: `Check your equation with a value you already know (like the head start when the independent variable is 0) before using it to find unknown values.`, kind: 'tip' },
  ],
};
