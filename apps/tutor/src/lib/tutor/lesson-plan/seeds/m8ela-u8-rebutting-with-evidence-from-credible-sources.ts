/**
 * Grade 8 ELA — Argument Writing: Rebutting with Evidence from Credible
 * Sources.
 *
 * Procedure-led writing row (CCSS W.8.1b), taught entirely by
 * revision-choice: there are no essay items in this course, so every
 * try_yourself prints a claim, a counterclaim, one or two named sources and
 * four candidate rebuttals, and the student picks the one that answers the
 * counterclaim with the evidence that can settle it, stated as the source
 * states it. The two worked examples do not offer candidates: the first
 * builds a rebuttal from a counterclaim and two sources, the second repairs
 * a weak draft. Four traps this plan is built to kill: reaching for the source
 * the item has already flagged as unsigned and uncounted when a real record
 * is sitting beside it; stretching a figure into a word that sounds bigger
 * ("empty" for a count that never went above five); dropping the limit the
 * figure came with, so the sentence claims more than the source can back;
 * and putting words inside quotation marks that the source never used.
 *
 * SCOPE GUARD: Grade 8 row 8.2 answers a counterclaim with EVIDENCE — a
 * fact, a figure, an observation — drawn from a source identified as
 * accurate and credible, presented accurately (no rounding a figure up, no
 * dropping a limit), and recognizes a rebuttal that leans on an unreliable
 * or misquoted source. Builds on `m7ela-u8-counterclaims.ts`, whose header
 * says outright that "every rebuttal below is won with reasoning, not
 * numbers", and on `m7ela-u8-evidence-and-elaboration.ts` (W.7.1b: five
 * evidence types and the sentence that explains them); G8 brings evidence
 * to the rebuttal and adds the source-credibility check W.8.1b names
 * ("accurate, credible sources"). Source evaluation itself is G7's
 * `m7ela-u10-evaluating-sources.ts` and is assumed. Stops short of HS
 * `engl-u5-counterargument-and-rebuttal.ts` (W.9-10.1b: exposing a hidden
 * assumption; conceding and outweighing at HS register). DELIBERATELY
 * EXCLUDED: writing or repairing the claim sentence itself, and the
 * distinguishing "although" shape, which are row 8.1 — every item in this
 * file prints the claim and the counterclaim already written and asks only
 * about the answer to them; the clause-level cohesion system of concessive
 * clauses and turn-back phrases, which is row 8.3 — no keyIdea, vocabulary
 * entry, hint, item or recap line in this file teaches a signal phrase, and
 * no concessive clause is built, named or repaired anywhere in it; formal
 * style and the removal of slang and contractions from
 * explanatory prose, which is row 8.4; the concede-and-outweigh move, which
 * belongs to the Grade 7 row below and to the HS row above and is named
 * nowhere in this file — the word "concede" does not appear in the body;
 * paragraph order, counterclaim placement and the concluding statement,
 * which are `m7ela-u8-organizing-an-argument.ts`'s; the elaboration sentence
 * as a taught move, which is `m7ela-u8-evidence-and-elaboration.ts`'s; and
 * any named fallacy, which is HS `engl-u5-logical-fallacies.ts`'s.
 * DELIBERATELY ALLOWED, because rows 8.1 and 8.3 and the Grade 7 rows sit
 * close: the words "claim", "counterclaim" and "rebuttal" run through the
 * whole file, because the row cannot be stated without them, and one keyIdea
 * restates the two-move structure in a single sentence as the frame the
 * evidence drops into, not as a lesson — no keyIdea teaches how to state a
 * counterclaim fairly and no item asks the student to write one; the words
 * "a fact, a figure, an observation" name the material this row works with,
 * which is the row's own scope wording, and the file never lists or teaches
 * the five evidence types; and one keyIdea and one vocabulary entry compress
 * the source check into two questions asked BEFORE writing — is this source
 * in a position to know THIS, and does it have a stake in the answer —
 * which is a one-line reuse of the Grade 7 test rather than the four-question
 * routine, and the four questions are nowhere listed, because every item
 * states for the student which source is trustworthy for its question and
 * which is not; and two worked-example steps observe in passing that "Some
 * ... say" hands a sentence to the other side and "but" turns it back, so a
 * reader can hear whose side each sentence is on — that is a one-line reuse
 * of the Grade 7 signal-word rule inside a specimen the student is reading
 * for its evidence, not the clause-level cohesion row 8.3 builds.
 *
 * NOTE FOR FUTURE AUTHORS: every source, record, report, tally, chat message
 * and school in this file is original prose invented for the item. This
 * course carries no passage machinery — no passageId, no shared texts — so
 * each question must be solvable from the words printed inside it, and no
 * published work is quoted or closely paraphrased. Every phrase this file
 * puts inside quotation marks as a quotation of one of its own printed
 * sources uses that source's words in that source's order, with one
 * deliberate exception: try_yourself 3 choice b attributes to the building
 * inventory a sentence the inventory does not contain, because a misquoted
 * source is exactly what that item asks the student to catch. Every wrong
 * SENTENCE in the tutor's own prose sits inside a WRONG: / CORRECT: pair;
 * a tutor reads those lines aloud, and an unlabeled overstatement would be
 * handed to the student as a model. The two rejected fragments in concept
 * keyIdea 4, "hardly any" and "close to fifty", carry no such pair because
 * they are not sentences and the clause that prints them rejects them in
 * the same breath, beside the exact figure that replaces them. The only
 * unlabeled wrong sentences are the MCQ distractors the three try_yourself
 * items ask the student to reject, and each is named in that item's hints.
 * No specimen sentence does double duty: the bicycles in the concept and
 * recap, the museum log in the concept, and the rec-center tally in the
 * misconception check appear in no try_yourself item, so no item can be
 * answered by recall of an earlier segment. No contraction appears anywhere
 * in this file, in the tutor's voice or inside any quoted source.
 *
 * CLAIM LEDGER (informational passages — every source in this file is
 * nonfiction the author invented, so the ledger covers the whole file,
 * distractors and hints included):
 *   Claim                                  | Where             | Kind        | Grounds
 *   A sign-up sheet taped in the front     | hook              | STIPULATED  | Invented school. The
 *   office carries 34 handwritten names    |                   |             | only claim made about
 *   for a late bus                         |                   |             | the sheet is the count,
 *                                          |                   |             | and the hook's warning
 *                                          |                   |             | contrasts 34 against
 *                                          |                   |             | "the whole grade",
 *                                          |                   |             | which is consistent.
 *   Over the past month the busiest lunch  | worked 1 problem, | STIPULATED  | Invented school. 22 - 14
 *   period had 14 students signed in to    | steps, answer     |             | = 8, and every
 *   the Bridgewater makerspace, a room     |                   |             | restatement in the file
 *   with 22 seats                          |                   |             | uses 14, 22 and 8.
 *   A sign-in record kept at a door by the | worked 1 steps,   | REAL-WORLD  | Definition of a sign-in
 *   adult on duty records who entered      | concept keyIdea 3 |             | record. No real
 *                                          |                   |             | institution attached.
 *   The Fairvale Parks Department counted  | worked 2 problem, | STIPULATED  | Invented town
 *   skaters every half hour between six    | steps, answer     |             | department. The draft,
 *   and nine for the six weeks after the   |                   |             | the three defects and
 *   lights went in last fall; after 8:30   |                   |             | the repair all use the
 *   the count never went above five        |                   |             | same figure and the same
 *                                          |                   |             | six-week boundary.
 *   A museum attendance log shows school   | concept keyIdea 5 | STIPULATED  | Invented museum, printed
 *   groups filled the gallery on eleven of |                   |             | only inside a WRONG /
 *   the fourteen weekday mornings it       |                   |             | CORRECT pair. 11 of 14
 *   recorded in March                      |                   |             | is internally possible.
 *   A record shows 31 bicycles             | concept keyIdea 4,| STIPULATED  | Invented. Used only to
 *                                          | recap 4           |             | contrast an exact count
 *                                          |                   |             | with "close to fifty",
 *                                          |                   |             | and 31 is far from 50.
 *   The Northgate main office room chart   | try 1 stem, key,  | STIPULATED  | Invented school. 24 - 19
 *   lists 24 tables in the cafeteria; the  | choices b and d   |             | = 5, which is the
 *   activities office sign-up list has 19  |                   |             | "five to spare" the key
 *   clubs this year                        |                   |             | states, and 5 of 24 is
 *                                          |                   |             | not the "far more than
 *                                          |                   |             | the clubs could ever
 *                                          |                   |             | fill" of choice b.
 *   An unsigned comment under the school   | try 1 stem,       | STIPULATED  | Invented comment. Choice
 *   announcement post reads "the caf is    | choice a          |             | a quotes it using its own
 *   way smaller than the gym"              |                   |             | words in their own order.
 *   The Ridgeway Public Library door       | try 2 stem, key,  | STIPULATED  | Invented library. The key
 *   counter recorded between 90 and 140    | choices a and b   |             | restates the range and
 *   visitors on each of the eight Sunday   |                   |             | the eight-Sunday limit
 *   afternoons of a trial last spring      |                   |             | unchanged; each wrong
 *                                          |                   |             | choice alters exactly one
 *                                          |                   |             | of them.
 *   A door counter records the number of   | try 2 stem        | REAL-WORLD  | Definition. Door counters
 *   people entering a building             |                   |             | are standard equipment in
 *                                          |                   |             | public buildings.
 *   The Hollis district building inventory | try 3 stem, key,  | STIPULATED  | Invented school and
 *   entry reads "Hollis Middle School      | choices b and d   |             | district. 340 - 214 = 126,
 *   auditorium: 340 fixed seats, plus 12   |                   |             | so the key's "more than a
 *   spaces for wheelchairs at the rear";   |                   |             | hundred short of full"
 *   the returned concert forms add up to   |                   |             | holds on the fixed seats
 *   214 seats                              |                   |             | alone; 340 + 12 = 352, so
 *                                          |                   |             | choice d's "more than 400"
 *                                          |                   |             | is false against the
 *                                          |                   |             | printed entry.
 *   A building seating record lists        | try 3 stem source | REAL-WORLD  | Standard practice in
 *   wheelchair spaces separately from      | 1, choice d       |             | accessible-seating records:
 *   fixed seats                            |                   |             | wheelchair spaces are
 *                                          |                   |             | counted as spaces, not as
 *                                          |                   |             | fixed seats. Choice d's
 *                                          |                   |             | error depends on this.
 *   The inventory "seats 340 families      | try 3 choice b    | STIPULATED  | Deliberately FALSE of the
 *   comfortably"                           |                   |             | entry printed in the stem,
 *                                          |                   |             | which is the error the item
 *                                          |                   |             | tests. The phrase appears
 *                                          |                   |             | nowhere in source 1, and
 *                                          |                   |             | the hints name misquoting.
 *   The Rivermount Rec Center front desk   | misconception_    | STIPULATED  | Invented rec center. 96 is
 *   tallied 96 people crossing mid-block   | check             |             | under 100, which is what
 *   in the two weeks before spring break   |                   |             | makes "well over a
 *                                          |                   |             | hundred" an overstatement,
 *                                          |                   |             | and 96 is stated in both
 *                                          |                   |             | corrections.
 *
 * No claim in this file is a precise statistic about the real world: every
 * figure belongs to an invented school, library, department, museum or rec
 * center, exactly as the fan-out contract requires of this row. No invented
 * figure is attributed to any real institution.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U8_REBUTTING_WITH_EVIDENCE_FROM_CREDIBLE_SOURCES: LessonPlan = {
  id: 'evelyn.ms.m8ela.rebutting-with-evidence-from-credible-sources.v1',
  title: 'Rebutting with Evidence from Credible Sources',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.rebutting-with-evidence-from-credible-sources',
      standard: 'M8ELA-8.2',
      description:
        'Answer a counterclaim with EVIDENCE — a fact, a figure, an observation — drawn from a source identified as accurate and credible, presented accurately (no rounding a figure up, no dropping a limit), and recognize a rebuttal that leans on an unreliable or misquoted source (CCSS W.8.1b).',
    },
  ],
  prerequisites: ['m8ela.a-claim-that-answers-the-opposing-claim'],
  followUps: ['m8ela.cohesion-among-claim-counterclaim-and-evidence'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that an argument the student has already had turns the moment somebody attaches something checkable to it, and that the checkable thing has to say what the writer says it says.',
      script:
        'The group chat has been arguing about the late bus for three days. Somebody types that there is no point asking for one, because nobody would ride it. You type back that people would ride it. Nothing moves. Three more messages, the same two positions, louder each time. Then somebody walks past the front office, photographs the sign-up sheet taped beside the door, and posts it: 34 names, in handwriting, on a sheet that has been up for a week. The argument is over, and it is over in one message. You had the right position the whole time. What you did not have was anything a person on the other side could go and check. You already know how to state the strongest thing the other side would say and then answer it — that is the move you walk into this lesson with. Today the answer arrives carrying evidence. And one warning before we start. If that message had said the whole grade signed up, somebody would have walked down to the office, counted 34, and started a second argument, this time about you.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-source-figure-limit',
      kind: 'concept',
      goal: 'Install the four checks that turn an answer into an evidence-backed rebuttal: name the counterclaim reason, pick the source that can settle it, state the figure as the source states it, and carry the limit that came with it.',
      keyIdeas: [
        'A REBUTTAL AT THIS LEVEL ARRIVES WITH SOMETHING CHECKABLE ATTACHED. You already know the two moves: state the strongest thing the other side would say, then answer it. That much does not change. What changes is what the answer is made of. Reasoning by itself can be argued with forever, because the other side has reasoning too. A fact, a figure, or an observation from a source both sides can go and look at ends the exchange in a way "I still think I am right" never does.',
        'SAY THE COUNTERCLAIM REASON OUT LOUD BEFORE YOU GO LOOKING FOR EVIDENCE. A counterclaim is not only a position; it arrives with a reason under it, and that reason is what your evidence has to hit. If the reason is that a room has too few tables for the clubs that need them, then the number of tables and the number of clubs is your evidence. A perfectly true fact about how easy that room is to find answers a different objection, and a reader hears it as a change of subject rather than as an answer.',
        'PICK THE SOURCE THAT IS IN A POSITION TO SETTLE THIS ONE QUESTION. You already know how to size up a source. In an argument that check happens before you write, not after, and two questions carry it: does this source actually know THIS, and does it have a stake in the answer coming out one way? A count kept at the door by the adult on duty can settle a question about how many. An unsigned message repeating what somebody heard settles nothing, and a rebuttal built on it does not get stronger by being stated with more confidence. It falls over later, in front of everyone.',
        'STATE THE FIGURE THE WAY THE SOURCE STATES IT. Not rounded up, not widened, not swapped for a word that sounds bigger. If the record says 31 bicycles, the rebuttal says 31 bicycles, not "hardly any" and not "close to fifty". This feels like a small dishonesty and it is not one, because the figure is the whole reason the reader believed you. A stretched number hands the other side the easiest reply available in any argument, which is to go and look at the source you just named.',
        'THE LIMIT TRAVELS WITH THE EVIDENCE. Almost every real figure comes with a boundary around it: who was counted, where, when, and for how long. That boundary is not fine print, it is part of what the figure means. Drop it and you have quietly made a much larger claim than your source made, and it is a claim your source cannot back. WRONG: "The museum\'s attendance log shows that school groups fill the gallery." CORRECT: "The museum\'s attendance log shows that school groups filled the gallery on eleven of the fourteen weekday mornings it recorded in March."',
        'IF YOU QUOTE THE SOURCE, QUOTE THE WORDS THAT ARE THERE. The fastest way to lose an argument you were winning is to put words inside quotation marks that the source never used, or to quote real words and cut off the part that limited them. Both are misquoting, and both do the same damage: a reader who checks one sentence and finds it altered stops believing every other sentence you wrote. When you are not certain you can reproduce the wording exactly, do not use quotation marks at all. Say what the source shows in your own sentence, and name the source so the reader can go and see it.',
      ],
      vocabulary: [
        { term: 'rebuttal evidence', definition: 'the checkable fact, figure or observation a rebuttal points at, taken from a source the reader could go and look at.' },
        { term: 'credible for this question', definition: 'worth believing about the one point being argued, because the source is in a position to know it and has no stake in the answer.' },
        { term: 'limit', definition: 'the boundary a piece of evidence comes with — who was counted, where, when, and for how long. It is part of what the evidence says.' },
        { term: 'overstating', definition: 'presenting evidence as stronger than the source states it, by rounding a figure up, widening the group it covers, or leaving off the limit.' },
        { term: 'misquoting', definition: 'putting words inside quotation marks that a source did not use, or quoting its words while cutting the part that qualified them.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-the-evidence-backed-rebuttal',
      kind: 'worked_example',
      problem:
        'A student is arguing that Bridgewater Middle School should keep the makerspace open during lunch. Build the rebuttal.\n\nCounterclaim to answer: "Some teachers say the makerspace is too crowded at lunch for anyone to get a seat, so students would spend the period waiting."\n\nSource 1 — the makerspace sign-in binder, which the teacher on duty keeps at the door and every student signs on the way in. Over the past month, the busiest lunch period had 14 students signed in. The room has 22 seats.\n\nSource 2 — a post in an eighth-grade group chat that reads, "the makerspace is always packed at lunch."',
      steps: [
        'Say the counterclaim reason in your own words before you touch either source. The reason is not that makerspaces are a bad idea. It is a claim about a number: more students want in at lunch than the room can seat. That tells you what kind of evidence answers it, because a claim about how many is answered by a count.',
        'Now choose between the two sources, and choose before you write anything. The group chat post reports how the room felt to one person on the days that person happened to go. The sign-in binder records who was actually in the room, every day, kept by the adult standing at the door. The question is how many students are in the room, so the binder can settle it and the post cannot. Notice that the post is not lying. It is simply not a count.',
        'Take the two numbers exactly as the binder gives them. The busiest lunch period over the past month had 14 students signed in, and the room has 22 seats. Twenty-two minus fourteen is eight, so eight seats were still empty on the fullest day of the month.',
        'Carry the limit the binder came with. The binder covers the past month, at lunch, at this school. So the rebuttal says over the past month, and it makes no claim about after school, about a year ago, or about what would happen if the club doubled in size.',
        'Write the two moves in order, so a reader can hear whose side each sentence is on. CORRECT: "Some teachers say the makerspace is too crowded at lunch for anyone to get a seat. The sign-in binder the teacher on duty keeps at the door tells a different story: over the past month, the busiest lunch period drew 14 students into a room with 22 seats, which left eight seats empty on its fullest day."',
        'Check the finished rebuttal the way an opponent would. Every number in it can be looked up in the binder, in one minute, by the teacher who keeps the binder. That is the test. WRONG: "Hardly anyone uses the makerspace at lunch anyway." That sentence claims more than the binder shows, gives a reader nothing to check, and it is not even what the writer needs, because fourteen students using a room is an argument for keeping it open rather than against.',
      ],
      answer:
        'The rebuttal reads: "Some teachers say the makerspace is too crowded at lunch for anyone to get a seat. The sign-in binder the teacher on duty keeps at the door tells a different story: over the past month, the busiest lunch period drew 14 students into a room with 22 seats, which left eight seats empty on its fullest day." The binder settles a question about how many and the group chat post cannot, every figure is stated as the binder gives it, and the month the binder covers is attached to the claim.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-weak-rebuttal',
      kind: 'worked_example',
      problem:
        'A student is arguing that the town should keep the skate park lights on until nine. Repair the rebuttal draft below.\n\nCounterclaim to answer: "Some neighbors say the lit park draws noise late into the evening."\n\nSource 1 — the Fairvale Parks Department evening use report, which counted skaters every half hour between six and nine on each of the six weeks after the lights went in last fall. Its finding: after 8:30 the count never went above five skaters.\n\nSource 2 — a page on a review site, posted with no name on it, saying that the crowds at the park thin out right after dinner.\n\nDraft rebuttal: "Neighbors say the lit park draws noise late into the evening, but the Parks Department found the park empty after 8:30, and a review page online says the crowds thin out right after dinner anyway."',
      steps: [
        'Start with what the draft gets right, because the job is to repair it rather than to throw it out. It states the counterclaim before answering it, it turns back with "but" so a reader can hear where the other side stops, and it reaches for the one source in this pair that was actually in a position to count anything. Three defects sit on top of that.',
        'Defect one, the figure is stretched. The draft says the department "found the park empty after 8:30", and the report says the count never went above five skaters. Five is a small number and it is not zero. A neighbor who stood at a window at 8:45 last fall and watched four skaters now has proof that this writer overstates. WRONG: "the Parks Department found the park empty after 8:30". CORRECT: "the Parks Department count never went above five skaters after 8:30".',
        'Defect two, the limit is gone. The report covers the six weeks after the lights went in last fall, with a count taken every half hour between six and nine. The draft states the finding as though it held on every evening of every season. Put the boundary back exactly where the source put it, and the sentence turns into one the department will stand behind.',
        'Defect three, the last clause props the point up with the review page, which has no name on it and no count in it. Adding a weak source beside a strong one does not add strength. It gives a reader something easy to knock over, and a reader who knocks it over usually stops trusting the strong source standing next to it. Cut the clause. The count does the work on its own.',
        'Write the repaired rebuttal with all three fixes in it at once. CORRECT: "Some neighbors say the lit park draws noise late into the evening. In the six weeks the Fairvale Parks Department counted last fall, taking a count every half hour between six and nine, the number of skaters after 8:30 never went above five."',
        'Read the repaired version and the draft next to each other. The repaired one is longer and it claims less, and that is exactly the trade you want. Every word a reader could challenge has been either removed or attached to a source that will back it.',
      ],
      answer:
        'The repaired rebuttal reads: "Some neighbors say the lit park draws noise late into the evening. In the six weeks the Fairvale Parks Department counted last fall, taking a count every half hour between six and nine, the number of skaters after 8:30 never went above five." The draft overstated the finding as an empty park, dropped the six-week limit, and leaned on an unsigned review page standing beside a source that had already done the counting.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-the-source-that-settles-it',
      kind: 'try_yourself',
      problem:
        'Northgate Middle School is arguing about where to hold the club fair.\n\nClaim: "The club fair should move from the gym to the cafeteria."\nCounterclaim: "Some students say the cafeteria has too little room, so half the clubs would have no table."\n\nSource 1 — the main office room chart, the building record the office keeps, which lists 24 tables in the cafeteria.\nSource 2 — an unsigned comment under the school announcement post, which reads, "the caf is way smaller than the gym." Nobody knows who wrote it and it gives no count.\n\nThe activities office sign-up list has 19 clubs this year.\n\nWhich rebuttal answers the counterclaim with the evidence that can settle it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some students say the cafeteria has too little room, so half the clubs would have no table. The comment under the school announcement post says only that the cafeteria "is way smaller than the gym", and a room being smaller than another room is not the same thing as a room being too small, so the worry does not hold up.' },
        { id: 'b', text: 'Some students say the cafeteria has too little room, so half the clubs would have no table. The main office room chart shows that the cafeteria has far more tables than the clubs could ever fill, so the crowding worry does not survive one look at the chart.' },
        { id: 'c', text: 'Some students say the cafeteria has too little room, so half the clubs would have no table. The main office room chart lists 24 tables in the cafeteria and the activities office sign-up list has 19 clubs this year, which is a table for every club with five to spare.', correct: true },
        { id: 'd', text: 'Some students say the cafeteria has too little room, so half the clubs would have no table. The cafeteria is the room families already walk through on their way to the auditorium, so far more visitors would find the fair there than ever manage to find it in the gym.' },
      ],
      expectedAnswer: 'Some students say the cafeteria has too little room, so half the clubs would have no table. The main office room chart lists 24 tables in the cafeteria and the activities office sign-up list has 19 clubs this year, which is a table for every club with five to spare.',
      hints: [
        'Say the counterclaim reason in plain words first. It is a claim about a number, whether there are enough tables for the clubs that need them. Then ask which of the two sources carries a number at all.',
        'One choice reaches for the source nobody can check and no count sits in. One uses the room chart but never says what the chart found, stretching it into words that sound larger than the two figures printed above. One is about how easy the room is to find, which is a fair point about an objection nobody made.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-state-the-figure-with-its-limit',
      kind: 'try_yourself',
      problem:
        'The Ridgeway town council is arguing about Sunday hours at the library.\n\nClaim: "The Ridgeway Public Library should open on Sunday afternoons."\nCounterclaim: "Some council members say a Sunday afternoon would sit nearly empty."\n\nThe library keeps a door counter, which records every person who comes through the entrance, and its report on the trial reads: "During the eight Sunday afternoons the library opened as a trial last spring, the door counter recorded between 90 and 140 visitors each afternoon."\n\nWhich rebuttal answers the counterclaim using that report, and states what the report says without stretching it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some council members say a Sunday afternoon would sit nearly empty. The library door counter recorded between 90 and 140 visitors on a Sunday afternoon, which makes Sunday one of the busiest days the library has all week.' },
        { id: 'b', text: 'Some council members say a Sunday afternoon would sit nearly empty. The library door counter recorded up to 140 visitors every Sunday afternoon last spring, and 140 people moving through a building is not a number anyone can call empty.' },
        { id: 'c', text: 'Some council members say a Sunday afternoon would sit nearly empty. A library that closes on Sunday is telling every family whose adults work six days a week that the one afternoon they are all free is the one afternoon the doors are locked.' },
        { id: 'd', text: 'Some council members say a Sunday afternoon would sit nearly empty. On the eight Sunday afternoons the library opened as a trial last spring, its door counter recorded between 90 and 140 visitors each afternoon, which is a long way from empty.', correct: true },
      ],
      expectedAnswer: 'Some council members say a Sunday afternoon would sit nearly empty. On the eight Sunday afternoons the library opened as a trial last spring, its door counter recorded between 90 and 140 visitors each afternoon, which is a long way from empty.',
      hints: [
        'Set each choice beside the report sentence and read the two together, one clause at a time. Three things in the report can be dropped or stretched: how many Sunday afternoons there were, when they happened, and that the figure is a range rather than one number.',
        'A range says the count landed between two numbers on each afternoon. Reporting only the top of the range as the usual figure claims more than the report does, and so does a sentence that ranks Sunday against the rest of the week, which the report never measured. One choice answers with reasoning alone and never reaches the report at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-catch-the-misquoted-source',
      kind: 'try_yourself',
      problem:
        'Hollis Middle School is arguing about where to hold the spring concert.\n\nClaim: "The spring concert should move from the gym to the auditorium."\nCounterclaim: "Some parents say the auditorium seats too few people, so families would be turned away at the door."\n\nSource 1 — the district building inventory, the record the facilities office keeps of every room. Its entry reads: "Hollis Middle School auditorium: 340 fixed seats, plus 12 spaces for wheelchairs at the rear."\nSource 2 — a message forwarded through a parent group with no name attached, which reads, "someone told me they turned families away last year."\n\nThe concert form asks each family how many seats they need. This year the returned forms add up to 214 seats.\n\nWhich rebuttal answers the counterclaim honestly, using the source that can settle it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some parents say the auditorium seats too few people, so families would be turned away at the door. The district building inventory lists 340 fixed seats in the auditorium, plus 12 wheelchair spaces at the rear, and this year the returned concert forms add up to 214 seats, which leaves the fixed seats alone more than a hundred short of full.', correct: true },
        { id: 'b', text: 'Some parents say the auditorium seats too few people, so families would be turned away at the door. The district building inventory says the auditorium "seats 340 families comfortably", with 12 wheelchair spaces on top of that, which is more families than any spring concert at Hollis has ever drawn through the front doors.' },
        { id: 'c', text: 'Some parents say the auditorium seats too few people, so families would be turned away at the door. The message going around the parent group only says that someone heard families were turned away last year, and a story with no name attached to it and no count in it is not a reason to move a whole concert.' },
        { id: 'd', text: 'Some parents say the auditorium seats too few people, so families would be turned away at the door. The auditorium holds more than 400 people once the 12 wheelchair spaces at the rear are counted in, and only about two hundred seats were requested this year, so the room would sit barely half full on concert night.' },
      ],
      expectedAnswer: 'Some parents say the auditorium seats too few people, so families would be turned away at the door. The district building inventory lists 340 fixed seats in the auditorium, plus 12 wheelchair spaces at the rear, and this year the returned concert forms add up to 214 seats, which leaves the fixed seats alone more than a hundred short of full.',
      hints: [
        'Start with the counterclaim reason and say it as a question about numbers: are there more seats in the auditorium than there are seats families have asked for? Then find the source that carries both of those numbers.',
        'Two of these reach for the building inventory. Set each one beside the inventory entry and check it clause by clause: the seat count, the wheelchair spaces, and whether the words inside the quotation marks are the words the inventory actually uses. Of the other two, one answers by picking apart the forwarded message and never produces a number at all, which leaves the counterclaim standing. A rebuttal that alters its own source is easier to knock down than one that never named a source at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rounding-up-and-borrowed-reliability',
      kind: 'misconception_check',
      question:
        'Two students are checking a rebuttal draft. The argument is that the town should paint a crosswalk outside the rec center, and the counterclaim is that almost nobody crosses there. The Rivermount Rec Center front desk tallied every person who crossed mid-block during the two weeks before spring break, and the tally came to 96 people. The draft reads: "Drivers say almost nobody crosses there, but the rec center counted well over a hundred people crossing mid-block." One student says the draft is fine, because ninety-six is close enough to a hundred and the point comes out the same either way. The other student says the missing two weeks do not matter, because the rec center is a reliable source and the count came from it. What has gone wrong each time?',
      commonErrors: [
        {
          answer: 'The draft is fine, because ninety-six is close enough to a hundred and the point comes out the same either way.',
          misconception:
            'Treating a figure as a rough impression rather than as the thing the reader is being asked to check. The student is right that 96 and 100 are close, and wrong about what the closeness buys, because the reader is not being asked whether the number is roughly right. The reader is being invited to go and verify it.',
          correctsTo:
            'Ninety-six is not well over a hundred; it is under a hundred, so the sentence is false as written and it is false in the direction that helps the writer, which is the worst direction for a figure to be wrong in. Notice what the writer gave up. The rebuttal was already winning with 96, because 96 people is not "almost nobody" by any reading, and an exact figure is the more convincing sentence precisely because it was obviously counted. WRONG: "the rec center counted well over a hundred people crossing mid-block". CORRECT: "the rec center counted 96 people crossing mid-block". The first driver who asks to see the tally now has a fair complaint about the writer instead of an answer about the crosswalk.',
        },
        {
          answer: 'The missing two weeks do not matter, because the rec center is a reliable source and the count came from it.',
          misconception:
            'Reading a source\'s reliability as though it covered whatever the writer does with the source. The student has the first half right, that where a figure came from matters, and then treats that as permission for the sentence built on top of it.',
          correctsTo:
            'A reliable source is reliable about what it actually measured. This tally covers the two weeks before spring break, at one desk, at one crossing. Written without that boundary, the sentence sounds like a standing fact about every week of the year, which the rec center never claimed and cannot back. Carrying the limit costs the rebuttal nothing: "96 people crossed mid-block in the two weeks the front desk kept the tally" is a sentence the rec center will stand behind, and the version without the limit is one it will not. Where a source came from is a claim about the source, never permission for what the writer does with it afterward.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The two moves are unchanged: state the strongest thing the other side would say, then answer it. What is new is that the answer arrives with a fact, a figure, or an observation attached, taken from a source the reader could go and check.',
        'Say the counterclaim reason in your own words first. The evidence has to hit that reason. A true fact that answers a different objection reads as a change of subject.',
        'Choose the source that is in a position to settle this one question and has no stake in the answer. A rebuttal is only as strong as the source it rests on, and stating it with more confidence does not patch a weak one.',
        'State the figure the way the source states it. WRONG: "close to fifty bicycles". CORRECT: "31 bicycles". A stretched number hands the other side the easiest reply available in any argument, which is to go and look at the source you named.',
        'The limit travels with the figure: who was counted, where, when, and for how long. Drop it and you have made a larger claim than your source made, and your source cannot back it.',
        'If you put words inside quotation marks, they have to be the words the source used, with the part that limited them still attached. When you cannot reproduce the wording exactly, drop the quotation marks, say what the source shows in your own sentence, and name it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Rebutting with Evidence from Credible Sources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
