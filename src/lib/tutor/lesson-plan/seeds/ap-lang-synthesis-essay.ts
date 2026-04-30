/**
 * AP English Language — Synthesis essay strategy.
 *
 * Read 6-7 short sources, take a position, defend it using AT LEAST
 * 3 sources. The "Q1" prompt of AP Lang.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LANG_SYNTHESIS_ESSAY: LessonPlan = {
  id: 'evelyn.ap.lang.synthesis-essay.v1',
  title: 'Synthesis essay strategy (AP Lang Q1)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'aplang.synthesis-essay',
      description: 'Synthesize multiple sources to develop and support a position.',
      standard: 'AP-LANG-ESSAY-1',
    },
  ],
  prerequisites: ['aplang.argument-essay'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame synthesis as building a case using multiple voices.',
      script: 'You get 6-7 documents — articles, charts, cartoons, photos. Then 40 minutes to write an essay using AT LEAST 3 of them to support YOUR position. Synthesis isn\'t summary — it\'s building YOUR argument with sources as evidence.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Six-step approach + how to integrate sources.',
      keyIdeas: [
        'STEP 1: READ the prompt. Identify the issue and what\'s being asked.',
        'STEP 2: SKIM each source — note its main argument, type (statistics? expert? cartoon?), tone (favorable? critical?).',
        'STEP 3: TAKE A POSITION. Don\'t try to please all sources — pick a stance and use sources that support it (or even sources that you can REFUTE).',
        'STEP 4: PLAN. Choose 3-4 sources whose evidence advances your argument. Map each to a body paragraph or sub-point.',
        'STEP 5: WRITE. Each body paragraph: claim → cite source A → cite source B (corroborates or extends) → analyze HOW the sources together support your claim.',
        'STEP 6: CITATION format: (Source A) or (Smith) — short attribution. Don\'t need full bibliography.',
        'AVOID: summary of each source one-by-one (that\'s "list with citations", not synthesis). Each source should be CONNECTED to your thesis.',
        'GOOD synthesis: sources interact. "While Source A argues X, Source B reveals that..." — sources speaking to each other.',
      ],
      vocabulary: [
        { term: 'synthesis', definition: 'combining multiple sources into a unified argument.' },
        { term: 'attribution', definition: 'citing the source of a claim or quote.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'For a synthesis on "value of standardized testing", write a body paragraph using two hypothetical sources to argue testing has SOME value but is overemphasized.',
      steps: [
        'CLAIM: "Standardized tests provide useful benchmarking data, but their disproportionate weight in college admissions distorts incentives."',
        'EVIDENCE 1: "As Source B notes, SAT scores correlate moderately (r ≈ 0.5) with first-year college GPA — making them informative, not predictive."',
        'EVIDENCE 2: "Yet Source D\'s data show that 60% of high-school instructional time in tested subjects is spent on test preparation rather than depth of content."',
        'SYNTHESIS: "Together, these sources reveal a tradeoff: tests provide modestly useful information, but the BEHAVIORAL effects of high-stakes weighting (test-prep crowding out learning) likely outweigh the informational benefit."',
        'Notice: sources INTERACT (B sets up, D refines). The argument advances through the combination — not by quoting each source separately.',
      ],
      answer: 'sources interact and advance a unified claim — not summary of each',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: "What's the difference between SUMMARIZING the sources and SYNTHESIZING them?",
      expectedAnswer: 'summary lists what each source says; synthesis uses sources together to support YOUR argument',
      responseFormat: 'free',
      hints: [
        'Summary: "Source A says X. Source B says Y. Source C says Z."',
        'Synthesis: "Building from Source A and confirmed by Source B, ___; Source C extends this by ___."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-please-sources',
      kind: 'misconception_check',
      question: 'Should you make sure your essay agrees with ALL the sources?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating sources as a chorus to please.',
          correctsTo: "No — sources are EVIDENCE to use. You can DISAGREE with sources and use them to set up rebuttals. The point is YOUR argument; sources serve it. Some sources will support, some you'll counter — that's normal.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Take a clear position. Use at LEAST 3 sources.',
        'Synthesis ≠ summary. Sources should INTERACT.',
        'Each body paragraph: claim → sources → analysis.',
        'You can use sources you DISAGREE with (rebuttal).',
        'Cite briefly: (Source A) or (Smith).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is synthesis useful BEYOND test essays?',
      hint: 'Research papers, news articles, opinion essays, business reports — anywhere you build a case using multiple sources. It\'s the core of college-level academic writing.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
