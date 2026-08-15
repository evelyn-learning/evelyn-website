/**
 * Digital SAT — Unit 8 CED 8.4: Plurals, Possessives & Frequently Confused Words.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.plurals-possessives-confusables.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U8_PLURALS_POSSESSIVES_CONFUSABLES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.plurals-possessives-confusables.v1',
  course: 'Digital SAT',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Plurals, Possessives & Frequently Confused Words',
  planId: 'evelyn.testprep.dsat.plurals-possessives-confusables.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.plurals-possessives-confusables.v1' }],
  theory: [
    { loId: 'dsat.plurals-possessives-confusables', kind: 'framework', title: 'The substitution test', content: `THE SUBSTITUTION TEST — for any pair where one option is a contraction (it's, they're, who's), mentally expand it to the two words it stands for. If the sentence still reads correctly, the contraction is right; if not, use the non-contraction form.` },
    { loId: 'dsat.plurals-possessives-confusables', content: `ITS vs IT'S — "its" is a possessive pronoun, no apostrophe, same family as "his" or "her": "The company raised its prices." "It's" is ONLY ever a contraction for "it is" or "it has": "It's raining."` },
    { loId: 'dsat.plurals-possessives-confusables', content: `THEIR vs THERE vs THEY'RE — "their" = possessive ("their prices"); "there" = a place or "there is/are" ("put it there," "there are two options"); "they're" = "they are" ("they're leaving soon").` },
    { loId: 'dsat.plurals-possessives-confusables', content: `WHOSE vs WHO'S — "whose" = possessive, used for people or things ("the writer whose article..."); "who's" = "who is" or "who has" ("who's calling?").` },
    { loId: 'dsat.plurals-possessives-confusables', content: `AN APOSTROPHE NEVER SIGNALS A PLAIN PLURAL. "The dogs barked" (plural, no apostrophe). "The dog's leash" (ONE dog owns it). "The dogs' leashes" (MULTIPLE dogs own them).` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'framework', title: 'Plural possessive placement', content: `PLURAL POSSESSIVE PLACEMENT — pluralize the noun FIRST, then add the apostrophe. Regular plural already ending in -s: add just an apostrophe (student → students → students'). Irregular plural NOT ending in -s: add 's (child → children → children's, woman → women → women's).` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'framework', title: `The SAT's trap pattern`, content: `THE SAT'S TRAP PATTERN — the test plants a plural noun right next to the blank to bait "their" when the true antecedent is singular (needs "its"), or plants a singular-looking noun to bait "its"/"'s" when the true antecedent is plural. Always trace the word back to what it actually replaces or modifies before picking.` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'framework', title: 'No calculator for grammar, same discipline', content: `NO CALCULATOR FOR GRAMMAR, SAME DISCIPLINE — reread the full sentence with your choice plugged in and confirm it says what the passage MEANS, not just what "sounds right" out of habit.` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'definition', title: 'contraction', content: `two words shortened into one, with an apostrophe marking the missing letters (it's = it is).` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'definition', title: 'possessive', content: `a word form that shows ownership (its, whose, students').` },
    { loId: 'dsat.plurals-possessives-confusables', kind: 'definition', title: 'homophone', content: `words that sound alike but differ in spelling and meaning (their/there/they're).` },
  ],
  methods: [
    {
      title: 'Worked their there theyre',
      steps: [
        `The blank needs a word that shows possession — the "favorite part" belongs to the residents who look forward to the deliveries, so a possessive pronoun is needed.`,
        `Test (c) "they're": substitute "they are" → "have become they are favorite part" — breaks down. Eliminate.`,
        `Test (b) "there": signals a place or "there is/are," and doesn't fit directly before a noun like "favorite part." Eliminate.`,
        `(a) "Their" is the possessive pronoun modifying "favorite part": "have become their favorite part of the week." Correct.`,
      ],
      example: { problem: `Read the passage: "A local bakery started delivering fresh bread to nearby apartment buildings every Saturday morning. Residents quickly began leaving notes of thanks, and several buildings now keep a standing order. The bakery's owner says the deliveries have become ___ favorite part of the week." Which choice completes the text with the most logical word: (a) their (b) there (c) they're?`, solution: 'their' },
      relatedLoIds: ['dsat.plurals-possessives-confusables'],
    },
    {
      title: 'Worked its plural possessive trap',
      steps: [
        `Find the antecedent of the blank: whose boarding passes? "Most travelers" — plural — so the pronoun must be plural, not a word built around a single "it."`,
        `Test (b) "it's": substitute "it is" → "because it is boarding passes now display" — fails grammatically. Eliminate.`,
        `Test (a) "its": would mean the boarding passes belong to one "it" (say, the airline as a whole), but the sentence is about what the travelers themselves see on their own passes — "its" doesn't agree in number with "travelers." Eliminate.`,
        `(c) "Their" agrees with the plural antecedent "travelers": "their boarding passes." Correct.`,
        `Bonus check already inside the passage: "the agents' notes" is correctly PLURAL possessive — many gate agents, apostrophe placed after the existing -s. "The agent's notes" would wrongly imply just one agent.`,
      ],
      example: { problem: `Read the passage: "A regional airline surveyed passengers after switching to a new boarding system. The survey found that most travelers preferred the new process because ___ boarding passes now display seat groups in bigger print. Airline managers also reviewed feedback submitted by gate agents across twelve airports before finalizing the change; the agents' notes shaped several small adjustments to the announcement script." Which choice completes the blank: (a) its (b) it's (c) their?`, solution: 'their' },
      relatedLoIds: ['dsat.plurals-possessives-confusables'],
    },
  ],
  pointers: [
    { content: `Since MANY students each contributed a project, the possessive must be PLURAL: pluralize first (student → students), then add just an apostrophe, since "students" already ends in -s → students'. Correct: "All of the students' projects were displayed in the hallway." Only add 's for plurals that DON'T already end in -s, like children's or women's.`, kind: 'common-error' },
    { content: `An apostrophe never makes a word plural: cats (plural) vs. cat's (one owner) vs. cats' (multiple owners).`, kind: 'tip' },
    { content: `it's = it is/has; its = possessive. their = possessive plural; there = place/"there is/are"; they're = they are. whose = possessive; who's = who is/has. Substitute the full words to test any contraction.`, kind: 'tip' },
    { content: `For plural possessives, pluralize the noun first, then add just an apostrophe (students') — only add 's for irregular plurals that don't already end in -s (children's).`, kind: 'tip' },
    { content: `Reread the full sentence with your choice plugged in before answering — that single habit catches nearly every trap in this topic.`, kind: 'tip' },
    { content: `When answer choices differ ONLY by apostrophe placement (*team's / teams' / teams*), the grammar isn't the question — the passage's meaning is. Scan back for a number word ("three coaches," "every member," "both schools") to decide singular vs. plural before you look at the apostrophe.`, kind: 'gotcha' },
    { content: `Beware the noun sitting right before the blank. "The bakery's owner says the deliveries have become ___ favorite part" — "deliveries" is plural and adjacent, but ownership traces to the residents. Ask "who owns it?" not "what word is closest?"`, kind: 'common-error' },
    { content: `"Its'" is not a word — ever. If it appears as a choice, cross it out on sight. Same for "whose's" or "there's" used to show possession before a noun ("there's books" is wrong).`, kind: 'edge-case' },
    { content: `The substitution test also kills "there's" and "they're" fast: expand to "there is" / "they are." If a plural noun follows ("they're prototypes"), it collapses immediately. Do the expansion out loud in your head, not a vibe-check.`, kind: 'tip' },
    { content: `"Whose" works for THINGS, not just people: "the theory whose predictions failed" is correct. Don't eliminate "whose" just because the antecedent is an object or idea — the SAT rewards that in science-passage questions.`, kind: 'vocab-note' },
    { content: `Nouns ending in -s that are SINGULAR (a business, a campus, the class) still take 's: "the business's founder," "the class's schedule." The final -s doesn't automatically mean apostrophe-only — check if the noun names one thing or many.`, kind: 'edge-case' },
    { content: `Decades, acronyms, and plain plurals take NO apostrophe: "the 1990s," "three CEOs," "the photographs were sorted." If nothing in the sentence is being owned, the apostrophe choice is wrong no matter how it sounds.`, kind: 'common-error' },
    { content: `Don't let a plural possessive fool you into a plural verb. "The children's exhibit **opens** Friday" — the subject is *exhibit*, singular. Cross out the possessive phrase and find the real subject before checking agreement.`, kind: 'gotcha' },
  ],
};
