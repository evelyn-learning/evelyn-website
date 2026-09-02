/**
 * Grade 6 ELA — Argument Writing: Claims, Reasons & Evidence: Writing a
 * Concluding Statement.
 *
 * PROCEDURE-LED exemplar shape, writing-unit item pattern. This row closes
 * Unit 8: rows 8.1-8.3 already taught the claim, the reasons and evidence,
 * and the linking words that connect them, so this lesson takes a finished
 * claim-plus-reasons argument as a given and teaches only the one move left —
 * writing a concluding statement that FOLLOWS FROM that argument (CCSS
 * W.6.1e). "Follows from" is the whole lesson, and it fails in exactly three
 * nameable ways this plan is built to kill: a conclusion that introduces a
 * reason never argued above, a conclusion that retypes the claim's exact
 * wording instead of restating it, and a conclusion that trails off into a
 * general appeal that could close almost any argument. There is no free
 * response anywhere in this course, so every try_yourself item prints a
 * short, complete argument (one claim, two reasons) followed by four
 * candidate concluding statements, and the student's job is recognition, not
 * production — the writing move itself is modeled in the two worked
 * examples.
 *
 * SCOPE GUARD: Grade 6 row 8.4 writes ONLY the concluding statement or
 * section of an argument, judged against the claim and reasons already
 * presented, without introducing a new point. DELIBERATELY EXCLUDED:
 * introducing a claim and ordering reasons and evidence under it (row 8.1),
 * supporting a claim with reasons and relevant evidence (row 8.2), and
 * choosing a linking word or phrase to connect a claim to its reasons (row
 * 8.3) — this lesson never asks the student to build or repair any of those
 * three moves, and every claim-plus-reasons argument printed here is supplied
 * whole, not assembled by the student. Also excluded, as Grade 7 territory:
 * acknowledging or rebutting an opposing claim (W.7.1a) — nothing in this
 * file asks the student to consider or answer a counterclaim. DELIBERATELY
 * ALLOWED, because the neighboring rows sit directly underneath this one:
 * every item and worked example prints a complete claim and two reasons,
 * because a concluding statement cannot be judged as "following from" an
 * argument the student cannot see. Printing that argument is not teaching
 * claim construction, reason quality or linking words — those three sentences
 * are given, already-finished material here, and no item in this file ever
 * asks the student to write, choose, repair or evaluate the claim or the
 * reasons themselves, only the sentence that comes after them.
 *
 * NOTE FOR FUTURE AUTHORS: every argument in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * claim, reasons and choices printed inside that item alone. Every
 * ungrammatical or broken example in the tutor's own prose is labeled WRONG
 * with a CORRECT version beside it; a tutor reads these lines aloud, so an
 * unlabeled weak sentence would be handed to the student as a model. The only
 * unlabeled weak sentences in this file are the MCQ distractors the three
 * try_yourself items ask the student to reject, which is exactly what those
 * items are for, and each one is named in that item's hints or in the
 * misconception check. This file contains no contractions in the tutor's own
 * voice.
 *
 * CLAIM LEDGER: none required. This lesson's arguments are stipulated
 * persuasive scenarios about an invented school, its gym, its library, its
 * recycling habits and its clubs — the same kind of school-and-neighborhood
 * scale scenario the shipped m7ela-u8-claims-and-reasons.ts uses for the same
 * unit, and for the same reason: a claim being argued ("our school should
 * install a filler station," "our classroom should have a recycling bin,"
 * "clubs should meet at lunch") is an opinion under test in the item, not an
 * assertion the item presents as settled fact about the real world. No
 * excerpt in this file states a checkable real-world fact, and no statistic,
 * precise or otherwise, is invented anywhere.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 8.3 -> 8.4 -> 9.1,
 * taken directly from the lesson brief, and both loIds already exist in the
 * signed course table.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U8_WRITING_A_CONCLUDING_STATEMENT: LessonPlan = {
  id: 'evelyn.ms.m6ela.writing-a-concluding-statement.v1',
  title: 'Writing a Concluding Statement',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.writing-a-concluding-statement',
      standard: 'M6ELA-8.4',
      description:
        'Write a concluding statement or section for an argument that follows logically from the claim and reasons already presented, restating the claim in new words and tying back to the specific reasons given, without introducing a reason that never appeared earlier or drifting into a general appeal that could close a different argument (CCSS W.6.1e).',
    },
  ],
  prerequisites: ['m6ela.linking-words-for-claims-and-reasons'],
  followUps: ['m6ela.organizing-an-informative-text'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that an argument without a real ending feels unfinished, and name the fix as a test rather than a feeling.',
      script:
        'You write a whole note to your parents arguing that your family should get a dog, with two solid reasons, and then the last line just says, "Anyway, can I get a snack?" The reasons were good. The ending threw the whole thing away. A concluding statement has one job: it has to follow from the claim and reasons that came right before it, not wander off, not repeat the opening word for word, and not suddenly bring up something brand new. You already learned how to state a claim and back it up with reasons. Today you learn the sentence that lands the plane.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-concluding-statements',
      kind: 'concept',
      goal: 'Install the definition of a concluding statement, the restate-not-repeat rule, the no-new-reason rule, the no-vague-appeal rule, and the follows-from test.',
      keyIdeas: [
        'A CONCLUDING STATEMENT IS THE LAST PIECE OF AN ARGUMENT, AND ITS JOB IS TO FOLLOW FROM WHAT CAME BEFORE. It wraps up the claim and reasons already on the page. It does not open a new topic, and it does not leave the argument stopping cold with nothing to close it.',
        'FOLLOWS FROM MEANS BUILT ONLY OUT OF THE CLAIM AND REASONS ALREADY GIVEN. A strong conclusion restates the claim and can lean on the reasons already argued, but every piece of it has to trace back to something the argument already said. Nothing in a concluding statement should be new information.',
        'RESTATE THE CLAIM. DO NOT COPY IT. Saying the claim again in different words shows the argument is finished. Retyping the exact sentence that opened the argument adds nothing and sounds like the writer ran out of things to say. WRONG: ending an argument with the identical sentence that opened it. CORRECT: the same idea, said a new way.',
        'NEVER INTRODUCE A NEW REASON AT THE END. A reason that never appeared earlier in the argument cannot suddenly show up in the conclusion — the reader has no evidence for it, and it makes the ending feel like a different argument started in the middle of the last sentence.',
        'A VAGUE, GENERAL APPEAL IS NOT A CONCLUSION EITHER. A sentence that is true of almost any topic, like a general reminder to care about the environment or to be a good student, could close a hundred different arguments. If it could close almost anything, it has not followed from THIS one.',
        'TEST IT: COULD THIS SENTENCE CLOSE A DIFFERENT ARGUMENT? Cover the claim and reasons above your ending and read only the ending by itself. If it could finish an argument about almost any topic, it has not done its job. If it only makes sense sitting next to this exact claim and these exact reasons, it has followed from the argument.',
      ],
      vocabulary: [
        { term: 'concluding statement', definition: 'the final sentence or section of an argument that wraps up the claim and reasons without adding a new point.' },
        { term: 'claim', definition: 'the position an argument argues for, usually stated as one sentence.' },
        { term: 'reason', definition: 'a statement already given in the argument that explains why the claim should be accepted.' },
        { term: 'restate', definition: 'to say the same idea again using different words, not the exact same sentence.' },
        { term: 'follows from', definition: 'built only out of ideas the argument already gave, so the ending could not belong to a different argument.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-conclusion',
      kind: 'worked_example',
      problem:
        'Claim: Our school should install a water bottle filler station by the gym doors.\nReason 1: Because students leaving gym class are thirsty right away, and the nearest fountain is two hallways down.\nReason 2: Because a filler station lets a bottle fill in a few seconds, so the line after gym class would move fast instead of backing up.\n\nWrite a concluding statement that follows from this claim and these two reasons.',
      steps: [
        'Reread the claim and both reasons before writing a single word of the ending. Everything in the conclusion has to trace back to those three sentences and nothing else.',
        'Start by restating the claim in new words, not the same sentence. WRONG: "Our school should install a water bottle filler station by the gym doors." (That is the exact opening sentence, retyped.) CORRECT: "A filler station by the gym doors would solve a problem this school already has every single day."',
        'Now tie the ending to the two reasons already given, without adding a reason that never appeared above. The two reasons were thirsty students right after gym, and a faster line at the filler station. WRONG add-on: "and it would also make the gym look more modern." (a brand-new point never argued.) CORRECT add-on: "so thirsty students would not have to walk two hallways for water, and the line after class would move fast instead of piling up."',
        'Put the restated claim and the reason-based add-on together, and read the whole thing back. Check it against the test: could this sentence close a different argument, or only this one?',
      ],
      answer:
        'A filler station by the gym doors would solve a problem this school already has every single day, so thirsty students would not have to walk two hallways for water, and the line after class would move fast instead of piling up.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-weak-conclusion',
      kind: 'worked_example',
      problem:
        'Claim: Our library should stay open one extra hour after school.\nReason 1: Because students who ride the late activity bus have nowhere quiet to do homework until the bus arrives.\nReason 2: Because the computer lab fills up fast right after the final bell, and some students never get a turn.\n\nA student drafted this ending: "Our library should stay open one extra hour after school, and the cafeteria should also start serving better snacks." What is wrong with it, and how should it be repaired?',
      steps: [
        'Check the draft ending against the two reasons above it. The two reasons are about a quiet place to work and computer access. The cafeteria and snacks never appear anywhere in the argument.',
        'Name the problem exactly. WRONG: "Our library should stay open one extra hour after school, and the cafeteria should also start serving better snacks." The first half restates the claim, which is fine, but the second half introduces a brand-new point that was never argued for. A reader has no idea where the snack idea even came from.',
        'Repair it by replacing the new point with something built from the two reasons that are already on the page, not from an idea that showed up out of nowhere. CORRECT: "Keeping the library open until 4:30 would give bus riders a quiet place to finish homework and give every student a fair shot at a computer."',
        'Check the repair. It restates the claim in new words instead of retyping the exact opening sentence, and both halves trace straight back to reason one and reason two. Nothing in it could close a different argument.',
      ],
      answer:
        'Keeping the library open until 4:30 would give bus riders a quiet place to finish homework and give every student a fair shot at a computer.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-filler-station',
      kind: 'try_yourself',
      problem:
        'Claim: Our school should install a water bottle filler station by the gym doors.\nReason 1: Because students leaving gym class are thirsty right away, and the nearest fountain is two hallways down.\nReason 2: Because a filler station lets a bottle fill in a few seconds, so the line after gym class would move fast instead of backing up.\n\nWhich sentence is the best concluding statement for this argument?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A filler station right by the gym doors would meet a need that shows up every single day, and it would keep that after-class line from backing up the way it does now.',
          correct: true,
        },
        {
          id: 'b',
          text: 'Our school should install a water bottle filler station by the gym doors.',
        },
        {
          id: 'c',
          text: 'A filler station by the gym would also make more students want to sign up for intramural sports next year, since the whole gym area would suddenly feel like a nicer, more modern place to spend time after class.',
        },
        {
          id: 'd',
          text: 'Staying hydrated is something every student should think about carefully, every single day, no matter which school they attend or what the weather happens to be like that morning.',
        },
      ],
      expectedAnswer:
        'A filler station right by the gym doors would meet a need that shows up every single day, and it would keep that after-class line from backing up the way it does now.',
      hints: [
        'Reread the claim and both reasons. The strongest closing sentence should sound like it grew out of exactly those three sentences, not a sentence that could close any argument about anything.',
        'Rule out the choice that repeats the claim word for word, the choice that brings up a brand-new reason about sports that neither reason above ever mentioned, and the choice that talks about hydration in general instead of this school\'s specific gym and fountain problem.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-recycling-bin',
      kind: 'try_yourself',
      problem:
        'Claim: Our classroom should have its own recycling bin next to the trash can.\nReason 1: Because right now every scrap of paper goes straight into the trash, even though there is nowhere in the room to put it instead.\nReason 2: Because the recycling bin down by the front office is too far to reach during a busy class period, so nobody ever walks over to use it.\n\nWhich sentence is the best concluding statement for this argument?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A recycling bin in our own room would also help our class win the school\'s spring attendance contest, since the judges specifically look for classrooms that show real team spirit all year long.',
        },
        {
          id: 'b',
          text: 'Putting a recycling bin right next to the trash can would make recycling just as easy as throwing something away, so the paper piling up in the trash would finally have somewhere else to go.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Our classroom should have its own recycling bin next to the trash can.',
        },
        {
          id: 'd',
          text: 'Taking care of the environment matters everywhere, not just here at school, and everyone in every classroom in every town should always try to do their own small part.',
        },
      ],
      expectedAnswer:
        'Putting a recycling bin right next to the trash can would make recycling just as easy as throwing something away, so the paper piling up in the trash would finally have somewhere else to go.',
      hints: [
        'Check whether a closing repeats the claim exactly, brings up a brand-new reason that never appeared above, or wanders into a general statement about the environment. All three of those fail the same test: does this sentence follow from THIS argument, or could it follow almost any argument?',
        'One choice ties an attendance contest to the bin, which neither reason above ever mentioned. One choice is the claim\'s exact wording with nothing changed. One choice is true of the environment everywhere and never mentions this classroom\'s specific paper-and-distance problem. The remaining choice is built only from the two reasons already given.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-clubs-at-lunch',
      kind: 'try_yourself',
      problem:
        'Claim: Our school should let clubs meet during lunch instead of only after school.\nReason 1: Because students who ride the activity bus home cannot stay for a single after-school meeting all year.\nReason 2: Because the cafeteria already has empty tables during second lunch that clubs could use instead of an empty classroom.\n\nWhich sentence is the best concluding statement for this argument?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Clubs are a great way to make new friends and try something new, and every student at this school should try joining at least one before the year is over.',
        },
        {
          id: 'b',
          text: 'Meeting during lunch would also let the school offer twice as many clubs as it does now, since teachers who cannot stay late after the final bell could finally volunteer to run one.',
        },
        {
          id: 'c',
          text: 'Moving club meetings into the lunch period would finally include the bus riders who get left out now, using cafeteria tables that already sit empty anyway.',
          correct: true,
        },
        {
          id: 'd',
          text: 'Our school should let clubs meet during lunch instead of only after school.',
        },
      ],
      expectedAnswer:
        'Moving club meetings into the lunch period would finally include the bus riders who get left out now, using cafeteria tables that already sit empty anyway.',
      hints: [
        'This argument gave exactly two reasons: bus riders missing every after-school meeting, and empty cafeteria tables during second lunch. A strong ending has to be built from those two sentences and nothing else.',
        'Rule out the choice that could close a different argument about clubs in general, the choice that hands the claim back word for word, and the choice that promises something neither reason ever mentioned, like the school offering more clubs. What is left ties directly to the bus riders and the empty tables.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-repeat-or-surprise',
      kind: 'misconception_check',
      question:
        'A student wraps up an argument about starting a school garden with this final sentence: "Our school should start a garden behind the cafeteria." That is the exact sentence the student used to open the whole argument. The student explains, "I ended it the same way I started it, so the reader remembers exactly what I was arguing for." What has gone wrong?',
      commonErrors: [
        {
          answer:
            'Repeating the claim word for word is a strong way to end an argument, because it reminds the reader what the whole piece was about.',
          misconception:
            'Confusing "reminding the reader of the claim" with "copying the claim exactly." The student is right that the ending should connect back to the claim, but repeating the identical sentence adds nothing new — it sounds like the argument stopped rather than finished.',
          correctsTo:
            'A strong concluding statement follows from the claim and reasons; it does not retype the opening sentence. Restate the claim in different words, and tie it to the reasons that came before it. WRONG: "Our school should start a garden behind the cafeteria." (Word for word, the exact sentence that opened the argument.) CORRECT: "A garden behind the cafeteria would turn wasted space into something the whole school could use." Same idea, new words, and it grows out of the argument instead of restarting it.',
        },
        {
          answer:
            'Saving the single best point for the very last sentence makes the ending feel more powerful.',
          misconception:
            'Believing a strong finish means adding a brand-new idea at the end, when a reason introduced for the first time in the last sentence has never been argued for anywhere in the piece.',
          correctsTo:
            'Every reason has to appear earlier in the argument before the conclusion can lean on it. A concluding statement follows from the claim and reasons already presented — it does not introduce one. If a new point belongs in the argument, it needs its own place earlier on with its own reasoning, not a single unsupported sentence tacked onto the very end.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A concluding statement is the last part of an argument, and its whole job is to follow from the claim and reasons that came right before it.',
        'Restate the claim in new words. Copying the exact opening sentence is not a conclusion; it is a repeat.',
        'Tie the ending back to the specific reasons already given. A conclusion built only from the claim and reasons above always passes the test.',
        'Never introduce a brand-new reason in the last sentence. Every reason needs its own place earlier in the argument, not a surprise appearance at the end.',
        'Watch for an ending that trails off into a general appeal, true of almost any topic, instead of staying tied to the exact argument on the page.',
        'Test any ending by covering the claim and reasons and asking: could this sentence close a totally different argument? If yes, it has not followed from this one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Writing a Concluding Statement' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
