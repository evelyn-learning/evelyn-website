/**
 * AP US History — Period 5 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format).
 *
 * Stimulus-based: this SAQ explicitly quotes and asks the student to use
 * the excerpt from the Emancipation Proclamation, so it DOES set
 * `passageId` — the prompt says "using the excerpt below" and reproduces
 * the seeded text (a passageId is appropriate here precisely because the
 * prompt explicitly references the document). Each of the three parts is
 * graded independently, 1 point each, brief-response format (2-4
 * sentences), scored against the authentic AP APUSH SAQ rubric style.
 *
 * Document fidelity: the excerpt contains BOTH the recital of the
 * September 22, 1862 preliminary proclamation's language ("shall be then,
 * thenceforward, and forever free") AND the operative January 1, 1863
 * order-and-declare clause ("are, and henceforward shall be free"), plus
 * the closing military-necessity frame. It does NOT include the list of
 * exempted states/parishes — the excerpt's own phrase "within said
 * designated States, and parts of States" is the evidence a student cites
 * for part (b)'s limitation, not an enumeration of which areas were
 * exempted (that specific list is outside evidence, not in the excerpt).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u5-saq-practice.v1',
  title: 'Period 5 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u5-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question using an excerpt from the Emancipation Proclamation — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-5-SAQ',
    },
  ],
  prerequisites: [
    'apush.manifest-destiny',
    'apush.sectional-crisis',
    'apush.secession-civil-war',
    'apush.emancipation',
    'apush.reconstruction',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how the Emancipation Proclamation redefined the legal status of millions of enslaved Americans in the middle of the Civil War. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. This one gives you a short excerpt from the Proclamation itself and asks you to use it directly. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: because the prompt explicitly says "using the excerpt below" and quotes the Emancipation Proclamation, your answer to part (a) must engage with what the excerpt actually says and does — not just with outside knowledge of emancipation in general.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "the Proclamation freed the slaves" earns little, but "the excerpt grounds freedom in Lincoln\'s power as Commander-in-Chief and frames the order as \'a fit and necessary war measure... warranted by the Constitution, upon military necessity\' rather than a general claim of authority to abolish slavery everywhere" earns credit because it names the specific legal basis the excerpt itself claims.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from the Emancipation Proclamation (January 1, 1863) and your knowledge of the period, answer parts (a), (b), and (c).\n"Now, therefore I, Abraham Lincoln, President of the United States, by virtue of the power in me vested as Commander-in-Chief, of the Army and Navy of the United States in time of actual armed rebellion against the authority and government of the United States, and as a fit and necessary war measure for suppressing said rebellion... I do order and declare that all persons held as slaves within said designated States, and parts of States, are, and henceforward shall be free... And upon this act, sincerely believed to be an act of justice, warranted by the Constitution, upon military necessity, I invoke the considerate judgment of mankind, and the gracious favor of Almighty God."\n(a) Describe the legal basis the excerpt claims for freeing enslaved people.\n(b) Explain ONE limitation of the Proclamation evident in the excerpt.\n(c) Explain ONE way the war\'s purpose changed as a result of emancipation.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-emancipation-proclamation.v1',
      expectedAnswer:
        '(a) The excerpt grounds the order in Lincoln\'s power "as Commander-in-Chief" of the armed forces "in time of actual armed rebellion," calling it "a fit and necessary war measure for suppressing said rebellion" and an act "warranted by the Constitution, upon military necessity" — a claim to wartime executive authority, not a claim of a general constitutional power to abolish slavery everywhere. (b) The excerpt itself limits the order to persons held as slaves "within said designated States, and parts of States" in rebellion, tying freedom to specific rebel territory rather than declaring it universally, and grounding it in temporary "military necessity" rather than a permanent constitutional guarantee — a narrower legal basis than an amendment abolishing slavery outright. (c) By framing emancipation as "an act of justice" alongside "military necessity," the Proclamation folded ending slavery into the Union\'s war aims for the first time; that shift is confirmed by the Union Army\'s subsequent enlistment of Black soldiers, including the 54th Massachusetts Infantry, transforming a war originally fought to preserve the Union into one also fought for Black freedom.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): correctly describes the legal basis the excerpt itself claims — Lincoln\'s power as Commander-in-Chief during "actual armed rebellion," framed as a "fit and necessary war measure" and warranted "upon military necessity," not a general claim of constitutional authority over slavery. No credit (0/1) for a response that ignores the excerpt\'s specific war-powers language or only asserts that the Proclamation freed enslaved people without describing the claimed legal basis.',
            modelResponse:
              'The excerpt grounds the order in Lincoln\'s power "as Commander-in-Chief" of the armed forces during "actual armed rebellion," calling it "a fit and necessary war measure" warranted "by the Constitution, upon military necessity" — a claim to wartime executive authority, not a general constitutional power to abolish slavery everywhere.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a limitation evident in the excerpt itself — e.g. that the order applies only to persons "within said designated States, and parts of States" in rebellion, rather than to enslaved people everywhere, or that it rests on temporary "military necessity" rather than a permanent constitutional guarantee. No credit (0/1) for a limitation not supported by the excerpt\'s own language, or a vague, unsupported claim.',
            modelResponse:
              'The excerpt limits the order to persons held as slaves "within said designated States, and parts of States" in rebellion, tying freedom to specific rebel territory and to temporary "military necessity" rather than declaring freedom universally or permanently.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains a specific, accurate way the war\'s purpose changed as a result of emancipation — e.g. the war becoming explicitly about ending slavery alongside preserving the Union, confirmed by the Union Army\'s recruitment of Black soldiers (such as the 54th Massachusetts) after the Proclamation. No credit (0/1) for a vague or unsupported claim.',
            modelResponse:
              "By framing emancipation as \"an act of justice\" alongside \"military necessity,\" the Proclamation folded ending slavery into the Union's war aims for the first time, a shift confirmed by the Union Army's subsequent enlistment of Black soldiers, including the 54th Massachusetts Infantry, turning a war fought to preserve the Union into one also fought for Black freedom.",
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) must engage with the excerpt\'s actual wording ("Commander-in-Chief," "war measure," "military necessity"), not just your general knowledge of emancipation.',
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
        'The Emancipation Proclamation grounded freedom in the president\'s war powers and "military necessity," limited to rebel territory — a narrower legal basis than the Thirteenth Amendment\'s later, permanent, nationwide abolition of slavery.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-SAQ',
    cedTitle: 'Period 5 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-emancipation-proclamation.v1',
        chapter: '1863',
        note: 'The Emancipation Proclamation — the stimulus excerpt for this SAQ.',
      },
    ],
  },
};
