/**
 * Grade 8 Math — Unit 5 CED 5.3: Solving Simple Systems by Substitution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.solving-systems-by-substitution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U5_SOLVING_SYSTEMS_BY_SUBSTITUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.solving-systems-by-substitution.v1',
  course: 'Grade 8 Math',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Solving Simple Systems by Substitution',
  planId: 'evelyn.ms.m8math.solving-systems-by-substitution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.solving-systems-by-substitution.v1' }],
  theory: [
    { loId: 'm8math.solving-systems-by-substitution', kind: 'framework', title: 'A solution is the pair that works in both equations', content: `A SOLUTION IS THE PAIR THAT WORKS IN BOTH EQUATIONS — the solution of a system is the (x, y) pair that makes both equations true at once, the crossing point of the two lines. Graphing found it by looking, and if the crossing sits between grid lines, looking only gives a guess. Substitution finds the same pair with algebra, so the answer comes out exact.` },
    { loId: 'm8math.solving-systems-by-substitution', content: `BOTH SOLVED FOR y: SET THE RIGHT SIDES EQUAL — at the crossing, y = 2x + 1 and y = -x + 7 are talking about the same y, so the two expressions must be equal: 2x + 1 = -x + 7. That is one equation with one variable, with the variable on both sides, and you already own that solve: add x to both sides, 3x + 1 = 7, subtract 1, 3x = 6, divide by 3, x = 2.` },
    { loId: 'm8math.solving-systems-by-substitution', content: `ONE SOLVED FOR y: SUBSTITUTE THE WHOLE EXPRESSION — if the system is y = 3x and 2x + y = 10, the first equation says y is 3x, so wherever the second equation has y, write 3x instead: 2x + 3x = 10, so 5x = 10 and x = 2. When the expression has two terms, wrap it in parentheses so the coefficient multiplies all of it: y = 2x - 1 dropped into 4x + 3y = 27 becomes 4x + 3(2x - 1) = 27, and the 3 distributes to both the 2x and the -1.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'framework', title: 'Back-substitute for the second coordinate', content: `BACK-SUBSTITUTE FOR THE SECOND COORDINATE — x by itself is half an answer. Put the x-value into the equation that is already solved for y, because that is the shortest route: from y = 3x with x = 2, y = 3(2) = 6. The solution is the pair (2, 6), written with x first.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'framework', title: 'Check the pair in both equations', content: `CHECK THE PAIR IN BOTH EQUATIONS — a point on one line is not the crossing. For (2, 6): the first equation gives 6 = 3(2) = 6, and the second gives 2(2) + 6 = 4 + 6 = 10. Both true, so (2, 6) is the solution. If the pair fails either equation, the slip is usually a dropped parenthesis or a sign that did not change when a term crossed the equals sign.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'framework', title: 'Exact beats estimated', content: `EXACT BEATS ESTIMATED — the system y = 4x + 1 and y = 2x + 6 gives 4x + 1 = 2x + 6, so 2x = 5 and x = 2.5, and then y = 4(2.5) + 1 = 11. On a grid that crossing sits halfway between two vertical lines, and the best a graph can offer is "about 2 and a half". Substitution says exactly 2.5, and the check agrees: 2(2.5) + 6 = 11 as well.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'definition', title: 'substitution', content: `replacing a variable with an expression that equals it, so the equation has only one variable left.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'definition', title: 'back-substitution', content: `putting the value found for one variable into an equation to find the other variable.` },
    { loId: 'm8math.solving-systems-by-substitution', kind: 'definition', title: 'solution of a system', content: `the (x, y) pair that makes both equations of the system true; the point where the two lines cross.` },
  ],
  methods: [
    {
      title: 'Worked two drones',
      steps: [
        `Both equations are already solved for y, and at the meeting point both y-values are the same number. So the two expressions for y are equal: 2x + 1 = -x + 7.`,
        `That is a one-variable equation with x on both sides. Add x to both sides: 2x + x + 1 = -x + x + 7, which leaves 3x + 1 = 7.`,
        `Finish the two-step equation: subtract 1 from both sides, 3x = 6, then divide both sides by 3, x = 2.`,
        `Back-substitute x = 2 into either equation to get y. Using the first: y = 2(2) + 1 = 4 + 1 = 5. The solution is the pair (2, 5).`,
        `Check in BOTH equations. First: 2(2) + 1 = 5, and y is 5, true. Second: -2 + 7 = 5, and y is 5, true. Both hold, so (2, 5) is the crossing point.`,
        `Read it back: 2 seconds after liftoff both drones are exactly 5 meters up. A graph would show this crossing at a grid point, but substitution would have given the same exact pair even if the crossing sat between the grid lines.`,
      ],
      example: { problem: `Drone A is at height y = 2x + 1 meters after x seconds, and Drone B is at height y = -x + 7. Solve the system to find the exact second and height at which the two drones meet.`, solution: '(2, 5): the drones meet after 2 seconds at a height of 5 meters' },
      relatedLoIds: ['m8math.solving-systems-by-substitution'],
    },
    {
      title: 'Worked parentheses substitution',
      steps: [
        `Only the first equation is solved for y, so substitution goes one way: the first equation says y equals 2x - 1, and that whole expression goes where y sits in the second equation.`,
        `Substitute with parentheses: 4x + 3(2x - 1) = 27. The 3 was multiplying y, so it must multiply all of what y equals.`,
        `WRONG: writing 4x + 3 × 2x - 1 = 27, so 10x - 1 = 27, 10x = 28, and x = 2.8. CORRECT: the parentheses keep the -1 inside the multiplication. Distribute the 3 to both terms: 4x + 6x - 3 = 27. The check exposes the wrong road: x = 2.8 gives y = 2(2.8) - 1 = 4.6, and then 4(2.8) + 3(4.6) = 11.2 + 13.8 = 25, not 27.`,
        `Combine like terms: 10x - 3 = 27. Add 3 to both sides, 10x = 30, then divide both sides by 10, x = 3.`,
        `Back-substitute x = 3 into the equation solved for y: y = 2(3) - 1 = 6 - 1 = 5. The solution is (3, 5).`,
        `Check in BOTH equations. First: 2(3) - 1 = 5, and y is 5, true. Second: 4(3) + 3(5) = 12 + 15 = 27, true. The pair works in both, so it is the crossing point of the two lines, found exactly and without a graph.`,
      ],
      example: { problem: 'Solve the system: y = 2x - 1 and 4x + 3y = 27', solution: 'x = 3, y = 5; the solution is (3, 5)' },
      relatedLoIds: ['m8math.solving-systems-by-substitution'],
    },
  ],
  pointers: [
    { content: `Students often say "The solution is 5" — x = 5 is correct, but it is half an answer. Back-substitute into the equation solved for y: y = 2(5) = 10, so the solution is the pair (5, 10). Check it in both equations: 2(5) = 10 matches y = 10, and 3(5) + 10 = 15 + 10 = 25 is true. A single number cannot be the crossing point of two lines; a point needs both coordinates.`, kind: 'common-error' },
    { content: `Students often say "3(2x) + y = 25" — The first equation is y = 2x, which says what y equals, not what x equals. So 2x replaces the y in the second equation and the x stays: 3x + 2x = 25, so 5x = 25 and x = 5. Then y = 2(5) = 10, and the pair (5, 10) checks in both equations. If a line of work still has both x and y in it after substituting, the substitution went into the wrong variable.`, kind: 'common-error' },
    { content: `The solution of a system is the (x, y) pair that makes both equations true. Substitution finds it exactly, where graphing only reads it off a grid.`, kind: 'tip' },
    { content: `If both equations are solved for y, set the two expressions equal to each other and solve the one-variable equation that results.`, kind: 'tip' },
    { content: `If one equation is solved for y, put that whole expression where y sits in the other equation, in parentheses if it has more than one term, then distribute.`, kind: 'tip' },
    { content: `After finding x, back-substitute into the equation solved for y to get the second coordinate. A single number is only half the answer.`, kind: 'tip' },
    { content: `Check the pair in BOTH equations. If it fails either one, look for a dropped parenthesis or a sign that did not change.`, kind: 'tip' },
    { content: `The solution is a **pair** (x, y), not a single number. If you find x = 5 and stop, you've only found half the answer. Always back-substitute to get y, then write both coordinates.`, kind: 'common-error' },
    { content: `When you substitute an expression with two terms (like y = 2x − 1), wrap it in **parentheses** before it meets a coefficient. Write 3(2x − 1), not 3 × 2x − 1. Then distribute to every term inside.`, kind: 'common-error' },
    { content: `Substitute the **expression** (the right side of the solved equation) into the other equation, not into the variable name. If y = 3x, replace y with 3x, not x with 3x.`, kind: 'gotcha' },
    { content: `After finding one coordinate, always **check the pair in both original equations**. A point on one line is not the crossing. If it fails either equation, the slip is usually a dropped parenthesis or a sign error.`, kind: 'tip' },
    { content: `When both equations are solved for y, you **set the right sides equal** to each other, not the left sides. You're saying y = y, so the expressions on the right must be equal.`, kind: 'vocab-note' },
    { content: `Back-substitute into the equation that is **already solved for y** — it's the shortest path. If both equations are solved for y, either works; if only one is, use that one.`, kind: 'tip' },
    { content: `If your substitution results in an equation that still has **both x and y** after you plug in, you substituted into the wrong variable. Stop and check which variable the solved equation is for.`, kind: 'edge-case' },
  ],
};
