/**
 * Grades 6-8 Science — Mendelian Inheritance and Punnett Squares.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SCI_MENDEL_INHERITANCE: LessonPlan = {
  id: 'evelyn.g68.science.mendel-inheritance.v1',
  title: 'Genetics — Mendel\'s Laws and Punnett Squares',
  curriculum: 'NGSS',
  grade: '8',
  subject: 'science',
  topic: 'genetics',
  locale: 'en',
  los: [
    {
      id: 'g68.sci.genetics.mendel',
      description: 'Use Punnett squares to predict offspring genotype and phenotype ratios for monohybrid crosses; understand Mendel\'s laws.',
      standard: 'NGSS-MS-LS3-2',
    },
  ],
  prerequisites: ['g68.sci.genetics.dna-genes'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Gregor Mendel cracked inheritance in the 1860s using pea plants and basic math.',
      script: 'Mendel grew thousands of pea plants and noticed traits like "tall" and "short" passed in predictable RATIOS. He had no idea about DNA — but his math was right. Today: how Punnett squares predict offspring traits.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mendel',
      kind: 'concept',
      goal: 'Genotype vs phenotype, Punnett squares, monohybrid cross outcomes.',
      keyIdeas: [
        'GENOTYPE = the alleles an organism has (e.g. BB, Bb, bb). The genetic makeup.',
        'PHENOTYPE = the observable trait (brown eyes, blue eyes). What you can see.',
        'HOMOZYGOUS = two of the same allele. BB or bb. ("Pure-breeding.")',
        'HETEROZYGOUS = two different alleles. Bb. ("Hybrid.")',
        'MENDEL\'S LAW OF SEGREGATION: each parent passes ONE of their two alleles to each gamete, randomly.',
        'PUNNETT SQUARE: a grid that predicts offspring genotypes from a parental cross.',
        'PROCEDURE for a Punnett square (parents Bb × Bb):',
        '  1. Top of grid: parent 1\'s two alleles (B, b).',
        '  2. Side of grid: parent 2\'s two alleles (B, b).',
        '  3. Fill each box with the combination: BB, Bb, Bb, bb.',
        '  4. Count: 1 BB, 2 Bb, 1 bb (genotype ratio 1:2:1).',
        '  5. If B is dominant: 3 brown phenotype : 1 blue phenotype (3:1 ratio).',
        'CROSSES to memorise:',
        '  BB × bb → all Bb. All offspring heterozygous, all show dominant trait.',
        '  Bb × bb (test cross) → 1:1 Bb:bb. Half dominant, half recessive.',
        '  Bb × Bb → 1:2:1 genotype, 3:1 phenotype.',
        'PROBABILITY language: "The probability the child is bb is 1/4 (or 25%)."',
      ],
      vocabulary: [
        { term: 'Punnett square', definition: 'a grid used to predict offspring genotype combinations from a parental cross.' },
        { term: 'phenotype', definition: 'the observable trait of an organism; determined by genotype + environment.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'In rabbits, black fur (B) is dominant over white fur (b). Cross a heterozygous black rabbit (Bb) with a white rabbit (bb). What ratio of black to white offspring is expected?',
      steps: [
        'Set up Punnett square. Parent 1: Bb. Parent 2: bb.',
        'Top of grid: B, b. Side of grid: b, b.',
        'Fill: Bb, bb, Bb, bb.',
        'Genotype ratio: 2 Bb : 2 bb = 1:1.',
        'Phenotype: Bb shows black (dominant), bb shows white. So 1 black : 1 white.',
        'Half of offspring are expected to be black, half white.',
      ],
      answer: '1:1 ratio (half black, half white)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two parents are both heterozygous for a recessive disorder (Aa). What\'s the probability that any one child has the disorder (aa)?',
      expectedAnswer: 'Aa × Aa Punnett: AA, Aa, Aa, aa. Phenotype: 3 normal (AA + 2 Aa) : 1 disorder (aa). P(disorder) = 1/4 = 25%.',
      responseFormat: 'numeric',
      hints: [
        'Set up the Aa × Aa Punnett square.',
        'Recessive disorders need two recessive alleles.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cumulative',
      kind: 'misconception_check',
      question: 'A couple has three children, all without a recessive disorder despite both parents being carriers. The student says the fourth child WILL have it because the 1/4 probability "must catch up." What\'s wrong?',
      commonErrors: [
        {
          answer: 'Probability accumulates',
          misconception: 'Confusing independent events with cumulative outcomes.',
          correctsTo: 'Each pregnancy is INDEPENDENT. The 1/4 probability applies to each child separately, regardless of siblings\' outcomes. Three healthy children doesn\'t change the next child\'s 1/4 chance — that\'s the gambler\'s fallacy. Genes assort fresh each time, with no memory of previous pregnancies. The outcomes for siblings are independent.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Genotype = alleles; phenotype = trait.',
        'Punnett square: 1 BB : 2 Bb : 1 bb genotype, 3:1 phenotype for Bb × Bb.',
        'Test cross: Bb × bb gives 1:1 dominant:recessive.',
        'Each pregnancy is independent — outcomes don\'t accumulate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
