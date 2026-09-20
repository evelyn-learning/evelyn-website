/**
 * Grade 8 Science (Physical Science) — Kinetic Energy: Mass & Speed.
 *
 * PROCEDURE-LED row for the m8sci fan-out (NGSS MS-PS3-1). The student is
 * handed a record of trials written out in words and has to get two
 * relationships out of it, one of which is the single most-generated wrong
 * ratio in the course. So the whole lesson is one short routine -- read each
 * trial with its units, find the pair that differs in ONE thing only,
 * compare that one thing by how many TIMES rather than by how much bigger,
 * then apply the matching rule (the mass factor goes straight through; the
 * speed factor is multiplied by itself) and, where both changed, multiply
 * the two contributions together.
 *
 * The three traps it is built to kill are (a) double-the-speed-double-the-
 * energy, which is the headline error of this row and is what almost every
 * student arrives with; (b) subtracting when the comparison wants a
 * division, so that a rise of 4 meters per second is read as a factor of
 * four; and (c) the mirror of the first trap running the other way --
 * squaring the MASS factor, which nothing in this course ever does.
 *
 * SCOPE GUARD: this plan reads a described record of trials and states how
 * much kinetic energy an object has RELATIVE to another one -- twice,
 * three times, four times, nine times, eight times -- and never how much it
 * has. Its scope cell's withheld clause, verbatim: "Withholds computing
 * KE = ½mv² in joules (`g8-sci-forces-energy.ts` does this; declined —
 * see quantitative ceiling) and momentum." (The cell carries no lineage
 * clause; this row has no `m6*`/`m7*` predecessor to name.) What that means
 * at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 3.4 (fields) is the previous row and is not
 *     touched: the words "field", "force" and "gravity" appear nowhere in
 *     this file's authored prose, and nothing here acts across a distance.
 *     (They do occur inside the previous row's loId in `prerequisites`,
 *     which is a machine identifier and is not spoken.) Row 4.2 (potential
 *     energy stored by position) is named in exactly one place -- the
 *     closing sentence of the second misconception correction, to say that
 *     whether a still object stores energy in other ways is the next lesson
 *     -- and this file never ranks an arrangement by how much it stores, no
 *     raised object, stretched spring or pair of magnets appears in it, and
 *     the phrase "potential energy" does not occur in the body at all (the
 *     next row's loId in `followUps` carries it hyphenated, as a machine
 *     identifier that is not spoken). The word "stretch" does appear once,
 *     meaning a stretch of snow a sled crosses. Row 4.3
 *     (transformations and conservation) is not entered: no energy in this
 *     file changes form, nothing is traced through a chain, the word
 *     "conserved" does not appear, and no energy is said to end up as
 *     thermal energy. Row 4.4 (energy transferred when motion changes) is
 *     not entered either: no object in this file gives energy to another
 *     one, and no giver or receiver is ever identified. Row 2.2 owns
 *     force equals mass times acceleration; that relationship is never
 *     written here in words or in symbols, and the words "force",
 *     "acceleration" and "newton" do not occur anywhere in the body (only
 *     here, in this doc comment, saying so), so no item can be answered by
 *     reaching for it. Row 1.1
 *     owns speed from a distance and a time: every speed in this file is
 *     handed to the student in meters per second, and no speed here is
 *     computed from a distance and a time. The divisions this file does
 *     perform are comparisons of two speeds or two masses, which produce a
 *     factor and not a quantity.
 *   - QUANTITIES AND UNITS. Mass is always in kilograms and speed always in
 *     meters per second, both in words. Energy is never given a unit,
 *     because every energy statement in this file is a comparison ("four
 *     times Trial 1's") rather than an amount. No joule appears. No formula
 *     of any kind is written in the body -- not the three this course
 *     allows, and not the one it forbids; the only formula named anywhere in
 *     the file is the withheld one, quoted in this doc comment.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. There is no orbit, planet,
 *     plate, current, weather system or water cycle in this file; the only
 *     snow in it is a surface a sled crosses.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The people in it -- a rider on a scooter,
 *     a club running trials -- are there only as movers of objects, and
 *     nothing about a living system is taught or assessed. The
 *     hold-everything-else-still idea appears in plain words only: the
 *     phrases "fair test" and "hypothesis" do not occur, and no variable is
 *     named independent, dependent or controlled.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the formula this row
 *     stops short of is kinetic energy as one half of the mass times the
 *     speed multiplied by itself, which is never written here in either
 *     form and belongs to `ap-physics-c-mech-energy-momentum.ts`. Also
 *     stopped short of, in the same direction: any kinetic energy stated in
 *     joules, momentum, impulse, work as force times distance, and stored
 *     energy computed from a mass and a height. No chemistry surface exists
 *     in this row and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every trial
 * record in this file is written out in words inside the item -- mass with
 * its unit, speed with its unit, and the energy as a comparison -- and every
 * item is solvable from the text printed inside it. Never write "read the
 * table below", and never assume the student has a cart, a track, a sled or
 * a stopwatch in front of them.
 *
 * NOTE ON LABELS (contract rulings 26 and 28): every specimen labeled in
 * this file is a claim that is genuinely false about the physical world -- a
 * speed difference read as an energy factor, two doublings added instead of
 * multiplied, a parked truck credited with energy of motion -- so this file
 * uses the bare "WRONG:"/"CORRECT:" pair throughout and no variant label. A
 * reviewer's `grep 'WRONG:'` finds all of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.4 -> 4.1 ->
 * 4.2 (`fields-forces-without-contact` -> `kinetic-energy-mass-and-speed` ->
 * `potential-energy-and-position`), and both arrays carry those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U4_KINETIC_ENERGY_MASS_AND_SPEED: LessonPlan = {
  id: 'evelyn.ms.m8sci.kinetic-energy-mass-and-speed.v1',
  title: 'Kinetic Energy: Mass & Speed',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.kinetic-energy-mass-and-speed',
      standard: 'M8SCI-4.1',
      description:
        'Interpret a data table to describe how kinetic energy depends on mass (double the mass gives double the energy) and on speed (double the speed gives FOUR times the energy), and choose the correct comparison for objects (a tennis ball versus a wiffle ball at the same speed; a bike at 2 meters per second versus 4 meters per second) (NGSS MS-PS3-1).',
    },
  ],
  prerequisites: ['m8sci.fields-forces-without-contact'],
  followUps: ['m8sci.potential-energy-and-position'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use two catches the student would already refuse to make -- the fast one and the heavy one -- so that "how much is in that motion" arrives as a question with two knobs on it.',
      script:
        'You have caught a ball tossed gently across a room with one hand and barely thought about it. Now picture the same ball coming off the hardest swing anyone you know can make, straight at that same hand. Nothing about the ball changed. Nothing about your hand changed. You would still get it out of the way. Now leave the speed alone and change the other thing instead: keep the slow, gentle, walking pace, but make it a bowling ball rolling along the floor toward your foot. You would move that foot too, and the thing is barely moving. So the same question -- how much is in this motion, and how much will it take to stop it -- has exactly two knobs on it. One is how much mass is moving. The other is how fast that mass is going. Today you find out what each knob is worth, and one of the two answers catches almost everybody out: the speed knob is worth far more than the mass knob, and there is an exact amount by which that is true.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-knobs-and-the-routine',
      kind: 'concept',
      goal: 'Define kinetic energy, install the mass rule and the speed rule with their exact factors, hand over the four-step routine for reading a record of trials, and set the divide-do-not-subtract trap before the student meets it.',
      keyIdeas: [
        'KINETIC ENERGY IS THE ENERGY AN OBJECT HAS BECAUSE IT IS MOVING. Anything that is moving has some: a rolling ball, a falling raindrop, a bus, a thrown stone. Anything that is not moving has none of it at all -- a parked bus has zero kinetic energy, however many kilograms are sitting there. Two things, and only two things, decide how much kinetic energy a moving object has: how much MASS is moving, measured in kilograms, and how FAST it is going, measured in meters per second. Nothing else on the object decides it -- not the color, not the shape, not what it is made of, not which direction it happens to be heading. Change one of those two things and the kinetic energy changes. Change neither, and it does not.',
        'THE MASS RULE: THE ENERGY GROWS BY THE SAME FACTOR THE MASS GROWS BY. Hold the speed still and change only the mass. Double the mass and you double the kinetic energy. Triple the mass and you triple it. Halve the mass and you halve it. This is the rule people already expect, and it is the easy one of the two. A tennis ball and a hollow plastic wiffle ball thrown at exactly the same speed are the clearest case: the tennis ball has more mass, so at that one shared speed it carries more kinetic energy, and that is why one of them stings when it hits you and the other one does not.',
        'THE SPEED RULE: THE ENERGY GROWS BY THE SPEED FACTOR MULTIPLIED BY ITSELF. Hold the mass still and change only the speed. Double the speed and the kinetic energy does not double -- it becomes FOUR times as large, because the factor 2 is multiplied by itself and 2 times 2 is 4. Triple the speed and the energy becomes nine times as large, because 3 times 3 is 9. Halve the speed and it drops to a quarter, because half of a half is a quarter. Riding a bike at 4 meters per second instead of 2 meters per second is twice the speed on the same bike with the same rider, and four times the kinetic energy. The short name for this is that kinetic energy grows with the SQUARE of the speed, and "squared" means exactly that and nothing more: the factor multiplied by itself.',
        'THE ROUTINE FOR READING A RECORD OF TRIALS, IN ORDER. (1) Take the trials one at a time and write down what each one gives you: the mass with its unit in kilograms, the speed with its unit in meters per second, and how that trial\'s kinetic energy compares with the trial you are using as the baseline. (2) Find two trials that differ in ONE thing only -- the same speed with different masses, or the same mass with different speeds. A pair that differs in two things at once tells you nothing about either one on its own, however tempting the pair looks. (3) Compare that one thing by HOW MANY TIMES. Ask how many of the smaller amount fit into the larger amount, which is a division; do not ask what the difference is, which is a subtraction. (4) Apply the matching rule: for a mass pair the energy factor equals the mass factor, and for a speed pair the energy factor is the speed factor multiplied by itself. If both the mass and the speed changed, work the two factors out separately and then multiply them together.',
        'THE TRAP IS SUBTRACTING WHEN YOU SHOULD BE DIVIDING, AND IT HIDES INSIDE ORDINARY LANGUAGE. "It went from 5 meters per second to 20 meters per second, so the speed went up by 15 meters per second" is a true sentence about the difference and a useless one here, because a difference cannot be turned into an energy comparison at all. The useful sentence is "20 meters per second is four times 5 meters per second", and four times the speed gives four times four, which is sixteen times the energy. WRONG: "The speed rose by 15 meters per second, so the kinetic energy is 15 times as large." CORRECT: "The speed is 4 times as large, so the kinetic energy is 4 times 4, which is 16 times as large." The second trap is smaller and runs the other way: do not multiply the MASS factor by itself. Double the mass is double the energy, not four times it. Only the speed gets squared, and the whole of this lesson lives in that difference.',
      ],
      vocabulary: [
        { term: 'kinetic energy', definition: 'the energy an object has because it is moving. An object that is standing still has none of it, whatever its mass.' },
        { term: 'mass', definition: 'the amount of matter in an object, measured in kilograms.' },
        { term: 'speed', definition: 'how far an object travels in each second of its motion, measured in meters per second.' },
        { term: 'factor', definition: 'the number of times one amount fits into another. You find a factor by dividing the larger amount by the smaller one, never by subtracting.' },
        { term: 'squared', definition: 'multiplied by itself. Two squared is 2 times 2, which is 4; three squared is 3 times 3, which is 9.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-four-trial-record',
      kind: 'worked_example',
      problem:
        'A science club rolls a metal ball along a level track four times and records how much kinetic energy the ball has as it passes the far end. Trial 1 is the run everything else is compared against: a ball with a mass of 2 kilograms passes the end at 3 meters per second. Trial 2: a ball with a mass of 4 kilograms passes the end at 3 meters per second, and its kinetic energy is twice Trial 1\'s. Trial 3: a ball with a mass of 2 kilograms passes the end at 6 meters per second, and its kinetic energy is four times Trial 1\'s. Trial 4: a ball with a mass of 6 kilograms passes the end at 3 meters per second, and its kinetic energy is three times Trial 1\'s. Use the four trials to say how the kinetic energy depends on the mass and how it depends on the speed.',
      steps: [
        'Step 1, take the trials one at a time and write down what each one gives you. Trial 1: a mass of 2 kilograms, a speed of 3 meters per second, and the energy that everything else is measured against. Trial 2: a mass of 4 kilograms, a speed of 3 meters per second, twice the energy. Trial 3: a mass of 2 kilograms, a speed of 6 meters per second, four times the energy. Trial 4: a mass of 6 kilograms, a speed of 3 meters per second, three times the energy. Three of the four runs share a speed of 3 meters per second, and two of them share a mass of 2 kilograms, so there are usable pairs sitting in this record.',
        'Step 2, find the pairs that differ in one thing only, and do the mass first. Trials 1, 2 and 4 all pass the end at 3 meters per second, so across those three the speed is held still and only the mass moves. Trial 1 against Trial 2: the mass goes from 2 kilograms to 4 kilograms, and 4 divided by 2 is 2, so the mass is twice as large -- and the energy went from the baseline to twice the baseline. Same factor. Trial 1 against Trial 4: the mass goes from 2 kilograms to 6 kilograms, and 6 divided by 2 is 3, so the mass is three times as large, and the energy is three times as large. Same factor again. Two separate pairs, one rule: with the speed held still, the kinetic energy grows by exactly the factor the mass grows by.',
        'Step 3, now the speed, using the pair that holds the mass still. Trials 1 and 3 both use a mass of 2 kilograms, so this time only the speed moves. The speed goes from 3 meters per second to 6 meters per second, and 6 divided by 3 is 2, so the speed is twice as large. But the energy is four times as large, not twice. The energy factor is not the speed factor; it is the speed factor multiplied by itself, and 2 times 2 is 4. That is the whole surprise of this lesson, and it is sitting in one row of this record.',
        'Step 4, say the two rules back in the same shape, because they are not the same shape. Mass: the factor goes straight through, so 3 times the mass gives 3 times the energy. Speed: the factor is multiplied by itself, so 2 times the speed gives 2 times 2, which is 4 times the energy. WRONG: "From Trial 1 to Trial 3 the speed rose by 3 meters per second while the energy rose to four times the baseline, so the two numbers do not line up at all." CORRECT: "From Trial 1 to Trial 3 the speed is 2 times as large, and 2 times 2 is 4, which is exactly the energy factor." The rise of 3 meters per second is a true number and it is the wrong number to reach for. Every comparison in this lesson is a division, never a subtraction.',
        'Now run the two checks a science answer needs, because there is no single calculation here to redo. First, look for clues of DIFFERENT KINDS that agree. The first clue is the paired-row comparison itself: two separate mass pairs, 2 kilograms against 4 kilograms and 2 kilograms against 6 kilograms, each give an energy factor equal to the mass factor, so the result does not depend on which pair you happened to pick. The second clue is a pair that does not involve the baseline at all: compare Trial 4 with Trial 2, both at 3 meters per second, where the mass goes from 4 kilograms to 6 kilograms. 6 divided by 4 is 1.5, and the energies are three times and twice the baseline, and 3 divided by 2 is also 1.5. The rule holds between two rows that were never measured against each other, which means it is not an artifact of choosing Trial 1 as the reference. The third clue is of a different kind again: the speed pair proves this record CAN produce an energy factor that is not equal to the factor of the thing that changed. If the record simply handed back whatever number you fed it, Trial 3 would have come out at twice the baseline. It came out at four times. So the mass result is a real finding about the mass column, not a habit of the record.',
        'Second, change one thing and check that the answer moves the way it should. Suppose the club runs a fifth trial with the 2-kilogram ball at 9 meters per second. The mass is unchanged, and 9 divided by 3 is 3, so the speed is three times Trial 1\'s -- and the rule says the energy should be 3 times 3, which is nine times Trial 1\'s, not three times. Now compare that with a trial at 3 meters per second and three times the mass, which the record already has as Trial 4 at three times the energy. Tripling the speed and tripling the mass are both "three times", and they give completely different answers: nine times against three times. A rule that gave the same answer for both would not be describing this record at all. The two columns behave differently, and that fifth trial is exactly where you would see it.',
      ],
      answer:
        'With the speed held still, the kinetic energy grows by the same factor as the mass: twice the mass gives twice the energy, and three times the mass gives three times the energy. With the mass held still, the kinetic energy grows by the speed factor multiplied by itself: twice the speed gives 2 times 2, which is four times the energy.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-both-change-at-once',
      kind: 'worked_example',
      problem:
        'Two carts run along the same level track. The first cart has a mass of 3 kilograms and moves at 2 meters per second. The second cart has a mass of 6 kilograms and moves at 4 meters per second. How many times as much kinetic energy does the second cart have as the first, and how do you work that out when two things have changed at once?',
      steps: [
        'Step 1, write down what you are given, with its units. First cart: a mass of 3 kilograms, a speed of 2 meters per second. Second cart: a mass of 6 kilograms, a speed of 4 meters per second. Both the mass and the speed are different, so there is no pair here that differs in one thing only. That is not a dead end. It means you take the two changes one at a time and then put them back together.',
        'Step 2, the mass on its own. Divide to get the factor: 6 kilograms divided by 3 kilograms is 2, so the second cart has twice the mass. With the speed held still, twice the mass gives twice the kinetic energy. Write down 2 times and set it aside.',
        'Step 3, the speed on its own. Divide again: 4 meters per second divided by 2 meters per second is 2, so the second cart has twice the speed. With the mass held still, a speed factor is multiplied by itself, and 2 times 2 is 4. Write down 4 times.',
        'Step 4, put the two contributions together by multiplying them. The mass change multiplies the energy by 2 and the speed change multiplies it by 4, so together they multiply it by 2 times 4, which is 8. The second cart has eight times the kinetic energy of the first. WRONG: "The mass doubled and the speed doubled, so the energy doubled twice over -- 2 times for the mass and 2 times for the speed, which is 4 times in all." CORRECT: "The mass doubled, which is 2 times, and the speed doubled, which is 2 times 2, or 4 times; 2 times 4 is 8 times in all." The two doublings are not worth the same amount, and that is the entire point of this lesson.',
        'Now run the two checks. First, three clues of DIFFERENT KINDS that agree. Clue one is a staged route through a cart that is not in the problem at all: start with the first cart at 3 kilograms and 2 meters per second, change only the mass, and a cart of 6 kilograms at 2 meters per second has twice the first cart\'s energy; now change only the speed of THAT cart, from 2 meters per second to 4 meters per second, and it has four times its own energy. Twice the baseline, then four times that, is 2 times 4, which is 8 times the baseline -- and every step of the staged route was a one-thing-at-a-time comparison of the kind the trial record taught. Clue two is the same journey taken in the other order: raise the first cart\'s speed to 4 meters per second and it has four times its energy, then double its mass to 6 kilograms and it has twice that, and 4 times 2 is 8 again. Two orders, one answer, which is what has to happen if the two factors really do just multiply. Clue three is a size check that needs no arithmetic: each change on its own makes the energy larger, so the answer has to be larger than either factor on its own. An answer of 4 -- the speed factor alone -- would fail that check immediately, because it leaves the doubled mass doing nothing at all.',
        'Second, change exactly one condition and check that the answer moves. Give the second cart the same speed as the first, 2 meters per second, and leave its mass at 6 kilograms: the speed factor is now 1, and 1 multiplied by itself is still 1, so only the mass factor of 2 is left and the second cart has twice the first cart\'s energy, not eight times. Now change the other condition instead -- put both carts at a mass of 3 kilograms and leave their speeds at 2 meters per second and 4 meters per second -- and the mass factor is 1, so only the speed factor of 4 is left. Eight times was the product of two changes, and taking either one of them away drops the answer to what the other change is worth on its own.',
      ],
      answer:
        'Eight times as much. The mass factor is 6 kilograms divided by 3 kilograms, which is 2, and a mass factor goes into the energy unchanged, as 2. The speed factor is 4 meters per second divided by 2 meters per second, which is 2, and a speed factor goes into the energy multiplied by itself, as 2 times 2, which is 4. Multiply the two contributions: 2 times 4 is 8.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sled-runs-mass-pair',
      kind: 'try_yourself',
      problem:
        'A club records three runs of a loaded sled across the same stretch of packed snow, measuring the sled\'s kinetic energy as it passes a marker. Run 1: the sled and its load have a mass of 10 kilograms, and the sled passes the marker at 3 meters per second. Run 2: the sled and its load have a mass of 30 kilograms, and the sled passes the marker at 3 meters per second. Run 3: the sled and its load have a mass of 30 kilograms, and the sled passes the marker at 6 meters per second. Which statement correctly uses these runs to describe how the kinetic energy depends on the mass?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Runs 1 and 3 are the pair to use, and they show that three times the mass gives twelve times the kinetic energy, because the sled in Run 3 has three times the mass that the sled in Run 1 had.' },
        { id: 'b', text: 'Runs 1 and 2 are the pair to use, because the sled passes the marker at 3 meters per second in both of them, so the mass is the only thing that changed: three times the mass gives three times the kinetic energy.', correct: true },
        { id: 'c', text: 'Runs 2 and 3 are the pair to use, because those two runs carry the same load of 30 kilograms, and the pair that holds the load fixed is the pair that shows you what changing the load does to the energy.' },
        { id: 'd', text: 'Runs 1 and 2 are the pair to use, and they show that three times the mass gives nine times the kinetic energy, because a factor is always multiplied by itself on its way into an energy comparison.' },
      ],
      expectedAnswer: 'Runs 1 and 2 are the pair to use, because the sled passes the marker at 3 meters per second in both of them, so the mass is the only thing that changed: three times the mass gives three times the kinetic energy.',
      hints: [
        'Before you compare anything, go looking for the pair that differs in one thing only. Read the three speeds first and ask which two runs share one, then read the two masses in that pair.',
        'Once you have the pair, compare the masses by how many times rather than by how many kilograms were added. Then remember which of the two quantities gets multiplied by itself on its way into the energy, and which one goes straight through.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scooter-speed-comparison',
      kind: 'try_yourself',
      problem:
        'A rider and her kick scooter have a mass of 60 kilograms altogether. Coasting along a flat path one morning, she passes a lamppost at 2 meters per second. Coasting along the same flat path on the same scooter later that day, she passes the same lamppost at 6 meters per second. Which statement correctly compares her kinetic energy at the two moments?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She has three times as much kinetic energy the second time, because her speed is three times as large and the kinetic energy of a moving object grows by exactly the factor that its speed grows by.' },
        { id: 'b', text: 'She has the same kinetic energy at both moments, because kinetic energy is set by how much matter is moving, and the rider and the scooter have a mass of 60 kilograms on both runs, so nothing that decides the energy has changed.' },
        { id: 'c', text: 'She has nine times as much kinetic energy the second time, because 6 meters per second is three times 2 meters per second and a speed factor is multiplied by itself, so three times the speed gives 3 times 3, which is nine times.', correct: true },
        { id: 'd', text: 'She has four times as much kinetic energy the second time, because she picked up 4 meters per second between the two runs, and that gain in speed is the number of times her kinetic energy has grown.' },
      ],
      expectedAnswer: 'She has nine times as much kinetic energy the second time, because 6 meters per second is three times 2 meters per second and a speed factor is multiplied by itself, so three times the speed gives 3 times 3, which is nine times.',
      hints: [
        'The mass is the same on both runs, so the mass contributes a factor of 1 and every bit of the change is coming from the speed. Get the speed factor by dividing, not by subtracting: how many times does 2 meters per second fit into 6 meters per second?',
        'Now take that factor into the energy the way a speed factor has to go in. A speed factor is multiplied by itself before it reaches the energy, so work out what your factor times itself comes to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-boxes-both-differ',
      kind: 'try_yourself',
      problem:
        'Two boxes slide along the same smooth level floor, each at a steady speed. The first box has a mass of 8 kilograms and is moving at 3 meters per second. The second box has a mass of 4 kilograms and is moving at 6 meters per second. Which box has more kinetic energy, and by how many times?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The first box has more, twice as much, because it has twice the mass of the second box, and mass is the thing an object\'s energy of motion is built out of, so more matter moving means more energy.' },
        { id: 'b', text: 'The two boxes have exactly the same kinetic energy, because the first box has twice the mass while the second box has twice the speed, so the advantage each one holds cancels the other one out exactly.' },
        { id: 'c', text: 'The second box has more, four times as much, because its speed is twice the first box\'s speed and twice the speed gives four times the energy, and the difference in mass cannot change a comparison the speed has already settled.' },
        { id: 'd', text: 'The second box has more, twice as much, because its speed is twice as large, which gives four times the energy, while its mass is only half as large, which halves the energy again: four times a half is two times.', correct: true },
      ],
      expectedAnswer: 'The second box has more, twice as much, because its speed is twice as large, which gives four times the energy, while its mass is only half as large, which halves the energy again: four times a half is two times.',
      hints: [
        'Both things changed between the two boxes, so take them one at a time. Work out the mass factor on its own first, going from the first box to the second, and notice that this one is a factor smaller than 1.',
        'Now work out the speed factor on its own and multiply it by itself. Then multiply the two contributions together -- one of them pushes the energy up and the other pulls it back down, so the answer is smaller than the speed contribution alone but still above 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-double-speed-and-parked-truck',
      kind: 'misconception_check',
      question:
        'A student writes: "A car moving at 20 meters per second has twice as much kinetic energy as the same car moving at 10 meters per second. And a truck parked at the curb has plenty of kinetic energy too, because a truck is so heavy." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A car at 20 meters per second has twice the kinetic energy of the same car at 10 meters per second.',
          misconception:
            'Reading the speed rule as a one-for-one rule, because almost every everyday comparison the student has ever made works that way -- twice as many, twice as much -- and nothing in the words "it is going twice as fast" hints that the factor gets multiplied by itself before it reaches the energy.',
          correctsTo:
            'Start by dividing to get the factor: 20 meters per second divided by 10 meters per second is 2, so the speed is twice as large. Then multiply that factor by itself, because that is what a speed factor does on its way into the energy: 2 times 2 is 4. The car at 20 meters per second has FOUR times the kinetic energy of the same car at 10 meters per second, not twice. The mass never changed, so the mass contributes nothing to this particular comparison. WRONG: "Twice the speed, so twice the energy." CORRECT: "Twice the speed, so 2 times 2, which is four times the energy." The same rule is why a small-sounding rise in speed matters so much more than it sounds: the same car at three times the speed is carrying nine times the kinetic energy, because 3 times 3 is 9.',
        },
        {
          answer: 'A truck parked at the curb has plenty of kinetic energy, because a truck is so heavy.',
          misconception:
            'Treating kinetic energy as something an object owns because of what it is, rather than something it has only while it is moving, because the word "energy" sounds like a property of the object in the way that its color or its mass is.',
          correctsTo:
            'Kinetic energy is the energy an object has because it IS MOVING, and a parked truck is not moving. Its kinetic energy is zero, and it stays zero however many kilograms are sitting in it. Mass is not a supply of kinetic energy that an object carries around; mass is the factor that decides how much a given speed is worth. No speed at all means no energy of motion at all, whatever the mass, which is exactly why a parked truck is safe to walk past and the same truck rolling at a walking pace is not. WRONG: "It is heavy, so it has a lot of kinetic energy." CORRECT: "It is heavy, so IF it were moving it would have a lot of kinetic energy. Standing still, it has none." Whether a still object has energy stored in it in some other way is the next lesson, on energy stored by position; this lesson is about the energy of motion only.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Kinetic energy is the energy an object has because it is moving. An object standing still has none, whatever its mass.',
        'Only two things decide it: how much mass is moving, in kilograms, and how fast it is going, in meters per second.',
        'The mass rule: with the speed held still, the energy grows by the same factor as the mass. Twice the mass gives twice the energy; three times the mass gives three times the energy.',
        'The speed rule: with the mass held still, the energy grows by the speed factor multiplied by itself. Twice the speed gives 2 times 2, which is four times the energy; three times the speed gives 3 times 3, which is nine times.',
        'Never multiply the mass factor by itself. Only the speed gets squared, and that one difference is the whole lesson.',
        'Compare by dividing, never by subtracting. A rise of 4 meters per second is not a factor of four; ask how many times the smaller speed fits into the larger one.',
        'When both the mass and the speed change, work out the two factors separately and multiply them together: twice the mass and twice the speed is 2 times 4, which is eight times the energy.',
        'To read a record of trials: write each trial down with its units, find the pair that differs in one thing only, get that one thing\'s factor by dividing, and apply the matching rule.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Kinetic Energy: Mass & Speed' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
