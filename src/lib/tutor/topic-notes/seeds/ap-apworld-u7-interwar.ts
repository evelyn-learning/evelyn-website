/**
 * AP World History — Unit 7 CED 7.4-7.6: The Great Depression and the
 * Interwar Crisis.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.interwar-world.v1`. Covers the Depression's global
 * economic transmission, economic-nationalist and authoritarian
 * responses, and interwar anti-imperial political ferment, 1929-1939.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U7_INTERWAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.interwar-world.v1',
  course: 'AP World History',
  cedUnit: 7,
  cedTopic: '7.4-7.6',
  cedTitle: 'The Great Depression and the Interwar Crisis',
  planId: 'evelyn.ap.apworld.interwar-world.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.interwar-world.v1' }],
  theory: [
    {
      loId: 'apworld.interwar-world',
      kind: 'definition',
      title: 'import substitution industrialization (ISI)',
      content:
        'An economic strategy, widely adopted in interwar Latin America (e.g. Brazil, Mexico), of building domestic industries to replace imports that became unaffordable after export earnings and global trade collapsed.',
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'definition',
      title: 'autarky',
      content:
        'A policy of deliberate national economic self-sufficiency, pursued by Germany and other interwar states to insulate themselves from a global trading system that had proven catastrophically fragile during the Depression.',
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: "the Great Depression's global transmission",
      content:
        "World trade's gold value fell roughly 66 percent between 1929 and 1934 (to about one-third of its 1929 level), collapsing prices for exported commodities (rubber, coffee, copper, wheat) that many colonial and Latin American economies depended on — not just an industrial-country crisis.",
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: 'unemployment indicators (US and Germany)',
      content:
        "US unemployment reached 24.9% in 1933 (the depression's American trough year); German unemployment reached roughly 30% by 1932 — comparable severity from the same US-centered credit contraction, transmitted through trade and finance.",
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: "Stalin's Five-Year Plans (from 1928)",
      content:
        'State-directed forced rapid industrialization and agricultural collectivization in the USSR, at immense human cost including a severe famine — launched just before the Depression and continuing through it.',
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: "Hitler's 1933 appointment as chancellor",
      content:
        'Worsening Depression-era unemployment and political instability were part of the context in which Adolf Hitler was appointed chancellor in Germany in 1933 and rapidly consolidated dictatorial power.',
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: 'rising Japanese militarism',
      content:
        "Militarist factions within Japan's government and military gained growing political influence during the Depression, citing economic hardship and resource scarcity to help justify an expansionist policy that had already produced the 1931 invasion of Manchuria.",
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: "Gandhi's Salt March (1930)",
      content:
        "Gandhi led a mass, non-violent march to the Indian coast to produce salt in defiance of the British colonial salt tax and production monopoly — a symbolic act of civil disobedience sparking a broader movement against British rule. DESCRIBED only — never quoted.",
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'event',
      title: 'the May Fourth Movement (1919) and Ho Chi Minh\'s petition (1919)',
      content:
        "Chinese students protested the Paris Peace Conference's transfer of Shandong from Germany to Japan (not back to China), sparking broader nationalist organizing. The same conference received, and ignored, a petition from a young Vietnamese nationalist later known as Ho Chi Minh invoking Wilson's self-determination principle. Both DESCRIBED only — never quoted.",
    },
    {
      loId: 'apworld.interwar-world',
      kind: 'framework',
      title: 'commodity economies vs. industrial economies',
      content:
        "The Depression's trade-collapse mechanism (row one of the data table) shows it reached commodity-exporting colonial and Latin American economies through the SAME transmission mechanism that produced US and German unemployment — a single global crisis, not two separate ones.",
    },
  ],
  methods: [
    {
      title: 'Read a multi-row economic-indicator data table for global transmission',
      when_to_use:
        'Use whenever a data table gives multiple related economic indicators (e.g. trade + two countries\' unemployment) and the prompt asks what the table reveals about scope or causation.',
      steps: [
        'Source the table: what is measured, over what period, by what unit?',
        'Read each row for its own magnitude before combining rows.',
        'Look for a shared mechanism connecting the rows (e.g. a single credit/trade contraction producing multiple national outcomes).',
        "State the table's scope precisely — what it does and does NOT separately tabulate.",
        'Connect to the broader claim the table is being used as evidence for.',
      ],
      example: {
        problem: 'What does the Depression indicators table reveal about whether the Depression was mainly an industrial-country crisis?',
        solution:
          "World trade's roughly 66% gold-value collapse (1929-1934) is evidence the crisis reached commodity-exporting economies too, even though the table's other two rows (US 24.9% in 1933, Germany ~30% in 1932) only tabulate industrial-country unemployment directly — refuting an industrial-country-only reading.",
      },
      relatedLoIds: ['apworld.interwar-world'],
    },
  ],
  pointers: [
    { content: "Don't treat the Depression as an industrial-country-only crisis — the trade-collapse row is direct evidence it reached commodity-exporting colonial/Latin American economies too.", kind: 'trap' },
    { content: 'The Depression is CONTEXT for the rise of Stalinism/Nazism/Japanese militarism, not the SOLE cause of any of them — keep the causal claim measured.', kind: 'tip' },
    { content: 'ISI (Latin America) and autarky (Germany) are both economic-nationalist responses to trade collapse — distinguish them by region and mechanism on an FRQ.', kind: 'tip' },
    { content: "Gandhi's Salt March, the May Fourth Movement, and Ho Chi Minh's petition are DESCRIBED only in this course — never quote them verbatim.", kind: 'trap' },
    { content: "Stalin's Five-Year Plans began in 1928, just before the Depression — don't date them as a Depression-era response only.", kind: 'common-error' },
  ],
};
