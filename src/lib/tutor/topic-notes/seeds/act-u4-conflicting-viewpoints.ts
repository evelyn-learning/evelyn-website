/**
 * ACT — Unit 4 CED 4.5: Conflicting Viewpoints.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.conflicting-viewpoints.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U4_CONFLICTING_VIEWPOINTS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.conflicting-viewpoints.v1',
  course: 'ACT',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Conflicting Viewpoints',
  planId: 'evelyn.testprep.act.conflicting-viewpoints.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.conflicting-viewpoints.v1' }],
  theory: [
    { loId: 'act.conflicting-viewpoints', content: `PASSAGE SHAPE: a short intro names the phenomenon being debated, then 2-3 labeled viewpoints (Scientist 1/2/3, Student A/B, Dr. X/Dr. Y). No tables, no graphs — every fact you need is in the prose.` },
    { loId: 'act.conflicting-viewpoints', content: `TIME BUDGET: this passage appears once per test and runs longer than a data passage — plan on ~6-7 minutes for its ~6-7 questions.` },
    { loId: 'act.conflicting-viewpoints', content: `AS YOU READ, jot a 3-4 word margin note per viewpoint: their CLAIM and their key EVIDENCE — e.g. "Alvarez: selection, cost." This saves re-reading the whole passage per question.` },
    { loId: 'act.conflicting-viewpoints', content: `FIND THE SHARED FACT FIRST. Viewpoints almost always agree on ONE baseline observation (the phenomenon itself, or a basic cause) and diverge on the WHY/mechanism, not the WHAT.` },
    { loId: 'act.conflicting-viewpoints', content: `FIVE QUESTION TYPES: (1) WHAT ONE BELIEVES — direct lookup. (2) AGREEMENT — find the shared baseline. (3) DISAGREEMENT — find the mechanism they split on. (4) RESPONSE/PREDICT — extend one viewpoint's own logic to a new scenario. (5) SUPPORT/UNDERCUT WITH NEW EVIDENCE — pick the finding that moves ONE viewpoint, not all or none.` },
    { loId: 'act.conflicting-viewpoints', kind: 'framework', title: 'Trap', content: `TRAP — EVIDENCE THAT CUTS BOTH WAYS: a finding phrased broadly enough to seem to support every viewpoint is rarely the credited answer; the real answer is specific to ONE viewpoint's stated mechanism.` },
    { loId: 'act.conflicting-viewpoints', kind: 'framework', title: 'Trap', content: `TRAP — OUTSIDE KNOWLEDGE: your own science background can mislead you. Answer from what the NAMED scientist argues in the passage, even if you think a different explanation is more scientifically accurate.` },
    { loId: 'act.conflicting-viewpoints', kind: 'framework', title: 'Trap', content: `TRAP — MIXING UP NAMES: three viewpoints means three chances to attribute the wrong claim to the wrong person. Reread the name in the question before you answer.` },
    { loId: 'act.conflicting-viewpoints', kind: 'definition', title: 'viewpoint', content: `one named scientist's or student's full claim plus the evidence they cite for it.` },
    { loId: 'act.conflicting-viewpoints', kind: 'definition', title: 'point of agreement', content: `a claim or observation every viewpoint accepts — usually the basic phenomenon, not its cause.` },
    { loId: 'act.conflicting-viewpoints', kind: 'definition', title: 'corroborate', content: `to provide evidence that supports (strengthens) a claim; the opposite of undercut or weaken.` },
  ],
  methods: [
    {
      title: 'Worked identify claim',
      steps: [
        `Scan for the scientist's NAME plus their core CLAIM — don't rely on memory of the whole passage.`,
        `Dr. Alvarez's claim: eyes cost energy to build/maintain; fish with reduced eyes conserved that energy, survived and reproduced better.`,
        `That is a direct "selection actively acted against a costly trait" argument — exactly matches the question.`,
        `Check the other two to be sure: Dr. Brennan explicitly argues NO selection pressure either way (drift); Dr. Chen argues the mechanism is a side effect of selection on a DIFFERENT trait. Neither matches "actively selected against for being costly."`,
      ],
      example: { problem: `Passage: a species of cave fish that lives in total darkness has lost functional eyesight over many generations. Dr. Alvarez: eyes are metabolically costly to build and maintain, so fish born with smaller or non-functional eyes conserved energy, survived better, and passed on that trait — natural selection actively favored blindness. Dr. Brennan: in total darkness, eyes provide neither benefit nor cost significant enough to be selected on, so eye-related mutations simply accumulated unchecked over generations — genetic drift, not selection, explains the blindness. Dr. Chen: the same genes that suppress eye development also enhance the lateral-line system that senses water vibration; blindness is a side effect of selection favoring better non-visual senses, not a direct target of selection itself. Question: which scientist attributes the loss of eyesight primarily to eyes being an active metabolic drain that natural selection acted against?`, solution: 'Dr. Alvarez.' },
      relatedLoIds: ['act.conflicting-viewpoints'],
    },
    {
      title: 'Worked evaluate new evidence',
      steps: [
        `Isolate exactly what the finding shows: functioning eyes carry a real energy/oxygen COST, independent of the light environment.`,
        `Dr. Alvarez claims eyes are costly and therefore actively selected against — a measured cost directly supports her.`,
        `Dr. Brennan claims eye loss is NEUTRAL (no real cost or benefit, just drift) — a measured cost contradicts that premise, so this finding undercuts him.`,
        `Dr. Chen's claim is about a linked developmental trade-off, not about eye cost directly — this finding is roughly neutral for Chen, neither strongly supporting nor undercutting her.`,
        `TRAP: don't pick "supports all three" or "supports none" — a specific enough finding moves exactly one viewpoint up and one down, leaving the third largely untouched.`,
      ],
      example: { problem: `Using the same three viewpoints: researchers raise cave-fish embryos engineered to keep functional eyes and compare them to normal blind embryos, both in total darkness. The eyed embryos grow measurably slower and use more oxygen than the blind embryos. Which scientist's hypothesis does this finding support, and which does it undercut?`, solution: 'Supports Dr. Alvarez; undercuts Dr. Brennan; roughly neutral for Dr. Chen.' },
      relatedLoIds: ['act.conflicting-viewpoints'],
    },
  ],
  pointers: [
    { content: `These questions almost always test reading comprehension of the passage, not outside knowledge — some presented hypotheses may even be scientifically shaky on purpose. Support/weaken/response questions want the answer that is INTERNALLY CONSISTENT with a named scientist's own stated claim and evidence, not the one you personally believe is true.`, kind: 'common-error' },
    { content: `Conflicting Viewpoints has zero data to look up — it's the one ACT Science passage type that's pure reading comprehension.`, kind: 'tip' },
    { content: `Track each named viewpoint's CLAIM and EVIDENCE as you read; note the shared point of agreement (usually a basic observation) and where they diverge (usually the WHY).`, kind: 'tip' },
    { content: `Support/weaken/response questions test what's internally consistent with a named viewpoint's OWN claim — not your outside science knowledge.`, kind: 'tip' },
    { content: `Watch the trap: evidence broad enough to seem to support every viewpoint is rarely the credited answer — the real answer moves exactly one viewpoint.`, kind: 'tip' },
    { content: `Wording alert: "is consistent with," "would be most likely to agree," and "would best explain" all mean *extend* a viewpoint's logic — the answer needn't be stated verbatim in the passage. But "states" or "according to Scientist 2" means it IS verbatim. Match the stem to the right mode.`, kind: 'vocab-note' },
    { content: `Half-right, half-wrong attribution is the #1 wrong answer here: the choice states a real fact from the passage but pins it on the wrong scientist. Before bubbling, point at the sentence in the passage that belongs to the NAMED person in the stem.`, kind: 'common-error' },
    { content: `On DISAGREEMENT questions, kill choices that only one viewpoint ever mentions. A genuine disagreement requires BOTH scientists to have taken a stated position on it — silence isn't disagreement.`, kind: 'gotcha' },
    { content: `Answer choices that contain "all," "never," "only," or "completely" usually overstate a viewpoint. Scientists in these passages hedge ("primarily," "may," "largely"); the credited paraphrase hedges too.`, kind: 'tip' },
    { content: `A finding can undercut a viewpoint by contradicting its EVIDENCE rather than its conclusion. If Scientist 1 argues X because eyes are costly, evidence that eyes are cheap weakens her even if the passage never mentions cost elsewhere.`, kind: 'edge-case' },
    { content: `"Neutral for that scientist" is a legitimate credited answer. If a finding doesn't touch a viewpoint's stated mechanism at all, don't force it into support or undercut just because the question lists that name as an option.`, kind: 'edge-case' },
    { content: `Skip the intro paragraph at your peril — the shared baseline for AGREEMENT questions is usually stated THERE, not inside any one viewpoint. Underline the phenomenon sentence in the intro before reading Scientist 1.`, kind: 'tip' },
    { content: `If two viewpoints share the same conclusion, the question is testing the MECHANISM split. Note it as "both say X happened, but A says because of ___, B says because of ___" — that phrasing is what agreement/disagreement stems are built from.`, kind: 'gotcha' },
  ],
};
