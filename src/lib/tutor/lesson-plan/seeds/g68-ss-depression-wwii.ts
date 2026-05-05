/**
 * Grades 6-8 Social Studies — Great Depression & WWII.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_DEPRESSION_WWII: LessonPlan = {
  id: 'evelyn.g68.ss.depression-wwii.v1',
  title: 'Grades 6-8 SS — Great Depression & WWII',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.depression-wwii',
      description: 'Identify causes and consequences of the Great Depression and WWII; recognise key figures and turning points.',
      standard: 'NCSS 6-8 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g68.ss.imperialism-wwi'],
  followUps: ['g68.ss.cold-war-overview'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two of the largest events of the 20th century — economic collapse, then total war — shaped today\'s world.',
      script: '1929: stock market crashes. By 1933, 25% of Americans are unemployed. Then Hitler rises in Germany, war spreads across Europe and the Pacific, and 70+ million die. The Depression and WWII are connected — and reshaped politics, economy, and global power for decades.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-depression-wwii',
      kind: 'concept',
      goal: 'Depression causes/responses + WWII causes/events/end.',
      keyIdeas: [
        'GREAT DEPRESSION (1929-late 1930s):',
        'Cause: Stock market crash October 1929. Banking failures, drop in demand, drought (Dust Bowl), tariff wars.',
        'Impact: 25% US unemployment. Worldwide hardship. Soup lines, Hoovervilles, foreclosures.',
        'NEW DEAL (FDR, 1933+): government programs to provide relief, recovery, and reform. Examples: Social Security, WPA (jobs), CCC (conservation work), FDIC (bank insurance). Expanded federal role.',
        'IN GERMANY: economic crisis fueled rise of Adolf Hitler and the Nazi Party (1933).',
        'WWII (1939-1945):',
        'CAUSES: Treaty of Versailles\' harsh terms on Germany; Great Depression; rise of fascism (Hitler in Germany, Mussolini in Italy, militarism in Japan); failure of League of Nations.',
        'WAR BEGINS: September 1, 1939 — Germany invades Poland. Britain and France declare war.',
        'EARLY YEARS: Germany conquers most of Europe by 1941. Pearl Harbor (Dec 7, 1941) brings US in.',
        'TWO THEATRES: European (vs Germany, Italy) and Pacific (vs Japan).',
        'TURNING POINTS: Stalingrad (1942-43, USSR vs Germany); Midway (1942, US vs Japan); D-Day (June 6, 1944, Allied invasion of Normandy).',
        'HOLOCAUST: systematic Nazi murder of 6 million Jews and millions of others (Roma, disabled, political prisoners, LGBTQ+, etc.).',
        'JAPANESE AMERICAN INTERNMENT: 120,000 forced into camps in US during the war (1942-1945).',
        'END: Germany surrenders May 8, 1945 (V-E Day). US drops atomic bombs on Hiroshima (Aug 6) and Nagasaki (Aug 9). Japan surrenders Aug 14 (V-J Day).',
        'CASUALTIES: 70-85 million dead worldwide.',
        'AFTERMATH: UN founded (1945) to prevent future world wars. US and USSR emerged as superpowers → Cold War.',
      ],
      vocabulary: [
        { term: 'New Deal', definition: 'FDR\'s programs to address the Great Depression — relief, recovery, reform.' },
        { term: 'fascism', definition: 'a far-right political system with strong nationalism, suppression of opposition, and centralised authoritarian government.' },
        { term: 'Holocaust', definition: 'the systematic Nazi-led murder of approximately 6 million Jews and millions of others during WWII.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pearl',
      kind: 'worked_example',
      problem: 'Why did the US enter WWII in December 1941?',
      steps: [
        'On December 7, 1941, Japan attacked the US naval base at PEARL HARBOR, Hawaii.',
        '2,400+ Americans killed; major naval damage.',
        'FDR called it "a date which will live in infamy".',
        'US declared war on Japan the next day.',
        'Germany and Italy (Japan\'s allies) declared war on the US a few days later.',
        'US thus entered both Pacific and European theatres.',
      ],
      answer: 'Japan\'s attack on Pearl Harbor (Dec 7, 1941).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What was the New Deal?',
      expectedAnswer: 'FDR\'s set of government programs (1933+) to fight the Great Depression. Provided relief (jobs, food), recovery (rebuilding economy), and reform (banking regulation, Social Security, etc.). Expanded the federal government\'s role.',
      responseFormat: 'free',
      hints: [
        'Three Rs: relief, recovery, reform.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-economy-only',
      kind: 'misconception_check',
      question: 'A student says "the Great Depression was just about money problems." Why is this incomplete?',
      commonErrors: [
        {
          answer: 'Depression = money problems only',
          misconception: 'Treating economic crisis as separate from political and social effects.',
          correctsTo: 'Economic crisis had massive political and social consequences. In the US, it expanded federal government (New Deal), reshaped labour and welfare policy. In Germany, it enabled Hitler\'s rise. In Japan, it pushed militaristic expansion. The Depression and WWII are linked — economic desperation made fascism appealing in some countries. Money problems become political problems become war.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Great Depression 1929+. New Deal (FDR) responded.',
        'WWII 1939-45. Started with German invasion of Poland.',
        'Pearl Harbor (Dec 1941) brought US in.',
        'Turning points: Stalingrad, Midway, D-Day.',
        'Holocaust: Nazi murder of 6 million Jews + millions more.',
        'War ended with atomic bombs (Aug 1945). 70-85M dead worldwide.',
        'UN founded to prevent future world wars; Cold War followed.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the New Deal change Americans\' RELATIONSHIP to their government?',
      hint: 'Before 1933, federal government did relatively little for individual Americans. The New Deal expanded what people EXPECTED from government — Social Security, unemployment insurance, banking protection, jobs programs. It\'s the foundation of the modern welfare state. Conservative critics said it expanded government too far; supporters said it saved capitalism. The debate continues — today\'s political fights about government size trace back to the New Deal.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
