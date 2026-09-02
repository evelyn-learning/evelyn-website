/**
 * Grade 6 World Geography — Thinking Like a Geographer & Spatial Skills:
 * Mental Maps & Spatial Thinking.
 *
 * CONCEPT-LED lesson for the m6geo fan-out (National Geography Standard 2).
 * The student has no procedure to run here; the lesson installs one idea --
 * a mental map is the personal picture of a familiar place a person builds
 * just by moving through it, and it works for finding a way around even
 * though it is not measured or drawn to scale. Two traps this plan is built
 * to kill: believing a mental map must be accurate the way a printed map is,
 * and believing two people who know the same space must end up with the
 * same mental map of it.
 *
 * SCOPE GUARD: this row teaches WHAT a mental map is, WHAT it is built from
 * (landmarks and the routes between them, named in plain language, never as
 * a formal named-parts system), and WHAT it is useful for -- choosing a way
 * to go and finding a way around a space a person already knows. It names NO
 * mechanism for HOW a person's mind builds, stores, or updates that picture;
 * that is a question for psychology and cognitive science, not geography,
 * and it is out of scope for this course at any grade, not merely deferred
 * to Grade 7. It also does not use the formal landmark/path/edge/node/
 * district typology from cognitive-mapping and urban-planning theory --
 * "landmark" and "route" are used here as two plain, ungrouped descriptive
 * words, not as members of a closed system. Sideways, this row does not
 * describe a place using a fixed address or a coordinate (absolute
 * location) or by its nearness to another place (relative location) -- that
 * is the very next row, `m6geo.absolute-and-relative-location` -- and it
 * does not reason about why a settlement forms where it does, which is
 * `m6geo.site-and-situation`. What IS deliberately allowed, because both
 * neighbors sit close: naming that a mental map connects landmarks by the
 * routes between them, since that describes the CONTENTS of a personal
 * picture rather than fixing or measuring a location on a shared map. No
 * Grade 7 file teaches this row's subject directly; the caution here is
 * against drifting into an entirely different discipline's mechanism, not
 * against a deeper Grade 7 pass on the same topic.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below is answerable by
 * DEFINE or CLASSIFY. Nothing here explains a process, and nothing chains
 * two "because" links together. The two "sketch and describe" worked
 * examples do the drawing and describing this row's scope line asks for --
 * the tutor performs it aloud -- because the try_yourself format is
 * three-mcq and cannot itself ask a student to sketch anything. The
 * try_yourself items are written as recognition items instead: given a
 * printed description, what does it show, or which of two printed
 * descriptions would actually work.
 *
 * CHECK-MOVE NOTE: geography's usual worked-example close (three
 * independent clues of different kinds, or rewind-then-contrast) does not
 * fit a lesson with no evidence to weigh and no numeric routine to invert.
 * This file uses an equivalent move built for this row: after describing a
 * route forward, describe it backward and confirm it still lands at the
 * start (worked example 1); re-run a described route checking only the
 * order of landmarks and the turns between them, never the distance (worked
 * example 2). Reported as an invented equivalent, per the fan-out contract's
 * own allowance for a row where neither geography exemplar variant fits.
 *
 * OPINION-vs-FORCED NOTE: a mental map is personal and imprecise by
 * definition, so every try_yourself key here is forced by something the
 * item PRINTS, never by a claim about what someone would probably do. Item 1
 * is forced because the printed description names landmarks in the order
 * passed with the turns between them -- that is what it built, independent
 * of anyone's opinion. Item 2 is forced because Student A's printed
 * description has an order and turns and Student B's does not -- the
 * comparison is inside the print, not a judgment about which student is
 * more careful. Item 3 is forced because the stem states outright that the
 * student has never visited the second room -- the key follows from that
 * stated fact, not from a guess about memory.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time, 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor here states a full wrong reason instead of a short wrong
 * label, and no key was built to be the longest choice BECAUSE it is the
 * key. Character counts by choice (a, b, c, d), key marked with *:
 *   Item 1 (try-what-has-she-built): a=101* b=98 c=131 d=99 -- key ranks
 *     2nd of 4 by length.
 *   Item 2 (try-which-description-would-work): a=123 b=115* c=121 d=115 --
 *     key ranks 3rd of 4 by length.
 *   Item 3 (try-only-a-known-space): a=81 b=137 c=122* d=106 -- key ranks
 *     2nd of 4 by length.
 * The key is the strictly longest choice in ZERO of the three items. This is
 * not the target being chased -- under pure chance a three-item file shows 0
 * or 1 about 84% of the time, so this number is weak evidence either way,
 * and it was not driven to zero by shortening any key; two distractors
 * (item 1's `c`, item 2's `a`, `c`, `d`) were lengthened with a fuller wrong
 * reason during drafting, which is what moved them past their keys. The
 * three keys sit at ids a, b and c -- the id set `(1 + 2) mod 4 = 3`
 * requires, omitting d.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U1_MENTAL_MAPS_AND_SPATIAL_THINKING: LessonPlan = {
  id: 'evelyn.ms.m6geo.mental-maps-and-spatial-thinking.v1',
  title: 'Mental Maps & Spatial Thinking',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.mental-maps-and-spatial-thinking',
      standard: 'M6GEO-1.2',
      description:
        'Sketch and describe a mental map of a familiar space and explain how mental maps help people organize and find their way around an area they know (National Geography Standard 2: how to use mental maps to organize information about people, places and environments).',
    },
  ],
  prerequisites: ['m6geo.what-is-geography'],
  followUps: ['m6geo.absolute-and-relative-location'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice they already carry a working map of a familiar space before any vocabulary arrives.',
      script:
        'Get up in the middle of the night at home and you can find your way from your bed to the kitchen in the dark without hitting a wall. You do not carry a flashlight, and you do not stop to check a printed floor plan. You already know where the doorway is, where the hallway turns, and where the counter sticks out. Nobody handed you that plan and nobody measured it out for you. You built it yourself, just by walking through that house again and again. That plan in your head has a name. It is called a mental map, and today you find out what it actually is, what it is made of, and why it still works even when it is not exactly to scale.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mental-maps',
      kind: 'concept',
      goal: 'Install the definition of a mental map, what it is built from, why it does not need to be accurate to work, and where it stops.',
      keyIdeas: [
        "WHAT A MENTAL MAP IS. A mental map is the picture of a familiar place that a person carries around after moving through that place many times. Nobody hands a person a mental map. A person builds one just by using a space regularly -- a home, a classroom, a route walked often.",
        'IT DOES NOT HAVE TO BE PRECISE TO BE USEFUL. A printed map is drawn to a fixed scale so that anyone can measure a true distance from it. A mental map does not work that way. Distances and shapes inside a mental map can be stretched or squeezed and even come out wrong, and the mental map can still do its job perfectly well.',
        'TWO PEOPLE WHO KNOW THE SAME SPACE CAN CARRY DIFFERENT MENTAL MAPS. A mental map is personal -- it is built from one person\'s own trips through a space, not copied from a shared document. Someone who always enters a building from the north door and someone who always enters from the south door can end up with two different mental maps of the very same building, and both can still work.',
        'WHAT A MENTAL MAP IS BUILT FROM. A mental map connects landmarks -- things that stand out enough to be recognized, such as a particular doorway, a tree, or a store -- by the routes a person actually travels between them. Naming the landmarks in the order they are passed, along with the turns between them, is what lets a mental map guide someone from one place to another.',
        'WHAT A MENTAL MAP IS FOR. A mental map lets a person choose a way to go, recognize a landmark as a sign that a turn or a destination is close, and get from one familiar place to another without checking a printed map or asking for directions.',
        'IT ONLY COVERS SPACE A PERSON HAS ACTUALLY MOVED THROUGH. A mental map does not reach past the space a person has experienced. A person can have a detailed mental map of a route walked every day and no mental map at all of a place never visited.',
      ],
      vocabulary: [
        { term: 'mental map', definition: 'the personal picture of a place a person carries in their head, built from actually moving through that place many times.' },
        { term: 'landmark', definition: 'a feature in a familiar space that stands out enough to be easily recognized and used as a fixed point along a route.' },
        { term: 'route', definition: 'the path a person actually travels between two familiar places, described by the landmarks passed and the turns made along the way.' },
        { term: 'familiar space', definition: 'a place a person has visited and moved through often enough to have built a mental map of it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-describe-the-route-aloud',
      kind: 'worked_example',
      problem:
        'Describe, out loud, a mental map for the walk from the front door of a house to the kitchen, naming the landmarks along the way and the route between them. Then check the description by describing the same walk backward, from the kitchen to the front door.',
      steps: [
        'Start by naming the two ends of the route: the front door is the starting landmark and the kitchen is the ending landmark.',
        'Walk through the space in order and name each landmark passed along the way, such as a coat closet, a staircase, or a hallway table -- only the ones actually on this route.',
        'Between each pair of landmarks, name the route: which way to turn, or which direction to keep going, to reach the next landmark.',
        'Put it together and say the whole description once, start to finish: out the front door, past the coat closet, turn right at the staircase, straight down the hallway past the table, into the kitchen.',
        'CHECK: describe the very same walk backward, landmark by landmark, in reverse order, with the turns reversed: out of the kitchen, past the hallway table, turn left at the staircase, straight past the coat closet, to the front door.',
        'If the reversed description still makes sense and lands back at the front door, the mental map holds together in both directions. A route description that only works one way is missing a landmark or a turn somewhere.',
      ],
      answer:
        'Out the front door, past the coat closet, turn right at the staircase, straight down the hallway past the table, into the kitchen -- and the same route said backward, landmark by landmark with the turns reversed, lands back at the front door.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scale-does-not-decide-it',
      kind: 'worked_example',
      problem:
        'A student draws his mental map of the walk from the classroom door to the pencil sharpener. A classmate measures the real distance with a tape measure and says the drawing is stretched to twice the true length, so the mental map is useless. Is the classmate right?',
      steps: [
        'Start with what a mental map is actually for: helping the person find the way through a space he already knows, not giving an exact scaled distance to someone else.',
        "Compare that job to a measured drawing's job. A measured, scaled drawing is built so that anyone can read a true distance from it. A mental map only has to put the landmarks in the right order and show the right turns between them.",
        'Test the description itself rather than the distance: does it still name the same landmarks in the same order, with the same turns, from the classroom door to the pencil sharpener?',
        "WRONG: \"the mental map is useless because it is not the correct scale.\" CORRECT: \"the mental map still works because it correctly shows the order of the landmarks and the turns between them; a mental map does not need to be measured accurately to help someone find the way.\"",
        'CHECK: run the described route in your head from the classroom door to the pencil sharpener, confirming that each landmark and each turn still appears in the right order. The exact length never has to enter the check at all.',
      ],
      answer:
        'The classmate is not right. A mental map does not need to be drawn to scale to be useful. As long as it names the landmarks in the correct order and shows the correct turns between them, it still does its job, even if the distances inside it are stretched.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-has-she-built',
      kind: 'try_yourself',
      problem:
        "A student describes her mental map of the walk from her bedroom to the back yard like this: \"Out my door, past the tall bookshelf, turn right at the kitchen table, then through the sliding door.\" What has she actually built?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A mental map that connects landmarks in the order she passes them, along with the turns between them.', correct: true },
        { id: 'b', text: 'A printed, scaled map of her house that anyone could use to find the exact distance between rooms.' },
        { id: 'c', text: 'A measurement, in meters, of exactly how far it is from her bedroom to the back yard, the kind of number a tape measure would give.' },
        { id: 'd', text: 'A complete list of every room and object in her house, whether or not she passes them on this walk.' },
      ],
      expectedAnswer: 'A mental map that connects landmarks in the order she passes them, along with the turns between them.',
      hints: [
        'Look at exactly what her description contains: is it a set of landmarks and turns, a measured distance, or a full inventory of the house?',
        'She names only the landmarks on this one route, in the order she passes them, with the turns between them -- not every room in the house, and not a distance in meters.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-description-would-work',
      kind: 'try_yourself',
      problem:
        'Two students describe their mental map of the walk from the school gate to the cafeteria. Student A says: "Through the gate, past the tall oak tree, turn left at the flagpole, then through the double doors." Student B says: "There is a gate, an oak tree, a flagpole, and some doors somewhere near the school." Which student\'s mental map would actually help someone find the way from the gate to the cafeteria?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Student B, because naming more separate landmarks always makes a mental map more useful, no matter what order they come in.' },
        { id: 'b', text: 'Student A, because the landmarks are placed in the order a person passes them, connected by the turns between them.', correct: true },
        { id: 'c', text: 'Neither one, because a mental map has to be measured to scale, with exact distances, before it can guide anyone anywhere.' },
        { id: 'd', text: 'Both equally, because a mental map only needs to name the landmarks that exist in a space, regardless of any order.' },
      ],
      expectedAnswer: 'Student A, because the landmarks are placed in the order a person passes them, connected by the turns between them.',
      hints: [
        'Ask which description actually tells you what order to pass things in and which way to turn at each one.',
        'A pile of landmarks with no order and no turns cannot guide anyone from one place to another; scale and measurement are not what makes a mental map useful either.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-only-a-known-space',
      kind: 'try_yourself',
      problem:
        'A student can describe, landmark by landmark and turn by turn, the whole walk from his classroom to the art room. Ask him to describe the walk to the gym, a room in the same building that he has never visited, and he has nothing to say. What does this show about a mental map?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A mental map is only useful once it has been written down and kept for later use.' },
        { id: 'b', text: 'A mental map works the same for a familiar space and a space a person has never visited, since either one can be pictured just as easily.' },
        { id: 'c', text: 'A mental map only covers a space a person has actually moved through, so it does not reach into a place he has never been.', correct: true },
        { id: 'd', text: 'A mental map cannot describe a route unless every landmark along it has an official name posted on a sign.' },
      ],
      expectedAnswer: 'A mental map only covers a space a person has actually moved through, so it does not reach into a place he has never been.',
      hints: [
        'Ask what is different between the two rooms in the question -- one he walks to often, one he has never entered.',
        'A mental map is built by actually moving through a space. It does not reach into a place that has not been experienced, no matter how detailed the map of a nearby space is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-scale-and-sameness',
      kind: 'misconception_check',
      question:
        'A student says: "My mental map has to be exactly to scale to count as correct, and if my friend\'s mental map of the same hallway is different from mine, one of us has to be wrong." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: 'A mental map has to be exactly to scale to count as correct.',
          misconception:
            'Comparing a mental map to a printed, measured map and assuming both are held to the same standard of accuracy.',
          correctsTo:
            'A printed map is drawn to a fixed scale so that a true distance can be measured from it. A mental map does not have to meet that standard. WRONG: "a mental map that is not to scale is not a real mental map." CORRECT: "a mental map still works if it puts the landmarks in the right order and shows the right turns between them, even if the distances inside it are stretched or squeezed."',
        },
        {
          answer: "If my friend's mental map of the same hallway is different from mine, one of us has to be wrong.",
          misconception:
            'Treating a mental map as a single shared document, like a printed map, rather than as something each person builds from their own trips through a space.',
          correctsTo:
            "A mental map is personal. Two people who both know the same hallway well can build two different mental maps of it, based on which door each of them usually enters from or which landmarks stand out to them. Neither mental map has to be wrong -- each one can still correctly guide the person who built it from one end of the hallway to the other.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mental map is the personal picture of a familiar place that a person builds just by moving through it again and again.',
        'A mental map does not have to be drawn to scale to work. It can have stretched or squeezed distances and still guide someone correctly.',
        'A mental map connects landmarks -- things that stand out and are easy to recognize -- by the routes a person actually travels between them, named in order along with the turns.',
        'Two people who both know the same space well can build two different mental maps of it, and neither one has to be wrong.',
        'A mental map lets a person choose a way to go, recognize a landmark as a sign of what comes next, and get from one familiar place to another without a printed map.',
        'A mental map only covers a space a person has actually moved through. It does not reach into a place a person has never visited.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Mental Maps & Spatial Thinking' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
