/**
 * Digital SAT — Unit 5 CED 5.2: Command of Evidence: Textual.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.textual-evidence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U5_TEXTUAL_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.textual-evidence.v1',
  course: 'Digital SAT',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Command of Evidence: Textual',
  planId: 'evelyn.testprep.dsat.textual-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.textual-evidence.v1' }],
  theory: [
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'The format', content: `THE FORMAT — a short text introduces a work (a story, a memoir, a letter collection, a research study) and states a CLAIM about it. The question asks: "Which quotation from the [work] most effectively illustrates this claim?" Four quotations follow as the choices.` },
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'Step 1', content: `STEP 1 — ISOLATE THE CLAIM. Restate it in your own words before reading any choice. Name the exact, specific idea a quotation must prove — not just the general topic.` },
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'Step 2', content: `STEP 2 — TEST EACH QUOTATION AGAINST THE CLAIM, not against the topic. A quotation can be about the right subject and still fail to prove the claim's specific point.` },
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — ON-TOPIC BUT UNSPECIFIC. The most common wrong choice mentions the same person, event, or idea as the claim but supports a different point, or just describes it.` },
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — BACKGROUND / ATMOSPHERE. Quotations that set a scene, give dates, or list biographical facts feel "textual" but prove nothing about the claim.` },
    { loId: 'dsat.textual-evidence', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — CONTRADICTS OR REVERSES. A quotation can describe the OPPOSITE of the claim's direction (e.g., a public denial offered as evidence when the claim is about a private feeling) — read for direction, not just topic.` },
    { loId: 'dsat.textual-evidence', content: `THE BEST QUOTATION IS CONCRETE. Specific actions, exact repetition ("three nights running"), or a direct contrast are strong evidence; vague summary language is rarely the credited choice.` },
    { loId: 'dsat.textual-evidence', content: `Command of Evidence — Textual is distinct from its Quantitative sibling (data/graph support) and from Central Ideas questions (which ask about the passage's overall point, not proof of one claim).` },
    { loId: 'dsat.textual-evidence', kind: 'definition', title: 'claim', content: 'the specific assertion a quotation must prove — not just a related topic.' },
    { loId: 'dsat.textual-evidence', kind: 'definition', title: 'illustrate', content: 'to serve as a concrete example that directly demonstrates a claim.' },
    { loId: 'dsat.textual-evidence', kind: 'definition', title: 'command of evidence', content: `the reading skill of matching textual (or quantitative) support to a stated claim.` },
  ],
  methods: [
    {
      title: 'Worked fiction',
      steps: [
        `Isolate the claim: trust is earned GRADUALLY, through REPEATED, CONSISTENT honesty — not one big moment.`,
        `(A) describes Odell's general skepticism, not how trust is actually built. On-topic but unspecific — eliminate.`,
        `(C) is scene-setting weather, and (D) is unrelated biographical background — neither touches trust or honesty. Eliminate both.`,
        `(B) shows repetition ("three nights running") and an unwitnessed honest act — exactly the gradual, consistent pattern the claim describes.`,
        `Answer: (B) — it is the only choice that is both specific to honesty AND shows repetition over time.`,
      ],
      example: { problem: `A student is writing about the novel Low Country, in which a lighthouse keeper named Odell grows to trust a shipwrecked stranger only after witnessing repeated small acts of honesty. Claim: the novel suggests Odell's trust is earned gradually through the stranger's consistent honesty, not through any single dramatic event. Which quotation from the novel most effectively illustrates this claim? (A) "Odell had never trusted anyone quickly, and he saw no reason to start now." (B) "Three nights running, the stranger returned exactly the coins he'd been given, down to the last cent, though no one was watching." (C) "The storm rattled the windows, and Odell wondered if the lighthouse would hold." (D) "Odell's father had kept the light for forty years before him."`, solution: '(B)' },
      relatedLoIds: ['dsat.textual-evidence'],
    },
    {
      title: 'Worked scholarly trap',
      steps: [
        `Isolate the claim: language choice tracks the SPECIFIC LISTENER — strategic, not random.`,
        `(A) is a classic Trap 1: on-topic (mentions where children were observed) but says nothing about WHY they chose a given language. Eliminate.`,
        `(C) and (D) are Trap 2: background facts about the study's scope and sample — neither shows strategic listener-matching. Eliminate both.`,
        `(B) directly contrasts two listeners (monolingual grandparent vs. bilingual sibling) and shows the children's language choice changing to match each one — exactly "strategic, listener-suited" behavior.`,
        'Answer: (B).',
      ],
      example: { problem: `A student is writing about a linguistics study of bilingual children's "code-switching" during casual conversation. Claim: the study concludes that children code-switch strategically, choosing the language best suited to the specific listener, rather than mixing languages at random. Which quotation from the study most effectively illustrates this claim? (A) "Bilingual children in the study were observed in both home and school settings." (B) "When speaking with a monolingual grandparent, children used only the grandparent's language, but with a bilingual sibling, they freely mixed both." (C) "Code-switching has been studied in over a dozen language pairs worldwide." (D) "Some children in the study were as young as four years old."`, solution: '(B)' },
      relatedLoIds: ['dsat.textual-evidence'],
    },
  ],
  pointers: [
    { content: `No — the claim is specifically about the CHARACTER becoming more cautious. This quotation is about the village's reaction, not the character's behavior. Command of Evidence questions require the quotation to prove the exact claim, not just share its topic — this is Trap 1, on-topic but unspecific.`, kind: 'common-error' },
    { content: `Isolate the claim in your own words before reading any choice — name the exact point a quotation must prove.`, kind: 'tip' },
    { content: 'Test each quotation against the claim itself, not the general topic.', kind: 'tip' },
    { content: `Watch for the three traps: on-topic-but-unspecific, background/atmosphere, and contradicts-or-reverses the claim's direction.`, kind: 'tip' },
    { content: `The credited quotation is usually concrete and specific — repetition, direct contrast, or a precise action — not vague summary language.`, kind: 'tip' },
    { content: `The claim's grammatical subject is binding. If the claim is about *one character's* behavior, a quotation about the town, the family, or "people" reacting fails — even if it names the same event. Underline WHO the claim is about before scanning choices.`, kind: 'gotcha' },
    { content: `Watch for "despite," "rather than," "not X but Y," and "more than" in the claim — these signal a CONTRAST, and the credited quotation must contain both halves. A quotation showing only Y (or only X) is incomplete.`, kind: 'tip' },
    { content: `"Despite public claims of X, privately Y" claims: the trap choice is the public statement itself. A public denial is evidence of the denial, not of the private feeling. You need the private, unguarded moment — a letter line, a repeated act no one saw.`, kind: 'edge-case' },
    { content: `If the claim says "gradually," "repeatedly," "over time," or "consistently," the answer must show MORE THAN ONE instance — "three nights running," "each spring," "every visit." A single vivid moment, however dramatic, cannot prove a pattern.`, kind: 'common-error' },
    { content: `The blurb above the claim is setup, not the claim. The claim is the sentence that makes an ARGUMENT about the work ("the study concludes...", "the novel suggests..."). Don't match choices to the plot summary in the first sentence.`, kind: 'gotcha' },
    { content: `"Most effectively illustrates" ≠ "is true of the text." All four quotations are real lines from the work; three are true and irrelevant. Never eliminate on the grounds that a choice is false — eliminate on the grounds that it proves nothing about the claim.`, kind: 'vocab-note' },
    { content: `Don't confuse this with Central Ideas questions: here you're not asked what the work is about, only whether a given line PROVES the stated claim. A quotation that beautifully captures the work's overall theme still loses if the claim is narrower.`, kind: 'gotcha' },
    { content: `Numbers, dates, sample sizes, and setting details ("observed in home and school settings," "as young as four") are almost never the answer in a Textual Evidence question — that's Trap 2. Methodology facts describe the study; they don't support its conclusion.`, kind: 'common-error' },
  ],
};
