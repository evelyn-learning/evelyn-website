/**
 * Chemistry — Unit 5 topic 5.2: Classifying Chemical Reactions.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u5-reaction-types.ts
 * (planId evelyn.hs.chem.reaction-types.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.reaction-types';

export const BASELINE_CHEM_U5_REACTION_TYPES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.reaction-types.v1',
  course: 'Chemistry',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Classifying Chemical Reactions',
  planId: 'evelyn.hs.chem.reaction-types.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.reaction-types.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Why classify',
      content:
        'A reaction type is a recipe. Naming the pattern tells you the SHAPE of the products before you know their formulas, and tells you which balancing job is coming. Classification is what converts "memorize this equation" into "predict this equation."',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Synthesis and decomposition',
      content:
        'SYNTHESIS (combination): two or more simple things become ONE — A + B → AB. Two reactants, exactly ONE product. Example N₂ + 3 H₂ → 2 NH₃. DECOMPOSITION is the reverse: ONE compound splits into two or more pieces, AB → A + B, usually driven by heat or electricity. Example 2 H₂O₂ → 2 H₂O + O₂. A single reactant is the giveaway.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Single vs double replacement',
      content:
        'SINGLE REPLACEMENT: a lone ELEMENT trades places with one partner inside a compound — A + BC → AC + B. One element + one compound in; a different element + a different compound out. Example Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag. DOUBLE REPLACEMENT: two COMPOUNDS swap partners — AB + CD → AD + CB, with no lone element on either side. Example AgNO₃ + NaCl → AgCl + NaNO₃.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Driving force for double replacement',
      content:
        'A partner swap only runs when it makes something that LEAVES the solution: an insoluble solid (precipitate), a gas, or water. If all four ions stay dissolved, nothing has actually happened.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Neutralization is a double replacement',
      content:
        'Acid + base → salt + water is the swap whose escape product is water. Example Ba(OH)₂ + H₂SO₄ → BaSO₄ + 2 H₂O. "Double replacement" is always a correct call; "neutralization" is the sharper name.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Combustion',
      content:
        'A fuel burns in O₂. For a hydrocarbon (C and H only) the products are locked: fuel + O₂ → CO₂ + H₂O + energy. Example CH₄ + 2 O₂ → CO₂ + 2 H₂O. You never guess hydrocarbon combustion products — you only balance them.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The count-the-pieces test',
      content:
        'One reactant → decomposition. One product → synthesis. Two reactants with exactly one lone ELEMENT → single replacement. Two reactants that are both COMPOUNDS → double replacement. O₂ going IN with a hydrocarbon → combustion. Count first; pattern-matching on familiar formulas is what produces wrong calls.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Key terms',
      content:
        'PRECIPITATE — an insoluble solid that forms and drops out when two solutions are mixed. COMBUSTION — a fuel burning in oxygen with energy release; hydrocarbons always give CO₂ and H₂O. NEUTRALIZATION — the double-replacement reaction of an acid with a base, producing a salt and water.',
    },
  ],
  methods: [
    {
      title: 'Classify any reaction by counting pieces',
      when_to_use:
        'Given a written equation and asked which of the five patterns it is.',
      steps: [
        'Count REACTANTS. Exactly one → decomposition; stop.',
        'Count PRODUCTS. Exactly one → synthesis; stop.',
        'With two reactants, ask whether either one is a lone ELEMENT (a bare symbol or a diatomic like O₂, Cl₂).',
        'Exactly one lone element → single replacement. Both compounds → double replacement.',
        'Special case: if the lone element is O₂ on the REACTANT side and the other reactant is a hydrocarbon, call it combustion (CO₂ + H₂O out).',
        'Sanity-check the call against the product side: a swap must produce two compounds; a synthesis must leave nothing behind.',
      ],
      example: {
        problem: 'Classify (a) Fe + CuSO₄ → FeSO₄ + Cu, (b) Ba(OH)₂ + H₂SO₄ → BaSO₄ + 2 H₂O, (c) C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
        solution:
          '(a) Two reactants, Fe is a lone element → SINGLE REPLACEMENT. (b) Two reactants, both compounds → DOUBLE REPLACEMENT (also neutralization, since the escape product is water). (c) Hydrocarbon + O₂ in, CO₂ + H₂O out → COMBUSTION.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Disprove a wrong classification',
      when_to_use:
        'When asked to diagnose a student\'s classification, or to check your own call before committing.',
      steps: [
        'Restate the structural signature the claimed type requires (decomposition: 1 reactant; synthesis: 1 product; double replacement: 2 compounds in AND 2 compounds out; combustion: O₂ consumed by a fuel).',
        'Count the actual reactants and products in the equation and compare to that signature.',
        'If the counts fail, the claim is dead regardless of which familiar formulas appear.',
        'Re-run the count-the-pieces test to name the true type.',
      ],
      example: {
        problem: 'A student calls CaO + H₂O → Ca(OH)₂ a double replacement "because water is a reactant." Diagnose.',
        solution:
          'Double replacement must yield TWO compounds; here there is exactly ONE product. Two reactants and one product is the signature of SYNTHESIS. The flaw was pattern-matching on the familiar formula H₂O instead of counting.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Five patterns cover nearly everything: synthesis, decomposition, single replacement, double replacement, combustion.',
      kind: 'tip',
    },
    {
      content:
        'Count first: one reactant → decomposition; one product → synthesis. These two calls need no chemistry at all.',
      kind: 'tip',
    },
    {
      content:
        'Two reactants with exactly one lone ELEMENT → single replacement; two COMPOUNDS → double replacement.',
      kind: 'tip',
    },
    {
      content:
        'The star trap: O₂ appearing in an equation does not mean combustion. In 2 KClO₃ → 2 KCl + 3 O₂ the oxygen is a PRODUCT and there is one reactant — decomposition, and in fact how lab oxygen is generated.',
      kind: 'gotcha',
    },
    {
      content:
        'Combustion needs O₂ going IN plus a fuel. Check which SIDE the O₂ is on before you commit.',
      kind: 'common-error',
    },
    {
      content:
        'Neutralization (acid + base → salt + water) is a double replacement whose escape product is water — the more specific name, not a sixth category.',
      kind: 'edge-case',
    },
    {
      content:
        'Hydrocarbon + O₂ → CO₂ + H₂O, always. The products are never a guess, only a balancing job.',
      kind: 'tip',
    },
  ],
};
