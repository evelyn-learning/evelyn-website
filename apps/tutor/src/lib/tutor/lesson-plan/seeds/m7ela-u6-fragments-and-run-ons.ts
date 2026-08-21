/**
 * Grade 7 ELA — Sentence Structure: Fragments & Run-Ons.
 *
 * The procedure-led exemplar for the m7ela course (CCSS L.7.1c). One test
 * runs the whole lesson: subject, verb, finished thought. The three traps it
 * is built to kill are the stranded "Because ..." clause, the comma splice,
 * and the belief that sentence LENGTH is what makes a run-on.
 *
 * NOTE FOR FUTURE AUTHORS: every ungrammatical example in this file is
 * explicitly labeled WRONG, with the CORRECT version beside it. A tutor
 * reads these aloud, and an unlabeled fragment would be presented to the
 * student as a model sentence. Never write a broken example bare.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U6_FRAGMENTS_AND_RUN_ONS: LessonPlan = {
  id: 'evelyn.ms.m7ela.fragments-and-run-ons.v1',
  title: 'Fragments & Run-Ons',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.fragments-and-run-ons',
      standard: 'M7ELA-6.3',
      description:
        'Recognize sentence fragments, run-on sentences and comma splices, and correct each one by supplying the missing part or by repairing the boundary between two independent clauses (CCSS L.7.1c).',
    },
  ],
  prerequisites: ['m7ela.sentence-types-and-combining'],
  followUps: ['m7ela.commas-and-end-punctuation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the three-part test in messages the student sends every day.',
      script:
        'Think about the last group chat you were in. Somebody types "Because the bus" and then stops. You are left staring at your phone waiting for the rest, because that message did not finish. Somebody else sends one message with four whole thoughts crammed into it and no punctuation anywhere, and you have to read it three times to find where each thought ends. Those are the exact two problems we are fixing today. One stops too early. The other never stops at all. There is a three-part test that catches both of them, and it takes about five seconds to run.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sentence-boundaries',
      kind: 'concept',
      goal: 'Install the three-part test, name the two boundary errors, and give the three legal fixes.',
      keyIdeas: [
        'EVERY SENTENCE NEEDS THREE THINGS — a subject (who or what it is about), a verb (what they do or are), and a finished thought. Run the test on any group of words and you will know immediately whether it is a sentence. "The dog barked" passes all three, and it is only three words long.',
        'A FRAGMENT IS MISSING ONE OF THE THREE. The kind you will write most often has a subject and a verb but never finishes the thought, because a starter word is holding it open. Those starter words are because, although, when, since, if, while, after, unless and before. WRONG: "Because the bus was late." CORRECT: "Because the bus was late, we missed the first song." The starter word makes the clause dependent, so it has to lean on a complete sentence.',
        'A RUN-ON JAMS TWO SENTENCES TOGETHER WITH NOTHING BETWEEN THEM. WRONG: "The bus was late we missed the first song." A COMMA SPLICE does the same thing with only a comma, which is not strong enough to hold two sentences apart. WRONG: "The bus was late, we missed the first song." Both are the same mistake about where one thought ends.',
        'THERE ARE THREE LEGAL FIXES for a run-on or a splice, and all three are correct. Use a period: "The bus was late. We missed the first song." Use a semicolon: "The bus was late; we missed the first song." Use a comma PLUS a joining word from for, and, nor, but, or, yet, so: "The bus was late, so we missed the first song." Pick whichever fits the meaning best.',
        'LENGTH IS NOT THE TEST. A very long sentence can be perfectly correct, and a three-word one can be a fragment. The only question is how many complete thoughts are inside and what is sitting between them. Never "fix" a sentence just because it looks long.',
        'HOWEVER AND THEREFORE ARE NOT JOINING WORDS. They are transition words, and a comma in front of one does not repair a splice. WRONG: "The bus was late, however, we still got in." CORRECT: "The bus was late; however, we still got in." A semicolon does the holding; however only signals the turn.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a clause held open by a starter word such as because or although, so it cannot stand alone.' },
        { term: 'fragment', definition: 'a group of words punctuated as a sentence that is missing a subject, a verb or a finished thought.' },
        { term: 'run-on', definition: 'two independent clauses joined with no punctuation at all.' },
        { term: 'comma splice', definition: 'two independent clauses joined with only a comma.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-repair-fragment',
      kind: 'worked_example',
      problem:
        'Fix this. "Although the practice ran twenty minutes long. Coach still let us shoot free throws."',
      steps: [
        'Run the three-part test on the first group. Subject: the practice. Verb: ran. Finished thought? No. The word "Although" is holding it open, so you are still waiting for what happened despite the practice running long.',
        'That makes group one a dependent clause, and a dependent clause punctuated as its own sentence is a fragment. WRONG: "Although the practice ran twenty minutes long."',
        'Now test group two. Subject: Coach. Verb: let. Finished thought? Yes. So group two is already a complete sentence and needs no repair.',
        'The fix is to stop separating them. A dependent clause that comes FIRST attaches to the sentence after it with a comma. CORRECT: "Although the practice ran twenty minutes long, Coach still let us shoot free throws."',
        'A second correct fix is to flip the order, and then no comma is needed: "Coach still let us shoot free throws although the practice ran twenty minutes long."',
        'One fix that does NOT work is a semicolon. WRONG: "Although the practice ran twenty minutes long; Coach still let us shoot free throws." A semicolon needs a complete sentence on its left, and there is not one there.',
      ],
      answer:
        'Although the practice ran twenty minutes long, Coach still let us shoot free throws. (Also correct: Coach still let us shoot free throws although the practice ran twenty minutes long.)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-splice',
      kind: 'worked_example',
      problem:
        'Fix this three different ways. "My brother borrowed my headphones, he left them at his friend\'s house."',
      steps: [
        'Cover everything after the comma and read what is left: "My brother borrowed my headphones." Subject, verb, finished thought. That is a complete sentence.',
        'Now cover everything before the comma: "he left them at his friend\'s house." Subject, verb, finished thought. Also a complete sentence.',
        'Two complete sentences with only a comma between them is a comma splice. WRONG: "My brother borrowed my headphones, he left them at his friend\'s house."',
        'Fix one, the period. Fully separate them: "My brother borrowed my headphones. He left them at his friend\'s house."',
        'Fix two, the semicolon. Use it when the two thoughts belong tightly together: "My brother borrowed my headphones; he left them at his friend\'s house."',
        'Fix three, the comma plus a joining word. This one is the best here, because it also says HOW the ideas connect: "My brother borrowed my headphones, and he left them at his friend\'s house." Even better for the meaning: "My brother borrowed my headphones, but he left them at his friend\'s house."',
        'Deleting the comma is not a fourth fix. WRONG: "My brother borrowed my headphones he left them at his friend\'s house." That turns a comma splice into a run-on, which is the same error wearing less punctuation.',
      ],
      answer:
        'Any of these three: "My brother borrowed my headphones. He left them at his friend\'s house." / "My brother borrowed my headphones; he left them at his friend\'s house." / "My brother borrowed my headphones, but he left them at his friend\'s house."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fix-splice',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the sentence? "The rink closes at eight on weeknights, we got there at ten past."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The rink closes at eight on weeknights, so we got there at ten past.' },
        { id: 'b', text: 'The rink closes at eight on weeknights, but we got there at ten past.', correct: true },
        { id: 'c', text: 'The rink closes at eight on weeknights we got there at ten past.' },
        { id: 'd', text: 'The rink closes at eight on weeknights, however, we got there at ten past.' },
      ],
      expectedAnswer: 'The rink closes at eight on weeknights, but we got there at ten past.',
      hints: [
        'Cover each side of the comma and read it alone. If both halves could be sent as their own message, a comma by itself cannot hold them together.',
        'You need a comma plus a joining word from for, and, nor, but, or, yet, so — and the joining word has to match the meaning. Arriving late was not caused by the closing time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fix-fragment',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the fragment? "Since nobody signed up for the bake sale. Ms. Ortiz moved it to next Friday."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Since nobody signed up for the bake sale, Ms. Ortiz moved it to next Friday.', correct: true },
        { id: 'b', text: 'Since nobody signed up for the bake sale; Ms. Ortiz moved it to next Friday.' },
        { id: 'c', text: 'Since nobody signed up for the bake sale, and Ms. Ortiz moved it to next Friday.' },
        { id: 'd', text: 'Since nobody signed up for the bake sale Ms. Ortiz moved it to next Friday.' },
      ],
      expectedAnswer: 'Since nobody signed up for the bake sale, Ms. Ortiz moved it to next Friday.',
      hints: [
        'Read the first group alone: "Since nobody signed up for the bake sale." Does it finish the thought, or leave you waiting?',
        'The word "Since" makes that clause dependent, so it attaches to the complete sentence after it. A semicolon needs a complete sentence on its LEFT, and a joining word is only for two independent clauses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-correct-one',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My cousin taught me three card tricks over winter break, I still cannot do the last one.' },
        { id: 'b', text: 'My cousin taught me three card tricks over winter break I still cannot do the last one.' },
        { id: 'c', text: 'My cousin taught me three card tricks over winter break; I still cannot do the last one.', correct: true },
        { id: 'd', text: 'Even though my cousin taught me three card tricks over winter break. I still cannot do the last one.' },
      ],
      expectedAnswer: 'My cousin taught me three card tricks over winter break; I still cannot do the last one.',
      hints: [
        'Three of these commit one of the errors from this lesson. Test both halves of each option: complete sentence, or not?',
        'Option a joins two complete sentences with only a comma, option b joins them with nothing, and option d strands an "Even though" clause as its own sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-length-equals-run-on',
      kind: 'misconception_check',
      question:
        'A student says that "On Saturday morning my whole family drove out to the lake with two coolers, four folding chairs and a very unhappy cat." is a run-on, because it is long. Are they right?',
      commonErrors: [
        {
          answer: 'Yes, it is a run-on because it is too long.',
          misconception:
            'Using sentence LENGTH as the test instead of counting complete thoughts. Long sentences feel wrong, so the student flags them.',
          correctsTo:
            'Count the complete thoughts instead. This sentence has one subject (my whole family), one verb (drove), and one finished thought. Everything else is a list of what they brought. One complete thought is one sentence, however long it runs, so this sentence is correct exactly as written. A run-on needs TWO complete thoughts with nothing between them.',
        },
        {
          answer: 'No, and short groups of words are always fine.',
          misconception:
            'Flipping the same mistake over — believing that if long does not mean run-on, then short must mean correct.',
          correctsTo:
            'Length does not decide anything in either direction. "The dog barked." is three words and a perfectly good sentence. WRONG: "Because the dog barked." is four words and a fragment, because the starter word leaves the thought open. Run the three-part test every time: subject, verb, finished thought.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Run the three-part test on anything you are unsure about: subject, verb, finished thought.',
        'A starter word such as because, although, when or since holds a thought open. WRONG: "Because the bus was late." CORRECT: "Because the bus was late, we missed the first song."',
        'Two complete sentences with nothing between them is a run-on; with only a comma between them it is a comma splice.',
        'Three legal fixes, all correct: a period, a semicolon, or a comma plus for, and, nor, but, or, yet, so.',
        'However and therefore are not joining words. A comma in front of one does not repair a splice; a semicolon does.',
        'Length proves nothing. Count the complete thoughts, not the words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Fragments & Run-Ons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
