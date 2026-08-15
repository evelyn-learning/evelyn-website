/**
 * HS Chemistry — Naming Compounds (Nomenclature).
 * Foundational nomenclature for ionic, covalent, and acid compounds.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_NAMING_COMPOUNDS: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.naming-compounds.v1',
  title: 'Naming Compounds (Nomenclature)',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-2', description: 'Construct and revise an explanation for the outcome of a simple chemical reaction based on the outermost electron states of atoms.', standard: 'NGSS.HS-PS1-2' }],
  prerequisites: ['hs.chem.ionic-bonding', 'hs.chem.covalent-bonding-lewis'], followUps: ['hs.chem.mole-stoichiometry'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Why nomenclature matters.', script: 'Sodium chloride. Carbon dioxide. Sulfuric acid. Each name tells a chemist EXACTLY what atoms are in what ratio. Get a name wrong → wrong compound → could be anything from harmless to deadly. Nomenclature is the universal language of chemistry.', estimatedMinutes: 2 },
    { id: 'concept-ionic-naming', kind: 'concept', goal: 'Naming ionic compounds: cation name + anion name (with -ide ending).', keyIdeas: [
      'IONIC = metal + nonmetal (or polyatomic ion).',
      'NAME RULES:',
      '  1. Cation (metal) keeps its name: Na = sodium, Mg = magnesium.',
      '  2. Anion (nonmetal): root + -ide. Cl → chloride, O → oxide, N → nitride.',
      'Example: NaCl = sodium chloride. MgO = magnesium oxide.',
      'TRANSITION METALS need ROMAN NUMERALS (multiple charges possible):',
      '  · FeCl₂ = iron(II) chloride. FeCl₃ = iron(III) chloride.',
      '  · CuO = copper(II) oxide.',
      'POLYATOMIC IONS to memorize:',
      '  · NO₃⁻ nitrate. SO₄²⁻ sulfate. PO₄³⁻ phosphate. CO₃²⁻ carbonate. OH⁻ hydroxide. NH₄⁺ ammonium.',
      'Example: Ca(NO₃)₂ = calcium nitrate.',
    ], vocabulary: [{ term: 'polyatomic ion', definition: 'group of atoms with overall charge.' }, { term: 'nomenclature', definition: 'systematic naming rules.' }], estimatedMinutes: 5 },
    { id: 'concept-covalent-naming', kind: 'concept', goal: 'Naming covalent compounds: prefixes (mono, di, tri...) + -ide.', keyIdeas: [
      'COVALENT = nonmetal + nonmetal.',
      'NAME RULES:',
      '  1. PREFIX + first element name + PREFIX + second element root + -ide.',
      '  2. Skip "mono-" on the FIRST element.',
      'PREFIXES: 1=mono, 2=di, 3=tri, 4=tetra, 5=penta, 6=hexa, 7=hepta, 8=octa, 9=nona, 10=deca.',
      'EXAMPLES:',
      '  · CO = carbon monoxide.',
      '  · CO₂ = carbon dioxide.',
      '  · N₂O₄ = dinitrogen tetroxide.',
      '  · P₄O₁₀ = tetraphosphorus decoxide.',
    ], estimatedMinutes: 4 },
    { id: 'concept-acids', kind: 'concept', goal: 'Acids have special naming based on the anion.', keyIdeas: [
      'ACIDS start with H⁺ (hydrogen ion).',
      'BINARY ACIDS (H + nonmetal): "hydro-" + root + "-ic acid".',
      '  · HCl = hydrochloric acid. H₂S = hydrosulfuric acid.',
      'OXYACIDS (H + polyatomic with O):',
      '  · -ate → -ic acid: HNO₃ = nitric acid. H₂SO₄ = sulfuric acid.',
      '  · -ite → -ous acid: HNO₂ = nitrous acid. H₂SO₃ = sulfurous acid.',
    ], estimatedMinutes: 3 },
    { id: 'worked-examples', kind: 'worked_example', problem: 'Name three compounds: K₂SO₄, N₂O₅, HBr (in solution).', steps: [
      'K₂SO₄: K (metal) + SO₄²⁻ (sulfate polyatomic) → IONIC. Name = "potassium sulfate."',
      'N₂O₅: nitrogen + oxygen, both nonmetals → COVALENT. Use prefixes. Di + nitrogen + penta + oxide → "dinitrogen pentoxide."',
      'HBr (aqueous): H + Br = binary acid. "hydro" + "brom" + "ic acid" → "hydrobromic acid."',
    ], answer: 'K₂SO₄ = potassium sulfate (ionic). N₂O₅ = dinitrogen pentoxide (covalent). HBr = hydrobromic acid.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Name these: (a) MgCl₂, (b) PCl₃, (c) Fe₂O₃.', expectedAnswer: '(a) MgCl₂ = magnesium chloride (ionic; Mg always +2 so no Roman numeral needed). (b) PCl₃ = phosphorus trichloride (covalent — both nonmetals; no "mono" on P). (c) Fe₂O₃ = iron(III) oxide (transition metal; Fe is +3 here because 2(+3) = 3(−2) for charge balance).', responseFormat: 'free', hints: ['Identify ionic vs covalent first.', 'Transition metals need Roman numerals.'], estimatedMinutes: 3 },
    { id: 'misconception-prefix-ionic', kind: 'misconception_check', question: 'A friend names CaCl₂ "calcium dichloride." Why is that wrong?', commonErrors: [{ answer: 'Looks fine.', misconception: 'Using prefixes with ionic compounds.', correctsTo: 'PREFIXES (mono, di, tri) only used for COVALENT compounds. CaCl₂ is IONIC (metal + nonmetal). Calcium is always Ca²⁺, so it can ONLY combine with 2 Cl⁻ — there\'s no other ratio possible. So you don\'t need (and can\'t use) "di-". Correct name: just "calcium chloride."' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Ionic = metal + nonmetal. Cation + anion-ide. No prefixes.', 'Transition metals need Roman numerals (multiple charges).', 'Covalent = 2 nonmetals. Use prefixes (mono, di...).', 'Acids: hydro-X-ic (binary), X-ic/X-ous (oxyacids).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
