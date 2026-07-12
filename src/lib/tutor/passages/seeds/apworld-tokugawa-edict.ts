import type { Passage } from '../types';

/**
 * Tokugawa Iemitsu, "Closed Country Edict of 1635" (the third of the
 * Tokugawa sakoku/seclusion edicts), addressed to the two governors (bugyō)
 * of Nagasaki. AP World Unit-4 document — no Japanese ships/subjects abroad,
 * a ban on Christian teaching, and regulation of foreign trade.
 *
 * Provenance: this is the sole Tokugawa-1635 entry in the Internet History
 * Sourcebooks Project's East Asian History Sourcebook
 * (sourcebooks.fordham.edu/eastasia/eastasiasbook.asp, link text "Closed
 * Country Edict"), which points to a course-reader page ("The Seclusion of
 * Japan," World History, Sara Watts) reproducing the edict text; Fordham's
 * own index also lists an archive.org backup of that page, used here as the
 * stable sourceUrl. Fetched live (curl, 2026-07) from the original
 * http://users.wfu.edu/watts/w03_Japancl.html — still online and identical
 * to the archived copy at fetch time. The page does not itself name a
 * translator. Clauses 1-3 read identically to the (separately, and
 * currently copyrighted) David J. Lu translation in "Japan: A Documentary
 * History" (M. E. Sharpe, 1997, (c) 2001), but clause 4's wording differs
 * ("the teachings of the [Catholic] priests" here vs. Lu's "the teachings
 * of padres (Christianity)"), confirming this is a distinct, unattributed
 * rendering rather than a reproduction of Lu's copyrighted text.
 *
 * Two contiguous spans joined by an ellipsis: (1) clauses 1-4, covering the
 * ban on Japanese going/returning abroad and the order to investigate
 * Christian teaching; (2) clause 9, a trade-regulation clause (no single
 * trading city may monopolize a foreign ship's merchandise). Both spans
 * verified programmatically as contiguous substrings of the fetched page
 * (HTML tags and entities stripped, whitespace normalized; footnote
 * superscript markers on clauses 6-8, which fall in the elided span, are
 * not quoted). Clause numbering is retained as in the source, since the
 * edict is itself a numbered list of provisions.
 */
export const PASSAGE_APWORLD_TOKUGAWA_EDICT: Passage = {
  id: 'evelyn.passage.apworld-tokugawa-edict.v1',
  title: 'Closed Country Edict of 1635',
  author: 'Tokugawa Iemitsu (shogunate edict)',
  year: 1635,
  sourceUrl:
    'https://web.archive.org/web/20230305000400/http://users.wfu.edu/watts/w03_Japancl.html',
  license: 'public-domain',
  genre: 'document',
  fullText:
    '1. Japanese ships are strictly forbidden to leave for foreign countries. 2. No Japanese is permitted to go abroad. If there is anyone who attempts to do so secretly, he must be executed. The ship so involved must be impounded and its owner arrested, and the matter must be reported to the higher authority. 3. If any Japanese returns from overseas after residing there, he must be put to death. 4. If there is any place where the teachings of the [Catholic] priests is practiced, the two of you must order a thorough investigation.\n\n' +
    '… 9. No single trading city shall be permitted to purchase all the merchandise brought by foreign ships.',
  lineNumbered: true,
  wordCount: 112,
};
