/**
 * Grade 8 Math — Unit 5 CED 5.1: Solutions of Systems as Intersection Points.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.solutions-of-systems-as-intersection-points.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U5_SOLUTIONS_OF_SYSTEMS_AS_INTERSECTION_POINTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.solutions-of-systems-as-intersection-points.v1',
  course: 'Grade 8 Math',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Solutions of Systems as Intersection Points',
  planId: 'evelyn.ms.m8math.solutions-of-systems-as-intersection-points.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.solutions-of-systems-as-intersection-points.v1' }],
  theory: [
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'One equation with two variables has endless solutions', content: `ONE EQUATION WITH TWO VARIABLES HAS ENDLESS SOLUTIONS — a solution of x + y = 10 is not a number, it is a PAIR. (1, 9), (4, 6), (10, 0) and (-3, 13) all make it true, and so do infinitely many more. Every one of those pairs is a point on the graph of x + y = 10. One equation with two letters in it cannot pin the pair down.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'A system is two equations about the same pair', content: `A SYSTEM IS TWO EQUATIONS ABOUT THE SAME PAIR — write x + y = 10 and y = x + 2 together and you have a system of two linear equations. The solution of the system is the one (x, y) pair that makes BOTH equations true at the same time. Not the first one, not either one: both. In the hook, that pair was (4, 6), because 4 + 6 = 10 and 4 + 2 = 6.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'Check a pair in both, one equation at a time', content: `CHECK A PAIR IN BOTH, ONE EQUATION AT A TIME — to test whether (3, 7) solves that system, substitute x = 3 and y = 7 into the first equation: 3 + 7 = 10, true. Then into the second: 3 + 2 = 5, and 5 is not 7, so false. One pass and one fail means (3, 7) is not a solution. A pair earns the word "solution" only when it passes both checks.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'A line is its solutions drawn as points', content: `A LINE IS ITS SOLUTIONS DRAWN AS POINTS — the graph of y = x + 2 is every pair that makes y = x + 2 true, plotted as a point. (0, 2), (4, 6) and (10, 12) sit on that line because each one passes the check, and (3, 7) is not on the line because it fails. So "the point is on the line" and "the pair makes the equation true" are the same sentence said two ways.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'The crossing point is the solution', content: `THE CROSSING POINT IS THE SOLUTION — draw both lines of a system on one grid. Every point on the first line passes the first equation, and every point on the second line passes the second equation. The one point sitting on both lines passes both, so the place where the two lines cross IS the solution of the system. Two different straight lines can cross in only one place, which is why a system of two crossing lines has exactly one solution, the same way two streets have one intersection.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'framework', title: 'Read it, then prove it', content: `READ IT, THEN PROVE IT — a crossing point read off a grid is a claim, and a grid can be misread by one square or with x and y swapped. Substitute the pair into both equations. If both come out true, the reading was right. If either one fails, go back to the grid, because the true crossing point always passes both.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'definition', title: 'system of linear equations', content: `two linear equations written together, both about the same pair of variables x and y.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'definition', title: 'solution of a system', content: `the ordered pair (x, y) that makes every equation in the system true at the same time.` },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'definition', title: 'point of intersection', content: 'the single point where two lines cross; it lies on both lines.' },
    { loId: 'm8math.solutions-of-systems-as-intersection-points', kind: 'definition', title: 'satisfy', content: `a pair satisfies an equation when substituting its x and y values makes the equation true.` },
  ],
  methods: [
    {
      title: 'Worked check three candidates',
      steps: [
        `Run the same test on every pair: substitute its x and y into the first equation and see whether it comes out true, then do the same with the second equation. A pair has to pass both.`,
        `Test (3, 5). First equation: 2(3) - 1 = 6 - 1 = 5, and the y-value is 5, so it passes. Second equation: 3 + 5 = 8, and the right side is 8, so it passes. Two passes, so (3, 5) is a solution of the system.`,
        `Test (4, 7). First equation: 2(4) - 1 = 8 - 1 = 7, and the y-value is 7, so it passes. Second equation: 4 + 7 = 11, and 11 is not 8, so it fails. One pass and one fail, so (4, 7) is not a solution of the system, even though it is a perfectly good solution of the first equation on its own.`,
        `Test (2, 6). First equation: 2(2) - 1 = 4 - 1 = 3, and the y-value is 6, so it fails. Second equation: 2 + 6 = 8, so it passes. Again one pass and one fail, so (2, 6) is not a solution of the system.`,
        `Picture it on a grid. (4, 7) is a point on the line for y = 2x - 1 but not on the line for x + y = 8; (2, 6) is on the second line but not the first. Only (3, 5) is on both lines, so (3, 5) is where the two lines cross.`,
        `Notice that each wrong pair failed a different equation. Passing one equation is easy, because every point on that line does it. The solution is the one pair that passes both.`,
      ],
      example: { problem: `A system has the two equations y = 2x - 1 and x + y = 8. Three students each claim to have the solution: (3, 5), (4, 7), and (2, 6). Check each pair in BOTH equations and decide which one, if any, is the solution of the system.`, solution: `(3, 5) is the solution; (4, 7) satisfies only the first equation and (2, 6) satisfies only the second` },
      relatedLoIds: ['m8math.solutions-of-systems-as-intersection-points'],
    },
    {
      title: 'Worked read the crossing',
      steps: [
        `Find the crossing on the grid. Line A climbs from (0, 1) up to the right, and Line B falls from (0, 10) down to the right, so they meet somewhere in between. The grid shows the crossing 3 squares to the right of the y-axis and 4 squares up, so the reading is (3, 4).`,
        `A reading is a claim, so prove it. Substitute x = 3 and y = 4 into Line A: 3 + 1 = 4, and the y-value is 4, so (3, 4) is on Line A.`,
        `Substitute into Line B: -2(3) + 10 = -6 + 10 = 4, and the y-value is 4, so (3, 4) is on Line B too.`,
        `Both checks pass, so (3, 4) is on both lines, which is exactly what it means to be the point where they cross. It is the solution of the system: x = 3 and y = 4, together, as one pair.`,
        `WRONG: reading the crossing as (4, 3), the same two numbers with x and y swapped. CORRECT: the check catches the swap immediately, because 4 + 1 = 5 and not 3, so (4, 3) is not even on Line A. On a grid the x-coordinate is the count to the right and the y-coordinate is the count up, and the order matters.`,
        `One more point to see the contrast: (5, 6) is on Line A, since 5 + 1 = 6, but -2(5) + 10 = 0, not 6, so it is not on Line B. Being on one line is common; being on both happens at exactly one point.`,
      ],
      example: { problem: `Two lines are drawn on a coordinate plane. Line A is the graph of y = x + 1 and passes through (0, 1) and (5, 6). Line B is the graph of y = -2x + 10 and passes through (0, 10) and (5, 0). The two lines cross at one grid point. Read that point and prove that it is the solution of the system.`, solution: 'The lines cross at (3, 4), and (3, 4) satisfies both y = x + 1 and y = -2x + 10' },
      relatedLoIds: ['m8math.solutions-of-systems-as-intersection-points'],
    },
  ],
  pointers: [
    { content: `Students often say "(1, 5) is the solution, because 1 + 4 = 5." — (1, 5) does pass the first equation, since 1 + 4 = 5. But the second equation gives 1 + 5 = 6, and 6 is not 10, so it fails. On the grid, (1, 5) is a point on the first line that is nowhere near the second line. The pair that passes both is (3, 7): 3 + 4 = 7 is true, and 3 + 7 = 10 is true. A solution of a system has two jobs, and (1, 5) only does one of them.`, kind: 'common-error' },
    { content: `Students often say "The solution is x = 3." — x = 3 is half of a location. On the grid, x = 3 names a whole vertical column of points, and only one of them is the crossing. The solution of a system is a PAIR: the crossing point is (3, 7), so the answer is x = 3 AND y = 7, together. Check the pair in both equations: 3 + 4 = 7 and 3 + 7 = 10, both true. Naming x alone is like texting "Main Street" without the cross street.`, kind: 'common-error' },
    { content: `An equation with two variables has endless solutions, and each solution is a PAIR (x, y), not a single number.`, kind: 'tip' },
    { content: `A system is two equations about the same pair. Its solution is the one pair that makes BOTH equations true at the same time.`, kind: 'tip' },
    { content: `To check a pair, substitute it into each equation separately. One pass and one fail means it is not a solution of the system.`, kind: 'tip' },
    { content: `The graph of an equation is all of its solutions drawn as points, so a point on the line and a pair that satisfies the equation are the same thing.`, kind: 'tip' },
    { content: `The point where the two lines cross is on both lines, so it satisfies both equations: the crossing point IS the solution of the system.`, kind: 'tip' },
    { content: `A crossing point read off a grid is a claim. Prove it by substituting into both equations before you call it the solution.`, kind: 'tip' },
    { content: `A solution of a system is always a PAIR (x, y), never a single number. "x = 3" alone is not the answer — you need both x AND y together, like (3, 7).`, kind: 'common-error' },
    { content: `To check if a pair solves a system, substitute into BOTH equations, one at a time. If it passes one and fails the other, it is NOT a solution — both must be true.`, kind: 'gotcha' },
    { content: `When you read a crossing point off a grid, you are making a claim. Always prove it by substituting the pair into both equations. A grid can lie by one square or with x and y swapped.`, kind: 'tip' },
    { content: `Don't confuse 'on the line' with 'the solution of the system.' A point can sit on one line without being the crossing. The solution is the ONE point on BOTH lines.`, kind: 'vocab-note' },
    { content: `The order in an ordered pair matters: (3, 4) is not the same as (4, 3). If you swap x and y by mistake, the substitution check will catch it — one or both equations will fail.`, kind: 'edge-case' },
    { content: `One equation with two variables has infinitely many solutions (a whole line of pairs). A SYSTEM of two equations has exactly one solution (the crossing point), not zero, not many.`, kind: 'vocab-note' },
    { content: `When you substitute a pair into an equation, do it carefully: replace x first, replace y second, follow order of operations, then compare left and right sides.`, kind: 'tip' },
  ],
};
