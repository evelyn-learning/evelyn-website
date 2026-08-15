/**
 * AP US History — Unit 4 CED 4.5-4.7: The Market Revolution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.market-revolution.v1`. Covers the transportation
 * revolution (Erie Canal), the factory system (Lowell mills,
 * interchangeable parts), commercial agriculture, Irish/German
 * immigration, the cult of domesticity, and the Market Revolution's
 * uneven regional reach.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_MARKET_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.market-revolution.v1',
  course: 'AP United States History',
  cedUnit: 4,
  cedTopic: '4.5-4.7',
  cedTitle: 'The Market Revolution',
  planId: 'evelyn.ap.apush.market-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.market-revolution.v1' }],
  theory: [
    {
      loId: 'apush.market-revolution',
      kind: 'definition',
      title: 'Erie Canal',
      content:
        "canal completed in 1825 linking the Hudson River to Lake Erie, dramatically cutting the cost and time of shipping goods between the Midwest and New York City and setting off a broader canal-building boom, later supplemented by railroads.",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'definition',
      title: 'Lowell mills',
      content:
        "Massachusetts textile factories (from the 1820s) that pioneered a factory system employing young, unmarried New England women housed in company boardinghouses — an early large-scale application of wage labor outside the household.",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'definition',
      title: 'interchangeable parts',
      content:
        "standardized, identical machine-made components that could be assembled or repaired without custom-fitting, enabling faster, cheaper mass production of goods like firearms (associated with Eli Whitney).",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'framework',
      title: 'commercial agriculture',
      content:
        "the shift from subsistence farming (growing food mainly for a household's own use) to growing cash crops for sale in distant markets, made possible by the new transportation network — tying rural households directly into the national market for the first time.",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'event',
      title: 'Irish and German immigration (1830s-40s)',
      content:
        "a sharp rise in immigration, especially Irish Catholics (fleeing poverty and, later, the Great Famine) and Germans, who provided crucial labor for canal/rail construction and factory work; this influx also provoked nativist backlash from some native-born Protestant Americans.",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'framework',
      title: 'the cult of domesticity',
      content:
        "an ideology idealizing a separate domestic sphere for middle-class White women as men's (and some women's) labor moved into wage work outside the home. It did not describe most working-class, immigrant, enslaved, or rural women, whose labor remained economically essential to their households.",
    },
    {
      loId: 'apush.market-revolution',
      kind: 'framework',
      title: "the Market Revolution's uneven reach",
      content:
        'these changes did not touch the whole country equally. The Northeast urbanized and industrialized fastest; the Midwest was reshaped mainly through commercial agriculture; the rural South remained oriented around plantation agriculture worked by enslaved labor — fully market-integrated through cotton exports, but along an agricultural-export track rather than an industrial-wage one.',
    },
    {
      loId: 'apush.market-revolution',
      kind: 'trap',
      title: 'not a uniform national transformation',
      content:
        'avoid describing the Market Revolution as industrializing "the whole country evenly." Transportation access, not a single national shift, determined whether a region moved toward wage-factory labor, commercial farming, or an intensified slave-based export economy.',
    },
  ],
  methods: [
    {
      title: 'Explain why a nationwide economic shift affected regions unevenly',
      when_to_use:
        'Use when asked to explain why two regions changed differently during the same broad economic transformation (like the Market Revolution), rather than assuming the change was uniform.',
      steps: [
        'IDENTIFY THE SHARED FORCE — what economic or technological change is common to both regions (e.g. expanding markets, new transportation).',
        'IDENTIFY WHAT EACH REGION ALREADY HAD — existing economic structure, labor system, or infrastructure access before the change.',
        'EXPLAIN HOW THE SAME FORCE PRODUCED DIFFERENT OUTCOMES given each region\'s starting conditions, rather than assuming one region simply "lagged behind" the other.',
        'STATE THE RESULT IN TERMS OF DIFFERENT TRACKS, not different speeds along the same track.',
      ],
      example: {
        problem: 'Why did the Northeast industrialize while the South did not, despite both being part of the same national market?',
        solution:
          "The Northeast's canal and rail access made factory investment profitable (the Lowell mills); the South's already-profitable plantation economy (especially cotton, worked by enslaved labor) gave planters strong incentive to reinvest in land and enslaved labor rather than factories. Both regions deepened their market integration — just along different tracks (industrial wage labor vs. agricultural export).",
      },
      relatedLoIds: ['apush.market-revolution'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: describing the Market Revolution as uniform nationwide industrialization. Always specify WHICH region and HOW it changed.', kind: 'trap' },
    { content: 'The Erie Canal (1825) is the single most testable transportation-revolution fact — know its date and its Hudson-to-Lake-Erie route.', kind: 'tip' },
    { content: 'Lowell mills = young, unmarried New England women in a factory-boardinghouse system — a specific labor force, not generic "factory workers."', kind: 'tip' },
    { content: 'The cult of domesticity described middle-class White women\'s ideal, not most women\'s actual lived experience — do not generalize it to all antebellum women.', kind: 'trap' },
    { content: 'The South was market-integrated too (via cotton exports) — the AP-testable distinction is agricultural-export integration vs. industrial-wage integration, not "integrated vs. not integrated."', kind: 'tip' },
  ],
};
