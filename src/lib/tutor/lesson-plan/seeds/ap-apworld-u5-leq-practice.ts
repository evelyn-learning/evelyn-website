/**
 * AP World History: Modern — Unit 5 LEQ Practice: the full Long Essay
 * Question (AP World FRQ 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets industrialization's transformation of social structures
 * (LOs 5.3-5.6 and 5.7-5.11), drawing on the surrounding Unit-5 content
 * (industrial revolution, industrial society), scored against the authentic
 * AP World 6-point LEQ rubric. Content is measured and accurate: class
 * formation (industrial/factory-owning middle class vs. urban working
 * class), urbanization, women's and child labor, and organized responses
 * (unions, reform legislation, socialism) — no graphic detail, exam-neutral
 * tone throughout.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u5-leq-practice.v1',
  title: 'Unit 5 LEQ Practice — Industrialization and Social Structures',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u5-leq-practice',
      description:
        'Write a complete AP World History Long Essay Question response evaluating the extent to which industrialization transformed social structures, 1750-1900 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP World 6-point LEQ rubric.',
      standard: 'AP-APWORLD-5-LEQ',
    },
  ],
  prerequisites: [
    'apworld.enlightenment',
    'apworld.atlantic-revolutions',
    'apworld.nationalism-unification',
    'apworld.industrial-revolution',
    'apworld.industrial-society',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how industrialization began in Britain and spread, and how it reorganized where and how people lived and worked. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP World History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which industrialization reorganized who held economic power and how ordinary people lived and worked, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that before industrialization, most production in Europe was organized through agriculture and small-scale artisanal or "putting-out" domestic manufacturing, and that Britain\'s combination of coal deposits, accessible capital, colonial markets, and an agricultural revolution that freed up rural labor set the stage for factory-based industrial production beginning in the mid-18th century — the preexisting social landscape industrialization reorganized, rather than a blank slate.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the emergence of a factory-owning industrial middle class (mill owners, manufacturers) alongside a new urban industrial working class concentrated in rapidly growing cities such as Manchester and Lowell; the widespread employment of women and children in early textile mills for long hours at low wages, a pattern documented in British parliamentary investigations such as the Sadler Committee that eventually produced reform legislation like the Factory Act of 1833; and organized worker responses including trade unions and, by mid-century, socialist movements (e.g. Marx and Engels\'s 1848 Communist Manifesto) that argued industrial capitalism itself had created a new class conflict between owners and workers.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the shift from domestic/artisanal production to factory production specifically CAUSED the rise of a propertied industrial middle class distinct from the older landed aristocracy, which in turn CAUSED a parallel rise of an urban working class dependent on wage labor (including women and children) for survival, WHILE ALSO explaining that this transformation produced its own organized responses — unions and reform legislation on one hand, and more radical socialist critique on the other — rather than a single uniform outcome.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP World LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which industrialization transformed social structures in the period from 1750 to 1900. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that industrialization transformed social structures to a great extent between 1750 and 1900 by creating a new factory-owning industrial middle class and a new urban working class dependent on wage labor, including women and children, a transformation significant enough that it provoked its own organized responses ranging from reform legislation to socialist critique. Contextualization explains that before industrialization, most production in Europe was organized through agriculture and small-scale artisanal or "putting-out" domestic manufacturing, and that Britain\'s combination of coal deposits, accessible capital, colonial markets, and an agricultural revolution that freed up rural labor set the stage for factory-based production beginning in the mid-18th century — the preexisting social landscape that industrialization reorganized, not a blank slate. The evidence section develops specific facts connected to the thesis: a new industrial middle class of mill owners and manufacturers emerged alongside a new urban working class concentrated in rapidly growing factory cities such as Manchester and Lowell; women and children were widely employed in early textile mills for long hours at low wages, a pattern documented in British parliamentary investigations such as the Sadler Committee that eventually produced reform legislation like the Factory Act of 1833; and by mid-century organized worker responses included trade unions as well as socialist movements, such as Marx and Engels\'s 1848 Communist Manifesto, which argued that industrial capitalism itself had created a fundamental new conflict between factory owners and workers. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: the shift from domestic and artisanal production to factory production directly caused the rise of a propertied industrial middle class distinct from the older landed aristocracy, which in turn caused a parallel rise of an urban working class dependent on wage labor — including women and children — for survival, while this same transformation produced its own organized responses along more than one track, from reform legislation addressing factory conditions to more radical socialist critique of the wage-labor system itself, demonstrating that industrialization\'s transformation of social structures was substantial and reorganizing, but met with a range of responses rather than a single uniform outcome.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which industrialization transformed social structures, 1750-1900) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Industrialization transformed social structures to a great extent between 1750 and 1900 by creating a new factory-owning industrial middle class and a new urban working class dependent on wage labor, including women and children — a transformation significant enough that it provoked its own organized responses, from reform legislation to socialist critique.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that pre-industrial production was organized through agriculture and small-scale artisanal/domestic manufacturing, and that Britain\'s coal, capital, colonial markets, and agricultural revolution set the stage for factory production. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Before industrialization, most production in Europe was organized through agriculture and small-scale artisanal or "putting-out" domestic manufacturing; Britain\'s combination of coal deposits, accessible capital, colonial markets, and an agricultural revolution that freed up rural labor set the stage for factory-based production beginning in the mid-18th century — the preexisting social landscape that industrialization reorganized, not a blank slate.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the rise of a factory-owning industrial middle class and urban working class, women\'s/children\'s mill labor documented by the Sadler Committee and addressed by the Factory Act of 1833, organized responses including unions and the 1848 Communist Manifesto) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'A new industrial middle class of mill owners and manufacturers emerged alongside a new urban working class concentrated in rapidly growing factory cities such as Manchester and Lowell; women and children were widely employed in early textile mills for long hours at low wages, a pattern documented in parliamentary investigations such as the Sadler Committee that produced reform legislation like the Factory Act of 1833; and by mid-century organized worker responses included trade unions as well as socialist movements such as Marx and Engels\'s 1848 Communist Manifesto.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis, including weighing evidence on more than one side where relevant. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The shift from domestic and artisanal production to factory production directly caused the rise of a propertied industrial middle class distinct from the older landed aristocracy, which in turn caused a parallel rise of an urban working class dependent on wage labor — including women and children — for survival, while this same transformation produced its own organized responses along more than one track, from reform legislation addressing factory conditions to more radical socialist critique of the wage-labor system itself, demonstrating that industrialization\'s transformation of social structures was substantial but met with a range of responses rather than a single uniform outcome.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of transformation — "to a great extent," "unevenly" — rather than just listing facts.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual class, legislation, or movement), not general.',
        'Use causation to connect your evidence: does the shift to factory production directly CAUSE the new middle/working class structure you\'re also discussing?',
        'Contrasting reform-legislation responses (the Factory Act) with more radical socialist responses (the Manifesto) is a strong way to show the transformation provoked more than one kind of reaction — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: the shift to factory production caused the new middle/working-class social structure, which in turn caused organized responses.',
        'A nuanced thesis (transformation was substantial but met with a range of responses — contrast reform legislation with socialist critique) tends to score better than treating every response the same way.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-LEQ',
    cedTitle: 'Unit 5 LEQ Practice — Industrialization and Social Structures',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
