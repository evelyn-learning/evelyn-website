/**
 * Biology — Evolution: Natural Selection & Adaptation.
 *
 * The mechanism template for the HS Biology fan-out (NGSS HS-LS4-2, HS-LS4-3).
 * Nearly every error in this unit is the same error wearing a new coat: the
 * student lets an INDIVIDUAL do the evolving, or lets the environment hand out
 * the trait that was needed. The concept segment is therefore organized around
 * Darwin's four conditions and the two places students quietly leave them.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U7_NATURAL_SELECTION: LessonPlan = {
  id: 'evelyn.hs.bio.natural-selection.v1',
  title: 'Natural Selection & Adaptation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.natural-selection',
      standard: 'BIO-7.2',
      description:
        "Explain how the four conditions of natural selection — overproduction, heritable variation, competition, and differential reproductive success — cause a population's traits to shift over generations, and apply that mechanism to adaptation, artificial selection, and the evolution of antibiotic and pesticide resistance (NGSS HS-LS4-2, HS-LS4-3).",
    },
  ],
  prerequisites: ['bio.evidence-for-evolution'],
  followUps: ['bio.population-genetics'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame natural selection as a process happening right now, in hospitals and on farms, fast enough to watch.',
      script:
        'In a hospital ward, an infection that a routine antibiotic would have cleared ten years ago now shrugs the drug off. On a cotton farm, the spray that wiped out the beetles last season barely dents them this season. Nothing in those bacteria or beetles decided to toughen up — and yet the populations changed, in months. Natural selection is the process behind both, and it runs on four simple conditions. By the end of this lesson you will be able to check all four on any population and say exactly what will happen to it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-conditions',
      kind: 'concept',
      goal: "Darwin's four conditions, fitness as reproductive success, populations (not individuals) as the thing that evolves, and the three patterns of selection.",
      keyIdeas: [
        "THE FOUR CONDITIONS — natural selection runs whenever all four are true: (1) OVERPRODUCTION — more offspring are born than can survive; (2) HERITABLE VARIATION — individuals differ, and the differences are passed on genetically; (3) COMPETITION — limited food, space, mates and safety mean a struggle for those resources; (4) DIFFERENTIAL REPRODUCTIVE SUCCESS — individuals with certain variants leave more offspring than others. Miss any one condition and the population's traits do not shift.",
        'FITNESS IS REPRODUCTIVE SUCCESS — fitness means how many surviving offspring an organism leaves, NOT how strong or fast it is. A small, dull, slow organism that leaves twenty offspring is fitter than a large, fast one that leaves two. "Survival of the fittest" is really "reproduction of the fittest," and it is always fitness in the CURRENT environment — the fittest beetle in a sprayed field is not the fittest beetle in an unsprayed one.',
        'POPULATIONS EVOLVE, INDIVIDUALS DO NOT — this is the single most important correction in the unit. An individual beetle is born with its genes and dies with them; it cannot change color during its life. What changes is the PROPORTION of green and brown beetles in the population, because different individuals leave different numbers of offspring. Evolution is a change in a population over generations, and only a population can have a proportion.',
        'THE VARIATION IS ALREADY THERE — the variants arise randomly by MUTATION (plus recombination in sexual reproducers), before the environment ever selects on them. A few bacteria in a colony carry a resistance mutation before any antibiotic arrives. The antibiotic does not create resistance; it removes everything else and lets the pre-existing variant take over the population.',
        "LAMARCK'S ERROR — organisms cannot develop a trait because they need it. There is no mechanism by which needing longer legs makes your offspring long-legged. Watch for the giveaway phrasing in your own writing: \"the bacteria became resistant so they could survive,\" \"the insects adapted to the pesticide,\" \"the giraffes stretched their necks.\" Rewrite every one of them as: the variation existed, the environment filtered it, the survivors reproduced.",
        'SELECTION ACTS ON PHENOTYPES — the environment can only interact with what it can see, eat, catch or poison: the expressed trait. Genotypes change in frequency only as a consequence. This is why a harmful recessive allele hides for a long time in heterozygous carriers — selection never gets a look at it.',
        'THREE PATTERNS — DIRECTIONAL selection favors one extreme and shifts the population toward it (beak depth increasing during a drought). STABILIZING selection favors the average and trims both extremes (human birth weight: very small and very large newborns both fare worse). DISRUPTIVE selection favors both extremes against the middle and can split a population in two.',
        'ARTIFICIAL SELECTION IS THE SAME MACHINE — when a breeder chooses which corn plants or which dogs reproduce, humans replace the environment as the filter. Every step is identical: pre-existing variation, a filter, differential reproduction. Modern corn, broccoli and every dog breed are the result, which is why artificial selection is the fastest demonstration that selection on heritable variation reshapes a population.',
      ],
      vocabulary: [
        { term: 'fitness', definition: 'an organism\'s reproductive success — the number of surviving offspring it leaves in its current environment.' },
        { term: 'adaptation', definition: 'a heritable trait that became common in a population because it raised reproductive success.' },
        { term: 'natural selection', definition: 'the process by which heritable variants that raise reproductive success become more common in a population over generations.' },
      ],
      suggestedTools: ['show_diagram', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-four-condition-trace',
      kind: 'worked_example',
      problem:
        'A meadow holds 1000 beetles: 900 are green and 100 are brown, and color is controlled by a gene passed to offspring. Birds hunt the meadow by sight, and the soil and dead leaves are dark brown, so green beetles stand out and brown beetles are hard to spot. Each female lays about 200 eggs, but the meadow can only support about 1000 adult beetles at a time. Walk through all four conditions of natural selection and predict what the population looks like after many generations.',
      steps: [
        'Check condition 1, OVERPRODUCTION: each female lays about 200 eggs but the meadow supports only about 1000 adults, so far more beetles are born than can possibly survive. Condition met.',
        'Check condition 2, HERITABLE VARIATION: the population already contains two color variants, 900 green and 100 brown, and color is passed to offspring genetically. The brown variant arose earlier by random mutation — the birds did not create it. Condition met.',
        'Check condition 3, COMPETITION: with far more beetles hatching than the meadow can feed and shelter, they compete for food and space, and all of them are exposed to hunting birds. Condition met.',
        'Check condition 4, DIFFERENTIAL REPRODUCTIVE SUCCESS: against dark brown soil the green beetles are conspicuous and are eaten at a higher rate, so brown beetles survive to breed more often and leave more offspring. Condition met.',
        'Now apply it across generations: no beetle changes color. Brown parents simply leave a larger share of the next generation, so the PROPORTION of brown rises each generation — perhaps to 300 of 1000, then 700, and so on.',
        'State the result in population terms: after many generations most of the meadow is brown, not because any beetle adapted during its life, but because brown individuals out-reproduced green ones and the frequency of the brown variant climbed.',
      ],
      answer:
        'All four conditions hold, so the population shifts toward brown over generations — the frequency of the pre-existing brown variant rises because brown beetles leave more offspring, while no individual beetle ever changes color.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-resistance-not-needed',
      kind: 'worked_example',
      problem:
        'A patient is given an antibiotic for a bacterial infection of about 10 billion cells. The infection clears at first, then returns after ten days and the same antibiotic no longer works. A student writes: "The bacteria developed resistance because they needed to survive the antibiotic." Explain what is wrong with that sentence and give the correct account.',
      steps: [
        'Name the error: the sentence has the bacteria acquiring a trait BECAUSE it was needed. That is Lamarck\'s error — need does not cause a trait, and an individual bacterium cannot rewrite its own genes on demand.',
        'Establish where the variation actually came from: in a population of 10 billion cells, random mutation had already produced a handful of cells — say a few dozen — carrying a resistance variant. Those mutations happened before the drug was ever given, and they were random with respect to what the bacteria needed.',
        'Describe what the antibiotic actually did: it acted as a filter, not a creator. It killed the vast majority of susceptible cells, which is why the patient felt better, while the few pre-existing resistant cells survived.',
        'Follow the reproduction: the surviving resistant cells divide every 20 to 30 minutes with no competitors left for space and nutrients, so within days the population is rebuilt almost entirely from resistant descendants.',
        'Explain the relapse: the returning infection is now a population in which the resistance variant is near 100 percent, so the same antibiotic has almost nothing left to kill.',
        'Rewrite the sentence correctly: a few bacteria were already resistant by chance mutation; the antibiotic removed the rest; the survivors reproduced, so the POPULATION became resistant. Note that no single bacterium ever became resistant during its lifetime.',
      ],
      answer:
        'The bacteria did not develop resistance because they needed it. Rare resistance mutations already existed by chance; the antibiotic killed the susceptible cells and the pre-existing resistant cells reproduced, so the population — not any individual — became resistant.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-resistance-mechanism',
      kind: 'try_yourself',
      problem:
        'A farmer sprays a pesticide on a field of insects for several seasons. In the first season the spray kills about 99 percent of the insects; by the fourth season it kills only about 20 percent. Which statement best explains the change?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The insects developed resistance because they were exposed to the pesticide and needed to survive it' },
        { id: 'b', text: 'A few insects already carried resistance variants by random mutation; the spray killed the rest, and the survivors reproduced until resistance was common in the population', correct: true },
        { id: 'c', text: 'The individual insects that were sprayed slowly toughened up over their lifetimes and passed that toughness to their young' },
        { id: 'd', text: 'The pesticide caused mutations that gave the insects exactly the resistance trait they required' },
      ],
      expectedAnswer:
        'A few insects already carried resistance variants by random mutation; the spray killed the rest, and the survivors reproduced until resistance was common in the population',
      hints: [
        'Ask when the resistance variant first appeared: before the spray, or because of it?',
        'The spray is a filter, not a designer. Variation must already exist for selection to have something to act on, and it is the population, not any one insect, that changes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fitness-meaning',
      kind: 'try_yourself',
      problem:
        'In a bird population, large aggressive males win most territory fights but spend so much energy defending territory that each raises an average of 2 chicks that survive to adulthood. Smaller, less aggressive males sneak matings and each raises an average of 5 surviving chicks. Which males have higher fitness, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The large aggressive males, because fitness means being the strongest competitor' },
        { id: 'b', text: 'The large aggressive males, because they hold the best territory and live longest' },
        { id: 'c', text: 'Neither — fitness cannot be compared unless the two groups are the same size' },
        { id: 'd', text: 'The smaller males, because fitness means reproductive success and they leave 5 surviving offspring each versus 2', correct: true },
      ],
      expectedAnswer:
        'The smaller males, because fitness means reproductive success and they leave 5 surviving offspring each versus 2',
      hints: [
        'Write down the definition of fitness before you look at the birds again. What exactly is being counted?',
        'Fitness is measured in surviving offspring, not in fights won, size, or lifespan — compare 5 against 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-population-not-individual',
      kind: 'try_yourself',
      problem:
        'A population of moths on tree bark starts out 80 percent light-colored and 20 percent dark-colored. Soot from nearby factories darkens the bark, and over 30 generations the population becomes 15 percent light and 85 percent dark. Which statement describes what happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The population evolved: dark moths were harder for predators to see on the darkened bark, so they left more offspring and the proportion of dark moths rose over generations', correct: true },
        { id: 'b', text: 'The individual light moths gradually turned dark to match the sooty bark' },
        { id: 'c', text: 'The soot landed on the moths and stained them dark, and their offspring inherited the stain' },
        { id: 'd', text: 'The moths sensed the darker bark and produced dark offspring because dark offspring were what they needed' },
      ],
      expectedAnswer:
        'The population evolved: dark moths were harder for predators to see on the darkened bark, so they left more offspring and the proportion of dark moths rose over generations',
      hints: [
        'Note that dark moths made up 20 percent of the population BEFORE the bark darkened. What does that tell you about where the dark variant came from?',
        'No moth changes color during its life. Ask which choice changes only the PROPORTION of moths in the population across generations.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-individuals-adapt',
      kind: 'misconception_check',
      question:
        'A student writes: "When the winters got colder, the mice in the field adapted by growing thicker fur, and they passed that thicker fur on to their pups." What went wrong?',
      commonErrors: [
        {
          answer: 'The mice adapted by growing thicker fur because the winters demanded it',
          misconception:
            "Letting individuals do the evolving, and letting need cause the trait — Lamarck's error. An individual mouse's genes are fixed at birth, and no amount of cold instructs its offspring to be furrier.",
          correctsTo:
            'The population evolved, not the mice. Some mice ALREADY carried variants for thicker fur, from random mutation, before the cold arrived. In the colder winters those mice survived and raised more pups than thin-furred mice did, so the proportion of thick-fur variants climbed generation after generation. Say it as: the variation existed, the cold filtered it, the survivors reproduced.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four conditions: overproduction, heritable variation, competition, and differential reproductive success. All four must hold.',
        'Fitness = reproductive success in the current environment — surviving offspring, not strength or speed.',
        'POPULATIONS evolve; individuals do not. What changes is the proportion of a variant across generations.',
        'Variation already exists and arises randomly by mutation. The environment filters it — need never creates a trait.',
        'Selection acts on phenotypes; directional shifts toward one extreme, stabilizing favors the average, disruptive favors both extremes.',
        'Artificial selection (breeding) and antibiotic or pesticide resistance are the same machine running with a different filter.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Natural Selection & Adaptation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
