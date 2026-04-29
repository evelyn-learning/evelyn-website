/**
 * HS Biology — Mendelian Genetics.
 * NGSS HS-LS3-3: Mendel's laws; predicting offspring traits.
 */

import type { LessonPlan } from '../types';

export const SEED_BIO_MENDELIAN_GENETICS: LessonPlan = {
  id: 'evelyn.hs.science.biology.mendelian-genetics.v1',
  title: 'Mendelian Genetics',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.hs-ls3-3', description: 'Apply concepts of statistics and probability to explain the variation and distribution of expressed traits in a population.', standard: 'NGSS.HS-LS3-3' }],
  prerequisites: ['ngss.ms-ls3-1'], followUps: [], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in Mendel\'s pea experiments.', script: 'Mendel grew thousands of pea plants in a monastery garden in the 1860s. By patient counting, he discovered the FOUNDATIONAL rules of inheritance — long before anyone knew about DNA.', estimatedMinutes: 2 },
    { id: 'concept-mendel-laws', kind: 'concept', goal: 'Mendel\'s laws: segregation + independent assortment + dominance.', keyIdeas: [
      'TRAITS controlled by GENES, with two ALLELES per gene (one from each parent).',
      'LAW OF SEGREGATION: alleles separate during gamete formation. Each gamete gets ONE allele.',
      'LAW OF INDEPENDENT ASSORTMENT: different genes assort independently (mostly — except linked genes).',
      'LAW OF DOMINANCE: dominant alleles mask recessive in heterozygotes.',
      'GENOTYPE: alleles carried (TT, Tt, tt). PHENOTYPE: trait expressed (tall vs short).',
      'HOMOZYGOUS: same alleles (TT or tt). HETEROZYGOUS: different (Tt).',
    ], vocabulary: [{ term: 'allele', definition: 'a version of a gene.' }, { term: 'genotype', definition: 'genetic makeup.' }, { term: 'phenotype', definition: 'observable trait.' }, { term: 'dominant/recessive', definition: 'whether the allele\'s trait shows in heterozygote.' }], estimatedMinutes: 5 },
    { id: 'concept-monohybrid-dihybrid', kind: 'concept', goal: 'Monohybrid (1 trait) → Punnett square gives 3:1 phenotype ratio for Aa×Aa. Dihybrid (2 traits) → 9:3:3:1.', keyIdeas: [
      'MONOHYBRID CROSS (Aa × Aa): genotypes 1 AA : 2 Aa : 1 aa → phenotypes 3 dominant : 1 recessive.',
      'DIHYBRID CROSS (AaBb × AaBb): two-gene Punnett (4×4 = 16 squares) → 9:3:3:1 phenotype ratio.',
      'TEST CROSS: cross unknown genotype to homozygous recessive (aa). If any recessive offspring → unknown was Aa.',
      'INCOMPLETE DOMINANCE: heterozygote shows blend (red × white → pink).',
      'CODOMINANCE: both alleles fully expressed (AB blood type).',
      'SEX-LINKED: genes on X chromosome show different patterns in males vs females (color blindness).',
    ], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'worked-dihybrid', kind: 'worked_example', problem: 'In peas, yellow (Y) is dominant over green (y); round (R) is dominant over wrinkled (r). Cross YyRr × YyRr. What\'s the phenotype ratio?', steps: [
      '4×4 Punnett of YR/Yr/yR/yr × YR/Yr/yR/yr.',
      'Each box has one allele combination. 16 boxes total.',
      'Count phenotypes:',
      '  · Yellow + Round: 9',
      '  · Yellow + wrinkled: 3',
      '  · green + Round: 3',
      '  · green + wrinkled: 1',
      'Ratio 9:3:3:1.',
    ], answer: '9 yellow-round : 3 yellow-wrinkled : 3 green-round : 1 green-wrinkled.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Two parents both have heterozygous brown eyes (Bb), where brown (B) is dominant. What\'s the probability their next child has blue eyes (bb)?', expectedAnswer: '25% (1/4). The Bb × Bb cross gives 1 BB : 2 Bb : 1 bb in genotype, so 1/4 chance of bb (blue).', responseFormat: 'free', hints: ['Set up the 2x2 Punnett square.', 'Count the bb boxes out of 4.'], estimatedMinutes: 3 },
    { id: 'misconception-dominant-more-common', kind: 'misconception_check', question: 'A friend says "dominant alleles are always more common in a population." True?', commonErrors: [{ answer: 'Yes — dominant = common.', misconception: 'Conflating dominance with frequency.', correctsTo: '"Dominant" describes how an allele behaves in a heterozygote — NOT its frequency. Some recessive alleles are very common (e.g., the red hair allele is recessive but common in some populations). Some dominant alleles are rare (e.g., Huntington\'s disease).' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Mendel: segregation + independent assortment + dominance.', 'Monohybrid Aa×Aa → 3:1.', 'Dihybrid AaBb×AaBb → 9:3:3:1.', 'Dominant ≠ common.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
