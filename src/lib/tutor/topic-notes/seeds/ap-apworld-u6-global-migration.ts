/**
 * AP World History — Unit 6 CED 6.7: Global Migration in the Age of
 * Empire.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.global-migration.v1`. Covers indenture as a
 * post-abolition labor regime, Indian indenture's real destination data,
 * the distinct Chinese diaspora and transatlantic European migration
 * streams, urbanization, and migration's social consequences (remittances,
 * ethnic enclaves, nativist backlash), 1834-1900.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U6_GLOBAL_MIGRATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.global-migration.v1',
  course: 'AP World History',
  cedUnit: 6,
  cedTopic: '6.7',
  cedTitle: 'Global Migration in the Age of Empire',
  planId: 'evelyn.ap.apworld.global-migration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.global-migration.v1' }],
  theory: [
    {
      loId: 'apworld.global-migration',
      kind: 'definition',
      title: 'indentured servitude',
      content:
        'A labor system in which a worker signs a multi-year contract binding them to a specific employer in exchange for passage, wages, and (often) eventual return passage — the dominant post-abolition labor regime on many British colonial plantations, filled overwhelmingly by Indian recruits after 1834.',
    },
    {
      loId: 'apworld.global-migration',
      kind: 'definition',
      title: 'diaspora',
      content:
        'A population dispersed from its original homeland that maintains a shared identity and connections across its new locations — used here of the Chinese diaspora formed by 19th-century emigration to the Americas and Southeast Asia, through networks separate from Indian indenture.',
    },
    {
      loId: 'apworld.global-migration',
      kind: 'definition',
      title: 'remittance',
      content:
        "Money sent by a migrant worker back to family or community in their country of origin, connecting migrant labor economically to the sending society even across long distances.",
    },
    {
      loId: 'apworld.global-migration',
      kind: 'cause',
      title: 'abolition created the indenture gap',
      content:
        "Indenture emerged specifically to fill the labor gap left by the abolition of slavery across the British Empire (1833-34): plantation economies that had depended on enslaved labor needed a new large-scale, coercible workforce, and turned to indentured servitude, recruited overwhelmingly in India.",
    },
    {
      loId: 'apworld.global-migration',
      kind: 'event',
      title: 'Indian indentured emigration by destination (data table, 1834-1917)',
      content:
        'Six major British destinations: British Mauritius 453,063; British Guiana 238,909; Trinidad and Tobago 147,596; British Jamaica 36,412; Colony of Natal 152,184; Colony of Fiji 60,965 — combined total 1,089,129. Mauritius and British Guiana together account for roughly two-thirds of the total; Fiji\'s smaller total partly reflects that its indenture recruitment began only in 1879. This total covers ONLY these six destinations and ONLY Indian indenture — it excludes other Indian indenture streams and says nothing about the separate Chinese migration streams of the era.',
    },
    {
      loId: 'apworld.global-migration',
      kind: 'event',
      title: 'the Chinese diaspora',
      content:
        'A parallel, historically distinct migration stream from Indian indenture: significant numbers of Chinese laborers migrated (some under indenture-like contracts, some more independently) to the Americas (including U.S. railroad and mining labor) and Southeast Asia, forming lasting overseas Chinese communities — different origin, destinations, and contractual patterns than Indian indenture.',
    },
    {
      loId: 'apworld.global-migration',
      kind: 'event',
      title: 'transatlantic European migration (c. 1850-1914)',
      content:
        "The era's largest VOLUNTARY migration stream: tens of millions of Europeans crossed to the Americas and Australia, driven by push factors (population growth, industrial/agricultural dislocation) and pull factors (available land, industrial jobs, religious/political freedom for some groups).",
    },
    {
      loId: 'apworld.global-migration',
      kind: 'event',
      title: 'urbanization',
      content:
        'Rural populations worldwide moved into rapidly growing industrial and colonial-administrative cities in search of wage labor, reshaping social structures, housing, and public-health conditions on every continent — a consequence common to all the era\'s migration streams.',
    },
    {
      loId: 'apworld.global-migration',
      kind: 'event',
      title: 'nativist backlash: Chinese Exclusion Act (1882)',
      content:
        "The United States barred further Chinese labor immigration in response to (often racially motivated) economic-competition anxieties among native-born workers — an example of the broader pattern in which migrant labor, however economically useful to employers, frequently provoked exclusionary political responses.",
    },
    {
      loId: 'apworld.global-migration',
      kind: 'trap',
      title: '19th-century migration was not only European',
      content:
        'Transatlantic European migration was the largest VOLUNTARY stream, but Indian indenture (over a million to just six destinations) and the separate Chinese diaspora were also large, simultaneous, historically distinct streams driven by different causes (post-abolition coerced labor demand vs. voluntary settlement).',
    },
  ],
  methods: [
    {
      title: 'Read a described migration data table',
      when_to_use:
        'Use as the first move on any data-table stimulus before making a claim about magnitude, timing, or scope.',
      steps: [
        'Identify exactly what is being counted (departures? net migration?), over what period, by whom.',
        'Read the relative magnitudes across categories — which is largest/smallest, and by roughly how much.',
        'Check for a TIMING difference that explains a magnitude (e.g. a destination that started recruiting later will show a smaller total even if the rate was comparable).',
        "State the table's SCOPE precisely — what it excludes — before generalizing its total to a broader claim.",
        'Connect the magnitude/timing pattern back to the historical cause (e.g. post-abolition labor demand) the table is evidence for.',
      ],
      example: {
        problem: 'What does the Indian indenture table reveal, and what should a careful reader keep in mind about its scope?',
        solution:
          "Mauritius and British Guiana together account for roughly two-thirds of the 1,089,129 six-destination total, reflecting how early and extensively those sugar colonies recruited. Fiji's smaller total partly reflects its later 1879 start. The table covers ONLY these six destinations and ONLY Indian indenture — it should never be cited as covering Chinese migration or as an all-inclusive total of Indian indenture worldwide.",
      },
      relatedLoIds: ['apworld.global-migration'],
    },
  ],
  pointers: [
    { content: 'Never describe the indenture table\'s 1,089,129 figure as covering Chinese migration — it is Indian indenture to six British destinations only.', kind: 'trap' },
    { content: '"19th-century migration was only European" is a common error — always be ready to name Indian indenture and the Chinese diaspora as distinct, large, simultaneous streams.', kind: 'common-error' },
    { content: 'Indenture is legally distinct from chattel slavery but historians describe its actual conditions (harsh contracts, limited legal protection) as a new form of coerced labor — useful nuance for an FRQ.', kind: 'tip' },
    { content: 'Fiji\'s indenture began only in 1879 — a useful fact for explaining a SMALLER total in the data table without implying a lower rate of exploitation.', kind: 'tip' },
    { content: 'Pair "remittances/ethnic enclaves" (lasting migrant-community effects) with "nativist backlash" (Chinese Exclusion Act) as the two social-consequence categories the exam expects for this topic.', kind: 'tip' },
  ],
};
