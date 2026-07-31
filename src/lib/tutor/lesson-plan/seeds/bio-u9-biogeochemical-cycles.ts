/**
 * Biology — Ecology: Biogeochemical Cycles: Carbon, Nitrogen & Water.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS2-5).
 * Lesson 9.2 established that energy FLOWS one way and is lost as heat; this
 * one is its mirror image — matter CYCLES, the same atoms used over and over.
 * Most student errors here are reservoir-and-pathway errors (which process
 * moves an atom WHERE, and which organisms can actually perform it), so the
 * concept segment is organized cycle by cycle around that bookkeeping.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U9_BIOGEOCHEMICAL_CYCLES: LessonPlan = {
  id: 'evelyn.hs.bio.biogeochemical-cycles.v1',
  title: 'Biogeochemical Cycles: Carbon, Nitrogen & Water',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.biogeochemical-cycles',
      standard: 'BIO-9.3',
      description:
        'Trace how carbon, nitrogen and water move between reservoirs in the living and non-living parts of an ecosystem, explaining why matter cycles while energy flows one way and how human activity disrupts those cycles (NGSS HS-LS2-5).',
    },
  ],
  prerequisites: ['bio.energy-flow-food-webs'],
  followUps: ['bio.population-community-ecology'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame matter as recycled — the same atoms, reused — in contrast to the one-way energy flow of the previous lesson.',
      script:
        'Take a breath. Some of the carbon atoms you just inhaled were inside a dinosaur, then locked in limestone, then in a tree, then in last night\'s dinner. Earth gets a constant delivery of energy from the Sun, but it never gets a delivery of new atoms — the carbon, nitrogen and water we have are the carbon, nitrogen and water we get. That is why a farmer plants clover between corn crops, why fertilizer washing off a field can create a dead zone the size of a state in the Gulf, and why burning fuel that formed 300 million years ago is changing the air today. In this lesson you follow atoms around three loops and learn to name every step.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-cycles',
      kind: 'concept',
      goal: 'Matter cycles while energy flows; the carbon, nitrogen and water cycles step by step; reservoirs vs fluxes; human disruption.',
      keyIdeas: [
        'MATTER CYCLES, ENERGY FLOWS — this is the organizing contrast with the last lesson. Energy enters as sunlight, passes up the food web losing about 90% as heat at each step, and exits the ecosystem permanently. Atoms never exit: the same carbon, nitrogen and oxygen atoms are used, released and used again. Ecosystems therefore need a CONSTANT energy supply but not a constant matter supply.',
        'RESERVOIRS VS FLUXES — a RESERVOIR is a place matter sits (the atmosphere, the ocean, soil, living bodies, fossil fuels, rock); a FLUX is a process that moves matter from one reservoir to another (photosynthesis, respiration, decomposition, evaporation). Every cycle question is really "which reservoir, moved by which process?" Reservoirs differ enormously in how long they hold an atom — days in a leaf, millions of years in coal.',
        'CARBON CYCLE — THE FAST LOOP — photosynthesis REMOVES CO2 from the air and fixes the carbon into sugars, so producers are the doorway carbon uses to enter living things. Three processes return it: RESPIRATION by every organism (including the plant itself), DECOMPOSITION when bacteria and fungi break down dead bodies and waste, and COMBUSTION when anything organic burns. Carbon also dissolves into the ocean and precipitates as carbonate rock and shells.',
        'CARBON CYCLE — THE SLOW RESERVOIR — when ancient organisms were buried before decomposers could reach them, their carbon was locked underground as coal, oil and natural gas for hundreds of millions of years. Burning fossil fuels moves that carbon from the slow reservoir into the atmosphere in decades. Because photosynthesis and the ocean cannot absorb it that fast, atmospheric CO2 is rising — a cycle that was roughly balanced now has a bigger inflow than outflow.',
        'NITROGEN CYCLE — WHY BACTERIA ARE INDISPENSABLE — nitrogen gas N2 makes up 78% of the air, yet almost no organism can use it, because the triple bond holding the two atoms together is extraordinarily hard to break. Plants absorb nitrogen from the SOIL as nitrate (NO3-) or ammonium, never as N2 from the air through their leaves. Bacteria are the only routine biological route between the two.',
        'NITROGEN CYCLE — THE FIVE STEPS — (1) FIXATION: nitrogen-fixing bacteria, many living in root nodules of legumes such as clover, beans and peas, convert N2 into ammonia (NH3); lightning fixes a smaller share. (2) NITRIFICATION: other soil bacteria oxidize ammonia to nitrite and then to nitrate (NO3-), the form plants take up best. (3) ASSIMILATION: plant roots absorb nitrate and build it into proteins and DNA; animals get their nitrogen by eating. (4) AMMONIFICATION: decomposers break down dead tissue and waste, returning nitrogen to the soil as ammonia. (5) DENITRIFICATION: denitrifying bacteria convert nitrate back to N2 gas, closing the loop to the atmosphere. Fixation and denitrification run in OPPOSITE directions — do not confuse them.',
        'WATER CYCLE — water EVAPORATES from oceans, lakes and soil, and TRANSPIRES out of leaf pores, both as vapor. Vapor rises, cools and CONDENSES into clouds, then falls as PRECIPITATION. On land it becomes RUNOFF into streams and rivers or infiltrates as GROUNDWATER in aquifers. Water is the vehicle the other cycles ride in: runoff is what carries nitrate off a field and into a river.',
        'HUMAN DISRUPTION: EUTROPHICATION — nitrogen and phosphorus fertilizer that runs off farmland fertilizes ALGAE downstream just as effectively as crops. The algal bloom blocks light, then dies, then decomposers consume it — and those decomposers use up the dissolved oxygen. Fish suffocate, leaving a low-oxygen dead zone. Note that nothing was destroyed: the nutrients simply arrived in the wrong reservoir in the wrong amount.',
      ],
      vocabulary: [
        { term: 'nitrogen fixation', definition: 'the conversion of atmospheric N2 into ammonia, performed mainly by bacteria in soil and root nodules.' },
        { term: 'reservoir', definition: 'a place where matter is stored in a cycle, such as the atmosphere, the ocean, soil or fossil fuels.' },
        { term: 'transpiration', definition: 'the loss of water vapor from plant leaves, a major return of water to the atmosphere.' },
        { term: 'eutrophication', definition: 'nutrient over-enrichment of water that triggers an algal bloom and the oxygen loss that follows it.' },
      ],
      suggestedTools: ['show_concept_map', 'show_diagram', 'show_table'],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-trace-carbon-atom',
      kind: 'worked_example',
      problem:
        'A single carbon atom sits in a CO2 molecule in the air above a meadow. Trace one realistic path it could take from the atmosphere, into a living body, and eventually back to the atmosphere — naming the reservoir it occupies and the process that moves it at each step.',
      steps: [
        'Start in the reservoir given: the atom is carbon in atmospheric CO2. To enter anything living it must be captured, and only one common process does that — photosynthesis.',
        'Step 1, atmosphere → producer, by PHOTOSYNTHESIS: a grass plant takes in the CO2 and fixes the carbon into glucose. The atom is now part of a sugar, then part of the plant\'s cellulose and proteins. This is the only doorway into the food web.',
        'Step 2, producer → consumer, by FEEDING: a cow eats the grass, digests it, and builds that carbon into its own muscle tissue. The atom has changed reservoirs but not identity — it is still carbon.',
        'Step 3, consumer → atmosphere, by CELLULAR RESPIRATION: the cow breaks down some of that sugar for energy and exhales the carbon as CO2. If the atom takes this branch, the loop is already closed and it is back in the air.',
        'Alternative step 3, consumer → soil → atmosphere, by DECOMPOSITION: instead, suppose the cow dies. Bacteria and fungi break down the body, use some carbon for their own respiration, and release CO2; the rest becomes soil organic matter.',
        'Alternative long branch: if the remains were buried in sediment before decomposers could reach them, the carbon could sit in the slow fossil-fuel reservoir for millions of years, returning to the air only when that fuel is burned — COMBUSTION.',
        'Note what never happened at any step: the atom was never created, destroyed or used up. It only moved between reservoirs — that is what "matter cycles" means.',
      ],
      answer:
        'Atmosphere (CO2) → grass, by photosynthesis → cow, by feeding → back to the atmosphere as CO2, by respiration (or by decomposition after death, or by combustion after millions of years as fossil fuel). The same atom is reused; only its reservoir changes.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-why-not-n2',
      kind: 'worked_example',
      problem:
        'The air surrounding a corn plant is 78% nitrogen gas, and the plant is visibly nitrogen-starved — pale, yellowing leaves. Explain why the plant cannot simply use the nitrogen all around it, and name what would have to happen first.',
      steps: [
        'State the chemical obstacle: atmospheric nitrogen is N2, two nitrogen atoms held together by a triple bond. Breaking that bond takes a great deal of energy, and plants have no enzyme that can do it.',
        'State what plants CAN absorb: roots take up nitrogen from the soil in already-broken-apart forms — nitrate (NO3-) or ammonium. Leaves do not absorb nitrogen; the uptake happens underground.',
        'Identify who can break the bond: nitrogen-fixing bacteria, free-living in soil or housed in the root nodules of legumes, convert N2 into ammonia (NH3). Lightning fixes a small additional share by supplying enough energy to split N2 in the air.',
        'Follow the chain to a usable form: nitrifying bacteria then oxidize that ammonia to nitrite and on to nitrate. Only now can the corn absorb it and assimilate it into proteins and DNA.',
        'Answer the farmer\'s version of the question: this is exactly why a field is rotated with clover or soybeans, or dosed with manufactured fertilizer. Both routes deliver fixed nitrogen the plant can actually take up — the atmosphere alone cannot.',
      ],
      answer:
        'The triple bond in N2 makes atmospheric nitrogen chemically unavailable to plants, and plants absorb nitrogen only through their roots as nitrate or ammonium. Nitrogen-fixing bacteria (or lightning) must first convert N2 to ammonia, and nitrifying bacteria convert that to nitrate, before the corn can use it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-nitrogen-uptake',
      kind: 'try_yourself',
      problem:
        'A bean plant is grown in sterilized soil containing no bacteria, in ordinary air that is 78% nitrogen gas. It grows poorly and its leaves yellow. Which statement best explains why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plant absorbs nitrogen gas through its leaves, but the sterilized soil blocked the leaf pores' },
        { id: 'b', text: 'Plants do not need nitrogen at all, so the yellowing must be caused by something else' },
        { id: 'c', text: 'Without nitrogen-fixing bacteria, no N2 was converted to ammonia and nitrate, so the roots had no usable nitrogen to absorb', correct: true },
        { id: 'd', text: 'Sterilized soil removed the denitrifying bacteria the plant needs to make protein' },
      ],
      expectedAnswer:
        'Without nitrogen-fixing bacteria, no N2 was converted to ammonia and nitrate, so the roots had no usable nitrogen to absorb',
      hints: [
        'In what chemical form does a plant actually take nitrogen in, and through which organ?',
        'The air was full of N2 the whole time — so ask what was missing that normally converts N2 into a form roots can use.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-carbon-entry',
      kind: 'try_yourself',
      problem:
        'Carbon from the atmosphere enters the living part of an ecosystem primarily by which process?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Photosynthesis — producers take in CO2 and fix the carbon into sugars', correct: true },
        { id: 'b', text: 'Animals breathing in CO2 from the air and building it into their tissues' },
        { id: 'c', text: 'Decomposition — bacteria and fungi transfer carbon from the air into dead matter' },
        { id: 'd', text: 'Combustion — burning fuel deposits carbon directly into plants and animals' },
      ],
      expectedAnswer: 'Photosynthesis — producers take in CO2 and fix the carbon into sugars',
      hints: [
        'Three of these four processes RELEASE carbon dioxide rather than capture it. Find the one that removes CO2 from the air.',
        'Animals inhale oxygen and exhale CO2 — breathing is a carbon exit, not a carbon entrance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-eutrophication-pathway',
      kind: 'try_yourself',
      problem:
        'Heavy rain washes nitrogen fertilizer off a farm field into a nearby lake. Weeks later the lake is choked with algae and fish are dying. Which sequence correctly explains the fish kill?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The fertilizer is directly toxic to fish, poisoning them on contact as it enters the lake' },
        { id: 'b', text: 'Denitrifying bacteria converted the fertilizer to N2 gas, which bubbled up and displaced the oxygen in the water' },
        { id: 'c', text: 'The algae grew so thick that they physically clogged the fish gills, and no oxygen change was involved' },
        { id: 'd', text: 'Runoff carried nutrients into the lake → algae bloomed and then died → decomposers broke down the dead algae and used up the dissolved oxygen → fish suffocated', correct: true },
      ],
      expectedAnswer:
        'Runoff carried nutrients into the lake → algae bloomed and then died → decomposers broke down the dead algae and used up the dissolved oxygen → fish suffocated',
      hints: [
        'Fertilizer feeds algae the same way it feeds crops — so start by asking what happens to all that algae once it dies.',
        'Decomposers respire too. What do they consume from the water while breaking down a huge mass of dead algae?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-matter-used-up',
      kind: 'misconception_check',
      question:
        'A student writes: "Ecosystems need a constant supply of new carbon and nitrogen, because organisms use those atoms up the same way they use up energy." What went wrong?',
      commonErrors: [
        {
          answer: 'Matter gets used up and must be resupplied, like energy',
          misconception:
            'Applying the one-way, lossy behavior of energy to matter — treating atoms as something consumed rather than relocated.',
          correctsTo:
            'Energy and matter behave differently, and that contrast is the whole point of this lesson. Energy enters as sunlight, is degraded to heat at every transfer, and leaves the ecosystem for good, so the supply must be constant. Atoms are never destroyed: a carbon atom released by respiration is available for photosynthesis again, and a nitrogen atom returned by ammonification can be reabsorbed by the next plant. Ecosystems recycle matter indefinitely — what humans disrupt is not the total amount of carbon or nitrogen, but how much sits in which reservoir and how fast it moves between them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Matter CYCLES and is reused indefinitely; energy FLOWS one way, in as sunlight and out as heat. Every cycle question is "which reservoir, moved by which process?"',
        'Carbon: photosynthesis removes CO2 from the air; respiration, decomposition and combustion return it. Fossil fuels are the slow reservoir, and burning them faster than the cycle can absorb is why atmospheric CO2 is rising.',
        'Nitrogen: N2 is 78% of the air but unusable, so bacteria are the indispensable step — fixation (N2 → NH3, in legume root nodules; lightning helps), nitrification (→ NO3-), assimilation by roots, ammonification by decomposers, denitrification back to N2.',
        'Plants absorb nitrogen through their ROOTS as nitrate or ammonium — never as N2 through their leaves. Fixation and denitrification run in opposite directions.',
        'Water: evaporation and transpiration → condensation → precipitation → runoff and groundwater. Runoff is what carries fertilizer into lakes.',
        'Eutrophication: nutrient runoff → algal bloom → the bloom dies → decomposers strip the dissolved oxygen → fish suffocate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Biogeochemical Cycles: Carbon, Nitrogen & Water' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
