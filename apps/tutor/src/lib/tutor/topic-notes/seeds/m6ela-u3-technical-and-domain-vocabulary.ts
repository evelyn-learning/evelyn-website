/**
 * Grade 6 English Language Arts — Unit 3 CED 3.3: Technical & Domain Vocabulary.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.technical-and-domain-vocabulary.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U3_TECHNICAL_AND_DOMAIN_VOCABULARY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.technical-and-domain-vocabulary.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Technical & Domain Vocabulary',
  planId: 'evelyn.ms.m6ela.technical-and-domain-vocabulary.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.technical-and-domain-vocabulary.v1' }],
  theory: [
    { loId: 'm6ela.technical-and-domain-vocabulary', content: `A TECHNICAL OR DOMAIN-SPECIFIC WORD BELONGS TO ONE FIELD OF STUDY OR ACTIVITY. Words such as brood chamber, magma chamber, crux and dew point almost never come up outside beekeeping, volcanoes, climbing or weather. A text that uses one of these words is usually about to tell you, close by, exactly what it means inside that field — you do not need to already know the term.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', content: `LOOK FIRST FOR THE DEFINITION THE TEXT ALREADY HANDS YOU. A comma followed by a phrase that renames the term, or a dash doing the same job, is the clearest signal there is: "the current, the flow of electric charge moving through a wire," defines current the instant it is used. Read the exact words right after that signal before you guess at anything.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', content: `WHEN THERE IS NO DIRECT RESTATEMENT, LOOK FOR A NEARBY EXAMPLE INSTEAD. Words such as "such as," "for instance" and "like" introduce specific cases that show what a term covers, even when the text never states a one-sentence definition.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', content: `WATCH FOR A WORD THAT ALSO HAS AN EVERYDAY MEANING. Crux and current both mean one thing in ordinary conversation and something more exact inside a specific field. The everyday meaning you already know is exactly what gets in the way here — trust the definition or example the text prints, not the meaning you walked in with.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', content: `TEST YOUR ANSWER BY SWAPPING IT BACK INTO THE SENTENCE. If your meaning fits smoothly where the technical word was, and the rest of the sentence still makes sense, you have the right one. If the sentence stops making sense, you borrowed a meaning from somewhere outside the text.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', kind: 'definition', title: 'technical or domain-specific word', content: `a word tied to one field of study or activity that does not come up in everyday conversation outside that field.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', kind: 'definition', title: 'restatement', content: `a phrase set off by a comma or dash that renames or defines a term the instant it is used.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', kind: 'definition', title: 'example clue', content: `specific cases introduced by words such as "such as," "for instance" or "like" that show what a term covers.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', kind: 'definition', title: 'context', content: `the words and sentences surrounding an unfamiliar word that a reader uses to work out its meaning.` },
    { loId: 'm6ela.technical-and-domain-vocabulary', kind: 'definition', title: 'multiple-meaning word', content: `a word that carries one meaning in everyday conversation and a different, more exact meaning inside a specific field.` },
  ],
  methods: [
    {
      title: 'Worked restatement clue',
      steps: [
        `Find the technical term first: brood chamber. It is not a word from everyday conversation, so the passage is most likely about to explain it close by.`,
        `Look immediately after the term for a comma-signal restatement. Right after "brood chamber" there is a comma, then the phrase "the bottom section where the queen bee lays eggs and young bees develop," which renames the term directly.`,
        `Do not borrow anything the definition does not actually say. The sentence never says honey is stored inside the brood chamber; it says frames are added above the brood chamber for honey. Keep the meaning to exactly what the restatement gives you.`,
        `Swap the meaning back into the sentence to check it: the beekeeper checks the bottom section where the queen bee lays eggs and young bees develop, and the rest of the sentence, about adding frames above it, still makes sense.`,
        `Write the meaning as a full phrase, not a single word: the section of the hive, near the bottom, where the queen bee lays eggs and young bees develop.`,
      ],
      example: { problem: `Figure out what the underlined technical term means, using only the words printed in the passage.

"A beekeeper lifts the lid of the hive and checks the brood chamber, the bottom section where the queen bee lays eggs and young bees develop, before adding empty frames above it for the colony to fill with honey."

What does brood chamber mean, as used in this passage?`, solution: `Brood chamber means the section of the hive, near the bottom, where the queen bee lays eggs and young bees develop. The passage defines it directly, right after the term, with the restatement "the bottom section where the queen bee lays eggs and young bees develop," set off by a comma.` },
      relatedLoIds: ['m6ela.technical-and-domain-vocabulary'],
    },
    {
      title: 'Worked repair everyday meaning trap',
      steps: [
        `Notice that the student's answer never looked at the passage at all. It reached for the everyday meaning of current, the one that means "happening now" — a meaning the student already knew before reading a single word of this sentence.`,
        `Go back to the sentence and find the signal right after the term. There is a comma right after "current," then the phrase "the flow of electric charge moving through a wire," which is the passage's own definition, printed the instant the word is used.`,
        `Compare the two meanings directly. "The flow of electric charge moving through a wire" has nothing to do with time or "happening now" — it describes something moving through a wire, which fits an electrician testing wiring, not a news report.`,
        `Swap the correct meaning back into the sentence to check it: an electrician tests the flow of electric charge moving through a wire, before connecting a new light switch, and the rest of the sentence still makes sense.`,
        `WRONG: "Current means something happening right now, like current events." CORRECT: "In this passage, current means the flow of electric charge moving through a wire."`,
      ],
      example: { problem: `A student was asked what the underlined term means in this passage, and answered wrong. Find the mistake and repair it.

"An electrician tests the current, the flow of electric charge moving through a wire, before connecting a new light switch."

Student's answer: "Current means something happening right now, like current events."

What went wrong, and what does current actually mean here?`, solution: `Current means the flow of electric charge moving through a wire, exactly as the passage defines it right after the comma. The everyday meaning of current, "happening now," is not what the word means inside this passage about an electrician's work.` },
      relatedLoIds: ['m6ela.technical-and-domain-vocabulary'],
    },
  ],
  pointers: [
    { content: `Students often say "Gluten means a health problem some people have with wheat." — The passage defines gluten the instant it uses the word: "the stretchy protein network that forms when flour is mixed with water," set off by a comma. That is the only meaning printed here, and it has nothing to do with a health condition. Whenever a technical word is followed by a comma and a renaming phrase, that phrase is the answer, not whatever the word has meant in a different conversation.`, kind: 'common-error' },
    { content: `Students often say "Gluten means shaping the loaf." — Go back to the exact words right after the comma that follows the term itself: "the stretchy protein network that forms when flour is mixed with water," set off by a comma. A definition sits immediately next to the word it defines. An action that happens later in the same sentence, such as shaping the loaf, belongs to the story around the term, not to the term's meaning.`, kind: 'common-error' },
    { content: `A technical or domain-specific word belongs to one field. An informational text that uses one almost always hands you its meaning close by.`, kind: 'tip' },
    { content: `Look first for a restatement: a comma or dash followed by a phrase that renames the term the instant it is used.`, kind: 'tip' },
    { content: `When there is no direct restatement, look for an example clue instead, introduced by words such as "such as," "for instance" or "like."`, kind: 'tip' },
    { content: `Watch for a word with an everyday meaning too, such as current or crux. Trust the definition the text prints, not the meaning you walked in with.`, kind: 'tip' },
    { content: `Test your answer by swapping it back into the sentence. If the rest of the sentence stops making sense, the meaning came from outside the text.`, kind: 'tip' },
    { content: `A definition sits right next to the word it defines. An action or detail later in the same sentence is part of the story, not the term's meaning.`, kind: 'tip' },
  ],
};
