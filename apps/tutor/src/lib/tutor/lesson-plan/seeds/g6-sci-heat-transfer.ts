/**
 * Grade 6 Science — Heat Transfer.
 * NGSS MS-PS3-3 / MS-PS3-4: methods of heat transfer; relationship
 * between energy transferred, type of matter, and mass.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_HEAT_TRANSFER: LessonPlan = {
  id: 'evelyn.g6.science.physics.heat-transfer.v1',
  title: 'Heat Transfer: Conduction, Convection, Radiation',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'energy', locale: 'en',
  los: [{ id: 'ngss.ms-ps3-3', description: 'Apply scientific principles to design, construct, and test a device that either minimizes or maximizes thermal energy transfer.', standard: 'NGSS.MS-PS3-3' }],
  prerequisites: ['ngss.4-ps3-2'], followUps: ['ngss.hs-ps3-4'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in three different transfer methods at once.', script: 'Sit by a campfire. Your face FEELS warm — that\'s heat reaching you across air without touching. Hold a metal stick in the fire — the END you\'re holding gets HOT after a while. The hot air RISES off the fire. Three different ways heat moves: all happening at once.', estimatedMinutes: 2 },
    { id: 'concept-three-types', kind: 'concept', goal: 'Three modes of heat transfer: conduction (touch), convection (fluids), radiation (waves through space).', keyIdeas: [
      'CONDUCTION: heat through DIRECT CONTACT. Atoms vibrate and pass energy to neighbors. Metals are great conductors; wood/plastic are poor (insulators).',
      'CONVECTION: heat through FLOWING FLUIDS (liquids or gases). Hot fluid is less dense → rises. Cool fluid sinks. Creates convection currents (boiling water, weather, ocean currents).',
      'RADIATION: heat through ELECTROMAGNETIC WAVES. No medium needed. Sun warms Earth across empty space this way. Fires + hot stoves radiate heat outward.',
      'Most everyday heating involves all three at once.',
    ], vocabulary: [{ term: 'conduction', definition: 'heat through direct contact.' }, { term: 'convection', definition: 'heat through fluid motion.' }, { term: 'radiation', definition: 'heat through electromagnetic waves.' }, { term: 'insulator', definition: 'a material that resists heat transfer.' }], estimatedMinutes: 5 },
    { id: 'concept-direction-of-flow', kind: 'concept', goal: 'Heat ALWAYS flows from HOTTER to COOLER until they\'re the same temperature.', keyIdeas: [
      'No exceptions: heat NEVER flows from cold to hot on its own.',
      'You don\'t add "cold" to a drink — you ADD ICE which lets heat flow from the drink INTO the ice (melting it).',
      'Equilibrium: when both objects reach the same temperature, heat flow stops.',
    ], estimatedMinutes: 3 },
    { id: 'worked-soup-spoon', kind: 'worked_example', problem: 'You leave a metal spoon in a bowl of hot soup. After a minute the spoon\'s handle is hot. What kind of heat transfer is happening?', steps: [
      'The hot soup directly TOUCHES the spoon\'s bowl-end.',
      'Heat conducts through the metal — atoms in the bowl-end vibrate, hit neighbors, who hit their neighbors.',
      'Energy travels along the spoon to the handle.',
      'CONDUCTION (direct touch through solid).',
      'There\'s also some CONVECTION in the soup (hot soup at the bottom rises) and RADIATION from the bowl, but the spoon-handle effect is conduction.',
    ], answer: 'CONDUCTION through the metal spoon.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You hold your hand a foot ABOVE a hot iron skillet (don\'t touch). You feel warmth. What kind of heat transfer? What if you put your hand a foot to the SIDE of the skillet?', expectedAnswer: 'ABOVE: convection (hot air rises from the skillet directly to your hand) AND radiation. SIDE: mostly RADIATION (hot air goes up, not sideways) — direct heat waves reach you.', responseFormat: 'free', hints: ['Above: hot air goes which way?', 'Side: no rising air contacts your hand — what else?'], estimatedMinutes: 3 },
    { id: 'misconception-cold-flows', kind: 'misconception_check', question: 'A friend says "when I open the freezer, COLD air flows OUT." Is cold a thing that flows?', commonErrors: [{ answer: 'Yes — cold flows.', misconception: 'Treating cold as something that moves.', correctsTo: 'COLD is just LESS HEAT. Heat ALWAYS flows from hot to cold. When you open a freezer, HEAT from your warm kitchen flows IN. The "cold feeling" is heat leaving your skin (which feels cold to you). There\'s no separate "cold" substance.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Three types: conduction (touch), convection (fluid), radiation (waves).', 'Heat flows from hot to cold, never reverse.', 'Insulators slow heat transfer.', 'Cold isn\'t a thing — it\'s lack of heat.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
