/**
 * Grades 6-8 ELA — Comparing Texts (Cross-Text Analysis).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_COMPARING_TEXTS: LessonPlan = {
  id: 'evelyn.g68.ela.comparing-texts.v1',
  title: 'Grades 6-8 ELA — Comparing Texts',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.comparing-texts',
      description: 'Compare and contrast two or more texts on the same topic; analyse how authors\' approaches and choices differ.',
      standard: 'CCSS.ELA-LITERACY.RI.7.9',
    },
  ],
  prerequisites: ['g68.ela.advanced-punctuation'],
  followUps: ['g68.ela.analyzing-media'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two articles on the same topic can give you very different impressions — comparing them sharpens your thinking.',
      script: 'A magazine article and a scientific paper on climate change differ in audience, evidence, and tone. Reading both side-by-side reveals what each does well and where each falls short. Today we drill the cross-text analysis framework.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-comparing',
      kind: 'concept',
      goal: 'Compare-contrast structure + dimensions of comparison.',
      keyIdeas: [
        'COMPARE means find SIMILARITIES; CONTRAST means find DIFFERENCES. Both usually appear together.',
        'DIMENSIONS to compare: 1) Topic / focus. 2) Author\'s purpose (inform, persuade, etc.). 3) Audience. 4) Tone. 5) Structure. 6) Evidence used. 7) Author\'s perspective or bias.',
        'STRUCTURE OPTIONS: 1) BLOCK — discuss text A fully, then text B, then compare in conclusion. 2) POINT-BY-POINT — discuss each dimension, comparing both texts on each point.',
        'POINT-BY-POINT is usually CLEARER for analysis essays.',
        'TRANSITIONS: "similarly", "in contrast", "while", "whereas", "however", "both texts...", "neither text..."',
        'AVOID just listing observations: "Text A says X, Text B says Y, the end." Always make a CLAIM about the comparison: "Although both authors aim to inform, A appeals to emotion while B uses statistics."',
        'EVIDENCE: cite specific moments from BOTH texts.',
        'CONCLUSION: don\'t just rehash similarities/differences. Ask "so what?" Why does the comparison matter? What does it tell you about the topic or the authors?',
      ],
      vocabulary: [
        { term: 'compare', definition: 'find similarities between things.' },
        { term: 'contrast', definition: 'find differences between things.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-compare',
      kind: 'worked_example',
      problem: 'Outline a point-by-point comparison of two texts on environmental conservation: a National Geographic article and a children\'s picture book.',
      steps: [
        'Dimension 1 — Audience: National Geographic targets adults; picture book targets children.',
        'Dimension 2 — Tone: Nat Geo: serious, factual. Picture book: playful, emotional.',
        'Dimension 3 — Evidence: Nat Geo: scientific studies, statistics. Picture book: simple narratives, illustrations.',
        'Dimension 4 — Purpose: both inform, but Nat Geo also aims to persuade adults to act; picture book aims to instil early appreciation.',
        'CLAIM: "Although both texts urge environmental protection, they target different reader needs — Nat Geo appeals to adult evidence-seeking, while the picture book builds emotional connection in young readers."',
        'CONCLUSION: "Both texts succeed because their methods MATCH their audiences. Different doesn\'t mean better or worse — it means appropriate."',
      ],
      answer: 'Point-by-point structure with claim and conclusion.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compare ONE dimension between two texts you\'ve read recently. Make a claim about the difference.',
      expectedAnswer: 'Sample: "Both [Text A] and [Text B] discuss bullying, but A uses personal anecdotes while B relies on statistics, suggesting A wants to evoke empathy while B aims to convince through evidence."',
      responseFormat: 'free',
      hints: [
        'Pick one dimension (tone, evidence, etc.).',
        'Make a claim, not just a list.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-list-only',
      kind: 'misconception_check',
      question: 'A student writes a "comparison" that lists 5 things in Text A and 5 in Text B but never connects them. Why is this incomplete?',
      commonErrors: [
        {
          answer: 'List of features in each text',
          misconception: 'Treating "comparison" as parallel lists rather than analysis of the relationship.',
          correctsTo: 'Comparing means showing the RELATIONSHIP. "Text A has X. Text B has Y." Doesn\'t compare; just describes. Comparing requires connection: "Both texts share X, but Text A also includes Y while Text B emphasises Z." The transition words "both", "while", "whereas" force comparison. Always synthesise — don\'t just list.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Compare similarities + contrast differences.',
        'Dimensions: topic, purpose, audience, tone, structure, evidence.',
        'Point-by-point > block for analysis.',
        'Make a CLAIM about the comparison.',
        'Cite evidence from BOTH texts.',
        'Conclude with "so what" — why does the comparison matter?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might it be valuable to compare a primary source with a secondary source on the same event?',
      hint: 'Primary source = first-hand account. Secondary = analysis or retelling. Comparing reveals: what details the secondary source emphasises or omits, how interpretation shapes narrative, and how distance affects perspective. Historical thinking depends on this comparison; without it, you can\'t evaluate the secondary source\'s accuracy.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
