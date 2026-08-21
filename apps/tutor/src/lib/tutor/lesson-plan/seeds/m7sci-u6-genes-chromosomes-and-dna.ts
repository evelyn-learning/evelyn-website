/**
 * Grade 7 Science (Life Science) — Heredity: Genes, Chromosomes & DNA.
 *
 * The opening row of the heredity unit (NGSS MS-LS3-1). The whole lesson is
 * one nesting: DNA is the molecule, a GENE is a section of DNA that carries
 * instructions for a trait, a CHROMOSOME is a long packaged strand of DNA
 * holding many genes, and in a plant or animal cell the chromosomes sit
 * inside the NUCLEUS (the Unit 2 tie-back).
 *
 * It also lays the foundation row 6.3 depends on: chromosomes come in pairs,
 * one member of each pair from each parent, which is exactly WHY an organism
 * carries two copies -- two alleles -- of every gene on those chromosomes.
 * Dominance is deliberately left to row 6.2, so the two versions of a gene
 * are described in words here and given their capital/lowercase letters later.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. The DNA ladder
 * is described in words, and every item is solvable from the text printed
 * inside it. Never write "look at the diagram".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U6_GENES_CHROMOSOMES_AND_DNA: LessonPlan = {
  id: 'evelyn.ms.m7sci.genes-chromosomes-and-dna.v1',
  title: 'Genes, Chromosomes & DNA',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.genes-chromosomes-and-dna',
      standard: 'M7SCI-6.1',
      description:
        'Explain how DNA, genes and chromosomes fit inside one another, describe DNA as a twisted ladder whose rungs pair A with T and C with G, and explain why chromosomes arriving in pairs gives an organism two copies of every gene (NGSS MS-LS3-1).',
    },
  ],
  prerequisites: ['m7sci.environment-and-growth'],
  followUps: ['m7sci.dominant-and-recessive-traits'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor heredity in something familiar, then point at the molecule that carries the instructions.',
      script:
        'Look at a family photo and you can usually tell who belongs to it. Same nose, same curly hair, same way of standing. Something got passed from the parents to the children, and it was not a photograph. It was a set of instructions, written as a chemical, packed into almost every cell of the body. People mix up the words for that set of instructions all the time, and they say gene when they mean chromosome, or DNA when they mean gene. Today we sort those three words out for good, because everything else in this unit sits on top of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nesting',
      kind: 'concept',
      goal: 'Build the DNA-gene-chromosome-nucleus nesting, describe the ladder, and set up two copies of every gene for the Punnett lesson.',
      keyIdeas: [
        'DNA IS THE MOLECULE, AND IT IS SHAPED LIKE A TWISTED LADDER. The two long sides are the rails. Each rung of the ladder is a PAIR OF BASES, and there are only four bases, called A, T, C and G. The pairing is strict: A always pairs with T, and C always pairs with G. The whole ladder is twisted, which is why it is also called a DOUBLE HELIX. The message is the ORDER of the bases along the rails, the way the order of letters is what makes a word.',
        'A GENE IS A SECTION OF DNA. Not a different substance -- a stretch of the same molecule, carrying the instructions for one thing about the organism, such as the color of a flower. A chromosome carries many genes, one after another along its length.',
        'A CHROMOSOME IS ONE LONG STRAND OF DNA, PACKED UP TIGHTLY so it fits and does not tangle. Think of a very long shoelace wound around itself. So the nesting goes: bases pair up to build DNA, a section of that DNA is a gene, a long strand of DNA holding many genes is a chromosome, and in a plant or animal cell the chromosomes sit inside the NUCLEUS. That is the organelle from Unit 2 that holds the instructions and directs the cell.',
        'CHROMOSOMES COME IN PAIRS, AND ONE MEMBER OF EACH PAIR CAME FROM EACH PARENT. A human body cell holds 46 chromosomes, which is 23 pairs. The two chromosomes in a pair carry the same genes, in the same order, in the same places. That means the organism carries TWO COPIES of every gene on those chromosomes -- one from the mother and one from the father. The two copies can be slightly different versions of the gene, and a version of a gene is called an ALLELE. Two chromosomes in a pair is exactly why there are two alleles to work with in the lessons ahead.',
        'NEARLY EVERY CELL OF AN ORGANISM CARRIES THE SAME DNA. Your skin cells and your muscle cells hold the same instructions; they simply use different parts of them, the way two cooks with the same cookbook can make two different meals. WRONG: "DNA is only in special cells." CORRECT: "Almost every cell has the full set, and each kind of cell reads the pages it needs." The cookbook comparison stops there, though -- no cell reads anything, and nothing inside a cell chooses a page.',
        'TWO WARNINGS. First, one gene does not usually control one visible trait in a simple way. Plenty of traits, such as how tall a person grows, involve several genes working together, and the environment matters too. Second, the NUMBER of chromosomes does not tell you how complicated an organism is. Some living things have more chromosomes than a human does and some have fewer, and there is no ranking hidden in that count.',
      ],
      vocabulary: [
        { term: 'DNA', definition: 'the molecule that stores the instructions for an organism, shaped like a twisted ladder.' },
        { term: 'base pair', definition: 'one rung of the DNA ladder, always A with T or C with G.' },
        { term: 'gene', definition: 'a section of DNA that carries the instructions for a trait.' },
        { term: 'chromosome', definition: 'a long strand of DNA, packed tightly, that carries many genes.' },
        { term: 'nucleus', definition: 'the organelle of a plant or animal cell that holds the chromosomes and directs the cell.' },
        { term: 'allele', definition: 'one version of a gene; an organism carries two copies of a gene, one inherited from each parent.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-order-the-nesting',
      kind: 'worked_example',
      problem:
        'Put these four things in order from LARGEST to SMALLEST: a gene, a base pair, a chromosome, the nucleus of a cell. Then say where DNA belongs in that order.',
      steps: [
        'Start with the biggest container rather than guessing the whole list at once. The nucleus is a part of the cell, and the chromosomes are stored inside it, so the nucleus is the largest thing on the list.',
        'Next, ask what is inside the nucleus. Chromosomes. Each chromosome is one long strand of DNA packed up tightly, so a chromosome comes second.',
        'Now ask what a chromosome is made of. It carries many genes along its length, one after another. Since many genes fit on one chromosome, a gene is smaller than a chromosome, so a gene comes third.',
        'That leaves the base pair. A gene is a long stretch of the ladder, made of many rungs, and each rung is one base pair. So a base pair is the smallest thing on the list. The order is nucleus, chromosome, gene, base pair.',
        'Finally, DNA. This is where students get stuck, because DNA does not slot into the list as a size. DNA is the MATERIAL. A chromosome is made of DNA, a gene is a section of DNA, and a base pair is one rung of DNA. Asking whether DNA is bigger than a gene is like asking whether wool is bigger than a sleeve.',
      ],
      answer:
        'Largest to smallest: nucleus, chromosome, gene, base pair. DNA is not a step in that order at all -- it is the material the chromosome, the gene and the base pair are all made of.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-copies',
      kind: 'worked_example',
      problem:
        'A pea plant has a gene for stem height, and that gene sits at one particular place on one particular chromosome. Explain why the plant carries two copies of that gene, and what those two copies can be.',
      steps: [
        'Start with how chromosomes are stored. They come in pairs. Whatever chromosome the height gene sits on, the plant has two of that chromosome, not one.',
        'Ask where the two members of that pair came from. A sex cell from each parent carried one chromosome out of each pair. When the two sex cells joined, the offspring ended up with a pair again, one chromosome from each parent.',
        'Now use the fact that the two chromosomes in a pair carry the same genes, in the same order, in the same places. The height gene sits at the same spot on both of them.',
        'So the plant has two copies of the height gene: one on the chromosome from one parent, one on the chromosome from the other parent. That is the answer to the first half.',
        'The two copies do not have to be the same version. One might be the version for a tall stem and the other the version for a short stem, or both might be the same version. A version of a gene is called an allele, so this plant carries two alleles for stem height.',
        'One thing this lesson does NOT tell you: which version actually shows up in the plant when the two copies disagree. That is the question the next lesson answers.',
      ],
      answer:
        'Chromosomes come in pairs, with one member of the pair inherited from each parent, and both members carry the height gene at the same place. So the plant has two copies of that gene -- two alleles -- and they may be the same version as each other or two different versions.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-nesting-relationship',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes how genes and chromosomes are related?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A chromosome is a long strand of DNA that carries many genes.', correct: true },
        { id: 'b', text: 'A chromosome is one short section inside a single gene.' },
        { id: 'c', text: 'Gene and chromosome are two words for exactly the same thing.' },
        { id: 'd', text: 'A gene is built by joining several chromosomes together.' },
      ],
      expectedAnswer: 'A chromosome is a long strand of DNA that carries many genes.',
      hints: [
        'Decide which one is the container and which one is the thing inside. Many of the smaller items fit along the length of the bigger one.',
        'A gene is a SECTION of DNA. A chromosome is a whole long strand of DNA with many of those sections on it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chromosome-pairs',
      kind: 'try_yourself',
      problem:
        'A human body cell contains 46 chromosomes, arranged as 23 pairs. Which statement about those pairs is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All 46 chromosomes came from the mother, and the father contributes them later.' },
        { id: 'b', text: 'One chromosome of each pair came from each parent, so the cell has two copies of every gene on them.', correct: true },
        { id: 'c', text: 'The 46 chromosomes are the 46 genes a person has.' },
        { id: 'd', text: 'The cell made a copy of each of its 23 chromosomes, so both members of a pair came from the same parent.' },
      ],
      expectedAnswer: 'One chromosome of each pair came from each parent, so the cell has two copies of every gene on them.',
      hints: [
        'Think about where a pair comes from. A sex cell from each parent carried one chromosome out of each pair, and the two joined.',
        'One of the wrong choices treats a chromosome as if it were a single gene. A chromosome carries many genes, so 46 chromosomes are nowhere near 46 genes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-dna-every-cell',
      kind: 'try_yourself',
      problem:
        'A scientist compares the DNA in a skin cell with the DNA in a muscle cell taken from the same person. What will she find?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The muscle cell has more chromosomes, because muscles do harder work.' },
        { id: 'b', text: 'The skin cell contains only skin genes and the muscle cell contains only muscle genes.' },
        { id: 'c', text: 'The two cells contain the same DNA, and each kind of cell uses a different part of it.', correct: true },
        { id: 'd', text: 'Only one of the two cells contains DNA, because DNA is stored in special cells.' },
      ],
      expectedAnswer: 'The two cells contain the same DNA, and each kind of cell uses a different part of it.',
      hints: [
        'Both cells grew from the same starting cell, and every copy carried the whole set of instructions along with it.',
        'Two cooks working from the same cookbook can still make two different meals. What changes is which pages get used, not which book they own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gene-equals-chromosome',
      kind: 'misconception_check',
      question:
        'A student writes: "A chromosome is the same thing as a gene, and a gene is the same thing as DNA. They are just three names scientists use for the instructions." What is wrong with that?',
      commonErrors: [
        {
          answer: 'Gene, chromosome and DNA all mean the same thing.',
          misconception:
            'Flattening three levels into one, because all three words show up in the same sentences and all three sound like they mean "the instructions".',
          correctsTo:
            'They are three different levels of the same nesting. DNA is the MATERIAL, the twisted ladder whose rungs pair A with T and C with G. A GENE is a SECTION of that DNA carrying the instructions for a trait. A CHROMOSOME is one long strand of DNA, packed tightly, carrying many genes along its length, and it sits inside the nucleus of a plant or animal cell. A useful test: a chromosome holds many genes, and a gene is made of many base pairs of DNA. If a sentence would still make sense with the words swapped, the levels have been flattened.',
        },
        {
          answer: 'Each gene controls exactly one thing you can see, so there is a gene for being tall and a gene for being good at sports.',
          misconception:
            'Reading "a gene carries instructions for a trait" as a promise that every visible feature traces back to a single gene acting alone.',
          correctsTo:
            'Some traits do follow one gene closely, and those are the ones used to teach the topic because they are simple enough to predict. But many traits, such as how tall a person grows, involve several genes working together, and the environment plays a part as well. So the honest version is: a gene carries instructions, and for many traits several genes contribute to the result.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'DNA is a twisted ladder. Each rung is a pair of bases, and the pairing is always A with T and C with G.',
        'A gene is a SECTION of DNA carrying instructions for a trait. A chromosome is a long strand of DNA carrying many genes.',
        'The nesting, largest to smallest: nucleus, chromosome, gene, base pair. DNA is the material all of them are made of.',
        'Chromosomes come in pairs, one member of each pair from each parent -- which is why an organism carries two copies, two alleles, of each gene on them.',
        'A human body cell holds 46 chromosomes, or 23 pairs.',
        'Nearly every cell of an organism carries the same DNA; different kinds of cell use different parts of it.',
        'Many traits involve several genes, and the number of chromosomes says nothing about how complicated an organism is.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Genes, Chromosomes & DNA' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
