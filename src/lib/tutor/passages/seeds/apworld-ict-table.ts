import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * World Unit-9: global mobile-cellular subscriptions and Internet use, from
 * the International Telecommunication Union's World Telecommunication/ICT
 * Indicators Database. Mobile-cellular subscription totals are REAL ITU
 * figures verified against the ITU-sourced World Bank series (indicator
 * IT.CEL.SETS, sourceOrganization "International Telecommunication Union
 * (ITU)"): 1990 - 11.2 million; 2010 - 5.29 billion; 2020 - 8.26 billion. The
 * 2000 figure (738 million) is not published as a single World Bank/ITU
 * world aggregate (that series has a gap for 2000-2004) and was verified by
 * summing the 216 country/territory entries for the year-2000 column of
 * ITU's own per-country workbook ("Mobile-cellular telephone subscriptions,
 * 2000-2018," itu.int, Dec. 2019 edition), which totals 738,227,586 -
 * consistent with the commonly cited "~740 million" figure for that year.
 * Internet-use figures are the REAL ITU/World Bank share-of-population
 * series (indicator IT.NET.USER.ZS): 2005 - 15.6%; 2010 - 28.4%; 2015 -
 * 39.9%; 2020 - 60.1%. A single global aggregate for Internet use is not
 * published by ITU/World Bank before 2005, so 2005 (rather than 1990 or
 * 2000) is used as the earliest anchor for that row, honestly noted in the
 * fullText below rather than glossed over. Absolute internet-user counts in
 * parentheses are derived by applying each year's share to that year's UN
 * population estimate (consistent with the ~1.03bn / ~1.99bn / ~2.98bn /
 * ~4.74bn figures independently reported for those years). Text-only
 * passage, so fullText is a factual DESCRIPTION of the table (how a
 * data-table document is presented for analysis), not the table itself -
 * mirrors the visual-document pattern used for described images.
 */
export const PASSAGE_APWORLD_ICT_TABLE: Passage = {
  id: 'evelyn.passage.apworld-ict-table.v1',
  title: 'Global Mobile-Phone and Internet Adoption (data table, 1990–2020)',
  author: 'International Telecommunication Union',
  year: 2026,
  sourceUrl: 'https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table combining two indicators tracked worldwide by the International Telecommunication Union (ITU) — total mobile-cellular telephone subscriptions, and the share of the world\'s population using the Internet. Mobile-cellular subscriptions (worldwide total): 1990 — about 11 million; 2000 — about 738 million; 2010 — about 5.29 billion; 2020 — about 8.26 billion, meaning there were more mobile subscriptions than there were people on Earth, since many users hold more than one SIM card or account. Internet use (share of the world\'s population; 2005 is the earliest year ITU and the World Bank publish a single reliable global figure, so it is used here in place of 1990 or 2000, for which no such global aggregate exists): 2005 — 15.6% of the world\'s population (about 1.0 billion people); 2010 — 28.4% (about 2.0 billion); 2015 — 39.9% (about 3.0 billion); 2020 — 60.1% (about 4.7 billion). Mobile-phone subscriptions grew first and fastest, passing one subscription per person worldwide by the mid-2010s. Internet use grew from a smaller and later-tracked base, crossing the halfway mark of the world\'s population only shortly before 2020. Both technologies show the "leapfrogging" pattern common across much of the Global South, where mobile networks and mobile internet access were adopted directly and rapidly, often without the country first building out extensive fixed telephone lines or fixed broadband infrastructure.',
  lineNumbered: false,
  wordCount: 227,
};
