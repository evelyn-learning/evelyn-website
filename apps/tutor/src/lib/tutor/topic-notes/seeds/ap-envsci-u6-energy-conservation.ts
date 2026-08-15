/**
 * AP Environmental Science — Unit 6 CED 6.13: Energy Conservation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.energy-conservation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_ENERGY_CONSERVATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.energy-conservation.v1',
  course: 'AP Environmental Science',
  cedUnit: 6,
  cedTopic: '6.13',
  cedTitle: 'Energy Conservation',
  planId: 'evelyn.ap.envsci.energy-conservation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.energy-conservation.v1' }],
  theory: [
    { loId: 'apenvsci.energy-conservation', content: `CONSERVATION vs EFFICIENCY — the core distinction: CONSERVATION means USING LESS energy (turn off lights, drive less, lower the thermostat). EFFICIENCY means getting MORE SERVICE per unit of energy (an LED gives the same light using ~85% less electricity). Both reduce demand and are usually combined.` },
    { loId: 'apenvsci.energy-conservation', content: `WHY IT MATTERS: reducing demand is the CHEAPEST way to cut emissions and pollution — the cleanest energy is the energy never used. It avoids building expensive new generating capacity, lowers consumer bills, and reduces oil-import dependence. The IEA estimates efficiency must deliver roughly 40% of the CO₂ reductions needed for net-zero by 2050.` },
    { loId: 'apenvsci.energy-conservation', content: `RESIDENTIAL strategies: LIGHTING — replace incandescent bulbs (~5% efficient) with LEDs (~30% efficient, lasting ~25 times longer); ENERGY STAR appliances (10-50% less energy); INSULATION cuts heating/cooling needs 20-50%; double- or triple-pane LOW-E windows; SMART THERMOSTATS programmed for away/sleeping hours; low-flow water fixtures; plus behavior — thermostat lower in winter, higher in summer.` },
    { loId: 'apenvsci.energy-conservation', content: `COMMERCIAL strategies: building energy management systems (BEMS) with sensors and automated controls; LED lighting paired with OCCUPANCY SENSORS; HVAC upgrades; COOL ROOFS and green roofs that cut cooling loads; and building certification standards such as LEED and ENERGY STAR for buildings.` },
    { loId: 'apenvsci.energy-conservation', content: `INDUSTRIAL strategies: COGENERATION / CHP (combined heat and power) captures waste heat that would otherwise be thrown away; high-efficiency motors and pumps; industrial heat recovery; and RECYCLING — remaking aluminum from scrap saves ~95% of the energy of producing it from virgin ore.` },
    { loId: 'apenvsci.energy-conservation', content: `TRANSPORTATION strategies: FUEL ECONOMY standards (CAFE in the US) push higher mpg; the EV TRANSITION — electric motors are roughly 2-3 times more efficient than gasoline engines; PUBLIC TRANSIT — a bus is 5-10 times more efficient per passenger-mile than a single-occupant car; RAIL FREIGHT is ~4 times more efficient than trucking per ton-mile; plus carpooling, biking, e-bikes, telecommuting, and mixed-use development that shortens trips.` },
    { loId: 'apenvsci.energy-conservation', content: `BARRIERS to conservation: (a) UPFRONT COSTS — efficient equipment costs more now and pays back over years; (b) SPLIT INCENTIVES — the landlord buys the appliance but the tenant pays the energy bill, so neither invests; (c) the REBOUND EFFECT; (d) lack of awareness or expertise.` },
    { loId: 'apenvsci.energy-conservation', content: `REBOUND EFFECT in depth: efficiency lowers the COST per unit of service, so people consume MORE of it — better mileage invites more driving; cheap LED light invites leaving lights on. Rebound is LARGER for ELASTIC demand (driving, air conditioning — 10-30% and 5-20% respectively) and SMALL for INELASTIC demand (heating set by a thermostat). It typically offsets 5-30% of gains — real, but it RARELY erases them.` },
    { loId: 'apenvsci.energy-conservation', content: `POLICY TOOLS: building energy codes; appliance efficiency standards; tax credits for efficiency upgrades; utility-run efficiency programs (often legally required); and CARBON PRICING, which keeps energy costly enough to blunt rebound — even an efficient car costs more to drive under a carbon price.` },
    { loId: 'apenvsci.energy-conservation', kind: 'definition', title: 'conservation', content: `using less energy — reducing the quantity of energy consumed.` },
    { loId: 'apenvsci.energy-conservation', kind: 'definition', title: 'efficiency', content: `getting more service (light, motion, heat) per unit of energy used.` },
    { loId: 'apenvsci.energy-conservation', kind: 'definition', title: 'rebound effect', content: `efficiency gains partially offset by increased usage because each unit of service got cheaper.` },
  ],
  methods: [
    {
      title: 'Compute a payback period for an efficiency upgrade',
      when_to_use: `Any quantitative prompt with an upfront cost and an ongoing energy saving.`,
      steps: [
        `STEP 1 — POWER SAVED per device: old wattage minus new wattage (60 W − 7 W = 53 W per bulb).`,
        `STEP 2 — ENERGY SAVED per day: devices × watts saved × hours of use. Here 20 × 53 W × 5 h = 5,300 Wh = 5.3 kWh per day. WATCH THE UNIT CONVERSION — divide Wh by 1,000 to get kWh.`,
        `STEP 3 — MONEY SAVED: energy saved × electricity price. 5.3 kWh × 0.15 dollars per kWh ≈ 0.80 dollars per day ≈ 290 dollars per year.`,
        `STEP 4 — PAYBACK PERIOD = upfront cost ÷ annual savings. 200 ÷ 290 ≈ 0.69 years — about 8 months.`,
        `STEP 5 — LONG-RUN SAVINGS over N years = annual savings × N − upfront cost. Over 10 years: 290 × 10 − 200 = 2,700 dollars.`,
        `STEP 6 — Mention SECONDARY benefits: LEDs last ~25 times longer than incandescents, so replacement-bulb costs fall too.`,
      ],
      example: { problem: `A homeowner spends 200 dollars replacing 20 incandescent bulbs (60 W each) with LEDs (7 W each). Lights run about 5 hours per day and electricity costs 0.15 dollars per kWh. Compute the payback period and the 10-year savings.`, solution: `Savings = 53 W per bulb × 20 bulbs × 5 h = 5.3 kWh/day ≈ 290 dollars per year. Payback = 200 ÷ 290 ≈ 0.69 years (~8 months). Ten-year savings = 2,900 − 200 = 2,700 dollars, plus fewer replacement bulbs.` },
      relatedLoIds: ['apenvsci.energy-conservation'],
    },
    {
      title: 'Structure a rebound-effect FRQ',
      steps: [
        `STEP 1 — DEFINE rebound and give a concrete example: better mileage → more driving; cheaper LED light → more lights left on.`,
        `STEP 2 — State WHEN rebound is largest: ELASTIC-demand activities (driving, air conditioning) rebound more; INELASTIC ones (thermostat-set heating) rebound little. Cite the 5-30% typical range and note it rarely fully offsets gains.`,
        `STEP 3 — Give POLICY compensations: carbon pricing (keeps use costly), absolute energy caps, transit investment, standards paired with conservation campaigns, and public education about rebound.`,
      ],
      relatedLoIds: ['apenvsci.energy-conservation'],
    },
  ],
  pointers: [
    { content: 'Conservation = use LESS; efficiency = more service PER UNIT. Know the difference cold.', kind: 'tip' },
    { content: 'Payback period = upfront cost ÷ annual savings. Convert Wh → kWh before pricing.', kind: 'tip' },
    { content: 'Sector anchors: residential = LED + insulation; transport = EV + transit; industrial = CHP + motors.', kind: 'tip' },
    { content: 'Rebound hits ELASTIC demand hardest (driving, AC); heating is inelastic, so small rebound.', kind: 'tip' },
    { content: 'Split incentives: landlord buys the appliance, tenant pays the bill — neither invests.', kind: 'tip' },
    { content: 'Recycling aluminum saves ~95% of the energy vs virgin ore — a classic exam stat.', kind: 'tip' },
  ],
};
