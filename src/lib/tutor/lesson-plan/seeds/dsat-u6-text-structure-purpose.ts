/**
 * Digital SAT — Reading & Writing: Text Structure and Purpose.
 *
 * Craft and Structure domain skill. Three question stems get tangled
 * together by students: "main purpose" (what the WHOLE text is doing),
 * "overall structure" (how the PARTS fit together), and "function of
 * [a specific] sentence" (the JOB one sentence does relative to its
 * neighbors). Same passage, three different lenses — the fix is teaching
 * students to label each part's job before reading the answer choices,
 * and to catch choices that restate a sentence's CONTENT while
 * mislabeling its FUNCTION.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U6_TEXT_STRUCTURE_PURPOSE: LessonPlan = {
  id: 'evelyn.testprep.dsat.text-structure-purpose.v1',
  title: 'Text Structure & Purpose',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.text-structure-purpose',
      standard: 'DSAT-6.2',
      description:
        'Determine a text\'s main purpose, describe its overall organizational structure, and identify the rhetorical function of a specific sentence within it.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the three related-but-different Craft and Structure question stems the student will keep seeing.',
      script:
        'Craft and Structure questions show up on nearly every digital SAT Reading and Writing module, and this skill covers three of its stems: "What is the main purpose of the text?", "Which choice best describes the overall structure of the text?", and "The [sentence] primarily functions to..." Same short passage, three different questions — and each one wants you looking at the text a different way.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-lenses',
      kind: 'concept',
      goal: 'Distinguish main purpose, overall structure, and sentence function, and name the traps for each.',
      keyIdeas: [
        'MAIN PURPOSE asks what the WHOLE text is doing. Answer choices are usually infinitive-verb phrases ("to describe...", "to argue...", "to compare..."). Pick the verb that matches what the text does start to finish, not just its opening or closing move.',
        'OVERALL STRUCTURE asks how the PARTS fit together — the text\'s shape. Common shapes: chronological/sequence, cause-and-effect, problem-then-solution, claim-then-evidence, general-to-specific, and (for arguments) opposing-views-then-resolution.',
        'SENTENCE FUNCTION asks what JOB one specific sentence performs relative to the sentence(s) immediately before and after it: introduce, exemplify, qualify/concede, contrast, transition, or conclude.',
        'STRATEGY — before reading the choices, mentally label each sentence or paragraph\'s job in one or two words. For structure questions, do this for the whole text; for function questions, do it for the target sentence and its neighbors.',
        'TRAP: CONTENT-ACCURATE, FUNCTION-WRONG. A choice can correctly restate WHAT a sentence says while mislabeling what it DOES — e.g., calling a qualifying caveat a "refutation," or calling a supporting example a "counterargument."',
        'TRAP: PART-FOR-WHOLE. On a main-purpose question, a wrong choice often nails the purpose of just ONE paragraph (usually the first or the most vivid one) rather than the text as a whole.',
        'TRAP: HALF-RIGHT STRUCTURE. A structure choice can describe the first half of the text accurately and then misdescribe the second half (e.g., says the text "presents two views and reconciles them" when it actually presents one view and then undermines it — no reconciliation).',
        'TRAP: OVERSTATED VERB. Function and purpose choices love strong verbs — "refute," "prove," "disprove." Check the text\'s actual strength of claim: a sentence that "complicates" or "qualifies" a finding is not the same as one that "refutes" it.',
      ],
      vocabulary: [
        { term: 'text structure', definition: 'the organizational pattern connecting a passage\'s parts, e.g. chronological, cause-and-effect, or claim-then-evidence.' },
        { term: 'rhetorical function', definition: 'the job a sentence or phrase performs in context (to introduce, qualify, exemplify, contrast), as opposed to what it literally says.' },
        { term: 'qualify', definition: 'to limit or add a condition to a claim, without fully rejecting it.' },
        { term: 'topic sentence', definition: 'the sentence that states a paragraph\'s main point, usually near its start.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-structure',
      kind: 'worked_example',
      problem:
        'Read the passage: "In 1969, engineers at a small aerospace firm proposed a lightweight alloy for aircraft wings, but budget constraints shelved the idea for a decade. In the 1980s, rising fuel costs revived interest in weight reduction, and the alloy was finally tested. Early trials revealed manufacturing defects that took years to resolve. By 1995, refined production methods made the alloy commercially viable, and it is now standard in wide-body jets." Question: Which choice best describes the overall structure of the text?',
      steps: [
        'Label each sentence\'s job: S1 = idea proposed, then shelved. S2 = interest revived, testing begins. S3 = complication (manufacturing defects). S4 = resolution and current status.',
        'That sequence of labels traces a single object (the alloy) through TIME, with a setback in the middle — a chronological account, not a comparison of two things and not a plain problem-then-solution (there is no single "problem" stated up front; the setback emerges partway through).',
        'Reject shapes that don\'t match: it is not comparing two competing alloys, and it does not open with a general claim it then narrows (general-to-specific) — it opens with a specific 1969 event.',
        'Best description: the passage traces, in chronological order, how the alloy moved from an early proposal through delay and a technical setback to eventual commercial adoption.',
      ],
      answer:
        'The text is organized chronologically: proposal (1969) → delay → revived interest and testing (1980s) → setback (defects) → resolution and adoption (1995).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-function-trap',
      kind: 'worked_example',
      problem:
        'Read the passage: "Some historians argue that the decline of a particular trade route was caused mainly by the rise of maritime shipping. Overland caravans, they note, could not compete with the lower shipping costs of sea vessels. However, recent archaeological evidence suggests that regional political instability disrupted caravan routes years before maritime trade expanded significantly. This timeline discrepancy suggests the trade route\'s decline had multiple, overlapping causes rather than a single dominant one." Question: The sentence "However, recent archaeological evidence suggests that regional political instability disrupted caravan routes years before maritime trade expanded significantly" primarily functions to do what?',
      steps: [
        'Look at what comes right before it: historians\' claim that maritime shipping mainly caused the decline. Look at what comes right after it: a conclusion that the decline had MULTIPLE overlapping causes.',
        'A tempting wrong answer says the sentence "refutes" or "disproves" the historians\' claim entirely. But the final sentence only says causes were "multiple, overlapping" — it never says maritime shipping was NOT a factor.',
        'So the sentence is not a full refutation; it introduces complicating evidence that sets up the passage\'s actual conclusion (multiple causes, not one).',
        'Correct function: to introduce evidence that complicates the initial explanation, setting up the passage\'s concluding claim that the decline had more than one cause.',
      ],
      answer:
        'It introduces evidence that complicates (not refutes) the historians\' claim, setting up the passage\'s conclusion that the decline had multiple, overlapping causes.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-main-purpose',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A community garden began in 2015 as a single vacant lot tended by six neighbors. Word spread, and by 2020 volunteers had reclaimed four additional lots, planting vegetables that a local food bank now distributes weekly. The garden\'s founders say the project succeeded not because of grant funding, which was minimal, but because neighbors kept showing up." Question: Which choice best describes the main purpose of the text?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'To criticize local officials for underfunding community initiatives.' },
        { id: 'b', text: 'To describe how a small volunteer effort grew into a sustained neighborhood resource.', correct: true },
        { id: 'c', text: 'To compare community gardens with traditional food banks.' },
        { id: 'd', text: 'To argue that grant funding is unnecessary for nonprofit success.' },
      ],
      expectedAnswer: 'To describe how a small volunteer effort grew into a sustained neighborhood resource.',
      hints: [
        'Ask what the WHOLE passage does, not just its last sentence about funding.',
        'It traces growth from one lot in 2015 to five lots and a weekly food-bank donation by 2020 — that is a description of change over time, not a criticism or a general argument about funding.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-structure',
      kind: 'try_yourself',
      problem:
        'Read the passage: "A city council debated whether to convert a downtown parking lot into a public plaza. Supporters argued the plaza would boost foot traffic to nearby shops. Opponents countered that removing parking would drive customers to competitors with easier access. After months of debate, the council commissioned a traffic study, which found that most shoppers arrived on foot or by bus rather than by car. The council approved the plaza the following month." Question: Which choice best describes the overall structure of the text?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It presents a single viewpoint and supports it with three examples.' },
        { id: 'b', text: 'It compares two unrelated historical events in chronological order.' },
        { id: 'c', text: 'It presents opposing arguments on an issue, then describes evidence that helped resolve the disagreement.', correct: true },
        { id: 'd', text: 'It defines a term and then illustrates it with a case study.' },
      ],
      expectedAnswer: 'It presents opposing arguments on an issue, then describes evidence that helped resolve the disagreement.',
      hints: [
        'Label each sentence: proposal, argument for, argument against, resolving evidence, decision.',
        'Two competing views appear before the traffic study — that rules out "a single viewpoint" (a) and rules out "two historical events" (b), since this is one live debate, not history.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-function',
      kind: 'try_yourself',
      problem:
        'Read the passage: "Marine biologists have long assumed that a species of deep-sea coral grows too slowly to recover from trawling damage. A ten-year survey of a damaged reef, however, found colonies that had regrown to nearly half their original size. The survey\'s lead author cautions that regrowth varied widely by site, and some damaged areas showed no recovery at all. Even so, the findings have prompted new proposals for temporary trawling bans to allow damaged reefs a chance to regenerate." Question: The sentence "The survey\'s lead author cautions that regrowth varied widely by site, and some damaged areas showed no recovery at all" primarily functions to do what?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'To introduce a new topic unrelated to the survey\'s findings.' },
        { id: 'b', text: 'To qualify the preceding finding by noting its limits before the passage draws a broader implication.', correct: true },
        { id: 'c', text: 'To refute the assumption stated in the first sentence.' },
        { id: 'd', text: 'To summarize the entire passage\'s argument.' },
      ],
      expectedAnswer: 'To qualify the preceding finding by noting its limits before the passage draws a broader implication.',
      hints: [
        'Look at what comes right before it (the promising regrowth finding) and right after it (a policy proposal).',
        'It does not reject the regrowth finding — it adds a limit on how far that finding applies, before the passage moves to what should be done next.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-content-vs-function',
      kind: 'misconception_check',
      question:
        'Asked for the function of a specific sentence, a student answers by summarizing what the sentence SAYS ("It says regrowth varied by site") instead of what it DOES. Where does this go wrong?',
      commonErrors: [
        {
          answer: 'It says regrowth varied by site, and some areas showed no recovery.',
          misconception: 'Confusing content (what the sentence states) with function (the rhetorical job it performs in context).',
          correctsTo:
            'Function answers describe the ACTION the sentence performs relative to its neighbors — to qualify a finding, introduce a counterexample, transition, or concede a point — not a restatement of what the sentence literally says. Two sentences can have the same content and different functions depending on what surrounds them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three stems, three lenses: MAIN PURPOSE = the whole text\'s goal (usually an infinitive verb phrase); OVERALL STRUCTURE = how the parts fit together; SENTENCE FUNCTION = the job one sentence does relative to its neighbors.',
        'Before reading the choices, label each part\'s job in your head: proposal, evidence, complication, resolution.',
        'Watch for content-accurate-but-wrong-job traps: a choice can correctly restate what a sentence says while mislabeling what it does.',
        'Watch for overstated verbs ("refute," "prove") when the text only "qualifies" or "complicates" — match the choice\'s verb strength to the text\'s actual claim strength.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Text Structure & Purpose' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
