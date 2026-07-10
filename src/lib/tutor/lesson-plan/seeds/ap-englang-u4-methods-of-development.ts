/**
 * AP English Language & Composition — CED Unit 4.1: Methods of Development.
 *
 * Builds on Unit 1's rhetorical situation and evidence-commentary work: once
 * a student can name a writer's purpose and support a claim with evidence,
 * this topic teaches that writers also choose HOW to develop an idea across
 * a passage — narration, cause-effect, comparison-contrast, definition,
 * exemplification, description — and that the CHOICE of method is itself a
 * rhetorical move worth analyzing, not just a structural label to spot.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself MICRO grain here:
 * responseFormat 'free', single-part rubric).
 *
 * Anchor text: Lincoln's Gettysburg Address —
 * evelyn.passage.lincoln-gettysburg.v1 — whose brief span compresses
 * several methods (definition-by-restatement of the nation's founding
 * proposition, comparison of "we cannot do X" against what the dead
 * already did, and the escalating cause-effect push toward "a new birth
 * of freedom"). Quotes below are limited to short structural phrases.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U4_METHODS_OF_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.ap.englang.methods-of-development.v1',
  title: 'U4.1 Methods of Development',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.methods-of-development',
      description:
        "Identify the method(s) a writer uses to develop an idea (narration, cause-effect, comparison-contrast, definition, exemplification, description) and explain why that specific method — rather than another available one — serves the writer's purpose.",
      standard: 'AP-ENGLANG-4.1',
    },
  ],
  prerequisites: ['apenglang.rhetorical-situation', 'apenglang.evidence-commentary'],
  followUps: ['apenglang.intros-conclusions-analysis', 'apenglang.diction-and-tone'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that the SAME idea could be developed several different ways, and that picking one is itself a choice, before naming any methods.',
      script:
        "Suppose you want to convince a friend that a certain restaurant is worth the drive. You could TELL A STORY about the one meal that changed your mind (narration). You could COMPARE it to a place they already love (comparison-contrast). You could walk through what happens when you don't go — you settle for something worse (cause-effect). You could just DESCRIBE the food in vivid detail (description). All four could support the exact same claim — but they'd land differently, and a persuasive writer doesn't pick one at random. Every paragraph you've ever read that developed an idea was built using one of a handful of these methods. Today we name them, and — more importantly — learn to ask why a writer picked THIS one instead of another that was just as available.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-methods-of-development',
      kind: 'concept',
      goal: 'Name the six common methods of development and establish that analyzing the CHOICE of method (not just labeling it) is the actual skill.',
      keyIdeas: [
        "A METHOD OF DEVELOPMENT is the organizing strategy a writer uses to build out and support an idea within a passage — it answers 'how is this point being unpacked?', not just 'what is the point?'",
        "NARRATION develops an idea through a sequence of events told in time — a story or anecdote that makes an abstract point concrete and felt rather than merely asserted.",
        "CAUSE-EFFECT develops an idea by tracing a chain: this condition produced that consequence. It's especially persuasive because it makes an outcome feel inevitable rather than merely asserted.",
        "COMPARISON-CONTRAST develops an idea by placing two things side by side — showing what one is by measuring it against another. It can work by similarity (this is LIKE that) or by opposition (this is UNLIKE that, or better/worse than that).",
        "DEFINITION develops an idea by pinning down what a key term or concept actually means — often redefining a familiar word on the writer's own terms so the rest of the argument can build on that redefinition.",
        "EXEMPLIFICATION develops an idea through specific instances or examples — one vivid, well-chosen case (or a short list of them) that makes an abstract claim concrete and harder to dismiss.",
        "DESCRIPTION develops an idea through vivid sensory or physical detail — making a reader see, hear, or feel a scene so the point is absorbed rather than merely stated.",
        "A single passage often BLENDS methods — but skilled rhetorical analysis identifies the DOMINANT method in a given stretch and asks: why THIS method, for THIS audience, to serve THIS purpose? A narrative makes an idea felt; a definition makes it precise; a comparison makes it relative; cause-effect makes it feel inevitable.",
        "The trap to avoid: naming the method ('this paragraph uses comparison-contrast') without explaining its EFFECT. Naming a method is observation; explaining why it was the right choice for the writer's purpose is analysis — the same distinction as naming a device without commentary.",
      ],
      vocabulary: [
        { term: 'method of development', definition: 'the organizing strategy (narration, cause-effect, comparison-contrast, definition, exemplification, description) a writer uses to build out an idea.' },
        { term: 'narration', definition: 'developing an idea through a sequence of events told across time.' },
        { term: 'cause-effect', definition: 'developing an idea by tracing a condition to its consequence, making an outcome feel inevitable.' },
        { term: 'comparison-contrast', definition: 'developing an idea by placing two things side by side to reveal similarity or difference.' },
        { term: 'definition', definition: "developing an idea by pinning down (often redefining) what a key term means on the writer's terms." },
        { term: 'exemplification', definition: 'developing an idea through specific, well-chosen instances that make an abstract claim concrete.' },
        { term: 'description', definition: 'developing an idea through vivid sensory or physical detail that makes a scene or point felt rather than stated.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lincoln-methods',
      kind: 'worked_example',
      problem:
        "Identify the dominant method of development in the closing movement of Lincoln's Gettysburg Address (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1), where Lincoln moves from 'we can not dedicate ... this ground' through 'the great task remaining before us' to 'a new birth of freedom,' and explain why that method serves his purpose.",
      steps: [
        "READ FOR THE SHAPE, NOT JUST THE CONTENT. Lincoln does not simply describe the battlefield or narrate the battle. He builds a chain: what the soldiers already did (consecrated the ground by dying) leads to what that requires of the living (increased devotion) leads to what that devotion must produce (the nation's survival and 'a new birth of freedom').",
        "NAME THE CANDIDATE METHODS. Comparison-contrast is present (the living's 'poor power to add or detract' set against the dead's far greater consecration). But the dominant shape across the whole passage is a CAUSE-EFFECT chain: because the dead gave 'the last full measure of devotion,' the living therefore owe 'increased devotion,' which in turn must produce the nation's 'new birth of freedom.'",
        "TEST THE CLAIM AGAINST THE TEXT. Each clause is joined by 'that' clauses building consequence upon consequence: 'that from these honored dead we take increased devotion ... that we here highly resolve ... that this nation ... shall have a new birth of freedom.' This is a chain of entailment, not a simple list or a single comparison — confirming cause-effect as dominant.",
        "EXPLAIN HOW THE METHOD WORKS ON THE AUDIENCE. By presenting the nation's survival as the logical CONSEQUENCE of the soldiers' sacrifice rather than as a separate request, Lincoln makes continuing the war feel like an obligation already set in motion by the dead, not a new choice the living are merely being asked to make.",
        "EXPLAIN WHY THIS SERVES LINCOLN'S PURPOSE (tie back to rhetorical situation). His purpose is to rededicate a war-weary audience to an unfinished, costly war. A cause-effect chain that makes their duty feel like an inevitable consequence of a debt already owed serves that purpose far more powerfully than simply asserting 'you should keep fighting' would.",
      ],
      answer:
        "The dominant method in Lincoln's closing is cause-effect: the soldiers' sacrifice ('the last full measure of devotion') is presented as the cause that obligates the living's response ('increased devotion'), which in turn must cause the nation's survival and 'new birth of freedom.' By making the audience's duty feel like the inevitable consequence of a debt already incurred by the dead, rather than a fresh request, Lincoln makes rededication to the war feel less like a choice and more like an obligation already set in motion — serving his purpose of rallying a war-weary audience.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-method-swift',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.swift-modest-proposal.v1, write ONE sentence identifying the dominant method of development Swift uses in the opening paragraphs (before the ironic proposal itself) to establish the problem of poverty and abandoned children, AND explain in that same sentence why that method — rather than, say, a single dramatic anecdote — serves his rhetorical purpose. Do not just name the method; state its effect.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      rubric: {
        parts: [
          {
            criterionId: 'method-and-effect',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): correctly identifies the dominant method as exemplification/cataloguing of generalized instances blended with quasi-statistical description (e.g. 'streets, roads, and cabbin-doors crowded with beggars ... followed by three, four, or six children,' the fates of thieves, soldiers for the Pretender, or being sold to the Barbadoes) rather than a single narrated anecdote, AND explains WHY that accumulation of general instances (rather than one dramatized story) serves Swift's purpose — it makes the problem look widespread, systemic, and quantifiable, priming the reader to accept a coldly 'rational,' large-scale (and, in the essay's satiric turn, monstrous) solution rather than a sentimental one. Partial credit (2-4) for correctly naming the method without explaining the effect, or a plausible effect without correctly identifying the method. No credit (0) for calling this narration/a single story, or for a response that only summarizes what the paragraph says with no claim about the method's effect.",
            modelResponse:
              "Swift develops the opening not through a single dramatized anecdote but through generalized exemplification — the mothers 'followed by three, four, or six children,' the children who 'turn thieves' or are 'sold to the Barbadoes' — because piling up general, repeatable instances rather than one sympathetic story makes the problem look systemic and quantifiable, priming readers to accept the pose of a coldly rational, large-scale 'solution' rather than a sentimental appeal.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-labeling-vs-analyzing-method',
      kind: 'misconception_check',
      question:
        'A student writes: "In this passage, the writer uses comparison-contrast to develop the idea." Is this a complete rhetorical-analysis observation about method of development?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating the NAME of a method of development as if naming it were the analysis — the methods-of-development equivalent of 'listing a device without explaining its effect.'",
          correctsTo:
            "No — naming the method is only the first half. A complete observation says what the method IS in this passage (what specifically is being compared, or narrated, or defined), and then explains WHY that method serves the writer's purpose better than an available alternative would have. The test: could this sentence be true of a hundred different unrelated passages that all happen to use comparison-contrast? If so, it's a label, not analysis — you have to tie the method to THIS writer's specific purpose and THIS specific effect on THIS audience.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Six common methods of development: narration, cause-effect, comparison-contrast, definition, exemplification, description — each answers 'how is this idea being unpacked?'",
        'Passages often blend methods, but identify the DOMINANT method in a given stretch and ask why that one, not an available alternative.',
        'Cause-effect makes an outcome feel inevitable; comparison-contrast makes something felt relative to something else; exemplification makes the abstract concrete; definition fixes a term on the writer\'s own terms.',
        "Naming a method is observation, not analysis — always follow it with WHY that method serves the writer's purpose for this audience.",
        'The test for real analysis: would your sentence be equally true of a hundred unrelated passages? If so, tie it to THIS text\'s specific purpose and effect.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.1',
    cedTitle: 'Methods of Development',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '4',
        note: 'AP English Language and Composition Course and Exam Description, Unit 4 — methods of development (narration, cause-effect, comparison-contrast, definition, exemplification, description) and analyzing the choice of method.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — anchor text for the cause-effect chain in the closing movement.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.swift-modest-proposal.v1',
        chapter: '1729',
        note: 'Jonathan Swift, "A Modest Proposal" — practice text for exemplification in the opening paragraphs.',
      },
    ],
  },
};
