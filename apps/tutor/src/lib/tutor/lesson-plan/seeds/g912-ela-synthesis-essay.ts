/**
 * Grades 9-12 ELA — Synthesis Essay (Combining Sources).
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_SYNTHESIS_ESSAY: LessonPlan = {
  id: 'evelyn.g912.ela.synthesis-essay.v1',
  title: 'Grades 9-12 ELA — Synthesis Essay',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.synthesis-essay',
      description: 'Write a synthesis essay drawing from multiple sources to support an original argument; demonstrate the AP-style "synthesis" skill.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.1',
    },
  ],
  prerequisites: ['g912.ela.research-paper'],
  followUps: ['g912.ela.mla-apa-citation'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Synthesis is the difference between summarising sources and using them to build something new.',
      script: 'A weak essay says "Source A says X. Source B says Y. Source C says Z. So X, Y, Z." That\'s summary. A synthesis says "Source A and B agree on X, but disagree on its causes; Source C\'s data resolves the disagreement by..." That\'s analysis. AP English Language demands this skill. Today we drill it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-synthesis',
      kind: 'concept',
      goal: 'Synthesis vs summary + integration techniques + structure.',
      keyIdeas: [
        'SYNTHESIS: combining ideas from multiple sources to support YOUR own argument. Sources serve YOU, not the reverse.',
        'SUMMARY ≠ SYNTHESIS. Summary describes what each source says. Synthesis explains how sources connect, contradict, or build on each other.',
        'KEY MOVES: 1) Identify points of agreement/disagreement. 2) Look for gaps. 3) Use multiple sources to triangulate. 4) Build YOUR claim, citing sources as support.',
        'STRUCTURE for a synthesis paragraph: 1) Topic sentence (your claim). 2) Multiple sources cited side-by-side. 3) Synthesis sentence connecting them. 4) Application to your thesis.',
        'AP-STYLE SYNTHESIS: usually 6-7 sources, must use 3+. Argue a position, integrate sources as evidence.',
        'AVOID: stringing together summaries. "Author A says... Author B says..." with no connection.',
        'TRANSITIONS for synthesis: "Both authors agree...", "While X argues... Y counters...", "Together, these sources show...", "X\'s data complements Y\'s argument...".',
        'YOUR voice should DOMINATE. Sources are evidence; YOU are arguing.',
      ],
      vocabulary: [
        { term: 'synthesis', definition: 'combining ideas from multiple sources to form a new analysis or argument.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-synth',
      kind: 'worked_example',
      problem: 'Write a synthesis paragraph using these two source claims: Source A — "Smartphones harm teen attention." Source B — "Smartphones can support learning when used intentionally."',
      steps: [
        'TOPIC SENTENCE (your claim): "The effect of smartphones on teenage learning depends largely on how they are used."',
        'INTRODUCE SOURCE A: "Critics like Smith (2023) document that unstructured smartphone use during class hours correlates with measurable attention drops."',
        'INTRODUCE SOURCE B: "However, Lopez (2024) finds that when teachers integrate smartphones for collaborative tasks, students show increased engagement."',
        'SYNTHESIS SENTENCE: "These findings are not contradictory; they share a common premise that USE PATTERN is decisive. Unstructured use harms; structured use helps."',
        'APPLICATION: "Therefore, smartphone policy in schools should focus less on bans and more on guided integration."',
      ],
      answer: 'Synthesis paragraph showing claim + side-by-side sources + connection + application.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two sources: A — "Reading print improves comprehension over screens." B — "Digital reading is more accessible for struggling readers." Write a one-sentence synthesis.',
      expectedAnswer: 'Sample: "Print and digital reading serve different purposes — print may aid comprehension for typical readers, while digital tools improve access for those who struggle, suggesting both formats have a place in education."',
      responseFormat: 'free',
      hints: [
        'How do these claims COMPLEMENT (not just oppose) each other?',
        'Find the underlying point both touch on.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-summary-stack',
      kind: 'misconception_check',
      question: 'A student writes "Author A argues X. Author B argues Y. Author C argues Z. These are all important views on the topic." Why is this NOT synthesis?',
      commonErrors: [
        {
          answer: 'Summary stack',
          misconception: 'Listing source claims without connecting or analysing them.',
          correctsTo: 'Synthesis demands CONNECTION and ANALYSIS. The student\'s version doesn\'t show how A, B, C relate. Better: "Authors A and B both emphasise X but disagree on causes; Author C\'s longitudinal data clarifies that..." OR: "While A and B address only short-term effects, C\'s findings on long-term trends reframe the debate." Synthesis writers TRANSFORM the sources into something new.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Synthesis ≠ summary.',
        'Connect sources: agreement, disagreement, gaps.',
        'Cite multiple sources side-by-side, then synthesise.',
        'Use sources as evidence for YOUR argument.',
        'Synthesis transitions: "Together, these...", "While... yet...", "X complements Y..."',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is synthesis different from a "literature review" in academic writing?',
      hint: 'A literature review SURVEYS what has been said on a topic — descriptive. Synthesis takes the survey and BUILDS something new from it — argumentative. Lit reviews often appear inside synthesis papers as a foundation. The key difference is whether you\'re reporting what\'s out there or arguing your own position USING what\'s out there.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
