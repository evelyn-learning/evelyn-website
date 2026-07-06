/**
 * AP Environmental Science — Unit 3 CED 3.1-3.3: Survivorship and Life History.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.survivorship-r-k.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_SURVIVORSHIP_R_K: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.survivorship-r-k.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.1-3.3',
  cedTitle: 'Survivorship and Life History',
  planId: 'evelyn.ap.envsci.survivorship-r-k.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.survivorship-r-k.v1' }],
  theory: [
    { loId: 'apenvsci.survivorship-r-k', content: 'GENERALIST vs SPECIALIST (review):' },
    { loId: 'apenvsci.survivorship-r-k', content: `  • GENERALIST: broad tolerance, many habitats, many food sources. Resilient to change. Examples: rats, raccoons, coyotes, humans.` },
    { loId: 'apenvsci.survivorship-r-k', content: `  • SPECIALIST: narrow tolerance, specific habitat or food. Vulnerable to change. Examples: koalas (eucalyptus), pandas (bamboo), some orchids.` },
    { loId: 'apenvsci.survivorship-r-k', content: 'r-SELECTED vs K-SELECTED — life-history strategies on a continuum.' },
    { loId: 'apenvsci.survivorship-r-k', content: 'r-SELECTED ("r" for intrinsic rate of increase):' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Many small offspring; little to no parental care.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Short generation time, early reproduction.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Low survival rate per offspring (most die).' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Thrive in unstable, disturbed environments.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Examples: insects, weeds, mice, dandelions, frogs.' },
    { loId: 'apenvsci.survivorship-r-k', content: 'K-SELECTED ("K" for carrying capacity):' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Few large offspring; significant parental care.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Long generation time, late reproduction.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • High survival rate per offspring.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Thrive in stable environments.' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Vulnerable to extinction (slow recovery from disturbance).' },
    { loId: 'apenvsci.survivorship-r-k', content: '  • Examples: elephants, whales, primates, oak trees, condors.' },
    { loId: 'apenvsci.survivorship-r-k', content: 'SURVIVORSHIP CURVES (plot of survivors vs age):' },
    { loId: 'apenvsci.survivorship-r-k', content: `  • TYPE I: high survival in early/middle life, sharp decline in old age. K-selected. Good parental care. Examples: humans, elephants, large mammals.` },
    { loId: 'apenvsci.survivorship-r-k', content: `  • TYPE II: roughly CONSTANT mortality rate at all ages — straight diagonal line on log scale. Examples: many birds, some lizards, hydra.` },
    { loId: 'apenvsci.survivorship-r-k', content: `  • TYPE III: very high mortality early, then survivors live long. r-selected. Many offspring, no parental care. Examples: oysters, sea turtles, fish, dandelions, oak trees (acorns to mature trees).` },
    { loId: 'apenvsci.survivorship-r-k', content: `AP NOTE: type I is concave (drops at end); type II is linear; type III drops sharply at start then plateaus. Sketch a graph: x = age, y = survivors (log scale), three curves.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'r-selected', content: 'many small offspring, little care, fast reproduction; thrives after disturbance.' },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'K-selected', content: `few large offspring, much care, slow reproduction; thrives in stable environment.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'survivorship curve', content: 'graph of how many individuals survive to each age.' },
  ],
  methods: [
    {
      title: 'Worked classify',
      steps: [
        `(a) Salmon lay thousands of eggs, no parental care, early life mortality is enormous → r-selected; Type III.`,
        `(b) Elephants gestate for 22 months, raise one calf at a time for years, low offspring count, high parental care → K-selected; Type I.`,
        `(c) House sparrows lay several eggs per clutch, modest parental care, moderate juvenile mortality, fairly constant adult mortality → Type II (closer to middle of spectrum).`,
      ],
      example: { problem: `For each species, identify likely r/K strategy AND survivorship curve type: (a) salmon, (b) elephant, (c) house sparrow.`, solution: '(a) r-selected, Type III. (b) K-selected, Type I. (c) Type II.' },
      relatedLoIds: ['apenvsci.survivorship-r-k'],
    },
  ],
  pointers: [
    { content: `r-selected: many small offspring, little care, fast. K-selected: few large, much care, slow.`, kind: 'tip' },
    { content: `Type I: low juvenile mortality, sharp decline at end (humans). Type II: constant rate (some birds). Type III: high juvenile mortality, then survival (fish, turtles).`, kind: 'tip' },
    { content: 'r-selected recover from disturbance faster; K-selected vulnerable to extinction.', kind: 'tip' },
  ],
};
