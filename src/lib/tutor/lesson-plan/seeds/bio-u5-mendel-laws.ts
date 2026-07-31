/**
 * Biology — Heredity: Mendel's Laws: Segregation & Independent Assortment.
 *
 * The evidence-first opener for Unit 5 (NGSS HS-LS3-1). Mendel's two laws are
 * the abstract statement of what students already watched happen in meiosis,
 * so the concept segment keeps pointing back to Unit 4: segregation IS
 * anaphase I, independent assortment IS metaphase I orientation. Punnett-square
 * mechanics are deliberately left to the next lesson — this one is about the
 * laws themselves and the pea-plant evidence that forced them.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U5_MENDEL_LAWS: LessonPlan = {
  id: 'evelyn.hs.bio.mendel-laws.v1',
  title: "Mendel's Laws: Segregation & Independent Assortment",
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.mendel-laws',
      standard: 'BIO-5.1',
      description:
        "Explain how Mendel's law of segregation and law of independent assortment account for the inheritance patterns seen in his pea crosses, and connect each law to the behavior of chromosomes during meiosis (NGSS HS-LS3-1).",
    },
  ],
  prerequisites: ['bio.mitosis-meiosis-variation'],
  followUps: ['bio.punnett-squares-monohybrid'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame inheritance as a puzzle Mendel solved by counting, decades before DNA was known.',
      script:
        'Two brown-eyed parents, a blue-eyed baby. A tall pea plant crossed with a short one gives all tall offspring — and then the short plants come back in the next generation, out of nowhere. For centuries people believed traits BLENDED, like mixing paint, but paint that has been mixed never unmixes. In the 1860s a monk named Gregor Mendel spent eight years counting tens of thousands of pea plants in a monastery garden and worked out the two rules that explain the reappearance — without ever seeing a gene, a chromosome, or a strand of DNA. This lesson is about those two rules and the evidence that forced them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-laws',
      kind: 'concept',
      goal: "Mendel's design, the P/F1/F2 evidence, the two laws, and the meiosis link that explains both.",
      keyIdeas: [
        'WHY PEAS — peas grow fast in small space, have easily scored either/or traits (tall or short, round or wrinkled, purple or white flowers, with no in-between), and normally self-pollinate, so Mendel could breed TRUE-BREEDING lines and then hand-pollinate to control exactly which plant crossed with which. Controlled parents plus clean, countable traits is what made the pattern visible.',
        'THE GENERATIONS — the P (parental) generation are the true-breeding starting plants. Their offspring are the F1 generation; the F1 crossed with each other give the F2. Mendel crossed true-breeding tall (TT) with true-breeding short (tt): the ENTIRE F1 was tall. Then F1 x F1 gave an F2 that was about 3 tall to 1 short — a 3:1 pattern he found again for every one of his seven traits.',
        'ALLELES, DOMINANT AND RECESSIVE — each plant carries TWO copies of the factor for a trait, one from each parent; the versions are ALLELES (T and t). An allele is DOMINANT if its trait shows even when only one copy is present, and RECESSIVE if its trait shows only when both copies are recessive (tt). Dominant describes what MASKS what in one organism — it says nothing about how common the allele is in a population.',
        'WHY BLENDING FAILED — under blending, tall crossed with short should give medium F1 plants, and once blended the short trait could never come back. Mendel saw neither: the F1 was fully tall, and the short plants REAPPEARED unchanged in the F2. That reappearance is the killer evidence — the short factor was hidden intact inside the F1 (Tt), not diluted or destroyed.',
        'LAW OF SEGREGATION — the two alleles for a trait SEPARATE from each other during gamete formation, so each gamete carries exactly one allele, and each is equally likely. A Tt parent makes T gametes and t gametes in equal numbers. This is the law that explains the 3:1 F2 pattern: an F1 Tt plant passes on a hidden t half the time, and when a t gamete meets another t gamete you get a short plant again.',
        'LAW OF INDEPENDENT ASSORTMENT — the alleles for ONE trait separate independently of the alleles for ANOTHER trait, so inheriting T does not drag along R. Mendel showed this by tracking seed color and seed shape at once and finding all four combinations in the F2, including combinations neither parent had. The law holds for genes on different chromosomes; genes close together on the SAME chromosome tend to travel together, which is the one real exception.',
        'THE MEIOSIS LINK (the whole point) — Mendel described these as abstract rules, but you already watched them happen in Unit 4. Segregation IS anaphase I: homologous chromosomes are pulled to opposite poles, so the two alleles of a gene end up in different cells. Independent assortment IS metaphase I orientation: each homologous pair lines up on the plate with its maternal and paternal member facing either pole, independently of every other pair. Two laws, two moments in meiosis I.',
        'GENOTYPE VS PHENOTYPE, FIRST PASS — the allele pair an organism carries (TT, Tt, tt) is its GENOTYPE; the trait you can see (tall or short) is its PHENOTYPE. TT and Tt look identical, which is exactly why a recessive trait can hide for a generation and then reappear.',
      ],
      vocabulary: [
        { term: 'allele', definition: 'one of the alternative versions of a gene, such as T (tall) or t (short).' },
        { term: 'segregation', definition: 'the separation of a pair of alleles into different gametes during meiosis.' },
        { term: 'independent assortment', definition: 'the sorting of alleles for one trait without regard to the alleles for another trait.' },
        { term: 'true-breeding', definition: 'a line that, when self-pollinated, produces offspring showing only the parental form of the trait.' },
      ],
      suggestedTools: ['show_concept_map', 'show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-f2-reappearance',
      kind: 'worked_example',
      problem:
        'Mendel crossed a true-breeding purple-flowered pea plant with a true-breeding white-flowered one. Every plant in the F1 generation had purple flowers. He then let the F1 plants cross with each other, and the F2 came out about 3 purple to 1 white. Explain, using the law of segregation, where the white flowers went and how they came back.',
      steps: [
        'Assign alleles from the evidence. White vanished in the F1 and returned in the F2, so white is the recessive form: purple is P, white is p. The true-breeding parents are therefore PP (purple) and pp (white).',
        'Build the F1. A PP parent can only give P; a pp parent can only give p. Every F1 plant is Pp — it carries a white allele but shows purple, because one P is enough to mask p. The white factor was hidden, not destroyed.',
        'Apply segregation to the F1 gametes. In each Pp plant the two alleles separate during meiosis, so half its gametes carry P and half carry p — this is the step blending theory has no way to describe.',
        'Combine F1 gametes at random. A p egg fertilized by a p pollen grain gives pp, and only pp shows white. That combination happens about one time in four, so about 1/4 of the F2 is white and about 3/4 is purple — the 3:1 pattern Mendel counted.',
      ],
      answer:
        'White never disappeared: the F1 plants were all Pp, purple in appearance but carrying an intact p. Segregation put p into half their gametes, and when two p gametes met, pp — white — reappeared in about 1 of every 4 F2 plants.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dominant-not-common',
      kind: 'worked_example',
      problem:
        'A student is told that in pea plants tall (T) is dominant to short (t). She concludes: "Then in any pea field most plants must be tall, because the dominant allele is the stronger one and it will spread." A field is then surveyed and turns out to be mostly short plants. Where did her reasoning go wrong, and what is the genotype of nearly every plant in that field?',
      steps: [
        'Separate the two different claims hiding in her sentence. "Dominant" is a statement about what happens INSIDE one heterozygous organism: in a Tt plant, T is expressed and t is masked. It is not a statement about how many copies of T exist in a population.',
        'Notice that dominance has no mechanism for spreading. A Tt plant passes T to half its gametes and t to the other half — segregation is even-handed. Dominance changes which trait you SEE, never how often an allele is transmitted.',
        'Read the field data with that correction. A short plant can only be tt, because a single T would have made it tall. So a field that is mostly short is a field in which the t allele is simply more common — nearly every plant is tt.',
        "State the general rule she needed: allele frequency in a population is set by that population's history and by which plants survive and reproduce, not by dominance. A rare dominant allele stays rare; a common recessive allele stays common.",
      ],
      answer:
        'She confused dominance with frequency. Dominant means "masks the other allele in a heterozygote," not "more common." The short plants filling the field are tt, and t is simply the more common allele there.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-segregation-meaning',
      kind: 'try_yourself',
      problem:
        'A pea plant with the genotype Tt makes pollen. According to the law of segregation, what does each pollen grain carry for the height gene?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both alleles, T and t, since the plant carries both' },
        { id: 'b', text: 'Only T, because the dominant allele is always the one passed on' },
        { id: 'c', text: 'Exactly one allele — T about half the time and t about half the time', correct: true },
        { id: 'd', text: 'Neither allele, because height is decided at fertilization' },
      ],
      expectedAnswer: 'Exactly one allele — T about half the time and t about half the time',
      hints: [
        'Segregation is about what SEPARATES during gamete formation, not about which trait is visible.',
        'Homologous chromosomes are pulled apart at anaphase I, so the two alleles land in different cells — count how many end up in one gamete.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-f1-evidence',
      kind: 'try_yourself',
      problem:
        'Mendel crossed true-breeding round-seeded peas with true-breeding wrinkled-seeded peas. The entire F1 generation had round seeds, but the F2 generation was about 3 round to 1 wrinkled. Which conclusion does this result support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The F1 plants each carried a hidden wrinkled allele that separated into gametes and could be inherited again', correct: true },
        { id: 'b', text: 'The wrinkled trait disappeared in the F1 and a new wrinkled mutation arose in the F2' },
        { id: 'c', text: 'The round and wrinkled factors blended in the F1, and the blend partly separated again over time' },
        { id: 'd', text: 'Round must be the more common allele in pea populations, which is why it is dominant' },
      ],
      expectedAnswer: 'The F1 plants each carried a hidden wrinkled allele that separated into gametes and could be inherited again',
      hints: [
        'Ask what the reappearance of wrinkled in the F2 proves about the F1 plants that produced them.',
        'A trait that can come back unchanged was never diluted or lost — it was carried, masked, and then segregated into a gamete.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-independent-assortment-meiosis',
      kind: 'try_yourself',
      problem:
        'A pea plant is heterozygous for two genes on DIFFERENT chromosomes: seed color (Y yellow dominant to y green) and seed shape (R round dominant to r wrinkled). Which statement correctly describes independent assortment and the stage of meiosis that produces it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A gamete that receives Y must also receive R, because dominant alleles travel together' },
        { id: 'b', text: 'The alleles sort independently during anaphase II, when sister chromatids separate' },
        { id: 'c', text: 'Independent assortment means the two alleles of the SAME gene end up in different gametes' },
        { id: 'd', text: 'Which color allele a gamete receives does not affect which shape allele it receives, because each homologous pair orients randomly at metaphase I', correct: true },
      ],
      expectedAnswer:
        'Which color allele a gamete receives does not affect which shape allele it receives, because each homologous pair orients randomly at metaphase I',
      hints: [
        'Independent assortment is about TWO different genes; segregation is about the two alleles of ONE gene. Check which one the choice is describing.',
        'The randomness comes from how each homologous pair lines up on the metaphase plate in meiosis I — every pair orients without regard to the others.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dominant-means-common',
      kind: 'misconception_check',
      question:
        'A student says: "Tall is dominant in pea plants, so in the F2 generation most plants are tall — that proves dominant alleles are the more common ones and they take over a population over time." What went wrong?',
      commonErrors: [
        {
          answer: 'Dominant alleles are more common and become more common each generation',
          misconception:
            'Confusing dominance (which allele is EXPRESSED in a heterozygote) with allele frequency (how many copies exist in a population), and reading the 3:1 phenotype count as evidence about frequency.',
          correctsTo:
            'Dominance only describes masking inside one organism. In the F2 the alleles are not even lopsided: the genotypes come out 1 TT : 2 Tt : 1 tt, so T and t are present in equal numbers — 3:1 is a count of what the plants LOOK like, not of alleles. Segregation passes T and t on equally, so dominance gives an allele no transmission advantage at all. Plenty of dominant alleles are rare, such as the allele causing Huntington\'s disease, and plenty of recessive alleles are common.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mendel chose peas for fast growth, clean either/or traits, and controllable pollination — that design is why the pattern was countable: P true-breeding → F1 all one form → F2 about 3:1.',
        'Law of segregation: the two alleles of a gene separate into different gametes, so each gamete carries exactly one, each equally likely. This is anaphase I of meiosis.',
        'Law of independent assortment: alleles for different genes sort independently, so new trait combinations appear. This is the random orientation of each homologous pair at metaphase I. (Genes close together on one chromosome are the exception.)',
        "Blending inheritance failed because a blended trait could never come back — yet the recessive trait reappeared unchanged in the F2. It had been hidden intact in the heterozygous F1, not diluted.",
        'Dominant means "masks the recessive allele in a heterozygote" — it does NOT mean stronger, better, or more common in a population.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: "Mendel's Laws: Segregation & Independent Assortment" },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
