/**
 * Grade 8 Science (Physical Science) — Describing Motion: Reading
 * Distance-Time Graphs.
 *
 * PROCEDURE-LED row (NGSS DCI PS2.A). One routine runs the whole lesson:
 * break the record into stretches, write down the distance covered and the
 * time taken for each one, label every stretch (no distance covered means at
 * rest; more distance in the same time means faster, which is what a steeper
 * climb is), then take the TOTAL distance divided by the TOTAL time -- stopped
 * seconds included -- for the average speed, and finish by changing one
 * condition to check that the answer moves.
 *
 * The two traps it is built to kill are (a) reading a flat stretch as "moving
 * slowly" or "moving steadily" rather than as at rest, and (b) finding an
 * average speed by averaging the speeds of the moving stretches, which quietly
 * throws away every second the object spent standing still.
 *
 * SCOPE GUARD: this plan reads a distance-time record: a flat stretch means at
 * rest, a steeper stretch means faster, and the total distance divided by the
 * total time gives average speed; it compares two objects' speeds from their
 * records. Its scope cell's withheld clause, verbatim: "Withholds slope as a
 * formal unit rate and the equation of a line, which are Grade 8 Math (CCSS
 * 8.EE.B.5/B.6 -- verified 2026-09-03 against `m8math-CURRICULUM.md` rows 3.1
 * `unit-rate-as-slope` and 3.3 `slope-from-similar-triangles`; this row reads
 * the graph in words and never names "slope")." What that means at each edge,
 * and what is deliberately ALLOWED there:
 *   - GRADE 8 MATH, the cross-course boundary that decides this row. The word
 *     "slope" appears nowhere in this file outside this guard paragraph, and
 *     nothing in the file computes one. Steepness is only ever spoken about in
 *     words ("climbs more steeply", "the same amount of time, more distance"),
 *     it is never a number, never a rise over a run, and never a unit rate.
 *     No equation of a line is written, no coordinate pair is written as a
 *     pair, and no axis is named or labeled. The one formula in the file is
 *     speed = distance ÷ time, which is row 1.1's and is restated here only
 *     because average speed is that same formula applied to the totals.
 *   - GRADE 8 NEIGHBORS. Row 1.1 (reference points and speed) is assumed, not
 *     re-taught: reference points are not mentioned at all, and speed =
 *     distance ÷ time is used as a rule the student already holds. Row 1.3
 *     (velocity and acceleration) is the next lesson and is not taught here:
 *     the words "velocity" and "acceleration" do not appear, no change of
 *     speed is named as acceleration, and direction is never treated as part
 *     of a quantity. The single sentence about a record that comes back DOWN
 *     toward the starting point is there so the student does not conclude a
 *     record can only ever climb or stay flat; it says the object is heading
 *     back the way it came and stops there. No item asks the student to READ
 *     a falling stretch: a return appears once, as a distractor in the first
 *     item that the routine rejects. Row 1.4 (forces
 *     and net force) supplies no content here: no force, newton or push is
 *     named anywhere in this file, and nothing explains WHY any speed changes.
 *   - RECORDS MADE OF STRAIGHT STRETCHES ONLY. Every record described in this
 *     file is made of straight stretches, and the concept segment says so.
 *     A record whose steepness changes smoothly within one stretch is a
 *     continuously changing speed, which is row 1.3's territory, and it is
 *     neither described nor tested here.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears -- no orbit, plate, current, water
 *     cycle or weather anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The people who appear (a cyclist, a runner)
 *     are moving objects with a distance and a clock, never organisms, and
 *     nothing is said about muscles, breathing, organisms or energy for
 *     living things -- the words muscle and organism appear only in this
 *     guard.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the formulas this file
 *     stops short of are a = Δv/t and every vector treatment of motion, which
 *     belong to `ap-physics-newtons-second-deep.ts` and
 *     `ap-physics-c-mech-calculus.ts`. No instantaneous speed, no area under a
 *     record, no negative quantity, no graph of speed against time, and no
 *     chemistry of any kind appears.
 *
 * NOTE ON WHAT THIS FILE TEACHES BUT DELIBERATELY DOES NOT TEST. This is a
 * voice tutor and there are no images, so a graph can only ever be DESCRIBED.
 * Three of the four things the scope line names survive description intact,
 * because they rest on quantities that words carry perfectly well: a flat
 * stretch means at rest, total distance ÷ total time gives average speed, and
 * two objects' speeds can be compared from their records. The fourth --
 * "a steeper stretch means faster" -- survives only in HALF. The reasoning
 * behind it is fully assessable and is assessed: more distance covered in the
 * same amount of time is a greater speed, and that is exactly what makes one
 * stretch of a record climb more than another. What CANNOT be honestly
 * assessed is the perceptual half: judging by eye which of two drawn lines is
 * steeper, with no numbers attached. Every honest attempt collapses one of two
 * ways -- state the distances and times, and the student is comparing numbers
 * rather than seeing steepness; state the steepness in words, and the item
 * only asks whether the student remembers that steeper means faster. So the
 * eye-judgment half is TAUGHT in the concept segment and in both worked
 * examples, and NO item in this file tests it. Items 2 and 3 test the
 * numbers-to-steepness direction instead, which is honest and is the most a
 * described record can ask for.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every record in
 * this file is written out in words inside the item, stretch by stretch, with
 * a distance and a time at each end of every stretch, and every item is
 * solvable from the text printed inside it. The word "graph" is used only as
 * the NAME of the kind of record being described, never as a pointer to
 * something the student is supposed to look at; there is no "the graph shown",
 * no "the figure", and no "as you can see". `suggestedTools` names
 * `show_diagram` on two segments, but that is a hint to the live tutor's
 * whiteboard only -- nothing in this file depends on it, and the practice and
 * quiz surfaces have no board at all.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.1 -> 1.2 -> 1.3
 * (`motion-reference-points-and-speed` ->
 * `reading-distance-time-graphs` -> `velocity-and-acceleration`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U1_READING_DISTANCE_TIME_GRAPHS: LessonPlan = {
  id: 'evelyn.ms.m8sci.reading-distance-time-graphs.v1',
  title: 'Reading Distance-Time Graphs',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.reading-distance-time-graphs',
      standard: 'M8SCI-1.2',
      description:
        'Read a distance-time record: a flat stretch means at rest, a steeper stretch means faster, and the total distance ÷ total time gives average speed; compare two objects\' speeds from their graphs (NGSS DCI PS2.A).',
    },
  ],
  prerequisites: ['m8sci.motion-reference-points-and-speed'],
  followUps: ['m8sci.velocity-and-acceleration'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a record of distance against time holds the whole story of a trip -- including the parts nobody watched -- so the student wants the rules for reading one.',
      script:
        'A phone in your pocket keeps a quiet record while you walk somewhere: how far you have gone, moment by moment, from where you set off. Nothing else. No video, no photos, no notes. And yet somebody handed only that record can tell you things about your walk that feel like a guess and are not. They can tell you that you stood still for about two minutes near the start. They can tell you which part of the walk you hurried, and that you hurried it about twice as fast as the rest. They can tell you how fast you went on average across the whole thing, standing-still time included. All of that is sitting inside two columns of numbers, and the shape those numbers make when they are drawn is called a distance-time graph. Today you learn to read one. By the end you will be able to take a record like that -- described to you stretch by stretch -- and say exactly where the object was at rest, which stretch it was moving fastest in, and what its average speed was for the whole trip.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-record',
      kind: 'concept',
      goal: 'Install what a distance-time record holds, the three things a stretch of it can be doing, why more distance in the same time is a steeper climb, the total-over-total rule for average speed, and the four-step routine.',
      keyIdeas: [
        'WHAT A DISTANCE-TIME RECORD HOLDS. Two numbers at every moment: the time since the trip began, and the total distance the object is from where it started. Drawn out, those pairs make a line, and that line is a distance-time graph. It is worth being exact about what the line does, because everything else follows from it. Time only ever runs forward, so the line only ever travels from left to right as the trip goes on. The distance is what can rise, hold, or come back down. A stretch where the distance is getting bigger means the object is getting farther from where it started. A stretch where the distance holds at one number means it is not getting any farther. A record can also come back down toward the starting number, which means the object is heading back the way it came; naming a direction as part of the motion is the next lesson, and this one stays with records that climb or hold. Every record described in this lesson is made of straight stretches joined end to end.',
        'A FLAT STRETCH MEANS AT REST -- NOT SLOW. If the distance reads 40 meters at the start of a stretch and still reads 40 meters at the end of it, the object covered 40 meters minus 40 meters, which is 0 meters, in that whole stretch of time. Zero meters covered is not a small speed. It is no motion at all: the object is AT REST. This is the first thing people get wrong, because a flat stretch feels calm and steady, and "steady" sounds like "steady speed". It is the opposite. A steady speed is a stretch that climbs by the same amount in every equal piece of time, so it is a straight climbing stretch. Flat is not slow motion and not steady motion. Flat is stopped. And the clock does not stop with the object: the seconds spent at rest still count in the total time of the trip, which is what makes the last key idea matter.',
        'STEEPER MEANS FASTER, AND HERE IS WHY. Take two stretches that last the SAME amount of time. Whichever one covers more distance in that time is the faster one, because that is what more speed means -- more distance in the same time. Now think about what those two stretches look like drawn out. Both take up the same amount of the trip left to right, because they take the same amount of time, but the faster one climbs much further up in that same space. That is what a steeper climb IS. So the steeper a stretch, the faster the object was moving during it, and a flat stretch, which climbs by nothing, is the slowest of all at zero. Two warnings that go with this. First, compare how much a stretch CLIMBS, not how HIGH the line has got: a record can be very high up and barely climbing, and that is an object that has already gone a long way and is now crawling. Second, when the stretches you are comparing last for different amounts of time, you cannot just compare their distances -- work out the speed of each one instead.',
        'AVERAGE SPEED IS THE TOTAL DIVIDED BY THE TOTAL. Speed equals distance divided by time (speed = distance ÷ time). To get the average speed for a whole trip, put the TOTAL distance from start to finish on top and the TOTAL time the trip took underneath: average speed equals total distance divided by total time. The word "total" is doing all the work in that sentence. Every second the object spent at rest is part of the total time, so a trip with a long stop in it has a lower average speed than the same journey without one. As an example, a car whose record climbs steadily from 0 meters at 0 seconds to 90 meters at 10 seconds has an average speed of 90 meters divided by 10 seconds, which is 9 meters per second. Notice that the answer carries a unit built out of both of the units that went into it: meters per second, never just meters and never just a bare number.',
        'COMPARING TWO OBJECTS FROM THEIR RECORDS. Two records can be read against each other as long as they use the same clock and the same starting point. Over any stretch of time, whichever object covered more distance in that stretch was moving faster in it, and its record climbs more steeply there. At any single moment, whichever record has the higher distance is the object that is farther from the start -- that is which one is AHEAD, which is a different question from which one is FASTER. If the two records meet at some moment, both objects are the same distance from the start at that moment, and that is where one has caught up with the other. And two objects can have exactly the same average speed for a trip while their records look nothing alike, because the average only cares about the total distance and the total time, not about how the trip was spread out.',
        'THE ROUTINE, IN ORDER. (1) Break the record into its straight stretches, and for each one write the distance at its start, the distance at its end, and the two times. (2) For each stretch, work out the distance covered -- end distance minus start distance -- and the time taken -- end time minus start time. (3) Label each stretch: 0 meters covered means at rest; otherwise divide the distance covered by the time taken to get the speed for that stretch, and remember that the bigger that speed, the more steeply the record climbs there. (4) If the question asks for the average speed of the whole trip, add up the total distance and the total time, including any time at rest, and divide. Then check the answer: find clues of different kinds that agree, and change one thing about the trip to see whether the answer moves the way it should.',
      ],
      vocabulary: [
        { term: 'distance-time graph', definition: 'the line made by plotting how far an object is from its starting point against how much time has passed since it set off.' },
        { term: 'at rest', definition: 'not moving; over a stretch where an object is at rest, its distance from the starting point does not change at all.' },
        { term: 'steady speed', definition: 'a speed that does not change, so the object covers the same distance in every equal piece of time and its record climbs as a straight stretch.' },
        { term: 'average speed', definition: 'the total distance covered on a trip divided by the total time the trip took, counting any time spent at rest.' },
        { term: 'stretch', definition: 'one straight piece of a record, running from one time to a later time, over which the object was doing one thing.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cyclist-with-a-stop',
      kind: 'worked_example',
      problem:
        'A cyclist rides from her front door to a park along one straight road, and a record of her distance from the door is taken. From 0 seconds to 15 seconds the distance rises steadily from 0 meters to 30 meters. From 15 seconds to 25 seconds it stays at 30 meters. From 25 seconds to 40 seconds it rises steadily from 30 meters to 120 meters. Which stretch is she moving fastest in, and what is her average speed for the whole ride?',
      steps: [
        'Step 1, break the record into stretches and write down what each one runs between. Stretch one runs from 0 seconds to 15 seconds, and the distance runs from 0 meters to 30 meters. Stretch two runs from 15 seconds to 25 seconds, and the distance runs from 30 meters to 30 meters. Stretch three runs from 25 seconds to 40 seconds, and the distance runs from 30 meters to 120 meters.',
        'Step 2, work out the distance covered and the time taken in each stretch. Stretch one: 30 meters minus 0 meters is 30 meters, over 15 seconds minus 0 seconds, which is 15 seconds. Stretch two: 30 meters minus 30 meters is 0 meters, over 25 seconds minus 15 seconds, which is 10 seconds. Stretch three: 120 meters minus 30 meters is 90 meters, over 40 seconds minus 25 seconds, which is 15 seconds.',
        'Step 3, label each stretch. Stretch two covered 0 meters, so she was at rest for those 10 seconds -- waiting at a crossing, perhaps. That stretch is flat. Stretch one and stretch three both took 15 seconds, which makes them easy to compare directly: 90 meters is three times 30 meters, so she covered three times as much ground in stretch three as in stretch one, in the same amount of time. Stretch three is the fastest stretch, and it is the one whose record climbs most steeply. The speeds, if you want them as numbers: 30 meters divided by 15 seconds is 2 meters per second in stretch one, and 90 meters divided by 15 seconds is 6 meters per second in stretch three.',
        'Step 4, the average speed for the whole ride. Total distance: she started at 0 meters and finished at 120 meters, so the total distance is 120 meters. Total time: she started at 0 seconds and finished at 40 seconds, so the total time is 40 seconds, and those 40 seconds include the 10 seconds she spent at rest. Average speed is 120 meters divided by 40 seconds, which is 3 meters per second.',
        'WRONG: "She went at 2 meters per second and then at 6 meters per second, so her average was 2 plus 6, divided by 2, which is 4 meters per second." CORRECT: "Her average speed is the total distance divided by the total time: 120 meters divided by 40 seconds, which is 3 meters per second." Averaging the two moving speeds gives 4 meters per second and is wrong for two separate reasons at once. It throws away the 10 seconds she spent standing at the crossing, which are real seconds of the trip, and it treats the two moving stretches as though they should count equally when they covered very different amounts of ground. The rule is always total over total.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree on stretch three being the fast one. (i) Equal times, compare distances: both stretches lasted 15 seconds, and she covered 90 meters in one and 30 meters in the other. (ii) Equal distances, compare times -- the same comparison turned around: stretch three climbs steadily, so covering its first 30 meters takes a third of its 15 seconds, which is 5 seconds, while stretch one needed the whole 15 seconds to cover its 30 meters. Less time for the same distance is faster. (iii) The arithmetic: 90 divided by 15 is 6, and 30 divided by 15 is 2, so 6 meters per second against 2 meters per second. Three different kinds of clue, one answer.',
        'Second, change one thing about the ride and check that the answer moves the way it should. Suppose the crossing had been clear and she had never stopped -- the same two moving stretches, back to back, with no flat stretch between them. The total distance is still 120 meters, but the total time is now 15 seconds plus 15 seconds, which is 30 seconds, so the average speed becomes 120 meters divided by 30 seconds, which is 4 meters per second instead of 3. The answer moved when the stop was removed, which is what should happen if the stopped time really is part of the total. And notice what did NOT move: her two moving speeds are still 2 meters per second and 6 meters per second. The stop changed the average and nothing else.',
      ],
      answer:
        'She is moving fastest in the third stretch, from 25 seconds to 40 seconds, where she covers 90 meters in 15 seconds -- 6 meters per second -- against 30 meters in 15 seconds, or 2 meters per second, in the first stretch; that third stretch is the one whose record climbs most steeply. Her average speed for the whole ride is the total distance divided by the total time: 120 meters divided by 40 seconds, which is 3 meters per second, and the 10 seconds she spent at rest are part of that 40 seconds.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-drones',
      kind: 'worked_example',
      problem:
        'Two drones fly along the same straight course. They leave the same starting point at the same moment, and a record of each one\'s distance from that point is taken on the same clock. The first drone\'s distance rises steadily from 0 meters at 0 seconds to 300 meters at 60 seconds, with no flat stretch anywhere in it. The second drone\'s distance rises steadily from 0 meters to 60 meters between 0 seconds and 20 seconds, stays at 60 meters from 20 seconds to 30 seconds, then rises steadily from 60 meters to 300 meters between 30 seconds and 60 seconds. Which drone is faster, and which one is ahead at 30 seconds?',
      steps: [
        'Step 1 and step 2, break both records into stretches and work out the distance covered and the time taken in each. The first drone has one stretch: 300 meters minus 0 meters is 300 meters, over 60 seconds minus 0 seconds, which is 60 seconds. The second drone has three. Its first: 60 meters minus 0 meters is 60 meters, over 20 seconds. Its second: 60 meters minus 60 meters is 0 meters, over 30 seconds minus 20 seconds, which is 10 seconds. Its third: 300 meters minus 60 meters is 240 meters, over 60 seconds minus 30 seconds, which is 30 seconds.',
        'Step 3, label the stretches. The first drone has one straight climbing stretch and no flat stretch at all, so it never stopped and its speed never changed: 300 meters divided by 60 seconds is 5 meters per second, held for the whole flight. The second drone has a gentle climb, then a flat stretch, then a steep climb. Its first stretch is 60 meters divided by 20 seconds, which is 3 meters per second. Its second stretch covered 0 meters, so it was at rest -- hovering -- for 10 seconds. Its third stretch is 240 meters divided by 30 seconds, which is 8 meters per second, the steepest climb in either record.',
        'Step 4, answer "which is faster" carefully, because it depends on when. From 0 seconds to 20 seconds the first drone covered 5 meters per second times 20 seconds, which is 100 meters, while the second covered 60 meters, so the first was faster there. From 30 seconds to 60 seconds the first covered 300 meters minus 150 meters, which is 150 meters, while the second covered 240 meters, so the second was faster there. Over the whole flight, though, both records start at 0 meters at 0 seconds and finish at 300 meters at 60 seconds, so both average speeds are 300 meters divided by 60 seconds, which is 5 meters per second. The two flights have exactly the same average speed and look nothing alike.',
        'WRONG: "The second drone reached 8 meters per second and the first one never went above 5 meters per second, so the second drone is the faster drone." CORRECT: "The second drone was faster in its last stretch, slower in its first, and at rest in the middle, and over the whole flight the two have the same average speed of 5 meters per second." The steepest climb in a record tells you about that stretch and nothing else. Average speed is total over total, and the second drone paid back its steep stretch with a slow one and 10 seconds of hovering.',
        'Now the "who is ahead at 30 seconds" question, which is about height, not steepness. At 30 seconds the first drone has been going at 5 meters per second for 30 seconds, so it is 5 times 30, which is 150 meters, from the start. At the same moment the second drone has just finished hovering and is still at 60 meters. The first drone is ahead by 150 meters minus 60 meters, which is 90 meters. The two records only meet at 60 seconds, at 300 meters, so the second drone never gets in front -- it catches up exactly at the finish.',
        'Run the two checks. First, three clues of DIFFERENT KINDS that agree that the average speeds are equal. (i) The end points: both records begin at 0 meters at 0 seconds and end at 300 meters at 60 seconds, which is the same distance in the same time. (ii) The arithmetic: 300 divided by 60 is 5 for each of them, so 5 meters per second each. (iii) An adding-up check on the second drone, which is a different kind of clue because it tests the record against itself rather than against the other drone: its three stretches cover 60 meters plus 0 meters plus 240 meters, which is 300 meters, over 20 seconds plus 10 seconds plus 30 seconds, which is 60 seconds -- and those totals match the numbers its record starts and finishes with, so no stretch has been misread.',
        'Second, change one thing and check that the answer moves. Take away the second drone\'s 10-second hover and let it fly its steep stretch straight after its gentle one. It would then cover the same 300 meters in 20 seconds plus 30 seconds, which is 50 seconds, so its average speed would be 300 meters divided by 50 seconds, which is 6 meters per second -- higher than the first drone\'s 5 meters per second. Its record would also rise above the first drone\'s before the finish instead of meeting it there. One condition changed, and a tie became a win, which is what should happen if stopped time really is counted in the average.',
      ],
      answer:
        'Neither drone is faster overall: both cover 300 meters in 60 seconds, so both have an average speed of 300 meters divided by 60 seconds, which is 5 meters per second. The second drone is faster only in its last stretch, at 240 meters in 30 seconds, or 8 meters per second, and it is slower in its first stretch, at 3 meters per second, and at rest for 10 seconds in the middle. At 30 seconds the first drone is ahead: it is 150 meters from the start while the second drone is still at 60 meters, a gap of 90 meters. The two records meet only at the finish.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-flat-stretch',
      kind: 'try_yourself',
      problem:
        'A delivery robot rolls along a straight sidewalk, and a record of its distance from the starting point is taken. From 0 seconds to 12 seconds the distance rises steadily from 0 meters to 24 meters. From 12 seconds to 20 seconds the distance stays at 24 meters. From 20 seconds to 32 seconds the distance rises steadily from 24 meters to 72 meters. What is the robot doing between 12 seconds and 20 seconds?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is moving very slowly, because the record is still being taken through those 8 seconds, and a record that keeps running has to be recording some movement -- just too little of it to change the numbers.' },
        { id: 'b', text: 'It is moving at a steady 24 meters per second, because the reading holds at 24 meters right through those 8 seconds, and a reading that holds steady is what a steady speed looks like in a record.' },
        { id: 'c', text: 'It is heading back toward the starting point, because the record has stopped climbing, and the only thing that stops a record climbing is the robot turning around and coming back the way it came.' },
        { id: 'd', text: 'It is at rest, because its distance from the start is 24 meters at the beginning of that stretch and still 24 meters at the end, so it covered 0 meters in those 8 seconds, which is no motion at all.', correct: true },
      ],
      expectedAnswer: 'It is at rest, because its distance from the start is 24 meters at the beginning of that stretch and still 24 meters at the end, so it covered 0 meters in those 8 seconds, which is no motion at all.',
      hints: [
        'Do what the routine says for that stretch: subtract the distance at the start of it from the distance at the end of it. How many meters did the robot cover between 12 seconds and 20 seconds?',
        'A distance that is not changing is not a small speed and it is not a steady speed either. Ask what an object must be doing to cover zero meters while eight seconds go by.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-steepest-stretch',
      kind: 'try_yourself',
      problem:
        'A runner moves along a straight track, and a record of her distance from the starting line is taken. From 0 seconds to 5 seconds the distance rises steadily from 0 meters to 10 meters. From 5 seconds to 10 seconds it rises steadily from 10 meters to 40 meters. From 10 seconds to 15 seconds it rises steadily from 40 meters to 55 meters. In which stretch does her record climb most steeply, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stretch from 5 to 10 seconds, because the runner covers 30 meters in those 5 seconds while covering only 10 meters and then 15 meters in the other two 5-second stretches, so she is moving fastest there.', correct: true },
        { id: 'b', text: 'The stretch from 10 to 15 seconds, because the record reaches its highest distance of 55 meters in that stretch, and the stretch that ends highest is the one where the record has climbed most steeply.' },
        { id: 'c', text: 'The stretch from 0 to 5 seconds, because that is where the runner leaves the starting line, and a record always climbs most steeply right at the start before the runner has had any time to tire.' },
        { id: 'd', text: 'All three stretches climb equally steeply, because each of them lasts exactly 5 seconds, and stretches that take the same amount of time must climb by the same amount as one another.' },
      ],
      expectedAnswer: 'The stretch from 5 to 10 seconds, because the runner covers 30 meters in those 5 seconds while covering only 10 meters and then 15 meters in the other two 5-second stretches, so she is moving fastest there.',
      hints: [
        'All three stretches last the same 5 seconds, which makes them easy to compare without dividing anything. Work out the distance covered in each one: end distance minus start distance.',
        'Steepness is about how much a stretch CLIMBS, not about how high the record has got by the end of it. The stretch that gains the most meters in its 5 seconds is the steep one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-average-speed-with-a-stop',
      kind: 'try_yourself',
      problem:
        'Two remote-control cars run along the same straight track, leaving the same starting point at the same moment, with a record of each car\'s distance from that point taken on the same clock. The first car\'s distance rises steadily from 0 meters at 0 seconds to 160 meters at 40 seconds, with no flat stretch in it. The second car\'s distance rises steadily from 0 meters to 20 meters between 0 seconds and 10 seconds, stays at 20 meters from 10 seconds to 20 seconds, then rises steadily from 20 meters to 120 meters between 20 seconds and 40 seconds. Which statement about the two records is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The second car has the higher average speed for the whole 40 seconds, because its last stretch is the steepest climb in either record, and the steepest climb anywhere in a record sets the average speed for all of it.' },
        { id: 'b', text: 'The first car has the higher average speed for the whole 40 seconds, because it covers 160 meters in those 40 seconds while the second car covers only 120 meters, even though the second car\'s last stretch is the steepest climb in either record.', correct: true },
        { id: 'c', text: 'The two cars have the same average speed for the whole 40 seconds, because the second car makes up for its 10 seconds at rest by climbing more steeply afterward, and a stretch at rest is always cancelled out that way.' },
        { id: 'd', text: 'The second car\'s average speed for the trip is also 4 meters per second, because the 10 seconds it spent at rest do not count toward the time of a trip, so its 120 meters is divided by the 30 seconds it was actually moving.' },
      ],
      expectedAnswer: 'The first car has the higher average speed for the whole 40 seconds, because it covers 160 meters in those 40 seconds while the second car covers only 120 meters, even though the second car\'s last stretch is the steepest climb in either record.',
      hints: [
        'Average speed is the total distance divided by the total time. Both cars ran for the same 40 seconds, so read each record\'s finishing distance and compare those two totals.',
        'Work out the second car\'s steepest stretch as a speed and compare it with the first car\'s speed -- then ask whether one steep stretch can decide an average that has 40 seconds in it, 10 of them spent at rest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flat-and-averaging',
      kind: 'misconception_check',
      question:
        'A student writes: "The flat part of the record is where the object was moving at a steady speed. And to get the average speed for the whole trip, you just average the speeds of the parts where it was moving." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The flat part of the record is where the object was moving at a steady speed.',
          misconception:
            'Hearing "flat" as "level, calm, unchanging" and sliding from there to "unchanging speed", because a flat stretch does look like the most settled part of a record.',
          correctsTo:
            'A flat stretch is one where the distance from the starting point does not change at all: the same number at the start of the stretch and at the end of it, so the distance covered is that number minus itself, which is 0 meters. Zero meters covered means the object was AT REST for that whole stretch, not moving slowly and not moving steadily. A steady speed looks completely different in a record: it is a stretch that climbs, and climbs by the same amount in every equal piece of time, so it is a straight climbing stretch. The thing that is unchanging on a flat stretch is the DISTANCE, not the speed. WRONG: "Flat means a steady speed." CORRECT: "Flat means the distance is not changing, so the object is at rest. A steady speed is a straight stretch that climbs."',
        },
        {
          answer: 'To get the average speed for the whole trip, average the speeds of the parts where it was moving.',
          misconception:
            'Treating "average speed" as an average of the speeds in the list, which quietly throws away every second the object spent at rest and also gives a short stretch the same weight as a long one.',
          correctsTo:
            'Average speed is the TOTAL distance divided by the TOTAL time, and the total time includes every second the object spent standing still. Take the cyclist from earlier in this lesson: 2 meters per second for 15 seconds, at rest for 10 seconds, then 6 meters per second for 15 seconds. Averaging the two moving speeds gives 2 plus 6, divided by 2, which is 4 meters per second. The true average is 120 meters divided by 40 seconds, which is 3 meters per second. The gap between 4 and 3 is exactly the 10 seconds that were dropped, plus the fact that the two moving stretches covered very different distances. WRONG: "Average the speeds you found." CORRECT: "Add up the total distance, add up the total time including the stops, and divide one by the other."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A distance-time graph plots how far an object is from its starting point against how much time has passed. Time runs forward, so the line always moves left to right; the distance is what rises, holds, or comes back down.',
        'A flat stretch means the distance did not change, so the object covered 0 meters and was AT REST. Flat is not slow and it is not a steady speed.',
        'A steady speed is a straight climbing stretch: the same distance covered in every equal piece of time.',
        'Steeper means faster, because a steeper stretch covers more distance in the same amount of time. Compare how much a stretch CLIMBS, not how high the record has got.',
        'When two stretches last different amounts of time, do not compare their distances -- work out the speed of each one instead, with speed = distance ÷ time.',
        'Average speed for a whole trip is the total distance divided by the total time, and every second spent at rest counts in that total time.',
        'Never find an average speed by averaging the speeds of the moving parts. That drops the stopped time and weights a short stretch like a long one.',
        'To compare two objects, use the same clock and the same starting point. Over a stretch of time, more distance covered means faster; at a single moment, the higher distance means farther ahead, which is a different question from faster.',
        'Two objects can have the same average speed and records that look nothing alike, because the average only cares about the total distance and the total time.',
        'Every speed carries a unit built from both of the units that made it: meters per second, never a bare number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Reading Distance-Time Graphs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
