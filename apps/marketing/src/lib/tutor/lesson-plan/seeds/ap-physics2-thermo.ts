/**
 * AP Physics 2 — Thermodynamics.
 *
 * Heat, temperature, ideal gas law, first and second laws of
 * thermodynamics, entropy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_THERMO: LessonPlan = {
  id: 'evelyn.ap.physics2.thermodynamics.v1',
  title: 'Thermodynamics: laws, ideal gas, entropy',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.thermo',
      description: 'Apply the laws of thermodynamics, ideal gas law, and concepts of entropy and heat engines.',
      standard: 'AP-PHYS2-THE',
    },
  ],
  prerequisites: ['phys.energy-conservation'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The deepest law in physics: entropy always increases.',
      script: 'Drop an ice cube in hot water — it melts and equalizes. The reverse never happens spontaneously. That ONE-WAY street is the second law of thermodynamics, and it sets the arrow of time itself.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Three laws + ideal gas + entropy.',
      keyIdeas: [
        'TEMPERATURE: average KINETIC energy of molecules. Higher T → faster jiggling.',
        'HEAT: ENERGY transferred between systems due to temperature difference. Q = mcΔT (specific heat).',
        'IDEAL GAS LAW: PV = nRT. P pressure, V volume, n moles, R = 8.314 J/(mol·K), T in Kelvin.',
        'FIRST LAW: ΔU = Q − W. Internal energy change = heat in minus work done by system. Conservation of energy.',
        'SECOND LAW: entropy of an isolated system never decreases. Heat flows naturally from hot to cold; reverse needs work.',
        'ENTROPY: measure of DISORDER (or unavailable energy). Universe trends toward more entropy.',
        'HEAT ENGINE: converts heat into work. Maximum efficiency = Carnot: η = 1 − T_cold/T_hot. Less than 100% always.',
        'PROCESSES: ISOTHERMAL (constant T), ISOBARIC (constant P), ISOCHORIC (constant V), ADIABATIC (no heat transfer).',
      ],
      vocabulary: [
        { term: 'entropy', definition: 'a measure of the disorder or unavailable energy in a system.' },
        { term: 'adiabatic', definition: 'a process with no heat transfer.' },
        { term: 'Carnot efficiency', definition: 'the theoretical maximum efficiency of a heat engine.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ideal-gas',
      kind: 'worked_example',
      problem: '2 moles of gas at 300 K occupy 0.05 m³. What is the pressure?',
      steps: [
        'PV = nRT.',
        'P = nRT/V = (2)(8.314)(300) / 0.05.',
        'P = 4988.4 / 0.05 = 99,768 Pa ≈ 100 kPa.',
        'Reasonable — close to atmospheric pressure.',
      ],
      answer: 'about 100 kPa',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-carnot',
      kind: 'worked_example',
      problem: 'A heat engine operates between hot 600 K and cold 300 K. What\'s its maximum efficiency?',
      steps: [
        'Carnot: η = 1 − T_cold/T_hot.',
        'η = 1 − 300/600 = 1 − 0.5 = 0.5 = 50%.',
        'No real engine between these temperatures can exceed 50% efficiency. Real engines achieve much less.',
      ],
      answer: '50%',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In an ADIABATIC process, what does Q = 0 imply about ΔU and W?',
      expectedAnswer: 'ΔU = -W; if gas does work, internal energy drops (and T drops with it)',
      responseFormat: 'free',
      hints: [
        'First law: ΔU = Q − W. With Q = 0, ΔU = -W.',
        'If gas EXPANDS doing work, W > 0, so ΔU < 0 → temperature drops.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-energy',
      kind: 'misconception_check',
      question: 'When a hot drink "cools down", does cold energy enter it?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating cold as a substance.',
          correctsTo: 'No — cold isn\'t a thing. HEAT (energy) FLOWS OUT of the hot drink to the cooler air. There\'s no "cold energy" entering. Same reason: a fridge doesn\'t add cold; it removes heat.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PV = nRT (ideal gas).',
        'First law: ΔU = Q − W (energy conservation).',
        'Second law: entropy always increases in an isolated system.',
        'Carnot efficiency: η = 1 − T_cold/T_hot. Always less than 100%.',
        'Heat flows from hot to cold spontaneously; reverse needs work.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why can\'t a heat engine ever be 100% efficient?',
      hint: 'Carnot bound shows that some heat MUST be released to a cold reservoir. Otherwise entropy would decrease in the universe — forbidden by the second law. Even an ideal engine wastes some heat as a fundamental law of physics.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
