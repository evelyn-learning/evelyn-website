/**
 * AP Macroeconomics — Unit 1 CED 1.2: Resource Allocation and Economic Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.resource-allocation.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_RESOURCE_ALLOCATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.resource-allocation.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Resource Allocation and Economic Systems',
  planId: 'evelyn.ap.macro.resource-allocation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.resource-allocation.v1' }],
  theory: [
    { loId: 'apmacro.resource-allocation', content: `FOUR FACTORS OF PRODUCTION — the inputs every economy uses to make goods and services: (1) LAND — natural resources: the literal land plus minerals, water, forests, energy. (2) LABOR — human work. (3) CAPITAL — the PRODUCED means of production: tools, machines, buildings, equipment. (4) ENTREPRENEURSHIP — the willingness to organize the other three factors and BEAR RISK to produce something.` },
    { loId: 'apmacro.resource-allocation', content: `CAPITAL DOES NOT MEAN MONEY. In economics, capital = physical productive resources (ovens, laptops, factories, infrastructure). Money is a medium of exchange; it produces nothing by itself — what money BUYS (the machines, the buildings) is the capital. On the AP exam, "capital" means the physical sense unless the question explicitly says "financial capital."` },
    { loId: 'apmacro.resource-allocation', content: `THREE ECONOMIC QUESTIONS every society must answer: WHAT goods and services to produce? HOW to produce them (which combination of factors)? FOR WHOM are they produced (how is output distributed)? An economic system IS a society's way of answering these three questions.` },
    { loId: 'apmacro.resource-allocation', content: `COMMAND ECONOMY: a central authority (typically government) answers WHAT/HOW/FOR WHOM. Examples: Soviet Union, North Korea, Cuba. STRENGTH: can mobilize resources toward clear goals (war, rapid industrialization). WEAKNESS: the INFORMATION PROBLEM — no central planner can gather all the dispersed knowledge that prices aggregate. Tends toward shortages and misallocation.` },
    { loId: 'apmacro.resource-allocation', content: `MARKET ECONOMY: decentralized — PRICES coordinate decisions across buyers and sellers. No one is "in charge"; outcomes emerge from many private transactions. STRENGTH: efficient allocation when markets work; rewards productive activity. WEAKNESS: market failures — externalities, public goods, monopoly, information asymmetry, severe inequality — can produce bad outcomes needing correction.` },
    { loId: 'apmacro.resource-allocation', content: `MIXED ECONOMY: combines markets with government provision and regulation. EVERY real-world economy is mixed — they differ in HOW MUCH government, not whether. The US, Germany, Sweden, China, and India are all mixed; the spectrum places them at different points. Comparison dimensions: government share of GDP, size of public sector, extent of redistribution, regulatory reach.` },
    { loId: 'apmacro.resource-allocation', content: `COMMAND vs MARKET IS A SPECTRUM, not a binary. Claims like "the US is a market economy and Sweden is socialist" oversimplify: both rely fundamentally on private property, prices, and markets; they differ in degree (government spending share, universal public services, redistribution).` },
    { loId: 'apmacro.resource-allocation', content: `INCENTIVES drive choices in ANY system. Markets create incentives via prices and profits; command systems create them via mandates and quotas. Incentive-reasoning is the underlying logic of every AP Macro unit.` },
    { loId: 'apmacro.resource-allocation', content: `CLASSIFYING RESOURCES: some items straddle factors — a founder is BOTH labor (worker-hours) AND entrepreneurship (strategy, risk-bearing); a storefront building is capital while the plot underneath is land. On AP questions, justify the classification; the reasoning matters as much as the label.` },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'factors of production', content: `the inputs (land, labor, capital, entrepreneurship) used to produce goods and services.` },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'capital (economic)', content: `produced means of production — tools, equipment, buildings. NOT money.` },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'mixed economy', content: `an economy combining market mechanisms with government provision and regulation.` },
  ],
  methods: [
    {
      title: 'Classify resources into the four factors and read off the three questions',
      steps: [
        `STEP 1 — LIST every resource the producer uses: people, structures, machines, raw materials, energy, and the organizer of it all.`,
        `STEP 2 — LAND: pull out the natural resources — raw materials at their origin (the wheat field), the underlying plot, water, energy inputs.`,
        `STEP 3 — LABOR: pull out the human work-hours — chef, cashier, driver, engineer.`,
        `STEP 4 — CAPITAL: pull out the produced-things-used-to-produce — oven, refrigerator, vehicle, building, laptops, servers. Remember: NOT money.`,
        `STEP 5 — ENTREPRENEURSHIP: identify who organized the factors and bore the risk — the founder/owner in their strategist-and-risk-taker role (separable from any worker-hours they also contribute).`,
        `STEP 6 — ANSWER THE THREE QUESTIONS for the producer: WHAT is produced (and what signal drove that choice — profit expectations in a market)? HOW are factors combined (and what substitutions would price changes trigger)? FOR WHOM (in a market: whoever is willing and able to pay).`,
      ],
      example: {
        problem: `Classify the resources a small pizza shop uses into the four factors of production, and identify how the shop answers the three economic questions.`,
        solution: `LAND = the wheat field behind the flour, the plot under the store. LABOR = chef, cashier, delivery driver. CAPITAL = oven, refrigerator, delivery vehicle, the building itself. ENTREPRENEURSHIP = the owner who organized it all and bore the risk. WHAT: pizzas — chosen because expected demand made them profitable. HOW: the owner's chosen mix of staff and equipment (substitutable as factor prices change). FOR WHOM: customers willing and able to pay the menu price — allocation by price.`,
      },
      relatedLoIds: ['apmacro.resource-allocation'],
    },
  ],
  pointers: [
    { content: 'Four factors: land, labor, capital, entrepreneurship. Capital = physical productive stuff, NOT money.', kind: 'tip' },
    { content: 'Three questions every society answers: WHAT, HOW, FOR WHOM.', kind: 'tip' },
    { content: 'Every real economy is MIXED — command vs market is a spectrum of degree, not a binary.', kind: 'tip' },
    { content: 'Command weakness = information problem (planners lack the knowledge prices aggregate); market weakness = market failures.', kind: 'tip' },
    { content: 'A founder counts twice: worker-hours = labor; organizing + risk-bearing = entrepreneurship.', kind: 'tip' },
  ],
};
