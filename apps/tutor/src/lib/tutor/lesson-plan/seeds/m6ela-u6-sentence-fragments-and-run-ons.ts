/**
 * Grade 6 ELA — Sentence Fluency, Style & Punctuation: Sentence Fragments &
 * Run-Ons.
 *
 * PROCEDURE-LED fan-out row. One test runs the whole lesson: subject, verb,
 * finished thought. The three traps it is built to kill are the stranded
 * starter-word fragment, the comma splice, and the belief that sentence
 * LENGTH is what makes a sentence a run-on.
 *
 * SCOPE GUARD: Grade 6 row 6.1 identifies a sentence fragment or a run-on
 * sentence (including a comma splice) with a subject-verb-finished-thought
 * test, and corrects it with a period, a semicolon between two closely
 * related complete sentences, a comma plus a joining word that matches the
 * meaning, or by attaching a starter-word group to the sentence it depends
 * on. DELIBERATELY EXCLUDED: naming the two parts being joined or separated
 * as independent or dependent clauses, and explaining what a phrase or a
 * clause does in general — that is L.7.1a, taught by the shipped Grade 7
 * course's sentence-structure unit. Naming a repaired sentence as simple,
 * compound, complex or compound-complex is also excluded — that is L.7.1b,
 * reserved for the same Grade 7 unit; nothing in this file names a sentence
 * type or a clause by that vocabulary. This lesson also does not vary
 * sentence length or opening for style (row 6.2, L.6.3a), does not use a
 * comma, parentheses or dashes to set off a nonrestrictive or parenthetical
 * element (row 6.3, L.6.2a), does not check a whole passage's style or tone
 * for consistency (row 6.4, L.6.3b), and does not repair a double negative
 * or another nonstandard-English form such as "ain't" or "we was" (row 5.4,
 * L.6.1e) — a fragment or a run-on can appear inside an otherwise
 * standard-English sentence, and a nonstandard form can appear inside a
 * complete sentence, so the two error families are independent of each
 * other. DELIBERATELY ALLOWED: this lesson names the starter WORDS that
 * leave a thought unfinished — because, although, when, since, if, while,
 * after, before, unless — since a student cannot spot that kind of fragment
 * without seeing the word that causes it. Naming the word is unavoidable;
 * naming the group of words it opens as a "clause," and sorting sentences
 * into named types, is what stays out of the material a student is taught.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt and example sentence in this file
 * is original prose written for the item. This course carries no passage
 * machinery — no passageId, no shared texts — so each question must be
 * solvable from the words printed inside it. Every ungrammatical example IN
 * THE TUTOR'S OWN PROSE is explicitly labeled WRONG, with the CORRECT
 * version beside it: a tutor reads these lines aloud, and an unlabeled
 * fragment or comma splice would be handed to the student as a model
 * sentence. Never write a broken example bare. The only unlabeled wrong
 * forms in this file are the MCQ distractors the three try_yourself items
 * ask the student to reject, which is exactly what those items are for;
 * each one is then named in that item's hints or in the misconception
 * check.
 *
 * CLAIM LEDGER: none required. Every example sentence in this file is an
 * invented, everyday scenario, which is true by construction, so there is
 * no factual claim to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U6_SENTENCE_FRAGMENTS_AND_RUN_ONS: LessonPlan = {
  id: 'evelyn.ms.m6ela.sentence-fragments-and-run-ons.v1',
  title: 'Sentence Fragments & Run-Ons',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.sentence-fragments-and-run-ons',
      standard: 'M6ELA-6.1',
      description:
        'Identify a sentence fragment or a run-on sentence, including a comma splice, using a subject-verb-finished-thought test, and correct it by supplying the missing part or by fixing the punctuation between two complete sentences (CCSS L.6.1).',
    },
  ],
  prerequisites: ['m6ela.standard-and-nonstandard-english'],
  followUps: ['m6ela.varying-sentence-patterns-for-style'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the three-part test in a text message, and show that the fix is a test rather than a feeling.',
      script:
        'You text your mom "Because practice got moved." and then stop typing. She texts back "...moved to WHEN?" because your message never finished — it just set up a reason and quit. Now picture the opposite problem: you send one giant text with three whole ideas jammed together and no punctuation anywhere, and she has to read it twice to find where one idea ends and the next begins. Those are the two most common ways a sentence breaks down in sixth-grade writing: stopping too soon, and never stopping at all. There is a three-part test that catches both, and it takes about five seconds to run.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sentence-boundaries',
      kind: 'concept',
      goal: 'Install the three-part completeness test, name the two boundary errors, and give the legal fixes for each.',
      keyIdeas: [
        'EVERY COMPLETE SENTENCE NEEDS THREE THINGS — a subject (who or what it is about), a verb (what they do or are), and a finished thought. Run the test on any group of words and you find out fast whether it stands on its own. "The bell rang" passes all three, and it is only three words long.',
        'A FRAGMENT IS MISSING ONE OF THE THREE. The kind you will meet most often has a subject and a verb but never finishes the thought, because a starter word is holding it open — words like because, although, when, since, if, while, after, before and unless. WRONG: "Because the printer jammed again." CORRECT: "Because the printer jammed again, the flyers came out late."',
        'A RUN-ON JAMS TWO COMPLETE SENTENCES TOGETHER WITH NOTHING BETWEEN THEM. WRONG: "The printer jammed again the flyers came out late." A COMMA SPLICE does the same thing with only a comma, which is not strong enough to hold two complete sentences apart. WRONG: "The printer jammed again, the flyers came out late."',
        'THERE ARE LEGAL FIXES FOR A RUN-ON OR A SPLICE. Use a period: "The printer jammed again. The flyers came out late." Use a comma plus a joining word from for, and, nor, but, or, yet, so, choosing the word that matches the meaning: "The printer jammed again, so the flyers came out late." A semicolon also works, for two sentences that belong tightly together: "The printer jammed again; the flyers came out late."',
        'A STARTER WORD NEEDS A COMPLETE SENTENCE ATTACHED, EITHER ORDER. Put a comma after the starter-word group only when it comes first: "Because the printer jammed, we were late." Flip the order and skip the comma: "We were late because the printer jammed."',
        'LENGTH IS NOT THE TEST. A very long sentence can be perfectly correct, and a three-word one can be a fragment. Count the complete thoughts and check what is sitting between them — never fix a sentence just because it looks long.',
      ],
      vocabulary: [
        { term: 'fragment', definition: 'a group of words punctuated as a sentence that is missing a subject, a verb or a finished thought.' },
        { term: 'run-on', definition: 'two complete sentences joined with no punctuation at all.' },
        { term: 'comma splice', definition: 'two complete sentences joined with only a comma.' },
        { term: 'starter word', definition: 'a word such as because, although, when or since that leaves the group of words after it unfinished until it is attached to a complete sentence.' },
        { term: 'joining word', definition: 'a short word — for, and, nor, but, or, yet, so — that can follow a comma to connect two complete sentences.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-repair-fragment',
      kind: 'worked_example',
      problem:
        'Fix this. "Although the science fair got moved to the gym. Everyone still found their tables okay."',
      steps: [
        'Run the three-part test on the first group of words: subject, verb, finished thought. Subject: the science fair. Verb: got moved. Finished thought? No — the word "Although" leaves you waiting to hear what happened despite the move.',
        'A group of words that starts with a word like although, because, when, since, if, while, after, before or unless is never a finished thought by itself. Punctuated as its own sentence, it is a fragment. WRONG: "Although the science fair got moved to the gym."',
        'Test the second group. Subject: everyone. Verb: found. Finished thought? Yes — that one is already a complete sentence and needs no repair.',
        'The fix is to stop separating them. A starter-word group that comes first attaches to the sentence after it with a comma. CORRECT: "Although the science fair got moved to the gym, everyone still found their tables okay."',
        'A second correct fix is to flip the order, and then no comma is needed: "Everyone still found their tables okay although the science fair got moved to the gym."',
        'One fix that does NOT work is a period between them, because that just moves where the fragment sits. WRONG: "Although the science fair got moved to the gym. Everyone still found their tables okay." A starter word makes a promise the sentence has to keep, no matter which side it starts on.',
      ],
      answer:
        'Although the science fair got moved to the gym, everyone still found their tables okay. (Also correct: Everyone still found their tables okay although the science fair got moved to the gym.)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-splice',
      kind: 'worked_example',
      problem:
        'Fix this three different ways. "The vending machine ate my dollar, I never got my snack."',
      steps: [
        'Cover everything after the comma and read what is left: "The vending machine ate my dollar." Subject, verb, finished thought. That is a complete sentence.',
        'Now cover everything before the comma: "I never got my snack." Subject, verb, finished thought. Also a complete sentence.',
        'Two complete sentences with only a comma between them is a comma splice. WRONG: "The vending machine ate my dollar, I never got my snack."',
        'Fix one, the period. Fully separate them: "The vending machine ate my dollar. I never got my snack."',
        'Fix two, the semicolon, for two sentences that belong tightly together: "The vending machine ate my dollar; I never got my snack."',
        'Fix three, the comma plus a joining word, which also says how the two ideas connect: "The vending machine ate my dollar, and I never got my snack." Even better for the meaning: "The vending machine ate my dollar, so I never got my snack."',
        'Deleting the comma is not a fourth fix. WRONG: "The vending machine ate my dollar I never got my snack." That turns a comma splice into a run-on, which is the same mistake wearing less punctuation.',
      ],
      answer:
        'Any of these three: "The vending machine ate my dollar. I never got my snack." / "The vending machine ate my dollar; I never got my snack." / "The vending machine ate my dollar, so I never got my snack."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fix-fragment',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the fragment? "Even though the pool closes at six on weekdays. We still got in two full laps."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Even though the pool closes at six on weekdays we still got in two full laps.' },
        { id: 'b', text: 'Even though the pool closes at six on weekdays; we still got in two full laps.' },
        { id: 'c', text: 'Even though the pool closes at six on weekdays, and we still got in two full laps.' },
        { id: 'd', text: 'Even though the pool closes at six on weekdays, we still got in two full laps.', correct: true },
      ],
      expectedAnswer: 'Even though the pool closes at six on weekdays, we still got in two full laps.',
      hints: [
        'Read the first part alone: "Even though the pool closes at six on weekdays." Does it finish the thought, or leave you waiting to hear what happened despite that?',
        'A starter word like "even though" needs a comma and a complete sentence attached right after it — not a semicolon, and not an extra joining word squeezed in after the comma.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fix-splice',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the sentence? "The bake sale table was almost empty, we still made forty dollars."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bake sale table was almost empty, but we still made forty dollars.', correct: true },
        { id: 'b', text: 'The bake sale table was almost empty we still made forty dollars.' },
        { id: 'c', text: 'The bake sale table was almost empty, however, we still made forty dollars.' },
        { id: 'd', text: 'The bake sale table was almost empty, so we still made forty dollars.' },
      ],
      expectedAnswer: 'The bake sale table was almost empty, but we still made forty dollars.',
      hints: [
        'Cover each side of the comma and read it alone. If both halves could be sent as their own text, a comma by itself cannot hold them together.',
        'You need a comma plus a joining word that matches the meaning. An almost-empty table would not cause the bake sale to earn more money, so the joining word has to signal a surprise, not a cause.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-correct-one',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The library ran out of graphic novels I put my name on the waiting list instead.' },
        { id: 'b', text: 'The library ran out of graphic novels, so I put my name on the waiting list instead.', correct: true },
        { id: 'c', text: 'Because the library ran out of graphic novels. I put my name on the waiting list instead.' },
        { id: 'd', text: 'The library ran out of graphic novels, I put my name on the waiting list instead.' },
      ],
      expectedAnswer: 'The library ran out of graphic novels, so I put my name on the waiting list instead.',
      hints: [
        'Test each option by covering everything except one side of its punctuation mark: is what is left, taken alone, a complete sentence?',
        'A comma alone cannot hold two complete sentences apart, and a starter word like "Because" needs a complete sentence attached to it — not a period right after it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-however-fixes-everything',
      kind: 'misconception_check',
      question:
        'A student writes "The gym floor was still wet, however, we practiced free throws in the hallway instead." and says the comma right before however already fixes everything. Is the student right?',
      commonErrors: [
        {
          answer: 'Yes, because there is already a comma before however, so the sentence is fixed.',
          misconception:
            'Treating "however" as a joining word like and, but or so, when it only signals a turn and cannot hold two complete sentences apart by itself. A comma is not strong enough there either way.',
          correctsTo:
            'Test both sides of "however": "The gym floor was still wet" and "we practiced free throws in the hallway instead" are both complete sentences, so a comma splice sits on each side of it. The fix is a period or a semicolon right before however, not a comma. CORRECT: "The gym floor was still wet. However, we practiced free throws in the hallway instead." However tells the reader a turn is coming; it does not do the job of holding two sentences together.',
        },
        {
          answer: 'No, and the whole sentence should be rewritten without however.',
          misconception:
            'Assuming the only fix is to delete the transition word instead of fixing the punctuation around it.',
          correctsTo:
            'However is not the problem — the punctuation in front of it is. Keep the word and fix the boundary: a period or a semicolon comes right before however, and a comma comes right after it. CORRECT: "The gym floor was still wet. However, we practiced free throws in the hallway instead." The word survives; only the punctuation around it needs to change.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every complete sentence needs a subject, a verb and a finished thought — run that test on anything you are unsure about.',
        'A starter word such as because, although, when or since leaves a thought unfinished until it is attached to a complete sentence. WRONG: "Because the printer jammed again." CORRECT: "Because the printer jammed again, the flyers came out late."',
        'Two complete sentences with nothing between them is a run-on; with only a comma between them it is a comma splice.',
        'Legal fixes: a period, a semicolon between two closely related sentences, or a comma plus a joining word that matches the meaning — for, and, nor, but, or, yet, so.',
        'A transition word such as however is not a joining word. It needs a period or a semicolon in front of it, not just a comma.',
        'Length proves nothing. Count the complete thoughts, not the words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Sentence Fragments & Run-Ons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
