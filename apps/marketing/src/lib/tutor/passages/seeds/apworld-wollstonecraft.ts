import type { Passage } from '../types';

/**
 * Mary Wollstonecraft, "A Vindication of the Rights of Woman" (1792), from
 * the discussion of individual vs. national (public) education. AP World
 * Unit-5 content-plan document — the Enlightenment application of natural-
 * rights/reason argument to women's education, the bridge from Locke/
 * Rousseau's social-contract theory to 19th-century feminism (cross-
 * referenced forward to Seneca Falls). Excerpt covers Wollstonecraft's
 * definition of individual education as training a child to "think and
 * reason," then (one paragraph elided, marked) her core claim that virtue
 * can only come from the individual's own exercise of reason, applied
 * against Rousseau's restriction of that claim to men. Verbatim public-
 * domain text, Project Gutenberg #3420 (plain-text edition; the "--" marks
 * are the source file's own em-dash convention, kept verbatim).
 */
export const PASSAGE_APWORLD_WOLLSTONECRAFT: Passage = {
  id: 'evelyn.passage.apworld-wollstonecraft.v1',
  title: 'A Vindication of the Rights of Woman',
  author: 'Mary Wollstonecraft',
  year: 1792,
  sourceUrl: 'https://www.gutenberg.org/ebooks/3420',
  license: 'public-domain',
  genre: 'essay',
  fullText:
    "By individual education, I mean--for the sense of the word is not precisely defined--such an attention to a child as will slowly sharpen the senses, form the temper, regulate the passions, as they begin to ferment, and set the understanding to work before the body arrives at maturity; so that the man may only have to proceed, not to begin, the important task of learning to think and reason.\n\n... Consequently, the most perfect education, in my opinion, is such an exercise of the understanding as is best calculated to strengthen the body and form the heart; or, in other words, to enable the individual to attain such habits of virtue as will render it independent. In fact, it is a farce to call any being virtuous whose virtues do not result from the exercise of its own reason. This was Rousseau's opinion respecting men: I extend it to women, and confidently assert that they have been drawn out of their sphere by false refinement, and not by an endeavour to acquire masculine qualities.",
  lineNumbered: true,
  wordCount: 174,
};
