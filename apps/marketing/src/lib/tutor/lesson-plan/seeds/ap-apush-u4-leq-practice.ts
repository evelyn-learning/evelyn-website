/**
 * AP US History — Period 4 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Market Revolution (LO 4.5), scored against the
 * authentic AP APUSH 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u4-leq-practice.v1',
  title: 'Period 4 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u4-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which the Market Revolution changed American society — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-4-LEQ',
    },
  ],
  prerequisites: [
    'apush.jefferson-era',
    'apush.market-revolution',
    'apush.jacksonian-democracy',
    'apush.reform-awakening',
    'apush.slavery-south',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the transportation revolution, the factory system, commercial agriculture, immigration, and the cult of domesticity reorganized how Americans worked and lived between 1800 and 1848. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which the Market Revolution changed American society (transformed it dramatically, changed it only unevenly, or some comparably defensible nuance), not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that before 1800 most American households were largely self-sufficient, producing their own food and cloth and rarely handling cash, a baseline against which the Market Revolution\'s changes can be measured.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Erie Canal (1825) connecting the Midwest to Eastern markets, the Lowell mills\' wage-labor factory system, interchangeable parts speeding manufacturing, the shift to commercial agriculture, the surge of Irish and German immigration in the 1830s-40s, the rise of the cult of domesticity, and the rural South\'s continued reliance on plantation slavery rather than wage-factory labor.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW canal and rail access specifically CAUSED factory investment and commercial farming to become profitable in the Northeast and Midwest, while the South\'s ALREADY-profitable cotton export economy gave planters incentive to reinvest in land and enslaved labor instead — not just cataloging changes without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Market Revolution changed American society in the period from 1800 to 1848. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Market Revolution transformed American society dramatically in the Northeast and parts of the Midwest — reorganizing work around wage labor, cash markets, and new gender ideologies — but changed the rural South far less, where an already-profitable plantation-slave economy deepened along its existing track instead of converting to wage-factory labor. Contextualization explains that before 1800, most American families were largely self-sufficient, growing their own food and spinning their own cloth with little cash exchange, a baseline of household production against which the following decades\' transformation stands out sharply. The evidence section develops specific facts connected to the thesis: the Erie Canal, completed in 1825, cut the cost and time of shipping goods between the Midwest and New York City, turning commercial agriculture (farmers growing cash crops for distant markets rather than their own use) into a profitable choice for Midwestern farmers for the first time; the Lowell mills, beginning in the 1820s, pioneered a factory system employing young, unmarried New England women for wages, an early large-scale instance of work moving outside the household; interchangeable parts made mass production of goods like firearms faster and cheaper; a surge of Irish and German immigration in the 1830s-40s supplied labor for canal, railroad, and factory work, while also provoking nativist backlash; the cult of domesticity arose as an ideology idealizing a separate home sphere for middle-class white women as wage work moved men (and some women) outside the household, though it did not describe most working-class, immigrant, or enslaved women\'s lives; and the rural South, by contrast, remained oriented around plantation agriculture worked by enslaved labor, with comparatively little factory-based wage industry. Analysis and reasoning uses causation and comparison to connect these facts into an argument rather than a list: canal and rail access directly caused factory investment and commercial farming to become profitable in the Northeast and parts of the Midwest, producing the Lowell-mill-style wage-labor system and the shift toward cash-crop agriculture; the same reasoning explains why the South changed differently rather than simply less — its cotton-export economy was already highly profitable, so planters had every incentive to reinvest in more land and more enslaved labor rather than in factories, deepening market integration along an agricultural-export axis instead of an industrial-wage one; and this uneven regional pattern, alongside the cult of domesticity\'s narrow reach, shows the Market Revolution reorganized American life along multiple different tracks rather than converting the whole country to a single industrial model.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Market Revolution changed American society, 1800-1848) AND establishes a line of reasoning for the essay to follow — a clear position on the extent and unevenness of the change, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Market Revolution transformed American society dramatically in the Northeast and parts of the Midwest — reorganizing work around wage labor, cash markets, and new gender ideologies — but changed the rural South far less, where an already-profitable plantation-slave economy deepened along its existing track instead of converting to wage-factory labor.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that before 1800 most American households were largely self-sufficient, producing their own food and cloth with little cash exchange, a baseline against which the following decades\' changes can be measured. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Before 1800, most American families were largely self-sufficient — growing their own food, spinning their own cloth, and rarely handling cash at all — a baseline of household production against which the Market Revolution\'s transformation of work and daily life over the following decades stands out sharply.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Erie Canal, the Lowell mills, interchangeable parts, commercial agriculture, Irish/German immigration, the cult of domesticity, the South\'s continued plantation-slave economy) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Erie Canal (completed 1825) cut the cost and time of shipping goods between the Midwest and New York City; the Lowell mills pioneered a wage-labor factory system employing young, unmarried New England women; interchangeable parts sped up manufacturing; Irish and German immigration surged in the 1830s-40s, supplying labor for canals, railroads, and factories; the cult of domesticity idealized a separate home sphere for middle-class white women; and the rural South remained oriented around plantation agriculture worked by enslaved labor.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation, comparison) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Canal and rail access directly caused factory investment and commercial farming to become profitable in the Northeast and parts of the Midwest, producing the Lowell-mill-style wage-labor system and a shift toward cash-crop agriculture. The South, by contrast, changed differently rather than simply less: its cotton-export economy was already highly profitable, so planters had every incentive to reinvest in more land and enslaved labor rather than in factories, deepening market integration along an agricultural-export axis instead of an industrial-wage one — showing the Market Revolution reorganized American life along multiple different tracks rather than converting the whole country to a single industrial model.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and evenness of the change — "dramatic but uneven" is a stronger line than a flat "yes, it changed everything."',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual canal, factory, or policy), not general.',
        'Use causation to connect your evidence: does transportation access explain WHY a region industrialized (or didn\'t)?',
        'The South\'s plantation-slave economy is useful for showing the Market Revolution did not touch the whole country the same way — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: transportation access caused factory investment and commercial farming to become profitable, while the South\'s already-profitable cotton economy caused it to deepen plantation slavery instead.',
        'A nuanced thesis (dramatic change in some regions, little change in others) tends to score better than an all-or-nothing claim.',
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
    cedTitle: 'Period 4 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
