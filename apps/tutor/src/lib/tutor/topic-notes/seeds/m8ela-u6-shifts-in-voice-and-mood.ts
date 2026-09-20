/**
 * Grade 8 English Language Arts — Unit 6 CED 6.1: Shifts in Voice & Mood.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8ela.shifts-in-voice-and-mood.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8ELA_U6_SHIFTS_IN_VOICE_AND_MOOD: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8ela.shifts-in-voice-and-mood.v1',
  course: 'Grade 8 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Shifts in Voice & Mood',
  planId: 'evelyn.ms.m8ela.shifts-in-voice-and-mood.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8ela.shifts-in-voice-and-mood.v1' }],
  theory: [
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `A SHIFT IS A CHANGE PARTWAY THROUGH, AND THE ONLY QUESTION IS WHETHER THE MEANING CALLED FOR IT. You already hold one tense across a stretch of writing unless the time really changes. Voice and mood work the same way. The first verb of a sentence or a passage sets a voice and a mood, and every verb after it stays there unless something in the meaning gives a reason to move. So the test is never "did the form change?" It is "did the meaning really change?"` },
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `A VOICE SHIFT BREAKS A SENTENCE WHEN ONE DOER IS STILL DOING EVERYTHING. If the same person performs both actions, both verbs stay active and the reader never has to ask who. Sliding into the passive halfway through drops the doer out of the second half and sends the reader hunting for a person who was standing right there in the first half. WRONG: "Maya washed the dishes and then the floor was mopped." CORRECT: "Maya washed the dishes and then mopped the floor."` },
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `SOME CHANGES OF VOICE ARE CORRECT, BECAUSE THE DOER REALLY DID CHANGE. When the second action has a different doer, or a doer nobody knows, the passive is doing a job and the change is licensed. CORRECT: "The eighth graders decorated the gym, and the tickets were printed downtown." The students did not print the tickets, and the sentence never claims they did. So ask what the doer is in each half. The same doer means the writing only slid. A different doer, or no known doer, means the meaning changed and the sentence stays as it is.` },
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `A MOOD SHIFT BREAKS A LIST OF STEPS WHEN ONE STEP STOPS BEING A COMMAND. Instructions are written as commands, and every step in the list has the same job, so every step takes the same form. A step that slides into a statement about what happens, or into advice about what a reader should do, reads as optional beside the steps around it. WRONG: "Rinse the beaker, dry it with a paper towel, and then you should record the mass." CORRECT: "Rinse the beaker, dry it with a paper towel, and record the mass."` },
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `A WISH THAT DROPS OUT OF THE SUBJUNCTIVE IS THE OTHER MOOD SHIFT. Once a sentence sets up something imagined rather than real, every verb inside that imagined stretch keeps the form the setup demands, and "was" is the word that most often slips back in. WRONG: "I wish the tryout list were posted tonight and the coach was easier to read." CORRECT: "I wish the tryout list were posted tonight and the coach were easier to read." The second half is no more real than the first, so nothing licensed the change.` },
    { loId: 'm8ela.shifts-in-voice-and-mood', content: `THE FIX IS THE ONE VERB THAT BROKE AWAY, NOT A REWRITE. Find the verb whose form changed, ask whether anything in the meaning called for the change, and if nothing did, put that single verb back into the voice or mood the writing already set. Leave every other sentence alone. A repair that rewrites three lines to bury one bad verb usually deletes information the passage needed, and it hides the mistake from the writer instead of showing it.` },
    { loId: 'm8ela.shifts-in-voice-and-mood', kind: 'definition', title: 'shift', content: 'a change in verb voice or verb mood partway through a sentence or a passage.' },
    { loId: 'm8ela.shifts-in-voice-and-mood', kind: 'definition', title: 'inappropriate shift', content: `a shift that nothing in the meaning called for, which leaves a reader hunting for a doer or unsure whether a line is an instruction.` },
    { loId: 'm8ela.shifts-in-voice-and-mood', kind: 'definition', title: 'licensed shift', content: `a change of voice or mood the meaning genuinely required, usually because the doer changed or because the sentence moved from something real to something imagined. It is not an error and is not repaired.` },
    { loId: 'm8ela.shifts-in-voice-and-mood', kind: 'definition', title: 'the meaning test', content: `the one question this lesson runs on every change of form: did the meaning really change, or did the writing only slide?` },
    { loId: 'm8ela.shifts-in-voice-and-mood', kind: 'definition', title: 'the one-verb fix', content: `the repair for an inappropriate shift: put the single verb that broke away back into the voice or mood the writing already set, and change nothing else.` },
  ],
  methods: [
    {
      title: 'Worked repair a voice shift in a passage',
      steps: [
        `Set the baseline first, because a shift is only a shift away from something. The first verb is "set up", and Devon is the one doing it, so the passage opens in the active voice with Devon as the doer. Every later verb gets compared against that.`,
        `Take the second half of the first sentence: "the banner was hung over the doorway." That is a form of "be" plus the third shape, so the voice has changed. Do not repair anything yet. Run the test: ask who hung the banner. The sentence never says, and the only person anywhere in the passage is Devon, who is standing at that wall setting up chairs. Nothing changed but the form of the verb.`,
        `So the change was not licensed, and the repair is one verb. WRONG: "Devon set up the folding chairs along the back wall, and then the banner was hung over the doorway." CORRECT: "Devon set up the folding chairs along the back wall, and then hung the banner over the doorway." Devon is still the subject, he is now the doer of both actions, and not one other word moved.`,
        `"He counted the programs twice" needs nothing. It is active, its doer is Devon, and that matches the baseline exactly.`,
        `Last sentence: "The programs were printed by the front office on Thursday." The voice has changed again, so ask the same question rather than reaching for the same answer. Who did the printing? The front office, and the sentence says so. That is a different doer, named in the sentence itself, and nothing in the passage puts Devon anywhere near the printing. The meaning really did change, so this one is licensed and it stays exactly as written.`,
        `Read the two verdicts side by side, because they are the whole lesson. Both sentences changed voice. One changed for no reason and one changed because the doer changed. The form told you nothing on its own. The doer told you everything.`,
      ],
      example: { problem: `Find every change of voice in this passage, decide which ones the meaning licensed, and repair only the ones it did not.

"Devon set up the folding chairs along the back wall, and then the banner was hung over the doorway. He counted the programs twice. The programs were printed by the front office on Thursday."`, solution: `One repair: "Devon set up the folding chairs along the back wall, and then hung the banner over the doorway." The last sentence, "The programs were printed by the front office on Thursday," also changes voice, but that change is licensed, because the front office is a different doer, so it stays as written.` },
      relatedLoIds: ['m8ela.shifts-in-voice-and-mood'],
    },
    {
      title: 'Worked repair two mood shifts',
      steps: [
        `Piece A, baseline. The first verb is "Log in", aimed straight at the reader, and the second, "choose", is aimed the same way. Two steps, same form, same job.`,
        `Third step: "your photo gets uploaded on the last screen." That is no longer a command. It is a statement about what happens, and it tells the reader to do nothing at all. Somebody following this list exactly does two things and then waits.`,
        `Run the test before touching it. Did the meaning change? The step belongs to the same reader, on the same page, in the same sitting, and somebody still has to upload that photo. Nothing changed, so the shift is inappropriate.`,
        `Repair the one verb. WRONG: "Log in with your school email, choose the club you joined, and then your photo gets uploaded on the last screen." CORRECT: "Log in with your school email, choose the club you joined, and upload your photo on the last screen." Three steps in one form, and the last one is now something a reader can actually do.`,
        `Piece B, baseline. "I wish the bus stop were closer to my street" sets up something that is not true: the stop is where it is. The form "were" after "wish" is what marks the sentence as imagined rather than real.`,
        `Second half: "I wish practice was an hour later on Tuesdays." Same "I wish", same imagined situation, and the verb has slipped to "was". Ask the test question one more time. Did anything become real between one half of the sentence and the other? No. CORRECT: "I wish the bus stop were closer to my street, and I wish practice were an hour later on Tuesdays."`,
      ],
      example: { problem: `Repair the shift in each of these, and say what told you the shift was not licensed.

A, from the directions on a club sign-up page: "Log in with your school email, choose the club you joined, and then your photo gets uploaded on the last screen."

B, from a personal narrative: "I wish the bus stop were closer to my street, and I wish practice was an hour later on Tuesdays."`, solution: `A: "Log in with your school email, choose the club you joined, and upload your photo on the last screen." The last step still has to be done by the same reader, so nothing licensed the change from a command to a statement. B: "I wish the bus stop were closer to my street, and I wish practice were an hour later on Tuesdays." Both halves are wishes about things that are not true, so "was" had no reason to appear in the second one.` },
      relatedLoIds: ['m8ela.shifts-in-voice-and-mood'],
    },
  ],
  pointers: [
    { content: `Students often say "The last sentence is the shift, so it should say "Test the microphones at four o'clock."" — Ask who does the action. Setting out chairs and clearing the aisle are the reader's jobs; testing the microphones is the tech crew's, and the sentence says so in the "by" phrase. Rewriting it as "Test the microphones at four o'clock" hands the reader a job that belongs to somebody else and deletes the crew from the notice entirely. The doer really did change, so the change of form is licensed and that sentence stays exactly as it is. A shift is a defect only when nothing in the meaning called for it.`, kind: 'common-error' },
    { content: `Students often say "The first two sentences are the shift, so they should say "The chairs are set out in rows of eight" and "The center aisle is left clear."" — Two of the three sentences are commands, and the notice exists to tell a reader what to do, so the commands are the pattern and the third sentence is the one to examine. Examining it shows a real change of doer, which means it is licensed, so the notice is already correct and the finished version is the one that was posted. Repairing a shift means putting back the one verb that broke away from what the writing already set. It never means rewriting the lines that were doing their job.`, kind: 'common-error' },
    { content: `The first verb sets the voice and the mood, and every verb after it stays there unless the meaning gives a reason to move. The test is not "did the form change?" It is "did the meaning really change?"`, kind: 'tip' },
    { content: `A change of voice with the same doer on both sides is a slide, not a decision. WRONG: "Maya washed the dishes and then the floor was mopped." CORRECT: "Maya washed the dishes and then mopped the floor."`, kind: 'tip' },
    { content: `A change of voice is licensed when the doer really changed or when nobody knows the doer. "The eighth graders decorated the gym, and the tickets were printed downtown" needs no repair, because the students did not print the tickets.`, kind: 'tip' },
    { content: `In a list of steps every step is a command. WRONG: "Rinse the beaker, dry it with a paper towel, and then you should record the mass." CORRECT: "Rinse the beaker, dry it with a paper towel, and record the mass."`, kind: 'tip' },
    { content: `A wish stays in the subjunctive all the way through, and "was" is the word that slips back in. WRONG: "I wish the tryout list were posted tonight and the coach was easier to read." CORRECT: "I wish the tryout list were posted tonight and the coach were easier to read."`, kind: 'tip' },
    { content: `Repair the one verb that broke away and leave everything else alone. Flattening the sentences that were working until the whole passage matches is consistent, and it instructs nobody.`, kind: 'tip' },
  ],
};
