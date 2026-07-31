/**
 * Chemistry — Unit 7.1: States of Matter & Kinetic-Molecular Theory.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u7-kinetic-molecular-theory.ts
 * (planId evelyn.hs.chem.kinetic-molecular-theory.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.kinetic-molecular-theory';
const PLAN_ID = 'evelyn.hs.chem.kinetic-molecular-theory.v1';

export const BASELINE_CHEM_U7_KINETIC_MOLECULAR_THEORY: TopicNotesBaseline = {
  baselineId: PLAN_ID,
  course: 'Chemistry',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'States of Matter & Kinetic-Molecular Theory',
  planId: PLAN_ID,
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: PLAN_ID }],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'The four postulates',
      content:
        'Matter is made of particles in constant, random motion. Gas particles are so small compared with the space between them that their own volume is negligible. Collisions are ELASTIC — no total kinetic energy is lost when particles bounce. In an ideal gas the particles neither attract nor repel one another between collisions.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Temperature = AVERAGE kinetic energy',
      content:
        'Temperature measures the average kinetic energy PER PARTICLE, never the total energy present. A thimble of boiling water at 100 °C has far less total energy than a lukewarm bathtub at 40 °C, yet its individual particles move faster. Amount of substance changes the total; it never changes the average.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Kelvin is the working scale',
      content:
        'Average kinetic energy is proportional to ABSOLUTE temperature: K = °C + 273 (25 °C = 298 K). At 0 K particle motion would stop. Ratios only mean something on this scale — 10 °C to 20 °C does not double the energy, but 150 K to 300 K does.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Three states = one tug-of-war',
      content:
        'Kinetic energy pulls particles apart; attractive forces hold them together. SOLID — forces win: particles locked in fixed positions, vibrating only, so shape and volume are definite. LIQUID — near tie: particles still touch but slide past one another, so volume is definite and shape is not. GAS — motion wins: particles fly far apart and fill any container given.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Pressure is collisions',
      content:
        'Gas pressure is nothing but particles striking the container walls. More frequent hits, or harder hits, means higher pressure. Cooling the air in a tire slows the particles, so the hits soften and the pressure drops with no air escaping.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Particles have a SPREAD of speeds',
      content:
        'At any instant some particles crawl and some sprint; "the temperature" names the average of that whole distribution. Raising the temperature shifts the entire spread faster — which is why a few molecules can evaporate from a puddle far below its boiling point. Because kinetic energy = one-half × mass × speed², two gases at the same temperature share average ENERGY but not average SPEED: light helium must move much faster than heavy O₂.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Core terms',
      content:
        'kinetic energy — the energy of motion, one-half × mass × speed². elastic collision — a collision in which the colliding particles lose no total kinetic energy. absolute temperature — temperature on the Kelvin scale, which starts at the point of zero particle motion; K = °C + 273.',
    },
  ],
  methods: [
    {
      title: 'Predict what a temperature change does to a sealed gas',
      when_to_use:
        'A fixed amount of gas in a container is heated or cooled and you must explain (not just state) what happens to the pressure.',
      steps: [
        'Convert both temperatures to kelvins first — kinetic-molecular reasoning only works on the absolute scale: K = °C + 273.',
        'Compare the two KELVIN values as a ratio; that ratio is roughly how the average kinetic energy changes. Never compare the Celsius numbers.',
        'Translate energy into motion: higher average kinetic energy means faster average particle speed.',
        'Translate motion into pressure: faster particles hit the walls both MORE OFTEN and HARDER, so pressure rises (and the reverse on cooling).',
        'Close by naming what did NOT change — the number of particles, the size of each particle, and (in a rigid container) the volume.',
      ],
      example: {
        problem:
          'A rigid sealed steel canister of air moves from a 25 °C lab into a 327 °C oven. No air enters or leaves. What happens to the pressure?',
        solution:
          '25 °C = 298 K and 327 °C = 600 K, so the absolute temperature roughly doubles and so does the average kinetic energy. Faster particles strike the fixed walls more often and harder, so the pressure rises sharply. Particle count, particle size, and volume are all unchanged. (On Celsius numbers alone it would look like a 13-fold jump — exactly why Celsius must not be used.)',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Compare two gases held at the same temperature',
      when_to_use:
        'A question mixes gases of different molar masses at one temperature and asks about energy, speed, or which escapes faster.',
      steps: [
        'State the rule: everything in thermal contact at one temperature shares the same AVERAGE KINETIC ENERGY per particle — that is what temperature means.',
        'Write kinetic energy = one-half × mass × speed², so mass and speed trade off against each other.',
        'If the averages of one-half × mass × speed² are equal, the heavier gas must be the SLOWER one; the lighter gas is the faster one.',
        'Report both halves of the comparison: equal average kinetic energy, unequal average speeds.',
        'Sanity-check against experience — the lighter, faster gas diffuses and leaks first.',
      ],
      example: {
        problem:
          'He (4.0 g/mol) and O₂ (32.0 g/mol) share a container at 27 °C. A student says oxygen carries eight times the kinetic energy because it is eight times heavier. What is wrong?',
        solution:
          'At 27 °C = 300 K both gases have the SAME average kinetic energy — the student read "heavier" as "more energetic" and silently assumed equal speeds. Since one-half × mass × speed² is equal, the eight-times-heavier O₂ must move noticeably slower. Helium is fast and light, oxygen slow and heavy — which is why a helium balloon goes limp days before an air-filled one.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Explain a bulk property from particle behavior',
      when_to_use:
        'The question asks WHY a solid, liquid, or gas behaves as it does (definite shape, definite volume, expansion on heating).',
      steps: [
        'Name the two competing effects: kinetic energy (separates particles) versus attractive forces (hold them together).',
        'Decide which side wins in the given state — forces (solid), near tie (liquid), motion (gas).',
        'Read the property straight off that verdict: fixed positions → definite shape AND volume; touching but sliding → definite volume, no definite shape; far apart → neither.',
        'If heating is involved, attribute any expansion to increased SPACING between particles, never to bigger particles.',
      ],
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Temperature is an AVERAGE, not a total. A thimble at 100 °C has faster particles than a bathtub at 40 °C; the bathtub simply has vastly more of them, so it holds more total energy.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Heating a steel bar makes each atom vibrate harder and push its neighbors farther away. The BAR expands; the atoms stay exactly the same size. Expansion is extra spacing, never bigger particles.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Same temperature means same average kinetic energy — NOT same speed. Since energy = one-half × mass × speed², the lighter gas is always the faster one (helium escapes a balloon before air does).',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Convert to kelvins before any energy or ratio reasoning: K = °C + 273. Celsius has an arbitrary zero, so Celsius ratios are meaningless.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Gas pressure = particles hitting the walls. Hotter gas means faster, harder, more frequent hits — so a sealed tire loses pressure on a cold morning without losing a single molecule of air.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
