/**
 * AP Environmental Science — Unit 5 CED 5.10+5.13: Urbanization and Stormwater.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.urbanization-water.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_URBANIZATION_WATER: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.urbanization-water.v1',
  course: 'AP Environmental Science',
  cedUnit: 5,
  cedTopic: '5.10+5.13',
  cedTitle: 'Urbanization and Stormwater',
  planId: 'evelyn.ap.envsci.urbanization-water.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.urbanization-water.v1' }],
  theory: [
    { loId: 'apenvsci.urbanization-water', content: `URBANIZATION: shift of population from rural to urban areas. Currently >55% urban; projected 68% by 2050.` },
    { loId: 'apenvsci.urbanization-water', content: 'URBAN ENVIRONMENTAL IMPACTS:' },
    { loId: 'apenvsci.urbanization-water', content: `  • IMPERVIOUS SURFACES: pavement, roofs prevent water infiltration → stormwater runoff dominates.` },
    { loId: 'apenvsci.urbanization-water', content: `  • URBAN HEAT ISLAND: cities are 2-7°C warmer than surrounding rural areas due to concrete absorbing heat, reduced vegetation, building waste heat. Worse during summer; raises AC demand → more emissions.` },
    { loId: 'apenvsci.urbanization-water', content: `  • AIR POLLUTION: concentrated emissions from vehicles, buildings, industry. Higher PM2.5, NOx, ozone.` },
    { loId: 'apenvsci.urbanization-water', content: `  • LIGHT POLLUTION: bright sky disrupts ecosystems (migrating birds disoriented, etc.) and human circadian rhythms.` },
    { loId: 'apenvsci.urbanization-water', content: `  • HABITAT LOSS / FRAGMENTATION: forests and wetlands replaced; remaining green spaces small and isolated.` },
    { loId: 'apenvsci.urbanization-water', content: '  • WASTE: huge volumes of municipal waste, sewage, hazardous waste.' },
    { loId: 'apenvsci.urbanization-water', content: '  • NOISE POLLUTION: stress on humans + wildlife.' },
    { loId: 'apenvsci.urbanization-water', content: 'STORMWATER PROBLEM in cities:' },
    { loId: 'apenvsci.urbanization-water', content: '  • Rain falls on impervious surfaces.' },
    { loId: 'apenvsci.urbanization-water', content: '  • Concentrated in storm drains → discharged into streams/rivers RAPIDLY.' },
    { loId: 'apenvsci.urbanization-water', content: `  • Carries: oil from cars, road salt, sediment, pet waste, lawn fertilizer/pesticides, heavy metals.` },
    { loId: 'apenvsci.urbanization-water', content: `  • COMBINED SEWER OVERFLOWS (CSOs): in older cities (Boston, NYC, etc.), stormwater + sewage share same pipes. Heavy rain overwhelms treatment plant → raw sewage discharged into waterways.` },
    { loId: 'apenvsci.urbanization-water', content: `  • Result: streams flooded with polluted runoff during storms; flow drops to nothing between storms.` },
    { loId: 'apenvsci.urbanization-water', content: 'GREEN INFRASTRUCTURE — design strategies that mimic natural water cycling:' },
    { loId: 'apenvsci.urbanization-water', content: `  • RAIN GARDENS: shallow plantings designed to collect runoff and let it infiltrate.` },
    { loId: 'apenvsci.urbanization-water', content: '  • PERMEABLE PAVEMENT: porous concrete/pavers allow water to soak through.' },
    { loId: 'apenvsci.urbanization-water', content: '  • GREEN ROOFS: vegetation on rooftops; absorbs rain, reduces heat island.' },
    { loId: 'apenvsci.urbanization-water', content: '  • CONSTRUCTED WETLANDS: filter pollutants and store stormwater.' },
    { loId: 'apenvsci.urbanization-water', content: '  • BIOSWALES: vegetated channels along roads that slow and clean runoff.' },
    { loId: 'apenvsci.urbanization-water', content: '  • RAIN BARRELS / CISTERNS: collect rainwater for reuse.' },
    { loId: 'apenvsci.urbanization-water', content: `  • TREE CANOPY: intercept rain; cool through evapotranspiration; combat heat island.` },
    { loId: 'apenvsci.urbanization-water', content: '  • POROUS PARKING LOTS, swales, infiltration basins.' },
    { loId: 'apenvsci.urbanization-water', content: 'URBAN PLANNING FOR SUSTAINABILITY:' },
    { loId: 'apenvsci.urbanization-water', content: '  • Mixed-use zoning (reduces car trips).' },
    { loId: 'apenvsci.urbanization-water', content: '  • Public transit investment.' },
    { loId: 'apenvsci.urbanization-water', content: '  • Bicycle/pedestrian infrastructure.' },
    { loId: 'apenvsci.urbanization-water', content: '  • PRESERVE green space (parks, urban forests).' },
    { loId: 'apenvsci.urbanization-water', content: '  • DENSITY (taller buildings) reduces sprawl.' },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'impervious surface', content: 'pavement/concrete that prevents water infiltration.' },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'urban heat island', content: '2-7°C warmer in cities due to concrete + reduced vegetation.' },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'green infrastructure', content: 'natural-process design (rain gardens, etc.) for stormwater.' },
  ],
  methods: [
    {
      title: 'Worked runoff',
      steps: [
        'STEP 1 — INFILTRATION DECREASES: paved surfaces prevent water from soaking in.',
        `STEP 2 — RUNOFF INCREASES: water flows off paved surfaces into storm drains rapidly.`,
        'STEP 3 — Stream peak flows INCREASE during storms — flooding risk rises.',
        `STEP 4 — Stream BASE FLOW (between storms) DECREASES — less groundwater recharge keeping the stream flowing.`,
        `STEP 5 — Stream water QUALITY degrades: sediment, oil, road salt, fertilizer enter via runoff.`,
        `STEP 6 — AQUATIC HABITAT degraded: flashier flows, warmer water (concrete heated), polluted.`,
        `STEP 7 — Downstream COMMUNITIES have higher flood risk and water-treatment costs.`,
      ],
      example: { problem: `A 50-acre forested watershed is converted to a strip mall. Predict three changes to local water hydrology.`, solution: 'Less infiltration, more runoff, flash floods, polluted water, degraded streams.' },
      relatedLoIds: ['apenvsci.urbanization-water'],
    },
  ],
  pointers: [
    { content: 'Urbanization: imperv surfaces, heat island, air/light pollution, habitat loss.', kind: 'tip' },
    { content: `Stormwater carries pollution; CSOs in older cities discharge sewage during storms.`, kind: 'tip' },
    { content: `Green infrastructure: rain gardens, permeable pavement, green roofs, bioswales, trees.`, kind: 'tip' },
    { content: 'Green infrastructure economics often beats gray infrastructure long-term.', kind: 'tip' },
  ],
};
