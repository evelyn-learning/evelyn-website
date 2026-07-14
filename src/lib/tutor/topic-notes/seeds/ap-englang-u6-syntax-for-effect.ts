/**
 * AP English Language & Composition — Unit 6 CED 6.1: Syntax and Sentence
 * Variety for Effect.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.syntax-for-effect.v1`). Covers sentence length/variety,
 * periodic vs. loose construction, parallelism, antithesis, and deliberate
 * fragments as deliberate rhetorical choices distinct from diction (6.2) and
 * figurative language (6.3).
 *
 * Anchor text referenced in the method's example: Abraham Lincoln, "The
 * Gettysburg Address" (1863). Quotes are limited to the short structural
 * phrases already used in the lesson plan — the teaching point is the
 * syntactic moves, not the content of the address.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SYNTAX_FOR_EFFECT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.syntax-for-effect.v1',
  course: 'AP English Language & Composition',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Syntax and Sentence Variety for Effect',
  planId: 'evelyn.ap.englang.syntax-for-effect.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.syntax-for-effect.v1' }],
  theory: [
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'definition',
      title: 'syntax',
      content:
        'How words are arranged into a sentence — length, order, and structure — as a deliberate rhetorical choice, distinct from diction (which words are chosen) and figurative language (what a phrase stands for or how it is patterned). Syntax is worth analyzing in its own right, not as a footnote to word choice.',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'definition',
      title: 'periodic vs. loose sentence',
      content:
        'A **periodic sentence** withholds the main clause or resolving idea until the very end, forcing the reader to hold several pieces in suspension until the full meaning lands all at once at the close. A **loose (cumulative) sentence** puts the main clause first, then trails additional detail or modification after it — more conversational, front-loaded, and often plainer or more direct.',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'definition',
      title: 'parallelism and antithesis',
      content:
        '**Parallelism** repeats the same grammatical pattern across a series of words, phrases, or clauses, creating rhythm and signaling that the items are equivalent, escalating, or unified rather than a random list. **Antithesis** is a syntactic pairing of contrasting ideas placed in parallel, balanced grammatical structure — the balance itself sharpens the contrast, making each term\'s meaning depend on, and highlight, its opposite.',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'rhetorical-device',
      title: 'sentence length as emphasis',
      content:
        'Short sentences slow a reader down and land as blunt or emphatic; long sentences can build momentum, accumulate detail, or mimic the complexity of an idea. A sudden short sentence dropped after a run of long ones is one of the most reliable emphasis devices in the language — the contrast in length does the work, not just the words.',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'rhetorical-device',
      title: 'deliberate fragments',
      content:
        'A deliberate sentence fragment — an intentionally incomplete sentence — breaks the expected rhythm to isolate a single idea and make it land with blunt force. Because it violates the reader\'s expectation of a complete clause, it draws attention to itself; the isolated fragment should always be tied to a specific effect, not just noted as "incomplete."',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'framework',
      title: 'anaphora-into-antithesis',
      content:
        'A common high-value pattern: repeating an identical negated or emphatic structure several times (anaphora) and then pivoting the very next clause into direct antithesis — e.g. "we can not dedicate — we can not consecrate — we can not hallow" followed by "The brave men... have consecrated it." The repetition builds the expectation; the antithesis then reverses it, turning two groups (the living, the dead) into grammatical opposites.',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'strategy',
      title: 'withheld resolution creates weight',
      content:
        'In a periodic sentence, stacking clause after clause before the sentence\'s grammatical resolution makes the reader hold the whole accumulated weight of the passage until the final words land — so the ending reads as the culmination of everything before it, not a separate, isolated point. Ask: what is being withheld, and why does making the reader wait for it matter?',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'trap',
      title: 'device-spotting without effect',
      content:
        'Naming a syntactic pattern ("the sentences are long," "this is parallel structure") without explaining the specific EFFECT that length or structure produces, and WHY it serves the writer\'s purpose at that exact moment, earns no analytical credit. The test: strip the device name out of the sentence — does a real explanation of effect remain, or does the sentence just relabel what was already visible?',
    },
    {
      loId: 'apenglang.syntax-for-effect',
      kind: 'strategy',
      title: 'tie syntax back to purpose',
      content:
        'Every syntax observation should end by connecting back to the rhetorical situation (1.1): why does THIS structure — not a plainer alternative — serve THIS writer\'s purpose for THIS audience at THIS moment? A syntax analysis that never reconnects to purpose is description, not argument.',
    },
  ],
  methods: [
    {
      title: "Analyze a writer's syntax for effect",
      when_to_use:
        'Use when a passage contains a noticeably shaped sentence (unusually long/short, repeated structure, a fragment, or a delayed main clause) worth analyzing on its own terms.',
      steps: [
        "IDENTIFY THE SENTENCE'S SHAPE — is it periodic (resolution withheld) or loose (main clause first)? Is there parallelism, antithesis, a sudden short sentence, or a fragment?",
        'NAME THE PARALLEL OR REPEATED STRUCTURE WITHIN IT, if present — what elements repeat the same grammatical pattern, and are they equivalent or escalating?',
        'EXPLAIN THE EFFECT OF WITHHOLDING OR DELIVERING RESOLUTION — what does making the reader wait (or not wait) accomplish at this specific moment?',
        'EXPLAIN THE EFFECT OF ANY REPETITION OR PARALLELISM — does repeating the same shape make an idea feel exhaustive, escalating, or inevitable?',
        'IF THERE IS A PIVOT INTO ANTITHESIS, name the two contrasting terms placed in the same grammatical slot and explain what that pairing forces the reader to notice.',
        "LINK THE SYNTACTIC CHOICE TO PURPOSE — state why this structure, and not a plainer alternative, serves the writer's goal for this audience.",
      ],
      example: {
        problem:
          "Analyze the syntax of Lincoln's closing sentence in the Gettysburg Address, a single long periodic sentence ending \"that government of the people, by the people, for the people, shall not perish from the earth,\" alongside the earlier anaphora-into-antithesis \"we can not dedicate — we can not consecrate — we can not hallow — this ground. The brave men, living and dead, who struggled here, have consecrated it.\"",
        solution:
          "Lincoln's closing sentence withholds its grammatical resolution across a chain of parallel \"that\" clauses, so the escalating tricolon \"of the people, by the people, for the people\" lands as the exhaustive, settled culmination of everything the address has built, not a separate final thought. Earlier, the anaphoric \"we can not dedicate — we can not consecrate — we can not hallow\" pivots directly into antithesis — \"The brave men... have consecrated it\" — turning the living's inadequacy and the dead's sacrifice into grammatical opposites. Together, the delayed periodic structure, the internal tricolon, and the anaphora-into-antithesis make Lincoln's claim feel inevitable rather than merely asserted.",
      },
      relatedLoIds: ['apenglang.syntax-for-effect'],
    },
  ],
  pointers: [
    { content: 'Syntax is how a sentence is BUILT (length, order, structure) — a distinct lens from diction (word choice) and figurative language.', kind: 'tip' },
    { content: 'Periodic = resolution withheld until the end (suspense); loose = main clause first, detail trails after (plainer, direct).', kind: 'tip' },
    { content: 'A sudden short sentence, or a deliberate fragment, after a run of longer ones is a reliable emphasis device — worth flagging.', kind: 'tip' },
    { content: 'Never name a pattern alone ("this is parallel structure") — always explain the specific effect it produces here.', kind: 'trap' },
    { content: 'Test: strip the device label out of your sentence — if no real explanation of effect remains, it is device-spotting, not analysis.', kind: 'trap' },
    { content: 'Antithesis works by placing contrasting ideas in the identical grammatical slot — the balance itself is what sharpens the contrast.', kind: 'tip' },
  ],
};
