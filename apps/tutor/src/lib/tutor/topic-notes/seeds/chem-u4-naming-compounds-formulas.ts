/**
 * Chemistry — Unit 4 topic 4.3: Naming Compounds & Writing Formulas.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u4-naming-compounds-formulas.ts
 * (planId evelyn.hs.chem.naming-compounds-formulas.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.naming-compounds-formulas';
const PLAN_ID = 'evelyn.hs.chem.naming-compounds-formulas.v1';

export const BASELINE_CHEM_U4_NAMING_COMPOUNDS_FORMULAS: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Naming Compounds & Writing Formulas',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The first decision: which ruleset',
      content:
        'Metal + nonmetal (or anything built from ions) → IONIC rules. Two nonmetals → COVALENT rules. Starts with H and dissolved in water → ACID rules. Every naming question begins here, because the three rulesets contradict each other on purpose. Vocabulary: nomenclature = the rules mapping one name onto exactly one formula.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Ionic names',
      content:
        'Cation name unchanged, then the anion root + -ide: NaCl sodium chloride, MgO magnesium oxide, Li₃N lithium nitride. A polyatomic ion keeps its own name: Ca(NO₃)₂ calcium nitrate. Ionic names NEVER take prefixes, because the charges already lock the ratio.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Roman numeral = charge per ion',
      content:
        'Transition metals (Fe, Cu, Cr, Co, Mn, Pb, Sn) carry more than one possible charge, so the name must state which one — and the numeral is the CHARGE ON ONE METAL ION, never a count of atoms. Work it out from the anion: in CuCl₂ two Cl⁻ supply −2, so Cu is +2 → copper(II) chloride. Fixed-charge metals (Group 1 → +1, Group 2 → +2, Al³⁺, Zn²⁺, Ag⁺) take no numeral.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Polyatomic ions worth memorizing',
      content:
        'NO₃⁻ nitrate, SO₄²⁻ sulfate, PO₄³⁻ phosphate, CO₃²⁻ carbonate, OH⁻ hydroxide, NH₄⁺ ammonium, HCO₃⁻ bicarbonate. A polyatomic ion is a covalently bonded group carrying one overall charge that travels through reactions as a unit. The -ate/-ite pair differs by ONE oxygen with the charge unchanged: SO₄²⁻ sulfate vs SO₃²⁻ sulfite; NO₃⁻ nitrate vs NO₂⁻ nitrite.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Covalent names count',
      content:
        'Two nonmetals have no charges to pin the ratio, so the name must COUNT: prefix + first element, prefix + second element root + -ide, using mono, di, tri, tetra, penta, hexa. Skip mono- on the first element only, and drop the clashing vowel. CO carbon monoxide, CO₂ carbon dioxide, N₂O₅ dinitrogen pentoxide, P₄O₁₀ tetraphosphorus decoxide.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Acid patterns',
      content:
        'H at the front, in water — the pattern follows the anion. Binary (H + one nonmetal): hydro- + root + -ic acid (HCl hydrochloric, H₂S hydrosulfuric). An -ate polyatomic → -ic acid (H₂SO₄ sulfuric, HNO₃ nitric). An -ite polyatomic → -ous acid (H₂SO₃ sulfurous, HNO₂ nitrous).',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Name → formula: neutrality then parentheses',
      content:
        'Total positive charge must equal total negative. Criss-cross each ion\'s charge into the other\'s subscript, then REDUCE to lowest whole numbers (Mg₂O₂ → MgO). Any polyatomic ion needing a subscript above 1 gets PARENTHESES: Ca(NO₃)₂, never CaNO₃₂. A formula unit is the lowest whole-number ion ratio, which is what an ionic formula reports.',
    },
  ],
  methods: [
    {
      title: 'Formula → name',
      when_to_use: 'Given a formula and asked for the compound name.',
      steps: [
        'Classify: is the first element a metal (ionic), are both nonmetals (covalent), or is it H in water (acid)?',
        'IONIC — name the cation, then the anion root + -ide; substitute the polyatomic ion\'s own name if present. Use no prefixes.',
        'If the metal is a transition metal, back out its charge from the anion side (anion charge × count, then divide by the number of metal ions) and write it as a Roman numeral.',
        'COVALENT — attach counting prefixes from the subscripts, skipping mono- on the first element and contracting clashing vowels (pentaoxide → pentoxide).',
        'Sanity check: prefixes only appeared on a covalent name, a numeral only on a variable-charge metal.',
      ],
      example: {
        problem: 'Name K₂S, Cu(NO₃)₂, and N₂O₅.',
        solution:
          'K₂S — ionic, K is Group 1 (fixed +1, no numeral) → potassium sulfide; the 2 never appears in the name. Cu(NO₃)₂ — two nitrates give −2, so Cu is +2 → copper(II) nitrate. N₂O₅ — two nonmetals → dinitrogen pentoxide.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Name → formula',
      when_to_use: 'Given an ionic name (with or without a Roman numeral) and asked for the formula.',
      steps: [
        'Write both ions with charges: cation from the group or from the Roman numeral, anion from the -ide root or the polyatomic table.',
        'Criss-cross the charge magnitudes into the opposite subscripts.',
        'REDUCE the subscripts to the lowest whole-number ratio.',
        'Wrap any polyatomic ion in PARENTHESES before attaching a subscript above 1.',
        'Verify neutrality by summing signed charges — the total must be 0.',
      ],
      example: {
        problem: 'Write the formula for calcium phosphate, then for iron(III) sulfate.',
        solution:
          'Ca²⁺ with PO₄³⁻ → criss-cross to 3 and 2 → Ca₃(PO₄)₂ (+6 and −6 balance). Fe³⁺ with SO₄²⁻ → Fe₂(SO₄)₃; three sulfates × 4 O each = 12 oxygen atoms per formula unit.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'The Roman numeral is a CHARGE, not a subscript. Fe₂O₃ is iron(III) oxide — the subscripts are the criss-crossed charges, so reading them straight across swaps the two ions.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Ionic names take no prefixes. CaCl₂ is calcium chloride, never "calcium dichloride" — the charges already force a 1:2 ratio, so stating it adds nothing.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Lose the parentheses and the subscript lands on one atom instead of the whole ion: Ca₃PO₄₂ claims 42 oxygens. Polyatomic + subscript > 1 → parentheses, always.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'After criss-crossing, always reduce. Mg²⁺ with O²⁻ gives Mg₂O₂ on paper but MgO in reality.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'One-letter differences are different substances: -ate has one MORE oxygen than -ite (nitrate NO₃⁻ vs nitrite NO₂⁻), and the charge is unchanged.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
