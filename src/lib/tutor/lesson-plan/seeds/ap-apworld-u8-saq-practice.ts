/**
 * AP World History: Modern — Unit 8 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ).
 *
 * Stimulus-based: this SAQ explicitly says "Use the table below" and so DOES
 * set `passageId` to the described UN-membership-table data document. Each
 * of the three parts is graded independently, 1 point each, brief-response
 * format (2-4 sentences), scored against the authentic AP World SAQ rubric
 * style.
 *
 * DOCUMENT FIDELITY: part (a) uses only the table's own described figures
 * (the seven decade snapshots and its explicitly highlighted 1960 single-
 * year jump, 82->99, +17, 16 of 17 newly independent African states) — no
 * year or figure beyond what the passage's fullText states is invented.
 * Parts (b) and (c) go beyond the table into the student's own historical
 * knowledge (as SAQ "explain" parts do), and are careful to keep that
 * knowledge clearly separate from what the table itself shows.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u8-saq-practice.v1',
  title: 'Unit 8 SAQ Practice — Decolonization and United Nations Growth',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u8-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using a UN-membership-growth data table as a stimulus — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-8-SAQ',
    },
  ],
  prerequisites: [
    'apworld.cold-war-global',
    'apworld.decolonization-wave',
    'apworld.new-states',
    'apworld.end-cold-war',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how decolonization reshaped the international order after 1945. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. This one gives you a data table as a stimulus. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to read a described data-table stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'When a stimulus is a table, "use the table" means citing its actual figures — here, seven decade snapshots (51 members in 1945, rising to 189 by 2000) and its one explicitly highlighted single-year event: the jump from 82 to 99 members in 1960, the largest one-year increase shown, of which 16 of the 17 new members were newly independent African states.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "more countries joined the UN" earns little, but "16 of the 17 states admitted in 1960 were newly independent African states, reflecting that year\'s wave of decolonization" earns credit because it names a specific figure and a specific historical cause.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the table below to answer parts (a), (b), and (c).\n(a) Identify the year in which United Nations membership grew by the largest number of new members in a single year, according to the table.\n(b) Explain ONE specific historical development behind the growth you identified in part (a).\n(c) Explain ONE way in which the arrival of the new members described in the table changed the agenda of the United Nations.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-un-membership-table.v1',
      expectedAnswer:
        '(a) According to the table, United Nations membership grew by the largest number of new members in a single year in 1960, when membership rose from 82 to 99 members — an increase of 17 in one year, the largest single-year jump the table describes at any point. (b) That growth was driven by decolonization in Africa: the table itself notes that 16 of the 17 states admitted in 1960 were newly independent African states — most of them former French colonies, along with Nigeria (British) and Somalia — part of a wave in which colonies across sub-Saharan Africa achieved independence in rapid succession as the European colonial powers, weakened since the Second World War, could no longer sustain their empires against rising nationalist movements. (c) The arrival of dozens of newly independent African and Asian member states shifted the UN General Assembly\'s agenda toward anti-colonial and self-determination concerns — most concretely in the General Assembly\'s 1960 Declaration on the Granting of Independence to Colonial Countries and Peoples, which declared that the subjection of peoples to alien rule violates human rights — reflecting that new members now had the votes to push decolonization and, later, economic development onto the agenda alongside the Cold War security issues that had dominated the UN\'s first fifteen years.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately identifies 1960 as the year of the largest single-year increase in UN membership shown in the table, citing the table\'s own figures (membership rising from 82 to 99 members, an increase of 17 in that one year). No credit (0/1) for a vague answer with no table figure, or a year the table does not support.',
            modelResponse:
              'According to the table, the largest single-year increase in UN membership came in 1960, when membership rose from 82 to 99 members — an increase of 17 new members in that one year alone, the largest one-year jump the table describes.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate historical development connected to the growth identified in part (a) — e.g. the wave of African decolonization reflected in the table\'s own note that 16 of the 17 states admitted in 1960 were newly independent African states. No credit (0/1) for a vague statement with no specific, accurate historical development, or one not connected to the growth in part (a).',
            modelResponse:
              'That growth was driven by decolonization in Africa: the table notes that 16 of the 17 states admitted in 1960 were newly independent African states — most of them former French colonies, along with Nigeria (British) and Somalia — part of a wave in which colonies across sub-Saharan Africa achieved independence in rapid succession as the European colonial powers, weakened since World War II, could no longer sustain their empires against rising nationalist movements.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific way the new members described in the table changed the UN\'s agenda, naming a specific mechanism or development (e.g. the 1960 Declaration on the Granting of Independence to Colonial Countries and Peoples, a shift toward anti-colonial or development concerns). No credit (0/1) for a vague claim that "the UN changed" with no specific mechanism named.',
            modelResponse:
              'The arrival of dozens of newly independent African and Asian member states shifted the General Assembly\'s agenda toward anti-colonial and self-determination concerns, most concretely in its 1960 Declaration on the Granting of Independence to Colonial Countries and Peoples, since new members now had the votes to push decolonization — and later economic development — onto the agenda alongside the Cold War security issues that had dominated the UN\'s first fifteen years.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'For part (a), cite an actual number from the table (the specific year and the size of that year\'s jump), not just a year with no figure attached.',
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
        'When the stimulus is a table, cite its actual figures — a specific number or comparison beats a vague trend statement.',
        'The UN membership table\'s 1960s surge, especially the 1960 jump (82 to 99 members, 16 of 17 newly independent African states), is the table\'s clearest link between decolonization and the international order.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-SAQ',
    cedTitle: 'Unit 8 SAQ Practice — Decolonization and United Nations Growth',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-un-membership-table.v1',
        chapter: '1945-2000',
        note: 'Growth in United Nations Membership data table — the SAQ\'s stimulus.',
      },
    ],
  },
};
