/**
 * Grade 7 Science — Genetics: Traits and Punnett Squares.
 *
 * NGSS MS-LS3-1 / MS-LS3-2: how traits pass from parents to
 * offspring via genes; using Punnett squares to predict offspring
 * trait probabilities for a single-gene cross. Sets up the formal
 * Mendelian framework students will deepen in HS Biology.
 *
 * Source: NGSS MS-LS3, OpenStax Concepts of Biology, CK-12 Life Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_GENETICS_PUNNETT: LessonPlan = {
  id: 'evelyn.g7.science.genetics.traits-punnett.v1',
  title: 'Genetics: Traits and Punnett Squares',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'science',
  topic: 'genetics',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ls3-1',
      description: 'Develop and use a model to describe why structural changes to genes (mutations) located on chromosomes may affect proteins and may result in harmful, beneficial, or neutral effects to the structure and function of the organism.',
      standard: 'NGSS.MS-LS3-1',
    },
    {
      id: 'ngss.ms-ls3-2',
      description: 'Develop and use a model to describe why asexual reproduction results in offspring with identical genetic information and sexual reproduction results in offspring with genetic variation.',
      standard: 'NGSS.MS-LS3-2',
    },
  ],
  prerequisites: ['ngss.ms-ls1-1'],
  followUps: ['ngss.hs-ls3-1', 'ngss.hs-ls3-3'],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the puzzle of how two brown-eyed parents can have a blue-eyed child.',
      script: 'Two parents both have brown eyes. They have a baby with BLUE eyes. How is that possible? The genes for that blue color had to come from somewhere — but neither parent shows the trait. Today we\'ll figure out how.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-genes-alleles',
      kind: 'concept',
      goal: 'Genes come in pairs (alleles); some versions are dominant, others recessive. Phenotype (what you see) is set by which alleles you carry.',
      keyIdeas: [
        'GENE — a section of DNA that codes for a trait (eye color, plant height, etc.).',
        'You inherit TWO copies of every gene — one from each parent.',
        'Different versions of a gene are called ALLELES. For eye color: a "brown" allele and a "blue" allele.',
        'DOMINANT alleles SHOW UP whenever they\'re present (written as a CAPITAL letter, e.g. B).',
        'RECESSIVE alleles only show up when BOTH copies are recessive (written as lowercase, e.g. b).',
        'GENOTYPE = the alleles you carry (BB, Bb, bb). PHENOTYPE = the trait you actually display (brown eyes, blue eyes).',
        'Bb and BB both LOOK brown — but Bb can pass the b allele to children.',
      ],
      vocabulary: [
        { term: 'allele', definition: 'a version of a gene (e.g., blue version, brown version).' },
        { term: 'dominant', definition: 'an allele whose trait shows whenever it\'s present.' },
        { term: 'recessive', definition: 'an allele whose trait shows ONLY when both copies are recessive.' },
        { term: 'genotype', definition: 'the alleles a person carries (BB, Bb, bb).' },
        { term: 'phenotype', definition: 'the visible trait (brown eyes vs blue eyes).' },
        { term: 'homozygous', definition: 'two of the same allele (BB or bb).' },
        { term: 'heterozygous', definition: 'two different alleles (Bb).' },
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'concept-punnett-square',
      kind: 'concept',
      goal: 'A Punnett square is a 2×2 grid that shows every possible combination of alleles offspring can inherit from two parents.',
      keyIdeas: [
        'Write Mom\'s alleles ACROSS the top, Dad\'s alleles DOWN the side (or vice versa).',
        'Each box shows one possible combination the offspring could inherit (one allele from each parent).',
        'Count the boxes: 4 boxes = 4 possible combinations. Each is equally likely (25% each).',
        'Phenotype ratio depends on which boxes have at least one dominant allele.',
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-bb-cross-bb',
      kind: 'worked_example',
      problem: 'Two brown-eyed parents are both Bb (heterozygous). Use a Punnett square to find the chance their child has blue eyes.',
      steps: [
        'Mom: Bb. Dad: Bb. Set up the 2×2 square.',
        'Across the top: B and b (Mom\'s alleles). Down the side: B and b (Dad\'s).',
        'Fill the four boxes: BB, Bb, Bb, bb.',
        'Genotype ratio: 1 BB : 2 Bb : 1 bb.',
        'Phenotype: BB = brown, Bb = brown (B is dominant), bb = blue.',
        'So 3 out of 4 boxes are brown, 1 out of 4 is blue. Probability of blue eyes = 1/4 = 25%.',
      ],
      answer: '25% chance the child has blue eyes (1 out of 4 boxes).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In pea plants, tall (T) is dominant and short (t) is recessive. A homozygous tall plant (TT) is crossed with a heterozygous tall plant (Tt). What\'s the probability the offspring is short?',
      expectedAnswer: '0% (zero — no short offspring possible)',
      responseFormat: 'free',
      hints: [
        'Set up the 2×2 with TT on top, Tt on the side.',
        'For "short", you need TWO recessive alleles (tt). Does any box show tt?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-50-50',
      kind: 'misconception_check',
      question: 'A student says "every trait is 50/50 because each parent gives one allele." Is the offspring always 50% chance of each phenotype?',
      commonErrors: [
        {
          answer: 'Yes — always 50/50.',
          misconception: 'Confusing the parental allele contribution (one each) with offspring phenotype probability.',
          correctsTo: 'Each parent contributes ONE allele — that part is true. But the OFFSPRING\'S phenotype probability depends on the parents\' GENOTYPES. Bb × Bb → 75% brown / 25% blue, not 50/50. BB × bb → 100% brown (Bb), 0% blue.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two alleles per gene — one from each parent.',
        'Dominant always shows; recessive needs two copies to show.',
        'Punnett square = 2×2 grid of all offspring combinations.',
        'Genotype (alleles you carry) ≠ phenotype (trait you show).',
        'Heterozygous parents can produce homozygous offspring (BB or bb).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
