/**
 * Grade 7 English Language Arts — Unit 6 CED 6.1: Phrases & Clauses.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.phrases-and-clauses.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U6_PHRASES_AND_CLAUSES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.phrases-and-clauses.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Phrases & Clauses',
  planId: 'evelyn.ms.m7ela.phrases-and-clauses.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.phrases-and-clauses.v1' }],
  theory: [
    { loId: 'm7ela.phrases-and-clauses', kind: 'framework', title: 'The one test', content: `THE ONE TEST — DOES IT HAVE A SUBJECT AND A VERB? A CLAUSE has a subject-verb pair: somebody or something, plus what they do or are. A PHRASE does not have that pair. "The crowd cheered" is a clause, because the crowd is the doer and cheered is the action. "Under the bleachers" is a phrase, because nothing does anything in it. Ask two questions every time: who or what, and doing what?` },
    { loId: 'm7ela.phrases-and-clauses', content: `PREPOSITIONAL PHRASES ARE THE ONES YOU WRITE MOST. They start with a little location or time word such as under, over, in, on, after, before, with, or behind, and they end with a noun: "under the bleachers", "after the game", "with my cousin". They tell you where or when. They never have a subject-verb pair, so they can never be a sentence on their own. WRONG: "Under the bleachers." CORRECT: "We found my water bottle under the bleachers."` },
    { loId: 'm7ela.phrases-and-clauses', content: `AN -ING PHRASE IS STILL A PHRASE. "Running for the bus" looks like it has a verb in it, and that is the trap. Ask who is running. The words never say, so there is no subject. An -ing word by itself is also not acting as the verb; it needs a helper such as was or is. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus." Now there is a subject, Jordan, and a verb, was running, so now it is a clause.` },
    { loId: 'm7ela.phrases-and-clauses', content: `AN INDEPENDENT CLAUSE FINISHES THE THOUGHT. It has a subject, a verb, and nothing holding it open, so it can stand alone with a capital letter and a period: "We ate the whole pizza." This is the only kind of group that is allowed to be a sentence by itself.` },
    { loId: 'm7ela.phrases-and-clauses', content: `A DEPENDENT CLAUSE HAS THE PAIR AND STILL CANNOT STAND ALONE, because a STARTER WORD is stuck on the front. The starter words are because, although, when, since, if, while, after, unless and before. "After we ate the whole pizza" has a subject, we, and a verb, ate, and you are still waiting to hear what happened next. A dependent clause is not a mistake. It is only a mistake when you punctuate it as its own sentence, and you will fix that in a later lesson in this unit. CORRECT: "After we ate the whole pizza, we started on the garlic bread."` },
    { loId: 'm7ela.phrases-and-clauses', content: `RELATIVE PRONOUNS ALSO OPEN DEPENDENT CLAUSES, and these ones hide in the middle of a sentence instead of at the front. The relative pronouns are who, which and that. In "The kid WHO SITS BEHIND ME borrowed my eraser", the words who sits behind me make a dependent clause: who is the doer and sits is the action. It describes the kid. The sentence still needs its own main subject, the kid, and its own main verb, borrowed. LENGTH DECIDES NOTHING here or anywhere: "Rain fell" is two words and a clause, and "under the bleachers behind the gym" is six words and a phrase.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'phrase', content: `a group of words with NO subject-verb pair, such as "under the bleachers" or "running for the bus"; it adds detail and can never be a sentence by itself.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'clause', content: `a group of words that DOES have a subject-verb pair; every clause is either independent or dependent.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'dependent clause', content: `a clause held open by a starter word such as because or although, so it cannot stand alone.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'starter word', content: `a word such as because, although, when, since, if, while, after, unless or before that is placed in front of a clause and makes it dependent.` },
    { loId: 'm7ela.phrases-and-clauses', kind: 'definition', title: 'relative pronoun', content: `who, which or that, used to open a dependent clause that describes a noun, as in "the kid who sits behind me".` },
  ],
  methods: [
    {
      title: 'Worked sort the parts',
      steps: [
        `Group 1. Ask who or what is the doer. Nobody. Ask what the action is. There is not one. The words only tell you a place, and they start with the little location word "under". Verdict: PHRASE, and specifically a prepositional phrase. Six words did not help it; length is not the test.`,
        `Group 2. Who or what? We. Doing what? Ate. There is a real subject-verb pair, so this is a clause. Now check the front for a starter word. There is none, and the thought is finished. Verdict: INDEPENDENT CLAUSE. It could be a sentence exactly as it stands: "We ate the whole pizza."`,
        `Group 3. The pair has not changed. The subject is still we and the verb is still ate. But the starter word "after" now sits on the front, and it holds the thought open. You are waiting to hear what happened next. Verdict: DEPENDENT CLAUSE.`,
        `Look at what one word did. Groups 2 and 3 have the exact same subject and the exact same verb. The starter word alone decides whether the group can stand alone.`,
        `Group 3 is not wrong. It just needs to lean on an independent clause. CORRECT: "After we ate the whole pizza, we started on the garlic bread." WRONG: "After we ate the whole pizza." on its own with a period, because a dependent clause punctuated as a sentence is a fragment.`,
      ],
      example: { problem: `Label each group as a phrase, an independent clause, or a dependent clause. (1) "under the bleachers behind the gym" (2) "we ate the whole pizza" (3) "after we ate the whole pizza"`, solution: `1 = phrase (prepositional), 2 = independent clause, 3 = dependent clause — the starter word "after" is the only difference between 2 and 3` },
      relatedLoIds: ['m7ela.phrases-and-clauses'],
    },
    {
      title: 'Worked verb lookalike',
      steps: [
        `Take the claim seriously and look for the verb first. "Sprinting" is the only word that looks like an action, and that is exactly the bait. An -ing word standing on its own is not acting as the verb of a clause. It needs a helper such as was, is or were.`,
        `Now hunt for the subject, which is the half students forget. Ask who is sprinting. Read the words again. They never say. There is no doer anywhere in the group.`,
        `No subject-verb pair means no clause. Verdict: this is a PHRASE. WRONG: "Sprinting across the parking lot with two heavy grocery bags." punctuated as a sentence.`,
        `Notice that the student was fooled by length as well. Ten words of detail feel complete, and "Rain fell" feels too small to be a sentence. Both feelings are wrong. The subject-verb pair is the only test.`,
        `Smallest honest fix: give it a subject and a real verb. CORRECT: "Dad was sprinting across the parking lot with two heavy grocery bags." Subject: Dad. Verb: was sprinting. Now it is an independent clause.`,
        `A second correct fix keeps the phrase and attaches it to a clause: "Sprinting across the parking lot with two heavy grocery bags, Dad dropped the eggs." The phrase still has no subject of its own, and now it does not need one, because the sentence has one.`,
      ],
      example: { problem: `A student says that "Sprinting across the parking lot with two heavy grocery bags" is a clause, because "sprinting" is a verb. Is the student right? If not, what is the smallest honest fix?`, solution: `The student is wrong. It is a phrase, not a clause, because it has no subject and "sprinting" is not acting as the verb. Fix: "Dad was sprinting across the parking lot with two heavy grocery bags."` },
      relatedLoIds: ['m7ela.phrases-and-clauses'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes. The long group is a clause and the short group is a phrase." — The student has it backward, both times. "Under the bleachers behind the gym on a cold Friday night" has no doer and no action anywhere in it. It is a stack of prepositional phrases telling you where and when, so it is a PHRASE, and it would still be a phrase at thirty words. "Rain fell" has a subject, rain, and a verb, fell, so it is a CLAUSE, and an independent one, which means it is a complete sentence. Length has nothing to do with it. The subject-verb pair decides.`, kind: 'common-error' },
    { content: `Students often say "No, but "running for the bus" is a clause, because "running" is a verb." — Ask who is running. The words never say, so there is no subject at all. An -ing word by itself is also not acting as the verb of a clause; it needs a helper such as was or is. So "running for the bus" is a PHRASE. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus." That version has a subject, Jordan, and a verb, was running, so that version is a clause.`, kind: 'common-error' },
    { content: `Run one test on any group of words: who or what is the doer, and what is the action? A subject-verb pair means a clause. No pair means a phrase.`, kind: 'tip' },
    { content: `Prepositional phrases such as "under the bleachers" and "after the game" only tell you where or when, and they can never be a sentence by themselves.`, kind: 'tip' },
    { content: `An -ing word alone is not acting as a verb. WRONG: "Running for the bus." CORRECT: "Jordan was running for the bus."`, kind: 'tip' },
    { content: `An independent clause finishes the thought and can stand alone: "We ate the whole pizza."`, kind: 'tip' },
    { content: `A starter word (because, although, when, since, if, while, after, unless, before) or a relative pronoun (who, which, that) makes a clause dependent, so it has to lean on an independent clause. A dependent clause is only a fragment when you punctuate it as its own sentence.`, kind: 'tip' },
    { content: `Length proves nothing in either direction. "Rain fell" is a clause and "under the bleachers behind the gym" is a phrase.`, kind: 'tip' },
    { content: `Length is not the test. "Rain fell" (2 words) is a clause; "under the bleachers behind the gym on a cold night" (10 words) is still a phrase. Always hunt for the subject-verb pair, never count words.`, kind: 'common-error' },
    { content: `An -ing word alone is not the verb of a clause. Before you call "sprinting across the lot" a clause, ask **who** is sprinting. If the words never say, it's a phrase. Add a subject and a helper: "Dad **was sprinting** across the lot."`, kind: 'gotcha' },
    { content: `"After" and "before" wear two hats. In "after the game" they start a prepositional **phrase** (no doer). In "after we ate" they are starter words on a dependent **clause** (we + ate). Look at what follows the word, not the word itself.`, kind: 'edge-case' },
    { content: `Don't call a dependent clause a mistake. "After we ate the whole pizza" is a perfectly good clause — it only becomes a fragment when you put a capital and a period around it and leave it alone.`, kind: 'vocab-note' },
    { content: `Ask both questions, not one. Many students find a verb, stop, and say "clause." You need **who or what** AND **doing what**. Missing either half means phrase.`, kind: 'tip' },
    { content: `Dependent clauses don't always sit at the front. A who/which/that clause hides inside the sentence: in "The kid **who sits behind me** borrowed my eraser," the main subject is *kid* and the main verb is *borrowed* — not *who* and *sits*.`, kind: 'edge-case' },
    { content: `Every clause is independent or dependent — pick one. Don't write "it's a clause" and stop. Step 1: is there a subject-verb pair? Step 2: is there a starter word or who/which/that on the front?`, kind: 'tip' },
    { content: `"Which" and "that" open clauses, but a preposition + noun with no doer is still a phrase. "With my cousin" has a noun — nouns alone aren't subjects. A subject must be doing or being something.`, kind: 'common-error' },
  ],
};
