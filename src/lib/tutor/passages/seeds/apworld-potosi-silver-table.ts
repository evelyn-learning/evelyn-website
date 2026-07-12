import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-4: registered silver output of Spanish America and the Potosí
 * district, and the estimated share of that silver that flowed onward to
 * Asia. All figures are real published values, verified while authoring
 * against Robins, N. A., et al., "Mercury Production and Use in Colonial
 * Andean Silver Production: Emissions and Health Implications,"
 * Environmental Health Perspectives 120(5), 2012 (freely hosted on PubMed
 * Central; sourceUrl below), which itself synthesizes and cites the primary
 * scholarship:
 * - Total Spanish (mainly Bolivian/Peruvian and Mexican) American silver
 *   production, 1550-1800: ~136,000 metric tons, "about 80%" of documented
 *   world silver output in that era (Nriagu, J. O., 1993, cited in Robins
 *   et al.).
 * - Potosí district/city registered output, 1574-1735: ~18,000 metric tons
 *   (after the conventional +25% adjustment for unregistered/contraband
 *   silver applied in the source study) (Bakewell, P. J., "Registered
 *   Silver Production in the Potosí District, 1550-1735," Jahrbuch für
 *   Geschichte Lateinamerikas 12, 1975, cited in Robins et al.).
 * - Potosí city output, 1736-1760: ~1,600 metric tons (Cross, H. E., 1983,
 *   cited in Robins et al.).
 * - Share of American silver eventually reaching China (chiefly via the
 *   Manila galleon trade after 1571): an estimated 30-40% of total American
 *   output, cumulatively, over the early modern period (Flynn, D. O., and
 *   Giráldez, A., "Born with a 'Silver Spoon': The Origin of World Trade in
 *   1571," Journal of World History 6(2), 1995); presented here as a range,
 *   since published estimates genuinely diverge (some scholars put the
 *   figure nearer 30%, others above 40%), rather than as a single false-
 *   precise number.
 * Wording fix (2026-07-12 controller review): the source's underlying
 * registries are compiled at the Potosí-district level, but its own summary
 * sentence attributes the final 18,000-metric-ton, 1574-1735 estimate to
 * "Potosí city" specifically ("we estimated that 18,000 metric tons of
 * silver were produced in Potosí city from 1574 to 1735," Robins et al.
 * 2012). fullText now follows that attribution ("Potosí city") for this
 * figure rather than "Potosí district," matching the source's own wording.
 *
 * Internal consistency: 18,000 t (Potosí, 1574-1735) is properly a subset
 * of, and smaller than, 136,000 t (all Spanish America, 1550-1800), and the
 * two ranges of years overlap but are not identical -- the description
 * states each figure's own date range rather than implying they cover
 * identical spans. The annualized comparison (Potosí's average output in
 * 1574-1735 vs. 1736-1760) is a straightforward arithmetic derivation from
 * the two published totals, not a separately sourced figure.
 */
export const PASSAGE_APWORLD_POTOSI_SILVER_TABLE: Passage = {
  id: 'evelyn.passage.apworld-potosi-silver-table.v1',
  title: 'Registered Silver Output, Potosí and Spanish America (data table, 1550–1760)',
  author: 'Robins et al., synthesizing Bakewell (1975), Nriagu (1993), and Flynn & Giráldez (1995)',
  year: 2012,
  sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3346781/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from historical silver-production scholarship (as synthesized in Robins et al., "Mercury Production and Use in Colonial Andean Silver Production," Environmental Health Perspectives, 2012, drawing on Bakewell 1975, Nriagu 1993, and Cross 1983), showing registered/estimated silver output in metric tons for Spanish America and for the Potosí mining district specifically, plus a separate estimate of the share of American silver that eventually reached Asia. Total silver production across Spanish America, 1550–1800: approximately 136,000 metric tons, on the order of 80 percent of the world\'s documented silver output over that span. Within that hemispheric total, the source attributes approximately 18,000 metric tons of silver over 1574–1735 to Potosí city (in present-day Bolivia) (after applying the conventional 25 percent upward adjustment for unregistered, smuggled silver), an average of roughly 112 metric tons per year; by 1736–1760, Potosí\'s output had fallen to approximately 1,600 metric tons total, an average of roughly 67 metric tons per year — a decline consistent with the well-documented seventeenth-century contraction of Potosí\'s richest ores before a partial eighteenth-century recovery. Separately, historians of the silver trade (Flynn and Giráldez) estimate that somewhere between 30 and 40 percent of all American silver production, cumulatively, flowed onward across the Pacific to China over the early modern period, chiefly via the Manila galleon route established in 1571, with the remainder moving mainly across the Atlantic to Spain and the rest of Europe. Two things follow from these figures: Spanish America dominated world silver output for two and a half centuries, and a substantial minority share of that silver — not merely an Atlantic-bound trickle — was drawn eastward into the Asian, and especially the Chinese, monetary economy.',
  lineNumbered: false,
  wordCount: 282,
};
