/**
 * AP World History — Unit 4 CED 4.1-4.2: Technology and the Age of
 * Exploration.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.maritime-exploration.v1`. Covers European motives for
 * exploration, borrowed navigational technology, the Portuguese/Spanish
 * voyages, and the comparative scale/state-sponsorship contrast with Ming
 * China's Zheng He voyages and subsequent withdrawal.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_MARITIME_EXPLORATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.maritime-exploration.v1',
  course: 'AP World History: Modern',
  cedUnit: 4,
  cedTopic: '4.1-4.2',
  cedTitle: 'Technology and the Age of Exploration',
  planId: 'evelyn.ap.apworld.maritime-exploration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.maritime-exploration.v1' }],
  theory: [
    {
      loId: 'apworld.maritime-exploration',
      kind: 'cause',
      title: 'motives for European exploration',
      content:
        'Ottoman and Venetian control of overland and Mediterranean spice routes raised the cost of Asian goods reaching Western Europe, giving Iberian monarchs a commercial incentive to find an alternate sea route. The completed Reconquista (1492) left a militarized, crusading political culture eager for new frontiers, and Renaissance cartography/navigation gave rulers confidence that long ocean voyages were survivable and profitable.',
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'definition',
      title: 'caravel',
      content:
        'A small, maneuverable Iberian ship type combining a borrowed lateen sail rig with other adapted design elements, used in early Portuguese voyages down the African coast.',
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'definition',
      title: 'astrolabe',
      content:
        'A navigational instrument, originally Greek and refined by Islamic astronomers, used by European mariners to estimate latitude from the position of the stars.',
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'definition',
      title: "Zheng He treasure fleet",
      content:
        "The Ming Dynasty's seven state-financed naval expeditions (1405-1433) across the Indian Ocean, vastly larger in ships and crew than any European voyage of the period, ended by a Ming political decision after Zheng He's death rather than by any loss of Chinese capability.",
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'event',
      title: 'borrowed technology',
      content:
        'The magnetic compass originated in China; the lateen (triangular) sail came from Arab and Indian Ocean sailing traditions; the astrolabe was a Greek instrument refined by Islamic astronomers. The caravel combined these borrowed elements rather than reflecting a single European invention.',
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'event',
      title: 'the Portuguese African route',
      content:
        'Sponsored initially by Prince Henry "the Navigator," Portuguese captains worked down the West African coast across the 1400s. Bartolomeu Dias rounded the Cape of Good Hope in 1488; Vasco da Gama completed the sea route to India in 1498, opening a maritime path that bypassed Ottoman- and Venetian-controlled routes.',
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'event',
      title: 'Columbus and Magellan',
      content:
        "Christopher Columbus, sailing west for Spain in 1492 seeking a direct sea route to Asia, instead reached the Caribbean, opening sustained European contact with the Americas. Ferdinand Magellan's Spanish-sponsored expedition (1519-1522) became the first to circumnavigate the globe, though Magellan died in the Philippines in 1521 and the voyage was completed under Juan Sebastián Elcano.",
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'event',
      title: 'the Zheng He voyages and Ming withdrawal',
      content:
        "Between 1405 and 1433, the Ming court sent Admiral Zheng He on seven massive naval expeditions across the Indian Ocean to East Africa, financed directly by the imperial treasury on a scale (hundreds of ships, tens of thousands of crew) dwarfing any European voyage of the era. After Zheng He died in 1433, the Ming court halted further expeditions and restricted oceangoing shipbuilding — a political withdrawal, not a loss of capability.",
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'framework',
      title: 'the real contrast is state commitment, not technology',
      content:
        "Ming China had the greater fleet, resources, and arguably the more advanced program — and chose to stop. Iberian monarchs, using smaller, mostly borrowed technology, kept reinvesting because their commercial and political incentives (bypassing costly middlemen, continuing exploratory/crusading momentum) remained strong and sustained.",
    },
    {
      loId: 'apworld.maritime-exploration',
      kind: 'trap',
      title: 'do not credit European technological superiority',
      content:
        "Most of the key technology behind European voyages (compass, lateen sail, astrolabe) was borrowed and adapted from Chinese, Arab, and Islamic sources, not invented in Europe. Ming China had superior resources and capability but made a political choice to stop sailing after 1433 — state incentive, not technology, explains who kept exploring.",
    },
  ],
  methods: [
    {
      title: 'Read a described scale-comparison visual (contested figures)',
      when_to_use:
        'Use this when analyzing a described visual or data stimulus that presents a genuinely contested historical figure (e.g., disputed ship dimensions), before asserting any single number as settled fact.',
      steps: [
        'Identify what kind of stimulus this is (described visual/data compilation vs. a single eyewitness account) — this changes what "reliability" even means for the source.',
        'State the range of figures given, and note explicitly that scholars disagree, rather than picking the most dramatic number.',
        'Check whether the comparative conclusion (e.g., "X dwarfs Y") holds under the LOWEST end of the disputed range — if it does, the conclusion is robust to the disagreement.',
        "Connect the figures to the concept's causal claim (here: state sponsorship/scale) rather than treating the numbers as an end in themselves.",
      ],
      example: {
        problem:
          "A Zheng He treasure ship's length is disputed: traditional figures give roughly 440 feet; modern reconstructions give as little as roughly 170-250 feet. A caravel is roughly 65-100 feet. Does the scale comparison still hold?",
        solution:
          'Yes — even at the most conservative modern estimate (170-250 feet), a treasure ship is still several times the length of a caravel (65-100 feet), so the conclusion about relative scale holds regardless of which side of the scholarly dispute is correct.',
      },
      relatedLoIds: ['apworld.maritime-exploration'],
    },
  ],
  pointers: [
    { content: 'Do not credit European technological superiority for exploration success — the compass, lateen sail, and astrolabe were all borrowed/adapted, not invented in Europe.', kind: 'trap' },
    { content: "Zheng He's fleet (1405-1433) vastly outscaled any European voyage of the era; the Ming court CHOSE to stop after 1433 — this was a political decision, not a capability gap.", kind: 'trap' },
    { content: 'Keep the motives distinct on FRQs: bypassing Ottoman/Venetian trade routes (commercial), Reconquista momentum (political/religious), and Renaissance navigation confidence (technical) are three separate strands.', kind: 'tip' },
    { content: "Dias (1488) rounded the Cape; da Gama (1498) reached India; Columbus (1492) reached the Caribbean seeking Asia; Magellan's expedition (1519-1522) completed the first circumnavigation (Magellan himself died in 1521). Keep these dates and names straight — they are easy to conflate on an SAQ.", kind: 'tip' },
    { content: 'The Columbus letter is a reserved primary source for this topic\'s multiple-choice questions — treat any Columbus reference here as unquoted factual summary, not a quotation.', kind: 'gotcha' },
  ],
};
