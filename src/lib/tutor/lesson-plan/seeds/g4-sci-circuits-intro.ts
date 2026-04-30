/**
 * G4 — Electric circuits intro.
 *
 * What a circuit is, complete vs incomplete, conductors vs
 * insulators, simple bulb-and-battery setup. Builds toward G6 series
 * and G8 electricity.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_CIRCUITS_INTRO: LessonPlan = {
  id: 'evelyn.g4.sci.physical.circuits-intro.v1',
  title: 'Electric circuits: complete loops',
  curriculum: 'NGSS',
  grade: '4',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.4-ps3.b',
      description: 'Apply scientific ideas to design, test, and refine a device that converts energy from one form to another using electric current.',
      standard: 'NGSS.4-PS3-4',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ps2.b'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie circuits to everyday objects.',
      script: 'Click a flashlight on. Bulb lights. Click off. Bulb dies. What\'s happening INSIDE? Electricity is FLOWING in a loop — that loop is called a circuit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-loop',
      kind: 'concept',
      goal: 'A circuit is a closed loop; current flows only when the loop is complete.',
      keyIdeas: [
        'CIRCUIT: a path that lets electricity FLOW in a loop, from a power source, through a device, and back.',
        'Three parts of a basic circuit: ENERGY SOURCE (battery), WIRES (path), LOAD (something that uses the energy — bulb, motor).',
        'COMPLETE (closed) circuit: loop is unbroken → electricity flows → bulb lights.',
        'INCOMPLETE (open) circuit: any break in the loop → no flow → no light. A switch works by breaking/closing the loop.',
        'CONDUCTOR: a material electricity flows through easily. METALS (copper, aluminum) are conductors.',
        'INSULATOR: a material electricity does NOT flow through. RUBBER, PLASTIC, GLASS, WOOD are insulators. Wires are usually copper inside, plastic outside — conductor wrapped in insulator.',
      ],
      vocabulary: [
        { term: 'circuit', definition: 'a complete loop allowing electricity to flow.' },
        { term: 'conductor', definition: 'a material electricity flows through easily.' },
        { term: 'insulator', definition: 'a material that blocks electrical flow.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-flashlight',
      kind: 'worked_example',
      problem: 'Why doesn\'t a flashlight bulb light when the battery is removed?',
      steps: [
        'The flashlight needs an ENERGY SOURCE — that\'s the battery.',
        'Without a battery, no electricity flows from anywhere.',
        'Even if the wires and bulb are all good, there\'s nothing pushing the current → no light.',
        'Same logic: dead battery = no chemical energy left to push current.',
      ],
      answer: 'no energy source → no current → no light',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You build a circuit with a battery, wires, and a bulb. The bulb doesn\'t light. You realize one wire is touching the bulb but the other wire is just floating in the air. Why doesn\'t it work?',
      expectedAnswer: 'the circuit is open/incomplete',
      responseFormat: 'free',
      hints: [
        'For current to flow, the loop must be COMPLETE — every part connected.',
        'A floating wire breaks the loop.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-electricity-stored',
      kind: 'misconception_check',
      question: 'Does electricity sit STORED in the wires, just waiting to come out?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating wires as containers of electricity.',
          correctsTo: 'No — electrons are always in the wire (they\'re part of the metal atoms). What changes when you complete the circuit is whether they\'re FLOWING. Battery PUSHES them in a direction — the flow is the current.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A CIRCUIT is a complete loop: source → wires → load → back.',
        'Open/incomplete = no flow. Complete = flow.',
        'Conductors (metals) carry current. Insulators (rubber, plastic) block it.',
        'Switches work by opening or closing the loop.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are electrical wires made of COPPER on the inside but PLASTIC on the outside?',
      hint: 'Inside: needs to conduct electricity (copper is a great conductor). Outside: needs to PROTECT from accidental shocks (plastic is a great insulator).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
