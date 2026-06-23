/**
 * JEE — Physics subject-specific strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYSICS_STRATEGY: LessonPlan = {
  id: 'evelyn.jee.physics.strategy.v1',
  title: 'JEE Physics strategy',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'test-prep',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.physics-strategy',
      description: 'Apply subject-specific strategy to JEE Physics: high-yield topics, problem-solving frameworks, NCERT vs reference books, and time-saving tricks.',
      standard: 'JEE-PHY',
    },
  ],
  prerequisites: [],
  followUps: ['jee.rotational-mechanics'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Physics is the JEE topic with the highest skill ceiling.',
      script: 'JEE Physics rewards CONCEPTUAL CLARITY more than any other subject. Students who memorize formulas without understanding fail; students who understand fundamentals can derive any formula they forget. The JEE physics question is rarely a plug-and-chug — it asks you to FRAME the situation, decide WHICH principles apply, and execute. Mastery here is what separates good from great rankers.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'High-yield topics, frameworks, books, time-savers.',
      keyIdeas: [
        'HIGH-YIELD TOPICS (most weighted): MECHANICS (kinematics, Newton\'s laws, work-energy, rotational mechanics, gravitation, fluids, SHM, waves), ELECTROMAGNETISM (Coulomb, electric field, capacitance, current electricity, magnetism, EMI, AC), MODERN PHYSICS (photoelectric, atom, nuclei, semiconductors), THERMODYNAMICS, OPTICS.',
        'FRAMEWORK FOR EVERY PROBLEM: 1) DRAW the situation. 2) IDENTIFY the system + relevant forces / fields / energies. 3) APPLY conservation laws / Newton\'s laws / equations of motion. 4) SOLVE the resulting equations. 5) CHECK units and limits.',
        'CONSERVATION LAWS save time: energy, momentum, angular momentum. Use them when they apply BEFORE pulling out kinematics.',
        'NCERT FOR THEORY: NCERT Class 11 + 12 physics is the foundation. Read every chapter, understand the derivations.',
        'REFERENCE BOOKS for problems: HC Verma "Concepts of Physics" (must-do for understanding). Irodov for advanced. DC Pandey for JEE-specific.',
        'TIME-SAVING TRICKS: dimensional analysis catches wrong formulas. Symmetry reduces problems (charge configurations). Limits (small angle, slow speed, infinite distance) often simplify.',
        'COMMON TRAPS: confusing inertial vs non-inertial frames, ignoring friction direction, forgetting normal force changes on inclines, sign errors in EMF.',
        'PHYSICS-CHEMISTRY-MATH split: physics often takes the most time per question. In Main, budget ~70-80 min for physics out of 180.',
        'JEE ADVANCED PHYSICS often features multi-step problems combining mechanics + thermodynamics + electromagnetism. Cross-topic practice essential.',
      ],
      vocabulary: [
        { term: 'inertial frame', definition: 'a reference frame in which Newton\'s laws hold without pseudo-forces.' },
        { term: 'symmetry argument', definition: 'using the geometry of a problem to deduce field/force directions without computation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-conservation',
      kind: 'worked_example',
      problem: 'A block slides down a frictionless incline of height h, then collides inelastically with a block of equal mass at rest. Find the final velocity. Use conservation laws.',
      steps: [
        'STAGE 1 (down the incline): Energy conservation. mgh = ½mv² → v = √(2gh).',
        'STAGE 2 (collision): Momentum conservation (inelastic — they stick). mv = (m + m)·v_f → v_f = v/2 = √(2gh)/2.',
        'CHECK: in inelastic collision, KE is lost. KE_initial = ½mv² = mgh. KE_final = ½(2m)·(v/2)² = ¼mv² = mgh/2. Half the KE lost — consistent.',
        'KEY INSIGHT: NEVER use kinematics on the incline (would need to find acceleration along slope, then time, then velocity — all extra work). Energy conservation is one step.',
      ],
      answer: 'v_f = √(2gh) / 2 = (1/2)√(2gh).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is dimensional analysis a useful first check on any JEE physics formula you derive?',
      expectedAnswer: 'If the units don\'t match (e.g., the LHS is meters but the RHS is meters/second²), the formula is wrong. Dimensional analysis won\'t catch a wrong factor of 2 or a sign error, but it catches sign-of-magnitude mistakes that might pass a quick review. 30 seconds spent verifying dimensions can save 5 minutes on a wrong path.',
      responseFormat: 'free',
      hints: [
        'What kinds of errors does dimensional analysis catch?',
        'How fast is it to verify?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-formulas-only',
      kind: 'misconception_check',
      question: 'Is JEE Physics primarily about MEMORIZING formulas?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating physics as a plug-and-chug subject.',
          correctsTo: 'No — JEE Physics rewards UNDERSTANDING. Many problems require you to FRAME the situation correctly (often non-obvious), CHOOSE among multiple applicable laws, and integrate concepts across topics. A student who memorizes 100 formulas without understanding will fail to recognize which apply. A student who understands principles can DERIVE the formula they need on the spot. Top rankers know fewer formulas than average students but apply them deeper.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Frame the problem first: draw, identify, apply, solve, check.',
        'Conservation laws (energy, momentum, angular momentum) save time.',
        'NCERT for theory; HC Verma for problems.',
        'Dimensional analysis catches gross errors. Symmetry simplifies fields.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are PHASE-SPACE diagrams (position vs velocity, or charge vs current) sometimes more illuminating than time-series plots for JEE problems?',
      hint: 'Phase space shows the trajectory of the system as a closed curve for periodic motion (SHM, LC circuits) or attractor for damped systems. Hidden symmetries become obvious. JEE Advanced sometimes asks subtle questions about energy or amplitude that are easier to see in phase space than in plain x(t) plots.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
