/**
 * HS Chemistry — Acids, Bases, and pH.
 * Foundational acid/base chemistry.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_ACIDS_BASES_PH: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.acids-bases-ph.v1',
  title: 'Acids, Bases, and pH',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-2', description: 'Construct and revise an explanation for the outcome of a simple chemical reaction based on the outermost electron states of atoms.', standard: 'NGSS.HS-PS1-2' }],
  prerequisites: ['hs.chem.solutions-concentration'], followUps: ['hs.chem.kinetics'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the everyday.', script: 'Lemons taste sour. Soap feels slippery. Your stomach acid can dissolve a steak — but your blood pH can\'t shift more than 0.1 without making you sick. ACIDS and BASES run biology, cooking, cleaning, and industry.', estimatedMinutes: 2 },
    { id: 'concept-definitions', kind: 'concept', goal: 'Acid: H⁺ donor. Base: H⁺ acceptor (or OH⁻ producer).', keyIdeas: [
      'BRØNSTED-LOWRY DEFINITIONS:',
      '  · ACID = donates H⁺ (a proton).',
      '  · BASE = accepts H⁺.',
      'EXAMPLES:',
      '  · HCl → H⁺ + Cl⁻ (donates H⁺ → ACID).',
      '  · NH₃ + H⁺ → NH₄⁺ (accepts H⁺ → BASE).',
      'STRONG vs WEAK:',
      '  · STRONG ACIDS fully ionize: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄.',
      '  · STRONG BASES fully dissociate: NaOH, KOH, Ca(OH)₂, etc.',
      '  · WEAK ones partially ionize (acetic acid in vinegar; ammonia).',
      'ACID + BASE → SALT + WATER (NEUTRALIZATION).',
      '  · HCl + NaOH → NaCl + H₂O.',
    ], vocabulary: [{ term: 'acid', definition: 'H⁺ donor (Brønsted-Lowry).' }, { term: 'base', definition: 'H⁺ acceptor.' }, { term: 'neutralization', definition: 'acid + base → salt + water.' }], estimatedMinutes: 4 },
    { id: 'concept-ph', kind: 'concept', goal: 'pH measures H⁺ concentration on a 0–14 scale.', keyIdeas: [
      'pH = −log[H⁺] (negative log of H⁺ molarity).',
      'pH SCALE:',
      '  · 0–6: ACIDIC (more H⁺).',
      '  · 7: NEUTRAL (pure water; [H⁺] = 10⁻⁷ M).',
      '  · 8–14: BASIC (less H⁺, more OH⁻).',
      'LOG SCALE: each pH unit = 10x change in [H⁺].',
      '  · pH 3 has 100x more H⁺ than pH 5.',
      'Pure water: [H⁺] = [OH⁻] = 10⁻⁷ M → pH = 7.',
      '  · [H⁺][OH⁻] = 10⁻¹⁴ ALWAYS (Kw).',
      'COMMON pH:',
      '  · Stomach acid: 1-2. Lemon juice: 2. Coffee: 5. Pure water: 7. Blood: 7.4. Soap: 9-10. Bleach: 13.',
    ], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'worked-ph-calc', kind: 'worked_example', problem: 'A solution has [H⁺] = 1.0 × 10⁻³ M. What is the pH?', steps: [
      'pH = −log[H⁺].',
      'pH = −log(1.0 × 10⁻³).',
      'log(10⁻³) = −3.',
      'pH = −(−3) = 3.',
      'Interpretation: pH 3 → ACIDIC (well below 7). About 100,000x more acidic than pure water.',
    ], answer: 'pH = 3. Acidic. Each pH unit = 10x change in [H⁺].', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Solution A has pH 2. Solution B has pH 5. How many times more acidic is A than B?', expectedAnswer: '1000x more acidic. Each pH unit = 10x in H⁺ concentration. Difference of 3 units = 10³ = 1000x. Solution A has 1000x more H⁺ ions than B. (That\'s why pH is logarithmic — covers a huge range compactly.)', responseFormat: 'numeric', hints: ['It\'s a log scale.', '10^(difference in pH).'], estimatedMinutes: 3 },
    { id: 'misconception-strong-vs-conc', kind: 'misconception_check', question: 'A friend says "concentrated and strong mean the same thing for acids." Right?', commonErrors: [{ answer: 'Yes — same thing.', misconception: 'Confusing strength with concentration.', correctsTo: 'STRENGTH = how much an acid IONIZES (HCl is strong, vinegar is weak). CONCENTRATION = how much acid is in solution (a lot of acid molecules vs few). You can have a DILUTE STRONG acid (0.001 M HCl — pH 3) or a CONCENTRATED WEAK acid (5 M acetic acid — pH 2 ish). Different properties.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Acid donates H⁺. Base accepts H⁺ (or makes OH⁻).', 'pH = −log[H⁺]. 0-6 acid, 7 neutral, 8-14 base.', 'Each pH unit = 10x change in [H⁺].', 'Strong vs weak ≠ concentrated vs dilute.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
