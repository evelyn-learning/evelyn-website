/**
 * AP World History — Unit 7 CED 7.7: World War II as a Global War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.wwii-global.v1`. Covers the sequence of aggressions
 * that predated 1939 in Europe, the war's global theaters and colonial
 * manpower, the Holocaust, and the debated atomic-bomb decision,
 * 1931-1945.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U7_WWII: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.wwii-global.v1',
  course: 'AP World History: Modern',
  cedUnit: 7,
  cedTopic: '7.7',
  cedTitle: 'World War II as a Global War',
  planId: 'evelyn.ap.apworld.wwii-global.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.wwii-global.v1' }],
  theory: [
    {
      loId: 'apworld.wwii-global',
      kind: 'definition',
      title: 'appeasement',
      content:
        "Britain and France's policy of conceding to escalating German demands, culminating in the 1938 Munich Conference's cession of the Sudetenland, in hopes of avoiding war — a policy that failed to prevent further German aggression.",
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'definition',
      title: 'the Holocaust',
      content:
        'Nazi Germany\'s systematic murder of six million Jews and millions of others (Roma, disabled people, political prisoners, Slavic civilians) during World War II, carried out through a documented, bureaucratically organized state campaign.',
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'event',
      title: 'the aggression sequence (1931-1939)',
      content:
        "Japan invades Manchuria (1931) and begins full-scale war with China (1937); Italy invades Ethiopia (1935); Britain/France's appeasement cedes the Sudetenland at Munich (1938); Germany invades Poland (September 1939) — the conventional start of the war IN EUROPE specifically, not a universal start date.",
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'event',
      title: 'global theaters',
      content:
        "Eastern Front (Germany's June 1941 invasion of the USSR, Operation Barbarossa), North Africa, and the Pacific theater (expanding dramatically after Japan's December 1941 attack on Pearl Harbor).",
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'event',
      title: 'colonial manpower (WWII)',
      content:
        'The British Indian Army grew to roughly 2.5 million volunteers by the war\'s end — the largest all-volunteer force in history — fighting across the Middle East, North Africa, and Southeast Asia; Free French forces relied heavily on troops from French colonial Africa.',
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'event',
      title: "FDR's Four Freedoms speech (January 1941)",
      content:
        'Delivered before US formal entry into the war, framing Allied war aims universally: freedom of speech/expression, freedom of worship, freedom from want ("economic understandings" for "a healthy peacetime life"), and freedom from fear ("world-wide reduction of armaments").',
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'event',
      title: 'the atomic-bomb decision (August 1945)',
      content:
        'Truman authorized atomic bombings of Hiroshima (6 August) and Nagasaki (9 August) 1945. Genuinely debated: some argue it was necessary to avoid a costly invasion of Japan; others argue Japan was already near surrender, or the bombings partly aimed to signal power to the USSR.',
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'framework',
      title: "war's end in stages",
      content:
        'Germany surrendered May 1945 (VE Day); Japan formally surrendered September 1945, following the atomic bombings and Soviet entry into the Pacific war.',
    },
    {
      loId: 'apworld.wwii-global',
      kind: 'trap',
      title: "'1939 everywhere' is wrong",
      content:
        "1939 (Germany invades Poland) marks the start of the war IN EUROPE only. Japan's invasion of Manchuria (1931) and full-scale war with China (1937) both preceded it — Asia's war began years earlier.",
    },
  ],
  methods: [
    {
      title: 'Read an idealistic wartime statement of aims against the crises that preceded it',
      when_to_use:
        'Use when a speech or document (e.g. the Four Freedoms, the Fourteen Points) states aspirational postwar aims, and the prompt asks how it responds to prior events.',
      steps: [
        'Source the statement: who, when, relative to formal entry into the conflict?',
        'Identify each stated principle/freedom precisely.',
        'Connect each principle to a specific prior crisis or failure it appears to answer.',
        'Note the parallel to other such wartime statements (e.g. the Fourteen Points) and that such statements express aspiration, not guaranteed outcome.',
      ],
      example: {
        problem: "How does FDR's 'freedom from want' respond to the previous decade's crisis?",
        solution:
          'It defines freedom from want as requiring international "economic understandings" for "a healthy peacetime life" — a direct answer to Depression-era economic nationalism (autarky, collapsed trade) covered in the prior topic.',
      },
      relatedLoIds: ['apworld.wwii-global'],
    },
  ],
  pointers: [
    { content: "Never claim WWII began in 1939 'everywhere' — Japan's war in Asia began in 1931 (Manchuria) and 1937 (full-scale war with China).", kind: 'trap' },
    { content: 'The atomic-bomb decision is a genuinely debated historical question on the AP exam — present both positions, not a single settled verdict.', kind: 'tip' },
    { content: 'The Holocaust is stated factually and measuredly — "the systematic murder of six million Jews and millions of others" — with zero graphic detail.', kind: 'tip' },
    { content: "Colonial manpower was mobilized again in WWII, at an even larger scale than WWI — the British Indian Army's roughly 2.5 million volunteers is the clean example.", kind: 'tip' },
    { content: "The Four Freedoms speech (Jan 1941) predates US formal entry (Dec 1941) — don't date it as a post-Pearl-Harbor statement.", kind: 'common-error' },
  ],
};
