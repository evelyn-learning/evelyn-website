/**
 * AP US History — Period 5 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets Reconstruction (LO 5.10-5.11), scored against the
 * authentic AP APUSH 6-point LEQ rubric. Reconstruction historiography is
 * presented neutrally — the essay is expected to weigh real gains against
 * real limits, not to assert one settled verdict.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u5-leq-practice.v1',
  title: 'Period 5 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u5-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which Reconstruction fulfilled the promises of emancipation, 1863-1877 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-5-LEQ',
    },
  ],
  prerequisites: [
    'apush.manifest-destiny',
    'apush.sectional-crisis',
    'apush.secession-civil-war',
    'apush.emancipation',
    'apush.reconstruction-era',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how emancipation and the Civil War reopened the question of what freedom would actually mean for four million formerly enslaved Americans, and how Reconstruction tried, and in many ways failed, to answer it. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT to which Reconstruction fulfilled emancipation\'s promises (largely succeeded, largely failed, or a more nuanced claim distinguishing legal/political gains from economic ones), not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the Emancipation Proclamation (1863) had freed enslaved people only in areas still in rebellion, as a wartime measure, leaving the legal status of slavery nationwide, and the practical meaning of freedom for four million people, still unresolved when the war ended in 1865.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Thirteenth (1865), Fourteenth (1868), and Fifteenth (1870) Amendments; the Freedmen\'s Bureau\'s schools, medical aid, and labor-contract mediation; Black officeholding during Radical Reconstruction (Hiram Revels and Blanche K. Bruce in the US Senate, Black state legislators in South Carolina); the sharecropping and crop-lien system that left most freedpeople without land; Ku Klux Klan violence and the Enforcement Acts; and the Compromise of 1877, which withdrew federal troops and ended Reconstruction.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW the constitutional amendments and a brief window of federal enforcement CAUSED real, if temporary, Black political power, while Congress\'s and Southern legislatures\' refusal to redistribute land left freedpeople economically dependent on former enslavers through sharecropping, and how KKK violence combined with waning Northern political will (the Compromise of 1877) reversed most political gains within little more than a decade — not just cataloging changes without connecting them.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
        'A NOTE ON HISTORIOGRAPHY: historians have long debated whether Reconstruction "failed" and why — some older accounts blamed Reconstruction for being "too radical," while most modern scholarship instead emphasizes how quickly and violently white Southern Redemption governments, and the North\'s declining commitment, rolled back real gains. A strong essay can argue either that Reconstruction achieved a genuine (if incomplete and short-lived) revolution, or that its failures decisively outweighed its successes — what matters for the rubric is specific evidence and reasoning, not which side of the debate is chosen.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which Reconstruction fulfilled the promises of emancipation in the period 1863 to 1877. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that Reconstruction fulfilled the legal and political promises of emancipation substantially, if only temporarily, through constitutional amendments and a brief window of Black political power, but failed to secure the economic independence freedpeople needed to make that freedom durable, and that failure — compounded by escalating violence and the North\'s retreat — allowed most of Reconstruction\'s gains to be rolled back by 1877. Contextualization explains that the Emancipation Proclamation (1863) had freed enslaved people only in areas still in rebellion, as a wartime measure, leaving the legal status of slavery nationwide, and the practical meaning of freedom for four million people, still unresolved when the war ended in 1865. The evidence section develops specific facts connected to the thesis: the Thirteenth Amendment (1865) abolished slavery nationwide as constitutional law; the Fourteenth Amendment (1868) established birthright citizenship and equal protection; the Fifteenth Amendment (1870) barred denying the vote based on race; the Freedmen\'s Bureau, established in 1865, built schools, provided medical care, and mediated labor contracts between freedpeople and planters; during Radical Reconstruction, Black Southerners were elected to state legislatures and to Congress, including US Senators Hiram Revels and Blanche K. Bruce of Mississippi; but Congress and Southern legislatures refused to redistribute confiscated or public land to freedpeople, so most ended up as sharecroppers trapped in a crop-lien system of debt to landowners and merchants; the Ku Klux Klan and allied groups used violence and intimidation to suppress Black voting and officeholding, prompting federal Enforcement Acts that only partially checked it; and the Compromise of 1877, which resolved the disputed 1876 election by withdrawing federal troops from the South, ended federal enforcement of Reconstruction and let white Democratic "Redeemer" governments retake power. Analysis and reasoning uses causation and comparison to connect these facts into an argument rather than a list: the constitutional amendments and a brief period of federal military enforcement directly caused freedpeople\'s real, if short-lived, political power in the 1868-1876 period, showing emancipation\'s legal and political promise was substantially fulfilled; but because Congress and Southern legislatures blocked land redistribution, freedpeople remained economically dependent on former enslavers through sharecropping, so the promise of genuine economic independence went largely unfulfilled; and this economic dependence, combined with escalating KKK violence and the North\'s declining political will to enforce Reconstruction — culminating in the Compromise of 1877 — caused most of the era\'s political gains to be reversed within little more than a decade, showing that Reconstruction\'s fulfillment of emancipation\'s promises was real but partial, and its political gains proved far less durable than its economic failures were lasting.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which Reconstruction fulfilled emancipation\'s promises, 1863-1877) AND establishes a line of reasoning for the essay to follow — a clear position on the extent and unevenness of that fulfillment, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Reconstruction fulfilled the legal and political promises of emancipation substantially, if only temporarily, through constitutional amendments and a brief window of Black political power, but failed to secure the economic independence freedpeople needed to make that freedom durable, and that failure, compounded by escalating violence and the North\'s retreat, allowed most of Reconstruction\'s gains to be rolled back by 1877.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the Emancipation Proclamation (1863) had freed enslaved people only in areas still in rebellion, as a wartime measure, leaving the legal status of slavery nationwide unresolved when the war ended. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The Emancipation Proclamation (1863) had freed enslaved people only in areas still in rebellion, as a wartime measure grounded in military necessity, leaving the legal status of slavery nationwide, and the practical meaning of freedom for four million people, still unresolved when the war ended in 1865.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. the Thirteenth/Fourteenth/Fifteenth Amendments, the Freedmen\'s Bureau, Black officeholding, sharecropping and the crop-lien system, KKK violence, the Compromise of 1877) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Thirteenth Amendment (1865) abolished slavery nationwide; the Fourteenth Amendment (1868) established birthright citizenship and equal protection; the Fifteenth Amendment (1870) barred denying the vote based on race; the Freedmen\'s Bureau built schools and mediated labor contracts; Black Southerners including Hiram Revels and Blanche K. Bruce won election to the US Senate during Radical Reconstruction; most freedpeople became sharecroppers trapped in a crop-lien system of debt; the Ku Klux Klan used violence to suppress Black voting; and the Compromise of 1877 withdrew federal troops and ended Reconstruction enforcement.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation, comparison) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'The constitutional amendments and a brief period of federal military enforcement directly caused freedpeople\'s real, if short-lived, political power in the 1868-1876 period. But because Congress and Southern legislatures blocked land redistribution, freedpeople remained economically dependent on former enslavers through sharecropping — and that economic dependence, combined with escalating KKK violence and the North\'s declining political will (culminating in the Compromise of 1877), caused most of the era\'s political gains to be reversed within little more than a decade, showing Reconstruction\'s fulfillment of emancipation\'s promises was real but partial, and far less durable politically than it was disappointing economically.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and evenness of the fulfillment — "real but partial and short-lived" is a stronger line than a flat "yes, it worked" or "no, it failed."',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual amendment, policy, or event), not general.',
        'Use causation to connect your evidence: does federal enforcement explain WHY Black political power rose, and does its withdrawal explain WHY it collapsed?',
        'Distinguishing LEGAL/POLITICAL gains (amendments, officeholding) from ECONOMIC gains (land, sharecropping) is a strong nuanced move — Reconstruction\'s record looks very different depending on which you evaluate.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: federal enforcement and the constitutional amendments caused Black political power to rise, while its withdrawal (Compromise of 1877) caused most gains to collapse.',
        'A nuanced thesis distinguishing real legal/political gains from unfulfilled economic promises tends to score better than an all-or-nothing claim.',
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
    cedTitle: 'Period 5 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
