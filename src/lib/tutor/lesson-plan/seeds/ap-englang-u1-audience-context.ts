/**
 * AP English Language & Composition — CED Unit 1.5: Audience and Context.
 *
 * Closes out Unit 1's foundational sequence: after locating the rhetorical
 * situation (1.1), the claim (1.2), writing a defensible thesis about it
 * (1.3), and supporting that thesis with evidence and commentary (1.4),
 * students now need to reckon with a subtler move — a writer's choices only
 * make sense once you know WHO they assume is listening and WHAT that
 * audience already understands. This topic is also the natural home for
 * irony/persona, because irony is IMPOSSIBLE to read without tracking a gap
 * between a surface audience and the writer's true target.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Jonathan Swift, "A Modest Proposal" (1729) —
 * evelyn.passage.swift-modest-proposal.v1. The teaching point is HOW Swift's
 * persona and assumed audience knowledge construct irony, not the shocking
 * literal proposal itself — quotes below are limited to the short, canonical
 * structural phrases already used as the anchor evidence for this passage.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_AUDIENCE_CONTEXT: LessonPlan = {
  id: 'evelyn.ap.englang.audience-context.v1',
  title: 'U1.5 Audience and Context',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.audience-context',
      description:
        "Identify how a writer's assumptions about audience and context shape specific stylistic choices, and recognize when a writer constructs a persona whose stated purpose diverges from the writer's real purpose (irony).",
      standard: 'AP-ENGLANG-1.5',
    },
  ],
  prerequisites: ['apenglang.evidence-commentary'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that the same words can mean opposite things depending on who is assumed to be listening, before naming "persona" or "irony."',
      script:
        "If a friend texts you 'wow, great job' after you trip in the hallway, you don't take it literally — you read it as sarcasm, because you know your friend and the context (you just tripped). Now imagine a stranger who has no idea what just happened reads that same text over your shoulder. They might take it completely at face value: 'wow, great job.' Same words, opposite meaning, depending entirely on what the reader is assumed to know. Writers do this deliberately, on purpose, at essay length. A writer can construct a fictional voice — a persona — that says one thing sincerely on the surface while assuming the REAL audience has enough context to catch what's actually being argued underneath. Today we learn to read for that gap.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-audience-context',
      kind: 'concept',
      goal: "Define audience, context, and persona, and explain how the gap between a surface audience and a true audience produces irony.",
      keyIdeas: [
        "AUDIENCE AWARENESS shapes diction, tone, and structure: a writer makes different choices depending on what they assume their reader already believes, values, or knows.",
        "CONTEXT supplies information the writer assumes the audience already has and therefore does NOT spell out — the historical/social circumstances a text leans on without explanation. Missing the context means missing why certain choices land as they do.",
        "Some writers construct a SURFACE AUDIENCE distinct from their TRUE AUDIENCE. The surface audience is who the text appears to be addressing or reasoning as; the true audience is who the writer is actually trying to move — and they aren't always the same.",
        "PERSONA is a constructed narrating voice that is not identical to the writer's own position. A persona can state a purpose sincerely (on its own terms) while the actual writer's purpose is entirely different — even opposite.",
        "IRONY depends on exactly this gap: the persona's LITERAL claim and the writer's REAL purpose diverge, and the writer is counting on the true audience having enough context to notice the gap rather than take the persona at its word.",
        "A classic construction: an earnest, reasonable-sounding, even statistic-laden setup (mimicking the tone of sincere policy writing) lulls a reader into treating the argument at face value — right up until a detail makes the literal claim impossible to accept sincerely, and the reader is forced to re-read everything before it as ironic.",
        "Recognizing irony is not about spotting one shocking line — it's about noticing that the EARNEST TONE ITSELF was a rhetorical choice, assuming an audience who shares enough context (about the real crisis being addressed) to recognize a monstrous 'solution' as pointed criticism, not sincere policy.",
        "Reading for audience and context, then, means asking: who does this writer assume already understands what's really going on — and is that assumed understanding what turns a literal statement into something else entirely?",
      ],
      vocabulary: [
        { term: 'audience awareness', definition: "how a writer's assumptions about who is reading/listening shape diction, tone, and structure." },
        { term: 'context', definition: 'the historical/social circumstances a text assumes its audience already understands without being told.' },
        { term: 'persona', definition: "a constructed narrating voice, distinct from the writer's own position, that a text speaks through." },
        { term: 'surface audience', definition: 'who a text appears to be addressing or reasoning as, which may differ from the true audience.' },
        { term: 'true audience', definition: 'who the writer is actually trying to move, sometimes distinct from the surface audience.' },
        { term: 'irony', definition: "a gap between a persona's literal claim and the writer's real purpose, legible only to an audience with enough shared context to notice it." },
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-swift-persona',
      kind: 'worked_example',
      problem:
        "Analyze the opening of Jonathan Swift's 1729 pamphlet (evelyn.passage.swift-modest-proposal.v1). The excerpt opens with earnest, statistic-minded concern for Irish poverty ('a very great additional grievance'), methodically weighs the economics of child-rearing, and then pivots to naming a 'young healthy child... a most delicious nourishing and wholesome food.' Explain how audience and context construct the irony here.",
      steps: [
        "IDENTIFY THE ASSUMED CONTEXT. Swift's contemporary readers would have known the real crisis: widespread Irish poverty under English economic policy, and a genre of earnest policy pamphlets proposing 'solutions' to it. The excerpt assumes this shared knowledge without spelling it out.",
        "IDENTIFY THE PERSONA'S SURFACE CLAIM. The narrating voice presents as a sober, public-spirited economic reformer: measured tone, careful arithmetic ('at most not above the value of two shillings'), and a stated concern for 'the whole number of infants' born into poverty.",
        "IDENTIFY THE TURN THAT BREAKS THE SURFACE READING. The persona's earnest, reasonable tone continues UNCHANGED into the proposal that these children be eaten as food — the tonal consistency is exactly what signals irony: no sincere reformer would propose this calmly, so the calm itself becomes the tell.",
        "IDENTIFY THE TRUE AUDIENCE'S ROLE. Swift is not writing for a persona-believing surface audience who would accept this proposal; he assumes his TRUE audience (contemporaries who understand both the real crisis and the genre being mimicked) will recognize the proposal as monstrous and, retroactively, recognize the entire earnest setup as satire targeting indifferent policy-makers, not a sincere solution.",
        "EXPLAIN WHY THE GAP IS THE POINT. If Swift had signaled irony openly from the start, the earnest tone would lose its force — it's precisely the reader's own moment of registering 'wait, this can't be sincere' that indicts the real target: an economic and political culture willing to entertain any calculation-driven 'solution' to poverty except addressing its causes.",
        "STATE THE ANALYTICAL CLAIM this supports: Swift constructs a persona whose calm, reasonable voice never breaks, using his assumed audience's shared context (the real crisis, the genre of earnest reform pamphlets) to turn that unbroken calm itself into the indictment.",
      ],
      answer:
        "Swift constructs an earnest reformer persona whose careful, statistic-driven tone never breaks, even as the proposal turns to describing children as \"a most delicious nourishing and wholesome food.\" Because his true audience shares the context of real Irish poverty and recognizes the genre of sincere policy pamphlets being mimicked, that unbroken calm is what signals irony rather than sincerity — and the reader's own moment of registering the proposal as monstrous becomes the indictment of a political culture willing to calculate around suffering rather than address its causes.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-audience-swift',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.swift-modest-proposal.v1, write ONE sentence identifying a specific stylistic choice Swift makes that depends on his assumed audience's shared context (e.g. the earnest statistical tone, the methodical economic reasoning, or the persona's calm register), AND explain what effect that choice produces once the true purpose becomes clear. Do not simply describe the shocking content — name the choice and its audience-dependent effect.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      rubric: {
        parts: [
          {
            criterionId: 'audience-effect',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence names a specific, accurately-described stylistic choice tied to assumed audience/context (e.g. the earnest economic/statistical tone, the persona's calm and methodical reasoning about cost, or the unbroken register carried straight through the 'delicious nourishing and wholesome food' turn) AND explains the audience-dependent effect this produces — that the persona's unbroken sincerity, recognizable as such only to readers who share the context of the real crisis and the genre being mimicked, is what turns the proposal into an indictment rather than a literal policy suggestion. Partial credit for naming the stylistic choice accurately without explaining the audience-dependent effect, or gesturing at 'irony'/'satire' without identifying a specific choice or connecting it to what the audience must already know. No credit for a sentence that only summarizes or reacts to the shocking content ('Swift says children should be eaten, which is disturbing') with no claim about a stylistic choice or its effect tied to audience/context.",
            modelResponse:
              "By keeping his methodical, statistic-laden reasoning about cost and yield perfectly unbroken as it turns to proposing children as food, Swift relies on readers who already understand both the real crisis of Irish poverty and the genre of earnest reform pamphlets to recognize that unwavering calm — not the shocking proposal alone — as the true signal of satire.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-missing-irony',
      kind: 'misconception_check',
      question:
        'A student writes: "Swift is arguing that poor children should be sold as food to solve overpopulation and poverty." Is this an accurate reading of the passage?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Taking a satirical persona at literal face value — missing that the earnest, calm voice is a constructed persona whose stated position is not the writer\'s real purpose, because the reader lacks (or ignored) the assumed shared context that signals irony.',
          correctsTo:
            "No — this reads Swift's persona's literal claim as if it were Swift's own sincere position. Swift constructs an earnest reformer VOICE whose unbroken, methodical calm — continuing right through a monstrous proposal — is the tell that this is satire, not sincere policy. His REAL purpose is to indict a political and economic culture willing to entertain any calculation-driven 'solution' to poverty except addressing its actual causes. The test: does the writer's tone or genre-signal (an earnest, statistic-heavy reform pamphlet) match the shock of the specific content? When calm, reasonable delivery collides with an unthinkable claim, that collision — not the claim itself — is usually the actual argument, and recognizing it depends on sharing the context the writer assumed the audience already had.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A writer's stylistic choices depend on assumed audience and context — what the writer believes the reader already knows or values shapes diction, tone, and structure.",
        "A surface audience (who a text appears to address) can differ from the true audience (who the writer is actually trying to move).",
        "Persona is a constructed voice distinct from the writer's own position — a persona's stated claim is not automatically the writer's real purpose.",
        "Irony depends on a gap between the persona's literal claim and the writer's real purpose, legible only to readers who share the context the writer assumed.",
        "Reading past irony means asking who the writer assumes already understands what's really going on — and whether that assumed understanding is what turns a literal statement into something else.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.5',
    cedTitle: 'Audience and Context',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '1',
        note: "AP English Language and Composition Course and Exam Description, Unit 1 — audience awareness, context, persona, and how the gap between surface and true audience constructs irony.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.swift-modest-proposal.v1',
        chapter: '1729',
        note: 'Jonathan Swift, "A Modest Proposal" — anchor text for reading a persona\'s constructed irony against assumed audience context.',
      },
    ],
  },
};
