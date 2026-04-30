/**
 * AP US History — 1920s: Jazz Age, prohibition, Harlem Renaissance,
 * red scare, women's suffrage, consumer culture.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_1920S: LessonPlan = {
  id: 'evelyn.ap.ush.1920s-jazz-age.v1',
  title: 'The 1920s: Jazz Age, prohibition, Harlem Renaissance',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.1920s',
      description: 'Analyze the social, cultural, and political tensions of the 1920s.',
      standard: 'AP-USH-NAT-7',
    },
  ],
  prerequisites: ['apush.world-war-1'],
  followUps: ['apush.great-depression'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame as a decade of contradictions.',
      script: 'The 1920s is "the Roaring Twenties" — flappers, jazz, the Great Gatsby. It\'s also Prohibition, KKK resurgence, immigration crackdowns, and women voting for the first time. The decade was a war of cultures.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tensions',
      kind: 'concept',
      goal: 'Six pillars + the modernity vs tradition tension.',
      keyIdeas: [
        'PROHIBITION (1920-33, 18th Amendment): banned alcohol. Drove drinking underground (speakeasies), boosted organized crime (Al Capone). Repealed by 21st Amendment.',
        'WOMEN\'S SUFFRAGE (19th Amendment, 1920): finally allowed women to vote nationally. Followed by FLAPPER culture — short hair, short skirts, working women, smoking, dancing.',
        'HARLEM RENAISSANCE: Black artistic flowering in NYC. Langston Hughes, Zora Neale Hurston, Duke Ellington, Louis Armstrong. Asserted Black cultural identity and excellence amid Jim Crow.',
        'JAZZ AGE: jazz music (born in Black communities, esp New Orleans) became national. Radio + records spread it. Whites and Blacks listened to same music — but rarely together.',
        'CONSUMER CULTURE: cars (Model T), radios, electric appliances. Mass advertising. Stock market boom. Buying on credit became common.',
        'IMMIGRATION ACT OF 1924: imposed quotas favoring Northern Europeans. Severely cut immigration from southern/eastern Europe; banned most from Asia.',
        'RED SCARE + KKK: fear of communism (Russian Revolution 1917) led to deportations. KKK reached ~5 million members, targeting Black, Catholic, Jewish, immigrant Americans.',
        'TENSION: rural/traditional America vs urban/modern America. Scopes Trial (1925) over teaching evolution exemplified the divide.',
      ],
      vocabulary: [
        { term: 'Prohibition', definition: 'the period (1920-33) when alcohol was banned in the US.' },
        { term: 'Harlem Renaissance', definition: 'a 1920s flowering of Black culture, art, and literature centered in Harlem, NYC.' },
        { term: 'flapper', definition: 'a young woman of the 1920s defying traditional gender norms.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-prohibition',
      kind: 'worked_example',
      problem: 'Why did Prohibition fail and get repealed?',
      steps: [
        '18th Amendment (1920) banned alcohol manufacture and sale.',
        'Drinking didn\'t stop — it went UNDERGROUND. Speakeasies, bootleggers, moonshine.',
        'Organized crime EXPLODED. Gangsters like Al Capone made millions. Police were corrupted.',
        'Tax revenue from alcohol was lost — significant during the Great Depression starting 1929.',
        'Public opinion shifted: from supporting moral reform to recognizing the law was unenforceable and creating worse problems.',
        'Repealed by the 21st Amendment in 1933 — the only US constitutional amendment to be REPEALED entirely.',
      ],
      answer: 'unenforceable, fueled organized crime, lost tax revenue → repealed by 21st Amendment',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name TWO writers or musicians of the Harlem Renaissance.',
      expectedAnswer: 'Langston Hughes, Zora Neale Hurston, Duke Ellington, Louis Armstrong, Bessie Smith',
      responseFormat: 'free',
      hints: [
        'Poets and novelists.',
        'Jazz musicians.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-twenties-roaring-only',
      kind: 'misconception_check',
      question: 'Was the 1920s mostly a fun, prosperous decade for everyone?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Romanticizing as universally roaring.',
          correctsTo: 'No — farmers struggled the WHOLE decade (post-WWI agricultural prices crashed). KKK targeted Black, Catholic, Jewish, immigrant Americans. Native Americans struggled on reservations. Rural-urban divide was sharp. The "roaring" was selective — mostly white, urban, middle-class.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prohibition (1920-33): unenforceable, fueled organized crime, repealed.',
        '19th Amendment (1920): women got the vote.',
        'Harlem Renaissance: Black cultural flowering.',
        'Consumer culture, cars, credit, stock boom — set up 1929 crash.',
        '1924 Immigration Act: quotas favoring Northern Europeans.',
        'Tension: modern urban vs traditional rural; Scopes Trial.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the 1920s consumer boom set up the 1929 crash?',
      hint: 'People bought stocks on margin (borrowed money). Prosperity felt inevitable. Wealth was concentrated — most Americans couldn\'t actually afford the goods being mass-produced. Overproduction + speculation created a bubble. When confidence faltered, the bubble burst.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
