/**
 * G11 — Social Studies: The Cold War (1947-1991).
 *
 * The geopolitical standoff between the US and USSR. Containment,
 * Iron Curtain, NATO/Warsaw Pact, proxy wars (Korea, Vietnam),
 * arms race, Cuban Missile Crisis, Vietnam, end of the Cold War.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_COLD_WAR: LessonPlan = {
  id: 'evelyn.g11.ss.cold-war.v1',
  title: 'The Cold War',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.ushistory.coldwar',
      description: 'Explain the origins, key events, and end of the Cold War.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the Cold War as 45 years of "almost-war".',
      script: 'For 45 years after WWII, the US and USSR never directly fought each other — but the world lived with the threat that they MIGHT. Both sides built nuclear arsenals capable of ending civilization. They fought through PROXIES — Korea, Vietnam, Afghanistan. They competed in the space race, the Olympics, and chess matches. Welcome to the Cold War.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cold-war',
      kind: 'concept',
      goal: 'Origins, containment, key events, end.',
      keyIdeas: [
        'ORIGINS: at end of WWII, US and USSR were the two superpowers. Tensions immediately surfaced over the post-war order.',
        '  US: capitalist democracy. USSR: communist authoritarian.',
        '  IRON CURTAIN: Churchill\'s 1946 phrase for the line dividing free Western Europe from Soviet-controlled Eastern Europe.',
        'CONTAINMENT: US strategy (originated by George Kennan, 1947) — prevent communism from spreading further. Guided US foreign policy for decades.',
        '  TRUMAN DOCTRINE (1947): US would aid any country resisting communism.',
        '  MARSHALL PLAN (1948): US economic aid to rebuild Western Europe (and prevent communist appeal).',
        'ALLIANCES:',
        '  NATO (1949): US + Western European countries.',
        '  WARSAW PACT (1955): USSR + Eastern Bloc.',
        'KEY EVENTS:',
        '  BERLIN BLOCKADE / AIRLIFT (1948-49): USSR cut off West Berlin; US flew supplies in.',
        '  KOREAN WAR (1950-53): North (communist) vs South (US-backed). Ended in stalemate at the 38th parallel; still divided today.',
        '  HUNGARY (1956): anti-Soviet uprising crushed by Soviet tanks.',
        '  CUBAN MISSILE CRISIS (Oct 1962): USSR placed nuclear missiles in Cuba; 13-day standoff. Closest the world came to nuclear war. Resolved peacefully.',
        '  VIETNAM WAR (US involvement ~1955-1975): US tried to prevent communist takeover of South Vietnam. Lost; communists unified the country.',
        '  SPACE RACE: Sputnik (1957) → Apollo 11 moon landing (1969).',
        '  ARMS RACE: thousands of nuclear warheads on each side. Doctrine: MUTUALLY ASSURED DESTRUCTION (MAD) — neither could attack without ensuring its own destruction.',
        '  DETENTE (1970s): a thaw; arms control treaties (SALT).',
        'END OF COLD WAR:',
        '  REAGAN (US president 1981-89) increased pressure on USSR.',
        '  Soviet economy strained by arms race + central-planning inefficiencies.',
        '  GORBACHEV (Soviet leader 1985-91) introduced reforms (Glasnost, Perestroika).',
        '  BERLIN WALL FELL (Nov 9, 1989). Eastern European countries broke from Soviet control peacefully (mostly).',
        '  USSR DISSOLVED (Dec 1991) into Russia and 14 other independent countries.',
      ],
      vocabulary: [
        { term: 'Cold War', definition: 'the 1947-1991 geopolitical tension between US and USSR.' },
        { term: 'containment', definition: 'US strategy to prevent communism from spreading.' },
        { term: 'Iron Curtain', definition: 'the symbolic divide between Western and Soviet-controlled Europe.' },
        { term: 'mutually assured destruction', definition: 'doctrine that any nuclear strike would destroy both sides.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline', 'show_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cuban-missile',
      kind: 'worked_example',
      problem: 'Why is the Cuban Missile Crisis (1962) considered the closest the world came to nuclear war?',
      steps: [
        'CONTEXT: USSR placed medium-range nuclear missiles in Cuba — 90 miles from Florida. US had similar missiles in Turkey near USSR.',
        'US OPTIONS: invade, airstrike, blockade, or negotiate. Kennedy chose NAVAL BLOCKADE (called "quarantine") of Cuba.',
        'TENSION: 13 days of standoff. If a single Soviet ship had refused to turn back at the blockade — or if a US warship had fired — escalation could have triggered nuclear retaliation.',
        'RESOLUTION: USSR agreed to remove Cuban missiles; US secretly agreed to remove Turkish missiles + pledged not to invade Cuba. Both leaders compromised.',
        'AFTERMATH: hotline established between Washington and Moscow. Both sides realized how close they\'d come; led to arms-control negotiations.',
      ],
      answer: 'See chain above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What was containment, and which 1947 doctrine made it official US policy?',
      expectedAnswer: 'Strategy to prevent communism from spreading. Truman Doctrine (1947).',
      responseFormat: 'free',
      hints: [
        'Truman + 1947.',
        'Pledged US aid to anyone resisting communism.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-fighting',
      kind: 'misconception_check',
      question: 'Mira says "the Cold War wasn\'t really a war — no one fought." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "cold" as "no fighting at all".',
          correctsTo: 'The US and USSR never directly fought each other — that\'s why it\'s "cold". But there were MANY hot wars within the Cold War: Korea, Vietnam, Soviet-Afghan War, Angolan Civil War, Latin American conflicts. These were PROXY wars where the superpowers backed opposite sides. Millions died. Cold for the superpowers, very hot for the proxies.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cold War: 1947-1991, US vs USSR, ideological + geopolitical.',
        'Containment policy. Truman Doctrine, Marshall Plan, NATO vs Warsaw Pact.',
        'Key events: Berlin Airlift, Korea, Cuban Missile Crisis, Vietnam.',
        'Proxy wars killed millions even though superpowers never fought directly.',
        'Ended ~1989-91: Berlin Wall fell, USSR dissolved.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Soviet Union collapse in 1991?',
      hint: 'Multiple factors: economic stagnation, costs of arms race + Afghan war, falling oil prices, popular dissatisfaction, Gorbachev\'s reforms loosened control. Once Eastern European countries broke free (1989), the system unraveled rapidly.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
