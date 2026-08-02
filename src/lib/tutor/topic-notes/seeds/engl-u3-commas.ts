/**
 * HS English — Unit 3 CED 3.1: Commas That Do Real Work.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.commas.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U3_COMMAS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.commas.v1',
  course: 'HS English',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Commas That Do Real Work',
  planId: 'evelyn.hs.engl.commas.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.commas.v1' }],
  theory: [
    { loId: 'engl.commas', kind: 'framework', title: 'Name the job', content: `NAME THE JOB — a comma is legal only when it is doing one of five jobs: separating items in a series, closing an introductory element, dividing coordinate adjectives, fencing off nonessential information, or joining two independent clauses with a conjunction. Before you keep a comma, name its job. If it has none, it is noise.` },
    { loId: 'engl.commas', content: `JOB 1: ITEMS IN A SERIES — three or more items get a comma after each one except the last: "We packed sandwiches, apples, and a thermos." Keep the final comma before "and" (the serial comma); it stops the reader from fusing the last two items into a single item.` },
    { loId: 'engl.commas', content: `JOB 2: INTRODUCTORY ELEMENTS — a word, phrase, or dependent clause that runs ahead of the main subject gets a comma after it: "After the last customer left, we mopped the floor." Without that comma the reader keeps reading the introduction as part of the main sentence and has to back up.` },
    { loId: 'engl.commas', content: `JOB 3: COORDINATE ADJECTIVES — when two adjectives modify the same noun independently, separate them with a comma: "a long, boring meeting." Test it twice: put "and" between them, then reverse their order. If both versions still sound right, the comma belongs. If not, leave it out — "three old wooden crates" takes no commas at all.` },
    { loId: 'engl.commas', content: `JOB 4: NONESSENTIAL (NONRESTRICTIVE) ELEMENTS — information you could delete without changing WHICH person or thing is meant gets a PAIR of commas, one before and one after: "Ms. Alvarez, who coaches the debate team, approved the schedule." Never build half the fence. If deleting the information would leave the reader unsure which one is meant, it is ESSENTIAL and takes NO commas: "The student who wrote the winning essay will read it aloud."` },
    { loId: 'engl.commas', content: `JOB 5: JOINING TWO INDEPENDENT CLAUSES — when a coordinating conjunction (for, and, nor, but, or, yet, so) joins two halves that could each stand alone as a sentence, the comma goes BEFORE the conjunction: "The bus was late, so we walked." If the second half has no subject of its own, it is a compound verb rather than a clause, and no comma belongs there.` },
    { loId: 'engl.commas', content: `ERROR A: THE MISSING COMMA — the expensive one, because it changes meaning rather than just looking sloppy. WRONG: "We are ready to eat kids." CORRECT: "We are ready to eat, kids." A dropped introductory comma does the same damage: WRONG: "While the choir sang the lights dimmed." CORRECT: "While the choir sang, the lights dimmed."` },
    { loId: 'engl.commas', content: `ERROR B: THE EXTRA COMMA — there is no comma job between a subject and its verb, between a verb and its object, or before a compound verb, no matter how long the sentence feels. WRONG: "The tall boy in the blue hoodie, waved at us." CORRECT: "The tall boy in the blue hoodie waved at us." If you cannot name the job, delete the comma.` },
    { loId: 'engl.commas', kind: 'definition', title: 'serial comma', content: `the comma placed before the final "and" or "or" in a list of three or more items.` },
    { loId: 'engl.commas', kind: 'definition', title: 'coordinate adjectives', content: `two adjectives that modify the same noun independently, so they can be reversed or joined by "and" without sounding wrong.` },
    { loId: 'engl.commas', kind: 'definition', title: 'nonessential (nonrestrictive) element', content: `information that can be deleted without changing which person or thing is meant; it takes a pair of commas.` },
    { loId: 'engl.commas', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that can stand alone as a complete sentence.` },
  ],
  methods: [
    {
      title: 'Worked intro and series',
      steps: [
        `Find the main subject and verb first: the sentence really says "the crew had rebuilt ... repainted ... and rewired." Everything before "the crew" is setup.`,
        `JOB 2 applies to that setup: close the introductory phrase "By the end of the second rehearsal" with a comma so the reader knows where the introduction ends and the main sentence starts.`,
        `Now look at what the crew actually did: rebuilt the balcony, repainted the backdrop, rewired every stage light. Three items — that is JOB 1, a series.`,
        `Put a comma after each item except the last, and keep the serial comma before "and".`,
        `CORRECT: "By the end of the second rehearsal, the crew had rebuilt the balcony, repainted the backdrop, and rewired every stage light." Note what does NOT get a comma: nothing separates "crew" from "had rebuilt", because a subject is never split from its verb.`,
      ],
      example: { problem: `Add the commas this sentence needs: "By the end of the second rehearsal the crew had rebuilt the balcony repainted the backdrop and rewired every stage light."`, solution: `"By the end of the second rehearsal, the crew had rebuilt the balcony, repainted the backdrop, and rewired every stage light." — one introductory comma plus two series commas.` },
      relatedLoIds: ['engl.commas'],
    },
    {
      title: 'Worked extra comma trap',
      steps: [
        `Test each comma by naming its job. Comma 1 sits between the subject "The new bakery on Delmar Street" and its verb "opened".`,
        `No job covers that gap. A long subject feels like it earns a pause, but a pause is not one of the five jobs — delete comma 1.`,
        `Comma 2 sits before "and". Check what follows it: "sold out of croissants by nine" has no subject of its own, so it is the second half of a compound verb ("opened ... and sold out"), not a second independent clause.`,
        `JOB 5 requires a complete sentence on BOTH sides of the conjunction, so comma 2 has no job either — delete it.`,
        `WRONG: "The new bakery on Delmar Street, opened at six, and sold out of croissants by nine." CORRECT: "The new bakery on Delmar Street opened at six and sold out of croissants by nine."`,
      ],
      example: { problem: `A student writes: "The new bakery on Delmar Street, opened at six, and sold out of croissants by nine." The commas land exactly where the writer paused while reading aloud. Are they correct?`, solution: `No — both commas are extra. CORRECT: "The new bakery on Delmar Street opened at six and sold out of croissants by nine."` },
      relatedLoIds: ['engl.commas'],
    },
  ],
  pointers: [
    { content: `A pause is not one of the five comma jobs. That comma sits between the subject "The runner in the bright orange jacket" and its verb "crossed", and nothing may split a subject from its verb. Long subjects invite this error because they feel like they deserve a rest stop. CORRECT: "The runner in the bright orange jacket crossed the finish line first."`, kind: 'common-error' },
    { content: `A comma is legal only when it is doing a job: series, introductory element, coordinate adjectives, nonessential information, or joining two independent clauses with a conjunction.`, kind: 'tip' },
    { content: `Nonessential information takes a PAIR of commas; information that tells the reader WHICH one is meant is essential and takes none.`, kind: 'tip' },
    { content: `A comma plus a coordinating conjunction joins two complete sentences; a compound verb with no second subject takes no comma.`, kind: 'tip' },
    { content: `Commas do not mark breathing — never split a subject from its verb. And remember what the missing one costs: "We are ready to eat, kids."`, kind: 'tip' },
    { content: `Before keeping any comma, say its job out loud: series, introductory, coordinate adjectives, nonessential pair, or joining two independent clauses. "It felt like a pause" is not a job — delete it.`, kind: 'tip' },
    { content: `Never split a subject from its verb, no matter how long the subject is. "The runner in the bright orange jacket, crossed the line" is wrong — long subjects feel like they earn a rest stop, but they don't get one.`, kind: 'common-error' },
    { content: `Before a coordinating conjunction, cover the conjunction and read what follows. If it has its own subject and can stand alone, use the comma. If it's just another verb ("opened at six and sold out by nine"), no comma.`, kind: 'gotcha' },
    { content: `Nonessential elements need BOTH commas — never build half the fence. "My cousin, a welder in Duluth taught me..." is broken. If you open with a comma, close it (unless the element ends the sentence).`, kind: 'common-error' },
    { content: `"Nonessential" doesn't mean unimportant — it means deletable without changing WHICH one is meant. "The student who wrote the winning essay" identifies which student, so it's essential: no commas.`, kind: 'vocab-note' },
    { content: `Test coordinate adjectives twice: insert "and" AND reverse the order. Both must sound right. "long, boring meeting" passes; "three old wooden crates" fails both tests, so it takes zero commas.`, kind: 'tip' },
    { content: `Direct address always needs its comma: "We are ready to eat, kids" vs. "We are ready to eat kids." A missing comma changes meaning; an extra one just looks sloppy — so hunt for missing ones first.`, kind: 'edge-case' },
    { content: `A comma alone cannot join two complete sentences — "The bus was late, we walked" is a comma splice. Job 5 requires comma PLUS a coordinating conjunction (for, and, nor, but, or, yet, so).`, kind: 'gotcha' },
  ],
};
