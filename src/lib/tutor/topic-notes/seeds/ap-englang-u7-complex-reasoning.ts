/**
 * AP English Language & Composition — Unit 7 CED 7.2: Complex Reasoning and
 * Implication.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.complex-reasoning.v1`). Builds on 7.1 (qualification/
 * concession): sophisticated reasoning traces what a claim actually IMPLIES
 * — tensions it creates, angles it opens up, second-order consequences a
 * simpler paragraph would leave unexamined — rather than stopping at the
 * first plausible link (OVERSIMPLIFICATION).
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863). The
 * teaching point is the implication Lincoln draws from the dead's sacrifice
 * — that the LIVING now bear an unfinished obligation. Quotes are limited to
 * short structural phrases already used elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_COMPLEX_REASONING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.complex-reasoning.v1',
  course: 'AP English Language',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Complex Reasoning and Implication',
  planId: 'evelyn.ap.englang.complex-reasoning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.complex-reasoning.v1' }],
  theory: [
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'definition',
      title: 'implication',
      content:
        "What a claim or piece of evidence points to BEYOND its immediate, most obvious meaning — the second-order consequence a reader wouldn't see unless the writer traced it out. Reasoning that stops at the first plausible link, without asking 'and if that's true, what does it mean for X?', is OVERSIMPLIFIED even when every individual sentence is accurate.",
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'definition',
      title: 'tension',
      content:
        "A place where two things a writer's own argument depends on don't sit comfortably together — e.g., honoring the dead's sacrifice ALSO obligates the living to a task the dead can no longer perform themselves. Naming a tension the argument itself creates (not just an opponent's objection) is a hallmark of complex reasoning.",
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'definition',
      title: 'oversimplification',
      content:
        'Reasoning that stops at the first plausible link instead of tracing implications or considering a competing angle. The test: could this reasoning stop one sentence earlier and lose nothing? If the paragraph\'s second half only restates its first half in different words, the reasoning hasn\'t actually gone anywhere.',
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'framework',
      title: 'reasoning from multiple angles',
      content:
        "Testing a claim against more than one lens before settling on an explanation — e.g., a policy's likely effect on the group it targets AND its effect on groups it doesn't mention, or a text's stated purpose AND the purpose implied by its structure. Oversimplification often comes from unconsciously picking one angle and never checking whether a competing angle changes the picture.",
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'strategy',
      title: 'complexity lives in the thinking, not the vocabulary',
      content:
        'Complex reasoning is NOT complicated vocabulary or longer sentences — a short sentence can carry a genuinely complex implication, and a long one can just restate the obvious. The complexity is in the THINKING (what does this imply, where does it strain, what else could be true), not the diction (that\'s the province of 7.4, rhetorical risk and style).',
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'strategy',
      title: 'the reliable move: claim, then implication',
      content:
        "State the claim → ask 'if this is true, what does it further imply, or where does it create tension with something else the argument needs?' → follow that implication out loud, rather than stopping once the first, safest connection has been made.",
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'trap',
      title: 'a true general claim can still be shallow',
      content:
        '"Freedom is important" or "this shows democracy matters" is often technically true but explains almost nothing specific about the passage at hand — a claim so general it could be written about nearly any text on the subject is a sign the reasoning stopped at the first plausible link instead of tracing what THIS text specifically implies.',
    },
    {
      loId: 'apenglang.complex-reasoning',
      kind: 'strategy',
      title: 'Lincoln\'s obligation move',
      content:
        'Lincoln performs exactly this move: the obvious claim is "we should honor the dead." But he reasons a full step further — their sacrifice implies an unfinished OBLIGATION on the LIVING ("It is for us the living, rather, to be dedicated here to the unfinished work") — a genuinely complex move because it turns a moment of commemoration into a demand for future action, which creates its own tension: honoring the past requires acting, not just remembering.',
    },
  ],
  methods: [
    {
      title: 'Trace a claim to its complex implication',
      when_to_use:
        'Use when a first-level, obvious claim about a passage is technically accurate but too general or too shallow — the next step is to trace what that claim further implies.',
      steps: [
        'STATE THE OBVIOUS, FIRST-LEVEL CLAIM — what is the immediate, most surface-level reading of the evidence?',
        "ASK WHAT THAT CLAIM FURTHER IMPLIES — if it's true, what further consequence, obligation, or shift follows from it?",
        "NAME THE TENSION THIS CREATES — where does the argument's own logic pull against itself once the implication is traced?",
        'RESOLVE THE TENSION BY TRACING THE IMPLICATION ONE STEP FURTHER — show how the text itself redirects or resolves the strain it created.',
        'LINK BACK TO WHY THIS IS THE COMPLEX READING — state explicitly why the first-level reading stops one full step short of what the text is reasoning toward.',
      ],
      example: {
        problem:
          "Build one body paragraph that reasons past the obvious claim ('Lincoln honors the soldiers who died') to the complex implication his speech actually draws, tracing the tension it creates for the living audience.",
        solution:
          "The obvious reading of the Gettysburg Address is that Lincoln honors the fallen soldiers; the complex reading is that he uses their sacrifice to place an obligation on the living that the speech itself cannot discharge. Lincoln insists that words cannot consecrate the ground — 'we can not dedicate—we can not consecrate—we can not hallow—this ground' — which creates a real tension: why deliver a speech about the limits of speech-making at all? The implication resolves the tension by redirecting the speech's purpose away from commemorating the dead and toward mobilizing the living, who alone can still act: 'It is for us the living, rather, to be dedicated here to the unfinished work.' Read this way, the speech is not primarily an act of mourning but an act of recruitment disguised as one.",
      },
      relatedLoIds: ['apenglang.complex-reasoning'],
    },
  ],
  pointers: [
    { content: 'Implication is what a claim points to BEYOND its most obvious meaning — stopping at the first plausible link is oversimplified even if accurate.', kind: 'tip' },
    { content: 'A tension is a place an argument\'s own logic pulls against itself — name and resolve it, don\'t just note it.', kind: 'tip' },
    { content: 'Test a claim from more than one angle before settling — oversimplification often comes from silently picking one angle.', kind: 'tip' },
    { content: 'Complexity lives in the THINKING, not the vocabulary — a short sentence can carry a genuinely complex implication.', kind: 'tip' },
    { content: 'Test: could the reasoning stop one sentence earlier and lose nothing? If so, it hasn\'t gone anywhere — it described the claim, not extended it.', kind: 'trap' },
    { content: '"This shows freedom/democracy/liberty is important" is too general to earn credit — it could be written about nearly any text on the subject.', kind: 'trap' },
  ],
};
