/**
 * Grade 7 English Language Arts — Unit 7 CED 7.1: Context Clues.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.context-clues.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U7_CONTEXT_CLUES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.context-clues.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Context Clues',
  planId: 'evelyn.ms.m7ela.context-clues.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.context-clues.v1' }],
  theory: [
    { loId: 'm7ela.context-clues', content: `RUN THE SAME FOUR STEPS EVERY TIME. Step one, read PAST the hard word all the way to the end of the sentence, and then read the next sentence too. Step two, look for a signal word. Step three, make a guess in your own plain words. Step four, put your guess into the sentence in place of the hard word and read it again. Step four is the one everybody skips, and it is the one that catches a wrong guess.` },
    { loId: 'm7ela.context-clues', content: `DEFINITION CLUE: the sentence simply tells you, usually right after a comma or the word "or". "Grandpa built the shelf out of oak because he wanted it sturdy, or strongly built enough to hold a stack of heavy books." The clue hands you the meaning. Sturdy means strongly built. Signals: or, that is, which means, a pair of commas, a dash.` },
    { loId: 'm7ela.context-clues', content: `SYNONYM OR RESTATEMENT CLUE: the writer says the same thing again in easier words. "After three soccer games in one day the whole team was weary. Nobody talked, and half of us fell asleep on the bus." Weary means very tired. Nothing announces the clue, so watch for an idea repeated in plainer language.` },
    { loId: 'm7ela.context-clues', content: `CONTRAST OR ANTONYM CLUE: the sentence gives you the OPPOSITE, so you flip it. "My sister was elated about the concert tickets, but I was miserable, because I had to stay home." Elated is set against miserable, so elated means very happy. Signals: but, however, unlike, instead, although, on the other hand. When you see one of these, expect the clue to be an opposite and remember to flip it.` },
    { loId: 'm7ela.context-clues', content: `EXAMPLE CLUE: the writer lists cases of the word instead of defining it. "My dog will conceal anything he steals, such as a sock under the couch or a tennis ball behind the trash can." Every example is a hiding place, so conceal means to hide. Signals: such as, for instance, including, like, for example.` },
    { loId: 'm7ela.context-clues', content: `THE CLUE IS NOT ALWAYS TOUCHING THE WORD. It often sits in the NEXT sentence, and sometimes two sentences later. If the sentence holding the hard word gives you nothing, that does not mean you are stuck. It means you have not read far enough yet.` },
    { loId: 'm7ela.context-clues', kind: 'definition', title: 'context', content: 'the words and sentences around a word, which show how it is being used.' },
    { loId: 'm7ela.context-clues', kind: 'definition', title: 'context clue', content: 'a piece of information near an unfamiliar word that points to its meaning.' },
    { loId: 'm7ela.context-clues', kind: 'definition', title: 'signal word', content: `a word such as or, but, unlike or such as that tells you which kind of clue is coming.` },
    { loId: 'm7ela.context-clues', kind: 'definition', title: 'restatement', content: 'the same idea said a second time in easier words.' },
    { loId: 'm7ela.context-clues', kind: 'definition', title: 'antonym', content: 'a word that means the opposite of another word.' },
  ],
  methods: [
    {
      title: 'Worked contrast reluctant',
      steps: [
        `Step one. Read past the hard word to the end of the sentence. Do not stop at reluctant and panic. The sentence keeps going, and the part after the comma is where the work is.`,
        `Step two. Look for a signal. The word "but" is sitting right there, and but is a CONTRAST signal. That tells you the second half of the sentence is the opposite of the first half.`,
        `So compare the two halves. The sister ran straight off the end without stopping. She was eager, and she did not hesitate at all. Marcus is the opposite of that.`,
        `Step three. Guess in plain words. The opposite of eager is unwilling, or hesitant. Guess: reluctant means unwilling to do something.`,
        `Step four, the step people skip. Substitute the guess back in and read the whole thing again. "Marcus was unwilling to try the high diving board, but his little sister ran straight off the end of it without stopping." That reads perfectly, so the guess holds.`,
        `Watch what happens if you miss the contrast signal and guess "excited" instead. Substitute it: "Marcus was excited to try the high diving board, but his little sister ran straight off the end of it." Now the word "but" makes no sense, because both halves say the same thing. Step four caught the error. That is the whole reason to do it.`,
      ],
      example: { problem: `What does "reluctant" mean here? "Marcus was reluctant to try the high diving board, but his little sister ran straight off the end of it without stopping."`, solution: `Reluctant means unwilling or hesitant. The contrast signal "but" sets Marcus against a sister who did not hesitate at all.` },
      relatedLoIds: ['m7ela.context-clues'],
    },
    {
      title: 'Worked next sentence meticulous',
      steps: [
        `Step one. Read past the hard word. The first sentence ends without explaining anything, and that is exactly where most students give up. Keep going into the second sentence.`,
        `Step two. Look for a signal. "That means" is a DEFINITION signal, and it is doing its job in the sentence AFTER the one with the hard word. The clue was never touching the word at all.`,
        `Read what the definition signal introduces. Lining the ruler up exactly. Writing down every digit. Checking each number a second time. All three are about being extremely careful with small details.`,
        `Step three. Guess in plain words. Meticulous means very careful about every small detail.`,
        `Step four. Substitute and check. "Our science teacher told us to be very careful about every small detail with the measurements." That reads fine, so the guess holds.`,
        `One more check worth doing. Meticulous is not the same as slow, even though being meticulous often takes longer. The clue described what you DO, which is check details, not how fast you go. Keep the meaning the clue actually gave you.`,
      ],
      example: { problem: `What does "meticulous" mean here? "Our science teacher told us to be meticulous with the measurements. That means lining the ruler up exactly, writing down every digit, and checking each number a second time before you move on."`, solution: `Meticulous means extremely careful and exact about small details. The definition clue sat in the next sentence, after "That means".` },
      relatedLoIds: ['m7ela.context-clues'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, wary means tired, because wary looks almost exactly like weary." — Spelling is not evidence. Wary means careful and watchful because you think something might be dangerous. Weary means very tired. They are two different words that happen to sit one letter apart. Run step four and the error shows up immediately. Substitute tired: "The stray cat was tired of us at first. It would not come near the bowl until we backed away and stayed still." A tired cat has no reason to wait for you to back away. Now substitute careful: "The stray cat was careful around us at first. It would not come near the bowl until we backed away and stayed still." That fits every detail. When a word reminds you of another word, treat it as a hunch to test, never as an answer.`, kind: 'common-error' },
    { content: `Students often say "You cannot tell what wary means, because the sentence with wary in it never explains it." — The clue is often in the NEXT sentence, and here it is. The second sentence says the cat would not come near until people backed away and held still for ten minutes. That is a cat watching for danger. Not knowing a word is not the same as being stuck. Read past it, read the sentence after it, then guess and substitute.`, kind: 'common-error' },
    { content: `Four steps, every time: read past the word to the end of the sentence, look for a signal, guess in plain words, then substitute the guess back in and check.`, kind: 'tip' },
    { content: `Step four is the one that catches wrong guesses. If the sentence stops making sense with your guess inside it, the guess is wrong.`, kind: 'tip' },
    { content: 'Definition clue signals: or, that is, which means, a dash or a pair of commas.', kind: 'tip' },
    { content: `Contrast clue signals: but, however, unlike, instead, although. These mean the clue is an OPPOSITE, so flip it.`, kind: 'tip' },
    { content: `Example clue signals: such as, for instance, including, like. Ask what all the examples have in common.`, kind: 'tip' },
    { content: `The clue is often in the next sentence, not beside the word, and a word that merely looks like a word you know does not have to mean the same thing.`, kind: 'tip' },
    { content: `Contrast clues give you the OPPOSITE, not the meaning. When you see *but, however, unlike, instead, although*, find the opposite idea and then FLIP it. In "the front row was taken, but the back rows stayed vacant," vacant isn't "taken" — it's the flip: empty.`, kind: 'common-error' },
    { content: `Never skip step four. Substituting your guess back into the sentence is what exposes a wrong guess. If you plug in "excited" and the word *but* suddenly makes no sense, your guess is wrong — not the sentence.`, kind: 'tip' },
    { content: `A word that LOOKS like a word you know is a hunch, not an answer. *Wary* (watchful, careful) is not *weary* (very tired). Similar spelling is zero evidence. Test the lookalike by substituting it — if the details stop fitting, drop it.`, kind: 'gotcha' },
    { content: `"The sentence doesn't explain it" is not the same as "I'm stuck." The clue often sits in the NEXT sentence, or two sentences later. Read on before you give up — that's where "That means..." or the coat-zipping details usually show up.`, kind: 'edge-case' },
    { content: `With example clues (*such as, including, for instance, like*), the examples are NOT the meaning. Ask what they all have in common. A sock under the couch and a ball behind the trash can are hiding places — so *conceal* means hide, not "sock."`, kind: 'common-error' },
    { content: `Don't stretch the guess past what the clue actually says. *Meticulous* means careful about small details — the clue never said "slow," even though careful work often takes longer. Keep the meaning the text gave you, not the one you added.`, kind: 'gotcha' },
    { content: `Say your guess in plain, everyday words before you check it. "Unwilling" or "very tired" works; "it means like when you don't want to" is too fuzzy to substitute back in. A clear guess is what makes step four possible.`, kind: 'tip' },
    { content: `Know the words for the tools: a **signal word** (or, but, such as) tells you which clue is coming; a **restatement** repeats the idea in easier words; an **antonym** is the opposite. Restatement clues have no signal — you have to notice the repeat yourself.`, kind: 'vocab-note' },
  ],
};
