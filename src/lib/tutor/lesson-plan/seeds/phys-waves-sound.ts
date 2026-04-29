/**
 * HS Physics — Mechanical Waves and Sound.
 * NGSS HS-PS4-1: wave properties.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_WAVES_SOUND: LessonPlan = {
  id: 'evelyn.hs.science.physics.waves-sound.v1',
  title: 'Mechanical Waves and Sound',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps4-1', description: 'Use mathematical representations to support a claim regarding relationships among the frequency, wavelength, and speed of waves traveling in various media.', standard: 'NGSS.HS-PS4-1' }],
  prerequisites: ['hs.phys.simple-harmonic-motion'], followUps: ['hs.phys.light-optics'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in everyday waves.', script: 'Sound. Earthquakes. Water ripples. Slinky pulses. All MECHANICAL WAVES — disturbances traveling through matter. They carry ENERGY but not matter — the medium just oscillates in place.', estimatedMinutes: 2 },
    { id: 'concept-wave-properties', kind: 'concept', goal: 'Waves have wavelength, frequency, amplitude, speed: v = fλ.', keyIdeas: [
      'WAVE: traveling disturbance that transfers energy through a medium.',
      'TYPES:',
      '  · TRANSVERSE: medium oscillates PERPENDICULAR to wave direction (light, water, slinky pulse sideways).',
      '  · LONGITUDINAL: medium oscillates PARALLEL to wave direction (sound, slinky compression).',
      'PROPERTIES:',
      '  · WAVELENGTH (λ): distance between wave crests.',
      '  · FREQUENCY (f): waves per second (Hz).',
      '  · AMPLITUDE (A): max displacement (loudness for sound, brightness for light).',
      '  · WAVE SPEED (v): how fast the wave travels.',
      'KEY EQUATION: v = f × λ.',
      'In a given medium, v is FIXED → if f goes up, λ goes down.',
    ], vocabulary: [{ term: 'wavelength', definition: 'distance between wave crests (λ).' }, { term: 'frequency', definition: 'waves per second, in Hz.' }, { term: 'transverse wave', definition: 'medium oscillates perpendicular to wave motion.' }, { term: 'longitudinal wave', definition: 'medium oscillates parallel to wave motion.' }], suggestedTools: ['show_diagram', 'show_equation'], estimatedMinutes: 5 },
    { id: 'concept-sound', kind: 'concept', goal: 'Sound = longitudinal pressure wave; needs medium.', keyIdeas: [
      'SOUND: a LONGITUDINAL wave of compressions + rarefactions in air (or other medium).',
      'SPEED of sound:',
      '  · In air (20°C): ~343 m/s.',
      '  · In water: ~1500 m/s (faster — water is denser).',
      '  · In steel: ~5000 m/s. Faster in solids than gases.',
      '  · In VACUUM: ZERO. No medium → no sound. (No sound in space.)',
      'PITCH = frequency. High frequency = high pitch. (Human hearing: 20 Hz to 20,000 Hz.)',
      'LOUDNESS = amplitude (in decibels, dB).',
      'DOPPLER EFFECT: source moving TOWARD you → frequency higher (siren rises in pitch). Moving AWAY → lower.',
    ], estimatedMinutes: 4 },
    { id: 'worked-wave-eq', kind: 'worked_example', problem: 'A piano A note vibrates at 440 Hz. Sound speed in air = 343 m/s. What is the wavelength?', steps: [
      'Use v = fλ → λ = v/f.',
      'λ = 343 / 440 ≈ 0.78 m.',
      'About 78 cm — comparable to length of small piano. Higher notes have shorter wavelengths.',
    ], answer: 'λ ≈ 0.78 m. Higher pitch = shorter wavelength (since v = fλ and v is fixed in air).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A water wave has wavelength 4 m and frequency 0.5 Hz. What is the wave speed?', expectedAnswer: 'v = fλ = 0.5 × 4 = 2 m/s. The wave travels at 2 m/s through the water.', responseFormat: 'numeric', hints: ['v = fλ.', 'Just multiply.'], estimatedMinutes: 3 },
    { id: 'misconception-no-sound-space', kind: 'misconception_check', question: 'A friend says "explosions in space sound loud." Right?', commonErrors: [{ answer: 'Yes — they\'re huge.', misconception: 'Movies showing space explosions with sound.', correctsTo: 'Space is a vacuum — NO MEDIUM for sound to travel through. Sound needs molecules to compress and rarefy. In space, you\'d see the explosion but hear nothing. Sci-fi movies add sound for drama, but it\'s scientifically wrong. (Light still travels — light waves don\'t need a medium.)' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['v = fλ. Wave speed = frequency × wavelength.', 'Transverse: oscillation perpendicular. Longitudinal: parallel.', 'Sound = longitudinal, needs medium. No sound in space.', 'Pitch = frequency, loudness = amplitude.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
