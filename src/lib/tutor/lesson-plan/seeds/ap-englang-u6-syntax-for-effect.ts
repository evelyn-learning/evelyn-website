/**
 * AP English Language & Composition — CED Unit 6.1: Syntax and Sentence
 * Variety for Effect.
 *
 * Opens Unit 6 (Style: Syntax and Diction). Students already know HOW to
 * build a line of reasoning (Unit 4) and organize paragraphs (Unit 5); this
 * topic zooms into the sentence itself — length, parallel structure,
 * periodic vs. loose construction, and deliberate fragments — as a
 * rhetorical choice in its own right, distinct from diction (word choice,
 * 6.2) and figurative language (6.3).
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself PARAGRAPH grain:
 * responseFormat 'free', rubric = evidence(3) + commentary(3)).
 *
 * Anchor text: Abraham Lincoln's Gettysburg Address —
 * evelyn.passage.lincoln-gettysburg.v1 — the unit's ideal syntax text: the
 * periodic closing sentence, the internal tricolon ("of the people, by the
 * people, for the people"), the anaphora-into-antithesis of "we can not
 * dedicate — we can not consecrate — we can not hallow." Try-yourself uses
 * Patrick Henry's "Give Me Liberty or Give Me Death" —
 * evelyn.passage.henry-give-me-liberty.v1 — for its short-sentence
 * acceleration in the closing paragraph, for passage variety.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U6_SYNTAX_FOR_EFFECT: LessonPlan = {
  id: 'evelyn.ap.englang.syntax-for-effect.v1',
  title: 'U6.1 Syntax and Sentence Variety for Effect',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.syntax-for-effect',
      description:
        "Analyze how a writer's syntactic choices — sentence length, parallel structure, periodic vs. loose construction, and deliberate fragments — create emphasis and rhythm, and explain why those choices serve the writer's purpose rather than merely naming the pattern.",
      standard: 'AP-ENGLANG-6.1',
    },
  ],
  prerequisites: ['apenglang.audience-context'],
  followUps: ['apenglang.diction-connotation-tone'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that sentence rhythm alone changes meaning, before naming any syntax terms.',
      script:
        "Read this out loud: \"The team lost. Again.\" Now read this: \"Despite months of preparation, careful strategy, and the unwavering belief of every player on the roster that this, finally, was their year, the team lost.\" Same basic fact — a loss — but the two sentences make you FEEL it completely differently: one lands like a punch, the other builds dread across a long, delayed sentence before the blow even arrives. That's not word choice, and it's not a metaphor. It's syntax — how the sentence itself is built — and skilled writers use it as deliberately as any other tool. Today we learn to read sentence structure itself as a rhetorical choice.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-syntax',
      kind: 'concept',
      goal: 'Define the key syntactic patterns (sentence length/variety, periodic vs. loose, parallelism, antithesis, fragments) and how each produces emphasis or rhythm.',
      keyIdeas: [
        "SYNTAX is how words are arranged into sentences — length, order, and structure — distinct from diction (which words are chosen, 6.2) and figurative language (what a phrase stands for or how it's patterned, 6.3). Syntax is itself a deliberate rhetorical choice.",
        "SENTENCE LENGTH AND VARIETY: short sentences slow a reader down and land as blunt or emphatic; long sentences can build momentum, accumulate detail, or mimic the complexity of an idea. A sudden short sentence after a run of long ones is one of the most reliable emphasis devices in the language.",
        "A PERIODIC SENTENCE withholds the main clause or resolving idea until the very end, forcing the reader to hold several pieces in suspension until the sentence's full meaning lands all at once at the close.",
        "A LOOSE (CUMULATIVE) SENTENCE puts the main clause first, then trails additional detail or modification after it — more conversational, front-loaded, often plainer and more direct.",
        "PARALLELISM (parallel structure) repeats the same grammatical pattern across a series of words, phrases, or clauses — it creates rhythm and signals that the items in the series are equivalent, escalating, or unified rather than a random list.",
        "ANTITHESIS is a syntactic pairing of contrasting ideas placed in parallel, balanced grammatical structure — the balance itself sharpens the contrast, making each term's meaning depend on, and highlight, its opposite.",
        "A deliberate SENTENCE FRAGMENT — an intentionally incomplete sentence — breaks the expected rhythm to isolate a single idea and make it land with blunt force.",
        "The trap: naming a syntactic pattern ('the sentences are long,' 'this is parallel structure') without explaining the specific EFFECT that length or structure produces and WHY it serves the writer's purpose at that exact moment. A pattern name alone earns no analytical credit.",
      ],
      vocabulary: [
        { term: 'syntax', definition: 'how words are arranged into a sentence — length, order, and structure — as a deliberate rhetorical choice.' },
        { term: 'periodic sentence', definition: 'a sentence that withholds its main clause or resolving idea until the very end.' },
        { term: 'loose (cumulative) sentence', definition: 'a sentence whose main clause comes first, with additional detail trailing after.' },
        { term: 'parallelism', definition: 'repeating the same grammatical pattern across a series of words, phrases, or clauses.' },
        { term: 'antithesis', definition: 'a pairing of contrasting ideas in parallel, balanced grammatical structure.' },
        { term: 'sentence fragment', definition: 'a deliberately incomplete sentence used to isolate an idea and break the expected rhythm.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lincoln-syntax',
      kind: 'worked_example',
      problem:
        "Analyze the syntax of two moments in the Gettysburg Address (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1): the anaphora-into-antithesis of \"we can not dedicate — we can not consecrate — we can not hallow — this ground. The brave men, living and dead, who struggled here, have consecrated it,\" and the closing periodic sentence ending \"that government of the people, by the people, for the people, shall not perish from the earth.\"",
      steps: [
        "IDENTIFY THE CLOSING SENTENCE'S SHAPE. Lincoln's final sentence is a single long periodic sentence: a chain of \"that...\" clauses (\"that we here highly resolve... that this nation... shall have a new birth of freedom... and that government of the people, by the people, for the people, shall not perish from the earth\") that withholds full grammatical resolution until its very last words.",
        "NAME THE PARALLEL STRUCTURE WITHIN IT. Each \"that\" clause is grammatically parallel and escalating — resolve, new birth of freedom, government shall not perish — and inside the final clause sits a tricolon: \"of the people, by the people, for the people,\" three parallel prepositional phrases restating the same democratic principle three ways.",
        "EXPLAIN THE EFFECT OF WITHHOLDING RESOLUTION. Stacking clause after clause before the sentence's grammatical resolution makes the audience hold the whole accumulated weight of the address — resolve, sacrifice, rebirth — until the final words, so \"shall not perish from the earth\" lands as the culmination of everything before it, not a separate final thought.",
        "EXPLAIN THE EFFECT OF THE TRICOLON. Restating the same idea three ways (\"of,\" \"by,\" \"for\" the people) adds no new information — it makes the principle feel exhaustive and settled, as if there is no angle from which democratic government could be described that this phrase doesn't already cover.",
        "TURN TO THE EARLIER ANAPHORA-INTO-ANTITHESIS. \"We can not dedicate — we can not consecrate — we can not hallow — this ground\" repeats the identical negated verb structure three times (anaphora), then pivots into direct antithesis with the very next sentence: \"The brave men... have consecrated it\" — WE cannot versus THEY have, a syntactic reversal that turns the living's inadequacy and the dead's sacrifice into grammatical opposites.",
        "LINK ALL THREE CHOICES TO PURPOSE. The delayed periodic sentence, the internal tricolon, and the anaphora-turned-antithesis all serve the same purpose: making the argument feel not merely asserted but INEVITABLE, as if the grammar itself enacts the accumulating, irreversible weight of the claim.",
      ],
      answer:
        "Lincoln's closing sentence withholds its grammatical resolution across a chain of parallel 'that' clauses, so the escalating tricolon 'of the people, by the people, for the people' lands as the exhaustive, settled culmination of everything the address has built, not a separate final thought. Earlier, the anaphoric 'we can not dedicate — we can not consecrate — we can not hallow' pivots directly into antithesis — 'The brave men... have consecrated it' — turning the living's inadequacy and the dead's sacrifice into grammatical opposites. Together, the delayed periodic structure, the internal tricolon, and the anaphora-into-antithesis make Lincoln's claim feel inevitable rather than merely asserted.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-henry-syntax',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE body paragraph analyzing how Henry's syntax in the speech's final paragraph — the short, rapid-fire declarative and interrogative sentences (\"The war is actually begun! The next gale that sweeps from the north will bring to our ears the clash of resounding arms! Our brethren are already in the field! Why stand we here idle? What is it that gentlemen wish? What would they have?\") — creates urgency and forecloses further deliberation. Include at least one specific piece of evidence (a quote naming the sentence pattern) AND commentary explaining how the syntax produces that effect and why it serves Henry's purpose. Do not quote-and-drop.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted syntax from the final paragraph (e.g. 'The war is actually begun!', the short exclamatory sentences, or the rapid rhetorical-question burst 'Why stand we here idle? What is it that gentlemen wish? What would they have?') and identifies the pattern (short sentences, rapid succession, exclamation/interrogative). Partial credit (1-2) for evidence present but vague, or only one weak reference where the fuller sequence was available. No credit for no evidence, misquoted evidence, or evidence irrelevant to the syntax claim.",
            modelResponse:
              "Henry closes with a burst of short, unadorned sentences — \"The war is actually begun! ... Our brethren are already in the field! Why stand we here idle? What is it that gentlemen wish? What would they have?\" — abandoning the longer, reflective sentences of his opening.",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW the short-sentence, rapid-question syntax works (each clause lands as its own blunt fact or accusation, with no room between them for the audience to raise a counterpoint or return to deliberation) AND WHY it serves Henry's purpose (he needs the Convention to feel that the moment for weighing options has already passed — a syntax that itself refuses to pause enacts that foreclosure rather than simply asserting it). Partial credit for commentary that explains the effect but not why it serves Henry's purpose, or that mostly restates the quotes. No credit for commentary absent or reduced to summary of what the sentences say.",
            modelResponse:
              "By refusing to slow down — stacking short exclamations and questions with no connecting clauses between them — Henry's syntax leaves no grammatical room for the audience to interject a counterargument, performing the very urgency his claim asserts. Because his purpose is to convince a still-deliberating Convention that deliberation itself is now a luxury they can't afford, a sentence structure that itself refuses to pause is more persuasive than simply telling the audience time is short.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-device-spotting-syntax',
      kind: 'misconception_check',
      question:
        'A student writes: "Lincoln uses a periodic sentence and repeats parallel phrases in the final sentence of his speech." Is this a complete syntax analysis?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Naming a syntactic pattern (periodic sentence, parallelism) without explaining the specific EFFECT it produces in this passage — the syntax-analysis equivalent of quote-and-drop.',
          correctsTo:
            "No — naming the pattern is only the first half. \"Lincoln uses a periodic sentence\" tells the reader WHAT structure is present but not what it DOES: why does withholding the resolving clause until \"shall not perish from the earth\" matter here, and why does repeating \"of the people, by the people, for the people\" rather than saying it once matter? Real syntax analysis explains the effect (the delay makes the ending feel like an earned culmination; the triple repetition makes the principle feel exhaustive) and ties that effect to the writer's purpose. The test: strip the device name out — does a real explanation remain, or does the sentence just relabel what you already saw? If nothing remains, it's device-spotting, not analysis.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Syntax — sentence length, order, and structure — is a deliberate rhetorical choice, distinct from diction (word choice) and figurative language.",
        "A periodic sentence withholds resolution until the end, building suspense; a loose sentence resolves early and trails detail after.",
        "Parallelism creates rhythm and signals equivalence or escalation; antithesis places contrasting ideas in the same grammatical slot to sharpen contrast.",
        "A sudden short sentence, or a deliberate fragment, after longer ones is a reliable emphasis device.",
        "Never name a syntactic pattern alone — always explain the specific effect it produces here and why it serves the writer's purpose, the same discipline as evidence-and-commentary.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.1',
    cedTitle: 'Syntax and Sentence Variety for Effect',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '6',
        note: 'AP English Language and Composition Course and Exam Description, Unit 6 — syntax: sentence length and variety, periodic vs. loose construction, parallelism, antithesis, and deliberate fragments.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — anchor text for periodic sentence structure, internal tricolon, and anaphora-into-antithesis.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — practice text for short-sentence acceleration and rhetorical-question syntax.',
      },
    ],
  },
};
