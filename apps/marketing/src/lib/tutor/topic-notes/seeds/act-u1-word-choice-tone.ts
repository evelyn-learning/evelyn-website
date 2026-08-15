/**
 * ACT — Unit 1 CED 1.7: Word Choice & Tone.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.word-choice-tone.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_WORD_CHOICE_TONE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.word-choice-tone.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.7',
  cedTitle: 'Word Choice & Tone',
  planId: 'evelyn.testprep.act.word-choice-tone.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.word-choice-tone.v1' }],
  theory: [
    { loId: 'act.word-choice-tone', content: `REGISTER is the passage's overall formality level. An academic/expository passage (history article, science profile) reads FORMAL: no slang, no filler like "kind of" or "pretty," no casual asides. A memoir or first-person narrative reads CONVERSATIONAL: contractions and everyday phrasing are natural there.` },
    { loId: 'act.word-choice-tone', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — SLANG IN ACADEMIC PROSE: a formal passage drops in something like "honestly pretty huge" or "a big deal." It's grammatically fine but tonally broken. Replace with the register-matched word ("substantial," "significant").` },
    { loId: 'act.word-choice-tone', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — STIFF FORMALITY IN A MEMOIR: a casual, contraction-filled narrative suddenly uses "ascertained" or "utilized" where "checked" or "used" fits the voice. The word isn't ungrammatical — it's the wrong VOICE for that writer.` },
    { loId: 'act.word-choice-tone', content: `PRECISE VS. VAGUE: ACT often pairs a vague, all-purpose word ("good," "a lot," "nice," "big deal") with a precise one that names the exact quality. When both are grammatical, the precise word wins — as long as it still matches the passage's register.` },
    { loId: 'act.word-choice-tone', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — OVERCORRECTING TO "FANCY": ACT sometimes offers a long, impressive-sounding word as a distractor ("determined the veracity of," "made use of"). Longer isn't more precise. "Utilize" doesn't mean anything "use" doesn't already mean — prefer the plain, exact word.` },
    { loId: 'act.word-choice-tone', content: `READ A FULL SENTENCE OF CONTEXT, not just the underlined word. Tone questions are answered by the surrounding sentences. Skim one sentence before and after to lock in the register before choosing.` },
    { loId: 'act.word-choice-tone', content: `CONNOTATION MATTERS: near-synonyms carry different shading ("slender" vs. "skinny" vs. "scrawny"). Match the connotation to how the passage already treats the subject — approving, neutral, or critical.` },
    { loId: 'act.word-choice-tone', kind: 'definition', title: 'register', content: `the level of formality a piece of writing maintains — academic, conversational, technical, etc.` },
    { loId: 'act.word-choice-tone', kind: 'definition', title: 'diction', content: `an author's specific word choices.` },
    { loId: 'act.word-choice-tone', kind: 'definition', title: 'connotation', content: 'the emotional or attitudinal shading a word carries beyond its literal meaning.' },
    { loId: 'act.word-choice-tone', kind: 'definition', title: 'vague modifier', content: `a filler descriptor ("nice," "a lot," "thing") that doesn't specify what quality is meant.` },
  ],
  methods: [
    {
      title: 'Worked slang in academic',
      steps: [
        `Scan one sentence before and after: the passage has been formal throughout — "research," "data," "reef health" — no contractions or casual filler anywhere else.`,
        `"Honestly pretty huge" is CONVERSATIONAL filler ("honestly," "pretty" as an intensifier) — it breaks the passage's register even though it's grammatically fine, so (A) NO CHANGE is out.`,
        `Eliminate options that are also casual or vague: (C) "like, super major" is even more slangy; (D) "not that small, actually" is vague and conversational, plus an awkward double negative.`,
        '(B) "substantial" is precise AND matches the formal register.',
      ],
      example: { problem: `A passage profiles a marine biologist's research on coral reefs, written in a formal, informative tone throughout. One sentence reads: "Her data revealed a change in reef health that was HONESTLY PRETTY HUGE." Which replacement for "HONESTLY PRETTY HUGE" best fits the passage's tone? (A) NO CHANGE (B) substantial (C) like, super major (D) not that small, actually`, solution: '(B) substantial' },
      relatedLoIds: ['act.word-choice-tone'],
    },
    {
      title: 'Worked stiff in memoir',
      steps: [
        `Anchor the register first: this is a memoir, written with contractions and casual phrasing elsewhere ("didn't," "Mom always said"). "Utilized" is stiff, bureaucratic diction that doesn't belong in that voice.`,
        `Eliminate options that keep the stiffness: (A) keeps "utilized"; (B) "made use of" is a wordier synonym, still formal; (D) "employed" is even more formal and carries an unrelated job-related connotation here.`,
        `(C) "used" is the plain, precise verb that matches the memoir's conversational register — no meaning is lost, and it's shorter.`,
        'Precise, register-matched, and concise all point to the same answer.',
      ],
      example: { problem: `A memoir passage narrates the writer's ninth birthday in a warm, conversational voice, full of contractions and casual asides. One sentence reads: "My mom UTILIZED the leftover cake to make french toast the next morning." Which replacement for "UTILIZED" best fits the passage's voice and is the most precise choice? (A) NO CHANGE (B) made use of (C) used (D) employed`, solution: '(C) used' },
      relatedLoIds: ['act.word-choice-tone'],
    },
  ],
  pointers: [
    { content: `Match the word to the PASSAGE's own register, not to a general idea of "sophisticated" writing. A memoir wants plain, warm diction even though a science profile wants formal diction. And even within a formal passage, the most precise plain word usually beats a needlessly long synonym — "utilize" isn't better than "use" just because it's longer.`, kind: 'common-error' },
    { content: `Register = the passage's formality level — check the surrounding sentences before judging an underlined word.`, kind: 'tip' },
    { content: `Slang breaks a formal/academic passage; stiff, Latinate words break a conversational memoir.`, kind: 'tip' },
    { content: `Between grammatically-fine choices, pick the one that's precise, not just longer or fancier.`, kind: 'tip' },
    { content: `NO CHANGE is a legitimate answer when the original word already matches the passage's register.`, kind: 'tip' },
    { content: `Watch the question stem: "most consistent with the tone of the passage" or "most nearly means" are different jobs. Tone stems want register match; "most nearly means" wants the synonym that preserves meaning in context — a tonally pretty word that shifts the meaning still loses.`, kind: 'gotcha' },
    { content: `Three choices that are near-synonyms of each other are usually all wrong — ACT rarely makes three answers correct. If "utilized," "made use of," and "employed" all cluster, the odd one out ("used") is likely the answer.`, kind: 'tip' },
    { content: `A word can match the register perfectly and still be wrong for CONNOTATION. In a passage that admires a scientist's persistence, "stubborn" and "obstinate" are formal enough but critical — "tenacious" or "determined" matches the approving stance.`, kind: 'common-error' },
    { content: `Formal ≠ humorless. Some ACT passages are formal but playful, wry, or enthusiastic. Don't strip out a vivid word just because it isn't dry — match the author's ATTITUDE too, not only their formality level.`, kind: 'edge-case' },
    { content: `In a first-person narrative, the narrator's voice can shift when quoting or characterizing someone else. A memoir may legitimately use a stiff word inside a joke or a quoted official. Check whose voice the sentence is in before calling it a register break.`, kind: 'edge-case' },
    { content: `Vague words hide in nouns and verbs, not just adjectives: "the thing that happened," "did something with the data," "got results." If a choice could describe almost any situation, it's the vague distractor.`, kind: 'common-error' },
    { content: `Don't reject NO CHANGE just because it's short or simple. On word-choice items the original is often the plain, precise, register-matched word, and all three alternatives are upgrades in length only.`, kind: 'gotcha' },
    { content: `Two words with the same dictionary meaning can differ in intensity: "notable," "significant," "monumental." If the passage's data shows a modest shift, the biggest word overstates it. Match the scale the passage's own evidence supports.`, kind: 'vocab-note' },
  ],
};
