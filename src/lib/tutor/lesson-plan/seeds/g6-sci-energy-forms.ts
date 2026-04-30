/**
 * G6 — Forms of energy and energy transformations.
 *
 * Kinetic, potential, thermal, chemical, electrical, light, sound,
 * nuclear. Conservation of energy: it changes form but isn't created
 * or destroyed.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_ENERGY_FORMS: LessonPlan = {
  id: 'evelyn.g6.sci.physical.energy-forms.v1',
  title: 'Forms of energy and transformations',
  curriculum: 'NGSS',
  grade: '6',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ps3.a',
      description: 'Construct and interpret graphical displays of data to describe the relationships of kinetic energy to mass and speed.',
      standard: 'NGSS.MS-PS3-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ps3.b'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show energy moving through a cascading example.',
      script: 'You eat a sandwich (chemical energy in food). Your muscles use it to pedal a bike (kinetic energy). The bike\'s headlight glows (electrical → light). One transformation chain — and it\'s how the entire universe works.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-forms',
      kind: 'concept',
      goal: 'Eight common forms + conservation of energy.',
      keyIdeas: [
        'KINETIC: energy of MOTION. KE = (1/2)mv². A moving car, a running animal, a falling rock.',
        'POTENTIAL: stored energy that COULD become motion. Gravitational (a rock at the top of a cliff). Elastic (stretched rubber band).',
        'THERMAL (heat): energy of jiggling particles. Hotter = more jiggling.',
        'CHEMICAL: energy stored in chemical bonds. Released when bonds break (food, gasoline burning).',
        'ELECTRICAL: energy of moving charges in a circuit.',
        'LIGHT: electromagnetic energy carried by photons.',
        'SOUND: energy carried by vibrating particles in air, water, or solids.',
        'NUCLEAR: energy stored in atomic nuclei. Released by fission (atomic bomb, nuclear plants) or fusion (sun).',
        'CONSERVATION OF ENERGY: energy is never CREATED or DESTROYED — only TRANSFORMED from one form to another. The total stays the same.',
      ],
      vocabulary: [
        { term: 'kinetic energy', definition: 'energy of motion.' },
        { term: 'potential energy', definition: 'stored energy that could become motion.' },
        { term: 'conservation of energy', definition: 'the total energy in a closed system stays constant.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rollercoaster',
      kind: 'worked_example',
      problem: 'Trace the energy transformations on a roller coaster.',
      steps: [
        'TOP OF FIRST HILL: roller coaster has lots of POTENTIAL energy (high up) and little kinetic (moving slowly).',
        'GOING DOWN: potential → KINETIC. As it falls, it speeds up.',
        'AT BOTTOM: maximum kinetic, almost no potential.',
        'GOING UP NEXT HILL: kinetic → potential. Slows as it climbs.',
        'Throughout: some energy lost to FRICTION (becomes thermal/heat) and SOUND. That\'s why each hill is shorter than the previous one.',
        'Total energy stays the same — but spread across more forms over time.',
      ],
      answer: 'potential ↔ kinetic, with friction stealing some as thermal and sound',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A flashlight: trace the energy transformations from battery to light.',
      expectedAnswer: 'chemical (battery) → electrical → light + heat',
      responseFormat: 'free',
      hints: [
        'Battery starts with one form — what kind?',
        'Then it flows through wires (what form?).',
        'Then becomes light (and a little heat).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-used-up',
      kind: 'misconception_check',
      question: 'When a roller coaster slows down, does it "use up" energy?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating energy as something consumable.',
          correctsTo: 'No — energy is CONSERVED. The kinetic energy didn\'t disappear; it became HEAT (from friction) and SOUND. We just can\'t easily get it back. The total is unchanged.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Energy comes in 8+ forms: kinetic, potential, thermal, chemical, electrical, light, sound, nuclear.',
        'Energy is CONSERVED — never created or destroyed, only transformed.',
        'Friction usually converts useful energy → thermal (heat).',
        'Real-world systems lose useful energy to heat and sound.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A car with brakes: when you brake hard, where does the kinetic energy GO?',
      hint: 'Friction between brake pads and wheels turns kinetic energy into HEAT. That\'s why brakes get hot — and can fail if overheated. Hybrid cars recapture some of this as electricity (regenerative braking).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
