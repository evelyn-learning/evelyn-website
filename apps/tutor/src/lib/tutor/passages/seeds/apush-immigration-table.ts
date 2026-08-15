import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for
 * APUSH Period 6: total immigration to the United States by decade,
 * 1861-1900, plus the shift in European sending regions, from the
 * Department of Homeland Security's 2019 Yearbook of Immigration
 * Statistics (Washington, D.C.: DHS Office of Immigration Statistics,
 * September 2020). Text-only passage, so fullText is a factual DESCRIPTION
 * of the table (mirrors the visual-document pattern used for described
 * images and the apgov-federal-grants-table.ts data table).
 *
 * All figures are real published values, verified while authoring:
 * - Decade totals (Table 1, "Persons Obtaining Lawful Permanent Resident
 *   Status: Fiscal Years 1820 to 2019") are exact sums of that table's own
 *   published annual figures: 1861-1870 = 2,314,824; 1871-1880 = 2,812,191;
 *   1881-1890 = 5,246,613; 1891-1900 = 3,687,564 (verified by summing the
 *   ten published annual figures in each span). These match the classic
 *   "immigration by decade" series also published in Historical Statistics
 *   of the United States.
 * - The regional breakdown uses Table 2 ("Persons Obtaining Lawful
 *   Permanent Resident Status by Region and Selected Country of Last
 *   Residence"), whose own decade columns are calendar-year "1880 to 1889"
 *   and "1890 to 1899" (one year offset from Table 1's fiscal-year-style
 *   1881-1890/1891-1900 spans, so this description refers to them loosely
 *   as "the 1880s"/"the 1890s" rather than claiming identical boundaries).
 *   Southern/Eastern Europe = Italy + Austria-Hungary + Russia; Northern/
 *   Western Europe = Germany + Ireland + United Kingdom + Norway-Sweden.
 *   1880s: Italy 267,660 + Austria-Hungary 314,787 + Russia 173,081 =
 *   755,528 (16.3% of that decade's 4,638,684 total European immigration);
 *   Germany 1,445,181 + Ireland 674,061 + UK 810,900 + Norway-Sweden
 *   586,441 = 3,516,583 (75.8% of European immigration). 1890s: Italy
 *   603,761 + Austria-Hungary 534,059 + Russia 413,382 = 1,551,202 (43.4%
 *   of that decade's 3,576,411 total European immigration); Germany
 *   579,072 + Ireland 405,710 + UK 328,759 + Norway-Sweden 334,058 =
 *   1,647,599 (46.1% of European immigration). Figures rounded to the
 *   nearest hundred in the description prose; underlying published figures
 *   are exact and internally consistent (region subtotals do not, and are
 *   not claimed to, sum to 100% of each decade's European total, since
 *   several smaller sending countries are omitted).
 */
export const PASSAGE_APUSH_IMMIGRATION_TABLE: Passage = {
  id: 'evelyn.passage.apush-immigration-table.v1',
  title: 'U.S. Immigration by Decade, 1861–1900 (data table)',
  author: 'U.S. Department of Homeland Security, Office of Immigration Statistics',
  year: 2020,
  sourceUrl:
    'https://ohss.dhs.gov/sites/default/files/2023-12/yearbook_immigration_statistics_2019_0.pdf',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    "[DATA TABLE — description] A data table adapted from the U.S. Department of Homeland Security's 2019 Yearbook of Immigration Statistics (Table 1, \"Persons Obtaining Lawful Permanent Resident Status: Fiscal Years 1820 to 2019,\" and Table 2, the accompanying breakdown by region and country of last residence), showing total immigrants admitted to the United States by decade and, for two of those decades, the mix of European sending regions. Total immigrants admitted: 1861–1870 — 2,314,824; 1871–1880 — 2,812,191; 1881–1890 — 5,246,613 (the decade of greatest immigration in this span); 1891–1900 — 3,687,564. The table also breaks down European arrivals by country of last residence for the 1880s and 1890s (Table 2's \"1880 to 1889\" and \"1890 to 1899\" columns): immigrants from Southern and Eastern Europe (Italy, Austria-Hungary, and Russia combined) rose from about 755,500 in the 1880s to about 1,551,200 in the 1890s, climbing from roughly 16 percent to roughly 43 percent of that decade's European immigration; over the same span, immigrants from Northern and Western Europe (Germany, Ireland, the United Kingdom, and Norway-Sweden combined) fell from about 3,516,600 to about 1,647,600, dropping from roughly 76 percent to roughly 46 percent of European immigration. Total immigration peaked in the 1880s and fell back in the 1890s, but within the European totals the balance of sending regions shifted decisively away from Northern and Western Europe and toward Southern and Eastern Europe over the same twenty years.",
  lineNumbered: false,
  wordCount: 234,
};
