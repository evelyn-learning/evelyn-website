/**
 * AP World History — Unit 4 CED 4.4-4.5: Maritime Trading Empires.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.maritime-empires.v1`. Covers the Portuguese and Dutch
 * trading-post empires in Asia, the Spanish territorial model in the
 * Americas, later French/English entries, and the shared logic of
 * mercantilism. No passage is wired to this topic.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_MARITIME_EMPIRES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.maritime-empires.v1',
  course: 'AP World History',
  cedUnit: 4,
  cedTopic: '4.4-4.5',
  cedTitle: 'Maritime Trading Empires',
  planId: 'evelyn.ap.apworld.maritime-empires.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.maritime-empires.v1' }],
  theory: [
    {
      loId: 'apworld.maritime-empires',
      kind: 'definition',
      title: 'trading-post empire',
      content:
        'An empire built on fortified coastal trading posts controlling shipping lanes and chokepoints (e.g., the Portuguese Estado da India, the Dutch VOC in Asia), rather than on ruling large inland territories and populations.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'definition',
      title: 'encomienda',
      content:
        'A Spanish colonial labor system granting colonizers rights to indigenous labor and tribute, which gradually gave way to the hacienda system of large private estates as Indigenous populations collapsed from disease.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'definition',
      title: 'mercantilism',
      content:
        'The economic doctrine that colonies exist to enrich the mother country by producing a favorable balance of trade, enforced through trade monopolies and chartered-company privileges.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'event',
      title: 'the Portuguese Estado da India (from c. 1505)',
      content:
        'Rather than conquering large inland territories, Portugal built a network of fortified coastal trading posts (feitorias) at strategic chokepoints across the Indian Ocean — including Goa, Malacca, and Hormuz — using naval power to control and tax shipping lanes and dominate the spice trade.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'event',
      title: 'the Dutch VOC (chartered 1602)',
      content:
        'The first major joint-stock company, raising capital from many investors and chartered with quasi-sovereign powers (armies, war, treaties). Founded Batavia (on Java) in 1619 as its Asian headquarters and gradually displaced Portuguese control over much of the Indonesian archipelago spice trade through fortified trading posts and naval dominance.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'event',
      title: "Spain's territorial model in the Americas",
      content:
        'Unlike the Portuguese/Dutch trading-post approach, Spain built an actual territorial empire through conquest and colonial administration: encomienda granted rights to indigenous labor/tribute, gradually giving way to hacienda (large private estates); the casta system structured colonial society by racial classification (peninsulares, criollos, mestizos, and others).',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'event',
      title: 'French and English entries',
      content:
        'France and England entered overseas expansion later than Portugal and Spain, often through chartered joint-stock companies of their own (France chiefly in Canada/Caribbean; England in North America, the Caribbean, and India via the English East India Company), competing with the Dutch and Portuguese using similar chartered-company tools.',
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'framework',
      title: 'mercantilism as the shared logic',
      content:
        "Whatever the specific model — trading-post or territorial — every European maritime power operated under mercantilism, enforced through trade monopolies, chartered-company privileges, and (for England, later) navigation acts restricting colonial trade to the parent country's ships and merchants.",
    },
    {
      loId: 'apworld.maritime-empires',
      kind: 'trap',
      title: 'Spain was the exception, not the rule',
      content:
        'Most European maritime empires before 1750 were armed TRADING networks controlling chokepoints and shipping lanes, not administrations ruling large inland territories. Spanish America is the major, and largely Atlantic-specific, exception, not the general pattern.',
    },
  ],
  methods: [
    {
      title: 'Compare two empire models by control mechanism',
      when_to_use:
        'Use this when asked to compare two (or more) European maritime empires and classify them as trading-post vs. territorial.',
      steps: [
        'Ask what the empire actually CONTROLLED — ports/shipping lanes, or land and population?',
        'Ask HOW it extracted wealth — taxing/monopolizing trade passing through controlled chokepoints, or directly controlling land, labor, and mining/agricultural output?',
        'Ask what INSTITUTION governed it — a chartered joint-stock company acting for investors, or direct royal/colonial administration?',
        'State the classification (trading-post vs. territorial) and note whether it fits the general 1450-1750 pattern or is an exception (Spain).',
      ],
      example: {
        problem: 'Classify the Dutch VOC and Spanish America using this method.',
        solution:
          'VOC: controlled ports/shipping lanes, extracted wealth via the spice-trade monopoly, governed by a chartered joint-stock company → trading-post empire, fits the general pattern. Spanish America: controlled land and labor directly (encomienda/hacienda), extracted wealth via tribute/labor/mining, governed by royal administration → territorial empire, the exception to the general pattern.',
      },
      relatedLoIds: ['apworld.maritime-empires'],
    },
  ],
  pointers: [
    { content: 'Most European maritime empires before 1750 were TRADING-POST empires (fortified ports, shipping lanes), not territorial conquests — Spanish America is the major exception, not the rule.', kind: 'trap' },
    { content: "Don't project the later, more territorial 19th-century imperialism backward onto 1450-1750 — large-scale direct territorial rule across Asia/Africa mostly came later.", kind: 'trap' },
    { content: 'VOC (1602) founded Batavia in 1619; keep the charter date and the headquarters-founding date distinct on an SAQ.', kind: 'tip' },
    { content: 'Encomienda (labor/tribute rights over indigenous people) is NOT the same as hacienda (large private landed estate) — encomienda gave way to hacienda as Indigenous populations collapsed.', kind: 'tip' },
    { content: 'Mercantilism is the shared economic logic across every empire model in this topic — a strong line to use on an FRQ asking "why" any of these empires existed.', kind: 'tip' },
  ],
};
