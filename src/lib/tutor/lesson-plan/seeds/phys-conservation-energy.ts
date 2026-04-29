/**
 * HS Physics — Conservation of Energy.
 * NGSS HS-PS3-2: energy conservation in mechanical systems.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_CONSERVATION_ENERGY: LessonPlan = {
  id: 'evelyn.hs.science.physics.conservation-energy.v1',
  title: 'Conservation of Energy',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-2', description: 'Develop and use models to illustrate that energy at the macroscopic scale can be accounted for as a combination of energy associated with the motions of particles (objects) and energy associated with the relative positions of particles (objects).', standard: 'NGSS.HS-PS3-2' }],
  prerequisites: ['hs.phys.work-energy'], followUps: ['hs.phys.momentum-collisions'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in roller coasters.', script: 'A roller coaster climbs to its highest point — that\'s pure gravitational PE. Then it plunges, converting PE → KE → speed. Without friction, it\'d climb back to the same height every time. Energy is CONSERVED. That\'s a law you can\'t break.', estimatedMinutes: 2 },
    { id: 'concept-conservation', kind: 'concept', goal: 'Total mechanical energy is conserved if only gravity (or springs) act.', keyIdeas: [
      'CONSERVATION OF ENERGY: total energy in a CLOSED SYSTEM is constant. It can convert FORMS but cannot be created or destroyed.',
      'MECHANICAL ENERGY = KE + PE.',
      'IF only conservative forces (gravity, springs) act:',
      '  · KE_initial + PE_initial = KE_final + PE_final.',
      'IF friction or air resistance acts:',
      '  · Some mechanical energy converts to HEAT.',
      '  · Total energy is still conserved (KE + PE + heat = constant).',
      'POTENTIAL forms: gravitational, spring (elastic), chemical, electrical, nuclear.',
      'Energy ALWAYS conserved — first law of thermodynamics.',
    ], vocabulary: [{ term: 'mechanical energy', definition: 'KE + PE.' }, { term: 'conservative force', definition: 'force where energy stored is path-independent (gravity, springs).' }, { term: 'dissipative force', definition: 'force converting mechanical energy to heat (friction).' }], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'concept-applications', kind: 'concept', goal: 'Use conservation to solve motion problems without forces.', keyIdeas: [
      'POWERFUL: solve for speed at any point by tracking energy, no need to know all forces.',
      'STEPS:',
      '  1. Choose a reference height for PE = 0.',
      '  2. Calculate total energy at known point: E = KE + PE.',
      '  3. At the unknown point, set new KE + new PE = same total.',
      '  4. Solve for unknown.',
      'EXAMPLES:',
      '  · Pendulum: PE max at top of swing, KE max at bottom. Total = constant.',
      '  · Roller coaster: same logic.',
      '  · Falling object: PE drops, KE rises by the same amount.',
    ], estimatedMinutes: 4 },
    { id: 'worked-pendulum', kind: 'worked_example', problem: 'A 0.5 kg pendulum bob swings from a height of 0.4 m above its lowest point. How fast is it moving at the bottom? (g = 10 m/s²)', steps: [
      'TOP: KE = 0 (momentarily at rest), PE = mgh = 0.5 × 10 × 0.4 = 2 J.',
      'BOTTOM: PE = 0 (reference), KE = ?',
      'CONSERVATION: KE_bottom = PE_top = 2 J.',
      'KE = ½mv² → 2 = ½ × 0.5 × v².',
      'v² = 8 → v ≈ 2.83 m/s.',
    ], answer: 'v ≈ 2.83 m/s. Conservation lets you skip force analysis.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A skier starts from rest at the top of a 100 m hill. Ignoring friction, how fast is she at the bottom? (g = 10 m/s²)', expectedAnswer: 'PE_top = mgh, KE_bottom = ½mv². Conservation: mgh = ½mv² → v² = 2gh = 2(10)(100) = 2000 → v ≈ 44.7 m/s. (~100 mph! Real skiers are slower because of friction + air resistance — but the idealized answer is ~45 m/s.)', responseFormat: 'numeric', hints: ['Set PE_top = KE_bottom (mass cancels).', 'v² = 2gh.'], estimatedMinutes: 3 },
    { id: 'misconception-energy-lost', kind: 'misconception_check', question: 'A friend says "when a ball stops bouncing, the energy is GONE." Is energy actually lost?', commonErrors: [{ answer: 'Yes — energy is lost.', misconception: 'Confusing converted energy with lost energy.', correctsTo: 'Energy is NEVER LOST — it\'s CONVERTED. Each bounce, some KE → heat (in the ball, ground, and air) and sound. After many bounces, all the original KE has dispersed as low-grade heat. The total energy in the universe is unchanged. The 1st Law of Thermodynamics is iron-clad.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Energy is conserved (1st Law of Thermodynamics).', 'Mechanical energy = KE + PE; conserved if no friction.', 'Use conservation to find unknown speed/height without forces.', 'Friction converts mechanical energy to heat — total energy still conserved.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
