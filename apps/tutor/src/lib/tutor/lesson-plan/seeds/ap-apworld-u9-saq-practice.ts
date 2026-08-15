/**
 * AP World History: Modern — Unit 9 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ).
 *
 * Stimulus-based: this SAQ explicitly says "Use the table below" and so DOES
 * set `passageId` to the described life-expectancy data table. Each of the
 * three parts is graded independently, 1 point each, brief-response format
 * (2-4 sentences), scored against the authentic AP World SAQ rubric style.
 *
 * DOCUMENT FIDELITY: part (a) uses only the table's own described figures
 * (the four regional/world snapshots and its explicitly highlighted
 * regional gains: Asia +32 the largest, Africa +25, Europe +17 the
 * smallest) — no year or figure beyond what the passage's fullText states
 * is invented. Parts (b) and (c) go beyond the table into the student's own
 * historical knowledge (as SAQ "explain" parts do), and are careful to keep
 * that knowledge clearly separate from what the table itself shows.
 *
 * UNAMBIGUOUS KEY CHECK (part a): the table shows three regional gains —
 * Africa 37->62 (+25), Asia 42->74 (+32), Europe 62->79 (+17). Asia's +32
 * is the single largest with no tie and no alternate correct reading; the
 * passage itself states this explicitly ("the largest gain of the three
 * regions shown").
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u9-saq-practice.v1',
  title: 'Unit 9 SAQ Practice — Life Expectancy and Global Health',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u9-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using a life-expectancy data table as a stimulus — briefly identifying, describing, and explaining specific historical developments in short, focused responses — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-9-SAQ',
    },
  ],
  prerequisites: [
    'apworld.global-economy',
    'apworld.technology-communication',
    'apworld.environment-disease',
    'apworld.culture-rights-migration',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how globalization reshaped health, disease, and everyday well-being after 1945. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. This one gives you a data table as a stimulus. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly identify, describe, or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to read a described data-table stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly IDENTIFY, DESCRIBE, or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'When a stimulus is a table, "use the table" means citing its actual figures — here, world and regional life expectancy in 1950 and 2019, with Asia\'s gain of about 32 years (42 to 74) the largest of the three regions shown, ahead of Africa\'s +25 (37 to 62) and Europe\'s +17 (62 to 79, the smallest).',
        '"Briefly identify" wants a specific, accurate answer stated directly, drawn from the table\'s own figures — a sentence is enough if it names the right region and cites the table\'s numbers.',
        '"Briefly explain" wants you to go one step further than identification: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "life expectancy went up a lot" earns little, but "vaccination campaigns and antibiotics sharply reduced deaths from infectious disease across the century" earns credit because it names a specific, accurate cause.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the table below to answer parts (a), (b), and (c).\n(a) Identify the region shown in the table with the largest gain in life expectancy between 1950 and 2019.\n(b) Explain ONE cause of the global improvement in life expectancy over this period.\n(c) Explain ONE reason regional gaps in life expectancy persist despite this global improvement.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-life-expectancy-table.v1',
      expectedAnswer:
        '(a) According to the table, Asia shows the largest gain in life expectancy between 1950 and 2019, rising from about 42 years to about 74 years — a gain of roughly 32 years, larger than Africa\'s gain of about 25 years (37 to 62) or Europe\'s gain of about 17 years (62 to 79), the smallest of the three regions shown. (b) A major cause of the global improvement was the spread of public-health measures and medical advances over the century, including antibiotics, mass vaccination campaigns, and the eradication of smallpox by 1980 through a coordinated international campaign — advances that sharply reduced deaths from infectious disease across regions, including in lower-income parts of Asia and Africa that had previously lacked access to such treatments. (c) Regional gaps persist because access to healthcare infrastructure, clean water and sanitation, and public-health spending remains uneven: Europe\'s higher starting point and continued economic advantage in 1950 meant it already had more developed healthcare systems to build on, while parts of Sub-Saharan Africa faced ongoing burdens such as the HIV/AIDS epidemic beginning in the 1980s and more limited healthcare investment, meaning the gains, while real everywhere, did not fully close the gap in outcomes between regions.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately identifies Asia as the region with the largest gain in life expectancy shown in the table, citing the table\'s own figures (about 42 to about 74 years, a gain of roughly 32 years). No credit (0/1) for a vague answer with no table figure, or a region the table does not support (e.g. Africa or Europe).',
            modelResponse:
              'According to the table, Asia shows the largest gain in life expectancy between 1950 and 2019, rising from about 42 years to about 74 years — a gain of roughly 32 years, larger than either Africa\'s (+25) or Europe\'s (+17).',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate historical cause of the global improvement in life expectancy — e.g. the spread of antibiotics, mass vaccination campaigns, or the eradication of smallpox by 1980. No credit (0/1) for a vague statement with no specific, accurate historical cause, or one not connected to the global improvement.',
            modelResponse:
              'A major cause was the spread of public-health measures and medical advances over the century, including antibiotics, mass vaccination campaigns, and the eradication of smallpox by 1980 through a coordinated international campaign — advances that sharply reduced deaths from infectious disease across regions.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate reason regional gaps in life expectancy persist despite the overall global improvement, naming a specific mechanism or development (e.g. uneven healthcare infrastructure, the HIV/AIDS epidemic\'s impact in Sub-Saharan Africa, disparities in public-health spending). No credit (0/1) for a vague claim that "some regions are poorer" with no specific mechanism named.',
            modelResponse:
              'Regional gaps persist because access to healthcare infrastructure, clean water and sanitation, and public-health spending remains uneven: Europe\'s higher 1950 starting point reflected an already more developed healthcare system, while parts of Sub-Saharan Africa faced ongoing burdens such as the HIV/AIDS epidemic beginning in the 1980s and more limited healthcare investment, so gains were real everywhere but did not fully close the gap between regions.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'For part (a), cite the actual numbers from the table (both years and the size of the gain), not just a region name with no figure attached.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific identification/description/explanation per part — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'When the stimulus is a table, cite its actual figures — a specific number or comparison beats a vague trend statement.',
        'The life-expectancy table\'s clearest anchor: Asia\'s +32-year gain (42 to 74) is the largest of the three regions shown, ahead of Africa\'s +25 and Europe\'s +17.',
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
    cedTitle: 'Unit 9 SAQ Practice — Life Expectancy and Global Health',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly identify/describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-life-expectancy-table.v1',
        chapter: '1950-2019',
        note: 'World and Regional Life Expectancy at Birth data table — the SAQ\'s stimulus.',
      },
    ],
  },
};
