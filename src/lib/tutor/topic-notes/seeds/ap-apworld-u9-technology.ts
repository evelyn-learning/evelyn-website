/**
 * AP World History — Unit 9 CED 9.4-9.5: Technology, Communication, and
 * Health.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.technology-communication.v1`. Covers the Green
 * Revolution, medical advances including smallpox eradication, jet travel,
 * and internet/mobile-phone leapfrogging in the Global South.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U9_TECHNOLOGY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.technology-communication.v1',
  course: 'AP World History',
  cedUnit: 9,
  cedTopic: '9.4-9.5',
  cedTitle: 'Technology, Communication, and Health',
  planId: 'evelyn.ap.apworld.technology-communication.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.technology-communication.v1' }],
  theory: [
    {
      loId: 'apworld.technology-communication',
      kind: 'event',
      title: 'the Green Revolution',
      content:
        'From the 1940s-1960s, Norman Borlaug (described, never quoted) helped develop high-yield, disease-resistant wheat and rice varieties, paired with expanded irrigation and fertilizer use. Adopted across parts of Asia and Latin America, this sharply raised crop yields and helped avoid predicted mass famines, though it required capital not every farmer could access equally.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'event',
      title: 'medical advances and smallpox eradication (1980)',
      content:
        "The spread of antibiotics and expanded vaccination sharply reduced infectious-disease deaths after WWII. The WHO's global vaccination campaign achieved smallpox eradication, certified in 1980 — the first, and so far only, human disease eliminated worldwide through deliberate public-health action.",
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'event',
      title: 'jet travel',
      content:
        'Commercial jet aircraft, widely adopted from the late 1950s, cut international travel times dramatically compared to propeller aircraft or ocean travel, making international business, tourism, and migration far more routine.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'definition',
      title: 'leapfrogging',
      content:
        'Rather than building extensive fixed telephone-line networks first (as wealthier countries did), many countries in the Global South adopted mobile networks and mobile internet access directly, letting the technology reach large populations faster and more cheaply.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'event',
      title: 'mobile/internet growth pattern',
      content:
        'Mobile-cellular subscriptions passed one per person worldwide by the mid-2010s. A reliable single global figure for internet use is not published before 2005; internet use then rose from 15.6% (2005) to 60.1% (2020) of the world\'s population — crossing the halfway mark only shortly before 2020, well after mobile subscriptions saturated.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'framework',
      title: 'diffusion was uneven, not uniform',
      content:
        'The Green Revolution reached some regions/crops far more than others; smallpox eradication took decades of coordinated effort even after a vaccine existed; internet access varied enormously by region and income even by 2020. New technology reached different places by different routes and speeds, never as one simultaneous global rollout.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'definition',
      title: 'antibiotics and vaccines',
      content:
        'The spread of antibiotics (effective against bacterial infection) and expanded vaccination programs after WWII sharply reduced deaths from infectious disease in much of the world, working alongside — but distinct from — the single-disease smallpox-eradication campaign.',
    },
    {
      loId: 'apworld.technology-communication',
      kind: 'cause',
      title: 'why leapfrogging happened',
      content:
        'Building fixed telephone-line infrastructure is capital-intensive and slow; mobile networks require far less fixed infrastructure per user reached. Countries that had not yet built extensive landline networks by the 1990s-2000s could adopt mobile technology directly rather than completing an expensive landline build-out first.',
    },
  ],
  methods: [
    {
      title: 'Explain why a data table uses different starting years for related indicators',
      when_to_use:
        'Use this when a table pairs two related global indicators (e.g. mobile subscriptions and internet use) that begin in different years, before assuming the earlier-starting indicator is simply more complete data.',
      steps: [
        'CHECK WHETHER A RELIABLE GLOBAL AGGREGATE EXISTS for the earlier years of each indicator — some indicators (like early internet use) genuinely lack one.',
        'IDENTIFY THE HEADLINE GROWTH PATTERN of the indicator with the longer history.',
        'CONNECT ANY GAP BETWEEN THE TWO INDICATORS\' MILESTONES (e.g. saturation vs. majority adoption) to a substantive historical pattern like leapfrogging.',
        'AVOID TREATING A DIFFERENT STARTING YEAR AS A FLAW — it can reflect an honest data limitation rather than sloppy sourcing.',
      ],
      example: {
        problem:
          'Mobile subscriptions are tracked from 1990; internet use is tracked only from 2005. Why, and what does the gap between their milestones (subscription saturation vs. majority internet use) suggest?',
        solution:
          'No reliable global internet-use aggregate exists before 2005, so the table honestly starts there rather than using a misleading earlier estimate. Mobile subscriptions passed one-per-person worldwide by the mid-2010s, well before internet use crossed 50% of the population (shortly before 2020) — consistent with mobile-first leapfrogging in much of the Global South.',
      },
      relatedLoIds: ['apworld.technology-communication'],
    },
  ],
  pointers: [
    { content: 'Technology does NOT diffuse at one uniform global pace — leapfrogging (mobile without landlines first) is the clearest counterexample. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Smallpox eradication (1980) is the only human disease ever eliminated worldwide — a strong, specific fact for an SAQ/DBQ on medical advances.', kind: 'frq-vocab' },
    { content: 'Norman Borlaug should be described in your own words on an FRQ, never quoted — none of his writings are in the public domain.', kind: 'gotcha' },
    { content: 'Keep the Green Revolution\'s benefits and its unequal access (capital for fertilizer/irrigation) both in mind — it raised yields but not evenly across all farmers.', kind: 'tip' },
    { content: 'Internet-use data starts at 2005 for a real reason (no earlier reliable global aggregate) — don\'t read that gap as evidence the internet didn\'t exist before 2005.', kind: 'tip' },
  ],
};
