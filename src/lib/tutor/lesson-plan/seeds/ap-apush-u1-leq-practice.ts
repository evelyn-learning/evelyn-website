/**
 * AP US History — Period 1 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the Columbian Exchange (LO 1.4-1.5) and its uneven impact
 * on societies on either side of the Atlantic, scored against the authentic
 * AP APUSH 6-point LEQ rubric. Facts kept consistent with the Columbian
 * Exchange content plan (ap-apush-u1-columbian-exchange.ts): bidirectional
 * crop/animal/disease transfer, the ~90% demographic-catastrophe estimate
 * in the hardest-hit regions, the potato as a Northern European staple.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U1_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u1-leq-practice.v1',
  title: 'Period 1 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u1-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which the Columbian Exchange transformed societies on either side of the Atlantic — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-1-LEQ',
    },
  ],
  prerequisites: [
    'apush.native-societies',
    'apush.columbian-exchange',
    'apush.spanish-colonization',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied the bidirectional Columbian Exchange — crops and animals moving both ways across the Atlantic, disease moving overwhelmingly west, and the demographic catastrophe that followed for Native American populations. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which the Columbian Exchange transformed societies on both sides of the Atlantic, and specifying that the transformation was profound but strikingly unequal in its human cost, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that Columbus\'s 1492 voyage initiated the first sustained contact between two hemispheres that had developed biologically and culturally apart for millennia, setting off exchange on a scale with no prior precedent.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. maize, potatoes, and tomatoes moving east and reshaping Afro-Eurasian diets (the potato becoming a staple crop across much of Northern Europe), wheat, horses, and cattle moving west into the Americas (horses transforming hunting, travel, and warfare for many Native peoples), and Old World diseases like smallpox and measles moving west and causing losses estimated as high as roughly 90% in some of the hardest-hit regions within the first century of contact.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the introduction of Old World diseases into populations with no prior immunity CAUSED catastrophic mortality that in turn undermined Native political and military capacity to resist colonization, while separately explaining how new American food crops CAUSED population growth in parts of Afro-Eurasia — not just cataloging transfers without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the Columbian Exchange transformed societies on either side of the Atlantic in the period 1491–1607. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the Columbian Exchange transformed societies on both sides of the Atlantic profoundly, but with a striking imbalance in human cost: Native American societies suffered a demographic catastrophe from disease that undermined their capacity to resist colonization, while Afro-Eurasian societies mostly gained new food sources that supported population growth. Contextualization explains that Columbus\'s 1492 voyage initiated the first sustained contact between two hemispheres that had developed biologically and culturally apart for millennia, so the resulting exchange of crops, animals, and disease had no precedent in scale and unfolded largely without either side anticipating its consequences. The evidence section develops specific facts connected to the thesis: maize, potatoes, and tomatoes moved east across the Atlantic, and the potato in particular became a staple crop across much of Northern Europe because it grew well in poor soil and produced more calories per acre than traditional grains, supporting significant population growth in the following centuries; wheat, horses, and cattle moved west into the Americas, with horses in particular — an animal that had not existed anywhere in the Americas before contact — transforming how many Native peoples hunted, traveled, and made war in the generations after their introduction; and Old World diseases such as smallpox and measles, to which Native populations had no prior exposure or immunity, caused a demographic catastrophe with losses estimated as high as roughly 90% in some of the hardest-hit regions, such as parts of the Caribbean and central Mexico, within the first century of contact. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: the introduction of diseases into populations with no acquired immunity caused catastrophic virgin-soil epidemics that killed enormous numbers of people well before large numbers of European colonists had even arrived in a given region, and that same demographic collapse directly weakened many Native societies\' capacity to organize political and military resistance to the colonization that followed, showing disease was not merely a side effect of contact but a primary mechanism that enabled conquest; meanwhile, on the other side of the Atlantic, the same exchange caused population growth rather than collapse, since new high-calorie American crops like the potato and maize gave Afro-Eurasian societies additional reliable food sources without a corresponding demographic cost, since Afro-Eurasian populations had, over millennia of shared contact across Eurasia and Africa, already acquired much of the immunity that Native Americans lacked — showing the same biological exchange produced opposite demographic outcomes depending on which population\'s immune history it encountered.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the Columbian Exchange transformed societies on either side of the Atlantic, 1491-1607) AND establishes a line of reasoning for the essay to follow — a clear position on the extent and nature of the transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The Columbian Exchange transformed societies on both sides of the Atlantic profoundly, but with a striking imbalance in human cost: Native American societies suffered a demographic catastrophe from disease that undermined their capacity to resist colonization, while Afro-Eurasian societies mostly gained new food sources that supported population growth.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. Columbus\'s 1492 voyage initiating the first sustained contact between two hemispheres that had developed apart for millennia, giving the resulting exchange no precedent in scale. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Columbus\'s 1492 voyage initiated the first sustained contact between the Eastern and Western Hemispheres after millennia of biological and cultural separation, so the crops, animals, and diseases that began moving across the Atlantic in both directions had no precedent in scale, and neither side fully anticipated the consequences that followed.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. maize/potatoes/tomatoes moving east, the potato as a Northern European staple, wheat/horses/cattle moving west, horses transforming Native hunting and warfare, smallpox/measles causing losses as high as roughly 90% in the hardest-hit regions) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'Maize, potatoes, and tomatoes moved east to the Eastern Hemisphere, with the potato becoming a staple crop across much of Northern Europe; wheat, horses, and cattle moved west into the Americas, with horses transforming how many Native peoples hunted, traveled, and made war; and Old World diseases like smallpox and measles, to which Native populations had no prior immunity, caused population losses estimated as high as roughly 90% in some of the hardest-hit regions within the first century of contact.',
          },
          {
            criterionId: 'D-analysis-reasoning',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The introduction of diseases into populations with no acquired immunity caused catastrophic virgin-soil epidemics that killed enormous numbers of people even ahead of colonists\' physical arrival in many regions, and that same demographic collapse directly weakened Native societies\' capacity to organize resistance to the colonization that followed — showing disease was a mechanism that enabled conquest, not just a side effect of it. On the other side of the Atlantic, the same exchange caused population growth rather than collapse, since new high-calorie American crops gave Afro-Eurasian societies additional food sources without a comparable demographic cost, because those populations had already acquired much of the disease immunity Native Americans lacked — showing one biological exchange produced opposite demographic outcomes depending on which population\'s immune history it encountered.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and NATURE of the transformation — "profound but unequal" is stronger than just "the Exchange changed things."',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual crop, animal, or disease), not general.',
        'Use causation to connect your evidence: does disease CAUSE something else you\'re also discussing, like weakened resistance to colonization?',
        'A nuanced argument contrasts the two sides of the Atlantic directly — population catastrophe on one side, population growth on the other — rather than treating "transformation" as a single flat verdict.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: disease immunity gaps caused catastrophic Native mortality, which caused weakened capacity to resist colonization.',
        'A nuanced thesis contrasting demographic catastrophe (Americas) with demographic growth (Afro-Eurasia) tends to score better than an all-or-nothing claim.',
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
    cedTitle: 'Period 1 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
