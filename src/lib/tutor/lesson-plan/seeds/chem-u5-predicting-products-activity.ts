/**
 * Chemistry — Chemical Reactions: Predicting Products & the Activity Series.
 *
 * From "classify the pattern" to "write the products" (NGSS HS-PS1-2): the
 * activity series decides IF a single replacement runs, ion charges decide
 * WHAT the products are, and coefficients come last. The two classic wrecks
 * — copying a subscript across (AlCl₂) and refusing to write "no reaction" —
 * each get their own beat.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U5_PREDICTING_PRODUCTS_ACTIVITY: LessonPlan = {
  id: 'evelyn.hs.chem.predicting-products-activity.v1',
  title: 'Predicting Products & the Activity Series',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.predicting-products-activity',
      standard: 'CHEM-5.3',
      description:
        'Predict the products of single-replacement and double-replacement reactions using the activity series and ionic charges, including recognizing when no reaction occurs (NGSS HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.reaction-types'],
  followUps: ['chem.redox-intro'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A ranked list of metals lets you call the outcome of a reaction — including the reactions that never happen — before mixing anything.',
      script:
        'Drop a clean iron nail into blue copper(II) sulfate solution and within minutes the nail wears a coat of orange copper while the blue drains out of the liquid. Drop a copper wire into an iron solution that looks just as promising and nothing happens — not in an hour, not ever. Chemists called both outcomes before running either experiment, because metals are rank-ordered by how badly they want to give their electrons away. That ranking is the activity series, and it is why ships carry blocks of zinc bolted to their steel hulls: the zinc is higher on the list, so it corrodes instead of the ship. Today you learn to read that list and write the products before the beaker ever comes out.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-predicting',
      kind: 'concept',
      goal: 'The predict-products habit — classify, check the series, build formulas from charges, balance last — plus the two errors that sink most answers.',
      keyIdeas: [
        'PREDICTING IS A FOUR-STEP HABIT — (1) classify the pattern, (2) decide IF it runs, (3) build each product formula from ionic CHARGES, (4) balance. Jumping straight to balancing is what wrecks most answers, because you cannot balance a formula that is wrong.',
        'SINGLE REPLACEMENT: A + BC → AC + B — a free element takes the place of the element it resembles. A free METAL replaces the metal (the positive ion); a free HALOGEN replaces the halogen (the negative ion). A metal never swaps into an anion slot.',
        'THE ACTIVITY SERIES RANKS THE APPETITE — most reactive to least: K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au. Metals near the top surrender electrons most readily, so a free metal displaces only a metal ranked BELOW it, forcing that lower metal out as a neutral solid.',
        'HYDROGEN IS THE ACID LINE — metals above H (Mg, Al, Zn, Fe) hand electrons to H⁺ and release H₂ gas when dropped in acid. Metals below H (Cu, Ag, Au) do not, which is why a copper penny sits unchanged in vinegar and gold jewelry survives a lifetime of sweat.',
        '"NO REACTION" IS A REAL ANSWER — Cu + ZnSO₄ → no reaction, because Cu ranks below Zn. The full-credit response is the words "no reaction," not products invented to fill the page. Predicting what will NOT happen is half the power of the series.',
        'DOUBLE REPLACEMENT: AB + CD → AD + CB — two compounds swap partners, and the swap only runs if it produces a precipitate (insoluble solid), a gas, or water. Most carbonates, phosphates, and hydroxides are insoluble; nitrates, Group 1 salts, and NH₄⁺ salts stay dissolved.',
        'FORMULAS COME FROM CHARGES, NEVER FROM COPYING SUBSCRIPTS — the classic wreck: Al + ZnCl₂ → "AlCl₂" because the 2 was already sitting there. Aluminum forms Al³⁺, so the product is AlCl₃. Every subscript is set by the ions\' charges in that compound alone.',
        'BALANCE LAST, WITH COEFFICIENTS ONLY — write every product formula correctly first, then add coefficients in front. Changing a subscript to make the counts work does not balance the equation; it silently swaps in a different compound.',
      ],
      vocabulary: [
        { term: 'activity series', definition: 'a ranking of metals from most to least willing to give up electrons, used to predict whether a single-replacement reaction occurs.' },
        { term: 'single-replacement reaction', definition: 'a reaction in which a free element takes the place of a like element inside a compound.' },
        { term: 'precipitate', definition: 'an insoluble solid that drops out of solution when two dissolved compounds swap partners.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-single-replacement',
      kind: 'worked_example',
      problem:
        'A strip of zinc metal is placed in silver nitrate solution, AgNO₃. Activity series excerpt: Mg > Al > Zn > Fe > H > Cu > Ag > Au. Predict the products and write the balanced equation.',
      steps: [
        'Classify: a free element (Zn) plus a compound (AgNO₃) is the single-replacement pattern. Zn is a metal, so it can only take the metal slot — it displaces Ag, not the nitrate.',
        'Check the series: Zn sits ABOVE Ag, so zinc gives up electrons more readily and the reaction runs. (Had zinc been the lower metal, the answer would stop here at "no reaction.")',
        'Build the products from charges: zinc forms Zn²⁺ and nitrate is NO₃⁻, so one Zn²⁺ needs two nitrates → Zn(NO₃)₂. The displaced silver leaves as neutral metal, plain Ag — do not carry the nitrate along with it.',
        'Balance last: the right side has two nitrates, so the left needs 2 AgNO₃, which frees 2 Ag. Final: Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag. This is the classic "silver tree" demo — glittering silver crystals grow on the zinc while the solution turns colorless.',
      ],
      answer: 'Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag — Zn outranks Ag, so silver plates out as solid metal',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-no-reaction-trap',
      kind: 'worked_example',
      problem:
        'A student is asked what happens when copper wire is placed in aluminum nitrate solution, Al(NO₃)₃, and answers: "3 Cu + 2 Al(NO₃)₃ → 3 Cu(NO₃)₂ + 2 Al." Activity series excerpt: K > Na > Mg > Al > Zn > Fe > Cu > Ag. Diagnose the error.',
      steps: [
        'Notice what is RIGHT first: the pattern is correctly identified as single replacement, the formula Cu(NO₃)₂ is correctly built from Cu²⁺ and NO₃⁻, and the equation is genuinely balanced. The flaw is not in the algebra.',
        'Run the check that was skipped: locate both metals on the series. Al sits well ABOVE Cu. The free metal here is copper, and copper is the LOWER-ranked one.',
        'Why that kills it: aluminum holds its valence electrons loosely and is already sitting comfortably as Al³⁺ with those electrons handed off. Copper is stingier with its electrons, so it cannot force Al³⁺ to take them back. There is no downhill direction for the electrons to move.',
        'Correct response: "Cu + Al(NO₃)₃ → no reaction." Note that the REVERSE runs beautifully: 2 Al + 3 Cu(NO₃)₂ → 2 Al(NO₃)₃ + 3 Cu, coating an aluminum strip in copper. A balanced equation is not evidence that a reaction happens — only the series is.',
      ],
      answer: 'No reaction — Cu ranks below Al, so it cannot displace aluminum; only the reverse reaction runs',
      estimatedMinutes: 3,
    },
    {
      id: 'try-formula-from-charges',
      kind: 'try_yourself',
      problem:
        'A strip of magnesium metal is placed in iron(III) chloride solution, FeCl₃. Activity series excerpt: K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag. Which line correctly predicts the products?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'MgCl₂ + Fe — magnesium forms Mg²⁺, so two chlorides are needed', correct: true },
        { id: 'b', text: 'MgCl₃ + Fe — the subscript 3 carries over from FeCl₃' },
        { id: 'c', text: 'MgCl + Fe — one magnesium pairs with one chloride' },
        { id: 'd', text: 'No reaction — magnesium ranks below iron on the series' },
      ],
      expectedAnswer: 'MgCl₂ + Fe — magnesium forms Mg²⁺, so two chlorides are needed',
      hints: [
        'Two checks before you write anything: is Mg above Fe on the series? If yes, the reaction runs and magnesium takes the metal slot.',
        'Now build the product from charges alone: Mg²⁺ paired with Cl⁻ needs two chlorides, no matter what subscript FeCl₃ happened to carry.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-runs',
      kind: 'try_yourself',
      problem:
        'Activity series excerpt: K > Na > Mg > Zn > Fe > Cu > Ag. Which of these mixtures will actually react?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Zn + CuSO₄ — zinc ranks above copper, so it displaces it', correct: true },
        { id: 'b', text: 'Cu + ZnSO₄ — it is just the reverse of a reaction that works, so it works too' },
        { id: 'c', text: 'Ag + Fe(NO₃)₂ — silver is a metal, and a free metal always displaces another metal' },
        { id: 'd', text: 'Cu + MgCl₂ — copper atoms are heavier, so they push magnesium out' },
      ],
      expectedAnswer: 'Zn + CuSO₄ — zinc ranks above copper, so it displaces it',
      hints: [
        'A free metal displaces only a metal that sits LOWER than it on the series — reactivity is the deciding property, not mass or reversibility.',
        'For each choice, find the free element on the list, then the metal locked inside the compound. Only one pair has the free metal ranked higher.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Aluminum metal is dropped into copper(II) sulfate solution, CuSO₄. Activity series excerpt: Mg > Al > Zn > Fe > Cu > Ag. Aluminum forms Al³⁺, copper is present as Cu²⁺, and sulfate is SO₄²⁻. Predict the products, write the balanced equation, and state the coefficient of Cu. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Al is above Cu, so the reaction runs. Build the products from charges: Al³⁺ with SO₄²⁻ gives Al₂(SO₄)₃, and the displaced copper leaves as solid Cu.',
        'Al₂(SO₄)₃ contains three sulfate groups, so three CuSO₄ units must be consumed: 2 Al + 3 CuSO₄ → Al₂(SO₄)₃ + ? Cu. Count the copper atoms freed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-metals-and-acids',
      kind: 'misconception_check',
      question:
        'A student says: "Every metal reacts with hydrochloric acid — that is what acids do to metals." A copper wire sits in HCl for an hour without a single bubble. What is wrong with the reasoning?',
      commonErrors: [
        {
          answer: 'All metals react with acid to produce H₂ gas',
          misconception: 'Treating acid strength as the deciding factor and ignoring where hydrogen sits in the activity series.',
          correctsTo:
            'Only metals ABOVE hydrogen on the series (K, Na, Mg, Al, Zn, Fe) can hand their electrons to H⁺ and release H₂ gas. Cu, Ag, and Au rank BELOW hydrogen, so Cu + HCl → no reaction — the same reason a copper penny survives vinegar and gold jewelry survives decades of wear. Locate the metal relative to H before predicting bubbles.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four steps, in order: classify the pattern → check whether it runs → build products from ionic charges → balance with coefficients.',
        'Activity series (K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au): a free metal displaces only a metal ranked below it.',
        'Hydrogen is the acid line — metals above H release H₂ in acid; Cu, Ag, and Au do not.',
        '"No reaction" is a full-credit answer, and a balanced equation is never proof that a reaction happens.',
        'Subscripts come from charges (Al³⁺ + Cl⁻ → AlCl₃), never copied across; only coefficients may change during balancing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Predicting Products & the Activity Series' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
