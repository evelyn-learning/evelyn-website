import type { Passage } from '../types';

/**
 * James Madison, "Federalist No. 51" (1788). AP Gov Unit-1 core document —
 * the separation-of-powers / checks-and-balances argument. First paragraph
 * covers "ambition must be made to counteract ambition" and "if men were
 * angels, no government would be necessary"; second paragraph is the
 * double-security-of-federalism argument ("the power surrendered by the
 * people is first divided between two distinct governments... subdivided
 * among distinct and separate departments"). Trimmed with internal ellipses
 * to stay within excerpt length; verbatim public-domain text otherwise.
 */
export const PASSAGE_APGOV_FEDERALIST_51: Passage = {
  id: 'evelyn.passage.apgov-federalist-51.v1',
  title: 'Federalist No. 51',
  author: 'James Madison (Publius)',
  year: 1788,
  sourceUrl: 'https://en.wikisource.org/wiki/The_Federalist_Papers/No._51',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'But the great security against a gradual concentration of the several powers in the same department, consists in giving to those who administer each department the necessary constitutional means, and personal motives, to resist encroachments of the others. ... Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place. ... If men were angels, no Government would be necessary. If angels were to govern men, neither external nor internal controls on Government would be necessary.\n\nFirst. In a single republic, all the power surrendered by the People is submitted to the administration of a single Government; and the usurpations are guarded against, by a division of the Government into distinct and separate departments. In the compound republic of America, the power surrendered by the People is first divided between two distinct Governments, and then the portion allotted to each, subdivided among distinct and separate departments. Hence a double security arises to the rights of the People. The different Governments will control each other, at the same time that each will be controlled by itself.',
  lineNumbered: true,
  wordCount: 184,
};
