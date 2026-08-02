/**
 * World History — Unit 7 CED 7.1: The Scientific Revolution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.whist.scientific-revolution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_WHIST_U7_SCIENTIFIC_REVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.whist.scientific-revolution.v1',
  course: 'World History',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'The Scientific Revolution',
  planId: 'evelyn.hs.whist.scientific-revolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.whist.scientific-revolution.v1' }],
  theory: [
    { loId: 'whist.scientific-revolution', kind: 'framework', title: 'Authority was the old proof', content: `AUTHORITY WAS THE OLD PROOF — in medieval European universities, knowledge about nature meant knowing the right texts: Aristotle on motion and matter, Ptolemy on an Earth-centered cosmos (written c. 150 CE), read alongside church interpretation. Truth was something you looked up in a trusted book, not something you went out and measured.` },
    { loId: 'whist.scientific-revolution', content: `COPERNICUS MOVED THE EARTH (1543) — Nicolaus Copernicus published On the Revolutions of the Heavenly Spheres in the year he died, arguing the Sun, not the Earth, sits at the center. Key student point: he had almost no new observations. He had a simpler mathematics for predicting planet positions. It was a proposal, not yet a proof.` },
    { loId: 'whist.scientific-revolution', content: `KEPLER GAVE ORBITS THEIR REAL SHAPE (1609) — working from Tycho Brahe's decades of unusually precise naked-eye measurements, Johannes Kepler showed the orbits are ellipses, not perfect circles. This mattered because "heavenly motion must be perfectly circular" was an ancient assumption nobody had ever tested against good data. The data won.` },
    { loId: 'whist.scientific-revolution', content: `GALILEO SUPPLIED THE EVIDENCE (1609-1610) — Galileo Galilei built his own telescope and saw craters on the Moon, phases of Venus, and four moons circling Jupiter. Those moons were the decisive point: here was direct evidence that not everything in the sky orbits the Earth. He also ran rolling-ball experiments on motion, testing Aristotle instead of quoting him.` },
    { loId: 'whist.scientific-revolution', kind: 'framework', title: 'The 1633 trial', content: `THE 1633 TRIAL — the church had a real stake in the Earth-centered cosmos: it was woven into accepted readings of scripture and into the authority of the institution that interpreted them. Galileo was tried in Rome in 1633, forced to recant publicly, and spent his remaining years under house arrest until his death in 1642. The ideas kept spreading anyway — printed books do not answer summonses.` },
    { loId: 'whist.scientific-revolution', content: `NEWTON UNIFIED HEAVEN AND EARTH (1687) — Isaac Newton's Principia proposed universal gravitation: the SAME mathematical law pulls an apple to the ground and holds the Moon in orbit. That is the deeper claim of the whole revolution — nature is law-governed, uniform, and describable in mathematics, with no separate rules for the heavens.` },
    { loId: 'whist.scientific-revolution', kind: 'framework', title: 'The method was the real revolution', content: `THE METHOD WAS THE REAL REVOLUTION — the lasting product was not any single discovery but a way of working: Francis Bacon's empiricism (gather observations, generalize from them, distrust inherited claims), Rene Descartes' systematic doubt and mathematical reasoning, deliberately controlled experiments, and open publication so strangers could repeat and challenge your results. The Royal Society, founded in London in 1660, existed to circulate and test findings in public.` },
    { loId: 'whist.scientific-revolution', kind: 'framework', title: 'It had borrowed foundations', content: `IT HAD BORROWED FOUNDATIONS — this was not a European invention from nothing. Islamic astronomy and optics gave Europe planetary models, star data, and Ibn al-Haytham's experimental study of light (callback to 3.2); the global voyages produced navigation and star-position data collected for profit, not philosophy (6.3); and the printing press let a result reach hundreds of rival scholars in months instead of decades, which is what made checking each other possible at all (6.1).` },
    { loId: 'whist.scientific-revolution', kind: 'definition', title: 'geocentric / heliocentric', content: 'Earth-centered / Sun-centered models of the cosmos.' },
    { loId: 'whist.scientific-revolution', kind: 'definition', title: 'empiricism', content: `the position that knowledge must come from observation and experiment rather than from authority or pure logic.` },
    { loId: 'whist.scientific-revolution', kind: 'definition', title: 'scientific method', content: `the repeatable cycle of question, hypothesis, controlled test, measurement, and publication for others to check.` },
  ],
  methods: [
    {
      title: 'Worked causal chain',
      steps: [
        `Start with the proposal. Copernicus (1543) puts the Sun at the center. His case is elegance, not evidence: the wandering paths of the planets get simpler to calculate. Critics have a fair objection — if the Earth is racing through space, why does nothing feel it?`,
        `Add better data. Tycho Brahe spends decades recording planet positions more precisely than anyone before him. Kepler inherits those notebooks and finds the numbers only fit if the orbits are ellipses (1609). Now the Sun-centered model does not just look neater, it predicts better.`,
        `Add direct observation. Galileo turns a telescope on Jupiter in 1610 and finds four moons going around it. Nobody can now claim that everything in the sky circles the Earth, because here is a counterexample anyone with a good lens can look at themselves.`,
        `Notice the resistance is real, not stupid. The Earth-centered cosmos was tied to scripture as then read, to Aristotle, and to the authority of the church that taught both. Galileo is tried in 1633 and silenced. But silencing a man is not the same as refuting a measurement, and the printed books keep moving.`,
        `Close the chain with the physics. The missing piece was WHY the planets would move that way. Newton (1687) supplies it: one law of universal gravitation covers the falling apple and the orbiting Moon at once. Proposal → precise data → direct evidence → a mathematical explanation that unifies the whole system.`,
      ],
      example: { problem: `Build the causal chain: how did a mathematical suggestion in 1543 become a conclusion almost nobody could argue with by 1687?`, solution: `Copernicus proposed it, Kepler made it fit the data, Galileo produced direct observational evidence, and Newton explained it with a single mathematical law — each step raising the standard of proof from authority to measurement.` },
      relatedLoIds: ['whist.scientific-revolution'],
    },
    {
      title: 'Worked source analysis',
      steps: [
        `Identify the target. "A science made of words" is an attack on scholarship that argues by quoting texts — Aristotle said it, therefore it is settled. The writer is naming authority itself as the problem.`,
        `Identify the replacement. "Show the trial by which he tested it" demands evidence produced on purpose: a deliberate experiment, not just casual experience. This is empiricism becoming a procedure rather than an attitude.`,
        `Read the last clause carefully. "Let others repeat that trial" moves the authority out of any single person entirely. A claim is now only as good as its reproducibility by strangers — including strangers who would love to prove you wrong.`,
        `Connect it to institutions. That clause is why the Royal Society (1660) mattered so much: a standing group that meets, demonstrates, publishes, and criticizes turns "repeat my trial" from a slogan into a working system.`,
        `Name the consequence the writer may not have intended. A rule that says no one is above being checked does not stay inside the study of nature. Applied to government or inherited custom, the same rule asks: what is the evidence that this arrangement is the right one?`,
      ],
      example: { problem: `An English essay published in 1620 argued, in paraphrase: "We have inherited a science made of words rather than of works. Let no one say a thing is true because a famous ancient wrote it. Let him instead show the trial by which he tested it, and let others repeat that trial for themselves." Analyze what shift in the basis of knowledge this passage is demanding, and why the last clause is the most radical part of it.`, solution: `The passage demands that knowledge rest on deliberate, testable experiment that others can repeat, rather than on inherited authority — and by making reproducibility the standard, it removes any person or text from being the final word.` },
      relatedLoIds: ['whist.scientific-revolution'],
    },
  ],
  pointers: [
    { content: `Galileo was tried in 1633, forced to recant, and lived under house arrest until his death in 1642 — punished and silenced, not executed. The conflict was real, but it was about authority: who gets to decide what counts as proof about the natural world.`, kind: 'common-error' },
    { content: `Copernicus was a church official, Kepler and Newton were both deeply religious, and Newton wrote extensively on theology. Most of them understood themselves as uncovering the orderly laws behind creation. What changed was the METHOD for settling factual claims about nature, not the disappearance of belief.`, kind: 'common-error' },
    { content: `The old standard was authority — Aristotle and Ptolemy, read through church interpretation. The new standard was observation, measurement, and repeatable experiment.`, kind: 'tip' },
    { content: `The chain: Copernicus proposes a Sun-centered cosmos (1543), Kepler shows the orbits are ellipses (1609), Galileo supplies direct evidence with the telescope (1609-1610, tried in 1633), Newton unifies it under universal gravitation (1687).`, kind: 'tip' },
    { content: `The method outlasted the discoveries: Bacon's empiricism, Descartes' reasoning, controlled experiment, and open publication through bodies like the Royal Society (1660).`, kind: 'tip' },
    { content: `It rested on borrowed foundations — Islamic astronomy and optics, navigational data from the global voyages, and the printing press that let scholars check one another quickly.`, kind: 'tip' },
    { content: `It mattered beyond science: if reason could rewrite the heavens, it could question kings and inherited custom too — the direct bridge to the Enlightenment in 7.3.`, kind: 'tip' },
    { content: `Galileo was **not** executed. He was tried in 1633, forced to recant, and lived under house arrest until 1642. Write "tried and silenced," not "burned" or "killed" — that's Giordano Bruno you're half-remembering, and even his case wasn't purely astronomical.`, kind: 'common-error' },
    { content: `Don't say Copernicus "proved" heliocentrism. He offered a *simpler mathematics* with almost no new observations. Proof came later — Kepler's ellipses fit Brahe's data, Galileo's telescope supplied direct evidence. Use "proposed" for 1543.`, kind: 'vocab-note' },
    { content: `Geocentric = Earth-centered (geo/Ge = Earth). Heliocentric = Sun-centered (Helios = Sun). Students flip these under time pressure — anchor the root once and check it every time you write the word.`, kind: 'vocab-note' },
    { content: `"Scientists stopped being religious" is backwards. Copernicus was a church official; Kepler and Newton were devout, and Newton wrote more on theology than physics. What changed was the *method for settling factual claims about nature*, not belief itself.`, kind: 'gotcha' },
    { content: `The Jupiter moons mattered for one precise reason: they were a visible *counterexample* — something orbiting a body other than Earth. Don't answer vaguely with "the telescope showed the truth." Name what the observation ruled out.`, kind: 'tip' },
    { content: `Resist calling this a purely European achievement. Islamic astronomy and Ibn al-Haytham's optics supplied models and experimental technique, voyages supplied star and navigation data, and the printing press made mutual checking possible at all.`, kind: 'edge-case' },
    { content: `Empiricism ≠ scientific method. Empiricism is the *position* that knowledge comes from observation; the scientific method is the *procedure* (hypothesis, controlled test, measurement, publication). Bacon argued the position; the Royal Society institutionalized the procedure.`, kind: 'vocab-note' },
    { content: `The most radical demand was reproducibility — *others* repeating your trial. That clause is what removes any single person or text as final word, and it's what carries into 7.3: if no one is above being checked, why is a king?`, kind: 'tip' },
  ],
};
