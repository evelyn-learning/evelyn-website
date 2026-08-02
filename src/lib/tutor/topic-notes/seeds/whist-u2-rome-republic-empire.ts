/**
 * World History — Unit 2 CED 2.2: Rome: From Republic to Empire.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.whist.rome-republic-empire.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_WHIST_U2_ROME_REPUBLIC_EMPIRE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.whist.rome-republic-empire.v1',
  course: 'World History',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Rome: From Republic to Empire',
  planId: 'evelyn.hs.whist.rome-republic-empire.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.whist.rome-republic-empire.v1' }],
  theory: [
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'The republic was a balance', content: `THE REPUBLIC WAS A BALANCE — after expelling their king (c. 509 BCE), Romans split power: two annually-elected consuls, a Senate of aristocrats, and assemblies of citizens. Checks everywhere: short terms, vetoes, and the plebeians' elected tribunes who could block laws.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'Patricians vs plebeians', content: `PATRICIANS VS PLEBEIANS — the "Conflict of the Orders": plebeians (commoners) pressured the patrician elite into written law (the Twelve Tables, c. 450 BCE) and real offices. Lesson Romans drew: the system could bend without breaking.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'Conquest broke the balance', content: `CONQUEST BROKE THE BALANCE — winning the Punic Wars against Carthage (264–146 BCE) flooded Rome with land, enslaved people, and wealth. Rich families built vast estates worked by enslaved labor; small farmers — the backbone of the army — lost their land and crowded into the city.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'Inequality → private armies', content: `INEQUALITY → PRIVATE ARMIES — reformers like the Gracchus brothers were killed for proposing land redistribution (133 and 121 BCE); politics turned violent. Generals like Marius began recruiting landless soldiers loyal to their GENERAL (who paid them) rather than to the republic.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'Caesar to Augustus', content: `CAESAR TO AUGUSTUS — Julius Caesar used his loyal army to seize power and was assassinated (44 BCE) by senators "defending the republic." The civil wars that followed exhausted everyone; his heir Octavian won, kept republican titles, and ruled as Augustus, the first emperor (27 BCE). The forms of the republic survived; the substance did not.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'The Pax Romana trade', content: `THE PAX ROMANA TRADE — roughly 200 years of internal peace, roads, standard law, and long-distance commerce. Most Romans accepted the deal: stability in exchange for real political power.` },
    { loId: 'whist.rome-republic-empire', kind: 'framework', title: 'The legacy is everywhere', content: `THE LEGACY IS EVERYWHERE — Roman law concepts (innocent until proven guilty, written codes), Latin (root of Spanish, French, Portuguese, Italian, Romanian — and legal English), concrete, arches, aqueducts, and republican vocabulary: senate, veto, capitol.` },
    { loId: 'whist.rome-republic-empire', kind: 'definition', title: 'republic', content: `a government where citizens elect representatives to exercise power — no monarch.` },
    { loId: 'whist.rome-republic-empire', kind: 'definition', title: 'patrician / plebeian', content: `Rome's hereditary aristocrats / everyone else among the citizen commoners.` },
    { loId: 'whist.rome-republic-empire', kind: 'definition', title: 'Pax Romana', content: 'the ~200-year stretch of internal peace and prosperity beginning with Augustus.' },
  ],
  methods: [
    {
      title: 'Worked causal chain',
      steps: [
        `Start with the victory itself: conquering the Mediterranean brought Rome enormous wealth, huge amounts of land, and hundreds of thousands of enslaved captives.`,
        `Follow the wealth: rich Romans bought up conquered land into giant estates (latifundia) worked by enslaved labor — undercutting the small citizen-farmers who could not compete.`,
        `Follow the farmers: ruined, they sold out and moved to Rome as a landless urban poor. But land ownership had been the requirement for army service — so the republic's citizen-army base was collapsing.`,
        `Follow the army: Marius solved the recruiting crisis by enlisting the landless and promising them land on retirement. Soldiers now depended on their GENERAL, not the state, for their future.`,
        `Close the chain: generals with personally loyal armies (Sulla, Caesar) could now march on Rome itself. Victory abroad → inequality at home → privatized armies → civil war → one-man rule.`,
      ],
      example: { problem: `Build the causal chain: how did winning the Punic Wars — Rome's greatest military triumph — help destroy the Roman Republic?`, solution: `Conquest wealth concentrated land, displaced citizen-farmers, forced army reform that made soldiers loyal to generals — giving ambitious generals the tool that killed the republic.` },
      relatedLoIds: ['whist.rome-republic-empire'],
    },
    {
      title: 'Worked fall confusion',
      steps: [
        `Separate the events: the REPUBLIC ended in 27 BCE, when Augustus took power — that is the fall of a system of government, not of Rome itself.`,
        `Rome the empire then thrived for centuries — the Pax Romana is AFTER the republic dies. A state can lose its freedom and still be rich, stable, and expanding.`,
        `The 476 CE date marks the deposing of the last WESTERN emperor — the fall of the western half of the empire, five hundred years after Augustus.`,
        `And even that is only half the story: the eastern half, ruled from Constantinople (the Byzantine Empire, Unit 4), continued for nearly another thousand years, until 1453.`,
        `So: republic → empire (27 BCE); western empire → Germanic kingdoms (476 CE); eastern empire → survives to 1453. Three different endings, three different centuries.`,
      ],
      example: { problem: `A student writes: "Rome fell in 476 CE when Augustus became emperor and ended the republic." Untangle the two different "falls" confused here.`, solution: `Augustus ended the REPUBLIC in 27 BCE; the western EMPIRE fell in 476 CE; the eastern half lasted until 1453 — three separate events the sentence collapses into one.` },
      relatedLoIds: ['whist.rome-republic-empire'],
    },
  ],
  pointers: [
    { content: `Rome was a REPUBLIC: citizens elected officials, but a wealthy Senate dominated, and voting was weighted toward the rich. Athens practiced DIRECT democracy — citizens voted on laws personally. Different machines; both excluded women and enslaved people entirely.`, kind: 'common-error' },
    { content: `The republic balanced consuls, Senate, assemblies, and tribunes — power deliberately split so no one became king.`, kind: 'tip' },
    { content: `The chain that broke it: conquest wealth → land inequality → landless soldiers loyal to generals → civil wars → Augustus (27 BCE).`, kind: 'tip' },
    { content: `Two different falls: republic ends 27 BCE; the western empire falls 476 CE; the eastern (Byzantine) half lasts until 1453.`, kind: 'tip' },
    { content: `Rome's legacy: written law, Latin-based languages, engineering (roads, concrete, aqueducts), and the republican vocabulary of modern politics.`, kind: 'tip' },
    { content: `Don't say "Rome fell in 476" when you mean the republic ended. Three separate endings: republic → 27 BCE, WESTERN empire → 476 CE, EASTERN (Byzantine) → 1453. Always name which one you mean.`, kind: 'common-error' },
    { content: `Republic ≠ democracy. Rome = elected officials + a dominant aristocratic Senate + wealth-weighted voting. Athens = citizens voting on laws directly. Use "republic" for Rome, "direct democracy" for Athens.`, kind: 'vocab-note' },
    { content: `BCE dates count DOWN: 264 BCE is earlier than 146 BCE, and 133 BCE comes before 44 BCE. When ordering the causal chain (Punic Wars → Gracchi → Marius → Caesar → Augustus), check that your numbers are decreasing.`, kind: 'gotcha' },
    { content: `Augustus didn't abolish the Senate or the republican titles — he kept them and hollowed them out. Write "the forms survived, the substance didn't," not "Augustus ended the Senate."`, kind: 'edge-case' },
    { content: `Peace and prosperity are not the same as political freedom. The Pax Romana comes AFTER the republic dies — Rome got richer and more stable while citizens lost real power. Don't treat the empire's success as proof the republic survived.`, kind: 'gotcha' },
    { content: `Marius's reform is the hinge, not Caesar's ambition. Ambitious generals always existed; what was new was landless soldiers who needed their GENERAL for pay and retirement land. Name the recruiting change, not just personalities.`, kind: 'tip' },
    { content: `Plebeians were CITIZENS, not enslaved people or foreigners. The Conflict of the Orders is a fight between two groups of citizens (patrician vs. plebeian) over access to office and written law.`, kind: 'vocab-note' },
    { content: `Sort legacies by source: senate, veto, elected representatives, checks on power = REPUBLIC. Roads, concrete, arches, aqueducts, Latin's spread, imperial law codes = mostly EMPIRE-era. Check which one a question asks for.`, kind: 'edge-case' },
  ],
};
