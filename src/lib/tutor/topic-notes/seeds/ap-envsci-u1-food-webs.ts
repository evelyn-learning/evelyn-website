/**
 * AP Environmental Science — Unit 1 CED 1.11: Food Chains and Webs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.food-webs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_FOOD_WEBS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.food-webs.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.11',
  cedTitle: 'Food Chains and Webs',
  planId: 'evelyn.ap.envsci.food-webs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.food-webs.v1' }],
  theory: [
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'food chain', content: `a FOOD CHAIN is a single LINEAR sequence of organisms, each feeding on the one before it — e.g., grass to rabbit to fox to hawk. It shows ONE path of energy flow.` },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'food web', content: `a FOOD WEB is multiple INTERCONNECTED food chains — a network in which most species occupy several positions (a fox eats rabbits AND mice AND birds). Webs are far more realistic than single chains.` },
    { loId: 'apenvsci.food-webs', content: `WHY WEBS BEAT CHAINS FOR STABILITY: REDUNDANCY. In a web, if one prey species declines, predators have alternatives, so the system absorbs the shock. Simple linear food chains are FRAGILE — losing one link can break the whole chain.` },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'keystone species', content: `a KEYSTONE SPECIES has an IMPACT on its ecosystem that is DISPROPORTIONATELY LARGE relative to its abundance. Removing it dramatically restructures the whole community — this is the definition to quote on the exam.` },
    { loId: 'apenvsci.food-webs', content: `KEYSTONE EXAMPLES to memorize: SEA OTTERS eat sea urchins; without otters, urchins overgraze KELP forests into barren "urchin barrens." WOLVES (Yellowstone) keep elk in check; without wolves, elk overgraze willows, cascading to beavers, songbirds, and riparian zones. BEAVERS are ECOSYSTEM ENGINEERS whose dams create wetlands. CORALS are reef-builders providing habitat for thousands of species.` },
    { loId: 'apenvsci.food-webs', content: `KEYSTONE vs DOMINANT. A DOMINANT species is simply the most ABUNDANT one. A keystone species need NOT be abundant — its importance comes from its OUTSIZED impact per individual. Do not confuse "there are a lot of them" with "removing them collapses the system."` },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'trophic cascade', content: `a TROPHIC CASCADE is when a change at ONE trophic level ripples through the rest of the community. Wolves to elk to willows to songbirds is the classic cascade — usually triggered by adding or removing a top predator or keystone species.` },
    { loId: 'apenvsci.food-webs', content: `BIOACCUMULATION vs BIOMAGNIFICATION — the exam's favorite distinction. BIOACCUMULATION is buildup WITHIN A SINGLE ORGANISM over its lifetime: the concentration of a fat-soluble toxin rises in one body over time. BIOMAGNIFICATION is buildup ACROSS TROPHIC LEVELS: concentration INCREASES at each higher level.` },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'biomagnification', content: `BIOMAGNIFICATION is the increase in a toxin's concentration at successively higher trophic levels. Each predator eats MANY prey, each carrying accumulated toxin, so the predator receives the SUM — toxins concentrate up the food web, hitting top predators hardest.` },
    { loId: 'apenvsci.food-webs', content: `CLASSIC BIOMAGNIFICATION CASES: DDT in the 1960s — algae absorbed it, fish accumulated it, and top birds (eagles, ospreys) held the highest concentrations, causing EGGSHELL THINNING and near-extinction; DDT was banned in 1972 and bald eagles later recovered. MERCURY concentrates in top-predator fish (tuna, swordfish, sharks), which is why pregnant women are advised to limit consumption. PCBs and DIOXINS are other fat-soluble organic pollutants that biomagnify.` },
    { loId: 'apenvsci.food-webs', content: `WHICH SUBSTANCES BIOMAGNIFY: those that are FAT-SOLUBLE / lipophilic (stored in fatty tissue rather than flushed out), PERSISTENT (degrade slowly in the environment), and have a LOW EXCRETION RATE. A toxin needs all three traits to concentrate up the food web.` },
  ],
  methods: [
    {
      title: 'Predict effects of removing a keystone species',
      when_to_use: 'When an FRQ removes or reduces a keystone predator/engineer and asks for downstream consequences.',
      steps: [
        `STEP 1 — IDENTIFY the keystone role: what does this species control (a prey population, a habitat structure)?`,
        `STEP 2 — RELEASE. With the keystone gone, its prey is freed from control and its population EXPLODES (or the habitat it built disappears).`,
        `STEP 3 — CASCADE. Follow the ripple to the next level: overgrazing, habitat loss, or structural collapse.`,
        `STEP 4 — BIODIVERSITY + DOWNSTREAM effects. Loss of habitat lowers biodiversity; add secondary effects (e.g., carbon storage, coastal protection).`,
        `STEP 5 — LABEL it a TROPHIC CASCADE driven by removal of a KEYSTONE species.`,
      ],
      example: { problem: `Sea otters off the California coast prey on sea urchins, which graze on kelp. Predict changes if a disease wiped out the sea otters.`, solution: `Without otters, urchins are released from predation and EXPLODE -> urchins overgraze KELP into bare "urchin barrens" -> loss of kelp destroys HABITAT for hundreds of species (rockfish, crabs, sea lions), so biodiversity falls -> bonus effects: kelp stored carbon and dampened waves, so its loss reduces carbon storage and increases coastal erosion. Sea otters are a KEYSTONE species; their removal triggers a TROPHIC CASCADE.` },
      relatedLoIds: ['apenvsci.food-webs'],
    },
  ],
  pointers: [
    { content: 'Food web > food chain: redundancy gives webs stability; linear chains are fragile.', kind: 'tip' },
    { content: 'Keystone = high impact / low abundance. Dominant = high abundance. Do not confuse them.', kind: 'tip' },
    { content: 'Bioaccumulation = within one organism over time. Biomagnification = across trophic levels.', kind: 'tip' },
    { content: 'Top predators suffer most from biomagnification: they eat many prey and get the summed toxin load.', kind: 'tip' },
    { content: 'Biomagnifiers are fat-soluble + persistent + low-excretion. DDT and mercury are the go-to examples.', kind: 'tip' },
    { content: 'Removing a keystone predator triggers a trophic cascade (otters-urchins-kelp; wolves-elk-willows).', kind: 'tip' },
  ],
};
