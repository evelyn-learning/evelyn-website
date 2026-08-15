/**
 * Chemistry — Unit 5 topic 5.3: Predicting Products & the Activity Series.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u5-predicting-products-activity.ts
 * (planId evelyn.hs.chem.predicting-products-activity.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.predicting-products-activity';

export const BASELINE_CHEM_U5_PREDICTING_PRODUCTS_ACTIVITY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.predicting-products-activity.v1',
  course: 'Chemistry',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Predicting Products & the Activity Series',
  planId: 'evelyn.hs.chem.predicting-products-activity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.predicting-products-activity.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Predicting is a four-step habit',
      content:
        '(1) classify the pattern, (2) decide IF it runs, (3) build each product formula from ionic CHARGES, (4) balance. Jumping straight to balancing wrecks most answers, because a wrong formula cannot be balanced into a right one.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Single replacement — like replaces like',
      content:
        'A + BC → AC + B. A free METAL can only replace the metal (the positive ion); a free HALOGEN can only replace the halogen (the negative ion). A metal never swaps into an anion slot.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'The activity series',
      content:
        'Most reactive to least: K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au. Metals near the top surrender electrons most readily. A free metal displaces ONLY a metal ranked BELOW it, forcing that lower metal out as neutral solid.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Hydrogen is the acid line',
      content:
        'Metals above H (Mg, Al, Zn, Fe) hand electrons to H⁺ and release H₂ gas in acid. Metals below H (Cu, Ag, Au) do not — which is why a copper penny sits unchanged in vinegar and gold survives a lifetime of wear.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: '"No reaction" is a real answer',
      content:
        'Cu + ZnSO₄ → no reaction, because Cu ranks below Zn. The full-credit response is the words "no reaction," not products invented to fill the page. Predicting what will NOT happen is half the power of the series.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Double replacement and solubility',
      content:
        'AB + CD → AD + CB runs only if the swap makes a precipitate, a gas, or water. Rough solubility rules: most carbonates, phosphates, and hydroxides are INSOLUBLE; nitrates, Group 1 salts, and NH₄⁺ salts stay DISSOLVED.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Formulas come from charges, never from copying subscripts',
      content:
        'The classic wreck: Al + ZnCl₂ → "AlCl₂" because a 2 was already sitting there. Aluminum forms Al³⁺, so the product is AlCl₃. Every subscript is set by the ions\' charges in that compound alone. Balance last, with coefficients only.',
    },
  ],
  methods: [
    {
      title: 'Predict a single-replacement reaction',
      when_to_use:
        'A free element (usually a metal strip) is placed in a solution of an ionic compound.',
      steps: [
        'Classify: free element + compound = single replacement. Identify which slot the free element can take (metal → cation slot, halogen → anion slot).',
        'Check the activity series: is the FREE element ABOVE the element it would displace? If not, write "no reaction" and stop.',
        'Build the new compound from CHARGES: pair the free element\'s ion with the unchanged spectator ion and cross-balance the charges.',
        'Write the displaced element as a neutral atom — it carries none of its old partner with it.',
        'Balance with coefficients only, then re-tally.',
      ],
      example: {
        problem: 'Zinc strip in AgNO₃ solution. Series: Mg > Al > Zn > Fe > H > Cu > Ag > Au.',
        solution:
          'Single replacement; Zn is above Ag, so it runs. Zn²⁺ with NO₃⁻ gives Zn(NO₃)₂; silver leaves as plain Ag. Balancing the two nitrates: Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag — the "silver tree" demo.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Build an ionic product formula from charges',
      when_to_use:
        'Any time you must write a product formula rather than read one off the page.',
      steps: [
        'Write the cation with its charge (Al³⁺, Mg²⁺, Zn²⁺, Cu²⁺, Fe³⁺ when named iron(III)).',
        'Write the anion with its charge (Cl⁻, NO₃⁻, SO₄²⁻, O²⁻).',
        'Choose the smallest whole numbers of each ion that make the total charge zero — cross the magnitudes if they share no factor.',
        'Wrap a polyatomic ion in parentheses before adding a subscript greater than 1: Al₂(SO₄)₃, Zn(NO₃)₂.',
        'Never import a subscript from the reactant side; the old compound\'s numbers say nothing about the new one.',
      ],
      example: {
        problem: 'Mg metal in FeCl₃ solution — write the magnesium product.',
        solution:
          'Mg forms Mg²⁺ and chloride is Cl⁻, so two chlorides balance one magnesium → MgCl₂. The 3 in FeCl₃ is irrelevant; "MgCl₃" is the copied-subscript error.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Decide whether a mixture reacts at all',
      when_to_use:
        'Multiple-choice items asking "which of these will actually react?" or any prediction where "no reaction" is on the table.',
      steps: [
        'Locate the FREE element in the mixture and the element locked inside the compound.',
        'Find both on the activity series. Free element higher → it runs. Free element lower → no reaction.',
        'For a metal in acid, compare the metal against H specifically: above H means H₂ bubbles, below H means nothing.',
        'Reject non-chemical reasoning — atomic mass, "it is the reverse of a reaction that works," and "metals always displace metals" are all wrong.',
        'For double replacement, instead check whether either possible product is insoluble, a gas, or water.',
      ],
      example: {
        problem: 'Copper wire in Al(NO₃)₃ — a student writes 3 Cu + 2 Al(NO₃)₃ → 3 Cu(NO₃)₂ + 2 Al. Diagnose.',
        solution:
          'The pattern, the formula Cu(NO₃)₂, and the balancing are all correct — yet Al sits ABOVE Cu, so the free copper cannot displace aluminum. Answer: no reaction. Only the reverse runs: 2 Al + 3 Cu(NO₃)₂ → 2 Al(NO₃)₃ + 3 Cu.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Four steps in order: classify the pattern → check whether it runs → build products from ionic charges → balance with coefficients.',
      kind: 'tip',
    },
    {
      content:
        'Activity series to memorize: K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au. A free metal displaces only a metal ranked below it.',
      kind: 'tip',
    },
    {
      content:
        'Hydrogen is the acid line — metals above H release H₂ in acid; Cu, Ag, and Au do not. "All metals react with acid" is false.',
      kind: 'common-error',
    },
    {
      content:
        'Gotcha: a balanced equation is never proof that a reaction happens. Only the activity series decides. Check the ranking before you admire your algebra.',
      kind: 'gotcha',
    },
    {
      content:
        'Subscripts come from charges (Al³⁺ + Cl⁻ → AlCl₃), never copied across from the other reactant. "AlCl₂ because ZnCl₂ had a 2" is the signature wreck.',
      kind: 'common-error',
    },
    {
      content:
        '"No reaction" is a full-credit answer — write the words rather than inventing products to fill the line.',
      kind: 'tip',
    },
    {
      content:
        'Edge case: the displaced metal leaves as a NEUTRAL atom (plain Ag, plain Cu), never dragging its old anion along.',
      kind: 'edge-case',
    },
  ],
};
