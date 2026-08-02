/**
 * ACT — Unit 1 CED 1.1: Sentence Structure & Boundaries.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.sentence-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_SENTENCE_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.sentence-structure.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Sentence Structure & Boundaries',
  planId: 'evelyn.testprep.act.sentence-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.sentence-structure.v1' }],
  theory: [
    { loId: 'act.sentence-structure', content: `THE TEST: an independent clause has a subject and a verb and could stand alone as a sentence. Before touching any punctuation, isolate each side and ask "does this work by itself?"` },
    { loId: 'act.sentence-structure', content: `FOUR LEGAL WAYS to join two independent clauses: a period (two sentences), a semicolon, a comma + FANBOYS (for, and, nor, but, or, yet, so), or a colon if the second clause explains the first.` },
    { loId: 'act.sentence-structure', content: `COMMA SPLICE: two independent clauses joined by a comma ALONE, with no conjunction. This is the single most-tested error on ACT English. A comma by itself is never strong enough to join two complete sentences.` },
    { loId: 'act.sentence-structure', content: `RUN-ON / FUSED SENTENCE: two independent clauses jammed together with NO punctuation and no conjunction at all. Same underlying problem as a comma splice — just missing the comma too.` },
    { loId: 'act.sentence-structure', content: `FRAGMENT: a group of words punctuated like a sentence (capital letter, period) that is NOT a complete thought — usually because it's actually a dependent clause. Dependent clauses start with subordinators like "when," "although," "because," "which," or "who" and cannot stand alone no matter how long or important-sounding they are.` },
    { loId: 'act.sentence-structure', kind: 'framework', title: 'Trap', content: `TRAP — CONJUNCTIVE-ADVERB BAIT: words like "however," "therefore," "moreover," and "consequently" sound exactly like FANBOYS conjunctions but are NOT. Joining two independent clauses with only a comma before one of these words is still a comma splice — it needs a semicolon before and a comma after.` },
    { loId: 'act.sentence-structure', kind: 'framework', title: 'Trap', content: `TRAP — LENGTH IS NOT THE TEST: a long sentence with one independent clause plus modifying phrases is NOT a run-on. Don't "fix" a sentence just because it's long — count clauses, not words.` },
    { loId: 'act.sentence-structure', kind: 'framework', title: 'Trap', content: `TRAP — FRAGMENT THAT LOOKS COMPLETE: a dependent clause standing alone often reads as grammatically smooth ("When the fundraiser raised triple its goal.") which is exactly why it's tested — the ear says it sounds fine, but the test is "can this stand alone?"` },
    { loId: 'act.sentence-structure', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and verb that expresses a complete thought and could stand alone as a sentence.` },
    { loId: 'act.sentence-structure', kind: 'definition', title: 'dependent clause', content: `a group of words with a subject and verb that CANNOT stand alone — usually opens with a subordinator like "when," "because," or "which."` },
    { loId: 'act.sentence-structure', kind: 'definition', title: 'comma splice', content: 'two independent clauses incorrectly joined by a comma with no conjunction.' },
    { loId: 'act.sentence-structure', kind: 'definition', title: 'FANBOYS', content: `the coordinating conjunctions that can follow a comma to join two independent clauses: for, and, nor, but, or, yet, so.` },
  ],
  methods: [
    {
      title: 'Worked comma splice',
      steps: [
        `Test each side alone: "The volunteers arrived early." — complete sentence. "They set up two hundred chairs before the doors opened." — also complete. Two independent clauses.`,
        `A comma alone cannot join two independent clauses — that is a comma splice, the single most common ACT English trap.`,
        `Pick a legal fix: period, semicolon, or comma + FANBOYS. A comma + "and" keeps the sentence flowing naturally here.`,
        `Corrected: "The volunteers arrived early, and they set up two hundred chairs before the doors opened."`,
      ],
      example: { problem: `ACT English item — the underlined portion is in CAPS: "The volunteers arrived early, THEY SET UP two hundred chairs before the doors opened." Which fix corrects the sentence?`, solution: `The volunteers arrived early, and they set up two hundred chairs before the doors opened.` },
      relatedLoIds: ['act.sentence-structure'],
    },
    {
      title: 'Worked conjunctive adverb trap',
      steps: [
        `Test each side: "Ticket sales exceeded expectations." — complete. "The venue still lost money on catering." — complete. Two independent clauses again.`,
        `"However" LOOKS like it is doing the job of "but," but it is a conjunctive adverb, not a FANBOYS conjunction — a comma alone before it does not legally join the clauses.`,
        'Legal fix: semicolon before "however," comma after it.',
        `Corrected: "Ticket sales exceeded expectations; however, the venue still lost money on catering."`,
      ],
      example: { problem: `ACT English item — the underlined portion is in CAPS: "Ticket sales exceeded expectations, HOWEVER, the venue still lost money on catering." Which fix corrects the sentence?`, solution: `Ticket sales exceeded expectations; however, the venue still lost money on catering.` },
      relatedLoIds: ['act.sentence-structure'],
    },
  ],
  pointers: [
    { content: `Length is irrelevant — count independent clauses, not words. This sentence has exactly ONE independent clause ("The committee selected twelve finalists...") plus a non-essential modifying phrase set off by commas ("after reviewing over three hundred applications..."). One independent clause, however long, is never a run-on. "NO CHANGE" is often the correct answer on ACT English — do not "fix" what is not broken.`, kind: 'common-error' },
    { content: `Test each side of the punctuation alone: is it an independent clause (complete thought) or a dependent clause / fragment?`, kind: 'tip' },
    { content: `Two independent clauses need a period, semicolon, or comma + FANBOYS — a comma ALONE is a comma splice, and no punctuation at all is a run-on (fused sentence).`, kind: 'tip' },
    { content: `A fragment is usually a dependent clause ("when," "although," "which"...) punctuated like a full sentence — it can sound smooth and still be wrong.`, kind: 'tip' },
    { content: `Conjunctive adverbs (however, therefore, moreover) take a semicolon before them, not a comma; and sentence LENGTH is never the test for a run-on — clause count is.`, kind: 'tip' },
    { content: `Period and semicolon are grammatically identical for joining two independent clauses — so if two answer choices offer each, neither can be right. Cross both off immediately and pick between what's left.`, kind: 'tip' },
    { content: `"However" is only a splice problem when it sits BETWEEN two independent clauses. "The plan, however, failed" is fine — commas on both sides, one clause. Check clause count before you reach for a semicolon.`, kind: 'edge-case' },
    { content: `Imperative-mood clauses have an invisible subject: "Bring a jacket" is a complete independent clause. Don't call it a fragment just because you can't find a subject noun.`, kind: 'edge-case' },
    { content: `An -ING word alone is not a verb. "The team practicing all summer." is a fragment; "The team WAS practicing" is a sentence. Scan for a helping verb before you call it complete.`, kind: 'common-error' },
    { content: `A comma + FANBOYS is only legal when BOTH sides are complete. "She rehearsed for weeks, and finally nailed the solo" has no subject after "and" — that comma is wrong. Compound verb ≠ two clauses.`, kind: 'gotcha' },
    { content: `Colon fix requires a complete sentence BEFORE the colon (what follows can be a list or fragment). Semicolon requires complete sentences on BOTH sides. Test the correct side for each.`, kind: 'vocab-note' },
    { content: `"NO CHANGE" wins often on boundary items. If your only reason to change something is that the sentence felt long or dense, that's not a reason. Count independent clauses and move on.`, kind: 'common-error' },
    { content: `"Which" and "who" launch dependent clauses; "this," "that," and "it" as subjects launch independent ones. "...goal, which surprised everyone" is fine; "...goal, this surprised everyone" is a comma splice.`, kind: 'gotcha' },
  ],
};
