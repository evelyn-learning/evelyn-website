/**
 * HS English — Writing Craft: Strong Thesis Statements.
 *
 * The opening skill of the writing unit: a thesis is an ARGUABLE claim plus
 * the reason behind it, narrow enough to prove in the space available. The
 * lesson teaches the fact-vs-claim test and the four recurring failures —
 * fact, announcement, too-broad, laundry list. Every practice item is a
 * revision-choice or diagnose-the-flaw MCQ; no essay writing.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U9_THESIS_STATEMENTS: LessonPlan = {
  id: 'evelyn.hs.engl.thesis-statements.v1',
  title: 'Strong Thesis Statements',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.thesis-statements',
      standard: 'ENGL-9.1',
      description:
        'Evaluate and revise thesis statements so that each one is arguable, specific, and provable in the space available, rejecting statements that are merely facts, announcements, or lists of unrelated points (CCSS W.9-10.1a, W.9-10.2a).',
    },
  ],
  prerequisites: ['engl.poetic-form-and-structure'],
  followUps: ['engl.paragraph-unity-and-support'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a thesis as a promise to the reader — the one sentence that tells people what you are going to prove and why they should keep reading.',
      script:
        'Imagine standing up at a school board meeting to argue that the cafeteria should start composting. You get ninety seconds. Your first sentence decides whether the room leans in or checks the clock. That first sentence is a thesis, and it is a promise: here is what I claim, here is why it is true, and everything after this will back it up. A thesis is not a topic and it is not a summary of what you plan to do. It is the one sentence someone could disagree with. Today we are going to take weak theses apart and rebuild them into promises worth keeping.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arguable-and-provable',
      kind: 'concept',
      goal: 'What makes a thesis arguable, specific, and provable — and the four failures that make one collapse.',
      keyIdeas: [
        'A THESIS = CLAIM + REASON — an arguable position plus the "so what" behind it. WEAK: "The school should start a compost program." STRONG: "The school should start a compost program because it would cut cafeteria waste hauling costs enough to fund the supplies within one year." The reason is the part that gives the rest of the essay something to prove.',
        'THE FACT TEST — ask whether a reasonable person could disagree. If the answer is no, it is a fact, and facts cannot anchor an argument. WEAK (fact): "The cafeteria throws away food every day." STRONG (claim): "The cafeteria should sort food waste at the tray return, because volunteers cannot separate it fast enough after the lunch rush." Facts belong in the body as evidence, never in the thesis chair.',
        'THE ANNOUNCEMENT ERROR — a thesis states the claim; it does not narrate the essay. WRONG: "In this essay I will discuss the reasons a phone policy is needed." CORRECT: "A phone policy that collects devices only during tests would protect focus without treating students as suspects." Delete every "In this essay," "I am going to argue," and "This paper will show" — the sentence underneath is usually the real thesis.',
        'THE TOO-BROAD ERROR — a claim so large that no paper could prove it. WEAK: "School uniforms have shaped education around the world." STRONG: "Requiring uniforms at our school would reduce morning conflicts over dress-code enforcement more than it would reduce bullying." Narrow the subject, the place, and the effect until the claim fits the page count you actually have.',
        'THE LAUNDRY-LIST ERROR — three unrelated points bolted together with commas is a list, not an argument. WEAK: "Uniforms save money, sports build character, and the library needs longer hours." A thesis needs ONE controlling claim; supporting points belong in the body, and they must all serve that single claim.',
        'SPECIFIC AND PROVABLE SCOPE — replace vague evaluators ("good," "bad," "interesting," "important") with the precise effect you can show evidence for. WEAK: "The local history project was a good idea." STRONG: "The local history project taught research skills better than the textbook unit did, because students had to verify conflicting accounts from real archives."',
        'A THESIS SHOULD EVOLVE — the sentence you start with is a working thesis. When the evidence you gather narrows, complicates, or contradicts the claim, revise the thesis to match the evidence. Changing the thesis mid-draft is a sign of honest research, not of failure.',
      ],
      vocabulary: [
        { term: 'arguable claim', definition: 'a statement a reasonable person could disagree with, which is why it needs evidence to support it.' },
        { term: 'working thesis', definition: 'the draft version of a claim, written early and revised as the evidence comes in.' },
        { term: 'scope', definition: 'how much ground a claim covers — the subject, setting, and effect it commits you to proving.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-diagnose-and-upgrade',
      kind: 'worked_example',
      problem:
        'Diagnose and upgrade this thesis for a four-page argument paper: "Our school cafeteria produces a lot of food waste."',
      steps: [
        'Apply the fact test first: could a reasonable person disagree with this sentence? No — anyone who has seen the tray return would agree. It is a fact, so it cannot anchor an argument.',
        'Find the argument hiding behind the fact by asking "so what should happen, and why?" The writer clearly wants a change: the cafeteria should do something about that waste.',
        'Turn the fact into a claim: "Our school cafeteria should compost its food waste." This is now arguable — someone could object on cost or effort grounds. But it still has no reason attached.',
        'Add the "so what" reason, which is what the body paragraphs will prove: "Our school cafeteria should compost its food waste because a bin at the tray return would divert most of it at almost no added labor cost."',
        'Check the scope against four pages. One school, one bin, two provable effects (diversion volume and labor cost) — narrow enough to prove with a waste audit and a custodial time estimate. Do not widen it to districts or to the nation.',
      ],
      answer:
        'STRONG: "Our school cafeteria should compost its food waste because a bin at the tray return would divert most of it at almost no added labor cost." The original was a fact; the upgrade adds an arguable claim plus a provable reason.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-laundry-list-trap',
      kind: 'worked_example',
      problem:
        'A student is told her thesis is "too thin" and tries to fix it by adding more points. Original: "Our school should adopt a phone policy." Revision: "Our school should adopt a phone policy, because phones distract students, because the track team needs new uniforms, and because the library should stay open later." Did the revision improve the thesis?',
      steps: [
        'Notice what the student assumed: that a thesis is thin because it is SHORT, so more points must make it stronger. That assumption is the trap.',
        'Test the three added points for a single controlling claim. Distraction is about phones. Track uniforms and library hours have nothing to do with phones. Three subjects means three different papers.',
        'This is the LAUNDRY-LIST ERROR: the sentence grew longer without growing more arguable. A reader cannot tell what the paper is actually about, so the thesis promises something it cannot deliver.',
        'The real weakness in the original was the missing reason, not the missing length. Fix it by deepening the ONE claim: what would the policy do, and why is that worth doing?',
        'STRONG revision: "Our school should collect phones only during tests, because targeted collection protects the moments when focus matters most without punishing students for the rest of the day." One claim, one reason, provable in a short paper.',
      ],
      answer:
        'No. Piling on unrelated points creates a laundry list, not an argument. STRONG: "Our school should collect phones only during tests, because targeted collection protects the moments when focus matters most without punishing students for the rest of the day."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-strongest-thesis',
      kind: 'try_yourself',
      problem:
        'A ninth grader is writing a three-page argument paper about the school dress code. Which of these is the strongest thesis?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The current dress code was last updated six years ago.' },
        { id: 'b', text: 'In this paper I will explain the problems with the dress code and suggest some changes.' },
        { id: 'c', text: 'The dress code should be rewritten to name specific banned items instead of vague terms like "distracting," because vague rules leave enforcement to individual teachers and produce uneven punishments.', correct: true },
        { id: 'd', text: 'Dress codes have influenced student life throughout history and continue to matter in schools everywhere.' },
      ],
      expectedAnswer:
        'The dress code should be rewritten to name specific banned items instead of vague terms like "distracting," because vague rules leave enforcement to individual teachers and produce uneven punishments.',
      hints: [
        'Run the fact test on each choice: which ones could nobody reasonably disagree with, and which one takes a side?',
        'One choice is a fact, one announces the essay instead of stating a claim, and one is far too broad for three pages. The remaining choice pairs an arguable claim with a reason.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-diagnose-flaw',
      kind: 'try_yourself',
      problem:
        'A student submits this thesis: "In this essay I will look at whether the school should keep its late-bus program." What is the main problem with it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It announces the essay instead of stating a claim, so the reader never learns what position the writer will defend.', correct: true },
        { id: 'b', text: 'It is too short to serve as a thesis statement.' },
        { id: 'c', text: 'It uses the word "school," which is too informal for an argument paper.' },
        { id: 'd', text: 'It covers three unrelated points at once.' },
      ],
      expectedAnswer:
        'It announces the essay instead of stating a claim, so the reader never learns what position the writer will defend.',
      hints: [
        'Look at how the sentence opens. What job is that opening phrase doing?',
        'After reading it, can you say which side the writer is on? A thesis has to commit to a position, not promise to look at one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-revision',
      kind: 'try_yourself',
      problem:
        'A student wrote this WEAK thesis for a four-page paper: "The local history project was a good experience for students." Which revision is strongest?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The local history project should replace the textbook unit, because interviewing residents forced students to check conflicting accounts against town records.', correct: true },
        { id: 'b', text: 'Twenty-eight students took part in the local history project last spring.' },
        { id: 'c', text: 'This paper will describe what students learned during the local history project and why the experience mattered.' },
        { id: 'd', text: 'Hands-on learning has transformed education and continues to shape how students everywhere understand the past.' },
      ],
      expectedAnswer:
        'The local history project should replace the textbook unit, because interviewing residents forced students to check conflicting accounts against town records.',
      hints: [
        'The original fails because "a good experience" is vague. The strongest revision names a specific effect that evidence could prove.',
        'Eliminate the choice that is only a fact, the choice that announces the paper, and the choice too broad to prove in four pages.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-thesis-vs-topic-sentence',
      kind: 'misconception_check',
      question:
        'A student defends the thesis "This essay is about the cafeteria compost program at our school" by saying: "It tells the reader exactly what the paper covers, so it does its job." What went wrong?',
      commonErrors: [
        {
          answer: 'The sentence is fine because it tells the reader what the essay is about.',
          misconception: 'Confusing a thesis with a topic sentence or an announcement — believing that naming the subject is the same as taking a position on it.',
          correctsTo:
            'Naming the subject is not the same as claiming something about it. A topic sentence announces what a paragraph covers; a thesis states an arguable position the whole paper will prove. Apply the disagreement test: nobody can argue with "this essay is about the compost program." STRONG: "Our school should compost cafeteria waste because a tray-return bin would divert most of it at almost no added labor cost." That is a sentence someone could push back on, which is exactly why it needs the essay.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A thesis is an arguable CLAIM plus the REASON behind it — if nobody could disagree, it is a fact, not a thesis.',
        'Delete announcements: "In this essay I will..." is never the thesis; the claim hiding underneath it is.',
        'Reject the too-broad claim and the laundry list — one controlling claim, narrow enough to prove in the pages you have.',
        'Replace vague words like "good" or "important" with the specific effect your evidence can show.',
        'A working thesis is meant to change; revise it when the evidence you gather no longer matches the promise you made.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Strong Thesis Statements' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
