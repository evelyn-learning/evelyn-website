/**
 * G11 — ELA: Rhetorical analysis (ethos, pathos, logos, rhetorical devices).
 *
 * Analyzing HOW a speech, essay, or ad persuades — not whether you
 * agree. Aristotle's three appeals (ethos, pathos, logos) plus
 * common rhetorical devices (anaphora, parallelism, rhetorical
 * questions). Foundation for AP Language and college writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_RHETORICAL_ANALYSIS: LessonPlan = {
  id: 'evelyn.g11.ela.rhetorical-analysis.v1',
  title: 'Rhetorical Analysis: Ethos, Pathos, Logos',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.ri.11-12.6',
      description: 'Determine an author\'s point of view in which the rhetoric is particularly effective.',
      standard: 'CCSS.ELA-LITERACY.RI.11-12.6',
    },
  ],
  prerequisites: ['ccss.ela.w.6.1'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame rhetorical analysis as "decoding persuasion".',
      script: 'You watch a 30-second commercial and feel a tug — maybe nostalgia, maybe urgency. Why? The ad used specific persuasive moves to get you there. Rhetorical analysis is the skill of NAMING those moves. It doesn\'t care whether the argument is true; it cares HOW the argument is built.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-appeals',
      kind: 'concept',
      goal: 'Aristotle\'s three appeals + common devices + the analysis claim.',
      keyIdeas: [
        'Aristotle\'s three appeals (rhetorical strategies):',
        'ETHOS — appeal to the speaker\'s CREDIBILITY or character. "As a doctor for 20 years, I can tell you...". Why should you trust them?',
        'PATHOS — appeal to EMOTION. Stories about specific victims, urgent language, vivid imagery designed to make you feel.',
        'LOGOS — appeal to LOGIC and REASON. Statistics, facts, structured arguments, evidence.',
        'A strong text balances all three. An over-pathos text feels manipulative; an over-logos text feels cold.',
        'Common RHETORICAL DEVICES:',
        '  ANAPHORA — repeating a phrase at the start of consecutive sentences. ("We shall fight on the beaches. We shall fight on the landing grounds...")',
        '  PARALLELISM — matched grammatical structures for emphasis. ("of the people, by the people, for the people")',
        '  RHETORICAL QUESTION — a question asked for effect, not answer. ("Are we to allow this?")',
        '  ANTITHESIS — opposites placed together. ("Ask not what your country can do for you, but what you can do for your country.")',
        '  ALLUSION — reference to something well-known (history, literature, scripture) for resonance.',
        'ANALYTICAL CLAIM template: "By using [device/appeal], the author/speaker [achieves what persuasive effect on what audience]."',
        'Don\'t just NAME the appeal — explain its EFFECT and on WHOM.',
      ],
      vocabulary: [
        { term: 'ethos', definition: 'appeal to the speaker\'s credibility.' },
        { term: 'pathos', definition: 'appeal to emotion.' },
        { term: 'logos', definition: 'appeal to logic and evidence.' },
        { term: 'anaphora', definition: 'repeating a phrase at the start of consecutive sentences.' },
        { term: 'antithesis', definition: 'placing opposite ideas together for effect.' },
      ],
      suggestedTools: ['show_text', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mlk',
      kind: 'worked_example',
      problem: 'Identify the rhetorical strategy in MLK\'s "I have a dream that one day... I have a dream that one day... I have a dream today."',
      steps: [
        'Pattern: "I have a dream that..." repeats at the start of multiple sentences.',
        'Device: ANAPHORA (start-of-sentence repetition).',
        'Appeal: largely PATHOS — the repetition creates emotional momentum and makes the dream feel urgent and shared.',
        'Effect: each repetition builds on the last; audience feels the dream growing. Memorable, quotable, motivating.',
      ],
      answer: 'Anaphora (pathos)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A speech opens: "I have spent thirty years working on this issue, and I can tell you — every claim my opponent just made is false." Which appeal dominates?',
      expectedAnswer: 'Ethos',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ethos', correct: true },
        { id: 'b', text: 'Pathos' },
        { id: 'c', text: 'Logos' },
      ],
      hints: [
        '"Thirty years of experience" — the speaker is establishing credibility.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-emotional-bad',
      kind: 'misconception_check',
      question: 'Mira says "Pathos is manipulative; only logos is good." Is that fair?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating emotional appeals as inherently dishonest.',
          correctsTo: 'Pathos isn\'t manipulation by definition. A speech about famine that includes a specific child\'s story is using pathos to make abstract suffering CONCRETE — that\'s legitimate. Pathos becomes manipulation only when it REPLACES facts, not when it supplements them. Aristotle valued all three appeals.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three appeals: ethos (credibility), pathos (emotion), logos (logic).',
        'Common devices: anaphora, parallelism, rhetorical question, antithesis, allusion.',
        'Strong rhetoric balances all three appeals.',
        'Analysis explains EFFECT, not just identifies device.',
        'Pathos isn\'t inherently bad — it\'s a legitimate part of human persuasion.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find a 30-second commercial. Identify which appeal dominates and one specific rhetorical device.',
      hint: 'Most commercials lean heavily on PATHOS (emotion) plus ETHOS (celebrity endorsements) — LOGOS (statistics) is rarer in ads.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
