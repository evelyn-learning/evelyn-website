/**
 * Grades 6-8 Social Studies — Colonial America (Deeper).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_COLONIAL_DEEPER: LessonPlan = {
  id: 'evelyn.g68.ss.colonial-deeper.v1',
  title: 'Grades 6-8 SS — Colonial America (Deeper)',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.colonial-deeper',
      description: 'Identify the three colonial regions, their economies, and the experiences of different groups (settlers, enslaved Africans, Indigenous peoples).',
      standard: 'NCSS 6-8 Time, Continuity, Change',
    },
  ],
  prerequisites: [],
  followUps: ['g68.ss.constitution-bill-rights'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The 13 colonies were not one community — they were three distinct regions, each with its own economy and society.',
      script: 'New England, Middle Colonies, Southern Colonies. Each developed differently because of geography, religion, and population. Today we drill the differences and the experiences of all the people who lived there.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-colonies',
      kind: 'concept',
      goal: 'Three regions + economies + diverse experiences.',
      keyIdeas: [
        'NEW ENGLAND COLONIES: Massachusetts, Connecticut, Rhode Island, New Hampshire. Rocky soil + cool climate → SHIPBUILDING, FISHING, SMALL FARMS. Strong PURITAN religious identity. Town-meeting government.',
        'MIDDLE COLONIES: New York, New Jersey, Pennsylvania, Delaware. Fertile soil → WHEAT and other GRAINS ("breadbasket"). Religious + ethnic DIVERSITY (Quakers in Pennsylvania, Dutch in NY, Germans, Scots-Irish).',
        'SOUTHERN COLONIES: Virginia, Maryland, North Carolina, South Carolina, Georgia. Warm climate + long growing season → PLANTATION CASH CROPS (tobacco, rice, indigo). Reliance on ENSLAVED AFRICAN LABOUR.',
        'TRIANGULAR TRADE: ships moved goods between Europe, Africa, and the Americas. Enslaved Africans brought to colonies; raw materials sent to Europe.',
        'INDENTURED SERVITUDE: many European settlers came as indentured servants — worked 4-7 years to pay for passage, then freed.',
        'ENSLAVEMENT: by 1700, slavery was legal in all 13 colonies but concentrated in the South. Enslaved people worked plantations, kept own families and cultures despite brutal conditions.',
        'NATIVE NATIONS: many were displaced or destroyed by European arrival, disease, and war. Some traded with colonists; some resisted.',
        'GOVERNANCE: each colony had its own legislature; most had a governor appointed by the British king.',
        'COLONIAL POPULATION by 1750: about 1.5 million people, including roughly 250,000 enslaved Africans.',
      ],
      vocabulary: [
        { term: 'plantation', definition: 'a large farm growing cash crops, often using enslaved labour.' },
        { term: 'indentured servant', definition: 'a person who worked a set number of years to pay for passage to the colonies.' },
        { term: 'triangular trade', definition: 'a trade pattern between Europe, Africa, and the Americas that included enslaved Africans.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-region',
      kind: 'worked_example',
      problem: 'Why did SOUTHERN COLONIES develop a plantation economy while NEW ENGLAND did not?',
      steps: [
        'GEOGRAPHY: South had warm climate, long growing season, fertile soil — ideal for cash crops like tobacco.',
        'New England had rocky soil, short growing season, cold winters — bad for plantations.',
        'ECONOMY: South\'s climate allowed large farms growing one crop for sale; New England turned to fishing, shipping, and small mixed farming.',
        'LABOUR: cash-crop plantations needed lots of cheap labour — leading South to rely heavily on enslaved Africans.',
        'CULTURE: different economies created different societies — wealthy planter class in South vs town-based merchant class in New England.',
      ],
      answer: 'Climate and soil → economy → labour system → culture.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which colonial region is called the "breadbasket" and why?',
      expectedAnswer: 'The MIDDLE COLONIES (NY, NJ, PA, DE) — fertile soil and good climate produced wheat and other grains in large quantities, feeding other colonies.',
      responseFormat: 'free',
      hints: [
        'Bread is made from wheat.',
        'Which region had the right soil for wheat?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-uniform-experience',
      kind: 'misconception_check',
      question: 'A textbook describes "colonial life" as one experience. Why is this misleading?',
      commonErrors: [
        {
          answer: 'One colonial experience',
          misconception: 'Treating colonial society as homogeneous.',
          correctsTo: 'There were MANY colonial experiences. A wealthy Virginia planter\'s life differed enormously from an enslaved African on the same plantation. A Boston merchant differed from a Pennsylvania Quaker farmer. Indentured servants, free Black craftsmen, Indigenous neighbours, women, children — all had different colonial lives. Honest history acknowledges this diversity rather than reducing it to a single story.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three regions: New England (shipping/fishing), Middle (grain), South (plantations).',
        'Triangular trade brought enslaved Africans.',
        'Indentured servants were European workers tied to a contract.',
        'Native nations were displaced or destroyed.',
        'Multiple experiences within each colony.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the differences between colonies SHAPE the eventual American Revolution and Constitution?',
      hint: 'Different regional economies meant different interests. The Constitution\'s compromises (e.g. the 3/5 Compromise on counting enslaved people, the Senate giving small states equal voice) reflected the need to balance regional differences. Even the Civil War, 80+ years later, was partly an extension of unresolved economic and social differences set down in the colonial era.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
