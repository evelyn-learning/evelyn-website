/**
 * Grade 6 English Language Arts — Unit 6 CED 6.2: Varying Sentence Patterns for Style.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.varying-sentence-patterns-for-style.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U6_VARYING_SENTENCE_PATTERNS_FOR_STYLE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.varying-sentence-patterns-for-style.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Varying Sentence Patterns for Style',
  planId: 'evelyn.ms.m6ela.varying-sentence-patterns-for-style.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.varying-sentence-patterns-for-style.v1' }],
  theory: [
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `SENTENCE VARIETY CHANGES SHAPE, NOT MEANING. A paragraph of complete, correct sentences can still be choppy if every sentence is the same length and starts the same way. CHOPPY: "We collected cans. We stacked them. We loaded them. We drove them." VARIED: "We collected cans and stacked them in the gym. Then we loaded the boxes into the truck and drove them to the shelter." Every fact stays exactly the same; only the shape changes.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `THE MOST NOTICEABLE REPEATED PATTERN IS THE OPENER. Look at the first word of each sentence in a row. When three or more sentences in a row start with the exact same word or the same short subject, that repetition is what a reader notices first, before they even notice what the sentences say.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `COMBINING TWO SHORT SENTENCES CAN STATE A RELATIONSHIP THAT WAS LEFT UNSTATED. CHOPPY: "The bell rang. Everyone ran to the cafeteria." Printed side by side, the reader has to supply the connection between them. VARIED: "When the bell rang, everyone ran to the cafeteria." The word "when" states the timing relationship instead of leaving it for the reader to guess.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `SHORT AND LONG SENTENCES DO DIFFERENT JOBS. A short sentence lands hard and speeds up a moment — "The door slammed." A longer sentence slows down to add detail or explain — "After three tries, the old door finally clicked shut behind her." Neither length is better on its own; the piece decides which job is needed where.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `A VARIED SENTENCE IS STILL A COMPLETE, CORRECT SENTENCE. Varying pattern is a choice layered on top of sentences that are already whole. It is never an excuse to write a fragment or to jam two sentences together with no connecting word or punctuation — checking for that is a different job entirely, done elsewhere.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', content: `TEST A REVISION BY POINTING AT WHAT IT FIXES, NOT BY HOW IT SOUNDS. A real fix does one of two things you can point at in the words themselves: it removes an opening word that was exactly repeated three or more times in a row, or it adds a connector — a word such as when, after, because, or so — that states a relationship the original sentences left unstated. A revision that only swaps in longer or fancier words, without doing either of those two things, has not fixed anything; it has only gotten longer.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', kind: 'definition', title: 'sentence opener', content: 'the word or phrase a sentence starts with.' },
    { loId: 'm6ela.varying-sentence-patterns-for-style', kind: 'definition', title: 'sentence variety', content: `mixing sentence length and sentence openers instead of repeating the same pattern.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', kind: 'definition', title: 'choppy', content: 'a run of short sentences in a row that makes writing feel abrupt.' },
    { loId: 'm6ela.varying-sentence-patterns-for-style', kind: 'definition', title: 'monotonous', content: `sounding the same over and over, so a reader's attention starts to drift.` },
    { loId: 'm6ela.varying-sentence-patterns-for-style', kind: 'definition', title: 'connector', content: 'a word such as when, after, because, or so that states how two ideas relate.' },
  ],
  methods: [
    {
      title: 'Worked fixing a repeated opener',
      steps: [
        `Read the paragraph and look only at the first word of each sentence: I, I, I, I. The exact same word opens all four sentences in a row. That repetition, not the content, is the choppy rhythm a reader notices.`,
        `Decide which sentences are closely related enough to combine into one. Feeding the rabbit and filling its water bowl are two parts of the same routine step, so they can share a sentence.`,
        `Combine that pair using a connector that keeps both actions and drops one repeated "I". VARIED: "I fed the rabbit and filled its water bowl."`,
        `Vary the opener on the next sentence instead of starting it with "I" again. VARIED: "After that, I swept out the cage." Moving "After that" to the front means this sentence no longer opens with the repeated word.`,
        `Leave the last sentence close to as written, since the paragraph now has three different openers instead of one repeated four times: "I checked the latch before I left."`,
        `Read the whole revision back and confirm nothing was added, dropped, or changed — only the shape changed: "I fed the rabbit and filled its water bowl. After that, I swept out the cage. I checked the latch before I left." Three sentences, three different openers, the same four facts.`,
      ],
      example: { problem: `This paragraph is heading to the class newsletter. Fix the choppy rhythm without changing any of the facts.

"I fed the rabbit. I filled its water bowl. I swept out the cage. I checked the latch before I left."`, solution: `I fed the rabbit and filled its water bowl. After that, I swept out the cage. I checked the latch before I left. The repeated "I ___. I ___. I ___. I ___." pattern is gone, and every original fact is still there.` },
      relatedLoIds: ['m6ela.varying-sentence-patterns-for-style'],
    },
    {
      title: 'Worked making a relationship explicit',
      steps: [
        `Read both sentences and ask what connects them. The fire alarm going off is what sent every class outside — but as two separate sentences, the reader has to supply that connection alone.`,
        `Pick a connector that names the relationship you found. "As soon as" states exactly how close in time the two events were, which is more precise than leaving them as two plain sentences joined by nothing.`,
        `Combine the two sentences into one, moving the earlier event to the front: "As soon as the fire alarm went off, every class lined up outside in under two minutes."`,
        `Check that nothing was added or changed. The alarm still goes off, and the classes still line up in under two minutes — the only new word is the connector that states the relationship.`,
        `Compare the shapes. Two short, separate sentences of similar length now read as one longer sentence that opens with the connector — a different rhythm than two plain sentences sitting side by side.`,
      ],
      example: { problem: `These two sentences from a class blog post about a fire drill are correct, but the connection between them is left for the reader to guess. Fix it without changing what happened.

"The fire alarm went off. Every class lined up outside in under two minutes."`, solution: `As soon as the fire alarm went off, every class lined up outside in under two minutes. The connector "as soon as" states the timing relationship that the two separate sentences only left implied.` },
      relatedLoIds: ['m6ela.varying-sentence-patterns-for-style'],
    },
  ],
  pointers: [
    { content: `Students often say "The canine emitted a series of loud vocalizations, and subsequently the individual delivering the mail departed the premises with considerable haste." — Sentence variety is about the shape of sentences — their length and their opener — not about vocabulary difficulty. Priya's revision is still just one long sentence joined with "and," and it does not remove a repeated opener or state a relationship any more clearly than the original pair did; it only replaced plain, clear words with harder ones that say the same thing. A real fix would combine the two sentences with a connector that names the relationship: "When the dog barked, the mail carrier walked away quickly." That states that the barking is what sent the mail carrier off, using one clear connector and none of the original words changed.`, kind: 'common-error' },
    { content: `Students often say "Any combination of two short sentences into one longer sentence counts as fixing the choppiness." — A revision only counts as a fix if it removes a repeated opener or states a relationship that was left unstated, and it must do that without losing or changing any fact from the original sentences. A longer sentence that drops a detail, swaps one noun for another, or reorders events out of the sequence the original stated has not fixed the choppiness — it has replaced one paragraph with a different, less accurate one.`, kind: 'common-error' },
    { content: `Sentence variety changes the length and opener of sentences, never the facts inside them.`, kind: 'tip' },
    { content: `Three or more sentences in a row that start with the exact same word create a choppy, repeated pattern a reader notices immediately.`, kind: 'tip' },
    { content: `Combining two short, related sentences with a connector such as when, after, because, or so can state a relationship the separate sentences left unstated.`, kind: 'tip' },
    { content: `Short sentences land hard and speed up a moment; longer sentences slow down to add detail or explanation. The piece decides which job is needed where.`, kind: 'tip' },
    { content: `A varied sentence is still a complete, correct sentence — variety is never an excuse for a fragment or two sentences jammed together with no connecting word.`, kind: 'tip' },
    { content: `Test a revision by pointing at what it fixes: a repeated opener it removes, or a relationship it states. If a revision only sounds fancier or longer without doing either, it has not fixed anything.`, kind: 'tip' },
    { content: `Don't confuse 'varying sentences' with 'changing the facts.' Rewrite the shape only — opener and length. Every original detail must still be there, word-for-word, when you're done.`, kind: 'common-error' },
    { content: `When you spot three or more sentences starting with the exact same word in a row, that's what a reader notices first—before they even read the content. That's your target to fix.`, kind: 'tip' },
    { content: `A connector (when, after, because, so, as soon as, if) does a specific job: it states a relationship between two ideas that the original separate sentences left unsaid. Don't add one just to make sentences longer.`, kind: 'vocab-note' },
    { content: `Fancier words or longer sentences alone do not fix choppiness. Point at what you actually fixed: Did you remove a repeated opener? Did you add a connector that states a new relationship? If neither, you haven't fixed it.`, kind: 'gotcha' },
    { content: `A short sentence ('The door slammed.') and a long sentence ('After three tries, the old door finally clicked shut behind her.') do different jobs—one lands hard, one adds detail. Neither is 'better'; the piece decides what's needed.`, kind: 'edge-case' },
    { content: `You can combine two short sentences with a connector, but only if they're closely related. 'I fed the dog and walked to school' works; 'I fed the dog because I walked to school' does not.`, kind: 'common-error' },
    { content: `A varied sentence is still a complete, correct sentence. Fixing choppiness is never an excuse to write a fragment or jam two sentences together with no connector or punctuation.`, kind: 'gotcha' },
  ],
};
