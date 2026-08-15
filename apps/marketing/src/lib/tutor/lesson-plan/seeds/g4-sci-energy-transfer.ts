/**
 * Grade 4 Science — Energy Transfer.
 *
 * NGSS 4-PS3-1 / 4-PS3-2 / 4-PS3-3: relate energy of moving objects
 * to speed; describe how energy can be transferred from place to
 * place (sound, light, heat, electric currents); ask questions to
 * predict outcomes when objects collide. Avoids the formal
 * KE = ½mv² equation — that's HS — but builds the intuition.
 *
 * Source: NGSS 4-PS3, OpenStax Grade 4 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_ENERGY_TRANSFER: LessonPlan = {
  id: 'evelyn.g4.science.physics.energy-transfer.v1',
  title: 'Energy Transfer',
  curriculum: 'NGSS',
  grade: '4',
  subject: 'science',
  topic: 'energy',
  locale: 'en',
  los: [
    {
      id: 'ngss.4-ps3-1',
      description: 'Use evidence to construct an explanation relating the speed of an object to the energy of that object.',
      standard: 'NGSS.4-PS3-1',
    },
    {
      id: 'ngss.4-ps3-2',
      description: 'Make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents.',
      standard: 'NGSS.4-PS3-2',
    },
  ],
  prerequisites: ['ngss.3-ps2-1'],
  followUps: ['ngss.ms-ps3-1', 'ngss.ms-ps3-5'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with a familiar example: bowling pins. Why does a fast ball knock more pins?',
      script: 'You\'ve probably bowled. Roll a slow ball at the pins — maybe one or two fall. Roll the SAME ball, but FAST — strike! Same ball, same pins. What\'s the difference between the two rolls?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-energy-of-motion',
      kind: 'concept',
      goal: 'Moving objects have energy. The faster something moves, the MORE energy it carries — and the more it can transfer when it hits something.',
      keyIdeas: [
        'ENERGY makes things happen — moving, heating, lighting up.',
        'Anything that moves has KINETIC ENERGY (energy of motion).',
        'A FAST-moving object has MORE energy than a slow one.',
        'A HEAVIER object moving the same speed has MORE energy than a lighter one (a truck vs a bicycle at 30 mph).',
        'Energy can\'t just disappear — it gets TRANSFERRED to other things or CHANGED into other forms (heat, sound, motion).',
      ],
      vocabulary: [
        { term: 'energy', definition: 'what something needs to do work — make things happen.' },
        { term: 'kinetic energy', definition: 'energy of motion. Faster = more.' },
        { term: 'transfer', definition: 'pass energy from one thing to another.' },
      ],
      suggestedTools: ['show_motion_diagram', 'show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-transfer-types',
      kind: 'concept',
      goal: 'Energy moves from place to place in multiple ways: sound, light, heat, electricity, motion.',
      keyIdeas: [
        'SOUND — vibrations that travel through air, water, or solids.',
        'LIGHT — energy that travels in waves through space (sun light, lamp light).',
        'HEAT — energy that flows from warmer things to cooler things.',
        'ELECTRICITY — energy carried by electric current through wires.',
        'MOTION (collision) — moving object hits another, transferring some/all energy.',
        'These can convert: a flashlight changes electricity → light + a little heat.',
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-bowling',
      kind: 'worked_example',
      problem: 'A bowling ball rolls slowly into the pins — 2 pins fall. The same ball is rolled fast — 8 pins fall. Explain in terms of energy transfer what changed.',
      steps: [
        'Slow ball: low kinetic energy. When it hits the first pin, it transfers a SMALL amount of energy. The pin barely moves; only a few neighbors fall.',
        'Fast ball: HIGH kinetic energy. When it hits the first pin, it transfers a LOT of energy. The pin flies hard, knocking neighbors with enough force to topple them too.',
        'Same ball, same pins — but the energy AVAILABLE to transfer changed. More speed → more energy → more pins fall.',
      ],
      answer: 'The fast ball had more kinetic energy. When it collided with the pins, more energy transferred → more pins fell.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You touch a hot pot handle and quickly pull your hand away. Where did the energy go? What KIND of energy transferred from the pot to your hand?',
      expectedAnswer: 'Heat (thermal) energy transferred from the hot pot to your hand. (And then your hand sent a fast electrical signal to your brain, which sent a motion-energy signal to your muscles to pull away.)',
      responseFormat: 'free',
      hints: [
        'What kind of energy is associated with hot things?',
        'When something hot touches something cooler, energy flows in which direction?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-energy-disappears',
      kind: 'misconception_check',
      question: 'A child rolls a ball across the carpet. The ball slows down and stops. A friend says "the energy disappeared." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — the energy is gone.',
          misconception: 'Believing energy can disappear.',
          correctsTo: 'Energy doesn\'t disappear — it gets TRANSFERRED to other forms. The ball\'s kinetic energy turned into a tiny bit of HEAT (from friction with the carpet) and a tiny bit of SOUND. The total energy is still the same; it\'s just spread out and harder to see.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Moving things have energy — faster = more.',
        'Energy can transfer by sound, light, heat, electricity, or collision.',
        'Energy doesn\'t disappear — it changes form.',
        'A heavier OR faster object carries more energy.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
