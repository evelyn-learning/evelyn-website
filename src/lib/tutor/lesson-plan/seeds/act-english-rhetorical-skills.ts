/**
 * ACT English — Rhetorical Skills (organisation, style, logic).
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_ENGLISH_RHETORICAL_SKILLS: LessonPlan = {
  id: 'evelyn.testprep.act.english.rhetorical-skills.v1',
  title: 'ACT English — Rhetorical Skills (Style, Logic, Organisation)',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-english',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.english.rhetorical-skills',
      description: 'Apply ACT rhetorical-skills strategies: paragraph organisation, sentence ordering, transitions, redundancy elimination, tone consistency, and "is the writer\'s goal achieved" questions.',
      standard: 'ACT-ENGLISH',
    },
  ],
  prerequisites: ['testprep.act.english.grammar-rules'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'About 1/3 of ACT English is rhetorical skills — and the rules are different from grammar.',
      script: 'Grammar tests rules. Rhetorical skills test JUDGMENT — does this sentence belong here? Should this paragraph come earlier? Is this the best transition? The good news: there are clear strategies.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rhetoric',
      kind: 'concept',
      goal: 'Strategy types, transition logic, redundancy, tone, "achieve goal" questions.',
      keyIdeas: [
        'QUESTION TYPES:',
        '  ADD/DELETE: "Should the writer add this sentence?" Add only if it\'s on-topic AND adds new info. Default to delete if it\'s a digression or redundant.',
        '  RELEVANCE: a sentence that doesn\'t support the paragraph\'s topic should be cut.',
        '  ORGANISATION: "Where should sentence 5 go?" Look at logical flow — does it set up another sentence? Does it conclude?',
        '  TRANSITIONS: choose the word that signals the LOGICAL relationship between clauses (cause, contrast, addition, sequence).',
        '  CONCISENESS: shorter is usually better. Cut "in order to," "due to the fact that," "the reason is because."',
        '  TONE: stay consistent with the rest of the passage — formal stays formal, casual stays casual.',
        '  "ACHIEVE GOAL": questions like "If the writer wanted to emphasise X, which sentence does this best?" — pick the one that does X most directly. Read the GOAL CAREFULLY.',
        'TRANSITION LOGIC by relationship:',
        '  ADDITION: also, moreover, furthermore, in addition.',
        '  CONTRAST: however, nevertheless, on the other hand, but.',
        '  CAUSE: therefore, thus, consequently, as a result.',
        '  EXAMPLE: for instance, for example, namely.',
        '  SEQUENCE: first, next, finally.',
        'COMMON TRAPS:',
        '  "Achieve goal" answers that are factually true but don\'t MATCH the goal asked.',
        '  Long, eloquent sentences that ADD nothing — pick the shorter, equally correct option.',
        '  Transitions that sound right but signal the wrong relationship (e.g. "however" used between two sentences that AGREE).',
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word or phrase signaling the logical relationship between sentences or paragraphs.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A passage describes how a city renovated its parks. The writer wants to emphasise community involvement. Which addition best achieves the goal? (A) "The renovation took two years to complete." (B) "Over 500 volunteers contributed at planting weekends." (C) "The city budget was substantial." (D) "The architect won an award."',
      steps: [
        'Identify the goal: emphasise COMMUNITY INVOLVEMENT.',
        'Evaluate each option against the goal:',
        '  (A) duration — irrelevant to community.',
        '  (B) 500 volunteers — DIRECTLY shows community involvement.',
        '  (C) budget — money, not people.',
        '  (D) architect awards — about a single professional, not community.',
        'Answer: (B) — concrete number of volunteers makes community involvement tangible.',
      ],
      answer: '(B)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Choose the best transition: "The science fair was a huge success. _____, attendance dropped by half this year." (A) Therefore (B) However (C) Likewise (D) For example.',
      expectedAnswer: '(B) However. The two clauses CONTRAST: success vs drop. Therefore signals cause/effect (wrong direction). Likewise = similarly (wrong, they\'re different). For example introduces a specific instance (not the relationship here).',
      responseFormat: 'free',
      hints: [
        'What\'s the logical relationship between the two clauses?',
        'Match the transition to that relationship.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-longer-sounds-better',
      kind: 'misconception_check',
      question: 'A student picks the longest, most flowery option whenever they\'re unsure. Why is this often wrong on ACT English?',
      commonErrors: [
        {
          answer: 'Longer is more sophisticated',
          misconception: 'Confusing wordy with strong.',
          correctsTo: 'ACT English heavily rewards CONCISENESS. When two options are grammatically correct, pick the shorter. Examples ACT loves to test: "due to the fact that" → "because"; "in order to" → "to"; "at this point in time" → "now"; "the reason is because" → "because." If a sentence works without a phrase, that phrase is probably extra. Default to brevity unless meaning is lost.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Add only if on-topic AND new information; default to delete.',
        'Match transitions to logical relationship (contrast, cause, addition).',
        '"Achieve goal" = pick the option that DIRECTLY does the named thing.',
        'Conciseness wins when both options are correct.',
        'Tone stays consistent with the passage.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
