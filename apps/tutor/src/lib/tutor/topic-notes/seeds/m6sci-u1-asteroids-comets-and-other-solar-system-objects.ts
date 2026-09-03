/**
 * Grade 6 Science — Unit 1 CED 1.4: Asteroids, Comets & Other Solar System Objects.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.asteroids-comets-and-other-solar-system-objects.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U1_ASTEROIDS_COMETS_AND_OTHER_SOLAR_SYSTEM_OBJECTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.asteroids-comets-and-other-solar-system-objects.v1',
  course: 'Grade 6 Science',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Asteroids, Comets & Other Solar System Objects',
  planId: 'evelyn.ms.m6sci.asteroids-comets-and-other-solar-system-objects.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.asteroids-comets-and-other-solar-system-objects.v1' }],
  theory: [
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', content: `ASTEROIDS are rocky, sometimes metallic, chunks of leftover material from the process that formed the sun and planets about 4.6 billion years ago. Most orbit the sun in the ASTEROID BELT, a wide region between the orbits of Mars and Jupiter, following a roughly steady path that stays about the same distance from the sun the whole way around. Asteroids are usually too small for their own gravity to pull them into a round shape, so most look lumpy and irregular rather than sphere-shaped.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', content: `COMETS are made mostly of ice, frozen gases, and dust -- often described as a "dirty snowball". Unlike an asteroid's roughly steady orbit, a comet follows a long, stretched-out orbit that carries it from far out in the outer solar system all the way in past Mars, sometimes closer to the sun than Earth is, and then back out again. As a comet nears the sun and warms up, some of its surface ice turns to gas, and that gas and dust stream away from it to form a glowing tail. The tail always points away from the sun, not backward along the direction the comet is traveling -- so on the outbound half of its orbit, moving away from the sun, a comet's tail actually stretches out in front of it.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', content: `DWARF PLANETS orbit the sun and are massive enough for their own gravity to pull them into a round shape, the way a true planet is round. What keeps a dwarf planet from counting as a full planet is that it has not cleared other objects out of its orbital neighborhood -- it shares its orbit with plenty of similar-sized debris nearby, while a planet's gravity has swept its own path mostly clear. Ceres, round and orbiting inside the asteroid belt, is a dwarf planet. So is Pluto, round and orbiting in the Kuiper Belt, and so is Eris, an even more distant round object also orbiting far beyond Neptune.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', content: `THE SAME OBJECT, THREE NAMES BY LOCATION -- METEOROID, METEOR, METEORITE. A small chunk of rock or metal drifting through space -- often a broken-off piece of an asteroid, or dust shed by a comet -- is called a meteoroid. If that fragment enters Earth's atmosphere and friction with the air heats it until it glows, the streak of light it produces is called a meteor -- sometimes called a "shooting star", though no star is involved at all. If a piece survives the trip through the atmosphere and reaches the ground, that surviving piece is called a meteorite. It is the same object the whole way through; only the name changes, and it changes because of WHERE the object is, not because the object has turned into something new. WRONG: "A meteor and a meteorite are two different kinds of space rock." CORRECT: "A meteor and a meteorite can be exactly the same rock, named differently because one is still burning in the sky and the other has already landed." Sources describe the middle stage slightly differently -- some call the object itself a meteor while it is glowing, others define a meteor more narrowly as just the streak of light the burning produces. Either way, the location rule for sorting the three names holds: space is meteoroid, atmosphere is meteor, ground is meteorite.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', content: `TWO BELTS, TWO LOCATIONS. In order outward from the sun: Mercury, Venus, Earth, Mars, then the ASTEROID BELT, then Jupiter, Saturn, Uranus, Neptune, then the KUIPER BELT far beyond Neptune's orbit. The asteroid belt is rocky and lies among the inner planets; the Kuiper Belt is icy and lies past the outer planets, which is part of why Kuiper Belt objects tend to be made of ice and dust rather than rock and metal.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'asteroid', content: `a rocky, sometimes metallic object orbiting the sun, usually too small for its own gravity to make it round, mostly found in the asteroid belt.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'asteroid belt', content: `the wide region between the orbits of Mars and Jupiter where most asteroids orbit.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'comet', content: `an object made of ice, frozen gases and dust that follows a long, stretched-out orbit and develops a glowing tail when it nears the sun.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'dwarf planet', content: `an object round enough from its own gravity to look like a small planet, but that has not cleared other objects out of its orbital neighborhood.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'meteoroid', content: `a small fragment of rock or metal traveling through space, before it reaches an atmosphere.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'meteor', content: `the streak of light produced when a meteoroid burns up from friction with the air after entering an atmosphere.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'meteorite', content: `a fragment of a meteoroid that survives its trip through the atmosphere and reaches the ground.` },
    { loId: 'm6sci.asteroids-comets-and-other-solar-system-objects', kind: 'definition', title: 'Kuiper Belt', content: 'a region of icy objects far beyond the orbit of Neptune.' },
  ],
  methods: [
    {
      title: 'Worked classify a comet',
      steps: [
        `Start with composition, because it sorts out two of the four categories immediately. Ice, frozen gases, and dust rule out an asteroid, which is rocky and often metallic, and they rule out a dwarf planet, whose defining feature is being round from its own gravity -- nothing here says the object is round.`,
        `Now check the orbit shape. A long, stretched-out orbit that swings from far beyond Neptune to inside the orbit of Mars is not a roughly steady, near-circular path -- that stretched, extreme-distance-swinging shape is exactly what sets a comet's orbit apart from an asteroid's.`,
        `Add the tail. A tail that forms as the object nears the sun and stretches away from the sun is a feature specific to comets -- the sun's heat is turning some of the object's surface ice into gas, and that gas and dust stream away from the nucleus.`,
        `Composition, orbit shape, and the tail all point the same way, so the object is a comet.`,
        `WRONG: "It has to be a dwarf planet, because it is a big object out past Neptune." CORRECT: "Being far out past Neptune only narrows down the neighborhood -- lots of very different objects orbit out there. What actually decides comet versus dwarf planet versus asteroid is composition, orbit shape, and whether the object is round, not distance from the sun alone."`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Composition says ice and dust, not rock or metal. Orbit shape says a long, stretched path with extreme distance changes, not a steady one. Behavior says a tail forms near the sun. Three different kinds of evidence, one answer. Second, change one thing about the setup and check that the answer moves the way it should: swap the composition to rock and metal and keep the same near-circular belt orbit, and the object becomes an asteroid instead -- the answer moves when the evidence moves.`,
      ],
      example: { problem: `An object is made of ice, frozen gases, and dust. It follows a long, stretched-out orbit that carries it from far out past Neptune all the way in past the orbit of Mars, then back out again over many years. As it passes close to the sun this time, a glowing tail forms and stretches away from it, pointing away from the sun. What kind of solar system object is this, and how do you know?`, solution: `A comet. Its icy composition, its long stretched-out orbit that swings from far beyond Neptune to inside Mars's orbit, and the tail that forms as it nears the sun all point to the same answer.` },
      relatedLoIds: ['m6sci.asteroids-comets-and-other-solar-system-objects'],
    },
    {
      title: 'Worked one fragment three names',
      steps: [
        `Stage one: out in space, before it reaches Earth's atmosphere at all. A small rock or metal fragment drifting through space is called a meteoroid. The name has nothing to do with what the fragment is made of, only that it is a small object out in space rather than a large body like an asteroid or a planet.`,
        `Stage two: entering Earth's atmosphere. Once the fragment hits the atmosphere and friction with the air heats it enough to glow, the streak of light it produces is called a meteor. This is the stage people mean by "shooting star," even though no star is involved at all.`,
        `Stage three: on the ground. If any piece of the fragment survives the trip through the atmosphere and is found afterward, that surviving piece is called a meteorite.`,
        `WRONG: "It is a meteor from the moment it leaves the asteroid belt until it lands in the field." CORRECT: "The object is the same rock fragment the whole time; only its name changes, and it changes with location -- space is meteoroid, atmosphere is meteor, ground is meteorite."`,
        `Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree: location (space, then air, then ground), the process happening to the object at each location (drifting, then burning, then landed), and the plain sequence of the story itself, told in order. Three different kinds of evidence, one three-stage answer. Second, change one thing and see that the answer moves: if the fragment burned up completely and no piece reached the ground, there would be no meteorite at all -- the object would only ever have been a meteoroid, then a meteor, and nothing more. Most meteoroids that enter an atmosphere burn up completely and never become a meteorite.`,
      ],
      example: { problem: `A pea-sized fragment of rock has been drifting alone through space for millions of years, likely a broken-off piece of a much larger asteroid. Tonight it enters Earth's atmosphere at high speed. Friction with the air heats it until it glows, producing a bright streak of light across the sky that a person on the ground points at and calls a "shooting star." A small piece of the fragment survives the trip through the atmosphere and is found the next morning lying in a field. Name what this one fragment is called at each of the three stages.`, solution: `Meteoroid while it drifts alone through space; meteor for the streak of light as it burns in Earth's atmosphere; meteorite for the surviving piece once it reaches the ground. It is the same fragment throughout -- only the name changes, based on location.` },
      relatedLoIds: ['m6sci.asteroids-comets-and-other-solar-system-objects'],
    },
  ],
  pointers: [
    { content: `Students often say "A shooting star is a star falling out of the sky." — A "shooting star" is not a star at all. It is the streak of light called a meteor, produced when a small rock or dust fragment -- a meteoroid -- enters Earth's atmosphere at high speed and burns up from friction with the air. Real stars are enormous and extremely far away; nothing that size is falling toward Earth.`, kind: 'common-error' },
    { content: `Students often say "Comets have tails because they are moving fast through space, like a trail behind a speeding car." — A comet's tail is not caused by its speed. As a comet's long, stretched-out orbit carries it close to the sun, heat from the sun turns some of its surface ice into gas, and that gas and dust stream away from the nucleus. The tail always points away from the sun, no matter which direction the comet itself is traveling -- so a comet moving away from the sun still has its tail out in front of it, not trailing behind.`, kind: 'common-error' },
    { content: `Asteroids are rocky, sometimes metallic, and mostly orbit the sun in the asteroid belt between Mars and Jupiter, in a roughly steady path.`, kind: 'tip' },
    { content: `Comets are made of ice, frozen gases and dust, and follow a long, stretched-out orbit that swings from far out in the solar system in toward the sun and back.`, kind: 'tip' },
    { content: `A comet's tail forms as sunlight warms its surface ice into gas, and the tail always points away from the sun -- not backward along the comet's direction of travel.`, kind: 'tip' },
    { content: `Dwarf planets are round from their own gravity, like a true planet, but have not cleared other objects out of their orbital neighborhood. Ceres orbits in the asteroid belt; Pluto and Eris orbit far beyond Neptune.`, kind: 'tip' },
    { content: `The Kuiper Belt is a region of icy objects far beyond Neptune's orbit.`, kind: 'tip' },
    { content: `The same small fragment has three names depending on location: meteoroid out in space, meteor as it burns in Earth's atmosphere, and meteorite if a piece survives to reach the ground.`, kind: 'tip' },
    { content: `Most of these objects are leftover material from the process that formed the sun and planets about 4.6 billion years ago.`, kind: 'tip' },
    { content: `Distance from the sun alone does not decide what kind of object something is -- composition, orbit shape, and whether the object is round all matter too.`, kind: 'tip' },
    { content: `Don't use distance from the sun to identify an object. A comet far beyond Neptune and a dwarf planet in the same region look completely different — check composition, orbit shape, and roundness instead.`, kind: 'common-error' },
    { content: `A comet's tail points away from the sun, not behind the comet. On the way out from the sun, the tail shoots forward — not backward like a car's dust trail.`, kind: 'gotcha' },
    { content: `Meteoroid → meteor → meteorite are the same rock, renamed by location. It's not three different types of space rock — location changes the name, not the object.`, kind: 'vocab-note' },
    { content: `Asteroids are lumpy and irregular, not round. Their gravity is too weak to squeeze them into spheres, so if it looks like a lumpy potato, it's probably an asteroid, not a dwarf planet.`, kind: 'tip' },
    { content: `A dwarf planet is not just a small planet — it's defined by two things: round from its own gravity AND has not cleared its orbit. Both conditions must be true.`, kind: 'vocab-note' },
    { content: `Most meteoroids burn up completely in the atmosphere. If a 'shooting star' doesn't leave a meteorite on the ground, it never became a meteorite at all — it stayed a meteoroid, then became a meteor, and that's it.`, kind: 'edge-case' },
    { content: `'Shooting star' is a common name, not a science name. It's a meteor — the name 'star' is just historical and misleading. Real stars don't fall.`, kind: 'vocab-note' },
    { content: `The asteroid belt is rocky; the Kuiper Belt is icy. Remember the order: asteroid belt is between Mars and Jupiter, Kuiper Belt is way past Neptune.`, kind: 'tip' },
  ],
};
