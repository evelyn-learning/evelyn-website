/**
 * Grade 6 World Geography -- Weather, Climate & Ecosystems: What Is a Biome?
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 8).
 * The routine is a three-clue match: read the precipitation clue, read the
 * temperature clue, read the plant-life clue, then find the one biome, of the
 * five this lesson names, whose known pattern fits all three together. The
 * first worked example runs that routine straight through on a clean case;
 * the second repairs the single most common shortcut -- deciding from one
 * clue alone -- by showing that precipitation alone, and plant life alone,
 * each match more than one of this lesson's five biomes, and only all three
 * together narrow it to one.
 *
 * SCOPE GUARD: this row matches a DESCRIBED SET OF CONDITIONS (temperature,
 * precipitation, plant life) to one of five named biome types -- desert,
 * rainforest, tundra, grassland, forest -- and says nothing about WHY those
 * conditions occur. It names no latitude, no climate zone (tropical,
 * temperate, polar), and no finer biome subtype that Grade 7 introduces
 * (savanna, taiga, Mediterranean, highland, or the hot/cold split within
 * desert). The three-climate-zone-by-latitude mechanism that explains why
 * those zones produce these biomes is Grade 7's
 * `m7geo-u2-climate-zones-and-biomes.ts` and must not appear here. The five
 * biome names themselves are this row's own assigned vocabulary set, named
 * verbatim in the signed curriculum's scope line for this row -- naming the
 * members of a plain vocabulary set is not a typology breach, the same way
 * naming mountain, plain, plateau, hill, and valley is not one for the
 * landform rows. What IS deliberately allowed, because the closest Grade 7
 * neighbor sits right next to this row: describing a biome by its
 * temperature, its precipitation, and its plant life in plain language, and
 * noting in the worked examples and the misconception check that a single
 * clue can match more than one biome -- both are IDENTIFY/CLASSIFY-level
 * observations about telling five named things apart, not an explanation of
 * a mechanism. Every example place in this file is invented and described in
 * words rather than named as a real region, on purpose: nothing here needs a
 * real anchor, and an invented place removes any checkable locality claim
 * entirely, which this course has gotten wrong before. This row also never
 * writes a sentence such as "these plants and the animals that eat them
 * depend on each other" or names any animal living in a biome -- describing
 * how living and nonliving parts of a place interact is row 5.4's own
 * subject, Ecosystems & Habitats (`m6geo.ecosystems-and-habitats`), and stays
 * out of this file entirely. Plant life appears here only as one of the three
 * described CONDITIONS used to identify a biome, never as a subject of study
 * in its own right.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item below is
 * answered by DEFINE, IDENTIFY, or CLASSIFY. Nothing here explains why a
 * temperature or a precipitation pattern exists in a given place, and nothing
 * builds a chain of two or more "because" links. If a sentence here would sit
 * comfortably inside `m7geo-u2-climate-zones-and-biomes.ts`, it is over the
 * ceiling; that file's own zone-and-latitude framing is the thing these
 * sentences are built to stay well short of.
 *
 * CHECK-MOVE NOTE: each worked example ends with the "rewind the input, then
 * test a contrasting case" move (the procedure-led exemplar's variant): the
 * first worked example rereads its three clues in reverse to confirm the
 * match, then swaps one clue to show a different biome would follow; the
 * second worked example is built entirely around a contrasting-case idea --
 * showing that the SAME single clue, paired with a different second clue,
 * lands on a different biome.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason tied to the described
 * conditions, never a bare wrong label, and no key was written to be the
 * longest choice BECAUSE it is the key. Measured count: the key is the
 * strictly longest of its four choices in 1 of the 3 items (item 3's forest
 * key, ahead of its next-longest distractor by 14 characters). The other two
 * keys are not the longest: item 1's grassland key ranks third of four, 16
 * characters short of the longest distractor, and item 2's tundra key ranks
 * second of four, 9 characters short. Exact character counts for all twelve
 * choices are in the report. Per DF-1, this row is 5.3, so `(5 + 3) mod 4 = 0`, which
 * omits id `a`; the three correct choices sit at `b`, `c`, and `d`, one item
 * each, never repeating an id.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U5_WHAT_IS_A_BIOME: LessonPlan = {
  id: 'evelyn.ms.m6geo.what-is-a-biome.v1',
  title: 'What Is a Biome?',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.what-is-a-biome',
      standard: 'M6GEO-5.3',
      description:
        "Define biome and match a described set of temperature, precipitation, and plant-life conditions to the correct major biome type (desert, rainforest, tundra, grassland, or forest), without the three-climate-zone-by-latitude mechanism that explains why, which is Grade 7's climate-zones-and-biomes lesson (National Geography Standard 8: the characteristics and spatial distribution of ecosystems and biomes on Earth's surface).",
    },
  ],
  prerequisites: ['m6geo.the-water-cycle'],
  followUps: ['m6geo.ecosystems-and-habitats'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that very different large environments can be told apart from a description alone, with no picture needed, before any biome name arrives.',
      script:
        'A friend sends two postcards from a long trip. The first says: cold almost the whole time we were there, hardly any rain, and the only plants we saw were low mosses and little shrubs hugging the ground. The second says: hot every single day, and it rained on us almost every afternoon, under trees so thick and so tall that it stayed shady even at noon. You have never seen either place, and there is no photo attached, yet you already have a clear picture of two very different environments. Geographers have a name for the kind of environment each postcard describes, and today you learn all five of the major ones, plus the three clues that tell them apart every time: how hot or cold a place usually is, how much rain or snow falls there, and what kind of plants grow, or fail to grow, on the ground.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-clues-five-biomes',
      kind: 'concept',
      goal: 'Install the definition of biome, the three-clue matching method, and the temperature, precipitation, and plant-life profile of each of the five named biomes.',
      keyIdeas: [
        'A BIOME IS A LARGE NATURAL REGION WITH ITS OWN TYPICAL WEATHER AND ITS OWN TYPICAL PLANTS. Geographers name many different biomes. This lesson compares five of them: DESERT, RAINFOREST, TUNDRA, GRASSLAND, and FOREST. Naming the correct one from a description uses three clues together: PRECIPITATION (how much rain or snow falls, and how that amount is spread across the year), TEMPERATURE (how hot or cold the place usually is), and PLANT LIFE (what kinds of plants grow there, or fail to grow there at all). Read all three clues before deciding. One clue by itself can point to more than one biome; all three together point to only one.',
        'DESERT: VERY LITTLE PRECIPITATION IS THE DEFINING CLUE. Very little rain falls in any month, whether the place stays warm or turns cool overall, so precipitation and plant life -- not temperature -- are the clues that identify a desert. Because so little water reaches the ground, only a few plants survive there, spaced far apart and leaving most of the ground bare, and many of those plants are built to store what little water they get.',
        'RAINFOREST: HOT AND SOAKED, EVERY MONTH OF THE YEAR. A rainforest stays hot all year, with little change from month to month. Rain falls on most days, all year, with no real dry season. The trees there grow tall and so closely together, in layers, that very little sunlight reaches the ground below them.',
        'TUNDRA: COLD, DRY, AND TREELESS. A tundra stays cold for most of the year, with only a short, cool part of the year that never truly warms up. Precipitation is low, similar to a desert. Because the cold leaves too little time for trees to grow, the ground is covered instead by low mosses, low grasses, and small shrubs.',
        'GRASSLAND: ENOUGH RAIN FOR GRASS, NOT ENOUGH FOR MANY TREES. A grassland is warm for part of the year and cooler for the rest, without turning as cold as a true winter freeze. Enough precipitation falls to keep grasses growing across nearly the whole area, but not enough to support many trees, so only a few trees stand scattered far apart.',
        'FOREST: ENOUGH RAIN FOR MANY TREES, PLUS A REAL COLD SEASON. A forest has a warm part of the year and a genuinely cold part of the year. Enough precipitation falls through the year to support many trees growing close together, and some kinds of those trees lose their leaves once the cold season arrives. Forest and rainforest both grow many trees, and forest and grassland both live through a cooler stretch of the year -- so a plant-life clue or a temperature clue alone is not enough to tell forest apart from its two neighbors. All three clues checked together are what settle it.',
      ],
      vocabulary: [
        { term: 'biome', definition: 'a large natural region defined by its typical temperature, its typical precipitation, and the kinds of plants that typically grow there.' },
        { term: 'precipitation', definition: 'water that falls to the ground as rain, snow, or another form, measured by how much falls and how it is spread across the year.' },
        { term: 'desert', definition: 'a biome with very low precipitation all year, so that only a few widely spaced plants survive there.' },
        { term: 'rainforest', definition: 'a hot biome with very high precipitation spread through the year, covered in tall trees that grow close together in layers.' },
        { term: 'tundra', definition: 'a cold biome with low precipitation and no trees, where mosses, low grasses, and small shrubs cover the ground instead.' },
        { term: 'grassland', definition: 'a biome with enough precipitation for grasses to cover the ground, but not enough to support many trees.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-three-clue-match',
      kind: 'worked_example',
      problem:
        'A wildlife magazine describes a place in words: "Rain falls on most days, all through the year, and there is no real dry season. It is hot every month, with almost no change in temperature across the year. The trees grow so tall and so closely together, in layers, that very little sunlight reaches the ground below them." Use the three clues to name the biome, then check the answer.',
      steps: [
        'Read the precipitation clue first. Rain falls on most days, all through the year, with no real dry season. That is very high precipitation, spread evenly across the year -- which immediately rules out desert and tundra, since both of those are defined by very low precipitation.',
        'Read the temperature clue next. It is hot every month, with almost no change across the year. That rules out tundra again, and it also rules out forest, which needs a genuinely cold season.',
        'Read the plant-life clue last. Trees so tall and so close together, in layers, that little sunlight reaches the ground describes very dense, layered trees -- not the scattered trees of a grassland, and not the sparse, spaced-out plants of a desert.',
        'Put the three clues together. Very high precipitation with no dry season, hot every month, and dense layered trees all point at the same one biome: rainforest.',
        'Check the answer by rereading the clues in reverse order, plant life back to precipitation. The dense layered trees fit rainforest. The hot, unchanging temperature fits rainforest. The heavy year-round rain fits rainforest. All three still agree.',
        'Check with a contrasting case so the match is not overlearned. If the temperature clue stayed the same -- hot every month -- but the precipitation clue changed to very little rain in any month, that same hot temperature would then point to desert instead of rainforest. Temperature alone never decides it.',
      ],
      answer:
        'Rainforest. Very high precipitation with no dry season, a hot temperature that barely changes across the year, and dense, layered trees blocking most of the sunlight are three clues that all point to the same biome.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-clue-is-not-enough',
      kind: 'worked_example',
      problem:
        'A student looks at two short descriptions and jumps to a conclusion each time. Description 1: "Very little rain falls here in any month." The student says: "That is a desert." Description 2: "Low plants cover the ground here, and there are no tall trees." The student says: "That is grassland." Explain what the student left out each time.',
      steps: [
        'Look at Description 1 first. WRONG: "very little rain means desert." The mistake is deciding from precipitation alone. Very low precipitation is true of two different biomes in this lesson, not one: desert and tundra.',
        'Check what actually separates those two dry biomes. The plant-life clue does. A desert\'s few plants stand far apart, leaving most of the ground bare between them. A tundra\'s low mosses and small shrubs cover the ground itself, with no trees at all. CORRECT: very little rain, plus scattered plants and bare ground, is desert; very little rain, plus a ground covered in mosses and shrubs, is tundra.',
        'Now look at Description 2. WRONG: "low plants and no tall trees means grassland." The mistake is deciding from plant life alone. Two of this lesson\'s biomes can both be described that way in part: grassland, where grasses cover the ground because there is enough rain for them, and tundra, where mosses and shrubs cover the ground instead because there is not enough rain for trees.',
        'Check what actually separates those two. The precipitation clue does. Grassland gets enough rain to grow grasses across nearly the whole area. Tundra gets very low precipitation, similar to a desert. CORRECT: low ground-covering plants with enough rain to grow grass is grassland; low ground-covering plants with very little rain at all is tundra.',
        'Name the rule behind both corrections. Precipitation alone can match more than one biome. Plant life alone can match more than one biome. Only checking precipitation, temperature, and plant life together narrows a description down to one biome.',
      ],
      answer:
        'Both guesses skipped clues. Very little rain alone fits desert or tundra -- the plant-life clue decides which, since a desert leaves the ground bare between scattered plants and a tundra is covered by mosses and shrubs. Low plants with no tall trees alone fits grassland or tundra -- the precipitation clue decides which there, since grassland gets enough rain for grass and tundra does not. All three clues have to be checked together.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-warm-season-not-enough-trees',
      kind: 'try_yourself',
      problem:
        'A place is warm for part of the year and cooler for the rest, but it never turns as cold as a true winter freeze. Enough precipitation falls to keep the ground green, but not enough to support many trees. Grasses cover almost the entire ground, with only a few trees standing far apart. Which biome best matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Desert, because there are only a few trees, and a desert is a biome where very little precipitation supports only a few widely spaced plants.' },
        { id: 'b', text: 'Grassland, because enough precipitation supports grasses across most of the ground, but not enough to support many trees, so only a few trees stand scattered far apart.', correct: true },
        { id: 'c', text: 'Forest, because enough precipitation is described to support plant life, and a forest is a biome where many trees grow close together through a warm season and a genuinely cold season.' },
        { id: 'd', text: 'Tundra, because the ground is described as covered in low plants, and a tundra is a cold biome where mosses and small shrubs dominate because it is too cold for trees to grow.' },
      ],
      expectedAnswer: 'Grassland, because enough precipitation supports grasses across most of the ground, but not enough to support many trees, so only a few trees stand scattered far apart.',
      hints: [
        'Use all three clues, not just one: check precipitation first, then temperature, then plant life.',
        'Enough rain for grasses but not enough for many trees rules out forest; a temperature that only turns cooler, never truly cold, rules out tundra.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cold-dry-and-treeless',
      kind: 'try_yourself',
      problem:
        'A place stays cold nearly all year, with only a short, cool part of the year that never truly warms up. Very little precipitation falls in any month. Low mosses and small shrubs cover the ground, and no trees grow there at all. Which biome best matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Desert, because very little precipitation falls in any month, and a desert is a biome defined by very low precipitation supporting only a few widely spaced plants.' },
        { id: 'b', text: 'Grassland, because low plants cover the ground, and a grassland is a biome where enough precipitation lets grasses dominate while only a few trees stand scattered far apart.' },
        { id: 'c', text: 'Tundra, because the place stays cold nearly all year with very low precipitation, and no trees grow there at all, matching a biome where mosses and small shrubs cover the ground instead.', correct: true },
        { id: 'd', text: 'Forest, because plant life is described covering the ground, and a forest is a biome where enough precipitation supports many trees growing close together through a warm season and a cold season.' },
      ],
      expectedAnswer: 'Tundra, because the place stays cold nearly all year with very low precipitation, and no trees grow there at all, matching a biome where mosses and small shrubs cover the ground instead.',
      hints: [
        'Very little rain fits two of this lesson\'s biomes. Check the plant-life clue to choose between them.',
        'Desert plants stand scattered, leaving most of the ground bare. This description says mosses and shrubs COVER the ground, with no trees at all -- that ground cover is the tundra clue.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-seasons-and-many-trees',
      kind: 'try_yourself',
      problem:
        'A place has a genuinely warm season and a genuinely cold season each year. Enough precipitation falls through most of the year to support many trees. The trees grow close together, and some kinds of them lose their leaves once the cold season arrives. Which biome best matches this description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rainforest, because many trees are described growing close together, and a rainforest is a hot biome where very heavy precipitation on most days, all year, supports trees growing closely together in layers.' },
        { id: 'b', text: 'Grassland, because precipitation is described supporting plant life, and a grassland is a biome where enough precipitation lets grasses dominate while only a few trees stand scattered far apart.' },
        { id: 'c', text: 'Desert, because very little is said about how heavy the rain is, and a desert is a biome defined by very low precipitation supporting only a few widely spaced plants.' },
        { id: 'd', text: 'Forest, because enough precipitation supports many trees growing close together, and some kinds of trees lose their leaves once a genuinely cold season arrives, matching a biome with both a warm season and a cold season.', correct: true },
      ],
      expectedAnswer: 'Forest, because enough precipitation supports many trees growing close together, and some kinds of trees lose their leaves once a genuinely cold season arrives, matching a biome with both a warm season and a cold season.',
      hints: [
        'Many trees growing close together fits two of this lesson\'s biomes. Check whether a real cold season is described.',
        'Rainforest never has a real cold season and needs very heavy, almost daily rain; this description has a cold season and rain described as enough for trees, not as constant, heavy rain.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-shared-clue-is-not-the-whole-match',
      kind: 'misconception_check',
      question:
        'A student says: "A forest is just a place with a lot of trees, so a forest and a rainforest must be the same biome. And grassland never has a single tree anywhere." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A forest is just a place with a lot of trees, so a forest and a rainforest must be the same biome.',
          misconception:
            'Treating the plant-life clue as the whole match, because it is the easiest clue to picture. Forest and rainforest do share that one clue -- both have many trees growing close together -- so a match built on plant life alone cannot tell them apart.',
          correctsTo:
            'Temperature and precipitation are what separate forest from rainforest. A rainforest stays hot all year with no real cold season, and gets heavy rain on most days, all year. A forest has a genuinely cold season as well as a warm one, and its rain, while enough to support many trees, is not described as constant, heavy rain the way a rainforest\'s is. WRONG: "many trees means rainforest." CORRECT: "many trees is true of both forest and rainforest; the temperature and the amount of rain are what tell them apart."',
        },
        {
          answer: 'Grassland never has a single tree anywhere.',
          misconception:
            'Turning the plant-life description "only a few trees" into "no trees at all," an overgeneralization from a clue that already named a small number, not zero.',
          correctsTo:
            'Grassland is described as having only a FEW trees, standing far apart -- not none at all. A biome with no trees whatsoever, where mosses and small shrubs cover the ground instead of grasses, is tundra, where the cold leaves too little time for trees to grow at all. WRONG: "grassland has zero trees." CORRECT: "grassland has a few scattered trees; a biome with no trees at all is tundra instead."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A biome is a large natural region defined by its typical temperature, its typical precipitation, and the plants that typically grow there.',
        'Matching a description to a biome uses three clues together: precipitation, temperature, and plant life. One clue alone can point to more than one biome; all three together point to only one.',
        'Desert: very little precipitation is the defining clue, with only a few widely spaced plants leaving most of the ground bare.',
        'Rainforest: hot all year with little change, very heavy precipitation with no real dry season, dense, layered trees.',
        'Tundra: cold most of the year with only a short cool season, low precipitation, no trees -- just mosses, low grasses, and small shrubs.',
        'Grassland: warm for part of the year and cooler for the rest, enough precipitation for grasses but not for many trees, only a few scattered trees.',
        'Forest: a genuinely warm season and a genuinely cold season, enough precipitation to support many trees growing close together, with some kinds of trees losing their leaves in the cold season.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'What Is a Biome?' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
