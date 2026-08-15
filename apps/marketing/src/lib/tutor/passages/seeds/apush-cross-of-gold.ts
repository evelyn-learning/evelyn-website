import type { Passage } from '../types';

/**
 * William Jennings Bryan, "Cross of Gold" speech, closing debate on the
 * money plank at the Democratic National Convention, Chicago, July 9,
 * 1896. APUSH Period-6 document — the speech's famous closing lines.
 * Verbatim public-domain excerpt: the opening sentence of the penultimate
 * paragraph ("My friends, we declare...") plus the closing sentences of the
 * final paragraph (the "crown of thorns"/"cross of gold" lines), with the
 * intervening material (about 150 words restating the free-silver argument)
 * elided and marked by an ellipsis; each side verified as a contiguous span
 * of the source.
 * Transcribed from Wikisource.
 */
export const PASSAGE_APUSH_CROSS_OF_GOLD: Passage = {
  id: 'evelyn.passage.apush-cross-of-gold.v1',
  title: 'Cross of Gold Speech',
  author: 'William Jennings Bryan',
  year: 1896,
  sourceUrl: 'https://en.wikisource.org/wiki/Cross_of_Gold_Speech',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'My friends, we declare that this nation is able to legislate for its own people on every question, without waiting for the aid or consent of any other nation on earth; and upon that issue we expect to carry every State in the Union. ... Having behind us the producing masses of this nation and the world, supported by the commercial interests, the laboring interests, and the toilers everywhere, we will answer their demand for a gold standard by saying to them: You shall not press down upon the brow of labor this crown of thorns, you shall not crucify mankind upon a cross of gold.',
  lineNumbered: true,
  wordCount: 105,
};
