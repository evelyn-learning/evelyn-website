/**
 * World History — The Scientific Revolution.
 *
 * The unit where the question "how do we know?" changes answers: from
 * "an authority wrote it down" to "someone measured it and published
 * the measurement." The telescope is the famous part; the METHOD is the
 * part that never went away. C3 D2.His.1.9-12, D2.His.14.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U7_SCIENTIFIC_REVOLUTION: LessonPlan = {
  id: 'evelyn.hs.whist.scientific-revolution.v1',
  title: 'The Scientific Revolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.scientific-revolution',
      standard: 'WHIST-7.1',
      description:
        'Explain how observation, experiment, and mathematical reasoning replaced ancient authority as the basis of knowledge in Europe between 1543 and 1687, and evaluate why that change reached far beyond astronomy into politics and society (C3 D2.His.1.9-12, D2.His.14.9-12).',
    },
  ],
  prerequisites: ['whist.columbian-exchange'],
  followUps: ['whist.absolutism-constitutionalism'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the revolution as a change in how truth gets settled — and show why that change was dangerous to more than astronomers.',
      script:
        'For over a thousand years, the way to settle an argument about nature in Europe was to find out what Aristotle or Ptolemy had said, and stop. Then a handful of people started doing something reckless: they checked. They pointed a new tube of glass at the sky, they wrote down numbers night after night, they ran the same experiment twice to see if it behaved. Within about 140 years the Earth had been moved out of the center of the universe and nobody could put it back. But here is the part that changed history: once people saw that careful evidence could overturn a fifteen-hundred-year-old truth about the heavens, they started asking what else inherited authority had gotten wrong — about kings, about churches, about how societies should be run. Today you learn how that habit of checking got started, and where it led.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-authority-to-evidence',
      kind: 'concept',
      goal: 'The old basis of knowledge, the four figures who broke it, the method that replaced it, and the debts and consequences.',
      keyIdeas: [
        "AUTHORITY WAS THE OLD PROOF — in medieval European universities, knowledge about nature meant knowing the right texts: Aristotle on motion and matter, Ptolemy on an Earth-centered cosmos (written c. 150 CE), read alongside church interpretation. Truth was something you looked up in a trusted book, not something you went out and measured.",
        'COPERNICUS MOVED THE EARTH (1543) — Nicolaus Copernicus published On the Revolutions of the Heavenly Spheres in the year he died, arguing the Sun, not the Earth, sits at the center. Key student point: he had almost no new observations. He had a simpler mathematics for predicting planet positions. It was a proposal, not yet a proof.',
        'KEPLER GAVE ORBITS THEIR REAL SHAPE (1609) — working from Tycho Brahe\'s decades of unusually precise naked-eye measurements, Johannes Kepler showed the orbits are ellipses, not perfect circles. This mattered because "heavenly motion must be perfectly circular" was an ancient assumption nobody had ever tested against good data. The data won.',
        "GALILEO SUPPLIED THE EVIDENCE (1609-1610) — Galileo Galilei built his own telescope and saw craters on the Moon, phases of Venus, and four moons circling Jupiter. Those moons were the decisive point: here was direct evidence that not everything in the sky orbits the Earth. He also ran rolling-ball experiments on motion, testing Aristotle instead of quoting him.",
        "THE 1633 TRIAL — the church had a real stake in the Earth-centered cosmos: it was woven into accepted readings of scripture and into the authority of the institution that interpreted them. Galileo was tried in Rome in 1633, forced to recant publicly, and spent his remaining years under house arrest until his death in 1642. The ideas kept spreading anyway — printed books do not answer summonses.",
        "NEWTON UNIFIED HEAVEN AND EARTH (1687) — Isaac Newton's Principia proposed universal gravitation: the SAME mathematical law pulls an apple to the ground and holds the Moon in orbit. That is the deeper claim of the whole revolution — nature is law-governed, uniform, and describable in mathematics, with no separate rules for the heavens.",
        "THE METHOD WAS THE REAL REVOLUTION — the lasting product was not any single discovery but a way of working: Francis Bacon's empiricism (gather observations, generalize from them, distrust inherited claims), Rene Descartes' systematic doubt and mathematical reasoning, deliberately controlled experiments, and open publication so strangers could repeat and challenge your results. The Royal Society, founded in London in 1660, existed to circulate and test findings in public.",
        "IT HAD BORROWED FOUNDATIONS — this was not a European invention from nothing. Islamic astronomy and optics gave Europe planetary models, star data, and Ibn al-Haytham's experimental study of light (callback to 3.2); the global voyages produced navigation and star-position data collected for profit, not philosophy (6.3); and the printing press let a result reach hundreds of rival scholars in months instead of decades, which is what made checking each other possible at all (6.1).",
      ],
      vocabulary: [
        { term: 'geocentric / heliocentric', definition: 'Earth-centered / Sun-centered models of the cosmos.' },
        { term: 'empiricism', definition: 'the position that knowledge must come from observation and experiment rather than from authority or pure logic.' },
        { term: 'scientific method', definition: 'the repeatable cycle of question, hypothesis, controlled test, measurement, and publication for others to check.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causal-chain',
      kind: 'worked_example',
      problem:
        'Build the causal chain: how did a mathematical suggestion in 1543 become a conclusion almost nobody could argue with by 1687?',
      steps: [
        'Start with the proposal. Copernicus (1543) puts the Sun at the center. His case is elegance, not evidence: the wandering paths of the planets get simpler to calculate. Critics have a fair objection — if the Earth is racing through space, why does nothing feel it?',
        "Add better data. Tycho Brahe spends decades recording planet positions more precisely than anyone before him. Kepler inherits those notebooks and finds the numbers only fit if the orbits are ellipses (1609). Now the Sun-centered model does not just look neater, it predicts better.",
        'Add direct observation. Galileo turns a telescope on Jupiter in 1610 and finds four moons going around it. Nobody can now claim that everything in the sky circles the Earth, because here is a counterexample anyone with a good lens can look at themselves.',
        'Notice the resistance is real, not stupid. The Earth-centered cosmos was tied to scripture as then read, to Aristotle, and to the authority of the church that taught both. Galileo is tried in 1633 and silenced. But silencing a man is not the same as refuting a measurement, and the printed books keep moving.',
        'Close the chain with the physics. The missing piece was WHY the planets would move that way. Newton (1687) supplies it: one law of universal gravitation covers the falling apple and the orbiting Moon at once. Proposal → precise data → direct evidence → a mathematical explanation that unifies the whole system.',
      ],
      answer:
        'Copernicus proposed it, Kepler made it fit the data, Galileo produced direct observational evidence, and Newton explained it with a single mathematical law — each step raising the standard of proof from authority to measurement.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-source-analysis',
      kind: 'worked_example',
      problem:
        'An English essay published in 1620 argued, in paraphrase: "We have inherited a science made of words rather than of works. Let no one say a thing is true because a famous ancient wrote it. Let him instead show the trial by which he tested it, and let others repeat that trial for themselves." Analyze what shift in the basis of knowledge this passage is demanding, and why the last clause is the most radical part of it.',
      steps: [
        'Identify the target. "A science made of words" is an attack on scholarship that argues by quoting texts — Aristotle said it, therefore it is settled. The writer is naming authority itself as the problem.',
        'Identify the replacement. "Show the trial by which he tested it" demands evidence produced on purpose: a deliberate experiment, not just casual experience. This is empiricism becoming a procedure rather than an attitude.',
        'Read the last clause carefully. "Let others repeat that trial" moves the authority out of any single person entirely. A claim is now only as good as its reproducibility by strangers — including strangers who would love to prove you wrong.',
        'Connect it to institutions. That clause is why the Royal Society (1660) mattered so much: a standing group that meets, demonstrates, publishes, and criticizes turns "repeat my trial" from a slogan into a working system.',
        'Name the consequence the writer may not have intended. A rule that says no one is above being checked does not stay inside the study of nature. Applied to government or inherited custom, the same rule asks: what is the evidence that this arrangement is the right one?',
      ],
      answer:
        'The passage demands that knowledge rest on deliberate, testable experiment that others can repeat, rather than on inherited authority — and by making reproducibility the standard, it removes any person or text from being the final word.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-jupiter-moons',
      kind: 'try_yourself',
      problem:
        "In 1610 Galileo reported that four moons circle Jupiter. Why did this particular observation damage the Earth-centered model of the cosmos?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It was direct evidence that at least some bodies orbit something other than the Earth', correct: true },
        { id: 'b', text: 'It measured the distance from the Earth to the Sun for the first time' },
        { id: 'c', text: 'It showed that planets travel in ellipses rather than circles' },
        { id: 'd', text: 'It proved that the Earth is round rather than flat' },
      ],
      expectedAnswer: 'It was direct evidence that at least some bodies orbit something other than the Earth',
      hints: [
        'The Earth-centered model made a universal claim. Ask what a single visible counterexample does to a universal claim.',
        'The moons were going around Jupiter, not around the Earth — and anyone with a decent telescope could confirm it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-method',
      kind: 'try_yourself',
      problem:
        'Historians often argue that the most important product of the Scientific Revolution was not any single discovery. What do they mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A method: claims are settled by controlled experiment, measurement, and open publication that others can repeat and challenge', correct: true },
        { id: 'b', text: 'The invention of the telescope, which made all later discoveries possible' },
        { id: 'c', text: 'The discovery that the Earth is a sphere, which had been unknown before 1543' },
        { id: 'd', text: 'The end of religious belief among European scientists' },
      ],
      expectedAnswer: 'A method: claims are settled by controlled experiment, measurement, and open publication that others can repeat and challenge',
      hints: [
        'Individual findings get corrected over time. Ask what survived all the corrections and is still in use today.',
        "Bacon's experiments, Descartes' reasoning, and the Royal Society's public demonstrations all point at the same answer.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bridge-enlightenment',
      kind: 'try_yourself',
      problem:
        'Why did the Scientific Revolution unsettle rulers and traditional institutions, even though most of its findings were about planets and falling objects?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It established that reason and evidence could overturn a long-accepted truth, which invited the same test to be applied to kings, churches, and inherited custom', correct: true },
        { id: 'b', text: 'It required governments to fund expensive laboratories they could not afford' },
        { id: 'c', text: 'It caused an immediate collapse of religious belief across Europe' },
        { id: 'd', text: 'It gave ordinary people access to firearms and printing for the first time' },
      ],
      expectedAnswer: 'It established that reason and evidence could overturn a long-accepted truth, which invited the same test to be applied to kings, churches, and inherited custom',
      hints: [
        'The threat was not any planet. It was the precedent — the idea that "we have always believed this" is not an argument.',
        'This is the direct bridge into the Enlightenment in 7.3, where the same tools get pointed at government and society.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-science-vs-religion',
      kind: 'misconception_check',
      question:
        'A student says: "The Scientific Revolution was science defeating religion — Galileo was executed for proving the Earth moves, and after Newton, scientists stopped being religious." What needs correcting?',
      commonErrors: [
        {
          answer: 'Galileo was executed for his astronomy',
          misconception: 'Collapsing a censorship trial into an execution, and treating the conflict as total war between two camps.',
          correctsTo:
            'Galileo was tried in 1633, forced to recant, and lived under house arrest until his death in 1642 — punished and silenced, not executed. The conflict was real, but it was about authority: who gets to decide what counts as proof about the natural world.',
        },
        {
          answer: 'The revolution proved religion false and scientists abandoned it',
          misconception: 'Reading a modern culture-war frame back onto the 1600s.',
          correctsTo:
            'Copernicus was a church official, Kepler and Newton were both deeply religious, and Newton wrote extensively on theology. Most of them understood themselves as uncovering the orderly laws behind creation. What changed was the METHOD for settling factual claims about nature, not the disappearance of belief.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The old standard was authority — Aristotle and Ptolemy, read through church interpretation. The new standard was observation, measurement, and repeatable experiment.',
        'The chain: Copernicus proposes a Sun-centered cosmos (1543), Kepler shows the orbits are ellipses (1609), Galileo supplies direct evidence with the telescope (1609-1610, tried in 1633), Newton unifies it under universal gravitation (1687).',
        "The method outlasted the discoveries: Bacon's empiricism, Descartes' reasoning, controlled experiment, and open publication through bodies like the Royal Society (1660).",
        'It rested on borrowed foundations — Islamic astronomy and optics, navigational data from the global voyages, and the printing press that let scholars check one another quickly.',
        'It mattered beyond science: if reason could rewrite the heavens, it could question kings and inherited custom too — the direct bridge to the Enlightenment in 7.3.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'The Scientific Revolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
