/**
 * HS English — Unit 2 CED 2.4: Modifier Placement & Parallel Structure.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.modifiers-and-parallelism.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U2_MODIFIERS_AND_PARALLELISM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.modifiers-and-parallelism.v1',
  course: 'HS English',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Modifier Placement & Parallel Structure',
  planId: 'evelyn.hs.engl.modifiers-and-parallelism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.modifiers-and-parallelism.v1' }],
  theory: [
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Modifiers attach to what is nearest', content: `MODIFIERS ATTACH TO WHAT IS NEAREST — a describing word or phrase latches onto the closest noun, not onto the one you had in mind. Placement is not style; it is meaning.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Misplaced modifier', content: `MISPLACED MODIFIER — the phrase sits next to the wrong word. WRONG: "She served sandwiches to the volunteers on paper plates." (the volunteers are on plates) CORRECT: "She served the volunteers sandwiches on paper plates." Fix by moving the phrase beside the word it describes.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Dangling modifier', content: `DANGLING MODIFIER — an opening phrase before the first comma describes a doer who never shows up as the subject. WRONG: "After rehearsing all weekend, the audition felt easy." (the audition did not rehearse) CORRECT: "After rehearsing all weekend, Devon found the audition easy."` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'The comma check', content: `THE COMMA CHECK — read the opening phrase, then look at the very first noun after the comma and ask whether that noun could truly do or feel what the phrase describes. If it could not, the modifier is dangling. The intended person appearing LATER in the sentence does not fix anything.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Two repairs for a dangler', content: `TWO REPAIRS FOR A DANGLER — either make the true doer the subject right after the comma, or turn the opening phrase into a full clause with its own subject: "After Devon rehearsed all weekend, the audition felt easy."` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Limiting words move the meaning', content: `LIMITING WORDS MOVE THE MEANING — only, almost, just, even, and nearly belong directly in front of the word they limit. "I only edited two paragraphs" (editing was all I did) means something different from "I edited only two paragraphs" (two and no more). Decide what you mean, then place the word there.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Parallel structure in a series', content: `PARALLEL STRUCTURE IN A SERIES — every item joined by and or or must share one grammatical form: all bare verbs, all -ing forms, all infinitives, or all nouns. WRONG: "The club meeting covered fundraising, to recruit members, and a new banner." CORRECT: "The club meeting covered fundraising, recruitment, and a new banner."` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'framework', title: 'Parallelism in pairs and comparisons', content: `PARALLELISM IN PAIRS AND COMPARISONS — the two halves of not only ... but also, either ... or, neither ... nor, both ... and, and of comparisons with than or as must match in form. WRONG: "The role calls for someone who is patient and who listens well but also being organized." CORRECT: "The role calls for someone who is patient, attentive, and organized." Note the classic error pattern: three items match and one switches form, so repair the odd item rather than rewriting the whole list.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'definition', title: 'modifier', content: 'a word or phrase that describes or limits another word in the sentence.' },
    { loId: 'engl.modifiers-and-parallelism', kind: 'definition', title: 'dangling modifier', content: `an opening modifier whose true doer never appears as the subject of the clause that follows it.` },
    { loId: 'engl.modifiers-and-parallelism', kind: 'definition', title: 'parallel structure', content: `matching grammatical form across items in a series, a correlative pair, or a comparison.` },
  ],
  methods: [
    {
      title: 'Worked parallel series',
      steps: [
        `Find the words that introduce the series: "will" plus the list of duties. Every item has to work as a continuation of "will ___."`,
        `List the three items separately: "answer the phones", "scheduling client appointments", "to update the website every Friday".`,
        `Test each against "will": "will answer" works, "will scheduling" does not, "will to update" does not. Item one sets the pattern, so items two and three are the broken ones.`,
        `Convert the broken items to the bare-verb form the first item established: "schedule client appointments" and "update the website every Friday".`,
        `Parallel version: "The studio assistant will answer the phones, schedule client appointments, and update the website every Friday." Every item now reads cleanly after "will".`,
      ],
      example: { problem: `Revise this sentence from an internship description so the series is parallel: "The studio assistant will answer the phones, scheduling client appointments, and to update the website every Friday."`, solution: `The studio assistant will answer the phones, schedule client appointments, and update the website every Friday.` },
      relatedLoIds: ['engl.modifiers-and-parallelism'],
    },
    {
      title: 'Worked dangler failed revision',
      steps: [
        `Read the opening phrase: "Hoping to impress the hiring manager." Only a person can hope, so the phrase needs a human doer.`,
        `Run the comma check on the REVISION, not on the intention. The first noun after the comma is still "the resume".`,
        `A resume cannot hope for anything, so the revised sentence still claims that the resume was doing the hoping. Adding "by Dana" at the end does not change what the modifier attaches to. This is the classic error: naming the doer somewhere in the sentence and assuming the sentence is repaired.`,
        `Repair option one, promote the true doer to subject: "Hoping to impress the hiring manager, Dana printed the resume on heavy cream paper."`,
        `Repair option two, give the opening phrase its own subject: "Because Dana hoped to impress the hiring manager, she printed the resume on heavy cream paper." Either version passes the comma check.`,
      ],
      example: { problem: `A writer is told that "Hoping to impress the hiring manager, the resume was printed on heavy cream paper." contains a dangling modifier. The writer revises it to "Hoping to impress the hiring manager, the resume was printed on heavy cream paper by Dana." Did the revision fix the error?`, solution: `No — the revision still fails, because "the resume" remains the noun after the comma. CORRECT: "Hoping to impress the hiring manager, Dana printed the resume on heavy cream paper."` },
      relatedLoIds: ['engl.modifiers-and-parallelism'],
    },
  ],
  pointers: [
    { content: `Parallelism is a test of FORM, not of meaning. Read each item after the shared opener "who could": "who could greet" works, "who could to hand out" does not, and "who could directing" does not. Item one sets the pattern, so match the others to it. CORRECT: "The committee wanted volunteers who could greet guests, hand out programs, and direct people to their seats."`, kind: 'common-error' },
    { content: `A modifier describes whatever sits nearest to it, so misplacing it changes the meaning of the sentence rather than just its style.`, kind: 'tip' },
    { content: `Comma check: the first noun after an opening phrase must be able to do what the phrase describes — naming the true doer later in the sentence never repairs a dangler.`, kind: 'tip' },
    { content: 'Place only, almost, just, and even directly in front of the word they limit.', kind: 'tip' },
    { content: `Every item in a series, correlative pair, or comparison must share one grammatical form; when one item breaks the pattern, repair that item instead of rewriting the list.`, kind: 'tip' },
    { content: `A dangler is not fixed by naming the doer *anywhere* in the sentence. "...the resume was printed by Dana" still fails — the noun right after the comma is still "the resume." Only the subject position counts.`, kind: 'common-error' },
    { content: `Parallelism is a test of FORM, not of meaning. "Each item makes sense on its own" proves nothing. Say the shared opener aloud with each item: "who could greet" ✓, "who could to hand out" ✗.`, kind: 'gotcha' },
    { content: `Don't confuse *misplaced* with *dangling*. Misplaced = the right doer is in the sentence but sitting in the wrong spot (move the phrase). Dangling = the doer never appears as a subject at all (rewrite, don't just move).`, kind: 'vocab-note' },
    { content: `When one item in a list breaks the pattern, fix that item — don't rewrite all four. Find the item the others agree with (usually the first), and convert the odd one to match it.`, kind: 'tip' },
    { content: `*Only, just, almost, even, nearly* go directly in front of the word they limit. "I only edited two paragraphs" ≠ "I edited only two paragraphs." Decide the meaning first, then place the word — neither version is grammatically wrong.`, kind: 'edge-case' },
    { content: `A dangler has two legal repairs, not one: promote the true doer to subject ("...,  Dana printed...") OR give the opening phrase its own subject ("Because Dana hoped..., she printed..."). Pick whichever keeps your emphasis.`, kind: 'tip' },
    { content: `Correlative pairs and *than/as* comparisons follow the same matching rule as lists. After *not only...but also*, *either...or*, *neither...nor*, *both...and*, the two halves must be the same grammatical form.`, kind: 'edge-case' },
    { content: `Test series items against the SHARED opener, not against each other in isolation. In "will answer the phones, scheduling..., to update...", the word doing the testing is "will" — say "will scheduling" out loud and the break is obvious.`, kind: 'tip' },
  ],
};
