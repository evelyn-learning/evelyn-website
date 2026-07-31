/**
 * Biology — Evolution: Population Genetics & Allele Frequencies.
 *
 * The quantitative-evolution plan for the HS Biology fan-out (NGSS HS-LS4-3).
 * Rebuilt at high-school pitch from the college-level Hardy-Weinberg
 * treatment: the algebra stays light (one square root of a clean decimal)
 * and the weight sits on interpretation — what a term COUNTS, and what a
 * frequency that MOVES tells you about the population. Every check is an
 * MCQ, with the numbers living in the choice text, because the classic
 * errors here (q for q², dropping the factor of 2, allele vs genotype)
 * are best surfaced as named wrong answers.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U7_POPULATION_GENETICS: LessonPlan = {
  id: 'evelyn.hs.bio.population-genetics.v1',
  title: 'Population Genetics & Allele Frequencies',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.population-genetics',
      standard: 'BIO-7.3',
      description:
        'Use allele and genotype frequencies, including p + q = 1 and p² + 2pq + q² = 1, to describe the gene pool of a population and to explain how drift, gene flow, and selection change those frequencies over generations (NGSS HS-LS4-3).',
    },
  ],
  prerequisites: ['bio.natural-selection'],
  followUps: ['bio.speciation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame allele frequencies as a way to describe a whole population at once, and evolution as those frequencies moving.',
      script:
        'Every cheetah alive today is nearly a genetic twin of every other cheetah. About ten thousand years ago the species crashed to a tiny handful of survivors, and the whole modern population was rebuilt from that handful — so a skin graft from one wild cheetah will often take on another, like siblings. Here is the flip side: a recessive condition that shows up in only 1 person in 10,000 can be carried, silently, by about 1 person in 50. Both facts come from the same idea — instead of tracking one family, we count alleles across an entire population. In this lesson you learn to do that counting, and evolution stops being a story and becomes a number that moves.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gene-pool-frequencies',
      kind: 'concept',
      goal: 'The gene pool, allele vs genotype frequency, the two bookkeeping equations, the q² → q → p move, the five conditions, and the forces that break them.',
      keyIdeas: [
        'THE GENE POOL — stop thinking about one family and think about every allele in the whole population at once. That pile of alleles is the GENE POOL. A population EVOLVES when the proportions in that pile change from one generation to the next. That is the working definition of evolution at this level.',
        'ALLELE FREQUENCY VS GENOTYPE FREQUENCY — these are two different counts and mixing them up is the number-one error here. ALLELE frequency asks "out of all copies of this gene, what fraction are the recessive allele?" — that is q. GENOTYPE frequency asks "out of all individuals, what fraction are rr?" — that is q². An allele frequency of 0.4 does NOT mean 40% of individuals are recessive.',
        'THE TWO EQUATIONS — p is the frequency of the dominant allele, q the frequency of the recessive one, and since those are the only two options, p + q = 1. The genotypes then split as p² + 2pq + q² = 1. These are not laws of nature — they are BOOKKEEPING. They just say the parts add up to the whole.',
        'WHAT EACH TERM COUNTS — p² is the fraction that is homozygous dominant, q² is the fraction that is homozygous recessive, and 2pq is the fraction that is heterozygous, the CARRIERS. The factor of 2 is there because a heterozygote can be assembled two ways: dominant from mom and recessive from dad, or the reverse. Drop the 2 and you undercount carriers by half — a very common slip.',
        'START FROM WHAT YOU CAN SEE — you cannot look at a person and tell p² from 2pq, because both show the dominant trait. But you CAN see the recessive phenotype, and only rr shows it. So the recessive count hands you q² directly. From there: take the square root of q² to get q, then p = 1 − q, then 2pq for the carriers. Say the chain out loud — q², then q, then p — because it is the same three moves every time.',
        'THE FIVE CONDITIONS — the frequencies hold steady from generation to generation only if all five of these are true: no mutation, no migration in or out, a very large population, completely random mating, and no natural selection. A population meeting all five is in HARDY-WEINBERG EQUILIBRIUM, which means it is NOT evolving.',
        'WHY REAL POPULATIONS EVOLVE — no real population meets all five conditions, which is exactly the point. The equilibrium is a baseline of "nothing happening", so when the actual frequencies drift away from it, something IS happening, and the condition that broke tells you what. The equation is most useful when it fails.',
        'THE FORCES THAT BREAK IT — SELECTION shifts frequencies in a consistent direction because one phenotype survives and reproduces better. GENETIC DRIFT shifts them at random, and hits small populations hard: in a population of 20, one unlucky accident can erase an allele forever. A BOTTLENECK is drift after a crash (the cheetahs); a FOUNDER EFFECT is drift when a few individuals start a new isolated population and carry only a slice of the original gene pool. GENE FLOW is alleles moving in or out with migrants, which tends to make neighboring populations more alike.',
      ],
      vocabulary: [
        { term: 'gene pool', definition: 'all the alleles for all the genes carried by every member of a population.' },
        { term: 'allele frequency', definition: 'the fraction of all copies of a gene in a population that are one particular allele.' },
        { term: 'genetic drift', definition: 'random change in allele frequency from one generation to the next, strongest in small populations.' },
        { term: 'gene flow', definition: 'the movement of alleles into or out of a population when individuals migrate and breed.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-from-recessive-phenotype',
      kind: 'worked_example',
      problem:
        'In a population of snails, shell color is controlled by one gene: banded shell is dominant and plain shell is recessive. Biologists count 500 snails and find that 80 of them have plain shells. Assuming this population is in Hardy-Weinberg equilibrium, find the frequency of the recessive allele, the frequency of the dominant allele, and the fraction of the population that is heterozygous.',
      steps: [
        'Turn the count into a frequency. 80 plain-shelled snails out of 500 is 80 divided by 500, which is 0.16 — so 16% show the recessive phenotype.',
        'Name what that number is. Only homozygous recessive snails show the plain shell, so that 0.16 is q², the frequency of the homozygous recessive GENOTYPE. It is not q — do not stop here.',
        'Take the square root to get the allele frequency: q² = 0.16, so q = 0.4. Forty percent of all the shell-color alleles in this gene pool are the recessive one.',
        'Get p from p + q = 1: p = 1 − 0.4 = 0.6.',
        'Find the heterozygotes with 2pq: 2 × 0.6 × 0.4 = 0.48, so 48% of the snails are heterozygous — banded shells carrying a hidden plain allele.',
        'Check that the three genotype fractions add to 1: p² = 0.36, plus 2pq = 0.48, plus q² = 0.16, gives exactly 1.00. Notice the payoff — 16% LOOK plain, but 48% CARRY the plain allele, three times as many carriers as visible recessives.',
      ],
      answer: 'q = 0.4 and p = 0.6; the genotypes are 36% homozygous dominant, 48% heterozygous, and 16% homozygous recessive.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-frequency-change',
      kind: 'worked_example',
      problem:
        'Those same snails live on a beach. Twenty generations later, biologists resurvey the population and now only 4% of the snails have plain shells, down from 16%. Interpret this change: what happened to the allele frequencies, and what does the change tell you about the population?',
      steps: [
        'Convert both surveys to allele frequencies so you are comparing the same kind of number. Then: q² = 0.16, so q = 0.4. Now: q² = 0.04, so q = 0.2. The recessive allele frequency was cut in half, from 0.4 to 0.2.',
        'Update p for the new survey: p = 1 − 0.2 = 0.8. The dominant allele went from 0.6 up to 0.8.',
        'Do not stop at the visible snails — check the carriers too. Then: 2pq = 2 × 0.6 × 0.4 = 0.48. Now: 2pq = 2 × 0.8 × 0.2 = 0.32. So the plain allele is still being carried by nearly a third of the population even though only 4% show it. A recessive allele hides in heterozygotes and is very hard to eliminate completely.',
        'Draw the conclusion. Allele frequencies MOVED across generations, so by definition this population evolved, and at least one Hardy-Weinberg condition was violated. The equation did not fail — it did its job by showing you the change.',
        'Name a plausible cause. A steady, directional drop like this fits natural selection — for example, shorebirds spotting plain shells more easily against a banded-pebble beach. But a large enough population makes random drift an unlikely explanation, and migration or non-random mating would fit different patterns, so the frequencies tell you THAT it evolved while the biology tells you WHY.',
      ],
      answer:
        'q fell from 0.4 to 0.2 and p rose from 0.6 to 0.8, with carriers dropping from 48% to 32% — the frequencies changed, so the population evolved and at least one Hardy-Weinberg condition was broken.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-for-p',
      kind: 'try_yourself',
      problem:
        'In a population of beetles, green shell is dominant and brown shell is recessive. A survey finds that 9% of the beetles have brown shells. Assuming Hardy-Weinberg equilibrium, what is the frequency of the DOMINANT allele, p?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'p = 0.91' },
        { id: 'b', text: 'p = 0.3' },
        { id: 'c', text: 'p = 0.7', correct: true },
        { id: 'd', text: 'p = 0.42' },
      ],
      expectedAnswer: 'p = 0.7',
      hints: [
        'The 9% you can see is a phenotype count, and only homozygous recessive beetles are brown — so 0.09 is q², not q.',
        'Take the square root of 0.09 to get q, then use p + q = 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-carrier-frequency',
      kind: 'try_yourself',
      problem:
        'In a population of rabbits, a recessive allele causes a white coat. Biologists find that 4% of the rabbits have white coats. Assuming Hardy-Weinberg equilibrium, what percentage of the rabbits are heterozygous carriers — normal-coated, but carrying one white allele?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '32% are carriers', correct: true },
        { id: 'b', text: '16% are carriers' },
        { id: 'c', text: '20% are carriers' },
        { id: 'd', text: '64% are carriers' },
      ],
      expectedAnswer: '32% are carriers',
      hints: [
        'Start from what you can see: 4% white means q² = 0.04, so find q first, then p.',
        'Carriers are the 2pq term — and the factor of 2 is not optional, because a heterozygote can be built two ways.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-change',
      kind: 'try_yourself',
      problem:
        'A biologist tracks a large population of field mice for 20 generations. At the start, the frequency of a recessive coat-color allele is q = 0.5. At the end, it is q = 0.2. What is the best interpretation of this result?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The population is still in Hardy-Weinberg equilibrium, because p + q always adds up to 1' },
        { id: 'b', text: '20% of the mice are now homozygous recessive for coat color' },
        { id: 'c', text: 'The recessive allele mutated into the dominant allele, converting one into the other' },
        { id: 'd', text: 'The population evolved — the allele frequencies changed, so at least one Hardy-Weinberg condition was violated', correct: true },
      ],
      expectedAnswer:
        'The population evolved — the allele frequencies changed, so at least one Hardy-Weinberg condition was violated',
      hints: [
        'Equilibrium means the frequencies hold STEADY across generations. Did these hold steady?',
        'Also check the trap in one of the other choices: q = 0.2 is an ALLELE frequency, so the fraction of homozygous recessive mice would be q², not q.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-allele-vs-genotype',
      kind: 'misconception_check',
      question:
        'A student is told that 25% of a population shows a recessive trait, and writes: "So q = 0.25, which means p = 0.75, and 2pq = 2(0.75)(0.25) = 0.375 are carriers." What went wrong?',
      commonErrors: [
        {
          answer: 'q = 0.25, p = 0.75, carriers = 37.5%',
          misconception:
            'Reading a visible PHENOTYPE percentage as an ALLELE frequency — using the 0.25 as q when it is actually q², and so skipping the square root entirely.',
          correctsTo:
            'The 25% counts INDIVIDUALS showing the recessive trait, and those individuals are homozygous recessive — so that number is q², not q. Take the square root first: q = 0.5, then p = 1 − 0.5 = 0.5, and carriers are 2pq = 2 × 0.5 × 0.5 = 0.50, or 50%. A good habit: whenever a problem hands you a percentage you could observe by LOOKING at the organisms, it is a genotype frequency, and the square root is your first move.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A gene pool is every allele in a population; evolution is those frequencies changing across generations.',
        'p + q = 1 for alleles; p² + 2pq + q² = 1 for genotypes — p² is homozygous dominant, 2pq is the heterozygous carriers, q² is homozygous recessive. Never drop the 2.',
        'You can only SEE the recessive phenotype, so it hands you q². The chain is always q², then q, then p, then 2pq.',
        'The five conditions for equilibrium: no mutation, no migration, a very large population, random mating, no selection.',
        'Real populations break those conditions, which is exactly why they evolve — through selection, genetic drift (bottleneck and founder effects), and gene flow.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Population Genetics & Allele Frequencies' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
