/**
 * AP English Language & Composition — Unit 2 CED 2.2: Selecting and
 * Sequencing Evidence.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.selecting-evidence.v1`). Scales 1.4's evidence-and-
 * commentary skill up to handling multiple pieces of evidence, of different
 * types, deliberately sequenced within a single argument paragraph.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775), used as a model of marshaling several
 * evidence types against the same objection. Quotes are limited to short
 * structural phrases already used elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SELECTING_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.selecting-evidence.v1',
  course: 'AP English Language & Composition',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Selecting and Sequencing Evidence',
  planId: 'evelyn.ap.englang.selecting-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.selecting-evidence.v1' }],
  theory: [
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'definition',
      title: 'evidence type',
      content:
        'A category of support a writer selects to fit a claim. Four types cover most arguments: an EXAMPLE (an illustrative case, real or hypothetical), an ANECDOTE (a specific narrative instance), DATA (statistics, studies, measured facts), and an APPEAL TO AUTHORITY (a credible expert or institution\'s judgment). Most persuasive arguments draw on more than one type, because each compensates for what the others lack.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'definition',
      title: 'relevance',
      content:
        'Evidence bearing directly on the SPECIFIC claim, not just the general topic. A statistic about teenage sleep matters to a start-time argument only when it\'s tied to the specific policy being proposed, not sleep in general.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'definition',
      title: 'sufficiency',
      content:
        'Enough well-chosen evidence that a skeptical reader can\'t dismiss the claim as a fluke, an outlier, or a cherry-picked case. One anecdote alone is rarely sufficient; pairing an anecdote with data usually is, because each corroborates the other from a different angle.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'framework',
      title: 'sequencing',
      content:
        'A deliberate choice, not an accident of what was thought of first. Reliable orders include BROAD-TO-SPECIFIC (data establishing scale, then an anecdote making it concrete) and CLIMACTIC (building from a solid piece to the most decisive one), so the paragraph\'s structure itself argues, not just its content.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'trap',
      title: 'the evidence dump',
      content:
        'The #1 failure at this stage: stringing multiple pieces of evidence together with no reasoning for why this piece precedes that one, and no commentary linking each piece back to the claim. This is quote-and-drop (1.4) at paragraph scale — more exhibits, still no case being made about them.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'strategy',
      title: 'selection is itself an argument about audience',
      content:
        'Choosing which evidence type to lead with signals what the writer expects the reader to need: leading with data signals a skeptical, numbers-driven reader; leading with an anecdote signals a need to make the stakes feel human first.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'rhetorical-device',
      title: 'Henry marshals multiple evidence types against one objection',
      content:
        'Against the objection that the colonies are too weak to fight, Henry uses the history of failed petitions as precedent evidence that peaceful means are exhausted, the appeal to "a just God who... will raise up friends" as an appeal to authority, and "three millions of people, armed in the holy cause of liberty" as a scale-based claim — sequenced so the exhaustion of peaceful means comes first (establishing necessity) before he answers the weakness objection with numbers and providence.',
    },
    {
      loId: 'apenglang.selecting-evidence',
      kind: 'strategy',
      title: 'a jury needs an order, not just exhibits',
      content:
        'Even if every item of evidence is technically relevant, a reader has no idea which one to weigh first or how they connect unless the writer chooses a deliberate order and explains the connection — that is the difference between having evidence and building a case with it.',
    },
  ],
  methods: [
    {
      title: 'Select and sequence evidence for a body paragraph',
      when_to_use:
        'Use for each body paragraph of an original argument once a position (2.1) is established and evidence needs to be chosen, ordered, and explained.',
      steps: [
        'WRITE THE TOPIC SENTENCE stating the mini-claim this paragraph proves.',
        'SELECT AN EVIDENCE TYPE 1 (often DATA) — choose a specific, relevant statistic and note why THIS statistic, not a vaguer one, ties directly to the claim.',
        'SELECT AN EVIDENCE TYPE 2 (often an ANECDOTE or EXAMPLE) — choose a specific, illustrative case that corroborates the first piece from a different angle.',
        'DECIDE THE SEQUENCE — broad-to-specific (data, then anecdote) or climactic (building to the most decisive piece) — so the paragraph builds rather than lists.',
        'WRITE COMMENTARY FOR EACH PIECE explaining why it matters specifically to this claim, not the general topic.',
        'LINK BACK TO THE CLAIM, tying both pieces together into one case rather than two separate exhibits.',
      ],
      example: {
        problem:
          "Build one body paragraph selecting and sequencing evidence for the position: 'Because chronic sleep deprivation measurably impairs teenagers' attention, mood, and safety behind the wheel, high schools should push start times to 8:30 a.m. or later.' Use at least two different evidence types.",
        solution:
          "Delaying start times addresses a measurable safety problem, not just a felt inconvenience. Sleep researchers have found that adolescents under chronic sleep restriction show reaction-time deficits comparable to mild alcohol impairment — a finding that matters specifically for teen drivers, not students in the abstract. That risk isn't hypothetical: when one district shifted its start time to 8:35 a.m., it logged a documented drop in early-morning crashes involving teen drivers the following year. Together, the data establishes the scale of the danger and the case shows it is not unfixable.",
      },
      relatedLoIds: ['apenglang.selecting-evidence'],
    },
  ],
  pointers: [
    { content: 'Four evidence types cover most arguments — example, anecdote, data, appeal to authority — and strong arguments usually draw on more than one.', kind: 'tip' },
    { content: 'Relevance means evidence bears on the SPECIFIC claim, not just the general topic.', kind: 'tip' },
    { content: 'Sufficiency means enough evidence that a skeptical reader can\'t dismiss the claim as an outlier.', kind: 'tip' },
    { content: 'The evidence dump — relevant evidence with no order and no commentary — is the paragraph-scale version of quote-and-drop.', kind: 'trap' },
    { content: 'Sequencing is a deliberate choice: broad-to-specific and climactic are two reliable patterns.', kind: 'tip' },
    { content: 'Even three relevant pieces of evidence strung together with "also" and no commentary is still a dump — relevance alone isn\'t enough.', kind: 'trap' },
  ],
};
