/**
 * AP English Language & Composition — Unit 7 CED 7.1: Nuance, Qualification,
 * and Concession.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.nuance-qualification-concession.v1`). Targets the AP
 * rubric's SOPHISTICATION point via QUALIFICATION (scoping a claim to the
 * degree the evidence supports, rather than overstating it into an absolute)
 * and genuine CONCESSION (honestly acknowledging a real limit in the
 * writer's OWN claim, distinct from the counterargument-rebuttal move).
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of
 * July?" (1852) — the teaching point is Douglass's qualifying wish, "Would
 * to God... that an affirmative answer could be truthfully returned." Quotes
 * are limited to this short structural phrase, never the atrocity content
 * the speech condemns.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_NUANCE_QUALIFICATION_CONCESSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.nuance-qualification-concession.v1',
  course: 'AP English Language',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Nuance, Qualification, and Concession',
  planId: 'evelyn.ap.englang.nuance-qualification-concession.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.nuance-qualification-concession.v1' }],
  theory: [
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'definition',
      title: 'qualification',
      content:
        'Scoping a claim to the degree, conditions, or population the evidence actually supports — using words like "often," "in most cases," "to a considerable degree," "under these conditions" instead of absolutes like "always," "every," "completely," "no one."',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'definition',
      title: 'concession (of one\'s own claim)',
      content:
        'Honestly acknowledging a real limit, exception, or complication within the writer\'s OWN position — not the opponent\'s objection (that is the counterargument-rebuttal move). A genuine concession names where the writer\'s own claim does not fully hold, in service of, not retreat from, the larger argument.',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'definition',
      title: 'hedging vs. qualification',
      content:
        'Hedging weakens a claim\'s force with vague uncertainty ("I guess maybe this could sort of be true") until nothing specific is left to disagree with — a failure mode, not sophistication. Qualification sharpens the claim\'s precision while keeping its force ("this holds in most cases, though it weakens under X condition") — the claim stays specific and arguable; it just stops overreaching.',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'framework',
      title: 'why overstated claims are weaker',
      content:
        'An overstated claim (an absolute) is easy to destroy: a single counterexample refutes "always" or "never" entirely. A qualified claim is more defensible precisely because it only claims what can actually be shown — it survives scrutiny that a stronger-sounding absolute claim would not. Sophistication is not about sounding more confident; it is about claiming exactly as much as the evidence supports.',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'strategy',
      title: 'the sophistication point',
      content:
        "The AP rubric's SOPHISTICATION point rewards writing that demonstrates complex understanding, explains the significance of the rhetorical situation, or makes effective use of nuanced, precise language throughout. A genuinely qualified claim or an honest concession about the claim's own limits is one of the most learnable ways to demonstrate that complexity, because it shows the writer sees more than one layer of the issue.",
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'strategy',
      title: 'Douglass\'s qualifying wish',
      content:
        'Douglass models this move directly: "Would to God, both for your sakes and ours, that an affirmative answer could be truthfully returned to these questions!" is a genuine concession — he honestly admits what he WISHES were true (that the nation\'s ideals did extend to enslaved people) before showing the real answer is otherwise. The concession does not weaken his indictment; naming what he wishes were true makes the gap he goes on to expose land harder.',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'rhetorical-device',
      title: 'qualifying language as a toolkit',
      content:
        'A small, reusable vocabulary does most of the qualifying work: frequency scopes ("often," "in most cases," "rarely"), degree scopes ("to a considerable degree," "partially," "largely"), and condition scopes ("under these circumstances," "when X is present"). Reaching for one of these, instead of an absolute, is usually enough to convert an overstated claim into a defensible one.',
    },
    {
      loId: 'apenglang.nuance-qualification-concession',
      kind: 'trap',
      title: 'two tests: scope and honesty',
      content:
        'Test for a qualified claim: does it name the SCOPE (how much, how often, under what conditions) rather than reaching for the biggest possible version? Test for a genuine concession: does the writer name a real limit or complication in their OWN position, honestly, rather than only ever conceding points made by an imagined opponent?',
    },
  ],
  methods: [
    {
      title: 'Revise an overstated claim into a qualified, defensible one',
      when_to_use:
        'Use when a claim or thesis contains an absolute ("all," "every," "completely," "never") that a single counterexample could refute, and needs to be sharpened rather than simply softened.',
      steps: [
        "IDENTIFY THE OVERSTATEMENT — flag every absolute word ('proves,' 'all,' 'completely,' 'every,' 'total'). Each is vulnerable to a single counterexample.",
        'ASK WHAT THE EVIDENCE ACTUALLY SUPPORTS — what narrower, more specific scope (population, degree, condition) does the passage or argument actually demonstrate?',
        "SCOPE THE CLAIM TO THAT EVIDENCE — replace the absolute with a precisely qualified version naming the degree, condition, or population.",
        "BUILD IN A GENUINE CONCESSION — honestly note what the qualified claim does NOT say, so its real scope is visible rather than implied.",
        'CHECK THE REVISION KEEPS ITS FORCE — confirm it is still a real, defensible, arguable claim a reader could disagree with, not hedged into vagueness.',
      ],
      example: {
        problem:
          'Revise this overstated claim into a precisely-qualified, more defensible one, using Douglass\'s own qualifying move as a model: "Frederick Douglass proves that all national celebrations of freedom are completely meaningless and every American in his audience was a total hypocrite."',
        solution:
          'Revised: "Douglass argues that for those excluded from it, the Fourth of July\'s promise of liberty rings hollow — not because every American celebrant is a knowing hypocrite, but because a nation\'s founding ideals, however sincerely felt by those they protect, remain empty for those they were never extended to." This keeps Douglass\'s real claim (the celebration\'s hollowness for the excluded) while dropping the indefensible absolutes and honestly conceding that the argument is about a system\'s failure, not a verdict on every individual\'s conscience.',
      },
      relatedLoIds: ['apenglang.nuance-qualification-concession'],
    },
  ],
  pointers: [
    { content: 'Qualification scopes a claim to what the evidence supports ("often," "to a considerable degree") instead of an absolute ("always," "every").', kind: 'tip' },
    { content: 'An overstated claim is WEAKER, not stronger — a single counterexample refutes an absolute; a qualified claim survives scrutiny.', kind: 'tip' },
    { content: 'Genuine concession = honestly naming a limit in the writer\'s OWN claim, not the opponent\'s objection (that\'s the counterargument-rebuttal move).', kind: 'trap' },
    { content: 'Qualification is not hedging: hedging drains a claim of content; qualification keeps it specific and arguable while scoping it precisely.', kind: 'trap' },
    { content: 'Test after qualifying: is there still a clear claim a reader could push back on with evidence? If not, it has been hedged into meaninglessness.', kind: 'trap' },
    { content: 'Precise qualification and honest concession are a learnable route to the AP rubric\'s SOPHISTICATION point.', kind: 'tip' },
  ],
};
