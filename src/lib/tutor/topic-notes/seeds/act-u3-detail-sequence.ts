/**
 * ACT — Unit 3 CED 3.2: Detail & Sequence Questions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.detail-sequence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_DETAIL_SEQUENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.detail-sequence.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Detail & Sequence Questions',
  planId: 'evelyn.testprep.act.detail-sequence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.detail-sequence.v1' }],
  theory: [
    { loId: 'act.detail-sequence', content: `DETAIL questions ask what the passage LITERALLY states. Before answering, locate the exact line reference the question cites — never rely on memory of the whole passage.` },
    { loId: 'act.detail-sequence', content: `LINE-REFERENCE DISCIPLINE: go to the cited line, then read one sentence before and one sentence after for context. The answer's wording often sits just outside the cited line, not inside it.` },
    { loId: 'act.detail-sequence', kind: 'framework', title: 'Trap', content: `TRAP — NEARBY LOOKALIKE: a wrong choice recycles words from a DIFFERENT nearby line. Re-verify the choice against the EXACT line cited, not just whether it "sounds familiar."` },
    { loId: 'act.detail-sequence', kind: 'framework', title: 'Trap', content: `TRAP — WORD-MATCHING vs MEANING-MATCHING: the correct detail answer often paraphrases the passage; wrong answers repeat exact passage words but distort the underlying fact.` },
    { loId: 'act.detail-sequence', content: `SEQUENCE (event-ordering) questions ask for the CHRONOLOGICAL order events happened — not the order they are narrated. Narrative passages routinely open in the present and flash back, or jump ahead.` },
    { loId: 'act.detail-sequence', kind: 'framework', title: 'Trap', content: `TRAP — NARRATION ORDER: assuming "mentioned first" means "happened first." Flashbacks and framing devices break this assumption constantly in ACT prose-fiction and humanities passages.` },
    { loId: 'act.detail-sequence', content: `STRATEGY: as you read, underline temporal signal words — "three years earlier," "the following spring," "by then," "now," "two years after" — and use them to build a timeline independent of paragraph order.` },
    { loId: 'act.detail-sequence', content: `PACE CHECK: at ~52 seconds per question, line-reference and sequence questions should be some of your FASTEST. The answer is locatable in the text — verify and move on, don't overthink.` },
    { loId: 'act.detail-sequence', kind: 'definition', title: 'line reference', content: `the specific line number(s) a question cites — always the fastest path to the answer.` },
    { loId: 'act.detail-sequence', kind: 'definition', title: 'chronological order', content: `the order events actually happened in time, which may differ from the order a passage narrates them.` },
    { loId: 'act.detail-sequence', kind: 'definition', title: 'flashback', content: `a narrative jump backward in time to an earlier event, common in ACT prose-fiction and humanities passages.` },
  ],
  methods: [
    {
      title: 'Worked line lookup',
      steps: [
        `The question cites line 4 exactly — go there, not to the whole passage from memory.`,
        'Line 4 reads: "never opened one without a key."',
        `Match the fact precisely: Mara had rebuilt locks (line 3) but had never opened one WITHOUT a key.`,
        `Trap check: line 3's "six broken locks" is a different fact (how many she rebuilt) — don't let it bleed into the line-4 answer.`,
      ],
      example: { problem: `Passage (lines 1-7):
1  Mara had wanted to be a locksmith since she was nine, when her
2  grandfather let her take apart an old strongbox on the porch. By the
3  time she turned sixteen, she had rebuilt six broken locks, but she had
4  never opened one without a key. Her grandfather watched from the
5  doorway, arms crossed, saying nothing, until she finally coaxed the
6  tumblers into place. "Now you're a locksmith," he said, and only then
7  did he smile.

Question: According to line 4, what had Mara never done before this moment?`, solution: 'She had never opened a lock without using a key.' },
      relatedLoIds: ['act.detail-sequence'],
    },
    {
      title: 'Worked sequence trap',
      steps: [
        `This is a sequence question — do NOT default to narration order. The passage opens in the present (lines 1-2), then flashes back.`,
        `Underline the temporal signal words: "three years earlier" (line 2), "the following spring" (line 4-5), "now... tenth attempt" (line 5-6, present time).`,
        `Build the timeline from those markers: the turned-back hike is earliest (three years ago), the finished hike is next (the following spring), the tenth attempt is latest (now).`,
        `Order: I (turned back) -> II (finished the following spring) -> III (tenth attempt, present).`,
      ],
      example: { problem: `Passage (lines 1-9):
1  Elena stood at the trailhead, lacing her boots for the sunrise
2  climb. She had not always loved mountains. Three years earlier, on
3  her first hike with the school club, she had turned back after
4  twenty minutes, certain her legs would give out. The following
5  spring she tried again, and finished, though barely. Now, on her
6  tenth attempt at this particular peak, she tightened her laces and
7  stepped onto the trail without a second thought, the fear she
8  remembered from that first hike a distant, almost unbelievable,
9  memory.

Events described in the passage:
  I. Elena turns back twenty minutes into her first hike.
  II. Elena finishes a climb after trying again the following spring.
  III. Elena steps onto the trail for her tenth attempt at this peak.

Question: Which lists the events in the order they actually happened, earliest to latest?`, solution: 'I, II, III' },
      relatedLoIds: ['act.detail-sequence'],
    },
  ],
  pointers: [
    { content: `Narrative passages frequently open in the present or in medias res, then flash back. Find the explicit temporal signal words ("three years earlier," "the following spring," "now") and build the timeline from THOSE, ignoring paragraph order.`, kind: 'common-error' },
    { content: `Detail questions: go to the exact line cited, read a sentence before and after, and match MEANING, not just recycled words.`, kind: 'tip' },
    { content: `Distrust choices that reuse passage wording but attach a different, unstated fact — the nearby-lookalike trap.`, kind: 'tip' },
    { content: `Sequence questions ask for chronological order, not narration order — watch for flashbacks and temporal signal words ("three years earlier," "the following spring," "by then").`, kind: 'tip' },
    { content: `At ~52 seconds a question, these should be your fastest points: verify against the text and move on.`, kind: 'tip' },
    { content: `Line numbers on the ACT mark where a line *begins* — a sentence cited as "line 4" may start mid-line 3 and end mid-line 5. Read the whole sentence containing the cited line, not just the printed strip of text.`, kind: 'gotcha' },
    { content: `"According to the passage" with NO line cite still means a literal-detail question. Don't upgrade it to inference — hunt the text for the fact. Answers that require you to add reasoning are wrong on these stems.`, kind: 'vocab-note' },
    { content: `Sequence answer choices are usually four permutations of the SAME roman numerals. Lock down just the earliest event first — that alone often kills two or three choices before you order the rest.`, kind: 'tip' },
    { content: `A flashback can contain its own flashback. "Two years after that loss" is measured from the LOSS, not from the narrated present — anchor each relative marker to the event it names, not to whatever you read last.`, kind: 'edge-case' },
    { content: `Watch for the DEGREE distortion: the passage says "rarely," "nearly," or "had begun to"; the choice says "never," "did," or "always." One swapped qualifier is the whole difference between right and wrong.`, kind: 'common-error' },
    { content: `Don't confuse detail questions with main-idea questions in the same set. If a choice is true of the passage overall but not stated in the cited lines, it's wrong on a detail question — "true" and "correct" aren't the same thing here.`, kind: 'gotcha' },
    { content: `Past perfect ("had rebuilt," "had already forgotten") is a sequence flag even with no date attached — it signals the event happened BEFORE the surrounding narration. Treat it like a temporal signal word and underline it.`, kind: 'tip' },
    { content: `If the cited lines are dialogue, the answer may hinge on who's speaking. Check the tag before and after the quote — attributing a line to the wrong character is a top detail-question error in prose fiction.`, kind: 'common-error' },
  ],
};
