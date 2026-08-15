/**
 * Biology — Unit 5 CED 5.1: Mendel's Laws: Segregation & Independent Assortment.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.mendel-laws.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U5_MENDEL_LAWS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.mendel-laws.v1',
  course: 'Biology',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: `Mendel's Laws: Segregation & Independent Assortment`,
  planId: 'evelyn.hs.bio.mendel-laws.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.mendel-laws.v1' }],
  theory: [
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Why peas', content: `WHY PEAS — peas grow fast in small space, have easily scored either/or traits (tall or short, round or wrinkled, purple or white flowers, with no in-between), and normally self-pollinate, so Mendel could breed TRUE-BREEDING lines and then hand-pollinate to control exactly which plant crossed with which. Controlled parents plus clean, countable traits is what made the pattern visible.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'The generations', content: `THE GENERATIONS — the P (parental) generation are the true-breeding starting plants. Their offspring are the F1 generation; the F1 crossed with each other give the F2. Mendel crossed true-breeding tall (TT) with true-breeding short (tt): the ENTIRE F1 was tall. Then F1 x F1 gave an F2 that was about 3 tall to 1 short — a 3:1 pattern he found again for every one of his seven traits.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Alleles, dominant and recessive', content: `ALLELES, DOMINANT AND RECESSIVE — each plant carries TWO copies of the factor for a trait, one from each parent; the versions are ALLELES (T and t). An allele is DOMINANT if its trait shows even when only one copy is present, and RECESSIVE if its trait shows only when both copies are recessive (tt). Dominant describes what MASKS what in one organism — it says nothing about how common the allele is in a population.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Why blending failed', content: `WHY BLENDING FAILED — under blending, tall crossed with short should give medium F1 plants, and once blended the short trait could never come back. Mendel saw neither: the F1 was fully tall, and the short plants REAPPEARED unchanged in the F2. That reappearance is the killer evidence — the short factor was hidden intact inside the F1 (Tt), not diluted or destroyed.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Law of segregation', content: `LAW OF SEGREGATION — the two alleles for a trait SEPARATE from each other during gamete formation, so each gamete carries exactly one allele, and each is equally likely. A Tt parent makes T gametes and t gametes in equal numbers. This is the law that explains the 3:1 F2 pattern: an F1 Tt plant passes on a hidden t half the time, and when a t gamete meets another t gamete you get a short plant again.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Law of independent assortment', content: `LAW OF INDEPENDENT ASSORTMENT — the alleles for ONE trait separate independently of the alleles for ANOTHER trait, so inheriting T does not drag along R. Mendel showed this by tracking seed color and seed shape at once and finding all four combinations in the F2, including combinations neither parent had. The law holds for genes on different chromosomes; genes close together on the SAME chromosome tend to travel together, which is the one real exception.` },
    { loId: 'bio.mendel-laws', content: `THE MEIOSIS LINK (the whole point) — Mendel described these as abstract rules, but you already watched them happen in Unit 4. Segregation IS anaphase I: homologous chromosomes are pulled to opposite poles, so the two alleles of a gene end up in different cells. Independent assortment IS metaphase I orientation: each homologous pair lines up on the plate with its maternal and paternal member facing either pole, independently of every other pair. Two laws, two moments in meiosis I.` },
    { loId: 'bio.mendel-laws', kind: 'framework', title: 'Genotype vs phenotype, first pass', content: `GENOTYPE VS PHENOTYPE, FIRST PASS — the allele pair an organism carries (TT, Tt, tt) is its GENOTYPE; the trait you can see (tall or short) is its PHENOTYPE. TT and Tt look identical, which is exactly why a recessive trait can hide for a generation and then reappear.` },
    { loId: 'bio.mendel-laws', kind: 'definition', title: 'allele', content: 'one of the alternative versions of a gene, such as T (tall) or t (short).' },
    { loId: 'bio.mendel-laws', kind: 'definition', title: 'segregation', content: 'the separation of a pair of alleles into different gametes during meiosis.' },
    { loId: 'bio.mendel-laws', kind: 'definition', title: 'independent assortment', content: `the sorting of alleles for one trait without regard to the alleles for another trait.` },
    { loId: 'bio.mendel-laws', kind: 'definition', title: 'true-breeding', content: `a line that, when self-pollinated, produces offspring showing only the parental form of the trait.` },
  ],
  methods: [
    {
      title: 'Worked f2 reappearance',
      steps: [
        `Assign alleles from the evidence. White vanished in the F1 and returned in the F2, so white is the recessive form: purple is P, white is p. The true-breeding parents are therefore PP (purple) and pp (white).`,
        `Build the F1. A PP parent can only give P; a pp parent can only give p. Every F1 plant is Pp — it carries a white allele but shows purple, because one P is enough to mask p. The white factor was hidden, not destroyed.`,
        `Apply segregation to the F1 gametes. In each Pp plant the two alleles separate during meiosis, so half its gametes carry P and half carry p — this is the step blending theory has no way to describe.`,
        `Combine F1 gametes at random. A p egg fertilized by a p pollen grain gives pp, and only pp shows white. That combination happens about one time in four, so about 1/4 of the F2 is white and about 3/4 is purple — the 3:1 pattern Mendel counted.`,
      ],
      example: { problem: `Mendel crossed a true-breeding purple-flowered pea plant with a true-breeding white-flowered one. Every plant in the F1 generation had purple flowers. He then let the F1 plants cross with each other, and the F2 came out about 3 purple to 1 white. Explain, using the law of segregation, where the white flowers went and how they came back.`, solution: `White never disappeared: the F1 plants were all Pp, purple in appearance but carrying an intact p. Segregation put p into half their gametes, and when two p gametes met, pp — white — reappeared in about 1 of every 4 F2 plants.` },
      relatedLoIds: ['bio.mendel-laws'],
    },
    {
      title: 'Worked dominant not common',
      steps: [
        `Separate the two different claims hiding in her sentence. "Dominant" is a statement about what happens INSIDE one heterozygous organism: in a Tt plant, T is expressed and t is masked. It is not a statement about how many copies of T exist in a population.`,
        `Notice that dominance has no mechanism for spreading. A Tt plant passes T to half its gametes and t to the other half — segregation is even-handed. Dominance changes which trait you SEE, never how often an allele is transmitted.`,
        `Read the field data with that correction. A short plant can only be tt, because a single T would have made it tall. So a field that is mostly short is a field in which the t allele is simply more common — nearly every plant is tt.`,
        `State the general rule she needed: allele frequency in a population is set by that population's history and by which plants survive and reproduce, not by dominance. A rare dominant allele stays rare; a common recessive allele stays common.`,
      ],
      example: { problem: `A student is told that in pea plants tall (T) is dominant to short (t). She concludes: "Then in any pea field most plants must be tall, because the dominant allele is the stronger one and it will spread." A field is then surveyed and turns out to be mostly short plants. Where did her reasoning go wrong, and what is the genotype of nearly every plant in that field?`, solution: `She confused dominance with frequency. Dominant means "masks the other allele in a heterozygote," not "more common." The short plants filling the field are tt, and t is simply the more common allele there.` },
      relatedLoIds: ['bio.mendel-laws'],
    },
  ],
  pointers: [
    { content: `Dominance only describes masking inside one organism. In the F2 the alleles are not even lopsided: the genotypes come out 1 TT : 2 Tt : 1 tt, so T and t are present in equal numbers — 3:1 is a count of what the plants LOOK like, not of alleles. Segregation passes T and t on equally, so dominance gives an allele no transmission advantage at all. Plenty of dominant alleles are rare, such as the allele causing Huntington's disease, and plenty of recessive alleles are common.`, kind: 'common-error' },
    { content: `Mendel chose peas for fast growth, clean either/or traits, and controllable pollination — that design is why the pattern was countable: P true-breeding → F1 all one form → F2 about 3:1.`, kind: 'tip' },
    { content: `Law of segregation: the two alleles of a gene separate into different gametes, so each gamete carries exactly one, each equally likely. This is anaphase I of meiosis.`, kind: 'tip' },
    { content: `Law of independent assortment: alleles for different genes sort independently, so new trait combinations appear. This is the random orientation of each homologous pair at metaphase I. (Genes close together on one chromosome are the exception.)`, kind: 'tip' },
    { content: `Blending inheritance failed because a blended trait could never come back — yet the recessive trait reappeared unchanged in the F2. It had been hidden intact in the heterozygous F1, not diluted.`, kind: 'tip' },
    { content: `Dominant means "masks the recessive allele in a heterozygote" — it does NOT mean stronger, better, or more common in a population.`, kind: 'tip' },
    { content: `3:1 is a **phenotype** ratio; the genotype ratio underneath is 1 TT : 2 Tt : 1 tt. Say which one you mean. "3:1 tall" never means 3 T alleles per 1 t — the F2 carries T and t in equal numbers.`, kind: 'vocab-note' },
    { content: `Dominant ≠ common, strong, or better. It only means "masks the other allele inside one heterozygote." A dominant allele can be vanishingly rare (Huntington's) and a recessive allele can be nearly universal.`, kind: 'common-error' },
    { content: `Watch the case in allele symbols: capital T and lowercase t are different alleles, not typos. Use the SAME letter for both alleles of one gene (T/t), never T/s, and use a different letter for a different gene (T/t vs R/r).`, kind: 'vocab-note' },
    { content: `Segregation and independent assortment are two DIFFERENT moments: segregation = homologs pulled apart at anaphase I; independent assortment = random orientation of each homologous pair at metaphase I. Don't credit either to metaphase/anaphase II.`, kind: 'gotcha' },
    { content: `Independent assortment needs at least TWO genes on DIFFERENT chromosomes. Genes close together on the same chromosome are linked and travel together — the one real exception. A single-gene cross can never illustrate independent assortment.`, kind: 'edge-case' },
    { content: `"True-breeding" means homozygous (TT or tt) — self-pollinating gives only the parental form. An F1 hybrid is Tt and looks uniform, but it is NOT true-breeding; its offspring split 3:1.`, kind: 'vocab-note' },
    { content: `The killer evidence against blending isn't the uniform F1 — it's the recessive trait coming back UNCHANGED in the F2. Blending could explain a uniform F1 by mixing; it can't explain short plants returning full-size.`, kind: 'tip' },
    { content: `A recessive phenotype pins the genotype: a short plant must be tt. A dominant phenotype does not — a tall plant is TT or Tt, and you cannot tell without a cross. Write Tt or T_ , never guess.`, kind: 'tip' },
  ],
};
