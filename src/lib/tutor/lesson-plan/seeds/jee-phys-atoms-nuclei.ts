/**
 * JEE Main Physics — Atoms & Nuclei (Modern Physics).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_ATOMS_NUCLEI: LessonPlan = {
  id: 'evelyn.jee.phys.atoms-nuclei.v1',
  title: 'JEE Physics — Atoms & Nuclei',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.atoms-nuclei',
      description: 'Apply Bohr model, photoelectric effect, mass-energy equivalence, radioactive decay, and nuclear binding energy.',
      standard: 'JEE-MAIN-PHY-MOD',
    },
  ],
  prerequisites: ['jee.phys.em-waves-optics'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Modern physics gives JEE a clean route to plug-and-chug formula questions — Bohr model, photoelectric, decay.',
      script: 'Photons, electron orbits, radioactive half-life. Despite the abstract physics, the calculations are arithmetic with the right formulas. Today we drill those formulas: Bohr radii and energies, the photoelectric equation, and the exponential-decay law.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-modern',
      kind: 'concept',
      goal: 'Bohr + photoelectric + nuclear + decay.',
      keyIdeas: [
        'PHOTON ENERGY: E = hf = hc/λ. h = 6.63 × 10⁻³⁴ J·s. hc ≈ 1240 eV·nm.',
        'PHOTOELECTRIC EFFECT: KE_max = hf − φ, where φ is work function. Threshold frequency f₀ = φ/h.',
        'BOHR MODEL (hydrogen-like atom): r_n = a₀·n²/Z, where a₀ ≈ 0.529 Å. E_n = −13.6 eV·Z²/n² (for hydrogen Z = 1).',
        'BOHR TRANSITIONS: ΔE = E_initial − E_final emitted as photon. Series: Lyman (n→1, UV), Balmer (n→2, visible), Paschen (n→3, IR).',
        'DE BROGLIE WAVELENGTH: λ = h/p = h/(mv). Wave-particle duality.',
        'MASS-ENERGY: E = mc². 1 amu = 931.5 MeV.',
        'BINDING ENERGY: BE = (Σm_separate − m_nucleus)·c². Largest for iron-56 (most stable).',
        'RADIOACTIVE DECAY: N(t) = N₀·e^(−λt). Half-life T₁/₂ = ln 2 / λ ≈ 0.693/λ.',
        'ALPHA DECAY: nucleus emits ⁴He. BETA DECAY: emits e⁻ (β⁻) or e⁺ (β⁺). GAMMA: high-energy photon, no mass change.',
        'ACTIVITY: A = λN. SI unit becquerel (1 decay per second).',
      ],
      vocabulary: [
        { term: 'work function', definition: 'minimum energy φ to liberate an electron from a metal surface.' },
        { term: 'half-life', definition: 'time for half of a radioactive sample to decay; T₁/₂ = ln 2 / λ.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-photoelectric',
      kind: 'worked_example',
      problem: 'Light of wavelength 400 nm shines on a metal of work function 2 eV. Find the maximum kinetic energy of emitted photoelectrons.',
      steps: [
        'Photon energy: E = hc/λ. Use hc ≈ 1240 eV·nm. E = 1240/400 = 3.1 eV.',
        'Photoelectric equation: KE_max = E − φ = 3.1 − 2 = 1.1 eV.',
      ],
      answer: 'KE_max = 1.1 eV',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A radioactive sample has half-life 10 days. After 30 days, what fraction of the original sample remains?',
      expectedAnswer: '1/8',
      responseFormat: 'free',
      hints: [
        '30 days = 3 half-lives.',
        'After n half-lives, fraction = (1/2)^n.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-photon-mass',
      kind: 'misconception_check',
      question: 'A student says "photons have no mass, so they cannot have momentum." Correct?',
      commonErrors: [
        {
          answer: 'Photons have no momentum',
          misconception: 'Equating "no rest mass" with "no momentum".',
          correctsTo: 'Photons have ZERO REST MASS but they DO have momentum: p = E/c = h/λ. This is why radiation pressure is real — solar sails work. The classical formula p = mv breaks down at the speed of light; the relativistic relation E² = (pc)² + (mc²)² gives p = E/c when m = 0. Photon momentum drives Compton scattering and explains photon-electron collisions.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Photon E = hf = hc/λ. hc ≈ 1240 eV·nm.',
        'Photoelectric: KE_max = hf − φ.',
        'Bohr H atom: E_n = −13.6/n² eV.',
        'de Broglie λ = h/p.',
        'Decay N = N₀·e^(−λt). T₁/₂ = 0.693/λ.',
        '1 amu = 931.5 MeV (E = mc² conversion).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In hydrogen atom, an electron transitions from n = 3 to n = 2. Find the wavelength of the emitted photon.',
      hint: 'E_3 = −13.6/9 = −1.51 eV. E_2 = −13.6/4 = −3.4 eV. ΔE = E_3 − E_2 = −1.51 − (−3.4) = 1.89 eV. λ = hc/E = 1240/1.89 ≈ 656 nm. (This is the famous H_α line — red, in visible range; part of the Balmer series.)',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
