/**
 * AP US History — Period 4 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format).
 *
 * Stimulus-based: this SAQ explicitly quotes and asks the student to use
 * the excerpt from the Declaration of Sentiments (Seneca Falls Convention,
 * 1848), so it DOES set `passageId` — the prompt says "using the excerpt
 * below" and reproduces the seeded text (the gotcha, in reverse, from
 * Period 3's SAQ precedent: a passageId is appropriate here precisely
 * because the prompt explicitly references the document). Each of the
 * three parts is graded independently, 1 point each, brief-response format
 * (2-4 sentences), scored against the authentic AP APUSH SAQ rubric style.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u4-saq-practice.v1',
  title: 'Period 4 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u4-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question using an excerpt from the Declaration of Sentiments — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-4-SAQ',
    },
  ],
  prerequisites: [
    'apush.jefferson-era',
    'apush.market-revolution',
    'apush.jacksonian-democracy',
    'apush.reform-awakening',
    'apush.slavery-south',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied the reform movements the Second Great Awakening inspired, including the Seneca Falls Convention. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. This one gives you a short excerpt from the Declaration of Sentiments and asks you to use it directly. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: because the prompt explicitly says "using the excerpt below" and quotes the Declaration of Sentiments, your answer to part (a) must engage with what the excerpt actually says and does — not just with outside knowledge of the women\'s rights movement in general.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "the excerpt argues for equality" earns little, but "the excerpt deliberately echoes the Declaration of Independence\'s own language, changing \'all men\' to \'all men and women are created equal,\' to argue women\'s exclusion betrays the nation\'s founding principles" earns credit because it names the specific rhetorical strategy.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from the Declaration of Sentiments (Seneca Falls Convention, 1848) and your knowledge of the period, answer parts (a), (b), and (c).\n"We hold these truths to be self-evident; that all men and women are created equal; that they are endowed by their Creator with certain inalienable rights; that among these are life, liberty, and the pursuit of happiness; that to secure these rights governments are instituted, deriving their just powers from the consent of the governed."\n(a) Briefly describe the strategy the excerpt uses to advance its claim.\n(b) Briefly explain ONE historical development that led to the Seneca Falls Convention.\n(c) Briefly explain ONE way another antebellum reform movement shared the excerpt\'s approach.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-seneca-falls.v1',
      expectedAnswer:
        '(a) The excerpt deliberately mirrors the Declaration of Independence\'s exact structure and language — "We hold these truths to be self-evident," "life, liberty, and the pursuit of happiness," "deriving their just powers from the consent of the governed" — but inserts one crucial change, "all men and women are created equal," to argue that denying women full citizenship betrays principles Americans already claimed to hold as self-evident. (b) Many Seneca Falls organizers, including Elizabeth Cady Stanton and Lucretia Mott, had been active first in the abolition movement, where their own exclusion from full participation (such as being barred from speaking at some anti-slavery conventions) sharpened their sense of women\'s political exclusion and led directly to organizing a convention devoted to women\'s rights. (c) William Lloyd Garrison\'s abolitionist movement used a similar natural-rights strategy in The Liberator, arguing that slavery contradicted the same self-evident principle that all people are entitled to inalienable rights — applying the founding generation\'s own language to a different excluded group, just as the Declaration of Sentiments did for women.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly describes the strategy visible in the excerpt — deliberately echoing the Declaration of Independence\'s language and structure ("self-evident," "created equal," "consent of the governed") while inserting women, to argue women\'s exclusion betrays the nation\'s own founding principles. No credit (0/1) for a response that ignores the excerpt\'s specific borrowed language or only asserts a general claim about equality.',
            modelResponse:
              'The excerpt deliberately mirrors the Declaration of Independence\'s exact language and structure, changing "all men" to "all men and women are created equal," to argue that denying women full citizenship contradicts principles Americans already claimed to hold as self-evident.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains a specific, accurate historical development leading to the Seneca Falls Convention — e.g. women\'s prior activism in the abolition movement (many organizers, including Stanton, came directly out of it), or the Second Great Awakening\'s emphasis on moral reform and self-improvement. No credit (0/1) for a vague or unsupported development.',
            modelResponse:
              "Many Seneca Falls organizers, including Elizabeth Cady Stanton, had been active first in the abolition movement, where their exclusion from full participation sharpened their sense of women's own political exclusion and led directly to organizing a convention for women's rights.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains a specific, accurate way another antebellum reform movement shared the excerpt\'s approach — e.g. Garrison\'s abolitionism also invoking natural-rights/"created equal" language against slavery. No credit (0/1) for a disconnected or vague comparison.',
            modelResponse:
              "William Lloyd Garrison's abolitionist movement used a similar natural-rights strategy in The Liberator, arguing that slavery contradicted the same principle that all people are entitled to inalienable rights — applying the founding generation's own language to a different excluded group, just as the Declaration of Sentiments did for women.",
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) must engage with the excerpt\'s actual wording, not just your general knowledge of the women\'s rights movement.',
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
        'When the prompt says "using the excerpt below," your answer must engage with the excerpt\'s actual content, not just outside knowledge.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'The Declaration of Sentiments deliberately reused the Declaration of Independence\'s language — the same rhetorical strategy Garrison\'s abolitionism used for a different excluded group.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-SAQ',
    cedTitle: 'Period 4 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-seneca-falls.v1',
        chapter: '1848',
        note: 'Declaration of Sentiments — the stimulus excerpt for this SAQ.',
      },
    ],
  },
};
