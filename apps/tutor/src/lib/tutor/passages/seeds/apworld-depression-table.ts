import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-7: three real, published Great Depression indicators showing
 * its transmission from the United States into a global crisis, 1929-1934.
 * All three figures are checked against named sources: (1) the collapse of
 * world trade to roughly one-third of its 1929 value by 1933 (a decline of
 * about two-thirds, commonly cited from League of Nations trade statistics
 * of the period and summarized at en.wikipedia.org/wiki/Great_Depression,
 * "World Trade Decline"); (2) the US unemployment rate reaching 24.9% in
 * 1933 (the Bureau of Labor Statistics' historical reconstruction of
 * pre-1940 unemployment, the standard series used by US economic
 * historians, also summarized at en.wikipedia.org/wiki/Great_Depression);
 * (3) German unemployment reaching roughly 30% (about 5.3-6 million
 * workers) by 1932, per en.wikipedia.org/wiki/Great_Depression_in_Germany,
 * citing Hans-Ulrich Wehler, Deutsche Gesellschaftsgeschichte 1914-1949
 * (Munich: C.H. Beck, 2003), p. 261. Units are stated for each figure
 * (percentage of pre-crisis trade value; percentage of civilian labor
 * force) so the three are not conflated. Text-only passage, so fullText is
 * a factual DESCRIPTION of the table (how a data-table document is
 * presented for analysis), not the table itself — mirrors
 * apgov-federal-grants-table.ts / apworld-indenture-table.ts.
 */
export const PASSAGE_APWORLD_DEPRESSION_TABLE: Passage = {
  id: 'evelyn.passage.apworld-depression-table.v1',
  title: 'Great Depression Indicators, 1929-1934 (data table)',
  author: 'Compiled from League of Nations and national labor-statistics records',
  year: 1933,
  sourceUrl: 'https://en.wikipedia.org/wiki/Great_Depression',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table showing three published indicators of the Great Depression\'s spread beyond the United States, 1929-1934. Row one: the gold value of world trade fell by roughly 66 percent between 1929 and 1934, to about one-third of its 1929 level, reflecting collapsing prices for globally traded commodities (rubber, coffee, copper, wheat) on which many colonial and Latin American economies depended for export earnings, not merely a decline in industrial-country demand. Row two: the United States unemployment rate, expressed as a percentage of the civilian labor force, rose from about 3 percent in 1929 to 24.9 percent in 1933, the depression\'s trough year in the United States. Row three: the German unemployment rate, on the same civilian-labor-force basis, rose to about 30 percent by 1932 (roughly 5.3 to 6 million workers), a rate that exceeded the American figure and reflected Germany\'s particular exposure to the withdrawal of short-term American loans after 1929. Read together, the three rows show a single US-centered credit contraction transmitted worldwide through trade and finance, producing comparable mass unemployment in the world\'s two leading industrial economies within three to five years.',
  lineNumbered: false,
  wordCount: 189,
};
