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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.carbon-water-cycles.v1' }],
  theory: [
    { loId: 'apenvsci.carbon-water-cycles', content: `BIOGEOCHEMICAL CYCLE: elements cycle between RESERVOIRS (where they're stored) via PROCESSES (fluxes).` },
    { loId: 'apenvsci.carbon-water-cycles', content: 'CARBON CYCLE — RESERVOIRS:' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Atmosphere: CO₂ (~420 ppm in 2024, up from ~280 pre-industrial).' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Oceans: dissolved CO₂, bicarbonate (largest active reservoir).' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Living biomass: plants, animals.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Soils: dead organic matter (humus).' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Fossil fuels (coal, oil, natural gas) — slow to cycle naturally.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • Sedimentary rocks (limestone, calcium carbonate) — geologically slow.' },
    { loId: 'apenvsci.carbon-water-cycles', content: 'CARBON CYCLE — PROCESSES:' },
    { loId: 'apenvsci.carbon-water-cycles', content: `  • PHOTOSYNTHESIS: plants take CO₂ from atmosphere, fix into glucose. CO₂ + H₂O + sunlight → C₆H₁₂O₆ + O₂.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `  • CELLULAR RESPIRATION: organisms break down glucose, release CO₂. Reverse of photosynthesis.` },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • DECOMPOSITION: bacteria/fungi break down dead organisms; release CO₂.' },
    { loId: 'apenvsci.carbon-water-cycles', content: `  • COMBUSTION: burning fossil fuels (or wood/biomass) releases CO₂ rapidly. NATURAL fires also do this.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `  • OCEAN ABSORPTION: CO₂ dissolves in seawater (forms carbonic acid → ocean acidification).` },
    { loId: 'apenvsci.carbon-water-cycles', content: `  • SEDIMENTATION: marine organisms (corals, shells) lock C into calcium carbonate sediments.` },
    { loId: 'apenvsci.carbon-water-cycles', content: `HUMAN DISRUPTIONS to carbon cycle: burning fossil fuels (transfers slow-cycle C to atmosphere); deforestation (less photosynthesis + immediate release); cement production. Net result: rapid increase in atmospheric CO₂ → climate change.` },
    { loId: 'apenvsci.carbon-water-cycles', content: 'WATER (HYDROLOGIC) CYCLE — PROCESSES:' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • EVAPORATION: liquid → gas (oceans, lakes).' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • TRANSPIRATION: water released from plant leaves (via stomata).' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • CONDENSATION: gas → liquid; forms clouds.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • PRECIPITATION: rain, snow, sleet falling to surface.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • RUNOFF: surface water flowing into streams/rivers/oceans.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • INFILTRATION: water seeping into soil.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • GROUNDWATER (in AQUIFERS): underground reservoirs; recharge slowly.' },
    { loId: 'apenvsci.carbon-water-cycles', content: '  • PERCOLATION: deeper soil water reaching groundwater.' },
    { loId: 'apenvsci.carbon-water-cycles', content: `HUMAN DISRUPTIONS to water cycle: paving (impervious surfaces increase runoff, decrease infiltration → more flooding, less aquifer recharge); aquifer depletion (over-pumping for irrigation/cities); damming (alters streamflow, sedimentation); deforestation (less transpiration → drier downwind regions).` },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'reservoir', content: 'a place where an element is stored within a cycle.' },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'transpiration', content: 'water released from plant leaves into atmosphere.' },
    { loId: 'apenvsci.carbon-water-cycles', kind: 'definition', title: 'aquifer', content: 'underground reservoir of groundwater.' },
  ],
  methods: [
    {
      title: 'Worked disruption',
      steps: [
        `STEP 1 — CARBON: Trees store huge amounts of carbon in biomass. Cutting and burning releases CO₂ to atmosphere immediately. Future absorption (photosynthesis) is also lost. Net: more CO₂ in atmosphere → climate change.`,
        `STEP 2 — WATER: Trees transpire enormous water volumes. Loss reduces atmospheric water vapor over the region → less local precipitation → drier downwind areas.`,
        `STEP 3 — Both cycles disrupted simultaneously. Amazon deforestation contributes globally (carbon) AND regionally (water).`,
      ],
      example: { problem: `Explain how deforestation in the Amazon affects BOTH the carbon cycle AND the water cycle.`, solution: `Deforestation: releases stored C, halts photosynthesis (carbon cycle); reduces transpiration → less rainfall (water cycle).` },
      relatedLoIds: ['apenvsci.carbon-water-cycles'],
    },
  ],
  pointers: [
    { content: `CARBON: photosynthesis ↔ respiration; decomposition; combustion; ocean absorption.`, kind: 'tip' },
    { content: 'Reservoirs: atmosphere, ocean, biomass, soil, fossil fuels, rocks.', kind: 'tip' },
    { content: `WATER: evap, transpiration, condensation, precipitation, runoff, infiltration, groundwater.`, kind: 'tip' },
    { content: 'Human impact: combustion (C); pavement, dams, deforestation (water).', kind: 'tip' },
  ],
};
