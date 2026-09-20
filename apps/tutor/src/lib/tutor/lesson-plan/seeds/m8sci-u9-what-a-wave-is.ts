/**
 * Grade 8 Science (Physical Science) — What a Wave Is.
 *
 * CONCEPT-LED row 9.1, the entry lesson for Unit 9 (NGSS DCI PS4.A). The
 * student has no procedure to lean on: the whole lesson installs one mental
 * model -- a wave is a repeating disturbance that travels through a medium,
 * delivering ENERGY while every bit of the medium stays where it is -- and
 * then gives that model a two-direction sorting move (which way does the wave
 * travel; which way does one bit of the medium move) that turns "transverse
 * or longitudinal" from a memorized pair of words into something the student
 * can work out from a description.
 *
 * The three traps it is built to kill are (a) the-wave-carries-the-water-along,
 * which every beach reinforces; (b) treating the transverse shape as the
 * definition of "wave", so that a sound does not count because nothing goes up
 * and down; and (c) sound-in-space, the belief that a mechanical wave can cross
 * a region with no matter in it.
 *
 * SCOPE GUARD: this plan does three things and stops. It describes a wave as a
 * repeating disturbance that carries energy from place to place without
 * carrying the matter along; it classifies a wave as transverse or
 * longitudinal by comparing the direction the wave travels with the direction
 * one bit of the medium moves; and it states that mechanical waves need a
 * medium. Per CONTROLLER RULING 33: this row's curriculum scope cell has only
 * part (i). It carries NO lineage clause (there is no m6sci or m7sci
 * predecessor to name -- neither sibling course has a wave lesson) and NO
 * withheld clause; nothing has been invented to fill either gap, and the
 * boundaries below are derived from the neighboring scope cells and the
 * curriculum's "Explicitly excluded" table instead.
 *   - GRADE 8 NEIGHBORS. Row 9.2 (amplitude, wavelength, frequency) owns the
 *     MEASURES of a wave. Grepped against the authored body -- everything the
 *     tutor speaks -- the words amplitude, wavelength, frequency, hertz, pitch,
 *     crest and trough appear zero times; the sole occurrence anywhere in the
 *     file is inside the `followUps` chain id
 *     `m8sci.amplitude-wavelength-and-frequency`, which is a reference and is
 *     never spoken. "Loudness" occurs exactly once, in a wrong answer that
 *     tries to explain the astronauts away by distance and loudness, where it
 *     is the everyday word and not the wave measure. Nothing in this file is
 *     measured, and no two waves are compared in size. The raised part of a
 *     wave is called a "hump" throughout, precisely so that 9.2 still gets to
 *     name the crest. Row 9.3 (wave speed) owns how fast a wave goes:
 *     grepped, the words "speed", "faster" and "slower" appear zero times in
 *     the authored body, no wave is timed, sound is never said to be quicker in
 *     one material than in another, and frequency is never related to
 *     wavelength. Row 9.4 owns amplitude and energy: this file says a wave carries energy,
 *     never how much or what it depends on. Row 10.1 (reflection, absorption,
 *     transmission) and 10.3 (light versus sound) own what happens when a wave
 *     meets a material and what light is. Light appears in two places only --
 *     the closing qualifier of concept keyIdea 6 and the final recap line --
 *     and in both it says only that light is NOT a mechanical wave and that it
 *     crosses empty space, which is how sunlight reaches Earth. That is the
 *     qualifier that makes "mechanical waves need a medium" true as stated,
 *     and it is followed each time by a pointer that what light actually is
 *     belongs to a later lesson.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: water waves are used as a
 *     physical system and never as an Earth-systems process. The words
 *     "current" and "tide" DO occur -- grepped: "current" four times (the first
 *     worked example's contrasting case and its answer, the misconception
 *     check, and recap line three) and "tide" once (the misconception check).
 *     They are deliberately allowed, because a current is the thing a wave has
 *     to be told apart FROM: it carries matter from place to place and a wave
 *     does not, which is what makes the floating-object test mean anything.
 *     Neither is ever given a cause, a name, a location or a role in any Earth
 *     system, and the steady wind that drives the current in that contrasting
 *     case is a stipulated condition, not weather. There is no shoreline
 *     change, no erosion and no climate, and -- the closest call -- no
 *     earthquake and no seismic wave anywhere, although a seismic wave is the
 *     textbook
 *     transverse-and-longitudinal example, because that phenomenon belongs to
 *     Grade 6's Earth-interior rows. "Vacuum" is defined once, in the concept
 *     vocabulary, and outer space is mentioned only as a place that is nearly
 *     one;
 *     grepped, "orbit", "planet" and "moon" appear zero times and every hit for
 *     "star" is inside the words "start" and "started".
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Ears and eardrums are named only as the
 *     thing a sound wave arrives at; there is no hearing mechanism, no sense
 *     organ, no cell and no organism.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in this
 *     catalog, so AP Physics is the course above): the specific relationship
 *     this file stops short of is speed = frequency × wavelength, which is row
 *     9.3's in its qualitative form and `ap-physics2-*`'s in every quantitative
 *     form. No formula of any kind appears in the authored body, in words or
 *     in symbols -- grepped, no authored string in this file contains an "="
 *     or the word "equals", and the only "=" characters anywhere in the file
 *     are the ones in this guard paragraph and the one in the TypeScript
 *     `export const` line. Also absent: period and phase, intensity, "energy proportional
 *     to amplitude squared", superposition, interference, standing waves,
 *     resonance, the Doppler effect, polarization, and any description of a
 *     wave as a sine curve or as a mathematical function. No quantity in this
 *     file is computed from any other.
 *
 * NOTE ON BURNED EXAMPLES (CONTROLLER RULING 32/36): `los[0].description` is
 * student-facing and carries the scope cell's own examples verbatim -- the
 * floating duck on the ripple, the rope, the water surface, sound, and the
 * pushed slinky (which the teaching segments call a long spring toy, since a
 * Slinky is a trade name). All five are therefore answerable from the objective and
 * are BURNED for items. They are used freely in the teaching segments, where
 * they belong, and every one of the three try_yourself items runs on a fresh
 * specimen instead: a flicked garden hose with a leaf on it, a line of nested
 * shopping carts, and three astronauts at a space station's metal wall. A
 * later editor must not "helpfully" swap one of the cell's examples back into
 * an item.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course, and a wave is
 * the topic that suffers most from that, because it is normally taught from a
 * drawing. Every wave in this file is written out in words -- what the medium
 * is, which way the disturbance travels, and which way one named bit of the
 * medium moves -- and every item is solvable from the text printed inside it.
 * Never write "look at the wave diagram", and never assume the student has a
 * rope, a spring toy or a tank of water in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.4 -> 9.1 -> 9.2
 * (`synthetic-materials-from-natural-resources` before it,
 * `amplitude-wavelength-and-frequency` after it). Unlike the two exemplars,
 * both arrays are populated, per the contract's chain table.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U9_WHAT_A_WAVE_IS: LessonPlan = {
  id: 'evelyn.ms.m8sci.what-a-wave-is.v1',
  title: 'What a Wave Is',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.what-a-wave-is',
      standard: 'M8SCI-9.1',
      description:
        'Describe a wave as a repeating disturbance that carries energy from place to place WITHOUT carrying the matter along (a floating duck bobs but does not travel with the ripple), classify a wave as transverse (the medium moves across the direction of travel -- rope, water surface) or longitudinal (the medium squeezes and stretches along it -- sound, a pushed slinky), and state that mechanical waves need a medium (NGSS DCI PS4.A).',
    },
  ],
  prerequisites: ['m8sci.synthetic-materials-from-natural-resources'],
  followUps: ['m8sci.amplitude-wavelength-and-frequency'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that something real arrives from a speaker and from a shout while no matter makes the trip, so "what actually traveled?" becomes the question the lesson has to answer.',
      script:
        'Stand near the front at a concert and you can feel the bass in your chest and buzzing up through the floor. Something is definitely arriving from those speakers. But look at what is not happening. The speaker cone is still bolted inside the speaker. The air in the room is not rushing across at you like wind. The floor is exactly where it was. Nothing made the journey from the stage to you, and yet you can feel that something did. Here is the same puzzle outdoors and quieter. Shout across a valley and your friend on the other side hears you, but the air does not travel from your mouth to their ear. Whatever crossed that valley, it was not stuff. Today you will find out what it was, why the answer is called a wave, and how to tell two different kinds of wave apart just from a description of which way things are moving.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-a-wave-is',
      kind: 'concept',
      goal: 'Install the model -- a repeating disturbance handed along a medium, carrying energy and not matter -- then give the two-direction sorting move for transverse versus longitudinal, and close with the medium rule and its one qualifier.',
      keyIdeas: [
        'A WAVE IS A REPEATING DISTURBANCE THAT TRAVELS, AND WHAT IT DELIVERS IS ENERGY. Start one part of a material moving back and forth -- a flick, a shove, a vibration -- and that part pushes or pulls the part next to it, which pushes the part next to that one, and the movement gets handed along step by step. That traveling pattern of movement is a wave, and the material it travels through is called the medium. The reason to care is what arrives at the other end: the far side of the medium was still, and now it is moving, so energy got from your end to the far end. A wave is how energy crosses a material without anything being thrown across it.',
        'THE MEDIUM DOES NOT TRAVEL WITH THE WAVE, AND THIS IS THE WHOLE IDEA. Pick one small piece of the medium and watch only that piece. It moves away from its resting place, comes back, moves away again, and comes back again, over and over, and once the wave has gone by it is sitting about where it began. A duck floating on a pond rises and falls as each ripple passes under it, and it is still floating in the same spot when those ripples have reached the bank. So a wave carries energy from place to place without carrying the matter along. WRONG: "The wave brought that water over from the far side of the pond." CORRECT: "Each bit of water bobbed up and down and stayed put, and what crossed the pond was the disturbance and the energy it carries."',
        'TO SORT ANY WAVE INTO ITS KIND, FIND TWO DIRECTIONS. The first is the direction the wave travels: which way is the disturbance being handed along? The second is the direction one bit of the medium moves: which way does that one piece go while the wave passes it? Name both out loud before you decide anything, because everything in this lesson comes down to comparing them. If the second direction is ACROSS the first, the wave is transverse. If the second direction lies ALONG the first, the wave is longitudinal. Notice what the two kinds have in common: in both of them the bit of medium goes away from its resting place and comes back, and in both of them it ends up about where it started.',
        'TRANSVERSE WAVES: THE MEDIUM MOVES ACROSS THE DIRECTION OF TRAVEL. Tie one end of a rope to a post, pull the rope straight, and flick your hand up and down over and over. Humps travel along the rope toward the post, so the direction of travel is straight down the rope. Meanwhile every piece of the rope moves up and down, which is across the direction the humps are going, and each piece ends up back at its resting height. A ripple on a water surface behaves the same way: the ripple spreads outward along the surface while the water at any one spot moves up and down.',
        'LONGITUDINAL WAVES: THE MEDIUM MOVES ALONG THE DIRECTION OF TRAVEL. Lay a long spring toy out straight and push one end sharply toward the far end, over and over. The coils near your hand bunch up into a squeezed region, and that squeeze travels down the spring; behind each squeeze the coils are left spread farther apart than usual. The squeezed-together region is called a compression and the spread-out region is called a rarefaction. Here the coils move back and forth along the very same line the squeeze travels down, not across it. Sound in air works this way: the air is squeezed together and spread apart along the direction the sound is going.',
        'MECHANICAL WAVES NEED A MEDIUM, BECAUSE THE HANDING ALONG IS DONE BY MATTER. A wave that travels by one bit of matter pushing or pulling the next bit is called a mechanical wave, and every wave named so far is one. Take the matter away and there is nothing left to do the handing along, so the wave does not travel at all; a region with no matter in it is called a vacuum, and outer space is very nearly one. Any matter will do, though, not air in particular: sound travels through gases, through liquids and through solids, which is why a swimmer with her head underwater hears a tap on the pool wall and why a knock carries through a closed wooden door. One qualifier keeps the rule honest. Light is NOT a mechanical wave, and it crosses empty space -- that is how sunlight reaches Earth. What light is, and how it differs from sound, is a later lesson. All you need here is that "needs a medium" is a rule about mechanical waves.',
      ],
      vocabulary: [
        { term: 'wave', definition: 'a repeating disturbance that travels through a material, carrying energy from place to place without carrying the material along with it.' },
        { term: 'medium', definition: 'the material a mechanical wave travels through -- the water of a pond, the air of a room, the metal of a rail.' },
        { term: 'mechanical wave', definition: 'a wave that travels by one bit of matter pushing or pulling the next bit, so it cannot travel where there is no matter.' },
        { term: 'transverse wave', definition: 'a wave in which the medium moves across the direction the wave travels, as a rope moves up and down while the humps run along it.' },
        { term: 'longitudinal wave', definition: 'a wave in which the medium moves back and forth along the direction the wave travels, squeezing together and spreading apart.' },
        { term: 'compression', definition: 'the squeezed-together part of a longitudinal wave, where the bits of the medium are packed closer than usual. The spread-apart part between compressions is called a rarefaction.' },
        { term: 'vacuum', definition: 'a region with no matter in it, where a mechanical wave has nothing to travel through and so does not travel at all.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pond-ripple',
      kind: 'worked_example',
      problem:
        'A stone drops into the middle of a still pond, and rings of ripples spread out from that spot toward the bank. A tennis ball is floating on the water about halfway between the middle of the pond and the bank. As each ripple reaches the ball, the ball rises, then falls, then rises again. A minute later the ripples have all reached the bank, and the ball is still floating about halfway out. Two questions: what traveled from the middle of the pond to the bank, and is this wave transverse or longitudinal?',
      steps: [
        'Name the medium and the direction the wave travels. The medium is the water of the pond. The ripples travel outward from the middle toward the bank, so the direction of travel is outward, flat along the surface.',
        'Now watch one bit of the medium and nothing else. The tennis ball floats on the water, so it does whatever the water right under it does, and the description tells you what that is: it rises, falls, and rises again, and a minute later it is about halfway out, which is where it began. So each bit of water moves up and down about its resting level and ends up back about where it started.',
        'Answer the first question. The water did not travel to the bank. The water that is sloshing at the bank was already at the bank. What traveled outward was the disturbance -- the up-and-down movement handed from each bit of water to the next -- and the energy that disturbance carries. You can tell the energy arrived, because the water at the bank was flat and still before, and it is moving now. WRONG: "The water from the middle of the pond flowed outward and splashed the bank." CORRECT: "Each bit of water bobbed up and down and stayed where it was, and the disturbance carrying the energy is what crossed the pond."',
        'Answer the second question using the two directions. The wave travels outward, flat along the surface. The water moves up and down. Up and down is across the outward direction, not along it, so this is a transverse wave.',
        'Check the answer with three clues of DIFFERENT KINDS, because there is no arithmetic here to redo. Clue one is the path of one bit of the medium: the ball finishes where it began, so nothing was carried along with the ripple. Clue two is the timing of what arrives: the bank starts moving a moment AFTER the stone lands, not at the same instant, so something traveled across the pond and it took time to get there. Clue three is the shape of the pond afterward: there is no pile of water heaped at the bank and no hollow left in the middle, which is exactly what you WOULD find if water itself had been transported from one place to the other. Three different kinds of evidence, one answer.',
        'Now change one condition and check that the answer moves. Take the stone away, and instead let a steady wind blow across the pond from the middle toward the bank, hard enough to drag the surface water with it. Now the tennis ball really does drift to the bank and stay there. That is a current, not a wave: matter itself is being carried from one place to another. The bobbing ball is what separates the two cases, and its behavior changed when the cause changed -- which is the sign that "the ball stays put" is genuinely telling you something about the wave, and not just something about balls.',
      ],
      answer:
        'What traveled from the middle of the pond to the bank was a disturbance carrying energy, not water. Each bit of water rose and fell about its resting level and ended up about where it started, which is why the tennis ball is still floating halfway out. The wave is transverse, because the water moves up and down while the wave travels outward along the surface, and up and down is across the direction of travel. Replace the ripples with a steady wind that drags the surface along and the ball drifts to the bank: that is a current moving matter, which is a different thing from a wave.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-knock-through-air',
      kind: 'worked_example',
      problem:
        'A friend stands on the other side of a closed wooden door and knocks three times. You hear the knocks clearly. Between the door and your ear there is nothing but the air of the room. A student says: "Sound must be tiny bits of something flying from the door to my ear, because the knock got to me somehow." Work out what actually made the trip, and say whether a sound wave in air is transverse or longitudinal.',
      steps: [
        'Name the medium and the direction of travel. Between the door and your ear the medium is the air in the room, and the wave travels from the door toward your ear.',
        'Say what the door does to the air touching it. A struck door springs in and out very fast. Each time its surface moves outward it shoves the air right against it, packing that air into a thin squeezed region where the particles sit closer together than usual. Each time the surface springs back, the air there is left spread out, with the particles farther apart than usual. Knock after knock, squeezed regions and spread-out regions are made one after another.',
        'Follow one squeeze across the room. The squeezed air presses on the air just beyond it and squeezes that, and that squeezes the next bit, and so on all the way across the room, until the last squeeze presses on your eardrum and pushes it in. That is what arrived: a squeeze traveling through air that was already in the room the whole time. WRONG: "Bits of the door, or a puff of air from the door, flew across the room and hit my ear." CORRECT: "Every bit of air jiggled back and forth a tiny distance and stayed in its own part of the room. The squeeze-and-spread pattern is what crossed the room, and it carried the energy that moved my eardrum."',
        'Now use the two directions. The wave travels from the door to your ear. Each bit of air moves back and forth along that same line -- a little way toward your ear, then a little way back toward the door, over and over. The medium moves ALONG the direction of travel, so a sound wave in air is longitudinal.',
        'Check with three clues of DIFFERENT KINDS. Clue one is the path of the medium: no breeze arrives with the knock, and a loose sheet of paper lying on the floor between the door and you does not creep toward you, so the air as a whole is not traveling anywhere. Clue two is the set of materials that carry the knock: the knock also comes through the wooden door itself, and with an ear against the door it sounds louder still, so whatever is doing the carrying is matter, and matter of more than one kind. Clue three comes from what air is like: a gas has nothing to grip its neighbor with sideways, so pushing one bit of air sideways does not drag the bit beside it along, and the only thing one bit of air can do to the next bit is squeeze it. That is an independent reason a sound wave in air has to be longitudinal, and it agrees with the first two clues.',
        'Now change one condition and check that the answer moves. Swap the medium: have the same friend tap the wall of a swimming pool while you float with your head underwater at the other end. You hear the taps, so a liquid hands the squeeze along just as a gas does, and the wave is still longitudinal, because water can also be squeezed along the line the wave is traveling. The thing every working case has in common is matter between the source and the listener. Where a case has no matter in between, there is nothing to do the handing along, and no mechanical wave travels at all.',
      ],
      answer:
        'Nothing flew across the room. The door springing in and out squeezed the air touching it, that squeeze pressed on the air beyond it, and the squeeze-and-spread pattern traveled across the room through air that was already there, carrying the energy that pushed your eardrum in. Every bit of air jiggled back and forth a short distance along the line from the door to your ear and stayed in its own part of the room. Because the air moves back and forth along the direction the wave travels, a sound wave in air is longitudinal. Swap the air for water and the taps still reach you, because a liquid is matter too.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hose-what-travels',
      kind: 'try_yourself',
      problem:
        'A long garden hose lies stretched out straight on the grass. You hold one end and flick your hand up and down, over and over. Humps travel along the hose away from you, one after another, all the way to the far end. A dry leaf that was resting on the hose about halfway along is lifted and lowered as each hump passes under it, and when you stop flicking, that leaf is still lying on the same part of the hose. What has traveled from your hand to the far end of the hose?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The rubber of the hose has traveled along to the far end, because each hump is made of hose, and a hump cannot arrive at the far end unless the material it is made of goes there too.' },
        { id: 'b', text: 'The humps are an illusion and nothing at all makes the trip, because each piece of the hose only rises and falls in its own place, and the pieces farther along simply take their turn a moment later.' },
        { id: 'c', text: 'A disturbance carrying energy has traveled the length of the hose, while each piece of the hose has only moved up and down about its resting place and stayed where it was.', correct: true },
        { id: 'd', text: 'The push from your hand has traveled along inside the hose as a stored-up force, handed from one piece of hose to the next, until it reaches the far end and is used up there.' },
      ],
      expectedAnswer: 'A disturbance carrying energy has traveled the length of the hose, while each piece of the hose has only moved up and down about its resting place and stayed where it was.',
      hints: [
        'Follow one single piece of the hose -- say the piece right under the leaf -- from the moment you start flicking to the moment you stop. Where does that piece end up compared with where it began?',
        'Something definitely made the trip, because the far end of the hose was still before and is moving now. Decide which of the two it was: the material of the hose, or the disturbance and the energy it carries.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cart-line-classify',
      kind: 'try_yourself',
      problem:
        'A long line of shopping carts stands nested together, nose to tail, at the front of a store. You take hold of the cart at the back of the line and push it forward and pull it back, forward and back, over and over. Each time you push, the gap between one pair of carts closes and then opens again, and that closing travels forward along the line all the way to the front cart. When you stop, every cart is still in its own place in the line, in the same order as before. Is this wave transverse or longitudinal, and how can you tell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Transverse, because the carts and the squeeze both head toward the front of the line, and a wave counts as transverse whenever the medium and the wave move in the same direction.' },
        { id: 'b', text: 'Longitudinal, because the carts themselves are carried from the back of the line to the front, and a wave that moves matter from one place to another along its path is longitudinal.' },
        { id: 'c', text: 'Transverse, because every cart stays in its own place in the line and only shifts a little before settling back, and a wave whose medium returns to where it started is transverse.' },
        { id: 'd', text: 'Longitudinal, because each cart moves forward and backward along the very same line that the squeeze travels down, so the medium moves along the direction of travel instead of across it.', correct: true },
      ],
      expectedAnswer: 'Longitudinal, because each cart moves forward and backward along the very same line that the squeeze travels down, so the medium moves along the direction of travel instead of across it.',
      hints: [
        'Find two directions before you choose anything. First, which way does the closing gap travel along the line of carts? Second, which way does any one cart move while that closing gap goes past it?',
        'If those two directions lie along the same line, the wave is longitudinal; if one is across the other, it is transverse. Returning to its starting place is something the medium does in both kinds, so it cannot be what tells them apart.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-astronauts-medium',
      kind: 'try_yourself',
      problem:
        'Outside a space station, an astronaut in the vacuum taps a metal wrench steadily against the outside of the station\'s metal wall. A second astronaut floats about 3 meters away, touching nothing, with nothing but vacuum between her and the wall, and she hears nothing at all. A third astronaut is inside the station with her ear pressed against the inside of that very same wall, and she hears the taps clearly. Which statement explains both results?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A mechanical wave can travel only where there is matter to hand the disturbance along, so the metal wall and the air inside carry the taps to the astronaut inside, while the vacuum between the wall and the floating astronaut holds no matter at all and can carry nothing.', correct: true },
        { id: 'b', text: 'The taps are simply too quiet to cross about 3 meters of open space, and the astronaut inside hears them because pressing an ear against any solid surface makes a faint sound easier to pick up, so the difference between the two listeners is one of distance and loudness rather than one of materials.' },
        { id: 'c', text: 'A mechanical wave needs air in particular, so the taps reach the third astronaut only because the station is full of air on her side of the wall, and the floating astronaut hears nothing because there is no air on the outside of the station for the taps to move through.' },
        { id: 'd', text: 'The disturbance does cross the vacuum just as it would cross a gap of air, and the floating astronaut hears nothing only because her sealed helmet shuts the taps out, while the astronaut inside has her helmet off and so has nothing standing between the taps and her ear.' },
      ],
      expectedAnswer: 'A mechanical wave can travel only where there is matter to hand the disturbance along, so the metal wall and the air inside carry the taps to the astronaut inside, while the vacuum between the wall and the floating astronaut holds no matter at all and can carry nothing.',
      hints: [
        'Ask what sits between the tapping wrench and each listener. Trace the path to the astronaut inside, material by material, and then trace the path to the astronaut floating outside.',
        'A mechanical wave works by one bit of matter pushing the next bit. Ask whether each path has matter all the way along it, and then ask whether the matter has to be air.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-water-travels-and-sound-is-not-a-wave',
      kind: 'misconception_check',
      question:
        'A student writes: "When a wave reaches the shore, the water that hits your legs came all the way in from where the wave started. And anyway, a sound is not really a wave, because nothing about a sound goes up and down." Two different things are wrong there. What are they?',
      commonErrors: [
        {
          answer: 'The water that hits your legs came all the way in from where the wave started.',
          misconception:
            'Reading a wave as a lump of matter that moves, because from the beach that is exactly what it looks like: something arrives, it arrives from far out, and it is made of water.',
          correctsTo:
            'The water at your legs was already at your legs. Each bit of water rises and falls about its resting level and finishes about where it began, and what crosses the sea is the disturbance and the energy it carries. The test that settles it is to watch something floating out beyond the breakers. A buoy or a patch of seaweed bobs up and down for hours while wave after wave passes it, and it is still out there at the end of the afternoon rather than lying on the sand. A current or a tide is a different thing, and that DOES carry water from one place to another -- which is exactly why the floating object is the test. If it stays put, a wave went past it. If it is carried along, matter itself is moving.',
        },
        {
          answer: 'A sound is not really a wave, because nothing about a sound goes up and down.',
          misconception:
            'Taking one KIND of wave -- the transverse kind, where the medium moves across the direction of travel -- as the definition of every wave, because a water ripple is the wave most people picture first.',
          correctsTo:
            'A wave is any repeating disturbance that travels through a medium and carries energy without carrying the medium along. Going up and down is no part of that definition; it is simply what the medium happens to do in one of the two kinds. In a transverse wave the medium moves across the direction the wave travels. In a longitudinal wave the medium moves back and forth along the direction the wave travels, squeezing together and spreading apart -- and that is exactly what air does while a sound passes through it. Both kinds carry energy from place to place, and in both kinds every bit of the medium ends up about where it started. So a sound is fully a wave. It is a longitudinal one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A wave is a repeating disturbance that travels through a medium, and what it carries from place to place is energy.',
        'A wave does not carry the matter along. Every bit of the medium moves away from its resting place and back again, and ends up about where it started.',
        'The floating object is the test. A duck bobs while the ripples run past it to the bank, so the water is not traveling -- the disturbance is. If the floating object is carried along instead, that is a current, not a wave.',
        'To sort a wave into its kind, name two directions: the direction the wave travels, and the direction one bit of the medium moves.',
        'Transverse wave: the medium moves ACROSS the direction of travel. A flicked rope, and the surface of water.',
        'Longitudinal wave: the medium moves ALONG the direction of travel, squeezing together into compressions and spreading apart in between. A pushed spring toy, and sound in air.',
        'Both kinds carry energy, and in both kinds the medium stays where it is. The two kinds differ only in which way the medium moves.',
        'A mechanical wave travels by one bit of matter pushing or pulling the next bit, so it needs a medium. Any matter will do -- a gas, a liquid or a solid -- but where there is no matter at all, a mechanical wave does not travel.',
        'Light is not a mechanical wave and it crosses empty space, which is how sunlight reaches Earth. "Needs a medium" is a rule about mechanical waves.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'What a Wave Is' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
