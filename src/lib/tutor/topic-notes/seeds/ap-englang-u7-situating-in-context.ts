/**
 * AP English Language & Composition — Unit 7 CED 7.3: Situating an Argument
 * in a Broader Context.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.situating-in-context.v1`). Builds on 7.2 (complex
 * reasoning): one reliable route to the AP rubric's SOPHISTICATION point is
 * explicitly connecting an argument to something LARGER than the immediate
 * occasion — a SPECIFIC, EARNED connection, not a generic universalizing
 * gesture.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863). The
 * teaching point is how Lincoln situates a single battlefield dedication
 * within the nation's founding ("Four score and seven years ago... conceived
 * in Liberty") and its future ("a new birth of freedom"). Quotes are limited
 * to these short structural phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SITUATING_IN_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.situating-in-context.v1',
  course: 'AP English Language',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Situating an Argument in a Broader Context',
  planId: 'evelyn.ap.englang.situating-in-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.situating-in-context.v1' }],
  theory: [
    {
      loId: 'apenglang.situating-in-context',
      kind: 'definition',
      title: 'broader context',
      content:
        "A historical pattern, recurring idea, or larger stake beyond an argument's immediate occasion that the argument connects to. Situating an argument means explicitly connecting it to something larger than the immediate occasion — not just the specific case at hand.",
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'definition',
      title: 'generic universalizing',
      content:
        'A vague closing gesture ("this matters to everyone," "this shows something about the human condition") that could transfer unchanged to any essay on any topic — not sophistication. These phrases add nothing specific because they say nothing specific.',
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'definition',
      title: 'earned connection',
      content:
        "A specific, argument-supported link to a broader frame, as opposed to an assertion that a connection merely exists. An earned connection names the particular larger idea, history, or stake, and explains exactly how the immediate argument connects to it.",
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'framework',
      title: 'the two-part move',
      content:
        'The move usually has two parts: NAME the specific broader frame (a historical moment, a recurring tension, a larger stake) → SHOW precisely how the immediate argument is one instance, continuation, or test of that larger frame — not just an assertion that a connection exists.',
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'strategy',
      title: 'the untransferable test',
      content:
        "A reliable test: could the broader-context sentence be swapped into a completely different essay on a different topic without changing a word? If yes, it's a generic gesture, not a real connection. A genuine broader-context sentence should be UNTRANSFERABLE — tied specifically to this argument's particular details.",
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'strategy',
      title: 'Lincoln\'s founding-to-future frame',
      content:
        'Lincoln performs this at both ends of the Gettysburg Address: he opens not with the battle but with the nation\'s FOUNDING ("Four score and seven years ago our fathers brought forth... a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal"), and closes not with the burial but with the nation\'s FUTURE ("a new birth of freedom"). A single battlefield dedication is framed as one moment in an arc stretching from 1776 to whatever comes after.',
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'strategy',
      title: 'why the AP rubric rewards this',
      content:
        "The AP rubric rewards situating an argument in broader context because it demonstrates the writer understands the argument's SIGNIFICANCE, not just its content — showing why the immediate case is worth arguing about at all, beyond itself, is a different (and harder) skill than making the immediate case well.",
    },
    {
      loId: 'apenglang.situating-in-context',
      kind: 'trap',
      title: 'overreaching to an unrelated frame',
      content:
        'Overreaching in the other direction is also a failure: connecting to a frame so large or unrelated that the link feels forced or unsupported (e.g., an essay on a school policy suddenly invoking "the meaning of life") is not sophistication — it is a broader claim asserted without being earned by the specific argument that came before it.',
    },
  ],
  methods: [
    {
      title: 'Situate a specific claim in a genuine broader context',
      when_to_use:
        'Use to add a sophistication-earning sentence to a claim or thesis, once the immediate argument is already established and defensible.',
      steps: [
        'REJECT THE GENERIC VERSION FIRST — identify and discard any universalizing gesture that could close an essay about a different topic unchanged.',
        'ASK WHAT SPECIFIC LARGER FRAME THIS ARGUMENT ACTUALLY BELONGS TO — not a vague abstraction, but a precise historical pattern, recurring tension, or institutional stake.',
        'NAME THAT FRAME SPECIFICALLY, in concrete terms tied to the subject matter.',
        'SHOW HOW THIS SPECIFIC ARGUMENT IS ONE INSTANCE OF THAT FRAME — not a new kind of question, but the latest version of a recurring one.',
        'CHECK THE UNTRANSFERABLE TEST — confirm the sentence could not be dropped into an essay on a different topic without changing a word.',
      ],
      example: {
        problem:
          "Take the specific claim 'our school should replace individual locker assignments with shared, flexible storage' and add ONE sentence that situates it in a genuine, specific broader context, modeled on how Lincoln frames a single dedication ceremony within the nation's founding and future.",
        solution:
          "Locker reassignment is only the newest version of a question schools have answered differently every generation — from open classrooms in the 1970s to shared computer labs replacing individually-owned typewriters — about how much of a student's daily environment should belong to them alone versus be held in common; today's flexible-storage proposal is simply this era's answer to that same recurring institutional negotiation.",
      },
      relatedLoIds: ['apenglang.situating-in-context'],
    },
  ],
  pointers: [
    { content: 'Situating means connecting to a SPECIFIC broader idea, history, or stake — not a vague, generic gesture that could close any essay.', kind: 'tip' },
    { content: 'Untransferable test: if a broader-context sentence could be dropped unchanged into a different essay, it isn\'t specific enough.', kind: 'trap' },
    { content: 'Two-part move: name the specific larger frame, then show precisely how the immediate argument is one instance of it.', kind: 'tip' },
    { content: '"This shows community/sharing/freedom is important" is a generic universalizing gesture — no credit without a named specific frame.', kind: 'trap' },
    { content: 'Lincoln\'s founding-to-future frame ("conceived in Liberty" → "a new birth of freedom") is the model for earned broader-context framing.', kind: 'tip' },
    { content: 'Overreaching to a frame too large or unrelated (e.g. "the meaning of life") is also a failure — the connection must be earned.', kind: 'trap' },
  ],
};
