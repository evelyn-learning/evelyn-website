import type { Passage } from '../types';

/**
 * Andrew Carnegie, "Wealth" (North American Review, June 1889). APUSH
 * Period-6 document — the "gospel of wealth" passage stating the duty of
 * the man of wealth to administer his surplus as a trust fund for the
 * community, rather than the essay's earlier defense of the widening gap
 * between rich and poor. Verbatim public-domain excerpt, a single
 * contiguous paragraph (crosses an original page break between pp. 661-662
 * of the North American Review with no text omitted), transcribed from the
 * scanned original at Wikisource. Note: attribute to this excerpt only the
 * "duty/trustee" argument it contains — do not attribute Social Darwinist
 * claims (found in the essay's earlier, unseeded paragraphs) to this
 * document.
 */
export const PASSAGE_APUSH_CARNEGIE_WEALTH: Passage = {
  id: 'evelyn.passage.apush-carnegie-wealth.v1',
  title: 'Wealth',
  author: 'Andrew Carnegie',
  year: 1889,
  sourceUrl: 'https://en.wikisource.org/wiki/North_American_Review/Volume_148/Issue_391/Wealth',
  license: 'public-domain',
  genre: 'essay',
  fullText:
    'This, then, is held to be the duty of the man of Wealth: First, to set an example of modest, unostentatious living, shunning display or extravagance; to provide moderately for the legitimate wants of those dependent upon him; and after doing so to consider all surplus revenues which come to him simply as trust funds, which he is called upon to administer, and strictly bound as a matter of duty to administer in the manner which, in his judgment, is best calculated to produce the most beneficial results for the community—the man of wealth thus becoming the mere agent and trustee for his poorer brethren, bringing to their service his superior wisdom, experience, and ability to administer, doing for them better than they would or could do for themselves.',
  lineNumbered: true,
  wordCount: 129,
};
