/**
 * G5 — The 13 Colonies.
 *
 * Three regions: New England, Middle, Southern. Why people came,
 * what they did, how the colonies differed.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SS_THIRTEEN_COLONIES: LessonPlan = {
  id: 'evelyn.g5.ss.us-history.thirteen-colonies.v1',
  title: 'The 13 Colonies: New England, Middle, Southern',
  curriculum: 'NCSS',
  grade: '5',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.35.history.colonial-period',
      description: 'Compare the three colonial regions in geography, economy, and reasons for settlement.',
      standard: 'NCSS.D2.His.2.3-5',
    },
  ],
  prerequisites: ['ncss.35.history.exploration'],
  followUps: ['ncss.35.history.american-revolution'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Personalize: imagine choosing to leave home forever.',
      script: 'Imagine your family had to leave home, sail for 2 months, and start a brand new life. Why would you do it? Religion, money, or no choice. The 13 Colonies started for all three reasons.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-regions',
      kind: 'concept',
      goal: 'The 13 Colonies fall into three regions, each with different geography and economy.',
      keyIdeas: [
        'NEW ENGLAND COLONIES: Massachusetts, New Hampshire, Connecticut, Rhode Island. Cold, rocky soil. Small farms, fishing, shipbuilding. Many came for religious freedom (Pilgrims, Puritans).',
        'MIDDLE COLONIES: New York, New Jersey, Pennsylvania, Delaware. Mild climate, rich soil. Wheat, corn (the "breadbasket"). Diverse — Quakers in Pennsylvania, Dutch in New York. Welcoming of different beliefs.',
        'SOUTHERN COLONIES: Virginia, Maryland, North Carolina, South Carolina, Georgia. Warm, long growing season. Large plantations growing tobacco, rice, indigo, cotton — much of the work was done by enslaved Africans.',
        'SLAVERY: started in Virginia in 1619 and grew especially in Southern colonies. Enslaved Africans built plantation wealth without freedom or pay — a foundational injustice.',
      ],
      vocabulary: [
        { term: 'colony', definition: 'land settled by people from another country and ruled by that country.' },
        { term: 'plantation', definition: 'a large farm growing one main crop, often using enslaved labor.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'A colony has rocky soil, cold winters, lots of fishing boats, and was started by people seeking religious freedom. Which region?',
      steps: [
        'Rocky soil + cold + fishing → not warm-weather plantation country.',
        'Religious freedom → Pilgrims, Puritans.',
        'That\'s NEW ENGLAND. Likely Massachusetts.',
      ],
      answer: 'New England',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A colony has a long warm growing season, huge plantations of tobacco worked by enslaved people, and rich farmland. Which region?',
      expectedAnswer: 'Southern',
      responseFormat: 'free',
      hints: [
        'Plantations + tobacco → which region?',
        'Warm climate → not the colder New England.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-religion-only',
      kind: 'misconception_check',
      question: 'Did EVERYONE come to the colonies for religious freedom?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "religious freedom" as the only reason for colonization.',
          correctsTo: 'No — many came for money or land. Many had no choice — indentured servants worked years to pay off their passage, and enslaved Africans were FORCED. Religious freedom was important in some colonies, but not the whole story.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three regions: New England (rocky, fishing), Middle (breadbasket, diverse), Southern (plantations, enslaved labor).',
        'People came for religion, money, land — and many were forced (enslaved Africans, indentured servants).',
        'Slavery was foundational, especially in the South — a deep injustice that shaped the country.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Middle Colonies become the most diverse — with Dutch, English, German, Quaker, Catholic settlers all in the same area?',
      hint: 'Pennsylvania\'s founder William Penn deliberately welcomed people of any religion.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
