/**
 * GRE — Analytical Writing strategy.
 *
 * One Analyze-an-Issue task, 30 minutes. Structure, evidence,
 * counterargument, sophisticated language.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_ANALYTICAL_WRITING: LessonPlan = {
  id: 'evelyn.testprep.gre.analytical-writing.v1',
  title: 'GRE Analytical Writing: Issue task',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'ela',
  topic: 'gre-aw',
  locale: 'en',
  los: [
    {
      id: 'gre.analytical-writing',
      description: 'Plan and write an effective response to a GRE Issue task within the time limit.',
      standard: 'GRE-AW',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the writing task as argued opinion, not summary.',
      script: 'GRE Analytical Writing gives you a CLAIM and asks you to take a position. 30 minutes. Graders want a clear thesis, supporting evidence, and engagement with counter-arguments — all in well-controlled English.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Five-step approach + evidence + scoring criteria.',
      keyIdeas: [
        'TASK: read a short claim or statement. Take a position. Defend it with reasoning and examples.',
        'STEP 1 (5 min): plan. Identify the issue. Pick a position — even if you don\'t fully agree, pick the easier-to-argue side. Brainstorm 2-3 supporting reasons + a counter-argument.',
        'STEP 2 (intro, ~3 min): hook + clear thesis stating your position. Avoid hedging.',
        'STEP 3 (3-4 body paragraphs, ~15 min): each paragraph: claim → SPECIFIC example → analysis. Examples can be from history, science, current events, literature, or personal observation — but specific names/dates beat vague gestures.',
        'STEP 4 (counter-argument, ~3 min): "Critics might argue..." then refute or qualify.',
        'STEP 5 (conclusion, ~2 min): restate position, extend implication. Brief but conclusive.',
        'SCORING (0-6): graders look for: clear position, persuasive examples, logical organization, sentence variety, mostly correct grammar.',
        'AVOID: pure summary, vague evidence, five-paragraph rigidity that prevents real analysis, overly hedged thesis ("there are good points on both sides").',
      ],
      vocabulary: [
        { term: 'thesis', definition: 'a clear, defensible position statement.' },
        { term: 'counterargument', definition: 'an opposing view to your thesis.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-skeleton',
      kind: 'worked_example',
      problem: 'For a prompt about "the value of competition", build a quick essay skeleton.',
      steps: [
        'POSITION: competition usefully drives improvement when constrained, but pure competition without cooperation produces worse outcomes.',
        'BODY 1: competition drives quality (specific example: tech sector innovation through rivalry).',
        'BODY 2: but pure competition harms collaboration (specific example: scientific progress relies on sharing data — secrecy slows everyone).',
        'BODY 3: best results come from MIXED structures (specific example: open-source software combines competition for ideas with shared codebase).',
        'CONCLUSION: competition is a tool, not a goal. Bounded competition wins; unbounded races to the bottom.',
        'Skeleton built in ~5 min. Now write each section.',
      ],
      answer: 'plan first; specific examples per body paragraph; nuanced position',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does hedging ("there are good points on both sides") hurt your score?',
      expectedAnswer: 'graders need a defensible position; hedging signals you don\'t have one',
      responseFormat: 'free',
      hints: [
        'Score rubric rewards CLEAR thesis.',
        'Equivocating signals lack of analysis.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-five-paragraph-only',
      kind: 'misconception_check',
      question: 'Is the rigid five-paragraph essay format the best structure for GRE AW?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating five-paragraph as a requirement.',
          correctsTo: 'Useful as scaffolding, not a requirement. Strong essays often have 4 or 6 paragraphs and vary in proportion. Graders want clear structure, not rigid templates. A great 4-paragraph essay scores higher than a formulaic 5-paragraph one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '30-minute Issue task: take a position and defend it.',
        'Plan first (5 min). Specific examples beat vague claims.',
        'Engage a counter-argument explicitly.',
        'Avoid hedging in the thesis.',
        'Vary sentence structure; quality > quantity.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do graders prefer a SLIGHTLY nuanced thesis over a hardline one?',
      hint: 'Nuance signals sophisticated thinking. "Position A is correct in conditions X, less so in Y" earns more than "Position A is always right". But still pick a SIDE — nuance ≠ hedging.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
