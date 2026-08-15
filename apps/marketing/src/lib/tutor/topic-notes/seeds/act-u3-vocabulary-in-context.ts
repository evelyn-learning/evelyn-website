/**
 * ACT — Unit 3 CED 3.4: Vocabulary in Context.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.vocabulary-in-context.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_VOCABULARY_IN_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.vocabulary-in-context.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Vocabulary in Context',
  planId: 'evelyn.testprep.act.vocabulary-in-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.vocabulary-in-context.v1' }],
  theory: [
    { loId: 'act.vocabulary-in-context', content: `THE QUESTION SHAPE: "As it is used in line X, the word Y most nearly means..." — it names a specific line, which means the sentence itself decides the answer, not the word in isolation.` },
    { loId: 'act.vocabulary-in-context', content: `THE CORE TRAP: the ACT deliberately chooses words with a common, everyday meaning that is NOT the meaning used in the passage. That common meaning is almost always one of the four choices, and it is almost always wrong. Do not answer from memory of "what this word usually means."` },
    { loId: 'act.vocabulary-in-context', content: `COVER-PREDICT-MATCH: cover the answer choices, reread the sentence (plus one sentence before/after for context), predict your own substitute word, THEN uncover the choices and match your prediction — not the word's default meaning.` },
    { loId: 'act.vocabulary-in-context', content: `TESTED WORDS ARE USUALLY ORDINARY, not obscure. "Sound," "novel," "grave," "temper," "arresting" — everyday words with a second, less common sense. The difficulty is entirely in the trap, not in the vocabulary itself.` },
    { loId: 'act.vocabulary-in-context', content: `RELINE EVERY TIME: reread using the exact line number given. The same word can carry a different sense in a different paragraph — never reuse a definition of the word from earlier in the passage.` },
    { loId: 'act.vocabulary-in-context', content: `PART-OF-SPEECH CHECK: your substitute must fit the same grammatical role the word plays in that sentence — noun for noun, verb for verb, adjective for adjective. A choice can be a real meaning of the word and still fail this check.` },
    { loId: 'act.vocabulary-in-context', content: `WHEN TWO CHOICES LOOK PLAUSIBLE: plug each one back into the sentence and read it for sense and tone. The wrong one is usually a genuine meaning of the word in isolation, but it makes the sentence awkward or nonsensical in context.` },
    { loId: 'act.vocabulary-in-context', kind: 'definition', title: 'vocabulary-in-context question', content: `a question asking what a word "most nearly means" as used in a specific, cited line of the passage.` },
    { loId: 'act.vocabulary-in-context', kind: 'definition', title: 'common-meaning trap', content: `the wrong answer choice built from the word's most familiar, everyday sense — present precisely because it is tempting.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        `Cover the choices first. Reread the sentence: a method is "sound" if it has been "tested across several seasons and different soil types" and can be "trusted to hold up."`,
        'Predict a substitute in your own words: "solid," "trustworthy," "proven."',
        `Notice the common-meaning trap: "sound" most often makes people think of noise/hearing (choice a) — but nothing in this sentence is about hearing, so that meaning cannot fit.`,
        `Also notice "sound" has two OTHER real meanings baited here — undisturbed sleep (c) and a body of water (d) — neither fits a farming "method."`,
        `Match your prediction to the choices: "reliable and well-supported" is the only one that fits a tested, trustworthy method.`,
      ],
      example: { problem: `Dr. Alvarez had spent a decade studying which farming methods actually protected topsoil, so when younger colleagues proposed shortcuts, she reminded them that only a SOUND method — one tested across several seasons and different soil types — could be trusted to hold up when a drought finally came. As it is used in this sentence, "sound" most nearly means: (a) loud (b) reliable and well-supported (c) deep, as in undisturbed sleep (d) a narrow body of water`, solution: 'reliable and well-supported' },
      relatedLoIds: ['act.vocabulary-in-context'],
    },
    {
      title: 'Worked trap variant',
      steps: [
        `COMMON-MEANING TRAP CHECK FIRST: "temper" instantly suggests anger ("lost his temper") — but that use is a NOUN, and here "tempered" is a VERB acting on "enthusiasm." Cross out (a) immediately on part-of-speech grounds, not just meaning.`,
        `A second real meaning is baited too: "temper" a metal means to HARDEN it through heat treatment — a legitimate verb use of the word, so it survives the part-of-speech check.`,
        `Read for sense: does "sobering reality" harden enthusiasm, or does it soften/restrain it? A sobering fact reins excess enthusiasm in — it does not strengthen it. (b) fails the sense check even though it is a real meaning of the word.`,
        `Predict your own substitute before matching: "reined in," "toned down," "kept in check."`,
        `Confirm by plugging back in: "enthusiasm had to be moderated or restrained by the sobering reality" reads naturally — (c) is correct.`,
      ],
      example: { problem: `The coach's early enthusiasm for the untested lineup had to be TEMPERED by the sobering reality of a schedule that included three of last year's playoff teams in the first month alone. As it is used in this sentence, "tempered" most nearly means: (a) angered (b) hardened, as in metal-working (c) moderated or restrained (d) ignored`, solution: 'moderated or restrained' },
      relatedLoIds: ['act.vocabulary-in-context'],
    },
  ],
  pointers: [
    { content: `Always reread the exact line named in the question and predict a substitute word BEFORE looking at the choices. The ACT deliberately writes these questions around words whose common, everyday meaning is wrong in that specific sentence — treat the familiar meaning as a warning sign, not a shortcut.`, kind: 'common-error' },
    { content: `"As it is used in line X, the word Y most nearly means" is decided by that sentence, not by the word's dictionary-default sense.`, kind: 'tip' },
    { content: `The word's most common everyday meaning is almost always one of the four choices — and it's usually the wrong one. That's the trap.`, kind: 'tip' },
    { content: `Cover the choices, reread the sentence plus context, predict your own substitute, THEN match to a choice.`, kind: 'tip' },
    { content: `Check part of speech and plug your answer back into the sentence — it should read naturally.`, kind: 'tip' },
    { content: `"Most nearly means" ≠ "is a synonym for." The right answer often sounds *less* like a dictionary definition of the word than a wrong choice does. Pick the one that keeps the sentence's meaning intact when substituted, even if it feels loose.`, kind: 'vocab-note' },
    { content: `Occasionally the common meaning IS correct. The trap is answering from memory, not the familiar meaning itself. If you reread the line and the everyday sense genuinely fits, take it — don't talk yourself into an exotic choice just because it feels ACT-ish.`, kind: 'gotcha' },
    { content: `Read one sentence BEFORE and AFTER the cited line, not just the line. The clue is often in the next clause ("a SOUND method — one tested across several seasons") or in a contrast word like *but*, *though*, *rather than* that flips the sense.`, kind: 'tip' },
    { content: `Watch tone/charge: many tested words split into a positive and a negative sense. *Arresting* (praise) vs. *stopping*; *grave* (worried) vs. *burial plot*; *plastic* (flexible) vs. *fake*. Ask whether the sentence is admiring, critical, or neutral, then pick the choice with matching charge.`, kind: 'tip' },
    { content: `Check the word's grammatical partners, not just its part of speech. "Tempered BY reality," "charged WITH," "draw ON" — the preposition or object narrows the sense. A choice that can't take the same preposition or object is out.`, kind: 'common-error' },
    { content: `In dual-passage or paired-viewpoint sets, a vocab question naming a line in Passage B must be answered from Passage B's sentence — even if the same word appeared in Passage A with a different sense. Confirm which passage the line number belongs to before rereading.`, kind: 'edge-case' },
    { content: `Distractors are often built from OTHER words in the sentence, not other meanings of the tested word. If a choice echoes nearby passage wording, that's a warning sign, not evidence — verify it substitutes for the tested word specifically.`, kind: 'gotcha' },
    { content: `Budget under 30 seconds. These are the cheapest points in Reading because you never need the passage's main idea — just the line. If you're stuck between two, plug both in, read aloud in your head, and move on; don't reread the whole paragraph.`, kind: 'tip' },
  ],
};
