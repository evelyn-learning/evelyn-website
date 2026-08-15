/**
 * Chemistry — States of Matter & the Kinetic-Molecular Theory.
 *
 * The particle model that explains solids, liquids, and gases with one
 * idea (NGSS HS-PS3-2): temperature is average kinetic energy, and state
 * is the tug-of-war between that motion and attractive forces. The star
 * misconceptions get equal billing — particles do not swell when heated,
 * and equal temperature means equal average energy, never equal speed.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U7_KINETIC_MOLECULAR_THEORY: LessonPlan = {
  id: 'evelyn.hs.chem.kinetic-molecular-theory.v1',
  title: 'States of Matter & Kinetic-Molecular Theory',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.kinetic-molecular-theory',
      standard: 'CHEM-7.1',
      description:
        'Explain the properties of solids, liquids, and gases using the kinetic-molecular theory, relating absolute temperature to the average kinetic energy of particles (NGSS HS-PS3-2).',
    },
  ],
  prerequisites: ['chem.limiting-reactant-yield'],
  followUps: ['chem.phase-changes-heating-curves'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One invisible model — particles in motion — explains everyday behavior nobody thinks to question.',
      script:
        'The first cold morning of winter, the tire-pressure light on cars all over town blinks on. Nobody let air out overnight; the same number of air molecules is still sealed inside. So where did the pressure go? Open the oven and the smell of bread reaches you across the kitchen in seconds, but spilled honey barely crawls. Same question, different disguise. Both answers come from one picture: matter is made of particles in constant motion, and how fast they move decides everything — pressure, smell, whether something is a solid, a liquid, or a gas. That picture is the kinetic-molecular theory, and it runs the rest of this unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-kmt',
      kind: 'concept',
      goal: 'The postulates of the kinetic-molecular theory, temperature as average kinetic energy, and the classic particle-swelling and equal-speed traps.',
      keyIdeas: [
        'THE CORE POSTULATES — matter is made of particles in constant, random motion; gas particles are so tiny compared with the space between them that their own volume is negligible; collisions are ELASTIC, meaning total kinetic energy is not lost when particles bounce; and in an ideal gas the particles neither attract nor repel one another between collisions.',
        'TEMPERATURE = AVERAGE KINETIC ENERGY — temperature does not measure how much energy is present, it measures the AVERAGE kinetic energy per particle. A thimble of boiling water (100 °C) has far less total energy than a lukewarm bathtub (40 °C), yet its particles are individually faster.',
        'ABSOLUTE TEMPERATURE IS THE ONE THAT COUNTS — average kinetic energy is proportional to temperature in KELVIN, not Celsius. Convert with K = °C + 273 (so 25 °C = 298 K). At 0 K particle motion would stop; that is why doubling from 10 °C to 20 °C does NOT double the energy, but doubling from 150 K to 300 K does.',
        'THE THREE STATES ARE ONE TUG-OF-WAR — kinetic energy pulls particles apart, attractive forces hold them together. SOLID: forces win, particles locked in fixed positions and only vibrating, so shape and volume are definite. LIQUID: a near tie, particles still touch but slide past one another, so volume is definite but shape is not. GAS: motion wins, particles fly far apart, so the sample fills any container it is given.',
        'PRESSURE IS COLLISIONS — gas pressure is nothing but particles striking the container walls. More frequent or harder hits mean higher pressure, which is why cooling the air in a tire (slower particles, gentler hits) drops the pressure with no air escaping.',
        'PARTICLES HAVE A SPREAD OF SPEEDS — at any instant some particles crawl and some sprint; "the temperature" names the average of that distribution. Raising the temperature shifts the whole spread faster, which is why a few molecules can evaporate from a puddle well below its boiling point.',
        'THE TRAP: PARTICLES DO NOT SWELL — heating a steel bar makes each atom vibrate harder and push its neighbors farther away, so the BAR expands. The atoms themselves stay exactly the same size. Expansion is extra spacing, never bigger particles.',
        'THE TRAP: SAME TEMPERATURE ≠ SAME SPEED — kinetic energy is one-half times mass times speed squared, so at equal temperature two gases share the same AVERAGE kinetic energy but not the same speed. Light helium atoms must move much faster than heavy oxygen molecules to carry the same energy — which is why helium leaks out of a balloon first.',
      ],
      vocabulary: [
        { term: 'kinetic-molecular theory', definition: 'the model that explains the behavior of matter as the constant random motion of its particles.' },
        { term: 'kinetic energy', definition: 'the energy of motion, equal to one-half times mass times speed squared.' },
        { term: 'absolute temperature', definition: 'temperature measured on the Kelvin scale, which starts at the point of zero particle motion; K = °C + 273.' },
        { term: 'elastic collision', definition: 'a collision in which the colliding particles lose no total kinetic energy.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sealed-container',
      kind: 'worked_example',
      problem:
        'A rigid sealed steel canister of air sits in a lab at 25 °C and is then moved into an oven at 327 °C. No air enters or leaves and the canister does not change volume. Convert both temperatures to kelvins and explain, in kinetic-molecular terms, what happens to the pressure inside.',
      steps: [
        'Convert first — kinetic-molecular reasoning only works on the absolute scale: 25 °C + 273 = 298 K, and 327 °C + 273 = 600 K.',
        'Compare on the absolute scale: 600 K is about twice 298 K, so the average kinetic energy of the air particles roughly doubles. (On the Celsius numbers alone it looks like a 13-fold jump — that is exactly why Celsius must not be used here.)',
        'Translate energy into motion: higher average kinetic energy means the particles move faster on average.',
        'Translate motion into pressure: faster particles strike the fixed walls both more OFTEN and HARDER. Pressure is nothing but the force of those collisions, so the pressure rises sharply.',
        'Check what did NOT change: the number of particles, the size of each particle, and the volume of the canister are all identical. Only the speed of the particles changed.',
      ],
      answer: '298 K and 600 K — average kinetic energy roughly doubles, so faster, harder wall collisions raise the pressure',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-equal-speed-trap',
      kind: 'worked_example',
      problem:
        'A container holds a mixture of helium (He, molar mass 4.0 g/mol) and oxygen gas (O₂, molar mass 32.0 g/mol) at a single uniform temperature of 27 °C. A student concludes: "Oxygen molecules are eight times heavier, so they carry eight times the kinetic energy." Find the flaw and state what is actually equal and what is actually different.',
      steps: [
        'State the rule being tested: everything in thermal contact at one temperature shares the same AVERAGE KINETIC ENERGY per particle — that is what temperature means. Both gases sit at 27 °C, which is 27 + 273 = 300 K.',
        'Name the flaw: the student read "heavier" as "more energetic." Mass is only one factor in kinetic energy, which is one-half times mass times speed squared; the other factor is speed, and the student silently assumed both gases move at the same speed.',
        'Solve for what must differ: if the average of one-half times mass times speed squared is EQUAL for both, then the heavier gas must be the slower one. Oxygen is eight times more massive, so its molecules move noticeably slower on average than helium atoms.',
        'Report the correct comparison: equal average kinetic energy, unequal average speeds — helium fast and light, oxygen slow and heavy.',
        'Sanity-check against experience: a helium balloon goes limp days before an air-filled one, because the faster helium atoms find their way through the balloon wall sooner. Speed, not energy, is what differs.',
      ],
      answer: 'Both gases have the SAME average kinetic energy at 300 K; helium moves faster because it is lighter',
      estimatedMinutes: 3,
    },
    {
      id: 'try-heated-bar',
      kind: 'try_yourself',
      problem: 'A steel bar is heated and gets measurably longer. What is happening to its atoms?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They vibrate more energetically and push each other farther apart, while each atom stays the same size', correct: true },
        { id: 'b', text: 'Each atom swells to a larger size' },
        { id: 'c', text: 'Extra atoms form inside the bar as it absorbs heat' },
        { id: 'd', text: 'The atoms break free of their fixed positions and begin to flow' },
      ],
      expectedAnswer: 'They vibrate more energetically and push each other farther apart, while each atom stays the same size',
      hints: [
        'Heating adds kinetic energy to particles. In a solid, that energy shows up as vibration, not as a change in the particles themselves.',
        'The bar got longer, but nothing was added and no atom changed size — so what got bigger was the SPACING between atoms.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-liquid-vs-gas',
      kind: 'try_yourself',
      problem: 'In kinetic-molecular terms, why does a liquid have a definite volume but take the shape of its container, while a gas fills any container completely?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In a liquid the particles still touch and attract each other while sliding past one another; in a gas the particles have enough kinetic energy to overcome those attractions and spread far apart', correct: true },
        { id: 'b', text: 'Liquid particles are heavier than gas particles, so they sink and stay together' },
        { id: 'c', text: 'Liquid particles are locked in fixed positions, while gas particles vibrate in place' },
        { id: 'd', text: 'Gas particles are larger, so they need more room to fit in the container' },
      ],
      expectedAnswer: 'In a liquid the particles still touch and attract each other while sliding past one another; in a gas the particles have enough kinetic energy to overcome those attractions and spread far apart',
      hints: [
        'State is a tug-of-war between kinetic energy (which separates particles) and attractive forces (which hold them together). Which side wins in each case?',
        'Definite volume means the particles are still in contact; no definite shape means they are free to slide. Only the gas has broken contact entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Kinetic-molecular calculations must use the absolute (Kelvin) scale, converted with K = °C + 273. A sample of nitrogen gas is stored in a lab at 25 °C. What is its temperature in kelvins? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '298',
      hints: [
        'Use the conversion directly: add 273 to the Celsius temperature.',
        '25 + 273 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-temperature-vs-total-energy',
      kind: 'misconception_check',
      question:
        'A student says: "A bathtub of 40 °C water must have hotter, faster particles than a thimble of 100 °C boiling water, because the bathtub obviously holds way more heat energy." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'More total energy means a higher temperature',
          misconception: 'Confusing temperature (average kinetic energy PER PARTICLE) with total thermal energy (which also depends on how many particles there are).',
          correctsTo:
            'Temperature is an AVERAGE, not a total. The thimble at 100 °C (373 K) has the faster-moving particles; the bathtub at 40 °C (313 K) has slower particles but vastly more of them, so it holds more total energy. Amount of substance changes the total, never the average — that is why a single spark at thousands of degrees cannot heat a room.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Kinetic-molecular theory: particles are in constant random motion, gas particles are tiny compared with the space between them, and their collisions are elastic.',
        'Temperature measures the AVERAGE kinetic energy per particle — never the total energy — and it must be used in kelvins: K = °C + 273.',
        'State is a tug-of-war: solid (forces win, fixed positions, vibration only), liquid (near tie, touching but sliding), gas (motion wins, particles far apart and filling the container).',
        'Gas pressure is just particles colliding with the walls; hotter gas means faster, harder, more frequent hits.',
        'Two traps: heating makes particles move farther apart, not grow bigger; and equal temperature means equal average kinetic energy, so the lighter gas is the faster one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'States of Matter & Kinetic-Molecular Theory' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
