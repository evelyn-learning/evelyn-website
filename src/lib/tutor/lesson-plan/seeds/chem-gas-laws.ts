/**
 * HS Chemistry — Gas Laws.
 * NGSS HS-PS3-2 (related): kinetic molecular theory and PV=nRT.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_GAS_LAWS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.gas-laws.v1',
  title: 'Gas Laws',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-2', description: 'Develop and use models to illustrate that energy at the macroscopic scale can be accounted for as a combination of energy associated with the motions of particles (objects) and energy associated with the relative positions of particles (objects).', standard: 'NGSS.HS-PS3-2' }],
  prerequisites: ['hs.chem.atomic-structure'], followUps: ['hs.chem.solutions-concentration'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in real life.', script: 'A balloon left in a hot car expands. A bag of chips at high altitude looks puffy. A scuba diver who surfaces too fast gets the bends. All gas laws — pressure, volume, temperature, and moles all linked by simple math.', estimatedMinutes: 2 },
    { id: 'concept-laws', kind: 'concept', goal: 'Boyle\'s, Charles\'s, Gay-Lussac\'s, and combined gas laws.', keyIdeas: [
      'KINETIC MOLECULAR THEORY: gas particles are tiny, fast-moving, mostly empty space between them.',
      'BOYLE\'S LAW (constant T, n): P₁V₁ = P₂V₂. Pressure UP → Volume DOWN (inverse).',
      'CHARLES\'S LAW (constant P, n): V₁/T₁ = V₂/T₂. Temp UP → Volume UP (direct). T in KELVIN.',
      'GAY-LUSSAC\'S LAW (constant V, n): P₁/T₁ = P₂/T₂. Temp UP → Pressure UP.',
      'COMBINED: P₁V₁/T₁ = P₂V₂/T₂.',
      'Always use KELVIN for temperature: K = °C + 273.15.',
    ], vocabulary: [{ term: 'pressure', definition: 'force per area (Pa, atm, mmHg).' }, { term: 'kelvin', definition: 'absolute temperature scale; 0K = no motion.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-ideal', kind: 'concept', goal: 'The ideal gas law combines all four variables: PV = nRT.', keyIdeas: [
      'IDEAL GAS LAW: PV = nRT.',
      '  · P = pressure (atm).',
      '  · V = volume (L).',
      '  · n = moles.',
      '  · R = gas constant = 0.0821 L·atm/(mol·K).',
      '  · T = temperature (K).',
      'STP (Standard Temp & Pressure): 0°C (273.15 K), 1 atm. At STP, 1 mole gas = 22.4 L.',
      'IDEAL gas: assumes particles have no volume + don\'t attract each other. Real gases deviate at very high pressure or very low temp.',
    ], estimatedMinutes: 4 },
    { id: 'worked-boyle', kind: 'worked_example', problem: 'A 5.0 L gas sample at 1.0 atm is compressed to 2.0 L. What\'s the new pressure (constant T)?', steps: [
      'Use Boyle\'s Law: P₁V₁ = P₂V₂.',
      'P₁ = 1.0 atm, V₁ = 5.0 L, V₂ = 2.0 L.',
      '(1.0)(5.0) = P₂(2.0).',
      'P₂ = 5.0 / 2.0 = 2.5 atm.',
      'Volume halved-ish (5 → 2) → pressure ~2.5x. Inverse relationship.',
    ], answer: 'P₂ = 2.5 atm. Compress gas → pressure rises (Boyle\'s law).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Use PV = nRT: how many moles of gas are in 10.0 L at 2.0 atm and 300 K? (R = 0.0821)', expectedAnswer: 'PV = nRT → n = PV/RT = (2.0 × 10.0) / (0.0821 × 300) = 20.0 / 24.63 ≈ 0.81 mol.', responseFormat: 'numeric', hints: ['Solve for n.', 'Plug in P, V, R, T (already in K).'], estimatedMinutes: 3 },
    { id: 'misconception-celsius', kind: 'misconception_check', question: 'A friend uses Charles\'s law with T in °C. The volume goes negative when T = -50°C. What\'s wrong?', commonErrors: [{ answer: 'Math is fine.', misconception: 'Using Celsius in gas laws.', correctsTo: 'Gas laws REQUIRE Kelvin. Celsius can be negative; volume can\'t. Convert: T(K) = T(°C) + 273.15. So -50°C = 223 K (positive). With Kelvin, the math always gives sensible results.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Boyle: P₁V₁ = P₂V₂ (T const).', 'Charles: V₁/T₁ = V₂/T₂ (P const).', 'Combined: P₁V₁/T₁ = P₂V₂/T₂.', 'Ideal gas: PV = nRT. ALWAYS use Kelvin.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
