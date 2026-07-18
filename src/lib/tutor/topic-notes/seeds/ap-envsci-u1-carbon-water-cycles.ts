/**
 * AP Environmental Science — Unit 1 CED 1.4+1.7: Carbon and Water Cycles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.carbon-water-cycles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_CARBON_WATER_CYCLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.carbon-water-cycles.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.4+1.7',
  cedTitle: 'Carbon and Water Cycles',
  planId: 'evelyn.ap.envsci.carbon-water-cycles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.carbon-water-cycles.v1' }],
  theory: [
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'biogeochemical cycle', content: `a BIOGEOCHEMICAL CYCLE is the movement of an element between RESERVOIRS (where it is stored) via PROCESSES (the fluxes that move it). Carbon, water, nitrogen, and phosphorus each cycle this way. The atoms are conserved — they never leave Earth, they just change form and location.` },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'reservoir', content: `a RESERVOIR is a place where an element is stored within a cycle. Reservoirs differ in size and in how fast carbon moves in and out — the ocean and rocks turn over slowly, the atmosphere and biomass turn over fast.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `CARBON RESERVOIRS: ATMOSPHERE (CO₂, around 420 ppm today, up from about 280 ppm pre-industrial); OCEANS (dissolved CO₂ and bicarbonate — the LARGEST active reservoir); LIVING BIOMASS (plants and animals); SOILS (dead organic matter / humus); FOSSIL FUELS (coal, oil, natural gas — slow to cycle naturally); SEDIMENTARY ROCKS (limestone, calcium carbonate — geologically slow).` },
    { loId: 'apenvsci.carbon-water-cycles', content: `CARBON PROCESSES: PHOTOSYNTHESIS pulls CO₂ from the atmosphere and fixes it into glucose (CO₂ + H₂O + sunlight yields C₆H₁₂O₆ + O₂). CELLULAR RESPIRATION is the reverse — organisms break down glucose and release CO₂. Photosynthesis and respiration are MIRROR processes and together dominate the fast carbon cycle.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `MORE CARBON PROCESSES: DECOMPOSITION (bacteria/fungi break down dead organisms, releasing CO₂); COMBUSTION (burning fossil fuels, wood, or biomass releases CO₂ rapidly — natural wildfires do this too); OCEAN ABSORPTION (CO₂ dissolves in seawater, forming carbonic acid, driving OCEAN ACIDIFICATION); SEDIMENTATION (marine organisms like corals and shellfish lock carbon into calcium-carbonate sediments).` },
    { loId: 'apenvsci.carbon-water-cycles', content: `HUMAN DISRUPTIONS to the carbon cycle: BURNING FOSSIL FUELS transfers slow-cycle carbon (locked underground for millions of years) into the fast atmospheric pool; DEFORESTATION both removes future photosynthesis AND releases stored carbon when trees are cut/burned; CEMENT PRODUCTION emits CO₂. Net result: a RAPID rise in atmospheric CO₂, driving climate change.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `WATER (HYDROLOGIC) CYCLE PROCESSES, part 1: EVAPORATION (liquid to gas, mostly from oceans and lakes); TRANSPIRATION (water released from plant leaves through stomata); CONDENSATION (gas back to liquid, forming clouds); PRECIPITATION (rain, snow, sleet falling to the surface). Evaporation + transpiration together are sometimes called EVAPOTRANSPIRATION.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `WATER CYCLE PROCESSES, part 2: RUNOFF (surface water flowing into streams, rivers, oceans); INFILTRATION (water seeping down into soil); PERCOLATION (deeper soil water reaching groundwater); GROUNDWATER stored in AQUIFERS (underground reservoirs that recharge slowly).` },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'transpiration', content: `TRANSPIRATION is water released from plant leaves into the atmosphere through pores called stomata. Forests move enormous water volumes this way, so removing them dries out downwind regions.` },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'aquifer', content: `an AQUIFER is an underground reservoir of groundwater. Aquifers recharge slowly, so over-pumping for irrigation or cities can deplete them faster than they refill.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `HUMAN DISRUPTIONS to the water cycle: PAVING creates impervious surfaces that INCREASE runoff and DECREASE infiltration (more flooding, less aquifer recharge); AQUIFER DEPLETION from over-pumping; DAMMING alters streamflow and traps sediment; DEFORESTATION cuts transpiration, so downwind regions get less rainfall.` },
  ],
  methods: [
    {
      title: 'Trace a disturbance through BOTH the carbon and water cycles',
      when_to_use: 'When an FRQ names a land-use change (deforestation, paving, damming) and asks for effects on carbon and/or water.',
      steps: [
        `STEP 1 — CARBON side. Ask what happens to stored carbon and to photosynthesis. Cutting/burning biomass RELEASES CO₂ immediately AND removes future CO₂ uptake.`,
        `STEP 2 — WATER side. Ask what happens to transpiration, runoff, and infiltration. Removing trees cuts transpiration; paving raises runoff and lowers infiltration.`,
        `STEP 3 — CONNECT to consequences: atmospheric CO₂ rise drives climate change (carbon); altered runoff/rainfall drives flooding, drought, or aquifer decline (water).`,
        `STEP 4 — STATE that both cycles are disrupted simultaneously, and name the scale (global for carbon, regional/local for water).`,
      ],
      example: { problem: `Explain how deforestation in the Amazon affects BOTH the carbon cycle and the water cycle.`, solution: `CARBON: trees store large amounts of carbon; cutting and burning releases CO₂ now and ends future photosynthetic uptake, so atmospheric CO₂ rises (climate change). WATER: trees transpire huge water volumes; removing them lowers atmospheric water vapor over the region, reducing local precipitation and drying downwind areas. Both cycles disrupted at once — globally for carbon, regionally for water.` },
      relatedLoIds: ['apenvsci.carbon-water-cycles'],
    },
  ],
  pointers: [
    { content: 'Photosynthesis and respiration are mirror processes: one removes CO₂, the other releases it.', kind: 'tip' },
    { content: 'Combustion + deforestation are the two biggest human CO₂ sources; cement is a smaller third.', kind: 'tip' },
    { content: 'Ocean is the largest ACTIVE carbon reservoir; CO₂ dissolving there drives ocean acidification.', kind: 'tip' },
    { content: 'Paving raises runoff and cuts infiltration -> more flooding, less aquifer recharge.', kind: 'tip' },
    { content: 'Transpiration is plant-driven; deforestation lowers it and dries downwind regions.', kind: 'tip' },
    { content: 'Fossil fuels move slow-cycle carbon into the fast atmospheric pool -> geologically rapid CO₂ rise.', kind: 'tip' },
  ],
};
