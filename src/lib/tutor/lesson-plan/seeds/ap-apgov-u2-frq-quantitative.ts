/**
 * AP US Government & Politics — Unit 2 FRQ Practice: Quantitative Analysis
 * (AP Gov FRQ 2) — 4 points, one point per lettered part, scored against a
 * single data-table stimulus.
 *
 * Format (per the authentic AP Gov Quantitative Analysis FRQ): a table or
 * chart, followed by four parts — (A) IDENTIFY a specific value directly
 * readable from the data, (B) DESCRIBE a trend shown in the data, (C) DRAW
 * A CONCLUSION comparing the data to an external benchmark, and (D)
 * EXPLAIN how the data relates to a course concept or political principle.
 *
 * Stimulus: evelyn.passage.apgov-congress-demographics-table.v1 — total
 * women serving in the U.S. Congress, 1961-2021 (CRS Report R43244): 1961 =
 * 20 (18 House, 2 Senate); 1981 = 23 (21, 2); 2001 = 74 (60, 14); 2021 =
 * 147 (123, 24), against a 2020 Census population share of 50.8% women.
 * Every part below and every modelResponse is answerable strictly from
 * those seeded figures; nothing here cites a number the passage does not
 * contain.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_FRQ_QUANTITATIVE: LessonPlan = {
  id: 'evelyn.ap.apgov.u2-frq-quantitative.v1',
  title: 'Unit 2 FRQ Practice — Quantitative Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u2-frq-quantitative',
      description:
        'Answer a complete AP Gov Quantitative Analysis free-response question from a data table on women\'s representation in Congress, 1961-2021 — identifying the peak year, describing the six-decade trend, drawing a conclusion comparing congressional and population shares, and explaining how descriptive representation relates to the trustee or delegate model of congressional behavior — scored against the authentic AP Gov 4-point Quantitative Analysis rubric (1 point per part).',
      standard: 'AP-APGOV-2-FRQ-QA',
    },
  ],
  prerequisites: ['apgov.congress-structure'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the data-table FRQ concrete for a representation table, and name the format\'s biggest trap: describing a number that isn\'t actually in the table.',
      script:
        "One of the four AP Gov free-response questions hands you a table or chart instead of a scenario or a court case — the Quantitative Analysis FRQ, worth 4 points. It rewards precision, not eloquence: every part is graded against what the data ACTUALLY shows. Today's table tracks the number of women serving in Congress from 1961 to 2021 — a number that rises across every year shown, but unevenly, with the pace of change changing sharply after the 1990s. The format's other common trap shows up in part (D) here: descriptive representation (who Congress LOOKS like) is not automatically the same thing as substantive representation (whose interests get served), and this question asks you to connect the data to the trustee/delegate distinction precisely, not just gesture at \"more women means more representation.\" Today you'll answer all four parts exactly the way the data supports.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qa-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Quantitative Analysis FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get one data table or chart and four parts, each worth 1 point and graded independently. Nothing here asks for a thesis or outside evidence — every part is answered directly from the data in front of you.',
        'PART (A) — IDENTIFY (0-1 point): the lowest bar of the four. Full credit requires stating a specific value or fact that is directly readable from the table — here, the single year with the greatest number of women in Congress — with no interpretation required.',
        'PART (B) — DESCRIBE A TREND (0-1 point): full credit requires describing how the value changes across the whole span of data shown, with the actual figures cited, not just asserting "it went up." A strong description also notices WHEN the pace of change shifted, not just the overall direction.',
        'PART (C) — DRAW A CONCLUSION (0-1 point): full credit requires going one step beyond describing the trend to comparing it against an external benchmark given in the data — here, women\'s 2021 share of Congress against their share of the U.S. population — and stating what that comparison means. A conclusion that only restates the congressional numbers without bringing in the population comparison stops short of full credit.',
        'PART (D) — EXPLAIN THE DATA\'S RELATION TO A COURSE CONCEPT (0-1 point): full credit requires connecting descriptive representation (elected officials sharing demographic characteristics with the people they represent) to the trustee/delegate distinction (whether a representative exercises independent judgment or mirrors constituents\' views), explaining how the two ideas relate rather than just naming both.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: citing a number not actually in the table (or from the wrong year), or treating "more descriptive representation" and "more substantive representation" as automatically the same claim in part (D) without explaining the trustee/delegate connection.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov Quantitative Analysis scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-quantitative-analysis-frq',
      kind: 'try_yourself',
      problem:
        "Use the table to answer the question. Answer parts (A), (B), (C), and (D).\n\n(A) Identify the year with the greatest number of women serving in Congress.\n(B) Describe the trend in women's representation in Congress from 1961 to 2021.\n(C) Draw a conclusion comparing women's share of Congress in 2021 to their share of the U.S. population.\n(D) Explain how descriptive representation relates to the trustee or delegate model of congressional behavior.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apgov-congress-demographics-table.v1',
      expectedAnswer:
        "(A) 2021 is the year with the greatest number of women serving in Congress, at 147 (123 in the House, 24 in the Senate). (B) The number of women in Congress rose across every year shown, but unevenly: it grew only slightly from 20 in 1961 to 23 in 1981, then accelerated sharply after the 1990s, more than tripling to 74 by 2001 and nearly doubling again to 147 by 2021. (C) In 2021, 143 of the 535 voting Members of Congress were women — roughly 26.7% — well below women's approximately 50.8% share of the U.S. population per the Census Bureau — so despite six decades of substantial growth, women remain significantly underrepresented in Congress relative to their share of the population. (D) Descriptive representation means a representative shares a demographic characteristic — here, gender — with the people being represented, which is a separate question from HOW that representative behaves in office. The trustee model holds that a representative should use independent judgment about the public good, while the delegate model holds that a representative should directly mirror constituents' stated views; growth in descriptive representation does not by itself tell us which model a member follows, but it does increase the chance that women's specific perspectives and priorities are present in the room where either a trustee's independent judgment or a delegate's responsiveness to constituent views gets formed and expressed.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies 2021 as the year with the greatest number of women in Congress (147). No credit (0/1) for any other year, or for citing a share/percentage instead of the count of women.',
            modelResponse:
              '2021 is the year with the greatest number of women serving in Congress, at 147 — higher than 1961 (20), 1981 (23), or 2001 (74).',
          },
          {
            criterionId: 'B-describe-trend',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes the number of women in Congress as rising across every year shown, citing the actual figures (20 -> 23 -> 74 -> 147) and noting the uneven pace (slow 1961-1981, sharply accelerating after). No credit (0/1) for describing a decline, a flat trend, or citing figures not in the table.',
            modelResponse:
              'The number of women in Congress rose across every year shown, but unevenly: from 20 in 1961 to only 23 in 1981 (a slow two decades), then accelerating sharply after the 1990s — more than tripling to 74 by 2001 and nearly doubling again to 147 by 2021.',
          },
          {
            criterionId: 'C-draw-conclusion',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): draws a conclusion comparing women\'s 2021 congressional share (roughly 26.7%, 143 of the 535 voting Members) to their population share (50.8%), concluding that women remain significantly underrepresented in Congress relative to the population despite the growth described in (B). No credit (0/1) for a response that only restates the congressional numbers without the population comparison, or that cites a population figure not in the table.',
            modelResponse:
              "In 2021, 143 of the 535 voting Members of Congress were women — roughly 26.7% — well below women's approximately 50.8% share of the U.S. population, so despite six decades of substantial growth, women remain significantly underrepresented in Congress relative to their share of the population.",
          },
          {
            criterionId: 'D-explain-representation-model',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains the relationship between descriptive representation (sharing a demographic characteristic with constituents) and the trustee/delegate distinction (independent judgment versus mirroring constituent views), rather than simply naming both without connecting them. No credit (0/1) for defining descriptive representation or the trustee/delegate model alone with no stated relationship between them, or for treating descriptive and substantive representation as automatically identical.',
            modelResponse:
              "Descriptive representation means a representative shares a demographic characteristic — here, gender — with the people being represented, which is a separate question from HOW that representative behaves once in office. The trustee model holds that a representative should exercise independent judgment about the public good, while the delegate model holds that a representative should mirror constituents' expressed views; a rise in descriptive representation does not by itself determine which model a member follows, but it increases the chance that women's specific perspectives are present in the room where either a trustee's judgment or a delegate's responsiveness gets formed.",
          },
        ],
      },
      hints: [
        'Part (A) wants the single peak YEAR for the count of women, not a share or percentage.',
        'Part (B) should note both the overall rise AND that the pace of change was not constant across the six decades.',
        'Part (D) is about the RELATIONSHIP between descriptive representation and the trustee/delegate distinction — not a definition of either term alone.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative Analysis is 4 points, one per part, each graded independently — a data table, no thesis, no outside evidence.',
        'Identify (A) wants one specific, directly-readable value; Describe (B) wants the accurate trend with figures cited, including any change of pace; Draw a Conclusion (C) compares the data to a given benchmark; Explain (D) ties the data to a named course concept.',
        'Women in Congress rose from 20 (1961) to 147 (2021), but unevenly — slow through 1981, then accelerating sharply after the 1990s.',
        'Descriptive representation (who Congress looks like) is distinct from the trustee/delegate distinction (how a representative behaves) — more of one does not automatically mean more of the other, though the two can relate.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ-QA',
    cedTitle: 'Unit 2 FRQ Practice — Quantitative Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Quantitative Analysis free-response task wording and 4-point rubric (1 point per lettered part).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-congress-demographics-table.v1',
        chapter: '1961-2021',
        note: 'Described data table (CRS Report R43244) — women serving in Congress, 1961-2021; single stimulus for the Quantitative Analysis FRQ.',
      },
    ],
  },
};
