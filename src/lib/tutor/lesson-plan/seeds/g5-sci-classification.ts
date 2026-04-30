/**
 * G5 — Classification of living things.
 *
 * Kingdoms (Animal, Plant, Fungi, Protist, Bacteria, Archaea) and the
 * basic taxonomic ranks: Kingdom > Phylum > Class > Order > Family >
 * Genus > Species.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_CLASSIFICATION: LessonPlan = {
  id: 'evelyn.g5.sci.life.classification.v1',
  title: 'Classifying living things',
  curriculum: 'NGSS',
  grade: '5',
  subject: 'sci',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.5-ls2.a',
      description: 'Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment.',
      standard: 'NGSS.5-LS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.ms-ls2.a'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with how scientists need a way to organize ~8 million species.',
      script: 'There are about 8 million species of living things on Earth. Scientists couldn\'t talk about them without a system to GROUP them. Today: how that system works, from "kingdom" all the way down to "species".',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ranks-and-kingdoms',
      kind: 'concept',
      goal: 'Six kingdoms + 7 ranks + binomial naming.',
      keyIdeas: [
        'SIX KINGDOMS: Animals, Plants, Fungi (mushrooms, mold), Protists (single-celled like amoebas), Bacteria, Archaea (extreme-environment microbes).',
        'SEVEN RANKS, broad to specific: KINGDOM > PHYLUM > CLASS > ORDER > FAMILY > GENUS > SPECIES.',
        'Mnemonic: "King Phillip Came Over For Good Soup".',
        'BINOMIAL NOMENCLATURE: every species has a two-word Latin name. First word = genus (capitalized). Second = species (lowercase). Both italicized.',
        'Example: HUMANS are *Homo sapiens*. *Homo* = our genus, *sapiens* = our species.',
        'CHARACTERISTICS used for classification: cell type (with or without nucleus), how they get food (make their own vs eat others), structure (single-celled vs multi-celled).',
      ],
      vocabulary: [
        { term: 'species', definition: 'a group of organisms that can breed with each other.' },
        { term: 'kingdom', definition: 'one of six broadest categories of living things.' },
        { term: 'binomial nomenclature', definition: 'the two-name system (genus + species) for naming organisms.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'A wolf and a domestic dog are different species. Why are they put in the same GENUS?',
      steps: [
        'Both share many features: 4 legs, fur, carnivore teeth, similar body plan.',
        'They\'re close enough that they CAN breed (wolf-dog hybrids exist), but in nature they don\'t much, so they\'re considered separate species.',
        'Both belong to the genus *Canis*. Wolf = *Canis lupus*, dog = *Canis familiaris*.',
        'GENUS groups closely-related species. Domestic dogs and wolves are like cousins — same genus, different species.',
      ],
      answer: 'they share enough features to be in the same genus (*Canis*), but differ enough to be separate species',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Recite the seven taxonomic ranks from BROADEST to MOST SPECIFIC.',
      expectedAnswer: 'kingdom, phylum, class, order, family, genus, species',
      responseFormat: 'free',
      hints: [
        'Mnemonic: "King Phillip Came Over For Good Soup".',
        'Each letter starts a rank, in order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mushroom-plant',
      kind: 'misconception_check',
      question: 'Are mushrooms plants?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Putting mushrooms in the plant kingdom.',
          correctsTo: 'No — mushrooms are FUNGI, their own kingdom. They don\'t do photosynthesis (no chlorophyll), they have a different cell wall material (chitin, like insect exoskeletons), and they\'re actually closer to ANIMALS evolutionarily than to plants.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six kingdoms: Animals, Plants, Fungi, Protists, Bacteria, Archaea.',
        'Seven ranks (KPCOFGS): Kingdom, Phylum, Class, Order, Family, Genus, Species.',
        'Species named with two Latin words: *Genus species*.',
        'Mushrooms are fungi, not plants.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do scientists update classifications? Give one example of an organism that\'s been reclassified.',
      hint: 'New DNA evidence reveals true relationships. Pandas were once classified with raccoons; DNA showed they\'re closer to bears. Some "species" turn out to be multiple species when DNA-tested.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
