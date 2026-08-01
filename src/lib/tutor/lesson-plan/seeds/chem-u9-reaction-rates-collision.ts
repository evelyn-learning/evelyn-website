/**
 * Chemistry — Kinetics: Reaction Rates & Collision Theory.
 *
 * Why some reactions finish in milliseconds and others take years
 * (NGSS HS-PS1-5). Collision theory is the engine: particles must meet,
 * meet hard enough, and meet aimed right. The five rate factors are all
 * just ways of tuning that picture. The star misconception gets equal
 * billing — a catalyst speeds a reaction up, it does not get used up and
 * it does not make more product.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U9_REACTION_RATES_COLLISION: LessonPlan = {
  id: 'evelyn.hs.chem.reaction-rates-collision.v1',
  title: 'Reaction Rates & Collision Theory',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.reaction-rates-collision',
      standard: 'CHEM-9.3',
      description:
        'Use collision theory and activation energy to explain how concentration, temperature, surface area, catalysts, and the nature of the reactants change the rate of a chemical reaction, and calculate an average rate from a concentration change over time (NGSS HS-PS1-5).',
    },
  ],
  prerequisites: ['chem.specific-heat-calorimetry'],
  followUps: ['chem.equilibrium-le-chatelier'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Same chemistry, wildly different speeds — rate is a variable you can control, not a fixed property.',
      script:
        'A steel nail left outside takes years to rust. Steel wool held over a flame flares up in about a second. Same iron, same oxygen, same reaction — one is roughly ten million times faster. And this is not a curiosity: it is why an airbag inflates in 30 milliseconds, why milk lasts a week in the fridge and an afternoon on the counter, and why a grain elevator full of flour dust can explode. Today you learn the picture that explains all of it — particles crashing into each other — and the five dials you can turn to make any reaction faster or slower.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-collision-and-factors',
      kind: 'concept',
      goal: 'Collision theory as the single engine, the five rate factors as ways of turning its dials, plus the two classic traps (catalyst consumed; temperature = "more collisions" only).',
      keyIdeas: [
        'WHAT RATE MEANS — reaction rate is how fast a reactant disappears or a product appears, per unit time. Average rate = (change in concentration) ÷ (time elapsed), written as a positive number: rate = 0.60 M ÷ 30 s = 0.02 M/s. Fast reaction = big number.',
        'THE ENGINE: COLLISION THEORY — particles react only when they COLLIDE, and a collision only "works" if it meets two conditions: (1) enough ENERGY, and (2) the correct ORIENTATION. Every single rate factor below works by changing the number of successful collisions per second — nothing else.',
        'ACTIVATION ENERGY (Eₐ) — the minimum energy a collision must carry to break the old bonds and start forming new ones: the energy hill between reactants and products. Collisions below Eₐ just bounce apart. High Eₐ → few collisions clear the hill → slow reaction. Note Eₐ is separate from ΔH: a reaction can release energy overall (negative ΔH) and STILL be slow, because it has a tall hill to climb first. That is exactly why paper does not burst into flame on its own.',
        'FACTOR 1 — CONCENTRATION (and, for gases, PRESSURE): more particles crammed into the same volume → collisions happen more often → faster. Doubling the concentration of a reactant crowds the space; halving it thins the traffic. Steel wool burns far faster in pure O₂ than in air (21% O₂).',
        'FACTOR 2 — TEMPERATURE, the strongest dial: raising T does TWO things, and the second is the big one. Particles move faster, so they collide more often — but more importantly a much larger FRACTION of collisions now carries at least Eₐ, so far more collisions succeed. As a rule of thumb, rate roughly doubles for every 10 °C rise. Cooling is the same dial run backwards: your refrigerator does not stop food spoiling, it just slows the reactions down.',
        'FACTOR 3 — SURFACE AREA: reactions between different phases (a solid in a liquid, a solid in a gas) can only happen at the boundary. Grinding a solid into powder exposes far more of its particles to collision. A steel nail smolders; iron filings sparkle; flour dust suspended in air can detonate — same substance, more exposed surface.',
        'FACTOR 4 — CATALYST: a substance that speeds a reaction by offering an alternative pathway with a LOWER Eₐ, so a larger fraction of ordinary collisions is now energetic enough to react. A catalyst is NOT consumed — it is regenerated and can be counted on both sides of the equation. Enzymes are your body\'s catalysts; the platinum in a catalytic converter is your car\'s.',
        'FACTOR 5 — NATURE OF THE REACTANTS: what is being reacted matters before you touch any dial. Reactions between ions already free in solution (like Ag⁺ + Cl⁻ → AgCl) are nearly instant because there are no bonds to break. Reactions that must break strong covalent bonds — like N₂, with a triple bond — are slow, which is why nitrogen sits inert in the air you are breathing.',
        'THE TRAPS — (a) A catalyst is NOT used up and does NOT make more product; it only gets you to the same finish line sooner. (b) Temperature is not just "particles move faster and bump more"; the decisive effect is the jump in the fraction of collisions that clear Eₐ. (c) Surface area only matters when a solid is involved — grinding does nothing for two gases already mixed.',
      ],
      vocabulary: [
        { term: 'reaction rate', definition: 'how much concentration changes per unit time, e.g. moles per liter per second.' },
        { term: 'collision theory', definition: 'the model that particles react only when they collide with sufficient energy and correct orientation.' },
        { term: 'activation energy (Eₐ)', definition: 'the minimum energy a collision must have for a reaction to occur.' },
        { term: 'catalyst', definition: 'a substance that lowers the activation energy and speeds a reaction without being consumed.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify-factors',
      kind: 'worked_example',
      problem:
        'For each change, name the rate factor at work and say — using collision theory — whether the reaction speeds up or slows down: (a) a cook blows air across the coals of a barbecue; (b) a whole antacid tablet is replaced with the same tablet crushed to powder before dropping it into water; (c) a jug of milk is moved from the counter (22 °C) into the fridge (4 °C); (d) a pinch of manganese dioxide is added to hydrogen peroxide and it immediately foams.',
      steps: [
        '(a) Blowing pushes more O₂ molecules over the fuel: that is CONCENTRATION. More oxygen particles per unit volume → more collisions per second with the fuel → the coals burn hotter and faster.',
        '(b) Crushing the tablet does not change what it is made of, only how much of it is exposed: that is SURFACE AREA. The reaction happens only where solid touches water, and powder exposes vastly more boundary → faster fizzing.',
        '(c) Chilling lowers the average kinetic energy: that is TEMPERATURE, run downward. Particles collide less often and — the bigger effect — a much smaller fraction of collisions carries the activation energy, so the spoilage reactions slow sharply. The milk still spoils; it just takes days instead of hours.',
        '(d) Manganese dioxide is a CATALYST for the decomposition of H₂O₂. It offers a lower-Eₐ pathway, so a far greater fraction of the collisions already happening now succeeds. Scoop the MnO₂ out afterwards and it is all still there.',
      ],
      answer: '(a) concentration — faster; (b) surface area — faster; (c) temperature — slower; (d) catalyst — faster. All four act by changing the number of SUCCESSFUL collisions per second.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-catalyst-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "We added a catalyst to the reaction, so the reaction went faster AND we ended up with more product. The catalyst got used up doing it, which is why we had to keep adding more." Find every flaw and give the correct account.',
      steps: [
        'Flaw 1 — "we ended up with more product." A catalyst changes only the SPEED of the trip, never the destination. It lowers Eₐ, which is the height of the hill; it does not move the reactants or products up or down, so ΔH and the final amounts are untouched. You reach the same yield sooner.',
        'Flaw 2 — "the catalyst got used up." A catalyst is regenerated by the end of the cycle. It may be temporarily bound during the alternative pathway, but it comes back out unchanged — which is why a catalytic converter keeps working for the life of the car and why a pinch of MnO₂ can decompose a whole bottle of peroxide.',
        'What is actually true: the lower Eₐ means a larger FRACTION of the collisions already occurring now carries enough energy to react. Same collisions, more of them successful.',
        'Correct version: "The catalyst provided a lower-activation-energy pathway, so the same reaction reached its final amount of product faster. The catalyst was not consumed, and the amount of product formed was unchanged."',
      ],
      answer: 'A catalyst lowers Eₐ, is not consumed, and does not change how much product forms — only how quickly you get there.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-surface-area',
      kind: 'try_yourself',
      problem:
        'Two identical 5.0 g samples of zinc are dropped into two beakers holding the same hydrochloric acid at the same temperature. Sample A is a single solid lump; sample B is zinc powder. Sample B fizzes much faster. Which explanation is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The powder exposes far more zinc surface to the acid, so acid particles collide with zinc particles far more often', correct: true },
        { id: 'b', text: 'The powder contains more zinc atoms than the lump does' },
        { id: 'c', text: 'Grinding the zinc lowered the activation energy of the reaction' },
        { id: 'd', text: 'The powder is at a higher temperature because grinding added energy to it' },
      ],
      expectedAnswer: 'The powder exposes far more zinc surface to the acid, so acid particles collide with zinc particles far more often',
      hints: [
        'Both samples are 5.0 g of zinc in the same acid at the same temperature — so amount and temperature are not what changed.',
        'A solid can only react where the acid can actually touch it. What did grinding change about that boundary?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-temperature',
      kind: 'try_yourself',
      problem:
        'Heating a reaction mixture from 20 °C to 40 °C makes it go dramatically faster. What is the MAIN reason, in terms of collision theory?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A much larger fraction of collisions now carries at least the activation energy, so far more collisions succeed', correct: true },
        { id: 'b', text: 'Heating lowers the activation energy of the reaction' },
        { id: 'c', text: 'Heating increases the concentration of the reactants' },
        { id: 'd', text: 'The only effect is that particles move faster, so they collide slightly more often' },
      ],
      expectedAnswer: 'A much larger fraction of collisions now carries at least the activation energy, so far more collisions succeed',
      hints: [
        'Eₐ is a property of the reaction pathway itself — heating the beaker does not change the height of the hill.',
        'Faster particles do collide a bit more often, but that alone is far too small to explain a dramatic speed-up. What else does raising the temperature do to the ENERGY spread of the collisions?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In a reaction, the concentration of reactant A falls from 1.20 M to 0.40 M over 40 seconds. Average rate = (change in concentration) ÷ (time elapsed), reported as a positive number. What is the average rate of consumption of A, in moles per liter per second? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '0.02',
      hints: [
        'First find how much of A was used up: subtract the final concentration from the starting concentration.',
        '1.20 − 0.40 = 0.80 M consumed. Now divide that by the 40 seconds it took.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-catalyst-yield',
      kind: 'misconception_check',
      question:
        'A student says: "A catalyst is basically an extra reactant — it gets consumed as the reaction runs, and because it pushes the reaction along, you end up with more product than you would without it." What is wrong with this?',
      commonErrors: [
        {
          answer: 'A catalyst is consumed and increases the amount of product',
          misconception: 'Treating a catalyst as a reactant that drives the reaction further, rather than as a pathway change that only affects speed.',
          correctsTo:
            'A catalyst changes the ROUTE, not the destination. It offers a pathway with a lower activation energy, so a bigger fraction of ordinary collisions now succeeds and the reaction runs faster. It is regenerated at the end — not consumed — and the final amount of product is exactly the same as it would have been without it. Faster to the same finish line, not further past it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Average rate = change in concentration ÷ time elapsed, reported positive (0.80 M over 40 s → 0.02 M/s).',
        'Collision theory is the one engine: particles react only when they collide with enough ENERGY (at least Eₐ) and the right ORIENTATION.',
        'The five dials — concentration, temperature, surface area, catalyst, nature of the reactants — all work by changing the number of SUCCESSFUL collisions per second.',
        'Temperature is the strongest dial, and the main reason is the jump in the FRACTION of collisions that clear Eₐ, not just more frequent bumping.',
        'A catalyst lowers Eₐ, is regenerated rather than consumed, and never changes how much product forms — only how fast you get there.',
        'Surface area only matters when a solid is involved; a low Eₐ means fast, but a negative ΔH does not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Reaction Rates & Collision Theory' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
