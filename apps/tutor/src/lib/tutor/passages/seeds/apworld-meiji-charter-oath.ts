import type { Passage } from '../types';

/**
 * The Charter Oath (Gokajō no Goseimon), promulgated by the Meiji Emperor,
 * 6 April 1868 (Griffis renders the date April 17, 1869 by an old-style/
 * transcription slip in his text; the Oath itself was issued in 1868).
 * Verbatim public-domain English rendering of the five articles from William
 * Elliot Griffis, The Mikado's Empire (13th ed., 1903; 1st ed. 1876), as
 * digitized by Project Gutenberg (ebook #29798) — Griffis was a
 * contemporary American educator resident in Japan (1870-74) and his
 * rendering is the standard 19th-century English translation reproduced in
 * subsequent scholarship. AP World Unit-6 document: the new Meiji
 * government's five-article statement of principle, issued months after the
 * fall of the Tokugawa shogunate, promising deliberative government by
 * public discussion and the pursuit of knowledge "throughout the world" —
 * the charter for Japan's program of selective, state-directed
 * modernization.
 */
export const PASSAGE_APWORLD_MEIJI_CHARTER_OATH: Passage = {
  id: 'evelyn.passage.apworld-meiji-charter-oath.v1',
  title: 'The Charter Oath (1868)',
  author: 'Emperor Meiji (Griffis translation)',
  year: 1868,
  sourceUrl: 'https://www.gutenberg.org/ebooks/29798',
  license: 'public-domain',
  genre: 'document',
  fullText:
    '1. A deliberative assembly shall be formed, and all measures decided by public opinion.\n\n2. The principles of social and political economics should be diligently studied by both the superior and inferior classes of our people.\n\n3. Every one in the community shall be assisted to persevere in carrying out his will for all good purposes.\n\n4. All the absurd usages of former times should be disregarded, and the impartiality and justice displayed in the workings of nature be adopted as the basis of action.\n\n5. Wisdom and ability should be sought after in all quarters of the world for the purpose of firmly establishing the foundations of the empire.',
  lineNumbered: true,
  wordCount: 110,
};
