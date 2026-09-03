/**
 * Grade 8 Math — Systems of Linear Equations: Solving Systems by Graphing.
 *
 * PROCEDURE-LED. Row 5.1 handed the student two lines already drawn and the
 * idea that the solution of a system is the one (x, y) pair sitting on both.
 * This row takes the drawing away: the student receives two equations in (or
 * easily put into) y = mx + b form, draws both lines on one grid, reads the
 * crossing point, and checks it in BOTH equations (CCSS 8.EE.C.8b). The
 * recipe is: put each equation into y = mx + b if it is not there already,
 * plot (0, b) and step by the slope, read the crossing as (x, y), check in
 * both. Three extensions ride on that recipe: a crossing that is not a
 * lattice point is ESTIMATED and said with "about"; two lines with the same
 * slope and different intercepts never meet, so the system has no solution;
 * and two equations that turn out to be the same line drawn twice have
 * infinitely many solutions. Two traps this plan is built to kill: dividing
 * only one term when halving 2y = -2x + 8 (which draws a different line), and
 * assuming every pair of lines crosses somewhere off the edge of the paper.
 *
 * SCOPE GUARD: Graph two lines given in (or easily put into) y = mx + b form,
 * read the intersection, estimate it when it is not a lattice point, and
 * recognize by inspection that parallel lines (same slope, different
 * intercept; the standard's 3x + 2y = 5 vs 3x + 2y = 6) give no solution and
 * coincident lines infinitely many. Withholds: graphing from standard form
 * via intercepts and formal classification vocabulary ->
 * `alg1-u5-systems-by-graphing.ts` (HS review of the same skill);
 * elimination -> `alg1-u5-systems-elimination.ts`. Concretely: no equation in
 * this plan is graphed from ax + by = c, and no line is drawn from its
 * intercepts; the one standard-form pair that appears, 3x + 2y = 5 and
 * 3x + 2y = 6, is never rewritten and never graphed, only argued about by
 * inspection (3x + 2y is one number and cannot equal 5 and 6 at once). The
 * words "consistent", "inconsistent" and "dependent" do not appear; the
 * outcomes are named in plain words as "no solution" and "infinitely many
 * solutions". The only rewriting done to an equation is dividing every term
 * of a doubled-y equation such as 2y = 4x + 2 by 2; y is never isolated from
 * a general two-variable equation. No two right-hand sides are ever set equal
 * to each other, no value is ever substituted from one equation into the
 * other to solve, and no equations are added or scaled together (rows 5.3
 * and the Algebra 1 files own those). Where a crossing is not a lattice
 * point it is estimated from the graph and left as an estimate; the exact
 * pair is never computed. Deliberately allowed: this row DOES draw a line
 * directly from its y = mx + b equation (plot (0, b), step by m), because
 * the row's own scope cell requires it — the course-level ceiling that hands
 * graphing-from-the-equation to `alg1-u4-slope-intercept-form.ts` is
 * overridden here by the row, and the move is taught as running row 3.4's
 * skill (reading m and b off a graph) backward. Sideways: substituting a
 * candidate pair into both equations is row 5.1's skill, assumed and used
 * here only as the closing check, never as the method; word-problem
 * translation is row 5.4, and the hook's game-pass equations are handed to
 * the student ready-made. Below: slope as rise over run (row 3.3) and m and
 * b as slope and y-intercept (row 3.4) are recalled in a clause, never
 * re-taught.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U5_SOLVING_SYSTEMS_BY_GRAPHING: LessonPlan = {
  id: 'evelyn.ms.m8math.solving-systems-by-graphing.v1',
  title: 'Solving Systems by Graphing',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.solving-systems-by-graphing',
      standard: 'M8MATH-5.2',
      description:
        'Graph two lines given in (or easily put into) y = mx + b form, read the intersection, estimate it when it is not a lattice point, and recognize by inspection that parallel lines (same slope, different intercept; 3x + 2y = 5 vs 3x + 2y = 6) give no solution and coincident lines infinitely many (CCSS 8.EE.C.8b).',
    },
  ],
  prerequisites: ['m8math.solutions-of-systems-as-intersection-points'],
  followUps: ['m8math.solving-systems-by-substitution'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hand the student two cost equations with no graph attached, so the need to draw the lines and find the crossing is felt before the recipe is given.',
      script:
        'Your friend is picking a game pass. Pass A costs $5 to join and then $2 for every game you download. Pass B costs only $1 to join, but each game is $3. For the first few games Pass B is cheaper, and somewhere the two costs meet. Last lesson the two cost lines would have been drawn for you, and you would have read the crossing. This time you get only the equations: y = 2x + 5 for Pass A and y = 3x + 1 for Pass B, where x is the number of games and y is the total in dollars. You already know how to pull m and b out of a line like that. Today you run that skill backward: turn each equation into its line, draw both on one grid, and read the crossing point, which is the one number of games where the two passes cost exactly the same. Then you learn to spot, before drawing anything, the two kinds of system whose lines do not cross at a single point.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-graph-read-check',
      kind: 'concept',
      goal: 'Install the graph-both-lines, read-the-crossing, check-in-both recipe, the estimate for a non-lattice crossing, and the by-inspection cases of no solution and infinitely many solutions.',
      keyIdeas: [
        'THE SOLUTION IS STILL THE CROSSING POINT — last lesson the two lines were drawn for you, and the solution was the one (x, y) pair sitting on both. Today nobody draws the lines for you. You get two equations, such as y = 2x + 5 and y = 3x + 1, and the job is to draw both lines yourself and find where they cross.',
        'GRAPH A LINE FROM y = mx + b — you already know that b is where the line crosses the y-axis and m is the slope, rise over run. To draw y = 3x + 1, plot (0, 1), then step by the slope: up 3 and right 1 lands on (1, 4), and again on (2, 7). Three points in a row confirm the line, so draw it through them. Do the same for the second equation on the SAME axes, or there is no crossing to find.',
        'PUT IT INTO y = mx + b FIRST WHEN THAT IS EASY — 2y = 6x + 4 is the line y = 3x + 2 in disguise, because dividing EVERY term by 2 gives y = 3x + 2. Halving only the 4, to get y = 6x + 2, draws a different line and finds a different crossing. If y has a number in front of it and every term is a multiple of that number, divide it out of every term, and then graph.',
        'READ THE CROSSING, THEN CHECK IT IN BOTH — read the point as (x, y), across first and then up. If the crossing lands exactly where two grid lines meet, a lattice point, substitute it into BOTH equations. Both sides matching in both equations says the point is on both lines, and the solution is exact.',
        'ESTIMATE WHEN THE CROSSING IS BETWEEN GRID LINES — lines do not always cross at a lattice point. If the crossing sits between x = 1 and x = 2, closer to 1, and between y = 2 and y = 3, closer to 3, say "about (1.3, 2.7)". The check will come out close on both sides rather than exact, and that is what an estimate looks like; a hand-drawn graph cannot pin the point down any more tightly than that.',
        'SAME SLOPE, NO CROSSING; SAME LINE, EVERY POINT — y = 2x + 3 and y = 2x - 1 both climb 2 for every 1 across, so the gap between them never changes and they never meet: parallel lines, no solution. The same thing hides in 3x + 2y = 5 and 3x + 2y = 6, because for any pair (x, y) the expression 3x + 2y is one number, and one number cannot equal 5 and 6 at once, so no pair works in both and no graph is needed. And y = 2x + 1 with 2y = 4x + 2 is one line written twice, since dividing every term by 2 turns the second equation into the first: every point on that line is a solution, so there are infinitely many.',
      ],
      vocabulary: [
        { term: 'lattice point', definition: 'a point whose x-coordinate and y-coordinate are both integers, so it sits exactly where two grid lines meet.' },
        { term: 'parallel lines', definition: 'two lines with the same slope and different y-intercepts; they never meet, so a system whose graph is two parallel lines has no solution.' },
        { term: 'coincident lines', definition: 'two equations that describe the same line, so the graph is one line drawn twice and every point on it is a solution.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-game-passes',
      kind: 'worked_example',
      problem:
        'Pass A costs $5 to join and then $2 per game. Pass B costs $1 to join and then $3 per game. After how many games do the two passes cost the same, and what is that cost? Solve by graphing y = 2x + 5 and y = 3x + 1, where x is the number of games and y is the total cost in dollars.',
      steps: [
        'Both equations are already in y = mx + b form. Pass A: b = 5 and m = 2. Pass B: b = 1 and m = 3.',
        'Graph Pass A. Plot (0, 5). The slope 2 means up 2 for every 1 to the right, so the next points are (1, 7), (2, 9), (3, 11), (4, 13). Draw the line through them.',
        'Graph Pass B on the SAME axes. Plot (0, 1). The slope 3 means up 3 for every 1 to the right, so the next points are (1, 4), (2, 7), (3, 10), (4, 13). Draw the line through them.',
        'Both lists contain (4, 13), and on the grid that is exactly where the two lines cross. Read it as (x, y): x = 4 and y = 13. It is a lattice point, so the graph is giving an exact answer.',
        'Check in BOTH equations. Pass A: 2(4) + 5 = 8 + 5 = 13. Pass B: 3(4) + 1 = 12 + 1 = 13. Both give 13, so (4, 13) is on both lines and is the solution.',
        'Read it back into the story: after 4 games both passes cost $13. Pass B starts $4 cheaper but climbs $3 a game against Pass A\'s $2, so it gains $1 on Pass A every game and catches up in exactly 4 games, which is the same 4 the graph found.',
      ],
      answer: '(4, 13): after 4 games both passes cost $13',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-estimate-non-lattice',
      kind: 'worked_example',
      problem: 'Solve by graphing: y = 3x - 1 and 2y = -2x + 8. Give the solution as precisely as the graph allows.',
      steps: [
        'The first equation is in y = mx + b form: b = -1 and m = 3. The second is not, because y is doubled. Divide EVERY term by 2: 2y ÷ 2 = y, -2x ÷ 2 = -x, and 8 ÷ 2 = 4, so the second line is y = -x + 4.',
        'WRONG: dividing only the 8 by 2 and writing y = -2x + 4. CORRECT: 2y = -2x + 8 says that twice y equals the whole right side, so halving y means halving every term on the right, which gives y = -x + 4. The check exposes the slip: at x = 2 the original gives 2y = -4 + 8 = 4, so y = 2, and y = -x + 4 gives -2 + 4 = 2 as well, while the wrong version gives -4 + 4 = 0.',
        'Graph y = 3x - 1. Plot (0, -1), then up 3 and right 1: (1, 2), (2, 5). Draw the line through them.',
        'Graph y = -x + 4 on the SAME axes. Plot (0, 4), then down 1 and right 1: (1, 3), (2, 2), (3, 1). Draw the line through them.',
        'Look at where they cross. At x = 1 the first line is at 2 and the second at 3, so the second is above. At x = 2 the first is at 5 and the second at 2, so the first is above. The crossing is between x = 1 and x = 2, and because the gap is only 1 at x = 1 but 3 at x = 2, it sits closer to 1. The height there is between 2 and 3, closer to 3. This is not a lattice point, so the answer is an estimate: about (1.3, 2.7).',
        'Check the estimate in BOTH equations. y = 3x - 1: 3(1.3) - 1 = 3.9 - 1 = 2.9. y = -x + 4: -1.3 + 4 = 2.7. The two sides come out close, 2.9 and 2.7, but not identical, which is exactly what an estimate looks like: the true crossing is very near (1.3, 2.7), and a hand-drawn graph cannot pin it down more tightly than that.',
      ],
      answer: 'About (1.3, 2.7); the crossing is not a lattice point, so the graph gives an estimate',
      estimatedMinutes: 3,
    },
    {
      id: 'try-read-lattice-crossing',
      kind: 'try_yourself',
      problem: 'Graph y = x + 1 and y = -2x + 7 on the same axes. What is the solution of the system?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(3, 2)' },
        { id: 'b', text: '(0, 1)' },
        { id: 'c', text: '(1, 5)' },
        { id: 'd', text: '(2, 3)', correct: true },
      ],
      expectedAnswer: '(2, 3)',
      hints: [
        'First line: plot (0, 1), then up 1 and right 1. Second line: plot (0, 7), then down 2 and right 1. Draw both and look for the one point that is on both lines.',
        'Read the crossing as (x, y), across first and then up. Then substitute your pair into y = x + 1 AND into y = -2x + 7; a point that works in only one of them is on only one line.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-has-no-solution',
      kind: 'try_yourself',
      problem: 'Without graphing, decide which system has NO solution.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 2x + 3 and y = -2x + 3' },
        { id: 'b', text: 'y = 2x + 3 and y = 2x - 4', correct: true },
        { id: 'c', text: 'y = 2x + 3 and 2y = 4x + 6' },
        { id: 'd', text: 'y = 2x + 3 and y = 3x + 2' },
      ],
      expectedAnswer: 'y = 2x + 3 and y = 2x - 4',
      hints: [
        'Compare the slopes first. Two lines with the same slope climb at the same rate, so the gap between them never changes.',
        'Same slope with a different y-intercept means parallel lines and no solution. Same slope with the same y-intercept, once every term has been divided by the same number, means one line drawn twice, which has infinitely many solutions, not zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-x-of-crossing',
      kind: 'try_yourself',
      problem:
        'Solve by graphing: y = -x + 9 and 2y = 4x - 6. What is the x-coordinate of the point where the two lines cross? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Divide every term of 2y = 4x - 6 by 2 first, so the second line is in y = mx + b form: y = 2x - 3.',
        'Plot (0, 9) and step down 1, right 1 for the first line; plot (0, -3) and step up 2, right 1 for the second. The lines meet at a lattice point. Check it in both equations, then type only the x-coordinate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parallel-and-same-line',
      kind: 'misconception_check',
      question:
        'Devon looks at the system 3x + 2y = 5 and 3x + 2y = 6 and says the lines must cross somewhere, so a bigger sheet of graph paper would show the solution. Then Devon looks at y = 2x + 1 and 2y = 4x + 2 and says this system has no solution, because the two equations are different. What went wrong in each case?',
      commonErrors: [
        {
          answer: '3x + 2y = 5 and 3x + 2y = 6 cross somewhere off the edge of the graph.',
          misconception: 'Assuming every pair of lines crosses eventually, instead of comparing the two equations by inspection.',
          correctsTo:
            'Look at the left sides: they are identical. For any pair (x, y), the expression 3x + 2y is one number, and one number cannot be 5 and 6 at the same time. So no pair works in both equations, and the two lines are parallel. They never meet, no matter how far the graph extends, and no graph is needed to see it. The system has no solution.',
        },
        {
          answer: 'y = 2x + 1 and 2y = 4x + 2 have no solution, because the equations look different.',
          misconception: 'Treating two equations that are written differently as two different lines, without putting both into y = mx + b form first.',
          correctsTo:
            'Divide every term of 2y = 4x + 2 by 2: 2y ÷ 2 = y, 4x ÷ 2 = 2x, and 2 ÷ 2 = 1, which is y = 2x + 1, the first equation exactly. The two equations describe the same line, so the graph is one line drawn twice, and every point on it is a solution: (0, 1), (1, 3), (2, 5), and on forever. Check (1, 3) in the original second equation: 2(3) = 6 and 4(1) + 2 = 6. Infinitely many solutions, not zero.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'To solve a system by graphing, draw both lines on the same axes and read the point where they cross as (x, y), across first and then up.',
        'Graph y = mx + b by plotting (0, b) and stepping by the slope m, rise over run, to two more points.',
        'If y has a number in front of it, such as 2y = 4x + 6, divide EVERY term by that number before graphing.',
        'Check the crossing point in BOTH equations; a lattice point that works in both is the exact solution.',
        'When the crossing sits between grid lines, estimate it and say "about"; the check comes out close rather than exact, and the graph cannot do better than that.',
        'Same slope with different y-intercepts means parallel lines and no solution; two equations that turn out to be the same line have infinitely many solutions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Solving Systems by Graphing' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
