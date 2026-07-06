/**
 * AP Environmental Science — Unit 2 CED 2.4+2.6: Tolerance and Adaptations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.tolerance-adaptations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_TOLERANCE_ADAPTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.tolerance-adaptations.v1',
  course: 'AP Environmental Science',
  cedUnit: 2,
  cedTopic: '2.4+2.6',
  cedTitle: 'Tolerance and Adaptations',
  planId: 'evelyn.ap.envsci.tolerance-adaptations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.tolerance-adaptations.v1' }],
  theory: [
    { loId: 'apenvsci.tolerance-adaptations', content: `ECOLOGICAL TOLERANCE: the range of conditions (temperature, salinity, pH, moisture, etc.) under which a species can SURVIVE and REPRODUCE.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `TOLERANCE CURVE: a bell-shaped distribution showing performance vs. environmental variable. Has:` },
    { loId: 'apenvsci.tolerance-adaptations', content: '  • OPTIMAL ZONE: conditions where the species thrives, reproduces.' },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • ZONE OF PHYSIOLOGICAL STRESS: organism survives but doesn't thrive — slow growth, reduced reproduction.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • ZONE OF INTOLERANCE: organism can't survive.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `LIEBIG'S LAW OF THE MINIMUM: growth is limited by whatever resource is in SHORTEST SUPPLY (the most limiting factor). Adding more of an abundant nutrient won't help if a different one is limiting. Iconic image: a barrel's capacity is limited by its SHORTEST stave.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `SHELFORD'S LAW OF TOLERANCE: organisms have BOTH a MINIMUM and a MAXIMUM tolerance for any environmental factor. Extremes BELOW or ABOVE the optimal range cause harm. (Liebig only addressed shortage; Shelford generalized to both ends.)` },
    { loId: 'apenvsci.tolerance-adaptations', content: 'GENERALIST vs SPECIALIST:' },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • GENERALIST: broad tolerance for many conditions; many food sources. Examples: raccoons, coyotes, humans, cockroaches. Can survive habitat change.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • SPECIALIST: narrow tolerance; specific food/habitat. Examples: koalas (eucalyptus only), pandas (bamboo), polar bears (sea ice). Vulnerable to environmental change.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `ADAPTATIONS — heritable traits that increase fitness in a given environment. Three categories:` },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • STRUCTURAL (anatomical): physical features. Cactus spines for water storage and defense; thick fur in arctic mammals; webbed feet in ducks; long necks in giraffes.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • BEHAVIORAL: actions/responses. Migration of birds; hibernation; nocturnality in deserts; pack hunting in wolves.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `  • PHYSIOLOGICAL: internal/biochemical. Antifreeze proteins in arctic fish; venom production; bacterial heat tolerance (extremophiles); detoxification enzymes.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `NICHE: the role/position a species occupies in its ecosystem. Specifies habitat, food, resource use, time of activity. Closely related species can coexist by occupying DIFFERENT niches (resource partitioning).` },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'tolerance range', content: 'span of environmental conditions a species can survive.' },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'limiting factor', content: 'the resource in shortest supply that constrains growth.' },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'specialist', content: 'narrow tolerance / specific habitat or food.' },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'generalist', content: 'broad tolerance / many habitats and food sources.' },
  ],
  methods: [
    {
      title: 'Worked limiting',
      steps: [
        `STEP 1 — Identify what the plant needs and what it has: N (abundant), P (abundant), K (abundant), water (low).`,
        `STEP 2 — Plant performance is constrained by the SCARCEST input. Adding more abundant inputs doesn't help.`,
        'STEP 3 — LIMITING FACTOR: water.',
        `STEP 4 — LIEBIG'S LAW OF THE MINIMUM: growth is constrained by the resource in shortest supply, regardless of the others.`,
        'STEP 5 — Action: the farmer should irrigate, not fertilize.',
      ],
      example: { problem: `A farmer fertilizes his crop with phosphorus, but yields don't improve. Soil tests show abundant N, P, K but very low water. What's the limiting factor? What law does this illustrate?`, solution: `Water is the limiting factor; Liebig's Law of the Minimum.` },
      relatedLoIds: ['apenvsci.tolerance-adaptations'],
    },
  ],
  pointers: [
    { content: 'Tolerance curve: optimal | stress | intolerance zones.', kind: 'tip' },
    { content: `Liebig's Law: the MINIMUM resource limits growth.`, kind: 'tip' },
    { content: `Shelford's Law: too much also harms.`, kind: 'tip' },
    { content: 'Adaptations: structural / behavioral / physiological.', kind: 'tip' },
    { content: 'Specialists vulnerable; generalists resilient to environmental change.', kind: 'tip' },
  ],
};
