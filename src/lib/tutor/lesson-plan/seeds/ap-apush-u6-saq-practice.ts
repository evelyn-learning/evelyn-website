/**
 * AP US History — Period 6 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format), using the
 * immigration-by-decade data table as its stimulus.
 *
 * Stimulus: evelyn.passage.apush-immigration-table.v1 (the "Use the
 * table..." gotcha — a stimulus SAQ sets `passageId` because the prompt
 * explicitly references the table). Each of the three parts is graded
 * independently, 1 point each, brief-response format (2-4 sentences),
 * scored against the authentic AP APUSH SAQ rubric style.
 *
 * Document fidelity: part (b)'s region-shift percentages are shares of
 * EUROPEAN immigration specifically, per the passage's own scoping — not
 * shares of total immigration.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u6-saq-practice.v1',
  title: 'Period 6 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u6-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question using an immigration-by-decade data table as stimulus — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-6-SAQ',
    },
  ],
  prerequisites: [
    'apush.the-west-new-south',
    'apush.industrialization-big-business',
    'apush.labor-movement',
    'apush.immigration-urbanization',
    'apush.gilded-politics-populism',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how a new wave of immigration reshaped American cities during industrialization. Now you'll answer a Short Answer Question grounded in a real immigration data table — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to read the stimulus table.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'READING THE TABLE: this SAQ\'s stimulus reports total U.S. immigration by decade from 1861 to 1900, plus a breakdown of EUROPEAN sending regions for the 1880s and 1890s. The region-shift percentages in the table (roughly 16% to 43% Southern/Eastern Europe, roughly 76% to 46% Northern/Western Europe) are shares of EUROPEAN immigration only — not shares of total immigration — a scoping detail worth restating precisely if you cite the figures.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly, or in this case a correct read of the table\'s own reported figures — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "lots of immigrants came" earns nothing, but "the 1880s saw the decade\'s largest total, at roughly 5.2 million immigrants" earns credit because it names a specific decade and a specific figure drawn directly from the table.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the table above, showing U.S. immigration by decade, 1861-1900, and the shift in European sending regions, to answer parts (a), (b), and (c).\n(a) Identify the decade shown in the table with the greatest total immigration.\n(b) Explain ONE cause of the source-region shift shown in the table (the rising share of Southern and Eastern European immigration and the falling share of Northern and Western European immigration, within total European immigration, between the 1880s and 1890s).\n(c) Explain ONE political response to the immigration trends shown in the table.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-immigration-table.v1',
      expectedAnswer:
        '(a) The 1880s (1881-1890) saw the greatest total immigration in the table, at roughly 5.2 million immigrants — noticeably higher than the roughly 3.7 million who arrived in the following decade, the 1890s. (b) One cause of the shift toward Southern and Eastern European immigration (rising from about 16 percent to about 43 percent of European arrivals between the 1880s and 1890s) was worsening economic and political conditions in that region — including rural overpopulation and land shortages in Italy and the Russian and Austro-Hungarian empires, alongside organized anti-Jewish violence (pogroms) in the Russian Empire after 1881 — which pushed a new wave of emigrants toward the United States just as earlier-arriving Northern and Western European countries (Germany, Ireland, Britain, Scandinavia) were industrializing and urbanizing at home, reducing the economic pressure to emigrate from those countries. (c) One political response to these immigration trends was the passage of restrictive federal immigration law aimed specifically at newer, less-favored immigrant groups: the Chinese Exclusion Act (1882) suspended the immigration of Chinese laborers for ten years, reflecting a nativist political backlash — organized labor groups on the West Coast blamed Chinese immigrant workers for depressing wages — that intensified as the immigrant population feeding the industrial workforce grew and diversified.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly identifies the 1880s (1881-1890) as the decade of greatest total immigration shown in the table, ideally citing the approximate figure (roughly 5.2 million). No credit (0/1) for naming a different decade or giving no specific decade.',
            modelResponse:
              'The 1880s (1881-1890) saw the greatest total immigration in the table, at roughly 5.2 million immigrants, more than either the 1861-1870 decade or the following 1890s.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE accurate, specific cause of the shift toward Southern/Eastern European immigration shown in the table (e.g. rural overpopulation, land shortages, or pogroms in Southern/Eastern Europe; industrialization reducing emigration pressure in Northern/Western Europe), correctly scoped as a shift within European immigration. No credit (0/1) for a vague claim with no specific cause, or a claim that misreads the shift as one in total (rather than European) immigration.',
            modelResponse:
              'Worsening rural overpopulation, land shortages, and (in the Russian Empire after 1881) organized anti-Jewish violence (pogroms) pushed a new wave of emigrants from Italy, Austria-Hungary, and Russia toward the United States, while Germany, Ireland, Britain, and Scandinavia were industrializing and urbanizing at home, reducing the economic pressure on their own populations to emigrate — together shifting the balance of European immigration toward Southern and Eastern Europe.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate political response to the immigration trends in the table (e.g. the Chinese Exclusion Act, 1882) and connects it to nativist political pressure. No credit (0/1) for a vague claim ("people didn\'t like immigrants") with no specific law or policy named.',
            modelResponse:
              'The Chinese Exclusion Act (1882) suspended the immigration of Chinese laborers for ten years, a direct political response to nativist pressure — organized labor groups on the West Coast blamed Chinese immigrant workers for depressing wages — that intensified as the immigrant population feeding the industrial workforce grew and diversified.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'For part (a), read the table\'s own decade totals directly rather than estimating.',
        'For part (b), keep the percentages scoped to European immigration specifically, not total immigration.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'This table\'s region-shift percentages are shares of EUROPEAN immigration, not total immigration — a scoping detail worth preserving whenever you cite them.',
        'The 1880s had the greatest total immigration in the table (roughly 5.2 million); the Chinese Exclusion Act (1882) is a concrete political response to the era\'s immigration trends.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-SAQ',
    cedTitle: 'Period 6 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain), stimulus-based on a data table.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-table.v1',
        chapter: '1861-1900',
        note: 'U.S. Immigration by Decade data table — stimulus for all three SAQ parts.',
      },
    ],
  },
};
