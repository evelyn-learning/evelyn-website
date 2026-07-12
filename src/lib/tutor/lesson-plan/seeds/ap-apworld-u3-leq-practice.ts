/**
 * AP World History: Modern — Unit 3 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets how the Ottoman, Safavid, and Mughal empires differed in
 * their treatment of religious diversity, 1450-1750 — drawing on the
 * Ottoman millet system, the Safavid imposition of Twelver Shiism as state
 * religion, and the Mughal swing from Akbar's sulh-i-kul (abolishing the
 * jizya, appointing Hindus to high rank) to Aurangzeb's 1679 reimposition
 * of the jizya — scored against the authentic AP World 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u3-leq-practice.v1',
  title: 'Unit 3 LEQ Practice — Religious Diversity in the Ottoman, Safavid, and Mughal Empires',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u3-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which the Ottoman, Safavid, and Mughal empires differed in their treatment of religious diversity in the period 1450-1750 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-3-LEQ',
    },
  ],
  prerequisites: [
    'apworld.empires-expansion',
    'apworld.empires-administration',
    'apworld.empires-belief-systems',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "Three land-based Muslim empires ruled next to and near each other in this period — Ottoman, Safavid, Mughal — and each took a genuinely different approach to the religious diversity within (and beyond) its own borders. The Ottomans built a durable institution for governing their many non-Muslim subjects. The Safavids instead used religion to forge a new, sharply defined state identity by force. And the Mughals swung dramatically across just four generations, from the most pluralistic policy of any land-based empire in this unit to a serious reversal of it. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about each empire\'s religious policy side by side without connecting them into an argument about HOW and WHY those policies genuinely differed.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position that the three empires differed substantially: the Ottomans institutionalized a stable, if legally subordinate, pluralism across the whole period; the Safavids pursued the most homogenizing, least tolerant policy of the three, actively suppressing the Sunni majority tradition to forge a new sectarian identity; and Mughal policy was the most VARIABLE of all, swinging from Akbar\'s near-unprecedented pluralism to Aurangzeb\'s sharp reversal within the same dynasty — rather than a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the Ottoman and Safavid empires both emerged from the political reordering of the post-Mongol, post-Timurid Middle East, while the Mughal Empire was founded by an outside Central Asian conqueror, Babur, in 1526, ruling from its very first year over an overwhelmingly non-Muslim, Hindu-majority population — a demographic reality that made Mughal religious policy far more consequential to day-to-day imperial administration than it was for the more religiously homogeneous Safavid state.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Ottoman millet system governing Orthodox Christian, Jewish, and Armenian Christian communities as semi-autonomous bodies managing their own internal legal and religious affairs, in exchange for loyalty and the jizya tax; Shah Ismail I\'s 1501 imposition of Twelver Shiism as the compulsory state religion of a previously Sunni-majority Persia, sharpening sectarian rivalry with the Sunni Ottomans; Akbar\'s sulh-i-kul (r. 1556-1605), abolishing the jizya on non-Muslims, appointing Hindus to the highest ranks of Mughal administration as mansabdars, and floating the syncretic Din-i-Ilahi; and Aurangzeb\'s 1679 reimposition of the jizya and more orthodox Sunni religious policies, reversing his great-grandfather Akbar\'s approach.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence across all three empires — e.g. comparing the Ottomans\' STABLE, institutionalized-but-bounded tolerance (the millet system, largely consistent across the whole period) against the Safavids\' HOMOGENIZING suppression of Sunni identity to forge a new sectarian state, and against the Mughals\' internal VARIABILITY across a single dynasty (Akbar to Aurangzeb) — not just cataloging each empire\'s policy in its own paragraph without connecting the three to an argument about the DEGREE and KIND of difference between them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Ottoman, Safavid, and Mughal empires differed in their treatment of religious diversity in the period from 1450 to 1750. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Ottoman, Safavid, and Mughal empires differed substantially in their treatment of religious diversity: the Ottomans institutionalized a stable, if legally subordinate, pluralism through the millet system across the whole period; the Safavids pursued the most homogenizing and least tolerant policy of the three, actively suppressing the Sunni majority tradition to forge a new sectarian Shia identity; and Mughal policy was the most variable of all, swinging from Akbar\'s near-unprecedented pluralism to Aurangzeb\'s sharp reversal within the same dynasty. Contextualization explains that the Ottoman and Safavid empires both emerged from the political reordering of the post-Mongol, post-Timurid Middle East, while the Mughal Empire was founded by an outside Central Asian conqueror, Babur, in 1526, ruling from its very first year over an overwhelmingly non-Muslim, Hindu-majority population — a demographic reality that made Mughal religious policy far more consequential to day-to-day imperial administration than it was for the more religiously homogeneous Safavid state. The evidence section develops specific facts connected to the thesis: the Ottoman millet system governed Orthodox Christian, Jewish, and Armenian Christian communities as semi-autonomous bodies managing their own internal legal and religious affairs, in exchange for loyalty and the jizya tax — real pluralism, but with a legally subordinate status to Muslims; Shah Ismail I imposed Twelver Shiism as the compulsory state religion of a previously Sunni-majority Persia in 1501, sharpening sectarian rivalry with the Sunni Ottomans rather than accommodating internal religious diversity; Akbar (r. 1556-1605) pursued sulh-i-kul, abolishing the jizya on non-Muslims, appointing Hindus to the highest ranks of Mughal administration as mansabdars, and floating the syncretic Din-i-Ilahi; and Aurangzeb reimposed the jizya in 1679 and pursued more orthodox Sunni religious policies, reversing his great-grandfather Akbar\'s approach. Analysis and reasoning uses comparison to connect these facts into an argument rather than a list: the Ottoman millet system represents a durable INSTITUTIONAL solution, largely stable across the whole period covered by this prompt; the Safavid case represents the opposite pole, using religion to HOMOGENIZE and suppress an existing Sunni majority rather than accommodate diversity; and the Mughal case shows that "differed" applies not only across empires but ACROSS TIME within a single empire, since Akbar\'s policy was arguably the most pluralistic of any land-based empire in this unit while Aurangzeb\'s reversal shows that outcome was never fixed or guaranteed — a variability neither the consistently institutionalized Ottoman approach nor the consistently homogenizing Safavid approach displays to nearly the same degree.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Ottoman, Safavid, and Mughal empires differed in their treatment of religious diversity, 1450-1750) AND establishes a line of reasoning for the essay to follow — a clear position on the degree and kind of difference among the three empires, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Ottoman, Safavid, and Mughal empires differed substantially in their treatment of religious diversity: the Ottomans institutionalized a stable, if legally subordinate, pluralism through the millet system across the whole period; the Safavids pursued the most homogenizing and least tolerant policy of the three, suppressing the Sunni majority tradition to forge a new sectarian Shia identity; and Mughal policy was the most variable of all, swinging from Akbar\'s near-unprecedented pluralism to Aurangzeb\'s sharp reversal within the same dynasty.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Ottoman and Safavid empires\' shared emergence from the post-Mongol, post-Timurid reordering of the Middle East, contrasted with the Mughals\' founding as an outside conquest ruling a Hindu-majority population from the start. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              "The Ottoman and Safavid empires both emerged from the political reordering of the post-Mongol, post-Timurid Middle East, while the Mughal Empire was founded by an outside Central Asian conqueror, Babur, in 1526, ruling from its very first year over an overwhelmingly non-Muslim, Hindu-majority population — a demographic reality that made Mughal religious policy far more consequential to day-to-day imperial administration than it was for the more religiously homogeneous Safavid state.",
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Ottoman millet system and jizya, Shah Ismail I\'s 1501 imposition of Twelver Shiism, Akbar\'s sulh-i-kul and Din-i-Ilahi, Aurangzeb\'s 1679 reimposition of the jizya) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              "The Ottoman millet system governed Orthodox Christian, Jewish, and Armenian Christian communities as semi-autonomous bodies managing their own internal legal and religious affairs, in exchange for loyalty and the jizya tax; Shah Ismail I imposed Twelver Shiism as the compulsory state religion of a previously Sunni-majority Persia in 1501; Akbar (r. 1556-1605) abolished the jizya on non-Muslims, appointed Hindus to the highest ranks of Mughal administration as mansabdars, and floated the syncretic Din-i-Ilahi; and Aurangzeb reimposed the jizya in 1679 and pursued more orthodox Sunni religious policies.",
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. comparison) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis — weighing evidence across all three empires, not just describing each in isolation. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              "The Ottoman millet system represents a durable institutional solution, largely stable across the whole period; the Safavid case represents the opposite pole, using religion to homogenize and suppress an existing Sunni majority rather than accommodate diversity; and the Mughal case shows that 'differed' applies not only across empires but across time within a single empire, since Akbar's policy was arguably the most pluralistic of any land-based empire in this unit while Aurangzeb's reversal shows that outcome was never fixed — a variability neither the Ottoman nor the Safavid approach displays to nearly the same degree.",
          },
        ],
      },
      hints: [
        'Take a clear position on the DEGREE and KIND of difference among the three empires — "all three differed substantially, and in different directions" — rather than just listing each empire\'s policy.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual tax, policy, or ruler), not general.',
        'Use comparison across all three empires, not just two: does the empire build a stable INSTITUTION (Ottoman), enforce HOMOGENEITY (Safavid), or show internal VARIABILITY across rulers (Mughal)?',
        'The Mughal case is the strongest ground for a nuanced argument — "differed" can mean differed across time within ONE empire\'s own dynasty, not only differed between empires.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'The Ottoman millet system was a stable, institutionalized (but legally subordinate) pluralism; the Safavids under Shah Ismail I instead imposed Twelver Shiism to homogenize a Sunni-majority population.',
        'The Mughals show the widest internal swing of the three: Akbar\'s sulh-i-kul (abolished jizya, Hindu mansabdars) versus Aurangzeb\'s 1679 reimposition of the jizya — a nuanced thesis can use THIS as its strongest complexity move.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-LEQ',
    cedTitle: 'Unit 3 LEQ Practice — Religious Diversity in the Ottoman, Safavid, and Mughal Empires',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
