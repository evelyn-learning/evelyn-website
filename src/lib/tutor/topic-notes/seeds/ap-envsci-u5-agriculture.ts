/**
 * AP Environmental Science — Unit 5 CED 5.3-5.7+5.14-5.16: Agriculture and Food Production.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.agriculture.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AGRICULTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.agriculture.v1',
  course: 'AP Environmental Science',
  cedUnit: 5,
  cedTopic: '5.3-5.7+5.14-5.16',
  cedTitle: 'Agriculture and Food Production',
  planId: 'evelyn.ap.envsci.agriculture.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.agriculture.v1' }],
  theory: [
    { loId: 'apenvsci.agriculture', kind: 'definition', title: 'Green Revolution', content: `mid-20th-century (1940s-1960s) SURGE in food production. Achieved through five levers: HIGH-YIELD VARIETIES (HYVs — selectively bred crops like Borlaug's semi-dwarf wheat and IRRI rice), SYNTHETIC FERTILIZERS (Haber-Bosch nitrogen), CHEMICAL PESTICIDES, expanded IRRIGATION, and MECHANIZATION (tractors, combines). It is FOSSIL-FUEL DEPENDENT — high energy input per calorie produced.` },
    { loId: 'apenvsci.agriculture', content: `GREEN REVOLUTION TRADE-OFF. POSITIVE: averted famines (especially India and Mexico) and roughly DOUBLED global yields. NEGATIVE: monoculture vulnerability, soil degradation, pesticide pollution, water depletion, and loss of crop genetic diversity. The AP framing is always benefits WEIGHED AGAINST environmental costs.` },
    { loId: 'apenvsci.agriculture', content: `INDUSTRIAL AGRICULTURE IMPACTS. SOIL DEGRADATION — erosion runs about 10x faster than soil formation, plus compaction and nutrient depletion. WATER — agriculture consumes about 70% of human freshwater use. EUTROPHICATION — fertilizer runoff feeds algal blooms that create hypoxic DEAD ZONES. PESTICIDE POLLUTION — groundwater contamination and biomagnification (the DDT precedent). GHG EMISSIONS — livestock methane, nitrous oxide from fertilizer, and fossil fuels for machinery.` },
    { loId: 'apenvsci.agriculture', kind: 'definition', title: 'salinization', content: `salt accumulates in soil as repeated irrigation water evaporates, leaving its dissolved salts behind. Reduces fertility over time (the Aral Sea and historical Mesopotamian decline are classic cases). Worst under inefficient flood irrigation in arid regions.` },
    { loId: 'apenvsci.agriculture', content: `IRRIGATION METHODS ranked by efficiency. FLOOD / FURROW — water flows over the field; cheap but INEFFICIENT (about 40% reaches the plant), causing waterlogging and salinization. SPRAY / SPRINKLER — mimics rain; better (about 70% efficient) but energy-hungry. DRIP IRRIGATION — water delivered right at the root zone through tubes; HIGHLY EFFICIENT (about 90%) with high upfront cost. Drip is the sustainability winner.` },
    { loId: 'apenvsci.agriculture', content: `PESTICIDE TYPES. INSECTICIDES kill insects, HERBICIDES kill weeds, FUNGICIDES kill fungi, RODENTICIDES kill rodents. Core problems: PEST RESISTANCE EVOLVES (overuse selects for resistant survivors), BENEFICIAL insects (pollinators, predators) are killed, and PERSISTENT pesticides like DDT bioaccumulate and biomagnify. DDT was banned in the US in 1972.` },
    { loId: 'apenvsci.agriculture', kind: 'definition', title: 'integrated pest management (IPM)', content: `a strategy that MINIMIZES pesticide use by combining crop rotation, resistant varieties, biological controls (predators, parasitoids), and pheromone traps — applying chemical pesticide only as a LAST RESORT when a pest population exceeds an economic threshold.` },
    { loId: 'apenvsci.agriculture', content: `SUSTAINABLE AGRICULTURE PRACTICES. CROP ROTATION — alternating crops year to year breaks pest cycles and balances soil nutrients. POLYCULTURE / INTERCROPPING — multiple crops in one field mimics natural diversity. COVER CROPS — rye or clover over winter prevent erosion and fix nitrogen. CONSERVATION TILLAGE / NO-TILL — reduces soil disturbance and erosion. ORGANIC FARMING — no synthetic pesticides or fertilizers. AGROFORESTRY — trees combined with crops restores ecosystem services while producing food.` },
    { loId: 'apenvsci.agriculture', content: `LIVESTOCK AND FOOD CHOICES. BEEF has the highest environmental footprint per calorie (water, land, and GHG). CAFOs (concentrated animal feeding operations) produce meat efficiently but concentrate pollution (MANURE RUNOFF), rely on antibiotics, and raise animal-welfare concerns. Eating LOWER on the food chain (the 10% rule — only about 10% of energy transfers between trophic levels) shrinks the footprint, so plant-based diets are far more land- and energy-efficient.` },
    { loId: 'apenvsci.agriculture', kind: 'definition', title: 'aquaculture', content: `farming of aquatic organisms; roughly HALF of all seafood eaten today is farmed. POSITIVE — relieves pressure on wild fisheries and gives controlled production. NEGATIVE — waste pollution, antibiotic use, ESCAPE of farmed fish (genetic dilution of wild stocks), and feed pressure (carnivorous farmed species need wild fishmeal). SUSTAINABLE choices: filter feeders (oysters, clams), herbivores (tilapia), and closed recirculating systems.` },
    { loId: 'apenvsci.agriculture', content: `THE FERTILIZER TRADE-OFF worth memorizing for FRQs: synthetic fertilizer BOOSTS yield but its NITROGEN and PHOSPHORUS runoff drives eutrophication downstream. Fixes that keep yield while cutting runoff: precision nutrient application, cover crops, buffer strips, and integrated nutrient management (apply only what the crop needs).` },
    { loId: 'apenvsci.agriculture', content: `WHY MONOCULTURE IS RISKY: planting a single genetically uniform crop over huge areas maximizes short-term yield and mechanization but leaves the crop vulnerable — one pest or pathogen can wipe out the whole stand, and the practice narrows the crop gene pool that future breeding depends on.` },
  ],
  methods: [
    {
      title: 'Recommend an irrigation upgrade for a water-stressed farm',
      when_to_use: `When asked to pick and justify an irrigation method under drought or rising water costs.`,
      steps: [
        `STEP 1 — RECOMMEND DRIP IRRIGATION as the efficient option.`,
        `STEP 2 — STATE THE ENVIRONMENTAL BENEFIT: about 90% efficiency versus about 40% for flood means roughly HALF the water used. Less groundwater depletion and less salinization (less applied water means less salt deposited).`,
        `STEP 3 — STATE THE ECONOMIC BENEFIT: a lower water bill, and fertilizer delivered through the drip system (FERTIGATION) uses less fertilizer for higher yield per unit water.`,
        `STEP 4 — ACKNOWLEDGE THE TRADE-OFF: high upfront installation cost and ongoing maintenance of the tubing.`,
        `STEP 5 — CONCLUDE with net payback: in arid agriculture drip typically pays back over roughly 3 to 7 years.`,
      ],
      example: { problem: `A California farmer using flood irrigation faces rising water costs and drought. Recommend an alternative and justify it with environmental and economic benefits.`, solution: `Switch to drip: about 90% efficient (versus 40% for flood), so roughly 50% less water, less salinization, lower water and fertilizer bills; the trade-off is high upfront cost that pays back over a few years.` },
      relatedLoIds: ['apenvsci.agriculture'],
    },
    {
      title: 'Design an IPM program to cut pesticide use',
      when_to_use: `When asked for strategies to reduce pesticide reliance on a crop.`,
      steps: [
        `STEP 1 — CROP ROTATION: plant the crop in a different field each year to break pest life cycles so specialists cannot accumulate.`,
        `STEP 2 — BIOLOGICAL CONTROL: release natural enemies (ladybugs for aphids, parasitoid wasps for caterpillar eggs) to target specific pests without chemicals.`,
        `STEP 3 — RESISTANT VARIETIES: choose cultivars bred for resistance to common local pests and diseases.`,
        `STEP 4 — MONITOR AND SET THRESHOLDS: apply pesticide only when a pest population exceeds the economic threshold — never spray prophylactically.`,
        `STEP 5 — ADD PHYSICAL / BEHAVIORAL TOOLS: pheromone traps, row covers, and sticky traps as low-chemical supplements.`,
      ],
      example: { problem: `A farmer wants to reduce pesticide use on a tomato crop. Suggest three IPM strategies and the mechanism of each.`, solution: `Rotation breaks pest cycles; biological control (ladybugs, parasitoid wasps) removes pests without chemicals; resistant cultivars lower vulnerability — with pesticide reserved for when monitoring shows the threshold is crossed.` },
      relatedLoIds: ['apenvsci.agriculture'],
    },
  ],
  pointers: [
    { content: 'Green Revolution = HYVs + fertilizer + pesticides + irrigation + mechanization.', kind: 'tip' },
    { content: 'Irrigation efficiency: flood ~40% < spray ~70% < drip ~90%. Drip wins.', kind: 'tip' },
    { content: 'Salinization = salt left behind as irrigation water evaporates; kills fertility.', kind: 'tip' },
    { content: 'IPM makes pesticide the LAST resort behind biological and cultural controls.', kind: 'tip' },
    { content: 'Fertilizer runoff (N and P) drives eutrophication and dead zones.', kind: 'tip' },
    { content: 'Beef has the highest footprint per calorie; eat lower on the food chain.', kind: 'tip' },
  ],
};
