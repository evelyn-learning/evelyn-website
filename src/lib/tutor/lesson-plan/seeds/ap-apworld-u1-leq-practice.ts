/**
 * AP World History: Modern — Unit 1 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets how religious institutions shaped state power across the
 * Unit-1 arc (East Asia 1.1, Dar al-Islam 1.2, South/Southeast Asia 1.3, the
 * Americas and Africa 1.4-1.5, medieval Europe 1.6) — drawing on Neo-
 * Confucianism's role in the civil-service exam curriculum, the ulama/
 * madrasa networks and Sufi orders across Dar al-Islam and the Delhi
 * Sultanate, Ethiopia's Solomonic Christian dynasty, the Khmer Empire's
 * temple-building, and medieval Europe's independent, power-CHECKING
 * Catholic Church — scored against the authentic AP World 6-point LEQ
 * rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u1-leq-practice.v1',
  title: 'Unit 1 LEQ Practice — Religious Institutions and State Power',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u1-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which religious institutions shaped state power in the period 1200-1450 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-1-LEQ',
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
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "Across this unit you've seen religion tangled up with political power again and again: a Confucian exam curriculum deciding who could govern China, Islamic legal scholars administering justice for a sultan in Delhi, an Ethiopian dynasty claiming descent from Solomon to justify its throne, and a Catholic Church powerful enough to check a European king. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about religion and government side by side without connecting them into an argument about HOW religious institutions shaped (or, in some cases, checked) state power.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely reinforced state power in most regions, but functioned very differently in medieval Europe) rather than a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that this period followed both the Mongol conquests\' reshaping of Eurasian politics and the fragmentation of the Abbasid Caliphate after 1258 into competing regional Islamic states, which meant that in many regions, religious scholars, orders, and institutions — not a single unified political authority — became one of the few continuous, trusted sources of legal and administrative expertise available to newly forming or reforming states.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. Neo-Confucianism as the core curriculum of China\'s civil-service exam, tying who could hold office to mastery of a religiously-inflected philosophical tradition; the ulama and madrasa networks across Dar al-Islam training the qadis (judges) who administered Islamic law for states like the Delhi Sultanate; Sufi orders spreading Islam through peaceful, syncretic contact rather than conquest, giving Muslim rulers a religious-legitimacy tool distinct from military force; Ethiopia\'s Solomonic dynasty (from 1270) claiming descent from the biblical Solomon and expressing that claim monumentally in the rock-hewn churches of Lalibela; the Khmer Empire\'s Angkor Wat, built as a Hindu temple and later adapted for Buddhist worship, projecting royal legitimacy through massive religious architecture; and medieval Europe\'s Catholic Church, which held independent political, economic, and cultural authority that repeatedly rivaled and checked royal power rather than simply reinforcing it.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. comparing HOW religious institutions REINFORCED centralized state power in China (the exam system), the Delhi Sultanate (qadis and Islamic law), Ethiopia (dynastic religious legitimacy), and the Khmer Empire (temple-building), while explaining that medieval Europe\'s Church instead operated as an independent rival authority that could CONSTRAIN a king\'s power — not just cataloging religious institutions in each region without connecting them to how state power specifically worked.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which religious institutions shaped state power in the period from 1200 to 1450. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that religious institutions shaped state power to a great extent in this period, most often by REINFORCING centralized rule — but that medieval Europe\'s Catholic Church shows the opposite dynamic, operating as an independent authority that could constrain, rather than simply support, royal power. Contextualization explains that this period followed both the Mongol conquests\' reshaping of Eurasian politics and the fragmentation of the Abbasid Caliphate after the Mongol sack of Baghdad in 1258 into competing regional Islamic states, which meant that in many regions religious scholars, orders, and institutions became one of the few continuous, trusted sources of legal and administrative expertise available to states that were newly forming or reconstituting themselves. The evidence section develops specific facts connected to the thesis: in Song and Yuan China, Neo-Confucianism became the core curriculum of the civil-service examination, meaning access to government office itself ran through mastery of a religiously-inflected philosophical tradition; across Dar al-Islam, the ulama and madrasa networks trained the qadis (judges) who administered Islamic law for states like the Delhi Sultanate, tying religious scholarship directly to day-to-day governance over a mostly non-Muslim population; Sufi orders, meanwhile, spread Islam through peaceful, syncretic contact with local populations rather than conquest, giving Muslim rulers a religious-legitimacy and cultural-influence tool wholly distinct from military force; in the Horn of Africa, Ethiopia\'s Solomonic dynasty, established in 1270, claimed descent from the biblical Solomon and expressed that religious-political claim monumentally in the rock-hewn churches of Lalibela; the Khmer Empire\'s Angkor Wat, originally built as a Hindu temple and later adapted for Buddhist worship, projected royal legitimacy through massive religious architecture; and medieval Europe\'s Catholic Church held independent political, economic (vast landholding), and cultural authority that repeatedly rivaled and checked, rather than simply reinforced, royal power. Analysis and reasoning uses comparison to connect these facts into an argument rather than a list: in China, the Delhi Sultanate, Ethiopia, and the Khmer Empire, religious institutions and ideas were absorbed INTO the machinery of the state itself — deciding who could hold office, who administered justice, or what monumental building projects legitimized a ruler\'s claim to the throne — which directly reinforced centralized power in each case; medieval Europe instead shows a state and a religious institution operating as two independently powerful, competing authorities, where the Church\'s own landholding and legal jurisdiction actively limited what a king like John of England could do, showing that the EXTENT of religious institutions\' effect on state power depended heavily on whether the religious institution in question was folded into the state\'s own administrative structure or remained an independent rival to it.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which religious institutions shaped state power, 1200-1450) AND establishes a line of reasoning for the essay to follow — a clear position on the extent and nature of that shaping, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Religious institutions shaped state power to a great extent in this period, most often by reinforcing centralized rule — tying access to office, law, or legitimacy to religious learning or claims — but medieval Europe\'s Catholic Church shows the opposite dynamic, operating as an independent authority that constrained, rather than simply supported, royal power.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the Mongol conquests and the fragmentation of the Abbasid Caliphate after 1258 left religious institutions as continuous sources of legal and administrative expertise for reforming states. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              "This period followed both the Mongol conquests' reshaping of Eurasian politics and the fragmentation of the Abbasid Caliphate after the Mongol sack of Baghdad in 1258 into competing regional Islamic states, which meant that in many regions religious scholars, orders, and institutions became one of the few continuous, trusted sources of legal and administrative expertise available to states that were newly forming or reconstituting themselves.",
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. Neo-Confucianism\'s role in the civil-service exam, the ulama/madrasa networks and qadis of Dar al-Islam and the Delhi Sultanate, Sufi conversion, Ethiopia\'s Solomonic dynasty and Lalibela, the Khmer Empire\'s Angkor Wat, medieval Europe\'s independent Catholic Church) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              "Neo-Confucianism became the core curriculum of China's civil-service exam, tying access to office to mastery of a religiously-inflected philosophy; the ulama and madrasa networks across Dar al-Islam trained the qadis who administered Islamic law for states like the Delhi Sultanate; Ethiopia's Solomonic dynasty (from 1270) claimed descent from the biblical Solomon and expressed that claim in the rock-hewn churches of Lalibela; the Khmer Empire's Angkor Wat, built as a Hindu temple and later adapted for Buddhist worship, projected royal legitimacy through religious architecture; and medieval Europe's Catholic Church held independent political and economic authority that repeatedly checked royal power.",
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. comparison) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis — including weighing the medieval European counter-case. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              "In China, the Delhi Sultanate, Ethiopia, and the Khmer Empire, religious institutions and ideas were absorbed INTO the machinery of the state itself — deciding who could hold office, who administered justice, or what building projects legitimized a ruler's throne — which directly reinforced centralized power in each case. Medieval Europe instead shows a state and a religious institution operating as two independently powerful, competing authorities, where the Church's own landholding and legal jurisdiction actively limited what a king could do, showing that the extent of religious institutions' effect on state power depended on whether the institution was folded into the state's own structure or remained an independent rival to it.",
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and NATURE of the shaping — "largely reinforced power, except in one region" — rather than just listing religious institutions.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual institution, dynasty, or building), not general.',
        'Use comparison to connect your evidence: does the religious institution get absorbed INTO the state\'s own power (reinforcing it), or does it stay independent and CHECK the state (as in medieval Europe)?',
        'Medieval Europe is useful for showing the relationship between religion and state power was not uniform — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Comparison is a strong reasoning tool here: religious institutions REINFORCED state power in China, the Delhi Sultanate, Ethiopia, and the Khmer Empire, but the Catholic Church in medieval Europe CONSTRAINED it instead.',
        'A nuanced thesis (mostly reinforced power, but with medieval Europe as a genuine exception) tends to score better than an all-one-direction claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-LEQ',
    cedTitle: 'Unit 1 LEQ Practice — Religious Institutions and State Power',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
