import type { Passage } from '../types';

/**
 * Christopher Columbus, letter to Luis de Santángel (1493), announcing the
 * first voyage. APUSH Period-1 DBQ document — Columbus's own framing of the
 * islands' abundance and the character of the people he encountered.
 * Verbatim public-domain excerpt, R.H. Major's translation (Hakluyt Society,
 * 1870; reprinted in "Select Letters of Christopher Columbus", Project
 * Gutenberg #77820). Two contiguous spans from the letter, joined with an
 * ellipsis: (1) Columbus's description of Española's fertility, harbours,
 * and rivers; (2) his description of the islanders as guileless and freely
 * generous once their fear had passed. Each span verified as a contiguous
 * substring of the fetched Gutenberg text (whitespace/italics-markup
 * normalized).
 */
export const PASSAGE_APUSH_COLUMBUS_LETTER: Passage = {
  id: 'evelyn.passage.apush-columbus-letter.v1',
  title: 'Letter to Luis de Santángel',
  author: 'Christopher Columbus',
  year: 1493,
  sourceUrl: 'https://www.gutenberg.org/ebooks/77820',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Española is a wonder. Its mountains and plains, and meadows, and fields, are so beautiful and rich for planting and sowing, and rearing cattle of all kinds, and for building towns and villages. The harbours on the coast, and the number and size and wholesomeness of the rivers, most of them bearing gold, surpass anything that would be believed by one who had not seen them.\n\n' +
    '… It is true that when they are reassured and have thrown off this fear, they are guileless, and so liberal of all they have that no one would believe it who had not seen it. They never refuse anything that they possess when it is asked of them; on the contrary, they offer it themselves, and they exhibit so much loving kindness that they would even give their hearts; and, whether it be something of value or of little worth that is offered to them, they are satisfied.',
  lineNumbered: true,
  wordCount: 154,
};
