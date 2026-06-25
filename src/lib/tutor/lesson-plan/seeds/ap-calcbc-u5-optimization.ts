/**
 * AP Calculus BC — CED Unit 5.10-5.11: Optimization Problems
 * (introduction to optimization and solving optimization problems).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U5_OPTIMIZATION: LessonPlan = {
  id: 'evelyn.ap.calcbc.optimization.v1',
  title: 'U5.10 Optimization Problems',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.optimization',
      description:
        'Solve real-world optimization problems by identifying the quantity to optimize, expressing it as a function of a single variable using a constraint, and finding the extremum via critical points.',
      standard: 'AP-CALCBC-5.10-5.11',
    },
  ],
  prerequisites: ['apcalcbc.graphing-f-fp-fpp'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook', kind: 'hook',
      goal: 'Frame optimization as a recipe: maximize/minimize → find critical points.',
      script: "Optimization problems give you a real-world scenario — \"build the largest pen with X feet of fence\", \"minimize cost\" — and ask for the optimal value. The recipe: name variables, write the objective, use constraint to reduce to one variable, find critical points, verify with first or second derivative test.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-recipe', kind: 'concept',
      goal: 'Cover the optimization recipe + standard problem types.',
      keyIdeas: [
        'OPTIMIZATION RECIPE:',
        '(1) IDENTIFY what to optimize (the OBJECTIVE: maximize area, minimize cost, etc.).',
        '(2) NAME variables and DRAW a picture if geometric.',
        '(3) WRITE the objective function in terms of the variables.',
        '(4) USE THE CONSTRAINT to express objective as a function of ONE variable.',
        '(5) DETERMINE the DOMAIN (physically meaningful range of the variable).',
        '(6) FIND CRITICAL POINTS by setting derivative = 0.',
        '(7) USE first or second derivative test, OR candidates test on a closed interval, to identify the optimum.',
        '(8) Answer the question (often asks for the optimal x AND the optimal objective value).',
        'STANDARD PROBLEM TYPES:',
        'AREA WITH FIXED PERIMETER: maximize rectangle area given P. Constraint: 2L + 2W = P. Objective: A = LW. Use constraint to eliminate one variable.',
        'VOLUME OF A BOX (closed/open): maximize V given fixed surface area, or minimize surface area given fixed V.',
        'MINIMIZE DISTANCE: minimize distance from a point to a curve. Often easier to minimize squared distance (no √, easier derivative).',
        'PROFIT / REVENUE / COST: maximize profit = revenue − cost. Critical points where dP/dx = 0.',
        'OPEN-TOP CYLINDER: minimize material (surface area = πr² + 2πrh) for fixed volume (V = πr²h).',
        'CHECK PHYSICAL FEASIBILITY: variables must be ≥ 0 (lengths, volumes, etc.). Sometimes the optimum lies on a domain boundary, not a critical point.',
      ],
      vocabulary: [
        { term: 'objective function', definition: 'the quantity being maximized or minimized.' },
        { term: 'constraint', definition: 'an equation relating the variables, used to reduce the objective to one variable.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rectangle', kind: 'worked_example',
      problem: 'Find the dimensions of the rectangle with the LARGEST AREA that can be inscribed in a semicircle of radius 5, with the rectangle\'s base on the diameter.',
      steps: [
        'STEP 1 — IDENTIFY. Maximize area A. Variables: half-base x (horizontal half-width), height h. The rectangle has full base 2x and height h.',
        'STEP 2 — OBJECTIVE. A = 2x · h.',
        'STEP 3 — CONSTRAINT. The corner of the rectangle (x, h) lies on the semicircle: x² + h² = 25. So h = √(25 − x²).',
        'STEP 4 — REDUCE TO ONE VARIABLE. A(x) = 2x · √(25 − x²). Domain: 0 ≤ x ≤ 5.',
        'STEP 5 — DIFFERENTIATE. A\'(x) = 2√(25 − x²) + 2x · (1/2)(25 − x²)^(-1/2) · (-2x) = 2√(25 − x²) − 2x²/√(25 − x²) = [2(25 − x²) − 2x²]/√(25 − x²) = (50 − 4x²)/√(25 − x²).',
        'STEP 6 — CRITICAL POINTS. A\' = 0 when 50 − 4x² = 0, so x² = 12.5, x = √12.5 = 5/√2.',
        'STEP 7 — VERIFY MAX. Endpoints: A(0) = 0; A(5) = 0. Critical point: A(5/√2) = 2·(5/√2)·√(25 − 12.5) = (10/√2)·√12.5 = (10/√2)·(5/√2) = 50/2 = 25. So MAX area = 25 at x = 5/√2.',
        'STEP 8 — DIMENSIONS. Half-base x = 5/√2 → full base = 10/√2 = 5√2. Height h = √(25 − 12.5) = √12.5 = 5/√2.',
      ],
      answer: 'Base = 5√2, Height = 5/√2. Maximum area = 25.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-area', kind: 'try_yourself',
      problem: 'A farmer has 200 ft of fencing to enclose a rectangular field along a river (no fence needed on the river side). Find the dimensions that maximize the area.',
      expectedAnswer: 'Let x = depth perpendicular to river, y = length parallel to river. Constraint: 2x + y = 200 (only 3 sides need fence). y = 200 − 2x. Objective: A = xy = x(200 − 2x) = 200x − 2x². Domain: 0 ≤ x ≤ 100. A\'(x) = 200 − 4x. Set A\' = 0: x = 50. Verify max: A\'\'(x) = -4 < 0 → concave down, max. y = 200 − 100 = 100. Area = 50 · 100 = 5000 sq ft.',
      responseFormat: 'numeric',
      hints: ['Set up constraint with only 3 sides fenced. Substitute, differentiate, find critical point.'],
      estimatedMinutes: 5,
    },
    {
      id: 'try-cylinder', kind: 'try_yourself',
      problem: 'AP-style synthesis. Find the dimensions of the cylindrical can with FIXED VOLUME 1000 cm³ that minimizes surface area (closed cylinder; SA = 2πr² + 2πrh).',
      expectedAnswer: 'Constraint: V = πr²h = 1000 → h = 1000/(πr²). Objective: SA = 2πr² + 2πrh. Substitute: SA(r) = 2πr² + 2πr · (1000/(πr²)) = 2πr² + 2000/r. Differentiate: SA\'(r) = 4πr − 2000/r². Set SA\' = 0: 4πr = 2000/r² → 4πr³ = 2000 → r³ = 500/π → r = (500/π)^(1/3) ≈ 5.42 cm. h = 1000/(πr²) ≈ 10.84 cm. NOTE: h ≈ 2r — the optimal can has height equal to the diameter, a result that holds for any closed-cylinder volume. Verify with SA\'\' > 0 (concave up, minimum). Strong answers: setup, substitution, differentiation, critical point, observation that h = 2r.',
      responseFormat: 'frq',
      hints: ['Express SA in r alone using V = πr²h = 1000. Differentiate, find critical point. Note h vs r relationship.'],
      estimatedMinutes: 6,
    },
    {
      id: 'recap', kind: 'recap',
      mustRemember: [
        'Recipe: objective + constraint → 1-variable function → critical points → verify min/max.',
        'Always check domain (physical feasibility) and endpoints.',
        'Distance: minimize squared distance (avoids √).',
        'Closed cylinder: optimal h = 2r.',
        'Verify max/min with first or second derivative test.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5', cedTopic: '5.10-5.11', cedTitle: 'Optimization Problems',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard optimization recipe.' }],
  },
};
