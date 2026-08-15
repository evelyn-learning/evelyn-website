/**
 * AP World History: Modern — Unit 2 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Mongol Empire's role in cross-regional exchange (LO
 * 2.1), drawing on the surrounding Unit-2 content (Silk Roads revival,
 * technology/religion diffusion, the Black Death), scored against the
 * authentic AP World 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u2-leq-practice.v1',
  title: 'Unit 2 LEQ Practice — The Mongol Empire and Cross-Regional Exchange',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u2-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which the Mongol Empire facilitated cross-regional exchange in Afro-Eurasia — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-2-LEQ',
    },
  ],
  prerequisites: ['apworld.mongol-empire', 'apworld.cultural-diffusion'],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the Mongol Empire conquered, administered, and connected huge stretches of Eurasia, and how that connectivity spread technology, ideas, and disease. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely facilitated, facilitated in some ways but not others) to which the Mongol Empire drove cross-regional exchange, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that before Genghis Khan united the Mongol tribes around 1206, overland Eurasian trade routes crossed a patchwork of small, often hostile states, making long-distance travel slow and risky — which explains why a single, vast, internally administered empire changed the calculus so dramatically.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the yam relay system of resourced way-stations, the Pax Mongolica\'s relative political stability across the khanates, Mongol rulers\' general religious tolerance and employment of foreign administrators, the westward diffusion of gunpowder technology, and the Black Death\'s westward spread along the same secured routes.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW Mongol conquest and administration specifically CAUSED the political stability of the Pax Mongolica, which in turn CAUSED the safer, faster movement of merchants, missionaries, and — eventually — plague-carrying fleas along the same routes, not just cataloging Mongol achievements without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Mongol Empire facilitated cross-regional exchange in Afro-Eurasia in the period from 1200 to 1450. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Mongol Empire facilitated cross-regional exchange in Afro-Eurasia to a great extent by conquering and then administering an unprecedented span of territory under relatively stable, connected rule — even though that same connectivity also carried a catastrophic cost. Contextualization explains that before Genghis Khan united the Mongol tribes around 1206, overland Eurasian trade crossed a patchwork of small, often rival and hostile states, making long-distance travel slow, unpredictable, and dangerous — a fragmented backdrop that explains why one vast, internally administered empire changed the calculus of cross-regional movement so dramatically. The evidence section develops specific facts connected to the thesis: the Mongols built the yam, a relay system of resourced way-stations spaced roughly a day\'s journey apart that let messengers, officials, and eventually merchants move rapidly and safely across thousands of miles; once conquest gave way to consolidated rule, Mongol administration was generally religiously tolerant and employed skilled foreign officials regardless of ethnicity or faith, lowering the political risk of doing business or traveling across Mongol territory; the resulting Pax Mongolica, the relative political stability across Mongol-controlled Eurasia, is what directly revived and secured the overland Silk Roads after centuries of fragmented, riskier travel; that same secured connectivity let technology and ideas move at unprecedented speed, including gunpowder weapons technology diffusing westward from China and Persian and Chinese scholars exchanging astronomical and medical knowledge at Mongol courts; and the same routes carried the Black Death westward from its likely origin in Central Asia, reaching the Middle East and Europe by the 1340s. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: Mongol conquest directly caused the political unification needed for the Pax Mongolica, which in turn caused both the revival of safe overland trade and the free movement of scholars and technology between courts, and that same causal chain of secured, high-volume movement is precisely what let a pathogen travel as efficiently as silk or scholarship did — showing that the Mongol Empire\'s facilitation of exchange was not selective but total, moving people, ideas, goods, and disease along the very same secured infrastructure, for better and for worse.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Mongol Empire facilitated cross-regional exchange, 1200-1450) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of facilitation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Mongol Empire facilitated cross-regional exchange across Afro-Eurasia to a great extent: by conquering and then administering an unprecedented span of territory under relatively stable, connected rule, it secured overland trade, enabled the rapid diffusion of technology and ideas, and — as an unintended consequence of that same connectivity — carried a catastrophic pandemic westward.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that before Mongol unification, overland Eurasian trade crossed a fragmented patchwork of small, often hostile states that made long-distance travel slow and risky. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              "Before Genghis Khan united the Mongol tribes around 1206, overland Eurasian trade routes crossed a patchwork of small, often rival and hostile states, which made long-distance travel slow, unpredictable, and dangerous — a fragmented backdrop that explains why one vast, internally administered empire changed the calculus of cross-regional movement so dramatically.",
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the yam relay system, religious tolerance and foreign administrators, the Pax Mongolica, gunpowder\'s westward diffusion, the Black Death\'s westward spread) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Mongols built the yam, a relay system of resourced way-stations spaced roughly a day\'s journey apart, letting messengers and officials move rapidly across the empire; Mongol administration was generally religiously tolerant and employed skilled foreign officials; the resulting Pax Mongolica secured overland routes and directly revived Silk Roads trade; gunpowder weapons technology diffused westward from China along these routes; and the Black Death spread westward from Central Asia along the same secured network, reaching the Middle East and Europe by the 1340s.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Mongol conquest directly caused the political unification needed for the Pax Mongolica, which in turn caused both the revival of safe overland trade and the free movement of scholars and technology between courts — and that same causal chain of secured, high-volume movement is precisely what let a pathogen travel as efficiently as silk or scholarship did, showing the Mongol Empire facilitated exchange not selectively but along the full range of what could move through secured territory, for better and for worse.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of facilitation — "to a great extent," "in some ways but not others" — rather than just listing achievements.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual system, policy, or event), not general.',
        'Use causation to connect your evidence: does Mongol conquest/administration directly CAUSE the exchange (of goods, ideas, or disease) you\'re also discussing?',
        'The Black Death is useful for showing the Mongol Empire\'s facilitation of exchange was double-edged — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: Mongol conquest caused the Pax Mongolica, which caused both safer trade AND the Black Death\'s westward spread along the same routes.',
        'A nuanced thesis (facilitated exchange broadly, including its catastrophic downside) tends to score better than an all-positive claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-LEQ',
    cedTitle: 'Unit 2 LEQ Practice — The Mongol Empire and Cross-Regional Exchange',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
