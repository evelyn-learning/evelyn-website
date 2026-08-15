/**
 * Biology — Mendelian Genetics: Monohybrid Crosses & Punnett Squares.
 *
 * The problem-heavy template for the HS Biology fan-out (NGSS HS-LS3-3).
 * Quantitative genetics without numeric response items: ratios like 3:1 and
 * probabilities like 1/4 have too many valid spellings to grade by exact
 * match, so every check is an MCQ whose distractors are the classic
 * genotype/phenotype confusions.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U5_PUNNETT_SQUARES_MONOHYBRID: LessonPlan = {
  id: 'evelyn.hs.bio.punnett-squares-monohybrid.v1',
  title: 'Monohybrid Crosses & Punnett Squares',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.punnett-squares-monohybrid',
      standard: 'BIO-5.2',
      description:
        'Predict the genotypic and phenotypic ratios of offspring from a one-trait cross using a Punnett square, and interpret those ratios as probabilities for any single offspring (NGSS HS-LS3-3).',
    },
  ],
  prerequisites: ['bio.mendel-laws'],
  followUps: ['bio.dihybrid-crosses'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Punnett square as a prediction tool used in real breeding and genetic counseling.',
      script:
        'Two brown-eyed parents have a blue-eyed child, and everyone is surprised — but a genetic counselor would have told them there was a one-in-four chance. Farmers use the same grid to plan a disease-resistant wheat crop, and dog breeders use it to avoid an inherited heart defect. The Punnett square is a four-box grid that turns two parents into the odds for their offspring, and by the end of this lesson you will build one in under a minute.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-punnett-mechanics',
      kind: 'concept',
      goal: 'Genotype vs phenotype, the gamete rule, building the grid, and reading ratios as probabilities.',
      keyIdeas: [
        'GENOTYPE VS PHENOTYPE — the GENOTYPE is the allele pair an organism carries (RR, Rr, or rr); the PHENOTYPE is the trait you can observe (round or wrinkled). Different genotypes can share one phenotype: RR and Rr both look round.',
        'THE THREE GENOTYPES — homozygous dominant (RR), heterozygous (Rr), homozygous recessive (rr). A recessive phenotype appears ONLY as rr, because a single dominant allele masks the recessive one.',
        "THE GAMETE RULE — each parent gives exactly ONE allele per trait, chosen at random (Mendel's law of segregation). Rr makes two kinds of gamete, R and r, in equal numbers; RR makes only R.",
        "BUILDING THE SQUARE — write one parent's two gamete types across the top, the other parent's down the side, then fill each box by combining its row and column letters. Write the dominant (capital) letter first: Rr, never rR.",
        'THE SIGNATURE CROSS — Rr × Rr gives boxes RR, Rr, Rr, rr: a GENOTYPE ratio of 1:2:1 and a PHENOTYPE ratio of 3:1 dominant to recessive. Memorize that these two ratios are different answers to different questions.',
        'RATIOS ARE PROBABILITIES, NOT QUOTAS — 3:1 means each offspring independently has a 3/4 chance of the dominant phenotype. It does NOT promise that 4 offspring will split 3 and 1; four recessive puppies in a row is unlikely but perfectly possible.',
        'THE TEST CROSS — to find whether a dominant-looking organism is RR or Rr, cross it with rr. Any recessive offspring proves the unknown parent was Rr, because that offspring needed an r from each parent.',
      ],
      vocabulary: [
        { term: 'genotype', definition: 'the pair of alleles an organism carries for a trait, written as two letters.' },
        { term: 'phenotype', definition: 'the observable trait that results from the genotype.' },
        { term: 'heterozygous', definition: 'carrying two different alleles for a trait, such as Rr.' },
      ],
      suggestedTools: ['show_punnett', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-heterozygous-cross',
      kind: 'worked_example',
      problem:
        'In pea plants, round seeds (R) are dominant to wrinkled seeds (r). Cross two heterozygous plants (Rr × Rr). Give the genotype ratio and the phenotype ratio of the offspring.',
      steps: [
        "Find each parent's gametes: an Rr parent makes R and r in equal numbers. Both parents do, so the grid is R and r across the top, R and r down the side.",
        'Fill the four boxes: top-left R+R = RR, top-right R+r = Rr, bottom-left r+R = Rr, bottom-right r+r = rr.',
        'Count genotypes: one RR, two Rr, one rr — a genotype ratio of 1:2:1.',
        'Translate to phenotypes: RR and both Rr plants show round (3 boxes); only rr shows wrinkled (1 box) — a phenotype ratio of 3:1 round to wrinkled.',
      ],
      answer: 'Genotype ratio 1:2:1 (RR : Rr : rr); phenotype ratio 3:1 (round : wrinkled)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-test-cross',
      kind: 'worked_example',
      problem:
        'A black guinea pig (black, B, is dominant to white, b) has an unknown genotype — it could be BB or Bb. It is crossed with a white guinea pig, and the litter contains some white offspring. What is the black parent\'s genotype, and how do you know?',
      steps: [
        'Write what is certain: white is the recessive phenotype, so the white parent must be bb, and any white offspring must also be bb.',
        'A bb offspring needs one b from each parent. The white parent supplies one b; the other b must have come from the black parent.',
        'So the black parent carries a b allele. Since it looks black, it also carries B — its genotype is Bb.',
        'Check by building the cross Bb × bb: the boxes are Bb, Bb, bb, bb — half black, half white, which matches a litter containing white offspring. (Had the parent been BB, every box would read Bb and no white offspring could appear.)',
      ],
      answer: 'Bb — a single white (bb) offspring proves the black parent carried a recessive b allele.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-genotype-ratio',
      kind: 'try_yourself',
      problem:
        'In pea plants, tall (T) is dominant to short (t). Two heterozygous tall plants are crossed (Tt × Tt). What is the GENOTYPE ratio of the offspring?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1 TT : 2 Tt : 1 tt', correct: true },
        { id: 'b', text: '3 tall : 1 short' },
        { id: 'c', text: '1 TT : 1 tt' },
        { id: 'd', text: 'All Tt' },
      ],
      expectedAnswer: '1 TT : 2 Tt : 1 tt',
      hints: [
        'The question asks for GENOTYPES (letter pairs), not phenotypes (tall or short).',
        'Fill the four boxes of a Tt × Tt square and count how many of each letter pair appear.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-probability',
      kind: 'try_yourself',
      problem:
        'In a cross of Rr × rr, what is the probability that any one offspring shows the recessive phenotype?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/4' },
        { id: 'b', text: '3/4' },
        { id: 'c', text: '1/2', correct: true },
        { id: 'd', text: '0' },
      ],
      expectedAnswer: '1/2',
      hints: [
        'The Rr parent makes R and r gametes; the rr parent makes only r gametes.',
        'The four boxes come out Rr, Rr, rr, rr — count how many show the recessive phenotype.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parents-from-offspring',
      kind: 'try_yourself',
      problem:
        'Two black-furred mice (black, B, dominant to brown, b) produce a litter that includes one brown pup. What must the genotypes of BOTH parents be?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both parents are BB' },
        { id: 'b', text: 'Both parents are Bb', correct: true },
        { id: 'c', text: 'One parent is BB and the other is bb' },
        { id: 'd', text: 'Both parents are bb' },
      ],
      expectedAnswer: 'Both parents are Bb',
      hints: [
        'A brown pup is bb, so it received one b allele from each parent.',
        'Each parent looks black but must carry a b — so each parent is heterozygous.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ratio-as-quota',
      kind: 'misconception_check',
      question:
        'A student says: "In an Rr × Rr cross the ratio is 3:1, so if a plant has exactly 4 offspring, 3 will be round and 1 will be wrinkled." What went wrong?',
      commonErrors: [
        {
          answer: 'Exactly 3 round and 1 wrinkled out of 4 offspring',
          misconception: 'Treating a predicted ratio as a guaranteed count in a small sample rather than as a per-offspring probability.',
          correctsTo:
            'Each offspring independently has a 3/4 chance of being round — fertilization does not keep a tally. Four offspring could easily come out 4 round, or 2 and 2. The 3:1 ratio only emerges reliably across large numbers of offspring.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Genotype = the allele pair (RR, Rr, rr); phenotype = the observable trait. RR and Rr look the same.',
        'Each parent contributes one allele per trait; a heterozygote makes two gamete types in equal numbers.',
        'Rr × Rr → genotype ratio 1:2:1 and phenotype ratio 3:1 — two different answers, so read the question.',
        'The recessive phenotype appears only in rr individuals.',
        'Ratios are probabilities per offspring, not quotas for a litter. A test cross with rr reveals a hidden recessive allele.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Monohybrid Crosses & Punnett Squares' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
