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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.renewables.v1' }],
  theory: [
    { loId: 'apenvsci.renewables', content: 'SOLAR ENERGY:' },
    { loId: 'apenvsci.renewables', content: `  • PHOTOVOLTAIC (PV): silicon panels convert sunlight → electricity directly via photoelectric effect.` },
    { loId: 'apenvsci.renewables', content: '  • SOLAR THERMAL (CSP): mirrors focus sunlight to heat fluid → steam → turbine.' },
    { loId: 'apenvsci.renewables', content: '  • Best in: deserts, sunny regions (SW US, Spain, Australia, Sahara).' },
    { loId: 'apenvsci.renewables', content: `  • Pros: zero emissions, modular (rooftop to utility-scale), prices DROPPED 90% since 2010.` },
    { loId: 'apenvsci.renewables', content: `  • Cons: INTERMITTENT (no power at night, less in winter), requires storage or backup. Land-intensive at utility scale. Toxic materials in panels (cadmium, lead in some).` },
    { loId: 'apenvsci.renewables', content: 'WIND ENERGY:' },
    { loId: 'apenvsci.renewables', content: `  • Wind turbines convert kinetic energy of wind → rotary motion → electricity (generator).` },
    { loId: 'apenvsci.renewables', content: `  • ONSHORE: most common, cheapest. Best in: Great Plains US, Texas Panhandle, Europe coast.` },
    { loId: 'apenvsci.renewables', content: `  • OFFSHORE: stronger wind, less land conflict, but expensive (saltwater corrosion, deep-water support).` },
    { loId: 'apenvsci.renewables', content: '  • Pros: zero emissions, second-cheapest electricity, scalable.' },
    { loId: 'apenvsci.renewables', content: `  • Cons: INTERMITTENT, requires backup. Bird/bat mortality. Visual/noise complaints. Land use (though sheep can graze under turbines).` },
    { loId: 'apenvsci.renewables', content: 'HYDROELECTRIC POWER:' },
    { loId: 'apenvsci.renewables', content: `  • Dams: water released through turbines → electricity. Fast-responsive (good for grid balancing).` },
    { loId: 'apenvsci.renewables', content: '  • RUN-OF-RIVER: smaller, no large reservoir. Lower environmental impact.' },
    { loId: 'apenvsci.renewables', content: '  • Pros: ~17% of global electricity, mature technology, zero direct emissions.' },
    { loId: 'apenvsci.renewables', content: `  • Cons: 
    - Reservoir flooding displaces communities, species.
    - Sediment trapping → erodes downstream beaches.
    - Blocks fish migration (salmon).
    - Drought-vulnerable.
    - LARGE METHANE emissions from decomposing reservoir vegetation (especially in tropics).
    - Construction destructive.` },
    { loId: 'apenvsci.renewables', content: `  • Examples: Three Gorges (China — largest), Hoover Dam, Itaipu (Brazil/Paraguay).` },
    { loId: 'apenvsci.renewables', content: 'GEOTHERMAL ENERGY: tap underground heat (volcanic regions, hot springs).' },
    { loId: 'apenvsci.renewables', content: `  • DRY STEAM: well drilled into hot underground reservoir; steam directly drives turbine. Geysers, CA.` },
    { loId: 'apenvsci.renewables', content: '  • FLASH STEAM: hot pressurized water flashed to steam.' },
    { loId: 'apenvsci.renewables', content: `  • BINARY CYCLE: hot water heats secondary fluid (low boiling point); secondary fluid drives turbine. Lower temperature requirement.` },
    { loId: 'apenvsci.renewables', content: `  • GEOTHERMAL HEAT PUMPS: residential — uses constant ~12°C ground temperature for heating/cooling. Highly efficient.` },
    { loId: 'apenvsci.renewables', content: `  • Best in: Iceland (~25% of electricity), Italy, NZ, geothermal regions of US (CA, NV).` },
    { loId: 'apenvsci.renewables', content: '  • Pros: 24/7 reliable, low emissions, small footprint.' },
    { loId: 'apenvsci.renewables', content: `  • Cons: location-restricted; subsurface cooling can occur over decades; hydrogen sulfide gas; potential for induced seismicity.` },
    { loId: 'apenvsci.renewables', content: 'HYDROGEN FUEL:' },
    { loId: 'apenvsci.renewables', content: `  • Hydrogen burned (or used in fuel cell) produces ENERGY + water (H₂ + ½O₂ → H₂O + energy). Zero CO₂.` },
    { loId: 'apenvsci.renewables', content: `  • PROBLEM: hydrogen must be PRODUCED. Currently ~95% from fossil fuels via steam-methane reforming → emits CO₂.` },
    { loId: 'apenvsci.renewables', content: `  • GREEN HYDROGEN: produced via electrolysis using renewable electricity. Truly zero-carbon. Currently ~5% but growing.` },
    { loId: 'apenvsci.renewables', content: '  • FUEL CELLS: convert H₂ chemical energy → electrical (no combustion).' },
    { loId: 'apenvsci.renewables', content: '  • Pros: high energy density per mass, zero point-of-use emissions.' },
    { loId: 'apenvsci.renewables', content: `  • Cons: low energy density per VOLUME (needs compression/liquefaction). Storage/transport challenging. Currently expensive. Hydrogen embrittles materials. Requires NEW infrastructure.` },
    { loId: 'apenvsci.renewables', content: `  • Use cases: heavy industry (steel making), trucks, aircraft, shipping (where electric batteries impractical).` },
    { loId: 'apenvsci.renewables', content: 'INTERMITTENCY PROBLEM:' },
    { loId: 'apenvsci.renewables', content: '  • Solar: night, winter.' },
    { loId: 'apenvsci.renewables', content: '  • Wind: variable, sometimes still.' },
    { loId: 'apenvsci.renewables', content: '  • SOLUTION 1: STORAGE — batteries (lithium-ion), pumped hydro, compressed air.' },
    { loId: 'apenvsci.renewables', content: `  • SOLUTION 2: GRID INTEGRATION — large geographic area smooths variability; long-distance transmission.` },
    { loId: 'apenvsci.renewables', content: `  • SOLUTION 3: COMPLEMENTARY mix — solar peaks midday, wind often peaks at night.` },
    { loId: 'apenvsci.renewables', content: `  • SOLUTION 4: DEMAND-SIDE management — schedule heavy usage when supply is high.` },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'photovoltaic', content: 'PV — solar panels converting light to electricity directly.' },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'intermittency', content: 'variability in renewable output (e.g., solar at night).' },
    { loId: 'apenvsci.renewables', kind: 'definition', title: 'green hydrogen', content: 'hydrogen produced via electrolysis using renewable electricity.' },
  ],
  methods: [
    {
      title: 'Worked region',
      steps: [
        `(a) ICELAND: GEOTHERMAL (volcanic terrain, ~25% of electricity already from this) + HYDRO (rivers from glaciers, ~70%). Total: ~100% renewable. Limited solar (high latitude, long winters).`,
        `(b) US GREAT PLAINS: WIND. Constant high winds across plains, low population density (no land conflicts), well-developed transmission. Texas, Oklahoma, Iowa, Kansas already lead in wind capacity.`,
        `(c) SAHARA: SOLAR (PV or thermal). Constant sunshine, hot/dry climate ideal. Limited water requirement, large land available. Major projects (Noor Solar Complex in Morocco).`,
        `(d) NORWAY: HYDROELECTRIC. ~95% of electricity already from hydro. Mountainous terrain, abundant rivers and snowmelt. Limited solar (high latitude).`,
      ],
      example: { problem: `For each region, recommend the most suitable renewable energy source(s) and explain why: (a) Iceland. (b) US Great Plains. (c) Sahara Desert. (d) Norway.`, solution: 'Iceland: geothermal + hydro. Plains: wind. Sahara: solar. Norway: hydro.' },
      relatedLoIds: ['apenvsci.renewables'],
    },
  ],
  pointers: [
    { content: 'Solar: PV (cheapest), thermal. Best in deserts.', kind: 'tip' },
    { content: 'Wind: onshore (cheap) vs offshore (stronger). Best in plains, coast.', kind: 'tip' },
    { content: 'Hydro: 17% globally, but reservoir + fish + methane impacts.', kind: 'tip' },
    { content: 'Geothermal: 24/7 baseload in volcanic regions.', kind: 'tip' },
    { content: 'Hydrogen: storage carrier; green H₂ from electrolysis.', kind: 'tip' },
    { content: 'Intermittency: solved by storage, grid, demand management, complementary mix.', kind: 'tip' },
  ],
};
