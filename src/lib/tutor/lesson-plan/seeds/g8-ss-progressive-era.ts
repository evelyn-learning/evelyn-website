/**
 * G8 — Progressive Era reforms (1890s-1920).
 *
 * Reformers tackled labor, women's rights, food safety, monopolies,
 * corruption. Era of big legislative wins.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_PROGRESSIVE_ERA: LessonPlan = {
  id: 'evelyn.g8.ss.us-history.progressive-era.v1',
  title: 'The Progressive Era',
  curriculum: 'NCSS',
  grade: '8',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.progressive-era',
      description: 'Identify Progressive Era reforms and explain how they responded to industrialization and urbanization.',
      standard: 'NCSS.D2.His.14.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.industrialization'],
  followUps: ['ncss.68.history.world-war-1'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the era as a backlash to Gilded-Age problems.',
      script: 'After decades of unsafe factories, child labor, and corrupt politicians, ordinary Americans pushed back. They wrote books, organized strikes, voted for reformers. We call that wave the Progressive Era — and it changed the country permanently.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-five-fronts',
      kind: 'concept',
      goal: 'Progressives reformed five big areas: labor, food/drug safety, women\'s rights, antitrust, government corruption.',
      keyIdeas: [
        'LABOR: child labor laws, maximum work hours, workers\' compensation, safety rules. Hull House (Jane Addams) helped immigrant workers.',
        'FOOD/DRUG SAFETY: Upton Sinclair\'s "The Jungle" exposed meat-packing horrors. Led to the 1906 Pure Food and Drug Act and the FDA.',
        'WOMEN\'S RIGHTS: 19th Amendment (1920) — women won the right to VOTE after decades of suffragist organizing (Susan B. Anthony, Alice Paul).',
        'ANTITRUST: government broke up monopolies. Standard Oil (1911), American Tobacco (1911). Theodore Roosevelt the "trust buster".',
        'GOVERNMENT REFORM: 17th Amendment (direct election of senators), secret ballot, primary elections. Pulled power away from political bosses.',
        'MUCKRAKERS: journalists who exposed corruption — Ida Tarbell on Standard Oil, Jacob Riis on tenements, Lincoln Steffens on city government.',
      ],
      vocabulary: [
        { term: 'Progressive', definition: 'someone who believed in reform — that government and society could and should fix social problems.' },
        { term: 'muckraker', definition: 'an investigative journalist exposing injustice or corruption.' },
        { term: 'suffrage', definition: 'the right to vote.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-jungle',
      kind: 'worked_example',
      problem: 'Why was Upton Sinclair\'s book "The Jungle" so impactful?',
      steps: [
        'Sinclair wrote a novel exposing the Chicago meat-packing industry — diseased meat, rats in the sausage, workers falling into vats.',
        'He intended to highlight WORKER suffering. Readers were horrified by the FOOD safety part instead.',
        'Public outrage forced Congress to pass the Pure Food and Drug Act and the Meat Inspection Act in 1906.',
        'Sinclair himself said: "I aimed at the public\'s heart, and by accident hit it in the stomach."',
      ],
      answer: 'exposed unsafe meat-packing; led to Pure Food and Drug Act',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which constitutional amendment passed during the Progressive Era gave women the right to vote?',
      expectedAnswer: '19th',
      responseFormat: 'free',
      hints: [
        'It passed in 1920, after decades of suffragist marches.',
        'Comes right before the 20th Amendment.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-progressive-fixed-everything',
      kind: 'misconception_check',
      question: 'Did the Progressive Era fix ALL the problems of the Gilded Age?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating reform as totally completed.',
          correctsTo: 'No — Black Americans were largely LEFT OUT of Progressive reforms. Jim Crow laws expanded in the South during the same era. Women got the vote in 1920 but Black voters in the South faced poll taxes and violence until the 1965 Voting Rights Act.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Progressive Era (~1890s-1920) was a backlash to Gilded-Age problems.',
        'Five fronts: labor, food safety, women\'s vote, antitrust, government reform.',
        'Muckrakers exposed problems; legislators wrote laws; presidents (TR, Wilson) pushed reform.',
        'Reforms helped many but largely excluded Black Americans.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why were political bosses (like Boss Tweed) so hard for reformers to fight?',
      hint: 'Bosses gave immigrants jobs, food, help with paperwork — in exchange for votes. Many immigrants felt loyalty to bosses who actually helped them when government didn\'t.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
