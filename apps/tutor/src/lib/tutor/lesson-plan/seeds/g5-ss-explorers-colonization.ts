/**
 * G5 — Age of Exploration and early colonization.
 *
 * Why Europeans crossed the Atlantic, who came first, what
 * happened to the people already living here. Honest take —
 * including the impact on Indigenous peoples.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SS_EXPLORERS_COLONIZATION: LessonPlan = {
  id: 'evelyn.g5.ss.us-history.exploration-colonization.v1',
  title: 'The Age of Exploration and early colonization',
  curriculum: 'NCSS',
  grade: '5',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.35.history.exploration',
      description: 'Explain how the Age of Exploration affected peoples in the Americas, Europe, and Africa.',
      standard: 'NCSS.D2.His.2.3-5',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.35.history.colonial-period'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the era as risky and motivated by money and beliefs.',
      script: 'Imagine sailing into an ocean no one in your country has ever crossed, with no map. Why would anyone do that? Spices, gold, glory, and religion. The 1400s and 1500s were one of the wildest gambling sprees in history.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-why-explore',
      kind: 'concept',
      goal: 'Three big motives drove European exploration; the result reshaped three continents.',
      keyIdeas: [
        'WHY: 1) New trade routes for spices/silk. 2) Gold and wealth. 3) Spreading Christianity. 4) National pride / glory.',
        'KEY EXPLORERS: Christopher Columbus (1492, sailed for Spain, landed in Caribbean — thought it was Asia). Vasco da Gama (around Africa to India). Magellan\'s crew (first to sail around the world).',
        'IMPACT on Indigenous peoples: 90% died from European diseases (smallpox, measles) within 100 years. Land taken. Cultures destroyed. This is the dark side of "discovery".',
        'COLUMBIAN EXCHANGE: foods, animals, diseases, ideas crossed the Atlantic both ways. Tomatoes and potatoes went to Europe; horses and wheat came to Americas.',
        'COLONIZATION: European countries claimed land in the Americas. Spain in the south and southwest, England along the east coast, France in Canada and the Mississippi River valley.',
      ],
      vocabulary: [
        { term: 'exploration', definition: 'traveling to find or learn about new places.' },
        { term: 'colonization', definition: 'when people from one country settle and rule land elsewhere.' },
        { term: 'Columbian Exchange', definition: 'the swap of plants, animals, and diseases between the Americas and Europe.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-columbus-impact',
      kind: 'worked_example',
      problem: 'Columbus called the people he met "Indians". Why was that wrong?',
      steps: [
        'Columbus was trying to reach INDIA by sailing west — he thought the Earth was smaller than it is.',
        'He landed in the Caribbean and assumed he\'d reached Asia. He called the people there "Indians" by mistake.',
        'They weren\'t Indians at all — they were the TAÍNO people, with their own language, towns, and culture, totally separate from India.',
        'Today we use INDIGENOUS or Native American to describe the original peoples of the Americas — more accurate, more respectful.',
      ],
      answer: 'he thought he was in India, but the Caribbean people were Taíno — completely separate peoples',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name ONE thing that crossed the Atlantic during the Columbian Exchange and changed life in Europe.',
      expectedAnswer: 'tomatoes (or potatoes, corn, chocolate, tobacco)',
      responseFormat: 'free',
      hints: [
        'Think about Italian food without one specific red fruit.',
        'Or Irish food without one starchy vegetable.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-discovery',
      kind: 'misconception_check',
      question: 'Did Columbus "discover" America?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Columbus as discovering an empty continent.',
          correctsTo: 'No — millions of Indigenous people had lived in the Americas for thousands of years before 1492. He arrived as a stranger to lands that were already home. "Encountered" or "reached" is more honest than "discovered".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Europeans crossed the Atlantic for trade, gold, glory, religion — starting late 1400s.',
        'Indigenous peoples lost 90% of their population to disease and were displaced.',
        'The Columbian Exchange swapped foods, animals, and diseases — reshaping diets on both sides.',
        'Spain, England, France colonized different regions of the Americas.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why didn\'t the diseases go BOTH ways equally — why did Indigenous people get sick from European diseases more than the other way around?',
      hint: 'Europeans had been around livestock (cows, pigs) and crowded cities for a long time, building immunity.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
