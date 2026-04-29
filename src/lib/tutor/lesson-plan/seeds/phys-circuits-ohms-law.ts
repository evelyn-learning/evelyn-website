/**
 * HS Physics — Circuits and Ohm's Law.
 * Voltage, current, resistance.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_CIRCUITS_OHMS_LAW: LessonPlan = {
  id: 'evelyn.hs.science.physics.circuits-ohms-law.v1',
  title: "Electric Circuits and Ohm's Law",
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-3', description: 'Design, build, and refine a device that works within given constraints to convert one form of energy into another form of energy.', standard: 'NGSS.HS-PS3-3' }],
  prerequisites: ['hs.phys.electric-charge-coulomb'], followUps: ['hs.phys.magnetism'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday circuits.', script: 'Flip a light switch. Charge your phone. Start your car. All circuits — paths for electric charge to flow. The math that runs them is simple: Ohm\'s Law. V = IR.', estimatedMinutes: 2 },
    { id: 'concept-vir', kind: 'concept', goal: 'Voltage drives current; resistance opposes it. V = IR.', keyIdeas: [
      'CIRCUIT: closed loop of conductors with a power source (battery, plug).',
      'CHARGE flows as CURRENT (I) — moving electrons.',
      'VOLTAGE (V): "electric pressure." Pushes charge through circuit. Units: VOLTS.',
      'CURRENT (I): rate of charge flow. Units: AMPERES (A) = coulombs/second.',
      'RESISTANCE (R): how much a wire/component opposes current. Units: OHMS (Ω).',
      'OHM\'S LAW: V = I × R.',
      'WATER ANALOGY: Voltage = pressure. Current = flow rate. Resistance = pipe narrowness.',
      'POWER (P) = energy/time = V × I (watts).',
      '  · Light bulbs labeled in watts: brightness = power consumed.',
    ], vocabulary: [{ term: 'voltage', definition: 'electric potential difference (volts).' }, { term: 'current', definition: 'flow of charge (amperes).' }, { term: 'resistance', definition: 'opposition to current (ohms).' }], suggestedTools: ['show_equation', 'show_diagram'], estimatedMinutes: 5 },
    { id: 'concept-series-parallel', kind: 'concept', goal: 'Series and parallel circuits combine differently.', keyIdeas: [
      'SERIES: components in a single line.',
      '  · Same CURRENT flows through each.',
      '  · Voltage divides across each (V_total = V₁ + V₂ + ...).',
      '  · Total resistance: R_total = R₁ + R₂ + ...',
      '  · One break → all stop (old Christmas lights).',
      'PARALLEL: components on separate branches.',
      '  · Same VOLTAGE across each.',
      '  · Current divides between branches.',
      '  · Total resistance: 1/R_total = 1/R₁ + 1/R₂ + ... (lower than smallest).',
      '  · One break → others still work (your house wiring).',
    ], estimatedMinutes: 4 },
    { id: 'worked-bulb', kind: 'worked_example', problem: 'A light bulb has resistance 240 Ω plugged into 120 V. (a) What current flows? (b) What power does it use?', steps: [
      '(a) Use Ohm\'s Law: V = IR → I = V/R = 120 / 240 = 0.5 A.',
      '(b) Power: P = V × I = 120 × 0.5 = 60 W.',
      'A 60-watt bulb at 120 V draws 0.5 A through 240 Ω of filament.',
    ], answer: '(a) I = 0.5 A. (b) P = 60 W.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Two 10 Ω resistors in series share a 20 V battery. What current flows? What if they were in parallel instead?', expectedAnswer: 'SERIES: R_total = 10 + 10 = 20 Ω. I = V/R = 20/20 = 1 A. PARALLEL: 1/R = 1/10 + 1/10 = 2/10 → R = 5 Ω. I = 20/5 = 4 A. Same battery, same resistors — parallel draws 4x the current because total resistance is lower.', responseFormat: 'numeric', hints: ['Series: add resistance. Parallel: reciprocal sum.', 'Then I = V/R.'], estimatedMinutes: 3 },
    { id: 'misconception-current-used-up', kind: 'misconception_check', question: 'A friend says "the bulb uses up the current — that\'s why it\'s less on the other side." Right?', commonErrors: [{ answer: 'Yes — current is consumed.', misconception: 'Believing current is used up.', correctsTo: 'CURRENT is NOT consumed — it FLOWS through the bulb unchanged. What\'s used is ENERGY: the bulb converts electrical energy → light + heat. Same number of electrons enter and leave the bulb. Power (V×I) is what\'s consumed.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['V = IR (Ohm\'s Law).', 'Power: P = VI (watts).', 'Series: same I, voltage divides. R_total = ΣR.', 'Parallel: same V, current divides. 1/R_total = Σ(1/R).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
