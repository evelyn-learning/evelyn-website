/**
 * AP English Language & Composition — CED Unit 8.3: Qualifying a Position
 * with Sources.
 *
 * Builds on 8.2 (handling sources that disagree with EACH OTHER): here the
 * writer already holds ONE position, and the sophisticated move is choosing
 * a source specifically BECAUSE it complicates that position — narrowing
 * its scope, adding a condition, or conceding a limit — rather than treating
 * every source as either support or threat. This is Unit 7's single-source
 * qualification/concession skill (apenglang.nuance-qualification-concession)
 * applied specifically to synthesis: a SOURCE, not just a hedge sentence,
 * does the qualifying. The trap this topic targets is the overclaim — a
 * thesis stated in absolute terms that a single well-chosen source can
 * immediately falsify.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself MICRO grain: responseFormat
 * 'free', one sentence, single rubric part worth 6) this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1. The teaching point is Lincoln's own
 * concession that the nation's work remains "unfinished" — a genuine,
 * source-backed limit on any claim that fighting for liberty settles the
 * matter permanently. Patrick Henry's 1775 speech is discussed in prose as
 * the claim being qualified. Quotes are limited to the short structural
 * phrases already used as anchor evidence for these speeches elsewhere in
 * the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U8_QUALIFYING_WITH_SOURCES: LessonPlan = {
  id: 'evelyn.ap.englang.qualifying-with-sources.v1',
  title: 'U8.3 Qualifying a Position with Sources',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.qualifying-with-sources',
      description:
        "Use a source to qualify the writer's own claim — narrowing its scope, adding a condition, or conceding a genuine limit — rather than using sources only as one-sided support, producing a more defensible, source-backed position.",
      standard: 'AP-ENGLANG-8.3',
    },
  ],
  prerequisites: ['apenglang.competing-perspectives', 'apenglang.nuance-qualification-concession'],
  followUps: ['apenglang.sophistication-in-synthesis'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between a claim that ignores its own limits and one that pre-empts them.',
      script:
        "Imagine a friend tells you 'this restaurant has the best food in the city' versus 'this restaurant has the best noodles in the city, though their desserts are forgettable.' The second claim is actually MORE persuasive, not less, because it sounds like someone who's actually eaten there and thought about it — the limit doesn't weaken the recommendation, it earns your trust. A thesis works the same way. Using a source to admit a genuine limit on your own claim — not abandoning the claim, just narrowing or conditioning it — makes the claim you DO keep sound like it survived real scrutiny instead of never having faced any.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qualifying-with-a-source',
      kind: 'concept',
      goal: "Define qualification as narrowing rather than retracting a claim, and show how a source (not just a hedge word) can do the qualifying.",
      keyIdeas: [
        "QUALIFYING a claim means narrowing its scope, adding a condition, or acknowledging a limit — it is NOT abandoning the claim. \"Fighting secures liberty, though only as an ongoing, incomplete process\" is a qualified claim, not a retraction.",
        "A SOURCE can qualify a writer's own claim just as easily as it can support it. The sophisticated move is choosing a source specifically BECAUSE it complicates your thesis, and showing you've accounted for the complication rather than ignored it.",
        "QUALIFYING WITH A SOURCE differs from 8.2's handling-disagreement move: in 8.2 two SOURCES disagree with each other; here, the WRITER already holds one position, and uses a source to admit a genuine limit on how far, how completely, or how universally that position holds.",
        "THE OVERCLAIM TRAP: stating a thesis in absolute terms (\"liberty was fully and finally secured by...\") that a single well-chosen source can immediately falsify — inviting exactly the rebuttal a qualified thesis would have pre-empted.",
        "SIGNAL LANGUAGE for qualification — \"though,\" \"except,\" \"only insofar as,\" \"in practice, however\" — shows a reader the writer anticipated and addressed the limit, rather than having missed it.",
        "Qualifying with a source is NOT conceding the whole argument — a well-qualified thesis still makes a real, defensible claim; it is simply accurate about its own scope instead of overstating it.",
        "AP graders reward this move explicitly as the sophistication point: a claim that anticipates and addresses its own limit, using a source to do so, reads as more mature than a claim that pretends no complication exists.",
      ],
      vocabulary: [
        { term: 'qualification', definition: "narrowing a claim's scope or adding a condition, without abandoning the claim." },
        { term: 'scope', definition: 'how far, how completely, or for whom a claim is being asserted to hold true.' },
        { term: 'overclaim', definition: 'a thesis stated in absolute terms that a single well-chosen source can immediately falsify.' },
        { term: 'signal phrase', definition: "language (\"though,\" \"except,\" \"only insofar as\") showing a writer anticipated a limit on their own claim." },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-qualify-henry-with-lincoln',
      kind: 'worked_example',
      problem:
        "A student's synthesis thesis claims: \"Fighting for liberty, as Patrick Henry demanded in 1775, secures it once and for all.\" (Henry's speech is discussed here in prose — this segment type carries no passageId field; the resolved text is evelyn.passage.henry-give-me-liberty.v1.) Use Lincoln's 1863 Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1) to QUALIFY this thesis rather than abandon it.",
      steps: [
        "IDENTIFY THE OVERCLAIM. \"Secures it once and for all\" is an absolute claim that a single later source can falsify — it leaves no room for anything happening AFTER 1775 to matter.",
        "FIND THE SOURCE THAT COMPLICATES IT. Lincoln, addressing the nation eighty-eight years after Henry, describes the nation's task as \"unfinished work\" and calls for \"increased devotion\" — direct evidence that fighting for liberty in 1775 did not, in fact, settle the matter permanently.",
        "DECIDE WHAT KIND OF LIMIT THIS IS. Not a full rebuttal of Henry's claim — fighting IS how liberty gets secured in a moment of crisis — but a limit on its SCOPE: it doesn't secure liberty permanently or completely for everyone the promise claims to cover.",
        "REWRITE THE THESIS AS A QUALIFIED CLAIM. \"Fighting for liberty, as Henry demanded in 1775, secures it only provisionally — Lincoln's 1863 admission that the nation's work remained 'unfinished' shows that each generation has had to renew, not simply inherit, that victory.\"",
        "VERIFY THE QUALIFIED THESIS IS STILL A REAL CLAIM. It still asserts something arguable — fighting is how liberty gets secured, and each generation must do it again — it is a sharper, source-backed version of the original claim, not a retreat into \"it's complicated.\"",
      ],
      answer:
        "The overclaim (\"once and for all\") is falsified by Lincoln's own 1863 admission that the nation's work remained \"unfinished.\" The qualified thesis keeps Henry's core claim — fighting secures liberty in a moment of crisis — while narrowing its scope with Lincoln's evidence: that securing is provisional, requiring renewal by each later generation rather than a single, final victory.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-qualify-micro',
      kind: 'try_yourself',
      problem:
        "You are arguing the thesis: \"Patrick Henry's 1775 call to arms shows that liberty is secured through decisive action.\" Using Lincoln's Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1) — specifically his description of the nation's \"unfinished work\" — write ONE sentence that QUALIFIES this thesis (narrows its scope or adds a condition, using Lincoln's evidence) WITHOUT abandoning the original claim.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'qualification',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence keeps the original claim's core (decisive action secures liberty) intact while adding a genuine, source-backed limit drawn from Lincoln's \"unfinished work\" (e.g. that securing liberty is provisional, incomplete, or subject to renewal rather than final) — using signal language that shows the limit was deliberately addressed, not overlooked. Partial credit (3-4) for a sentence that references Lincoln's evidence but either drops the original claim entirely (a full retraction, not a qualification) or states the limit too vaguely to see how it narrows the thesis's scope. Partial credit (1-2) for a sentence that merely restates the original claim with no real qualification, or that cites Lincoln's evidence without connecting it to a specific limit on the thesis. No credit for a sentence with no source-backed limit at all, or one that misstates/misquotes Lincoln's evidence.",
            modelResponse:
              "Henry's call to arms shows that decisive action can secure liberty in a moment of crisis, though Lincoln's admission — nearly a century later — that the nation's work remained \"unfinished\" shows that such action secures liberty only provisionally, not permanently or completely.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-qualification-as-retraction',
      kind: 'misconception_check',
      question:
        'A student says: "Since Lincoln\'s speech shows my thesis has a limit, I guess my thesis is just wrong — I should throw it out and argue something else." Is qualifying a thesis the same as abandoning it?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Conflating QUALIFICATION (narrowing scope, adding a condition) with RETRACTION (abandoning the claim entirely) — treating any acknowledged limit as proof the whole thesis is wrong.',
          correctsTo:
            "No — finding a genuine limit on a thesis is a reason to NARROW it, not throw it out. The test: remove the qualifying clause from your rewritten thesis — is the original claim's core still standing, just less exposed to an obvious counterexample? If Henry's claim becomes \"fighting secures liberty, though only provisionally\" instead of \"fighting secures liberty once and for all,\" the core idea (fighting secures liberty) survives — it's just now accurate about its own scope. A thesis that gets qualified using real evidence is usually STRONGER and more defensible than the unqualified version, not weaker, because it has already accounted for the objection a reader would otherwise raise.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Qualifying a claim means narrowing its scope or adding a condition — not abandoning the claim.',
        "A source can qualify the writer's OWN claim just as well as it can support it — choose a source because it complicates your thesis, then show you've accounted for it.",
        'The overclaim trap: an absolute thesis a single well-chosen source can immediately falsify.',
        'Signal language ("though," "only insofar as") shows a reader the limit was anticipated, not missed.',
        'A well-qualified thesis is still a real, defensible claim — it is sharper and harder to rebut, not weaker.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.3',
    cedTitle: 'Qualifying a Position with Sources',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
