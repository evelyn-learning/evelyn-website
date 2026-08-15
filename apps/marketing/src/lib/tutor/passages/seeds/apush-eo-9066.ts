import type { Passage } from '../types';

/**
 * Executive Order 9066 (February 19, 1942), authorizing the Secretary of
 * War to prescribe military areas. APUSH Period-7 document — the order's
 * operative authorization text only (excludes the National Archives'
 * background/history essay that surrounds the transcript on its host
 * page). US-government work (17 USC §105); public domain regardless of
 * date. Verbatim excerpt, a single contiguous span, transcribed from the
 * National Archives milestone-documents transcript. Historical context,
 * presented factually and without embellishment: military commanders
 * used this authority to exclude and forcibly relocate roughly 120,000
 * Japanese Americans — the majority US citizens — from West Coast
 * military areas into inland incarceration ("relocation") centers; the
 * order's constitutionality was upheld by the Supreme Court in Korematsu
 * v. United States (1944) and the incarceration was later acknowledged as
 * an injustice by the Civil Liberties Act of 1988. Attribute to this
 * excerpt only the authorization language it contains; the internment
 * program's implementation and Korematsu are the student's own outside
 * evidence, not this document's text.
 */
export const PASSAGE_APUSH_EO_9066: Passage = {
  id: 'evelyn.passage.apush-eo-9066.v1',
  title: 'Executive Order 9066',
  author: 'Franklin D. Roosevelt',
  year: 1942,
  sourceUrl: 'https://www.archives.gov/milestone-documents/executive-order-9066',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Now, therefore, by virtue of the authority vested in me as President of the United States, and Commander in Chief of the Army and Navy, I hereby authorize and direct the Secretary of War, and the Military Commanders whom he may from time to time designate, whenever he or any designated Commander deems such action necessary or desirable, to prescribe military areas in such places and of such extent as he or the appropriate Military Commander may determine, from which any or all persons may be excluded, and with respect to which, the right of any person to enter, remain in, or leave shall be subject to whatever restrictions the Secretary of War or the appropriate Military Commander may impose in his discretion.',
  lineNumbered: true,
  wordCount: 123,
};
