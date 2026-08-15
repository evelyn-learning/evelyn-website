/**
 * AP English Language & Composition — Unit 1 CED 1.3: Writing a Defensible
 * Thesis.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.defensible-thesis.v1`). Covers the three tests a
 * defensible thesis must pass (arguable, responsive, specific) and the three
 * traps that produce an indefensible one (restatement, vague evaluation,
 * summary) — Row A of the real AP Lang rubric.
 *
 * Anchor text referenced in the method's example: Frederick Douglass, "What
 * to the Slave Is the Fourth of July?" (1852). Quotes are limited to the
 * short structural/rhetorical-question phrases used in the calibration plan.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_DEFENSIBLE_THESIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.defensible-thesis.v1',
  course: 'AP English Language & Composition',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Writing a Defensible Thesis',
  planId: 'evelyn.ap.englang.defensible-thesis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.defensible-thesis.v1' }],
  theory: [
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'definition',
      title: 'defensible thesis',
      content:
        "An arguable, responsive, specific claim about a text's rhetorical choices that an essay is built to prove. It is the single line every AP Lang essay is graded on first.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'framework',
      title: 'the three tests',
      content:
        "A defensible thesis passes three tests. **Arguable** — a reasonable reader could disagree. **Responsive** — it actually answers the specific prompt asked, not an adjacent one. **Specific** — precise enough to be defended with particular evidence, not so broad it could apply to almost any text.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'definition',
      title: 'restatement trap',
      content:
        'Rephrasing the prompt\'s own wording back as if it were a claim (e.g. "This passage shows Douglass using rhetoric to make his point"). Nothing has been asserted that the prompt didn\'t already say.',
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'definition',
      title: 'vague evaluation',
      content:
        'A judgment with no specific content behind it (e.g. "Douglass\'s speech is very effective and persuasive"). Effective HOW? Persuasive to WHOM, by WHAT means? It sounds like an opinion but gives the writer nothing concrete to defend.',
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'trap',
      title: 'the summary trap',
      content:
        "Describing content instead of asserting a claim about the writer's choices (e.g. \"Douglass talks about the difference between what Independence Day means to free people and enslaved people\"). This could be true of the text without the writer ever having made an argument about it.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'strategy',
      title: 'the reliable shape: purpose + strategy',
      content:
        "A reliable defensible thesis usually does two things at once: names the writer's PURPOSE (what they want the text to do) and names at least one specific STRATEGY or rhetorical choice tied to that purpose. Naming both is what makes the sentence arguable AND specific enough to defend.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'definition',
      title: 'scope',
      content:
        "How broad or narrow a thesis's claim is. A thesis trying to claim everything about a text (\"Douglass uses many rhetorical strategies to argue many things\") is too broad to defend in the space of one essay. A strong thesis narrows to a line of reasoning the writer can actually follow through.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'framework',
      title: 'a thesis predicts its evidence',
      content:
        "A thesis is not required to list every piece of evidence up front — it needs to make a claim specific enough that the reader can predict roughly what kind of evidence would support it.",
    },
    {
      loId: 'apenglang.defensible-thesis',
      kind: 'strategy',
      title: 'testing your own thesis',
      content:
        "Ask two questions of any thesis you write: could someone reasonably argue the opposite? Could you point to a specific moment in the text as proof? If either answer is no, sharpen the thesis before starting the essay.",
    },
  ],
  methods: [
    {
      title: 'Build a defensible thesis',
      when_to_use:
        "Use after locating the writer's claim (1.2), when drafting the opening line of a rhetorical-analysis response.",
      steps: [
        'DRAFT A CANDIDATE THESIS responding to the exact prompt asked.',
        'TEST AGAINST "ARGUABLE" — could a reasonable reader disagree? If the sentence is just true by definition or restates content, it fails.',
        'TEST AGAINST "RESPONSIVE" — does it actually answer the specific prompt, not an adjacent question?',
        'TEST AGAINST "SPECIFIC" — does it name both the writer\'s PURPOSE and at least one concrete STRATEGY tied to that purpose?',
        'CHECK FOR THE THREE TRAPS — restatement (rephrasing the prompt), vague evaluation ("effective," "powerful" with no mechanism), and summary (describing content, no claim).',
        'CHECK SCOPE — narrow the claim to a line of reasoning you can actually follow through in one essay, not "many strategies, many things."',
      ],
      example: {
        problem:
          "Triage three candidate theses for the prompt \"Write a thesis that responds to Douglass's rhetorical purpose in the excerpt.\" A: \"Douglass's speech is about the meaning of the Fourth of July for enslaved people.\" B: \"Douglass's speech is extremely powerful and moving.\" C: \"By repeatedly turning his rhetorical question on his audience, Douglass forces listeners who see themselves as free and just to confront their complicity in a hypocrisy they had been able to ignore.\"",
        solution:
          "Candidate C is the defensible thesis. A commits the summary trap (content description, no claim). B commits the vague-evaluation trap (a reaction with no mechanism). C passes all three tests because it names Douglass's purpose (forcing confrontation with hypocrisy) and a specific strategy (the repeated rhetorical question turned on the audience) in a single arguable sentence a reader could reasonably contest.",
      },
      relatedLoIds: ['apenglang.defensible-thesis'],
    },
  ],
  pointers: [
    { content: 'Three tests: arguable, responsive, specific. Three traps: restatement, vague evaluation, summary.', kind: 'tip' },
    { content: 'The reliable shape: name the writer\'s PURPOSE and one specific STRATEGY tied to it, in one sentence.', kind: 'tip' },
    { content: '"Effective" and "powerful" are vague-evaluation red flags — ask "effective HOW?" before submitting a thesis.', kind: 'trap' },
    { content: 'A thesis that could apply to almost any text on the exam is too broad — narrow it to a specific strategy.', kind: 'trap' },
    { content: 'Self-test: could a reader argue the opposite, and could you point to a specific textual moment as proof? If either is no, sharpen it.', kind: 'tip' },
  ],
};
