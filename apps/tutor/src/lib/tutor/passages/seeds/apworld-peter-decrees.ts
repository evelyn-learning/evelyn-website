import type { Passage } from '../types';

/**
 * Jean Rousset de Missy, Life of Peter the Great (c. 1725), on Peter I's
 * westernization decrees on beards and dress (c. 1698-1705), as printed
 * in James Harvey Robinson, ed., Readings in European History, Vol. II
 * (Ginn and Co., 1904-1906), pp. 303-312 — the Internet History
 * Sourcebooks Project's Modern History Sourcebook page on Peter the Great
 * (Fordham University). No raw text of Peter's original ukases survives at
 * this Fordham page; this contemporary narrative account of the beard tax
 * and the compulsory-Western-dress ordinance is the actual document
 * Fordham hosts under this topic, and is itself PD (translated/anthologized
 * pre-1929). AP World Unit-3 document on Peter's compulsion of the Russian
 * nobility and townspeople toward European dress and shaving as an
 * instrument of state control. Verbatim public-domain excerpt, two
 * contiguous spans joined with an ellipsis (an intervening paragraph on
 * priests' pamphlets against the beard tax and old Russians saving their
 * shaved beards for their coffins falls between the beard and dress
 * passages, and was elided rather than quoted). Fetched from the raw HTML
 * of sourcebooks.fordham.edu/mod/petergreat.asp; no OCR involved (born-
 * digital sourcebook text), only whitespace normalization. No wording was
 * altered. The editorial bracket "[i.e., the nobles]" glossing "boyars" is
 * the sourcebook's own insertion, reproduced as printed.
 *
 * DATE: c. 1725, approximate. Rousset de Missy (1686-1762) published his
 * Mémoires du règne de Pierre le Grand (under the pseudonym "Iwan
 * Nestesuranoi") in 1725-26, around Peter's death in 1725; 1701 (once used
 * here) is the period of the decrees he narrates, not when he wrote. Exact
 * edition behind Robinson's translation is not verified, hence "c.".
 */
export const PASSAGE_APWORLD_PETER_DECREES: Passage = {
  id: 'evelyn.passage.apworld-peter-decrees.v1',
  title: "Life of Peter the Great — The Reform of Beards and Dress",
  author: 'Jean Rousset de Missy (Robinson translation)',
  year: 1725,
  yearApproximate: true,
  sourceUrl: 'https://sourcebooks.fordham.edu/mod/petergreat.asp',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'The tsar labored at the reform of fashions, or, more properly speaking, of dress. Until that time the Russians had always worn long beards, which they cherished and preserved with much care, allowing them to hang down on their bosoms, without even cutting the moustache. With these long beards they wore the hair very short, except the ecclesiastics, who, to distinguish themselves, wore it very long. The tsar, in order to reform that custom, ordered that gentlemen, merchants, and other subjects, except priests and peasants, should each pay a tax of one hundred rubles a year if they wished to keep their beards; the commoners had to pay one kopek each.\n\n' +
    '… From the reform in beards we may pass to that of clothes. Their garments, like those of the Orientals, were very long, reaching to the heel. The tsar issued an ordinance abolishing that costume, commanding all the boyars [i.e., the nobles] and all those who had positions at court to dress after the French fashion, and likewise to adorn their clothes with gold or silver according to their means.',
  lineNumbered: true,
  wordCount: 180,
};
