/**
 * Grade 6 ELA — Informative & Narrative Writing: Orienting the Reader in a
 * Narrative.
 *
 * PROCEDURE-LED, in the shape of the Grade 6 grammar exemplar, teaching the
 * writing units' revision-choice item pattern (CCSS W.6.3a). There is one
 * repeatable move: before the first event of a narrative finishes, an opening
 * has to do three jobs — anchor the reader in a CONTEXT (a place and a time),
 * introduce a NARRATOR or CHARACTER by name, and start an EVENT SEQUENCE at
 * its true first event, in natural order. Three traps this plan is built to
 * kill: dropping a reader into action with no place, time, or named person to
 * hold onto; opening with a paragraph of backstory before anything actually
 * happens; and opening by reporting how the story turns out instead of
 * starting it.
 *
 * SCOPE GUARD: Grade 6 row 9.4 teaches the WRITING move of opening a
 * narrative — establishing a context, introducing a narrator or character,
 * and starting an event sequence that unfolds in natural order from its own
 * first event. DELIBERATELY EXCLUDED: describing how an EXISTING story's plot
 * moves through exposition, rising action, climax and resolution — that is
 * the READING skill of Unit 1's row 1.2 (`how-a-storys-plot-unfolds`), and
 * this lesson's segments never teach or label that plot-stage vocabulary as
 * a skill (the phrase appears only in this guard's own description of what
 * is excluded). Also excluded: narrative-technique craft moves — using
 * dialogue, controlling pacing, and using description as deliberate choices
 * for effect — that is
 * Grade 7's W.7.3b, taught next in the shipped course; this file stops at
 * establishing context, character and a first event, and nowhere teaches how
 * to write dialogue or how to use description as a craft technique.
 * DELIBERATELY ALLOWED, because the two neighbors sit close: every example
 * opening in this file necessarily narrates a first event, and a first event
 * is inescapably part of a plot — but nowhere does this file ask the student
 * to identify or label a plot stage, which is the actual Unit 1 skill it
 * stays out of. And an oriented opening is unavoidably a sentence or two of
 * description of a place or a person — but nowhere does this file teach
 * description AS a deliberate craft choice for effect; description here is
 * only ever one item on the orienting checklist (does the reader now know
 * where, when, and who), never a technique being taught for its own sake.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file — every candidate
 * opening, every worked example, every weak draft — is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it. Every phrase this file puts inside quotation marks appears
 * character-for-character in the excerpt above it; quote your own excerpt
 * exactly, never from memory. Both WRONG/CORRECT pairs in this file (worked
 * example 2's repair, and the recap's short version of the same repair)
 * label a broken draft explicitly because a tutor reads those lines aloud;
 * the weak drafts inside the three try_yourself items are each item's own
 * premise and distractors, unlabeled on purpose, which is exactly what those
 * items are for.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file — every candidate
 * narrative opening and every weak draft — is invented fiction, true by
 * construction, so there is no factual claim to verify.
 *
 * DF-1 (answer position): cedTopic 9.4 gives u=9, t=4, so u+t=13.
 * 13 mod 4 = 1, 14 mod 4 = 2, 15 mod 4 = 3 — the three keys sit at indices
 * 1, 2, 3, i.e. b, then c, then d. try-choose-the-oriented-opening keys b,
 * try-choose-the-new-school-opening keys c, try-revise-the-canoe-opening
 * keys d.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U9_ORIENTING_THE_READER_IN_A_NARRATIVE: LessonPlan = {
  id: 'evelyn.ms.m6ela.orienting-the-reader-in-a-narrative.v1',
  title: 'Orienting the Reader in a Narrative',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.orienting-the-reader-in-a-narrative',
      standard: 'M6ELA-9.4',
      description:
        'Engage and orient a reader by establishing a context and introducing a narrator or characters, and organize an event sequence that unfolds naturally, starting at the story\'s true first event rather than reporting its middle or its ending in advance (CCSS W.6.3a).',
    },
  ],
  prerequisites: ['m6ela.transitions-in-informative-writing'],
  followUps: ['m6ela.asking-a-research-question'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a reader dropped into a scene with no anchor gets lost, even when every sentence after that is well written.',
      script:
        'Imagine a friend hands you a story that starts like this: "She grabbed it and ran before anyone noticed." Grabbed what? Ran from where? Who is she? Every one of those sentences might be well written on its own, and you would still be lost, because nothing has told you where you are standing or who you are watching. Now imagine the same story opens with one more sentence first: "The library was closing in five minutes when Priya spotted the last copy of the book on the return cart." Same next line, completely different experience, because now you know the place, the moment, and the person before anything happens to them. Today you learn the three jobs a narrative opening has to do before its first event is even finished, and how to catch an opening that skips one of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-orienting-the-reader',
      kind: 'concept',
      goal: 'Install the three-job checklist for an oriented opening, and separate orienting from both stalling and summarizing.',
      keyIdeas: [
        'ORIENTING A READER MEANS ANSWERING THREE QUESTIONS BEFORE THE FIRST EVENT FINISHES: where and when is this happening (the context), who is telling the story or is in the scene (the narrator or characters), and what is the first thing that happens. Skip one of the three and a reader starts the story confused.',
        'CONTEXT TAKES ONE OR TWO CONCRETE DETAILS, NOT A HISTORY LESSON. A place, a season, a time of day is usually enough to anchor a reader. A paragraph of background before anything happens is not orienting, it is stalling — a reader given nothing to picture yet will not know where to stand.',
        'INTRODUCE A CHARACTER BY NAME AND BY WHAT THAT PERSON IS DOING RIGHT THEN, NOT BY A LIST OF FACTS ABOUT THEM. A reader needs to know who is in the scene and how that person fits it, not that person\'s whole history before the story starts moving.',
        'A NATURAL SEQUENCE BEGINS WHERE THE STORY ACTUALLY BEGINS. Start with the first event that gets the story moving. Starting several steps too early leaves a reader waiting for something to happen; starting by describing how everything eventually turns out gives away the ending before the reader has anything left to read toward.',
        'ORIENTING A READER IS NOT THE SAME JOB AS SUMMARIZING A WHOLE STORY. An opening sets up a beginning; it does not report the middle or the ending in advance. The moment an opening tells a reader how things turned out, it has stopped orienting and started summarizing.',
      ],
      vocabulary: [
        { term: 'orient', definition: 'to give a reader enough context at the start of a narrative to know where the action is happening, when, and who is involved.' },
        { term: 'context', definition: 'the time and place established for a reader at the start of a narrative.' },
        { term: 'narrator', definition: 'the voice telling a narrative; introducing that voice\'s identity is part of orienting a reader.' },
        { term: 'event sequence', definition: 'the order in which the events of a narrative happen, from first to last.' },
        { term: 'natural sequence', definition: 'an event sequence organized so each event follows believably from the one before it, without a confusing jump or an unexplained gap.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-an-oriented-opening',
      kind: 'worked_example',
      problem:
        'Build an opening for a narrative that starts from this idea: a student discovers that the class hamster is missing from its cage. Orient the reader before the first event finishes.',
      steps: [
        'Decide the context first: where and when. A classroom, right after school lets out on a Friday, gives a reader a place and a moment to picture.',
        'Decide who is in the scene. Name one character and give that character a reason to be there right then: Marcus, whose turn it was to feed the class hamster before he left for the day.',
        'Decide the first event of the natural sequence. It should be the thing that starts the story moving, not something that happened days earlier and not something that happens later. Here, that is Marcus finding the cage empty.',
        'Combine the three pieces in that order: context, character, first event. Do not add anything past the first event yet; a reader only needs enough to start, not the ending.',
        'Check the draft against all three jobs. Does it say where and when? Does it name who is there? Does it stop at the first event instead of racing ahead to how the story ends?',
      ],
      answer:
        'On Friday afternoon, after the rest of the class had already left, Marcus stayed behind because it was his turn to feed the class hamster, Biscuit. He lifted the lid of the cage to drop in a few pellets and found the cage empty.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-rushed-opening',
      kind: 'worked_example',
      problem:
        'Repair this draft opening so that it orients the reader instead of racing through the whole story.\n\nDraft: "The bell rang and he panicked and ran to tell the teacher, and everyone helped look, and finally they found the hamster behind the bookshelf and it was fine and everybody laughed about it later."',
      steps: [
        'Find what is missing. No place or time is named beyond the bell ringing, and "he" is never given a name, so a reader cannot picture who is in the room.',
        'Find what has gone too far. The draft does not stop at the first event; it runs all the way through the search and the ending, including how everybody felt about it later. That is a summary of the whole story, not an opening.',
        'Fix the missing pieces first. Give the scene a place and a name: the classroom, right after school, and Marcus.',
        'Fix where the draft stops next. Cut the draft off at the moment the trouble starts, and remove everything that happens after it. A reader does not need to know yet that the hamster turns up safe.',
        'WRONG: "The bell rang and he panicked and ran to tell the teacher, and everyone helped look, and finally they found the hamster behind the bookshelf and it was fine and everybody laughed about it later." CORRECT: "The bell rang, and Marcus was still standing at the hamster cage in Ms. Alvarez\'s empty classroom, staring at the open lid he was sure he had latched. Biscuit was gone."',
        'Check the repaired version against the three jobs again. It names the classroom and the moment school ends, it names Marcus and what he is doing, and it stops right at the first event instead of reporting how the whole story turns out.',
      ],
      answer:
        '"The bell rang, and Marcus was still standing at the hamster cage in Ms. Alvarez\'s empty classroom, staring at the open lid he was sure he had latched. Biscuit was gone." It now names the place and moment, names the character and what he is doing, and stops at the first event instead of reporting the whole search and its happy ending.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-the-oriented-opening',
      kind: 'try_yourself',
      problem:
        'A writer is starting a narrative from this idea: the power goes out across a neighborhood one summer night. Which opening best orients the reader by establishing context, introducing a character, and starting a natural sequence at its first event?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The lights went out, and somebody in the building started shouting for candles while everyone bumped through the dark hallway trying to find a flashlight.' },
        { id: 'b', text: 'It was the middle of a July heat wave when the lights in Marisol\'s apartment building cut out block by block, and she was still on the stairwell landing with a laundry basket when her own floor went dark.', correct: true },
        { id: 'c', text: 'It was the middle of a July heat wave, and the whole block had been running fans and window units nonstop for a week, so when the lights finally cut out one street at a time, half the porches were already crowded with people trying to cool off outside.' },
        { id: 'd', text: 'By the time the power came back on at midnight, the whole block had gathered on the Ortiz family\'s porch with flashlights, and everyone agreed it had turned into the best night of the summer.' },
      ],
      expectedAnswer: 'It was the middle of a July heat wave when the lights in Marisol\'s apartment building cut out block by block, and she was still on the stairwell landing with a laundry basket when her own floor went dark.',
      hints: [
        'Check each opening against three jobs: does it tell you where and when, does it name one person in the scene, and does it stop at the first event instead of running through the whole story?',
        'One opening never names a single person, only a crowd. One tells you how the night ends before it has even started. Only one opening does all three jobs and stops at the very first event.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-new-school-opening',
      kind: 'try_yourself',
      problem:
        'A writer is starting a narrative from this idea: a student\'s first day at a new school. Which opening best orients the reader by establishing context, introducing a character, and starting a natural sequence at its first event?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Talia had moved four times in six years, twice because of her mother\'s job and twice because her old schools had closed, and by now she had learned exactly how to pack a box, how to say goodbye to a bedroom, and how to guess which kids at a new school might turn out to be friendly.' },
        { id: 'b', text: 'By the end of the day, Talia had a full lunch table of new friends and a locker combination she could finally remember without looking, and she decided the move might turn out fine after all.' },
        { id: 'c', text: 'Talia\'s new locker was three doors down from the gym, and she was still trying to remember the combination when the first bell rang and the hallway around her emptied out in seconds.', correct: true },
        { id: 'd', text: 'It was the first day of school, and the hallways were loud with lockers slamming and sneakers squeaking, while nobody seemed to notice one more new student standing near the office door.' },
      ],
      expectedAnswer: 'Talia\'s new locker was three doors down from the gym, and she was still trying to remember the combination when the first bell rang and the hallway around her emptied out in seconds.',
      hints: [
        'Check each opening against three jobs: does it tell you where and when, does it name one person by name, and does it stop at the first event instead of running through the whole story?',
        'One opening spends its length on years of the character\'s history before the actual first day starts. One tells you how the day ends. One never gives the person in the hallway a name. Only one opening names a person, sets the scene, and stops at the first event.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-revise-the-canoe-opening',
      kind: 'try_yourself',
      problem:
        'A writer\'s first draft opens this way: "Some kids were on a canoe trip and it went wrong, and by the end everyone had to swim to shore, and it was actually pretty fun once they dried off." Which revision fixes the opening so that it orients the reader and starts a natural sequence at its first event, without giving away how the trip turns out?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'On a gray Saturday morning, three canoes pushed off from the dock at Coldwater Lake, and within the first few minutes one of them had already flipped.' },
        { id: 'b', text: 'By the time everyone made it to shore soaking wet, Priya was already laughing about it, even though only an hour earlier their canoe had flipped in the middle of Coldwater Lake.' },
        { id: 'c', text: 'Priya had been canoeing with her father every summer since she was seven, and she had memorized every rule about currents and paddling and life jackets long before her class ever signed up for the Coldwater Lake trip, so she was not worried when the day finally arrived.' },
        { id: 'd', text: 'On a gray Saturday morning, Priya climbed into the last canoe leaving the dock at Coldwater Lake, and her paddle had barely touched the water when the boat lurched sideways.', correct: true },
      ],
      expectedAnswer: 'On a gray Saturday morning, Priya climbed into the last canoe leaving the dock at Coldwater Lake, and her paddle had barely touched the water when the boat lurched sideways.',
      hints: [
        'Check the original draft\'s problem first: it reports the whole trip, including how it ends, instead of stopping at the moment things start going wrong. A good revision needs to find that starting moment and stop there.',
        'Two of the four revisions still have not fixed everything: one never names an actual person in a canoe, one still tells the story backward from how it turned out, and one spends its length on years of history before the trip itself has even started. Only one revision names a person, sets the scene, and stops right at the moment the canoe starts to go wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-summary-is-not-orientation',
      kind: 'misconception_check',
      question:
        'A student explains a new opening this way: "I orient the reader by putting the whole story in the first few sentences — that way they already know it turns out okay before anything scary happens." What has gone wrong?',
      commonErrors: [
        {
          answer: 'Telling the reader how the story turns out in the opening lines.',
          misconception:
            'Confusing orienting a reader with reassuring one. The instinct to soften a scary moment by revealing the safe ending first feels considerate, so it does not look like an error.',
          correctsTo:
            'Orienting a reader means giving just enough to start the story: where and when it is happening, who is in it, and the first event. It does not include how the story ends. Revealing the ending in the opening removes the reason to keep reading, and it turns the opening into a plot summary rather than a beginning. Save the ending for the ending.',
        },
        {
          answer: 'Believing a longer opening with more background is automatically a better-oriented one.',
          misconception:
            'Treating background information as the same thing as orientation, so the student piles on facts about a character\'s history instead of anchoring a reader in the moment the story actually begins.',
          correctsTo:
            'A reader needs one or two concrete details of place and time, a named character, and the first event — not a full history. An opening that spends several sentences on backstory before anything happens has not oriented the reader any better than one with too little context; it has only delayed the first event. Check any opening by asking whether a reader could picture where, when, and who within the first sentence or two.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Orienting a reader means answering three questions before the first event finishes: where and when (context), who is in the scene (narrator or characters), and what happens first.',
        'Context needs one or two concrete details, not a history lesson. A paragraph of background before anything happens stalls the story instead of starting it.',
        'Name a character and give that character a reason to be there right then. A crowd of unnamed people does not orient a reader the way one named character does.',
        'A natural sequence starts where the story actually starts. WRONG: an opening that reports how a trip ends before showing how it began. CORRECT: an opening that stops right at the moment things start going wrong.',
        'Orienting a reader is not the same job as summarizing a whole story. An opening sets up a beginning; it does not report the middle or the ending in advance.',
        'Check any opening against all three jobs: place and time, a named character, and a first event the story can move forward from.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Orienting the Reader in a Narrative' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
