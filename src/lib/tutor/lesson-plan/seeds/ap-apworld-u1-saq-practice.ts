/**
 * AP World History: Modern — Unit 1 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ),
 * stimulus-based.
 *
 * Stimulus: Magna Carta (1215), clause 39 (Avalon Project trans.) —
 * evelyn.passage.apworld-magna-carta.v1. The prompt quotes clause 39 exactly
 * as seeded ("No freemen shall be taken or imprisoned or disseised or exiled
 * or in any way destroyed, nor will we go upon him nor send upon him, except
 * by the lawful judgment of his peers or by the law of the land."), so this
 * plan DOES set `passageId` on the try_yourself segment — distinct from the
 * medieval-europe content plan's own try_yourself, which deliberately uses a
 * non-passage SAQ on clause 12 to avoid duplicating this unit-level
 * stimulus. Each of the three parts is graded independently, 1 point each,
 * brief-response format (2-4 sentences), scored against the authentic AP
 * World SAQ rubric style. Parts (b) and (c) draw a comparison to Song
 * China's centralized civil-service bureaucracy (LO 1.1), staying consistent
 * with `ap-apworld-u1-east-asia-song.ts` and
 * `ap-apworld-u1-medieval-europe.ts`.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u1-saq-practice.v1',
  title: 'Unit 1 SAQ Practice — Magna Carta and Political Decentralization',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u1-saq-practice',
      description:
        'Answer a complete three-part, stimulus-based AP World History Short Answer Question on Magna Carta and how medieval European political decentralization differed from Song China\'s centralization — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-1-SAQ',
    },
  ],
  prerequisites: [
    'apworld.east-asia-song',
    'apworld.dar-al-islam',
    'apworld.south-southeast-asia',
    'apworld.americas-africa-states',
    'apworld.medieval-europe',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part stimulus-based SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how medieval Europe fragmented royal power among kings, barons, and the Church, and how Song China instead built one of the most centralized bureaucracies of the medieval world. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. This one gives you a short excerpt to read first — precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to use a stimulus excerpt.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: you are given a short excerpt to read before answering. Part (a) asks you to work directly from what the excerpt says; parts (b) and (c) ask you to go beyond it, using your own knowledge to compare the excerpt\'s implications to a different region.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly, grounded in what the stimulus actually says — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague, or drifting away from what the stimulus actually says: "the king had less power" earns nothing on a stimulus-based part (a), but "the excerpt requires a lawful judgment of his peers before a freeman can be imprisoned" earns credit because it is grounded directly in the excerpt\'s own wording.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below, answer parts (a), (b), and (c).\n\nExcerpt: Magna Carta (1215), clause 39: "No freemen shall be taken or imprisoned or disseised or exiled or in any way destroyed, nor will we go upon him nor send upon him, except by the lawful judgment of his peers or by the law of the land."\n\n(a) Describe the limit the excerpt places on royal power.\n(b) Explain ONE way European political decentralization in the period 1200-1450 differed from Song China\'s centralization.\n(c) Explain ONE reason for that difference.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-magna-carta.v1',
      expectedAnswer:
        '(a) The excerpt limits the king\'s power to punish his subjects arbitrarily: it requires that a "freeman" cannot be arrested, imprisoned, stripped of property, exiled, or otherwise destroyed except through "the lawful judgment of his peers or by the law of the land" — a guarantee of legal process before punishment, rather than punishment at the king\'s sole discretion. (b) European political decentralization differed from Song China\'s centralization in that medieval European monarchs shared and negotiated power with independent, semi-autonomous nobles and the Church, as seen in Magna Carta\'s baronially-imposed legal limits, while Song China concentrated authority in an emperor governing through a centrally trained, examination-selected bureaucracy that answered upward to the throne rather than negotiating limits with regional lords. (c) One reason for that difference was that medieval Europe had no continuous tradition of centralized bureaucratic administration comparable to China\'s — following the fall of the Western Roman Empire, political authority in Europe had fragmented for centuries into a patchwork of feudal lords and an independently powerful Church, so no single medieval European monarchy ever built the kind of standing, merit-selected civil service that let Chinese emperors administer such a vast territory directly, leaving European kings dependent on negotiated cooperation with their nobility instead.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes the limit the excerpt itself places on royal power — that a "freeman" cannot be arrested, imprisoned, or otherwise punished except through lawful judgment of his peers or the law of the land — grounded directly in the excerpt\'s wording. No credit (0/1) for a vague statement not grounded in the excerpt, or a description that misreads what the clause actually says.',
            modelResponse:
              'The excerpt limits the king\'s power to punish his subjects arbitrarily: a "freeman" cannot be taken, imprisoned, stripped of property, or exiled except through "the lawful judgment of his peers or by the law of the land" — a guarantee of legal process before punishment, rather than punishment at the king\'s sole discretion.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way European political decentralization (as reflected in the excerpt) differed from Song China\'s centralization — e.g. negotiated baronial/Church limits versus a centrally administered, exam-selected bureaucracy. No credit (0/1) for a vague claim with no specific comparison, or an inaccurate description of either system.',
            modelResponse:
              'European monarchs shared and negotiated power with independent, semi-autonomous nobles and the Church, as the excerpt\'s baronially-imposed legal limits on King John show, while Song China instead concentrated authority in an emperor governing through a centrally trained, examination-selected bureaucracy that answered upward to the throne rather than negotiating limits with regional lords.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, historically accurate reason for the difference described in part (b) — e.g. Europe\'s post-Roman fragmentation into feudal lordships versus China\'s continuous tradition of centralized bureaucratic administration. No credit (0/1) for a vague or unsupported claim disconnected from part (b).',
            modelResponse:
              "One reason for that difference was that medieval Europe had no continuous tradition of centralized bureaucratic administration comparable to China's: following the fall of the Western Roman Empire, political authority in Europe fragmented for centuries into a patchwork of feudal lords and an independently powerful Church, so no medieval European monarchy built a standing, merit-selected civil service like China's, leaving European kings dependent on negotiated cooperation with their nobility instead.",
          },
        ],
      },
      hints: [
        'Part (a) should stay close to the excerpt\'s own words — describe what it actually guarantees, not a general statement about medieval kings.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the question asked.',
        'For (b), contrast a SPECIFIC feature of European decentralization (negotiated baronial/Church limits) with a SPECIFIC feature of Song centralization (the exam-selected bureaucracy) — not just "Europe was weaker."',
        'For (c), look for a structural, historical reason (e.g. what happened after Rome fell) rather than restating part (b) in different words.',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A stimulus-based SAQ wants brief, specific description/explanation grounded in the excerpt — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'Part (a) stays close to the excerpt\'s own wording; parts (b) and (c) go beyond it, using outside knowledge to compare and explain.',
        'Medieval Europe\'s fragmented, negotiated royal power (Magna Carta\'s baronial limits) contrasts with Song China\'s centralized, exam-selected bureaucracy — a difference rooted in Europe\'s post-Roman political fragmentation versus China\'s continuous centralized tradition.',
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
    cedTitle: 'Unit 1 SAQ Practice — Magna Carta and Political Decentralization',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-magna-carta.v1',
        chapter: '1215',
        note: 'Magna Carta, clause 39 (Avalon Project trans.) — stimulus for the three-part SAQ.',
      },
    ],
  },
};
