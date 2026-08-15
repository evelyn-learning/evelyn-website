/**
 * AP US History — Period 9 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format), stimulus-
 * based on the legal-immigration-by-region-of-origin data table (1960s vs.
 * 2000s).
 *
 * The prompt explicitly says "Use the table" throughout, so this plan SETS
 * `passageId` (the P3 gotcha in reverse: a passageId belongs whenever the
 * prompt explicitly references the document). Each of the three parts is
 * graded independently, 1 point each, brief-response format (2-4
 * sentences), scored against the authentic AP APUSH SAQ rubric style.
 *
 * DOCUMENT FIDELITY: part (a) draws only on what the table itself shows —
 * shares of persons obtaining LAWFUL PERMANENT RESIDENT status ("green
 * cards") by region of origin, NOT immigration as a whole. Parts (b) and
 * (c) require evidence BEYOND the table (a specific legal cause, and a
 * specific political/cultural debate), which the table does not itself
 * supply. Part (c) uses MEASURED, exam-neutral framing per this period's
 * non-partisan-framing discipline — describing a genuine, documented
 * debate rather than endorsing a side.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u9-saq-practice.v1',
  title: 'Period 9 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u9-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question stimulus-based on the legal-immigration-by-region-of-origin data table — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-9-SAQ',
    },
  ],
  prerequisites: [
    'apush.conservative-resurgence',
    'apush.globalization-tech',
    'apush.america-since-2001',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how globalization, trade, and legal changes reshaped immigration to the United States after 1980. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. This one gives you a data table to work from: legal immigration by region of origin, comparing the 1960s to the 2000s. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, using the immigration-origins table as the stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement across all three parts, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THE STIMULUS: the table (adapted from the DHS/OHSS Yearbook of Immigration Statistics, Table 2) shows the share of persons obtaining LAWFUL PERMANENT RESIDENT status ("green cards") by region of origin in the 1960s versus the 2000s. In the 1960s: Europe about 35%, Asia about 11%, Latin America about 39%, and the remaining 15% from Canada, Africa, Oceania, and other/unspecified origins. In the 2000s: Europe about 13%, Asia about 34%, Latin America about 41%, and the remaining 12% from that same other-origin category. Note what the table does NOT do: it counts only lawful permanent resident admissions, not temporary visa holders, refugees/asylees processed through separate channels, or the undocumented population.',
        '"Identify" wants a specific fact stated directly from the table — here, part (a) wants the single largest region of origin in the 2000s specifically, which the table shows is Latin America (about 41%, the largest of the four categories, narrowly ahead of Asia at about 34% and far ahead of Europe at about 13%).',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — parts (b) and (c) both require evidence from OUTSIDE the table, since the table itself names no legal cause and describes no political or cultural debate.',
        'The single most common way students lose SAQ points here is treating the table as if it already supplies the specific legal cause (b) or debate (c) — it does not; those require the student\'s own outside knowledge, applied to explain what the shift the table documents actually led to.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the table below, adapted from the Department of Homeland Security\'s Yearbook of Immigration Statistics, showing the share of persons obtaining lawful permanent resident status ("green cards") by region of origin, comparing fiscal years 1960-1969 to fiscal years 2000-2009, to answer parts (a), (b), and (c).\n(a) Identify the region of origin that accounted for the largest share of these admissions in the 2000s.\n(b) Explain ONE specific legal cause of the shift shown in the table (Hint: consider a 1965 law).\n(c) Explain ONE political or cultural debate in American society that the shift shown in the table contributed to.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-immigration-origins-table.v1',
      expectedAnswer:
        '(a) The table shows Latin America accounted for the largest share of lawful permanent resident admissions in the 2000s, at about 41 percent — narrowly ahead of Asia (about 34 percent) and far ahead of Europe (about 13 percent). (b) One specific legal cause of the shift was the Immigration and Nationality Act of 1965, which abolished the national-origins quota system that had favored European immigration since the 1920s and replaced it with a system emphasizing family reunification and occupational skills, removing the structural legal preference for Europe that the table shows eroding between the 1960s and the 2000s; the Immigration Reform and Control Act of 1986, which combined legal status for certain existing undocumented residents with new sanctions on employers, would also earn credit as a related later legal change. (c) One political and cultural debate the shift contributed to was a sustained national debate over immigration enforcement and the status of undocumented immigrants, including proposals for border security measures and paths to legal status, alongside a separate debate in public education over bilingual education versus English-immersion instruction as school districts adjusted to a rapidly growing Spanish-speaking and Asian-language-speaking student population; either debate, described specifically and connected to the demographic shift, would earn credit.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies Latin America as the region of origin with the largest share of lawful permanent resident admissions in the 2000s (about 41 percent, per the table), based on what the table itself shows. No credit (0/1) for naming a different region, or for a vague description with no specific region identified.',
            modelResponse:
              'The table shows Latin America accounted for the largest share of these admissions in the 2000s, at about 41 percent — narrowly ahead of Asia (about 34 percent) and far ahead of Europe (about 13 percent).',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate legal cause of the shift shown in the table, drawing on outside knowledge since the table itself names no legal cause — e.g. the Immigration and Nationality Act of 1965 or the Immigration Reform and Control Act of 1986. No credit (0/1) for a vague claim, an inaccurate law, or one not connected to the shift shown in (a).',
            modelResponse:
              'The Immigration and Nationality Act of 1965 abolished the national-origins quota system that had favored European immigration since the 1920s, replacing it with a system emphasizing family reunification and occupational skills — the specific legal change that removed the structural preference for Europe the table shows eroding between the 1960s and the 2000s.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate political or cultural debate connected clearly to the demographic shift shown in the table, drawing on outside knowledge since the table describes no debate — e.g. debates over immigration enforcement and the status of undocumented immigrants, or debates over bilingual education versus English-immersion instruction. No credit (0/1) for a vague or unconnected claim, or a one-sided assertion presented as settled fact.',
            modelResponse:
              'The shift contributed to a sustained national debate over immigration enforcement and the legal status of undocumented immigrants, including proposals for border security measures and paths to legal status — a debate reflected in laws like the Immigration Reform and Control Act of 1986, which combined legalization for certain existing residents with new employer sanctions, and one that remained a live, unresolved political question well beyond the 2000s.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) should stick to what the table actually shows — compare all four categories before naming the largest one for the 2000s specifically.',
        'Parts (b) and (c) both require going BEYOND the table — name a real law (1965 Act, 1986 Act) and a real, specific debate (enforcement/status of undocumented immigrants, bilingual education) from your own knowledge.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization requirement across parts.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'The table counts only lawful permanent resident admissions — it never claims to describe immigration as a whole, so stick to what it actually shows: Latin America (about 41%) was the largest region of origin in the 2000s.',
        'The demographic shift the table documents was caused by a specific legal change (the Immigration and Nationality Act of 1965) and fed into real, still-contested political and cultural debates (immigration enforcement, bilingual education) that the table itself does not describe.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9-SAQ',
    cedTitle: 'Period 9 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain), stimulus-based on the legal-immigration-by-region-of-origin data table.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-origins-table.v1',
        chapter: '1960s-2000s',
        note: 'Legal immigration by region of origin data table — the SAQ\'s single stimulus document.',
      },
    ],
  },
};
