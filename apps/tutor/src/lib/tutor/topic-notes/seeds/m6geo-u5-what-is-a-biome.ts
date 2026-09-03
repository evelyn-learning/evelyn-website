/**
 * Grade 6 World Geography — Unit 5 CED 5.3: What Is a Biome?.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.what-is-a-biome.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U5_WHAT_IS_A_BIOME: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.what-is-a-biome.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'What Is a Biome?',
  planId: 'evelyn.ms.m6geo.what-is-a-biome.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.what-is-a-biome.v1' }],
  theory: [
    { loId: 'm6geo.what-is-a-biome', content: `A BIOME IS A LARGE NATURAL REGION WITH ITS OWN TYPICAL WEATHER AND ITS OWN TYPICAL PLANTS. Geographers name many different biomes. This lesson compares five of them: DESERT, RAINFOREST, TUNDRA, GRASSLAND, and FOREST. Naming the correct one from a description uses three clues together: PRECIPITATION (how much rain or snow falls, and how that amount is spread across the year), TEMPERATURE (how hot or cold the place usually is), and PLANT LIFE (what kinds of plants grow there, or fail to grow there at all). Read all three clues before deciding. One clue by itself can point to more than one biome; all three together point to only one.` },
    { loId: 'm6geo.what-is-a-biome', content: `DESERT: VERY LITTLE PRECIPITATION IS THE DEFINING CLUE. Very little rain falls in any month, whether the place stays warm or turns cool overall, so precipitation and plant life -- not temperature -- are the clues that identify a desert. Because so little water reaches the ground, only a few plants survive there, spaced far apart and leaving most of the ground bare, and many of those plants are built to store what little water they get.` },
    { loId: 'm6geo.what-is-a-biome', content: `RAINFOREST: HOT AND SOAKED, EVERY MONTH OF THE YEAR. A rainforest stays hot all year, with little change from month to month. Rain falls on most days, all year, with no real dry season. The trees there grow tall and so closely together, in layers, that very little sunlight reaches the ground below them.` },
    { loId: 'm6geo.what-is-a-biome', content: `TUNDRA: COLD, DRY, AND TREELESS. A tundra stays cold for most of the year, with only a short, cool part of the year that never truly warms up. Precipitation is low, similar to a desert. Because the cold leaves too little time for trees to grow, the ground is covered instead by low mosses, low grasses, and small shrubs.` },
    { loId: 'm6geo.what-is-a-biome', content: `GRASSLAND: ENOUGH RAIN FOR GRASS, NOT ENOUGH FOR MANY TREES. A grassland is warm for part of the year and cooler for the rest, without turning as cold as a true winter freeze. Enough precipitation falls to keep grasses growing across nearly the whole area, but not enough to support many trees, so only a few trees stand scattered far apart.` },
    { loId: 'm6geo.what-is-a-biome', content: `FOREST: ENOUGH RAIN FOR MANY TREES, PLUS A REAL COLD SEASON. A forest has a warm part of the year and a genuinely cold part of the year. Enough precipitation falls through the year to support many trees growing close together, and some kinds of those trees lose their leaves once the cold season arrives. Forest and rainforest both grow many trees, and forest and grassland both live through a cooler stretch of the year -- so a plant-life clue or a temperature clue alone is not enough to tell forest apart from its two neighbors. All three clues checked together are what settle it.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'biome', content: `a large natural region defined by its typical temperature, its typical precipitation, and the kinds of plants that typically grow there.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'precipitation', content: `water that falls to the ground as rain, snow, or another form, measured by how much falls and how it is spread across the year.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'desert', content: `a biome with very low precipitation all year, so that only a few widely spaced plants survive there.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'rainforest', content: `a hot biome with very high precipitation spread through the year, covered in tall trees that grow close together in layers.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'tundra', content: `a cold biome with low precipitation and no trees, where mosses, low grasses, and small shrubs cover the ground instead.` },
    { loId: 'm6geo.what-is-a-biome', kind: 'definition', title: 'grassland', content: `a biome with enough precipitation for grasses to cover the ground, but not enough to support many trees.` },
  ],
  methods: [
    {
      title: 'Worked run the three clue match',
      steps: [
        `Read the precipitation clue first. Rain falls on most days, all through the year, with no real dry season. That is very high precipitation, spread evenly across the year -- which immediately rules out desert and tundra, since both of those are defined by very low precipitation.`,
        `Read the temperature clue next. It is hot every month, with almost no change across the year. That rules out tundra again, and it also rules out forest, which needs a genuinely cold season.`,
        `Read the plant-life clue last. Trees so tall and so close together, in layers, that little sunlight reaches the ground describes very dense, layered trees -- not the scattered trees of a grassland, and not the sparse, spaced-out plants of a desert.`,
        `Put the three clues together. Very high precipitation with no dry season, hot every month, and dense layered trees all point at the same one biome: rainforest.`,
        `Check the answer by rereading the clues in reverse order, plant life back to precipitation. The dense layered trees fit rainforest. The hot, unchanging temperature fits rainforest. The heavy year-round rain fits rainforest. All three still agree.`,
        `Check with a contrasting case so the match is not overlearned. If the temperature clue stayed the same -- hot every month -- but the precipitation clue changed to very little rain in any month, that same hot temperature would then point to desert instead of rainforest. Temperature alone never decides it.`,
      ],
      example: { problem: `A wildlife magazine describes a place in words: "Rain falls on most days, all through the year, and there is no real dry season. It is hot every month, with almost no change in temperature across the year. The trees grow so tall and so closely together, in layers, that very little sunlight reaches the ground below them." Use the three clues to name the biome, then check the answer.`, solution: `Rainforest. Very high precipitation with no dry season, a hot temperature that barely changes across the year, and dense, layered trees blocking most of the sunlight are three clues that all point to the same biome.` },
      relatedLoIds: ['m6geo.what-is-a-biome'],
    },
    {
      title: 'Worked one clue is not enough',
      steps: [
        `Look at Description 1 first. WRONG: "very little rain means desert." The mistake is deciding from precipitation alone. Very low precipitation is true of two different biomes in this lesson, not one: desert and tundra.`,
        `Check what actually separates those two dry biomes. The plant-life clue does. A desert's few plants stand far apart, leaving most of the ground bare between them. A tundra's low mosses and small shrubs cover the ground itself, with no trees at all. CORRECT: very little rain, plus scattered plants and bare ground, is desert; very little rain, plus a ground covered in mosses and shrubs, is tundra.`,
        `Now look at Description 2. WRONG: "low plants and no tall trees means grassland." The mistake is deciding from plant life alone. Two of this lesson's biomes can both be described that way in part: grassland, where grasses cover the ground because there is enough rain for them, and tundra, where mosses and shrubs cover the ground instead because there is not enough rain for trees.`,
        `Check what actually separates those two. The precipitation clue does. Grassland gets enough rain to grow grasses across nearly the whole area. Tundra gets very low precipitation, similar to a desert. CORRECT: low ground-covering plants with enough rain to grow grass is grassland; low ground-covering plants with very little rain at all is tundra.`,
        `Name the rule behind both corrections. Precipitation alone can match more than one biome. Plant life alone can match more than one biome. Only checking precipitation, temperature, and plant life together narrows a description down to one biome.`,
      ],
      example: { problem: `A student looks at two short descriptions and jumps to a conclusion each time. Description 1: "Very little rain falls here in any month." The student says: "That is a desert." Description 2: "Low plants cover the ground here, and there are no tall trees." The student says: "That is grassland." Explain what the student left out each time.`, solution: `Both guesses skipped clues. Very little rain alone fits desert or tundra -- the plant-life clue decides which, since a desert leaves the ground bare between scattered plants and a tundra is covered by mosses and shrubs. Low plants with no tall trees alone fits grassland or tundra -- the precipitation clue decides which there, since grassland gets enough rain for grass and tundra does not. All three clues have to be checked together.` },
      relatedLoIds: ['m6geo.what-is-a-biome'],
    },
  ],
  pointers: [
    { content: `Students often say "A forest is just a place with a lot of trees, so a forest and a rainforest must be the same biome." — Temperature and precipitation are what separate forest from rainforest. A rainforest stays hot all year with no real cold season, and gets heavy rain on most days, all year. A forest has a genuinely cold season as well as a warm one, and its rain, while enough to support many trees, is not described as constant, heavy rain the way a rainforest's is. WRONG: "many trees means rainforest." CORRECT: "many trees is true of both forest and rainforest; the temperature and the amount of rain are what tell them apart."`, kind: 'common-error' },
    { content: `Students often say "Grassland never has a single tree anywhere." — Grassland is described as having only a FEW trees, standing far apart -- not none at all. A biome with no trees whatsoever, where mosses and small shrubs cover the ground instead of grasses, is tundra, where the cold leaves too little time for trees to grow at all. WRONG: "grassland has zero trees." CORRECT: "grassland has a few scattered trees; a biome with no trees at all is tundra instead."`, kind: 'common-error' },
    { content: `A biome is a large natural region defined by its typical temperature, its typical precipitation, and the plants that typically grow there.`, kind: 'tip' },
    { content: `Matching a description to a biome uses three clues together: precipitation, temperature, and plant life. One clue alone can point to more than one biome; all three together point to only one.`, kind: 'tip' },
    { content: `Desert: very little precipitation is the defining clue, with only a few widely spaced plants leaving most of the ground bare.`, kind: 'tip' },
    { content: `Rainforest: hot all year with little change, very heavy precipitation with no real dry season, dense, layered trees.`, kind: 'tip' },
    { content: `Tundra: cold most of the year with only a short cool season, low precipitation, no trees -- just mosses, low grasses, and small shrubs.`, kind: 'tip' },
    { content: `Grassland: warm for part of the year and cooler for the rest, enough precipitation for grasses but not for many trees, only a few scattered trees.`, kind: 'tip' },
    { content: `Forest: a genuinely warm season and a genuinely cold season, enough precipitation to support many trees growing close together, with some kinds of trees losing their leaves in the cold season.`, kind: 'tip' },
    { content: `Don't pick a biome from one clue alone. Desert and tundra are both dry, but tundra has moss and shrubs covering the ground while desert has bare ground between scattered plants. Always check all three clues together.`, kind: 'common-error' },
    { content: `"Only a few trees" in grassland does NOT mean zero trees. Grassland has scattered trees; tundra has zero trees because it's too cold. If you see "no trees at all," think tundra, not grassland.`, kind: 'vocab-note' },
    { content: `Forest and rainforest both grow many trees close together, but they're different biomes. The temperature clue separates them: rainforest is hot all year; forest has a real cold season. Don't stop at "trees."`, kind: 'gotcha' },
    { content: `In a rainforest, rain falls on MOST DAYS with no dry season. That's different from a forest that gets enough rain for trees but has dry spells. "Heavy and constant all year" is the rainforest clue, not just "wet."`, kind: 'vocab-note' },
    { content: `Temperature alone doesn't decide a biome. A place can be hot and be either a desert (very little rain) or a rainforest (lots of rain). Read precipitation too before you name it.`, kind: 'edge-case' },
    { content: `Tundra is dry like a desert but cold like a forest. Don't match it by just one trait. You need low precipitation AND cold temperature AND the special plant life (mosses, shrubs, no trees) to name it tundra.`, kind: 'tip' },
    { content: `A grassland's defining separation from tundra is precipitation, not plant life. Both can look like ground covered by low plants, but grassland gets ENOUGH rain for grass; tundra gets very little rain and stays too cold for trees.`, kind: 'common-error' },
    { content: `Always check your answer by going backward through the three clues (plant life → temperature → precipitation). If all three still agree with your biome choice, you have it right.`, kind: 'tip' },
  ],
};
