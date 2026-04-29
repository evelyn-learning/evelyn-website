/**
 * Grade 3 Science — Weather and Climate.
 * NGSS 3-ESS2-1 / 3-ESS2-2: typical weather conditions over time;
 * climate as the long-term pattern of weather in a region.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_WEATHER_CLIMATE: LessonPlan = {
  id: 'evelyn.g3.science.earth.weather-climate.v1',
  title: 'Weather vs. Climate',
  curriculum: 'NGSS', grade: '3', subject: 'science', topic: 'earth-and-space', locale: 'en',
  los: [{ id: 'ngss.3-ess2-1', description: 'Represent data in tables and graphical displays to describe typical weather conditions expected during a particular season.', standard: 'NGSS.3-ESS2-1' }, { id: 'ngss.3-ess2-2', description: 'Obtain and combine information to describe climates in different regions of the world.', standard: 'NGSS.3-ESS2-2' }],
  prerequisites: ['ngss.k-ess2-1'], followUps: ['ngss.ms-ess2-5'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Set up the difference between today\'s weather and a place\'s overall climate.', script: 'It rained today in Phoenix, Arizona — even though Phoenix is famous for being a hot, dry desert. Was the meteorologist wrong about the climate? No. Today\'s WEATHER and a place\'s CLIMATE are two different things.', estimatedMinutes: 1 },
    { id: 'concept-weather-vs-climate', kind: 'concept', goal: 'Weather is what\'s happening right now or this week. Climate is the long-term average pattern over many years.', keyIdeas: [
      'WEATHER changes day to day — sunny today, rainy tomorrow.',
      'CLIMATE is the AVERAGE weather of a place over MANY YEARS (typically 30+).',
      'Phoenix CLIMATE: hot and dry. But on any given day Phoenix WEATHER might be cool or rainy — exceptions happen.',
      'Climate types include: TROPICAL (hot, wet), DESERT (hot, dry), TEMPERATE (mild, four seasons), POLAR (cold, snowy), MOUNTAIN (cool, varies with altitude).',
      'Climate depends on latitude (distance from equator), nearness to oceans, altitude, and prevailing winds.',
    ], vocabulary: [{ term: 'climate', definition: 'long-term average weather of a region.' }, { term: 'temperate', definition: 'mild climate with four distinct seasons.' }], estimatedMinutes: 4 },
    { id: 'worked-phoenix-vs-seattle', kind: 'worked_example', problem: 'In a typical year, Phoenix gets ~8 inches of rain; Seattle gets ~38 inches. Both have rainy days. What\'s different — the weather or the climate?', steps: ['Each city has WEATHER (some days are rainy, some are sunny).', 'But the YEAR-OVER-YEAR PATTERNS are very different: Phoenix averages dry; Seattle averages wet.', 'That\'s CLIMATE — the long-term pattern. Climate differs even though daily weather varies in both.'], answer: 'The climate is different (Phoenix dry, Seattle wet) — even though both have day-to-day weather variation.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Someone says "global warming can\'t be real because it snowed in Texas last week." Is this comment about weather or climate? Does it disprove climate change?', expectedAnswer: 'It\'s about a single weather event. One cold day or week doesn\'t disprove climate change — climate is about LONG-TERM averages over decades. Global warming refers to the trend, not every individual day.', responseFormat: 'free', hints: ['Snow in Texas = a single event. Is that weather or climate?', 'Climate is about long-term averages.'], estimatedMinutes: 3 },
    { id: 'misconception-weather-equals-climate', kind: 'misconception_check', question: 'A friend says "weather and climate are basically the same thing." Right or wrong?', commonErrors: [{ answer: 'Same thing.', misconception: 'Conflating short-term weather with long-term climate patterns.', correctsTo: 'Different time scales. Weather = today/this week. Climate = average over many years. Saying "it\'s sunny today" describes weather; saying "this region averages 8 inches of rain per year" describes climate.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Weather: short-term, changes day to day.', 'Climate: long-term average over many years.', 'A single weather event doesn\'t disprove a climate trend.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
