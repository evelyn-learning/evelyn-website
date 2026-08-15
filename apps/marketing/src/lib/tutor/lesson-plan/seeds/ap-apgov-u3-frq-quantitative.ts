/**
 * AP US Government & Politics — Unit 3 FRQ Practice: Quantitative Analysis
 * (AP Gov FRQ 2) — 4 points, one point per lettered part, scored against a
 * single data-table stimulus.
 *
 * Format (per the authentic AP Gov Quantitative Analysis FRQ): a table or
 * chart, followed by four parts — (A) IDENTIFY a specific value directly
 * readable from the data, (B) DESCRIBE a trend shown in the data, (C) DRAW
 * A CONCLUSION about what the data implies, and (D) EXPLAIN how the data
 * relates to a course concept or political principle.
 *
 * Stimulus: evelyn.passage.apgov-civil-rights-filings-table.v1 — civil
 * rights case filings in U.S. district courts (excluding prisoner
 * petitions), five selected years, per the passage's own docblock: 1964 =
 * 709; 1990 = 18,922; 1997 = 43,278 (the series peak); 2006 = 32,865; 2020
 * = 41,044. Every part below and every modelResponse is answerable
 * strictly from those seeded figures; nothing here cites a number the
 * passage does not contain. Per the data-fidelity correction for this
 * plan, the trend description below runs from the table's actual 1964
 * baseline to the 1997 peak (not 1961, which is not a year in this table).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_FRQ_QUANTITATIVE: LessonPlan = {
  id: 'evelyn.ap.apgov.u3-frq-quantitative.v1',
  title: 'Unit 3 FRQ Practice — Quantitative Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u3-frq-quantitative',
      description:
        'Answer a complete AP Gov Quantitative Analysis free-response question from a data table on civil rights case filings in U.S. district courts, 1964-2020 — identifying the peak year, describing the trend from the 1964 baseline to that peak, drawing a conclusion about the effect of the 1964 Civil Rights Act era on citizens\' use of federal courts, and explaining how litigation functions as a civil-rights strategy alongside legislation and protest — scored against the authentic AP Gov 4-point Quantitative Analysis rubric (1 point per part).',
      standard: 'AP-APGOV-3-FRQ-QA',
    },
  ],
  prerequisites: ['apgov.civil-rights-equality'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the data-table FRQ concrete for a civil-rights filings table, and name the format\'s biggest trap: describing a number that isn\'t actually in the table.',
      script:
        "One of the four AP Gov free-response questions hands you a table or chart instead of a scenario or a court case — the Quantitative Analysis FRQ, worth 4 points. It rewards precision, not eloquence: every part is graded against what the data ACTUALLY shows. Today's table tracks civil rights case filings in U.S. district courts across five selected years — a number that explodes upward after new causes of action are created by statute, then eases somewhat, but never returns anywhere near its starting point. The format's other common trap shows up in part (D) here: litigation is only ONE of several parallel strategies civil-rights advocates used, alongside legislation and protest, and this question asks you to connect the data to that broader strategic picture precisely, not just describe the numbers in isolation. Today you'll answer all four parts exactly the way the data supports.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qa-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Quantitative Analysis FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get one data table or chart and four parts, each worth 1 point and graded independently. Nothing here asks for a thesis or outside evidence — every part is answered directly from the data in front of you.',
        'PART (A) — IDENTIFY (0-1 point): the lowest bar of the four. Full credit requires stating a specific value or fact that is directly readable from the table — here, the single year with the greatest number of civil rights filings — with no interpretation required.',
        'PART (B) — DESCRIBE A TREND (0-1 point): full credit requires describing how the value changes across the span of data shown, with the actual figures cited, not just asserting "it went up." Use the table\'s own starting point (1964) rather than a year the table does not contain.',
        'PART (C) — DRAW A CONCLUSION (0-1 point): full credit requires going one step beyond describing the trend to stating what the data implies about a broader development — here, the effect of the 1964 Civil Rights Act era on citizens\' use of federal courts. A conclusion that only restates the raw figures without connecting them to that broader claim stops short of full credit.',
        'PART (D) — EXPLAIN THE DATA\'S RELATION TO A COURSE CONCEPT (0-1 point): full credit requires explaining how litigation functions as a civil-rights strategy ALONGSIDE legislation (e.g. the Civil Rights Act of 1964, Voting Rights Act of 1965) and protest (e.g. nonviolent direct action), rather than treating litigation as the only or automatically the most important strategy.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: citing a number not actually in the table (or from the wrong year), or in part (D) describing litigation in isolation without explaining how it relates to legislation and protest as parallel strategies.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov Quantitative Analysis scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-quantitative-analysis-frq',
      kind: 'try_yourself',
      problem:
        "Use the table to answer the question. Answer parts (A), (B), (C), and (D).\n\n(A) Identify the peak year of civil-rights case filings shown in the table.\n(B) Describe the trend in civil-rights case filings from 1964 to the peak year.\n(C) Draw a conclusion about the effect of the 1964 Civil Rights Act era on citizens' use of the federal courts.\n(D) Explain how litigation functions as a civil-rights strategy alongside legislation and protest.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apgov-civil-rights-filings-table.v1',
      expectedAnswer:
        "(A) 1997 is the peak year, with 43,278 civil rights case filings in U.S. district courts — the highest figure of any year shown in the table. (B) Civil rights filings rose dramatically from 709 in 1964 to 43,278 by 1997, an increase of roughly sixty-one-fold across that span, as filings first climbed to 18,922 by 1990 and then kept accelerating to the 1997 peak. (C) The 1964 Civil Rights Act era created new federal causes of action (such as Title VII's employment-discrimination claim), and the enormous multiplication of filings from 709 in 1964 to 43,278 by 1997 supports the conclusion that these new statutory rights gave many more citizens a legal basis to sue in federal court, transforming civil rights litigation from a negligible share of the federal docket into a routine, large-scale use of the courts. (D) Litigation is one of three parallel civil-rights strategies alongside legislation and protest: legislation (the Civil Rights Act of 1964, Voting Rights Act of 1965) created new enforceable rights and reached private conduct that constitutional litigation alone could not touch; protest (nonviolent direct action, as in the Birmingham campaign) built public pressure that helped push reluctant legislators to act; and litigation, as reflected in this table's rising filing counts, gave individual citizens a direct, ongoing legal tool to enforce those rights case by case in federal court long after the historic legislation passed, rather than depending solely on Congress or public demonstration for enforcement.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies 1997 as the peak year (43,278 filings). No credit (0/1) for any other year, or for citing a figure not matching the 1997 value.',
            modelResponse:
              '1997 is the peak year, with 43,278 civil rights case filings — the highest figure of any year in the table.',
          },
          {
            criterionId: 'B-describe-trend',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes filings as rising from the table\'s 1964 baseline (709) to the 1997 peak (43,278), citing the actual figures (including the 1990 value of 18,922 as an intermediate point) rather than asserting a vague increase. No credit (0/1) for describing a decline or flat trend, for citing figures not in the table, or for using 1961 as a starting year (the table\'s earliest year is 1964).',
            modelResponse:
              "Civil rights filings rose dramatically from 709 in 1964 to 43,278 by 1997 — an increase of roughly sixty-one-fold — climbing to 18,922 by 1990 before accelerating further to the 1997 peak.",
          },
          {
            criterionId: 'C-draw-conclusion',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): draws a conclusion connecting the 1964-to-1997 increase to the 1964 Civil Rights Act era\'s creation of new federal causes of action, concluding that citizens gained and used a substantially expanded legal basis to sue in federal court. No credit (0/1) for a response that only restates the raw figures without stating this broader implication.',
            modelResponse:
              "The 1964 Civil Rights Act era created new federal causes of action, such as Title VII's employment-discrimination claim, and the roughly sixty-one-fold rise in filings from 709 (1964) to 43,278 (1997) supports the conclusion that these new statutory rights gave many more citizens a legal basis to sue in federal court, turning civil rights litigation from a negligible share of the federal docket into routine, large-scale use of the courts.",
          },
          {
            criterionId: 'D-explain-litigation-strategy',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains how litigation functions as one of several parallel civil-rights strategies alongside legislation (creating enforceable rights, reaching private conduct) and protest (building public pressure for legislative and social change), rather than describing litigation in isolation. No credit (0/1) for describing only litigation with no connection to legislation or protest as parallel strategies.',
            modelResponse:
              "Litigation is one of three parallel civil-rights strategies alongside legislation and protest: legislation (the Civil Rights Act of 1964, Voting Rights Act of 1965) created new enforceable rights and reached private conduct that constitutional litigation alone could not touch; protest (nonviolent direct action) built public pressure that helped push reluctant legislators to act; and litigation, as this table's rising filing counts show, gave individual citizens a direct, ongoing legal tool to enforce those rights case by case in federal court long after the historic legislation passed.",
          },
        ],
      },
      hints: [
        'Part (A) wants the single peak YEAR, not a share or a different year in the table.',
        'Part (B) must start from the table\'s actual earliest year, 1964 (not 1961) — cite the 1964 and 1997 figures directly, and the 1990 figure if useful.',
        'Part (D) wants litigation\'s RELATIONSHIP to legislation and protest as parallel strategies — not a description of litigation alone.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative Analysis is 4 points, one per part, each graded independently — a data table, no thesis, no outside evidence.',
        'Identify (A) wants one specific, directly-readable value; Describe (B) wants the accurate trend with figures cited, starting from the table\'s actual first year; Draw a Conclusion (C) states what the data implies; Explain (D) ties the data to a named course concept.',
        'Civil rights filings rose from 709 (1964) to a peak of 43,278 (1997), easing to 32,865 (2006) but still running at 41,044 (2020) — decades after the 1964-65 statutes, federal courts remained a major civil-rights venue.',
        'Litigation, legislation, and protest are three parallel civil-rights strategies, not substitutes for one another — each did something the others could not.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ-QA',
    cedTitle: 'Unit 3 FRQ Practice — Quantitative Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Quantitative Analysis free-response task wording and 4-point rubric (1 point per lettered part).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-civil-rights-filings-table.v1',
        chapter: '1964-2020',
        note: 'Described data table (BJS Special Report NCJ 222989 + AOUSC caseload data) — civil rights case filings in U.S. district courts, 1964-2020; single stimulus for the Quantitative Analysis FRQ.',
      },
    ],
  },
};
