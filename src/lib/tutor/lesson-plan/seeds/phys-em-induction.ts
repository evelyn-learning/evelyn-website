/**
 * HS Physics — Electromagnetic Induction.
 * NGSS HS-PS2-5: changing magnetic field induces current.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_EM_INDUCTION: LessonPlan = {
  id: 'evelyn.hs.science.physics.em-induction.v1',
  title: 'Electromagnetic Induction',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-5', description: 'Plan and conduct an investigation to provide evidence that an electric current can produce a magnetic field and that a changing magnetic field can produce an electric current.', standard: 'NGSS.HS-PS2-5' }],
  prerequisites: ['hs.phys.magnetism'], followUps: ['hs.phys.modern-intro'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in generators.', script: 'Every electric power plant — coal, gas, hydro, nuclear, wind — does ONE thing: spins a magnet near a coil of wire. That\'s ELECTROMAGNETIC INDUCTION. Faraday discovered it in 1831, and now it powers civilization.', estimatedMinutes: 2 },
    { id: 'concept-faraday', kind: 'concept', goal: "A changing magnetic field induces a current. (Faraday's Law)", keyIdeas: [
      'FARADAY\'S LAW: a CHANGING magnetic flux through a coil INDUCES an EMF (voltage) and current.',
      'KEY: it must be CHANGING. A static magnetic field does nothing.',
      'WAYS to change flux:',
      '  · Move a magnet INTO or OUT of a coil.',
      '  · Move a coil INTO or OUT of a magnetic field.',
      '  · Change the strength of the field.',
      '  · Rotate the coil in a field.',
      'Faster change → larger induced EMF.',
      'EMF (electromotive force) = induced "battery effect" of the changing field.',
      'LENZ\'S LAW: induced current direction OPPOSES the change that caused it (conservation of energy).',
    ], vocabulary: [{ term: 'induction', definition: 'creation of EMF by a changing magnetic field.' }, { term: 'EMF', definition: 'electromotive force; voltage from induction.' }, { term: 'flux', definition: 'amount of magnetic field through a surface.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-applications', kind: 'concept', goal: 'Generators, transformers, induction stoves, MRI — all use induction.', keyIdeas: [
      'GENERATOR: spin a coil between magnets → flux constantly changes → AC current.',
      '  · Power plants spin coils via steam (coal, nuclear), water (hydro), or wind/sun.',
      'TRANSFORMER: two coils on iron core. Changing current in one creates changing flux → induces current in second. Used to STEP voltage UP or DOWN.',
      '  · Power lines: high-voltage long-distance, stepped down for homes.',
      'INDUCTION STOVE: changing magnetic field induces eddy currents in iron pan → pan heats up. Cooktop stays cool.',
      'WIRELESS CHARGING: same idea — coil in pad induces current in phone\'s coil.',
      'ELECTRIC GUITAR PICKUPS, METAL DETECTORS, MRI MACHINES — all use induction.',
    ], estimatedMinutes: 4 },
    { id: 'worked-generator', kind: 'worked_example', problem: 'Walk through how a hydroelectric power plant makes electricity.', steps: [
      'Water flowing through a dam pushes a TURBINE → spins.',
      'Turbine connected to a SHAFT, which spins a COIL of wire inside a strong MAGNET (or vice versa — magnet inside coil).',
      'Spinning means the magnetic flux through the coil constantly CHANGES.',
      'Faraday: changing flux → INDUCED EMF → CURRENT in the coil.',
      'Current alternates direction every half rotation → AC (alternating current).',
      'Wires carry current to transformers → step up voltage → long-distance transmission.',
      'At your house: transformer steps voltage back down → 120 V.',
    ], answer: 'Water → spinning turbine → spinning coil/magnet → changing flux → induced AC current. Faraday\'s law makes the whole grid work.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You drop a magnet through a copper tube. Why does it fall MUCH slower than through a plastic tube?', expectedAnswer: 'COPPER is a conductor. As the magnet falls, the changing flux through each ring of copper INDUCES a current. By LENZ\'S LAW, this current creates a magnetic field that OPPOSES the magnet\'s motion → drags it down slowly. PLASTIC is an insulator — no current induced, no opposing force, magnet falls at g. Demonstration of Lenz\'s law!', responseFormat: 'free', hints: ['What does the magnet do as it moves through copper?', 'Lenz\'s law — what does the induced current do?'], estimatedMinutes: 3 },
    { id: 'misconception-static-magnet-induce', kind: 'misconception_check', question: 'A friend says "any magnetic field will induce a current in a coil." Right?', commonErrors: [{ answer: 'Yes — magnetism makes current.', misconception: 'Forgetting "changing" is essential.', correctsTo: 'A STATIC magnetic field induces NOTHING. It must be CHANGING (over time). Hold a magnet motionless next to a coil → no current. MOVE it → current. The faster the change, the more current. This is the heart of Faraday\'s Law.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Faraday: CHANGING magnetic flux → induced EMF/current.', 'Lenz: induced current opposes the change (energy conservation).', 'Generators, transformers, wireless chargers — all use induction.', 'Static field does nothing — must change.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
