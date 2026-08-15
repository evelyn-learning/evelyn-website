/**
 * AP English Language — Argument essay strategy.
 *
 * Take a position and defend it with evidence and reasoning. The
 * "Q3" prompt of AP Lang.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LANG_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.lang.argument-essay.v1',
  title: 'Argument essay strategy (AP Lang Q3)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'test-prep',
  topic: 'ap-test-strategy',
  locale: 'en',
  los: [
    {
      id: 'aplang.argument-essay',
      description: 'Develop a defensible position on an issue and support it with evidence and reasoning.',
      standard: 'AP-LANG-ESSAY-3',
    },
  ],
  prerequisites: ['ccss.ela.11-12.w.1'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame argument as taking and defending a stand.',
      script: 'You\'re given a quote, a question, an issue. You have 40 minutes to take a POSITION and defend it. Not "both sides have points" — pick ONE and argue it well. That\'s the AP Lang argument essay.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Five-step strategy + evidence types + scoring.',
      keyIdeas: [
        'STEP 1: READ the prompt. Identify the QUESTION or claim. What\'s the issue?',
        'STEP 2: TAKE A POSITION. Pick a defensible stance — even one you don\'t fully agree with, if it\'s easier to argue. Don\'t hedge.',
        'STEP 3: BRAINSTORM 2-3 strong examples or reasons. Real-world examples (history, current events, science, literature, personal observation) work great.',
        'STEP 4: PLAN. Intro: hook + thesis (your stance). Body 1: first reason + example + analysis. Body 2: second reason + example + analysis. Optional Body 3: counterclaim + rebuttal. Conclusion: extend the implication.',
        'STEP 5: WRITE. Each body paragraph hits: CLAIM (mini-argument supporting thesis), EVIDENCE (specific example), ANALYSIS (why this evidence supports your thesis).',
        'EVIDENCE that scores well: SPECIFIC examples with names, dates, details. Vague generalities ("everyone knows") don\'t count.',
        'AVOID: hedging ("on the other hand maybe..."), summary of the prompt, vague evidence, predictable cliché topics.',
        'AP Lang scoring rubric: defensible thesis + specific evidence + nuanced reasoning = 6/6. Lack of any one = lower score.',
      ],
      vocabulary: [
        { term: 'thesis', definition: 'a clear, defensible position statement.' },
        { term: 'commentary', definition: 'analysis explaining why your evidence supports your claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'For a prompt about "the value of failure", write one body paragraph defending the position that failure is essential to growth.',
      steps: [
        'TOPIC SENTENCE (claim): "Failure functions as the necessary engine of meaningful learning, exposing weaknesses success would have masked."',
        'EVIDENCE: "Consider Thomas Edison, who reportedly conducted thousands of failed experiments before producing a workable lightbulb. Each failure was diagnostic — it RULED OUT a non-working approach, narrowing the path."',
        'ANALYSIS: "Without those failures, Edison would have lacked the negative-space data — the knowledge of what doesn\'t work — that made eventually finding what DOES work possible. The perceived ‘waste\' of failure was actually the structure of progress."',
        'TRANSITION: "Beyond science, the same dynamic operates in personal development..."',
        'Notice: SPECIFIC (Edison + thousands), ANALYTICAL (explains the mechanism), CONNECTED to the thesis.',
      ],
      answer: 'specific example + commentary explaining HOW it supports the thesis',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why would saying "I see good points on both sides" hurt your AP Lang argument essay score?',
      expectedAnswer: "rubric requires a defensible position; hedging signals you don't have one",
      responseFormat: 'free',
      hints: [
        'The rubric awards points for a CLEAR thesis.',
        'Hedging suggests you can\'t commit to a position.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vague-fine',
      kind: 'misconception_check',
      question: 'Is "we\'ve all seen examples of this" enough as evidence?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Vague gesturing as evidence.',
          correctsTo: 'No — graders need SPECIFIC evidence: a named historical figure, dated event, specific text, concrete observation. "Everyone knows" or "many people" doesn\'t move the score. Even if your example is from personal experience, give specifics.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Take a CLEAR position. No hedging.',
        'Support with 2-3 SPECIFIC examples (history, science, literature, observation).',
        'Each body paragraph: claim + evidence + analysis.',
        'Avoid summary of the prompt or vague generalities.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When a counterclaim acknowledges the OTHER position, why does it strengthen rather than weaken your argument?',
      hint: 'Shows you understand the issue thoroughly. Demonstrates intellectual honesty. Pre-empts what the reader might object to. Gives you the chance to dispatch the strongest opposition directly.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
