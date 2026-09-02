/**
 * Grade 6 ELA — Sentence Fluency, Style & Punctuation: Commas for Extra
 * Information.
 *
 * PROCEDURE-LED lesson for the m6ela fan-out (CCSS L.6.2a). One repeatable
 * move carries the whole lesson: run the removal test on the part of the
 * sentence in question — cover it with your thumb, and ask whether what is
 * left still identifies the exact same person, place or thing. If yes, that
 * part is nonrestrictive or parenthetical and gets set off with a matching
 * pair of commas, parentheses, or dashes. If no, that part is restrictive,
 * the sentence needs it, and it takes no comma at all. "My brother Daniel
 * plays trumpet" and "My brother, Daniel, plays trumpet" are the same words
 * in the same order; only the test result — and the commas that follow from
 * it — say whether the speaker has one brother or several.
 *
 * SCOPE GUARD: Grade 6 row 6.3 teaches exactly one punctuation job: setting
 * off a nonrestrictive or parenthetical element with a comma pair, a
 * parenthesis pair, or a dash pair, decided by the removal test.
 * DELIBERATELY EXCLUDED: sentence fragments and run-ons and the tests that
 * repair them (row 6.1); varying sentence length and opening for style
 * (row 6.2); keeping one piece of writing's formality and tone consistent
 * from start to finish (row 6.4); and every other comma job Grade 7's
 * fuller punctuation lesson teaches under L.7.2 — commas between items in a
 * list, a comma after a word or phrase that runs ahead of the main
 * sentence, the comma before a joining word linking two complete sentences,
 * the comma between a pair of adjectives that each describe a noun on
 * their own, and the apostrophe rules for ownership and for "it's" versus
 * "its". None of those other jobs, or their names, appear anywhere in this
 * file; the shipped m7ela-u6-commas-and-end-punctuation.ts already teaches
 * all of them, including this same nonrestrictive-element job as one of
 * its five, at Grade 7 depth. DELIBERATELY ALLOWED: this row necessarily
 * writes ordinary possessive nouns to build sentences at all ("Elena's
 * aunt", "Ms. Ortiz's club"), and that everyday apostrophe use is not this
 * lesson's subject and is never taught, tested, or drawn attention to
 * here. This row is also, unavoidably, a strict subset of the one Grade 7
 * job it shares a name with — the same removal test taught here is one of
 * the five jobs Grade 7 folds together — and that overlap is the intended
 * spiral, not a defect: Grade 6 masters the one job in isolation before
 * Grade 7 asks a student to juggle it alongside four others.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item — an invented sibling, an invented aunt, an
 * invented classroom pet, an invented after-school club. This course
 * carries no passage machinery: no passageId, no shared texts. Every
 * ungrammatical example that appears in the tutor's own explaining prose
 * (steps, keyIdeas, the recap) is labeled WRONG beside its CORRECT repair,
 * because a tutor reads these lines aloud and an unlabeled half-finished
 * comma pair would be handed to the student as a model sentence. The only
 * unlabeled incorrect forms in this file are the MCQ distractors the three
 * try_yourself items ask the student to reject, which is exactly what
 * those items are for; each one is then named in its hints or in the
 * misconception check.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is an invented,
 * fictional scenario (a sibling, an aunt, a classroom pet, a teacher's
 * after-school club), true by construction, so there is no real-world
 * factual claim to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U6_COMMAS_FOR_NONRESTRICTIVE_AND_PARENTHETICAL_ELEMENTS: LessonPlan = {
  id: 'evelyn.ms.m6ela.commas-for-nonrestrictive-and-parenthetical-elements.v1',
  title: 'Commas for Extra Information',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements',
      standard: 'M6ELA-6.3',
      description:
        'Set off a nonrestrictive or parenthetical element — information a sentence does not need in order to keep its core meaning — using a comma, a pair of parentheses, or a pair of dashes, deciding with the removal test: cover the part in question and ask whether the sentence still identifies the exact same person, place, or thing without it (CCSS L.6.2a).',
    },
  ],
  prerequisites: ['m6ela.varying-sentence-patterns-for-style'],
  followUps: ['m6ela.maintaining-consistent-style-and-tone'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two commas can change a fact about the world without changing a single word of the sentence.',
      script:
        'You tell a friend, "My brother Daniel plays trumpet in the school band." No comma anywhere near the name, and the sentence makes total sense, as long as you have more than one brother, because the name Daniel is telling your friend exactly which brother you mean. Now imagine you have only one brother. The exact same words, with two commas added, say something different: "My brother, Daniel, plays trumpet in the school band." Same words, same order, but now the sentence works even if your friend never learns your brother has a name at all, because "my brother" was already enough to identify him. Two commas just told your friend how many brothers you have, without changing a single word of the sentence itself. Today you learn one test that tells you, every single time, whether those two commas, or a pair of dashes, or a pair of parentheses, belong in a sentence like that.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-removal-test-and-matching-marks',
      kind: 'concept',
      goal: 'Install the restrictive/nonrestrictive distinction, the removal test, the three matching marks, and the pairing rule as one ordered procedure.',
      keyIdeas: [
        'RESTRICTIVE INFORMATION IS INFORMATION THE SENTENCE NEEDS; NONRESTRICTIVE INFORMATION IS EXTRA. "My brother Daniel plays trumpet" with no comma means Daniel is naming which brother, among more than one. "My brother, Daniel, plays trumpet" with a comma pair means "my brother" already identifies one person, and the name is just extra information added on the side. The words never change. Only the commas do, and the commas are telling the reader how many brothers there are.',
        'THE REMOVAL TEST IS THE WHOLE PROCEDURE. Cover the part in question with your thumb and read what is left. If the sentence still points to the exact same person, place, or thing, the covered part is nonrestrictive and gets set off. If covering it leaves you unsure who or what is meant, the covered part is restrictive, the sentence needs it, and it takes no comma at all.',
        'THREE MATCHING MARKS DO THE SAME JOB. A pair of commas is the most common choice. A pair of parentheses sets extra information off quietly, like a side note. A pair of dashes sets it off loudly, for something the writer wants to stand out. Pick one pair for a given sentence, and use the SAME mark on both sides — never open with a comma and close with a dash.',
        'A MARK IN THE MIDDLE ALWAYS NEEDS A PARTNER. When nonrestrictive information sits in the middle of a sentence, it needs a mark before it AND a mark after it. WRONG: "My teacher, Ms. Alvarez teaches two science classes." CORRECT: "My teacher, Ms. Alvarez, teaches two science classes." When the extra information sits at the very end of the sentence, one mark before it is enough, because the period finishes the job: "She waved to her best friend, Priya."',
        'THE EXTRA PART CAN BE ONE WORD OR A WHOLE CLAUSE. "My dog, Biscuit," sets off a single name. "The library, which just reopened its comics section," sets off a whole clause. The removal test works exactly the same way no matter how long the extra part is: cover it, and check whether the sentence still points to the same thing.',
      ],
      vocabulary: [
        { term: 'nonrestrictive element', definition: 'information a sentence does not need in order to identify what it is talking about.' },
        { term: 'restrictive element', definition: 'information a sentence does need, because without it, the reader cannot tell what or who is meant.' },
        { term: 'parenthetical element', definition: 'a nonrestrictive comment or aside dropped into the middle of a sentence, as if in a whisper.' },
        { term: 'appositive', definition: 'a word or short phrase placed next to a noun that renames or identifies it, such as "Daniel" in "my brother, Daniel,".' },
        { term: 'dash', definition: 'a long mark, used in a matching pair, that sets off extra information more forcefully than a comma does.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-drop-test-changing-fact',
      kind: 'worked_example',
      problem:
        'Punctuate this sentence correctly for the fact given, then explain why.\n\nFact: Mateo has two dogs.\nSentence: "Mateo\'s dog Biscuit knows three tricks."',
      steps: [
        'Run the removal test on the name Biscuit. Cover it with your thumb and read what is left: "Mateo\'s dog knows three tricks." Because Mateo has two dogs, that sentence no longer tells you which dog knows the tricks.',
        'Since covering "Biscuit" changes which dog the sentence points to, the name is restrictive information the sentence needs to identify the right dog. Restrictive information takes no commas at all.',
        'CORRECT: "Mateo\'s dog Biscuit knows three tricks." Leave the sentence exactly as it is written — the name is doing necessary identifying work.',
        'Now change the fact: Mateo has only one dog. Run the exact same removal test on the exact same words. Cover "Biscuit": "Mateo\'s dog knows three tricks." This time, since there is only one dog, the sentence still points to the same animal without the name.',
        'Since covering "Biscuit" this time changes nothing about which dog is meant, the name is now nonrestrictive: extra information the writer chose to add. Nonrestrictive information gets set off with a matching pair of marks.',
        'CORRECT for one dog: "Mateo\'s dog, Biscuit, knows three tricks." Same words, same order. Only the commas changed, and they changed because the fact behind the sentence changed.',
      ],
      answer:
        'With two dogs: "Mateo\'s dog Biscuit knows three tricks." (no commas, because the name identifies which dog). With one dog: "Mateo\'s dog, Biscuit, knows three tricks." (a comma pair, because the name is extra).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pair-rule-and-matching-marks',
      kind: 'worked_example',
      problem:
        'Fix each sentence so its extra information is set off correctly, and name the rule that catches the mistake.\n\nFact 1: Ms. Alvarez is the only science teacher the speaker has.\nSentence 1: "My teacher, Ms. Alvarez teaches two science classes."\n\nFact 2: There is only one library the speaker means.\nSentence 2: "The library which just added a whole shelf of comics closes at six on Fridays."',
      steps: [
        'Sentence 1. The name "Ms. Alvarez" sits in the middle of the sentence. Run the removal test: cover the name and read "My teacher teaches two science classes." Because Ms. Alvarez is the only science teacher the speaker has, that sentence still points to the same person, so the name is nonrestrictive.',
        'WRONG: "My teacher, Ms. Alvarez teaches two science classes." A comma opens the extra information but nothing closes it, so the sentence never finishes marking it off.',
        'CORRECT: "My teacher, Ms. Alvarez, teaches two science classes." Now a comma sits on both sides of the name, opening the extra information and closing it again.',
        'Sentence 2. This time the extra information is a whole clause, not a single name: "which just added a whole shelf of comics." Cover the clause and read what is left: "The library closes at six on Fridays." Because there is only one library the speaker means, the sentence still points to the same place without the clause, so the clause is nonrestrictive too.',
        'WRONG: "The library which just added a whole shelf of comics closes at six on Fridays." No mark opens or closes the clause, so a reader cannot tell where the extra part starts and stops.',
        'CORRECT with commas: "The library, which just added a whole shelf of comics, closes at six on Fridays." CORRECT with dashes instead: "The library — which just added a whole shelf of comics — closes at six on Fridays." Both are right, because commas and dashes do the same job here. What is never right is opening the pair with one kind of mark and closing it with a different kind.',
      ],
      answer:
        'Sentence 1: "My teacher, Ms. Alvarez, teaches two science classes." (a comma is needed on both sides of mid-sentence extra information). Sentence 2: "The library, which just added a whole shelf of comics, closes at six on Fridays." — or the same sentence with a matching pair of dashes in place of the commas.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-aunt-appositive',
      kind: 'try_yourself',
      problem: 'Elena has only one aunt, and her name is Carmen. Which sentence correctly reports that fact?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Elena\'s aunt Carmen brought a whole box of ripe mangoes to the family cookout last weekend.',
        },
        {
          id: 'b',
          text: 'Elena\'s aunt, Carmen, brought a whole box of ripe mangoes to the family cookout last weekend.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Elena\'s aunt, Carmen brought a whole box of ripe mangoes to the family cookout last weekend.',
        },
        {
          id: 'd',
          text: 'Elena\'s aunt Carmen, brought a whole box of ripe mangoes to the family cookout last weekend.',
        },
      ],
      expectedAnswer: 'Elena\'s aunt, Carmen, brought a whole box of ripe mangoes to the family cookout last weekend.',
      hints: [
        'Run the removal test on the name Carmen. Elena has only one aunt, so does covering the name change who the sentence is talking about?',
        'The name is extra information, so it needs a mark right before it and a mark right after it, not just one side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-class-pet-clause',
      kind: 'try_yourself',
      problem:
        'Room 14 has only one class pet. Which sentence correctly punctuates the extra clause about how long it has lived in the room?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The class pet — which has lived in the room since September, needs fresh water every single day.',
        },
        {
          id: 'b',
          text: 'The class pet, which has lived in the room since September needs fresh water every single day.',
        },
        {
          id: 'c',
          text: 'The class pet, which has lived in the room since September, needs fresh water every single day.',
          correct: true,
        },
        {
          id: 'd',
          text: 'The class pet which has lived in the room since September needs fresh water every single day.',
        },
      ],
      expectedAnswer: 'The class pet, which has lived in the room since September, needs fresh water every single day.',
      hints: [
        'Room 14 has only one class pet, so ask whether removing the clause about September changes which animal the sentence means.',
        'Whichever mark opens the clause has to be the exact same mark that closes it. A dash on one side and a comma on the other is never a matching pair.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-debate-team-dashes',
      kind: 'try_yourself',
      problem:
        "Ms. Ortiz runs exactly one after-school club: the debate team. She wants the sentence below to set that fact off with a matching pair of dashes instead of commas. Which version is correctly punctuated?",
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Ms. Ortiz\'s club — the debate team, meets every Tuesday in the library after the final bell.',
        },
        {
          id: 'b',
          text: 'Ms. Ortiz\'s club, the debate team — meets every Tuesday in the library after the final bell.',
        },
        {
          id: 'c',
          text: 'Ms. Ortiz\'s club the debate team meets every Tuesday in the library after the final bell.',
        },
        {
          id: 'd',
          text: 'Ms. Ortiz\'s club — the debate team — meets every Tuesday in the library after the final bell.',
          correct: true,
        },
      ],
      expectedAnswer: 'Ms. Ortiz\'s club — the debate team — meets every Tuesday in the library after the final bell.',
      hints: [
        'Ms. Ortiz has only one club, so its name is extra information that needs to be set off, not left bare.',
        'The stem asks for dashes specifically, so both marks around the extra part need to be dashes, not a dash on one side and a comma on the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-fence',
      kind: 'misconception_check',
      question:
        'A student punctuates a sentence as "My friend, Noah plays the drums" and explains it this way: "I put a comma there because there is a pause before the name." Noah is the only friend the speaker is talking about. What has gone wrong?',
      commonErrors: [
        {
          answer: 'My friend, Noah plays the drums.',
          misconception:
            'Using a comma to mark a pause instead of running the removal test, and only doing half the job. The student heard a pause going into the name but did not notice that nonrestrictive information in the middle of a sentence needs a mark on the way out again as well.',
          correctsTo:
            'A comma is not there to mark a breath. It is there because the removal test says the name is extra. Cover "Noah" and read "My friend plays the drums." Since Noah is the only friend the speaker means, that still points to the same person, so "Noah" is nonrestrictive and belongs inside a matching pair. Because the name sits in the middle of the sentence, it needs a mark on both sides: "My friend, Noah, plays the drums."',
        },
        {
          answer: 'My friend Noah, plays the drums.',
          misconception:
            'Believing the comma belongs on whichever side sounds like a pause, and placing it after the name instead of before it, so the sentence marks an ending for extra information it never marked the start of.',
          correctsTo:
            'A pair means both sides get marked, and the marks go around the extra information, not on just one edge of it. Since "Noah" sits in the middle of the sentence and passes the removal test, it needs a comma right before it and right after it: "My friend, Noah, plays the drums." A single comma on either side alone is never a finished pair.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Nonrestrictive information is extra: the sentence still names the same thing without it. Restrictive information is not extra: take it away and the reader loses track of who or what is meant.',
        'Run the removal test: cover the part in question and read what is left. If it still points to the exact same person, place, or thing, the part is nonrestrictive and needs to be set off.',
        'Three marks do the same job: a pair of commas, a pair of parentheses, or a pair of dashes. Use the same mark on both sides. Never mix a comma with a dash in one pair.',
        'Nonrestrictive information in the middle of a sentence needs a mark on both sides. WRONG: "My teacher, Ms. Alvarez teaches two science classes." CORRECT: "My teacher, Ms. Alvarez, teaches two science classes."',
        'The test works the same whether the extra part is one word or a whole clause.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Commas for Extra Information' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
