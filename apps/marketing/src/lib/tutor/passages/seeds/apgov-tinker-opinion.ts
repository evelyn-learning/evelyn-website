import type { Passage } from '../types';

/**
 * Justice Abe Fortas's opinion of the Court in Tinker v. Des Moines
 * Independent Community School District, 393 U.S. 503 (1969). AP Gov
 * Unit-3 required Supreme Court case — establishes that students retain
 * First Amendment free-expression rights in public schools, subject to a
 * substantial-disruption standard. Excerpt covers the "schoolhouse gate"
 * sentence (paragraph 8 of the opinion), the "undifferentiated fear or
 * apprehension of disturbance is not enough to overcome the right to
 * freedom of expression" holding (paragraph 15), and the "materially and
 * substantially interfere with the requirements of appropriate discipline"
 * standard the Court adopts from Burnside v. Byars (paragraph 16). Trimmed
 * with internal ellipses to stay within excerpt length; verbatim
 * public-domain text otherwise, verified against the Cornell Legal
 * Information Institute's full-text transcript of 393 U.S. 503, which
 * preserves the opinion's own paragraph numbering and matches the "schoolhouse
 * gate" and "undifferentiated fear" language quoted in the uscourts.gov
 * "Facts and Case Summary" for this case.
 */
export const PASSAGE_APGOV_TINKER_OPINION: Passage = {
  id: 'evelyn.passage.apgov-tinker-opinion.v1',
  title: 'Tinker v. Des Moines Independent Community School District — Opinion of the Court',
  author: 'Abe Fortas, Associate Justice',
  year: 1969,
  sourceUrl: 'https://www.law.cornell.edu/supremecourt/text/393/503',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'First Amendment rights, applied in light of the special characteristics of the school environment, are available to teachers and students. It can hardly be argued that either students or teachers shed their constitutional rights to freedom of speech or expression at the schoolhouse gate. This has been the unmistakable holding of this Court for almost 50 years.\n\nThe District Court concluded that the action of the school authorities was reasonable because it was based upon their fear of a disturbance from the wearing of the armbands. But, in our system, undifferentiated fear or apprehension of disturbance is not enough to overcome the right to freedom of expression. ... But our Constitution says we must take this risk. ... Certainly where there is no finding and no showing that engaging in the forbidden conduct would "materially and substantially interfere with the requirements of appropriate discipline in the operation of the school," the prohibition cannot be sustained.',
  lineNumbered: true,
  wordCount: 155,
};
