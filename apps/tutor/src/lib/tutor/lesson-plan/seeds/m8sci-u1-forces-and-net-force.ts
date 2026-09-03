/**
 * Grade 8 Science (Physical Science) — Forces, Net Force & Balanced Forces.
 *
 * PROCEDURE-LED row 1.4 (NGSS DCI PS2.A). One routine runs the whole lesson:
 * name the ONE object, list every force on it along the line with its size in
 * newtons and its direction, combine them (same direction adds, opposite
 * directions subtract and the leftover keeps the direction of the larger), and
 * read the verdict -- 0 newtons means balanced and the motion does not change,
 * anything else means unbalanced and the motion changes in the direction of
 * the leftover. Every worked example and every item runs those same four
 * moves, and both worked examples end with the two-part verification move
 * (three clues of different kinds agreeing, then one changed condition that
 * moves the answer).
 *
 * The two traps it is built to kill are (a) adding the two sizes and leaving
 * the directions out of it, so that 12 newtons east against 7 newtons west
 * becomes "19 newtons", and (b) reading motion itself as proof of a leftover
 * force, so that a crate moving at a steady speed "must" have unbalanced
 * forces on it.
 *
 * SCOPE GUARD: this plan describes a force as a push or a pull with a size in
 * newtons and a direction, adds two or three forces acting along ONE straight
 * line to find the net force, and classifies the forces on an object as
 * balanced (net force 0 newtons, motion does not change) or unbalanced (net
 * force not zero, motion changes). Its scope cell's withheld clause, verbatim:
 * "(DCI PS2.A, foundational to MS-PS2-2; one-dimensional only -- no free-body
 * diagrams with angled forces, which is `ap-physics-newtons-second-deep.ts`)."
 * The cell carries no lineage clause. What the boundary means at each edge,
 * and what is deliberately ALLOWED there:
 *   - ROW 1.3 (velocity and acceleration) is the previous lesson and is
 *     assumed, not re-taught. The words "velocity" and "acceleration" appear
 *     nowhere in the body -- their only occurrence in the file is inside the
 *     `prerequisites` loId string, which no student ever hears -- and a change
 *     in motion is described in plain words as speeding up, slowing down, or
 *     starting to move. No rate of change is named or computed.
 *   - ROWS 1.1 and 1.2 (speed, and reading a distance-time record) are also
 *     assumed. Steady speeds appear as stated conditions (15 meters per
 *     second, "a steady speed"), but no speed is ever computed, no distance
 *     or time is given, and the speed formula appears nowhere in the body.
 *   - ROW 2.1 (Newton's first law) is the NEXT lesson and this file stops
 *     exactly where it begins. The rule "balanced forces, motion does not
 *     change" is stated here as the verdict of a counting routine, and it is
 *     never given its name: the strings "Newton" and "inertia" appear nowhere
 *     in the body -- their only occurrence in the file is inside the
 *     `followUps` loId string -- and mass is never offered as the reason an
 *     object is hard to get moving or hard to stop. Friction and air
 *     resistance are
 *     named in the concept segment only to say that wherever one of them turns
 *     up here its size in newtons and its direction are handed to the student
 *     inside the problem, and they carry values in exactly one place: the
 *     1,200 newtons of backward push in the second worked example, which is
 *     given, not derived. No try_yourself item uses either of them. Why they
 *     act, and the puzzle of the rolling ball that slows down on its own, are
 *     row 2.1's work and are not touched.
 *     One sentence at the end of the concept segment says the next lesson
 *     names the rule and asks where the everyday backward pushes come from;
 *     that sentence teaches none of it.
 *   - ROW 2.2 (Newton's second law) owns the size of the change. This file
 *     says only THAT the motion changes and in which direction, never by how
 *     much, never how quickly, and never in terms of mass. F = m × a is not
 *     stated in the body in words or in symbols, and no formula of any kind
 *     appears there. Mass is mentioned exactly once, in the concept segment, only to
 *     anchor how big one newton is (a one-liter bottle of water, about 1
 *     kilogram, needs an upward pull of about 10 newtons to hold still), and
 *     nothing anywhere is computed from a mass.
 *   - ROW 2.3 (the third law) owns force pairs. This file adds only the forces
 *     acting ON the one chosen object, and says in several places -- the
 *     concept segment, both worked examples and the recap -- that a force the
 *     object exerts on something else belongs on that other object's list and
 *     never joins this addition. The words "action" and "reaction" are never
 *     used to name a force, no two forces in this file are ever called a pair
 *     or described as partners, and nothing is said about how the two lists
 *     are related beyond one sentence pointing at a later lesson.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, tide,
 *     plate, ocean current or weather system appears anywhere in this file.
 *     Earth appears only as the thing pulling down on a parachutist and on an
 *     elevator, with the size of that pull given in newtons; nothing is said
 *     about why the pull exists, what it depends on, or what else it does.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): every force in this file lies along one
 *     straight line and is described as a push or a pull in a named direction,
 *     never as a vector, never as an arrow with a length, never with a sign in
 *     front of it, and never as part of a free-body diagram. Nothing is
 *     resolved into components, no force acts at an angle, and no item asks
 *     for an acceleration, a stopping distance, a momentum or an energy. The
 *     structure this file stops short of is vector addition of forces that are
 *     not on one line, which is `ap-physics-newtons-second-deep.ts`.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every force in
 * this file is written out in words with its size and its direction stated
 * inside the item, and every item is solvable from the text printed inside it.
 * Never write "look at the force diagram", and never assume the student has a
 * spring scale, a cart or a rope in front of them. Directions are always words
 * (left, right, north, up), never signs: this file never writes a force as a
 * negative number.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.3 -> 1.4 -> 2.1
 * (`velocity-and-acceleration` -> `forces-and-net-force` ->
 * `newtons-first-law-inertia-and-friction`). Both arrays are populated with
 * the real neighbors, per the contract; the two exemplars' empty arrays are a
 * registration-order artifact and are deliberately not copied.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U1_FORCES_AND_NET_FORCE: LessonPlan = {
  id: 'evelyn.ms.m8sci.forces-and-net-force.v1',
  title: 'Forces, Net Force & Balanced Forces',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.forces-and-net-force',
      standard: 'M8SCI-1.4',
      description:
        'Describe a force as a push or pull with a size (newtons) and a direction, add two forces along one line to find the net force (5 newtons to the left and 3 newtons to the right give a net force of 2 newtons to the left), and classify the forces on an object as balanced (no change in motion) or unbalanced (motion changes) (NGSS DCI PS2.A).',
    },
  ],
  prerequisites: ['m8sci.velocity-and-acceleration'],
  followUps: ['m8sci.newtons-first-law-inertia-and-friction'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a tug-of-war rope that is not moving while both teams strain, then moves when one side changes, so the student sees that what decides the motion is the leftover and not the effort.',
      script:
        'Picture a tug-of-war on a field, with a strip of red tape tied to the middle of the rope. Both teams are pulling as hard as they can. Feet are dug in, arms are shaking, and the tape is not moving. Not slowly. Not at all. Now one runner on the right-hand team gets a better grip and leans back, and the tape slides toward her team and keeps going. Here is the question worth asking about that: for those first few seconds, when the tape was standing still, how much pulling was going on? An enormous amount, on both sides. Standing still did not mean nobody was pulling. It meant the pulling on the left and the pulling on the right came to the same amount, so there was nothing left over to move the tape with. Then one side got a little bigger, a leftover appeared, and the tape went that way. Today you will learn to do that in numbers instead of by watching. Give me every push and pull on one object, each one with its size and its direction, and you will be able to say whether that object is about to change what it is doing, and which way.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-net-force-routine',
      kind: 'concept',
      goal: 'Install what a complete force description is, how forces on one line combine into a leftover, the balanced/unbalanced verdict that follows, the four-step routine, and the two traps before the student meets them.',
      keyIdeas: [
        'A FORCE IS A PUSH OR A PULL, AND DESCRIBING ONE TAKES THREE THINGS. A force is a push or a pull that one object exerts on another: your hand on a door, a rope on a sled, the air on a moving van. To describe a force completely you have to say what is pushing or pulling what, how big that push or pull is, and which way it points. Size is measured in newtons. A newton is not a huge amount: a full one-liter bottle of water has a mass of about 1 kilogram, and holding it still in your hand takes an upward pull of about 10 newtons. Direction is not decoration. "20 newtons" is not a complete answer to a force question, because 20 newtons to the right and 20 newtons to the left do opposite things to the same object. Some of the forces in this lesson come from surfaces rubbing together or from air pushing on something that is moving through it -- those are called friction and air resistance -- and wherever one of them turns up here, its size in newtons and its direction are handed to you inside the problem.',
        'THE NET FORCE IS THE LEFTOVER FORCE AFTER ALL THE FORCES ON ONE OBJECT ARE ADDED TOGETHER. Two forces that point the same way add up: a push of 6 newtons to the right and a push of 4 newtons to the right act on the object exactly like one push of 10 newtons to the right. Two forces that point opposite ways work against each other, so you take the smaller size away from the larger size and keep the direction of the larger one: 5 newtons to the left and 3 newtons to the right leave a net force of 2 newtons to the left. The 3 newtons did not vanish and it did not win; it ate into the 5 newtons and 2 newtons were left over. Because the net force is itself a force, your answer always carries a size in newtons and a direction -- the one exception being a leftover of 0 newtons, which needs no direction at all.',
        'A NET FORCE OF ZERO MEANS BALANCED, AND BALANCED MEANS THE MOTION DOES NOT CHANGE. When the forces on an object add up to a leftover of 0 newtons, the forces are BALANCED. Balanced does not mean that nothing is pushing or pulling -- the tug-of-war rope had two teams straining on it -- it means the pushes and pulls cancel each other out. An object at rest with balanced forces on it stays at rest. An object that is already moving with balanced forces on it keeps moving at the same speed and in the same direction. When the leftover is not zero the forces are UNBALANCED, and the motion changes: the object starts moving from rest in the direction of the leftover, or speeds up if the leftover points the way it is already going, or slows down if the leftover points the other way. Every force in this lesson lies along one straight line, so those are the only changes you have to describe. WRONG: "It is moving, so the forces on it must be unbalanced." CORRECT: "It is moving at a steady speed in a straight line, so the forces on it are balanced; unbalanced forces would be changing that speed."',
        'ADD ONLY THE FORCES THAT ACT ON THE ONE OBJECT YOU CHOSE. Before you add anything, say which object the question is about, and then collect only the pushes and pulls that act ON that object. A force that your object exerts on something else -- your hand pushing the wall, the sled pushing back on the rope that is dragging it -- goes on the list for that other object, and it never joins this addition. Mixing the two lists is the quickest way to turn a correct set of numbers into a wrong net force. What happens on that other list, and how the two are related, is a later lesson in the next unit.',
        'THE ROUTINE, IN ORDER. (1) Name the one object you are asking about. (2) List every force acting on it along the line, each with its size in newtons and its direction. (3) Combine them: add together the ones pointing one way, add together the ones pointing the other way, then take the smaller total away from the larger total and keep the direction of the larger total. (4) Read the verdict: a leftover of 0 newtons means the forces are balanced and the motion does not change; any other leftover means the forces are unbalanced and the motion changes in the direction of the leftover. Then check the answer two ways: combine the forces again in a different order and confirm you get the same leftover, and ask what somebody watching the object would actually see, and whether that matches your verdict.',
        'THE TWO TRAPS. First trap: THE LARGER FORCE DOES NOT SIMPLY WIN. When a pull of 30 newtons east meets a pull of 18 newtons west on the same object, the leftover is 12 newtons east, not 30 newtons east. The smaller force is not overpowered and set aside; it works against the larger one and reduces it. Second trap: YOU CANNOT ADD THE SIZES AND IGNORE THE DIRECTIONS. Those same two pulls are not 48 newtons of anything, because they are not pointing the same way, and adding sizes is only correct when the forces do point the same way. Both traps come from the same habit -- treating a force as a number instead of as a number with a direction attached. Naming this rule, and answering the question of where the everyday backward pushes come from in the first place, is the next lesson.',
      ],
      vocabulary: [
        { term: 'force', definition: 'a push or a pull that one object exerts on another, described by its size in newtons and its direction.' },
        { term: 'newton', definition: 'the unit that forces are measured in; holding up a one-liter bottle of water takes a pull of about 10 newtons.' },
        { term: 'net force', definition: 'the leftover force after all the forces acting on one object are added together, with their directions taken into account.' },
        { term: 'balanced forces', definition: 'forces on one object that add to a net force of 0 newtons, so the object\'s motion does not change.' },
        { term: 'unbalanced forces', definition: 'forces on one object that add to a net force that is not zero, so the object\'s motion changes in the direction of that leftover.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sled-three-ropes',
      kind: 'worked_example',
      problem:
        'A heavy sled sits still on packed snow in a long yard that runs north and south. Three friends tie ropes to it. Two of them pull toward the north end of the yard: one pulls with 60 newtons and the other pulls with 45 newtons. The third friend pulls toward the south end with 105 newtons. No other force acts along that line. Run the routine: what is the net force on the sled, are the forces balanced or unbalanced, and what does the sled do?',
      steps: [
        'Step 1, name the one object. The question is about the sled, so the only forces that go on the list are the pushes and pulls that act ON the sled. The ropes act on the sled, so all three belong. The sled also pulls back on each rope, and each friend pushes on the snow with their boots, but those forces act on the ropes and on the snow, not on the sled, so they stay off this list.',
        'Step 2, list the forces on the sled with sizes and directions. Toward the north end: 60 newtons, and 45 newtons. Toward the south end: 105 newtons. That is the whole list, because the problem says no other force acts along that line.',
        'Step 3, combine them. First add the ones pointing the same way: the two northward pulls give 60 newtons plus 45 newtons, which is 105 newtons toward the north end. Now compare that with the southward total, which is 105 newtons. The two totals point opposite ways, so take the smaller away from the larger: 105 newtons minus 105 newtons is 0 newtons. There is nothing left over, and a leftover of 0 newtons needs no direction.',
        'Step 4, read the verdict. A net force of 0 newtons means the forces on the sled are balanced, so its motion does not change. The sled was sitting still, so it goes on sitting still. Notice what balanced did NOT mean here: it did not mean the ropes were slack. Three ropes are pulling hard on that sled -- 60 newtons, 45 newtons and 105 newtons -- and it is still not moving, because what is pulling one way comes to the same total as what is pulling the other way.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The arithmetic says the northward total and the southward total are the same size, so the leftover is zero. The order check agrees: combine the forces in a completely different order -- start with the 60 newtons north against the 105 newtons south, which leaves 45 newtons south, then bring in the 45 newtons north, and 45 newtons minus 45 newtons is 0 newtons again. And what a watcher would see agrees too: if the leftover pointed north the sled would have started sliding north, and if it pointed south it would have started sliding south, and it is doing neither. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Suppose the friend pulling south gets tired and eases off to 85 newtons, while the other two pull exactly as before. The northward total is still 105 newtons, and now 105 newtons minus 85 newtons leaves 20 newtons toward the north end. The leftover is no longer zero, so the forces are unbalanced, and the sled starts to move north -- the direction of the leftover. One number changed, and the verdict changed with it. WRONG: "The sled did not move, so the ropes cannot have been pulling hard." CORRECT: "The sled did not move because the pulls came to the same total on each side, however hard they were."',
      ],
      answer:
        'The net force on the sled is 0 newtons: the two northward pulls total 60 newtons plus 45 newtons, which is 105 newtons, and that exactly matches the 105 newtons pulling south. The forces are balanced, so the sled\'s motion does not change and it stays at rest. If the southward pull eased to 85 newtons, the leftover would be 20 newtons toward the north end, the forces would be unbalanced, and the sled would start moving north.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-van-steady-speed',
      kind: 'worked_example',
      problem:
        'A delivery van drives along a straight, flat road at a steady 15 meters per second. Its engine turns its wheels, and the road pushes the van forward with 1,200 newtons. Air resistance and friction together push backward on the van with 1,200 newtons. No other force acts along the road. A student says: "The van is moving forward, so there has to be a leftover force pushing it forward." Is the student right? Give the net force on the van and say what happens to its motion.',
      steps: [
        'Step 1, name the one object: the van. Step 2, list the forces on it along the road. Forward: 1,200 newtons from the road. Backward: 1,200 newtons from air resistance and friction together. Those are the only two, because the problem says so.',
        'Step 3, combine them. The two forces point opposite ways along the same line, so take the smaller size away from the larger size. They are the same size, so 1,200 newtons minus 1,200 newtons is 0 newtons. Step 4, read the verdict: the forces on the van are balanced, so its motion does not change. It keeps going at 15 meters per second along the same straight road.',
        'So the student is not right, and it is worth being precise about what went wrong. Moving is not what unbalanced forces produce. CHANGING the motion is. WRONG: "It is moving forward, so there is a leftover force forward." CORRECT: "Its speed and direction are not changing, so the leftover force on it is 0 newtons." A leftover force forward would show up as the van speeding up, and the van is not speeding up.',
        'Now run the two checks. First, three clues of DIFFERENT KINDS agreeing. The arithmetic: two forces of the same size pointing opposite ways leave 0 newtons. The reverse reading, which starts from the motion instead of from the forces: the van is neither speeding up nor slowing down, and only a leftover of zero allows that, so the forward and backward totals must match -- which is exactly what the given sizes say. And what a passenger would see: the speedometer needle sits at one number and stays there, which is what balanced forces look like from inside.',
        'Second, change one thing and check that the answer moves. The driver presses the pedal harder, so the road now pushes the van forward with 1,500 newtons while the backward push is still 1,200 newtons in that first moment. Now 1,500 newtons minus 1,200 newtons leaves 300 newtons forward. The leftover is not zero, the forces are unbalanced, and the van speeds up -- a change in motion, in the direction of the leftover. Take the pedal all the way off instead, so the road stops pushing the van forward at all, and the only force along the road is the 1,200 newtons backward; the leftover points backward, and the van slows down. Same van, three different force lists, three different verdicts.',
        'One thing to keep off the list, because it is the most common way to get this wrong. The van pushes backward on the air as it drives through it, and it pushes on the road through its tires. Those are forces on the air and on the road. They are not forces on the van, so they never join this addition, and no question in this lesson asks you to add a force to the object that is producing it.',
      ],
      answer:
        'The student is not right. The net force on the van is 0 newtons, because the 1,200 newtons of forward push from the road and the 1,200 newtons of backward push from air resistance and friction are the same size in opposite directions. The forces are balanced, so the van\'s motion does not change and it keeps rolling at a steady 15 meters per second. Unbalanced forces would show up as a change -- speeding up or slowing down -- not as movement itself.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cart-two-students',
      kind: 'try_yourself',
      problem:
        'A loaded equipment cart stands on a flat gym floor. One student pulls it toward the north wall with 90 newtons. At the same moment another student pushes it toward the south wall with 55 newtons. No other force acts along that line. What is the net force on the cart?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '145 newtons toward the north wall, because both students are acting on the same cart along the same line, so their two sizes are added together to give the total force on it.' },
        { id: 'b', text: '35 newtons toward the north wall, because the two forces point opposite ways, so the smaller size is taken away from the larger one and the leftover keeps the direction of the larger.', correct: true },
        { id: 'c', text: '35 newtons toward the south wall, because 55 newtons taken from 90 newtons leaves 35 newtons, and the leftover points the way the force that got subtracted was pointing.' },
        { id: 'd', text: '90 newtons toward the north wall, because the larger of the two forces wins the contest outright, and the smaller push is overpowered and has no effect on the cart at all.' },
      ],
      expectedAnswer: '35 newtons toward the north wall, because the two forces point opposite ways, so the smaller size is taken away from the larger one and the leftover keeps the direction of the larger.',
      hints: [
        'The two forces are acting on one object along one line, and they point opposite ways. Forces that point opposite ways work against each other. Which of these two is larger, and what does the smaller one do to it?',
        'Do the subtraction first, then decide the direction separately. Your answer has to carry both a size in newtons and a direction, and the direction comes from the larger of the two forces.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parachutist-steady-fall',
      kind: 'try_yourself',
      problem:
        'A parachutist is falling straight down with her parachute open. Treat the parachutist, her gear and the open parachute as one object. She is falling at a steady speed: she is neither speeding up nor slowing down. Earth pulls down on that object with 700 newtons, and the air pushes up on the open parachute with 700 newtons. No other force acts along that line. Which statement about the forces on her is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The forces are unbalanced, with a leftover of 700 newtons downward, because she is still moving downward, and anything that keeps moving must have a leftover force pushing it along the way it is going.' },
        { id: 'b', text: 'The forces are unbalanced, with a small leftover upward, because the open parachute has taken over from Earth and is now pulling up on her more strongly than Earth is pulling her down.' },
        { id: 'c', text: 'The forces are balanced: 700 newtons down and 700 newtons up leave a net force of 0 newtons, so her motion does not change and she keeps falling at the same steady speed.', correct: true },
        { id: 'd', text: 'The forces are balanced, so the net force on her is 0 newtons, which means that she is not moving at all and is hanging still in the air until one of the two forces changes.' },
      ],
      expectedAnswer: 'The forces are balanced: 700 newtons down and 700 newtons up leave a net force of 0 newtons, so her motion does not change and she keeps falling at the same steady speed.',
      hints: [
        'Do the arithmetic before you decide anything about the falling. Two forces of the same size, pointing opposite ways along one line -- what is the leftover?',
        'Balanced means the motion does not CHANGE. It does not mean the object is at rest. Her speed is not changing, so what should you expect the leftover to be, and what does she go on doing?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-crate-three-cables',
      kind: 'try_yourself',
      problem:
        'A shipping crate rides on a line of rollers set into a flat factory floor, so it can move only in a straight line toward the loading door or away from it. Two cables pull it toward the loading door: one pulls with 250 newtons and the other pulls with 150 newtons. A third cable pulls it directly away from the loading door with 400 newtons. The crate is already moving toward the loading door at a steady speed, and no other force acts along that line. Which statement is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The net force is 400 newtons toward the loading door, because the two cables pulling that way come to 400 newtons and the crate is moving that way, which shows which direction the leftover points.' },
        { id: 'b', text: 'The net force is 800 newtons toward the loading door, because three cables are pulling on one crate along one line, so their three sizes are added together to give the total pull on it.' },
        { id: 'c', text: 'The forces are balanced and the net force is 0 newtons, so the crate has to slow down and stop, because there is no leftover force left over to keep it moving toward the door.' },
        { id: 'd', text: 'The forces are balanced and the net force is 0 newtons, so the crate\'s motion does not change and it keeps moving toward the loading door at the same steady speed.', correct: true },
      ],
      expectedAnswer: 'The forces are balanced and the net force is 0 newtons, so the crate\'s motion does not change and it keeps moving toward the loading door at the same steady speed.',
      hints: [
        'Add the two pulls that point toward the door together first, so that you are comparing one total with one total, and then deal with the cable pulling the other way.',
        'Once you have the leftover, read the verdict off it rather than off the fact that the crate is moving. A leftover of 0 newtons means no CHANGE in motion, and the crate was already moving.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-adding-sizes-and-moving-means-unbalanced',
      kind: 'misconception_check',
      question:
        'A student writes: "A wagon is being pulled east with 12 newtons while a friend pulls it west with 7 newtons, so the net force on it is 19 newtons. And the wagon next to it is rolling along at a steady speed, so the forces on that one have to be unbalanced -- something must be pushing it along." Two different things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The net force is 19 newtons, because 12 newtons and 7 newtons add to 19 newtons.',
          misconception:
            'Adding the two sizes and leaving the directions out of it, because "adding the forces" sounds like it means adding the numbers, and the two numbers are sitting right there in the problem.',
          correctsTo:
            'A force is a size AND a direction, and the direction decides whether two forces help each other or work against each other. These two point opposite ways along one line, so they work against each other: take the smaller size from the larger one, 12 newtons minus 7 newtons, and keep the direction of the larger, which gives a net force of 5 newtons east. There is also no direction attached to the student\'s answer, and a net force always needs one unless it is 0 newtons. 19 newtons is the correct answer to a different question -- what the leftover would be if both people pulled east on the wagon together. WRONG: "Adding forces means adding the numbers." CORRECT: "Forces pointing the same way add; forces pointing opposite ways subtract, and the leftover keeps the direction of the larger one."',
        },
        {
          answer: 'The second wagon is rolling at a steady speed, so the forces on it must be unbalanced.',
          misconception:
            'Reading motion itself as the sign of a leftover force, because in most of the moving you have watched, somebody was pushing at the time, so movement and pushing have never come apart.',
          correctsTo:
            'Balanced forces do not mean that nothing is moving. They mean the motion does not CHANGE. An object sitting still with balanced forces on it goes on sitting still, and an object already moving with balanced forces on it goes on moving at the same speed in the same direction. An elevator rising at a steady speed is the clearest case: the cable pulls up on it with 8,000 newtons, Earth pulls down on it with 8,000 newtons, the leftover is 0 newtons, and it keeps rising at the speed it already had. What would tell you the forces were unbalanced is a CHANGE -- the wagon speeding up or slowing down -- and a steady speed is the opposite of that. WRONG: "It is moving, so one side must be winning." CORRECT: "It is moving at a steady speed, so nothing is winning, and the leftover force on it is 0 newtons."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A force is a push or a pull of one object on another, and it takes three things to describe: what acts on what, a size in newtons, and a direction.',
        'The net force is the leftover force after all the forces on ONE object are added together, with their directions taken into account.',
        'Forces on one line that point the same way add. Forces that point opposite ways subtract: take the smaller size from the larger, and keep the direction of the larger.',
        'The net force is a force, so the answer needs a size in newtons and a direction -- unless the leftover is 0 newtons, which needs no direction.',
        'A net force of 0 newtons means the forces are BALANCED, and balanced means the motion does not change: at rest stays at rest, and moving keeps the same speed and direction.',
        'A net force that is not zero means the forces are UNBALANCED, and the motion changes in the direction of the leftover -- starting to move, speeding up, or slowing down.',
        'Balanced does not mean that nothing is pushing. The tug-of-war rope was not moving while two teams strained on it, because the pulls came to the same total on each side.',
        'Movement is not evidence of a leftover force. A CHANGE in movement is. Something rolling along at a steady speed in a straight line has balanced forces on it.',
        'Add only the forces acting ON the object you named. A force that object exerts on something else belongs on that other object\'s list.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Forces, Net Force & Balanced Forces' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
