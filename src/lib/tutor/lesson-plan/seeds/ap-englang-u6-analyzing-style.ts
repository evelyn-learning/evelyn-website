/**
 * AP English Language & Composition — CED Unit 6.4: Analyzing Style in
 * Rhetorical Analysis.
 *
 * Unit 6's capstone: having learned syntax (6.1), diction/connotation (6.2),
 * and figurative language/schemes (6.3) as separate lenses, students now
 * integrate all three into a full rhetorical-analysis LINE OF REASONING
 * (Unit 4.4) — tracing how a writer's STYLE choices, not just their claims,
 * build cumulatively across a text, and often escalate in lockstep with the
 * argument itself.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself MICRO grain:
 * responseFormat 'free', single rubric part worth 6).
 *
 * Anchor text for concept/worked example: Patrick Henry's "Give Me Liberty
 * or Give Me Death" — evelyn.passage.henry-give-me-liberty.v1 — whose style
 * visibly tightens (long, reflective, metaphor-laden opening → short,
 * repeated, unadorned closing) in step with the argument's own escalation.
 * Try-yourself uses Abraham Lincoln's Gettysburg Address —
 * evelyn.passage.lincoln-gettysburg.v1 — for passage variety. Quotes are
 * limited to short structural/rhetorical phrases per content-safety
 * guidance.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U6_ANALYZING_STYLE: LessonPlan = {
  id: 'evelyn.ap.englang.analyzing-style.v1',
  title: 'U6.4 Analyzing Style in Rhetorical Analysis',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.analyzing-style',
      description:
        "Integrate syntax, diction/connotation, and figurative-language/scheme analysis into a single, cumulative rhetorical-analysis line of reasoning, showing how a writer's style choices — not just their claims — build toward and often escalate alongside the text's overall purpose.",
      standard: 'AP-ENGLANG-6.4',
    },
  ],
  prerequisites: ['apenglang.figurative-language-schemes', 'apenglang.analyzing-line-of-reasoning'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Extend the line-of-reasoning idea from claims to style, before naming "integrated style analysis."',
      script:
        "You already know a strong essay traces how a writer's CLAIMS build on each other. But claims aren't the only thing that builds across a text — a writer's STYLE can escalate too: sentences get shorter, diction gets starker, a repeated pattern tightens its grip — and that stylistic escalation is often what makes the final claim feel inevitable, not just correct. Today we stop analyzing syntax, diction, and figurative language as separate boxes to check off, and learn to trace how they work TOGETHER, across a whole passage, in service of one argument.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-integrated-style',
      kind: 'concept',
      goal: 'Define integrated style analysis, explain co-escalation of style and argument, and name the checklist-essay trap this capstone skill corrects.',
      keyIdeas: [
        "A full rhetorical-analysis essay doesn't analyze syntax, diction, and figurative language in separate, disconnected paragraphs — it shows how MULTIPLE style choices work TOGETHER at the same moment to serve ONE claim about the writer's purpose.",
        "STYLE CAN CO-ESCALATE WITH ARGUMENT: as a writer's line of reasoning builds (concession → pivot → escalation, from 4.4), the STYLE often escalates in the same direction — sentences shortening, diction intensifying, repetition tightening — reinforcing the argument's climb, not just decorating it.",
        "To integrate style into a line of reasoning: at each major stage of the argument, ask not only \"what is the writer claiming here?\" but \"what style choices (syntax + diction + figurative language) are doing work at this exact moment, and how do they change as the argument builds?\"",
        "A strong integrated paragraph names the stage's claim, THEN shows a style choice enacting or reinforcing that claim — not a style observation floating free of the argument — THEN explains why that choice's escalation (compared to earlier or later stages) serves the writer's overall purpose.",
        "The common trap at this capstone level: writing three separate mini-analyses (one on syntax, one on diction, one on a metaphor) that never connect to each other or to the essay's throughline — a \"checklist\" essay, not an integrated line of reasoning.",
        "The strongest AP Lang responses don't just catalog devices — they show a writer's style tightening or shifting in lockstep with the argument's stakes, and explain that co-escalation as evidence of deliberate design, not coincidence.",
      ],
      vocabulary: [
        { term: 'integrated style analysis', definition: "explaining how multiple style choices (syntax, diction, figurative language) work together, at the same moment, to serve one claim." },
        { term: 'co-escalation', definition: "a writer's style intensifying (shorter sentences, starker diction, tighter repetition) in step with the argument's own escalation." },
        { term: 'checklist essay', definition: 'the trap of analyzing separate devices in isolation without connecting them to each other or to the overall purpose.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-integrated',
      kind: 'worked_example',
      problem:
        "Trace how Henry's STYLE — not just his claims — escalates across the speech (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1), from the opening's measured, metaphor-laden sentence through the closing rhetorical-question burst, and connect that stylistic escalation to the argument's overall arc toward \"we must fight.\"",
      steps: [
        "STAGE 1 — STYLE AT THE OPENING. Henry opens with a long, measured sentence and a metaphor of gentle self-deception (\"the illusions of hope,\" \"the song of that siren\") — style that mirrors the content at this stage: an audience still comfortable, still deliberating, still able to enjoy a \"song.\"",
        "STAGE 2 — STYLE AT THE CLIMACTIC REPETITION. As the argument turns (\"There is no longer any room for hope\"), style tightens: the identical clause is repeated without variation — \"we must fight! I repeat it, sir, we must fight!\" — the earlier, songlike syntax has collapsed into a hammering, single-clause repetition.",
        "STAGE 3 — STYLE IN THE FINAL PARAGRAPH. By the close, syntax has shortened further into a rapid burst of exclamations and short rhetorical questions — \"The war is actually begun!... Why stand we here idle?\" — barely a pause between clauses.",
        "NAME THE CO-ESCALATION. As Henry's argument moves from cautious concession (peace might still be possible) to urgent demand (fight now), his SYNTAX moves in lockstep — from long, musical, comparison-laden sentences to short, repeated, unadorned ones. The sentences themselves grow more urgent as the argument does.",
        "EXPLAIN WHY THIS INTEGRATION — NOT ANY ONE DEVICE ALONE — IS THE STRONGEST EVIDENCE OF DESIGN. If Henry's style had stayed uniformly long and elegant throughout, the growing urgency of his CLAIM would feel undercut by a mismatched, leisurely delivery; instead the syntax tightening in step with the claim signals that the growing urgency isn't just asserted — it is ENACTED at the level of the sentence itself.",
        "STATE THE INTEGRATED ANALYTICAL CLAIM. Henry's argument that peaceful means are exhausted and only fighting remains is reinforced — not merely accompanied — by a syntax that itself moves from expansive and reflective to clipped and repetitive, so that by the final \"give me liberty, or give me death,\" the sentence's own brevity performs the finality of the choice it names.",
      ],
      answer:
        "Henry's style co-escalates with his argument: the opening's long, metaphor-laden sentence (\"the illusions of hope,\" \"the song of that siren\") matches an audience still comfortable enough to deliberate; the climactic repetition (\"we must fight! I repeat it, sir, we must fight!\") tightens the syntax into a hammering single clause as the argument turns; and the closing burst of short exclamations and questions (\"The war is actually begun!... Why stand we here idle?\") mirrors the argument's final urgency. Because style and claim escalate together rather than separately, the growing urgency isn't merely asserted — it is enacted at the level of the sentence itself, making the closing choice, \"give me liberty, or give me death,\" feel like the argument's own inevitable conclusion.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-micro-lincoln-integrated',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE sentence that is a defensible thesis integrating AT LEAST TWO different style elements (syntax, diction/connotation, or figurative language/scheme) into a single claim about how Lincoln's style serves his purpose across the address — not simply listing two devices, but showing how they work TOGETHER toward one effect.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'integrated-thesis',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the thesis is defensible, names two distinct style elements (e.g. the periodic syntax withholding the sentence's resolution, AND the tricolon \"of the people, by the people, for the people\") and explains how they work TOGETHER — not as a list — to serve one purpose (e.g. making the call to \"increased devotion\" feel like the inevitable culmination of the address rather than a separate appeal). Partial credit for naming two elements without integrating them into one claim (a list, not a single thesis), or for integrating only one style element with a purpose-level claim. No credit for a thesis that only names devices without a purpose-level claim, or that summarizes content.",
            modelResponse:
              "By building toward its climax through a single withheld periodic sentence packed with an insistent, thrice-repeated \"of the people, by the people, for the people,\" Lincoln's syntax itself performs the very unity and permanence of government the closing words claim, making the demand for \"increased devotion\" feel like an inevitable consequence of the sentence's own structure rather than a separate plea.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-checklist-essay',
      kind: 'misconception_check',
      question:
        'A student writes: "This speech uses syntax, and it also uses diction, and it also uses a metaphor." Is this an integrated style analysis?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Writing a "checklist essay" — enumerating separate devices in isolated silos without connecting them to each other or to one overall claim about purpose.',
          correctsTo:
            "No — this is a list of categories, not an analysis. It never explains how the syntax, the diction, and the metaphor work TOGETHER at any single moment, or how they change as the argument builds. Real integrated style analysis picks one moment in the text and shows at least two style elements reinforcing the same claim there — for example, a sentence's syntax tightening at the exact moment its diction intensifies, both serving the same rising urgency. The test: could you delete any one of the three named devices from this sentence without changing its meaning? If yes, they were never actually connected — it's a checklist, not an integrated line of reasoning.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A full rhetorical-analysis essay shows multiple style choices (syntax, diction, figurative language) working TOGETHER at the same moment, not analyzed in separate silos.",
        "Style often co-escalates with argument: as claims build toward their climax, syntax can tighten and diction can intensify in the same direction.",
        "At each stage of the argument, ask what style choices are doing work THERE, and how they change as the argument builds — not just what the writer is claiming.",
        "The checklist-essay trap: naming syntax, diction, and figurative language as separate observations that never connect to each other or to the overall purpose.",
        "The strongest analysis treats a writer's style tightening in lockstep with the argument's stakes as evidence of deliberate design, not decoration.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.4',
    cedTitle: 'Analyzing Style in Rhetorical Analysis',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '6',
        note: 'AP English Language and Composition Course and Exam Description, Unit 6 — integrating syntax, diction, and figurative language into a single rhetorical-analysis line of reasoning.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — anchor text for style co-escalating with the argument\'s own escalation.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — practice text for integrating two style elements into one thesis.',
      },
    ],
  },
};
