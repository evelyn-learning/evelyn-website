/**
 * Grade 8 Science (Physical Science) — Energy Transformations & Conservation.
 *
 * CONCEPT-LED (row 4.3, NGSS DCI PS3.B). There is no procedure the student
 * can lean on here: the whole lesson installs one mental model -- energy
 * changes FORM but the total never changes, and every real chain ends with
 * part of that total as thermal energy spread thinly into the surroundings --
 * and then makes the model survive a world in which batteries go dead, rides
 * get quieter and everything eventually stops. The stopping is the hard part,
 * exactly as it is for the first law, because every chain the student has
 * ever watched looked like energy running out.
 *
 * The trap it is built to kill is "the energy was used up", which the
 * curriculum names for this row. The correction is not a slogan but a habit:
 * keep asking "where did it go?" and do not stop until every bit has a form
 * and an object holding it.
 *
 * SCOPE GUARD: this plan traces energy through a chain, names the form at
 * each step, states that the total is conserved, and says that in every real
 * chain part of the total ends as thermal energy spread into the
 * surroundings, where it is no longer useful but is still there. Its scope
 * cell's lineage clause, verbatim: "The rule that energy is transferred and
 * transformed rather than created is one the student met for organisms in
 * Grade 7 (`m7sci-u4-energy-for-living-things.ts`, LO description read);
 * cited here as a prior example, never re-taught." (The cell carries no
 * "Withholds" clause; the boundaries below are drawn from the curriculum's
 * "Explicitly excluded" list and the contract's quantitative ceiling.) What
 * that means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 4.1 (kinetic energy and how it depends on mass
 *     and speed) is assumed: this file uses the words "kinetic energy" freely
 *     but never says how it depends on mass or on speed, never compares two
 *     objects by either, and never states the double-the-speed ratio. Row 4.2
 *     (potential energy stored by arrangement) is assumed and restated in the
 *     vocabulary list, not re-taught: no arrangement is ranked by how much it
 *     stores, and no item turns on which of two arrangements holds more. Row
 *     4.4 (energy transferred BETWEEN objects when motion changes) is the
 *     neighbor this row is most easily confused with, and the split is the
 *     curriculum's: this file follows energy changing FORM inside one system
 *     and never asks which object gave and which object received. No cue
 *     ball, no bat and ball, and no braking bicycle appears anywhere in it.
 *   - UNIT 5 (THERMAL ENERGY). The phrase "thermal energy spread into the
 *     surroundings" is the point of this row and is used throughout, so the
 *     boundary is drawn inside it: this file never distinguishes temperature
 *     from thermal energy (row 5.1), and never names conduction, convection
 *     or radiation or explains by which of them the thermal energy moved
 *     (row 5.2). "It warmed up" and "it spread out" are as far as it goes.
 *   - ELECTRICAL ENERGY is named as a FORM, because the chain the row's own
 *     scope cell names first runs from a battery to a bulb and cannot be
 *     traced without it. Nothing about electricity as a topic is taught: the
 *     words current, circuit and voltage do not appear, the only
 *     "resistance" anywhere in the file is air resistance, nothing
 *     is computed, and the wires are described only as what carries the
 *     energy from one end of the flashlight to the other. Current electricity
 *     is excluded from this course entirely (curriculum sign-off 6).
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears -- no plate, mantle, current,
 *     water cycle, weather system or climate claim anywhere in the file.
 *   - GRADE 7 LIFE SCIENCE boundary: the rule that a living thing releases
 *     energy that was already stored rather than making energy is cited in
 *     the concept segment in a single sentence, as something the student
 *     already holds, and the sentence immediately after it generalises the
 *     rule away from living things. That is the whole
 *     of the life-science surface. No photosynthesis, no respiration, no
 *     glucose, no cell and no organism is used as a worked example or as an
 *     item.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): no energy in this
 *     file carries a number of joules, and nothing is computed from anything.
 *     The formulas this row stops short of are KE = one half m v squared and
 *     PE = m g h, both `ap-physics-c-mech-energy-momentum.ts`, together with
 *     work = force × distance, which row 4.4 also withholds. Efficiency is
 *     described in words ("a larger share becomes light") and never as a
 *     percentage; the first and second laws of thermodynamics and entropy are
 *     `ap-physics2-thermo.ts` and are not named; q = mcDeltaT is
 *     `chem-u9-specific-heat-calorimetry.ts` and does not appear. Nuclear
 *     energy is in no row of this course, and the salvage file's nuclear
 *     bullet is deliberately not carried.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every chain in
 * this file is written out in words, in order, inside the segment that uses
 * it, and every item is solvable from the text printed inside it. Never write
 * "follow the arrows", and never assume the student has a flashlight, a
 * pendulum or a ball in front of them.
 *
 * NOTE ON SPECIMENS: no specimen is shared between a teaching segment and an
 * assessed item. The teaching segments use a charging phone, a flashlight, a
 * roller coaster, a pendulum and a car engine; the three items use a toy
 * slingshot, a drum and a bouncing ball, and none of those appears in the
 * hook, concept, worked examples, misconception check or recap.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.2 -> 4.3 ->
 * 4.4 (`potential-energy-and-position` ->
 * `energy-transformations-and-conservation` ->
 * `energy-transfer-when-motion-changes`), and both arrays below carry the
 * real neighbor loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U4_ENERGY_TRANSFORMATIONS_AND_CONSERVATION: LessonPlan = {
  id: 'evelyn.ms.m8sci.energy-transformations-and-conservation.v1',
  title: 'Energy Transformations & Conservation',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.energy-transformations-and-conservation',
      standard: 'M8SCI-4.3',
      description:
        'Trace energy through a chain (battery to flashlight, roller coaster hill to hill, a pendulum) naming each form (kinetic, gravitational/elastic/chemical potential, thermal, light, sound), state that the total is conserved while some always ends up as thermal energy spread into the surroundings, and correct "the energy was used up" (NGSS DCI PS3.B).',
    },
  ],
  prerequisites: ['m8sci.potential-energy-and-position'],
  followUps: ['m8sci.energy-transfer-when-motion-changes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from warmth the student has already felt and nobody put there, so the question "where did that energy come from, and is it gone?" is the student\'s question before it is the lesson\'s.',
      script:
        'Leave a phone plugged in to charge for an hour, then unplug it and put your hand flat on the back of it. It is warm. Nobody held a heater against it and it was not sitting in the sun, so that warmth arrived from somewhere, and it arrived while the phone was charging and not at any other time. Here is the part worth stopping on. The charger spent that whole hour pushing energy into the phone, and not all of it ended up stored in the battery. Some of it went straight into warming the phone and the air around it, and it was warming your hand a moment ago. So two questions. Where did that warmth come from? And now that it has spread into the room, is it gone? Most people would say the phone wasted a bit of energy and that the wasted part is simply lost. By the end of today you will be able to take any chain -- a battery lighting a lamp, a coaster running hill to hill, a swing slowing down over the afternoon -- and say what every single bit of the energy turned into and what is holding it now, without once saying that it was used up.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-forms-chains-and-conservation',
      kind: 'concept',
      goal: 'Name the forms, install the routine for tracing a chain, state conservation, and make the thermal ending of every real chain the expected result rather than a disappointment.',
      keyIdeas: [
        'ENERGY COMES IN FORMS, AND A FORM IS JUST A WAY OF HAVING ENERGY. KINETIC energy is the energy something has because it is moving. GRAVITATIONAL POTENTIAL energy is stored because of how high something is; ELASTIC POTENTIAL energy is stored in something stretched or squashed; CHEMICAL POTENTIAL energy is stored in the materials themselves, in a battery or a fuel. You already met those stored kinds in the last lesson, and nothing about how they are stored changes here. THERMAL energy is the energy of the jiggling of the particles an object is made of, and an object warms up when it gains some. LIGHT is energy traveling as a wave, and it can cross empty space. SOUND is energy carried by a vibration passing through air, water or a solid. ELECTRICAL energy is energy carried along wires by moving charges, which is how energy gets from a battery to the part of a device that uses it. What is new today is not the list. It is following one store as it turns into another.',
        'A TRANSFORMATION IS THE SAME ENERGY IN A NEW FORM, AND A CHAIN IS SEVERAL OF THEM IN A ROW. Nothing is added and nothing is removed when energy changes form; the same energy is simply being held a different way, often by a different object. Trace a chain in four moves. First, name the objects the chain runs through, in order, and include the air and the room at the end, because the chain almost always leaves the device. Second, name the form the energy is in at the start, and say which object holds it. Third, step along, saying what became what, and in which object it happened. Fourth -- and this is the move people skip -- do not stop at the interesting part. Keep going until everything has been named, including the parts that got warm and any sound you would have heard.',
        'THE TOTAL NEVER CHANGES, AND THAT IS CONSERVATION OF ENERGY. Add up all the energy in all its forms before a change, add it all up after, and you get the same amount. Energy is never created and never destroyed; it is transferred from one object to another and transformed from one form to another. You already know this rule in one setting: a living thing does not make energy, it releases energy that was already stored in its food. That is not a special rule about living things. It is a rule about everything -- batteries, balls, rides, engines, stars. WRONG: "The flashlight used up the battery\'s energy." CORRECT: "The battery\'s chemical energy became light and thermal energy that spread into the room."',
        'EVERY REAL CHAIN ENDS THE SAME WAY: THERMAL ENERGY SPREAD INTO THE SURROUNDINGS. Wherever two surfaces rub, wherever something pushes through the air, wherever a wire or a bulb warms up, wherever a sound fades away, part of the energy becomes thermal energy in the objects and the air nearby. Expect it. A chain you have traced that does not end this way is a chain you have not finished tracing. And notice what has and has not happened to that part. It is still energy, it still counts in the total, and it is exactly where you left it -- but it is now spread across an enormous number of particles, a tiny amount each, and no device can gather it up again and put it back to work. When people say energy was "wasted" or "lost", that is what they mean, and both words are misleading: spread out and out of reach, never destroyed.',
        'HOW TO CATCH YOURSELF SAYING "USED UP". There is one question, and you ask it over and over until you run out of chain: where did it go? A good answer always names two things, a form and an object holding it -- "thermal energy, in the back of a charging phone and the air around it". "It was used up" names neither, so it is never an answer; it is the sentence you write when you have stopped tracing early. WRONG: "The engine used up the fuel\'s energy." CORRECT: "The chemical potential energy stored in the fuel became kinetic energy of the car, sound, and thermal energy in the engine, the exhaust gases and the air." The second sentence is longer because it is finished.',
      ],
      vocabulary: [
        { term: 'energy transformation', definition: 'a change of energy from one form into another, with the total amount unchanged.' },
        { term: 'conservation of energy', definition: 'the rule that energy is never created and never destroyed, so the total in all its forms stays the same.' },
        { term: 'kinetic energy', definition: 'the energy an object has because it is moving.' },
        { term: 'potential energy', definition: 'energy stored by the arrangement of things: gravitational (because of height), elastic (because something is stretched or squashed), or chemical (stored in the materials themselves).' },
        { term: 'thermal energy', definition: 'the energy of the jiggling of the particles an object is made of; an object warms up when it gains thermal energy.' },
        { term: 'electrical energy', definition: 'energy carried along wires by moving charges, from a source such as a battery to the part of a device that turns it into something else.' },
      ],
      suggestedTools: ['show_flowchart', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-flashlight-chain',
      kind: 'worked_example',
      problem:
        'You switch on a flashlight that runs on two ordinary batteries, and you leave it on. The room gets brighter. After a few minutes the bulb and the metal ring around it are hot to touch, and the batteries are slightly warm. After an hour the light has gone dim, and soon after that the batteries will not light it at all. Trace the energy from the batteries to the end of the chain, and say whether any energy was destroyed along the way.',
      steps: [
        'Move one, name the objects the chain runs through, in order: the batteries, the wires and the switch inside the flashlight, the bulb, and then the room -- the air, the walls, the floor and everything the light lands on. Putting the room on the list at the start is what stops you finishing at the bulb.',
        'Move two, name the starting form. The batteries hold chemical potential energy, stored in the materials inside them. Nothing is moving and nothing is glowing yet, so at this instant that store is the whole of the energy in the chain.',
        'Move three, step along. Closing the switch lets the chemical potential energy in the batteries become electrical energy, carried along the wires to the bulb. At the bulb that electrical energy becomes two forms at once: light, which leaves in every direction, and thermal energy, which is why the bulb and the metal ring around it are hot. Some thermal energy also appears in the batteries and the wires themselves as the energy passes through them, which is why the batteries are warm.',
        'Move four, do not stop at the bulb. Follow the light. It crosses the room and lands on the walls, the floor, the ceiling and everything in it, and those surfaces absorb it. Light that has been absorbed has become thermal energy in whatever absorbed it, spread out very thinly. So the far end of the chain is thermal energy, spread through the flashlight, the air and the whole room.',
        'Now answer what was asked. Nothing was destroyed. Every bit of the chemical potential energy the batteries started with is still here: a very small part of it is still on its way across the room as light at any instant, and essentially all of the rest is thermal energy spread so thinly through the room that you cannot feel it. WRONG: "The flashlight used up the batteries\' energy." CORRECT: "The batteries\' chemical energy became light and thermal energy that spread into the room." A dead battery is not a battery whose energy left the world. It is a battery whose materials have finished changing, so there is no store left inside it for the flashlight to draw on.',
        'Run the checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree that the energy went somewhere rather than nowhere. You can feel one: the bulb, the metal ring and the batteries are all warmer than they were, and warm is what "thermal energy arrived here" feels like. You can see another: the room is brighter, and brightness is energy arriving at every surface in the room. And a controlled comparison agrees with both: an identical flashlight left switched off on a shelf still works weeks later, so what wears the batteries out is not time passing but light and warmth being produced. A feel, a look and a comparison -- three different kinds, one answer.',
        'Second, change one thing and check that the answer moves the way it should. Swap the bulb for an LED that gives about the same brightness and barely warms up. Now a much larger share of the chemical potential energy leaves as light and a much smaller share becomes thermal energy inside the flashlight, and the same two batteries last far longer. Conservation did not change -- the total is still the total. What changed is how that total is split between the forms. And notice what this rules out: if the batteries were simply being consumed at a fixed rate, changing the bulb could not possibly change how long they last.',
      ],
      answer:
        'Chemical potential energy in the batteries becomes electrical energy carried along the wires, and at the bulb it becomes light plus thermal energy, with a little thermal energy appearing in the batteries and wires on the way. The light is then absorbed by the walls, floor and air and becomes thermal energy there too. Nothing was destroyed: the total is exactly what it was, but almost all of it is now thermal energy spread thinly through the room, where no device can gather it back.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-coaster-hill-to-hill',
      kind: 'worked_example',
      problem:
        'A roller coaster car is pulled to the top of the first hill and let go. It races to the bottom, climbs a second hill that is lower than the first, races down again, and climbs a third hill that is lower still. The ride is noisy while it runs, and at the end of the day the wheels and the rails are warm. A student asks why the hills have to keep getting lower, and whether the ride is losing energy. Trace the energy and answer the student.',
      steps: [
        'Move one, name the objects: the car, the track it runs on, and the air it pushes through. The rails and the air belong on the list for the same reason the room did in the last example.',
        'Move two, the starting form. At the top of the first hill the car is high up and barely moving. Almost all of its energy is gravitational potential energy, stored because of how high it is, and only a little is kinetic.',
        'Move three, step along. Going down, gravitational potential energy becomes kinetic energy, and the car speeds up; at the bottom it is moving fastest and the store that height gave it is nearly all kinetic now. Climbing the second hill runs that same change backward: kinetic energy becomes gravitational potential energy again, and the car slows as it rises.',
        'Move four, do not stop at the interesting part -- and here the part people skip is the whole answer to the student. The wheels rub on the rails and the car pushes through the air, the entire way round. Wherever surfaces rub and wherever something pushes through air, part of the energy becomes thermal energy in the wheels, the rails and the air, which is why they are warm at the end of the day, and part becomes sound, which is why the ride is noisy. Both of those parts are still energy, and neither of them can lift the car. So the energy still available to lift the car is smaller at the second hill than it was at the first, and smaller again at the third. That is why the hills have to keep getting lower, and why, once the car has been let go and given no new push, they can never get higher.',
        'WRONG: "The ride loses energy, so the total goes down every time the car goes round." CORRECT: "The total stays exactly the same. Part of it keeps changing into thermal energy and sound, which spread into the rails and the air, and that part can no longer lift the car." Notice that the student\'s question had the right observation in it -- the hills really do get lower -- and only the explanation was wrong.',
        'Run the checks. Three clues of DIFFERENT KINDS agree. The pattern: every hill is lower than the one before, and a ride that is given no new push part-way round never climbs higher than its first hill, which is what you expect if part of the energy keeps leaving the useful pile and never comes back. The warmth: the wheels and rails are warm at the end of the day, and that warmth was not there in the morning. The sound: you can hear the ride from the queue, and sound is energy traveling away through the air. A pattern, a feel and a sound are three different kinds of evidence, and all three point at the same place.',
        'Second, change one thing and check that the answer moves. Take almost all of the rubbing and the air-pushing away. A pendulum -- a heavy weight hanging on a long string, swinging in still air -- comes back to very nearly the height it was released from, swing after swing after swing, and only creeps lower over many minutes. It is the same two forms trading back and forth as on the coaster, with far less rubbing, and the shortfall is far smaller. The size of the shortfall tracks how much rubbing and air-pushing there is. That is exactly what you would see if rubbing and air are where the energy is going, and it is not what you would see if energy simply drained away on its own, which would not care what the string and the air were doing.',
      ],
      answer:
        'At the top of the first hill the car\'s energy is almost all gravitational potential energy. Going down it becomes kinetic energy; climbing, kinetic energy becomes gravitational potential energy again. Every time round, the wheels rubbing on the rails and the car pushing through the air turn part of the energy into thermal energy in the wheels, rails and air, and part into sound. The ride is not losing energy -- the total is unchanged -- but the part now held as thermal energy and sound cannot lift the car, so each hill has to be lower than the one before.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slingshot-chain',
      kind: 'try_yourself',
      problem:
        'You pull the thick elastic band of a toy slingshot as far back as it will go and let it fly. A soft foam ball shoots across the room, thuds into the wall, drops to the floor and lies still. Nothing touches the ball after it leaves the slingshot. Which statement traces the energy correctly, from the stretched band to the ball lying still on the floor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stretched band stored elastic potential energy, and that store was used up a little at a time while the ball was crossing the room, so by the time the ball reached the floor there was none of it left anywhere.' },
        { id: 'b', text: 'The stretched band gave the ball a push, and the ball carried that push inside it as it flew, spending it against the air and then against the wall until the push was gone and the ball had to stop.' },
        { id: 'c', text: 'The elastic potential energy of the stretched band became kinetic energy of the ball, and once the ball had dropped to the floor and come to rest, all of that energy was stored in it again as gravitational potential energy, ready to move it the next time.' },
        { id: 'd', text: 'The elastic potential energy of the stretched band became kinetic energy of the ball, and at the wall and the floor that kinetic energy became sound and thermal energy in the wall, the ball and the air, so the total is unchanged.', correct: true },
      ],
      expectedAnswer: 'The elastic potential energy of the stretched band became kinetic energy of the ball, and at the wall and the floor that kinetic energy became sound and thermal energy in the wall, the ball and the air, so the total is unchanged.',
      hints: [
        'Trace it in moves. Name the objects the chain runs through -- do not forget the wall and the air -- then the form at the start, then each change in order. Keep going until the ball is lying still, and see which statement gets all the way to the end.',
        'The ball lying still is where people stop early. Ask the one question about that moment: where did it go? A finished answer names a form and an object holding it. You heard the thud, so one of the forms is already obvious.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-drum-sound-fades',
      kind: 'try_yourself',
      problem:
        'You hit a drum once, hard. The sound is loud at first, fades over a few seconds, and then the room is quiet again. The drum skin has stopped vibrating and nobody touched it. A student says that the sound energy was destroyed as the sound died away. Where did the energy of the sound actually go?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The vibrating skin passed its energy to the air as a sound wave, and as the wave spread through the room the air, the walls and the objects in it absorbed it, so it ended up as a very small amount of thermal energy spread through the room and the total is unchanged.', correct: true },
        { id: 'b', text: 'The sound energy was destroyed as the wave spread out through the room, because a sound wave grows weaker the farther it travels, and once it has grown too weak for anyone to hear there is nothing left of it at all, in the same way a ripple spreading across a pond flattens out until the water is still again.' },
        { id: 'c', text: 'The sound energy traveled back into the drum as the skin slowed down, and it is stored there now as elastic potential energy in the tightly stretched skin, because a stretched thing is exactly what stores elastic potential energy, waiting to be released the next time somebody hits the drum.' },
        { id: 'd', text: 'The sound energy was used up pushing the air out of the way as the wave moved through the room, which is why you can feel the air move in front of a loud speaker, and once the air had been shifted as far as it would go there was nothing left for the wave to carry.' },
      ],
      expectedAnswer: 'The vibrating skin passed its energy to the air as a sound wave, and as the wave spread through the room the air, the walls and the objects in it absorbed it, so it ended up as a very small amount of thermal energy spread through the room and the total is unchanged.',
      hints: [
        'Sound is energy carried by a vibration passing through the air, so while you could hear it the energy was real and it was somewhere. Follow the wave outward and ask what it reaches.',
        'Think about how every real chain ends. Something absorbed that wave, and an object that absorbs energy warms up, even by an amount far too small to feel. Which statement names a form and an object holding it at the end?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bouncing-ball-heights',
      kind: 'try_yourself',
      problem:
        'A rubber ball is dropped from shoulder height onto a hard floor. It bounces back up, but not as high as it was dropped from. The next bounce is lower still, and after a dozen bounces the ball is rolling across the floor and then lies still. The room is still, so air resistance is small here, and the floor does not move or dent. Why is each bounce lower than the one before, and what happened to the energy?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The ball uses up some of its energy pushing against gravity on the way back up, and since gravity pulls down on it through every single rise, a little more of the store is spent on each one, which is why nothing ever bounces back up to the height it was dropped from.' },
        { id: 'b', text: 'Each time the ball squashes against the floor and springs back, part of its energy becomes thermal energy in the rubber and the floor and a little becomes sound, so less is left as kinetic energy leaving the floor and the ball rises lower; the total is unchanged.', correct: true },
        { id: 'c', text: 'A real ball cannot obey conservation of energy exactly, so a little energy is destroyed on every bounce, and the rule only holds exactly for a perfect ball on a perfect floor with nothing rubbing or squashing anywhere, so the shrinking bounces are the amount by which the real world falls short of the rule.' },
        { id: 'd', text: 'Some of the energy stays locked inside the ball as elastic potential energy from being squashed against the floor, and it stays stored in the rubber for good, so a little less is available to lift the ball on each bounce that follows.' },
      ],
      expectedAnswer: 'Each time the ball squashes against the floor and springs back, part of its energy becomes thermal energy in the rubber and the floor and a little becomes sound, so less is left as kinetic energy leaving the floor and the ball rises lower; the total is unchanged.',
      hints: [
        'The problem tells you air resistance is small and the floor does not move, so the place to look is the moment of contact. What is happening to the rubber then, and what can you hear each time it happens?',
        'Ask where it went, and insist on a form and an object holding it. Squash a piece of rubber over and over and it warms up. Now decide which statement ends with the energy somewhere, rather than ending with it gone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-used-up',
      kind: 'misconception_check',
      question:
        'A student writes: "When the batteries in a flashlight go dead, their energy has been used up and is gone. And energy is only really conserved in a perfect system anyway -- in the real world, some of it is always lost." Two separate things have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'When the batteries go dead, their energy has been used up and is gone.',
          misconception:
            'Treating energy as a fuel that is consumed out of existence, because from the outside a dead battery looks exactly like an empty tank, and because everything we buy energy for does eventually stop working.',
          correctsTo:
            'Energy is never created and never destroyed. Every bit of the chemical potential energy those batteries started with is still in the world. Some of it left the flashlight as light, which the walls and the floor absorbed and which warmed them very slightly; the rest became thermal energy in the bulb, the wires, the batteries themselves and the air around them. The word "dead" describes the store, not the energy: the materials inside the batteries have finished changing, so there is nothing left in them for the flashlight to draw on. The energy is out there in the room, spread so thinly across so much matter that no device can gather it back. The question that catches this every time is "where did it go?", and "used up" is never an answer to it, because it names no form and no object holding it.',
        },
        {
          answer: 'Energy is only really conserved in a perfect system; in the real world some of it is always lost.',
          misconception:
            'Reading the word "lost" literally, and so treating conservation of energy as a tidy classroom rule that real, messy situations are allowed to break a little.',
          correctsTo:
            'Conservation of energy is not an approximation that friction breaks. It holds exactly, in the messiest situation you can find, and the messy situations are where it is most worth using. What a scientist means by "lost" is "no longer useful to us": the energy has become thermal energy spread through the surroundings, a tiny amount held by each of an enormous number of particles, and there is no way to collect it back up and put it to work again. Lost to us, not lost from the world. WRONG: "Friction destroys some of the energy." CORRECT: "Friction turns part of the energy into thermal energy in the two surfaces and the air around them, and the total is unchanged."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Energy comes in forms: kinetic, gravitational potential, elastic potential, chemical potential, thermal, light, sound and electrical. A form is just a way of having energy.',
        'A transformation is the same energy in a new form. Nothing is added and nothing is removed when energy changes form.',
        'Conservation of energy: energy is never created and never destroyed. Add it all up before and after, in every form, and the total is the same.',
        'Trace a chain in four moves: name the objects it runs through including the air and the room, name the starting form, step along saying what became what and in which object, and do not stop until everything is named.',
        'Every real chain ends with part of the energy as thermal energy spread into the surroundings -- wherever surfaces rub, wherever something pushes through air, wherever a wire warms, wherever a sound fades.',
        'That spread-out thermal energy is still there and still counts in the total. It is just shared so thinly between so many particles that no device can gather it back and use it.',
        '"Wasted" and "lost" are misleading words for that part. Spread out and out of reach is not the same as destroyed.',
        'A finished answer names a form and an object holding it: "thermal energy, in the back of a charging phone and the air around it". "It was used up" names neither, so it is never a finished answer.',
        'Keep asking the one question -- where did it go? -- until you run out of chain.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Energy Transformations & Conservation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
