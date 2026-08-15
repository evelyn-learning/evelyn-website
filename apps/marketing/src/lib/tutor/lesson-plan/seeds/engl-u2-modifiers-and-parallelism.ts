/**
 * HS English — Grammar & Usage: Modifier Placement & Parallel Structure.
 *
 * Two sentence-level repair skills that decide whether a reader gets the
 * meaning you intended (CCSS L.9-10.1): put every modifier beside the word
 * it describes, and keep every item in a series, pair, or comparison in
 * matching grammatical form. Every practice item is a revision-choice or
 * error-spot MCQ, and every example sentence is original.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U2_MODIFIERS_AND_PARALLELISM: LessonPlan = {
  id: 'evelyn.hs.engl.modifiers-and-parallelism.v1',
  title: 'Modifier Placement & Parallel Structure',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.modifiers-and-parallelism',
      standard: 'ENGL-2.4',
      description:
        'Revise misplaced and dangling modifiers so each modifier sits beside the word it actually describes, and keep every item in a series, pair, or comparison in matching grammatical form (CCSS L.9-10.1, L.9-10.1.b).',
    },
  ],
  prerequisites: ['engl.fragments-and-run-ons'],
  followUps: ['engl.commas'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A misplaced modifier does not just sound clumsy — it says something you never meant. Frame the skill as controlling meaning in writing people actually read.',
      script:
        'Somewhere in a yearbook there is a caption that reads "Covered in mud after the final whistle, the trophy was lifted by the seniors." Read it literally: the trophy is the muddy one. Somewhere else, a school announcement says "Students may sign up for the trip in the front office that leaves Friday" — and now the office is leaving Friday. Nobody meant either of those things. English attaches a description to whatever sits closest to it, so word order is not decoration; it is meaning. Today you get two repair tools: a comma check that catches modifiers describing the wrong thing, and a matching test that keeps lists and comparisons from wobbling halfway through.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-placement-and-matching',
      kind: 'concept',
      goal: 'The comma-check method for modifiers, the matching-form method for parallel structure, and the classic errors writers make with each.',
      keyIdeas: [
        'MODIFIERS ATTACH TO WHAT IS NEAREST — a describing word or phrase latches onto the closest noun, not onto the one you had in mind. Placement is not style; it is meaning.',
        'MISPLACED MODIFIER — the phrase sits next to the wrong word. WRONG: "She served sandwiches to the volunteers on paper plates." (the volunteers are on plates) CORRECT: "She served the volunteers sandwiches on paper plates." Fix by moving the phrase beside the word it describes.',
        'DANGLING MODIFIER — an opening phrase before the first comma describes a doer who never shows up as the subject. WRONG: "After rehearsing all weekend, the audition felt easy." (the audition did not rehearse) CORRECT: "After rehearsing all weekend, Devon found the audition easy."',
        'THE COMMA CHECK — read the opening phrase, then look at the very first noun after the comma and ask whether that noun could truly do or feel what the phrase describes. If it could not, the modifier is dangling. The intended person appearing LATER in the sentence does not fix anything.',
        'TWO REPAIRS FOR A DANGLER — either make the true doer the subject right after the comma, or turn the opening phrase into a full clause with its own subject: "After Devon rehearsed all weekend, the audition felt easy."',
        'LIMITING WORDS MOVE THE MEANING — only, almost, just, even, and nearly belong directly in front of the word they limit. "I only edited two paragraphs" (editing was all I did) means something different from "I edited only two paragraphs" (two and no more). Decide what you mean, then place the word there.',
        'PARALLEL STRUCTURE IN A SERIES — every item joined by and or or must share one grammatical form: all bare verbs, all -ing forms, all infinitives, or all nouns. WRONG: "The club meeting covered fundraising, to recruit members, and a new banner." CORRECT: "The club meeting covered fundraising, recruitment, and a new banner."',
        'PARALLELISM IN PAIRS AND COMPARISONS — the two halves of not only ... but also, either ... or, neither ... nor, both ... and, and of comparisons with than or as must match in form. WRONG: "The role calls for someone who is patient and who listens well but also being organized." CORRECT: "The role calls for someone who is patient, attentive, and organized." Note the classic error pattern: three items match and one switches form, so repair the odd item rather than rewriting the whole list.',
      ],
      vocabulary: [
        { term: 'modifier', definition: 'a word or phrase that describes or limits another word in the sentence.' },
        { term: 'dangling modifier', definition: 'an opening modifier whose true doer never appears as the subject of the clause that follows it.' },
        { term: 'parallel structure', definition: 'matching grammatical form across items in a series, a correlative pair, or a comparison.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-parallel-series',
      kind: 'worked_example',
      problem:
        'Revise this sentence from an internship description so the series is parallel: "The studio assistant will answer the phones, scheduling client appointments, and to update the website every Friday."',
      steps: [
        'Find the words that introduce the series: "will" plus the list of duties. Every item has to work as a continuation of "will ___."',
        'List the three items separately: "answer the phones", "scheduling client appointments", "to update the website every Friday".',
        'Test each against "will": "will answer" works, "will scheduling" does not, "will to update" does not. Item one sets the pattern, so items two and three are the broken ones.',
        'Convert the broken items to the bare-verb form the first item established: "schedule client appointments" and "update the website every Friday".',
        'Parallel version: "The studio assistant will answer the phones, schedule client appointments, and update the website every Friday." Every item now reads cleanly after "will".',
      ],
      answer:
        'The studio assistant will answer the phones, schedule client appointments, and update the website every Friday.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dangler-failed-revision',
      kind: 'worked_example',
      problem:
        'A writer is told that "Hoping to impress the hiring manager, the resume was printed on heavy cream paper." contains a dangling modifier. The writer revises it to "Hoping to impress the hiring manager, the resume was printed on heavy cream paper by Dana." Did the revision fix the error?',
      steps: [
        'Read the opening phrase: "Hoping to impress the hiring manager." Only a person can hope, so the phrase needs a human doer.',
        'Run the comma check on the REVISION, not on the intention. The first noun after the comma is still "the resume".',
        'A resume cannot hope for anything, so the revised sentence still claims that the resume was doing the hoping. Adding "by Dana" at the end does not change what the modifier attaches to. This is the classic error: naming the doer somewhere in the sentence and assuming the sentence is repaired.',
        'Repair option one, promote the true doer to subject: "Hoping to impress the hiring manager, Dana printed the resume on heavy cream paper."',
        'Repair option two, give the opening phrase its own subject: "Because Dana hoped to impress the hiring manager, she printed the resume on heavy cream paper." Either version passes the comma check.',
      ],
      answer:
        'No — the revision still fails, because "the resume" remains the noun after the comma. CORRECT: "Hoping to impress the hiring manager, Dana printed the resume on heavy cream paper."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-dangler-revision',
      kind: 'try_yourself',
      problem:
        'Which revision best fixes the modifier error in this sentence? "Sprinting toward the closing doors, the train pulled away before Amara reached the platform."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sprinting toward the closing doors, the train pulled away from Amara before she reached the platform.' },
        { id: 'b', text: 'Sprinting toward the closing doors, Amara watched the train pull away before she reached the platform.', correct: true },
        { id: 'c', text: 'Sprinting toward the closing doors, the platform was reached too late by Amara.' },
        { id: 'd', text: 'The train sprinting toward the closing doors pulled away before Amara reached the platform.' },
      ],
      expectedAnswer:
        'Sprinting toward the closing doors, Amara watched the train pull away before she reached the platform.',
      hints: [
        'Ask who is sprinting toward the closing doors, then check which choice puts that person immediately after the comma.',
        'A train and a platform cannot sprint, and mentioning Amara later in the sentence does not repair the opening phrase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-series',
      kind: 'try_yourself',
      problem:
        'Which choice completes the sentence with a parallel series? "The volunteer coordinator asked the new members to sort donations, ___, and greet families at the door."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'label the boxes', correct: true },
        { id: 'b', text: 'labeling the boxes' },
        { id: 'c', text: 'they should label the boxes' },
        { id: 'd', text: 'to be labeling the boxes' },
      ],
      expectedAnswer: 'label the boxes',
      hints: [
        'Read the first and third items after "asked the new members to": what grammatical form do they share?',
        '"Sort donations" and "greet families" are both bare verbs following "to", so the middle item must be a bare verb too.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The counselor described the summer program as demanding, rewarding, and unusually short.', correct: true },
        { id: 'b', text: 'Filled with typos, the editor rejected the article after a single read.' },
        { id: 'c', text: 'The essay was not only late but also it had no conclusion.' },
        { id: 'd', text: 'She almost photographed every mural on the block for her portfolio.' },
      ],
      expectedAnswer: 'The counselor described the summer program as demanding, rewarding, and unusually short.',
      hints: [
        'Check each sentence for two things: does every opening modifier describe the noun right after the comma, and does every list or pair match in form?',
        'Choice a is three matching adjectives. Choice b makes the editor the one filled with typos, choice c pairs an adjective with a full clause, and choice d says she took almost no photographs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-items-make-sense',
      kind: 'misconception_check',
      question:
        'A student writes "The committee wanted volunteers who could greet guests, to hand out programs, and directing people to their seats." and defends it: "Every item makes sense on its own, so the list is fine." What went wrong?',
      commonErrors: [
        {
          answer: 'The list is fine because each item is understandable by itself',
          misconception: 'Judging list items one at a time for meaning instead of testing them against each other for matching grammatical form.',
          correctsTo:
            'Parallelism is a test of FORM, not of meaning. Read each item after the shared opener "who could": "who could greet" works, "who could to hand out" does not, and "who could directing" does not. Item one sets the pattern, so match the others to it. CORRECT: "The committee wanted volunteers who could greet guests, hand out programs, and direct people to their seats."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A modifier describes whatever sits nearest to it, so misplacing it changes the meaning of the sentence rather than just its style.',
        'Comma check: the first noun after an opening phrase must be able to do what the phrase describes — naming the true doer later in the sentence never repairs a dangler.',
        'Place only, almost, just, and even directly in front of the word they limit.',
        'Every item in a series, correlative pair, or comparison must share one grammatical form; when one item breaks the pattern, repair that item instead of rewriting the list.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Modifier Placement & Parallel Structure' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
