/**
 * Grade 6 English Language Arts — Unit 6 CED 6.4: Maintaining Consistent Style & Tone.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.maintaining-consistent-style-and-tone.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U6_MAINTAINING_CONSISTENT_STYLE_AND_TONE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.maintaining-consistent-style-and-tone.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Maintaining Consistent Style & Tone',
  planId: 'evelyn.ms.m6ela.maintaining-consistent-style-and-tone.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.maintaining-consistent-style-and-tone.v1' }],
  theory: [
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `A PIECE OF WRITING PICKS ONE REGISTER AND HOLDS IT FROM START TO FINISH. A school report, a class newsletter, or a note to a principal chooses a formal register: careful word choice, no slang, no casual asides. A text to a friend or a personal story chooses an informal register: everyday words, exclamation points, casual filler. The choice happens once, near the beginning, and every sentence after it should match.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `A LAPSE IS ONE SENTENCE THAT DOES NOT MATCH THE REST. A single slangy aside dropped into an otherwise formal report breaks the piece, even though every other sentence is fine. A single stiff, jargon-heavy sentence dropped into a warm, casual letter breaks it the same way, just in the opposite direction. Either way it is the same mistake: one sentence picked a different register than the rest of the piece.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `FIND THE LAPSE BY COMPARING SENTENCES TO EACH OTHER, NOT BY JUDGING ONE SENTENCE ALONE. Read the whole piece first and decide which register most of its sentences are using. Then check every sentence against that majority. The sentence that does not match is the lapse, and it cannot be spotted by reading it in isolation — the break only exists next to the sentences around it.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `A LAPSE CAN BE A PERFECTLY CORRECT SENTENCE. A sentence can have no fragment, no run-on, and no nonstandard grammar, and still be the one that breaks a piece, because the problem is not how the sentence is built — it is that its wording does not match the register the rest of the piece already established.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `FIX A LAPSE BY REWRITING IT IN THE ESTABLISHED REGISTER, KEEPING THE SAME INFORMATION. A casual aside inside a formal report gets rewritten with precise, formal wording that still says what the aside said. A stiff, jargon-heavy sentence inside a casual letter gets rewritten with the same warm, everyday words the rest of the letter already uses.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', content: `SLANG, CASUAL FILLER WORDS, AND EXAGGERATION SIGNAL AN INFORMAL REGISTER. PRECISE VOCABULARY AND FORMAL TRANSITIONS SIGNAL A FORMAL REGISTER. Noticing those signals is what lets a reader spot the one sentence that switched registers partway through a piece.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', kind: 'definition', title: 'register', content: `how formal or informal a piece of writing needs to be for its audience and purpose, such as a school report versus a text to a friend.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', kind: 'definition', title: 'style', content: `the level of formality and word choice a writer settles on for one whole piece of writing.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', kind: 'definition', title: 'tone', content: `the attitude a piece of writing carries toward its subject, held steady from the first sentence to the last.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', kind: 'definition', title: 'formal', content: `careful, precise word choice with no slang and no casual asides, suited to a report, a letter to an official, or a class presentation.` },
    { loId: 'm6ela.maintaining-consistent-style-and-tone', kind: 'definition', title: 'consistency', content: `keeping the same register and tone in every sentence of a piece, instead of switching partway through.` },
  ],
  methods: [
    {
      title: 'Worked formal report with a casual lapse',
      steps: [
        `Set aside the sentence you are unsure about, and read only the rest of the announcement: "The sixth-grade class is holding a bake sale on Friday to raise money for the spring field trip." "Every homeroom will set up a table in the cafeteria at lunchtime." "All proceeds will go directly toward transportation and admission costs for the trip." All three state facts about the event in careful, precise wording, with no slang anywhere.`,
        `That is the established register: formal and informative. Now check the remaining sentence against it: "Anyway, cookies are basically the best thing ever, no joke."`,
        `Name exactly what does not match. The words "anyway," "basically," and "no joke" are casual filler. No other sentence in the announcement uses wording like that, and none of them state a personal opinion the way this one does.`,
        `Confirm the lapse is not a grammar problem. The sentence is complete and correctly punctuated. The problem is that its register does not match the three sentences around it, not how it is built.`,
        `Fix the lapse by keeping the same information — that cookies are a popular item at the sale — in formal wording. WRONG: "Anyway, cookies are basically the best thing ever, no joke." CORRECT: "Cookies are expected to be one of the sale's most popular items."`,
        `Read the repaired announcement straight through and confirm every sentence now matches: careful, factual wording from the first sentence to the last.`,
      ],
      example: { problem: `Read the class newsletter announcement below, then find the one sentence that breaks its formal, informative tone.

"The sixth-grade class is holding a bake sale on Friday to raise money for the spring field trip. Every homeroom will set up a table in the cafeteria at lunchtime. Anyway, cookies are basically the best thing ever, no joke. All proceeds will go directly toward transportation and admission costs for the trip."`, solution: `The lapse is "Anyway, cookies are basically the best thing ever, no joke." It breaks the announcement's formal register with casual filler words, even though it is a grammatically complete sentence. Rewritten to match: "Cookies are expected to be one of the sale's most popular items."` },
      relatedLoIds: ['m6ela.maintaining-consistent-style-and-tone'],
    },
    {
      title: 'Worked casual letter with a formal lapse',
      steps: [
        `Set aside the sentence you are unsure about, and read only the rest of the entry: "Saturday was awesome because Priya and I finally built the treehouse we had been planning all summer." "We used the extra plywood from her dad's garage and about a million nails." "We are already planning to paint it green next weekend." All three sound like a friend talking: everyday words, an exaggeration ("a million nails"), and an exclamation of excitement ("awesome").`,
        `That is the established register: warm and casual. Now check the remaining sentence against it: "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection."`,
        `Name exactly what does not match. Words like "subsequently," "aforementioned," and "deemed" are precise, formal vocabulary. No other sentence in the entry uses wording anywhere near that stiff.`,
        `Notice the direction is reversed from the bake-sale example: there, a casual sentence landed inside a formal piece; here, a formal sentence lands inside a casual piece. The fix works the same way either direction — find the register most of the piece is using, and match the lapse to it.`,
        `Fix the lapse by keeping the same information — that the treehouse was checked and found sturdy — in casual wording. WRONG: "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection." CORRECT: "We checked it over afterward, and it felt totally sturdy."`,
        `Read the repaired entry straight through and confirm every sentence now matches: warm, everyday wording from the first sentence to the last.`,
      ],
      example: { problem: `Read the diary entry below, then find the one sentence that breaks its warm, casual tone.

"Saturday was awesome because Priya and I finally built the treehouse we had been planning all summer. We used the extra plywood from her dad's garage and about a million nails. Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection. We are already planning to paint it green next weekend."`, solution: `The lapse is "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection." It breaks the entry's casual register with stiff, formal vocabulary. Rewritten to match: "We checked it over afterward, and it felt totally sturdy."` },
      relatedLoIds: ['m6ela.maintaining-consistent-style-and-tone'],
    },
  ],
  pointers: [
    { content: `Students often say "That sentence is wrong because it is a run-on." — Check a sentence's grammar and its register separately. A run-on has a structural problem that exists inside that one sentence alone. A register lapse only exists next to the sentences around it: the sentence itself can be perfectly correct, and it is still the one that does not belong, because its wording does not match the rest of the piece.`, kind: 'common-error' },
    { content: `Students often say "I found the lapse by looking for the one word with the strongest feeling, the way I would for a story's tone." — This check compares whole sentences to the register the rest of a piece has already established, not one word's feeling inside a single sentence. Read the whole piece, decide what register most of it uses, and then look for the one sentence — not the one word — that does not match. The word-by-word check belongs to reading a text that is already finished; this check belongs to keeping a piece of writing steady while it is being judged as a whole.`, kind: 'common-error' },
    { content: `A piece of writing picks one register, formal or informal, and holds it from the first sentence to the last.`, kind: 'tip' },
    { content: `A lapse is one sentence that does not match the rest, whether a casual aside lands inside a formal piece or a stiff, jargon-heavy sentence lands inside a casual one.`, kind: 'tip' },
    { content: `Find a lapse by comparing sentences to the majority register of the whole piece, never by judging one sentence alone.`, kind: 'tip' },
    { content: `A lapse can be a grammatically perfect sentence. The problem is its register, not its structure.`, kind: 'tip' },
    { content: `Fix a lapse by rewriting it in the established register while keeping the same information.`, kind: 'tip' },
    { content: `This is a whole-passage check. A single word's tone inside one sentence is a different skill.`, kind: 'tip' },
  ],
};
