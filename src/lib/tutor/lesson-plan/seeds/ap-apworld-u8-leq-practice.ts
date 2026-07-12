/**
 * AP World History: Modern — Unit 8 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets decolonization's transformation of the international order
 * after 1945 (LOs 8.5-8.6, with reference to the wider Unit-8 arc — the
 * global Cold War, the challenges facing new states, and the Cold War's
 * end), scored against the authentic AP World 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u8-leq-practice.v1',
  title: 'Unit 8 LEQ Practice — Decolonization and the International Order',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u8-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which decolonization transformed the international order after 1945 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-8-LEQ',
    },
  ],
  prerequisites: [
    'apworld.cold-war-global',
    'apworld.decolonization',
    'apworld.new-states',
    'apworld.end-cold-war',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how dozens of colonies became independent states after 1945, from India and Pakistan's partition to Ghana's negotiated path and Algeria's war, and how those new states navigated a Cold-War-shaped world. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about decolonization without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (transformed the order substantially, transformed it in some ways while old dependencies persisted in others) to which decolonization reshaped the post-1945 international order, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the Second World War left the European colonial powers economically and militarily exhausted, while the war\'s own rhetoric of self-determination and the founding of the United Nations gave independence movements new international legitimacy, even though most of Africa and much of Asia remained under colonial rule in 1945.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the partition of India and Pakistan in 1947 (roughly one million deaths, some fifteen million displaced), Ghana\'s negotiated independence from Britain in 1957 contrasted with Algeria\'s prolonged war of independence against France (1954-1962), the 1955 Bandung Conference and the resulting Non-Aligned Movement, the Suez Crisis of 1956 exposing the decline of British and French imperial power, and the dramatic growth in United Nations membership (from 51 founding members in 1945 to well over 150 by 1980) as newly independent states joined en masse.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the same wartime exhaustion and international legitimacy that CAUSED decolonization also CAUSED newly independent states to flood into the UN and shift its agenda toward anti-colonial and development concerns, while ALSO explaining that formal sovereignty did not erase economic dependency on former colonial powers or entanglement in Cold War rivalries — a continuity alongside the change.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which decolonization transformed the international order after 1945. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that decolonization transformed the post-1945 international order to a great extent — dramatically expanding the United Nations\' membership and diversifying whose voices it had to answer to — even though formal independence did not erase every form of dependency on the former colonial powers or entanglement in Cold War rivalries. Contextualization explains that the Second World War left the European colonial powers economically and militarily exhausted, while the war\'s own rhetoric of self-determination and the 1945 founding of the United Nations gave independence movements new international legitimacy, even though in 1945 most of Africa and much of Asia still remained under colonial rule. The evidence section develops specific facts connected to the thesis: the 1947 partition of British India into India and Pakistan produced roughly a million deaths and displaced some fifteen million people, showing that the transition to independence itself could be catastrophically violent; Ghana\'s negotiated independence from Britain in 1957 unfolded through diplomacy while Algeria\'s independence from France (1954-1962) required a prolonged, brutal war, showing decolonization followed no single path; the 1955 Bandung Conference brought together newly independent African and Asian states and produced the Non-Aligned Movement, a deliberate attempt to chart a course between the American and Soviet blocs; the 1956 Suez Crisis, in which Britain and France were forced by American and Soviet pressure to abandon their attempt to retake the Suez Canal, exposed how far European imperial power had already declined; and United Nations membership grew from 51 founding members in 1945 to well over 150 by 1980, as decolonized states joined in large numbers. Analysis and reasoning uses causation and continuity/change to connect these facts into an argument rather than a list: the same wartime exhaustion and postwar legitimacy that caused decolonization also caused newly independent states to flood into the United Nations and push its agenda toward anti-colonial resolutions and economic development, directly transforming an institution built mostly by a handful of victorious powers in 1945 into one a majority of whose members were, within a generation, states that had not existed at the war\'s end; at the same time, that same generation of new states remained economically dependent on former colonial trading partners and were frequently drawn into Cold War proxy competition for aid and alignment, showing that decolonization transformed the order\'s formal membership and agenda far more completely than it transformed the underlying economic and strategic dependencies those states still faced.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which decolonization transformed the international order after 1945) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Decolonization transformed the post-1945 international order to a great extent — dramatically expanding the United Nations\' membership and diversifying whose voices it had to answer to — even though formal independence did not erase every form of dependency on the former colonial powers or entanglement in Cold War rivalries.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that World War II left European colonial powers exhausted while wartime rhetoric of self-determination and the UN\'s founding gave independence movements new legitimacy. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The Second World War left the European colonial powers economically and militarily exhausted, while the war\'s own rhetoric of self-determination and the 1945 founding of the United Nations gave independence movements new international legitimacy, even though in 1945 most of Africa and much of Asia still remained under colonial rule.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the India/Pakistan partition, Ghana vs. Algeria\'s contrasting paths, the Bandung Conference/Non-Aligned Movement, the Suez Crisis, UN membership growth) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The 1947 partition of British India produced roughly a million deaths and some fifteen million displaced; Ghana\'s 1957 independence from Britain came through negotiation while Algeria\'s independence from France (1954-1962) required a prolonged war; the 1955 Bandung Conference produced the Non-Aligned Movement; the 1956 Suez Crisis exposed the decline of British and French imperial power; and UN membership grew from 51 founding members in 1945 to well over 150 by 1980 as decolonized states joined.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation, continuity/change) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The same wartime exhaustion and postwar legitimacy that caused decolonization also caused newly independent states to flood into the United Nations and push its agenda toward anti-colonial resolutions and development concerns, transforming an institution built mostly by a handful of victorious powers in 1945 into one a majority of whose members had not existed at the war\'s end — while that same generation of new states remained economically dependent on former colonial partners and was frequently drawn into Cold War proxy competition, showing the transformation of formal membership and agenda outpaced the transformation of underlying economic and strategic dependency.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of transformation — "to a great extent," "in some ways but not others" — rather than just listing events.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual event, conference, or figure), not general.',
        'Use causation to connect your evidence: does decolonization directly CAUSE the change in the international order you\'re also discussing (UN membership, non-alignment)?',
        'Continuity/change is useful here: formal sovereignty changed a lot (UN votes, new states), but economic dependency and Cold War entanglement often continued — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Continuity/change is a strong reasoning tool here: decolonization transformed UN membership and agendas (change), while economic dependency and Cold War entanglement often persisted (continuity).',
        'A nuanced thesis (transformed the order substantially, but not every dependency) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-LEQ',
    cedTitle: 'Unit 8 LEQ Practice — Decolonization and the International Order',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
