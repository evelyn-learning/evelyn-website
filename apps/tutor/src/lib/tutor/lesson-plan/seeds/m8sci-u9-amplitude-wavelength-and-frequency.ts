/**
 * Grade 8 Science (Physical Science) — Amplitude, Wavelength & Frequency.
 *
 * Row 9.2, procedure-led. One routine runs the whole lesson, and it is four
 * moves taken in a fixed order: find the REST POSITION, read the AMPLITUDE
 * from that line up to the top of a crest, read the WAVELENGTH from one crest
 * to the next crest, and count how many whole waves pass one fixed point in
 * one second to get the FREQUENCY in hertz. A fifth move closes every answer:
 * the unit check. Two of the three measures are distances and the third is a
 * count per second, so an answer wearing the wrong kind of unit is wrong
 * before it is checked any other way. The lesson then maps the three measures
 * onto sound -- frequency is heard as pitch, amplitude as loudness -- and
 * shows that those two can be changed one at a time.
 *
 * The two traps it is built to kill are (a) measuring between the wrong pair
 * of points, since the bottom of a dip to the top of a hump is TWICE the
 * amplitude and a hump to the very next dip is HALF a wavelength, and (b) the
 * salvaged "louder sounds have higher pitch", which is the same confusion
 * arriving through the ear instead of through a ruler.
 *
 * SCOPE GUARD: this plan reads amplitude, wavelength and frequency off a wave
 * that is described in words, and maps frequency to pitch and amplitude to
 * loudness for a sound. Its scope cell carries NO LINEAGE CLAUSE -- no
 * `m6*`/`m7*` predecessor is named for this row, and none is invented here.
 * Its withheld clause, verbatim, is: "Withholds period and phase (AP
 * Physics)." Every absence claimed below is claimed of the plan's AUTHORED
 * TEXT -- the objective, the segments and the metadata -- and not of this
 * guard, which necessarily names what the plan excludes, nor of the chain
 * loIds, which necessarily name the neighboring rows. What each edge means,
 * and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 9.1 (what a wave is) is the previous row and is
 *     assumed, not re-taught: this file never defines a wave, never says that
 *     a wave carries energy without carrying the matter along, and never
 *     classifies a wave by the direction the material moves -- the words
 *     "transverse" and "longitudinal" appear in no authored string, and where
 *     sound is described as squeezing and spreading the air, that is stated
 *     in a single clause as the setting the three measures are read in, and
 *     is never named as a type of wave or contrasted with another type.
 *     Row 9.3 (wave speed, frequency and wavelength) owns how
 *     fast a wave travels and the relationship that ties the three together:
 *     no speed is stated, computed or hinted at anywhere in this plan, and no
 *     speed value appears. In the authored text the word "speed" occurs only
 *     inside the `followUps` chain loId, and the word "fast" only in the
 *     concept segment's closing forward pointer, which says that how fast a
 *     wave travels is the next lesson. The two worked examples are the only
 *     places where a wavelength and a frequency for the same wave sit
 *     together, and neither one combines them; their values were chosen so
 *     that each wave described is an ordinary one for its material. Row 9.4
 *     (amplitude and wave energy) owns the
 *     energy half of MS-PS4-1: the word "energy" appears exactly once in the
 *     authored text, in that same forward pointer, and this file never says
 *     that a bigger amplitude carries more energy. Amplitude stops at
 *     "heard as loudness" here.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. Water is used as a shallow tank
 *     at a science center, as ripples crossing a pond, and as the still pond
 *     surface that illustrates a rest position, and in every one of those it
 *     is only a material a wave travels through; no ocean,
 *     tide, current, weather system or landform is named anywhere, and the
 *     only appearance of weather in the authored text is the word "windless",
 *     used once to say why a pond surface is flat.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The ear is named only as the place a sound
 *     wave arrives, and the eardrum once, in the concept segment, only as an
 *     example of a fixed point that waves pass; the voice is named only as a
 *     source of sound. No mechanism of hearing, no structure of the ear
 *     beyond that one naming, no vocal anatomy and no organism is described.
 *   - HS CHEMISTRY boundary: no chemical content is in scope for this row,
 *     and none appears -- no substance, no particle model of matter, no
 *     formula and no reaction anywhere in the authored text.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above). The quantities and structures this file
 *     stops short of, named: the PERIOD and the relationship between period
 *     and frequency, which the salvage file states as T = 1/f and which is
 *     not carried and is not hinted at; PHASE, and any comparison of two
 *     waves by where they sit in their cycle; INTENSITY and the decibel; and
 *     the statement that a wave's energy grows with the SQUARE of its
 *     amplitude. The words "period", "phase", "intensity", "decibel" and
 *     "squared" appear in no authored string. No formula of any kind is
 *     written in any authored string, in symbols or in words -- the two
 *     formulas named in this guard and in the salvage note below are named
 *     only in order to say that they are NOT carried. Frequency is reached by
 *     dividing a stated count of waves by a stated number of seconds, with
 *     the division written out in digits, which is the form controller
 *     ruling 39 settles for a quantity a row requires.
 *
 * NOTE ON BURNED CELL EXAMPLES (controller rulings 32 and 36): part (i) of
 * this row's scope cell is copied into `los[0].description`, which is
 * student-facing, and it names the independence pair "a quiet high note; a
 * loud low one" along with the three definitions themselves. That pair is
 * therefore BURNED for items -- it is answerable straight off the objective
 * -- and it is used here only in teaching segments, where it appears as the
 * shout-across-a-field memory in the misconception check and as the
 * same-note/different-note line in the recap. All three item specimens are
 * fresh and appear in no teaching segment: a rubber cord between two chairs,
 * ripples passing a post in a pond, and two tones from a loudspeaker. Do not
 * "helpfully" move a worked example's water tank or gym rope into an item
 * later, and do not build an item on a quiet high note or a loud low one.
 *
 * NOTE ON SALVAGE: `g8-sci-wave-properties.ts` supplied the concept-anatomy
 * framing (amplitude as a height from the middle, wavelength as a
 * peak-to-peak distance, frequency as waves per second in hertz) and the
 * misconception "louder sounds have higher pitch". Its prose is rewritten
 * rather than copied. NOT carried: the period and T = 1/f, the wave-speed
 * line v = f × λ, the 100 MHz radio worked example, and the stated values for
 * the speed of light and the speed of sound in air -- the first two belong
 * above this course, the rest belong to row 9.3.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every wave in
 * this file is written out in words inside the item -- where the rest
 * position is, how far the humps rise above it and the dips fall below it,
 * which two points each stated distance was measured between, and over how
 * many seconds any count was taken -- and every item is solvable from the
 * text printed inside it. Never write "look at the wave diagram", and never
 * assume the student has a rope, a tank, a speaker or a ruler in front of
 * them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U9_AMPLITUDE_WAVELENGTH_AND_FREQUENCY: LessonPlan = {
  id: 'evelyn.ms.m8sci.amplitude-wavelength-and-frequency.v1',
  title: 'Amplitude, Wavelength & Frequency',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.amplitude-wavelength-and-frequency',
      standard: 'M8SCI-9.2',
      description:
        'Read the three measures of a simple wave -- amplitude (height from rest position to crest), wavelength (crest to crest), frequency (waves passing per second, in hertz) -- and map them onto sound: frequency is heard as pitch, amplitude as loudness, and the two are independent (a quiet high note; a loud low one) (NGSS MS-PS4-1).',
    },
  ],
  prerequisites: ['m8sci.what-a-wave-is'],
  followUps: ['m8sci.wave-speed-frequency-and-wavelength'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a sound has at least two separate dials on it, by pointing at two changes the student can already make one at a time, so the three measures arrive as answers to a question already asked.',
      script:
        'You are playing a song on your phone and you slide the volume up. The song gets louder. Here is the thing nobody remarks on, because it is too obvious: the song does not change. It is the same singer on the same notes, only bigger. Now do something different with your own voice. Say your own name at a normal volume, then say it again on a much higher note, just as quietly as the first time. That is the other change, and it is nothing like the first one. So a sound has at least two separate dials on it. One of them you turn when you want a shout instead of a whisper. The other one you turn when you want a high note instead of a low one, and turning either dial leaves the other exactly where it was. Those two dials are two different measurements of the wave arriving at your ear, and there is a third measurement alongside them, a distance along the wave itself. By the end of today you will have a routine that takes any wave described to you -- a hump traveling down a rope, a ripple crossing a pond, a tone coming out of a speaker -- and reads all three measurements off it, with the right unit on each one.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-three-measures',
      kind: 'concept',
      goal: 'Install the rest position as the line everything is measured against, then the three measures with the pair of points each is taken between, the unit that belongs to each, the four-step routine with its unit check, and the mapping onto pitch and loudness.',
      keyIdeas: [
        'START AT THE REST POSITION, BECAUSE ALL THREE MEASURES ARE READ AGAINST IT. The rest position is where the material a wave travels through sits when nothing is disturbing it: a rope lying still in a straight line, the flat surface of a pond on a windless afternoon, the air of a quiet room. Send a wave through, and the material swings away from that rest position and back to it, over and over, while the wave moves along. The high points are called CRESTS and the low points are called TROUGHS, and in the simple waves this lesson deals with a crest rises as far above the rest position as a trough falls below it. Find that rest position in the description first, before you measure anything. Almost every mistake made on this topic is a mistake about which two points a measurement was taken between, and the rest position is one of the points more often than not.',
        'AMPLITUDE IS A DISTANCE, TAKEN FROM THE REST POSITION TO ONE EXTREME. The amplitude of a wave is how far the material is pushed away from its rest position at the fullest part of the swing: from the rest line straight up to the top of a crest, or from the rest line straight down to the bottom of a trough. Either one gives the same number, so take whichever the description hands you. Because it is a distance, an amplitude is written with a distance unit -- 8 centimeters, 2 meters, 3 millimeters -- and never as a count of anything. WRONG: "The amplitude is the height of the wave measured from the bottom of a trough to the top of a crest." CORRECT: "That measurement crosses the rest position, so it is TWICE the amplitude. Halve it, and what is left is the amplitude." That halving is the single most common repair needed on this measure, so do it on purpose every time a description gives you a trough-to-crest height.',
        'WAVELENGTH IS ALSO A DISTANCE, AND IT COVERS ONE WHOLE REPEAT. A wave is a shape that repeats, and the wavelength is how far you have to go along the wave to arrive back at the same place in that shape. One crest to the next crest is one wavelength. One trough to the next trough is one wavelength too, and so is any point to the matching point on the next wave along. A crest to the very next TROUGH is not a wavelength: that is half a repeat, because the shape still has to climb back up before it starts over. So a crest-to-trough distance gets doubled. Notice the awkward part: amplitude and wavelength are both distances and both wear centimeters or meters, so their units cannot tell them apart. What tells them apart is the direction they are measured in. Amplitude is measured across the rest position, up and down. Wavelength is measured along the line the wave is traveling.',
        'FREQUENCY IS A COUNT PER SECOND, AND IT IS NOT A DISTANCE AT ALL. Pick one fixed point -- a mark on the floor beneath a rope, a doorway a sound passes through, your own eardrum -- and count how many whole waves go past that point in one second. That count is the frequency, and its unit is the HERTZ, written Hz for short. A frequency of 3 hertz means 3 whole waves pass the fixed point every second. When the counting ran for longer than a second, divide: 10 crests past the mark in 5 seconds is 10 divided by 5, which is 2 crests every second, so the frequency is 2 hertz. Two things frequency is NOT. It is not the number of humps you can see spread along the rope at one instant, because that depends on how long the rope is. And it is not a distance, so no frequency is ever written in centimeters.',
        'THE ROUTINE, IN ORDER, AND IT ENDS WITH A UNIT CHECK. (1) Find the rest position in the description -- the straight line, the still surface, the quiet air -- and name it out loud before measuring anything. (2) Read the AMPLITUDE: rest position to the top of a crest. If what you were given is a trough-to-crest height, halve it. (3) Read the WAVELENGTH: one crest to the next crest. If what you were given is a crest-to-trough distance, double it. (4) Read the FREQUENCY: whole waves past one fixed point in one second, dividing the count by the number of seconds if the counting ran longer than that. (5) Check the units before you say the answer. Amplitude and wavelength come out in centimeters or meters; frequency comes out in hertz. A frequency wearing centimeters, or an amplitude wearing hertz, is wrong on its face, and catching that takes one second and saves the whole answer.',
        'THE SAME THREE MEASURES DESCRIBE A SOUND, AND TWO OF THEM YOU CAN HEAR. A sound wave squeezes the air together and spreads it apart as it goes, so its rest position is the air of a quiet room, its amplitude is how far the air is pushed away from that rest position, and its wavelength is the distance from one squeezed-together region to the next. FREQUENCY IS HEARD AS PITCH: more whole waves reaching the ear each second is a higher note. AMPLITUDE IS HEARD AS LOUDNESS: air pushed further from its rest position is a louder sound. And the two are INDEPENDENT, which means either one can change while the other stays exactly where it was. You have done both without thinking about it -- saying a word louder without moving off the note you said it on, and sliding the same word up to a higher note without getting any louder. How fast a wave travels, and what that does to frequency and wavelength together, is the next lesson. How much energy a wave carries, and how that is tied to amplitude, is the lesson after it. Today stops at reading the three measures and hearing two of them.',
      ],
      vocabulary: [
        { term: 'rest position', definition: 'where the material a wave travels through sits when nothing is disturbing it -- the straight line of a still rope, the flat surface of a still pond, the air of a quiet room.' },
        { term: 'crest', definition: 'the high point of a wave, at its farthest above the rest position.' },
        { term: 'trough', definition: 'the low point of a wave, at its farthest below the rest position.' },
        { term: 'amplitude', definition: 'the distance from the rest position to the top of a crest, or from the rest position down to the bottom of a trough; how far the material is pushed from where it sits at rest.' },
        { term: 'wavelength', definition: 'the distance covered by one whole repeat of a wave, measured from one crest to the next crest, or from one trough to the next trough.' },
        { term: 'frequency', definition: 'the number of whole waves that pass one fixed point in one second.' },
        { term: 'hertz', definition: 'the unit frequency is measured in; 1 hertz means one whole wave passing a fixed point every second.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ripple-tank-at-the-science-center',
      kind: 'worked_example',
      problem:
        'A science center has a long shallow tank of water with a paddle at one end. When the paddle is still, the water surface is flat and level -- that is its rest position. The paddle is switched on and rocks up and down at a steady rate, sending a train of straight ripples down the tank. As the ripples pass, the top of each crest stands 2 centimeters above the flat level and the bottom of each trough sits 2 centimeters below it. From the top of one crest to the top of the next crest is 30 centimeters. A card is fixed to the far wall of the tank as a marker, and 8 crests pass that marker in 2 seconds. Give the amplitude, the wavelength and the frequency of these ripples.',
      steps: [
        'Step 1, find the rest position. The description gives it directly: the flat, level water surface with the paddle switched off. Every measurement below is taken either from that flat level or between two matching points on the ripple train.',
        'Step 2, read the amplitude. Amplitude runs from the rest position to one extreme, and the description already measures it that way: the top of a crest stands 2 centimeters above the flat level. So the amplitude is 2 centimeters. Nothing needs halving here, because the 2 centimeters was measured from the flat level and not from the bottom of a trough.',
        'Step 3, read the wavelength. Wavelength covers one whole repeat, crest to the next crest, and again the description already measures it that way: 30 centimeters from one crest top to the next crest top. So the wavelength is 30 centimeters. Nothing needs doubling here, because the 30 centimeters was not a crest-to-trough distance.',
        'Step 4, read the frequency. Frequency is whole waves past one fixed point in one second, and the card on the far wall is the fixed point. The counting ran for 2 seconds, so divide: 8 crests divided by 2 seconds gives 4 crests every second. The frequency is 4 hertz.',
        'Step 5, the unit check. Amplitude, 2 centimeters -- a distance, wearing a distance unit. Wavelength, 30 centimeters -- a distance, wearing a distance unit. Frequency, 4 hertz -- a count per second, wearing the unit for a count per second. All three are the right kind of quantity, which is worth ten seconds at the end of every one of these.',
        'Now run the two checks a science answer needs, because there is very little arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The units agree, as step 5 just showed. The amplitude agrees when it is reached from the other direction: the troughs sit 2 centimeters below the flat level and the crests stand 2 centimeters above it, so trough bottom to crest top is 2 plus 2, which is 4 centimeters, and half of 4 centimeters is 2 centimeters -- the same amplitude, arrived at along a different route. And a dependency check agrees: the frequency was counted at one fixed card, so it would come out the same whether the tank were long or short, while the wavelength would come out the same however long you watched. Each measure depends on what it should depend on and nothing else.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Leave the paddle rocking at the same rate but make it rock through a bigger swing. The crests now stand higher above the flat level and the troughs sit deeper below it, so the AMPLITUDE grows. The card on the far wall still has crests going past it 4 times every second, because the paddle is rocking just as often as before, so the FREQUENCY does not move. One condition changed, and exactly one of the three measures changed with it. That is the strongest sign that the three are being read off the right pairs of points: if a bigger swing had moved the frequency as well, one of the readings would have been measuring the wrong thing.',
      ],
      answer:
        'The amplitude is 2 centimeters, the wavelength is 30 centimeters, and the frequency is 4 hertz, because 8 crests passing the fixed card in 2 seconds is 8 divided by 2, which is 4 whole waves every second.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gym-rope-measured-the-hard-way',
      kind: 'worked_example',
      problem:
        'Two students stand at either end of a gym holding a long rope between them. Held still, the rope makes a straight line -- that is its rest position. One student shakes her end steadily up and down, and humps and dips travel along the rope toward the other student. The dips fall as far below the straight line as the humps rise above it. This time the measurements come in an awkward form. Measured straight up and down, the bottom of a dip to the top of the very next hump is 10 centimeters. Measured along the floor, the top of a hump to the bottom of the very next dip is 25 centimeters. A line painted across the gym floor lies under the rope, and 18 humps pass over that line in 3 seconds. Give the amplitude, the wavelength and the frequency.',
      steps: [
        'Step 1, find the rest position. The rope held still makes a straight line, and the description says the dips fall as far below that line as the humps rise above it. That symmetry matters for step 2, so say it out loud now.',
        'Step 2, read the amplitude, and repair the measurement first. The 10 centimeters runs from the bottom of a dip to the top of a hump, which crosses the rest position -- it is the whole swing, not half of it. Amplitude is measured from the rest position to ONE extreme, so halve it: 10 divided by 2 is 5. The amplitude is 5 centimeters. WRONG: "The amplitude is 10 centimeters, because that is the height of the wave." CORRECT: "The amplitude is 5 centimeters, because 10 centimeters crosses the rest line and covers both extremes, and amplitude reaches only one of them."',
        'Step 3, read the wavelength, and repair that measurement too. The 25 centimeters runs from a hump top to the very next dip bottom. That is half a repeat, because the rope still has to climb back up to a hump before the shape starts over. So double it: 25 times 2 is 50. The wavelength is 50 centimeters. WRONG: "The wavelength is 25 centimeters, because that is the distance from one part of the wave to the next part." CORRECT: "The wavelength is 50 centimeters, because a hump followed by a dip is one half of the repeating shape, and a wavelength is the whole of it."',
        'Step 4, read the frequency. The painted line is the fixed point, and the counting ran for 3 seconds, so divide: 18 humps divided by 3 seconds gives 6 humps every second. The frequency is 6 hertz. Notice that this measure needed no repair. Nothing about a count at a fixed point can be secretly doubled or halved, which is exactly why the trap on this topic lives with the two distances and not with the count.',
        'Step 5, the unit check. Amplitude 5 centimeters and wavelength 50 centimeters are distances wearing distance units; frequency 6 hertz is a count per second wearing the unit for a count per second. Three right kinds of quantity.',
        'Now the two checks. First, three clues of DIFFERENT KINDS agree. The unit check is one, and it just passed. The rest-position check is a second: the description says the dips go as far below the line as the humps go above it, so the swing should split into two equal halves, and 5 centimeters above plus 5 centimeters below does add back to the stated 10 centimeters. The repeat check is a third, and it reads the shape forward instead of doubling: start at a hump top, go 25 centimeters along the floor to a dip bottom, then go another 25 centimeters to arrive at the next hump top, and the shape has started over after 25 plus 25, which is 50 centimeters. Doubling and walking the shape forward give the same wavelength by different reasoning.',
        'Second, change one thing and check that the answer moves the way it should. Keep the shaking at exactly the same rate but swing the arm through a bigger arc. The humps rise higher above the line and the dips fall deeper below it, so the amplitude grows past 5 centimeters. The painted line still has 18 humps crossing it every 3 seconds, because the arm is going up and down just as often, so the frequency stays at 6 hertz. The answer moved for one measure and stood still for the other two, which is what it should do when only the size of the swing changed. What happens to the wavelength when the shaking rate itself is changed is the next lesson, and nothing in this answer depends on it.',
      ],
      answer:
        'The amplitude is 5 centimeters, because the stated 10 centimeters crosses the rest line and is twice the amplitude, and 10 divided by 2 is 5. The wavelength is 50 centimeters, because the stated 25 centimeters is a hump to the very next dip, which is half a repeat, and 25 times 2 is 50. The frequency is 6 hertz, because 18 humps in 3 seconds is 18 divided by 3, which is 6 whole waves every second.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rubber-cord-between-two-chairs',
      kind: 'try_yourself',
      problem:
        'A long rubber cord is stretched between two chairs in a classroom. Left alone, it hangs in a straight line, and that straight line is its rest position. One end is tapped up and down steadily, and humps and dips travel along the cord. As they pass, the top of each hump rises 8 centimeters above the straight line, and the bottom of each dip falls 8 centimeters below it. The distance from the top of one hump to the top of the next hump is 60 centimeters. What are the amplitude and the wavelength of this wave?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The amplitude is 16 centimeters, because the amplitude is the full height of the wave from the bottom of a dip to the top of a hump, and the wavelength is 60 centimeters, from one hump top across to the next hump top.' },
        { id: 'b', text: 'The amplitude is 8 centimeters, measured upward from the rest line, and the wavelength is 30 centimeters, because a hump and a dip are two separate waves, so the 60 centimeters has to be shared out between the two of them.' },
        { id: 'c', text: 'The amplitude is 60 centimeters, because the amplitude is how far along the cord the wave shape repeats itself, and the wavelength is 8 centimeters, because a wavelength is the measurement taken up and down from the rest line.' },
        { id: 'd', text: 'The amplitude is 8 centimeters, measured from the rest line straight up to the top of a hump, and the wavelength is 60 centimeters, measured from the top of one hump to the top of the next, which is one whole repeat of the shape.', correct: true },
      ],
      expectedAnswer: 'The amplitude is 8 centimeters, measured from the rest line straight up to the top of a hump, and the wavelength is 60 centimeters, measured from the top of one hump to the top of the next, which is one whole repeat of the shape.',
      hints: [
        'Both measures here are distances, so their units cannot tell them apart. What tells them apart is the pair of points each one is measured between, and the direction the measuring runs in. Which pair belongs to the amplitude, and which pair belongs to the wavelength?',
        'Check whether either number needs repairing before you use it. The 8 centimeters was measured from the rest line to one extreme, and the 60 centimeters was measured from one hump top to the next hump top. Neither one crosses the rest line, and neither one stops at a dip, so neither one needs halving or doubling.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ripples-past-a-post',
      kind: 'try_yourself',
      problem:
        'Ripples travel steadily across a pond and pass a wooden post standing in the water. Someone watches the post carefully and counts 15 crests going past it in 5 seconds, arriving at an even rate the whole time. Each crest rises 2 centimeters above the still-water line as it goes by. What is the frequency of these ripples, and what does that number mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3 hertz, because 15 crests divided by 5 seconds gives 3 whole waves passing the post every second, and one hertz means one whole wave going past a fixed point each second.', correct: true },
        { id: 'b', text: '15 hertz, because the frequency is the number of crests that were actually counted going past the post, and the 5 seconds only records how long the person stood there doing the counting.' },
        { id: 'c', text: '75 hertz, because the 15 crests that were counted have to be multiplied by the 5 seconds of watching in order to find how many whole waves would go past the post in a single second.' },
        { id: 'd', text: '2 hertz, because the frequency of a wave is how far each crest rises above the line the water sits at when it is still, and every crest in this ripple train rose 2 centimeters above it.' },
      ],
      expectedAnswer: '3 hertz, because 15 crests divided by 5 seconds gives 3 whole waves passing the post every second, and one hertz means one whole wave going past a fixed point each second.',
      hints: [
        'Frequency is a count per second, and this count ran for longer than one second. So the two counted numbers have to be combined in a way that leaves you with whole waves in a single second -- and only one of the two ways of combining them does that.',
        'Run the unit check before anything else. Hertz counts whole waves past a fixed point each second, so a number that came from a height in centimeters cannot be a frequency at all, and a number that came from multiplying two counts together gives far more waves per second than were ever counted.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-tones-from-a-loudspeaker',
      kind: 'try_yourself',
      problem:
        'A loudspeaker plays two steady tones, one after the other, into the same room. For the first tone, 200 whole waves reach your ear every second, and the air at your ear is pushed a long way from its rest position as each wave arrives. For the second tone, 800 whole waves reach your ear every second, and the air is pushed only a short way from its rest position. Which statement correctly describes how the second tone sounds compared with the first?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The second tone sounds higher and louder than the first, because waves that arrive more often deliver more pushes to the ear each second, so raising the number of waves per second always raises the loudness along with the pitch.' },
        { id: 'b', text: 'The second tone sounds higher and quieter than the first, because more whole waves reaching the ear each second is a higher frequency and so a higher pitch, while air pushed a shorter way from its rest position is a smaller amplitude and so a quieter sound.', correct: true },
        { id: 'c', text: 'The second tone sounds lower and quieter than the first, because a tone that moves the air only a short way is a weak tone and a weak tone is a low tone, so the pitch has to fall whenever the loudness falls, and a tone cannot be made quieter while staying on the note it was already sitting on.' },
        { id: 'd', text: 'The second tone sounds higher than the first and just as loud, because how far the air is pushed from its rest position sets how far across the room a sound will carry rather than how loud it is at the ear, so pushing the air a shorter way only means the tone would not be heard from as far away.' },
      ],
      expectedAnswer: 'The second tone sounds higher and quieter than the first, because more whole waves reaching the ear each second is a higher frequency and so a higher pitch, while air pushed a shorter way from its rest position is a smaller amplitude and so a quieter sound.',
      hints: [
        'Take the two measures one at a time. First ask only what changed about how often the waves arrive, and what that does to the pitch. Then ask separately what changed about how far the air is pushed, and what that does to the loudness.',
        'Pitch and loudness are independent, so the answer to the second question is not forced by the answer to the first. Any option that makes the loudness follow the pitch, or the pitch follow the loudness, has tied together two things that can be changed one at a time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-loudness-pitch-and-counting-humps',
      kind: 'misconception_check',
      question:
        'A student writes: "Turning a song up makes the singing sound higher, because a louder sound is a higher sound. And you can tell a rope wave has a high frequency just by looking at it, because if there are a lot of humps along the rope then the frequency is high." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A louder sound is a higher sound, so turning a song up makes the singing sound higher.',
          misconception:
            'Folding loudness and pitch into a single idea of "more sound", because a louder note and a higher note both feel like more of something, and the everyday word "high" gets used for volume and for pitch alike.',
          correctsTo:
            'Loudness and pitch are read off two different measures of the same wave, and those two measures can be changed one at a time. Loudness comes from AMPLITUDE, how far the air is pushed away from its rest position. Pitch comes from FREQUENCY, how many whole waves reach the ear each second. Turning a song up makes the amplitude of every wave in it bigger and leaves the frequencies exactly as they were, which is why a song played loudly is the same song on the same notes. You have heard the proof of this every time somebody has called your name across a field: the shout is far louder than the same word said right next to you, and it is the same voice on the same note. WRONG: "A louder sound is a higher sound." CORRECT: "A louder sound has a bigger amplitude, and a higher sound has a bigger frequency. Neither one drags the other along with it."',
        },
        {
          answer: 'A rope with a lot of humps along it has a high frequency.',
          misconception:
            'Reading frequency off a single snapshot of the whole rope, because a rope carrying many humps looks busier and therefore looks "more frequent", when what the count of visible humps actually depends on is the wavelength and the length of the rope.',
          correctsTo:
            'Frequency is counted at ONE FIXED POINT over ONE SECOND, never along the whole rope at one instant. Take a rope carrying humps 50 centimeters apart. A 10-meter length of that rope is 1,000 centimeters long and holds 20 humps, because 1,000 divided by 50 is 20. A 2-meter length of the very same rope is 200 centimeters long and holds 4, because 200 divided by 50 is 4. Nothing about the wave changed when the rope got shorter, so a number that changes with the length of the rope cannot be the frequency. What the count of visible humps does tell you about is the WAVELENGTH: humps packed close together means a short wavelength. To get the frequency you have to stop looking at the whole rope, pick one mark, and count the humps that cross that one mark in a second. WRONG: "Lots of humps along the rope means a high frequency." CORRECT: "Lots of humps along the rope means a short wavelength. Frequency is a count taken at one fixed point over one second."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every measure is read against the REST POSITION: where the material sits when nothing is disturbing it. Find that line in the description first, every time.',
        'AMPLITUDE is a distance from the rest position to the top of a crest, or down to the bottom of a trough. A trough-to-crest height crosses the rest position, so it is TWICE the amplitude: halve it.',
        'WAVELENGTH is a distance covering one whole repeat: one crest to the next crest, or one trough to the next trough. A crest to the very next trough is HALF a wavelength: double it.',
        'Amplitude and wavelength both wear distance units, so the units cannot tell them apart. Amplitude is measured up and down across the rest position; wavelength is measured along the direction the wave travels.',
        'FREQUENCY is a count, not a distance: how many whole waves pass one fixed point in one second. If the counting ran longer, divide the count by the number of seconds.',
        'The unit of frequency is the hertz. A frequency of 3 hertz means 3 whole waves pass a fixed point every second.',
        'Check the kind of unit before you say any answer. A frequency in centimeters, or an amplitude in hertz, is wrong on its face.',
        'For a sound, FREQUENCY is heard as PITCH and AMPLITUDE is heard as LOUDNESS.',
        'Pitch and loudness are INDEPENDENT. A shout and a whisper can sit on the very same note, and two notes far apart can be equally loud.',
        'The number of humps you can see along a rope is about the wavelength and the length of the rope. It is never the frequency.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Amplitude, Wavelength & Frequency' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
