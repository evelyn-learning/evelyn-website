/**
 * Grade 8 Science (Physical Science) — Gravity, Electric & Magnetic Forces,
 * and Fields: Magnetic Forces & Electromagnets.
 *
 * PROCEDURE-LED row (NGSS MS-PS2-3). One routine runs the whole lesson: name
 * the one thing that changed between two trials, check that everything else
 * was held the same, read the direction the result moved, and then choose a
 * next trial that changes exactly one untested thing. The poles rule (like
 * poles push apart, opposite poles pull together) is the fact the routine is
 * applied to; the four strength factors -- how far apart, how strong the
 * magnet is, and for an electromagnet how many turns of wire and how much
 * current -- are what the described data is read for.
 *
 * The two traps it is built to kill are (a) comparing a pair of trials that
 * differ in two things at once and then blaming one of them, and (b)
 * "a magnet pulls on any metal", which survives untouched unless an item
 * puts an aluminum object next to a steel one.
 *
 * SCOPE GUARD: this plan states the poles rule, reads described magnet and
 * electromagnet investigation data for which factor changed the strength of
 * the pull or the push, and picks a valid next trial. Its scope cell's
 * withheld clause, verbatim: "Withholds the right-hand rule, force on a
 * moving charge and induction (`ap-physics2-magnetism.ts`)." The cell carries
 * no lineage clause. Every absence claimed below is an absence from this
 * plan's AUTHORED TEXT, not from this comment, which necessarily names the
 * things it excludes. What the boundary means at each edge, and what is
 * deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 3.2 (electric forces and charge) shares this
 *     standard and is split from it by force type. This file mentions
 *     electric charge in exactly one sentence of one keyIdea, to say that the
 *     poles rule and the charge rule have the same SHAPE and that charge was
 *     the previous lesson; it never says what charge is, never says that
 *     rubbing transfers it, and no item turns on anything electric except
 *     the word "current" as described below. Row 3.4 (fields) owns the idea
 *     of the region around a magnet in which the force acts, and owns the
 *     word for it: "field" appears in no authored string here, its only
 *     occurrence being inside the followUps loId, which is an identifier and
 *     is never spoken. Where this row has to say that the pull crosses a gap,
 *     it says the gap in plain words and names the naming of it as the next
 *     lesson's job. Row 3.1 (gravity, mass and weight) is not entered: no
 *     mass, no weight as a quantity and no gravitational pull appears, and
 *     the word "heavy" appears twice, colloquially, both times inside a list
 *     of properties that turn out to be irrelevant to whether a magnet pulls
 *     on something.
 *   - "CURRENT" IS A WORD HERE, NOT A TOPIC. Current appears only as the
 *     electricity supplied to an electromagnet's coil and only as one of the
 *     factors that set its strength, always compared ("the same current",
 *     "twice as much current") and never given a number or a unit. There is
 *     no circuit, no battery, no wire diagram, no voltage, no resistance and
 *     no V = IR anywhere in this file; the curriculum excludes current
 *     electricity entirely.
 *   - INVESTIGATION VOCABULARY is assumed, not re-taught. The file uses the
 *     change-one-thing habit inside its worked examples and items, and never
 *     teaches "variable", "control", "independent", "dependent" or
 *     "hypothesis" as terms; that vocabulary belongs to Grade 7 Unit 1 and
 *     none of those five words appears here.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. There is no compass, no
 *     navigation, no Earth as a magnet, no orbit, no planet and no mineral
 *     anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY boundary: nothing in this row is chemistry. No substance
 *     is identified, no reaction occurs, and iron, steel, nickel, cobalt,
 *     aluminum and copper are named only as everyday materials that are or
 *     are not pulled on, never as elements, atoms or entries on the periodic
 *     table.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above). The specific things this file stops short of
 *     are the right-hand rule, the force on a moving charge, and induction --
 *     so no item asks which way anything points around a wire, no charge
 *     moves anywhere in this file, and nothing is ever moved near a coil to
 *     make current. Strength is read as a DIRECTION from described data
 *     ("more turns held more washers"), never as a formula, a proportion or a
 *     computed quantity: this file deliberately never says how many TIMES
 *     stronger anything is, and the second worked example says so out loud --
 *     once in a WRONG/CORRECT step and again in its answer.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every magnet,
 * pole, gap and trial in this file is written out in words with its
 * orientation stated, and every item is solvable from the text printed
 * inside it. Never write "look at the diagram", and never assume the student
 * has a bar magnet, a coil of wire or a box of paperclips in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.2 -> 3.3 ->
 * 3.4 (`electric-forces-and-charge` -> `magnetic-forces-and-electromagnets`
 * -> `fields-forces-without-contact`), and both arrays carry those real
 * loIds. The two hand-written exemplars leave their arrays empty because
 * they are registered before their neighbors exist; that is a registration
 * artifact and is not the pattern for a fan-out row.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U3_MAGNETIC_FORCES_AND_ELECTROMAGNETS: LessonPlan = {
  id: 'evelyn.ms.m8sci.magnetic-forces-and-electromagnets.v1',
  title: 'Magnetic Forces & Electromagnets',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.magnetic-forces-and-electromagnets',
      standard: 'M8SCI-3.3',
      description:
        'Describe magnetic poles (like poles repel, opposite attract), predict which factors change a magnetic force\'s strength from investigation data -- distance, magnet strength, and for an electromagnet the number of coil turns and the current supplied -- and pick a valid question or next trial for such an investigation (NGSS MS-PS2-3).',
    },
  ],
  prerequisites: ['m8sci.electric-forces-and-charge'],
  followUps: ['m8sci.fields-forces-without-contact'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two everyday magnet puzzles side by side -- the magnet that shoves back when you turn it around, and the crane magnet that lets go of a whole car -- so the student wants a rule for when a magnet pulls, when it pushes, and what sets how hard.',
      script:
        'Take two fridge magnets off the door and push them together. Depending on which way round you are holding them, one of two things happens. Either they snap together so fast they pinch your fingers, or they shove each other apart and slide sideways off each other no matter how carefully you line them up. Same two magnets, same hands, opposite results, and the only thing you changed was which way round one of them was facing. Now picture something much bigger. At a scrapyard a crane swings a flat metal disc over a wrecked car, lowers it, and lifts the whole car into the air. Then the operator flicks a switch and the car drops. The disc did not move away and nothing let go of it mechanically; it simply stopped being a magnet. By the end of today you will be able to say which way round two magnets have to face to push instead of pull, name the things that make a magnetic force stronger or weaker, and read a set of test results well enough to say which of those things the test actually proved.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-poles-strength-and-the-one-change-routine',
      kind: 'concept',
      goal: 'Install the poles rule with its orientation stated in words, the list of what magnets actually pull on, the four strength factors, the on-and-off nature of an electromagnet, and the change-one-thing routine for reading described trial data.',
      keyIdeas: [
        'EVERY MAGNET HAS TWO POLES, AND THE RULE IS ABOUT WHICH TWO ARE FACING. The two ends of a magnet are called its north pole and its south pole, and the force between two magnets is strongest at the ends. Point the north pole of one magnet at the north pole of another and they push each other apart. Point the south pole at the south pole and they push each other apart too. Point the north pole of one at the south pole of the other and they pull together. LIKE POLES PUSH APART; OPPOSITE POLES PULL TOGETHER. You already know a rule with exactly this shape from the previous lesson, where like charges pushed apart and opposite charges pulled together -- that rule was about electric charge, this one is about magnetic poles, and they are two different forces that happen to follow the same pattern. Poles always come in pairs: cut a bar magnet in half and you do not get a north piece and a south piece, you get two shorter magnets, each with a north pole at one end and a south pole at the other.',
        'A MAGNET DOES NOT PULL ON EVERY METAL, AND IT PULLS ON A PAPERCLIP WITH EITHER POLE. Of the metals you meet every day, a magnet pulls on iron and on steel, which is mostly iron, and on nickel and cobalt. It does not pull on aluminum, so an aluminum drink can is not attracted; it does not pull on copper, so a copper coin is not attracted; and gold, silver, glass, wood and plastic are not attracted either. Being shiny, being heavy and being metal are all beside the point. There is a second half to this, and it is the part that confuses people. Two magnets push apart when like poles face each other, but a plain steel paperclip is pulled in by EITHER end of a magnet, because the paperclip is not a magnet to begin with. While the magnet is close, the near end of the steel behaves as the opposite pole to whichever pole is facing it, so the pull happens whichever way round you hold the magnet. Push and pull is a rule about two MAGNETS. Pull only is what a magnet does to a piece of unmagnetized iron or steel.',
        'FOUR THINGS CHANGE HOW STRONG A MAGNETIC FORCE IS. First, HOW FAR APART the two objects are: the closer they are, the stronger the force, and it fades away as the gap grows until at some gap nothing moves at all. The force acts across that gap without the objects touching, which is worth noticing now -- what to call the space around a magnet where its pull can be felt is the next lesson, and this one stays with the force itself. Second, HOW STRONG THE MAGNET IS: a stronger magnet pulls a paperclip in from a gap where a weaker one cannot budge it. The other two apply to an electromagnet, and they are in the next idea.',
        'AN ELECTROMAGNET IS A MAGNET ONLY WHILE CURRENT FLOWS. Wind a length of insulated wire into a coil, supply current to the wire, and the coil is a magnet, with a north pole at one end and a south pole at the other, obeying the same poles rule as any other magnet. Stop the current and it stops being a magnet, which is exactly how a crane magnet drops a car. That is the third and fourth strength factor: the MORE TURNS OF WIRE in the coil, the stronger the electromagnet, and the MORE CURRENT supplied to it, the stronger the electromagnet. There is one more that costs nothing to add: put an iron rod down the middle of the coil and the electromagnet is stronger still than the same coil with nothing but air inside it. Notice what this gets you that a fridge magnet cannot. A permanent magnet is as strong as it is and cannot be switched off. An electromagnet can be made stronger by winding more turns or supplying more current, and it can be turned off entirely.',
        'THE ROUTINE FOR READING TRIAL DATA, IN ORDER. (1) Write down what was different between the two trials you are comparing, and what was kept the same. (2) If exactly ONE thing was different, the comparison is usable, and you read off the direction the result moved: stronger or weaker. (3) If TWO OR MORE things were different, that pair tells you nothing about either one of them, because you cannot say which of the two did it -- so go and find a different pair that differs in only one thing. (4) State the conclusion as a direction, and say which factor it is about. Every conclusion in this lesson is a direction, never a number of times.',
        'CHOOSING THE NEXT TRIAL IS THE SAME RULE RUN FORWARD. When you want to test a factor nobody has tested yet, take one trial that has already been run, change ONLY that factor, keep every other condition identical to that trial, and compare the two results. Two mistakes get made here and both are worth naming. The first is changing the new factor and something else at the same time, which produces a pair you cannot read. The second is running a trial that tests a factor already settled, which produces a real result that answers a question nobody asked.',
      ],
      vocabulary: [
        { term: 'magnetic pole', definition: 'one of the two ends of a magnet, called its north pole and its south pole, where the magnetic force is strongest.' },
        { term: 'repel', definition: 'to push apart. Two north poles repel each other, and so do two south poles.' },
        { term: 'attract', definition: 'to pull together. A north pole and a south pole attract each other, and a magnet attracts iron or steel with either pole.' },
        { term: 'magnetic force', definition: 'the push or pull between two magnets, or the pull of a magnet on iron, steel, nickel or cobalt, acting across a gap without the objects touching.' },
        { term: 'electromagnet', definition: 'a coil of wire that behaves as a magnet while current is supplied to it, and stops being a magnet when the current stops.' },
        { term: 'turns', definition: 'the number of times the wire is wound around the coil; more turns make an electromagnet stronger.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-magnets-and-a-gap',
      kind: 'worked_example',
      problem:
        'A steel paperclip is placed on a smooth table and a magnet is placed on the same table with its north pole facing the paperclip. The gap between them is measured, the magnet is let go, and the result is written down. Trial 1: Magnet A, gap 2 centimeters -- the paperclip slides across and sticks to the magnet. Trial 2: Magnet A, gap 4 centimeters -- the paperclip twitches and creeps a short way, then stops. Trial 3: Magnet A, gap 6 centimeters -- the paperclip does not move at all. Trial 4: Magnet B, gap 6 centimeters -- the paperclip slides all the way across and sticks. The same paperclip and the same table are used every time. What do these four trials show?',
      steps: [
        'Step 1, write down what can differ between trials. Two things differ anywhere in this set: the gap, which is 2, 4 or 6 centimeters, and which magnet is used, A or B. Everything else is held the same, and the problem says so: the same steel paperclip, the same smooth table, the magnet let go the same way each time.',
        'Step 2, find a set of trials that differ in exactly one thing. Trials 1, 2 and 3 all use Magnet A, so the only difference among them is the gap: 2 centimeters, then 4, then 6. That is a usable comparison, and the results run in a clear direction. At 2 centimeters the paperclip crosses the whole gap. At 4 centimeters it barely moves. At 6 centimeters nothing happens. So the pull gets weaker as the gap gets bigger, and past some gap it is too weak to drag the paperclip at all.',
        'Step 3, find a second pair that differs in exactly one thing. Trials 3 and 4 both have a gap of 6 centimeters, and the same paperclip on the same table, so the only difference is which magnet is on the table. Magnet A does nothing at 6 centimeters and Magnet B drags the paperclip the whole way. So Magnet B is the stronger magnet, and how strong the magnet is changes the force too.',
        'Step 4, watch out for the pair that cannot be read. WRONG: "Compare trial 1 and trial 4. Trial 4 has a bigger gap and the paperclip still crossed it, so the size of the gap makes no difference." CORRECT: "Trial 1 and trial 4 differ in TWO things at once -- the gap is different AND the magnet is different -- so that pair cannot tell you about either one. Read the gap from trials 1, 2 and 3, where the magnet is the same, and read the magnet from trials 3 and 4, where the gap is the same." A pair that differs in two things is not weak evidence. It is no evidence about either one.',
        'Now run the two checks a science answer needs, because there is no formula here to redo. First, look for clues of DIFFERENT KINDS that agree that the gap matters. The ordered trend is one kind: three gaps in a row, and the result gets steadily weaker as the gap grows, which is what you would see if the gap were doing it and not what you would see if the results were random. The matched pair is a second kind: at one fixed gap of 6 centimeters, changing only the magnet changed the result, which shows the gap is not the ONLY thing that matters and that the trials are sensitive enough to show a difference at all. And the way the motion starts is a third kind: in trial 1 the paperclip begins moving while it is still 2 centimeters away with nothing touching it, so the pull is reaching across the gap, and a pull that has to reach across a gap is the kind of thing a bigger gap could weaken.',
        'Second, change one condition and check that the answer moves the way it should. Rewind to trial 3, where Magnet A at a gap of 6 centimeters did nothing at all, and change only the gap: slide the paperclip in to 1 centimeter and let go. It snaps across immediately. Same magnet, same paperclip, same table, and the result flips from nothing to everything, so the gap was the thing doing it. Then change a different condition instead and watch the answer move a different way: swap the steel paperclip for an aluminum one of the same size and run trial 1 again, with Magnet A at a gap of 2 centimeters. Nothing moves, because a magnet does not pull on aluminum at all. Two different conditions, two different ways the answer moves, and neither of them is the magnet getting tired.',
      ],
      answer:
        'The trials show two things. From trials 1, 2 and 3, where only the gap changes, the magnetic pull gets weaker as the gap gets bigger, until at 6 centimeters it is too weak to move the paperclip. From trials 3 and 4, where only the magnet changes, Magnet B is the stronger magnet, because it drags the paperclip across a gap that Magnet A cannot. Trials 1 and 4 must not be compared with each other, because they differ in two things at once.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-electromagnet-trials-and-the-next-trial',
      kind: 'worked_example',
      problem:
        'A student winds insulated wire around an iron nail to make an electromagnet, supplies current to the wire, and counts how many steel paperclips hang from the end of the nail in a chain. Trial 1: 20 turns of wire, the smaller current -- 3 paperclips. Trial 2: 40 turns of wire, the smaller current -- 5 paperclips. Trial 3: 40 turns of wire, twice as much current -- 9 paperclips. The same nail, the same kind of wire and the same paperclips are used throughout. What do the trials show, and what would be a good next trial if the student now wants to find out whether the electromagnet pulls on aluminum paperclips as well as steel ones?',
      steps: [
        'Step 1, write down what differs. Two things differ across this set: the number of turns of wire, which is either 20 turns or 40 turns, and the current supplied, which is the smaller current or twice that. The nail, the kind of wire and the paperclips are held the same.',
        'Step 2, take the pair that differs in exactly one thing. Trials 1 and 2 both use the smaller current, so the only difference is the number of turns: 20 turns against 40 turns, which is twice as many. The count goes from 3 paperclips to 5 paperclips. More turns of wire, stronger electromagnet.',
        'Step 3, take the second pair that differs in exactly one thing. Trials 2 and 3 both have 40 turns of wire, so the only difference is the current. The count goes from 5 paperclips to 9 paperclips. More current, stronger electromagnet. And now say clearly what these numbers do NOT tell you. WRONG: "Doubling the turns of wire raised the count, so doubling the turns must double how strong the electromagnet is." CORRECT: "The counts tell you the DIRECTION -- more turns is stronger, more current is stronger -- and nothing more than that. Three paperclips to five is not a doubling, and nothing in this lesson claims how many times stronger anything gets."',
        'Step 4, notice the pair that cannot be read, and then plan the next trial. Trials 1 and 3 differ in two things at once, the turns and the current, so that pair supports no conclusion about either. For the new question -- does this electromagnet pull on aluminum paperclips as well as steel ones -- run one of the trials again with exactly one thing changed. Take trial 3 as it stands: 40 turns of wire, twice the current, the same nail. Change only what is being picked up, offering aluminum paperclips of the same size instead of steel ones, and count. Nothing else moves. If the count drops to nothing while every other condition is identical to trial 3, the material of the object is the reason, because it is the only thing that changed.',
        'Run the first check now, looking for clues of DIFFERENT KINDS that agree that the number of turns matters. The matched pair is one kind: at one fixed current, the only difference between trials 1 and 2 was the turns, and the count went up. The second kind is that the factor keeps working alongside another one: trial 3 has both the higher turns and the higher current, and its count is the highest of the three, which is what you expect if each factor helps rather than one of them cancelling the other. The third kind is the switch itself: cut the current and the nail holds no paperclips at all, however many turns are wound on it, which shows the coil and the current are what is making the magnetism rather than the nail having been a magnet all along.',
        'Second, change one condition and check that the answer moves. Take trial 2 -- 40 turns of wire, the smaller current, 5 paperclips -- and unwind the coil back to 20 turns, keeping the nail and the current exactly as they were. That is trial 1 again, and the count falls back to 3 paperclips, so the count follows the turns down as well as up. Change a different condition instead: keep the nail and the 40 turns of wire and cut the current off completely. Now the count is zero, and the paperclips that were hanging fall off. The answer moved both times, and it moved in the direction the factor predicts each time, which is what tells you the factors are real and not a story fitted to one set of numbers.',
      ],
      answer:
        'Trials 1 and 2 differ only in the number of turns and show that more turns of wire make the electromagnet stronger. Trials 2 and 3 differ only in the current and show that more current makes it stronger. Trials 1 and 3 differ in two things and support no conclusion. The counts give the direction only, not how many times stronger. A good next trial for the new question is trial 3 run again with everything identical -- 40 turns, twice the current, the same nail -- and only the paperclips swapped for aluminum ones of the same size.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-north-poles',
      kind: 'try_yourself',
      problem:
        'Two bar magnets lie end to end on a smooth table with a small gap between them, not touching. The north pole of the first magnet faces the north pole of the second magnet. The first magnet is held down firmly by a clamp, and the second magnet is free to slide. What happens to the second magnet, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It slides toward the first magnet, because a magnet pulls on anything made of metal, and the second magnet is a piece of metal just as much as a steel paperclip is.' },
        { id: 'b', text: 'It stays exactly where it is, because the two magnets are not touching, and a magnetic force can only push or pull on something once the two objects have come into contact.' },
        { id: 'c', text: 'It slides away from the first magnet, because the two poles facing each other across the gap are both north poles, and two like poles always push each other apart.', correct: true },
        { id: 'd', text: 'It slides toward the first magnet, because a north pole always pulls on another north pole, and it is a north pole facing a south pole that pushes apart.' },
      ],
      expectedAnswer: 'It slides away from the first magnet, because the two poles facing each other across the gap are both north poles, and two like poles always push each other apart.',
      hints: [
        'Name the two poles that are actually facing each other across the gap. Are they the same kind of pole, or opposite kinds?',
        'The rule for two magnets is not the same as the rule for a magnet and a plain steel paperclip. A paperclip is pulled in by either pole. Two magnets go by which poles are facing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reading-the-washer-data',
      kind: 'try_yourself',
      problem:
        'A class tests three electromagnets built with the same kind of wire wound around the same kind of iron bolt, and counts the steel washers each one holds. Electromagnet P: 30 turns of wire, the smaller current, holds 4 washers. Electromagnet Q: 30 turns of wire, twice as much current, holds 7 washers. Electromagnet R: 60 turns of wire, twice as much current, holds 12 washers. Which conclusion does this data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The number of turns makes an electromagnet stronger but the current does not, because the one with the most turns held the most washers, and current only switches a magnet on rather than changing how strong it is.' },
        { id: 'b', text: 'The current makes an electromagnet stronger but the number of turns does not, because P and Q have the same number of turns and Q still held more washers, which shows the turns make no difference.' },
        { id: 'c', text: 'Nothing at all can be concluded from this data, because P and R differ in two things at once, and a set of trials in which any two of them differ in two things cannot support a conclusion.' },
        { id: 'd', text: 'Both the current and the number of turns make an electromagnet stronger, because P and Q differ only in the current and Q held more, while Q and R differ only in the turns and R held more.', correct: true },
      ],
      expectedAnswer: 'Both the current and the number of turns make an electromagnet stronger, because P and Q differ only in the current and Q held more, while Q and R differ only in the turns and R held more.',
      hints: [
        'Do not read the three results as a list. Take them two at a time, and for each pair write down what is different and what is the same.',
        'There are two usable pairs hiding in here, and each one settles a different factor. Find the pair with matching turns, then find the pair with matching current.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choosing-the-next-trial',
      kind: 'try_yourself',
      problem:
        'A student has already shown that her electromagnet picks up more steel paperclips when more turns of wire are wound around the iron rod inside the coil, with the current kept the same in every trial. Her best result so far is 50 turns of wire, the same current as always, and 8 paperclips. She now wants to find out whether the iron rod inside the coil is doing anything at all, or whether the coil of wire on its own would work just as well. Which next trial answers that question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Wind 50 turns around a wooden rod of the same size, supply the same current as always, count the paperclips, and compare that count with the 8 paperclips the iron rod gave.', correct: true },
        { id: 'b', text: 'Take the iron rod out, wind 100 turns around a wooden rod of the same size, supply the same current as always, and see whether it can pick up the 8 paperclips the iron rod picked up.' },
        { id: 'c', text: 'Keep the iron rod, wind more than 50 turns around it, supply the same current as always, and check that the count climbs above 8 the way the earlier trials said it should.' },
        { id: 'd', text: 'Keep the iron rod and the 50 turns, supply twice as much current, and see whether the extra current makes up for whatever the iron rod might be contributing.' },
      ],
      expectedAnswer: 'Wind 50 turns around a wooden rod of the same size, supply the same current as always, count the paperclips, and compare that count with the 8 paperclips the iron rod gave.',
      hints: [
        'The new question is about the rod in the middle and nothing else. So the next trial should differ from a trial she has already run in exactly one way. Which way?',
        'Check each choice against two tests. Does it change only the rod? And does it answer the question she is asking now, rather than one she has already settled?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-all-metals-and-the-permanent-electromagnet',
      kind: 'misconception_check',
      question:
        'A student writes: "A magnet will pick up an aluminum can and a copper coin, because a magnet picks up metal. And once you have wound a coil around a nail and supplied current to it, you have made a magnet, so it stays a magnet afterwards like any other one." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A magnet will pick up an aluminum can and a copper coin, because a magnet picks up metal.',
          misconception:
            'Treating "metal" as one material with one set of behaviors, because almost everything a student has ever seen stuck to a magnet happened to be metal, and nobody goes around testing the ones that are not attracted.',
          correctsTo:
            'Of the metals you meet every day, only iron, steel (which is mostly iron), nickel and cobalt are pulled on by a magnet. Aluminum and copper are metals and neither of them is attracted, which you can settle in a few seconds by holding a magnet near an aluminum drink can and then near a copper coin: nothing happens either time. Being metal, being shiny and being heavy have nothing to do with it. WRONG: "A magnet picks up metal." CORRECT: "A magnet picks up iron, steel, nickel and cobalt, and leaves aluminum, copper, gold, silver, glass, wood and plastic alone." This also explains something you have probably noticed without thinking about it: a steel food can sticks to a fridge magnet and an aluminum drink can does not, even though both of them are cans.',
        },
        {
          answer: 'Once you have wound a coil and supplied current to it, you have made a magnet, so it stays a magnet afterwards.',
          misconception:
            'Reading "making a magnet" as a one-time act that changes the object permanently, the way baking changes a cake, rather than as something that lasts exactly as long as the current does.',
          correctsTo:
            'An electromagnet is a magnet only while current is flowing in its coil. Stop the current and the magnetism stops with it, which is the whole reason electromagnets are used where a permanent magnet would be useless: a scrapyard crane lifts a car and then drops it on purpose by cutting the current, and nothing mechanical has to let go. That is also the sharpest difference between the two kinds. A permanent magnet is as strong as it is, cannot be switched off, and holds on to whatever it has grabbed. An electromagnet can be made stronger by winding more turns of wire or supplying more current, and it can be switched off completely. WRONG: "You made a magnet, so it stays one." CORRECT: "The coil is a magnet while the current flows, and it is not one when the current stops."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every magnet has a north pole and a south pole. Like poles push apart, and opposite poles pull together.',
        'Poles come in pairs. Cut a bar magnet in half and you get two shorter magnets, each with a north pole and a south pole.',
        'A magnet pulls on iron, steel, nickel and cobalt. It does not pull on aluminum, copper, gold, silver, glass, wood or plastic.',
        'Push-or-pull is the rule for two MAGNETS. A plain steel paperclip is not a magnet, so either pole of a magnet pulls it in.',
        'The magnetic force is stronger when the gap is smaller and when the magnet itself is stronger, and it reaches across the gap without the objects touching.',
        'An electromagnet is a coil of wire that is a magnet only while current flows in it. Stop the current and it stops being a magnet.',
        'An electromagnet is stronger with more turns of wire, with more current supplied, and with an iron rod down the middle of the coil.',
        'To read trial data: compare two trials that differ in exactly ONE thing and read the direction the result moved. A pair that differs in two things tells you nothing about either one.',
        'To choose a next trial: take a trial already run, change only the factor you now want to test, and keep every other condition identical to it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Magnetic Forces & Electromagnets' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
