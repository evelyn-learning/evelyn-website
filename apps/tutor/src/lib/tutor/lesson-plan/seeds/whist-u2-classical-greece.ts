/**
 * World History — Classical Greece: From Polis to Alexander.
 *
 * Greece is the course's first case study in how geography shapes politics:
 * mountains split the Greeks into rival city-states, rivalry produced both
 * the Golden Age and the war that ruined it, and Alexander then blew Greek
 * ideas across three continents. Everything Rome does next is a reply to
 * this unit. C3 D2.His.1.9-12, D2.Civ.1.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U2_CLASSICAL_GREECE: LessonPlan = {
  id: 'evelyn.hs.whist.classical-greece.v1',
  title: 'Classical Greece: From Polis to Alexander',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.classical-greece',
      standard: 'WHIST-2.1',
      description:
        'Explain how the geography of Greece produced independent poleis, compare Athenian democracy with Spartan oligarchy, and trace the causes and consequences that run from the Persian Wars through the Peloponnesian War to Alexander and the Hellenistic world (C3 D2.His.1.9-12, D2.Civ.1.9-12).',
    },
  ],
  prerequisites: ['whist.early-india-china'],
  followUps: ['whist.rome-republic-empire'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Greece as a tiny, divided, quarrelsome place whose arguments the world is still having.',
      script:
        'Greece in 500 BCE was small, poor in farmland, and hopelessly divided — hundreds of separate little states, most of them smaller than a modern county, many of them at each other\'s throats. It should be a footnote. Instead the vocabulary of your civics class comes from it: democracy, politics, citizen, tyranny. So does the habit of asking "what is justice?" and expecting an argument rather than a priest\'s answer. Today we chase the chain: why the mountains made rivals, why rivalry against Persia bred confidence, why confidence curdled into a war the Greeks fought against themselves — and how a Macedonian king\'s son spread Greek ideas from Egypt to the edge of India after the poleis had exhausted each other.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-polis-to-hellenistic',
      kind: 'concept',
      goal: 'Geography, the Athens/Sparta contrast, the two wars, the Golden Age, and Alexander\'s Hellenistic aftermath.',
      keyIdeas: [
        'MOUNTAINS AND SEA MADE RIVALS — mainland Greece is broken by mountain ranges and cut by inlets, so communities grew up isolated from each other and connected outward by ship. Result: no single Greek kingdom, but hundreds of independent poleis (city-states), each with its own laws, army, coins, and gods\' festivals. Greeks shared a language, Homer, and the Olympic Games — and still saw Athens and Sparta as foreign powers.',
        'ATHENS: DIRECT DEMOCRACY, NARROWLY DEFINED — reforms from Cleisthenes (c. 508 BCE) through Pericles (leading c. 461–429 BCE) let citizens vote personally on laws in the Assembly, staff juries by lottery, and hold paid office so poor men could serve. This is DIRECT democracy, not representative. The exclusions were huge: women, enslaved people, and resident foreigners (metics) had no vote — perhaps only 10 to 20 percent of Athens\' population counted as citizens.',
        'SPARTA: A MILITARIZED OLIGARCHY — Sparta ruled a large conquered population of helots (state-owned agricultural laborers) and organized its whole society to keep them down: boys taken for military training at about age seven, lifelong army service, austere living. Power sat with two hereditary kings, a council of elders, and five overseers (ephors) — a few men deciding, which is oligarchy, not democracy. Spartan women, unusually, could own property and trained physically, because men were away at war.',
        'THE PERSIAN WARS BRED CONFIDENCE — the Persian Empire, vastly larger, invaded twice. Athens won at Marathon (490 BCE); a small Greek force under Sparta\'s Leonidas held the pass at Thermopylae (480 BCE) long enough to matter; the Athenian navy destroyed the Persian fleet at Salamis (480 BCE). Effect, not just event: the Greeks concluded that free citizens fighting for their own polis beat a king\'s subjects — and Athens, with the winning navy, turned the wartime Delian League into an empire funded by other cities\' tribute.',
        'THE GOLDEN AGE RAN ON THAT MONEY AND NERVE — Pericles rebuilt the Parthenon with league funds. Philosophy turned from myth to reasoned argument: Socrates cross-examined Athenians about virtue and was executed in 399 BCE; his student Plato asked what an ideal just state would look like; Plato\'s student Aristotle catalogued logic, biology, and forms of government. Drama (Sophocles, Euripides, Aristophanes) staged public arguments about law and power, and Herodotus and Thucydides invented history-writing by looking for human causes instead of divine ones.',
        'THE PELOPONNESIAN WAR ATE THE WINNERS — fear of Athenian power pushed Sparta and its allies into war (431–404 BCE). Twenty-seven years, plague in crowded Athens (Pericles among the dead), atrocities on both sides. Sparta won with Persian money and Athens lost its empire — but every polis came out drained, distrustful, and militarily weakened. Winning a war and being strengthened by it are different things.',
        'MACEDON EXPLOITED THE WRECKAGE — Philip II of Macedon, a kingdom north of the Greek heartland, built a professional army with a long-spear phalanx and took control of Greece at Chaeronea (338 BCE). His son Alexander invaded Persia at twenty, defeated it completely by 330 BCE, and campaigned to the Indus before his troops refused to go farther; he died in 323 BCE at thirty-two and his generals split the empire into rival kingdoms.',
        'HELLENISTIC MEANS FUSION, NOT REPLACEMENT — after Alexander, Greek language, coinage, city-planning, and art mixed with Egyptian, Persian, Mesopotamian, and Indian traditions. Alexandria in Egypt became the era\'s intellectual capital, with its Library and Museum: Euclid systematized geometry, Eratosthenes measured the Earth\'s circumference, Archimedes worked in this world of exchange. Greek stayed a shared language of trade and learning across the eastern Mediterranean for centuries — which is exactly why Rome, next unit, absorbs Greek ideas wholesale.',
      ],
      vocabulary: [
        { term: 'polis', definition: 'an independent Greek city-state — its own government, army, and laws, usually a town plus the farmland around it.' },
        { term: 'direct democracy', definition: 'a system where citizens themselves vote on laws and policies, rather than electing representatives to do it.' },
        { term: 'Hellenistic', definition: 'the era after Alexander, when Greek culture blended with Egyptian, Persian, and other Eastern traditions across his former empire.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-persian-to-peloponnesian',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did the Greek victory over Persia — the Greeks\' proudest moment — lead within fifty years to a war between Greeks that wrecked them all?',
      steps: [
        'Start with the victory. Marathon (490 BCE), Thermopylae and Salamis (480 BCE) left the Greeks convinced they had beaten the largest empire on Earth, and left Athens holding the fleet that did most of the damage at sea.',
        'Follow the fleet. Because Persia might return, Athens organized the Delian League: allied cities contributed ships or, more conveniently, cash. Athens commanded, and Athens held the treasury.',
        'Follow the money. When the Persian threat faded, the payments did not stop. Athens moved the treasury to Athens, punished cities that tried to leave, and spent league funds on its own buildings — the Parthenon among them. An alliance had quietly become an empire.',
        'Follow the fear. Thucydides put it plainly: what made the war inevitable was the growth of Athenian power and the fear this caused in Sparta. Sparta had the best army, Athens the best navy and the growing wealth — and Sparta\'s allies, especially trade-rival Corinth, pushed hardest for war.',
        'Close the chain. War came in 431 BCE and ground on for twenty-seven years. Sparta finally won in 404 BCE, and won it partly with money from Persia — the old enemy. Every major polis emerged weakened, which is precisely why Philip II of Macedon could take Greece in 338 BCE.',
      ],
      answer:
        'Victory over Persia gave Athens naval leadership, which became an empire, which produced Spartan fear — war (431–404 BCE) exhausted every polis and left Greece open to Macedonian conquest.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pericles-source',
      kind: 'worked_example',
      problem:
        'A Greek statesman praised his city in a funeral speech for the war dead, saying in substance: "Our government is called a democracy because power rests with the many, not the few. Every man is equal before the law, and a poor man\'s usefulness to the city is never blocked by his poverty." Analyze this claim: what is accurate, what is the speaker leaving out, and why would he say it this way?',
      steps: [
        'Identify the speaker and moment: this paraphrases the kind of argument Pericles made in Athens early in the Peloponnesian War, at a public funeral for soldiers. That is a persuasive occasion, not a neutral report — the purpose is to make the deaths feel worthwhile.',
        'Check what is accurate. Athenian citizens really did vote personally in the Assembly, really did serve on juries chosen by lottery, and under Pericles were paid for public service so that poverty did not bar a citizen from office. Compared with a Persian king or a Spartan council of elders, that is a genuine and radical difference.',
        'Check the word "every man." Citizenship in Athens was restricted to free adult males of Athenian parentage. Women could not vote or hold office. Enslaved people — a very large share of the population — had no political standing at all, and neither did metics, the resident foreigners who did much of the trade.',
        'Check the word "our city." The speech was delivered by the leader of a state that was collecting tribute from other Greek cities and crushing those that tried to leave. Democracy at home and empire abroad ran side by side, and the speech does not mention the second.',
        'Weigh it as evidence. Treat the passage as strong evidence of what Athenians valued and wanted to believe about themselves, and as weak evidence of how inclusive Athens actually was. Both readings are useful — historians use it for ideals, then check the ideals against who actually held the vote.',
      ],
      answer:
        'The claim is accurate about direct citizen power and pay for office, but "every man" hides the exclusion of women, enslaved people, and metics, and the funeral-speech setting makes it persuasive advocacy — good evidence of Athenian ideals, poor evidence of Athenian practice.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-geography',
      kind: 'try_yourself',
      problem:
        'Greece never unified into a single kingdom during the classical period, unlike Egypt along the Nile. Which factor best explains the difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mountain ranges and sea inlets isolated Greek communities, so each valley developed its own independent polis', correct: true },
        { id: 'b', text: 'The Greeks spoke unrelated languages and shared no common culture at all' },
        { id: 'c', text: 'Greece was conquered by Persia and ruled as Persian provinces throughout the classical period' },
        { id: 'd', text: 'Alexander the Great deliberately divided Greece into small states in the 400s BCE' },
      ],
      expectedAnswer: 'Mountain ranges and sea inlets isolated Greek communities, so each valley developed its own independent polis',
      hints: [
        'Egypt\'s unity came from one long river valley that tied everyone together. Ask what Greek terrain does instead.',
        'Terrain that separates people encourages many small governments; terrain that connects them encourages one big one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-athens-sparta',
      kind: 'try_yourself',
      problem:
        'Sparta was governed by two hereditary kings, a council of elders, and five ephors. Athens under Pericles let citizens vote directly in the Assembly. What is the sharpest way to state this contrast?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sparta was an oligarchy — rule by a few — while Athens practiced direct democracy among its citizens, though both excluded women and enslaved people', correct: true },
        { id: 'b', text: 'Sparta was a democracy with elected representatives while Athens was ruled by a single tyrant' },
        { id: 'c', text: 'Athens gave political rights to every adult living in the city, including women and enslaved people' },
        { id: 'd', text: 'Both cities were republics in which citizens elected officials to vote on laws for them' },
      ],
      expectedAnswer: 'Sparta was an oligarchy — rule by a few — while Athens practiced direct democracy among its citizens, though both excluded women and enslaved people',
      hints: [
        'Count the decision-makers in each system: a handful of hereditary and elected officials, versus thousands of men in an assembly.',
        'Watch the trap of praising Athens too far — "direct democracy" describes how citizens voted, not how many people counted as citizens.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hellenistic',
      kind: 'try_yourself',
      problem:
        'After Alexander\'s death in 323 BCE, cities like Alexandria in Egypt used Greek as the language of government and scholarship while continuing Egyptian religious practices and blending Greek and Egyptian art. Historians call this pattern Hellenistic. What does it best illustrate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Conquest spread Greek language and institutions while local traditions persisted and fused with them', correct: true },
        { id: 'b', text: 'Alexander\'s successors erased all non-Greek cultures from the conquered territories' },
        { id: 'c', text: 'Greek culture disappeared immediately once Alexander\'s empire split among his generals' },
        { id: 'd', text: 'Egypt conquered Macedon and imposed Egyptian customs on the Greek mainland' },
      ],
      expectedAnswer: 'Conquest spread Greek language and institutions while local traditions persisted and fused with them',
      hints: [
        'Read the evidence in the question literally: Greek was used for government, and Egyptian practices continued. Both, at once.',
        'The word "Hellenistic" is deliberately not the same word as "Hellenic" — it names a blend, not pure Greek culture.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-athenian-democracy',
      kind: 'misconception_check',
      question:
        'A student says: "Athens invented democracy, so everyone in Athens could vote — it was basically the same as voting in a modern country." What needs correcting?',
      commonErrors: [
        {
          answer: 'Everyone in Athens could vote, just like in a modern democracy',
          misconception:
            'Treating "democracy" as a fixed modern package, so an ancient label is assumed to carry modern inclusiveness and modern representative machinery.',
          correctsTo:
            'Two corrections. First, the franchise: only free adult males of Athenian parentage were citizens — women, enslaved people, and metics were excluded, so likely only 10 to 20 percent of residents could vote. Second, the mechanism: Athens was a DIRECT democracy where citizens voted on laws in person and filled offices by lottery, not a representative system where you elect someone to vote for you. It was genuinely radical for its time and genuinely narrow by ours; both are true.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Geography first: mountains and sea split Greece into hundreds of independent poleis that shared a culture but not a government.',
        'Athens under Pericles was a DIRECT democracy for a minority (free adult male citizens); Sparta was a militarized oligarchy of kings, elders, and ephors resting on helot labor.',
        'The chain: Persian Wars (Marathon 490 BCE; Thermopylae and Salamis 480 BCE) bred confidence and an Athenian empire, funding the Golden Age of Socrates, Plato, Aristotle, drama, history-writing, and the Parthenon.',
        'Spartan fear of Athenian power produced the Peloponnesian War (431–404 BCE); Sparta won but every polis was weakened, opening the way for Philip II at Chaeronea (338 BCE).',
        'Alexander conquered Persia by 330 BCE and died in 323 BCE; the Hellenistic world that followed fused Greek and Eastern cultures, with Alexandria as its intellectual center — the Greek inheritance Rome takes up next.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Classical Greece: From Polis to Alexander' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
