/**
 * ACT — Unit 1 CED 1.5: Modifiers & Parallelism.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.modifiers-parallelism.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_MODIFIERS_PARALLELISM: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.modifiers-parallelism.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Modifiers & Parallelism',
  planId: 'evelyn.testprep.act.modifiers-parallelism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.modifiers-parallelism.v1' }],
  theory: [
    { loId: 'act.modifiers-parallelism', content: `MISPLACED MODIFIER: a modifying word or phrase must sit next to the thing it describes. Move it away and the sentence describes the wrong noun.` },
    { loId: 'act.modifiers-parallelism', content: `DANGLING MODIFIER: an opening phrase (before the first comma) has no logical subject to attach to — whatever noun comes right after that comma is what the phrase is claimed to describe.` },
    { loId: 'act.modifiers-parallelism', content: `THE COMMA CHECK: read the opening phrase, then ask "who or what is right after the comma?" If that noun could not logically do what the phrase describes, the modifier is dangling.` },
    { loId: 'act.modifiers-parallelism', kind: 'framework', title: 'Trap', content: `TRAP — WRONG NOUN AFTER THE COMMA: the ACT loves opening with a participial phrase ("Eager to finish...", "Having practiced for hours...") and then following it with an object or abstract noun that did not do the action. Answer choices often keep that wrong noun in a different disguise.` },
    { loId: 'act.modifiers-parallelism', content: `PARALLEL STRUCTURE IN LISTS: every item in a series must share the same grammatical form — all gerunds, all infinitives, or all plain nouns/verbs, not a mix.` },
    { loId: 'act.modifiers-parallelism', content: `PARALLEL STRUCTURE IN COMPARISONS AND CORRELATIVES: pairs like "not only...but also," "either...or," and "as...as" need matching form on both sides of the pair.` },
    { loId: 'act.modifiers-parallelism', kind: 'framework', title: 'Trap', content: `TRAP — ONE BROKEN ITEM: three items in a list match and one switches form (e.g., "-ing, -ing, to + verb"). The fix is almost always to convert the odd one out, not to rewrite the whole list.` },
    { loId: 'act.modifiers-parallelism', content: `"NO CHANGE" IS OFTEN RIGHT: if the modifier already sits next to the correct noun and the list or pair is already parallel, do not "fix" a sentence that is not broken.` },
    { loId: 'act.modifiers-parallelism', kind: 'definition', title: 'modifier', content: 'a word or phrase that describes or limits another word in the sentence.' },
    { loId: 'act.modifiers-parallelism', kind: 'definition', title: 'dangling modifier', content: 'an opening modifier with no logical subject next to it in the main clause.' },
    { loId: 'act.modifiers-parallelism', kind: 'definition', title: 'parallel structure', content: `matching grammatical form across items in a list, comparison, or correlative pair.` },
    { loId: 'act.modifiers-parallelism', kind: 'definition', title: 'participial phrase', content: `a phrase beginning with an -ing or -ed verb form that functions like an adjective.` },
  ],
  methods: [
    {
      title: 'Worked dangling modifier',
      steps: [
        `Read the opening phrase: "Eager to finish the science fair project before the bus arrived" — this describes a person who feels eager, not an object.`,
        `Comma check: what comes right after the comma? "The poster board" — a poster board cannot be "eager."`,
        'The modifier is dangling: it has no logical subject sitting next to it.',
        `Rewrite so the person who was eager comes right after the comma: "Eager to finish the science fair project before the bus arrived, Marisa taped the poster board together in a hurry."`,
      ],
      example: { problem: `Excerpt: "Eager to finish the science fair project before the bus arrived, THE POSTER BOARD WAS TAPED TOGETHER BY MARISA IN A HURRY." Revise the underlined portion so the sentence is not a dangling modifier.`, solution: `Eager to finish the science fair project before the bus arrived, Marisa taped the poster board together in a hurry.` },
      relatedLoIds: ['act.modifiers-parallelism'],
    },
    {
      title: 'Worked parallel list',
      steps: [
        `List the three items after "told the team to": "stretch," "run two laps," "that they should drink water."`,
        `The first two are bare-verb commands (stretch, run); the third breaks form with "that they should drink water."`,
        'Rewrite the third item to match the bare-verb pattern: "drink water."',
        'Parallel version: "stretch, run two laps, and drink water."',
      ],
      example: { problem: `Excerpt: "The coach told the team to STRETCH, RUN TWO LAPS, AND THAT THEY SHOULD DRINK WATER before practice." Fix the underlined portion so the list is parallel.`, solution: 'stretch, run two laps, and drink water' },
      relatedLoIds: ['act.modifiers-parallelism'],
    },
  ],
  pointers: [
    { content: `The subject must appear immediately after the comma, right where the main clause starts. "The rain" sits there instead of "Marcus," so the sentence literally claims the rain was walking to school. Fix: "Walking to school, Marcus felt the rain start falling."`, kind: 'common-error' },
    { content: `The word right after an opening comma must be the thing the modifier describes — not just mentioned somewhere in the sentence.`, kind: 'tip' },
    { content: `Items in a list, comparison, or correlative pair ("not only...but also," "either...or") must share the same grammatical form.`, kind: 'tip' },
    { content: `NO CHANGE is correct whenever the modifier already sits next to the right noun and the list or pair is already parallel.`, kind: 'tip' },
    { content: `ACT English is passage-embedded and fast — about 9 minutes per passage — so scan for the comma-then-noun pattern the moment you see an opening phrase.`, kind: 'tip' },
    { content: `On dangling-modifier items, the underline is usually AFTER the comma, so you can't fix the opening phrase — you must pick the choice that puts the right doer first. Scan answer choices for their first noun and eliminate any that start with an object or abstract noun.`, kind: 'tip' },
    { content: `Passive voice is the ACT's favorite dangling-modifier disguise. "Having sealed the envelope, the letter was mailed by Ana" is still wrong. If a choice after an opening phrase is passive, suspect it immediately.`, kind: 'gotcha' },
    { content: `Possessives don't count as the subject. "Trained as a chemist, Marisa's research changed the field" is dangling — the research is trained, not Marisa. The noun after the comma must be the doer, not a modifier attached to it.`, kind: 'edge-case' },
    { content: `Not every opening comma signals a dangling modifier. Openers like "In 1912," "Although the storm passed," or "Because she was late," have their own subject or are just adverbial — they don't need the next noun to be a doer. Only apply the comma check to participles and adjective phrases.`, kind: 'common-error' },
    { content: `In correlative pairs, put the two halves side by side and check that the SAME part of speech follows each half: "not only confident but also well-practiced" (adj/adj), not "not only confident but also had practiced" (adj/verb).`, kind: 'tip' },
    { content: `Comparisons must match nouns, not just grammar. "Her paintings are brighter than Kahlo" compares paintings to a person; the ACT wants "than Kahlo's." Watch for "than" and "as...as" followed by a bare name.`, kind: 'gotcha' },
    { content: `Only-type words (only, just, almost, nearly, even) are misplaced modifiers too. "She almost ran ten miles" ≠ "She ran almost ten miles." When one of these is underlined, ask which word it's meant to limit.`, kind: 'edge-case' },
    { content: `Don't pick a choice just because it's shorter. On modifier questions the correct answer often ADDS a subject ("Jake found the recital easy" beats "the recital felt easy"). Concision only wins when every choice is grammatically correct.`, kind: 'common-error' },
  ],
};
