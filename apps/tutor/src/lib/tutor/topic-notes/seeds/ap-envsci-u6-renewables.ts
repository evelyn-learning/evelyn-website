/**
 * AP Environmental Science — Unit 6 CED 6.8-6.12: Renewable Energy.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.renewables.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_RENEWABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.renewables.v1',
  course: 'AP Environmental Science',
  cedUnit: 6,
  cedTopic: '6.8-6.12',
  cedTitle: 'Renewable Energy',
  planId: 'evelyn.ap.envsci.renewables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.renewables.v1' }],
  theory: [
    { loId: 'apenvsci.renewables', content: `SOLAR ENERGY — two capture methods: PHOTOVOLTAIC (PV) panels convert sunlight directly to electricity via the photoelectric effect; SOLAR THERMAL (CSP) uses mirrors to focus sunlight, heating a fluid to make steam that drives a turbine. Best sited in deserts and sunny regions (SW US, Spain, Australia, Sahara). PROS: zero emissions, modular from rooftop to utility scale, prices DROPPED ~90% since 2010 — now the cheapest new electricity. CONS: INTERMITTENT (nothing at night, less in winter), needs storage or backup, land-intensive at utility scale, some panels contain toxic materials (cadmium, lead).` },
    { loId: 'apenvsci.renewables', content: `WIND ENERGY: turbines convert the KINETIC energy of moving air into rotary motion driving a generator. ONSHORE wind is the most common and cheapest (Great Plains, Texas Panhandle, European coasts). OFFSHORE wind is stronger and steadier with less land conflict, but costs more (saltwater corrosion, deep-water foundations). PROS: zero emissions, second-cheapest electricity, scalable. CONS: intermittent, bird and bat mortality, visual and noise complaints — though land beneath turbines can still be farmed or grazed.` },
    { loId: 'apenvsci.renewables', content: `HYDROELECTRIC POWER: dams release water through turbines — about 17% of GLOBAL electricity, a mature technology with zero direct emissions and FAST response (good for grid balancing). RUN-OF-RIVER designs skip the big reservoir for lower impact. Examples: Three Gorges (China, world's largest), Hoover Dam, Itaipu (Brazil/Paraguay).` },
    { loId: 'apenvsci.renewables', content: `HYDRO DOWNSIDES (a favorite FRQ list): reservoir FLOODING displaces communities and species; SEDIMENT TRAPPING starves and erodes downstream beaches; dams BLOCK FISH MIGRATION (salmon); output is DROUGHT-vulnerable; decomposing reservoir vegetation emits substantial METHANE (especially in the tropics); and construction itself is destructive.` },
    { loId: 'apenvsci.renewables', content: `GEOTHERMAL ENERGY taps underground heat in volcanic regions. Plant types: DRY STEAM (steam from a hot reservoir drives the turbine directly — The Geysers, California), FLASH STEAM (hot pressurized water flashed to steam), and BINARY CYCLE (hot water heats a secondary low-boiling-point fluid, allowing lower reservoir temperatures). GEOTHERMAL HEAT PUMPS use the constant ~12°C ground temperature for highly efficient home heating and cooling — usable ANYWHERE, unlike geothermal power plants.` },
    { loId: 'apenvsci.renewables', content: `GEOTHERMAL PROS AND CONS: reliable 24/7 base-load, low emissions, small footprint — Iceland gets ~25% of its electricity this way (Italy, New Zealand, and the western US also qualify). CONS: LOCATION-RESTRICTED to geologically active areas; the subsurface can cool over decades of extraction; hydrogen sulfide (H₂S) gas releases; potential induced seismicity.` },
    { loId: 'apenvsci.renewables', content: `HYDROGEN FUEL: burning hydrogen or running it through a FUEL CELL yields energy plus WATER — zero CO₂ at the point of use. THE CATCH: hydrogen must be PRODUCED. Today ~95% comes from fossil fuels via steam-methane reforming, which EMITS CO₂. GREEN HYDROGEN — made by electrolysis powered by renewable electricity — is truly zero-carbon but currently only ~5% of supply. TRADE-OFFS: high energy density per unit MASS but very LOW density per unit VOLUME, so it needs compression or liquefaction; storage and transport are hard; it embrittles metals; and it requires new infrastructure. Best use cases are where batteries are impractical — heavy industry (steel), long-haul trucks, aircraft, shipping.` },
    { loId: 'apenvsci.renewables', content: `THE INTERMITTENCY PROBLEM: solar dies at night and fades in winter; wind is variable. FOUR SOLUTIONS the exam expects: (1) STORAGE — lithium-ion batteries, pumped hydro, compressed air; (2) GRID INTEGRATION — long-distance transmission over a large area smooths local variability; (3) COMPLEMENTARY MIX — solar peaks midday while wind often peaks at night; (4) DEMAND-SIDE MANAGEMENT — shift heavy usage to when supply is high.` },
    { loId: 'apenvsci.renewables', content: `CAPACITY FACTOR (the percent of time a source actually generates): GEOTHERMAL ~85-90% (near 24/7), HYDRO 30-60% (water-dependent), WIND 30-45% (offshore higher), SOLAR 15-25% (no nighttime). Pair this with cost trends: solar PV down ~90% since 2010 (cheapest new build), wind down ~70% (second cheapest).` },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'photovoltaic (PV)', content: `solar panels that convert light directly into electricity via the photoelectric effect.` },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'intermittency', content: `variability in renewable output — for example, solar producing nothing at night.` },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'green hydrogen', content: `hydrogen produced by electrolysis of water using renewable electricity — zero-carbon end to end.` },
  ],
  methods: [
    {
      title: 'Match a region to its best renewable source',
      when_to_use: `"Which renewable suits region X?" prompts — reason from local geography, not preference.`,
      steps: [
        `STEP 1 — Inventory the region's PHYSICAL ASSETS: volcanic/geologically active → geothermal; steady strong winds and open land → wind; intense reliable sun → solar; mountainous terrain with rivers/snowmelt → hydro.`,
        `STEP 2 — Rule sources OUT with geography: high latitude kills solar (long dark winters); flat dry interiors lack hydro; geothermal needs tectonic activity.`,
        `STEP 3 — Check PRACTICAL fit: population density (land conflicts), existing transmission, and whether the source's capacity factor matches the region's demand pattern.`,
        `STEP 4 — Justify with a named example: Iceland (geothermal + hydro, ~100% renewable), US Great Plains (wind), Sahara/Morocco Noor complex (solar), Norway (~95% hydro).`,
      ],
      example: { problem: `For each region, recommend the most suitable renewable energy source(s) and explain why: (a) Iceland, (b) US Great Plains, (c) Sahara Desert, (d) Norway.`, solution: `(a) Iceland: GEOTHERMAL (volcanic terrain, ~25% of electricity) plus HYDRO (~70%, glacial rivers) — solar is weak at high latitude. (b) Great Plains: WIND — constant strong winds, low population density. (c) Sahara: SOLAR — constant sun, vast open land (Noor complex, Morocco). (d) Norway: HYDRO — mountains, abundant rivers and snowmelt supply ~95% of electricity.` },
      relatedLoIds: ['apenvsci.renewables'],
    },
    {
      title: 'Answer an intermittency FRQ',
      steps: [
        `STEP 1 — Explain WHY intermittency matters: supply must match demand instant by instant; solar drops exactly when evening demand peaks; without storage the grid fails when supply lags.`,
        `STEP 2 — Offer at least THREE distinct solutions: storage (batteries, pumped hydro), wide-area grid integration, complementary solar+wind mix, and demand-side management.`,
        `STEP 3 — If hydrogen is invoked, trace the loop: excess renewable electricity → ELECTROLYSIS splits water into H₂ and O₂ → store the H₂ (tanks, salt caverns) → later recombine in a fuel cell or by combustion to get electricity plus water. Note the ~30-40% round-trip efficiency cost.`,
      ],
      relatedLoIds: ['apenvsci.renewables'],
    },
  ],
  pointers: [
    { content: 'Capacity factor order: geothermal (~85-90%) > hydro > wind > solar (~15-25%).', kind: 'tip' },
    { content: 'Solar PV is the CHEAPEST new electricity — prices fell ~90% since 2010; wind is second.', kind: 'tip' },
    { content: 'Hydro is renewable but NOT impact-free: flooding, fish blockage, sediment trapping, reservoir methane.', kind: 'tip' },
    { content: 'Hydrogen is an energy CARRIER, not a source — only GREEN hydrogen (electrolysis) is zero-carbon.', kind: 'tip' },
    { content: 'Intermittency fixes: storage, grid integration, complementary mix, demand-side management.', kind: 'tip' },
    { content: 'Geothermal POWER is location-restricted; geothermal HEAT PUMPS work anywhere (~12°C ground).', kind: 'tip' },
  ],
};
