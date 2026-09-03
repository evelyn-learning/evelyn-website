/**
 * Grade 6 English Language Arts — Unit 7 CED 7.1: Context Clues.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.context-clues.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U7_CONTEXT_CLUES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.context-clues.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Context Clues',
  planId: 'evelyn.ms.m6ela.context-clues.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.context-clues.v1' }],
  theory: [
    { loId: 'm6ela.context-clues', content: `READ PAST THE HARD WORD BEFORE YOU GUESS. Finish the whole sentence it sits in, and read the next sentence too if the first one gives you nothing. The clue is almost never the word itself — it is the sentences sitting around it, and sometimes it is one sentence away.` },
    { loId: 'm6ela.context-clues', content: `THE WORD'S JOB IN THE SENTENCE NARROWS THE MEANING BEFORE YOU EVEN FIND A CLUE. Ask what the word is doing: naming a person or thing, describing one, or performing an action. A word that follows was, felt, seemed or looked is almost always describing a feeling or a state, which already rules out an entire category of wrong guesses.` },
    { loId: 'm6ela.context-clues', content: `A DEFINITION CLUE HANDS YOU THE MEANING DIRECTLY, usually right where the word appears. Watch for a comma followed by "or," the word "means," or a phrase set off by a dash. "The trail was arduous, or so steep and rocky that even the guide needed a break," defines arduous the instant it uses the word.` },
    { loId: 'm6ela.context-clues', content: `A RESTATEMENT CLUE SAYS THE SAME IDEA AGAIN, LATER, IN EASIER WORDS, with no signal word announcing it. Nothing marks it as a definition — you notice that a sentence nearby describes the same thing you were unsure about, just in plainer language.` },
    { loId: 'm6ela.context-clues', content: `A CONTRAST CLUE GIVES YOU THE OPPOSITE, SO YOU HAVE TO FLIP IT. Watch for but, however, although, unlike, instead and on the other hand. Whatever the other half of the sentence says, the hard word means something close to the reverse of it.` },
    { loId: 'm6ela.context-clues', content: `AN EXAMPLE CLUE SHOWS WHAT A WORD COVERS THROUGH SPECIFIC CASES, introduced by such as, like, for instance or including — ask what every example in the list has in common. Then, whichever clue you used, TEST YOUR GUESS by substituting it back into the sentence. If the sentence still makes sense with your meaning in place of the hard word, keep it; if it does not, the guess is wrong, no matter how confident it felt.` },
    { loId: 'm6ela.context-clues', kind: 'definition', title: 'context clue', content: `a detail in the words and sentences around an unfamiliar word that points to its meaning.` },
    { loId: 'm6ela.context-clues', kind: 'definition', title: 'definition clue', content: `a clue that renames the word directly, often set off by a comma and the word "or" right where the word appears.` },
    { loId: 'm6ela.context-clues', kind: 'definition', title: 'restatement', content: `the same idea said again, later, in easier or more familiar words, with no signal word announcing it.` },
    { loId: 'm6ela.context-clues', kind: 'definition', title: 'contrast clue', content: `a clue that gives the opposite of a word's meaning, so a reader has to flip it. Signals: but, however, although, unlike, instead.` },
    { loId: 'm6ela.context-clues', kind: 'definition', title: 'example clue', content: `specific cases that show what a word covers, introduced by words such as "such as" or "like."` },
  ],
  methods: [
    {
      title: 'Worked definition clue audacious',
      steps: [
        `Find the hard word first: audacious. It comes right after "called her plan", so its job is to describe the plan — that alone tells you the word names some quality, not a person or an action.`,
        `Read immediately past the word for a signal. Right after audacious there is a comma, then the signal word "or", then the definition itself: "bold enough to border on reckless". A comma followed by "or" is a definition clue announcing itself as clearly as this course ever gets.`,
        `Take the definition at its word: audacious means bold enough to border on reckless.`,
        `Swap the guess back into the sentence to check it: "The rest of the cabin called her plan bold enough to border on reckless, and they still bring up that night at every campfire." The sentence still makes complete sense, so the guess holds.`,
      ],
      example: { problem: `Figure out what the underlined word means, using only the words printed in the passage.

"Every camper wanted extra pudding from the counselors' kitchen, but nobody had the nerve to actually sneak in and take it, until Priya walked in at midnight and grabbed the whole tray. The rest of the cabin called her plan audacious, or bold enough to border on reckless, and they still bring up that night at every campfire."

What does audacious mean, as used in this passage?`, solution: `Audacious means bold enough to border on reckless. The comma followed by "or" right after the word signals a definition clue that renames audacious directly.` },
      relatedLoIds: ['m6ela.context-clues'],
    },
    {
      title: 'Worked repair somber',
      steps: [
        `Notice the word's job first. Somber sits right after "walked off the field", describing how the team walked, which means it names a feeling or a state, not an action.`,
        `The student's guess, worn out, is a real feeling after a game, which is exactly why it seems safe. But nothing printed in the passage ties the word to being tired — the guess was never checked against the sentence at all.`,
        `Look at what is actually printed: "heads down and nobody talking the entire bus ride home." A tired team can still joke around on a bus. Heads down and silence describe something heavier than exhaustion.`,
        `Read into the second sentence too. The coach, who "usually cracked a joke", stayed quiet instead. That detail rules out simple tiredness and points toward something serious and sad.`,
        `Swap the repaired guess back in: "The whole team walked off the field serious and sad after the championship game, heads down and nobody talking the entire bus ride home." Every detail in the passage now fits.`,
        `WRONG: "Somber means worn out, because playing a whole game is exhausting." CORRECT: "Somber means very serious and sad, shown by the silence, the heads down, and the coach who stayed quiet instead of joking."`,
      ],
      example: { problem: `A student was asked what the underlined word means in this passage, and answered wrong. Find the mistake and repair it.

"The whole team walked off the field somber after the championship game, heads down and nobody talking the entire bus ride home. Even the coach, who usually cracked a joke before they even reached the parking lot, stayed quiet the whole way."

Student's answer: "Somber means worn out, because playing a whole game is exhausting."

What went wrong, and what does somber actually mean here?`, solution: `Somber means very serious and sad. Nothing in the passage points toward tired — the silence, the heads down, and the coach who stayed quiet instead of joking all point toward sadness instead.` },
      relatedLoIds: ['m6ela.context-clues'],
    },
  ],
  pointers: [
    { content: `Students often say "Vigorous means exhausted and worn out." — The word but signals a contrast: the team was expected to be exhausted, but they looked like something else instead. Flip the expected feeling to its opposite: vigorous means full of energy, the reverse of worn out. The jogging and the racing that follow confirm an energetic team, not a tired one.`, kind: 'common-error' },
    { content: `Students often say "Vigorous means competitive, always trying to beat somebody else." — Read both details as one pair, not one at a time: jogging off the field and racing each other to the water cooler. Jogging is not a competition at all, so the two details together describe one thing, a team with plenty of energy left. Vigorous means full of energy and strength, which fits jogging and racing equally well.`, kind: 'common-error' },
    { content: `Read past the hard word to the end of its sentence, and into the next sentence if the first one gives nothing. The clue is almost never the word itself.`, kind: 'tip' },
    { content: `The word's job in the sentence — naming, describing or doing — narrows the meaning before you even find a signal.`, kind: 'tip' },
    { content: `A definition clue renames the word directly, often right after a comma and the word "or."`, kind: 'tip' },
    { content: `A restatement clue says the same idea again, later, in plainer words, with no signal announcing it.`, kind: 'tip' },
    { content: `A contrast clue gives you the opposite. Signals: but, however, although, unlike, instead. Flip whatever the other half of the sentence says.`, kind: 'tip' },
    { content: `An example clue shows what a word covers through specific cases introduced by such as, like or for instance. Whichever clue you use, test your guess by substituting it back into the sentence.`, kind: 'tip' },
    { content: `Don't guess at a hard word before finishing its entire sentence. The clue is almost always sitting one sentence away, not right next to the word itself.`, kind: 'common-error' },
    { content: `When you see a contrast signal (but, however, although, unlike, instead), flip the meaning of the other half of the sentence. If one side says tired, the hard word means the opposite.`, kind: 'gotcha' },
    { content: `A restatement clue has no signal word announcing it—look for the same idea said again in easier words, one or two sentences later. Don't wait for a comma or 'or.'`, kind: 'vocab-note' },
    { content: `Before you search for a clue, ask what job the hard word does: Does it name something, describe a feeling or state, or show an action? This job rules out entire categories of wrong guesses before you read further.`, kind: 'tip' },
    { content: `Always swap your guess back into the sentence to test it. If the sentence still makes complete sense with your meaning in the hard word's place, keep it. If not, the guess is wrong—no matter how confident it feels.`, kind: 'common-error' },
    { content: `When an example clue lists specific cases (like, such as, for instance), ask what all the examples have in common—don't focus on just one item in the list.`, kind: 'common-error' },
    { content: `A definition clue often announces itself with a comma followed by 'or,' or the word 'means,' or a dash. These signal words mean the meaning is sitting right there—take it at its word.`, kind: 'vocab-note' },
    { content: `Don't confuse the feeling you'd have in the situation with the actual meaning the passage gives. A game is exhausting, but that doesn't mean every word in a passage about a game means tired.`, kind: 'edge-case' },
  ],
};
