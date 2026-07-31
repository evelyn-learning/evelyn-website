/**
 * Biology — Non-Mendelian Inheritance: Incomplete Dominance, Codominance &
 * Multiple Alleles.
 *
 * Follows the monohybrid-Punnett lesson in the same unit (NGSS HS-LS3-1).
 * The whole lesson turns on ONE discrimination — is the heterozygote a new
 * intermediate (blend) or both parental traits showing at once? — so the
 * concept segment is organized around that test, and every check is an MCQ
 * whose distractors are the classic blend/codominance mix-ups.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U5_NON_MENDELIAN_INHERITANCE: LessonPlan = {
  id: 'evelyn.hs.bio.non-mendelian-inheritance.v1',
  title: 'Incomplete Dominance, Codominance & Multiple Alleles',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.non-mendelian-inheritance',
      standard: 'BIO-5.4',
      description:
        'Predict and explain offspring phenotypes for traits that break simple dominance — incomplete dominance, codominance, multiple-allele systems such as ABO blood type, and polygenic traits (NGSS HS-LS3-1).',
    },
  ],
  prerequisites: ['bio.dihybrid-crosses'],
  followUps: ['bio.pedigrees-human-genetics'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame non-Mendelian inheritance through two stakes students already care about: a transfusion that must match, and a flower color that cannot be bred true.',
      script:
        'A patient arrives in an emergency room needing blood, and the wrong bag can kill them — so before anything else, a lab types their blood as A, B, AB, or O. Notice that AB: this person expresses BOTH parents\' blood proteins at full strength, with no dominant one winning. Meanwhile a plant breeder crosses a red snapdragon with a white one and gets a whole bed of PINK flowers — and no matter how many times she plants pink with pink, she can never get pink to breed true. Neither result fits the dominant-masks-recessive rule you already know. Today you learn the two patterns that explain both, and the one question that tells them apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-beyond-simple-dominance',
      kind: 'concept',
      goal: 'Incomplete dominance vs codominance, the discrimination test between them, superscript allele notation, the ABO multiple-allele system, and polygenic continuous variation.',
      keyIdeas: [
        'COMPLETE DOMINANCE IS ONLY ONE OPTION — in a simple Mendelian trait, one allele fully masks the other, so Rr and RR look identical and the recessive phenotype hides. Several real traits do NOT work that way: the heterozygote looks like neither parent, or like both at once.',
        'INCOMPLETE DOMINANCE — neither allele fully masks the other, so the heterozygote shows a NEW intermediate phenotype, a blend. Red snapdragons (C^R C^R) crossed with white snapdragons (C^W C^W) give all pink offspring (C^R C^W). Think of it as half the red pigment: enough to tint, not enough to be red.',
        'CODOMINANCE — both alleles are expressed FULLY and separately at the same time, side by side, with no blending. Roan cattle (C^R C^W) are not pink: their coat carries individual red hairs and individual white hairs mixed together, and a hair-by-hair look shows each one is fully red or fully white. Human AB blood type is the same idea — both the A protein and the B protein sit on the red blood cells at full strength.',
        'THE ONE QUESTION THAT TELLS THEM APART — look only at the heterozygote and ask: is this a NEW third appearance (incomplete dominance), or are BOTH parental traits present at once and still distinguishable (codominance)? Pink is a color neither parent had → incomplete. Roan and AB show both originals unchanged → codominant.',
        'SUPERSCRIPT NOTATION — capital-versus-lowercase means "this one wins", so it is the wrong tool when neither allele wins. Instead write one letter for the GENE and a superscript for the ALLELE version: C^R and C^W are two co-equal alleles of the coat-color gene C. Read C^R C^W aloud as "C-superscript-R, C-superscript-W".',
        'RATIOS CHANGE: 1:2:1 FOR BOTH — because nothing is hidden in these systems, every genotype has its own visible phenotype, so the GENOTYPE ratio and the PHENOTYPE ratio become the same. Pink × pink (C^R C^W × C^R C^W) gives C^R C^R, C^R C^W, C^R C^W, C^W C^W → 1 red : 2 pink : 1 white, a phenotype ratio of 1:2:1. The familiar 3:1 never appears here, which is why pink can never breed true.',
        'MULTIPLE ALLELES — ABO BLOOD TYPE — a gene can have more than two allele versions in a POPULATION, even though any one person still carries exactly TWO. The ABO gene has three: I^A, I^B, and i. I^A and I^B are codominant with each other, and both are completely dominant over i. That gives six genotypes and only four phenotypes: type A is I^A I^A or I^A i; type B is I^B I^B or I^B i; type AB is I^A I^B; type O is ii and ONLY ii, because a single I^A or I^B would show.',
        'POLYGENIC TRAITS ARE A DIFFERENT THING — multiple alleles means many versions of ONE gene; polygenic means MANY GENES contribute to one trait. Human height and skin color are polygenic: dozens of genes each add a small amount, so instead of a few discrete categories you get CONTINUOUS variation — a smooth range with most people near the middle. That is why height comes as a spectrum, not as "tall or short".',
      ],
      vocabulary: [
        { term: 'incomplete dominance', definition: 'inheritance in which the heterozygote shows a new intermediate phenotype, such as a pink snapdragon from red and white parents.' },
        { term: 'codominance', definition: 'inheritance in which both alleles are fully and separately expressed in the heterozygote, such as roan cattle or type AB blood.' },
        { term: 'multiple alleles', definition: 'a gene with more than two allele versions in the population, though any individual still carries only two — for example I^A, I^B and i.' },
        { term: 'polygenic trait', definition: 'a trait controlled by many genes at once, producing continuous variation rather than discrete categories.' },
      ],
      suggestedTools: ['show_punnett', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-blood-type-cross',
      kind: 'worked_example',
      problem:
        'In the ABO system there are three alleles: I^A and I^B, which are codominant with each other, and i, which is recessive to both. A woman has type A blood with the genotype I^A i. She has children with a man who has type B blood with the genotype I^B i. Which blood types are possible in their children, and in what ratio?',
      steps: [
        'List each parent\'s gametes. Every parent gives ONE allele. The mother (I^A i) makes I^A and i gametes in equal numbers; the father (I^B i) makes I^B and i gametes in equal numbers.',
        'Fill the four boxes: I^A with I^B → I^A I^B; I^A with i → I^A i; i with I^B → I^B i; i with i → ii.',
        'Translate each genotype into a phenotype using the dominance rules. I^A I^B expresses both proteins at once → type AB. I^A i has one dominant I^A masking i → type A. I^B i likewise → type B. ii has no A or B protein at all → type O.',
        'Count: one box each. All four blood types are possible, in a 1:1:1:1 ratio — each child independently has a 1/4 chance of any one of them.',
        'Sanity check on the surprise: neither parent is type O, yet a type O child is possible, because each parent quietly carries one i allele. Type O appears ONLY as ii, so both i alleles had to come from somewhere — one from each parent.',
      ],
      answer: 'Type AB, A, B and O are all possible, in a 1:1:1:1 ratio (I^A I^B, I^A i, I^B i, ii).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-incomplete-vs-codominant',
      kind: 'worked_example',
      problem:
        'Classify each of these two crosses as incomplete dominance or codominance, and justify the call. (1) A red-flowered snapdragon (C^R C^R) crossed with a white-flowered snapdragon (C^W C^W) gives offspring whose petals are uniformly pink from edge to edge. (2) A red-coated bull (C^R C^R) crossed with a white-coated cow (C^W C^W) gives calves whose coats look pinkish from a distance, but under close inspection each individual hair is either fully red or fully white, with no pink hairs anywhere.',
      steps: [
        'Set both crosses up the same way. Each parent is homozygous, so every offspring in both crosses is the heterozygote C^R C^W. The genotypes are identical — only the appearance differs, so the appearance is what decides the classification.',
        'Apply the one question to cross 1: is pink a new third appearance, or both parental colors at once? Every cell of the petal makes the same intermediate pigment level, so the flower is a color neither parent had. That is a BLEND → incomplete dominance.',
        'Apply the same question to cross 2: the "pink" is an illusion of distance. Zoom in and each hair is fully red or fully white — both parental phenotypes are present at once and still distinguishable. Nothing blended → codominance.',
        'State the general rule this illustrates: do not judge by the whole-organism impression, judge at the level where the trait is actually expressed. Per-hair and per-cell detail is what separates a true blend from a fine-grained mosaic of both alleles.',
        'Note what the two crosses share: in BOTH systems no phenotype is hidden, so crossing two heterozygotes gives 1:2:1 either way — 1 red : 2 pink : 1 white for the snapdragons, 1 red : 2 roan : 1 white for the cattle.',
      ],
      answer: 'Cross 1 is incomplete dominance (a genuinely new intermediate color); cross 2 is codominance (roan — both alleles fully expressed as separate red and white hairs).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-incomplete-ratio',
      kind: 'try_yourself',
      problem:
        'In snapdragons, flower color shows incomplete dominance: C^R C^R plants are red, C^W C^W plants are white, and C^R C^W plants are pink. Two pink snapdragons are crossed (C^R C^W × C^R C^W). What is the PHENOTYPE ratio of the offspring?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3 pink : 1 white' },
        { id: 'b', text: '1 red : 2 pink : 1 white', correct: true },
        { id: 'c', text: 'All offspring are pink' },
        { id: 'd', text: '3 red : 1 white' },
      ],
      expectedAnswer: '1 red : 2 pink : 1 white',
      hints: [
        'Fill the four boxes of a C^R C^W × C^R C^W square and write down the three genotypes you get.',
        'In incomplete dominance no genotype is hidden, so each genotype has its own visible color — the phenotype ratio ends up matching the genotype ratio.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-blood-type-genotype',
      kind: 'try_yourself',
      problem:
        'In the ABO system, I^A and I^B are codominant with each other and both are dominant over i. A man with type AB blood has children with a woman who has type O blood. Which blood types are possible in their children?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Type AB or type O only' },
        { id: 'b', text: 'Type A, type B, type AB, or type O — all four are possible' },
        { id: 'c', text: 'Every child will be type AB, a blend of both parents' },
        { id: 'd', text: 'Type A or type B only', correct: true },
      ],
      expectedAnswer: 'Type A or type B only',
      hints: [
        'Write both genotypes first. Type AB is I^A I^B. Type O appears only as ii, so the mother must be ii.',
        'The father gives either I^A or I^B; the mother can only ever give i. Combine them and read off each phenotype.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-roan',
      kind: 'try_yourself',
      problem:
        'A rancher crosses a red bull (C^R C^R) with a white cow (C^W C^W). Every calf is roan: its coat contains individual fully-red hairs and individual fully-white hairs mixed together, and no hair is an in-between shade. Which inheritance pattern is this, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Incomplete dominance, because the roan coat looks lighter than the red parent, so the two colors have blended' },
        { id: 'b', text: 'Complete dominance, because the red allele C^R masks the white allele C^W in the heterozygote' },
        { id: 'c', text: 'Codominance, because both alleles are fully expressed at once — each hair is entirely red or entirely white, and neither is blended or masked', correct: true },
        { id: 'd', text: 'Polygenic inheritance, because many genes contribute small amounts of red and white to the coat' },
      ],
      expectedAnswer: 'Codominance, because both alleles are fully expressed at once — each hair is entirely red or entirely white, and neither is blended or masked',
      hints: [
        'Judge the heterozygote at the level where the trait is actually expressed — one hair at a time, not the whole animal from across the field.',
        'Ask the discrimination question: is there a NEW third color present, or are both original colors present at once and still distinguishable?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ab-is-a-blend',
      kind: 'misconception_check',
      question:
        'A student says: "Type AB blood is just like a pink snapdragon — the A and the B blended together into one in-between blood type, so both are examples of incomplete dominance." What went wrong?',
      commonErrors: [
        {
          answer: 'Type AB is a blend of A and B, so it is incomplete dominance',
          misconception: 'Treating any heterozygote that "does not look like either parent alone" as a blend, without checking whether the two alleles\' products are actually still separate and identifiable.',
          correctsTo:
            'Type AB is CODOMINANCE, not a blend. A person with genotype I^A I^B makes the complete A protein AND the complete B protein, both at full strength, sitting side by side on the same red blood cells — a lab can detect each one separately. Nothing averaged or diluted. Contrast a pink snapdragon (C^R C^W): there is no white pigment and no full-strength red pigment to find, just one new intermediate level of red — that is a genuine blend, and only that counts as incomplete dominance. Same test either way: are both original products still there and distinguishable (codominance), or is there a new third product instead (incomplete dominance)?',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Incomplete dominance = the heterozygote is a NEW intermediate (red C^R C^R × white C^W C^W → all pink C^R C^W).',
        'Codominance = BOTH alleles fully expressed at once, side by side and still distinguishable (roan cattle, type AB blood). Roan is not pink — each hair is fully red or fully white.',
        'The test: look at the heterozygote and ask whether you see a new third phenotype (incomplete) or both originals at once (codominant).',
        'Nothing is hidden in either system, so genotype ratio = phenotype ratio: heterozygote × heterozygote → 1:2:1, never 3:1. That is why pink cannot breed true.',
        'ABO uses three alleles — I^A and I^B codominant, both dominant over i — giving six genotypes and four phenotypes; type O is ii and only ii.',
        'Multiple alleles = many versions of ONE gene; polygenic = MANY genes for one trait, giving continuous variation like human height and skin color.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Incomplete Dominance, Codominance & Multiple Alleles' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
