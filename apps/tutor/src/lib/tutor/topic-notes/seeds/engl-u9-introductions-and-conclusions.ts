/**
 * HS English — Unit 9 CED 9.4: Introductions & Conclusions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.introductions-and-conclusions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U9_INTRODUCTIONS_AND_CONCLUSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.introductions-and-conclusions.v1',
  course: 'HS English',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Introductions & Conclusions',
  planId: 'evelyn.hs.engl.introductions-and-conclusions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.introductions-and-conclusions.v1' }],
  theory: [
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'The intro has three jobs, in order', content: `THE INTRO HAS THREE JOBS, IN ORDER — (1) HOOK: earn the next sentence. (2) CONTEXT BRIDGE: give the reader just enough situation to understand the argument, narrowing from the hook toward the claim. (3) THESIS: the specific, arguable claim the essay proves, normally the LAST sentence of the paragraph, where it sits closest to the body that defends it.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'Hooks that work', content: `HOOKS THAT WORK — a SCENE ("At 3:15 the library lights go off, and twenty students carry their homework out to the bus loop."), a SURPRISING FACT ("Our school schedules seven minutes for lunch lines that average eleven."), or a SHARP QUESTION that the essay actually answers ("Who decided that a student who reads slowly should be graded on speed?"). Each one puts something concrete in the reader's head before any abstraction arrives.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'Tired openers to cut on sight', content: `TIRED OPENERS TO CUT ON SIGHT — the COSMIC OPENER ("Since the dawn of time, people have argued about education."), the DICTIONARY OPENER ("Webster's dictionary defines homework as schoolwork assigned to be done at home."), and the ANNOUNCEMENT ("In this essay I will argue that..."). The first two say nothing about your specific argument; the third describes the essay instead of starting it. Delete the announcement and let the thesis itself be the claim.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'The context bridge is where most intros break', content: `THE CONTEXT BRIDGE IS WHERE MOST INTROS BREAK — the hook is vivid, the thesis is sharp, and nothing connects them. One or two sentences of situation ("The 3:15 closing time was set in 2009, when the late bus still ran.") turn a jump into a path.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'The conclusion has two jobs', content: `THE CONCLUSION HAS TWO JOBS — (1) SYNTHESIZE: pull the argument together into one idea, showing how the pieces add up. This is NOT a word-for-word summary; if a sentence in the conclusion could be copied straight from the introduction, it is doing no work. (2) ANSWER "SO WHAT": name why the argument matters beyond this essay — the stakes, the consequence, or the specific action the reader should take.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'The mirror trick', content: `THE MIRROR TRICK — return to the image, fact, or question from the hook, but one level deeper now that the argument has been made. If the hook showed students carrying homework to the bus loop, the conclusion returns to those students and says what the proposed change would mean for them. The mirror makes an essay feel finished rather than merely stopped.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'framework', title: 'The new-argument error', content: `THE NEW-ARGUMENT ERROR — a conclusion is the wrong place for fresh evidence or an extra reason ("Another reason to keep the library open is that local businesses have offered to donate laptops."). A new claim arrives with no room left to support it, and it reopens the argument at the moment it should close. Move real new evidence into a body paragraph; cut the rest.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'definition', title: 'context bridge', content: `the one or two sentences between hook and thesis that supply the situation a reader needs to understand the claim.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'definition', title: 'synthesis', content: `pulling an argument's parts into a single larger idea in the conclusion — distinct from summary, which merely repeats the parts.` },
    { loId: 'engl.introductions-and-conclusions', kind: 'definition', title: 'the so-what', content: `the statement of why the argument matters beyond the page: the stakes, the consequence, or the action the reader should take.` },
  ],
  methods: [
    {
      title: 'Worked diagnose weak opening',
      steps: [
        `Check job one, the hook. Sentence one is the COSMIC OPENER: "since the dawn of time" could sit atop an essay on any subject, so it earns nothing. Cut it.`,
        `Check it again. Sentence two is the DICTIONARY OPENER. The reader already knows what sleep is; a definition of a familiar word delays the argument instead of starting it. Cut it.`,
        `Check job three, the thesis. Sentence three is an ANNOUNCEMENT: it describes what the essay will do rather than making the claim. Strip "In this essay I will explain why" and what remains is the actual claim, which can stand on its own.`,
        `Notice what is missing entirely: there is no context bridge, and the claim is vague ("start later" — later by how much, and why does it matter?).`,
        `Rebuild in the three-job order. HOOK with a scene or a concrete fact: "The first bell rings at 7:25, which means the bus on the north route leaves at 6:40, in the dark." CONTEXT BRIDGE: "That schedule was set in 2009 to fit a shared-bus contract that ended four years ago." THESIS last, specific and arguable: "The school should move the first bell to 8:15, because the current start costs students an hour of sleep for a reason that no longer exists."`,
      ],
      example: { problem: `Diagnose and upgrade this WEAK opening to an essay arguing that the school should move the first bell from 7:25 to 8:15: "Since the dawn of time, people have needed sleep. Webster's dictionary defines sleep as a natural state of rest for the body and mind. In this essay I will explain why our school should start later."`, solution: `STRONG revision: "The first bell rings at 7:25, which means the bus on the north route leaves at 6:40, in the dark. That schedule was set in 2009 to fit a shared-bus contract that ended four years ago. The school should move the first bell to 8:15, because the current start costs students an hour of sleep for a reason that no longer exists." — a concrete hook, a one-sentence context bridge, and an arguable thesis in the final position.` },
      relatedLoIds: ['engl.introductions-and-conclusions'],
    },
    {
      title: 'Worked conclusion errors',
      steps: [
        `Compare sentence one against the thesis. It is a WORD-FOR-WORD RESTATEMENT: the same claim in the same order, with "In conclusion" attached. A reader who has just finished the body learns nothing from it, so the sentence occupies the most memorable spot in the essay while doing no work.`,
        `Read sentence two. It opens with "Another reason", which means a NEW ARGUMENT has been introduced in the closing paragraph. The volunteer offer is genuine evidence, but there is no room left to develop it, and raising it here reopens the case at the moment it should close. Move that detail into a body paragraph.`,
        `Apply job one, SYNTHESIS. Do not list the reasons again; state what they add up to. The reasons were a skills gap and a schedule that already has slack in it, and together they say the change is small while the gap is large.`,
        `Apply job two, the SO-WHAT, and use the MIRROR TRICK. The hook showed a senior reading a first pay stub. Return to that student now that the argument has been made, and name the stakes or the action.`,
      ],
      example: { problem: `An essay argues that the school should replace one study hall a week with a personal-finance workshop. Its opening hook described a senior staring at the deductions on a first paycheck, and its thesis read: "The school should replace one study hall a week with a personal-finance workshop, because students graduate able to solve for x but unable to read a pay stub." Here is the WEAK conclusion: "In conclusion, the school should replace one study hall a week with a personal-finance workshop, because students graduate able to solve for x but unable to read a pay stub. Another reason this would work is that two local credit unions have already offered to send volunteers to teach the sessions." Diagnose both errors and repair the paragraph.`, solution: `STRONG revision: "One hour a week is the smallest change the schedule can absorb, and the gap it closes is one every graduate meets within months of leaving. That senior staring at the deductions on a first paycheck should not have to guess what they mean. The school board reviews the bell schedule in April, and one study hall is all it needs to move." — synthesis, then significance, then a mirror of the opening image and a concrete action, with no new evidence and no restated thesis.` },
      relatedLoIds: ['engl.introductions-and-conclusions'],
    },
  ],
  pointers: [
    { content: `Restating is not synthesizing. The reader has just finished the argument, so repeating it teaches nothing. A conclusion pulls the reasons into one larger idea the essay has now earned, then answers "so what" — the stakes, the consequence, or the action. A useful test: if a sentence in the conclusion could be lifted straight out of the introduction, cut it and write what the argument has proved instead.`, kind: 'common-error' },
    { content: `New evidence belongs in a body paragraph where it can be developed. The conclusion closes the case: synthesize, state the significance, and mirror the opening image one level deeper.`, kind: 'common-error' },
    { content: `An introduction does three jobs in order: hook, context bridge, then thesis as the last sentence.`, kind: 'tip' },
    { content: `Hooks that earn attention are scenes, surprising facts, or sharp questions the essay answers. Cut the cosmic opener, the dictionary opener, and the announcement of intent.`, kind: 'tip' },
    { content: `A conclusion synthesizes rather than summarizes, then answers "so what" — stakes, consequence, or a specific action.`, kind: 'tip' },
    { content: `Use the mirror trick: return to the hook one level deeper. Never open a new argument in the final paragraph, and never paste the introduction back in.`, kind: 'tip' },
    { content: `"Restate the thesis" does not mean retype it. If a sentence in your conclusion could be lifted word-for-word from your intro, cut it and write what the argument has now *proved* instead.`, kind: 'common-error' },
    { content: `Don't confuse **synthesis** with **summary**. Summary re-lists your reasons; synthesis says what they add up to as one idea. "Cost, ridership, and safety all favor the rack" is a list — "it's the cheapest problem the school has" is synthesis.`, kind: 'vocab-note' },
    { content: `Strip "In this essay I will argue that..." and read what's left. That remainder IS your thesis — usually already arguable. Announcing the essay is not the same as making the claim.`, kind: 'tip' },
    { content: `A vivid hook plus a sharp thesis can still fail: check that the **context bridge** exists. One or two sentences of situation (who set this, when, why it no longer fits) turn a jump into a path.`, kind: 'gotcha' },
    { content: `Spotting real new evidence in your conclusion doesn't mean deleting it — move it into a body paragraph where it can be developed. Only cut it if it was never worth supporting.`, kind: 'edge-case' },
    { content: `A question hook only works if your essay actually answers it. "Have you ever wondered about school lunch?" is not a hook; "Who decided a slow reader should be graded on speed?" is — and the essay must deliver that answer.`, kind: 'edge-case' },
    { content: `The mirror trick means returning to your hook **one level deeper**, not repeating it. If the hook showed rusting bikes, don't just mention bikes again — say what the change would mean for them.`, kind: 'gotcha' },
    { content: `Put the thesis in the LAST sentence of the intro, not the first. It sits closest to the body that defends it — a thesis stranded in sentence one leaves the rest of the paragraph drifting backward.`, kind: 'common-error' },
  ],
};
