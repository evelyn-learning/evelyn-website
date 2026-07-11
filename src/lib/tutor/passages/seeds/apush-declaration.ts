import type { Passage } from '../types';

/**
 * The Declaration of Independence (1776), drafted by Thomas Jefferson. APUSH
 * Period-3 DBQ document — natural rights, consent of the governed, the
 * justification for separation. Verbatim public-domain excerpt (preamble).
 */
export const PASSAGE_APUSH_DECLARATION: Passage = {
  id: 'evelyn.passage.apush-declaration.v1',
  title: 'The Declaration of Independence',
  author: 'Thomas Jefferson (Second Continental Congress)',
  year: 1776,
  sourceUrl: 'https://www.archives.gov/founding-docs/declaration-transcript',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature’s God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.\n\n' +
    'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.—That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed.',
  lineNumbered: true,
  wordCount: 125,
};
