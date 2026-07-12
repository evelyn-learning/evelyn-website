import type { Passage } from '../types';

/**
 * President Lyndon B. Johnson's commencement remarks at the University of
 * Michigan, Ann Arbor, May 22, 1964. APUSH Period-8 document — the
 * speech in which LBJ first laid out the vision of "the Great Society."
 * Excerpt is the vision statement itself (abundance and liberty for all,
 * ending poverty and racial injustice, the "place where" definitions)
 * plus the closing "not a safe harbor... challenge constantly renewed"
 * line; a short passage on renewing contact with nature is elided
 * between them (marked with an ellipsis). Verbatim public-domain text
 * (U.S. government work, 17 USC §105), verified as contiguous spans
 * against the American Presidency Project's full-text transcript and
 * cross-checked identical against the LBJ Presidential Library's (NARA)
 * transcript of the same remarks.
 */
export const PASSAGE_APUSH_LBJ_GREAT_SOCIETY: Passage = {
  id: 'evelyn.passage.apush-lbj-great-society.v1',
  title: 'Remarks at the University of Michigan',
  author: 'Lyndon B. Johnson',
  year: 1964,
  sourceUrl: 'https://www.presidency.ucsb.edu/documents/remarks-the-university-michigan',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'The Great Society rests on abundance and liberty for all. It demands an end to poverty and racial injustice, to which we are totally committed in our time. But that is just the beginning.\n\nThe Great Society is a place where every child can find knowledge to enrich his mind and to enlarge his talents. It is a place where leisure is a welcome chance to build and reflect, not a feared cause of boredom and restlessness. It is a place where the city of man serves not only the needs of the body and the demands of commerce but the desire for beauty and the hunger for community.\n\n...\n\nBut most of all, the Great Society is not a safe harbor, a resting place, a final objective, a finished work. It is a challenge constantly renewed, beckoning us toward a destiny where the meaning of our lives matches the marvelous products of our labor.',
  lineNumbered: true,
  wordCount: 154,
};
