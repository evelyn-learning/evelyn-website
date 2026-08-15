/**
 * AP US Government & Politics — Unit 5 FRQ Practice: Quantitative Analysis
 * (AP Gov FRQ 2) — 4 points, one point per lettered part, scored against a
 * single data-table stimulus.
 *
 * Format (per the authentic AP Gov Quantitative Analysis FRQ): a table or
 * chart, followed by four parts — (A) IDENTIFY a specific value directly
 * readable from the data, (B) DESCRIBE a relationship shown in the data,
 * (C) DRAW A CONCLUSION about what the data implies, and (D) EXPLAIN how
 * the data relates to a course concept or political principle.
 *
 * Stimulus: evelyn.passage.apgov-turnout-age-table.v1 — the U.S. Census
 * Bureau's REAL published Current Population Survey (CPS) Voting and
 * Registration Supplement, Table A-1 figures, per the passage's own
 * docblock: reported turnout for ages 18-24 was 32.3% (2000), 44.3%
 * (2008), 39.4% (2016), 48.0% (2020); 25-44 was 49.8% / 51.9% / 49.0% /
 * 55.0%; 45-64 was 64.1% / 65.0% / 61.7% / 65.5%; 65-and-over was 67.6% /
 * 68.1% / 68.4% / 71.9%. In every one of the four elections, turnout rises
 * monotonically with age (18-24 lowest, 65+ highest). The 18-24-to-65+ gap
 * was 35.3 points (2000), 23.8 (2008), 29.0 (2016), and 23.9 (2020) — the
 * 18-24 group surged 8.6 points from 2016 to 2020 (39.4% to 48.0%), but the
 * 65+ group ALSO rose over that same span (68.4% to 71.9%), so the gap
 * narrowed WITHOUT closing. Every part below and every modelResponse is
 * answerable strictly from those seeded figures; nothing claims the gap
 * closed or that turnout is unqualifiedly accurate (the passage itself
 * notes CPS turnout is self-reported).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_FRQ_QUANTITATIVE: LessonPlan = {
  id: 'evelyn.ap.apgov.u5-frq-quantitative.v1',
  title: 'Unit 5 FRQ Practice — Quantitative Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u5-frq-quantitative',
      description:
        'Answer a complete AP Gov Quantitative Analysis free-response question from the U.S. Census Bureau\'s CPS data table on reported voter turnout by age group across the 2000-2020 presidential elections — identifying the highest-turnout age group in 2020, describing the relationship between age and turnout across the elections shown, drawing a conclusion about which policies candidates are likely to prioritize, and explaining an institutional factor contributing to the age gap — scored against the authentic AP Gov 4-point Quantitative Analysis rubric (1 point per part).',
      standard: 'AP-APGOV-5-FRQ-QA',
    },
  ],
  prerequisites: ['apgov.voting-rights-behavior'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the data-table FRQ concrete for the turnout-by-age table, and name the format\'s biggest trap: assuming the 2020 youth surge closed the age gap instead of merely narrowing it.',
      script:
        "One of the four AP Gov free-response questions hands you a table or chart instead of a scenario or a court case — the Quantitative Analysis FRQ, worth 4 points. It rewards precision, not eloquence: every part is graded against what the data ACTUALLY shows. Today's table tracks the Census Bureau's real reported turnout figures across four age groups in four presidential elections — and the tempting shortcut is to see that young-voter turnout jumped in 2020 and conclude the long-standing age gap in turnout is basically solved. It isn't: older voters' turnout rose too, over that same span. The format's other big trap shows up in part (D): the AGE gap itself needs an institutional explanation, and this question asks you to connect it to something structural — like registration requirements — not just restate the numbers. Today you'll answer all four parts exactly the way the Census data supports.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qa-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Quantitative Analysis FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get one data table or chart and four parts, each worth 1 point and graded independently. Nothing here asks for a thesis or outside evidence — every part is answered directly from the data in front of you.',
        'PART (A) — IDENTIFY (0-1 point): the lowest bar of the four. Full credit requires stating a specific value or group that is directly readable from the table — here, the single age group with the highest reported turnout in 2020 — with no interpretation required.',
        'PART (B) — DESCRIBE A RELATIONSHIP (0-1 point): full credit requires describing how turnout changes across the age groups shown, across the elections shown, with actual figures or the ordering cited — not just asserting "older people vote more" once. Precision matters: the relationship holds in EVERY election shown, with no exceptions.',
        'PART (C) — DRAW A CONCLUSION (0-1 point): full credit requires going one step beyond describing the relationship to stating what the data implies about candidate behavior — here, that officeholders and candidates have an electoral incentive to prioritize policies salient to the age groups that turn out most reliably (older voters), since those are the voters most likely to actually show up and hold them accountable.',
        'PART (D) — EXPLAIN AN INSTITUTIONAL FACTOR (0-1 point): full credit requires explaining ONE institutional/structural factor — such as registration requirements and deadlines — that makes voting relatively more costly for younger, more mobile citizens (who move and must re-register more often) than for older citizens with more settled residency, contributing to the age gap in turnout.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: citing a figure not actually in the table, describing the 2020 youth surge as having CLOSED the age gap (it narrowed the gap from 29.0 to 23.9 points, but did not close it, since the 65+ group\'s turnout rose too), or in part (D) citing a factor that is not institutional (e.g., "young people don\'t care") instead of a structural one like registration requirements.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov Quantitative Analysis scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-quantitative-analysis-frq',
      kind: 'try_yourself',
      problem:
        "Use the table to answer the question. Answer parts (A), (B), (C), and (D).\n\n(A) Identify the age group with the highest turnout in 2020.\n(B) Describe the relationship between age and turnout across the elections shown.\n(C) Draw a conclusion about which policies candidates are likely to prioritize given the turnout pattern.\n(D) Explain one institutional factor (for example, registration requirements) that contributes to the age gap in turnout.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apgov-turnout-age-table.v1',
      expectedAnswer:
        "(A) Adults 65 and older had the highest reported turnout in 2020, at 71.9%. (B) In every one of the four elections shown (2000, 2008, 2016, and 2020), reported turnout rises with age in the same order — 18-24 lowest, then 25-44, then 45-64, then 65+ highest — with no exceptions. For example, in 2020 turnout was 48.0% (18-24), 55.0% (25-44), 65.5% (45-64), and 71.9% (65+); the same rising order holds in 2000, 2008, and 2016 as well. (C) Because older age groups turn out to vote far more reliably than younger ones in every election shown, candidates and officeholders have an electoral incentive to prioritize policies most salient to older voters — such as Social Security and Medicare — over policies chiefly important to younger, lower-turnout citizens, since the voters most likely to actually show up and hold officials accountable at the polls are disproportionately older. (D) One institutional factor contributing to the age gap is registration requirements: voter registration in most states requires citizens to register in advance of an election, often weeks ahead of a deadline, and to re-register whenever they change addresses. Younger citizens move far more often than older citizens (for college, first jobs, and early-career changes), so they must clear this registration hurdle repeatedly, while older citizens with more settled residency face it far less often — making registration a comparatively bigger structural barrier to voting for younger citizens.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies adults 65 and older as the age group with the highest turnout in 2020 (71.9%). No credit (0/1) for any other age group, or for citing a figure not matching the 65+ 2020 value.',
            modelResponse:
              'Adults 65 and older had the highest reported turnout in 2020, at 71.9%.',
          },
          {
            criterionId: 'B-describe-relationship',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes turnout rising with age in the same order (18-24 lowest through 65+ highest) in EVERY election shown, citing figures or the ordering. No credit (0/1) for citing figures not in the table, or for describing the pattern as holding in only some elections rather than all four.',
            modelResponse:
              "In every one of the four elections shown, reported turnout rises with age in the same order: 18-24 lowest, then 25-44, then 45-64, then 65+ highest. In 2020, for example, turnout was 48.0% (18-24), 55.0% (25-44), 65.5% (45-64), and 71.9% (65+) — the same rising order holds without exception in 2000, 2008, and 2016.",
          },
          {
            criterionId: 'C-draw-conclusion',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): draws a conclusion connecting the age-turnout pattern to candidates\' electoral incentive to prioritize policies salient to older, more reliably-voting groups. No credit (0/1) for a response that only restates the turnout figures without connecting them to this broader implication for candidates\' policy priorities.',
            modelResponse:
              "Because older age groups turn out far more reliably than younger ones in every election shown, candidates and officeholders have an electoral incentive to prioritize policies most salient to older voters — such as Social Security and Medicare — over policies chiefly important to younger, lower-turnout citizens, since the voters most likely to actually show up and hold officials accountable are disproportionately older.",
          },
          {
            criterionId: 'D-explain-institutional-factor',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains an institutional/structural factor (e.g., registration requirements/deadlines making re-registration after a move a bigger burden for more mobile younger citizens) that contributes to the age gap. No credit (0/1) for a non-institutional factor (e.g., attitude or interest alone) with no structural/legal mechanism.',
            modelResponse:
              "Registration requirements are one institutional factor: most states require registering well ahead of a deadline and re-registering after an address change. Younger citizens move far more often than older citizens (for college, first jobs, early-career changes), so they must clear this hurdle repeatedly, while older citizens with more settled residency face it far less often — making registration a comparatively bigger structural barrier for younger citizens.",
          },
        ],
      },
      hints: [
        'Part (A) wants the single age GROUP with the highest 2020 turnout, not a different year or a different group.',
        'Part (B) must note the relationship holds in ALL FOUR elections shown, not just one or two.',
        'Part (D) wants an INSTITUTIONAL factor (like registration requirements), not just "young people are less interested."',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative Analysis is 4 points, one per part, each graded independently — a data table, no thesis, no outside evidence.',
        'Identify (A) wants one specific, directly-readable value; Describe (B) wants the accurate relationship across ALL elections shown; Draw a Conclusion (C) states what the data implies for candidate behavior; Explain (D) ties the pattern to a named institutional factor.',
        'Census CPS data: turnout rises with age in every election from 2000-2020 (18-24 lowest, 65+ highest); the 18-24-to-65+ gap narrowed from 29.0 points (2016) to 23.9 points (2020) after an 8.6-point youth surge, but did NOT close, since 65+ turnout rose too (68.4% to 71.9%).',
        'Registration requirements (deadlines, re-registering after a move) are a real institutional factor behind the age gap — younger, more mobile citizens face this hurdle more often than older, more settled citizens.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-FRQ-QA',
    cedTitle: 'Unit 5 FRQ Practice — Quantitative Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Quantitative Analysis free-response task wording and 4-point rubric (1 point per lettered part).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-turnout-age-table.v1',
        chapter: '2000-2020',
        note: 'Described data table (U.S. Census Bureau CPS Voting and Registration Supplement, Table A-1) — reported turnout by age group; single stimulus for the Quantitative Analysis FRQ.',
      },
    ],
  },
};
