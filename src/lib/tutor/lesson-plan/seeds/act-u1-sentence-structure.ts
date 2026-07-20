/**
 * ACT — English / Sentence Structure & Boundaries: fragments, run-ons,
 * comma splices.
 *
 * The single highest-frequency skill on ACT English. Passage-embedded
 * usage questions run about 36 seconds each (75 questions / 45 minutes);
 * sentence-boundary questions (does this need one sentence or two?) show
 * up on roughly one in five to six items. All excerpts below are
 * original. "NO CHANGE" is a legitimate first choice on the real test
 * and appears as choice 'a' throughout.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_SENTENCE_STRUCTURE: LessonPlan = {
  id: 'evelyn.testprep.act.sentence-structure.v1',
  title: 'Sentence Structure & Boundaries',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.sentence-structure',
      standard: 'ACT-1.1',
      description:
        'Identify and correct comma splices, run-on (fused) sentences, and sentence fragments by testing whether each side of a punctuation mark is an independent clause.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame sentence boundaries as the single highest-yield ACT English skill and set the pace expectation.',
      script:
        'Fragments, run-ons, and comma splices show up on roughly one in every five or six ACT English questions — more than any other single skill on the test. You have about 36 seconds per question, so you need a fast, reliable test for "is this one sentence, or two?" That test is today\'s whole lesson.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-boundaries',
      kind: 'concept',
      goal: 'The independent-clause test, the three boundary errors, and the traps that hide them.',
      keyIdeas: [
        'THE TEST: an independent clause has a subject and a verb and could stand alone as a sentence. Before touching any punctuation, isolate each side and ask "does this work by itself?"',
        'FOUR LEGAL WAYS to join two independent clauses: a period (two sentences), a semicolon, a comma + FANBOYS (for, and, nor, but, or, yet, so), or a colon if the second clause explains the first.',
        'COMMA SPLICE: two independent clauses joined by a comma ALONE, with no conjunction. This is the single most-tested error on ACT English. A comma by itself is never strong enough to join two complete sentences.',
        'RUN-ON / FUSED SENTENCE: two independent clauses jammed together with NO punctuation and no conjunction at all. Same underlying problem as a comma splice — just missing the comma too.',
        'FRAGMENT: a group of words punctuated like a sentence (capital letter, period) that is NOT a complete thought — usually because it\'s actually a dependent clause. Dependent clauses start with subordinators like "when," "although," "because," "which," or "who" and cannot stand alone no matter how long or important-sounding they are.',
        'TRAP — CONJUNCTIVE-ADVERB BAIT: words like "however," "therefore," "moreover," and "consequently" sound exactly like FANBOYS conjunctions but are NOT. Joining two independent clauses with only a comma before one of these words is still a comma splice — it needs a semicolon before and a comma after.',
        'TRAP — LENGTH IS NOT THE TEST: a long sentence with one independent clause plus modifying phrases is NOT a run-on. Don\'t "fix" a sentence just because it\'s long — count clauses, not words.',
        'TRAP — FRAGMENT THAT LOOKS COMPLETE: a dependent clause standing alone often reads as grammatically smooth ("When the fundraiser raised triple its goal.") which is exactly why it\'s tested — the ear says it sounds fine, but the test is "can this stand alone?"',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a group of words with a subject and verb that expresses a complete thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a group of words with a subject and verb that CANNOT stand alone — usually opens with a subordinator like "when," "because," or "which."' },
        { term: 'comma splice', definition: 'two independent clauses incorrectly joined by a comma with no conjunction.' },
        { term: 'FANBOYS', definition: 'the coordinating conjunctions that can follow a comma to join two independent clauses: for, and, nor, but, or, yet, so.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comma-splice',
      kind: 'worked_example',
      problem:
        'ACT English item — the underlined portion is in CAPS: "The volunteers arrived early, THEY SET UP two hundred chairs before the doors opened." Which fix corrects the sentence?',
      steps: [
        'Test each side alone: "The volunteers arrived early." — complete sentence. "They set up two hundred chairs before the doors opened." — also complete. Two independent clauses.',
        'A comma alone cannot join two independent clauses — that is a comma splice, the single most common ACT English trap.',
        'Pick a legal fix: period, semicolon, or comma + FANBOYS. A comma + "and" keeps the sentence flowing naturally here.',
        'Corrected: "The volunteers arrived early, and they set up two hundred chairs before the doors opened."',
      ],
      answer: 'The volunteers arrived early, and they set up two hundred chairs before the doors opened.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-conjunctive-adverb-trap',
      kind: 'worked_example',
      problem:
        'ACT English item — the underlined portion is in CAPS: "Ticket sales exceeded expectations, HOWEVER, the venue still lost money on catering." Which fix corrects the sentence?',
      steps: [
        'Test each side: "Ticket sales exceeded expectations." — complete. "The venue still lost money on catering." — complete. Two independent clauses again.',
        '"However" LOOKS like it is doing the job of "but," but it is a conjunctive adverb, not a FANBOYS conjunction — a comma alone before it does not legally join the clauses.',
        'Legal fix: semicolon before "however," comma after it.',
        'Corrected: "Ticket sales exceeded expectations; however, the venue still lost money on catering."',
      ],
      answer: 'Ticket sales exceeded expectations; however, the venue still lost money on catering.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-comma-splice',
      kind: 'try_yourself',
      problem:
        'The underlined portion is in CAPS: "The museum extended its hours for the exhibit, ATTENDANCE DOUBLED in the final week." Which choice best corrects the underlined portion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — "The museum extended its hours for the exhibit, attendance doubled in the final week."' },
        { id: 'b', text: '"The museum extended its hours for the exhibit. Attendance doubled in the final week."', correct: true },
        { id: 'c', text: '"The museum extended its hours for the exhibit, and attendance, doubled in the final week."' },
        { id: 'd', text: '"The museum extended its hours for the exhibit attendance doubled in the final week."' },
      ],
      expectedAnswer: '"The museum extended its hours for the exhibit. Attendance doubled in the final week."',
      hints: [
        'Test each side alone: is "attendance doubled in the final week" a complete sentence on its own?',
        'Two independent clauses joined by only a comma is a comma splice — you need a period, semicolon, or comma + FANBOYS.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fragment',
      kind: 'try_yourself',
      problem:
        'The underlined portion is in CAPS: "WHEN THE FUNDRAISER RAISED TRIPLE ITS GOAL. Organizers could barely contain their excitement." Which choice best corrects the underlined portion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — "When the fundraiser raised triple its goal. Organizers could barely contain their excitement."' },
        { id: 'b', text: '"The fundraiser raised triple its goal. Organizers could barely contain their excitement."', correct: true },
        { id: 'c', text: '"When the fundraiser, raised triple its goal. Organizers could barely contain their excitement."' },
        { id: 'd', text: '"When the fundraiser raised triple its goal; organizers could barely contain their excitement."' },
      ],
      expectedAnswer: '"The fundraiser raised triple its goal. Organizers could barely contain their excitement."',
      hints: [
        'Say the CAPS portion alone: does it complete a thought, or leave you asking "when... what happened"?',
        '"When" opens a dependent clause. It either needs to attach to an independent clause, or lose the "When" to stand alone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-run-on',
      kind: 'try_yourself',
      problem:
        'The underlined portion is in CAPS: "The chef tested six recipes SHE FINALLY CHOSE the one with roasted garlic." Which choice best corrects the underlined portion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE — "The chef tested six recipes she finally chose the one with roasted garlic."' },
        { id: 'b', text: '"The chef tested six recipes, she finally chose the one with roasted garlic."' },
        { id: 'c', text: '"The chef tested six recipes, and she finally chose the one with roasted garlic."', correct: true },
        { id: 'd', text: '"The chef tested six recipes she finally, chose the one with roasted garlic."' },
      ],
      expectedAnswer: '"The chef tested six recipes, and she finally chose the one with roasted garlic."',
      hints: [
        'No punctuation at all between two independent clauses is a run-on (fused sentence) — the most extreme version of the boundary error.',
        'Adding just a comma (no conjunction) only turns the run-on into a comma splice — you still need FANBOYS, a semicolon, or a period.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-length',
      kind: 'misconception_check',
      question:
        'A student sees this long sentence and assumes it must be a run-on: "The committee, after reviewing over three hundred applications from students across the district, selected twelve finalists for the final interview round." They mark it as an error and try to add a period in the middle. What went wrong?',
      commonErrors: [
        {
          answer: 'Assuming sentence length signals a run-on',
          misconception: 'Treating LENGTH as the test for boundary errors instead of counting independent clauses.',
          correctsTo:
            'Length is irrelevant — count independent clauses, not words. This sentence has exactly ONE independent clause ("The committee selected twelve finalists...") plus a non-essential modifying phrase set off by commas ("after reviewing over three hundred applications..."). One independent clause, however long, is never a run-on. "NO CHANGE" is often the correct answer on ACT English — do not "fix" what is not broken.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Test each side of the punctuation alone: is it an independent clause (complete thought) or a dependent clause / fragment?',
        'Two independent clauses need a period, semicolon, or comma + FANBOYS — a comma ALONE is a comma splice, and no punctuation at all is a run-on (fused sentence).',
        'A fragment is usually a dependent clause ("when," "although," "which"...) punctuated like a full sentence — it can sound smooth and still be wrong.',
        'Conjunctive adverbs (however, therefore, moreover) take a semicolon before them, not a comma; and sentence LENGTH is never the test for a run-on — clause count is.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Sentence Structure & Boundaries' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
