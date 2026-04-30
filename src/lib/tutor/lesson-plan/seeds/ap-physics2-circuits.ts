/**
 * AP Physics 2 — DC circuits.
 *
 * Series and parallel resistors, Kirchhoff\'s laws, RC circuits.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_CIRCUITS: LessonPlan = {
  id: 'evelyn.ap.physics2.circuits.v1',
  title: 'DC circuits: series, parallel, Kirchhoff',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.circuits',
      description: 'Analyze DC circuits using Ohm\'s law, series/parallel rules, and Kirchhoff\'s laws.',
      standard: 'AP-PHYS2-CKT',
    },
  ],
  prerequisites: ['phys.circuits-ohms-law'],
  followUps: ['apphys2.magnetism'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame circuits as solvable using two simple laws.',
      script: 'Every electronic device — phone, laptop, EV — runs on circuits. The two LAWS that solve any of them, no matter how complex, are simple: Kirchhoff\'s voltage law (loop sum = 0) and current law (junction in = out). Today: how to use them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Ohm\'s law + series/parallel + Kirchhoff + RC.',
      keyIdeas: [
        'OHM\'S LAW: V = IR. Voltage across a resistor = current through it × resistance.',
        'POWER: P = IV = I²R = V²/R.',
        'SERIES RESISTORS: total R = R₁ + R₂ + …. Current SAME through each. Voltage SPLITS.',
        'PARALLEL RESISTORS: 1/R_total = 1/R₁ + 1/R₂ + …. Voltage SAME across each. Current SPLITS.',
        '   For two resistors in parallel: R_total = R₁R₂/(R₁+R₂).',
        'KIRCHHOFF\'S CURRENT LAW (KCL): sum of currents INTO a node = sum of currents OUT. Conservation of charge.',
        'KIRCHHOFF\'S VOLTAGE LAW (KVL): sum of voltages around any closed loop = 0. Conservation of energy.',
        'CAPACITORS in DC: charge up at startup, then act as OPEN circuits at steady state (no current).',
        'RC CIRCUIT: capacitor charging through resistor. Time constant τ = RC. After ~5τ, fully charged. Voltage rises exponentially: V(t) = V_max(1 − e^(−t/RC)).',
      ],
      vocabulary: [
        { term: 'Kirchhoff\'s laws', definition: 'two rules for analyzing circuits: KCL (current at nodes) and KVL (voltage around loops).' },
        { term: 'time constant', definition: 'τ = RC; characterizes how fast an RC circuit responds.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-series-parallel',
      kind: 'worked_example',
      problem: 'A 12 V battery connects to two resistors in parallel: R₁ = 4 Ω and R₂ = 6 Ω. Find total current.',
      steps: [
        'Parallel: 1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12. R_total = 12/5 = 2.4 Ω.',
        'Total current: I = V/R = 12/2.4 = 5 A.',
        'Check by computing each branch: I₁ = 12/4 = 3 A, I₂ = 12/6 = 2 A. Total = 3 + 2 = 5 A ✓.',
      ],
      answer: '5 A',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rc',
      kind: 'worked_example',
      problem: 'A 100 μF capacitor charges through a 10 kΩ resistor connected to a 5 V battery. What\'s the time constant? How long until charge reaches ~63%?',
      steps: [
        'τ = RC = 10,000 · 100 × 10⁻⁶ = 1 second.',
        'After τ = 1 second, capacitor is at 1 − 1/e ≈ 63% charged.',
        'After 5τ ≈ 5 seconds, ~99% charged — practically full.',
      ],
      answer: 'τ = 1 s; ~63% charged after 1 s',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two 6 Ω resistors are in SERIES with a 12 V battery. Find current.',
      expectedAnswer: '1 A',
      responseFormat: 'numeric',
      hints: [
        'Series: R = 6 + 6 = 12 Ω.',
        'I = V/R = 12/12 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parallel-bigger',
      kind: 'misconception_check',
      question: 'Is the total resistance of resistors in parallel BIGGER than each individual resistance?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Adding resistances in parallel.',
          correctsTo: 'No — parallel resistance is SMALLER than the smallest resistor. More PATHS for current → less total resistance. Series adds up; parallel reduces.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'V = IR. P = IV.',
        'Series: R adds; current same. Parallel: 1/R adds; voltage same.',
        'KCL: in = out at nodes. KVL: voltages sum to 0 around loops.',
        'Capacitor at steady state in DC = open circuit.',
        'RC time constant: τ = RC.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is house wiring in parallel rather than series?',
      hint: 'Parallel = same voltage at every outlet. One device failure doesn\'t kill the rest. Series would mean one bulb out kills all bulbs (old Christmas lights). Parallel is more reliable and consistent.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
