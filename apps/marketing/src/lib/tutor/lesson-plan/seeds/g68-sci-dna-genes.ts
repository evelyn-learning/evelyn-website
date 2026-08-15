/**
 * Grades 6-8 Science — DNA, Genes, and Heredity.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_DNA_GENES: LessonPlan = {
  id: 'evelyn.g68.science.dna-genes.v1',
  title: 'Genetics — DNA, Genes, and Inheritance',
  curriculum: 'NGSS',
  grade: '8',
  subject: 'science',
  topic: 'genetics',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.genetics.dna-genes',
      description: 'Connect DNA structure to genes and traits; explain how genetic information is passed from parents to offspring.',
      standard: 'NGSS-MS-LS3-1',
    },
  ],
  prerequisites: ['g68.sci.cell-biology.mitosis-meiosis'],
  followUps: ['g68.sci.genetics.mendel'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A few feet of DNA inside each cell determines everything from your eye colour to your blood type.',
      script: 'Inside every cell of your body, there\'s about 2 metres of DNA — coiled up tight. That DNA carries all the instructions for making YOU. Today: how DNA is structured, what genes are, and how parents pass traits to their children.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dna-genes',
      kind: 'concept',
      goal: 'DNA structure, genes, traits, inheritance basics.',
      keyIdeas: [
        'DNA = Deoxyribonucleic Acid. The molecule that stores genetic information.',
        'STRUCTURE: a DOUBLE HELIX (twisted ladder) made of two strands. The "rungs" are pairs of bases.',
        'BASES: there are four — A (adenine), T (thymine), G (guanine), C (cytosine). They pair: A-T and G-C, ALWAYS.',
        'GENE = a section of DNA that codes for a specific trait or protein. Each gene is a sequence of bases (e.g. ATGCCAGT...).',
        'CHROMOSOME = a long stretch of DNA wound around proteins. Humans have 46 chromosomes (23 pairs) in body cells.',
        'GENOME = all the DNA in an organism. Human genome has ~3 billion base pairs and ~20,000 genes.',
        'TRAIT = an observable feature (eye colour, height, blood type). Determined by one or more genes.',
        'INHERITANCE: when you reproduce, you pass copies of your DNA to your children. Each child gets:',
        '  Half the DNA from mother (in egg).',
        '  Half from father (in sperm).',
        '  Together: 23 + 23 = 46 chromosomes — full set.',
        'ALLELE = a version of a gene. For each gene, you have two alleles (one from each parent). They can be the same or different.',
        '  DOMINANT alleles: their trait shows when at least one is present.',
        '  RECESSIVE alleles: their trait shows only when BOTH alleles are recessive.',
        'EXAMPLE: brown eyes (B, dominant) vs blue eyes (b, recessive). BB or Bb = brown. bb = blue.',
      ],
      vocabulary: [
        { term: 'DNA', definition: 'a double-helix molecule that stores genetic information using four bases (A, T, G, C).' },
        { term: 'gene', definition: 'a section of DNA that codes for a specific trait or protein.' },
        { term: 'allele', definition: 'a version of a gene; you inherit one allele per gene from each parent.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A DNA strand has the sequence A-G-C-T-T-A. What is the sequence of the matching strand?',
      steps: [
        'Recall base pairing: A-T, G-C, always.',
        'For each base on the original strand, write its pair:',
        '  A → T',
        '  G → C',
        '  C → G',
        '  T → A',
        '  T → A',
        '  A → T',
        'Matching strand: T-C-G-A-A-T.',
        'Note: the new strand reads in the opposite direction (antiparallel) but for this level the pairing rule is the focus.',
      ],
      answer: 'T-C-G-A-A-T',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Both parents have brown eyes (Bb genotype). What is the probability their child has blue eyes?',
      expectedAnswer: 'Cross Bb × Bb gives offspring: BB, Bb, Bb, bb (1:2:1 ratio). Only bb shows blue eyes (recessive). Probability = 1/4 = 25%.',
      responseFormat: 'free',
      hints: [
        'Use a Punnett square or just enumerate the four allele combinations.',
        'Blue eyes need TWO recessive alleles.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-half-each',
      kind: 'misconception_check',
      question: 'A student says "I have half my mom\'s DNA and half my dad\'s, so my hair colour is exactly halfway between theirs." What\'s wrong?',
      commonErrors: [
        {
          answer: 'Halfway between parents',
          misconception: 'Treating genetic inheritance as blending.',
          correctsTo: 'You inherit half your DNA from each parent, but inheritance is NOT blending. Each gene comes in distinct alleles, and you get one full allele from each parent. The result is one combination of alleles, not a mix. Some traits show dominance (one allele\'s trait shows fully), some show codominance (both show), some are polygenic (multiple genes contribute, looks more like blending). But the underlying mechanism is always allele inheritance, not paint-mixing.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'DNA = double helix; bases pair A-T and G-C.',
        'Gene = section of DNA coding a trait. Allele = version of a gene.',
        'You inherit half your DNA from each parent.',
        'Dominant alleles mask recessive ones.',
        'Inheritance is allele-based, NOT paint-blending.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
