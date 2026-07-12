/**
 * AP US History — Unit 2 CED 2.6: Slavery in the Colonies.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.slavery-colonies.v1`. Covers the shift from indentured
 * servitude to racial slavery, the Middle Passage, regional variation,
 * slave codes, and the Stono Rebellion (1739) — measured, exam-neutral
 * tone throughout.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SLAVERY_COLONIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.slavery-colonies.v1',
  course: 'AP United States History',
  cedUnit: 2,
  cedTopic: '2.6',
  cedTitle: 'Slavery in the Colonies',
  planId: 'evelyn.ap.apush.slavery-colonies.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.slavery-colonies.v1' }],
  theory: [
    {
      loId: 'apush.slavery-colonies',
      kind: 'definition',
      title: 'Middle Passage',
      content:
        'The forced transatlantic transport of enslaved Africans to the Americas, under confined, chained, and deliberately dehumanizing conditions. First-person accounts, like Olaudah Equiano\'s, describe the psychological terror of being physically inspected by a ship\'s crew before departure.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'definition',
      title: 'task system',
      content:
        'A labor system, common on Lower South rice and indigo plantations, assigning enslaved workers a fixed daily task rather than continuous supervised gang labor — distinct from the gang-labor system typical of Chesapeake tobacco.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'definition',
      title: 'slave codes',
      content:
        'Colonial laws, increasingly detailed by the early 1700s, codifying hereditary, race-based, lifelong enslavement and restricting enslaved people\'s legal rights, mobility, and ability to gather.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'event',
      title: "from indentured servitude to racial slavery",
      content:
        "Through most of the 1600s, Chesapeake planters relied primarily on English indentured servants. As the servant supply declined and Bacon's Rebellion (1676) exposed the instability of a labor force of desperate, land-hungry former servants, planters shifted toward enslaved African labor — permanent, hereditary, and never entitled to land or political voice at a term's end.",
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'event',
      title: 'Virginia\'s 1662 hereditary-status law',
      content:
        "Virginia's 1662 law established that a child's status as enslaved or free followed the status of the mother, making slavery hereditary and lifelong regardless of the father's status — a key legal building block of race-based slave codes.",
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'framework',
      title: 'regional variation in slavery',
      content:
        'Chesapeake: gang labor on tobacco, with a more balanced sex ratio by the 18th century allowing more family formation. Lower South (South Carolina, Georgia): task labor on rice/indigo plantations, with enslaved people outnumbering the free population in some areas. Middle Colonies and New England: smaller-scale, often urban, domestic, and artisanal slavery — present in every region, not confined to the South.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'event',
      title: 'the Stono Rebellion (1739)',
      content:
        'Near the Stono River in South Carolina, a group of enslaved people seized weapons and attempted to escape south to Spanish Florida, which had offered freedom to enslaved people fleeing British colonies. Colonial militia suppressed the uprising; South Carolina responded with the harsher Negro Act (1740), restricting movement, assembly, and literacy.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'framework',
      title: 'open vs. covert resistance',
      content:
        'Open, armed rebellion like Stono was rare. Far more common was covert, day-to-day resistance: work slowdowns, feigned illness, maintaining family and kinship ties, preserving cultural and religious practices, and individual escape.',
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'event',
      title: "Equiano's testimony and the abolition debate",
      content:
        "Olaudah Equiano's Interesting Narrative (1789) recounts his own childhood capture and Middle Passage experience. Published in Britain during the growing parliamentary debate over abolishing the transatlantic slave trade, it became influential first-person evidence in that debate.",
    },
    {
      loId: 'apush.slavery-colonies',
      kind: 'trap',
      title: 'slavery was not only Southern',
      content:
        "Slavery existed in every colonial region — including the Middle Colonies and New England, where it was typically smaller-scale, urban, and domestic. It was most numerically dominant in the Chesapeake and Lower South by the 18th century, but no region was free of it. The strong North/South divide over slavery is a later, 19th-century development.",
    },
  ],
  methods: [
    {
      title: 'Analyze a firsthand slavery-era account as evidence, not proof of scale',
      when_to_use:
        'Use this when a primary source (like Equiano\'s narrative) documents a personal experience of slavery, to keep clear what it does and does not prove.',
      steps: [
        'IDENTIFY what the source directly documents (a specific experience, e.g. the Middle Passage).',
        'IDENTIFY the source\'s audience and purpose (e.g. a British public debating abolition).',
        'CONNECT the source to the broader historical pattern it evidences (dehumanizing treatment, the abolition debate).',
        'DO NOT treat a single firsthand account as proof of the trade\'s overall scale or legal structure — those require separate outside evidence (records, slave codes).',
      ],
      example: {
        problem: "Does Equiano's account prove how large the transatlantic slave trade was?",
        solution:
          "No — it is powerful first-person evidence of the Middle Passage's conditions and of how survivor testimony shaped the later British abolition debate, but claims about the trade's scale or legal administration require separate evidence (shipping/customs records, slave codes).",
      },
      relatedLoIds: ['apush.slavery-colonies'],
    },
  ],
  pointers: [
    { content: "The #1 trap: assuming slavery was only Southern. It existed in every colonial region, just at different scales.", kind: 'trap' },
    { content: "Know the Chesapeake (gang labor, tobacco) vs. Lower South (task labor, rice/indigo) distinction — a common SAQ/DBQ contrast.", kind: 'frq-vocab' },
    { content: "Virginia's 1662 law (status follows the mother) is the key legal building block for hereditary slavery — cite it by name if possible.", kind: 'tip' },
    { content: 'Stono (1739) was rare, open rebellion; day-to-day covert resistance was far more common and is often the better example to use for "resistance" prompts.', kind: 'common-error' },
    { content: "Equiano's Interesting Narrative was published in 1789 — decades after his Middle Passage experience — during the British abolition debate. Don't misdate it to the colonial era itself.", kind: 'gotcha' },
  ],
};
