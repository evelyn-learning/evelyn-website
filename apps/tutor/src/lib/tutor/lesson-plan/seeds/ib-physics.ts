/**
 * IB DP Physics — anchor plan covering course shape, calculation
 * discipline, and the modelling habit IB Physics rewards.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_PHYSICS: LessonPlan = {
  id: 'evelyn.ibdp.physics.v1',
  title: 'IB Physics — course shape, modelling habits, calc discipline',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'science',
  topic: 'ib-physics',
  locale: 'en',
  los: [
    {
      id: 'ibdp.physics.overview',
      description: 'Map IB Physics assessment shape, the modelling-first habit IB rewards, and the calculation discipline that earns method marks.',
      standard: 'IB-DP-PHYS',
    },
  ],
  prerequisites: ['g912.science.physics-advanced'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB Physics is built around modelling — picking the right idealisation, defining variables, then computing.',
      script: 'School physics tends to give you a setup and ask "find x." IB Physics asks you first to MODEL the situation — what idealisations apply, what variables matter, what the limits of the model are — and only then to compute. Today we walk through that habit on a worked example and cover the assessment shape.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ib-phys',
      kind: 'concept',
      goal: 'Assessment, modelling cycle, calculation discipline, key threads, NoS.',
      keyIdeas: [
        'ASSESSMENT (2025+ syllabus): Paper 1 (multiple choice + data response — no calculator for 1A), Paper 2 (short + extended response, calculator), Internal Assessment (10-hour investigation, 20% grade).',
        'MODELLING CYCLE the course rewards: 1) idealise (treat as point mass? frictionless? assume small angle?), 2) draw a clear diagram with axes/forces/values, 3) write the governing equation, 4) substitute and solve, 5) interpret in context including model limits.',
        'CALCULATION DISCIPLINE: SI units throughout, sig figs match lowest input (typically 2-3 sf in IB), equation before substitution, dimensional analysis as a self-check.',
        'KEY THREADS: kinematics (1D + 2D, projectiles), dynamics (Newton\'s laws, momentum, energy conservation), oscillations & waves (SHM, wave speed, interference, standing waves, Doppler), thermal (kinetic theory, heat transfer, ideal gas), fields (gravitational, electric, magnetic), circuits (resistivity, EMF, internal resistance), atomic + nuclear (decay, half-life, fission/fusion, mass-energy).',
        'HL adds: rotational mechanics, fluids, electromagnetic induction, quantum + nuclear in greater depth.',
        'COMMAND TERMS to drill: STATE, DEFINE, DESCRIBE, DETERMINE (calculate using reasoning), DEDUCE (logical chain), SHOW THAT (start from given, reach result step-by-step), JUSTIFY.',
        'NATURE OF SCIENCE: theories vs models, role of EVIDENCE, falsifiability (Popper), HISTORY of mechanics (Aristotle → Galileo → Newton → Einstein), TECHNOLOGY enabling discovery (telescopes, particle accelerators, gravitational-wave detectors), social/ethical (nuclear, climate).',
        'GRAPHS: title, axes labelled with variable AND unit, error bars, gradient with units, intercept interpreted in context, line of best fit + treatment of outliers.',
      ],
      vocabulary: [
        { term: 'idealisation', definition: 'a simplifying assumption (point mass, frictionless surface, small-angle approximation) that makes a problem tractable; IB rewards explicit acknowledgement of the limits these create.' },
        { term: 'show that', definition: 'an IB command term requiring you to derive a given result step-by-step from stated premises; full working must be visible.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-projectile',
      kind: 'worked_example',
      problem: 'A ball is launched at 25 m/s at 40° above horizontal from ground level. Find the maximum height. Take g = 9.81 m/s².',
      steps: [
        'Step 1 — model: treat ball as point mass, ignore air resistance, gravity uniform downward at 9.81 m/s². Decompose motion into independent x (no acceleration) and y (acceleration -g) components.',
        'Step 2 — initial velocity components: u_x = 25 cos(40°) = 19.15 m/s; u_y = 25 sin(40°) = 16.07 m/s.',
        'Step 3 — at maximum height, vertical velocity = 0. Use v² = u² + 2as with v = 0, u = u_y, a = -g, s = h_max.',
        'Step 4 — substitute: 0 = (16.07)² + 2(-9.81)(h_max) → 0 = 258.2 − 19.62 h_max → h_max = 258.2 / 19.62 = 13.2 m (3 sf).',
        'Step 5 — interpret: max height ≈ 13 m above launch point. Reality check: the order of magnitude matches a thrown ball.',
        'Method marks: model assumptions stated, decomposition shown, equation chosen and substituted, sig figs respected, units throughout. Even a final-arithmetic slip costs only the last mark.',
      ],
      answer: '13.2 m above launch height',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Without doing arithmetic: if the ball were launched at the same speed but at 50° instead of 40°, how would the maximum height change? Why?',
      expectedAnswer: 'Higher. Maximum height depends on u_y² = (u sin θ)². sin(50°) > sin(40°), so u_y² is larger and h_max = u_y² / (2g) is larger. Concretely: sin(50°) ≈ 0.766 vs sin(40°) ≈ 0.643, so the height ratio is (0.766/0.643)² ≈ 1.42 — about 42% taller. Note: max RANGE (different question) peaks at 45°, not at 50°. Max height keeps growing with angle up to 90° (straight up).',
      responseFormat: 'free',
      hints: [
        'Max height depends on which component of initial velocity?',
        'How does sin θ behave between 0° and 90°?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-show-that',
      kind: 'misconception_check',
      question: 'A "show that" question gives you the result T = 2π√(L/g). A student writes the result, then verifies it by substituting numbers and checking. Why does this score zero?',
      commonErrors: [
        {
          answer: 'They wrote the result and checked it numerically',
          misconception: 'Treating "show that" as "verify with an example."',
          correctsTo: 'SHOW THAT requires DERIVATION from stated premises to the given result, step-by-step. For T = 2π√(L/g) of a simple pendulum, you would: (1) start from F_restoring = -mg sinθ ≈ -mgθ for small θ, (2) write the SHM equation m(d²x/dt²) = -mgθ with x = Lθ, (3) recognise SHM form with ω² = g/L, (4) use T = 2π/ω → T = 2π√(L/g). Numerical verification proves nothing about the general formula. Show-that questions test your ability to construct the chain — and the marks live in each visible step.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Always model first: idealisations, diagram, variables, equation, solve, interpret.',
        'Units throughout, sig figs match lowest input.',
        '"Show that" needs derivation, not numerical verification.',
        'Decompose 2D motion into independent x and y components.',
        'NoS history + technology + ethics earns marks across topics.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
