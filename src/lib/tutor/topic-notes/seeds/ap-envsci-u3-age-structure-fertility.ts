/**
 * AP Environmental Science — Unit 3 CED 3.6-3.7: Age Structure and Fertility.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.age-structure-fertility.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AGE_STRUCTURE_FERTILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.age-structure-fertility.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.6-3.7',
  cedTitle: 'Age Structure and Fertility',
  planId: 'evelyn.ap.envsci.age-structure-fertility.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.age-structure-fertility.v1' }],
  theory: [
    { loId: 'apenvsci.age-structure-fertility', content: `AGE STRUCTURE DIAGRAM (population pyramid): horizontal bar chart with age groups stacked vertically (youngest at bottom). Males on left, females on right. Bar length = percent of total population in that age-sex group.` },
    { loId: 'apenvsci.age-structure-fertility', content: 'THREE TYPICAL SHAPES:' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • EXPANDING (broad-base pyramid): many young, few old. High birth rate, future growth. Examples: Niger, Uganda, Afghanistan.` },
    { loId: 'apenvsci.age-structure-fertility', content: `  • STABLE (column / rectangle): roughly equal across ages. Birth rate ≈ death rate. Examples: USA, UK, France.` },
    { loId: 'apenvsci.age-structure-fertility', content: `  • DECLINING / TOP-HEAVY (narrow base, wider middle): more elderly than children. Will shrink. Examples: Japan, Italy, Germany.` },
    { loId: 'apenvsci.age-structure-fertility', content: 'WHAT A PYRAMID PREDICTS:' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • Expanding → lots of young people will reach reproductive age → continued growth.` },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Stable → reproductive replacement balances mortality → flat trajectory.' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • Declining → too few young people to replace dying elderly → population decreases over time.` },
    { loId: 'apenvsci.age-structure-fertility', content: `  • POPULATION MOMENTUM: even if fertility drops to replacement level, an expanding pyramid will keep growing for ~30-50 years as young cohorts move through their reproductive years.` },
    { loId: 'apenvsci.age-structure-fertility', content: `TOTAL FERTILITY RATE (TFR): the AVERAGE number of children a woman would have over her lifetime, given current age-specific fertility rates. NOT the same as births per year.` },
    { loId: 'apenvsci.age-structure-fertility', content: `REPLACEMENT-LEVEL FERTILITY: the TFR needed to maintain population size over time, accounting for child mortality. 
  • In LOW-mortality countries: ~2.1 (each woman replaces herself + male partner; the 0.1 accounts for childhood mortality and gender ratio).` },
    { loId: 'apenvsci.age-structure-fertility', content: `  • In HIGH-mortality countries: 2.5-3.0+ (need more births to compensate for higher infant/child mortality).` },
    { loId: 'apenvsci.age-structure-fertility', content: `CURRENT WORLD TFR: ~2.3 (2024). Has been falling worldwide; expected to drop to ~1.8 by 2100.` },
    { loId: 'apenvsci.age-structure-fertility', content: 'TFR PATTERNS:' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • TFR ≈ 1.0-1.5: well below replacement; population aging and shrinking. Japan (1.3), Italy (1.2), South Korea (0.7 — the lowest in world).` },
    { loId: 'apenvsci.age-structure-fertility', content: '  • TFR ≈ 1.8-2.2: near replacement. USA (~1.7), UK, France.' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • TFR ≈ 4-7: high fertility, population growing. Niger (6.5), Somalia (6.0), DRC (6.0).` },
    { loId: 'apenvsci.age-structure-fertility', content: 'FACTORS LOWERING TFR:' },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Education, especially of women.' },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Access to contraception and family planning.' },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Women in workforce (delayed childbearing).' },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Urbanization (children less economically valuable).' },
    { loId: 'apenvsci.age-structure-fertility', content: `  • Lower infant mortality (parents don't need many to ensure survival).` },
    { loId: 'apenvsci.age-structure-fertility', content: '  • Higher cost of raising children (modern economies).' },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'population pyramid', content: 'age-sex distribution chart predicting future population trends.' },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'TFR', content: 'total fertility rate — average lifetime children per woman.' },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'replacement-level fertility', content: 'TFR needed to maintain population (~2.1 in low-mortality settings).' },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'population momentum', content: 'continued growth from young cohorts even after fertility drops.' },
  ],
  methods: [
    {
      title: 'Worked pyramid',
      steps: [
        `STEP 1 — COUNTRY X: very wide base (35% young), very narrow top (5% old). EXPANDING pyramid. 
  • Young cohorts will reach reproductive age and have children. 
  • Population will GROW substantially over next 50 years even if TFR drops (population momentum). 
  • Likely TFR is high (4-6).`,
        `STEP 2 — COUNTRY Y: narrow base (12% young), heavy top (25% old). DECLINING pyramid. 
  • Few young people to reach reproductive age. 
  • Population will DECLINE over next 50 years. 
  • Likely TFR is low (1.0-1.5).`,
        `STEP 3 — Implications differ: X faces resource pressure, education needs; Y faces aging-population challenges (pensions, healthcare, shrinking workforce).`,
      ],
      example: { problem: `Country X has a population pyramid where children 0-9 represent 35% of the population and adults over 60 represent 5%. Country Y has 0-9 at 12% and over-60 at 25%. Predict each country's 50-year population trajectory.`, solution: 'X will grow; Y will shrink.' },
      relatedLoIds: ['apenvsci.age-structure-fertility'],
    },
  ],
  pointers: [
    { content: `Population pyramid: wide base = expanding; column = stable; narrow base = declining.`, kind: 'tip' },
    { content: 'TFR ≈ 2.1 = replacement (low-mortality settings); 2.5-3+ in high-mortality.', kind: 'tip' },
    { content: 'Population momentum: 30-50 year lag between TFR drop and population decline.', kind: 'tip' },
    { content: `TFR drops with education, urbanization, women's participation, lower infant mortality.`, kind: 'tip' },
  ],
};
