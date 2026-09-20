/**
 * Grade 8 Math — Unit 7 CED 7.4: Describing & Sketching Qualitative Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.describing-and-sketching-qualitative-graphs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U7_DESCRIBING_AND_SKETCHING_QUALITATIVE_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.describing-and-sketching-qualitative-graphs.v1',
  course: 'Grade 8 Math',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Describing & Sketching Qualitative Graphs',
  planId: 'evelyn.ms.m8math.describing-and-sketching-qualitative-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.describing-and-sketching-qualitative-graphs.v1' }],
  theory: [
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'A graph is a story read left to right', content: `A GRAPH IS A STORY READ LEFT TO RIGHT — time runs along the horizontal axis, and the quantity you care about, distance from home or gallons in the tub, runs up the vertical axis, just as the dependent variable always has. Moving right is moving forward in time. Wherever the shape changes, a new piece of the story starts, so the first job is always to split the graph into its pieces.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'Up, down, or flat', content: `UP, DOWN, OR FLAT — on a piece where the graph climbs as you move right, the quantity is INCREASING: the rider is getting farther from home. Where the graph falls, the quantity is DECREASING: the rider is heading back. Where the graph is flat, the quantity is CONSTANT: it stays at the same value the whole time. Flat at 2 miles means the rider is sitting 2 miles from home, not at home.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'Straight or curved', content: `STRAIGHT OR CURVED — a straight piece is LINEAR: the quantity changes by the same amount every minute, like a faucet left at one setting. A curved piece is NONLINEAR: the change is speeding up or slowing down, like water that rushes out of a drain at first and then trickles. Of two straight pieces, the steeper one is the one where the quantity is changing faster.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'The graph is not a picture of the trip', content: `THE GRAPH IS NOT A PICTURE OF THE TRIP — a graph of distance from home is not a map and not a hill. A flat piece does not mean flat road; it means the distance is not changing, so the rider is stopped. A falling piece does not mean downhill; it means the distance from home is shrinking, so the rider is coming back. Always ask what the vertical axis measures before you say what a piece means.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'Sketching from a story', content: `SKETCHING FROM A STORY — cut the story into events. For each event decide three things: is the quantity going up, going down, or staying flat; is it steady, which draws straight, or speeding up or slowing down, which draws curved; and about how long it lasts, which is how wide to draw it. Draw the pieces end to end with no gaps, because the quantity has one value at every moment. You never need an equation to do this.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'framework', title: 'Numbers come off the axes', content: `NUMBERS COME OFF THE AXES — the width of a flat piece is how long the stop lasted, found by subtracting the time it started from the time it ended. The height where a piece ends is the amount at that moment, such as the gallons left after draining. Those two reads are the only arithmetic this kind of graph asks for.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'definition', title: 'increasing', content: 'a piece of a graph that climbs as you move right; the quantity is growing.' },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'definition', title: 'decreasing', content: 'a piece of a graph that falls as you move right; the quantity is shrinking.' },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'definition', title: 'constant', content: `a piece of a graph that is flat; the quantity holds the same value, which is the height of the piece.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'definition', title: 'linear piece', content: `a straight piece of a graph; the quantity changes by the same amount in every equal stretch of time.` },
    { loId: 'm8math.describing-and-sketching-qualitative-graphs', kind: 'definition', title: 'nonlinear piece', content: 'a curved piece of a graph; the change is speeding up or slowing down.' },
  ],
  methods: [
    {
      title: 'Worked bike ride in words',
      steps: [
        `Split the graph where the shape changes. There are three pieces: minutes 0 to 12, minutes 12 to 27, and minutes 27 to 45.`,
        `Piece one climbs from 0 miles to 3 miles, so the distance is increasing: Malik is riding away from home. The piece is straight, so it is linear, and he covers the same distance every minute, riding at one steady pace.`,
        `Piece two is flat at 3 miles from minute 12 to minute 27. The distance is constant: it is not changing, so Malik is stopped. He is stopped 3 miles from home, not at home, because the flat piece sits at height 3.`,
        `Piece three falls from 3 miles to 0 miles, so the distance is decreasing: Malik is riding back toward home, and he arrives at minute 45 because the graph reaches 0 there. This piece is straight too, so the ride home is at one steady pace.`,
        `Read the numbers off the axes. The stop lasted 27 - 12 = 15 minutes, the width of the flat piece. The farthest he got is the highest point on the graph, 3 miles. The ride out took 12 minutes and the ride home took 45 - 27 = 18 minutes, so the ride home was slower, which matches the third piece being less steep than the first.`,
        `Check the story against the shape by reading it back left to right: away at a steady pace for 12 minutes, stopped for 15 minutes 3 miles out, home at a steady but slower pace for 18 minutes. Every piece of the story has a piece of graph, and no piece of graph is left over.`,
      ],
      example: { problem: `A graph shows Malik's distance from home, in miles, against time, in minutes, for a bike ride. It has three straight pieces: it climbs from (0, 0) to (12, 3), stays flat from (12, 3) to (27, 3), and falls from (27, 3) to (45, 0). Describe the ride in words, and find how long Malik was stopped and how far from home he got.`, solution: `Increasing and linear for 12 minutes, constant at 3 miles for 15 minutes, then decreasing and linear for 18 minutes back to 0; the stop lasted 15 minutes and Malik got 3 miles from home` },
      relatedLoIds: ['m8math.describing-and-sketching-qualitative-graphs'],
    },
    {
      title: 'Worked bathtub sketch',
      steps: [
        `Cut the story into events: filling, soaking, draining. Three events means three pieces, drawn end to end.`,
        `Filling: the amount goes up, and "steadily" means a straight piece. It starts at (0, 0) and reaches 40 gallons at minute 8, so draw a straight line from (0, 0) up to (8, 40).`,
        `Soaking: the faucet is off and the plug is in, so no water comes in or goes out. The amount is constant at 40 gallons. The soak lasts 15 minutes, so the flat piece runs from minute 8 to minute 8 + 15 = 23: a flat line from (8, 40) to (23, 40).`,
        `Draining: the amount goes down, from 40 gallons to 0. The story says fast at first and then a trickle, so this piece is NOT straight: it is a curve that drops steeply right after minute 23 and flattens out as it nears the bottom. The tub is empty at minute 23 + 6 = 29, so the curve runs from (23, 40) down to (29, 0).`,
        `WRONG: drawing the draining piece as a straight line from (23, 40) to (29, 0). CORRECT: a straight line would mean the same number of gallons leaving every minute, and the story says the water rushes at first and trickles at the end, so the piece must be curved, steep at the start and shallow at the finish.`,
        `WRONG: drawing the soak as a piece that tilts down a little, because the bath is going on and time is passing. CORRECT: time passing moves the graph to the right, not down. Nothing leaves the tub during the soak, so the piece is flat at 40 for all 15 minutes.`,
        `Check by reading the sketch back as a story: a straight climb to 40 in 8 minutes, flat at 40 for 15 minutes, then a curve down to 0 that is steep at first and gentle at the end, finishing at minute 29. That is the story, so the sketch is right. Reading a value off it: at minute 23, just as the plug is pulled, the tub still holds all 40 gallons; at minute 29 it holds 0.`,
      ],
      example: { problem: `Sketch a graph of the amount of water in a bathtub, in gallons, against time, in minutes, from this story. Someone turns the faucet on and the tub fills steadily to 40 gallons in 8 minutes. They turn the faucet off and soak for 15 minutes. Then they pull the plug: the water rushes out fast at first and slows to a trickle as the tub empties, and the tub is empty 6 minutes after the plug is pulled.`, solution: `A straight line from (0, 0) to (8, 40), a flat piece from (8, 40) to (23, 40), then a curve from (23, 40) to (29, 0) that is steep at first and flattens near the end` },
      relatedLoIds: ['m8math.describing-and-sketching-qualitative-graphs'],
    },
  ],
  pointers: [
    { content: `Students often say "The flat piece is flat road and the falling piece is a downhill." — Ask what the vertical axis measures: distance from home. A flat piece means that distance is not changing, so Malik is stopped, whatever the road under him looks like. A falling piece means the distance from home is shrinking, so he is riding back toward home. The graph says nothing about hills; it would look exactly the same on a perfectly flat street.`, kind: 'common-error' },
    { content: `Students often say "The flat piece means Malik was back at home." — Look at the height of the flat piece, not just its flatness. It sits at 3 miles, so for those 15 minutes Malik was 3 miles from home the whole time, most likely stopped at a friend's house or a store. He is at home only where the graph touches 0, at the very start and again at minute 45.`, kind: 'common-error' },
    { content: `Read a graph of a quantity against time from left to right, and split it into pieces wherever the shape changes.`, kind: 'tip' },
    { content: `A climbing piece means the quantity is increasing, a falling piece means it is decreasing, and a flat piece means it is constant, holding the value the piece sits at.`, kind: 'tip' },
    { content: `A straight piece is linear, the same change every minute; a curved piece is nonlinear, speeding up or slowing down. The steeper of two straight pieces is the faster change.`, kind: 'tip' },
    { content: `The graph is not a picture of the trip: flat is not flat road and falling is not downhill. Always ask what the vertical axis measures.`, kind: 'tip' },
    { content: `To sketch from a story, cut it into events, decide up, down, or flat and straight or curved for each, and draw the pieces end to end with no gaps. No equation is needed.`, kind: 'tip' },
    { content: `The width of a flat piece is how long the stop lasted; the height where a piece ends is the amount at that moment.`, kind: 'tip' },
    { content: `Don't read a graph as a picture of the trip. Flat ≠ flat road, and falling ≠ downhill. Always check the vertical axis first — it tells you what quantity you're tracking, not what the terrain looks like.`, kind: 'gotcha' },
    { content: `A flat piece means the quantity stays at whatever height the piece sits at. If it's flat at 3 miles, the rider is 3 miles away the whole time—not at home. The rider is at home only where the graph touches 0.`, kind: 'common-error' },
    { content: `Read values straight off the axes—don't do extra math. The height of a flat piece IS the constant value. The width of a flat piece is the duration (subtract the start time from the end time, nothing more).`, kind: 'tip' },
    { content: `Straight piece = linear = same change per unit time. Curved piece = nonlinear = speeding up or slowing down. Don't call a piece 'straight' unless you mean it's a straight line, not that the road is flat.`, kind: 'vocab-note' },
    { content: `When you sketch from a story, draw pieces end to end with no gaps. The graph must cover every moment in time, from start to finish, without jumps.`, kind: 'tip' },
    { content: `If the story says 'slowly speeds up' or 'quickly slows down,' the piece is curved, not straight. A straight line means the same amount of change every minute, which matches only 'steady' or 'constant pace' language.`, kind: 'edge-case' },
    { content: `When a flat piece appears in the middle of a graph, the quantity is NOT changing, but time IS moving forward. Moving right always means time passes; moving down or staying flat means the quantity changes or doesn't.`, kind: 'gotcha' },
  ],
};
