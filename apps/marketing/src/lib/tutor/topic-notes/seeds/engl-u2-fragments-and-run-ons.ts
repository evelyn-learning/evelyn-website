/**
 * HS English — Unit 2 CED 2.3: Fragments, Run-Ons & Comma Splices.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.fragments-and-run-ons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U2_FRAGMENTS_AND_RUN_ONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.fragments-and-run-ons.v1',
  course: 'HS English',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Fragments, Run-Ons & Comma Splices',
  planId: 'evelyn.hs.engl.fragments-and-run-ons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.fragments-and-run-ons.v1' }],
  theory: [
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'The test', content: `THE TEST — an independent clause has a subject and a verb and could stand alone as its own sentence. Before you touch any punctuation mark, cover one side with your hand and ask: "Would I send this by itself?" That single question resolves nearly every boundary decision.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Four legal joins', content: `FOUR LEGAL JOINS — two independent clauses may be joined in exactly four ways: (1) a period, making two sentences, (2) a semicolon, (3) a comma plus a FANBOYS conjunction (for, and, nor, but, or, yet, so), (4) a colon, but only when the second clause explains or delivers on the first.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Fragment', content: `FRAGMENT — a word group punctuated like a sentence that cannot stand alone. Most fragments are dependent clauses opening with a subordinator such as when, although, because, since, while, which, or who. WRONG: "Because the rehearsal ran two hours long." CORRECT: "Because the rehearsal ran two hours long, we skipped the last scene." Other fragments are stranded phrases with no verb at all, or a verb ending in -ing with no helper: WRONG: "Running the sound board for the whole show." Attach it or give it a subject and a real verb.` },
    { loId: 'engl.fragments-and-run-ons', content: `RUN-ON (FUSED SENTENCE) — two independent clauses jammed together with no punctuation and no conjunction. WRONG: "The interview went well I got the internship." Fix it with any of the four legal joins. CORRECT: "The interview went well, and I got the internship."` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Comma splice', content: `COMMA SPLICE — two independent clauses joined by a comma ALONE. WRONG: "The interview went well, I got the internship." This is the most common boundary error in student writing because the comma feels like a pause and the sentence sounds fine aloud. A comma is never strong enough on its own to hold two complete thoughts together.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Trap', content: `TRAP — CONJUNCTIVE ADVERBS. Words like however, therefore, moreover, consequently, and instead do the meaning-work of a conjunction but do not have the grammar-power of one. WRONG: "Ticket sales doubled, however, the club still lost money." CORRECT: "Ticket sales doubled; however, the club still lost money." Semicolon before, comma after.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Trap', content: `TRAP — LENGTH IS NOT THE TEST. Count clauses, not words. A long sentence carrying one independent clause plus modifying phrases is perfectly correct, and a four-word sentence can still be a fragment. Do not break a sentence in half just because it feels long.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'framework', title: 'Style note', content: `STYLE NOTE — a deliberate fragment can work in fiction, dialogue, or a punchy caption ("No warning. Just rain."). The difference between craft and error is intent, and academic writing gives you very little room to claim it, so in essays and analysis keep every sentence complete.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'definition', title: 'independent clause', content: `a word group with a subject and a verb that expresses a complete thought and could stand alone as a sentence.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'definition', title: 'dependent clause', content: `a word group with a subject and a verb that cannot stand alone because it opens with a subordinator such as when, although, because, or which.` },
    { loId: 'engl.fragments-and-run-ons', kind: 'definition', title: 'comma splice', content: 'the error of joining two independent clauses with a comma and no conjunction.' },
    { loId: 'engl.fragments-and-run-ons', kind: 'definition', title: 'FANBOYS', content: `the coordinating conjunctions that may follow a comma to join two independent clauses: for, and, nor, but, or, yet, so.` },
  ],
  methods: [
    {
      title: 'Worked comma splice',
      steps: [
        `Cover the right side and read the left alone: "The gym smelled like floor polish and nerves." Subject "gym", verb "smelled" — that stands alone. Independent clause.`,
        `Now cover the left and read the right: "My name was third on the callback list." Subject "name", verb "was" — that stands alone too. Independent clause.`,
        `Two independent clauses are held together here by a comma and nothing else. That is a comma splice, and it is WRONG no matter how natural the pause sounds when read aloud.`,
        `Choose from the four legal joins based on the effect you want. A period gives two clipped beats. A semicolon keeps the two images tightly linked without spelling out the relationship, which suits a narrative that is building tension.`,
        `CORRECT: "The gym smelled like floor polish and nerves; my name was third on the callback list." A comma plus "and" would also be correct, just softer.`,
      ],
      example: { problem: `A student turns in this line in a personal narrative: "The gym smelled like floor polish and nerves, my name was third on the callback list." Diagnose the boundary and revise it.`, solution: `Comma splice — revise to "The gym smelled like floor polish and nerves; my name was third on the callback list."` },
      relatedLoIds: ['engl.fragments-and-run-ons'],
    },
    {
      title: 'Worked however trap',
      steps: [
        `Diagnose the original first: "The fundraiser sold out in a day" stands alone, and "the club still finished the season short on money" stands alone. Two independent clauses with no punctuation at all between them — a run-on, or fused sentence.`,
        `Now test the revision the same way. The two clauses are unchanged, so both sides are still independent. The only new material is the comma and the word "however".`,
        `Here is the trap: "however" means what "but" means, so it feels like it should do the same grammatical job. It cannot. "However" is a conjunctive adverb, not one of the FANBOYS conjunctions, so a comma in front of it does not license the join.`,
        `The revision therefore trades a run-on for a comma splice. WRONG: "The fundraiser sold out in a day, however, the club still finished the season short on money."`,
        `Fix it with a mark strong enough to stand between two complete thoughts. CORRECT: "The fundraiser sold out in a day; however, the club still finished the season short on money." Equally correct: "The fundraiser sold out in a day, but the club still finished the season short on money."`,
      ],
      example: { problem: `A student notices a run-on in a draft and tries to repair it. Original: "The fundraiser sold out in a day the club still finished the season short on money." The student revises to: "The fundraiser sold out in a day, however, the club still finished the season short on money." Is the revision correct?`, solution: `No — the revision is still a comma splice. Use "sold out in a day; however, the club..." or "sold out in a day, but the club...".` },
      relatedLoIds: ['engl.fragments-and-run-ons'],
    },
  ],
  pointers: [
    { content: `Length is irrelevant — count independent clauses. This sentence has exactly one: "The film club chose six finalists for the spring showcase." Everything between the commas is a modifying phrase with no subject-verb pair of its own, so there is no second clause to separate. Splitting it would actually CREATE a fragment: "After screening more than forty short documentaries submitted by students across three districts." One independent clause, however long, is never a run-on.`, kind: 'common-error' },
    { content: `Cover each side of the punctuation and ask "would I send this by itself?" — that independent-clause test settles nearly every boundary question.`, kind: 'tip' },
    { content: `Two independent clauses take a period, a semicolon, a comma plus FANBOYS, or a colon when the second explains the first. A comma alone is a comma splice; no mark at all is a run-on.`, kind: 'tip' },
    { content: `A fragment is usually a dependent clause (when, although, because, which) punctuated as a sentence — attach it to the independent clause beside it, or drop the subordinator.`, kind: 'tip' },
    { content: `However, therefore, and moreover take a semicolon before and a comma after; and length is never the test — count clauses, not words.`, kind: 'tip' },
    { content: `"However" is not a FANBOYS word. Say the sentence with "but" swapped in — if it works, you still can't use a comma alone before "however." Semicolon before, comma after: \`...doubled; however, the club lost money.\``, kind: 'common-error' },
    { content: `Count independent clauses, not words. A 30-word sentence with one subject-verb core and a pile of modifying phrases is legal; splitting it with a period usually manufactures a fragment out of the phrase you cut loose.`, kind: 'gotcha' },
    { content: `"Sounds fine when I read it aloud" is not the test — a comma splice always sounds fine, because a comma matches the pause your voice makes. Cover one side with your hand instead and ask: would I send this by itself?`, kind: 'tip' },
    { content: `Run-on ≠ "long sentence." A run-on (fused sentence) is two independent clauses with NO punctuation between them. Use the terms precisely: no mark = run-on, comma alone = comma splice.`, kind: 'vocab-note' },
    { content: `A dependent clause has a subject and a verb too — that's why fragments fool you. Check the first word: when, although, because, since, while, which, who. Subordinator at the front = it must attach to a full sentence, with a comma if it comes first.`, kind: 'common-error' },
    { content: `An -ing word alone is not a verb: "Running the sound board all night." needs a helper ("She was running...") or must be attached to a nearby sentence. Same for phrases with no subject-verb pair at all.`, kind: 'edge-case' },
    { content: `The colon join is conditional: it's only legal when the second clause explains, proves, or delivers on the first. Don't reach for a colon just to avoid choosing between a period and a semicolon.`, kind: 'edge-case' },
    { content: `Deliberate fragments belong to fiction, dialogue, and captions — "No warning. Just rain." In analytical essays you don't get that defense, so keep every sentence complete unless a teacher has approved the effect.`, kind: 'gotcha' },
  ],
};
