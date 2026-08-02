/**
 * Biology — Unit 9 CED 9.3: Biogeochemical Cycles: Carbon, Nitrogen & Water.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.biogeochemical-cycles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U9_BIOGEOCHEMICAL_CYCLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.biogeochemical-cycles.v1',
  course: 'Biology',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Biogeochemical Cycles: Carbon, Nitrogen & Water',
  planId: 'evelyn.hs.bio.biogeochemical-cycles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.biogeochemical-cycles.v1' }],
  theory: [
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Matter cycles, energy flows', content: `MATTER CYCLES, ENERGY FLOWS — this is the organizing contrast with the last lesson. Energy enters as sunlight, passes up the food web losing about 90% as heat at each step, and exits the ecosystem permanently. Atoms never exit: the same carbon, nitrogen and oxygen atoms are used, released and used again. Ecosystems therefore need a CONSTANT energy supply but not a constant matter supply.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Reservoirs vs fluxes', content: `RESERVOIRS VS FLUXES — a RESERVOIR is a place matter sits (the atmosphere, the ocean, soil, living bodies, fossil fuels, rock); a FLUX is a process that moves matter from one reservoir to another (photosynthesis, respiration, decomposition, evaporation). Every cycle question is really "which reservoir, moved by which process?" Reservoirs differ enormously in how long they hold an atom — days in a leaf, millions of years in coal.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Carbon cycle', content: `CARBON CYCLE — THE FAST LOOP — photosynthesis REMOVES CO2 from the air and fixes the carbon into sugars, so producers are the doorway carbon uses to enter living things. Three processes return it: RESPIRATION by every organism (including the plant itself), DECOMPOSITION when bacteria and fungi break down dead bodies and waste, and COMBUSTION when anything organic burns. Carbon also dissolves into the ocean and precipitates as carbonate rock and shells.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Carbon cycle', content: `CARBON CYCLE — THE SLOW RESERVOIR — when ancient organisms were buried before decomposers could reach them, their carbon was locked underground as coal, oil and natural gas for hundreds of millions of years. Burning fossil fuels moves that carbon from the slow reservoir into the atmosphere in decades. Because photosynthesis and the ocean cannot absorb it that fast, atmospheric CO2 is rising — a cycle that was roughly balanced now has a bigger inflow than outflow.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Nitrogen cycle', content: `NITROGEN CYCLE — WHY BACTERIA ARE INDISPENSABLE — nitrogen gas N2 makes up 78% of the air, yet almost no organism can use it, because the triple bond holding the two atoms together is extraordinarily hard to break. Plants absorb nitrogen from the SOIL as nitrate (NO3-) or ammonium, never as N2 from the air through their leaves. Bacteria are the only routine biological route between the two.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Nitrogen cycle', content: `NITROGEN CYCLE — THE FIVE STEPS — (1) FIXATION: nitrogen-fixing bacteria, many living in root nodules of legumes such as clover, beans and peas, convert N2 into ammonia (NH3); lightning fixes a smaller share. (2) NITRIFICATION: other soil bacteria oxidize ammonia to nitrite and then to nitrate (NO3-), the form plants take up best. (3) ASSIMILATION: plant roots absorb nitrate and build it into proteins and DNA; animals get their nitrogen by eating. (4) AMMONIFICATION: decomposers break down dead tissue and waste, returning nitrogen to the soil as ammonia. (5) DENITRIFICATION: denitrifying bacteria convert nitrate back to N2 gas, closing the loop to the atmosphere. Fixation and denitrification run in OPPOSITE directions — do not confuse them.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'framework', title: 'Water cycle', content: `WATER CYCLE — water EVAPORATES from oceans, lakes and soil, and TRANSPIRES out of leaf pores, both as vapor. Vapor rises, cools and CONDENSES into clouds, then falls as PRECIPITATION. On land it becomes RUNOFF into streams and rivers or infiltrates as GROUNDWATER in aquifers. Water is the vehicle the other cycles ride in: runoff is what carries nitrate off a field and into a river.` },
    { loId: 'bio.biogeochemical-cycles', content: `HUMAN DISRUPTION: EUTROPHICATION — nitrogen and phosphorus fertilizer that runs off farmland fertilizes ALGAE downstream just as effectively as crops. The algal bloom blocks light, then dies, then decomposers consume it — and those decomposers use up the dissolved oxygen. Fish suffocate, leaving a low-oxygen dead zone. Note that nothing was destroyed: the nutrients simply arrived in the wrong reservoir in the wrong amount.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'definition', title: 'nitrogen fixation', content: `the conversion of atmospheric N2 into ammonia, performed mainly by bacteria in soil and root nodules.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'definition', title: 'reservoir', content: `a place where matter is stored in a cycle, such as the atmosphere, the ocean, soil or fossil fuels.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'definition', title: 'transpiration', content: `the loss of water vapor from plant leaves, a major return of water to the atmosphere.` },
    { loId: 'bio.biogeochemical-cycles', kind: 'definition', title: 'eutrophication', content: `nutrient over-enrichment of water that triggers an algal bloom and the oxygen loss that follows it.` },
  ],
  methods: [
    {
      title: 'Worked trace carbon atom',
      steps: [
        `Start in the reservoir given: the atom is carbon in atmospheric CO2. To enter anything living it must be captured, and only one common process does that — photosynthesis.`,
        `Step 1, atmosphere → producer, by PHOTOSYNTHESIS: a grass plant takes in the CO2 and fixes the carbon into glucose. The atom is now part of a sugar, then part of the plant's cellulose and proteins. This is the only doorway into the food web.`,
        `Step 2, producer → consumer, by FEEDING: a cow eats the grass, digests it, and builds that carbon into its own muscle tissue. The atom has changed reservoirs but not identity — it is still carbon.`,
        `Step 3, consumer → atmosphere, by CELLULAR RESPIRATION: the cow breaks down some of that sugar for energy and exhales the carbon as CO2. If the atom takes this branch, the loop is already closed and it is back in the air.`,
        `Alternative step 3, consumer → soil → atmosphere, by DECOMPOSITION: instead, suppose the cow dies. Bacteria and fungi break down the body, use some carbon for their own respiration, and release CO2; the rest becomes soil organic matter.`,
        `Alternative long branch: if the remains were buried in sediment before decomposers could reach them, the carbon could sit in the slow fossil-fuel reservoir for millions of years, returning to the air only when that fuel is burned — COMBUSTION.`,
        `Note what never happened at any step: the atom was never created, destroyed or used up. It only moved between reservoirs — that is what "matter cycles" means.`,
      ],
      example: { problem: `A single carbon atom sits in a CO2 molecule in the air above a meadow. Trace one realistic path it could take from the atmosphere, into a living body, and eventually back to the atmosphere — naming the reservoir it occupies and the process that moves it at each step.`, solution: `Atmosphere (CO2) → grass, by photosynthesis → cow, by feeding → back to the atmosphere as CO2, by respiration (or by decomposition after death, or by combustion after millions of years as fossil fuel). The same atom is reused; only its reservoir changes.` },
      relatedLoIds: ['bio.biogeochemical-cycles'],
    },
    {
      title: 'Worked why not n2',
      steps: [
        `State the chemical obstacle: atmospheric nitrogen is N2, two nitrogen atoms held together by a triple bond. Breaking that bond takes a great deal of energy, and plants have no enzyme that can do it.`,
        `State what plants CAN absorb: roots take up nitrogen from the soil in already-broken-apart forms — nitrate (NO3-) or ammonium. Leaves do not absorb nitrogen; the uptake happens underground.`,
        `Identify who can break the bond: nitrogen-fixing bacteria, free-living in soil or housed in the root nodules of legumes, convert N2 into ammonia (NH3). Lightning fixes a small additional share by supplying enough energy to split N2 in the air.`,
        `Follow the chain to a usable form: nitrifying bacteria then oxidize that ammonia to nitrite and on to nitrate. Only now can the corn absorb it and assimilate it into proteins and DNA.`,
        `Answer the farmer's version of the question: this is exactly why a field is rotated with clover or soybeans, or dosed with manufactured fertilizer. Both routes deliver fixed nitrogen the plant can actually take up — the atmosphere alone cannot.`,
      ],
      example: { problem: `The air surrounding a corn plant is 78% nitrogen gas, and the plant is visibly nitrogen-starved — pale, yellowing leaves. Explain why the plant cannot simply use the nitrogen all around it, and name what would have to happen first.`, solution: `The triple bond in N2 makes atmospheric nitrogen chemically unavailable to plants, and plants absorb nitrogen only through their roots as nitrate or ammonium. Nitrogen-fixing bacteria (or lightning) must first convert N2 to ammonia, and nitrifying bacteria convert that to nitrate, before the corn can use it.` },
      relatedLoIds: ['bio.biogeochemical-cycles'],
    },
  ],
  pointers: [
    { content: `Energy and matter behave differently, and that contrast is the whole point of this lesson. Energy enters as sunlight, is degraded to heat at every transfer, and leaves the ecosystem for good, so the supply must be constant. Atoms are never destroyed: a carbon atom released by respiration is available for photosynthesis again, and a nitrogen atom returned by ammonification can be reabsorbed by the next plant. Ecosystems recycle matter indefinitely — what humans disrupt is not the total amount of carbon or nitrogen, but how much sits in which reservoir and how fast it moves between them.`, kind: 'common-error' },
    { content: `Matter CYCLES and is reused indefinitely; energy FLOWS one way, in as sunlight and out as heat. Every cycle question is "which reservoir, moved by which process?"`, kind: 'tip' },
    { content: `Carbon: photosynthesis removes CO2 from the air; respiration, decomposition and combustion return it. Fossil fuels are the slow reservoir, and burning them faster than the cycle can absorb is why atmospheric CO2 is rising.`, kind: 'tip' },
    { content: `Nitrogen: N2 is 78% of the air but unusable, so bacteria are the indispensable step — fixation (N2 → NH3, in legume root nodules; lightning helps), nitrification (→ NO3-), assimilation by roots, ammonification by decomposers, denitrification back to N2.`, kind: 'tip' },
    { content: `Plants absorb nitrogen through their ROOTS as nitrate or ammonium — never as N2 through their leaves. Fixation and denitrification run in opposite directions.`, kind: 'tip' },
    { content: `Water: evaporation and transpiration → condensation → precipitation → runoff and groundwater. Runoff is what carries fertilizer into lakes.`, kind: 'tip' },
    { content: `Eutrophication: nutrient runoff → algal bloom → the bloom dies → decomposers strip the dissolved oxygen → fish suffocate.`, kind: 'tip' },
    { content: `Don't say plants "breathe in nitrogen." Plants take nitrogen up through **roots**, as nitrate (NO3-) or ammonium — never as N2 through leaves. Leaves take in CO2; roots take in nitrogen. Keep those two gates separate.`, kind: 'common-error' },
    { content: `Fixation and denitrification are opposites: fixation is N2 → ammonia (into the soil/living world), denitrification is nitrate → N2 (back to the atmosphere). If your arrow points toward the air, it's denitrification.`, kind: 'vocab-note' },
    { content: `Nitrification ≠ nitrogen fixation. Nitrification is bacteria converting ammonia → nitrite → nitrate, all already in the soil. Ammonification is decomposers returning dead tissue to ammonia. Three different '-ation' words, three different starting materials.`, kind: 'vocab-note' },
    { content: `Never write that organisms "use up" carbon or nitrogen. Atoms are only relocated between reservoirs. Only ENERGY is degraded and lost as heat. If your sentence would work with either word, you haven't shown the contrast.`, kind: 'gotcha' },
    { content: `Fossil fuel burning doesn't add new carbon to Earth — it moves carbon from a slow reservoir (underground, millions of years) into a fast one (atmosphere, decades). Frame human disruption as *rate and location*, not creation or destruction of matter.`, kind: 'gotcha' },
    { content: `In eutrophication, it's the DECOMPOSERS that consume the oxygen, not the algae. The bloom must die first. Skipping the die-off step ('algae used all the oxygen') breaks the causal chain.`, kind: 'common-error' },
    { content: `Transpiration is water vapor leaving LEAVES; evaporation is water leaving open surfaces like oceans, lakes and soil. Both send vapor up, but don't use them interchangeably — a diagram arrow from a plant must be labeled transpiration.`, kind: 'vocab-note' },
    { content: `Root nodules only occur on legumes (clover, beans, peas, soybeans) — corn and grasses have none and depend on free-living soil bacteria or fertilizer. That's why crop rotation with legumes works.`, kind: 'edge-case' },
  ],
};
