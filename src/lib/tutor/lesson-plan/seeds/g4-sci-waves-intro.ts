/**
 * Grade 4 Science — Waves Intro.
 * NGSS 4-PS4-1: develop a model of waves to describe patterns in
 * terms of amplitude and wavelength.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_WAVES_INTRO: LessonPlan = {
  id: 'evelyn.g4.science.physics.waves-intro.v1',
  title: 'Waves: Patterns We Can See and Hear',
  curriculum: 'NGSS', grade: '4', subject: 'science', topic: 'waves', locale: 'en',
  los: [{ id: 'ngss.4-ps4-1', description: 'Develop a model of waves to describe patterns in terms of amplitude and wavelength and that waves can cause objects to move.', standard: 'NGSS.4-PS4-1' }],
  prerequisites: ['ngss.1-ps4-1'], followUps: ['ngss.ms-ps4-1'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in a familiar wave.', script: 'Drop a pebble in a pond. Ripples spread out in circles. Now think about ocean waves rolling toward shore. Same idea — waves are patterns moving through something.', estimatedMinutes: 1 },
    { id: 'concept-wave-parts', kind: 'concept', goal: 'Waves have measurable parts: amplitude (height) and wavelength (distance between peaks). Sound waves and light waves both follow this pattern.', keyIdeas: [
      'A WAVE is a pattern of motion that travels through a medium (water, air, etc.) without the medium itself moving very far.',
      'AMPLITUDE: the HEIGHT of the wave from middle to peak. Bigger amplitude = MORE energy. Loud sound = big amplitude.',
      'WAVELENGTH: the distance from one peak to the next. Short wavelength = HIGH-pitched sound or BLUE light. Long wavelength = LOW-pitched sound or RED light.',
      'FREQUENCY: how many waves pass per second. Faster = higher pitch / bluer light.',
      'Waves can move objects (a wave on the ocean lifts a boat) — they carry ENERGY.',
    ], vocabulary: [{ term: 'amplitude', definition: 'the height of a wave (energy).' }, { term: 'wavelength', definition: 'distance between wave peaks.' }, { term: 'frequency', definition: 'how often waves pass per second.' }], estimatedMinutes: 5 },
    { id: 'worked-loud-vs-soft', kind: 'worked_example', problem: 'A whisper and a shout both make sound waves. What\'s different about the waves?', steps: [
      'Both are SOUND waves traveling through air.',
      'WHISPER: small AMPLITUDE — quiet, low energy.',
      'SHOUT: large AMPLITUDE — loud, more energy.',
      'PITCH (highness/lowness) might be similar — that\'s WAVELENGTH/FREQUENCY, a different property.',
      'So loudness = amplitude. Pitch = wavelength.',
    ], answer: 'Same wavelength (similar pitch), but the shout has much bigger amplitude (more energy).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A red light wave and a blue light wave both travel at the same speed. The blue wave has a shorter wavelength than the red. Which has higher frequency?', expectedAnswer: 'blue (shorter wavelength = higher frequency at the same speed)', responseFormat: 'free', hints: ['Same speed, but blue waves are packed tighter. How many pass per second?'], estimatedMinutes: 3 },
    { id: 'misconception-water-moves-with-wave', kind: 'misconception_check', question: 'A friend says "ocean waves carry water across the ocean — that\'s how the wave gets to shore." Right?', commonErrors: [{ answer: 'Yes — the water travels with the wave.', misconception: 'Confusing wave motion with water transport.', correctsTo: 'The water itself mostly STAYS PUT, just moving up and down as the wave passes. The wave PATTERN travels — but the water doesn\'t go very far. A buoy on the water bobs up and down without drifting along with the wave.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Waves carry energy without much net motion of the medium.', 'Amplitude = height (energy/loudness/brightness).', 'Wavelength = distance between peaks.', 'Frequency = waves per second; opposite of wavelength.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
