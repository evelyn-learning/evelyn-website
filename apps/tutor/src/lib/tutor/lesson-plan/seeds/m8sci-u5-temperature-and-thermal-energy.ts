/**
 * Grade 8 Science (Physical Science) — Temperature & Thermal Energy.
 *
 * Row 5.1, concept-led. The student has no procedure to run here: the whole
 * lesson installs one distinction -- temperature is an AVERAGE taken per
 * particle, thermal energy is a TOTAL taken over the whole sample -- and then
 * makes that distinction survive the everyday habit of reading a thermometer
 * as a measure of how much energy a thing holds. The consequence that does the
 * teaching is the one that sounds wrong the first time it is said: a cooler
 * sample can hold more thermal energy than a hotter one, because a total
 * counts how much matter there is and an average does not.
 *
 * The two traps it is built to kill are (a) temperature-is-thermal-energy, the
 * straight collapse of the two words into one measurement, and (b) its mirror
 * image, "the sample holding the most thermal energy must be the hottest",
 * which the second worked example takes head on.
 *
 * SCOPE GUARD: this plan distinguishes temperature (the average kinetic energy
 * of a sample's particles) from thermal energy (the total, which also depends
 * on how much matter there is), using the particle-motion picture, and nothing
 * else. Its scope cell carries no lineage clause; its withheld clause,
 * verbatim, is: "Withholds absolute temperature and the kelvin scale
 * (`chem-u7-kinetic-molecular-theory.ts`)." Every absence claimed below is
 * claimed of the plan's AUTHORED TEXT -- the objective, the segments and the
 * metadata -- and not of this guard or of the followUps loId, both of which
 * necessarily name what the plan excludes. What each edge means, and what is
 * deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 4.4 (energy transferred when motion changes) is
 *     the previous row and is assumed only as the words "kinetic energy",
 *     which the vocabulary list restates rather than re-teaches. Row 5.2
 *     (conduction, convection and radiation) is the next row: the words
 *     conduction, convection and radiation appear in no authored string, no
 *     mechanism of transfer is described, and the correction "cold does not
 *     flow" is left to that row. Heat is given a one-sentence definition --
 *     the name for thermal energy moving from a warmer object to a cooler one
 *     -- in the concept segment, in the vocabulary list, in the misconception
 *     check and in the recap, and the concept segment says outright that HOW
 *     it moves is the next lesson. Nowhere is that moving given a mechanism.
 *     The definition is here because the word cannot be left meaning "hotness"
 *     in the one lesson whose job is to separate hotness from a total. Row 5.3
 *     (mass, material and temperature change) owns the dependence on WHAT a
 *     sample is made of, so every comparison this plan RESOLVES is between
 *     samples of the same substance, and the plan states that condition
 *     explicitly -- in the concept segment, in both worked examples and in
 *     each of the three items -- rather than leaving it implied. (The hook is
 *     the one place two unlike things are set side by side, and it resolves
 *     nothing; see the upward clause below.) No sample anywhere is warmed or
 *     cooled by a stated amount of energy, and no item asks how much a
 *     temperature would change.
 *     Row 5.4 (insulators, conductors and thermal design) is not touched: no
 *     material is called an insulator or a conductor, and no device is
 *     evaluated. Row 6.1 (the particle model and the states of matter) owns the
 *     solid, liquid and gas behavior of particles; this file says only that
 *     particles are always moving and that they do not all move at the same
 *     speed, and never sorts that motion by state. Row 4.1 (kinetic energy:
 *     mass and speed) is assumed for "kinetic energy grows with mass and with
 *     speed", which appears in the vocabulary list and in the first key idea
 *     and is never turned into a ratio: no doubling-the-speed comparison
 *     appears here.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears in the authored text -- no mantle,
 *     plate, ocean, current, weather system, water cycle or climate is named
 *     anywhere in it. The swimming pool in the misconception check is
 *     a large quantity of water and nothing more.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in this
 *     catalog, so AP Physics is the course above): the kelvin scale, absolute
 *     zero and the words "absolute temperature" are named in no authored
 *     string, and no energy anywhere is stated in joules. The quantity this
 *     file stops short of is specific heat and the formula it stops short of is
 *     q = mcDeltaT, which is why no item or worked example compares two
 *     DIFFERENT substances by thermal energy and why nothing here asks how far
 *     a sample's temperature would move. (The one place two unlike objects sit
 *     side by side is the hook, which poses a puzzle -- a glowing spark that
 *     does nothing against a mild hand warmer that lasts an hour -- and
 *     deliberately explains nothing about it; every comparison the lesson
 *     actually resolves is between samples of the same substance.) It also
 *     stops short of the laws of thermodynamics and of entropy; neither word
 *     is used as content. One caution in the first worked example says that a
 *     Celsius reading does not let you call one temperature three times
 *     another. That
 *     is deliberately left as a bare caution, because the scale on which such
 *     a ratio WOULD be meaningful is the kelvin scale, which this row
 *     withholds.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every sample is
 * written out in words, and where a sample carries an amount and a temperature
 * they are stated in grams and in degrees Celsius inside the item itself. The
 * third try_yourself deliberately withholds both, and its stem says so, because
 * "you cannot tell" is the answer it is testing. Every item is solvable from
 * the text printed inside it. Never write "read the thermometer shown", and
 * never assume the student has a thermometer, a kettle or a balance in front
 * of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.4 -> 5.1 -> 5.2
 * (`energy-transfer-when-motion-changes` -> `temperature-and-thermal-energy` ->
 * `conduction-convection-and-radiation`), and both arrays below are populated
 * with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U5_TEMPERATURE_AND_THERMAL_ENERGY: LessonPlan = {
  id: 'evelyn.ms.m8sci.temperature-and-thermal-energy.v1',
  title: 'Temperature & Thermal Energy',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.temperature-and-thermal-energy',
      standard: 'M8SCI-5.1',
      description:
        'Distinguish temperature (a measure of the AVERAGE kinetic energy of a sample\'s particles) from thermal energy (the TOTAL, which also depends on how much matter there is -- a bathtub of warm water holds more thermal energy than a cup of boiling water), using the particle-motion picture (NGSS DCI PS3.A).',
    },
  ],
  prerequisites: ['m8sci.energy-transfer-when-motion-changes'],
  followUps: ['m8sci.conduction-convection-and-radiation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set a very hot thing that does nothing against a mild thing that warms you for an hour, so the student wants two words where they have been using one.',
      script:
        'If you have ever held a sparkler, you have watched the sparks fly off it and land on your sleeve, on your hand, on the back of somebody else\'s coat. They glow orange while they fall, and glowing orange means far hotter than boiling water -- nothing at the temperature of a boiling kettle glows. And yet most of those sparks die out before you feel a thing. Now put a hand warmer from a coat pocket next to that. It never gets anywhere near as hot as one of those sparks -- you can close your fist around it. But it will keep your fingers warm for an hour. So the hotter thing did nothing to you and the cooler thing warmed you for an hour, which means "how hot something is" and "how much warming it can do" cannot be the same measurement. They are not. They are two different quantities with two different names, and people use one word for both all the time. Today you get both words, you get the difference between them in terms of the particles everything is made of, and you get a rule that tells you which of two samples holds more energy even when the cooler one is the answer.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-average-versus-total',
      kind: 'concept',
      goal: 'Build the two quantities side by side from the particle-motion picture -- temperature as the per-particle average, thermal energy as the sum over the sample -- and hand the student a rule for deciding which one a question is about.',
      keyIdeas: [
        'EVERY PARTICLE IN EVERY SAMPLE IS MOVING, AND MOVING MEANS KINETIC ENERGY. Everything around you is made of particles far too small to see, and those particles are never still. They jiggle, tumble and bump into one another in a warm room and in a freezer alike. You already know that a moving object has kinetic energy -- the energy of motion -- and that kinetic energy grows with mass and with speed. A particle is no different: every particle in a sample carries some kinetic energy, because every particle is moving. One more thing to hold on to before the two definitions arrive: the particles in a single sample are not all moving at the same speed. At any moment some are faster and some are slower. That is exactly why the two quantities that follow are built out of an AVERAGE and a TOTAL rather than out of one particle.',
        'TEMPERATURE IS THE AVERAGE KINETIC ENERGY PER PARTICLE. When you read a temperature, you are reading how much kinetic energy a typical particle in that sample has: the average, taken across all of them. Warm the sample and its particles move faster, so the average goes up and the reading goes up with it. Cool it and they slow, and the reading falls. Now notice what that average leaves out. It says nothing at all about how many particles there are. One drop of water at 60 degrees Celsius and a full bucket of water at 60 degrees Celsius have particles with the same average energy of motion, and that is exactly why the same thermometer reads 60 degrees Celsius in both of them. Temperature is a per-particle measurement, and a sample does not get a higher reading for being big.',
        'THERMAL ENERGY IS THE TOTAL FOR THE WHOLE SAMPLE. Now add up the kinetic energy of every particle in the sample instead of averaging it. That sum is the sample\'s thermal energy. Because it is a total and not an average, it depends on two things at once: how fast the particles are moving on average, which is the temperature, and how many particles there are, which is how much matter the sample contains. Take twice as much matter at the same temperature and you are adding up twice as many amounts, so the total is twice as large. That is the whole difference between the two words. Temperature is per particle. Thermal energy is for the whole sample. One condition before any comparison: every comparison you are asked to settle in this lesson is between samples of the SAME substance. What a sample is made of matters too, and that is a later lesson.',
        'A COOLER SAMPLE CAN HOLD MORE THERMAL ENERGY THAN A HOTTER ONE, AND THAT IS THE POINT OF TODAY. A bathtub of warm water holds more thermal energy than a cup of boiling water. The cup wins on temperature: its particles are moving faster on average, and a thermometer says so. The bathtub wins on the total, and it wins by a long way, because it holds so many more water particles that adding up their smaller amounts still comes to far more. WRONG: "The cup is hotter, so the cup must hold more thermal energy." CORRECT: "The cup has the higher average per particle. The bathtub has enormously more particles, and thermal energy is the total, so the bathtub holds more of it." Hotter tells you which way one of the two factors points. On its own it does not settle the total.',
        'A THERMOMETER READS ONLY ONE OF THE TWO, AND "HEAT" IS A THIRD WORD. A thermometer reads the average and nothing else, so no thermometer can tell you how much thermal energy a sample holds. To answer that you need the reading AND the amount of matter, and you have to go and find the second one. While you are sorting words out, sort out one more. In everyday speech people say that a hot object "has a lot of heat". In science an object has THERMAL ENERGY. The word heat names thermal energy on the move, from a warmer object to a cooler one, and how that moving happens is the next lesson. An object does not contain heat, and heat is not a substance that can be stored anywhere.',
        'HOW TO ANSWER ANY QUESTION OF THIS KIND. First, decide which of the two quantities the question is actually asking for: the average per particle, which is temperature, or the total over the sample, which is thermal energy. Second, if it is temperature, compare only how fast the particles are moving on average and ignore the amounts completely. Third, if it is thermal energy, you need the temperature AND the amount of matter, so collect both before you answer. Fourth, settle it with the two clean cases wherever you can: for the same substance at the same temperature, more matter means more thermal energy; for the same substance in the same amount, the higher temperature means more thermal energy. And when one sample is hotter while the other is much bigger, weigh the two against each other. A difference in amount of ten times or a hundred times is far larger than any difference two everyday temperatures can make, so in that situation the much bigger sample holds the larger total.',
      ],
      vocabulary: [
        { term: 'particle', definition: 'one of the extremely small pieces that all matter is made of, far too small to see, and always in motion.' },
        { term: 'kinetic energy', definition: 'the energy something has because it is moving; it grows with mass and with speed.' },
        { term: 'temperature', definition: 'a measure of the AVERAGE kinetic energy of the particles in a sample. It is what a thermometer reads, and it does not depend on how much of the sample there is.' },
        { term: 'thermal energy', definition: 'the TOTAL kinetic energy of all the particles in a sample. It depends on the temperature and on how much matter the sample contains.' },
        { term: 'average', definition: 'the amount each member of a group would have if the total were shared out equally among them; it describes a typical member and says nothing about how many members there are.' },
        { term: 'heat', definition: 'thermal energy on the move from a warmer object to a cooler one. An object has thermal energy; it does not contain heat.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-saucepan-and-pot',
      kind: 'worked_example',
      problem:
        'A small saucepan holds 200 grams of water at 90 degrees Celsius. A large pot standing beside it holds 2,000 grams of water at 30 degrees Celsius. Both hold ordinary liquid water, and nothing is heating or cooling either one at this moment. Which has the higher temperature, and which holds more thermal energy? Say how you know.',
      steps: [
        'Split the question into its two halves, because it is asking for two different quantities and they have to be answered separately. Half one is temperature. Half two is thermal energy. Answering both at once with one comparison is how this question gets missed.',
        'Temperature first, because it is the short half. Temperature is the average kinetic energy per particle, so the amount of water does not enter into it at all. The saucepan reads 90 degrees Celsius and the pot reads 30 degrees Celsius, so the saucepan has the higher temperature. The reading is the answer, and 200 grams against 2,000 grams changes nothing about it.',
        'Now thermal energy, which needs both factors collected before anything is decided. Factor one, the temperature: a typical particle in the saucepan is moving faster than a typical particle in the pot, so each of the saucepan\'s particles carries more kinetic energy. Factor two, the amount of matter: 2,000 grams divided by 200 grams is 10, so the pot holds ten times as much water as the saucepan, and therefore ten times as many water particles.',
        'Weigh the two factors against each other. The pot is adding up ten times as many amounts. For the saucepan to win anyway, each of its amounts would have to be more than ten times bigger than each of the pot\'s -- and it is not, nowhere near. Both pans hold ordinary liquid water, one at 90 degrees Celsius and one at 30 degrees Celsius, and a particle in the hotter water is moving faster but nothing like ten times faster. Ten times as many particles, each carrying a little less: the pot holds far more thermal energy.',
        'WRONG: "The saucepan is at 90 degrees Celsius and the pot is only at 30 degrees Celsius, so the saucepan holds three times the thermal energy." CORRECT: "The saucepan has the higher average per particle, the pot has ten times as many particles, and so the pot holds far more thermal energy." Two separate mistakes are packed into the wrong version. It reads a thermometer as if the thermometer measured the total, and it treats 90 degrees Celsius as "three times" 30 degrees Celsius, which is not something a Celsius reading lets you say about how fast particles are moving.',
        'Now run the checks a science answer needs, because there is very little arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The definition puts the count of particles inside the total, and the count favors the pot ten to one. The arithmetic agrees from a second direction: ten times as many particles against particles that are faster but nowhere near ten times faster. And the behavior of a thermometer agrees from a third: dip one into the big pot, then into a single spoonful lifted out of that pot, and both read 30 degrees Celsius. A reading that does not change when almost all of the water is taken away cannot be a measurement of the total. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves. Pour water out of the big pot until only 200 grams of it is left, still at 30 degrees Celsius. Nothing has been heated or cooled, so both temperatures are exactly what they were, 90 degrees Celsius and 30 degrees Celsius -- but the amounts are equal now, and the saucepan holds more thermal energy than the pot. The thermal-energy answer flipped and the temperature answer did not move at all. That is the proof that the amount of matter was doing the work, and that these are two quantities and not one.',
      ],
      answer:
        'The saucepan has the higher temperature, 90 degrees Celsius against 30 degrees Celsius, because temperature is the average kinetic energy per particle and the amount of water does not affect it. The pot holds far more thermal energy, because thermal energy is the total over every particle: the pot holds ten times as much water, and a particle in the hotter saucepan is moving faster but nothing like ten times faster. Pour the pot down to 200 grams and the thermal-energy answer reverses while the temperatures stay where they were, which shows that the amount of matter was what decided it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ranking-three-samples',
      kind: 'worked_example',
      problem:
        'Three samples of ordinary liquid water are described. Sample A is 50 grams at 100 degrees Celsius. Sample B is 50 grams at 20 degrees Celsius. Sample C is 5,000 grams at 20 degrees Celsius. Rank the three by temperature, then rank them by thermal energy. Then deal with this claim from a student: "Sample C must be the hottest of the three, because it holds the most energy of motion in total."',
      steps: [
        'Rank by temperature first, and use nothing but the readings. Temperature is the average per particle, so 50 grams and 5,000 grams are equally irrelevant to this half of the question. Sample A is at 100 degrees Celsius; Samples B and C are both at 20 degrees Celsius. So Sample A is the hottest, and Samples B and C are tied at the bottom. Being a hundred times bigger bought Sample C nothing whatsoever on this ranking.',
        'Now thermal energy, and take the easy pair first. Samples A and B hold the same amount of water, 50 grams each, so they have the same number of particles and the same number of amounts to add up. The only thing separating them is how much each particle carries, and Sample A\'s particles are moving faster. Sample A holds more thermal energy than Sample B.',
        'Now the hard pair, Sample A against Sample C. Sample C is at the lower temperature, so each of its particles carries less kinetic energy than each of Sample A\'s. But 5,000 grams divided by 50 grams is 100, so Sample C holds a hundred times as much water as Sample A and a hundred times as many particles. For Sample A to win the total, each of its particles would have to carry more than a hundred times what one of Sample C\'s carries, and that is nowhere near true of liquid water at 100 degrees Celsius set against liquid water at 20 degrees Celsius. Sample C holds much more thermal energy than Sample A. The full ranking by thermal energy is Sample C first, then Sample A, then Sample B.',
        'There is a cleaner way to see Sample C against Sample B, and it is worth keeping. Sample C is 5,000 grams of water at 20 degrees Celsius and Sample B is 50 grams of water at 20 degrees Celsius, so Sample C is exactly a hundred Sample Bs poured together. Divide Sample C into a hundred equal portions and every single portion is a copy of Sample B: 50 grams, 20 degrees Celsius. A hundred copies hold a hundred times the thermal energy of one copy, and every copy reads the same on a thermometer as the whole of Sample C does. Same temperature, a hundred times the thermal energy, with no estimating anywhere in the argument.',
        'Now the student\'s claim. WRONG: "Sample C must be the hottest, because it holds the most energy of motion in total." CORRECT: "Sample C holds the most thermal energy and is tied for the LOWEST temperature, because a total counts every particle while a temperature reports the average for one." The claim runs the lesson backward. A large total tells you nothing on its own about the average behind it, in the same way that the school with the most students is not automatically the school with the tallest average student. That comparison is about averages and totals only; nothing about a student resembles a particle in any other way, and it is here to make the arithmetic point and nothing more.',
        'Run the checks. Three clues of different kinds agree on the thermal-energy ranking. The definition puts the particle count inside the total and keeps it out of the average. The arithmetic gives a factor of one hundred in amount against a per-particle difference far smaller than a hundred. And the hundred-copies argument settles Sample C against Sample B exactly, with no estimate in it at all. Then change one condition: shrink Sample C from 5,000 grams to 5 grams and leave it at 20 degrees Celsius. Its reading has not moved, and neither has its place in the temperature ranking -- still tied with Sample B at the bottom. But it now holds the LEAST thermal energy of the three, having gone from first to last. One condition changed, one ranking moved, the other did not. That is what it means for these to be two different quantities.',
      ],
      answer:
        'By temperature: Sample A at 100 degrees Celsius is the hottest, and Samples B and C are tied at 20 degrees Celsius. By thermal energy: Sample C first, then Sample A, then Sample B. Sample C holds a hundred times as much water as Sample A, which more than makes up for its lower temperature, and Sample C is exactly a hundred copies of Sample B at the same temperature as Sample B. The student is wrong: holding the largest total says nothing on its own about the average per particle, and Sample C is tied for the lowest temperature of the three.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-juice-carton-and-jug',
      kind: 'try_yourself',
      problem:
        'A small carton holding 200 grams of apple juice has been sitting in a warm car and is at 35 degrees Celsius. A large jug holding 4,000 grams of the same apple juice has just come out of a cool cupboard and is at 15 degrees Celsius. Which one holds more thermal energy, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The carton, because it is at the higher temperature, and a thermometer measures how much energy a sample is holding, so the sample with the higher reading is the one holding more thermal energy.' },
        { id: 'b', text: 'The carton, because thermal energy is how fast the particles in a sample are moving, the particles in the warm carton are the faster ones, and how much juice each container happens to hold does not come into it.' },
        { id: 'c', text: 'The jug, because thermal energy is the total for every particle in the sample: the jug holds twenty times as much juice, and a particle in the warmer carton is moving faster but nothing like twenty times faster.', correct: true },
        { id: 'd', text: 'The jug, because the larger sample always holds more thermal energy than the smaller one, whatever temperature each of them happens to be at, since the only thing a total adds up is the amount of matter.' },
      ],
      expectedAnswer: 'The jug, because thermal energy is the total for every particle in the sample: the jug holds twenty times as much juice, and a particle in the warmer carton is moving faster but nothing like twenty times faster.',
      hints: [
        'Two things decide a thermal-energy comparison: how fast a typical particle is moving, and how many particles there are. Work out which way each of those points here before you pick anything.',
        'The temperatures point one way and the amounts point the other, so compare the sizes of the two effects. How many times as much juice is in the jug, and could a particle at 35 degrees Celsius be moving that many times faster than one at 15 degrees Celsius?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pouring-a-glass',
      kind: 'try_yourself',
      problem:
        'A sealed bottle holds 1,500 grams of lemonade at 8 degrees Celsius. Without warming or cooling anything, you pour 250 grams of it into a glass, leaving 1,250 grams in the bottle. Which statement about the lemonade in the glass is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is at a lower temperature than the lemonade left in the bottle, because it holds less thermal energy in total than the bottle does, and a smaller total always shows up as a lower reading on a thermometer.' },
        { id: 'b', text: 'It is at a higher temperature than the lemonade left in the bottle, because the energy of motion the poured portion carries is now shared out among far fewer particles, so each of those particles ends up with more of it.' },
        { id: 'c', text: 'It is at the same temperature as the lemonade left in the bottle and holds the same thermal energy as it, because pouring adds no energy to the lemonade and takes none away, so neither quantity can have changed for the portion in the glass or for the portion left behind in the bottle.' },
        { id: 'd', text: 'It is at the same temperature, 8 degrees Celsius, because dividing the lemonade does not change how fast a typical particle is moving, but it holds less thermal energy than the lemonade left in the bottle, because there are fewer particles to add up.', correct: true },
      ],
      expectedAnswer: 'It is at the same temperature, 8 degrees Celsius, because dividing the lemonade does not change how fast a typical particle is moving, but it holds less thermal energy than the lemonade left in the bottle, because there are fewer particles to add up.',
      hints: [
        'Pouring speeds no particle up and slows none down. Which of the two quantities is about the speed of a typical particle, and which one counts how many particles there are?',
        'Check the two quantities one at a time instead of together. Ask first what a thermometer would read in the glass, then ask whether 250 grams of lemonade can hold as much total energy of motion as 1,250 grams of the same lemonade at the same temperature.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-follows-about-temperature',
      kind: 'try_yourself',
      problem:
        'Two samples of the same substance are described to you like this, and nothing else is said about them: Sample P holds more thermal energy than Sample Q. You are not told the temperature of either sample, and you are not told how much of either sample there is. What follows about their temperatures?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sample P could be hotter than Sample Q, cooler than Sample Q, or at exactly the same temperature. Thermal energy is a total over all the particles, so nothing about the temperatures follows until you know how much of each sample there is.', correct: true },
        { id: 'b', text: 'Sample P must be at the higher temperature, because thermal energy is the quantity a thermometer measures, so a sample that holds more of it has to give the higher reading whatever else happens to be true of the two samples.' },
        { id: 'c', text: 'Sample P and Sample Q must be at the same temperature, because they are samples of one substance, and the particles of a given substance always move at the same average speed, so the only thing that can differ is the amount.' },
        { id: 'd', text: 'Sample P must be at the lower temperature, because a sample can only come to hold more thermal energy by being the bigger one, and spreading energy of motion through more matter always leaves each particle with less of it.' },
      ],
      expectedAnswer: 'Sample P could be hotter than Sample Q, cooler than Sample Q, or at exactly the same temperature. Thermal energy is a total over all the particles, so nothing about the temperatures follows until you know how much of each sample there is.',
      hints: [
        'A total can come out large for either of two reasons: each amount being added is large, or there are a great many amounts to add. Which of those two does a temperature reading tell you about?',
        'Try to build two different cases that both fit what you were told -- one in which Sample P is the hotter sample, and one in which Sample P is the cooler sample. If both can be built, that is the answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hotter-means-more-energy',
      kind: 'misconception_check',
      question:
        'A student writes: "A mug of water straight from the kettle is at 90 degrees Celsius, and the water in an unheated swimming pool is at 15 degrees Celsius. The mug is far hotter, so the mug must hold far more thermal energy. Thermal energy and temperature are two words for the same measurement anyway." Two separate things have gone wrong in that. What are they?',
      commonErrors: [
        {
          answer: 'The mug is far hotter, so the mug must hold far more thermal energy.',
          misconception:
            'Reading a thermometer as if it reported how much energy a sample is holding in total, so that the hotter sample automatically becomes the one with more thermal energy -- which is an easy habit to fall into, because in everyday life the hotter thing usually is the one that can do something to you.',
          correctsTo:
            'Temperature is the average kinetic energy per particle and thermal energy is the total across every particle in the sample, so a comparison of totals has to count the particles as well as read the thermometer. The mug holds a few hundred grams of water. A swimming pool holds many thousands of mugfuls of water. Each particle in the pool is moving more slowly on average than each particle in the mug, but there are so vastly many more of them that adding up their smaller amounts comes to far more than adding up the mug\'s. The pool holds far more thermal energy, and the pool is at the lower temperature. The test that settles it is to scoop one mugful out of the pool. That mugful reads 15 degrees Celsius, exactly as the whole pool does, and it holds only a tiny share of the pool\'s thermal energy -- so the amount changed the total and left the reading alone. WRONG: "Hotter, so more thermal energy." CORRECT: "Hotter means a higher average per particle. More thermal energy means a bigger total, and a total counts how much matter there is."',
        },
        {
          answer: 'Thermal energy and temperature are two words for the same measurement.',
          misconception:
            'Collapsing an average and a total into a single idea, which is easy to do because a thermometer reading is the only number most people ever attach to how hot something is, so it ends up being asked to mean everything.',
          correctsTo:
            'They are two different quantities, and only one of them can be read off a thermometer. Temperature is an average taken per particle, so dividing a sample does not change it: half a pot of water is at the same temperature as the whole pot was. Thermal energy is a total taken over the sample, so dividing a sample does change it: half a pot of water holds half the thermal energy the whole pot held. If the two words named the same measurement, dividing a sample could not possibly change one of them and leave the other exactly where it was. To state how much thermal energy a sample holds you need the temperature AND the amount of matter, and no thermometer will hand you the second of those. One more word to keep straight while you are here: an object has thermal energy, and it does not contain heat. Heat is the name for thermal energy moving from a warmer object to a cooler one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every particle in every sample is moving, and a moving particle has kinetic energy. The particles in one sample are not all moving at the same speed.',
        'Temperature is the AVERAGE kinetic energy per particle. It is what a thermometer reads, and it does not depend on how much of the sample there is.',
        'Thermal energy is the TOTAL kinetic energy of all the particles in the sample. It depends on the temperature AND on how much matter there is.',
        'Because one is an average and the other is a total, a cooler sample can hold more thermal energy than a hotter one: a bathtub of warm water holds more than a cup of boiling water.',
        'For the same substance at the same temperature, more matter means more thermal energy. For the same substance in the same amount, the higher temperature means more thermal energy.',
        'Divide a sample in half and the temperature does not move while the thermal energy is halved. That one test separates the two quantities every time.',
        'A large total says nothing on its own about the average behind it, so the sample holding the most thermal energy is not always the hottest sample.',
        'No thermometer can tell you how much thermal energy a sample holds. You need the reading and the amount of matter.',
        'An object has thermal energy; it does not contain heat. Heat is the name for thermal energy moving from a warmer object to a cooler one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Temperature & Thermal Energy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
