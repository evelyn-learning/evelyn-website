/**
 * AP English Language & Composition — Unit 6 CED 6.4: Analyzing Style in
 * Rhetorical Analysis.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.analyzing-style.v1`). Unit 6's capstone: integrating
 * syntax (6.1), diction/connotation (6.2), and figurative language/schemes
 * (6.3) into one cumulative rhetorical-analysis line of reasoning, tracing
 * how a writer's STYLE choices build cumulatively and often co-escalate with
 * the argument itself.
 *
 * Anchor texts referenced in the method's example: Patrick Henry's "Give Me
 * Liberty or Give Me Death" (1775) and Abraham Lincoln's "The Gettysburg
 * Address" (1863). Quotes are limited to short structural/rhetorical phrases
 * per content-safety guidance.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_ANALYZING_STYLE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.analyzing-style.v1',
  course: 'AP English Language & Composition',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Analyzing Style in Rhetorical Analysis',
  planId: 'evelyn.ap.englang.analyzing-style.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.analyzing-style.v1' }],
  theory: [
    {
      loId: 'apenglang.analyzing-style',
      kind: 'definition',
      title: 'integrated style analysis',
      content:
        'Explaining how multiple style choices (syntax, diction, figurative language) work TOGETHER, at the same moment, to serve one claim about the writer\'s purpose — rather than analyzing syntax, diction, and figurative language in separate, disconnected paragraphs.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'definition',
      title: 'co-escalation',
      content:
        "A writer's style intensifying — sentences shortening, diction intensifying, repetition tightening — in step with the argument's own escalation (concession → pivot → escalation, from 4.4). Style, in a co-escalating passage, reinforces the argument's climb; it does not merely decorate it.",
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'definition',
      title: 'checklist essay',
      content:
        'The trap of analyzing separate devices (one paragraph on syntax, one on diction, one on a metaphor) in isolated silos that never connect to each other or to the essay\'s throughline. A checklist essay catalogs devices; it does not trace an integrated line of reasoning about style.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'framework',
      title: 'integrating style into a line of reasoning',
      content:
        'At each major stage of the argument, ask not only "what is the writer claiming here?" but "what style choices (syntax + diction + figurative language) are doing work at this exact moment, and how do they change as the argument builds?" A strong integrated paragraph names the stage\'s claim, THEN shows a style choice enacting or reinforcing that claim, THEN explains why that choice\'s escalation (compared to earlier or later stages) serves the writer\'s overall purpose.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'strategy',
      title: 'style enacts, not just decorates',
      content:
        'The strongest AP Lang responses don\'t just catalog devices — they show a writer\'s style tightening or shifting in lockstep with the argument\'s stakes, and explain that co-escalation as evidence of deliberate design, not coincidence. Style that stays uniform while the argument grows more urgent would undercut the argument; style that tightens alongside it makes the urgency feel enacted, not merely asserted.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'strategy',
      title: 'pick one moment, name two elements',
      content:
        'The reliable move for an integrated paragraph: choose a single moment in the text and show AT LEAST TWO style elements (syntax + diction, or syntax + a scheme) reinforcing the same claim there — not two separate observations about two different moments.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'strategy',
      title: 'ask what style is doing, not just what is present',
      content:
        'At the capstone level, the operative question shifts from "what devices are present in this passage?" to "what is style DOING at this exact moment, and how does that change as the argument builds?" The first question invites a checklist; the second forces integration, because it can only be answered by connecting style to the argument\'s stage.',
    },
    {
      loId: 'apenglang.analyzing-style',
      kind: 'trap',
      title: 'the deletion test for a checklist essay',
      content:
        'Could you delete any one of several named devices from a sentence without changing its meaning? If yes, the devices were never actually connected — the essay is a checklist (a list of categories), not an integrated line of reasoning. A genuinely integrated claim depends on all the named elements working together.',
    },
  ],
  methods: [
    {
      title: "Trace a writer's style across the argument's arc",
      when_to_use:
        "Use for a capstone rhetorical-analysis essay or paragraph that must connect a writer's syntax, diction, and figurative-language choices to the argument's overall trajectory, rather than treating each as a separate observation.",
      steps: [
        "IDENTIFY THE ARGUMENT'S STAGES — where does the claim start, turn, and climax?",
        'AT EACH STAGE, NAME THE STYLE THAT IS DOING WORK THERE — what is notable about syntax, diction, or figurative language at this specific moment?',
        "TRACK HOW STYLE CHANGES ACROSS STAGES — does syntax tighten, diction intensify, or repetition sharpen as the argument's stakes rise?",
        'NAME THE CO-ESCALATION EXPLICITLY — state that style and argument are moving in the same direction, not merely that both are present.',
        'EXPLAIN WHY THE INTEGRATION (not any one device alone) IS THE STRONGEST EVIDENCE OF DESIGN — what would be lost if style had stayed uniform while the claim intensified?',
        'STATE THE INTEGRATED ANALYTICAL CLAIM — one sentence naming how style reinforces (not merely accompanies) the argument.',
      ],
      example: {
        problem:
          "Trace how Henry's STYLE — not just his claims — escalates across the speech, from the opening's measured, metaphor-laden sentence through the closing rhetorical-question burst, and connect that stylistic escalation to the argument's overall arc toward \"we must fight.\"",
        solution:
          "Henry's style co-escalates with his argument: the opening's long, metaphor-laden sentence (\"the illusions of hope,\" \"the song of that siren\") matches an audience still comfortable enough to deliberate; the climactic repetition (\"we must fight! I repeat it, sir, we must fight!\") tightens the syntax into a hammering single clause as the argument turns; and the closing burst of short exclamations and questions (\"The war is actually begun!... Why stand we here idle?\") mirrors the argument's final urgency. Because style and claim escalate together rather than separately, the growing urgency isn't merely asserted — it is enacted at the level of the sentence itself.",
      },
      relatedLoIds: ['apenglang.analyzing-style'],
    },
  ],
  pointers: [
    { content: 'A full essay shows multiple style choices (syntax, diction, figurative language) working TOGETHER at the same moment — not analyzed in separate silos.', kind: 'tip' },
    { content: 'Style often co-escalates with argument: as claims build toward their climax, syntax can tighten and diction can intensify in the same direction.', kind: 'tip' },
    { content: 'The checklist-essay trap: naming syntax, diction, and figurative language as separate observations that never connect to each other or to the overall purpose.', kind: 'trap' },
    { content: 'Deletion test: could you remove one of several named devices without changing the sentence\'s meaning? If yes, they were never integrated.', kind: 'trap' },
    { content: 'Pick ONE moment in the text and show at least two style elements reinforcing the same claim there — a stronger move than surveying the whole passage thinly.', kind: 'tip' },
    { content: 'Treat a writer\'s style tightening in lockstep with the argument\'s stakes as evidence of deliberate design, not decoration.', kind: 'tip' },
  ],
};
