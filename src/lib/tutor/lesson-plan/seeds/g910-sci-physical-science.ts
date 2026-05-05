/**
 * High School (9-10) Physical Science.
 *
 * Newton's laws, energy conservation, waves, electricity at a HS level.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_PHYSICAL_SCIENCE: LessonPlan = {
  id: 'evelyn.science.9-10.physical-science.v1',
  title: 'HS physical science — motion, energy, waves, electricity',
  curriculum: 'NGSS',
  grade: '9',
  subject: 'science',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'hsphys.anchors',
      description: 'Apply Newton\'s laws and energy conservation; describe waves and basic electric circuits.',
      standard: 'HS-PS2',
    },
  ],
  prerequisites: ['g6-8.physics-basics'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame physical science as a small set of conservation laws.',
      script: 'Physics has 50 equations on the AP-1 sheet. But underneath: a few CONSERVATION LAWS. Mass, energy, momentum, charge — none get created or destroyed, only moved or transformed. Once you see a problem in those terms, the equations are bookkeeping.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-physical',
      kind: 'concept',
      goal: 'Newton + energy + waves + circuits.',
      keyIdeas: [
        'NEWTON\'S 1st: object at rest stays at rest, in motion stays in motion, unless acted on by net force. Inertia.',
        'NEWTON\'S 2nd: F = ma. Net force = mass × acceleration. The big equation.',
        'NEWTON\'S 3rd: every action has equal-and-opposite reaction. Pairs act on DIFFERENT objects.',
        'ENERGY CONSERVATION: energy isn\'t created or destroyed, only transformed. KE = ½ mv², PE = mgh.',
        'WAVES: oscillations that transport energy without transporting mass. Wavelength × frequency = speed.',
        'TRANSVERSE waves (light, water surface): oscillation perpendicular to motion. LONGITUDINAL (sound): parallel.',
        'OHM\'S LAW: V = IR. Voltage drives current through resistance.',
        'POWER: P = IV. Watt = volt × amp. Energy = power × time.',
      ],
      vocabulary: [
        { term: 'inertia', definition: 'the tendency of objects to resist changes in motion (Newton\'s first law).' },
        { term: 'wavelength', definition: 'distance between successive crests of a wave.' },
        { term: 'voltage', definition: 'electric potential difference; "pressure" pushing current through a circuit.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-falling',
      kind: 'worked_example',
      problem: 'A 2 kg ball is dropped from 5 m. Using energy conservation, find its speed just before hitting the ground.',
      steps: [
        'Initial: at rest, height 5 m. PE = mgh = 2 × 9.8 × 5 = 98 J. KE = 0.',
        'Just before landing: height 0, all PE converted to KE.',
        'KE = 98 J = ½ m v² = ½ × 2 × v² = v².',
        'v² = 98. v = √98 ≈ 9.9 m/s.',
        'Notice mass cancels — drop a feather and a hammer in vacuum, both reach the ground at the same speed.',
      ],
      answer: '~9.9 m/s',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 12 V battery is connected across a 4 Ω resistor. What current flows?',
      expectedAnswer: 'I = V/R = 12/4 = 3 A',
      responseFormat: 'free',
      hints: [
        'Use Ohm\'s law.',
        'Solve for I.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-newton-3',
      kind: 'misconception_check',
      question: 'A horse pulls a cart. Both feel equal-and-opposite forces by Newton\'s 3rd law. So how does the cart ever move?',
      commonErrors: [
        {
          answer: 'they cancel',
          misconception: 'Forgetting that 3rd-law pairs act on DIFFERENT objects.',
          correctsTo: 'The action-reaction pair is horse pulls cart, cart pulls horse — different objects. To analyze the cart\'s motion, look at forces ON THE CART: horse pulls forward, friction pushes backward. If horse-pull > friction, net force forward, cart accelerates. The 3rd-law force on the horse doesn\'t enter the cart\'s equation at all. Only forces on the same object can cancel its acceleration.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F = ma. Sum forces on ONE object.',
        'Newton\'s 3rd law pairs act on DIFFERENT objects.',
        'Energy: KE = ½mv², PE = mgh. Conserved in absence of friction.',
        'Waves: λf = v. Transverse vs longitudinal.',
        'Ohm: V = IR. Power: P = IV.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In Einstein\'s relativity, energy and mass are equivalent (E = mc²). Does that violate energy conservation?',
      hint: 'No — it EXTENDS it. Mass and energy together are conserved. Nuclear reactions convert tiny amounts of mass to enormous energy (a gram of mass = ~25 GWh). The classical laws still hold for everyday motion; Einstein\'s extension matters at high speeds and in nuclear processes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
