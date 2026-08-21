/**
 * Grade 7 English Language Arts — Unit 6 CED 6.4: Commas & Punctuation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.commas-and-end-punctuation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U6_COMMAS_AND_END_PUNCTUATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.commas-and-end-punctuation.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Commas & Punctuation',
  planId: 'evelyn.ms.m7ela.commas-and-end-punctuation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.commas-and-end-punctuation.v1' }],
  theory: [
    { loId: 'm7ela.commas-and-end-punctuation', content: `END MARKS CLOSE A THOUGHT; COMMAS WORK INSIDE ONE. Every sentence ends with a period, a question mark or an exclamation point, and that mark is what keeps two complete thoughts apart. You saw last lesson that a comma cannot do that job by itself. WRONG: "The rain started, we ran inside." CORRECT: "The rain started. We ran inside." A comma is legal only when it is doing one of the five jobs below. If you cannot name the job, take the comma out.` },
    { loId: 'm7ela.commas-and-end-punctuation', content: `JOB 1, ITEMS IN A SERIES, AND JOB 2, AN INTRODUCTORY ELEMENT. Three or more items in a list get commas between them: "We packed sandwiches, grapes, and a bag of ice." The last comma, the one before "and", is called the serial comma. It is a style choice, not a rule. Many style guides use it and this course uses it, so pick one habit and stay consistent. Job 2 is separate: when a word, a phrase or a whole clause runs ahead of the main sentence, close it with a comma. "After the second period bell, the hallway finally emptied out."` },
    { loId: 'm7ela.commas-and-end-punctuation', content: `JOB 3, JOINING TWO COMPLETE SENTENCES. When one of the FANBOYS words (for, and, nor, but, or, yet, so) joins two groups that could each stand alone, put the comma BEFORE that word: "The pool closed early, so we rode home." Check what follows the joining word first. If it has no subject of its own, it is a second verb, not a second sentence, and it takes no comma. WRONG: "Deshawn grabbed his glove, and ran to the field." CORRECT: "Deshawn grabbed his glove and ran to the field."` },
    { loId: 'm7ela.commas-and-end-punctuation', content: `JOB 4, EXTRA INFORMATION, AND THE REMOVAL TEST. Some information can be lifted straight out of a sentence. Take it out and read what is left: if the sentence still works and still means the same thing, that information is extra, and extra information gets a PAIR of commas, one before and one after. "My cousin, who lives in Tulsa, sent a postcard." Never build half the fence. WRONG: "My cousin, who lives in Tulsa sent a postcard." If removing the words leaves you unsure WHICH one is meant, they are not extra and they get no commas at all: "The kid who found my phone gets the reward."` },
    { loId: 'm7ela.commas-and-end-punctuation', content: `JOB 5, COORDINATE ADJECTIVES, AND THE "AND" TEST. Two adjectives are coordinate when each one describes the noun on its own. Test them twice: put "and" between them, then swap their order. If both versions still sound right, they need a comma. "A long, boring afternoon" passes, because "long and boring" works and "boring, long afternoon" works. Now try "a bright red jacket": "bright and red" sounds wrong and "a red bright jacket" sounds worse, so those adjectives are stacked, not coordinate. WRONG: "a bright, red jacket." CORRECT: "a bright red jacket."` },
    { loId: 'm7ela.commas-and-end-punctuation', content: `APOSTROPHES MARK OWNERSHIP OR MISSING LETTERS, NEVER PLURALS. One owner takes apostrophe plus s: "my brother's bike." Several owners take the plural first and then the apostrophe: "the players' benches." A word that just means more than one gets nothing. WRONG: "two taco's" CORRECT: "two tacos" And the pair that fools everybody: "it's" is short for "it is" or "it has", while "its" is the possessive, exactly like "his" and "her". Expand it to test. WRONG: "The team lost it's captain." CORRECT: "The team lost its captain."` },
    { loId: 'm7ela.commas-and-end-punctuation', kind: 'definition', title: 'serial comma', content: `the optional comma before the final "and" or "or" in a list of three or more items; this course uses it.` },
    { loId: 'm7ela.commas-and-end-punctuation', kind: 'definition', title: 'introductory element', content: `a word, phrase or clause that comes before the main sentence and is closed off with a comma.` },
    { loId: 'm7ela.commas-and-end-punctuation', kind: 'definition', title: 'extra information', content: `words that can be removed without changing what the sentence means or which person or thing it is about; they take a pair of commas.` },
    { loId: 'm7ela.commas-and-end-punctuation', kind: 'definition', title: 'coordinate adjectives', content: `two adjectives that each describe the noun on their own, so you can join them with "and" or swap their order; they take a comma between them.` },
    { loId: 'm7ela.commas-and-end-punctuation', kind: 'definition', title: 'possessive', content: `the form of a noun that shows ownership, written with an apostrophe: my brother's bike, the players' benches.` },
  ],
  methods: [
    {
      title: 'Worked intro and series',
      steps: [
        `Find the main sentence first. It is "Coach handed out ..." Everything before the word "Coach" is setup, so that is Job 2, an introductory element. Close it with a comma after "season".`,
        `Now look at what Coach handed out: orange slices, water bottles, a stack of team photos. That is three items, which is Job 1, a series.`,
        `Put a comma between the items. This course uses the serial comma, so there is also a comma before "and". Leaving that last one out would not be an error, but stay consistent inside a piece of writing.`,
        `CORRECT: "After the last game of the season, Coach handed out orange slices, water bottles, and a stack of team photos."`,
        `Notice what gets NO comma. Nothing goes between "Coach" and "handed", because there is no job between a subject and its verb, no matter how long the sentence feels. WRONG: "After the last game of the season, Coach, handed out orange slices, water bottles, and a stack of team photos."`,
      ],
      example: { problem: `Add the commas this sentence needs. "After the last game of the season Coach handed out orange slices water bottles and a stack of team photos."`, solution: `"After the last game of the season, Coach handed out orange slices, water bottles, and a stack of team photos." — one introductory comma plus the commas in the series.` },
      relatedLoIds: ['m7ela.commas-and-end-punctuation'],
    },
    {
      title: 'Worked removal and and test',
      steps: [
        `Start with "who coaches the swim team" and run the REMOVAL test. Lift it out and read what is left: "Mr. Alvarez lent us a cracked dusty paddle." The sentence still works, and you still know exactly who did it, because his name is right there.`,
        `So that clause is extra information, which is Job 4. Extra information gets a PAIR of commas: one before "who" and one after "team".`,
        `Do not build half the fence. WRONG: "Mr. Alvarez, who coaches the swim team lent us a cracked dusty paddle." One comma leaves the sentence hanging open and strands the subject away from its verb.`,
        `Now the two adjectives, "cracked" and "dusty". Run the "and" test: "a cracked and dusty paddle" sounds right. Now swap them: "a dusty, cracked paddle" also sounds right. Both versions pass, so these are coordinate adjectives and they take a comma between them. That is Job 5.`,
        `Compare that with a pair that FAILS the test, so you can feel the difference. "A bright red jacket" gives you "bright and red jacket" and "a red bright jacket", and both sound wrong. Those adjectives stack instead. WRONG: "a bright, red jacket." CORRECT: "a bright red jacket."`,
        `CORRECT: "Mr. Alvarez, who coaches the swim team, lent us a cracked, dusty paddle." Three commas, and every one of them can name its job.`,
      ],
      example: { problem: `This sentence has no commas at all. Decide where they belong, and prove each one. "Mr. Alvarez who coaches the swim team lent us a cracked dusty paddle."`, solution: `"Mr. Alvarez, who coaches the swim team, lent us a cracked, dusty paddle." — a pair of commas around the extra information, plus one comma between the coordinate adjectives.` },
      relatedLoIds: ['m7ela.commas-and-end-punctuation'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, the comma belongs there, because that is where you pause when you read the sentence out loud." — Name the job before you keep a comma. That mark sits between the subject, "The girl with the green skateboard", and its verb, "lives". None of the five jobs covers that gap, so the comma has to go. WRONG: "The girl with the green skateboard, lives on my street." CORRECT: "The girl with the green skateboard lives on my street." Reading a sentence aloud is still useful for hearing when something is confusing. It just does not decide where the marks land.`, kind: 'common-error' },
    { content: `Students often say "Yes, "it's" is right, because the ball belongs to the dog." — Expand it and listen. "It's" is short for "it is", so the sentence becomes "Her dog dropped it is ball in the pool", which falls apart. The possessive is "its", with no apostrophe at all, exactly like "his" and "her". WRONG: "Her dog dropped it's ball in the pool." CORRECT: "Her dog dropped its ball in the pool." And remember the other half of the rule: an apostrophe never makes a word plural. WRONG: "two taco's" CORRECT: "two tacos"`, kind: 'common-error' },
    { content: `An end mark closes a complete thought. A comma works inside one, and it is legal only when you can name its job.`, kind: 'tip' },
    { content: `The five jobs: items in a series, an introductory element, a FANBOYS word joining two complete sentences, extra information, and coordinate adjectives.`, kind: 'tip' },
    { content: `REMOVAL TEST for extra information: take it out. If the sentence still works and still means the same thing, put a PAIR of commas around it.`, kind: 'tip' },
    { content: `"AND" TEST for adjectives: if you can put "and" between them and swap their order, use a comma. "A long, boring afternoon" passes; "a bright red jacket" does not.`, kind: 'tip' },
    { content: `Never place a comma just because you pause, and never split a subject from its verb.`, kind: 'tip' },
    { content: `Apostrophes mark ownership or missing letters, never plurals. WRONG: "two taco's" CORRECT: "two tacos" And "it's" means "it is"; the possessive is "its".`, kind: 'tip' },
    { content: `Don't place a comma where you'd pause out loud. Every comma must name one of the five jobs. Long subjects feel like they need a rest stop — they don't. WRONG: "The girl with the green skateboard, lives on my street." Never split a subject from its verb.`, kind: 'common-error' },
    { content: `Before a FANBOYS word, check what comes AFTER it. If those words have their own subject, use a comma. If it's just a second verb, no comma. "Deshawn grabbed his glove and ran" — one subject, no comma. "The pool closed early, so we rode home" — two subjects, comma.`, kind: 'gotcha' },
    { content: `Extra information needs a PAIR of commas, one before and one after. Never build half the fence. WRONG: "Mr. Alvarez, who coaches the swim team lent us a paddle." The missing second comma is the error teachers circle most on this job.`, kind: 'common-error' },
    { content: `The removal test is about meaning, not just grammar. If taking the words out leaves you wondering WHICH person or thing is meant, they're not extra and get NO commas. "The kid who found my phone gets the reward" — remove it and you don't know which kid. No commas.`, kind: 'edge-case' },
    { content: `Run BOTH parts of the "and" test before adding a comma between adjectives — insert "and" AND swap the order. "Cracked and dusty" plus "dusty, cracked" both work, so comma. "Bright and red" fails, so write "a bright red jacket" with no comma.`, kind: 'tip' },
    { content: `"It's" always expands to "it is" or "it has." Test by expanding: "Her dog dropped it is ball" falls apart, so write "its." The possessive "its" takes no apostrophe — just like "his" and "her," which nobody writes as "hi's."`, kind: 'vocab-note' },
    { content: `An apostrophe never makes a word plural. WRONG: "two taco's," "the 1990's," "Smith's live here." Ask: does this word OWN something, or is there just more than one? More than one gets a bare -s.`, kind: 'common-error' },
    { content: `The serial comma (the one before the final "and") is a style choice, not a rule — this course uses it. Don't mark it wrong in someone else's writing; just stay consistent inside your own piece.`, kind: 'edge-case' },
  ],
};
