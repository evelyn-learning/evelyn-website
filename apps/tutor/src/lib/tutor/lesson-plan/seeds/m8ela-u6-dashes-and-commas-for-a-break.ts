/**
 * Grade 8 ELA — Sentence Style & Punctuation: Dashes & Commas for a Break.
 *
 * PROCEDURE-LED (CCSS L.8.2a). One repeatable move carries the lesson: at a
 * BREAK, run two questions in order — could the words before the mark stand
 * alone as their own sentence, and could the words after it stand alone? The
 * second question decides which marks are legal; only then does the effect
 * wanted decide between them. A single dash makes a hard stop and throws the
 * weight onto what follows; a comma makes a soft pause and keeps the sentence
 * moving. Four traps this plan is built to kill: choosing the mark by how
 * long the pause sounds when read aloud; a comma left holding two complete
 * thoughts (the comma splice, which no amount of breathing makes legal); a
 * dash placed after a clause that cannot stand alone; and a dash spent on
 * something small, which promises weight the words after it do not carry.
 *
 * SCOPE GUARD: Grade 8 row 6.3 teaches exactly one decision. Where a sentence
 * makes a break after a complete thought, use a SINGLE dash for an abrupt
 * break or a sharp emphasis, or a comma for a softer pause, and choose
 * between them by the effect wanted. Builds on
 * `m7ela-u6-commas-and-end-punctuation.ts` (L.7.2: the five comma jobs —
 * series, introductory element, joining two sentences, extra information with
 * the removal test, coordinate adjectives — plus apostrophes) and on G6's
 * `m6ela-u6-commas-for-nonrestrictive-and-parenthetical-elements.ts` (L.6.2a:
 * a PAIR of commas, parentheses, or dashes to set off extra information). G8
 * re-teaches none of those jobs; it adds the single dash for a break and the
 * pause comma. Stops short of HS `engl-u3-dashes-parentheses-quotation.ts`
 * (L.9-10.2b: matched pairs never mixed; quotation-mark punctuation) and
 * `engl-u3-semicolons-and-colons.ts` (L.9-10.2a).
 *
 * DELIBERATELY EXCLUDED: the ellipsis, which is row 6.4 — no spoken or
 * student-facing field in this file names it or prints three periods, and the
 * word "ellipsis" occurs exactly once below this comment, inside the
 * `followUps` loId that points at that row; parentheses as a mark a writer
 * may choose, which belong to G6's pair job and to the HS row — the word
 * "parentheses" does not occur below this comment at all; the colon as a mark
 * to be taught, which is HS `engl-u3-semicolons-and-colons.ts`'s — the word
 * "colon" is never used below this comment, and the colon appears there only
 * as ordinary punctuation in the tutor's own sentences, never as a mark the
 * lesson names, models or asks for; matched PAIRS of dashes, which are G6's
 * and HS's — no SENTENCE below this comment contains two em dashes, so
 * nothing here models a dash pair (three strings do carry two, always in
 * separate sentences); and repairing an inappropriate shift in verb voice or
 * verb mood (row 6.1) and choosing a verb form for a stated effect (row 6.2),
 * the two rows immediately before this one — no sentence below this comment
 * names verb voice, verb mood, the active or the passive, and the word
 * "voice" occurs there twice, once in the `prerequisites` loId and once in
 * the hook in the everyday sense of the reader's own speaking voice, and the
 * word "mood" occurs there once, in that same loId.
 *
 * DELIBERATELY ALLOWED, because the G7 row sits directly under this one and
 * the G7 run-on row supplies the only reason a comma can be illegal at a
 * break: (a) the COMMA SPLICE and the three legal joins from
 * `m7ela-u6-fragments-and-run-ons.ts` (L.7.1c) are NAMED wherever the words
 * after a break are themselves a complete thought, because that is what takes
 * the comma off the table and leaves the dash as the only one of this row's
 * two marks that can hold them; the semicolon is named only inside that
 * one-line reminder that a period, a semicolon, or a comma with a joining
 * word would also be correct, and no sentence in this file explains, models
 * or asks for one, and no keyIdea walks the three fixes; (b) G7's
 * introductory-element comma appears as the repair in one worked-example
 * step, in that same worked example's answer, in one misconception correction
 * and in one recap line, always for a dash placed after a clause that cannot
 * stand alone — four places in all, and a one-line reuse of a comma job the
 * student already has, which is what makes this row's "complete thought
 * first" rule bite; (c) the G7 vocabulary is used and never renamed: "starter
 * word", "subject-verb pair", "independent clause"; (d) every dash printed
 * below this comment, in the tutor's own prose as well as in the specimens,
 * is the em dash (U+2014) with a space on each side, matching every one of
 * the em dashes in the shipped m6ela, m7ela and m8ela seed bodies, all of
 * which are spaced. This row TEACHES the dash, so an ASCII substitute would
 * print the wrong glyph for the thing being taught. That also governs
 * `los[0].description`, which keeps a real em dash rather than the ` -- ` the
 * fan-out contract asks for elsewhere: the description is the student-facing
 * objective of the dash lesson, none of the 80 shipped m6ela and m7ela
 * descriptions uses ` -- `, and 24 of them use an em dash.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence and every specimen in this file is
 * original prose written for the item — invented tryouts, an invented winter
 * concert, an invented fundraiser, an invented game. This course carries no
 * passage machinery, no passageId and no shared texts, so each question must
 * be answerable from the words printed inside it. Every incorrect specimen in
 * the tutor's own prose is labeled WRONG with its CORRECT repair beside it,
 * because a tutor reads these lines aloud and an unlabeled comma splice would
 * be handed to the student as a model. The only unlabeled incorrect forms are
 * the try_yourself distractors the three items ask the student to reject,
 * each of which is named in that item's hints, and the two sentences quoted
 * inside the misconception_check question as a student's own work, both of
 * which are corrected in the commonErrors entry directly below them. Two
 * conventions specific to this row: where a step prints a specimen REWRITTEN
 * with the other mark, it says so in words first, because that new sentence
 * is a rewrite and not a quotation of the specimen; and the em dash is
 * subject matter here, so never run a general non-ASCII sweep over this file.
 *
 * CLAIM LEDGER: none required. Every specimen in this file is invented
 * narrative prose about invented school events, which is true by
 * construction, so there is no real-world factual claim to verify. Rows whose
 * passages are INFORMATIONAL (all of Units 3 and 4, and any other row needing
 * nonfiction) must carry the four-column claim ledger described in the
 * fan-out contract, with every row marked REAL-WORLD or STIPULATED, instead
 * of this line.
 *
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U6_DASHES_AND_COMMAS_FOR_A_BREAK: LessonPlan = {
  id: 'evelyn.ms.m8ela.dashes-and-commas-for-a-break.v1',
  title: 'Dashes & Commas for a Break',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.dashes-and-commas-for-a-break',
      standard: 'M8ELA-6.3',
      description:
        'Use a single dash for an abrupt break or a sharp emphasis after a complete thought, and a comma for a softer pause, and choose between them by the effect wanted — punctuation for a PAUSE or BREAK (CCSS L.8.2a).',
    },
  ],
  prerequisites: ['m8ela.voice-and-mood-for-effect'],
  followUps: ['m8ela.ellipsis-for-a-pause-or-an-omission'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Let the student hear that one mark, and nothing else, decides how hard a reader lands on the end of a sentence.',
      script:
        'Two people text you about tryouts, and they send the same five words. The first writes: "I made the team, barely." The second writes: "I made the team — barely." Read both out loud and listen to what your voice does. After the comma you barely slow down, and the last word slides in at the end like a shrug. After the dash you stop, and then that same word lands on its own, like the second half of a joke. Nothing changed except one mark. That mark is a decision somebody made about how hard you should land on the end of the sentence, and it is a decision you get to make in everything you write. Today you learn what a break is, which mark makes a soft one and which makes a hard one, and the one situation where the choice is not yours at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-break-and-its-two-marks',
      kind: 'concept',
      goal: 'Install the two-question check that decides which marks are legal, the hard stop of the dash against the soft pause of the comma, and the read-it-both-ways test for choosing between them.',
      keyIdeas: [
        'A BREAK IS A STOP INSIDE A SENTENCE, AFTER A COMPLETE THOUGHT. The sentence reaches a place where it could have ended, and then adds something: a turn, an afterthought, a detail that arrives late. "The bus was late again" is a complete thought. Add to it and you have made a break. "The bus was late again, the third time this week." "The bus was late again — the third time this week." Same words in the same order, and the only difference is the mark. That mark is the writer telling the reader how hard to land, and this lesson is about choosing it on purpose.',
        'THE DASH MAKES A HARD STOP AND THROWS THE WEIGHT ONTO WHAT FOLLOWS. A single dash after a complete thought tells the reader to stop here, and then hits them with the rest. "Nobody moved — not one person." It is the mark for an abrupt turn, a late reveal, or a sharp piece of emphasis, and it works because the reader has to come to a halt before the last words arrive. The dash is the long mark, longer than the hyphen inside a word like "well-known", and the dash you are learning here stands alone: it comes after a complete thought and needs no partner later in the sentence.',
        'THE COMMA MAKES A SOFT PAUSE AND KEEPS THE SENTENCE MOVING. With a comma the added words arrive in the same breath, quietly, without asking the reader to stop. "Ms. Reyes handed back the projects on Friday, one table at a time." Nothing is being announced. The detail slides in at the end and the sentence keeps its shape. This is the right choice far more often than the dash is, because most additions are not worth a full stop.',
        'ONE QUESTION DECIDES WHETHER YOU EVEN HAVE A CHOICE: COULD THE WORDS AFTER THE BREAK STAND ALONE AS THEIR OWN SENTENCE? If they could, a comma cannot hold them, and you already know that error by name. WRONG: "The gym was locked, nobody had the key." CORRECT: "The gym was locked — nobody had the key." A period, a semicolon, or a comma with a joining word would all be correct there too, and you already have all three. The dash is a fourth way, and it is the one that keeps both halves inside a single sentence and drops the second half on the reader. If the words after the break could NOT stand alone, both marks are legal and the effect decides.',
        'WHEN BOTH MARKS ARE LEGAL, CHOOSE BY THE EFFECT WANTED, AND TEST IT BY READING BOTH WAYS ALOUD. Say the sentence with a comma, then say it with a dash, and ask which one does what you want to the reader: keep moving, or stop and land. Two cautions go with the dash. It needs a complete thought in front of it, so a clause that begins with a starter word like "because" or "when" is not ready for one yet. And it gets its force from being rare, so a dash spent on something small promises weight the words after it do not carry.',
      ],
      vocabulary: [
        { term: 'break', definition: 'a stop inside a sentence, made after a complete thought, with something added on the other side of it.' },
        { term: 'dash', definition: 'the long mark that makes a break inside a sentence, longer than the hyphen inside a word like "well-known"; a single one after a complete thought marks an abrupt break or a sharp emphasis.' },
        { term: 'pause', definition: 'the softer stop a comma makes at a break, which lets the added words arrive without stopping the reader.' },
        { term: 'independent clause', definition: 'a group of words with a subject-verb pair that could stand alone as its own sentence; every break in this lesson comes after one.' },
        { term: 'comma splice', definition: 'the error of holding two independent clauses together with a comma alone; a single dash can hold them and a comma cannot.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-three-breaks',
      kind: 'worked_example',
      problem:
        'Each of these sentences makes a break after a complete thought. Say what the mark is doing to the reader, and say whether the writer could have used the other mark instead.\n\n(1) "The lock was already open — someone had been there before us."\n(2) "The gym filled up before six, mostly seventh graders."\n(3) "The whole front row stood up — every single one of them."',
      steps: [
        'Run two questions at every break, in this order. First: could the words BEFORE the mark stand alone as their own sentence? Second: could the words AFTER the mark stand alone as their own sentence? The second question is the one that decides which marks are legal, so answer it before you think about effect at all.',
        'Sentence 1, question one. "The lock was already open" has the subject "lock" and the verb "was", and it could stand alone. Question two. "someone had been there before us" has the subject "someone" and the verb "had been", and it could stand alone as well. Two complete thoughts, so the comma is off the table here. WRONG: "The lock was already open, someone had been there before us." CORRECT: "The lock was already open — someone had been there before us."',
        'That means the mark in sentence 1 was not a free choice between the two marks of this lesson. A period, a semicolon, or a comma with a joining word would each be correct, and you already know all three. What the dash adds is that both halves stay inside one sentence, and the reader comes to a full stop before "someone had been there before us" arrives. The stop is what makes the second half feel like a discovery.',
        'Sentence 2, question one. "The gym filled up before six" could stand alone. Question two. "mostly seventh graders" has no verb at all, so it could not. Both marks are legal here, and the writer chose the comma. Listen to what that buys: the detail arrives in the same breath, quietly, and the sentence keeps moving.',
        'Rewrite sentence 2 with the other mark to hear the difference. It would read: "The gym filled up before six — mostly seventh graders." Now the reader stops and lands hard on "mostly seventh graders", which is a small piece of information nobody needed to brace for. The dash is legal and it is still the wrong call, because it promises weight the words after it do not carry.',
        'Sentence 3, question one. "The whole front row stood up" could stand alone. Question two. "every single one of them" could not, so both marks are legal again. This time the dash is the right call, because the words after the break are there for emphasis and nothing else. Rewritten with a comma the sentence would read: "The whole front row stood up, every single one of them." Legal, and the emphasis goes soft. Sentences 2 and 3 have the same shape and take opposite marks, and only the effect wanted separates them.',
      ],
      answer:
        'Sentence 1: the dash is holding as well as breaking, because both halves are complete thoughts and a comma cannot join them. Sentence 2: the comma makes a soft pause so that "mostly seventh graders" arrives quietly, and a dash would be legal but would announce a small detail. Sentence 3: both marks are legal and the dash is chosen, because the reader is meant to stop and land on "every single one of them".',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-two-breaks',
      kind: 'worked_example',
      problem:
        'Two sentences from a student\'s story about a school fundraiser need work. Repair the break in each one, and say what decided the repair.\n\nSentence A: "We counted the cash box twice, the total was forty dollars short."\nSentence B: "Because the printer jammed twice — the posters went up a day late."',
      steps: [
        'Sentence A, question one. Before the comma, "We counted the cash box twice" has the subject "we" and the verb "counted", and it could stand alone.',
        'Sentence A, question two. After the comma, "the total was forty dollars short" has the subject "total" and the verb "was", and it could stand alone as well. Two complete thoughts held together by a comma alone is the comma splice, so the sentence is wrong as written. WRONG: "We counted the cash box twice, the total was forty dollars short."',
        'Now choose the repair by effect. The three fixes you already have are all correct here. The dash is the one that keeps both halves inside a single sentence and makes the reader stop before the bad news. CORRECT: "We counted the cash box twice — the total was forty dollars short." Read it aloud: the sentence comes to a full stop, and then the shortfall lands.',
        'Sentence B fails question one, which is why the dash cannot stay. "Because the printer jammed twice" has the subject "printer" and the verb "jammed", but the starter word "Because" holds the clause open, so it cannot stand by itself. A dash needs a complete thought in front of it, and there is not one here. WRONG: "Because the printer jammed twice — the posters went up a day late."',
        'The plain repair is the comma that closes off any element running ahead of the main sentence, which you already use every day. CORRECT: "Because the printer jammed twice, the posters went up a day late." Notice that this is not a break at all. Nothing was added after a complete thought; the sentence was only getting to its main clause.',
        'The other repair keeps the dash by giving it something to stand behind. Put the main clause first and let the reason arrive after the break. CORRECT: "The posters went up a day late — the printer jammed twice." Same two facts, and now the reason is the thing the sentence was driving at, which is the job the dash does best.',
      ],
      answer:
        'Sentence A becomes "We counted the cash box twice — the total was forty dollars short." A comma cannot hold two complete thoughts, and of the marks that can, the dash is the one that keeps both halves in one sentence and stops the reader before the shortfall. Sentence B has two repairs: "Because the printer jammed twice, the posters went up a day late." drops the dash and closes the opening clause with a comma, and "The posters went up a day late — the printer jammed twice." keeps the dash by putting a complete thought in front of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-punctuate-the-break',
      kind: 'try_yourself',
      problem:
        'A student is writing about the night of the winter concert. Which sentence punctuates the break correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stage lights came up at seven, the risers were still not straight.' },
        { id: 'b', text: 'The stage lights came up at seven — the risers were still not straight.', correct: true },
        { id: 'c', text: 'When the stage lights came up at seven — the risers were still not straight.' },
        { id: 'd', text: 'The stage lights came up at seven the risers were still not straight.' },
      ],
      expectedAnswer: 'The stage lights came up at seven — the risers were still not straight.',
      hints: [
        'Run the two questions in order, on every choice. Could the words before the mark stand alone as their own sentence? Could the words after it stand alone as well?',
        'Both halves here are complete thoughts, so a comma by itself cannot hold them, and running them together with no mark at all does not work either. Then look at the first word of each choice: one of them puts a starter word in front, which leaves the words before the mark unable to stand by themselves, and a dash has to have a complete thought in front of it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-mark-for-emphasis',
      kind: 'try_yourself',
      problem:
        'A student is finishing a paragraph about the last game of the season. She wants the final two words to land hard: the reader should come to a full stop and then hit those two words on their own.\n\nWhich version does that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'We lost by one point, in overtime.' },
        { id: 'b', text: 'We lost — by one point in overtime.' },
        { id: 'c', text: 'We lost by one point — in overtime.', correct: true },
        { id: 'd', text: 'We lost by one point in overtime.' },
      ],
      expectedAnswer: 'We lost by one point — in overtime.',
      hints: [
        'Decide first which mark makes a full stop rather than a soft pause. Then decide where in the sentence that mark has to sit for the right words to be the ones that land after it.',
        'One version uses the right mark in the wrong place, so the reader stops and then hears a whole phrase instead of the two words the writer wanted to land. Of the rest, one makes only a soft pause and one makes no break at all. Read every version aloud and listen for what arrives after the stop.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-quiet-mark',
      kind: 'try_yourself',
      problem:
        'A student is describing the moment she finally got home after a long day. She wants the last four words to arrive quietly, in the same breath, without making the reader stop.\n\nWhich version does that, and punctuates the break correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I dropped my bag by the door and sat down on the floor — still in my coat.' },
        { id: 'b', text: 'I dropped my bag by the door and sat down on the floor I was still in my coat.' },
        { id: 'c', text: 'I dropped my bag by the door and sat down on the floor, I was still in my coat.' },
        { id: 'd', text: 'I dropped my bag by the door and sat down on the floor, still in my coat.', correct: true },
      ],
      expectedAnswer: 'I dropped my bag by the door and sat down on the floor, still in my coat.',
      hints: [
        'The effect wanted is a quiet arrival with no stop, so start by deciding which mark makes a soft pause. Then check that the version you like is actually legal.',
        'Look at what sits after the mark in each version. Two of them turn the ending into a group of words that could stand alone as its own sentence, and neither a comma by itself nor no mark at all can hold two complete thoughts together. Of the two versions left, one stops the reader instead of letting the ending drift in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-breath-and-volume',
      kind: 'misconception_check',
      question:
        'A student punctuates two sentences and explains each choice. Sentence 1: "The heater was broken again, the classroom never got above sixty degrees." The student says: "A comma is fine there, because I would only take a small breath at that spot." Sentence 2: "We got to the field early — around four." The student says: "I used a dash because dashes are stronger, and I wanted that sentence to be strong." What has gone wrong with each explanation?',
      commonErrors: [
        {
          answer: 'A comma is fine there, because I would only take a small breath at that spot.',
          misconception:
            'Choosing the mark by how long the pause sounds instead of by what sits on each side of it. Reading a sentence aloud is a good habit, and the student is doing it, but the size of the pause is the LAST question at a break, never the first.',
          correctsTo:
            'Run the two questions first. Before the mark, "The heater was broken again" has a subject and a verb and could stand alone. After the mark, "the classroom never got above sixty degrees" could stand alone too. Two complete thoughts held together by a comma alone is the comma splice, and no amount of breathing makes it legal. WRONG: "The heater was broken again, the classroom never got above sixty degrees." CORRECT: "The heater was broken again — the classroom never got above sixty degrees." A period, a semicolon, or a comma with a joining word would each be correct here as well; the dash is the one that keeps both halves in a single sentence and drops the second half on the reader.',
        },
        {
          answer: 'I used a dash because dashes are stronger, and I wanted that sentence to be strong.',
          misconception:
            'Treating the dash as a volume knob that can be turned up on any sentence. The dash does make a hard stop, and that is exactly why it cannot go everywhere: its force comes from being rare and from having something after it that is worth stopping for.',
          correctsTo:
            'Ask what actually arrives after the break. Here it is "around four", a small piece of information nobody needs to brace for, so the dash promises weight and then does not deliver it. CORRECT: "We got to the field early, around four." Save the dash for a break where the words after it earn a full stop: "We got to the field early — the gate was still locked." One more thing worth checking whenever you reach for a dash is what sits in FRONT of it, because a dash needs a complete thought there. WRONG: "Because we got to the field early — the gate was still locked." CORRECT: "Because we got to the field early, the gate was still locked."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A break comes after a complete thought. Before you pick a mark, ask what could stand alone on each side of it.',
        'The dash makes a hard stop and throws the weight onto what follows. "Nobody moved — not one person."',
        'The comma makes a soft pause and keeps the sentence moving. "Ms. Reyes handed back the projects on Friday, one table at a time."',
        'If the words after the break could stand alone as their own sentence, a comma cannot hold them. WRONG: "The gym was locked, nobody had the key." CORRECT: "The gym was locked — nobody had the key." A period, a semicolon, or a comma with a joining word would be correct there too; the dash is the one that keeps both halves inside one sentence.',
        'If both marks are legal, choose by the effect wanted. Read the sentence both ways aloud and ask whether you want the reader to keep moving or to stop and land.',
        'A dash needs a complete thought in front of it, and it wears out fast. WRONG: "Because the printer jammed twice — the posters went up a day late." CORRECT: "Because the printer jammed twice, the posters went up a day late."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Dashes & Commas for a Break' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
