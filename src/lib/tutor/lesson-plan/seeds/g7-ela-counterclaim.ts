/**
 * G7 — Counterclaim and rebuttal in argument writing.
 *
 * Strong arguments acknowledge the OPPOSING view (counterclaim),
 * then refute it (rebuttal). Without this, your argument feels
 * one-sided.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_ELA_COUNTERCLAIM: LessonPlan = {
  id: 'evelyn.g7.ela.argument.counterclaim-rebuttal.v1',
  title: 'Counterclaim and rebuttal',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'argument-writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.7.w.1.b',
      description: 'Acknowledge alternate or opposing claims and support claim(s) with logical reasoning and relevant evidence.',
      standard: 'CCSS.ELA-LITERACY.W.7.1.B',
    },
  ],
  prerequisites: ['ccss.ela.6.w.1'],
  followUps: ['ccss.ela.9-10.w.1.b'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how acknowledging opposing views actually STRENGTHENS your case.',
      script: 'Imagine debating a friend. They say "what about THIS?" If you say "I never thought about that"  — you lose. But if you say "I anticipated that, and here\'s why it doesn\'t change my point" — you win. That\'s the counterclaim move.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-structure',
      kind: 'concept',
      goal: 'Definitions + structure + transitions.',
      keyIdeas: [
        'CLAIM: your main argument or position.',
        'COUNTERCLAIM: the opposing view — what someone who DISAGREES might say.',
        'REBUTTAL: your response showing why the counterclaim doesn\'t defeat your claim.',
        'STRUCTURE: state your claim → present a counterclaim fairly → explain why your claim still wins (rebuttal).',
        'TRANSITIONS for counterclaim: "Some might argue...", "Critics claim...", "Opponents say...".',
        'TRANSITIONS for rebuttal: "However...", "Yet this overlooks...", "While that point has merit, ...".',
        'BE FAIR: don\'t straw-man (misrepresent the opposing view to make it easy to defeat). State the strongest version of the counter-argument.',
        'Acknowledging the counter shows you\'re a CAREFUL thinker. Strengthens your credibility.',
      ],
      vocabulary: [
        { term: 'claim', definition: 'a statement you\'re arguing for.' },
        { term: 'counterclaim', definition: 'an opposing view that disagrees with your claim.' },
        { term: 'rebuttal', definition: 'your response refuting a counterclaim.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-build',
      kind: 'worked_example',
      problem: 'Build a counterclaim and rebuttal for the claim: "Schools should start later in the morning."',
      steps: [
        'CLAIM: Schools should start later — research shows teens need more sleep for health and learning.',
        'COUNTERCLAIM: "Some might argue that later start times disrupt parents\' work schedules and force families to scramble for childcare."',
        'REBUTTAL: "However, this overlooks that several pilot programs have made it work — district-staggered schedules, after-school care expansions, employer flexibility. The health and academic benefits to teens outweigh the temporary scheduling friction."',
        'Notice the shape: state opponent\'s point honestly, then show why your claim still wins.',
      ],
      answer: 'fair counterclaim → "however..." rebuttal that addresses it directly',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For the claim "students should be allowed phones in school", write ONE counterclaim someone might raise.',
      expectedAnswer: 'student-specific (e.g., phones distract from learning, enable cheating, social media drama)',
      responseFormat: 'free',
      hints: [
        'Think: who would DISAGREE? Why?',
        'A teacher\'s biggest concerns about phones?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skip-counter',
      kind: 'misconception_check',
      question: 'Is it stronger to PRETEND the opposing view doesn\'t exist?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Avoiding counterclaims makes argument stronger.',
          correctsTo: 'No — readers KNOW there are counter-arguments. Ignoring them makes you look uninformed or biased. Addressing them shows you\'ve thought it through. Counterintuitively, acknowledging the OTHER side STRENGTHENS your own.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Claim → counterclaim (the opposing view) → rebuttal (your response).',
        'State the counterclaim FAIRLY — don\'t straw-man.',
        'Use transitions: "Some might argue..." → "However...".',
        'Acknowledging counter STRENGTHENS your argument.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a debate judge view a candidate UNFAVORABLY if they never address the opponent\'s points?',
      hint: 'It signals fear or unawareness. Engaging with the strongest opposing arguments demonstrates intellectual honesty and confidence in your own position.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
