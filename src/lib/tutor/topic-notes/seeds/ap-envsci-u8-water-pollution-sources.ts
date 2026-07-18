/**
 * AP Environmental Science — Unit 8 CED 8.1-8.2+8.4: Water Pollution Sources.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.water-pollution-sources.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_WATER_POLLUTION_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.water-pollution-sources.v1',
  course: 'AP Environmental Science',
  cedUnit: 8,
  cedTopic: '8.1-8.2+8.4',
  cedTitle: 'Water Pollution Sources',
  planId: 'evelyn.ap.envsci.water-pollution-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.water-pollution-sources.v1' }],
  theory: [
    { loId: 'apenvsci.water-pollution-sources', content: `TWO SOURCE CATEGORIES drive every FRQ on water pollution. POINT SOURCES come from a single, identifiable, fixed location — a sewage-treatment outfall, a factory discharge pipe, an oil-tanker spill, a chemical-plant pipe. Because you can point to them, they are EASIER TO REGULATE, monitor, and permit.` },
    { loId: 'apenvsci.water-pollution-sources', content: `NONPOINT SOURCES are DIFFUSE and hard to trace to one origin — agricultural runoff (fertilizer, pesticide), urban runoff (oil, lawn chemicals), atmospheric deposition of mercury, construction sediment. They contribute the LARGER total pollution load and are MUCH HARDER TO REGULATE because there is no single pipe to cap.` },
    { loId: 'apenvsci.water-pollution-sources', content: `MAJOR POLLUTANT TYPES: (a) PATHOGENS — bacteria/viruses/parasites from sewage and livestock waste; cause cholera, typhoid, dysentery. (b) OXYGEN-DEMANDING WASTES — organic matter decomposers break down while consuming dissolved oxygen (sewage, food processing). (c) INORGANIC NUTRIENTS (N and P) — drive EUTROPHICATION. (d) TOXIC HEAVY METALS (lead, mercury, arsenic) — bioaccumulate and persist. (e) SYNTHETIC ORGANIC COMPOUNDS — pesticides, PCBs, pharmaceuticals. (f) SEDIMENT from erosion blocks light and smothers eggs/larvae. (g) RADIOACTIVE waste from mining/nuclear/medical sources. (h) THERMAL — heated discharge reduces dissolved oxygen.` },
    { loId: 'apenvsci.water-pollution-sources', content: `SURFACE WATER (rivers, lakes, oceans) is EASIER TO CLEAN — sunlight, mixing, and aeration speed recovery, and the pollution is visible. GROUNDWATER in AQUIFERS sits below the surface: it is SLOW TO CONTAMINATE and SLOW TO CLEAN. Once polluted it can take DECADES TO CENTURIES to recover because water moves only inches per year, sunlight cannot break down pollutants, and microbial activity is low.` },
    { loId: 'apenvsci.water-pollution-sources', content: `GROUNDWATER contamination sources: leaking underground gasoline tanks, septic systems, fracking fluid, and agricultural nitrates. Contamination is often HIDDEN until wells begin to fail — by which point the plume is widespread. Roughly 30% of US drinking water comes from groundwater, so the stakes are high.` },
    { loId: 'apenvsci.water-pollution-sources', content: `INDICATOR SPECIES reveal water quality by their presence or absence. MAYFLIES and STONEFLIES indicate CLEAN, well-oxygenated water; MIDGE LARVAE and BLACKWORMS indicate POLLUTED, low-oxygen water. A shift in the invertebrate community is an early warning of degradation.` },
    { loId: 'apenvsci.water-pollution-sources', content: `CLEAN WATER ACT (1972, US) regulates POINT SOURCES through NPDES (National Pollutant Discharge Elimination System) permits, which set discharge limits pipe-by-pipe. Its authority over NONPOINT SOURCES is weak — which is why agricultural and urban runoff remain the dominant unsolved water-pollution problem today.` },
    { loId: 'apenvsci.water-pollution-sources', content: `WETLANDS (swamps, marshes, bogs, fens) are saturated-soil ecosystems that deliver disproportionate ecosystem services: WATER PURIFICATION (plants and microbes break down pollutants), FLOOD CONTROL (they act as sponges), SEDIMENT TRAPPING, HABITAT (about 50% of North American bird species use wetlands), CARBON STORAGE in peat, and GROUNDWATER RECHARGE. Threat: drainage for agriculture and development has erased roughly 50% of US wetlands and over 85% in some states.` },
    { loId: 'apenvsci.water-pollution-sources', content: `MANGROVES are salt-tolerant trees on tropical and subtropical coasts. Functions: PROTECT COASTS by dampening storm waves, PREVENT EROSION via dense root systems that hold sediment, serve as NURSERIES for fisheries (shrimp, crabs, fish), and store roughly 5x more carbon per area than terrestrial forests. Threats: shrimp aquaculture, coastal development, and sea-level rise — about 30-50% of historical mangrove cover is already gone, disappearing 1-2% per year.` },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'point source', content: `an identifiable, fixed-location pollution discharge (pipe, outfall, spill) that is comparatively easy to regulate.` },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'nonpoint source', content: `diffuse pollution with no single origin (agricultural and urban runoff, atmospheric deposition); the larger and harder-to-control load.` },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'mangrove', content: `salt-tolerant tropical/subtropical coastal tree providing storm protection, erosion control, fishery nurseries, and large carbon storage.` },
  ],
  methods: [
    {
      title: 'Classify a water pollution source as point or nonpoint',
      when_to_use: `When an FRQ or MCQ gives a specific pollution scenario and asks for the source category or why it is hard to regulate.`,
      steps: [
        `STEP 1 — ASK: can I point to ONE fixed, identifiable location where the pollution enters the water? A pipe, outfall, or single spill site means POINT SOURCE.`,
        `STEP 2 — IF THE POLLUTION is spread across a wide area and rainfall-dependent (runoff from many fields, lawns, roads, or the atmosphere), classify it as NONPOINT SOURCE.`,
        `STEP 3 — LINK TO REGULATION: point sources are controlled by Clean Water Act NPDES permits; nonpoint sources fall largely outside that authority, which is why they dominate remaining pollution.`,
        `STEP 4 — NAME THE POLLUTANT TYPE (pathogen, oxygen-demanding waste, nutrient, toxic metal, sediment, thermal) to strengthen an FRQ answer.`,
      ],
      example: {
        problem: `Classify each as POINT or NONPOINT: (a) wastewater pipe from a sewage plant, (b) lawn fertilizer washed into a stream during rain, (c) oil-tanker spill, (d) atmospheric deposition of mercury onto a lake.`,
        solution: `(a) POINT — single identifiable pipe. (b) NONPOINT — diffuse across many lawns, rainfall-dependent. (c) POINT — one identifiable spill location. (d) NONPOINT — atmospheric source spread across the watershed.`,
      },
      relatedLoIds: ['apenvsci.water-pollution-sources'],
    },
  ],
  pointers: [
    { content: `Point = one pipe/spill you can point to; nonpoint = diffuse runoff. Nonpoint is the bigger, harder load.`, kind: 'tip' },
    { content: `Clean Water Act 1972 controls POINT sources via NPDES; nonpoint runoff stays largely unregulated.`, kind: 'tip' },
    { content: `Groundwater is slow to pollute AND slow to clean — decades to centuries; no sunlight, little microbial breakdown.`, kind: 'tip' },
    { content: `Wetlands = flood control, water purification, habitat, carbon storage. Mangroves add storm and erosion protection.`, kind: 'tip' },
    { content: `Indicator species: mayflies/stoneflies = clean water; midge larvae/blackworms = polluted water.`, kind: 'tip' },
  ],
};
