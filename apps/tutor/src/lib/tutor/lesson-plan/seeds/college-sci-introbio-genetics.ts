/**
 * College Intro Biology — Mendelian Genetics and Inheritance Patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_INTROBIO_GENETICS: LessonPlan = {
  id: 'evelyn.college.sci.introbio.genetics.v1',
  title: 'Intro Biology — Mendelian Genetics and Inheritance',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'intro-biology',
  locale: 'en',
  los: [
    {
      id: 'college.sci.introbio.genetics',
      description: 'Apply Mendel\'s laws (segregation, independent assortment) using Punnett squares; predict offspring ratios for monohybrid and dihybrid crosses; recognise non-Mendelian patterns.',
      standard: 'COLLEGE-INTROBIO',
    },
  ],
  prerequisites: ['college.sci.introbio.cells'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mendel\'s pea-plant ratios are the foundation of all genetics — and they predict human disease inheritance just as well.',
      script: 'When two carriers of a recessive disease allele have a child, what\'s the probability the child has the disease? 1/4. That ratio is straight from Mendel. Today we cover monohybrid and dihybrid crosses, then the most common non-Mendelian patterns (codominance, incomplete dominance, X-linked).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mendel',
      kind: 'concept',
      goal: 'Vocabulary, Mendel\'s laws, Punnett squares, dihybrid 9:3:3:1, non-Mendelian patterns.',
      keyIdeas: [
        'GENE = unit of heredity. ALLELE = one variant of a gene. GENOTYPE = the genetic makeup (e.g. Aa). PHENOTYPE = the observable trait.',
        'HOMOZYGOUS = two identical alleles (AA or aa). HETEROZYGOUS = two different (Aa).',
        'DOMINANT allele (A) masks the recessive (a) in heterozygotes. Dominant phenotype expressed when at least one A is present.',
        'MENDEL\'S 1ST LAW (Segregation): each parent passes ONE of their two alleles to each gamete, randomly.',
        'MENDEL\'S 2ND LAW (Independent Assortment): alleles for different genes segregate independently — UNLESS they\'re linked on the same chromosome.',
        'MONOHYBRID CROSS Aa × Aa: Punnett gives 1 AA : 2 Aa : 1 aa genotype, 3 dominant : 1 recessive phenotype.',
        'DIHYBRID CROSS AaBb × AaBb: 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb phenotype ratio (the 9:3:3:1 ratio).',
        'TEST CROSS: cross unknown × homozygous recessive. Reveals genotype from offspring ratios.',
        'NON-MENDELIAN PATTERNS:',
        '  CODOMINANCE: both alleles fully expressed (e.g. ABO blood: AB type shows both A and B antigens).',
        '  INCOMPLETE DOMINANCE: heterozygote is INTERMEDIATE (red × white snapdragons → pink).',
        '  X-LINKED: gene on X chromosome. Recessive disorders (haemophilia, colour-blindness) more common in males (only one X).',
        '  MULTIPLE ALLELES: more than 2 versions exist in the population (ABO has I^A, I^B, i).',
        '  POLYGENIC: trait controlled by many genes (height, skin colour). Continuous variation.',
        '  EPISTASIS: one gene masks expression of another (e.g. coat colour in Labradors).',
      ],
      vocabulary: [
        { term: 'allele', definition: 'one specific version of a gene; alleles can be dominant, recessive, or codominant relative to each other.' },
        { term: 'Punnett square', definition: 'a diagram showing all possible offspring genotype combinations from a cross.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'In humans, having dimples (D) is dominant over no dimples (d). Two parents with dimples (both heterozygous) have a child. What is the probability the child has dimples?',
      steps: [
        'Cross: Dd × Dd.',
        'Punnett square: DD, Dd, Dd, dd. (4 boxes from 2×2.)',
        'Genotype ratio: 1 DD : 2 Dd : 1 dd.',
        'Phenotype: DD and Dd both have dimples (dominant). dd does not.',
        'P(dimples) = 3/4 = 75%. P(no dimples) = 1/4 = 25%.',
      ],
      answer: 'P(dimples) = 75%',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In snapdragons, RR = red, Rr = pink, rr = white (incomplete dominance). What ratio of phenotypes results from Rr × Rr?',
      expectedAnswer: 'Punnett: RR, Rr, Rr, rr → 1 RR : 2 Rr : 1 rr. Incomplete dominance means each genotype has its own phenotype: 1 red : 2 pink : 1 white.',
      responseFormat: 'free',
      hints: [
        'Incomplete dominance gives 3 distinct phenotypes, not just 2.',
        'The genotype ratio matches the phenotype ratio.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-mendel-everywhere',
      kind: 'misconception_check',
      question: 'A student assumes 3:1 phenotype ratio for every monohybrid cross. Why is this not always true?',
      commonErrors: [
        {
          answer: 'Always 3:1',
          misconception: 'Treating Mendelian dominance as universal.',
          correctsTo: '3:1 only applies when ONE allele is fully dominant. With INCOMPLETE DOMINANCE, you get 1:2:1 (three phenotypes). With CODOMINANCE, also 1:2:1 with both alleles expressed in heterozygotes. With X-LINKED, ratios depend on parental genotypes AND child sex. Always identify the inheritance pattern FIRST before predicting ratios.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mendel: segregation + independent assortment.',
        'Aa × Aa → 1:2:1 genotype, 3:1 phenotype (full dominance).',
        'Dihybrid AaBb × AaBb → 9:3:3:1 phenotype.',
        'Non-Mendelian: incomplete dominance, codominance, X-linked, polygenic.',
        'Identify pattern before predicting ratios.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
