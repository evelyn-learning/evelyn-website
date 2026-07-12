import type { Passage } from '../types';

/**
 * Chief Justice Earl Warren's opinion of the Court in Brown v. Board of
 * Education, 347 U.S. 483 (1954). AP Gov Unit-3 required Supreme Court
 * case — the foundational statement that state-mandated racial
 * segregation in public schools violates the Fourteenth Amendment's Equal
 * Protection Clause, overturning the "separate but equal" doctrine of
 * Plessy v. Ferguson. Excerpt covers the Court's holding that segregation
 * denies equal educational opportunities, the psychological-harm finding
 * ("generates a feeling of inferiority"), the "separate but equal has no
 * place... inherently unequal" conclusion, and the Fourteenth-Amendment
 * equal-protection holding. Trimmed with internal ellipses (and one
 * bracketed edit, "[D]eprived," at a clause boundary) to stay within
 * excerpt length; verbatim public-domain text otherwise, verified against
 * the Cornell Legal Information Institute's full-text transcript of 347
 * U.S. 483 (which preserves the official U.S. Reports pagination, e.g.
 * "[347 U.S. 494]"), cross-checked against the National Archives'
 * milestone-documents summary.
 */
export const PASSAGE_APGOV_BROWN_OPINION: Passage = {
  id: 'evelyn.passage.apgov-brown-opinion.v1',
  title: 'Brown v. Board of Education — Opinion of the Court',
  author: 'Earl Warren, Chief Justice',
  year: 1954,
  sourceUrl: 'https://www.archives.gov/milestone-documents/brown-v-board-of-education',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'We come then to the question presented: Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other "tangible" factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does. ... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone.\n\nWe conclude that in the field of public education the doctrine of "separate but equal" has no place. Separate educational facilities are inherently unequal. ... [D]eprived of the equal protection of the laws guaranteed by the Fourteenth Amendment.',
  lineNumbered: true,
  wordCount: 129,
};
