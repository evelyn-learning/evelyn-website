/**
 * College Intro — Intro Biology (Bio 101).
 *
 * Cell, central dogma, evolution, ecology — at a college depth.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_INTRO_BIOLOGY: LessonPlan = {
  id: 'evelyn.college.intro-biology.v1',
  title: 'Intro biology — cells, central dogma, evolution, ecology',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'intro-biology',
  locale: 'en',
  los: [
    {
      id: 'college.bio',
      description: 'Connect cellular machinery, molecular biology, evolutionary mechanisms, and ecological dynamics.',
      standard: 'COLLEGE-BIO',
    },
  ],
  prerequisites: ['hsbio.anchors'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Bio 101 as zooming in on the HS anchors.',
      script: 'High school biology gave you the five anchors. College biology zooms in on each: cells become organelles + molecular machines, central dogma becomes specific enzymes and steps, evolution becomes population genetics with equations. Same questions, more resolution.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-bio101',
      kind: 'concept',
      goal: 'Cell biology + central dogma + population genetics + ecology.',
      keyIdeas: [
        'CELLULAR MACHINERY: ribosomes (protein synthesis), mitochondria (ATP via oxidative phosphorylation), chloroplasts (photosynthesis), ER + Golgi (protein processing/secretion), cytoskeleton (shape + transport).',
        'CENTRAL DOGMA: DNA → mRNA (transcription) → protein (translation). Promoters, RNA polymerase, ribosomes, codons, tRNA. Mutations classified: silent / missense / nonsense / frameshift.',
        'GENE REGULATION: cells with the same genome express different proteins because of transcription factors, methylation, miRNA. Differentiation = stable expression patterns.',
        'POPULATION GENETICS: Hardy-Weinberg equilibrium p² + 2pq + q² = 1 describes allele frequencies under no-selection assumption. Deviations diagnose selection, drift, migration, mutation, non-random mating.',
        'NATURAL SELECTION: directional, stabilizing, disruptive. Selection coefficient measures fitness difference. Selection acts on PHENOTYPES; evolution happens to GENOTYPE FREQUENCIES.',
        'ECOLOGY: populations grow exponentially when resources are abundant (dN/dt = rN); logistically when limited (dN/dt = rN(1 - N/K)). Communities have niches; ecosystems cycle nutrients.',
        'BIODIVERSITY: alpha (within site), beta (between sites), gamma (regional). Mass extinctions reset patterns; humans drive the current sixth.',
      ],
      vocabulary: [
        { term: 'central dogma', definition: 'DNA → RNA → protein, the standard flow of genetic information.' },
        { term: 'allele frequency', definition: 'the fraction of a population\'s gene copies that are a particular allele.' },
        { term: 'carrying capacity (K)', definition: 'the maximum population size an environment can sustain long-term.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-hardyweinberg',
      kind: 'worked_example',
      problem: 'In a population of 100 plants, 16 are homozygous recessive (q² = 16/100 = 0.16). What is the allele frequency of the dominant allele, p?',
      steps: [
        'q² = 0.16 → q = 0.4 (recessive allele frequency).',
        'p + q = 1 → p = 1 - 0.4 = 0.6 (dominant allele frequency).',
        'Predicted genotypes if in HW equilibrium:',
        '  p² (homozygous dominant) = 0.36 → 36 plants',
        '  2pq (heterozygous) = 0.48 → 48 plants',
        '  q² (homozygous recessive) = 0.16 → 16 plants. Total 100.',
        'Departures from these expectations diagnose evolutionary forces.',
      ],
      answer: 'p = 0.6',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A point mutation changes a codon from GCA (Ala) to GCG (Ala). What kind of mutation is this and what\'s the consequence?',
      expectedAnswer: 'silent mutation — same amino acid encoded, no protein change',
      responseFormat: 'free',
      hints: [
        'Look up the genetic code: GCA and GCG both code for alanine.',
        'A mutation that doesn\'t change the protein has a name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fitness',
      kind: 'misconception_check',
      question: 'A student says: "The fittest organism is the strongest." Why is that wrong in evolutionary biology?',
      commonErrors: [
        {
          answer: 'because strongest wins',
          misconception: 'Conflating colloquial "fitness" with reproductive success.',
          correctsTo: 'Fitness in evolution = REPRODUCTIVE SUCCESS, not strength or speed. A small parasite that lays millions of eggs has higher fitness than a strong predator with few offspring. Selection favors traits that increase the number of viable descendants in the local environment, not generic "strength". Peacocks have ridiculous tails because females prefer them — fitness = mate selection too.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Organelles are specialized — match function to structure.',
        'Central dogma: DNA → RNA → protein, with regulation at each step.',
        'Hardy-Weinberg: null model; deviations diagnose evolution.',
        'Fitness = reproductive success in current environment.',
        'Logistic growth: dN/dt = rN(1 - N/K).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
