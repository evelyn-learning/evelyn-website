/**
 * AP Physics 1 — Momentum and Collisions.
 *
 * p = mv, conservation of momentum, elastic vs inelastic collisions, impulse.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_MOMENTUM: LessonPlan = {
  id: 'evelyn.ap.physics1.momentum.v1',
  title: 'Momentum and Collisions',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys1.momentum',
      description: 'Apply conservation of momentum and the impulse-momentum theorem to collisions and explosions.',
      standard: 'AP-PHYS1-5.D',
    },
  ],
  prerequisites: ['apphys1.newtons-second', 'apphys1.energy'],
  followUps: ['apphys1.rotation'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Momentum as the conserved quantity in collisions.',
      script: 'When two objects crash, the forces are huge but brief — too messy to track. Here\'s the trick: momentum is conserved if no outside force interferes. Sum the momentum before, sum after, set them equal. The collision could be a fender-bender or a nuclear reaction. Same equation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-conservation',
      kind: 'concept',
      goal: 'Momentum, impulse, and the two collision categories.',
      keyIdeas: [
        'MOMENTUM: p = m·v. Vector. Has direction. Units: kg·m/s.',
        'IMPULSE: J = F·Δt = Δp. A force acting over time changes momentum.',
        'CONSERVATION: total momentum before = total momentum after, IF no external force acts during the interaction. Internal forces between colliding objects don\'t count — they\'re Newton\'s third-law pairs that cancel out.',
        'ELASTIC COLLISION: KE conserved AND momentum conserved. Objects bounce. Two equations, two unknowns.',
        'INELASTIC COLLISION: only momentum conserved. KE is lost (to heat, deformation). Objects may stick together (perfectly inelastic) → one final velocity.',
        'EXPLOSION: reverse of perfectly inelastic. One object splits; total momentum BEFORE is whatever it was (often 0); momenta after must sum to that total.',
        'STRATEGY: write Σp_initial = Σp_final. Take rightward as positive, leftward as negative. Solve.',
      ],
      vocabulary: [
        { term: 'impulse', definition: 'product of force and time it acts; equals change in momentum.' },
        { term: 'inelastic collision', definition: 'a collision where kinetic energy is lost; if they stick, perfectly inelastic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-stick-together',
      kind: 'worked_example',
      problem: 'A 3 kg cart moving at 4 m/s collides with and sticks to a 1 kg cart at rest. Find their common velocity after.',
      steps: [
        'Perfectly inelastic — they stick, share one final velocity v.',
        'Before: p_total = 3·4 + 1·0 = 12 kg·m/s.',
        'After: p_total = (3+1)·v = 4v.',
        'Conservation: 12 = 4v → v = 3 m/s.',
        'Check KE: before = 0.5·3·16 = 24 J. After = 0.5·4·9 = 18 J. 6 J lost — confirms inelastic.',
      ],
      answer: 'v = 3 m/s (in the original direction)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 0.1 kg ball moving at 5 m/s east hits a wall and rebounds at 4 m/s west. The collision lasts 0.02 s. Find the average force the wall exerts on the ball.',
      expectedAnswer: '45 N',
      responseFormat: 'numeric',
      hints: [
        'Δp = m·v_f − m·v_i. Take east as positive: v_i = +5, v_f = −4.',
        'Δp = 0.1·(−4) − 0.1·(5) = −0.9 kg·m/s.',
        'F = Δp / Δt. Magnitude is what they ask for.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-ke-momentum',
      kind: 'misconception_check',
      question: 'In an inelastic collision, kinetic energy decreases. Does momentum also decrease?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating momentum and energy as equivalent.',
          correctsTo: 'No. Momentum is ALWAYS conserved in any collision (assuming no external forces). KE is only conserved in elastic collisions. They\'re different quantities — momentum cares about mass × velocity (vector); KE cares about mass × velocity² (scalar). Lost KE goes to heat, sound, deformation — but momentum stays put.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'p = mv. Conservation: Σp_before = Σp_after when no external force acts.',
        'Impulse J = F·Δt = Δp.',
        'Elastic: both p and KE conserved. Inelastic: only p. Perfectly inelastic: they stick.',
        'Direction matters — assign signs to vectors.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 60 kg skater on frictionless ice throws a 2 kg ball at 10 m/s east. What is the skater\'s velocity afterward?',
      hint: 'Treat as explosion. Total p before = 0 (everyone at rest). After: ball + skater momenta must sum to 0. Solve for skater\'s velocity.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
