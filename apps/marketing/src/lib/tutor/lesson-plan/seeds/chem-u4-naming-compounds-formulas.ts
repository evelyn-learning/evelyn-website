/**
 * Chemistry — Bonding: Naming Compounds & Writing Formulas.
 *
 * Nomenclature as a two-way translation (NGSS HS-PS1-1): name → formula and
 * formula → name, with the metal/nonmetal decision picking the ruleset. The
 * classic errors get equal billing — prefixes smuggled onto ionic names, and
 * reading a Roman numeral straight off the metal's subscript.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U4_NAMING_COMPOUNDS_FORMULAS: LessonPlan = {
  id: 'evelyn.hs.chem.naming-compounds-formulas.v1',
  title: 'Naming Compounds & Writing Formulas',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.naming-compounds-formulas',
      standard: 'CHEM-4.3',
      description:
        'Translate between chemical names and chemical formulas for ionic, covalent, and acidic compounds using charge balance, Roman numerals, polyatomic ions, and covalent prefixes (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.covalent-bonding-lewis'],
  followUps: ['chem.molecular-shape-vsepr'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A chemical name is an exact set of instructions — one syllable off and you have a different substance entirely.',
      script:
        'An iron supplement on the pharmacy shelf says iron(II) sulfate, never iron(III) sulfate — your gut absorbs the first and mostly ignores the second, so that single Roman numeral decides whether the pill works. Down the aisle, cured bacon lists sodium nitrite; swap one letter to sodium nitrate and you have a different compound doing a different job. Chemical names are not labels somebody picked, they are compressed instructions: which atoms, which charges, in exactly what ratio. Today you learn to read those instructions both directions — name to formula, formula to name — which is the skill every equation, every reaction, and every gram calculation in the rest of this course quietly assumes you already have.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nomenclature',
      kind: 'concept',
      goal: 'One decision (metal or not) selects the ruleset; charge balance builds the formula; the classic naming traps.',
      keyIdeas: [
        'THE FIRST DECISION: IS THERE A METAL? — metal + nonmetal (or any compound built from ions) → IONIC rules. Two nonmetals → COVALENT rules. Starts with H and dissolved in water → ACID rules. Every naming question begins here, because the three rulesets contradict each other on purpose.',
        'IONIC NAMES — cation name unchanged, then the anion root plus -ide: NaCl = sodium chloride, MgO = magnesium oxide, Li₃N = lithium nitride. A polyatomic ion keeps its own name instead: Ca(NO₃)₂ = calcium nitrate. Ionic names NEVER take prefixes, because the charges already lock the ratio.',
        'ROMAN NUMERALS — transition metals (Fe, Cu, Cr, Co, Mn, Pb, Sn) can carry more than one charge, so the name must state which one: the numeral is the CHARGE ON ONE METAL ION, not a count of atoms. Work it out from the anion: in CuCl₂ the two Cl⁻ supply −2, so one Cu must be +2 → copper(II) chloride. Fixed-charge metals (group 1 = +1, group 2 = +2, Al³⁺, Zn²⁺, Ag⁺) get no numeral.',
        'POLYATOMIC IONS WORTH MEMORIZING — NO₃⁻ nitrate, SO₄²⁻ sulfate, PO₄³⁻ phosphate, CO₃²⁻ carbonate, OH⁻ hydroxide, NH₄⁺ ammonium, HCO₃⁻ bicarbonate. The -ate/-ite pair differs by ONE oxygen with the charge unchanged: SO₄²⁻ sulfate vs SO₃²⁻ sulfite, NO₃⁻ nitrate vs NO₂⁻ nitrite.',
        'COVALENT NAMES — two nonmetals share electrons, so no charges fix the ratio and the name must COUNT: prefix + first element, prefix + second element root + -ide, using mono, di, tri, tetra, penta, hexa. Skip mono- on the first element only, and drop the clashing vowel: CO = carbon monoxide, CO₂ = carbon dioxide, N₂O₅ = dinitrogen pentoxide, P₄O₁₀ = tetraphosphorus decoxide.',
        'WRITING A FORMULA FROM A NAME — the compound must be electrically NEUTRAL, so total positive charge equals total negative charge. Criss-cross each ion\'s charge into the other\'s subscript, then REDUCE to lowest whole-number ratio (Mg²⁺ with O²⁻ gives Mg₂O₂, which reduces to MgO). Any polyatomic ion that needs a subscript above 1 gets PARENTHESES: calcium nitrate is Ca(NO₃)₂, never CaNO₃₂.',
        'ACIDS — a formula starting with H in water gets its own naming pattern tied to the anion: binary acids (H + one nonmetal) become hydro- + root + -ic acid (HCl = hydrochloric acid, H₂S = hydrosulfuric acid), an -ate polyatomic becomes -ic acid (H₂SO₄ = sulfuric acid, HNO₃ = nitric acid), and an -ite polyatomic becomes -ous acid (H₂SO₃ = sulfurous acid, HNO₂ = nitrous acid).',
        'THE TRAPS — (1) prefixes on an ionic name: CaCl₂ is calcium chloride, never "calcium dichloride"; (2) reading the Roman numeral off the metal\'s subscript: Fe₂O₃ is iron(III) oxide, not iron(II) oxide; (3) losing the parentheses so the subscript attaches to one atom instead of the whole ion; (4) forgetting to reduce after the criss-cross.',
      ],
      vocabulary: [
        { term: 'nomenclature', definition: 'the systematic rules that map a chemical name onto exactly one chemical formula.' },
        { term: 'polyatomic ion', definition: 'a group of covalently bonded atoms that carries an overall charge and travels through reactions as one unit.' },
        { term: 'formula unit', definition: 'the lowest whole-number ratio of ions in an ionic compound, which is what an ionic formula reports.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-three',
      kind: 'worked_example',
      problem:
        'Name each compound: (a) K₂S, (b) Cu(NO₃)₂, (c) N₂O₅.',
      steps: [
        '(a) K₂S — potassium is a metal, sulfur is a nonmetal, so ionic rules apply. Potassium is group 1, fixed at +1, so no Roman numeral. Cation name plus anion root + -ide gives potassium sulfide. Note the 2 never appears in the name.',
        '(b) Cu(NO₃)₂ — copper is a transition metal and NO₃⁻ is nitrate, a polyatomic that keeps its own name. Two nitrates supply 2 × (−1) = −2, so the single Cu must be +2. The name is copper(II) nitrate.',
        '(c) N₂O₅ — nitrogen and oxygen are both nonmetals, so covalent rules apply and the prefixes carry the counts. Two nitrogens → di-, five oxygens → penta-, and pentaoxide contracts to pentoxide, giving dinitrogen pentoxide.',
        'Sanity check: only the covalent name used prefixes, and only the transition-metal name used a Roman numeral — exactly as the ruleset predicts.',
      ],
      answer: 'K₂S = potassium sulfide; Cu(NO₃)₂ = copper(II) nitrate; N₂O₅ = dinitrogen pentoxide',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-roman-numeral-trap',
      kind: 'worked_example',
      problem:
        'A student names Fe₂O₃ "iron(II) oxide" because of the 2 written next to Fe. Find the flaw and give the correct name, then write the formula for calcium phosphate.',
      steps: [
        'The Roman numeral reports the CHARGE on one metal ion, not how many metal atoms appear — so a subscript can never be copied straight into the parentheses.',
        'Get the charge from the anion side, which is fixed: oxide is O²⁻, and there are three of them, so the negative total is 3 × (−2) = −6.',
        'The compound is neutral, so the two iron ions must supply +6 between them, meaning each iron is +3. Fe₂O₃ is iron(III) oxide — the subscripts are actually the criss-crossed charges, so reading them directly gets the two ions backwards.',
        'Now the reverse direction: calcium phosphate is Ca²⁺ with PO₄³⁻. Criss-cross the charges — 3 calcium ions and 2 phosphate ions — giving +6 and −6, which balances.',
        'Phosphate takes a subscript above 1, so it needs parentheses: Ca₃(PO₄)₂. Writing Ca₃PO₄₂ would claim 42 oxygen atoms, and CaPO₄ would leave the compound with a leftover charge.',
      ],
      answer: 'Fe₂O₃ = iron(III) oxide (the numeral is the charge, not the subscript); calcium phosphate = Ca₃(PO₄)₂',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-cu2o',
      kind: 'try_yourself',
      problem: 'What is the correct name for Cu₂O?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'copper(I) oxide', correct: true },
        { id: 'b', text: 'copper(II) oxide' },
        { id: 'c', text: 'dicopper monoxide' },
        { id: 'd', text: 'copper oxide' },
      ],
      expectedAnswer: 'copper(I) oxide',
      hints: [
        'Oxide is always O²⁻. If one oxide supplies −2 and two copper ions must cancel it, what charge does each copper carry?',
        'Copper is a transition metal, so the name needs a numeral — but the numeral is the charge per ion, not the subscript 2, and ionic names never take prefixes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-formula-calcium-hydroxide',
      kind: 'try_yourself',
      problem: 'Which formula correctly represents calcium hydroxide, the compound in the slaked lime used to treat drinking water?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ca(OH)₂', correct: true },
        { id: 'b', text: 'CaOH₂' },
        { id: 'c', text: 'CaOH' },
        { id: 'd', text: 'Ca₂OH' },
      ],
      expectedAnswer: 'Ca(OH)₂',
      hints: [
        'Calcium is group 2, so Ca²⁺; hydroxide is the polyatomic ion OH⁻. How many hydroxides does it take to cancel +2?',
        'When a polyatomic ion needs a subscript above 1, the whole ion goes in parentheses — otherwise the subscript lands on only the last atom.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Iron(III) sulfate is a coagulant used in water treatment. Write its chemical formula from the name (iron is +3 here, and sulfate is SO₄²⁻), then count how many oxygen atoms are in ONE formula unit. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Balance the charges first: how many Fe³⁺ and how many SO₄²⁻ make the total charge zero?',
        'The formula is Fe₂(SO₄)₃ — three sulfate groups, and each sulfate carries 4 oxygen atoms.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-prefixes-on-ionic',
      kind: 'misconception_check',
      question:
        'A student names CaCl₂ "calcium dichloride" and defends it by saying the formula clearly shows two chlorines. What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Calcium dichloride — the prefix just reports the two chlorine atoms',
          misconception: 'Applying covalent counting prefixes to an ionic compound, as if the ratio were a free choice that has to be announced.',
          correctsTo:
            'Prefixes exist only because covalent compounds have no charges to pin the ratio — nitrogen and oxygen really can combine as NO, N₂O, or N₂O₅, so the name must count. In an ionic compound the charges already decide everything: calcium is only ever Ca²⁺ and chloride only ever Cl⁻, so two chlorides is the ONLY neutral combination and stating it adds nothing. The correct name is calcium chloride, and the reader reconstructs the 2 from the charges.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Check for a metal first: metal + nonmetal → ionic rules, two nonmetals → covalent prefixes, H in water → acid rules.',
        'Ionic names take no prefixes; a transition metal gets a Roman numeral equal to the CHARGE on one ion, worked out from the anion.',
        'Covalent names count with prefixes (mono, di, tri, tetra, penta), skipping mono- on the first element: CO₂ = carbon dioxide, N₂O₅ = dinitrogen pentoxide.',
        'Name → formula: balance total charge to zero, criss-cross, reduce, and wrap any polyatomic ion in parentheses before adding a subscript — Ca(NO₃)₂, Ca₃(PO₄)₂.',
        'The trap: a subscript is not a charge. Fe₂O₃ is iron(III) oxide, and CaCl₂ is calcium chloride, never calcium dichloride.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Naming Compounds & Writing Formulas' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
