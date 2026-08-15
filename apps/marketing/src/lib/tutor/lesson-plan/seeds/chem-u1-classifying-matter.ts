/**
 * Chemistry — Matter & Measurement: Classifying Matter.
 *
 * The first sorting question of the whole course (NGSS HS-PS1-3): pure
 * substance or mixture, element or compound, homogeneous or
 * heterogeneous. The star misconception gets equal billing — "it looks
 * uniform, so it must be a compound" collapses on salt water.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U1_CLASSIFYING_MATTER: LessonPlan = {
  id: 'evelyn.hs.chem.classifying-matter.v1',
  title: 'Classifying Matter: Elements, Compounds & Mixtures',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.classifying-matter',
      standard: 'CHEM-1.1',
      description:
        'Classify a sample of matter as an element, a compound, a homogeneous mixture, or a heterogeneous mixture using its composition, whether its ratio is fixed, and whether physical or chemical means are needed to separate it (NGSS HS-PS1-3).',
    },
  ],
  prerequisites: [],
  followUps: ['chem.physical-chemical-changes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Classification is not vocabulary busywork — it decides how you can take something apart.',
      script:
        'A water-treatment plant removes salt from seawater by boiling it and catching the steam. Try the same trick on the water itself and nothing happens — no amount of boiling turns H₂O into hydrogen and oxygen; that takes an electric current. Same clear liquid, completely different rules. The difference is a classification: seawater is a MIXTURE, water is a COMPOUND. Every separation a chemist, a forensic lab, or a desalination plant ever performs starts with that one call, so today we learn to make it — element, compound, homogeneous mixture, heterogeneous mixture — and it is the sorting box everything else in this course drops into.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-classification',
      kind: 'concept',
      goal: 'Two branching questions (pure or mixed, then which kind), plus the uniform-looks trap.',
      keyIdeas: [
        'QUESTION 1 — PURE SUBSTANCE OR MIXTURE? A pure substance is made of ONE kind of particle throughout and has a FIXED composition; every sample of it, from anywhere on Earth, is identical. A mixture is two or more substances physically stirred together in ANY ratio you like — nothing is bonded.',
        'PURE SUBSTANCES SPLIT IN TWO — an ELEMENT is one kind of atom only (Fe, He, O₂ — still an element, just two identical atoms bonded) and cannot be broken down chemically at all. A COMPOUND is two or more different elements CHEMICALLY BONDED in a fixed ratio: H₂O, NaCl, CO₂.',
        'MIXTURES SPLIT IN TWO — HOMOGENEOUS (a solution): uniform everywhere you sample it, no visible boundaries — salt water, air, brass, stainless steel. HETEROGENEOUS: visibly different regions — granite, sand in water, a salad, oil and vinegar.',
        'FIXED RATIO IS THE COMPOUND FINGERPRINT — water is ALWAYS 2 hydrogen atoms per 1 oxygen atom, whether it came from a glacier or a tap. Salt water can be 1 % salt or 25 % salt and is still salt water. Variable ratio → mixture. No exceptions.',
        'SEPARATION TELLS YOU WHICH — mixtures come apart by PHYSICAL means (filtering, distilling, evaporating, a magnet, chromatography) because nothing is chemically bonded. Compounds come apart only in a CHEMICAL reaction — running current through water finally splits it into H₂ and O₂.',
        'COMPOUNDS GET NEW PROPERTIES; MIXTURES KEEP THE OLD ONES — sodium is a metal that explodes in water and chlorine is a poison gas, yet bonded as NaCl they are the salt on your fries. In a mixture, every component keeps its own behavior: iron filings stirred into sand still jump to a magnet.',
        'THE TRAP: UNIFORM ≠ PURE — salt water is perfectly clear and uniform, and students promote it to "compound" every year. Looking uniform only earns the label HOMOGENEOUS; being pure requires a fixed ratio and chemical bonds. Homogeneous mixture and compound look identical to the eye — you separate them, or check the ratio, to tell them apart.',
        'THE SECOND TRAP: SUBSCRIPTS vs A PLUS SIGN — H₂O is a single compound; a tank labeled H₂ + O₂ holds a mixture of two elements that happen to share the space. One chemical formula with no plus sign means the atoms are bonded.',
      ],
      vocabulary: [
        { term: 'pure substance', definition: 'matter with one kind of particle throughout and a fixed composition — an element or a compound.' },
        { term: 'compound', definition: 'two or more different elements chemically bonded in a fixed ratio, separable only by a chemical reaction.' },
        { term: 'homogeneous mixture', definition: 'a mixture with uniform composition throughout, also called a solution; the ratio can still vary from sample to sample.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-four',
      kind: 'worked_example',
      problem:
        'Classify each sample as element, compound, homogeneous mixture, or heterogeneous mixture: (a) helium in a party balloon, (b) table sugar, C₁₂H₂₂O₁₁, (c) Italian dressing that settles into an oil layer over a vinegar layer, (d) brass, made by melting copper and zinc together into a uniform gold-colored metal.',
      steps: [
        'Run Question 1 on each: is the sample one kind of particle with a fixed composition (pure), or several substances mixed in an adjustable ratio?',
        '(a) Helium is one kind of atom, He — nothing to break down. ELEMENT.',
        '(b) Sugar has three different elements locked in the fixed ratio 12 C : 22 H : 1 O, written as one formula with no plus sign. COMPOUND.',
        '(c) Two visible layers means you can point at regions with different composition, and shaking or pouring separates them physically. HETEROGENEOUS MIXTURE.',
        '(d) Copper and zinc are not bonded — the recipe can be shifted to more copper or more zinc — but the melt is uniform with no visible boundaries. HOMOGENEOUS MIXTURE (an alloy is a solid solution).',
        'Answers: (a) element, (b) compound, (c) heterogeneous mixture, (d) homogeneous mixture.',
      ],
      answer: '(a) element, (b) compound, (c) heterogeneous mixture, (d) homogeneous mixture',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-saltwater-trap',
      kind: 'worked_example',
      problem:
        'A student argues: "Salt water must be a compound — the salt and the water have combined, and the result is one clear uniform liquid you cannot pick apart." Find the flaw and classify salt water correctly.',
      steps: [
        'Test the ratio first. A compound has ONE fixed ratio; salt water can be made with a pinch of salt or with enough to float an egg, and both are still salt water. Variable ratio already rules out compound.',
        'Test the separation. Boil the salt water: the water leaves as steam and the salt stays behind as dry crystals — a PHYSICAL change, no reaction needed. Compounds refuse to separate that way; splitting water itself demands an electric current.',
        'Test the properties. The dissolved salt still tastes salty and still crystallizes back out unchanged, so it kept its identity — nothing new was made. A real compound like NaCl behaves nothing like the sodium and chlorine that formed it.',
        'The flaw is treating "looks uniform" as "is pure." Uniform appearance earns the word HOMOGENEOUS, nothing more.',
        'Salt water is a HOMOGENEOUS MIXTURE — a solution of the compound NaCl in the compound H₂O.',
      ],
      answer: 'Homogeneous mixture — variable ratio and physical separation by boiling both rule out compound',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-air',
      kind: 'try_yourself',
      problem:
        'Dry air is about 78 % nitrogen (N₂), 21 % oxygen (O₂), and 1 % argon (Ar) by volume, and those percentages drift slightly from place to place. How should air be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Homogeneous mixture — uniform to the eye, but the gases are unbonded and the ratio varies', correct: true },
        { id: 'b', text: 'Compound — the gases are combined into a single invisible substance' },
        { id: 'c', text: 'Element — nitrogen, oxygen, and argon are all elements, so the sample is too' },
        { id: 'd', text: 'Heterogeneous mixture — three different gases means three different regions' },
      ],
      expectedAnswer: 'Homogeneous mixture — uniform to the eye, but the gases are unbonded and the ratio varies',
      hints: [
        'Start with Question 1: is the composition FIXED everywhere, or does it drift from place to place?',
        'A drifting ratio means mixture. Now ask whether you could point at visibly different regions inside a jar of air.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compound-evidence',
      kind: 'try_yourself',
      problem:
        'You have a clear, colorless liquid. Which single observation is the best evidence that it is a COMPOUND rather than a homogeneous mixture?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every sample of it contains the same elements in the same fixed mass ratio, and only an electric current breaks it apart', correct: true },
        { id: 'b', text: 'It looks completely uniform, with no visible particles or layers' },
        { id: 'c', text: 'It contains more than one element' },
        { id: 'd', text: 'Gently heating it leaves a solid residue behind in the flask' },
      ],
      expectedAnswer: 'Every sample of it contains the same elements in the same fixed mass ratio, and only an electric current breaks it apart',
      hints: [
        'Homogeneous mixtures also look uniform and also contain several elements — those observations cannot separate the two cases.',
        'The two things only a compound has are a FIXED ratio and a refusal to come apart by physical means.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A lab bench holds seven samples: distilled water, air, table salt (NaCl), stainless steel, oxygen gas (O₂), sugar stirred into hot tea, and a copper wire. How many of the seven are PURE SUBSTANCES (elements or compounds)? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Sort each one first: a pure substance has a fixed composition; a mixture has an adjustable recipe.',
        'Air, stainless steel, and sweetened tea are all mixtures — count what is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-uniform-means-compound',
      kind: 'misconception_check',
      question:
        'A student says: "Air has to be a compound — you cannot see the separate gases in it, so they must have combined into one substance." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'You cannot see separate parts, so it is a compound',
          misconception: 'Using visual uniformity as the test for purity, when uniformity only distinguishes homogeneous mixtures from heterogeneous ones.',
          correctsTo:
            'Invisibility of the parts only makes air HOMOGENEOUS. Purity is decided by the ratio and by how the sample separates: the nitrogen-to-oxygen ratio of air drifts from place to place, and cooling air until it liquefies then distilling it pulls out pure N₂ and pure O₂ by purely PHYSICAL means. Bonded compounds do neither — air is a homogeneous mixture.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two questions in order: pure substance or mixture? Then element or compound / homogeneous or heterogeneous.',
        'Element = one kind of atom; compound = different elements chemically bonded in a FIXED ratio.',
        'Homogeneous = uniform throughout (salt water, air, brass); heterogeneous = visibly different regions (granite, oil and vinegar).',
        'Separation is the tell: mixtures come apart physically (filter, distill, magnet); compounds only come apart in a chemical reaction.',
        'The trap: uniform ≠ pure — salt water looks like one substance but has a variable ratio and boils apart, so it is a mixture.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Classifying Matter: Elements, Compounds & Mixtures' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
