/**
 * AP US Government & Politics — Unit 1 FRQ Practice: Quantitative Analysis
 * (AP Gov FRQ 2) — 4 points, one point per lettered part, scored against a
 * single data-table stimulus.
 *
 * Format (per the authentic AP Gov Quantitative Analysis FRQ): a table or
 * chart, followed by four parts — (A) IDENTIFY a specific value/trend
 * directly readable from the data, (B) DESCRIBE a trend shown in the data,
 * (C) DRAW A CONCLUSION relating that trend to a political relationship or
 * process, and (D) EXPLAIN how the data relates to a course concept or
 * political principle.
 *
 * Stimulus: evelyn.passage.apgov-federal-grants-table.v1, the described
 * data table already anchoring the Unit-1 federalism content plan
 * (ap-apgov-u1-federalism.ts) — federal grants-in-aid outlays, 1990-2019,
 * in constant FY2017 dollars and as a share of total federal outlays, plus
 * a FY2019 categorical/block breakdown. GOTCHA GUARDED AGAINST (from the
 * federalism content plan's own docblock): the DOLLAR column rises
 * monotonically across all four years ($256B -> $416B -> $680B -> $692B),
 * but the SHARE column does NOT — it PEAKS in 2010 (10.8% -> 16.0% ->
 * 17.6% -> 16.2%). Every part below and every modelResponse is answerable
 * strictly from those seeded figures; nothing here claims the share grew
 * monotonically or invents a number the passage does not contain.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_FRQ_QUANTITATIVE: LessonPlan = {
  id: 'evelyn.ap.apgov.u1-frq-quantitative.v1',
  title: 'Unit 1 FRQ Practice — Quantitative Analysis',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u1-frq-quantitative',
      description:
        'Answer a complete AP Gov Quantitative Analysis free-response question from a federal grants-in-aid data table — identifying a value, describing a trend, drawing a conclusion about federal-state relations, and explaining how the data relates to a federalism concept — scored against the authentic AP Gov 4-point Quantitative Analysis rubric (1 point per part).',
      standard: 'AP-APGOV-1-FRQ-QA',
    },
  ],
  prerequisites: ['apgov.federalism-foundations'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the data-table FRQ concrete, and name the format\'s biggest trap: describing a number that isn\'t actually in the table, or claiming every column moves the same way.',
      script:
        "One of the four AP Gov free-response questions hands you a table or chart instead of a scenario or a court case — the Quantitative Analysis FRQ, worth 4 points. It rewards precision, not eloquence: every part is graded against what the data ACTUALLY shows, and the single most common way to lose points is to describe a trend that sounds plausible but isn't what the numbers say — for instance, assuming that because one column in a table rises every year, every related column must too. Today you'll work a table on federal grants-in-aid to the states — the same one from last lesson's federalism content — and answer all four parts exactly the way the data supports, not the way you'd guess.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qa-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Quantitative Analysis FRQ asks for and how the 4-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get one data table or chart and four parts, each worth 1 point and graded independently. Nothing here asks for a thesis or outside evidence — every part is answered directly from the data in front of you.',
        'PART (A) — IDENTIFY (0-1 point): the lowest bar of the four. Full credit requires stating a specific value or fact that is directly readable from the table — a single number, category, or year — with no interpretation required. Getting the specific value wrong (reading the wrong row or column) earns no credit even if the rest of the response is strong.',
        'PART (B) — DESCRIBE A TREND (0-1 point): full credit requires describing how a value changes across the data shown (rises, falls, stays roughly flat, changes unevenly) with the actual figures cited, not just asserting a change happened. A trend claim must be true for the SPECIFIC column being asked about — a table can have one column trending one way and a related column trending a different way.',
        'PART (C) — DRAW A CONCLUSION (0-1 point): full credit requires going one step beyond describing the trend to interpreting what it means for a political relationship, institution, or process — here, what a change in federal grant dollars implies about the balance of influence between the federal government and the states. A conclusion restates description if it stops at "the number went up"; it must say what that increase DOES.',
        'PART (D) — EXPLAIN THE DATA\'S RELATION TO A COURSE CONCEPT (0-1 point): full credit requires connecting a specific piece of the data to a named course concept or principle (here, fiscal federalism / categorical vs. block grants) and explaining HOW the data illustrates that concept, not just naming the concept in passing.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: reading the wrong column (confusing a dollar figure with a percentage-share figure, which frequently move differently in the same table), or assuming a trend that holds for one column must also hold for a different column in the same table.',
        'Total = 4 points, one per part, each graded independently — the authentic AP Gov Quantitative Analysis scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-quantitative-analysis-frq',
      kind: 'try_yourself',
      problem:
        "Use the table to answer the question. Answer parts (A), (B), (C), and (D).\n\n(A) Identify the fiscal year shown in the table in which federal grants-in-aid represented the HIGHEST percentage of total federal outlays.\n(B) Describe the trend in the DOLLAR AMOUNT of federal grants-in-aid shown in the table from 1990 to 2019.\n(C) Draw a conclusion about how the trend you described in part (B) affects the relationship between the federal government and the states.\n(D) Explain how the data in the table's final row relates to the concept of fiscal federalism.",
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apgov-federal-grants-table.v1',
      expectedAnswer:
        "(A) 2010 is the fiscal year in which federal grants-in-aid represented the highest share of total federal outlays, at 17.6%. (B) The dollar amount of federal grants-in-aid rose at every interval shown in the table: from $256 billion in 1990 to $416 billion in 2000, to $680 billion in 2010, to $692 billion in 2019 — a rising trend across all three decades, though the increase slowed sharply in the final decade (only +$12 billion from 2010 to 2019, versus +$160 billion and +$264 billion in the two prior decades). (C) Because real grant dollars to states grew substantially over this period, the federal government's fiscal leverage over state and local policy also grew: with more federal money flowing to states, the federal government gained a larger financial tool for shaping state and local decisions, deepening the fiscal relationship between the two levels of government even as the SHARE of the federal budget devoted to grants eased slightly after peaking in 2010. (D) The table's final row shows that of the $692 billion in fiscal year 2019 grant outlays, about $581 billion (84%) came as categorical grants restricted to narrowly defined purposes with conditions attached, while only about $111 billion (16%) came as block grants that leave states broader discretion — illustrating fiscal federalism in action: most of the federal government's grant money reaches the states with federally defined strings attached, meaning Washington retains substantial influence not just over how much money states receive, but over how they are allowed to spend it.",
      rubric: {
        parts: [
          {
            criterionId: 'A-identify',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies 2010 as the fiscal year with the highest share of federal outlays (17.6%) among the four years shown. No credit (0/1) for any other year, or for citing the dollar figure instead of the percentage-share figure.',
            modelResponse:
              'Fiscal year 2010 is the year in which federal grants-in-aid represented the highest percentage of total federal outlays, at 17.6% — higher than 1990 (10.8%), 2000 (16.0%), or 2019 (16.2%).',
          },
          {
            criterionId: 'B-describe-trend',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes the dollar-amount trend as rising at every interval from 1990 to 2019, citing the actual figures ($256B -> $416B -> $680B -> $692B). No credit (0/1) for describing a decline, a flat trend, or citing figures not in the table.',
            modelResponse:
              'The dollar amount of federal grants-in-aid rose at every interval shown: $256 billion in 1990, $416 billion in 2000, $680 billion in 2010, and $692 billion in 2019 — a consistent upward trend across all three decades, though growth clearly slowed in the final decade shown.',
          },
          {
            criterionId: 'C-draw-conclusion',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): draws a conclusion that goes beyond restating the trend, explaining what rising grant dollars imply about the federal government\'s fiscal influence or leverage over the states. No credit (0/1) for a response that only restates the dollar figures without interpreting their significance for federal-state relations.',
            modelResponse:
              "Because real federal grant dollars to the states grew substantially across this period, the federal government's capacity to use funding as a tool of influence over state and local policy grew as well — a larger flow of grant money gives Washington more leverage to attach conditions and shape how states act, deepening fiscal federalism's role in the federal-state relationship even as grants' share of the overall federal budget eased somewhat after its 2010 peak.",
          },
          {
            criterionId: 'D-explain-pattern',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): connects the FY2019 categorical/block breakdown ($581B/84% categorical vs. $111B/16% block) to the concept of fiscal federalism, explaining that the dominance of categorical grants means the federal government retains substantial control over how states spend most grant money. No credit (0/1) for citing figures not in the table, or for naming "fiscal federalism" with no explanation of how the data illustrates it.',
            modelResponse:
              "The table's final row shows that of the $692 billion in FY2019 grant outlays, about $581 billion (84%) is categorical — restricted to a narrow purpose with conditions attached — while only about $111 billion (16%) is block funding that leaves states broader discretion. This illustrates fiscal federalism: because the large majority of federal grant dollars arrive as categorical rather than block grants, the federal government retains significant control over HOW states spend the money, not merely over how much of it they receive.",
          },
        ],
      },
      hints: [
        'Part (A) wants the SHARE column, not the dollar column — check which one actually peaks where.',
        'The dollar column and the share column do NOT move the same way after 2010 — don\'t assume one trend applies to both.',
        'Part (D) is about the table\'s LAST row (the categorical/block breakdown), not the four-year dollar or share trend.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative Analysis is 4 points, one per part, each graded independently — a data table, no thesis, no outside evidence.',
        'Identify (A) wants one specific, directly-readable value; Describe (B) wants an accurate trend with the actual figures cited; Draw a Conclusion (C) goes one step beyond the trend to what it MEANS; Explain (D) ties data to a named course concept.',
        'In this table, the DOLLAR column rises every interval ($256B -> $692B), but the SHARE column PEAKS in 2010 (17.6%) and eases by 2019 (16.2%) — don\'t assume both columns trend identically.',
        'Categorical grants ($581B, 84% in FY2019) dominate block grants ($111B, 16%) — fiscal federalism mostly operates through conditional, not discretionary, federal money.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ-QA',
    cedTitle: 'Unit 1 FRQ Practice — Quantitative Analysis',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Quantitative Analysis free-response task wording and 4-point rubric (1 point per lettered part).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federal-grants-table.v1',
        chapter: '1990-2019',
        note: 'Described data table (OMB Historical Tables, Table 12.1) — federal grants-in-aid outlays and categorical/block breakdown; single stimulus for the Quantitative Analysis FRQ.',
      },
    ],
  },
};
