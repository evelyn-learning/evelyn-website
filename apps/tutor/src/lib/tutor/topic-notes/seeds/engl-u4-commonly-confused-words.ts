/**
 * HS English — Unit 4 CED 4.4: Commonly Confused Words.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.commonly-confused-words.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U4_COMMONLY_CONFUSED_WORDS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.commonly-confused-words.v1',
  course: 'HS English',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Commonly Confused Words',
  planId: 'evelyn.hs.engl.commonly-confused-words.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.commonly-confused-words.v1' }],
  theory: [
    { loId: 'engl.commonly-confused-words', kind: 'framework', title: 'The big idea', content: `THE BIG IDEA — do not memorize pairs, memorize TESTS. Every confusable pair splits along one of three lines: what part of speech the slot needs, what the sentence MEANS, or whether the thing being counted can be counted at all.` },
    { loId: 'engl.commonly-confused-words', content: `THE PART-OF-SPEECH TEST: AFFECT vs EFFECT — "affect" is almost always the VERB (to influence), "effect" is almost always the NOUN (the result). Try inserting "the" in front of the blank: if "the ___" reads naturally, you need the noun "effect". WRONG: "The new schedule effected my mood." CORRECT: "The new schedule affected my mood, and the effect lasted all week." Memory hook: Affect = Action, Effect = End result.` },
    { loId: 'engl.commonly-confused-words', content: `THE COMPARISON TEST vs THE TIME TEST: THAN vs THEN — "than" appears only in comparisons (more, less, better, worse, older); "then" marks time or sequence (next, after that, at that point). Ask which the sentence is doing. WRONG: "Her draft was stronger then mine." CORRECT: "Her draft was stronger than mine, and then she revised it again." Memory hook: thAn compAres, thEn is timE.` },
    { loId: 'engl.commonly-confused-words', content: `THE COUNTABLE TEST vs THE MASS TEST: FEWER vs LESS — use "fewer" for things you can count one by one (fewer chairs, fewer errors, fewer students); use "less" for amounts measured as a mass (less water, less time, less patience). WRONG: "This draft has less errors." CORRECT: "This draft has fewer errors and needs less revision." Memory hook: if you can put a number in front of it, use FEWER.` },
    { loId: 'engl.commonly-confused-words', kind: 'framework', title: 'The meaning test', content: `THE MEANING TEST — ACCEPT vs EXCEPT — "accept" is a verb meaning to receive or agree to; "except" means leaving something out. Substitute "receive" or "leave out" and see which fits. WRONG: "Everyone excepted the invitation accept Devon." CORRECT: "Everyone accepted the invitation except Devon." Memory hook: EXcept EXcludes.` },
    { loId: 'engl.commonly-confused-words', kind: 'framework', title: 'The meaning test', content: `THE MEANING TEST — LOSE vs LOOSE — "lose" (one o) is the verb: to misplace or be defeated. "Loose" (two o's) is the adjective: not tight. WRONG: "Do not loose your notes." CORRECT: "Do not lose your notes; the binder rings are loose." Memory hook: LOOSE has an extra o because it is roomy; LOSE lost one.` },
    { loId: 'engl.commonly-confused-words', kind: 'framework', title: 'The meaning test', content: `THE MEANING TEST — ALLUSION vs ILLUSION — an "allusion" is an indirect reference to something outside the text; an "illusion" is a false appearance. WRONG: "The poem makes an illusion to a childhood summer." CORRECT: "The poem makes an allusion to a childhood summer, and the calm it describes turns out to be an illusion." Memory hook: aLLusion points eLsewhere, iLLusion is unreaL.` },
    { loId: 'engl.commonly-confused-words', kind: 'framework', title: 'The habit that catches the rest', content: `THE HABIT THAT CATCHES THE REST — when two words sound alike, say what you MEAN in plain words first ("influenced", "compared to", "leave out", "not tight"), then pick the word that carries that meaning. Reading the finished sentence back with the plain-word version substituted in catches almost every remaining slip.` },
    { loId: 'engl.commonly-confused-words', kind: 'definition', title: 'part of speech', content: `the grammatical job a word does in a sentence — verb, noun, adjective — which often decides which twin belongs in the slot.` },
    { loId: 'engl.commonly-confused-words', kind: 'definition', title: 'count noun', content: `a noun for things that can be numbered one by one (errors, chairs), which takes "fewer" rather than "less".` },
    { loId: 'engl.commonly-confused-words', kind: 'definition', title: 'allusion', content: 'an indirect reference to a person, event, or work outside the text.' },
  ],
  methods: [
    {
      title: 'Worked affect effect',
      steps: [
        `Identify what the slot needs. The words right before the blank are "would ___", and "would" is a helping verb — a helping verb must be followed by a main VERB.`,
        `Apply the part-of-speech test: "affect" is the verb, "effect" is the noun. Confirm it with the "the" check — "would the effect attendance" is nonsense, so the noun does not belong here.`,
        `Plug in the plain-word meaning: the council wants to know how the schedule would INFLUENCE attendance. "Influence" is a verb, which matches "affect".`,
        `Final sentence: "The city council wanted to know how the later bus schedule would AFFECT attendance at the after-school tutoring center." If you wanted the noun instead, the sentence would have to be rebuilt: "The council wanted to know the EFFECT of the later bus schedule on attendance."`,
      ],
      example: { problem: `Choose the correct word: "The city council wanted to know how the later bus schedule would ___ attendance at the after-school tutoring center."`, solution: 'affect — the slot follows the helping verb "would", so it needs the verb form' },
      relatedLoIds: ['engl.commonly-confused-words'],
    },
    {
      title: 'Worked fewer less error',
      steps: [
        `The sentence uses "less" twice, so test each one separately. Never judge the sentence as a whole — each blank has its own noun.`,
        `First use: "less members". Apply the countable test — can you put a number in front of "members"? Yes: twelve members, forty members. Members are counted one by one, so the correct word is "fewer". This half is WRONG.`,
        `Second use: "less time". Can you say "four times" and mean the same thing as an amount of time? No — time here is a mass, measured rather than counted. "Less" is CORRECT.`,
        `Why the ear fails: "less" has become the default in everyday speech, so both halves sound fine. The number test is what separates them.`,
      ],
      example: { problem: `A student writes: "Since the club switched to online sign-ups, there are less members waiting in line and the whole process takes less time." It sounds natural read aloud. Is it correct?`, solution: `Half correct — the revision is "there are FEWER members waiting in line and the whole process takes LESS time." Members are countable; time is not.` },
      relatedLoIds: ['engl.commonly-confused-words'],
    },
  ],
  pointers: [
    { content: `The sentence needs a VERB meaning to misplace, which is "lose" with one o. "Loose" is an adjective meaning not tight, which cannot follow "to want to" here. CORRECT: "I did not want to lose my place in the essay." Compare: "The pages were loose in the binder."`, kind: 'common-error' },
    { content: `Learn the TEST, not the list: part of speech, meaning, or countability decides every one of these pairs.`, kind: 'tip' },
    { content: `Affect = the verb (Action); effect = the noun (End result) — if "the ___" fits, you need "effect".`, kind: 'tip' },
    { content: `ThAn compAres; thEn is timE. Fewer counts one by one; less measures a mass. EXcept EXcludes; accept receives.`, kind: 'tip' },
    { content: `Lose (one o) is the verb, loose (two o's) is not tight; an allusion points elsewhere, an illusion is not real.`, kind: 'tip' },
    { content: `Spellcheck cannot catch any of these — say the plain-word meaning first, then pick the word that carries it.`, kind: 'tip' },
    { content: `Spellcheck will never flag these. Both twins are real, correctly spelled words, so the squiggly line is not proof of anything. Proofread confusable pairs by hand, one blank at a time.`, kind: 'gotcha' },
    { content: `Test each blank separately, even in the same sentence. "There are less members and it takes less time" is half wrong — *fewer* members, *less* time. Judging the sentence as a whole hides the error.`, kind: 'common-error' },
    { content: `"Sounds right" is worthless here — the pairs are homophones or near-homophones on purpose. Reading aloud only confirms your habit. Say the plain-word meaning instead: influenced, compared to, leave out, not tight.`, kind: 'tip' },
    { content: `"Effect" *can* be a verb (to effect change = to bring about) and "affect" a noun in psychology, but in your writing assume affect = verb, effect = noun. Don't use the rare exception to justify a slip.`, kind: 'edge-case' },
    { content: `Say "allusion," not "illusion," when naming a reference in a text — an allusion points OUTSIDE the text to a person, event, or work. Calling it an illusion says the text is faking something, which is a different claim entirely.`, kind: 'vocab-note' },
    { content: `After a helping verb (would, will, can, might, to) you need a VERB: would affect, want to lose. If you wrote a noun or adjective there, the sentence breaks — check what word sits right before the blank.`, kind: 'tip' },
    { content: `Money, distance, and time take "less" even though they look countable: less than $20, less than five miles, less than an hour. They're measured as amounts, not counted one by one.`, kind: 'edge-case' },
    { content: `"Then" never follows a comparison word. If you see more, less, better, worse, older, stronger, or -er before the blank, it's "than" — no exceptions.`, kind: 'common-error' },
  ],
};
