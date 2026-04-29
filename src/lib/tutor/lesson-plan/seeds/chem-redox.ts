/**
 * HS Chemistry — Oxidation-Reduction (Redox).
 * Foundational electron-transfer chemistry.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_REDOX: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.redox.v1',
  title: 'Oxidation-Reduction (Redox) Reactions',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-2', description: 'Construct and revise an explanation for the outcome of a simple chemical reaction based on the outermost electron states of atoms.', standard: 'NGSS.HS-PS1-2' }],
  prerequisites: ['hs.chem.equilibrium'], followUps: ['hs.chem.organic-intro'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in batteries.', script: 'A AA battery has chemicals that move ELECTRONS through your phone\'s wires. Apples turn brown when cut. Iron rusts. Your body burns food. All same fundamental chemistry: REDOX — the transfer of electrons.', estimatedMinutes: 2 },
    { id: 'concept-redox-defs', kind: 'concept', goal: 'Oxidation = lose electrons. Reduction = gain electrons. They always come together.', keyIdeas: [
      'OXIDATION = LOSS of electrons (LEO).',
      'REDUCTION = GAIN of electrons (GER).',
      'MEMORY: "OIL RIG" or "LEO the lion says GER."',
      'Both happen TOGETHER in any redox reaction (electrons must come from somewhere and go somewhere).',
      'OXIDIZING AGENT: the substance that GAINS electrons (it gets reduced; it CAUSES oxidation in the other).',
      'REDUCING AGENT: the substance that LOSES electrons (it gets oxidized; it CAUSES reduction in the other).',
      'EXAMPLE: 2 Na + Cl₂ → 2 NaCl.',
      '  · Na loses an electron (oxidation): Na → Na⁺ + e⁻.',
      '  · Cl gains an electron (reduction): Cl + e⁻ → Cl⁻.',
    ], vocabulary: [{ term: 'oxidation', definition: 'loss of electrons.' }, { term: 'reduction', definition: 'gain of electrons.' }, { term: 'oxidation state', definition: 'an atom\'s assigned charge in a compound.' }], estimatedMinutes: 5 },
    { id: 'concept-oxidation-states', kind: 'concept', goal: 'Track electron transfer using oxidation states.', keyIdeas: [
      'OXIDATION STATE (or NUMBER): assigned charge of an atom in a compound.',
      'RULES (in order):',
      '  1. Pure element: 0 (e.g., O₂, Fe, Na).',
      '  2. Monatomic ion: equals its charge (Na⁺ = +1, O²⁻ = −2).',
      '  3. H is usually +1 (except in metal hydrides like NaH where it\'s −1).',
      '  4. O is usually −2 (except in peroxides H₂O₂ where it\'s −1).',
      '  5. Sum of oxidation states = total charge of compound.',
      'CHECK FOR REDOX: if an atom\'s oxidation state CHANGES, it\'s a redox reaction.',
      '  · Oxidation state INCREASES → that atom was OXIDIZED.',
      '  · Oxidation state DECREASES → that atom was REDUCED.',
    ], estimatedMinutes: 4 },
    { id: 'worked-rust', kind: 'worked_example', problem: 'Identify what is oxidized and reduced in: 4 Fe + 3 O₂ → 2 Fe₂O₃ (rust).', steps: [
      'Find oxidation states in reactants:',
      '  · Fe: pure element = 0.',
      '  · O₂: pure element = 0.',
      'In product Fe₂O₃:',
      '  · O = −2 (rule 4). 3 O total = −6.',
      '  · For neutral compound, 2 Fe must = +6. So each Fe = +3.',
      'Changes:',
      '  · Fe: 0 → +3. INCREASED → OXIDIZED.',
      '  · O: 0 → −2. DECREASED → REDUCED.',
      'Iron is the reducing agent (gives electrons). Oxygen is the oxidizing agent (takes them).',
    ], answer: 'Fe oxidized (0 → +3); O reduced (0 → −2). Classic rust = redox.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'In Zn + CuSO₄ → ZnSO₄ + Cu, identify what is oxidized and reduced.', expectedAnswer: 'Zn: 0 → +2 (oxidized, lost 2 e⁻). Cu²⁺: +2 → 0 (reduced, gained 2 e⁻). Zn is the reducing agent; Cu²⁺ is the oxidizing agent. (Sulfate doesn\'t change — spectator ion.) This is a classic single replacement that\'s also a redox.', responseFormat: 'free', hints: ['Find oxidation states for Zn and Cu on each side.', 'Sulfate is unchanged (spectator).'], estimatedMinutes: 3 },
    { id: 'misconception-oxygen-required', kind: 'misconception_check', question: 'A friend says "for it to be \'oxidation,\' oxygen has to be involved." Right?', commonErrors: [{ answer: 'Yes — needs oxygen.', misconception: 'Limiting oxidation to oxygen reactions.', correctsTo: 'OXIDATION just means LOSING electrons — oxygen doesn\'t have to be present. The name is historical (oxygen was the first known oxidizer). Na losing an electron to Cl is oxidation. Iron oxidizing in chlorine gas is oxidation. Anything that takes electrons is an oxidizer.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons).', 'Both happen together in redox reactions.', 'Track electron transfer using oxidation states.', 'Oxidation doesn\'t require oxygen; it requires losing electrons.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
