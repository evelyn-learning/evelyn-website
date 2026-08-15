/**
 * AP US History — Period 1 SAQ Practice: a full three-part Short Answer
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

export const SEED_AP_APUSH_U1_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u1-saq-practice.v1',
  title: 'Period 1 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u1-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question on Native adaptation, the Columbian Exchange, and Spanish colonial labor systems — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-1-SAQ',
    },
  ],
  prerequisites: [
    'apush.native-societies',
    'apush.columbian-exchange',
    'apush.spanish-colonization',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how Native American societies adapted to their environments before contact, how the Columbian Exchange reshaped life on both sides of the Atlantic, and how Spanish colonial labor systems shaped the society that followed conquest. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
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
        'The single most common way students lose SAQ points is being too vague: "Native people adapted to where they lived" earns nothing, but "Pacific Northwest maritime societies relied on abundant salmon runs to support large, permanent, non-agricultural settlements" earns credit because it names a specific society, resource, and outcome.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Answer parts (a), (b), and (c).\n(a) Briefly describe ONE way Native American societies adapted to their environments before 1492.\n(b) Briefly explain ONE way the Columbian Exchange altered Native American life.\n(c) Briefly explain ONE way Spanish colonial labor systems shaped colonial society.',
      responseFormat: 'frq',
      expectedAnswer:
        '(a) Pacific Northwest maritime societies adapted to their coastal environment by relying on the annual salmon runs and other marine resources rather than agriculture, which was reliable and abundant enough to support large, permanent, socially stratified settlements that practiced the potlatch. (b) The Columbian Exchange introduced Old World diseases such as smallpox and measles, to which Native populations had no prior immunity, causing a demographic catastrophe with losses estimated as high as roughly 90% in some of the hardest-hit regions within the first century of contact — a population collapse that also weakened many Native societies\' capacity to resist colonization. (c) The Spanish encomienda system granted individual colonists the right to demand forced labor and tribute from a designated group of Native people, nominally in exchange for protection and Catholic instruction, embedding coerced Indigenous labor into the foundation of colonial society and, alongside the later repartimiento and the developing casta hierarchy, structuring who held legal standing, wealth, and authority in Spanish America.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes ONE specific way a named Native American society (or type of society) adapted its economy or way of life to its environment before 1492 — e.g. Mississippian floodplain maize agriculture at Cahokia, Ancestral Puebloan irrigated agriculture in the arid Southwest, or Pacific Northwest reliance on salmon runs without agriculture. No credit (0/1) for a vague, unnamed "lived off the land" statement with no specific society or adaptation.',
            modelResponse:
              'Pacific Northwest maritime societies adapted to their coastal environment by relying on the annual salmon runs and other marine resources rather than agriculture, which was reliable and abundant enough to support large, permanent, socially stratified settlements that practiced the potlatch.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way the Columbian Exchange altered Native American life — e.g. catastrophic disease-driven population decline (virgin soil epidemics of smallpox/measles, regionally variable but sometimes estimated as high as roughly 90% in the hardest-hit areas), or the transformative introduction of horses into Native hunting, travel, and warfare — connected to a specific effect, not just a named item with no explained impact. No credit (0/1) for a vague or unsupported claim about Native life.',
            modelResponse:
              'The Columbian Exchange introduced Old World diseases such as smallpox and measles, to which Native populations had no prior immunity, causing a demographic catastrophe with losses estimated as high as roughly 90% in some of the hardest-hit regions within the first century of contact.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way a Spanish colonial labor system (encomienda or repartimiento) shaped colonial society — e.g. embedding coerced Indigenous labor at the foundation of the colonial economy, or structuring the emerging casta hierarchy of legal status and opportunity — connected to a specific effect on society, not just a named system with no explained impact. No credit (0/1) for a vague or unsupported claim.',
            modelResponse:
              'The Spanish encomienda system granted individual colonists the right to demand forced labor and tribute from a designated group of Native people, nominally in exchange for protection and Catholic instruction, embedding coerced Indigenous labor into the foundation of colonial society and shaping the developing casta hierarchy that determined legal status and opportunity across Spanish America.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        '"Briefly explain" means going one step past the fact: connect it to WHY or HOW it matters to the question asked.',
        'Name real historical societies, systems, or events (Cahokia, Pacific Northwest maritime societies, smallpox, the encomienda) rather than describing things only in general terms.',
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
        'Name specific societies, systems, and events — Pacific Northwest maritime societies, smallpox-driven demographic catastrophe, the encomienda — rather than general statements.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-SAQ',
    cedTitle: 'Period 1 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
    ],
  },
};
