import type { Passage } from '../types';

/**
 * Richard Hakluyt (the younger), "A Discourse Concerning Western Planting"
 * (1584), an unpublished manuscript memorandum urging English colonization
 * of North America. APUSH Period-1 DBQ document — Hakluyt's argument that
 * English colonies would employ the realm's "idle men" who might otherwise
 * become vagrants or criminals, framed against how Spain and Portugal's own
 * overseas discoveries had already absorbed their surplus population.
 * Verbatim public-domain excerpt from "A Discourse Concerning Western
 * Planting", ed. Charles Deane (Maine Historical Society Collections,
 * 2nd ser., vol. 2, 1877), Chapter IV — sourced from the Google Books scan
 * hosted at archive.org (identifier adiscourseconce00deangoog). One
 * contiguous span with a short internal elision (marked by an ellipsis)
 * around a stray transcription mark in the scan; verified as a contiguous
 * substring of the fetched source (line-wrap hyphenation and italics/markup
 * normalized). Independently cross-checked word-for-word against a second,
 * separately-OCR'd scan of the same manuscript (Hakluyt Society reprint,
 * archive.org identifier discourseonweste02hakl_0) to confirm no OCR
 * substitution errors survive in the quoted span.
 */
export const PASSAGE_APUSH_HAKLUYT_WESTERN_PLANTING: Passage = {
  id: 'evelyn.passage.apush-hakluyt-western-planting.v1',
  title: 'A Discourse Concerning Western Planting',
  author: 'Richard Hakluyt (the younger)',
  year: 1584,
  sourceUrl: 'https://archive.org/details/adiscourseconce00deangoog',
  license: 'public-domain',
  genre: 'document',
  fullText:
    '… bothe which realmes, beinge of themselves poore and barren and hardly able to susteine their inhabitaunts, by their discoveries have founde suche occasion of employmente, that these many yeres we have not herde scarcely of any pirate of those twoo nations; whereas wee and the Frenche are moste infamous for our outeragious, common, and daily piracies. Againe, when hearde wee almoste of one theefe amongest them? The reason is, that by these, their newe discoveries, they have so many honest wayes to set them on worke, as they rather wante men then meanes to ymploye them. But wee, for all the statutes that hitherto can be devised, and the sharpe execution of the same in poonishinge idle and lazye persons … for wante of sufficient occasion of honest employmente, cannot deliver our commonwealthe from multitudes of loyterers and idle vagabondes.',
  lineNumbered: true,
  wordCount: 139,
};
