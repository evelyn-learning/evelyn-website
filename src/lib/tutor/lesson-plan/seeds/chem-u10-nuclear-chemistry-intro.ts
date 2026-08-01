/**
 * Chemistry — Nuclear Chemistry: Radioactivity & Half-Life.
 *
 * The nucleus finally takes the stage (NGSS HS-PS1-8): alpha, beta, and
 * gamma emission, balancing nuclear equations by mass and atomic number,
 * half-life arithmetic, and fission versus fusion. The star misconception
 * gets equal billing — two half-lives do NOT empty the sample, and no
 * amount of heating or catalyst changes a decay rate.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U10_NUCLEAR_CHEMISTRY_INTRO: LessonPlan = {
  id: 'evelyn.hs.chem.nuclear-chemistry-intro.v1',
  title: 'Nuclear Chemistry: Radioactivity & Half-Life',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.nuclear-chemistry-intro',
      standard: 'CHEM-10.4',
      description:
        'Describe alpha, beta, and gamma emission, balance nuclear equations by mass number and atomic number, calculate the mass remaining after a whole number of half-lives, and contrast nuclear fission with fusion (NGSS HS-PS1-8).',
    },
  ],
  prerequisites: ['chem.neutralization-titration'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Radioactive decay as a clock nobody can reset — it dates mummies, powers cities, and lights the Sun.',
      script:
        'In 1991 two hikers found a frozen body in the Alps. Was he a lost climber from the 1970s or something far older? Chemists measured the carbon-14 left in his tissue and answered in days: he died about 5,300 years ago. Otzi the Iceman was dated by a clock that no fire, freezer, or chemical can speed up or slow down — the decay of an unstable nucleus. Every reaction so far in this course rearranged ELECTRONS. Today the nucleus itself changes, one element literally turning into another, and that same physics dates fossils, treats cancer, powers reactors, and runs the Sun.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-decay-and-half-life',
      kind: 'concept',
      goal: 'Nuclear change versus chemical change, the three emissions, balancing by mass and atomic number, half-life counting, and fission versus fusion.',
      keyIdeas: [
        'NUCLEAR ≠ CHEMICAL — a chemical change rearranges valence electrons and the elements survive intact; a NUCLEAR change rewrites the nucleus, so one element transmutes into a different element. Nuclear changes release roughly a million times more energy per atom, and their rates ignore temperature, pressure, concentration, and catalysts entirely.',
        'ISOTOPE NOTATION — uranium-238 is also written ²³⁸U: the superscript 238 is the MASS NUMBER (protons + neutrons) and the element symbol fixes the ATOMIC NUMBER (protons only, 92 for U). Isotopes of one element share protons and differ in neutrons: ²³⁵U and ²³⁸U are both uranium, 235 − 92 = 143 versus 238 − 92 = 146 neutrons.',
        'ALPHA (α) EMISSION — the nucleus ejects a helium-4 nucleus, ⁴He, which is 2 protons + 2 neutrons. Mass number drops by 4 and atomic number drops by 2, so the atom becomes a new element two boxes to the left. Alpha particles are the heaviest and slowest: a sheet of paper or your skin stops them, but they do serious damage if inhaled or swallowed.',
        'BETA (β⁻) EMISSION — a NEUTRON inside the nucleus converts into a proton and ejects an electron, e⁻. Mass number is UNCHANGED (a neutron simply became a proton, total still the same) and atomic number goes UP by 1, so the atom shifts one box to the RIGHT. Beta particles punch through paper; aluminum foil stops them.',
        'GAMMA (γ) EMISSION — pure high-energy light with no mass and no charge, released as a jittery nucleus settles into a lower-energy arrangement. Mass number and atomic number BOTH stay the same, so gamma alone never changes the element; it usually rides along with alpha or beta decay. It takes thick lead or concrete to stop it.',
        'BALANCE NUCLEAR EQUATIONS TWICE — the mass numbers must sum to the same total on both sides AND the atomic numbers must sum to the same total on both sides. Those two bookkeeping rules alone identify any missing particle, no memorization required.',
        'HALF-LIFE — the time for half of the radioactive nuclei present to decay. It is a fixed property of the isotope: carbon-14 is 5,730 years, iodine-131 is 8 days, uranium-238 is 4.5 billion years. Count half-lives with (total time ÷ half-life), then halve the sample that many times: remaining = initial × (1/2) raised to the number of half-lives.',
        'FISSION vs FUSION — FISSION SPLITS a heavy nucleus: a neutron strikes ²³⁵U, it breaks into lighter fragments plus 2–3 more neutrons, and those neutrons split more nuclei in a chain reaction (this runs every nuclear power plant). FUSION JOINS light nuclei: hydrogen nuclei merge into helium in the Sun\'s core, releasing even more energy per gram, but only at enormous temperature and pressure. Both convert a tiny bit of mass into a huge amount of energy.',
      ],
      vocabulary: [
        { term: 'transmutation', definition: 'the conversion of one element into another when the number of protons in the nucleus changes.' },
        { term: 'half-life', definition: 'the time required for half of the radioactive nuclei in a sample to decay.' },
        { term: 'nuclear fission', definition: 'the splitting of one heavy nucleus into lighter nuclei plus neutrons and energy.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-alpha-decay',
      kind: 'worked_example',
      problem:
        'Uranium-238 (atomic number 92) undergoes alpha decay. Write the nuclear equation and name the element produced. Thorium has atomic number 90, protactinium 91, and radium 88.',
      steps: [
        'Write what you know: ²³⁸U → ⁴He + ? — an alpha particle is a helium-4 nucleus, 2 protons and 2 neutrons.',
        'Balance the MASS numbers: 238 on the left must equal 4 + (unknown), so the unknown has mass number 238 − 4 = 234.',
        'Balance the ATOMIC numbers: 92 on the left must equal 2 + (unknown), so the unknown has atomic number 92 − 2 = 90.',
        'Atomic number 90 is thorium, so the product is ²³⁴Th and the finished equation is ²³⁸U → ⁴He + ²³⁴Th.',
        'Check the pattern: alpha decay always drops mass by 4 and atomic number by 2 — uranium moved two boxes left on the table. That is transmutation, something no chemical reaction can do.',
      ],
      answer: '²³⁸U → ⁴He + ²³⁴Th — thorium-234, since alpha decay subtracts 4 from mass and 2 from atomic number',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-half-life-trap',
      kind: 'worked_example',
      problem:
        'Iodine-131 has a half-life of 8 days. A student claims a 40 g sample is completely gone after 16 days: "One half-life removes half, a second half-life removes the other half, so nothing is left." Find the flaw and give the correct remaining mass.',
      steps: [
        'Name the move: the student added two halves of the ORIGINAL sample. But each half-life halves whatever is STILL THERE at that moment, not the starting amount.',
        'Count the half-lives: 16 days ÷ 8 days per half-life = 2 half-lives.',
        'Halve step by step: start 40 g → after the first half-life 20 g → after the second half-life 10 g.',
        'Check with the formula: 40 × (1/2)² = 40 × 1/4 = 10 g. The student\'s answer of 0 g is off by the entire remaining sample.',
        'The deeper point: halving repeatedly never reaches exactly zero. After 10 half-lives about 1/1024 of the original still remains — which is exactly why radioactive waste stays hazardous for so long.',
      ],
      answer: '10 g remains — each half-life halves what is left, so 40 → 20 → 10, never 0',
      estimatedMinutes: 3,
    },
    {
      id: 'try-beta-product',
      kind: 'try_yourself',
      problem:
        'Carbon-14 (atomic number 6) undergoes beta decay. Which nucleus is produced? Boron has atomic number 5, carbon 6, and nitrogen 7.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nitrogen-14 — mass number stays 14, atomic number rises from 6 to 7', correct: true },
        { id: 'b', text: 'Boron-14 — the atomic number drops from 6 to 5' },
        { id: 'c', text: 'Carbon-13 — the mass number drops by 1 because a particle left' },
        { id: 'd', text: 'Nitrogen-15 — both the mass number and the atomic number rise by 1' },
      ],
      expectedAnswer: 'Nitrogen-14 — mass number stays 14, atomic number rises from 6 to 7',
      hints: [
        'In beta decay a neutron turns into a proton and shoots out an electron. What does that do to the TOTAL count of protons plus neutrons?',
        'One neutron became one proton, so mass number is unchanged at 14; protons went 6 → 7. Which element has 7 protons?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fission-fusion',
      kind: 'try_yourself',
      problem: 'Which statement correctly contrasts nuclear fission with nuclear fusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fission splits a heavy nucleus into lighter ones; fusion joins light nuclei into a heavier one', correct: true },
        { id: 'b', text: 'Fission joins light nuclei into a heavier one; fusion splits a heavy nucleus' },
        { id: 'c', text: 'Fission is a nuclear change, while fusion is a chemical change that only rearranges electrons' },
        { id: 'd', text: 'Both processes conserve mass exactly, so neither one releases energy' },
      ],
      expectedAnswer: 'Fission splits a heavy nucleus into lighter ones; fusion joins light nuclei into a heavier one',
      hints: [
        'Use the everyday words: a "fissure" is a crack or split, and to "fuse" things is to join them together.',
        'Reactors split ²³⁵U in a chain reaction; the Sun merges hydrogen into helium. Match each to the right label.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A hospital stores an 80 g sample of a radioactive isotope whose half-life is 5 years. How many grams of the isotope remain after 15 years? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '10',
      hints: [
        'First count the half-lives: 15 years ÷ 5 years per half-life = 3 half-lives.',
        'Now halve the sample three times, each time halving what is LEFT: 80 → 40 → 20 → ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-speeding-decay',
      kind: 'misconception_check',
      question:
        'A student says: "Radioactive waste is just a slow reaction. Heat it, powder it, or add a catalyst and it will decay faster — that is how we speed up any chemical reaction." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Heating, grinding, or catalyzing the sample shortens its half-life',
          misconception: 'Treating nuclear decay as a chemical reaction, so the usual rate factors (temperature, surface area, concentration, catalysts) are assumed to apply.',
          correctsTo:
            'Those factors all act on ELECTRONS — collisions, activation energy, bonds breaking and forming. Radioactive decay happens inside the NUCLEUS, which is far too tightly bound and far too energetic to notice a bunsen burner or a catalyst. A half-life is a fixed property of the isotope: carbon-14 is 5,730 years in a freezer, in a furnace, as a solid, or dissolved in water. That immovability is exactly what makes decay a trustworthy clock for dating an iceman.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nuclear changes rewrite the nucleus and transmute one element into another; chemical changes only rearrange electrons and never change which elements are present.',
        'Alpha (⁴He) drops mass by 4 and atomic number by 2; beta (e⁻) leaves mass unchanged and raises atomic number by 1; gamma (γ) changes neither.',
        'Balance every nuclear equation twice: mass numbers must match across the arrow, and atomic numbers must match too.',
        'Half-life halves whatever is LEFT: count half-lives as (total time ÷ half-life), then halve that many times — 80 g with a 5-year half-life is 10 g after 15 years, never 0.',
        'Fission splits a heavy nucleus in a neutron chain reaction (reactors); fusion joins light nuclei under extreme heat and pressure (the Sun); no temperature, catalyst, or chemical treatment changes any decay rate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Nuclear Chemistry: Radioactivity & Half-Life' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
