/**
 * AP World History: Modern — Unit 6 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the economic motives driving the new imperialism (LOs 6.4-
 * 6.6, economic-imperialism), drawing on the surrounding Unit-6 content
 * (ideologies and tools of expansion, global migration), scored against the
 * authentic AP World 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u6-leq-practice.v1',
  title: 'Unit 6 LEQ Practice — Economic Motives and the New Imperialism',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u6-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which economic motives drove the new imperialism of 1750-1900 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-6-LEQ',
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
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how European powers justified, enabled, and carried out imperial expansion after 1750, and how economic structures like unequal treaties, export monocultures, and indentured labor shaped what that expansion actually looked like on the ground. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely economic, economic alongside other motives) to which economic motives drove the new imperialism, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the Industrial Revolution created an unprecedented demand for raw materials (cotton, rubber, palm oil) and new overseas markets for manufactured goods, while also producing the military and transport technology (steamships, quinine, the Maxim gun) that made large-scale territorial control newly practical — which explains why economic ambition and the new imperialism\'s formal territorial conquest emerged together in this period.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Opium Wars and the unequal treaties/extraterritoriality that followed, European "spheres of influence" carved out of a formally sovereign Qing China, export monocultures like Congo rubber and Latin American guano, the Suez and Panama canals built to shorten trade routes, and the indentured labor systems (over a million Indian laborers alone) that replaced enslaved labor on plantations after abolition.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW industrial demand for raw materials specifically CAUSED the drive to secure exclusive access to resource-rich territories, which in turn CAUSED the labor regimes (indenture, forced cultivation) that extracted those resources, while also weighing non-economic motives (strategic rivalry, nationalist prestige, the civilizing-mission ideology) that pushed some territorial claims economic logic alone would not explain, not just cataloging economic facts without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which economic motives drove the new imperialism of 1750-1900. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that economic motives drove the new imperialism of 1750-1900 to a great extent, as industrializing powers sought raw materials, captive markets, and cheap labor — even though strategic rivalry and ideological justification also shaped where and how that expansion occurred. Contextualization explains that the Industrial Revolution created an unprecedented demand for raw materials (cotton, rubber, palm oil) and new overseas markets for manufactured goods, while also producing the military and transport technology — steamships, quinine, the Maxim gun — that made large-scale territorial control newly practical, explaining why economic ambition and formal conquest emerged together in this period. The evidence section develops specific facts connected to the thesis: after Britain won the Opium Wars, unequal treaties forced China to open treaty ports and grant extraterritoriality to foreign nationals, letting European and, later, Japanese powers carve out spheres of influence in a China that remained formally sovereign but economically subordinated; European powers built export monocultures to feed industrial economies, including forced rubber cultivation in the Congo Free State and Peruvian guano extraction for fertilizer, both organized primarily around resource extraction rather than settlement; Britain and France built the Suez and Panama Canals specifically to shorten shipping routes between industrial cores and colonial or resource-rich peripheries; and after the abolition of slavery in the British Empire, colonial planters turned to indentured labor, transporting over a million Indian workers alone to sugar colonies across the Indian Ocean and Caribbean to keep plantation economies profitable. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: industrial demand for raw materials directly caused the drive to secure exclusive access to resource-rich territories, which in turn caused the coercive labor regimes — indenture, forced cultivation — that extracted those resources cheaply; at the same time, a fuller analysis weighs that economic logic alone does not explain every case, since strategic rivalry between European powers (the scramble to claim territory before a rival did) and ideological justifications like the civilizing mission pushed some claims, such as remote or resource-poor territories claimed mainly for prestige or strategic position, beyond what economic calculation alone would predict — showing that economic motives were the dominant but not exclusive driver of the new imperialism.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which economic motives drove the new imperialism, 1750-1900) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of economic driving force, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Economic motives drove the new imperialism of 1750-1900 to a great extent: industrializing powers sought raw materials, captive markets, and cheap labor through unequal treaties, export monocultures, and indentured labor systems, even though strategic rivalry and ideological justification also shaped where and how that expansion occurred.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the Industrial Revolution created new demand for raw materials and markets while also producing the technology that made large-scale territorial control newly practical. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The Industrial Revolution created an unprecedented demand for raw materials such as cotton, rubber, and palm oil and new overseas markets for manufactured goods, while also producing the military and transport technology — steamships, quinine, the Maxim gun — that made large-scale territorial control newly practical, explaining why economic ambition and the new imperialism\'s formal conquest emerged together in this period.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Opium Wars and unequal treaties, spheres of influence in China, export monocultures like Congo rubber and Peruvian guano, the Suez and Panama Canals, indentured labor systems) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'After the Opium Wars, unequal treaties forced China to open treaty ports and grant extraterritoriality, letting foreign powers carve out spheres of influence in a formally sovereign but economically subordinated China; European powers built export monocultures such as Congo rubber and Peruvian guano organized around resource extraction; Britain and France built the Suez and Panama Canals to shorten shipping routes to resource-rich peripheries; and after abolition, colonial planters turned to indentured labor, transporting over a million Indian workers alone to sugar colonies to keep plantation economies profitable.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis, and weighing evidence on both sides where relevant. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Industrial demand for raw materials directly caused the drive to secure exclusive access to resource-rich territories, which in turn caused the coercive labor regimes — indenture, forced cultivation — that extracted those resources cheaply; at the same time, economic logic alone does not explain every case, since strategic rivalry between European powers and ideological justifications like the civilizing mission pushed some claims, including remote or resource-poor territories claimed mainly for prestige or strategic position, beyond what economic calculation alone would predict — showing economic motives were the dominant but not exclusive driver of the new imperialism.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of economic driving force — "to a great extent," "alongside significant non-economic motives" — rather than just listing facts.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual treaty, canal, or labor system), not general.',
        'Use causation to connect your evidence: does industrial demand directly CAUSE the specific economic structure (treaty, canal, labor system) you\'re also discussing?',
        'A nuanced essay weighs economic motives against strategic rivalry and ideology, rather than treating economics as the ONLY factor — that tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: industrial demand for raw materials caused the drive for exclusive resource access, which caused the labor regimes that extracted them.',
        'A nuanced thesis (economic motives dominant but not exclusive, alongside strategic rivalry and ideology) tends to score better than an all-economic claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-LEQ',
    cedTitle: 'Unit 6 LEQ Practice — Economic Motives and the New Imperialism',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
