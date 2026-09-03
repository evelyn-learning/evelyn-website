/**
 * Grade 8 Science (Physical Science) — Newton's Second Law: Force, Mass &
 * Acceleration.
 *
 * PROCEDURE-LED row for the m8sci fan-out (NGSS MS-PS2-2). The previous
 * lesson ended where the net force is zero and the motion does not change.
 * This one starts the instant the net force is not zero, and it is the first
 * row in the course where a student turns a handle: two numbers in, one
 * number out, with a unit attached that is easy to get wrong. So the whole
 * lesson is one short routine -- write down what you are given with its
 * unit, name the quantity you are missing, multiply or find the missing
 * factor, write the answer with the right unit, then check the size of the
 * answer against the rule -- plus the same routine run without numbers, as a
 * comparison of how many TIMES, and then run backward as a plan for a test.
 *
 * The three traps it is built to kill are (a) the unit trap, where an
 * acceleration is reported as "5 meters per second" and nobody hearing it
 * can tell that it is wrong; (b) the direction trap, where the two given
 * numbers are multiplied when a missing factor was wanted, or divided the
 * wrong way round; and (c) the difference-versus-ratio trap, where a suitcase
 * with 16 kilograms more mass is said to speed up sixteen times less.
 *
 * SCOPE GUARD: this plan predicts how an object's acceleration changes when
 * the net force or the mass changes, applies force equals mass times
 * acceleration (F = m × a) forward with small whole numbers, and plans a
 * fair test of the relationship. Its scope cell's lineage and withheld
 * clauses, verbatim: "the fair-test vocabulary is Grade 7's
 * `m7sci-u1-variables-and-controls.ts`, LO description read, not re-taught
 * here"; "Withholds rearranging F = ma algebraically for unknown mass and
 * any two-dimensional case (`ap-physics-newtons-second-deep.ts`)." What that
 * means at each edge, and what is deliberately ALLOWED there:
 *   - NEWTON'S FIRST LAW is row 2.1, immediately before this one, and is
 *     assumed rather than re-taught. This file states the zero-net-force
 *     case in one clause, as the hinge into its own rule, and uses the word
 *     "inertia" exactly once in its authored prose (concept key idea 1,
 *     naming the link back; the word also appears in the previous row's
 *     loId, which is a machine identifier and is not spoken).
 *     It does not re-derive why a rolling ball stops, does not teach
 *     friction or air resistance as forces in their own right, and never
 *     repeats the seatbelt example. Friction appears in exactly three
 *     roles, all of them in service of the net force rather than of
 *     friction itself: it is already counted inside a stated net force; a
 *     floor or surface is held the same between trials because a different
 *     one would change it; and, in the misconception check, it is what
 *     cancels a gentle push on a heavy crate so that the net force is zero.
 *   - FORCES AND NET FORCE are row 1.4 and are also assumed: every force in
 *     this file is handed to the student as a NET force along one line, and
 *     no item adds two forces together to get it. VELOCITY AND ACCELERATION
 *     are row 1.3: this file restates in one sentence that acceleration
 *     covers slowing down and turning as well, then works only with objects
 *     speeding up in a straight line, and it never writes acceleration as a
 *     change in velocity divided by a time.
 *   - NEWTON'S THIRD LAW is row 2.3 and COLLISION SAFETY is row 2.4. No
 *     force in this file has a partner force named, the words "action" and
 *     "reaction" appear nowhere in its authored prose (only inside the next
 *     row's loId), and no collision, crumple zone, airbag, helmet or padding
 *     is described or evaluated. GRAVITY, MASS AND WEIGHT
 *     are row 3.1: nothing in this file falls, no force here is a weight,
 *     no mass is converted into newtons, and every net force described is
 *     horizontal along a level surface.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, plate,
 *     current or weather system appears anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The fair-test lesson (planning a test by
 *     changing one thing and holding the rest fixed) is Grade 7's, and it is
 *     used here as something the student already holds: this file says
 *     "change one thing and keep everything else the same" in plain words
 *     and never names an independent, dependent or controlled variable, a
 *     hypothesis, or a testable question.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): the rule is applied FORWARD only. Where the
 *     acceleration is the unknown, it is found as the missing factor -- what
 *     number multiplied by the mass gives the force -- and the file never
 *     writes a rearranged formula of any kind. The specific things it stops
 *     short of are solving F = m × a for an unknown MASS, writing
 *     acceleration as a change in velocity divided by a time, any force at
 *     an angle or in two dimensions, any vector, arrow or free-body diagram,
 *     and momentum, impulse and work; all of those are
 *     `ap-physics-newtons-second-deep.ts` and
 *     `ap-physics-c-mech-energy-momentum.ts`.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every force
 * in this file is written out in words as a net force with its size, its
 * unit and its direction, and every item is solvable from the text printed
 * inside it. Never write "see the force diagram", and never assume the
 * student has a cart, a track, a stopwatch or a spring scale in front of
 * them. Every quantity carries its unit in words, and the unit of an
 * acceleration is "meters per second each second" -- the single easiest
 * thing in this row to drop.
 *
 * NOTE ON LABELS (contract rulings 26 and 28): this file uses bare
 * "WRONG:"/"CORRECT:" for statements that are genuinely false about the
 * physical world (an acceleration reported in meters per second; three times
 * the mass said to give three times the acceleration), and the variant
 * "WRONG FOR THIS TEST:"/"RIGHT FOR THIS TEST:" in the second worked
 * example's investigation step, where the specimens are experimental PLANS
 * rather than false claims -- "push harder each time" is not an untrue
 * sentence, it is a plan that cannot answer the question. A reviewer's grep
 * must therefore be `grep -E 'WRONG|RIGHT FOR|CORRECT:'`, since the variant
 * label does not contain the substring "WRONG:".
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.1 -> 2.2 ->
 * 2.3 (`newtons-first-law-inertia-and-friction` ->
 * `newtons-second-law-force-mass-and-acceleration` ->
 * `newtons-third-law-action-reaction-pairs`), and both arrays carry those
 * real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U2_NEWTONS_SECOND_LAW_FORCE_MASS_AND_ACCELERATION: LessonPlan = {
  id: 'evelyn.ms.m8sci.newtons-second-law-force-mass-and-acceleration.v1',
  title: 'Newton\'s Second Law: Force, Mass & Acceleration',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.newtons-second-law-force-mass-and-acceleration',
      standard: 'M8SCI-2.2',
      description:
        'Predict how an object\'s acceleration changes when the net force or the mass changes (more force means more acceleration; more mass means less acceleration for the same force), apply force equals mass times acceleration (F = m × a) with small whole numbers (10 newtons on 2 kilograms gives 5 meters per second each second), and plan a fair-test investigation of the relationship -- which variable to change, which to hold fixed (NGSS MS-PS2-2).',
    },
  ],
  prerequisites: ['m8sci.newtons-first-law-inertia-and-friction'],
  followUps: ['m8sci.newtons-third-law-action-reaction-pairs'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Take the two knobs the student has already felt -- how hard the push is, and how much is being pushed -- and turn them into a question with a number in the answer.',
      script:
        'You have pushed someone across a smooth floor on a wheeled chair. Give a friend a gentle shove and they drift away slowly. Plant your feet and shove hard, and the same friend goes off much faster. Nothing about the friend changed. Only your push did. Now swap the person in the chair for someone with a lot more mass and give exactly the same shove you gave the first time. They pick up speed far more slowly, and this time it is your push that stayed the same and the mass that changed. So there are two separate handles on how quickly something gets moving, and you have had your hands on both of them. In the last lesson you found out what happens when the forces on an object add to zero: nothing changes. Today is the other case. When they do not add to zero, the motion changes, and the two handles decide how fast it changes. By the end of this lesson you will be able to put a number on it -- a real number, in newtons and kilograms, with an answer in meters per second each second -- and you will be able to plan a test that finds out which handle you are actually turning.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-second-law-routine',
      kind: 'concept',
      goal: 'Install the rule with its units, the five-step routine for a number question, the comparison routine for a question with no numbers, the shape of a fair test of the rule, and the two traps before they are met.',
      keyIdeas: [
        'TWO THINGS, AND ONLY TWO THINGS, DECIDE HOW QUICKLY AN OBJECT SPEEDS UP. The first is the size of the NET force on it -- the one force left over after every push and pull along the line has been added together. The second is its mass. A bigger net force on the same object changes its motion more quickly. The same net force on an object with more mass changes its motion less quickly. That second half is the loaded-chair puzzle from the hook, and the previous lesson gave it a name: inertia, which grows with mass. Newton\'s second law is what turns that name into a number. Notice what is NOT on the list: the object\'s color, its shape, how long it has been moving, and how fast it is already going. None of them appear in the rule. Anything the object\'s shape does to the air pushing back on it has already been counted, because it was counted when the net force was worked out.',
        'THE RULE, IN WORDS FIRST AND THEN IN SYMBOLS. Force equals mass times acceleration (F = m × a). The force is the net force on the object, measured in newtons. The mass is measured in kilograms. The acceleration is measured in meters per second each second, which is also written as meters per second squared, and it means the amount the speed changes in every single second. A net force of 8 newtons on a mass of 2 kilograms gives an acceleration of 4 meters per second each second, because 2 times 4 is 8. Say that unit out loud until it feels normal, because it is the thing this lesson is easiest to get wrong. WRONG: "The acceleration is 4 meters per second." CORRECT: "The acceleration is 4 meters per second each second." Meters per second is how fast something is going. Meters per second each second is how much faster it is getting every second, and those are two different quantities with two different units.',
        'THE ROUTINE FOR A QUESTION WITH NUMBERS IN IT, IN ORDER. (1) Write down what you are given, each with its unit, and make sure the force you have is the NET force. (2) Name the quantity you are missing. (3) If the missing quantity is the force, multiply the mass by the acceleration. If the missing quantity is the acceleration, ask what number multiplied by the mass gives the force -- that number is the acceleration. (4) Write the answer with its unit: newtons for a force, meters per second each second for an acceleration. (5) Check the size of your answer against the rule before you accept it. A big net force on a small mass should come out large; a small net force on a big mass should come out small. If your answer runs the other way, you have multiplied where you needed a missing factor, or divided the two numbers the wrong way round.',
        'THE ROUTINE FOR A QUESTION WITH NO NUMBERS IN IT: COMPARE BY HOW MANY TIMES. Hold one handle still and turn the other. Keep the mass the same and double the net force, and the acceleration doubles. Keep the mass the same and halve the net force, and the acceleration halves. Now the other handle: keep the net force the same and make the mass three times as big, and the acceleration becomes one third of what it was. Keep the net force the same and make the mass four times as big, and the acceleration becomes one quarter. The comparison is always how many TIMES bigger, never how many kilograms bigger. A cart carrying 10 kilograms more than another one tells you nothing on its own, because 10 kilograms more is almost everything to a small cart and almost nothing to a huge one; what decides is how many times the mass is.',
        'PLANNING A TEST OF THE RULE. You already know how to plan a fair test: change one thing, keep everything else the same, and run it more than once. Put that to work here. To find out how MASS changes the way something speeds up, add a known mass to the same cart for each trial, and keep the push the same size and in the same direction every time, on the same floor, measured the same way. To find out how the NET FORCE changes it, do the opposite: keep the same cart with the same load in it, and change only the size of the push. Changing both at once is the mistake that ruins the whole test, because when the result comes out you cannot say which change produced it. Keeping the floor the same matters for the same reason: a different surface changes the friction, and the friction is part of the net force.',
        'TWO TRAPS TO WATCH FOR. First trap: the rule is about the NET force, not about one of the pushes. If a crate is pushed forward with a force and the floor rubs backward on it, the number that goes into the rule is what is left after both have been counted. A push that is completely cancelled leaves a net force of zero, and then the motion does not change at all, however hard the pushing looks. Second trap: acceleration is not speed. A large net force does not mean the object is going fast; it means the object\'s speed is changing quickly, and an object that has only just started moving can have a huge acceleration and almost no speed. And while every example in this lesson is an object speeding up in a straight line, acceleration means ANY change in velocity, so the same rule covers slowing down and turning too.',
      ],
      vocabulary: [
        { term: 'Newton\'s second law', definition: 'the net force on an object equals its mass times its acceleration, so a bigger net force gives a bigger acceleration and a bigger mass gives a smaller one.' },
        { term: 'acceleration', definition: 'how much an object\'s velocity changes each second, measured in meters per second each second.' },
        { term: 'net force', definition: 'the single force left over when all the forces on one object are added together, taking their directions into account.' },
        { term: 'mass', definition: 'the amount of matter in an object, measured in kilograms; the more mass an object has, the less it accelerates for a given net force.' },
        { term: 'newton', definition: 'the unit of force. A net force of 1 newton gives a mass of 1 kilogram an acceleration of 1 meter per second each second.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cart-both-directions',
      kind: 'worked_example',
      problem:
        'A cart with a mass of 2 kilograms sits on a long, level floor. Someone pushes it forward, and after the rubbing of the floor has been counted the net force on the cart along its line of motion is 10 newtons, pointing forward. Part one: what is the cart\'s acceleration? Part two: the same 2 kilogram cart is to be given an acceleration of 3 meters per second each second instead. What net force does that take?',
      steps: [
        'Part one, step 1. Write down what you are given, each with its unit. The mass is 2 kilograms. The net force is 10 newtons forward, and the problem says it is the net force, so the rubbing of the floor is already inside that number and there is nothing left to subtract.',
        'Part one, step 2 and step 3. The missing quantity is the acceleration, so ask the missing-factor question: what number multiplied by 2 kilograms gives 10 newtons? 10 divided by 2 is 5, so that number is 5. Step 4, write it with the right unit: the acceleration is 5 meters per second each second. WRONG: "The acceleration is 5 meters per second." CORRECT: "The acceleration is 5 meters per second each second." The cart is not traveling at 5 meters per second; it is gaining 5 meters per second of speed in every second that the net force keeps acting.',
        'Part one, step 5, check the size. Turn the rule back the way it was written and multiply: 2 kilograms times 5 meters per second each second is 10 newtons, which is the net force we started with, so the answer fits the rule it came from.',
        'Part two. Now the acceleration is the quantity you are given and the net force is the one you are missing, which is the easier direction: multiply the mass by the acceleration. 2 kilograms times 3 meters per second each second is 6 newtons. Check the size against the rule before accepting it. The wanted acceleration, 3 meters per second each second, is smaller than the 5 meters per second each second of part one, and the mass has not changed, so the force should come out smaller than 10 newtons. It does: 6 newtons is smaller than 10 newtons.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree on part one. The arithmetic agrees with itself in both directions: 10 divided by 2 is 5, and 2 times 5 is 10 again. The unit agrees: a force in newtons divided by a mass in kilograms leaves an answer in meters per second each second, which is what an acceleration is measured in, so the answer is the right KIND of quantity and not a speed. And the size agrees with the rule in words: 10 newtons is a fairly large net force and 2 kilograms is a small mass, so a large acceleration is what the rule says to expect, and 5 meters per second each second is large.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Keep the same 10 newtons of net force and put it on a cart of 10 kilograms instead of 2 kilograms. The mass is now 5 times as big, so the acceleration should come out one fifth as big. Work it: what number multiplied by 10 kilograms gives 10 newtons? 10 divided by 10 is 1, so the acceleration is 1 meter per second each second, and 5 divided by 5 is 1, exactly as predicted. The answer moved when the mass moved, and it moved by the right factor.',
      ],
      answer:
        'Part one: the acceleration is 5 meters per second each second, because 10 divided by 2 is 5, and multiplying back gives 2 kilograms times 5 meters per second each second equals 10 newtons. Part two: the net force needed is 6 newtons, because 2 kilograms times 3 meters per second each second is 6 newtons. With the same 10 newtons acting on a 10 kilogram cart instead, the acceleration would be 1 meter per second each second -- five times the mass, one fifth the acceleration.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-loads-and-a-fair-test',
      kind: 'worked_example',
      problem:
        'A cart is pushed along a level gym floor with a steady net force of 60 newtons, pointing the way it is already going. Empty, the cart and its wheels have a mass of 20 kilograms. Loaded with boxes, the cart has a mass of 60 kilograms. Part one: find the acceleration in each case and say how they compare. Part two: a student wants to test the rule that mass changes how quickly a cart speeds up. Describe the test.',
      steps: [
        'Part one, the empty cart. Given: a mass of 20 kilograms and a net force of 60 newtons. Missing: the acceleration. What number multiplied by 20 kilograms gives 60 newtons? 60 divided by 20 is 3, so the acceleration is 3 meters per second each second. Multiply back to check: 20 kilograms times 3 meters per second each second is 60 newtons.',
        'Part one, the loaded cart. Given: a mass of 60 kilograms and the same net force of 60 newtons. What number multiplied by 60 kilograms gives 60 newtons? 60 divided by 60 is 1, so the acceleration is 1 meter per second each second. Multiply back to check: 60 kilograms times 1 meter per second each second is 60 newtons.',
        'Part one, the comparison, done by how many times. The loaded cart has 60 kilograms of mass against the empty cart\'s 20 kilograms, and 60 divided by 20 is 3, so its mass is three times as big. Its acceleration is 1 meter per second each second against 3 meters per second each second, which is one third as big. Three times the mass, one third of the acceleration, with the net force held the same. WRONG: "The loaded cart has 40 kilograms more mass, so it speeds up 40 times more slowly." CORRECT: "The loaded cart has three times the mass, so it speeds up one third as quickly." The comparison is always how many times, never how many kilograms more.',
        'Part two, the test. The thing being changed is the mass, so the mass is the only thing allowed to change. Use the same cart every trial, on the same gym floor, and give it the same size push in the same direction each time -- so the net force stays 60 newtons -- while adding one more box of a known mass for each trial and recording how quickly the cart speeds up. Run each trial more than once and compare the results.',
        'Part two, what would ruin it. Neither plan below is a false statement about the world -- each one is simply a plan that cannot answer the question, so each is labeled for the test it fails rather than for being untrue. WRONG FOR THIS TEST: "Push harder each time, because the heavier cart needs a bigger push to get going." That plan changes the mass AND the net force in the same trial, so when the cart speeds up more slowly you cannot say whether the mass did it or the push did. WRONG FOR THIS TEST: "Judge the first trial by eye and time the later ones carefully." That plan changes how the result is measured partway through, so a difference between the trials might be nothing more than a difference between the two ways of measuring. RIGHT FOR THIS TEST: "Same cart, same floor, same size push in the same direction, one more box each trial." Only the mass moves, so only the mass can explain the result.',
        'Now run the two checks. First, three clues of DIFFERENT KINDS agree that the loaded cart speeds up one third as quickly. The arithmetic says so: 60 divided by 20 is 3 and 60 divided by 60 is 1. The rule in words says so: the same net force on more mass gives less acceleration, and this is more mass. And multiplying back says so from the other end: 60 kilograms times 1 meter per second each second is 60 newtons, the same force the empty cart got, which is only possible if the bigger mass is paired with the smaller acceleration. Second, change one thing and check that the answer moves. Put the boxes back on the floor so the mass is 20 kilograms again, and this time push twice as hard, for a net force of 120 newtons. What number multiplied by 20 kilograms gives 120 newtons? 120 divided by 20 is 6, so the acceleration is 6 meters per second each second, which is twice the 3 meters per second each second the empty cart had before. Double the net force on the same mass, double the acceleration -- the other handle, turned on its own.',
      ],
      answer:
        'The empty cart accelerates at 3 meters per second each second (60 divided by 20 is 3) and the loaded cart at 1 meter per second each second (60 divided by 60 is 1). The loaded cart has three times the mass, so with the same net force it speeds up one third as quickly. To test that fairly, change only the mass: same cart, same floor, same size push in the same direction, one more known mass added each trial, repeated. Doubling the push on the empty cart instead, to 120 newtons, would double its acceleration to 6 meters per second each second.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-wagon-acceleration',
      kind: 'try_yourself',
      problem:
        'A wagon rolls along a level path. The wagon has a mass of 4 kilograms, and the net force on it along the path is 12 newtons, pointing forward. Which statement correctly gives the wagon\'s acceleration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It speeds up by 3 meters per second each second, because 3 is the number that gives 12 newtons when it is multiplied by the mass of 4 kilograms.', correct: true },
        { id: 'b', text: 'It speeds up by 48 meters per second each second, because 12 newtons and 4 kilograms are the two numbers you are given, and the rule says force and mass are multiplied together.' },
        { id: 'c', text: 'It travels at 3 meters per second, because dividing the 12 newtons by the 4 kilograms tells you how fast the wagon is moving along the path.' },
        { id: 'd', text: 'It speeds up by one third of a meter per second each second, because the 4 kilograms of mass is divided by the 12 newtons of force to share the push out over the wagon.' },
      ],
      expectedAnswer: 'It speeds up by 3 meters per second each second, because 3 is the number that gives 12 newtons when it is multiplied by the mass of 4 kilograms.',
      hints: [
        'You are given a mass and a net force, so the missing quantity is the acceleration. Ask the missing-factor question: what number multiplied by 4 kilograms gives 12 newtons?',
        'Then check two things before you pick. Does your answer multiply back to 12 newtons? And is its unit the unit of an acceleration -- meters per second each second -- rather than the unit of a speed?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-suitcase-comparison',
      kind: 'try_yourself',
      problem:
        'An empty rolling suitcase has a mass of 4 kilograms. Packed for a trip, the same suitcase has a mass of 20 kilograms. Each one is pulled along the same smooth floor by a steady net force of 8 newtons, pointing the way it is already going. How do the two accelerations compare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The packed suitcase speeds up more, because it has far more mass moving along with the pull, and that extra mass adds to the pull and helps carry the suitcase forward.' },
        { id: 'b', text: 'The empty suitcase speeds up five times as much each second, because it has one fifth of the mass and the net force pulling it is exactly the same.', correct: true },
        { id: 'c', text: 'They speed up by the same amount each second, because the net force on each suitcase is 8 newtons, and how quickly a thing speeds up is set by the force acting on it alone.' },
        { id: 'd', text: 'The empty suitcase speeds up sixteen times as much each second, because the packed suitcase is carrying 16 kilograms more mass than the empty one is.' },
      ],
      expectedAnswer: 'The empty suitcase speeds up five times as much each second, because it has one fifth of the mass and the net force pulling it is exactly the same.',
      hints: [
        'The net force is the same for both, so only the mass is doing anything here. Compare the two masses by how many times, not by how many kilograms: how many 4 kilograms fit into 20 kilograms?',
        'With the net force held still, more mass gives less acceleration by exactly that factor. If one suitcase has five times the mass of the other, what fraction of the acceleration does it get?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plan-the-fair-test',
      kind: 'try_yourself',
      problem:
        'A student wants to find out how the mass of a cart changes how quickly the cart speeds up. For her first trial she gives the empty cart one push along a smooth floor and records how quickly it speeds up. For her second trial she puts a heavy block in the cart, moves it onto the carpet so that it will not roll so far, and pushes harder so that the loaded cart will still get going. She records how quickly it speeds up again, and the two results are different. What is wrong with her plan?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing is wrong with it, because she changed the mass between the two trials and recorded how quickly the cart sped up in each one, which is the comparison the question asks for.' },
        { id: 'b', text: 'She should have kept the mass the same in both trials, because the mass is the thing she is trying to find out about and the thing you are studying has to be held still while you test it.' },
        { id: 'c', text: 'Three things changed between the trials -- the mass, the surface and the size of the push -- so when the two results come out different she cannot say which of the three changes produced the difference.', correct: true },
        { id: 'd', text: 'She only ran each setup once, and a single trial each way can never show anything, so the plan would have worked perfectly well if she had simply repeated both trials several times.' },
      ],
      expectedAnswer: 'Three things changed between the trials -- the mass, the surface and the size of the push -- so when the two results come out different she cannot say which of the three changes produced the difference.',
      hints: [
        'Go through her second trial one step at a time and list everything that is different from the first trial. The mass is one of them. Is it the only one?',
        'A different surface rubs against the wheels differently, and a harder push is a bigger force -- and the friction and the push are both part of the net force. What does that do to a result you were hoping to blame on the mass alone?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-force-speed-and-small-forces',
      kind: 'misconception_check',
      question:
        'A student writes: "If you push twice as hard, the cart ends up going twice as fast, and that is what the second law says. And a small net force on a really heavy cart does nothing at all, because the cart is too heavy for it." Two different things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Pushing twice as hard makes the cart end up going twice as fast, and that is what the second law says.',
          misconception:
            'Reading the acceleration in the rule as if it were the speed, because in everyday talk "it goes faster when you push harder" covers both ideas at once and nobody has ever had to separate them.',
          correctsTo:
            'Force equals mass times acceleration (F = m × a), and acceleration is how much the speed changes each second, not the speed itself. Doubling the net force on the same cart doubles the ACCELERATION: a cart that was gaining 3 meters per second of speed every second now gains 6 meters per second every second. How fast it ends up going depends on that and on how long you keep pushing. Push the smaller force for twice as long and you can end up at the same speed. WRONG: "Twice the force means twice the final speed." CORRECT: "Twice the net force means the speed climbs twice as quickly, and the final speed also depends on how long the force acts."',
        },
        {
          answer: 'A small net force on a really heavy cart does nothing at all, because the cart is too heavy for it.',
          misconception:
            'Treating mass as a barrier with a threshold that a force has to get over before anything happens, because in real life a light push on a heavy crate genuinely does not move it.',
          correctsTo:
            'There is no threshold in the rule. Any net force that is not zero produces an acceleration, and on a large mass it is simply a small one -- the cart does speed up, just very gradually, and it keeps speeding up for as long as the net force acts. The everyday experience is real, but the reason is different: a gentle push on a heavy crate is usually cancelled by the friction from the floor, so the NET force is zero, and a net force of zero is the only case in which nothing changes. Take the friction away and the same gentle push gets the crate moving. WRONG: "It is too heavy for that force." CORRECT: "The force was cancelled by friction, so the net force was zero. A small net force that is not cancelled gives a small acceleration, not none."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Newton\'s second law: force equals mass times acceleration (F = m × a). The force in the rule is always the NET force on the object.',
        'A bigger net force on the same mass gives a bigger acceleration. The same net force on a bigger mass gives a smaller acceleration.',
        'Force is measured in newtons, mass in kilograms, and acceleration in meters per second each second. Meters per second is a speed; meters per second each second is how much that speed changes every second.',
        'To find a force, multiply the mass by the acceleration. To find an acceleration, ask what number multiplied by the mass gives the force.',
        'Always check the size of your answer against the rule: a big force on a small mass gives a big acceleration, and a small force on a big mass gives a small one.',
        'Compare by how many TIMES, never by how many kilograms more. Three times the mass with the same net force gives one third the acceleration; five times the mass gives one fifth.',
        'Acceleration is not speed. A large net force means the speed is changing quickly, not that the object is moving quickly.',
        'A net force that is not zero always produces some acceleration, however heavy the object is. Only a net force of zero leaves the motion unchanged.',
        'To test what mass does, change only the mass: same cart, same floor, same size push in the same direction, one known mass added each trial, repeated.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Newton\'s Second Law: Force, Mass & Acceleration' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
