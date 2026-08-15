/**
 * AP Physics 1 — Rotational Motion.
 *
 * Angular kinematics, torque, moment of inertia, rotational analog of Newton's 2nd law,
 * rotational kinetic energy, conservation of angular momentum.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_ROTATION: LessonPlan = {
  id: 'evelyn.ap.physics1.rotation.v1',
  title: 'Rotational Motion and Angular Momentum',
  curriculum: 'NGSS',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.rotation',
      description: 'Apply rotational analogs of force, mass, and momentum (torque, moment of inertia, angular momentum) and use conservation of angular momentum.',
      standard: 'AP-PHYS1-7.A',
    },
  ],
  prerequisites: ['apphys1.newtons-second', 'apphys1.momentum'],
  followUps: ['apphys1.shm'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Rotation as a parallel universe to translation.',
      script: 'Almost everything you know about straight-line motion has a rotational twin. Force becomes torque. Mass becomes moment of inertia. Velocity becomes angular velocity. Pair them up and rotation is just translation in a circle. The famous demo: an ice skater pulls in their arms and spins faster — that\'s conservation of angular momentum at work.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-analogs',
      kind: 'concept',
      goal: 'The translation ↔ rotation dictionary.',
      keyIdeas: [
        'POSITION x ↔ angle θ (radians). VELOCITY v ↔ angular velocity ω. ACCELERATION a ↔ angular acceleration α.',
        'MASS m ↔ MOMENT OF INERTIA I. I depends on shape AND axis. Common: I_disk = 0.5·m·r², I_hoop = m·r², I_solid_sphere = 0.4·m·r².',
        'FORCE F ↔ TORQUE τ = r·F·sin θ. r is distance from pivot to where force applies; θ is angle between r and F.',
        'NEWTON\'S 2ND: F = ma  ↔  Στ = I·α.',
        'KINETIC ENERGY: 0.5·m·v²  ↔  0.5·I·ω². For rolling without slipping: total KE = translational + rotational.',
        'MOMENTUM p = m·v  ↔  ANGULAR MOMENTUM L = I·ω. Conserved when no external torque acts.',
        'ROLLING WITHOUT SLIPPING: v = r·ω. The contact point is instantaneously at rest.',
      ],
      vocabulary: [
        { term: 'torque', definition: 'rotational equivalent of force; product of force and lever arm.' },
        { term: 'moment of inertia', definition: 'rotational equivalent of mass; resistance to angular acceleration.' },
        { term: 'angular momentum', definition: 'L = I·ω; conserved when no external torque acts.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-skater',
      kind: 'worked_example',
      problem: 'A figure skater spinning at 2 rad/s with arms out (I = 6 kg·m²) pulls her arms in to reduce her moment of inertia to 2 kg·m². Find her new angular velocity.',
      steps: [
        'No external torque (frictionless ice, internal pulling). Angular momentum conserved.',
        'L_initial = I_i · ω_i = 6 · 2 = 12 kg·m²/s.',
        'L_final = I_f · ω_f = 2 · ω_f.',
        'Conservation: 12 = 2·ω_f → ω_f = 6 rad/s.',
        'KE check: KE_i = 0.5·6·4 = 12 J. KE_f = 0.5·2·36 = 36 J. KE INCREASED — the skater did work pulling arms in.',
      ],
      answer: 'ω_f = 6 rad/s (3× faster)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A force of 20 N is applied perpendicular to a wrench 0.3 m from the bolt. Find the torque on the bolt.',
      expectedAnswer: '6 N·m',
      responseFormat: 'numeric',
      hints: [
        'τ = r·F·sin θ. Perpendicular means θ = 90°, so sin θ = 1.',
        'Just multiply r · F.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rolling',
      kind: 'misconception_check',
      question: 'A solid sphere and a hoop of equal mass and radius roll down an incline from the same height. Which reaches the bottom first?',
      commonErrors: [
        {
          answer: 'they tie',
          misconception: 'Forgetting that I differs by shape.',
          correctsTo: 'Solid sphere wins. Less of its mass is at the rim, so I_sphere = 0.4·mr² is smaller than I_hoop = mr². Less rotational KE per ω, so more translational KE per height drop, so it accelerates faster down. Mass and radius cancel — only the shape factor matters.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rotation parallels translation: θ↔x, ω↔v, α↔a, I↔m, τ↔F, L↔p.',
        'Στ = I·α (rotational Newton\'s 2nd).',
        'L = I·ω. Conserved with no external torque (skater pulling arms in).',
        'Rolling without slipping: v = r·ω.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does a cat falling upside-down land on its feet despite starting with zero angular momentum?',
      hint: 'The cat changes its moment of inertia in different parts of its body and rotates them in opposite senses — net L stays zero, but the body re-orients. Internal "shape change" without violating conservation.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
