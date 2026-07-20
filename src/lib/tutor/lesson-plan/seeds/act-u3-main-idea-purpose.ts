/**
 * ACT — Reading / Main Idea & Author's Purpose.
 *
 * Nearly every one of the ACT's four Reading passages opens or closes
 * with a main-idea or author's-purpose question — roughly 4 to 8 of the
 * 40 questions on the section. At ~52 seconds per question these are
 * some of the fastest points on the test IF you know the two traps the
 * ACT reliably sets: answers that are too narrow (a detail dressed up
 * as the whole point) and answers that are too broad (a claim the
 * passage never actually makes). All stimuli below are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_MAIN_IDEA_PURPOSE: LessonPlan = {
  id: 'evelyn.testprep.act.main-idea-purpose.v1',
  title: "Main Idea & Author's Purpose",
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.main-idea-purpose',
      standard: 'ACT-3.1',
      description:
        "Identify the main idea of an ACT Reading passage and the author's purpose in writing it, distinguishing the correct answer from choices that are too narrow, too broad, or unsupported by the text.",
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe main idea / purpose questions as some of the fastest, most pattern-based points on ACT Reading.',
      script:
        "Here's a pattern worth knowing: almost every ACT Reading passage — all four of them — opens or closes with a main idea or author's-purpose question, roughly 4 to 8 of the 40 questions on the whole section. At about 52 seconds per question, these should be some of your fastest points, because the ACT tests them the SAME way every time: one right answer, and two predictable kinds of wrong answer. Today we learn to spot both.",
      suggestedTools: ['show_text'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-main-idea-purpose',
      kind: 'concept',
      goal: 'The scope test for main idea/purpose questions and the three named traps that make wrong answers sound plausible.',
      keyIdeas: [
        'Main idea / purpose questions ask what the passage AS A WHOLE is about, or why the author wrote it — not what one paragraph or one sentence says.',
        "SIGNAL POSITIONS: the first sentence usually sets the topic; the last sentence often states the point or conclusion. When short on time, read those two first and treat the last one as the closest thing to a thesis.",
        'TRAP 1 — TOO NARROW: a choice restates one true supporting detail (one fact, one paragraph) but misses the passage\'s overall point.',
        'TRAP 2 — TOO BROAD: a choice stretches the claim further than the text supports, often flagged by absolute words — all, every, always, entirely, never.',
        'TRAP 3 — UNMENTIONED: a choice introduces a plausible-sounding fact that never actually appears in the passage.',
        "PURPOSE questions hinge on a VERB: choices read like 'argue,' 'explain,' 'describe,' or 'compare.' Match the verb that fits what the passage actually DOES, not just its subject.",
        'SCOPE TEST: before picking, check whether the choice matches the passage\'s scope exactly — not zoomed in on one detail, not zoomed out past what was written.',
        'PACE: budget about 52 seconds for this question type and do not re-read the whole passage to answer it — the first/last-sentence scan is usually enough.',
      ],
      vocabulary: [
        { term: 'main idea', definition: 'what the passage as a whole is mostly about — not what any single sentence says.' },
        {
          term: "author's purpose",
          definition: 'why the author wrote the passage — the verb (argue, explain, describe, compare…) that matches what the text does.',
        },
        { term: 'scope', definition: "how broad or narrow a claim is; a correct main-idea answer matches the passage's scope exactly." },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'Passage: "For decades, urban planners assumed that wider highways relieved traffic congestion. Cities added lanes, only to watch traffic thicken again within a few years. Economists eventually identified the culprit: induced demand. A wider road lowers the cost of driving, so more people choose to drive, refilling the very lanes built to empty it. The finding forced planners to reconsider whether pavement was ever the answer to gridlock." Which choice best states the main idea of the passage? (a) Urban planners are incompetent at designing highways. (b) Adding highway lanes often fails to reduce congestion because it increases the number of drivers. (c) Economists discovered that all traffic congestion is caused by induced demand. (d) Cities should stop building highways altogether.',
      steps: [
        'Scan the first sentence (the old assumption: wider highways relieve congestion) and the last sentence (planners had to reconsider that assumption) to find the arc of the passage.',
        'The middle sentences supply the mechanism: more lanes lower the cost of driving, so more people drive, refilling the lanes — that is "induced demand."',
        'Test each choice against the WHOLE passage, not one sentence: (a) is an opinion the passage never states — planners acted on a reasonable assumption, they were not called incompetent. (c) uses the absolute word "all," which overshoots the passage\'s claim about this one mechanism. (d) is a policy recommendation the passage never makes.',
        '(b) is the only choice that names both the cause (added lanes) and the effect (more drivers, no less congestion) that the passage actually develops.',
      ],
      answer: '(b) Adding highway lanes often fails to reduce congestion because it increases the number of drivers.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap',
      kind: 'worked_example',
      problem:
        'Passage: "Coral reefs cover less than one percent of the ocean floor, yet they shelter roughly a quarter of all known marine species. Reef fish rely on coral not just for food but for camouflage and nursery grounds where juveniles can mature safely. When rising ocean temperatures cause corals to expel the algae living in their tissues — a process called bleaching — that entire support structure can collapse within months. The passage argues that coral bleaching threatens far more than the coral itself." The main purpose of the passage is to: (a) explain how coral polyps build their skeletons. (b) describe the process of coral bleaching in scientific detail. (c) show that coral bleaching endangers the wider marine ecosystem that depends on reefs. (d) argue that all reef fish species will go extinct without intervention.',
      steps: [
        'The passage builds toward its final sentence: bleaching "threatens far more than the coral itself" — treat that as the thesis.',
        'TRAP CHECK on (b): bleaching IS described in the passage, so this choice feels safe — but it names a supporting DETAIL, not the passage\'s actual point about why bleaching matters beyond the coral. This is the too-narrow trap.',
        '(a) introduces a fact never discussed (how polyps build skeletons) — the unmentioned-fact trap.',
        '(d) uses absolute language ("all," "will go extinct") the passage never commits to — the too-broad trap.',
        '(c) matches the final sentence\'s claim exactly: reef-dependent species, not just coral, are endangered.',
      ],
      answer: '(c) show that coral bleaching endangers the wider marine ecosystem that depends on reefs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-printing-press',
      kind: 'try_yourself',
      problem:
        'Passage: "When the printing press arrived in fifteenth-century Europe, most books were still hand-copied by monks, a process that could take a year for a single volume. Movable type let printers produce hundreds of copies in the time a monk needed for one. Books that once cost a farmer\'s yearly wage became affordable to merchants and eventually to ordinary readers. Literacy, once a mark of the clergy and the wealthy, began spreading into the middle class within two generations." Which choice best describes the main idea of the passage?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Monks were too slow to keep up with demand for books.' },
        {
          id: 'b',
          text: 'The printing press dramatically lowered the cost of books and helped literacy spread beyond the elite.',
          correct: true,
        },
        { id: 'c', text: 'Movable type was invented in the fifteenth century.' },
        { id: 'd', text: 'Merchants were the primary buyers of printed books.' },
      ],
      expectedAnswer: 'The printing press dramatically lowered the cost of books and helped literacy spread beyond the elite.',
      hints: [
        'The passage tracks a cause (movable type) and an effect (cheaper books, spreading literacy) — the main idea usually names both.',
        'Check whether an answer only covers ONE sentence (like when the press arrived, or who bought books) instead of the whole passage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bag-ban',
      kind: 'try_yourself',
      problem:
        'Passage: "A city council had long debated banning plastic bags, citing litter and marine pollution. Yet when the ban finally passed, grocery store owners reported an unexpected side effect: reusable bags, if not washed regularly, harbored more bacteria than the plastic ones they replaced. The council\'s public health department now recommends washing reusable bags weekly — a step few shoppers had considered before the ban." The author\'s primary purpose in the passage is to:',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'argue that plastic bag bans should be reversed.' },
        {
          id: 'b',
          text: 'explain an overlooked consequence of a policy that had been enacted for other reasons.',
          correct: true,
        },
        { id: 'c', text: 'prove that reusable bags are more dangerous than plastic bags in every case.' },
        { id: 'd', text: "describe how grocery stores responded financially to the ban." },
      ],
      expectedAnswer: 'explain an overlooked consequence of a policy that had been enacted for other reasons.',
      hints: [
        "The ban passed for one reason (litter, pollution) but the passage's real focus is an UNEXPECTED effect that surfaced afterward.",
        'Eliminate choices with absolute language ("in every case") and choices about details never mentioned (store finances).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-octopus',
      kind: 'try_yourself',
      problem:
        'Passage: "Octopuses have no bones, yet their arms can lift objects many times their own body weight. Each arm contains roughly forty percent of the octopus\'s neurons, allowing it to taste and grip independently of the brain. When scientists severed the nerve connecting one arm to the brain, the arm still responded to touch on its own, reaching toward food it could not see. The finding suggests octopus arms operate with a striking degree of independent \'thought.\'" Which choice best states the main idea of the passage?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Octopus arms contain more neurons than octopus brains do.' },
        { id: 'b', text: 'Octopus arms can act with a surprising level of independence from the brain.', correct: true },
        { id: 'c', text: 'All octopus behavior is controlled entirely by their arms rather than their brains.' },
        { id: 'd', text: 'Scientists have proven that octopuses feel pain in their arms.' },
      ],
      expectedAnswer: 'Octopus arms can act with a surprising level of independence from the brain.',
      hints: [
        "The passage builds toward the final sentence's claim — treat it as the thesis, not just a wrap-up detail.",
        'Distrust an answer using words like "entirely" or "all" when the passage says "a striking degree" — a qualified claim, not an absolute one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-broadest-choice',
      kind: 'misconception_check',
      question:
        "A student, asked for the main idea of a passage about one beekeeper's unusual pollination technique, picks the choice \"All commercial farms should switch to hand-pollination.\" Why is this wrong, even though hand-pollination was the passage's topic?",
      commonErrors: [
        {
          answer: 'Picks the broadest, most sweeping choice because it "sounds important."',
          misconception: 'Assuming the most dramatic or global-sounding claim must be the main idea.',
          correctsTo:
            "The main idea must match the passage's SCOPE. A passage about one beekeeper's technique supports a main idea about that beekeeper's approach and its results — not a policy recommendation for every commercial farm, which the passage never argued. Match scope exactly: not too narrow (one detail), not too broad (a claim the text never makes).",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Main idea / purpose questions test the WHOLE passage — check every choice against all of it, not just one sentence.',
        'Two consistent traps: too narrow (a true detail dressed up as the main point) and too broad (a claim the passage never actually makes).',
        'Absolute words in an answer choice — all, every, always, never, entirely — are a red flag on this question type.',
        "The first and last sentences carry the strongest signal of the passage's point; scan those first when time is short.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: "Main Idea & Author's Purpose" },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
