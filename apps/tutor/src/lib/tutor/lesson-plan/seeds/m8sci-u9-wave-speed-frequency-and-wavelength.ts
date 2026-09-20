/**
 * Grade 8 Science (Physical Science) — Wave Speed, Frequency & Wavelength.
 *
 * Row 9.3, PROCEDURE-LED. One idea runs the lesson and one routine applies
 * it. The idea: a wave's speed belongs to the MEDIUM, not to the wave -- the
 * air of a room sets the same speed for every sound crossing it, whatever
 * note it is, and a region with no matter in it carries no sound at all,
 * because there is nothing there to disturb. Everything else follows. Inside
 * one medium the speed is fixed, so frequency and wavelength seesaw against
 * each other and a higher-frequency wave is a SHORTER wave, never a faster
 * one. Change the medium instead, and the source keeps shaking at the same
 * rate, so the frequency stays put and the wavelength moves with the speed.
 * The routine is the arithmetic half: name the medium and its speed, decide
 * whether the sound made the trip once or twice, multiply speed by time,
 * halve it only for a round trip, and check that the answer came out as a
 * distance.
 *
 * The two traps it is built to kill are (a) higher-frequency-means-faster,
 * which is the single named error this row owns, and (b) halving a one-way
 * trip (or failing to halve an echo), which is where every distance answer on
 * this topic goes wrong.
 *
 * SCOPE GUARD: this plan states that the medium sets a wave's speed, applies
 * the same-medium relationship between speed, frequency and wavelength in
 * words and in small whole numbers, and turns a counted delay into a distance
 * with distance = speed × time. Per CONTROLLER RULING 33, this row's scope
 * cell has only two of the three parts: there is NO LINEAGE CLAUSE -- no
 * `m6*`/`m7*` predecessor exists to name, since neither sibling course has a
 * wave lesson -- and nothing has been invented to fill that gap. Its withheld
 * clause, verbatim, is: "Withholds v = fλ computations with scientific
 * notation or units conversion, which is the boundary crossed by
 * `g8-sci-wave-properties.ts` (100 MHz radio example) -- declined." Every
 * absence claimed below is claimed of the AUTHORED BODY -- the objective, the
 * segments and the metadata -- and not of this guard, which necessarily names
 * what the plan excludes, nor of the chain loIds, which necessarily name the
 * neighboring rows. What each edge means, and what is deliberately ALLOWED
 * there:
 *   - GRADE 8 NEIGHBORS. Row 9.2 (amplitude, wavelength and frequency) is the
 *     previous row and is ASSUMED, not re-taught: frequency and wavelength
 *     are restated once each in the vocabulary list as words the student
 *     already holds, and no segment teaches how to read either one off a
 *     description, halve a trough-to-crest height or double a crest-to-trough
 *     distance. Grepped against the authored body: "trough" appears zero
 *     times, "crest" appears twice and both times inside the restated
 *     wavelength definition, and "rest position" appears twice, in the two
 *     places where loudness has to be told apart from speed. AMPLITUDE is deliberately
 *     allowed in exactly one place -- the second half of the misconception
 *     check, where "a shout travels faster than a whisper" cannot be corrected
 *     without saying which measure loudness actually is -- and it is never
 *     measured, compared or related to energy. Row 9.4 (amplitude and wave
 *     energy) owns the energy half of MS-PS4-1: the word "energy" appears
 *     nowhere in the authored body, and its only occurrence anywhere in the
 *     file is inside the `followUps` chain loId. Row 10.1 (reflection, absorption,
 *     transmission) owns what happens when a wave meets a material; an echo
 *     appears here as a ROUND TRIP whose length is being measured, and is
 *     explained no further than "it bounced off a surface" -- this file never
 *     says what decides whether a surface reflects, absorbs or transmits, and
 *     never compares materials by how well they do any of the three. The curriculum grants
 *     the echo arithmetic to this row explicitly, in 10.1's own salvage note:
 *     "the light-quantitative echo lives in 9.3". Row 10.3 (light versus sound
 *     and the spectrum) owns light: light is named in three places -- the
 *     concept segment, the stem of the first item, and a distractor of that
 *     same item which times the wrong wave -- and in all three only to say
 *     that it is far faster than sound, with the single added remark, in the
 *     concept segment, that it crosses empty space and that what light is
 *     belongs to a later lesson. No part of the electromagnetic spectrum is
 *     named anywhere.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. A canyon is used as two rock walls
 *     with air between them; no landform gets a cause, an age or a process,
 *     and grepped against the authored body, the words plate, current, tide,
 *     climate, weather and storm appear zero times. Thunder and lightning appear in
 *     one worked-example contrasting case as a flash followed by a bang, with
 *     no account of what a storm is or how lightning forms -- that is Grade 6
 *     weather, and this file stops at the delay between the two.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Ears are named only as the place a sound
 *     arrives, and no hearing mechanism, sense organ, cell or organism is
 *     described.
 *   - HS CHEMISTRY boundary: no chemical content is in scope for this row, and
 *     none appears -- grepped against the authored body, "substance" and
 *     "reaction" appear zero times, and "particle" appears once, in the
 *     concept segment, naming only what a medium is made of so that the
 *     medium can be said to set the speed. How particles behave is rows 6.1
 *     and 6.2 and is not taught here. Water, air and steel are
 *     named only as materials a sound travels through, at different speeds,
 *     and nothing is said about what any of them is made of.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above). The specific computation this file stops
 *     short of is the salvage file's v = fλ worked in scientific notation --
 *     a 100 megahertz radio station against a speed of 3 × 10⁸ meters per
 *     second -- and it is not carried in any form: every number in this file
 *     is a small whole number, no power of ten appears, and no calculation
 *     converts between units -- the one place where two units of length meet
 *     is a plain-language gloss, where 1,020 meters is also called a little
 *     over a kilometer, and a distractor that (wrongly) times the light
 *     rather than the sound and so answers in kilometers. Also absent, and
 *     checked by grep of the authored body: the period and its relationship to
 *     frequency, phase, intensity, the decibel, the refractive index,
 *     superposition, interference, standing waves, resonance, the Doppler
 *     effect, and any claim that a wave's energy depends on the square of
 *     anything. The only formulas written anywhere are the three the
 *     curriculum allows this row -- wave speed equals frequency times
 *     wavelength, distance equals speed times time, and that second one named
 *     twice as speed equals distance divided by time turned around -- and
 *     each is written in words first with the symbolic form beside it. The
 *     other lines carrying an equals sign are arithmetic with the digits
 *     shown (3 × 2 = 6, 170 × 2 = 340, 1,360 ÷ 2 = 680), not formulas.
 *
 * NOTE ON BURNED CELL EXAMPLES (controller rulings 32 and 36): part (i) of
 * this row's scope cell is copied into `los[0].description`, which is
 * student-facing, and it names four concrete things -- that sound is faster in
 * water than air, that sound does not travel through a vacuum, an echo, and
 * counting the seconds between lightning and thunder. All four are therefore
 * BURNED for items, and all four are used only in teaching segments: water and
 * the vacuum in the hook and the concept segment; the echo in the concept
 * segment, the concept vocabulary, the whole of the first worked example and
 * the recap; and the lightning-and-thunder delay in the concept segment, that
 * worked example's contrasting case and the recap. Every item runs on a fresh specimen that the objective
 * does not name: an axe seen across a valley before its crack is heard, a
 * marching band whose drum and piccolo cross the same air, and a tap sent
 * along a steel handrail and through the hallway air beside it. The steel rail
 * was chosen for the hardest item precisely because the objective names the
 * water-versus-air comparison and would otherwise have handed the student two
 * eliminations for free. Do not "helpfully" rebuild an item on an echo, on
 * thunder, or on a sound in water.
 *
 * NOTE ON SALVAGE: `g8-sci-wave-properties.ts` supplied one idea, the
 * lightning-and-thunder delay, and its numbers were replaced with small whole
 * ones as the curriculum's salvage note requires. NOT carried: its v = fλ line
 * as a bare symbolic formula, its 100 megahertz radio worked example and the
 * 3 × 10⁸ meters per second that goes with it, its period T = 1/f, its 343
 * meters per second (this file uses the contract's safe figure of about 340
 * meters per second, and says "about" every time), and its free-response item
 * format. Its prose is rewritten rather than copied, since it predates the
 * no-contractions, no-bare-abbreviation and words-before-symbols rules.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every setup in
 * this file is written out in words inside the segment that uses it -- what
 * the medium is, what speed it gives a sound, how many seconds were counted,
 * and whether the sound made the trip once or twice -- and every item is
 * solvable from the text printed inside it. Never write "look at the wave
 * diagram", and never assume the student has a stopwatch, a rope, a
 * loudspeaker or a canyon in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 9.2 -> 9.3 -> 9.4
 * (`amplitude-wavelength-and-frequency` before it, `amplitude-and-wave-energy`
 * after it), and both arrays carry those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U9_WAVE_SPEED_FREQUENCY_AND_WAVELENGTH: LessonPlan = {
  id: 'evelyn.ms.m8sci.wave-speed-frequency-and-wavelength.v1',
  title: 'Wave Speed, Frequency & Wavelength',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.wave-speed-frequency-and-wavelength',
      standard: 'M8SCI-9.3',
      description:
        'Explain that a wave\'s speed is set by the medium it travels in (sound is faster in water than air, and does not travel through a vacuum), so that for waves in the SAME medium a higher frequency goes with a shorter wavelength (speed equals frequency times wavelength, as a relationship), and apply distance equals speed times time with small whole numbers to an echo or to counting seconds between lightning and thunder (NGSS DCI PS4.A, MS-PS4-1).',
    },
  ],
  prerequisites: ['m8sci.amplitude-wavelength-and-frequency'],
  followUps: ['m8sci.amplitude-and-wave-energy'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put three cases of the same sound in three different surroundings side by side -- water, air, and nothing at all -- so the student sees that the surroundings, and not the sound, are what decide how fast it gets anywhere.',
      script:
        'Next time you are under the water at a pool, listen. Somebody knocks on the side of the pool, and the knock reaches you -- muffled and strange, but it reaches you, and it gets there in no time at all. Sound does travel through water, and it travels faster there than it does in air. Now go the other way. Out beyond the air, out in space, there is very nearly nothing: no air, no water, no solid, nothing for a sound wave to shake. A sound wave in a place like that does not travel slowly. It does not travel at all, because there is nothing there for it to be a disturbance of. So line the three up. Water: fast. Air: slower. Nothing at all: no sound whatsoever. Look at what is doing the deciding in those three cases, because it is not the sound. It is the stuff the sound is going through. That one idea runs the whole lesson, and it pays off twice. It settles what happens to a wave when you change the note without changing the room. And it lets you turn a delay you can count out in seconds into a distance in meters.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-medium-sets-the-speed',
      kind: 'concept',
      goal: 'Install the medium as the thing that fixes a wave\'s speed, then the relationship that ties speed to frequency and wavelength, the two different things that happen when you change the note versus change the medium, and the distance routine with its one-way-or-round-trip question.',
      keyIdeas: [
        'THE MEDIUM SETS THE SPEED, AND THE WAVE DOES NOT. A wave travels by disturbing whatever it is passing through, and the material it passes through is called the MEDIUM. How fast the wave travels is decided by that medium: how its particles are arranged, and how strongly each one is connected to the ones beside it, decides how quickly a push given to one of them reaches the next. Sound travels through the air of a room at ordinary temperature at about 340 meters per second. Put the same sound into water and it travels faster than that. Send it through a solid like steel and it is faster still. Nothing about the sound was changed on the way in -- the same knock, the same note -- so the speed did not come from the sound. It came from the medium. And take the medium away entirely, leaving a region with no air, no water and no solid in it, which is called a VACUUM, and a sound wave has nothing to disturb and cannot travel at all. Light is different: light crosses empty space, which is why sunlight reaches us, and what light is belongs to a later lesson. Nothing today depends on it.',
        'THE THREE NUMBERS ARE ONE PACKAGE: WAVE SPEED EQUALS FREQUENCY TIMES WAVELENGTH (speed = frequency × wavelength). Here is the way of seeing it that makes it obvious rather than something to memorize. Frequency is how many whole waves go past a fixed point each second, and wavelength is how long one whole wave is. So suppose 3 whole waves go past you every second and each one of them is 2 meters long. Lay those 3 waves end to end and they stretch 3 × 2 = 6 meters, and every bit of that 6 meters slid past you inside that one second. The wave traveled 6 meters in 1 second, so its speed is 6 meters per second. That is the whole relationship: how many go past, times how long each one is, gives how far the wave got.',
        'IN ONE MEDIUM THE SPEED IS FIXED, SO FREQUENCY AND WAVELENGTH SEESAW. Put the two ideas together. The medium fixes the wave\'s speed, and that speed is the amount of wave that goes past you every second. Raise the frequency, so that more waves go past in that second, and the only way they can all fit into the same amount is for each one to be shorter. Lower the frequency and each wave gets longer. The two numbers move in opposite directions, and their product does not move at all, because the medium has already fixed it. WRONG: "A high note travels faster than a low note, because its waves are coming quicker." CORRECT: "A high note travels at the same speed as a low note through the same air. Its waves are shorter, not faster." Say that second sentence to yourself twice. A higher-frequency wave is a shorter wave, never a faster one, and getting this backward is the most common mistake made on this whole topic.',
        'CHANGE THE MEDIUM INSTEAD, AND SOMETHING DIFFERENT HAPPENS. When a wave passes from one material into another, the thing making the wave is still shaking at the same rate, so the FREQUENCY does not change -- the source sets it, and it does not change when the material does. What the new material does set is the speed. So the wavelength is the number that has to move: into a faster medium, the same note has LONGER waves, and into a slower one, shorter waves. Hold the two cases apart, because they look similar and they run in opposite directions. Inside ONE medium, at a fixed speed, a higher frequency means a shorter wavelength. Across a CHANGE of medium, at a fixed frequency, a faster medium means a longer wavelength.',
        'DISTANCE EQUALS SPEED TIMES TIME (distance = speed × time), AND ONE QUESTION COMES FIRST. This is speed equals distance divided by time (speed = distance ÷ time) turned around, and it is how a delay you can count becomes a distance you can state. If sound covers about 340 meters in every second, then in 2 seconds it covers 2 lots of that, and in 6 seconds, 6 lots of it. But before you multiply anything, ask the one question that decides the whole answer: did the sound make the trip ONCE, or out and back? A shout that returns to you as an ECHO went all the way out to a surface and all the way back, so the distance you calculate is the round trip and the surface is HALF that far away. Thunder that reaches you after a lightning flash made the trip once, from the lightning straight to your ears, and nothing sent it back, so there is nothing to halve. Answering that question wrong puts your answer out by a factor of two, and no unit check or sanity check will catch it for you.',
        'THE ROUTINE, IN ORDER, AND IT ENDS WITH A UNIT CHECK. (1) Name the medium and the speed it gives the wave, and say it out loud with its unit: about 340 meters per second in air. (2) Decide one way or round trip, and say which. (3) Multiply the speed by the number of seconds to get the distance the sound actually covered. (4) If it was a round trip, halve that distance to get how far away the surface is. If it was one way, leave it alone. (5) Check the unit. So many meters per second, kept up for so many seconds, gives meters -- a distance. If your answer came out wearing meters per second, you have stated a speed where a distance was asked for, and that is wrong on its face before anybody checks the arithmetic.',
      ],
      vocabulary: [
        { term: 'medium', definition: 'the material a wave travels through, such as air, water or steel. The medium is what sets the wave\'s speed.' },
        { term: 'wave speed', definition: 'how far a wave travels in each second, measured in meters per second; it is set by the medium, not by the wave.' },
        { term: 'vacuum', definition: 'a region with no matter in it at all. A sound wave cannot travel through a vacuum, because there is nothing there for it to disturb.' },
        { term: 'echo', definition: 'a sound that comes back to you after bouncing off a surface, so that it has traveled out and back again.' },
        { term: 'frequency', definition: 'from the last lesson: how many whole waves pass one fixed point in one second, measured in hertz.' },
        { term: 'wavelength', definition: 'from the last lesson: the distance covered by one whole repeat of a wave, from one crest to the next crest.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-echo-across-a-canyon',
      kind: 'worked_example',
      problem:
        'You stand at the edge of a wide canyon, facing a flat rock wall on the far side, and you shout once. Four seconds later the echo of your shout comes back to you. The air in the canyon is at ordinary temperature, and sound travels through it at about 340 meters per second. Nothing stands between you and the rock wall. How far away is the wall?',
      steps: [
        'Step 1, name the medium and its speed. The medium is the air in the canyon, and the problem gives its speed: about 340 meters per second. Write the unit down with the number, because it is the unit that will tell you at the end whether the answer is the right kind of thing. Notice how much rests on this one line: if the canyon were somehow full of water instead, sound would cross it faster and every number after this one would be different.',
        'Step 2, decide one way or round trip, and this is the step the whole answer turns on. The shout left your mouth, crossed the canyon, bounced off the rock wall and came back to your ears. That is why you heard it at all. So the 4 seconds is the time for the WHOLE journey, out and back, and not the time to reach the wall.',
        'Step 3, multiply speed by time to get the distance the sound actually covered. Distance equals speed times time (distance = speed × time), so about 340 meters per second × 4 seconds = 1,360 meters. Read that as four lots of 340 meters: 340 + 340 + 340 + 340 = 1,360. The sound covered about 1,360 meters in those four seconds.',
        'Step 4, halve it, because the journey was a round trip. 1,360 ÷ 2 = 680, so the rock wall is about 680 meters away. WRONG: "The echo took 4 seconds, so the wall is 1,360 meters away." CORRECT: "The sound covered 1,360 meters in those 4 seconds, but half of that was the trip back to me, so the wall is 680 meters away." The multiplication was never the hard part of this problem. Step 2 was.',
        'Step 5, the unit check. Meters per second, kept up for a number of seconds, gives meters, and 680 meters is a distance -- the right kind of thing to answer "how far away". An answer of "680 meters per second" would have been a speed, and nobody asked for one.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The unit check is the first, and it just passed. The second reaches the same number by a different route: instead of halving the distance, halve the TIME. The two legs of the journey are the same path, so the sound reached the wall halfway through the 4 seconds, at 2 seconds, and about 340 meters per second × 2 seconds = 680 meters. Halving the distance and halving the time give the same 680 meters by different reasoning. The third clue is of a completely different kind and it is sitting in the problem: you HEARD your own shout come back. A sound that only traveled one way, away from you, could never have arrived at your ears at all. Hearing the echo is itself the evidence that a return trip happened, which is what step 2 claimed.',
        'Second, change exactly one condition and check that the answer moves the way it should. Keep the same canyon and the same air, but instead of shouting, watch lightning strike the far rim and count until the thunder arrives -- say the thunder reaches you 3 seconds after the flash. Now the sound makes the trip ONCE. It starts at the lightning and ends at your ears, and nothing sends it back. So about 340 meters per second × 3 seconds = 1,020 meters, a little over a kilometer, and that is the answer with nothing halved. Same air, same relationship, and the two problems are handled differently only because one journey was a round trip and the other was not. If halving were just a thing you always did to a sound problem, this answer would have come out at 510 meters and been wrong by half.',
      ],
      answer:
        'The rock wall is about 680 meters away. The echo took 4 seconds for the round trip out and back, and about 340 meters per second × 4 seconds = 1,360 meters for that whole journey, so the wall is half of it: 1,360 ÷ 2 = 680 meters.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-tones-in-one-room',
      kind: 'worked_example',
      problem:
        'A loudspeaker in a classroom plays two steady tones, one after the other, into the same still air. Sound travels through that air at about 340 meters per second. While the low tone plays, 170 whole waves reach a listener at the back of the room every second. While the high tone plays, 340 whole waves reach that same listener every second. How long is one wave of each tone, and which of the two tones crosses the room faster?',
      steps: [
        'Step 1, name the medium and its speed, and notice that this step is already finished for both tones at once. The medium is the classroom air, it gives sound a speed of about 340 meters per second, and it is the SAME air for the low tone and the high tone. The medium sets the speed, so that number is settled for both before anything else is worked out.',
        'Step 2, use the relationship on the low tone. Wave speed equals frequency times wavelength (speed = frequency × wavelength), and the idea behind it is that about 340 meters of wave slides past the listener every second. The low tone puts 170 whole waves into that 340 meters. So ask: what length, multiplied by 170, gives 340? It is 2 meters, because 170 × 2 = 340. One wave of the low tone is 2 meters long.',
        'Step 3, the same move on the high tone. The listener is in the same air, so it is still about 340 meters of wave sliding past every second, but now 340 whole waves have to fit into it. What length, multiplied by 340, gives 340? It is 1 meter, because 340 × 1 = 340. One wave of the high tone is 1 meter long.',
        'Step 4, read the seesaw, and the second question answers itself. The frequency doubled, from 170 whole waves each second to 340. The wavelength halved, from 2 meters to 1 meter. Their product did not move at all: 170 × 2 = 340 and 340 × 1 = 340, which is the speed the air sets for both. So neither tone crosses the room faster than the other. WRONG: "The high tone has twice the frequency, so it travels twice as fast and gets there first." CORRECT: "Both tones cross the room at about 340 meters per second, because the air sets the speed. The high tone is not faster. Its waves are shorter."',
        'Step 5, the unit check. A wavelength is a distance and both answers came out in meters. A frequency is a count each second and both were given that way. A speed is a distance each second and it came out in meters per second. Three quantities, three right kinds of unit.',
        'Now the two checks. First, three clues of DIFFERENT KINDS agree. The unit check is one. Multiplying back out is a second, and it is the rare science answer where that move is available: 170 × 2 = 340 and 340 × 1 = 340 both return the speed the problem started from, so neither wavelength can be wrong without the speed being wrong too. A dependency check is the third: neither answer used anything about how LOUD the tones were, and that is exactly right, because loudness is a matter of how far the air is pushed from its rest position and the air sets the same speed for a whisper and a shout alike.',
        'Second, change exactly one condition and check that the answer moves the way it should. Take the low tone out of the air and send it through water, with the loudspeaker still shaking at the same rate. The source has not changed, so 170 whole waves still arrive every second and the FREQUENCY does not move. But the medium changed, and sound travels faster in water than in air, so more than 340 meters of wave now slides past the listener each second. Those same 170 waves have to fill a longer stretch, so each one is LONGER than the 2 meters it measured in air. Watch the direction, because it is the opposite of the seesaw in step 4: inside one medium a higher frequency went with a shorter wavelength, and here, at a fixed frequency, a faster medium goes with a longer wavelength. The answer moved when the medium moved, which is how you know it was the medium doing the work all along.',
      ],
      answer:
        'One wave of the low tone is 2 meters long and one wave of the high tone is 1 meter long, because 170 × 2 = 340 and 340 × 1 = 340. Neither tone crosses the room faster than the other: both travel at about 340 meters per second, because the classroom air sets that speed for every sound crossing it. The high tone is not a faster wave, it is a shorter one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-axe-across-the-valley',
      kind: 'try_yourself',
      problem:
        'From one side of a wide valley you can see someone splitting logs on the other side. You watch the axe strike a log, and 5 seconds later you hear the crack. The sound reaches you through the air of the valley, which carries it at about 340 meters per second, and it makes that trip once, straight from the axe to your ears, with nothing sending it back. The light from the strike reaches your eyes so much faster than the sound that you can treat it as arriving at the instant the axe lands. About how far away is the log splitter?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'About 1,700 meters, because the sound crossed the valley once and not twice, and a speed of about 340 meters per second kept up for the whole 5 seconds gives 340 times 5, which is 1,700 meters.', correct: true },
        { id: 'b', text: 'About 850 meters, because the sound had to cross the valley and then come back again before you heard it, so the 1,700 meters it covered is a round trip and the log splitter is only half of that away.' },
        { id: 'c', text: 'About 340 meters, because about 340 meters per second is how far a sound gets through air, and the 5 seconds only records how long you stood there waiting for the crack rather than how far the sound went.' },
        { id: 'd', text: 'About 1,500,000 kilometers, because light travels about 300,000 kilometers every second in empty space, and the 5 seconds you counted is the time the light from the axe strike took to reach your eyes.' },
      ],
      expectedAnswer: 'About 1,700 meters, because the sound crossed the valley once and not twice, and a speed of about 340 meters per second kept up for the whole 5 seconds gives 340 times 5, which is 1,700 meters.',
      hints: [
        'Run the routine in order. The medium is the valley air and its speed is given to you, so the next question is the one that decides the answer: did the sound make the trip once, or out and back? Read the problem again and see which it says.',
        'Then check which wave you are timing. Two things left the axe at the same moment, one of them far faster than the other, and the 5 seconds is the gap between them arriving. The delay you counted belongs to the slower one, so the slower one\'s speed is the one to multiply by.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-drum-and-piccolo',
      kind: 'try_yourself',
      problem:
        'A marching band comes down the street. A bass drum booms out a very low note and a piccolo plays a very high one, and both instruments sound at the very same instant. The drum is played loudly and the piccolo softly. You are standing on the sidewalk about a block away, and both sounds travel to you through the same still air. Which statement about the two sounds crossing that block is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The piccolo\'s note reaches you first, because a higher frequency means its waves arrive more often, and a wave that repeats more often is working its way through the air more often, so it gets down the block sooner.' },
        { id: 'b', text: 'Both notes reach you at the very same instant, because that same still air sets one speed for every sound crossing it, so the piccolo\'s higher frequency shows up as a shorter wavelength and not as a faster wave.', correct: true },
        { id: 'c', text: 'The bass drum\'s note reaches you first, because it is the louder of the two and a loud sound pushes the air harder, so the bigger push drives that wave down the block in less time than the soft one takes.' },
        { id: 'd', text: 'Both notes reach you at the very same instant, because the two instruments sounded at the very same instant, and two sounds that set off together always arrive together no matter what they are traveling through.' },
      ],
      expectedAnswer: 'Both notes reach you at the very same instant, because that same still air sets one speed for every sound crossing it, so the piccolo\'s higher frequency shows up as a shorter wavelength and not as a faster wave.',
      hints: [
        'Ask what the two notes have in common before you ask how they differ. They are crossing the same still air, and there is one thing about a wave that the material it travels through decides all by itself, whatever the wave is doing.',
        'Then take the differences one at a time and ask what each one actually changes. A higher frequency changes one of the wave\'s measures, and playing something loudly changes a different measure. Neither of those measures is the speed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tap-along-a-steel-rail',
      kind: 'try_yourself',
      problem:
        'A long steel handrail runs the length of a school hallway. A student at one end taps it steadily with a coin, and the taps send a sound wave along the steel of the rail and another one out into the air of the hallway. Both waves travel the same length of hallway to the far end, where a second student stands with one ear pressed against the rail and the other ear open to the air. The tapping shakes the steel and the air the same number of times each second, and sound travels faster through steel than through air. Which statement correctly compares the sound on the two paths?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sound through the air arrives first, because air is thin and easy for a wave to push through while steel is solid and packed tight, so a wave has to shove all of that metal aside and is held back by the effort.' },
        { id: 'b', text: 'The two arrive at the very same moment, because the tapping shakes the steel and the air the same number of times each second, and two waves made at the same frequency have to travel at the same speed wherever they go.' },
        { id: 'c', text: 'The sound through the steel arrives first, because steel carries sound faster than air does, and since the tapping sets the same frequency on both paths, the waves in the steel must be the longer ones, stretched out to fill the greater length of wave that goes past each second.', correct: true },
        { id: 'd', text: 'The sound through the steel arrives first, because steel carries sound faster than air does, and since the tapping sets the same frequency on both paths, the waves in the steel must be the shorter ones, squeezed up so that they can keep pace with the faster speed in the metal.' },
      ],
      expectedAnswer: 'The sound through the steel arrives first, because steel carries sound faster than air does, and since the tapping sets the same frequency on both paths, the waves in the steel must be the longer ones, stretched out to fill the greater length of wave that goes past each second.',
      hints: [
        'Two of these choices agree about which sound arrives first and disagree about the wavelength, so settle the arrival first from what the problem tells you about the two materials, then spend your thinking on the wavelength.',
        'This is a change of MEDIUM at a fixed frequency, not a change of note inside one medium, and the two run in opposite directions. The same number of waves goes past each second on both paths, but one path moves a greater length of wave past in that second. Those waves have to fill the extra length somehow.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-faster-notes-and-louder-shouts',
      kind: 'misconception_check',
      question:
        'A student writes: "A high note gets to you faster than a low note, because its waves are coming quicker. And if you shout instead of whispering, the sound gets there faster too, because you put more push behind it." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A high note gets to you faster than a low note, because its waves are coming quicker.',
          misconception:
            'Hearing "more waves every second" as "the wave is moving quicker", because frequency is about how often something happens and speed is about how fast something moves, and in ordinary speech both of those sound like hurrying.',
          correctsTo:
            'In one medium every sound travels at the same speed, whatever note it is. In the air of a room at ordinary temperature that is about 340 meters per second, for the lowest note a bass singer can reach and the highest note a whistle can make. Raising the frequency does not raise the speed. It shortens the wavelength, because the medium still moves the same amount of wave past you every second, and more waves have to fit into that same amount. There is a proof of this you have heard all your life without noticing it. A piano chord played at the far end of a hall arrives at your ear as a chord. If its high notes traveled faster than its low ones, the chord would come apart on the way and reach you as a little run of separate notes, high ones first, and it never does. WRONG: "A high note gets there faster." CORRECT: "A high note gets there at the same time, with shorter waves."',
        },
        {
          answer: 'Shouting makes the sound get there faster than whispering does.',
          misconception:
            'Treating the effort you put into making a sound as though it were pushing the wave along from behind, because a shout does carry further and does arrive with more force, so it feels as though it must be moving quicker as well.',
          correctsTo:
            'How hard you push the air sets the AMPLITUDE of the wave -- how far the air is moved from its rest position -- and amplitude is what you hear as loudness. The speed is set by the air, not by you, so a shout and a whisper both cross a room at about 340 meters per second. The shout is still loud enough to hear at the far end and the whisper is not, and that is a difference in loudness, not a difference in speed. Here is the test that settles it. If loudness set the speed, then a firework that went off with a louder bang would have its bang arrive sooner after its flash than a quieter one would, from the same distance away. It does not. The delay depends on how far away the firework is and on the air in between, and on nothing at all about how loud the bang was. WRONG: "A louder sound travels faster." CORRECT: "A louder sound has a bigger amplitude and travels at exactly the same speed."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A wave\'s speed is set by the MEDIUM it travels through -- the material -- and not by the wave itself.',
        'Sound travels through air at ordinary room temperature at about 340 meters per second, faster than that through water, and faster still through a solid like steel.',
        'A vacuum has nothing in it for a sound wave to disturb, so a sound wave cannot travel through one at all, however loud the thing making it.',
        'Wave speed equals frequency times wavelength (speed = frequency × wavelength). If 3 whole waves go past you every second and each is 2 meters long, then 3 × 2 = 6 meters of wave went past in that second, so the speed is 6 meters per second.',
        'IN THE SAME MEDIUM the speed is fixed, so frequency and wavelength seesaw: a higher frequency goes with a SHORTER wavelength. A higher-frequency wave is a shorter wave, never a faster one.',
        'CHANGE THE MEDIUM and the source keeps shaking at the same rate, so the frequency stays put while the speed changes: at the same frequency, a faster medium means LONGER waves.',
        'Distance equals speed times time (distance = speed × time), which is speed equals distance divided by time (speed = distance ÷ time) turned around.',
        'Ask "one way, or out and back?" BEFORE you multiply. An echo is a round trip: multiply, then halve. Thunder after a lightning flash is one way: multiply, and halve nothing.',
        'Check the unit at the end. Meters per second, kept up for a number of seconds, gives meters -- a distance. A distance never comes out wearing meters per second.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Wave Speed, Frequency & Wavelength' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
