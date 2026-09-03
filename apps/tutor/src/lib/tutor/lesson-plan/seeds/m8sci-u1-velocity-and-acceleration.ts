/**
 * Grade 8 Science (Physical Science) — Velocity & Acceleration.
 *
 * CONCEPT-LED row (NGSS DCI PS2.A). The student arrives with one word for
 * motion -- speed -- and one meaning for a second word, acceleration, which
 * everyday English has already defined for them as "press the gas and gain
 * speed". Both have to be rebuilt. The lesson installs velocity as a
 * two-part quantity (a number with a unit, AND a direction), and then gets
 * acceleration for free: because a velocity has two parts, there are three
 * ways to change one, and all three are acceleration.
 *
 * The three traps it is built to kill are (a) velocity-is-just-speed, which
 * makes the direction invisible; (b) deceleration-is-the-opposite-of-
 * acceleration, imported straight from the everyday word; and (c)
 * turning-at-a-steady-speed-is-not-accelerating, which is the one nearly
 * everybody misses because the number on the dial genuinely does not move.
 * Trap (c) is the reason the file keeps returning to an independent, purely
 * observational clue -- loose objects slide across a seat or a floor during
 * exactly the stages where the velocity is changing, and lie still during the
 * stages where it is not -- so that the verdict never rests on the definition
 * alone.
 *
 * SCOPE GUARD: this plan distinguishes speed from velocity (a speed together
 * with a direction) and identifies acceleration as ANY change in velocity --
 * speeding up, slowing down, or turning -- from a situation described in
 * words, including the case the curriculum names outright, a car rounding a
 * bend at a steady speed, which IS accelerating. Its scope cell's withheld
 * clause, verbatim: "Withholds a = Delta-v/t and every vector treatment,
 * which are AP Physics (`ap-physics-newtons-second-deep.ts`)." The cell
 * carries no lineage clause, so there is none to record. What the boundary
 * means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 1.1 (reference points and speed = distance
 *     divided by time) is ASSUMED, not re-taught: the concept segment states
 *     the relationship once in words with its symbols beside it, and every
 *     division performed anywhere in this file (50 meters in 10 seconds in
 *     the concept segment, 120 meters in 40 seconds and 90 meters in 30
 *     seconds in the first worked example, 240 meters in 60 seconds in the
 *     first item) exists only to establish a speed before directions are
 *     compared. Row 1.2 (distance-time records) is not entered: no graph and
 *     no distance-time record is described anywhere, no part of a journey is
 *     called steep, and slope is never named as a way to read a motion --
 *     the word "slope" appears in this file only in the clause you are
 *     reading, and the word "flat" appears only as a description of level
 *     ground (a flat road, a flat sidewalk, a flat parking lot). Row 1.4
 *     (forces and net force) is the NEXT lesson and is not borrowed from: no
 *     force is named, nothing is measured in newtons, no push or pull is
 *     offered as the reason any velocity changes, and the file never says WHY
 *     a velocity changes -- only that it did. The string "force" occurs in
 *     this file only inside the `followUps` loId, which is machine text no
 *     student hears. Row 2.2 owns F = m times a;
 *     this file never writes it and never computes a force, a mass, or an
 *     acceleration as a quantity.
 *   - NO ACCELERATION IS EVER COMPUTED. Acceleration appears here only as a
 *     verdict -- accelerating or not, and which of the three kinds -- never
 *     as a number. No item asks how much an object accelerated, no time is
 *     divided into a change of speed, and the unit "meters per second each
 *     second" does not appear, because a rate of change of velocity is row
 *     2.2's quantity and `ap-physics-newtons-second-deep.ts`'s formula.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, plate,
 *     current or weather system appears anywhere in this file, and gravity is
 *     never named. Nothing falls in any example; every moving object is on a
 *     road, a path, a track or in level flight.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. People run and ride in the examples, but
 *     only as objects whose motion is described.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): every velocity in this file is written as a
 *     number with a unit plus a named compass or road direction, never as a
 *     vector, an arrow, a component, or a signed quantity. The formula this
 *     row stops short of is a = Delta-v/t -- the rate form of acceleration --
 *     together with vector addition of velocities and any two-dimensional
 *     treatment of a turn, all of which belong to
 *     `ap-physics-newtons-second-deep.ts`. A turn is described only as the
 *     direction changing from one named heading to another, and no
 *     centripetal quantity is named anywhere.
 *   - HS CHEMISTRY boundary: this row has no chemistry surface at all, and no
 *     substance, particle, atom or reaction appears in the file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every motion
 * in this file is written out in words with its direction stated in full
 * ("due north", "along the same straight street", "around the curved end of
 * the track"), and every item is solvable from the text printed inside it.
 * Never write "look at the motion diagram", and never assume the student has
 * a car, a track, a stopwatch or a speedometer in front of them.
 *
 * NOTE ON LABELS: every wrong-versus-right specimen in this file uses the
 * bare `WRONG:` / `CORRECT:` form, because in every case the wrong version is
 * a genuinely false statement about motion rather than a defensible statement
 * that misses an effect. No variant label is used here.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U1_VELOCITY_AND_ACCELERATION: LessonPlan = {
  id: 'evelyn.ms.m8sci.velocity-and-acceleration.v1',
  title: 'Velocity & Acceleration',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.velocity-and-acceleration',
      standard: 'M8SCI-1.3',
      description:
        'Distinguish speed from velocity (speed plus a direction) and identify acceleration as ANY change in velocity -- speeding up, slowing down, or turning -- from a situation (a car rounding a bend at steady speed IS accelerating) (NGSS DCI PS2.A).',
    },
  ],
  prerequisites: ['m8sci.reading-distance-time-graphs'],
  followUps: ['m8sci.forces-and-net-force'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two rides with the same number on the dial side by side -- the straight road and the curving ramp -- so the student can feel that the number is not the whole story before the word velocity arrives.',
      script:
        'You are in the back seat of a car on a long highway on-ramp, the kind that curves around in a wide arc before it joins the road. The driver holds the car at 30 miles per hour, and the needle on the speedometer does not move the entire way around. Nothing about that number changes. And yet you lean toward the outside of the curve, and the phone lying next to you slides across the seat until it hits the door. Now the same car, the same 30 miles per hour, on a straight flat road. Nobody leans. The phone stays exactly where you put it. Same car, same number on the dial, two completely different rides. So the number on the dial cannot be the whole story of how you are moving. Something else about your motion was changing on that ramp, and the speedometer was never going to show it. By the end of today you will have a name for the thing the dial leaves out, and you will be able to look at any described journey and say whether the motion is changing -- even when the number is holding perfectly still.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-velocity-and-the-three-changes',
      kind: 'concept',
      goal: 'Split speed from velocity, build velocity as a two-part quantity, then derive the three kinds of acceleration from those two parts and kill the everyday meaning of the word.',
      keyIdeas: [
        'SPEED ANSWERS ONE QUESTION: HOW FAST? A speed tells you how much distance an object covers in each unit of time, and nothing more. You already know how to find one: speed equals distance divided by time (speed = distance ÷ time). A runner who covers 50 meters in 10 seconds has a speed of 5 meters per second, because 50 divided by 10 is 5. Now notice everything that number does not tell you. It does not say whether she is running toward the gate or away from it, north or south, up the hill or down. Two runners can both be moving at 5 meters per second and be heading in completely opposite directions. A speed is a number with a unit -- meters per second in science, or miles per hour on a car dial -- and a number with a unit cannot point anywhere.',
        'VELOCITY IS A SPEED TOGETHER WITH A DIRECTION. Velocity answers two questions at once: how fast, and which way. "Five meters per second" is a speed. "Five meters per second toward the north end of the field" is a velocity. Because a velocity is built out of two parts, there are two separate ways to make it different. Change the number and the velocity is different. Change the direction and the velocity is different, even if the number never moves at all. A velocity stays the same only when BOTH parts stay the same. WRONG: "Velocity is just a longer word for speed." CORRECT: "Velocity is a speed with a direction attached, so two objects can share a speed and still have different velocities."',
        'ACCELERATION IS ANY CHANGE IN VELOCITY, AND THERE ARE THREE WAYS TO GET ONE. An object is accelerating whenever its velocity is changing. Because a velocity has two parts, that gives exactly three kinds of change, and every one of them counts. (1) SPEEDING UP: the number rises while the direction holds. (2) SLOWING DOWN: the number falls while the direction holds. (3) TURNING: the direction changes, whether the number moves or not. Any one of the three on its own is acceleration. The flip side matters just as much: an object whose number and direction both hold steady is not accelerating at all, no matter how fast it happens to be going. A jet flying level in a straight line at a steady 200 meters per second is not accelerating. A bicycle creeping around a corner at 2 meters per second is.',
        'SLOWING DOWN IS ACCELERATION, EVEN THOUGH THE EVERYDAY WORD SAYS OTHERWISE. Outside science, "accelerate" means one thing only: press the gas and gain speed. That everyday meaning is the biggest source of trouble in this lesson, because it makes slowing down sound like the opposite of accelerating instead of one of its kinds. Science uses the wider meaning, and it has to, because there is nothing special about a number going up rather than down -- either way the velocity is different from what it was. "Deceleration" is a handy everyday name for the slowing-down kind, and it is a kind of acceleration, not its opposite. WRONG: "The elevator was decelerating as it came up to my floor, so it was not accelerating." CORRECT: "The elevator was slowing, so its velocity was changing, so it was accelerating -- and slowing down is the kind of acceleration people call deceleration." The true opposite of accelerating is constant velocity: a steady number and a steady direction, both at once.',
        'TURNING AT A STEADY SPEED IS ACCELERATION, AND THIS IS THE ONE PEOPLE MISS. Picture a car driving all the way around a bend with the speedometer needle parked on one number the whole way. The number never moves, so it is tempting to say that nothing about its motion changed. But the car was heading east when it entered the bend and heading north when it left, and the direction is half of a velocity. The velocity it has at the end of the bend is not the velocity it had at the start, so the car was accelerating the entire way around, at a steady speed. There is a way to check this that uses no science at all: watch what loose things do. On a straight road at a steady speed, a bag on the back seat sits still. On the bend at that same steady speed, it slides across the seat -- which is also what it does when the driver brakes hard, and what it never does while the car is holding a steady speed on a straight road. The stages where loose things move are the stages where the velocity is changing.',
        'HOW TO ANSWER ANY QUESTION IN THIS LESSON. First, write down the speed at the start and the speed at the end, each with its unit. Second, write down the direction at the start and the direction at the end. Third, compare the two pairs. If the number changed, or the direction changed, or both did, then the velocity changed and the object is accelerating -- and you can say which of the three kinds it is. If neither changed, the velocity is constant and the object is not accelerating. Two warnings while you run it. Moving is not the same as accelerating: an object can travel for hours at a constant velocity and never accelerate once. And an object sitting at rest is not a trick case either -- its velocity is not changing, so it is not accelerating.',
      ],
      vocabulary: [
        { term: 'speed', definition: 'how much distance an object covers in each unit of time, found by dividing the distance by the time and written with a unit such as meters per second.' },
        { term: 'velocity', definition: 'an object\'s speed together with the direction it is traveling in, such as 3 meters per second due north.' },
        { term: 'acceleration', definition: 'any change in an object\'s velocity: speeding up, slowing down, or changing direction.' },
        { term: 'constant velocity', definition: 'motion in which the speed and the direction both stay the same, so the velocity does not change and the object is not accelerating.' },
        { term: 'deceleration', definition: 'the everyday name for the kind of acceleration in which an object\'s speed is falling; it is one kind of acceleration, not the opposite of it.' },
        { term: 'meters per second', definition: 'the unit a speed is usually given in for science; it says how many meters the object covers in each second.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-joggers-and-a-turn',
      kind: 'worked_example',
      problem:
        'Two friends set out from the same corner of a park at the same moment. Ana runs 120 meters along a straight path heading due north, and it takes her 40 seconds. Ben runs 90 meters along a straight path heading due east, and it takes him 30 seconds. Each runs at a steady rate the whole way. Do the two of them have the same speed? Do they have the same velocity? Then Ana reaches the fence at the north end, turns onto a path heading due east, and keeps running at exactly the rate she had before. Is she accelerating while she turns?',
      steps: [
        'Find Ana\'s speed. Speed equals distance divided by time (speed = distance ÷ time), so 120 meters divided by 40 seconds is 3 meters per second. Carry the unit with the number: the answer is 3 meters per second, not 3.',
        'Find Ben\'s speed the same way. 90 meters divided by 30 seconds is 3 meters per second. So the answer to the first question is yes -- the two runners have exactly the same speed, even though neither the distance nor the time matched.',
        'Now the second question, which needs the other half. Ana\'s velocity is 3 meters per second due north. Ben\'s velocity is 3 meters per second due east. A velocity is a speed together with a direction, and a velocity stays the same only when both parts match. The numbers match and the directions do not, so their velocities are different. WRONG: "They cover ground at the same rate, so they have the same velocity." CORRECT: "They have the same speed, and different velocities, because they are heading different ways."',
        'Now the turn. Run the routine on Ana across the moment she turns. Her speed at the start of the turn is 3 meters per second and her speed at the end of the turn is 3 meters per second, so the number did not change. Her direction at the start is due north and at the end is due east, so the direction did change. One part changed, and one part is enough: her velocity changed, so Ana IS accelerating while she turns, at a steady 3 meters per second.',
        'Run the check for clues of DIFFERENT KINDS that agree, because there is no arithmetic left to redo here. The first clue is the definition inventory: the number held and the direction moved, and a velocity needs both to hold. The second clue is where she actually ends up, which is a fact about the world rather than about a definition -- ten seconds after the turn she is 30 meters east of the fence, because 3 meters per second times 10 seconds is 30 meters, whereas without the turn those same ten seconds would have put her 30 meters further north. Her motion produced a different result, so her motion was not the same motion. The third clue is an observation anyone can make without knowing any of this: a water bottle lying loose in the open bag on her back rolls to one side of the bag while she is going around the turn, and lies still while she runs straight. Three different kinds of evidence, one answer.',
        'Now change exactly one condition and check that the answer moves with it. First, suppose the north path simply carried on and Ana ran straight past the fence at 3 meters per second. Then the number is unchanged and the direction is unchanged, her velocity is constant, and she is NOT accelerating. Second, suppose instead that she keeps heading due north but speeds up from 3 meters per second to 5 meters per second. Now the direction is unchanged and the number is not, and she IS accelerating again -- the speeding-up kind this time. The verdict follows whichever part of the velocity moves, which is exactly what "any change in velocity" means. An explanation that gave the same answer in all three of those setups would not be an explanation at all.',
      ],
      answer:
        'Ana and Ben have the same speed, 3 meters per second each, because 120 meters divided by 40 seconds and 90 meters divided by 30 seconds both come to 3 meters per second. They do not have the same velocity: Ana\'s is 3 meters per second due north and Ben\'s is 3 meters per second due east, and a velocity is a speed together with a direction. Ana IS accelerating while she turns. Her speed holds at 3 meters per second and her direction changes from due north to due east, and a change in either part is a change in velocity, which is what acceleration means.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bus-four-stages',
      kind: 'worked_example',
      problem:
        'A city bus makes one short trip in four stages. Stage 1: it pulls away from a stop and its speed rises steadily from 0 meters per second to 8 meters per second while it heads due east along a straight street. Stage 2: it holds 8 meters per second along that same straight street for the next 20 seconds. Stage 3: it follows a curved ramp onto a road heading due south, and the speedometer holds at 8 meters per second the whole way around the curve. Stage 4: it brakes in a straight line and its speed falls steadily from 8 meters per second to 0 meters per second at the next stop. For each stage, say whether the bus is accelerating, and where it is, say which part of its velocity changed.',
      steps: [
        'Stage 1. Speed at the start is 0 meters per second and speed at the end is 8 meters per second, a rise of 8 meters per second, because 8 meters per second minus 0 meters per second leaves 8 meters per second. Direction at the start is due east and at the end is due east, so the direction held. The number changed, so the velocity changed: the bus IS accelerating, and this is the speeding-up kind. Almost nobody argues with this one, which is why it is worth doing first -- it fixes the routine before the routine gets hard.',
        'Stage 2. Speed at the start is 8 meters per second and at the end is 8 meters per second, so the number held. Direction at the start is due east and at the end is due east, so the direction held. Both parts held, so the velocity is constant and the bus is NOT accelerating. This is the only one of the four stages where nothing about the velocity changes, and notice that the bus is moving quickly throughout it. Moving fast and accelerating are not the same thing.',
        'Stage 3, and this is the one that matters most. Speed at the start is 8 meters per second and at the end is 8 meters per second: the number held, and the speedometer needle really did sit still the whole way around. Direction at the start is due east and at the end is due south: the direction changed. One part changed, so the velocity changed, so the bus IS accelerating all the way around the curve -- the turning kind. WRONG: "The speedometer held at 8 meters per second around the whole curve, so stage 3 is not acceleration." CORRECT: "The speedometer only reports the number. The bus went in heading east and came out heading south, and the direction is half of the velocity, so the velocity changed even though the number did not."',
        'Stage 4. Speed at the start is 8 meters per second and at the end is 0 meters per second, a fall of 8 meters per second, because 8 meters per second minus 0 meters per second leaves 8 meters per second again, this time as a drop rather than a rise. Direction at the start is due south and at the end is due south, so the direction held. The number changed, so the velocity changed and the bus IS accelerating -- the slowing-down kind. WRONG: "Stage 4 is deceleration, and deceleration is the opposite of acceleration, so it does not count." CORRECT: "Deceleration is the everyday name for the kind of acceleration in which the speed falls. It is one of the three kinds, not the opposite of the set."',
        'Run the check for clues of DIFFERENT KINDS on stage 3, since that is the stage a reader is most likely to doubt. The first clue is the definition inventory, already done: the direction went from east to south while the number held. The second clue is the record a passenger could keep with nothing but a compass and the dial -- "8 meters per second east" written down at the start of the curve and "8 meters per second south" written down at the end are two different entries, and a quantity with two different values at two different times has changed. The third clue is purely observational and needs no definitions at all: shopping bags standing on the floor of the bus slide across it during stages 1, 3 and 4, and stand still during stage 2. Stage 3 groups itself with the two stages everybody already agrees are acceleration, and separates itself from the one stage that is not. Three clues of different kinds, all pointing the same way.',
        'Now change exactly one condition and check that the answer moves. Suppose the ramp in stage 3 had been straight instead of curved, with the speedometer still holding at 8 meters per second. Then the direction holds as well as the number, stage 3 becomes a second stage 2, the velocity is constant, and the bags on the floor stay put. Change the road and the verdict changes with it, which is what tells you the curve was doing the work -- and not, say, the length of the road or the speed the bus happened to be traveling at.',
      ],
      answer:
        'Stage 1: accelerating, the speeding-up kind -- the number rose from 0 meters per second to 8 meters per second while the direction held due east. Stage 2: not accelerating -- both the number and the direction held, so the velocity is constant. Stage 3: accelerating, the turning kind -- the number held at 8 meters per second but the direction changed from due east to due south, and direction is half of a velocity. Stage 4: accelerating, the slowing-down kind -- the number fell from 8 meters per second to 0 meters per second while the direction held due south, and slowing down is a kind of acceleration rather than its opposite. Three of the four stages are acceleration, and only stage 2 is not.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-drones-speed-versus-velocity',
      kind: 'try_yourself',
      problem:
        'Two delivery drones leave the same rooftop at the same moment. Drone One flies 240 meters due north in 60 seconds. Drone Two flies 240 meters due east in 60 seconds. Each one flies in a straight line at a steady rate the whole way. Which statement about the two drones is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They have the same speed, 4 meters per second each, but different velocities, because a velocity is a speed together with a direction, and one drone is heading due north while the other is heading due east.', correct: true },
        { id: 'b', text: 'They have different speeds, because the direction an object travels in is part of its speed, so a drone heading north and a drone heading east cannot be said to have the same speed even over the same distance.' },
        { id: 'c', text: 'They have the same speed and the same velocity, because both of them cover 240 meters in 60 seconds, and which way an object happens to be heading is not part of how its motion is measured.' },
        { id: 'd', text: 'They have the same velocity but different speeds, because velocity is the word for which way an object is heading, while speed is the word that also takes into account how far the object actually traveled.' },
      ],
      expectedAnswer: 'They have the same speed, 4 meters per second each, but different velocities, because a velocity is a speed together with a direction, and one drone is heading due north while the other is heading due east.',
      hints: [
        'Find each drone\'s speed first, the way you already know how: divide the distance it covered by the time it took. Both drones give the same number, so the speeds cannot be what separates them.',
        'A velocity is built from two parts. The two drones match on one of those parts and differ on the other, so ask what that does to their speeds and what it does to their velocities.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-skateboarder-slowing',
      kind: 'try_yourself',
      problem:
        'A skateboarder is rolling along a flat, straight sidewalk. Over the next few seconds her speed drops steadily from 6 meters per second to 2 meters per second, a fall of 4 meters per second. She travels along the same straight line the whole time and never turns. Is she accelerating?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No. Slowing down has its own name, deceleration, and deceleration is the opposite of acceleration, so an object whose speed is falling is not accelerating at any moment while it slows.' },
        { id: 'b', text: 'Yes. Her velocity is changing, because her speed is falling from 6 meters per second to 2 meters per second, and acceleration is any change in velocity, whether the number rises, the number falls, or the direction turns.', correct: true },
        { id: 'c', text: 'No. She stays on the same straight line the whole time and her direction never changes, and acceleration is what happens when an object turns, so an object traveling straight cannot be accelerating however its speed behaves.' },
        { id: 'd', text: 'Yes. She is accelerating, but only because she is still moving at all, since any object that is moving is accelerating for as long as it keeps changing its position second after second.' },
      ],
      expectedAnswer: 'Yes. Her velocity is changing, because her speed is falling from 6 meters per second to 2 meters per second, and acceleration is any change in velocity, whether the number rises, the number falls, or the direction turns.',
      hints: [
        'Write down her speed at the start and her speed at the end, then her direction at the start and her direction at the end. Did either of the two parts of her velocity change?',
        'The everyday meaning of the word acceleration covers only one of its three kinds. Ask what the science meaning covers, and whether a number that falls counts as a change just as much as a number that rises.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-one-has-constant-velocity',
      kind: 'try_yourself',
      problem:
        'Four moving objects are described in the four choices. Exactly one of them has a constant velocity, meaning its velocity is not changing in any way at all. Which one is it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The electric scooter, which heads due west along a straight, level path the whole way while its speed climbs steadily from 3 meters per second to 7 meters per second, so the direction it is heading in never changes.' },
        { id: 'b', text: 'The runner, who goes around the curved end of a track at a steady 6 meters per second from the moment she enters the curve to the moment she leaves it, so the number describing how fast she is moving never changes.' },
        { id: 'c', text: 'The train, which rolls due north along a straight, level track at a steady 20 meters per second for ten minutes, so the number describing how fast it is moving and the direction it is heading in both stay the same.', correct: true },
        { id: 'd', text: 'The shopping cart, which rolls in a straight line across a flat parking lot while its speed falls steadily from 4 meters per second to 1 meter per second, so it is losing speed rather than gaining any at all.' },
      ],
      expectedAnswer: 'The train, which rolls due north along a straight, level track at a steady 20 meters per second for ten minutes, so the number describing how fast it is moving and the direction it is heading in both stay the same.',
      hints: [
        'Velocity has two parts, so run both checks on each object in turn: does the number change between the start and the end, and does the direction change? A constant velocity needs both answers to be no.',
        'Three of the four have exactly one part changing, and one part is enough to make it acceleration. Watch out for the object whose number holds steady while its path bends, and for the one whose number is falling rather than rising.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-steady-needle-and-deceleration',
      kind: 'misconception_check',
      question:
        'A student writes: "A car going all the way around a roundabout with the speedometer holding at 9 meters per second is not accelerating, because its speed never changes. And when the same car brakes on the way out of the roundabout, it is decelerating, which is the opposite of accelerating." Two different things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'A car going around a roundabout at a steady speed is not accelerating, because its speed never changes.',
          misconception:
            'Treating a velocity as if it were only the number on the speedometer, so that a needle which does not move reads as a motion which is not changing. The everyday experience backs this up, because the dial is the only measurement of motion most people ever watch.',
          correctsTo:
            'A velocity has two parts, the number and the direction, and a velocity stays the same only when both of them stay the same. The car enters the roundabout heading east and leaves it heading north, so its direction changed while the number held, and a change in either part is a change in velocity. That is exactly what acceleration means, so the car was accelerating the whole way around, at a steady 9 meters per second. There is a check that needs no definitions at all. Take the same car at the same steady 9 meters per second along a straight road: a bag on the back seat sits still. Put it on the roundabout at that same steady 9 meters per second and the bag slides across the seat. Change the road and the loose objects change what they do, which is what tells you the velocity was changing on the curve and not on the straight. WRONG: "The number never changed, so nothing about its motion changed." CORRECT: "The number never changed, but the direction did, and the direction is half of the velocity."',
        },
        {
          answer: 'Braking is deceleration, which is the opposite of accelerating.',
          misconception:
            'Importing the everyday meaning of "accelerate" -- press the gas and gain speed -- into the science word, so that losing speed becomes the opposite of acceleration instead of one of its kinds.',
          correctsTo:
            'In science, acceleration is the word for a velocity changing in any way whatever, and there are three ways that can happen: the number rises, the number falls, or the direction turns. Slowing down is the second of those three. It is a kind of acceleration, not the opposite of it, and there is nothing special about a number going up rather than down -- either way the velocity at the end is not the velocity at the start. "Deceleration" is simply a convenient everyday name for the slowing-down kind, and it is fine to use it as long as you remember what it is a name for. The real opposite of accelerating is constant velocity: a steady number and a steady direction, both at the same time. WRONG: "It was decelerating, so it was not accelerating." CORRECT: "It was slowing, so its velocity was changing, so it was accelerating -- the slowing-down kind."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A speed says how fast and nothing else. It is a number with a unit, such as 5 meters per second, and a number with a unit cannot point anywhere.',
        'A velocity is a speed together with a direction: 5 meters per second due north. It stays the same only when BOTH parts stay the same.',
        'Two objects can have the same speed and different velocities, because they are heading different ways.',
        'Acceleration is ANY change in velocity. There are three kinds: speeding up, slowing down, and changing direction.',
        'Slowing down is acceleration. Deceleration is the everyday name for that one kind, not the opposite of the whole idea.',
        'Turning at a steady speed is acceleration. A car going around a bend with the needle parked on one number is accelerating the entire way, because the direction is half of the velocity.',
        'Moving is not the same as accelerating. An object can travel for hours at a constant velocity and never accelerate, and an object at rest is not accelerating either.',
        'To decide any case: write down the speed at the start and at the end, then the direction at the start and at the end. If either pair differs, the velocity changed and the object is accelerating. If neither differs, the velocity is constant.',
        'A check that uses no definitions: a loose object resting on a smooth seat or floor slides across it during the stages where the velocity is changing, and stays put during the stages where it is not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Velocity & Acceleration' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
