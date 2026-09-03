/**
 * Grade 8 Science (Physical Science) — Describing Motion: Motion, Reference
 * Points & Speed.
 *
 * PROCEDURE-LED row (NGSS DCI PS2.A), and the first lesson of the course. One
 * routine runs the whole file: name the reference point, compare the object's
 * position with that point at two moments to decide "moving or at rest", and
 * then -- if a number is wanted -- divide the total distance by the total time,
 * say the answer with its unit, and check it by multiplying back. The two
 * halves are one routine on purpose: the reference point is what makes
 * "distance traveled" mean anything, and a speed is meaningless without it.
 *
 * The three traps it is built to kill are (a) treating motion as a property an
 * object has by itself, so that "moving" and "at rest" cannot both be true of
 * one object at one moment; (b) reporting a speed as a bare number or as a
 * number of meters, when the unit carries half the meaning; and (c) settling a
 * "who is faster" question from the distances alone or the times alone instead
 * of dividing.
 *
 * SCOPE GUARD: this plan decides whether an object is moving by comparing its
 * position to a chosen reference point, then computes and compares average
 * speeds with speed = distance ÷ time using small whole numbers. Its scope
 * cell's standards clause, verbatim: "DCI PS2.A -- its text requires positions
 * and motions be described in a chosen reference frame; no MS PE names
 * descriptive motion, and this row is the prerequisite for MS-PS2-2's 'change
 * in motion'." The cell carries no lineage clause and no withheld clause,
 * because nothing below Grade 8 in this catalog teaches descriptive motion, so
 * the boundaries below are derived from the neighboring rows and the
 * curriculum's "Explicitly excluded" list instead:
 *   - GRADE 8 NEIGHBORS. Row 1.2 (reading distance-time graphs) owns every
 *     graph: no authored string in this file draws, names or describes a
 *     graph, an axis, a flat stretch of a graph or a steeper stretch --
 *     outside this comment the word "graph" occurs exactly once in the file,
 *     inside the followUps lesson id that points at row 1.2 -- and every trip
 *     here is given as one total distance with one total time. Row 1.3
 *     (velocity and acceleration) owns direction-carrying velocity and every
 *     change of motion: the words
 *     "velocity", "accelerate" and "acceleration" do not appear anywhere in
 *     this file, no item asks about a change of motion, and "average speed" is
 *     defined as the one steady speed that would cover the same distance in
 *     the same time -- never as a rate that is itself changing. Where a trip
 *     obviously contained a change of pace (the van that waits at a light in
 *     the misconception check), it is there only to show what an average does
 *     NOT report, and no name is put to the change. Row 1.4 (forces and net
 *     force) owns forces: no force is named, nothing is described as acting on
 *     anything, the word "newton" never appears, and nothing here explains WHY
 *     anything moves -- "the bus pulls away from the stop" is the everyday
 *     verb for a bus departing, with no force attached to it. Row 2.1
 *     (Newton's first law) is the lesson after that, and inertia is not
 *     mentioned.
 *   - GRADE 8 MATH boundary. The curriculum routes "slope as a unit rate" and
 *     the equation of a line to `m8math` rows 3.1 and 3.3. This file never says
 *     "slope", never writes an equation of a line, and never plots a point.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: the classic reference-point
 *     example of standing still on a spinning, orbiting Earth is deliberately
 *     NOT used, because orbits, planets and the solar system are Grade 6's
 *     `m6sci-u1-gravity-and-orbital-motion.ts`. No planet, moon, orbit, tide,
 *     plate or weather system appears anywhere in this file; every reference
 *     point in it is an everyday object a student could stand next to -- a
 *     seat, a curb, a stop sign, a station platform, a moving walkway, a
 *     suitcase, a floor, a gate sign, the bus in the next lane.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The jogger and the runners are objects with a
 *     distance and a time, and nothing is said about a body, an organism or
 *     energy.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): the formulas this file stops short of are
 *     a = Δv/t and every vector treatment of motion, which belong to
 *     `ap-physics-newtons-second-deep.ts` and `ap-physics-c-mech-calculus.ts`.
 *     Speed here is a size with no direction attached, no motion is broken into
 *     components, no instantaneous speed is defined as a limit, and the only
 *     two formulas used are speed = distance ÷ time and the same relationship
 *     turned around as distance = speed × time, which appears only inside the
 *     verification steps and the recap line that names it. Every distance and
 *     time stated anywhere in the file is a small whole number of meters or
 *     seconds; the only three numbers that are not whole are ones the file is
 *     examining rather than teaching -- 0.125 from the deliberately inverted
 *     division in the first worked example, 2.5 as the ratio of two times in
 *     the second, and 0.2 inside the distractor that names the inverted
 *     division as an error.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every trip in
 * this file is written out in words inside the item, with its total distance
 * and its total time stated, and every item is solvable from the text printed
 * inside it. Never write "look at the distance-time graph", and never assume
 * the student has a stopwatch, a tape measure or a moving object in front of
 * them.
 *
 * NOTE ON prerequisites/followUps: this is row 1.1, the first row of the
 * course, so `prerequisites` is empty and `followUps` names row 1.2,
 * `m8sci.reading-distance-time-graphs`.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U1_MOTION_REFERENCE_POINTS_AND_SPEED: LessonPlan = {
  id: 'evelyn.ms.m8sci.motion-reference-points-and-speed.v1',
  title: 'Motion, Reference Points & Speed',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.motion-reference-points-and-speed',
      standard: 'M8SCI-1.1',
      description:
        'Decide whether an object is moving by comparing its position to a chosen reference point (a passenger is still relative to the bus, moving relative to the road), then compute and compare average speeds with speed = distance ÷ time using small whole numbers (60 meters in 20 seconds gives 3 meters per second) (NGSS DCI PS2.A).',
    },
  ],
  prerequisites: [],
  followUps: ['m8sci.reading-distance-time-graphs'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use the next-bus illusion to make the student feel that "moving" is a comparison before the word reference point is ever said, then promise the second half: putting a number on how fast.',
      script:
        'You are sitting on a bus at a stop, looking at your phone. Out of the corner of your eye the bus in the next lane slides forward, and for a second you are certain your own bus is rolling backward. Then you look down at the curb, and the curb is exactly where it was. Your bus never moved. The other one did. Nothing was wrong with your eyes. The window was full of the other bus, so the only thing you had to compare yourself with was that bus -- and compared with that bus, you really were moving. Compared with the curb, you were not. Both of those are true at the same moment, about the same you, and neither one is a mistake. Today you will find out why that is not a contradiction, and you will get a rule that makes the question answerable every time. Then comes the second half of the job: once something really is moving, put a number on how fast it is going, using nothing but a distance and a time.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reference-point-and-speed-routine',
      kind: 'concept',
      goal: 'Install the reference point as the thing that makes a motion question answerable, then the average-speed division with its unit, and finish with the ordered routine the rest of the lesson runs.',
      keyIdeas: [
        'MOTION IS ALWAYS A COMPARISON, AND THE THING YOU COMPARE WITH IS THE REFERENCE POINT. An object is in MOTION when its position -- how far it is from a chosen object, and in which direction -- changes as time passes. It is AT REST when that position stays the same. The chosen object is called the reference point, and you get to choose it: a seat, a curb, a stop sign, a doorway, a friend standing on the sidewalk. Take a passenger sitting on a bus that is driving down a road. Compared with his seat, he stays exactly where he is: same distance from the back of the seat, same distance from the armrest, second after second. Compared with a stop sign back on the sidewalk, he is farther away every second. Nothing about the passenger is different in those two sentences. What changed is what he was compared with.',
        'THE SAME OBJECT CAN BE AT REST AND IN MOTION AT THE SAME MOMENT, AND THAT IS NOT A TRICK. The passenger is at rest compared with his seat and in motion compared with the stop sign, and both statements are true at once. They do not fight each other, because each one names a different reference point. This is why a motion question is not finished until the reference point is said out loud. WRONG: "Is the passenger moving? Yes." CORRECT: "The passenger is at rest compared with his seat, and moving compared with the stop sign." A question that gives you no reference point and expects one answer is a question you cannot answer, and saying so is the right move.',
        'SPEED PUTS A NUMBER ON HOW QUICKLY THE POSITION CHANGES. Average speed equals the total distance divided by the total time (speed = distance ÷ time). Both measurements come from the same trip, measured from the same reference point, and both go into the answer. The unit is built out of the two measurements you divided: meters divided by seconds gives METERS PER SECOND (m/s), and that unit is a sentence in itself -- it says how many meters the object covers during each second of the trip. A speed of 3 meters per second means 3 meters of ground in the first second, 3 more in the next, and so on. Drop the unit and the number stops meaning anything: "3" could be 3 meters, 3 seconds or 3 meters per second, and those are three different facts.',
        'AN AVERAGE IS A WHOLE-TRIP NUMBER, NOT A REPORT ON ANY ONE MOMENT. Average speed is built from just two measurements -- the total distance and the total time -- and it throws away everything that happened in between. The best way to say what it means is this: it is the one steady speed that would have covered the same distance in the same time. A trip that included a wait at a red light and a fast stretch afterwards has exactly the same average speed as a smooth trip with the same total distance and the same total time. So the average tells you about the trip as a whole, and it does not tell you what was happening at any single second of it.',
        'THE ROUTINE, IN ORDER. (1) Name the reference point, because without one there is no question. (2) Compare the object\'s position with that reference point at the start and at the end: if the distance or direction from it changed, the object was in motion; if not, it was at rest. (3) If a speed is wanted, collect the total distance and the total time, in units that match -- one minute is 60 seconds, so a trip timed at 2 minutes is a trip of 120 seconds. (4) Divide the distance by the time. (5) Say the answer with its unit, in words: so many meters per second. (6) Check it by turning the formula around -- distance = speed × time -- and confirming that the speed multiplied by the time gives back the distance you were told. To compare two objects, run steps 3 to 6 separately for each one, using that object\'s own two numbers, and then compare the two speeds. Never compare the distances on their own, and never compare the times on their own.',
      ],
      vocabulary: [
        { term: 'reference point', definition: 'the object you choose to compare something with when you decide whether it is moving; the comparison is meaningless until this is named.' },
        { term: 'position', definition: 'where an object is, given as its distance and direction from a chosen reference point.' },
        { term: 'motion', definition: 'a change in an object\'s position compared with a chosen reference point as time passes; an object whose position does not change is at rest with respect to that point.' },
        { term: 'distance', definition: 'how much ground an object covered, measured in meters.' },
        { term: 'average speed', definition: 'the total distance of a trip divided by the total time it took; the one steady speed that would have covered that distance in that time.' },
        { term: 'meters per second', definition: 'the unit that comes from dividing a distance in meters by a time in seconds, saying how many meters are covered during each second.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bus-passenger-and-its-speed',
      kind: 'worked_example',
      problem:
        'A bus pulls away from a stop and drives along a straight road. A passenger sits still in his seat with his phone in his lap the whole way. After 30 seconds the bus is 240 meters down the road from the stop sign it started level with. First: is the passenger moving? Answer for two reference points -- the seat he is sitting on, and the stop sign back on the sidewalk. Then find the bus\'s average speed over those 30 seconds.',
      steps: [
        'Step 1, name the reference point, because the motion question is not answerable without one. Two are offered here, the seat and the stop sign, so take them one at a time and answer twice.',
        'Step 2, compare the position at the start with the position at the end, using the seat. He sat down on that seat, and 30 seconds later he is on the same seat, the same distance from its back and the same distance from its armrest. His position with respect to the seat did not change. With respect to the seat, he is at rest.',
        'Step 3, run the identical comparison against the stop sign. At the start he was level with the stop sign, so the distance between him and the sign was zero. After 30 seconds that distance is 240 meters, and it grew a little more with every second in between. His position with respect to the stop sign changed. With respect to the stop sign, he is in motion. Both answers stand, and neither one cancels the other, because each one names the point it was measured from.',
        'Step 4, now the speed. Average speed is the total distance divided by the total time: speed = distance ÷ time. Measured from the stop sign, the distance is 240 meters and the time is 30 seconds, so the average speed is 240 meters divided by 30 seconds, which is 8 meters per second. Say the unit, because it carries half the meaning: 8 meters per second means the bus gets 8 meters farther from that stop sign during each second of the ride. WRONG: "The answer is 8 meters." CORRECT: "The answer is 8 meters per second, and over 30 seconds of that the bus covered 240 meters."',
        'Now run the two checks a science answer needs. First, three clues of DIFFERENT KINDS that agree. One, the arithmetic itself: 240 meters divided by 30 seconds gives 8 meters per second. Two, the formula turned around: distance = speed × time, and 8 meters per second × 30 seconds = 240 meters, which is exactly the distance the problem gave, so the division was done the right way up. Three, a size check against something you already know: a person walking covers a couple of meters in a second at most, so a bus on an open road ought to come out several times a walking pace, and 8 meters per second does. Had the division been done upside down, dividing the 30 seconds by the 240 meters, the number would have been 0.125 rather than 8, and a bus creeping along at 0.125 meters per second would be far slower than a person on foot. The size check catches that on its own, without redoing the division.',
        'Second, change one thing about the setup and confirm that the answer moves the way it should. Change the reference point from the stop sign to the seat, and the answer to "is he moving" flips from yes to no, while absolutely nothing about the passenger changed -- which is the sign that this answer belongs to the PAIR of objects and not to the passenger by himself. Now leave the reference point alone and change the time instead: if the same 240 meters had taken 60 seconds, the average speed would be 240 meters divided by 60 seconds, which is 4 meters per second, half of what it was. Both times, the answer moved when the evidence moved.',
      ],
      answer:
        'With respect to his seat the passenger is at rest, because his position on the seat does not change. With respect to the stop sign he is in motion, because his distance from it grows to 240 meters. Both are true, and each one names its reference point. The bus\'s average speed over the 30 seconds is 240 meters divided by 30 seconds, which is 8 meters per second.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-comparing-two-average-speeds',
      kind: 'worked_example',
      problem:
        'On the same flat, straight path, a skateboarder rolls 60 meters in 20 seconds, and a jogger runs 100 meters in 50 seconds. The jogger covered the greater distance. The skateboarder was finished in the shorter time. Which one had the greater average speed?',
      steps: [
        'Step 1, notice why neither measurement settles this on its own. The jogger covered more ground, which sounds like the faster one. The skateboarder used less time, which also sounds like the faster one. Distance alone and time alone point at different people, so neither of them is the answer. Average speed is the one number with BOTH measurements inside it, and that is the whole reason for working it out.',
        'Step 2, divide for the skateboarder, using the skateboarder\'s own two numbers. Speed = distance ÷ time, so 60 meters divided by 20 seconds gives 3 meters per second.',
        'Step 3, divide for the jogger, using the jogger\'s own two numbers and never mixing them with the skateboarder\'s. 100 meters divided by 50 seconds gives 2 meters per second.',
        'Step 4, compare the two speeds, which is now a comparison of two numbers with the same unit. 3 meters per second is greater than 2 meters per second, so the skateboarder had the greater average speed even though the jogger covered the greater distance. WRONG: "The jogger went 100 meters and the skateboarder went only 60 meters, so the jogger was faster." CORRECT: "The jogger covered more ground but spent two and a half times as long doing it, because 50 seconds divided by 20 seconds is 2.5; per second of travel, the skateboarder covered more."',
        'Now the two checks. Three clues of DIFFERENT KINDS that agree. One, the two divisions: 3 meters per second against 2 meters per second. Two, a like-for-like comparison over equal time, which asks the question a different way instead of repeating the division: in 20 seconds the skateboarder covers 60 meters, and the jogger at 2 meters per second covers 2 meters per second × 20 seconds = 40 meters in that same 20 seconds, so over equal time the skateboarder is ahead by 20 meters. Three, the formula turned around on each one: 3 meters per second × 20 seconds = 60 meters, and 2 meters per second × 50 seconds = 100 meters, and both of those are the distances the problem gave.',
        'And now change one thing. Leave the jogger\'s 100 meters exactly as it is, and let her cover it in 25 seconds instead of 50. Her average speed becomes 100 meters divided by 25 seconds, which is 4 meters per second, and the jogger is now the faster of the two, at 4 meters per second against 3 meters per second. Not one distance changed; a single time did, and the verdict flipped. That is how you know the verdict was really resting on both measurements, and was not quietly resting on the distances alone.',
      ],
      answer:
        'The skateboarder. 60 meters divided by 20 seconds gives 3 meters per second, and 100 meters divided by 50 seconds gives 2 meters per second, so the skateboarder covers more ground during each second of travel even though the jogger covered the greater total distance. Over the same 20 seconds, the jogger would cover only 40 meters.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-backpack-on-the-train',
      kind: 'try_yourself',
      problem:
        'You are riding on a train that is running smoothly along a straight track. A backpack sits on the seat beside you and stays exactly where you put it. Through the window you watch a station platform slide past. A friend asks whether the backpack is moving. Which statement answers the question correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The backpack is not moving, because it stays put on the seat for the whole ride, and whether an object is moving is a fact about that object on its own rather than something that depends on what you compare it with.' },
        { id: 'b', text: 'The backpack is moving, because everything inside a moving train is moving too, and an object cannot be at rest and in motion at the same moment, so the platform outside is the only comparison that is allowed to count.' },
        { id: 'c', text: 'The backpack is not moving compared with you and the seat, because its distance from you does not change, and it is moving compared with the platform, because its distance from the platform changes as the train travels.', correct: true },
        { id: 'd', text: 'The backpack is moving compared with you and not moving compared with the platform, because the platform is the thing you can see sliding past the window while the backpack and the seat stay together in one place.' },
      ],
      expectedAnswer: 'The backpack is not moving compared with you and the seat, because its distance from you does not change, and it is moving compared with the platform, because its distance from the platform changes as the train travels.',
      hints: [
        'A motion question is not finished until you have named the object you are comparing the backpack with. Take the seat first and ask whether the distance between the backpack and the seat changes. Then take the platform and ask exactly the same question about that distance.',
        'Two opposite answers can both be true at the same moment, as long as each one says which reference point it used. Find the statement that names a reference point for each answer and gets the direction of both comparisons the right way round.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cyclist-average-speed',
      kind: 'try_yourself',
      problem:
        'A cyclist rides along a straight path and covers 150 meters in 30 seconds. Which statement gives her average speed for that ride, worked out correctly and stated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Her average speed is 0.2 meters per second, worked out by dividing the 30 seconds by the 150 meters, because a speed compares the two measurements and either order of that division compares them.' },
        { id: 'b', text: 'Her average speed is 120 meters per second, worked out by taking the 30 seconds away from the 150 meters, because the speed is the part of the distance that is left once the time has been accounted for.' },
        { id: 'c', text: 'Her average speed is 5 meters, worked out by dividing the 150 meters by the 30 seconds, because the ride was measured out in meters and so the answer to a question about that ride is a number of meters.' },
        { id: 'd', text: 'Her average speed is 5 meters per second, worked out by dividing the 150 meters by the 30 seconds, because that is how many meters of the path she covers during each second of the ride.', correct: true },
      ],
      expectedAnswer: 'Her average speed is 5 meters per second, worked out by dividing the 150 meters by the 30 seconds, because that is how many meters of the path she covers during each second of the ride.',
      hints: [
        'Average speed is the distance divided by the time it took, and the order matters: the meters are what gets divided, and the seconds are what you divide by. Do that division first and see what number comes out.',
        'Then check the unit before you settle on an answer. You divided a number of meters by a number of seconds, so the answer says how many meters go with each single second. Multiply your number by the 30 seconds and see whether the 150 meters comes back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-runner-is-faster',
      kind: 'try_yourself',
      problem:
        'Two runners each finish one straight practice run. Runner A covers 300 meters in 60 seconds. Runner B covers 270 meters in 45 seconds. Which statement names the runner with the greater average speed and gives the correct reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Runner B, whose average speed is 6 meters per second against Runner A\'s 5 meters per second, because each runner\'s own distance has to be divided by that runner\'s own time before the two can be compared.', correct: true },
        { id: 'b', text: 'Runner A, because Runner A covers 300 meters while Runner B covers only 270 meters, and the runner who puts the greater distance behind them in a single run is the faster of the two.' },
        { id: 'c', text: 'Runner B, because Runner B is finished in 45 seconds while Runner A takes 60 seconds, and whichever runner is done in the smaller number of seconds always has the greater average speed.' },
        { id: 'd', text: 'Neither one, because Runner A covers 30 meters more and also takes 15 seconds longer, so the extra distance and the extra time make up for one another and the two average speeds come out the same.' },
      ],
      expectedAnswer: 'Runner B, whose average speed is 6 meters per second against Runner A\'s 5 meters per second, because each runner\'s own distance has to be divided by that runner\'s own time before the two can be compared.',
      hints: [
        'Neither the distances nor the times can settle this on their own, because Runner B covers less ground and also spends less time doing it. Work out one number for each runner that already has both measurements inside it.',
        'Divide each runner\'s distance by that runner\'s own time, then compare the two answers -- and then check that the reason the statement gives is the same reason your own two divisions give.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-motion-is-absolute-and-average-is-constant',
      kind: 'misconception_check',
      question:
        'A student writes: "When I stand still on a moving walkway at the airport, I am not moving, because I am not walking. And the delivery van averaged 10 meters per second on its trip, so it was going 10 meters per second the whole way." Two different things have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'Standing still on a moving walkway, I am not moving, because I am not walking.',
          misconception:
            'Treating motion as something an object does by itself, so that the only motion which counts is the motion you make with your own legs and no reference point ever has to be named.',
          correctsTo:
            'Motion is a comparison, and the sentence is only half finished until it says what the comparison is with. Compared with the surface of the walkway under your shoes, and with a suitcase riding along beside you, you are at rest: your distance from both of them stays the same second after second. Compared with the floor beside the walkway, or with a gate sign on the wall, you are in motion, because your distance from those is changing every second. Both statements are true at the same moment and they do not fight each other, because each one names the reference point it was measured from. WRONG: "I am not moving." CORRECT: "I am at rest compared with the walkway, and in motion compared with the floor beside it."',
        },
        {
          answer: 'The van averaged 10 meters per second, so it was going 10 meters per second the whole way.',
          misconception:
            'Reading an average as a report on every moment of the trip, because the average is the only number given and it is easy to spread it back evenly over the whole journey.',
          correctsTo:
            'An average speed is built from exactly two measurements, the total distance and the total time, and it throws away everything that happened in between. Suppose the van covered 600 meters in 60 seconds: its average speed is 600 meters divided by 60 seconds, which is 10 meters per second. That same average fits a van that rolled steadily for the whole minute, and it fits a van that waited at a red light for 20 seconds and then covered all 600 meters in the remaining 40 seconds, which works out at 600 meters divided by 40 seconds, or 15 meters per second while it was actually moving. An average speed is the one steady speed that would have covered the same distance in the same time. WRONG: "The average was 10 meters per second, so it was doing 10 meters per second at every moment." CORRECT: "The average over the whole trip was 10 meters per second, and what the van was doing at any one second is not something an average can tell you."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An object is in motion when its position changes compared with a chosen reference point, and it is at rest when that position stays the same.',
        'Every statement about motion has to name its reference point. "The passenger is moving" is not finished; "the passenger is moving compared with the stop sign" is.',
        'The same object can be at rest compared with one reference point and in motion compared with another at the same moment, and both statements are true.',
        'Average speed is the total distance divided by the total time: speed = distance ÷ time.',
        'The unit comes from the two measurements you divided. Meters divided by seconds gives meters per second, which says how many meters are covered during each second. A speed reported as a number of meters is not a speed.',
        'Check a speed by turning the formula around: distance = speed × time. The speed multiplied by the time should give back the distance you were told.',
        'To decide which of two objects is faster, divide each one\'s own distance by its own time and compare the two speeds. The greater distance does not settle it, and neither does the smaller time.',
        'An average speed is the one steady speed that would have covered the same distance in the same time. It does not report what was happening at any single moment of the trip.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Motion, Reference Points & Speed' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
