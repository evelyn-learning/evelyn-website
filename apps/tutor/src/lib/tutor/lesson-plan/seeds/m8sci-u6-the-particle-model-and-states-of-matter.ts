/**
 * Grade 8 Science (Physical Science) — The Particle Model & States of Matter.
 *
 * CONCEPT-LED row 6.1 (NGSS DCI PS1.A). The student has no procedure to run
 * here: the whole lesson installs one mental model — matter is made of tiny
 * particles that never stop moving and that pull on one another, and the three
 * states differ in how far apart those particles sit, how strongly the pulls
 * hold them, and how freely they move — and then reads every everyday property
 * of a solid, a liquid and a gas straight off that model. Shape comes from
 * whether a particle can leave its neighbors; volume comes from whether the
 * particles are touching; how easily a sample squashes comes from whether
 * there is empty space between them.
 *
 * The three errors it is built to kill are (a) the particles of a solid are
 * completely still, (b) the particles themselves change -- growing, shrinking
 * or turning squashy -- when a substance behaves differently, and (c) the gaps
 * between the particles of a gas are filled with air.
 *
 * SCOPE GUARD: this plan explains the properties of solids, liquids and gases
 * (fixed or changing shape and volume, compressibility, flow) by how their
 * particles are spaced, how strongly they attract, and how freely they move --
 * vibrating in place, sliding past each other, or flying apart between
 * collisions. The scope cell carries all three parts. Its lineage clause,
 * verbatim: "The student has already used 'particles spread out' for diffusion
 * into a cell (`m7sci-u2-diffusion-and-osmosis.ts`, LO description read); this
 * row gives the general model, not the cell case." Its withheld clause,
 * verbatim: "Withholds gas laws and pressure-volume-temperature relationships
 * (`chem-u7-gas-laws.ts`, `chem-u7-kinetic-molecular-theory.ts`)." What that
 * means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 5.1 (temperature versus thermal energy) is
 *     ASSUMED, not re-taught: the first worked example cites its definition --
 *     temperature is a measure of the average kinetic energy of a sample's
 *     particles -- once as the assumed definition, then leans on it twice as
 *     evidence (in the correction step of that worked example and again in its
 *     verification step) that a solid whose particles were truly at rest could
 *     not have a temperature. No degree value appears anywhere in this file.
 *     Row 6.2 (changes of state) is NOT entered: this file compares the three states side by side and
 *     never describes a sample going from one state to another, so no
 *     change-of-state verb -- melt, freeze, boil, evaporate, condense -- and no
 *     temperature plateau appears in the authored body. Row 6.3 owns density
 *     and thermal expansion, and the word density appears nowhere in the
 *     authored body; "how much space the same sample takes up" is said in
 *     volume words only.
 *     Row 6.4 (characteristic properties that identify a substance) is not
 *     entered: no melting point, boiling point, solubility or conductivity is
 *     used to identify anything. Unit 7 is not entered either: "particle" is
 *     left deliberately general, and the words atom, molecule, element and
 *     compound do not appear in the authored body.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears -- no water cycle, no weather, no
 *     mantle, no ocean, no atmosphere as a system. Air appears in this file
 *     only as an ordinary gas: in a bike pump, in a sealed jar, in a sealed
 *     syringe, as the still air of a closed room, and in the statement that
 *     air is itself a gas with empty space between its own particles. It is
 *     never the atmosphere and never part of an Earth system.
 *   - GRADE 7 LIFE SCIENCE boundary: this row gives the GENERAL particle model
 *     that Grade 7 used in one special case, so the allowance at this edge is
 *     the spreading of a gas through a room, which is the general model and is
 *     in scope. The cell case is not: the words cell, membrane, organism and
 *     diffusion appear nowhere in this file outside this guard paragraph.
 *   - HS CHEMISTRY boundary (the upward edge, and it is the near one for this
 *     row): the second worked example compresses a sealed sample of gas and
 *     states its volumes in cubic centimeters, which is exactly where a gas law
 *     would begin. It stops short. The word pressure does not appear in the
 *     authored body; no relationship between pressure, volume and temperature
 *     is stated there, in words or in symbols; no formula of any kind appears
 *     there; the spring-back of the plunger is used only as evidence that the
 *     particles were unchanged, and never as a push-versus-volume rule; and absolute temperature, the
 *     kelvin scale, intermolecular forces by name and the ideal gas law are all
 *     absent. The specific structures stopped short of are Boyle's and Charles's
 *     laws and the ideal gas law (pressure times volume equals amount times a
 *     constant times absolute temperature), which are `chem-u7-gas-laws.ts` and
 *     `chem-u7-kinetic-molecular-theory.ts`.
 *   - AP PHYSICS boundary: no force in the authored body carries a size in
 *     newtons, and no speed is stated or computed there. A collision between
 *     gas particles is described only as sending a particle off in a new
 *     direction, never with momentum, energy transfer, or a coefficient of
 *     any kind.
 *
 * NOTE ON RULING 32/36 (examples named in part (i) are burned for items): part
 * (i) of this row's scope cell names NO concrete specimen -- it names the three
 * states, their properties and the three particle behaviors in the abstract --
 * so nothing is burned, and every specimen in this file is fresh. The specimens
 * used in the three items (a liquid poured from a tall glass into a wide dish;
 * a smell crossing a closed, still room; and a stated-property comparison with
 * no object at all) appear in no teaching segment, per ruling 22.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every particle
 * picture in this file is written out in words inside the segment that needs
 * it, and every item is solvable from the text printed inside it. Never write
 * "look at the particle diagram", and never assume the student has a syringe,
 * a bike pump or a bottle of water in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.4 -> 6.1 -> 6.2
 * (`insulators-conductors-and-thermal-design` ->
 * `the-particle-model-and-states-of-matter` ->
 * `changes-of-state-and-thermal-energy`), and both arrays below carry the real
 * neighboring loIds. The two exemplars' empty arrays are a registration-order
 * artifact and are deliberately NOT copied.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U6_THE_PARTICLE_MODEL_AND_STATES_OF_MATTER: LessonPlan = {
  id: 'evelyn.ms.m8sci.the-particle-model-and-states-of-matter.v1',
  title: 'The Particle Model & States of Matter',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.the-particle-model-and-states-of-matter',
      standard: 'M8SCI-6.1',
      description:
        'Explain the properties of solids, liquids and gases (fixed or changing shape and volume, compressibility, flow) by how their particles are spaced, how strongly they attract, and how freely they move -- vibrating in place, sliding past each other, or flying apart between collisions (NGSS DCI PS1.A).',
    },
  ],
  prerequisites: ['m8sci.insulators-conductors-and-thermal-design'],
  followUps: ['m8sci.changes-of-state-and-thermal-energy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put three familiar behaviors side by side -- air that squashes, water that will not, and a block that does neither -- so the student wants one picture that handles all three.',
      script:
        'Think about pumping up a bike tire. You put your thumb over the end of the pump, push the handle down, and it moves: the air inside gives way and ends up in a much smaller space than it started in. Now take a full bottle of water, screw the cap on tight, and squeeze it as hard as you can. The plastic dents, and the water inside does not give way at all. Same hand, same push, and two completely different results from two things that both look like nothing much. Here is a third one. Set a wooden block on a table and walk away; an hour later it is the same size, the same shape and in the same place. Pour that bottle of water into a bowl instead, and without anybody shaping it, it stops being bottle-shaped and becomes bowl-shaped. And a gas does something stranger than either: whatever container you seal it in, it spreads until it is everywhere in that container, corner to corner, with nobody spreading it. Solid, liquid, gas -- three sets of behavior that look unrelated. Today you get one picture that explains all of them at once, and the picture is of what the particles are doing.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-particle-model',
      kind: 'concept',
      goal: 'Install the particle model, then read the three states off it one at a time, and finish with the three questions that turn the model into an answer for any described sample.',
      keyIdeas: [
        'ALL MATTER IS MADE OF PARTICLES FAR TOO SMALL TO SEE, AND THEY NEVER STOP MOVING. A sample of anything -- a coin, the water in a glass, the air in a sealed jar -- is built from enormous numbers of tiny particles, and every one of them is moving all the time. The particles also pull on one another: bring two of them close together and there is an attraction between them. Three questions about those particles decide everything a substance does. How far apart are they? How strongly do the pulls hold them? How freely can they move? One thing never changes, whatever state the substance is in, and it is the thing people get wrong first. WRONG: "A sample takes up more space because its particles got bigger." CORRECT: "The particles stay exactly the same. What changes is how far apart they are and how they are arranged." A single particle is not hard, not runny and not squashy; those words describe what countless particles do together.',
        'IN A SOLID THE PARTICLES ARE PACKED CLOSE AND EACH ONE KEEPS THE SAME NEIGHBORS. The particles of a solid are touching, with almost no space left between them, and the pulls between them are strong enough to hold every particle in one position. Held in place is not the same as stopped: each particle vibrates, shaking back and forth about its own fixed spot without ever leaving it. That one picture gives a solid all three of its everyday properties. It keeps its own shape, because no particle can travel to a new position. It keeps the same volume, because the particles are already touching. And pushing on it barely changes its volume at all, because there is almost no empty space in it to push out. WRONG: "The particles in a solid are completely still." CORRECT: "The particles in a solid vibrate in place; they are held to their positions, not stopped."',
        'IN A LIQUID THE PARTICLES ARE STILL TOUCHING, BUT THEY CAN CHANGE NEIGHBORS. The particles of a liquid are almost as close together as a solid\'s -- still touching, with very little space between them -- but the pulls, while strong enough to hold the particles together as one body, are not strong enough to hold each particle in a fixed position. So the particles slide past one another and swap neighbors constantly while staying in contact. Read the three properties straight off that. A liquid keeps the same volume, because its particles are still touching. It has no shape of its own and takes the shape of whatever holds it, because its particles are free to move to new positions. And it barely squashes, for exactly the reason a solid does not: there is almost no empty space between the particles to take out.',
        'IN A GAS THE PARTICLES ARE FAR APART, AND WHAT IS BETWEEN THEM IS NOTHING AT ALL. The particles of a gas are separated by distances many times their own size, and they move quickly, traveling in straight lines until they collide with each other or with the walls of whatever holds them and set off in a new direction. The pulls between them still exist, but across those distances, at those speeds, they are far too weak to hold the particles together. So a gas has no shape of its own and no volume of its own: its particles keep colliding and changing direction until they are spread through the whole container, however large it is. And a gas squashes easily, because the space between its particles is empty space, and moving the particles closer together takes nothing out of the way. WRONG: "The gaps between the particles of a gas are filled with air." CORRECT: "The gaps are empty. Air is itself a gas, made of its own particles with empty space between them."',
        'HOW TO ANSWER ANY QUESTION ABOUT A STATE: THREE QUESTIONS, IN ORDER. First, are the particles touching? If they are, the sample keeps the same volume when you move it to a different container, and it barely squashes. If they are not, it has no volume of its own: it spreads through its container, and it squashes easily. Second, does each particle keep the same neighbors? If it does, the sample keeps its own shape. If it does not, the sample flows and takes the shape of its container. Third, put the two answers together. Touching and fixed neighbors is a solid. Touching and free to change neighbors is a liquid. Far apart and free is a gas. Anything that flows -- a liquid or a gas -- is called a fluid, and both flow for the same single reason: no particle is locked to its neighbors.',
        'AN ANALOGY, AND WHERE IT BREAKS. Picture a crowded school hallway. In the solid version the hallway is so packed that everybody is shoulder to shoulder and nobody can get past anybody, though everyone is shifting their weight on the spot. In the liquid version the crowd is just as packed, but people are sliding past each other and standing beside different people every few seconds. In the gas version a handful of people are loose in an enormous empty gym, crossing it in straight lines and changing direction only when they bump into somebody or into a wall. The analogy is worth having, and here is its limit, which matters as much as the analogy does: people choose where to go, get tired, and stop. Particles do none of that. They do not decide, they do not aim at anything, and they never run down and stop on their own.',
      ],
      vocabulary: [
        { term: 'particle model', definition: 'the idea that all matter is made of extremely small particles that are always moving and that pull on one another.' },
        { term: 'attraction', definition: 'the pull between two particles that are close together; it is what holds a solid or a liquid together as one body.' },
        { term: 'vibrate', definition: 'to shake back and forth about one fixed position without leaving it, which is what the particles of a solid do.' },
        { term: 'volume', definition: 'the amount of space a sample of matter takes up, measured in units such as cubic centimeters.' },
        { term: 'fluid', definition: 'anything that flows and takes the shape of its container: a liquid or a gas.' },
        { term: 'compress', definition: 'to push a sample into a smaller volume. A gas compresses easily because the space between its particles is empty; a solid or a liquid barely compresses at all.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-are-solid-particles-still',
      kind: 'worked_example',
      problem:
        'A student writes: "The three states are really about movement. In a solid the particles are completely still. In a liquid they have started to move. In a gas they are moving." Say what is right in that account and what is wrong. Then give the correct reason a steel bolt keeps its own shape while a gas sealed in a box does not.',
      steps: [
        'Take the part that is right first, because there is one. A gas really does have particles that move freely all through their container, and that freedom is why a sealed box of gas ends up with gas everywhere in it. Movement is genuinely part of the story, so the student is not starting from nowhere.',
        'Now the part that is wrong, and it is the load-bearing one: the particles of a solid are not still. Every particle in the steel bolt is vibrating -- shaking back and forth about a fixed position -- the whole time the bolt sits on the table. There is a clean argument for that, and it does not need a microscope. You already know from the earlier lesson that temperature is a measure of the average kinetic energy of a sample\'s particles, and kinetic energy is the energy of motion. The bolt has a temperature. So its particles have energy of motion, so they are moving. WRONG: "The particles in a solid are completely still." CORRECT: "The particles in a solid vibrate about fixed positions; they are held in place, not stopped."',
        'The second thing wrong is bigger than a detail: movement on its own does not sort the three states, because the particles are moving in all three. What sorts them is a pair of questions the student\'s account never asks. Are the particles touching? And can each particle travel to a new position and change neighbors? In the bolt the particles are touching AND each one keeps the same neighbors, so no part of the bolt can shift its place relative to the rest -- and that is exactly what having a shape of its own means. In the gas the particles are far apart AND free, so no part of the gas holds its place relative to any other part, and the gas has no shape of its own.',
        'Say the repair in the student\'s own terms. It is not movement that changes from state to state; it is freedom. A particle in a solid moves without going anywhere. A particle in a liquid goes somewhere, but stays in contact with neighbors the whole way. A particle in a gas goes anywhere its container allows.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, three clues of DIFFERENT KINDS that agree that the bolt\'s particles are held in position rather than stopped. The shape evidence: the bolt keeps its own shape however you turn it, which needs fixed positions and says nothing at all about being still. The temperature evidence: the bolt has a temperature, and temperature is the average energy of motion of its particles, so they cannot all be at rest. The squashing evidence: pushing hard on the bolt barely changes its volume, which tells you the particles are already touching -- a third fact again, about spacing rather than about motion or position. Three different kinds of evidence, and together they say "touching, and held in position", which is not the same claim as "still".',
        'Second, change exactly one thing and check that the answer moves. Put the same bolt in a much larger sealed box: nothing happens. Same shape, same volume, and it stays in the one spot you set it down in. Put the gas in that same much larger sealed box and it spreads until it is everywhere inside it. One change of container, two different answers -- and the difference is not how fast anything is moving, it is whether the particles are free to leave their neighbors. If the student were right, and the difference between the states were simply more movement, then the bolt in the big box should at least spread out a little. It does not spread at all.',
      ],
      answer:
        'The student is right that a gas has freely moving particles, and wrong twice. First, the particles in a solid are not still: they vibrate about fixed positions, which is why the bolt has a temperature at all. Second, movement does not separate the three states, because the particles move in all three; what separates them is whether the particles are touching and whether each particle can change neighbors. The steel bolt keeps its own shape because its particles are touching and each is held to the same neighbors. The gas in the box does not, because its particles are far apart and free to move anywhere in the box.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-sealed-syringes',
      kind: 'worked_example',
      problem:
        'Two identical sealed syringes lie side by side, each with its tip plugged so that nothing can get in or out. The first holds 60 cubic centimeters of air and nothing else. The second holds 60 cubic centimeters of water and nothing else. You push each plunger as hard as you can. In the air syringe the plunger slides in until the air fills only 20 cubic centimeters, and when you let go it springs back out to 60 cubic centimeters. In the water syringe the plunger does not visibly move at all. Explain both results with the particle model.',
      steps: [
        'Step one, ask the question that decides squashing: is there empty space between the particles? Everything here turns on that one question, because pushing a sample into a smaller volume means taking space out of it, and the only space that can be taken out is space that was empty in the first place.',
        'Step two, the air. Air is a gas, so its particles are far apart, separated by distances many times their own size, with nothing in between. Pushing the plunger moves those particles closer together into space that was empty, and there is a great deal of it to use, so the plunger travels a long way. Put the numbers on it: the air goes from 60 cubic centimeters to 20 cubic centimeters, and 60 cubic centimeters divided by 20 cubic centimeters is 3, so the same air now fills one third of the volume it started in. Sixty cubic centimeters minus 20 cubic centimeters leaves 40 cubic centimeters, and every bit of that 40 cubic centimeters was empty space, not particles.',
        'Step three, the water. Water is a liquid, so its particles are already touching, with very little space between them. There is almost nothing empty to take out, so however hard you push, the volume changes far too little to see. That is not the plunger being stuck and it is not the water being strong. It is that the particles have nowhere left to go.',
        'Step four, kill the wrong account of the air, because it is the one most people reach for. WRONG: "The air squashed because each air particle was squeezed smaller." CORRECT: "Not one particle changed. The particles were pushed closer together, and it is the empty space between them that got smaller." The spring-back is what settles it: let the plunger go and the air is back in all 60 cubic centimeters, exactly as it began. Nothing about the particles was altered by the push, or the air could not simply return to the volume it started in. The only thing that changed, and then changed back, is how far apart the particles were.',
        'Now the two checks. First, three clues of DIFFERENT KINDS that agree the difference is empty space and not something about the push. The two syringes got the same push from the same hand and only one gave way, so the push is not what separated them. The air returned to its full 60 cubic centimeters the moment the plunger was released, which says the particles are unchanged and only their spacing moved. And the two substances differ in exactly the property the model says should matter -- a gas has empty space between its particles and a liquid does not -- which is the same property that already explained something else about them, that a gas spreads through a container and a liquid does not. Three different kinds of evidence, one answer.',
        'Second, change exactly one thing and watch the answer move. Replace the water with a solid metal rod machined to fill the barrel and push again: the plunger does not move, and for the same reason as the water, because those particles are touching too. Then go the other way and seal only 20 cubic centimeters of air in the barrel to start with. The same hard push still moves the plunger, but through a much shorter distance, because there was less empty space between the particles to take out. The answer moves whenever the amount of empty space moves, and that is what makes the empty space the cause.',
      ],
      answer:
        'Both results come from one question: is there empty space between the particles? The air is a gas, its particles are far apart with empty space between them, and pushing moves them closer together into that space, so the volume falls from 60 cubic centimeters to 20 cubic centimeters -- one third of what it was. The water is a liquid, its particles are already touching, so there is almost no empty space to remove and the volume barely changes however hard you push. In neither syringe did a single particle change size; only the spacing between particles changed, which is why letting go returns the air to 60 cubic centimeters.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-liquid-poured-into-a-dish',
      kind: 'try_yourself',
      problem:
        'A clear liquid is poured from a tall, narrow glass into a wide, shallow dish. In the glass it stood as a tall column; in the dish it spreads out over the bottom and matches the outline of the dish. Measured in each container, the liquid takes up the same amount of space both times: 200 cubic centimeters in the glass and 200 cubic centimeters in the dish. Which explanation of the liquid\'s behavior is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each particle of the liquid changes its own shape to fit the container, flattening out in the wide dish and stretching tall in the narrow glass, so the liquid as a whole ends up matching whatever it was poured into, the way soft clay does.' },
        { id: 'b', text: 'The liquid\'s particles are spread far apart with empty space between them, so they drift outward until they have filled whatever container they are in, which is why the liquid reaches all the way across the wide dish instead of standing in a tall column.' },
        { id: 'c', text: 'The liquid\'s particles settle into a fixed arrangement as soon as the pouring stops, and the arrangement they settle into is the one the container pressed them into while the liquid was still moving, so the liquid then holds that shape the way a solid does.' },
        { id: 'd', text: 'The liquid\'s particles are touching one another, so the space they take up hardly changes, and the pulls between them are weak enough that particles slide past each other and change neighbors, so the liquid flows into the shape of the container.', correct: true },
      ],
      expectedAnswer: 'The liquid\'s particles are touching one another, so the space they take up hardly changes, and the pulls between them are weak enough that particles slide past each other and change neighbors, so the liquid flows into the shape of the container.',
      hints: [
        'Split the question in two. One half asks why the amount of space did not change, and that is a question about how close the particles are to each other. The other half asks why the shape did change, and that is a question about how freely the particles can move.',
        'The particles themselves never change: they do not stretch, flatten, shrink or grow. So look for the explanation in which the only things that change are where the particles are and how freely they move.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-smell-crosses-a-still-room',
      kind: 'try_yourself',
      problem:
        'A small amount of a strong-smelling gas is released in one corner of a closed room. There is no fan running, no window open and no draft, so the air in the room is still. Nobody walks across the room. A few minutes later, a person standing at the far wall can smell it. What has happened, in terms of particles?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The particles of the gas are far apart and moving quickly, and they travel in straight lines until they collide with another particle or with something in the room and set off in a new direction, so over a few minutes they spread through the whole room.', correct: true },
        { id: 'b', text: 'The still air in the room presses in on the gas from every side and squeezes it outward across the floor, because particles on their own cannot travel any distance at all unless something else carries them along, the way smoke only moves when a breeze moves it.' },
        { id: 'c', text: 'The particles of the gas swell up as they leave the corner, and once a particle has grown large enough it stretches far enough across the room to reach the person standing at the far wall, which is how so small an amount can be smelled over so wide an area.' },
        { id: 'd', text: 'The particles of the gas stay in the corner where they were released, and what crosses the room is the smell itself, which is not made of matter and so needs nothing to travel through and nothing to carry it, so nothing has to cross the room at all.' },
      ],
      expectedAnswer: 'The particles of the gas are far apart and moving quickly, and they travel in straight lines until they collide with another particle or with something in the room and set off in a new direction, so over a few minutes they spread through the whole room.',
      hints: [
        'Nothing in this room is carrying anything anywhere: the air is still and nobody is moving. So the explanation has to come from what the gas particles are doing by themselves.',
        'The particles of a gas are far apart and never stop moving, and every collision sends one off in a new direction. Think about what a room full of particles doing that looks like after a few minutes have passed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-true-of-liquid-and-gas-only',
      kind: 'try_yourself',
      problem:
        'A sample of a substance can be a solid, a liquid or a gas. Which one of these statements is true of BOTH a liquid and a gas, and NOT true of a solid?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its particles are moving all the time, never completely still, even when the sample is left alone in a closed container and nothing is done to it at all.' },
        { id: 'b', text: 'Its particles are free to move past one another and end up beside different neighbors, so the sample flows and takes the shape of whatever container is holding it.', correct: true },
        { id: 'c', text: 'There are large empty gaps between its particles, many times the size of the particles themselves, so the sample can be pushed into a much smaller volume than it normally fills.' },
        { id: 'd', text: 'The amount of space the sample takes up stays the same when it is moved into a larger closed container, because its particles are already touching one another.' },
      ],
      expectedAnswer: 'Its particles are free to move past one another and end up beside different neighbors, so the sample flows and takes the shape of whatever container is holding it.',
      hints: [
        'Test every statement twice, once against a liquid and once against a solid. A statement that is true of all three states does not answer this question, and neither does one that is true of a gas alone.',
        'Sort the properties by which question they answer. Whether the particles are touching decides the volume. Whether each particle keeps the same neighbors decides the shape. Whether there is empty space between them decides how far it can be squashed. Which of those three comes out the same for a liquid and a gas but different for a solid?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-what-fills-the-gaps',
      kind: 'misconception_check',
      question:
        'A student writes: "In a gas the particles float around in the air that fills the gaps between them. And the three states are made of three different kinds of particle: hard little grains in a solid, soft runny ones in a liquid, and light wispy ones in a gas." Two different things have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'In a gas the particles float around in the air that fills the gaps between them.',
          misconception:
            'Refusing to let the gaps be empty, because nothing in everyday life is truly empty, so the mind fills the space with the most invisible substance it knows of, which is air.',
          correctsTo:
            'There is nothing at all between the particles of a gas. Air is not a background that other things sit inside; air is itself a gas, made of its own particles with empty space between them, so filling the gaps with air would only raise the same question again about the gaps between the air particles. This matters because it is the reason a gas squashes and a liquid does not. Push on a sealed sample of gas and the particles move closer together into space that was empty, and the volume falls a long way; push on a sealed sample of liquid, whose particles are already touching, and almost nothing happens. WRONG: "The gaps between the particles of a gas are filled with air." CORRECT: "The gaps are empty, and the emptiness is exactly what makes a gas easy to squash."',
        },
        {
          answer: 'The three states are made of three different kinds of particle: hard grains, runny ones, wispy ones.',
          misconception:
            'Handing the particles the properties of the material they build, because it feels as though the hardness of a solid or the wispiness of a gas has to come from something inside its parts.',
          correctsTo:
            'A particle of a substance is the same particle whether that substance is a solid, a liquid or a gas, and a single particle is not hard, not runny and not wispy. Hardness, runniness and wispiness are properties of a whole sample with countless particles in it, and they come from the ARRANGEMENT: how far apart the particles sit, how strongly the pulls between them hold, and whether each particle keeps the same neighbors. A solid is hard because its particles are touching and each is held in one position, not because the particles are little pebbles. A gas is wispy because its particles are far apart with empty space between them, not because the particles are light and thin. WRONG: "A gas is made of wispy particles." CORRECT: "A gas is made of ordinary particles that happen to be far apart and moving freely."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'All matter is made of particles far too small to see. They are always moving, and they pull on one another.',
        'Three things decide the state: how far apart the particles are, how strongly the pulls hold them, and how freely they can move.',
        'Solid: particles touching, each held in one position, vibrating in place. Fixed shape, fixed volume, barely squashes.',
        'Liquid: particles touching but free to slide past one another and change neighbors. Fixed volume, takes the shape of its container, barely squashes.',
        'Gas: particles far apart with empty space between them, traveling in straight lines until they collide. No fixed shape, no fixed volume, spreads through its container, squashes easily.',
        'The particles in a solid are held in place, not stopped. Every state has moving particles; what changes between the states is how free those particles are.',
        'The particles themselves never grow, shrink or change. When a sample takes up more or less space, it is the spacing between the particles that changed.',
        'What is between the particles of a gas is nothing at all -- not air. That empty space is why a gas can be pushed into a much smaller volume and a liquid cannot.',
        'To work out any state question: ask whether the particles are touching, which settles the volume and the squashing, then ask whether each keeps the same neighbors, which settles the shape.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'The Particle Model & States of Matter' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
