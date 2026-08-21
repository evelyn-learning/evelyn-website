/**
 * Grade 7 World Geography -- Physical Geography: Climate Zones & Biomes.
 *
 * The closing row of Unit 2 (National Geography Standard 8). Row 2.3 taught
 * the CONTROLS on climate -- latitude, elevation, distance from water, ocean
 * currents, winds. This row turns those controls into PATTERNS on the ground:
 * three broad zones by latitude, the major biomes each zone produces, and the
 * geographic payoff -- biome distribution explains where farming is easy and
 * therefore where people concentrate.
 *
 * NOTE FOR FUTURE AUTHORS: this file states NO rainfall totals and NO
 * temperature ranges for any real place or biome, on purpose. Those numbers
 * vary by source and by definition, and a wrong one is indexed forever. The
 * only numbers here are the tropic and polar-circle latitudes, hedged with
 * "about". Everything else is a qualitative comparative -- wetter than, drier
 * than, colder than. Keep it that way.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every climate record
 * in an item is written out in words, and every item is solvable from the
 * words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U2_CLIMATE_ZONES_AND_BIOMES: LessonPlan = {
  id: 'evelyn.ms.m7geo.climate-zones-and-biomes.v1',
  title: 'Climate Zones & Biomes',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.climate-zones-and-biomes',
      standard: 'M7GEO-2.4',
      description:
        'Locate the tropical, temperate and polar zones by latitude, match the major world biomes to the climate that produces each one, and explain how the distribution of biomes shapes where farming is easy and where people concentrate (National Geography Standard 8: the characteristics and spatial distribution of ecosystems and biomes on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.weather-climate-and-factors'],
  followUps: ['m7geo.population-distribution-and-density'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a pattern the student has already noticed -- game maps and travel photos come in a small number of repeating flavors -- and name it as the thing this lesson explains.',
      script:
        'Think about the maps in the games you play. There is almost always a snowy zone, a jungle zone, a desert zone, and some green forest in the middle. Game designers did not invent that. They copied Earth. Our planet really does come in a small set of repeating flavors, and the same flavor shows up on continents that are thousands of miles apart. A jungle in South America and a jungle in Africa are not next to each other, but they look alike and they work alike. Last lesson you learned what controls climate. Today you find out what those controls actually build on the ground -- and why the answer decides where it is easy to grow food.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-zones-and-biomes',
      kind: 'concept',
      goal: 'Install the three latitude zones, the definition of a biome, the major biomes and the climate that produces each, and the payoff that links biome to farming and population.',
      keyIdeas: [
        'THREE BROAD ZONES, SET BY LATITUDE. The TROPICAL zone is the band between the Tropic of Cancer, at about 23.5 degrees north, and the Tropic of Capricorn, at about 23.5 degrees south. It gets the most direct sunlight of anywhere on Earth, so it is warm all year. The POLAR zones are beyond about 66.5 degrees north and south -- past the Arctic Circle and the Antarctic Circle -- where sunlight always arrives at a low slant and the year is cold. The TEMPERATE zones sit in between, and they are the zones with real seasons: a warm part of the year and a cold part of the year.',
        'A BIOME IS A KIND OF PLACE, NOT A PLACE. A biome is a large area with a particular climate and a particular set of plants that grow in it. The same biome appears on several continents, wherever the climate repeats. That is why Africa is not a biome -- Africa contains rainforest, savanna, desert and more, and so does South America. And biome boundaries are not lines. A rainforest does not stop at a fence and become savanna; there is a wide blend where one gradually turns into the other.',
        'THE TROPICAL BIOMES. TROPICAL RAINFOREST is hot and wet in every month, with no dry season; the trees grow tall and close together and very little sunlight reaches the ground. SAVANNA, also called tropical grassland, is hot too, but its rain arrives in a long wet season followed by a long dry season, so grasses cover the ground with trees standing scattered and apart. TROPICAL DESERT gets very little rain in any month; the Sahara in North Africa is the best known one.',
        'THE TEMPERATE BIOMES. TEMPERATE FOREST has four clear seasons and enough rain through the year; many of its trees drop their leaves before winter. TEMPERATE GRASSLAND is drier than temperate forest -- enough rain for deep grass, not enough for a closed forest -- and its deep soil makes it some of the best farmland on Earth. MEDITERRANEAN is the odd one: dry summers, and mild winters that bring most of the rain for the year. It is named for the land around the Mediterranean Sea, and the same climate turns up in a few other places, including parts of California.',
        'THE COLD BIOMES, AND THE ONE THAT IGNORES LATITUDE. TAIGA, also called boreal forest, is a broad belt of cone-bearing evergreen trees across the northern parts of North America, Europe and Asia; its winters are long and its summers are short. TUNDRA lies farther north still: cold, treeless, with a growing season too short for trees, so mosses, low shrubs and tough small plants take over. HIGHLAND is different from all of them, because it is set by elevation rather than by latitude. Air gets colder as you climb, so a tall mountain stacks several biomes on one slope, and a mountain in the tropics can be cold near its top.',
        'THE PAYOFF -- WHERE THE BIOMES ARE IS WHERE THE PEOPLE ARE. Farming needs a growing season long enough, warmth, and water that is neither too little nor overwhelming. Temperate grassland and temperate forest deliver all three, so those biomes feed enormous numbers of people. Desert has too little water, tundra has too short a growing season, and rainforest soil is surprisingly poor once the trees are cleared. That is why population is not spread evenly across the planet. Ask the biome first, and where people live stops being a random fact and becomes something you can predict.',
      ],
      vocabulary: [
        { term: 'climate zone', definition: 'one of the three broad bands of latitude -- tropical, temperate, polar -- that receive very different amounts of direct sunlight.' },
        { term: 'biome', definition: 'a large region defined by its climate and the kinds of plants that grow there, found wherever that climate repeats in the world.' },
        { term: 'savanna', definition: 'a hot tropical grassland with a long wet season and a long dry season, covered in grass with scattered trees.' },
        { term: 'desert', definition: 'a biome defined by very low precipitation; a desert may be hot or cold.' },
        { term: 'tundra', definition: 'a cold, treeless biome with a growing season too short for trees, where mosses and low plants dominate.' },
        { term: 'growing season', definition: 'the part of the year that is warm enough for crops and plants to grow.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-biome',
      kind: 'worked_example',
      problem:
        'A research station writes a plain-language record of its year. "Every month is hot. Rain falls in every month, and no month is dry. The trees are tall and grow close together in layers, and very little sunlight reaches the ground." Name the biome, and show how you rule out savanna and desert.',
      steps: [
        'A climate record answers two questions. First, how warm is it? Second, how is the rain spread across the year? Answer those two before you guess a name.',
        'Warmth first. Every month is hot, with no cold part of the year. That places the station in the TROPICAL zone, so the temperate and cold biomes are out immediately -- no temperate forest, no taiga, no tundra.',
        'Rain second. The record says rain falls in every month and no month is dry. Hold that phrase, because it is what does the ruling out.',
        'Rule out SAVANNA. Savanna is tropical too, so warmth alone cannot separate them. What separates them is the dry season: savanna has a long one, and this record explicitly has no dry month. So it is not savanna.',
        'Rule out DESERT. A desert is defined by very low precipitation. This place has rain in every month, which is the opposite of the test. So it is not desert.',
        'Now check the plants against what is left. Tall trees growing close together in layers, with the ground kept in shade, is the description of TROPICAL RAINFOREST -- and rainforest is exactly the biome that hot plus wet in every month produces. The Amazon rainforest in South America is the largest example.',
      ],
      answer:
        'Tropical rainforest. Hot every month puts it in the tropical zone; rain in every month with no dry season rules out savanna, and rules out desert as well; tall layered trees over shaded ground confirm rainforest.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-latitude-different-biome',
      kind: 'worked_example',
      problem:
        'A student writes: "Two places at the same latitude must have the same biome." Test that claim against these two records. Place 1 lies at about 20 degrees north on a low inland plain: almost no rain falls in any month, and the ground is bare and rocky. Place 2 lies at about 20 degrees north as well, but high on a mountain slope: it is cool all year, and the plants are low and hardy.',
      steps: [
        'Start with what latitude really decides. Latitude sets how directly sunlight arrives, so it sets the ZONE. Both places are inside the tropics, so both are in the tropical zone. So far the student is right.',
        'Now notice the gap in the claim. Zone and biome are not the same thing. A zone is a band of latitude; a biome also depends on how much rain falls and on the other controls you met last lesson -- elevation, distance from oceans, ocean currents and winds.',
        'Read Place 1 against the rain test. Almost no rain in any month is the definition of desert. Place 1 is a tropical desert, and its bare rocky ground fits.',
        'Read Place 2 against the elevation control. Air gets colder as you climb, so a high slope is cool even inside the tropics. Low, hardy plants are what a cold, windy, thin-soiled slope supports. Place 2 is HIGHLAND.',
        'Compare the verdicts. Same latitude, same zone, two completely different biomes. The claim fails.',
        'Say it carefully. WRONG: "Same latitude means same biome." CORRECT: "Latitude sets the zone, and then elevation, distance from water, currents and winds decide which biome forms inside that zone."',
      ],
      answer:
        'The claim is false. Both places sit in the tropical zone, but Place 1 is a tropical desert because almost no rain falls, and Place 2 is highland because the elevation keeps it cool. Latitude sets the zone; the other climate controls set the biome.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-zone',
      kind: 'try_yourself',
      problem:
        'A city sits at about 45 degrees north latitude, on a low plain, far from any mountains. Which broad climate zone is it in, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Temperate, because it lies between about 23.5 degrees and about 66.5 degrees', correct: true },
        { id: 'b', text: 'Tropical, because it lies north of the Tropic of Cancer' },
        { id: 'c', text: 'Polar, because it lies beyond the Tropic of Cancer' },
        { id: 'd', text: 'It changes with the season, because zones shift through the year' }
      ],
      expectedAnswer: 'Temperate, because it lies between about 23.5 degrees and about 66.5 degrees',
      hints: [
        'Write down the two boundary latitudes first: about 23.5 degrees for the tropic line, and about 66.5 degrees for the polar circle. Then ask where 45 falls.',
        'The tropical zone is INSIDE the tropic lines, not outside them, and the polar zone starts at the polar circle -- not the moment you leave the tropics.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-biome-to-climate',
      kind: 'try_yourself',
      problem:
        'Here is a climate record written out in words. "Warm in every month. For part of the year, heavy rain falls almost daily. For the rest of the year, almost no rain falls. Grasses cover the ground, and trees stand scattered far apart." Which biome best matches this record?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Tropical rainforest' },
        { id: 'b', text: 'Temperate grassland' },
        { id: 'c', text: 'Savanna, also called tropical grassland', correct: true },
        { id: 'd', text: 'Desert' }
      ],
      expectedAnswer: 'Savanna, also called tropical grassland',
      hints: [
        'Use the record in two passes. First the temperature: warm in every month tells you the zone. Then the rain: this record splits the year into a wet part and a dry part.',
        'Two of these choices are grassy. One of them has a cold season, and this record does not. Rainforest has no dry season, and desert has no heavy rain at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-biome-and-people',
      kind: 'try_yourself',
      problem:
        'One large country contains two very different regions. Region A is tundra: cold, treeless, with a growing season too short for crops. Region B is temperate forest: four seasons, steady rain through the year, and deep soil. Which statement is best supported by geography?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'More people are likely to live in Region A, because cold regions have more open space' },
        { id: 'b', text: 'More people are likely to live in Region B, because its climate and soil make farming easier', correct: true },
        { id: 'c', text: 'The two regions should hold about the same number of people, because biome does not affect where people settle' },
        { id: 'd', text: 'Region A must be closer to the equator than Region B, because it has fewer trees' }
      ],
      expectedAnswer: 'More people are likely to live in Region B, because its climate and soil make farming easier',
      hints: [
        'Ask the farming question first: which region can grow food, and which one has a growing season too short to try?',
        'Open space is not the same as usable space. Check the last choice against the zones too -- treeless tundra is a cold-zone biome, so it is farther from the equator, not closer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-desert-and-tropics',
      kind: 'misconception_check',
      question:
        'A student writes: "Deserts are the hottest biomes on Earth, and anywhere in the tropics is rainforest." Both halves of that sentence are wrong. What went wrong in each?',
      commonErrors: [
        {
          answer: 'Deserts are the hottest biomes on Earth.',
          misconception:
            'Defining a desert by heat, because the deserts that appear in movies and photographs are hot sandy ones. Temperature has been swapped in for the thing that actually defines the biome.',
          correctsTo:
            'WRONG: a desert is a very hot place. CORRECT: a desert is a place with very LOW PRECIPITATION. Heat is not part of the definition at all. That is why cold deserts exist, and why much of Antarctica counts as a polar desert -- it is one of the driest places on Earth, and it is also one of the coldest. The Sahara in North Africa is a hot desert, so the picture in your head is not wrong, it is just incomplete. Run the rain test first, every time, and only then ask how warm the place is.',
        },
        {
          answer: 'Anywhere in the tropics is rainforest.',
          misconception:
            'Treating the tropical zone and the rainforest biome as the same thing, so every biome in the tropics collapses into one. This is the zone-versus-biome mix-up again.',
          correctsTo:
            'WRONG: tropical means rainforest. CORRECT: tropical is a ZONE, and that zone contains several biomes. Savanna is tropical and has a long dry season. Tropical desert is tropical and is very dry all year. A high mountain slope inside the tropics can be highland and cool. What separates them is how the rain is spread through the year, plus elevation. It is also worth remembering that none of these biomes has a hard edge -- a rainforest blends into savanna across a wide band, so the boundary on any map is a rough guide, not a line on the ground.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three zones by latitude: tropical inside about 23.5 degrees north and south, polar beyond about 66.5 degrees, temperate in between.',
        'A biome is a kind of place, not a place. The same biome repeats on different continents wherever the climate repeats, so a continent is never a biome.',
        'Match biome to climate: rainforest is hot and wet all year, savanna is hot with wet and dry seasons, desert is very dry, temperate forest has four seasons, temperate grassland is drier than forest, Mediterranean has dry summers and mild wet winters, taiga is a cold evergreen belt, tundra is cold and treeless, highland changes with elevation.',
        'A desert is defined by low precipitation, not by heat. Cold deserts exist, and much of Antarctica is a polar desert.',
        'Latitude sets the zone; elevation, distance from water, currents and winds decide the biome inside it. Two places at the same latitude can be completely different.',
        'Biome boundaries are wide blends, not sharp lines.',
        'The payoff: biome tells you where farming is easy and where it is hard, and that is a large part of why people are packed into some regions and thin on the ground in others.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Climate Zones & Biomes' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
