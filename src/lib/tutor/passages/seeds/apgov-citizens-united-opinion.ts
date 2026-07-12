import type { Passage } from '../types';

/**
 * Justice Anthony Kennedy's majority opinion in Citizens United v. FEC, 558
 * U.S. 310 (2010). AP Gov Unit-5 required Supreme Court case — the holding
 * that the First Amendment bars government restrictions on independent
 * political expenditures by corporations and unions. Excerpt covers two
 * required lines of reasoning: (1) that political speech "does not lose
 * First Amendment protection 'simply because its source is a
 * corporation'" (quoting First Nat. Bank of Boston v. Bellotti, 435 U.S.
 * 765, 784 (1978)), and (2) that independent expenditures — unlike direct
 * contributions — do not give rise to quid pro quo corruption or its
 * appearance, because the "absence of prearrangement and coordination of
 * an expenditure with the candidate or his agent" (quoting Buckley v.
 * Valeo, 424 U.S. 1, 47 (1976)) removes the corruption risk that justifies
 * limits on direct contributions. Trimmed with an internal ellipsis to
 * skip intervening case-citation strings while remaining verbatim
 * otherwise; verified sentence-by-sentence against the Cornell Legal
 * Information Institute's full-text transcript of the opinion
 * (law.cornell.edu/supct/html/08-205.ZO.html), which reproduces the slip
 * opinion's text. As of authoring, the original slip-opinion URL at
 * supremecourt.gov/opinions/09pdf/08-205.pdf 404s (the Court's site has
 * since reorganized its opinion archive), so sourceUrl points to the
 * Internet Archive's Wayback Machine capture of that same original URL
 * (crawled 2010-03-31, days after the case was decided, serving the
 * identical 869,377-byte PDF the Court itself published) as an
 * authoritative mirror.
 */
export const PASSAGE_APGOV_CITIZENS_UNITED_OPINION: Passage = {
  id: 'evelyn.passage.apgov-citizens-united-opinion.v1',
  title: 'Citizens United v. Federal Election Commission — Opinion of the Court',
  author: 'Anthony Kennedy, Justice',
  year: 2010,
  sourceUrl:
    'https://web.archive.org/web/20100331013448/http://www.supremecourt.gov/opinions/09pdf/08-205.pdf',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Under the rationale of these precedents, political speech does not lose First Amendment protection "simply because its source is a corporation." ... The Court has thus rejected the argument that political speech of corporations or other associations should be treated differently under the First Amendment simply because such associations are not "natural persons."\n\nThat case did not extend this rationale to independent expenditures, and the Court does not do so here. "The absence of prearrangement and coordination of an expenditure with the candidate or his agent not only undermines the value of the expenditure to the candidate, but also alleviates the danger that expenditures will be given as a quid pro quo for improper commitments from the candidate." ... Limits on independent expenditures ... have a chilling effect extending well beyond the Government\'s interest in preventing quid pro quo corruption.',
  lineNumbered: true,
  wordCount: 140,
};
