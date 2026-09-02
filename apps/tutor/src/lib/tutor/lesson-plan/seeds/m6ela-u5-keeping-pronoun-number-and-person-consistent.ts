/**
 * Grade 6 ELA — Grammar: Pronoun Precision & Standard English: Keeping
 * Pronoun Number & Person Consistent.
 *
 * PROCEDURE-LED exemplar shape, borrowed from row 5.1. There is one
 * repeatable move and the whole lesson makes it fluent: hold the person and
 * number a piece of writing opens with in mind, and check every later
 * pronoun that refers back to the same person or group against it (CCSS
 * L.6.1c). This is a WHOLE-PASSAGE check — the kind of shift this row
 * teaches can only be seen by comparing an early sentence to a later one, so
 * every item in this file prints several connected sentences rather than
 * one. Three traps this plan is built to kill: "I" narration sliding into
 * "you" mid-paragraph with no reader ever being addressed, "we" and "I"
 * getting mixed up when nobody new has joined or left the scene, and
 * treating every pronoun change as an error even when the writing itself
 * gives a real reason for it.
 *
 * SCOPE GUARD: Grade 6 row 5.3 checks a WHOLE PIECE of writing for an
 * inappropriate SHIFT in pronoun person (first — I, we; second — you; third
 * — he, she, it, they) or number (singular or plural), holding the person
 * and number the writing opens with against every later pronoun that refers
 * back to the same person or group. DELIBERATELY EXCLUDED: choosing a
 * pronoun's CASE from the job it does inside one sentence (row 5.1);
 * intensive pronouns such as myself and ourselves (row 5.2); the double
 * negatives, "ain't" and "we was" of nonstandard-English repair (row 5.4);
 * and pronoun-antecedent number agreement together with the repair of a
 * vague or ambiguous pronoun reference. That last one is L.6.1d, excluded
 * from this whole course because the shipped
 * m7ela-u5-pronouns-and-antecedents.ts already teaches it end to end, and it
 * does not appear here in any form. DELIBERATELY ALLOWED, because a shift
 * can only be judged by comparing pronouns to each other: every item in this
 * file tracks a single, specifically identified narrator or a small named
 * group (the writer alone, the writer and a named sibling, or the writer's
 * own family), never a generic countable antecedent noun such as "every
 * player" or "a team" — matching a pronoun's number to a countable
 * antecedent noun belongs to the excluded antecedent-agreement standard, not
 * to this lesson.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory. Every ungrammatical example IN THE
 * TUTOR'S OWN PROSE is explicitly labeled WRONG, with the CORRECT version
 * beside it, because a tutor reads those lines aloud. The only unlabeled
 * shifted sentences in this file are the MCQ distractors the three
 * try_yourself items ask the student to reject, which is exactly what those
 * items are for. This file carries no contractions in the tutor's own
 * voice anywhere.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * personal narrative — bottle caps, a blanket fort, raking leaves — which is
 * true by construction, so there is no factual claim to verify.
 *
 * PREREQUISITES/FOLLOWUPS: taken from the lesson brief. Prerequisite is row
 * 5.2 (m6ela.intensive-pronouns); follow-up is row 5.4
 * (m6ela.standard-and-nonstandard-english).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U5_KEEPING_PRONOUN_NUMBER_AND_PERSON_CONSISTENT: LessonPlan = {
  id: 'evelyn.ms.m6ela.keeping-pronoun-number-and-person-consistent.v1',
  title: 'Keeping Pronoun Number & Person Consistent',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.keeping-pronoun-number-and-person-consistent',
      standard: 'M6ELA-5.3',
      description:
        'Recognize and correct an inappropriate shift in pronoun number or person within one piece of writing, such as sliding from "I" to "you" mid-paragraph, by holding the person and number the writing opens with against every later pronoun that refers back to the same person or group (CCSS L.6.1c).',
    },
  ],
  prerequisites: ['m6ela.intensive-pronouns'],
  followUps: ['m6ela.standard-and-nonstandard-english'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel a shift cause real confusion, not just sound odd.',
      script:
        'You are texting your cousin the story of how your team almost lost the championship game. Halfway through the message you type, "I could not believe we were down by two points. Then you steal the ball right at half court and score at the buzzer." Your cousin texts back one word: "wait, WHO stole the ball?" Nothing about the game changed. The same player did the same thing no matter how the story gets told. But the pronoun changed, and for a second your cousin thought a whole new person had shown up in the story. A piece of writing sets up a person telling it, and every pronoun after that has to keep pointing at the same person unless something in the writing actually changes. Today we learn to catch a shift like that and fix it without losing a single fact.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-person-number-and-the-whole-piece',
      kind: 'concept',
      goal: 'Install person and number as the two things a piece of writing sets and keeps, the two kinds of shift, and the check-the-whole-piece procedure, including when a change is allowed.',
      keyIdeas: [
        'EVERY PIECE OF WRITING SETS A PERSON AND A NUMBER FOR ITS STORY, AND BOTH HAVE TO HOLD FOR THE WHOLE PIECE, NOT JUST ONE SENTENCE. Person: first (I, we — the writer speaking), second (you — the writer speaking straight to a reader), third (he, she, it, they — someone else). Number: singular (I, you, he, she, it) or plural (we, you all, they).',
        'THE MOST COMMON SHIFT SWAPS PERSON, NOT NUMBER. Personal narration in "I" drifts into "you" mid-paragraph when the writer still means only themself. WRONG: "I love the smell of rain on hot pavement. You just stand there and breathe it in." CORRECT: "I love the smell of rain on hot pavement. I just stand there and breathe it in."',
        'A NUMBER SHIFT HAPPENS WHEN "I" AND "WE" GET MIXED UP WITH NO REASON. If nobody has joined or left the piece of writing, an unexplained switch between "I" and "we" has nobody new to mean. WRONG: "I spent the whole afternoon organizing my baseball cards by year. Every card from before 2010 went into a shoebox. Then we labeled the binder and put it on the shelf." CORRECT: "...Then I labeled the binder and put it on the shelf." No second person is ever mentioned, so "we" has nothing to point at.',
        'A SHIFT IS ONLY VISIBLE ACROSS SENTENCES, SO CHECK THE WHOLE PIECE, NOT ONE LINE AT A TIME. Read the pronoun that opens the piece, hold it in mind, and check every later pronoun that refers back to the same person or group against it. A single sentence can be perfectly correct on its own and still be the broken link in a passage.',
        'NOT EVERY CHANGE IS A MISTAKE — CHECK WHETHER SOMETHING REAL CHANGED FIRST. If the writing gives a real reason, such as a task handed to one person alone after a group did something together, the pronoun is allowed to change with it. Ask: did the writing introduce a reason for this pronoun to be different, or did it just slide?',
        'THE FIX IS TO CHANGE ONLY THE PRONOUN THAT BROKE AWAY, NOT TO REWRITE THE WHOLE PASSAGE. Find the one pronoun that does not match what the piece already established, and change only that one so it fits, unless the writing already gave a real reason for the change.',
      ],
      vocabulary: [
        { term: 'person', definition: 'which role a pronoun plays in a piece of writing — first (I, we, the writer), second (you, the reader), or third (he, she, it, they, someone else).' },
        { term: 'number', definition: 'whether a pronoun means one (singular: I, you, he, she, it) or more than one (plural: we, you all, they).' },
        { term: 'shift', definition: 'a change in person or number partway through a piece of writing that breaks the pattern the writing already set.' },
        { term: 'consistent', definition: 'staying the same throughout a piece of writing, so every pronoun matches the person and number set earlier.' },
        { term: 'narrator', definition: 'the person telling a story, whose pronoun (usually I or we) should stay steady unless the writing gives a real reason to change it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-person-shift-i-to-you',
      kind: 'worked_example',
      problem:
        'Find the shift and repair it, then say which rule caught it.\n\n"I spend every Saturday morning at the skate park with my cousin. You always get there early before it gets crowded, so there is more room to practice. By ten that morning, I am usually ready to head home for breakfast."',
      steps: [
        'Read the whole passage first, not one sentence at a time. A shift can only be seen by comparing an early pronoun to a later one.',
        'Name the person the passage opens with. The first sentence uses "I" — first person, singular — and nobody else has been introduced anywhere in the passage.',
        'Check the middle sentence against that. "You always get there early before it gets crowded, so there is more room to practice" switches to second person, but the passage never starts talking to a reader anywhere else. Nothing in the story changed; the pronoun just slid.',
        'Confirm with the last sentence. "I am usually ready to head home for breakfast" returns to first person, which tells you the writer meant "I" the whole time and picked "you" by accident in the middle.',
        'Repair only the sentence that broke away. WRONG: "You always get there early before it gets crowded, so there is more room to practice." CORRECT: "I always get there early before it gets crowded, so there is more room to practice."',
        'Read the fixed passage straight through to confirm every pronoun now points at the same person.',
      ],
      answer:
        'The middle sentence should read "I always get there early before it gets crowded, so there is more room to practice." The passage opens and closes in first person singular ("I"), so the second sentence\'s "you" is the shift, and it is the one that has to match, not the other two sentences.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-number-shift-i-to-we',
      kind: 'worked_example',
      problem:
        'Find the shift and repair it, then say which rule caught it.\n\n"I spent the whole afternoon organizing my baseball cards by year. Every card from before 2010 went into a shoebox, and every card after that went into a binder. Then we labeled the binder and put it on the shelf."',
      steps: [
        'Check whether a second person ever joins the piece. Read all three sentences and list who is named: only "I," across the whole passage. No cousin, no friend, no sibling is ever mentioned.',
        'Notice where the pronoun changes anyway. The last sentence switches to "we," which is plural, even though only one person has done anything in this passage so far.',
        'Ask what "we" would have to mean. It would need a second labeler standing in the room, and the passage never puts one there. With nobody to be part of "we," the plural has nothing to point at.',
        'Repair the pronoun to match the number the passage already set. WRONG: "Then we labeled the binder and put it on the shelf." CORRECT: "Then I labeled the binder and put it on the shelf."',
        'Read the fixed passage straight through. All three sentences now stay first person singular, matching a solo afternoon of sorting cards.',
      ],
      answer:
        'The last sentence should read "Then I labeled the binder and put it on the shelf." No second person ever enters the passage, so the number has to stay singular throughout, matching the "I" that opened it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-person-shift-blank',
      kind: 'try_yourself',
      problem:
        'Read the passage. One sentence is missing.\n\n"I collect bottle caps from every diner my family visits on road trips. ___ By the time this trip ended, I had eleven new caps to add."\n\nWhich sentence belongs in the blank so every pronoun in the passage matches?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I keep them sorted by state in a shoebox under my bed.', correct: true },
        { id: 'b', text: 'You keep them sorted by state in a shoebox under your bed.' },
        { id: 'c', text: 'We keep them sorted by state in a shoebox under our bed.' },
        { id: 'd', text: 'They keep them sorted by state in a shoebox under their bed.' },
      ],
      expectedAnswer: 'I keep them sorted by state in a shoebox under my bed.',
      hints: [
        'Read both sentences that are already there before you decide. Every pronoun that refers back to the collector has to match the very first sentence.',
        'Find who else the passage names besides the narrator. If nobody else shows up anywhere in these sentences, the blank needs the same singular first-person pronoun the passage opened with.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-number-shift-blank',
      kind: 'try_yourself',
      problem:
        'Read the passage. One sentence is missing.\n\n"My sister and I spent Saturday morning building a blanket fort in the living room. We draped three sheets over the couch and two kitchen chairs. ___ By dinner, the fort was still standing, and we ate cereal inside it for a snack."\n\nWhich sentence belongs in the blank so every pronoun in the passage matches?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'You taped the last sheet to the bookshelf so it would not slide down.' },
        { id: 'b', text: 'We taped the last sheet to the bookshelf so it would not slide down.', correct: true },
        { id: 'c', text: 'I taped the last sheet to the bookshelf so it would not slide down.' },
        { id: 'd', text: 'They taped the last sheet to the bookshelf so it would not slide down.' },
      ],
      expectedAnswer: 'We taped the last sheet to the bookshelf so it would not slide down.',
      hints: [
        'Look at the sentence right before the blank and the sentence right after it. Both describe something the narrator and the sister do side by side.',
        'Nothing in the passage says the sister stepped away or that anyone else joined in. The blank needs the same pronoun that names both of them together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-allowed-shift-blank',
      kind: 'try_yourself',
      problem:
        'Read the passage. One sentence is missing.\n\n"My brother and I raked every leaf in the backyard before lunch. We filled six bags without stopping once, and we dragged five of them to the curb together. Dad asked me to haul the last bag to the curb by myself while he mowed the lawn. ___"\n\nWhich sentence belongs in the blank so the pronoun matches who is actually doing this last part of the job?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We dragged the last bag over and went inside for lunch.' },
        { id: 'b', text: 'You dragged the last bag over and went inside for lunch.' },
        { id: 'c', text: 'I dragged the last bag over and went inside for lunch.', correct: true },
        { id: 'd', text: 'They dragged the last bag over and went inside for lunch.' },
      ],
      expectedAnswer: 'I dragged the last bag over and went inside for lunch.',
      hints: [
        'This passage is different from the last two — read the sentence right before the blank carefully. Something changes about who is doing the work.',
        'Dad assigns the last bag to one person, by name, "by myself." The blank has to match who was actually asked to do that part alone, not who did the earlier bags together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-any-change-is-an-error',
      kind: 'misconception_check',
      question:
        'A student reads a passage where the writer says "My family and I spent all morning building the fort. Dad asked me to grab more tape by myself, so I ran to the garage and back." The student marks the "I" as a mistake and says the passage should say "we" the whole way through. What went wrong, and what rule is the student missing?',
      commonErrors: [
        {
          answer: 'It should say "We ran to the garage and back," because the passage already started in the plural, with "my family and I."',
          misconception:
            'Treating every pronoun that differs from the passage\'s opening pronoun as automatically a mistake, without checking whether anything in the writing actually explains the change.',
          correctsTo:
            'A shift is only a mistake when nothing in the piece explains it. Here, Dad specifically asks one person, "by myself," to grab the tape — that sentence is the reason the pronoun is allowed to narrow from "we" to "I." The rule is to look for a real change in who is doing the action before deciding a shift is wrong, not to flag every pronoun that differs from the first one.',
        },
        {
          answer: 'A piece of writing can never use more than one pronoun for the people in it.',
          misconception:
            'Believing that staying consistent means picking one pronoun for the whole piece, when it actually means matching each pronoun to who is truly doing the action at that point.',
          correctsTo:
            'Consistency means every pronoun stays true to what is actually happening, not that only one pronoun is ever allowed. "We" is correct while the whole group acts together, and "I" becomes correct the moment the writing says one person acts alone. What is never allowed is switching with no reason given — that unexplained kind of switch is the actual error this lesson teaches you to catch.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every piece of writing sets a person (first: I, we; second: you; third: he, she, it, they) and a number (singular or plural), and both have to hold across the whole piece.',
        'The most common shift slides from "I" into "you" mid-paragraph when the writer still means only themself. WRONG: "I love the smell of rain on hot pavement. You just stand there and breathe it in." CORRECT: "I love the smell of rain on hot pavement. I just stand there and breathe it in."',
        'A number shift happens when "I" and "we" get mixed up with no reason. If nobody new ever joins the piece, an unexplained "we" has nothing to point at.',
        'A shift is only visible across sentences. Hold the pronoun the passage opened with in mind, and check every later pronoun that refers to the same person or group against it.',
        'Not every change is a mistake. If the writing gives a real reason — a task handed to one person alone, or a new person joining the action — the pronoun is allowed to change with it.',
        'The fix is to change only the pronoun that broke away so it matches what the passage already established, not to rewrite the whole passage.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Keeping Pronoun Number & Person Consistent' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
