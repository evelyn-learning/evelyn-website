/**
 * Chemistry — Gases: Boyle's, Charles's & Gay-Lussac's Laws.
 *
 * The three two-variable gas laws as one cross-multiply move
 * (NGSS HS-PS3-2), built on particle motion and wall collisions. The
 * star error gets a full worked example — putting °C into a ratio.
 * Every number is chosen so the answers land on clean whole values.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U7_GAS_LAWS: LessonPlan = {
  id: 'evelyn.hs.chem.gas-laws.v1',
  title: 'The Gas Laws: Boyle\'s, Charles\'s & Gay-Lussac\'s',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.gas-laws',
      standard: 'CHEM-7.3',
      description:
        'Use Boyle\'s, Charles\'s, and Gay-Lussac\'s laws to predict and calculate how the pressure, volume, and absolute temperature of a fixed sample of gas change together, converting all temperatures to kelvins (NGSS HS-PS3-2).',
    },
  ],
  prerequisites: ['chem.phase-changes-heating-curves'],
  followUps: ['chem.ideal-gas-law'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Gas-law math as the reason everyday containers carry warnings — and the reason divers, bakers, and engineers respect gases.',
      script:
        'Look at the back of any spray can: "Do not store above 50°C. Contents under pressure." That is not legal boilerplate, it is arithmetic. Heat a sealed can and the gas inside pushes harder on the walls in a way you can predict to the decimal place before it ever bursts. The same three relationships explain why a bag of chips puffs up in the mountains, why a balloon shrivels in the freezer, and why a scuba diver must never hold their breath while surfacing. Today you learn the three equations that turn "the gas does something" into "the gas does exactly this much."',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gas-laws',
      kind: 'concept',
      goal: 'Particle collisions as the cause, three cross-multiply laws as the math, and kelvin as the non-negotiable temperature unit.',
      keyIdeas: [
        'WHY GASES OBEY RULES — a gas is mostly empty space with tiny particles flying fast in every direction. Pressure IS those particles hammering the container walls: more collisions per second, or harder collisions, means higher pressure. Every gas law below is bookkeeping on those collisions.',
        'BOYLE\'S LAW — temperature and amount fixed: P₁V₁ = P₂V₂. Squeeze the gas into half the volume and the same particles hit a smaller wall area twice as often, so pressure DOUBLES. Pressure and volume are INVERSE: their product stays constant.',
        'CHARLES\'S LAW — pressure and amount fixed: V₁/T₁ = V₂/T₂. Heating makes particles move faster; in a flexible container (balloon, piston) the walls expand until the collisions balance the outside pressure again. Volume and absolute temperature are DIRECT.',
        'GAY-LUSSAC\'S LAW — volume and amount fixed: P₁/T₁ = P₂/T₂. In a RIGID sealed container the walls cannot move, so faster particles simply hit harder. Pressure and absolute temperature are DIRECT. This is the spray-can warning in equation form.',
        'STEP ZERO: WHAT IS HELD CONSTANT? — a rigid steel cylinder pins the volume (use Gay-Lussac); a balloon or a piston free to move pins the pressure (use Charles); a sealed syringe pushed at room temperature pins the temperature (use Boyle). Name the constant first, then the law picks itself.',
        'KELVIN IS NOT OPTIONAL — every temperature in a gas-law ratio must be absolute: K = °C + 273. The kelvin scale starts at absolute zero, where particle motion stops, so kelvins are proportional to particle energy. Celsius has an arbitrary zero, so 20°C is NOT "twice as hot" as 10°C, and 0°C in a denominator would divide by zero.',
        'THE TRAP: DIRECT vs INVERSE SETUP — Boyle multiplies across (P₁V₁ = P₂V₂) because the quantities fight each other; Charles and Gay-Lussac set fractions equal (V₁/T₁ = V₂/T₂) because the quantities rise together. Writing Boyle as P₁/V₁ = P₂/V₂ inverts the answer.',
        'ONE EQUATION TO RULE THEM ALL — the combined gas law P₁V₁/T₁ = P₂V₂/T₂ contains all three. Cross out whatever is constant on both sides and Boyle, Charles, or Gay-Lussac falls out. Memorize one, recover three.',
      ],
      vocabulary: [
        { term: 'pressure', definition: 'the force gas particles exert per unit of wall area, measured in atm, kPa, or mmHg.' },
        { term: 'absolute temperature', definition: 'temperature on the kelvin scale, K = °C + 273, measured from absolute zero and proportional to average particle kinetic energy.' },
        { term: 'absolute zero', definition: '0 K (about -273°C), the temperature at which particle motion would stop; no lower temperature exists.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-boyle',
      kind: 'worked_example',
      problem:
        'A sealed syringe holds 6.0 L of gas at a pressure of 2.0 atm. The plunger is pushed in until the pressure reads 3.0 atm, with the temperature held constant. What is the new volume?',
      steps: [
        'Step 0 — name the constant: the temperature is held fixed and the gas is sealed in, so pressure and volume are the only movers. That is Boyle\'s law.',
        'Write it: P₁V₁ = P₂V₂, with P₁ = 2.0 atm, V₁ = 6.0 L, P₂ = 3.0 atm, V₂ unknown. No temperature appears, so nothing needs converting here.',
        'Substitute: (2.0)(6.0) = (3.0)(V₂), so 12 = 3.0 V₂.',
        'Solve: V₂ = 12 ÷ 3.0 = 4.0 L.',
        'Sanity check the direction: pressure went UP (2.0 → 3.0 atm), so an inverse relationship demands volume go DOWN — and 4.0 L is less than 6.0 L. ✓ If you had gotten 9.0 L, the setup was inverted.',
      ],
      answer: 'V₂ = 4.0 L — pressure up, volume down; P × V stays at 12',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-celsius-trap',
      kind: 'worked_example',
      problem:
        'A balloon holds 2.0 L of air at 27°C. It is warmed to 327°C at constant pressure. A student writes V₂ = 2.0 × (327 / 27) and gets about 24 L. Find the flaw and give the correct volume.',
      steps: [
        'The law choice is right: the balloon is flexible, so pressure is constant and this is Charles\'s law, V₁/T₁ = V₂/T₂. The flaw is the UNIT — the student put Celsius numbers into the ratio.',
        'Why Celsius breaks: the ratio 327/27 claims the gas got twelve times hotter, but the Celsius zero is just the freezing point of water, not the absence of motion. Only kelvins are proportional to particle energy, so only kelvins may be divided.',
        'Convert both: T₁ = 27 + 273 = 300 K, T₂ = 327 + 273 = 600 K. The gas really only DOUBLED in absolute temperature.',
        'Set up Charles\'s law: 2.0/300 = V₂/600, so V₂ = 2.0 × (600/300) = 2.0 × 2 = 4.0 L.',
        'Compare: 4.0 L versus the student\'s 24 L — a six-fold error from one unit slip. Worse, at -50°C the Celsius method would predict a NEGATIVE volume, which is physically impossible; in kelvins (223 K) it stays comfortably positive.',
      ],
      answer: 'V₂ = 4.0 L — convert to kelvins first (300 K → 600 K), never divide Celsius by Celsius',
      estimatedMinutes: 3,
    },
    {
      id: 'try-boyle-mcq',
      kind: 'try_yourself',
      problem:
        'A gas sample occupies 8.0 L at 1.0 atm. It is compressed to 2.0 L at constant temperature. What is the new pressure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4.0 atm', correct: true },
        { id: 'b', text: '0.25 atm' },
        { id: 'c', text: '16 atm' },
        { id: 'd', text: '6.0 atm' },
      ],
      expectedAnswer: '4.0 atm',
      hints: [
        'Temperature is constant, so use Boyle\'s law: P₁V₁ = P₂V₂. The product of the two must stay the same.',
        'P₁V₁ = (1.0)(8.0) = 8.0. Divide that by the new volume, 2.0 L. Squeezing a gas must RAISE the pressure.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-gay-lussac-mcq',
      kind: 'try_yourself',
      problem:
        'A rigid sealed steel cylinder of gas reads 1.0 atm at 27°C. It is heated to 327°C. What is the new pressure inside?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2.0 atm', correct: true },
        { id: 'b', text: '12.1 atm' },
        { id: 'c', text: '0.5 atm' },
        { id: 'd', text: '1.0 atm — the cylinder is rigid, so the pressure cannot change' },
      ],
      expectedAnswer: '2.0 atm',
      hints: [
        'Rigid and sealed means the volume is constant, so this is Gay-Lussac\'s law: P₁/T₁ = P₂/T₂.',
        'Convert first: 27°C = 300 K and 327°C = 600 K. The absolute temperature doubled — what must the pressure do?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A balloon holds 3.0 L of helium at 27°C. It is warmed to 127°C while the pressure stays constant. What is the new volume in liters? Use K = °C + 273. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Constant pressure means Charles\'s law: V₁/T₁ = V₂/T₂. Convert BOTH temperatures to kelvins before you divide anything.',
        'T₁ = 300 K and T₂ = 400 K, so V₂ = 3.0 × (400/300).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-inverse-setup',
      kind: 'misconception_check',
      question:
        'A student solves a Boyle\'s law problem by writing P₁/V₁ = P₂/V₂, saying "it is a gas law, so I set the two fractions equal like Charles\'s law." What goes wrong, and what is the physical picture behind the right setup?',
      commonErrors: [
        {
          answer: 'P₁/V₁ = P₂/V₂ — all gas laws are proportions, so set the fractions equal',
          misconception: 'Treating pressure and volume as directly proportional and applying the Charles/Gay-Lussac fraction pattern to Boyle\'s law.',
          correctsTo:
            'Pressure and volume FIGHT each other: squeezing a gas into less space makes the same particles strike the walls more often, so pressure rises as volume falls. Inverse pairs multiply to a constant — P₁V₁ = P₂V₂. Only quantities that rise together (V and T, or P and T) go into equal fractions. A fast check: if your answer moved the wrong direction, you used the wrong pattern.',
        },
        {
          answer: 'The balloon shrinks in the freezer because the gas molecules themselves get smaller',
          misconception: 'Attributing volume change to shrinking particles rather than to slower particles making weaker, less frequent wall collisions.',
          correctsTo:
            'Particles never change size. Cooling lowers their average kinetic energy, so they hit the balloon wall less often and less hard; outside air pressure then pushes the wall inward until the collisions balance again. The gas volume changes because the SPACING and the collision rate change, not the particles.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pressure is particle collisions with the walls — every gas law is bookkeeping on how often and how hard those collisions happen.',
        'Boyle (T constant): P₁V₁ = P₂V₂, inverse — squeeze it, pressure rises.',
        'Charles (P constant): V₁/T₁ = V₂/T₂, direct — heat a balloon, it expands.',
        'Gay-Lussac (V constant): P₁/T₁ = P₂/T₂, direct — heat a rigid sealed can, pressure climbs.',
        'ALWAYS convert to kelvins before any ratio: K = °C + 273. Celsius in a ratio is the single most common gas-law error.',
        'Step zero is naming what is held constant; the combined law P₁V₁/T₁ = P₂V₂/T₂ regenerates all three when you forget one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'The Gas Laws: Boyle\'s, Charles\'s & Gay-Lussac\'s' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
