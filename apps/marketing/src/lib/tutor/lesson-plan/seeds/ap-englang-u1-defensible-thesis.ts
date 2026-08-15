/**
 * AP English Language & Composition — CED Unit 1.3: Writing a Defensible
 * Thesis.
 *
 * Builds on 1.2 (reading for the writer's claim): once a student can locate
 * what a TEXT argues, the next skill is writing their OWN arguable claim
 * ABOUT that text's rhetorical choices — a thesis. This is the single line
 * every AP Lang essay is graded on first (Row A of the real rubric), and the
 * most common way students lose the point is by writing something true but
 * not actually arguable.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of July?"
 * (1852) — evelyn.passage.douglass-fourth-of-july.v1. The teaching point is
 * the MECHANICS of a defensible thesis (arguable, responsive, specific), not
 * the atrocity content the speech condemns — quotes below are limited to the
 * short structural/rhetorical-question phrases used in the calibration plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_DEFENSIBLE_THESIS: LessonPlan = {
  id: 'evelyn.ap.englang.defensible-thesis.v1',
  title: 'U1.3 Writing a Defensible Thesis',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.defensible-thesis',
      description:
        'Write a thesis about a given text that is arguable, responsive to the prompt, and specific enough to be defended in an essay — not a restatement, a vague evaluation, or a summary.',
      standard: 'AP-ENGLANG-1.3',
    },
  ],
  prerequisites: ['apenglang.reading-for-claim'],
  followUps: ['apenglang.evidence-commentary', 'apenglang.audience-context'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between a claim they could defend under pushback and one that collapses the moment someone asks "so what?" or "says who?"',
      script:
        "Imagine you have to defend a sentence in front of a skeptical judge who's allowed to ask exactly one question: 'Prove it.' If your sentence is 'Douglass gave a speech in 1852,' the judge just shrugs — there's nothing to prove, it's a fact. If your sentence is 'Douglass's speech is really powerful,' the judge asks 'powerful how? prove it' — and you realize you haven't actually said anything specific enough to defend. But if your sentence is 'Douglass forces his audience to confront their hypocrisy by turning a rhetorical question directly on them,' now you've got something a judge can interrogate — and something you can actually defend with evidence. That third sentence is a thesis. Today we build the habit of writing sentence three, every time.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-defensible-thesis',
      kind: 'concept',
      goal: 'Define the three tests a defensible thesis must pass and name the three common traps that produce an indefensible one.',
      keyIdeas: [
        "A DEFENSIBLE THESIS passes three tests: it is ARGUABLE (a reasonable reader could disagree), it is RESPONSIVE (it actually answers the specific prompt asked, not an adjacent one), and it is SPECIFIC (precise enough to be defended with particular evidence, not so broad it could apply to almost any text).",
        "TRAP 1 — THE RESTATEMENT: rephrasing the prompt's own wording back as if it were a claim ('This passage shows Douglass using rhetoric to make his point'). Nothing has been asserted that the prompt didn't already say.",
        "TRAP 2 — THE VAGUE EVALUATION: a judgment with no specific content behind it ('Douglass's speech is very effective and persuasive'). Effective HOW? Persuasive to WHOM, by WHAT means? A vague evaluation sounds like an opinion but gives the writer nothing concrete to defend.",
        "TRAP 3 — THE SUMMARY: describing content instead of asserting a claim about the writer's choices ('Douglass talks about the difference between what Independence Day means to free people and enslaved people'). This could be true of the text without the writer ever having made an argument about it.",
        "A reliable defensible thesis usually does TWO things at once: names the writer's PURPOSE (what they want the text to do) and names at least one specific STRATEGY or rhetorical choice tied to that purpose — because naming both is what makes the sentence arguable AND specific enough to defend.",
        "SCOPE matters: a thesis that tries to claim everything about a text ('Douglass uses many rhetorical strategies to argue many things') is too broad to defend in the space of one essay. A strong thesis narrows to a line of reasoning the writer can actually follow through.",
        "The thesis is not required to list every piece of evidence up front — it needs to make a claim specific enough that the reader can predict roughly what kind of evidence would support it.",
        "Testing your own thesis: could someone reasonably argue the opposite? Could you point to a specific moment in the text as proof? If either answer is no, the thesis needs to be sharpened before you start writing the essay.",
      ],
      vocabulary: [
        { term: 'defensible thesis', definition: "an arguable, responsive, specific claim about a text's rhetorical choices that an essay is built to prove." },
        { term: 'restatement trap', definition: "rephrasing the prompt's own language back as a 'claim' without asserting anything new." },
        { term: 'vague evaluation', definition: "a judgment ('effective,' 'powerful') with no specific claim behind it about how or why." },
        { term: 'scope', definition: "how broad or narrow a thesis's claim is — too broad to defend in one essay, or narrow enough to follow through." },
        { term: 'line of reasoning', definition: "the chain of related points a thesis sets up and the essay's body paragraphs are built to prove." },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-thesis-triage',
      kind: 'worked_example',
      problem:
        "Three students propose a thesis for the prompt: 'Write a thesis that responds to Douglass's rhetorical purpose in the excerpt from \"What to the Slave Is the Fourth of July?\"' (evelyn.passage.douglass-fourth-of-july.v1, mentioned here in prose, not passed as a field on this segment type). Candidate A: 'Douglass's speech is about the meaning of the Fourth of July for enslaved people.' Candidate B: 'Douglass's speech is extremely powerful and moving.' Candidate C: 'By repeatedly turning his rhetorical question on his audience, Douglass forces listeners who see themselves as free and just to confront their complicity in a hypocrisy they had been able to ignore.' Triage all three.",
      steps: [
        "TEST CANDIDATE A AGAINST 'ARGUABLE.' Could a reasonable reader disagree that the speech is 'about' this topic? No — it's simply a description of content. This is the SUMMARY trap: true, but not a claim about what Douglass is doing.",
        "TEST CANDIDATE B AGAINST 'SPECIFIC.' 'Powerful' and 'moving' name a reaction but not a mechanism — powerful HOW? This is the VAGUE EVALUATION trap: it sounds like an opinion but gives the essay nothing concrete to prove.",
        "TEST CANDIDATE C AGAINST ALL THREE TESTS. Arguable? Yes — a reader could contend Douglass's purpose was something else (e.g. purely to inform), so this is a genuine, disputable claim. Responsive? Yes — it directly answers 'rhetorical purpose.' Specific? Yes — it names both the PURPOSE (forcing confrontation with hypocrisy) and the STRATEGY (the repeated rhetorical question turned on the audience).",
        "NOTICE THE SHARED SHAPE OF CANDIDATE C: purpose + named strategy, in one sentence, phrased as something a reader could push back on.",
        "IDENTIFY WHY A AND B FAIL FOR DIFFERENT REASONS even though both are 'wrong' — A never leaves the level of content; B leaves content but adds nothing specific enough to defend. Naming which trap a weak thesis fell into is itself a diagnostic skill.",
        "CONCLUDE which candidate should be adopted, and state the general rule it demonstrates: purpose + specific strategy, stated arguably.",
      ],
      answer:
        "Candidate C is the defensible thesis. A commits the summary trap (content description, no claim); B commits the vague-evaluation trap (a reaction with no mechanism). C passes all three tests because it names Douglass's purpose (forcing confrontation with hypocrisy) and a specific strategy (the repeated rhetorical question turned on the audience) in a single arguable sentence a reader could reasonably contest.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-thesis-defensible',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.douglass-fourth-of-july.v1, write ONE thesis sentence responding to the prompt: 'What is Douglass's rhetorical purpose in this excerpt, and how does he achieve it?' Your thesis must be arguable (not a fact), responsive to the exact prompt asked, and specific — naming both his purpose AND at least one concrete rhetorical strategy. Avoid all three traps: restatement, vague evaluation, and summary.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      rubric: {
        parts: [
          {
            criterionId: 'thesis',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence that is arguable (a reasonable reader could contest it), responsive (directly answers purpose AND how it's achieved), and specific (names an accurately-described concrete strategy, e.g. the rhetorical question 'What, to the American slave, is your Fourth of July?', direct address to the audience, or a shift in pronoun/tone) tied explicitly to a stated purpose (e.g. confronting the audience with the gap between America's professed ideals and the reality of slavery). Partial credit for a thesis that names purpose but only vaguely gestures at 'how' with no specific strategy, or names a strategy accurately but doesn't tie it to a stated purpose, or is arguable/specific but only partially responsive to the two-part prompt. No credit for a thesis that falls into the restatement trap (rephrasing the prompt), the vague-evaluation trap ('effective,' 'powerful' with no mechanism), or the summary trap (describing content with no claim about the writer's choices).",
            modelResponse:
              "By turning the rhetorical question \"What, to the American slave, is your Fourth of July?\" directly onto his audience, Douglass abandons the role of neutral informer and instead forces listeners who consider themselves free and just to confront their own complicity in a hypocrisy their annual celebration lets them avoid.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-vague-evaluation',
      kind: 'misconception_check',
      question:
        'A student submits this thesis: "Douglass\'s speech is very powerful and uses a lot of strong rhetorical devices to get his point across." Does this thesis pass the defensibility test?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Mistaking a VAGUE EVALUATION — a reaction with no named mechanism — for a defensible, specific claim. This is the single most common way a real, effortful thesis still earns zero credit.',
          correctsTo:
            "No — \"very powerful\" and \"a lot of strong rhetorical devices\" name a reaction and a vague quantity, not a claim. The test: could you defend this sentence with a SPECIFIC piece of evidence, or does it stay true no matter what evidence you bring? As written, almost any evidence from the speech could be used to \"support\" it, which means it isn't specific enough to be arguable in a meaningful way. A fix keeps the reaction but replaces the vagueness with a named purpose and a named strategy: 'Douglass uses the recurring rhetorical question... to force his audience to confront [specific claim].' That version can be disputed and defended; the original can't.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A defensible thesis passes three tests: arguable (a reader could disagree), responsive (answers the exact prompt), and specific (precise enough to defend with particular evidence).',
        "Three traps produce indefensible theses: restatement (rephrasing the prompt), vague evaluation ('powerful,' 'effective' with no mechanism), and summary (describing content, not a claim).",
        "The reliable shape: name the writer's PURPOSE and at least one specific STRATEGY tied to it, in one arguable sentence.",
        "Scope check: a thesis trying to claim everything is too broad to defend in one essay — narrow to a line of reasoning you can actually follow through.",
        "Test your own thesis: could a reader argue the opposite, and could you point to a specific textual moment as proof? If either answer is no, sharpen before writing.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.3',
    cedTitle: 'Writing a Defensible Thesis',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '1',
        note: 'AP English Language and Composition Course and Exam Description, Unit 1 — the three tests of a defensible thesis (arguable, responsive, specific) and the common traps that violate them.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — anchor text for practicing defensible-thesis mechanics.',
      },
    ],
  },
};
