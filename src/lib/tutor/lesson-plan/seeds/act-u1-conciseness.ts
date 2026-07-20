/**
 * ACT — English / Conciseness & Redundancy.
 *
 * The core rhetorical-skills heuristic: when multiple choices are
 * grammatically correct and mean the same thing, the shortest one wins —
 * including "DELETE THE UNDERLINED PORTION" when it's offered. But the ACT
 * builds traps into that shortcut: a shorter option can break the grammar
 * (delete the only verb, leave a fragment) or quietly cut a fact a later
 * sentence in the passage depends on. All excerpts below are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_CONCISENESS: LessonPlan = {
  id: 'evelyn.testprep.act.conciseness.v1',
  title: 'Conciseness & Redundancy',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.conciseness',
      standard: 'ACT-1.6',
      description:
        'Identify the shortest grammatically correct revision that preserves a sentence\'s required meaning, spotting redundant phrasing and DELETE-the-underlined-portion choices while recognizing when a shorter option loses information the passage needs.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame conciseness/redundancy as a high-frequency, trap-heavy ACT English pattern worth mastering the shortcut AND its limits.',
      script:
        'ACT English gives you 75 questions in 45 minutes — about 36 seconds each. Conciseness and redundancy questions show up in nearly every one of the five passages, often 6 to 10 times across the test. The shortcut everyone learns is "shortest correct answer wins," and it is genuinely powerful — but the ACT plants two kinds of traps around it: a shorter option that quietly breaks the grammar, and a shorter option that quietly deletes a fact the passage needs later. Today you get the shortcut AND both exceptions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conciseness',
      kind: 'concept',
      goal: 'The shortest-correct-answer heuristic, redundant-pair patterns, DELETE-the-phrase choices, and the two exceptions where brevity loses.',
      keyIdeas: [
        'THE HEURISTIC: when two or more choices are grammatically correct and express the same idea, pick the SHORTEST — including "DELETE THE UNDERLINED PORTION" when it is offered and grammatical.',
        'REDUNDANT PAIRS are the most common trap: two words or phrases repeating the same idea ("each and every," "unexpected surprise," "past history," "advance planning," "close proximity," "merged together," "true facts," "final outcome," "basic essentials"). Cut one half.',
        'PADDING PHRASES to compress on sight: "due to the fact that" → "because"; "in order to" → "to"; "at this point in time" → "now"; "the reason why is because" → "because."',
        'DELETE-THE-PHRASE choices appear constantly and are correct whenever the sentence still works — and keeps its full meaning — without the underlined words.',
        'EXCEPTION 1 — LOST MEANING: never cut a detail (a date, a name, a number) that a LATER sentence in the passage depends on, even if the sentence "reads fine" on its own.',
        'EXCEPTION 2 — BROKEN GRAMMAR: the shortest option is wrong if it deletes the sentence\'s only verb, creates a fragment, or leaves a dangling modifier. Grammatical correctness is checked FIRST, brevity SECOND.',
        'NO CHANGE can be the shortest, correct answer — don\'t assume the original underlined text is automatically "too long" just because a competing choice looks trim.',
        'TWO-STEP TEST before picking a "shorter" answer: (1) read the sentence with the phrase gone — is it still a complete, correct sentence? (2) scan the rest of the passage — does anything later need the detail you\'re about to cut?',
      ],
      vocabulary: [
        { term: 'redundancy', definition: 'saying the same thing twice in different words, e.g. "unexpected surprise" or "true facts."' },
        { term: 'wordiness', definition: 'using more words than necessary to express an idea, even without outright repetition.' },
        {
          term: 'DELETE the underlined portion',
          definition: 'an ACT answer choice that removes the tested words entirely — correct whenever the sentence still works, and still means the same thing, without them.',
        },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-redundant-pair',
      kind: 'worked_example',
      problem:
        'An article reads: "The article explains that the new vaccine underwent \'a large number of numerous clinical trials\' before approval." What is the most concise, grammatically correct revision of the underlined portion, "a large number of numerous clinical trials"?',
      steps: [
        'Spot the redundant pair: "a large number of" and "numerous" both mean "many" — the sentence says "many" twice.',
        'Test dropping one half: "numerous clinical trials" is still a complete, correct noun phrase.',
        'Compare word count against the other grammatically correct options — "numerous clinical trials" beats every longer combination that keeps both qualifiers.',
        'Confirm no meaning is lost: the sentence still says the vaccine went through many trials.',
      ],
      answer: 'numerous clinical trials',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-lost-meaning-trap',
      kind: 'worked_example',
      problem:
        'A biography reads: "Grace Chen, \'a rear admiral in the U.S. Navy,\' pioneered early computer programming languages." A student wants to delete the underlined portion, "a rear admiral in the U.S. Navy," entirely to make the sentence shorter, reasoning that "shortest wins." Is deleting the phrase the best choice?',
      steps: [
        'Check what the phrase does: it gives Chen\'s rank and branch of service — information not stated anywhere else in the passage.',
        'Apply the DELETE test: does the sentence lose meaning the passage needs? Yes — her military background is the detail readers need to understand who she is.',
        '"Shortest grammatically correct answer wins" only applies when meaning survives. Deleting is grammatically fine here but not meaning-preserving, so it fails the second half of the test.',
        'Reject DELETE. Keep the descriptive phrase (NO CHANGE), even though it is the longest option, because it supplies required information found nowhere else.',
      ],
      answer: 'Keep the phrase (NO CHANGE) — deleting it removes required information, so shortest does not win here.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-delete-wins',
      kind: 'try_yourself',
      problem:
        'An article reads: "The new library, \'which was extremely large in size and enormous in scope,\' attracted visitors from across the state." Which choice for the underlined portion is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'which was very large and also enormous' },
        { id: 'c', text: 'which was large' },
        { id: 'd', text: 'DELETE the underlined portion (and the surrounding commas)', correct: true },
      ],
      expectedAnswer: 'DELETE the underlined portion (and the surrounding commas)',
      hints: [
        'Every choice keeps the sentence grammatical — so compare word count.',
        'Ask whether the missing descriptive detail is needed anywhere later in the passage; if it isn\'t, cutting it entirely wins.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-grammar-trap',
      kind: 'try_yourself',
      problem:
        'A profile reads: "The design team, after weeks of testing and revision, \'arrived at a final prototype\' that satisfied every safety requirement." Which choice for the underlined portion is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE', correct: true },
        { id: 'b', text: 'arrived, finally, at a final prototype design' },
        { id: 'c', text: 'DELETE the underlined portion' },
        { id: 'd', text: 'had arrived and finally reached a final prototype' },
      ],
      expectedAnswer: 'NO CHANGE',
      hints: [
        'Try deleting the phrase entirely — does the sentence still have a main verb afterward?',
        'Among the remaining grammatically complete choices, watch for redundancy ("final prototype design," "had arrived and finally reached") — the shortest correct one wins, and here that\'s the original.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-meaning-trap',
      kind: 'try_yourself',
      problem:
        'A biography reads: "The scientist, \'who immigrated to the United States in 1956,\' went on to win the Nobel Prize eleven years later." The next sentence in the passage explains that her journey to a new country shaped her research. Which choice for the underlined portion is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE', correct: true },
        { id: 'b', text: 'who came to the U.S.' },
        { id: 'c', text: 'who, at some point, immigrated' },
        { id: 'd', text: 'DELETE the underlined portion' },
      ],
      expectedAnswer: 'NO CHANGE',
      hints: [
        'Check whether "1956" is needed elsewhere — does "eleven years later" make sense without a starting year?',
        'Shortest wins only when no required meaning is lost; here two different sentences depend on this detail.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-delete-always-safe',
      kind: 'misconception_check',
      question:
        'A student\'s rule of thumb is: "Whenever DELETE THE UNDERLINED PORTION is a choice, pick it — shorter is always safer." Where does this rule break down?',
      commonErrors: [
        {
          answer: 'Always choose DELETE when it is offered',
          misconception: 'Treating "shortest possible" as identical to "shortest grammatically correct answer that keeps all required meaning."',
          correctsTo:
            'DELETE only wins the same test every other choice has to pass: (1) the remaining sentence must still be complete and correct, and (2) no meaning the passage needs is lost. If deleting leaves a fragment, or cuts a fact another sentence relies on, a longer choice is correct even though DELETE is offered.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'When multiple choices are grammatically correct and preserve meaning, pick the shortest — including DELETE THE UNDERLINED PORTION when offered.',
        'Watch for redundant pairs that say the same thing twice ("each and every," "unexpected surprise," "merged together") — cut the repeat.',
        'EXCEPTION: never shorten past the point where you lose a fact another sentence needs, or where the result is a fragment or broken grammar.',
        'Test every "shorter" candidate two ways: does it still form a complete sentence, and does the passage still make sense without what got cut?',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.6', cedTitle: 'Conciseness & Redundancy' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
