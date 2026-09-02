/**
 * Grade 6 ELA — Argument Writing: Linking Words for Claims & Reasons.
 *
 * PROCEDURE-LED, writing-unit shape (CCSS W.6.1c). Row 8.1 already taught the
 * student to write a debatable claim; row 8.2 already taught them to back it
 * with distinct reasons and evidence. This row does one narrower job: pick
 * the linking word that names the true relationship between a claim already
 * written and a reason already written, from three families — a REASON that
 * explains the claim (because, since), a RESULT that follows because a
 * reason came first (therefore, consequently, as a result), and an EXAMPLE
 * that makes a reason concrete with one specific case (for example, for
 * instance). The trap this plan is built to kill is treating a linking word
 * as a vocabulary list to sprinkle in for polish. A linking word is correct
 * only when it names the relationship that is actually there in the two
 * sentences it joins; a smooth-sounding, correctly spelled word in the wrong
 * family is still wrong. "However" appears in this file for exactly that
 * reason: it is a real, correctly spelled linking word, and every time it
 * appears here it is the wrong choice, because nothing in this row's claims
 * and reasons ever turns against what was just said.
 *
 * There is no free-response item anywhere in this course. All three
 * try_yourself items are revision-choice MCQs: a claim and a reason are
 * printed, and the four choices are candidate ways of joining them, one
 * correct and three carrying a named error. All production of new writing
 * happens inside the two worked examples, where the student fills a blank
 * or repairs a broken join under full guidance; the try_yourself items only
 * ask the student to recognize which finished version is correct.
 *
 * SCOPE GUARD: this lesson teaches choosing a linking word or short phrase
 * (because/since, therefore/consequently/as a result, for example/for
 * instance) that correctly names the relationship between a claim and a
 * reason that have both already been written. DELIBERATELY EXCLUDED: writing
 * or testing a claim for debatability (row 8.1's job); generating or judging
 * the strength of reasons and evidence (row 8.2's job); writing a concluding
 * statement (row 8.4's job); and, upward into Grade 7, acknowledging or
 * rebutting an opposing claim (W.7.1a, the shipped course's own Unit 8.3,
 * which owns the full counterclaim/rebuttal topic — no Grade 6 CCSS
 * antecedent exists for it). This lesson also does not teach the seven-family
 * transition system used for a whole informative text (adding, contrast,
 * cause/effect, example, sequence, emphasis, conclusion — W.6.2c, row 9.3);
 * an argument's claim-and-reasons paragraph only ever needs the narrower
 * three-family set above, and this file never teaches or tests a sequence,
 * emphasis or plain-conclusion transition. It also does not teach sentence
 * fragments, run-ons or sentence-pattern variety (Unit 6). DELIBERATELY
 * ALLOWED: this file states plainly what "however" signals — a turn against
 * what was just said — because a student cannot see why "however" is the
 * wrong choice here without knowing what it would signal if it were right.
 * Naming that one word's meaning is not the same as teaching the Grade 7
 * skill of acknowledging an opposing claim, and this file never asks a
 * student to draft, weigh or answer an opposing claim of its own.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so every item is solvable from the words
 * printed inside it alone. Every broken or mismatched join IN THE TUTOR'S
 * OWN PROSE is labeled WRONG with the CORRECT version beside it, because a
 * tutor reads these lines aloud. The only unlabeled mismatched joins in this
 * file are the MCQ distractors the three try_yourself items ask the student
 * to reject, which is exactly what those items are for; each one is named in
 * its item's hints. This file contains no contractions outside quoted
 * material, and none of that material is needed here since no character
 * dialogue or nonstandard-English specimen appears in this row.
 *
 * CLAIM LEDGER: not required, and none is written. The claim-ledger rule
 * binds rows whose passages are INFORMATIONAL — nonfiction reporting facts
 * about the world. This row's printed text is argument-writing SAMPLE
 * PROSE: invented claims and reasons a fictional student-writer is drafting,
 * exactly like the shipped m7ela-u8-claims-and-reasons.ts, which carries no
 * claim ledger for the same reason. The applicable test was still run on
 * every sentence in this file: would a student reasonably take it as a
 * reported fact about the real world, rather than as the sample writer's own
 * debatable position or a stipulated detail of the invented school? Every
 * claim and reason here is a debatable position (a school policy the sample
 * writer is arguing for) or a stipulated scene detail invented for its item
 * (bike-rack counts, minute counts, a storm date) that only has to stay
 * internally consistent with its own item, and none of them is a checkable
 * external fact or a statistic. No entry crosses into REAL-WORLD territory,
 * so no ledger table is needed.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U8_LINKING_WORDS_FOR_CLAIMS_AND_REASONS: LessonPlan = {
  id: 'evelyn.ms.m6ela.linking-words-for-claims-and-reasons.v1',
  title: 'Linking Words for Claims & Reasons',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.linking-words-for-claims-and-reasons',
      standard: 'M6ELA-8.3',
      description:
        'Use a linking word, phrase, or clause (because, therefore, for example, consequently) to clarify the relationship between a claim and the reasons given for it (CCSS W.6.1c).',
    },
  ],
  prerequisites: ['m6ela.supporting-a-claim-with-reasons-and-evidence'],
  followUps: ['m6ela.writing-a-concluding-statement'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a linking word does real work connecting a claim to a reason, using an allowance request as the example.',
      script:
        'You want your allowance raised by five dollars a week for taking out the trash every single day, including weekends. You could just say, "I should get five dollars more a week." That claim is sitting there with nothing holding it up. Now try this instead: "I should get five dollars more a week, because I take out the trash every single day now, even on weekends." Same claim, same reason, but now there is a word in the middle doing real work. "Because" is not decoration. It tells whoever is listening exactly how the reason connects to the claim. Pick the wrong connecting word, and the argument stops making sense even when the claim and the reason are both good on their own. Today the job is picking the linking word that matches the relationship that is actually there, not whichever word sounds the most grown-up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-relationship-first',
      kind: 'concept',
      goal: 'Install the three linking-word families this lesson uses, and the rule that a correctly spelled word can still be wrong.',
      keyIdeas: [
        'A LINKING WORD NAMES THE RELATIONSHIP BETWEEN A CLAIM AND A REASON — it does not just signal that more writing is coming. This lesson works with three relationships: a REASON that explains the claim, a RESULT that follows because a reason came first, and an EXAMPLE that makes a reason concrete with one specific case.',
        'BECAUSE AND SINCE ATTACH A REASON DIRECTLY TO THE CLAIM IT EXPLAINS, in one sentence: "claim, because reason." Test it by reading the reason as the answer to the question "why?" If it answers why, because or since belongs there.',
        'THEREFORE, CONSEQUENTLY AND AS A RESULT INTRODUCE SOMETHING THAT FOLLOWS BECAUSE A REASON WAS ALREADY GIVEN. The order flips: the reason stands on its own first, and then a new sentence beginning with one of these words states the claim, or the next point, as its consequence. "Reason. Therefore, claim."',
        'FOR EXAMPLE AND FOR INSTANCE INTRODUCE ONE SPECIFIC CASE THAT BACKS UP A REASON ALREADY STATED IN GENERAL TERMS. A general reason describes a pattern; an example is one moment that shows the pattern actually happening. Treating a specific case as if it were a brand-new result, or treating the general reason as if it needed no proof at all, both weaken the paragraph.',
        'A LINKING WORD CAN BE SPELLED CORRECTLY AND STILL BE THE WRONG CHOICE, if it names a relationship that is not actually there. "However" signals a turn against what was just said, and it is a completely correct English word — but if the sentence that follows agrees with the claim instead of turning against it, "however" is wrong no matter how formal or careful it sounds.',
        'NAME THE RELATIONSHIP IN PLAIN WORDS BEFORE PICKING A WORD. Ask: does this sentence explain the claim, does it follow as a result of a reason already given, or does it give one specific case that proves a reason? Only after answering that question should a linking word get chosen, and the family it comes from has to match the answer.',
      ],
      vocabulary: [
        { term: 'linking word', definition: 'a word or short phrase that shows how a reason connects to the claim it supports, such as because, therefore, or for example.' },
        { term: 'relationship', definition: 'the exact way one idea connects to another — explaining it, following as a result of it, or giving one specific case of it.' },
        { term: 'reason', definition: 'a statement that explains why a claim should be accepted.' },
        { term: 'result', definition: 'something that follows logically because something else happened or was true first.' },
        { term: 'illustrate', definition: 'to make a general reason concrete by giving one specific case of it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-then-fill',
      kind: 'worked_example',
      problem:
        'Fill in each blank with the linking word that matches the relationship, and name the relationship out loud before you choose it.\n\nClaim: Our school should extend recess to thirty minutes instead of twenty.\nEvery recess loses about five minutes to walking out to the field and back. ___ (1) most students are left with barely enough time to finish one full game before the whistle blows.\n___ (2) on Tuesday, the fourth-grade kickball game had only finished two innings when the whistle ended recess early.',
      steps: [
        'Work one blank at a time, and say the relationship before you look at any word list. Read the sentence right before blank (1): the walking time is stated first, on its own. What does the next sentence do with that fact?',
        'The next sentence states what happens because of the walking time — barely enough time is left for a full game. The reason came first, and the sentence after the blank states what follows as a result of it. That is the RESULT relationship, so blank (1) needs a word from the therefore family: therefore, consequently, or as a result.',
        'Test it by reading the whole sentence: "Every recess loses about five minutes to walking out to the field and back. As a result, most students are left with barely enough time to finish one full game before the whistle blows." That reads correctly, so blank (1) is "As a result,".',
        'Now look at blank (2). The sentence before it has already made its general point — the lost minutes leave barely enough time to play. What does the Tuesday sentence add to that?',
        'The Tuesday kickball game is not a new result and it does not explain anything new. It is one specific moment that shows the general pattern actually happening. That is the EXAMPLE relationship, so blank (2) needs a word from the for-example family: for example or for instance.',
        'Test it the same way: "As a result, most students are left with barely enough time to finish one full game before the whistle blows. For example, on Tuesday, the fourth-grade kickball game had only finished two innings when the whistle ended recess early." The Tuesday sentence now reads as proof of the pattern, not a brand-new claim.',
      ],
      answer:
        'Blank (1): "As a result,". Blank (2): "For example,". Full paragraph: "Every recess loses about five minutes to walking out to the field and back. As a result, most students are left with barely enough time to finish one full game before the whistle blows. For example, on Tuesday, the fourth-grade kickball game had only finished two innings when the whistle ended recess early." The first linking word marks a result that follows the walking-time reason; the second marks one specific case that proves the pattern.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-the-wrong-relationship',
      kind: 'worked_example',
      problem:
        'A student is revising this argument and reads it aloud: "Our class should adopt a hamster to keep in the reading corner. However, taking care of a hamster would give everyone a turn at a daily responsibility, like refilling its water bottle or measuring out its food." It sounds smooth out loud. Is the linking word doing the right job?',
      steps: [
        'Do not trust how smooth a sentence sounds. Ask what job "however" is built to do: it announces a turn against whatever was just said.',
        'Check what the second sentence actually does to the claim. It does not turn against "our class should adopt a hamster" — it agrees with the claim and explains one reason to accept it. WRONG: "Our class should adopt a hamster to keep in the reading corner. However, taking care of a hamster would give everyone a turn at a daily responsibility, like refilling its water bottle or measuring out its food."',
        'Name the relationship that is actually there. The second sentence explains why the claim should be accepted, so it belongs to the reason family, not the turn-against family that "however" belongs to.',
        'Rebuild the sentence with a word from the reason family, joining the two sentences into one. CORRECT: "Our class should adopt a hamster to keep in the reading corner, because taking care of a hamster would give everyone a turn at a daily responsibility, like refilling its water bottle or measuring out its food."',
        'Notice the pattern to watch for. "However" always sounds careful and serious, and that seriousness is exactly why it gets grabbed by accident. A linking word can sound right and still name the wrong relationship — check what the second sentence DOES to the claim, not how grown-up the word sounds.',
      ],
      answer:
        'No. "However" announces a turn against the claim, and the second sentence actually explains why the claim should be accepted, so it needs a reason word instead: "Our class should adopt a hamster to keep in the reading corner, because taking care of a hamster would give everyone a turn at a daily responsibility, like refilling its water bottle or measuring out its food."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-reason-explains-the-claim',
      kind: 'try_yourself',
      problem:
        'Read the claim and the reason below. Which sentence links them with the word that matches the true relationship?\n\nClaim: Our school library should stay open until 4:30 instead of closing at 3:45.\nReason: Many students who ride the late bus currently have nowhere quiet to do homework while they wait.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Our school library should stay open until 4:30 instead of closing at 3:45. For example, many students who ride the late bus currently have nowhere quiet to do homework while they wait.' },
        { id: 'b', text: 'Our school library should stay open until 4:30 instead of closing at 3:45. However, many students who ride the late bus currently have nowhere quiet to do homework while they wait.' },
        { id: 'c', text: 'Our school library should stay open until 4:30 instead of closing at 3:45. Consequently, many students who ride the late bus currently have nowhere quiet to do homework while they wait.' },
        { id: 'd', text: 'Our school library should stay open until 4:30 instead of closing at 3:45, because many students who ride the late bus currently have nowhere quiet to do homework while they wait.', correct: true },
      ],
      expectedAnswer: 'Our school library should stay open until 4:30 instead of closing at 3:45, because many students who ride the late bus currently have nowhere quiet to do homework while they wait.',
      hints: [
        'Say the relationship in plain words first. Does the sentence about the late bus explain why the library should stay open, does it follow as a result of the library staying open, or is it one specific case among several?',
        'The late-bus problem is the reason the claim makes sense in the first place — it is not a result of anything and it is not one example standing for a bigger group of reasons. Only one choice attaches the reason to the claim with a word built for exactly that job.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-result-follows-the-reason',
      kind: 'try_yourself',
      problem:
        'A reason is already written below. Which sentence correctly adds the claim that follows from it?\n\nThe bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street. Therefore, the school should add a second, larger bike rack near the gym doors.', correct: true },
        { id: 'b', text: 'The bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street. However, the school should add a second, larger bike rack near the gym doors.' },
        { id: 'c', text: 'The bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street. For example, the school should add a second, larger bike rack near the gym doors.' },
        { id: 'd', text: 'The bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street, because the school should add a second, larger bike rack near the gym doors.' },
      ],
      expectedAnswer: 'The bike rack behind the gym holds only ten bikes, but more than twenty-five students have started riding to school since the new bike lane opened on Sycamore Street. Therefore, the school should add a second, larger bike rack near the gym doors.',
      hints: [
        'Say the relationship first. The rack being too small for the new riders is stated as a fact on its own — does the sentence about a second rack explain why the rack is too small, or does it follow because the rack is already too small?',
        'A crowded ten-bike rack is not explained by a school building a second rack, and adding a rack is not one example among several crowded moments. Building the rack is what should happen as a result of the reason already given.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-example-proves-the-reason',
      kind: 'try_yourself',
      problem:
        'A general reason is already written below. Which sentence correctly adds one specific case that proves it actually happens?\n\nOur school should keep the gym open during lunch every time a storm floods the courtyard, because whenever that happens, many students end up with nowhere good to sit once the covered areas fill up.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Consequently, the school shortened lunch periods by five minutes the following semester to reduce crowding near the covered walkways.' },
        { id: 'b', text: 'For example, during the thunderstorm last month, more than thirty sixth graders ended up eating lunch on the stairwell floor because every hallway bench was already taken.', correct: true },
        { id: 'c', text: 'However, during the thunderstorm last month, more than thirty sixth graders ended up eating lunch on the stairwell floor because every hallway bench was already taken.' },
        { id: 'd', text: 'Because more than thirty sixth graders ended up eating lunch on the stairwell floor during the thunderstorm last month, our school should keep the gym open during lunch every time a storm floods the courtyard.' },
      ],
      expectedAnswer: 'For example, during the thunderstorm last month, more than thirty sixth graders ended up eating lunch on the stairwell floor because every hallway bench was already taken.',
      hints: [
        'Say what the task needs first: one specific moment where the seating shortage from the general reason actually happened. Which choice describes that exact moment, and which choices describe something else — a later school decision, or a chain of events running backward?',
        'Two choices describe the very same stairwell moment; only one of those two also uses the word built for introducing a specific case rather than a turn against the claim. The other two choices describe something that does not itself show the shortage happening.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fancy-words-and-interchangeable-words',
      kind: 'misconception_check',
      question:
        'A student is revising an argument and writes: "Our school should let clubs meet during lunch instead of only after school. Consequently, the debate club had only four members show up to their after-school meeting last Thursday because most kids have after-school jobs or rides they cannot miss." The student explains it this way: "I used consequently because it sounds more official than because, and they basically mean the same thing anyway." What has gone wrong here?',
      commonErrors: [
        {
          answer: 'Our school should let clubs meet during lunch instead of only after school. Consequently, the debate club had only four members show up to their after-school meeting last Thursday because most kids have after-school jobs or rides they cannot miss.',
          misconception:
            'Believing that a formal-sounding linking word can replace a plainer one because they seem close enough in meaning. "Consequently" signals that what follows is a result of something already stated, but the four-member turnout is not a result of the claim — it is one specific case offered as proof that clubs need a different meeting time. The relationship is illustration, not result.',
          correctsTo:
            'Swap "Consequently" for a word from the example family: "Our school should let clubs meet during lunch instead of only after school. For example, the debate club had only four members show up to their after-school meeting last Thursday because most kids have after-school jobs or rides they cannot miss." "For example" correctly marks the Thursday meeting as one specific case that backs up the claim, and "because" inside that same sentence correctly explains why the low turnout happened.',
        },
        {
          answer: '"Consequently" and "because" basically mean the same thing.',
          misconception:
            'Treating every linking word as an interchangeable way to say "this connects to that," instead of checking which specific relationship each word names. Because and consequently point in opposite directions: because attaches a reason directly to the claim it explains, and consequently introduces something that happens as a result of a reason already given.',
          correctsTo:
            'Test the direction before picking either word. If the sentence being written explains why the claim is true, reach for because. If the sentence states something that happens because a reason already exists, reach for consequently or therefore. Swapping the two does not just sound different — it can make a sentence claim the opposite chain of events from the one that is actually true.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A linking word\'s job is to name the RELATIONSHIP between a claim and a reason, not just to sound grown-up.',
        'Because and since attach a reason directly to the claim it explains: "claim, because reason."',
        'Therefore, consequently and as a result introduce something that follows because a reason came first: "reason. Therefore, claim."',
        'For example and for instance introduce one specific case that backs up a reason that has already been stated in general terms.',
        'A linking word can be spelled correctly and still be wrong, if it names a relationship that is not actually there — "however" is a completely correct word that is still the wrong choice whenever nothing turns against the claim.',
        'Before choosing a word, say the relationship in plain words first: "this explains it," "this follows from it," or "this is one example of it." Then pick the family that matches.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Linking Words for Claims & Reasons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
