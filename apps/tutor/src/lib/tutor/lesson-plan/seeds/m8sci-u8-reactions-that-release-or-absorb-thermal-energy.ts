/**
 * Grade 8 Science (Physical Science) — Chemical Reactions: Reactions That
 * Release or Absorb Thermal Energy.
 *
 * PROCEDURE-LED row 8.3 (NGSS MS-PS1-6). Two routines run the whole lesson,
 * and the second is built on the first. Routine one CLASSIFIES: rule out an
 * outside heater or cooler, compare the temperature after against the
 * temperature before and against the room, and call it releasing (warmer) or
 * absorbing (colder). Routine two EVALUATES a proposed device against the
 * brief it was written for, in a fixed order -- direction first, then how
 * much, then how fast -- because a design that moves thermal energy the wrong
 * way cannot be rescued by being quick or by being strong.
 *
 * The three traps it is built to kill are (a) "cold moved in", which is the
 * wrong picture of every absorbing reaction, (b) "the reaction made new
 * energy", which is the wrong picture of every releasing one, and (c) "the
 * fastest or the hottest design wins", which is what a student reaches for
 * when an item states a criterion and the student does not read it.
 *
 * SCOPE GUARD: this plan answers ONE question about a reaction the student
 * has already identified as a reaction -- which way did the thermal energy
 * move, out of the reacting substances or into them -- and then judges a
 * described device against a stated brief. Its scope cell carries NO LINEAGE
 * CLAUSE (there is no `m6*` or `m7*` predecessor named for this row, so none
 * is invented here). Its withheld clause, verbatim: "Withholds the words
 * exothermic/endothermic as ΔH-signed quantities and bond-energy accounting
 * (`chem-u9-endothermic-exothermic.ts`, `chem-thermochemistry.ts`)." What
 * that means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 8.1 (evidence of a chemical reaction) is
 *     ASSUMED, not re-taught: every scenario in this file states outright
 *     that a reaction is happening, and no item asks the student to decide
 *     whether one happened. A temperature change is used here only as the
 *     readable indicator of WHICH WAY the thermal energy moved, never as one
 *     of 8.1's five signs. Row 8.2 (atoms rearranged, mass conserved) is not
 *     touched: atoms are mentioned in the authored body only as the
 *     arrangement that holds a store of energy, never counted; no chemical
 *     formula appears; and no mass before or after is stated (the word
 *     "mass" reaches this file only inside the prerequisite loId). Row 8.4
 *     is not taught, and outside this comment and the followUps loId it is
 *     named nowhere. Rows 5.1 and 5.2 are assumed and NOT re-taught: this
 *     file never separates temperature from thermal energy as a pair of
 *     defined quantities, and the words conduction, convection and radiation
 *     appear nowhere outside this comment. Row 5.4's design question is about MATERIALS that
 *     block or carry thermal energy; this row's design question is about the
 *     REACTION inside the device, so no item here turns on an insulator.
 *   - THE ALLOWED EDGE, stated because it is close. This file does say that
 *     thermal energy moves from the warmer thing to the cooler thing, and
 *     that your hand feels cold because thermal energy is leaving your hand.
 *     That is the one sentence of 5.1/5.2 material this row cannot do
 *     without, because the whole "cold moved in" trap is built on its
 *     absence. It is stated as a rule the student already holds and is never
 *     developed, mechanized or assessed.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. Cement is used as a material
 *     that warms while it sets, never as rock, mineral or any Earth process.
 *     The air appears only as part of the surroundings a reaction exchanges
 *     thermal energy with, never as weather, ocean or atmosphere.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. A hand, fingers, skin and an ankle appear
 *     only as objects at a temperature; no organism, no body system and no
 *     metabolic warming is described anywhere.
 *   - HS CHEMISTRY / AP PHYSICS boundary: this file stops short of the words
 *     exothermic and endothermic, of enthalpy and any signed ΔH, of
 *     bond-energy accounting, of specific heat and q = mcΔT, of calorimetry,
 *     of any amount of energy in joules, and of reaction rate as a quantity
 *     with collision theory behind it -- every one of those terms occurs in
 *     this comment naming what is withheld and nowhere in the authored body.
 *     "How fast" here is only how long the device takes and how long it
 *     lasts, read off the times the item states. No formula of any kind
 *     appears in the authored body, in words or in symbols; the only
 *     arithmetic anywhere is subtracting one stated temperature from
 *     another, written out in words and digits.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * observation, reading and design brief in this file is written out in words
 * inside the segment that uses it, and every item is solvable from the text
 * printed inside it. No item asks the student to hold, operate or observe
 * anything; where an apparatus appears (a thermometer, a plastic cup) it is
 * described, and its reading is given.
 *
 * NOTE ON BURNED EXAMPLES (controller rulings 32 and 36): `los[0].description`
 * is student-facing and names five concrete examples -- a hand warmer,
 * burning, cement setting, an instant cold pack, and baking soda and vinegar.
 * All five are therefore BURNED for the assessed items and are used only in
 * teaching segments (hook, both worked examples, misconception check). The
 * three `try_yourself` items use fresh specimens: an unnamed metal strip and
 * liquid, a lunch-bag cooling pack, and a flameless camping meal pouch. Do
 * not "helpfully" swap one of the five back into an item.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.2 -> 8.3 ->
 * 8.4 (`rearranging-atoms-and-conservation-of-mass` ->
 * `reactions-that-release-or-absorb-thermal-energy` ->
 * `synthetic-materials-from-natural-resources`), and both arrays are
 * populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U8_REACTIONS_THAT_RELEASE_OR_ABSORB_THERMAL_ENERGY: LessonPlan = {
  id: 'evelyn.ms.m8sci.reactions-that-release-or-absorb-thermal-energy.v1',
  title: 'Reactions That Release or Absorb Thermal Energy',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.reactions-that-release-or-absorb-thermal-energy',
      standard: 'M8SCI-8.3',
      description:
        'Classify a reaction as releasing thermal energy (the mixture gets warmer -- a hand warmer, burning, cement setting) or absorbing it (the mixture gets colder -- an instant cold pack, baking soda and vinegar), and evaluate a proposed device design that uses such a reaction by whether it releases or absorbs energy as required and how much, how fast (NGSS MS-PS1-6).',
    },
  ],
  prerequisites: ['m8sci.rearranging-atoms-and-conservation-of-mass'],
  followUps: ['m8sci.synthetic-materials-from-natural-resources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a warming device and a cooling device side by side in the same bag, so that "the reaction moved thermal energy one way or the other" is felt before it is named.',
      script:
        'Picture the sideline of a soccer game on a cold morning. There is a small flat packet in your jacket pocket, the kind you tear open and shake. A few minutes later it is warm enough that you keep your hand wrapped around it for the rest of the half, and there is no battery in it, no wire, no flame. Inside that packet is iron powder, and once the wrapper is open the oxygen in the air reaches the iron and the two combine -- the same change that puts rust on a bike chain, running fast enough that you can feel it. In the same bag on the bench there is another packet, and that one does the opposite. Squeeze it until something inside gives way, and within seconds it is cold enough to press against a twisted ankle. Two packets, the same size, sitting side by side, and one of them warms your hand while the other cools an ankle. Neither one is plugged into anything. Today you work out which way the thermal energy went in each, how you can tell from a temperature reading alone, and how a company decides which reaction to put inside a device before it ever builds one.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 2,
    },
    {
      id: 'concept-direction-and-design',
      kind: 'concept',
      goal: 'Install the two directions with the right picture of each, the four-step classifying routine, and the fixed order -- direction, then how much, then how fast -- that judges a device.',
      keyIdeas: [
        'EVERY REACTION MOVES THERMAL ENERGY ONE WAY OR THE OTHER. You already know how to tell that a reaction has happened: something after it has a property that nothing you started with had. This lesson asks a second question about that same reaction. Did thermal energy move OUT of the reacting substances and into everything around them, or did it move IN from everything around them? Those are the only two answers. Everything around the reaction -- the rest of the mixture, the container, the table, the air, your hand -- gets one name in this lesson: the surroundings.',
        'RELEASING: THE MIXTURE AND ITS CONTAINER GET WARMER. The temperature after is higher than the temperature before, and higher than the room, with no flame, no heater and no hot plate anywhere near it. Here is the part to say carefully: that thermal energy was not made. It was already stored in the substances you started with, held in the way their atoms were arranged, and the reaction moved it out into the surroundings. Energy is never created and never used up -- it is moved, and it is changed from one form into another. WRONG: "The reaction made new energy." CORRECT: "The reaction moved energy that was already stored in the substances out into the surroundings as thermal energy."',
        'ABSORBING: THE MIXTURE AND ITS CONTAINER GET COLDER. The temperature after is lower than the temperature before and lower than the room, again with nothing outside cooling it. Here is the part that trips almost everybody: nothing let the cold in, because cold is not a substance and cold does not move anywhere. Thermal energy always moves from the warmer thing to the cooler thing, which is a rule you already hold. The reaction pulled thermal energy out of the mixture, the container and the table, and it keeps pulling it out of your hand for as long as your hand is warmer than the pack. That is the whole reason the pack feels cold to you.',
        'THE CLASSIFYING ROUTINE, IN ORDER. (1) Check that nothing outside is doing the heating or the cooling -- no flame, no stove, no freezer, no sunlight on the container. If something outside is doing it, the reading tells you nothing about the reaction. (2) Write down the temperature before and the temperature after. (3) Compare them, and compare the after reading with the room as well, because a mixture that ends up warmer than the room it is sitting in cannot have been warmed by that room. (4) Warmer means the reaction released thermal energy; colder means it absorbed thermal energy. If you can also compare against the same substances sitting there not reacting, do it, because that is the cleanest check of all.',
        'JUDGING A DEVICE: THREE QUESTIONS, ALWAYS IN THIS ORDER. First DIRECTION. Does the job need something warmed, which takes a reaction that releases thermal energy, or something cooled, which takes one that absorbs it? A design that gets the direction wrong is finished, and no amount of speed or strength rescues it. Second HOW MUCH. Does it reach the temperature the job asks for, and does it stay inside any limit the job sets? Too little is useless and too much can be unsafe, so a brief usually states both a floor and a ceiling. Third HOW FAST. Does it get there in the time allowed, and does it keep going for as long as it is needed? Two reactions can move exactly the same total amount of thermal energy while one of them is over in half a minute and the other keeps going all afternoon, so how long a device lasts is a separate question from how much it moves.',
      ],
      vocabulary: [
        { term: 'thermal energy', definition: 'the energy a sample of matter has because its particles are moving; the more of it a sample holds, the more it can warm something cooler that it touches.' },
        { term: 'surroundings', definition: 'everything around the reacting substances -- the container, the table, the air, and anything holding it -- that thermal energy can move into or out of.' },
        { term: 'releases thermal energy', definition: 'moves thermal energy out of the reacting substances and into the surroundings, so the mixture and its container end up warmer.' },
        { term: 'absorbs thermal energy', definition: 'moves thermal energy out of the surroundings and into the reacting substances, so the mixture and its container end up colder.' },
        { term: 'design brief', definition: 'the written list of what a device has to do, including the temperature it must reach, any limit it must not pass, and how long it has to work.' },
      ],
      suggestedTools: ['show_table', 'show_flowchart'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify-two-mixtures',
      kind: 'worked_example',
      problem:
        'Two reactions, both in a room that stays at 20 degrees Celsius, and nothing is heated or cooled from outside at any point. Case one: dry cement powder and water are stirred together in a bucket and left alone on the floor to set. A thermometer pushed into the middle of the bucket reads 20 degrees Celsius at the start and 31 degrees Celsius two hours later, and the outside of the bucket is warm to the touch. Case two: a spoonful of baking soda is stirred into a cup of vinegar. The mixture fizzes and gives off a gas, and a thermometer in the cup reads 20 degrees Celsius before the powder goes in and 16 degrees Celsius half a minute after. Classify each one.',
      steps: [
        'Case one, step 1: rule out the outside. The bucket is on the floor of a room at 20 degrees Celsius. There is no flame under it, no heater beside it and no sunlight on it. Nothing outside the bucket is capable of warming it, so whatever the thermometer does is down to what is happening inside.',
        'Case one, steps 2 and 3: the readings are 20 degrees Celsius before and 31 degrees Celsius after, which is a rise of 11 degrees Celsius. Compare the after reading with the room as well: 31 degrees Celsius in a room at 20 degrees Celsius means the bucket is 11 degrees Celsius warmer than everything around it. A room at 20 degrees Celsius cannot push anything above 20 degrees Celsius, because thermal energy moves from the warmer thing to the cooler thing and never the other way.',
        'Case one, step 4: warmer means the reaction RELEASED thermal energy. Energy that was already stored in the cement powder and the water moved out into the bucket, the floor and the air. Nothing was created; the store that was there at the start is smaller now and the surroundings are warmer. Note that 11 degrees Celsius is what this one bucket did, not a number that belongs to cement: a bigger bucket of the same mix releases more thermal energy and a thin smear of it releases so little that you would struggle to read the rise at all. The direction is the finding. The size of the rise depends on how much you mixed.',
        'Case two, same four steps. Nothing outside is cooling the cup -- no freezer, no ice, no cold pack under it. The readings are 20 degrees Celsius before and 16 degrees Celsius after, which is a drop of 4 degrees Celsius, and the cup is now 4 degrees Celsius colder than the room it is sitting in. Colder means the reaction ABSORBED thermal energy: it pulled thermal energy out of the mixture and the cup, and it goes on pulling it out of your fingers for as long as your fingers are warmer than the cup.',
        'WRONG: "The fizzing cup got cold because the cold from the room moved into it." CORRECT: "The room is at 20 degrees Celsius and the cup is at 16 degrees Celsius, so the room is the WARMER of the two -- thermal energy is moving from the room into the cup, not the other way, and the cup is cold anyway because the reaction is taking thermal energy out faster than the room is putting it back."',
        'Now the two checks a science answer needs. First, three clues of DIFFERENT KINDS that agree on case one. The reading rose by 11 degrees Celsius. The bucket ended up warmer than the room, which rules out the room as the source. And the same bag of dry cement powder left unopened beside the bucket stays at 20 degrees Celsius all afternoon, which rules out the powder simply being a warm material. Three different kinds of evidence, one answer. Second, change one thing and check that the answer moves. Stand the same bucket in bright sunlight through a window. Now the reading climbs, but the climb no longer proves anything at all, because step 1 fails -- something outside is heating it. The answer has to move when the evidence moves, and the piece of evidence that carries this verdict is not the rise on its own. It is the rise with nothing outside to explain it.',
      ],
      answer:
        'Case one released thermal energy: the bucket rose 11 degrees Celsius, ending warmer than the 20-degree-Celsius room, with nothing outside to heat it. Case two absorbed thermal energy: the cup fell 4 degrees Celsius, ending colder than the same room, with nothing outside to cool it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evaluate-cold-pack',
      kind: 'worked_example',
      problem:
        'A first-aid company is designing an instant cold pack to press on a twisted ankle at the side of the field. The brief says three things. The pack must take thermal energy out of the ankle. It must be cold within about 30 seconds of being squeezed, and it must stay cold for at least 15 minutes. And its temperature must never go below 0 degrees Celsius, so that no ice can form against the skin. Two mixtures are offered, both in a room at 20 degrees Celsius. Mixture P absorbs thermal energy: 20 seconds after it is squeezed it reads 4 degrees Celsius, and it stays between 4 and 8 degrees Celsius for about 20 minutes. Mixture Q releases thermal energy: 20 seconds after it is squeezed it reads 35 degrees Celsius. Which mixture meets the brief?',
      steps: [
        'Question one, DIRECTION, and it comes first for a reason. The job is to take thermal energy out of the ankle, so the pack has to be colder than the ankle, which means the reaction inside it has to ABSORB thermal energy. Mixture P absorbs, so it passes. Mixture Q releases, which would leave the pack warmer than the room and warmer than the ankle, and thermal energy would then move from the pack into the ankle. That is the opposite of the job. Mixture Q is out, and nothing else about it needs checking.',
        'Question two, HOW MUCH, run on the one mixture still standing. The brief sets a floor of 0 degrees Celsius that the pack must never go below. Mixture P reaches 4 degrees Celsius, which is 4 degrees Celsius above that floor, and its warmest reading in the stated range, 8 degrees Celsius, is well below the 20 degrees Celsius of the room, so it stays genuinely colder than the ankle it is pressed against. It passes on how much.',
        'Question three, HOW FAST. The brief allows about 30 seconds to get cold; Mixture P is at 4 degrees Celsius after 20 seconds, which is inside that. The brief asks for at least 15 minutes of cold; Mixture P stays between 4 and 8 degrees Celsius for about 20 minutes, which is 5 minutes more than the brief asks for. It passes on how fast, at both ends -- the getting there and the lasting.',
        'WRONG: "Mixture Q is the better pack, because 35 degrees Celsius is a bigger change away from the room than 4 degrees Celsius is, and a bigger change means a stronger pack." CORRECT: "Direction is decided before size, so a mixture that warms the ankle is out no matter how big its change is. And the size claim is not even true here: Mixture Q rises 15 degrees Celsius above the room while Mixture P falls 16 degrees Celsius below it, so the absorbing mixture makes the larger change of the two."',
        'Now the two checks. First, three clues of DIFFERENT KINDS agree that Mixture P is the answer: the direction test (the job needs thermal energy taken out, and only P takes it out), the limit test (P stops at 4 degrees Celsius and never reaches the 0-degree-Celsius floor), and the two timing tests (cold in 20 seconds against about 30 allowed, and lasting about 20 minutes against 15 required). Second, change one thing and check that the answer moves. Rewrite the first line of the brief so that the device is a warming pack for a stiff shoulder on a cold morning, and change nothing else. Now the direction requirement flips, Mixture Q passes the question it used to fail, and Mixture P is the one that is out. The answer moved when the requirement moved, which is what tells you the direction question was doing real work and not just being recited.',
      ],
      answer:
        'Mixture P. It absorbs thermal energy, which is the direction the job needs; it reaches 4 degrees Celsius, staying above the 0-degree-Celsius floor the brief sets; and it is cold in 20 seconds and stays cold for about 20 minutes, beating both of the times the brief asks for.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-metal-strip',
      kind: 'try_yourself',
      problem:
        'A strip of metal, Sample M, is dropped into a clear liquid, Sample N, in a plastic cup. A reaction starts at once: bubbles of gas stream off the strip and the strip slowly gets smaller. Everything starts at 20 degrees Celsius, which is also the temperature of the room. The cup sits on a table, and no flame, heater, freezer or patch of sunlight is anywhere near it. Two minutes later a thermometer in the liquid reads 28 degrees Celsius, and the room is still at 20 degrees Celsius. What is happening to thermal energy in this reaction?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Thermal energy is moving into the cup from the room around it, because the room is far larger than the cup and a whole room of warm air can push a small amount of liquid up by 8 degrees Celsius.' },
        { id: 'b', text: 'The bubbles are air that was trapped on the rough surface of the metal strip, and all of that air pushing its way up through the liquid is the rubbing that warmed it by 8 degrees Celsius.' },
        { id: 'c', text: 'The reaction is making brand-new thermal energy out of nothing, because neither the strip nor the liquid had that extra 8 degrees Celsius anywhere inside it before the two of them were put together.' },
        { id: 'd', text: 'The reaction is releasing thermal energy into the liquid and the cup, which is why the thermometer has climbed 8 degrees Celsius while the room it stands in has stayed at 20 degrees Celsius.', correct: true },
      ],
      expectedAnswer: 'The reaction is releasing thermal energy into the liquid and the cup, which is why the thermometer has climbed 8 degrees Celsius while the room it stands in has stayed at 20 degrees Celsius.',
      hints: [
        'Run the classifying routine in order. Step one: is anything outside the cup heating it? Step two and three: what was the temperature before, what is it now, and how does the new reading compare with the room?',
        'Think about which way thermal energy moves between two things at different temperatures. The liquid is now at 28 degrees Celsius and the room is at 20 degrees Celsius, so the liquid is the warmer of the two. A room cannot warm something that is already warmer than it is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-lunch-cooling-pack',
      kind: 'try_yourself',
      problem:
        'A company is designing a small pack that sits in a lunch bag to keep a sandwich cool. The brief: the pack must go on taking thermal energy out of the sandwich from the start of the school day until lunch, which is about 4 hours later. Two designs are offered, both the same size and the same price. Design 1 uses a reaction that absorbs thermal energy and is completely finished about 2 minutes after the pack is squeezed. Design 2 uses a reaction that absorbs the same total amount of thermal energy as Design 1, but it keeps going steadily for about 5 hours. Which design fits the brief, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Design 2, because it goes on absorbing thermal energy for about 5 hours, which covers the whole 4 hours the sandwich has to stay cool, while Design 1 stops after about 2 minutes and the sandwich warms up again all morning.', correct: true },
        { id: 'b', text: 'Design 1, because it absorbs its thermal energy in about 2 minutes rather than spreading the same job across 5 hours, and a pack that finishes everything that quickly has cooled the sandwich far more by lunchtime.' },
        { id: 'c', text: 'Neither design works, because a pack that absorbs thermal energy draws cold in from the air inside the lunch bag instead of taking thermal energy out of the sandwich that is packed beside it.' },
        { id: 'd', text: 'Design 2, because a reaction that keeps running for about 5 hours has to absorb far more thermal energy in total than a reaction that is finished and done with after only about 2 minutes of work.' },
      ],
      expectedAnswer: 'Design 2, because it goes on absorbing thermal energy for about 5 hours, which covers the whole 4 hours the sandwich has to stay cool, while Design 1 stops after about 2 minutes and the sandwich warms up again all morning.',
      hints: [
        'Both designs pass the direction question, and the brief says the total amount of thermal energy they absorb is the same. So neither direction nor how much can separate them. That leaves one of the three questions.',
        'Read the brief again for the length of time it demands, and hold each design against it. What is happening to the sandwich for the hours after a pack has finished reacting?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-meal-pouch',
      kind: 'try_yourself',
      problem:
        'A camping company is designing a flameless pouch that heats a sealed meal packet. The brief: the packet starts at 10 degrees Celsius and must reach at least 60 degrees Celsius within 10 minutes, and the outside of the pouch must never go above 70 degrees Celsius, because it is held in a bare hand while it works. Three mixtures are offered. Mixture J releases thermal energy, brings the packet to 65 degrees Celsius in 8 minutes, and holds the outside of the pouch at about 55 degrees Celsius the whole time. Mixture K releases thermal energy, brings the packet to 95 degrees Celsius in 2 minutes, and takes the outside of the pouch to about 90 degrees Celsius. Mixture L absorbs thermal energy and takes the packet down to 2 degrees Celsius. Which mixture meets the brief, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mixture K, because it is both the fastest and the hottest of the three, and a pouch that gets a cold meal packet all the way to 95 degrees Celsius in 2 minutes has to beat one that needs 8 minutes.' },
        { id: 'b', text: 'Mixture J, because it releases thermal energy, gets the packet to 65 degrees Celsius inside the 10 minutes allowed, and holds the outside of the pouch at about 55 degrees Celsius, under the limit of 70 degrees Celsius.', correct: true },
        { id: 'c', text: 'Mixture L, because a mixture that absorbs thermal energy draws the cold out of the meal packet, and drawing the cold out of something cold is how a flameless pouch is able to leave it hot.' },
        { id: 'd', text: 'Mixture J, but only if the pouch is opened again after about 2 minutes, because a reaction that goes on releasing thermal energy for 8 minutes drives the temperature higher and higher past every limit.' },
      ],
      expectedAnswer: 'Mixture J, because it releases thermal energy, gets the packet to 65 degrees Celsius inside the 10 minutes allowed, and holds the outside of the pouch at about 55 degrees Celsius, under the limit of 70 degrees Celsius.',
      hints: [
        'Run the three questions in their fixed order and throw a mixture out the moment it fails one. Direction first: the job is to heat a meal, so which of the three mixtures moves thermal energy the wrong way entirely?',
        'The brief sets two numbers that a design must respect, not one. A mixture has to reach at least 60 degrees Celsius in the packet, and it also has to keep the outside of the pouch below 70 degrees Celsius. Check every surviving mixture against both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-moved-in-and-energy-made',
      kind: 'misconception_check',
      question:
        'A student writes: "An instant cold pack works by sending cold into your skin, and a hand warmer works by making new energy inside the packet, because there is nothing plugged into either of them." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A cold pack works by sending cold into your skin.',
          misconception:
            'Treating cold as a substance that can be stored in a pack and pushed out into something else, because that is exactly what it feels like when a cold pack is held against skin.',
          correctsTo:
            'There is no cold to send anywhere. Thermal energy moves from the warmer thing to the cooler thing, always, and nothing ever moves the other way. Your skin is warmer than the pack, so thermal energy leaves your skin and goes into the pack, and the mixture inside the pack goes on absorbing it. What you feel as cold is your own skin losing thermal energy. WRONG: "The pack sends cold into my ankle." CORRECT: "My ankle sends thermal energy into the pack, because the pack is colder, and the mixture inside keeps taking that thermal energy in."',
        },
        {
          answer: 'A hand warmer makes new energy, because nothing is plugged into it.',
          misconception:
            'Reading "no battery and no flame" as "no store of energy", so the warmth appears to arrive out of nowhere and the only explanation left is that the reaction created it.',
          correctsTo:
            'Energy is never created and never destroyed. The iron powder and the oxygen the packet takes in from the air already hold energy in the way their atoms are arranged, and when they combine, the reaction moves some of that store out into the surroundings as thermal energy. A battery is not the only place energy can be stored; a chemical store does not look like anything at all from the outside. WRONG: "The packet makes energy." CORRECT: "The packet releases energy that was already stored in the iron and the oxygen, as thermal energy that spreads into my hand and the air."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A reaction either RELEASES thermal energy into its surroundings or ABSORBS thermal energy from them. Warmer mixture means released; colder mixture means absorbed.',
        'The surroundings are everything around the reacting substances: the rest of the mixture, the container, the table, the air, and your hand.',
        'Releasing does not make energy. The energy was already stored in the substances you started with, and the reaction moved it out as thermal energy.',
        'Absorbing does not let cold in. Cold is not a substance and does not move. Thermal energy always travels from the warmer thing to the cooler thing.',
        'The classifying routine: rule out any outside heater or cooler, take the temperature before and after, compare the after reading with the room too, then call it released or absorbed.',
        'A mixture that ends up warmer than the room it sits in cannot have been warmed by that room.',
        'Judge a device in this order: DIRECTION (warming needs a releasing reaction, cooling needs an absorbing one), then HOW MUCH (does it reach the temperature asked for and stay inside the limit set), then HOW FAST (does it get there in time and last as long as it is needed).',
        'A design that gets the direction wrong is out. Being quicker or hotter never rescues it.',
        'How much thermal energy a reaction moves and how long it takes to move it are two different questions. Two designs can move the same total amount while one is over in moments and the other works away for hours.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Reactions That Release or Absorb Thermal Energy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
