/**
 * AP Human Geography — Population dynamics.
 *
 * Demographic transition model, population pyramids, migration push/
 * pull factors. Understanding global demographic patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_HUMAN_GEO_POPULATION: LessonPlan = {
  id: 'evelyn.ap.human-geo.population.v1',
  title: 'Population dynamics: demographic transition + migration',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'human-geography',
  locale: 'en',
  los: [
    {
      id: 'aphumangeo.population',
      description: 'Apply the demographic transition model and analyze migration push/pull factors.',
      standard: 'AP-HUG-2',
    },
  ],
  prerequisites: [],
  followUps: ['aphumangeo.agriculture'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame demographics as destiny.',
      script: 'Population growth, aging, migration — these forces shape economics, politics, and conflict for decades. Japan is shrinking and aging. Nigeria is exploding. India just passed China. Understanding population dynamics is understanding the future.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-models',
      kind: 'concept',
      goal: 'Demographic Transition Model + population pyramids + migration.',
      keyIdeas: [
        'DEMOGRAPHIC TRANSITION MODEL (DTM) — 5 stages of birth & death rates as a country develops:',
        '  Stage 1 (high stationary): high birth, high death. Pre-industrial.',
        '  Stage 2 (early expanding): high birth, falling death. Population BOOM. Sub-Saharan Africa today.',
        '  Stage 3 (late expanding): birth rate declines. Mexico, India.',
        '  Stage 4 (low stationary): low birth, low death. US, China.',
        '  Stage 5 (declining): birth below replacement (~2.1). Population shrinks. Japan, Germany, Italy.',
        'POPULATION PYRAMIDS: bar charts of age cohorts. Wide base = young, growing. Rectangular = stable. Inverted = aging, shrinking.',
        'REPLACEMENT RATE: ~2.1 children per woman to maintain population.',
        'MIGRATION:',
        '  PUSH factors: war, persecution, lack of opportunity, environmental disaster.',
        '  PULL factors: jobs, family, safety, education.',
        '  RAVENSTEIN\'S LAWS: most migration is short-distance, urban-bound, economic.',
        '  Today: ~280 million international migrants. ~3% of world population.',
        'AGING SOCIETIES face dependency-ratio challenges: fewer working-age adults supporting more retirees.',
      ],
      vocabulary: [
        { term: 'demographic transition', definition: 'a model of birth and death rates evolving as countries develop.' },
        { term: 'replacement rate', definition: 'the fertility rate (~2.1) that maintains population.' },
        { term: 'dependency ratio', definition: 'the ratio of dependent (young + old) to working-age people.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pyramid',
      kind: 'worked_example',
      problem: 'A country\'s population pyramid has a very wide base, narrows quickly toward the top. What does this tell you?',
      steps: [
        'Wide base → many young children. High birth rate.',
        'Narrow top → few elderly. High death rate at older ages, OR consistently high birth rates expanding the base over time.',
        'This shape characterizes Stage 2 of DTM — early expanding population.',
        'PROJECTION: this country will have rapid population growth for decades, plus a large youth bulge that brings labor and possibly political instability.',
      ],
      answer: 'rapidly growing population, Stage 2 of DTM',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Japan has a population pyramid that\'s wider at the TOP than the bottom. What stage of DTM is Japan in, and what challenges does this create?',
      expectedAnswer: 'Stage 5 (declining); challenges: aging population, shrinking workforce, high dependency ratio',
      responseFormat: 'free',
      hints: [
        'Inverted pyramid → aging population.',
        'Workforce shrinks while retirees grow → economic strain.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-population-bomb',
      kind: 'misconception_check',
      question: 'Is the world headed for catastrophic overpopulation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Maintaining 1970s "population bomb" framing.',
          correctsTo: 'Birth rates have FALLEN globally faster than expected. Most projections show world population peaking around 10 billion by ~2080, then declining. The challenge is shifting to AGING — too few young people in many countries — not exponential growth.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'DTM: 5 stages from high-birth high-death (1) to low-low (4) to declining (5).',
        'Replacement rate ~2.1 children per woman.',
        'Population pyramids show age structure at a glance.',
        'Migration: push and pull factors.',
        'Aging societies face dependency-ratio challenges.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why has fertility fallen as countries develop?',
      hint: 'Multiple forces: women\'s education and workforce participation, urbanization (kids cost more in cities), child survival (less need to have many), contraception access, declining child labor value, opportunity cost of parenting.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
