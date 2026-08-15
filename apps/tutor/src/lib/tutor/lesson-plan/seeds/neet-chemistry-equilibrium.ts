/**
 * NEET Chemistry — Chemical Equilibrium and Acids/Bases.
 *
 * NCERT class 11. ~4-5 NEET chemistry questions per year.
 * Le Chatelier, Kc/Kp, weak vs strong acids, pH calculations.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_CHEMISTRY_EQUILIBRIUM: LessonPlan = {
  id: 'evelyn.testprep.neet.chemistry.equilibrium.v1',
  title: 'NEET Chemistry — Chemical and Ionic Equilibrium',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-chemistry',
  locale: 'en',
  los: [
    {
      id: 'neet.chemistry.equilibrium',
      description: 'Apply Kc and Kp expressions, predict equilibrium shifts via Le Chatelier\'s principle, calculate pH for strong + weak acid/base solutions, and identify buffer behavior.',
      standard: 'NEET-CHEM-EQ',
    },
  ],
  prerequisites: ['neet.format-2025'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Equilibrium connects every other chemistry chapter.',
      script: 'Chemical equilibrium isn\'t just one chapter — it\'s the engine behind acid-base, solubility, redox, kinetics, and biochemistry. Master Le Chatelier\'s principle and Ka/Kb manipulations once, and you\'ll see them reappear everywhere. NEET asks 4-5 direct equilibrium questions per year, plus implicitly tests it inside other chapters.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equilibrium',
      kind: 'concept',
      goal: 'Equilibrium constant + Le Chatelier.',
      keyIdeas: [
        'EQUILIBRIUM CONSTANT for aA + bB ⇌ cC + dD: Kc = [C]^c[D]^d / ([A]^a[B]^b). Concentrations at equilibrium.',
        'Kp = Kc·(RT)^Δn where Δn = (moles of gas products) − (moles of gas reactants).',
        'PURE SOLIDS and PURE LIQUIDS have activity = 1, so they DON\'T appear in K expression. Aqueous and gaseous species do.',
        'LARGE K (>>1): products favored. SMALL K (<<1): reactants favored. K = 1: comparable.',
        'K is INDEPENDENT of starting concentrations and depends only on TEMPERATURE.',
        'Q (reaction quotient): same form as K but with NON-equilibrium concentrations. Q < K → reaction proceeds forward; Q > K → reverse; Q = K → at equilibrium.',
        'LE CHATELIER\'S PRINCIPLE: a system at equilibrium responds to a stress in the direction that REDUCES the stress.',
        'STRESS: CONCENTRATION (add reactant → forward; add product → reverse). PRESSURE (compression → favors fewer moles of gas). TEMPERATURE: endothermic forward → ↑T favors products; exothermic → ↑T favors reactants.',
        'CATALYSTS DO NOT shift equilibrium — they speed both directions equally. They reduce time to equilibrium, not the position.',
      ],
      vocabulary: [
        { term: 'reaction quotient (Q)', definition: 'same form as Kc but using current (not equilibrium) concentrations; predicts which way the reaction will shift.' },
        { term: 'Le Chatelier\'s principle', definition: 'a system at equilibrium under stress shifts to partially relieve the stress.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-acids-bases',
      kind: 'concept',
      goal: 'Acid-base, pH, buffers.',
      keyIdeas: [
        'BRØNSTED-LOWRY: acid donates H+, base accepts H+. Conjugate pairs differ by one H+.',
        'STRONG ACIDS (fully dissociate): HCl, HBr, HI, HClO₄, H₂SO₄ (1st H), HNO₃. STRONG BASES: NaOH, KOH, Ca(OH)₂, Ba(OH)₂.',
        'WEAK ACIDS partially dissociate. HA ⇌ H+ + A−. Ka = [H+][A−]/[HA].',
        'pH = −log[H+]. pOH = −log[OH−]. pH + pOH = 14 (at 25°C). Pure water: [H+] = [OH−] = 10⁻⁷, pH = 7.',
        'pKa = −log Ka. pKb = −log Kb. For conjugate pair: Ka·Kb = Kw → pKa + pKb = 14.',
        'WEAK ACID pH: [H+] ≈ √(Ka·C₀) when C₀ >> Ka. pH = ½(pKa − log C₀).',
        'BUFFER: weak acid + its conjugate base (e.g., CH₃COOH + CH₃COONa). Resists pH change. HENDERSON-HASSELBALCH: pH = pKa + log([A−]/[HA]).',
        'BUFFER pH ≈ pKa when [A−] = [HA]. Useful range: pH within ±1 of pKa.',
        'COMMON-ION EFFECT: adding a salt with a common ion to a weak acid suppresses dissociation (Le Chatelier).',
        'SOLUBILITY PRODUCT: for AB(s) ⇌ A+ + B−, Ksp = [A+][B−]. Precipitation if Q > Ksp.',
      ],
      vocabulary: [
        { term: 'pKa', definition: '−log of the acid dissociation constant Ka; smaller pKa = stronger acid.' },
        { term: 'buffer', definition: 'a solution of weak acid + conjugate base (or weak base + conjugate acid) that resists pH change.' },
        { term: 'Ksp', definition: 'solubility product — equilibrium constant for the dissolution of a sparingly soluble salt.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-example',
      kind: 'worked_example',
      problem: 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH < 0 (exothermic). Predict the effect on equilibrium of: (a) increasing pressure; (b) increasing temperature; (c) adding a catalyst.',
      steps: [
        '(a) PRESSURE INCREASE: shift toward fewer moles of gas. Reactants = 1+3 = 4 moles; Products = 2 moles. Forward direction has fewer moles → equilibrium shifts FORWARD (more NH₃). Industrial Haber process exploits this with high pressure.',
        '(b) TEMPERATURE INCREASE: forward exothermic releases heat; ↑T is like adding heat (a "product" in the exothermic sense), so equilibrium shifts in REVERSE (less NH₃). Haber compromise: high T speeds the kinetics but reduces yield, so industry uses moderate T (~450°C) + catalyst.',
        '(c) CATALYST: speeds both forward and reverse equally. NO SHIFT in equilibrium position; just faster to reach it. Industry uses Fe + K₂O + Al₂O₃ catalyst.',
      ],
      answer: '(a) shifts forward (more NH₃). (b) shifts reverse (less NH₃). (c) no shift, just faster.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 0.10 M acetic acid solution has Ka = 1.8×10⁻⁵. Find the pH.',
      expectedAnswer: '~2.87. Use [H+] ≈ √(Ka·C₀) = √(1.8×10⁻⁵ × 0.10) = √(1.8×10⁻⁶) ≈ 1.34×10⁻³. pH = −log(1.34×10⁻³) ≈ 2.87.',
      responseFormat: 'numeric',
      hints: [
        'Weak acid approximation: [H+] = √(Ka·C₀).',
        'pH = −log[H+].',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-catalyst',
      kind: 'misconception_check',
      question: 'Adding a catalyst to an equilibrium reaction increases the yield of products. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating catalysts as yield boosters.',
          correctsTo: 'False. A catalyst speeds BOTH forward and reverse reactions equally. The system reaches equilibrium FASTER, but the equilibrium POSITION (and therefore the final concentrations) is identical with or without the catalyst. To increase product yield you have to change the equilibrium position itself — temperature, pressure, or concentration. NEET tests this consistently. The Haber process uses a catalyst for kinetic reasons, not for higher yield.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Kc/Kp expressions exclude pure solids + liquids. Q vs K predicts shift direction.',
        'Le Chatelier: pressure (favor fewer gas moles), T (depends on ΔH), conc (add reactant pushes forward).',
        'Catalyst: faster, NOT more product.',
        'pH = −log[H+]. Ka·Kb = Kw. Buffer pH ≈ pKa.',
        'Weak acid pH ≈ ½(pKa − log C₀).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does adding pure water to a buffer NOT change its pH significantly?',
      hint: 'A buffer\'s pH is set by the RATIO [A−]/[HA] (Henderson-Hasselbalch: pH = pKa + log([A−]/[HA])). Diluting both species equally preserves the ratio. Concentration changes cancel in the log. The buffer\'s capacity (how much acid/base it can absorb) drops with dilution, but the pH remains close to pKa. This is why physiological buffers (blood pH ~7.4) work even as plasma volume changes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
