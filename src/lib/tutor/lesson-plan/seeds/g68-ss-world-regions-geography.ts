/**
 * Grades 6-8 Social Studies — World Regions & Geography.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_WORLD_REGIONS_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.g68.ss.world-regions-geography.v1',
  title: 'Grades 6-8 SS — World Regions & Geography',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.world-regions-geography',
      description: 'Identify the seven continents, major regions, and how physical geography shapes human activity.',
      standard: 'NCSS 6-8 People, Places, Environments',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Knowing the world\'s regions and physical features unlocks news, history, and travel.',
      script: 'Mention "the Sahel" or "the Andes" or "Southeast Asia" and a literate listener immediately pictures a region — its climate, peoples, and challenges. Today we drill the world map you\'ll need for the rest of life.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-world-regions',
      kind: 'concept',
      goal: 'Continents + regions + landforms + how geography shapes life.',
      keyIdeas: [
        'SEVEN CONTINENTS: Africa, Antarctica, Asia, Australia/Oceania, Europe, North America, South America.',
        'OCEANS (5): Pacific (largest), Atlantic, Indian, Southern (around Antarctica), Arctic.',
        'MAJOR REGIONS (selected):',
        '  AFRICA: Sahara desert, Sahel, sub-Saharan Africa, Horn of Africa, Maghreb (NW), Southern Africa.',
        '  ASIA: Middle East, South Asia (India, Pakistan), Southeast Asia, East Asia (China, Japan, Korea), Central Asia, Russia/Siberia.',
        '  EUROPE: Western Europe, Eastern Europe, Scandinavia, Mediterranean.',
        '  AMERICAS: North America, Central America, Caribbean, South America (Andes, Amazon).',
        '  OCEANIA: Australia, New Zealand, Pacific Islands (Micronesia, Melanesia, Polynesia).',
        'KEY LANDFORMS: mountains (Himalayas, Andes, Rockies, Alps), deserts (Sahara, Gobi, Atacama), rivers (Nile, Amazon, Yangtze, Mississippi), rainforests (Amazon, Congo).',
        'CLIMATE ZONES: tropical (equator), arid (deserts), temperate (mid-latitudes), polar (poles), highland (mountains).',
        'GEOGRAPHY SHAPES LIFE:',
        '  CITIES at coasts and rivers — for trade and water.',
        '  FARMING in fertile valleys (Nile, Mississippi, Mekong).',
        '  POVERTY higher in landlocked countries with poor infrastructure.',
        '  NATURAL HAZARDS shape culture (earthquakes in Japan, hurricanes in Caribbean, droughts in Sahel).',
        'WHY MAPS MATTER: news from anywhere on Earth makes more sense if you can place it geographically.',
      ],
      vocabulary: [
        { term: 'continent', definition: 'one of seven large landmasses on Earth.' },
        { term: 'region', definition: 'a part of the world grouped by location and shared characteristics.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-region',
      kind: 'worked_example',
      problem: 'What is the Sahel, and what challenges shape life there?',
      steps: [
        'SAHEL: a band of land in Africa BETWEEN the Sahara desert (north) and tropical Africa (south). Crosses countries like Mauritania, Mali, Niger, Chad, Sudan.',
        'CLIMATE: semi-arid. Rainfall is highly variable — some years drought, others flooding.',
        'CHALLENGES: drought, desertification (Sahara expanding), food insecurity, conflict over scarce resources.',
        'PEOPLES: many ethnic groups including Tuareg, Fulani, Hausa, Wolof. Languages and religions vary.',
        'ECONOMIES: largely agricultural and pastoral (livestock); vulnerable to climate change.',
        'GEOGRAPHY → vulnerability — but also resilience and rich culture.',
      ],
      answer: 'Semi-arid African band; faces drought, food insecurity, climate stress.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why have many of the world\'s great cities developed near RIVERS or COASTS?',
      expectedAnswer: 'Water for drinking, irrigation, fishing, and TRADE (boats and ships). Easier to move goods and people. Rivers also bring fertile soil. Most ancient and modern megacities (London, Cairo, Shanghai, Mumbai, NYC) sit at coasts or rivers.',
      responseFormat: 'free',
      hints: [
        'Think trade, water, food.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-fixed',
      kind: 'misconception_check',
      question: 'A student says "geography determines a country\'s fate." Why is this oversimplified?',
      commonErrors: [
        {
          answer: 'Geography determines fate',
          misconception: 'Treating geography as deterministic rather than influential.',
          correctsTo: 'Geography INFLUENCES but doesn\'t determine. Singapore (a small island with few resources) became one of the wealthiest places on Earth through smart policy and trade. Switzerland (landlocked, mountainous) is wealthy. Russia (vast resources) has uneven outcomes. Geography sets challenges and opportunities; HUMANS choose how to respond. Calling fate "geography" ignores history, policy, culture, and chance.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Seven continents, five oceans.',
        'Major regions within each continent.',
        'Key landforms: mountains, deserts, rivers, rainforests.',
        'Climate zones: tropical, arid, temperate, polar, highland.',
        'Geography shapes — but doesn\'t determine — human life.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does CLIMATE CHANGE redraw the world map?',
      hint: 'Rising seas threaten low-lying nations (Bangladesh, Maldives, parts of Florida). Warming opens Arctic shipping routes once frozen. Some regions become drier (Mediterranean), others wetter. Migration patterns shift. The map of where humans CAN live and what they can grow is changing in real time. Geography 2050 may differ significantly from geography 2024.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
