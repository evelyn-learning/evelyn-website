/**
 * G7 — Age of Exploration deep dive (1400s-1600s).
 *
 * Portuguese, Spanish, Dutch, English voyages. Caravels, compass,
 * astrolabe. Trans-Atlantic Slave Trade. Honest take.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_AGE_OF_EXPLORATION_DEEP: LessonPlan = {
  id: 'evelyn.g7.ss.world-history.age-of-exploration-deep.v1',
  title: 'Age of Exploration: voyages, technology, and slave trade',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.age-of-exploration',
      description: 'Analyze the causes, methods, and consequences of European exploration including the trans-Atlantic slave trade.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.renaissance'],
  followUps: ['ncss.68.history.colonial-period'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame this era as world-shrinking and devastating.',
      script: 'Before 1492, the world\'s major regions barely knew each other existed. By 1600, ships were crossing oceans, kingdoms were trading across hemispheres, and millions had been enslaved. This era reshaped the planet — for better and for worse.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tech-and-actors',
      kind: 'concept',
      goal: 'Tech enabling exploration + which countries led + the slave trade.',
      keyIdeas: [
        'TECHNOLOGY: CARAVEL (smaller, faster ship that could sail against wind). MAGNETIC COMPASS (from China via Arabs). ASTROLABE (measure latitude from the sun). Better MAPS.',
        'PORTUGAL led first. Prince Henry the Navigator funded explorers. Vasco da Gama sailed around Africa to India (1498).',
        'SPAIN: Columbus sailed west, reached Caribbean (1492). Cortés conquered Aztec Empire (1521). Pizarro conquered Inca (1533).',
        'OTHERS: France, Netherlands, England joined later. Set up colonies in North America, Caribbean, Asia.',
        'COLUMBIAN EXCHANGE: foods, animals, diseases moved both ways. Tomatoes, potatoes, corn → Europe. Horses, wheat, sugarcane → Americas. Smallpox, measles → Americas, killing ~90% of Indigenous populations.',
        'TRANS-ATLANTIC SLAVE TRADE (~1500-1880): ~12 million Africans forcibly taken. Brutal Middle Passage across Atlantic; ~2 million died en route. Sold into slavery in Americas, especially sugar plantations of Caribbean and Brazil. Powered colonial economies for 350 years.',
        'IMPACT: created the world\'s first GLOBAL economy. Made some European countries massively rich. Devastated African societies (lost millions of young people). Foundation of racial hierarchies that still echo today.',
      ],
      vocabulary: [
        { term: 'caravel', definition: 'a small, agile sailing ship that could sail against the wind.' },
        { term: 'Middle Passage', definition: 'the brutal voyage of enslaved Africans across the Atlantic.' },
        { term: 'Columbian Exchange', definition: 'the swap of plants, animals, diseases between the Americas and Eurasia.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-impact',
      kind: 'worked_example',
      problem: 'Why did European diseases devastate Indigenous populations more than the reverse?',
      steps: [
        'Europeans had been around dense livestock (cows, pigs, chickens) for thousands of years. Many human diseases came from animals — smallpox, measles, influenza.',
        'Europeans built up partial IMMUNITY through generations of exposure.',
        'Indigenous Americans had no domesticated livestock at scale → less disease pressure → less immunity.',
        'When Europeans arrived, they brought diseases that Indigenous immune systems had never seen.',
        'Result: estimated 90% of Indigenous populations died from disease (often before any direct contact with Europeans, as diseases spread ahead).',
        'Diseases that went the other way (syphilis maybe) had much smaller impact.',
      ],
      answer: 'Europeans had immunity from centuries of livestock exposure; Indigenous peoples had not encountered these diseases',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Roughly how many Africans were forcibly taken across the Atlantic during the trans-Atlantic slave trade?',
      expectedAnswer: 'about 12 million',
      responseFormat: 'free',
      hints: [
        'It\'s in the millions.',
        'About 2 million died on the Middle Passage; ~10 million arrived as enslaved people.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-glory-only',
      kind: 'misconception_check',
      question: 'Was the Age of Exploration mostly about brave adventurers discovering new lands?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Romanticizing exploration as adventure.',
          correctsTo: 'It WAS adventurous, but it was also CONQUEST and EXPLOITATION. Indigenous peoples were displaced or killed; millions of Africans were enslaved. Honest history holds both: the technological/exploration achievements AND the human cost.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tech: caravel, compass, astrolabe.',
        'Portugal first; Spain, France, Netherlands, England followed.',
        'Columbian Exchange swapped foods, animals, diseases — devastating Indigenous Americans.',
        '~12 million Africans forced into slavery across the Atlantic.',
        'Built first global economy AND foundational injustices that still shape today.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the slave trade enrich PARTICULAR European countries — and what cities reflect that wealth today?',
      hint: 'Liverpool, Bristol, Bordeaux, Nantes, Lisbon — built on slave trade profits. Many universities, banks, and historic buildings trace funding to the trade. Several have begun acknowledging this history publicly.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
