/**
 * ACT — Unit 3 CED 3.5: Comparing Paired Passages.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.paired-passages.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_PAIRED_PASSAGES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.paired-passages.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.5',
  cedTitle: 'Comparing Paired Passages',
  planId: 'evelyn.testprep.act.paired-passages.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.paired-passages.v1' }],
  theory: [
    { loId: 'act.paired-passages', content: `ORDER IS FIXED: A-alone questions come first, then B-alone questions, then comparison questions — always in that order, matching passage order. Do not jump ahead to comparison questions early.` },
    { loId: 'act.paired-passages', content: `BEFORE the comparison questions, form ONE sentence per passage on the shared topic: "A says ___. B says ___." That sentence is what you compare against, so you are not re-reading both passages under time pressure.` },
    { loId: 'act.paired-passages', content: `THE "BOTH PASSAGES" TRAP: a stem like "Both passages agree that..." or "Both authors would agree..." is only correct if the claim is verifiable in A AND in B. A claim that is well-supported by only one passage — however true it sounds — is wrong.` },
    { loId: 'act.paired-passages', content: `AGREEMENT vs. DEPARTURE: some comparison questions ask for common ground ("both would agree..."); others ask where the passages diverge ("the passages differ most on..."). Read the stem before scanning — they require opposite answers.` },
    { loId: 'act.paired-passages', content: `"HOW WOULD THE AUTHOR OF A RESPOND TO B" questions: predict the response using ONLY Passage A's stated position and values. Do not import outside knowledge about the topic, and do not borrow reasoning from Passage B.` },
    { loId: 'act.paired-passages', content: `ATTRIBUTION TRAP: an answer choice can flip which passage said what — assigning A's claim to B, or vice versa. Always check the passage number before matching an answer to a claim.` },
    { loId: 'act.paired-passages', content: `LINE/PARAGRAPH REFERENCES still point at ONE passage at a time, even inside the comparison block. Confirm which passage the reference belongs to before answering.` },
    { loId: 'act.paired-passages', kind: 'definition', title: 'common ground', content: `a claim or attitude that both passages actually support, not just a claim that fits the shared topic.` },
    { loId: 'act.paired-passages', kind: 'definition', title: 'point of departure', content: `the specific place where the two passages' positions diverge.` },
    { loId: 'act.paired-passages', kind: 'definition', title: 'attribution trap', content: `an answer choice that assigns one author's claim or attitude to the other author.` },
  ],
  methods: [
    {
      title: 'Worked common ground',
      steps: [
        `This is a comparison question ("based on both passages") — the answer must hold for A AND B, not just one.`,
        `One-sentence summary: A says formal lessons with teacher feedback build skill; B says imitation and self-directed practice build skill.`,
        `The methods are opposite (teacher-led vs. self-directed), so "agree" has to be about something ABOVE the method, not a technique specific to either side.`,
        `A mentions studying "for even two years"; B mentions motivation mattering "over ten years." Both frame skill as something built through sustained time investment, not acquired instantly.`,
        `Sustained practice over time is the one claim both passages actually make — that is the common ground, regardless of which method either author prefers.`,
      ],
      example: { problem: `Passage A: "Structured lessons remain the most reliable path to musical fluency. A trained teacher corrects posture and technique before bad habits calcify, sequences repertoire from simple to complex, and provides accountability through weekly practice checks. Students who study privately for even two years typically read notation fluently and can transpose on request — skills that self-taught musicians often lack. Without this scaffolding, most beginners plateau within months, frustrated by errors they cannot diagnose themselves." Passage B: "Some of the most inventive musicians in history never took a formal lesson. Learning by ear — imitating recordings, experimenting until a passage sounds right — builds an instinct for rhythm and phrasing that classroom drills rarely teach. Self-directed learners choose songs that excite them, so practice feels like play rather than obligation, and that sustained motivation matters more over ten years than a flawless first two. Rules learned too early can even calcify into rigidity." Question: Based on both passages, the two authors would most likely agree that becoming skilled at music requires:`, solution: 'Sustained practice over an extended period of time, regardless of method.' },
      relatedLoIds: ['act.paired-passages'],
    },
    {
      title: 'Worked attribution trap',
      steps: [
        'Check each passage separately before accepting a "both" claim.',
        `Passage A does support this: it says beginners without a teacher get "frustrated by errors they cannot diagnose themselves."`,
        `Passage B never claims a teacher reduces frustration. It argues self-teaching keeps practice feeling "like play rather than obligation," and it warns that lessons learned too early can "calcify into rigidity."`,
        `The claim is supported by Passage A alone, not by Passage B — this is the classic paired-passage trap: a statement true of one passage, dressed up as a "both passages" answer.`,
        `Correct move: reject this choice and look for a claim you can point to in EACH passage individually.`,
      ],
      example: { problem: `Using the same Passage A and Passage B, a question asks you to evaluate this choice: "Both authors would agree that working with a formal teacher is the fastest way to avoid frustration."`, solution: `The claim is a trap — it is true of Passage A only, so it cannot be the answer to a "both passages" question.` },
      relatedLoIds: ['act.paired-passages'],
    },
  ],
  pointers: [
    { content: `Neither passage mentions talent at all — Passage A credits teacher-led structure, Passage B credits sustained self-directed motivation. A "both passages" answer must be verifiable in BOTH texts, not merely topic-appropriate. If you cannot point to a matching sentence in EACH passage, the choice is wrong, no matter how reasonable it sounds.`, kind: 'common-error' },
    { content: `Order is fixed: Passage-A-alone questions, then Passage-B-alone questions, then comparison questions — never jump ahead.`, kind: 'tip' },
    { content: `For any "both passages" question, the claim must be verifiable in A AND in B — true of just one passage is the single most common trap.`, kind: 'tip' },
    { content: `Before the comparison questions, summarize each passage in one sentence so you are comparing, not re-reading, under time pressure.`, kind: 'tip' },
    { content: `"How would the author of A respond to B" questions: predict using only A's stated position, never outside knowledge.`, kind: 'tip' },
    { content: `The paired set appears **once per Reading test** (usually the Literary Narrative or Social Science slot) and is the same length as a single passage split in two — so each passage is short. Don't budget double time; budget the normal ~10 minutes for the whole set.`, kind: 'tip' },
    { content: `Comparison answers are often written in **general, abstract language** ("the value of sustained effort") while trap answers quote vivid specifics from one passage ("weekly practice checks"). A concrete detail you can point to in only one text is usually the wrong "both" answer.`, kind: 'gotcha' },
    { content: `Watch for the **half-right split**: an answer that describes A correctly in its first half and misdescribes B in its second half. Read both halves of every comparison choice separately and grade each half against its own passage before eliminating.`, kind: 'common-error' },
    { content: `"Both authors would agree" ≠ "neither author denies." Silence is not agreement. If Passage B simply never addresses the claim, the choice is wrong — you need an actual supporting sentence in B, not the absence of a contradiction.`, kind: 'edge-case' },
    { content: `Distinguish "the passages **differ most** on" from "unlike the author of A, the author of B" — the second locks in the direction. If a choice states B's view but labels it as A's, it's the attribution trap even though the content is accurate.`, kind: 'vocab-note' },
    { content: `"The author of Passage A would most likely respond to the final paragraph of Passage B by..." — go read that B paragraph, then answer **in A's voice**. Choices that merely restate B's paragraph, or that concede a point A never concedes, are out.`, kind: 'gotcha' },
    { content: `Two authors can agree on a **fact** and disagree on its **significance** (both note that lessons impose rules early; A calls it scaffolding, B calls it rigidity). Common-ground answers often live at the fact level, departure answers at the interpretation level.`, kind: 'tip' },
    { content: `If a comparison stem gives a line reference with no passage label, check the line number range — Passage B's lines continue the numbering from A. Answering from the wrong passage on a labeled-line question is a pure giveaway of points.`, kind: 'edge-case' },
  ],
};
