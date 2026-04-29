/**
 * Grade 8 Science — Forces and Energy (KE/PE).
 * NGSS MS-PS3-1 / MS-PS3-2 / MS-PS3-5: kinetic vs potential energy;
 * energy transferred between objects.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_FORCES_ENERGY: LessonPlan = {
  id: 'evelyn.g8.science.physics.forces-energy.v1',
  title: 'Kinetic and Potential Energy',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'energy', locale: 'en',
  los: [{ id: 'ngss.ms-ps3-1', description: 'Construct and interpret graphical displays of data to describe the relationships of kinetic energy to the mass of an object and to the speed of an object.', standard: 'NGSS.MS-PS3-1' }],
  prerequisites: ['ngss.4-ps3-1'], followUps: ['ngss.hs-ps3-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in roller-coaster physics.', script: 'A roller coaster slowly clicks up the first big hill. At the top, it pauses. Then SCREAMS down. The energy didn\'t come from a motor going down — gravity converted STORED energy into MOTION. That\'s potential and kinetic energy.', estimatedMinutes: 2 },
    { id: 'concept-types', kind: 'concept', goal: 'Two main forms: kinetic (motion) and potential (stored). Plus chemical, nuclear, thermal as special types of one or the other.', keyIdeas: [
      'KINETIC ENERGY (KE): energy of MOTION. Anything moving has it. KE = ½ × mass × velocity².',
      'POTENTIAL ENERGY (PE): STORED energy. Several types:',
      '  · GRAVITATIONAL PE: due to height. PE = m × g × h.',
      '  · ELASTIC PE: stored in stretched/compressed springs and rubber bands.',
      '  · CHEMICAL PE: stored in molecular bonds (food, batteries, gasoline).',
      'ENERGY can transform between forms. Total energy stays the same (conservation of energy).',
    ], vocabulary: [{ term: 'kinetic energy', definition: 'energy of motion.' }, { term: 'potential energy', definition: 'stored energy.' }, { term: 'conservation of energy', definition: 'energy is not created or destroyed, just transformed.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-formulas', kind: 'concept', goal: 'KE depends on mass + speed². PE_grav depends on mass + height. Doubling speed → 4× the KE.', keyIdeas: [
      'KE = ½ × m × v². Mass m in kg, velocity v in m/s.',
      'A car at 30 m/s has 4× the KE of the same car at 15 m/s — because v is SQUARED.',
      'PE = m × g × h. Mass m in kg, g = 9.8 m/s², height h in meters.',
      'Higher up + heavier → more PE.',
      'Total mechanical energy = KE + PE. In ideal conditions (no friction), this is constant.',
    ], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'worked-roller-coaster', kind: 'worked_example', problem: 'A 500 kg roller coaster car at the top of a 30 m hill is briefly at rest. What\'s its PE? After dropping to the bottom (assume no friction), what\'s its KE? Use g = 10 m/s².', steps: [
      'At top: PE = m × g × h = 500 × 10 × 30 = 150,000 J.',
      'At top: KE = 0 (at rest).',
      'Total energy = 150,000 J.',
      'At bottom: h = 0, so PE = 0. All energy is now KE.',
      'KE at bottom = 150,000 J. (Conservation of energy.)',
      'You could solve for speed: ½ × 500 × v² = 150,000 → v² = 600 → v ≈ 24.5 m/s.',
    ], answer: 'PE at top = 150,000 J. KE at bottom = 150,000 J. Speed ≈ 24.5 m/s (~55 mph).', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A 2 kg ball rolls at 4 m/s. Calculate its KE. Then calculate the KE if the ball doubled its speed to 8 m/s. By what factor did KE change?', expectedAnswer: 'KE at 4 m/s = ½(2)(4²) = 16 J. KE at 8 m/s = ½(2)(8²) = 64 J. KE QUADRUPLED (×4) when speed doubled.', responseFormat: 'free', hints: ['KE = ½mv².', 'Velocity is squared — what does doubling do?'], estimatedMinutes: 3 },
    { id: 'misconception-pe-only-gravity', kind: 'misconception_check', question: 'A friend says "potential energy only exists when you\'re high up." Is that the only kind?', commonErrors: [{ answer: 'Yes — only gravity.', misconception: 'Limiting potential energy to gravitational only.', correctsTo: 'Many kinds of potential energy: GRAVITATIONAL (height), ELASTIC (stretched spring), CHEMICAL (gasoline, food, batteries), NUCLEAR (uranium). All are STORED energy waiting to be released.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['KE = ½mv² (motion energy).', 'PE = mgh for gravity (stored energy).', 'Doubling speed → 4× the KE.', 'Energy converts between forms; total is conserved (without friction).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
