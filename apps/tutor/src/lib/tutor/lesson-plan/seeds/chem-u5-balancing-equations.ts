/**
 * Chemistry — Chemical Reactions: Chemical Equations & Balancing.
 *
 * Conservation of atoms as bookkeeping (NGSS HS-PS1-7): coefficients are
 * the only dial you may turn, subscripts are locked identity. The two
 * signature student errors get equal billing — rewriting a subscript to
 * force a match, and stopping at a doubled (non-lowest-terms) answer.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U5_BALANCING_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.chem.balancing-equations.v1',
  title: 'Chemical Equations & Balancing',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.balancing-equations',
      standard: 'CHEM-5.1',
      description:
        'Translate a chemical reaction into a symbolic equation and balance it with the smallest whole-number coefficients, using conservation of atoms and mass as the governing rule (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.polarity-intermolecular-forces'],
  followUps: ['chem.reaction-types'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A balanced equation is the recipe engineers actually build from — get the coefficients wrong and the airbag under-inflates.',
      script:
        'The airbag in a car inflates in about 30 milliseconds, and the engineer who packed it had to know exactly how many grams of sodium azide to load. Too little and your face meets the steering wheel; too much and the bag bursts. The only reason that number is knowable is a balanced chemical equation — 2 NaN₃ → 2 Na + 3 N₂ tells you that every 2 formula units of solid release exactly 3 molecules of nitrogen gas. Every recipe in chemistry, from baking soda in a cake to the fuel burn in a rocket, starts here. Today we learn to write reactions in symbols and then balance the atom count on both sides.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-balancing',
      kind: 'concept',
      goal: 'Conservation of atoms as the rule, coefficients as the only legal dial, and a repeatable balancing order — plus the two classic traps.',
      keyIdeas: [
        'THE LAW BEHIND IT — atoms are conserved. A reaction only REARRANGES atoms; none are created or destroyed. Count 10 oxygen atoms on the left, you must find 10 on the right. Because atoms have fixed masses, conserved atoms means conserved MASS — the sealed-flask result Lavoisier proved in 1789.',
        'ANATOMY OF AN EQUATION — reactants on the left, products on the right, → meaning "produces". Physical states ride along in parentheses: (s) solid, (l) liquid, (g) gas, (aq) dissolved in water. Example: CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g).',
        'COEFFICIENTS: THE ONLY DIAL — the big number in FRONT of a formula multiplies the whole formula. 3 H₂O means 3 molecules: 6 H and 3 O. Coefficients are how many; they are yours to change.',
        'SUBSCRIPTS: LOCKED — the small number INSIDE a formula defines what the substance IS. Changing H₂O to H₂O₂ does not balance anything; it swaps water for hydrogen peroxide, a bleach. Subscripts are identity, never a balancing tool.',
        'THE METHOD — (1) write the correct formulas and leave them alone; (2) tally each element on both sides; (3) balance one element at a time, saving H and O for last; (4) after every coefficient change, RE-TALLY, because one change ripples; (5) finish by confirming every element matches and the coefficients share no common factor.',
        'POLYATOMIC SHORTCUT — an ion that survives the reaction unchanged (SO₄²⁻, NO₃⁻, PO₄³⁻) can be counted as a single unit instead of atom by atom. In Ca(OH)₂ + 2 HNO₃ → Ca(NO₃)₂ + 2 H₂O, balance NO₃ as one block.',
        'THE FRACTION MOVE — combustion of a hydrocarbon with an odd oxygen tally lands on a half-coefficient like 7/2 O₂. That is a legal intermediate, not a mistake: multiply EVERY coefficient by 2 to clear it.',
        'TRAP: "BALANCED" IS NOT ENOUGH — 8 Fe + 6 O₂ → 4 Fe₂O₃ has equal atoms on both sides but is not the answer. Coefficients must be the smallest whole-number set, so divide through by the common factor 2.',
      ],
      vocabulary: [
        { term: 'coefficient', definition: 'the whole number written in front of a formula, multiplying every atom in it.' },
        { term: 'subscript', definition: 'the small number inside a formula fixing how many atoms of an element the substance contains.' },
        { term: 'law of conservation of mass', definition: 'the total mass of the reactants equals the total mass of the products, because atoms are only rearranged.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-propane-combustion',
      kind: 'worked_example',
      problem:
        'Propane fuels backyard grills. Balance the combustion of propane with the smallest whole-number coefficients: C₃H₈ + O₂ → CO₂ + H₂O.',
      steps: [
        'Formulas are already correct, so nothing inside them may change. Tally first: left has 3 C, 8 H, 2 O; right has 1 C, 2 H, 3 O. Nothing matches yet.',
        'CARBON FIRST. All 3 carbons on the left must show up in CO₂, and each CO₂ carries one carbon, so the coefficient is 3: C₃H₈ + O₂ → 3 CO₂ + H₂O.',
        'HYDROGEN SECOND. The left has 8 H, and each H₂O carries 2 H, so 8 ÷ 2 = 4: C₃H₈ + O₂ → 3 CO₂ + 4 H₂O.',
        'OXYGEN LAST, because it now appears in two products and both are pinned. Right side: 3 CO₂ gives 3 × 2 = 6 O, and 4 H₂O gives 4 × 1 = 4 O, for 10 O total. Each O₂ supplies 2, so 10 ÷ 2 = 5.',
        'RE-TALLY the finished equation C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O: C 3 = 3, H 8 = 8, O 10 = 10. The set 1, 5, 3, 4 shares no common factor, so it is already lowest terms.',
      ],
      answer: 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O — carbon, then hydrogen, then oxygen last',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-odd-oxygen-trap',
      kind: 'worked_example',
      problem:
        'Ethane, C₂H₆, is a component of natural gas. Balance C₂H₆ + O₂ → CO₂ + H₂O. A student following the carbon-hydrogen-oxygen order gets stuck at "7/2 O₂" and decides to write O₇ instead. Find the flaw and finish the balance correctly.',
      steps: [
        'Run the standard order first. Carbon: 2 C on the left, so 2 CO₂. Hydrogen: 6 H on the left, and each H₂O holds 2 H, so 3 H₂O. That gives C₂H₆ + O₂ → 2 CO₂ + 3 H₂O.',
        'Oxygen: the right side now holds 2 × 2 = 4 O from CO₂ plus 3 × 1 = 3 O from H₂O, so 7 O total. Each O₂ supplies 2 oxygen atoms, and 7 ÷ 2 = 7/2. The fraction is real, and it is a signal, not an error.',
        'THE FLAW: writing O₇ changes a SUBSCRIPT. O₂ is the molecule oxygen gas is actually made of; O₇ is an invented substance that does not exist. Rewriting a subscript never balances an equation, it only replaces one chemical with another.',
        'THE LEGAL MOVE: keep 7/2 O₂ and multiply EVERY coefficient in the equation by 2 — 2 × 1 for C₂H₆, 2 × 7/2 = 7 for O₂, 2 × 2 = 4 for CO₂, 2 × 3 = 6 for H₂O.',
        'RE-TALLY 2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O: C 4 = 4, H 12 = 12, O 14 = 8 + 6 = 14. The set 2, 7, 4, 6 has no common factor (7 is odd), so this is lowest terms.',
      ],
      answer: '2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O — clear the 7/2 by doubling every coefficient, never by editing a subscript',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rust-coefficients',
      kind: 'try_yourself',
      problem:
        'Iron rusts by reacting with oxygen gas: Fe + O₂ → Fe₂O₃. Which version is balanced with the SMALLEST whole-number coefficients?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4 Fe + 3 O₂ → 2 Fe₂O₃', correct: true },
        { id: 'b', text: '8 Fe + 6 O₂ → 4 Fe₂O₃' },
        { id: 'c', text: '2 Fe + 3 O → Fe₂O₃' },
        { id: 'd', text: '2 Fe + O₂ → Fe₂O₃' },
      ],
      expectedAnswer: '4 Fe + 3 O₂ → 2 Fe₂O₃',
      hints: [
        'Check each option twice: first, does every element tally on both sides? Second, do the coefficients share a common factor you could divide out?',
        'Fe₂O₃ carries an odd 3 oxygens, so you need an even number of them to pair with O₂ molecules — and splitting O₂ into single O atoms is an illegal subscript change.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mass-conservation',
      kind: 'try_yourself',
      problem:
        'Inside a sealed flask, 4.0 g of hydrogen gas reacts completely with 32.0 g of oxygen gas to form water: 2 H₂ + O₂ → 2 H₂O. Nothing escapes the flask. What mass of water forms?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '36.0 g — every atom that went in ends up in the water', correct: true },
        { id: 'b', text: '32.0 g — the oxygen is what turns into water' },
        { id: 'c', text: '28.0 g — the hydrogen mass is used up making the bonds' },
        { id: 'd', text: '18.0 g — that is the mass of water' },
      ],
      expectedAnswer: '36.0 g — every atom that went in ends up in the water',
      hints: [
        'The flask is sealed, so no atom can leave. Where else could any of the starting mass have gone?',
        'Conservation of mass: total mass of reactants = total mass of products. Add 4.0 and 32.0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Butane, C₄H₁₀, is the fuel in a pocket lighter. Balance its combustion, C₄H₁₀ + O₂ → CO₂ + H₂O, using the smallest whole-number coefficients. What is the coefficient of O₂? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Balance carbon first (4 CO₂), then hydrogen (5 H₂O), and leave oxygen for last.',
        'The right side ends up with 8 + 5 = 13 oxygen atoms, so O₂ takes 13/2 — then multiply every coefficient by 2 to clear the fraction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-change-subscripts',
      kind: 'misconception_check',
      question:
        'A student balances H₂ + O₂ → H₂O by rewriting the product as H₂O₂, then says "now there are 2 H and 2 O on each side, so it is balanced." What is wrong with this?',
      commonErrors: [
        {
          answer: 'H₂ + O₂ → H₂O₂ is balanced, so it is correct',
          misconception: 'Treating subscripts as adjustable numbers, the same way coefficients are.',
          correctsTo:
            'The atom tally does match, but the equation now describes a different reaction: H₂O₂ is hydrogen peroxide, a bleaching agent, not water. A subscript states what the substance IS, so editing it changes the chemistry instead of the bookkeeping. Balance with coefficients only: 2 H₂ + O₂ → 2 H₂O, which gives 4 H and 2 O on each side while every formula stays intact.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Atoms are conserved, so mass is conserved: whatever goes into a sealed reaction comes out, just rearranged.',
        'Coefficients (in front) are adjustable; subscripts (inside) are locked identity — changing one swaps the substance.',
        'Method: correct formulas → tally both sides → balance one element at a time, H and O last → re-tally after every change.',
        'A fractional coefficient like 7/2 O₂ is a legal intermediate — clear it by multiplying every coefficient by 2.',
        'Finish the job: equal atoms is not enough, the coefficients must also be the smallest whole-number set.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Chemical Equations & Balancing' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
