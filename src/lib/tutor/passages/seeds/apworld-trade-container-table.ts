import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-9: world container port throughput (a physical-volume proxy for
 * globalized trade) alongside world merchandise export value, 1980-2020.
 * Container throughput figures are REAL published values (Drewry Shipping
 * Consultants / UNCTAD data, as tabulated by UNCTADstat and reproduced in
 * transport-geography references citing the same Drewry/UNCTAD figures):
 * 1980 - 36 million TEU; 2000 - 237 million TEU; 2010 - 545 million TEU;
 * 2020 - 792 million TEU (~22x the 1980 level). Merchandise export values
 * are REAL World Trade Organization figures (World Bank indicator
 * TX.VAL.MRCH.CD.WT, sourceOrganization "World Trade Organization (WTO)",
 * current/nominal US dollars, not inflation-adjusted): 1980 - $1.97
 * trillion; 2000 - $6.49 trillion; 2010 - $15.38 trillion; 2020 - $17.73
 * trillion (~9x the 1980 level). Both series rise at every interval shown,
 * but the nominal-dollar series flattens after 2010 (commodity-price and
 * exchange-rate effects) while physical container volume keeps climbing -
 * an honest scoping note included in the fullText rather than glossed over.
 * Text-only passage, so fullText is a factual DESCRIPTION of the table (how
 * a data-table document is presented for analysis), not the table itself -
 * mirrors the visual-document pattern used for described images.
 */
export const PASSAGE_APWORLD_TRADE_CONTAINER_TABLE: Passage = {
  id: 'evelyn.passage.apworld-trade-container-table.v1',
  title: 'World Container Port Throughput and Merchandise Export Value (data table, 1980–2020)',
  author: 'United Nations Conference on Trade and Development',
  year: 2026,
  sourceUrl: 'https://unctadstat.unctad.org/datacentre/dataviewer/US.ContPortThroughput',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table combining a physical-volume measure and a nominal-value measure of world trade at four points from 1980 to 2020. World container port throughput, in million twenty-foot-equivalent units (TEU) handled at ports worldwide (Drewry Shipping Consultants / UNCTAD data): 1980 — 36 million TEU; 2000 — 237 million TEU; 2010 — 545 million TEU; 2020 — 792 million TEU, roughly a twenty-two-fold increase over the forty years shown. World merchandise exports, in current (not inflation-adjusted) US dollars (World Trade Organization data): 1980 — about $2.0 trillion; 2000 — about $6.5 trillion; 2010 — about $15.4 trillion; 2020 — about $17.7 trillion, roughly a nine-fold increase in nominal-dollar terms over the same span. Both indicators rise at every interval shown, but container throughput — a measure of physical volume unaffected by prices — grows far faster than the nominal-dollar figures, especially after 2010, when falling commodity prices and currency effects hold down the dollar total even as the physical volume of goods shipped keeps climbing. Container throughput is therefore the more reliable indicator of how much physical trade actually grew; the export-value figures mix real volume growth together with decades of price and exchange-rate change, and should be read with that limitation in mind.',
  lineNumbered: false,
  wordCount: 208,
};
