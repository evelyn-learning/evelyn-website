/**
 * NEET Biology — Principles of Inheritance and Variation.
 *
 * Class 12 NCERT chapter. ~5-7 NEET questions per sitting.
 * Mendel\'s laws, Punnett squares, sex-linked traits, blood groups.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_BIO_GENETICS: LessonPlan = {
  id: 'evelyn.testprep.neet.bio.genetics.v1',
  title: 'NEET Biology — Principles of Inheritance and Variation',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-biology',
  locale: 'en',
  los: [
    {
      id: 'neet.bio.genetics',
      description: 'Apply Mendel\'s laws via Punnett squares for monohybrid + dihybrid crosses, predict outcomes for sex-linked traits, and identify ABO blood-group inheritance.',
      standard: 'NEET-BIO-GEN',
    },
  ],
  prerequisites: ['neet.bio-cell-biology'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mendelian genetics is one of the highest-yield NEET topics.',
      script: 'Punnett-square problems are NEET\'s gift — once you can set them up, the answer falls out in 30 seconds. Mendel\'s pea plant experiments give us the rules; sex-linked traits and ABO blood groups apply them to humans. Most NEET genetics questions use the same handful of crosses repackaged.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mendel',
      kind: 'concept',
      goal: 'Mendel\'s laws + Punnett-square mechanics.',
      keyIdeas: [
        'MENDEL\'S 7 PEA TRAITS: seed shape (round/wrinkled), seed color (yellow/green), pod shape (full/constricted), pod color (green/yellow), flower color (purple/white), flower position (axial/terminal), plant height (tall/dwarf). The dominant trait is listed first.',
        'LAW OF SEGREGATION: each gamete carries ONE allele of each gene; pairs separate during meiosis. Heterozygote Aa → gametes are 50% A, 50% a.',
        'LAW OF INDEPENDENT ASSORTMENT: alleles of DIFFERENT genes assort independently (only true for genes on different chromosomes or far apart on same chromosome).',
        'MONOHYBRID CROSS: Aa × Aa → 1 AA : 2 Aa : 1 aa (genotype) = 3 dominant : 1 recessive (phenotype).',
        'DIHYBRID CROSS: AaBb × AaBb → 9:3:3:1 phenotype ratio (9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb).',
        'TEST CROSS: cross unknown dominant phenotype with homozygous recessive (aa). If all offspring dominant → unknown was AA. If 1:1 dominant:recessive → unknown was Aa.',
        'INCOMPLETE DOMINANCE: heterozygote shows intermediate phenotype (red × white snapdragon → pink Aa).',
        'CODOMINANCE: both alleles expressed (ABO blood: AB type shows both A and B antigens).',
        'MULTIPLE ALLELES: more than 2 alleles in the population at a single locus (ABO has I^A, I^B, i — three alleles, four blood types).',
        'PLEIOTROPY: one gene affects multiple traits (e.g., sickle-cell — one gene → anemia + malaria resistance + organ damage).',
        'CHI-SQUARE TEST verifies whether observed ratios match expected. NEET sometimes asks the formula: χ² = Σ((O−E)²/E).',
      ],
      vocabulary: [
        { term: 'allele', definition: 'one of multiple variant forms of a gene at a chromosomal locus.' },
        { term: 'heterozygote', definition: 'an organism with two different alleles at a locus (e.g., Aa).' },
        { term: 'pleiotropy', definition: 'one gene affecting multiple unrelated phenotypic traits.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'concept-sex-linked',
      kind: 'concept',
      goal: 'Sex-linked inheritance (X-linked recessive disorders).',
      keyIdeas: [
        'In humans: XX = female, XY = male. X chromosome is large + carries many genes; Y is small + carries few (mostly sex-determination, e.g., SRY).',
        'X-LINKED RECESSIVE example: hemophilia, color blindness, Duchenne muscular dystrophy. Carrier mothers (X^H X^h) pass affected X to half their sons (X^h Y → affected). Affected fathers (X^h Y) cannot pass it to sons (sons get Y from dad).',
        'CARRIER MOTHER × NORMAL FATHER (X^H X^h × X^H Y): daughters → 50% X^H X^H normal, 50% X^H X^h carrier (none affected). Sons → 50% X^H Y normal, 50% X^h Y AFFECTED.',
        'AFFECTED MOTHER × NORMAL FATHER (X^h X^h × X^H Y): all daughters carriers, all sons affected.',
        'X-LINKED DOMINANT (rare): affected father passes to ALL daughters (they get his X) but NO sons. Mother → 50:50 to either sex.',
        'Y-LINKED (very rare): father → all sons, no daughters.',
        'NEET FAVORITE TRAP: a girl with hemophilia must have an affected father AND a carrier or affected mother (homozygous X^h X^h). Pure carrier mom × normal dad cannot produce affected daughters.',
      ],
      vocabulary: [
        { term: 'carrier', definition: 'a heterozygote (e.g., X^H X^h) who does not show the recessive trait but can pass it on.' },
        { term: 'X-linked recessive', definition: 'a trait whose recessive allele lies on the X chromosome; affects males much more than females.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-dihybrid',
      kind: 'worked_example',
      problem: 'In pea plants, yellow seed color (Y) is dominant over green (y), and round seed shape (R) is dominant over wrinkled (r). Cross YyRr × YyRr. What fraction of offspring is green AND wrinkled?',
      steps: [
        'Use independent assortment: each gene\'s outcome is independent.',
        'For seed color (Yy × Yy): green (yy) = 1/4.',
        'For seed shape (Rr × Rr): wrinkled (rr) = 1/4.',
        'Combined probability (multiply, since independent): 1/4 × 1/4 = 1/16.',
        'Equivalent to the "1" in the 9:3:3:1 ratio (9 yellow round : 3 yellow wrinkled : 3 green round : 1 green wrinkled).',
      ],
      answer: '1/16',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A man with blood group AB marries a woman with blood group O. What blood groups can their children have?',
      expectedAnswer: 'A and B (no O, no AB). Father is I^A I^B, mother is ii. Children get I^A or I^B from dad, i from mom → I^A i (group A) or I^B i (group B). 50:50 ratio.',
      responseFormat: 'free',
      hints: [
        'Father is I^A I^B (codominance), mother is ii.',
        'Each child inherits one allele from each parent.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-y-linked',
      kind: 'misconception_check',
      question: 'Color blindness is X-linked recessive. So an affected father will pass it to all his sons. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing X-linked with Y-linked inheritance.',
          correctsTo: 'False. An affected father (X^c Y) gives sons his Y chromosome, NOT his X. So his sons get the colorblind allele from their MOTHER (if she\'s a carrier or affected), not from him. Affected fathers DO pass X^c to all daughters (who become carriers if mom is normal). The "father → son" pattern would be Y-linked, not X-linked. NEET loves this trap.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mendel: segregation + independent assortment. Aa × Aa → 3:1; AaBb × AaBb → 9:3:3:1.',
        'Test cross with aa reveals AA vs Aa.',
        'X-linked recessive: carrier mom + normal dad → affected sons but no affected daughters. Affected dad passes to daughters (carriers), not sons.',
        'ABO: 3 alleles (I^A, I^B, i). I^A and I^B codominant; i recessive.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A pedigree shows two unaffected parents producing one affected child. What inheritance patterns are CONSISTENT with this? Which are RULED OUT?',
      hint: 'Two unaffected parents producing affected child rules OUT autosomal dominant (one affected parent would be required) and X-linked dominant. Consistent with: autosomal recessive (both parents carriers), X-linked recessive (mother carrier, child male). Without more info you can\'t distinguish autosomal from X-linked recessive — additional family or sex-of-affected info is needed.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
