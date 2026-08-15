/**
 * AP World History — Unit 4 CED 4.6: The Atlantic Slave Trade.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.atlantic-slave-trade.v1`. Covers the scale and
 * geography of the trade, the Middle Passage, West/West-Central African
 * political effects, and the plantation complex/diaspora cultures.
 * Measured, exam-neutral tone throughout, per Global Constraints.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_ATLANTIC_SLAVE_TRADE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.atlantic-slave-trade.v1',
  course: 'AP World History: Modern',
  cedUnit: 4,
  cedTopic: '4.4/4.6',
  cedTitle: 'The Atlantic Slave Trade',
  planId: 'evelyn.ap.apworld.atlantic-slave-trade.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.atlantic-slave-trade.v1' }],
  theory: [
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'definition',
      title: 'Middle Passage',
      content:
        'The transatlantic voyage transporting enslaved Africans to the Americas under confined, dehumanizing conditions, with substantial mortality during the crossing.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'definition',
      title: 'gun-slave cycle',
      content:
        'A self-reinforcing pattern in which West African states traded captives for European firearms, then used those firearms to wage further wars and raids that produced more captives to trade.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'definition',
      title: 'plantation complex',
      content:
        'The system of large agricultural estates (sugar, tobacco, rice) in the Americas organized around forced enslaved labor (often gang labor) to produce cash crops for export.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: 'scale and geography',
      content:
        'Historians estimate roughly 12.5 million enslaved Africans were embarked across the Atlantic slave trade over its full history. Fewer than 5 percent were transported to British North America/the United States; the large majority went to Brazil and the Caribbean, where sugar plantations\' brutal mortality rates created constant demand for replacement labor.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: 'the Middle Passage in practice',
      content:
        "Captives were confined below deck under crowded, dehumanizing conditions for weeks at a time, with substantial mortality during the crossing. First-person accounts, like Olaudah Equiano's, describe the psychological terror of being physically inspected and appraised by a ship's crew before the voyage had even begun.",
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'cause',
      title: 'the gun-slave cycle in West Africa',
      content:
        'Coastal states including Dahomey and Asante became deeply involved in supplying captives to European traders in exchange for firearms and manufactured goods. Firearms won through the trade funded further wars and raids producing more captives, intensifying regional conflict and reorganizing political power around states able to control the trade.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: "Kongo's diplomatic response",
      content:
        "The kingdom of Kongo engaged directly and diplomatically with Portugal from the early 1500s, including correspondence in which Kongo's ruler, Afonso I, raised concerns to the Portuguese crown about the trade's disruptive effects on his kingdom — evidence of active diplomacy, not passive acceptance.",
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: 'the plantation complex',
      content:
        'Enslaved Africans in the Americas were forced to labor within a plantation complex organized around brutal, profit-maximizing systems (gang labor on sugar, tobacco, rice plantations), producing cash crops for export back across the Atlantic.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: 'diaspora cultures',
      content:
        'Out of these conditions, enslaved and free Africans in the Americas created syncretic diaspora cultures — blending African religious, musical, and linguistic traditions with elements of European and Indigenous American cultures — that persisted and evolved across the Americas.',
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'event',
      title: "Equiano's testimony (1789)",
      content:
        "Olaudah Equiano published his Interesting Narrative in 1789, decades after the childhood experience it recounts. He describes being physically inspected by a ship's crew and seeing other captives chained together, an account read as firsthand evidence of Middle Passage conditions rather than of the trade's overall volume or destinations.",
    },
    {
      loId: 'apworld.atlantic-slave-trade',
      kind: 'trap',
      title: 'North America was not the majority destination',
      content:
        'Fewer than 5 percent of enslaved Africans transported across the Atlantic were brought to what became the United States — the large majority went to Brazil and the Caribbean. The prominence of slavery in later U.S. history reflects that country\'s subsequent political history, not the trade\'s overall geography.',
    },
  ],
  methods: [
    {
      title: "Read a first-person Middle Passage account (measured tone)",
      when_to_use:
        'Use this when analyzing a first-person account of the Middle Passage or slave trade, before drawing conclusions about scale, causes, or destinations from a single narrative.',
      steps: [
        'Source it: who is the narrator, when did they write, and what experience are they describing directly (vs. reporting secondhand)?',
        "Identify precisely what the account documents (e.g., inspection, confinement, fear) versus what it does NOT document (e.g., the trade's overall volume or its African political causes).",
        'Discuss the content in a measured, exam-neutral register — convey the reality of dehumanization and terror without adding graphic detail beyond what the source states.',
        "Connect the individual account to the aggregate evidence (scale figures, political effects) covered separately in the concept — don't treat one narrative as proof of the whole system's scale.",
      ],
      example: {
        problem: "Equiano describes being \"handled and tossed up\" by the crew and seeing captives chained together. What can this evidence support?",
        solution:
          "It supports a claim about the psychological terror and dehumanizing treatment of individual captives at the start of the Middle Passage. It does NOT, by itself, support a claim about the trade's total volume or its effects on African state politics — those require the separate scale and gun-slave-cycle evidence.",
      },
      relatedLoIds: ['apworld.atlantic-slave-trade'],
    },
  ],
  pointers: [
    { content: 'North America received UNDER 5% of enslaved Africans transported across the Atlantic — the large majority went to Brazil and the Caribbean. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'The gun-slave cycle is a causal LOOP: captives for guns, guns for more wars, more wars for more captives — always describe it as reinforcing, not a one-time exchange.', kind: 'tip' },
    { content: "Kongo's Afonso I engaged Portugal DIPLOMATICALLY (letters raising concerns) — evidence of African-state agency, not passive victimhood. Never quote his letters verbatim; they are described only, not seeded as a passage.", kind: 'gotcha' },
    { content: 'Keep tone measured and exam-neutral on this topic — convey dehumanization and scale through specific, sourced facts, not graphic or sensationalized language.', kind: 'tip' },
    { content: "Equiano's excerpt (inspection/confinement/fear) is evidence of individual experience, not of the trade's aggregate volume or destinations — don't over-generalize from one narrative.", kind: 'tip' },
  ],
};
