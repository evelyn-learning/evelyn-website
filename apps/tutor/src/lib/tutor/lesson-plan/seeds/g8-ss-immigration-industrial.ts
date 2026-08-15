/**
 * G8 — Immigration and the Gilded Age (late 1800s).
 *
 * Wave of European immigrants, factory work, child labor, monopolies,
 * the rise of cities. Sets up Progressive Era and 20th-century US.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_IMMIGRATION_INDUSTRIAL: LessonPlan = {
  id: 'evelyn.g8.ss.us-history.immigration-gilded-age.v1',
  title: 'Immigration and the Gilded Age',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.industrialization',
      description: 'Analyze the causes and impact of industrialization and immigration in late 19th-century America.',
      standard: 'NCSS.D2.His.14.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.civil-war'],
  followUps: ['ncss.68.history.progressive-era'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with vivid contrast: immigrants arriving by the millions while a few "robber barons" got rich.',
      script: 'Between 1880 and 1910, twenty MILLION people came to America from Europe. They worked in factories owned by men so rich a single one had more wealth than entire states. That mismatch is the Gilded Age.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Three intertwined forces: immigration, industrialization, urbanization.',
      keyIdeas: [
        'IMMIGRATION (1880-1920): Millions arrived from Italy, Ireland, Russia, Poland. Most landed at Ellis Island in NY. Many fleeing poverty, persecution, or political turmoil.',
        'INDUSTRIALIZATION: factories replaced workshops. Steel (Carnegie), oil (Rockefeller), railroads (Vanderbilt) boomed.',
        'ROBBER BARONS / CAPTAINS OF INDUSTRY: same people, two takes. Carnegie built libraries (philanthropist), but also crushed unions. Rockefeller controlled 90% of US oil through Standard Oil — monopoly.',
        'URBANIZATION: people flooded into cities. Tenements (cramped apartment buildings) housed immigrants. Cities became dirty, dangerous, but also cultural hubs.',
        'WORKING CONDITIONS: 12-hour days, child labor (kids as young as 8 in factories), no safety rules, no minimum wage. Triangle Shirtwaist Factory fire (1911) killed 146 workers — many young women — and pushed reform.',
        'GILDED = thin gold over rotting wood. Mark Twain coined the term: looks shiny, hides decay underneath.',
      ],
      vocabulary: [
        { term: 'tenement', definition: 'a crowded, often unsafe apartment building for poor immigrants.' },
        { term: 'monopoly', definition: 'when one company controls almost all of an industry.' },
        { term: 'union', definition: 'a group of workers organized to demand better wages and conditions.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rockefeller',
      kind: 'worked_example',
      problem: 'How did Rockefeller build a monopoly, and why was it controversial?',
      steps: [
        'Rockefeller founded Standard Oil and bought up smaller oil companies one by one.',
        'He used HORIZONTAL INTEGRATION (control all competitors) and railroad rebates (lower shipping rates than competitors got).',
        'By 1880 he controlled ~90% of US oil refining — a near-total monopoly.',
        'CONTROVERSY: lower prices for consumers (good), but no competition meant smaller businesses crushed and workers had no leverage. Government eventually broke up Standard Oil in 1911.',
      ],
      answer: 'bought up competitors and used unfair railroad rates; controversial because monopolies kill competition',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was the Triangle Shirtwaist Factory fire so important to American labor history?',
      expectedAnswer: 'pushed for safer workplace laws',
      responseFormat: 'free',
      hints: [
        'The doors were locked, workers couldn\'t escape — what laws got passed in response?',
        'Think about what changed about fire codes, building codes, working conditions afterward.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-streets-of-gold',
      kind: 'misconception_check',
      question: 'Was America a land of "streets paved with gold" for immigrants in the Gilded Age?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing the immigration story was uniformly positive.',
          correctsTo: 'For most, no. Many lived in tenements, worked grueling hours, faced discrimination ("No Irish need apply"), and lost relatives to disease. The opportunity was real but the cost was high.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '1880-1920: 20 million immigrants arrived, mostly from Europe.',
        'Industrialization made a few people very rich while workers labored in unsafe conditions.',
        '"Gilded Age" = shiny on top, rotten underneath.',
        'Fire and labor disasters eventually pushed for reform in the Progressive Era.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare the Gilded Age "robber barons" to today\'s tech billionaires. Same pattern, or different?',
      hint: 'Both involve concentrated wealth, monopoly concerns, philanthropy. But labor laws and antitrust rules are stronger now.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
