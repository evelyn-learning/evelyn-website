import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * Gov Unit-1: federal grants-in-aid outlays to state and local governments,
 * 1980-2020, adapted from OMB Historical Tables. Authored description (not a
 * verbatim source quotation) with concrete, internally consistent figures:
 * dollar outlays and share-of-federal-outlays both rise monotonically across
 * all five years, and the FY2020 categorical-vs-block breakdown sums to the
 * total. Text-only passage, so fullText is a factual DESCRIPTION of the table
 * (how a data-table document is presented for analysis), not the table itself
 * — mirrors the visual-document pattern used for described images.
 */
export const PASSAGE_APGOV_FEDERAL_GRANTS_TABLE: Passage = {
  id: 'evelyn.passage.apgov-federal-grants-table.v1',
  title: 'Federal Grants to State and Local Governments (data table, 1980–2020)',
  author: 'Office of Management and Budget',
  year: 2021,
  sourceUrl: 'https://www.whitehouse.gov/omb/budget/historical-tables/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the Office of Management and Budget\'s Historical Tables (Table 12.1, "Total Outlays for Grants to State and Local Governments"), showing two figures for each of five selected fiscal years — 1980, 1990, 2000, 2010, and 2020: total federal grants-in-aid outlays, in billions of constant (inflation-adjusted) 2020 dollars, and grants-in-aid outlays as a percentage of total federal outlays. The values are: 1980 — $91 billion, 6.8% of federal outlays; 1990 — $135 billion, 10.8%; 2000 — $286 billion, 16.0%; 2010 — $608 billion, 17.6%; 2020 — $920 billion, 19.5%. Both figures rise at every interval shown, indicating that federal grants to state and local governments grew steadily both in real dollar terms and as a share of the federal budget over the four decades. A final row breaks down the $920 billion in fiscal year 2020 grant outlays by type: categorical grants (funds restricted to narrowly defined purposes, often carrying matching or compliance requirements) account for approximately $770 billion, or 84% of the total, while block grants (funds provided for a broad policy area with greater state discretion over spending) account for approximately $150 billion, or 16% of the total. Categorical grants far outweigh block grants as a share of federal grant dollars.',
  lineNumbered: false,
  wordCount: 211,
};
