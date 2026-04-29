/**
 * Grade 6 Science — Climate Systems and Weather Patterns.
 * NGSS MS-ESS2-5 / MS-ESS2-6: factors influencing weather; air masses
 * and pressure differences create weather; oceans + atmosphere shape
 * climate.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_CLIMATE_WEATHER: LessonPlan = {
  id: 'evelyn.g6.science.earth.climate-weather.v1',
  title: 'How Weather and Climate Work',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.ms-ess2-5', description: 'Collect data to provide evidence for how the motions and complex interactions of air masses results in changes in weather conditions.', standard: 'NGSS.MS-ESS2-5' }],
  prerequisites: ['ngss.3-ess2-1'], followUps: ['ngss.hs-ess2-4'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in a familiar weather event.', script: 'A cold front rolls in. Within hours: temperature drops, rain pours, wind picks up. What\'s the science behind a weather change?', estimatedMinutes: 2 },
    { id: 'concept-air-masses', kind: 'concept', goal: 'Weather is driven by air masses with different temperatures and moisture, plus the boundaries (fronts) where they meet.', keyIdeas: [
      'AIR MASSES are huge volumes of air with similar temperature + humidity.',
      'Cold air = denser, sinks. Warm air = less dense, rises.',
      'When air masses meet, the boundary is called a FRONT.',
      'COLD FRONT: cold air pushes under warm → warm air forced up → rapid cooling → THUNDERSTORMS.',
      'WARM FRONT: warm air slides over cold → gradual cooling → STEADY rain.',
      'High pressure = sinking air = clear skies. Low pressure = rising air = clouds + storms.',
      'Wind = air flowing from high to low pressure.',
    ], vocabulary: [{ term: 'air mass', definition: 'a large body of air with similar properties.' }, { term: 'front', definition: 'boundary between air masses.' }, { term: 'pressure', definition: 'force of air pushing down.' }], estimatedMinutes: 5 },
    { id: 'concept-climate-drivers', kind: 'concept', goal: 'Climate of a region is shaped by latitude, elevation, oceans, and prevailing winds.', keyIdeas: [
      'LATITUDE: closer to equator = warmer (sun more direct).',
      'ELEVATION: higher = colder (thinner air holds less heat).',
      'OCEAN currents: carry heat (Gulf Stream warms northern Europe).',
      'PREVAILING WINDS: shape patterns (trade winds, jet stream).',
      'Mountain ranges: rain shadows (one side wet, other side dry).',
    ], estimatedMinutes: 4 },
    { id: 'worked-cold-front', kind: 'worked_example', problem: 'Why do thunderstorms often form along a cold front?', steps: [
      'COLD AIR mass moves toward an area where WARM AIR is sitting.',
      'Cold air is DENSER → wedges UNDER the warm air, pushing it UP fast.',
      'Warm air rises rapidly + cools → water vapor CONDENSES into clouds.',
      'Strong updrafts + condensation release energy → tall storm clouds (cumulonimbus) → thunderstorms.',
      'Cold fronts move fast → storms are intense but often short.',
    ], answer: 'The cold air shoves the warm air UP fast. The rising warm air condenses → strong storms.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'San Francisco (37°N, on the coast) and St. Louis (38°N, in the middle of a continent) are at almost the same LATITUDE. Why does San Francisco have much milder summers and warmer winters?', expectedAnswer: 'Ocean influence. San Francisco is next to the Pacific — water heats and cools slowly, moderating coastal temperatures. St. Louis has no nearby ocean, so it heats up extreme in summer and cools off cold in winter (continental climate).', responseFormat: 'free', hints: ['Same latitude — what other factor differs?', 'Oceans vs continental interiors handle heat differently.'], estimatedMinutes: 3 },
    { id: 'misconception-storms-random', kind: 'misconception_check', question: 'A friend says "weather is random — there\'s no real pattern, it just happens." Right?', commonErrors: [{ answer: 'Yes — random.', misconception: 'Treating weather as unpredictable noise.', correctsTo: 'Weather follows physical laws (pressure, temperature, moisture). It\'s COMPLEX (small differences amplify), but not random — meteorologists predict 1-3 days ahead with high accuracy. Climate (long-term) is even more predictable than weather.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Weather = air masses + fronts.', 'Cold front = fast intense storms; warm front = steady rain.', 'High pressure = clear; low pressure = stormy.', 'Climate shaped by latitude, elevation, ocean, winds, mountains.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
