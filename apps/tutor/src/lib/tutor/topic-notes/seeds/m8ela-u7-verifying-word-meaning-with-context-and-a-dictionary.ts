/**
 * Grade 8 English Language Arts — Unit 7 CED 7.1: Verifying Word Meaning with Context & a Dictionary.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8ela.verifying-word-meaning-with-context-and-a-dictionary.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8ELA_U7_VERIFYING_WORD_MEANING_WITH_CONTEXT_AND_A_DICTIONARY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8ela.verifying-word-meaning-with-context-and-a-dictionary.v1',
  course: 'Grade 8 English Language Arts',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Verifying Word Meaning with Context & a Dictionary',
  planId: 'evelyn.ms.m8ela.verifying-word-meaning-with-context-and-a-dictionary.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8ela.verifying-word-meaning-with-context-and-a-dictionary.v1' }],
  theory: [
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `AN ENTRY IS SORTED BEFORE IT IS NUMBERED. A word with several meanings does not hand you a flat list of them. The entry groups its senses under part-of-speech labels — noun, verb, adjective, adverb — and numbers them inside each group. So the first thing to look for in an entry is not sense 1. It is the label, because the label is the only part of the entry that can be settled from your sentence before you have read a single definition.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `STEP ONE: DECIDE WHAT JOB THE WORD DOES IN YOUR SENTENCE. You already ask what job a word is doing when you sort parts of speech, and this is the same question pointed at one word. "The road follows the coast for six miles" uses coast to name a thing, so there it is a noun. "She let the bike coast down the last hill" uses coast to name what the bike does, so there it is a verb. Same five letters, two different jobs, and the entry keeps those two jobs in separate groups.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `STEP TWO: CROSS OUT EVERY GROUP WHOSE LABEL DOES NOT MATCH. This step takes about two seconds and throws away most of the entry, which is why skipping it costs so much. A sense can be exactly right about the topic and still be the wrong answer, because it sits under the wrong label. If your sentence needs an action and the sense you like is a thing, that sense is out, however well it fits the subject you are reading about.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `STEP THREE: LET THE SENTENCE CHOOSE AMONG WHAT IS LEFT. A label almost never leaves exactly one sense standing, so the sentence has to do the rest. "The team practiced free throws on the far court until six" leaves both court senses in play, because both of them are nouns; free throws are what settle it. Read the whole sentence, not just the words touching the target, and ask which of the surviving senses that sentence could be describing.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `STEP FOUR: SUBSTITUTE THE DICTIONARY WORDING BACK IN AND READ THE WHOLE SENTENCE. Take the definition you picked, put it into the sentence in place of the word, and read the sentence from the beginning. You are allowed to bend the wording so the grammar fits, because a definition is written to stand alone and your sentence is not; what you are checking is whether the MEANING still holds, not whether the result comes out elegant. If it holds, you are done. If the sentence goes strange, you have the wrong sense.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', content: `WHEN THE CHECK FAILS, BACK UP INSIDE THE SAME LABEL. A failed substitution does not send you back to the top of the entry. Your reading of the job was settled by grammar and is almost certainly right, so the next candidate is the next sense under the SAME label, not a sense from a different group. And the numbers themselves are not a ranking of what you need: dictionaries differ about what goes first, some putting the most common sense at the top and some the oldest, so sense 1 is where a sense sits in that book, never a promise that it is yours.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', kind: 'definition', title: 'entry', content: `everything a dictionary prints for one word: its part-of-speech labels and all of its numbered senses.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', kind: 'definition', title: 'sense', content: `one numbered meaning inside an entry. A word with several senses has one entry and many meanings, which is why a lookup does not end the job.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', kind: 'definition', title: 'part-of-speech label', content: `the word noun, verb, adjective or adverb printed above a group of senses, telling you what job those senses do in a sentence.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', kind: 'definition', title: 'the substitution check', content: `putting the definition you picked into the sentence in place of the word and reading the whole sentence to see whether the meaning still holds.` },
    { loId: 'm8ela.verifying-word-meaning-with-context-and-a-dictionary', kind: 'definition', title: 'multiple-meaning word', content: `a word that carries more than one unrelated meaning, so that the sentence around it, not the word itself, decides which meaning is in play.` },
  ],
  methods: [
    {
      title: 'Worked run the routine three times',
      steps: [
        `Sentence A, step one. What job does the word do? It comes straight after "tried to", so it names an action Rosa performs. That is a verb. Step two: cross out the noun group, senses 1 and 2, and do not look at them again. They may be perfectly good meanings of stall; they are not available here.`,
        `Sentence A, step three. Two verb senses are left. Sense 3 is something an engine does, and Rosa is not an engine; the thing she is doing it to is her brother. Sense 4, delaying on purpose, fits a person keeping someone at a door with an extra question. Pick sense 4.`,
        `Sentence A, step four. Substitute and read the whole sentence: Rosa tried to delay her brother on purpose, to gain a little time, at the front door with one more question. The wording bends a little, because the definition was written to stand alone, and the meaning holds exactly. Sense 4 is confirmed.`,
        `Sentence B, all four steps. The word comes after "Every" and is followed by "along the north row", so it names a thing: a noun. Cross out the verb group. Two noun senses are left, and the sentence says the thing "had sold out of peaches", which is what a market booth does and not what a barn compartment does. Substitute: every stand or booth where goods are sold had sold out of peaches before ten o'clock. The meaning holds. Sense 1.`,
        `Sentence C, all four steps. The word carries the past-tense ending and is what the van did, so it is a verb; the noun group is out. Two verb senses are left, and the doer is a delivery van, which is a vehicle. Substitute sense 3: the delivery van stopped running suddenly, twice, on the hill behind the school. The meaning holds. Sense 3. Try the other one to see the check work: WRONG: "The delivery van delayed on purpose in order to gain a little time twice on the hill behind the school." A van cannot have a purpose, so the substitution fails and sense 4 is out. CORRECT: sense 3.`,
        `Read the three verdicts together: A is sense 4, B is sense 1, C is sense 3. The label settled half of each question before any definition was read, and the sentence settled the other half. Notice that sentence 1 was never the answer once, and that the two sentences using the verb group did not use the same verb sense.`,
      ],
      example: { problem: `Here is one entry and three sentences. For each sentence, name the sense of "stall" it uses.

ENTRY: stall
(noun) 1. a stand or booth where goods are sold at a market
(noun) 2. a compartment in a barn where one animal is kept
(verb) 3. to stop running suddenly, as an engine or a vehicle does
(verb) 4. to delay on purpose in order to gain a little time

SENTENCE A: "Rosa's poster was not finished, so she tried to stall her brother at the front door with one more question about his math homework."
SENTENCE B: "Every stall along the north row had sold out of peaches before ten o'clock."
SENTENCE C: "The delivery van stalled twice on the hill behind the school."`, solution: `Sentence A uses sense 4, to delay on purpose: the word follows "tried to", so it is a verb, and a person keeping her brother at the door with an extra question is delaying him. Sentence B uses sense 1, a market booth: the word follows "Every", so it is a noun, and the thing "had sold out of peaches". Sentence C uses sense 3, to stop running suddenly: the word is what the delivery van did, and a van is a vehicle.` },
      relatedLoIds: ['m8ela.verifying-word-meaning-with-context-and-a-dictionary'],
    },
    {
      title: 'Worked substitution catches the wrong sense',
      steps: [
        `Step one and step two. The word follows "had to", so it names an action Dev performs: a verb. Cross out sense 1, the only noun, and three senses are left.`,
        `Step three, and here is where the sentence gets ahead of you. The first sense most readers reach for is sense 3, because strain and muscle travel together so often that the pair arrives before the sentence does. Dev is walking a long way, muscles are involved, and sense 3 sits under the right label. It looks safe.`,
        `Step four is the whole reason this routine has four steps. Substitute sense 3 and read the sentence: WRONG: "By the last mile of the charity walk Dev had to injure a muscle by stretching it too far to keep up with the group ahead of him." That says Dev was required to hurt himself, which is not what the sentence says at all. The substitution failed, so the sense is wrong, however comfortable it felt.`,
        `Now back up correctly. A failed check does not send you to the top of the entry, because your reading of the job has not changed: the word is still a verb. Move to the next sense in the same group. Sense 2, pouring through a sieve, fails in the first four words. WRONG: "By the last mile of the charity walk Dev had to pour a mixture through a sieve to keep up with the group ahead of him."`,
        `That leaves sense 4. Substitute it: CORRECT: "By the last mile of the charity walk Dev had to make a great effort with his body to keep up with the group ahead of him." The definition says "with the body or the mind" and the sentence takes only the body half, which is the ordinary bending of wording that step four allows. The meaning holds, and sense 4 is confirmed.`,
        `The lesson of this one is the order of your own certainty. You were sure about the label and it held. You were only comfortable about the sense, and comfort is what step four exists to test. When the check fails, distrust the sense, not the label.`,
      ],
      example: { problem: `Run the routine on this one, and notice what the last step is for.

ENTRY: strain
(noun) 1. a force that pulls or stretches something
(verb) 2. to pour a mixture through a sieve so the liquid runs out and the solids stay behind
(verb) 3. to injure a muscle by stretching it too far
(verb) 4. to make a great effort with the body or the mind

SENTENCE: "By the last mile of the charity walk Dev had to strain to keep up with the group ahead of him."`, solution: `Sense 4, to make a great effort with the body or the mind. The word follows "had to", so it is a verb and the noun sense is out. The familiar sense 3, injuring a muscle, sits under the right label but fails the substitution, because the sentence does not say Dev had to hurt himself. Sense 2 fails immediately. Sense 4 substitutes cleanly: Dev had to make a great effort with his body to keep up.` },
      relatedLoIds: ['m8ela.verifying-word-meaning-with-context-and-a-dictionary'],
    },
  ],
  pointers: [
    { content: `Students often say "Sense 1, a line of railroad cars pulled by an engine, because that is what the word train means." — Ask the job first. The word follows "how to", so it names an action, which puts the whole noun group out of reach before any meaning is weighed. The number in front of a sense tells you where it sits in that dictionary, not how likely it is to be the one your sentence needs. And the substitution check would have caught it in four words: WRONG: "Mr. Abara showed us how to a line of railroad cars the bean vines up the wire frame at the back of the garden." CORRECT, once the routine is run: "Mr. Abara showed us how to make the bean vines grow in a particular direction by tying them to the wire frame at the back of the garden."`, kind: 'common-error' },
    { content: `Students often say "Sense 3, to teach a person or an animal a skill by practicing it, because the word is a verb here and that is what train means as a verb." — A label almost never leaves one sense standing. Two verb senses were left here, and the sentence says the thing being trained is bean vines. Run step four on the chosen sense: WRONG: "Mr. Abara showed us how to teach the bean vines a skill by practicing it up the wire frame at the back of the garden." A vine cannot practice a skill, so the substitution fails. Then back up inside the same label, because the job has not changed: sense 4 gives CORRECT: "Mr. Abara showed us how to make the bean vines grow in a particular direction by tying them to the wire frame at the back of the garden", and the meaning holds.`, kind: 'common-error' },
    { content: `An entry is sorted before it is numbered: senses are grouped under part-of-speech labels and numbered inside each group. Look for the label before you look for sense 1.`, kind: 'tip' },
    { content: `Step one, decide what job the word does in your sentence. Step two, cross out every group whose label does not match. Those two steps throw away most of the entry in about two seconds.`, kind: 'tip' },
    { content: `Step three, let the whole sentence choose among the senses that survive, because a label almost never leaves exactly one.`, kind: 'tip' },
    { content: `Step four, substitute the dictionary wording back into the sentence and read the sentence from the beginning. Bend the grammar as much as you need to; what you are checking is whether the meaning still holds.`, kind: 'tip' },
    { content: `When the substitution fails, back up to the next sense under the SAME label, never to the top of the entry. The job was settled by grammar and has not changed; the only thing that turned out to be wrong was your pick among the senses in that one group.`, kind: 'tip' },
    { content: `A sense number is where that sense sits in that dictionary, not a ranking of what your sentence needs, and the meaning you already know is not a default either. The two most expensive answers are the first one printed and the one you arrived with.`, kind: 'tip' },
  ],
};
