/**
 * Grades 3-5 ELA — Editing & Revision.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_EDITING_REVISION: LessonPlan = {
  id: 'evelyn.g35.ela.editing-revision.v1',
  title: 'Grades 3-5 ELA — Editing & Revision',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.editing-revision',
      description: 'Distinguish revision (content) from editing (mechanics); apply both stages to improve drafted writing.',
      standard: 'CCSS.ELA-LITERACY.W.4.5',
    },
  ],
  prerequisites: ['g35.ela.opinion-argument'],
  followUps: ['g35.ela.subject-verb-agreement'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Real writers don\'t produce perfect drafts on the first try — they REVISE big ideas, then EDIT small mistakes.',
      script: 'Look at any famous author\'s manuscript and you\'ll see crossings-out, arrows, scribbles. They drafted, revised, and edited multiple rounds. Today you learn the same two-step move that turns rough drafts into polished writing.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-revision',
      kind: 'concept',
      goal: 'Difference between revision and editing + checklists for each.',
      keyIdeas: [
        'REVISION (BIG changes — content): focuses on IDEAS, ORGANISATION, and CLARITY. Done first.',
        'REVISION CHECKLIST: Does the introduction grab attention? Is the topic sentence clear? Do all paragraphs support the main idea? Are reasons supported by evidence? Does the conclusion wrap up?',
        'EDITING (SMALL changes — mechanics): focuses on GRAMMAR, SPELLING, PUNCTUATION, capitalisation. Done last.',
        'EDITING CHECKLIST: Capital letters at sentence starts and proper nouns. End punctuation. Subject-verb agreement. Verb tense consistency. Spelling. Commas in lists.',
        'REVISE FIRST, EDIT LAST. Don\'t fix commas before deciding if a paragraph belongs. Editing before revising wastes effort on text that may be deleted.',
        'TOOLS: read aloud (catches awkward sentences). Read backwards by sentence (catches typos by breaking flow). Use a checklist.',
        'PEER REVIEW: another reader spots problems you can\'t see in your own writing.',
        'COMMON REVISION MOVES: cut wordy sentences. Combine choppy ones. Reorder paragraphs for better flow. Add specific examples.',
      ],
      vocabulary: [
        { term: 'revision', definition: 'reworking the content, organisation, and clarity of writing — the BIG-picture stage.' },
        { term: 'editing', definition: 'fixing grammar, spelling, punctuation, and other mechanics — the FINAL stage.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-revise',
      kind: 'worked_example',
      problem: 'Take this draft sentence and revise it for clarity: "There are many people who think that schools should have more recess because it is good for the kids and helps them be healthier overall."',
      steps: [
        'Identify wordiness: "There are many people who think that..." is a slow opening.',
        'Active voice: who thinks this? Re-cast with a clearer subject.',
        'Specific over general: "good for the kids" is vague.',
        'Revised: "Many parents and teachers believe schools should have more recess. Active play improves children\'s focus and physical health." (Two clearer sentences with concrete benefits.)',
      ],
      answer: 'Tighter, clearer sentence pair.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Edit this sentence for grammar/punctuation: "the dog ran fast it was happy."',
      expectedAnswer: '"The dog ran fast. It was happy." (Or: "The dog ran fast, and it was happy.")',
      responseFormat: 'free',
      hints: [
        'Capitalise the first word.',
        '"It was happy" needs to be a separate sentence (or joined with a comma + conjunction).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-edit-first',
      kind: 'misconception_check',
      question: 'A student edits commas and spelling in their draft, then notices their introduction is missing entirely. Why is this an inefficient order?',
      commonErrors: [
        {
          answer: 'Editing first, then revising',
          misconception: 'Treating writing as a single pass instead of a multi-stage process.',
          correctsTo: 'Edit AFTER revise. If you edit commas in a paragraph that you later cut, you\'ve wasted time. Revise FIRST: are big-picture ideas in place? Then edit: are commas, spelling, and grammar correct? This order saves effort and produces better writing. The two stages serve different purposes — keep them separate.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Revision = BIG changes (ideas, organisation). Editing = SMALL changes (mechanics).',
        'Revise FIRST. Edit LAST.',
        'Read aloud to catch awkward writing.',
        'Use a checklist for each stage.',
        'Peer review reveals problems your own eyes miss.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a writer need MULTIPLE revision rounds before editing?',
      hint: 'First-round revision finds big-picture issues (missing intro, weak conclusion). Second-round revision tightens transitions and word choice. Third-round revision often catches subtle inconsistencies. Each pass refines a different layer. Editing happens only when the content is locked down.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
