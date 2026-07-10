/**
 * AP English Language & Composition — Unit 4 CED 4.1: Methods of
 * Development.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.methods-of-development.v1`). Covers the six common
 * methods writers use to develop an idea across a passage — narration,
 * cause-effect, comparison-contrast, definition, exemplification,
 * description — and the analytical move of tying the CHOICE of method to
 * the writer's purpose rather than merely labeling it.
 *
 * Anchor texts referenced in the method's example: Lincoln's Gettysburg
 * Address (cause-effect chain) and Swift's "A Modest Proposal" (generalized
 * exemplification). Quotes are limited to short structural phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_METHODS_OF_DEVELOPMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.methods-of-development.v1',
  course: 'AP English Language',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Methods of Development',
  planId: 'evelyn.ap.englang.methods-of-development.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.methods-of-development.v1' }],
  theory: [
    {
      loId: 'apenglang.methods-of-development',
      kind: 'definition',
      title: 'method of development',
      content:
        "The organizing strategy a writer uses to build out and support an idea within a passage — it answers *how is this point being unpacked?*, not just *what is the point?* The six common methods are narration, cause-effect, comparison-contrast, definition, exemplification, and description.",
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'definition',
      title: 'cause-effect',
      content:
        'Develops an idea by tracing a chain: this condition produced that consequence. It is especially persuasive because it makes an outcome feel inevitable rather than merely asserted — the reader experiences the conclusion as a logical necessity, not a request.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'definition',
      title: 'comparison-contrast',
      content:
        'Develops an idea by placing two things side by side — showing what one is by measuring it against another. It can work by similarity ("this is LIKE that") or by opposition ("this is UNLIKE that," or better/worse than that).',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'framework',
      title: 'the six methods at a glance',
      content:
        'NARRATION develops an idea through a sequence of events told in time — a story or anecdote that makes an abstract point concrete and felt rather than merely asserted. DEFINITION pins down what a key term actually means, often redefining a familiar word on the writer\'s own terms so the rest of the argument can build on that redefinition. EXEMPLIFICATION develops an idea through specific instances — one vivid case, or a short list of them, that makes an abstract claim concrete and harder to dismiss. DESCRIPTION develops an idea through vivid sensory or physical detail, making a reader see, hear, or feel a scene so the point is absorbed rather than stated.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'strategy',
      title: 'find the dominant method, not just any method',
      content:
        'A single passage often BLENDS methods — a paragraph can open with an anecdote and close with a comparison. Skilled rhetorical analysis identifies the DOMINANT method in a given stretch rather than listing every device that appears, then asks why THIS method, for THIS audience, serves THIS purpose.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'framework',
      title: 'each method produces a characteristic effect',
      content:
        'Narrative makes an idea felt; definition makes it precise; comparison makes it relative to something the reader already understands; cause-effect makes it feel inevitable; exemplification makes the abstract concrete and repeatable; description makes it immersive. Matching effect to purpose is the actual analytical payoff of naming a method.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'trap',
      title: 'labeling vs. analyzing a method',
      content:
        'Naming a method ("this paragraph uses comparison-contrast") without explaining its effect is observation, not analysis — the methods-of-development equivalent of quoting evidence with no commentary. Test: would this sentence be equally true of a hundred unrelated passages that happen to use the same method? If so, it is a label, not analysis.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'rhetorical-device',
      title: "the choice of method is itself a rhetorical move",
      content:
        'A writer had other available methods and picked this one — the choice is never neutral. Tying that choice back to the rhetorical situation (purpose, audience) and to the evidence-and-commentary discipline (naming the specific device and its effect) turns a structural label into real analysis.',
    },
    {
      loId: 'apenglang.methods-of-development',
      kind: 'strategy',
      title: 'exemplification vs. a single anecdote',
      content:
        "Don't confuse a single vivid narrated anecdote (narration) with the accumulation of several generalized instances (exemplification). Piling up repeatable, general cases rather than telling one sympathetic story can make a problem look systemic and quantifiable rather than personal — a very different effect from narration's emotional immediacy.",
    },
  ],
  methods: [
    {
      title: 'Identify and justify a dominant method of development',
      when_to_use:
        'Use when asked to analyze HOW a writer develops an idea across a passage or stretch of text, before making any claim about effectiveness.',
      steps: [
        'READ FOR THE SHAPE, NOT JUST THE CONTENT — notice whether the passage builds a chain, tells a story, compares two things, defines a term, piles up examples, or paints a scene.',
        'NAME THE CANDIDATE METHODS — list every method that plausibly appears, even briefly.',
        'TEST EACH CLAIM AGAINST THE TEXT — find the specific wording (a repeated "that" clause, a string of concrete instances, a defining restatement) that confirms which method is DOMINANT across the stretch, not just present in one sentence.',
        'EXPLAIN HOW THE METHOD WORKS ON THE AUDIENCE — describe the mechanism: what effect does this specific method produce for a reader (felt, inevitable, concrete, precise, relative, immersive)?',
        "EXPLAIN WHY THIS SERVES THE WRITER'S PURPOSE — tie the effect back to the rhetorical situation: why does this method serve this purpose for this audience better than an available alternative would?",
      ],
      example: {
        problem:
          "Identify the dominant method of development in the closing movement of Lincoln's Gettysburg Address, where Lincoln moves from \"we can not dedicate ... this ground\" through \"the great task remaining before us\" to \"a new birth of freedom,\" and explain why that method serves his purpose.",
        solution:
          "The dominant method in Lincoln's closing is cause-effect: the soldiers' sacrifice (\"the last full measure of devotion\") is presented as the cause that obligates the living's response (\"increased devotion\"), which in turn must cause the nation's survival and \"new birth of freedom.\" By making the audience's duty feel like the inevitable consequence of a debt already incurred by the dead, rather than a fresh request, Lincoln makes rededication to the war feel less like a choice and more like an obligation already set in motion — serving his purpose of rallying a war-weary audience.",
      },
      relatedLoIds: ['apenglang.methods-of-development'],
    },
  ],
  pointers: [
    { content: 'Six methods: narration, cause-effect, comparison-contrast, definition, exemplification, description — each answers "how is this idea being unpacked?"', kind: 'tip' },
    { content: 'Passages often blend methods — identify the DOMINANT one in a given stretch, not just any that appears.', kind: 'tip' },
    { content: 'Naming a method ("this uses comparison-contrast") without explaining its effect is observation, not analysis — the same trap as quote-and-drop.', kind: 'trap' },
    { content: 'Test: would this sentence be equally true of a hundred unrelated passages using the same method? If so, tie it to THIS text\'s specific purpose.', kind: 'trap' },
    { content: 'Cause-effect makes an outcome feel inevitable; comparison-contrast makes something felt relative; exemplification makes the abstract concrete; definition fixes a term on the writer\'s terms.', kind: 'tip' },
    { content: "Don't confuse a single vivid anecdote (narration) with generalized exemplification (piling up several instances) — they produce very different effects.", kind: 'trap' },
  ],
};
