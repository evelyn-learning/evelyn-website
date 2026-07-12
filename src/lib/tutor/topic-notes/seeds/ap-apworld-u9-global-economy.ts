/**
 * AP World History — Unit 9 CED 9.1-9.3: The Globalizing Economy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.global-economy.v1`. Covers Bretton Woods, GATT/WTO,
 * multinational supply chains, China's reform era, the Asian Tigers, the
 * 1997 and 2008 financial crises, and the globalization debate.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U9_GLOBAL_ECONOMY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.global-economy.v1',
  course: 'AP World History',
  cedUnit: 9,
  cedTopic: '9.1-9.3',
  cedTitle: 'The Globalizing Economy',
  planId: 'evelyn.ap.apworld.global-economy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.global-economy.v1' }],
  theory: [
    {
      loId: 'apworld.global-economy',
      kind: 'event',
      title: 'Bretton Woods (1944)',
      content:
        'Allied representatives meeting at Bretton Woods, New Hampshire, created the IMF (to stabilize currency exchange and lend to countries in financial distress) and the World Bank (to fund postwar reconstruction and later development), aiming to prevent a repeat of the 1930s currency and trade collapse.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'definition',
      title: 'GATT (1947) to WTO (1995)',
      content:
        'GATT committed signatories to negotiating rounds that progressively lowered tariffs and trade barriers. In 1995 it was replaced by the WTO, a permanent institution with a formal dispute-resolution process — a shift from a temporary agreement to standing global trade governance.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'definition',
      title: 'multinational corporations and supply chains',
      content:
        'Falling trade barriers, cheaper shipping, and cheaper telecommunications let multinational corporations split production across countries — design in one, components from several, assembly in another — rather than manufacturing entirely within one economy.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'event',
      title: "China's reform era (from 1978)",
      content:
        "Under Deng Xiaoping (described, never quoted), China shifted from central planning toward market-oriented reforms and Special Economic Zones open to foreign investment from 1978, reorienting China toward export manufacturing and producing historically rapid growth.",
    },
    {
      loId: 'apworld.global-economy',
      kind: 'event',
      title: 'the Asian Tigers',
      content:
        'South Korea, Taiwan, Singapore, and Hong Kong pursued export-led industrialization from the 1960s onward — manufacturing for global markets rather than protecting domestic industry — achieving rapid growth widely cited as a model of outward-looking development.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'event',
      title: 'the 1997 and 2008 financial crises',
      content:
        'The 1997 Asian financial crisis began with currency collapses in Thailand and spread across East/Southeast Asian economies. The 2008 global financial crisis, triggered by a US mortgage-market collapse, spread to banks and economies worldwide within months — both showing an interconnected system where one economy\'s shock could no longer stay contained.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'framework',
      title: 'globalization debated, not settled',
      content:
        'Supporters cite falling global poverty, cheaper goods, and rapid growth in previously poor regions; critics cite job losses to low-wage competition, rising within-country inequality even as between-country poverty fell, and the vulnerability interconnected financial systems created (1997, 2008). Both positions are genuinely contested, not a settled verdict.',
    },
    {
      loId: 'apworld.global-economy',
      kind: 'trap',
      title: 'globalization is not one-directional Westernization',
      content:
        "Capital, components, and finished goods flow in MULTIPLE directions, not just outward from the West. China's reforms turned it into a major exporter to the West; the Asian Tigers reshaped global manufacturing — non-Western economies became major producers and investors in their own right.",
    },
  ],
  methods: [
    {
      title: 'Compare a physical-volume indicator against a nominal-dollar indicator on a trade data table',
      when_to_use:
        'Use this when a table gives both a physical-quantity measure (e.g. container throughput) and a nominal-currency measure (e.g. export value) for the same years, before concluding which better shows real trade growth.',
      steps: [
        'IDENTIFY WHAT EACH INDICATOR MEASURES: does it count physical units, or dollar value?',
        'IDENTIFY DISTORTIONS ON THE DOLLAR FIGURE: commodity prices and exchange rates can inflate or depress a nominal-dollar series independent of real volume.',
        'PREFER THE PHYSICAL-VOLUME INDICATOR for claims about how much trade actually grew.',
        'EXPLAIN ANY DIVERGENCE between the two series using price/currency effects, not assume the dollar figure is wrong.',
      ],
      example: {
        problem:
          'Container throughput rose ~22x (1980-2020); nominal export value rose ~9x and flattened after 2010. Which is the better indicator of real trade growth?',
        solution:
          'Container throughput, because it counts physical cargo units unaffected by price. The nominal-dollar series flattened after 2010 due to falling commodity prices and currency effects, even as physical volume kept climbing — a price/currency distortion, not a real slowdown.',
      },
      relatedLoIds: ['apworld.global-economy'],
    },
  ],
  pointers: [
    { content: 'Globalization moved capital and goods in MULTIPLE directions — China and the Asian Tigers became major exporters TO the West, not just recipients of Western investment. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Keep GATT (1947, a series of negotiating rounds) and the WTO (1995, a permanent institution with dispute resolution) straight — GATT was replaced BY the WTO, not the reverse.', kind: 'tip' },
    { content: 'When a table gives both a physical-volume and a nominal-dollar trade measure, the physical-volume figure is the more reliable one for claims about real growth — the dollar figure mixes in price/currency effects.', kind: 'frq-vocab' },
    { content: '1997 (Asian financial crisis, started in Thailand) and 2008 (global financial crisis, started in the US mortgage market) are distinct events with different origins — don\'t conflate them on an SAQ.', kind: 'gotcha' },
    { content: 'Deng Xiaoping should be described in your own words on an FRQ, never quoted — none of his speeches/writings are in the public domain.', kind: 'gotcha' },
  ],
};
