/**
 * JEE Chemistry — Chemical and Ionic Equilibrium.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_CHEM_EQUILIBRIUM_IONIC: LessonPlan = {
  id: 'evelyn.jee.chem.equilibrium-ionic.v1',
  title: 'JEE Chemistry — Chemical and Ionic Equilibrium',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-chemistry',
  locale: 'en',
  los: [{ id: 'jee.chem.equilibrium', description: 'Apply Kc/Kp/Ksp/Ka/Kb, ICE tables, common-ion effect, buffer calculations, hydrolysis.', standard: 'JEE-CHEM-EQUIL' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Equilibrium is ~15% of JEE Chemistry — combinatoric Kc/Kp/Ksp/Ka questions test calculation discipline.', script: 'Mix gases at high T → equilibrium. Dissolve a salt → solubility product. Acid-base reactions → buffer behavior. JEE expects ICE tables, common-ion effect, and pH calcs done fast and correctly.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'K expressions, ICE tables, Le Chatelier, acid-base, buffers.', keyIdeas: [
      'Kc (concentration) and Kp (partial pressure) for gas equilibria. Kp = Kc · (RT)^Δn.',
      'Q vs K: Q < K → forward shift; Q > K → reverse.',
      'Le Chatelier qualitatively predicts shift on stress (concentration, pressure, temperature).',
      'TEMPERATURE: only factor that changes K. Endothermic + heat → favors products → K increases.',
      'ICE TABLE workflow: Initial / Change / Equilibrium. Plug into Kc expression. If x is small (typically Kc < 10⁻⁴ and initial concentration not tiny), small-x approximation simplifies.',
      'WATER autoionisation: Kw = [H⁺][OH⁻] = 10⁻¹⁴ at 25°C.',
      'pH = −log[H⁺]. pOH = −log[OH⁻]. pH + pOH = 14.',
      'STRONG acids/bases: ionise completely. [H⁺] = initial concentration.',
      'WEAK acids: HA ⇌ H⁺ + A⁻, Ka = [H⁺][A⁻]/[HA]. For weak acid in water: [H⁺] ≈ √(Ka · C).',
      'WEAK bases: B + H₂O ⇌ BH⁺ + OH⁻, Kb = [BH⁺][OH⁻]/[B].',
      'Ka · Kb = Kw for conjugate acid-base pair.',
      'BUFFERS: weak acid + its conjugate base (or weak base + conjugate acid). pH = pKa + log([A⁻]/[HA]) (Henderson-Hasselbalch).',
      'Buffer effective when [acid]/[base] within 1:10 to 10:1 range (pKa ± 1).',
      'COMMON ION EFFECT: adding a common ion to a weak acid solution suppresses its ionisation (Le Chatelier).',
      'SOLUBILITY PRODUCT Ksp: for AₓBᵧ ⇌ xA + yB, Ksp = [A]ˣ[B]ʸ. Solubility s related to Ksp by stoichiometry.',
      'HYDROLYSIS: salts of weak acids/bases hydrolyse. NaCH₃COO solution is basic (acetate hydrolyses); NH₄Cl solution is acidic.',
    ], vocabulary: [{ term: 'Henderson-Hasselbalch', definition: 'pH = pKa + log([base]/[acid]); calculates buffer pH.' }, { term: 'common-ion effect', definition: 'adding an ion already present in equilibrium shifts the equilibrium to consume that ion (Le Chatelier).' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'Calculate the pH of 0.1 M acetic acid (CH₃COOH). Ka = 1.8 × 10⁻⁵.', steps: [
      'Set up: CH₃COOH ⇌ H⁺ + CH₃COO⁻. Initial: [HA] = 0.1, [H⁺] = [A⁻] = 0.',
      'ICE: [HA] = 0.1−x. [H⁺] = x. [A⁻] = x.',
      'Ka = x²/(0.1−x) = 1.8×10⁻⁵.',
      'Small-x approx (Ka very small): 0.1−x ≈ 0.1. So x² ≈ (1.8×10⁻⁵)(0.1) = 1.8×10⁻⁶.',
      'x = √(1.8×10⁻⁶) ≈ 1.34×10⁻³. So [H⁺] ≈ 1.34×10⁻³ M.',
      'Check approx: x/0.1 = 1.34% < 5%. Valid.',
      'pH = −log(1.34×10⁻³) ≈ 2.87.',
    ], answer: 'pH ≈ 2.87', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A buffer has 0.2 M acetic acid (pKa = 4.74) and 0.1 M sodium acetate. What is its pH?', expectedAnswer: 'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]) = 4.74 + log(0.1/0.2) = 4.74 + log(0.5) = 4.74 − 0.30 = 4.44.', responseFormat: 'numeric', hints: ['Use Henderson-Hasselbalch.', 'log(0.5) = −0.30.'], estimatedMinutes: 3 },
    { id: 'misconception-strong-vs-weak', kind: 'misconception_check', question: 'A student treats acetic acid like HCl and computes pH of 0.1 M acetic acid as pH = 1. What\'s wrong?', commonErrors: [{ answer: 'Treats weak acid as strong', misconception: 'Assuming all acids ionise 100%.', correctsTo: 'Acetic acid is WEAK (Ka = 1.8×10⁻⁵). It doesn\'t ionise fully — only ~1.3% of molecules ionise at 0.1 M. Strong acids (HCl, HNO₃, H₂SO₄, HBr, HI, HClO₄) ionise 100%, so for 0.1 M HCl, [H⁺] = 0.1 M, pH = 1. But for weak acids, you must use Ka and ICE table to find actual [H⁺]. Always ASK: is this a strong or weak acid?' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Q vs K determines shift direction.', 'Kw = 10⁻¹⁴; pH + pOH = 14.', '[H⁺] for weak acid ≈ √(Ka·C).', 'Buffer: Henderson-Hasselbalch. Effective pKa ± 1.', 'Common-ion effect suppresses ionisation.', 'Strong acids ionise 100%; weak acids need Ka.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
