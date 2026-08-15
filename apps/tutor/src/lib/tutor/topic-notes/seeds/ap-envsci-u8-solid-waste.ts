/**
 * AP Environmental Science — Unit 8 CED 8.9-8.10: Solid Waste.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.solid-waste.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_SOLID_WASTE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.solid-waste.v1',
  course: 'AP Environmental Science',
  cedUnit: 8,
  cedTopic: '8.9-8.10',
  cedTitle: 'Solid Waste',
  planId: 'evelyn.ap.envsci.solid-waste.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.solid-waste.v1' }],
  theory: [
    { loId: 'apenvsci.solid-waste', content: `MUNICIPAL SOLID WASTE (MSW) is household and commercial trash — roughly 268 million tons per year in the US. By composition it is mostly PAPER (~25%), FOOD (~22%), PLASTICS (~12%), YARD WASTE (~12%), and METALS (~9%). Knowing the big fractions helps you reason about which reduction strategies matter most.` },
    { loId: 'apenvsci.solid-waste', content: `THE WASTE HIERARCHY ranks strategies from MOST to LEAST preferred: (1) REFUSE/REDUCE — do not generate the waste at all; (2) REUSE — use the item again as-is; (3) RECYCLE — process material into new products; (4) RECOVER — capture energy from waste (waste-to-energy incineration, landfill methane); (5) DISPOSE — landfill or plain incineration as a last resort. Always argue for the HIGHEST rung first on an FRQ.` },
    { loId: 'apenvsci.solid-waste', content: `SANITARY LANDFILLS are engineered: a plastic-and-clay LINER prevents leakage, waste is covered daily with soil, a LEACHATE collection system pumps out toxic liquid, and METHANE from organic decomposition is often captured for energy. Methane matters because CH₄ is about 25 times more potent as a greenhouse gas than CO₂.` },
    { loId: 'apenvsci.solid-waste', content: `LANDFILL PROBLEMS: large LAND USE (each site is tens to over a hundred acres); LEACHATE can still contaminate GROUNDWATER despite liners; METHANE EMISSIONS; NIMBY siting resistance; landfills eventually FILL UP and new ones are hard to permit; and each requires closure plus a 30-year monitoring period. Fresh Kills in New York was the world's largest until it closed in 2001.` },
    { loId: 'apenvsci.solid-waste', content: `INCINERATION burns waste at high temperature and REDUCES VOLUME BY ABOUT 90% — valuable where land is scarce — and modern WASTE-TO-ENERGY plants recover electricity. Problems: AIR POLLUTION (dioxins, furans, particulates, and heavy metals like mercury and lead; scrubbers reduce but do not eliminate it), TOXIC ASH (about 10% of original mass) needing special landfill disposal, and reduced recycling incentive. It is common in EUROPE and JAPAN where land is limited.` },
    { loId: 'apenvsci.solid-waste', content: `OCEAN DUMPING historically discharged industrial waste, sewage, and garbage at sea; the LONDON CONVENTION (1972) banned dumping of certain wastes and the LONDON PROTOCOL (1996) is stricter still. Today PLASTIC POLLUTION dominates: roughly 8 MILLION TONS of plastic enter the oceans yearly, the GREAT PACIFIC GARBAGE PATCH spans about 1.6 million square kilometers, and MICROPLASTICS (under 5 mm) turn up in marine animals, drinking water, salt, and human bodies, while larger plastics entangle turtles and marine mammals or smother benthic habitats.` },
    { loId: 'apenvsci.solid-waste', content: `RECYCLING payoffs vary by material: ALUMINUM saves about 95% of the energy versus new mining; PAPER runs about 60% recycled in the US; GLASS is essentially infinitely recyclable. PLASTICS are the hard case — different resin types (PET, HDPE, PVC) need separation and only about 9% of plastic has ever been recycled, with quality degrading each cycle ("downcycling"). E-WASTE holds valuable metals (gold, copper) alongside toxics (lead, mercury) and is often shipped abroad for risky disposal.` },
    { loId: 'apenvsci.solid-waste', content: `COMPOSTING decomposes organic waste (food, yard trimmings) into a soil amendment. It DIVERTS material from landfills, REDUCES METHANE emissions from buried organics, and RETURNS NUTRIENTS to the soil — a high-value "recover" strategy for the largest MSW fractions.` },
    { loId: 'apenvsci.solid-waste', content: `HAZARDOUS WASTE poses a substantial threat to health or environment and falls into four categories: IGNITABLE, CORROSIVE, REACTIVE, and TOXIC. Examples include paint thinners, motor oil, batteries, industrial chemicals, e-waste, and medical waste. RCRA (Resource Conservation and Recovery Act, 1976) regulates hazardous waste "cradle to grave," and SUPERFUND (CERCLA, 1980) funds cleanup of historic toxic sites — spurred by the LOVE CANAL disaster (1978).` },
    { loId: 'apenvsci.solid-waste', kind: 'definition', title: 'sanitary landfill', content: `a lined, soil-covered, leachate- and methane-managed waste-disposal site engineered to limit groundwater and air contamination.` },
    { loId: 'apenvsci.solid-waste', kind: 'definition', title: 'leachate', content: `toxic liquid runoff that percolates through a landfill and must be collected to protect groundwater.` },
    { loId: 'apenvsci.solid-waste', kind: 'definition', title: 'waste hierarchy', content: `the preference ranking reduce > reuse > recycle > recover > dispose, favoring source reduction over disposal.` },
  ],
  methods: [
    {
      title: 'Compare disposal methods and apply the waste hierarchy',
      when_to_use: `When asked to evaluate landfilling vs incineration vs recycling, or to apply reduce/reuse/recycle to a waste stream.`,
      steps: [
        `STEP 1 — LANDFILL: pros are cheap and simple; cons are land use, persistence (plastic does not decompose), leachate risk, and methane from any organics.`,
        `STEP 2 — INCINERATION: pros are ~90% volume reduction and energy recovery; cons are dioxin and metal emissions if poorly controlled, toxic ash to landfill, and reduced recycling incentive.`,
        `STEP 3 — RECYCLING: pros are avoided new production (saves energy and emissions) and reduced landfill volume; cons are contamination of sorted streams, limited economic recyclability, and quality loss over cycles.`,
        `STEP 4 — CLIMB THE HIERARCHY: recommend REDUCE first (refusing single-use items is most effective), then reuse, then recycle/compost what remains, and dispose only as the last resort.`,
      ],
      example: {
        problem: `Compare landfilling, incineration, and recycling for plastic waste, giving a pro and con of each, then state best practice.`,
        solution: `Landfill: cheap but plastic persists and occupies land. Incineration: 90% volume reduction and energy recovery but risks dioxin emissions and toxic ash. Recycling: prevents new plastic production but only ~9% is recycled and quality degrades. Best practice: REDUCE single-use plastic first, then recycle what is recyclable.`,
      },
      relatedLoIds: ['apenvsci.solid-waste'],
    },
  ],
  pointers: [
    { content: `Waste hierarchy: refuse > reduce > reuse > recycle > recover > dispose. Argue the HIGHEST rung first on FRQs.`, kind: 'tip' },
    { content: `Sanitary landfills: liner + daily soil cover + leachate collection + methane capture. Still finite and land-hungry.`, kind: 'tip' },
    { content: `Incineration cuts volume ~90% but emits dioxins/metals and leaves toxic ash; common where land is scarce.`, kind: 'tip' },
    { content: `Only ~9% of plastic is ever recycled; aluminum recycling saves ~95% of energy; glass is infinitely recyclable.`, kind: 'tip' },
    { content: `Hazardous waste laws: RCRA (cradle-to-grave, 1976) and Superfund/CERCLA (1980), sparked by Love Canal.`, kind: 'tip' },
  ],
};
