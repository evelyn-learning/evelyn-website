/**
 * AP US History — Unit 4 CED 4.12-4.13: African Americans in the
 * Antebellum South.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.slavery-south.v1`. Covers the cotton gin's expansion
 * of cotton cultivation and the internal slave trade, the planter/
 * yeoman social structure, enslaved family/culture/resistance
 * (including Nat Turner's rebellion), and hardening proslavery
 * ideology — discussed in measured, factual terms.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SLAVERY_SOUTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.slavery-south.v1',
  course: 'AP United States History',
  cedUnit: 4,
  cedTopic: '4.12-4.13',
  cedTitle: 'African Americans in the Antebellum South',
  planId: 'evelyn.ap.apush.slavery-south.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.slavery-south.v1' }],
  theory: [
    {
      loId: 'apush.slavery-south',
      kind: 'definition',
      title: 'cotton gin',
      content:
        "Eli Whitney's 1793 machine that mechanized separating cotton fiber from seed, making short-staple cotton hugely profitable and driving cotton cultivation's rapid expansion across the Deep South, tying the region's economy to international (especially British) textile manufacturing.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'definition',
      title: 'internal slave trade',
      content:
        "the forced sale and relocation of enslaved people from the Upper South (Virginia, Maryland) to the expanding cotton lands of the Deep South (Alabama, Mississippi, Louisiana), routinely separating enslaved families — a direct consequence of cotton's economic expansion.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'framework',
      title: 'planter and yeoman social structure',
      content:
        "a small planter class (commonly 20+ enslaved people) held disproportionate wealth, political power, and social status, even though most White Southern families owned no enslaved people. Most White Southerners were yeoman farmers, often without enslaved labor, yet many still supported slavery through kinship, racial hierarchy, hope of upward mobility, or the local economy's dependence on the planter class.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'event',
      title: 'enslaved family and culture',
      content:
        "despite constant threat of sale and family separation, enslaved communities built resilient family structures, oral traditions, religious practices blending Christianity with African cultural retentions, and community networks sustaining identity under extraordinarily difficult conditions.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'framework',
      title: 'forms of enslaved resistance',
      content:
        "resistance ranged from everyday acts (work slowdowns, feigned illness, subtle sabotage) to escape attempts to organized rebellion — a spectrum, not a single form.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'event',
      title: "Nat Turner's Rebellion (1831)",
      content:
        "an armed uprising of enslaved people in Southampton County, Virginia (August 1831) that killed dozens of White Virginians before being suppressed — one of the era's most direct examples of organized enslaved resistance, and a major catalyst for hardening proslavery ideology and tightened legal restrictions.",
    },
    {
      loId: 'apush.slavery-south',
      kind: 'framework',
      title: '"positive good" defense',
      content:
        'in the years surrounding Nat Turner\'s Rebellion and rising immediatist abolitionism (Garrison\'s Liberator, also 1831), White Southern defenders of slavery shifted from an earlier "necessary evil" framing toward an aggressive "positive good" defense claiming slavery benefited both enslaved people and society.',
    },
    {
      loId: 'apush.slavery-south',
      kind: 'trap',
      title: 'most White Southerners did NOT own slaves',
      content:
        'do not conflate "the South\'s economy depended on slavery" with "most Southern families owned enslaved people." Most White Southern families were non-slaveholding yeoman farmers; a small planter class held a disproportionate share of enslaved labor and political power.',
    },
  ],
  methods: [
    {
      title: 'Trace an economic cause to its social consequences',
      when_to_use:
        'Use when asked to connect a single economic development (like the cotton gin) to broader social changes it produced.',
      steps: [
        'NAME THE ECONOMIC CAUSE and what specifically it changed (cost, scale, profitability of an activity).',
        'TRACE THE FIRST-ORDER EFFECT (e.g. expanded cotton cultivation).',
        'TRACE THE SECOND-ORDER SOCIAL EFFECT the first-order effect drove (e.g. the internal slave trade, family separation).',
        'CHECK WHO WAS AFFECTED, AND HOW UNEVENLY — economic causes rarely affect all groups in a region the same way.',
      ],
      example: {
        problem: 'How did the cotton gin affect enslaved families?',
        solution:
          'The cotton gin made cotton hugely profitable across the Deep South, driving demand for enslaved labor there. This fed a massive internal slave trade relocating enslaved people from the Upper South to Deep South cotton lands, routinely separating enslaved families in the process.',
      },
      relatedLoIds: ['apush.slavery-south'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: assuming most White Southerners owned slaves. Most were non-slaveholding yeoman farmers; a small planter class held disproportionate power.', kind: 'trap' },
    { content: 'Nat Turner\'s Rebellion (1831) and Garrison\'s Liberator (also 1831) are often paired on the AP exam — know both the date overlap and why White Southerners perceived them as a combined threat.', kind: 'tip' },
    { content: 'The shift from "necessary evil" to "positive good" proslavery ideology is a specific, testable change — date it to the early 1830s, not the whole antebellum period generally.', kind: 'tip' },
    { content: 'The internal slave trade is a direct, testable consequence of the cotton gin\'s economic expansion — connect the two explicitly rather than treating them as separate facts.', kind: 'tip' },
    { content: 'Discuss slavery and Indian removal in factual, measured terms — cite specific dates, actors, and documented outcomes rather than dramatized description.', kind: 'tip' },
  ],
};
