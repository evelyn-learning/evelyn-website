/**
 * AP US History — Period 7 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format), using
 * FDR's First Inaugural Address as its stimulus.
 *
 * Stimulus: evelyn.passage.apush-fdr-first-inaugural.v1 (the "the excerpt
 * above..." gotcha — a stimulus SAQ sets `passageId` because the prompt
 * explicitly references the excerpt). Each of the three parts is graded
 * independently, 1 point each, brief-response format (2-4 sentences),
 * scored against the authentic AP APUSH SAQ rubric style.
 *
 * Document fidelity: the excerpt is exactly the SAME two non-adjacent spans
 * seeded on the passage ("fear itself" and, after an ellipsis, "action, and
 * action now ... put people to work"); the famous phrase "bold, persistent
 * experimentation" is from FDR's 1932 Oglethorpe University address, NOT
 * this inaugural, and is never quoted or attributed to it here. Part (c)'s
 * criticism may come from EITHER the political left or right — both are
 * presented as available positions in the rubric, but the student need only
 * explain ONE.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u7-saq-practice.v1',
  title: 'Period 7 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u7-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question using an excerpt from FDR\'s First Inaugural Address as stimulus — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-7-SAQ',
    },
  ],
  prerequisites: [
    'apush.imperialism',
    'apush.progressivism',
    'apush.wwi',
    'apush.twenties',
    'apush.depression-new-deal',
    'apush.wwii-era',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how the Great Depression pushed FDR's New Deal to remake the federal government's economic role. Now you'll answer a Short Answer Question grounded in a real excerpt from his First Inaugural Address — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, including how to read the stimulus excerpt.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'READING THE EXCERPT: this SAQ\'s stimulus is FDR\'s First Inaugural Address (March 4, 1933) — two non-adjacent spans from the same speech, joined by an ellipsis: first "the only thing we have to fear is fear itself," then, later in the address, "action, and action now ... put people to work." Both spans are FDR\'s own words from this one speech; the famous phrase "bold, persistent experimentation" belongs to a DIFFERENT FDR speech (Oglethorpe University, 1932) and should never be quoted as part of this excerpt.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — here, the crisis context the excerpt itself is responding to — a sentence or two is enough if it is specific and correct.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — not just a fact sitting by itself.',
        'The single most common way students lose SAQ points is being too vague: "things were bad in 1933" earns nothing, but "roughly a quarter of the workforce was unemployed and thousands of banks had failed by early 1933" earns credit because it names specific, accurate figures tied directly to the excerpt\'s moment.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the excerpt above, from Franklin D. Roosevelt\'s First Inaugural Address (March 4, 1933), to answer parts (a), (b), and (c).\n(a) Describe the crisis context in which Roosevelt delivered this excerpt.\n(b) Explain ONE specific policy that followed from the excerpt\'s promise of government "action, and action now" to "put people to work."\n(c) Explain ONE criticism the New Deal drew from EITHER the political left or the political right.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-fdr-first-inaugural.v1',
      expectedAnswer:
        '(a) Roosevelt delivered this address on March 4, 1933, at the very depth of the Great Depression: roughly a quarter of the American workforce was unemployed, thousands of banks had failed or were on the verge of failing, and the outgoing Hoover administration had spent three years insisting the crisis would resolve itself without major federal intervention — the paralyzing public fear the excerpt\'s first line directly addresses. (b) One specific policy that followed from the excerpt\'s call for government "action, and action now" to "put people to work" was the Civilian Conservation Corps (CCC), created within FDR\'s first Hundred Days, which directly employed young unemployed men in conservation projects — exactly the kind of direct government job creation the excerpt promises. (c) EITHER position may be explained: from the political left, Louisiana Senator Huey Long criticized the New Deal as insufficiently redistributive, proposing his own "Share Our Wealth" plan for far more aggressive redistribution of income and wealth than Roosevelt\'s actual programs provided; OR from the political right, groups like the American Liberty League argued the New Deal represented a dangerous, unprecedented expansion of federal power and deficit spending that threatened free enterprise and individual liberty.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes the crisis context of early 1933 with at least one specific, accurate detail (e.g. roughly a quarter of the workforce unemployed, widespread bank failures/a banking crisis, Hoover\'s inadequate response). No credit (0/1) for a vague statement ("things were bad") with no specific detail.',
            modelResponse:
              'Roosevelt delivered this address on March 4, 1933, at the depth of the Great Depression, when roughly a quarter of the American workforce was unemployed and thousands of banks had failed or were on the verge of collapse, after three years in which the outgoing Hoover administration had largely resisted direct federal intervention.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate New Deal program connected to direct government job creation (e.g. the Civilian Conservation Corps, the Federal Emergency Relief Administration, the Public Works Administration) and ties it to the excerpt\'s call for government "action" to put people to work. No credit (0/1) for a vague or disconnected claim, or a program unrelated to job creation.',
            modelResponse:
              'The Civilian Conservation Corps (CCC), created within FDR\'s first Hundred Days in 1933, directly employed young unemployed men in conservation and public-works projects — exactly the kind of direct government job creation the excerpt\'s call for "action, and action now" to put people to work promised.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate criticism from EITHER the political left (e.g. Huey Long\'s "Share Our Wealth" plan, arguing the New Deal was not redistributive enough) or the political right (e.g. the American Liberty League, arguing the New Deal dangerously expanded federal power and deficit spending). Either position earns full credit; the response need only explain one. No credit (0/1) for a vague or unsupported claim.',
            modelResponse:
              'From the political left, Louisiana Senator Huey Long criticized the New Deal as insufficiently redistributive, proposing his own "Share Our Wealth" plan for far more aggressive redistribution of income and wealth than Roosevelt\'s actual programs provided.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'For part (a), tie your answer directly to the moment the excerpt itself is responding to: the depth of the banking crisis in early 1933.',
        'For part (b), pick a program that specifically matches the excerpt\'s promise of direct government job creation, not just any New Deal program.',
        'For part (c), you only need ONE side (left OR right) — pick whichever one you can explain with a specific, named example.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'This excerpt is two non-adjacent spans from FDR\'s First Inaugural Address — "bold, persistent experimentation" belongs to a DIFFERENT, 1932 speech and is never part of it.',
        'The excerpt responds to the depth of the banking crisis in early 1933; the CCC is a concrete program matching its call for direct government job creation; the New Deal drew real criticism from both the left (Huey Long) and the right (American Liberty League).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7-SAQ',
    cedTitle: 'Period 7 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain), stimulus-based on FDR\'s First Inaugural Address.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-fdr-first-inaugural.v1',
        chapter: '1933',
        note: 'FDR, First Inaugural Address — stimulus for all three SAQ parts.',
      },
    ],
  },
};
