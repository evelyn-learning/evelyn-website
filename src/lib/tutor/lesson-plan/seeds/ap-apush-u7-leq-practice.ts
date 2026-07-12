/**
 * AP US History — Period 7 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the New Deal's transformation of the relationship between
 * Americans and their federal government (LO 7.11-7.12 depression-new-deal,
 * with the period bounded through 1945 by LO 7.13-7.15 wwii), scored
 * against the authentic AP APUSH 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u7-leq-practice.v1',
  title: 'Period 7 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u7-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which the New Deal transformed the relationship between Americans and their federal government in the period 1929-1945 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-7-LEQ',
    },
  ],
  prerequisites: [
    'apush.imperialism',
    'apush.progressivism',
    'apush.wwi',
    'apush.twenties',
    'apush.depression-new-deal',
    'apush.wwii',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how the Great Depression shattered the country's faith in a limited federal government, how FDR's New Deal answered that crisis with an unprecedented burst of federal programs, and how the Second World War's mobilization reshaped American society yet again. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely transformative, largely unchanged, or transformative in some ways but not others) to which the New Deal transformed Americans\' relationship to the federal government, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that before the Great Depression, the federal government\'s peacetime role in ordinary Americans\' economic lives was narrow, and that Hoover\'s limited, voluntary-cooperation response to the 1929 crash — including forcibly dispersing the 1932 Bonus Army — had, by 1933, discredited the idea that Washington could or should stay largely out of citizens\' economic security, creating the political opening FDR\'s New Deal would fill.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Hundred Days\' alphabet agencies (the CCC directly employing young men, the AAA paying farmers, the NRA setting industry codes, the TVA building public infrastructure); the Second New Deal\'s Wagner Act (1935, guaranteeing collective bargaining) and Social Security Act (1935, creating old-age pensions and unemployment insurance); the 1937 court-packing fight after the Supreme Court struck down the NRA and AAA; critics from the right (the American Liberty League, warning of dangerous federal overreach) and the left (Huey Long\'s "Share Our Wealth" plan, demanding more redistribution); the New Deal coalition\'s durability alongside its real limits (Social Security\'s initial exclusion of agricultural and domestic workers, disproportionately Black occupations); and the fact that full economic recovery came only from World War II\'s massive wartime spending and industrial mobilization after 1941, not from the New Deal programs themselves.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. contrasting the pre-1933 federal government (narrow, reactive, largely absent from citizens\' economic security) with the post-New Deal federal government (an active provider of jobs, a guarantor of collective-bargaining rights, and a permanent old-age and unemployment safety net) to show real, lasting institutional change, while also weighing the limits of that change — the New Deal did not end the Depression itself, and its benefits reached white male industrial workers more fully than Black Americans, agricultural and domestic workers, and women — so that the transformation, while real and durable, was neither complete nor evenly distributed within this period.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the New Deal transformed the relationship between Americans and their federal government in the period from 1929 to 1945. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the New Deal fundamentally and durably transformed Americans\' relationship to the federal government, from a distant, largely reactive presence into an active provider of jobs, a guarantor of workers\' collective-bargaining rights, and a permanent source of economic security — but that this transformation was neither immediate nor evenly distributed, since it did not end the Depression itself and reached some groups of Americans far less fully than others. Contextualization explains that before the Depression, the federal government\'s peacetime role in ordinary citizens\' economic lives was narrow, and that Hoover\'s limited, voluntary-cooperation response to the 1929 crash — including forcibly dispersing the 1932 Bonus Army of unemployed veterans — had, by 1933, discredited the idea that Washington could stay largely out of citizens\' economic security, creating the political opening FDR\'s New Deal would fill. The evidence section develops specific facts connected to the thesis: FDR\'s Hundred Days (1933) launched an unprecedented burst of "alphabet" agencies — the Civilian Conservation Corps directly employing young men, the Agricultural Adjustment Act paying farmers to limit production, the National Recovery Administration setting industry-wide codes, and the Tennessee Valley Authority building public infrastructure and providing electricity to a poor region — putting the federal government directly into citizens\' economic lives in ways it never had in peacetime; the Second New Deal (1935) added the Wagner Act, guaranteeing workers the right to organize and bargain collectively, and the Social Security Act, creating old-age pensions and unemployment insurance that remain in force today; the 1937 court-packing fight, after the conservative Supreme Court struck down the NRA and AAA, showed the New Deal\'s expansion of federal power provoked serious institutional pushback even from within Roosevelt\'s own coalition; critics attacked the New Deal from the right (the American Liberty League, warning it dangerously expanded federal power and deficit spending) and from the left (Huey Long\'s "Share Our Wealth" plan, arguing it did not redistribute wealth aggressively enough); and while the New Deal built a durable coalition of urban workers, unions, and Northern minorities alongside white Southerners, Social Security\'s initial exclusion of agricultural and domestic workers — occupations disproportionately held by Black Americans — shows the transformation\'s benefits were unevenly distributed, and full economic recovery came only from World War II\'s massive wartime spending and industrial mobilization after 1941, not from the New Deal programs themselves. Analysis and reasoning uses comparison and continuity/change to weigh how much actually changed: contrasting the pre-1933 federal government, narrow and largely reactive in citizens\' economic lives, against the post-New Deal government that permanently guaranteed collective-bargaining rights and old-age economic security, shows real and lasting institutional transformation — the Wagner Act and Social Security Act still structure American economic life today, unlike most of the 1933 emergency agencies — while the persistence of mass unemployment through the 1930s, the New Deal\'s uneven reach across race and gender, and the fact that only wartime spending actually ended the Depression together show that transformation, while real and durable in its core institutions, was neither immediate nor complete within this period.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the New Deal transformed the relationship between Americans and their federal government, 1929-1945) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The New Deal fundamentally and durably transformed Americans\' relationship to the federal government, from a distant, largely reactive presence into an active provider of jobs, a guarantor of workers\' collective-bargaining rights, and a permanent source of economic security — but this transformation was neither immediate nor evenly distributed, since it did not end the Depression itself and reached some groups of Americans far less fully than others.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the federal government\'s narrow pre-Depression economic role, combined with Hoover\'s limited, voluntary-cooperation response (including forcibly dispersing the 1932 Bonus Army), had discredited a hands-off federal posture by 1933 and created the political opening the New Deal would fill. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Before the Depression, the federal government\'s peacetime role in ordinary citizens\' economic lives was narrow, and Hoover\'s limited, voluntary-cooperation response to the 1929 crash — including forcibly dispersing the 1932 Bonus Army of unemployed veterans — had, by 1933, discredited the idea that Washington could stay largely out of citizens\' economic security, creating the political opening FDR\'s New Deal would fill.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Hundred Days\' alphabet agencies, the Wagner Act and Social Security Act, the 1937 court-packing fight, critics from left and right, the New Deal coalition\'s limits, WWII spending ending the Depression) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'FDR\'s Hundred Days (1933) launched "alphabet" agencies — the CCC directly employing young men, the AAA paying farmers, the NRA setting industry codes, the TVA building public infrastructure; the Second New Deal (1935) added the Wagner Act, guaranteeing collective bargaining, and the Social Security Act, creating old-age pensions and unemployment insurance still in force today; the 1937 court-packing fight followed the Supreme Court striking down the NRA and AAA; critics attacked from the right (the American Liberty League) and the left (Huey Long\'s "Share Our Wealth" plan); and Social Security\'s initial exclusion of agricultural and domestic workers limited its reach for many Black Americans, while full economic recovery ultimately came only from World War II\'s wartime spending after 1941.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. comparison, continuity/change) to connect the evidence into an argument that fully addresses the prompt, weighing evidence on both sides where relevant and explaining WHY the pieces of evidence relate to a verdict on transformation. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Contrasting the pre-1933 federal government, narrow and largely reactive in citizens\' economic lives, against the post-New Deal government that permanently guaranteed collective-bargaining rights and old-age economic security, shows real and lasting institutional transformation — the Wagner Act and Social Security Act still structure American economic life today, unlike most of the 1933 emergency agencies — while the persistence of mass unemployment through the 1930s, the New Deal\'s uneven reach across race and gender, and the fact that only wartime spending actually ended the Depression together show that transformation, while real and durable in its core institutions, was neither immediate nor complete within this period.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of transformation — "largely transformative," "largely unchanged," or "transformative in some ways, not others" — rather than just listing New Deal programs.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual agency, law, or critic), not general.',
        'Comparison and continuity/change are strong reasoning tools here: what changed permanently (Wagner Act, Social Security) versus what was temporary (most 1933 alphabet agencies) or incomplete (uneven reach across race and gender)?',
        'A nuanced thesis (real, durable institutional change, but incomplete and unevenly distributed within this period) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Comparison and continuity/change are strong reasoning tools here: durable institutions (Wagner Act, Social Security) versus temporary agencies and uneven reach across race and gender.',
        'A nuanced thesis (real, durable institutional transformation, but incomplete and unevenly distributed within 1929-1945) tends to score better than an all-or-nothing claim.',
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
    cedTitle: 'Period 7 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
