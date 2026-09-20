/**
 * Grade 8 Science (Physical Science) — Energy: When Motion Changes, Energy Is
 * Transferred.
 *
 * CONCEPT-LED row 4.4 of the m8sci fan-out (NGSS MS-PS3-5). There is no
 * procedure to lean on here, because the whole lesson is one mental model
 * with a habit attached: an object's kinetic energy never rises or falls on
 * its own, so whenever a described object speeds up or slows down there is a
 * second object on the other end of the change, and the argument names it.
 * The hard part is not the rule -- it is that the receiving object is often
 * invisible. When a cue ball hands its motion to another ball the receiver
 * is obvious; when a box slides to a stop, the receiver is a strip of floor
 * that is barely warmer than it was, plus the air beside it, and nothing
 * looks like it received anything at all. So the plan spends its second
 * worked example on exactly that case, and teaches "find the receiver" as the move that makes
 * the argument defensible.
 *
 * The two traps it is built to kill are (a) energy-is-used-up -- the brakes
 * "used up" the motion and it is gone -- and (b) the force-as-a-possession
 * error, in which a moving object carries a supply of force and hands some
 * of it over on contact. The second is the sharper one for this row, because
 * the sentence "the bat gives its force to the ball" is the everyday way of
 * describing exactly the event this lesson is about, and the correction is
 * the whole point: the force is the pathway, and energy is what travels.
 *
 * SCOPE GUARD: this plan constructs the argument that a change in an
 * object's kinetic energy means energy was transferred to it or away from it
 * by another object, and identifies the giver and the receiver in described
 * cases. Its scope cell's withheld clause, verbatim: "Withholds work = force ×
 * distance as a formula." Its scope cell also fixes the split with
 * its neighbor, verbatim: "distinct from 4.3: that lesson follows energy
 * changing form inside one system, this one follows energy moving BETWEEN
 * objects through a force". What that means at each edge, and what is
 * deliberately ALLOWED there:
 *   - ROW 4.3 (energy transformations and conservation) is the prerequisite
 *     and is assumed, not re-taught. Conservation is used as a rule the
 *     student already holds -- "energy is never used up" is asserted and
 *     applied, never argued for -- and no segment traces a chain of FORMS
 *     through one system. The only forms named in this file are kinetic,
 *     thermal and sound, and each is named as the ANSWER to "where did the
 *     energy that left this object end up", never as a step in a
 *     transformation chain. Chemical, elastic and light energy do not appear.
 *   - ROW 4.1 (kinetic energy: mass and speed) is assumed. One clause of the
 *     first concept keyIdea restates that kinetic energy grows with mass and
 *     that doubling the speed makes it four times as large; that relationship
 *     is never re-derived, never used in a comparison, and no item tests it.
 *   - ROW 4.2 (potential energy stored by position) is not entered. A hill
 *     appears in the hook only as the everyday memory of warm brake pads; no
 *     segment asks where the speed at the bottom came from, nothing is lifted,
 *     stretched or ranked by stored energy, and the phrase potential energy
 *     does not appear. Both worked examples are set on level ground for this
 *     reason.
 *   - ROW 5.1 (temperature versus thermal energy) is the followUp and is NOT
 *     pre-taught. This file says that rubbing surfaces and the air beside
 *     them end up warmer and names that thermal energy, which is what the
 *     argument needs. It never distinguishes temperature from thermal
 *     energy, never says average or total, never mentions particles, and
 *     never states a temperature in degrees.
 *   - ROWS 1.4 AND 2.1 (net force, the first law) are assumed as words the
 *     student already holds: friction and air resistance are used as real
 *     backward forces without being re-taught, and the steady-speed case is
 *     stated once, as the case where the pushes cancel and the kinetic
 *     energy therefore does not change.
 *   - ROW 2.3 (the third law) is NOT taught. The first worked example does
 *     name both pushes in the collision -- the first ball pushes forward on
 *     the second and the second pushes backward on the first -- because the
 *     backward push is why the first ball slows and the argument needs it.
 *     It never calls them a pair, never uses the words action or reaction,
 *     and never says anything about their sizes.
 *   - ROW 3.4 (fields) is not entered. One clause of the second concept
 *     keyIdea says that the two objects do not always have to touch and cites
 *     a magnet speeding up a steel ball from a little way off. The word field
 *     does not appear, nothing is said about how the pull reaches across the
 *     gap, and every transfer analyzed in a worked example or an item
 *     happens between objects that are in contact, including the moving air
 *     pushing on a rider in the third item.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. No plate, current, weather
 *     system, orbit or water cycle is anywhere in this file; the moving air
 *     in the third item is wind as a push on a rider, and nothing is said
 *     about where wind comes from.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. No organism, cell, food or muscle supplies
 *     energy anywhere in the file -- the cyclist's pedaling is named once, as
 *     a forward push that cancels the backward ones, with no account of where
 *     the pedaling comes from.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): this file argues a
 *     DIRECTION and a PAIR -- who gave, who received, where the energy is now
 *     -- and never an amount. The formula it stops short of is work = force ×
 *     distance, named in its own scope cell and owned by
 *     `ap-physics-c-mech-energy-momentum.ts`; also absent are one-half m v
 *     squared, any energy in joules, momentum and impulse, efficiency, and
 *     any law of thermodynamics. The one quantity stated anywhere in the body
 *     is an illustrative speed of about 2 meters per second in the first
 *     worked example, and nothing is computed from it.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every motion,
 * every push and every direction in this file is written out in words inside
 * the item that needs it, and no item depends on an observation the student
 * has not already made. Never write "see the diagram", and never assume the
 * student has a pool table, a bowling lane or a skateboard in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.3 -> 4.4 ->
 * 5.1 (`energy-transformations-and-conservation` ->
 * `energy-transfer-when-motion-changes` -> `temperature-and-thermal-energy`),
 * and both arrays are populated with those real loIds. The two exemplars'
 * empty arrays are a registration-order artifact and are not the pattern.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U4_ENERGY_TRANSFER_WHEN_MOTION_CHANGES: LessonPlan = {
  id: 'evelyn.ms.m8sci.energy-transfer-when-motion-changes.v1',
  title: 'When Motion Changes, Energy Is Transferred',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.energy-transfer-when-motion-changes',
      standard: 'M8SCI-4.4',
      description:
        'Construct an argument from described evidence that when an object\'s kinetic energy changes, energy was transferred to it or away from it by another object -- a cue ball stops as the struck ball starts moving; a bicycle\'s brakes get hot as it slows; a bat sends a ball off faster -- and identify the object that gave and the object that received the energy (NGSS MS-PS3-5).',
    },
  ],
  prerequisites: ['m8sci.energy-transformations-and-conservation'],
  followUps: ['m8sci.temperature-and-thermal-energy'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two opposite everyday changes side by side -- motion that disappears and leaves warm metal behind, and motion that appears in something that had none -- so the student starts looking for the second object on the other end of every change.',
      script:
        'You have ridden a bike down a long hill with the brakes squeezed the whole way. At the bottom you are barely rolling, and if you touch the brake pads or the metal rim of the wheel, they are warm. Sometimes they are hot enough that you take your hand straight back off. All that speed you had is gone, and something you were not thinking about got warm. Now turn the story around. On a pool table a ball sits still, doing nothing at all. A second ball rolls into it, there is a click, and suddenly the still ball is racing across the felt while the ball that hit it has almost stopped. Speed appeared in something that had none. Those two stories look like opposites, and they are the same story twice. In each one an object\'s motion changed, and in each one there was another object touching it at exactly the moment it changed. Today you will learn to trace the energy from one of those objects to the other, and to say, in an argument you can defend, which one gave and which one received.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-transfer-between-objects',
      kind: 'concept',
      goal: 'Install the rule that kinetic energy changes only through another object, separate the force (the pathway) from the energy (what travels), fix the direction rule, make the student name the receiver, and give the four-move argument.',
      keyIdeas: [
        'KINETIC ENERGY IS THE ENERGY AN OBJECT HAS BECAUSE IT IS MOVING, AND IT NEVER CHANGES ON ITS OWN. You already know that kinetic energy grows with mass and grows much faster with speed -- doubling the speed makes the kinetic energy four times as large. This lesson asks a different question about it. Not how much, but where from and where to. An object sitting alone, with nothing pushing or pulling on it, keeps the kinetic energy it has: zero if it is at rest, and a steady amount if it is moving. The only way for that number to go up or down is for another object to push or pull on it. So a change in an object\'s kinetic energy is not just a fact about that object. It is evidence that a second object was involved, and the whole of this lesson is learning to find that second object and say which way the energy went.',
        'THE FORCE IS THE PATHWAY. ENERGY IS WHAT TRAVELS ALONG IT. Two objects can trade energy only while they are interacting -- while one is pushing or pulling on the other. Be careful with the words here, because the everyday way of saying this is wrong, and it is wrong in a way that hides the real event. WRONG: "The bat gives its force to the ball." CORRECT: "While the bat and the ball are touching, the bat pushes on the ball, and along that push energy moves from the bat to the ball." A force is not a thing an object owns and hands over in pieces; it is an interaction between two objects, and it lasts exactly as long as they are acting on each other and not one moment longer. Energy is the thing an object can have more or less of, and energy is what changes hands. The two objects do not always have to touch, either -- a magnet can speed up a steel ball from a little way off -- but there is always a push or a pull between two objects, and that push or pull is when the trade happens.',
        'THE DIRECTION OF THE PUSH TELLS YOU WHICH WAY THE ENERGY WENT. If the push on an object points along the direction it is already moving, the object speeds up, its kinetic energy goes up, and it RECEIVED energy from whatever was pushing it. If the push points against the motion, the object slows down, its kinetic energy goes down, and it GAVE energy away to whatever was pushing it. That is the whole rule, and the second half of it is the one people forget: slowing down is a transfer just as much as speeding up is. The energy leaves instead of arriving. There is a third case worth naming so it does not confuse you. An object moving at a steady speed in a straight line is not gaining or losing kinetic energy at all, even though forces may well be acting on it, because the forward and backward pushes cancel. A cyclist pedaling along a flat road at a steady speed is putting energy into the bike\'s motion exactly as fast as friction and the air are taking it away, so the kinetic energy stays where it is.',
        'THE ENERGY THAT LEAVES ALWAYS ARRIVES SOMEWHERE, AND YOUR ARGUMENT HAS TO NAME WHERE. Energy is never used up, made or destroyed -- that is the rule you already have, and it does not bend here. So when a moving object slows down, the energy it lost is somewhere, and in everyday cases it is almost always in one of two places. Either another object started moving, and the energy is now kinetic energy in that object. Or two surfaces rubbed against each other, and the energy is now thermal energy in those surfaces and in the air right beside them, which is why they end up warmer than they were. WRONG: "The brakes used up the bike\'s energy of motion." CORRECT: "The bike\'s energy of motion moved into the brake pads, the wheel rim and the air, which are warmer than they were." The warmth is not a side effect of the stopping. The warmth IS the energy, in the place it went.',
        'THE ARGUMENT, IN FOUR MOVES. (1) Name the one object you are arguing about, say how its kinetic energy changed, and say how you know -- it sped up, so the energy went up; it slowed down, so the energy went down. (2) Name the other object that was pushing or pulling on it while the change was happening, and say which way that push pointed compared with the motion. (3) Say which object gave and which received, and name where the energy is now: moving in the other object, or making surfaces and the air warmer. (4) Test the argument by changing exactly one thing. Take the other object away, or swap it for a different one, and say what the motion would do instead. If the change in motion disappears when you remove that object, you have found the giver or the receiver, and your argument is evidence and not just a story.',
        'WHAT THIS ARGUMENT CLAIMS, AND WHAT IT DOES NOT. It claims a direction and a pair: which object gave, which received, and where the energy ended up. It does not claim an amount. Nothing in this lesson asks how much energy moved, and there is no formula here for working that out from a push and a distance. Two more limits, because both are places students overshoot. Giving energy away does not leave an object empty or used up: a cue ball that hands its motion to another ball is simply sitting still on the felt, ready to be pushed again. And a transfer does not have to be tidy. When two objects collide you can usually hear a small share of the energy leave as sound, and the place where they touched is left very slightly warmer, so "nearly all of it went to the other ball" is a more honest sentence than "all of it did".',
      ],
      vocabulary: [
        { term: 'kinetic energy', definition: 'the energy an object has because it is moving. It grows with the object\'s mass and with its speed, and an object at rest has none.' },
        { term: 'energy transfer', definition: 'the movement of energy from one object to another, which happens while the two are pushing or pulling on each other.' },
        { term: 'thermal energy', definition: 'the form of energy that shows up as how warm an object is -- an object gains thermal energy when it warms up and loses it when it cools.' },
        { term: 'friction', definition: 'a force between two touching surfaces that pushes against their sliding or rolling across each other.' },
        { term: 'collision', definition: 'a brief interaction in which two objects touch and push on each other, so that the motion of each one changes.' },
        { term: 'conservation of energy', definition: 'the rule that energy is never created or destroyed; it only moves between objects and changes from one form into another.' },
      ],
      suggestedTools: ['show_diagram', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cue-ball-and-struck-ball',
      kind: 'worked_example',
      problem:
        'On a pool table, one ball is rolling at about 2 meters per second straight toward a second ball of the same size that is standing still. The two meet with a click. Straight after the click the first ball is barely moving, and the second ball is traveling away at close to 2 meters per second in the direction the first ball had been going. Nothing else touches either ball. Build the argument: whose kinetic energy changed, which way, and which object gave and which received?',
      steps: [
        'Move one, name each object and say how its kinetic energy changed. Take the first ball. Before the click it was rolling at about 2 meters per second; after the click it is barely moving. It slowed down, so its kinetic energy went down. Now take the second ball. Before the click it was standing still, so it had no kinetic energy at all; after the click it is moving at close to 2 meters per second, so its kinetic energy went up from nothing to a real amount. Two objects, two changes, in opposite directions.',
        'Move two, name the other object and the direction of the push. The only thing that touched either ball is the other ball, and they touched for one very short moment -- the click. While they were touching, the first ball pushed forward on the second ball, in the direction the first ball was already going, and a push on an object that is standing still is what sets it moving in the direction of that push. At the same moment the second ball pushed backward on the first ball, against its motion, and a push against the motion is what slows an object down. Both changes in motion have a push behind them, and both pushes existed only while the two balls were in contact.',
        'Move three, say who gave, who received, and where the energy is now. The first ball slowed, so it gave energy away. The second ball sped up from a standstill, so it received energy. Nearly all of the kinetic energy that left the first ball is now kinetic energy in the second ball, which is why the second ball crosses the felt at close to the speed the first one had. Not quite all of it: you heard a small share leave as the sound of the click, and the small patch where the two balls touched is left very slightly warmer than it was.',
        'WRONG: "The first ball gave the second ball its force." CORRECT: "While the two balls were touching, the first ball pushed on the second, and along that push energy moved from the first ball to the second." The force was an interaction between the two balls and it ended the instant they came apart; neither ball carried it off afterward. Energy is the thing that moved and stayed moved, which is why the second ball is still traveling long after the push is over.',
        'Now check the argument the way a science answer has to be checked, because there is no arithmetic here to redo. Look for three clues of DIFFERENT KINDS that agree. The first is timing: the second ball did not start moving a moment before the click or a moment after it, but exactly at the click, which is exactly when the two balls were pushing on each other. The second is the force inventory: nothing else was touching either ball -- no hand, no cue, no third ball -- so the only interaction available to explain either change is the one between these two. The third is that the two changes match in size: the speed the first ball lost is very close to the speed the second ball gained, which is what you expect if what left one arrived at the other, and is not what you would expect if the two changes had separate causes of their own.',
        'Then change exactly one thing and check that the answer moves with it. Take the second ball off the table and roll the first ball down the same line at the same speed. Now it does not stop; it rolls on to the far cushion, losing speed only slowly to friction with the felt. The sudden stop needed the second ball to be there, which is the sign that the second ball is where the energy went. Change the second ball instead of removing it -- put a much more massive ball in its place -- and the first ball bounces back toward you rather than stopping, because a lighter object pushing on a much heavier one does not hand over all of its motion. The answer moves every time the other object moves. That is what makes this an argument from evidence rather than a description.',
      ],
      answer:
        'The first ball gave energy to the second ball. The first ball slowed almost to a stop, so its kinetic energy went down; the second ball went from standing still to close to 2 meters per second, so its kinetic energy went up; and the two were pushing on each other at exactly the moment both changes happened, with the first ball pushing forward on the second and the second pushing backward on the first. Nearly all of the first ball\'s kinetic energy is now kinetic energy in the second ball, with a small share carried off as the sound of the click and a slight warming where they touched.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-brake-pads-warm',
      kind: 'worked_example',
      problem:
        'A cyclist coasting along a flat, straight road at a steady speed squeezes the brakes and comes to a stop in a few seconds. The brake pads press against the turning metal rim of the wheel the whole time. Once the bike has stopped, the pads and the rim are clearly warmer than they were before the braking, while the seat, the frame and the handlebars are not. A student says: "The bike had energy of motion, the brakes used it up, and now it is gone." Build the argument properly: whose kinetic energy changed, which object gave, and which object received?',
      steps: [
        'Move one, name the object and say how its kinetic energy changed. The object is the bike with its rider. Before the braking they were moving at a steady speed, so they had a steady amount of kinetic energy. A few seconds later they are at rest, so their kinetic energy has gone down to nothing. The whole of it left. That is a large change, and the rule says a change that large had a second object on the other end of it.',
        'Move two, name the other object and the direction of the push. The pads are squeezed against the rim, the rim is turning, and so the two surfaces rub against each other. Friction between them pushes against the motion of the rim everywhere the two touch. That backward push is the pathway, and notice that it is the only thing in this story that changed when the brakes went on -- the road is the same road, the air is the same air, and the bike is the same bike.',
        'Move three, say who gave, who received, and where the energy is now. The bike and rider slowed, so they gave energy away. The pads and the rim received it, and for once you can feel exactly where it went: those two surfaces are warmer than they were, and so is the air right beside them. The energy of motion did not vanish when the speed did. It became thermal energy in the pads and the rim, and it is spreading from there into the air.',
        'WRONG: "The brakes used up the bike\'s energy of motion, and now it is gone." CORRECT: "The bike\'s energy of motion moved into the brake pads, the rim and the air around them, which are warmer than they were." Used up is not something energy does. Moved into a place you can name, and can check by touching, is. The warm rim is not a side effect of the braking; it is the receipt.',
        'Now look for three clues of DIFFERENT KINDS that agree, since there is no arithmetic to redo. The first is location: the pads and the rim are warmer and the seat, frame and handlebars are not, and the pads and the rim are precisely the two surfaces that were rubbing. If the warmth had come from the weather or from the rider, it would not have picked out those two parts. The second is timing: they warm up during the braking and only during the braking, not on the long coast before it. The third is size: braking from a higher speed, or braking for longer, leaves them warmer still, so the more motion that is lost, the more warmth appears -- the two quantities move together, which is what you expect if one is becoming the other.',
        'Then change exactly one thing, twice. First, coast along the same flat road without touching the brakes. The bike keeps almost all of its speed for a long way, losing it only slowly to friction and the air, and the rim stays cool. The warmth appears only when the fast slowing does. Second, squeeze the brakes just as hard while the bike is already standing still. The pads press the rim exactly as before, and nothing warms at all, because there is no motion for them to take energy from. Put those two together and the rubbing on its own is ruled out as the source. The source is the kinetic energy the bike had, and the rubbing is only the pathway it left by.',
      ],
      answer:
        'The bike and rider gave the energy away, and the brake pads, the wheel rim and the air beside them received it. The bike and rider slowed from a steady speed to rest, so their kinetic energy went down to nothing; the pathway was the friction between the pads and the turning rim, a push against the motion; and the energy is now thermal energy in those two surfaces, which is why they are warmer and the rest of the bike is not. Nothing was used up.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bowling-ball-and-pin',
      kind: 'try_yourself',
      problem:
        'A bowling ball rolls down the lane and hits a single standing pin squarely. After the hit the ball is still moving forward but clearly slower than before, and the pin, which had been standing still, flies off down the lane. Nothing else touches the ball or the pin. Which statement gives the correct energy argument for what happened?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The ball gave energy to the pin: while the two were touching, the ball pushed forward on the pin, the pin went from standing still to moving quickly, and the ball slowed at that same moment, so the ball\'s kinetic energy went down as the pin\'s went up.', correct: true },
        { id: 'b', text: 'The ball handed the pin some of the force it had been carrying with it ever since it left the bowler\'s hand, and the ball is slower now because it has less of that stored-up force left inside it than it did before the hit.' },
        { id: 'c', text: 'The ball\'s kinetic energy was used up in the crash and no longer exists anywhere, and the pin\'s motion is new energy of its own that the pin got from being knocked off balance, so nothing passed from one object to the other.' },
        { id: 'd', text: 'The pin received energy from the ball, but the ball\'s own kinetic energy did not change at all, because the ball is still rolling forward afterward and an object that is still moving must still have all the energy of motion it set out with.' },
      ],
      expectedAnswer: 'The ball gave energy to the pin: while the two were touching, the ball pushed forward on the pin, the pin went from standing still to moving quickly, and the ball slowed at that same moment, so the ball\'s kinetic energy went down as the pin\'s went up.',
      hints: [
        'Take the two objects one at a time. What was the pin doing before the hit, and after it? What was the ball doing before, and after? For each one, say whether its kinetic energy went up or down.',
        'Then ask what was touching what, and when. Energy moves between two objects while one is pushing on the other -- and remember that a force is not a supply an object carries around and hands over in pieces.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-box-slides-to-a-stop',
      kind: 'try_yourself',
      problem:
        'A cardboard box is given one shove across a level wooden floor. It slides in a straight line, slows down and stops on its own, and nobody touches it after the shove. Afterwards the bottom of the box and the strip of floor it slid over are very slightly warmer than the floor on either side of that strip. Which statement gives the correct energy argument?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The box\'s kinetic energy was used up by the rubbing and no longer exists anywhere, and the slight warmth is a separate side effect of two rough surfaces scraping over each other -- the same warmth you feel when you rub your hands together while standing perfectly still -- so it has nothing to do with the motion the box lost.' },
        { id: 'b', text: 'The box gave energy away: friction from the floor pushed backward against its motion the whole way, so the box\'s kinetic energy went down, and that energy is now thermal energy in the box\'s bottom, in the strip of floor and in the air beside them, which is why those surfaces are warmer.', correct: true },
        { id: 'c', text: 'The shove you gave the box was stored inside it as a push that drained away a little at a time while it slid, and the box came to a stop at the exact moment the last of that stored-up push had finally run out, which is why a harder shove sends the same box farther across the same floor before it stops.' },
        { id: 'd', text: 'No energy was transferred to anything at all, because nothing started moving at the moment the box stopped, and energy only counts as having been transferred when whatever receives it can be seen to move afterward, and here both the box and the floor ended up standing perfectly still.' },
      ],
      expectedAnswer: 'The box gave energy away: friction from the floor pushed backward against its motion the whole way, so the box\'s kinetic energy went down, and that energy is now thermal energy in the box\'s bottom, in the strip of floor and in the air beside them, which is why those surfaces are warmer.',
      hints: [
        'The box lost all of its kinetic energy, and energy is never destroyed, so it has to be somewhere. What does the description say is different afterward from the way it was before?',
        'Name the pathway as well as the destination. What was touching the box the whole way along, and which direction did that push point compared with the direction the box was sliding?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tailwind-evidence',
      kind: 'try_yourself',
      problem:
        'A student coasting on a skateboard along a flat, straight path on a windy day, with a strong wind blowing from behind, notices that they speed up without pushing off the ground even once. They argue: "The moving air gave energy to me and my board." Which described observation is the strongest evidence for that argument?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The board has smooth, well-oiled wheels, and a board with smooth wheels rolls more easily than one with stiff, dirty wheels, so this board was always going to be the quickest thing on that path.' },
        { id: 'b', text: 'The student and the board together have less mass than most of the other riders on the path, and an object with less mass is easier to speed up than one with more, so their low mass is what produced the extra speed.' },
        { id: 'c', text: 'On a calm day, coasting along the same flat path on the same board without pushing, the student only ever slows down; the speeding up happens on the windy day and never on the calm one.', correct: true },
        { id: 'd', text: 'The wind went on blowing just as hard long after the student had reached the end of the path, which shows that the moving air still had plenty of energy left over in it that it could have given away.' },
      ],
      expectedAnswer: 'On a calm day, coasting along the same flat path on the same board without pushing, the student only ever slows down; the speeding up happens on the windy day and never on the calm one.',
      hints: [
        'The argument names the air as the giver. The strongest evidence for a giver is what happens when you take it away. Which of these observations describes the same ride with the wind removed and everything else kept the same?',
        'Test each observation with one question: would it still be true even if no energy had moved from the air to the skater? Anything that would still be true either way is not evidence for this claim.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-used-up-and-force-handed-over',
      kind: 'misconception_check',
      question:
        'A student writes: "When I braked hard to stop at the corner, my bike\'s energy of motion was used up by the brakes and is gone. And when a moving ball hits a ball that is standing still, the moving ball gives it some of its force." Two different things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The bike\'s energy of motion was used up by the brakes and is gone.',
          misconception:
            'Treating energy as a supply that gets spent and finishes, because from the outside the motion really does disappear and nothing obvious appears in its place.',
          correctsTo:
            'Energy is never used up, made or destroyed. It moves from one object to another and changes from one form to another, and that is all it ever does. The bike\'s energy of motion went into the brake pads, the wheel rim and the air right beside them, which are warmer after the braking than they were before. That warmth is the receipt. The reason this is so easy to miss is that thermal energy spread through a lot of material does not look like anything, while a moving bike obviously does, so the energy seems to have stopped existing at the moment it stopped being visible. The test that settles it is to take the receiver out of the story: coast along the same flat road without touching the brakes, and the rim stays cool while the bike keeps almost all of its speed. The warmth appears exactly when, and only when, the speed goes away. WRONG: "The brakes used the energy up." CORRECT: "The brakes moved the energy into the pads, the rim and the air, where it is now thermal energy."',
        },
        {
          answer: 'The moving ball gives the still ball some of its force.',
          misconception:
            'Treating a force as a possession -- a supply of push that a moving object carries along with it and can hand over a share of on contact -- rather than as an interaction that exists only while two objects are acting on each other.',
          correctsTo:
            'A force is a push or a pull between two objects, and it lasts exactly as long as the interaction lasts. While the two balls are touching, the first pushes on the second; the instant they come apart that push is over, and neither ball is carrying it anywhere. What a moving object HAS is kinetic energy, and kinetic energy is what changes hands: the first ball slows because energy left it, and the second ball speeds up because that energy arrived. Saying it correctly also makes the direction easy to read, because a push along the motion means energy arriving and a push against the motion means energy leaving, and a possession that gets handed over has no direction to read at all. WRONG: "The first ball gave the second ball some of its force." CORRECT: "While they were touching, the first ball pushed on the second, and along that push energy moved from the first ball to the second."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An object\'s kinetic energy changes only when another object pushes or pulls on it. It never rises or falls on its own, so a change in motion is evidence that a second object was involved.',
        'A push along the direction of motion speeds an object up, so that object RECEIVED energy. A push against the motion slows it down, so that object GAVE energy away.',
        'Slowing down is a transfer just as much as speeding up is. The energy leaves instead of arriving.',
        'The force is the pathway and energy is what travels along it. A force is not something an object carries and hands over; it exists only while the two objects are acting on each other.',
        'Energy is never used up. When a moving object slows, the energy it lost is somewhere you can name: moving in another object, or making rubbing surfaces and the air beside them warmer.',
        'The argument in four moves: name the object and whether its kinetic energy went up or down; name the other object pushing or pulling on it and which way; say who gave, who received, and where the energy is now; then remove or change that other object and check that the change in motion moves with it.',
        'A collision passes energy along the push the two objects put on each other while they touch, and a small share of it usually leaves as the sound you hear.',
        'Giving energy away does not leave an object empty, and an object moving at a steady speed in a straight line is neither gaining nor losing kinetic energy.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'When Motion Changes, Energy Is Transferred' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
