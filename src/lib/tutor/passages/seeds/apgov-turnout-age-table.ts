import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * Gov Unit-5: reported voter turnout by age group across four presidential
 * elections. All sixteen percentages are the REAL published values from the
 * U.S. Census Bureau's Current Population Survey (CPS) Voting and
 * Registration Supplement, historical time series Table A-1 ("Reported
 * Voting and Registration by Race, Hispanic Origin, Sex and Age Groups:
 * November 1964 to 2024"), downloaded directly from
 * census.gov/data/tables/time-series/demo/voting-and-registration/
 * voting-historical-time-series.html (file hst_vote01.xlsx) and read from
 * the "Total percent" (total population, all races) column of each age
 * group's "Percent Voted" block: 18-24 years — 32.3% (2000), 44.3% (2008),
 * 39.4% (2016), 48.0% (2020); 25-44 years — 49.8% (2000), 51.9% (2008),
 * 49.0% (2016), 55.0% (2020); 45-64 years — 64.1% (2000), 65.0% (2008),
 * 61.7% (2016), 65.5% (2020); 65 years and over — 67.6% (2000), 68.1%
 * (2008), 68.4% (2016), 71.9% (2020). The brief's provisional anchors were
 * close for the 18-24 row (32/44/39/48-51, actual 32.3/44.3/39.4/48.0) but
 * overstated the 65+ row (68/70/71/74-76 vs. actual 67.6/68.1/68.4/71.9);
 * this file uses the verified actual figures. CPS turnout is self-reported
 * (respondents tell an interviewer whether they voted, which is not
 * verified against ballot records), a limitation noted in the passage text
 * itself. Text-only passage, so fullText is a factual DESCRIPTION of the
 * table, not the table itself — mirrors the pattern used for the other
 * described data tables in this course.
 */
export const PASSAGE_APGOV_TURNOUT_AGE_TABLE: Passage = {
  id: 'evelyn.passage.apgov-turnout-age-table.v1',
  title: 'Reported Voter Turnout by Age Group in Presidential Elections (data table, 2000–2020)',
  author: 'U.S. Census Bureau',
  year: 2021,
  sourceUrl:
    'https://www.census.gov/data/tables/time-series/demo/voting-and-registration/voting-historical-time-series.html',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the U.S. Census Bureau\'s Current Population Survey (CPS) Voting and Registration Supplement, historical time series Table A-1, showing the reported turnout rate — the percentage of the citizen voting-age population who told Census Bureau interviewers they had voted — for four age groups (18 to 24 years, 25 to 44 years, 45 to 64 years, and 65 years and over) in four presidential elections (2000, 2008, 2016, and 2020). Reported turnout for ages 18 to 24 was 32.3% in 2000, 44.3% in 2008, 39.4% in 2016, and 48.0% in 2020. Reported turnout for ages 25 to 44 was 49.8% in 2000, 51.9% in 2008, 49.0% in 2016, and 55.0% in 2020. Reported turnout for ages 45 to 64 was 64.1% in 2000, 65.0% in 2008, 61.7% in 2016, and 65.5% in 2020. Reported turnout for ages 65 and over was 67.6% in 2000, 68.1% in 2008, 68.4% in 2016, and 71.9% in 2020. Because these figures come from a post-election survey in which respondents self-report whether they voted, rather than from a verified count of ballots cast, CPS turnout percentages tend to run a few points above official, ballot-verified turnout rates. One identify item: in every one of the four elections shown, the highest-turnout age group is 65 and over, reaching its high point of 71.9% in 2020. One describe item: within each individual election year, reported turnout rises with age — the four groups fall in the same low-to-high order (18–24, then 25–44, then 45–64, then 65+) in 2000, 2008, 2016, and 2020 alike, with no exceptions. One comparison: the gap between the 18–24 group and the 65-and-over group was 35.3 percentage points in 2000 (67.6% minus 32.3%), 23.8 points in 2008 (68.1% minus 44.3%), 29.0 points in 2016 (68.4% minus 39.4%), and 23.9 points in 2020 (71.9% minus 48.0%). One conclusion: reported turnout among 18-to-24-year-olds rose 8.6 percentage points between 2016 and 2020 (39.4% to 48.0%), a substantial single-election jump consistent with widely reported record youth turnout in 2020; this youth surge narrowed the 18–24-to-65+ gap from 29.0 points in 2016 to 23.9 points in 2020, but turnout among the 65-and-over group also rose over the same span (68.4% to 71.9%), so the 2020 surge among young voters reduced without closing the long-standing age gap in reported turnout.',
  lineNumbered: false,
  wordCount: 389,
};
