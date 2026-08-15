import type { Passage } from '../types';

/**
 * "Join, or Die" — Benjamin Franklin's 1754 political cartoon. APUSH Period-3
 * DBQ document of the VISUAL type. Since Passage is text-only, fullText is a
 * factual description of the image + its caption + attribution (the standard
 * way a visual DBQ document is presented for analysis), not the image itself.
 */
export const PASSAGE_APUSH_JOIN_OR_DIE: Passage = {
  id: 'evelyn.passage.apush-join-or-die.v1',
  title: 'Join, or Die (political cartoon)',
  author: 'Benjamin Franklin, Pennsylvania Gazette',
  year: 1754,
  sourceUrl: 'https://www.loc.gov/item/2002695523/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL DOCUMENT — description] A woodcut political cartoon first published by Benjamin Franklin in the Pennsylvania Gazette on May 9, 1754. It depicts a snake cut into eight segments, each labeled with the initials of a British American colony or region from head to tail: "N.E." (New England), "N.Y.", "N.J.", "P." (Pennsylvania), "M." (Maryland), "V." (Virginia), "N.C." (North Carolina), and "S.C." (South Carolina). Beneath the divided snake runs the caption in bold capitals: "JOIN, or DIE." The image drew on a popular belief that a severed snake would come back to life if its pieces were rejoined before sunset. Franklin published it during the French and Indian War to urge the separate colonies to unite for their common defense; it was revived as a symbol of colonial unity during the imperial crisis of the 1760s and 1770s.',
  lineNumbered: false,
  wordCount: 137,
};
