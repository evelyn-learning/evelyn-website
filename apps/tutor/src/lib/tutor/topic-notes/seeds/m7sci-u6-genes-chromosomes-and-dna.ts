/**
 * Grade 7 Science — Unit 6 CED 6.1: Genes, Chromosomes & DNA.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.genes-chromosomes-and-dna.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U6_GENES_CHROMOSOMES_AND_DNA: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.genes-chromosomes-and-dna.v1',
  course: 'Grade 7 Science',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Genes, Chromosomes & DNA',
  planId: 'evelyn.ms.m7sci.genes-chromosomes-and-dna.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.genes-chromosomes-and-dna.v1' }],
  theory: [
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `DNA IS THE MOLECULE, AND IT IS SHAPED LIKE A TWISTED LADDER. The two long sides are the rails. Each rung of the ladder is a PAIR OF BASES, and there are only four bases, called A, T, C and G. The pairing is strict: A always pairs with T, and C always pairs with G. The whole ladder is twisted, which is why it is also called a DOUBLE HELIX. The message is the ORDER of the bases along the rails, the way the order of letters is what makes a word.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `A GENE IS A SECTION OF DNA. Not a different substance -- a stretch of the same molecule, carrying the instructions for one thing about the organism, such as the color of a flower. A chromosome carries many genes, one after another along its length.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `A CHROMOSOME IS ONE LONG STRAND OF DNA, PACKED UP TIGHTLY so it fits and does not tangle. Think of a very long shoelace wound around itself. So the nesting goes: bases pair up to build DNA, a section of that DNA is a gene, a long strand of DNA holding many genes is a chromosome, and in a plant or animal cell the chromosomes sit inside the NUCLEUS. That is the organelle from Unit 2 that holds the instructions and directs the cell.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `CHROMOSOMES COME IN PAIRS, AND ONE MEMBER OF EACH PAIR CAME FROM EACH PARENT. A human body cell holds 46 chromosomes, which is 23 pairs. The two chromosomes in a pair carry the same genes, in the same order, in the same places. That means the organism carries TWO COPIES of every gene on those chromosomes -- one from the mother and one from the father. The two copies can be slightly different versions of the gene, and a version of a gene is called an ALLELE. Two chromosomes in a pair is exactly why there are two alleles to work with in the lessons ahead.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `NEARLY EVERY CELL OF AN ORGANISM CARRIES THE SAME DNA. Your skin cells and your muscle cells hold the same instructions; they simply use different parts of them, the way two cooks with the same cookbook can make two different meals. WRONG: "DNA is only in special cells." CORRECT: "Almost every cell has the full set, and each kind of cell reads the pages it needs." The cookbook comparison stops there, though -- no cell reads anything, and nothing inside a cell chooses a page.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', content: `TWO WARNINGS. First, one gene does not usually control one visible trait in a simple way. Plenty of traits, such as how tall a person grows, involve several genes working together, and the environment matters too. Second, the NUMBER of chromosomes does not tell you how complicated an organism is. Some living things have more chromosomes than a human does and some have fewer, and there is no ranking hidden in that count.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'DNA', content: `the molecule that stores the instructions for an organism, shaped like a twisted ladder.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'base pair', content: 'one rung of the DNA ladder, always A with T or C with G.' },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'gene', content: 'a section of DNA that carries the instructions for a trait.' },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'chromosome', content: 'a long strand of DNA, packed tightly, that carries many genes.' },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'nucleus', content: `the organelle of a plant or animal cell that holds the chromosomes and directs the cell.` },
    { loId: 'm7sci.genes-chromosomes-and-dna', kind: 'definition', title: 'allele', content: `one version of a gene; an organism carries two copies of a gene, one inherited from each parent.` },
  ],
  methods: [
    {
      title: 'Worked order the nesting',
      steps: [
        `Start with the biggest container rather than guessing the whole list at once. The nucleus is a part of the cell, and the chromosomes are stored inside it, so the nucleus is the largest thing on the list.`,
        `Next, ask what is inside the nucleus. Chromosomes. Each chromosome is one long strand of DNA packed up tightly, so a chromosome comes second.`,
        `Now ask what a chromosome is made of. It carries many genes along its length, one after another. Since many genes fit on one chromosome, a gene is smaller than a chromosome, so a gene comes third.`,
        `That leaves the base pair. A gene is a long stretch of the ladder, made of many rungs, and each rung is one base pair. So a base pair is the smallest thing on the list. The order is nucleus, chromosome, gene, base pair.`,
        `Finally, DNA. This is where students get stuck, because DNA does not slot into the list as a size. DNA is the MATERIAL. A chromosome is made of DNA, a gene is a section of DNA, and a base pair is one rung of DNA. Asking whether DNA is bigger than a gene is like asking whether wool is bigger than a sleeve.`,
      ],
      example: { problem: `Put these four things in order from LARGEST to SMALLEST: a gene, a base pair, a chromosome, the nucleus of a cell. Then say where DNA belongs in that order.`, solution: `Largest to smallest: nucleus, chromosome, gene, base pair. DNA is not a step in that order at all -- it is the material the chromosome, the gene and the base pair are all made of.` },
      relatedLoIds: ['m7sci.genes-chromosomes-and-dna'],
    },
    {
      title: 'Worked two copies',
      steps: [
        `Start with how chromosomes are stored. They come in pairs. Whatever chromosome the height gene sits on, the plant has two of that chromosome, not one.`,
        `Ask where the two members of that pair came from. A sex cell from each parent carried one chromosome out of each pair. When the two sex cells joined, the offspring ended up with a pair again, one chromosome from each parent.`,
        `Now use the fact that the two chromosomes in a pair carry the same genes, in the same order, in the same places. The height gene sits at the same spot on both of them.`,
        `So the plant has two copies of the height gene: one on the chromosome from one parent, one on the chromosome from the other parent. That is the answer to the first half.`,
        `The two copies do not have to be the same version. One might be the version for a tall stem and the other the version for a short stem, or both might be the same version. A version of a gene is called an allele, so this plant carries two alleles for stem height.`,
        `One thing this lesson does NOT tell you: which version actually shows up in the plant when the two copies disagree. That is the question the next lesson answers.`,
      ],
      example: { problem: `A pea plant has a gene for stem height, and that gene sits at one particular place on one particular chromosome. Explain why the plant carries two copies of that gene, and what those two copies can be.`, solution: `Chromosomes come in pairs, with one member of the pair inherited from each parent, and both members carry the height gene at the same place. So the plant has two copies of that gene -- two alleles -- and they may be the same version as each other or two different versions.` },
      relatedLoIds: ['m7sci.genes-chromosomes-and-dna'],
    },
  ],
  pointers: [
    { content: `Students often say "Gene, chromosome and DNA all mean the same thing." — They are three different levels of the same nesting. DNA is the MATERIAL, the twisted ladder whose rungs pair A with T and C with G. A GENE is a SECTION of that DNA carrying the instructions for a trait. A CHROMOSOME is one long strand of DNA, packed tightly, carrying many genes along its length, and it sits inside the nucleus of a plant or animal cell. A useful test: a chromosome holds many genes, and a gene is made of many base pairs of DNA. If a sentence would still make sense with the words swapped, the levels have been flattened.`, kind: 'common-error' },
    { content: `Students often say "Each gene controls exactly one thing you can see, so there is a gene for being tall and a gene for being good at sports." — Some traits do follow one gene closely, and those are the ones used to teach the topic because they are simple enough to predict. But many traits, such as how tall a person grows, involve several genes working together, and the environment plays a part as well. So the honest version is: a gene carries instructions, and for many traits several genes contribute to the result.`, kind: 'common-error' },
    { content: `DNA is a twisted ladder. Each rung is a pair of bases, and the pairing is always A with T and C with G.`, kind: 'tip' },
    { content: `A gene is a SECTION of DNA carrying instructions for a trait. A chromosome is a long strand of DNA carrying many genes.`, kind: 'tip' },
    { content: `The nesting, largest to smallest: nucleus, chromosome, gene, base pair. DNA is the material all of them are made of.`, kind: 'tip' },
    { content: `Chromosomes come in pairs, one member of each pair from each parent -- which is why an organism carries two copies, two alleles, of each gene on them.`, kind: 'tip' },
    { content: 'A human body cell holds 46 chromosomes, or 23 pairs.', kind: 'tip' },
    { content: `Nearly every cell of an organism carries the same DNA; different kinds of cell use different parts of it.`, kind: 'tip' },
    { content: `Many traits involve several genes, and the number of chromosomes says nothing about how complicated an organism is.`, kind: 'tip' },
    { content: `Don't put DNA on the size list. Nucleus > chromosome > gene > base pair. DNA is the *material* all three are made of, not a step in the order. Asking "is DNA bigger than a gene?" is like asking if wool is bigger than a sleeve.`, kind: 'common-error' },
    { content: `Gene, chromosome and DNA are NOT three names for the same thing. Quick test: if you can swap the words in your sentence and it still sounds fine, you've flattened the levels. Say "a chromosome carries many genes" and "a gene is made of many base pairs."`, kind: 'vocab-note' },
    { content: `"Gene" and "allele" are not the same word. The gene is the instruction slot (stem height). An allele is one *version* in that slot (tall or short). Every organism has two alleles of a gene because it has two of that chromosome.`, kind: 'vocab-note' },
    { content: `Base pairing is strict: A–T and C–G only. There is no A–C or T–G rung. If you write a partner strand, check every rung — one wrong letter means the whole answer is wrong.`, kind: 'gotcha' },
    { content: `Avoid "there's a gene for being tall" or "a gene for being good at sports." Many traits, like height, come from several genes plus the environment. One-gene traits are used in class because they're simple, not because they're typical.`, kind: 'common-error' },
    { content: `Every cell has the *full* set of DNA — skin, muscle, bone. Different cell types just use different parts. Don't say a muscle cell "has the muscle DNA." And don't say a cell "chooses" or "reads" pages; nothing inside a cell decides anything.`, kind: 'gotcha' },
    { content: `More chromosomes does not mean more complicated. Some plants and animals have far more than a human's 46. Never rank organisms by chromosome count.`, kind: 'edge-case' },
    { content: `This lesson does NOT tell you which allele shows up when the two copies disagree. If a question asks what the plant *looks like*, that's the next lesson. Here, just say it carries two alleles.`, kind: 'tip' },
  ],
};
