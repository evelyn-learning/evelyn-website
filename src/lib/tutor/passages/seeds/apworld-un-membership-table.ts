import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-8: growth in United Nations membership, 1945-2000, from the UN's
 * own published membership-growth roster (un.org, "Growth in United Nations
 * Membership"). All decade-snapshot totals are the REAL published figures,
 * verified against that roster: 51 original members (1945) -> 76 (1955) ->
 * 99 (1960) -> 127 (1970) -> 154 (1980) -> 159 (1990) -> 189 (2000) -
 * monotonic growth across every interval shown. The single largest one-year
 * jump in the span (82 -> 99 members, +17, in 1960) is cited with its
 * verified regional breakdown: 16 of the 17 states admitted that year were
 * newly independent African states (Cameroun, the Central African Republic,
 * Chad, the two Congos, Dahomey, Gabon, Ivory Coast, the Malagasy Republic,
 * Mali, Niger, Nigeria, Senegal, Somalia, Togo, and Upper Volta), the only
 * exception being Cyprus. Text-only passage, so fullText is a factual
 * DESCRIPTION of the table (how a data-table document is presented for
 * analysis), not the table itself - mirrors the visual-document pattern
 * used for described images.
 */
export const PASSAGE_APWORLD_UN_MEMBERSHIP_TABLE: Passage = {
  id: 'evelyn.passage.apworld-un-membership-table.v1',
  title: 'Growth in United Nations Membership (data table, 1945–2000)',
  author: 'United Nations',
  year: 2026,
  sourceUrl: 'https://www.un.org/en/about-us/growth-in-un-membership',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the United Nations\' own published roster, "Growth in United Nations Membership," showing the total number of UN member states at seven points between the Organization\'s founding and the year 2000: 1945 — 51 members (the original signatories); 1955 — 76; 1960 — 99; 1970 — 127; 1980 — 154; 1990 — 159; and 2000 — 189. Total membership rises at every interval shown, nearly quadrupling over the 55-year span. The largest single-year increase in this period came in 1960, when membership jumped from 82 to 99 — 17 new states admitted in one year. Of those 17, 16 were newly independent African states admitted as decolonization accelerated (Cameroun, the Central African Republic, Chad, the Republic of the Congo, the Democratic Republic of the Congo, Dahomey, Gabon, Ivory Coast, the Malagasy Republic, Mali, Niger, Nigeria, Senegal, Somalia, Togo, and Upper Volta); the seventeenth, Cyprus, was the only non-African admission that year. African states supplied most of the new members admitted through the 1960s, as European colonial territories achieved independence and joined the Organization in the years following its founding membership of 51 in 1945.',
  lineNumbered: false,
  wordCount: 192,
};
