/**
 * AP World History — Unit 5 CED 5.3-5.6: The Industrial Revolution.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.industrial-revolution.v1`. Covers why Britain
 * industrialized first, the factory system and railroads, the spread of
 * industrialization, and the First-vs-Second Industrial Revolution
 * technology/geography shift. Measured, exam-neutral tone throughout, per
 * Global Constraints.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_INDUSTRIAL_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.industrial-revolution.v1',
  course: 'AP World History: Modern',
  cedUnit: 5,
  cedTopic: '5.3-5.6',
  cedTitle: 'The Industrial Revolution',
  planId: 'evelyn.ap.apworld.industrial-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.industrial-revolution.v1' }],
  theory: [
    {
      loId: 'apworld.industrial-revolution',
      kind: 'definition',
      title: 'factory system',
      content:
        'The concentration of wage laborers under one roof working machine-paced shifts, replacing the earlier "putting-out" system of home-based piecework production.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'definition',
      title: 'Second Industrial Revolution',
      content:
        'The wave of industrial technologies from roughly 1870 onward — mass-produced steel (Bessemer process), industrial chemicals, and electricity — that transformed industrial economies again after the first, textile-and-steam-driven wave.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'definition',
      title: 'agricultural revolution',
      content:
        'The pre-industrial British transformation of farming (enclosure of common land, crop rotation, selective livestock breeding) that raised food output and freed rural labor to move into industrial towns.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'framework',
      title: 'why Britain first',
      content:
        'Britain combined accessible coal deposits, accumulated trade/colonial capital, colonial markets and raw materials (notably cotton), the agricultural revolution, and existing river/canal transport — no other economy combined all five factors as completely.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'event',
      title: "Watt's steam engine and mechanized textiles",
      content:
        "James Watt's improved steam engine (patented 1769) made steam power practical beyond mine pumping, enabling mechanized textile production (spinning jenny, water frame, power loom) and the rise of the factory system.",
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'event',
      title: 'early railroads',
      content:
        'The Stockton and Darlington Railway (1825) and the Liverpool and Manchester Railway (1830) dramatically cut the cost/time of moving goods and people, creating further demand for iron, coal, and steel.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'event',
      title: 'spread of industrialization',
      content:
        'Belgium industrialized early (coal deposits, proximity to British capital); Germany rapidly after 1871 unification (heavy industry, cartels); the United States especially after its Civil War; Japan through deliberate Meiji-era (from 1868) state-led industrialization.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'event',
      title: 'Second Industrial Revolution shift',
      content:
        'From roughly 1870, steel (Bessemer process), chemicals, and electricity transformed industrial economies again, with Germany and the United States emerging as leading producers alongside Britain.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'framework',
      title: 'First vs. Second Industrial Revolution',
      content:
        'First (Britain-led): textiles and steam. Second (from c. 1870, Germany/U.S. rising): steel, chemicals, electricity. Both drove the factory system and new raw-material/transport demand, but technology and geographic leadership shifted.',
    },
    {
      loId: 'apworld.industrial-revolution',
      kind: 'trap',
      title: 'industrialization did not immediately improve workers\' lives',
      content:
        "In the decades immediately following the factory system's rise, conditions were often harsh (long hours, dangerous machinery, low-paid women's/children's labor, overcrowded unsanitary cities). Sustained improvement came later, through organizing and reform — not automatically.",
    },
  ],
  methods: [
    {
      title: 'Compare two waves of industrialization by technology and geography',
      when_to_use:
        'Use this when comparing the First and Second Industrial Revolutions, or explaining why industrial leadership shifted over time.',
      steps: [
        'Identify what stayed the same (factory system, raw-material demand, transport infrastructure).',
        'Identify the technology shift (textiles/steam vs. steel/chemicals/electricity).',
        'Identify the geographic/leadership shift (Britain-led vs. Germany/U.S. rising).',
        'Connect to the broader claim: early industrial leadership was not permanent.',
      ],
      example: {
        problem: 'How did industrial leadership change between the First and Second Industrial Revolutions?',
        solution:
          "Britain's coal/capital/colonies advantage drove First Industrial Revolution leadership, but the Second Industrial Revolution's steel/chemical/electrical technologies let Germany and the U.S. catch up or surpass Britain in key measures.",
      },
      relatedLoIds: ['apworld.industrial-revolution'],
    },
  ],
  pointers: [
    { content: "Britain's advantage was a COMBINATION of five factors (coal, capital, colonies, agricultural revolution, water transport) — no single factor (e.g., \"the steam engine\") fully explains it.", kind: 'tip' },
    { content: "Industrialization did NOT immediately improve most workers' lives — this is the #1 tested misconception for this topic.", kind: 'trap' },
    { content: 'First Industrial Revolution = textiles/steam, Britain-led. Second Industrial Revolution (from c. 1870) = steel/chemicals/electricity, Germany/U.S. rising. Keep the two waves distinct on an FRQ.', kind: 'tip' },
    { content: 'Railroads: Stockton and Darlington (1825) before Liverpool and Manchester (1830) — don\'t reverse the order.', kind: 'gotcha' },
    { content: "Japan's industrialization was deliberately STATE-LED (Meiji Restoration, from 1868), driven by a desire to avoid colonization — not a private-capital-led process like Britain's.", kind: 'tip' },
  ],
};
