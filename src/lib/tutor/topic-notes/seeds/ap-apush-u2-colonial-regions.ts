/**
 * AP US History — Unit 2 CED 2.2-2.3: Colonial Regions.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.colonial-regions.v1`. Covers the Chesapeake's
 * profit-driven tobacco/headright economy, Bacon's Rebellion and the shift
 * toward slavery, New England's covenant-community model, the Middle
 * Colonies, and the Lower South.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_COLONIAL_REGIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.colonial-regions.v1',
  course: 'AP United States History',
  cedUnit: 2,
  cedTopic: '2.2-2.3',
  cedTitle: 'Colonial Regions',
  planId: 'evelyn.ap.apush.colonial-regions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.colonial-regions.v1' }],
  theory: [
    {
      loId: 'apush.colonial-regions',
      kind: 'definition',
      title: 'headright system',
      content:
        "Virginia's land-grant policy awarding 50 acres of land to anyone who paid for a settler's Atlantic passage, encouraging wealthy planters to import large numbers of laborers to grow tobacco.",
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'definition',
      title: 'indentured servitude',
      content:
        'A labor contract binding a person — often poor English immigrants — to work for a fixed term of years in exchange for passage to the colonies. The dominant Chesapeake labor system through most of the 1600s, before the shift toward enslaved African labor.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'definition',
      title: 'covenant',
      content:
        "In Puritan New England, a solemn, binding agreement — with God, and among church/town members — that defined a community's shared religious and civic purpose, and against which its collective success or failure would be judged.",
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'event',
      title: 'Jamestown (1607) and the Chesapeake profit motive',
      content:
        'The Virginia Company founded Jamestown as a for-profit venture, not a religious refuge. Early years were disastrous (the 1609-10 "starving time"), but John Rolfe\'s successful tobacco cultivation (from around 1612) gave Virginia a viable cash crop and created constant demand for land and labor via the headright system. Maryland (1632), a Catholic proprietary colony, developed a very similar tobacco-and-headright economy.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'event',
      title: "Bacon's Rebellion (1676)",
      content:
        'An armed uprising of Virginia settlers, led by Nathaniel Bacon against Governor Berkeley, driven by frustration over Native American policy and unequal access to land among poor, land-hungry former servants and frontier settlers. It briefly burned Jamestown before collapsing. The rebellion exposed the instability of a labor system reliant on masses of temporarily unfree English poor, and contributed to Chesapeake planters\' shift toward permanent, hereditary enslaved African labor in the following decades.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'event',
      title: 'Massachusetts Bay (1630) and Winthrop\'s covenant',
      content:
        'John Winthrop, aboard the ship Arbella in 1630, cast the Massachusetts Bay venture as a covenant with God: the colonists had entered "into Covenant with Him for this worke," and their success or failure would be watched — the settlement would be "as a citty upon a hill," with "the eies of all people… uppon us." Plymouth (1620) was founded on similar religious purpose by Separatist Pilgrims.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'framework',
      title: 'New England society vs. the Chesapeake',
      content:
        "New England grew through natural increase (whole families migrated together, and the climate was healthier) rather than continuous immigration; towns organized life around the church and town meeting; the economy relied on subsistence farming, fishing, and shipbuilding. The Chesapeake, by contrast, had a mostly young, male servant population, higher mortality, and an economy built around one dominant cash crop (tobacco) and large landholdings.",
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'framework',
      title: 'the Middle Colonies and the Lower South',
      content:
        'The Middle Colonies (New York, and Pennsylvania founded 1681 by William Penn as a Quaker refuge) developed a grain-exporting "breadbasket" economy and genuine religious toleration for multiple faiths — a real contrast to Puritan New England. The Lower South (e.g. South Carolina) developed rice- and indigo-plantation economies on large landholdings, increasingly worked by enslaved labor imported directly from Africa.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'event',
      title: 'measured Native conflict context',
      content:
        "Regional expansion brought conflict with Native nations already living on the land: the Pequot War (1636-38) in New England, and King Philip's War (1675-76, fought the same year as Bacon's Rebellion) reshaped colonial-Native relations in the region.",
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'framework',
      title: 'contrast with Spanish colonization',
      content:
        "Unlike Spanish America's centralized, Crown-administered system built around the encomienda and repartimiento, English colonization was dispersed across many separately chartered/proprietary colonies, each developing its own elected assembly and regional labor system — though, like Spanish America, it ultimately relied on coerced labor.",
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'trap',
      title: 'most colonists did not come for religious freedom',
      content:
        'Religious purpose drove Plymouth and Massachusetts Bay, but most colonists overall — especially in the Chesapeake, and later the Middle and Lower South — came for economic opportunity (land, indentured-servitude contracts, profit), not religious freedom. Do not generalize New England\'s founding motive to "the colonists" as a whole.',
    },
    {
      loId: 'apush.colonial-regions',
      kind: 'trap',
      title: 'Puritans enforced conformity, not tolerance',
      content:
        'Puritan Massachusetts Bay enforced strict conformity to its own religious order and banished dissenters — most famously Roger Williams (who founded Rhode Island on principles of religious liberty) and Anne Hutchinson. Puritans sought freedom to practice their own faith, not to tolerate competing ones; genuine toleration is better associated with Pennsylvania under William Penn.',
    },
  ],
  methods: [
    {
      title: 'Source and contrast two colonial regions',
      when_to_use:
        'Use this whenever a prompt asks you to compare or contrast regional colonial development (e.g. New England vs. Chesapeake).',
      steps: [
        'IDENTIFY the founding motive of each region (profit vs. religious/covenant purpose).',
        'IDENTIFY the resulting economic system (cash crop + labor system, or subsistence/mixed economy).',
        'IDENTIFY the resulting social structure (family migration and natural increase vs. mostly male servant population and high mortality).',
        'CONNECT each difference back to founding motive and geography — do not treat the differences as coincidental.',
      ],
      example: {
        problem: "Contrast Chesapeake and New England colonial development.",
        solution:
          'Chesapeake: for-profit venture (Virginia Company), headright system, tobacco cash crop, indentured servitude shifting to slavery after Bacon\'s Rebellion (1676), mostly young male population, high mortality. New England: religious covenant purpose (Winthrop, 1630), family migration, town/church-centered life, subsistence farming and fishing, population growth via natural increase.',
      },
      relatedLoIds: ['apush.colonial-regions'],
    },
  ],
  pointers: [
    { content: 'Winthrop\'s "citty upon a hill" (1630) is a covenant framing — success/failure judged by the world — not a real-estate or profit metaphor. Quote the Hanover-transcription spelling exactly if quoting.', kind: 'frq-vocab' },
    { content: "The #1 trap: assuming all colonists came for religious freedom. Most, especially in the Chesapeake, came for economic opportunity.", kind: 'trap' },
    { content: "Bacon's Rebellion (1676) didn't single-handedly cause the shift to slavery, but it's the key event exposing why planters wanted a more permanent, controllable labor force.", kind: 'tip' },
    { content: 'Do not confuse Puritan religious purpose with religious tolerance — Massachusetts Bay banished Roger Williams and Anne Hutchinson for dissent.', kind: 'common-error' },
    { content: 'Know the region-to-economy pairing: Chesapeake=tobacco/headright, New England=subsistence/fishing/shipbuilding, Middle Colonies=grain/toleration, Lower South=rice/indigo.', kind: 'frq-vocab' },
  ],
};
