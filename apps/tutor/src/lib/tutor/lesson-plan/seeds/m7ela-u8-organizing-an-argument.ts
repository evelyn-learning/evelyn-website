/**
 * Grade 7 ELA — Argument Writing: Organizing an Argument.
 *
 * The last row of Unit 8, so it assembles the parts the earlier rows built:
 * the claim and reasons from 8.1, the evidence and elaboration from 8.2, and
 * the counterclaim and rebuttal from 8.3. The lesson teaches the SHAPE of a
 * whole argument, the ORDER decision (strongest reason last or first, never
 * buried in the middle), transitions that signal the real relationship
 * between the parts (CCSS W.7.1c), and a conclusion that says what follows
 * rather than repeating the claim (CCSS W.7.1e).
 *
 * NOTE FOR FUTURE AUTHORS: every practice item is a revision-choice MCQ —
 * there is no essay prompt and no passage here. All example arguments are at
 * school or neighborhood scale on purpose: no live political controversy, and
 * no invented statistics anywhere in the evidence.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U8_ORGANIZING_AN_ARGUMENT: LessonPlan = {
  id: 'evelyn.ms.m7ela.organizing-an-argument.v1',
  title: 'Organizing an Argument',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.organizing-an-argument',
      standard: 'M7ELA-8.4',
      description:
        'Arrange a whole argument so that the introduction states the claim, each body paragraph carries one reason with its evidence and elaboration, and the counterclaim and rebuttal come before the close; order the reasons on purpose, and use words, phrases and clauses that signal the actual relationship between the parts (CCSS W.7.1c), ending with a conclusion that says what follows from the argument rather than repeating it (CCSS W.7.1e).',
    },
  ],
  prerequisites: ['m7ela.counterclaims'],
  followUps: ['m7ela.informative-thesis-and-structure'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that having good reasons is not the same as arranging them well.',
      script:
        'Say you want the school to put a bike rack by the side door. You have three real reasons. Bikes leaning on the fence block the walkway. A rack would make bikes harder to steal. A row of bikes on the fence looks messy. Now you say all three to the principal in one breath, in the order they popped into your head, and you put the walkway one in the middle. She nods and forgets it. You did not lose because your reasons were weak. You lost because of where you put them. Today we take every part you have built in this unit and set it in an order that makes a reader keep going.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-argument-shape',
      kind: 'concept',
      goal: 'Install the shape of a whole argument, the order decision, relationship-matched transitions, and a conclusion that does more than restate.',
      keyIdeas: [
        'AN ARGUMENT HAS A SHAPE, AND THE SHAPE HAS FOUR SECTIONS. First the introduction, which states the claim so the reader knows your position by the end of the first paragraph. Then one body paragraph for each reason. Then the counterclaim-and-rebuttal paragraph. Then the conclusion. Every piece you built earlier in this unit has one home in that shape, and no piece gets two homes.',
        'ONE REASON PER BODY PARAGRAPH, AND THE SAME THREE MOVES INSIDE EACH ONE. State the reason. Give the evidence for it. Then elaborate, which means explaining how that evidence supports the reason. When a second reason shows up in the middle of a paragraph, that is not a longer paragraph, it is two paragraphs stuck together, and the reader loses track of which reason the evidence belongs to.',
        'ORDER YOUR REASONS ON PURPOSE. Readers remember the first thing and the last thing best, and they skim the middle. So put your strongest reason LAST, where it is the last thing the reader carries away, or FIRST, where it makes the reader take you seriously right away. Never bury the strongest reason in the middle. Rank your reasons before you write by asking which one would move a person who does not agree with you yet.',
        'THE COUNTERCLAIM AND REBUTTAL GO AFTER YOUR REASONS AND BEFORE THE CONCLUSION. Name what the other side says, then answer it. Some writers put this paragraph right after the introduction instead, which also works. What never works is putting it after the conclusion, because that reopens an argument you have already closed.',
        'TRANSITIONS MUST SIGNAL THE REAL RELATIONSHIP. Name the relationship in plain words first, then pick the phrase. ADDITION, for one more reason on the same side: another reason, in addition. CONTRAST, for a turn against what came before: however, on the other hand. CAUSE, for something that happened as a result: because of this, as a result. EMPHASIS, for the point you care about most: most importantly, above all. A transition is a signal, not decoration, so do not paste a phrase on the front of every paragraph out of habit. If the relationship is already obvious, no phrase is better than a wrong one.',
        'A CONCLUSION SAYS WHAT FOLLOWS, NOT WHAT YOU ALREADY SAID. Repeating the claim word for word tells the reader nothing new, and In conclusion, I have shown that is an announcement about your essay rather than an ending to it. A real conclusion answers the so what: what should happen now, who should do it, and what changes if they do. You may echo the claim in fresh words, but the last sentences have to move forward.',
      ],
      vocabulary: [
        { term: 'body paragraph', definition: 'a paragraph that carries one reason, the evidence for it, and the elaboration that ties the evidence to the reason.' },
        { term: 'organization', definition: 'the order the parts of an argument are placed in, chosen on purpose rather than by the order you thought of them.' },
        { term: 'transition', definition: 'a word, phrase or clause that tells the reader what relationship is coming next: addition, contrast, cause or emphasis.' },
        { term: 'conclusion', definition: 'the closing paragraph, which says what follows from the argument instead of repeating the claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-order-the-reasons',
      kind: 'worked_example',
      problem:
        'Malik is arguing that the school should put a bike rack by the side door. He has three reasons. Reason A: bikes leaning on the fence block the side walkway, so people squeeze past them. Reason B: a rack would let riders lock the frame to a metal loop, so bikes would be harder to steal. Reason C: a row of bikes on the fence looks messy from the parking lot. He also has a counterclaim: some students say the school does not need a rack because most people walk. Plan the order of his whole argument.',
      steps: [
        'List the pieces first and give each one a home. The claim goes in the introduction. Reasons A, B and C each get their own body paragraph, and each of those paragraphs holds its reason, its evidence and its elaboration. The counterclaim and the rebuttal share one paragraph. Then the conclusion.',
        'Rank the three reasons by asking which one would move a person who does not agree yet. Reason A is about people getting hurt or crowded, so it is the strongest. Reason B is about losing something you own, so it is next. Reason C is about how things look, so it is the weakest.',
        'Now make the order decision. Strongest LAST means C, then B, then A, so the reader finishes on the walkway. Strongest FIRST would mean A, then C, then B. Both are fine. What is not fine is C, A, B, because that buries the strongest reason in the middle where readers skim. Malik picks strongest last: C, B, A.',
        'Place the counterclaim paragraph after Reason A and before the conclusion. He names it fairly, then rebuts it: most people do walk, and the students who ride are exactly the ones leaning bikes on the fence, so a rack fixes the walkway for everybody who uses it.',
        'Write the conclusion so it does more than repeat. WEAK: "In conclusion, I have shown that the school should add a bike rack by the side door." That is only the claim again with an announcement in front of it. STRONG: "A rack by the side door would clear the walkway and give riders somewhere to lock up, so the student council should put it on the agenda before spring bike-to-school week." That one says what should happen next and who should do it.',
      ],
      answer:
        'Introduction with the claim, then Reason C (looks), then Reason B (theft), then Reason A (blocked walkway, his strongest, placed last), then the counterclaim-and-rebuttal paragraph, then a conclusion that names what should happen next and who should do it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pick-the-signal',
      kind: 'worked_example',
      problem:
        'Malik now needs the opening signal for each paragraph after the introduction. Paragraph 2 carries the messy-look reason. Paragraph 3 carries the theft reason. Paragraph 4 carries the blocked-walkway reason, his strongest. Paragraph 5 is the counterclaim and rebuttal. Which relationship does each opening need?',
      steps: [
        'Say the relationship in plain words before you reach for a phrase. Ask what this paragraph is doing to the one before it: adding, turning against, showing a result, or pushing the biggest point forward.',
        'Paragraph 2 is the first reason after the introduction. Nothing needs to be signaled yet, so no phrase is needed at all. "Bikes on the fence look messy from the parking lot" starts it fine. Bolting on a phrase here would signal a relationship that does not exist.',
        'Paragraph 3 puts a second reason on the same side as the first. That is ADDITION. CORRECT: "Another reason to add a rack is that riders could lock the frame to a metal loop." WRONG: "However, riders could lock the frame to a metal loop." However signals a turn, and paragraph 3 does not turn against paragraph 2, it agrees with it.',
        'Paragraph 4 carries the strongest reason, so the relationship is EMPHASIS. CORRECT: "Most importantly, bikes leaning on the fence block the side walkway." That phrase tells the reader this is the point that matters most, which is exactly why it was placed last.',
        'Paragraph 5 turns to what the other side says, so the relationship is CONTRAST. CORRECT: "Some students say the school does not need a rack, because most people walk. However, the students who do ride are the ones leaning bikes on the fence." The first however-style turn introduces the counterclaim, and the second one starts the rebuttal.',
        'One more relationship shows up INSIDE a paragraph. When a sentence reports a result of the sentence before it, that is CAUSE. CORRECT: "Bikes lean three deep against the fence. Because of this, students walking to the side door step into the driveway to get past." WRONG: "Bikes lean three deep against the fence. Another reason, students walking to the side door step into the driveway." Another reason promises a new reason, and this is a result of the reason already given.',
      ],
      answer:
        'Paragraph 2 needs no signal, paragraph 3 needs addition ("Another reason"), paragraph 4 needs emphasis ("Most importantly"), and paragraph 5 needs contrast ("Some students say... However..."). Inside a paragraph, a result takes a cause signal such as "Because of this."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-belongs-next',
      kind: 'try_yourself',
      problem:
        'Priya is arguing that her neighborhood park needs a water fountain near the basketball court. Her second body paragraph so far reads: "Players have no water once they get to the court. The nearest fountain is back at the parking lot, at the far end of the walking path." Her claim is that the park should install a fountain by the court, and her third reason, saved for last, is about safety on hot afternoons. Which sentence belongs NEXT in this paragraph?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That walk is long enough that players skip it and keep playing thirsty, which is exactly the problem a fountain by the court would end.', correct: true },
        { id: 'b', text: 'Another reason the park needs a fountain is that games get dangerous on hot afternoons.' },
        { id: 'c', text: 'Some neighbors say the park budget is already spent for the year.' },
        { id: 'd', text: 'For all of these reasons, the park should install a fountain by the basketball court.' },
      ],
      expectedAnswer:
        'That walk is long enough that players skip it and keep playing thirsty, which is exactly the problem a fountain by the court would end.',
      hints: [
        'A body paragraph runs reason, then evidence, then elaboration. Priya has given the reason and the evidence. What move is left?',
        'One choice starts a different reason, one is the counterclaim, and one is the conclusion. Each of those has its own home somewhere else in the argument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-transition-relationship',
      kind: 'try_yourself',
      problem:
        'Nadia is arguing for a bike rack. Her second body paragraph explains that bikes left against the fence block the side walkway. Her third body paragraph opens with a blank: "___ a rack would make bikes harder to steal, because riders could lock the frame to a metal loop instead of leaning bikes together." Which opening signals the right relationship?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'However,' },
        { id: 'b', text: 'Another reason is that', correct: true },
        { id: 'c', text: 'Because of this,' },
        { id: 'd', text: 'For example,' },
      ],
      expectedAnswer: 'Another reason is that',
      hints: [
        'Say the relationship in plain words first. Does paragraph three turn against paragraph two, follow from it, give an example of it, or stack one more reason on the same side?',
        'Blocking the walkway did not cause the stealing, and theft is not an example of a blocked walkway. Both paragraphs argue for the same rack.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conclusion-that-moves',
      kind: 'try_yourself',
      problem:
        'Theo argued that his school should keep the library open for half an hour after the last bell. His reasons were that students who ride the late bus have nowhere to wait, that the quiet room is the only place some students can finish homework, and that the library is already staffed until then. Which ending is a real conclusion rather than a repeat?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In conclusion, I have shown that the school should keep the library open for half an hour after the last bell.' },
        { id: 'b', text: 'As I said at the start, students who ride the late bus have nowhere to wait, and the quiet room is the only place some students can finish homework.' },
        { id: 'c', text: 'Half an hour would turn a wasted wait into homework time for the students who need it most, and the staff to make that happen is already in the building, so the principal could try it for one month and see who shows up.', correct: true },
        { id: 'd', text: 'In conclusion, libraries have always been important places, and reading is a habit that helps people everywhere.' },
      ],
      expectedAnswer:
        'Half an hour would turn a wasted wait into homework time for the students who need it most, and the staff to make that happen is already in the building, so the principal could try it for one month and see who shows up.',
      hints: [
        'A conclusion answers the so what. What should happen now, who should do it, and what changes if they do?',
        'One choice announces the essay, one copies the reasons back in the same words, and one wanders off to a new topic the argument never made.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-paragraph-and-late-counterclaim',
      kind: 'misconception_check',
      question:
        'A student turns in an argument written as one long paragraph holding the claim and all three reasons, with the counterclaim and rebuttal added at the very end, after the conclusion. She says it is finished because every part is in there somewhere. What went wrong?',
      commonErrors: [
        {
          answer: 'It is fine as one long paragraph, because all the parts are in there.',
          misconception:
            'Treating an argument as a container for content, so that having every piece somewhere counts as being organized. Paragraph breaks look like decoration rather than structure.',
          correctsTo:
            'Paragraph breaks are the map the reader follows. Give each reason its own body paragraph, and inside that paragraph run the same three moves: reason, then evidence, then elaboration. When three reasons share one paragraph, the reader cannot tell which evidence belongs to which reason, and your strongest reason ends up buried in the middle where people skim. Break it into one paragraph per reason, then decide which reason goes last.',
        },
        {
          answer: 'The counterclaim goes at the very end, after the conclusion.',
          misconception:
            'Thinking of the counterclaim as an extra note tacked on rather than as a part of the argument the reader must see answered.',
          correctsTo:
            'The counterclaim and its rebuttal belong BEFORE the conclusion, usually right after your reasons, and they can also go right after the introduction. Either way the reader has to watch you answer the other side while the argument is still open. Anything placed after the conclusion reopens a case you have already closed, and it leaves the other side with the last word.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The shape: introduction with the claim, one body paragraph per reason, the counterclaim-and-rebuttal paragraph, then the conclusion.',
        'Inside every body paragraph, the same three moves in the same order: reason, evidence, elaboration.',
        'Order the reasons on purpose. Strongest last, or strongest first. Never buried in the middle.',
        'The counterclaim and rebuttal come before the conclusion, never after it.',
        'Match the transition to the real relationship: another reason for addition, however for contrast, because of this for cause, most importantly for emphasis. No phrase at all beats a wrong one.',
        'A conclusion says what follows: what should happen, who should do it, what changes. "In conclusion, I have shown that" is an announcement, not an ending.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Organizing an Argument' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
