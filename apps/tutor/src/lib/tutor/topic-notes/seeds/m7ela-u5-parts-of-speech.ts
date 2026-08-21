/**
 * Grade 7 English Language Arts — Unit 5 CED 5.1: Parts of Speech.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.parts-of-speech.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U5_PARTS_OF_SPEECH: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.parts-of-speech.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Parts of Speech',
  planId: 'evelyn.ms.m7ela.parts-of-speech.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.parts-of-speech.v1' }],
  theory: [
    { loId: 'm7ela.parts-of-speech', content: `A PART OF SPEECH IS A JOB, NOT A LABEL. You cannot look a word up and be finished. You have to read the sentence around it. "Run" is a verb in "They run three miles every Saturday" and a noun in "She went for a run after dinner." WRONG: "Run is a verb, so the answer is verb." CORRECT: "In this sentence run names a thing you went for, so here it is a noun."` },
    { loId: 'm7ela.parts-of-speech', content: `NOUNS NAME. A noun names a person, a place, a thing or an idea: coach, kitchen, backpack, courage. The quick test is whether you can put the or a in front of it. PRONOUNS stand in for a noun everybody already knows: I, you, he, she, it, we, they, who, everyone, nobody. In "Maya lost her helmet, so she borrowed mine", she takes the place of Maya.` },
    { loId: 'm7ela.parts-of-speech', content: `VERBS TELL WHAT HAPPENS OR WHAT IS. Action verbs are easy: kicked, chews, will shout. The test is tense. If you can say it happened yesterday and will happen tomorrow, it is working as a verb. But some verbs show no action at all. The forms of be — am, is, are, was, were — are real verbs, and any one of them can be the only verb in a sentence. In "The gym was empty", the whole verb is was. Helpers count too: in "has been waiting", the three words work together as one verb.` },
    { loId: 'm7ela.parts-of-speech', content: `ADJECTIVES DESCRIBE NOUNS, AND THEY DO NOT ALWAYS SIT IN FRONT. An adjective answers which one, what kind or how many about a noun or pronoun: "a red backpack", "three slices", "that seat". It can also come after a form of be and describe the noun back at the front: in "The pizza was cold", cold describes pizza, so cold is an adjective even though it sits at the end.` },
    { loId: 'm7ela.parts-of-speech', content: `ADVERBS DESCRIBE VERBS, ADJECTIVES AND OTHER ADVERBS. An adverb answers how, when, where or how much: "she sang loudly" tells how she sang, "we left early" tells when we left, "a very cold night" tells how cold. To name one, find the word it is describing first. If that word is a noun, you are looking at an adjective instead.` },
    { loId: 'm7ela.parts-of-speech', content: `THE LAST THREE JOBS, AND THE -LY TRAP. PREPOSITIONS sit in front of a noun and show where, when or how it fits: under the couch, after lunch, with my cousin, by one goal. CONJUNCTIONS join: and, but, or, so, yet join equal parts, while because, although, when, since attach a part that cannot stand alone. INTERJECTIONS are short bursts of feeling that stand apart: Wow, Ouch, Hey. And the trap: the -ly ending never decides anything. WRONG: "Friendly ends in -ly, so it is an adverb." CORRECT: in "a friendly driver", friendly describes the noun driver, so it is an adjective. Lonely and lively work the same way, and fast, hard and soon can all do the adverb job with no -ly at all.` },
    { loId: 'm7ela.parts-of-speech', kind: 'definition', title: 'part of speech', content: `the job a word is doing in one particular sentence — noun, pronoun, verb, adjective, adverb, preposition, conjunction or interjection.` },
    { loId: 'm7ela.parts-of-speech', kind: 'definition', title: 'modify', content: `to describe or narrow another word; adjectives modify nouns and pronouns, adverbs modify verbs, adjectives and other adverbs.` },
    { loId: 'm7ela.parts-of-speech', kind: 'definition', title: 'linking verb', content: `a verb such as am, is, are, was or were that shows no action but connects the subject to a word that describes or renames it.` },
    { loId: 'm7ela.parts-of-speech', kind: 'definition', title: 'preposition', content: `a word placed in front of a noun to show where, when or how that noun fits, such as under, after, with or by.` },
    { loId: 'm7ela.parts-of-speech', kind: 'definition', title: 'conjunction', content: `a word that joins words, phrases or clauses, such as and, but, so, because or although.` },
  ],
  methods: [
    {
      title: 'Worked name five jobs',
      steps: [
        `Start with Wow. It is not attached to anything. It is a burst of feeling sitting on its own in front of the sentence, and the sentence still works if you delete it. That is an INTERJECTION.`,
        `Now blocked. Run the tense test: yesterday the goalie blocked the shot, tomorrow the goalie will block the shot. It carries what happened, so it is a VERB.`,
        `Now easily. Ask what it is describing. It tells you HOW the goalie blocked the shot, and blocked is a verb, so easily is an ADVERB. Notice the -ly is not the reason. The reason is that it describes a verb.`,
        `Now but. Look at what is on each side of it. On the left, "the goalie blocked that shot easily." On the right, "our team still lost by one goal." Two complete thoughts, joined as equals. That is a CONJUNCTION.`,
        `Now by. It sits in front of the noun goal and starts the group "by one goal", which tells you by how much the team lost. A word placed in front of a noun to show how it fits is a PREPOSITION.`,
        `Every one of those five answers came from the same question, asked five times: what is this word doing here? No memorised list was needed once.`,
      ],
      example: { problem: `Name the part of speech of the words Wow, blocked, easily, but and by in this sentence: "Wow, the goalie blocked that shot easily, but our team still lost by one goal."`, solution: `Wow = interjection, blocked = verb, easily = adverb, but = conjunction, by = preposition` },
      relatedLoIds: ['m7ela.parts-of-speech'],
    },
    {
      title: 'Worked same word two jobs',
      steps: [
        `Sentence one, the word run. Tense test: yesterday they ran three miles, tomorrow they will run three miles. It carries the action of the sentence, so here run is a VERB.`,
        `Sentence two, the same word. This time it has the word a in front of it, and it names the thing she went for. You can even count them: one run, two runs. So here run is a NOUN.`,
        `So the first claim is WRONG as stated: "run is always a verb." CORRECT: run works as a verb in the first sentence and as a noun in the second.`,
        `Sentence three, the word fast. Ask what it describes. It tells you what kind of bike, and bike is a noun. A word describing a noun is an ADJECTIVE.`,
        `Sentence four, the same word again. Here it describes talks, telling you HOW your cousin talks. Talks is a verb, so this time fast is an ADVERB. It has no -ly, and it does not need one.`,
        `So the second claim is WRONG too: "fast is always an adjective." CORRECT: fast is an adjective when it describes a noun and an adverb when it describes a verb. Both claims failed for the same reason. They named the word instead of reading the sentence.`,
      ],
      example: { problem: `A student says that run is always a verb and fast is always an adjective. Test both claims. "They run three miles every Saturday." / "She went for a run after dinner." / "Our coach bought a fast bike." / "My cousin talks fast."`, solution: `run = verb in the first sentence, noun in the second; fast = adjective in the third, adverb in the fourth.` },
      relatedLoIds: ['m7ela.parts-of-speech'],
    },
  ],
  pointers: [
    { content: `Students often say "The sentence has no verb, because nobody does anything in it." — Was IS the verb, and it is the only verb in the sentence. Verbs tell what happens OR what is. Was is a linking verb: it connects the driver to the word that describes the driver, which is late. Run the tense test on it and it still passes: the driver was late yesterday, the driver will be late tomorrow. WRONG: "Our friendly bus driver late again" with the verb removed, which is not a sentence at all. CORRECT: "Our friendly bus driver was late again."`, kind: 'common-error' },
    { content: `Students often say "Friendly is an adverb because it ends in -ly." — The ending never decides the answer. Friendly describes the noun driver, telling you what kind of driver, so friendly is an ADJECTIVE. Lonely and lively behave the same way: "a lonely dog", "a lively puppy". Meanwhile fast, hard and soon do the adverb job with no -ly at all, as in "my cousin talks fast". Always find the word being described first, then name the job.`, kind: 'common-error' },
    { content: `A part of speech is the JOB a word does in one sentence, not a label the word carries around. Ask what is this word doing here, every single time.`, kind: 'tip' },
    { content: `Run is a verb in "They run three miles every Saturday" and a noun in "She went for a run after dinner." Fast is an adjective in "a fast bike" and an adverb in "my cousin talks fast."`, kind: 'tip' },
    { content: `Nouns name; pronouns stand in for nouns; verbs pass the tense test; adjectives describe nouns; adverbs describe verbs, adjectives and other adverbs.`, kind: 'tip' },
    { content: `Prepositions sit in front of a noun to show how it fits, conjunctions join, interjections stand apart as bursts of feeling.`, kind: 'tip' },
    { content: `Am, is, are, was and were are real verbs. WRONG: "The gym was empty has no verb." CORRECT: was is the verb, and empty is an adjective describing the gym.`, kind: 'tip' },
    { content: `The -ly ending proves nothing. Friendly and lonely are adjectives; fast, hard and soon can all be adverbs. Find the word being described, then name the job.`, kind: 'tip' },
    { content: `Never answer from the word alone. "Run" is a verb in *They run three miles* and a noun in *She went for a run*. Say it out loud: "In THIS sentence, run is doing ___." If your answer would be the same no matter what sentence you saw, you skipped the step that matters.`, kind: 'common-error' },
    { content: `The -ly ending proves nothing. *Friendly*, *lonely* and *lively* describe nouns, so they're adjectives. *Fast*, *hard* and *soon* do adverb work with no -ly. Find the word being described first, THEN name the job.`, kind: 'gotcha' },
    { content: `"Nobody does anything" does not mean there's no verb. *Am, is, are, was, were* are real verbs and can be the only verb in a sentence. In *The gym was empty*, the verb is **was** and *empty* is an adjective describing gym.`, kind: 'common-error' },
    { content: `An adjective doesn't have to sit in front of its noun. After a linking verb it points backward: in *The pizza was cold*, **cold** describes *pizza*, so it's an adjective — not an adverb, even though it comes right after the verb.`, kind: 'edge-case' },
    { content: `Adjective vs. adverb is decided by what's being described, not by the describing word. If it describes a noun or pronoun → adjective. If it describes a verb, adjective or adverb → adverb. Point at the described word before you answer.`, kind: 'tip' },
    { content: `Don't mix up prepositions and conjunctions. A preposition sits in front of a NOUN (*by one goal*, *after lunch*). A conjunction joins two parts (*but*, *and*, *because*). Watch *after*: preposition in *after lunch*, conjunction in *after we ate*.`, kind: 'edge-case' },
    { content: `Helping words count as part of the verb. In *has been waiting*, all three words are one verb — don't label *has* alone and stop. Run the tense test on the whole group: yesterday she had been waiting, tomorrow she will be waiting.`, kind: 'edge-case' },
    { content: `"Modify" just means describe or narrow. Say "*loudly* modifies *sang*" — one word modifies ANOTHER word. Don't say a word "modifies the sentence" or "modifies the meaning"; always name the exact word it points at.`, kind: 'vocab-note' },
  ],
};
