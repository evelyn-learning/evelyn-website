/**
 * Grade 8 Science — Sound and Light Waves.
 * NGSS MS-PS4-2: model how waves are reflected, absorbed, transmitted.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_SOUND_LIGHT: LessonPlan = {
  id: 'evelyn.g8.science.physics.sound-light.v1',
  title: 'Sound and Light Waves Compared',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'waves', locale: 'en',
  los: [{ id: 'ngss.ms-ps4-2', description: 'Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials.', standard: 'NGSS.MS-PS4-2' }],
  prerequisites: ['ngss.ms-ps4-1'], followUps: ['ngss.hs-ps4-3'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in shared and different behavior.', script: 'Sound and light are both WAVES. Both reflect, both bend, both can be loud/bright. But they\'re also fundamentally different — light works in space; sound doesn\'t.', estimatedMinutes: 2 },
    { id: 'concept-similarities', kind: 'concept', goal: 'Both reflect (echo / mirror), refract (bend), absorb, and transmit.', keyIdeas: [
      'REFLECTION: wave bounces off a surface. Sound → echo. Light → mirror.',
      'REFRACTION: wave BENDS when entering a new medium. Sound bends through air with different temperatures; light bends going from air to water (a straw looks broken in a glass).',
      'ABSORPTION: medium absorbs the wave (carpet absorbs sound; black paint absorbs light → becomes warm).',
      'TRANSMISSION: wave passes through (sound through walls; light through windows).',
      'A surface usually does ALL THREE: reflects some, absorbs some, transmits some.',
    ], vocabulary: [{ term: 'reflection', definition: 'wave bounces off.' }, { term: 'refraction', definition: 'wave bends entering new medium.' }, { term: 'absorption', definition: 'wave is absorbed.' }, { term: 'transmission', definition: 'wave passes through.' }], estimatedMinutes: 4 },
    { id: 'concept-differences', kind: 'concept', goal: 'Sound needs a medium; light doesn\'t. Sound is mechanical; light is electromagnetic.', keyIdeas: [
      'SOUND: longitudinal wave, MUST have a medium (air, water, solid). NO sound in vacuum.',
      'LIGHT: transverse electromagnetic wave, can travel through VACUUM. That\'s why we see the sun.',
      'SOUND speed: ~343 m/s in air, faster in water/solids.',
      'LIGHT speed: ~300,000,000 m/s — about a million times faster than sound.',
      'That\'s why thunder lags lightning — and why "explosions in space" silently in real life.',
    ], estimatedMinutes: 4 },
    { id: 'worked-echo', kind: 'worked_example', problem: 'You shout "hello" toward a cliff and hear an echo 4 seconds later. How far away is the cliff? (Sound speed = 343 m/s.)', steps: [
      'Sound traveled to cliff AND back in 4 sec — round trip.',
      'One-way time = 2 sec.',
      'Distance = speed × time = 343 × 2 = 686 m.',
      'Cliff is about 686 m away.',
    ], answer: 'About 686 m. (Echo is round-trip; cliff distance is half.)', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You shine a laser pointer at a wall. The dot is bright on the wall. You then shine the laser at a thick black curtain. Why does the dot disappear?', expectedAnswer: 'The wall REFLECTS most light (you see the dot). The black curtain ABSORBS most light → little reflects back → you don\'t see a dot.', responseFormat: 'free', hints: ['What does "black" do to light?', 'Compare reflection vs absorption.'], estimatedMinutes: 2 },
    { id: 'misconception-vacuum-sound', kind: 'misconception_check', question: 'In space movies, explosions are LOUD. Realistic?', commonErrors: [{ answer: 'Yes — sound in space.', misconception: 'Believing sound travels through vacuum.', correctsTo: 'NO. Sound needs a medium (air/water/solid) to vibrate. In space\'s vacuum there\'s no medium → no sound. Light still travels (different physics — EM waves don\'t need a medium). Real explosions in space would be SILENT.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Both sound + light: reflect, refract, absorb, transmit.', 'Sound needs a medium; light doesn\'t.', 'Light is ~1,000,000× faster than sound.', 'Black absorbs light; mirrors reflect it.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
