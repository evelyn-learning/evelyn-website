/**
 * Grade 6 ELA — Sentence Fluency, Style & Punctuation: Varying Sentence
 * Patterns for Style.
 *
 * PROCEDURE-LED fan-out row. There is one repeatable move and the whole
 * lesson makes it fluent: look at a paragraph of complete, correct sentences
 * and ask whether it repeats an exact pattern a reader can point to (the same
 * opening word three or more times in a row) or leaves a relationship between
 * two ideas unstated that a connector could make explicit (CCSS L.6.3a). Two
 * traps this plan is built to kill: treating "sounds more sophisticated" or
 * "sounds nicer" as a test for a good revision, and combining sentences in a
 * way that quietly changes a fact, drops a fact, or misstates the order the
 * original sentences printed.
 *
 * SCOPE GUARD: Grade 6 row 6.2 varies sentence LENGTH and OPENING to hold a
 * reader's interest and suit a piece's style — mixing short and long
 * sentences, breaking up a run of identical sentence openers, and combining
 * two short sentences with a connector that names how they relate.
 * DELIBERATELY EXCLUDED: naming a sentence as simple, compound, complex or
 * compound-complex, and explaining what a phrase or a clause does inside a
 * sentence — both are L.7.1a/L.7.1b, taught only once this course's students
 * reach Grade 7; nothing in this file names a sentence type or a clause by
 * that vocabulary. Also excluded: identifying or repairing a fragment or a
 * run-on, which is row 6.1's sentence-completeness check — every sentence
 * built or offered as a choice in this file is already a complete sentence,
 * fragments and run-ons appear nowhere as a thing being taught or repaired.
 * Also excluded: the comma-for-nonrestrictive-or-parenthetical-element rule,
 * which is row 6.3's job, and keeping one piece of writing's formality and
 * tone consistent start to finish, which is row 6.4's job. DELIBERATELY
 * ALLOWED, because these neighboring rows sit close: (a) every combined
 * sentence in this file that opens with a subordinate clause is punctuated
 * with the comma an introductory clause needs before its main clause begins
 * — that comma is a mechanical requirement of writing the sentence correctly,
 * not row 6.3's nonrestrictive-or-parenthetical rule, and no item in this
 * file asks the student to identify or place that kind of comma as the
 * skill being tested; (b) this lesson keeps every sentence complete because
 * a fragment or a run-on is never an acceptable "variety" fix, but it never
 * asks the student to name or repair one, which stays row 6.1's territory.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every quoted fragment in a step, hint or choice
 * appears character-for-character in the excerpt or choice it is drawn from;
 * copy-paste, never retype. Every contraction in this file is printed inside
 * quotation marks as reported speech, which is the only place a contraction
 * is allowed in authored prose in this course.
 *
 * ANSWER-DESIGN NOTE: this row's hazard is that "which version is better" can
 * quietly become a matter of taste. Every one of this file's three
 * try_yourself items is built so the key is forced by something a student can
 * point at in the printed choices — a repeated opening word the key removes,
 * or a relationship between two events (a definitional cause, a fixed order
 * of events already stated) that the key states with a connector and every
 * wrong choice either fails to state, misstates, or pairs with an altered or
 * reordered fact. No item in this file asks the student to judge which
 * version "sounds" better.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is an invented
 * narrative scenario (a pet-care routine, a fire drill, a basketball game, a
 * power outage during an assembly), true by construction, and no item asserts
 * a factual claim about the real world that a student could look up. Rows
 * whose passages are INFORMATIONAL must carry the three-column claim ledger
 * described in the fan-out contract instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U6_VARYING_SENTENCE_PATTERNS_FOR_STYLE: LessonPlan = {
  id: 'evelyn.ms.m6ela.varying-sentence-patterns-for-style.v1',
  title: 'Varying Sentence Patterns for Style',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.varying-sentence-patterns-for-style',
      standard: 'M6ELA-6.2',
      description:
        'Vary sentence length and opening — combining short, related sentences with a connector, and changing where a sentence starts instead of repeating the same opening word — to hold a reader\'s interest and suit a piece\'s style, without yet naming a sentence as simple, compound, complex or compound-complex, which is how Grade 7 signals relationships between ideas (CCSS L.6.3a; the excluded skill is L.7.1b).',
    },
  ],
  prerequisites: ['m6ela.sentence-fragments-and-run-ons'],
  followUps: ['m6ela.commas-for-nonrestrictive-and-parenthetical-elements'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a paragraph can be fully correct and still read badly, and name the fix as a shape problem rather than a content problem.',
      script:
        'You are writing a paragraph for the class newsletter about the school food drive. You write: "We collected cans. We stacked them in the gym. We loaded them into the truck. We drove them to the shelter." Every one of those sentences is correct. Nothing is broken. But by the third one your reader has started to skim, because every sentence is short and every sentence starts with the same word. Fixing this is not about changing what happened — the cans still get collected, stacked, loaded, and driven. It is about changing the shape of the sentences that tell it: some longer, some shorter, some opening a different way. That is sentence variety, and by the end of today you will have a way to test whether a fix actually works, instead of just guessing which version sounds better.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variety-and-the-two-tests',
      kind: 'concept',
      goal: 'Install what sentence variety changes and does not change, and give two testable reasons a revision counts as a real fix rather than a matter of taste.',
      keyIdeas: [
        'SENTENCE VARIETY CHANGES SHAPE, NOT MEANING. A paragraph of complete, correct sentences can still be choppy if every sentence is the same length and starts the same way. CHOPPY: "We collected cans. We stacked them. We loaded them. We drove them." VARIED: "We collected cans and stacked them in the gym. Then we loaded the boxes into the truck and drove them to the shelter." Every fact stays exactly the same; only the shape changes.',
        'THE MOST NOTICEABLE REPEATED PATTERN IS THE OPENER. Look at the first word of each sentence in a row. When three or more sentences in a row start with the exact same word or the same short subject, that repetition is what a reader notices first, before they even notice what the sentences say.',
        'COMBINING TWO SHORT SENTENCES CAN STATE A RELATIONSHIP THAT WAS LEFT UNSTATED. CHOPPY: "The bell rang. Everyone ran to the cafeteria." Printed side by side, the reader has to supply the connection between them. VARIED: "When the bell rang, everyone ran to the cafeteria." The word "when" states the timing relationship instead of leaving it for the reader to guess.',
        'SHORT AND LONG SENTENCES DO DIFFERENT JOBS. A short sentence lands hard and speeds up a moment — "The door slammed." A longer sentence slows down to add detail or explain — "After three tries, the old door finally clicked shut behind her." Neither length is better on its own; the piece decides which job is needed where.',
        'A VARIED SENTENCE IS STILL A COMPLETE, CORRECT SENTENCE. Varying pattern is a choice layered on top of sentences that are already whole. It is never an excuse to write a fragment or to jam two sentences together with no connecting word or punctuation — checking for that is a different job entirely, done elsewhere.',
        'TEST A REVISION BY POINTING AT WHAT IT FIXES, NOT BY HOW IT SOUNDS. A real fix does one of two things you can point at in the words themselves: it removes an opening word that was exactly repeated three or more times in a row, or it adds a connector — a word such as when, after, because, or so — that states a relationship the original sentences left unstated. A revision that only swaps in longer or fancier words, without doing either of those two things, has not fixed anything; it has only gotten longer.',
      ],
      vocabulary: [
        { term: 'sentence opener', definition: 'the word or phrase a sentence starts with.' },
        { term: 'sentence variety', definition: 'mixing sentence length and sentence openers instead of repeating the same pattern.' },
        { term: 'choppy', definition: 'a run of short sentences in a row that makes writing feel abrupt.' },
        { term: 'monotonous', definition: 'sounding the same over and over, so a reader\'s attention starts to drift.' },
        { term: 'connector', definition: 'a word such as when, after, because, or so that states how two ideas relate.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fixing-a-repeated-opener',
      kind: 'worked_example',
      problem:
        'This paragraph is heading to the class newsletter. Fix the choppy rhythm without changing any of the facts.\n\n"I fed the rabbit. I filled its water bowl. I swept out the cage. I checked the latch before I left."',
      steps: [
        'Read the paragraph and look only at the first word of each sentence: I, I, I, I. The exact same word opens all four sentences in a row. That repetition, not the content, is the choppy rhythm a reader notices.',
        'Decide which sentences are closely related enough to combine into one. Feeding the rabbit and filling its water bowl are two parts of the same routine step, so they can share a sentence.',
        'Combine that pair using a connector that keeps both actions and drops one repeated "I". VARIED: "I fed the rabbit and filled its water bowl."',
        'Vary the opener on the next sentence instead of starting it with "I" again. VARIED: "After that, I swept out the cage." Moving "After that" to the front means this sentence no longer opens with the repeated word.',
        'Leave the last sentence close to as written, since the paragraph now has three different openers instead of one repeated four times: "I checked the latch before I left."',
        'Read the whole revision back and confirm nothing was added, dropped, or changed — only the shape changed: "I fed the rabbit and filled its water bowl. After that, I swept out the cage. I checked the latch before I left." Three sentences, three different openers, the same four facts.',
      ],
      answer:
        'I fed the rabbit and filled its water bowl. After that, I swept out the cage. I checked the latch before I left. The repeated "I ___. I ___. I ___. I ___." pattern is gone, and every original fact is still there.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-making-a-relationship-explicit',
      kind: 'worked_example',
      problem:
        'These two sentences from a class blog post about a fire drill are correct, but the connection between them is left for the reader to guess. Fix it without changing what happened.\n\n"The fire alarm went off. Every class lined up outside in under two minutes."',
      steps: [
        'Read both sentences and ask what connects them. The fire alarm going off is what sent every class outside — but as two separate sentences, the reader has to supply that connection alone.',
        'Pick a connector that names the relationship you found. "As soon as" states exactly how close in time the two events were, which is more precise than leaving them as two plain sentences joined by nothing.',
        'Combine the two sentences into one, moving the earlier event to the front: "As soon as the fire alarm went off, every class lined up outside in under two minutes."',
        'Check that nothing was added or changed. The alarm still goes off, and the classes still line up in under two minutes — the only new word is the connector that states the relationship.',
        'Compare the shapes. Two short, separate sentences of similar length now read as one longer sentence that opens with the connector — a different rhythm than two plain sentences sitting side by side.',
      ],
      answer:
        'As soon as the fire alarm went off, every class lined up outside in under two minutes. The connector "as soon as" states the timing relationship that the two separate sentences only left implied.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fix-the-repeated-opener',
      kind: 'try_yourself',
      problem:
        'This paragraph is correct, but every sentence follows the same drumbeat.\n\n"Jenna packed her backpack. Jenna checked the bus schedule. Jenna grabbed her water bottle. Jenna ran out the door."\n\nWhich revision fixes the choppy rhythm without changing any of the facts?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Jenna packed her backpack, checked the bus schedule, and grabbed her water bottle before she ran out the door.', correct: true },
        { id: 'b', text: 'Jenna packed her backpack. Then Jenna checked the bus schedule. Then Jenna grabbed her water bottle. Then Jenna ran out the door.' },
        { id: 'c', text: 'Jenna packed her backpack, checked the bus schedule, and grabbed her umbrella before running out the door.' },
        { id: 'd', text: 'Jenna got her backpack together and then hurried to gather the rest of her things before leaving for the bus.' },
      ],
      expectedAnswer: 'Jenna packed her backpack, checked the bus schedule, and grabbed her water bottle before she ran out the door.',
      hints: [
        'Count how many sentences in each choice still open with the exact same word, repeated three or more times in a row.',
        'Then check the four original facts one at a time against each choice: backpack, bus schedule, water bottle, door. A choice that swaps or leaves out one of those four is a different paragraph, not a fix.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-state-the-relationship',
      kind: 'try_yourself',
      problem:
        'This pair of sentences for the school paper is correct, but it leaves the connection between the two events unstated.\n\n"The scoreboard clock hit zero. The home crowd rushed onto the court."\n\nWhich revision states the relationship between these two events, without changing what happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The home crowd rushed onto the court in a matter of seconds. The scoreboard clock had already hit zero.' },
        { id: 'b', text: 'As soon as the scoreboard clock hit zero, the home crowd rushed onto the court.', correct: true },
        { id: 'c', text: 'The scoreboard clock hit zero, but the home crowd still rushed onto the court all the same.' },
        { id: 'd', text: 'As soon as the scoreboard clock hit zero, the visiting team\'s fans rushed onto the court.' },
      ],
      expectedAnswer: 'As soon as the scoreboard clock hit zero, the home crowd rushed onto the court.',
      hints: [
        'One of these choices never adds a connecting word at all, so it stays as two separate sentences, exactly as unstated as the original pair.',
        'Of the three choices that do combine the sentences, one connector signals a contrast that is not there, and one changes who rushed onto the court. Check the remaining choice word for word against the original pair.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fix-both-in-one-revision',
      kind: 'try_yourself',
      problem:
        'This paragraph for the school website is correct, but it repeats one word and leaves a relationship unstated.\n\n"The power went out during the assembly. The gym went completely dark. The principal reached for a flashlight under the podium."\n\nWhich revision fixes the repeated opener and states the relationship, without changing or reordering what happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The power went out during the assembly. The principal reached for a flashlight under the podium. The gym went completely dark.' },
        { id: 'b', text: 'The power went out during the assembly, but the gym went completely dark, and the principal reached for a flashlight under the podium.' },
        { id: 'c', text: 'When the power went out during the assembly, the gym went completely dark, and the principal reached for a flashlight under the podium.', correct: true },
        { id: 'd', text: 'When the lights flickered during the assembly, the gym went completely dark, and the principal reached for a flashlight under the podium.' },
      ],
      expectedAnswer: 'When the power went out during the assembly, the gym went completely dark, and the principal reached for a flashlight under the podium.',
      hints: [
        'Check the order of the three events against the original paragraph first. A revision that puts the flashlight before the darkness has switched the order the original printed, whatever connector it uses.',
        'Of the choices that keep the original order, one connector signals a contrast that is not in the original, and one changes what caused the gym to go dark. The remaining choice states the relationship and repeats no opening word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fancier-words-fix-it',
      kind: 'misconception_check',
      question:
        'Priya revises "The dog barked. The mail carrier walked away quickly." into "The canine emitted a series of loud vocalizations, and subsequently the individual delivering the mail departed the premises with considerable haste." She says, "I fixed it — now it sounds a lot more sophisticated." What has gone wrong?',
      commonErrors: [
        {
          answer:
            'The canine emitted a series of loud vocalizations, and subsequently the individual delivering the mail departed the premises with considerable haste.',
          misconception:
            'Priya has decided that sentence variety means swapping in longer, fancier words and stretching the sentence out, because a wordier sentence must automatically be better writing.',
          correctsTo:
            'Sentence variety is about the shape of sentences — their length and their opener — not about vocabulary difficulty. Priya\'s revision is still just one long sentence joined with "and," and it does not remove a repeated opener or state a relationship any more clearly than the original pair did; it only replaced plain, clear words with harder ones that say the same thing. A real fix would combine the two sentences with a connector that names the relationship: "When the dog barked, the mail carrier walked away quickly." That states that the barking is what sent the mail carrier off, using one clear connector and none of the original words changed.',
        },
        {
          answer: 'Any combination of two short sentences into one longer sentence counts as fixing the choppiness.',
          misconception:
            'Treating length alone as the test, so a combination that drops or changes a detail still gets accepted as long as it produces one longer sentence.',
          correctsTo:
            'A revision only counts as a fix if it removes a repeated opener or states a relationship that was left unstated, and it must do that without losing or changing any fact from the original sentences. A longer sentence that drops a detail, swaps one noun for another, or reorders events out of the sequence the original stated has not fixed the choppiness — it has replaced one paragraph with a different, less accurate one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sentence variety changes the length and opener of sentences, never the facts inside them.',
        'Three or more sentences in a row that start with the exact same word create a choppy, repeated pattern a reader notices immediately.',
        'Combining two short, related sentences with a connector such as when, after, because, or so can state a relationship the separate sentences left unstated.',
        'Short sentences land hard and speed up a moment; longer sentences slow down to add detail or explanation. The piece decides which job is needed where.',
        'A varied sentence is still a complete, correct sentence — variety is never an excuse for a fragment or two sentences jammed together with no connecting word.',
        'Test a revision by pointing at what it fixes: a repeated opener it removes, or a relationship it states. If a revision only sounds fancier or longer without doing either, it has not fixed anything.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Varying Sentence Patterns for Style' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
