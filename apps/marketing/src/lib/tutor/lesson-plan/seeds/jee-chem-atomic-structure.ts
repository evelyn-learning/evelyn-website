/**
 * JEE Chemistry — Atomic Structure and Quantum Numbers.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_CHEM_ATOMIC_STRUCTURE: LessonPlan = {
  id: 'evelyn.jee.chem.atomic-structure.v1',
  title: 'JEE Chemistry — Atomic Structure and Quantum Numbers',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-chemistry',
  locale: 'en',
  los: [{ id: 'jee.chem.atomic-structure', description: 'Apply Bohr model + quantum mechanical model: quantum numbers, electron configurations, spectra, dual nature.', standard: 'JEE-CHEM-ATOMIC' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Atomic structure underpins all of physical and inorganic chemistry — JEE asks 4-5 questions per year.', script: 'Bohr model, quantum numbers, electron configurations, spectral lines, de Broglie waves — JEE atomic structure expects mastery of every formula. Today the high-yield content.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Bohr model, quantum numbers, configurations, spectra.', keyIdeas: [
      'BOHR MODEL (hydrogen-like atoms):',
      '  Energy of nth orbit: Eₙ = −13.6·Z²/n² eV (Z = atomic number).',
      '  Radius: rₙ = 0.529·n²/Z Å.',
      '  Velocity: vₙ ∝ Z/n.',
      'SPECTRAL LINES (transitions):',
      '  Lyman series: nᵢ → 1 (UV).',
      '  Balmer: nᵢ → 2 (visible).',
      '  Paschen: nᵢ → 3 (IR).',
      '  Wavenumber: 1/λ = R·Z²(1/n₁² − 1/n₂²), R = Rydberg constant.',
      'QUANTUM NUMBERS — four describing each electron:',
      '  PRINCIPAL n (1, 2, 3...): main energy level.',
      '  AZIMUTHAL l (0 to n−1): orbital shape. l=0 (s), 1 (p), 2 (d), 3 (f).',
      '  MAGNETIC mₗ (−l to +l): orbital orientation; (2l+1) values.',
      '  SPIN mₛ (±1/2): electron spin direction.',
      'PAULI EXCLUSION: no two electrons in an atom can have identical 4 quantum numbers.',
      'AUFBAU: fill orbitals in order of increasing energy. Use 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p... (n+l rule).',
      'HUND\'S RULE: in degenerate orbitals (same energy), fill singly with parallel spins before pairing.',
      'EXCEPTIONS: Cr [Ar] 3d⁵ 4s¹ (not 3d⁴ 4s²); Cu [Ar] 3d¹⁰ 4s¹ (not 3d⁹ 4s²) — half-filled and full d shells more stable.',
      'DE BROGLIE: λ = h/p (matter-wave). For electrons: λ = h/(m·v). Tested in JEE every year.',
      'HEISENBERG UNCERTAINTY: Δx · Δp ≥ h/(4π). Position and momentum can\'t both be known precisely.',
      'PHOTOELECTRIC effect: hν = work function + KE_max. JEE classic.',
    ], vocabulary: [{ term: 'aufbau principle', definition: 'electrons occupy orbitals in order of increasing energy; uses (n+l) rule.' }, { term: 'de Broglie wavelength', definition: 'λ = h/p; applies to all matter; significant for electrons but negligible for macroscopic objects.' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'Find the wavelength of light emitted when an electron in hydrogen falls from n=4 to n=2.', steps: [
      'This is a Balmer series transition (final n=2).',
      'Use 1/λ = R(1/n₁² − 1/n₂²) with n₁ = 2 (lower), n₂ = 4 (upper). R = 1.097 × 10⁷ m⁻¹.',
      '1/λ = R(1/4 − 1/16) = R · (4−1)/16 = (3/16)R.',
      '1/λ = (3/16)(1.097 × 10⁷) = 2.057 × 10⁶ m⁻¹.',
      'λ = 1/(2.057 × 10⁶) ≈ 486 nm.',
      'This is in the visible spectrum (blue-green) — the H-β line of the Balmer series. ✓',
    ], answer: '≈ 486 nm (blue-green, H-β line)', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Write the electron configuration of chromium (Z = 24).', expectedAnswer: 'Standard fill would predict [Ar] 3d⁴ 4s². But the actual configuration is [Ar] 3d⁵ 4s¹ — a stability exception. Half-filled d-subshell (3d⁵) is more stable than 3d⁴ 4s². JEE expects this exception memorised. (Same kind of exception for Cu: [Ar] 3d¹⁰ 4s¹.)', responseFormat: 'free', hints: ['Apply Aufbau, then check for exceptions.', 'Cr and Cu are the well-known exceptions.'], estimatedMinutes: 3 },
    { id: 'misconception-spdf-energy', kind: 'misconception_check', question: 'A student fills 3d before 4s. What\'s wrong?', commonErrors: [{ answer: 'Fills 3d before 4s', misconception: 'Misordering the energy of orbitals.', correctsTo: 'Use the (n+l) rule. For 3d: n+l = 3+2 = 5. For 4s: n+l = 4+0 = 4. The orbital with LOWER (n+l) is filled first. 4s (4) < 3d (5), so 4s fills first. (When n+l is equal, lower n fills first.) The order: 1s 2s 2p 3s 3p 4s 3d 4p... Memorise this for JEE.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Eₙ = −13.6Z²/n² eV. Bohr radius 0.529n²/Z Å.', '4 quantum numbers: n, l, mₗ, mₛ.', 'Aufbau by (n+l) rule. Half/full d-shell exceptions: Cr, Cu.', 'de Broglie λ = h/p; uncertainty ΔxΔp ≥ h/4π.', 'Photoelectric: hν = φ + KE_max.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
