/**
 * AP Environmental Science — Unit 6 CED 6.1-6.5: Energy Overview and Fossil Fuels.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.energy-overview-fossil.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_ENERGY_OVERVIEW_FOSSIL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.energy-overview-fossil.v1',
  course: 'AP Environmental Science',
  cedUnit: 6,
  cedTopic: '6.1-6.5',
  cedTitle: 'Energy Overview and Fossil Fuels',
  planId: 'evelyn.ap.envsci.energy-overview-fossil.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.energy-overview-fossil.v1' }],
  theory: [
    { loId: 'apenvsci.energy-overview-fossil', content: `RENEWABLE vs NONRENEWABLE: the distinction is about the RATE of regeneration versus the rate of use. RENEWABLE resources are replenished naturally within human timescales — sunlight, wind, flowing water, geothermal heat, biomass. NONRENEWABLE resources are finite stocks depleted faster than nature replaces them — fossil fuels (coal, oil, natural gas) and nuclear fuel (uranium).` },
    { loId: 'apenvsci.energy-overview-fossil', content: `GLOBAL ENERGY MIX (~2024): fossil fuels supply roughly 80% of world energy — oil ~32%, coal ~26%, natural gas ~22%. Renewables ~12% (wind, solar, hydro, biomass). Nuclear ~5%. TRENDS: coal declining, solar and wind growing fast, oil roughly stable, natural gas growing.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `CONSUMPTION PATTERNS: developed nations consume FAR MORE energy per capita (US ~75 GJ/year per person versus India ~25 GJ/year), but the FASTEST GROWTH in demand is in industrializing developing countries (China, India). Largest end-use sectors: transportation ~30%, industry ~25%, buildings ~25%, with electricity generation overlapping these.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `FOSSIL FUEL FORMATION: COAL formed from ancient TERRESTRIAL PLANT matter (largely Carboniferous Period, ~300 million years ago) compressed under heat and pressure over millions of years — about 90% of US coal comes from the Appalachian, Powder River, and Illinois Basins. OIL and NATURAL GAS formed from ancient MARINE algae and plankton compressed in sedimentary rocks over 100+ million years — found in oil fields such as the Gulf of Mexico, Saudi Arabia, and Alaska's North Slope.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `EXTRACTION METHODS: COAL — surface mining (strip mining, mountaintop removal) or underground mining (shaft, drift). OIL — drilling; conventional wells extract free-flowing oil, while HYDRAULIC FRACTURING (fracking) injects water and chemicals at high pressure to fracture shale and release trapped oil and gas. NATURAL GAS — drilling, often from the same wells as oil, and increasingly via fracking.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `COAL RANKS AND USES: ranked by energy content — ANTHRACITE (highest energy, cleanest-burning), then bituminous, sub-bituminous, and LIGNITE (lowest). Roughly 70% of coal goes to electricity generation, ~20% to steel making (as coke), ~10% other uses. OIL USES: ~70% goes to TRANSPORTATION (gasoline, diesel, jet fuel); the rest becomes plastics, chemicals, asphalt, and lubricants. Crude oil is separated into gasoline, diesel, kerosene, and jet fuel via FRACTIONAL DISTILLATION at refineries.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `NATURAL GAS: primarily METHANE (CH₄). It is the CLEANEST-burning fossil fuel — roughly 50% less CO₂ than coal per unit of energy. Used mostly for electricity (largest use), heating, industry, and as fertilizer feedstock. CAVEAT: methane LEAKAGE during extraction and distribution is a potent greenhouse-gas problem that can offset the combustion advantage.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `ENVIRONMENTAL IMPACTS of fossil fuels: (a) CO₂ EMISSIONS driving climate change — coal is WORST per kWh, gas is best among fossils. (b) AIR POLLUTION — SO₂ (acid rain), NOx (smog), particulate matter; coal is worst. (c) OIL SPILLS — Deepwater Horizon (2010, Gulf of Mexico) released 4.9 million barrels. (d) LAND DESTRUCTION from mining (mountaintop removal, strip mines) plus acid mine drainage and mercury contamination. (e) FRACKING concerns — groundwater contamination, induced earthquakes, heavy water consumption.` },
    { loId: 'apenvsci.energy-overview-fossil', content: `RELATIVE CO₂ per unit energy (know the ORDER, not exact numbers): COAL highest (~205 lb CO₂ per MMBtu) > OIL medium (~165) > NATURAL GAS lowest (~115). Switching a power plant from coal to gas cuts CO₂ emissions roughly 45-50% per kWh — a real but PARTIAL improvement, since gas is still a fossil fuel.` },
    { loId: 'apenvsci.energy-overview-fossil', kind: 'definition', title: 'fossil fuel', content: `coal, oil, or natural gas — nonrenewable fuels formed from ancient organic matter compressed over millions of years.` },
    { loId: 'apenvsci.energy-overview-fossil', kind: 'definition', title: 'fracking (hydraulic fracturing)', content: `injecting water and chemicals at high pressure into shale to fracture the rock and release trapped oil or gas.` },
    { loId: 'apenvsci.energy-overview-fossil', kind: 'definition', title: 'nonrenewable resource', content: `a resource depleted faster than natural processes can replace it (fossil fuels, uranium).` },
  ],
  methods: [
    {
      title: 'Compare fossil fuels on use, CO₂, and air pollution',
      steps: [
        `STEP 1 — Identify the PRIMARY USE of each fuel: COAL → electricity generation + steel making; OIL → transportation + plastics/chemicals; NATURAL GAS → electricity + heating.`,
        `STEP 2 — Rank CO₂ per unit energy: COAL highest, OIL in the middle, GAS lowest. Remember the coal-to-gas switch saves roughly 45-50% of CO₂ per kWh.`,
        `STEP 3 — Rank conventional AIR POLLUTION (SO₂, NOx, particulates): COAL is worst (high sulfur, especially lignite); OIL emits VOCs and NOx; GAS is cleanest of the fossils (methane combustion yields mostly CO₂ and H₂O).`,
        `STEP 4 — Add the CAVEATS the exam rewards: gas still emits CO₂, methane leakage offsets savings, and fracking brings water and seismic concerns.`,
      ],
      example: { problem: `Compare coal, oil, and natural gas on: (a) primary use, (b) CO₂ emissions per unit energy, (c) air pollution.`, solution: `(a) Coal → electricity + steel; oil → transportation + plastics; gas → electricity + heating. (b) CO₂ per unit energy: coal highest, oil medium, gas lowest — coal-to-gas cuts ~45% per kWh. (c) Coal is dirtiest (sulfur, particulates); oil medium (VOCs, NOx); gas cleanest of the fossil fuels.` },
      relatedLoIds: ['apenvsci.energy-overview-fossil'],
    },
    {
      title: 'Analyze an energy-mix problem',
      steps: [
        `STEP 1 — SORT each source into its category: fossil (coal, oil, gas), nuclear, renewable (hydro, solar, wind, geothermal, biomass). Nuclear is NONRENEWABLE but NOT fossil.`,
        `STEP 2 — SUM the percentages within each category to answer share questions.`,
        `STEP 3 — For "make it cleaner" prompts, offer concrete swaps: replace coal with gas (fast ~50% CO₂ cut per kWh), build solar/wind (zero direct emissions but intermittent), expand nuclear (zero direct CO₂ but costly/controversial), or cut demand via efficiency.`,
      ],
      example: { problem: `A country generates 60% from coal, 20% from natural gas, 10% from nuclear, 7% from hydro, and 3% from solar/wind. (a) What percent is fossil? (b) What percent is renewable? (c) Two ways to make the mix cleaner.`, solution: `(a) Fossil = 60 + 20 = 80%. (b) Renewable = 7 + 3 = 10% (nuclear is NOT renewable). (c) Swap coal plants for gas (immediate ~50% emissions cut) and build out solar/wind capacity; efficiency gains and nuclear expansion also qualify.` },
      relatedLoIds: ['apenvsci.energy-overview-fossil'],
    },
  ],
  pointers: [
    { content: 'Renewable vs nonrenewable = RATE of regeneration vs use. Nuclear is nonrenewable but NOT a fossil fuel.', kind: 'tip' },
    { content: 'Global mix ~2024: ~80% fossil (oil > coal > gas), ~12% renewable, ~5% nuclear.', kind: 'tip' },
    { content: 'Coal = ancient LAND plants; oil/gas = ancient MARINE algae and plankton.', kind: 'tip' },
    { content: 'CO₂ per unit energy: coal > oil > gas. Coal-to-gas switch cuts ~45-50% per kWh.', kind: 'tip' },
    { content: 'Gas is the cleanest fossil, but methane leakage and fracking impacts erode the advantage.', kind: 'tip' },
    { content: 'Oil is mostly TRANSPORTATION (~70%); coal is mostly ELECTRICITY (~70%).', kind: 'tip' },
  ],
};
