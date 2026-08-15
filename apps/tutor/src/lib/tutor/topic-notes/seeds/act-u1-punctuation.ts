/**
 * ACT — Unit 1 CED 1.2: Punctuation: Commas, Apostrophes, Colons & Dashes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.punctuation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_PUNCTUATION: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.punctuation.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Punctuation: Commas, Apostrophes, Colons & Dashes',
  planId: 'evelyn.testprep.act.punctuation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.punctuation.v1' }],
  theory: [
    { loId: 'act.punctuation', content: `PAIRED COMMAS FOR NONESSENTIAL INFO: an appositive or extra descriptive clause that could be deleted without changing the sentence's core meaning gets a comma (or dash) BEFORE and AFTER it — never just one side.` },
    { loId: 'act.punctuation', content: `NO COMMAS FOR ESSENTIAL INFO: a clause that identifies WHICH person or thing is meant (a restrictive clause, often starting with "that" or "who") takes NO commas at all. Confusing these two is the single most common ACT punctuation trap.` },
    { loId: 'act.punctuation', content: `THE UNNECESSARY-COMMA TRAP: the ACT constantly offers a choice with an extra comma wedged between a subject and its verb, a verb and its object, or right after a FANBOYS conjunction. If you can't name the rule that puts a comma there, the comma doesn't belong — DELETE IT.` },
    { loId: 'act.punctuation', content: `COMMA SPLICE TRAP: a single comma can never join two independent clauses. Fix with a period, a semicolon, or a comma plus a FANBOYS conjunction (for, and, nor, but, or, yet, so).` },
    { loId: 'act.punctuation', content: `SEMICOLON = TWO COMPLETE SENTENCES GLUED TOGETHER: both sides of a semicolon must be able to stand alone. If either side is a fragment, the semicolon is wrong.` },
    { loId: 'act.punctuation', content: `COLON AND SINGLE DASH NEED A COMPLETE CLAUSE FIRST: whatever comes before a colon or a single introductory dash must be a full independent clause; what follows explains, lists, or emphasizes it.` },
    { loId: 'act.punctuation', content: `APOSTROPHES NEVER MAKE A PLURAL: "the dog's bone" (one dog, possessive), "the dogs' bones" (multiple dogs, possessive), "dogs" (just plural, no apostrophe). "Its" is possessive; "it's" is the contraction for "it is."` },
    { loId: 'act.punctuation', content: `PAIRED DASHES = PAIRED COMMAS: two dashes around a nonessential interruption do the same job as two commas — don't mix one dash with one comma around the same interruption.` },
    { loId: 'act.punctuation', kind: 'definition', title: 'appositive', content: `a noun phrase placed next to another noun that renames or explains it (e.g., "my sister, a doctor,").` },
    { loId: 'act.punctuation', kind: 'definition', title: 'restrictive clause', content: `a clause essential to identifying its noun, and therefore written with no surrounding commas (e.g., "the book that I borrowed").` },
    { loId: 'act.punctuation', kind: 'definition', title: 'FANBOYS', content: 'the seven coordinating conjunctions: for, and, nor, but, or, yet, so.' },
    { loId: 'act.punctuation', kind: 'definition', title: 'comma splice', content: 'the error of joining two independent clauses with only a comma.' },
  ],
  methods: [
    {
      title: 'Worked appositive commas',
      steps: [
        `Identify what "Josh Jennings" is doing in the sentence — it renames "the team captain." That makes it an appositive.`,
        `Test it: delete the phrase entirely. "The team captain called a timeout with ten seconds left." Still a complete, sensible sentence — so the appositive is NONESSENTIAL information.`,
        `Nonessential information gets set off by a PAIR of commas (or dashes, or parentheses) — one before, one after.`,
        `Both commas in the original sentence are in the right places. NO CHANGE is correct.`,
      ],
      example: { problem: `In the passage: "The team captain, JOSH JENNINGS, called a timeout with ten seconds left." Is the punctuation around "JOSH JENNINGS" correct as written, or should the commas be deleted?`, solution: `NO CHANGE — "Josh Jennings" is a nonessential appositive, correctly set off by a pair of commas.` },
      relatedLoIds: ['act.punctuation'],
    },
    {
      title: 'Worked unnecessary comma',
      steps: [
        `Check each comma against a rule, one at a time. Commas 1 and 2 set off "who arrived early" — a nonessential clause. That pair is correctly used.`,
        `Comma 3 sits between the verb "sorted" and its direct object, "the donated coats."`,
        `RULE: a verb is never separated from its direct object by a single, unpaired comma — there is no rule that puts a comma there.`,
        `This is the ACT's favorite trap: a comma that "feels" like a natural pause but has no grammatical job. Delete comma 3.`,
      ],
      example: { problem: `In the passage: "The volunteers, who arrived early, sorted, the donated coats by size." Which comma in this sentence should be deleted?`, solution: `Delete the comma after "sorted" — a verb should never be separated from its direct object by a comma.` },
      relatedLoIds: ['act.punctuation'],
    },
  ],
  pointers: [
    { content: `A comma before a FANBOYS conjunction is only needed when BOTH sides are independent clauses. Here, "and submitted it before the deadline" has no subject of its own — it's just the second half of a compound verb ("proofread... and submitted..."), so no comma belongs there. Test each side: can it stand alone as a full sentence? If not, skip the comma — this is the #1 unnecessary-comma trap on the ACT.`, kind: 'common-error' },
    { content: `Nonessential info (appositives, extra clauses) gets a PAIR of commas or dashes; essential/restrictive info gets NONE — that's the #1 trap the ACT sets.`, kind: 'tip' },
    { content: `A comma alone can never join two independent clauses — use a semicolon, a period, or a comma plus a FANBOYS conjunction instead.`, kind: 'tip' },
    { content: `Apostrophes show possession or mark a missing letter (contraction) — never a plain plural. "Its" (possessive) vs. "it's" (it is).`, kind: 'tip' },
    { content: `A colon or a single introductory dash must be preceded by a complete independent clause: ask "could everything before this mark stand alone as a sentence?"`, kind: 'tip' },
    { content: `Scan the ANSWER CHOICES vertically before reading the sentence. If choices differ only by comma/semicolon/colon/dash placement, the question is pure punctuation — don't waste time evaluating word choice or style.`, kind: 'tip' },
    { content: `A semicolon and a period are grammatically identical on the ACT. If two choices offer "; " and ". " for the same spot, both can't be right — so the answer is one of the other two. Use this to eliminate instantly.`, kind: 'tip' },
    { content: `"Whose" is possessive; there's no such word as "who's" meaning possession — "who's" = "who is." Same family as its/it's, their/they're/there, and your/you're. The ACT hides these inside long sentences where the sound is identical.`, kind: 'vocab-note' },
    { content: `Plural nouns already ending in -s take just an apostrophe: "the students' desks." But irregular plurals (children, women, men, people) take 's: "the children's books" — never "childrens'."`, kind: 'edge-case' },
    { content: `A colon does NOT need a complete sentence after it — a single word or list fragment is fine ("She packed one thing: courage"). Only the LEFT side must stand alone. Don't reject a colon just because what follows is short.`, kind: 'common-error' },
    { content: `Watch for the FANBOYS fake-out in reverse: two full independent clauses joined by "and" with NO comma is also wrong. Test both sides for subject + verb before deciding — the answer may be adding a comma, not deleting one.`, kind: 'gotcha' },
    { content: `Non-underlined punctuation is a free clue. If a dash or comma already sits after the interruption and isn't underlined, the underlined mark before it must MATCH — dash with dash, comma with comma. Never mix.`, kind: 'tip' },
    { content: `"That" clauses are essential — never put a comma before "that." "Which" clauses are nonessential — almost always take a comma before them. If a choice offers ", that," eliminate it on sight.`, kind: 'edge-case' },
  ],
};
