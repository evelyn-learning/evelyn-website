/**
 * Grades 3-5 Social Studies — World Cultures (Regions).
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_WORLD_CULTURES: LessonPlan = {
  id: 'evelyn.g35.ss.world-cultures.v1',
  title: 'Grades 3-5 SS — World Cultures',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.world-cultures',
      description: 'Identify major world regions and characteristic cultural features (language, religion, food, customs).',
      standard: 'NCSS 3-5 Culture / Global Connections',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The world has THOUSANDS of distinct cultures — knowing the broad regions helps you see patterns.',
      script: 'A child in Japan eats rice with chopsticks; a child in Italy eats pasta with a fork. Both eat. Both grow up. But the foods, languages, and traditions differ. Today we drill broad world regions and their cultural features.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cultures',
      kind: 'concept',
      goal: 'World regions + cultural elements + diversity.',
      keyIdeas: [
        'CULTURE includes: LANGUAGE, RELIGION, FOOD, CLOTHING, HOLIDAYS, MUSIC, ART, CUSTOMS.',
        'WORLD REGIONS (broad groupings):',
        '1) NORTH AMERICA: US, Canada, Mexico. Languages: English, Spanish, French, many Indigenous languages.',
        '2) LATIN AMERICA (Central + South America): mostly Spanish/Portuguese-speaking. Catholicism, soccer, varied foods.',
        '3) EUROPE: many countries (France, Germany, UK, Italy, etc.). Many languages. Christianity strong historically; secular today.',
        '4) AFRICA: 54 countries, 1000+ languages. Diverse religions: Islam (north), Christianity (south), traditional religions throughout.',
        '5) MIDDLE EAST: Saudi Arabia, Egypt, Iran, Israel, etc. Mostly Arabic, Persian, Hebrew. Major religions: Islam, Judaism, Christianity.',
        '6) SOUTH ASIA: India, Pakistan, Bangladesh. Hindu, Muslim, Sikh, Buddhist. Languages: Hindi, Urdu, Bengali, Tamil, many more.',
        '7) EAST ASIA: China, Japan, Korea. Mandarin, Japanese, Korean. Buddhism, Confucianism, Shinto.',
        '8) SOUTHEAST ASIA: Vietnam, Thailand, Indonesia, Philippines. Buddhism, Islam, Christianity. Diverse foods.',
        '9) OCEANIA: Australia, Pacific Islands, New Zealand. Indigenous + colonial-era cultures.',
        'NO REGION IS UNIFORM: each contains many distinct cultures, languages, religions.',
        'COMMON THREAD: every culture has WAYS OF LIVING that work for its people\'s history and environment. None is "better" — just different.',
      ],
      vocabulary: [
        { term: 'culture', definition: 'the shared customs, language, food, beliefs, and ways of life of a group.' },
        { term: 'region', definition: 'a large area of the world grouped by location and shared features.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-region',
      kind: 'worked_example',
      problem: 'List THREE elements of culture in EAST ASIA (China, Japan, Korea).',
      steps: [
        '1) Languages: Mandarin (China), Japanese (Japan), Korean (Korea).',
        '2) Foods: rice, noodles, dumplings, fish, soy. Chopsticks for utensils.',
        '3) Religions/philosophies: Buddhism, Confucianism, Shinto (Japan).',
        'Other features: writing systems (Chinese characters, Japanese kana, Korean hangul). Holidays like Lunar New Year.',
      ],
      answer: 'Languages, foods, religions of East Asia.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does the FOOD of a region often depend on where it is GEOGRAPHICALLY?',
      expectedAnswer: 'People eat what grows or lives nearby. Rice grows in wet climates (East/Southeast Asia). Wheat grows in dry climates (Middle East, Mediterranean). Coastal regions eat fish. Cold regions might preserve meat (smoked, dried). Geography shapes diet, then diet becomes culture.',
      responseFormat: 'free',
      hints: [
        'What grows in different climates?',
        'Coastal vs inland?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-superior',
      kind: 'misconception_check',
      question: 'A child says "American culture is the BEST." Why is this wrong-headed?',
      commonErrors: [
        {
          answer: 'My culture is best',
          misconception: 'Treating one\'s own culture as superior.',
          correctsTo: 'Cultures aren\'t ranked — they\'re different ways of living adapted to different histories and places. Each culture has things to teach. Calling one "best" usually reflects familiarity with one\'s own (we like what we know). A more thoughtful view: "Every culture has wisdom; learning others\' enriches my own." Cultural respect doesn\'t mean abandoning your own — it means honouring difference.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Culture = language, food, religion, music, customs.',
        '9 broad world regions, but each has many internal cultures.',
        'Geography shapes culture (food, clothing).',
        'No culture is "better" — each fits its history and place.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does technology like the internet change cultures?',
      hint: 'It SPEEDS exchange. A teenager in Brazil can watch K-pop from Korea, eat sushi at a local restaurant, and play video games made in the US. Cultures BLEND faster than ever — sometimes celebrated as "global culture", sometimes worried about as "loss of local traditions". The reality is both: cultures keep their cores while borrowing freely. Identity becomes layered.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
