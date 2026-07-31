/**
 * Algebra 1 — Systems: Word Problems & Systems of Linear Inequalities.
 *
 * The payoff end of Unit 5 (CCSS A-CED.A.3, A-REI.D.12): turn a paragraph
 * into two equations, pick the cheaper solving method, and — when the
 * constraints are "at most / at least" instead of "exactly" — graph the
 * two half-planes and read the overlap.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U5_SYSTEMS_APPLICATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.systems-applications.v1',
  title: 'Systems Word Problems & Systems of Inequalities',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.systems-applications',
      standard: 'ALG1-5.4',
      description:
        'Define two variables to model a real-world scenario as a system of linear equations, choose an efficient solving method, and graph systems of linear inequalities to identify the overlapping solution region (CCSS A-CED.A.3, A-REI.D.12).',
    },
  ],
  prerequisites: ['alg1.systems-elimination'],
  followUps: ['alg1.exponent-rules'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the real skill as translation: outside the textbook, systems arrive as paragraphs, not as equations.',
      script:
        'Nobody in the real world hands you two equations. They hand you a situation: a fundraiser sold 180 tickets and took in 1,760 dollars, and you need to know how many were adult tickets. Two unknowns, two facts — that is a system. Solving it is the easy half; today we practice the hard half, turning words into equations. And when the facts say "at most" or "at least" instead of "exactly," we graph instead of solve.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translate-and-shade',
      kind: 'concept',
      goal: 'Define variables, convert each constraint into one equation, choose a method, and extend the same thinking to inequalities and overlapping regions.',
      keyIdeas: [
        'STEP 1 — DEFINE with units. Write it out: "Let x = number of adult tickets, y = number of student tickets." Undefined variables are the number-one cause of a scrambled system.',
        'STEP 2 — ONE CONSTRAINT, ONE EQUATION. Two unknowns need two independent facts. The classic pairs are count + total value, total volume + total ingredient, and time + distance.',
        'STEP 3 — TRANSLATION PATTERNS. COUNT-AND-VALUE: x + y = 180 (how many) and 12x + 8y = 1760 (how much). MIXTURE: x + y = 60 (total mL) and 0.20x + 0.50y = 0.30(60) (total acid). RATE WITH A CURRENT: b + c = downstream speed and b − c = upstream speed, where b = boat speed and c = current speed.',
        'STEP 4 — PICK THE CHEAPER METHOD. Substitution when one equation is already solved for a variable or has a coefficient of 1 (like x + y = 180). Elimination when both sit in Ax + By = C form with matching or easily matched coefficients.',
        'STEP 5 — INTERPRET AND CHECK. "x = 80" is not the answer; "80 adult tickets" is. Then test the pair in BOTH original sentences, and reject nonsense like negative tickets or 2.5 people.',
        'INEQUALITIES — GRAPH EACH BOUNDARY. Rewrite each inequality in y = mx + b form and graph the boundary line: DASHED for < or > (points on the line do not count), SOLID for ≤ or ≥ (they do).',
        'INEQUALITIES — SHADE THE TRUE SIDE. In y = form, y > shades above the line and y < shades below. If you rearranged and are unsure, test (0, 0): if it makes the inequality true, shade the side containing the origin.',
        'THE SOLUTION IS THE OVERLAP. A point solves the system only if it satisfies EVERY inequality, so the answer is the region where all the shadings pile up — not the whole shaded page. Sanity-check by testing one point from inside it.',
      ],
      vocabulary: [
        { term: 'constraint', definition: 'a fact from the problem that limits the variables — each one becomes a single equation or inequality.' },
        { term: 'half-plane', definition: 'everything on one side of a boundary line; the shaded solution set of one linear inequality.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tickets',
      kind: 'worked_example',
      problem: 'A school play sold adult tickets for $12 and student tickets for $8. They sold 180 tickets and collected $1,760. How many of each were sold?',
      steps: [
        'Define: x = adult tickets, y = student tickets.',
        'Constraint 1 (how many): x + y = 180.',
        'Constraint 2 (how much): 12x + 8y = 1760.',
        'Equation 1 has coefficient 1, so substitute: y = 180 − x.',
        '12x + 8(180 − x) = 1760 → 12x + 1440 − 8x = 1760 → 4x = 320 → x = 80.',
        'Back-substitute: y = 180 − 80 = 100.',
        'Interpret and check: 80 adult and 100 student tickets. 80 + 100 = 180 ✓ and 12(80) + 8(100) = 960 + 800 = 1760 ✓.',
      ],
      answer: '80 adult tickets and 100 student tickets',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inequality-region',
      kind: 'worked_example',
      problem: 'Graph the system x + y ≤ 6 and y > 2x − 3, then decide whether (1, 4) and (3, 3) are solutions.',
      steps: [
        'Rewrite the first inequality in y = form: y ≤ −x + 6. Boundary y = −x + 6 is SOLID (≤) and you shade BELOW it.',
        'The second is already in y = form: y > 2x − 3. Boundary y = 2x − 3 is DASHED (>) and you shade ABOVE it.',
        'The boundaries cross where −x + 6 = 2x − 3 → 9 = 3x → x = 3, y = 3, so the overlap is the wedge with corner (3, 3) opening to the left.',
        'Test (1, 4): 1 + 4 = 5 ≤ 6 ✓ and 4 > 2(1) − 3 = −1 ✓. Both true, so (1, 4) is a solution.',
        'Test (3, 3): 3 + 3 = 6 ≤ 6 ✓ — the solid line counts. But 3 > 2(3) − 3 = 3 is FALSE, since 3 is not greater than 3.',
        'Edge case to remember: the corner point sits on the DASHED boundary, so it is excluded. A point must satisfy every inequality, not just most of them.',
      ],
      answer: '(1, 4) is a solution; (3, 3) is not — it lies on the dashed boundary',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translate',
      kind: 'try_yourself',
      problem: 'A theater sold 300 tickets in all. Adult tickets cost $15, child tickets cost $9, and the total collected was $3,660. Let x = adult tickets and y = child tickets. Which system models this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x + y = 300 and 15x + 9y = 3660', correct: true },
        { id: 'b', text: 'x + y = 3660 and 15x + 9y = 300' },
        { id: 'c', text: 'x + y = 300 and 9x + 15y = 3660' },
        { id: 'd', text: 'x + y = 300 and 24x = 3660' },
      ],
      expectedAnswer: 'x + y = 300 and 15x + 9y = 3660',
      hints: [
        'One equation counts tickets; the other counts dollars. Which number is a count and which is money?',
        'Each price must multiply the variable it belongs to: $15 goes with the adult count x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-region',
      kind: 'try_yourself',
      problem: 'Which point is in the solution region of the system y ≥ x + 2 and y < −2x + 8?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(0, 5)', correct: true },
        { id: 'b', text: '(0, 1)' },
        { id: 'c', text: '(2, 4)' },
        { id: 'd', text: '(3, 5)' },
      ],
      expectedAnswer: '(0, 5)',
      hints: [
        'Substitute each point into BOTH inequalities — one true statement is not enough.',
        'Watch the strict inequality: y < −2x + 8 rejects any point that lands exactly on that line.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-current',
      kind: 'try_yourself',
      problem: 'A boat travels 36 km downstream in 3 hours and the same 36 km upstream in 6 hours. Find the speed of the current in km/h. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Turn the trips into speeds first: 36/3 downstream and 36/6 upstream.',
        'With b = boat speed and c = current, b + c = 12 and b − c = 6. Add the equations to eliminate c.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-to-decimal',
      kind: 'misconception_check',
      question: 'To mix a 20% acid solution with a 50% acid solution and get 60 mL of 30% solution, a student writes x + y = 60 and 20x + 50y = 30(60). What went wrong, and what is the correct second equation?',
      commonErrors: [
        {
          answer: '20x + 50y = 30(60)',
          misconception: 'Dropping the percent sign and using 20 and 50 as plain coefficients, so each mL appears to contribute 20 units of acid.',
          correctsTo: 'Inside an equation, 20% means the multiplier 0.20. The acid equation is 0.20x + 0.50y = 0.30(60) = 18. Solving with y = 60 − x gives 0.20x + 30 − 0.50x = 18 → −0.30x = −12 → x = 40 mL of the 20% and y = 20 mL of the 50%. (You may clear the decimals by multiplying the whole equation by 100 — just do it to every term.)',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Define both variables with units before writing a single equation.',
        'Each fact in the paragraph becomes exactly one equation: count with count, value with value.',
        'Substitution when a coefficient is 1; elimination when both equations are in Ax + By = C form.',
        'Percents become decimals before they enter an equation: 20% → 0.20.',
        'Inequalities: dashed for < and >, solid for ≤ and ≥; shade each half-plane, and the solution is the OVERLAP.',
        'Interpret in context and check the pair in both original constraints.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Systems Word Problems & Systems of Inequalities' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
