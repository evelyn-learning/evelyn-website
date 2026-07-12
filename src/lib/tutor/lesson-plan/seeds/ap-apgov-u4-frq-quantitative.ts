/**
 * AP US Government & Politics — Unit 4 FRQ Practice: Quantitative Analysis
 * (AP Gov FRQ 2) — 4 points, one point per lettered part, scored against a
 * single data-table stimulus.
 *
 * Format (per the authentic AP Gov Quantitative Analysis FRQ): a table or
 * chart, followed by four parts — (A) IDENTIFY a specific value directly
 * readable from the data, (B) DESCRIBE a relationship shown in the data,
 * (C) DRAW A CONCLUSION about what the data implies, and (D) EXPLAIN how
 * the data relates to a course concept or political principle.
 *
 * Stimulus: evelyn.passage.apgov-ideology-age-table.v1 — Gallup's own
 * published calendar-year-2021 ideological self-identification figures by
 * age group, per the passage's own docblock: ages 18-29 = 23% conservative
 * / 41% moderate / 34% liberal (2% no opinion); 30-49 = 33% / 40% / 25%;
 * 50-64 = 43% / 36% / 19%; 65+ = 45% / 32% / 21%. Every part below and
 * every modelResponse is answerable strictly from those seeded figures and
 * attributes them to GALLUP, never ANES.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_FRQ_QUANTITATIVE: LessonPlan = {
  id: 'evelyn.ap.apgov.u4-frq-quantitative.v1',
  title: 'Unit 4 FRQ Practice — Quantitative Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u4-frq-quantitative',
      description:
        'Answer a complete AP Gov Quantitative Analysis free-response question from Gallup\'s 2021 data table on ideological self-identification by age group — identifying the age group with the highest conservative share, describing the relationship between age and ideological self-identification, drawing a conclusion about how generational replacement could affect future party coalitions, and explaining how political socialization accounts for the pattern — scored against the authentic AP Gov 4-point Quantitative Analysis rubric (1 point per part).',
      standard: 'AP-APGOV-4-FRQ-QA',
    },
  ],
  prerequisites: ['apgov.socialization-opinion', 'apgov.ideology-policy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the data-table FRQ concrete for an ideology-by-age table, and name the format\'s biggest trap: describing the liberal trend as a simple mirror image of the conservative one.',
      script:
        "One of the four AP Gov free-response questions hands you a table or chart instead of a scenario or a court case — the Quantitative Analysis FRQ, worth 4 points. It rewards precision, not eloquence: every part is graded against what the data ACTUALLY shows. Today's table tracks Gallup's 2021 ideological self-identification figures across four age groups — and the tempting shortcut is to assume that if conservative identification rises steadily with age, liberal identification must fall in perfect lockstep. It doesn't quite: the data has a small wrinkle in the oldest group that a careless reader would miss. The format's other big trap shows up in part (D): the AGE pattern itself needs an explanation, and this question asks you to connect it to political socialization's cohort-versus-lifecycle distinction, not just restate the numbers. Today you'll answer all four parts exactly the way Gallup's own data supports.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qa-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Quantitative Analysis FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get one data table or chart and four parts, each worth 1 point and graded independently. Nothing here asks for a thesis or outside evidence — every part is answered directly from the data in front of you.',
        'PART (A) — IDENTIFY (0-1 point): the lowest bar of the four. Full credit requires stating a specific value or group that is directly readable from the table — here, the single age group with the highest conservative share — with no interpretation required.',
        'PART (B) — DESCRIBE A RELATIONSHIP (0-1 point): full credit requires describing how ideological self-identification changes across the age groups shown, with the actual figures cited, not just asserting "older people are more conservative." Precision matters: the liberal share is NOT a perfect mirror of the conservative share, so a full-credit answer should not overstate the symmetry.',
        'PART (C) — DRAW A CONCLUSION (0-1 point): full credit requires going one step beyond describing the relationship to stating what the data implies about a broader development — here, how generational replacement (younger, less-conservative cohorts eventually replacing older, more-conservative ones through new voters entering the electorate and mortality) could affect future party coalitions. A conclusion that only restates the raw figures without connecting them to that broader claim stops short of full credit.',
        'PART (D) — EXPLAIN THE DATA\'S RELATION TO A COURSE CONCEPT (0-1 point): full credit requires explaining the pattern using political socialization\'s generational (cohort) effect versus lifecycle (aging) effect distinction — that political scientists generally attribute this kind of age gradient more to each cohort\'s formative political experiences persisting over its lifetime than to individuals simply becoming more conservative as they personally age.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: citing a number not actually in the table, describing the liberal trend as a strict, unbroken decline across all four groups (it ticks up slightly for the oldest group), or in part (D) asserting a lifecycle explanation instead of the generational one this data favors.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov Quantitative Analysis scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-quantitative-analysis-frq',
      kind: 'try_yourself',
      problem:
        "Use the table to answer the question. Answer parts (A), (B), (C), and (D).\n\n(A) Identify the age group with the highest conservative self-identification share shown in the table.\n(B) Describe the relationship between age and ideological self-identification shown in the table.\n(C) Draw a conclusion about how generational replacement could affect future party coalitions.\n(D) Explain how political socialization accounts for the pattern shown in the table.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apgov-ideology-age-table.v1',
      expectedAnswer:
        "(A) Adults ages 65 and older have the highest conservative self-identification share in the table, at 45%. (B) Conservative self-identification rises steadily with age, from 23% (18-29) to 33% (30-49) to 43% (50-64) to 45% (65+). Liberal self-identification is not a perfect mirror image: it falls from 34% (18-29) to 25% (30-49) to a low of 19% (50-64), then ticks up slightly to 21% for the oldest group (65+) rather than continuing to decline. Moderate identification also declines somewhat with age, from 41% (18-29) to 32% (65+). (C) Because younger cohorts are, in this data, measurably more liberal and less conservative than older cohorts, the gradual replacement of older generations by younger ones — through mortality and through new voters entering the electorate — creates a slow but steady demographic pressure on the two major parties' ideological coalitions, potentially shifting the electorate's aggregate self-identification over successive decades even without any individual voter changing their mind, and requiring both parties to adapt their coalitions as the age composition of the electorate changes. (D) Political socialization research generally attributes this kind of age pattern more to a GENERATIONAL (cohort) effect than to a pure LIFECYCLE (aging) effect: each age cohort's political attitudes were substantially shaped by the agents of socialization and formative historical events of the era in which it came of age, and those attitudes tend to persist across that cohort's lifetime rather than converging as its members simply grow older. That is why the pattern is read as reflecting generational replacement rather than individuals personally becoming more conservative with age.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies adults ages 65 and older as the age group with the highest conservative share (45%). No credit (0/1) for any other age group, or for citing a figure not matching the 65+ value.',
            modelResponse:
              'Adults ages 65 and older have the highest conservative self-identification share, at 45%.',
          },
          {
            criterionId: 'B-describe-relationship',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes conservative identification rising steadily across all four groups (23% -> 33% -> 43% -> 45%) AND liberal identification falling through the third group before ticking up slightly for the oldest group (34% -> 25% -> 19% -> 21%), citing the actual figures. No credit (0/1) for citing figures not in the table, or for describing the liberal trend as a strict, unbroken decline across all four groups (overstating the mirror-image relationship).',
            modelResponse:
              "Conservative self-identification rises steadily with age, from 23% (18-29) to 33% (30-49) to 43% (50-64) to 45% (65+). Liberal self-identification is not a perfect mirror image: it falls from 34% to 25% to 19% across the first three groups, then ticks up slightly to 21% for the oldest group rather than continuing to decline.",
          },
          {
            criterionId: 'C-draw-conclusion',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): draws a conclusion connecting the age-ideology pattern to generational replacement\'s effect on future party coalitions — that as more-liberal younger cohorts replace more-conservative older cohorts over time, the electorate\'s aggregate ideological mix and the parties\' coalitions could gradually shift. No credit (0/1) for a response that only restates the age-group figures without connecting them to this broader implication for party coalitions.',
            modelResponse:
              "Because younger cohorts in this data are measurably more liberal and less conservative than older cohorts, the gradual replacement of older generations by younger ones — through mortality and new voters entering the electorate — creates steady demographic pressure on the two parties' ideological coalitions, potentially shifting the electorate's aggregate self-identification over successive decades and requiring both parties to adapt as the electorate's age composition changes.",
          },
          {
            criterionId: 'D-explain-socialization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains the pattern using the generational (cohort) effect versus lifecycle (aging) effect distinction, correctly identifying that political-socialization research favors the generational explanation for this kind of age pattern. No credit (0/1) for asserting a lifecycle/aging explanation instead, or for describing the pattern with no reference to socialization\'s cohort/lifecycle distinction.',
            modelResponse:
              "Political-socialization research generally attributes this kind of age pattern more to a GENERATIONAL (cohort) effect than to a pure LIFECYCLE (aging) effect: each age cohort's attitudes were substantially shaped by the formative political era in which it came of age, and those attitudes tend to persist across the cohort's lifetime rather than converging as its members simply grow older — which is why the pattern reflects generational replacement rather than individuals personally becoming more conservative with age.",
          },
        ],
      },
      hints: [
        'Part (A) wants the single age GROUP with the highest conservative share, not a different group or a liberal/moderate figure.',
        'Part (B) must note that the liberal trend is NOT a perfect mirror of the conservative trend — it ticks up slightly for the oldest group.',
        'Part (D) wants the GENERATIONAL (cohort) explanation, not a lifecycle (aging) explanation — cite the cohort-persistence reasoning from the socialization lesson.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative Analysis is 4 points, one per part, each graded independently — a data table, no thesis, no outside evidence.',
        'Identify (A) wants one specific, directly-readable value; Describe (B) wants the accurate relationship with figures cited, not an assumed perfect mirror image; Draw a Conclusion (C) states what the data implies; Explain (D) ties the data to a named course concept.',
        "Gallup's 2021 data: conservative share rises steadily with age (23% -> 33% -> 43% -> 45%); liberal share falls through age 64 then ticks up slightly for 65+ (34% -> 25% -> 19% -> 21%) — not a strict mirror image.",
        'Political-socialization research reads this pattern as a GENERATIONAL (cohort) effect — each cohort\'s formative era shapes attitudes that persist over its lifetime — rather than a LIFECYCLE (aging) effect.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ-QA',
    cedTitle: 'Unit 4 FRQ Practice — Quantitative Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Quantitative Analysis free-response task wording and 4-point rubric (1 point per lettered part).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-ideology-age-table.v1',
        chapter: '2021',
        note: 'Described data table (Gallup, "U.S. Political Ideology Steady; Conservatives, Moderates Tie," 2021 calendar-year polling) — ideological self-identification by age group; single stimulus for the Quantitative Analysis FRQ.',
      },
    ],
  },
};
