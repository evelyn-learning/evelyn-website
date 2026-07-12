/**
 * AP US History — Unit 1 CED 1.4-1.5: The Columbian Exchange.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.columbian-exchange.v1`. Covers the bidirectional
 * transfer of crops, animals, and disease across the Atlantic, the
 * demographic catastrophe disease inflicted on Native American
 * populations, and Columbus's 1493 letter as Europe's first widely
 * circulated framing of the encounter.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_COLUMBIAN_EXCHANGE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.columbian-exchange.v1',
  course: 'AP United States History',
  cedUnit: 1,
  cedTopic: '1.4-1.5',
  cedTitle: 'The Columbian Exchange',
  planId: 'evelyn.ap.apush.columbian-exchange.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.columbian-exchange.v1' }],
  theory: [
    {
      loId: 'apush.columbian-exchange',
      kind: 'definition',
      title: 'Columbian Exchange',
      content:
        'The transfer of plants, animals, diseases, and people between the Eastern Hemisphere (Europe, Africa, Asia) and the Western Hemisphere (the Americas) that began with sustained contact after 1492 — one of the largest ecological and demographic transformations in human history.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'definition',
      title: 'virgin soil epidemic',
      content:
        'An epidemic among a population with no prior exposure or acquired immunity to a disease, resulting in unusually high mortality. This is the pattern by which smallpox and measles devastated Native American populations after contact — disease often spread ahead of European settlement itself, carried by Native trade and travel networks.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'definition',
      title: 'demographic catastrophe',
      content:
        'The severe, regionally variable Native American population decline following contact, caused by a combination of disease, forced labor, violence, and social disruption. Historians estimate losses as high as roughly 90% in some of the hardest-hit regions (e.g. parts of the Caribbean and central Mexico) over the first century of contact — a figure that varied enormously by region and time period.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'framework',
      title: 'directionality: Americas → Eastern Hemisphere',
      content:
        'Maize, potatoes, and tomatoes (along with beans, squash, and cacao) moved east across the Atlantic. These crops transformed diets and, in some regions, enabled substantial population growth — the potato became a staple across much of Northern Europe.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'framework',
      title: 'directionality: Eastern Hemisphere → Americas',
      content:
        'Wheat, horses, and cattle (along with pigs and sugar cane) moved west into the Americas. Horses in particular transformed how many Native peoples hunted, traveled, and made war in the generations after their introduction — an animal absent from the Americas before contact.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'event',
      title: "Columbus's letter to Luis de Santángel (1493)",
      content:
        'Written immediately after Columbus\'s first voyage to a royal treasury official who had helped finance it, and printed and circulated across Europe within months. Described Española\'s abundant land and the islanders as "guileless, and so liberal" — Europe\'s first widely read account of the encounter, framing both land and people as available for the taking, ahead of the exchange\'s ecological and demographic consequences.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'trap',
      title: 'the exchange was not one-way',
      content:
        'Avoid describing the Columbian Exchange as simply "Europe brought things to the Americas." Crops moved substantially both directions (maize/potatoes/tomatoes east; wheat/horses/cattle west) — what was NOT symmetrical was the demographic cost, which fell overwhelmingly on Native American populations via disease moving west.',
    },
    {
      loId: 'apush.columbian-exchange',
      kind: 'framework',
      title: 'bidirectional transfer, one-sided outcome',
      content:
        'The exchange was genuinely two-way in WHAT moved (crops and animals in both directions) but deeply one-sided in WHO paid the demographic cost — Afro-Eurasian societies mostly gained new food sources supporting population growth, while Native American populations suffered catastrophic disease-driven decline.',
    },
  ],
  methods: [
    {
      title: 'Classify a Columbian Exchange item by direction and consequence',
      when_to_use:
        'Use this when asked to identify an item exchanged across the Atlantic and explain its effect, to avoid mixing up which direction it moved.',
      steps: [
        'IDENTIFY the item: is it a crop/animal, or a disease?',
        'DETERMINE direction: crops like maize/potatoes/tomatoes moved Americas → Eastern Hemisphere; wheat/horses/cattle moved Eastern Hemisphere → Americas; disease (smallpox, measles) moved overwhelmingly Eastern Hemisphere → Americas.',
        'STATE the consequence specific to that direction: population growth/dietary change (crops moving east), transformed hunting/travel/warfare (animals moving west), or catastrophic population decline (disease moving west).',
        'AVOID over-generalizing: not every item had the same kind of consequence — name the SPECIFIC effect tied to the SPECIFIC item.',
      ],
      example: {
        problem: 'Classify the potato and smallpox by direction and consequence.',
        solution:
          'The potato moved from the Americas to Europe, becoming a staple crop that supported population growth in Northern Europe. Smallpox moved from the Eastern Hemisphere to the Americas, causing catastrophic, region-specific population decline among Native peoples who had no prior immunity.',
      },
      relatedLoIds: ['apush.columbian-exchange'],
    },
  ],
  pointers: [
    { content: 'Memorize the directionality pairs: maize/potatoes/tomatoes go EAST; wheat/horses/cattle go WEST; smallpox/measles go WEST.', kind: 'frq-vocab' },
    { content: 'Hedge population-loss figures honestly — "as high as roughly 90% in some hard-hit regions," not a single flat percentage for the whole hemisphere.', kind: 'tip' },
    { content: 'Quote Columbus\'s letter as "guileless, and so liberal" — NOT "artless and generous," which is a different (unseeded) translation.', kind: 'common-error' },
    { content: 'The #1 trap: describing the exchange as one-way. It moved both directions; only the demographic COST was one-sided.', kind: 'trap' },
    { content: "Columbus's letter is evidence of Europe's FIRST framing of the encounter, not evidence of the exchange's ecological or demographic effects, which unfolded afterward.", kind: 'edge-case' },
  ],
};
