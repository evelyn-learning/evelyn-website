/**
 * HS Physics — Magnetism.
 * NGSS HS-PS2-5: relationship of electric current and magnetic field.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_MAGNETISM: LessonPlan = {
  id: 'evelyn.hs.science.physics.magnetism.v1',
  title: 'Magnetism',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-5', description: 'Plan and conduct an investigation to provide evidence that an electric current can produce a magnetic field and that a changing magnetic field can produce an electric current.', standard: 'NGSS.HS-PS2-5' }],
  prerequisites: ['hs.phys.circuits-ohms-law'], followUps: ['hs.phys.em-induction'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in compass needle.', script: 'A compass needle points north — Earth is one big magnet. A wire carrying current creates a magnetic field. The link between electricity and magnetism is the foundation of motors, generators, hard drives, MRI scanners — all modern technology.', estimatedMinutes: 2 },
    { id: 'concept-fields', kind: 'concept', goal: 'Magnets have north and south poles; like repels, opposite attracts; field lines go N→S.', keyIdeas: [
      'MAGNETS have NORTH and SOUTH poles. Like poles REPEL, opposite ATTRACT.',
      'MAGNETIC FIELD (B): the region around a magnet where it exerts force.',
      '  · Field lines go FROM north pole TO south pole (outside the magnet).',
      '  · Inside the magnet, lines run S → N (closed loops).',
      'NO MAGNETIC MONOPOLES exist — every magnet has BOTH poles.',
      'Cut a magnet in half → still get N and S poles on each piece.',
      'EARTH has a magnetic field — geographic North is actually a magnetic SOUTH (which is why a compass\'s "north" is attracted to it).',
      'FERROMAGNETIC materials (iron, cobalt, nickel) can be magnetized; most others can\'t.',
    ], vocabulary: [{ term: 'magnetic field (B)', definition: 'force-exerting region around magnet (Tesla, T).' }, { term: 'magnetic pole', definition: 'N or S end of a magnet.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-current-creates-field', kind: 'concept', goal: 'Current creates magnetic field; charges in field experience force.', keyIdeas: [
      'OERSTED\'S DISCOVERY (1820): a CURRENT in a wire produces a MAGNETIC FIELD around it.',
      'RIGHT-HAND RULE: thumb along current direction; fingers curl in the direction of the field.',
      'SOLENOID: coil of wire — concentrates field, acts like a bar magnet. Add iron core → ELECTROMAGNET (much stronger).',
      'A MOVING CHARGE in a magnetic field experiences a FORCE: F = qvB sin θ.',
      '  · Force perpendicular to BOTH velocity and B.',
      '  · Right-hand rule for direction.',
      'MOTORS: use this force on current-carrying wires to spin a rotor.',
      'EVERY ELECTRIC MOTOR (in fans, EVs, drives) uses this principle.',
    ], estimatedMinutes: 5 },
    { id: 'worked-electromagnet', kind: 'worked_example', problem: 'Walk through how an electromagnet works in a junkyard crane.', steps: [
      'An ELECTROMAGNET = coil of wire (solenoid) wrapped around an iron core.',
      'When CURRENT flows: each loop of wire creates a magnetic field.',
      'Field lines from all loops add up → strong magnetic field through the iron core.',
      'IRON enhances the field (becomes magnetized too) → much stronger pull.',
      'When the magnet is over a pile of scrap, current ON → field grabs iron objects.',
      'Move crane over the truck. Current OFF → field disappears → objects drop.',
      'KEY ADVANTAGE over permanent magnet: can be turned OFF when needed.',
    ], answer: 'Current through the coil creates a magnetic field; iron core boosts it; turning off current releases the load.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A compass needle near a wire deflects when you turn on a current. What does this prove?', expectedAnswer: 'It proves that ELECTRIC CURRENTS create MAGNETIC FIELDS. Until 1820 (Oersted\'s experiment), electricity and magnetism were thought to be unrelated. The deflection of the compass needle showed they\'re LINKED — eventually unified into electromagnetism. The discovery led to motors, generators, and ultimately to Maxwell\'s equations.', responseFormat: 'free', hints: ['What did Oersted discover?', 'Connection between two phenomena.'], estimatedMinutes: 3 },
    { id: 'misconception-magnet-only-iron', kind: 'misconception_check', question: 'A friend says "magnets only attract iron." Right?', commonErrors: [{ answer: 'Yes — only iron.', misconception: 'Limiting magnetism to iron.', correctsTo: 'Magnets attract any FERROMAGNETIC material: iron, cobalt, nickel, and some alloys (steel, neodymium magnets). Most materials (aluminum, copper, plastic, water) aren\'t attracted noticeably. Some (diamagnets) are very weakly REPELLED. Magnetism affects more than just iron.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Magnets have N and S; like repels, opposite attracts.', 'Current creates magnetic field (Oersted).', 'Moving charge in B experiences force (basis of motors).', 'Electromagnet = coil + iron core; can be turned off.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
