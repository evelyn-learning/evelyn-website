import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-6: Indian indentured emigration by destination colony under the
 * British indenture system, 1834-1917. All six per-colony figures are REAL
 * published totals, verified against the "Indian indentured labour importing
 * colonies" table (en.wikipedia.org/wiki/Indian_indenture_system, "Legacy and
 * cultural impact" section), which compiles the standard scholarly counts
 * for Indian indenture: Hugh Tinker, A New System of Slavery: The Export of
 * Indian Labour Overseas 1830-1920 (Oxford UP, 1974); David Northrup,
 * Indentured Labor in the Age of Imperialism, 1834-1920 (Cambridge UP, 1995);
 * Walter Look Lai, Indentured Labor, Caribbean Sugar: Chinese and Indian
 * Migrants to the British West Indies, 1838-1918 (Johns Hopkins UP, 2004).
 * The combined total (1,089,129) and both percentage comparisons are
 * arithmetic on the cited figures, checked while authoring. This total
 * covers only the six major destinations named below; it deliberately
 * excludes the smaller, separately tabulated indenture streams to Malaya,
 * the Seychelles, East Africa, and minor Caribbean colonies, so it should
 * not be read as "the" grand total of all Indian indentured emigration
 * (estimates for that broader figure vary across the historiography).
 * Text-only passage, so fullText is a factual DESCRIPTION of the table (how
 * a data-table document is presented for analysis), not the table itself —
 * mirrors apgov-federal-grants-table.ts.
 */
export const PASSAGE_APWORLD_INDENTURE_TABLE: Passage = {
  id: 'evelyn.passage.apworld-indenture-table.v1',
  title: 'Indian Indentured Emigration by Destination (data table, 1834–1917)',
  author: 'Compiled from British colonial emigration records',
  year: 1917,
  sourceUrl: 'https://en.wikipedia.org/wiki/Indian_indenture_system',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table showing the number of Indian indentured laborers (a headcount of departures under indenture contracts, not net migration — some workers later returned to India under return-passage provisions) transported to six British colonies, for the period 1834 (the year after the abolition of slavery in the British Empire) to 1917 (the year Britain ended indenture recruitment). The figures: British Mauritius, 453,063; British Guiana, 238,909; Trinidad and Tobago, 147,596; British Jamaica, 36,412; Colony of Natal (South Africa), 152,184; Colony of Fiji, 60,965. These six destinations together received 1,089,129 Indian indentured laborers. Mauritius and British Guiana together account for roughly 64 percent of that combined total, reflecting how early and how large-scale recruitment to the sugar colonies of the Indian Ocean and the Caribbean was; Natal received about 34 percent as many workers as Mauritius, and Fiji, where indenture began only in 1879, about 13 percent as many. Smaller, separately tabulated indenture streams to Malaya, the Seychelles, East Africa, and several minor Caribbean colonies are not included in this total.',
  lineNumbered: false,
  wordCount: 174,
};
