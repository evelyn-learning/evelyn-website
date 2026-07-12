import type { Passage } from '../types';

/**
 * Ibn Battuta, The Travels of Ibn Batuta (Rev. Samuel Lee's 1829 PD
 * translation for the Oriental Translation Committee, "translated from the
 * abridged Arabic manuscript copies preserved in the Public Library of
 * Cambridge"), on his reception and appointment as qadi (judge) of Delhi at
 * the court of Sultan Muhammad ibn Tughluq, and the historian's summary of
 * the Sultan's character. AP World Unit-1 DBQ document — court ceremony
 * (investiture with robes, a horse, salary, and land-grants) and the
 * generosity/severity of the Delhi Sultanate's ruler. Verbatim
 * public-domain excerpt, fetched from the archive.org fulltext of the 1829
 * Lee translation (identifier b28406084). Two contiguous spans joined with
 * an ellipsis: (1) the investiture ceremony; (2) the Sultan's character.
 * Each span verified as a contiguous substring of the fetched source
 * (djvu-OCR line-wrap hyphenation, running page headers "HINDUSTAN.", and
 * standalone page numbers stripped before comparison; whitespace
 * normalized). The paragraph on the ceremony for other travellers appointed
 * alongside Ibn Battuta, and the transitional sentence introducing the
 * Sultan, fall between the two spans and were elided rather than quoted.
 */
export const PASSAGE_APWORLD_IBN_BATTUTA_DELHI: Passage = {
  id: 'evelyn.passage.apworld-ibn-battuta-delhi.v1',
  title: 'The Travels of Ibn Battuta — At the Delhi Court of Sultan Muhammad ibn Tughluq',
  author: 'Ibn Battuta (Samuel Lee translation)',
  year: 1829,
  sourceUrl: 'https://archive.org/details/b28406084',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'On the third day after our arrival, each of the travellers presented himself at the gate of the palace; when the Emperor sent to inquire, whether there were any among us who wished to take office, either as a writer, a judge, or a magistrate; saying, that he would give such appointments. Each, of course, gave an answer suitable to his wishes. For my own part, I answered, I have no desire either for rule or writership; but the office both of judge and of magistrate, myself and my fathers have filled. These replies were carried to the Emperor, who commanded each person to be brought before him, and he then gave him such appointment as would suit him; bestowing on him, at the same time, a dress of honour, and a horse furnished with an ornamented saddle. He also gave him money, appointing likewise the amount of his salary, which was to be drawn from the treasury.\n\n' +
    '… This Emperor was one of the most bountiful and splendidly munificent men (where he took); but in other cases, one of the most impetuous and inexorable: and very seldom indeed did it happen, that pardon followed his anger.',
  lineNumbered: true,
  wordCount: 196,
};
