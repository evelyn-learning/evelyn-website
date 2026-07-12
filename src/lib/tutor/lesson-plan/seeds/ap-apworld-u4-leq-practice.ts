/**
 * AP World History: Modern — Unit 4 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Atlantic slave trade's transformation of West African
 * societies (LO 4.6), drawing on the surrounding Unit-4 content (maritime
 * empires, resistance and accommodation), scored against the authentic AP
 * World 6-point LEQ rubric. MEASURED, EXAM-NEUTRAL TONE throughout: the
 * essay discusses political and economic effects (the gun-slave cycle,
 * diplomatic engagement) rather than graphic detail of the trade itself.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u4-leq-practice.v1',
  title: 'Unit 4 LEQ Practice — The Atlantic Slave Trade and West African Societies',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u4-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which the Atlantic slave trade transformed West African societies, 1450-1750 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-4-LEQ',
    },
  ],
  prerequisites: [
    'apworld.maritime-exploration',
    'apworld.columbian-exchange-global',
    'apworld.maritime-empires',
    'apworld.atlantic-slave-trade',
    'apworld.resistance-accommodation',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied the Atlantic slave trade's scale and geography, how it drew coastal West African states into supplying captives for European traders, and how those same states responded diplomatically and militarily. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which the Atlantic slave trade transformed West African societies\' politics and economies, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that before sustained transatlantic contact, West and West-Central Africa already had established states and long-distance trade networks (including trans-Saharan trade in gold and salt) — the preexisting political landscape into which Portuguese coastal trading posts, beginning in the mid-15th century, and the growing Atlantic trade were inserted, rather than a blank slate awaiting European arrival.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the scale of the trade (historians estimate roughly 12.5 million enslaved Africans were embarked across its full history), the gun-slave cycle in which coastal states such as Dahomey and Asante traded captives for European firearms that funded further wars and raids, and the kingdom of Kongo\'s sustained diplomatic engagement with Portugal, including King Afonso I\'s formal correspondence raising concerns about the trade\'s disruptive effects.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW growing European demand for captive labor specifically CAUSED some coastal states to seek firearms through the trade, which in turn CAUSED escalating warfare and raiding that produced still more captives (a self-reinforcing cycle), while ALSO explaining that established states like Kongo pursued a different, continuous pattern of diplomatic engagement rather than being reduced to a single uniform response.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Atlantic slave trade transformed West African societies in the period from 1450 to 1750. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Atlantic slave trade transformed West African societies to a significant extent by drawing coastal states into a self-reinforcing cycle of trading captives for firearms that reorganized regional political power and intensified warfare, even as established states such as Kongo responded through sustained diplomacy rather than being reduced to a single uniform pattern of transformation. Contextualization explains that before sustained transatlantic contact, West and West-Central Africa already possessed established states and long-distance trade networks, including trans-Saharan trade in gold and salt — a preexisting political landscape into which Portuguese coastal trading posts, established from the mid-15th century, and the growing Atlantic trade were inserted, rather than a blank slate awaiting European arrival. The evidence section develops specific facts connected to the thesis: historians estimate roughly 12.5 million enslaved Africans were embarked across the trade\'s full history, overwhelmingly destined for Brazil and the Caribbean rather than North America; coastal states such as Dahomey and Asante became drawn into a self-reinforcing "gun-slave cycle," trading captives to European merchants for firearms that funded further wars and raids, which in turn produced still more captives to trade; and the kingdom of Kongo engaged Portugal diplomatically from the early 1500s, with King Afonso I formally corresponding with the Portuguese crown to raise concerns about the trade\'s disruptive effects on his kingdom, evidence of sustained diplomatic engagement rather than passive acceptance. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: growing European demand for captive labor directly caused some coastal states to seek firearms through the trade, and those firearms directly caused escalating warfare and raiding that produced still more captives — a self-reinforcing cycle that reorganized political power around the states best positioned to control access to the coast — while Kongo\'s continuous diplomatic engagement shows that the trade did not transform every West African state along the same militarized path, demonstrating that the trade\'s transformation of West African societies was substantial and reorganizing, but uneven and shaped by each state\'s own political choices rather than uniformly imposed from outside.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Atlantic slave trade transformed West African societies, 1450-1750) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Atlantic slave trade transformed West African societies to a significant extent between 1450 and 1750: it drew coastal states into a self-reinforcing cycle of trading captives for firearms that reorganized regional political power and intensified warfare, while established states such as Kongo pursued sustained diplomatic engagement rather than being reduced to a single, uniform pattern of transformation.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that West and West-Central Africa already had established states and long-distance trade networks (including trans-Saharan trade) before sustained transatlantic contact began. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Before sustained transatlantic contact, West and West-Central African societies already possessed a range of established states and long-distance trade networks, including trans-Saharan trade in gold and salt — a preexisting political landscape into which Portuguese coastal trading posts, established from the mid-15th century, and the growing Atlantic trade were inserted, rather than a blank slate awaiting European arrival.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the trade\'s roughly 12.5-million scale, the gun-slave cycle involving Dahomey/Asante, Kongo\'s diplomatic engagement including Afonso I\'s correspondence with Portugal) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'Historians estimate roughly 12.5 million enslaved Africans were embarked across the Atlantic slave trade\'s full history; coastal states such as Dahomey and Asante became drawn into a self-reinforcing gun-slave cycle, trading captives for European firearms that funded further wars and raids producing still more captives; and the kingdom of Kongo engaged Portugal diplomatically from the early 1500s, with King Afonso I formally corresponding with the Portuguese crown about the trade\'s disruptive effects on his kingdom.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis, including weighing evidence on more than one side where relevant. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Growing European demand for captive labor directly caused some coastal states to seek firearms through the trade, and those firearms directly caused escalating warfare and raiding that produced still more captives — a self-reinforcing cycle that reorganized political power around the states best positioned to control access to the coast — while Kongo\'s continuous diplomatic engagement shows the trade did not transform every West African state along the same militarized path, demonstrating that its transformation of West African societies was substantial but uneven, shaped by each state\'s own political choices rather than uniformly imposed from outside.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of transformation — "to a significant extent," "unevenly" — rather than just listing facts.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual state, policy, or figure), not general.',
        'Use causation to connect your evidence: does growing European demand directly CAUSE the political reorganization (the gun-slave cycle) you\'re also discussing?',
        'Contrasting Dahomey/Asante\'s militarized involvement with Kongo\'s diplomatic engagement is a strong way to show the transformation was uneven, not uniform — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: European demand for captives caused the gun-slave cycle, which caused escalating warfare that produced still more captives.',
        'A nuanced thesis (transformation was substantial but uneven — contrast Dahomey/Asante\'s militarized involvement with Kongo\'s diplomacy) tends to score better than treating every state\'s response the same way.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-LEQ',
    cedTitle: 'Unit 4 LEQ Practice — The Atlantic Slave Trade and West African Societies',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
