/**
 * AP Biology — Hardy-Weinberg equilibrium.
 *
 * Population genetics math: p² + 2pq + q² = 1. Conditions for
 * equilibrium and what their violation reveals about evolution.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_HARDY_WEINBERG: LessonPlan = {
  id: 'evelyn.ap.bio.hardy-weinberg.v1',
  title: 'Hardy-Weinberg equilibrium',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'ap-biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.hardy-weinberg',
      description: 'Apply the Hardy-Weinberg equation to determine allele frequencies in a population.',
      standard: 'AP-BIO-EVO-2',
    },
  ],
  prerequisites: ['apbio.genetics'],
  followUps: ['apbio.speciation'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Hardy-Weinberg as the "null hypothesis" of evolution.',
      script: 'Hardy-Weinberg gives us the populations that AREN\'T evolving — the baseline. When real populations DEVIATE from it, that\'s the fingerprint of evolution at work. It\'s the null hypothesis of population genetics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equation-conditions',
      kind: 'concept',
      goal: 'The equation, the variables, the five conditions.',
      keyIdeas: [
        'EQUATION: p² + 2pq + q² = 1 (genotype frequencies). And p + q = 1 (allele frequencies).',
        'p = frequency of dominant allele. q = frequency of recessive allele.',
        'p² = freq of homozygous dominant (AA). q² = freq of homozygous recessive (aa). 2pq = freq of heterozygous (Aa).',
        'FIVE CONDITIONS for equilibrium (no evolution): 1) NO mutation. 2) Random MATING. 3) Population is INFINITELY LARGE (no genetic drift). 4) NO migration in or out. 5) NO natural selection.',
        'In the REAL world, no population satisfies all five — meaning all real populations are evolving, even if slowly.',
        'USE: given q² (frequency of recessive phenotype), solve for q, then p, then frequencies of all three genotypes.',
      ],
      vocabulary: [
        { term: 'allele frequency', definition: 'how common a particular allele is in a population.' },
        { term: 'genetic drift', definition: 'random changes in allele frequency, especially in small populations.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-recessive',
      kind: 'worked_example',
      problem: 'In a population, 16% of individuals show the recessive phenotype (aa). Assuming Hardy-Weinberg, find the allele frequencies and frequency of heterozygotes.',
      steps: [
        'q² = 0.16 → q = √0.16 = 0.4 (recessive allele frequency).',
        'p = 1 − q = 1 − 0.4 = 0.6 (dominant allele frequency).',
        'Heterozygote (Aa) frequency = 2pq = 2(0.6)(0.4) = 0.48.',
        'Check: p² + 2pq + q² = 0.36 + 0.48 + 0.16 = 1.00 ✓.',
        'So: 36% AA, 48% Aa, 16% aa.',
      ],
      answer: 'p=0.6, q=0.4, AA=36%, Aa=48%, aa=16%',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a population at H-W equilibrium, the dominant allele frequency is 0.7. What fraction of the population is heterozygous?',
      expectedAnswer: '0.42',
      responseFormat: 'numeric',
      hints: [
        'p = 0.7 → q = 0.3.',
        '2pq = 2(0.7)(0.3) = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equilibrium-real',
      kind: 'misconception_check',
      question: 'Is Hardy-Weinberg equilibrium something we expect REAL populations to be in?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating H-W as the typical state.',
          correctsTo: 'No — its FIVE conditions are essentially never all met in reality. Real populations always have some mutation, some non-random mating, some selection, some drift. H-W is the BASELINE we compare against. Deviations reveal which evolutionary force is acting.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'p² + 2pq + q² = 1; p + q = 1.',
        'Five conditions: no mutation, random mating, infinite population, no migration, no selection.',
        'Given q² (recessive frequency), find q, then everything else.',
        'Real populations DEVIATE — that\'s how we detect evolution.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If a recessive disease has q² = 1/10000, what fraction of the population are CARRIERS (heterozygotes)?',
      hint: 'q = √(1/10000) = 0.01. p ≈ 0.99. 2pq ≈ 2(0.99)(0.01) ≈ 0.02 = 2%. So 1 in 50 people carries the allele while only 1 in 10000 has the disease.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
