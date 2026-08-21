/**
 * Grade 7 Science — Unit 6 CED 6.2: Dominant & Recessive Traits.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.dominant-and-recessive-traits.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U6_DOMINANT_AND_RECESSIVE_TRAITS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.dominant-and-recessive-traits.v1',
  course: 'Grade 7 Science',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Dominant & Recessive Traits',
  planId: 'evelyn.ms.m7sci.dominant-and-recessive-traits.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.dominant-and-recessive-traits.v1' }],
  theory: [
    { loId: 'm7sci.dominant-and-recessive-traits', content: `AN ALLELE IS ONE VERSION OF A GENE. A gene is the instruction for a trait, such as fur color in a guinea pig. Most genes come in more than one version, and those versions are the alleles. You carry TWO alleles for the gene, because you inherited one from each parent. Not one parent. Each parent. Every organism that has two parents gets exactly one allele of each gene from each of them.` },
    { loId: 'm7sci.dominant-and-recessive-traits', content: `WE WRITE THE TWO ALLELES WITH THE SAME LETTER. The capital letter stands for the dominant version and the same letter in lowercase stands for the recessive version. So T and t are the two alleles of one gene. Writing T and s is always wrong, because different letters mean different genes. Pick the letter from the dominant trait, then reuse it in lowercase for the recessive one.` },
    { loId: 'm7sci.dominant-and-recessive-traits', content: `DOMINANT MEANS IT SHOWS WHEN PRESENT. If a dominant allele is there at all, even just one copy, you see its trait. The recessive trait appears only when BOTH alleles are recessive, because there is no dominant allele there to show instead. That is the whole rule, and it is a rule about what happens inside one organism.` },
    { loId: 'm7sci.dominant-and-recessive-traits', content: `DOMINANT DOES NOT MEAN BETTER, STRONGER, MORE COMMON, OR MORE LIKELY TO BE INHERITED. This is the mistake almost everyone makes, so read it twice. Dominance says nothing about how many organisms have the trait. A plant carrying one of each allele passes on the dominant one about half the time and the recessive one about half the time, so being dominant gives an allele no head start at all. How common a trait is in a population depends on which parents that population started with and which offspring survive and reproduce there. WRONG: "Short pea plants are everywhere in this garden, so short must be dominant." CORRECT: "Short pea plants are everywhere in this garden, so the recessive allele is simply the common one here."` },
    { loId: 'm7sci.dominant-and-recessive-traits', content: `GENOTYPE IS THE LETTERS; PHENOTYPE IS WHAT YOU SEE. If black fur B is dominant over white fur b, then BB and Bb are two different GENOTYPES that give the same PHENOTYPE, because the dominant B shows either way. You cannot tell a BB guinea pig from a Bb guinea pig by looking at it. Only bb looks white.` },
    { loId: 'm7sci.dominant-and-recessive-traits', content: `HOMOZYGOUS MEANS TWO OF THE SAME; HETEROZYGOUS MEANS TWO DIFFERENT. BB and bb are homozygous. Bb is heterozygous, and a heterozygous organism is a CARRIER: it shows the dominant trait while carrying a recessive allele that is still whole and can still be passed on. Nothing blends. The hidden allele is not watered down, which is exactly why a recessive trait can vanish for a generation and then come straight back. (A few genes do not follow this simple pattern of one allele fully covering the other, and you will meet those later.)` },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'allele', content: 'one version of a gene; an organism carries two, one inherited from each parent.' },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'dominant allele', content: `an allele whose trait shows whenever the allele is present, written as a capital letter.` },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'recessive allele', content: `an allele whose trait shows only when both alleles are recessive, written as the same letter in lowercase.` },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'genotype', content: 'the pair of alleles an organism carries, written as letters such as Bb.' },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'phenotype', content: 'the trait you can actually observe, such as black fur or white fur.' },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'homozygous', content: 'having two identical alleles for a gene, such as BB or bb.' },
    { loId: 'm7sci.dominant-and-recessive-traits', kind: 'definition', title: 'heterozygous', content: 'having two different alleles for a gene, such as Bb.' },
  ],
  methods: [
    {
      title: 'Worked genotype to phenotype',
      steps: [
        `Read the letters first. B and b are the same letter, so they are the two alleles of ONE gene, the fur color gene. Capital B is the dominant version and means black. Lowercase b is the recessive version and means white.`,
        `Take BB. The two alleles are identical, so this guinea pig is homozygous. Both alleles are dominant, so the fur is black.`,
        `Take Bb. The two alleles are different, so this guinea pig is heterozygous. A dominant allele shows whenever it is present, and there is a B present, so the fur is black. The b is still there, still whole, and can still be passed on to offspring. This guinea pig is a carrier of the white allele.`,
        `Take bb. The two alleles are identical again, so this guinea pig is homozygous as well. There is no dominant allele here to show instead, so the recessive trait finally appears and the fur is white. This is the only genotype that looks white.`,
        `Now compare BB with Bb. Different genotypes, same phenotype. Two of these guinea pigs look exactly the same and are carrying different alleles, which is why you can never read a genotype straight off an animal that shows the dominant trait.`,
      ],
      example: { problem: `In guinea pigs, black fur (B) is dominant over white fur (b). Three guinea pigs have the genotypes BB, Bb, and bb. For each one, say whether it is homozygous or heterozygous, and say what color its fur is.`, solution: `BB is homozygous with black fur. Bb is heterozygous with black fur, and it carries a hidden white allele. bb is homozygous with white fur. BB and Bb have different genotypes but the same phenotype.` },
      relatedLoIds: ['m7sci.dominant-and-recessive-traits'],
    },
    {
      title: 'Worked dominant is not common',
      steps: [
        `Write down what dominant actually claims. A T allele shows its trait whenever it is present, so any plant with a T is tall. That is a statement about what happens inside one plant. It is not a statement about how many T alleles exist in the greenhouse.`,
        `Work out the genotype of a short plant. Short is the recessive trait, so it shows only when both alleles are recessive. A short plant must be tt. A single T would have made it tall instead.`,
        `Put those together. A greenhouse that is mostly short plants is a greenhouse that is mostly tt plants, which means the t allele is simply the common one there. Nothing about that breaks any rule.`,
        `Check whether dominance could push T to spread. A Tt plant passes T to about half of its offspring and t to about the other half. Being dominant does not make an allele get passed on more often. Dominance changes what you SEE, never how often an allele is handed down.`,
        `Name what actually sets how common a trait is. It depends on which plants that greenhouse started with and which plants survive and reproduce there. If the gardener planted mostly tt seeds, the greenhouse is mostly short, and it will stay that way.`,
        `State the correction cleanly. WRONG: "Most of the plants are short, so short must be dominant." CORRECT: "Most of the plants are short, so tt is the common genotype here. Dominant and common are two separate questions."`,
      ],
      example: { problem: `In pea plants, tall (T) is dominant over short (t). A gardener looks at one greenhouse and finds that most of the plants in it are short. A student says this must be a mistake, because the dominant trait should be the common one. Explain why the greenhouse is perfectly possible, and say what the genotype of nearly every plant in it must be.`, solution: `The greenhouse is possible because dominance describes what shows inside one plant, not how common an allele is in a group. Nearly every plant in it is tt, so the recessive allele t is the common one there.` },
      relatedLoIds: ['m7sci.dominant-and-recessive-traits'],
    },
  ],
  pointers: [
    { content: `Students often say "The dominant allele is stronger, so the dominant trait is the more common one." — Dominant means one thing only: the trait shows whenever the allele is present. It carries no advantage in being passed on. A Bb guinea pig hands down B about half the time and b about half the time, so a dominant allele gets no head start. How common a trait is depends on which parents a population started with and which offspring survive and reproduce there. WRONG: "White fur is common in this group, so white must be dominant." CORRECT: "White fur is common in this group, so bb is the common genotype here." A recessive trait can be the most common trait around, and a dominant trait can be rare.`, kind: 'common-error' },
    { content: `Students often say "A Bb guinea pig should look partway between black and white." — Alleles do not mix. For a gene with simple dominance, a Bb guinea pig is black, and it is exactly as black as a BB guinea pig, because the dominant allele shows whenever it is present. The b allele stays whole the entire time and can be passed on to offspring, which is why white fur can disappear for a generation and then reappear. That reappearance is the proof that nothing blended.`, kind: 'common-error' },
    { content: `An allele is one version of a gene. An organism carries two, one inherited from EACH parent.`, kind: 'tip' },
    { content: `Use the same letter for both alleles: a capital for the dominant version, the same letter in lowercase for the recessive one. T and t, never T and s.`, kind: 'tip' },
    { content: `Dominant means the trait shows whenever the allele is present. The recessive trait shows only when BOTH alleles are recessive.`, kind: 'tip' },
    { content: `Dominant does NOT mean better, stronger, more common, or more likely to be inherited. A recessive trait can be the most common trait in a whole population.`, kind: 'tip' },
    { content: `Genotype is the letters an organism carries. Phenotype is the trait you can see. BB and Bb are different genotypes with the same phenotype.`, kind: 'tip' },
    { content: `Homozygous is two of the same allele (BB or bb). Heterozygous is two different alleles (Bb).`, kind: 'tip' },
    { content: `A heterozygous organism is a carrier: it shows the dominant trait while carrying an intact recessive allele it can pass on. Nothing blends.`, kind: 'tip' },
    { content: `"Dominant" tells you what shows, not what's common. Never argue "most of them are short, so short must be dominant." How common a trait is depends on which parents the group started with and which offspring survive there.`, kind: 'common-error' },
    { content: `Both alleles of one gene use the SAME letter — T and t, B and b. Writing T and s means you've written two different genes. Pick the letter from the dominant trait's name, then reuse it in lowercase.`, kind: 'vocab-note' },
    { content: `If an organism SHOWS the dominant trait, you can't know its genotype by looking. A purple pea plant is PP *or* Pp. Only the recessive phenotype (pp) tells you both letters for sure.`, kind: 'gotcha' },
    { content: `Alleles never mix like paint. Bb is just as black as BB — not gray. The hidden b stays whole and can be passed on, which is why white fur can skip a generation and come right back.`, kind: 'common-error' },
    { content: `You get one allele from EACH parent, not one gene from one parent. Say "one allele from mom and one from dad" out loud when you write a genotype — the two letters have two different sources.`, kind: 'tip' },
    { content: `Homozygous means two of the SAME letter — that includes bb, not just BB. Don't use "homozygous" as a synonym for "dominant." Bb is heterozygous and is called a carrier.`, kind: 'vocab-note' },
    { content: `Genotype = the letters. Phenotype = what you actually see. If your answer to a phenotype question has letters in it, or your genotype answer says "black," you swapped them.`, kind: 'tip' },
    { content: `Being dominant gives an allele no head start in being passed on. A Bb parent passes B about half the time and b about half the time. Dominance changes what you see, never how often an allele is handed down.`, kind: 'gotcha' },
  ],
};
