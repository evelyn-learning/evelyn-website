/**
 * Grade 6 Science — Unit 1 CED 1.3: Gravity & Orbital Motion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.gravity-and-orbital-motion.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U1_GRAVITY_AND_ORBITAL_MOTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.gravity-and-orbital-motion.v1',
  course: 'Grade 6 Science',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Gravity & Orbital Motion',
  planId: 'evelyn.ms.m6sci.gravity-and-orbital-motion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.gravity-and-orbital-motion.v1' }],
  theory: [
    { loId: 'm6sci.gravity-and-orbital-motion', content: `GRAVITY IS A PULL BETWEEN ANY TWO THINGS WITH MASS. Every object that has mass pulls on every other object that has mass, pulling them toward each other. You and a nearby friend pull on each other a little, though far too weakly to ever notice. The sun has an enormous amount of mass, so its pull is enormous too -- strong enough to reach all the way across the solar system and hold every planet in orbit around it.` },
    { loId: 'm6sci.gravity-and-orbital-motion', content: `TWO THINGS CHANGE HOW STRONG THE PULL IS: MASS AND DISTANCE. A more massive object pulls more strongly than a less massive one. And for any two given objects, the pull grows weaker the farther apart they are. Both of these are directions, not numbers -- this lesson never turns "stronger" or "weaker" into a calculation.` },
    { loId: 'm6sci.gravity-and-orbital-motion', content: `WITHOUT GRAVITY, AN ORBITING OBJECT WOULD JUST FLY OFF IN A STRAIGHT LINE. Every planet, moon, and satellite is already moving through space. If nothing were pulling on it, it would keep moving in that same straight line forever, exactly like a rock flying off straight once you let go of the string you were swinging it on. Nothing in the solar system does that, because gravity is always pulling.` },
    { loId: 'm6sci.gravity-and-orbital-motion', content: `AN ORBIT IS FALLING WHILE MOVING SIDEWAYS FAST ENOUGH TO KEEP MISSING. Gravity's pull continuously bends an orbiting object's path toward the central body. But the object is also moving sideways, and if that sideways motion is fast enough, the object keeps getting pulled toward the central body and also keeps missing it, over and over, tracing a curve that wraps all the way around. That combination -- constantly falling, constantly missing -- is what an orbit is.` },
    { loId: 'm6sci.gravity-and-orbital-motion', content: `THE SAME PICTURE EXPLAINS THREE DIFFERENT KINDS OF ORBIT. A planet orbits the sun. A moon orbits a planet. A human-made satellite orbits Earth. In every one of these, the pattern is identical: gravity pulls the smaller object toward the central body, the smaller object is also moving sideways, and the result is a curved path around the central body rather than a crash into it or a drift away from it. Only the central body and the orbiting object change from one case to the next.` },
    { loId: 'm6sci.gravity-and-orbital-motion', content: `GRAVITY DOES NOT SWITCH OFF IN SPACE. An astronaut orbiting Earth is not floating because gravity has stopped -- Earth's gravity is still pulling on the astronaut and on the spacecraft, the whole time, which is exactly what keeps the spacecraft in orbit instead of flying off straight. The astronaut floats relative to the inside of the spacecraft because the astronaut and the spacecraft are falling toward Earth together, at the same rate, the way a dropped phone would seem to hang in the air right next to you inside an elevator that was falling freely. The elevator is not really in orbit, but the falling-together idea is the same one.` },
    { loId: 'm6sci.gravity-and-orbital-motion', kind: 'definition', title: 'gravity', content: `a pull that every object with mass exerts on every other object with mass, pulling them toward each other.` },
    { loId: 'm6sci.gravity-and-orbital-motion', kind: 'definition', title: 'mass', content: `the amount of matter in an object; an object with more mass produces a stronger gravitational pull.` },
    { loId: 'm6sci.gravity-and-orbital-motion', kind: 'definition', title: 'orbit', content: `the repeating curved path a smaller object follows around a larger object, kept curving by the larger object's constant gravitational pull.` },
    { loId: 'm6sci.gravity-and-orbital-motion', kind: 'definition', title: 'satellite', content: `any object that orbits a larger object; the Moon is a natural satellite of Earth, and a spacecraft launched around Earth is an artificial satellite.` },
    { loId: 'm6sci.gravity-and-orbital-motion', kind: 'definition', title: 'free fall', content: `moving under the pull of gravity alone, with nothing pushing back or holding the object up; an orbiting spacecraft and everything inside it are in free fall together.` },
  ],
  methods: [
    {
      title: 'Worked ball and satellite',
      steps: [
        `Start with what is the same for both objects: gravity is pulling on each of them, toward Earth's center, for the whole time they are moving. Gravity does not switch off for either one.`,
        `Now find what is different: how much sideways speed each object has when gravity starts acting on it. The ball rolling off the table has very little sideways speed, so gravity pulls it down to the floor almost immediately, close to the table.`,
        `The satellite is launched with an enormous sideways speed. Gravity pulls it toward Earth's center the entire time, curving its path downward -- but Earth's surface curves away beneath the satellite at about the same rate the satellite is falling toward it. So the satellite keeps falling toward Earth and also keeps missing it, and its path curves all the way around the planet instead of ending at the ground.`,
        `Notice that gravity is doing the identical job in both cases -- pulling the object toward Earth's center. What decides whether the path ends nearby or wraps around the whole planet is only the sideways speed, not any difference in gravity itself.`,
        `Run three different kinds of check, since there is no arithmetic to redo here. Observation: real satellites stay in orbit for months or years without an engine firing to push them along, which fits gravity alone providing the pull that curves the path -- nothing needs to keep shoving the satellite sideways. Everyday comparison: the ball is really the same situation with almost no sideways speed, which is why it behaves like the small-scale version of the exact same idea. Internal consistency: one single rule -- pulled toward the center, moving sideways -- explains both the ball landing close by and the satellite orbiting for years, without needing a separate explanation for each.`,
        `Now change one condition and check that the answer moves with it. If the satellite were moving too slowly sideways for its height above Earth, gravity would pull it down to the ground quickly, the same way it pulls the ball down -- the difference between "orbits Earth" and "falls to Earth" is exactly this sideways speed, not a difference in what gravity is doing.`,
      ],
      example: { problem: `A ball rolls off the edge of a table and curves quickly down to the floor, landing just a step away. A satellite launched from a rocket is also pulled by Earth's gravity the entire time it moves, and yet instead of quickly hitting the ground, it circles Earth again and again for years. Explain why one lands close by almost immediately and the other keeps going around Earth without ever landing.`, solution: `Gravity pulls on both the ball and the satellite the whole time. The ball has very little sideways speed, so gravity pulls it to the ground almost immediately. The satellite has an enormous sideways speed, so gravity keeps curving its path around Earth instead of down to the ground -- it keeps falling toward Earth and also keeps moving sideways fast enough to keep missing it, which is what an orbit is.` },
      relatedLoIds: ['m6sci.gravity-and-orbital-motion'],
    },
    {
      title: 'Worked mass and distance',
      steps: [
        `Handle the first comparison. The two satellites have the same mass, so mass cannot be the reason one feels a stronger pull than the other -- distance is the only thing that is different. The rule for distance: gravity's pull grows weaker the farther apart two objects are. Satellite A is closer to Earth than Satellite B, so Satellite A feels the stronger pull.`,
        `Handle the second comparison. Here the distance is held exactly the same by the setup, so distance cannot be the reason one moon feels a stronger pull -- mass is the only thing that is different. The rule for mass: a more massive object pulls more strongly. Jupiter is a gas giant and is far more massive than Mars, a terrestrial planet, so the moon orbiting Jupiter feels the stronger pull.`,
        `Notice why each comparison changed only ONE thing at a time. Gravity's pull depends on both mass and distance together, and two real objects in the solar system usually differ in both at once, so you often cannot say which pull is stronger without the actual numbers -- which this lesson never calculates. Holding one factor fixed is what lets you reason about the other factor on its own.`,
        `Run three different kinds of check. Real-world example: the sun's gravity is strong enough to hold Neptune in orbit even though Neptune is extremely far away, because the sun's mass is enormous -- the same "more mass, stronger pull" rule used above. Everyday comparison: you do not feel pulled toward a friend standing near you, because a person's mass is far too small for the pull to be noticeable, but you do feel Earth's pull under your feet every second, because Earth's mass is enormous -- showing mass matters here in exactly the same direction it did for the planets and moons. Internal consistency: the same two rules -- closer is stronger, more massive is stronger -- correctly explain both comparisons above without needing a different explanation for each.`,
        `Now change one condition and check that the answer moves with it. If Satellite B were moved in to the exact same distance as Satellite A, the two would feel an identical pull, because their masses are equal and now their distances are equal too -- change the condition, and the earlier answer changes with it.`,
      ],
      example: { problem: `Two separate comparisons. First: Satellite A orbits close to Earth, and Satellite B has the same mass as Satellite A but orbits much farther out. Which satellite feels the stronger pull of Earth's gravity? Second: a moon orbits Jupiter at a certain distance, and an identical moon orbits Mars at that exact same distance. Which moon feels the stronger gravitational pull from its planet?`, solution: `Satellite A feels the stronger pull, because it is closer to Earth and a closer object feels a stronger gravitational pull. The moon orbiting Jupiter feels the stronger pull, because Jupiter is far more massive than Mars and a more massive object pulls more strongly at the same distance.` },
      relatedLoIds: ['m6sci.gravity-and-orbital-motion'],
    },
  ],
  pointers: [
    { content: `Students often say "There is no gravity in space." — Gravity does not switch off in space. It is what is pulling on the astronaut, the spacecraft, and the Moon right now, everywhere in the solar system. An astronaut floats inside a spacecraft not because gravity has stopped, but because the astronaut and the spacecraft are falling toward Earth together, at the same rate, so nothing pushes the astronaut toward the floor.`, kind: 'common-error' },
    { content: `Students often say "That is also why the Moon does not just fall down and crash into Earth." — The Moon is falling toward Earth the entire time -- gravity never stops pulling on it. But the Moon is also moving sideways fast enough that it keeps missing Earth instead of hitting it. Constantly falling and constantly missing, together, is exactly what an orbit is, and it is why the Moon has kept the same kind of path for billions of years instead of crashing in or drifting away.`, kind: 'common-error' },
    { content: `Gravity is a pull that every object with mass exerts on every other object with mass, and it never switches off in space.`, kind: 'tip' },
    { content: `A more massive object pulls more strongly, and two objects pull on each other more weakly the farther apart they are.`, kind: 'tip' },
    { content: `Without gravity, a planet, moon, or satellite would simply keep moving in a straight line forever.`, kind: 'tip' },
    { content: `An orbit is gravity constantly pulling an object toward a central body while the object moves sideways fast enough to keep missing it.`, kind: 'tip' },
    { content: `The same picture explains a planet orbiting the sun, a moon orbiting a planet, and a satellite orbiting Earth -- only the central body and the orbiting object change.`, kind: 'tip' },
    { content: `An astronaut floats in orbit because the astronaut and the spacecraft are falling toward Earth together at the same rate, not because gravity has stopped.`, kind: 'tip' },
    { content: `Don't say "there's no gravity in space." Gravity never switches off. Astronauts float because they and the spacecraft fall toward Earth together at the same rate — not because gravity stopped pulling.`, kind: 'common-error' },
    { content: `Always mention SIDEWAYS SPEED when you explain why a satellite orbits instead of crashing down. Gravity pulls it toward Earth the whole time — but if sideways speed is fast enough, it keeps missing.`, kind: 'tip' },
    { content: `When comparing gravity's pull between two objects, change only ONE thing at a time (either mass OR distance). If both differ, you usually can't say which pull is stronger without doing math.`, kind: 'tip' },
    { content: `Gravity pulls the pen AND the astronaut AND the spacecraft all together at the same rate. That's why the pen floats next to her — not because gravity isn't there.`, kind: 'vocab-note' },
    { content: `A satellite is NOT held up by gravity like you're held up by the floor. It's constantly falling and constantly missing — that's the orbit. Gravity never stops pulling downward.`, kind: 'gotcha' },
    { content: `Closer = stronger pull. Farther = weaker pull. Say it both ways to lock it in when comparing two objects at different distances.`, kind: 'vocab-note' },
    { content: `A ball rolling off the table and a satellite orbiting Earth ARE THE SAME SITUATION — just different sideways speeds. Gravity works the same way on both.`, kind: 'tip' },
    { content: `Don't confuse 'gravity pulls on object A' with 'gravity is what keeps object A in orbit.' Gravity alone does the pulling — the orbit depends on how fast sideways the object is already moving.`, kind: 'common-error' },
  ],
};
