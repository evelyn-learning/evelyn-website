/**
 * College General Physics — Newtonian Mechanics Survey.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENPHYS_MECHANICS: LessonPlan = {
  id: 'evelyn.college.sci.genphys.mechanics.v1',
  title: 'General Physics I — Newtonian Mechanics Survey',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-physics',
  locale: 'en',
  los: [
    {
      id: 'college.sci.genphys.mechanics',
      description: 'Apply Newton\'s laws, conservation of energy, and conservation of momentum to one- and two-dimensional mechanics problems.',
      standard: 'COLLEGE-GENPHYS',
    },
  ],
  prerequisites: [],
  followUps: ['college.sci.genphys.em'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mechanics is two questions: forces predict acceleration; conservation laws predict outcomes without tracking the details.',
      script: 'Throw a ball, slide a block, collide two carts — all of mechanics decomposes into "what are the forces" (Newton) or "what is conserved" (energy, momentum). Knowing when to use which approach is half the skill. Today: a survey + decision framework.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mechanics',
      kind: 'concept',
      goal: 'Newton\'s laws, energy conservation, momentum conservation, when to use which.',
      keyIdeas: [
        'NEWTON\'S LAWS:',
        '  N1 (Inertia): an object at rest stays at rest, in motion stays in motion, unless acted on by a NET force.',
        '  N2: F_net = ma. The most-used equation in mechanics.',
        '  N3: every action has an equal and opposite reaction.',
        'FREE-BODY DIAGRAMS: identify EVERY force on the object — gravity, normal, friction, tension, applied. Sum vectorially. Apply F = ma in each direction.',
        'WORK-ENERGY THEOREM: W_net = ΔKE = (1/2)m v² − (1/2)m v₀². Useful when you care about speed at a position, not time of arrival.',
        'CONSERVATION OF ENERGY: in absence of non-conservative forces (friction), KE + PE = constant. PE_gravity = mgh; PE_spring = (1/2)kx².',
        'CONSERVATION OF MOMENTUM: in absence of external forces, p_total = Σ m_i v_i is conserved. Critical for collision problems.',
        'COLLISION TYPES:',
        '  ELASTIC: KE and momentum BOTH conserved. Often need to solve simultaneous equations.',
        '  INELASTIC: momentum conserved; KE NOT conserved (lost as heat / deformation).',
        '  PERFECTLY INELASTIC: objects stick together; momentum conserved, KE maximally lost.',
        'WHEN TO USE WHICH:',
        '  Need force / acceleration / time? → Newton\'s laws.',
        '  Need speed at a position (with no friction)? → Energy conservation (faster, no need to track forces).',
        '  Collision / explosion? → Momentum conservation.',
      ],
      vocabulary: [
        { term: 'free-body diagram', definition: 'a diagram showing every force acting on a single object as labeled vectors; the starting point of every Newton problem.' },
        { term: 'conservation law', definition: 'a quantity that doesn\'t change over time when certain conditions are met (energy, momentum, charge, etc.).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A 5 kg block slides down a frictionless incline of height 2 m. Find its speed at the bottom. Then redo with kinetic friction μ = 0.2 over a 4 m incline length.',
      steps: [
        'Frictionless: use energy conservation. mgh = (1/2)mv². Mass cancels.',
        'v = √(2gh) = √(2 × 9.81 × 2) ≈ 6.26 m/s.',
        'With friction: total mechanical energy is NOT conserved. Use work-energy theorem.',
        'W_net = W_gravity + W_friction = mgh + (−μ m g cosθ × L).',
        'Need θ from triangle: sinθ = 2/4 = 0.5 ⟹ θ = 30°. cos30° ≈ 0.866.',
        'W_net = 5(9.81)(2) − 0.2(5)(9.81)(0.866)(4) = 98.1 − 33.97 ≈ 64.1 J.',
        'KE at bottom = W_net = 64.1 J. v = √(2 × 64.1 / 5) ≈ 5.06 m/s. Slower than frictionless, as expected.',
      ],
      answer: 'Frictionless: 6.26 m/s. With friction (μ = 0.2): ≈ 5.06 m/s.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two carts on a frictionless track collide and STICK together. Cart A: 2 kg at 3 m/s. Cart B: 4 kg at rest. Find their final speed.',
      expectedAnswer: 'Perfectly inelastic ⟹ momentum conserved. p_initial = (2)(3) + (4)(0) = 6 kg·m/s. p_final = (m_A + m_B) v_f = 6 v_f. v_f = 1 m/s.',
      responseFormat: 'numeric',
      hints: [
        'Stick together = perfectly inelastic. Momentum conserved.',
        'KE is not conserved here.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-energy-vs-momentum',
      kind: 'misconception_check',
      question: 'A student tries to use energy conservation for a perfectly inelastic collision and gets a wrong answer. Why?',
      commonErrors: [
        {
          answer: 'Energy conservation in inelastic collision',
          misconception: 'Treating all collisions as elastic.',
          correctsTo: 'In INELASTIC collisions, KE is NOT conserved (some converts to heat, sound, deformation). MOMENTUM is always conserved (in absence of external forces). Always use MOMENTUM for collision problems unless explicitly told elastic. After finding final velocity from momentum, you can compute energy LOST as KE_initial − KE_final.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = ma is the workhorse; draw free-body diagrams.',
        'Energy conservation when no friction; faster when applicable.',
        'Momentum conservation for collisions (always).',
        'Inelastic: momentum yes, KE no. Elastic: both.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
