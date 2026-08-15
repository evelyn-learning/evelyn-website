/**
 * Digital SAT — Math / Algebra: Linear Equations in Two Variables & Their
 * Graphs.
 *
 * The recurring core of the Algebra domain: slope-intercept, standard, and
 * point-slope forms; slope from two points or from standard form; x- and
 * y-intercepts; parallel/perpendicular slope relationships; and reading
 * slope/intercept meaning in a word-problem context. Desmos is allowed on
 * every math question — teach when graphing a candidate equation beats
 * hand-algebra for matching or checking.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_LINEAR_EQUATIONS_TWO_VARS: LessonPlan = {
  id: 'evelyn.testprep.dsat.linear-equations-two-vars.v1',
  title: 'Linear Equations in Two Variables & Their Graphs',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.linear-equations-two-vars',
      standard: 'DSAT-1.3',
      description:
        'Write, interpret, and graph linear equations in two variables in slope-intercept, standard, and point-slope form; find slope and intercepts; and apply the parallel/perpendicular slope relationship.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: ['dsat.systems-of-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame linear equations in two variables as the recurring core of the SAT Algebra domain — graphs, forms, and intercepts show up across nearly every module.',
      script:
        'Algebra is roughly 35 percent of SAT Math — about 13 to 15 of the 44 questions — and almost all of it touches a line: writing its equation, reading its graph, or converting between forms. Master slope, intercepts, and the parallel/perpendicular relationship, and you unlock a big share of the Algebra domain with one skill.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-forms-slope-intercepts',
      kind: 'concept',
      goal: 'The three equation forms, slope and intercept from any of them, parallel/perpendicular slopes, graph-matching, and context interpretation.',
      keyIdeas: [
        'THREE FORMS — slope-intercept y = mx + b (m = slope, b = y-intercept), standard form Ax + By = C, and point-slope y − y₁ = m(x − x₁). The SAT tests moving between all three, often forcing a rearrangement before the question can be answered.',
        'SLOPE FROM TWO POINTS: m = (y₂ − y₁) / (x₂ − x₁). SLOPE FROM STANDARD FORM: m = −A/B — a shortcut that skips fully solving for y.',
        'Y-INTERCEPT is the value of y when x = 0 — the graph\'s crossing point on the y-axis, and in context the STARTING VALUE. X-INTERCEPT is the value of x when y = 0 — set the other variable to zero and solve.',
        'PARALLEL LINES have the SAME slope and different intercepts. PERPENDICULAR LINES have slopes that are NEGATIVE RECIPROCALS of each other — multiply to −1.',
        'GRAPH-MATCHING TRAP — given an equation, pick its graph (or vice versa). Check slope SIGN first (rising vs falling), then steepness, then the y-intercept — usually enough to eliminate 3 of 4 choices without plotting every point.',
        'WORD-PROBLEM CONTEXT — the SAT loves "what does [the slope / the y-intercept] represent" questions. Slope = rate of change ("per unit"); y-intercept = the value when the input is zero (a flat fee, a starting amount, an initial population).',
        'DESMOS CHECK — graph a given equation and each candidate answer to instantly compare slope and intercept, or type two points to have Desmos draw the line and read the equation off the display.',
      ],
      vocabulary: [
        { term: 'standard form', definition: 'a linear equation written as Ax + By = C; slope = −A/B and intercepts come from setting x or y to zero.' },
        { term: 'point-slope form', definition: 'y − y₁ = m(x − x₁), built directly from one known point and the slope — useful before you know the y-intercept.' },
        { term: 'x-intercept', definition: 'the point where a line crosses the x-axis, found by setting y = 0 and solving for x.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-point-slope',
      kind: 'worked_example',
      problem: 'A line has slope 4 and passes through the point (2, 5). Write its equation in slope-intercept form.',
      steps: [
        'Start from point-slope form: y − y₁ = m(x − x₁), using m = 4 and (x₁, y₁) = (2, 5).',
        'y − 5 = 4(x − 2) → y − 5 = 4x − 8.',
        'Add 5 to both sides: y = 4x − 3.',
        'Check: at x = 2, y = 4(2) − 3 = 5. ✓ Matches the given point.',
      ],
      answer: 'y = 4x − 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-perpendicular-standard-form',
      kind: 'worked_example',
      problem: 'Line k is given by 3x + 6y = 12. A line perpendicular to k passes through (0, 1). Write its equation in slope-intercept form.',
      steps: [
        'Find the slope of k. Solve for y: 6y = −3x + 12 → y = −(1/2)x + 2, so slope of k = −1/2. (Shortcut: for Ax + By = C, slope = −A/B = −3/6 = −1/2 — same answer without fully isolating y.)',
        'A perpendicular slope is the NEGATIVE RECIPROCAL: flip and negate −1/2 to get 2.',
        'The new line passes through (0, 1) — that point IS the y-intercept, so b = 1.',
        'Equation: y = 2x + 1.',
        'Check: slopes multiply to −1: (−1/2)(2) = −1. ✓ Perpendicular confirmed.',
      ],
      answer: 'y = 2x + 1',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-two-points',
      kind: 'try_yourself',
      problem: 'A line passes through (1, −2) and (3, 6). What is the slope of the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'm = 2' },
        { id: 'b', text: 'm = 4', correct: true },
        { id: 'c', text: 'm = 8' },
        { id: 'd', text: 'm = −4' },
      ],
      expectedAnswer: 'm = 4',
      hints: ['Use m = (y₂ − y₁) / (x₂ − x₁).', 'Watch the double negative: 6 − (−2) = 8, and 3 − 1 = 2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-context-intercept',
      kind: 'try_yourself',
      problem:
        'A moving company charges a flat fee plus a per-mile rate. The total cost in dollars for a move of m miles is C = 3.50m + 250. What does the value 250 represent in this context?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cost per mile the moving company charges' },
        { id: 'b', text: 'The flat fee charged regardless of how many miles are driven', correct: true },
        { id: 'c', text: 'The total number of miles moved' },
        { id: 'd', text: 'The total cost for a 250-mile move' },
      ],
      expectedAnswer: 'The flat fee charged regardless of how many miles are driven',
      hints: ['250 is the y-intercept — the value of C when m = 0.', 'What does "cost when zero miles are driven" mean in this context?'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): line p passes through (−2, 3) and is parallel to the line y = −3x + 7. What is the y-intercept of line p?',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'Parallel lines share slope, so line p also has slope −3.',
        'Use point-slope: y − 3 = −3(x − (−2)) → y = −3x − 6 + 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-standard-form-slope',
      kind: 'misconception_check',
      question: 'A student is asked for the slope of the line 4x + 2y = 10 and answers "slope = 2" by reading the coefficients as A/B. What went wrong?',
      commonErrors: [
        {
          answer: 'slope = 2',
          misconception: 'Using slope = A/B directly from standard form instead of −A/B.',
          correctsTo:
            'For Ax + By = C, the slope is −A/B, not A/B — rearranging toward y = mx + b flips a sign. Here slope = −4/2 = −2. Check by solving fully: 2y = −4x + 10 → y = −2x + 5, confirming slope = −2.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = mx + b: m is slope (rate of change), b is y-intercept (starting value); standard form gives slope as −A/B.',
        'Slope from two points: (y₂ − y₁)/(x₂ − x₁). Intercepts: set the OTHER variable to zero and solve.',
        'Parallel lines share slope; perpendicular slopes are negative reciprocals (product = −1).',
        'On graph-matching questions, check slope sign and steepness before the y-intercept — Desmos verifies any candidate instantly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Linear Equations in Two Variables & Their Graphs' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
