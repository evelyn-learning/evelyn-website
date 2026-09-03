/**
 * Grade 8 Math — Linear Functions as Models: Describing & Sketching
 * Qualitative Graphs.
 *
 * CONCEPT-LED row 7.4. Every earlier row in this unit hands the student an
 * equation, a table, or a pair of numbers to pull m and b out of; this one
 * hands over a graph with no equation behind it and asks for the story in
 * words, then hands over a story and asks for the graph (CCSS 8.F.B.5). The
 * mental model is that a graph of a quantity against time is a story read
 * left to right in pieces: each piece is climbing, falling, or flat, and each
 * piece is straight or curved. The lesson runs that reading on a bike ride
 * with a stop and on a bathtub that fills, sits, and drains, then reverses it
 * to sketch a graph from a verbal story. The two traps it is built to kill
 * are reading the graph as a picture of the route (a flat piece as flat
 * ground, a falling piece as a downhill) and reading a flat piece as "nothing
 * there" instead of "the same amount the whole time".
 *
 * SCOPE GUARD: Read a function's graph in words — increasing/decreasing,
 * constant, linear/nonlinear intervals (a bike ride with a stop; a bathtub
 * filling, sitting, draining) — and sketch a graph from a verbal story with
 * no equation; numeric item reads a duration or a value off the story (how
 * long was the stop; the volume after draining). Withholds: average rate of
 * change over an interval, f(x), domain/range →
 * `alg1-u4-relations-functions.ts`. Concretely, in the plan body beneath this
 * comment: no equation is written or read, no slope or rate is computed, no
 * table is tested, and the words "domain", "range", "average rate of change"
 * and "f(x)" do not appear. "Linear" and "nonlinear" name the SHAPE of one
 * piece of a graph (straight or curved) and nothing more; testing a table for
 * a constant rate and the y = mx + b family are row 6.2 and are not taught or
 * assessed here. A flat piece is called "constant" and described as the
 * quantity staying at the same value; it is never named a zero slope or a
 * horizontal line as a topic (`alg1-u4-slope-rate-of-change.ts`). Where one
 * straight piece is steeper than another, the plan says only that the
 * quantity is changing faster there, judged by eye, never as a number:
 * reading a rate of change or an initial value with units and predicting from
 * a model are row 7.3, and slope as a computed steepness is Unit 3. The
 * numbers that DO appear (minutes on the time axis, miles or gallons on the
 * vertical axis) are read off the graph or the story as a duration
 * (subtracting two times) or a level (the height of a piece), which the row's
 * own scope cell asks for. The scope cell carries no lineage clause; the
 * assumed ground is the Functions strand's "Below" list — independent and
 * dependent variables (`m6math` row 8.4) and plotting and reading points
 * (`m6math` row 6.1) — recalled in a phrase, never re-taught. Salvage: none.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U7_DESCRIBING_AND_SKETCHING_QUALITATIVE_GRAPHS: LessonPlan = {
  id: 'evelyn.ms.m8math.describing-and-sketching-qualitative-graphs.v1',
  title: 'Describing & Sketching Qualitative Graphs',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.describing-and-sketching-qualitative-graphs',
      standard: 'M8MATH-7.4',
      description:
        'Read a function\'s graph in words -- increasing/decreasing, constant, linear/nonlinear intervals (a bike ride with a stop; a bathtub filling, sitting, draining) -- and sketch a graph from a verbal story with no equation (CCSS 8.F.B.5).',
    },
  ],
  prerequisites: ['m8math.interpreting-and-using-linear-models'],
  followUps: ['m8math.translations-and-reflections'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the shape of a graph alone, with no equation, already tells the whole story of a trip, so reading it in pieces feels worth learning.',
      script:
        'Open the fitness app after a bike ride and it shows one graph: your distance from home against the time since you left. No equation, no table, just a line that climbs, goes flat for a while, climbs again, and then drops back down to zero. A friend who was not on the ride can read that shape and tell you exactly what happened: you rode away, you stopped somewhere, you rode farther, and then you came home. They can even tell you how long you stopped, because the flat part has a width. Today you learn to read a graph like that out loud, piece by piece, and then to do the reverse: take a story with no equation in it and sketch the graph it would make.',
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-graph-as-story',
      kind: 'concept',
      goal: 'Build the read-left-to-right model of a graph in pieces, where each piece climbs, falls, or stays flat and is straight or curved, so a graph can be put into words and a story can be put into a sketch with no equation.',
      keyIdeas: [
        'A GRAPH IS A STORY READ LEFT TO RIGHT — time runs along the horizontal axis, and the quantity you care about, distance from home or gallons in the tub, runs up the vertical axis, just as the dependent variable always has. Moving right is moving forward in time. Wherever the shape changes, a new piece of the story starts, so the first job is always to split the graph into its pieces.',
        'UP, DOWN, OR FLAT — on a piece where the graph climbs as you move right, the quantity is INCREASING: the rider is getting farther from home. Where the graph falls, the quantity is DECREASING: the rider is heading back. Where the graph is flat, the quantity is CONSTANT: it stays at the same value the whole time. Flat at 2 miles means the rider is sitting 2 miles from home, not at home.',
        'STRAIGHT OR CURVED — a straight piece is LINEAR: the quantity changes by the same amount every minute, like a faucet left at one setting. A curved piece is NONLINEAR: the change is speeding up or slowing down, like water that rushes out of a drain at first and then trickles. Of two straight pieces, the steeper one is the one where the quantity is changing faster.',
        'THE GRAPH IS NOT A PICTURE OF THE TRIP — a graph of distance from home is not a map and not a hill. A flat piece does not mean flat road; it means the distance is not changing, so the rider is stopped. A falling piece does not mean downhill; it means the distance from home is shrinking, so the rider is coming back. Always ask what the vertical axis measures before you say what a piece means.',
        'SKETCHING FROM A STORY — cut the story into events. For each event decide three things: is the quantity going up, going down, or staying flat; is it steady, which draws straight, or speeding up or slowing down, which draws curved; and about how long it lasts, which is how wide to draw it. Draw the pieces end to end with no gaps, because the quantity has one value at every moment. You never need an equation to do this.',
        'NUMBERS COME OFF THE AXES — the width of a flat piece is how long the stop lasted, found by subtracting the time it started from the time it ended. The height where a piece ends is the amount at that moment, such as the gallons left after draining. Those two reads are the only arithmetic this kind of graph asks for.',
      ],
      vocabulary: [
        { term: 'increasing', definition: 'a piece of a graph that climbs as you move right; the quantity is growing.' },
        { term: 'decreasing', definition: 'a piece of a graph that falls as you move right; the quantity is shrinking.' },
        { term: 'constant', definition: 'a piece of a graph that is flat; the quantity holds the same value, which is the height of the piece.' },
        { term: 'linear piece', definition: 'a straight piece of a graph; the quantity changes by the same amount in every equal stretch of time.' },
        { term: 'nonlinear piece', definition: 'a curved piece of a graph; the change is speeding up or slowing down.' },
      ],
      suggestedTools: ['show_function_graph', 'show_coordinate_plane'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bike-ride-in-words',
      kind: 'worked_example',
      problem:
        'A graph shows Malik\'s distance from home, in miles, against time, in minutes, for a bike ride. It has three straight pieces: it climbs from (0, 0) to (12, 3), stays flat from (12, 3) to (27, 3), and falls from (27, 3) to (45, 0). Describe the ride in words, and find how long Malik was stopped and how far from home he got.',
      steps: [
        'Split the graph where the shape changes. There are three pieces: minutes 0 to 12, minutes 12 to 27, and minutes 27 to 45.',
        'Piece one climbs from 0 miles to 3 miles, so the distance is increasing: Malik is riding away from home. The piece is straight, so it is linear, and he covers the same distance every minute, riding at one steady pace.',
        'Piece two is flat at 3 miles from minute 12 to minute 27. The distance is constant: it is not changing, so Malik is stopped. He is stopped 3 miles from home, not at home, because the flat piece sits at height 3.',
        'Piece three falls from 3 miles to 0 miles, so the distance is decreasing: Malik is riding back toward home, and he arrives at minute 45 because the graph reaches 0 there. This piece is straight too, so the ride home is at one steady pace.',
        'Read the numbers off the axes. The stop lasted 27 - 12 = 15 minutes, the width of the flat piece. The farthest he got is the highest point on the graph, 3 miles. The ride out took 12 minutes and the ride home took 45 - 27 = 18 minutes, so the ride home was slower, which matches the third piece being less steep than the first.',
        'Check the story against the shape by reading it back left to right: away at a steady pace for 12 minutes, stopped for 15 minutes 3 miles out, home at a steady but slower pace for 18 minutes. Every piece of the story has a piece of graph, and no piece of graph is left over.',
      ],
      answer: 'Increasing and linear for 12 minutes, constant at 3 miles for 15 minutes, then decreasing and linear for 18 minutes back to 0; the stop lasted 15 minutes and Malik got 3 miles from home',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bathtub-sketch',
      kind: 'worked_example',
      problem:
        'Sketch a graph of the amount of water in a bathtub, in gallons, against time, in minutes, from this story. Someone turns the faucet on and the tub fills steadily to 40 gallons in 8 minutes. They turn the faucet off and soak for 15 minutes. Then they pull the plug: the water rushes out fast at first and slows to a trickle as the tub empties, and the tub is empty 6 minutes after the plug is pulled.',
      steps: [
        'Cut the story into events: filling, soaking, draining. Three events means three pieces, drawn end to end.',
        'Filling: the amount goes up, and "steadily" means a straight piece. It starts at (0, 0) and reaches 40 gallons at minute 8, so draw a straight line from (0, 0) up to (8, 40).',
        'Soaking: the faucet is off and the plug is in, so no water comes in or goes out. The amount is constant at 40 gallons. The soak lasts 15 minutes, so the flat piece runs from minute 8 to minute 8 + 15 = 23: a flat line from (8, 40) to (23, 40).',
        'Draining: the amount goes down, from 40 gallons to 0. The story says fast at first and then a trickle, so this piece is NOT straight: it is a curve that drops steeply right after minute 23 and flattens out as it nears the bottom. The tub is empty at minute 23 + 6 = 29, so the curve runs from (23, 40) down to (29, 0).',
        'WRONG: drawing the draining piece as a straight line from (23, 40) to (29, 0). CORRECT: a straight line would mean the same number of gallons leaving every minute, and the story says the water rushes at first and trickles at the end, so the piece must be curved, steep at the start and shallow at the finish.',
        'WRONG: drawing the soak as a piece that tilts down a little, because the bath is going on and time is passing. CORRECT: time passing moves the graph to the right, not down. Nothing leaves the tub during the soak, so the piece is flat at 40 for all 15 minutes.',
        'Check by reading the sketch back as a story: a straight climb to 40 in 8 minutes, flat at 40 for 15 minutes, then a curve down to 0 that is steep at first and gentle at the end, finishing at minute 29. That is the story, so the sketch is right. Reading a value off it: at minute 23, just as the plug is pulled, the tub still holds all 40 gallons; at minute 29 it holds 0.',
      ],
      answer: 'A straight line from (0, 0) to (8, 40), a flat piece from (8, 40) to (23, 40), then a curve from (23, 40) to (29, 0) that is steep at first and flattens near the end',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bathtub-graph-to-story',
      kind: 'try_yourself',
      problem:
        'A graph shows the amount of water in a bathtub, in gallons, against time, in minutes. It rises in a straight line from (0, 0) to (6, 30), stays flat from (6, 30) to (20, 30), then falls in a straight line from (20, 30) to (26, 0). Which story matches the graph?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The tub drains steadily for 6 minutes, holds at one level for 14 minutes, then fills steadily for 6 minutes' },
        { id: 'b', text: 'The tub fills faster and faster for 6 minutes, holds at one level for 14 minutes, then drains steadily for 6 minutes' },
        { id: 'c', text: 'The tub fills steadily for 6 minutes, then the water drops slowly for 14 minutes and quickly for the last 6 minutes' },
        { id: 'd', text: 'The tub fills steadily for 6 minutes, holds at one level for 14 minutes, then drains steadily for 6 minutes', correct: true },
      ],
      expectedAnswer: 'The tub fills steadily for 6 minutes, holds at one level for 14 minutes, then drains steadily for 6 minutes',
      hints: [
        'Read the graph left to right in three pieces. For each piece decide up, down, or flat first, and then straight or curved.',
        'A straight climb means a steady fill, not a fill that speeds up. A flat piece from minute 6 to minute 20 means the amount does not change at all for those 14 minutes, so nothing is draining yet.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bus-stop-story-to-sketch',
      kind: 'try_yourself',
      problem:
        'Priya walks from home to the bus stop at a steady pace, waits there for the bus, then rides the bus, which carries her away from home much faster than she walked. Which sketch shows her distance from home against time?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One straight line that climbs at the same steepness the whole time' },
        { id: 'b', text: 'A straight climb, then a flat piece, then a straight climb that is steeper than the first', correct: true },
        { id: 'c', text: 'A straight climb, then a flat piece, then a straight climb that is less steep than the first' },
        { id: 'd', text: 'A straight climb, then a straight drop back to zero, then a steeper straight climb' },
      ],
      expectedAnswer: 'A straight climb, then a flat piece, then a straight climb that is steeper than the first',
      hints: [
        'Cut the story into three events: walking, waiting, riding. For each one decide whether her distance from home goes up, goes down, or stays the same.',
        'Waiting means her distance from home does not change, so that piece is flat, not falling. Faster means the distance grows more each minute, so the bus piece is steeper than the walking piece.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-total-stop-time',
      kind: 'try_yourself',
      problem:
        'A graph shows Dev\'s distance from home, in miles, against time, in minutes. It has five straight pieces: it climbs from (0, 0) to (8, 2), stays flat until (20, 2), climbs to (30, 4), stays flat until (35, 4), and falls to (50, 0). For how many minutes in total was Dev stopped? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '17',
      hints: [
        'Dev is stopped wherever the graph is flat, because a flat piece means his distance from home is not changing. Find every flat piece, not just the first one.',
        'There are two flat pieces. The first runs from minute 8 to minute 20 and the second from minute 30 to minute 35. Subtract to get the width of each, then add the two widths.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-picture-and-flat-means-zero',
      kind: 'misconception_check',
      question:
        'Two students read the bike-ride graph from the first worked example, which is flat at 3 miles from minute 12 to minute 27 and then falls to 0 at minute 45. Ava says the flat piece means Malik was riding on flat ground and the falling piece means he rode downhill. Ben says the flat piece means Malik was back at home, because nothing was happening. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The flat piece is flat road and the falling piece is a downhill.',
          misconception: 'Reading the graph as a picture of the route, when the vertical axis measures distance from home, not height above the ground.',
          correctsTo:
            'Ask what the vertical axis measures: distance from home. A flat piece means that distance is not changing, so Malik is stopped, whatever the road under him looks like. A falling piece means the distance from home is shrinking, so he is riding back toward home. The graph says nothing about hills; it would look exactly the same on a perfectly flat street.',
        },
        {
          answer: 'The flat piece means Malik was back at home.',
          misconception: 'Treating constant as zero, when a flat piece means the quantity holds whatever value the piece sits at.',
          correctsTo:
            'Look at the height of the flat piece, not just its flatness. It sits at 3 miles, so for those 15 minutes Malik was 3 miles from home the whole time, most likely stopped at a friend\'s house or a store. He is at home only where the graph touches 0, at the very start and again at minute 45.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read a graph of a quantity against time from left to right, and split it into pieces wherever the shape changes.',
        'A climbing piece means the quantity is increasing, a falling piece means it is decreasing, and a flat piece means it is constant, holding the value the piece sits at.',
        'A straight piece is linear, the same change every minute; a curved piece is nonlinear, speeding up or slowing down. The steeper of two straight pieces is the faster change.',
        'The graph is not a picture of the trip: flat is not flat road and falling is not downhill. Always ask what the vertical axis measures.',
        'To sketch from a story, cut it into events, decide up, down, or flat and straight or curved for each, and draw the pieces end to end with no gaps. No equation is needed.',
        'The width of a flat piece is how long the stop lasted; the height where a piece ends is the amount at that moment.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Describing & Sketching Qualitative Graphs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
