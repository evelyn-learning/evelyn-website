/**
 * Grade 8 Science (Physical Science) — Thermal Energy & Heat: Mass, Material
 * & Temperature Change.
 *
 * Row 5.3, procedure-led. One routine runs the whole lesson: list what was
 * held fixed across a set of described trials and what was changed, subtract
 * to get each trial's temperature CHANGE rather than reading its final
 * thermometer number, compare those changes, and name which of exactly three
 * factors -- the energy transferred in, the mass, or what the sample is made
 * of -- the difference is evidence about. The planning half of the row is the
 * same routine run backward: fix two of the three factors, change the third.
 *
 * The two traps it is built to kill are (a) reading a temperature rise as a
 * direct measure of how much energy went in, so that the sample that climbed
 * less "must have been given less", and (b) letting two factors change
 * between two trials and then reading the result as evidence about either of
 * them.
 *
 * SCOPE GUARD: this plan relates the energy transferred into a sample, its
 * mass and what it is made of to how far its temperature changes, and teaches
 * how to plan a trial that separates those three. Its scope cell carries NO
 * lineage clause -- no `m6*` or `m7*` predecessor is named for this row -- and
 * its withheld clause, verbatim, is: "Withholds specific heat as a number and
 * q = mcΔT (`chem-u9-specific-heat-calorimetry.ts`)." Every absence claimed
 * below is claimed of the plan's AUTHORED TEXT -- the objective, the segments
 * and the metadata -- and not of this guard or of the prerequisites/followUps
 * loIds, which necessarily spell out the neighboring rows' titles. What each
 * edge means, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 5.1 (temperature and thermal energy) is assumed,
 *     not re-taught: "temperature is an average taken per particle, thermal
 *     energy is a total taken over the sample" is restated in the vocabulary
 *     list and then USED as a reason in the third key idea, the first worked
 *     example and the misconception check, and the file says outright that it
 *     comes from an earlier lesson. Row 5.2 (the previous row) is referred to
 *     once, in the first key idea, as the last lesson about the ways thermal
 *     energy moves from a warmer thing to a cooler one; the words conduction,
 *     convection and radiation appear in no authored string, and no mechanism
 *     of transfer is described or classified anywhere in the body. Row 5.4
 *     (the next row) is not entered: no material is called an insulator or a
 *     conductor, no material is judged at blocking or boosting transfer, and
 *     no device or design is evaluated. Row 6.2 (changes of state) is kept out
 *     by stating in both worked examples and in each of the three items that
 *     the sample does not change state during the trial, so the temperature
 *     plateau is never in play. Row 6.3 (density) is not touched: the word
 *     density does not appear and no volume is ever stated.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: the beach in the hook and in one
 *     clue of the second worked example is an everyday temperature observation
 *     and nothing more. No sea breeze, ocean current, weather system, water
 *     cycle or climate is named, and the sea is never described as a system.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The investigation habit the row exercises --
 *     change one thing and hold the rest fixed -- is APPLIED, never taught as
 *     a topic: the words hypothesis, variable, independent, dependent,
 *     controlled and fair test appear in no authored string, and the file says
 *     "held fixed" and "changed" throughout instead.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the quantity this file
 *     stops short of is specific heat, and the formula it stops short of is
 *     q = mcΔT. The term "specific heat" appears in no authored string and no
 *     energy-per-degree NUMBER is ever stated; the material comparison is
 *     given only as a direction and as a ratio of two measured temperature
 *     CHANGES ("three times as far", "about three times as much energy to warm
 *     by one degree"). No energy anywhere is stated in joules, no heat
 *     capacity is named, the kelvin scale and absolute temperature do not
 *     appear, and no law of thermodynamics is stated.
 *   - BURNED EXAMPLES. The scope cell's own two examples -- the same burner
 *     warming a small pan faster than a large one, and beach sand hot while
 *     the sea is cool on the same afternoon -- are carried verbatim into
 *     `los[0].description`, which is student-facing, so both are used ONLY in
 *     teaching segments (the hook, and one clue in the second worked example)
 *     and neither appears in any item. Do not "helpfully" move one into an
 *     item later.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every trial is
 * written out in words inside the segment that uses it, with its mass in
 * grams, its heating time in minutes and its starting and ending temperatures
 * in degrees Celsius, and every item is solvable from the text printed inside
 * it. Never write "read the table of results", and never assume the student
 * has a heater, a thermometer or a balance in front of them. All invented data
 * is internally consistent: in the mass trials the temperature change is
 * inversely proportional to the mass (double the mass, half the change; triple
 * the mass, one third the change), and in the energy trials it is proportional
 * to the heating time.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.2 -> 5.3 -> 5.4
 * (`conduction-convection-and-radiation` ->
 * `mass-material-and-temperature-change` ->
 * `insulators-conductors-and-thermal-design`), and both arrays below are
 * populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U5_MASS_MATERIAL_AND_TEMPERATURE_CHANGE: LessonPlan = {
  id: 'evelyn.ms.m8sci.mass-material-and-temperature-change.v1',
  title: 'Mass, Material & Temperature Change',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.mass-material-and-temperature-change',
      standard: 'M8SCI-5.3',
      description:
        'Use investigation data to relate the energy transferred to a sample, its mass, and what it is made of, to how much its temperature changes (the same burner warms a small pan faster than a large one; beach sand is hot while the sea is cool on the same afternoon), and plan such an investigation (what to change, what to hold fixed) (NGSS MS-PS3-4).',
    },
  ],
  prerequisites: ['m8sci.conduction-convection-and-radiation'],
  followUps: ['m8sci.insulators-conductors-and-thermal-design'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two familiar puzzles side by side -- the big pot that takes forever on the same ring, and the beach where the sand burns and the sea is freezing -- so the student wants one rule that handles both.',
      script:
        'Think about the last time you waited for water to heat up. A small pan with just enough water for two eggs goes on the ring, and a few minutes later it is steaming. Fill the biggest pot in the kitchen for pasta, put it on the same ring turned up the same way, and you can go and do something else, because it takes far longer to get anywhere. The ring did not change. The water did not change. The only thing that changed is how much water is sitting on it. Now hold that and go somewhere completely different. It is the middle of a hot afternoon at the beach. The dry sand is so hot you have to run across it, and the sea a few steps away is cold enough to make you gasp. The same sunlight has been falling on the sand and on the water all day long. Two puzzles, and one answer underneath both of them. How far something warms up is never decided by the heater alone. It is decided by three things at once: how much energy goes in, how much of the stuff there is, and what the stuff is. Today you get a routine for pulling those three apart in somebody else\'s results, and for planning a test that keeps them from getting tangled together in the first place.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-factors-and-the-routine',
      kind: 'concept',
      goal: 'Install the three factors and the direction each one pushes, the temperature-change-not-final-reading habit, the routine for reading a set of trials, and the same routine run backward as a plan.',
      keyIdeas: [
        'THREE THINGS DECIDE HOW FAR A TEMPERATURE MOVES. When energy is transferred into a sample and the sample does not change state, how far its temperature climbs depends on exactly three things: how much energy went in, how much mass the sample has, and what the sample is made of. Change any one of the three and you get a different temperature change. Notice those two words, temperature change. What this lesson compares is always the DIFFERENCE between the starting temperature and the ending temperature, never the ending reading on its own. A sample that starts at 10 degrees Celsius and ends at 30 degrees Celsius has changed by 20 degrees Celsius, and so has one that starts at 50 degrees Celsius and ends at 70 degrees Celsius. The last lesson was about the ways thermal energy moves from a warmer thing to a cooler one. This lesson starts the moment it has arrived, and asks how far the temperature moves once it does.',
        'MORE ENERGY IN MEANS A BIGGER TEMPERATURE CHANGE. Hold the sample itself the same -- same material, same mass -- and the temperature change grows with the energy transferred into it. The same heater left on for twice as long puts in about twice as much energy, and the temperature change is about twice as big. This is the one of the three relationships that runs the way everyday experience expects, which is exactly why it is worth saying out loud before the other two, because they do not.',
        'MORE MASS MEANS A SMALLER TEMPERATURE CHANGE, FOR THE SAME ENERGY. Take the same material and put the same energy in, but use twice as much of it, and the temperature climbs only half as far. The reason is in the particles. The arriving energy is shared out among every particle in the sample, so with twice as many particles each one gains, on average, half as much, and the temperature is precisely that average. Now the careful part, and it is the part most people get wrong: the bigger sample did NOT receive less energy. It received the same energy and it gained the same thermal energy. Temperature is an average taken per particle and thermal energy is a total taken over the whole sample, which is the distinction from the earlier lesson, and this is where that distinction earns its keep.',
        'WHAT THE SAMPLE IS MADE OF MATTERS ALL ON ITS OWN. Take two samples of the SAME mass, transfer the SAME energy into each, and their temperatures still do not climb by the same amount, because different materials take different amounts of energy to warm each gram by one degree. Water is the extreme case among everyday materials: a given mass of water takes far more energy to warm by one degree than the same mass of dry sand, dry soil or iron does. That is the main reason the sea beside a beach stays cool through an afternoon in which the dry sand becomes too hot to stand on. And it runs backward too -- a material whose temperature climbs only a little for a given amount of energy going in also falls only a little for the same amount coming back out. This lesson stops at the comparison, more energy per degree or less, and never puts a number on it.',
        'THE ROUTINE FOR READING A SET OF TRIALS. One, write down what was held fixed across the trials and what was changed. Two, for every trial work out the temperature change: ending temperature minus starting temperature. Three, compare those changes with each other, by dividing if the numbers divide cleanly. Four, name the factor. If the mass was the only thing that differed, the difference is evidence about mass; if the material was the only thing that differed, it is evidence about material; if the energy was the only thing that differed, it is evidence about energy. Five, and this step saves you more often than the other four, if MORE THAN ONE thing differed between two trials, stop there. Those trials cannot tell you which of the changes caused the difference, and the honest answer is that the comparison does not settle it.',
        'PLANNING A TRIAL IS THE SAME ROUTINE RUN BACKWARD. Decide which of the three factors you are asking about, then build two trials that differ in that factor and in nothing else. To test mass: same material, same heater, same heating time, two different masses. To test material: same mass, same heater, same heating time, two different materials. To test the energy: same material, same mass, one heater left on longer than the other. Measure every sample before the heater goes on and again when it goes off, so that what you end up holding is a change and not just a final reading. Then run each trial more than once, so a single odd result cannot decide the answer on its own.',
      ],
      vocabulary: [
        { term: 'temperature change', definition: 'the ending temperature of a sample minus its starting temperature -- how far the temperature moved, not the reading it finished on.' },
        { term: 'mass', definition: 'the amount of matter in a sample, measured in grams or kilograms.' },
        { term: 'energy transferred', definition: 'the energy that moves into a sample from something warmer, such as a heater; the same heater left on for the same time transfers about the same energy every trial.' },
        { term: 'material', definition: 'what a sample is made of -- water, iron, sand -- as opposed to how much of it there is.' },
        { term: 'thermal energy', definition: 'the total energy of the motion of all a sample\'s particles. A total, not an average, which is how it differs from temperature.' },
        { term: 'held fixed', definition: 'kept deliberately the same in every trial, so that it cannot be the cause of any difference between them.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-masses-of-water',
      kind: 'worked_example',
      problem:
        'Two trials use water and two identical electric heaters. Trial 1: 100 grams of water, starting at 20 degrees Celsius, with the heater switched on for 2 minutes. The water ends at 40 degrees Celsius. Trial 2: 200 grams of water, also starting at 20 degrees Celsius, with an identical heater switched on for the same 2 minutes. That water ends at 30 degrees Celsius. Neither sample boils or changes state. What do these two trials show, and why did the second one end cooler?',
      steps: [
        'Step 1, name what was held fixed and what was changed. Held fixed: the material (water in both), the starting temperature (20 degrees Celsius in both), the heater (identical), and the heating time (2 minutes in both). Identical heaters left on for the same time transfer about the same energy, so the energy transferred in was held fixed as well. Changed: the mass, 100 grams in Trial 1 and 200 grams in Trial 2. Exactly one thing changed, and that is what makes this pair of trials worth reading at all.',
        'Step 2, work out each temperature change. Trial 1: 40 degrees Celsius minus 20 degrees Celsius is a change of 20 degrees Celsius. Trial 2: 30 degrees Celsius minus 20 degrees Celsius is a change of 10 degrees Celsius. Compare the changes and not the final readings. Here both samples happened to start at the same temperature, so the two comparisons agree, but they will not always agree, and the change is the honest one.',
        'Step 3, compare and name the factor. The mass doubled, from 100 grams to 200 grams, and the temperature change halved, from 20 degrees Celsius to 10 degrees Celsius: 200 divided by 100 is 2, and 20 divided by 10 is 2. Mass was the only thing that changed, so mass is what the difference is evidence about, and the pattern is an inverse one -- more mass, less temperature change, for the same energy.',
        'Step 4, say WHY, in the particle picture. The same energy arrived in both samples. In Trial 2 that energy was shared among twice as many water particles, so each particle gained on average half as much, and the temperature is exactly that average. WRONG: "The 200-gram sample ended cooler, so less energy went into it." CORRECT: "The same energy went into it, and it gained the same thermal energy as the 100-gram sample. That energy simply had twice as much water to spread through, so the average per particle -- which is the temperature -- moved half as far."',
        'Now run the two checks a science answer needs, because there is very little arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The design of the trials says mass was the only thing free to differ, so mass is the only candidate. The particle picture predicted the result before anyone read the data: one helping of energy split among twice as many particles gives half the average gain. And a rule from an earlier lesson agrees from a third direction: the 200-gram sample gained the same thermal energy while showing half the temperature change, which is exactly what has to happen if temperature is an average and thermal energy is a total. The trial design, the mechanism, and a rule from elsewhere -- three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves the way it should. Leave the identical heater on the 200-gram sample for 4 minutes instead of 2. That is twice as long, so about twice as much energy goes in, and the temperature change doubles from 10 degrees Celsius to 20 degrees Celsius: the water ends at 40 degrees Celsius, which is exactly where the 100-gram sample finished in half the time. The mass did not change, so the mass explanation is untouched. What moved was the energy, and the answer moved with it in the direction the second key idea says it should. If the 200-gram sample had somehow been unable to warm, extra time could not have rescued it.',
      ],
      answer:
        'They show that for the same material, the same starting temperature and the same energy transferred in, doubling the mass halves the temperature change: a change of 20 degrees Celsius for 100 grams, and 10 degrees Celsius for 200 grams. The second sample did not end cooler because less energy reached it. It received the same energy and gained the same thermal energy; that energy was shared among twice as many water particles, so the average energy per particle -- which is what a temperature measures -- climbed only half as far.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-liquids-and-a-plan',
      kind: 'worked_example',
      problem:
        'Two trials use two different liquids, Liquid P and Liquid Q, and two identical electric heaters. Trial 1: 100 grams of Liquid P, starting at 20 degrees Celsius, heater on for 3 minutes. It ends at 32 degrees Celsius. Trial 2: 100 grams of Liquid Q, also starting at 20 degrees Celsius, an identical heater on for the same 3 minutes. It ends at 56 degrees Celsius. Neither liquid boils or changes state at any point. What do these trials show? Then plan a trial that would find out whether the MASS of Liquid Q changes how far its temperature climbs.',
      steps: [
        'Step 1, held fixed and changed. Held fixed: the mass (100 grams each), the starting temperature (20 degrees Celsius each), the heater, and the heating time, so the energy transferred in was the same in both. Changed: the material, Liquid P in one trial and Liquid Q in the other. One thing changed, so the trials are readable.',
        'Step 2, the temperature changes. Liquid P: 32 degrees Celsius minus 20 degrees Celsius is a change of 12 degrees Celsius. Liquid Q: 56 degrees Celsius minus 20 degrees Celsius is a change of 36 degrees Celsius. Step 3, compare them: 36 divided by 12 is 3, so Liquid Q\'s temperature climbed three times as far as Liquid P\'s did.',
        'Step 4, name the factor and say what it means. Mass and energy were held fixed, so the material is the only candidate left, and the difference is evidence about the material. Now turn the comparison around, because that is the useful way to hold it: to move the same 100 grams by one degree, Liquid P needs about three times as much energy as Liquid Q does. Some materials take a lot of energy for each degree and some take very little, and that is a property of the material itself rather than of how much of it you have. WRONG: "Liquid Q ended hotter, so Liquid Q was given more energy." CORRECT: "Identical heaters ran for the same 3 minutes, so both were given about the same energy. Liquid Q\'s temperature simply travels farther on it."',
        'Now the plan. The question is whether the MASS of Liquid Q changes how far its temperature climbs, so mass is the one thing to change and everything else is held fixed: Liquid Q in both trials, the same starting temperature, the same heater, the same heating time. Use 100 grams in one trial and 200 grams in the other. Take each sample\'s temperature before the heater goes on and again when it goes off, and subtract to get each change. Run the pair more than once. If the 200-gram trial shows about half the change of the 100-gram trial, the answer is yes, and the mass is the reason.',
        'Run the two checks. First, three clues of DIFFERENT KINDS agree that the difference belongs to the material. The design of the trials leaves nothing else free to vary. The everyday world shows the same pattern: a given mass of water takes far more energy to warm by one degree than the same mass of dry sand does, which is the main reason the sea beside a beach stays cool through an afternoon in which the dry sand becomes too hot to stand on. And the pattern runs backward as well as forward -- a material that climbs only a little for a given amount of energy going in also falls only a little for the same amount coming back out, which is why that same sea is barely cooler at dawn while the sand that was scorching has gone cold.',
        'Second, change one condition and check that the answer moves. Run Liquid Q again with its heater on for 1 minute instead of 3. One third of the time is about one third of the energy, so Liquid Q\'s temperature change falls from 36 degrees Celsius to 12 degrees Celsius -- which is exactly what Liquid P did in 3 minutes. Put those two trials side by side on their own and the two liquids look identical, and that would be the wrong conclusion. Nothing about either liquid changed. What changed is that the energy stopped being held fixed. That is the whole reason the routine begins by listing what was held fixed, and the reason a comparison that lets two things change cannot be repaired afterwards.',
      ],
      answer:
        'They show that what a sample is made of changes how far its temperature climbs all on its own, separately from mass and from energy: with the mass and the energy held fixed, Liquid Q changed by 36 degrees Celsius while Liquid P changed by 12 degrees Celsius, so Liquid P takes about three times as much energy as Liquid Q to warm the same mass by one degree. To test whether the mass of Liquid Q matters, keep the liquid, the starting temperature, the heater and the heating time the same and change only the mass -- 100 grams in one trial and 200 grams in the other -- measuring each sample before and after and comparing the two temperature changes.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-metal-blocks',
      kind: 'try_yourself',
      problem:
        'An investigation uses two blocks cut from the same metal. Block A has a mass of 250 grams. Block B has a mass of 750 grams. Each block is warmed by its own identical heater, each heater is switched on for exactly 3 minutes, so the same amount of energy is transferred into each block, and nothing else about the two setups is different. Both blocks start at 20 degrees Celsius and neither one melts. Block A\'s temperature rises by 24 degrees Celsius. What happens to Block B\'s temperature, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It rises by about 8 degrees Celsius, because Block B has three times the mass, so the same energy is shared among three times as many particles and the average gain per particle is one third as large.', correct: true },
        { id: 'b', text: 'It rises by about 24 degrees Celsius as well, because both blocks are cut from the same metal and were given the same energy, and how much of a material you have does not change how far its temperature moves.' },
        { id: 'c', text: 'It rises by about 72 degrees Celsius, because Block B holds three times as much matter and therefore takes in three times as much thermal energy, so its temperature has to climb three times as far.' },
        { id: 'd', text: 'It rises by about 8 degrees Celsius, but only because a larger block leaks more energy back out into the room while it is being warmed, so less of the heater\'s energy is left inside the metal.' },
      ],
      expectedAnswer: 'It rises by about 8 degrees Celsius, because Block B has three times the mass, so the same energy is shared among three times as many particles and the average gain per particle is one third as large.',
      hints: [
        'Start by listing what was held fixed and what was changed. The metal, the heater, the heating time and the starting temperature are all the same, so the energy going in is the same. Only one thing differs between the two blocks -- what is it?',
        'Now think about where that energy goes once it is inside. It spreads through every particle of the block. If there are three times as many particles sharing it, how much does each one gain on average, and what does that do to the average, which is the temperature?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-materials-same-mass',
      kind: 'try_yourself',
      problem:
        'Sample X is 50 grams of one material. Sample Y is 50 grams of a different material. Each sample sits in its own identical heater, both heaters are switched on for 4 minutes, so the same amount of energy is transferred into each sample. Both samples start at 18 degrees Celsius, and neither one melts, boils or changes state during the trial. Sample X ends at 26 degrees Celsius. Sample Y ends at 42 degrees Celsius. What do these results show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sample X must be the more massive of the two, because a larger mass always shares the arriving energy among more particles and so shows the smaller temperature rise, and mass is the only thing that has ever been shown to hold a rise down like that.' },
        { id: 'b', text: 'With the mass and the energy held fixed, Sample Y\'s temperature climbed three times as far as Sample X\'s, so X takes about three times as much energy to warm by one degree, and the only thing left that can explain that is what the two samples are made of.', correct: true },
        { id: 'c', text: 'Sample Y\'s heater must have been the stronger of the two, because two heaters can run for the same 4 minutes and still put in very different amounts of energy, and the only way one sample climbs further than another is for more energy to have gone in.' },
        { id: 'd', text: 'Sample Y is now holding three times as much thermal energy as Sample X, because a thermometer reading is a direct measure of how much thermal energy a sample is holding, and Sample Y finished on a reading far above the one Sample X finished on.' },
      ],
      expectedAnswer: 'With the mass and the energy held fixed, Sample Y\'s temperature climbed three times as far as Sample X\'s, so X takes about three times as much energy to warm by one degree, and the only thing left that can explain that is what the two samples are made of.',
      hints: [
        'Work out each temperature change first: ending temperature minus starting temperature, for both samples. Then ask how many times larger one of those changes is than the other.',
        'Now go through the three factors that can move a temperature. The masses are stated, and they are equal. The heaters are identical and ran for the same time, so the energy is equal too. Which of the three is left?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plan-the-material-test',
      kind: 'try_yourself',
      problem:
        'A student already knows that a sample\'s mass changes how far its temperature rises. Now the student wants to find out whether the material a sample is made of changes how far its temperature rises for a given amount of energy. Four plans are proposed. Every one of them uses the same kind of heater and measures each sample\'s temperature before the heating and again afterwards, and in every one the samples stay solid or stay liquid throughout. Which plan can answer the question, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Heat 100 grams of Material J for 2 minutes and 300 grams of Material K for 6 minutes, then compare the two temperature changes, because tripling the mass and tripling the heating time cancel each other out and leave the material as the only difference that counts.' },
        { id: 'b', text: 'Heat 100 grams of Material J for 2 minutes, then heat that same 100 grams of Material J for 6 minutes, and compare the two temperature changes, because running one material at two different amounts of energy is what shows you how that material responds.' },
        { id: 'c', text: 'Heat 100 grams of Material J for 2 minutes and 100 grams of Material K for 2 minutes, then compare the two temperature changes, because the mass and the energy transferred are both held fixed and the material is the only thing left that could have caused a difference.', correct: true },
        { id: 'd', text: 'Heat 100 grams of Material J for 2 minutes and 300 grams of Material K for 2 minutes, then compare the two temperature changes, because giving Material K more mass to work with lets its temperature show what the material can really do.' },
      ],
      expectedAnswer: 'Heat 100 grams of Material J for 2 minutes and 100 grams of Material K for 2 minutes, then compare the two temperature changes, because the mass and the energy transferred are both held fixed and the material is the only thing left that could have caused a difference.',
      hints: [
        'The question names one factor, the material. In a plan that can answer it, the material has to be the only thing that differs between the two trials. Go through each plan and hunt for a second difference hiding inside it.',
        'Watch out for a plan that changes two things and then argues that the two cancel. Two changes that really did cancel would leave no difference to read at all, and two that did not cancel would leave you unable to say which one caused the difference you read.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rise-means-energy',
      kind: 'misconception_check',
      question:
        'A student is writing up two sets of results and says: "In the water trials the 200-gram sample only warmed by 10 degrees Celsius while the 100-gram sample warmed by 20 degrees Celsius, so the big sample must have been given less energy. And in the other set, Sample R finished at 40 degrees Celsius and Sample S finished at 48 degrees Celsius, so Sample S is the one whose temperature moved further." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The 200-gram sample only warmed by 10 degrees Celsius, so it must have been given less energy.',
          misconception:
            'Reading a temperature rise as a direct measure of the energy that went in, because the thermometer is the only instrument in the trial and it is tempting to treat its reading as an energy meter.',
          correctsTo:
            'Identical heaters left on for the same 2 minutes transfer about the same energy, so the same energy went into both samples and both gained the same amount of thermal energy. What differs is how far that energy moved the temperature. Temperature is an average taken per particle; thermal energy is a total taken over the whole sample. The 200-gram sample has twice as many particles sharing the same arriving energy, so each particle gains on average half as much and the average -- the temperature -- climbs half as far. WRONG: "It warmed less, so it was given less energy." CORRECT: "It was given the same energy and gained the same thermal energy, and that energy had twice as much water to spread through."',
        },
        {
          answer: 'Sample R finished at 40 degrees Celsius and Sample S finished at 48 degrees Celsius, so Sample S is the one whose temperature moved further.',
          misconception:
            'Comparing the final thermometer readings instead of the temperature changes, because the final reading is the number the trial ends on and it feels like the result.',
          correctsTo:
            'A final reading depends on where the sample started as well as on how far it moved, so it cannot be compared until you subtract. Suppose Sample R started at 10 degrees Celsius and finished at 40 degrees Celsius: its temperature changed by 30 degrees Celsius. Suppose Sample S started at 30 degrees Celsius and finished at 48 degrees Celsius: its temperature changed by 18 degrees Celsius. Sample R moved further, not Sample S, even though Sample S finished on the higher number. Always subtract the starting temperature from the ending temperature, for every trial, before any comparison is made. WRONG: "Sample S finished higher, so Sample S moved further." CORRECT: "Sample R changed by 30 degrees Celsius and Sample S by 18 degrees Celsius, so Sample R moved further, even though Sample S finished on the higher reading."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'How far a sample\'s temperature changes depends on three things at once: how much energy was transferred into it, how much mass it has, and what it is made of.',
        'Always work with the temperature CHANGE -- ending temperature minus starting temperature -- and never with the final reading on its own.',
        'More energy in, for the same sample, means a bigger temperature change. The same heater on for twice as long is about twice the energy and about twice the change.',
        'More mass, for the same energy and the same material, means a SMALLER temperature change. The energy is shared among more particles, so the average gain per particle -- the temperature -- is smaller.',
        'The bigger sample was not given less energy. It was given the same energy and gained the same thermal energy. Temperature is an average taken per particle; thermal energy is a total taken over the sample.',
        'Two samples of the same mass given the same energy still change by different amounts when they are made of different materials. A given mass of water takes far more energy to warm by one degree than the same mass of dry sand does.',
        'To read a set of trials: list what was held fixed and what was changed, subtract to get every temperature change, compare them, and name the factor. If more than one thing changed, the comparison settles nothing.',
        'To plan a trial: change only the factor you are asking about, hold the other two fixed, measure before and after, and run it more than once.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Mass, Material & Temperature Change' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
