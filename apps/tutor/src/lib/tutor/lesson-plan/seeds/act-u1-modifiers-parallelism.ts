/**
 * ACT — English / Modifiers & Parallelism.
 *
 * Two of the most recurring ACT English usage-and-mechanics patterns:
 * modifier placement (misplaced/dangling modifiers) and parallel
 * structure (lists, comparisons, correlative pairs). Passage-embedded,
 * ~9 minutes per passage. All excerpts are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_MODIFIERS_PARALLELISM: LessonPlan = {
  id: 'evelyn.testprep.act.modifiers-parallelism.v1',
  title: 'Modifiers & Parallelism',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.modifiers-parallelism',
      standard: 'ACT-1.5',
      description:
        'Identify and correct dangling/misplaced modifiers and violations of parallel structure in ACT English passage-embedded usage questions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 19,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe modifier and parallelism questions as fast, pattern-based points within the passage pace.',
      script:
        'Five passages, 75 questions, 45 minutes — about 9 minutes per passage. In nearly every passage, at least one question hinges on a misplaced or dangling modifier, and another on parallel structure. These are some of the fastest points on the whole test once you know what to check: which noun sits right after an opening comma, and whether every item in a list or pair matches grammatical form.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-modifiers-parallelism',
      kind: 'concept',
      goal: 'The comma-check method for modifiers and the matching-form method for parallel structure, plus the traps the ACT builds around each.',
      keyIdeas: [
        'MISPLACED MODIFIER: a modifying word or phrase must sit next to the thing it describes. Move it away and the sentence describes the wrong noun.',
        'DANGLING MODIFIER: an opening phrase (before the first comma) has no logical subject to attach to — whatever noun comes right after that comma is what the phrase is claimed to describe.',
        'THE COMMA CHECK: read the opening phrase, then ask "who or what is right after the comma?" If that noun could not logically do what the phrase describes, the modifier is dangling.',
        'TRAP — WRONG NOUN AFTER THE COMMA: the ACT loves opening with a participial phrase ("Eager to finish...", "Having practiced for hours...") and then following it with an object or abstract noun that did not do the action. Answer choices often keep that wrong noun in a different disguise.',
        'PARALLEL STRUCTURE IN LISTS: every item in a series must share the same grammatical form — all gerunds, all infinitives, or all plain nouns/verbs, not a mix.',
        'PARALLEL STRUCTURE IN COMPARISONS AND CORRELATIVES: pairs like "not only...but also," "either...or," and "as...as" need matching form on both sides of the pair.',
        'TRAP — ONE BROKEN ITEM: three items in a list match and one switches form (e.g., "-ing, -ing, to + verb"). The fix is almost always to convert the odd one out, not to rewrite the whole list.',
        '"NO CHANGE" IS OFTEN RIGHT: if the modifier already sits next to the correct noun and the list or pair is already parallel, do not "fix" a sentence that is not broken.',
      ],
      vocabulary: [
        { term: 'modifier', definition: 'a word or phrase that describes or limits another word in the sentence.' },
        {
          term: 'dangling modifier',
          definition: 'an opening modifier with no logical subject next to it in the main clause.',
        },
        {
          term: 'parallel structure',
          definition: 'matching grammatical form across items in a list, comparison, or correlative pair.',
        },
        {
          term: 'participial phrase',
          definition: 'a phrase beginning with an -ing or -ed verb form that functions like an adjective.',
        },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-dangling-modifier',
      kind: 'worked_example',
      problem:
        'Excerpt: "Eager to finish the science fair project before the bus arrived, THE POSTER BOARD WAS TAPED TOGETHER BY MARISA IN A HURRY." Revise the underlined portion so the sentence is not a dangling modifier.',
      steps: [
        'Read the opening phrase: "Eager to finish the science fair project before the bus arrived" — this describes a person who feels eager, not an object.',
        'Comma check: what comes right after the comma? "The poster board" — a poster board cannot be "eager."',
        'The modifier is dangling: it has no logical subject sitting next to it.',
        'Rewrite so the person who was eager comes right after the comma: "Eager to finish the science fair project before the bus arrived, Marisa taped the poster board together in a hurry."',
      ],
      answer: 'Eager to finish the science fair project before the bus arrived, Marisa taped the poster board together in a hurry.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parallel-list',
      kind: 'worked_example',
      problem:
        'Excerpt: "The coach told the team to STRETCH, RUN TWO LAPS, AND THAT THEY SHOULD DRINK WATER before practice." Fix the underlined portion so the list is parallel.',
      steps: [
        'List the three items after "told the team to": "stretch," "run two laps," "that they should drink water."',
        'The first two are bare-verb commands (stretch, run); the third breaks form with "that they should drink water."',
        'Rewrite the third item to match the bare-verb pattern: "drink water."',
        'Parallel version: "stretch, run two laps, and drink water."',
      ],
      answer: 'stretch, run two laps, and drink water',
      estimatedMinutes: 3,
    },
    {
      id: 'try-dangling-subject',
      kind: 'try_yourself',
      problem:
        'Excerpt: "After PRACTICING THE PIANO FOR TWO HOURS, THE RECITAL FELT EASY TO JAKE." Which choice best fixes the underlined portion so the sentence is not a dangling modifier?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE (the recital felt easy to Jake)' },
        { id: 'b', text: 'the recital was felt easy by Jake' },
        { id: 'c', text: 'Jake found the recital easy', correct: true },
        { id: 'd', text: 'it felt to Jake that the recital was easy' },
      ],
      expectedAnswer: 'Jake found the recital easy',
      hints: [
        'Ask: who was practicing the piano for two hours? That noun must come right after the comma.',
        'The recital did not practice the piano — a person did. Only one choice puts that person right after the comma.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-correlative',
      kind: 'try_yourself',
      problem:
        'Excerpt: "The debate coach said the team members were NOT ONLY CONFIDENT BUT ALSO HAD PRACTICED FOR HOURS." Which choice best fixes the underlined portion so the sentence is parallel?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE (not only confident but also had practiced for hours)' },
        { id: 'b', text: 'not only confident but also well-practiced', correct: true },
        { id: 'c', text: 'not only having confidence but also had practiced for hours' },
        { id: 'd', text: 'not only were they confident but also they had practiced for hours' },
      ],
      expectedAnswer: 'not only confident but also well-practiced',
      hints: [
        'After "were," both items joined by "not only...but also" must be the same part of speech.',
        '"Confident" is an adjective — the second half needs to match it, not switch to a verb phrase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-no-change-list',
      kind: 'try_yourself',
      problem:
        'Excerpt: "For the trip, Elena packed her hiking boots, A RAINCOAT, AND SUNSCREEN." Which choice best completes the underlined portion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE (a raincoat, and sunscreen)', correct: true },
        { id: 'b', text: 'a raincoat, and she also brought sunscreen' },
        { id: 'c', text: 'packing a raincoat, and sunscreen' },
        { id: 'd', text: 'a raincoat, and also bringing sunscreen along' },
      ],
      expectedAnswer: 'NO CHANGE (a raincoat, and sunscreen)',
      hints: [
        'Check whether all three items in the list already share the same grammatical form.',
        '"Hiking boots," "a raincoat," and "sunscreen" are all simple nouns — there is nothing to fix.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-anywhere-in-sentence',
      kind: 'misconception_check',
      question:
        'A student reads "Walking to school, the rain started falling on Marcus." and decides it\'s fine because "Marcus" appears later in the sentence. What went wrong?',
      commonErrors: [
        {
          answer: 'The sentence is fine because Marcus is mentioned somewhere in it',
          misconception: 'Believing a dangling modifier is fixed as long as the intended subject appears ANYWHERE in the sentence.',
          correctsTo:
            'The subject must appear immediately after the comma, right where the main clause starts. "The rain" sits there instead of "Marcus," so the sentence literally claims the rain was walking to school. Fix: "Walking to school, Marcus felt the rain start falling."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The word right after an opening comma must be the thing the modifier describes — not just mentioned somewhere in the sentence.',
        'Items in a list, comparison, or correlative pair ("not only...but also," "either...or") must share the same grammatical form.',
        'NO CHANGE is correct whenever the modifier already sits next to the right noun and the list or pair is already parallel.',
        'ACT English is passage-embedded and fast — about 9 minutes per passage — so scan for the comma-then-noun pattern the moment you see an opening phrase.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.5', cedTitle: 'Modifiers & Parallelism' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
