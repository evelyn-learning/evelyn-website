/**
 * AP Environmental Science — Unit 6 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U6_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u6-frq-practice.v1', title: 'U6 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u6-frq-practice', description: 'Apply Unit 6 energy concepts to AP-style FRQs.', standard: 'AP-ENVSCI-6-FRQ' }],
  prerequisites: ['apenvsci.energy-conservation'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 6 FRQs: fossil/renewable comparison + energy-efficiency math.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Fossil fuels: coal/oil/gas. CO₂ ranking: coal > oil > gas.',
      'Renewables: solar, wind, hydro, geothermal — pros + intermittency cons.',
      'Nuclear: zero CO₂; waste + safety risks.',
      'Conservation vs efficiency; rebound effect.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-tradeoffs', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Energy Source Comparison. A country wants to replace 100 MW of coal-fired electricity. Compare nuclear, solar, and natural gas as alternatives. (a) For each, identify ONE PRO and ONE CON. (b) Which is the most CLIMATE-friendly? Justify with CO₂ data. (c) Which is the most RELIABLE (capacity factor)? (d) Recommend a hybrid solution.',
      expectedAnswer: '(a) PROS/CONS:\n• NUCLEAR: PRO — zero CO₂ emissions, 24/7 reliability. CON — radioactive waste, accident risk, 10-15 years to build, high upfront cost. \n• SOLAR: PRO — zero direct emissions, declining costs (cheapest new generation), modular. CON — intermittent (no nighttime), seasonal variation, weather-dependent. \n• NATURAL GAS: PRO — flexible, fast deployment, cheaper than nuclear, ~50% less CO₂ than coal. CON — still emits CO₂, methane leakage offsets some gains, fossil fuel (depleting). (3)\n(b) MOST CLIMATE-FRIENDLY: NUCLEAR or SOLAR (both zero direct emissions). \nCO₂ data per kWh:\n• Coal: ~1000 g CO₂/kWh \n• Natural gas: ~440 g CO₂/kWh \n• Nuclear: ~12 g CO₂/kWh (lifecycle including construction) \n• Solar: ~40-80 g CO₂/kWh (lifecycle) \nNuclear has the lowest lifecycle emissions; solar very low; both vastly better than gas. (1.5)\n(c) MOST RELIABLE (capacity factor):\n• Nuclear: 90%+ — 24/7 baseload. \n• Natural gas: 40-60% (depending on dispatch). \n• Solar: 15-25% — daytime only, weather-affected. \nNuclear is most reliable. (1.5)\n(d) HYBRID RECOMMENDATION: \n• 30% NUCLEAR — provides reliable, low-carbon baseload. \n• 50% SOLAR + WIND — bulk of generation when sun/wind available; cheapest new capacity. \n• 20% NATURAL GAS PEAKER — flexible backup for low-renewable hours. \n• Combined with STORAGE (batteries, pumped hydro) to smooth intermittency. \n• This achieves substantial decarbonization while maintaining reliability. (2)\nTotal: 8 points.',
      responseFormat: 'frq', hints: ['Multi-criteria; specific numbers; pragmatic recommendation.'], estimatedMinutes: 7 },
    { id: 'try-frq-efficiency', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Efficiency Math. A homeowner replaces a 12 kW oil furnace (60% efficient) with a 12 kW heat pump (300% efficient — yes, more than 100%, because heat pumps move heat rather than create it). Operating 8 hours/day during 4-month heating season. Oil costs $4.00/gallon (1 gallon = 138,000 BTU). Electricity costs $0.15/kWh. (a) Calculate annual oil cost. (b) Calculate annual electricity cost. (c) Compute environmental benefit (oil emits ~22 lb CO₂/gallon; electricity 0.5 lb CO₂/kWh).',
      expectedAnswer: '(a) Oil furnace cost:\n• 12 kW = 41,000 BTU/hr (1 kW = 3,412 BTU/hr). \n• Useful heat output = 12 kW × 60% efficiency = 7.2 kW useful. \n• At 60% efficiency, oil-equivalent input is 12 kW / 0.60 = 20 kW (68,250 BTU/hr). \n• Daily input: 20 kW × 8 hr = 160 kWh equivalent. Convert to BTU: 160 × 3412 = 546,000 BTU/day. \n• Daily oil: 546,000 / 138,000 = 3.96 gallons. \n• Annual (120 days): 3.96 × 120 = 475 gallons. \n• Cost: 475 × $4.00 = $1,900/year. (3)\n(b) Heat pump cost:\n• Useful heat output: same 12 kW × 8 hr = 96 kWh equivalent (in useful heat). \n• Electricity input at 300% efficiency: 96 kWh / 3.0 = 32 kWh/day. \n• Annual (120 days): 32 × 120 = 3,840 kWh. \n• Cost: 3,840 × $0.15 = $576/year. (2)\n(c) Environmental:\n• Oil: 475 gallons × 22 lb CO₂/gal = 10,450 lb CO₂/year. \n• Electricity: 3,840 kWh × 0.5 lb/kWh = 1,920 lb CO₂/year. \n• SAVINGS: 10,450 − 1,920 = 8,530 lb CO₂ avoided per year. (2)\nThe heat pump saves both money ($1,324/year) and reduces emissions ~80%. (2)\nTotal: 9 points.',
      responseFormat: 'frq', hints: ['Multi-step unit conversions; show calculations clearly.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Energy mix matters: each source has CO₂ + cost + reliability profile.',
      'Hybrid systems (renewable + nuclear + gas backup + storage) are practical.',
      'Efficiency math: input × efficiency = useful output.',
      'Heat pumps > 100% efficient because they MOVE heat, not create it.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6-FRQ', cedTitle: 'Unit 6 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-6 FRQs.' }] },
};
