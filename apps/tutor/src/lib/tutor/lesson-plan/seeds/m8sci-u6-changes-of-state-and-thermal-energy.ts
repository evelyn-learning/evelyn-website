/**
 * Grade 8 Science (Physical Science) — Changes of State & Thermal Energy.
 *
 * Row 6.2, concept-led. There is no procedure to lean on: the lesson installs
 * one idea and then makes it survive the student's own experience. The idea is
 * that thermal energy arriving at a pure substance does one of exactly two
 * jobs -- it speeds the particles up, which a thermometer reports, or it pulls
 * the particles away from one another, which a thermometer does not report at
 * all. The consequence is the one that sounds wrong the first time it is said:
 * while a pure substance is changing state, energy pours in and the
 * temperature does not move.
 *
 * The two traps it is built to kill are (a) energy-arriving-always-raises-the-
 * temperature, which shows up as "turn the burner up and the boiling water
 * gets hotter", and (b) ice-to-water-is-chemical, the reading of a dramatic
 * property difference as a difference in substance.
 *
 * SCOPE GUARD: this plan predicts and describes what happens to particle
 * motion, temperature and state of a PURE substance as thermal energy is added
 * or removed -- melting, freezing, evaporation, boiling, condensation -- and
 * its centerpiece is that the temperature holds steady while a change of state
 * is under way, because the energy arriving or leaving is going into the
 * spacing between particles rather than into their speed. The scope cell's
 * lineage clause, verbatim: "Grade 6's water cycle
 * (`m6sci-u7-the-water-cycle-evaporation-condensation-precipitation.ts`, LO
 * description read) is cited as one example only." Its withheld clause,
 * verbatim: "Withholds heating-curve arithmetic, q = mΔH, and vapor
 * pressure (`chem-u7-phase-changes-heating-curves.ts`)." Every absence claimed
 * below is claimed of the plan's AUTHORED TEXT -- the objective, the segments
 * and the metadata -- and not of this guard or of the chain loIds, which
 * necessarily name the neighboring rows. What each edge means, and what is
 * deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 6.1 (the particle model and the states of matter)
 *     is the previous row and is assumed, not re-taught: the states appear only
 *     in the clause that says what the particles are doing before and after a
 *     change -- locked in place, sliding past one another, or flying apart
 *     between collisions -- and no key idea, worked example or item asks the
 *     student to explain a property of a solid, a liquid or a gas from the
 *     model. Row 6.3 (density, thermal expansion and why warm fluids rise) is
 *     the next row and is not entered: the words density, dense, expand and
 *     volume appear in no authored string, nothing here says a sample takes up
 *     more or less room than it did, and nothing floats or sinks. The only
 *     thing described as rising in a fluid is a bubble in a boiling liquid,
 *     stated as an observation in one WRONG/CORRECT pair whose point is what
 *     the bubble is MADE OF; why anything rises in a fluid is never explained.
 *     Row 5.1 (temperature versus thermal energy) is assumed: temperature is
 *     stated once, in the first key idea, to be a measure of the average
 *     kinetic energy of the particles and is then used in that sense twice more
 *     inside the worked examples; thermal energy is defined once, in the
 *     vocabulary list, and used as a known term everywhere else. Neither is
 *     re-taught or re-argued, and no sample's thermal energy is compared with
 *     another's. Row 5.2 (conduction, convection and radiation) is not touched:
 *     energy is said to move from the warmer thing to the cooler one, which is
 *     the direction rule this row needs, and HOW it moves is never named or
 *     described -- the words conduction, convection and radiation appear in no
 *     authored string. Row 6.4 (characteristic properties identify a substance)
 *     is not entered: melting and boiling temperatures are used to PREDICT what
 *     a named or stipulated sample will do, never to identify an unknown one.
 *     Row 8.1 (evidence of a chemical reaction) owns the physical-versus-
 *     chemical verdict; this file states that a change of state is a physical
 *     change and says why, and never lists a sign of a chemical reaction, never
 *     classifies any other change, and never uses the word reaction.
 *   - GRADE 6 EARTH & SPACE SCIENCE. The water cycle is named in exactly one
 *     sentence, in the concept segment, to say that the evaporation and
 *     condensation the student already knows from it are these same two changes
 *     of state running on an enormous scale. No cloud, runoff, groundwater,
 *     weather or Earth system appears; the string "rain" occurs once and only
 *     inside "rainwater", naming where a puddle came from. The cycle is never
 *     modeled or described as a system, and no other Earth-systems content is
 *     in scope for this row.
 *   - GRADE 7 LIFE SCIENCE. No life-science content is in scope for this row.
 *     Three phrases touch a human body at all, and all three are everyday: wet
 *     hair drying in a cool room, a liquid you can pour through your fingers,
 *     and the one that carries any content -- evaporation leaves the liquid
 *     behind it cooler, which is why sweat cools your skin. None of the three
 *     names a cell, organ, tissue, organism or body system, and none goes
 *     further than the sentence it sits in.
 *   - HS CHEMISTRY / AP PHYSICS above. What this row stops short of, by name:
 *     q = mΔH and any heat-of-fusion or heat-of-vaporization quantity; any
 *     amount of energy, in joules or in any other unit, for any stage of any
 *     warming or cooling; the heating-curve arithmetic that computes how much
 *     energy a stage takes; vapor pressure, boiling temperature as a function
 *     of pressure, and altitude, which is why every boiling claim in this file
 *     is pinned to sea level instead; the gas laws and any pressure-volume-
 *     temperature relationship; the kelvin scale and absolute temperature; and
 *     specific heat and q = mcΔT. The only arithmetic anywhere in the file
 *     is the difference between two thermometer readings in degrees Celsius,
 *     the length of a stretch in minutes, and one halving of a duration.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * temperature record in this file is written out in words inside the item that
 * uses it, and every item is solvable from the text printed inside it. Never
 * write "look at the heating curve", and never assume the student has a pan, a
 * burner, a thermometer or a freezer in front of them.
 *
 * NOTE ON BURNED SPECIMENS (controller ruling 36): part (i) of this row's scope
 * cell names the five changes of state and no concrete specimen, so the
 * student-facing objective burns nothing. Inside the file, the iced drink
 * (hook), the burner turned up (concept and misconception check), Sample A's
 * heating record (worked example 1) and the cup of water put into a freezer
 * (worked example 2) are TEACHING specimens and must not be reused in an item.
 * The three items use a sidewalk puddle, an unnamed pure substance melting at
 * 62 degrees Celsius, and a block of ice taken all the way to boiling on a camp
 * stove; none of those three appears in any teaching segment.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 6.1 -> 6.2 -> 6.3
 * (`the-particle-model-and-states-of-matter` ->
 * `changes-of-state-and-thermal-energy` ->
 * `density-thermal-expansion-and-why-warm-fluids-rise`). Both arrays carry the
 * real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U6_CHANGES_OF_STATE_AND_THERMAL_ENERGY: LessonPlan = {
  id: 'evelyn.ms.m8sci.changes-of-state-and-thermal-energy.v1',
  title: 'Changes of State & Thermal Energy',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.changes-of-state-and-thermal-energy',
      standard: 'M8SCI-6.2',
      description:
        'Predict and describe what happens to particle motion, temperature and state of a pure substance as thermal energy is added or removed -- melting, freezing, evaporation, boiling, condensation -- including that the temperature STAYS CONSTANT while a change of state is under way because the energy is going into breaking particles apart, not into speeding them up (NGSS MS-PS1-4).',
    },
  ],
  prerequisites: ['m8sci.the-particle-model-and-states-of-matter'],
  followUps: ['m8sci.density-thermal-expansion-and-why-warm-fluids-rise'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from an everyday observation the student has already made -- a drink with ice in it stays cold instead of warming up bit by bit -- so that the missing energy becomes a question worth answering.',
      script:
        'On a hot day you drop three ice cubes into a glass of lemonade, and the drink goes cold within a minute. Here is the part worth noticing, and you have seen it a hundred times without stopping on it: for as long as there is still ice left in that glass, the drink stays cold. It does not creep back toward room temperature a little at a time. It stays put. Meanwhile the warm kitchen air is pouring energy into that glass every single second, because the air is warmer than the drink and thermal energy always moves from the warmer thing to the cooler one. So energy is going in, steadily, for ten or fifteen minutes -- and the reading on a thermometer stuck in the glass barely moves until the last piece of ice has gone. Only then does the drink start to warm up. Energy does not vanish, so all that energy went somewhere. Today you will find out exactly where, and the same answer will explain something you may also have noticed at a stove: water at a hard rolling boil is no hotter than water at a gentle one.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-jobs-for-arriving-energy',
      kind: 'concept',
      goal: 'Install the two-jobs rule for arriving energy, name the five changes of state with what the particles do in each and which way the energy flows, establish the temperature plateau and its reason, separate evaporation from boiling, and fix the change as physical.',
      keyIdeas: [
        'ENERGY ARRIVING AT A PURE SUBSTANCE DOES ONE OF TWO JOBS, AND NEVER BOTH AT ONCE. You already know that the particles of any substance are always moving, and that temperature is a measure of the average kinetic energy of those particles -- the faster they move on average, the higher a thermometer reads. Now send thermal energy into a pure substance and follow what happens to that energy. Either it makes the particles move faster, in which case the temperature rises and the substance stays in the state it was already in; or it pulls the particles away from one another, against the attraction that was holding them together, in which case the state changes and the temperature does not move at all. Which job the energy does is not something the substance decides. It depends only on whether the sample has reached one of the temperatures at which it changes state.',
        'FIVE CHANGES OF STATE, AND WHICH WAY THE ENERGY IS GOING IN EACH. Adding thermal energy runs three of them. MELTING takes a solid to a liquid: the particles gain enough motion to break out of their fixed positions and begin sliding past one another, while staying close together. EVAPORATION and BOILING both take a liquid to a gas: particles separate from their neighbors completely and fly apart between collisions. Removing thermal energy runs the other two, which are those same changes going backward. CONDENSATION takes a gas to a liquid: particles that have slowed enough are caught by the attraction of their neighbors and gather together. FREEZING takes a liquid to a solid: particles slower still settle into fixed positions and only vibrate in place. Melting and freezing are one change in two directions, and for a pure substance they happen at the same temperature -- water at sea level melts at 0 degrees Celsius and freezes at 0 degrees Celsius. The pair you already know from the water cycle, evaporation and condensation, is this same pairing running on an enormous scale; the cycle is not our subject here, the change of state itself is.',
        'WHILE A CHANGE OF STATE IS UNDER WAY, THE TEMPERATURE STAYS PUT. This is the heart of the lesson. Water boiling in an open pan at sea level sits at 100 degrees Celsius, and it sits there whether the burner is on the lowest setting that keeps it boiling or turned all the way up. Turning the burner up does not make the water hotter. It makes the water boil FASTER -- more of the liquid turns to gas each minute -- because energy is arriving faster and every bit of it is going into separating particles from one another. A thermometer only ever reports how fast the particles are moving, so energy spent on spacing is energy a thermometer cannot see. The steady reading lasts exactly as long as the change does: the moment the last of the liquid has turned to gas, the arriving energy has nothing left to separate, it goes back to speeding particles up, and the reading starts climbing again. One condition matters and is easy to skip: this flat stretch belongs to a PURE substance. A mixture such as salt water does not hold one single steady temperature while it changes state.',
        'EVAPORATION IS NOT BOILING, AND THE BUBBLES ARE NOT AIR. The particles in a liquid do not all move at the same speed; some are faster than the average and some slower. At the surface, a particle that happens to be moving fast enough can escape the pull of its neighbors and leave as a gas, and that can happen at temperatures far below boiling. That is EVAPORATION; it happens only at the surface, and it is why wet hair dries in a cool room and why a damp towel left on a hook is dry by morning. The particles it leaves behind are on average slower than the ones that left, so the liquid left behind is cooler -- which is why sweat cools your skin. BOILING is the other route and it is different: when a pure liquid reaches its boiling temperature, the change happens all through the liquid rather than only at the top. WRONG: "The bubbles that rise through a pan of boiling water are air that was dissolved in the water." CORRECT: "Those bubbles are water that has turned to gas, forming all through the liquid, not only at its surface."',
        'THE SPACING AND THE MOTION CHANGE. THE PARTICLES THEMSELVES NEVER DO. When we say that arriving energy pulls particles apart, we mean pulling them away FROM ONE ANOTHER -- separating neighbors that were attracting each other. We do not mean splitting a particle into pieces, and nothing in a change of state does that. Ice, liquid water and the gas above a boiling pan are all the same substance, H two O -- two hydrogen atoms and one oxygen atom (H2O). The particles do not swell when they are heated, they do not shrink when they are cooled, they do not break, and they do not turn into anything else. What changes is how far apart they are, how fast they move, and whether they are locked in place, sliding past one another, or flying apart between collisions. That is exactly why every change of state is a PHYSICAL change: the substance you end with is the substance you started with, and running the energy the other way brings the original state straight back.',
        'HOW TO WORK OUT WHAT ANY SAMPLE WILL DO. First, name the substance and check that it is pure. Second, say which way the thermal energy is moving: into the sample, because its surroundings are warmer, or out of it, because they are cooler. Third, ask the one question that decides everything -- is the sample sitting at one of its change-of-state temperatures right now? If it is not, the energy is going into particle speed: the reading moves, up if energy is coming in and down if it is leaving, and the state stays as it is. If it is, the energy is going into particle spacing: the state changes, and the reading holds steady until the whole sample has finished changing. Fourth, check your answer by running the energy the other way and confirming that the prediction reverses with it.',
      ],
      vocabulary: [
        { term: 'thermal energy', definition: 'the total energy of the motion of all the particles in a sample; it moves from a warmer object to a cooler one.' },
        { term: 'change of state', definition: 'a change between solid, liquid and gas in which the particles are spaced and moving differently but the substance stays the same.' },
        { term: 'melting point', definition: 'the temperature at which a pure substance changes between solid and liquid; going the other way, at the same temperature, it is called the freezing point.' },
        { term: 'evaporation', definition: 'the escape of faster-than-average particles from the SURFACE of a liquid into the gas state, at temperatures well below boiling.' },
        { term: 'boiling point', definition: 'the temperature at which a pure liquid turns to gas all the way through, not only at its surface.' },
        { term: 'condensation', definition: 'the change from gas to liquid, which happens as particles slow down enough for the attraction of their neighbors to gather them together.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sample-a-heating-record',
      kind: 'worked_example',
      problem:
        'Sample A is a pure substance. It begins as a solid at 20 degrees Celsius, and a heater that delivers energy at the same steady rate is switched on under it and never adjusted. A thermometer sitting in the sample is read every two minutes, and this is the whole record. From the start to minute 6 the reading climbs steadily from 20 degrees Celsius to 80 degrees Celsius. From minute 6 to minute 16 the reading stays at 80 degrees Celsius, and over those ten minutes the solid gradually disappears until the container holds nothing but liquid. From minute 16 onward the reading climbs steadily again. Say what the heater\'s energy was doing in each of the three stretches, and explain why the middle one is flat.',
      steps: [
        'Set up the two facts that hold for the whole record. The substance is pure, which is the condition the flat-stretch rule needs. And the energy is arriving at the same steady rate from the first second to the last, because the heater was never turned off or turned down. So nothing that changes during the record can be explained by the heater changing, and any explanation that says the energy stopped arriving is ruled out before we start.',
        'Stretch one, the start to minute 6. The sample is a solid and it is not at a change-of-state temperature yet, so the arriving energy is doing the first of the two jobs: making the particles vibrate faster in their fixed positions. Faster particles mean a higher average kinetic energy, and that is exactly what a thermometer reports, so the reading climbs. It climbs from 20 degrees Celsius to 80 degrees Celsius, a rise of 60 degrees Celsius in 6 minutes.',
        'Stretch two, minute 6 to minute 16. The sample has reached 80 degrees Celsius, which the record itself tells us is this substance\'s melting point, because that is where the solid starts turning to liquid. Now the arriving energy switches to the second job: pulling particles out of their fixed positions and away from their neighbors so they can slide past one another. Energy spent that way does not make the particles move faster, and a thermometer reports nothing but particle speed, so the reading holds at 80 degrees Celsius. It holds for the full 10 minutes from minute 6 to minute 16, which is exactly how long the melting takes.',
        'Stretch three, minute 16 onward. The last of the solid is gone, so there is nothing left to pull out of a fixed position. The arriving energy goes back to the first job, speeding up particles that are now sliding past one another as a liquid, and the reading climbs again.',
        'WRONG: "The heater must have weakened between minute 6 and minute 16, because otherwise the temperature would have kept going up." CORRECT: "The heater delivered energy at the same rate the whole time. During those ten minutes the energy went into separating particles instead of speeding them up, and a thermometer cannot see energy spent that way."',
        'Now run the two checks a science answer needs, because the only arithmetic here is the subtraction of one reading from another, and redoing that subtraction cannot tell you whether the explanation is right. First, look for clues of DIFFERENT KINDS that agree. The energy bookkeeping says energy kept arriving at the same rate throughout, so it has to have gone somewhere during the flat stretch. The direct observation of the sample agrees: the solid was disappearing during exactly that stretch and was completely gone at the moment the reading started rising again. And a third kind of clue comes from the rule\'s own condition rather than from any observation: Sample A is stated to be pure, and a pure substance is exactly the case that holds one single steady temperature all the way through a change of state, so a flat stretch is what the rule predicts here and a slow drift is what it would have predicted for a mixture. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should -- and, just as usefully, that the right part of it does not. Suppose the heater had delivered energy twice as fast, with none of it leaking away to the room. Then the melting would have been finished in about half the time: a flat stretch of about 5 minutes instead of 10 minutes. But it would have sat at exactly the same 80 degrees Celsius, because the temperature at which this substance melts is a property of the substance and has nothing to do with how fast energy is arriving. Now reverse the direction instead: take the finished liquid and cool it steadily in a cold room. The reading falls until it reaches 80 degrees Celsius, then holds there while the liquid freezes, then falls again. Same temperature, same flat stretch, energy leaving instead of arriving. The length of the flat stretch moved when the rate moved; its temperature did not, and it should not have.',
      ],
      answer:
        'In the first stretch the energy made the solid\'s particles vibrate faster, so the reading climbed from 20 degrees Celsius to 80 degrees Celsius. In the middle stretch the sample was at its melting point, so the same steady supply of energy went into pulling particles out of their fixed positions rather than into speeding them up; a thermometer reports only particle speed, so the reading held at 80 degrees Celsius for all ten minutes the melting took. In the third stretch the solid was gone, the energy went back to speeding up particles, and the reading climbed again.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cup-into-a-freezer',
      kind: 'worked_example',
      problem:
        'A cup of pure water at 20 degrees Celsius is put into a freezer whose air is held at -8 degrees Celsius, and left there for several hours. A student predicts: "The reading will drop straight down from 20 degrees Celsius to -8 degrees Celsius, and somewhere along the way the water will turn into ice." Say what a thermometer in the cup will actually do, what the particles are doing at each stage, and where the student\'s prediction goes wrong.',
      steps: [
        'Start with the direction the energy is moving, because everything else follows from it. The freezer air is colder than the water, and thermal energy moves from the warmer thing to the cooler one, so energy leaves the water and goes into the freezer -- continuously, for as long as the water is warmer than the air around it. Say it that way round and keep saying it. Nothing called cold moves into the cup. There is no such thing as cold moving anywhere; there is only thermal energy leaving.',
        'Stage one, from 20 degrees Celsius down to 0 degrees Celsius. The water is a liquid and it is not at a change-of-state temperature, so the energy leaving is coming out of the motion of the particles. They slow down, their average kinetic energy falls, and the reading falls with it -- a drop of 20 degrees Celsius, from 20 degrees Celsius to 0 degrees Celsius.',
        'Stage two, at 0 degrees Celsius. This is the freezing point of water at sea level, and the reading now stops falling even though energy has not stopped leaving. The energy going out is now coming from particles settling into fixed positions and being held there by the attraction of their neighbors, not from the particles slowing down. Average particle speed is what a thermometer reports, so the reading holds at exactly 0 degrees Celsius for as long as any liquid is left. This stage can last a long time, and during all of it the cup holds ice and liquid water together, both at 0 degrees Celsius.',
        'Stage three, from 0 degrees Celsius down to -8 degrees Celsius. The last of the liquid has frozen, so there is nothing left to settle into position. Energy leaving the ice now comes out of particle motion again: the particles vibrate more and more slowly in their fixed positions and the reading falls. It stops falling at -8 degrees Celsius, because once the ice is as cold as the freezer air neither one is warmer than the other, and there is no longer any net movement of energy between them.',
        'WRONG: "It drops straight down and turns to ice somewhere along the way." CORRECT: "It drops to 0 degrees Celsius, holds at exactly 0 degrees Celsius for the whole time it is freezing, and only then drops the rest of the way to -8 degrees Celsius." The student has the beginning and the end right and the shape of the middle wrong, and the middle is where the freezing actually happens.',
        'Now the two checks. First, three clues of DIFFERENT KINDS that agree. The energy bookkeeping: the freezer never stops taking energy out, so during the flat stretch that energy has to be coming from somewhere, and the only place left is the particles being gathered into fixed positions. The direct observation: the flat stretch begins at the moment the first ice appears and ends at the moment the last liquid is gone, which lines the plateau up with the change and not with the clock. And the reverse-direction match: take that ice out and let it melt in a warm room, and the reading holds at exactly the same 0 degrees Celsius on the way back up, which tells you the flat temperature is a property of water and not something the freezer imposed. Second, change one condition and watch the answer move. Put the same cup in a room at 5 degrees Celsius instead of in the freezer. Energy still leaves the water, because 5 degrees Celsius is cooler than 20 degrees Celsius, so the reading still falls -- but it stops at 5 degrees Celsius, never reaches 0 degrees Celsius, and the water never freezes at all. No change of state, no flat stretch. The plateau shows up only when the sample actually arrives at a change-of-state temperature.',
      ],
      answer:
        'The reading falls from 20 degrees Celsius to 0 degrees Celsius as the liquid\'s particles slow down; it then holds at exactly 0 degrees Celsius for the whole time the water is freezing, because the energy still leaving the cup is coming from particles settling into fixed positions rather than from particles slowing; and once the last liquid has frozen it falls again, from 0 degrees Celsius to -8 degrees Celsius, where it stops because the ice is then as cold as the freezer air. The student was right about where it starts and where it ends and wrong about the middle: the cooling is not straight down, and the freezing happens during the flat stretch.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-puddle-on-the-sidewalk',
      kind: 'try_yourself',
      problem:
        'A shallow puddle of rainwater lies on a sidewalk. Over one mild afternoon it slowly shrinks, and by evening it is gone, leaving the sidewalk dry. The air that day never rose above about 20 degrees Celsius, and the water in the puddle was never anywhere close to 100 degrees Celsius. Which statement correctly explains what happened to the water?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The water evaporated: particles at the surface that happened to be moving faster than the average escaped the pull of their neighbors and left as a gas, which a liquid can do at temperatures well below its boiling point.', correct: true },
        { id: 'b', text: 'The water boiled away in a thin layer at the very top, because the sun heated the surface of the puddle all the way to 100 degrees Celsius even though the air and the water underneath it stayed much cooler than that.' },
        { id: 'c', text: 'The water particles broke apart into pieces far too small to see, which is what lets a liquid vanish into the air on a day when it was never heated to its boiling point.' },
        { id: 'd', text: 'The water turned into air: a liquid left out in the open gradually becomes the same substance as the air around it, which is why nothing at all is left behind on the sidewalk.' },
      ],
      expectedAnswer: 'The water evaporated: particles at the surface that happened to be moving faster than the average escaped the pull of their neighbors and left as a gas, which a liquid can do at temperatures well below its boiling point.',
      hints: [
        'Check the temperature first. Boiling happens at one particular temperature, and this water never came close to it. So ask whether boiling is the only way a liquid can turn into a gas.',
        'The particles in a liquid do not all move at the same speed. Think about what the fastest ones at the surface are able to do -- and remember that no change of state ever breaks a particle into pieces or turns it into a different substance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-flat-stretch-at-62',
      kind: 'try_yourself',
      problem:
        'A pure substance is warmed by a heater that delivers energy at the same steady rate from start to finish and is never adjusted. A thermometer in the sample reads 40 degrees Celsius at the start and climbs steadily to 62 degrees Celsius. It then stays at exactly 62 degrees Celsius for six minutes, and during those six minutes the last of the solid turns to liquid. After that the reading climbs steadily again. What was happening during the six minutes at 62 degrees Celsius?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The heater must have stopped delivering energy for those six minutes, because a sample with energy arriving the whole time gets hotter the whole time, so a reading that holds still can only mean that the supply of energy was interrupted for a while and then came back.' },
        { id: 'b', text: 'The arriving energy was pulling particles out of their fixed positions so they could slide past one another, and energy spent that way does not make particles move faster, so the average particle speed -- and the reading -- held steady until the last of the solid had melted.', correct: true },
        { id: 'c', text: 'The sample had reached the hottest temperature a solid of that substance is able to reach, and it simply had to wait at that temperature until enough time had passed for the melting to work its way through the whole sample, because melting takes time rather than energy.' },
        { id: 'd', text: 'The thermometer was sitting in the solid part of the sample, and a solid cannot read higher than the temperature at which it melts, so the liquid forming around it was in fact getting hotter for all six minutes and the reading was simply not picking that up.' },
      ],
      expectedAnswer: 'The arriving energy was pulling particles out of their fixed positions so they could slide past one another, and energy spent that way does not make particles move faster, so the average particle speed -- and the reading -- held steady until the last of the solid had melted.',
      hints: [
        'The heater was never adjusted, so energy was arriving at the same rate during all three stretches, flat one included. Ask where that energy went during the flat stretch, since it certainly did not stop arriving.',
        'Energy arriving at a sample can do one of two jobs: make the particles move faster, or pull them away from one another. Only one of those two jobs is something a thermometer can report.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ice-block-to-steam',
      kind: 'try_yourself',
      problem:
        'A block of ice that has been sitting in an unheated shed is at -12 degrees Celsius. It is put into a pot on a camp stove at sea level, and the stove is left on one setting until every bit of the water has boiled away as gas. Which prediction of what a thermometer in the pot would read, from the first moment to the last, is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The reading rises steadily from -12 degrees Celsius all the way to 100 degrees Celsius without ever pausing, because the stove is delivering energy at the same rate the whole time and energy arriving always raises the temperature of whatever it arrives at.' },
        { id: 'b', text: 'The reading rises from -12 degrees Celsius to 0 degrees Celsius and then falls back below 0 degrees Celsius while the ice melts, because melting is a change that cools a sample down, and only once all the ice is liquid does the reading climb toward 100 degrees Celsius.' },
        { id: 'c', text: 'The reading rises from -12 degrees Celsius to 0 degrees Celsius, holds at 0 degrees Celsius while the ice melts, rises from 0 degrees Celsius to 100 degrees Celsius once only liquid is left, and holds at 100 degrees Celsius while the water boils away.', correct: true },
        { id: 'd', text: 'The reading rises from -12 degrees Celsius to 0 degrees Celsius, holds at 0 degrees Celsius while the ice melts, and then climbs straight past 100 degrees Celsius without pausing at all, because a liquid turning into a gas is far too quick a change for a reading to hold still during it.' },
      ],
      expectedAnswer: 'The reading rises from -12 degrees Celsius to 0 degrees Celsius, holds at 0 degrees Celsius while the ice melts, rises from 0 degrees Celsius to 100 degrees Celsius once only liquid is left, and holds at 100 degrees Celsius while the water boils away.',
      hints: [
        'Walk through the block one stage at a time, and at each stage ask the deciding question: is the sample sitting at a temperature where it changes state right now, or is it between changes?',
        'There are two changes of state on the way from a cold solid to a gas, and a thermometer does the same thing during each of them. Melting takes energy IN; it never gives energy up, and it never cools a sample down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-burner-higher-and-melting-chemical',
      kind: 'misconception_check',
      question:
        'A student writes: "If you want boiling water to get hotter, turn the burner up higher. And melting an ice cube has to be a chemical change, because ice and water are two completely different things." Two separate ideas have gone wrong there. What are they?',
      commonErrors: [
        {
          answer: 'Turning the burner up higher makes boiling water hotter.',
          misconception:
            'Treating the burner setting as a dial that sets the temperature, because at every stage before the boil that is exactly how it behaves -- more energy in, a higher reading -- so there is nothing to warn the student that the rule stops working.',
          correctsTo:
            'Water boiling in an open pan at sea level sits at 100 degrees Celsius, and it sits there on the lowest setting that keeps it boiling and on the highest setting the stove has. The reason is the two-jobs rule. Once a pure substance has reached a temperature at which it changes state, every bit of arriving energy goes into pulling particles away from one another instead of into making them move faster, and a thermometer reports nothing but how fast the particles are moving. Turning the burner up does change something real, and it is worth saying what: more energy arrives each minute, so more of the liquid turns to gas each minute and the pan boils dry sooner. WRONG: "A higher setting makes the water hotter." CORRECT: "A higher setting makes the water boil faster, and the water stays at 100 degrees Celsius until the last of it has gone."',
        },
        {
          answer: 'Melting an ice cube is a chemical change, because ice and water are two completely different things.',
          misconception:
            'Reading a dramatic difference in properties as a difference in substance, because a hard, cold, rigid solid and a liquid you can pour through your fingers do not feel like the same material at all.',
          correctsTo:
            'Ice and liquid water are the same substance in two states. Both are H two O -- two hydrogen atoms and one oxygen atom (H2O). In the ice those particles are held in fixed positions and only vibrate there; in the liquid the very same particles are still close together but slide past one another. Not one particle is broken, changed or replaced, and that is exactly why a change of state is a PHYSICAL change. The check is to run the energy the other way: put the melted water back into a freezer, take energy out of it, and ice is back, behaving exactly as the ice you started with. WRONG: "The ice turned into a different thing." CORRECT: "The same water changed state, because arriving energy pulled its particles out of their fixed positions."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Energy arriving at a pure substance does one of two jobs: it makes the particles move faster, so the temperature rises, or it pulls the particles away from one another, so the state changes. It never does both at the same time.',
        'While a pure substance is changing state, its temperature stays put. The reading starts moving again only once the whole sample has finished changing.',
        'Water at sea level melts and freezes at 0 degrees Celsius, and boils and condenses at 100 degrees Celsius.',
        'Turning the burner up under boiling water does not make it hotter. It makes it boil faster, because more energy arrives each minute and all of it goes into separating particles.',
        'Melting, evaporation and boiling take thermal energy IN. Condensation and freezing give thermal energy OUT, and they are those same changes running backward.',
        'Evaporation happens at the surface, at temperatures well below boiling, when faster-than-average particles there escape. Boiling happens all through the liquid at its boiling temperature, and the bubbles are that liquid in its gas form, not air.',
        'A change of state changes how far apart the particles are and how fast they move. The particles themselves are never broken or changed -- ice, liquid water and the gas above a boiling pan are all H two O.',
        'Every change of state is a physical change: run the energy the other way and the original state comes straight back.',
        'To predict what a sample will do: name it and check that it is pure, say which way the energy is moving, and ask whether it is sitting at a change-of-state temperature. If it is, the state changes and the reading holds. If it is not, the reading moves and the state stays.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Changes of State & Thermal Energy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
