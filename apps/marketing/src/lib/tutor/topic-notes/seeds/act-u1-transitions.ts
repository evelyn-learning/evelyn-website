/**
 * ACT — Unit 1 CED 1.8: Transitions & Logical Connections.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.transitions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_TRANSITIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.transitions.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.8',
  cedTitle: 'Transitions & Logical Connections',
  planId: 'evelyn.testprep.act.transitions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.transitions.v1' }],
  theory: [
    { loId: 'act.transitions', content: `CLASSIFY FIRST. Read the sentence before and the sentence after the underlined transition and decide the RELATIONSHIP between them — contrast, cause/effect, addition, example, concession, or sequence — before you read a single answer choice.` },
    { loId: 'act.transitions', content: `THEN match the family. Once you know the relationship, pick the choice from that family. "NO CHANGE" is a completely legitimate answer when the existing transition already matches — don't assume a question implies an error.` },
    { loId: 'act.transitions', content: `TRANSITION FAMILIES: ADDITION (moreover, furthermore, in addition, also) — a new supporting point. CONTRAST (however, nevertheless, yet, on the other hand) — the ideas disagree or reverse. CAUSE/EFFECT (therefore, thus, consequently, as a result) — one idea produces the other. CONCESSION (although, granted, admittedly) — acknowledges a point before overriding it. EXAMPLE (for instance, namely, specifically) — illustrates the prior claim. SEQUENCE (meanwhile, subsequently, finally) — orders events in time.` },
    { loId: 'act.transitions', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — WRONG DIRECTION: "however" and "therefore" are the two most common distractors, precisely because they sound formal and connective. If the surrounding sentences actually AGREE or the second CONTINUES from the first, a contrast word reverses the logic; if the second sentence is just a new fact (not a consequence), a cause/effect word overstates the link.` },
    { loId: 'act.transitions', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — PLACEMENT: the ACT also asks where a transition — or a whole transitional sentence — belongs within a paragraph. A transition only works when it sits between the two specific ideas it bridges. If a question proposes moving a sentence, re-classify the relationship at the NEW location; don't reuse your first answer.` },
    { loId: 'act.transitions', content: `PARAGRAPH-LEVEL TRANSITIONS: some questions ask for the best transitional SENTENCE to open or close a paragraph. Check what idea the paragraph before ends on and what the paragraph after begins with — the correct sentence has to bridge both, not just echo one side.` },
    { loId: 'act.transitions', content: `READ WIDE. Always read one sentence before AND one sentence after the underlined portion. Many wrong answers look plausible if you only read the sentence containing the blank.` },
    { loId: 'act.transitions', content: `WATCH FOR EXISTING PATTERNS: if a paragraph already uses a sequence marker (first... second... finally...), an inserted transition must fit that established pattern, not just be logically valid in isolation.` },
    { loId: 'act.transitions', kind: 'definition', title: 'transition', content: `a word, phrase, or sentence that signals the logical relationship between two ideas.` },
    { loId: 'act.transitions', kind: 'definition', title: 'concession', content: `acknowledging a point (often with "although" or "granted") before pivoting to a different claim.` },
    { loId: 'act.transitions', kind: 'definition', title: 'NO CHANGE', content: `the ACT's standard first choice meaning "the underlined portion is already correct" — a real, frequently correct answer.` },
  ],
  methods: [
    {
      title: 'Worked cause effect',
      steps: [
        `Read before and after, ignoring the current word: "cables had corroded badly" (a problem) → "engineers decided to replace the entire system" (a decision).`,
        `Classify BEFORE looking hard at the choices: the decision follows FROM the corrosion — that's a cause/effect relationship.`,
        `Scan the choices for the cause/effect family: (a) "Therefore" is cause/effect. (b) "However" is contrast — wrong family. (c) "For example" introduces an illustration, not a consequence. (d) "Meanwhile" signals simultaneous time, not causation.`,
        `Only (a) matches the classified relationship, and it happens to be the existing word — NO CHANGE is correct here.`,
      ],
      example: { problem: `Passage excerpt: "The bridge's original cables had corroded badly. 'THEREFORE,' engineers decided to replace the entire suspension system rather than repair individual sections." Which choice is best for the underlined transition? (a) NO CHANGE ("Therefore") (b) However (c) For example (d) Meanwhile`, solution: '(a) NO CHANGE — "Therefore" correctly signals cause/effect.' },
      relatedLoIds: ['act.transitions'],
    },
    {
      title: 'Worked wrong family trap',
      steps: [
        `Read sentence 1 (maker spaces expanded) and sentence 2 (teen sign-ups rose 40%), setting aside the underlined word for now.`,
        `Classify: is sentence 2 simply an ADDITIONAL fact sitting alongside sentence 1, or did the sign-up increase happen BECAUSE OF the maker-space expansion? The 40% rise is a consequence, not a separate add-on — that's cause/effect.`,
        `Check the choices against that classification: (a) "Moreover" is addition — plausible-sounding but the wrong family, since it treats the rise as an unrelated extra fact rather than a result. (b) "As a result" is cause/effect — matches. (c) "However" is contrast — the sentences don't disagree. (d) "For example" would need sentence 2 to illustrate sentence 1, not report a separate outcome.`,
        `This is the trap: NO CHANGE looks safe because "Moreover" sounds transitional, but classifying the relationship first shows it names the wrong connection.`,
      ],
      example: { problem: `Passage excerpt: "[1] Local libraries across the district have expanded their maker-space programs, adding 3-D printers and robotics kits. [2] 'MOREOVER,' the number of teen library-card sign-ups has increased by 40 percent since the programs began." Which choice is best for the underlined transition in sentence 2? (a) NO CHANGE ("Moreover") (b) As a result (c) However (d) For example`, solution: `(b) As a result — the sign-up increase is a consequence of the maker-space expansion, not an added fact.` },
      relatedLoIds: ['act.transitions'],
    },
  ],
  pointers: [
    { content: `Classify the relationship between the two ideas first, BEFORE reading the choices, then pick the transition whose family matches: contrast words signal disagreement or reversal, addition words signal a new supporting point, cause/effect words signal one idea producing the other. Swapping families reverses or muddles the sentence's meaning even when the grammar is fine.`, kind: 'common-error' },
    { content: `Classify the logical relationship between the two ideas BEFORE reading the answer choices.`, kind: 'tip' },
    { content: `Match the transition family to that relationship — contrast, cause/effect, addition, example, concession, sequence — never by "sounds right."`, kind: 'tip' },
    { content: `NO CHANGE is a fully legitimate answer whenever the existing transition already matches the relationship.`, kind: 'tip' },
    { content: `Placement questions: a transition only works between the two specific ideas it bridges — re-classify the relationship any time a sentence might move.`, kind: 'tip' },
    { content: `When three of four choices are near-synonyms (e.g., *moreover / in addition / furthermore / however*), the odd one out is usually correct. Four choices can't all be right, so if three share a family, the answer is almost always the lone member of the other family.`, kind: 'tip' },
    { content: `Watch for the DELETE option. ACT transition questions often end with "OMIT the underlined portion" or "DELETE the underlined portion and capitalize the next word." If the two sentences need no signal — the logic is already obvious — deleting is correct, not the smoothest-sounding word.`, kind: 'gotcha' },
    { content: `Don't let a mid-sentence transition fool you. The underline may sit after the subject ("The plan, *however*, failed") or at the end. Same job, same classification — read the full sentence before and after, and check the comma pairing around the interrupter.`, kind: 'edge-case' },
    { content: `"Thus" ≠ "then." "Meanwhile" and "subsequently" order events in TIME; "therefore" and "consequently" claim CAUSATION. If the second sentence just happened next without being produced by the first, sequence wins over cause/effect.`, kind: 'vocab-note' },
    { content: `"In fact" and "indeed" intensify or confirm the prior claim — they are NOT contrast words, even though they often follow a surprising statement. Similarly, "instead" requires a rejected alternative in the previous sentence.`, kind: 'vocab-note' },
    { content: `On "where should this sentence be placed?" items, use the inserted sentence's OWN transition as the clue. "For this reason," "Such changes," or "These volunteers" tell you exactly what must come immediately before it — match the reference, don't just find a topical fit.`, kind: 'tip' },
    { content: `Beware answering from the sentence's tone. A grim sentence following a hopeful one FEELS like contrast, but if the second is caused by the first, cause/effect is correct. Test it literally: can you insert "because of that"? If yes, it's not "however."`, kind: 'common-error' },
    { content: `Paragraph-opening sentence questions are not transition-word questions in disguise. The right answer must name the NEW paragraph's topic while linking back — a choice that only restates the previous paragraph, however smoothly, is wrong.`, kind: 'gotcha' },
  ],
};
