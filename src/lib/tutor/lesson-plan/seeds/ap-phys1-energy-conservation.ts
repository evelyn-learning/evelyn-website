/**
 * AP Physics 1 — Conservation of Energy.
 *
 * Kinetic, gravitational PE, elastic PE. Work-energy theorem. Choosing systems.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_ENERGY_CONSERVATION: LessonPlan = {
  id: 'evelyn.ap.physics1.energy-conservation.v1',
  title: 'Conservation of Energy',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys1.energy',
      description: 'Apply conservation of energy and the work-energy theorem to predict speeds, heights, and spring compressions.',
      standard: 'AP-PHYS1-4.C',
    },
  ],
  prerequisites: ['apphys1.kinematics', 'apphys1.newtons-second'],
  followUps: ['apphys1.momentum'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Energy as a shortcut around messy force diagrams.',
      script: 'Newton\'s second law tells you forces and accelerations. But sometimes you don\'t care about the path — just the start and end. That\'s where energy comes in. If no friction acts, total mechanical energy stays the same. Set initial = final and skip the kinematics entirely.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-forms',
      kind: 'concept',
      goal: 'Three forms of mechanical energy and the conservation rule.',
      keyIdeas: [
        'KINETIC: KE = 0.5·m·v². Always positive. Depends on speed, not direction.',
        'GRAVITATIONAL PE: PE_g = m·g·h. h measured from a reference point YOU choose. Only differences matter.',
        'ELASTIC PE: PE_s = 0.5·k·x². x is displacement from the spring\'s natural length.',
        'CONSERVATION: when only conservative forces (gravity, spring) do work: KE_i + PE_i = KE_f + PE_f. Mechanical energy stays constant.',
        'WHEN IT FAILS: friction, air drag, applied forces — these dissipate or add energy. Then use the WORK-ENERGY theorem: W_net = ΔKE. Or include energy lost to heat: KE_i + PE_i = KE_f + PE_f + W_friction.',
        'STRATEGY: pick two snapshots (initial, final). Pick a reference height for PE. Write KE+PE at each. Set them equal (or include W_dissipated).',
      ],
      vocabulary: [
        { term: 'conservative force', definition: 'a force whose work depends only on start and end points (gravity, springs).' },
        { term: 'work-energy theorem', definition: 'net work done on an object equals its change in kinetic energy.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pendulum',
      kind: 'worked_example',
      problem: 'A 2 kg pendulum bob is released from rest 0.8 m above the lowest point. Find its speed at the bottom. (g = 10 m/s².)',
      steps: [
        'Snapshots: top (at rest, h = 0.8 m), bottom (h = 0, speed = v).',
        'Reference: bottom = 0 height.',
        'Top: KE = 0, PE = m·g·h = 2·10·0.8 = 16 J. Total = 16 J.',
        'Bottom: KE = 0.5·m·v², PE = 0. Total = 0.5·2·v² = v².',
        'Conservation: 16 = v². So v = 4 m/s.',
      ],
      answer: 'v = 4 m/s at the bottom',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 0.5 kg block is pushed against a spring with k = 200 N/m, compressing it by 0.2 m. The block is released on a frictionless surface. Find the block\'s speed when the spring returns to its natural length.',
      expectedAnswer: '4 m/s',
      responseFormat: 'numeric',
      hints: [
        'Spring PE at compression: 0.5·k·x² converts to KE.',
        '0.5·200·0.2² = 0.5·0.5·v². Solve.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-path',
      kind: 'misconception_check',
      question: 'A roller coaster car drops 30 m on a curvy track without friction. A second car drops the same 30 m on a straight ramp. Do they reach the bottom at the same speed?',
      commonErrors: [
        {
          answer: 'no, the curvy track gives a different speed',
          misconception: 'Thinking path length affects final speed.',
          correctsTo: 'YES — same speed. Conservation of energy depends only on the height drop, not the path. Curvy or straight, all PE converts to KE if no friction. Use m·g·h = 0.5·m·v² → v = √(2gh) ≈ 24.5 m/s for both.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'KE = 0.5·m·v². PE_g = m·g·h. PE_s = 0.5·k·x².',
        'Conservation: KE_i + PE_i = KE_f + PE_f when only gravity/spring do work.',
        'Friction or applied forces: include W_dissipated or use W_net = ΔKE.',
        'Path doesn\'t matter for conservative forces — only endpoints.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 1 kg block slides down a 3 m incline with friction coefficient 0.2. The incline angle is 30°. Find the block\'s speed at the bottom. (g = 10 m/s².)',
      hint: 'Drop in height: h = 3·sin 30° = 1.5 m. PE = mgh = 15 J. Friction force = μ·N = 0.2·m·g·cos 30°. Energy lost = friction force · 3 m. Set PE_i = KE_f + W_friction.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
