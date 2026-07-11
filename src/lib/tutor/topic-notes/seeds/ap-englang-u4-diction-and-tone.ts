/**
 * AP English Language & Composition — Unit 4 CED 4.3: Diction and Tone.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.diction-and-tone.v1`). Covers connotation-level diction
 * analysis, how a cluster of word choices adds up to a describable TONE,
 * tonal shift (and its absence), and building a full evidence-and-commentary
 * paragraph around diction.
 *
 * Anchor text referenced in the method's example: Jonathan Swift's "A
 * Modest Proposal." Quotes are limited to short structural/clinical phrases
 * already used elsewhere in the course, per content-safety guidance.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_DICTION_AND_TONE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.diction-and-tone.v1',
  course: 'AP English Language',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Diction and Tone',
  planId: 'evelyn.ap.englang.diction-and-tone.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.diction-and-tone.v1' }],
  theory: [
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'definition',
      title: 'diction',
      content:
        "A writer's specific word choice — not vocabulary in general, but the deliberate selection of THIS word over available synonyms with a different charge.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'definition',
      title: 'connotation',
      content:
        "The emotional or associative charge a word carries beyond its literal (denotative) meaning. \"Frugal\" and \"cheap\" denote the same behavior but connote very differently — one approving, one critical.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'definition',
      title: 'tone',
      content:
        "The writer's attitude toward the subject as it is revealed THROUGH accumulated word choices. Tone is not a mood in the reader, and not a topic — it is inferred from a pattern of diction, not from a single word in isolation.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'strategy',
      title: 'tone reveals through clusters, not single words',
      content:
        "To analyze tone, look for CLUSTERS: several words from the same connotative family reinforcing each other (e.g. repeated clinical/bureaucratic terms building a tone of detached, official rationality) rather than resting an entire tone claim on one word.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'framework',
      title: 'tonal shift',
      content:
        "A deliberate change in the pattern of diction partway through a passage — often signaled by a turn word (\"but,\" \"yet\") or a sudden change in register (formal to casual, clinical to visceral). A tonal shift usually marks a shift in the writer's rhetorical move, not just a stylistic accident.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'rhetorical-device',
      title: 'irony through diction',
      content:
        "Occurs when a calm, clinical, or approving tone is applied to a subject the reader knows (or comes to realize) is shocking or morally troubling — the mismatch between measured word choice and disturbing content IS the argument, forcing the reader to supply the outrage the writer's flat tone withholds.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'trap',
      title: 'naming a tone word without diction',
      content:
        'Naming a tone word ("the tone is ironic") without pointing to the SPECIFIC diction that produces it is an assertion, not an analysis — the tone-analysis equivalent of naming a device without commentary. Always pair the tone word with the exact words that produce it.',
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'strategy',
      title: 'the absence of a shift can itself be the move',
      content:
        "Sometimes the most unsettling rhetorical choice is that the expected tonal shift does NOT happen — a calm, appreciative register continuing unbroken into shocking content is itself the satiric point, exposing how a coldly \"rational\" voice can rationalize a monstrous conclusion without ever registering that anything has gone wrong.",
    },
    {
      loId: 'apenglang.diction-and-tone',
      kind: 'strategy',
      title: 'building a paragraph around diction',
      content:
        'A diction-and-tone paragraph follows the same evidence-and-commentary shape as any other: topic sentence naming the tone claim, specific quoted diction as evidence, commentary naming the connotation of each term and the tone the cluster produces, then a link back to why that tone serves the writer\'s purpose.',
    },
  ],
  methods: [
    {
      title: "Build an evidence-and-commentary paragraph around diction and tone",
      when_to_use:
        'Use when asked to analyze how word choice creates a describable tone, or to trace a tonal shift (or its absence) across a passage.',
      steps: [
        "WRITE THE TOPIC SENTENCE — state the mini-claim: this cluster of diction establishes a specific tone toward the subject.",
        'SELECT THE EVIDENCE — SPECIFIC WORDS, NOT JUST A VIBE — point to a cluster of connotatively-related terms, not a single word.',
        'NAME THE CONNOTATION OF EACH TERM — what associative charge does each word carry beyond its literal meaning?',
        'NAME THE TONE THIS CLUSTER PRODUCES — state the attitude the pattern reveals.',
        "EXPLAIN WHY THIS TONE SERVES THE WRITER'S PURPOSE — tie the tone back to the rhetorical situation and what effect it primes in the reader.",
        "LINK BACK TO THE PARAGRAPH'S CLAIM — close by tying the diction back to the larger argument the tone is setting up.",
      ],
      example: {
        problem:
          "Build one body paragraph analyzing how Swift's diction creates a clinical, detached tone in the early paragraphs of \"A Modest Proposal,\" and how that tone makes the essay's later ironic turn possible.",
        solution:
          "Swift's diction in the opening paragraphs establishes a coldly bureaucratic, statistic-minded tone toward a subject — starving children — that would ordinarily call for compassion, not calculation. Words like \"prodigious number,\" \"additional grievance,\" and \"computation\" carry the connotation of an administrative problem to be tallied on paper rather than a human tragedy, while calling children potential \"useful members of the commonwealth\" evaluates them by utility rather than as people. Together this cluster produces a detached, clinical, faux-reasonable tone — the voice of a policy report, not a person moved by suffering. Swift is not endorsing that detachment; he is performing it, training the reader to notice just how calm this voice remains before the proposal turns monstrous, so that the later irony lands as devastating rather than merely absurd.",
      },
      relatedLoIds: ['apenglang.diction-and-tone'],
    },
  ],
  pointers: [
    { content: 'Diction = deliberate word choice; connotation = charge beyond the dictionary meaning; tone = the attitude a CLUSTER of choices reveals.', kind: 'tip' },
    { content: 'Never rest a tone claim on one word in isolation — point to a pattern of connotatively-related choices.', kind: 'trap' },
    { content: 'A tonal shift is often marked by a turn word ("but," "yet") or a register change — but sometimes the absence of an expected shift IS the rhetorical move.', kind: 'tip' },
    { content: 'Naming a tone word ("the tone is ironic") without citing the diction that produces it earns no credit — pair the label with the words.', kind: 'trap' },
    { content: 'Irony through diction: calm/approving language applied to shocking content forces the reader to supply the outrage the writer withholds.', kind: 'tip' },
    { content: 'Same evidence+commentary discipline as any paragraph: cite the specific words, then explain how they work and why they serve the purpose.', kind: 'tip' },
  ],
};
