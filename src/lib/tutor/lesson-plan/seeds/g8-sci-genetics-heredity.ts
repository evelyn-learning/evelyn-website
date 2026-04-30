/**
 * G8 — Genetics and heredity intro.
 *
 * Genes, alleles, dominant/recessive, Punnett squares, phenotype vs
 * genotype. Bridges G7 Punnett with HS biology genetics.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SCI_GENETICS_HEREDITY: LessonPlan = {
  id: 'evelyn.g8.sci.life.genetics-heredity.v1',
  title: 'Genetics and heredity: how traits pass to offspring',
  curriculum: 'NGSS',
  grade: '8',
  subject: 'sci',
  topic: 'life-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ls3.b',
      description: 'Develop and use a model to describe why structural changes to genes can affect proteins and may result in harmful, beneficial, or neutral effects.',
      standard: 'NGSS.MS-LS3-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.hs-ls3.a'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor with relatable family-resemblance.',
      script: 'Why do you have your mom\'s eyes but your dad\'s nose? GENES. Half from each parent. Today: how exactly that mixing produces YOU.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-key-terms',
      kind: 'concept',
      goal: 'Genes, alleles, dominant/recessive, genotype vs phenotype, Punnett squares.',
      keyIdeas: [
        'GENE: a section of DNA that codes for a trait (eye color, height, blood type).',
        'ALLELE: a version of a gene. Eye-color gene has alleles for brown, blue, green, etc.',
        'You have TWO alleles per gene — one from each parent.',
        'DOMINANT allele (uppercase, e.g., B): expressed if even one copy is present.',
        'RECESSIVE allele (lowercase, e.g., b): only expressed when BOTH copies are recessive (bb).',
        'HOMOZYGOUS: both alleles same (BB or bb). HETEROZYGOUS: alleles different (Bb).',
        'GENOTYPE: the actual alleles (BB, Bb, bb). PHENOTYPE: the observable trait (brown vs blue eyes).',
        'PUNNETT SQUARE: a grid that predicts offspring genotypes from parent alleles. Two parents heterozygous (Bb × Bb) → offspring 1 BB : 2 Bb : 1 bb. Phenotype ratio: 3 brown (any B) : 1 blue (bb).',
      ],
      vocabulary: [
        { term: 'allele', definition: 'a version of a gene; you have two of each gene.' },
        { term: 'genotype', definition: 'the actual alleles an organism has (e.g., Bb).' },
        { term: 'phenotype', definition: 'the observable trait (e.g., brown eyes).' },
        { term: 'Punnett square', definition: 'a grid for predicting offspring genotype probabilities.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-punnett',
      kind: 'worked_example',
      problem: 'Both parents are Bb (heterozygous brown eyes). What\'s the chance of a blue-eyed child (bb)?',
      steps: [
        'Set up a 2×2 Punnett square: parent 1 has B and b; parent 2 has B and b.',
        'Fill in: BB (top-left), Bb (top-right), Bb (bottom-left), bb (bottom-right).',
        'Genotype ratio: 1 BB : 2 Bb : 1 bb.',
        'Phenotype: BB = brown, Bb = brown (B is dominant), bb = blue.',
        'Brown:blue = 3:1. Probability of bb (blue) = 1/4 = 25%.',
      ],
      answer: '25%',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A homozygous tall pea plant (TT) is crossed with a homozygous short one (tt). All offspring are heterozygous (Tt) and tall. Why are they all tall?',
      expectedAnswer: 'T (tall) is dominant; all offspring inherit one T and one t, so they show the dominant phenotype',
      responseFormat: 'free',
      hints: [
        'Each parent passes ONE allele.',
        'TT × tt: every offspring gets one T from the tall parent and one t from the short parent.',
        'Tt has at least one dominant allele → expresses the dominant trait.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dominant-common',
      kind: 'misconception_check',
      question: 'Does "dominant" mean the more COMMON trait in a population?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating dominance with frequency.',
          correctsTo: 'No — DOMINANT just means the allele is expressed when present. It says nothing about how COMMON the trait is. Polydactyly (extra fingers) is genetically dominant but rare. Brown eyes are dominant AND common — but that\'s coincidence.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Each gene → two alleles (one from each parent).',
        'Dominant allele expressed if present; recessive only if BOTH copies.',
        'Genotype = alleles. Phenotype = observable trait.',
        'Punnett squares predict offspring ratios.',
        '"Dominant" ≠ "common" in population.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For most traits, ONE gene doesn\'t determine the outcome. Why is human height much more complex than a Punnett square suggests?',
      hint: 'Height is POLYGENIC — influenced by hundreds of genes plus environment (nutrition, etc.). Mendel\'s pea-trait genetics applies to a small subset of clean single-gene traits.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
