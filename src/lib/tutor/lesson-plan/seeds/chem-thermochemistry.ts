/**
 * HS Chemistry — Thermochemistry.
 * NGSS HS-PS3-1: predict change in energy.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_THERMOCHEMISTRY: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.thermochemistry.v1',
  title: 'Thermochemistry',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-1', description: 'Create a computational model to calculate the change in the energy of one component in a system when the change in energy of the other component(s) and energy flows in and out of the system are known.', standard: 'NGSS.HS-PS3-1' }],
  prerequisites: ['hs.chem.reactions-types'], followUps: ['hs.chem.kinetics'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Energy in reactions.', script: 'A campfire releases heat. A cold pack absorbs heat. A battery releases stored chemical energy as electricity. Every reaction has an energy story — thermochemistry tells it.', estimatedMinutes: 2 },
    { id: 'concept-energy-flow', kind: 'concept', goal: 'Reactions are exothermic (release energy) or endothermic (absorb energy).', keyIdeas: [
      'CHEMICAL POTENTIAL ENERGY: stored in bonds.',
      'BREAKING bonds REQUIRES energy. FORMING bonds RELEASES energy.',
      'EXOTHERMIC: products have LESS energy than reactants → releases energy (often as heat).',
      '  · ΔH < 0 (negative).',
      '  · Examples: combustion, neutralization, most explosions.',
      'ENDOTHERMIC: products have MORE energy than reactants → absorbs energy.',
      '  · ΔH > 0 (positive).',
      '  · Examples: photosynthesis, melting ice, instant cold packs.',
      'ENTHALPY (H): heat content. ΔH = H(products) − H(reactants).',
      'UNITS: kJ/mol or J.',
    ], vocabulary: [{ term: 'enthalpy', definition: 'heat content of a system (H).' }, { term: 'exothermic', definition: 'releases heat (ΔH<0).' }, { term: 'endothermic', definition: 'absorbs heat (ΔH>0).' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-calorimetry', kind: 'concept', goal: 'Calorimetry: measure heat transfer using q = mcΔT.', keyIdeas: [
      'CALORIMETRY: measuring heat by tracking temperature changes in a known mass of water.',
      'EQUATION: q = m × c × ΔT.',
      '  · q = heat (J).',
      '  · m = mass (g).',
      '  · c = specific heat capacity (J/g·°C).',
      '  · ΔT = change in temperature (T_final − T_initial).',
      'WATER: c = 4.18 J/g·°C (high — that\'s why water moderates climate).',
      'POSITIVE q = absorbed heat (endothermic for the system).',
      'NEGATIVE q = released heat (exothermic).',
      'HESS\'S LAW: ΔH for a multi-step reaction = sum of ΔH for individual steps.',
    ], estimatedMinutes: 4 },
    { id: 'worked-q-calc', kind: 'worked_example', problem: 'You burn a peanut and use the heat to warm 100 g of water from 25°C to 45°C. How much heat (q) did the peanut release? (c_water = 4.18 J/g·°C)', steps: [
      'q = m × c × ΔT.',
      'm = 100 g, c = 4.18 J/g·°C, ΔT = 45 − 25 = 20°C.',
      'q = 100 × 4.18 × 20 = 8,360 J = 8.36 kJ.',
      'This is heat ABSORBED by water → equals heat RELEASED by peanut.',
      'For the peanut, q = −8.36 kJ (exothermic).',
    ], answer: 'Peanut released ~8.36 kJ. (Real peanuts have ~20-25 kJ — most heat is lost to surroundings.)', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A reaction has ΔH = +50 kJ/mol. Is it exo- or endothermic? What does that mean physically?', expectedAnswer: 'ENDOTHERMIC (positive ΔH means energy absorbed by the reaction). Products have 50 kJ/mol MORE energy than reactants. The system COOLS its surroundings as it pulls in heat. Examples: melting ice, photosynthesis, instant cold packs.', responseFormat: 'free', hints: ['Sign of ΔH tells you exo vs endo.', 'Where does the energy come from?'], estimatedMinutes: 3 },
    { id: 'misconception-cold-no-energy', kind: 'misconception_check', question: 'A friend says "endothermic reactions don\'t release energy, so they aren\'t \'real\' chemistry." Right?', commonErrors: [{ answer: 'Yes — only exo matters.', misconception: 'Dismissing endothermic as not real.', correctsTo: 'Endothermic reactions are EVERYWHERE and essential. PHOTOSYNTHESIS is endothermic — plants pull in solar energy to build sugars. Without it, no food chain. Cooking pasta = endothermic (water boils). Just because they don\'t feel hot doesn\'t make them less chemistry.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Exothermic: ΔH < 0, releases heat.', 'Endothermic: ΔH > 0, absorbs heat.', 'q = mcΔT for calorimetry.', 'Energy is conserved — broken bonds need energy, formed bonds release it.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
