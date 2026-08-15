/**
 * AP Environmental Science — Unit 5 CED 5.1+5.8+5.11+5.12: Commons, Fishing, Footprint.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.commons-fishing-footprint.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_COMMONS_FISHING_FOOTPRINT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.commons-fishing-footprint.v1',
  course: 'AP Environmental Science',
  cedUnit: 5,
  cedTopic: '5.1+5.8+5.11+5.12',
  cedTitle: 'Commons, Fishing, Footprint',
  planId: 'evelyn.ap.envsci.commons-fishing-footprint.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.commons-fishing-footprint.v1' }],
  theory: [
    { loId: 'apenvsci.commons-fishing-footprint', kind: 'definition', title: 'tragedy of the commons', content: `Hardin's 1968 idea: when a resource is COMMONLY HELD (not privately owned, no quota), each user has an incentive to take MORE — the gains are personal but the costs are spread across all users. Cumulatively this OVER-EXPLOITS the resource. The misaligned incentive is the whole point.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `CLASSIC COMMONS EXAMPLES: open-ocean fisheries, the atmospheric carbon sink, communal grazing lands, groundwater aquifers, and shared watershed and air quality. Any resource that is open-access and rivalrous fits the pattern.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `SOLUTIONS TO COMMONS PROBLEMS. REGULATION — catch limits, quotas, bag limits, hunting seasons. PRIVATIZATION — assign tradable rights (ITQs, individual transferable quotas). COMMUNITY MANAGEMENT — Ostrom's research shows local users can manage a commons well when monitoring is feasible. TAXES on use (a carbon tax for the atmosphere). TECHNOLOGY for monitoring (GPS, satellites).` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `OVERFISHING is the prototype tragedy of the commons: open-access oceans with no global quotas, plus new technology (sonar, GPS, larger nets) that made fishing faster. Result: about one third of global fish stocks are OVERFISHED, roughly 60% are fully fished with no room to grow, and only about 7% are underfished. Tuna, sharks, and groupers are heavily overfished.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `THE ATLANTIC COD COLLAPSE (off Newfoundland, 1992) is the warning case: open access plus factory trawlers pushed catch above the reproduction rate; regulators set quotas too high; the stock crashed, about 30,000 jobs vanished overnight, and cod STILL has not recovered 30-plus years later as the ecosystem regime-shifted toward smaller fish and jellyfish.` },
    { loId: 'apenvsci.commons-fishing-footprint', kind: 'definition', title: 'bycatch', content: `non-target species caught in fishing gear — sea turtles, dolphins, sharks, and juvenile fish are often killed. Trawling is especially destructive. BOTTOM TRAWLING drags weighted nets across the seafloor, wrecking benthic habitat (corals, sponges) that takes thousands of years to recover.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `FISHING SOLUTIONS. CATCH LIMITS / QUOTAS, SIZE LIMITS (let juveniles mature), SEASONAL CLOSURES during spawning, MARINE PROTECTED AREAS (no-take zones where populations recover and spill over into surrounding fisheries), SUSTAINABLE GEAR (turtle excluder devices, hook-size rules), and CONSUMER CHOICE via Marine Stewardship Council labels.` },
    { loId: 'apenvsci.commons-fishing-footprint', kind: 'definition', title: 'ecological footprint', content: `the amount of biologically productive land plus sea needed to PRODUCE everything a person or population consumes AND ABSORB their waste, measured in hectares per person. It converts a lifestyle into an area of Earth required to sustain it.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `FOOTPRINT NUMBERS to know. Earth's sustainable biocapacity is roughly 1.6 hectares per person. The US average is about 8 hectares per person — around 5x the sustainable share. Developing countries are far lower (India about 1, Niger about 0.6). If everyone lived US-style we would need about 5 Earths. Drivers of high footprint: energy use, meat consumption, large housing, and heavy consumption.` },
    { loId: 'apenvsci.commons-fishing-footprint', kind: 'definition', title: 'sustainability', content: `meeting present needs WITHOUT compromising future generations' ability to meet theirs (Brundtland Commission, 1987). Rests on three pillars — ENVIRONMENTAL, ECONOMIC, and SOCIAL. Environmental sustainability means not depleting resources faster than they regenerate and not polluting faster than the environment can absorb.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `SUSTAINABLE DEVELOPMENT is development that meets present needs while protecting the environment — the applied, policy-facing version of sustainability. It seeks to raise living standards without exhausting the natural capital future generations will depend on.` },
    { loId: 'apenvsci.commons-fishing-footprint', content: `COMPARING THE THREE COMMONS FIXES for OCEANS. INTERNATIONAL QUOTAS work best when a species stays within enforceable Exclusive Economic Zones but suffer free-rider and enforcement problems on the high seas. PRIVATIZATION (ITQs) aligns owner incentives (Iceland, New Zealand) but cannot fence migrating fish and concentrates rights. COMMUNITY MANAGEMENT excels for small local fisheries (Maine lobster) but does not scale to the global high seas. Real ocean policy is a HYBRID of all of these plus MPAs.` },
  ],
  methods: [
    {
      title: 'Explain a fishery collapse with tragedy of the commons',
      when_to_use: `When asked why an open-access fishery was over-exploited to collapse.`,
      steps: [
        `STEP 1 — IDENTIFY OPEN ACCESS: the resource had no owner, no quota, and no enforcement, so anyone could fish it.`,
        `STEP 2 — NAME THE INCENTIVE: each boat gains the full profit of its own catch while the cost of depletion is shared across everyone, so each rationally takes more.`,
        `STEP 3 — ADD TECHNOLOGY: sonar and factory trawlers raised catches far above the stock's reproduction rate.`,
        `STEP 4 — NOTE WEAK REGULATION: quotas set above sustainable yield under industry pressure let the decline continue despite scientific warnings.`,
        `STEP 5 — STATE THE OUTCOME: the stock crashes, jobs are lost, recovery is slow or absent, and the ecosystem may regime-shift — open access plus better tech plus weak rules equals collapse.`,
      ],
      example: { problem: `The Atlantic cod fishery off Newfoundland collapsed in 1992 after centuries of fishing. Use tragedy of the commons to explain why.`, solution: `Open access gave every boat an incentive to over-fish while sharing the cost; factory trawlers outpaced reproduction; quotas were set too high; the stock crashed in 1992, 30,000 jobs were lost, and cod still has not recovered.` },
      relatedLoIds: ['apenvsci.commons-fishing-footprint'],
    },
    {
      title: 'Compute and interpret an ecological footprint',
      when_to_use: `When asked to find the sustainable per-person share or compare footprints across countries.`,
      steps: [
        `STEP 1 — EXPLAIN THE GAP between countries by energy use, meat consumption, housing size, and overall consumption per person.`,
        `STEP 2 — FIND THE SUSTAINABLE SHARE: divide total biocapacity by population (e.g. 12 billion hectares divided by 8 billion people equals 1.5 hectares per person).`,
        `STEP 3 — TEST A LIFESTYLE against biocapacity: multiply the per-person footprint by population (8 hectares times 8 billion people equals 64 billion hectares) and compare to the 12 billion hectares available.`,
        `STEP 4 — INTERPRET OVERSHOOT: 64 billion needed versus 12 billion available means about 5 Earths would be required — impossible, showing US-level consumption is not globally scalable.`,
      ],
      example: { problem: `A typical American has an 8-hectare footprint; a Bangladeshi 0.6. Earth's biocapacity is about 12 billion hectares for 8 billion people. Find the sustainable share and evaluate universal US-level consumption.`, solution: `Sustainable share is 12 billion divided by 8 billion equals 1.5 hectares per person; universal US consumption needs about 64 billion hectares (roughly 5 Earths), which is impossible.` },
      relatedLoIds: ['apenvsci.commons-fishing-footprint'],
    },
  ],
  pointers: [
    { content: 'Commons tragedy: open access + personal gain, shared cost = over-exploitation.', kind: 'tip' },
    { content: 'Three fixes: regulation (quotas), privatization (ITQs), community management (Ostrom).', kind: 'tip' },
    { content: 'Overfishing: ~1/3 of stocks overfished; cod collapse (1992) is the warning case.', kind: 'tip' },
    { content: 'Ecological footprint = land + sea to supply consumption AND absorb waste, in ha/person.', kind: 'tip' },
    { content: 'US footprint ~8 ha vs ~1.6 sustainable; universal US living needs ~5 Earths.', kind: 'tip' },
    { content: 'Sustainability = present needs without compromising future generations (Brundtland).', kind: 'tip' },
  ],
};
