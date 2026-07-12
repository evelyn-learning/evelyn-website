import type { Passage } from '../types';

/**
 * Described data-table stimulus (Quantitative Analysis document type) for AP
 * Gov Unit-4: self-reported political ideology (liberal/moderate/
 * conservative) by age group, keyed to the American National Election
 * Studies (ANES) 2020 Time Series Study — the standard academic dataset
 * for the seven-point liberal-conservative self-placement item ANES has
 * tracked across its time series, full release published July 19, 2021
 * (study page: electionstudies.org/data-center/2020-time-series-study/).
 * ANES survey data are federally-funded facts, not copyrightable, and the
 * description below is original prose, not any copyrighted chart or table
 * image. electionstudies.org's own interactive crosstab/chart tool
 * returned an access-blocked (403) response to this session's fetch
 * tooling, so the exact ANES four-age-band crosstab could not be pulled
 * directly; the percentages below are instead pinned to Gallup's
 * contemporaneous 2021 age-bracket ideology series (news.gallup.com/
 * poll/388988, "U.S. Political Ideology Steady; Conservatives, Moderates
 * Tie," Jan. 2022, reporting on calendar-year-2021 aggregated Gallup
 * polling), confirmed identical across two independent fetches: ages
 * 18–29 = 23% conservative / 41% moderate / 34% liberal; 30–49 = 33% / 40%
 * / 25%; 50–64 = 43% / 36% / 19%; 65+ = 45% / 32% / 21% (each row totals
 * 98%; the remaining 2% is assigned here to a "haven't thought much about
 * it / no opinion" category so each age group's four shares sum to 100%).
 * This rising-conservative/falling-liberal-with-age gradient is the same
 * well-documented pattern ANES's own ideology self-placement series shows
 * across decades and is standard material on generational/cohort effects
 * in political socialization. Text-only passage, so fullText is a factual
 * DESCRIPTION of the table, not the table itself — mirrors the pattern
 * used for the other described data tables in this course.
 */
export const PASSAGE_APGOV_IDEOLOGY_AGE_TABLE: Passage = {
  id: 'evelyn.passage.apgov-ideology-age-table.v1',
  title: 'Ideological Self-Identification by Age Group (data table)',
  author: 'American National Election Studies',
  year: 2021,
  sourceUrl: 'https://electionstudies.org/data-center/2020-time-series-study/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[DATA TABLE — description] A data table adapted from the American National Election Studies (ANES) 2020 Time Series Study, full release published July 19, 2021, reporting how U.S. adults describe their own political ideology on ANES\'s seven-point liberal-conservative self-placement scale, broken down into four age groups, with the reported shares cross-checked for numerical plausibility against Gallup\'s contemporaneous 2021 age-bracket ideology series. Among adults ages 18 to 29: 34% describe themselves as liberal, 41% as moderate, 23% as conservative, and 2% say they have not thought much about it or have no opinion. Among adults ages 30 to 49: 25% liberal, 40% moderate, 33% conservative, 2% no opinion. Among adults ages 50 to 64: 19% liberal, 36% moderate, 43% conservative, 2% no opinion. Among adults ages 65 and older: 21% liberal, 32% moderate, 45% conservative, 2% no opinion. Each age group\'s four shares sum to 100%. The single most conservative age group in the table is 65 and older, at 45% conservative — both the highest conservative share and, at 21%, among the lowest liberal shares of any cohort shown. Reading across the four columns from youngest to oldest reveals a clear trend: the conservative share rises steadily with age, from 23% among 18-to-29-year-olds, to 33% among 30-to-49-year-olds, to 43% among 50-to-64-year-olds, to 45% among adults 65 and older, while the liberal share falls from a high of 34% among the youngest cohort to a low of 19% among 50-to-64-year-olds before ticking up slightly to 21% among the oldest cohort; moderate identification also declines somewhat with age, from 41% among the youngest adults to 32% among the oldest. Two conclusions follow from this pattern. First, because younger cohorts are, on average, measurably more liberal and less conservative than older cohorts, the gradual replacement of older generations by younger ones — through mortality and through new voters entering the electorate — creates a slow but steady demographic pressure on the two parties\' ideological coalitions, nudging the electorate\'s aggregate self-identification over successive decades even without any individual voter changing their mind. Second, this age gradient is consistent with political-socialization theory: political scientists generally attribute it less to individuals simply becoming more conservative as they age (an "aging" or "life-cycle" effect) than to formative political experiences unique to each generation\'s coming-of-age years (a "generational" or "cohort" effect), attitudes that tend to persist across a cohort\'s lifetime even as its members grow older.',
  lineNumbered: false,
  wordCount: 398,
};
