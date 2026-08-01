/**
 * World History — Classical Empires: Rome, From Republic to Empire.
 *
 * The republic-to-empire arc is the course's first big cause-and-effect
 * machine: inequality → strongmen → collapse of shared power — and a
 * legacy (law, language, engineering, the very word "senate") that
 * students are still living inside. C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U2_ROME_REPUBLIC_EMPIRE: LessonPlan = {
  id: 'evelyn.hs.whist.rome-republic-empire.v1',
  title: 'Rome: From Republic to Empire',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.rome-republic-empire',
      standard: 'WHIST-2.2',
      description:
        "Trace Rome's transformation from republic to empire, explain how inequality and civil war undermined republican government, and evaluate Rome's lasting legacy in law, language, and engineering (C3 D2.His.1.9-12, D2.His.14.9-12).",
    },
  ],
  prerequisites: ['whist.classical-greece'],
  followUps: ['whist.classical-india-china'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Rome as the republic that chose an emperor — and why that choice still haunts modern politics.',
      script:
        'For almost five hundred years, Rome had no king — on purpose. Romans were so proud of overthrowing their last king that "monarchy" became a political insult. Then, within a single lifetime, that proud republic handed absolute power to one man and cheered. How does a free state talk itself into that? The answer is a chain of causes — inequality, ambitious generals, and citizens who traded participation for stability — that political thinkers have studied nervously ever since. The American founders read this story like a warning label. Today you learn the chain.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-republic-to-empire',
      kind: 'concept',
      goal: 'The republican system, the causal chain that broke it, and the imperial legacy.',
      keyIdeas: [
        'THE REPUBLIC WAS A BALANCE — after expelling their king (c. 509 BCE), Romans split power: two annually-elected consuls, a Senate of aristocrats, and assemblies of citizens. Checks everywhere: short terms, vetoes, and the plebeians\' elected tribunes who could block laws.',
        'PATRICIANS VS PLEBEIANS — the "Conflict of the Orders": plebeians (commoners) pressured the patrician elite into written law (the Twelve Tables, c. 450 BCE) and real offices. Lesson Romans drew: the system could bend without breaking.',
        'CONQUEST BROKE THE BALANCE — winning the Punic Wars against Carthage (264–146 BCE) flooded Rome with land, enslaved people, and wealth. Rich families built vast estates worked by enslaved labor; small farmers — the backbone of the army — lost their land and crowded into the city.',
        'INEQUALITY → PRIVATE ARMIES — reformers like the Gracchus brothers were killed for proposing land redistribution (133 and 121 BCE); politics turned violent. Generals like Marius began recruiting landless soldiers loyal to their GENERAL (who paid them) rather than to the republic.',
        'CAESAR TO AUGUSTUS — Julius Caesar used his loyal army to seize power and was assassinated (44 BCE) by senators "defending the republic." The civil wars that followed exhausted everyone; his heir Octavian won, kept republican titles, and ruled as Augustus, the first emperor (27 BCE). The forms of the republic survived; the substance did not.',
        'THE PAX ROMANA TRADE — roughly 200 years of internal peace, roads, standard law, and long-distance commerce. Most Romans accepted the deal: stability in exchange for real political power.',
        'THE LEGACY IS EVERYWHERE — Roman law concepts (innocent until proven guilty, written codes), Latin (root of Spanish, French, Portuguese, Italian, Romanian — and legal English), concrete, arches, aqueducts, and republican vocabulary: senate, veto, capitol.',
      ],
      vocabulary: [
        { term: 'republic', definition: 'a government where citizens elect representatives to exercise power — no monarch.' },
        { term: 'patrician / plebeian', definition: "Rome's hereditary aristocrats / everyone else among the citizen commoners." },
        { term: 'Pax Romana', definition: 'the ~200-year stretch of internal peace and prosperity beginning with Augustus.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causal-chain',
      kind: 'worked_example',
      problem:
        "Build the causal chain: how did winning the Punic Wars — Rome's greatest military triumph — help destroy the Roman Republic?",
      steps: [
        'Start with the victory itself: conquering the Mediterranean brought Rome enormous wealth, huge amounts of land, and hundreds of thousands of enslaved captives.',
        'Follow the wealth: rich Romans bought up conquered land into giant estates (latifundia) worked by enslaved labor — undercutting the small citizen-farmers who could not compete.',
        "Follow the farmers: ruined, they sold out and moved to Rome as a landless urban poor. But land ownership had been the requirement for army service — so the republic's citizen-army base was collapsing.",
        'Follow the army: Marius solved the recruiting crisis by enlisting the landless and promising them land on retirement. Soldiers now depended on their GENERAL, not the state, for their future.',
        'Close the chain: generals with personally loyal armies (Sulla, Caesar) could now march on Rome itself. Victory abroad → inequality at home → privatized armies → civil war → one-man rule.',
      ],
      answer:
        'Conquest wealth concentrated land, displaced citizen-farmers, forced army reform that made soldiers loyal to generals — giving ambitious generals the tool that killed the republic.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fall-confusion',
      kind: 'worked_example',
      problem:
        'A student writes: "Rome fell in 476 CE when Augustus became emperor and ended the republic." Untangle the two different "falls" confused here.',
      steps: [
        'Separate the events: the REPUBLIC ended in 27 BCE, when Augustus took power — that is the fall of a system of government, not of Rome itself.',
        'Rome the empire then thrived for centuries — the Pax Romana is AFTER the republic dies. A state can lose its freedom and still be rich, stable, and expanding.',
        'The 476 CE date marks the deposing of the last WESTERN emperor — the fall of the western half of the empire, five hundred years after Augustus.',
        'And even that is only half the story: the eastern half, ruled from Constantinople (the Byzantine Empire, Unit 4), continued for nearly another thousand years, until 1453.',
        'So: republic → empire (27 BCE); western empire → Germanic kingdoms (476 CE); eastern empire → survives to 1453. Three different endings, three different centuries.',
      ],
      answer:
        'Augustus ended the REPUBLIC in 27 BCE; the western EMPIRE fell in 476 CE; the eastern half lasted until 1453 — three separate events the sentence collapses into one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-tribunes',
      kind: 'try_yourself',
      problem:
        'During the Conflict of the Orders, plebeians won the office of tribune — officials who could veto actions of the government. What does this concession reveal about the Roman Republic?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The system could absorb class conflict by sharing power instead of breaking into civil war', correct: true },
        { id: 'b', text: 'The patricians had lost all political influence by 450 BCE' },
        { id: 'c', text: 'Rome had become a full democracy where every citizen voted on every law' },
        { id: 'd', text: 'The plebeians planned to restore the monarchy' },
      ],
      expectedAnswer: 'The system could absorb class conflict by sharing power instead of breaking into civil war',
      hints: [
        "Ask what DIDN'T happen: the plebeians had real grievances, yet the republic survived intact for centuries afterward.",
        'The tribune was a pressure valve — the elite gave up some power to keep the system working.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-army-loyalty',
      kind: 'try_yourself',
      problem:
        'Which change most directly explains why generals like Caesar could march their armies against Rome itself?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Soldiers were recruited from the landless and depended on their general, not the state, for pay and retirement land', correct: true },
        { id: 'b', text: 'The Senate abolished the office of consul' },
        { id: 'c', text: "Rome's armies had grown too small to defend the frontiers" },
        { id: 'd', text: "Carthage had conquered Rome's Italian territories" },
      ],
      expectedAnswer: 'Soldiers were recruited from the landless and depended on their general, not the state, for pay and retirement land',
      hints: [
        "Follow the soldiers' paycheck and pension — who provided them after Marius's reforms?",
        'An army loyal to its paymaster is a private weapon; the republic no longer had a monopoly on force.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-legacy',
      kind: 'try_yourself',
      problem: 'Which modern feature is a direct legacy of the Roman Republic (not the empire)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Elected representatives, a senate, and the veto as checks on power', correct: true },
        { id: 'b', text: 'Rule by a divine hereditary monarch' },
        { id: 'c', text: 'The alphabet used in East Asia' },
        { id: 'd', text: 'The concept of pharaoh-led theocracy' },
      ],
      expectedAnswer: 'Elected representatives, a senate, and the veto as checks on power',
      hints: [
        'Look for vocabulary modern governments still use — several of these words are Latin.',
        'Senate, veto, capitol: republican machinery, deliberately copied by later constitution-writers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-republic-democracy',
      kind: 'misconception_check',
      question:
        'A student says: "The Roman Republic was a democracy like Athens — all citizens governed equally." What needs correcting?',
      commonErrors: [
        {
          answer: 'The republic was rule by all citizens equally',
          misconception: 'Equating a republic (elected representatives, aristocratic Senate) with direct democracy (citizens voting on laws themselves).',
          correctsTo:
            'Rome was a REPUBLIC: citizens elected officials, but a wealthy Senate dominated, and voting was weighted toward the rich. Athens practiced DIRECT democracy — citizens voted on laws personally. Different machines; both excluded women and enslaved people entirely.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The republic balanced consuls, Senate, assemblies, and tribunes — power deliberately split so no one became king.',
        'The chain that broke it: conquest wealth → land inequality → landless soldiers loyal to generals → civil wars → Augustus (27 BCE).',
        'Two different falls: republic ends 27 BCE; the western empire falls 476 CE; the eastern (Byzantine) half lasts until 1453.',
        "Rome's legacy: written law, Latin-based languages, engineering (roads, concrete, aqueducts), and the republican vocabulary of modern politics.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Rome: From Republic to Empire' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
