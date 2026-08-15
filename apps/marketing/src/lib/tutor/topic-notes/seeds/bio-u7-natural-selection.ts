/**
 * Biology — Unit 7 CED 7.2: Natural Selection & Adaptation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.natural-selection.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U7_NATURAL_SELECTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.natural-selection.v1',
  course: 'Biology',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Natural Selection & Adaptation',
  planId: 'evelyn.hs.bio.natural-selection.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.natural-selection.v1' }],
  theory: [
    { loId: 'bio.natural-selection', kind: 'framework', title: 'The four conditions', content: `THE FOUR CONDITIONS — natural selection runs whenever all four are true: (1) OVERPRODUCTION — more offspring are born than can survive; (2) HERITABLE VARIATION — individuals differ, and the differences are passed on genetically; (3) COMPETITION — limited food, space, mates and safety mean a struggle for those resources; (4) DIFFERENTIAL REPRODUCTIVE SUCCESS — individuals with certain variants leave more offspring than others. Miss any one condition and the population's traits do not shift.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'Fitness is reproductive success', content: `FITNESS IS REPRODUCTIVE SUCCESS — fitness means how many surviving offspring an organism leaves, NOT how strong or fast it is. A small, dull, slow organism that leaves twenty offspring is fitter than a large, fast one that leaves two. "Survival of the fittest" is really "reproduction of the fittest," and it is always fitness in the CURRENT environment — the fittest beetle in a sprayed field is not the fittest beetle in an unsprayed one.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'Populations evolve, individuals do not', content: `POPULATIONS EVOLVE, INDIVIDUALS DO NOT — this is the single most important correction in the unit. An individual beetle is born with its genes and dies with them; it cannot change color during its life. What changes is the PROPORTION of green and brown beetles in the population, because different individuals leave different numbers of offspring. Evolution is a change in a population over generations, and only a population can have a proportion.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'The variation is already there', content: `THE VARIATION IS ALREADY THERE — the variants arise randomly by MUTATION (plus recombination in sexual reproducers), before the environment ever selects on them. A few bacteria in a colony carry a resistance mutation before any antibiotic arrives. The antibiotic does not create resistance; it removes everything else and lets the pre-existing variant take over the population.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: `Lamarck's error`, content: `LAMARCK'S ERROR — organisms cannot develop a trait because they need it. There is no mechanism by which needing longer legs makes your offspring long-legged. Watch for the giveaway phrasing in your own writing: "the bacteria became resistant so they could survive," "the insects adapted to the pesticide," "the giraffes stretched their necks." Rewrite every one of them as: the variation existed, the environment filtered it, the survivors reproduced.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'Selection acts on phenotypes', content: `SELECTION ACTS ON PHENOTYPES — the environment can only interact with what it can see, eat, catch or poison: the expressed trait. Genotypes change in frequency only as a consequence. This is why a harmful recessive allele hides for a long time in heterozygous carriers — selection never gets a look at it.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'Three patterns', content: `THREE PATTERNS — DIRECTIONAL selection favors one extreme and shifts the population toward it (beak depth increasing during a drought). STABILIZING selection favors the average and trims both extremes (human birth weight: very small and very large newborns both fare worse). DISRUPTIVE selection favors both extremes against the middle and can split a population in two.` },
    { loId: 'bio.natural-selection', kind: 'framework', title: 'Artificial selection is the same machine', content: `ARTIFICIAL SELECTION IS THE SAME MACHINE — when a breeder chooses which corn plants or which dogs reproduce, humans replace the environment as the filter. Every step is identical: pre-existing variation, a filter, differential reproduction. Modern corn, broccoli and every dog breed are the result, which is why artificial selection is the fastest demonstration that selection on heritable variation reshapes a population.` },
    { loId: 'bio.natural-selection', kind: 'definition', title: 'fitness', content: `an organism's reproductive success — the number of surviving offspring it leaves in its current environment.` },
    { loId: 'bio.natural-selection', kind: 'definition', title: 'adaptation', content: `a heritable trait that became common in a population because it raised reproductive success.` },
    { loId: 'bio.natural-selection', kind: 'definition', title: 'natural selection', content: `the process by which heritable variants that raise reproductive success become more common in a population over generations.` },
  ],
  methods: [
    {
      title: 'Worked four condition trace',
      steps: [
        `Check condition 1, OVERPRODUCTION: each female lays about 200 eggs but the meadow supports only about 1000 adults, so far more beetles are born than can possibly survive. Condition met.`,
        `Check condition 2, HERITABLE VARIATION: the population already contains two color variants, 900 green and 100 brown, and color is passed to offspring genetically. The brown variant arose earlier by random mutation — the birds did not create it. Condition met.`,
        `Check condition 3, COMPETITION: with far more beetles hatching than the meadow can feed and shelter, they compete for food and space, and all of them are exposed to hunting birds. Condition met.`,
        `Check condition 4, DIFFERENTIAL REPRODUCTIVE SUCCESS: against dark brown soil the green beetles are conspicuous and are eaten at a higher rate, so brown beetles survive to breed more often and leave more offspring. Condition met.`,
        `Now apply it across generations: no beetle changes color. Brown parents simply leave a larger share of the next generation, so the PROPORTION of brown rises each generation — perhaps to 300 of 1000, then 700, and so on.`,
        `State the result in population terms: after many generations most of the meadow is brown, not because any beetle adapted during its life, but because brown individuals out-reproduced green ones and the frequency of the brown variant climbed.`,
      ],
      example: { problem: `A meadow holds 1000 beetles: 900 are green and 100 are brown, and color is controlled by a gene passed to offspring. Birds hunt the meadow by sight, and the soil and dead leaves are dark brown, so green beetles stand out and brown beetles are hard to spot. Each female lays about 200 eggs, but the meadow can only support about 1000 adult beetles at a time. Walk through all four conditions of natural selection and predict what the population looks like after many generations.`, solution: `All four conditions hold, so the population shifts toward brown over generations — the frequency of the pre-existing brown variant rises because brown beetles leave more offspring, while no individual beetle ever changes color.` },
      relatedLoIds: ['bio.natural-selection'],
    },
    {
      title: 'Worked resistance not needed',
      steps: [
        `Name the error: the sentence has the bacteria acquiring a trait BECAUSE it was needed. That is Lamarck's error — need does not cause a trait, and an individual bacterium cannot rewrite its own genes on demand.`,
        `Establish where the variation actually came from: in a population of 10 billion cells, random mutation had already produced a handful of cells — say a few dozen — carrying a resistance variant. Those mutations happened before the drug was ever given, and they were random with respect to what the bacteria needed.`,
        `Describe what the antibiotic actually did: it acted as a filter, not a creator. It killed the vast majority of susceptible cells, which is why the patient felt better, while the few pre-existing resistant cells survived.`,
        `Follow the reproduction: the surviving resistant cells divide every 20 to 30 minutes with no competitors left for space and nutrients, so within days the population is rebuilt almost entirely from resistant descendants.`,
        `Explain the relapse: the returning infection is now a population in which the resistance variant is near 100 percent, so the same antibiotic has almost nothing left to kill.`,
        `Rewrite the sentence correctly: a few bacteria were already resistant by chance mutation; the antibiotic removed the rest; the survivors reproduced, so the POPULATION became resistant. Note that no single bacterium ever became resistant during its lifetime.`,
      ],
      example: { problem: `A patient is given an antibiotic for a bacterial infection of about 10 billion cells. The infection clears at first, then returns after ten days and the same antibiotic no longer works. A student writes: "The bacteria developed resistance because they needed to survive the antibiotic." Explain what is wrong with that sentence and give the correct account.`, solution: `The bacteria did not develop resistance because they needed it. Rare resistance mutations already existed by chance; the antibiotic killed the susceptible cells and the pre-existing resistant cells reproduced, so the population — not any individual — became resistant.` },
      relatedLoIds: ['bio.natural-selection'],
    },
  ],
  pointers: [
    { content: `The population evolved, not the mice. Some mice ALREADY carried variants for thicker fur, from random mutation, before the cold arrived. In the colder winters those mice survived and raised more pups than thin-furred mice did, so the proportion of thick-fur variants climbed generation after generation. Say it as: the variation existed, the cold filtered it, the survivors reproduced.`, kind: 'common-error' },
    { content: `Four conditions: overproduction, heritable variation, competition, and differential reproductive success. All four must hold.`, kind: 'tip' },
    { content: `Fitness = reproductive success in the current environment — surviving offspring, not strength or speed.`, kind: 'tip' },
    { content: `POPULATIONS evolve; individuals do not. What changes is the proportion of a variant across generations.`, kind: 'tip' },
    { content: `Variation already exists and arises randomly by mutation. The environment filters it — need never creates a trait.`, kind: 'tip' },
    { content: `Selection acts on phenotypes; directional shifts toward one extreme, stabilizing favors the average, disruptive favors both extremes.`, kind: 'tip' },
    { content: `Artificial selection (breeding) and antibiotic or pesticide resistance are the same machine running with a different filter.`, kind: 'tip' },
    { content: `Purge "in order to" and "because they needed to" from evolution writing. "The insects adapted to the pesticide" and "bacteria became resistant so they could survive" are Lamarckian. Rewrite as: the variant already existed → the environment filtered it → survivors reproduced.`, kind: 'common-error' },
    { content: `Never say an individual "evolved" or "adapted during its life." A beetle is born green and dies green. Only the PROPORTION of a variant in a population changes across generations — an individual has no proportion.`, kind: 'vocab-note' },
    { content: `Fitness ≠ strength, size, or speed. A small, slow male leaving 5 surviving chicks is fitter than a big dominant male leaving 2. Count surviving offspring, nothing else.`, kind: 'vocab-note' },
    { content: `Fitness is environment-specific and can flip. The fittest beetle in a sprayed field is not the fittest in an unsprayed one — always state fitness relative to the CURRENT environment, never as a permanent ranking.`, kind: 'gotcha' },
    { content: `Antibiotics and pesticides are filters, not creators. Mutations conferring resistance happen randomly BEFORE exposure. If your answer says the drug "caused" or "triggered" the mutation, it's wrong.`, kind: 'common-error' },
    { content: `Selection acts on phenotypes, not genotypes directly. That's why a harmful recessive allele persists — hidden in heterozygous carriers, selection never sees it, so it is never fully eliminated.`, kind: 'edge-case' },
    { content: `All four conditions must hold. Non-heritable variation (fur worn thin, muscles built by exercise) breaks condition 2 and stops selection cold — check that the trait is genetic before predicting any shift.`, kind: 'edge-case' },
    { content: `Don't call artificial selection a different process. Breeding corn or dogs runs the same machine — pre-existing variation, a filter, differential reproduction — with a human as the filter instead of predators or drought.`, kind: 'tip' },
  ],
};
