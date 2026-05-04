/**
 * JEE Main Physics — Waves.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_WAVES: LessonPlan = {
  id: 'evelyn.jee.phys.waves.v1',
  title: 'JEE Physics — Waves',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.waves',
      description: 'Apply wave equation, superposition, standing waves, beats, and Doppler effect to JEE problems.',
      standard: 'JEE-MAIN-PHY-WAV',
    },
  ],
  prerequisites: ['jee.phys.oscillations'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Wave problems on JEE pack a lot of physics — wavelength, frequency, speed, superposition, all in one question.',
      script: 'Sound waves, string vibrations, beats, Doppler. JEE Main pulls a wave question per year, often layered: a string fixed at both ends with a known tension, find the third harmonic. Today we lock the formulas and the standing-wave picture.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-waves',
      kind: 'concept',
      goal: 'Wave equation, speeds, harmonics, beats, Doppler.',
      keyIdeas: [
        'WAVE EQUATION: y(x, t) = A·sin(kx − ωt + φ). k = wavenumber = 2π/λ. ω = 2πf. Wave speed v = ω/k = f·λ.',
        'STRING WAVE SPEED: v = √(T/μ), where T is tension and μ is mass per unit length.',
        'SOUND IN GAS: v = √(γP/ρ) (adiabatic). At 20°C: v_air ≈ 343 m/s.',
        'STANDING WAVES on string fixed at both ends: f_n = n·v/(2L), n = 1, 2, 3, … Frequency fundamentally f₁ = v/(2L); harmonics are integer multiples.',
        'STANDING WAVES in pipe open at both ends: same as string. Pipe closed at one end: f_n = n·v/(4L) for n = 1, 3, 5, … (odd harmonics only).',
        'BEATS: superposition of two close frequencies f₁ and f₂. Beat frequency = |f₁ − f₂|. Used in tuning instruments.',
        'DOPPLER EFFECT (sound, observer/source moving): f_observed = f·(v ± v_obs)/(v ∓ v_src). Top sign for approach, bottom for receding.',
        'INTENSITY: I ∝ A² (proportional to square of amplitude). I ∝ 1/r² (point source spreading).',
        'JEE TRAP: when source AND observer move, BOTH terms enter the Doppler formula. Memorise the sign convention.',
      ],
      vocabulary: [
        { term: 'wavenumber', definition: 'k = 2π/λ; spatial analogue of angular frequency.' },
        { term: 'standing wave', definition: 'a wave pattern of fixed nodes and antinodes formed by interference of incident and reflected waves.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-string',
      kind: 'worked_example',
      problem: 'A string of length 0.5 m and mass 2 g is stretched at tension 80 N. Find the fundamental frequency and the speed of waves.',
      steps: [
        'μ = 2 × 10⁻³ kg / 0.5 m = 4 × 10⁻³ kg/m.',
        'Wave speed v = √(T/μ) = √(80 / 4e−3) = √(20 000) ≈ 141.4 m/s.',
        'Fundamental f₁ = v/(2L) = 141.4 / 1 = 141.4 Hz.',
        'Higher harmonics: 2f₁ ≈ 283 Hz, 3f₁ ≈ 424 Hz, etc.',
      ],
      answer: 'v ≈ 141 m/s; f₁ ≈ 141 Hz',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two tuning forks of frequencies 256 Hz and 260 Hz are sounded together. Find the beat frequency.',
      expectedAnswer: '4 Hz',
      responseFormat: 'numeric',
      hints: [
        'Beat frequency = |f₁ − f₂|.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-doppler-direction',
      kind: 'misconception_check',
      question: 'A car horn approaching has frequency 500 Hz. A student computes f_observed for a stationary listener using f·(v + v_src)/(v) instead of v/(v − v_src). What\'s wrong?',
      commonErrors: [
        {
          answer: 'f_obs = f·(v + v_src)/(v)',
          misconception: 'Confusing the source-velocity correction with the observer-velocity correction.',
          correctsTo: 'For a moving source approaching a stationary observer: f_observed = f·v/(v − v_src). The denominator gets smaller as source approaches → higher frequency. The (v + v_src) form would correspond to source RECEDING. Sign convention matters: observer-motion goes in the numerator, source-motion in the denominator. Direction "approaching" raises the pitch in either case.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'v = fλ. v = ω/k. y = A sin(kx − ωt).',
        'String wave speed: v = √(T/μ).',
        'String fixed ends: f_n = n·v/(2L). Pipe closed one end: f_n = n·v/(4L), n odd.',
        'Beats: |f₁ − f₂|.',
        'Doppler (moving source, stationary observer): f_obs = f·v/(v ∓ v_src).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A pipe closed at one end has length 1 m. Speed of sound 340 m/s. Find the lowest two natural frequencies.',
      hint: 'Closed-pipe formula: f_n = n·v/(4L) for n = 1, 3, 5, … Fundamental f₁ = 340/4 = 85 Hz. Next: f₃ = 3·85 = 255 Hz. (No even harmonics for closed pipe.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
