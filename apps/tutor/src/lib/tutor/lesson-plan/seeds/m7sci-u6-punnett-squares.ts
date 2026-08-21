/**
 * Grade 7 Science (Life Science) — Heredity: Punnett Squares.
 *
 * The procedure-led exemplar for the m7sci course (NGSS MS-LS3-2). One
 * procedure runs the whole lesson: split each parent's alleles, fill four
 * boxes, then read genotype or phenotype depending on what was asked.
 *
 * The two traps it is built to kill are (a) reporting a genotype ratio where
 * a phenotype ratio was asked, and (b) reading 3:1 as a guarantee about a
 * litter of four rather than a probability for each offspring independently.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every Punnett
 * square in this file is written out in words, and every item is solvable
 * from the text printed inside it. Never write "see the square above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U6_PUNNETT_SQUARES: LessonPlan = {
  id: 'evelyn.ms.m7sci.punnett-squares.v1',
  title: 'Punnett Squares & Predicting Traits',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.punnett-squares',
      standard: 'M7SCI-6.3',
      description:
        'Use a Punnett square to predict the genotypes and phenotypes of offspring from a one-trait cross, and express the result as a probability for each offspring rather than a guaranteed outcome (NGSS MS-LS3-2).',
    },
  ],
  prerequisites: ['m7sci.dominant-and-recessive-traits'],
  followUps: ['m7sci.mutations-and-variation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the square as a tool for predicting chance, using something the student already treats as chance.',
      script:
        'Two brown-eyed parents can have a blue-eyed child. That surprises people, and it sounds like a mistake until you can show why it is not. There is a four-box grid that predicts it in about thirty seconds. It works the same way a chart of coin-flip outcomes works: it does not tell you what WILL happen, it tells you what the chances are each time. Today we build that grid, fill it in, and get careful about the difference between what an offspring is carrying and what you can actually see.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-punnett',
      kind: 'concept',
      goal: 'Install allele vocabulary, the four-box procedure, and the genotype/phenotype and probability traps.',
      keyIdeas: [
        'AN ALLELE IS ONE VERSION OF A GENE, and every offspring gets one from each parent. We write them with the SAME letter: a capital for the dominant version and the same letter in lowercase for the recessive one. So T and t are two alleles of one gene. Using two different letters, like T and s, is always wrong -- different letters mean different genes.',
        'DOMINANT MEANS IT SHOWS WHEN PRESENT, not that it is better, stronger or more common. If a dominant allele is there at all, you see its trait. The recessive trait appears only when BOTH alleles are recessive. How common a trait is in a population is a completely separate question from whether it is dominant.',
        'GENOTYPE IS THE LETTERS; PHENOTYPE IS WHAT YOU SEE. TT and Tt are two different genotypes, but they give the SAME phenotype, because the dominant allele shows either way. TT is called homozygous (two the same), Tt is heterozygous (two different), tt is homozygous recessive. Confusing genotype with phenotype is the single most common mistake in this whole unit.',
        'THE PROCEDURE — split one parent across the top and the other down the left side, one allele per column and per row. Fill each of the four boxes by combining its column letter with its row letter, writing the capital first. Then count.',
        'READ THE QUESTION BEFORE YOU COUNT. A cross of Tt with Tt gives boxes TT, Tt, Tt, tt. The GENOTYPE ratio is 1 TT to 2 Tt to 1 tt, which is 1:2:1. The PHENOTYPE ratio is 3 showing the dominant trait to 1 showing the recessive, which is 3:1. Both come from the same four boxes. Reporting 1:2:1 when the question asked what you would SEE is the trap this lesson exists to fix.',
        'THE SQUARE GIVES A PROBABILITY, NOT A PROMISE. A 3:1 phenotype ratio means each offspring independently has a 3 in 4 chance of the dominant trait. WRONG: "Four puppies means exactly three tall and one short." RIGHT: "Each puppy has a 3 in 4 chance." A litter of four could easily come out all four the same way, exactly as four coin flips can all come up heads.',
      ],
      vocabulary: [
        { term: 'allele', definition: 'one version of a gene; offspring inherit one from each parent.' },
        { term: 'genotype', definition: 'the pair of alleles an organism carries, written as letters such as Tt.' },
        { term: 'phenotype', definition: 'the trait you can actually observe, such as tall or short.' },
        { term: 'homozygous', definition: 'having two identical alleles for a gene, such as TT or tt.' },
        { term: 'heterozygous', definition: 'having two different alleles for a gene, such as Tt.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-monohybrid',
      kind: 'worked_example',
      problem:
        'In pea plants, tall (T) is dominant over short (t). Cross a Tt plant with another Tt plant. Give the genotype ratio and the phenotype ratio.',
      steps: [
        'Set up the grid in words. Across the top, the first parent contributes T and t, so the two columns are headed T and t. Down the left side, the second parent contributes T and t, so the two rows are labeled T and t.',
        'Fill the top-left box from column T and row T, which gives TT. Fill the top-right box from column t and row T, which gives Tt.',
        'Fill the bottom-left box from column T and row t, which gives Tt. Fill the bottom-right box from column t and row t, which gives tt.',
        'The four boxes are TT, Tt, Tt, tt. Count the genotypes: one TT, two Tt, one tt. So the genotype ratio is 1:2:1.',
        'Now count phenotypes, which means asking what each box LOOKS like. TT is tall. Both Tt boxes are tall, because the dominant T shows whenever it is present. Only tt is short. That is three tall to one short, so the phenotype ratio is 3:1.',
        'Same four boxes, two different answers. Read which one the question asked for before you write anything down.',
      ],
      answer: 'Genotype ratio 1 TT : 2 Tt : 1 tt. Phenotype ratio 3 tall : 1 short.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reverse-direction',
      kind: 'worked_example',
      problem:
        'Two tall pea plants are crossed and one of their offspring is short. What are the genotypes of both parents, and how do you know?',
      steps: [
        'Work backwards from the offspring, because the short plant is the most informative thing in the problem.',
        'Short is the recessive trait, so a short plant must be tt. There is no other genotype that looks short, since a single T would make it tall.',
        'That short offspring got one allele from each parent. Both of those alleles are t. So each parent had a t to give.',
        'But both parents are tall, so each parent must also carry at least one T. A plant with a T and a t is Tt.',
        'Therefore both parents are Tt. Check it by running the cross forward: Tt by Tt gives TT, Tt, Tt, tt -- and tt is short, so a short offspring is possible. The prediction matches the observation.',
        'Notice this is why two brown-eyed parents can have a blue-eyed child, which is the question from the start of the lesson. Both parents carried a recessive allele without showing it.',
      ],
      answer:
        'Both parents are Tt. The short offspring must be tt, so it received a recessive t from each parent; since both parents are tall, each must also carry a T.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-read-the-square',
      kind: 'try_yourself',
      problem:
        'In guinea pigs, black fur (B) is dominant over white fur (b). A Bb guinea pig is crossed with a bb guinea pig. The four boxes come out Bb, Bb, bb, bb. What is the PHENOTYPE ratio?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1 black : 1 white', correct: true },
        { id: 'b', text: '2 Bb : 2 bb' },
        { id: 'c', text: '3 black : 1 white' },
        { id: 'd', text: 'All four will be black' },
      ],
      expectedAnswer: '1 black : 1 white',
      hints: [
        'Phenotype means what you can see. Go box by box and write down black or white for each one, rather than copying the letters.',
        'Bb has a dominant B in it, so it shows black. bb has no dominant allele, so it shows white. Now count how many of each.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-probability-not-promise',
      kind: 'try_yourself',
      problem:
        'A cross gives a phenotype ratio of 3 black to 1 white. A breeder gets a litter of four from this cross. What can she correctly expect?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly three will be black and exactly one will be white.' },
        { id: 'b', text: 'Each offspring has a 3 in 4 chance of being black, so all four could be black.', correct: true },
        { id: 'c', text: 'The first three will be black and the fourth will be white.' },
        { id: 'd', text: 'Three quarters of each individual offspring will be black.' },
      ],
      expectedAnswer: 'Each offspring has a 3 in 4 chance of being black, so all four could be black.',
      hints: [
        'A Punnett square predicts chances, the way a coin flip has a one in two chance of heads. Does flipping a coin four times guarantee exactly two heads?',
        'The ratio applies to each offspring separately, and each one is an independent event. Nothing keeps count of what the earlier offspring were.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-deduce-parent',
      kind: 'try_yourself',
      problem:
        'In a certain plant, purple flowers (P) are dominant over white flowers (p). A purple-flowered plant is crossed with a white-flowered plant, and about half the offspring are white. What is the genotype of the purple parent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'PP, because it is purple' },
        { id: 'b', text: 'pp, because it produced white offspring' },
        { id: 'c', text: 'Pp, because it passed a recessive allele to the white offspring', correct: true },
        { id: 'd', text: 'It cannot be determined from this cross' },
      ],
      expectedAnswer: 'Pp, because it passed a recessive allele to the white offspring',
      hints: [
        'A white offspring must be pp, so it received a p from EACH parent, including the purple one.',
        'The purple parent shows purple, so it carries at least one P. If it also handed down a p, what two letters must it have?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-genotype-phenotype',
      kind: 'misconception_check',
      question:
        'A student runs a Tt by Tt cross, gets the boxes TT, Tt, Tt, tt, and answers a question asking for the PHENOTYPE ratio by writing "1:2:1". What went wrong?',
      commonErrors: [
        {
          answer: '1:2:1',
          misconception:
            'Counting the letter combinations instead of counting what the offspring would look like. 1:2:1 is the genotype ratio, and it is a correct answer to a different question.',
          correctsTo:
            'Phenotype means the visible trait. TT is tall, Tt is tall because the dominant allele shows whenever it is present, and only tt is short. That is 3 tall to 1 short, so the phenotype ratio is 3:1. The habit that fixes this permanently: after filling the four boxes, go back and underline the word GENOTYPE or PHENOTYPE in the question before you count anything.',
        },
        {
          answer: 'The ratio is 3:1, so in any four offspring exactly three will be tall.',
          misconception:
            'Reading a probability as a quota, as though the four offspring divide up the ratio between them.',
          correctsTo:
            'The 3:1 describes the chance for EACH offspring independently: each has a 3 in 4 chance of being tall. Four offspring could easily be four tall, or two and two. It is the same reason four coin flips do not have to give exactly two heads. Over hundreds of offspring the real results get close to 3:1, but no small group is required to match it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Use the SAME letter for both alleles: capital for dominant, lowercase for recessive. T and t, never T and s.',
        'Dominant means it shows when present. It does not mean better, stronger or more common.',
        'Genotype is the letters (TT, Tt, tt). Phenotype is what you see. TT and Tt look the same.',
        'Fill the four boxes by combining each column letter with each row letter, capital first.',
        'Tt by Tt gives genotype 1:2:1 and phenotype 3:1 -- same boxes, two answers. Check which the question wants.',
        'The square gives a probability for EACH offspring, never a guaranteed split within a litter.',
        'Two parents showing a dominant trait can have offspring showing the recessive one, if both parents are heterozygous.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Punnett Squares & Predicting Traits' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
