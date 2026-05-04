/**
 * JEE Main Physics — Dual Nature of Matter & Radiation.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_DUAL_NATURE: LessonPlan = {
  id: 'evelyn.jee.phys.dual-nature.v1',
  title: 'JEE Physics — Dual Nature of Matter & Radiation',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.dual-nature',
      description: 'Apply photoelectric equation, de Broglie wavelength, and Davisson-Germer / electron-diffraction concepts.',
      standard: 'JEE-MAIN-PHY-DUAL',
    },
  ],
  prerequisites: ['jee.phys.em-waves-optics'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Wave-particle duality is a JEE staple — Einstein\'s photoelectric equation and de Broglie\'s wavelength formula handle most questions.',
      script: 'Light behaves as particles when it ejects electrons. Electrons behave as waves when they diffract. The boundary between matter and radiation blurs. JEE Main asks predictable questions: stopping potential, threshold frequency, electron de Broglie wavelength.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dual',
      kind: 'concept',
      goal: 'Photoelectric + de Broglie + experimental verification.',
      keyIdeas: [
        'PHOTOELECTRIC EFFECT (Einstein 1905): light ejects electrons from metal IF photon energy exceeds work function. KE_max = hf − φ.',
        'STOPPING POTENTIAL: V_s such that eV_s = KE_max. Plot V_s vs f → straight line with slope h/e and x-intercept f₀ (threshold).',
        'NO ELECTRONS BELOW THRESHOLD: regardless of light intensity, if f < f₀ no emission. (Wave theory predicted otherwise; experiment confirmed Einstein.)',
        'PHOTON: particle of light. Energy E = hf. Momentum p = E/c = h/λ. Zero rest mass.',
        'DE BROGLIE: any particle with momentum p has associated wavelength λ = h/p = h/(mv).',
        'ELECTRON ACCELERATED THROUGH POTENTIAL V: KE = eV → p = √(2m·eV) → λ = h/√(2meV) ≈ 12.27/√V Å (for V in volts).',
        'DAVISSON-GERMER: confirmed electron wave nature by diffraction off Ni crystal — peaks at angles matching Bragg condition.',
        'JEE TRAP: photons CAN have momentum even though massless — relativistic relation E = pc applies (E² = (pc)² + (mc²)² with m = 0).',
      ],
      vocabulary: [
        { term: 'stopping potential', definition: 'the reverse-bias voltage V_s that just stops the most energetic photoelectrons; eV_s = KE_max.' },
        { term: 'de Broglie wavelength', definition: 'wavelength associated with a moving particle: λ = h/p.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-stopping',
      kind: 'worked_example',
      problem: 'A metal with work function 2 eV is illuminated with 300 nm light. Find the stopping potential.',
      steps: [
        'Photon energy: E = hc/λ = 1240/300 ≈ 4.13 eV.',
        'KE_max = E − φ = 4.13 − 2 = 2.13 eV.',
        'Stopping potential: eV_s = KE_max → V_s = 2.13 V.',
      ],
      answer: 'V_s = 2.13 V',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'An electron is accelerated through 100 V. Find its de Broglie wavelength in angstroms.',
      expectedAnswer: '≈ 1.227 Å',
      responseFormat: 'numeric',
      hints: [
        'Shortcut: λ ≈ 12.27/√V Å (V in volts).',
        '12.27/√100 = 12.27/10.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-intensity',
      kind: 'misconception_check',
      question: 'A student says "increasing the intensity of incident light always increases the maximum kinetic energy of photoelectrons." Correct?',
      commonErrors: [
        {
          answer: 'Higher intensity → higher KE_max',
          misconception: 'Believing wave theory of light, where intensity = energy delivered to each electron.',
          correctsTo: 'KE_max depends on FREQUENCY (photon energy), NOT intensity. KE_max = hf − φ. Higher intensity means MORE photons per second → MORE photoelectrons emitted, but each one with the same maximum KE. This is the famous result that killed classical wave theory of light: brighter light below threshold ejects ZERO electrons; dim light above threshold ejects some.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'KE_max = hf − φ. Stopping potential eV_s = KE_max.',
        'Below threshold f < f₀ = φ/h: no emission, regardless of intensity.',
        'de Broglie λ = h/p = h/(mv).',
        'Electron accelerated through V: λ ≈ 12.27/√V Å.',
        'Photon: E = hf, p = h/λ, m_rest = 0.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare de Broglie wavelengths of an electron and a proton when both have the same kinetic energy.',
      hint: 'KE = p²/(2m) → p = √(2m·KE) → λ = h/√(2m·KE). At same KE, λ ∝ 1/√m. Proton mass ≈ 1836·m_e. So λ_electron/λ_proton = √1836 ≈ 42.8. Electron has ~43× longer wavelength at same KE.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
