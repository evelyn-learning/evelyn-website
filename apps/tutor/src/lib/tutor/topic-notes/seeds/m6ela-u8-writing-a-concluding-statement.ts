/**
 * Grade 6 English Language Arts — Unit 8 CED 8.4: Writing a Concluding Statement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.writing-a-concluding-statement.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U8_WRITING_A_CONCLUDING_STATEMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.writing-a-concluding-statement.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Writing a Concluding Statement',
  planId: 'evelyn.ms.m6ela.writing-a-concluding-statement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.writing-a-concluding-statement.v1' }],
  theory: [
    { loId: 'm6ela.writing-a-concluding-statement', content: `A CONCLUDING STATEMENT IS THE LAST PIECE OF AN ARGUMENT, AND ITS JOB IS TO FOLLOW FROM WHAT CAME BEFORE. It wraps up the claim and reasons already on the page. It does not open a new topic, and it does not leave the argument stopping cold with nothing to close it.` },
    { loId: 'm6ela.writing-a-concluding-statement', content: `FOLLOWS FROM MEANS BUILT ONLY OUT OF THE CLAIM AND REASONS ALREADY GIVEN. A strong conclusion restates the claim and can lean on the reasons already argued, but every piece of it has to trace back to something the argument already said. Nothing in a concluding statement should be new information.` },
    { loId: 'm6ela.writing-a-concluding-statement', content: `RESTATE THE CLAIM. DO NOT COPY IT. Saying the claim again in different words shows the argument is finished. Retyping the exact sentence that opened the argument adds nothing and sounds like the writer ran out of things to say. WRONG: ending an argument with the identical sentence that opened it. CORRECT: the same idea, said a new way.` },
    { loId: 'm6ela.writing-a-concluding-statement', content: `NEVER INTRODUCE A NEW REASON AT THE END. A reason that never appeared earlier in the argument cannot suddenly show up in the conclusion — the reader has no evidence for it, and it makes the ending feel like a different argument started in the middle of the last sentence.` },
    { loId: 'm6ela.writing-a-concluding-statement', content: `A VAGUE, GENERAL APPEAL IS NOT A CONCLUSION EITHER. A sentence that is true of almost any topic, like a general reminder to care about the environment or to be a good student, could close a hundred different arguments. If it could close almost anything, it has not followed from THIS one.` },
    { loId: 'm6ela.writing-a-concluding-statement', content: `TEST IT: COULD THIS SENTENCE CLOSE A DIFFERENT ARGUMENT? Cover the claim and reasons above your ending and read only the ending by itself. If it could finish an argument about almost any topic, it has not done its job. If it only makes sense sitting next to this exact claim and these exact reasons, it has followed from the argument.` },
    { loId: 'm6ela.writing-a-concluding-statement', kind: 'definition', title: 'concluding statement', content: `the final sentence or section of an argument that wraps up the claim and reasons without adding a new point.` },
    { loId: 'm6ela.writing-a-concluding-statement', kind: 'definition', title: 'claim', content: 'the position an argument argues for, usually stated as one sentence.' },
    { loId: 'm6ela.writing-a-concluding-statement', kind: 'definition', title: 'reason', content: `a statement already given in the argument that explains why the claim should be accepted.` },
    { loId: 'm6ela.writing-a-concluding-statement', kind: 'definition', title: 'restate', content: 'to say the same idea again using different words, not the exact same sentence.' },
    { loId: 'm6ela.writing-a-concluding-statement', kind: 'definition', title: 'follows from', content: `built only out of ideas the argument already gave, so the ending could not belong to a different argument.` },
  ],
  methods: [
    {
      title: 'Worked build a conclusion',
      steps: [
        `Reread the claim and both reasons before writing a single word of the ending. Everything in the conclusion has to trace back to those three sentences and nothing else.`,
        `Start by restating the claim in new words, not the same sentence. WRONG: "Our school should install a water bottle filler station by the gym doors." (That is the exact opening sentence, retyped.) CORRECT: "A filler station by the gym doors would solve a problem this school already has every single day."`,
        `Now tie the ending to the two reasons already given, without adding a reason that never appeared above. The two reasons were thirsty students right after gym, and a faster line at the filler station. WRONG add-on: "and it would also make the gym look more modern." (a brand-new point never argued.) CORRECT add-on: "so thirsty students would not have to walk two hallways for water, and the line after class would move fast instead of piling up."`,
        `Put the restated claim and the reason-based add-on together, and read the whole thing back. Check it against the test: could this sentence close a different argument, or only this one?`,
      ],
      example: { problem: `Claim: Our school should install a water bottle filler station by the gym doors.
Reason 1: Because students leaving gym class are thirsty right away, and the nearest fountain is two hallways down.
Reason 2: Because a filler station lets a bottle fill in a few seconds, so the line after gym class would move fast instead of backing up.

Write a concluding statement that follows from this claim and these two reasons.`, solution: `A filler station by the gym doors would solve a problem this school already has every single day, so thirsty students would not have to walk two hallways for water, and the line after class would move fast instead of piling up.` },
      relatedLoIds: ['m6ela.writing-a-concluding-statement'],
    },
    {
      title: 'Worked repair a weak conclusion',
      steps: [
        `Check the draft ending against the two reasons above it. The two reasons are about a quiet place to work and computer access. The cafeteria and snacks never appear anywhere in the argument.`,
        `Name the problem exactly. WRONG: "Our library should stay open one extra hour after school, and the cafeteria should also start serving better snacks." The first half restates the claim, which is fine, but the second half introduces a brand-new point that was never argued for. A reader has no idea where the snack idea even came from.`,
        `Repair it by replacing the new point with something built from the two reasons that are already on the page, not from an idea that showed up out of nowhere. CORRECT: "Keeping the library open until 4:30 would give bus riders a quiet place to finish homework and give every student a fair shot at a computer."`,
        `Check the repair. It restates the claim in new words instead of retyping the exact opening sentence, and both halves trace straight back to reason one and reason two. Nothing in it could close a different argument.`,
      ],
      example: { problem: `Claim: Our library should stay open one extra hour after school.
Reason 1: Because students who ride the late activity bus have nowhere quiet to do homework until the bus arrives.
Reason 2: Because the computer lab fills up fast right after the final bell, and some students never get a turn.

A student drafted this ending: "Our library should stay open one extra hour after school, and the cafeteria should also start serving better snacks." What is wrong with it, and how should it be repaired?`, solution: `Keeping the library open until 4:30 would give bus riders a quiet place to finish homework and give every student a fair shot at a computer.` },
      relatedLoIds: ['m6ela.writing-a-concluding-statement'],
    },
  ],
  pointers: [
    { content: `Students often say "Repeating the claim word for word is a strong way to end an argument, because it reminds the reader what the whole piece was about." — A strong concluding statement follows from the claim and reasons; it does not retype the opening sentence. Restate the claim in different words, and tie it to the reasons that came before it. WRONG: "Our school should start a garden behind the cafeteria." (Word for word, the exact sentence that opened the argument.) CORRECT: "A garden behind the cafeteria would turn wasted space into something the whole school could use." Same idea, new words, and it grows out of the argument instead of restarting it.`, kind: 'common-error' },
    { content: `Students often say "Saving the single best point for the very last sentence makes the ending feel more powerful." — Every reason has to appear earlier in the argument before the conclusion can lean on it. A concluding statement follows from the claim and reasons already presented — it does not introduce one. If a new point belongs in the argument, it needs its own place earlier on with its own reasoning, not a single unsupported sentence tacked onto the very end.`, kind: 'common-error' },
    { content: `A concluding statement is the last part of an argument, and its whole job is to follow from the claim and reasons that came right before it.`, kind: 'tip' },
    { content: `Restate the claim in new words. Copying the exact opening sentence is not a conclusion; it is a repeat.`, kind: 'tip' },
    { content: `Tie the ending back to the specific reasons already given. A conclusion built only from the claim and reasons above always passes the test.`, kind: 'tip' },
    { content: `Never introduce a brand-new reason in the last sentence. Every reason needs its own place earlier in the argument, not a surprise appearance at the end.`, kind: 'tip' },
    { content: `Watch for an ending that trails off into a general appeal, true of almost any topic, instead of staying tied to the exact argument on the page.`, kind: 'tip' },
    { content: `Test any ending by covering the claim and reasons and asking: could this sentence close a totally different argument? If yes, it has not followed from this one.`, kind: 'tip' },
  ],
};
