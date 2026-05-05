/**
 * Grades 6-8 Social Studies — Cold War Overview.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_COLD_WAR_OVERVIEW: LessonPlan = {
  id: 'evelyn.g68.ss.cold-war-overview.v1',
  title: 'Grades 6-8 SS — Cold War Overview',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.cold-war-overview',
      description: 'Identify the rivalry between the US and USSR (1945-1991); recognise key events and the impact on global politics.',
      standard: 'NCSS 6-8 Time, Continuity, Change',
    },
  ],
  prerequisites: ['g68.ss.depression-wwii'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'For 45 years after WWII, two superpowers — the US and Soviet Union — never directly fought, but shaped the entire world.',
      script: 'No bombs fell on either capital. No troops invaded either nation. But for 45 years, the threat of nuclear war hung over everyone. The Cold War wasn\'t fought with armies — it was fought with ideologies, spies, proxy wars, and an arms race. Today we drill what happened.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cold-war',
      kind: 'concept',
      goal: 'Origins + ideology + key events + end.',
      keyIdeas: [
        'AFTER WWII (1945): US and USSR emerged as superpowers. Wartime allies became postwar rivals.',
        'IDEOLOGY: US — democracy + capitalism. USSR — communism + state-controlled economy. Each saw its system as best for the world.',
        'IRON CURTAIN: Winston Churchill\'s 1946 phrase for the divide between Soviet-controlled Eastern Europe and the democratic West.',
        'KEY EVENTS:',
        '  TRUMAN DOCTRINE (1947): US pledged to help countries resisting communism.',
        '  MARSHALL PLAN (1948): US gave aid to rebuild Western Europe.',
        '  BERLIN BLOCKADE & AIRLIFT (1948-49): USSR blocked West Berlin; US flew in supplies for nearly a year.',
        '  NATO (1949): Western alliance. WARSAW PACT (1955): Soviet alliance.',
        '  KOREAN WAR (1950-53): US-led UN forces fought Soviet/Chinese-backed North Korea. Stalemate at the 38th parallel.',
        '  ARMS RACE: both sides built nuclear weapons. By 1960s, enough to destroy the world many times over.',
        '  CUBAN MISSILE CRISIS (October 1962): USSR placed nuclear missiles in Cuba; 13 days of brink. Resolved by negotiation.',
        '  SPACE RACE: USSR launched Sputnik (1957) and first human in space (Gagarin, 1961). US landed on the Moon (1969).',
        '  VIETNAM WAR (1955-75): US fought communist North Vietnam. Lost; deeply divided Americans.',
        '  DETENTE (1970s): easing of tensions, arms-control treaties.',
        '  REAGAN-GORBACHEV (1980s): Reagan called USSR "evil empire" then later worked with Gorbachev on arms reduction.',
        'END: USSR collapsed economically and politically. Berlin Wall fell November 9, 1989. USSR dissolved December 1991.',
        'IMPACT: shaped foreign policy, government, technology, and culture for nearly 50 years. Global politics still reflects it.',
      ],
      vocabulary: [
        { term: 'communism', definition: 'a political system where the state owns property and seeks economic equality, usually with one ruling party.' },
        { term: 'capitalism', definition: 'an economic system where private individuals or companies own businesses and resources.' },
        { term: 'proxy war', definition: 'a war where two big powers fight indirectly through smaller nations.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cuba',
      kind: 'worked_example',
      problem: 'Why was the Cuban Missile Crisis the closest the world came to nuclear war?',
      steps: [
        'October 1962: US spy planes detected USSR INSTALLING NUCLEAR MISSILES in Cuba — 90 miles from Florida.',
        'President Kennedy demanded their removal. US Navy blockaded Cuba.',
        'Both sides put nuclear forces on highest alert. Any miscalculation could have triggered nuclear exchange.',
        '13 tense days. Diplomats negotiated. USSR agreed to remove missiles; US agreed to remove its missiles in Turkey (later).',
        'Lessons: leaders established a hotline (red phone) between Washington and Moscow. Showed how easily nuclear war could happen — pushed both sides toward arms-control efforts.',
      ],
      answer: 'Nuclear missiles 90 miles from US; 13-day standoff; resolved by negotiation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What event is considered the SYMBOLIC END of the Cold War?',
      expectedAnswer: 'The fall of the Berlin Wall on November 9, 1989. Followed soon by the dissolution of the Soviet Union (December 1991).',
      responseFormat: 'free',
      hints: [
        'A wall came down in 1989.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-direct-war',
      kind: 'misconception_check',
      question: 'A student asks "Why didn\'t the US and USSR fight each other directly?"',
      commonErrors: [
        {
          answer: 'They didn\'t want to',
          misconception: 'Missing the role of nuclear deterrence.',
          correctsTo: 'NUCLEAR WEAPONS made direct war SUICIDAL. The doctrine of "Mutually Assured Destruction" (MAD) meant any direct attack would end with both sides destroyed. So they fought INDIRECTLY — through proxy wars (Korea, Vietnam, Afghanistan), espionage, propaganda, arms races. Cold War means "indirect" war: the threat made direct fighting too costly to risk.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'US (capitalism/democracy) vs USSR (communism) 1945-1991.',
        'No direct war (nuclear deterrence) — but proxy wars (Korea, Vietnam).',
        'Berlin Blockade, NATO, Cuban Missile Crisis, space race.',
        'Berlin Wall fell 1989. USSR dissolved 1991.',
        'Shaped 20th-century politics and tech.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the SPACE RACE come from the Cold War — and how did it benefit everyday life?',
      hint: 'After USSR launched Sputnik (1957), US feared falling behind in tech. Heavy investment in science, math education, and NASA followed. Goal: prove which system was better. Outcome: transformed everyday tech. Satellites enable GPS, weather forecasting, communications. Computer miniaturisation came partly from Apollo programs. Even non-stick pans were spinoffs! The Cold War rivalry accelerated tech progress that still benefits us.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
