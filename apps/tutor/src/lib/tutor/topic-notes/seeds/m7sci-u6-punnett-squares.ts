/**
 * Grade 7 Science — Unit 6 CED 6.3: Punnett Squares & Predicting Traits.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.punnett-squares.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U6_PUNNETT_SQUARES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.punnett-squares.v1',
  course: 'Grade 7 Science',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Punnett Squares & Predicting Traits',
  planId: 'evelyn.ms.m7sci.punnett-squares.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.punnett-squares.v1' }],
  theory: [
    { loId: 'm7sci.punnett-squares', content: `AN ALLELE IS ONE VERSION OF A GENE, and every offspring gets one from each parent. We write them with the SAME letter: a capital for the dominant version and the same letter in lowercase for the recessive one. So T and t are two alleles of one gene. Using two different letters, like T and s, is always wrong -- different letters mean different genes.` },
    { loId: 'm7sci.punnett-squares', content: `DOMINANT MEANS IT SHOWS WHEN PRESENT, not that it is better, stronger or more common. If a dominant allele is there at all, you see its trait. The recessive trait appears only when BOTH alleles are recessive. How common a trait is in a population is a completely separate question from whether it is dominant.` },
    { loId: 'm7sci.punnett-squares', content: `GENOTYPE IS THE LETTERS; PHENOTYPE IS WHAT YOU SEE. TT and Tt are two different genotypes, but they give the SAME phenotype, because the dominant allele shows either way. TT is called homozygous (two the same), Tt is heterozygous (two different), tt is homozygous recessive. Confusing genotype with phenotype is the single most common mistake in this whole unit.` },
    { loId: 'm7sci.punnett-squares', kind: 'framework', title: 'The procedure', content: `THE PROCEDURE — split one parent across the top and the other down the left side, one allele per column and per row. Fill each of the four boxes by combining its column letter with its row letter, writing the capital first. Then count.` },
    { loId: 'm7sci.punnett-squares', content: `READ THE QUESTION BEFORE YOU COUNT. A cross of Tt with Tt gives boxes TT, Tt, Tt, tt. The GENOTYPE ratio is 1 TT to 2 Tt to 1 tt, which is 1:2:1. The PHENOTYPE ratio is 3 showing the dominant trait to 1 showing the recessive, which is 3:1. Both come from the same four boxes. Reporting 1:2:1 when the question asked what you would SEE is the trap this lesson exists to fix.` },
    { loId: 'm7sci.punnett-squares', content: `THE SQUARE GIVES A PROBABILITY, NOT A PROMISE. A 3:1 phenotype ratio means each offspring independently has a 3 in 4 chance of the dominant trait. WRONG: "Four puppies means exactly three tall and one short." RIGHT: "Each puppy has a 3 in 4 chance." A litter of four could easily come out all four the same way, exactly as four coin flips can all come up heads.` },
    { loId: 'm7sci.punnett-squares', kind: 'definition', title: 'allele', content: 'one version of a gene; offspring inherit one from each parent.' },
    { loId: 'm7sci.punnett-squares', kind: 'definition', title: 'genotype', content: 'the pair of alleles an organism carries, written as letters such as Tt.' },
    { loId: 'm7sci.punnett-squares', kind: 'definition', title: 'phenotype', content: 'the trait you can actually observe, such as tall or short.' },
    { loId: 'm7sci.punnett-squares', kind: 'definition', title: 'homozygous', content: 'having two identical alleles for a gene, such as TT or tt.' },
    { loId: 'm7sci.punnett-squares', kind: 'definition', title: 'heterozygous', content: 'having two different alleles for a gene, such as Tt.' },
  ],
  methods: [
    {
      title: 'Worked monohybrid',
      steps: [
        `Set up the grid in words. Across the top, the first parent contributes T and t, so the two columns are headed T and t. Down the left side, the second parent contributes T and t, so the two rows are labeled T and t.`,
        `Fill the top-left box from column T and row T, which gives TT. Fill the top-right box from column t and row T, which gives Tt.`,
        `Fill the bottom-left box from column T and row t, which gives Tt. Fill the bottom-right box from column t and row t, which gives tt.`,
        `The four boxes are TT, Tt, Tt, tt. Count the genotypes: one TT, two Tt, one tt. So the genotype ratio is 1:2:1.`,
        `Now count phenotypes, which means asking what each box LOOKS like. TT is tall. Both Tt boxes are tall, because the dominant T shows whenever it is present. Only tt is short. That is three tall to one short, so the phenotype ratio is 3:1.`,
        `Same four boxes, two different answers. Read which one the question asked for before you write anything down.`,
      ],
      example: { problem: `In pea plants, tall (T) is dominant over short (t). Cross a Tt plant with another Tt plant. Give the genotype ratio and the phenotype ratio.`, solution: 'Genotype ratio 1 TT : 2 Tt : 1 tt. Phenotype ratio 3 tall : 1 short.' },
      relatedLoIds: ['m7sci.punnett-squares'],
    },
    {
      title: 'Worked reverse direction',
      steps: [
        `Work backwards from the offspring, because the short plant is the most informative thing in the problem.`,
        `Short is the recessive trait, so a short plant must be tt. There is no other genotype that looks short, since a single T would make it tall.`,
        `That short offspring got one allele from each parent. Both of those alleles are t. So each parent had a t to give.`,
        `But both parents are tall, so each parent must also carry at least one T. A plant with a T and a t is Tt.`,
        `Therefore both parents are Tt. Check it by running the cross forward: Tt by Tt gives TT, Tt, Tt, tt -- and tt is short, so a short offspring is possible. The prediction matches the observation.`,
        `Notice this is why two brown-eyed parents can have a blue-eyed child, which is the question from the start of the lesson. Both parents carried a recessive allele without showing it.`,
      ],
      example: { problem: `Two tall pea plants are crossed and one of their offspring is short. What are the genotypes of both parents, and how do you know?`, solution: `Both parents are Tt. The short offspring must be tt, so it received a recessive t from each parent; since both parents are tall, each must also carry a T.` },
      relatedLoIds: ['m7sci.punnett-squares'],
    },
  ],
  pointers: [
    { content: `Students often say "1:2:1" — Phenotype means the visible trait. TT is tall, Tt is tall because the dominant allele shows whenever it is present, and only tt is short. That is 3 tall to 1 short, so the phenotype ratio is 3:1. The habit that fixes this permanently: after filling the four boxes, go back and underline the word GENOTYPE or PHENOTYPE in the question before you count anything.`, kind: 'common-error' },
    { content: `Students often say "The ratio is 3:1, so in any four offspring exactly three will be tall." — The 3:1 describes the chance for EACH offspring independently: each has a 3 in 4 chance of being tall. Four offspring could easily be four tall, or two and two. It is the same reason four coin flips do not have to give exactly two heads. Over hundreds of offspring the real results get close to 3:1, but no small group is required to match it.`, kind: 'common-error' },
    { content: `Use the SAME letter for both alleles: capital for dominant, lowercase for recessive. T and t, never T and s.`, kind: 'tip' },
    { content: `Dominant means it shows when present. It does not mean better, stronger or more common.`, kind: 'tip' },
    { content: `Genotype is the letters (TT, Tt, tt). Phenotype is what you see. TT and Tt look the same.`, kind: 'tip' },
    { content: `Fill the four boxes by combining each column letter with each row letter, capital first.`, kind: 'tip' },
    { content: `Tt by Tt gives genotype 1:2:1 and phenotype 3:1 -- same boxes, two answers. Check which the question wants.`, kind: 'tip' },
    { content: `The square gives a probability for EACH offspring, never a guaranteed split within a litter.`, kind: 'tip' },
    { content: `Two parents showing a dominant trait can have offspring showing the recessive one, if both parents are heterozygous.`, kind: 'tip' },
    { content: `Underline **GENOTYPE** or **PHENOTYPE** in the question *before* you count boxes. Tt × Tt gives 1:2:1 for genotype and 3:1 for phenotype — same four boxes, two different answers. Writing the right ratio for the wrong question is the #1 mistake in this unit.`, kind: 'common-error' },
    { content: `A 3:1 ratio is a chance for EACH offspring, not a quota for the litter. Don't write "three of the four puppies will be tall." Write "each puppy has a 3 in 4 chance of being tall." Four coin flips don't have to give two heads.`, kind: 'gotcha' },
    { content: `Use the SAME letter twice: capital for dominant, lowercase for recessive. T and t are two alleles of one gene. T and s would be two *different genes* — always wrong on a one-trait cross. Write the capital first in each box: Tt, not tT.`, kind: 'vocab-note' },
    { content: `Dominant does NOT mean common, better, or stronger. It only means "shows when present." A recessive trait can be the one most organisms in a population have. Never argue an allele is dominant just because lots of individuals show that trait.`, kind: 'gotcha' },
    { content: `TT and Tt look exactly the same. So if an organism SHOWS the dominant trait, you can't tell its genotype from looking — write it as T_ until you get more evidence. Only the recessive phenotype pins the genotype down instantly: short must be tt.`, kind: 'tip' },
    { content: `Two parents showing the dominant trait CAN have a recessive offspring — if both are Tt. Don't say the recessive trait "skipped" or "appeared out of nowhere." Both parents were carrying that hidden allele all along.`, kind: 'edge-case' },
    { content: `Not every cross gives 3:1. Bb × bb gives Bb, Bb, bb, bb — that's 1 black : 1 white. Don't memorize 3:1 as "the answer"; it only comes from heterozygous × heterozygous. Always fill your own boxes.`, kind: 'edge-case' },
    { content: `Ratios need labels. "3:1" alone doesn't say what. Write "3 tall : 1 short" or "1 TT : 2 Tt : 1 tt" so anyone reading it knows which question you answered.`, kind: 'tip' },
  ],
};
