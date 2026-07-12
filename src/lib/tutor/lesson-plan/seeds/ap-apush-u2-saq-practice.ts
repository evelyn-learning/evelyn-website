/**
 * AP US History — Period 2 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format).
 *
 * Stimulus-based: this SAQ quotes the excerpt from John Winthrop's "A Model
 * of Christian Charity" (1630) directly in the prompt ("using the excerpt
 * below"), so it DOES set `passageId` (evelyn.passage.apush-winthrop-charity.v1)
 * — the mirror case of the P1/P3 gotcha, where a passageId is appropriate
 * because the prompt explicitly references and quotes the document. The
 * quote preserves the seeded passage's exact Hanover-transcription
 * orthography ("citty upon a hill," not the modernized "city upon a hill").
 * Each of the three parts is graded independently, 1 point each, brief-
 * response format (2-4 sentences), scored against the authentic AP APUSH
 * SAQ rubric style.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u2-saq-practice.v1',
  title: 'Period 2 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u2-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question using a stimulus excerpt from John Winthrop\'s "A Model of Christian Charity" (1630) — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-2-SAQ',
    },
  ],
  prerequisites: [
    'apush.colonial-regions',
    'apush.transatlantic-economy',
    'apush.slavery-colonies',
    'apush.colonial-society',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how New England's covenant-community model compared to the other colonial regions. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. This one gives you a short stimulus excerpt to work from. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, grounded in the excerpt and in what you know. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how a stimulus-based SAQ differs from a no-stimulus one.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'A STIMULUS-BASED SAQ: some SAQs, like this one, give you a short excerpt and expect your answer to engage with it directly — "using the excerpt below" is your signal to read closely and ground your response in what the passage actually says, not just in outside knowledge about the general topic.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "Winthrop wanted a good community" earns nothing, but "Winthrop cast the colony\'s fate as a public test, watched by \'the eies of all people\'" earns credit because it engages the excerpt\'s actual language and claim.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from John Winthrop\'s "A Model of Christian Charity" (1630), answer parts (a), (b), and (c).\n\n"We are entered into Covenant with Him for this worke. … if wee shall neglect the observation of these articles… the Lord will surely breake out in wrathe against us… For wee must consider that wee shall be as a citty upon a hill. The eies of all people are uppon us."\n\n(a) Briefly describe Winthrop\'s purpose in this excerpt.\n(b) Briefly explain ONE way New England colonial society reflected the vision Winthrop describes in the excerpt.\n(c) Briefly explain ONE way a DIFFERENT colonial region\'s development contrasted with that vision.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-winthrop-charity.v1',
      expectedAnswer:
        '(a) In this excerpt, Winthrop frames the Massachusetts Bay colonists\' venture as a binding covenant with God: if they keep their commitment to a righteous, godly community, they will be blessed, but if they fail, the community\'s conduct will be watched and judged by the world as though it were a "citty upon a hill," with "the eies of all people" upon it — raising the stakes of the settlement\'s behavior to a matter of collective religious reputation, not private faith. (b) New England towns organized daily life around the church and the town meeting, and Puritan authorities enforced strict religious conformity — banishing dissenters such as Roger Williams and Anne Hutchinson — reflecting Winthrop\'s vision of a single, accountable covenant community whose religious unity the outside world was watching and judging. (c) The Chesapeake region developed in sharp contrast to Winthrop\'s vision: Virginia was founded in 1607 as a for-profit venture of the Virginia Company, and its economy organized around tobacco cultivation, the headright land-grant system, and, increasingly, coerced labor — a pursuit of individual profit with no covenant-community religious purpose comparable to Winthrop\'s Massachusetts Bay.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes Winthrop\'s purpose in the excerpt — framing the venture as a covenant with God whose success or failure will be publicly watched and judged, as a "citty upon a hill" with "the eies of all people" upon it. No credit (0/1) for a vague statement ("he wanted a good community") that does not engage the excerpt\'s actual covenant/public-judgment claim.',
            modelResponse:
              'In this excerpt, Winthrop frames the Massachusetts Bay colonists\' venture as a binding covenant with God: if they keep their commitment to a righteous, godly community, they will be blessed, but if they fail, the community\'s conduct will be watched and judged by the world as though it were a "citty upon a hill," with "the eies of all people" upon it.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way New England colonial society reflected Winthrop\'s covenant-community vision — e.g. church- and town-meeting-centered towns, family-based migration, or enforced religious conformity (banishing dissenters) — connected clearly to the excerpt\'s vision. No credit (0/1) for a vague or unconnected claim about New England.',
            modelResponse:
              'New England towns organized daily life around the church and the town meeting, and Puritan authorities enforced strict religious conformity — banishing dissenters such as Roger Williams and Anne Hutchinson — reflecting Winthrop\'s vision of a single, accountable covenant community whose religious unity the outside world was watching and judging.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way a DIFFERENT colonial region\'s development (Chesapeake, Middle Colonies, or Lower South) contrasted with Winthrop\'s covenant-community vision — e.g. the Chesapeake\'s profit-driven tobacco economy, or the Lower South\'s plantation economy built on enslaved labor — connected clearly to the contrast. No credit (0/1) for a vague or unconnected claim, or a region that does not genuinely contrast.',
            modelResponse:
              'The Chesapeake region developed in sharp contrast to Winthrop\'s vision: Virginia was founded in 1607 as a for-profit venture of the Virginia Company, and its economy organized around tobacco cultivation, the headright land-grant system, and, increasingly, coerced labor — a pursuit of individual profit with no covenant-community religious purpose comparable to Winthrop\'s Massachusetts Bay.',
          },
        ],
      },
      hints: [
        'This is a stimulus-based SAQ — ground your answer in what the excerpt actually says, not just general knowledge of Puritanism.',
        '"Briefly explain" means going one step past the fact: connect it to WHY or HOW it matters to the question asked.',
        'For part (c), pick a region that genuinely contrasts with Winthrop\'s covenant-community vision — the Chesapeake\'s profit motive or the Lower South\'s plantation economy both work well.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization, no outside-evidence requirement.',
        'A stimulus-based SAQ expects you to engage the excerpt\'s actual language and claim, not just general background knowledge on the topic.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'Winthrop\'s "citty upon a hill" covenant vision was reflected in New England\'s church- and town-centered communities, and contrasted sharply with the Chesapeake\'s profit-driven tobacco economy.',
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
    cedTitle: 'Period 2 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain), stimulus-based on a single-document excerpt.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-winthrop-charity.v1',
        chapter: '1630',
        note: 'John Winthrop, "A Model of Christian Charity" — SAQ stimulus excerpt.',
      },
    ],
  },
};
