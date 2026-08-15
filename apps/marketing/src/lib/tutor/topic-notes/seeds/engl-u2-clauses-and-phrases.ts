/**
 * HS English — Unit 2 CED 2.1: Phrases & Clauses.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.clauses-and-phrases.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U2_CLAUSES_AND_PHRASES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.clauses-and-phrases.v1',
  course: 'HS English',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Phrases & Clauses',
  planId: 'evelyn.hs.engl.clauses-and-phrases.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.clauses-and-phrases.v1' }],
  theory: [
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'The one test', content: `THE ONE TEST — a CLAUSE contains a subject-verb pair: somebody or something plus what it does or is. A PHRASE does not. "In the crowded gym" is a phrase; "the crowd cheered" is a clause. Hunt the pair first, and every other question gets easier.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Phrase types worth knowing', content: `PHRASE TYPES WORTH KNOWING — prepositional ("after the storm"), appositive ("my neighbor, a retired welder"), participial ("carrying two folding chairs"), and infinitive ("to finish the interview"). All of them add detail; none of them can be a sentence, no matter how long they run.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Independent clause', content: `INDEPENDENT CLAUSE — subject plus verb plus a complete thought, able to stand alone with a capital letter and a period: "The interview ran long." This is the only unit that can legally be a sentence by itself.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Dependent clause', content: `DEPENDENT CLAUSE — a real subject-verb pair that still cannot stand alone, because a SUBORDINATOR is glued to the front: after, although, as, because, before, if, since, unless, until, when, whenever, while, whereas. "Because the interview ran long" has a subject and a verb and is still not a sentence.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Relative clauses', content: `RELATIVE CLAUSES — who, whom, whose, which, and that also open dependent clauses, and these hide inside sentences rather than at the front: "The reporter WHO ARRIVED LAST asked the sharpest question." The relative clause modifies a noun; the sentence still needs its own main subject and verb.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Classic error 1', content: `CLASSIC ERROR 1 — VERBAL MISTAKEN FOR A VERB. An -ing word alone is not a verb, so "Carrying two folding chairs across the parking lot" is a phrase, not a clause. WRONG: "Carrying two folding chairs across the parking lot." CORRECT: "She was carrying two folding chairs across the parking lot." A helping verb, or a different verb entirely, is what turns the verbal into a real predicate.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Classic error 2', content: `CLASSIC ERROR 2 — DEPENDENT CLAUSE PUNCTUATED AS A SENTENCE. Because the pair is genuinely there, the ear says the words are complete. WRONG: "Although the team practiced every morning before school." CORRECT: "Although the team practiced every morning before school, it lost the opening match." Either attach the dependent clause to an independent clause or delete the subordinator.` },
    { loId: 'engl.clauses-and-phrases', kind: 'framework', title: 'Classic error 3', content: `CLASSIC ERROR 3 — LENGTH USED AS THE TEST. Length proves nothing. "The volunteers unloading crates behind the community center in the rain" is a long noun plus phrases with no main verb, while "Rain fell" is a complete sentence of two words. Count the subject-verb pair, not the words.` },
    { loId: 'engl.clauses-and-phrases', kind: 'definition', title: 'phrase', content: `a group of related words with NO subject-verb pair, such as "after the storm" or "carrying two chairs"; it adds detail and can never stand alone.` },
    { loId: 'engl.clauses-and-phrases', kind: 'definition', title: 'clause', content: `a group of words that DOES contain a subject-verb pair; it is either independent (stands alone) or dependent (cannot).` },
    { loId: 'engl.clauses-and-phrases', kind: 'definition', title: 'subordinator', content: `a word such as because, although, when, if, or since that turns an otherwise complete clause into a dependent one.` },
    { loId: 'engl.clauses-and-phrases', kind: 'definition', title: 'verbal', content: `a verb form used as a noun, adjective, or adverb — an -ing word, a to-form, or a participle — which cannot serve as the verb of a clause by itself.` },
  ],
  methods: [
    {
      title: 'Worked sort the parts',
      steps: [
        `Group 1: hunt for a subject-verb pair. "Under the flickering stage lights" names a place and does nothing — no doer, no action. Verdict: PHRASE, specifically a prepositional phrase.`,
        `Group 2: the doer is "the understudy" and the action is "forgot". A pair exists, so this is a clause. Now check the front for a subordinator: there is none, and the thought closes. Verdict: INDEPENDENT CLAUSE.`,
        `Group 3: the same pair is still there, "the understudy" plus "forgot". But "when" now sits in front, and the reader is left waiting for what happened next. Verdict: DEPENDENT CLAUSE.`,
        `Notice what one word did. Groups 2 and 3 have identical subject-verb pairs; the subordinator alone decides whether the words can be a sentence. Attach group 3 to group 2 and the result works: "When the understudy forgot her opening line, the stage manager fed her the words from the wings."`,
      ],
      example: { problem: `Sort each group of words as a phrase, an independent clause, or a dependent clause: (1) "under the flickering stage lights", (2) "the understudy forgot her opening line", (3) "when the understudy forgot her opening line".`, solution: `1 = phrase, 2 = independent clause, 3 = dependent clause — the subordinator "when" is the only difference between 2 and 3` },
      relatedLoIds: ['engl.clauses-and-phrases'],
    },
    {
      title: 'Worked verbal trap',
      steps: [
        `Look for the verb first. "Sprinting" feels like the action, and that is exactly the bait — an -ing word standing alone is a verbal, not the verb of a clause.`,
        `Now look for the subject. Ask who is sprinting. The words never say. There is no doer at all, so there is no subject-verb pair.`,
        `Verdict: this is a participial PHRASE, not a clause, so labeling it WRONG as a sentence is correct. Length made it feel complete; twelve words of detail cannot substitute for a subject and a verb.`,
        `Smallest honest fix: supply a subject and a real verb. CORRECT: "She was sprinting toward the last open ticket window in the station." Another correct fix attaches the phrase to an independent clause: "Sprinting toward the last open ticket window in the station, she dropped her boarding pass."`,
      ],
      example: { problem: `A student writes this and defends it as a sentence: "Sprinting toward the last open ticket window in the station." Is it a sentence? If not, what is the smallest honest fix?`, solution: `Not a sentence — it is a participial phrase with no subject-verb pair; fix it as "She was sprinting toward the last open ticket window in the station."` },
      relatedLoIds: ['engl.clauses-and-phrases'],
    },
  ],
  pointers: [
    { content: `The pair is real, so this is a clause — but "while" subordinates it, and the reader is still waiting to learn what happened during that time. Every clause is either independent or dependent, and only an independent one can be a sentence. Two correct fixes: attach it, as in "While the projector warmed up in the dark auditorium, the debate team argued about seating"; or drop the subordinator, as in "The projector warmed up in the dark auditorium."`, kind: 'common-error' },
    { content: `Hunt the subject-verb pair first: a pair means a clause, and no pair means a phrase, however long the words run.`, kind: 'tip' },
    { content: `An -ing word, a to-form, or a lone participle is a verbal, not a verb — it can never be the verb of a clause by itself.`, kind: 'tip' },
    { content: `A clause with a subordinator (because, although, when, while, if, since) or a relative pronoun (who, which, that) is DEPENDENT and cannot stand alone.`, kind: 'tip' },
    { content: `Only an independent clause can be a sentence, so fix a dependent one by attaching it to an independent clause or by deleting the subordinator.`, kind: 'tip' },
    { content: `Never let length decide. "Rain fell" is a complete sentence; "The volunteers unloading crates behind the community center in the rain" is not. Count the subject-verb pair, not the words.`, kind: 'common-error' },
    { content: `An -ing word alone is a **verbal**, not a verb. "Sprinting toward the window" has no verb. Test it: add a helping verb (*is/was/are*) — if you needed one, the original was a phrase.`, kind: 'gotcha' },
    { content: `Don't stop at "it has a subject and a verb." That only proves it's a *clause*. Then check the front for a subordinator — *because, although, while, when, if, since* — which makes it dependent.`, kind: 'common-error' },
    { content: `"Clause" and "sentence" are not synonyms. Every sentence contains at least one independent clause, but plenty of clauses (the dependent ones) can never be sentences. Say which kind of clause you mean.`, kind: 'vocab-note' },
    { content: `Relative clauses (*who, whom, whose, which, that*) hide in the **middle**, not the front. In "The reporter who arrived last asked the question," strip the relative clause first — the leftover must still have its own subject and verb.`, kind: 'edge-case' },
    { content: `A dependent clause has two honest fixes: attach it to an independent clause (*While the projector warmed up, the team argued*) or delete the subordinator (*The projector warmed up*). Adding a comma alone fixes nothing.`, kind: 'tip' },
    { content: `Infinitives (*to finish the interview*) are phrases, not clauses — the *to*-form is a verbal too. Don't let the word that follows *to* trick you into calling it the verb.`, kind: 'edge-case' },
    { content: `Name the phrase type when you label one: prepositional, appositive, participial, infinitive. "It's just a phrase" hides which words you'd have to change to fix the fragment.`, kind: 'vocab-note' },
  ],
};
