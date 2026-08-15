/**
 * AP World History: Modern — Unit 9 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets globalization's role in creating new forms of inequality
 * after 1945 (drawing on the wider Unit-9 arc — the global economy,
 * technology and communication, environment and disease, and culture,
 * rights, and migration), scored against the authentic AP World 6-point LEQ
 * rubric. Consistent with the AP's own non-partisan framing of "extent"
 * prompts, a thesis arguing globalization created inequality "to a large
 * extent" and one arguing "to a limited extent" (inequality mostly
 * pre-existing, globalization an accelerant rather than a cause) are
 * EQUALLY creditable provided the reasoning and evidence support the claim.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u9-leq-practice.v1',
  title: 'Unit 9 LEQ Practice — Globalization and New Forms of Inequality',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u9-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which globalization created new forms of inequality after 1945 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-9-LEQ',
    },
  ],
  prerequisites: [
    'apworld.global-economy',
    'apworld.technology-communication',
    'apworld.environment-disease',
    'apworld.culture-rights-migration',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the global economy reorganized after 1945, how technology and communication spread unevenly across the world, and how migration and cultural exchange reshaped everyday life. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. And this is a genuinely contested question — a strong essay can argue globalization created inequality to a large extent OR to a limited extent, as long as the reasoning and evidence support the claim. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row, including why either "large extent" or "limited extent" theses are equally creditable here.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about globalization without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (globalization created substantial new inequalities between and within regions, OR globalization mostly accelerated and reshaped inequalities that already existed rather than creating wholly new ones) to which globalization produced new forms of inequality after 1945. Both directions are historically defensible and EQUALLY creditable — the rubric rewards a clear, arguable line of reasoning, not a particular political conclusion.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the Bretton Woods institutions (the IMF and World Bank) and later the GATT/WTO system built a rules-based framework for international trade and investment after 1945, creating new channels through which some economies and social groups would integrate into global markets far more quickly, and profitably, than others.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the rapid export-driven growth of the "Asian Tiger" economies (South Korea, Taiwan, Singapore, Hong Kong) contrasted with slower, more commodity-dependent growth across much of Sub-Saharan Africa under similar international trade rules; Deng Xiaoping\'s market reforms opening China to foreign investment and trade after 1978, which drove decades of rapid growth while also widening the gap between China\'s coastal export cities and its rural interior; the 1997 Asian Financial Crisis, in which integrated capital markets transmitted a currency shock across Thailand, Indonesia, and South Korea far faster and more severely than in less financially-integrated economies; the 2008 global financial crisis, which spread from the United States\' mortgage markets to economies worldwide through the same integrated financial channels that had enabled decades of growth; and the "leapfrogging" pattern in which mobile-network and mobile-internet access spread rapidly across much of the Global South even as a substantial share of the world\'s population remained offline as late as 2020, showing technological integration itself proceeding unevenly.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the same trade and financial integration that CAUSED rapid growth in export-oriented economies like the Asian Tigers and post-1978 China also CAUSED those same economies\' greater exposure to shocks like the 1997 and 2008 crises, while ALSO explaining that uneven technological diffusion (leapfrogging alongside persistent offline populations) shows integration itself, not merely its consequences, has been unevenly distributed — a continuity of pre-existing regional disparities running alongside genuinely new, integration-specific forms of exposure and inequality.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which globalization created new forms of inequality after 1945. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that globalization after 1945 created substantial new forms of inequality — both between regions that integrated into global trade and finance on very different terms, and within societies whose export-linked sectors grew far faster than the rest of the economy — even though many of the world\'s deepest inequalities predated 1945 and were reshaped rather than invented outright. Contextualization explains that the Bretton Woods institutions (the IMF and World Bank) and later the GATT/WTO system built a rules-based framework for international trade and investment after 1945, creating new channels through which some economies and social groups would integrate into global markets far more quickly, and profitably, than others. The evidence section develops specific facts connected to the thesis: the "Asian Tiger" economies (South Korea, Taiwan, Singapore, Hong Kong) achieved decades of rapid, export-driven growth under the same broad international trade rules that left much of Sub-Saharan Africa, still dependent on commodity exports, growing far more slowly; Deng Xiaoping\'s post-1978 market reforms opened China to foreign investment and trade, driving extraordinary growth that nonetheless widened the gap between China\'s booming coastal export cities and its poorer rural interior; the 1997 Asian Financial Crisis showed how integrated capital markets could transmit a currency shock across Thailand, Indonesia, and South Korea with a speed and severity that less financially-integrated economies avoided; the 2008 global financial crisis spread from American mortgage markets to economies worldwide through those same integrated financial channels; and the "leapfrogging" pattern of rapid mobile-network adoption across much of the Global South coexisted with a substantial share of the world\'s population still offline as late as 2020, showing technological integration itself spreading unevenly. Analysis and reasoning uses causation and comparison to connect these facts into an argument rather than a list: the same trade and financial integration that caused rapid growth in export-oriented economies like the Asian Tigers and post-1978 China also caused those same economies\' greater exposure to shocks like the 1997 and 2008 crises, a new and specifically integration-driven form of vulnerability; at the same time, uneven technological diffusion shows that integration itself — not merely its downstream consequences — has been unevenly distributed across regions, meaning globalization\'s new inequalities and its reshaping of older regional disparities operated together rather than as two separate stories.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which globalization created new forms of inequality after 1945) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of new inequality, not a restatement of the prompt or an unsupported assertion with no reasoning attached. EITHER a "large extent" or a "limited extent" thesis earns full credit provided the reasoning and evidence support it — the rubric does not reward one conclusion over the other. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Globalization after 1945 created substantial new forms of inequality — both between regions that integrated into global trade and finance on very different terms, and within societies whose export-linked sectors grew far faster than the rest of the economy — even though many of the world\'s deepest inequalities predated 1945 and were reshaped rather than invented outright.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the Bretton Woods institutions and later the GATT/WTO system built a rules-based framework for trade and investment that some economies integrated into far faster than others. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The Bretton Woods institutions (the IMF and World Bank) and later the GATT/WTO system built a rules-based framework for international trade and investment after 1945, creating new channels through which some economies and social groups would integrate into global markets far more quickly, and profitably, than others.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Asian Tigers vs. Sub-Saharan Africa, Deng Xiaoping\'s reforms, the 1997 and 2008 financial crises, uneven technological "leapfrogging") to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The "Asian Tiger" economies (South Korea, Taiwan, Singapore, Hong Kong) grew rapidly through export-driven trade while much of Sub-Saharan Africa, still commodity-dependent, grew far more slowly under similar rules; Deng Xiaoping\'s post-1978 reforms opened China to foreign investment, widening the gap between its coastal export cities and rural interior; the 1997 Asian Financial Crisis and the 2008 global financial crisis both showed integrated capital markets transmitting shocks across borders; and mobile-network "leapfrogging" spread rapidly across much of the Global South even as a large share of the world remained offline by 2020.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation, comparison, continuity/change) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The same trade and financial integration that caused rapid growth in export-oriented economies like the Asian Tigers and post-1978 China also caused those same economies\' greater exposure to shocks like the 1997 and 2008 crises — a new, integration-specific form of vulnerability — while uneven technological diffusion shows that integration itself, not merely its consequences, has been unevenly distributed across regions, so globalization\'s new inequalities and its reshaping of older regional disparities operated together rather than as two separate stories.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of new inequality — "to a large extent" and "to a limited extent" are both defensible and equally creditable, as long as your reasoning supports it.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual country, reform, or crisis), not general.',
        'Use causation to connect your evidence: does the SAME integration that CAUSED growth also CAUSE new exposure to shocks like the 1997 or 2008 crises?',
        'Comparison is useful here: contrasting the Asian Tigers/China\'s growth against slower growth elsewhere under similar international rules tends to produce a stronger, more specific argument than a single-region story.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'This is a genuinely contested prompt — a "large extent" thesis and a "limited extent" thesis are equally creditable provided the reasoning and evidence support the claim.',
        'Causation is a strong reasoning tool here: the same integration that drove growth in economies like the Asian Tigers and post-1978 China also drove those economies\' new exposure to cross-border financial shocks.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9-LEQ',
    cedTitle: 'Unit 9 LEQ Practice — Globalization and New Forms of Inequality',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
