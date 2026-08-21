/**
 * Grade 7 World Geography — Human Geography: Population Distribution & Density.
 *
 * Concept-led row (National Geography Standard 9), shaped on the m7geo
 * exemplar m7geo-u3-migration-push-and-pull.ts. The whole row turns on ONE
 * discrimination: DISTRIBUTION is WHERE people are; DENSITY is HOW MANY people
 * there are for each unit of area. Everything else -- the physical reasons
 * people cluster, and the fact that a density figure is an average that hides
 * clustering -- hangs off that split.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters:
 *   1. NO POPULATION FIGURES, NO DENSITY FIGURES, NO COUNTRY RANKINGS about
 *      real places appear anywhere in this file. Every number in here belongs
 *      to an invented country in a worked example. Real places are used only
 *      for long-settled PHYSICAL claims -- deserts, ice sheets, mountains,
 *      river valleys and coastal plains. Keep it that way; a confidently wrong
 *      statistic is the failure mode for this course.
 *   2. Density is NEVER a judgment. A densely settled place is not "crowded",
 *      "cramped" or "worse", and a sparsely settled place is not "empty" or
 *      "unwanted". This file describes land and climate, never the people who
 *      live on it.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every distribution is
 * described in words, and every item is solvable from the words printed inside
 * it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U3_POPULATION_DISTRIBUTION_AND_DENSITY: LessonPlan = {
  id: 'evelyn.ms.m7geo.population-distribution-and-density.v1',
  title: 'Population Distribution & Density',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.population-distribution-and-density',
      standard: 'M7GEO-3.1',
      description:
        'Distinguish population distribution, which describes where people live, from population density, which describes how many people live in each unit of area, explain the physical conditions that draw settlement into some places and away from others, and explain why a density figure is an average that can hide clustering (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.climate-zones-and-biomes'],
  followUps: ['m7geo.population-growth-and-structure'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea that people are spread unevenly, using something the student has already noticed, before any vocabulary.',
      script:
        'If you have ever flown at night, or seen a photograph of Earth taken at night, you have already seen this lesson. The lights are not spread evenly. There are bright blotches, and long thin bright lines, and then huge stretches with almost nothing. People are not scattered across the planet like sprinkles. They are bunched up, and the bunching is not random. There are reasons for every bright patch and every dark one, and most of those reasons are things you already studied in the last two units: water, climate, and the shape of the land. Today you learn the two questions geographers ask about that pattern, and why mixing the two questions up will trip you every single time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribution-and-density',
      kind: 'concept',
      goal: 'Install the distribution/density split, the physical reasons for clustering, and the averages-hide-clustering idea.',
      keyIdeas: [
        'TWO DIFFERENT QUESTIONS. DISTRIBUTION asks WHERE people are -- which parts of a place have people and which parts do not, and whether they are spread out or bunched together. DENSITY asks HOW MANY people there are for each unit of area. Distribution is a pattern you describe in words. Density is a number you calculate. Confusing the two is the single most common mistake in this topic.',
        'DENSITY IS POPULATION DIVIDED BY LAND AREA. Take the number of people, divide by the number of square miles of land, and you get people per square mile. Geographers also use people per square kilometer. Densely settled means many people for each square mile; sparsely settled means few. That is all the words mean.',
        'PEOPLE CLUSTER WHERE THE PHYSICAL GEOGRAPHY MAKES LIVING EASIER. Five conditions do most of the work: fresh water, arable land that crops will grow in, a moderate climate, flat or gently rolling land, and access to the coast or to a trade route. River valleys and coastal plains have several of these at once, which is why they have carried dense settlement for a very long time. The plains along the Ganges River in South Asia and the valley and delta of the Nile in Egypt are both long-settled farming lands of exactly this kind.',
        'PEOPLE ARE SPARSE WHERE THE PHYSICAL GEOGRAPHY MAKES LIVING HARD. Very dry places, such as the Sahara in North Africa. Very cold places, such as the interior of Greenland, which is buried under an ice sheet, or Antarctica, which has no permanent residents at all and only research stations. Very high places, such as the high ranges of the Himalaya. And very wet, dense, difficult places, such as the interior of the Amazon rainforest, while most of Brazil is settled near the Atlantic coast instead.',
        'DENSITY IS AN AVERAGE, AND AVERAGES HIDE CLUSTERING. This is the idea worth keeping from this whole lesson. A density figure smears every person evenly across every square mile of a country, and almost nowhere on Earth is anyone actually spread out that way. A country can have a low overall density and still have nearly everybody living in a handful of cities. So a density figure by itself tells you very little about where people actually are. To answer that, you need the distribution.',
        'DENSE AND SPARSE ARE MEASUREMENTS, NOT JUDGMENTS. A densely settled place is not automatically crowded, unpleasant or unhealthy, and a sparsely settled place is not empty, unwanted or lesser. Those words describe how many people are in an area, and nothing else. Geographers measure population; they do not grade it.',
      ],
      vocabulary: [
        { term: 'population distribution', definition: 'the pattern of where people live across an area.' },
        {
          term: 'population density',
          definition: 'the number of people for each unit of area, found by dividing population by land area.',
        },
        { term: 'densely populated', definition: 'having many people for each unit of area.' },
        { term: 'sparsely populated', definition: 'having few people for each unit of area.' },
        { term: 'arable land', definition: 'land where crops can be grown.' },
        {
          term: 'average',
          definition: 'a single number that stands in for a whole group, which can hide how uneven the group really is.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-predict-the-distribution',
      kind: 'worked_example',
      problem:
        'Predict the population distribution of an island from its physical geography, using only the five conditions from the concept.\n\n"Calder Island is shaped like a tilted plate. The eastern third is a flat coastal plain. A wide river crosses it and empties into a sheltered bay, rain falls in every season, and the soil is deep. The western two thirds rise into steep mountains, and behind the mountains sits a high plateau where almost no rain falls and the nights are freezing."',
      steps: [
        'Do not guess first. Go through the five conditions one at a time and mark where each one is satisfied.',
        'Fresh water: the wide river is on the eastern plain. Arable land: the deep soil is on the eastern plain. Moderate climate: rain in every season is on the eastern plain. Flat land: the plain is flat, and the west is steep. Access to trade: the sheltered bay is a place ships can use, and it is on the eastern side.',
        'That is five out of five on the eastern third. The prediction is that settlement is dense there.',
        'Now check the west against the same list. Steep mountains fail the flat-land test and the arable-land test. The high plateau is very dry and very cold, so it fails the water test and the climate test. The prediction is sparse settlement in the west.',
        'Say the distribution in words: people are clustered along the eastern coastal plain, most likely thickest where the river meets the bay, and thin to almost nobody across the mountains and the dry plateau.',
        'Notice what you did NOT do. You did not calculate anything. Distribution is a pattern you describe, and you can predict it from physical geography alone.',
      ],
      answer:
        'Settlement is predicted to be dense on the eastern coastal plain -- it has fresh water, deep soil, year-round rain, flat ground and a usable bay -- and sparse across the steep western mountains and the dry, freezing plateau behind them, which fail every one of those tests.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-average-hides-clustering',
      kind: 'worked_example',
      problem:
        'Calculate the population density of an invented country, then explain what the number does not tell you.\n\n"Marovia has a population of 6,000,000 people and a land area of 300,000 square miles. Four out of every five Marovians live in one of four cities, and all four cities sit along the same river. The rest of the country is desert."',
      steps: [
        'Use the definition: density equals population divided by land area.',
        '6,000,000 people divided by 300,000 square miles equals 20 people per square mile. That is the population density of Marovia, and it is a low figure.',
        'Now ask the honest question: does that number describe any actual place in Marovia? Read the case again. Four out of five people are in four cities on one river.',
        'So the desert has far fewer than 20 people per square mile, and the four cities have far more. There may be no square mile in the entire country where exactly 20 people live. The average describes the country and describes nowhere in it.',
        'WRONG conclusion: "Marovia has a density of 20 people per square mile, so people there have lots of space and are spread thinly across the land." CORRECT conclusion: "Marovia has a low average density, but its distribution is heavily clustered along one river, so most Marovians live packed close together."',
        'The lesson generalizes. Density answers how many for each square mile ON AVERAGE. It never answers where. To answer where, you need the distribution, and the two claims can point in opposite directions at once.',
      ],
      answer:
        'The density is 20 people per square mile, because 6,000,000 divided by 300,000 equals 20. That figure is an average and hides the clustering: with four out of five people in four cities on one river, the desert is far below 20 per square mile and the cities are far above it, so the low density does not mean people are spread out.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-question-is-density',
      kind: 'try_yourself',
      problem: 'Which of these is a question about population DENSITY rather than about population distribution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How many people live in each square mile of the country?', correct: true },
        { id: 'b', text: 'Which parts of the country have almost no people living in them?' },
        { id: 'c', text: 'Are people spread evenly across the country, or gathered in a few places?' },
        { id: 'd', text: 'In which region of the country do most people live?' }
      ],
      expectedAnswer: 'How many people live in each square mile of the country?',
      hints: [
        'Density is a number you calculate by dividing population by land area. Distribution is a pattern you describe in words.',
        'Three of these ask WHERE. Only one asks HOW MANY FOR EACH UNIT OF AREA.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-physical-conditions',
      kind: 'try_yourself',
      problem:
        'Four regions are described below. Using the physical conditions from the concept, which one would you expect to be the most densely settled?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A flat coastal plain with a large river, year-round mild temperatures and deep farm soil', correct: true },
        { id: 'b', text: 'A high mountain range where the slopes are steep and the growing season is very short' },
        { id: 'c', text: 'A desert interior where rain almost never falls and there is little fresh water' },
        { id: 'd', text: 'A polar region that stays covered in ice through most of the year' }
      ],
      expectedAnswer:
        'A flat coastal plain with a large river, year-round mild temperatures and deep farm soil',
      hints: [
        'Run the five conditions down each choice: fresh water, arable land, moderate climate, flat land, access to the coast or a trade route.',
        'One choice satisfies several conditions at once. The other three each fail on water, on temperature, or on the steepness of the ground.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-average-hides-clustering',
      kind: 'try_yourself',
      problem:
        'A country has a low overall population density. Knowing only that one number, which statement is safe to conclude?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The land in that country is nearly empty everywhere you go.' },
        { id: 'b', text: 'That country must have a very large land area.' },
        { id: 'c', text: 'The people of that country are spread out evenly across the land.' },
        {
          id: 'd',
          text: 'Across the whole country there are few people for each square mile, but they may still be gathered into a few crowded places.',
          correct: true,
        }
      ],
      expectedAnswer:
        'Across the whole country there are few people for each square mile, but they may still be gathered into a few crowded places.',
      hints: [
        'Density is an average. Ask yourself what an average is allowed to tell you, and what it quietly hides.',
        'A low average is made of both the empty parts and the packed parts. Which choice leaves room for both?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-density-vs-distribution',
      kind: 'misconception_check',
      question:
        'A student is told that a country has a low population density and writes: "So people there are spread out, and there is plenty of open land in every part of the country." What has gone wrong?',
      commonErrors: [
        {
          answer: 'The density is low, so people there are spread out across the country.',
          misconception:
            'Reading a density figure as if it were a distribution. The student assumes an average describes every square mile equally, when an average is exactly the number that hides how uneven a place is.',
          correctsTo:
            'Density and distribution answer different questions. WRONG: "Low density means people are spread out." CORRECT: "Low density means there are few people for each square mile on average, and the distribution could still be heavily clustered." A country can have a low overall density while nearly everyone lives in a few cities along one river or one coast. The average and the pattern can point in opposite directions at the same time, so a density figure alone never tells you where people are.',
        },
        {
          answer: 'A low-density country therefore has open, usable land everywhere in it.',
          misconception:
            'Treating a low density figure as proof that the whole country has room to spare, and forgetting that much of the land may be desert, ice, mountain or otherwise hard to live on.',
          correctsTo:
            'The land area in the density calculation includes every square mile, including the parts almost nobody can farm or build on. That is often exactly WHY the density is low. So a low figure is frequently a sign that a large share of the country is very dry, very cold, very high or very difficult, rather than a sign that there is comfortable open space waiting everywhere.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Distribution is WHERE people are. Density is HOW MANY people there are for each unit of area. Two different questions.',
        'Density equals population divided by land area, giving people per square mile or per square kilometer.',
        'People cluster where there is fresh water, arable land, a moderate climate, flat land, and access to the coast or a trade route.',
        'People are sparse where it is very dry, very cold, very high, or very wet and difficult.',
        'Density is an average, and averages hide clustering. A low density can sit on top of a heavily clustered distribution.',
        'Dense and sparse are measurements, not judgments. They say how many people are in an area, and nothing more.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Population Distribution & Density' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
