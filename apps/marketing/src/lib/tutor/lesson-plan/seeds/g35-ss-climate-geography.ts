/**
 * Grades 3-5 Social Studies — Climate & Physical Geography.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_CLIMATE_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.g35.ss.climate-geography.v1',
  title: 'Grades 3-5 SS — Climate & Physical Geography',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.climate-geography',
      description: 'Identify major climate zones and physical features (mountains, rivers, deserts) and how they shape human life.',
      standard: 'NCSS 3-5 People, Places, Environments',
    },
  ],
  prerequisites: ['g35.ss.lat-long-mapping'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Where you live shapes how you live — climate and geography influence food, clothing, housing, and culture.',
      script: 'Why do people in Greenland wear thick fur coats while people in Hawaii wear shorts? Why do farms thrive in Iowa but not in the Sahara? Climate and geography are the answers. Today we drill the major zones.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-climate',
      kind: 'concept',
      goal: 'Climate zones + physical features + human adaptation.',
      keyIdeas: [
        'CLIMATE: the typical weather of a place over years. Different from WEATHER (today).',
        'MAJOR CLIMATE ZONES (simplified):',
        '1) TROPICAL — near the equator. Hot year-round. Rainforests (heavy rain) or savannas (wet/dry seasons).',
        '2) DESERT — very dry, hot or cold. Sahara (Africa), Gobi (Asia), Atacama (S. America).',
        '3) TEMPERATE — between tropics and polar. Four seasons. Most populated zone.',
        '4) POLAR — far north or far south. Cold year-round. Arctic, Antarctic.',
        '5) MOUNTAIN — high elevations. Cooler than surrounding lowlands.',
        '6) MEDITERRANEAN — hot dry summers, mild wet winters. Southern Europe, parts of California.',
        'PHYSICAL FEATURES include: MOUNTAINS, RIVERS, DESERTS, FORESTS, OCEANS, PLAINS, ISLANDS.',
        'HUMAN ADAPTATION: clothing matches climate (parkas in cold; loose cotton in heat). Houses match weather (stilts in floods, sloped roofs in snow). Foods match what grows.',
        'GEOGRAPHY SHAPES SETTLEMENT: people cluster near WATER (rivers, coasts) and FERTILE LAND.',
        'HUGE CITIES sit at NATURAL FEATURES: New York at a harbour. Cairo at the Nile. Tokyo on a coast.',
      ],
      vocabulary: [
        { term: 'climate', definition: 'the long-term pattern of weather in a place.' },
        { term: 'temperate', definition: 'a mild climate zone with four seasons.' },
        { term: 'tropical', definition: 'a climate near the equator that is hot year-round.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-climate-effect',
      kind: 'worked_example',
      problem: 'How might HOMES be different in a TROPICAL rainforest vs an ARCTIC region?',
      steps: [
        'TROPICAL RAINFOREST: hot, wet, humid year-round.',
        '  - Houses on STILTS (avoid floods, allow airflow).',
        '  - Open windows, big roof overhangs (cool + shed rain).',
        '  - Made of bamboo, palm leaves, light wood.',
        'ARCTIC: cold, snowy, windy.',
        '  - Insulated walls, small windows (keep heat in).',
        '  - Sloped roofs (snow slides off).',
        '  - Made of thick wood, sometimes stone or sod (or igloos historically).',
        'Same human need (shelter), different geography → different solution.',
      ],
      answer: 'Stilted, open homes in tropics; insulated, small-window homes in Arctic.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why might a city grow up near a RIVER?',
      expectedAnswer: 'Rivers provide drinking water, fertile soil for farming, fish, and a way to transport goods (boats). All four make rivers natural places for cities to develop.',
      responseFormat: 'free',
      hints: [
        'What do rivers PROVIDE?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-climate-weather',
      kind: 'misconception_check',
      question: 'A child says "the climate is hot today." Why is this wrong?',
      commonErrors: [
        {
          answer: '"Climate today is hot"',
          misconception: 'Confusing daily WEATHER with long-term CLIMATE.',
          correctsTo: 'WEATHER is what\'s happening NOW (today is hot). CLIMATE is the long-term pattern (this place tends to be hot in summer, cool in winter — its climate is "temperate"). One day\'s weather can\'t define climate. To know climate, look at YEARS of weather data.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Climate = long-term pattern. Weather = today.',
        'Major zones: tropical, desert, temperate, polar, mountain, Mediterranean.',
        'Physical features: mountains, rivers, deserts, forests, oceans.',
        'Geography shapes housing, clothing, food, settlements.',
        'Cities cluster near water and fertile land.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might CLIMATE CHANGE affect where people can live in the future?',
      hint: 'As climates shift, some places may become too hot, too dry, or too flooded for current populations. Coastal cities face rising seas. Some regions may become MORE habitable (warmer, longer growing seasons). Migration patterns are likely to change. The geography of where humans cluster has always responded to climate; we may see the next big shift in our lifetimes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
