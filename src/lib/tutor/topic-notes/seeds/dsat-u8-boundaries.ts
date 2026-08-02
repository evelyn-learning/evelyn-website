/**
 * Digital SAT — Unit 8 CED 8.1: Boundaries: Punctuation Between & Within Sentences.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.boundaries.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U8_BOUNDARIES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.boundaries.v1',
  course: 'Digital SAT',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Boundaries: Punctuation Between & Within Sentences',
  planId: 'evelyn.testprep.dsat.boundaries.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.boundaries.v1' }],
  theory: [
    { loId: 'dsat.boundaries', kind: 'framework', title: 'The core test', content: `THE CORE TEST — for every Boundaries item, isolate what is on each side of the blank and ask: does it have a subject and a verb, and could it stand alone as its own sentence? That answer (independent clause, dependent clause, or fragment) determines which punctuation marks are even eligible.` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Two independent clauses', content: `TWO INDEPENDENT CLAUSES — four correct joins: (1) period, (2) semicolon, (3) comma + a FANBOYS conjunction (for, and, nor, but, or, yet, so), (4) colon, ONLY when the second clause explains, defines, or elaborates the first.` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — COMMA SPLICE. Two independent clauses joined by a comma ALONE, with no conjunction: "The lab results were inconclusive, the team ran the test again." WRONG. This is the single most common wrong-answer trap on Boundaries items.` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — RUN-ON. Two independent clauses with NO punctuation at all between them. Always wrong, even when the sentence reads smoothly aloud.` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — SEMICOLON OR COLON WITH A FRAGMENT. Both marks require a genuine independent clause immediately BEFORE them. "Although the results were inconclusive; the team ran the test again." WRONG — the left side starts with "Although," making it dependent, not independent, so the semicolon has nothing complete to attach to.` },
    { loId: 'dsat.boundaries', content: `DEPENDENT + INDEPENDENT — subordinating conjunctions (although, because, since, while, when, if, unless...) open a dependent clause. Dependent-clause-FIRST needs a comma before the independent clause that follows: "Although the results were inconclusive, the team retested." Independent-clause-first with the subordinator in the middle usually takes NO comma: "The team retested because the results were inconclusive."` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Trap 4', content: `TRAP 4 — SEMICOLON + CONJUNCTION. A semicolon is never immediately followed by a coordinating conjunction like "and" or "but" — that combination is nonstandard. Pick one mark or the other, not both.` },
    { loId: 'dsat.boundaries', kind: 'framework', title: 'Colon precision', content: `COLON PRECISION — a colon needs a complete independent clause before it (never after an incomplete verb phrase like "The recipe requires:"), and what follows can be a list, a single word, or an explanation — it does not itself need to be independent.` },
    { loId: 'dsat.boundaries', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that can stand alone as a complete sentence.` },
    { loId: 'dsat.boundaries', kind: 'definition', title: 'dependent clause', content: `a clause that opens with a subordinating word (although, because, since, while...) and cannot stand alone.` },
    { loId: 'dsat.boundaries', kind: 'definition', title: 'comma splice', content: `the error of joining two independent clauses with only a comma and no conjunction.` },
    { loId: 'dsat.boundaries', kind: 'definition', title: 'run-on sentence', content: 'two independent clauses joined with no punctuation at all.' },
  ],
  methods: [
    {
      title: 'Worked independent independent',
      steps: [
        `Left side: "City engineers spent three years redesigning the aging bridge" — subject "engineers," verb "spent" — a complete, independent clause.`,
        `Right side: "the new structure now handles twice the daily traffic without any added support columns" — subject "structure," verb "handles" — also independent.`,
        `Two independent clauses need a period, a semicolon, a comma + FANBOYS, or (if the second explains the first) a colon.`,
        `(A) comma alone is a comma splice — wrong. (D) no punctuation is a run-on — wrong. (C) colon is wrong because the second clause is not explaining or defining anything about "the bridge" — it is a new, separate fact, not an elaboration.`,
        '(B) semicolon correctly joins the two closely related independent statements.',
      ],
      example: { problem: `Choose the punctuation that correctly completes the sentence: "City engineers spent three years redesigning the aging bridge ___ the new structure now handles twice the daily traffic without any added support columns." (A) , (comma alone) (B) ; (semicolon) (C) : (colon) (D) [no punctuation]`, solution: '(B) semicolon' },
      relatedLoIds: ['dsat.boundaries'],
    },
    {
      title: 'Worked dependent independent',
      steps: [
        `Left side opens with "Although" — a subordinating conjunction — so even though it has a subject ("telescope") and a verb ("can resolve"), it is a DEPENDENT clause. It cannot stand alone.`,
        `Right side: "astronomers can now map craters on asteroids more than a hundred million miles away" — independent.`,
        `This is a dependent-clause-first + independent-clause-second sentence, which takes a comma after the dependent clause — not the two-independent-clause rule.`,
        `(B) semicolon is wrong — a semicolon needs an independent clause on BOTH sides, and the left side is dependent (the fragment trap). (C) colon is wrong for the same reason: it also needs a complete clause before it. (D) no punctuation fuses the two halves together incorrectly.`,
        '(A) comma is correct — the standard introductory-dependent-clause comma.',
      ],
      example: { problem: `Choose the punctuation that correctly completes the sentence: "Although the observatory's new telescope can resolve details ten times sharper than its predecessor ___ astronomers can now map craters on asteroids more than a hundred million miles away." (A) , (comma) (B) ; (semicolon) (C) : (colon) (D) [no punctuation]`, solution: '(A) comma' },
      relatedLoIds: ['dsat.boundaries'],
    },
  ],
  pointers: [
    { content: `No — when the independent clause comes FIRST and the dependent clause (because/although/since/etc.) comes SECOND, no comma is needed: "The bridge closed because the inspectors found a crack." The comma-before-dependent-clause rule only applies when the dependent clause comes first: "Because the inspectors found a crack, the bridge closed."`, kind: 'common-error' },
    { content: `Two independent clauses: period, semicolon, comma+FANBOYS, or (only if the second explains the first) a colon. A comma alone is a splice; no mark at all is a run-on.`, kind: 'tip' },
    { content: `Semicolons and colons both require a complete independent clause immediately BEFORE the mark — a dependent clause or fragment there is always wrong.`, kind: 'tip' },
    { content: `Dependent clause + independent clause (in that order) takes a comma after the dependent clause; flip the order and the comma usually disappears.`, kind: 'tip' },
    { content: `Read each side of the blank as its own sentence and ask: complete, or not? That single test resolves almost every Boundaries question.`, kind: 'tip' },
    { content: `**Transition words are not conjunctions.** "However, therefore, moreover, in fact, consequently" cannot fix a comma splice: "The test failed, however the team retried" is still wrong. Only FANBOYS work after a comma. With a transition, you need a period or semicolon: "...failed; however, the team retried."`, kind: 'gotcha' },
    { content: `The question stem is always "Which choice completes the text so that it conforms to the conventions of Standard English?" — that phrase means CONVENTIONS, not style. Never pick based on which version "flows better" or sounds shortest; pick the one that's grammatically legal.`, kind: 'vocab-note' },
    { content: `Scan answer choices FIRST. If they're all punctuation variants at one spot (comma / semicolon / colon / dash / nothing), it's a Boundaries item — go straight to the complete-or-not test on each side instead of reading for meaning.`, kind: 'tip' },
    { content: `A dash can substitute for a colon (and, in pairs, for commas), but a single dash between two independent clauses is also acceptable. If two choices are functionally identical (e.g., semicolon AND period both offered correctly), re-check — the test never gives two right answers, so one side isn't what you think.`, kind: 'edge-case' },
    { content: `Watch for a long modifier hiding the real subject: "The samples collected in 2019 by researchers from three universities" is NOT a clause — no main verb yet. Strip prepositional phrases and *-ing/-ed* modifiers before deciding if a side is independent.`, kind: 'common-error' },
    { content: `Don't demand a colon just because a list follows. "The kit includes: gloves, tape, and wire" is wrong — "The kit includes" isn't complete. Colons need a full clause on the left even when the right side is a list.`, kind: 'gotcha' },
    { content: `Relative pronouns (*who, which, that*) also make a clause dependent: "...the map, which no researcher had verified" cannot precede a semicolon. Subordinators aren't only *although/because* — check for *which/who/that* openers too.`, kind: 'edge-case' },
    { content: `"So" and "yet" ARE FANBOYS (comma + them is legal); "however," "thus," and "then" are not. Memorize the seven exactly — the test baits with near-misses like "so that" and "still."`, kind: 'vocab-note' },
  ],
};
