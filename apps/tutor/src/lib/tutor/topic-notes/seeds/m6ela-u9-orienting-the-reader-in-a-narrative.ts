/**
 * Grade 6 English Language Arts — Unit 9 CED 9.4: Orienting the Reader in a Narrative.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.orienting-the-reader-in-a-narrative.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U9_ORIENTING_THE_READER_IN_A_NARRATIVE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.orienting-the-reader-in-a-narrative.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Orienting the Reader in a Narrative',
  planId: 'evelyn.ms.m6ela.orienting-the-reader-in-a-narrative.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.orienting-the-reader-in-a-narrative.v1' }],
  theory: [
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', content: `ORIENTING A READER MEANS ANSWERING THREE QUESTIONS BEFORE THE FIRST EVENT FINISHES: where and when is this happening (the context), who is telling the story or is in the scene (the narrator or characters), and what is the first thing that happens. Skip one of the three and a reader starts the story confused.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', content: `CONTEXT TAKES ONE OR TWO CONCRETE DETAILS, NOT A HISTORY LESSON. A place, a season, a time of day is usually enough to anchor a reader. A paragraph of background before anything happens is not orienting, it is stalling — a reader given nothing to picture yet will not know where to stand.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', content: `INTRODUCE A CHARACTER BY NAME AND BY WHAT THAT PERSON IS DOING RIGHT THEN, NOT BY A LIST OF FACTS ABOUT THEM. A reader needs to know who is in the scene and how that person fits it, not that person's whole history before the story starts moving.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', content: `A NATURAL SEQUENCE BEGINS WHERE THE STORY ACTUALLY BEGINS. Start with the first event that gets the story moving. Starting several steps too early leaves a reader waiting for something to happen; starting by describing how everything eventually turns out gives away the ending before the reader has anything left to read toward.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', content: `ORIENTING A READER IS NOT THE SAME JOB AS SUMMARIZING A WHOLE STORY. An opening sets up a beginning; it does not report the middle or the ending in advance. The moment an opening tells a reader how things turned out, it has stopped orienting and started summarizing.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', kind: 'definition', title: 'orient', content: `to give a reader enough context at the start of a narrative to know where the action is happening, when, and who is involved.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', kind: 'definition', title: 'context', content: 'the time and place established for a reader at the start of a narrative.' },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', kind: 'definition', title: 'narrator', content: `the voice telling a narrative; introducing that voice's identity is part of orienting a reader.` },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', kind: 'definition', title: 'event sequence', content: 'the order in which the events of a narrative happen, from first to last.' },
    { loId: 'm6ela.orienting-the-reader-in-a-narrative', kind: 'definition', title: 'natural sequence', content: `an event sequence organized so each event follows believably from the one before it, without a confusing jump or an unexplained gap.` },
  ],
  methods: [
    {
      title: 'Worked build an oriented opening',
      steps: [
        `Decide the context first: where and when. A classroom, right after school lets out on a Friday, gives a reader a place and a moment to picture.`,
        `Decide who is in the scene. Name one character and give that character a reason to be there right then: Marcus, whose turn it was to feed the class hamster before he left for the day.`,
        `Decide the first event of the natural sequence. It should be the thing that starts the story moving, not something that happened days earlier and not something that happens later. Here, that is Marcus finding the cage empty.`,
        `Combine the three pieces in that order: context, character, first event. Do not add anything past the first event yet; a reader only needs enough to start, not the ending.`,
        `Check the draft against all three jobs. Does it say where and when? Does it name who is there? Does it stop at the first event instead of racing ahead to how the story ends?`,
      ],
      example: { problem: `Build an opening for a narrative that starts from this idea: a student discovers that the class hamster is missing from its cage. Orient the reader before the first event finishes.`, solution: `On Friday afternoon, after the rest of the class had already left, Marcus stayed behind because it was his turn to feed the class hamster, Biscuit. He lifted the lid of the cage to drop in a few pellets and found the cage empty.` },
      relatedLoIds: ['m6ela.orienting-the-reader-in-a-narrative'],
    },
    {
      title: 'Worked repair a rushed opening',
      steps: [
        `Find what is missing. No place or time is named beyond the bell ringing, and "he" is never given a name, so a reader cannot picture who is in the room.`,
        `Find what has gone too far. The draft does not stop at the first event; it runs all the way through the search and the ending, including how everybody felt about it later. That is a summary of the whole story, not an opening.`,
        `Fix the missing pieces first. Give the scene a place and a name: the classroom, right after school, and Marcus.`,
        `Fix where the draft stops next. Cut the draft off at the moment the trouble starts, and remove everything that happens after it. A reader does not need to know yet that the hamster turns up safe.`,
        `WRONG: "The bell rang and he panicked and ran to tell the teacher, and everyone helped look, and finally they found the hamster behind the bookshelf and it was fine and everybody laughed about it later." CORRECT: "The bell rang, and Marcus was still standing at the hamster cage in Ms. Alvarez's empty classroom, staring at the open lid he was sure he had latched. Biscuit was gone."`,
        `Check the repaired version against the three jobs again. It names the classroom and the moment school ends, it names Marcus and what he is doing, and it stops right at the first event instead of reporting how the whole story turns out.`,
      ],
      example: { problem: `Repair this draft opening so that it orients the reader instead of racing through the whole story.

Draft: "The bell rang and he panicked and ran to tell the teacher, and everyone helped look, and finally they found the hamster behind the bookshelf and it was fine and everybody laughed about it later."`, solution: `"The bell rang, and Marcus was still standing at the hamster cage in Ms. Alvarez's empty classroom, staring at the open lid he was sure he had latched. Biscuit was gone." It now names the place and moment, names the character and what he is doing, and stops at the first event instead of reporting the whole search and its happy ending.` },
      relatedLoIds: ['m6ela.orienting-the-reader-in-a-narrative'],
    },
  ],
  pointers: [
    { content: `Students often say "Telling the reader how the story turns out in the opening lines." — Orienting a reader means giving just enough to start the story: where and when it is happening, who is in it, and the first event. It does not include how the story ends. Revealing the ending in the opening removes the reason to keep reading, and it turns the opening into a plot summary rather than a beginning. Save the ending for the ending.`, kind: 'common-error' },
    { content: `Students often say "Believing a longer opening with more background is automatically a better-oriented one." — A reader needs one or two concrete details of place and time, a named character, and the first event — not a full history. An opening that spends several sentences on backstory before anything happens has not oriented the reader any better than one with too little context; it has only delayed the first event. Check any opening by asking whether a reader could picture where, when, and who within the first sentence or two.`, kind: 'common-error' },
    { content: `Orienting a reader means answering three questions before the first event finishes: where and when (context), who is in the scene (narrator or characters), and what happens first.`, kind: 'tip' },
    { content: `Context needs one or two concrete details, not a history lesson. A paragraph of background before anything happens stalls the story instead of starting it.`, kind: 'tip' },
    { content: `Name a character and give that character a reason to be there right then. A crowd of unnamed people does not orient a reader the way one named character does.`, kind: 'tip' },
    { content: `A natural sequence starts where the story actually starts. WRONG: an opening that reports how a trip ends before showing how it began. CORRECT: an opening that stops right at the moment things start going wrong.`, kind: 'tip' },
    { content: `Orienting a reader is not the same job as summarizing a whole story. An opening sets up a beginning; it does not report the middle or the ending in advance.`, kind: 'tip' },
    { content: `Check any opening against all three jobs: place and time, a named character, and a first event the story can move forward from.`, kind: 'tip' },
    { content: `Don't confuse orienting with reassuring. Telling readers "it turns out okay" at the start removes the reason to keep reading. Orient means: where, when, who, and the first event—not how it ends.`, kind: 'common-error' },
    { content: `One or two concrete details anchor a reader. A whole paragraph of backstory before anything happens is stalling, not orienting. Ask: can a reader picture where and when in the first sentence or two?`, kind: 'gotcha' },
    { content: `Name your character. "A girl walked in" leaves a reader floating. "Maya walked in" plants them in the scene. An unnamed person or a crowd does not orient the way one named character does.`, kind: 'tip' },
    { content: `Stop at the first event. If your opening mentions what happens next or how things end, you've gone too far. The first event is the thing that starts the story moving—not what came before it, not what comes after.`, kind: 'common-error' },
    { content: `Vocab note: "orienting" is not the same as "summarizing." An opening sets up a beginning. A summary reports the whole plot. Check yourself: does your opening stop at the start, or does it tell what happens throughout?`, kind: 'vocab-note' },
    { content: `Give your character a reason to be there right then. "Marcus stayed behind because it was his turn to feed the hamster" orients better than "Marcus was in the classroom." Action and purpose anchor the reader.`, kind: 'tip' },
    { content: `Watch for jumps in time. If your opening mentions something that happened yesterday or last week, you've started too early. The first event should be the moment the story actually begins moving, not a memory of something that came before.`, kind: 'edge-case' },
  ],
};
