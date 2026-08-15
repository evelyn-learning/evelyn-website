/**
 * AP English Language & Composition — Unit 5 CED 5.4: Organizing an
 * Argument for Effect.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.organizing-for-effect.v1`). Closes out Unit 5: the
 * ORDER in which an argument's points are sequenced is itself a rhetorical
 * choice that produces an effect on the reader, not just a container for
 * content.
 *
 * Anchor text referenced in the method's example: Patrick Henry's "Give Me
 * Liberty or Give Me Death," which withholds its climactic declaration
 * until after refuting the "weakness" objection. Lincoln's chronological
 * past-present-future structure is referenced as a second organizing
 * pattern. Quotes are limited to short, structural rhetorical phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_ORGANIZING_FOR_EFFECT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.organizing-for-effect.v1',
  course: 'AP English Language & Composition',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Organizing an Argument for Effect',
  planId: 'evelyn.ap.englang.organizing-for-effect.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.organizing-for-effect.v1' }],
  theory: [
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'definition',
      title: 'weakest-to-strongest',
      content:
        'An organizing pattern that saves the most persuasive point for last, building momentum toward a climax. A reader who has already accepted several minor points is primed to accept the strongest, climactic point last.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'definition',
      title: 'strongest-first',
      content:
        'An organizing pattern that leads with the best point to win over a skeptical reader early, trading momentum for early credibility.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'definition',
      title: 'problem-solution structure',
      content:
        'Establishing a problem before proposing a fix, so the fix lands as necessary rather than arbitrary.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'framework',
      title: 'organizing for effect',
      content:
        'The ORDER in which an argument presents its points is itself a rhetorical choice, not a neutral container. The same set of points, reordered, can produce a different effect on the reader — reordering a real argument is a genuine revision decision, not cosmetic tidying.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'strategy',
      title: 'chronological order can itself argue',
      content:
        "Lincoln orders the Gettysburg Address past (the founding) → present (the war as a test of that founding) → future (the unfinished work), so the ORDER argues that the present moment is a test the past set up, and the future is what the present now demands. Reordering would break that logic, not just the timeline.",
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'strategy',
      title: 'weakest-to-strongest builds momentum',
      content:
        "Henry's speech saves its most repetitive, declarative climax — \"we must fight! I repeat it, sir, we must fight!\" — for AFTER he has already dismantled the \"we are weak\" objection and established there is \"no longer any room for hope.\" Opening with the climax would leave nothing left to build toward.",
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'trap',
      title: 'directness is not the same as persuasiveness',
      content:
        'Equating bluntness or directness with persuasive strength ignores that a climactic order builds EARNED momentum a blunt opening cannot. Opening with the conclusion asks a still-skeptical audience to accept it before hearing the reasoning that makes it feel necessary.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'strategy',
      title: 'reordering is a real revision decision',
      content:
        'Moving the strongest point earlier trades momentum for early credibility with a skeptical audience; moving it later trades early credibility for a stronger finish. A writer should choose deliberately based on how resistant the audience is likely to be.',
    },
    {
      loId: 'apenglang.organizing-for-effect',
      kind: 'strategy',
      title: 'the test for organization-for-effect',
      content:
        'Ask what would be LOST if the points were shuffled into a different order. If nothing would be lost, the order isn\'t doing rhetorical work yet — it\'s still just a list.',
    },
  ],
  methods: [
    {
      title: "Evaluate and choose an organizing pattern for an argument's points",
      when_to_use:
        "Use when analyzing why an argument's points appear in a given sequence, or when deciding how to sequence points in a draft.",
      steps: [
        'LIST THE POINTS in the order the argument presents them.',
        'NAME THE ORGANIZING PATTERN — weakest-to-strongest, strongest-first, chronological, or problem-solution.',
        'ASK WHAT COMES BEFORE THE CLIMAX (OR KEY POINT) and how it sets that point up.',
        'ASK WHAT OPENING WITH THAT POINT INSTEAD WOULD COST — what reasoning would the audience be asked to accept before earning it?',
        'EXPLAIN THE EFFECT OF THE ACTUAL ORDER — why does this sequence make the argument land harder than the same points in a different order would?',
      ],
      example: {
        problem:
          "Explain why Patrick Henry withholds his climactic repeated declaration \"we must fight!\" until AFTER he has already refuted the \"we are weak\" objection, rather than opening the speech with it.",
        solution:
          "By placing the declarative climax after dismantling the illusion of hope and cataloguing the failure of peaceful appeals, Henry makes \"we must fight!\" land as the one conclusion left standing rather than an opening demand — the weakest-to-strongest order is itself doing persuasive work that the same words in a different sequence would not do.",
      },
      relatedLoIds: ['apenglang.organizing-for-effect'],
    },
  ],
  pointers: [
    { content: 'Order is a rhetorical choice, not a neutral container — reordering the same points changes the effect.', kind: 'tip' },
    { content: 'Weakest-to-strongest builds momentum toward a climax; strongest-first wins over a skeptical reader early.', kind: 'tip' },
    { content: 'Chronological order can itself argue a relationship (Lincoln: past founds it, present tests it, future demands it).', kind: 'tip' },
    { content: 'Directness is not the same as persuasiveness — a well-ordered build can out-persuade a blunt, unearned opening.', kind: 'trap' },
    { content: 'Problem-solution order makes a fix feel necessary rather than arbitrary.', kind: 'tip' },
    { content: "Test: ask what would be LOST if the points were shuffled into a different order. If nothing, the order isn't doing rhetorical work yet.", kind: 'tip' },
  ],
};
