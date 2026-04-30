/**
 * AP Physics 2 — Modern physics: photons, atoms, nuclear.
 *
 * Photoelectric effect, atomic energy levels, nuclear reactions,
 * mass-energy equivalence.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_MODERN: LessonPlan = {
  id: 'evelyn.ap.physics2.modern.v1',
  title: 'Modern physics: photons, atoms, nuclear',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.modern',
      description: 'Apply photon energy, atomic transitions, and nuclear reactions.',
      standard: 'AP-PHYS2-MOD',
    },
  ],
  prerequisites: ['phys.waves', 'apphys2.electrostatics'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame modern physics as the breakdown of classical intuition.',
      script: 'In 1900, classical physics seemed nearly complete. Then quantum and relativity dismantled it. Light is BOTH a wave AND a particle. Atoms emit specific colors, not continuous spectra. Mass IS energy. Welcome to the strange.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Photons + atomic levels + nuclear + E=mc².',
      keyIdeas: [
        'PHOTONS: light is BOTH wave AND particle. A photon\'s energy: E = hf = hc/λ. h = 6.63×10⁻³⁴ J·s. Higher frequency = higher energy.',
        'PHOTOELECTRIC EFFECT (Einstein, 1905, Nobel): light hits a metal, ejects electrons IF photon energy > work function. CLASSICAL physics couldn\'t explain. Quantum: each photon delivers energy as a packet. Below threshold frequency: no electrons no matter how bright the light.',
        'ATOMIC ENERGY LEVELS (Bohr): electrons orbit at DISCRETE energy levels. Transition between levels emits or absorbs a photon of specific energy = level difference. Why each element has a unique spectral fingerprint.',
        'EXAMPLE: hydrogen Balmer series — visible light from electrons falling to n=2. Each line is one specific transition.',
        'NUCLEAR REACTIONS: alpha decay (emits He-4 nucleus). Beta decay (emits electron + antineutrino, neutron → proton). Gamma decay (emits high-energy photon).',
        'FISSION: heavy nucleus splits → energy. Powers nuclear reactors and atomic bombs.',
        'FUSION: light nuclei combine → heavier + energy. Powers the sun. Hydrogen → helium.',
        'MASS-ENERGY EQUIVALENCE: E = mc². Tiny mass change = huge energy because c² is enormous (~9×10¹⁶). Nuclear energy comes from converting nuclear binding mass into energy.',
      ],
      vocabulary: [
        { term: 'photon', definition: 'a quantum (particle) of electromagnetic radiation.' },
        { term: 'work function', definition: 'minimum photon energy needed to eject an electron from a metal.' },
        { term: 'fission / fusion', definition: 'splitting heavy nuclei vs combining light ones; both release energy.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-photon',
      kind: 'worked_example',
      problem: 'A blue-light photon has wavelength 450 nm. Find its energy in joules and electron-volts (1 eV = 1.6×10⁻¹⁹ J).',
      steps: [
        'E = hc/λ = (6.63×10⁻³⁴)(3×10⁸) / (450×10⁻⁹).',
        'Numerator: 1.99×10⁻²⁵.',
        'Divide by 4.5×10⁻⁷: E ≈ 4.42×10⁻¹⁹ J.',
        'In eV: 4.42×10⁻¹⁹ / 1.6×10⁻¹⁹ ≈ 2.76 eV.',
        'Visible-light photons: 1.6-3.3 eV. Blue is on the high side.',
      ],
      answer: '~4.4×10⁻¹⁹ J ≈ 2.76 eV',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the photoelectric effect, why does INCREASING light INTENSITY (brightness) NOT eject electrons if frequency is below threshold?',
      expectedAnswer: 'each photon must individually have enough energy; intensity adds more photons but each is still too weak',
      responseFormat: 'free',
      hints: [
        'Intensity = number of photons per second.',
        'Energy per photon = hf — depends on frequency, not on how many photons.',
        'Below threshold f, no single photon can dislodge an electron.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-light-only-wave',
      kind: 'misconception_check',
      question: 'Is light EITHER a wave OR a particle?',
      commonErrors: [
        {
          answer: 'wave',
          misconception: 'Forcing one model.',
          correctsTo: 'Light is BOTH. Wave behavior in interference and diffraction. Particle behavior in photoelectric effect and Compton scattering. WAVE-PARTICLE DUALITY: depending on the experiment, one model fits better. Quantum mechanics unifies both.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Photon: E = hf = hc/λ.',
        'Photoelectric effect: needs photon energy > work function.',
        'Atomic emission: discrete transitions → spectral lines.',
        'Fission and fusion both convert binding energy via E = mc².',
        'Wave-particle duality: light shows both behaviors.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does nuclear fission release millions of times more energy per atom than chemical reactions?',
      hint: 'Chemical: rearrange ELECTRONS, energy from bond reformation (~eV per atom). Nuclear: rearrange NUCLEONS, energy from binding-energy difference (~MeV per atom — million times more). E = mc² with much bigger Δm.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
