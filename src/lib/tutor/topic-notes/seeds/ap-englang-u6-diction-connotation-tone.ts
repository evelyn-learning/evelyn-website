/**
 * AP English Language & Composition — Unit 6 CED 6.2: Diction, Connotation,
 * and Tone.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.diction-connotation-tone.v1`). Builds on introductory
 * diction/tone work at higher sophistication: tracking how a text can LAYER
 * multiple connotative registers and how the FRICTION or ESCALATION between
 * registers is itself a sophisticated source of tone and irony.
 *
 * Anchor texts referenced in the method's example: Jonathan Swift's "A
 * Modest Proposal" (1729) and Frederick Douglass's "What to the Slave Is the
 * Fourth of July?" (1852). Quotes are limited to the short structural/
 * connotative phrases already used in the lesson plan; no graphic content is
 * referenced.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_DICTION_CONNOTATION_TONE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.diction-connotation-tone.v1',
  course: 'AP English Language',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Diction, Connotation, and Tone',
  planId: 'evelyn.ap.englang.diction-connotation-tone.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.diction-connotation-tone.v1' }],
  theory: [
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'definition',
      title: 'connotative register',
      content:
        'A family of words that share a similar charge — clinical/bureaucratic, heroic/civic, sentimental, contemptuous. Sophisticated diction analysis names the REGISTER a word belongs to, not just that single word\'s individual charge in isolation.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'definition',
      title: 'escalating diction',
      content:
        'A sequence that moves a claim through increasingly loaded synonyms for the same idea (word 1 → word 2 → word 3, each more charged than the last). Tracking the CLIMB itself is more sophisticated than picking one word out of context — the escalation, not the endpoint, is often the analytical point.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'definition',
      title: 'register friction / misapplied register',
      content:
        'Texts often layer MULTIPLE connotative registers rather than relying on one; the FRICTION between two registers (e.g. clinical/statistical diction alongside grandiose/heroic diction) can itself be the source of tone — irony, self-satire, dramatic contrast. A **misapplied register** is language belonging to one register (e.g. heroic) deliberately applied to a subject that register doesn\'t fit, exposing a mismatch.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'framework',
      title: 'word-level vs. passage-level tone',
      content:
        'A single word\'s connotation is a data point; the analytical move is explaining how a CLUSTER of words — or the interaction of two clusters — commits the writer to a stance, and how that stance may shift or complicate itself as a new register enters. Do not stop at one word; track the pattern across the passage.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'strategy',
      title: 'connotative contrast as argument',
      content:
        'When a writer applies elevated, laudatory diction to something that should provoke discomfort, or ordinary/self-interested diction to something that should be exalted, that mismatch is doing rhetorical work. Noticing WHICH register is misapplied to WHICH subject IS the analytical move — the mismatch itself is the evidence.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'strategy',
      title: 'layering registers, not one tone word',
      content:
        'A text often does not settle on a single tone word ("ironic," "angry") but layers two or more registers that interact — one register can flatten a subject (clinical) while a second dresses that flattening up as achievement (heroic). Naming both registers and their interaction is a higher-sophistication move than naming a single tone.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'trap',
      title: 'negative-words-only cataloging',
      content:
        'Observing "there are a lot of negative words here" catalogs connotation without doing analysis. It names no specific register (moral condemnation? religious betrayal? emptiness?) and tracks no escalation. Full-credit diction analysis always names the register and explains whether the words simply pile up or actively escalate.',
    },
    {
      loId: 'apenglang.diction-connotation-tone',
      kind: 'strategy',
      title: 'escalation unifies a catalog',
      content:
        'When a passage strings together several increasingly damning terms, the analytical claim is not that each term is negative individually — it is that the ESCALATION (each term hitting harder than the one before) turns a list of separate observations into one unified, mounting tone, often one of total indictment rather than scattered complaint.',
    },
  ],
  methods: [
    {
      title: 'Analyze layered connotative registers',
      when_to_use:
        'Use when a passage combines two or more distinct word-families (e.g. clinical + heroic, or a catalog of escalating synonyms) rather than relying on one obvious tone word.',
      steps: [
        'NAME THE FIRST REGISTER — identify the family of words already established (e.g. clinical/statistical) and what it normally describes.',
        'NAME THE SECOND, CONTRASTING REGISTER layered on top — what family of words enters, and what does IT normally describe?',
        'IDENTIFY ANY MISAPPLICATION — is a register (e.g. heroic) being applied to a subject it does not normally fit?',
        'EXPLAIN THE FRICTION between the two registers — what does combining them expose that neither register alone would reveal?',
        "EXPLAIN WHY THE ESCALATION OR COMBINATION — not either register alone — serves the writer's purpose at this specific moment.",
        'LINK BACK to the passage\'s overall stance: how does this two-register collision serve as more sophisticated evidence than either register in isolation.',
      ],
      example: {
        problem:
          'Building on the clinical/statistical register already identified in Swift\'s opening ("prodigious number," "additional grievance," "computation"), analyze the second, contrasting register Swift layers on top: whoever solves this problem "would deserve so well of the publick, as to have his statue set up for a preserver of the nation."',
        solution:
          'Swift layers a second, heroic/civic-virtue register — "deserve so well of the publick," "statue set up... for a preserver of the nation" — on top of the clinical, statistic-minded register already at work in "computation" and "additional grievance." That heroic vocabulary normally honors selfless, history-making sacrifice; applying it here, to whoever devises an efficient method of processing poor children, exposes how readily a society dresses up a monstrous calculation as civic virtue. The escalation from clinical detachment to statue-worthy celebration — not either register alone — shows self-congratulation growing in exact proportion to the horror underneath it.',
      },
      relatedLoIds: ['apenglang.diction-connotation-tone'],
    },
  ],
  pointers: [
    { content: 'Name the REGISTER a cluster of words belongs to (clinical, heroic, sentimental) — not just one word\'s individual charge.', kind: 'tip' },
    { content: 'Escalating diction: track the CLIMB across a sequence of increasingly loaded synonyms, not just the strongest word.', kind: 'tip' },
    { content: 'Register friction — two registers colliding (e.g. clinical detachment dressed up as heroism) — is often the sharpest source of tone.', kind: 'tip' },
    { content: '"A lot of negative words" is an observation, not analysis — always name the specific register and whether it escalates.', kind: 'trap' },
    { content: 'A misapplied register (heroic language for something monstrous) exposes the writer\'s real target — flag the mismatch explicitly.', kind: 'tip' },
    { content: 'Never stop at "the tone is negative/ironic" — name the specific register(s) and explain how they combine or escalate into one unified tone.', kind: 'trap' },
  ],
};
