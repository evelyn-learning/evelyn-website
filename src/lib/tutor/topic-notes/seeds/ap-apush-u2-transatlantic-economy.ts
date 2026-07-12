/**
 * AP US History — Unit 2 CED 2.4: The Transatlantic Economy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.transatlantic-economy.v1`. Covers mercantilism, the
 * Navigation Acts, the triangular trade, the consumer revolution, and the
 * origins of salutary neglect — framed consistently with the Period-3
 * causes-of-revolution baseline's account of salutary neglect ending in
 * 1763.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_TRANSATLANTIC_ECONOMY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.transatlantic-economy.v1',
  course: 'AP United States History',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'The Transatlantic Economy',
  planId: 'evelyn.ap.apush.transatlantic-economy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.transatlantic-economy.v1' }],
  theory: [
    {
      loId: 'apush.transatlantic-economy',
      kind: 'definition',
      title: 'mercantilism',
      content:
        'The dominant European economic theory of the colonial era: colonies exist to enrich the mother country by supplying raw materials and serving as a captive market for its manufactured goods, aiming for a favorable balance of trade (exports worth more than imports).',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'definition',
      title: 'Navigation Acts',
      content:
        'A series of English/British trade laws, beginning in 1651 (aimed partly at Dutch shipping) and strengthened in 1660, requiring colonial trade to travel on English or colonial-built and -crewed ships, and requiring certain "enumerated" goods (tobacco, sugar, and later others) to be shipped only to England or English colonies.',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'definition',
      title: 'triangular trade',
      content:
        'A network of overlapping Atlantic trade routes, not one fixed triangle: New England rum and manufactured goods to West Africa; enslaved people carried to the West Indies and mainland colonies (the Middle Passage); sugar and molasses carried back to New England to be distilled into more rum.',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'event',
      title: 'the origins of salutary neglect',
      content:
        'Despite the Navigation Acts being law, Britain enforced them loosely for decades: customs officials in the colonies were few, oversight from London was slow, and smuggling — especially by New England merchants trading with the French and Dutch West Indies — was widespread and often tacitly tolerated. This decades-long pattern of light-touch enforcement is the origin of salutary neglect, which remained largely unbroken through the rest of the colonial era until Britain\'s post-1763 war debt forced a change.',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'framework',
      title: 'the consumer revolution',
      content:
        'Rising colonial wealth from Atlantic trade, combined with a growing supply of British manufactured goods (textiles, ceramics, tea), produced an 18th-century "consumer revolution" — colonists across a widening range of social classes increasingly purchased and displayed British goods, tying colonial daily life more closely to British culture (feeding into the Anglicization trend covered in the colonial-society topic).',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'framework',
      title: 'law on paper vs. enforcement in practice',
      content:
        'Even though the Navigation Acts went largely unenforced for decades, they established the legal PRINCIPLE that Parliament could regulate colonial trade — a principle Parliament drew on and expanded aggressively after 1763, when war debt gave it a fiscal reason to enforce (and go beyond) what the law had said all along.',
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'trap',
      title: 'the Navigation Acts were not strictly enforced from the start',
      content:
        "A law's existence on the books does not mean consistent enforcement in practice. The Navigation Acts (1651, 1660) were loosely enforced for decades before 1763 — the gap between law and enforcement IS the origin of salutary neglect, not evidence the law didn't exist.",
    },
    {
      loId: 'apush.transatlantic-economy',
      kind: 'framework',
      title: 'enumerated goods',
      content:
        'Specific colonial exports (tobacco, sugar, and later others) that the Navigation Acts required to be shipped only to England or English colonies, even when the final buyer was elsewhere in Europe — the mechanism that kept colonial trade profit inside the English commercial system.',
    },
  ],
  methods: [
    {
      title: 'Analyze a colonial trade voyage for mercantilist logic',
      when_to_use:
        'Use this when a prompt describes a colonial-era trade voyage or transaction and asks what economic system or law it reflects.',
      steps: [
        'IDENTIFY the mercantilist goal at work (keeping trade profit/oversight within the English commercial system).',
        'IDENTIFY the specific Navigation Act rule involved (ship nationality requirement, or enumerated-goods routing).',
        'CONNECT the voyage to the broader triangular trade network if it involves multiple Atlantic legs.',
        'CONSIDER enforcement realism: was this the kind of voyage that would actually be inspected closely, or the kind that benefited from salutary neglect?',
      ],
      example: {
        problem: 'A Boston merchant carries tobacco to Amsterdam without first stopping in an English port. Why is this illegal, and would it likely be caught?',
        solution:
          'It violates the Navigation Acts\' enumerated-goods rule (tobacco must route through an English port). Whether it would be caught depends on the era: before 1763, thin customs enforcement and widespread tolerated smuggling (salutary neglect) made evasion common; after 1763, tightened enforcement made this kind of voyage far riskier.',
      },
      relatedLoIds: ['apush.transatlantic-economy'],
    },
  ],
  pointers: [
    { content: 'Salutary neglect did not begin in 1763 — it began with decades of loose Navigation Act enforcement well before then. 1763 is when it ENDED, not when it started.', kind: 'trap' },
    { content: 'The triangular trade is a network of overlapping routes, not a single fixed triangle — avoid oversimplifying it to one path.', kind: 'frq-vocab' },
    { content: 'Mercantilism = favorable balance of trade + colonies as raw-material supplier/captive market. Know both halves.', kind: 'frq-vocab' },
    { content: 'The consumer revolution connects economic history (transatlantic trade) to cultural history (Anglicization) — useful cross-topic link for essays.', kind: 'tip' },
    { content: 'Enumerated goods (like tobacco) had to route through an English port even when the final buyer was elsewhere in Europe — a common MCQ/SAQ detail.', kind: 'frq-vocab' },
  ],
};
