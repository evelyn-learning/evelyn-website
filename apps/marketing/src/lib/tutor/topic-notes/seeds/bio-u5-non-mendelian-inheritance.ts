/**
 * Biology — Unit 5 CED 5.4: Incomplete Dominance, Codominance & Multiple Alleles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.non-mendelian-inheritance.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U5_NON_MENDELIAN_INHERITANCE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.non-mendelian-inheritance.v1',
  course: 'Biology',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Incomplete Dominance, Codominance & Multiple Alleles',
  planId: 'evelyn.hs.bio.non-mendelian-inheritance.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.non-mendelian-inheritance.v1' }],
  theory: [
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Complete dominance is only one option', content: `COMPLETE DOMINANCE IS ONLY ONE OPTION — in a simple Mendelian trait, one allele fully masks the other, so Rr and RR look identical and the recessive phenotype hides. Several real traits do NOT work that way: the heterozygote looks like neither parent, or like both at once.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Incomplete dominance', content: `INCOMPLETE DOMINANCE — neither allele fully masks the other, so the heterozygote shows a NEW intermediate phenotype, a blend. Red snapdragons (C^R C^R) crossed with white snapdragons (C^W C^W) give all pink offspring (C^R C^W). Think of it as half the red pigment: enough to tint, not enough to be red.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Codominance', content: `CODOMINANCE — both alleles are expressed FULLY and separately at the same time, side by side, with no blending. Roan cattle (C^R C^W) are not pink: their coat carries individual red hairs and individual white hairs mixed together, and a hair-by-hair look shows each one is fully red or fully white. Human AB blood type is the same idea — both the A protein and the B protein sit on the red blood cells at full strength.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'The one question that tells them apart', content: `THE ONE QUESTION THAT TELLS THEM APART — look only at the heterozygote and ask: is this a NEW third appearance (incomplete dominance), or are BOTH parental traits present at once and still distinguishable (codominance)? Pink is a color neither parent had → incomplete. Roan and AB show both originals unchanged → codominant.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Superscript notation', content: `SUPERSCRIPT NOTATION — capital-versus-lowercase means "this one wins", so it is the wrong tool when neither allele wins. Instead write one letter for the GENE and a superscript for the ALLELE version: C^R and C^W are two co-equal alleles of the coat-color gene C. Read C^R C^W aloud as "C-superscript-R, C-superscript-W".` },
    { loId: 'bio.non-mendelian-inheritance', content: `RATIOS CHANGE: 1:2:1 FOR BOTH — because nothing is hidden in these systems, every genotype has its own visible phenotype, so the GENOTYPE ratio and the PHENOTYPE ratio become the same. Pink × pink (C^R C^W × C^R C^W) gives C^R C^R, C^R C^W, C^R C^W, C^W C^W → 1 red : 2 pink : 1 white, a phenotype ratio of 1:2:1. The familiar 3:1 never appears here, which is why pink can never breed true.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Multiple alleles', content: `MULTIPLE ALLELES — ABO BLOOD TYPE — a gene can have more than two allele versions in a POPULATION, even though any one person still carries exactly TWO. The ABO gene has three: I^A, I^B, and i. I^A and I^B are codominant with each other, and both are completely dominant over i. That gives six genotypes and only four phenotypes: type A is I^A I^A or I^A i; type B is I^B I^B or I^B i; type AB is I^A I^B; type O is ii and ONLY ii, because a single I^A or I^B would show.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'framework', title: 'Polygenic traits are a different thing', content: `POLYGENIC TRAITS ARE A DIFFERENT THING — multiple alleles means many versions of ONE gene; polygenic means MANY GENES contribute to one trait. Human height and skin color are polygenic: dozens of genes each add a small amount, so instead of a few discrete categories you get CONTINUOUS variation — a smooth range with most people near the middle. That is why height comes as a spectrum, not as "tall or short".` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'definition', title: 'incomplete dominance', content: `inheritance in which the heterozygote shows a new intermediate phenotype, such as a pink snapdragon from red and white parents.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'definition', title: 'codominance', content: `inheritance in which both alleles are fully and separately expressed in the heterozygote, such as roan cattle or type AB blood.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'definition', title: 'multiple alleles', content: `a gene with more than two allele versions in the population, though any individual still carries only two — for example I^A, I^B and i.` },
    { loId: 'bio.non-mendelian-inheritance', kind: 'definition', title: 'polygenic trait', content: `a trait controlled by many genes at once, producing continuous variation rather than discrete categories.` },
  ],
  methods: [
    {
      title: 'Worked blood type cross',
      steps: [
        `List each parent's gametes. Every parent gives ONE allele. The mother (I^A i) makes I^A and i gametes in equal numbers; the father (I^B i) makes I^B and i gametes in equal numbers.`,
        `Fill the four boxes: I^A with I^B → I^A I^B; I^A with i → I^A i; i with I^B → I^B i; i with i → ii.`,
        `Translate each genotype into a phenotype using the dominance rules. I^A I^B expresses both proteins at once → type AB. I^A i has one dominant I^A masking i → type A. I^B i likewise → type B. ii has no A or B protein at all → type O.`,
        `Count: one box each. All four blood types are possible, in a 1:1:1:1 ratio — each child independently has a 1/4 chance of any one of them.`,
        `Sanity check on the surprise: neither parent is type O, yet a type O child is possible, because each parent quietly carries one i allele. Type O appears ONLY as ii, so both i alleles had to come from somewhere — one from each parent.`,
      ],
      example: { problem: `In the ABO system there are three alleles: I^A and I^B, which are codominant with each other, and i, which is recessive to both. A woman has type A blood with the genotype I^A i. She has children with a man who has type B blood with the genotype I^B i. Which blood types are possible in their children, and in what ratio?`, solution: `Type AB, A, B and O are all possible, in a 1:1:1:1 ratio (I^A I^B, I^A i, I^B i, ii).` },
      relatedLoIds: ['bio.non-mendelian-inheritance'],
    },
    {
      title: 'Worked incomplete vs codominant',
      steps: [
        `Set both crosses up the same way. Each parent is homozygous, so every offspring in both crosses is the heterozygote C^R C^W. The genotypes are identical — only the appearance differs, so the appearance is what decides the classification.`,
        `Apply the one question to cross 1: is pink a new third appearance, or both parental colors at once? Every cell of the petal makes the same intermediate pigment level, so the flower is a color neither parent had. That is a BLEND → incomplete dominance.`,
        `Apply the same question to cross 2: the "pink" is an illusion of distance. Zoom in and each hair is fully red or fully white — both parental phenotypes are present at once and still distinguishable. Nothing blended → codominance.`,
        `State the general rule this illustrates: do not judge by the whole-organism impression, judge at the level where the trait is actually expressed. Per-hair and per-cell detail is what separates a true blend from a fine-grained mosaic of both alleles.`,
        `Note what the two crosses share: in BOTH systems no phenotype is hidden, so crossing two heterozygotes gives 1:2:1 either way — 1 red : 2 pink : 1 white for the snapdragons, 1 red : 2 roan : 1 white for the cattle.`,
      ],
      example: { problem: `Classify each of these two crosses as incomplete dominance or codominance, and justify the call. (1) A red-flowered snapdragon (C^R C^R) crossed with a white-flowered snapdragon (C^W C^W) gives offspring whose petals are uniformly pink from edge to edge. (2) A red-coated bull (C^R C^R) crossed with a white-coated cow (C^W C^W) gives calves whose coats look pinkish from a distance, but under close inspection each individual hair is either fully red or fully white, with no pink hairs anywhere.`, solution: `Cross 1 is incomplete dominance (a genuinely new intermediate color); cross 2 is codominance (roan — both alleles fully expressed as separate red and white hairs).` },
      relatedLoIds: ['bio.non-mendelian-inheritance'],
    },
  ],
  pointers: [
    { content: `Type AB is CODOMINANCE, not a blend. A person with genotype I^A I^B makes the complete A protein AND the complete B protein, both at full strength, sitting side by side on the same red blood cells — a lab can detect each one separately. Nothing averaged or diluted. Contrast a pink snapdragon (C^R C^W): there is no white pigment and no full-strength red pigment to find, just one new intermediate level of red — that is a genuine blend, and only that counts as incomplete dominance. Same test either way: are both original products still there and distinguishable (codominance), or is there a new third product instead (incomplete dominance)?`, kind: 'common-error' },
    { content: `Incomplete dominance = the heterozygote is a NEW intermediate (red C^R C^R × white C^W C^W → all pink C^R C^W).`, kind: 'tip' },
    { content: `Codominance = BOTH alleles fully expressed at once, side by side and still distinguishable (roan cattle, type AB blood). Roan is not pink — each hair is fully red or fully white.`, kind: 'tip' },
    { content: `The test: look at the heterozygote and ask whether you see a new third phenotype (incomplete) or both originals at once (codominant).`, kind: 'tip' },
    { content: `Nothing is hidden in either system, so genotype ratio = phenotype ratio: heterozygote × heterozygote → 1:2:1, never 3:1. That is why pink cannot breed true.`, kind: 'tip' },
    { content: `ABO uses three alleles — I^A and I^B codominant, both dominant over i — giving six genotypes and four phenotypes; type O is ii and only ii.`, kind: 'tip' },
    { content: `Multiple alleles = many versions of ONE gene; polygenic = MANY genes for one trait, giving continuous variation like human height and skin color.`, kind: 'tip' },
    { content: `Don't write incomplete-dominance or codominance alleles as \`R\` and \`r\` — capital/lowercase means one allele wins. Use one letter for the gene plus superscripts for the co-equal alleles: C^R, C^W. Same for blood type: I^A, I^B, and lowercase i (the only recessive one).`, kind: 'vocab-note' },
    { content: `Roan is NOT pink. If the whole organism shows a genuinely new intermediate, that's incomplete dominance; if zooming in shows both original phenotypes side by side and still identifiable (each hair fully red or fully white), that's codominance.`, kind: 'common-error' },
    { content: `Type AB is codominance, not a blend. An AB person makes complete A protein AND complete B protein at full strength — a lab detects each separately. There is no 'in-between' blood protein the way pink has an in-between pigment level.`, kind: 'gotcha' },
    { content: `Heterozygote × heterozygote gives 1:2:1 as a PHENOTYPE ratio here, never 3:1. Since nothing is hidden, genotype ratio = phenotype ratio — so pink × pink always throws red and white offspring and pink can never breed true.`, kind: 'common-error' },
    { content: `'Multiple alleles' ≠ 'more than two alleles in one person.' A population can carry I^A, I^B and i, but each individual still has exactly TWO alleles. Never write a three-allele genotype like I^A I^B i.`, kind: 'vocab-note' },
    { content: `Multiple alleles = many versions of ONE gene (ABO). Polygenic = MANY genes for one trait (height, skin color) giving continuous variation. Don't call skin color a multiple-allele trait or blood type polygenic.`, kind: 'vocab-note' },
    { content: `Type O is ii and only ii — a single I^A or I^B would show. So two non-O parents can still have an O child if each carries a hidden i, and an AB parent can NEVER have an O child (they have no i to pass).`, kind: 'edge-case' },
    { content: `In ABO, dominance is not all-or-nothing across the board: I^A and I^B are codominant with EACH OTHER but both are completely dominant over i. Check which pair of alleles you're comparing before deciding the phenotype.`, kind: 'gotcha' },
  ],
};
