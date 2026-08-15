/**
 * G11 — Cold War extension: Korean War, Vietnam War, proxy conflicts.
 *
 * Beyond the broad "Cold War" overview — the actual hot wars fought
 * by proxy. Korea (1950-53), Vietnam (1955-75), Cuba, Afghanistan.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_COLD_WAR_PROXIES: LessonPlan = {
  id: 'evelyn.g11.ss.us-history.cold-war-proxies.v1',
  title: 'Cold War proxy conflicts: Korea, Vietnam, and beyond',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.history.cold-war-proxies',
      description: 'Analyze the major proxy wars and confrontations of the Cold War era.',
      standard: 'NCSS.D2.His.14.9-12',
    },
  ],
  prerequisites: ['ncss.911.history.cold-war'],
  followUps: ['ncss.911.history.post-cold-war'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Cold War as "cold" only between the superpowers — others paid in blood.',
      script: 'The US and USSR never fought directly — that\'s why it\'s "Cold". But MILLIONS died in the wars they fought through OTHER countries. Korea. Vietnam. Afghanistan. Angola. Those wars were anything but cold for the people in them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-major-conflicts',
      kind: 'concept',
      goal: 'Survey four key proxy conflicts and the doctrines behind them.',
      keyIdeas: [
        'CONTAINMENT (Truman Doctrine, 1947): US policy to STOP the spread of communism without directly attacking the USSR. Drove every proxy war to follow.',
        'KOREAN WAR (1950-1953): North Korea (Soviet/Chinese-backed) invaded South Korea. UN forces (mostly US) pushed back. Ended in stalemate at the 38th parallel — still divided today. ~3 million Korean deaths.',
        'VIETNAM WAR (1955-1975): US tried to stop North Vietnam (communist) from unifying with South Vietnam. After ~58,000 US deaths and ~2 million Vietnamese deaths, North won. Massive impact on US politics — anti-war movement, Pentagon Papers, Watergate aftermath.',
        'CUBAN MISSILE CRISIS (1962): USSR placed nuclear missiles in Cuba, 90 miles from Florida. JFK demanded removal. 13 days of closest the world has come to nuclear war. Ended with USSR withdrawing missiles + US secretly removing missiles from Turkey.',
        'SOVIET-AFGHAN WAR (1979-1989): USSR invaded Afghanistan; US armed mujahideen fighters. Soviet defeat contributed to USSR collapse. American-supplied weapons later turned up with the Taliban.',
        'PATTERN: superpowers funded proxies, sometimes sent advisors, occasionally direct troops. The local people did most of the dying.',
      ],
      vocabulary: [
        { term: 'proxy war', definition: 'a conflict where rival powers support opposing sides without fighting each other directly.' },
        { term: 'containment', definition: 'US Cold War strategy to prevent the spread of communism.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cuban-missile',
      kind: 'worked_example',
      problem: 'Why did the Cuban Missile Crisis (1962) almost trigger nuclear war?',
      steps: [
        'USSR placed nuclear missiles in Cuba — 90 miles from US coast.',
        'From there, missiles could hit most of US East Coast in minutes — too fast for the US to retaliate.',
        'JFK refused. Imposed a naval BLOCKADE around Cuba. Soviet ships approached.',
        'For 13 days, the world watched a possible launch escalate. JFK and Khrushchev exchanged letters secretly.',
        'RESOLVED: USSR withdrew missiles publicly; US secretly agreed to remove missiles from Turkey + pledged not to invade Cuba.',
        'CONSEQUENCE: a "hotline" was set up between Kremlin and White House to prevent miscommunication. Nuclear arms talks accelerated.',
      ],
      answer: 'Soviet missiles in Cuba threatened US directly; ended through blockade + secret deal',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the Korean War sometimes called "the Forgotten War" in the United States?',
      expectedAnswer: 'sandwiched between WW2 and Vietnam, ended without clear victory',
      responseFormat: 'free',
      hints: [
        'It came right after WW2 (which had been celebratory) and before Vietnam (which dominated public attention).',
        'It ended in a stalemate, not a clean victory — making it less commemorated.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-war-cold',
      kind: 'misconception_check',
      question: 'Was the Cold War actually "cold" — meaning, no fighting?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the Cold War as a peaceful standoff.',
          correctsTo: 'No — millions died in the proxy wars. "Cold" describes the SUPERPOWER relationship (no direct US-USSR fighting), not the lived experience of Koreans, Vietnamese, Afghans, Angolans, and others.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Containment doctrine drove every Cold War conflict.',
        'Korea: stalemate at 38th parallel, still divided.',
        'Vietnam: US lost; ~58k American deaths, ~2 million Vietnamese.',
        'Cuban Missile Crisis: closest call to nuclear war.',
        'Afghanistan helped collapse USSR but seeded later problems.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the Vietnam War change American attitudes toward government and military?',
      hint: 'Pentagon Papers showed government had lied. War coverage on TV was visceral. Draft created public anger. Trust in institutions dropped sharply.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
