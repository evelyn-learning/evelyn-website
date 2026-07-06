/**
 * AP Macroeconomics — Unit 1 CED 1.2: Resource Allocation and Economic Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.resource-allocation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.resource-allocation.v1' }],
  theory: [
    { loId: 'apmacro.resource-allocation', content: `FOUR FACTORS OF PRODUCTION — the inputs every economy uses to make goods and services: (1) LAND — natural resources (the literal land, plus minerals, water, forests). (2) LABOR — human work. (3) CAPITAL — the produced means of production: tools, buildings, machines. NOTE: in economics "capital" does NOT mean money. (4) ENTREPRENEURSHIP — the willingness to organize the other three factors and bear risk to produce something.` },
    { loId: 'apmacro.resource-allocation', content: `THREE ECONOMIC QUESTIONS every society must answer: WHAT goods and services to produce? HOW to produce them (which combination of factors)? FOR WHOM are they produced (how to distribute the output)?` },
    { loId: 'apmacro.resource-allocation', content: `COMMAND ECONOMY: a central authority (typically government) makes the WHAT/HOW/FOR WHOM decisions. Examples: Soviet Union, North Korea, Cuba. Strength: can mobilize for clear goals (war, industrialization). Weakness: information problem — no central planner can know all the dispersed knowledge that prices aggregate. Tends toward shortages and misallocation.` },
    { loId: 'apmacro.resource-allocation', content: `MARKET ECONOMY: decentralized — prices coordinate decisions across buyers and sellers. No one is "in charge"; outcomes emerge from many private transactions. Strength: efficient allocation when markets work; rewards productive activity. Weakness: market failures (externalities, public goods, monopoly, information asymmetry, severe inequality) can produce bad outcomes that need correcting.` },
    { loId: 'apmacro.resource-allocation', content: `MIXED ECONOMY: combines markets with government provision/regulation. EVERY real-world economy is mixed — they vary by HOW MUCH government, not whether. The US, Germany, Sweden, China, India are all mixed; the spectrum places them differently.` },
    { loId: 'apmacro.resource-allocation', content: `INCENTIVES drive choices in any system. Markets create incentives via prices and profits; command systems create them via mandates and quotas. AP MACRO: incentive-talk is the underlying logic of every chapter; you will see it again in every unit.` },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'factors of production', content: `the inputs (land, labor, capital, entrepreneurship) used to produce goods and services.` },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'capital (economic)', content: 'produced means of production — tools, equipment, buildings. NOT money.' },
    { loId: 'apmacro.resource-allocation', kind: 'definition', title: 'mixed economy', content: 'an economy combining market mechanisms with government provision and regulation.' },
  ],
  methods: [
    {
      title: 'Worked pizza shop',
      steps: [
        `LIST resources used: the building rented for the storefront, the chef who makes pizzas, the oven, the wheat that becomes flour, the delivery vehicle, the cashier, the owner who started the shop.`,
        `LAND (natural resources): the wheat field where the flour originated, the location/plot the storefront sits on. (The building itself counts as capital, but the underlying land is land.)`,
        `LABOR: the chef's work, the cashier's work, the delivery driver's work.`,
        `CAPITAL: the oven, the refrigerator, the delivery vehicle, the POS system, the storefront building. Produced things used to produce more things.`,
        `ENTREPRENEURSHIP: the owner who saw an opportunity, organized the other three factors, took on the risk of failure, and made the strategic decisions.`,
        `WHAT? The shop produces pizzas — chosen because the owner judged consumer demand would be there at a profitable price. (In a market economy, prices and profits drove the decision.)`,
        `HOW? The owner combined factors in a particular ratio: a small staff, a moderate-size oven, etc. If labor became cheaper she might hire more; if ovens got cheaper she might add a second one. Substitution among factors.`,
        `FOR WHOM? Whoever pays the price. Pizzas go to the customers who decide they want a pizza enough to pay $15 for it. Distribution is by willingness-and-ability to pay.`,
      ],
      example: { problem: `Classify the resources a small pizza shop uses to produce a pizza into the four factors of production. Then identify how the shop answers the three economic questions.`, solution: `Land = wheat field, plot. Labor = chef/cashier/driver. Capital = oven, fridge, vehicle, building. Entrepreneurship = owner. WHAT/HOW/FOR WHOM all answered through prices, profits, and the owner's judgment — characteristic of market answers.` },
      relatedLoIds: ['apmacro.resource-allocation'],
    },
  ],
  pointers: [
    { content: `Four factors of production: land, labor, capital, entrepreneurship. Capital = physical productive resources, NOT money.`, kind: 'tip' },
    { content: 'Three economic questions: WHAT, HOW, FOR WHOM.', kind: 'tip' },
    { content: `Command vs market is a SPECTRUM. Every real economy is mixed — the question is HOW MUCH of each.`, kind: 'tip' },
    { content: `Markets allocate via prices; command systems allocate via central decisions; mixed economies blend.`, kind: 'tip' },
  ],
};
