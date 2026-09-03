/**
 * Grade 6 Science — Unit 1 CED 1.2: Classifying the Planets.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6sci.classifying-the-planets.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6SCI_U1_CLASSIFYING_THE_PLANETS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6sci.classifying-the-planets.v1',
  course: 'Grade 6 Science',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Classifying the Planets',
  planId: 'evelyn.ms.m6sci.classifying-the-planets.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6sci.classifying-the-planets.v1' }],
  theory: [
    { loId: 'm6sci.classifying-the-planets', content: `TWO GROUPS, SORTED BY WHAT YOU CAN OBSERVE. The eight planets sort into two groups: TERRESTRIAL planets and GAS/ICE GIANT planets. You sort a planet by checking what it is made of, whether it has a solid surface, how big it is, whether it has rings, and where it sits compared with the asteroid belt. This lesson only sorts by those properties. It does not explain why a planet ends up with them -- that is a question for a later grade.` },
    { loId: 'm6sci.classifying-the-planets', content: `THE FOUR TERRESTRIAL PLANETS -- Mercury, Venus, Earth and Mars. They are small, made mostly of rock and metal, and have a solid surface a spacecraft could land on. They orbit close to the sun, before the asteroid belt. None of them has a ring system, and each one has no moon or only a small number of moons.` },
    { loId: 'm6sci.classifying-the-planets', content: `THE FOUR GIANT PLANETS -- Jupiter, Saturn, Uranus and Neptune. They are much larger than any terrestrial planet, made mostly of gas and ice, and have no solid surface anywhere -- there is no ground to land on, even deep inside one. They orbit far beyond the asteroid belt, and every one of them has a ring system, though only Saturn's is bright enough to be easy to see. Each one has many more moons than any terrestrial planet.` },
    { loId: 'm6sci.classifying-the-planets', content: `THE ASTEROID BELT MARKS THE SPLIT. In order outward from the sun the planets run: Mercury, Venus, Earth, Mars, then the asteroid belt, then Jupiter, Saturn, Uranus, Neptune. Every planet on the inner side of that belt is terrestrial, and every planet on the outer side is a giant. You do not need an exact distance in kilometers to use this -- knowing which side of the asteroid belt a planet is on is enough to sort it by position. That pattern is worth noticing, and it is a fact you can use; it is not something this lesson explains.` },
    { loId: 'm6sci.classifying-the-planets', content: `THE TRAP -- SIZE ALONE IS NOT THE SORT. A planet is not a giant just because it happens to be large, and it is not terrestrial just because it happens to be small. WRONG: "It is a giant because it is the biggest kind of planet." CORRECT: "A planet only counts as a giant if it is also made mostly of gas or ice and has no solid surface -- being large is part of the pattern, not the whole rule." Composition and surface are what actually decide the group; size, position and rings line up with that split, but they do not replace it.` },
    { loId: 'm6sci.classifying-the-planets', kind: 'definition', title: 'terrestrial planet', content: `a planet that is small, made mostly of rock and metal, and has a solid surface a spacecraft could land on.` },
    { loId: 'm6sci.classifying-the-planets', kind: 'definition', title: 'gas/ice giant', content: `a planet that is much larger than a terrestrial planet, made mostly of gas and ice, and has no solid surface anywhere.` },
    { loId: 'm6sci.classifying-the-planets', kind: 'definition', title: 'asteroid belt', content: `the region of the solar system that marks where the four terrestrial planets end and the four giant planets begin.` },
    { loId: 'm6sci.classifying-the-planets', kind: 'definition', title: 'ring system', content: `a flat disk of orbiting material circling a planet; all four giant planets have one, though only Saturn's is bright enough to see easily.` },
    { loId: 'm6sci.classifying-the-planets', kind: 'definition', title: 'dwarf planet', content: `an object that orbits the sun but is not counted among the eight planets, such as Pluto.` },
  ],
  methods: [
    {
      title: 'Worked sort a terrestrial',
      steps: [
        `List what the report actually says: small, rock and metal, solid surface, no rings, orbits before the asteroid belt. Five separate observed properties.`,
        `Compare those properties with the terrestrial pattern. Mercury, Venus, Earth and Mars are all small, made mostly of rock and metal, have a solid surface, have no ring system, and orbit before the asteroid belt. Every property in the report matches.`,
        `Check the giant pattern too, to be sure it does not also fit. Giant planets are much larger, made mostly of gas and ice, have no solid surface, commonly show a ring system, and orbit beyond the asteroid belt. None of that matches the report.`,
        `WRONG: "It might still turn out to be a giant, since we do not know exactly how far it is from the sun in kilometers." CORRECT: "The report already places it before the asteroid belt, and that -- together with its rocky, solid-surfaced, small, ringless description -- is enough to sort it. No distance measurement is needed."`,
        'Conclusion: the planet is terrestrial.',
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. Composition says rock and metal. Structure says a solid surface. Position says before the asteroid belt. Three different kinds of evidence, one answer. Second, change one thing about the report and check that the answer moves the way it should: if the report instead described a planet much larger than Earth, made mostly of gas, with no solid surface and a ring system, every one of those three clues would flip at once, and the sorting would flip to giant.`,
      ],
      example: { problem: `A newly described planet is reported to be small, made mostly of rock and metal, to have a solid surface, no ring system, and to orbit closer to the sun than the asteroid belt. Sort it into a group.`, solution: `Terrestrial. The planet is small, rocky, solid-surfaced, ringless and orbits before the asteroid belt, which matches Mercury, Venus, Earth and Mars and matches none of the giant-planet properties.` },
      relatedLoIds: ['m6sci.classifying-the-planets'],
    },
    {
      title: 'Worked sort a giant',
      steps: [
        `List the report: no solid surface, much larger than the inner planets, a faint ring system, orbits beyond the asteroid belt.`,
        `Compare with the giant pattern. Jupiter, Saturn, Uranus and Neptune are all much larger than the inner planets, are made mostly of gas and ice with no solid surface anywhere, orbit beyond the asteroid belt, and every one of them has a ring system. All four properties match.`,
        `Check the terrestrial pattern to rule it out. Terrestrial planets are small, have a solid surface, orbit before the asteroid belt, and have no ring system. None of that matches.`,
        'Conclusion so far: this is a giant planet.',
        `WRONG: "It must be Saturn, since Saturn is the planet everyone pictures with rings." CORRECT: "All four giant planets have ring systems, so a ring alone never points to Saturn specifically -- and a FAINT ring actually points away from Saturn, since Saturn's rings are the brightest and easiest to see of the four."`,
        `So the report narrows the answer to Jupiter, Uranus or Neptune -- the three giants whose rings are not the bright, easy-to-see kind -- and rules out Saturn specifically, even though all four are giants.`,
        `Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree, at the group level: composition says gas and ice with no solid surface, size says much larger than the inner planets, position says beyond the asteroid belt. Three different kinds of evidence, one group. Second, change one thing and check that the answer moves the way it should: if the report instead said the rings were the brightest and easiest to see of any planet, that single detail would point specifically to Saturn, while the other three clues would still only tell you giant, not which one. The group answer holds steady while the specific-planet answer moves, which shows the ring-brightness clue is doing separate work from the other three.`,
      ],
      example: { problem: `A second planet is reported to have no solid surface anywhere, to be much larger than any of the four inner planets, to have a ring system too faint to see without a telescope, and to orbit far beyond the asteroid belt. Sort it into a group, and say which planets it could be.`, solution: `A giant planet -- specifically Jupiter, Uranus or Neptune, since the ring system described is faint and Saturn's rings are the brightest and easiest to see of the four.` },
      relatedLoIds: ['m6sci.classifying-the-planets'],
    },
  ],
  pointers: [
    { content: `Students often say "The giant planets are just bigger, rockier versions of Earth." — The four giant planets -- Jupiter, Saturn, Uranus and Neptune -- are made mostly of gas and ice, not rock, and none of them has a solid surface a spacecraft could land on, even deep inside. Being much larger than Earth does not make a planet more like Earth; it puts it in a different group, sorted by what it is made of and where it orbits, not by size alone.`, kind: 'common-error' },
    { content: `Students often say "Only Saturn has rings around it." — All four giant planets have ring systems. Saturn's rings are simply the widest and brightest, which is why photographs of Saturn are what most people picture when they hear the word rings. Jupiter, Uranus and Neptune all have ring systems too, just fainter ones.`, kind: 'common-error' },
    { content: 'The eight planets sort into two groups: terrestrial and gas/ice giant.', kind: 'tip' },
    { content: `Terrestrial: Mercury, Venus, Earth, Mars -- small, rocky, solid surface, no rings, orbit before the asteroid belt.`, kind: 'tip' },
    { content: `Gas/ice giant: Jupiter, Saturn, Uranus, Neptune -- much larger, made of gas and ice, no solid surface anywhere, orbit beyond the asteroid belt.`, kind: 'tip' },
    { content: `All four giant planets have ring systems. Saturn's are simply the brightest and easiest to see.`, kind: 'tip' },
    { content: `Size alone does not decide the group. A planet counts as a giant only if it is also made mostly of gas or ice with no solid surface.`, kind: 'tip' },
    { content: `This lesson sorts planets by what can be observed about them, not by why they ended up that way.`, kind: 'tip' },
    { content: 'Pluto is a dwarf planet, not one of the eight planets sorted here.', kind: 'tip' },
    { content: `No exact distance in kilometers is needed to sort a planet -- its position relative to the asteroid belt is enough.`, kind: 'tip' },
    { content: `Don't say a planet is a giant just because it's big. A giant must ALSO be made of gas/ice AND have no solid surface. Size is part of the pattern, not the whole rule.`, kind: 'common-error' },
    { content: `All four giant planets have rings — Jupiter, Saturn, Uranus, and Neptune. Saturn's are just the brightest and easiest to see from Earth. Don't assume a faint ring system means Saturn.`, kind: 'gotcha' },
    { content: `To sort a planet, you need to check MULTIPLE properties — composition, surface, size, rings, and position relative to the asteroid belt. One clue alone is not enough.`, kind: 'tip' },
    { content: `The asteroid belt location matters more than exact distance in kilometers. If a planet orbits before the belt, it's terrestrial; beyond the belt, it's a giant — no calculator needed.`, kind: 'vocab-note' },
    { content: `Pluto is NOT one of the eight planets — it's a dwarf planet, so don't try to sort it into either group. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.`, kind: 'edge-case' },
    { content: `Giant planets have no solid surface 'anywhere' — not even deep inside. You cannot land on them. Terrestrial planets have a solid surface you could actually touch.`, kind: 'vocab-note' },
    { content: `This lesson sorts planets by OBSERVED PROPERTIES, not by why they are that way. Don't expect to learn *why* terrestrial planets are rocky or *why* giants are far out — that comes later.`, kind: 'gotcha' },
  ],
};
