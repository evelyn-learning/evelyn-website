/**
 * Grade 7 ELA — Sentence Structure: Phrases & Clauses.
 *
 * The first row of Unit 6 (CCSS L.7.1a), and the row the rest of the unit
 * stands on. One test runs the whole lesson: hunt for the subject-verb pair.
 * A pair means a clause; no pair means a phrase. Then check the front of a
 * clause for a starter word or a relative pronoun to tell independent from
 * dependent.
 *
 * Vocabulary here is deliberately identical to the vocabulary in
 * m7ela-u6-fragments-and-run-ons.ts — independent clause, dependent clause,
 * starter word. Do not introduce "subordinator" into this course; the HS
 * seeds use it, the middle-school band does not.
 *
 * NOTE FOR FUTURE AUTHORS: every ungrammatical example in this file is
 * explicitly labeled WRONG, with the CORRECT version beside it. A tutor
 * reads these aloud, and an unlabeled fragment would be presented to the
 * student as a model sentence. Never write a broken example bare.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U6_PHRASES_AND_CLAUSES: LessonPlan = {
  id: 'evelyn.ms.m7ela.phrases-and-clauses.v1',
  title: 'Phrases & Clauses',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.phrases-and-clauses',
      standard: 'M7ELA-6.1',
      description:
        'Tell a phrase from a clause by hunting for the subject-verb pair, and tell an independent clause from a dependent one by checking the front of the clause for a starter word or a relative pronoun (CCSS L.7.1a).',
    },
  ],
  prerequisites: ['m7ela.verb-tense-consistency'],
  followUps: ['m7ela.sentence-types-and-combining'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that some groups of words carry a whole thought and some only add detail, using a message the student could send today.',
      script:
        'Read these two out loud. "Under the bleachers." And: "We found it." The first one leaves you hanging. Under the bleachers is where something happened, but nobody ever says who did what. The second one is only three words long, and it is finished. Somebody found something. Every sentence you write is built out of these two kinds of parts. One kind names a doer and an action. The other kind just adds detail, like where or when. Today you learn the one test that tells them apart, and it takes about two seconds to run.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-phrase-vs-clause',
      kind: 'concept',
      goal: 'Install the subject-verb test, name the common phrase types, and separate independent from dependent clauses.',
      keyIdeas: [
        'THE ONE TEST — DOES IT HAVE A SUBJECT AND A VERB? A CLAUSE has a subject-verb pair: somebody or something, plus what they do or are. A PHRASE does not have that pair. "The crowd cheered" is a clause, because the crowd is the doer and cheered is the action. "Under the bleachers" is a phrase, because nothing does anything in it. Ask two questions every time: who or what, and doing what?',
        'PREPOSITIONAL PHRASES ARE THE ONES YOU WRITE MOST. They start with a little location or time word such as under, over, in, on, after, before, with, or behind, and they end with a noun: "under the bleachers", "after the game", "with my cousin". They tell you where or when. They never have a subject-verb pair, so they can never be a sentence on their own. WRONG: "Under the bleachers." CORRECT: "We found my water bottle under the bleachers."',
        'AN -ING PHRASE IS STILL A PHRASE. "Running for the bus" looks like it has a verb in it, and that is the trap. Ask who is running. The words never say, so there is no subject. An -ing word by itself is also not acting as the verb; it needs a helper such as was or is. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus." Now there is a subject, Jordan, and a verb, was running, so now it is a clause.',
        'AN INDEPENDENT CLAUSE FINISHES THE THOUGHT. It has a subject, a verb, and nothing holding it open, so it can stand alone with a capital letter and a period: "We ate the whole pizza." This is the only kind of group that is allowed to be a sentence by itself.',
        'A DEPENDENT CLAUSE HAS THE PAIR AND STILL CANNOT STAND ALONE, because a STARTER WORD is stuck on the front. The starter words are because, although, when, since, if, while, after, unless and before. "After we ate the whole pizza" has a subject, we, and a verb, ate, and you are still waiting to hear what happened next. A dependent clause is not a mistake. It is only a mistake when you punctuate it as its own sentence, and you will fix that in a later lesson in this unit. CORRECT: "After we ate the whole pizza, we started on the garlic bread."',
        'RELATIVE PRONOUNS ALSO OPEN DEPENDENT CLAUSES, and these ones hide in the middle of a sentence instead of at the front. The relative pronouns are who, which and that. In "The kid WHO SITS BEHIND ME borrowed my eraser", the words who sits behind me make a dependent clause: who is the doer and sits is the action. It describes the kid. The sentence still needs its own main subject, the kid, and its own main verb, borrowed. LENGTH DECIDES NOTHING here or anywhere: "Rain fell" is two words and a clause, and "under the bleachers behind the gym" is six words and a phrase.',
      ],
      vocabulary: [
        { term: 'phrase', definition: 'a group of words with NO subject-verb pair, such as "under the bleachers" or "running for the bus"; it adds detail and can never be a sentence by itself.' },
        { term: 'clause', definition: 'a group of words that DOES have a subject-verb pair; every clause is either independent or dependent.' },
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a clause held open by a starter word such as because or although, so it cannot stand alone.' },
        { term: 'starter word', definition: 'a word such as because, although, when, since, if, while, after, unless or before that is placed in front of a clause and makes it dependent.' },
        { term: 'relative pronoun', definition: 'who, which or that, used to open a dependent clause that describes a noun, as in "the kid who sits behind me".' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-parts',
      kind: 'worked_example',
      problem:
        'Label each group as a phrase, an independent clause, or a dependent clause. (1) "under the bleachers behind the gym" (2) "we ate the whole pizza" (3) "after we ate the whole pizza"',
      steps: [
        'Group 1. Ask who or what is the doer. Nobody. Ask what the action is. There is not one. The words only tell you a place, and they start with the little location word "under". Verdict: PHRASE, and specifically a prepositional phrase. Six words did not help it; length is not the test.',
        'Group 2. Who or what? We. Doing what? Ate. There is a real subject-verb pair, so this is a clause. Now check the front for a starter word. There is none, and the thought is finished. Verdict: INDEPENDENT CLAUSE. It could be a sentence exactly as it stands: "We ate the whole pizza."',
        'Group 3. The pair has not changed. The subject is still we and the verb is still ate. But the starter word "after" now sits on the front, and it holds the thought open. You are waiting to hear what happened next. Verdict: DEPENDENT CLAUSE.',
        'Look at what one word did. Groups 2 and 3 have the exact same subject and the exact same verb. The starter word alone decides whether the group can stand alone.',
        'Group 3 is not wrong. It just needs to lean on an independent clause. CORRECT: "After we ate the whole pizza, we started on the garlic bread." WRONG: "After we ate the whole pizza." on its own with a period, because a dependent clause punctuated as a sentence is a fragment.',
      ],
      answer:
        '1 = phrase (prepositional), 2 = independent clause, 3 = dependent clause — the starter word "after" is the only difference between 2 and 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-verb-lookalike',
      kind: 'worked_example',
      problem:
        'A student says that "Sprinting across the parking lot with two heavy grocery bags" is a clause, because "sprinting" is a verb. Is the student right? If not, what is the smallest honest fix?',
      steps: [
        'Take the claim seriously and look for the verb first. "Sprinting" is the only word that looks like an action, and that is exactly the bait. An -ing word standing on its own is not acting as the verb of a clause. It needs a helper such as was, is or were.',
        'Now hunt for the subject, which is the half students forget. Ask who is sprinting. Read the words again. They never say. There is no doer anywhere in the group.',
        'No subject-verb pair means no clause. Verdict: this is a PHRASE. WRONG: "Sprinting across the parking lot with two heavy grocery bags." punctuated as a sentence.',
        'Notice that the student was fooled by length as well. Ten words of detail feel complete, and "Rain fell" feels too small to be a sentence. Both feelings are wrong. The subject-verb pair is the only test.',
        'Smallest honest fix: give it a subject and a real verb. CORRECT: "Dad was sprinting across the parking lot with two heavy grocery bags." Subject: Dad. Verb: was sprinting. Now it is an independent clause.',
        'A second correct fix keeps the phrase and attaches it to a clause: "Sprinting across the parking lot with two heavy grocery bags, Dad dropped the eggs." The phrase still has no subject of its own, and now it does not need one, because the sentence has one.',
      ],
      answer:
        'The student is wrong. It is a phrase, not a clause, because it has no subject and "sprinting" is not acting as the verb. Fix: "Dad was sprinting across the parking lot with two heavy grocery bags."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-phrase-or-clause',
      kind: 'try_yourself',
      problem: 'Which of these groups of words is a CLAUSE rather than a phrase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'under the bleachers behind the gym' },
        { id: 'b', text: 'waiting for the late bus in the rain' },
        { id: 'c', text: 'my little brother lost his shoe', correct: true },
        { id: 'd', text: 'to finish the whole level before dinner' },
      ],
      expectedAnswer: 'my little brother lost his shoe',
      hints: [
        'Ask each option two questions. Who or what is the doer? What is the action? A clause answers both of them.',
        'Do not pick the longest one. An -ing word and a to-word are not acting as verbs, and a location word such as "under" starts a phrase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-independent-or-dependent',
      kind: 'try_yourself',
      problem: 'Which of these is an INDEPENDENT clause — a group of words that could stand alone as a sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because my little brother lost his shoe' },
        { id: 'b', text: 'My little brother lost his shoe', correct: true },
        { id: 'c', text: 'That my brother wore to the park all summer' },
        { id: 'd', text: 'Losing his shoe somewhere at the park' },
      ],
      expectedAnswer: 'My little brother lost his shoe',
      hints: [
        'First throw out anything with no subject-verb pair at all. That removes one option straight away.',
        'Three of these have a subject and a verb. Check the very first word of each. A starter word such as "because" or a relative pronoun such as "that" makes a clause dependent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-dependent-clause',
      kind: 'try_yourself',
      problem:
        'Read this sentence: "The kid who sits behind me borrowed my eraser twice this week." Which group of words is the dependent clause?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The kid' },
        { id: 'b', text: 'who sits behind me', correct: true },
        { id: 'c', text: 'borrowed my eraser' },
        { id: 'd', text: 'twice this week' },
      ],
      expectedAnswer: 'who sits behind me',
      hints: [
        'A dependent clause still needs a subject-verb pair. Test each option: who or what, and doing what?',
        'A subject with no verb is not a clause, and a verb with no subject is not a clause either. Look for the group that has both AND opens with who, which or that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-length-is-the-test',
      kind: 'misconception_check',
      question:
        'A student says that "under the bleachers behind the gym on a cold Friday night" must be a clause, because it is long, and that "Rain fell" must be a phrase, because it is only two words. Are they right?',
      commonErrors: [
        {
          answer: 'Yes. The long group is a clause and the short group is a phrase.',
          misconception:
            'Using LENGTH as the test instead of hunting for the subject-verb pair. Long groups feel complete and short ones feel unfinished, so the student sorts by size.',
          correctsTo:
            'The student has it backward, both times. "Under the bleachers behind the gym on a cold Friday night" has no doer and no action anywhere in it. It is a stack of prepositional phrases telling you where and when, so it is a PHRASE, and it would still be a phrase at thirty words. "Rain fell" has a subject, rain, and a verb, fell, so it is a CLAUSE, and an independent one, which means it is a complete sentence. Length has nothing to do with it. The subject-verb pair decides.',
        },
        {
          answer: 'No, but "running for the bus" is a clause, because "running" is a verb.',
          misconception:
            'Treating any word that looks like an action as the verb of a clause, and never checking whether a subject exists.',
          correctsTo:
            'Ask who is running. The words never say, so there is no subject at all. An -ing word by itself is also not acting as the verb of a clause; it needs a helper such as was or is. So "running for the bus" is a PHRASE. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus." That version has a subject, Jordan, and a verb, was running, so that version is a clause.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Run one test on any group of words: who or what is the doer, and what is the action? A subject-verb pair means a clause. No pair means a phrase.',
        'Prepositional phrases such as "under the bleachers" and "after the game" only tell you where or when, and they can never be a sentence by themselves.',
        'An -ing word alone is not acting as a verb. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus."',
        'An independent clause finishes the thought and can stand alone: "We ate the whole pizza."',
        'A starter word (because, although, when, since, if, while, after, unless, before) or a relative pronoun (who, which, that) makes a clause dependent, so it has to lean on an independent clause. A dependent clause is only a fragment when you punctuate it as its own sentence.',
        'Length proves nothing in either direction. "Rain fell" is a clause and "under the bleachers behind the gym" is a phrase.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Phrases & Clauses' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
