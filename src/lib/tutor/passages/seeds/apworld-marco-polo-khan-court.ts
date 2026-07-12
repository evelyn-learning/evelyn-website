import type { Passage } from '../types';

/**
 * Marco Polo, The Travels (Yule-Cordier trans., unabridged 3rd ed. 1903,
 * revised by Henri Cordier), Book Second, ch. X, "Concerning the Palace of
 * the Great Kaan" — the Cambaluc palace of Kublai Khan. AP World Unit-1 DBQ
 * document — an outside observer's account of the scale and splendor of
 * Yuan imperial rule, distinct from the already-seeded Marco Polo excerpts
 * on the city of Kinsay (`apworld-marco-polo-kinsay`), the Great Kaan's
 * post-houses (`apworld-marco-polo-yam`), and paper money
 * (`apworld-marco-polo-paper-money`), all of which are drawn from other
 * chapters. Verbatim public-domain excerpt (Yule-Cordier translation),
 * fetched from the Project Gutenberg plain-text edition of Vol. I
 * (ebook #10636, the same volume cited by the yam/paper-money seeds).
 * Verified as a contiguous substring of the fetched source (footnote
 * reference markers, e.g. "{9}", stripped as non-prose apparatus;
 * whitespace normalized).
 */
export const PASSAGE_APWORLD_MARCO_POLO_KHAN_COURT: Passage = {
  id: 'evelyn.passage.apworld-marco-polo-khan-court.v1',
  title: 'The Travels of Marco Polo — the Palace of the Great Kaan',
  author: 'Marco Polo (Yule-Cordier translation)',
  year: 1300,
  sourceUrl: 'https://www.gutenberg.org/ebooks/10636',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'The Hall of the Palace is so large that it could easily dine 6000 people; and it is quite a marvel to see how many rooms there are besides. The building is altogether so vast, so rich, and so beautiful, that no man on earth could design anything superior to it. The outside of the roof also is all coloured with vermilion and yellow and green and blue and other hues, which are fixed with a varnish so fine and exquisite that they shine like crystal, and lend a resplendent lustre to the Palace as seen for a great way round. This roof is made too with such strength and solidity that it is fit to last for ever.',
  lineNumbered: true,
  wordCount: 119,
};
