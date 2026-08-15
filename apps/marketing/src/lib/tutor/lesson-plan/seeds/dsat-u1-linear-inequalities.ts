/**
 * Digital SAT — Math / Algebra: Linear Inequalities in One or Two Variables.
 *
 * Covers BOTH forms tested on the digital SAT: one-variable inequality
 * solving (the sign-flip rule) and two-variable inequalities / systems of
 * inequalities (boundary lines, solution regions, and the test-point
 * method). Desmos graphs inequalities directly and is allowed on every
 * math question — teach it as a verification tool, not a crutch.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_LINEAR_INEQUALITIES: LessonPlan = {
  id: 'evelyn.testprep.dsat.linear-inequalities.v1',
  title: 'Linear Inequalities in One or Two Variables',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.linear-inequalities',
      standard: 'DSAT-1.5',
      description:
        'Solve linear inequalities in one variable and represent, interpret, and test solutions of linear inequalities and systems of inequalities in two variables, including real-world constraint problems.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame inequalities as fast Algebra points once the one-variable sign-flip rule and the two-variable test-point method are automatic.',
      script:
        'Algebra is about 35 percent of SAT Math — roughly 13 to 14 of the 44 scored questions — and linear inequalities show up in 2 to 4 of those, split between one-variable solving and two-variable systems where you read a described graph or shaded region. The one-variable rule is one sentence long. The two-variable questions are just equations with an extra reading-comprehension step. Both are fast points once you know the pattern.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-traps',
      kind: 'concept',
      goal: 'Solve one-variable inequalities with the sign-flip rule; represent and test two-variable inequalities and systems, including constraint word problems.',
      keyIdeas: [
        'BASE PROCEDURE (one variable) — solve exactly like an equation: add, subtract, multiply, divide both sides. One special rule applies.',
        'TRAP 1 — SIGN FLIP. Multiplying or dividing both sides by a NEGATIVE number flips the inequality direction. −6x > 36 → divide by −6 → x < −6 (flipped).',
        'TWO-VARIABLE FORM — y < mx + b describes a REGION of the coordinate plane, not a line. Solid boundary (≤, ≥) means points ON the line count; dashed boundary (<, >) means they don\'t.',
        'TRAP 2 — TEST-POINT METHOD. To check whether an ordered pair (x, y) satisfies an inequality, substitute its coordinates directly and evaluate. Don\'t try to visualize — compute.',
        'SYSTEMS OF INEQUALITIES — a point must satisfy EVERY inequality in the system to be a solution. Check each inequality in turn and reject on the first failure; don\'t stop after just one passing check.',
        'CONSTRAINT WORD PROBLEMS — translate phrases literally: "at least" → ≥, "at most" → ≤, "more than" → >, "fewer than / less than" → <, "no more than" → ≤, "no less than" → ≥.',
        'DESMOS CHECK — Desmos graphs inequalities directly (typing y ≥ 2x − 1 shades the region); use it to verify which point lies in a system\'s overlap.',
      ],
      vocabulary: [
        { term: 'boundary line', definition: 'the line that separates the coordinate plane into the region satisfying the inequality and the region that doesn\'t.' },
        { term: 'solution region', definition: 'the set of all points (x, y) that make an inequality — or every inequality in a system — true.' },
        { term: 'system of inequalities', definition: 'two or more inequalities considered together; a solution must satisfy all of them simultaneously.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-one-variable',
      kind: 'worked_example',
      problem: 'Solve for x: 4 − 3x ≤ 19',
      steps: [
        'Subtract 4 from both sides: −3x ≤ 15.',
        'Divide both sides by −3. SIGN FLIPS (dividing by a negative): x ≥ −5.',
        'Check: x = −5 → 4 − 3(−5) = 4 + 15 = 19 ≤ 19 ✓ (boundary). x = 0 → 4 ≤ 19 ✓.',
      ],
      answer: 'x ≥ −5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-system-test-point',
      kind: 'worked_example',
      problem: 'A system consists of y > 2x − 1 and y ≤ −x + 5. Which of the points (4, 2), (2, 6), and (0, 3) is a solution to the system?',
      steps: [
        'Test (4, 2) in y > 2x − 1: is 2 > 2(4) − 1 = 7? No — eliminated immediately, no need to check the second inequality.',
        'Test (2, 6) in y > 2x − 1: is 6 > 2(2) − 1 = 3? Yes. But a point must pass EVERY inequality — check the second too: y ≤ −x + 5 → is 6 ≤ −2 + 5 = 3? No. Eliminated.',
        'Test (0, 3): y > 2x − 1 → is 3 > 2(0) − 1 = −1? Yes. y ≤ −x + 5 → is 3 ≤ −0 + 5 = 5? Yes. Both hold.',
      ],
      answer: '(0, 3)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sign-flip',
      kind: 'try_yourself',
      problem: 'Solve for x: −6x + 5 > 41',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x > −6' },
        { id: 'b', text: 'x < −6', correct: true },
        { id: 'c', text: 'x < 6' },
        { id: 'd', text: 'x > 6' },
      ],
      expectedAnswer: 'x < −6',
      hints: ['Subtract 5 from both sides first.', 'Dividing by a negative number flips the inequality sign.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-system',
      kind: 'try_yourself',
      problem: 'Which of the following points is a solution to the system y ≤ x + 2 and y > 3x − 4? (2, 5), (0, −5), (1, 3), (3, 1)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(2, 5)' },
        { id: 'b', text: '(0, −5)' },
        { id: 'c', text: '(1, 3)', correct: true },
        { id: 'd', text: '(3, 1)' },
      ],
      expectedAnswer: '(1, 3)',
      hints: [
        'Test each point in BOTH inequalities — a point must satisfy every inequality in the system.',
        'Start with y ≤ x + 2 to eliminate quickly, then check y > 3x − 4 on what remains.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-constraint-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): A school club has at most $150 to spend on supplies. Notebooks cost $3 each and pens cost $1 each. If the club buys 30 notebooks, what is the maximum number of pens it can buy without exceeding the budget?',
      responseFormat: 'numeric',
      expectedAnswer: '60',
      hints: [
        'Translate "at most $150" as the inequality 3n + p ≤ 150.',
        'Substitute n = 30, then solve for the largest p.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-partial-system-check',
      kind: 'misconception_check',
      question:
        'A student checks the point (2, 6) against the system y > 2x − 1 and y ≤ −x + 5. They plug into the first inequality, get 6 > 3, TRUE, and immediately conclude (2, 6) is a solution to the system. What went wrong?',
      commonErrors: [
        {
          answer: '(2, 6) is a solution to the system',
          misconception: 'Stopping after checking only ONE inequality instead of testing the point against EVERY inequality in the system.',
          correctsTo: 'A solution to a system must satisfy ALL inequalities. Checking the second: 6 ≤ −2 + 5 = 3 is FALSE, so (2, 6) is NOT a solution — it only satisfies one of the two inequalities.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solve one-variable inequalities like equations — EXCEPT flip the sign when multiplying or dividing by a negative.',
        'A two-variable inequality describes a REGION; test a point by substituting its coordinates directly, never by guessing.',
        'A solution to a SYSTEM of inequalities must satisfy EVERY inequality — check them all before accepting a point.',
        'Translate constraint word problems literally: "at least" → ≥, "at most" → ≤, "more than" → >, "less than" → <.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.5', cedTitle: 'Linear Inequalities in One or Two Variables' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
