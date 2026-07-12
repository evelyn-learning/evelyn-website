import type { Passage } from '../types';

/**
 * President Dwight D. Eisenhower's Farewell Radio and Television Address
 * to the American People, January 17, 1961. APUSH Period-8 document —
 * the outgoing President's warning about the "military-industrial
 * complex" that had grown up around Cold War defense spending. Excerpt
 * is the speech's central warning (the new conjunction of a permanent
 * armaments industry and the military, the coining of the term, and the
 * call for an "alert and knowledgeable citizenry"); verbatim
 * public-domain text (U.S. government work, 17 USC §105), verified as a
 * contiguous span against the American Presidency Project's full-text
 * transcript. Cross-checked against the Avalon Project's transcript of
 * the same address, which reproduces the same passage but drops the
 * hyphen in "military-industrial complex" (an OCR/transcription
 * artifact); the hyphenated form here matches the official Public Papers
 * of the Presidents pagination cited by Avalon itself.
 */
export const PASSAGE_APUSH_EISENHOWER_FAREWELL: Passage = {
  id: 'evelyn.passage.apush-eisenhower-farewell.v1',
  title: 'Farewell Radio and Television Address to the American People',
  author: 'Dwight D. Eisenhower',
  year: 1961,
  sourceUrl:
    'https://www.presidency.ucsb.edu/documents/farewell-radio-and-television-address-the-american-people',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'This conjunction of an immense military establishment and a large arms industry is new in the American experience. The total influence-economic, political, even spiritual--is felt in every city, every State house, every office of the Federal government. We recognize the imperative need for this development. Yet we must not fail to comprehend its grave implications. Our toil, resources and livelihood are all involved; so is the very structure of our society.\n\nIn the councils of government, we must guard against the acquisition of unwarranted influence, whether sought or unsought, by the military-industrial complex. The potential for the disastrous rise of misplaced power exists and will persist.\n\nWe must never let the weight of this combination endanger our liberties or democratic processes. We should take nothing for granted. Only an alert and knowledgeable citizenry can compel the proper meshing of the huge industrial and military machinery of defense with our peaceful methods and goals, so that security and liberty may prosper together.',
  lineNumbered: true,
  wordCount: 161,
};
