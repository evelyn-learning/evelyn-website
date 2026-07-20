/**
 * Digital SAT — Reading & Writing: Verb Tense, Verb Forms & Modifier Placement.
 *
 * Standard English Conventions is roughly a quarter of R&W, and verb-form /
 * modifier questions are a recurring slice of it on every digital SAT.
 * Focus on the three traps that actually decide these questions: reading a
 * sentence's OWN time-signal words to pick the right tense, past-participle
 * forms after have/has/had or passive "be" (had went vs had gone), the
 * subjunctive "were" in hypotheticals, and dangling modifiers — an opening
 * phrase that doesn't logically describe the subject right after the comma
 * ("Walking to school, the rain soaked..." — the rain wasn't walking).
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U8_VERB_FORMS_MODIFIERS: LessonPlan = {
  id: 'evelyn.testprep.dsat.verb-forms-modifiers.v1',
  title: 'Verb Tense, Verb Forms & Modifier Placement',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.verb-forms-modifiers',
      standard: 'DSAT-8.3',
      description:
        'Select the verb tense, verb form, or mood that matches a sentence\'s own time and logic signals, and identify/fix dangling and misplaced modifiers.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame verb form / modifier questions as a recurring, learnable slice of Standard English Conventions.',
      script:
        'Standard English Conventions makes up about a quarter of R&W questions, and nearly every digital SAT includes a couple that hinge on verb form or modifier placement. These aren\'t vocabulary questions — they\'re logic puzzles where the sentence tells you the answer if you read its own signals. Today: three traps that decide almost all of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-verb-modifier-traps',
      kind: 'concept',
      goal: 'The test format plus the recurring traps: tense-signal words, past participles, subjunctive mood, dangling/misplaced modifiers.',
      keyIdeas: [
        'TEST FORMAT — these questions give a short text with a blank or underlined portion and ask which choice is most logical or grammatically correct GIVEN THE SENTENCE\'S OWN SIGNALS, not what "sounds natural."',
        'TENSE-SIGNAL WORDS decide the tense. Words like "since," "by the time," "already," "next year" anchor the timeline — find them before picking a verb.',
        'PAST PARTICIPLE vs SIMPLE PAST — after have/has/had, or in passive voice with "be," use the PAST PARTICIPLE, never simple past. "had gone" not "had went"; "was written" not "was wrote". Common irregulars: go/went/gone, write/wrote/written, begin/began/begun, do/did/done, see/saw/seen, eat/ate/eaten.',
        'PERFECT TENSES MARK SEQUENCE — "had + past participle" (past perfect) marks an action completed BEFORE another past event. "By the time she arrived, the meeting HAD ALREADY STARTED" — started first, arrived second. The later reference point in the sentence takes plain simple past, not another perfect form.',
        'SUBJUNCTIVE MOOD — hypothetical, contrary-to-fact "if" clauses use WERE for every subject, singular or plural: "If the museum WERE open..." (it isn\'t). Verbs of demand/recommendation (insist, require, recommend) + "that" take the base form: "The board insists that she SUBMIT the report" (not submits).',
        'DANGLING MODIFIER — an introductory phrase (often ending in -ing or -ed) must logically describe the SUBJECT of the very next clause. If the noun right after the comma can\'t do the action, the modifier is dangling. Signature trap: "Walking to school, the rain soaked my backpack." Rain can\'t walk. Fix: "Walking to school, I got soaked by the rain."',
        'MISPLACED MODIFIER — limiting words (only, almost, just, even) and descriptive phrases change meaning depending on where they sit; they must sit next to the exact word they modify. "I almost failed every test" (didn\'t fail any) vs "I failed almost every test" (failed most of them).',
        'TRAP TO WATCH — every answer choice is usually a grammatically fine sentence in isolation. Only ONE matches the tense/sequence signals already present elsewhere in the text — scan the surrounding verbs before picking.',
      ],
      vocabulary: [
        { term: 'past participle', definition: 'the verb form paired with have/has/had or passive "be" (gone, written, seen) — often different from the simple past form.' },
        { term: 'dangling modifier', definition: 'an introductory phrase with no logical subject in the sentence for it to attach to.' },
        { term: 'subjunctive mood', definition: 'the verb form ("were," or the base form after demand verbs) used for hypothetical, contrary-to-fact, or demand statements.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tense-sequence',
      kind: 'worked_example',
      problem:
        'Read the text: "By the time the museum\'s renovation ___, more than three years had passed since the initial announcement. Curators say the new wing opens to the public next spring." Which choice most logically completes the blank: "finished," "had finished," "finishes," or "was finishing"?',
      steps: [
        'Find the anchor clause: "more than three years HAD PASSED" — past perfect, meaning that stretch of time was already complete before some later past reference point.',
        'The blank names that later reference point ("by the time the renovation ___"), so it needs plain SIMPLE PAST — stacking another perfect form ("had finished") leaves no reference point at all.',
        'Eliminate "finishes" and "was finishing" — present tense and past progressive don\'t fit a narrative already anchored in the past by "had passed."',
        'Correct: "finished." "By the time the renovation FINISHED, three years HAD PASSED since the announcement" — the perfect verb marks the earlier event, the simple past verb marks the reference point.',
      ],
      answer: 'finished',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dangling-modifier',
      kind: 'worked_example',
      problem:
        'Read the sentence: "Walking to school, the rain soaked Priya\'s backpack before she reached the front doors." What is the error, and how should it be fixed?',
      steps: [
        'Identify the introductory modifier: "Walking to school." This phrase must describe whoever or whatever is named right after the comma.',
        'Read the noun right after the comma: "the rain." Logical check — can rain walk to school? No.',
        'DANGLING MODIFIER: as written, the sentence illogically claims the rain was walking.',
        'Fix by making the modifier\'s true subject the sentence\'s grammatical subject: "Walking to school, Priya got her backpack soaked by the rain before she reached the front doors."',
      ],
      answer:
        'Dangling modifier — revise so "Priya" (the one walking) is the subject right after the comma: "Walking to school, Priya got her backpack soaked by the rain before she reached the front doors."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-tense-signal',
      kind: 'try_yourself',
      problem:
        'Read the text: "Ecologists studying the coral reef noticed that the water temperature ___ nearly two degrees since their first survey five years earlier, a shift they now link to the recent bleaching events." Which choice completes the text with the most logical verb form?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'rises' },
        { id: 'b', text: 'has risen', correct: true },
        { id: 'c', text: 'rose' },
        { id: 'd', text: 'had risen' },
      ],
      expectedAnswer: 'has risen',
      hints: [
        '"Since" pairs with a specific tense that connects a past starting point to the present — which one is that?',
        'The ecologists "now link" the shift to bleaching — the change is still relevant right now, not a one-time past-only event, and there\'s no earlier past event for "had risen" to precede.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-modifier-fix',
      kind: 'try_yourself',
      problem:
        'Read the sentence: "Excited about the science fair, the trophy meant everything to Marcus after months of preparation." Which revision fixes the modifier error?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Excited about the science fair, the trophy meant everything to Marcus after months of preparation.' },
        { id: 'b', text: 'Excited about the science fair, Marcus felt that the trophy meant everything to him after months of preparation.', correct: true },
        { id: 'c', text: 'Excited about the science fair, months of preparation made the trophy mean everything to Marcus.' },
        { id: 'd', text: 'The trophy excited about the science fair meant everything to Marcus after months of preparation.' },
      ],
      expectedAnswer:
        'Excited about the science fair, Marcus felt that the trophy meant everything to him after months of preparation.',
      hints: [
        'Ask: who or what can logically be "excited about the science fair"? A trophy or "months of preparation" can\'t feel excitement.',
        'The subject right after the introductory comma must be capable of the modifier\'s action or feeling — that subject should be Marcus.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-subjunctive',
      kind: 'try_yourself',
      problem:
        'Read the sentence: "If the city council ___ more transparent about the budget process, residents would trust the new proposal." Which choice is grammatically correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'was' },
        { id: 'b', text: 'were', correct: true },
        { id: 'c', text: 'is' },
        { id: 'd', text: 'will be' },
      ],
      expectedAnswer: 'were',
      hints: [
        'The clause is hypothetical, paired with "would trust" — it\'s not a statement of fact about right now.',
        'Hypothetical, contrary-to-fact "if" clauses take the subjunctive form "were," regardless of whether the subject is singular or plural.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subjunctive-was',
      kind: 'misconception_check',
      question: 'A student writes: "If I was you, I would apply early." Is "was" correct here?',
      commonErrors: [
        {
          answer: '"was" is correct because "I" is a singular subject',
          misconception: 'Treating a hypothetical "if" clause like an ordinary past-tense statement and matching the verb to the subject\'s number.',
          correctsTo:
            'This "if" clause is hypothetical and contrary-to-fact ("I" am not "you") — that always takes the SUBJUNCTIVE "were," no matter the subject. Correct: "If I WERE you, I would apply early." Save "was" for ordinary past-tense facts: "I was tired yesterday."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scan the sentence for its own time-signal words (since, by the time, already) — they decide the correct tense, not "what sounds right."',
        'After have/has/had, or in passive voice, use the PAST PARTICIPLE, never simple past: had gone, was written — never had went, was wrote.',
        'Hypothetical "if" clauses and demand verbs (insist that she go) take the SUBJUNCTIVE — "were" for every subject, base form after demand verbs.',
        'An introductory modifier must logically describe the subject right after the comma. If that noun can\'t do the action, it\'s dangling — fix by making the modifier\'s true subject the sentence\'s subject.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Verb Tense, Verb Forms & Modifier Placement' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
