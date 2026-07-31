/**
 * Chemistry — Acids & Bases: Properties and Definitions.
 *
 * The definitional foundation (NGSS HS-PS1-2): Arrhenius first, then the
 * broader Bronsted-Lowry proton-transfer picture, conjugate acid-base
 * pairs, water as an amphoteric player, and the common strong/weak lists.
 * Two classic traps get equal billing — "no OH⁻ in the formula means it
 * cannot be a base" and "strong means concentrated". Putting a NUMBER on
 * acidity (pH) is the next lesson's job; this one builds the vocabulary
 * that number describes.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U10_ACIDS_BASES_DEFINITIONS: LessonPlan = {
  id: 'evelyn.hs.chem.acids-bases-definitions.v1',
  title: 'Acids & Bases: Properties and Definitions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.acids-bases-definitions',
      standard: 'CHEM-10.1',
      description:
        'Classify substances as acids or bases using the Arrhenius and Bronsted-Lowry definitions, identify conjugate acid-base pairs in a proton-transfer reaction, and distinguish acid strength from concentration (NGSS HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.equilibrium-le-chatelier'],
  followUps: ['chem.ph-scale'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Acids and bases as one transaction — a single hydrogen ion changing hands — running everything from digestion to cleaning to concrete.',
      script:
        'Your stomach runs on acid strong enough to strip a nail, yet the lining survives it. Drain cleaner dissolves hair; baking soda kills the burn of a bee sting; the ocean is slowly turning sour as it swallows CO₂ from the air. Every one of those stories is the SAME transaction happening over and over — one hydrogen ion, H⁺, changing hands. Today we name the two sides of that trade: the donor and the acceptor. Once you can spot who gives the proton and who takes it, you can read any acid-base reaction on sight — and next lesson we will put an actual number on how sour a solution is.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-definitions',
      kind: 'concept',
      goal: 'Two definitions (Arrhenius, then Bronsted-Lowry), conjugate pairs, amphoteric water, and the common acid/base lists — plus the strength-vs-concentration trap.',
      keyIdeas: [
        'ARRHENIUS — the first definition, and the narrowest: an ACID releases H⁺ when dissolved in water (HCl → H⁺ + Cl⁻); a BASE releases OH⁻ in water (NaOH → Na⁺ + OH⁻). Fast to apply — just look for H at the front of the formula or OH at the back — but it only works in water, and it cannot explain ammonia.',
        'BRONSTED-LOWRY — the definition that actually runs this unit: an ACID is a PROTON DONOR (gives away H⁺); a BASE is a PROTON ACCEPTOR (takes H⁺). Notice a base no longer needs OH⁻ anywhere in its formula — NH₃ + H⁺ → NH₄⁺ makes ammonia a base because it CAUGHT the proton. Every Arrhenius acid is also a Bronsted-Lowry acid; the reverse is not true.',
        'WHY "PROTON" — a hydrogen atom is one proton plus one electron. Strip the electron and H⁺ is a bare proton, nothing else. That is why acid-base chemistry is called proton transfer. In water the loose proton never floats free; it latches onto a water molecule as hydronium, H₃O⁺.',
        'CONJUGATE PAIRS — every proton transfer creates its own reverse. An acid that DONATES H⁺ becomes its CONJUGATE BASE (which could take the proton back); a base that ACCEPTS H⁺ becomes its CONJUGATE ACID. HF + H₂O ⇌ F⁻ + H₃O⁺ contains two pairs: HF/F⁻ and H₂O/H₃O⁺.',
        'THE ONE-PROTON RULE — the two members of a conjugate pair differ by EXACTLY one H and one unit of charge. H₂CO₃/HCO₃⁻ is a pair; H₂CO₃/CO₃²⁻ is NOT (two protons apart). Polyprotic acids ionize one proton at a time, so H₂SO₄ → HSO₄⁻ → SO₄²⁻ is a chain of pairs, not a single leap.',
        'WATER PLAYS BOTH SIDES (AMPHOTERIC) — H₂O donates a proton to ammonia (H₂O + NH₃ ⇌ NH₄⁺ + OH⁻, water acting as the ACID) and accepts one from HCl (H₂O + HCl → H₃O⁺ + Cl⁻, water acting as the BASE). Water\'s role is set by its PARTNER, never by its formula.',
        'THE COMMON LISTS, WORTH MEMORIZING — strong acids (ionize essentially 100%): HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄. Strong bases: NaOH, KOH, LiOH, Ca(OH)₂, Ba(OH)₂. Weak acids you meet daily: acetic acid CH₃COOH (vinegar), carbonic acid H₂CO₃ (soda), citric acid, HF. Weak base: NH₃. Anything not on the strong lists is weak.',
        'THE TRAP: STRONG ≠ CONCENTRATED — STRENGTH is what FRACTION of the molecules ionize (a fixed property of the substance); CONCENTRATION is how many moles of it you dumped into the liter (your choice at the bench). A dilute strong acid and a concentrated weak acid are both perfectly ordinary, and the second can easily be the more acidic solution.',
        'NOT EVERY H IS IONIZABLE — only hydrogens attached to a strongly electron-hungry atom (usually O or a halogen) come off as H⁺. Acetic acid, CH₃COOH, has four hydrogens but donates only ONE: the three glued to carbon never leave. Count the acidic H, not the total H.',
      ],
      vocabulary: [
        { term: 'Arrhenius acid', definition: 'a substance that releases H⁺ ions when dissolved in water.' },
        { term: 'Bronsted-Lowry base', definition: 'any species that accepts a proton (H⁺), with or without OH⁻ in its formula.' },
        { term: 'conjugate acid-base pair', definition: 'two species differing by exactly one H⁺, such as NH₄⁺/NH₃.' },
        { term: 'amphoteric', definition: 'able to act as either an acid or a base depending on the reaction partner — water is the classic case.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-conjugate-pairs',
      kind: 'worked_example',
      problem:
        'For the reaction HNO₂ + H₂O ⇌ NO₂⁻ + H₃O⁺, label each species as acid, base, conjugate acid, or conjugate base, and write the two conjugate pairs.',
      steps: [
        'Track the proton. Compare left to right: HNO₂ lost an H and became NO₂⁻, while H₂O gained an H and became H₃O⁺. One H⁺ moved from HNO₂ to H₂O.',
        'The donor is the acid: HNO₂ gave the proton away, so HNO₂ is the Bronsted-Lowry ACID. What it leaves behind, NO₂⁻, is its CONJUGATE BASE — it is the species that could take the proton back.',
        'The acceptor is the base: H₂O caught the proton, so H₂O is the Bronsted-Lowry BASE here. What it becomes, H₃O⁺, is its CONJUGATE ACID.',
        'Check the one-proton rule on each pair: HNO₂ → NO₂⁻ drops one H and the charge falls by one (0 → −1). H₂O → H₃O⁺ gains one H and the charge rises by one (0 → +1). Both differ by exactly one H⁺, so both are legitimate pairs.',
        'Pairs: HNO₂/NO₂⁻ and H₂O/H₃O⁺. Note that an Arrhenius reading would have missed water entirely — it produced no OH⁻ and still acted as a base.',
      ],
      answer: 'HNO₂ = acid, NO₂⁻ = its conjugate base; H₂O = base, H₃O⁺ = its conjugate acid. Pairs: HNO₂/NO₂⁻ and H₂O/H₃O⁺',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ammonia-no-oh',
      kind: 'worked_example',
      problem:
        'A student insists: "NH₃ cannot possibly be a base — there is no OH⁻ anywhere in its formula." Ammonia is nevertheless the textbook weak base. Resolve the contradiction.',
      steps: [
        'Name the definition the student is using. "A base must contain OH⁻" is the ARRHENIUS rule, and inside its home territory it is not wrong — it is just narrow.',
        'Apply the broader Bronsted-Lowry test instead: does NH₃ ACCEPT a proton? Dissolve it and watch — NH₃ + H₂O ⇌ NH₄⁺ + OH⁻. The nitrogen\'s lone pair grabs an H⁺ off a water molecule, producing ammonium.',
        'By the donor/acceptor test, NH₃ accepted the proton, so NH₃ is the BASE and H₂O — despite being the source of the OH⁻ — is the ACID in this reaction. Roles come from what a species DOES, not from what it contains.',
        'Now notice the twist that rescues Arrhenius too: OH⁻ still appears in the products, so the solution really does turn basic. Ammonia never HELD an OH⁻; it MADE one by stripping a proton off water.',
        'Takeaway: reach for Bronsted-Lowry by default. It reproduces every Arrhenius result and additionally covers the many bases — NH₃, F⁻, CO₃²⁻, HCO₃⁻ — that carry no hydroxide at all.',
      ],
      answer: 'NH₃ is a Bronsted-Lowry base: it accepts H⁺ from water (NH₃ + H₂O ⇌ NH₄⁺ + OH⁻), generating hydroxide rather than containing it',
      estimatedMinutes: 3,
    },
    {
      id: 'try-water-role',
      kind: 'try_yourself',
      problem:
        'In the reaction HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻, what role does water play?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bronsted-Lowry acid — it donates a proton to HCO₃⁻', correct: true },
        { id: 'b', text: 'Bronsted-Lowry base — it accepts a proton from HCO₃⁻' },
        { id: 'c', text: 'Arrhenius base — it produces OH⁻ in the reaction' },
        { id: 'd', text: 'Neither — water is neutral, so it cannot be an acid or a base' },
      ],
      expectedAnswer: 'Bronsted-Lowry acid — it donates a proton to HCO₃⁻',
      hints: [
        'Compare each species across the arrow. Which one LOST a hydrogen and which one GAINED one?',
        'H₂O became OH⁻, so it gave an H⁺ away. In Bronsted-Lowry terms, the giver is the acid — even when the leftover is hydroxide.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conjugate-pair',
      kind: 'try_yourself',
      problem: 'Which of these is a genuine conjugate acid-base pair?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'H₂PO₄⁻ and HPO₄²⁻', correct: true },
        { id: 'b', text: 'H₂SO₄ and SO₄²⁻' },
        { id: 'c', text: 'H₃O⁺ and OH⁻' },
        { id: 'd', text: 'HCl and NaOH' },
      ],
      expectedAnswer: 'H₂PO₄⁻ and HPO₄²⁻',
      hints: [
        'Members of a conjugate pair differ by exactly ONE hydrogen and one unit of charge. Count both for each option.',
        'H₂SO₄ to SO₄²⁻ removes two protons, and H₃O⁺ to OH⁻ removes two as well — too far apart. An acid and an unrelated base are not a pair at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Phosphoric acid, H₃PO₄, is the tang in cola. Every hydrogen in its formula is bonded to an oxygen, so each one can be donated as H⁺ — one at a time — giving the chain H₃PO₄ → H₂PO₄⁻ → HPO₄²⁻ → PO₄³⁻. How many ionizable hydrogens does one molecule of H₃PO₄ have? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'An ionizable hydrogen is one the molecule can hand off as H⁺. The problem states that every H here is attached to an oxygen.',
        'Read the subscript on H in H₃PO₄, and count the arrows in the donation chain — each arrow releases one proton.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-strong-vs-concentrated',
      kind: 'misconception_check',
      question:
        'A student says: "0.1 M acetic acid must be more acidic than 0.001 M HCl, because acetic acid has 100 times more acid in it." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'More acid dissolved always means a more acidic solution',
          misconception: 'Merging STRENGTH (what fraction ionizes) with CONCENTRATION (how much was dissolved), and assuming the bigger molarity always wins.',
          correctsTo:
            'The two are independent knobs. HCl is STRONG, so essentially every molecule of that 0.001 M releases its H⁺ — you get about 0.001 M of free H⁺. Acetic acid is WEAK: at 0.1 M only around 1% of the molecules ionize, so you also end up near 0.001 M free H⁺ despite starting with 100 times more acid. What makes a solution acidic is the FREE H⁺ actually in the water, not the label on the bottle — which is exactly why a strong acid can be dilute and a weak acid can be concentrated.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arrhenius: acid releases H⁺ in water, base releases OH⁻ — quick, but water-only and blind to NH₃.',
        'Bronsted-Lowry: acid = proton DONOR, base = proton ACCEPTOR. Use this one by default; it covers everything Arrhenius does and more.',
        'Conjugate pairs differ by exactly one H⁺ and one unit of charge: HF/F⁻, NH₄⁺/NH₃, H₂O/H₃O⁺. Polyprotic acids give up protons one at a time.',
        'Water is amphoteric — acid with NH₃, base with HCl. A species\' role comes from its partner, not its formula.',
        'Strong ≠ concentrated: strength is the fraction that ionizes, concentration is how much you dissolved. Memorize the six strong acids and the common strong bases; everything else is weak.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Acids & Bases: Properties and Definitions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
