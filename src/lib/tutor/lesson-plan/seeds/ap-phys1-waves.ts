/**
 * AP Physics 1 — Mechanical Waves and Sound.
 *
 * Wave equation, transverse vs longitudinal, superposition, standing waves on strings/in pipes.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_WAVES: LessonPlan = {
  id: 'evelyn.ap.physics1.waves.v1',
  title: 'Mechanical Waves and Sound',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys1.waves',
      description: 'Apply the wave equation v = fλ, identify transverse and longitudinal waves, and find harmonic frequencies for standing waves on strings and in pipes.',
      standard: 'AP-PHYS1-6.A',
    },
  ],
  prerequisites: ['apphys1.shm'],
  followUps: ['apphys2.optics'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Waves transport energy without transporting matter.',
      script: 'Watch a wave roll across the ocean. The water itself doesn\'t travel from far away — only the disturbance does. That\'s the key: waves carry energy, not matter. Pluck a guitar string and the same idea makes the music. One equation, v = fλ, ties the whole picture together.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equation',
      kind: 'concept',
      goal: 'Wave equation, types, and standing waves.',
      keyIdeas: [
        'WAVE EQUATION: v = f·λ. Speed equals frequency times wavelength. Speed depends on the MEDIUM (string tension, density, temperature for sound), NOT on f or λ.',
        'TRANSVERSE: medium oscillates perpendicular to wave direction. String, light. LONGITUDINAL: medium oscillates parallel to wave direction. Sound in air.',
        'SUPERPOSITION: when two waves overlap, the displacements add. Constructive (in phase, amplitudes add). Destructive (out of phase, cancel).',
        'STANDING WAVES on a fixed-fixed string: nodes at both ends. Wavelengths fit: λ_n = 2L/n for n = 1, 2, 3, ... Frequencies: f_n = n·v/(2L). Fundamental (n=1) lowest; harmonics integer multiples.',
        'PIPE OPEN AT BOTH ENDS (or closed at both): same as string. λ_n = 2L/n. Harmonics: f, 2f, 3f, ...',
        'PIPE CLOSED AT ONE END: closed end is a node, open end is an antinode. λ_n = 4L/n for n = 1, 3, 5, ... ONLY ODD harmonics. f_n = n·v/(4L).',
        'SPEED OF SOUND in air ≈ 343 m/s at room temp. SPEED on string: v = √(T/μ) where T is tension, μ is mass per length.',
      ],
      vocabulary: [
        { term: 'wavelength', definition: 'distance between two consecutive crests (or any two corresponding points).' },
        { term: 'standing wave', definition: 'pattern formed by two waves of equal frequency traveling in opposite directions; nodes don\'t move.' },
        { term: 'harmonic', definition: 'an allowed standing-wave frequency; integer multiple of fundamental for open systems.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-string',
      kind: 'worked_example',
      problem: 'A guitar string of length 0.65 m vibrates at a fundamental frequency of 200 Hz. Find the wave speed and the third harmonic frequency.',
      steps: [
        'Fundamental: λ_1 = 2L = 2·0.65 = 1.30 m.',
        'Wave speed: v = f·λ = 200·1.30 = 260 m/s.',
        'Third harmonic: f_3 = 3·f_1 = 3·200 = 600 Hz.',
        'Check: λ_3 = 2L/3 = 0.433 m. v = f_3·λ_3 = 600·0.433 = 260 m/s. ✓',
      ],
      answer: 'v = 260 m/s, f_3 = 600 Hz',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A pipe open at both ends has length 0.5 m. The speed of sound is 340 m/s. Find the fundamental frequency.',
      expectedAnswer: '340 Hz',
      responseFormat: 'numeric',
      hints: [
        'Open both ends: λ_1 = 2L.',
        'f = v / λ.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-medium',
      kind: 'misconception_check',
      question: 'A high-pitched sound and a low-pitched sound from the same speaker — does the high-pitched one travel faster?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating frequency as the cause of speed.',
          correctsTo: 'No — both travel at the same speed (~343 m/s in air). Speed is set by the medium, NOT the wave\'s frequency. The high-pitched sound has shorter wavelength to compensate (v = fλ). If high f always meant high v, you\'d hear the cymbals before the bass at a concert. You don\'t.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'v = f·λ. Speed set by medium, not frequency.',
        'Transverse: oscillation ⊥ propagation (string). Longitudinal: oscillation ∥ propagation (sound).',
        'String / open-open pipe: f_n = n·v/(2L), n = 1,2,3,...',
        'Closed-end pipe: f_n = n·v/(4L), n = 1,3,5,... (odd only).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You blow across the top of a soda bottle and hear a pitch. Drink half the soda and try again. Does the pitch go up or down?',
      hint: 'Closed at the bottom (water), open at the top. Less air column → smaller L → larger f → pitch goes UP. The wave reflects off the water surface like off a closed pipe end.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
