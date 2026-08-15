/**
 * College Intro — General Physics (Physics I overview, algebra-based).
 *
 * Kinematics, Newton's laws, energy/work, momentum, circular motion.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENERAL_PHYSICS: LessonPlan = {
  id: 'evelyn.college.general-physics.v1',
  title: 'General physics I — kinematics, dynamics, energy, momentum',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-physics',
  locale: 'en',
  los: [
    {
      id: 'college.physics1',
      description: 'Solve mechanics problems using kinematics, Newton\'s laws, and energy/momentum conservation.',
      standard: 'COLLEGE-PHYS-1',
    },
  ],
  prerequisites: ['hsphys.anchors'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Physics I as conservation laws + free-body diagrams + a few formulas.',
      script: 'College Physics I solves more problems than HS but with the same toolkit. The skill is choosing the right approach: kinematics gives position/velocity, Newton gives forces, energy gives speeds without time, momentum gives interactions. Choosing right is half the problem.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mechanics',
      kind: 'concept',
      goal: 'Five toolkits and when to use each.',
      keyIdeas: [
        'KINEMATICS (uniform a): v = v₀ + at, x = x₀ + v₀t + ½at², v² = v₀² + 2aΔx. Use when forces give constant a and you need x, v, or t.',
        'NEWTON\'S 2nd: ΣF = ma. Always start with a free-body diagram. Sum forces along each axis.',
        'ENERGY: KE = ½mv², PE = mgh, W = F·d·cosθ. Conservation: KE + PE = constant if no friction. Use when you don\'t need time.',
        'MOMENTUM: p = mv. Conserved in collisions. Elastic (KE conserved too) vs inelastic (KE lost as heat / deformation).',
        'CIRCULAR MOTION: a_c = v²/r toward center. Net force toward center = m·v²/r.',
        'FRICTION: f = μN. Static (up to μ_s N) vs kinetic (μ_k N). Friction is a force; goes in the FBD.',
        'STRATEGY: Forces → FBD + Newton. Speeds + heights + no time → energy. Collisions → momentum. Constant accel → kinematics.',
      ],
      vocabulary: [
        { term: 'free-body diagram', definition: 'a sketch of an object with all forces acting on it as arrows.' },
        { term: 'elastic collision', definition: 'a collision where total kinetic energy is conserved as well as momentum.' },
        { term: 'centripetal acceleration', definition: 'the inward acceleration required to maintain circular motion.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-incline',
      kind: 'worked_example',
      problem: 'A 5 kg block on a frictionless 30° incline. Find its acceleration down the slope.',
      steps: [
        'Forces on block: gravity (mg down) + normal (perpendicular to surface).',
        'Decompose gravity along slope (parallel) and perpendicular: g_∥ = g sin30° = 4.9 m/s², g_⊥ = g cos30°.',
        'Along the slope (no friction): ΣF = mg sinθ. Newton: a = g sinθ = 9.8 × 0.5 = 4.9 m/s².',
        'Mass cancels — all blocks accelerate at the same rate down the same incline (no friction).',
      ],
      answer: 'a = g sinθ ≈ 4.9 m/s² down the slope.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A car moving at 20 m/s skids to a stop over 50 m. What\'s the magnitude of average deceleration? Which toolkit fits?',
      expectedAnswer: 'kinematics: v² = v₀² + 2aΔx → 0 = 400 + 2a(50) → a = -4 m/s²; magnitude 4 m/s²',
      responseFormat: 'free',
      hints: [
        'You have v, v₀, and Δx; you don\'t need t.',
        'Pick the kinematic equation that excludes t.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-circular',
      kind: 'misconception_check',
      question: 'A car rounds a curve at constant speed. A student says: "No net force — speed isn\'t changing." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because constant speed',
          misconception: 'Confusing speed (scalar) with velocity (vector).',
          correctsTo: 'Speed is constant; velocity is NOT (direction changes). Acceleration = change in velocity, so circular motion at constant speed has nonzero centripetal acceleration toward the center. By Newton\'s 2nd, there must be a net inward force — friction from the road, in this case. No net force = straight line at constant velocity, NOT a curve.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pick toolkit by what\'s given/asked.',
        'Free-body diagram is mandatory for force problems.',
        'Energy when no time. Momentum for collisions. Kinematics for constant a.',
        'Circular motion: a_c = v²/r INWARD; need a real inward force.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In a perfectly inelastic collision, KE is lost. Where does the energy go?',
      hint: 'Heat (most of it), sound, deformation (permanent crumpling), light (very little). Macroscopically, the colliding objects warm up and deform. Microscopically, organized kinetic energy of bulk motion converts to disorganized kinetic energy of molecular vibration. Momentum is conserved because momentum is a vector sum across all particles; energy "loss" only means transformed to non-kinetic forms.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
