/**
 * Grade 8 ELA — Grammar: Verbals, Voice & Mood: Active & Passive Voice.
 *
 * PROCEDURE-LED exemplar for the m8ela fan-out. There is one repeatable move
 * and the whole lesson makes it fluent: find the verb, find the doer, and
 * check whether the subject IS that doer (active) or RECEIVES the action
 * (passive), then confirm a passive by its shape — a form of "be" plus the
 * past participle — and swap the seats to convert (CCSS L.8.1b). The shape of
 * this file is deliberately different from the concept-led exemplar: the
 * concept segment is an ordered recipe rather than a way of reading, the
 * first worked example runs the identification test three times so the
 * pattern is unmistakable, the second runs the conversion in both directions,
 * and every wrong form on the page is labeled. Four traps this plan is built
 * to kill: "was" or "by" taken as proof of the passive ("The lights were
 * flickering by the exit door" is active), a missing "by" phrase taken as
 * proof of the active ("The scoreboard was reset" is passive), the second
 * shape put after "be" ("was chose"), and the half conversion that adds the
 * helper but never moves the receiver ("The committee was chosen the photo").
 *
 * SCOPE GUARD: Grade 8 row 5.3 forms and identifies the active and passive
 * voice: find the doer, check whether the subject IS the doer (active) or
 * RECEIVES the action (passive: a form of "be" + past participle, doer
 * optional in a "by" phrase), and convert a sentence each way. Identification
 * and conversion only; choosing between them for effect is row 6.2, and
 * fixing unwanted shifts is row 6.1. Builds on
 * `m7ela-u5-verb-tense-consistency.ts` (L.7.1: the "third shape needs a
 * helper" — gone/seen/done after have/has/had), which supplies the past
 * participle G8 now puts after "be", and on
 * `m7ela-u5-subject-verb-agreement.ts` (L.7.1: finding the true subject).
 * Stops short of HS `engl-u1-verb-tense-and-form.ts` (L.9-10.1: perfect
 * tenses and the participle after "be" at HS register) and
 * `engl-u4-precision-and-concision.ts` (L.9-10.3: cutting weak verb-plus-noun
 * constructions). DELIBERATELY EXCLUDED: the -ing lookalike pair and the
 * participle doing an adjective's job (row 5.1 — this lesson meets the past
 * participle only as the second half of a passive verb, never as a modifier);
 * infinitives and whole verbal phrases (row 5.2); verb moods (row 5.4); any
 * judgment about which voice a writer SHOULD use for a purpose, including
 * emphasis and the hidden doer (row 6.2); the repair of a voice shift inside
 * a sentence or passage (row 6.1); the perfect tenses — no sentence the
 * tutor labels, converts or prints as a specimen carries "has been", "had
 * been" or "will have been", and the only forms of "be" this file names are
 * the eight simple ones; and the irregular verb chart itself, which is not
 * re-taught. DELIBERATELY ALLOWED, because the G7 rows and rows 5.1 and 6.2
 * sit close: the concept, one worked step, one hint and one recap line say
 * that the THIRD shape, not the second, follows "be" (WRONG: "was chose";
 * CORRECT: "was chosen") — that is a one-line reuse of the G7 irregular-forms
 * rule, not a re-teaching of it, and no keyIdea walks the first-second-third
 * chart of any verb; the hook, the concept, both worked examples and the
 * misconception check observe that a passive sentence may leave its doer out,
 * because that structural fact is what the identification rests on, and each
 * stops before saying when a writer should do so; the concept says once that
 * neither voice is an error and names the
 * choice as a later lesson; and the progressive "be + -ing" and the linking
 * "be + describing word" appear as lookalikes labeled not-passive, which is
 * not a lesson on tense or on linking verbs.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every ungrammatical example IN THE TUTOR'S OWN
 * PROSE is explicitly labeled WRONG, with the CORRECT version beside it: a
 * tutor reads those lines aloud, and an unlabeled "was chose" would be
 * handed to the student as a model. Never write a broken example bare in
 * prose. The only unlabeled wrong forms in this file are the MCQ distractors
 * the three try_yourself items ask the student to reject, which is exactly
 * what those items are for; each one is then named in that item's hints or
 * in the misconception check. No contraction appears anywhere in this file,
 * in the tutor's voice or in reported speech; the one quoted reflection-form
 * sentence in the hook is written out in full.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative prose about an invented school, which is true by construction,
 * so there is no factual claim to verify. Rows whose passages are
 * INFORMATIONAL (all of Units 3 and 4, and any other row needing nonfiction)
 * must carry the four-column claim ledger described in the fan-out contract
 * instead of this line.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.2 -> 5.3 ->
 * 5.4 (m8ela.infinitives-and-verbal-phrases -> this -> m8ela.verb-moods).
 * Both arrays are EMPTY here on purpose: this exemplar is registered first
 * and alone, before its neighbors exist, and lint-ms-plans rejects a chain
 * reference that does not resolve. The controller wires both at the batched
 * registration. Fan-out rows must NOT copy the empty arrays — see the
 * contract's "full course chain" section.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U5_ACTIVE_AND_PASSIVE_VOICE: LessonPlan = {
  id: 'evelyn.ms.m8ela.active-and-passive-voice.v1',
  title: 'Active & Passive Voice',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.active-and-passive-voice',
      standard: 'M8ELA-5.3',
      description:
        'Form and identify the active and passive voice: find the doer, check whether the subject IS the doer (active) or RECEIVES the action (passive: a form of "be" + past participle, doer optional in a "by" phrase), and convert a sentence each way (CCSS L.8.1b).',
    },
  ],
  prerequisites: ['m8ela.infinitives-and-verbal-phrases'],
  followUps: ['m8ela.verb-moods'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already hears the difference between a sentence with a doer in it and a sentence without one, and that the difference has a name and a test.',
      script:
        'The group project is over, and the reflection form asks what went wrong. One teammate writes: "The slides were finished the night before and the sources were never checked." Read that again and look for a person. There is not one. The slides were finished, the sources were never checked, and nobody in that sentence did either thing. Now compare: "I finished the slides the night before and I never checked the sources." Same two events, same slides, same sources, and suddenly there is a doer standing in front of each verb. You already hear the difference between those two sentences. What you will have by the end of today is a name for it, a three-step test that tells you which one is in front of you, and a way to flip any sentence from one to the other without changing what it says. Which version a writer should pick, and why, is a later lesson. Today is about seeing the machinery.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-voice-and-the-doer-test',
      kind: 'concept',
      goal: 'Install the doer-receiver idea, the three-step identification test, the be-plus-third-shape form of the passive, the two lookalikes that are not passive, and the seat-swap conversion that holds the tense still.',
      keyIdeas: [
        'VOICE IS ABOUT WHO IS SITTING IN THE SUBJECT SEAT. Most action sentences have a doer and a receiver. In the ACTIVE voice the subject is the doer: "Priya broke the record." In the PASSIVE voice the subject is the receiver, the thing the action was done to: "The record was broken by Priya." Same event, same two nouns, different seats. Neither voice is an error. Which one to use for a purpose is a later lesson; today the job is to see which one is in front of you and to be able to flip it.',
        'THE TEST IS THREE STEPS, IN ORDER. Find the verb. Ask who or what does that action; that is the doer, whether or not it is in the sentence. Find the true subject, the word the verb belongs to, the same way you already find it to make the verb agree. Then compare: if the subject IS the doer, the sentence is active. If the subject RECEIVES the action, the sentence is passive.',
        'THE PASSIVE HAS A SHAPE, AND THE SHAPE IS YOUR CHECK. A passive verb is a form of "be" (am, is, are, was, were, be, being, been) followed by the past participle, which is the third shape from the verb chart you already know, the shape that cannot stand alone: seen, taken, chosen, written, painted. There it needed have, has or had in front of it; here the helper is "be". Both parts are required, and it has to be the third shape, not the second. WRONG: "The photo was chose by the committee." CORRECT: "The photo was chosen by the committee."',
        'THE DOER IS OPTIONAL IN THE PASSIVE, AND WHEN IT APPEARS IT RIDES IN A "BY" PHRASE. "The record was broken by Priya" and "The record was broken" are both passive. So a missing "by" phrase proves nothing, and a present "by" phrase proves nothing either, because "by" also marks places and times: "Priya waited by the door" is active, since Priya does the waiting and a door cannot wait for anyone. Test any "by" phrase by asking what it answers. "By whom?" is a doer. "Where?" or "When?" is not.',
        'TWO LOOKALIKES ARE NOT PASSIVE, EVEN THOUGH BOTH START WITH A FORM OF "BE". "Be" plus an -ing main verb is active: "The team was practicing" means the team did the practicing. "Be" plus a describing word is not an action at all: "The bus was late" has nothing being done to anyone, so there is nothing to receive. The one -ing word that does not settle it is "being" itself, because "The risers were being carried by the crew" still ends in the third shape, carried, and it is passive. Look for the third shape, not for "was".',
        'CONVERTING IS A SEAT SWAP WITH THE TENSE HELD STILL. Active to passive: move the receiver into the subject seat, put "be" in the tense the original verb had, add the third shape, and either put the doer in a "by" phrase or drop it. "Chose" becomes "was chosen", "chooses" becomes "is chosen", "will choose" becomes "will be chosen". Passive to active: take the doer out of the "by" phrase, put it in the subject seat, give the verb back its plain shape with no helper, and move the receiver after the verb. If the passive never named a doer, you cannot write the active version without knowing who did it. WRONG: "The committee was chosen the photo." CORRECT: "The photo was chosen by the committee."',
      ],
      vocabulary: [
        { term: 'active voice', definition: 'the form of a sentence in which the subject is the doer of the verb, as in "Priya broke the record."' },
        { term: 'passive voice', definition: 'the form of a sentence in which the subject receives the action, built from a form of "be" plus the past participle, as in "The record was broken by Priya."' },
        { term: 'doer', definition: 'the person or thing that performs the action of the verb, whether or not it is the subject of the sentence.' },
        { term: 'receiver', definition: 'the person or thing the action is done to; in the passive voice it moves into the subject seat.' },
        { term: 'past participle', definition: 'the third shape of a verb (chosen, taken, written, painted), the one that cannot stand alone; after a form of "be" it builds the passive.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-three-sentences',
      kind: 'worked_example',
      problem:
        'Label each sentence ACTIVE or PASSIVE, and say how you know.\n\n(1) "The drama club painted the new backdrop over two weekends."\n(2) "The new backdrop was painted over two weekends."\n(3) "The new backdrop was drying by the loading dock all afternoon."',
      steps: [
        'Sentence 1. Find the verb: painted. Ask who or what did the painting: the drama club. Find the true subject, the word the verb belongs to: the drama club. The subject is the doer, so this sentence is ACTIVE. Notice where the receiver sits: the backdrop comes after the verb, which is where a receiver sits in an active sentence.',
        'Sentence 2. Find the verb: was painted. Ask who did the painting. The sentence never says. Find the subject: the new backdrop. A backdrop cannot paint anything, so the subject is not the doer; it is the thing the painting was done to. The subject receives the action, so this sentence is PASSIVE.',
        'Confirm it by shape before you move on, because the shape is the check that does not depend on your judgment. "Was" is a form of be, and "painted" is the third shape of paint. Be plus the third shape is the passive form. The missing doer does not change the verdict; a passive sentence is allowed to leave the doer out.',
        'Sentence 3. This one is built to look like sentence 2. It has "was" and it has "by", and it is still ACTIVE. Find the verb: was drying. Ask who or what was doing the drying: the backdrop itself, which is the subject. The -ing word after "was" is the main action, not a third shape, so the be-plus-third-shape pair is not here.',
        'Now check the "by" phrase, because it is the second half of the trap. Ask what "by the loading dock" answers. It answers where, not by whom. A "by" phrase only marks a doer when the thing after "by" could have done the action, and a loading dock cannot dry a backdrop.',
        'Read the three verdicts together: 1 active, 2 passive, 3 active. The word "was" appeared in both 2 and 3 and settled nothing on its own. The subject-is-the-doer test settled all three, and the third shape confirmed the one passive.',
      ],
      answer:
        'Sentence 1 is active: the drama club, the subject, did the painting. Sentence 2 is passive: the backdrop, the subject, received the painting, and "was painted" is be plus the third shape, with no doer named. Sentence 3 is active: "was drying" is be plus an -ing main verb, the backdrop is doing the drying, and "by the loading dock" names a place, not a doer.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-convert-both-ways',
      kind: 'worked_example',
      problem:
        'Convert each sentence into the other voice without changing what it says.\n\nSentence A (active): "Somebody left the gym lights on all night."\nSentence B (passive): "The fire alarm was pulled by a sixth grader during lunch."',
      steps: [
        'Sentence A, active to passive. Label the parts first. Verb: left. Doer: somebody. Receiver: the gym lights. Tense: past, because the sentence describes a night that is over.',
        'Move the receiver into the subject seat: "The gym lights ..." Then build the passive verb in two parts. First, "be" in the same tense as the original, matched to the new subject: the lights are plural and the time is past, so it is "were". Second, the third shape of leave, which is "left". That gives "The gym lights were left on all night."',
        'Now decide what to do with the doer. It can ride along in a "by" phrase or it can be dropped. Here the doer was only "somebody", which tells the reader nothing, so dropping it loses nothing. CORRECT: "The gym lights were left on all night." Also CORRECT, and clumsier: "The gym lights were left on all night by somebody."',
        'The error to watch for is a half conversion that adds the helper but never moves the receiver. WRONG: "Somebody was left the gym lights on all night." The subject is still the doer, so that sentence is not passive; it is only broken.',
        'Sentence B, passive to active. Label the parts. Verb: was pulled, which is be plus the third shape, so passive. Receiver, sitting in the subject seat: the fire alarm. Doer, riding in the "by" phrase: a sixth grader. Tense: past.',
        'Take the doer out of the "by" phrase and put it in the subject seat. Give the verb back its plain past shape with no helper: pulled. Put the receiver after the verb. CORRECT: "A sixth grader pulled the fire alarm during lunch." The word "by" is gone, because it only existed to carry the doer. WRONG: "A sixth grader was pulled the fire alarm during lunch."',
        'One limit worth knowing. Suppose sentence B read "The fire alarm was pulled during lunch", with no "by" phrase. You could not convert it to active without inventing a doer, because the active voice has to put a doer in the subject seat. Identify it as passive and leave it, unless you know who pulled it.',
      ],
      answer:
        'Sentence A in the passive: "The gym lights were left on all night." The doer "somebody" can be dropped. Sentence B in the active: "A sixth grader pulled the fire alarm during lunch."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-the-passive',
      kind: 'try_yourself',
      problem: 'Which sentence is in the PASSIVE voice?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The team photos were hung in the trophy case before the assembly started.', correct: true },
        { id: 'b', text: 'The band director waited by the gym doors with a stack of sheet music.' },
        { id: 'c', text: 'The stage crew was carrying the risers down the back hallway in pairs.' },
        { id: 'd', text: 'The whole eighth grade was restless through the final announcement.' },
      ],
      expectedAnswer: 'The team photos were hung in the trophy case before the assembly started.',
      hints: [
        'Run the test on each sentence: find the verb, ask who or what does that action, then check whether the subject is that doer or the thing the action is done to.',
        'Two of these contain a form of "be" and one contains "by", and none of that decides anything by itself. Look for the pair that makes a passive: a form of "be" followed by the third shape of an action verb. A "be" followed by an -ing word, or by a word that only describes the subject, is not that pair, and a "by" phrase that answers where is not a doer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-active',
      kind: 'try_yourself',
      problem: 'Which sentence is in the ACTIVE voice?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The fundraiser posters were designed by two students from the art club.' },
        { id: 'b', text: 'Two students from the art club designed all of the fundraiser posters.', correct: true },
        { id: 'c', text: 'The posters were being hung in the front hallway by the office staff.' },
        { id: 'd', text: 'The fundraiser posters were taped to the hallway walls before first period.' },
      ],
      expectedAnswer: 'Two students from the art club designed all of the fundraiser posters.',
      hints: [
        'Active means the subject is the doer. For each sentence, find the verb, then ask whether the subject did that action or had that action done to it.',
        'A "by" phrase that names a doer is a sign of the passive, not the active, and a sentence with no "by" phrase can still be passive. Check each verb for the be-plus-third-shape pair; an -ing word sitting in the middle of that pair does not break it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-convert-to-passive',
      kind: 'try_yourself',
      problem:
        'Which choice is the correct passive-voice version of this sentence?\n\n"The yearbook committee chose the cover photo at the last meeting."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The yearbook committee was chosen the cover photo at the last meeting.' },
        { id: 'b', text: 'The cover photo was chose by the yearbook committee at the last meeting.' },
        { id: 'c', text: 'The cover photo was chosen by the yearbook committee at the last meeting.', correct: true },
        { id: 'd', text: 'The cover photo will be chosen by the yearbook committee at the last meeting.' },
      ],
      expectedAnswer: 'The cover photo was chosen by the yearbook committee at the last meeting.',
      hints: [
        'Label the original first: the verb, the doer, the receiver and the tense. In the passive version the receiver has to move into the subject seat, and the doer has to leave it.',
        'Once the receiver is the subject, the verb has two parts: a form of "be" in the same tense the original had, then the third shape of the verb, not the second. Check each choice for all three things at once: the right subject, the right tense, the right shape.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-was-and-by-mean-passive',
      kind: 'misconception_check',
      question:
        'A student labels two sentences and explains each label. Sentence 1: "The hallway lights were flickering by the exit door all morning." The student says: "Passive, because it has were and it has by." Sentence 2: "The scoreboard was reset before the second half." The student says: "Active, because there is no by phrase, so the scoreboard must be the one doing it." What has gone wrong with each label?',
      commonErrors: [
        {
          answer: 'Sentence 1 is passive, because it has "were" and it has "by".',
          misconception:
            'Treating "be" and "by" as the markers of the passive instead of testing whether the subject is the doer. Both words show up in many passive sentences, so the student has learned to spot them, but neither one is the thing that makes a sentence passive.',
          correctsTo:
            'Run the real test. The verb is "were flickering". Ask who or what was doing the flickering: the hallway lights, which is the subject. The subject is the doer, so the sentence is ACTIVE. The shape confirms it: after "were" comes an -ing main verb, not a third shape, so the be-plus-third-shape pair is not there. And "by the exit door" answers where, not by whom; an exit door cannot flicker a light. A passive needs the subject to receive the action and needs be plus the third shape, and this sentence has neither.',
        },
        {
          answer: 'Sentence 2 is active, because there is no "by" phrase, so the scoreboard must be the doer.',
          misconception:
            'Assuming that the subject must be the doer whenever no other doer is named. The student is right that the passive often carries the doer in a "by" phrase, and wrong that it has to.',
          correctsTo:
            'The doer is optional in the passive. Ask who or what did the resetting. The sentence does not say, but it was not the scoreboard, because a scoreboard cannot reset itself. The subject receives the action, so the sentence is PASSIVE, and the shape agrees: "was" is a form of be, and "reset" is the third shape of reset, a verb that keeps the same shape in all three slots. If you want it active you have to know the doer: "The referee reset the scoreboard before the second half." Without that knowledge, label it passive and leave it as it is.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Active: the subject is the doer. "Priya broke the record." Passive: the subject receives the action. "The record was broken by Priya." Same event, different seat, and neither one is an error.',
        'The three-step test: find the verb, ask who or what does it, then check whether the subject is that doer or the thing the action is done to.',
        'The passive has a shape: a form of "be" (am, is, are, was, were, be, being, been) plus the third shape of the verb. WRONG: "The photo was chose by the committee." CORRECT: "The photo was chosen by the committee."',
        'The doer is optional in the passive and rides in a "by" phrase when it appears. No "by" phrase does not mean active, and a "by" phrase that answers where or when is not a doer.',
        '"Be" plus an -ing main verb is active ("The team was practicing"), and "be" plus a describing word is not an action at all ("The bus was late"). Neither is passive. Look for the third shape, not for "was".',
        'Converting is a seat swap with the tense held still: receiver into the subject seat, "be" in the original tense, third shape, doer into a "by" phrase or dropped. To go back to active you need a doer, and if the passive never named one you cannot convert it without knowing who it was.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Active & Passive Voice' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
