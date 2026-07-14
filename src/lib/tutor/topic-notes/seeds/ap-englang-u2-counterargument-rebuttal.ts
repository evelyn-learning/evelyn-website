/**
 * AP English Language & Composition — Unit 2 CED 2.4: Counterargument,
 * Concession, and Rebuttal.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.counterargument-rebuttal.v1`). Covers naming a real
 * counterargument (not a straw man), conceding what is genuinely true in it,
 * and rebutting without abandoning that concession.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775) — his handling of the weakness objection
 * is the clearest concession-then-rebuttal move in the unit's anchor texts.
 * Quotes are limited to short structural phrases already used elsewhere in
 * the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_COUNTERARGUMENT_REBUTTAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.counterargument-rebuttal.v1',
  course: 'AP English Language & Composition',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Counterargument, Concession, and Rebuttal',
  planId: 'evelyn.ap.englang.counterargument-rebuttal.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.counterargument-rebuttal.v1' }],
  theory: [
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'definition',
      title: 'counterargument',
      content:
        'The strongest reasonable objection a thoughtful opponent could raise against a claim — not a weak, easily-dismissed version of the opposite view (a STRAW MAN), which persuades nobody because any alert reader can see it\'s been rigged to lose.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'definition',
      title: 'concession',
      content:
        'Granting that part of the counterargument has real merit. It costs the writer nothing to admit a true point, and conceding it — rather than denying it — is what earns the writer credibility (ethos) to make the rebuttal that follows actually land.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'definition',
      title: 'rebuttal',
      content:
        'The answer to a counterargument that explains why the position still holds despite a conceded true point — without abandoning the concession. A real cost is outweighed by a larger benefit, or a real problem has a specific, named solution.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'framework',
      title: 'the reliable shape: name, concede, rebut',
      content:
        'NAME the counterargument specifically (not vaguely) → CONCEDE what\'s genuinely true in it → REBUT by explaining why the position still holds despite that truth. Skipping the concession and rushing to rebuttal reads as dismissive; skipping the rebuttal and only conceding reads as abandoning the claim.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'trap',
      title: 'the straw man',
      content:
        'Inventing a weak version of the opposing view that\'s easy to knock down, instead of engaging the strongest real version. A rebuttal only earns credit for defeating an objection a real opponent would actually make.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'trap',
      title: 'conceding too much',
      content:
        'Granting so much ground that the rebuttal which follows feels like an afterthought, leaving the reader more persuaded by the counterargument than by the writer\'s claim.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'trap',
      title: 'vague dismissal',
      content:
        'Gesturing at an unnamed objection ("some people might complain... but they\'re wrong") names no specific counterargument, concedes nothing, and asserts rather than rebuts. This is the straw man in its vaguest form: an opponent so undefined they can\'t actually be answered.',
    },
    {
      loId: 'apenglang.counterargument-rebuttal',
      kind: 'rhetorical-device',
      title: 'Henry concedes before he reframes',
      content:
        '"They tell us, sir, that we are weak" concedes the real fact of relative military weakness rather than denying it, then rebuts by reframing the terms of the comparison — "when shall we be stronger?" and the numeric/providential appeal that follows — so the conceded weakness no longer determines the outcome.',
    },
  ],
  methods: [
    {
      title: 'Handle a counterargument: name, concede, rebut',
      when_to_use:
        'Use once a line of reasoning (2.3) is in place and the essay needs to engage the strongest objection a thoughtful reader would raise, rather than ignore it.',
      steps: [
        'NAME THE COUNTERARGUMENT SPECIFICALLY — the real, strongest version, not a straw man.',
        'CONCEDE WHAT IS TRUE, without hedging — grant the real cost or fact plainly.',
        'REFRAME THE TERMS OF THE COMPARISON — ask what the alternative (not changing) actually costs.',
        'REBUT WITH A SPECIFIC ANSWER, not just a reassertion of the original claim — name how the conceded cost is actually managed or outweighed.',
        'END ON THE REBUTTAL so the paragraph doesn\'t trail off on the opponent\'s point.',
        'LINK BACK TO THE CLAIM, tying the rebuttal to why the original position still holds.',
      ],
      example: {
        problem:
          "Build one body paragraph handling the strongest counterargument to the position (high schools should push start times to 8:30 a.m. or later): that shifting start times later creates real, costly logistics conflicts with athletics and bus schedules.",
        solution:
          "The strongest objection is a real one: shifting the school day compresses the daylight window for athletics practice and complicates multi-school bus routes, and some districts have genuinely had to renegotiate practice times and bus contracts. But conceding that cost is real is not the same as conceding it should decide the outcome — keeping the earlier start time doesn't make the logistics problem vanish, it trades a one-time, solvable scheduling cost for an ongoing, unsolved safety and academic cost. Districts that have made the shift have handled the logistics through staggered multi-tier bus routes and adjusted practice-start times. A real but solvable inconvenience does not outweigh a real and currently unsolved harm.",
      },
      relatedLoIds: ['apenglang.counterargument-rebuttal'],
    },
  ],
  pointers: [
    { content: 'A counterargument is the strongest reasonable objection a real opponent would raise — a straw man persuades nobody.', kind: 'tip' },
    { content: 'A concession honestly grants what\'s true; conceding a real point builds credibility rather than losing the argument.', kind: 'tip' },
    { content: 'A rebuttal answers the counterargument WITHOUT abandoning the concession.', kind: 'tip' },
    { content: 'Reliable shape: name specifically → concede honestly → rebut with a specific answer, ending on the rebuttal.', kind: 'tip' },
    { content: 'Watch for two failures: the straw man (a weak fake opponent) and conceding too much (the rebuttal reads as an afterthought).', kind: 'trap' },
    { content: '"Some people might complain, but they\'re wrong" names no real objection and concedes nothing — it\'s vague dismissal, not rebuttal.', kind: 'trap' },
  ],
};
