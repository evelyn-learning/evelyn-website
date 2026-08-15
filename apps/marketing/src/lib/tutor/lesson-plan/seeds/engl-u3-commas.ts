/**
 * HS English — Grammar & Usage: Commas That Do Real Work.
 *
 * The comma is the mark students place by ear and lose points on by rule
 * (CCSS L.9-10.2): five legitimate jobs — items in a series, introductory
 * elements, coordinate adjectives, nonessential elements, and joining two
 * independent clauses with a conjunction — plus the two failure modes,
 * the missing comma and the extra comma. Every excerpt below is original;
 * every practice item is a revision-choice MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U3_COMMAS: LessonPlan = {
  id: 'evelyn.hs.engl.commas.v1',
  title: 'Commas That Do Real Work',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.commas',
      standard: 'ENGL-3.1',
      description:
        'Place commas by grammatical job rather than by pause — separating items in a series, closing introductory elements, dividing coordinate adjectives, fencing off nonessential (nonrestrictive) elements, and joining two independent clauses with a coordinating conjunction — while eliminating both missing and unnecessary commas (CCSS L.9-10.2, L.9-10.2a).',
    },
  ],
  prerequisites: ['engl.modifiers-and-parallelism'],
  followUps: ['engl.semicolons-and-colons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a comma changes meaning, not breathing — frame the skill as controlling what a reader actually believes you said.',
      script:
        'Read this line from a group text: "We are ready to eat, kids." Now delete one comma: "We are ready to eat kids." One mark is the entire difference between calling everyone to dinner and confessing to something much worse. Commas do not mark where you breathe. They mark structure, and readers decode that structure without even noticing — until it breaks. In an email to a coach, a caption under a photo, a paragraph of a college essay, the comma you leave out, or the one you sprinkle in because the sentence felt long, quietly rewrites your meaning. Today you learn the five jobs a comma is actually allowed to do, and the two errors that appear the moment a writer works from feel instead of from the jobs.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-comma-jobs',
      kind: 'concept',
      goal: 'The five comma jobs, the name-the-job test, and the two classic errors that follow from placing commas by ear.',
      keyIdeas: [
        'NAME THE JOB — a comma is legal only when it is doing one of five jobs: separating items in a series, closing an introductory element, dividing coordinate adjectives, fencing off nonessential information, or joining two independent clauses with a conjunction. Before you keep a comma, name its job. If it has none, it is noise.',
        'JOB 1: ITEMS IN A SERIES — three or more items get a comma after each one except the last: "We packed sandwiches, apples, and a thermos." Keep the final comma before "and" (the serial comma); it stops the reader from fusing the last two items into a single item.',
        'JOB 2: INTRODUCTORY ELEMENTS — a word, phrase, or dependent clause that runs ahead of the main subject gets a comma after it: "After the last customer left, we mopped the floor." Without that comma the reader keeps reading the introduction as part of the main sentence and has to back up.',
        'JOB 3: COORDINATE ADJECTIVES — when two adjectives modify the same noun independently, separate them with a comma: "a long, boring meeting." Test it twice: put "and" between them, then reverse their order. If both versions still sound right, the comma belongs. If not, leave it out — "three old wooden crates" takes no commas at all.',
        'JOB 4: NONESSENTIAL (NONRESTRICTIVE) ELEMENTS — information you could delete without changing WHICH person or thing is meant gets a PAIR of commas, one before and one after: "Ms. Alvarez, who coaches the debate team, approved the schedule." Never build half the fence. If deleting the information would leave the reader unsure which one is meant, it is ESSENTIAL and takes NO commas: "The student who wrote the winning essay will read it aloud."',
        'JOB 5: JOINING TWO INDEPENDENT CLAUSES — when a coordinating conjunction (for, and, nor, but, or, yet, so) joins two halves that could each stand alone as a sentence, the comma goes BEFORE the conjunction: "The bus was late, so we walked." If the second half has no subject of its own, it is a compound verb rather than a clause, and no comma belongs there.',
        'ERROR A: THE MISSING COMMA — the expensive one, because it changes meaning rather than just looking sloppy. WRONG: "We are ready to eat kids." CORRECT: "We are ready to eat, kids." A dropped introductory comma does the same damage: WRONG: "While the choir sang the lights dimmed." CORRECT: "While the choir sang, the lights dimmed."',
        'ERROR B: THE EXTRA COMMA — there is no comma job between a subject and its verb, between a verb and its object, or before a compound verb, no matter how long the sentence feels. WRONG: "The tall boy in the blue hoodie, waved at us." CORRECT: "The tall boy in the blue hoodie waved at us." If you cannot name the job, delete the comma.',
      ],
      vocabulary: [
        { term: 'serial comma', definition: 'the comma placed before the final "and" or "or" in a list of three or more items.' },
        { term: 'coordinate adjectives', definition: 'two adjectives that modify the same noun independently, so they can be reversed or joined by "and" without sounding wrong.' },
        { term: 'nonessential (nonrestrictive) element', definition: 'information that can be deleted without changing which person or thing is meant; it takes a pair of commas.' },
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that can stand alone as a complete sentence.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-intro-and-series',
      kind: 'worked_example',
      problem:
        'Add the commas this sentence needs: "By the end of the second rehearsal the crew had rebuilt the balcony repainted the backdrop and rewired every stage light."',
      steps: [
        'Find the main subject and verb first: the sentence really says "the crew had rebuilt ... repainted ... and rewired." Everything before "the crew" is setup.',
        'JOB 2 applies to that setup: close the introductory phrase "By the end of the second rehearsal" with a comma so the reader knows where the introduction ends and the main sentence starts.',
        'Now look at what the crew actually did: rebuilt the balcony, repainted the backdrop, rewired every stage light. Three items — that is JOB 1, a series.',
        'Put a comma after each item except the last, and keep the serial comma before "and".',
        'CORRECT: "By the end of the second rehearsal, the crew had rebuilt the balcony, repainted the backdrop, and rewired every stage light." Note what does NOT get a comma: nothing separates "crew" from "had rebuilt", because a subject is never split from its verb.',
      ],
      answer:
        '"By the end of the second rehearsal, the crew had rebuilt the balcony, repainted the backdrop, and rewired every stage light." — one introductory comma plus two series commas.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extra-comma-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "The new bakery on Delmar Street, opened at six, and sold out of croissants by nine." The commas land exactly where the writer paused while reading aloud. Are they correct?',
      steps: [
        'Test each comma by naming its job. Comma 1 sits between the subject "The new bakery on Delmar Street" and its verb "opened".',
        'No job covers that gap. A long subject feels like it earns a pause, but a pause is not one of the five jobs — delete comma 1.',
        'Comma 2 sits before "and". Check what follows it: "sold out of croissants by nine" has no subject of its own, so it is the second half of a compound verb ("opened ... and sold out"), not a second independent clause.',
        'JOB 5 requires a complete sentence on BOTH sides of the conjunction, so comma 2 has no job either — delete it.',
        'WRONG: "The new bakery on Delmar Street, opened at six, and sold out of croissants by nine." CORRECT: "The new bakery on Delmar Street opened at six and sold out of croissants by nine."',
      ],
      answer:
        'No — both commas are extra. CORRECT: "The new bakery on Delmar Street opened at six and sold out of croissants by nine."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-intro-and-series',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Before the interview started, Nadia reread her notes, straightened her collar, and turned off her phone.', correct: true },
        { id: 'b', text: 'Before the interview started Nadia reread her notes, straightened her collar, and turned off her phone.' },
        { id: 'c', text: 'Before the interview started, Nadia reread her notes straightened her collar and turned off her phone.' },
        { id: 'd', text: 'Before the interview started, Nadia, reread her notes, straightened her collar, and turned off her phone.' },
      ],
      expectedAnswer: 'Before the interview started, Nadia reread her notes, straightened her collar, and turned off her phone.',
      hints: [
        'Two jobs are in play at once here: closing an introductory element, and separating items in a series.',
        'The introduction "Before the interview started" needs a comma after it, all three actions need separating, and nothing at all may sit between the subject "Nadia" and her verb.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-nonessential-pair',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My oldest cousin a welder in Duluth taught me to change a tire.' },
        { id: 'b', text: 'My oldest cousin, a welder in Duluth, taught me to change a tire.', correct: true },
        { id: 'c', text: 'My oldest cousin, a welder in Duluth taught me to change a tire.' },
        { id: 'd', text: 'My oldest cousin a welder in Duluth, taught me to change a tire.' },
      ],
      expectedAnswer: 'My oldest cousin, a welder in Duluth, taught me to change a tire.',
      hints: [
        'Delete "a welder in Duluth" and reread. Does the sentence still tell you which cousin is meant?',
        'The phrase is nonessential, so it takes a PAIR of commas — one before and one after. A single comma builds half a fence and strands the subject away from its verb.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-joining-clauses',
      kind: 'try_yourself',
      problem: 'Which sentence is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The storm knocked out power for six hours and the whole block ate dinner by candlelight.' },
        { id: 'b', text: 'The storm knocked out power for six hours, the whole block ate dinner by candlelight.' },
        { id: 'c', text: 'The storm knocked out power for six hours, and the whole block ate dinner by candlelight.', correct: true },
        { id: 'd', text: 'The storm knocked out power, and left the whole block eating dinner by candlelight.' },
      ],
      expectedAnswer: 'The storm knocked out power for six hours, and the whole block ate dinner by candlelight.',
      hints: [
        'Check whether the words on each side of "and" could stand alone as their own complete sentence.',
        'Two independent clauses take a comma BEFORE the conjunction. A comma with no conjunction leaves two sentences taped together, and a compound verb with no second subject takes no comma at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-comma-as-pause',
      kind: 'misconception_check',
      question:
        'A student insists that a comma goes wherever a reader would take a breath, and writes: "The runner in the bright orange jacket, crossed the finish line first." Is the comma correct?',
      commonErrors: [
        {
          answer: 'Yes — the sentence naturally pauses after "jacket", so the comma belongs there.',
          misconception: 'Placing commas by breath and rhythm instead of by grammatical job.',
          correctsTo:
            'No — breathing is not one of the five comma jobs. That comma sits between the subject "The runner in the bright orange jacket" and its verb "crossed", and nothing may split a subject from its verb. Long subjects invite this error because they feel like they deserve a rest stop. CORRECT: "The runner in the bright orange jacket crossed the finish line first."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A comma is legal only when it is doing a job: series, introductory element, coordinate adjectives, nonessential information, or joining two independent clauses with a conjunction.',
        'Nonessential information takes a PAIR of commas; information that tells the reader WHICH one is meant is essential and takes none.',
        'A comma plus a coordinating conjunction joins two complete sentences; a compound verb with no second subject takes no comma.',
        'Commas do not mark breathing — never split a subject from its verb. And remember what the missing one costs: "We are ready to eat, kids."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Commas That Do Real Work' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
