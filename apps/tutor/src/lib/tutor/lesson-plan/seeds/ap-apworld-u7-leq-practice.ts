/**
 * AP World History: Modern — Unit 7 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Great Depression's global political consequences (LO
 * interwar-world, 7.4-7.6), drawing on the surrounding Unit-7 content (WWI's
 * unresolved settlement, the rise of authoritarian and militarist regimes),
 * scored against the authentic AP World 6-point LEQ rubric.
 *
 * TONE: fascism's rise, Stalin's Five-Year Plans, and Japanese militarism
 * are presented factually as political-economic developments, not with
 * editorializing — measured throughout, matching the interwar-world content
 * plan's register.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u7-leq-practice.v1',
  title: 'Unit 7 LEQ Practice — The Great Depression and Global Politics',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u7-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which the Great Depression reshaped global politics in the period 1918-1939 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-7-LEQ',
    },
  ],
  prerequisites: [
    'apworld.wwi-global',
    'apworld.interwar-world',
    'apworld.wwii-global',
    'apworld.conflict-legacies',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the Great Depression collapsed world trade, deepened unemployment across very different economies, and coincided with a wave of authoritarian consolidation and anti-imperial ferment across the interwar world. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely reshaped, reshaped alongside preexisting trends) to which the Great Depression reshaped global politics, 1918-1939, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the 1919 Versailles settlement left Germany burdened with reparations and a "war guilt" clause it deeply resented, and left colonized peoples\' wartime hopes for self-determination unmet, political grievances already simmering before the 1929 stock market crash gave them new economic fuel.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the roughly 66 percent gold-value collapse in world trade (1929-1934) and the comparably severe unemployment it produced in the US (24.9% in 1933) and Germany (roughly 30% in 1932), Hitler\'s appointment as German chancellor in January 1933 amid that unemployment crisis, Stalin\'s Five-Year Plans (launched 1928) continuing through the Depression, Japanese militarist factions citing economic hardship to help justify the 1931 invasion of Manchuria, and interwar economic-nationalist responses like import substitution industrialization in Latin America and Germany\'s turn toward autarky.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. causation, comparison) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW mass unemployment specifically CAUSED political radicalization (the Nazi Party\'s electoral gains tracking the worst years of German unemployment) and economic-nationalist retreat from global trade (autarky, ISI), while also weighing that some of the era\'s authoritarian trajectories — Stalin\'s industrialization drive, launched in 1928 before the Depression began, or Italian fascism, which had already taken power in 1922 — were already underway before the crash and were accelerated rather than solely caused by it, not just cataloging political facts without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Great Depression reshaped global politics in the period 1918-1939. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Great Depression reshaped global politics to a great extent after 1929, accelerating authoritarian consolidation and economic-nationalist retreat from the world trading system, even though some of the decade\'s major political trajectories had roots that predated the 1929 crash. Contextualization explains that the 1919 Versailles settlement left Germany burdened with reparations and a resented "war guilt" clause, and left colonized peoples\' wartime hopes for self-determination unmet, so that real political grievances were already simmering across Europe and the colonized world before the Depression gave them new economic fuel a decade later. The evidence section develops specific facts connected to the thesis: world trade\'s roughly 66 percent gold-value collapse between 1929 and 1934 produced comparably severe unemployment in the United States (24.9% in 1933) and Germany (roughly 30% by 1932); worsening German unemployment and political instability formed the immediate backdrop to Adolf Hitler\'s appointment as chancellor in January 1933 and his rapid consolidation of dictatorial power; in the USSR, Stalin\'s Five-Year Plans (launched 1928) drove forced industrialization and collectivization at immense human cost throughout the Depression years; in Japan, militarist factions cited economic hardship and resource scarcity to help justify the 1931 invasion of Manchuria and their growing influence over government policy; and in the United States and Latin America, governments responded with economic nationalism — the New Deal\'s expanded federal role, and import substitution industrialization in countries like Brazil and Mexico — while Germany pursued autarky. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: mass unemployment directly caused political radicalization, as the Nazi Party\'s electoral gains tracked the worst years of German joblessness, and the same economic collapse caused a broad retreat from the open trading system of the 1920s toward autarky and ISI; at the same time, a fuller analysis weighs that not every interwar political shift traces to the Depression alone, since Stalin\'s industrialization drive began in 1928, before the crash, and Italian fascism had already taken power in 1922 — showing the Depression accelerated and intensified an authoritarian trajectory already underway in some states, rather than single-handedly creating it everywhere, while still being the decisive force behind Germany\'s and Japan\'s specific political turns in the early 1930s.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Great Depression reshaped global politics, 1918-1939) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of reshaping, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Great Depression reshaped global politics to a great extent after 1929, accelerating authoritarian consolidation in Germany and Japan and driving a broad retreat toward economic nationalism, even though some of the decade\'s major political trajectories — Stalin\'s industrialization drive, Italian fascism — had roots that predated the 1929 crash.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the 1919 Versailles settlement\'s reparations and unmet self-determination promises, which left real political grievances simmering before the Depression began. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The 1919 Versailles settlement left Germany burdened with reparations and a resented "war guilt" clause, and left colonized peoples\' wartime hopes for self-determination unmet, so that real political grievances were already simmering across Europe and the colonized world before the Depression gave them new economic fuel a decade later.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. world trade\'s gold-value collapse and US/German unemployment figures, Hitler\'s 1933 appointment, Stalin\'s Five-Year Plans, Japanese militarism and Manchuria, the New Deal, ISI, autarky) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'World trade\'s roughly 66 percent gold-value collapse (1929-1934) produced comparably severe unemployment in the US (24.9% in 1933) and Germany (roughly 30% by 1932); worsening German unemployment formed the backdrop to Hitler\'s appointment as chancellor in January 1933; Stalin\'s Five-Year Plans (from 1928) drove forced industrialization through the Depression years; Japanese militarist factions cited economic hardship to help justify the 1931 invasion of Manchuria; and governments responded with the New Deal (US), import substitution industrialization (Latin America), and autarky (Germany).',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis, and weighing evidence on both sides where relevant. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Mass unemployment directly caused political radicalization, as the Nazi Party\'s electoral gains tracked the worst years of German joblessness, and the same economic collapse caused a broad retreat from the open trading system of the 1920s toward autarky and ISI; at the same time, not every interwar political shift traces to the Depression alone, since Stalin\'s industrialization drive began in 1928, before the crash, and Italian fascism had already taken power in 1922 — showing the Depression accelerated an authoritarian trajectory already underway in some states rather than single-handedly creating it everywhere, while still being the decisive force behind Germany\'s and Japan\'s specific political turns in the early 1930s.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of political reshaping — "to a great extent," "alongside preexisting authoritarian trends" — rather than just listing facts.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual figure, plan, or event), not general.',
        'Use causation to connect your evidence: does mass unemployment directly CAUSE the specific political shift (Hitler\'s appointment, Manchuria) you\'re also discussing?',
        'A nuanced essay weighs the Depression against political trends already underway before 1929 (Stalin\'s Five-Year Plan from 1928, Italian fascism from 1922), rather than treating the Depression as the ONLY cause — that tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: mass unemployment caused political radicalization (Hitler\'s 1933 appointment) and caused the retreat toward economic nationalism (autarky, ISI).',
        'A nuanced thesis (the Depression accelerated but did not solely cause every authoritarian shift — Stalin\'s Five-Year Plan predates it, Italian fascism predates it) tends to score better than a thesis treating the Depression as the sole cause of everything.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7-LEQ',
    cedTitle: 'Unit 7 LEQ Practice — The Great Depression and Global Politics',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
