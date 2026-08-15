import type { Passage } from '../types';

/**
 * Described-visual stimulus (the VISUAL document type) for AP World Unit-4:
 * a scale-comparison illustration, of the kind used in museum exhibits and
 * textbook treatments of the period, setting a Ming-dynasty treasure ship
 * from Zheng He's fleet (1405-1433) beside a 15th-century Iberian caravel.
 * Text-only passage, so fullText is a factual DESCRIPTION of such an
 * illustration (mirrors the pattern used for apworld-catalan-atlas.ts).
 *
 * Facts verified while authoring against the World History Encyclopedia
 * entry (Cartwright, M., "The Seven Voyages of Zheng He," 7 Feb 2019,
 * sourceUrl below) and cross-checked against Wikipedia's "Zheng He" and
 * "Chinese treasure ship" articles (fetched directly, not from search
 * snippets), which cite the underlying historians:
 * - First-voyage (1405) fleet: 317 ships, including 62 treasure ships
 *   (baochuan), crewed by figures cited in the 20,000-32,000 range across
 *   sources; subsequent voyages (seven total, 1405-1433) are described as
 *   comparable in scale, under the Yongle emperor (voyages 1-6) and the
 *   Xuande emperor (voyage 7), with a pause under the short-lived Hongxi
 *   emperor.
 * - Treasure-ship dimensions are GENUINELY CONTESTED, not settled: the
 *   traditional figure, as usually converted from the Ming shi (1739), puts
 *   the largest ships at roughly 440 feet long by 180 feet wide (about 135
 *   by 55 meters) (a reading followed by Joseph Needham and Edward Dreyer);
 *   many modern scholars argue this is structurally implausible for a
 *   wooden hull and propose much smaller reconstructions, some as low as
 *   roughly 170-250 feet (52-76 meters) in length (e.g., Sleeswyk; Xin
 *   Yuan'ou; Schottenhammer). The World History Encyclopedia entry itself
 *   gives a still different, smaller figure (~180 ft/55 m long by ~28
 *   ft/8.5 m wide) while noting historians dispute the exact measurements.
 *   This description presents the dimensions as a contested range rather
 *   than a single number, precisely because reputable sources disagree by
 *   a factor of roughly two.
 * - Iberian caravels of the same century are comparatively well documented
 *   and far less contested: typically cited at roughly 65-100 feet (20-30
 *   meters) in length, of 50-200 tons burden (general caravel-design
 *   literature, e.g., World History Encyclopedia's "Caravel" entry).
 * - Post-1433: after Zheng He's death (Calicut, 1433, during the seventh
 *   voyage), his successors halted further expeditions and moved to
 *   restrict oceangoing shipbuilding; Wikipedia's fuller account describes
 *   the voyages' records as apparently minimized/dispersed across
 *   departments by opponents of the eunuch-sponsored program rather than
 *   dramatically "destroyed," a more measured framing than the popular
 *   burned-records story, and one this description follows.
 */
export const PASSAGE_APWORLD_ZHENG_HE_VISUAL: Passage = {
  id: 'evelyn.passage.apworld-zheng-he-visual.v1',
  title: 'Zheng He\'s Treasure Fleet vs. an Iberian Caravel (scale comparison)',
  author: 'World History Encyclopedia (Mark Cartwright)',
  year: 2019,
  sourceUrl: 'https://www.worldhistory.org/article/1334/the-seven-voyages-of-zheng-he/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL — description] A scale-comparison illustration, of the kind found in maritime-history museum exhibits and textbook treatments of the Age of Exploration, showing the silhouette of a Ming Chinese treasure ship (baochuan) from Admiral Zheng He\'s fleet alongside the silhouette of a 15th-century Iberian caravel, drawn at the same scale. Zheng He\'s first voyage, in 1405, set out with 317 ships — including 62 treasure ships — and a reported crew of roughly 20,000 to 32,000 officials, soldiers, sailors, and specialists, all financed directly by the Ming imperial court under the Yongle emperor; six further voyages followed through 1433, comparable in scale, briefly paused under the Hongxi emperor and resumed under the Xuande emperor. The treasure ships\' exact dimensions are disputed rather than settled: traditional figures derived from the Ming shi describe the largest ships as roughly 440 feet long by 180 feet wide (about 135 by 55 meters), but many modern scholars consider this implausible for wooden-hulled construction and propose considerably smaller reconstructions, some as low as roughly 170 to 250 feet (52 to 76 meters) in length — accounts genuinely differ by a factor of nearly two, and no single figure commands consensus. Iberian caravels of the same century, by contrast, are comparably well documented at roughly 65 to 100 feet (20 to 30 meters) in length. Even taking the most conservative modern estimate of a treasure ship\'s size, then, Zheng He\'s largest vessels dwarfed a caravel several times over, and his fleet as a whole — hundreds of state-financed ships and tens of thousands of imperial personnel — had no counterpart in the small, far more modestly resourced royally chartered voyages that Portugal and Spain were sending down the African coast and across the Atlantic in the same decades. Yet after Zheng He died at Calicut in 1433 during the seventh voyage, the Ming court halted further expeditions, moved to restrict oceangoing shipbuilding, and let official interest in the voyages lapse — a deliberate withdrawal from state-sponsored maritime expansion just as Iberian voyages were beginning in earnest.',
  lineNumbered: false,
  wordCount: 340,
};
