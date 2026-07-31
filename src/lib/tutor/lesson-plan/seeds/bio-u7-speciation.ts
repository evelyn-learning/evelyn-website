/**
 * Biology — Evolution: Speciation & Patterns of Evolution.
 *
 * The concept-heavy template for the HS Biology fan-out (NGSS HS-LS4-4,
 * HS-LS4-5). Speciation is a bookkeeping problem too: students must keep
 * straight WHERE the two populations are (allopatric vs sympatric) and
 * WHEN the barrier acts (before or after a zygote forms), so the concept
 * segment is organized around those two sorting questions. Every check is
 * an MCQ — the answers here are classifications, not numbers.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U7_SPECIATION: LessonPlan = {
  id: 'evelyn.hs.bio.speciation.v1',
  title: 'Speciation & Patterns of Evolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.speciation',
      standard: 'BIO-7.4',
      description:
        'Explain how reproductive isolation splits one population into two species, distinguish allopatric from sympatric speciation and prezygotic from postzygotic barriers, and describe the large-scale patterns those splits produce — adaptive radiation, convergence, divergence, coevolution, and extinction (NGSS HS-LS4-4, HS-LS4-5).',
    },
  ],
  prerequisites: ['bio.population-genetics'],
  followUps: ['bio.taxonomy-classification'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame speciation as the living process that keeps producing the diversity around us.',
      script:
        'A horse and a donkey can have a baby — a mule. Healthy, strong, famously stubborn, and unable to have babies of its own. That dead end is the clue: horses and donkeys are two species, not one. Meanwhile, on the Hawaiian Islands, a single ancestral songbird became more than fifty different birds, each with its own beak and its own flower. In this lesson you learn what actually makes two groups separate species, and how one lineage splits into many.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-splitting-a-lineage',
      kind: 'concept',
      goal: 'The species definition, the isolation barriers that enforce it, the two modes of speciation, and the patterns that follow.',
      keyIdeas: [
        'THE BIOLOGICAL SPECIES CONCEPT — a species is a group of natural populations whose members interbreed and produce FERTILE offspring. Both halves matter. A mule is a living, healthy hybrid, but it is sterile, so horse and donkey stay two species. "They produced a baby" is not the test; "the baby can have babies" is.',
        'SPECIATION IS THE LOSS OF GENE FLOW — two populations become two species when genes stop moving between them. Whatever stops that exchange is called REPRODUCTIVE ISOLATION, and after enough generations apart the split becomes permanent even if the two groups meet again.',
        'PREZYGOTIC BARRIERS (no zygote ever forms) — HABITAT: the two groups live in different places within one region and never meet. TEMPORAL: they breed at different times of day or year. BEHAVIORAL: courtship songs, dances, or scents do not match, so neither responds. MECHANICAL: body structures do not physically fit. The sorting question is simply "did an egg ever get fertilized?" — if no, the barrier is prezygotic.',
        'POSTZYGOTIC BARRIERS (a hybrid forms, but the line still ends) — HYBRID INVIABILITY: the embryo develops poorly and dies young. HYBRID STERILITY: the hybrid grows up healthy but cannot reproduce, like the mule. Fertilization succeeded, so these are POST-zygotic; the block is on the next generation.',
        'ALLOPATRIC SPECIATION — "other homeland". A physical barrier splits one population in two: a rising mountain range, a new river, a canyon, a strip of ocean between islands. Each side then faces its own selection pressures and drifts apart genetically. This is the most common route to new species.',
        'SYMPATRIC SPECIATION — "same homeland". The population splits with NO geographic barrier, while everyone still lives in the same area. It happens when something else stops interbreeding: plants doubling their chromosome number in one generation, insects shifting to a new host plant they also mate on, or two groups evolving different mate preferences. A mountain, a river, or a canyon is a geographic barrier, so a case with one is allopatric — never sympatric.',
        'ADAPTIVE RADIATION — one ancestral species spreading rapidly into many open niches and producing many descendant species. Darwin\'s finches filled seed-cracking, insect-picking, and cactus-feeding roles across the Galapagos islands; Hawaiian honeycreepers did the same, evolving curved beaks matched to particular native flowers.',
        'CONVERGENT, DIVERGENT, AND COEVOLUTION — DIVERGENT evolution: related species grow LESS alike as they adapt to different conditions (the finch beaks). CONVERGENT evolution: UNRELATED species grow MORE alike because a shared problem has one good solution — sharks and dolphins both have streamlined bodies and fins, but a shark is a fish and a dolphin is a mammal, so similar looks are not evidence of close relationship. COEVOLUTION: two species act as each other\'s selection pressure and change in step, like a long-tubed flower and the long-tongued moth that pollinates it.',
        'TEMPO AND ENDINGS — GRADUALISM describes species changing slowly and steadily over long stretches; PUNCTUATED EQUILIBRIUM describes long stable periods interrupted by short bursts of rapid change, which is what many fossil sequences look like. Both are real patterns, not rival beliefs. And EXTINCTION is the normal ending: well over 99 percent of all species that ever lived are gone, so extinction is the rule and survival is the exception.',
      ],
      vocabulary: [
        { term: 'reproductive isolation', definition: 'any barrier that stops two populations from interbreeding successfully, ending gene flow between them.' },
        { term: 'allopatric speciation', definition: 'speciation that begins when a geographic barrier physically separates one population into two.' },
        { term: 'adaptive radiation', definition: 'the rapid spread of one ancestral species into many descendant species that fill different available niches.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-mode',
      kind: 'worked_example',
      problem:
        'Two scenarios. (1) A slow-rising mountain range cuts a valley of ground squirrels into an eastern group and a western group; after many thousands of generations the two groups no longer interbreed. (2) In one lake, a single fish species splits into a shallow-water form that feeds on snails and a deep-water form that feeds on plankton; the two forms live in the same lake but each now courts and spawns only with its own form. Classify each as allopatric or sympatric speciation.',
      steps: [
        'Ask the single sorting question first: is there a PHYSICAL barrier that keeps the two groups from ever meeting?',
        'Scenario 1: a mountain range is exactly that — a geographic barrier. The eastern and western squirrels cannot reach each other, so gene flow stops for physical reasons. That is ALLOPATRIC ("other homeland") speciation.',
        'Scenario 2: both fish forms share one lake, so nothing physical separates them. They could meet, but they do not mate — the barrier is behavioral mate choice paired with a shift in feeding depth.',
        'Because the split happens with no geographic separation, scenario 2 is SYMPATRIC ("same homeland") speciation. Note that "same lake" is not enough on its own; what makes it sympatric is that the groups can still reach one another and simply do not interbreed.',
      ],
      answer: 'Scenario 1 is allopatric (a mountain range is a geographic barrier); scenario 2 is sympatric (one lake, no physical barrier, isolation by mate choice and feeding depth).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-identify-barrier',
      kind: 'worked_example',
      problem:
        'Two closely related frog species share one pond. Species A calls and breeds in early spring; species B calls and breeds in midsummer. In a lab, biologists fertilize species A eggs with species B sperm; the embryos start developing but die before hatching. Name the isolating mechanism at work in the pond and the one at work in the lab, and label each prezygotic or postzygotic.',
      steps: [
        'Handle the pond first. In nature the two species never breed at the same time of year, so no egg is ever fertilized across species.',
        'A barrier based on WHEN breeding happens is TEMPORAL isolation, and since no zygote forms, it is PREZYGOTIC.',
        'Now the lab. Here fertilization was forced and it worked — a zygote did form and began developing.',
        'The embryos then died before hatching, so the block acts after fertilization: that is HYBRID INVIABILITY, a POSTZYGOTIC barrier. Note it is inviability, not sterility, because the hybrid never survived to adulthood to be tested for fertility.',
        'Cross-check the sorting rule: no zygote means prezygotic, zygote-then-failure means postzygotic. The pond is prezygotic, the lab is postzygotic.',
      ],
      answer: 'In the pond: temporal isolation (different breeding seasons), prezygotic. In the lab: hybrid inviability (the embryos die after fertilization), postzygotic.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-mule-species',
      kind: 'try_yourself',
      problem:
        'A horse and a donkey mate and produce a mule. The mule is healthy and lives a long life, but it cannot produce offspring of its own. Under the biological species concept, what does this show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Horses and donkeys are one species, because they produced living offspring together' },
        { id: 'b', text: 'Horses and donkeys are one species, because the mule is healthy rather than sickly' },
        { id: 'c', text: 'Horses and donkeys are separate species, because their hybrid is sterile — a species must produce FERTILE offspring', correct: true },
        { id: 'd', text: 'Horses and donkeys are separate species, because the two never meet in the wild' },
      ],
      expectedAnswer: 'Horses and donkeys are separate species, because their hybrid is sterile — a species must produce FERTILE offspring',
      hints: [
        'The definition has two requirements, not one. Producing offspring is only the first.',
        'Ask what the mule itself can do: can it have babies? If the hybrid line ends, the parents belong to different species.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-canyon',
      kind: 'try_yourself',
      problem:
        'A deep river canyon cuts through a desert. Squirrels on the north rim and squirrels on the south rim descended from one population, but neither group can cross the canyon, and over many generations they have become unable to interbreed. Which mode of speciation is this, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Allopatric speciation — the canyon is a geographic barrier that physically separates the two populations', correct: true },
        { id: 'b', text: 'Sympatric speciation — both groups still live in the same desert region' },
        { id: 'c', text: 'Sympatric speciation — the squirrels are the same kind of animal, so no barrier counts as geographic' },
        { id: 'd', text: 'Neither — speciation cannot occur unless a mountain range separates the groups' },
      ],
      expectedAnswer: 'Allopatric speciation — the canyon is a geographic barrier that physically separates the two populations',
      hints: [
        'Ask the one sorting question: can members of the two groups physically reach each other?',
        'Canyons, rivers, mountain ranges, and stretches of ocean are all geographic barriers — sharing a broad region does not make a case sympatric.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-barrier-type',
      kind: 'try_yourself',
      problem:
        'Two species of fruit fly live on the same trees. Males of each species perform a distinctive wing-vibration courtship song, and females respond only to the song of their own species, so the two never mate. Which type of isolating mechanism is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Postzygotic — hybrid sterility, because no fertile hybrids are produced' },
        { id: 'b', text: 'Postzygotic — hybrid inviability, because the hybrid embryos die' },
        { id: 'c', text: 'Prezygotic — temporal isolation, because the flies court at different times' },
        { id: 'd', text: 'Prezygotic — behavioral isolation, because mismatched courtship signals stop mating before fertilization', correct: true },
      ],
      expectedAnswer: 'Prezygotic — behavioral isolation, because mismatched courtship signals stop mating before fertilization',
      hints: [
        'First decide pre- or post-: was an egg ever fertilized in this scenario?',
        'No mating occurred at all, so no zygote formed — that rules out both postzygotic options. Now ask what is doing the blocking: a courtship signal, a calendar, or an anatomy mismatch?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hybrid-proves-one-species',
      kind: 'misconception_check',
      question:
        'A student writes: "A lion and a tiger were bred in a zoo and produced a liger, so lions and tigers must really be the same species." What went wrong?',
      commonErrors: [
        {
          answer: 'Any hybrid offspring proves the two parents are one species',
          misconception: 'Applying only the first half of the biological species concept — "they can interbreed" — and dropping the requirement that the offspring be FERTILE.',
          correctsTo:
            'The test is interbreeding that yields FERTILE offspring in natural populations. Male ligers are sterile, so the hybrid line ends, exactly as it does with the mule. Lions and tigers also do not overlap and breed in the wild; the cross took a zoo to arrange. Producing a living hybrid shows the two lineages are still close relatives, not that they are one species.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A species interbreeds and produces FERTILE offspring — the mule is healthy but sterile, so horse and donkey stay two species.',
        'Prezygotic barriers (habitat, temporal, behavioral, mechanical) stop fertilization; postzygotic barriers (hybrid inviability, hybrid sterility) act after a zygote forms. Sorting question: did an egg ever get fertilized?',
        'Allopatric = split by a geographic barrier such as a mountain, river, canyon, or ocean; sympatric = split with no physical barrier at all.',
        'Adaptive radiation fills open niches from one ancestor (Darwin\'s finches, Hawaiian honeycreepers); divergent evolution makes relatives less alike, convergent evolution makes unrelated species look alike, and coevolution changes two species in step.',
        'Gradualism and punctuated equilibrium describe the tempo of change, and extinction is the normal fate of nearly every species that has ever lived.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Speciation & Patterns of Evolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
