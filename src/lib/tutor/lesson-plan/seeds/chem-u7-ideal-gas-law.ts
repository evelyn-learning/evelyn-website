/**
 * Chemistry — Gases: The Combined & Ideal Gas Laws.
 *
 * One equation that ties pressure, volume, temperature, and AMOUNT of gas
 * together (NGSS HS-PS3-2). The combined law handles one sample changing
 * conditions; PV = nRT handles a single state where moles matter. Numbers
 * are engineered to land on clean values, and the Celsius-instead-of-Kelvin
 * error gets its own worked example.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U7_IDEAL_GAS_LAW: LessonPlan = {
  id: 'evelyn.hs.chem.ideal-gas-law.v1',
  title: 'The Combined & Ideal Gas Laws',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.ideal-gas-law',
      standard: 'CHEM-7.4',
      description:
        'Use the combined gas law P₁V₁/T₁ = P₂V₂/T₂ and the ideal gas law PV = nRT with absolute temperature and matched units to relate the pressure, volume, temperature, and moles of a gas sample (NGSS HS-PS3-2).',
    },
  ],
  prerequisites: ['chem.gas-laws'],
  followUps: ['chem.solutions-solubility'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One equation lets you count invisible particles — the gas laws turn a pressure gauge into a scale.',
      script:
        'You cannot pour a gas onto a balance, yet a scuba shop knows exactly how much air is inside a steel tank, and an anesthesiologist knows exactly how many molecules of gas a patient is breathing. They never weigh anything — they read a pressure gauge, a volume, and a temperature, and the ideal gas law does the rest. PV = nRT is the closest thing chemistry has to a magic trick: three things you can measure with cheap instruments give you n, the count of particles you can never see. Today you learn to run it forward, backward, and without falling into the one unit trap that ruins more gas-law answers than anything else.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-combined-and-ideal',
      kind: 'concept',
      goal: 'The combined law as the merger of Boyle/Charles/Gay-Lussac, PV = nRT as the single-state law, and the unit rules that make both work.',
      keyIdeas: [
        'THE COMBINED GAS LAW — P₁V₁/T₁ = P₂V₂/T₂. It follows ONE sealed sample from an old set of conditions to a new one. Because the amount of gas never changes, moles never appear.',
        'IT SWALLOWS THE THREE SIMPLE LAWS — cover any variable that stays constant and it cancels from both sides: hold T and you get Boyle (P₁V₁ = P₂V₂); hold P and you get Charles (V₁/T₁ = V₂/T₂); hold V and you get Gay-Lussac (P₁/T₁ = P₂/T₂). Memorize one equation, not four.',
        'KELVIN OR NOTHING — every T in every gas law is ABSOLUTE temperature: K = °C + 273. Celsius has an arbitrary zero, so ratios of Celsius numbers are meaningless — and a negative Celsius temperature would predict a negative volume, which is nonsense.',
        'THE IDEAL GAS LAW — PV = nRT. This is the only gas law that contains n, the moles of gas, so it is the one you reach for whenever the amount of gas is asked for or given. It describes ONE state; no subscripts, no "before and after".',
        'R CARRIES ITS UNITS WITH IT — R = 0.0821 L·atm/(mol·K). Using that number LOCKS your units: P in atm, V in liters, n in moles, T in kelvin. Millilitres, mmHg, or degrees Celsius plugged in beside it give a wrong answer with no warning.',
        'CHOOSING THE RIGHT TOOL — two sets of conditions for the same gas sample → combined gas law (the ratio form; R never appears). One set of conditions with moles, mass, or molar mass involved → PV = nRT.',
        'MOLAR VOLUME AT STP — at standard temperature and pressure (0 °C = 273 K and 1 atm), one mole of ANY ideal gas occupies 22.4 L. That is not a separate rule; it is PV = nRT with the numbers already substituted, so it is valid ONLY at STP.',
        'WHAT "IDEAL" ASSUMES — that particles take up no volume of their own and do not attract one another. Real gases obey PV = nRT closely at ordinary conditions and deviate at very high pressure or very low temperature, where particles are crowded and sticky.',
      ],
      vocabulary: [
        { term: 'ideal gas', definition: 'a model gas whose particles have zero volume and no attractions, so it obeys PV = nRT exactly.' },
        { term: 'universal gas constant (R)', definition: 'the proportionality constant in PV = nRT; 0.0821 L·atm/(mol·K) when pressure is in atm and volume in liters.' },
        { term: 'STP', definition: 'standard temperature and pressure: 0 °C (273 K) and 1 atm, where one mole of gas occupies 22.4 L.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-combined',
      kind: 'worked_example',
      problem:
        'A weather balloon holds 6.0 L of helium at 1.0 atm and 300 K at the launch site. It rises until the outside pressure is 0.50 atm and the temperature is 200 K. What is its new volume?',
      steps: [
        'Sealed balloon, two sets of conditions, no moles mentioned → combined gas law: P₁V₁/T₁ = P₂V₂/T₂.',
        'List the knowns: P₁ = 1.0 atm, V₁ = 6.0 L, T₁ = 300 K, P₂ = 0.50 atm, T₂ = 200 K. Both temperatures are already in kelvin, so nothing to convert.',
        'Solve for V₂ algebraically: V₂ = P₁V₁T₂ / (P₂T₁) = (1.0 × 6.0 × 200) / (0.50 × 300).',
        'Numerator = 1200; denominator = 150; V₂ = 1200 / 150 = 8.0 L.',
        'Sanity check the two competing effects: halving the pressure alone would double the volume to 12 L, while cooling from 300 K to 200 K alone would shrink it to two-thirds. 12 × (2/3) = 8.0 L. ✓ The balloon expands overall because the pressure drop wins.',
      ],
      answer: 'V₂ = 8.0 L — the balloon expands; the pressure drop outweighs the cooling',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-celsius-trap',
      kind: 'worked_example',
      problem:
        'A 24.63 L cylinder holds gas at 1.0 atm and 27 °C. A student writes n = PV/RT = (1.0 × 24.63) / (0.0821 × 27) = 11.1 mol. The true answer is 1.00 mol. Find the error and fix it. (R = 0.0821 L·atm/(mol·K))',
      steps: [
        'Name the move: the student plugged the CELSIUS temperature, 27, straight into a formula whose R is defined per KELVIN.',
        'Why it fails: R = 0.0821 L·atm/(mol·K) already carries "per kelvin" in its units, so the T beside it must be absolute. Kelvin zero is the true zero of particle motion; Celsius zero is just the freezing point of water, an arbitrary marker.',
        'Convert first: T = 27 + 273 = 300 K. Notice the size of the mistake — 27 versus 300 is off by a factor of about 11, exactly the factor by which the student\'s answer is too big.',
        'Redo the calculation: n = PV/RT = (1.0 × 24.63) / (0.0821 × 300) = 24.63 / 24.63 = 1.00 mol.',
        'Reasonableness check: at close to STP one mole of gas occupies roughly 22–25 L, so about 1 mol in a 24.63 L cylinder is exactly what you should expect. 11 mol crammed into 24.63 L at only 1 atm should have looked impossible.',
      ],
      answer: 'n = 1.00 mol — convert 27 °C to 300 K before dividing; R is defined per kelvin',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rigid-heated',
      kind: 'try_yourself',
      problem:
        'A gas sealed in a RIGID steel container at 27 °C is heated to 327 °C. What happens to its pressure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It doubles, because 300 K becomes 600 K', correct: true },
        { id: 'b', text: 'It increases about 12-fold, because 27 becomes 327' },
        { id: 'c', text: 'It stays the same, because the container cannot change volume' },
        { id: 'd', text: 'It falls by half, because pressure and temperature are inversely related' },
      ],
      expectedAnswer: 'It doubles, because 300 K becomes 600 K',
      hints: [
        'Rigid means V₁ = V₂, so volume cancels from the combined gas law and you are left with P₁/T₁ = P₂/T₂.',
        'Convert both temperatures to kelvin BEFORE taking the ratio: 27 + 273 and 327 + 273.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-molar-volume',
      kind: 'try_yourself',
      problem: 'Which statement about the molar volume of a gas is TRUE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One mole of any ideal gas occupies 22.4 L at STP (0 °C and 1 atm)', correct: true },
        { id: 'b', text: 'One mole of any gas occupies 22.4 L at every temperature and pressure' },
        { id: 'c', text: 'One mole of O₂ occupies more volume than one mole of H₂ at STP because O₂ molecules are heavier' },
        { id: 'd', text: '22.4 L is the volume occupied by one gram of any gas at STP' },
      ],
      expectedAnswer: 'One mole of any ideal gas occupies 22.4 L at STP (0 °C and 1 atm)',
      hints: [
        '22.4 L/mol is just PV = nRT evaluated at one specific P and T — which conditions were substituted in?',
        'In the ideal model, volume depends on the NUMBER of particles, not on how heavy each particle is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A 24.63 L tank holds gas at a pressure of 2.0 atm and a temperature of 300 K. How many moles of gas are in the tank? Use PV = nRT with R = 0.0821 L·atm/(mol·K). Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Rearrange the ideal gas law to isolate n: n = PV/RT.',
        'Top: 2.0 × 24.63 = 49.26. Bottom: 0.0821 × 300 = 24.63. Now divide.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-units',
      kind: 'misconception_check',
      question:
        'A student solving for moles has a gas at 760 mmHg in a 500 mL flask at 273 K, and writes n = (760 × 500) / (0.0821 × 273). What is wrong with this setup?',
      commonErrors: [
        {
          answer: 'The numbers are given, so plug them in as they are',
          misconception: 'Treating R as a pure number instead of a constant that fixes the units of every other quantity.',
          correctsTo:
            'R = 0.0821 L·atm/(mol·K) demands pressure in atm, volume in liters, and temperature in kelvin. Convert first: 760 mmHg = 1.00 atm and 500 mL = 0.500 L. Then n = (1.00 × 0.500) / (0.0821 × 273) = 0.500 / 22.4 ≈ 0.0223 mol. The original setup is off by a factor of hundreds of thousands, and nothing in the arithmetic warns you.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Combined gas law: P₁V₁/T₁ = P₂V₂/T₂ — one sealed sample, two sets of conditions; cover the constant variable and Boyle, Charles, or Gay-Lussac falls out.',
        'Ideal gas law: PV = nRT — one state, and the only gas law that contains moles.',
        'Kelvin or nothing: K = °C + 273 in every gas-law temperature, every time.',
        'R = 0.0821 L·atm/(mol·K) locks the units: atm, liters, moles, kelvin.',
        'Molar volume 22.4 L/mol holds ONLY at STP (0 °C, 1 atm); "ideal" assumes no particle volume and no attractions, which fails at high pressure or low temperature.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'The Combined & Ideal Gas Laws' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
