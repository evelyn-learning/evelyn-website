import type { Passage } from '../types';

/**
 * François Bernier, "Letter to Monseigneur Colbert, Concerning Hindoustan"
 * (in Travels in the Mogul Empire, A.D. 1656-1668; Irving Brock's
 * translation as revised by Archibald Constable, 1891, Archibald
 * Constable & Co., Westminster). AP World Unit-3 document on Mughal
 * administration under Aurangzeb: the crown's legal claim to inherit the
 * property of its Omrahs (nobles) and Mansebdars (lesser office-holders),
 * and to own "every acre of land in the kingdom," followed by Bernier's
 * conclusion that this makes the Great Mogol the recipient of an immense
 * revenue and "incalculable wealth." Verbatim public-domain excerpt, two
 * contiguous spans joined with an ellipsis marking a page turn (two
 * footnotes on Bahrein/Tuticorin, and an intervening paragraph on the
 * balance of trade in gold and silver, fall between them and were elided
 * rather than quoted). Fetched from the archive.org fulltext of the 1891
 * Constable-revised edition (identifier pli.kerala.rare.00637), pp. 204-205.
 * Verified as a contiguous substring of the fetched source after disclosed
 * OCR normalization only: de-hyphenation across a line-wrap using the
 * scan's "¬" hyphen glyph ("except¬\ning" -> "excepting"), a stray OCR
 * punctuation mark after "sometimes" dropped, and two letter-recognition
 * errors corrected ("Hindouslan" -> "Hindoustan", "he destitute" -> "be
 * destitute"), cross-checked against the parallel archive.org OCR of the
 * same 1891 edition (identifier travelsinmogule00berngoog), which renders
 * both words unambiguously. No wording was altered.
 */
export const PASSAGE_APWORLD_BERNIER_MUGHAL: Passage = {
  id: 'evelyn.passage.apworld-bernier-mughal.v1',
  title: "Travels in the Mogul Empire — The Crown's Ownership of the Land",
  author: 'François Bernier (Irving Brock translation, rev. Archibald Constable)',
  year: 1668,
  sourceUrl: 'https://archive.org/details/pli.kerala.rare.00637',
  license: 'public-domain',
  genre: 'letter',
  fullText:
    'It should also be borne in mind, that the Great Mogol constitutes himself heir of all the Omrahs, or lords, and likewise of the Mansebdars, or inferior lords, who are in his pay; and, what is of the utmost importance, that he is proprietor of every acre of land in the kingdom, excepting, perhaps, some houses and gardens which he sometimes permits his subjects to buy, sell, and otherwise dispose of, among themselves.\n\n' +
    '… I think I have shown that the precious metals must abound in Hindoustan, although the country be destitute of mines; and that the Great Mogol, lord and master of the greater part, must necessarily be in the receipt of an immense revenue, and possess incalculable wealth.',
  lineNumbered: true,
  wordCount: 119,
};
