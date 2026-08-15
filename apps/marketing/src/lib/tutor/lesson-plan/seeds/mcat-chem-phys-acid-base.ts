/**
 * MCAT Chem/Phys — Acid-Base Chemistry and Buffers.
 *
 * High-yield: Bronsted-Lowry, pH/pKa relationships, Henderson-Hasselbalch,
 * physiological buffer systems (bicarbonate, phosphate, hemoglobin).
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_CHEM_PHYS_ACID_BASE: LessonPlan = {
  id: 'evelyn.testprep.mcat.chem-phys.acid-base.v1',
  title: 'MCAT Chem/Phys — Acid-Base, Buffers & Henderson-Hasselbalch',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-chem-phys',
  locale: 'en',
  los: [
    {
      id: 'mcat.chem-phys.acid-base',
      description: 'Apply Bronsted-Lowry definitions, calculate pH/pOH for strong + weak acids, use Henderson-Hasselbalch for buffers, and identify physiological buffer systems.',
      standard: 'MCAT-CP-AB',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Acid-base bridges chem, biochem, and physiology.',
      script: 'Acid-base chemistry shows up across the entire MCAT — Chem/Phys (pH calculations, titrations), Bio/Biochem (amino acid pI, enzyme catalysis, blood buffering), and even physiology passages on respiratory and metabolic acidosis. Master Henderson-Hasselbalch and the bicarbonate buffer system once, and you\'ll see them again in passage after passage.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-acid-base-fundamentals',
      kind: 'concept',
      goal: 'Definitions, pH, pKa, water autoionization.',
      keyIdeas: [
        'BRØNSTED-LOWRY: acid donates H+; base accepts H+. Conjugate acid-base pairs differ by exactly one proton.',
        'LEWIS: acid accepts electron pair; base donates electron pair. Broader definition that covers Brønsted plus metal-ligand chemistry.',
        'AUTOIONIZATION OF WATER: 2 H₂O ⇌ H₃O⁺ + OH⁻. Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴ at 25°C. pH + pOH = 14.',
        'pH = −log[H⁺]. NEUTRAL water at 25°C: [H⁺] = [OH⁻] = 10⁻⁷ M, pH = 7. ACIDIC: pH < 7. BASIC: pH > 7.',
        'STRONG ACIDS (fully dissociate): HCl, HBr, HI, HClO₄, H₂SO₄ (1st H), HNO₃. STRONG BASES: NaOH, KOH, alkaline earth hydroxides.',
        'WEAK ACID DISSOCIATION: HA ⇌ H⁺ + A⁻. Ka = [H⁺][A⁻]/[HA]. SMALLER Ka = WEAKER acid. pKa = −log Ka.',
        'CONJUGATE ACID-BASE: Ka·Kb = Kw → pKa + pKb = 14. Stronger acid → weaker conjugate base.',
        'AMPHOTERIC: can act as acid OR base. Examples: water, bicarbonate (HCO₃⁻), HSO₄⁻, amino acids.',
      ],
      vocabulary: [
        { term: 'pKa', definition: '−log Ka; lower pKa = stronger acid; pKa = pH at which the acid is half-dissociated.' },
        { term: 'amphoteric', definition: 'a species that can act as both an acid and a base (e.g., water, bicarbonate, amino acids).' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-buffers-hh',
      kind: 'concept',
      goal: 'Buffer behavior + Henderson-Hasselbalch + buffer capacity.',
      keyIdeas: [
        'BUFFER: solution of weak acid + its conjugate base (or weak base + conjugate acid). Resists pH changes when small amounts of acid or base are added.',
        'HENDERSON-HASSELBALCH: pH = pKa + log([A⁻]/[HA]). Direct way to find buffer pH from concentrations.',
        'WHEN [A⁻] = [HA]: pH = pKa. Buffer is at its maximum capacity (equal acid and conjugate base).',
        'EFFECTIVE BUFFER RANGE: pH within ±1 of pKa. Outside this range, buffer capacity drops sharply.',
        'BUFFER CAPACITY: maximum amount of acid/base a buffer can absorb without significant pH change. Depends on (1) total concentration of buffer species and (2) ratio [A⁻]/[HA] (best at 1:1).',
        'ADDING STRONG ACID: H⁺ + A⁻ → HA. [HA] ↑, [A⁻] ↓. pH drops slightly per H-H.',
        'ADDING STRONG BASE: OH⁻ + HA → A⁻ + H₂O. [HA] ↓, [A⁻] ↑. pH rises slightly per H-H.',
        'DILUTION: pH stays roughly constant — H-H depends on the RATIO, which doesn\'t change with dilution. Buffer CAPACITY drops with dilution though.',
      ],
      vocabulary: [
        { term: 'buffer', definition: 'a weak-acid + conjugate-base mixture that resists pH change near pH = pKa.' },
        { term: 'Henderson-Hasselbalch equation', definition: 'pH = pKa + log([A⁻]/[HA]); calculates buffer pH from concentrations.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-physiological-buffers',
      kind: 'concept',
      goal: 'Body\'s three main buffer systems.',
      keyIdeas: [
        'BICARBONATE BUFFER: H⁺ + HCO₃⁻ ⇌ H₂CO₃ ⇌ CO₂ + H₂O. Most important EXTRACELLULAR buffer. pKa ~6.1 — far from physiological pH 7.4, but works because it\'s OPEN: CO₂ exhaled by lungs (regulates [H₂CO₃]) and HCO₃⁻ controlled by kidneys.',
        'HENDERSON-HASSELBALCH FOR BLOOD: pH = 6.1 + log([HCO₃⁻]/(0.03·pCO₂)). Normal: 24/(0.03·40) = 24/1.2 = 20:1 ratio → pH = 6.1 + log(20) = 6.1 + 1.3 = 7.4.',
        'RESPIRATORY ACIDOSIS (↑pCO₂, e.g., hypoventilation): pH ↓ from increased H₂CO₃. Compensation: kidneys retain HCO₃⁻.',
        'RESPIRATORY ALKALOSIS (↓pCO₂, e.g., hyperventilation): pH ↑. Compensation: kidneys excrete HCO₃⁻.',
        'METABOLIC ACIDOSIS (↓HCO₃⁻, e.g., diabetic ketoacidosis, lactic acid): pH ↓. Compensation: lungs hyperventilate to blow off CO₂.',
        'METABOLIC ALKALOSIS (↑HCO₃⁻, e.g., vomiting acid loss): pH ↑. Compensation: lungs hypoventilate.',
        'PHOSPHATE BUFFER: H₂PO₄⁻ ⇌ H⁺ + HPO₄²⁻. pKa ~6.86 — close to physiological pH. Main INTRACELLULAR buffer.',
        'PROTEIN BUFFERS: hemoglobin and plasma proteins. Histidine residues (pKa ~6) are the main contributing groups. Hb is especially important — buffers H⁺ produced when CO₂ is loaded.',
      ],
      vocabulary: [
        { term: 'bicarbonate buffer', definition: 'CO₂/H₂CO₃/HCO₃⁻ system; main extracellular blood buffer; open to lung and kidney regulation.' },
        { term: 'metabolic acidosis', definition: 'pH decrease due to ↓[HCO₃⁻] (e.g., DKA, lactic acidosis); compensated by hyperventilation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A buffer is made by mixing 0.10 M acetic acid (pKa = 4.76) with 0.20 M sodium acetate. What is the pH?',
      expectedAnswer: '~5.06. Apply Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]) = 4.76 + log(0.20/0.10) = 4.76 + log(2) = 4.76 + 0.30 = 5.06. The buffer is slightly more basic than pH = pKa because [A⁻] > [HA].',
      responseFormat: 'numeric',
      hints: [
        'Use Henderson-Hasselbalch.',
        'log(2) ≈ 0.30, log(10) = 1, log(0.5) ≈ −0.30.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-strong-acid-ph',
      kind: 'misconception_check',
      question: 'Diluting a strong acid solution by a factor of 1000 changes its pH by 3 units (e.g., pH 2 → pH 5). True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating dilution as a pure log shift without considering water\'s contribution.',
          correctsTo: 'Approximately true for moderate concentrations, but BREAKS DOWN as you approach pH 7. Diluting 0.01 M HCl (pH 2) by 1000 → 1×10⁻⁵ M HCl, pH ≈ 5. Diluting further to 1×10⁻⁸ M HCl: you can\'t get pH 8 (an acid can\'t be basic!). At very low concentrations, water\'s autoionization dominates — you must do a charge-balance calculation, and the limiting pH approaches 7. MCAT loves this trap. For typical dilutions you can use the simple shift; below ~10⁻⁶ M, you must account for water.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'pH + pOH = 14. Ka·Kb = Kw → pKa + pKb = 14.',
        'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). When equal: pH = pKa.',
        'Effective buffer range: pKa ± 1.',
        'Bicarbonate is open buffer (CO₂ via lungs, HCO₃⁻ via kidneys). Normal blood pH = 7.4 from 20:1 HCO₃⁻/H₂CO₃ ratio.',
        'Resp acid/base: pCO₂ change. Metab acid/base: HCO₃⁻ change. Compensation flips to other organ.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the bicarbonate buffer system effective at pH 7.4 even though its pKa is 6.1, far outside the typical "pKa ± 1" range?',
      hint: 'The standard buffer rule (pKa ± 1) assumes a CLOSED system — a fixed amount of each species. The bicarbonate system is OPEN: CO₂ is freely exhaled by the lungs (controlling [H₂CO₃] minute-by-minute) and HCO₃⁻ is reabsorbed/excreted by the kidneys (controlling that side over hours-days). This regulation gives the body active control over BOTH sides of the H-H equation, vastly extending the effective buffering range. A static beaker of bicarbonate at pH 7.4 would buffer poorly — but with the lungs and kidneys actively maintaining concentrations, it\'s the most powerful buffer in the body. MCAT likes this passage angle.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
