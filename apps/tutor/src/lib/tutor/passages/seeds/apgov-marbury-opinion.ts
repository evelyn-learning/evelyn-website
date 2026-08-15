import type { Passage } from '../types';

/**
 * Chief Justice John Marshall's opinion in Marbury v. Madison (1803). AP
 * Gov Unit-2 core document — the foundational statement of judicial
 * review. Excerpt covers "It is emphatically the province and duty of the
 * judicial department to say what the law is," the conflicting-rules
 * reasoning when a statute and the Constitution both apply to a case, and
 * the conclusion that "a law repugnant to the constitution is void."
 * Trimmed with internal ellipses to stay within excerpt length; verbatim
 * public-domain text otherwise, verified against the National Archives
 * transcript and cross-checked against the Cornell Legal Information
 * Institute's text of the opinion.
 */
export const PASSAGE_APGOV_MARBURY_OPINION: Passage = {
  id: 'evelyn.passage.apgov-marbury-opinion.v1',
  title: 'Marbury v. Madison — Opinion of the Court',
  author: 'John Marshall, Chief Justice',
  year: 1803,
  sourceUrl: 'https://www.archives.gov/milestone-documents/marbury-v-madison',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'The judicial power of the United States is extended to all cases arising under the constitution. ... It is emphatically the province and duty of the judicial department to say what the law is. Those who apply the rule to particular cases, must of necessity expound and interpret that rule. If two laws conflict with each other, the courts must decide on the operation of each.\n\nSo if a law be in opposition to the constitution: if both the law and the constitution apply to a particular case, so that the court must either decide that case conformably to the law, disregarding the constitution; or conformably to the constitution, disregarding the law: the court must determine which of these conflicting rules governs the case. ... [T]hat a law repugnant to the constitution is void, and that courts, as well as other departments, are bound by that instrument.',
  lineNumbered: true,
  wordCount: 146,
};
