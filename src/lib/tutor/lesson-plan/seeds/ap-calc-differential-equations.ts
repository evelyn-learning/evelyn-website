/**
 * AP Calculus AB — Unit 7: Differential Equations.
 *
 * Slope fields, separable equations, exponential growth/decay, particular solutions
 * with initial conditions. Recurring AB FRQ topic.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_DIFFERENTIAL_EQUATIONS: LessonPlan = {
  id: 'evelyn.ap.calc.differential-equations.v1',
  title: 'AP Calc AB — Unit 7: Differential Equations + Slope Fields',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ap.calc.differential-equations',
      description: 'Solve separable differential equations, sketch slope fields and use them to predict solution behavior, find particular solutions from initial conditions, and apply exponential growth/decay models.',
      standard: 'AP-CALC-AB-7',
    },
  ],
  prerequisites: ['ap.calc.curve-sketching'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Differential equations show up every year on AB FRQs.',
      script: 'Unit 7 — differential equations — is one of the most predictable AP Calc AB topics. Almost every recent FRQ section has at least one ODE question, often combining slope fields + separable solving + particular-solution-with-initial-condition. The mechanics are mechanical once you recognize the pattern. Master the three-step "separate, integrate, solve for constant" routine, plus slope-field reading, and these become reliable points.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-slope-fields',
      kind: 'concept',
      goal: 'Slope fields — visual representation of dy/dx.',
      keyIdeas: [
        'SLOPE FIELD: a grid of short tangent-line segments. At each grid point (x, y), draw a small segment with slope equal to dy/dx evaluated at (x,y).',
        'INTERPRETATION: solution curves to the ODE follow the segment directions. Pick a starting point and "trace" the field to sketch a particular solution.',
        'AP MCQ pattern: given a slope field, identify the matching ODE. Strategy — pick a few easy points (axes, integers) and compute dy/dx for each candidate ODE. Match against the field.',
        'COMMON CHARACTERISTICS to look for:',
        '  Horizontal segments (slope = 0): dy/dx = 0 — happens where the formula RHS equals 0.',
        '  Vertical segments (slope undefined): dy/dx → ∞ — happens where the denominator → 0.',
        '  Symmetric pattern about an axis: dy/dx is even/odd in x or y.',
        '  Same slope on horizontal lines (rows): dy/dx depends only on y, not x.',
        '  Same slope on vertical lines (columns): dy/dx depends only on x, not y.',
        'EQUILIBRIUM SOLUTIONS: constant functions y = c where dy/dx = 0. Found by setting RHS = 0 and solving for y.',
        'SLOPE FIELDS show GENERAL solution behavior — NOT just one particular solution. Used for qualitative reasoning when an ODE can\'t be solved analytically (e.g., Euler\'s method on BC, but on AB the slope field intuition is the key takeaway).',
      ],
      vocabulary: [
        { term: 'slope field', definition: 'a graphical representation of an ODE: short tangent segments at each grid point with slope equal to dy/dx at that point.' },
        { term: 'equilibrium solution', definition: 'a constant solution y = c to an ODE where dy/dx = 0 for all x; horizontal line in the slope field.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-separable',
      kind: 'concept',
      goal: 'Separable equations — three-step solution.',
      keyIdeas: [
        'SEPARABLE ODE: dy/dx = f(x)·g(y). Variables can be SEPARATED to opposite sides.',
        'STEP 1 — separate: rewrite as g(y)⁻¹ dy = f(x) dx. Note: g(y)⁻¹ means 1/g(y). Multiply both sides accordingly.',
        'STEP 2 — integrate both sides: ∫ g(y)⁻¹ dy = ∫ f(x) dx. The +C constant goes on ONE SIDE (typically the x side; combining constants from both sides gives one C overall).',
        'STEP 3 — solve for y if asked. May give EXPLICIT y = (function of x) or IMPLICIT (y appears inside the equation).',
        'INITIAL CONDITION: when given y(x₀) = y₀, plug into the general solution to find C.',
        'EXAMPLE — exponential growth: dy/dt = ky. Separate: dy/y = k dt. Integrate: ln|y| = kt + C. Solve: y = e^(kt+C) = A·e^(kt) where A = e^C. With initial condition y(0) = y₀: A = y₀. Final: y = y₀·e^(kt).',
        'COMMON ERRORS:',
        '  Forgetting the absolute value on ln|y|. Often resolved when exponentiating + absorbing sign into A.',
        '  Forgetting the + C. AP graders deduct points reliably for this.',
        '  Solving for C BEFORE checking that the initial condition is in the domain (e.g., not at a singularity).',
      ],
      vocabulary: [
        { term: 'separable differential equation', definition: 'an ODE of form dy/dx = f(x)·g(y) where x and y can be separated to opposite sides for integration.' },
        { term: 'particular solution', definition: 'a specific solution to an ODE determined by an initial condition; one curve from the family of general solutions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-growth-decay',
      kind: 'concept',
      goal: 'Exponential models + applications.',
      keyIdeas: [
        'EXPONENTIAL GROWTH/DECAY ODE: dy/dt = ky. Solution y(t) = y₀·e^(kt). k > 0 → growth. k < 0 → decay.',
        'DOUBLING TIME (k > 0): time for population to double. Set y = 2y₀: 2 = e^(kt) → t = ln(2)/k.',
        'HALF-LIFE (k < 0): time for quantity to halve. Set y = y₀/2: 1/2 = e^(kt) → t = −ln(2)/k = ln(2)/|k|.',
        'NEWTON\'S LAW OF COOLING: dT/dt = −k·(T − T_env). Solution: T(t) = T_env + (T₀ − T_env)·e^(−kt). Object\'s temperature exponentially approaches the environment temperature.',
        'LOGISTIC GROWTH (BC topic but conceptually mentioned): dP/dt = kP(1 − P/M). Population grows exponentially when small, levels off at carrying capacity M. AB doesn\'t solve logistic ODEs analytically, but slope-field reasoning + interpretation can appear.',
        'AP TYPICAL FRQ STRUCTURE: (a) sketch slope field at given grid points; (b) describe behavior of solutions; (c) solve the ODE for particular solution given initial condition; (d) use solution to answer applied question (e.g., when does y reach a specific value).',
        'GRADER LOOKS FOR:',
        '  Show the SEPARATION step explicitly.',
        '  Show + C in indefinite integral.',
        '  Apply initial condition to solve for C.',
        '  State the particular solution clearly.',
      ],
      vocabulary: [
        { term: 'exponential growth model', definition: 'y(t) = y₀·e^(kt) with k > 0; arises whenever rate of change is proportional to current value.' },
        { term: 'half-life', definition: 'time for an exponentially decaying quantity to drop to half; t = ln(2)/|k|.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-separable',
      kind: 'worked_example',
      problem: 'Solve dy/dx = xy with initial condition y(0) = 3.',
      steps: [
        'STEP 1 — separate: dy/y = x dx. (Divide both sides by y, multiply both by dx.)',
        'STEP 2 — integrate both sides: ∫ (1/y) dy = ∫ x dx → ln|y| = x²/2 + C.',
        'STEP 3 — exponentiate to solve for y: |y| = e^(x²/2 + C) = e^C · e^(x²/2). Let A = ±e^C (so A can be positive, negative, or zero); y = A·e^(x²/2).',
        'STEP 4 — apply initial condition y(0) = 3: 3 = A·e^0 = A. So A = 3.',
        'STEP 5 — particular solution: y = 3·e^(x²/2).',
        'CHECK by differentiating: dy/dx = 3·e^(x²/2)·x = x·(3·e^(x²/2)) = x·y. ✓ Matches the original ODE.',
      ],
      answer: 'y = 3·e^(x²/2)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A radioactive substance has half-life 5 years. If 100 grams are present initially, find the mass after 12 years.',
      expectedAnswer: '~18.95 grams. Half-life relation: t = ln(2)/|k| → 5 = ln(2)/|k| → |k| = ln(2)/5 ≈ 0.1386. Decay model: m(t) = 100·e^(−0.1386·t). At t = 12: m = 100·e^(−1.6635) ≈ 100·0.1895 ≈ 18.95 grams. (Alternative: 100·(1/2)^(12/5) = 100·(1/2)^2.4 ≈ 100·0.1895 ≈ 18.95.)',
      responseFormat: 'numeric',
      hints: [
        'Half-life formula: t_(1/2) = ln(2)/|k|.',
        'Or use m(t) = 100·(1/2)^(t/t_(1/2)).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-particular-vs-general',
      kind: 'misconception_check',
      question: 'When solving a separable ODE without an initial condition, you can omit the +C since it doesn\'t affect the solution\'s form. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Skipping +C as a "minor detail."',
          correctsTo: 'False. The +C represents a FAMILY of solutions, not a single solution. Without it, you have ONE SPECIFIC solution that misses every other valid solution. AP scoring routinely DEDUCTS points for missing +C even on FRQs that don\'t have an initial condition. The correct general solution includes +C; only when given an initial condition do you SOLVE for C and substitute. Procedurally: ALWAYS write +C after the integral; for a particular-solution problem, plug in the initial condition AT THE INTEGRATED STAGE before exponentiating, to find C cleanly. This is the single most common point-loser on differential-equation FRQs.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slope field: tangent segments at each grid point, slope = dy/dx; trace solution curves.',
        'Separable ODE three-step: separate → integrate (+C) → solve for C with initial condition.',
        'dy/dt = ky → y = y₀·e^(kt). Doubling time = ln(2)/k. Half-life = ln(2)/|k|.',
        'Newton\'s cooling: dT/dt = −k(T − T_env) → T(t) = T_env + (T₀ − T_env)e^(−kt).',
        'AP graders check: separation shown, +C shown, initial condition applied to solve for C, final solution stated.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the differential equation dy/dx = y have infinitely many solutions, but adding the initial condition y(0) = 3 gives exactly ONE solution?',
      hint: 'dy/dx = y is a FIRST-ORDER ODE. By the existence-and-uniqueness theorem (which AP doesn\'t state explicitly but uses), if dy/dx = f(x,y) is "nice" (continuous + differentiable in y), then through any point (x₀, y₀) there passes EXACTLY ONE solution curve. Without an initial condition, you have a family of solutions {y = Ae^x : A ∈ ℝ} — infinitely many, parameterized by A. Adding y(0) = 3 picks out exactly the curve passing through (0, 3): A = 3, so y = 3e^x. The initial condition COLLAPSES the family to a single curve. Geometrically on the slope field: every grid point has a unique tangent direction, so a starting point determines a unique trajectory through the field. AP often hints at this idea ("identify the particular solution to dy/dx = y satisfying y(0) = 3") without naming the existence-uniqueness theorem.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
