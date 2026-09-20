/**
 * Grade 8 Science (Physical Science) — Amplitude & Wave Energy.
 *
 * Row 9.4, concept-led. There is no procedure to lean on: the whole lesson
 * builds one claim and then teaches the student to argue it from described
 * observations — for two waves of the same kind, in the same material,
 * arriving at the same rate, the one whose material is pushed further from
 * its rest position carries more energy. The evidence is never the wave
 * itself; it is what changes at the far end, where the wave arrives. So the
 * lesson spends most of its time on the ARGUMENT: name the two waves, name
 * what is being held fixed, name the observation at the far end, and say
 * which way it points -- and say only that much, because how MUCH more is a
 * question this course does not answer.
 *
 * The two traps it is built to kill are (a) the one-for-one reading, in
 * which twice the height is read off as twice the energy, and (b) the
 * confounded comparison, in which the amplitude and the frequency both
 * change and the student decides from the amplitude alone. The second trap
 * is the reason the row's own rule carries the words "of the same
 * frequency", and every item in this file either holds the frequency fixed
 * or is about what goes wrong when it is not.
 *
 * SCOPE GUARD: this plan argues, from observations written out in words,
 * that the energy a wave carries grows with its amplitude, and compares two
 * waves of the SAME frequency by amplitude. Per CONTROLLER RULING 33, this
 * row's curriculum scope cell carries NO LINEAGE CLAUSE -- no m6sci or m7sci
 * predecessor is named for this row, and none has been invented here. Its
 * withheld clause, verbatim, is: "Withholds the "energy proportional to
 * amplitude squared" statement and intensity (AP Physics)." Every absence
 * claimed below is claimed of the plan's AUTHORED TEXT -- the objective, the
 * segments and the metadata -- and not of this guard, which necessarily
 * names what the plan excludes, nor of the chain loIds, which necessarily
 * name the neighboring rows. What each edge means, and what is deliberately
 * ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 9.2 (amplitude, wavelength and frequency) owns
 *     the MEASURES and how to read them. This file never teaches how to
 *     measure an amplitude or a wavelength and never asks a student to read
 *     one: amplitude and frequency are restated in the vocabulary list as
 *     words the student already holds, every amplitude in the file is HANDED
 *     to the reader as a stated height above the rest position, and the word
 *     "wavelength" appears nowhere in the authored text. The unit "hertz" is
 *     not used anywhere; a frequency is written as a count of whole waves
 *     each second, because this row only ever holds a frequency FIXED and
 *     never reads one off. Pitch is named in no authored string; loudness
 *     and brightness are restated in the vocabulary as what a sound wave's
 *     and a light wave's amplitude come through as, which is what makes the
 *     energy evidence in this row legible. Row 9.3 (wave speed) is the
 *     previous row and is assumed, not re-taught: the fact that a wave's
 *     speed is set by the material it travels through appears in four places
 *     -- concept keyIdea 4, the second worked example's WRONG/CORRECT step
 *     and its answer, and the second misconception correction -- and in
 *     every one of them it is used only to say that changing the amplitude
 *     does not change the speed, so a bigger wave is not a faster wave.
 *     No wave speed is computed
 *     anywhere, no distance is found from a time, and the only speed value
 *     in the authored text is "about 340 meters per second in air at room
 *     temperature", which is on the contract's safe-figure list and appears
 *     exactly once, in the second misconception correction, purely to say
 *     that two sounds in the same air arrive together. Row 9.1 (what a wave is) is assumed: the
 *     words "transverse" and "longitudinal" appear in no authored string,
 *     and the fact that a wave does not carry the matter along is stated
 *     only as the reason an arriving wave is not delivering a load of water
 *     -- once in concept keyIdea 1 and once in a try_yourself distractor.
 *     Row 10.1 (reflection, absorption and transmission) owns what happens
 *     when a wave MEETS a material: this file says that an arriving wave
 *     does something to what it reaches, and never says what fraction of it
 *     bounces back, soaks in or passes through; the words "reflect",
 *     "absorb" and "transmit" appear nowhere in the authored text.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: water is used three times as a
 *     material a wave travels through -- the sea in the hook, a lake surface
 *     in the second try_yourself, and a straight water channel in the
 *     misconception check -- and never as an Earth system. The one mention
 *     of sand in the body is the cell's own ocean example in concept
 *     keyIdea 2, stated in a single clause as an observation of a wave doing
 *     more where it arrives; it also stands in the objective, because part
 *     (i) is copied verbatim there. There is no shoreline change, no erosion, no tide, no
 *     current, no weather system, no earthquake and no seismic wave anywhere
 *     in the file, and no water wave is given a cause.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. People appear only as the things that make
 *     and receive waves -- a body shoved by a sea wave, a chest that feels a
 *     loud drum, an arm that tires from shaking a line, a hand that feels a
 *     warmed sheet of paper, and an ear named once as where a loudness
 *     is judged -- and
 *     there is no organism, no cell, no sense organ and no mechanism of
 *     hearing or seeing anywhere in the file.
 *   - HS CHEMISTRY boundary: no chemical content is in scope for this row,
 *     and none appears -- no substance, no particle model of matter, no
 *     formula and no reaction anywhere in the authored text.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above). The quantities and structures this file
 *     stops short of, named: the statement that a wave's energy is
 *     PROPORTIONAL TO THE SQUARE OF ITS AMPLITUDE, which is the cell's own
 *     withheld item; INTENSITY, the decibel, and power delivered per unit of
 *     area; the period and phase; and the energy of light treated as
 *     anything other than a wave arriving. The words "proportional",
 *     "squared", "intensity", "decibel", "period", "phase", "photon",
 *     "joule" and "watt" appear in no authored string. NO FORMULA of any
 *     kind is written anywhere in the file, in symbols or in words. Every
 *     comparison the file makes is a DIRECTION -- which of two waves carries
 *     more -- and the file says outright, in concept keyIdea 6, in the
 *     first worked example's fourth step and in the misconception check,
 *     that it is not saying how many times more. The one place a student
 *     would expect a number, the "twice as tall must be twice the energy"
 *     error, is corrected with the direction only: the energy grows faster
 *     than the height does, and the exact relationship belongs to a later
 *     course.
 *
 * NOTE ON BURNED CELL EXAMPLES (controller rulings 32 and 36): part (i) of
 * this row's scope cell is copied into `los[0].description`, which is
 * student-facing, and it names three observations outright -- a bigger ocean
 * wave moving more sand, a louder sound shaking a window, and a brighter
 * light warming a surface more. All three are therefore BURNED for items,
 * since each is answerable straight off the objective, and all three appear
 * in this file ONLY in concept keyIdea 2, where they are taught as the three
 * families of evidence -- and, unavoidably, in the objective itself, which
 * copies part (i) verbatim. Grepped against the authored text: "sand" and "window"
 * occur twice each, once in the objective and once in that keyIdea, and
 * nowhere else. No item uses sand, a window or a warmed surface. The three item
 * specimens are fresh and appear in no teaching segment: a drum heard twice
 * in a concert hall, waves reaching a lake dock in the morning and in the
 * afternoon, and a choice between four proposed comparisons. The teaching
 * specimens are likewise used once each: the sea in the hook, two reading
 * lamps and a solar-powered calculator in the first worked example, a
 * clothesline and a clothespin in the second, and a wave pool, a straight
 * water channel and two claps in a gym in the misconception check. Do not "helpfully"
 * move the clothesline or the lamps into an item later, and do not build an
 * item on sand, a window or a warmed surface.
 *
 * NOTE ON SALVAGE: the curriculum's Salvage column for this row reads
 * "none", and nothing was salvaged. No legacy file was opened for content.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every wave in
 * this file is written out in words inside the segment that uses it -- where
 * the rest position is, how far the humps rise above it, how many whole
 * waves arrive each second, and what is sitting at the far end -- and every
 * item is solvable from the text printed inside it. Never write "look at the
 * two waves shown", and never assume the student has a rope, a lamp, a
 * speaker or a stopwatch in front of them. Where an investigation is
 * described (controller ruling 38), the whole setup and every reading are
 * given in words, and no item asks for an observation the student must make
 * themselves.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 9.3 -> 9.4 ->
 * 10.1 (`wave-speed-frequency-and-wavelength` before it,
 * `reflection-absorption-and-transmission` after it), and both arrays are
 * populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U9_AMPLITUDE_AND_WAVE_ENERGY: LessonPlan = {
  id: 'evelyn.ms.m8sci.amplitude-and-wave-energy.v1',
  title: 'Amplitude & Wave Energy',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.amplitude-and-wave-energy',
      standard: 'M8SCI-9.4',
      description:
        'Argue from observations that the energy a wave carries grows with its amplitude -- a bigger ocean wave moves more sand, a louder sound shakes a window, a brighter light warms a surface more -- and compare the energy of two waves of the same frequency by amplitude (NGSS MS-PS4-1).',
    },
  ],
  prerequisites: ['m8sci.wave-speed-frequency-and-wavelength'],
  followUps: ['m8sci.reflection-absorption-and-transmission'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two waves from the same afternoon side by side -- the ripple you ignore and the wave that shoves you -- so the student wants to know what is different about the big one, and hears that the difference has a name they already use.',
      script:
        'Think about standing in the sea, about waist deep, on a day when the water is not doing anything dramatic. Small ripples come past you every few seconds and you barely notice them. Your body rocks a little and that is it. Now think about later the same afternoon, when the water has built up. The waves are arriving just as often -- about one every few seconds, same as before -- but now one of them shoves you back a step and you have to plant your feet. Same sea. Same water. Waves arriving at the same rate. The only thing that changed is how far up and down the water surface is moving as each wave goes by, and that is the measure you already know by name: the amplitude. So here is the question this lesson answers. Why should a taller wave be able to move you when a smaller one arriving just as often cannot? What is the taller one bringing that the shorter one is not, and how would you argue for your answer using something other than "well, obviously"? By the end you will be able to take two waves described to you in words, say which one carries more energy, and name the exact observation that proves it.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-amplitude-carries-the-energy',
      kind: 'concept',
      goal: 'Establish that a wave delivers energy, that amplitude is the dial that sets how much when the frequency is held fixed, and that the claim is a direction and not a ratio -- then give the four-move argument the items will run.',
      keyIdeas: [
        'A WAVE ARRIVES CARRYING ENERGY, AND THE ONLY WAY TO SEE IT IS TO WATCH THE FAR END. A wave is a disturbance that travels, and you already know that it does not carry the material along with it -- the water at the beach is the same water it was before, and the air in a room does not blow across at you when someone speaks. What travels from one end to the other is energy. So you can never point at a wave and see its energy directly. You have to watch what happens where the wave arrives, and ask whether something there changed. Did an object move that was still before? Did something rattle, swing, get flicked, get warmer, or start working? Every argument in this lesson is built on an observation at the far end, and an argument with no far-end observation in it is not finished.',
        'AMPLITUDE IS THE DIAL THAT PUTS ENERGY INTO THE WAVE. Amplitude is how far the material is pushed away from its rest position as the wave goes by. Turning that dial up costs something at the source: to make a bigger wave you have to shake the rope through a wider swing, drive the loudspeaker cone further in and out, or push more water further up. Energy is never made out of nothing, so that extra effort at the source is where the extra energy in the wave comes from, and the wave carries it along to whatever it reaches. That is why the three observations people always reach for point the same way: a bigger ocean wave moves more sand than a small one, a louder sound shakes a window harder than a quiet one, and a brighter light warms a surface more than a dim one. WRONG: "The energy is stored up in the humps, so the dips between them are carrying nothing." CORRECT: "A hump and a dip are both the material pushed away from its rest position, one way and then the other way, and the energy is carried by the whole repeating disturbance -- not piled up in the high parts."',
        'THE COMPARISON IS ONLY HONEST WHEN THE FREQUENCY IS HELD FIXED. Amplitude is not the only measure a wave has. How often the waves arrive matters too, and a small wave arriving very often can deliver plenty of energy. That is exactly why the rule in this lesson is written for two waves OF THE SAME FREQUENCY: for two waves of the same kind, traveling in the same material, arriving at the same rate, the one with the bigger amplitude carries more energy. Take the same-rate condition away and the comparison stops working. If one wave has taller humps AND the other brings many more waves each second, then two things changed at once, and the taller humps on their own do not settle it. When you are handed a comparison like that, the correct answer is that this comparison does not test the claim -- not a guess about which one wins.',
        'CHANGING THE AMPLITUDE DOES NOT CHANGE THE SPEED. You know from the last lesson that a wave travels at a speed set by the material it is moving through, not by whoever made it. Making a wave bigger does not make it hurry. Two sounds crossing the same room reach you at the same instant whether one is a whisper and the other is a shout, and the big sea wave and the small one roll in at the same pace. So when a big wave does more damage than a small one, the reason is not that it arrived faster or hit at a higher speed. The reason is that it arrived carrying more energy. Keep those two apart, because a wave that carries more energy and a wave that travels faster are different claims about different measurements.',
        'HOW TO ARGUE THE COMPARISON, IN FOUR MOVES. First, state the claim you are testing: the wave with the bigger amplitude carries more energy. Second, name the two waves and list what is being held fixed -- same kind of wave, same material, same distance, same rate of arrival. Third, name the observation at the far end and say what it took: an object that was flicked off, a panel that started working, a surface that got warmer. Fourth, say which way the evidence points, and stop there. If something other than the amplitude also changed between the two waves, the honest fourth move is to say that the comparison cannot settle the claim, and to say what you would change to fix it.',
        'SAY WHICH ONE, NOT HOW MANY TIMES. This lesson compares two waves and tells you which one carries more energy. It does not tell you how much more, and you should not estimate it. It is tempting to look at a wave whose humps are twice as high and say that it must carry twice the energy, and that is not how it works: the energy grows faster than the height does. Working out exactly how much faster is a job for a later course with more mathematics in it. Here, the finished answer is a direction with a reason and an observation attached -- "the second wave carried more energy, because it pushed the material much further from its rest position while the waves kept arriving at the same rate, and that is why the object at the far end was knocked loose when the first wave only shook it."',
      ],
      vocabulary: [
        { term: 'amplitude', definition: 'how far the material of a wave is pushed from its rest position, measured from the rest position up to the top of a hump. You met this measure in an earlier lesson; here it is always given to you, never measured.' },
        { term: 'rest position', definition: 'where the material sits when no wave is passing -- the flat line of a still water surface, or a hanging line that nobody is shaking.' },
        { term: 'frequency', definition: 'how many whole waves pass a fixed point each second. In this lesson it is the measure that is deliberately held fixed while two amplitudes are compared.' },
        { term: 'loudness', definition: 'what a sound wave\'s amplitude comes through as when you hear it: a bigger amplitude is a louder sound.' },
        { term: 'brightness', definition: 'what a light wave\'s amplitude comes through as when you see it, for light of one color: a bigger amplitude is a brighter light.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-reading-lamps',
      kind: 'worked_example',
      problem:
        'Two identical reading lamps stand on the same desk, each the same distance from a small solar-powered calculator lying flat between them. Both lamps hold the same kind of bulb and both give out light of the same color, so the light waves leaving them have the same frequency. The first lamp is set to dim and the second to bright. With only the dim lamp on, the calculator\'s display stays blank. With only the bright lamp on, from the same distance, the display switches on and stays on. The panel on the calculator turns light into the electricity that runs it, and it needs a certain amount of energy arriving each second before the display will light at all. Which lamp\'s light waves carry more energy to the calculator, and what in this description is the evidence?',
      steps: [
        'State the claim being tested and name the two waves. The claim is that the wave with the bigger amplitude carries more energy. The two waves are the light from the dim setting and the light from the bright setting. For light of one color, brightness is what a bigger amplitude comes through as, so this is a comparison of two amplitudes.',
        'List what is held fixed. Same kind of bulb, so the same kind of wave. Same color, so the same frequency. Same distance from the lamp to the panel. Same calculator with the same panel. Nothing in the setup differs except the brightness, which means nothing differs except the amplitude. That is what makes this a comparison that can settle anything.',
        'Name the observation at the far end and say what it took. Under the dim lamp the display stays blank; under the bright lamp it switches on and stays on. The description tells you what that takes: the panel needs a certain amount of energy arriving each second before the display will light. So under the dim lamp less than that amount was arriving each second, and under the bright lamp more than that amount was.',
        'Say which way it points, and stop there. The bright lamp\'s light waves, the ones with the bigger amplitude at the same frequency, carry more energy to the panel. Notice what has NOT been claimed. Nothing here says how many times more energy the bright setting delivers, and nothing in this lesson lets you work that out. The finished answer is a direction with an observation attached.',
        'Now run the check a science answer needs, because there is no arithmetic here to redo. Half one: look for clues of DIFFERENT KINDS that agree. The first clue is electrical and sits at the far end -- the calculator runs on the bright lamp and not on the dim one. The second is an accounting clue at the source: the bright setting uses more energy each second than the dim setting, and energy is never made or destroyed, so the extra going in each second leaves the bulb each second as light and as thermal energy. The third comes from a completely different kind of detector: leave a dark sheet of paper under the bright lamp for a few minutes and it feels warm to the hand, while the same sheet under the dim lamp does not. An electrical effect, an energy count at the source, and a warming effect -- three kinds of evidence, one answer.',
        'Half two: change exactly one condition and check that the answer moves with it. Turn the first lamp up to bright and the second one down to dim, and leave everything else exactly where it is -- same desk, same distances, same calculator. Now the display lights under the first lamp and goes blank under the second. The answer followed the setting, not the lamp, so it is the brightness -- the amplitude -- doing the work and not some difference between the two lamps. If the answer had stayed with the same lamp after the swap, the explanation would have been wrong.',
      ],
      answer:
        'The bright lamp\'s light waves carry more energy to the calculator. Everything else in the setup is held fixed -- the same kind of bulb, light of the same color and so the same frequency, the same distance and the same panel -- so the only difference is the brightness, which is the amplitude of the light wave. The evidence is the observation at the far end: the panel needs a certain amount of energy arriving each second to light the display, and the display lights only under the bright lamp. How many times more energy the bright setting delivers is not something this lesson claims. Swap the two settings over and the display lights under the other lamp, which shows the brightness and not the lamp was doing the work.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-clothesline-and-clothespin',
      kind: 'worked_example',
      problem:
        'A clothesline is tied tightly between two posts in a yard. A student stands at one post and shakes her end up and down at a steady rate of 2 whole waves each second, sending humps traveling along the line to the far post. A wooden clothespin is clipped loosely onto the line near that far post. In the first trial the humps rise 3 centimeters above the line\'s rest position, and the clothespin jiggles but stays on. In the second trial she shakes her end through a much wider swing, still at 2 whole waves each second, and the humps rise 25 centimeters above the rest position; this time the clothespin is flicked off the line and lands on the grass. She also notices that her arm tires much faster during the second trial. Which trial\'s waves carried more energy to the clothespin, and how do both of her observations support that?',
      steps: [
        'State the claim and name the two waves. The claim is that the wave with the bigger amplitude carries more energy. The two waves are the trial-one wave, with humps 3 centimeters above the rest position, and the trial-two wave, with humps 25 centimeters above it.',
        'List what is held fixed. Same clothesline, tied to the same posts at the same tightness, so the same material. Same clothespin, clipped the same way at the same place. Same rate: 2 whole waves each second in both trials. The only thing that changed is how far the line is pushed from its rest position, which is the amplitude.',
        'Name the far-end observation and say what it took. In trial one the clothespin jiggles and stays on. In trial two it is flicked clear of the line and ends up on the grass. Sending an object flying takes energy, and it takes more energy than making the same object wobble in place. Whatever arrived at the far post in trial two was able to do something that whatever arrived in trial one could not.',
        'Bring in her second observation, the one at the source. Her arm tires faster in trial two. Making the bigger wave costs her more each second, and energy is not created inside the clothesline -- it is handed to the line at her end and carried along to the far end. So more energy going in each second is more energy arriving each second, and that matches what the clothespin did.',
        'Say which way it points, and guard the answer against a wrong reason. At the same rate of arrival, the bigger amplitude carried more energy. WRONG: "The big wave flicked the clothespin off because it was racing along the line faster than the small one." CORRECT: "Both waves travel along that line at the same speed, because the speed is set by the line itself and not by how hard she shakes it. The big one is not quicker -- it arrives carrying more energy." And say only that much: nothing here tells you how many times more energy trial two delivered.',
        'Run the check. Half one: three clues of DIFFERENT KINDS that agree. The first is the effect on another object at the far end, the clothespin flicked off. The second is the cost at the source, her arm tiring faster, which is an energy count rather than an effect. The third comes from the line itself in between: at 2 whole waves each second, every bit of the line has to travel much further up and down in the same amount of time in trial two, so each bit of it is moving faster -- and you already know that faster-moving matter carries more kinetic energy. Far end, source and the material in between, all pointing one way.',
        'Half two: change exactly one condition and see the answer move. Go back to humps 3 centimeters above the rest position -- the small wave from trial one -- but shake at 6 whole waves each second instead of 2, which is three times as many. The clothespin is flicked off again. So the amplitude is not the only dial there is: a small wave arriving much more often can also deliver enough energy to do the job. That is precisely why the rule this lesson states compares waves arriving at the SAME rate. The answer moved when the rate moved, which shows the earlier comparison was honest only while the rate was being held still.',
      ],
      answer:
        'The trial-two waves carried more energy. Everything else was held fixed -- the same line at the same tightness, the same clothespin in the same place, and 2 whole waves each second in both trials -- so the only difference was the amplitude, 25 centimeters above the rest position instead of 3. Two observations support it: at the far end the clothespin was flicked clear of the line instead of merely jiggling, and at the source her arm tired faster, which is where the extra energy came from. Both waves traveled along the line at the same speed; the bigger one simply arrived with more energy. Keep the humps small but shake three times as often, at 6 whole waves each second, and the clothespin comes off again -- which is why the comparison only works with the rate held fixed.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-drum-heard-twice',
      kind: 'try_yourself',
      problem:
        'You are sitting in the middle of a concert hall. The drummer strikes the same drum twice. Both strikes produce the same note, which means the air is pushed back and forth the same number of times each second in both cases. The second strike is much louder than the first, and during it you feel the sound in your chest and a loose metal tray on a table beside you buzzes. Which strike sent more energy to your seat, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The first strike, because a loud sound uses itself up rattling everything it passes on the way across the hall, so the quieter one has lost less of its energy on the trip and is the one still carrying the most by the time it reaches your seat.' },
        { id: 'b', text: 'The second strike, because the same note means the air was pushed back and forth the same number of times each second in both strikes, and the louder strike pushed the air further from its rest position each time -- a bigger amplitude at the same frequency.', correct: true },
        { id: 'c', text: 'Both strikes sent the same energy to your seat, because they were the same note struck on the same drum, and the number of pushes reaching you each second is the only thing that sets a sound wave\'s energy -- how loud it seems is about where you happen to be sitting.' },
        { id: 'd', text: 'The second strike, because a louder sound is one that sends more separate waves to your seat each second, so striking the drum harder must have packed extra waves into every second, and each extra wave that arrives brings its own share of energy with it.' },
      ],
      expectedAnswer: 'The second strike, because the same note means the air was pushed back and forth the same number of times each second in both strikes, and the louder strike pushed the air further from its rest position each time -- a bigger amplitude at the same frequency.',
      hints: [
        'Work out first what the stem is holding fixed for you. "The same note" tells you one of the two measures did not change between the strikes. Which one is left to do the changing?',
        'Louder is not a fourth measure of its own -- it is what one of the two measures comes through as in your ear. Which measure, and did it go up or down between the strikes?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lake-dock-morning-and-afternoon',
      kind: 'try_yourself',
      problem:
        'Waves cross a lake and reach a wooden dock with a small boat moored alongside it. On a calm morning the humps rise 5 centimeters above the still-water line, and one hump reaches the dock every 2 seconds. By the afternoon the humps rise 20 centimeters above the still-water line, and one hump still reaches the dock every 2 seconds. Which statement correctly compares the energy the two sets of waves deliver to the dock?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two sets of waves deliver the same energy, because they are waves on the same lake and it is the water itself that carries the energy, so the same water must hand over the same amount however the surface happens to be shaped, and one hump reaches the dock every 2 seconds in both cases.' },
        { id: 'b', text: 'The two sets cannot be compared at all, because a comparison of two waves is only fair when they match on the very measure being tested, so the humps would have to rise the same height above the still-water line before anything could be said about their energy.' },
        { id: 'c', text: 'The afternoon waves deliver more energy, because the humps arrive at the same rate in both cases but push the water much further from the still-water line each time, so they should do more when they arrive -- pressing the moored boat harder against the dock and throwing spray higher up the posts.', correct: true },
        { id: 'd', text: 'The afternoon waves deliver more energy, because the taller humps are carrying lake water all the way across from the middle of the lake and piling it up against the dock, and it is that arriving load of water, rather than the wave itself, that hands over the energy.' },
      ],
      expectedAnswer: 'The afternoon waves deliver more energy, because the humps arrive at the same rate in both cases but push the water much further from the still-water line each time, so they should do more when they arrive -- pressing the moored boat harder against the dock and throwing spray higher up the posts.',
      hints: [
        'Run the four moves. What is the claim, and what has the description deliberately held the same between the morning and the afternoon? One hump every 2 seconds, in both cases, is doing real work in this item.',
        'A finished answer needs an observation at the far end, not just a statement about the humps. Which choice names something at the dock that the bigger waves would do and the smaller ones would not?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-comparison-is-the-evidence',
      kind: 'try_yourself',
      problem:
        'A student wants to test the claim that, for two waves of the same kind in the same material, the one with the bigger amplitude carries more energy. Which of these comparisons would give the best evidence for that claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Send a small wave along a thin cord and a big wave along a thick, heavy cord, so that the two waves have plenty of room and cannot interfere with each other, then see which one knocks a light foam block off the far end.' },
        { id: 'b', text: 'Play a quiet sound and a loud sound from the same speaker, choosing a high note for the quiet one and a low note for the loud one so that the two are easy to tell apart, then see which one makes a loose lid rattle harder.' },
        { id: 'c', text: 'Send two waves along the same stretched spring with their humps exactly the same height above the rest position, one bringing 2 whole waves each second and the other bringing 6, then see which one pushes the block at the far end further.' },
        { id: 'd', text: 'Send two waves along the same stretched spring, both bringing 2 whole waves each second, one with humps 2 centimeters above the rest position and the other with humps 8 centimeters above it, then see which one pushes the same block at the far end further.', correct: true },
      ],
      expectedAnswer: 'Send two waves along the same stretched spring, both bringing 2 whole waves each second, one with humps 2 centimeters above the rest position and the other with humps 8 centimeters above it, then see which one pushes the same block at the far end further.',
      hints: [
        'The claim names one measure. A comparison can only support it if that measure is the single thing that differs between the two waves -- everything else, including the material and the rate of arrival, has to be the same in both.',
        'Go through each comparison and list what changed between its two waves. Three of them change two things at once, or change the wrong thing; only one changes the amplitude and nothing else.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-twice-as-tall-and-the-unfair-comparison',
      kind: 'misconception_check',
      question:
        'A student writes: "At the wave pool the big waves had humps twice as high as the small ones, so they carried exactly twice the energy. And in the long water channel at school, Wave A had humps 6 centimeters above the rest position arriving 1 each second while Wave B had humps 3 centimeters above it arriving 4 each second, so Wave A must carry more energy, because its humps are taller." Two separate things are wrong there. What are they?',
      commonErrors: [
        {
          answer: 'Humps twice as high means exactly twice the energy.',
          misconception:
            'Reading the energy off the amplitude one for one, as though doubling the height of a wave were the same kind of statement as doubling the length of a table, because that is the simplest relationship a number can have and nothing in the lesson obviously ruled it out.',
          correctsTo:
            'The direction is right and the number is not. Taller humps at the same rate of arrival do mean more energy, so the student has the comparison the right way round. But the energy does not simply keep pace with the height: it grows faster than the height does, so doubling the amplitude gives more than double the energy, not exactly double. Working out how much more takes mathematics that belongs to a later course, which is why this lesson never asks how many times. The finished answer here is "the big waves carried more energy, and here is what they did at the far end that the small ones did not", and adding a number to it makes the answer worse, not better.',
        },
        {
          answer: 'Wave A must carry more energy, because its humps are taller.',
          misconception:
            'Applying the amplitude rule to a pair of waves in which the amplitude is not the only thing that changed, because the rule is remembered as "taller means more energy" with the condition it depends on quietly dropped off the end.',
          correctsTo:
            'The rule compares two waves of the SAME frequency, and these two are not. Wave A has humps twice as tall as Wave B, since 6 centimeters divided by 3 centimeters is 2, but Wave B brings four times as many waves each second, since 4 divided by 1 is 4. Two things changed at once, so the taller humps on their own settle nothing, and the honest answer is that this comparison cannot test the claim. Notice that this is not the same as saying the two carry equal energy -- it is saying the comparison does not tell you. To fix it, hold the rate the same in both: run Wave B at 1 wave each second too, or run Wave A at 4, and then the difference in the humps is the only difference left. One more thing the student should not conclude: neither wave is traveling faster than the other. Both cross the same water at the same speed, just as two claps in a gym, one soft and one loud, both cross the air at about 340 meters per second and reach the far wall together.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A wave carries energy from where it is made to whatever it reaches, and it does not carry the material along with it. You cannot see a wave\'s energy directly -- you see what it does when it arrives.',
        'Amplitude is how far the material is pushed from its rest position. For two waves of the same kind, in the same material, arriving at the same rate, the one with the bigger amplitude carries more energy.',
        'The extra energy comes from the source. Making a bigger wave costs more at the end where it is made -- a wider swing of the arm, a harder push -- and that is what the wave carries away.',
        'The evidence always sits at the far end: an object flicked off, a boat pressed harder, a panel that starts working, a surface that gets warmer. An argument with no far-end observation in it is not finished.',
        'The same-rate condition is part of the rule, not decoration. If the amplitude and the rate of arrival both changed, the taller humps settle nothing, and the honest answer is that the comparison cannot test the claim.',
        'Say which one, not how many times. Twice as tall does not mean twice the energy -- the energy grows faster than the height does, and how much faster is a question for a later course.',
        'A bigger wave is not a faster wave. In a given material every wave travels at the same speed, so a big wave and a small one arrive together; the big one simply arrives carrying more energy.',
        'To argue it: state the claim, name the two waves and what is held fixed, name the observation at the far end and what it took, then say which way the evidence points -- and stop.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Amplitude & Wave Energy' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
