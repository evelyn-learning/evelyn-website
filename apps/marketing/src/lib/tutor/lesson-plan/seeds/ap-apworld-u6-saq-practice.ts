/**
 * AP World History: Modern — Unit 6 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ).
 *
 * Stimulus-based: this SAQ explicitly asks the student to use the excerpt
 * below, so it sets `passageId` — evelyn.passage.apworld-lin-zexu.v1, Lin
 * Zexu's 1839 letter to Queen Victoria (the same excerpt seeded as Document 2
 * of the Unit-6 DBQ packet). Each of the three parts is graded independently,
 * 1 point each, brief-response format (2-4 sentences), scored against the
 * authentic AP World SAQ rubric style. Prompt draws on economic imperialism
 * (6.4-6.6, the Opium Wars and unequal treaties).
 *
 * DOCUMENT FIDELITY: the excerpt itself only makes the moral appeal
 * (Britain's own domestic prohibition of opium; the mutual benefit of
 * Anglo-Chinese trade in tea and rhubarb) — it does not narrate the war or
 * its outcome. Part (c) asks about the historical CONSEQUENCE of Britain's
 * rejection of that argument, which is explicitly framed as the student's
 * own outside knowledge of what followed (the First Opium War and the
 * Treaty of Nanjing), not as content drawn from the excerpt.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u6-saq-practice.v1',
  title: 'Unit 6 SAQ Practice — Lin Zexu and the Opium Wars',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u6-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using a stimulus excerpt from Lin Zexu\'s 1839 letter to Queen Victoria — briefly describing the excerpt\'s argument, explaining the historical situation that produced it, and explaining a consequence of its rejection — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-6-SAQ',
    },
  ],
  prerequisites: [
    'apworld.imperial-expansion',
    'apworld.imperial-resistance',
    'apworld.economic-imperialism',
    'apworld.global-migration',
    'apworld.reform-responses',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how the Opium Wars turned China from a trading partner on relatively equal footing into a state subjected to unequal treaties and foreign spheres of influence. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part — using a real 1839 letter as your stimulus. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, using the Lin Zexu excerpt as the stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: parts (a) and (b) require you to engage with what the excerpt actually says and the situation that produced it; part (c) asks you to go beyond the excerpt, using your own knowledge of what happened AFTER Britain rejected the argument the excerpt makes — the excerpt itself does not narrate the war or its outcome.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — here, describing the specific argument Lin Zexu makes in the excerpt (that Britain\'s own domestic ban on opium shows it knows the drug is harmful, so it should not profit by exporting it to China).',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — for part (b), connecting the letter to the specific situation (large-scale opium smuggling by British merchants, draining Chinese silver, addicting a growing population) that provoked it; for part (c), connecting Britain\'s rejection of Lin\'s argument to a specific consequence (the First Opium War and the unequal Treaty of Nanjing that followed).',
        'The single most common way students lose SAQ points is being too vague: "China and Britain disagreed about opium" earns nothing, but "Lin Zexu argued that because Britain banned opium at home, it should not profit by exporting it to China" earns credit because it states the excerpt\'s actual argument.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from Lin Zexu\'s 1839 letter to Queen Victoria, answer parts (a), (b), and (c).\n(a) Briefly describe the argument the excerpt makes.\n(b) Briefly explain ONE aspect of the historical situation that produced the excerpt.\n(c) Briefly explain ONE consequence of Britain\'s rejection of the argument made in the excerpt.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-lin-zexu.v1',
      expectedAnswer:
        '(a) The excerpt argues that because Britain itself prohibits opium "with the utmost strictness and severity" at home, knowing full well "how hurtful it is to mankind," it has no right to profit by exporting that same harmful drug to China; Lin Zexu contrasts this with China\'s own exports (tea, rhubarb, and other goods), which he insists are all "beneficial to mankind," to argue that Anglo-Chinese trade could be mutually beneficial if Britain stopped selling opium. (b) This letter was produced amid a large-scale illegal opium trade in which British merchants (and the East India Company\'s opium production in India) were smuggling growing quantities of opium into China through Canton, addicting a rising share of the Chinese population and draining Chinese silver reserves to pay for it — a crisis serious enough that the Qing court sent Lin Zexu to Canton as imperial commissioner specifically to suppress the trade, including by confiscating and destroying British opium stocks. (c) Britain rejected Lin\'s argument and went to war rather than end the opium trade, and China\'s defeat in the resulting First Opium War (1839-1842) led to the Treaty of Nanjing, which ceded Hong Kong to Britain, opened five treaty ports to British trade, and imposed a large indemnity on China — the first of the "unequal treaties" that subordinated China\'s formal sovereignty to Western economic interests for the rest of the century.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes the argument the excerpt makes — that Britain\'s own domestic prohibition of opium shows it knows the drug is harmful, so it should not profit by exporting it to China, especially when China\'s own exports to Britain are beneficial. No credit (0/1) for a vague statement with no specific reference to the excerpt\'s actual argument, or a description that misstates it.',
            modelResponse:
              'The excerpt argues that because Britain itself strictly prohibits opium at home, knowing it is harmful, Britain has no right to profit by exporting that same harmful drug to China — especially since China\'s own exports to Britain, such as tea and rhubarb, are all beneficial rather than harmful.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific aspect of the historical situation that produced the letter — e.g. large-scale British/East India Company opium smuggling into China draining Chinese silver and addicting a growing population, prompting the Qing court to send Lin Zexu to Canton to suppress the trade. No credit (0/1) for an explanation with no specific historical grounding, or one that does not connect to why the letter was written.',
            modelResponse:
              'The letter was produced amid a large-scale illegal opium trade in which British merchants smuggled growing quantities of opium into China through Canton, addicting a rising share of the population and draining Chinese silver reserves, a crisis serious enough that the Qing court sent Lin Zexu to Canton as imperial commissioner specifically to suppress the trade.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, historically accurate consequence of Britain\'s rejection of the excerpt\'s argument — e.g. the First Opium War and the resulting Treaty of Nanjing (ceding Hong Kong, opening treaty ports, imposing an indemnity). No credit (0/1) for a vague claim with no specific consequence named, or a consequence that is not historically accurate.',
            modelResponse:
              'Britain rejected Lin\'s argument and fought the First Opium War rather than end the opium trade; China\'s defeat led to the Treaty of Nanjing (1842), which ceded Hong Kong to Britain, opened five treaty ports to British trade, and imposed a large indemnity — the first of the unequal treaties that subordinated China\'s sovereignty to Western economic interests.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) asks only what the excerpt itself argues — don\'t reach beyond it for part (a).',
        'Part (c) is the one place you go BEYOND the excerpt: it does not narrate the war or the Treaty of Nanjing, so bring in that outside knowledge yourself.',
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
        'The excerpt only makes Lin Zexu\'s moral appeal — it does not narrate the war. Part (c) requires your own outside knowledge of the First Opium War and the Treaty of Nanjing.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-SAQ',
    cedTitle: 'Unit 6 SAQ Practice — Lin Zexu and the Opium Wars',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-lin-zexu.v1',
        chapter: '1839',
        note: 'Lin Zexu, letter to Queen Victoria — stimulus excerpt for this SAQ.',
      },
    ],
  },
};
