/**
 * AP English Language & Composition — CED Unit 9.2: MCQ Reading
 * (Rhetorical Analysis) Strategy.
 *
 * The exam's 45-question multiple-choice section is roughly half the score
 * and is graded with NO partial credit — a wrong answer costs the same
 * whether it's a wild guess or one word off. This topic teaches the reading
 * moves specific to the exam's rhetorical-analysis-style passage questions:
 * PURPOSE questions ("the primary effect of this sentence is..."),
 * MEANING-IN-CONTEXT questions (a word/phrase's function in a passage, not
 * its dictionary definition), and the elimination discipline that turns a
 * 4-way guess into a 2-way one. Builds directly on Unit 6's close-reading
 * skills (analyzing style, diction/connotation/tone) — this topic is about
 * applying those skills FAST and under a distractor-design lens.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Jonathan Swift, "A Modest Proposal" — evelyn.passage.swift-modest-proposal.v1.
 * The teaching point is READING THE PERSONA/TONE for MCQ-style purpose and
 * meaning-in-context questions — quoting is limited to the canonical
 * "delicious nourishing... food" irony phrase, one short quote only.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U9_MCQ_READING_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.englang.mcq-reading-strategy.v1',
  title: 'U9.2 MCQ Reading (Rhetorical Analysis) Strategy',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.mcq-reading-strategy',
      description:
        'On multiple-choice questions about a passage, distinguish a word or sentence\'s function/effect in context from its literal or dictionary meaning, and eliminate distractors that are true-but-irrelevant, too broad, or too narrow rather than actually wrong about the passage.',
      standard: 'AP-ENGLANG-9.2',
    },
  ],
  prerequisites: ['apenglang.analyzing-style', 'apenglang.diction-and-tone', 'apenglang.timed-writing-strategy'],
  followUps: ['apenglang.mcq-writing-editing'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make students feel the difference between knowing a word\'s definition and knowing what it\'s DOING in a sentence, before naming any MCQ strategy.',
      script:
        "Quick one: in 'the meeting dragged on,' does 'dragged' mean someone physically pulled the meeting somewhere? Of course not — you instantly read it as 'felt unbearably slow,' because you're reading for FUNCTION, not dictionary definition, without even trying. That's exactly the skill the exam's meaning-in-context and purpose questions test — except they hand you four tempting wrong answers designed to catch you reasoning about the word in isolation instead of in the sentence doing its actual job. The good news: you already do this instinctively in real reading. Today we make it deliberate and fast enough for a 45-question timed section.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mcq-reading-strategy',
      kind: 'concept',
      goal: 'Name the two MCQ question families this topic targets and the elimination discipline that narrows four choices to one.',
      keyIdeas: [
        "MEANING-IN-CONTEXT QUESTIONS ask what a word or phrase means/does IN THIS SENTENCE, not in general. The trap: an answer choice that IS a correct dictionary definition of the word but doesn't fit how the word functions in THIS passage. Always re-read the sentence with each candidate meaning substituted in — the one that keeps the sentence's logic and tone intact is correct.",
        "PURPOSE / EFFECT QUESTIONS ask what a sentence, device, or structural choice ACCOMPLISHES for the writer's argument or for the reader — not what it says. The trap: an answer that accurately restates the sentence's content (summary) instead of naming its function (e.g. 'to soften a harsh claim before making a stronger one,' 'to establish credibility before the counterargument').",
        "FOUR CLASSIC DISTRACTOR TYPES to recognize and eliminate FAST: (1) TRUE BUT IRRELEVANT — accurate about the passage but doesn't answer the actual question asked; (2) TOO BROAD — describes the whole passage's purpose when the question asks about ONE sentence/device; (3) TOO NARROW — describes only part of what the cited device does, missing its full effect; (4) OPPOSITE OR REVERSED — gets the direction of the effect backwards (e.g. says a device builds sympathy when it actually undercuts it).",
        "ALWAYS RE-ANCHOR TO THE LINE NUMBERS CITED. A choice can be well-written and plausible-sounding in isolation but simply not match what happens at the cited lines — go back to the text before trusting your memory of 'roughly what that part said.'",
        "PROCESS OF ELIMINATION BEATS SEARCHING FOR 'THE RIGHT ANSWER' COLD. On a hard question, first eliminate any choice that is flatly wrong about the passage's content, THEN weigh the remaining choices against the specific question stem (meaning vs. purpose vs. effect) — most 4-way questions collapse to a 2-way choice this way, which is a much easier read to win.",
        "TONE AND PERSONA QUESTIONS (common on satire/irony passages) ask you to read the GAP between what a passage says and what it means — a persona speaking with calm, reasonable confidence about something the reader recognizes as monstrous IS the tone; naming the literal claim as the 'tone' is a meaning-in-context trap in disguise.",
      ],
      vocabulary: [
        { term: 'meaning-in-context', definition: "a word or phrase's function within its specific sentence, as distinct from its general dictionary definition." },
        { term: 'purpose/effect question', definition: 'an MCQ asking what a sentence or device accomplishes for the argument or reader, not what it states.' },
        { term: 'true but irrelevant', definition: 'a distractor that is accurate about the passage but does not answer the specific question asked.' },
        { term: 'process of elimination', definition: 'narrowing choices by ruling out flatly wrong or off-target answers before weighing the remainder.' },
        { term: 'persona', definition: "the constructed voice/character a writer adopts, which may differ from the writer's own actual views (as in satire)." },
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mcq-swift',
      kind: 'worked_example',
      problem:
        "A question asks: 'The primary rhetorical effect of the proposer's calm, statistic-laden tone in describing the plight of impoverished mothers (paragraphs 1-2) is to...' with four answer choices: (A) express Swift's genuine concern for the poor, (B) establish the proposer as a reasonable, data-driven problem-solver before he reveals his monstrous solution, (C) summarize the economic condition of Ireland, (D) criticize mothers for failing to support their children. Reason through eliminating distractors to the credited answer (mentioned here in prose — this segment type carries no passageId field — the resolved text is evelyn.passage.swift-modest-proposal.v1).",
      steps: [
        "READ THE QUESTION STEM CAREFULLY. It asks for a PURPOSE/EFFECT (what the tone accomplishes), not a summary of content — that already rules out any choice that just restates what the paragraphs say.",
        "ELIMINATE (C) AS TRUE BUT IRRELEVANT. It's accurate that the paragraphs describe Ireland's economic condition — but that's a content summary, not an effect of the TONE specifically, so it doesn't answer the question asked.",
        "ELIMINATE (D) AS REVERSED/WRONG ABOUT THE PASSAGE. The proposer's tone toward the mothers is sympathetic-sounding concern, not criticism — this choice gets the passage's actual content backwards.",
        "ELIMINATE (A) AS A TRAP THAT CONFUSES THE PERSONA WITH THE WRITER. This is the classic satire trap: the PROPOSER (persona) may sound concerned, but SWIFT (the actual writer) is using that persona ironically — the question is about the persona's effect within the text, and even taken at face value 'genuine concern' doesn't explain WHY the calm, statistical tone matters rhetorically.",
        "CONFIRM (B) AGAINST THE CITED LINES. Re-reading paragraphs 1-2: precise numbers, a measured, reasonable-sounding voice, no hint yet of what's coming — this is exactly a credibility-building setup that makes the persona seem trustworthy right before the ironic proposal lands, which IS a specific, defensible rhetorical effect.",
        "SELECT (B) as the only choice that names an EFFECT of the specific device (calm, statistical tone) tied to its place in the passage's larger irony.",
      ],
      answer:
        "(B) — eliminating (C) as true-but-irrelevant (content summary, not a tone effect), (D) as reversed (the tone reads as concern, not criticism), and (A) as confusing the ironic persona with Swift's actual purpose, leaves (B): the calm, data-driven tone builds the persona's credibility as a reasonable problem-solver, which is precisely what makes the proposal's eventual monstrousness land as irony rather than simply as an error.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-mcq-justify',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.swift-modest-proposal.v1, answer this reading-skill question in ONE OR TWO sentences: What is the primary effect of the proposer describing a starving child as, in his words, 'a most delicious nourishing and wholesome food'? State the effect (not a summary of what the line says) and briefly justify it by naming what makes this an EFFECT question rather than a meaning-in-context trap.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      rubric: {
        parts: [
          {
            criterionId: 'effect-and-justification',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): correctly identifies the EFFECT — the jarring mismatch between the calm, appetite-appreciative diction ('delicious nourishing and wholesome') and the monstrous literal content (eating a child) creates the passage's central irony, exposing the coldness of treating human suffering as a mere economic-supply problem — and briefly justifies why this is an effect/purpose question rather than a literal-meaning question (the words' plain dictionary sense is clear; the question is what that calm phrasing DOES to the reader/argument). Partial credit (3-5) for correctly naming the irony/shock effect without the justification, or a justification without clearly naming the effect. Low/no credit (0-2) for treating the phrase as sincere praise of food, or for merely restating that the proposer describes children as food with no stated effect.",
            modelResponse:
              "The effect is to make the proposal's monstrousness land through irony: describing a child in the calm, appreciative diction of a food critic ('delicious nourishing and wholesome') creates a jarring mismatch between tone and content that exposes the coldness of treating human suffering as a mere supply problem. This is an effect question, not a meaning-in-context one, because the words' literal sense is perfectly clear — the question is what that clinical, appetitive phrasing DOES to a reader who expects horror and gets a menu description instead.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-longest-most-specific',
      kind: 'misconception_check',
      question:
        'A student says: "When I\'m stuck between two MCQ answer choices, I pick whichever one is longer and more specific-sounding — it\'s usually right." Is this a sound tie-breaking strategy?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Substituting a surface heuristic (length, specificity of WORDING) for actually re-anchoring the choice to the cited lines and the question stem — test-writers deliberately craft plausible-sounding wrong answers of any length.',
          correctsTo:
            "No — length and confident-sounding specificity are not evidence a choice is correct; the exam's wrong answers are deliberately written to sound plausible, sometimes MORE polished than the correct one. The real tie-breaker is re-reading the cited lines against the exact question stem: is this choice answering meaning-in-context or purpose/effect? Does it match the DIRECTION of the effect (builds vs. undercuts, e.g.)? Is it too broad (describes the whole passage) or too narrow (only part of the device's job)? A short, plainly-worded choice that survives all four distractor checks beats a long, specific-sounding one that doesn't.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Meaning-in-context asks what a word does IN THIS SENTENCE, not its dictionary definition; purpose/effect asks what a device ACCOMPLISHES, not what it says.",
        "Four classic distractor types: true-but-irrelevant, too broad, too narrow, opposite/reversed — name the type to eliminate fast.",
        "Always re-anchor a choice to the cited line numbers before trusting your memory of the passage.",
        "Eliminate the clearly wrong choices first, THEN weigh survivors against the exact question stem — most 4-way questions collapse to a 2-way choice this way.",
        "On satire/persona passages, don't confuse the persona's stated view with the writer's actual purpose — the gap between them often IS the tested effect.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.2',
    cedTitle: 'MCQ Reading (Rhetorical Analysis) Strategy',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
