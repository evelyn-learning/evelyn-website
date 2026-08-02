/**
 * Biology — Unit 7 CED 7.3: Population Genetics & Allele Frequencies.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.population-genetics.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U7_POPULATION_GENETICS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.population-genetics.v1',
  course: 'Biology',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Population Genetics & Allele Frequencies',
  planId: 'evelyn.hs.bio.population-genetics.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.population-genetics.v1' }],
  theory: [
    { loId: 'bio.population-genetics', kind: 'framework', title: 'The gene pool', content: `THE GENE POOL — stop thinking about one family and think about every allele in the whole population at once. That pile of alleles is the GENE POOL. A population EVOLVES when the proportions in that pile change from one generation to the next. That is the working definition of evolution at this level.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'Allele frequency vs genotype frequency', content: `ALLELE FREQUENCY VS GENOTYPE FREQUENCY — these are two different counts and mixing them up is the number-one error here. ALLELE frequency asks "out of all copies of this gene, what fraction are the recessive allele?" — that is q. GENOTYPE frequency asks "out of all individuals, what fraction are rr?" — that is q². An allele frequency of 0.4 does NOT mean 40% of individuals are recessive.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'The two equations', content: `THE TWO EQUATIONS — p is the frequency of the dominant allele, q the frequency of the recessive one, and since those are the only two options, p + q = 1. The genotypes then split as p² + 2pq + q² = 1. These are not laws of nature — they are BOOKKEEPING. They just say the parts add up to the whole.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'What each term counts', content: `WHAT EACH TERM COUNTS — p² is the fraction that is homozygous dominant, q² is the fraction that is homozygous recessive, and 2pq is the fraction that is heterozygous, the CARRIERS. The factor of 2 is there because a heterozygote can be assembled two ways: dominant from mom and recessive from dad, or the reverse. Drop the 2 and you undercount carriers by half — a very common slip.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'Start from what you can see', content: `START FROM WHAT YOU CAN SEE — you cannot look at a person and tell p² from 2pq, because both show the dominant trait. But you CAN see the recessive phenotype, and only rr shows it. So the recessive count hands you q² directly. From there: take the square root of q² to get q, then p = 1 − q, then 2pq for the carriers. Say the chain out loud — q², then q, then p — because it is the same three moves every time.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'The five conditions', content: `THE FIVE CONDITIONS — the frequencies hold steady from generation to generation only if all five of these are true: no mutation, no migration in or out, a very large population, completely random mating, and no natural selection. A population meeting all five is in HARDY-WEINBERG EQUILIBRIUM, which means it is NOT evolving.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'Why real populations evolve', content: `WHY REAL POPULATIONS EVOLVE — no real population meets all five conditions, which is exactly the point. The equilibrium is a baseline of "nothing happening", so when the actual frequencies drift away from it, something IS happening, and the condition that broke tells you what. The equation is most useful when it fails.` },
    { loId: 'bio.population-genetics', kind: 'framework', title: 'The forces that break it', content: `THE FORCES THAT BREAK IT — SELECTION shifts frequencies in a consistent direction because one phenotype survives and reproduces better. GENETIC DRIFT shifts them at random, and hits small populations hard: in a population of 20, one unlucky accident can erase an allele forever. A BOTTLENECK is drift after a crash (the cheetahs); a FOUNDER EFFECT is drift when a few individuals start a new isolated population and carry only a slice of the original gene pool. GENE FLOW is alleles moving in or out with migrants, which tends to make neighboring populations more alike.` },
    { loId: 'bio.population-genetics', kind: 'definition', title: 'gene pool', content: 'all the alleles for all the genes carried by every member of a population.' },
    { loId: 'bio.population-genetics', kind: 'definition', title: 'allele frequency', content: `the fraction of all copies of a gene in a population that are one particular allele.` },
    { loId: 'bio.population-genetics', kind: 'definition', title: 'genetic drift', content: `random change in allele frequency from one generation to the next, strongest in small populations.` },
    { loId: 'bio.population-genetics', kind: 'definition', title: 'gene flow', content: `the movement of alleles into or out of a population when individuals migrate and breed.` },
  ],
  methods: [
    {
      title: 'Worked from recessive phenotype',
      steps: [
        `Turn the count into a frequency. 80 plain-shelled snails out of 500 is 80 divided by 500, which is 0.16 — so 16% show the recessive phenotype.`,
        `Name what that number is. Only homozygous recessive snails show the plain shell, so that 0.16 is q², the frequency of the homozygous recessive GENOTYPE. It is not q — do not stop here.`,
        `Take the square root to get the allele frequency: q² = 0.16, so q = 0.4. Forty percent of all the shell-color alleles in this gene pool are the recessive one.`,
        'Get p from p + q = 1: p = 1 − 0.4 = 0.6.',
        `Find the heterozygotes with 2pq: 2 × 0.6 × 0.4 = 0.48, so 48% of the snails are heterozygous — banded shells carrying a hidden plain allele.`,
        `Check that the three genotype fractions add to 1: p² = 0.36, plus 2pq = 0.48, plus q² = 0.16, gives exactly 1.00. Notice the payoff — 16% LOOK plain, but 48% CARRY the plain allele, three times as many carriers as visible recessives.`,
      ],
      example: { problem: `In a population of snails, shell color is controlled by one gene: banded shell is dominant and plain shell is recessive. Biologists count 500 snails and find that 80 of them have plain shells. Assuming this population is in Hardy-Weinberg equilibrium, find the frequency of the recessive allele, the frequency of the dominant allele, and the fraction of the population that is heterozygous.`, solution: `q = 0.4 and p = 0.6; the genotypes are 36% homozygous dominant, 48% heterozygous, and 16% homozygous recessive.` },
      relatedLoIds: ['bio.population-genetics'],
    },
    {
      title: 'Worked frequency change',
      steps: [
        `Convert both surveys to allele frequencies so you are comparing the same kind of number. Then: q² = 0.16, so q = 0.4. Now: q² = 0.04, so q = 0.2. The recessive allele frequency was cut in half, from 0.4 to 0.2.`,
        `Update p for the new survey: p = 1 − 0.2 = 0.8. The dominant allele went from 0.6 up to 0.8.`,
        `Do not stop at the visible snails — check the carriers too. Then: 2pq = 2 × 0.6 × 0.4 = 0.48. Now: 2pq = 2 × 0.8 × 0.2 = 0.32. So the plain allele is still being carried by nearly a third of the population even though only 4% show it. A recessive allele hides in heterozygotes and is very hard to eliminate completely.`,
        `Draw the conclusion. Allele frequencies MOVED across generations, so by definition this population evolved, and at least one Hardy-Weinberg condition was violated. The equation did not fail — it did its job by showing you the change.`,
        `Name a plausible cause. A steady, directional drop like this fits natural selection — for example, shorebirds spotting plain shells more easily against a banded-pebble beach. But a large enough population makes random drift an unlikely explanation, and migration or non-random mating would fit different patterns, so the frequencies tell you THAT it evolved while the biology tells you WHY.`,
      ],
      example: { problem: `Those same snails live on a beach. Twenty generations later, biologists resurvey the population and now only 4% of the snails have plain shells, down from 16%. Interpret this change: what happened to the allele frequencies, and what does the change tell you about the population?`, solution: `q fell from 0.4 to 0.2 and p rose from 0.6 to 0.8, with carriers dropping from 48% to 32% — the frequencies changed, so the population evolved and at least one Hardy-Weinberg condition was broken.` },
      relatedLoIds: ['bio.population-genetics'],
    },
  ],
  pointers: [
    { content: `The 25% counts INDIVIDUALS showing the recessive trait, and those individuals are homozygous recessive — so that number is q², not q. Take the square root first: q = 0.5, then p = 1 − 0.5 = 0.5, and carriers are 2pq = 2 × 0.5 × 0.5 = 0.50, or 50%. A good habit: whenever a problem hands you a percentage you could observe by LOOKING at the organisms, it is a genotype frequency, and the square root is your first move.`, kind: 'common-error' },
    { content: `A gene pool is every allele in a population; evolution is those frequencies changing across generations.`, kind: 'tip' },
    { content: `p + q = 1 for alleles; p² + 2pq + q² = 1 for genotypes — p² is homozygous dominant, 2pq is the heterozygous carriers, q² is homozygous recessive. Never drop the 2.`, kind: 'tip' },
    { content: `You can only SEE the recessive phenotype, so it hands you q². The chain is always q², then q, then p, then 2pq.`, kind: 'tip' },
    { content: `The five conditions for equilibrium: no mutation, no migration, a very large population, random mating, no selection.`, kind: 'tip' },
    { content: `Real populations break those conditions, which is exactly why they evolve — through selection, genetic drift (bottleneck and founder effects), and gene flow.`, kind: 'tip' },
    { content: `A visible percentage of recessive-trait individuals is **q², not q**. Take the square root first. If 25% show the trait, q = 0.5 (not 0.25). Rule of thumb: anything you could count by *looking* at organisms is a genotype/phenotype frequency.`, kind: 'common-error' },
    { content: `Never drop the 2 in **2pq**. A heterozygote can be assembled two ways (dominant from mom or from dad), so leaving it off halves your carrier count. Sanity check: p² + 2pq + q² must equal exactly 1.00.`, kind: 'common-error' },
    { content: `"Dominant" does not mean "more common." p can easily be smaller than q — dominance is about which allele masks the other in a heterozygote, not about frequency in the gene pool.`, kind: 'vocab-note' },
    { content: `The dominant phenotype lumps together p² **and** 2pq — you cannot tell them apart by eye. So a problem can never hand you p² directly from a survey; you must work from the recessive phenotype backwards.`, kind: 'gotcha' },
    { content: `Hardy-Weinberg equilibrium means the population is **not** evolving. Saying "the population is in equilibrium, so it evolved" is backwards. If frequencies changed across generations, at least one of the five conditions was broken.`, kind: 'vocab-note' },
    { content: `Genetic drift is **random and direction-free**; selection is **consistent and directional**. A steady one-way slide in q over 20 generations in a large population points to selection, not drift — drift barely moves large populations.`, kind: 'gotcha' },
    { content: `Bottleneck and founder effect are both *types of drift*, not separate forces. Bottleneck = a crash shrinks an existing population; founder effect = a few individuals leave and start a new one. Don't call founder effect "gene flow."`, kind: 'vocab-note' },
    { content: `A recessive allele never disappears just because the recessive phenotype gets rare. When q² drops to 4%, 2pq is still 32% — the allele hides in carriers, so selection against recessives is extremely slow at low frequencies.`, kind: 'edge-case' },
  ],
};
