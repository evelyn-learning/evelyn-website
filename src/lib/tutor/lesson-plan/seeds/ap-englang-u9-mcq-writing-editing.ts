/**
 * AP English Language & Composition — CED Unit 9.3: MCQ Writing and
 * Editing Strategy.
 *
 * The exam's multiple-choice section isn't only reading questions — roughly
 * a third of it is COMPOSITION/EDITING questions: a student draft passage
 * with numbered sentences, and questions asking which revision best adds
 * evidence, improves a transition, tightens wordy phrasing, or fixes an
 * inconsistency (verb tense, pronoun, register). These questions reward the
 * same instincts as revising your OWN essay — which is exactly why this
 * topic sits right before 9.4 (self-revision): editing someone else's draft
 * under a clock is the same skill turned outward.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * No anchor passage — this topic works from short, invented student-draft
 * sentences (the exam's own MCQ format), not one of the course's four
 * historical passages.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U9_MCQ_WRITING_EDITING: LessonPlan = {
  id: 'evelyn.ap.englang.mcq-writing-editing.v1',
  title: 'U9.3 MCQ Writing and Editing Strategy',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.mcq-writing-editing',
      description:
        'Given a numbered student-draft passage, select the revision that best strengthens evidence, sharpens a transition, or corrects a consistency error, and justify the choice against the specific editing goal the question asks for rather than a generic sense that a sentence "sounds better."',
      standard: 'AP-ENGLANG-9.3',
    },
  ],
  prerequisites: ['apenglang.transitions-cohesion', 'apenglang.mcq-reading-strategy'],
  followUps: ['apenglang.revision-and-sophistication'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make students feel that "sounds better" is not an editing standard, before naming the exam\'s actual editing question types.',
      script:
        "Two sentences: 'The policy failed for a lot of reasons, and it was bad for the economy, and also people didn't like it.' versus 'The policy failed because it strained small businesses, and public support collapsed as a result.' Both are grammatically fine. But if I told you the paragraph's job is to prove economic harm caused the policy's failure, only one of those sentences actually does that job — it's not about which one 'sounds better,' it's about which one serves the paragraph's specific goal. The exam's writing/editing MCQs test exactly this: not generic polish, but whether a revision serves the STATED goal of the passage at that exact point.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mcq-writing-editing',
      kind: 'concept',
      goal: 'Name the exam\'s main editing-question families and the discipline of matching a revision to the STATED goal rather than to general polish.',
      keyIdeas: [
        "THE EXAM'S WRITING/EDITING QUESTIONS ALWAYS GIVE A GOAL — a question stem like 'which revision would best support the claim in sentence 4 with specific evidence' or 'which choice best improves the transition between sentences 6 and 7.' The single most common error is evaluating choices against a vague 'sounds more sophisticated' standard instead of the stated goal.",
        "EVIDENCE QUESTIONS ask which revision adds a SPECIFIC, relevant detail supporting a claim already made — reject choices that are vague, off-topic, or restate the claim without adding new supporting detail.",
        "TRANSITION QUESTIONS ask which connector correctly signals the LOGICAL RELATIONSHIP between two sentences/ideas — contrast (however, yet), cause/effect (therefore, as a result), addition (moreover, furthermore), or concession (admittedly, granted). Picking a transition word that sounds formal but signals the WRONG relationship (e.g. 'therefore' between two contrasting ideas) is a classic trap.",
        "CONCISENESS QUESTIONS ask which revision cuts redundancy or wordiness WITHOUT losing meaning — the trap is a shorter option that accidentally drops necessary information, or a choice that's shorter but still padded with empty phrases ('due to the fact that' for 'because').",
        "CONSISTENCY QUESTIONS test verb tense, pronoun reference, or register (formal vs. casual) matching the rest of the passage — scan the surrounding sentences for the established tense/pronoun/register before picking, since the 'correct-sounding' choice in isolation can still break consistency with its neighbors.",
        "THE FASTEST CHECK: read the goal in the question stem FIRST, then read each choice asking only 'does this specific choice accomplish THAT stated goal' — not 'is this choice well-written in general.' A choice can be perfectly grammatical and still wrong because it solves a different problem than the one asked about.",
        "ALWAYS RE-READ THE FULL SENTENCE (or the sentence before/after) WITH THE CHOICE SUBSTITUTED IN — evaluating a revision in isolation, without its neighbors, is how transition and consistency errors slip through.",
      ],
      vocabulary: [
        { term: 'stated goal', definition: 'the specific editing purpose named in the question stem (e.g. add evidence, fix a transition) that a correct revision must serve.' },
        { term: 'transition question', definition: 'an MCQ asking which connector correctly signals the logical relationship (contrast, cause/effect, addition, concession) between two sentences.' },
        { term: 'consistency question', definition: 'an MCQ testing verb tense, pronoun reference, or register matching the surrounding passage.' },
        { term: 'conciseness question', definition: 'an MCQ asking which revision removes redundancy or wordiness without losing necessary meaning.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mcq-editing-example',
      kind: 'worked_example',
      problem:
        "A numbered student draft reads: '(4) Remote work has become common since 2020. (5) However, it has increased productivity for many employees.' A question asks: 'Which choice best replaces the underlined transition in sentence 5?' with choices: (A) However, (B) Therefore, (C) For example,, (D) In contrast,. Reason through to the credited choice.",
      steps: [
        "READ THE STATED GOAL. The question isn't asking whether sentence 5 is well-written in general — it's specifically asking which connector correctly signals the relationship BETWEEN sentence 4 and sentence 5.",
        "IDENTIFY THE ACTUAL LOGICAL RELATIONSHIP. Sentence 4 states a fact (remote work became common); sentence 5 states an effect of that fact (increased productivity). That's a CAUSE/EFFECT relationship, not a contrast.",
        "ELIMINATE (A) 'HOWEVER' AS A REVERSED SIGNAL. 'However' signals contrast — but sentence 5 doesn't contradict sentence 4, it builds on it. This is the classic trap: a transition that sounds natural in isolation but signals the wrong relationship once you check the actual logic.",
        "ELIMINATE (C) 'FOR EXAMPLE' AS TOO NARROW. Sentence 5 isn't a specific instance/example of sentence 4 — it's a broader consequence, so 'for example' misdescribes the relationship.",
        "ELIMINATE (D) 'IN CONTRAST' FOR THE SAME REASON AS (A). No contrast exists between the two sentences to signal.",
        "CONFIRM (B) 'THEREFORE' MATCHES THE CAUSE/EFFECT RELATIONSHIP. Sentence 5's claim follows AS A RESULT of sentence 4's — 'therefore' correctly signals that logical connection.",
      ],
      answer:
        "(B) 'Therefore' — the stated goal is matching the connector to the actual logical relationship between sentences 4 and 5 (cause leading to an effect), which rules out the contrast signals (A, D) and the example signal (C) regardless of how natural any of them sound in isolation.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-pick-best-revision',
      kind: 'try_yourself',
      problem:
        "A numbered student draft reads: '(2) Many students feel overwhelmed by standardized testing. (3) Schools should therefore reduce the number of required exams.' A question asks: 'Which choice, if added as a new sentence between (2) and (3), would most strengthen the argument by providing specific supporting evidence?' Choices: (A) 'Testing is a big part of school life.' (B) 'A 2019 study found that 68% of high schoolers reported test-related anxiety severe enough to affect their sleep.' (C) 'Some people think tests are important for measuring progress.' (D) 'Tests have existed in schools for a very long time.' Pick the best choice and justify it in ONE sentence, naming the stated goal and why the other choices fail it.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'revision-choice-and-justification',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): selects (B) and justifies it by explicitly naming the stated goal (specific supporting evidence for the overwhelm claim) and explaining why (A) is too vague/generic, (C) presents an opposing view rather than supporting evidence, and (D) is true-but-irrelevant to the overwhelm claim. Partial credit (3-5) for selecting (B) with a justification that names only one distractor's flaw or is vague about WHY (B) fits the stated goal (e.g. just 'it has a statistic' without connecting it to specific/relevant evidence). Low/no credit (0-2) for selecting a different choice, or selecting (B) with no justification.",
            modelResponse:
              "(B) is correct because the stated goal is specific supporting evidence for the overwhelm claim, and only (B) supplies a concrete, relevant statistic (68% reporting test-related anxiety), while (A) and (D) are vague or irrelevant generalities that could apply to almost any claim about testing, and (C) actually introduces a competing view rather than evidence for the draft's own argument.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-sounds-more-sophisticated',
      kind: 'misconception_check',
      question:
        'A student says: "I pick whichever revision choice uses the most advanced vocabulary or the longest sentence — it usually signals the \'better\' answer." Is this a sound strategy for the exam\'s writing/editing questions?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Substituting a surface impression of sophistication (fancy vocabulary, sentence length) for actually checking whether a choice serves the SPECIFIC stated goal in the question stem — the two are frequently unrelated.",
          correctsTo:
            "No — these questions aren't testing general polish, they're testing whether a specific revision accomplishes a STATED goal (add evidence, fix a transition, cut wordiness, match consistency). A short, plain-language choice that correctly signals a cause/effect relationship beats a long, elaborate one that signals contrast when contrast isn't present. Always re-read the question stem's stated goal FIRST, then judge each choice only against that goal — not against a general sense of which one 'sounds smarter.'",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Every writing/editing question gives a STATED GOAL in its stem (add evidence, fix a transition, cut wordiness, match consistency) — judge choices against THAT goal, not general polish.",
        "Transition words must match the actual logical relationship (contrast, cause/effect, addition, concession) — a natural-sounding connector that signals the wrong relationship is the classic trap.",
        "Evidence choices must be specific and relevant, not vague generalities or true-but-irrelevant facts.",
        "Consistency questions require scanning the surrounding sentences for established tense/pronoun/register — a choice that's fine in isolation can still break consistency with its neighbors.",
        "Re-read the full sentence (and its neighbors) with the choice substituted in before selecting — never evaluate a revision in isolation.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.3',
    cedTitle: 'MCQ Writing and Editing Strategy',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
