/**
 * Grade 6 Science (Earth & Space Science) — The Earth-Sun-Moon System:
 * Earth's Rotation: Day & Night.
 *
 * CONCEPT-LED plan for the m6sci fan-out (NGSS MS-ESS1-1). The whole lesson
 * builds one picture -- a spinning Earth with sunlight always lighting
 * exactly one half of it -- and uses that picture to explain two things: why
 * a given location cycles through day and night, and why that cycle keeps to
 * about 24 hours all year long, at any latitude, because Earth's spin rate
 * itself does not change with the seasons. The same picture also explains
 * the sun's apparent east-to-west path across the sky as a direct
 * consequence of Earth's real west-to-east spin.
 *
 * The two traps it is built to kill are (a) the geocentric habit of putting
 * the sun in motion around Earth instead of Earth spinning, and (b)
 * confusing Earth's daily rotation with a change in Earth-sun distance.
 *
 * SCOPE GUARD: this plan explains why day and night occur from Earth's
 * rotation alone, and why the day-night cycle itself keeps to about 24 hours
 * all year at any latitude, because rotation rate does not change with the
 * seasons. It also describes the sun's apparent east-to-west path across the
 * sky as a direct consequence of that same west-to-east spin. Because row
 * 2.2 sits immediately next and uses the same tilted-axis model from a
 * different angle, the guard states what is deliberately EXCLUDED and what
 * is deliberately ALLOWED at that edge, and why:
 *   - EARTH'S AXIAL TILT is named exactly once, as a plain geometric fact
 *     (about 23.5 degrees from the line perpendicular to Earth's orbital
 *     path, holding a fixed direction in space) because the brief's model is
 *     "Earth spinning on its tilted axis." The tilt is never used here to
 *     explain anything: it does not explain why day length shifts, why
 *     seasons happen, or why the hemispheres differ. Every one of those
 *     explanations belongs to row 2.2, Earth's Revolution & the Seasons.
 *   - THE DAYLIGHT-TO-DARKNESS SPLIT is named as a fact that it shifts
 *     across the year at latitudes away from the equator, and every time it
 *     is named the file says explicitly that explaining WHY it shifts is not
 *     this lesson's job. What this lesson claims and defends instead is a
 *     narrower fact: the full ROTATION PERIOD -- about 24 hours from one
 *     sunrise to the next at a given location -- stays close to the same
 *     length all year, at every latitude, because Earth's spin rate itself
 *     does not change with the seasons.
 *   - REVOLUTION (Earth's yearlong orbit around the sun) is named once, only
 *     to define rotation by contrast with it. Its length (about 365 and a
 *     quarter days) is stated as a bare fact with no orbital mechanism
 *     attached, and it is never used to explain day, night, or the sky.
 *   - No eclipse, moon phase, or moon content of any kind appears anywhere
 *     in this file; rows 2.3 and 2.4 are untouched.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this plan states THAT Earth rotates
 *     and THAT it rotates in a fixed west-to-east direction; it never
 *     explains WHY Earth spins, what started the spin, angular momentum, or
 *     any force or energy law behind rotation. Those mechanisms, and any
 *     force calculation, are Grade 8 physical science and appear nowhere
 *     here.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * position, direction and geometry in this file is written out in words,
 * and every item is solvable from the text printed inside it. Never write
 * "see the diagram above," and never assume the student has a flashlight, a
 * globe, or a clear sky tonight.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.4 -> 2.1 ->
 * 2.2. Row 1.4 (asteroids-comets-and-other-solar-system-objects) and row 2.2
 * (earths-revolution-and-the-seasons) are populated here per the lesson
 * brief and the fan-out contract's chain table; `lint-ms-plans` checks these
 * against the full 40-row batch at registration time, not per file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U2_EARTHS_ROTATION_DAY_AND_NIGHT: LessonPlan = {
  id: 'evelyn.ms.m6sci.earths-rotation-day-and-night.v1',
  title: 'Earth\'s Rotation: Day & Night',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.earths-rotation-day-and-night',
      standard: 'M6SCI-2.1',
      description:
        'Use a model of Earth spinning on its tilted axis to explain why day and night occur and why their length changes little across the year at a given latitude (NGSS MS-ESS1-1).',
    },
  ],
  prerequisites: ['m6sci.asteroids-comets-and-other-solar-system-objects'],
  followUps: ['m6sci.earths-revolution-and-the-seasons'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from the everyday appearance that the sun crosses the sky, and flip it around to Earth doing the moving.',
      script:
        'Right now, while you are reading this, somebody on the exact opposite side of Earth is fast asleep in the middle of the night. Nothing separates you from them except which way the ground under each of you happens to be facing at this moment. You have watched the sun rise in the morning and set in the evening more times than you could count, and it probably looks like the sun is doing the moving, crawling across the sky from one side to the other. Here is the strange part. The sun is not the thing that is moving. You are. Or rather, the whole planet under your feet is turning, carrying you through sunlight, then through darkness, then back into sunlight again, once every day. Today we build the spinning picture that explains why day turns into night, why night turns back into day, and why the sun only looks like it is crossing the sky.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rotation-day-night',
      kind: 'concept',
      goal: 'Install the rotation model, explain the day-night cycle and its steady length, and explain the sun\'s apparent path across the sky.',
      keyIdeas: [
        'ROTATION IS EARTH SPINNING, NOT ORBITING. Earth spins on its axis, an imaginary straight line running between the North Pole and the South Pole. One full spin is called a ROTATION, and it takes about 24 hours. This is a completely different motion from REVOLUTION, which is the much longer trip Earth makes orbiting the sun, taking about 365 and a quarter days. Earth completes roughly 365 rotations during one revolution. This lesson is about rotation only; revolution, and what it causes, is the next lesson.',
        'WHY DAY AND NIGHT HAPPEN. At any instant, sunlight is lighting exactly one half of Earth -- call it the lit half -- and the other half is in darkness. As Earth rotates, every location on the surface gets carried through the lit half and then the dark half once per rotation, which is what turns day into night and night back into day. WRONG: "The sun moves around Earth once a day, and night falls when the sun swings around to the far side." CORRECT: "Earth is the one spinning. A location experiences night when Earth\'s rotation has carried that location onto the side facing away from the sun, not because the sun has gone anywhere."',
        'EARTH SPINS ON A TILTED AXIS. Earth\'s axis is not straight up and down relative to its path around the sun -- it leans about 23.5 degrees away from that straight-up position, and it keeps pointing in the same direction in space as Earth spins and as Earth orbits. That tilt is a real, fixed feature of the spinning Earth, but nothing in this lesson uses it to explain anything: it does not change the fact that exactly half of Earth is lit at any moment, and it does not change how long one rotation takes. What the tilt does over the course of a year is the subject of the next lesson.',
        'THE SUN\'S APPARENT PATH ACROSS THE SKY. Earth spins from west to east -- viewed from high above the North Pole, the spin looks counterclockwise. That spin carries the ground, and everyone standing on it, toward the east, which makes the sun appear to slide the opposite way, from east to west, across the sky. For most places in the Northern Hemisphere, that means the sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west. The sun itself is not moving around Earth; the appearance of motion belongs to Earth\'s spin, the same way spinning in a desk chair makes the room outside look like it is turning, even though the room has not moved.',
        'THE ROTATION PERIOD BARELY CHANGES ACROSS THE YEAR. Earth\'s spin rate does not speed up or slow down with the seasons, so a full rotation -- and with it, one full day-night cycle -- stays close to about 24 hours all year long, at every latitude on Earth. What CAN shift across the year, at latitudes away from the equator, is how those roughly 24 hours are split between daylight hours and dark hours. This lesson does not explain why that split shifts; that explanation belongs to the next lesson, on Earth\'s revolution and the seasons.',
      ],
      vocabulary: [
        { term: 'rotation', definition: 'a spin on an axis; Earth completes one full rotation about every 24 hours.' },
        { term: 'axis', definition: 'the imaginary straight line an object spins around; Earth\'s axis runs between the North Pole and the South Pole and is tilted about 23.5 degrees from the line perpendicular to Earth\'s orbital path.' },
        { term: 'revolution', definition: 'one full trip a body makes orbiting around another body; Earth\'s revolution around the sun takes about 365 and a quarter days, which is the length of time the next lesson covers, not this one.' },
        { term: 'latitude', definition: 'a location\'s position measured in degrees north or south of the equator.' },
        { term: 'apparent motion', definition: 'movement that appears to happen from an observer\'s point of view, even when the real motion belongs to something else -- the sun\'s crossing of the sky is Earth\'s rotation seen from the ground, not the sun actually circling Earth.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-why-day-and-night',
      kind: 'worked_example',
      problem:
        'A classmate says the sun moves around Earth once a day, which is why it rises in the east and sets in the west. Using the rotation model, explain what is actually happening, and describe where in the sky a person in most of the Northern Hemisphere should expect to see the sun around midday.',
      steps: [
        'Earth is the object that is turning, not the sun. Picture Earth as a ball lit by sunlight on exactly one side at a time; the lit side is having daytime, and the far side is having night.',
        'Earth spins on its axis from west to east -- if you looked down at the North Pole from high above, Earth would appear to turn counterclockwise.',
        'Because Earth turns toward the east, a person standing on the ground is carried toward the east too, into the region the sunlight has not yet reached from the region it has -- this is what makes the sun APPEAR to rise from the eastern horizon, even though the sun itself has not moved. Turn your whole body to the left while standing still in a room, and the room appears to slide to the right around you, past your outstretched hand, even though the room has not moved. The sun\'s apparent path works the same way, on a planetary scale.',
        'As the spin continues, that same carrying motion moves the person\'s location further around, so the sun appears to climb higher, shift toward the south for most places in the Northern Hemisphere, reach its highest point around midday, and then appear to descend and set somewhere in the west.',
        'WRONG: "The sun moves around Earth once a day, from east to west, which is why it rises and sets." CORRECT: "Earth spins once about every 24 hours, from west to east, and it is this spin -- not any real motion of the sun -- that makes the sun appear to cross the sky from east to west."',
        'Now run the two checks a science answer needs, because there is no arithmetic in this one to redo. First, look for clues of DIFFERENT KINDS that agree. Directional evidence: observers all the way around the globe report the sun rising in the east and setting in the west, which matches one consistent spin direction rather than the sun wandering on its own. An everyday analogy: turning in place makes the room appear to spin the other way around you, even though the room has not moved -- the same relationship holds between a spinning Earth and an apparently moving sun. Timing evidence: the sun returns to about the same position in the sky roughly every 24 hours, matching Earth\'s known rotation period rather than some unrelated number. Second, change one thing and check that the answer moves with it: if Earth spun the opposite way, from east to west, the sun would appear to rise in the west and set in the east. Flip the spin direction, and the apparent direction of the sun\'s motion flips with it, which is exactly what a real explanation should do.',
      ],
      answer:
        'Earth is the one spinning, from west to east, about once every 24 hours. That spin makes the sun appear to move the opposite way across the sky: rising somewhere in the east, climbing to its highest point toward the south around midday for most places in the Northern Hemisphere, and setting somewhere in the west. The sun itself is not orbiting Earth.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-degrees-per-hour',
      kind: 'worked_example',
      problem:
        'Location A and Location B sit on the same rotating Earth, along lines of longitude that are 90 degrees apart, with Location B to the east of Location A. Using Earth\'s rotation rate, figure out which location\'s sunrise happens first, and about how many hours apart the two sunrises are.',
      steps: [
        'Find the rotation rate first. Earth completes one full turn, 360 degrees, in about 24 hours, so the rate is 360 divided by 24, which equals 15 degrees of rotation for every hour that passes.',
        'Next, settle the direction. Earth spins from west to east -- viewed from high above the North Pole, the spin looks counterclockwise. Because of that direction, a location farther EAST reaches the boundary between night and day, the sunrise line, sooner than a location farther west on the same rotating Earth.',
        'Location B is east of Location A, so apply the direction rule: Location B\'s sunrise happens first.',
        'Now use the rate to find the size of the gap. The two locations are 90 degrees of longitude apart, and the rotation rate is 15 degrees per hour, so the time gap is 90 divided by 15, which equals 6 hours.',
        'WRONG: "It does not matter which location is east or west, only how far apart the two are, so the gap is 6 hours either way." CORRECT: "Because Earth spins west to east, the EASTERN location\'s sunrise always comes first out of the two. Direction decides WHICH location leads; the 90-degree gap and the 15-degrees-per-hour rate only decide BY HOW MUCH."',
        'Verify with three different kinds of clues. Rate check: 15 degrees per hour times 24 hours equals 360 degrees, exactly one full rotation, so the rate is self-consistent. Direction check: real observers report that places to the east see sunrise earlier than places to the west on the same rotating Earth, which matches this model\'s prediction rather than the reverse. Reversed-arithmetic check: 90 divided by 15 gives 6, and 15 times 6 gives back 90, so the numbers agree working in either direction. Contrasting case: if the two locations had been 45 degrees apart instead of 90, the gap would shrink to 45 divided by 15, which equals 3 hours -- change the input, and the answer moves with it, which is what a real rate does and a memorized single number does not.',
      ],
      answer:
        'Location B\'s sunrise happens first, because it is farther east on a planet that spins west to east. The two sunrises are about 90 divided by 15, which equals 6 hours apart.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-night-happens',
      kind: 'try_yourself',
      problem:
        'A location on Earth is currently experiencing nighttime. According to the rotation model in this lesson, why is that location dark right now?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because the sun completes one full circle around Earth every 24 hours, the same circle it appears to trace from the ground, and this location is dark because the sun is currently swinging around the far side of that circle.' },
        { id: 'b', text: 'Because this location has swung much farther out from the sun during its nighttime hours, the same way a lamp looks dimmer the farther away from it you stand, so far out that the sunlight can no longer reach it until daytime returns.' },
        { id: 'c', text: 'Because clouds and the thickest layer of Earth\'s atmosphere have settled directly over this one location, thick enough to block the sunlight completely, and will not clear away again until the daylight hours return.' },
        { id: 'd', text: 'Because Earth\'s rotation has carried this location onto the half of the globe that is facing away from the sun, so no direct sunlight reaches it until the spin carries the location back around into the sunlit half again.', correct: true },
      ],
      expectedAnswer: 'Because Earth\'s rotation has carried this location onto the half of the globe that is facing away from the sun, so no direct sunlight reaches it until the spin carries the location back around into the sunlit half again.',
      hints: [
        'Start with what is actually moving: does the SUN travel to a new spot, or does this location travel to a new spot on a spinning globe?',
        'Picture the two halves of Earth that exist at any instant: one whole half faces the sun, and one whole half faces away from it. As the globe keeps turning, a location moves from one half into the other -- which half is it entering right before darkness falls?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-suns-apparent-path',
      kind: 'try_yourself',
      problem:
        'Earth spins from west to east. Which of these correctly describes the sun\'s apparent path across the sky, as seen by an observer in most of the Northern Hemisphere?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west, because Earth\'s spin carries the ground toward the east.', correct: true },
        { id: 'b', text: 'The sun appears to rise somewhere in the west, climb to its highest point toward the north around midday, and set somewhere in the east, because Earth actually spins from east to west rather than west to east.' },
        { id: 'c', text: 'The sun barely appears to move across the sky at all during the day; what actually changes is the tilt of the ground beneath the observer, as Earth rotates underneath a sun that stays nearly still.' },
        { id: 'd', text: 'The sun\'s path across the sky changes completely at random from one day to the next, because clouds and local weather decide where the sun appears rather than Earth\'s steady rotation.' },
      ],
      expectedAnswer: 'The sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west, because Earth\'s spin carries the ground toward the east.',
      hints: [
        'Work out which way Earth spins first -- west to east -- and then ask which direction that spin makes the sky appear to slide, from the point of view of someone standing on the ground.',
        'For most places in the Northern Hemisphere, picture facing the direction the sun rises from at the start of the day. If that fixed direction is east, which direction is toward the south, where the sun climbs highest around midday?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rotation-vs-daylight-split',
      kind: 'try_yourself',
      problem:
        'A student says, "Because Earth spins on its axis, every place on Earth must get exactly 12 hours of daylight and 12 hours of darkness, every day of the year." Which part of this claim is correct, and which part is not, according to the rotation model in this lesson?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The reasoning about the cause is correct, and so is the 12-and-12 split: Earth\'s rotation always shows exactly half of the globe to the sun at any instant, so every place gets a fixed 12 hours of daylight and 12 hours of darkness on every day of the year, at every latitude, since exactly half of a whole sphere is always in sunlight no matter which half you look at.' },
        { id: 'b', text: 'The cause is correct: rotation is why day and night happen, and the rotation rate stays the same all year, so a full cycle stays close to 24 hours at every latitude. The exact 12-and-12 split is not guaranteed everywhere, though -- away from the equator the split between daylight and darkness can shift over the year, and this lesson does not explain why.', correct: true },
        { id: 'c', text: 'Neither part is correct. Day and night are not caused by Earth\'s spin at all; they happen because the sun itself orbits Earth once every 24 hours and switches off while passing around to the far side, which is also why the 12-and-12 split cannot be trusted, since a light that switches off and on could just as easily follow some other schedule than exactly 12 and 12.' },
        { id: 'd', text: 'The 12-and-12 split is correct at every latitude, but the true cause has nothing to do with Earth turning: layers high in the atmosphere block exactly half of the sunlight from reaching the ground at all times, no matter where a location sits on Earth, the same way a tinted window blocks the same fraction of light regardless of the time of day.' },
      ],
      expectedAnswer: 'The cause is correct: rotation is why day and night happen, and the rotation rate stays the same all year, so a full cycle stays close to 24 hours at every latitude. The exact 12-and-12 split is not guaranteed everywhere, though -- away from the equator the split between daylight and darkness can shift over the year, and this lesson does not explain why.',
      hints: [
        'Break the student\'s claim into its two separate pieces: the part about WHY day and night happen at all, and the part about the exact 12-hours-and-12-hours split. A claim can be right about one piece and wrong about the other.',
        'Ask whether this lesson\'s model says Earth\'s rotation rate changes with the seasons. Then ask, separately, whether this lesson ever claimed that the split between daylight hours and dark hours stays exactly even everywhere, all year.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sun-orbits-and-distance',
      kind: 'misconception_check',
      question:
        'A student writes: "Night happens because the sun goes around to the far side of Earth once a day, and Earth is much farther from the sun at night than it is during the day." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Night happens because the sun goes around to the far side of Earth once a day.',
          misconception:
            'Keeping the everyday appearance -- the sun seems to circle around us -- as the real explanation, instead of recognizing that it is Earth doing the turning.',
          correctsTo:
            'Earth is the object that spins, once about every 24 hours, not the sun. The sun keeps lighting one whole side of Earth at a time; a location experiences night when Earth\'s rotation has carried that location onto the side facing away from the sun. There is a check that needs no equipment: observers all the way around the globe report the sun rising in the east and setting in the west, which matches a single spinning Earth far better than a sun that would somehow have to orbit every point on the globe at once.',
        },
        {
          answer: 'Earth is much farther from the sun at night than it is during the day.',
          misconception:
            'Assuming that darkness must mean the light source has moved farther away, the way a lamp across a room looks dimmer than one nearby.',
          correctsTo:
            'Earth\'s distance from the sun barely changes over the course of one rotation; the whole planet is close enough to the sun that every point on it is about the same distance from the sun at any given moment. What changes for a location is not distance but which side of the spinning Earth that location happens to be on -- the sunlit side or the shaded side. Distance does change a little over the course of a year as Earth orbits the sun, but that yearly change is a completely different topic from the daily spin covered in this lesson, and it is far too small to be what makes one hemisphere warmer than the other -- that comes from the tilt of Earth\'s axis, which is the next lesson\'s topic.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Earth spins on its axis; one full spin is called a rotation and takes about 24 hours.',
        'Sunlight lights exactly one half of Earth at any instant. Day and night happen because Earth\'s rotation carries every location through the lit half and the dark half once per rotation.',
        'Earth\'s axis is tilted about 23.5 degrees and keeps pointing the same direction in space as Earth spins, but that tilt does not change how long a rotation takes, and it does not explain seasons -- that is the next lesson.',
        'Earth spins from west to east, which makes the sun appear to move the opposite way, from east to west, across the sky. The sun itself is not moving around Earth.',
        'For most places in the Northern Hemisphere, the sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west.',
        'Earth\'s rotation rate does not change with the seasons, so a full day-night cycle stays close to 24 hours all year, at every latitude.',
        'How those roughly 24 hours split between daylight and darkness CAN shift over the year away from the equator, but this lesson does not explain why -- that is the next lesson, on revolution and the seasons.',
        'Rotation (about 24 hours) and revolution (about 365 and a quarter days, Earth\'s orbit around the sun) are two different motions. Do not mix them up.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Earth\'s Rotation: Day & Night' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
