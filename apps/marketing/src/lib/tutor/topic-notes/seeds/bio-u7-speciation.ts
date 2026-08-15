/**
 * Biology — Unit 7 CED 7.4: Speciation & Patterns of Evolution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.speciation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U7_SPECIATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.speciation.v1',
  course: 'Biology',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Speciation & Patterns of Evolution',
  planId: 'evelyn.hs.bio.speciation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.speciation.v1' }],
  theory: [
    { loId: 'bio.speciation', kind: 'framework', title: 'The biological species concept', content: `THE BIOLOGICAL SPECIES CONCEPT — a species is a group of natural populations whose members interbreed and produce FERTILE offspring. Both halves matter. A mule is a living, healthy hybrid, but it is sterile, so horse and donkey stay two species. "They produced a baby" is not the test; "the baby can have babies" is.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Speciation is the loss of gene flow', content: `SPECIATION IS THE LOSS OF GENE FLOW — two populations become two species when genes stop moving between them. Whatever stops that exchange is called REPRODUCTIVE ISOLATION, and after enough generations apart the split becomes permanent even if the two groups meet again.` },
    { loId: 'bio.speciation', content: `PREZYGOTIC BARRIERS (no zygote ever forms) — HABITAT: the two groups live in different places within one region and never meet. TEMPORAL: they breed at different times of day or year. BEHAVIORAL: courtship songs, dances, or scents do not match, so neither responds. MECHANICAL: body structures do not physically fit. The sorting question is simply "did an egg ever get fertilized?" — if no, the barrier is prezygotic.` },
    { loId: 'bio.speciation', content: `POSTZYGOTIC BARRIERS (a hybrid forms, but the line still ends) — HYBRID INVIABILITY: the embryo develops poorly and dies young. HYBRID STERILITY: the hybrid grows up healthy but cannot reproduce, like the mule. Fertilization succeeded, so these are POST-zygotic; the block is on the next generation.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Allopatric speciation', content: `ALLOPATRIC SPECIATION — "other homeland". A physical barrier splits one population in two: a rising mountain range, a new river, a canyon, a strip of ocean between islands. Each side then faces its own selection pressures and drifts apart genetically. This is the most common route to new species.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Sympatric speciation', content: `SYMPATRIC SPECIATION — "same homeland". The population splits with NO geographic barrier, while everyone still lives in the same area. It happens when something else stops interbreeding: plants doubling their chromosome number in one generation, insects shifting to a new host plant they also mate on, or two groups evolving different mate preferences. A mountain, a river, or a canyon is a geographic barrier, so a case with one is allopatric — never sympatric.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Adaptive radiation', content: `ADAPTIVE RADIATION — one ancestral species spreading rapidly into many open niches and producing many descendant species. Darwin's finches filled seed-cracking, insect-picking, and cactus-feeding roles across the Galapagos islands; Hawaiian honeycreepers did the same, evolving curved beaks matched to particular native flowers.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Convergent, divergent, and coevolution', content: `CONVERGENT, DIVERGENT, AND COEVOLUTION — DIVERGENT evolution: related species grow LESS alike as they adapt to different conditions (the finch beaks). CONVERGENT evolution: UNRELATED species grow MORE alike because a shared problem has one good solution — sharks and dolphins both have streamlined bodies and fins, but a shark is a fish and a dolphin is a mammal, so similar looks are not evidence of close relationship. COEVOLUTION: two species act as each other's selection pressure and change in step, like a long-tubed flower and the long-tongued moth that pollinates it.` },
    { loId: 'bio.speciation', kind: 'framework', title: 'Tempo and endings', content: `TEMPO AND ENDINGS — GRADUALISM describes species changing slowly and steadily over long stretches; PUNCTUATED EQUILIBRIUM describes long stable periods interrupted by short bursts of rapid change, which is what many fossil sequences look like. Both are real patterns, not rival beliefs. And EXTINCTION is the normal ending: well over 99 percent of all species that ever lived are gone, so extinction is the rule and survival is the exception.` },
    { loId: 'bio.speciation', kind: 'definition', title: 'reproductive isolation', content: `any barrier that stops two populations from interbreeding successfully, ending gene flow between them.` },
    { loId: 'bio.speciation', kind: 'definition', title: 'allopatric speciation', content: `speciation that begins when a geographic barrier physically separates one population into two.` },
    { loId: 'bio.speciation', kind: 'definition', title: 'adaptive radiation', content: `the rapid spread of one ancestral species into many descendant species that fill different available niches.` },
  ],
  methods: [
    {
      title: 'Worked classify mode',
      steps: [
        `Ask the single sorting question first: is there a PHYSICAL barrier that keeps the two groups from ever meeting?`,
        `Scenario 1: a mountain range is exactly that — a geographic barrier. The eastern and western squirrels cannot reach each other, so gene flow stops for physical reasons. That is ALLOPATRIC ("other homeland") speciation.`,
        `Scenario 2: both fish forms share one lake, so nothing physical separates them. They could meet, but they do not mate — the barrier is behavioral mate choice paired with a shift in feeding depth.`,
        `Because the split happens with no geographic separation, scenario 2 is SYMPATRIC ("same homeland") speciation. Note that "same lake" is not enough on its own; what makes it sympatric is that the groups can still reach one another and simply do not interbreed.`,
      ],
      example: { problem: `Two scenarios. (1) A slow-rising mountain range cuts a valley of ground squirrels into an eastern group and a western group; after many thousands of generations the two groups no longer interbreed. (2) In one lake, a single fish species splits into a shallow-water form that feeds on snails and a deep-water form that feeds on plankton; the two forms live in the same lake but each now courts and spawns only with its own form. Classify each as allopatric or sympatric speciation.`, solution: `Scenario 1 is allopatric (a mountain range is a geographic barrier); scenario 2 is sympatric (one lake, no physical barrier, isolation by mate choice and feeding depth).` },
      relatedLoIds: ['bio.speciation'],
    },
    {
      title: 'Worked identify barrier',
      steps: [
        `Handle the pond first. In nature the two species never breed at the same time of year, so no egg is ever fertilized across species.`,
        `A barrier based on WHEN breeding happens is TEMPORAL isolation, and since no zygote forms, it is PREZYGOTIC.`,
        `Now the lab. Here fertilization was forced and it worked — a zygote did form and began developing.`,
        `The embryos then died before hatching, so the block acts after fertilization: that is HYBRID INVIABILITY, a POSTZYGOTIC barrier. Note it is inviability, not sterility, because the hybrid never survived to adulthood to be tested for fertility.`,
        `Cross-check the sorting rule: no zygote means prezygotic, zygote-then-failure means postzygotic. The pond is prezygotic, the lab is postzygotic.`,
      ],
      example: { problem: `Two closely related frog species share one pond. Species A calls and breeds in early spring; species B calls and breeds in midsummer. In a lab, biologists fertilize species A eggs with species B sperm; the embryos start developing but die before hatching. Name the isolating mechanism at work in the pond and the one at work in the lab, and label each prezygotic or postzygotic.`, solution: `In the pond: temporal isolation (different breeding seasons), prezygotic. In the lab: hybrid inviability (the embryos die after fertilization), postzygotic.` },
      relatedLoIds: ['bio.speciation'],
    },
  ],
  pointers: [
    { content: `The test is interbreeding that yields FERTILE offspring in natural populations. Male ligers are sterile, so the hybrid line ends, exactly as it does with the mule. Lions and tigers also do not overlap and breed in the wild; the cross took a zoo to arrange. Producing a living hybrid shows the two lineages are still close relatives, not that they are one species.`, kind: 'common-error' },
    { content: `A species interbreeds and produces FERTILE offspring — the mule is healthy but sterile, so horse and donkey stay two species.`, kind: 'tip' },
    { content: `Prezygotic barriers (habitat, temporal, behavioral, mechanical) stop fertilization; postzygotic barriers (hybrid inviability, hybrid sterility) act after a zygote forms. Sorting question: did an egg ever get fertilized?`, kind: 'tip' },
    { content: `Allopatric = split by a geographic barrier such as a mountain, river, canyon, or ocean; sympatric = split with no physical barrier at all.`, kind: 'tip' },
    { content: `Adaptive radiation fills open niches from one ancestor (Darwin's finches, Hawaiian honeycreepers); divergent evolution makes relatives less alike, convergent evolution makes unrelated species look alike, and coevolution changes two species in step.`, kind: 'tip' },
    { content: `Gradualism and punctuated equilibrium describe the tempo of change, and extinction is the normal fate of nearly every species that has ever lived.`, kind: 'tip' },
    { content: `"They produced offspring" is only half the species test. Always finish the sentence: **fertile** offspring. Ligers, mules, and zonkeys are living hybrids whose parents are still two species because the hybrid line dead-ends.`, kind: 'common-error' },
    { content: `Sort barriers with one question: *did a zygote ever form?* No fertilization → prezygotic (habitat, temporal, behavioral, mechanical). Fertilization then failure → postzygotic (inviability, sterility). Don't sort by "did they mate?"`, kind: 'tip' },
    { content: `Hybrid inviability ≠ hybrid sterility. Inviability = the embryo/juvenile dies. Sterility = the hybrid grows up healthy but can't reproduce. If it never reached adulthood, you can't call it sterile — you never tested it.`, kind: 'vocab-note' },
    { content: `If the scenario names a mountain, river, canyon, island, or ocean, it is **allopatric** — never sympatric. Sympatric means the two groups could physically reach each other and simply don't interbreed (polyploidy, host shift, mate choice).`, kind: 'gotcha' },
    { content: `Two groups in the same lake or on the same trees is not automatically sympatric — check whether a habitat barrier (shallow vs. deep water) is keeping them apart. Sharing a general region while occupying separate microhabitats is habitat isolation, a prezygotic barrier.`, kind: 'edge-case' },
    { content: `Convergent evolution means unrelated species look alike, so shared streamlined bodies or wings are NOT evidence of close relationship. Divergent evolution means relatives grow less alike. Ask "related or unrelated?" before you pick the word.`, kind: 'common-error' },
    { content: `Gradualism and punctuated equilibrium are two observed tempos of change, not competing sides of an argument — don't write that one 'disproves' the other. Both patterns show up in the fossil record.`, kind: 'gotcha' },
    { content: `Speciation isn't caused by the barrier itself — the barrier just stops gene flow. Selection and drift then act separately on each group. Say "gene flow stopped, so the populations diverged," not "the mountain made a new species."`, kind: 'tip' },
  ],
};
