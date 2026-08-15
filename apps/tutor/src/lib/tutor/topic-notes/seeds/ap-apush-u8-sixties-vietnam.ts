/**
 * AP US History — Unit 8 CED 8.7-8.8/8.11-8.13: The Sixties, the Great
 * Society, and Vietnam.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.sixties-vietnam.v1`. Covers JFK's New Frontier, LBJ's
 * Great Society, the Gulf of Tonkin through Tet, the antiwar movement and
 * counterculture (SDS/Port Huron, described), and the watershed year
 * 1968 — anchored by LBJ's University of Michigan remarks.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SIXTIES_VIETNAM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.sixties-vietnam.v1',
  course: 'AP United States History',
  cedUnit: 8,
  cedTopic: '8.7-8.8/8.11-8.13',
  cedTitle: 'The Sixties, the Great Society, and Vietnam',
  planId: 'evelyn.ap.apush.sixties-vietnam.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.sixties-vietnam.v1' }],
  theory: [
    {
      loId: 'apush.sixties-vietnam',
      kind: 'event',
      title: "JFK's New Frontier",
      content:
        'Kennedy\'s agenda included the Peace Corps and a public commitment to a Moon landing by decade\'s end, framed partly as Cold War competition; much of his domestic legislation stalled in Congress. Assassinated in Dallas, November 1963; succeeded by Lyndon Johnson.',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'definition',
      title: 'the Great Society — more than poverty',
      content:
        'LBJ\'s legislative burst (1964-66) went well beyond the War on Poverty (Economic Opportunity Act, 1964: Job Corps, VISTA, Head Start): Medicare and Medicaid (1965, health care), the Elementary and Secondary Education Act (1965, first major federal aid to schools), and the Immigration and Nationality Act of 1965 (ending national-origins quotas). The Civil Rights Act (1964) and Voting Rights Act (1965) were part of the same burst.',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'event',
      title: 'the Gulf of Tonkin Resolution (1964)',
      content:
        'After reported (later disputed) naval clashes in the Gulf of Tonkin, Congress granted the president broad authority to use military force in Vietnam without a formal declaration of war — the legal basis for the 1965 escalation (Operation Rolling Thunder, US combat ground troops).',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'event',
      title: 'the Tet Offensive (January 1968)',
      content:
        "A massive, coordinated Communist offensive across South Vietnam — a MILITARY defeat for the attackers, but a POLITICAL/psychological turning point in the US: after years of official assurances of progress, Tet's scale badly damaged public confidence in the war effort.",
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'framework',
      title: 'the antiwar movement and counterculture',
      content:
        'SDS (founded 1960) articulated "participatory democracy" and criticized Cold War militarism in the Port Huron Statement (1962, described here, never quoted — copyrighted). A broader youth counterculture rejected mainstream consumerism and conventions beyond organized antiwar politics.',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'event',
      title: '1968 — the watershed year',
      content:
        "After Tet, LBJ announced (March 1968) he would not seek reelection. MLK was assassinated in April; RFK in June, after winning California's primary. The Democratic convention in Chicago (August) saw chaotic protester-police clashes. Nixon won in November on a law-and-order platform.",
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'definition',
      title: '"silent majority"',
      content:
        'Nixon\'s term for Americans he described as quietly supporting a gradual, negotiated withdrawal from Vietnam ("Vietnamization," shifting combat responsibility to South Vietnamese forces) rather than joining vocal antiwar protests.',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'trap',
      title: 'the Great Society was not only anti-poverty policy',
      content:
        'LBJ\'s own May 1964 Michigan speech frames ending poverty as "just the beginning" of a much broader vision (education, civic life, quality of life) — matching the actual scope of Medicare, ESEA, and the 1965 immigration reform that followed.',
    },
    {
      loId: 'apush.sixties-vietnam',
      kind: 'framework',
      title: 'why Tet mattered despite being a US/ARVN battlefield win',
      content:
        'Distinguish MILITARY outcome (Communist forces were repelled with heavy losses) from POLITICAL/domestic effect (American confidence in official "winning" narratives collapsed) — a recurring AP distinction (military success ≠ political/strategic success).',
    },
  ],
  methods: [
    {
      title: 'Separate a document\'s stated scope from its actual legislative follow-through',
      when_to_use:
        'Use when a speech or vision statement (like LBJ\'s Great Society address) claims broader scope than a single famous policy area, and you need to verify whether the follow-through matches.',
      steps: [
        'IDENTIFY THE NAMED POLICY AREA the misconception focuses on (e.g. poverty).',
        'FIND THE TEXT\'S OWN LANGUAGE SIGNALING BROADER SCOPE (e.g. "that is just the beginning").',
        'LIST THE ACTUAL FOLLOW-THROUGH LEGISLATION in each named area (health, education, immigration, etc.).',
        'CONCLUDE whether the rhetorical scope matches the legislative scope.',
      ],
      example: {
        problem: 'Was the Great Society only about ending poverty?',
        solution:
          'Johnson\'s May 1964 speech names poverty and racial injustice but immediately calls that "just the beginning," describing education, leisure, and civic life. The actual 1965 legislation (Medicare/Medicaid, ESEA, Immigration and Nationality Act) matches that broader scope — confirming the vision was not poverty-only.',
      },
      relatedLoIds: ['apush.sixties-vietnam'],
    },
  ],
  pointers: [
    { content: 'Great Society ≠ War on Poverty alone. Always pair it with Medicare/Medicaid, ESEA, or the 1965 immigration reform on the exam.', kind: 'trap' },
    { content: 'The Gulf of Tonkin Resolution is the LEGAL basis for escalation — name it specifically rather than saying "Congress approved the war."', kind: 'frq-vocab' },
    { content: 'Tet (1968) was a military defeat for Communist forces but a political win — don\'t conflate battlefield outcome with public-opinion effect.', kind: 'trap' },
    { content: 'Never quote the Port Huron Statement directly — describe "participatory democracy" and its critique of Cold War militarism in your own words.', kind: 'gotcha' },
    { content: '1968 timeline for FRQs: Tet (Jan) → LBJ withdraws (March) → MLK assassinated (April) → RFK assassinated (June) → DNC Chicago (Aug) → Nixon elected (Nov).', kind: 'tip' },
  ],
};
