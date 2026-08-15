/**
 * HS Chemistry — Types of Reactions.
 * NGSS HS-PS1-2: predict chemical reaction outcomes.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_REACTIONS_TYPES: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.reactions-types.v1',
  title: 'Types of Chemical Reactions',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-2', description: 'Construct and revise an explanation for the outcome of a simple chemical reaction based on the outermost electron states of atoms.', standard: 'NGSS.HS-PS1-2' }],
  prerequisites: ['hs.chem.balancing-equations'], followUps: ['hs.chem.gas-laws'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Patterns make prediction possible.', script: 'Millions of chemical reactions exist — but they fall into just 5-6 PATTERNS. Recognize the pattern → predict the products. Like recognizing chess openings: once you see the type, you know what comes next.', estimatedMinutes: 2 },
    { id: 'concept-types', kind: 'concept', goal: 'Five main reaction types: synthesis, decomposition, single replacement, double replacement, combustion.', keyIdeas: [
      '1. SYNTHESIS (combination): A + B → AB.',
      '   · 2 H₂ + O₂ → 2 H₂O.',
      '2. DECOMPOSITION: AB → A + B.',
      '   · 2 H₂O₂ → 2 H₂O + O₂.',
      '3. SINGLE REPLACEMENT: A + BC → AC + B (more reactive metal kicks out less reactive).',
      '   · Zn + CuSO₄ → ZnSO₄ + Cu.',
      '4. DOUBLE REPLACEMENT: AB + CD → AD + CB. Often forms a precipitate, gas, or water.',
      '   · AgNO₃ + NaCl → AgCl↓ + NaNO₃.',
      '5. COMBUSTION: hydrocarbon + O₂ → CO₂ + H₂O + energy.',
      '   · CH₄ + 2 O₂ → CO₂ + 2 H₂O.',
      'BONUS: ACID-BASE NEUTRALIZATION (special double replacement): acid + base → salt + water.',
      '   · HCl + NaOH → NaCl + H₂O.',
    ], vocabulary: [{ term: 'precipitate', definition: 'solid that forms in a solution.' }, { term: 'reactivity series', definition: 'ranking of metals by tendency to react.' }], estimatedMinutes: 5 },
    { id: 'concept-predict', kind: 'concept', goal: 'Use activity series + solubility rules to predict products.', keyIdeas: [
      'ACTIVITY (REACTIVITY) SERIES (most → least reactive): K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag > Au.',
      '  · A more-reactive metal can REPLACE a less-reactive one in a compound.',
      '  · Cu + ZnSO₄ → no reaction (Cu is less reactive than Zn).',
      '  · Zn + CuSO₄ → ZnSO₄ + Cu (Zn more reactive). Yes, reaction happens.',
      'SOLUBILITY RULES (for double replacement → precipitate?):',
      '  · MOSTLY SOLUBLE: Group 1 salts, NH₄⁺ salts, nitrates (NO₃⁻), most chlorides.',
      '  · MOSTLY INSOLUBLE: most carbonates, phosphates, hydroxides (except Group 1).',
      '  · If a product is INSOLUBLE → it precipitates out (write ↓).',
    ], estimatedMinutes: 4 },
    { id: 'worked-classify', kind: 'worked_example', problem: 'Classify and balance: (a) Mg + HCl → ?, (b) NaOH + HCl → ?, (c) C₂H₆ + O₂ → ?', steps: [
      '(a) SINGLE REPLACEMENT (Mg replaces H in HCl). Products: MgCl₂ + H₂. Balance: Mg + 2 HCl → MgCl₂ + H₂.',
      '(b) NEUTRALIZATION (acid-base, double replacement). Products: salt + water. NaOH + HCl → NaCl + H₂O. Already balanced.',
      '(c) COMBUSTION (hydrocarbon + O₂). Products: CO₂ + H₂O. C₂H₆ + 7/2 O₂ → 2 CO₂ + 3 H₂O. Multiply by 2: 2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O.',
    ], answer: '(a) Single replacement, Mg + 2 HCl → MgCl₂ + H₂. (b) Neutralization, NaOH + HCl → NaCl + H₂O. (c) Combustion, 2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Predict the products and classify: AgNO₃ + KCl → ?', expectedAnswer: 'DOUBLE REPLACEMENT. Swap partners: AgNO₃ + KCl → AgCl + KNO₃. AgCl is INSOLUBLE → precipitates out (↓). Final: AgNO₃ + KCl → AgCl↓ + KNO₃. Used in lab to make silver chloride.', responseFormat: 'free', hints: ['What pattern? Two compounds swapping partners?', 'Check solubility — does anything precipitate?'], estimatedMinutes: 3 },
    { id: 'misconception-cu-react-water', kind: 'misconception_check', question: 'A friend says "any metal will react with any acid." Right?', commonErrors: [{ answer: 'Yes — all metals react.', misconception: 'Ignoring the reactivity series.', correctsTo: 'Only metals MORE reactive than HYDROGEN react with acids to release H₂. Cu, Ag, Au (less reactive than H) do NOT react with HCl. That\'s why pennies (Cu) don\'t dissolve in vinegar (a weak acid). Always check the activity series.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['5 types: synthesis, decomposition, single rep, double rep, combustion.', 'Activity series predicts single replacement.', 'Solubility rules predict precipitates in double replacement.', 'Combustion always: hydrocarbon + O₂ → CO₂ + H₂O.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
