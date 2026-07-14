/**
 * AP World History — Unit 4 CED 4.3: The Columbian Exchange.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.columbian-exchange-global.v1`. Covers the biological
 * exchange between the Americas and Afro-Eurasia, the demographic
 * catastrophe in the Americas, population growth elsewhere, and the
 * silver circuit tying Spanish America to Ming China. Figures below match
 * the seeded passage exactly (1550-1800 total; 1574-1735 Potosí city
 * figure; 30-40% China-share range).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_COLUMBIAN_EXCHANGE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.columbian-exchange-global.v1',
  course: 'AP World History: Modern',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'The Columbian Exchange',
  planId: 'evelyn.ap.apworld.columbian-exchange-global.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.columbian-exchange-global.v1' }],
  theory: [
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'definition',
      title: 'Columbian Exchange',
      content:
        'The transfer of crops, animals, diseases, and people between the Americas and Afro-Eurasia following 1492 contact, with effects on demography, diet, and economies on every continent involved.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'definition',
      title: 'Potosí',
      content:
        'A massive silver-mining district (in present-day Bolivia), worked from 1545, whose registered output made Spanish America the dominant source of world silver for two and a half centuries.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'definition',
      title: 'Manila galleon',
      content:
        'The Spanish trans-Pacific shipping route, established in 1571, that carried American silver from Acapulco to Manila for exchange into the Chinese economy.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'event',
      title: 'crops moved in both directions',
      content:
        'American crops — maize, the potato, tomatoes, cacao — spread across Afro-Eurasia after 1492, while Afro-Eurasian crops (wheat, sugar cane, rice) and animals (horses, cattle, pigs, sheep) spread into the Americas, none of which had existed there before.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'cause',
      title: 'demographic catastrophe in the Americas',
      content:
        'Indigenous American populations had no prior exposure or acquired immunity to Afro-Eurasian diseases (smallpox, measles), which arrived alongside colonizers. The resulting epidemics killed the large majority of Indigenous people across the Americas within a century — the central reason Spanish colonizers increasingly turned to imported enslaved African labor.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'event',
      title: 'population growth in Afro-Eurasia',
      content:
        'High-calorie, adaptable American crops — especially maize and the potato — could be grown on marginal land unsuited to traditional Afro-Eurasian staples, expanding the food supply and contributing to population booms in places like China and parts of Europe.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'framework',
      title: 'the silver circuit',
      content:
        "Potosí silver moved in two directions: across the Atlantic to Spain, and, via the Manila galleon route (established 1571), across the Pacific to China, where the Ming state's mid-1500s Single Whip tax reform required payment in silver, creating sustained demand that pulled American silver eastward.",
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'event',
      title: 'silver output figures (Potosí and Spanish America)',
      content:
        'Total registered silver production across Spanish America, 1550-1800: approximately 136,000 metric tons, on the order of 80 percent of documented world output. Potosí city alone: approximately 18,000 metric tons over 1574-1735. An estimated 30-40 percent of all American silver, cumulatively, flowed onward to China — presented as a range because published estimates genuinely diverge.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'event',
      title: 'economic consequences of the silver flood',
      content:
        'The volume of American silver entering circulation drove sustained price inflation in Spain (the Price Revolution) as the money supply grew faster than the supply of goods; effects of silver-driven inflation reached as far as Ottoman lands, whose economies were also linked into expanding monetary networks.',
    },
    {
      loId: 'apworld.columbian-exchange-global',
      kind: 'trap',
      title: 'not an Atlantic-only exchange',
      content:
        "Because American silver was pulled across the Pacific to meet Ming China's tax-driven demand, the Columbian Exchange's economic consequences reached East Asia just as directly as they reached Western Europe — a genuinely global, not merely Atlantic, phenomenon.",
    },
  ],
  methods: [
    {
      title: 'Read a described data table (silver output figures)',
      when_to_use:
        'Use this as the first move on any unfamiliar quantitative-data stimulus, before making a claim about scale, direction, or significance.',
      steps: [
        'Identify the units and the time range stated for each figure — do not assume two figures cover identical spans just because they are in the same table.',
        'Distinguish a hard total from an estimated range (e.g., the 30-40% China-share figure) — state a range as a range, not as one false-precise number.',
        'Check internal consistency: does a sub-total (Potosí city) make sense as smaller than the larger total it is part of (Spanish America)?',
        "Connect the figures to the concept's causal claim (here: the silver circuit linking Spanish America to Ming China's tax system) rather than treating the numbers as an end in themselves.",
      ],
      example: {
        problem:
          'The table states Spanish America produced ~136,000 metric tons of silver, 1550-1800 (~80% of world output), with Potosí city contributing ~18,000 metric tons of that total over 1574-1735, and 30-40% of all American silver eventually reaching China. What does this show?',
        solution:
          "Spanish America dominated world silver output for two and a half centuries, with Potosí a major but not sole contributor; a substantial minority share (30-40%, stated as a range because scholars genuinely disagree) moved onward to China via the Manila galleon trade — direct evidence the Columbian Exchange's silver circuit was Pacific as well as Atlantic.",
      },
      relatedLoIds: ['apworld.columbian-exchange-global'],
    },
  ],
  pointers: [
    { content: 'The Columbian Exchange was NOT Atlantic-only — the silver circuit tied Spanish America directly to Ming China\'s silver-based tax system via the Manila galleon route (1571).', kind: 'trap' },
    { content: 'State the China-share figure as a RANGE (30-40%), never as a single false-precise percentage — published estimates genuinely diverge.', kind: 'gotcha' },
    { content: 'Keep the two demographic effects distinct: catastrophic population collapse in the Americas (disease) vs. population GROWTH in Afro-Eurasia (new high-calorie crops). Don\'t conflate direction of effect.', kind: 'tip' },
    { content: 'Potosí figures: ~136,000 t total Spanish America (1550-1800, ~80% of world output) vs. ~18,000 t Potosí city specifically (1574-1735) — the city figure is a SUBSET of the hemispheric total, over a different (overlapping but not identical) date range.', kind: 'tip' },
    { content: 'Silver caused inflation in Spain (the Price Revolution) BECAUSE money supply grew faster than the supply of goods — always name the mechanism, not just "silver caused inflation."', kind: 'tip' },
  ],
};
