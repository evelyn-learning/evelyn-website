/**
 * AP Environmental Science — Unit 6 CED 6.6-6.7: Nuclear and Biomass.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.nuclear-biomass.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_NUCLEAR_BIOMASS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.nuclear-biomass.v1',
  course: 'AP Environmental Science',
  cedUnit: 6,
  cedTopic: '6.6-6.7',
  cedTitle: 'Nuclear and Biomass',
  planId: 'evelyn.ap.envsci.nuclear-biomass.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.nuclear-biomass.v1' }],
  theory: [
    { loId: 'apenvsci.nuclear-biomass', content: `NUCLEAR FISSION: a heavy atom (typically uranium-235) absorbs a neutron and SPLITS into smaller atoms, releasing 2-3 new neutrons plus ENERGY as heat. The released neutrons split more U-235 atoms — a CHAIN REACTION — controlled by neutron-absorbing control rods. The heat boils water into steam, which spins a turbine to generate electricity.` },
    { loId: 'apenvsci.nuclear-biomass', content: `REACTOR COMPONENTS: FUEL RODS hold enriched uranium (3-5% U-235; natural uranium is only 0.7%). CONTROL RODS (boron, cadmium) absorb neutrons — LOWERED to slow the reaction, RAISED to speed it up. COOLANT (usually water) carries heat away. The MODERATOR slows neutrons so they can be captured (water in light-water reactors). The CONTAINMENT VESSEL of thick concrete and steel prevents radiation escape.` },
    { loId: 'apenvsci.nuclear-biomass', content: `NUCLEAR ADVANTAGES: ZERO direct CO₂ emissions during operation; extremely HIGH ENERGY DENSITY (roughly 1 kg of uranium ~ 3 million kg of coal); reliable BASE-LOAD power running 24/7 — unlike intermittent solar and wind; limited air pollution; small land footprint per kWh. Nuclear generates roughly 20% of US electricity and ~10% globally.` },
    { loId: 'apenvsci.nuclear-biomass', content: `NUCLEAR DISADVANTAGES: (a) RADIOACTIVE WASTE stays hazardous for thousands of years and the US has NO permanent disposal site (Yucca Mountain politically blocked). (b) CATASTROPHIC ACCIDENT potential. (c) COST — plants cost 5 to 15 billion dollars with 10-20 year lead times. (d) PROLIFERATION risk — enriched uranium can feed weapons programs. (e) THERMAL POLLUTION — warm cooling-water discharge harms aquatic life. (f) Decommissioning takes decades and is expensive.` },
    { loId: 'apenvsci.nuclear-biomass', content: `THE THREE ACCIDENTS TO KNOW: THREE MILE ISLAND (1979, US) — partial meltdown, minimal radiation released. CHERNOBYL (1986, USSR/Ukraine) — full meltdown from operator error plus a design flaw; ~50 immediate deaths, 4,000+ thyroid cancer cases, a 20-mile Exclusion Zone still uninhabitable. FUKUSHIMA (2011, Japan) — an earthquake-driven tsunami flooded backup generators, causing three meltdowns, mass evacuation, and a cleanup estimated near 400 billion dollars.` },
    { loId: 'apenvsci.nuclear-biomass', content: `BIOMASS ENERGY: burning plant or animal material for heat or electricity. Sources include wood, agricultural residues (corn stover), animal manure, garbage (waste-to-energy plants), and dedicated energy crops. Biomass counts as RENEWABLE only IF regrowth replaces what is burned.` },
    { loId: 'apenvsci.nuclear-biomass', content: `BIOMASS TYPES: TRADITIONAL biomass (wood, dung) is used by ~40% of the world's population for cooking — indoor smoke causes roughly 3 million premature deaths per year. MODERN biomass: ETHANOL (corn in the US, sugarcane in Brazil) blended into gasoline; BIODIESEL from soy or palm oil; WOOD PELLETS for heating and some electricity; BIOGAS — methane captured from anaerobic decomposition in landfills and sewage plants.` },
    { loId: 'apenvsci.nuclear-biomass', content: `BIOMASS TRADE-OFFS. ADVANTAGES: theoretically CARBON-NEUTRAL (CO₂ released when burned equals CO₂ absorbed during growth); uses WASTE materials that would otherwise be discarded; works with existing combustion infrastructure; LOCAL production reduces foreign energy dependence. DISADVANTAGES: COMPETES WITH FOOD crops for land (corn ethanol diverts a large share of the US corn crop); DEFORESTATION risk if harvest outpaces regrowth; AIR POLLUTION from combustion, often dirtier than fossil fuels; LIFECYCLE EMISSIONS are not zero — fossil fuels burned for fertilizer, tractors, transport, and processing offset the gains; LAND-USE-CHANGE emissions when forest is cleared for biofuel crops.` },
    { loId: 'apenvsci.nuclear-biomass', content: `ETHANOL COMPARISON: Brazilian SUGARCANE yields ~600 gallons of ethanol per acre versus ~450 for US CORN, needs less fertilizer and processing energy, and regrows annually (ratooning) in a tropical climate — so its lifecycle emissions are much lower. Corn ethanol's net benefit can be NEGLIGIBLE after accounting for fertilizer, machinery, and processing; it persists largely because of political subsidies.` },
    { loId: 'apenvsci.nuclear-biomass', kind: 'definition', title: 'fission', content: `splitting a heavy atom (such as U-235) by neutron absorption, releasing energy and more neutrons.` },
    { loId: 'apenvsci.nuclear-biomass', kind: 'definition', title: 'meltdown', content: `a reactor core overheating until it melts, potentially releasing radiation.` },
    { loId: 'apenvsci.nuclear-biomass', kind: 'definition', title: 'biomass', content: `organic material — plant or animal matter — burned for energy.` },
  ],
  methods: [
    {
      title: 'Compare nuclear disasters (cause → scale → ongoing impact)',
      when_to_use: `Any FRQ or comparison prompt naming Chernobyl, Fukushima, or Three Mile Island.`,
      steps: [
        `STEP 1 — State the CAUSE precisely: Chernobyl = HUMAN ERROR during a safety test plus a flawed RBMK reactor design; Fukushima = NATURAL DISASTER — a magnitude-9.0 earthquake and 14-meter tsunami flooding backup generators, killing the cooling.`,
        `STEP 2 — Compare the SCALE of release: Chernobyl exploded and burned for 10 days, spreading a radioactive plume across Europe (~30 immediate deaths, 4,000+ later thyroid cancers). Fukushima had three meltdowns but containment PARTIALLY held; ~160,000 evacuated, few direct radiation deaths.`,
        `STEP 3 — Describe the ONGOING impact: Chernobyl's roughly 1,000-square-mile Exclusion Zone remains uninhabited decades later (paradoxically now a wildlife refuge). Fukushima's decommissioning will take ~50 years; many evacuees never returned.`,
        `STEP 4 — Close with the SHARED LESSONS: safety engineering is critical, evacuation decisions are socially complex, and both events damaged public confidence — pushing some countries (Germany) away from nuclear entirely.`,
      ],
      example: { problem: `Compare the Chernobyl (1986) and Fukushima (2011) nuclear disasters in terms of cause, scale, and ongoing impact.`, solution: `Chernobyl: human error + design flaw → explosion and 10-day fire, larger radiation release, ~1,000-square-mile exclusion zone still empty. Fukushima: earthquake/tsunami → three meltdowns, containment partially held, ~160,000 evacuated, ~50-year cleanup ongoing. Both eroded public trust in nuclear power.` },
      relatedLoIds: ['apenvsci.nuclear-biomass'],
    },
    {
      title: 'Argue a nuclear or biomass trade-off question',
      steps: [
        `STEP 1 — List arguments FOR from the standard set: zero direct CO₂ (nuclear) or theoretical carbon-neutrality (biomass), energy density, base-load reliability, waste utilization, local supply.`,
        `STEP 2 — List arguments AGAINST: nuclear — waste, accidents, cost, proliferation, thermal pollution; biomass — food competition, deforestation, combustion pollution, nonzero lifecycle emissions.`,
        `STEP 3 — If asked to CONCLUDE, tie the verdict to a stated priority (climate urgency favors nuclear as a bridge; cost and safety favor renewables plus storage) — the exam rewards a justified position, not a "right" one.`,
      ],
      relatedLoIds: ['apenvsci.nuclear-biomass'],
    },
  ],
  pointers: [
    { content: 'Nuclear = ZERO direct CO₂ in operation, but it is NONRENEWABLE (finite uranium).', kind: 'tip' },
    { content: 'Control rods ABSORB neutrons: lowered = slower reaction, raised = faster.', kind: 'tip' },
    { content: 'Accidents in order: Three Mile Island (1979, minor) < Fukushima (2011) < Chernobyl (1986, worst).', kind: 'tip' },
    { content: 'Chernobyl = human error + design flaw; Fukushima = tsunami flooding backup cooling.', kind: 'tip' },
    { content: 'Biomass is only carbon-neutral IF regrowth matches harvest; lifecycle emissions are never zero.', kind: 'tip' },
    { content: 'Sugarcane ethanol beats corn ethanol on yield per acre AND lifecycle emissions.', kind: 'tip' },
  ],
};
