/**
 * HS English — Unit 9 CED 9.1: Strong Thesis Statements.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.thesis-statements.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U9_THESIS_STATEMENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.thesis-statements.v1',
  course: 'HS English',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Strong Thesis Statements',
  planId: 'evelyn.hs.engl.thesis-statements.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.thesis-statements.v1' }],
  theory: [
    { loId: 'engl.thesis-statements', content: `A THESIS = CLAIM + REASON — an arguable position plus the "so what" behind it. WEAK: "The school should start a compost program." STRONG: "The school should start a compost program because it would cut cafeteria waste hauling costs enough to fund the supplies within one year." The reason is the part that gives the rest of the essay something to prove.` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'The fact test', content: `THE FACT TEST — ask whether a reasonable person could disagree. If the answer is no, it is a fact, and facts cannot anchor an argument. WEAK (fact): "The cafeteria throws away food every day." STRONG (claim): "The cafeteria should sort food waste at the tray return, because volunteers cannot separate it fast enough after the lunch rush." Facts belong in the body as evidence, never in the thesis chair.` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'The announcement error', content: `THE ANNOUNCEMENT ERROR — a thesis states the claim; it does not narrate the essay. WRONG: "In this essay I will discuss the reasons a phone policy is needed." CORRECT: "A phone policy that collects devices only during tests would protect focus without treating students as suspects." Delete every "In this essay," "I am going to argue," and "This paper will show" — the sentence underneath is usually the real thesis.` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'The too-broad error', content: `THE TOO-BROAD ERROR — a claim so large that no paper could prove it. WEAK: "School uniforms have shaped education around the world." STRONG: "Requiring uniforms at our school would reduce morning conflicts over dress-code enforcement more than it would reduce bullying." Narrow the subject, the place, and the effect until the claim fits the page count you actually have.` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'The laundry-list error', content: `THE LAUNDRY-LIST ERROR — three unrelated points bolted together with commas is a list, not an argument. WEAK: "Uniforms save money, sports build character, and the library needs longer hours." A thesis needs ONE controlling claim; supporting points belong in the body, and they must all serve that single claim.` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'Specific and provable scope', content: `SPECIFIC AND PROVABLE SCOPE — replace vague evaluators ("good," "bad," "interesting," "important") with the precise effect you can show evidence for. WEAK: "The local history project was a good idea." STRONG: "The local history project taught research skills better than the textbook unit did, because students had to verify conflicting accounts from real archives."` },
    { loId: 'engl.thesis-statements', kind: 'framework', title: 'A thesis should evolve', content: `A THESIS SHOULD EVOLVE — the sentence you start with is a working thesis. When the evidence you gather narrows, complicates, or contradicts the claim, revise the thesis to match the evidence. Changing the thesis mid-draft is a sign of honest research, not of failure.` },
    { loId: 'engl.thesis-statements', kind: 'definition', title: 'arguable claim', content: `a statement a reasonable person could disagree with, which is why it needs evidence to support it.` },
    { loId: 'engl.thesis-statements', kind: 'definition', title: 'working thesis', content: `the draft version of a claim, written early and revised as the evidence comes in.` },
    { loId: 'engl.thesis-statements', kind: 'definition', title: 'scope', content: `how much ground a claim covers — the subject, setting, and effect it commits you to proving.` },
  ],
  methods: [
    {
      title: 'Worked diagnose and upgrade',
      steps: [
        `Apply the fact test first: could a reasonable person disagree with this sentence? No — anyone who has seen the tray return would agree. It is a fact, so it cannot anchor an argument.`,
        `Find the argument hiding behind the fact by asking "so what should happen, and why?" The writer clearly wants a change: the cafeteria should do something about that waste.`,
        `Turn the fact into a claim: "Our school cafeteria should compost its food waste." This is now arguable — someone could object on cost or effort grounds. But it still has no reason attached.`,
        `Add the "so what" reason, which is what the body paragraphs will prove: "Our school cafeteria should compost its food waste because a bin at the tray return would divert most of it at almost no added labor cost."`,
        `Check the scope against four pages. One school, one bin, two provable effects (diversion volume and labor cost) — narrow enough to prove with a waste audit and a custodial time estimate. Do not widen it to districts or to the nation.`,
      ],
      example: { problem: `Diagnose and upgrade this thesis for a four-page argument paper: "Our school cafeteria produces a lot of food waste."`, solution: `STRONG: "Our school cafeteria should compost its food waste because a bin at the tray return would divert most of it at almost no added labor cost." The original was a fact; the upgrade adds an arguable claim plus a provable reason.` },
      relatedLoIds: ['engl.thesis-statements'],
    },
    {
      title: 'Worked laundry list trap',
      steps: [
        `Notice what the student assumed: that a thesis is thin because it is SHORT, so more points must make it stronger. That assumption is the trap.`,
        `Test the three added points for a single controlling claim. Distraction is about phones. Track uniforms and library hours have nothing to do with phones. Three subjects means three different papers.`,
        `This is the LAUNDRY-LIST ERROR: the sentence grew longer without growing more arguable. A reader cannot tell what the paper is actually about, so the thesis promises something it cannot deliver.`,
        `The real weakness in the original was the missing reason, not the missing length. Fix it by deepening the ONE claim: what would the policy do, and why is that worth doing?`,
        `STRONG revision: "Our school should collect phones only during tests, because targeted collection protects the moments when focus matters most without punishing students for the rest of the day." One claim, one reason, provable in a short paper.`,
      ],
      example: { problem: `A student is told her thesis is "too thin" and tries to fix it by adding more points. Original: "Our school should adopt a phone policy." Revision: "Our school should adopt a phone policy, because phones distract students, because the track team needs new uniforms, and because the library should stay open later." Did the revision improve the thesis?`, solution: `No. Piling on unrelated points creates a laundry list, not an argument. STRONG: "Our school should collect phones only during tests, because targeted collection protects the moments when focus matters most without punishing students for the rest of the day."` },
      relatedLoIds: ['engl.thesis-statements'],
    },
  ],
  pointers: [
    { content: `Naming the subject is not the same as claiming something about it. A topic sentence announces what a paragraph covers; a thesis states an arguable position the whole paper will prove. Apply the disagreement test: nobody can argue with "this essay is about the compost program." STRONG: "Our school should compost cafeteria waste because a tray-return bin would divert most of it at almost no added labor cost." That is a sentence someone could push back on, which is exactly why it needs the essay.`, kind: 'common-error' },
    { content: `A thesis is an arguable CLAIM plus the REASON behind it — if nobody could disagree, it is a fact, not a thesis.`, kind: 'tip' },
    { content: `Delete announcements: "In this essay I will..." is never the thesis; the claim hiding underneath it is.`, kind: 'tip' },
    { content: `Reject the too-broad claim and the laundry list — one controlling claim, narrow enough to prove in the pages you have.`, kind: 'tip' },
    { content: `Replace vague words like "good" or "important" with the specific effect your evidence can show.`, kind: 'tip' },
    { content: `A working thesis is meant to change; revise it when the evidence you gather no longer matches the promise you made.`, kind: 'tip' },
    { content: `"Because" alone doesn't make a thesis strong. "We should compost because it is good for the environment" has a reason but no provable effect. The reason must name something your evidence can actually show — a cost, a volume, a change in behavior.`, kind: 'common-error' },
    { content: `Longer ≠ stronger. If your thesis feels thin, deepen the ONE claim (what happens, and why does that matter?) instead of bolting on more points with commas. Three subjects in one sentence = three different papers.`, kind: 'gotcha' },
    { content: `Don't confuse a thesis with a topic sentence. A topic sentence names what one paragraph covers; a thesis states a position the whole paper defends. "This essay is about X" names a subject — nobody can disagree with it, so it isn't a thesis.`, kind: 'vocab-note' },
    { content: `Facts aren't banned — they're just in the wrong chair. "The cafeteria throws away food daily" belongs in a body paragraph as evidence. Move it out of the thesis slot rather than deleting it.`, kind: 'edge-case' },
    { content: `Delete the announcement, then look at what's left. "In this essay I will argue that uniforms reduce dress-code conflicts" contains a real thesis — cut the first five words and it's already stronger.`, kind: 'tip' },
    { content: `Flag every "good," "bad," "interesting," "important," and "a lot" in your thesis and replace it with the specific effect you can prove. "A good experience" proves nothing; "taught research skills better than the textbook unit" does.`, kind: 'tip' },
    { content: `Scope is measured against your page count, not in the abstract. A claim about one school and one bin fits four pages; the same claim about "schools around the world" does not. Narrow the subject, the place, AND the effect.`, kind: 'edge-case' },
    { content: `A working thesis is a draft, not a contract. If your evidence complicates or contradicts it mid-paper, revise the thesis — don't bend the evidence to protect a sentence you wrote first.`, kind: 'vocab-note' },
  ],
};
