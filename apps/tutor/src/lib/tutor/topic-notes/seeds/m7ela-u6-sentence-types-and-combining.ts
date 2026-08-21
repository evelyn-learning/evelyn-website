/**
 * Grade 7 English Language Arts — Unit 6 CED 6.2: Sentence Types & Combining.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.sentence-types-and-combining.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U6_SENTENCE_TYPES_AND_COMBINING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.sentence-types-and-combining.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Sentence Types & Combining',
  planId: 'evelyn.ms.m7ela.sentence-types-and-combining.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.sentence-types-and-combining.v1' }],
  theory: [
    { loId: 'm7ela.sentence-types-and-combining', content: `EVERY SENTENCE IS BUILT FROM CLAUSES, AND THERE ARE TWO KINDS. An INDEPENDENT clause has a subject, a verb, and a finished thought, so it could stand alone: "Devon fixed the chain." A DEPENDENT clause has a subject and a verb, but a starter word holds the thought open, so it cannot stand alone: "because the chain kept slipping." The starter words are because, although, when, since, if, while, after, before and unless. Count the two kinds and the name of the sentence falls right out.` },
    { loId: 'm7ela.sentence-types-and-combining', content: `THE FOUR TYPES, BY THE COUNT. SIMPLE = one independent clause and no dependent clause: "Devon fixed the chain on my bike." COMPOUND = two or more independent clauses joined correctly: "Devon fixed the chain, and I pumped up the tires." COMPLEX = one independent clause plus at least one dependent clause: "Because the chain kept slipping, Devon flipped my bike over." COMPOUND-COMPLEX = two or more independent clauses plus at least one dependent clause: "Because the chain kept slipping, Devon flipped my bike over, and I held the pedal still."` },
    { loId: 'm7ela.sentence-types-and-combining', content: `JOINING TWO INDEPENDENT CLAUSES TAKES REAL EQUIPMENT. Use a comma plus a joining word from for, and, nor, but, or, yet, so. Or use a semicolon. A comma all by itself is not strong enough. WRONG: "Devon fixed the chain, I pumped up the tires." CORRECT: "Devon fixed the chain, and I pumped up the tires." For a dependent clause the rule is different: put it FIRST and it takes a comma after it, put it LAST and it usually takes none. CORRECT: "When the rain stopped, we rode out." CORRECT: "We rode out when the rain stopped."` },
    { loId: 'm7ela.sentence-types-and-combining', content: `THE JOINING WORD CARRIES MEANING, AND THAT IS THE WHOLE POINT. But signals contrast. So signals result. And signals addition. Or signals a choice. Because signals cause, and although signals that something happened anyway. Pick the wrong one and you mislead the reader even though your punctuation is perfect. WRONG: "It rained all morning, so we still played the whole game." That tells the reader the rain caused them to play. CORRECT: "It rained all morning, but we still played the whole game."` },
    { loId: 'm7ela.sentence-types-and-combining', content: `COMBINING IS A CHOICE ABOUT EMPHASIS TOO. Whatever you put in the independent clause is what the reader remembers, and the dependent clause fades into the background. "Although we lost, the crowd stayed for every minute" is about the crowd. "Although the crowd stayed for every minute, we lost" is about the loss. Same two facts, different point. Decide which idea matters most, then make THAT one the independent clause.` },
    { loId: 'm7ela.sentence-types-and-combining', content: `COMPOUND DOES NOT MEAN TWO OF ANYTHING. A compound SUBJECT is two people sharing one verb, and the sentence is still SIMPLE: "Maya and Devon left early" has one clause. A compound VERB is one subject doing two things, and that sentence is SIMPLE as well: "Maya washed the dishes and dried them." No comma goes before that "and". Before you call a sentence compound, check that each side of the joining word has its own subject AND its own verb.` },
    { loId: 'm7ela.sentence-types-and-combining', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.` },
    { loId: 'm7ela.sentence-types-and-combining', kind: 'definition', title: 'dependent clause', content: `a clause held open by a starter word such as because or although, so it cannot stand alone.` },
    { loId: 'm7ela.sentence-types-and-combining', kind: 'definition', title: 'starter word', content: `a word such as because, although, when, since, if, while, after, before or unless that turns a clause into a dependent clause.` },
    { loId: 'm7ela.sentence-types-and-combining', kind: 'definition', title: 'joining word', content: `one of for, and, nor, but, or, yet, so, used with a comma to join two independent clauses.` },
    { loId: 'm7ela.sentence-types-and-combining', kind: 'definition', title: 'compound-complex sentence', content: `a sentence with two or more independent clauses plus at least one dependent clause.` },
  ],
  methods: [
    {
      title: 'Worked name the type',
      steps: [
        `Find every subject-and-verb pair first. There are three: "the power went out", "my dad lit two candles", and "my little brother laughed at the shadows on the wall".`,
        `Check pair one for a starter word. It opens with "When", so the thought is held open and the clause cannot stand alone. That is one DEPENDENT clause.`,
        `Test pair two on its own. "My dad lit two candles." Subject, verb, finished thought. That is an INDEPENDENT clause.`,
        `Test pair three on its own. "My little brother laughed at the shadows on the wall." Also independent. So there are two independent clauses, and they are joined the legal way, with a comma plus the joining word "and".`,
        'Read off the count. Two independent plus one dependent is COMPOUND-COMPLEX.',
        `Notice the comma after "out". The dependent clause came first, so it takes a comma after it. If you flipped it to the end you would drop that comma: "My dad lit two candles when the power went out."`,
      ],
      example: { problem: `Name the sentence type. "When the power went out, my dad lit two candles, and my little brother laughed at the shadows on the wall."`, solution: `Compound-complex — one dependent clause ("When the power went out") plus two independent clauses joined by a comma and "and".` },
      relatedLoIds: ['m7ela.sentence-types-and-combining'],
    },
    {
      title: 'Worked combine choose the word',
      steps: [
        `Test each side of the comma alone. "Our team practiced every morning for a month." Complete sentence. "We lost the first game." Complete sentence. So this is two independent clauses.`,
        `Two independent clauses held together by only a comma is a comma splice. The draft is WRONG: "Our team practiced every morning for a month, we lost the first game." A comma by itself cannot do that job.`,
        `Do not reach for punctuation yet. Name the relationship first. All that practice should have produced a win, and it did not. That is contrast, not result.`,
        `So the joining word "so" would be WRONG here: "Our team practiced every morning for a month, so we lost the first game." Read that back. It tells the reader the practicing CAUSED the loss, which is not what happened.`,
        `The word "but" signals contrast, so it fits. CORRECT: "Our team practiced every morning for a month, but we lost the first game." That is a compound sentence: two independent clauses, comma plus a joining word.`,
        `A complex sentence works too, and it shifts the emphasis. CORRECT: "Although our team practiced every morning for a month, we lost the first game." The starter word "Although" pushes the practice into the background and leaves the loss out front. Both versions are correct. Pick the one that says what you want the reader to walk away with.`,
      ],
      example: { problem: `Combine these so the reader can tell how the ideas relate. "Our team practiced every morning for a month. We lost the first game." A student turned in this: "Our team practiced every morning for a month, we lost the first game." Is that right?`, solution: `The draft is a comma splice. CORRECT: "Our team practiced every morning for a month, but we lost the first game." (compound), or "Although our team practiced every morning for a month, we lost the first game." (complex).` },
      relatedLoIds: ['m7ela.sentence-types-and-combining'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, it is compound, because it is long and it has commas and an "and"." — Count clauses, not words. There is exactly one subject here, "my whole family", and it runs both verbs: squeezed and drove. That is a compound VERB inside one clause, not a second clause, which is also why no comma belongs before that "and". The words between the commas, "including my grandmother and the dog", have no subject and no verb at all, so they are only a phrase. One independent clause and no dependent clause makes this sentence SIMPLE, however long it runs.`, kind: 'common-error' },
    { content: `Students often say "Yes, because "my grandmother and the dog" is two things, so it is compound." — Compound describes the SENTENCE, and a compound sentence needs two independent clauses. "Maya and Devon left early" names two people, but there is one verb and one clause, so that sentence is SIMPLE. CORRECT compound version: "Maya left early, and Devon stayed for the whole game." Now each side of the joining word has its own subject and its own verb.`, kind: 'common-error' },
    { content: `Name any sentence with two counts. Simple = 1 independent clause. Compound = 2 or more independent. Complex = 1 independent plus at least 1 dependent. Compound-complex = 2 or more independent plus at least 1 dependent.`, kind: 'tip' },
    { content: `Join two independent clauses with a comma plus for, and, nor, but, or, yet, so, or with a semicolon. WRONG: "Devon fixed the chain, I pumped up the tires." CORRECT: "Devon fixed the chain, and I pumped up the tires."`, kind: 'tip' },
    { content: `A dependent clause placed first takes a comma after it; placed last it usually takes none.`, kind: 'tip' },
    { content: `The joining word carries the meaning: but for contrast, so for result, and for addition, or for a choice, because for cause. The wrong word misleads the reader even when the punctuation is right.`, kind: 'tip' },
    { content: `Whatever sits in the independent clause is what the reader remembers, so put the idea that matters most there.`, kind: 'tip' },
    { content: `Compound does not mean two of anything. "Maya and Devon left early" is SIMPLE. Check that each side of the joining word has its own subject and its own verb.`, kind: 'tip' },
    { content: `Before you call a sentence compound, cover the joining word and read each side alone. If one side is missing a subject or a verb, it's a compound verb or compound subject — the sentence is still SIMPLE. "Maya washed the dishes and dried them" = simple, and no comma before that "and".`, kind: 'common-error' },
    { content: `Length and commas prove nothing. A long sentence stuffed with commas can still be SIMPLE if it has one subject-verb pair. Phrases like "including my grandmother and the dog" have no subject and no verb, so they never count as clauses.`, kind: 'gotcha' },
    { content: `Don't mix up "starter word" and "joining word". Starter words (because, although, when, since, if, while, after, before, unless) make a clause DEPENDENT. Joining words (for, and, nor, but, or, yet, so) glue two INDEPENDENT clauses with a comma. Different jobs, different punctuation.`, kind: 'vocab-note' },
    { content: `Two complete sentences held together by only a comma is a comma splice. "We practiced hard, we lost." WRONG. Fix it three ways: add a joining word, swap in a semicolon, or make one side dependent with a starter word.`, kind: 'common-error' },
    { content: `Name the relationship in your head BEFORE you pick the word. Ask: is this contrast, cause, result, addition, or a choice? "It rained all morning, so we still played" is punctuated perfectly and still tells the reader the wrong thing. It should be "but".`, kind: 'tip' },
    { content: `The comma with a dependent clause depends on WHERE it sits. Front: comma after it — "When the power went out, we lit candles." Back: usually no comma — "We lit candles when the power went out." Moving the clause means moving or dropping the comma.`, kind: 'edge-case' },
    { content: `Both orders can be grammatically correct and still say different things. "Although we lost, the crowd stayed" is about the crowd; "Although the crowd stayed, we lost" is about the loss. Put the idea you want remembered in the INDEPENDENT clause.`, kind: 'edge-case' },
    { content: `Compound-complex needs BOTH: at least two independent clauses AND at least one dependent clause. One independent plus two dependents is still just COMPLEX. Count each kind separately before you name it.`, kind: 'gotcha' },
  ],
};
