/**
 * ACT — Reading: Comparing Paired Passages.
 *
 * One passage slot on ACT Reading isn't a single passage — it's two
 * shorter passages, Passage A and Passage B, on a related topic. The
 * questions come in a fixed order: A-alone questions, then B-alone
 * questions, then comparison questions about both together. At ~52
 * seconds per question there's no time to re-read both passages from
 * scratch for every comparison item, so the skill is tracking each
 * passage's position and catching "both passages" answers that are
 * secretly true of only one. All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_PAIRED_PASSAGES: LessonPlan = {
  id: 'evelyn.testprep.act.paired-passages.v1',
  title: 'Comparing Paired Passages',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.paired-passages',
      standard: 'ACT-3.5',
      description:
        'Answer Passage-A-alone, Passage-B-alone, and both-passages comparison questions in the correct order, and verify that any "both passages" claim is actually supported by each passage individually before selecting it.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe the paired-passage set as an order-and-verification problem, not extra reading — set realistic pacing expectations.',
      script:
        'On ACT Reading, one passage slot is actually two shorter passages — Passage A and Passage B — on a related topic. The questions always come in the same order: a few about A alone, then a few about B alone, then a set of comparison questions about both together. That last group is where students lose points — not because the questions are hard, but because they pick an answer that sounds right for the topic without checking it against BOTH texts. At about 52 seconds a question, you cannot re-read everything from scratch, so today we build a fast, reliable way to compare.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-paired-passage-method',
      kind: 'concept',
      goal: 'The fixed question order, the one-sentence-summary habit, and the traps that specifically target "both passages" answers.',
      keyIdeas: [
        'ORDER IS FIXED: A-alone questions come first, then B-alone questions, then comparison questions — always in that order, matching passage order. Do not jump ahead to comparison questions early.',
        'BEFORE the comparison questions, form ONE sentence per passage on the shared topic: "A says ___. B says ___." That sentence is what you compare against, so you are not re-reading both passages under time pressure.',
        'THE "BOTH PASSAGES" TRAP: a stem like "Both passages agree that..." or "Both authors would agree..." is only correct if the claim is verifiable in A AND in B. A claim that is well-supported by only one passage — however true it sounds — is wrong.',
        'AGREEMENT vs. DEPARTURE: some comparison questions ask for common ground ("both would agree..."); others ask where the passages diverge ("the passages differ most on..."). Read the stem before scanning — they require opposite answers.',
        '"HOW WOULD THE AUTHOR OF A RESPOND TO B" questions: predict the response using ONLY Passage A\'s stated position and values. Do not import outside knowledge about the topic, and do not borrow reasoning from Passage B.',
        'ATTRIBUTION TRAP: an answer choice can flip which passage said what — assigning A\'s claim to B, or vice versa. Always check the passage number before matching an answer to a claim.',
        'LINE/PARAGRAPH REFERENCES still point at ONE passage at a time, even inside the comparison block. Confirm which passage the reference belongs to before answering.',
      ],
      vocabulary: [
        { term: 'common ground', definition: 'a claim or attitude that both passages actually support, not just a claim that fits the shared topic.' },
        { term: 'point of departure', definition: 'the specific place where the two passages\' positions diverge.' },
        { term: 'attribution trap', definition: 'an answer choice that assigns one author\'s claim or attitude to the other author.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-common-ground',
      kind: 'worked_example',
      problem:
        'Passage A: "Structured lessons remain the most reliable path to musical fluency. A trained teacher corrects posture and technique before bad habits calcify, sequences repertoire from simple to complex, and provides accountability through weekly practice checks. Students who study privately for even two years typically read notation fluently and can transpose on request — skills that self-taught musicians often lack. Without this scaffolding, most beginners plateau within months, frustrated by errors they cannot diagnose themselves." Passage B: "Some of the most inventive musicians in history never took a formal lesson. Learning by ear — imitating recordings, experimenting until a passage sounds right — builds an instinct for rhythm and phrasing that classroom drills rarely teach. Self-directed learners choose songs that excite them, so practice feels like play rather than obligation, and that sustained motivation matters more over ten years than a flawless first two. Rules learned too early can even calcify into rigidity." Question: Based on both passages, the two authors would most likely agree that becoming skilled at music requires:',
      steps: [
        'This is a comparison question ("based on both passages") — the answer must hold for A AND B, not just one.',
        'One-sentence summary: A says formal lessons with teacher feedback build skill; B says imitation and self-directed practice build skill.',
        'The methods are opposite (teacher-led vs. self-directed), so "agree" has to be about something ABOVE the method, not a technique specific to either side.',
        'A mentions studying "for even two years"; B mentions motivation mattering "over ten years." Both frame skill as something built through sustained time investment, not acquired instantly.',
        'Sustained practice over time is the one claim both passages actually make — that is the common ground, regardless of which method either author prefers.',
      ],
      answer: 'Sustained practice over an extended period of time, regardless of method.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-attribution-trap',
      kind: 'worked_example',
      problem:
        'Using the same Passage A and Passage B, a question asks you to evaluate this choice: "Both authors would agree that working with a formal teacher is the fastest way to avoid frustration."',
      steps: [
        'Check each passage separately before accepting a "both" claim.',
        'Passage A does support this: it says beginners without a teacher get "frustrated by errors they cannot diagnose themselves."',
        'Passage B never claims a teacher reduces frustration. It argues self-teaching keeps practice feeling "like play rather than obligation," and it warns that lessons learned too early can "calcify into rigidity."',
        'The claim is supported by Passage A alone, not by Passage B — this is the classic paired-passage trap: a statement true of one passage, dressed up as a "both passages" answer.',
        'Correct move: reject this choice and look for a claim you can point to in EACH passage individually.',
      ],
      answer: 'The claim is a trap — it is true of Passage A only, so it cannot be the answer to a "both passages" question.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-passage-a-detail',
      kind: 'try_yourself',
      problem:
        'Passage A: "Structured lessons remain the most reliable path to musical fluency. A trained teacher corrects posture and technique before bad habits calcify, sequences repertoire from simple to complex, and provides accountability through weekly practice checks. Students who study privately for even two years typically read notation fluently and can transpose on request — skills that self-taught musicians often lack. Without this scaffolding, most beginners plateau within months, frustrated by errors they cannot diagnose themselves." According to Passage A alone, a teacher\'s main role is to:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'perform difficult repertoire for the student to imitate' },
        { id: 'b', text: 'correct technique early and sequence practice, preventing bad habits', correct: true },
        { id: 'c', text: 'guarantee that a student will become a professional musician' },
        { id: 'd', text: 'teach students to compose original music' },
      ],
      expectedAnswer: 'correct technique early and sequence practice, preventing bad habits',
      hints: [
        'This is an A-alone question — answer from Passage A only, ignore Passage B for now.',
        'Look at the two actions the passage names for the teacher: correcting posture/technique and sequencing repertoire "before bad habits calcify."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-passage-b-inference',
      kind: 'try_yourself',
      problem:
        'Passage B: "Some of the most inventive musicians in history never took a formal lesson. Learning by ear — imitating recordings, experimenting until a passage sounds right — builds an instinct for rhythm and phrasing that classroom drills rarely teach. Self-directed learners choose songs that excite them, so practice feels like play rather than obligation, and that sustained motivation matters more over ten years than a flawless first two. Rules learned too early can even calcify into rigidity." Passage B most strongly suggests that formal lessons could hurt a beginner by:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'making early practice feel like play instead of work' },
        { id: 'b', text: 'imposing rules too early, before instinct develops, causing rigidity', correct: true },
        { id: 'c', text: 'teaching too much music notation too quickly' },
        { id: 'd', text: 'focusing exclusively on rhythm instruction' },
      ],
      expectedAnswer: 'imposing rules too early, before instinct develops, causing rigidity',
      hints: [
        'This is a B-alone question — the answer must come from Passage B\'s own wording, not from Passage A.',
        'The passage\'s last sentence names the exact risk: "rules learned too early can even calcify into rigidity."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-comparison-departure',
      kind: 'try_yourself',
      problem:
        'Using both Passage A and Passage B: A argues a teacher prevents beginners from plateauing through structured correction; B argues self-teaching sustains motivation and avoids rigid, too-early rules. Which choice correctly identifies where the two passages differ most sharply?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A values sequenced, teacher-guided correction; B values instinct-driven, self-directed practice', correct: true },
        { id: 'b', text: 'A and B both argue that students should never learn to read music notation' },
        { id: 'c', text: 'A and B both dismiss the value of practicing consistently' },
        { id: 'd', text: 'A argues music should be learned only by ear, the same as B' },
      ],
      expectedAnswer: 'A values sequenced, teacher-guided correction; B values instinct-driven, self-directed practice',
      hints: [
        'A "differs most" question needs the ONE point where the passages actually disagree, not something both would deny.',
        'A centers on teacher-led structure; B centers on self-directed instinct — that contrast is the point of departure.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-plausible',
      kind: 'misconception_check',
      question:
        'A student sees the answer choice "Both passages argue that natural talent matters more than practice" and picks it because "talent" sounds like something both music passages could plausibly mention. What went wrong?',
      commonErrors: [
        {
          answer: 'Picking the choice because it sounds plausible for the general topic',
          misconception: 'Treating "sounds like something both passages could say" as equivalent to "both passages actually say this."',
          correctsTo:
            'Neither passage mentions talent at all — Passage A credits teacher-led structure, Passage B credits sustained self-directed motivation. A "both passages" answer must be verifiable in BOTH texts, not merely topic-appropriate. If you cannot point to a matching sentence in EACH passage, the choice is wrong, no matter how reasonable it sounds.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Order is fixed: Passage-A-alone questions, then Passage-B-alone questions, then comparison questions — never jump ahead.',
        'For any "both passages" question, the claim must be verifiable in A AND in B — true of just one passage is the single most common trap.',
        'Before the comparison questions, summarize each passage in one sentence so you are comparing, not re-reading, under time pressure.',
        '"How would the author of A respond to B" questions: predict using only A\'s stated position, never outside knowledge.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.5', cedTitle: 'Comparing Paired Passages' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
