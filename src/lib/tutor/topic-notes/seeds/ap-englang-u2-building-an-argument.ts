/**
 * AP English Language & Composition — Unit 2 CED 2.1: Building an
 * Argument.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.building-an-argument.v1`). Covers the pivot from
 * judging someone else's rhetorical choices (Unit 1) to constructing an
 * original, defensible position on a real-world issue — Row A of the
 * Argument-essay rubric.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775), used as a model of a specific, arguable,
 * well-scoped position. Quotes are limited to short structural phrases
 * already used elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_BUILDING_AN_ARGUMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.building-an-argument.v1',
  course: 'AP English Language',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Building an Argument',
  planId: 'evelyn.ap.englang.building-an-argument.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.building-an-argument.v1' }],
  theory: [
    {
      loId: 'apenglang.building-an-argument',
      kind: 'definition',
      title: 'argumentative claim (position)',
      content:
        'The arguable stance YOUR essay will defend on a real-world issue — not a claim about someone else\'s text. Starting this unit, the student stops analyzing a stranger\'s rhetorical choices (Unit 1) and starts constructing an original case of their own.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'definition',
      title: 'issue',
      content:
        'The real-world question or controversy a position is taken on. Most issues arrive too broad to defend in one essay ("Should schools care about sleep?") and must be narrowed ("Should high schools push start times to 8:30 a.m. or later?") before a position can actually be built and defended.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'definition',
      title: 'live counter-position',
      content:
        'A reasonable, informed person could actually hold the opposite view for real reasons — not a straw man. Without a genuine live counter-position, a sentence is a preference ("bullying is bad"), not an argumentative claim ("schools should adopt this specific anti-bullying policy over that one").',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'framework',
      title: 'the three tests, carried over from 1.3',
      content:
        'A defensible position passes the same three tests as a text-analysis thesis — ARGUABLE (a reasonable person could disagree), RESPONSIVE (answers the actual issue/prompt, not a nearby one), SPECIFIC (commits to a concrete stance, not a vague feeling). "Responsive" now means responsive to the ISSUE you were given, not to a passage.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'framework',
      title: 'scope',
      content:
        'How broad or narrow a position\'s claim is. Scope must be narrow enough that a reader could push back on it point by point — "do something about X" is too broad; committing to a specific, stated action or judgment is scoped correctly.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'strategy',
      title: 'a working thesis previews its reasons',
      content:
        'A strong position often plants the seed of the reasons to come, without spelling all of them out yet — that is what separates a position from a bare opinion. "Schools should push start times later BECAUSE teenage sleep science makes early starts counterproductive" previews a reasoning path; the same sentence without "because" does not.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'strategy',
      title: 'appeals become deliberate choices',
      content:
        'Ethos, pathos, and logos — which Unit 1 trained the student to IDENTIFY in someone else\'s writing — now become tools the student chooses deliberately: which appeal does this specific issue and audience most need? A position defended mostly with data needs different framing than one leaning on a moral appeal.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'trap',
      title: 'the restatement trap',
      content:
        'Announcing a topic and a structure ("This essay will look at the pros and cons of school start times") instead of taking a stance. Nobody could disagree with a plan to discuss something — no position has actually been taken yet.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'trap',
      title: 'the vague-evaluation trap',
      content:
        '"Later start times would be a really positive change" names a feeling, not a defensible claim — positive HOW, compared to WHAT cost? It sounds like a stance but gives the essay nothing concrete to defend.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'trap',
      title: 'preference vs. claim',
      content:
        'A first-person feeling ("I think school should start later because mornings are hard for teenagers") is a personal preference with no specific, defensible mechanism — the argument-writing version of the vague-evaluation trap. Test: would the sentence give a reader something specific to push back against? "Mornings are hard" invites "so what, mornings are hard for everyone"; naming the actual mechanism ("chronic sleep deprivation measurably impairs teenage attention and safety") gives the reader something to agree or disagree with.',
    },
    {
      loId: 'apenglang.building-an-argument',
      kind: 'rhetorical-device',
      title: 'Henry\'s claim as a model',
      content:
        'Patrick Henry\'s climactic claim — that armed resistance was no longer one option among several but the only remaining course — models the shape a defensible position needs: specific, arguable, responsive to the exact question the Convention faced, and previewing the reasoning (petitions failed, delay only weakens) still to come.',
    },
  ],
  methods: [
    {
      title: 'Triage candidate positions and draft a defensible one',
      when_to_use:
        'Use when several possible thesis sentences are on the table for an original argument and the strongest, most defensible one needs to be identified before drafting begins.',
      steps: [
        'TEST EACH CANDIDATE AGAINST "ARGUABLE." Does it announce a topic or structure with no stance taken (the restatement trap)?',
        'TEST EACH CANDIDATE AGAINST "SPECIFIC." Does it name a feeling or vague evaluation instead of a concrete, defensible claim (the vague-evaluation trap)?',
        'TEST THE STRONGEST CANDIDATE AGAINST "RESPONSIVE." Does it directly answer the exact issue or prompt given, not a nearby or broader one?',
        'CHECK THE "LIVE COUNTER-POSITION" TEST. Could an informed person genuinely argue the opposite for real reasons?',
        'VERIFY IT PREVIEWS REASONING. Does the sentence hint at the reasons that will carry the essay, without fully unpacking them yet?',
        'ADOPT THE CANDIDATE THAT PASSES ALL FOUR CHECKS and state why the others failed.',
      ],
      example: {
        problem:
          "Three candidate positions are proposed for the issue 'Should high schools push start times to 8:30 a.m. or later?' A: 'This essay will look at the pros and cons of school start times.' B: 'Later start times would be a really positive change for students.' C: 'Because chronic sleep deprivation measurably impairs teenagers’ attention, mood, and driving safety, high schools should push start times to 8:30 a.m. or later, even if that requires adjusting athletics and bus schedules.' Triage all three.",
        solution:
          "A commits the restatement trap (no stance taken); B commits the vague-evaluation trap (a feeling, not a claim). C passes all three tests, commits to a specific action, survives a genuine counter-position (an informed adult could argue that shifting times creates unworkable transportation and athletics conflicts), and previews the reasoning (sleep science) to come — C is the defensible position to adopt.",
      },
      relatedLoIds: ['apenglang.building-an-argument'],
    },
  ],
  pointers: [
    { content: 'A defensible position passes the same three tests as a Unit 1 thesis — arguable, responsive, specific — but responds to a real-world issue, not someone else\'s text.', kind: 'tip' },
    { content: 'Narrow the issue before taking a position: broad issues can’t be defended in the space of one essay.', kind: 'tip' },
    { content: 'If no reasonable person could disagree, it’s a preference, not a claim — check for a genuine live counter-position.', kind: 'trap' },
    { content: 'A strong position previews (without fully unpacking) the reasoning that will carry the essay.', kind: 'tip' },
    { content: 'Watch for the restatement trap (announcing a topic) and the vague-evaluation trap ("this would be good") — both give the essay nothing concrete to defend.', kind: 'trap' },
    { content: '"I think ___ because mornings are hard" is a feeling, not a claim — name the actual mechanism instead.', kind: 'trap' },
  ],
};
