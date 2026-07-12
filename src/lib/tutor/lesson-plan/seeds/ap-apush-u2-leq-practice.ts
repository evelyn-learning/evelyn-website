/**
 * AP US History — Period 2 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt evaluates the extent to which environmental and geographic factors
 * shaped regional colonial societies (LO 2.2-2.3 colonial regions, 2.6
 * slavery, and the regional variation covered across the Period-2 content
 * arc), scored against the authentic AP APUSH 6-point LEQ rubric. Facts kept
 * consistent with the colonial-regions and slavery-colonies content plans:
 * Chesapeake tobacco/headright/disease environment, New England subsistence
 * economy/natural increase, Lower South rice-and-indigo task labor.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u2-leq-practice.v1',
  title: 'Period 2 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u2-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which environmental and geographic factors shaped the development of regional colonial societies — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-2-LEQ',
    },
  ],
  prerequisites: [
    'apush.colonial-regions',
    'apush.transatlantic-economy',
    'apush.slavery-colonies',
    'apush.colonial-society',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the Chesapeake, New England, the Middle Colonies, and the Lower South each developed their own distinct regional economy and society. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which environment and geography shaped regional colonial societies, and specifying that the shaping was substantial but interacted with other factors (religious purpose, labor systems, charter origins) rather than acting entirely alone, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that English colonization proceeded through many separately founded settlements strung along a long Atlantic coastline spanning sharply different climates, from cold rocky New England to warm humid Chesapeake and Lower South lowlands, so environment shaped each region\'s economic path from the earliest years of settlement.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Chesapeake\'s warm climate and long growing season supporting tobacco cultivation while its humid, disease-prone environment produced high mortality (driving reliance on continuously imported labor); New England\'s colder, rockier soil pushing the region toward subsistence farming, fishing, and shipbuilding, while its healthier climate supported rapid natural population increase; and the Lower South\'s swampy, tidal coastal geography proving ideal for labor-intensive rice cultivation, produced with heavy reliance on enslaved labor and, in places, enslaved majorities.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. causation, comparison) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the Chesapeake\'s disease environment CAUSED high mortality among indentured servants, which is part of why planters shifted toward permanent enslaved labor, while separately explaining how New England\'s healthier climate and family-based migration CAUSED natural population growth that never produced the same dependence on constant new labor imports — not just cataloging regional differences without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which environmental and geographic factors shaped the development of regional colonial societies in the period 1607–1754. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that environmental and geographic factors substantially shaped regional colonial societies — producing sharply different economies and labor systems in the Chesapeake, New England, and the Lower South — even though geography interacted with other factors, such as religious purpose and each colony\'s founding charter, rather than acting as the sole cause. Contextualization explains that English colonization proceeded through many separately founded settlements strung along a long Atlantic coastline spanning very different climates, from cold, rocky New England to warm, humid Chesapeake and Lower South lowlands, so from the earliest years of settlement, environment pushed each region toward a different economic path well before colonists were comparing themselves systematically to one another. The evidence section develops specific facts connected to the thesis: the Chesapeake\'s warm climate and long growing season made it well suited to tobacco cultivation following John Rolfe\'s successful strain around 1612, but the same warm, humid environment bred diseases such as malaria that produced high mortality, especially among new arrivals, creating constant demand for imported labor rather than a self-sustaining population; New England\'s colder climate and thinner, rockier soil made large-scale cash-crop agriculture impractical, pushing the region toward subsistence farming, fishing, and shipbuilding instead, while its comparatively healthier disease environment, combined with whole families migrating together, produced rapid population growth through natural increase rather than continuous new immigration; and the Lower South\'s warm, low-lying, swampy coastal terrain proved ideal for rice cultivation (and indigo on drier land), and because rice cultivation was especially labor-intensive and dangerous, planters relied heavily on enslaved labor, producing enslaved majorities in parts of coastal South Carolina by the 18th century. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: the Chesapeake\'s disease environment caused high mortality among indentured servants, which is part of why planters increasingly turned to enslaved African labor — a labor system that, unlike indentured servitude, was permanent and did not eventually demand land or a political voice; New England\'s healthier climate and family-based migration caused a self-sustaining population that never developed the Chesapeake\'s dependence on constantly importing new labor; and the Lower South\'s swampy terrain, ideal specifically for rice, caused reliance on enslaved workers experienced in rice cultivation, producing especially large enslaved populations — showing that geography shaped each region\'s labor system differently depending on which crop its particular soil and climate favored, rather than pushing every region toward the same outcome. A nuanced response can also note that non-geographic factors — New England\'s religious founding purpose, the Virginia Company\'s profit-seeking charter — shaped regional development alongside environment, not instead of it, since geography alone cannot explain why Massachusetts Bay organized around a church covenant rather than simply a healthier subsistence economy.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which environmental/geographic factors shaped regional colonial societies, 1607-1754) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of that shaping, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Environmental and geographic factors substantially shaped regional colonial societies — producing sharply different economies and labor systems in the Chesapeake, New England, and the Lower South — even though geography interacted with other factors, such as religious purpose and each colony\'s founding charter, rather than acting as the sole cause.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. English colonization proceeding through many separately founded settlements along a coastline spanning sharply different climates. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'English colonization proceeded through many separately founded settlements strung along a long Atlantic coastline spanning very different climates, from cold, rocky New England to warm, humid Chesapeake and Lower South lowlands, so environment began shaping each region\'s economic path from the earliest years of settlement.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Chesapeake\'s tobacco-friendly but disease-prone climate, New England\'s subsistence economy and natural population increase, the Lower South\'s rice-friendly swampy terrain and enslaved majorities) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Chesapeake\'s warm climate and long growing season suited tobacco cultivation, but its humid, disease-prone environment caused high mortality, especially among new arrivals; New England\'s colder, rockier soil pushed the region toward subsistence farming, fishing, and shipbuilding, while its healthier climate and family-based migration supported rapid natural population growth; and the Lower South\'s swampy, tidal coastal terrain proved ideal for labor-intensive rice cultivation, produced through heavy reliance on enslaved labor and, in places, enslaved majorities.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation, comparison) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The Chesapeake\'s disease environment caused high mortality among indentured servants, which is part of why planters increasingly shifted toward permanent enslaved African labor. New England\'s healthier climate and family-based migration caused a self-sustaining population that never developed the Chesapeake\'s dependence on continuously imported labor. The Lower South\'s swampy terrain, ideal specifically for rice, caused reliance on enslaved workers experienced in rice cultivation, producing especially large enslaved populations — showing geography shaped each region\'s labor system differently depending on which crop its particular soil and climate favored, rather than one uniform outcome.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT to which geography mattered — "substantial but not the only factor" is stronger than treating environment as the sole explanation.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — name the specific climate, crop, or disease pattern, not general statements.',
        'Use causation to connect your evidence: does a region\'s climate or soil CAUSE a specific labor system or population pattern you\'re also discussing?',
        'A nuanced argument acknowledges non-geographic factors (religious purpose, a colony\'s founding charter) also shaped development — geography interacted with these factors rather than acting alone.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: the Chesapeake\'s disease environment caused high mortality, which fed into the shift toward enslaved labor; New England\'s healthier climate caused natural population growth.',
        'A nuanced thesis (geography mattered substantially, but interacted with religious purpose and charter origins) tends to score better than treating geography as the sole cause.',
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
    cedTitle: 'Period 2 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
