/**
 * HS English — Writing: Introductions & Conclusions.
 *
 * The two paragraphs readers remember and writers rush (CCSS W.9-10.2a,
 * W.9-10.2f): an opening that hooks, bridges, and lands a thesis, and an
 * ending that synthesizes and answers "so what" instead of copying the
 * intro back. Every practice item is a revision-choice MCQ over original,
 * school-plausible openings and closings.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U9_INTRODUCTIONS_AND_CONCLUSIONS: LessonPlan = {
  id: 'evelyn.hs.engl.introductions-and-conclusions.v1',
  title: 'Introductions & Conclusions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.introductions-and-conclusions',
      standard: 'ENGL-9.4',
      description:
        'Evaluate and revise the opening of an essay for a hook that earns attention, context that bridges to the claim, and a clearly placed thesis, and the ending for synthesis, significance, and a call to action, replacing the dictionary-definition opener, the announcement of intent, and the word-for-word restated conclusion (CCSS W.9-10.2a, W.9-10.2f).',
    },
  ],
  prerequisites: ['engl.transitions-and-cohesion'],
  followUps: ['engl.research-questions-and-sources'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame openings and endings as the highest-stakes real estate in any piece of writing — the reader decides to stay in the first lines and remembers the last ones.',
      script:
        'A video has about five seconds to keep a viewer from scrolling past. A job interview turns on the first handshake and the last sentence. Essays work the same way: a reader decides whether to keep reading in your first two lines, and whatever you say in your final two lines is the part that stays with them afterward. Yet these are the exact paragraphs most writers throw away, opening with "Since the dawn of time" and closing by repeating the introduction in slightly different words. Today you learn what each of those paragraphs is actually supposed to do, and how to spot and repair the three openers and one ending that lose readers every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-open-and-close',
      kind: 'concept',
      goal: 'The three jobs of an introduction, the hook types that earn attention, the two jobs of a conclusion, and the named errors at both ends.',
      keyIdeas: [
        'THE INTRO HAS THREE JOBS, IN ORDER — (1) HOOK: earn the next sentence. (2) CONTEXT BRIDGE: give the reader just enough situation to understand the argument, narrowing from the hook toward the claim. (3) THESIS: the specific, arguable claim the essay proves, normally the LAST sentence of the paragraph, where it sits closest to the body that defends it.',
        'HOOKS THAT WORK — a SCENE ("At 3:15 the library lights go off, and twenty students carry their homework out to the bus loop."), a SURPRISING FACT ("Our school schedules seven minutes for lunch lines that average eleven."), or a SHARP QUESTION that the essay actually answers ("Who decided that a student who reads slowly should be graded on speed?"). Each one puts something concrete in the reader\'s head before any abstraction arrives.',
        'TIRED OPENERS TO CUT ON SIGHT — the COSMIC OPENER ("Since the dawn of time, people have argued about education."), the DICTIONARY OPENER ("Webster\'s dictionary defines homework as schoolwork assigned to be done at home."), and the ANNOUNCEMENT ("In this essay I will argue that..."). The first two say nothing about your specific argument; the third describes the essay instead of starting it. Delete the announcement and let the thesis itself be the claim.',
        'THE CONTEXT BRIDGE IS WHERE MOST INTROS BREAK — the hook is vivid, the thesis is sharp, and nothing connects them. One or two sentences of situation ("The 3:15 closing time was set in 2009, when the late bus still ran.") turn a jump into a path.',
        'THE CONCLUSION HAS TWO JOBS — (1) SYNTHESIZE: pull the argument together into one idea, showing how the pieces add up. This is NOT a word-for-word summary; if a sentence in the conclusion could be copied straight from the introduction, it is doing no work. (2) ANSWER "SO WHAT": name why the argument matters beyond this essay — the stakes, the consequence, or the specific action the reader should take.',
        'THE MIRROR TRICK — return to the image, fact, or question from the hook, but one level deeper now that the argument has been made. If the hook showed students carrying homework to the bus loop, the conclusion returns to those students and says what the proposed change would mean for them. The mirror makes an essay feel finished rather than merely stopped.',
        'THE NEW-ARGUMENT ERROR — a conclusion is the wrong place for fresh evidence or an extra reason ("Another reason to keep the library open is that local businesses have offered to donate laptops."). A new claim arrives with no room left to support it, and it reopens the argument at the moment it should close. Move real new evidence into a body paragraph; cut the rest.',
      ],
      vocabulary: [
        { term: 'context bridge', definition: 'the one or two sentences between hook and thesis that supply the situation a reader needs to understand the claim.' },
        { term: 'synthesis', definition: 'pulling an argument\'s parts into a single larger idea in the conclusion — distinct from summary, which merely repeats the parts.' },
        { term: 'the so-what', definition: 'the statement of why the argument matters beyond the page: the stakes, the consequence, or the action the reader should take.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-diagnose-weak-opening',
      kind: 'worked_example',
      problem:
        'Diagnose and upgrade this WEAK opening to an essay arguing that the school should move the first bell from 7:25 to 8:15: "Since the dawn of time, people have needed sleep. Webster\'s dictionary defines sleep as a natural state of rest for the body and mind. In this essay I will explain why our school should start later."',
      steps: [
        'Check job one, the hook. Sentence one is the COSMIC OPENER: "since the dawn of time" could sit atop an essay on any subject, so it earns nothing. Cut it.',
        'Check it again. Sentence two is the DICTIONARY OPENER. The reader already knows what sleep is; a definition of a familiar word delays the argument instead of starting it. Cut it.',
        'Check job three, the thesis. Sentence three is an ANNOUNCEMENT: it describes what the essay will do rather than making the claim. Strip "In this essay I will explain why" and what remains is the actual claim, which can stand on its own.',
        'Notice what is missing entirely: there is no context bridge, and the claim is vague ("start later" — later by how much, and why does it matter?).',
        'Rebuild in the three-job order. HOOK with a scene or a concrete fact: "The first bell rings at 7:25, which means the bus on the north route leaves at 6:40, in the dark." CONTEXT BRIDGE: "That schedule was set in 2009 to fit a shared-bus contract that ended four years ago." THESIS last, specific and arguable: "The school should move the first bell to 8:15, because the current start costs students an hour of sleep for a reason that no longer exists."',
      ],
      answer:
        'STRONG revision: "The first bell rings at 7:25, which means the bus on the north route leaves at 6:40, in the dark. That schedule was set in 2009 to fit a shared-bus contract that ended four years ago. The school should move the first bell to 8:15, because the current start costs students an hour of sleep for a reason that no longer exists." — a concrete hook, a one-sentence context bridge, and an arguable thesis in the final position.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-conclusion-errors',
      kind: 'worked_example',
      problem:
        'An essay argues that the school should replace one study hall a week with a personal-finance workshop. Its opening hook described a senior staring at the deductions on a first paycheck, and its thesis read: "The school should replace one study hall a week with a personal-finance workshop, because students graduate able to solve for x but unable to read a pay stub." Here is the WEAK conclusion: "In conclusion, the school should replace one study hall a week with a personal-finance workshop, because students graduate able to solve for x but unable to read a pay stub. Another reason this would work is that two local credit unions have already offered to send volunteers to teach the sessions." Diagnose both errors and repair the paragraph.',
      steps: [
        'Compare sentence one against the thesis. It is a WORD-FOR-WORD RESTATEMENT: the same claim in the same order, with "In conclusion" attached. A reader who has just finished the body learns nothing from it, so the sentence occupies the most memorable spot in the essay while doing no work.',
        'Read sentence two. It opens with "Another reason", which means a NEW ARGUMENT has been introduced in the closing paragraph. The volunteer offer is genuine evidence, but there is no room left to develop it, and raising it here reopens the case at the moment it should close. Move that detail into a body paragraph.',
        'Apply job one, SYNTHESIS. Do not list the reasons again; state what they add up to. The reasons were a skills gap and a schedule that already has slack in it, and together they say the change is small while the gap is large.',
        'Apply job two, the SO-WHAT, and use the MIRROR TRICK. The hook showed a senior reading a first pay stub. Return to that student now that the argument has been made, and name the stakes or the action.',
      ],
      answer:
        'STRONG revision: "One hour a week is the smallest change the schedule can absorb, and the gap it closes is one every graduate meets within months of leaving. That senior staring at the deductions on a first paycheck should not have to guess what they mean. The school board reviews the bell schedule in April, and one study hall is all it needs to move." — synthesis, then significance, then a mirror of the opening image and a concrete action, with no new evidence and no restated thesis.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-strongest-hook',
      kind: 'try_yourself',
      problem:
        'An essay will argue that the school library should stay open until 6 p.m. instead of closing at 3:15. Which opening sentence best draws the reader in?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Since the dawn of time, human beings have needed quiet places in which to study and learn.' },
        { id: 'b', text: 'Webster\'s dictionary defines a library as a building or room containing a collection of books.' },
        { id: 'c', text: 'At 3:15 the library lights go off, and twenty students carry their homework out to the bus loop, where there is no table, no quiet, and no internet.', correct: true },
        { id: 'd', text: 'In this essay I will argue that the school library should stay open until 6 p.m. instead of closing at 3:15.' },
      ],
      expectedAnswer:
        'At 3:15 the library lights go off, and twenty students carry their homework out to the bus loop, where there is no table, no quiet, and no internet.',
      hints: [
        'Three of these could open an essay on almost any topic, or simply announce what the essay plans to do. Which one puts a specific, concrete picture in the reader\'s head?',
        'Rule out the cosmic opener, the dictionary opener, and the announcement. What remains is a scene tied to this exact argument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-diagnose-opening-flaw',
      kind: 'try_yourself',
      problem:
        'Here is the full opening paragraph of an essay arguing that ninth graders should be allowed to choose their own novels for one unit each year: "Reading is very important and has been important for a long time. Books can be found in many places, such as libraries, classrooms, and homes. This paper is going to talk about student choice in reading." What is the paragraph\'s biggest problem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It never makes a claim — it announces the topic instead of stating an arguable thesis, and the sentences before it are too general to hook anyone.', correct: true },
        { id: 'b', text: 'It places the thesis in the last sentence, when the thesis belongs in the first sentence of the introduction.' },
        { id: 'c', text: 'It gives too much specific evidence too early, leaving nothing for the body paragraphs.' },
        { id: 'd', text: 'It is written in the third person, and an essay about student choice should be written in the first person.' },
      ],
      expectedAnswer:
        'It never makes a claim — it announces the topic instead of stating an arguable thesis, and the sentences before it are too general to hook anyone.',
      hints: [
        'Run the three jobs in order: is there a hook, a context bridge, and a thesis? Ask specifically whether the last sentence states something a reader could disagree with.',
        '"This paper is going to talk about student choice" names a subject, not a claim. That is the announcement error, and nothing in the first two sentences is concrete enough to rescue it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-conclusion-move',
      kind: 'try_yourself',
      problem:
        'An essay has argued that the school should add a covered bike rack near the gym entrance. Its hook described a row of bikes rusting in the rain beside the fence, and its body paragraphs covered cost, ridership, and safety. The final body paragraph has just ended. Which sentence is the strongest way to begin the conclusion?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In conclusion, as stated in the introduction, the school should add a covered bike rack near the gym entrance.' },
        { id: 'b', text: 'Those bikes rusting against the fence are the cheapest problem this school has, and the only one it has decided to leave outside.', correct: true },
        { id: 'c', text: 'Another strong reason for the rack is that the county offers a grant covering half the cost of new bike infrastructure.' },
        { id: 'd', text: 'Since the dawn of time, people have needed safe places to store the things they depend on.' },
      ],
      expectedAnswer:
        'Those bikes rusting against the fence are the cheapest problem this school has, and the only one it has decided to leave outside.',
      hints: [
        'A conclusion synthesizes and then answers "so what". Which choice does work the introduction has not already done?',
        'Eliminate the verbatim restatement, the brand-new grant argument, and the cliche. The remaining choice mirrors the opening image and states what the whole argument adds up to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-copy-paste-conclusion',
      kind: 'misconception_check',
      question:
        'A student writes a conclusion by pasting the introduction into the last paragraph and swapping a few words, and defends it: "A conclusion is supposed to restate the thesis and summarize the essay, so repeating the introduction is exactly what the format asks for." What went wrong?',
      commonErrors: [
        {
          answer: 'The conclusion should repeat the introduction so the reader remembers the thesis',
          misconception: 'Treating a conclusion as a copy-paste summary, so the final paragraph carries information the reader received five minutes ago.',
          correctsTo:
            'Restating is not synthesizing. The reader has just finished the argument, so repeating it teaches nothing. A conclusion pulls the reasons into one larger idea the essay has now earned, then answers "so what" — the stakes, the consequence, or the action. A useful test: if a sentence in the conclusion could be lifted straight out of the introduction, cut it and write what the argument has proved instead.',
        },
        {
          answer: 'If repeating is bad, the conclusion should add a fresh reason instead',
          misconception: 'Overcorrecting from summary into the new-argument error, introducing a claim with no space left to support it.',
          correctsTo:
            'New evidence belongs in a body paragraph where it can be developed. The conclusion closes the case: synthesize, state the significance, and mirror the opening image one level deeper.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An introduction does three jobs in order: hook, context bridge, then thesis as the last sentence.',
        'Hooks that earn attention are scenes, surprising facts, or sharp questions the essay answers. Cut the cosmic opener, the dictionary opener, and the announcement of intent.',
        'A conclusion synthesizes rather than summarizes, then answers "so what" — stakes, consequence, or a specific action.',
        'Use the mirror trick: return to the hook one level deeper. Never open a new argument in the final paragraph, and never paste the introduction back in.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Introductions & Conclusions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
