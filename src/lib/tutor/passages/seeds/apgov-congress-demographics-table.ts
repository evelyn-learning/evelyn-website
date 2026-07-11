import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for
 * AP Gov Unit-2: total women serving in the U.S. Congress, 1961-2021, from
 * the Congressional Research Service report "Women in Congress: Statistics
 * and Brief Overview" (CRS Report R43244, updated June 29, 2021). All four
 * year figures and the House/Senate splits are the REAL published values,
 * verified against Table A-1 ("Congressional Service by Women: By Type and
 * Congress, 1917-2021") and Table 2 ("Number of Women Members of the 117th
 * Congress") of that report: 1961 (87th Congress) = 20 (18 House, 2
 * Senate); 1981 (97th Congress) = 23 (21 House, 2 Senate); 2001 (107th
 * Congress) = 74 (60 House, 14 Senate); 2021 (117th Congress, as of June
 * 24, 2021) = 147 (123 House — 119 Representatives plus 3 Delegates and
 * the Resident Commissioner — and 24 Senate). The 50.8%-of-population
 * figure is the published Census Bureau estimate. Text-only passage, so
 * fullText is a factual DESCRIPTION of the table (how a data-table
 * document is presented for analysis), not the table itself — mirrors the
 * visual-document pattern used for described images.
 */
export const PASSAGE_APGOV_CONGRESS_DEMOGRAPHICS_TABLE: Passage = {
  id: 'evelyn.passage.apgov-congress-demographics-table.v1',
  title: 'Women in the United States Congress (data table, 1961–2021)',
  author: 'Congressional Research Service',
  year: 2021,
  sourceUrl: 'https://www.congress.gov/crs_external_products/R/PDF/R43244/R43244.32.pdf',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the Congressional Research Service report "Women in Congress: Statistics and Brief Overview" (CRS Report R43244, updated June 29, 2021), showing the total number of women serving in the U.S. Congress (House and Senate combined, out of 535 voting Members) in four selected years: 1961, 87th Congress — 20 women (18 in the House, 2 in the Senate); 1981, 97th Congress — 23 women (21 in the House, 2 in the Senate); 2001, 107th Congress — 74 women (60 in the House, 14 in the Senate); and 2021, 117th Congress (as of June 24, 2021) — 147 women (123 in the House, including three nonvoting Delegates and the Resident Commissioner, and 24 in the Senate). The number of women in Congress grew only slightly between 1961 and 1981 (from 20 to 23), then accelerated sharply after the 1990s — more than tripling between 1981 and 2001 (23 to 74) and nearly doubling again between 2001 and 2021 (74 to 147). A comparison row reports that, per the U.S. Census Bureau, women made up approximately 50.8% of the total U.S. population as of the 2020 Census. Even at its 2021 high point, the 147 women serving in Congress amounted to roughly 27% of the chamber\'s 535 voting Members — far below women\'s roughly half-share of the population. The data support one clear trend (women\'s descriptive representation in Congress has risen substantially since 1961, with growth accelerating markedly after the 1990s), one direct comparison (a 2021 congressional share of about 27% against a population share of 50.8%), and one conclusion (women\'s presence in Congress has grown in both absolute numbers and share over six decades, but women remain significantly underrepresented in Congress relative to their share of the U.S. population).',
  lineNumbered: false,
  wordCount: 296,
};
