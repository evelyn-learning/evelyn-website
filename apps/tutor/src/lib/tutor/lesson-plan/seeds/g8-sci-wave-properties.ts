/**
 * Grade 8 Science — Wave Properties.
 * NGSS MS-PS4-1: use mathematical representations to describe a
 * simple model for waves.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_WAVE_PROPERTIES: LessonPlan = {
  id: 'evelyn.g8.science.physics.wave-properties.v1',
  title: 'Wave Properties: Frequency, Wavelength, Speed',
  curriculum: 'NGSS', grade: '8', subject: 'science', topic: 'waves', locale: 'en',
  los: [{ id: 'ngss.ms-ps4-1', description: 'Use mathematical representations to describe a simple model for waves that includes how the amplitude of a wave is related to the energy in a wave.', standard: 'NGSS.MS-PS4-1' }],
  prerequisites: ['ngss.4-ps4-1'], followUps: ['ngss.hs-ps4-1'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor with everyday waves.', script: 'Sound, light, water ripples — they\'re all WAVES, and they all share the same math. Once you know the formula, you can describe any wave precisely.', estimatedMinutes: 1 },
    { id: 'concept-anatomy', kind: 'concept', goal: 'Wave parts: amplitude (height), wavelength (peak-to-peak distance), frequency (cycles per second), speed (how fast the wave moves).', keyIdeas: [
      'AMPLITUDE: height from middle to peak. More energy = bigger amplitude.',
      'WAVELENGTH (λ): distance from one peak to the next.',
      'FREQUENCY (f): how many waves pass per second. Measured in Hertz (Hz).',
      'PERIOD (T): time for one wave. T = 1/f.',
      'WAVE SPEED (v): how fast the wave travels. v = f × λ.',
      '  Light: 300,000,000 m/s.',
      '  Sound in air: ~343 m/s.',
    ], vocabulary: [{ term: 'frequency', definition: 'waves per second (Hz).' }, { term: 'wavelength', definition: 'distance between peaks.' }, { term: 'period', definition: 'time for one wave.' }], suggestedTools: ['show_equation', 'show_wave'], estimatedMinutes: 5 },
    { id: 'concept-types', kind: 'concept', goal: 'Two main wave types: transverse (motion ⟂ travel direction) and longitudinal (motion ∥ travel direction).', keyIdeas: [
      'TRANSVERSE: medium moves PERPENDICULAR to wave direction. Light, water surface waves, plucked guitar string.',
      'LONGITUDINAL: medium moves PARALLEL to wave direction (compressions + rarefactions). Sound waves.',
      'Both transfer ENERGY without permanently moving the medium.',
    ], estimatedMinutes: 3 },
    { id: 'worked-radio-wave', kind: 'worked_example', problem: 'A radio station broadcasts at 100 MHz. Radio waves travel at the speed of light (3 × 10⁸ m/s). What is the wavelength?', steps: [
      'v = f × λ → λ = v / f.',
      'f = 100 MHz = 100 × 10⁶ Hz = 10⁸ Hz.',
      'λ = (3 × 10⁸) / (10⁸) = 3 meters.',
      'A 100 MHz radio wave is 3 m peak-to-peak.',
    ], answer: 'Wavelength = 3 meters.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You hear thunder 5 seconds after seeing the lightning. Sound travels ~343 m/s; light is essentially instant. How far away was the lightning?', expectedAnswer: 'Distance = speed × time = 343 × 5 ≈ 1715 m, or about 1.7 km (~1 mile).', responseFormat: 'free', hints: ['Light reaches you instantly; the delay is sound traveling.', 'Distance = speed × time.'], estimatedMinutes: 3 },
    { id: 'misconception-amplitude-and-frequency', kind: 'misconception_check', question: 'A friend says "louder sounds have higher pitch." Is this right?', commonErrors: [{ answer: 'Yes — loud = high pitch.', misconception: 'Confusing amplitude with frequency.', correctsTo: 'LOUDNESS = AMPLITUDE (energy). PITCH = FREQUENCY. A high-pitched whisper has high frequency, low amplitude. A low-pitched shout has low frequency, high amplitude. They\'re INDEPENDENT properties.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['v = f × λ.', 'Amplitude = energy. Frequency = pitch (or color for light).', 'Light = transverse + EM. Sound = longitudinal + needs medium.', 'Wavelength × frequency = wave speed.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
