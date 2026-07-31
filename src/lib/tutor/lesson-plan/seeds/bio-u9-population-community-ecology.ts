/**
 * Biology — Ecology: Population Growth, Limiting Factors & Community Interactions.
 *
 * The concept/process template applied to the ecology unit of the HS Biology
 * fan-out (NGSS HS-LS2-1, HS-LS2-2, HS-LS2-6). Every idea here is a sorting
 * task — J-curve vs S-curve, density-dependent vs density-independent, which
 * partner benefits, primary vs secondary succession — so the concept segment
 * is organized as a set of paired contrasts, and every check is an MCQ whose
 * distractors are the classic sorting errors. Growth curves are always
 * described in words, never referred to as a graph on screen.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U9_POPULATION_COMMUNITY_ECOLOGY: LessonPlan = {
  id: 'evelyn.hs.bio.population-community-ecology.v1',
  title: 'Population Growth, Limiting Factors & Community Interactions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.population-community-ecology',
      standard: 'BIO-9.4',
      description:
        'Explain how exponential and logistic growth, carrying capacity, and density-dependent versus density-independent limiting factors shape population size, and identify the community interactions and successional stages that follow a disturbance (NGSS HS-LS2-1, HS-LS2-2, HS-LS2-6).',
    },
  ],
  prerequisites: ['bio.biogeochemical-cycles'],
  followUps: ['bio.homeostasis-feedback'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame population limits as the reason no species ever takes over the world.',
      script:
        'In 1906 the Kaibab Plateau in Arizona held about 4,000 deer. Hunters removed the wolves and mountain lions to "help" the herd, and within twenty years there were tens of thousands of deer — and then most of them starved, because there was nothing left to eat. Nothing had changed except the number of deer. Every population, from those deer to the bacteria in a puddle, runs into a ceiling set by its environment. This lesson is about where that ceiling comes from, what pushes a population back down, and how a burned forest rebuilds itself afterwards.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-growth-limits-interactions',
      kind: 'concept',
      goal: 'The two growth shapes, carrying capacity, the two families of limiting factors, community interactions, and succession.',
      keyIdeas: [
        'EXPONENTIAL GROWTH (J-SHAPED) — when resources are unlimited and nothing eats or infects them, each generation adds more individuals than the last, so the curve starts almost flat and then sweeps upward ever more steeply. It is what happens to a few bacteria in fresh nutrient broth, or to an invasive species newly arrived somewhere with no predators. ERROR TO AVOID: exponential growth NEVER lasts. Something always runs out first, and a population that overshoots its limit does not stay there — it CRASHES, because deaths now outnumber births.',
        'LOGISTIC GROWTH (S-SHAPED) — the real-world pattern: slow start, a steep middle where resources are still plentiful, then a gradual bend until the population levels off and stays roughly flat. The flattening is not the population getting tired; it is births and deaths coming into balance because resources are running short.',
        'CARRYING CAPACITY (K) — the population size a particular environment can sustain over the long run, set by food, water, space, shelter and disease. It is the level the S-curve flattens out at. K is not a fixed property of the species: the same rabbits have a much higher K in a wet year than a dry one.',
        'DENSITY-DEPENDENT LIMITING FACTORS — these bite HARDER as the population gets more crowded: competition for food and space, disease and parasites (which spread faster when individuals are packed together), and predation (predators concentrate where prey is abundant). These are the factors that produce carrying capacity.',
        'DENSITY-INDEPENDENT LIMITING FACTORS — these hit with the same force no matter how crowded the population is: fire, flood, drought, a hard freeze, a hurricane. THE TEST TO APPLY: ask whether the factor would be worse if the population were twice as dense. A wildfire does not care how many deer are in the forest; a disease very much does.',
        'PREDATOR AND PREY CYCLE, ONE LAGGING BEHIND THE OTHER — plentiful prey lets predators raise more young, so the predator numbers rise AFTER the prey numbers rise. The growing predator population then drives prey numbers down, which starves the predators, which lets the prey recover. Neither peak lines up with the other; the predator peak always trails the prey peak.',
        'COMMUNITY INTERACTIONS — COMPETITION (two species need the same limited resource; both are held back), PREDATION (one eats the other), and the three SYMBIOSES: MUTUALISM, where both species benefit (bees and flowering plants); COMMENSALISM, where one benefits and the other is neither helped nor harmed (barnacles riding a whale); and PARASITISM, where one benefits and the other is harmed but usually not killed outright (ticks on a dog). Classify by asking what each partner gets, one partner at a time.',
        'ECOLOGICAL SUCCESSION — the predictable rebuilding of a community after ground opens up. PRIMARY succession starts on bare rock with NO soil (a new lava flow, land exposed by a retreating glacier); pioneer species such as lichens and mosses slowly break rock into soil, which takes centuries. SECONDARY succession starts where a disturbance such as a fire, a flood or abandoned farming has cleared the community but LEFT THE SOIL, along with surviving roots and seeds — so it is far faster. The presence or absence of soil is the whole distinction.',
      ],
      vocabulary: [
        { term: 'carrying capacity', definition: 'the population size an environment can sustain long-term, where the S-shaped growth curve levels off.' },
        { term: 'density-dependent factor', definition: 'a limiting factor whose effect grows stronger as the population becomes more crowded, such as disease or competition.' },
        { term: 'pioneer species', definition: 'the first organisms to colonize bare rock in primary succession, such as lichens, which begin building soil.' },
      ],
      suggestedTools: ['show_diagram', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-limiting-factors',
      kind: 'worked_example',
      problem:
        'A herd of deer in a valley has grown large over several good years. Three things then happen: (1) an unusually cold winter kills many fawns, (2) an outbreak of a respiratory infection spreads quickly through the crowded herd, and (3) the deer strip the low branches bare and many go hungry. Classify each as a density-dependent or density-independent limiting factor.',
      steps: [
        'Set up the one question that decides every case: would this factor hit HARDER if the herd were twice as crowded? If yes, it is density-dependent; if it would hit just as hard either way, it is density-independent.',
        'Cold winter: the temperature is the same whether there are 50 deer or 5,000, and a fawn in a sparse herd freezes just as readily. It hits regardless of crowding, so it is DENSITY-INDEPENDENT.',
        'Respiratory infection: an infected deer must be close enough to another deer to pass it on, and crowding makes those contacts far more frequent. Doubling the density speeds the outbreak, so it is DENSITY-DEPENDENT.',
        'Stripped branches and hunger: this is competition for a limited food supply. The more deer share the same browse, the less each one gets — the effect scales directly with crowding, so it is DENSITY-DEPENDENT.',
        'Sanity check on the pattern: the two density-dependent factors are exactly the ones that would push the herd back toward carrying capacity, while the cold snap would have struck a small herd just as hard.',
      ],
      answer: 'Cold winter = density-independent; disease outbreak = density-dependent; competition for food = density-dependent.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-identify-symbiosis',
      kind: 'worked_example',
      problem:
        'Identify the community interaction in each pair. (1) A hummingbird drinks nectar from a flower and carries the flower\'s pollen to the next plant. (2) A tapeworm lives in a wolf\'s intestine, absorbing nutrients from the food the wolf digests. (3) A small orchid grows perched on a high tree branch to reach sunlight; the tree is neither fed nor damaged by it.',
      steps: [
        'Use one rule for all three: take each partner separately and ask whether it is helped, harmed, or unaffected. Never judge the pair as a whole at once.',
        'Hummingbird and flower — bird: helped, it gets food. Flower: helped, its pollen is delivered. Both helped, so this is MUTUALISM.',
        'Tapeworm and wolf — tapeworm: helped, it gets nutrients. Wolf: harmed, it loses nutrients and may weaken, but it is not killed and eaten. One helped, one harmed, and the harmed one lives on, so this is PARASITISM, not predation.',
        'Orchid and tree — orchid: helped, it reaches the light. Tree: unaffected, it is neither fed nor damaged. One helped, one unaffected, so this is COMMENSALISM.',
        'Note the trap in case 3: because the orchid clearly gains, students often upgrade it to mutualism. Mutualism requires a benefit flowing BOTH ways, and here nothing flows back to the tree.',
      ],
      answer: 'Hummingbird and flower = mutualism; tapeworm and wolf = parasitism; orchid and tree = commensalism.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-drought',
      kind: 'try_yourself',
      problem:
        'A severe drought dries up the streams in a grassland and many antelope die. Which kind of limiting factor is the drought, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Density-dependent, because the more antelope there are, the less water each one gets' },
        { id: 'b', text: 'Density-dependent, because drought makes disease spread through the herd' },
        { id: 'c', text: 'Density-independent, because the drought strikes with the same force whether the herd is large or small', correct: true },
        { id: 'd', text: 'Density-independent, because droughts only affect plants and never affect animal populations' },
      ],
      expectedAnswer: 'Density-independent, because the drought strikes with the same force whether the herd is large or small',
      hints: [
        'Apply the sorting question: would the drought itself be worse if the herd were twice as crowded?',
        'Weather events — fire, flood, drought, hard freezes — arrive regardless of how many individuals are present.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-read-growth-curve',
      kind: 'try_yourself',
      problem:
        'Ecologists tracked a rabbit population on an island for 30 years. It began at about 40 rabbits and rose slowly for the first few years, then climbed steeply through the middle years, then bent over and levelled off near 800, where it has stayed for the last decade with only small ups and downs. Which statement best describes this population?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It shows logistic (S-shaped) growth, and the carrying capacity of the island is about 800 rabbits', correct: true },
        { id: 'b', text: 'It shows exponential (J-shaped) growth, and the population will keep doubling indefinitely' },
        { id: 'c', text: 'It shows logistic growth, and the carrying capacity is about 40 rabbits, the size at which it started' },
        { id: 'd', text: 'The levelling off means the rabbits stopped reproducing entirely once they reached 800' },
      ],
      expectedAnswer: 'It shows logistic (S-shaped) growth, and the carrying capacity of the island is about 800 rabbits',
      hints: [
        'Match the described shape to a growth model: a slow start, a steep middle, then a flat top is one of the two curves.',
        'Carrying capacity is the level the curve flattens out at and holds, not the level it started from — and at that level rabbits are still being born, just balanced by deaths.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-succession-after-fire',
      kind: 'try_yourself',
      problem:
        'A wildfire burns through a pine forest. The trees are killed, but the soil remains in place, along with buried seeds and surviving roots. Within a year grasses and wildflowers cover the ground, and shrubs and young pines follow. What kind of succession is this, and why does it proceed as it does?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Primary succession, because the fire destroyed the community and it has to start over from the beginning' },
        { id: 'b', text: 'Primary succession, because lichens are the first organisms to appear on the burned ground' },
        { id: 'c', text: 'Secondary succession, and it is slower than primary succession because the fire sterilized the ground' },
        { id: 'd', text: 'Secondary succession, and it is faster than primary succession because the soil, seeds and roots survived the fire', correct: true },
      ],
      expectedAnswer: 'Secondary succession, and it is faster than primary succession because the soil, seeds and roots survived the fire',
      hints: [
        'The single thing that separates primary from secondary succession is whether soil is already present.',
        'Primary succession has to build soil out of bare rock, which takes centuries; here the soil was never lost.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-commensalism-as-mutualism',
      kind: 'misconception_check',
      question:
        'A student writes: "Barnacles attach to a whale\'s skin and get carried to new feeding grounds, so this is mutualism — the barnacles benefit, and the whale gets a relationship out of it too." What went wrong?',
      commonErrors: [
        {
          answer: 'Barnacles on a whale are an example of mutualism',
          misconception: 'Assuming that any partnership in which one species clearly gains must be mutually beneficial, instead of checking what the second partner actually receives.',
          correctsTo:
            'Mutualism requires a real benefit flowing to BOTH partners. The barnacles get transport and a steady supply of drifting food, but the whale gains nothing from them — and a light coating of barnacles does not measurably harm it either. One helped, one unaffected, so this is COMMENSALISM. Check each partner separately every time: both helped is mutualism, one helped and one unaffected is commensalism, one helped and one harmed is parasitism.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Exponential growth is J-shaped and needs unlimited resources; logistic growth is S-shaped and levels off at carrying capacity, the size the environment can sustain.',
        'Density-dependent factors (disease, competition, predation, food supply) hit harder as crowding rises; density-independent factors (fire, flood, drought, temperature) hit equally hard at any density.',
        'Predator numbers rise and fall after prey numbers do — the two cycles lag one behind the other and never peak together.',
        'Mutualism = both benefit; commensalism = one benefits, one unaffected; parasitism = one benefits, one harmed. Judge each partner separately.',
        'Primary succession starts on bare rock with pioneer species such as lichens and must build soil; secondary succession follows a disturbance like fire that left the soil intact, so it is much faster.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Population Growth, Limiting Factors & Community Interactions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
