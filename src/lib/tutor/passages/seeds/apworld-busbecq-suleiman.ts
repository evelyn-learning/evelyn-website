import type { Passage } from '../types';

/**
 * Ogier Ghiselin de Busbecq, Turkish Letters (First Letter, dated Vienna,
 * September 1, 1555; C. T. Forster & F. H. Blackburne Daniell's 1881 PD
 * translation, The Life and Letters of Ogier Ghiselin de Busbecq, Vol. I,
 * Clarendon Press). AP World Unit-3 document on merit-based advancement at
 * the Ottoman court of Suleiman the Magnificent: Busbecq, the Habsburg
 * ambassador, describes the Sultan's guard assembly and generalizes to the
 * Ottoman promotion system, where office is earned through service rather
 * than inherited through birth ("No distinction is attached to birth among
 * the Turks"). Verbatim public-domain excerpt, a single contiguous span
 * (~196 words, trimmed with a trailing ellipsis before the passage's closing
 * philosophical aside on whether ability is hereditary), fetched from the
 * archive.org fulltext of the 1881 Forster & Daniell translation (identifier
 * lifelettbusbecq01forsuoft), pp. 154-155. Verified as a contiguous substring
 * of the fetched source after disclosed OCR normalization only: djvu
 * line-wrap de-hyphenation ("dis-\ncharges" -> "discharges", "herds-\nmen" ->
 * "herdsmen") and one corrected letter-recognition error ("pardy" -> "partly",
 * a scanned t/d confusion; not reproduced here since the corrected word falls
 * just past this excerpt's cut point). No wording was altered.
 */
export const PASSAGE_APWORLD_BUSBECQ_SULEIMAN: Passage = {
  id: 'evelyn.passage.apworld-busbecq-suleiman.v1',
  title: 'Turkish Letters — Merit and Promotion at the Court of Suleiman the Magnificent',
  author: 'Ogier Ghiselin de Busbecq (Forster & Daniell translation)',
  year: 1555,
  sourceUrl: 'https://archive.org/details/lifelettbusbecq01forsuoft',
  license: 'public-domain',
  genre: 'letter',
  fullText:
    'No distinction is attached to birth among the Turks; the deference to be paid to a man is measured by the position he holds in the public service. There is no fighting for precedence; a man\'s place is marked out by the duties he discharges. In making his appointments the Sultan pays no regard to any pretensions on the score of wealth or rank, nor does he take into consideration recommendations or popularity; he considers each case on its own merits, and examines carefully into the character, ability, and disposition of the man whose promotion is in question. It is by merit that men rise in the service, a system which ensures that posts should only be assigned to the competent. Each man in Turkey carries in his own hand his ancestry and his position in life, which he may make or mar as he will. Those who receive the highest offices from the Sultan are for the most part the sons of shepherds or herdsmen, and so far from being ashamed of their parentage, they actually glory in it, and consider it a matter of boasting that they owe nothing to the accident of birth …',
  lineNumbered: true,
  wordCount: 196,
};
