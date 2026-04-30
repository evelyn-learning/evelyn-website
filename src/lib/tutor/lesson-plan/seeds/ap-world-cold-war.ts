/**
 * AP World — Cold War (Global Perspective).
 *
 * US-Soviet rivalry, proxy wars, decolonization context, end of the Cold War.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_COLD_WAR: LessonPlan = {
  id: 'evelyn.ap.world.cold-war.v1',
  title: 'The Cold War (Global Perspective)',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'world history',
  locale: 'en',
  los: [
    {
      id: 'apworld.cold-war',
      description: 'Analyze the Cold War as a global ideological, economic, and military rivalry — including proxy wars, the non-aligned movement, and the conflict\'s end.',
      standard: 'AP-WORLD-8',
    },
  ],
  prerequisites: ['apworld.wwii'],
  followUps: ['apworld.decolonization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Cold War as a global, not just US-Soviet, conflict.',
      script: 'You can teach the Cold War as a Washington-vs-Moscow story, but that misses most of it. The actual fighting happened in Korea, Vietnam, Cuba, Angola, Afghanistan — places where global ideology met local conflicts. Understanding the Cold War means seeing it from Hanoi, Havana, Cairo, Berlin — not just from the two capitals that named it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-arc',
      kind: 'concept',
      goal: 'Origins, structure, proxy conflicts, decolonization, end.',
      keyIdeas: [
        'ORIGINS: WWII alliance breaks down 1945-47. Soviet domination of Eastern Europe (Iron Curtain — Churchill 1946) collides with US-led Western alliance. Truman Doctrine (1947) — contain communism. Marshall Plan (1948) — economic aid to Western Europe. Berlin Blockade (1948-49) → NATO (1949). Soviet bomb (1949). Mao\'s victory in China (1949). By 1949 the bipolar world is set.',
        'KEY DOCTRINE — CONTAINMENT: George Kennan\'s "Long Telegram" (1946) argued for blocking Soviet expansion without direct war. Defined US strategy for 40+ years.',
        'PROXY WARS: KOREAN WAR (1950-53) — first hot conflict; ends in stalemate at 38th parallel; Korea still divided. CUBAN MISSILE CRISIS (1962) — closest moment to nuclear war; resolved via Kennedy-Khrushchev backchannel. VIETNAM (US 1965-73; full unification 1975) — communist North defeats US-backed South; major US loss. AFGHANISTAN (Soviet 1979-89) — Soviet "Vietnam"; US arms mujahideen.',
        'NON-ALIGNED MOVEMENT (1955 Bandung Conference, formalized 1961): newly independent states (India, Yugoslavia, Egypt, Ghana) refused to pick sides. Major figures: Nehru, Tito, Nasser. Reality: most "non-aligned" states still drifted toward one bloc, but the movement asserted post-colonial agency.',
        'DECOLONIZATION + COLD WAR: as European empires fell (1947 India, 1957 Ghana, 1960 wave in Africa), new nations became Cold War battlegrounds. Both sides offered aid, ideology, and arms. Local nationalist movements often instrumentalized superpower competition. EX: Ho Chi Minh wrote to Truman before turning to USSR; Nasser played both sides over Aswan Dam.',
        'DETENTE (1969-79): SALT I (1972), Nixon to China (1972). Brief easing; ended with Soviet Afghanistan invasion (1979).',
        'SECOND COLD WAR (1979-85): Reagan calls USSR "evil empire", builds up military, arms anti-Soviet movements (Afghanistan, Nicaragua).',
        'END OF THE COLD WAR: Gorbachev (1985-91) attempts reform — Glasnost (openness), Perestroika (restructuring). Eastern European revolutions (1989) — Polish Solidarity, Hungary opens border, Berlin Wall falls Nov 1989, Romania (Ceaușescu executed). Soviet Union dissolves Dec 1991. NO major hot war between superpowers — the Cold War ends with a whimper, not a bang.',
      ],
      vocabulary: [
        { term: 'containment', definition: 'US strategy of blocking the spread of communism without direct war with the USSR.' },
        { term: 'non-aligned movement', definition: 'an organization of states refusing formal alliance with either Cold War bloc.' },
        { term: 'détente', definition: 'a period of eased tensions between US and USSR, roughly 1969-79.' },
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-cuba',
      kind: 'worked_example',
      problem: 'Why was the Cuban Missile Crisis (Oct 1962) the most dangerous moment of the Cold War, and what did it change?',
      steps: [
        'CONTEXT: Cuba had become communist after Castro\'s 1959 revolution and the failed 1961 Bay of Pigs invasion. USSR placed nuclear missiles in Cuba (range to most of US).',
        'CRISIS: US discovered missiles via U-2 reconnaissance. Kennedy imposed naval "quarantine" (technically a blockade, an act of war). 13 days of brinkmanship.',
        'RESOLUTION: USSR withdrew missiles. Publicly, US pledged not to invade Cuba. Privately, US removed Jupiter missiles from Turkey (a quid pro quo).',
        'WHY DANGEROUS: at multiple points, miscommunication or local commander decisions could have triggered nuclear exchange. Soviet sub commanders nearly fired nuclear torpedoes. Closest brush with civilizational disaster.',
        'CONSEQUENCES: Direct Moscow-Washington hotline established. Limited Test Ban Treaty (1963). Both sides moved toward arms-control negotiations. The crisis convinced both leaderships that nuclear brinksmanship was unsustainable — détente becomes possible later.',
      ],
      answer: 'Closest brush with nuclear war; led directly to hotline, test-ban treaty, and gradual move to arms-control diplomacy.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did the Soviet invasion of Afghanistan (1979) accelerate the end of the Cold War?',
      expectedAnswer: 'The 9-year war drained Soviet treasury and military credibility (Vietnam parallel). Combined with stagnant economy and Gorbachev\'s reforms, it eroded the Soviet system\'s capacity to maintain Eastern European satellites. Withdrawal (1989) signaled Soviet weakness, encouraging Eastern European reformists. The Wall fell months later.',
      responseFormat: 'free',
      hints: [
        'How did the war affect the Soviet economy and military?',
        'What did Soviet retreat in 1989 signal to Eastern Europe?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-bipolar',
      kind: 'misconception_check',
      question: 'Was every country during the Cold War clearly aligned with either the US or the USSR?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the Cold War as a clean two-bloc world.',
          correctsTo: 'No. The Non-Aligned Movement included India, Yugoslavia, Egypt, Indonesia and many newly independent states. Some played both sides for aid and arms (Nasser, Tito). China broke with the USSR in the 1960s — the Sino-Soviet split — and by the 1970s was effectively closer to the US (Nixon\'s 1972 visit). Many smaller states had complicated alignments that shifted over time. The "two bloc" framing was the superpowers\' wishful thinking, not the world\'s reality.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cold War: bipolar US/USSR rivalry, but global with proxy wars (Korea, Vietnam, Afghanistan, Cuba).',
        'Containment defined US strategy (Kennan, Truman Doctrine).',
        'Non-Aligned + Sino-Soviet split show the world wasn\'t neatly two-bloc.',
        'Ends 1989-91: Eastern European revolutions, Soviet collapse.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did decolonization and the Cold War get tangled together so completely?',
      hint: 'European empires were dismantling just as the superpowers were looking for global allies. New states had economic and military needs; both blocs offered aid with strings. Nationalist leaders sometimes instrumentalized Cold War competition (playing both sides). Local conflicts (Vietnam, Korea) became Cold War theaters. The result: post-colonial choices were often distorted by superpower priorities, with consequences still felt today (e.g., Iran, Afghanistan).',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
