/**
 * AP US History — Unit 8 CED 8.4-8.6: Postwar Society, Culture, and
 * Prosperity.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.postwar-society.v1`. Covers the GI Bill, suburbanization
 * and redlining, the baby boom, the Sunbelt, the interstate highway
 * system, television and mass culture, the Beats, and the persistence of
 * poverty amid general affluence. No passage anchor (plan has none).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_POSTWAR_SOCIETY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.postwar-society.v1',
  course: 'AP United States History',
  cedUnit: 8,
  cedTopic: '8.4-8.6',
  cedTitle: 'Postwar Society, Culture, and Prosperity',
  planId: 'evelyn.ap.apush.postwar-society.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.postwar-society.v1' }],
  theory: [
    {
      loId: 'apush.postwar-society',
      kind: 'definition',
      title: 'the GI Bill',
      content:
        "The Servicemen's Readjustment Act (1944) funded college tuition, low-interest home loans, and unemployment benefits for returning WWII veterans — a major federal investment expanding the (mostly white) middle class through education and homeownership.",
    },
    {
      loId: 'apush.postwar-society',
      kind: 'definition',
      title: 'redlining',
      content:
        'The federally sanctioned (and privately followed) practice of rating racially mixed or Black neighborhoods as poor credit risks, denying mortgages/loan guarantees there while subsidizing new white-only suburban development — a major driver of the lasting racial wealth gap, since home equity is a family\'s main source of generational wealth.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'definition',
      title: 'the Sunbelt',
      content:
        'The South and West, whose population and economic weight grew rapidly after WWII, driven by defense spending, the spread of air conditioning, and business-friendly state policy (e.g. right-to-work laws) — a long-term regional power shift away from the older industrial Northeast/Midwest.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'event',
      title: 'suburbanization (Levittown and imitators)',
      content:
        'Mass-produced, affordable suburban developments (the prototype: Levittown, NY) used standardized construction to build homes quickly, financed heavily by FHA/VA loans. Many developments, including Levittown itself, also used racially restrictive sales practices, compounding redlining\'s exclusionary effect.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'event',
      title: 'the baby boom',
      content:
        'A sustained rise in the US birth rate from the mid-1940s through the early 1960s, driven by postwar economic confidence, younger marriage ages, and suburban family-formation — producing the large "Baby Boomer" generation.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'event',
      title: 'the interstate highway system (1956)',
      content:
        "The Federal-Aid Highway Act (1956), championed by Eisenhower partly on Cold War national-defense grounds, reshaped American life around the car — accelerating suburban growth but also displacing existing (often minority) urban neighborhoods to build city highway segments.",
    },
    {
      loId: 'apush.postwar-society',
      kind: 'framework',
      title: 'television and mass culture',
      content:
        'Television spread into most American homes during the 1950s, becoming the dominant shared cultural experience; sitcoms and advertising broadcast a fairly narrow, idealized (white, suburban, middle-class) image of domestic life, contributing to a real — but sometimes overstated — sense of national cultural conformity.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'event',
      title: 'the Beats',
      content:
        'Writers associated with the Beat movement (e.g. Jack Kerouac, Allen Ginsberg) rejected mainstream 1950s conformity and consumerism, celebrating spontaneity and alternative lifestyles — an early crack in the postwar consensus anticipating the 1960s counterculture.',
    },
    {
      loId: 'apush.postwar-society',
      kind: 'trap',
      title: 'prosperity was uneven, not universal',
      content:
        'Poverty remained widespread and, in the era\'s own framing, largely "invisible" to the prosperous majority — concentrated in inner cities left behind by suburban flight, in Appalachia, and among many rural and elderly Americans, often obscured by the dominant suburban-abundance image on television. This "discovery" of persistent poverty amid affluence helped set up the following decade\'s War on Poverty.',
    },
  ],
  methods: [
    {
      title: 'Resolve an apparent contradiction in federal policy effects',
      when_to_use:
        'Use when a prompt presents two seemingly conflicting descriptions of the same federal program or era (e.g. "built the middle class" vs. "excluded Black families") and asks you to explain how both can be true.',
      steps: [
        'STATE THE APPARENT TENSION plainly — do not try to explain it away as a contradiction.',
        'IDENTIFY WHO THE POLICY ACTUALLY REACHED, not just what it was designed to do in the aggregate.',
        'IDENTIFY THE MECHANISM of exclusion or unevenness — was it built into the policy\'s own rules (e.g. underwriting maps), or a separate, additional practice layered on top (e.g. restrictive covenants)?',
        'CONNECT TO LONG-TERM CONSEQUENCES (e.g. generational wealth gaps) to explain why the unevenness mattered beyond the immediate period.',
      ],
      example: {
        problem:
          'FHA/VA loans funded suburban homeownership for millions of families, but the same agencies redlined Black neighborhoods. How can both be true?',
        solution:
          "Federal loan guarantees genuinely lowered homeownership costs and built real wealth — but the underwriting standards those same agencies used rated racially mixed/Black neighborhoods as poor risks, denying loans there regardless of individual creditworthiness. The benefit was real; access to it was not equally distributed, with effects lasting across generations through home-equity wealth.",
      },
      relatedLoIds: ['apush.postwar-society'],
    },
  ],
  pointers: [
    { content: 'Redlining was not just private prejudice at the margins — it was built into federal agencies\' own neighborhood-rating maps.', kind: 'trap' },
    { content: 'Don\'t describe "postwar prosperity" as reaching "everyone" — always pair it with the uneven-distribution evidence (redlining, persistent poverty).', kind: 'tip' },
    { content: 'The interstate highway system had a stated Cold War defense rationale (rapid military/civilian movement), not just a domestic-convenience one.', kind: 'tip' },
    { content: 'The Beats are a CULTURAL dissent from conformity, not a political movement — don\'t conflate them with 1960s antiwar/civil-rights organizing.', kind: 'trap' },
    { content: 'Poverty amid affluence was often described as "invisible" — a useful phrase for FRQ answers explaining why it wasn\'t addressed sooner.', kind: 'frq-vocab' },
  ],
};
