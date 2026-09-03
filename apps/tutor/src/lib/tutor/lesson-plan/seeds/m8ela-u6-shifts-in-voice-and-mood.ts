/**
 * Grade 8 ELA — Sentence Style & Punctuation: Shifts in Voice & Mood.
 *
 * PROCEDURE-LED, on the model of `m8ela-u5-active-and-passive-voice.ts`. One
 * repeatable move runs the whole lesson: find the verb that changed form, ask
 * whether the meaning really changed, and if it did not, put that single verb
 * back into the voice or mood the writing already set (CCSS L.8.1d). Three
 * traps this plan is built to kill: treating every change of form as a
 * defect, so a genuine change of doer gets "repaired" out of a passage;
 * repairing a mood shift in the wrong direction, by flattening working
 * commands into statements until the whole list matches and instructs nobody;
 * and letting "was" slide back into a wish that the sentence already marked as
 * imagined.
 *
 * SCOPE GUARD: Grade 8 row 6.1 recognizes and corrects an inappropriate shift
 * in verb voice (active to passive mid-sentence with no reason: "Maya washed
 * the dishes and then the floor was mopped") or in verb mood (a command
 * sliding into a statement in a list of steps; a wish that drops out of the
 * subjunctive) within a sentence or short passage. A whole-passage repair row
 * on the same lineage as `m7ela-u5-verb-tense-consistency.ts` (L.7.1: "pick
 * one tense and hold it"; the test is whether the TIME changed) and G6's
 * `m6ela-u5-keeping-pronoun-number-and-person-consistent.ts` (L.6.1c). G8
 * applies the "did the meaning really change?" test to voice and mood instead
 * of tense. Assumes rows 5.3-5.4. Stops short of HS
 * `engl-u1-verb-tense-and-form.ts` (L.9-10.1: shifts licensed by signal words
 * across perfect tenses).
 *
 * DELIBERATELY EXCLUDED: the identification lesson for the active and passive
 * voice, which is row 5.3 — this file never runs a find-the-doer test to
 * label a sentence for its own sake, never asks a student to convert a
 * sentence into the other voice for its own sake -- where a passive is turned
 * back into an active here it is always the repair of a shift the meaning did
 * not license -- and never lists the forms of "be"; the
 * identification lesson for verb mood, which is row 5.4 — the words
 * "indicative", "imperative", "interrogative" and "conditional" appear nowhere
 * in the body below, no keyIdea, step, choice or recap line names or counts
 * the moods, and no item asks a student to sort a sentence by mood; choosing
 * a voice or a mood for an effect a writer wants, which is row 6.2 — every
 * question in this file asks whether a change was licensed by the meaning
 * already there, never which form would serve a purpose better; the perfect
 * tenses and the signal words that license a shift across them, which are HS
 * `engl-u1-verb-tense-and-form.ts`'s — the strings "has been", "have been",
 * "had been" and "will have been" appear nowhere in the body; tense
 * consistency itself, which is `m7ela-u5-verb-tense-consistency.ts`'s and is
 * assumed — no item in this file turns on a tense change and no repair here
 * changes a verb's tense; person and number shifts in pronouns, which are
 * `m6ela-u5-keeping-pronoun-number-and-person-consistent.ts`'s; and the single
 * dash, the pause comma and the ellipsis, which are rows 6.3 and 6.4.
 *
 * DELIBERATELY ALLOWED, because the two Unit 5 rows and the G7 row sit
 * directly below this one and the test is inherited: (a) the concept opens by
 * reminding the student in one sentence that one tense is held across a
 * stretch of writing unless the time really changes, because this row's whole
 * test is that same question asked about a different pair of forms — that is
 * a one-line reuse of the G7 rule, not a re-teaching of it, and no keyIdea
 * here explains, names or drills a tense; (b) the phrase "a form of 'be'
 * plus the third shape" appears once, inside a worked-example step, as the
 * evidence that a verb changed voice — the student arrives with that shape
 * from row 5.3 and it is used as a check here, never taught; (c) the word
 * "subjunctive" appears three times in the body -- in the learning objective,
 * in one keyIdea and in one recap line -- always as the name of a form the
 * student already has, and the file never
 * explains how that form is built beyond the one word "were" that the shift
 * turns on; (d) a licensed passive is described once as
 * "doing a job", which is a statement about whether the meaning required the
 * change, not a recommendation about which form a writer should prefer.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every faulty sentence IN THE TUTOR'S OWN PROSE is
 * labeled WRONG with the CORRECT version beside it: a tutor reads these lines
 * aloud, and an unlabeled "the floor was mopped" would be handed to the
 * student as a model. Never write a broken example bare in prose. The only
 * unlabeled faulty sentences in this file are the MCQ distractors the three
 * try_yourself items ask the student to reject, and the two student revisions
 * quoted inside the misconception check, each of which is named and corrected
 * in full where it appears.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented prose
 * about an invented school — a group-chat message, a set of club directions,
 * a pool-deck note, a posted notice, one line of personal narrative — which is
 * true by construction, so there is no factual claim about the world to
 * verify. No statistic, no measurement and no scientific mechanism appears
 * anywhere; the only quantities in the file are clock times and small counts
 * inside the invented scenes (seven in the morning, ten minutes early, four
 * o'clock, rows of eight), each one stipulated by the scene that prints it. The only
 * assertions the file makes are grammatical ones about English usage, and each
 * is stated with its licensed exception rather than as an absolute. Rows whose
 * passages are INFORMATIONAL (all of Units 3 and 4, and any other row needing
 * nonfiction) must carry the four-column claim ledger described in the fan-out
 * contract instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U6_SHIFTS_IN_VOICE_AND_MOOD: LessonPlan = {
  id: 'evelyn.ms.m8ela.shifts-in-voice-and-mood.v1',
  title: 'Shifts in Voice & Mood',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.shifts-in-voice-and-mood',
      standard: 'M8ELA-6.1',
      description:
        'Recognize and correct an inappropriate shift in verb voice (active to passive mid-sentence with no reason: "Maya washed the dishes and then the floor was mopped") or in verb mood (a command sliding into a statement in a list of steps; a wish that drops out of the subjunctive) within a sentence or short passage (CCSS L.8.1d).',
    },
  ],
  prerequisites: ['m8ela.verb-moods'],
  followUps: ['m8ela.voice-and-mood-for-effect'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a sentence can be spelled correctly, punctuated correctly and complete, and still leave a reader unsure whose job it is, because one verb changed form partway through.',
      script:
        'Your club posts the setup steps for the fundraiser in the group chat. The first two lines are clear enough: bring your box to the cafeteria by seven, set the price cards where people can see them. Then line three arrives. WRONG: "The money box is picked up from the office by a volunteer." Read that standing in the cafeteria at seven in the morning holding a tray of brownies. Are you the volunteer? Has somebody already gone? The step stopped telling you what to do and started telling you what happens to things. CORRECT: "Pick up the money box from the office." Same information, one changed verb, and now you know it is your job. Nothing in that third line was misspelled, and it was a complete sentence, which is exactly why this mistake survives every read-through. You already know a command from a statement, and you already know the active voice from the passive. Today you learn to catch the moment a piece of writing slides from one to the other for no reason, to prove that nothing in the meaning called for the slide, and to fix it by changing one verb.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-shifts-and-the-meaning-test',
      kind: 'concept',
      goal: 'Install the did-the-meaning-really-change test, the two shift shapes that break a passage, the changes the meaning genuinely licenses, and the one-verb repair.',
      keyIdeas: [
        'A SHIFT IS A CHANGE PARTWAY THROUGH, AND THE ONLY QUESTION IS WHETHER THE MEANING CALLED FOR IT. You already hold one tense across a stretch of writing unless the time really changes. Voice and mood work the same way. The first verb of a sentence or a passage sets a voice and a mood, and every verb after it stays there unless something in the meaning gives a reason to move. So the test is never "did the form change?" It is "did the meaning really change?"',
        'A VOICE SHIFT BREAKS A SENTENCE WHEN ONE DOER IS STILL DOING EVERYTHING. If the same person performs both actions, both verbs stay active and the reader never has to ask who. Sliding into the passive halfway through drops the doer out of the second half and sends the reader hunting for a person who was standing right there in the first half. WRONG: "Maya washed the dishes and then the floor was mopped." CORRECT: "Maya washed the dishes and then mopped the floor."',
        'SOME CHANGES OF VOICE ARE CORRECT, BECAUSE THE DOER REALLY DID CHANGE. When the second action has a different doer, or a doer nobody knows, the passive is doing a job and the change is licensed. CORRECT: "The eighth graders decorated the gym, and the tickets were printed downtown." The students did not print the tickets, and the sentence never claims they did. So ask what the doer is in each half. The same doer means the writing only slid. A different doer, or no known doer, means the meaning changed and the sentence stays as it is.',
        'A MOOD SHIFT BREAKS A LIST OF STEPS WHEN ONE STEP STOPS BEING A COMMAND. Instructions are written as commands, and every step in the list has the same job, so every step takes the same form. A step that slides into a statement about what happens, or into advice about what a reader should do, reads as optional beside the steps around it. WRONG: "Rinse the beaker, dry it with a paper towel, and then you should record the mass." CORRECT: "Rinse the beaker, dry it with a paper towel, and record the mass."',
        'A WISH THAT DROPS OUT OF THE SUBJUNCTIVE IS THE OTHER MOOD SHIFT. Once a sentence sets up something imagined rather than real, every verb inside that imagined stretch keeps the form the setup demands, and "was" is the word that most often slips back in. WRONG: "I wish the tryout list were posted tonight and the coach was easier to read." CORRECT: "I wish the tryout list were posted tonight and the coach were easier to read." The second half is no more real than the first, so nothing licensed the change.',
        'THE FIX IS THE ONE VERB THAT BROKE AWAY, NOT A REWRITE. Find the verb whose form changed, ask whether anything in the meaning called for the change, and if nothing did, put that single verb back into the voice or mood the writing already set. Leave every other sentence alone. A repair that rewrites three lines to bury one bad verb usually deletes information the passage needed, and it hides the mistake from the writer instead of showing it.',
      ],
      vocabulary: [
        { term: 'shift', definition: 'a change in verb voice or verb mood partway through a sentence or a passage.' },
        { term: 'inappropriate shift', definition: 'a shift that nothing in the meaning called for, which leaves a reader hunting for a doer or unsure whether a line is an instruction.' },
        { term: 'licensed shift', definition: 'a change of voice or mood the meaning genuinely required, usually because the doer changed or because the sentence moved from something real to something imagined. It is not an error and is not repaired.' },
        { term: 'the meaning test', definition: 'the one question this lesson runs on every change of form: did the meaning really change, or did the writing only slide?' },
        { term: 'the one-verb fix', definition: 'the repair for an inappropriate shift: put the single verb that broke away back into the voice or mood the writing already set, and change nothing else.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-repair-a-voice-shift-in-a-passage',
      kind: 'worked_example',
      problem:
        'Find every change of voice in this passage, decide which ones the meaning licensed, and repair only the ones it did not.\n\n"Devon set up the folding chairs along the back wall, and then the banner was hung over the doorway. He counted the programs twice. The programs were printed by the front office on Thursday."',
      steps: [
        'Set the baseline first, because a shift is only a shift away from something. The first verb is "set up", and Devon is the one doing it, so the passage opens in the active voice with Devon as the doer. Every later verb gets compared against that.',
        'Take the second half of the first sentence: "the banner was hung over the doorway." That is a form of "be" plus the third shape, so the voice has changed. Do not repair anything yet. Run the test: ask who hung the banner. The sentence never says, and the only person anywhere in the passage is Devon, who is standing at that wall setting up chairs. Nothing changed but the form of the verb.',
        'So the change was not licensed, and the repair is one verb. WRONG: "Devon set up the folding chairs along the back wall, and then the banner was hung over the doorway." CORRECT: "Devon set up the folding chairs along the back wall, and then hung the banner over the doorway." Devon is still the subject, he is now the doer of both actions, and not one other word moved.',
        '"He counted the programs twice" needs nothing. It is active, its doer is Devon, and that matches the baseline exactly.',
        'Last sentence: "The programs were printed by the front office on Thursday." The voice has changed again, so ask the same question rather than reaching for the same answer. Who did the printing? The front office, and the sentence says so. That is a different doer, named in the sentence itself, and nothing in the passage puts Devon anywhere near the printing. The meaning really did change, so this one is licensed and it stays exactly as written.',
        'Read the two verdicts side by side, because they are the whole lesson. Both sentences changed voice. One changed for no reason and one changed because the doer changed. The form told you nothing on its own. The doer told you everything.',
      ],
      answer:
        'One repair: "Devon set up the folding chairs along the back wall, and then hung the banner over the doorway." The last sentence, "The programs were printed by the front office on Thursday," also changes voice, but that change is licensed, because the front office is a different doer, so it stays as written.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-two-mood-shifts',
      kind: 'worked_example',
      problem:
        'Repair the shift in each of these, and say what told you the shift was not licensed.\n\nA, from the directions on a club sign-up page: "Log in with your school email, choose the club you joined, and then your photo gets uploaded on the last screen."\n\nB, from a personal narrative: "I wish the bus stop were closer to my street, and I wish practice was an hour later on Tuesdays."',
      steps: [
        'Piece A, baseline. The first verb is "Log in", aimed straight at the reader, and the second, "choose", is aimed the same way. Two steps, same form, same job.',
        'Third step: "your photo gets uploaded on the last screen." That is no longer a command. It is a statement about what happens, and it tells the reader to do nothing at all. Somebody following this list exactly does two things and then waits.',
        'Run the test before touching it. Did the meaning change? The step belongs to the same reader, on the same page, in the same sitting, and somebody still has to upload that photo. Nothing changed, so the shift is inappropriate.',
        'Repair the one verb. WRONG: "Log in with your school email, choose the club you joined, and then your photo gets uploaded on the last screen." CORRECT: "Log in with your school email, choose the club you joined, and upload your photo on the last screen." Three steps in one form, and the last one is now something a reader can actually do.',
        'Piece B, baseline. "I wish the bus stop were closer to my street" sets up something that is not true: the stop is where it is. The form "were" after "wish" is what marks the sentence as imagined rather than real.',
        'Second half: "I wish practice was an hour later on Tuesdays." Same "I wish", same imagined situation, and the verb has slipped to "was". Ask the test question one more time. Did anything become real between one half of the sentence and the other? No. CORRECT: "I wish the bus stop were closer to my street, and I wish practice were an hour later on Tuesdays."',
      ],
      answer:
        'A: "Log in with your school email, choose the club you joined, and upload your photo on the last screen." The last step still has to be done by the same reader, so nothing licensed the change from a command to a statement. B: "I wish the bus stop were closer to my street, and I wish practice were an hour later on Tuesdays." Both halves are wishes about things that are not true, so "was" had no reason to appear in the second one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-unlicensed-shift',
      kind: 'try_yourself',
      problem: 'Which sentence contains a change of voice or mood that nothing in the meaning licensed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The seventh graders folded the programs on Thursday, and the tables were delivered by a rental company early the next morning.' },
        { id: 'b', text: 'The gym floor was swept before lunch, and the folding chairs were stacked against the far wall by the end of the day.' },
        { id: 'c', text: 'Bring your permission slip to the front office, and sign it on the line at the bottom before you hand it to Ms. Okafor.' },
        { id: 'd', text: 'Ruben carried the last crate in from the parking lot, and then it was set down next to the stage before anyone else arrived.', correct: true },
      ],
      expectedAnswer: 'Ruben carried the last crate in from the parking lot, and then it was set down next to the stage before anyone else arrived.',
      hints: [
        'Compare the two halves of each sentence. Ask who is doing the action in the first half, and then ask who is doing it in the second.',
        'A change of voice is a defect only when the doer stayed the same. One of these changes voice and then names a different doer, one keeps the same form from beginning to end, and one is two commands in a row. That leaves the sentence that changes voice with nobody new anywhere in it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-repair',
      kind: 'try_yourself',
      problem:
        'A club officer wrote these directions for the fundraiser table. Which revision repairs the shift without changing what the directions ask a reader to do?\n\n"Count the cash box before the doors open, tape the price list to the front of the table, and then the extra bags are stored under the chairs."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Count the cash box before the doors open, tape the price list to the front of the table, and store the extra bags under the chairs.', correct: true },
        { id: 'b', text: 'The cash box is counted before the doors open, the price list is taped to the front of the table, and the extra bags are stored under the chairs.' },
        { id: 'c', text: 'Count the cash box before the doors open, tape the price list to the front of the table, and then you should store the extra bags under the chairs.' },
        { id: 'd', text: 'Count the cash box before the doors open, tape the price list to the front of the table, and then the extra bags should be stored under the chairs.' },
      ],
      expectedAnswer: 'Count the cash box before the doors open, tape the price list to the front of the table, and store the extra bags under the chairs.',
      hints: [
        'These directions are a list of steps, so decide first what form the two steps that already work are in, and then ask what the last step would have to be to match them.',
        'A repair has to leave the reader with the same instructions it started with. A revision that turns every step into a statement about what happens, or into advice about what a reader should do, matches itself perfectly and instructs nobody.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-line-needs-repair',
      kind: 'try_yourself',
      problem:
        'A coach posted this note outside the locker room.\n\n"Get to the pool deck ten minutes early. Sign in on the clipboard by the door. Your swim cap is pulled on before you get in the water. Kickboards are handed out by the coaches at the shallow end."\n\nWhich statement about the note is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both of the last two lines have to be repaired, because a list of steps holds one form from beginning to end, so every sentence in the note that is not a command to the reader is a shift that has to be undone.' },
        { id: 'b', text: '"Your swim cap is pulled on before you get in the water" has to be repaired, because the reader is the one pulling the cap on and every other step is a command, so nothing in the meaning called for that change.', correct: true },
        { id: 'c', text: '"Kickboards are handed out by the coaches at the shallow end" has to be repaired, because it is the only line in the note that names its doer, and the three lines above it name no doer at all.' },
        { id: 'd', text: 'Nothing in the note has to be repaired, because every line is a complete sentence with a subject and a verb, and a writer may move between commands and statements as long as the reader can still follow the order of the steps.' },
      ],
      expectedAnswer: '"Your swim cap is pulled on before you get in the water" has to be repaired, because the reader is the one pulling the cap on and every other step is a command, so nothing in the meaning called for that change.',
      hints: [
        'Go line by line and ask who performs the action in each one. Then ask whether that person is the reader the note was written for.',
        'One line describes something the reader does but is written as though it happens on its own. Another describes something the coaches do, which is a genuinely different doer. Only one of those two changed form for no reason.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-any-change-is-an-error',
      kind: 'misconception_check',
      question:
        'Two students revise the same three-sentence notice. It reads: "Set the chairs out in rows of eight. Leave the center aisle clear. The microphones are tested by the tech crew at four o\'clock." The first student writes: "The last sentence is the shift, so it should say Test the microphones at four o\'clock." The second student writes: "The first two sentences are the shift, so they should say The chairs are set out in rows of eight and The center aisle is left clear." What has gone wrong with each revision?',
      commonErrors: [
        {
          answer: 'The last sentence is the shift, so it should say "Test the microphones at four o\'clock."',
          misconception:
            'Hunting for any change of form instead of asking whether the meaning changed. The student has learned that a statement sitting among commands is worth a second look, which is true, and has stopped there instead of running the test.',
          correctsTo:
            'Ask who does the action. Setting out chairs and clearing the aisle are the reader\'s jobs; testing the microphones is the tech crew\'s, and the sentence says so in the "by" phrase. Rewriting it as "Test the microphones at four o\'clock" hands the reader a job that belongs to somebody else and deletes the crew from the notice entirely. The doer really did change, so the change of form is licensed and that sentence stays exactly as it is. A shift is a defect only when nothing in the meaning called for it.',
        },
        {
          answer: 'The first two sentences are the shift, so they should say "The chairs are set out in rows of eight" and "The center aisle is left clear."',
          misconception:
            'Repairing in the wrong direction. The student is right that the three sentences do not match and wrong about which ones set the pattern, so the fix flattens the two working commands until everything matches and nothing instructs anybody.',
          correctsTo:
            'Two of the three sentences are commands, and the notice exists to tell a reader what to do, so the commands are the pattern and the third sentence is the one to examine. Examining it shows a real change of doer, which means it is licensed, so the notice is already correct and the finished version is the one that was posted. Repairing a shift means putting back the one verb that broke away from what the writing already set. It never means rewriting the lines that were doing their job.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The first verb sets the voice and the mood, and every verb after it stays there unless the meaning gives a reason to move. The test is not "did the form change?" It is "did the meaning really change?"',
        'A change of voice with the same doer on both sides is a slide, not a decision. WRONG: "Maya washed the dishes and then the floor was mopped." CORRECT: "Maya washed the dishes and then mopped the floor."',
        'A change of voice is licensed when the doer really changed or when nobody knows the doer. "The eighth graders decorated the gym, and the tickets were printed downtown" needs no repair, because the students did not print the tickets.',
        'In a list of steps every step is a command. WRONG: "Rinse the beaker, dry it with a paper towel, and then you should record the mass." CORRECT: "Rinse the beaker, dry it with a paper towel, and record the mass."',
        'A wish stays in the subjunctive all the way through, and "was" is the word that slips back in. WRONG: "I wish the tryout list were posted tonight and the coach was easier to read." CORRECT: "I wish the tryout list were posted tonight and the coach were easier to read."',
        'Repair the one verb that broke away and leave everything else alone. Flattening the sentences that were working until the whole passage matches is consistent, and it instructs nobody.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Shifts in Voice & Mood' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
