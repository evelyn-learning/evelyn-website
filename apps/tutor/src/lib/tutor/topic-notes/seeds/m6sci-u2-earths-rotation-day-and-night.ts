/**
 * Grade 6 Science — Unit 2 CED 2.1: Earth's Rotation: Day & Night.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.earths-rotation-day-and-night.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U2_EARTHS_ROTATION_DAY_AND_NIGHT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.earths-rotation-day-and-night.v1',
  course: 'Grade 6 Science',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: `Earth's Rotation: Day & Night`,
  planId: 'evelyn.ms.m6sci.earths-rotation-day-and-night.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.earths-rotation-day-and-night.v1' }],
  theory: [
    { loId: 'm6sci.earths-rotation-day-and-night', content: `ROTATION IS EARTH SPINNING, NOT ORBITING. Earth spins on its axis, an imaginary straight line running between the North Pole and the South Pole. One full spin is called a ROTATION, and it takes about 24 hours. This is a completely different motion from REVOLUTION, which is the much longer trip Earth makes orbiting the sun, taking about 365 and a quarter days. Earth completes roughly 365 rotations during one revolution. This lesson is about rotation only; revolution, and what it causes, is the next lesson.` },
    { loId: 'm6sci.earths-rotation-day-and-night', content: `WHY DAY AND NIGHT HAPPEN. At any instant, sunlight is lighting exactly one half of Earth -- call it the lit half -- and the other half is in darkness. As Earth rotates, every location on the surface gets carried through the lit half and then the dark half once per rotation, which is what turns day into night and night back into day. WRONG: "The sun moves around Earth once a day, and night falls when the sun swings around to the far side." CORRECT: "Earth is the one spinning. A location experiences night when Earth's rotation has carried that location onto the side facing away from the sun, not because the sun has gone anywhere."` },
    { loId: 'm6sci.earths-rotation-day-and-night', content: `EARTH SPINS ON A TILTED AXIS. Earth's axis is not straight up and down relative to its path around the sun -- it leans about 23.5 degrees away from that straight-up position, and it keeps pointing in the same direction in space as Earth spins and as Earth orbits. That tilt is a real, fixed feature of the spinning Earth, but nothing in this lesson uses it to explain anything: it does not change the fact that exactly half of Earth is lit at any moment, and it does not change how long one rotation takes. What the tilt does over the course of a year is the subject of the next lesson.` },
    { loId: 'm6sci.earths-rotation-day-and-night', content: `THE SUN'S APPARENT PATH ACROSS THE SKY. Earth spins from west to east -- viewed from high above the North Pole, the spin looks counterclockwise. That spin carries the ground, and everyone standing on it, toward the east, which makes the sun appear to slide the opposite way, from east to west, across the sky. For most places in the Northern Hemisphere, that means the sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west. The sun itself is not moving around Earth; the appearance of motion belongs to Earth's spin, the same way spinning in a desk chair makes the room outside look like it is turning, even though the room has not moved.` },
    { loId: 'm6sci.earths-rotation-day-and-night', content: `THE ROTATION PERIOD BARELY CHANGES ACROSS THE YEAR. Earth's spin rate does not speed up or slow down with the seasons, so a full rotation -- and with it, one full day-night cycle -- stays close to about 24 hours all year long, at every latitude on Earth. What CAN shift across the year, at latitudes away from the equator, is how those roughly 24 hours are split between daylight hours and dark hours. This lesson does not explain why that split shifts; that explanation belongs to the next lesson, on Earth's revolution and the seasons.` },
    { loId: 'm6sci.earths-rotation-day-and-night', kind: 'definition', title: 'rotation', content: 'a spin on an axis; Earth completes one full rotation about every 24 hours.' },
    { loId: 'm6sci.earths-rotation-day-and-night', kind: 'definition', title: 'axis', content: `the imaginary straight line an object spins around; Earth's axis runs between the North Pole and the South Pole and is tilted about 23.5 degrees from the line perpendicular to Earth's orbital path.` },
    { loId: 'm6sci.earths-rotation-day-and-night', kind: 'definition', title: 'revolution', content: `one full trip a body makes orbiting around another body; Earth's revolution around the sun takes about 365 and a quarter days, which is the length of time the next lesson covers, not this one.` },
    { loId: 'm6sci.earths-rotation-day-and-night', kind: 'definition', title: 'latitude', content: `a location's position measured in degrees north or south of the equator.` },
    { loId: 'm6sci.earths-rotation-day-and-night', kind: 'definition', title: 'apparent motion', content: `movement that appears to happen from an observer's point of view, even when the real motion belongs to something else -- the sun's crossing of the sky is Earth's rotation seen from the ground, not the sun actually circling Earth.` },
  ],
  methods: [
    {
      title: 'Worked why day and night',
      steps: [
        `Earth is the object that is turning, not the sun. Picture Earth as a ball lit by sunlight on exactly one side at a time; the lit side is having daytime, and the far side is having night.`,
        `Earth spins on its axis from west to east -- if you looked down at the North Pole from high above, Earth would appear to turn counterclockwise.`,
        `Because Earth turns toward the east, a person standing on the ground is carried toward the east too, into the region the sunlight has not yet reached from the region it has -- this is what makes the sun APPEAR to rise from the eastern horizon, even though the sun itself has not moved. Turn your whole body to the left while standing still in a room, and the room appears to slide to the right around you, past your outstretched hand, even though the room has not moved. The sun's apparent path works the same way, on a planetary scale.`,
        `As the spin continues, that same carrying motion moves the person's location further around, so the sun appears to climb higher, shift toward the south for most places in the Northern Hemisphere, reach its highest point around midday, and then appear to descend and set somewhere in the west.`,
        `WRONG: "The sun moves around Earth once a day, from east to west, which is why it rises and sets." CORRECT: "Earth spins once about every 24 hours, from west to east, and it is this spin -- not any real motion of the sun -- that makes the sun appear to cross the sky from east to west."`,
        `Now run the two checks a science answer needs, because there is no arithmetic in this one to redo. First, look for clues of DIFFERENT KINDS that agree. Directional evidence: observers all the way around the globe report the sun rising in the east and setting in the west, which matches one consistent spin direction rather than the sun wandering on its own. An everyday analogy: turning in place makes the room appear to spin the other way around you, even though the room has not moved -- the same relationship holds between a spinning Earth and an apparently moving sun. Timing evidence: the sun returns to about the same position in the sky roughly every 24 hours, matching Earth's known rotation period rather than some unrelated number. Second, change one thing and check that the answer moves with it: if Earth spun the opposite way, from east to west, the sun would appear to rise in the west and set in the east. Flip the spin direction, and the apparent direction of the sun's motion flips with it, which is exactly what a real explanation should do.`,
      ],
      example: { problem: `A classmate says the sun moves around Earth once a day, which is why it rises in the east and sets in the west. Using the rotation model, explain what is actually happening, and describe where in the sky a person in most of the Northern Hemisphere should expect to see the sun around midday.`, solution: `Earth is the one spinning, from west to east, about once every 24 hours. That spin makes the sun appear to move the opposite way across the sky: rising somewhere in the east, climbing to its highest point toward the south around midday for most places in the Northern Hemisphere, and setting somewhere in the west. The sun itself is not orbiting Earth.` },
      relatedLoIds: ['m6sci.earths-rotation-day-and-night'],
    },
    {
      title: 'Worked degrees per hour',
      steps: [
        `Find the rotation rate first. Earth completes one full turn, 360 degrees, in about 24 hours, so the rate is 360 divided by 24, which equals 15 degrees of rotation for every hour that passes.`,
        `Next, settle the direction. Earth spins from west to east -- viewed from high above the North Pole, the spin looks counterclockwise. Because of that direction, a location farther EAST reaches the boundary between night and day, the sunrise line, sooner than a location farther west on the same rotating Earth.`,
        `Location B is east of Location A, so apply the direction rule: Location B's sunrise happens first.`,
        `Now use the rate to find the size of the gap. The two locations are 90 degrees of longitude apart, and the rotation rate is 15 degrees per hour, so the time gap is 90 divided by 15, which equals 6 hours.`,
        `WRONG: "It does not matter which location is east or west, only how far apart the two are, so the gap is 6 hours either way." CORRECT: "Because Earth spins west to east, the EASTERN location's sunrise always comes first out of the two. Direction decides WHICH location leads; the 90-degree gap and the 15-degrees-per-hour rate only decide BY HOW MUCH."`,
        `Verify with three different kinds of clues. Rate check: 15 degrees per hour times 24 hours equals 360 degrees, exactly one full rotation, so the rate is self-consistent. Direction check: real observers report that places to the east see sunrise earlier than places to the west on the same rotating Earth, which matches this model's prediction rather than the reverse. Reversed-arithmetic check: 90 divided by 15 gives 6, and 15 times 6 gives back 90, so the numbers agree working in either direction. Contrasting case: if the two locations had been 45 degrees apart instead of 90, the gap would shrink to 45 divided by 15, which equals 3 hours -- change the input, and the answer moves with it, which is what a real rate does and a memorized single number does not.`,
      ],
      example: { problem: `Location A and Location B sit on the same rotating Earth, along lines of longitude that are 90 degrees apart, with Location B to the east of Location A. Using Earth's rotation rate, figure out which location's sunrise happens first, and about how many hours apart the two sunrises are.`, solution: `Location B's sunrise happens first, because it is farther east on a planet that spins west to east. The two sunrises are about 90 divided by 15, which equals 6 hours apart.` },
      relatedLoIds: ['m6sci.earths-rotation-day-and-night'],
    },
  ],
  pointers: [
    { content: `Students often say "Night happens because the sun goes around to the far side of Earth once a day." — Earth is the object that spins, once about every 24 hours, not the sun. The sun keeps lighting one whole side of Earth at a time; a location experiences night when Earth's rotation has carried that location onto the side facing away from the sun. There is a check that needs no equipment: observers all the way around the globe report the sun rising in the east and setting in the west, which matches a single spinning Earth far better than a sun that would somehow have to orbit every point on the globe at once.`, kind: 'common-error' },
    { content: `Students often say "Earth is much farther from the sun at night than it is during the day." — Earth's distance from the sun barely changes over the course of one rotation; the whole planet is close enough to the sun that every point on it is about the same distance from the sun at any given moment. What changes for a location is not distance but which side of the spinning Earth that location happens to be on -- the sunlit side or the shaded side. Distance does change a little over the course of a year as Earth orbits the sun, but that yearly change is a completely different topic from the daily spin covered in this lesson, and it is far too small to be what makes one hemisphere warmer than the other -- that comes from the tilt of Earth's axis, which is the next lesson's topic.`, kind: 'common-error' },
    { content: `Earth spins on its axis; one full spin is called a rotation and takes about 24 hours.`, kind: 'tip' },
    { content: `Sunlight lights exactly one half of Earth at any instant. Day and night happen because Earth's rotation carries every location through the lit half and the dark half once per rotation.`, kind: 'tip' },
    { content: `Earth's axis is tilted about 23.5 degrees and keeps pointing the same direction in space as Earth spins, but that tilt does not change how long a rotation takes, and it does not explain seasons -- that is the next lesson.`, kind: 'tip' },
    { content: `Earth spins from west to east, which makes the sun appear to move the opposite way, from east to west, across the sky. The sun itself is not moving around Earth.`, kind: 'tip' },
    { content: `For most places in the Northern Hemisphere, the sun appears to rise somewhere in the east, climb to its highest point toward the south around midday, and set somewhere in the west.`, kind: 'tip' },
    { content: `Earth's rotation rate does not change with the seasons, so a full day-night cycle stays close to 24 hours all year, at every latitude.`, kind: 'tip' },
    { content: `How those roughly 24 hours split between daylight and darkness CAN shift over the year away from the equator, but this lesson does not explain why -- that is the next lesson, on revolution and the seasons.`, kind: 'tip' },
    { content: `Rotation (about 24 hours) and revolution (about 365 and a quarter days, Earth's orbit around the sun) are two different motions. Do not mix them up.`, kind: 'tip' },
    { content: `Don't say "the sun moves around Earth." Say "Earth spins, and this makes the sun APPEAR to move." The sun itself stays still; Earth's rotation creates the illusion.`, kind: 'vocab-note' },
    { content: `Rotation and revolution are two completely different motions. Rotation = Earth spinning (24 hours). Revolution = Earth orbiting the sun (365 days). Don't mix them up when explaining day/night.`, kind: 'common-error' },
    { content: `The tilt of Earth's axis exists, but it does NOT explain why day and night happen. It also does NOT guarantee 12 hours of daylight everywhere, every day. The tilt matters for the next lesson (seasons), not this one.`, kind: 'gotcha' },
    { content: `Earth's distance from the sun barely changes during one day. Night is NOT because Earth is farther away from the sun—it's because your location is on the dark side of the spinning Earth.`, kind: 'common-error' },
    { content: `Exactly half of Earth is lit by the sun at any instant. This does not change because of Earth's tilt. The tilt does not create more darkness or make one half bigger—it just leans.`, kind: 'edge-case' },
    { content: `Earth spins west to east. This means a place farther EAST sees sunrise FIRST. If you see this backwards, flip your picture of the spinning Earth and re-check the direction.`, kind: 'tip' },
    { content: `"About 24 hours" is the rotation period EVERYWHERE on Earth, every day of the year. It does not change with the seasons. What CAN change is how daylight and darkness split those 24 hours—but that is next lesson's topic.`, kind: 'vocab-note' },
  ],
};
