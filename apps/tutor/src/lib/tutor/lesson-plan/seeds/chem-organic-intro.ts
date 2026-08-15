/**
 * HS Chemistry — Introduction to Organic Chemistry.
 * Carbon's bonding versatility, hydrocarbons, functional groups.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_ORGANIC_INTRO: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.organic-intro.v1',
  title: 'Introduction to Organic Chemistry',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ls1-6', description: 'Construct and revise an explanation based on evidence for how carbon, hydrogen, and oxygen from sugar molecules may combine with other elements to form amino acids and/or other large carbon-based molecules.', standard: 'NGSS.HS-LS1-6' }],
  prerequisites: ['hs.chem.covalent-bonding-lewis'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in carbon\'s versatility.', script: 'Plastic. Gasoline. DNA. Sugar. Asprin. Caffeine. All have one thing in common: CARBON. Carbon makes 4 bonds → forms chains, rings, branches. Over 10 million carbon-based compounds known. ORGANIC CHEMISTRY is the chemistry of carbon — and life.', estimatedMinutes: 2 },
    { id: 'concept-carbon', kind: 'concept', goal: 'Carbon forms 4 bonds → endless structural possibilities.', keyIdeas: [
      'CARBON has 4 valence electrons → forms 4 covalent bonds.',
      'Can bond to itself: CHAINS, RINGS, BRANCHES.',
      'HYDROCARBONS = compounds of just C and H.',
      'TYPES of hydrocarbons by bonds:',
      '  · ALKANES: only single bonds. Saturated. CₙH₂ₙ₊₂.',
      '    - methane CH₄, ethane C₂H₆, propane C₃H₈, butane C₄H₁₀, pentane C₅H₁₂.',
      '  · ALKENES: at least one double bond. CₙH₂ₙ.',
      '    - ethene (ethylene) C₂H₄.',
      '  · ALKYNES: at least one triple bond. CₙH₂ₙ₋₂.',
      '    - ethyne (acetylene) C₂H₂.',
      '  · AROMATIC: ring with alternating double bonds, like benzene C₆H₆.',
    ], vocabulary: [{ term: 'hydrocarbon', definition: 'compound of C and H only.' }, { term: 'alkane', definition: 'saturated hydrocarbon, single bonds only.' }, { term: 'isomer', definition: 'same formula, different structure.' }], estimatedMinutes: 5 },
    { id: 'concept-functional-groups', kind: 'concept', goal: 'Functional groups give organic molecules their reactivity.', keyIdeas: [
      'FUNCTIONAL GROUP = a specific arrangement of atoms that gives a molecule particular chemistry.',
      'COMMON ones:',
      '  · ALCOHOL: −OH. Examples: ethanol (drinking alcohol), methanol.',
      '  · CARBOXYLIC ACID: −COOH. Examples: vinegar (acetic acid), aspirin.',
      '  · AMINE: −NH₂. Found in amino acids, neurotransmitters.',
      '  · ESTER: −COO−. Fragrant — fruity smells (banana, pineapple).',
      '  · KETONE: C=O between two carbons. Examples: acetone (nail polish remover).',
      '  · ALDEHYDE: C=O at end of chain. Formaldehyde.',
      'Same functional group → similar reactions across different molecules.',
      'Most BIOMOLECULES (proteins, sugars, lipids, DNA) are organic with multiple functional groups.',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'worked-name', kind: 'worked_example', problem: 'Identify the type of hydrocarbon and the functional group (if any) in: (a) C₃H₈, (b) C₂H₄, (c) CH₃CH₂OH.', steps: [
      '(a) C₃H₈ = propane. Check: CₙH₂ₙ₊₂ → 2(3)+2 = 8 ✓. ALKANE (single bonds only). No functional group. (Propane gas in BBQ tanks.)',
      '(b) C₂H₄ = ethene. CₙH₂ₙ → 2(2) = 4 ✓. ALKENE (one double bond). C=C. (Ethylene = main industrial organic chemical.)',
      '(c) CH₃CH₂OH = ethanol. Has −OH → ALCOHOL functional group. Underlying skeleton is ethane (C₂H₆) with OH replacing H.',
    ], answer: '(a) propane = alkane. (b) ethene = alkene. (c) ethanol = alcohol.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Acetic acid (vinegar) is CH₃COOH. What functional group does it have? What does that mean for its chemistry?', expectedAnswer: 'CARBOXYLIC ACID functional group (−COOH). That makes it ACIDIC — donates H⁺ from the OH. pKa ~4.7 (weak acid). It reacts with bases to form salts (acetate). Same functional group is in aspirin, citric acid, fatty acids — all weak acids with similar reactions.', responseFormat: 'free', hints: ['Look at the −COOH group.', 'What kind of compound has -COOH?'], estimatedMinutes: 3 },
    { id: 'misconception-organic-living', kind: 'misconception_check', question: 'A friend says "organic chemistry is only about chemicals from living things." Right?', commonErrors: [{ answer: 'Yes — only living source.', misconception: 'Confusing chemistry definition with marketing.', correctsTo: 'In chemistry, ORGANIC = contains CARBON (with H, often O, N, etc.). The 19th-century "vital force" theory (organic = from life) was disproved in 1828 when Wöhler made urea from inorganic chemicals. Plastics, gasoline, synthetic dyes — all organic, none from living things. The "organic food" label is unrelated.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Carbon makes 4 bonds → chains, rings, branches.', 'Alkanes (single), alkenes (double), alkynes (triple).', 'Functional groups (-OH, -COOH, -NH₂, etc.) give specific reactivity.', 'Organic = carbon-based. Not exclusive to living things.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
