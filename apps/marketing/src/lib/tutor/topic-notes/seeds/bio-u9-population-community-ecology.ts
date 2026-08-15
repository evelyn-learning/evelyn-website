/**
 * Biology — Unit 9 CED 9.4: Population Growth, Limiting Factors & Community Interactions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.population-community-ecology.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U9_POPULATION_COMMUNITY_ECOLOGY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.population-community-ecology.v1',
  course: 'Biology',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Population Growth, Limiting Factors & Community Interactions',
  planId: 'evelyn.hs.bio.population-community-ecology.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.population-community-ecology.v1' }],
  theory: [
    { loId: 'bio.population-community-ecology', content: `EXPONENTIAL GROWTH (J-SHAPED) — when resources are unlimited and nothing eats or infects them, each generation adds more individuals than the last, so the curve starts almost flat and then sweeps upward ever more steeply. It is what happens to a few bacteria in fresh nutrient broth, or to an invasive species newly arrived somewhere with no predators. ERROR TO AVOID: exponential growth NEVER lasts. Something always runs out first, and a population that overshoots its limit does not stay there — it CRASHES, because deaths now outnumber births.` },
    { loId: 'bio.population-community-ecology', content: `LOGISTIC GROWTH (S-SHAPED) — the real-world pattern: slow start, a steep middle where resources are still plentiful, then a gradual bend until the population levels off and stays roughly flat. The flattening is not the population getting tired; it is births and deaths coming into balance because resources are running short.` },
    { loId: 'bio.population-community-ecology', content: `CARRYING CAPACITY (K) — the population size a particular environment can sustain over the long run, set by food, water, space, shelter and disease. It is the level the S-curve flattens out at. K is not a fixed property of the species: the same rabbits have a much higher K in a wet year than a dry one.` },
    { loId: 'bio.population-community-ecology', kind: 'framework', title: 'Density-dependent limiting factors', content: `DENSITY-DEPENDENT LIMITING FACTORS — these bite HARDER as the population gets more crowded: competition for food and space, disease and parasites (which spread faster when individuals are packed together), and predation (predators concentrate where prey is abundant). These are the factors that produce carrying capacity.` },
    { loId: 'bio.population-community-ecology', kind: 'framework', title: 'Density-independent limiting factors', content: `DENSITY-INDEPENDENT LIMITING FACTORS — these hit with the same force no matter how crowded the population is: fire, flood, drought, a hard freeze, a hurricane. THE TEST TO APPLY: ask whether the factor would be worse if the population were twice as dense. A wildfire does not care how many deer are in the forest; a disease very much does.` },
    { loId: 'bio.population-community-ecology', kind: 'framework', title: 'Predator and prey cycle, one lagging behind the other', content: `PREDATOR AND PREY CYCLE, ONE LAGGING BEHIND THE OTHER — plentiful prey lets predators raise more young, so the predator numbers rise AFTER the prey numbers rise. The growing predator population then drives prey numbers down, which starves the predators, which lets the prey recover. Neither peak lines up with the other; the predator peak always trails the prey peak.` },
    { loId: 'bio.population-community-ecology', kind: 'framework', title: 'Community interactions', content: `COMMUNITY INTERACTIONS — COMPETITION (two species need the same limited resource; both are held back), PREDATION (one eats the other), and the three SYMBIOSES: MUTUALISM, where both species benefit (bees and flowering plants); COMMENSALISM, where one benefits and the other is neither helped nor harmed (barnacles riding a whale); and PARASITISM, where one benefits and the other is harmed but usually not killed outright (ticks on a dog). Classify by asking what each partner gets, one partner at a time.` },
    { loId: 'bio.population-community-ecology', kind: 'framework', title: 'Ecological succession', content: `ECOLOGICAL SUCCESSION — the predictable rebuilding of a community after ground opens up. PRIMARY succession starts on bare rock with NO soil (a new lava flow, land exposed by a retreating glacier); pioneer species such as lichens and mosses slowly break rock into soil, which takes centuries. SECONDARY succession starts where a disturbance such as a fire, a flood or abandoned farming has cleared the community but LEFT THE SOIL, along with surviving roots and seeds — so it is far faster. The presence or absence of soil is the whole distinction.` },
    { loId: 'bio.population-community-ecology', kind: 'definition', title: 'carrying capacity', content: `the population size an environment can sustain long-term, where the S-shaped growth curve levels off.` },
    { loId: 'bio.population-community-ecology', kind: 'definition', title: 'density-dependent factor', content: `a limiting factor whose effect grows stronger as the population becomes more crowded, such as disease or competition.` },
    { loId: 'bio.population-community-ecology', kind: 'definition', title: 'pioneer species', content: `the first organisms to colonize bare rock in primary succession, such as lichens, which begin building soil.` },
  ],
  methods: [
    {
      title: 'Worked classify limiting factors',
      steps: [
        `Set up the one question that decides every case: would this factor hit HARDER if the herd were twice as crowded? If yes, it is density-dependent; if it would hit just as hard either way, it is density-independent.`,
        `Cold winter: the temperature is the same whether there are 50 deer or 5,000, and a fawn in a sparse herd freezes just as readily. It hits regardless of crowding, so it is DENSITY-INDEPENDENT.`,
        `Respiratory infection: an infected deer must be close enough to another deer to pass it on, and crowding makes those contacts far more frequent. Doubling the density speeds the outbreak, so it is DENSITY-DEPENDENT.`,
        `Stripped branches and hunger: this is competition for a limited food supply. The more deer share the same browse, the less each one gets — the effect scales directly with crowding, so it is DENSITY-DEPENDENT.`,
        `Sanity check on the pattern: the two density-dependent factors are exactly the ones that would push the herd back toward carrying capacity, while the cold snap would have struck a small herd just as hard.`,
      ],
      example: { problem: `A herd of deer in a valley has grown large over several good years. Three things then happen: (1) an unusually cold winter kills many fawns, (2) an outbreak of a respiratory infection spreads quickly through the crowded herd, and (3) the deer strip the low branches bare and many go hungry. Classify each as a density-dependent or density-independent limiting factor.`, solution: `Cold winter = density-independent; disease outbreak = density-dependent; competition for food = density-dependent.` },
      relatedLoIds: ['bio.population-community-ecology'],
    },
    {
      title: 'Worked identify symbiosis',
      steps: [
        `Use one rule for all three: take each partner separately and ask whether it is helped, harmed, or unaffected. Never judge the pair as a whole at once.`,
        `Hummingbird and flower — bird: helped, it gets food. Flower: helped, its pollen is delivered. Both helped, so this is MUTUALISM.`,
        `Tapeworm and wolf — tapeworm: helped, it gets nutrients. Wolf: harmed, it loses nutrients and may weaken, but it is not killed and eaten. One helped, one harmed, and the harmed one lives on, so this is PARASITISM, not predation.`,
        `Orchid and tree — orchid: helped, it reaches the light. Tree: unaffected, it is neither fed nor damaged. One helped, one unaffected, so this is COMMENSALISM.`,
        `Note the trap in case 3: because the orchid clearly gains, students often upgrade it to mutualism. Mutualism requires a benefit flowing BOTH ways, and here nothing flows back to the tree.`,
      ],
      example: { problem: `Identify the community interaction in each pair. (1) A hummingbird drinks nectar from a flower and carries the flower's pollen to the next plant. (2) A tapeworm lives in a wolf's intestine, absorbing nutrients from the food the wolf digests. (3) A small orchid grows perched on a high tree branch to reach sunlight; the tree is neither fed nor damaged by it.`, solution: `Hummingbird and flower = mutualism; tapeworm and wolf = parasitism; orchid and tree = commensalism.` },
      relatedLoIds: ['bio.population-community-ecology'],
    },
  ],
  pointers: [
    { content: `Mutualism requires a real benefit flowing to BOTH partners. The barnacles get transport and a steady supply of drifting food, but the whale gains nothing from them — and a light coating of barnacles does not measurably harm it either. One helped, one unaffected, so this is COMMENSALISM. Check each partner separately every time: both helped is mutualism, one helped and one unaffected is commensalism, one helped and one harmed is parasitism.`, kind: 'common-error' },
    { content: `Exponential growth is J-shaped and needs unlimited resources; logistic growth is S-shaped and levels off at carrying capacity, the size the environment can sustain.`, kind: 'tip' },
    { content: `Density-dependent factors (disease, competition, predation, food supply) hit harder as crowding rises; density-independent factors (fire, flood, drought, temperature) hit equally hard at any density.`, kind: 'tip' },
    { content: `Predator numbers rise and fall after prey numbers do — the two cycles lag one behind the other and never peak together.`, kind: 'tip' },
    { content: `Mutualism = both benefit; commensalism = one benefits, one unaffected; parasitism = one benefits, one harmed. Judge each partner separately.`, kind: 'tip' },
    { content: `Primary succession starts on bare rock with pioneer species such as lichens and must build soil; secondary succession follows a disturbance like fire that left the soil intact, so it is much faster.`, kind: 'tip' },
    { content: `Parasitism ≠ predation. A parasite feeds on a host that keeps living (tick, tapeworm); a predator kills and eats its prey. If the 'victim' survives the interaction, write parasitism.`, kind: 'vocab-note' },
    { content: `Don't upgrade commensalism to mutualism. Check the SECOND partner explicitly: if it gets nothing at all (whale with barnacles, tree with orchid), it's commensalism. A benefit flowing one way is not 'mutual'.`, kind: 'common-error' },
    { content: `Apply one test to every limiting factor: *would this hit harder if the population were twice as dense?* Yes → density-dependent. Don't classify by whether the factor is biological — a drought and a hard freeze are both density-INdependent.`, kind: 'tip' },
    { content: `Carrying capacity (K) belongs to the ENVIRONMENT, not the species. The same rabbits have a higher K in a wet year than a dry one, so K can shift up or down over time — it isn't a fixed number to memorize per organism.`, kind: 'gotcha' },
    { content: `The flattening of an S-curve means births ≈ deaths, not that reproduction stopped. Individuals are still being born and dying at the plateau; the two rates have just balanced.`, kind: 'common-error' },
    { content: `On predator–prey graphs, the predator peak comes AFTER the prey peak — never line the two peaks up. Read the lag: prey rises → predators rise → prey crashes → predators crash.`, kind: 'gotcha' },
    { content: `Soil is the entire primary/secondary distinction. Fire, flood, or abandoned farmland leave soil behind → secondary. Bare rock from lava or a retreating glacier → primary. 'How severe was the disturbance?' is not the test.`, kind: 'edge-case' },
    { content: `Exponential growth never lasts, and overshooting K doesn't produce a gentle settle — it produces a CRASH as deaths outstrip births. Say 'J-shaped' only when resources are genuinely unlimited (fresh broth, a new invasive species).`, kind: 'edge-case' },
  ],
};
