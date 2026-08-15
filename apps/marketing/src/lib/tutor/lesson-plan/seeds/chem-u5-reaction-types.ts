/**
 * Chemistry — Chemical Reactions: Classifying Chemical Reactions.
 *
 * Millions of known reactions collapse into five recognizable patterns
 * (NGSS HS-PS1-2). Classification is the gateway skill: name the pattern
 * and the products follow. The star misconception gets equal billing —
 * "there is O₂ in the equation, so it must be combustion."
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U5_REACTION_TYPES: LessonPlan = {
  id: 'evelyn.hs.chem.reaction-types.v1',
  title: 'Classifying Chemical Reactions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.reaction-types',
      standard: 'CHEM-5.2',
      description:
        'Classify a chemical reaction as synthesis, decomposition, single replacement, double replacement, or combustion by comparing the counts and structures of reactants and products (NGSS HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.balancing-equations'],
  followUps: ['chem.predicting-products-activity'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Five patterns cover almost every reaction a chemist meets — recognizing the pattern is what makes prediction possible.',
      script:
        'The airbag in a car has about 30 milliseconds to inflate. It works because sodium azide rips itself apart on command: 2 NaN₃ → 2 Na + 3 N₂ — a solid pellet becoming a balloon of nitrogen gas. Rust forming on a bike, vinegar fizzing with baking soda, propane burning in a grill: chemists have catalogued millions of reactions, but nearly all of them fall into just FIVE patterns. Learn the five and you stop memorizing equations one at a time — you look at reactants and predict what comes out. That is today\'s job: name the pattern.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-types',
      kind: 'concept',
      goal: 'The five reaction patterns, the count-the-pieces test that identifies them, and the O₂ trap.',
      keyIdeas: [
        'WHY CLASSIFY — a reaction type is a recipe. Once you know the pattern, you know the SHAPE of the products before you know their formulas, and you know which balancing job is coming. Classification is the step that turns "memorize this equation" into "predict this equation."',
        'SYNTHESIS (combination) — two or more simple things become ONE: A + B → AB. Two reactants, ONE product, every time. Example: N₂ + 3 H₂ → 2 NH₃ (the reaction that makes fertilizer, and therefore most of the food you eat).',
        'DECOMPOSITION — the reverse: ONE compound breaks into two or more pieces, AB → A + B, usually driven by heat or electricity. Example: 2 H₂O₂ → 2 H₂O + O₂, the fizz when hydrogen peroxide hits a cut. ONE reactant is the giveaway.',
        'SINGLE REPLACEMENT — a lone ELEMENT trades places with one partner inside a compound: A + BC → AC + B. One element and one compound go in; a different element and a different compound come out. Example: Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag, the reaction that silver-plates a zinc strip.',
        'DOUBLE REPLACEMENT — two COMPOUNDS swap partners: AB + CD → AD + CB. Nothing is a lone element on either side. It runs when the swap makes something that leaves the solution: a solid precipitate, a gas, or water. Example: AgNO₃ + NaCl → AgCl + NaNO₃, where AgCl drops out as a white solid.',
        'NEUTRALIZATION IS A DOUBLE REPLACEMENT — acid + base → salt + water is just the swap where the escape product is water. Example: Ba(OH)₂ + H₂SO₄ → BaSO₄ + 2 H₂O. Call it double replacement; call it neutralization for extra credit.',
        'COMBUSTION — a fuel burns in O₂. For a hydrocarbon (C and H only), the products are locked: fuel + O₂ → CO₂ + H₂O + energy. Example: CH₄ + 2 O₂ → CO₂ + 2 H₂O. You never have to guess the products of a hydrocarbon combustion — only balance them.',
        'THE TEST: COUNT THE PIECES FIRST — one reactant → decomposition. One product → synthesis. Two reactants where exactly one is a lone ELEMENT → single replacement. Two reactants that are both COMPOUNDS → double replacement. O₂ as a REACTANT with a hydrocarbon → combustion. Count before you pattern-match on familiar formulas.',
        'THE TRAP: O₂ IN THE EQUATION ≠ COMBUSTION — in 2 KClO₃ → 2 KCl + 3 O₂ the oxygen is a PRODUCT, and there is only one reactant, so this is decomposition (it is how oxygen is generated in a lab, not how anything burns). Combustion needs O₂ going IN, plus a fuel.',
      ],
      vocabulary: [
        { term: 'precipitate', definition: 'an insoluble solid that forms and drops out when two solutions are mixed.' },
        { term: 'combustion', definition: 'a reaction in which a fuel burns in oxygen, releasing energy; hydrocarbons always give CO₂ and H₂O.' },
        { term: 'neutralization', definition: 'the double-replacement reaction of an acid with a base, producing a salt and water.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-three',
      kind: 'worked_example',
      problem:
        'Classify each reaction: (a) Fe + CuSO₄ → FeSO₄ + Cu, (b) Ba(OH)₂ + H₂SO₄ → BaSO₄ + 2 H₂O, (c) C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
      steps: [
        '(a) Count the pieces: two reactants, and one of them (Fe) is a lone ELEMENT while the other (CuSO₄) is a compound. On the right, Cu comes out as a lone element and Fe has taken its place in the sulfate. One partner swapped → SINGLE REPLACEMENT.',
        '(b) Two reactants, and BOTH are compounds — no lone element anywhere. Ba pairs with SO₄²⁻ and H pairs with OH⁻, so the partners traded → DOUBLE REPLACEMENT. Because the reactants are a base and an acid and the escape product is water, it also earns the name neutralization.',
        '(c) A hydrocarbon (C₃H₈, carbon and hydrogen only) plus O₂ going IN, with CO₂ and H₂O coming out → COMBUSTION. Note that the product set was never in doubt; only the coefficients had to be worked out.',
        'Each call came from counting reactants and products and asking "is anything a lone element?" — not from recognizing the specific formulas.',
      ],
      answer: '(a) single replacement, (b) double replacement (neutralization), (c) combustion',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-count-pieces',
      kind: 'worked_example',
      problem:
        'A student classifies CaO + H₂O → Ca(OH)₂ as a double replacement, reasoning "water is one of the reactants, so the partners must be swapping." Find the flaw and classify it correctly.',
      steps: [
        'Test the claim by counting products, not by recognizing H₂O. A double replacement produces TWO compounds — the two new partner pairs. Here there is exactly ONE product, Ca(OH)₂.',
        'One product from two reactants is the definition of SYNTHESIS: A + B → AB. Nothing traded partners because there was no second pair to trade with.',
        'Check it against the formulas: Ca and O from CaO plus H and O from H₂O all end up inside the single product. Every atom that went in stayed together, which a swap can never do.',
        'Classification: SYNTHESIS. This is the reaction that turns quicklime into slaked lime for mortar and cement — and the flaw was pattern-matching on a familiar formula (H₂O) instead of counting reactants and products.',
      ],
      answer: 'Synthesis — two reactants give exactly ONE product, so nothing swapped partners',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-synthesis',
      kind: 'try_yourself',
      problem: 'Which of these is a synthesis reaction?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'N₂ + 3 H₂ → 2 NH₃', correct: true },
        { id: 'b', text: '2 NaCl → 2 Na + Cl₂' },
        { id: 'c', text: 'Zn + 2 HCl → ZnCl₂ + H₂' },
        { id: 'd', text: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O' },
      ],
      expectedAnswer: 'N₂ + 3 H₂ → 2 NH₃',
      hints: [
        'Synthesis has a signature you can spot without reading the formulas: how many PRODUCTS does it have?',
        'Exactly one product means everything combined. Which equation has a single substance on the right-hand side?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-precipitate',
      kind: 'try_yourself',
      problem: 'How should AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq) be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Double replacement — two compounds trade partners, and AgCl leaves as a precipitate', correct: true },
        { id: 'b', text: 'Single replacement — silver replaces the sodium' },
        { id: 'c', text: 'Synthesis — a new solid is formed' },
        { id: 'd', text: 'Decomposition — the silver nitrate breaks apart' },
      ],
      expectedAnswer: 'Double replacement — two compounds trade partners, and AgCl leaves as a precipitate',
      hints: [
        'Start by checking whether any reactant is a lone ELEMENT. Are AgNO₃ and NaCl elements or compounds?',
        'Two compounds in, two compounds out, with Ag and Na having exchanged partners. Which pattern is that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Here are five balanced reactions. (1) Mg + 2 HCl → MgCl₂ + H₂. (2) 2 KClO₃ → 2 KCl + 3 O₂. (3) Cl₂ + 2 NaBr → 2 NaCl + Br₂. (4) Pb(NO₃)₂ + 2 KI → PbI₂ + 2 KNO₃. (5) Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag. How many of these five are SINGLE REPLACEMENT reactions? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Single replacement needs exactly TWO reactants, one of which is a lone element. Cross off any reaction with only one reactant, and any reaction whose reactants are both compounds.',
        'Reaction 2 has a single reactant (decomposition) and reaction 4 has two compounds swapping partners (double replacement). Count what is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-oxygen-means-combustion',
      kind: 'misconception_check',
      question:
        'A student says: "2 KClO₃ → 2 KCl + 3 O₂ has to be a combustion reaction — there is O₂ right there in the equation." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Any equation containing O₂ is a combustion reaction',
          misconception: 'Treating the mere presence of the O₂ formula as the signature of combustion, instead of checking which SIDE it is on and how many reactants there are.',
          correctsTo:
            'Combustion requires O₂ as a REACTANT consumed by a fuel, giving CO₂ and H₂O. Here O₂ is a PRODUCT, there is no carbon anywhere, and there is only ONE reactant — the count-the-pieces test says DECOMPOSITION. This is exactly how oxygen gas is generated in a lab, the opposite of burning something.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five patterns cover nearly everything: synthesis, decomposition, single replacement, double replacement, combustion.',
        'Count the pieces first: one reactant → decomposition; one product → synthesis.',
        'Two reactants with exactly one lone ELEMENT → single replacement; two COMPOUNDS → double replacement.',
        'Neutralization (acid + base → salt + water) is just a double replacement whose escape product is water.',
        'Hydrocarbon + O₂ → CO₂ + H₂O, always — the products of combustion are never a guess, only a balancing job.',
        'The trap: O₂ on the PRODUCT side is not combustion — 2 KClO₃ → 2 KCl + 3 O₂ is a decomposition.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Classifying Chemical Reactions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
