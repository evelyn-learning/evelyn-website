/**
 * HS Physics — Momentum and Collisions.
 * NGSS HS-PS2-2 / HS-PS2-3: momentum conservation and impulse.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_MOMENTUM_COLLISIONS: LessonPlan = {
  id: 'evelyn.hs.science.physics.momentum-collisions.v1',
  title: 'Momentum and Collisions',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-2', description: 'Use mathematical representations to support the claim that the total momentum of a system of objects is conserved when there is no net force on the system.', standard: 'NGSS.HS-PS2-2' }],
  prerequisites: ['hs.phys.conservation-energy'], followUps: ['hs.phys.circular-motion'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in collisions.', script: 'A bowling ball plows through the pins. A car crash crumples both cars. A pool cue strikes a ball. All collisions follow ONE rule: total MOMENTUM is conserved. Crash all you want — the math comes out.', estimatedMinutes: 2 },
    { id: 'concept-momentum', kind: 'concept', goal: 'Momentum p = mv. Total system momentum is conserved when no net external force.', keyIdeas: [
      'MOMENTUM (p) = mass × velocity. p = m × v. Vector quantity.',
      'UNITS: kg·m/s.',
      'CONSERVATION OF MOMENTUM: in a closed system (no external forces), TOTAL momentum stays constant.',
      'p_total_before = p_total_after.',
      'EQUIVALENT to Newton\'s 3rd Law: forces between objects are equal and opposite → momentum changes cancel.',
      'IMPULSE (J): change in momentum. J = Δp = F × Δt.',
      '  · Why airbags work: increase Δt → reduce F (same momentum change).',
    ], vocabulary: [{ term: 'momentum', definition: 'p = mv. Conserved in closed systems.' }, { term: 'impulse', definition: 'change in momentum (J = FΔt).' }, { term: 'collision', definition: 'brief interaction between objects.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-collision-types', kind: 'concept', goal: 'Elastic collisions conserve KE; inelastic don\'t.', keyIdeas: [
      'TYPES of collisions:',
      '  · ELASTIC: BOTH momentum AND kinetic energy conserved. (Rare in real world; idealized billiard balls, atoms.)',
      '  · INELASTIC: momentum conserved, KE NOT conserved (some becomes heat/sound/deformation).',
      '  · PERFECTLY INELASTIC: objects STICK together after. Maximum KE lost. Most common.',
      'EXPLOSIONS: reverse of collision. Object splits → momenta sum to original (zero if started at rest).',
      'In all cases: momentum conserved.',
    ], estimatedMinutes: 4 },
    { id: 'worked-stick', kind: 'worked_example', problem: 'A 1500 kg car traveling at 20 m/s rear-ends a stationary 1000 kg car. They stick together. What\'s their final speed?', steps: [
      'Initial momentum: p_total = 1500(20) + 1000(0) = 30,000 kg·m/s.',
      'Final momentum (stuck together, mass = 1500+1000 = 2500 kg, velocity v):',
      '  · p_final = 2500 × v.',
      'Conservation: 30,000 = 2500v → v = 12 m/s.',
      'Final speed = 12 m/s. (KE was lost to crumple — perfectly inelastic.)',
    ], answer: 'v = 12 m/s. Stuck cars move slower than the original car alone — momentum conserved, KE not.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A 0.05 kg bullet leaves a 5 kg gun at 600 m/s. What is the gun\'s recoil velocity? (Initially both at rest.)', expectedAnswer: 'Initial momentum = 0 (both at rest). Final must also = 0. So m_bullet × v_bullet + m_gun × v_gun = 0. (0.05)(600) + (5)(v_gun) = 0. 30 + 5v_gun = 0 → v_gun = −6 m/s. Gun recoils at 6 m/s opposite to bullet. (That\'s why guns kick.)', responseFormat: 'numeric', hints: ['Initial momentum = 0.', 'Bullet and gun momenta must cancel.'], estimatedMinutes: 3 },
    { id: 'misconception-energy-momentum', kind: 'misconception_check', question: 'A friend says "in any collision, both momentum AND kinetic energy are conserved." Right?', commonErrors: [{ answer: 'Yes — both conserved.', misconception: 'Confusing momentum with KE conservation.', correctsTo: 'MOMENTUM is always conserved (no external forces). KINETIC ENERGY is conserved only in ELASTIC collisions. Most real collisions (cars, balls hitting each other audibly, anything that crumples or sticks) lose KE to heat, sound, deformation. Momentum is the universal law; KE conservation is special.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['p = mv. Vector.', 'Momentum is ALWAYS conserved when no external force.', 'KE conserved only in ELASTIC collisions.', 'Impulse: J = FΔt = Δp. Airbags increase Δt → reduce F.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
