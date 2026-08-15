/**
 * Grade 8 Science — Static and Current Electricity.
 * NGSS MS-PS2-3 / MS-PS2-5: electric and magnetic forces; electric
 * current.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_ELECTRICITY: LessonPlan = {
  id: 'evelyn.g8.science.physics.electricity.v1',
  title: 'Electricity: Static and Current',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'energy', locale: 'en',
  los: [{ id: 'ngss.ms-ps2-3', description: 'Ask questions about data to determine the factors that affect the strength of electric and magnetic forces.', standard: 'NGSS.MS-PS2-3' }],
  prerequisites: ['ngss.3-ps2-3'], followUps: ['ngss.hs-ps3-3'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the difference.', script: 'Rub a balloon on your hair → it sticks to the wall. That\'s STATIC electricity. Plug in a lamp → it lights up. That\'s CURRENT electricity. Same fundamental thing — moving electrons — but used differently.', estimatedMinutes: 2 },
    { id: 'concept-charges', kind: 'concept', goal: 'Two kinds of charge: positive (protons) and negative (electrons). Like charges repel; opposite attract.', keyIdeas: [
      'Atoms have PROTONS (+) in nucleus, ELECTRONS (−) orbiting.',
      'Normally atoms are NEUTRAL (equal +/−).',
      'When electrons MOVE between objects, charge imbalance forms.',
      'Object with more electrons = NEGATIVE charge.',
      'Object with fewer electrons = POSITIVE charge.',
      'Like charges REPEL; opposite charges ATTRACT.',
    ], vocabulary: [{ term: 'electron', definition: 'negative subatomic particle.' }, { term: 'charge', definition: 'property letting objects exert electrical force.' }], estimatedMinutes: 4 },
    { id: 'concept-current', kind: 'concept', goal: 'Current = flow of electric charge through a conductor. Voltage drives it; resistance limits it. V = IR.', keyIdeas: [
      'CURRENT (I): rate of charge flow. Measured in AMPERES (A).',
      'VOLTAGE (V): "push" that drives the current. Like water pressure. Measured in VOLTS (V).',
      'RESISTANCE (R): how much the conductor RESISTS the flow. Measured in OHMS (Ω).',
      'OHM\'S LAW: V = I × R.',
      'CONDUCTORS (metals) let current flow easily. INSULATORS (rubber, glass, plastic) block it.',
      'CIRCUIT: closed loop allowing current to flow. Open the loop → no flow.',
    ], vocabulary: [{ term: 'voltage', definition: 'electrical pressure (V).' }, { term: 'current', definition: 'flow of charge (A).' }, { term: 'resistance', definition: 'opposition to current (Ω).' }, { term: 'circuit', definition: 'closed loop for current.' }], suggestedTools: ['show_equation', 'show_circuit'], estimatedMinutes: 4 },
    { id: 'worked-ohms-law', kind: 'worked_example', problem: 'A 9V battery powers a circuit with 3 Ω total resistance. What is the current?', steps: [
      'V = I × R → I = V / R.',
      'I = 9V / 3Ω = 3 A.',
      'Current = 3 amperes.',
    ], answer: 'I = 3 A.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A circuit has a 12V battery and a current of 2A. What is the resistance?', expectedAnswer: 'R = V / I = 12 / 2 = 6 Ω.', responseFormat: 'numeric', hints: ['V = IR → R = V/I.', 'Solve for R.'], estimatedMinutes: 2 },
    { id: 'misconception-current-used-up', kind: 'misconception_check', question: 'A friend says "current gets USED UP as it flows through a bulb — that\'s why the bulb glows." Right?', commonErrors: [{ answer: 'Yes — current used up.', misconception: 'Believing current is consumed.', correctsTo: 'Current isn\'t used up — what\'s used is ENERGY (electrons give up energy as they pass through the bulb\'s filament, lighting it). The same number of electrons leave as enter; they just have less energy. In a series circuit, current is the SAME everywhere.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Like charges repel; opposite attract.', 'Current = charge flow through conductors.', 'V = I × R (Ohm\'s law).', 'Energy is used; current is not.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
