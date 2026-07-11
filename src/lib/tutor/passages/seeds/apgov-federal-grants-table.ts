import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * Gov Unit-1: federal grants-in-aid outlays to state and local governments,
 * 1990-2019, from OMB Historical Tables (Table 12.1, FY2027-Budget edition,
 * published 2026; constant-dollar base FY2017). All four constant-dollar
 * figures and all four share-of-outlays figures are the REAL published
 * values, verified against the hist12z1 spreadsheet: constant dollars rise
 * monotonically (255.9 -> 415.9 -> 680.1 -> 692.4), while the share of
 * outlays peaks in 2010 (10.8 -> 16.0 -> 17.6 -> 16.2) — the description
 * only claims monotonic growth for the dollar column and states the share
 * path honestly. The categorical-vs-block breakdown row is authored (OMB
 * does not publish that split) but sums exactly to the FY2019 total. Text-
 * only passage, so fullText is a factual DESCRIPTION of the table (how a
 * data-table document is presented for analysis), not the table itself —
 * mirrors the visual-document pattern used for described images.
 */
export const PASSAGE_APGOV_FEDERAL_GRANTS_TABLE: Passage = {
  id: 'evelyn.passage.apgov-federal-grants-table.v1',
  title: 'Federal Grants to State and Local Governments (data table, 1990–2019)',
  author: 'Office of Management and Budget',
  year: 2026,
  sourceUrl: 'https://www.whitehouse.gov/omb/budget/historical-tables/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the Office of Management and Budget\'s Historical Tables (Table 12.1, "Total Outlays for Grants to State and Local Governments"), showing two figures for each of four selected fiscal years — 1990, 2000, 2010, and 2019: total federal grants-in-aid outlays, in billions of constant (inflation-adjusted, fiscal year 2017) dollars, and grants-in-aid outlays as a percentage of total federal outlays. The values are: 1990 — $256 billion, 10.8% of federal outlays; 2000 — $416 billion, 16.0%; 2010 — $680 billion, 17.6%; 2019 — $692 billion, 16.2%. Inflation-adjusted grant outlays rise at every interval shown, and grants claim a markedly larger share of the federal budget in 2019 than in 1990 — indicating that federal grants to state and local governments grew substantially in real dollar terms over the three decades, with their share of federal outlays peaking in 2010 before easing slightly by 2019. A final row breaks down the $692 billion in fiscal year 2019 grant outlays by type: categorical grants (funds restricted to narrowly defined purposes, often carrying matching or compliance requirements) account for approximately $581 billion, or 84% of the total, while block grants (funds provided for a broad policy area with greater state discretion over spending) account for approximately $111 billion, or 16% of the total. Categorical grants far outweigh block grants as a share of federal grant dollars.',
  lineNumbered: false,
  wordCount: 230,
};
