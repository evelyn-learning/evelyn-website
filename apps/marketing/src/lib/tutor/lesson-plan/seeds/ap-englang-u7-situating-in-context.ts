/**
 * AP English Language & Composition — CED Unit 7.3: Situating an Argument
 * in a Broader Context.
 *
 * Builds on 7.2 (complex reasoning): one of the most reliable routes to the
 * AP rubric's SOPHISTICATION point is explicitly connecting an argument to
 * something LARGER than the immediate occasion — a broader idea, a historical
 * pattern, an ongoing stake beyond the specific case at hand. Done well, this
 * is not a generic "in conclusion, this matters to everyone" gesture; it is a
 * SPECIFIC, EARNED connection between the argument just made and the wider
 * frame it belongs to.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself MICRO grain: responseFormat
 * 'free', one sentence, rubric = single 6-point part) this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1. The teaching point is how Lincoln
 * situates a single battlefield dedication within the nation's founding
 * ("Four score and seven years ago... conceived in Liberty") and its future
 * ("a new birth of freedom") — a masterclass in broader-context framing.
 * Quotes below are limited to these short structural phrases.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U7_SITUATING_IN_CONTEXT: LessonPlan = {
  id: 'evelyn.ap.englang.situating-in-context.v1',
  title: 'U7.3 Situating an Argument in a Broader Context',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.situating-in-context',
      description:
        'Connect an argument to a broader idea, history, or stake beyond its immediate occasion with a specific, earned link — not a vague universal gesture — as a route to the AP rubric\'s sophistication point.',
      standard: 'AP-ENGLANG-7.3',
    },
  ],
  prerequisites: [
    'apenglang.complex-reasoning',
    'apenglang.audience-context',
  ],
  followUps: ['apenglang.rhetorical-risk'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between a generic "this matters to everyone" gesture and a specific, earned connection to something larger, before naming "broader context."',
      script:
        "Imagine two students end a persuasive essay about their school's dress code. One writes: 'In conclusion, this issue matters to all of us and shows why rules are important in life.' The other writes: 'This dress-code fight is really the same argument this school has been having since the uniform policy of 2003 — how much individual expression a shared institution can tolerate before it stops being shared.' The first sentence could end literally any essay on any topic — it says nothing specific. The second sentence EARNS its bigger frame: it names a real, specific history the immediate argument belongs to. Sophisticated writers don't just gesture at 'the bigger picture' — they name the SPECIFIC bigger picture their argument is actually part of, and show exactly how it connects.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-broader-context',
      kind: 'concept',
      goal: 'Define what situating an argument in broader context means, distinguish it from vague universalizing, and show the specific move that earns it.',
      keyIdeas: [
        "SITUATING AN ARGUMENT means explicitly connecting it to something larger than its immediate occasion — a historical pattern, a recurring debate, an idea bigger than the specific case, or a stake that outlasts the moment being argued about.",
        "This is NOT the same as a generic universalizing gesture ('this matters to everyone,' 'this shows something about the human condition') — those phrases could close nearly any essay on any topic and add nothing specific. A real broader-context connection is SPECIFIC: it names the particular larger idea, history, or stake, and explains exactly how the immediate argument connects to it.",
        "The AP rubric rewards this because it demonstrates the writer understands the argument's SIGNIFICANCE, not just its content — situating a claim shows the writer sees why the immediate case is worth arguing about at all, beyond itself.",
        "A reliable test: could the broader-context sentence be swapped into a completely different essay on a different topic without changing a word? If yes, it's a generic gesture, not a real connection. A genuine broader-context sentence should be UNTRANSFERABLE — tied specifically to this argument's particular details.",
        "The move usually has two parts: NAME the specific broader frame (a historical moment, a recurring tension, a larger stake) → SHOW precisely how the immediate argument is one instance, continuation, or test of that larger frame — not just an assertion that a connection exists.",
        "Lincoln performs this at both ends of the Gettysburg Address: he opens not with the battle but with the nation's FOUNDING ('Four score and seven years ago our fathers brought forth... a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal'), and closes not with the burial but with the nation's FUTURE ('a new birth of freedom'). A single battlefield dedication is framed as one moment in an arc stretching from 1776 to whatever comes after — that is what makes a two-minute speech about a cemetery read as a statement about the nation itself.",
        "Overreaching in the other direction is also a failure: connecting to a frame so large or unrelated that the link feels forced or unsupported (e.g., an essay on a school policy suddenly invoking 'the meaning of life') is not sophistication — it is a broader claim asserted without being earned by the specific argument that came before it.",
      ],
      vocabulary: [
        { term: 'broader context', definition: "a historical pattern, recurring idea, or larger stake beyond an argument's immediate occasion that the argument connects to." },
        { term: 'earned connection', definition: "a specific, argument-supported link to a broader frame, as opposed to an assertion that a connection merely exists." },
        { term: 'generic universalizing', definition: 'a vague closing gesture ("this matters to everyone") that could transfer unchanged to any essay on any topic — not sophistication.' },
        { term: 'significance', definition: "why an argument's specific case matters beyond itself — what the AP rubric's sophistication point rewards recognizing." },
        { term: 'untransferable sentence', definition: 'a broader-context sentence tied so specifically to an argument\'s particular details it could not be dropped into a different essay unchanged.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-situate-school-argument',
      kind: 'worked_example',
      problem:
        "Take the specific claim 'our school should replace individual locker assignments with shared, flexible storage' and add ONE sentence that situates it in a genuine, specific broader context — modeled on how Lincoln frames a single dedication ceremony within the nation's founding and future (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1).",
      steps: [
        "REJECT THE GENERIC VERSION FIRST. 'This matters because sharing resources is important in life' is a universalizing gesture that could close an essay about literally anything — recycling, carpooling, group projects. Discard it.",
        "ASK WHAT SPECIFIC LARGER FRAME THIS ARGUMENT ACTUALLY BELONGS TO. Not 'sharing in general' — something more precise: schools have repeatedly redesigned physical space (open classrooms in the 1970s, shared computer labs replacing individual typewriters) as their sense of what a 'student' owns individually versus shares collectively has shifted.",
        "NAME THAT FRAME SPECIFICALLY. The recurring institutional question: as schools reorganize physical space, they are continually renegotiating how much of a student's daily environment is individually owned versus collectively provided.",
        "SHOW HOW THIS SPECIFIC ARGUMENT IS ONE INSTANCE OF THAT FRAME — the Lincoln move (founding → this moment → future). Locker reassignment isn't a new kind of question; it's the latest version of a question schools have answered differently every generation.",
        "CHECK THE UNTRANSFERABLE TEST. Could this sentence be dropped into an essay about a completely different topic? No — it names schools, physical space, and the specific ownership-versus-sharing tension. It passes.",
      ],
      answer:
        "Locker reassignment is only the newest version of a question schools have answered differently every generation — from open classrooms in the 1970s to shared computer labs replacing individually-owned typewriters — about how much of a student's daily environment should belong to them alone versus be held in common; today's flexible-storage proposal is simply this era's answer to that same recurring institutional negotiation.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-situate-own-claim',
      kind: 'try_yourself',
      problem:
        "Take this specific claim: 'Public libraries should expand their free tool-lending programs (letting patrons borrow drills, sewing machines, and other equipment, not just books).' Write ONE sentence that situates this claim in a genuine, SPECIFIC broader context — a real historical pattern, recurring tension, or larger stake this specific proposal connects to — rather than a generic universalizing gesture that could close any essay on any topic.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'situating',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence names a SPECIFIC broader frame (e.g. the library's historical evolution from a lending institution for books alone to a wider public commons for resources people can't easily afford individually, or the recurring tension between what a community owns collectively versus what each household must buy for itself) AND shows precisely how the tool-lending proposal is a specific instance or continuation of that frame — passing the untransferable test (the sentence could not be dropped, unchanged, into an essay on an unrelated topic). Partial credit (2-4) for a sentence that names a frame but only loosely or generically connects it to the specific proposal, or that gestures at 'community' or 'access' without a specific historical/institutional frame. No credit for a generic universalizing sentence ('this shows sharing is important' / 'this matters to everyone') with no specific frame named.",
              modelResponse:
                "Tool-lending is simply the latest chapter in a library's long redefinition of what a community should own together rather than each household buying alone — the same logic that turned libraries from book-only lenders into providers of internet access and meeting space now extends naturally to the expensive, occasionally-used equipment few individual families can justify purchasing.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-generic-universalizing',
      kind: 'misconception_check',
      question:
        'A student closes an essay arguing for expanded library tool-lending with: "In the end, this shows that community and sharing are important values that we should all remember." Does this successfully situate the argument in a broader context?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating a GENERIC UNIVERSALIZING gesture — a sentence that could close nearly any essay on any topic unchanged — as if it were a specific, earned broader-context connection.',
          correctsTo:
            "No — apply the untransferable test: could this exact sentence close an essay about recycling, or carpooling, or group projects, without changing a word? Yes, easily — which means it names no SPECIFIC frame this particular argument belongs to. A real broader-context connection would name something concrete and specific: the library's historical shift from lending only books to lending internet access, meeting space, and now tools, as part of an ongoing redefinition of what a community owns collectively versus what each household buys alone. The fix: replace the vague abstraction ('community and sharing are important') with the SPECIFIC historical pattern or institutional tension the argument is actually one instance of.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Situating an argument means connecting it to a SPECIFIC broader idea, history, or stake — not a vague, generic gesture that could close any essay on any topic.",
        "The untransferable test: if a broader-context sentence could be dropped unchanged into an essay on a different topic, it isn't specific enough to count as sophistication.",
        "The move has two parts: name the specific larger frame, then show precisely how the immediate argument is one instance of it — not just assert that a connection exists.",
        "Lincoln's Gettysburg Address frames a single battlefield dedication within the nation's founding ('conceived in Liberty') and its future ('a new birth of freedom') — a masterclass in earned broader-context framing.",
        "Overreaching to a frame too large or unrelated is also a failure — the connection must be earned by the specific argument, not merely asserted.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.3',
    cedTitle: 'Situating an Argument in a Broader Context',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
