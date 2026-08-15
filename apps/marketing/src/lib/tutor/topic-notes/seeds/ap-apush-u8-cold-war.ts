/**
 * AP US History — Unit 8 CED 8.2-8.3: The Origins of the Cold War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.cold-war-origins.v1`. Covers the breakdown of the
 * wartime US-Soviet alliance, containment (Kennan), the Truman Doctrine,
 * Marshall Plan, NATO, the Berlin crisis, NSC-68/Korea, the domestic Red
 * Scare, and Eisenhower's "New Look" and Sputnik — anchored by Truman's
 * March 1947 address to Congress.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_COLD_WAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.cold-war-origins.v1',
  course: 'AP United States History',
  cedUnit: 8,
  cedTopic: '8.2-8.3',
  cedTitle: 'The Origins of the Cold War',
  planId: 'evelyn.ap.apush.cold-war-origins.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.cold-war-origins.v1' }],
  theory: [
    {
      loId: 'apush.cold-war-origins',
      kind: 'definition',
      title: 'containment',
      content:
        "The Cold War strategy, associated with diplomat George Kennan (the \"Long Telegram\"/\"Mr. X\" article), of resisting Soviet/Communist expansion wherever it occurred, WITHOUT necessarily attacking or overthrowing existing Communist governments. Distinct from the more aggressive idea of \"rollback.\"",
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'definition',
      title: 'Truman Doctrine',
      content:
        'President Truman\'s March 12, 1947 policy, announced while requesting aid for Greece and Turkey, committing the US to support "free peoples" resisting subjugation "by armed minorities or by outside pressures" — stated with no geographic limit, converting a narrow aid request into the practical launch of containment as open-ended global policy.',
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'definition',
      title: 'Marshall Plan',
      content:
        "US economic aid program (1948) to rebuild Western European economies, on the theory that poverty and instability made nations vulnerable to Communism. The USSR barred Eastern-bloc participation, deepening Europe's division.",
      },
    {
      loId: 'apush.cold-war-origins',
      kind: 'event',
      title: 'NATO (1949) and the Warsaw Pact (1955)',
      content:
        'NATO committed the US and Western European allies to mutual defense, a sharp break from prior US non-entanglement traditions. The USSR responded years later by organizing Eastern European allies into the Warsaw Pact, formalizing the continent\'s division into rival blocs.',
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'event',
      title: 'the Berlin crisis (1948-49)',
      content:
        'When the Western powers moved to unify their occupation zones of Germany economically, the USSR blockaded all land access to West Berlin. Rather than fight through the blockade, the US and allies supplied the city entirely by air for nearly a year (the Berlin Airlift) until the Soviets lifted it — a crisis resolved without direct combat, but confirming Germany\'s permanent division.',
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'event',
      title: 'NSC-68 and the Korean War (1950)',
      content:
        'NSC-68, a classified policy paper, recommended a dramatic, sustained expansion of US military spending to contain Communism globally — politically difficult to enact until the Korean War (1950-53) provided justification. The war ended in a stalemate near the 38th parallel with no formal peace treaty, cementing containment as a costed, standing military commitment.',
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'event',
      title: 'the domestic Red Scare',
      content:
        "HUAC investigated alleged Communist influence in government and Hollywood (producing a blacklist); Senator Joseph McCarthy made sweeping, often unsubstantiated accusations of Communist infiltration in government from 1950 on. His influence collapsed after the televised Army-McCarthy hearings (1954) and the Senate's formal censure that year, but the broader climate of suspicion had already damaged careers and civil liberties.",
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'framework',
      title: 'the "New Look" and Sputnik (1950s)',
      content:
        'Eisenhower\'s "New Look" relied on nuclear deterrence ("massive retaliation") rather than large conventional forces, seeking to contain Communism more cheaply than Korea-scale spending. The Soviet launch of Sputnik (1957) shocked American confidence, accelerating the Space Race and prompting the National Defense Education Act (1958), funding science/math/language education as a Cold War competitiveness tool.',
    },
    {
      loId: 'apush.cold-war-origins',
      kind: 'trap',
      title: 'containment is not rollback',
      content:
        'Containment sought to STOP Communism from spreading to new countries, not to overthrow governments where it already existed. A more aggressive "rollback" was debated by some politicians but was not the policy actually pursued — even the push toward the Yalu River during the Korean War (1950) triggered Chinese intervention and a costly stalemate, reinforcing containment\'s line-holding logic rather than overturning it.',
    },
  ],
  methods: [
    {
      title: 'Read a Cold War-era presidential address for its rhetorical scope',
      when_to_use:
        'Use this before analyzing any Cold War-era speech or address that announces a specific policy action (an aid request, a troop commitment, a diplomatic opening).',
      steps: [
        'IDENTIFY THE IMMEDIATE, SPECIFIC REQUEST OR ACTION the speech is actually asking for (e.g. aid to two named countries).',
        'CHECK HOW THE SPEECH FRAMES THAT REQUEST — in narrow, country-specific terms, or in universal, ideological terms with no stated geographic limit?',
        'IF THE FRAMING IS UNIVERSAL, treat the speech as doing more than requesting the specific action — it is asking for acceptance of a general doctrine that will justify future decisions.',
        'NAME THE DOCTRINE and connect it to the broader policy pattern it establishes (e.g. containment).',
      ],
      example: {
        problem:
          'Truman\'s March 1947 address asks Congress to fund aid to Greece and Turkey, but frames the commitment as supporting "free peoples" resisting subjugation anywhere. What is the effect of that framing choice?',
        solution:
          'By stating the commitment in universal terms rather than limiting it to Greece and Turkey, Truman converts a specific appropriations request into an open-ended doctrine (containment) that will justify American intervention decisions for decades — the rhetorical hinge later policies (Marshall Plan, NATO, Korea) were built on.',
      },
      relatedLoIds: ['apush.cold-war-origins'],
    },
  ],
  pointers: [
    { content: 'Containment ≠ rollback. Containment stops NEW expansion; it does not try to overthrow existing Communist governments.', kind: 'trap' },
    { content: 'The Truman Doctrine speech never names Greece or Turkey in its most-quoted lines — that universal framing IS the point (turns a request into a doctrine).', kind: 'tip' },
    { content: 'The Berlin Airlift resolved a Cold War crisis WITHOUT direct combat — a good example for "crisis management short of war" prompts.', kind: 'tip' },
    { content: "NSC-68 existed before the Korean War but wasn't politically viable until Korea provided the crisis — sequence matters on the AP exam.", kind: 'tip' },
    { content: "McCarthy's power did not end because his claims were disproven point-by-point — it collapsed after the televised 1954 Army-McCarthy hearings changed public perception, then the Senate censured him.", kind: 'trap' },
  ],
};
