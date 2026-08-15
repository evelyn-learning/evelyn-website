import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type)
 * for APUSH Period-9: legal immigration to the United States by region
 * of last residence, comparing the 1960s (fiscal years 1960-1969) to
 * the 2000s (fiscal years 2000-2009). Figures are computed from the
 * REAL published totals in the DHS/OHSS Yearbook of Immigration
 * Statistics, Table 2 ("Persons Obtaining Lawful Permanent Resident
 * Status by Region and Selected Country of Last Residence: Fiscal Years
 * 1820 to 2022"): 1960s total 3,213,749 (Europe 1,133,443; Asia
 * 358,563; the Americas excluding Canada 1,241,057; Canada 433,128;
 * Africa 23,780; Oceania 23,659; not specified 119) and 2000s total
 * 10,299,430 (Europe 1,349,609; Asia 3,470,835; the Americas excluding
 * Canada 4,205,180; Canada 236,349; Africa 759,734; Oceania 65,793; not
 * specified 211,930). The four region shares reported here (Europe,
 * Asia, Latin America defined as the Americas excluding Canada, and all
 * other origins combined) are computed directly from those totals and
 * round to 1960s: 35% / 11% / 39% / 15% (sums to 100) and 2000s: 13% /
 * 34% / 41% / 12% (sums to 100) -- verified while authoring against the
 * source spreadsheet. Text-only passage, so fullText is a factual
 * DESCRIPTION of the table, not the table itself -- mirrors the
 * described-table pattern used for other data-table documents (gold:
 * apgov-federal-grants-table.ts).
 */
export const PASSAGE_APUSH_IMMIGRATION_ORIGINS_TABLE: Passage = {
  id: 'evelyn.passage.apush-immigration-origins-table.v1',
  title: 'Legal Immigration by Region of Origin (data table, 1960s vs. 2000s)',
  author: 'U.S. Department of Homeland Security, Office of Homeland Security Statistics',
  year: 2023,
  sourceUrl: 'https://ohss.dhs.gov/topics/immigration/yearbook/2022/table2',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the Department of Homeland Security\'s Yearbook of Immigration Statistics (Table 2, "Persons Obtaining Lawful Permanent Resident Status by Region and Selected Country of Last Residence: Fiscal Years 1820 to 2022"), showing the share of persons obtaining lawful permanent resident status ("green cards") by region of origin in two ten-year periods: fiscal years 1960-1969 and fiscal years 2000-2009. In the 1960s, of roughly 3.2 million total immigrants admitted, about 35 percent came from Europe, 11 percent from Asia, 39 percent from Latin America (Mexico, the Caribbean, and Central and South America), and the remaining 15 percent from Canada, Africa, Oceania, and other or unspecified origins. In the 2000s, of roughly 10.3 million total immigrants admitted, about 13 percent came from Europe, 34 percent from Asia, 41 percent from Latin America, and the remaining 12 percent from Canada, Africa, Oceania, and other or unspecified origins. Europe\'s share fell by more than half between the two periods while Asia\'s share roughly tripled and Latin America\'s share became the largest of any region -- indicating a shift in the primary sources of legal immigration from a large European majority toward a plurality from Latin America alongside a substantially larger Asian share.',
  lineNumbered: false,
  wordCount: 206,
};
