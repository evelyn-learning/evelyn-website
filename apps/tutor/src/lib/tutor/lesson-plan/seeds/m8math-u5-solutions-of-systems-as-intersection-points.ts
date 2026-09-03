/**
 * Grade 8 Math — Systems of Linear Equations: Solutions of Systems as
 * Intersection Points.
 *
 * CONCEPT-LED (row 5.1). The student arrives from Unit 4 owning one-variable
 * equations whose solution is a single number, and this lesson replaces that
 * picture with a new one: an equation with TWO variables has endless
 * solutions, each one a pair, and a system of two such equations is a pair of
 * clues that pin down the one (x, y) pair that makes BOTH true at once
 * (CCSS 8.EE.C.8a). The three moves the lesson installs are (1) a solution of
 * a system is a PAIR, never a lone number; (2) a candidate pair is checked by
 * substituting it into each equation separately and demanding that both come
 * out true; and (3) because the graph of an equation is exactly its solutions
 * drawn as points, the one point sitting on both lines is the one pair that
 * passes both checks — so the crossing point IS the solution. Every graph in
 * this plan arrives already drawn; the student reads the crossing and then
 * proves the reading by substitution.
 *
 * SCOPE GUARD: Grade 8 row 5.1 understands a solution of a system of two
 * linear equations as the (x, y) pair that satisfies BOTH equations, checks a
 * candidate pair in both, and sees the solution as the point where the two
 * graphs cross. Withholds: solving methods (rows 5.2–5.3). Concretely: no
 * line in this plan is ever constructed by the student. Where a crossing must
 * be READ off a graph (the second worked example and the numeric item), the
 * lines arrive already drawn, each described by its equation and two labeled
 * lattice points, and the student's only graph action is to read the crossing
 * point and verify it by substitution; where an item names lines only by
 * their equations (the first worked example, the second MCQ, the
 * misconception check), the student's task is to check a GIVEN pair in both
 * equations, never to draw or solve. The plan never teaches drawing a line
 * from y = mx + b, never estimates a non-lattice
 * crossing, and never discusses parallel or coincident lines or a system with
 * no solution or infinitely many (all row 5.2); it never sets two expressions
 * for y equal to each other or substitutes one equation into another (row
 * 5.3), and never translates a story into a system (row 5.4 — the hook's
 * street-crossing picture is an analogy, and its two equations are handed to
 * the student as clues, not derived from a situation). Every system in this
 * plan has exactly one solution and its two lines cross at a lattice point.
 * Above, withheld: no elimination (`alg1-u5-systems-elimination.ts`), no
 * general substitution (`alg1-u5-systems-substitution.ts`), no
 * consistent/inconsistent/dependent vocabulary and no graphing from standard
 * form via intercepts (`alg1-u5-systems-by-graphing.ts`). Below: nothing (no
 * G7 antecedent for systems); what IS assumed and used without re-teaching is
 * substituting numbers for variables and computing both sides
 * (`m7math-u6-*`), plotting and reading lattice points (`m6math` row 6.1),
 * reading a line's climb per unit step off a drawn grid (row 3.3), and the
 * fact that the graph of a two-variable linear equation is a straight line
 * whose points are its solutions (row 3.4). Negative coordinates DO appear
 * (a line through (0, -3); the pair (-3, 13)); nothing about the plan is
 * confined to the first quadrant. Row 4.4 (one, none, or infinitely many
 * solutions of a one-variable equation) is the prerequisite but is not
 * revisited here; this plan says only that two different straight lines can
 * cross in only one place and that every system shown crosses exactly once.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U5_SOLUTIONS_OF_SYSTEMS_AS_INTERSECTION_POINTS: LessonPlan = {
  id: 'evelyn.ms.m8math.solutions-of-systems-as-intersection-points.v1',
  title: 'Solutions of Systems as Intersection Points',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.solutions-of-systems-as-intersection-points',
      standard: 'M8MATH-5.1',
      description:
        'Understand a solution of a system of two linear equations as the (x, y) pair that satisfies BOTH equations, check a candidate pair in both, and see the solution as the point where the two graphs cross (CCSS 8.EE.C.8a).',
    },
  ],
  prerequisites: ['m8math.one-none-or-infinitely-many-solutions'],
  followUps: ['m8math.solving-systems-by-graphing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that one two-variable equation cannot pin down a pair and that a second equation can, before the word system is defined.',
      script:
        'Your friend texts, "meet me on Main Street." That is not enough. Main Street is a mile long, and you could be standing at any of a thousand spots along it. So the next text says, "where it crosses Oak Avenue." Now there is exactly one spot, because two streets cross in one place. Equations with two variables work the same way. Try this one: x + y = 10. What are x and y? You cannot say. The pair (1, 9) works, (4, 6) works, (7, 3) works, and so do endless other pairs. Now add a second clue: y = x + 2. Check (4, 6) against it: 4 + 2 = 6, yes. Check (7, 3): 7 + 2 = 9, and 9 is not 3, so no. Check (1, 9): 1 + 2 = 3, not 9, so no again. Only (4, 6) passes both clues. Two equations about the same pair are called a system, and today you learn what it means for a pair to solve one, how to check a pair, and why the answer is the exact spot where two lines cross.',
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-solution-is-the-crossing',
      kind: 'concept',
      goal: 'Define the solution of a system as the pair that satisfies both equations, install the check-in-both habit, and show why that pair is exactly the point where the two lines cross.',
      keyIdeas: [
        'ONE EQUATION WITH TWO VARIABLES HAS ENDLESS SOLUTIONS — a solution of x + y = 10 is not a number, it is a PAIR. (1, 9), (4, 6), (10, 0) and (-3, 13) all make it true, and so do infinitely many more. Every one of those pairs is a point on the graph of x + y = 10. One equation with two letters in it cannot pin the pair down.',
        'A SYSTEM IS TWO EQUATIONS ABOUT THE SAME PAIR — write x + y = 10 and y = x + 2 together and you have a system of two linear equations. The solution of the system is the one (x, y) pair that makes BOTH equations true at the same time. Not the first one, not either one: both. In the hook, that pair was (4, 6), because 4 + 6 = 10 and 4 + 2 = 6.',
        'CHECK A PAIR IN BOTH, ONE EQUATION AT A TIME — to test whether (3, 7) solves that system, substitute x = 3 and y = 7 into the first equation: 3 + 7 = 10, true. Then into the second: 3 + 2 = 5, and 5 is not 7, so false. One pass and one fail means (3, 7) is not a solution. A pair earns the word "solution" only when it passes both checks.',
        'A LINE IS ITS SOLUTIONS DRAWN AS POINTS — the graph of y = x + 2 is every pair that makes y = x + 2 true, plotted as a point. (0, 2), (4, 6) and (10, 12) sit on that line because each one passes the check, and (3, 7) is not on the line because it fails. So "the point is on the line" and "the pair makes the equation true" are the same sentence said two ways.',
        'THE CROSSING POINT IS THE SOLUTION — draw both lines of a system on one grid. Every point on the first line passes the first equation, and every point on the second line passes the second equation. The one point sitting on both lines passes both, so the place where the two lines cross IS the solution of the system. Two different straight lines can cross in only one place, which is why a system of two crossing lines has exactly one solution, the same way two streets have one intersection.',
        'READ IT, THEN PROVE IT — a crossing point read off a grid is a claim, and a grid can be misread by one square or with x and y swapped. Substitute the pair into both equations. If both come out true, the reading was right. If either one fails, go back to the grid, because the true crossing point always passes both.',
      ],
      vocabulary: [
        { term: 'system of linear equations', definition: 'two linear equations written together, both about the same pair of variables x and y.' },
        { term: 'solution of a system', definition: 'the ordered pair (x, y) that makes every equation in the system true at the same time.' },
        { term: 'point of intersection', definition: 'the single point where two lines cross; it lies on both lines.' },
        { term: 'satisfy', definition: 'a pair satisfies an equation when substituting its x and y values makes the equation true.' },
      ],
      suggestedTools: ['show_equation', 'show_coordinate_plane', 'show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-check-three-candidates',
      kind: 'worked_example',
      problem:
        'A system has the two equations y = 2x - 1 and x + y = 8. Three students each claim to have the solution: (3, 5), (4, 7), and (2, 6). Check each pair in BOTH equations and decide which one, if any, is the solution of the system.',
      steps: [
        'Run the same test on every pair: substitute its x and y into the first equation and see whether it comes out true, then do the same with the second equation. A pair has to pass both.',
        'Test (3, 5). First equation: 2(3) - 1 = 6 - 1 = 5, and the y-value is 5, so it passes. Second equation: 3 + 5 = 8, and the right side is 8, so it passes. Two passes, so (3, 5) is a solution of the system.',
        'Test (4, 7). First equation: 2(4) - 1 = 8 - 1 = 7, and the y-value is 7, so it passes. Second equation: 4 + 7 = 11, and 11 is not 8, so it fails. One pass and one fail, so (4, 7) is not a solution of the system, even though it is a perfectly good solution of the first equation on its own.',
        'Test (2, 6). First equation: 2(2) - 1 = 4 - 1 = 3, and the y-value is 6, so it fails. Second equation: 2 + 6 = 8, so it passes. Again one pass and one fail, so (2, 6) is not a solution of the system.',
        'Picture it on a grid. (4, 7) is a point on the line for y = 2x - 1 but not on the line for x + y = 8; (2, 6) is on the second line but not the first. Only (3, 5) is on both lines, so (3, 5) is where the two lines cross.',
        'Notice that each wrong pair failed a different equation. Passing one equation is easy, because every point on that line does it. The solution is the one pair that passes both.',
      ],
      answer: '(3, 5) is the solution; (4, 7) satisfies only the first equation and (2, 6) satisfies only the second',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-the-crossing',
      kind: 'worked_example',
      problem:
        'Two lines are drawn on a coordinate plane. Line A is the graph of y = x + 1 and passes through (0, 1) and (5, 6). Line B is the graph of y = -2x + 10 and passes through (0, 10) and (5, 0). The two lines cross at one grid point. Read that point and prove that it is the solution of the system.',
      steps: [
        'Find the crossing on the grid. Line A climbs from (0, 1) up to the right, and Line B falls from (0, 10) down to the right, so they meet somewhere in between. The grid shows the crossing 3 squares to the right of the y-axis and 4 squares up, so the reading is (3, 4).',
        'A reading is a claim, so prove it. Substitute x = 3 and y = 4 into Line A: 3 + 1 = 4, and the y-value is 4, so (3, 4) is on Line A.',
        'Substitute into Line B: -2(3) + 10 = -6 + 10 = 4, and the y-value is 4, so (3, 4) is on Line B too.',
        'Both checks pass, so (3, 4) is on both lines, which is exactly what it means to be the point where they cross. It is the solution of the system: x = 3 and y = 4, together, as one pair.',
        'WRONG: reading the crossing as (4, 3), the same two numbers with x and y swapped. CORRECT: the check catches the swap immediately, because 4 + 1 = 5 and not 3, so (4, 3) is not even on Line A. On a grid the x-coordinate is the count to the right and the y-coordinate is the count up, and the order matters.',
        'One more point to see the contrast: (5, 6) is on Line A, since 5 + 1 = 6, but -2(5) + 10 = 0, not 6, so it is not on Line B. Being on one line is common; being on both happens at exactly one point.',
      ],
      answer: 'The lines cross at (3, 4), and (3, 4) satisfies both y = x + 1 and y = -2x + 10',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-pair-solves',
      kind: 'try_yourself',
      problem: 'Which ordered pair is a solution of the system y = 3x - 2 and x + y = 6?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(3, 7)' },
        { id: 'b', text: '(1, 5)' },
        { id: 'c', text: '(2, 4)', correct: true },
        { id: 'd', text: '(4, 2)' },
      ],
      expectedAnswer: '(2, 4)',
      hints: [
        'Substitute each pair into the first equation and then into the second. The solution has to make BOTH equations true, not just one.',
        'Three of the pairs pass exactly one equation. For (3, 7), the first equation gives 3(3) - 2 = 7 but the second gives 3 + 7 = 10, not 6. Keep testing until you find the pair that passes both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-is-this-the-crossing',
      kind: 'try_yourself',
      problem:
        'Two lines are drawn on a coordinate plane: the graph of y = x + 3 and the graph of y = -x + 9. A student reads the point where they cross as (4, 7). Is the student right?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, because (4, 7) is on the first line, since 4 + 3 = 7, but not on the second, since -4 + 9 = 5 and not 7', correct: true },
        { id: 'b', text: 'Yes, because 4 + 3 = 7 makes the first equation true, and one equation is enough to check' },
        { id: 'c', text: 'No, because the crossing point is (7, 4), the same two numbers in the other order' },
        { id: 'd', text: 'No, because the point where two lines cross always has x = 0, like the point where a line crosses the y-axis' },
      ],
      expectedAnswer: 'No, because (4, 7) is on the first line, since 4 + 3 = 7, but not on the second, since -4 + 9 = 5 and not 7',
      hints: [
        'Being the crossing point means being on BOTH lines. Test (4, 7) in each equation separately, and do not stop after the first one.',
        'First equation: 4 + 3 = 7, so it passes. Second equation: -4 + 9 = 5, and the pair says y is 7. A point that passes one equation and fails the other is on one line only.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-x-of-crossing',
      kind: 'try_yourself',
      problem:
        'Two lines are drawn on a coordinate plane. Line 1 is the graph of y = 2x - 3 and passes through (0, -3) and (5, 7). Line 2 is the graph of y = -x + 9 and passes through (0, 9) and (9, 0). The two lines cross at exactly one grid point. Read that point off the graph, check it in both equations, and type the x-coordinate of the crossing point as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Follow Line 1 with your finger from (0, -3): it climbs 2 squares for every 1 square to the right, so it passes (1, -1), (2, 1), (3, 3), and so on. Follow Line 2 down from (0, 9): it drops 1 square for every 1 to the right, through (1, 8), (2, 7), (3, 6), and so on. Look for the one pair that shows up on both lines.',
        'The crossing point has to pass both equations. When you think you have it, substitute its x and y into each one: 2x - 3 must equal the y you read, and so must -x + 9. Type only the x-coordinate, the count to the right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-equation-and-lone-number',
      kind: 'misconception_check',
      question:
        'Two lines are drawn: the graph of y = x + 4 and the graph of x + y = 10. Ava says (1, 5) is the solution of the system, because 1 + 4 = 5. Ben reads the crossing point off the grid and writes down "the solution is x = 3." Check each claim against both equations. What went wrong in each case?',
      commonErrors: [
        {
          answer: '(1, 5) is the solution, because 1 + 4 = 5.',
          misconception: 'Checking the pair in only ONE equation and calling it a solution of the system, when a solution must satisfy both.',
          correctsTo:
            '(1, 5) does pass the first equation, since 1 + 4 = 5. But the second equation gives 1 + 5 = 6, and 6 is not 10, so it fails. On the grid, (1, 5) is a point on the first line that is nowhere near the second line. The pair that passes both is (3, 7): 3 + 4 = 7 is true, and 3 + 7 = 10 is true. A solution of a system has two jobs, and (1, 5) only does one of them.',
        },
        {
          answer: 'The solution is x = 3.',
          misconception: 'Treating the solution of a system as a single number, the way a one-variable equation has a single number as its solution, and dropping the y-coordinate.',
          correctsTo:
            'x = 3 is half of a location. On the grid, x = 3 names a whole vertical column of points, and only one of them is the crossing. The solution of a system is a PAIR: the crossing point is (3, 7), so the answer is x = 3 AND y = 7, together. Check the pair in both equations: 3 + 4 = 7 and 3 + 7 = 10, both true. Naming x alone is like texting "Main Street" without the cross street.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An equation with two variables has endless solutions, and each solution is a PAIR (x, y), not a single number.',
        'A system is two equations about the same pair. Its solution is the one pair that makes BOTH equations true at the same time.',
        'To check a pair, substitute it into each equation separately. One pass and one fail means it is not a solution of the system.',
        'The graph of an equation is all of its solutions drawn as points, so a point on the line and a pair that satisfies the equation are the same thing.',
        'The point where the two lines cross is on both lines, so it satisfies both equations: the crossing point IS the solution of the system.',
        'A crossing point read off a grid is a claim. Prove it by substituting into both equations before you call it the solution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Solutions of Systems as Intersection Points' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
