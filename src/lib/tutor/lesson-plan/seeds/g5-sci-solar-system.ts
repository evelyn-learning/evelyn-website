/**
 * Grade 5 Science — The Solar System.
 * NGSS 5-ESS1-1 / 5-ESS1-2: differences in apparent brightness of
 * the sun compared to other stars; daily and yearly patterns of stars
 * and the apparent motion of the sun.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_SOLAR_SYSTEM: LessonPlan = {
  id: 'evelyn.g5.science.space.solar-system.v1',
  title: 'Our Solar System',
  curriculum: 'NGSS', grade: '5', subject: 'science', topic: 'space', locale: 'en',
  los: [{ id: 'ngss.5-ess1-1', description: 'Support an argument that differences in the apparent brightness of the sun compared to other stars is due to their relative distances from Earth.', standard: 'NGSS.5-ESS1-1' }, { id: 'ngss.5-ess1-2', description: 'Represent data in graphical displays to reveal patterns of daily changes in length and direction of shadows, day and night, and the seasonal appearance of stars.', standard: 'NGSS.5-ESS1-2' }],
  prerequisites: ['ngss.1-ess1-1'], followUps: ['ngss.ms-ess1-2'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the scale of our solar system.', script: 'Our SUN is just one of about 100 BILLION stars in our galaxy. But it\'s the closest to us — and we have eight planets orbiting it. What\'s out there?', estimatedMinutes: 1 },
    { id: 'concept-solar-system', kind: 'concept', goal: 'The solar system is the sun + everything orbiting it: 8 planets, dwarf planets, moons, asteroids, comets.', keyIdeas: [
      'SUN at the center — a STAR (huge ball of hot gas, mostly hydrogen).',
      'Eight PLANETS in order from sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
      'Inner planets (Mercury, Venus, Earth, Mars): SMALL, ROCKY.',
      'Outer planets (Jupiter, Saturn, Uranus, Neptune): LARGE, GAS.',
      'Between Mars and Jupiter: ASTEROID BELT (small rocky chunks).',
      'Pluto and others are DWARF PLANETS — too small to count as full planets.',
      'MOONS orbit planets. Earth has 1; Jupiter has 95+.',
      'COMETS are icy bodies that grow tails when they pass near the sun.',
    ], vocabulary: [{ term: 'planet', definition: 'a large round object orbiting a star.' }, { term: 'orbit', definition: 'the path one object follows around another.' }, { term: 'asteroid', definition: 'a rocky chunk in space, smaller than a planet.' }, { term: 'comet', definition: 'an icy body that develops a tail near the sun.' }], estimatedMinutes: 5 },
    { id: 'concept-sun-brightness', kind: 'concept', goal: 'The sun looks vastly brighter than other stars because it\'s much CLOSER, not because it\'s special.', keyIdeas: [
      'All stars are ENORMOUS balls of hot gas — like our sun.',
      'They look TINY at night because they\'re so far away.',
      'The next-closest star (Proxima Centauri) is ~25 trillion miles away.',
      'Our sun is "only" 93 million miles away.',
      'If we moved the sun to where Proxima Centauri is, it would look like a tiny dot too.',
    ], estimatedMinutes: 3 },
    { id: 'worked-mercury-vs-neptune', kind: 'worked_example', problem: 'Mercury orbits the sun in 88 days. Neptune takes 165 EARTH YEARS. Why such a huge difference?', steps: [
      'Mercury is CLOSE to the sun (~36 million miles). Short orbit path → quick lap.',
      'Neptune is FAR (~2.8 BILLION miles). Long orbit path → very long lap.',
      'Plus: planets farther from the sun move SLOWER too (gravity weaker), making the gap even bigger.',
      'So both factors stretch Neptune\'s "year" enormously compared to Mercury\'s.',
    ], answer: 'Neptune is much farther + moves slower, so its orbit takes much longer.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You see a "shooting star" streak across the sky. Is it actually a star?', expectedAnswer: 'No — it\'s a tiny piece of rock or dust (METEOR) burning up as it enters Earth\'s atmosphere. Stars are huge and far away; "shooting stars" are tiny things burning up close to Earth.', responseFormat: 'free', hints: ['Stars are HUGE — they don\'t move quickly across the sky.', 'What burns up in our atmosphere?'], estimatedMinutes: 2 },
    { id: 'misconception-pluto-still-planet', kind: 'misconception_check', question: 'A friend says "there are 9 planets — Pluto is a planet." What\'s the current scientific status?', commonErrors: [{ answer: 'Yes — 9 planets.', misconception: 'Outdated count.', correctsTo: 'In 2006, scientists reclassified Pluto as a "DWARF PLANET." There are now 8 planets and several dwarf planets (Pluto, Eris, Haumea, Makemake, Ceres). The reclassification was about size and orbital characteristics.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Solar system = sun + 8 planets + moons + asteroids + comets.', 'Inner = small, rocky. Outer = large, gas.', 'Other stars look dim only because they\'re FAR.', 'Pluto is a dwarf planet (since 2006).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
