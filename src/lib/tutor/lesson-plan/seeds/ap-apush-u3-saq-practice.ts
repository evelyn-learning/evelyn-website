/**
 * AP US History — Period 3 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format).
 *
 * No stimulus: this SAQ does NOT quote or reference a document, so it does
 * NOT set `passageId` (the gotcha — a passageId is only appropriate when the
 * prompt explicitly says "using the excerpt below" and quotes it). Each of
 * the three parts is graded independently, 1 point each, brief-response
 * format (2-4 sentences), scored against the authentic AP APUSH SAQ rubric
 * style.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u3-saq-practice.v1',
  title: 'Period 3 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u3-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question on the ratification debate and its legacy in the 1790s — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-3-SAQ',
    },
  ],
  prerequisites: [
    'apush.constitution-ratification',
    'apush.new-republic',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied the fight over ratifying the Constitution and what the new republic actually looked like once it was in place. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "the government changed a lot" earns nothing, but "the Constitution created a federal government with the power to levy taxes directly, unlike the Articles of Confederation" earns credit because it names a specific power and a specific comparison.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Answer parts (a), (b), and (c).\n(a) Briefly describe ONE historical difference between the Federalists and the Anti-Federalists during the debate over ratifying the Constitution (1787-1789).\n(b) Briefly explain ONE way in which the difference described in part (a) reflected a broader disagreement about the nature of the government the Constitution created.\n(c) Briefly explain ONE way in which political developments in the 1790s, such as the emergence of the first political parties, continued the disagreement described in parts (a) and (b).',
      responseFormat: 'frq',
      expectedAnswer:
        '(a) Federalists supported ratifying the Constitution because they believed a stronger national government was needed to fix the weaknesses of the Articles of Confederation, while Anti-Federalists opposed ratification because they feared a strong central government would recreate the same threat to individual liberty and state sovereignty the Revolution had just been fought to remove. (b) This difference reflected a deeper disagreement over how much power should be concentrated at the national level versus reserved to the states and the people: Federalists (like Madison in Federalist 10) argued a large republic with a strong central government could actually control the dangers of factionalism, while Anti-Federalists (like the author of Brutus 1) argued no free republic had ever successfully governed so vast a territory without becoming tyrannical, and pushed for a Bill of Rights to explicitly limit federal power. (c) This same disagreement continued into the 1790s as the first political parties formed: Hamilton\'s Federalists continued favoring a strong, active federal government (a national bank, assumption of state debts, close ties with Britain), while Jefferson and Madison\'s Democratic-Republicans continued the Anti-Federalist-rooted suspicion of centralized power (favoring strict construction of the Constitution and states\' rights), showing the ratification-era debate over the proper scope of federal power did not end with ratification but reorganized itself into the new republic\'s first party system.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes ONE specific historical difference between the Federalists and Anti-Federalists in the ratification debate (e.g. support vs. opposition to a stronger national government, or disagreement over the need for a Bill of Rights). No credit (0/1) for a vague statement with no specific, accurate historical content, or a description that does not identify an actual difference between the two sides.',
            modelResponse:
              'Federalists supported ratifying the Constitution because they believed a stronger national government was necessary to fix the weaknesses of the Articles of Confederation, while Anti-Federalists opposed ratification because they feared a strong central government would threaten individual liberty and state sovereignty.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains HOW or WHY the difference from part (a) reflects a broader disagreement about the nature or scope of the government the Constitution created, connecting the specific difference to that larger question — not just restating part (a). No credit (0/1) for an explanation that does not connect to a broader disagreement about the nature of the government, or that merely repeats part (a) without extension.',
            modelResponse:
              'This difference reflected a deeper disagreement over how much power should be concentrated at the national level: Federalists like Madison argued in Federalist 10 that a large republic with a strong central government could actually control the dangers of factionalism, while Anti-Federalists like the author of Brutus 1 argued that no free republic had ever governed so vast a territory without becoming tyrannical, which is why Anti-Federalists pushed for a Bill of Rights to explicitly limit federal power.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific way a political development in the 1790s (e.g. the emergence of the Federalist and Democratic-Republican parties) continued the disagreement described in parts (a)/(b), naming specific figures or policies. No credit (0/1) for a vague claim that "parties formed" with no connection to the specific ratification-era disagreement, or no specific 1790s development named.',
            modelResponse:
              'This same disagreement continued into the 1790s as the first political parties formed: Hamilton\'s Federalists continued favoring an active, strong federal government (a national bank, federal assumption of state debts), while Jefferson and Madison\'s Democratic-Republicans continued the Anti-Federalist-rooted suspicion of centralized power (favoring strict construction of the Constitution and states\' rights), showing the ratification debate reorganized itself into the new republic\'s first party system rather than ending with ratification.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'Name real historical figures or documents (Madison, Federalist 10, Brutus 1, Hamilton, Jefferson) rather than describing the sides only in general terms.',
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
        '"Briefly explain" always means fact + connection to WHY/HOW it matters — a fact alone often only satisfies a "describe" part.',
        'The ratification-era disagreement over federal power (Federalists vs. Anti-Federalists) reorganized directly into the 1790s first party system (Federalists vs. Democratic-Republicans).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-SAQ',
    cedTitle: 'Period 3 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
    ],
  },
};
