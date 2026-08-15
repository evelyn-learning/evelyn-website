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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.urbanization-water.v1' }],
  theory: [
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'urbanization', content: `the shift of population from rural to urban areas. The world is currently more than 55% urban, projected to reach about 68% by 2050. Cities cover roughly 3% of land but concentrate people, energy use, and pollution — so their per-area environmental impact is intense.` },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'impervious surface', content: `pavement, roofs, and concrete that PREVENT water from infiltrating the ground. The more impervious a city, the more rainfall becomes fast surface runoff instead of soaking in to recharge groundwater — the root cause of the urban stormwater problem.` },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'urban heat island', content: `cities run about 2 to 7 degrees Celsius WARMER than surrounding rural areas because concrete and asphalt absorb heat, vegetation is reduced, and buildings and vehicles release waste heat. Worst in summer; it raises air-conditioning demand, which drives more emissions in a feedback loop.` },
    { loId: 'apenvsci.urbanization-water', content: `OTHER URBAN IMPACTS. AIR POLLUTION — concentrated vehicle, building, and industry emissions raise PM2.5, NOx, and ground-level ozone. LIGHT POLLUTION — bright night skies disorient migrating birds and disrupt human circadian rhythms. HABITAT LOSS and FRAGMENTATION — forests and wetlands are replaced, and surviving green spaces are small and isolated. WASTE and NOISE — large volumes of municipal, sewage, and hazardous waste plus chronic noise stress on people and wildlife.` },
    { loId: 'apenvsci.urbanization-water', content: `THE STORMWATER PROBLEM. Rain lands on impervious surfaces, is concentrated in storm drains, and is discharged into streams RAPIDLY. It carries oil, road salt, sediment, pet waste, lawn fertilizer and pesticides, and heavy metals. Result: streams flood with polluted runoff during storms, then drop to almost nothing between storms because groundwater recharge is lost.` },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'combined sewer overflow (CSO)', content: `in older cities (Boston, NYC) stormwater and sewage share the SAME pipes. Heavy rain overwhelms the treatment plant, so the excess — RAW SEWAGE mixed with stormwater — is discharged untreated into waterways. Separating storm and sanitary sewers fixes this but is capital-intensive.` },
    { loId: 'apenvsci.urbanization-water', content: `HYDROLOGY OF PAVING OVER LAND: converting forest or wetland to pavement DECREASES infiltration, INCREASES runoff, RAISES storm peak flows (flooding risk), and LOWERS base flow between storms (less groundwater recharge). Water quality falls and aquatic habitat degrades from flashier, warmer, dirtier flows.` },
    { loId: 'apenvsci.urbanization-water', kind: 'definition', title: 'green infrastructure', content: `design strategies that MIMIC the natural water cycle to soak up and clean stormwater near where it falls, instead of rushing it to a pipe. The umbrella term for rain gardens, permeable pavement, green roofs, bioswales, and constructed wetlands.` },
    { loId: 'apenvsci.urbanization-water', content: `GREEN-INFRASTRUCTURE TOOLKIT. RAIN GARDENS — shallow native plantings that collect runoff and let it infiltrate. PERMEABLE PAVEMENT — porous concrete or pavers that let water soak through. GREEN ROOFS — rooftop vegetation that absorbs rain and cuts the heat island. CONSTRUCTED WETLANDS — filter pollutants and store stormwater. BIOSWALES — vegetated roadside channels that slow and clean runoff. RAIN BARRELS / CISTERNS — capture rain for reuse. TREE CANOPY — intercepts rain and cools through evapotranspiration.` },
    { loId: 'apenvsci.urbanization-water', content: `URBAN PLANNING FOR SUSTAINABILITY: mixed-use ZONING (fewer car trips), PUBLIC TRANSIT investment, BICYCLE and PEDESTRIAN infrastructure, PRESERVING green space (parks, urban forests), and DENSITY (taller buildings) to reduce sprawl. These reduce emissions, habitat loss, and impervious cover simultaneously.` },
    { loId: 'apenvsci.urbanization-water', content: `GREEN VERSUS GRAY INFRASTRUCTURE: "gray" means engineered pipes, tunnels, and concrete channels; "green" means living, absorbent systems. Green infrastructure often costs LESS long-term because it handles ordinary 1-to-2-inch storms cheaply, cuts treatment and flood-damage costs, and adds co-benefits (cooler air, higher property values, green jobs).` },
    { loId: 'apenvsci.urbanization-water', content: `ECONOMIC CASE FOR GREEN INFRASTRUCTURE (frequent FRQ ask): reduced flood damage, lower water-treatment costs from cleaner runoff, energy savings from green roofs cutting summer AC load, higher property values near green space, fewer heat-wave deaths, and long-term savings versus expanding gray infrastructure.` },
  ],
  methods: [
    {
      title: 'Predict hydrologic changes when land is paved over',
      when_to_use: `When a watershed is converted to development and you must predict effects on local water.`,
      steps: [
        `STEP 1 — INFILTRATION DECREASES: paved surfaces stop water from soaking in.`,
        `STEP 2 — RUNOFF INCREASES: water sheets off pavement into storm drains quickly.`,
        `STEP 3 — PEAK FLOWS RISE during storms, raising flood risk downstream.`,
        `STEP 4 — BASE FLOW FALLS between storms because groundwater recharge is lost.`,
        `STEP 5 — WATER QUALITY DEGRADES as sediment, oil, road salt, and fertilizer wash in, and warmer, flashier flows degrade aquatic habitat and raise downstream flood and treatment costs.`,
      ],
      example: { problem: `A 50-acre forested watershed is converted to a strip mall. Predict three changes to local water hydrology.`, solution: `Less infiltration and more runoff produce higher storm peak flows (flooding) and lower base flow, while runoff carries sediment, oil, and salt that degrade stream quality and habitat.` },
      relatedLoIds: ['apenvsci.urbanization-water'],
    },
    {
      title: 'Prescribe green infrastructure for a new development',
      when_to_use: `When asked to reduce the hydrological impact of a proposed building or shopping center.`,
      steps: [
        `STEP 1 — PERMEABLE PAVEMENT in parking areas so rain soaks into the ground rather than running off.`,
        `STEP 2 — GREEN ROOF on the building to absorb rain (cutting runoff volume by roughly 50 to 70%) while reducing the heat island and insulating the structure.`,
        `STEP 3 — RAIN GARDENS in landscaped areas: shallow depressions of deep-rooted natives that capture roof and lot runoff, infiltrate it, and filter pollutants.`,
        `STEP 4 — BIOSWALES along roadway edges to slow, infiltrate, and clean runoff.`,
        `STEP 5 — NATIVE TREE PLANTINGS to intercept rain, cool the site, and fight the heat island — always explain the mechanism, not just the feature.`,
      ],
      example: { problem: `A new urban shopping center is being built. Suggest three green-infrastructure features and explain how each works.`, solution: `Permeable parking lets rain infiltrate; a green roof absorbs 50 to 70% of rainfall and cools the building; rain gardens capture and filter runoff while recharging groundwater.` },
      relatedLoIds: ['apenvsci.urbanization-water'],
    },
  ],
  pointers: [
    { content: 'Impervious surfaces are the root cause: no infiltration, so runoff dominates.', kind: 'tip' },
    { content: 'Urban heat island = 2 to 7 degrees C warmer from concrete and lost vegetation.', kind: 'tip' },
    { content: 'CSOs discharge raw sewage when storm + sanitary share pipes and rain overwhelms them.', kind: 'tip' },
    { content: 'Paving raises storm peak flow but lowers base flow between storms.', kind: 'tip' },
    { content: 'Green infra: rain gardens, permeable pavement, green roofs, bioswales, trees.', kind: 'tip' },
    { content: 'Green infrastructure often beats gray long-term on cost plus co-benefits.', kind: 'tip' },
  ],
};
