/**
 * AP US History — Period 9 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the conservative resurgence (LO 9.2, conservative-
 * resurgence) and its reshaping of American politics and society across the
 * 1980-2008 span, scored against the authentic AP APUSH 6-point LEQ rubric.
 *
 * STRICT NON-PARTISAN FRAMING: the prompt — "evaluate the extent to which
 * conservatism reshaped American politics and society" — is written, and
 * scored, so that a "large extent" thesis and a "limited extent" thesis are
 * EQUALLY defensible with real evidence. The model response below argues a
 * nuanced middle position (large reshaping of the terms of fiscal/economic
 * debate and the judiciary; limited reshaping of the underlying social
 * safety net and of contested social-policy outcomes) precisely so neither
 * "large extent" nor "limited extent" is treated as the one correct answer
 * — competing historical positions are presented as equally legitimate.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u9-leq-practice.v1',
  title: 'Period 9 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u9-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which conservatism reshaped American politics and society, 1980-2008 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-9-LEQ',
    },
  ],
  prerequisites: [
    'apush.conservative-resurgence',
    'apush.globalization-tech',
    'apush.america-since-2001',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied the conservative resurgence of the 1980s, the globalization and technology changes of the 1990s, and the crises of the post-2001 period. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely reshaped politics and society across the board, reshaped mainly the terms of political and economic debate while leaving many social outcomes contested, or reshaped unevenly across different policy areas), not a vague restatement of the prompt. BOTH a "large extent" thesis and a "limited extent" thesis can earn full credit here — the rubric does not privilege either position, only whether it is defensible and establishes a line of reasoning.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the stagflation, energy crises, and loss of confidence in government of the 1970s discredited the decades-old New Deal/Great Society consensus that government activism was the default answer to economic and social problems, opening space for a conservative critique of that consensus well before 1980.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Economic Recovery Tax Act (1981) and Tax Reform Act (1986) cutting income tax rates, the 1981 PATCO strike and firings weakening organized labor, a sustained conservative federal judicial appointment strategy, and Clinton\'s 1996 welfare reform replacing open-ended cash assistance with work-requirement block grants — set alongside evidence of limits, such as Medicare Part D (2003), a Republican administration EXPANDING a federal entitlement, and Roe v. Wade remaining legally intact (reaffirmed with modifications in Planned Parenthood v. Casey, 1992) despite sustained conservative efforts to overturn it.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the New Right coalition\'s 1980 election victory CAUSED a shift in the political center of gravity strong enough that even a Democratic administration governed within more conservative fiscal terms (Clinton declaring "the era of big government is over" alongside welfare reform and deficit reduction) — while also explaining why that same shift did NOT extend as far into the social and entitlement realms, where a Republican administration expanded a federal benefit (Medicare Part D) and core social-policy fights (abortion) remained legally and politically unresolved.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which conservatism reshaped American politics and society in the period 1980–2008. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that conservatism reshaped American politics to a large extent by shifting the terms of acceptable debate on taxation, regulation, and the judiciary so far that even the opposing party\'s leaders governed within its terms, while reshaping American society to a more limited extent, leaving the federal entitlement state largely intact and many of the movement\'s core social goals unresolved by 2008. Contextualization explains that the stagflation, energy crises, and loss of confidence in government during the 1970s discredited the decades-old New Deal/Great Society consensus that government activism was the default answer to economic and social problems, opening real space for a conservative critique well before the 1980 election. The evidence section develops specific facts connected to the thesis: the Economic Recovery Tax Act (1981) and Tax Reform Act (1986) cut individual income tax rates on supply-side theory; the 1981 firing of the striking PATCO air-traffic controllers weakened organized labor\'s bargaining position for years afterward; a sustained conservative strategy of federal judicial appointments shaped constitutional interpretation for decades; and President Clinton\'s 1996 welfare reform replaced open-ended federal cash assistance with time-limited, work-requirement block grants, alongside his declaration that "the era of big government is over" — evidence the shift crossed party lines. Set against this, Medicare Part D (2003), a prescription-drug benefit signed by a Republican administration, expanded rather than shrank a federal entitlement, and Roe v. Wade remained legally intact, reaffirmed with modifications in Planned Parenthood v. Casey (1992), despite sustained conservative efforts to overturn it. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: the New Right coalition\'s 1980 election victory directly caused a shift in the political center of gravity strong enough that even a Democratic administration came to govern within more conservative fiscal terms, evidenced by Clinton\'s own deficit-reduction priorities and welfare reform; but that same causal shift did not extend as far into the entitlement state or into core social-policy disputes, because expanding a popular benefit like prescription-drug coverage carried its own political incentives regardless of party, and a constitutional right upheld by the Supreme Court could not simply be legislated away by a change in the political mood — showing conservatism\'s reshaping of American politics and society was large in some respects (the terms of fiscal debate, the judiciary\'s composition) and limited in others (the entitlement state, core social-policy outcomes), not a uniform transformation in either direction.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which conservatism reshaped American politics and society, 1980-2008) AND establishes a line of reasoning for the essay to follow — EITHER a "large extent" or a "limited extent" position (or a mixed, differentiated position) earns full credit provided it is defensible and reasoned; the rubric does not privilege one position over the other. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Conservatism reshaped American politics to a large extent, shifting the terms of acceptable debate on taxation, regulation, and the judiciary so far that even the opposing party\'s leaders governed within its terms, while reshaping American society to a more limited extent, leaving the federal entitlement state largely intact and many of the movement\'s core social goals unresolved by 2008.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that 1970s stagflation and loss of confidence in government discredited the prior New Deal/Great Society consensus, opening space for a conservative critique before 1980. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The stagflation, energy crises, and loss of confidence in government during the 1970s discredited the decades-old New Deal/Great Society consensus that government activism was the default answer to economic and social problems, opening real political space for a conservative critique well before the 1980 election.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the 1981/1986 tax cuts, the PATCO strike, the conservative judicial appointment strategy, 1996 welfare reform, and counterevidence such as Medicare Part D or Roe v. Wade\'s survival) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Economic Recovery Tax Act (1981) and Tax Reform Act (1986) cut individual income tax rates on supply-side theory; the 1981 PATCO firings weakened organized labor\'s bargaining position for years afterward; a sustained conservative judicial appointment strategy shaped constitutional interpretation for decades; and Clinton\'s 1996 welfare reform replaced open-ended cash assistance with work-requirement block grants. By contrast, Medicare Part D (2003) expanded a federal entitlement under a Republican administration, and Roe v. Wade remained legally intact, reaffirmed with modifications in Planned Parenthood v. Casey (1992).',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis, and weighing evidence on both sides. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The New Right coalition\'s 1980 election victory directly caused a shift in the political center of gravity strong enough that even a Democratic administration came to govern within more conservative fiscal terms, evidenced by Clinton\'s own deficit-reduction priorities and welfare reform. But that same causal shift did not extend as far into the entitlement state or core social-policy disputes, because expanding a popular benefit like prescription-drug coverage carried its own political incentives regardless of party, and a constitutional right upheld by the Supreme Court could not simply be legislated away by a change in political mood.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and the AREA of the reshaping — a "large extent in fiscal/judicial terms, limited extent in social/entitlement terms" thesis is just as strong as an all-or-nothing "large" or "limited" claim.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual law, event, or ruling), not general.',
        'Use causation to connect your evidence: did one political shift directly CAUSE the next policy, and did it reach every area equally, or not?',
        'Counterevidence (Medicare Part D expanding an entitlement, Roe v. Wade surviving) is useful for showing the reshaping was uneven, not complete — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Both a "large extent" and a "limited extent" thesis can earn full credit — the rubric rewards a defensible, reasoned position, not a specific verdict.',
        'A nuanced thesis (large reshaping in fiscal/judicial terms, limited reshaping in social/entitlement terms) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9-LEQ',
    cedTitle: 'Period 9 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
