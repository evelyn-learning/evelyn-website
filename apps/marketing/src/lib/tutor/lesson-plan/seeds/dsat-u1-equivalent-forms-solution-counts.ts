/**
 * Digital SAT — Math / Algebra: Equivalent Forms & No/Infinite-Solution Traps.
 *
 * Goes past the single-equation solution-count basics (1.1): this lesson is
 * about SYSTEMS of two linear equations — classifying them by solution count
 * with the coefficient-ratio test, recognizing when two equations are truly
 * equivalent (not just similar-looking), and the parameter (k / c) questions
 * the digital SAT builds around both. Desmos is allowed on every math
 * question — graphing both lines is a legitimate way to confirm parallel vs.
 * intersecting vs. identical.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_EQUIVALENT_FORMS_SOLUTION_COUNTS: LessonPlan = {
  id: 'evelyn.testprep.dsat.equivalent-forms-solution-counts.v1',
  title: 'Equivalent Forms & No/Infinite-Solution Traps',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.equivalent-forms-solution-counts',
      standard: 'DSAT-1.6',
      description:
        'Classify a system of two linear equations by solution count using the coefficient-ratio test, recognize when two linear equations are truly equivalent, and solve parameter questions that hinge on matching ratios rather than guess-and-check.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame this as the systems-level escalation of the 1.1 solution-count trap — a recurring, high-value twist on the digital SAT.',
      script:
        'Systems of two linear equations show up on nearly every digital SAT Math section, and a chunk of those items twist the question to ask about the NUMBER of solutions instead of the solution itself — no solution, one solution, or infinitely many. You already learned that trap for a single equation. Systems use a completely different test, and paired with "which equation is equivalent to..." items, these two patterns account for some of the Algebra domain\'s highest-leverage points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ratio-test',
      kind: 'concept',
      goal: 'The coefficient-ratio test for classifying systems by solution count, equivalent-equation recognition, and the parameter questions built on both.',
      keyIdeas: [
        'RATIO TEST — for ax + by = c and dx + ey = f, compare a/d and b/e first. If they are EQUAL, the lines are parallel or identical (compare c/f next). If they are NOT equal, the lines cross at exactly one point — no need to even look at the constants.',
        'PARALLEL vs IDENTICAL — once a/d = b/e, check c/f. If c/f also equals that ratio, the two equations describe the SAME line: infinitely many solutions. If c/f is different, the lines are parallel but distinct: no solution.',
        'EQUIVALENT EQUATIONS — two equations are equivalent only when EVERY term scales by the same factor, including the constant. Scaling the x- and y-coefficients but not the constant (or vice versa) produces a different line, not an equivalent one — this is the SAT\'s favorite "equivalent form" trap.',
        'TRAP — SYSTEMS ARE NOT 1.1. A single equation\'s "no solution" comes from simplifying to a false numeric statement (0 = 7); a system\'s "no solution" comes from two DIFFERENT lines that happen to be parallel. Don\'t try to collapse a system to one false statement — run the ratio test instead.',
        'PARAMETER QUESTIONS — "For what value of k does this system have no solution / infinitely many solutions?" Set up the coefficient-ratio equation FIRST to solve for k (this is the condition for parallel lines), then check whether the constants also match to decide no-solution vs. infinitely-many.',
        'SLOPE-INTERCEPT SHORTCUT — rewriting each equation as y = mx + b works too: same slope + different intercept = no solution; same slope + same intercept = infinitely many; different slope = exactly one solution, regardless of the constants.',
        'DESMOS CHECK — graph both equations. Lines that never meet = no solution, lines that overlap perfectly = infinitely many, lines that cross once = one solution. A fast visual confirmation of the ratio test.',
      ],
      vocabulary: [
        { term: 'equivalent equations', definition: 'two equations with identical solution sets — every term of one is the same constant multiple of the other, including the constant term.' },
        { term: 'coefficient ratio test', definition: 'comparing a/d and b/e (and then c/f) for two equations ax+by=c and dx+ey=f to classify a system\'s solution count without solving it.' },
        { term: 'inconsistent system', definition: 'a system with no solution — the equations describe parallel, non-identical lines.' },
        { term: 'consistent system', definition: 'a system with at least one solution — either exactly one (intersecting lines) or infinitely many (identical lines).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-equivalent-form',
      kind: 'worked_example',
      problem: 'A student claims that 6x − 9y = 15 is equivalent to 2x − 3y = 5. Verify the claim.',
      steps: [
        'Divide every term of 6x − 9y = 15 by 3: 6x/3 − 9y/3 = 15/3, which gives 2x − 3y = 5.',
        'That matches the second equation exactly, term for term — including the constant. Every (x, y) that satisfies one satisfies the other.',
        'The claim is TRUE: the equations are equivalent (same line). Contrast this with scaling only the coefficients — if the right side had NOT reduced to 5, the two equations would describe different, parallel lines instead.',
      ],
      answer: 'Equivalent — dividing 6x − 9y = 15 by 3 yields 2x − 3y = 5 exactly.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parameter-no-solution',
      kind: 'worked_example',
      problem: 'For what value of k does the system 2x + 3y = 7 and 4x + ky = 9 have no solution?',
      steps: [
        'Run the ratio test on the x- and y-coefficients: a/d = 2/4 = 1/2. Set b/e equal to that same ratio: 3/k = 1/2, so k = 6.',
        'Check the constants ratio: c/f = 7/9 ≈ 0.78. That does NOT equal 1/2, so the lines are parallel but not identical.',
        'Because the coefficient ratio matches but the constant ratio doesn\'t, k = 6 gives NO solution. (If 7/9 had also equaled 1/2, the same coefficient condition would instead give infinitely many solutions.)',
      ],
      answer: 'k = 6 (no solution)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-no-solution',
      kind: 'try_yourself',
      problem: 'For what value of k does the system 3x + 2y = 8 and 6x + ky = 5 have no solution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'k = 3' },
        { id: 'b', text: 'k = 4', correct: true },
        { id: 'c', text: 'k = 5' },
        { id: 'd', text: 'k = 1.6' },
      ],
      expectedAnswer: 'k = 4',
      hints: [
        'Set up the ratio test on the x- and y-coefficients: 3/6 compared to 2/k.',
        '3/6 = 1/2, so 2/k = 1/2 → k = 4. Then check that the constants (8 and 5) do NOT share that same 1/2 ratio — confirming no solution, not infinitely many.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equivalent-choice',
      kind: 'try_yourself',
      problem: 'Which equation is equivalent to 5x − 3y = 12?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '10x − 6y = 20' },
        { id: 'b', text: '10x − 6y = 24', correct: true },
        { id: 'c', text: '5x − 3y = 24' },
        { id: 'd', text: '15x − 9y = 12' },
      ],
      expectedAnswer: '10x − 6y = 24',
      hints: [
        'Multiply every term of the original equation by the same constant.',
        '5x · 2 = 10x and −3y · 2 = −6y, so the constant must also become 12 · 2 — not stay at 12 or change by a different factor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-infinite-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): for what value of c does the system 4x + 6y = 14 and 2x + 3y = c have infinitely many solutions?',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Divide the first equation by 2 and compare it to the second equation.',
        '4x + 6y = 14 divided by 2 is 2x + 3y = 7 — for infinitely many solutions the second equation must match that exactly, including the constant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-scale-constant',
      kind: 'misconception_check',
      question:
        'A student is asked: for what value of k does the system 3x + 5y = 9 and 6x + 10y = k have infinitely many solutions? The student answers k = 9.',
      commonErrors: [
        {
          answer: 'k = 9',
          misconception: 'Copying the original constant instead of scaling it by the same factor as the coefficients.',
          correctsTo: 'The coefficients scaled by 2 (3 → 6, 5 → 10), so the constant must scale by 2 as well: 9 × 2 = 18. k = 18 makes 6x + 10y = 18 identical to 3x + 5y = 9 — that\'s what gives infinitely many solutions.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ratio test first: compare a/d and b/e. Equal → parallel or identical (check c/f next). Not equal → exactly one solution, no need to check constants.',
        'Equivalent equations scale EVERY term by the same factor, including the constant — scaling only some terms is the SAT\'s favorite "equivalent form" trap.',
        'A system\'s no-solution / infinite-solutions test is NOT the 1.1 single-equation test (false statement vs. identity) — use the coefficient ratio or slope comparison instead.',
        'Desmos check: graph both lines. Never meet = no solution, overlap = infinitely many, cross once = one solution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.6', cedTitle: 'Equivalent Forms & No/Infinite-Solution Traps' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
