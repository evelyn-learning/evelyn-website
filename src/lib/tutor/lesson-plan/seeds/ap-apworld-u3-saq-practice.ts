/**
 * AP World History: Modern — Unit 3 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ),
 * stimulus-based.
 *
 * Stimulus: Ogier Ghiselin de Busbecq, Turkish Letters — merit-based
 * advancement at the Ottoman court of Suleiman the Magnificent (1555,
 * Forster & Daniell 1881 PD trans.) — evelyn.passage.apworld-busbecq-
 * suleiman.v1. The prompt quotes the excerpt's central claims directly ("no
 * distinction is attached to birth among the Turks"; officers are chosen by
 * "character, ability, and disposition"; the Sultan's highest officers are
 * often "the sons of shepherds or herdsmen"), so this plan DOES set
 * `passageId` on the try_yourself segment. Each of the three parts is
 * graded independently, 1 point each, brief-response format (2-4
 * sentences), scored against the authentic AP World SAQ rubric style.
 * Part (c) draws an UNAMBIGUOUS contrast to the Mughal mansabdar/jagir
 * system (crown ownership of land, no durable inheritance for officeholders)
 * as documented in François Bernier's account, staying consistent with
 * `ap-apworld-u3-empires-administration.ts`'s own worked example comparing
 * the two systems.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u3-saq-practice.v1',
  title: 'Unit 3 SAQ Practice — Ottoman Merit-Based Advancement',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u3-saq-practice',
      description:
        'Answer a complete three-part, stimulus-based AP World History Short Answer Question on Busbecq\'s account of Ottoman merit-based advancement and how another land-based empire solved the same elite-loyalty problem differently — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-3-SAQ',
    },
  ],
  prerequisites: [
    'apworld.empires-expansion',
    'apworld.empires-administration',
    'apworld.empires-belief-systems',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part stimulus-based SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how the Ottomans built a loyal military and administrative elite out of outsiders with no independent claim to birth or land, and how the Mughals solved the very same underlying problem — an elite powerful enough to threaten the center — a completely different way. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. This one gives you a short excerpt to read first — precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to use a stimulus excerpt.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: you are given a short excerpt to read before answering. Part (a) asks you to work directly from what the excerpt says; parts (b) and (c) ask you to go beyond it, using your own knowledge to explain its significance and compare it to a different empire.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly, grounded in what the stimulus actually says — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague, or drifting away from what the stimulus actually says: "the Ottomans liked good workers" earns nothing on a stimulus-based part (a), but "the excerpt describes a recruitment system where office and rank are earned through service and character rather than inherited by birth" earns credit because it is grounded directly in the excerpt\'s own wording.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below, answer parts (a), (b), and (c).\n\nExcerpt: Ogier Ghiselin de Busbecq, Turkish Letters (1555): "No distinction is attached to birth among the Turks... In making his appointments the Sultan pays no regard to any pretensions on the score of wealth or rank, nor does he take into consideration recommendations or popularity; he considers each case on its own merits, and examines carefully into the character, ability, and disposition of the man whose promotion is in question. It is by merit that men rise in the service... Those who receive the highest offices from the Sultan are for the most part the sons of shepherds or herdsmen, and so far from being ashamed of their parentage, they actually glory in it."\n\n(a) Describe the recruitment principle the excerpt describes.\n(b) Explain how the principle described in the excerpt strengthened Ottoman central power.\n(c) Explain ONE way another land-based empire solved the same elite-loyalty problem differently.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-busbecq-suleiman.v1',
      expectedAnswer:
        '(a) The excerpt describes a recruitment principle in which office and rank are earned through demonstrated merit — the Sultan\'s "character, ability, and disposition" — rather than inherited by birth: "no distinction is attached to birth among the Turks," and the highest officers are often "the sons of shepherds or herdsmen" who "glory in" that low-born origin rather than concealing it. (b) This strengthened Ottoman central power because an elite recruited purely on merit, without any independent hereditary claim to land, wealth, or rank, owed its entire position to the Sultan\'s continued favor — with no existing family power base to fall back on, such officeholders had every incentive to remain loyal to the center rather than build an independent rival base of authority. (c) The Mughal Empire solved the same underlying problem — preventing an administrative elite from becoming an independent hereditary threat — through a different method: rather than recruiting an elite from outsiders with no prior claim to land or office, the Mughal crown legally claimed to inherit the estates of its own existing Omrahs (nobles) and Mansebdars (lesser officeholders) at death and asserted ownership of "every acre of land in the kingdom," so that officeholders held only assigned revenue rights (jagirs) rather than heritable property, preventing durable hereditary wealth from accumulating even though the elite itself was not recruited from outside.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes the recruitment principle the excerpt itself describes — that office and rank are earned through merit (character, ability, disposition) rather than inherited by birth — grounded directly in the excerpt\'s wording. No credit (0/1) for a vague statement not grounded in the excerpt, or a description that misreads what the excerpt actually says.',
            modelResponse:
              'The excerpt describes a recruitment principle in which office and rank are earned through demonstrated merit — the Sultan\'s "character, ability, and disposition" — rather than inherited by birth: "no distinction is attached to birth among the Turks," and the highest officers are often "the sons of shepherds or herdsmen" who "glory in" that origin rather than concealing it.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains how the merit-based recruitment principle described in the excerpt strengthened Ottoman central power — e.g. that an elite with no independent hereditary claim to land or office owed its position entirely to the Sultan\'s continued favor, removing any independent power base that could rival the center. No credit (0/1) for a vague claim disconnected from the excerpt\'s recruitment principle.',
            modelResponse:
              'This strengthened Ottoman central power because an elite recruited purely on merit, without any independent hereditary claim to land, wealth, or rank, owed its entire position to the Sultan\'s continued favor — with no existing family power base to fall back on, such officeholders had every incentive to remain loyal to the center rather than build an independent rival base of authority.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, historically accurate way a DIFFERENT land-based empire solved the same elite-loyalty problem through a genuinely different method — e.g. the Mughal mansabdar/jagir system\'s crown ownership of land and escheat of officeholders\' estates, the Qing pairing of hereditary banners with a civil-exam bureaucracy, or Peter the Great\'s compulsory service reforms for an existing nobility. No credit (0/1) for restating the Ottoman devshirme/merit system, or a vague/unsupported claim.',
            modelResponse:
              'The Mughal Empire solved the same underlying problem — preventing an administrative elite from becoming an independent hereditary threat — through a different method: rather than recruiting an elite from outsiders with no prior claim to land or office, the Mughal crown legally claimed to inherit the estates of its own existing Omrahs (nobles) and Mansebdars (lesser officeholders) at death and asserted ownership of "every acre of land in the kingdom," so that officeholders held only assigned revenue rights (jagirs) rather than heritable property, preventing durable hereditary wealth even though the elite itself was not recruited from outside.',
          },
        ],
      },
      hints: [
        'Part (a) should stay close to the excerpt\'s own words — describe what it actually says about how officers rise, not a general statement about the Ottoman military.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'For (b), connect the excerpt\'s no-hereditary-claim recruitment principle directly to WHY that dependence on the Sultan\'s favor strengthens central control.',
        'For (c), pick a genuinely DIFFERENT method from a different empire (Mughal, Qing, or Russian) — don\'t just restate the Ottoman devshirme/merit system in different words.',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A stimulus-based SAQ wants brief, specific description/explanation grounded in the excerpt — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'Part (a) stays close to the excerpt\'s own wording; parts (b) and (c) go beyond it, using outside knowledge to explain significance and compare to another empire.',
        'The Ottoman devshirme/merit system solved elite-loyalty by recruiting outsiders with no prior claim to land or office; the Mughal mansabdar/jagir system instead solved it by legally denying an existing elite durable inheritance — two genuinely different methods to the same underlying goal.',
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
    cedTitle: 'Unit 3 SAQ Practice — Ottoman Merit-Based Advancement',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-busbecq-suleiman.v1',
        chapter: '1555',
        note: 'Ogier Ghiselin de Busbecq, Turkish Letters — stimulus for the three-part SAQ.',
      },
    ],
  },
};
