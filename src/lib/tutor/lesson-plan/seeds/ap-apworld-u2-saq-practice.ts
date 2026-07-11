/**
 * AP World History: Modern — Unit 2 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ).
 *
 * No stimulus: this SAQ does NOT quote or reference a document, so it does
 * NOT set `passageId` (the gotcha — a passageId is only appropriate when the
 * prompt explicitly says "using the excerpt below" and quotes it). Each of
 * the three parts is graded independently, 1 point each, brief-response
 * format (2-4 sentences), scored against the authentic AP World SAQ rubric
 * style. Prompt draws on trans-Saharan trade (2.4), Indian Ocean trade (2.3),
 * and cultural diffusion (2.6).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u2-saq-practice.v1',
  title: 'Unit 2 SAQ Practice — Trade Networks and the Spread of Islam',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u2-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question on how trade networks spread Islam across West Africa and the Indian Ocean basin — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-2-SAQ',
    },
  ],
  prerequisites: [
    'apworld.trans-saharan-trade',
    'apworld.indian-ocean-trade',
    'apworld.cultural-diffusion',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how trans-Saharan trade and Indian Ocean trade both carried Islam far beyond Arabia. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
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
        'The single most common way students lose SAQ points is being too vague: "trade spread religion" earns nothing, but "Muslim merchants carried their faith along trans-Saharan caravan routes, leading rulers like Mansa Musa to convert" earns credit because it names a specific mechanism and a specific example.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Answer parts (a), (b), and (c).\n(a) Briefly describe ONE specific reason West African rulers, such as Mansa Musa of Mali, converted to Islam during the period 1200-1450.\n(b) Briefly explain ONE way in which the conversion described in part (a) was connected to trans-Saharan trade.\n(c) Briefly explain ONE way in which the spread of Islam along the Indian Ocean trade network, in the same period, followed a similar pattern to the spread of Islam described in parts (a) and (b).',
      responseFormat: 'frq',
      expectedAnswer:
        '(a) West African rulers such as Mansa Musa converted to Islam in part because shared religion with North African Muslim merchants eased commercial relationships and gave rulers access to Islamic legal, administrative, and diplomatic networks that connected them to the wider Muslim world. (b) This conversion was directly connected to trans-Saharan trade because it was North African Muslim merchants traveling the camel caravan routes across the Sahara who first brought Islam into contact with West African elites; conversion, concentrated among rulers and urban merchant classes rather than the general rural population, strengthened trust and cooperation between West African rulers and the North African trading partners whose caravans carried the gold-salt trade that made kingdoms like Mali wealthy. (c) The Indian Ocean network\'s spread of Islam followed a similar pattern: Muslim merchants sailing the monsoon-timed dhow trade also carried their faith to Swahili coast port cities and, further east, to Southeast Asian ports, and it was again largely rulers and urban merchant elites in those port cities who converted first, seeking the same kind of commercial and diplomatic advantages with Muslim trading partners that motivated conversion in West Africa, while traditional local religions persisted widely outside those trading centers in both regions.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes ONE specific reason West African rulers converted to Islam during this period (e.g. easing commercial relationships with Muslim merchants, gaining access to Islamic legal/diplomatic networks). No credit (0/1) for a vague statement with no specific, accurate historical content, or a reason that is not historically grounded.',
            modelResponse:
              'West African rulers such as Mansa Musa converted to Islam in part because sharing a religion with the North African Muslim merchants who dominated the trans-Saharan trade eased business relationships and gave rulers access to the wider Islamic world\'s legal, administrative, and diplomatic networks.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains HOW or WHY the conversion from part (a) was connected to trans-Saharan trade specifically, connecting the religious development to the trade network — not just restating part (a). No credit (0/1) for an explanation that does not connect to trans-Saharan trade, or that merely repeats part (a) without extension.',
            modelResponse:
              'It was specifically North African Muslim merchants traveling the trans-Saharan camel caravan routes who first brought Islam into sustained contact with West African elites, so conversion — concentrated among rulers and urban merchant classes rather than the wider rural population — strengthened trust and cooperation with the very trading partners whose caravans carried the gold-salt trade that made kingdoms like Mali wealthy.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific way the Indian Ocean network\'s spread of Islam followed a similar pattern to trans-Saharan trade\'s spread of Islam, naming a specific mechanism or comparison point. No credit (0/1) for a vague claim that "Islam spread there too" with no specific comparison to parts (a)/(b).',
            modelResponse:
              'Along the Indian Ocean network, Muslim merchants sailing the monsoon-timed dhow trade likewise carried their faith to port cities on the Swahili coast and in Southeast Asia, and it was again largely rulers and urban merchant elites in those trading cities who converted first — seeking the same commercial and diplomatic advantages with Muslim trading partners that motivated Mansa Musa\'s conversion — while traditional local religions persisted widely outside those trading centers in both regions.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'Name real historical specifics (Mansa Musa, the trans-Saharan caravan routes, the dhow, Swahili coast port cities) rather than describing the pattern only in general terms.',
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
        'Islam spread through BOTH trans-Saharan and Indian Ocean trade the same way: merchants carried their faith to trading partners, and rulers/urban elites converted first for commercial and diplomatic advantage.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-SAQ',
    cedTitle: 'Unit 2 SAQ Practice — Trade Networks and the Spread of Islam',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
    ],
  },
};
