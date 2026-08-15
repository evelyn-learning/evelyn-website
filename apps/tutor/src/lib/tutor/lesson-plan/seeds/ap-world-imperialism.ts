/**
 * AP World History — Age of Imperialism (1850-1914).
 *
 * European powers carved up Africa and Asia. Causes (industrial
 * resources, "civilizing mission", competition), methods, lasting
 * consequences.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_IMPERIALISM: LessonPlan = {
  id: 'evelyn.ap.world.age-of-imperialism.v1',
  title: 'Age of Imperialism (1850-1914)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.imperialism',
      description: 'Analyze the causes and consequences of European imperialism in Africa and Asia.',
      standard: 'AP-WORLD-6.1',
    },
  ],
  prerequisites: ['apworld.industrial-revolution'],
  followUps: ['apworld.world-war-1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Stat shock: in 1900, ~85% of Earth\'s land was European-controlled.',
      script: 'In 1880, Europeans controlled about 10% of Africa. By 1914, Europeans controlled NEARLY ALL of Africa — except Liberia and Ethiopia. In just 30 years. The Age of Imperialism reshaped the planet.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-causes-impacts',
      kind: 'concept',
      goal: 'Causes + methods + impact + resistance.',
      keyIdeas: [
        'CAUSES: 1) INDUSTRIAL appetite — colonies provided raw materials (rubber, oil, cotton) and markets for finished goods. 2) NATIONALISM and competition — European powers raced to claim territory before rivals. 3) "WHITE MAN\'S BURDEN" — pseudo-moral justification claiming Europeans were "civilizing" others. Often paired with religious missions. 4) MILITARY tech advantage — Maxim gun, steamships, quinine for malaria.',
        'BERLIN CONFERENCE (1884-85): European powers met to divide AFRICA WITHOUT consulting Africans. Drew arbitrary borders that ignored ethnic and tribal lines — many problems persist today.',
        'METHODS: direct rule (French in Algeria), indirect rule (British in India through local princes), settler colonies (British in Kenya, Rhodesia), spheres of influence (multiple European powers in China).',
        'IMPACT ON COLONIZED: economic exploitation, racial hierarchy, forced labor (Belgian Congo: ~10 million Congolese killed by Leopold II\'s rubber regime). Some infrastructure built (railroads, telegraph) — but for extraction, not local benefit.',
        'RESISTANCE: Indian Mutiny (1857), Boxer Rebellion (1900, China), Zulu wars, Maji Maji Rebellion (1905-07, Tanzania), Ethiopia\'s defeat of Italy at Adwa (1896) preserving its independence.',
        'LONG-TERM CONSEQUENCES: artificial borders create instability today (Sudan, Congo, Iraq). Wealth flowed to colonizers. Resentment fueled 20th-century independence movements. Postcolonial economies often still extraction-dependent.',
      ],
      vocabulary: [
        { term: 'imperialism', definition: 'a policy of extending power by colonization or military force.' },
        { term: 'sphere of influence', definition: 'a region where a foreign power has economic and political dominance without formal colonization.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-congo',
      kind: 'worked_example',
      problem: 'King Leopold II of Belgium ran the Congo as a personal colony. What happened, and why does it stand out as one of the worst colonial atrocities?',
      steps: [
        'Leopold acquired the Congo (1885) under the guise of "humanitarianism".',
        'In reality: turned the colony into a forced-labor system extracting rubber for industrial Europe.',
        'Forced workers met quotas or had hands cut off (sometimes done to family members as punishment). Mass deaths from violence, disease, exhaustion.',
        'ESTIMATED 10 MILLION CONGOLESE DIED — about half the population — between 1885 and 1908.',
        'International outrage (E.D. Morel, Roger Casement reports) eventually forced Leopold to cede Congo to the Belgian government (1908).',
        'Stands out: scale, personal ownership by one king, systematic mutilation as policy. A clear case of imperialism\'s human cost.',
      ],
      answer: 'forced rubber labor; ~10 million dead; mutilation as enforcement',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the Berlin Conference (1884-85) cause long-term problems?',
      expectedAnswer: 'European powers drew African borders arbitrarily, ignoring ethnic groups; problems persist today',
      responseFormat: 'free',
      hints: [
        'Who was at the conference? Who wasn\'t?',
        'Resulting borders crossed ethnic and tribal lines.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-civilizing-real',
      kind: 'misconception_check',
      question: 'Did imperialism actually "civilize" or modernize colonies for their benefit?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Accepting colonial self-justification.',
          correctsTo: 'Some infrastructure was built — but for EXTRACTION, not local development. Education was usually limited (didn\'t want educated locals demanding rights). Economic systems were geared to colonial ports, not internal markets. Medicine helped settlers more than locals. The "civilizing mission" was rhetoric covering exploitation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: industrial demand, nationalism, "civilizing mission", military tech.',
        'Berlin Conference (1884-85) divided Africa without African input.',
        'Methods varied: direct, indirect, settler, spheres of influence.',
        'Costs: ~10 million Congolese, exploitation, arbitrary borders.',
        'Resistance ongoing throughout — never accepted.',
        'Lasting impact: postcolonial conflicts, extraction-based economies.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did imperialism contribute to WWI?',
      hint: 'Colonial competition (Morocco crises, scramble for Africa) heightened European tensions. Alliance systems formed partly around colonial agreements. Asian and African colonial soldiers fought in WWI. Imperial rivalry was one of the structural causes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
