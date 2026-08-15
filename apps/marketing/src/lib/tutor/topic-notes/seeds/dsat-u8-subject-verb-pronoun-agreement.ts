/**
 * Digital SAT — Unit 8 CED 8.2: Subject-Verb & Pronoun Agreement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.subject-verb-pronoun-agreement.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U8_SUBJECT_VERB_PRONOUN_AGREEMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.subject-verb-pronoun-agreement.v1',
  course: 'Digital SAT',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Subject-Verb & Pronoun Agreement',
  planId: 'evelyn.testprep.dsat.subject-verb-pronoun-agreement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.subject-verb-pronoun-agreement.v1' }],
  theory: [
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Core rule', content: `CORE RULE — a verb must agree with its SUBJECT in number, and a pronoun must agree with its ANTECEDENT in number. Singular pairs with singular; plural pairs with plural.` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — THE PREPOSITIONAL-PHRASE INTERRUPTER. "The collection of rare manuscripts... was damaged." The subject is "collection" (singular) — "of rare manuscripts" is a prepositional phrase that can never contain the subject. STRIP any phrase starting with a preposition (of, in, with, for, among, between...) before choosing the verb.` },
    { loId: 'dsat.subject-verb-pronoun-agreement', content: `The strip trick cuts both ways — sometimes the real subject IS plural even though it looks buried: "The results of the study were published" — "results" is plural, so "were" is correct even after stripping "of the study."` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — INDEFINITE PRONOUNS. Each, everyone, everybody, someone, somebody, no one, nobody, either, neither, anyone, anybody = ALWAYS singular, no matter what plural noun follows in a prepositional phrase. "Each of the applicants WAS asked..." not "were."` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — COLLECTIVE NOUNS. Team, committee, family, jury, group, class = singular when acting as ONE unit — pair with singular verbs and singular pronouns ("its," not "their"). "The committee announced that ITS decision..."` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Trap 4', content: `TRAP 4 — COMPOUND SUBJECTS. Joined by AND = plural ("The teacher and the students ARE..."). Joined by OR / NOR (either...or, neither...nor) = the verb agrees with the CLOSER subject: "Neither the coach nor the players WERE ready."` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'framework', title: 'Trap 5', content: `TRAP 5 — INVERTED SENTENCES. When a sentence opens with "there is/are," "here is/are," or a question, the subject follows the verb. Find it before matching: "There ARE several reasons..." — subject is "reasons" (plural).` },
    { loId: 'dsat.subject-verb-pronoun-agreement', content: `PRONOUN-ANTECEDENT is the same trap wearing a different hat: find the true antecedent (often a singular noun modified by a plural-sounding prepositional phrase or list), then match the pronoun to IT, not to the nearest noun.` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'definition', title: 'antecedent', content: 'the noun a pronoun refers back to and must agree with in number.' },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'definition', title: 'prepositional phrase', content: `a phrase starting with a preposition (of, in, with, for...) that modifies a noun but is never the subject itself.` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'definition', title: 'indefinite pronoun', content: `a pronoun like each, everyone, or either that doesn't name a specific person or thing and is always singular.` },
    { loId: 'dsat.subject-verb-pronoun-agreement', kind: 'definition', title: 'collective noun', content: 'a singular noun (team, committee, family) that names a group acting as one unit.' },
  ],
  methods: [
    {
      title: 'Worked prep phrase',
      steps: [
        `Locate the blank's job: it needs a verb that agrees with the sentence's true subject.`,
        `Strip the prepositional phrases: "of rare manuscripts" and "in the university's archive" both modify — but can't be — the subject.`,
        `What remains: "The collection... ___ carefully preserved." The subject is "collection," which is singular.`,
        `Singular subject needs a singular verb: "was." (B), (C), and (D) all wrongly agree with the plural noun "manuscripts" sitting closest to the blank.`,
      ],
      example: { problem: `Which choice completes the text so that it conforms to the conventions of Standard English?
"The collection of rare manuscripts in the university's archive ___ carefully preserved."
(A) was  (B) were  (C) have been  (D) are`, solution: '(A) was' },
      relatedLoIds: ['dsat.subject-verb-pronoun-agreement'],
    },
    {
      title: 'Worked pronoun antecedent',
      steps: [
        'Find the antecedent the pronoun must match — not just the nearest noun.',
        `The list "grief, memory, and family loyalty" sits inside a prepositional phrase ("of grief, memory, and family loyalty") modifying "exploration" — that list can't be the antecedent.`,
        `The true antecedent is "The novel's exploration," which is singular.`,
        `A singular antecedent needs a singular pronoun: "it." (B), (C), and (D) all incorrectly agree with the plural list instead.`,
      ],
      example: { problem: `Which choice completes the text with the most logical pronoun?
"The novel's exploration of grief, memory, and family loyalty makes ___ a favorite among readers of literary fiction."
(A) it  (B) them  (C) they  (D) these`, solution: '(A) it' },
      relatedLoIds: ['dsat.subject-verb-pronoun-agreement'],
    },
  ],
  pointers: [
    { content: `Strip "of instructions" and "provided in the manual": the true subject is "set" (singular). Correct sentence: "The set of instructions provided in the manual was difficult to follow."`, kind: 'common-error' },
    { content: `Strip prepositional phrases and lists to find the TRUE subject or antecedent before checking agreement.`, kind: 'tip' },
    { content: `Indefinite pronouns (each, everyone, either, neither) and collective nouns (team, committee) are singular — even next to a plural-sounding phrase.`, kind: 'tip' },
    { content: `Compound subjects with "and" are plural; with "or/nor," the verb matches the closer subject.`, kind: 'tip' },
    { content: `A pronoun must match its true antecedent's number, not whichever noun sits closest to it.`, kind: 'tip' },
    { content: `Answer choices that differ ONLY in verb number (was/were, is/are, has/have) are the SAT flagging agreement. Don't debate meaning — just hunt the subject. If choices differ in *tense* too (was vs. will be), the question is testing something else.`, kind: 'tip' },
    { content: `Watch for a participial phrase between subject and verb: "The shipment, *delivered by three separate couriers*, **was** delayed." Commas + -ed/-ing modifiers hide the subject just as prepositional phrases do. Strip anything between the commas.`, kind: 'gotcha' },
    { content: `Plural-looking singulars: *news, mathematics, physics, economics, series, species* take singular verbs. "A series of experiments **was** conducted." The -s ending is not a plural signal.`, kind: 'edge-case' },
    { content: `Neither/nor agreement is order-sensitive. "Neither the players nor the coach **was** ready" vs. "Neither the coach nor the players **were** ready." Same meaning, different verb — always look at the noun immediately before the blank.`, kind: 'common-error' },
    { content: `"They/their" as a singular pronoun is NOT tested as an error on the digital SAT the way old grammar rules imply — but for collective nouns the test still expects **its**. "The jury reached **its** verdict." Pick *its* over *their* for team/committee/company.`, kind: 'vocab-note' },
    { content: `Possessives can't be the antecedent's number — but they can BE the antecedent. In "The **novel's** exploration... makes **it**," the subject is *exploration*, not *novel*. Ask: what noun is the sentence actually about grammatically, not thematically?`, kind: 'gotcha' },
    { content: `Quick self-check: read the sentence out loud with everything between the subject and verb deleted. If "The set... was difficult" sounds right, it is. Don't trust your ear on the full sentence — the plural noun next to the blank hijacks it.`, kind: 'tip' },
    { content: `With "there is/are" and question-order sentences, the word *there* is never the subject. "There **are** several reasons" / "**Are** the results conclusive?" Flip the sentence back to normal order before matching.`, kind: 'common-error' },
  ],
};
