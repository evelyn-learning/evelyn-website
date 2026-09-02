/**
 * Grade 6 World Geography — Reading & Using Maps: Hemispheres, the Equator &
 * the Prime Meridian.
 *
 * PROCEDURE-LED exemplar for the m6geo fan-out (National Geography Standard
 * 1). The shape is deliberately different from the concept-led exemplar: the
 * concept segment is a short ordered routine rather than a mental model, the
 * first worked example runs the routine straight through and the second runs
 * the same two questions again to repair a wrong answer, and every answer ends
 * with a check. Two traps this plan is built to kill: swapping which line does
 * which job, and believing a place sits in only one hemisphere.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. Is the place north or south of the Equator?  -> Northern or Southern.
 *   2. Is the place east or west of the Prime Meridian? -> Eastern or Western.
 *   Name the north-south answer first, then the east-west answer.
 *
 * SCOPE GUARD: this row LOCATES the two lines and names the four halves they
 * make. No measurement appears anywhere in the lesson prose: no degrees, no
 * coordinate, no hemisphere letters. Reading or writing a full
 * latitude-longitude pair with its letters, and the ranges those numbers run
 * through, are Grade 7 (`m7geo-u1-latitude-longitude-and-location.ts`) and
 * must not appear here. Sideways, absolute versus relative location is Grade 6
 * row 1.3 and stays out of this file too. What IS deliberately allowed,
 * because row 1.3 and the Grade 7 row both sit close: naming Greenwich as the
 * place the Prime Meridian passes through, and naming the line opposite it as
 * the thing that completes the east-west split. Both are LOCATING facts about
 * the two lines themselves, which is this row, and neither describes a place
 * by what it is near or attaches a number to anything.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item in this lesson is answered by
 * LOCATE or IDENTIFY. Nothing here asks why the lines are where they are, and
 * nothing here is measured. If a sentence you write for your own row would sit
 * comfortably in the Grade 7 file on the same subject, it is over the ceiling.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4). Every distractor here states a full wrong
 * reason rather than a short wrong label. Measured: the correct choice is the
 * strictly longest in NONE of the three items (the rule allows at most one),
 * and the three correct choices sit at ids b, d and a -- which is the id set
 * `(2 + 4) mod 4 = 2` requires, omitting c. The first item uses
 * parallel-structure options, all four exactly 50 characters by construction --
 * the cheapest way to make the length cue impossible.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.3 -> 2.4 ->
 * 3.1, but rows 2.3 and 3.1 are authored in the fan-out that follows this
 * commit. `lint-ms-plans` rejects a prerequisite/followUp that does not
 * resolve to a registered LO, so both arrays stay empty until the full 40-row
 * batch lands and the controller wires the chain. Do NOT copy the empty
 * arrays into your own file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U2_HEMISPHERES_EQUATOR_AND_PRIME_MERIDIAN: LessonPlan = {
  id: 'evelyn.ms.m6geo.hemispheres-equator-and-prime-meridian.v1',
  title: 'Hemispheres, the Equator & the Prime Meridian',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.hemispheres-equator-and-prime-meridian',
      standard: 'M6GEO-2.4',
      description:
        'Locate the Equator, the Prime Meridian, and the four hemispheres they create, and state which hemispheres contain a described place (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the whole globe needs a shared way to be cut in half before any line is named.',
      script:
        'Imagine somebody hands you an orange and asks you to cut it into halves, then hand one half to a friend. Easy. Now imagine four people are doing the same thing to the same orange in four different rooms, and every one of them has to cut in exactly the same place, or none of the halves will match. That is the problem geographers had with Earth. Everybody needed to be able to say the top half or the bottom half, the east half or the west half, and mean the same halves as everybody else. So people agreed on two lines. Once you know those two lines, you can take any place on Earth and say which halves it is in, and today you get the two questions that do it every single time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-lines-two-questions',
      kind: 'concept',
      goal: 'Install the two lines, the four halves, and the fixed two-question routine that names them.',
      keyIdeas: [
        'A HEMISPHERE IS HALF OF EARTH. The word comes apart neatly: hemi means half, and sphere means ball. So a hemisphere is half of the ball. There are four named halves, and they come in two pairs -- a north-south pair and an east-west pair.',
        'THE EQUATOR MAKES THE NORTH-SOUTH PAIR. The Equator is a line that runs east and west all the way around the widest part of Earth, halfway between the North Pole and the South Pole. Everything north of it is in the NORTHERN HEMISPHERE. Everything south of it is in the SOUTHERN HEMISPHERE.',
        'THE PRIME MERIDIAN MAKES THE EAST-WEST PAIR. The Prime Meridian is a line that runs from the North Pole to the South Pole, passing through Greenwich, a part of London in England. Going one way from it puts you in the EASTERN HEMISPHERE, and going the other way puts you in the WESTERN HEMISPHERE. The two halves are completed by the line directly opposite the Prime Meridian, on the far side of the globe.',
        'BOTH LINES ARE AGREED ON, NOT PAINTED ON. Neither line is a stripe you could see from a plane or stand on and photograph. They are imaginary lines that people agreed to draw on maps and globes so that everybody means the same halves. The Equator sits where it does because of the shape of Earth and where the poles are. The Prime Meridian sits where it does because people chose that spot.',
        'THE TWO QUESTIONS, ALWAYS IN THIS ORDER. Question 1: is the place north or south of the Equator? That gives you Northern or Southern. Question 2: is the place east or west of the Prime Meridian? That gives you Eastern or Western. Say the north-south answer first and the east-west answer second. Almost every place on Earth is in two hemispheres, one from each pair -- never just one. The one exception is a place sitting exactly on one of the two lines, which is on the boundary rather than inside either half of that pair.',
        'A BIG AREA CAN SPREAD ACROSS A LINE AND SIT IN MORE THAN TWO. One point is in exactly two hemispheres, but a whole continent is not a point. Both lines cross Africa: the Equator runs across the middle of it and the Prime Meridian runs down through its western part, so Africa has land in all four hemispheres. Compare that with Antarctica, which lies entirely south of the Equator, so all of it is in the Southern Hemisphere.',
      ],
      vocabulary: [
        { term: 'hemisphere', definition: 'half of Earth, made by cutting the globe along an agreed line.' },
        { term: 'Equator', definition: 'the imaginary line running around the middle of Earth, halfway between the two poles, that separates the Northern Hemisphere from the Southern Hemisphere.' },
        { term: 'Prime Meridian', definition: 'the imaginary line running from pole to pole through Greenwich, in London, England, that separates the Eastern Hemisphere from the Western Hemisphere.' },
        { term: 'pole', definition: 'one of the two points at the very top and the very bottom of Earth, called the North Pole and the South Pole.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-two-questions',
      kind: 'worked_example',
      problem:
        'A ship keeps a log. It reads: "Tuesday morning, sailing north, we crossed the Equator. Friday afternoon, sailing west, we crossed the Prime Meridian." There is no map here -- work only from the words. Which two hemispheres is the ship in on Saturday?',
      steps: [
        'Run question 1 first, every time: is the ship north or south of the Equator? The log says the ship crossed the Equator while sailing north. Crossing a line while heading north puts you on the north side of it, so the ship is now north of the Equator. That means the Northern Hemisphere.',
        'Now run question 2: is the ship east or west of the Prime Meridian? The log says the ship crossed the Prime Meridian while sailing west. Crossing a line while heading west puts you on the west side of it, so the ship is now west of the Prime Meridian. That means the Western Hemisphere.',
        'Say the answer in the fixed order, north-south first: the ship is in the Northern Hemisphere and the Western Hemisphere.',
        'Check the answer by rewinding the log. Before Tuesday morning the ship had not crossed the Equator yet, so it was south of it and therefore in the Southern Hemisphere then. Crossing a line is exactly what changes which half you are in, and that is the only thing that changes it.',
        'Check the shape of the answer too. There are two hemispheres named, and they come from different pairs -- one from the north-south pair and one from the east-west pair. An answer with two from the same pair, such as Northern and Southern, would be impossible.',
      ],
      answer:
        'The Northern Hemisphere and the Western Hemisphere. The ship crossed the Equator heading north, which put it north of that line, and crossed the Prime Meridian heading west, which put it west of that line.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-not-one',
      kind: 'worked_example',
      problem:
        'A student writes: "Australia is in the Southern Hemisphere, so it is not in any other hemisphere. And Africa must be in exactly two hemispheres, because everywhere is." Both sentences have something wrong with them. Correct each one.',
      steps: [
        'Take the Australia claim first. WRONG: "Australia is in the Southern Hemisphere, so it is not in any other hemisphere." The mistake is stopping after question 1 and never running question 2.',
        'Run both questions on Australia. Question 1: Australia lies entirely south of the Equator, so it is in the Southern Hemisphere. Question 2: Australia lies east of the Prime Meridian, so it is in the Eastern Hemisphere. CORRECT: Australia is in the Southern Hemisphere and the Eastern Hemisphere.',
        'State the rule the student was missing. A place is in two hemispheres, one from each pair. An answer that names only one half is an unfinished answer, because it has answered only one of the two questions.',
        'Now take the Africa claim. The student is right that a single point away from the two lines sits in exactly two hemispheres. The mistake is treating a whole continent as if it were a point.',
        'Check whether either line crosses Africa. The Equator runs across the middle of Africa, so Africa has land north of it and land south of it. The Prime Meridian runs down through the western part of Africa, so Africa has land east of it and land west of it. CORRECT: Africa has land in all four hemispheres.',
        'Finish with a contrasting case so the idea is not overlearned. Antarctica lies entirely south of the Equator, with no part of it north of that line, so every bit of Antarctica is in the Southern Hemisphere. Check each line on its own, and only for the pair it decides: the Equator is the line that decides Northern or Southern, and no part of Antarctica lies north of it.',
      ],
      answer:
        'Australia is in the Southern Hemisphere AND the Eastern Hemisphere, because a place sits in two hemispheres, one from each pair. Africa is not limited to two: both the Equator and the Prime Meridian cross it, so Africa has land in all four hemispheres.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-run-the-routine',
      kind: 'try_yourself',
      problem:
        'A weather station sits north of the Equator and west of the Prime Meridian. Which two hemispheres is the weather station in?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Southern Hemisphere and the Western Hemisphere' },
        { id: 'b', text: 'The Northern Hemisphere and the Western Hemisphere', correct: true },
        { id: 'c', text: 'The Northern Hemisphere and the Eastern Hemisphere' },
        { id: 'd', text: 'The Southern Hemisphere and the Eastern Hemisphere' },
      ],
      expectedAnswer: 'The Northern Hemisphere and the Western Hemisphere',
      hints: [
        'Run the two questions in order. North or south of the Equator first, then east or west of the Prime Meridian.',
        'North of the Equator gives Northern, not Southern. West of the Prime Meridian gives Western, not Eastern. Both halves of the answer have to match the description.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-line-does-which-job',
      kind: 'try_yourself',
      problem: 'Which line separates the Northern Hemisphere from the Southern Hemisphere?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Prime Meridian, which runs from the North Pole to the South Pole' },
        { id: 'b', text: 'The line directly opposite the Prime Meridian on the far side of the globe' },
        { id: 'c', text: 'The border where the Eastern Hemisphere meets the Western Hemisphere' },
        { id: 'd', text: 'The Equator, which circles Earth halfway between the poles', correct: true },
      ],
      expectedAnswer: 'The Equator, which circles Earth halfway between the poles',
      hints: [
        'Northern and Southern are the north-south pair. Ask which of the two lines was the one that made that pair.',
        'A line that runs from pole to pole separates east from west, not north from south. Three of these choices describe the east-west split.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-continent-across-a-line',
      kind: 'try_yourself',
      problem:
        'Both the Equator and the Prime Meridian run across the continent of Africa. What does that tell you about where the land of Africa lies?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Africa has land in all four hemispheres, because both lines run across it.', correct: true },
        { id: 'b', text: 'Africa lies only in the Eastern Hemisphere, since it is east of the Americas.' },
        { id: 'c', text: 'Africa lies only in the Southern Hemisphere, since the Equator is its top edge.' },
        { id: 'd', text: 'Africa lies in exactly two hemispheres, since every place lies in exactly two.' },
      ],
      expectedAnswer: 'Africa has land in all four hemispheres, because both lines run across it.',
      hints: [
        'A single point is in exactly two hemispheres. A continent is not a single point.',
        'If a line runs across the middle of a continent, then some of that continent is on one side of the line and some is on the other side. Two lines running across it means both pairs get split.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lines-swapped-and-one-hemisphere',
      kind: 'misconception_check',
      question:
        'A student says: "The Prime Meridian separates the Northern Hemisphere from the Southern Hemisphere. And once you know a place is in the Southern Hemisphere, you are finished -- that is the hemisphere it is in." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The Prime Meridian separates the Northern Hemisphere from the Southern Hemisphere.',
          misconception:
            'Remembering that there are two lines and two pairs of halves, but attaching the wrong line to the wrong pair. The Prime Meridian runs north to south, so the student assumes it must therefore separate north from south.',
          correctsTo:
            'The direction a line RUNS is not the direction it SEPARATES. The Prime Meridian runs from pole to pole, and because it runs that way it has an east side and a west side, so it separates the Eastern Hemisphere from the Western Hemisphere. The Equator runs east and west around the middle of Earth, so it has a north side and a south side, and it is the line that separates the Northern Hemisphere from the Southern Hemisphere. WRONG: "the Prime Meridian separates north from south." CORRECT: "the Equator separates north from south, and the Prime Meridian separates east from west."',
        },
        {
          answer: 'Once you know a place is in the Southern Hemisphere, that is the hemisphere it is in.',
          misconception:
            'Treating the four hemispheres as four boxes and assuming a place goes into exactly one of them, so the first correct label found must be the whole answer.',
          correctsTo:
            'The four hemispheres are two separate pairs, not four boxes. A place away from the two lines has to be either north or south of the Equator, and it also has to be either east or west of the Prime Meridian. So it sits in two hemispheres at once, one from each pair. Knowing that a place is in the Southern Hemisphere answers question 1 and leaves question 2 untouched. Australia is in the Southern Hemisphere and the Eastern Hemisphere. Naming only one half is an unfinished answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A hemisphere is half of Earth. There are four, and they come in two pairs: north-south and east-west.',
        'The Equator runs east and west around the middle of Earth, halfway between the poles, and it separates the Northern Hemisphere from the Southern Hemisphere.',
        'The Prime Meridian runs from pole to pole through Greenwich, in London, England, and it separates the Eastern Hemisphere from the Western Hemisphere.',
        'The routine is two questions, always in this order: north or south of the Equator, then east or west of the Prime Meridian. Name the north-south answer first.',
        'Almost every place on Earth is in two hemispheres, one from each pair; only a place sitting exactly on one of the lines is not. Naming only one is an unfinished answer.',
        'A large area can spread across a line. Both lines cross Africa, so Africa has land in all four hemispheres, while Antarctica lies entirely in the Southern Hemisphere.',
        'Both lines are agreed on rather than painted on. Nobody can see them from a plane.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Hemispheres, the Equator & the Prime Meridian' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
