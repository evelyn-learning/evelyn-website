/**
 * AP English Language & Composition — CED Unit 4.4: Analyzing a Line of
 * Reasoning.
 *
 * The capstone topic of Unit 4: having learned to analyze a single method
 * of development (4.1), a single frame-setting move (4.2), and a single
 * tonal choice (4.3), students now zoom out to trace how a writer's claims
 * BUILD across an entire text — each claim functioning as a premise or
 * warrant for the next — rather than reading a passage as a list of
 * disconnected clever moves.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself PARAGRAPH grain
 * here: responseFormat 'free', rubric = evidence(3) + commentary(3), same
 * shape as U1.4 / U4.3).
 *
 * Anchor text for the concept/worked example: Frederick Douglass's "What
 * to the Slave Is the Fourth of July?" — evelyn.passage.douglass-fourth-
 * of-july.v1 — whose four paragraphs build a clear cumulative arc (opening
 * question → hypothetical concession → the turn "this Fourth of July is
 * yours, not mine" → the climactic indictment). Try-yourself uses
 * Lincoln's Gettysburg Address — evelyn.passage.lincoln-gettysburg.v1 —
 * for its own cumulative chain. Quotes are limited to short structural/
 * rhetorical-question phrases, per content-safety guidance.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U4_ANALYZING_LINE_OF_REASONING: LessonPlan = {
  id: 'evelyn.ap.englang.analyzing-line-of-reasoning.v1',
  title: 'U4.4 Analyzing a Line of Reasoning',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.analyzing-line-of-reasoning',
      description:
        "Trace how a writer's claims build cumulatively across a whole text — each claim serving as a premise or warrant for the next — and explain how that overall arc, not just any single move, serves the writer's purpose.",
      standard: 'AP-ENGLANG-4.4',
    },
  ],
  prerequisites: ['apenglang.methods-of-development', 'apenglang.diction-and-tone', 'apenglang.audience-context'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between a list of clever moves and an argument that BUILDS, before naming "line of reasoning."',
      script:
        "Picture a lawyer's closing argument. If they just said five unrelated clever things — a joke, a fact, a metaphor, another fact, a plea — in any order, it wouldn't add up to a case. What makes it a CASE is that each point sets up the next: this fact establishes motive, which makes this second fact more damning, which makes the plea at the end feel earned rather than random. Swap the order and the whole thing falls apart. Every strong piece of rhetoric works the same way — it's not a bag of rhetorical devices, it's a STRUCTURE where each claim leans on the one before it. Today we stop analyzing texts one clever move at a time and start tracing the whole chain — the writer's LINE OF REASONING.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-line-of-reasoning',
      kind: 'concept',
      goal: 'Define line of reasoning as a cumulative chain of claims, distinguish it from a list of isolated observations, and give a method for tracing it.',
      keyIdeas: [
        "A LINE OF REASONING is the logical chain a writer builds across a whole text — a sequence of claims where each one functions as a premise, warrant, or stepping stone that the NEXT claim depends on, culminating in the writer's overall purpose.",
        "This is different from a list of isolated rhetorical observations ('here's an appeal to pathos, here's a metaphor, here's a rhetorical question') — those can all be true and still miss the point if you don't show how they connect to and BUILD on each other in sequence.",
        "To trace a line of reasoning: break the text into its major stages (often paragraph by paragraph, or move by move), state the CLAIM each stage is making in one clause, and then ask what LOGICAL RELATIONSHIP connects each stage to the next — does it concede, then pivot? Does it escalate? Does it use an early claim as the necessary foundation for a later, bigger one?",
        "Watch for the connective tissue: transition words and structural pivots ('but,' 'yet,' 'therefore,' a paragraph that suddenly shifts pronoun or address) often mark the JOINTS of a line of reasoning — where one claim hands off to the next.",
        "A common and powerful shape: CONCESSION → TURN → ESCALATION. The writer grants something (often what the audience already believes or hopes), then pivots against it, then pushes the resulting claim to its most consequential form. Recognizing this shape helps you see the arc instead of just the individual sentences.",
        "The payoff of tracing a line of reasoning: you can explain not just THAT a text is persuasive, but HOW the persuasion accumulates — why the ending lands as hard as it does BECAUSE of what was established earlier, not in spite of it.",
        "The trap: analyzing each paragraph or device in isolation without ever connecting stage N to stage N+1. A response that says 'first he does X, then he does Y, then he does Z' with no stated relationship between them is a list, not a line of reasoning.",
      ],
      vocabulary: [
        { term: 'line of reasoning', definition: 'the cumulative chain of claims a writer builds across a whole text, each claim functioning as a premise for the next.' },
        { term: 'warrant', definition: 'the underlying logical link that lets one claim support or lead to the next.' },
        { term: 'concession', definition: "a point a writer grants to the audience's existing belief before pivoting against it." },
        { term: 'pivot / turn', definition: "the structural moment a text shifts direction, often marked by a transition word or change in address." },
        { term: 'escalation', definition: "pushing a claim to its furthest, most consequential form as a line of reasoning builds toward its climax." },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-douglass-arc',
      kind: 'worked_example',
      problem:
        "Trace the line of reasoning across the four paragraphs of Douglass's speech excerpt (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.douglass-fourth-of-july.v1), from the opening question through the closing indictment.",
      steps: [
        "STATE STAGE 1's CLAIM. Douglass opens by asking why HE has been asked to speak and whether the Declaration's principles of freedom and justice extend to the people he represents — a question, not yet an assertion, that unsettles the occasion before making any claim outright.",
        "STATE STAGE 2's CLAIM AND ITS RELATIONSHIP TO STAGE 1. Douglass then imagines what it would mean if the answer to that question were YES — his task would be 'light,' he could join the celebration wholeheartedly. This is a CONCESSION: he grants what a comfortable answer would look like, making the audience momentarily picture the happier possibility Stage 1's question raised.",
        "STATE STAGE 3's CLAIM — THE PIVOT. 'But, such is not the state of the case' — Douglass explicitly turns against the hopeful possibility Stage 2 just constructed: 'This Fourth of July is yours, not mine.' This claim depends entirely on Stage 2 having built up the hopeful alternative first — the pivot only lands because the audience was just given something to lose.",
        "STATE STAGE 4's CLAIM — THE ESCALATION. The famous line — 'What, to the American slave, is your Fourth of July?' — followed by a cascade of ironic reversals ('your celebration is a sham,' 'hollow mockery') pushes Stage 3's turn to its furthest form: not just 'this holiday isn't mine' but an indictment of the holiday's every value as, for him, its opposite.",
        "NAME THE OVERALL SHAPE AND WHY IT WORKS. The arc is QUESTION → CONCESSION (hopeful alternative) → PIVOT (this Fourth is not mine) → ESCALATION (systematic ironic indictment). Each stage depends on the one before: the concession only stings because it was genuinely hopeful; the pivot only lands because the concession raised real stakes; the escalation only feels earned because the pivot already established the reversal it now generalizes.",
      ],
      answer:
        "Douglass's line of reasoning moves: (1) an opening question about whether the nation's principles extend to him, (2) a concession imagining how light his task would be if the answer were yes, (3) a pivot — 'this Fourth of July is yours, not mine' — that only stings because Stage 2 just built up real hope, and (4) an escalation into a systematic ironic indictment ('a sham,' 'hollow mockery') that generalizes the pivot's reversal across every value the holiday claims to celebrate. Each stage depends on and intensifies the one before it — the ending lands as hard as it does BECAUSE of the hopeful alternative Douglass built and then denied.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-lincoln-arc',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE body paragraph tracing how Lincoln's claim that 'we can not dedicate — we can not consecrate — we can not hallow — this ground' functions as a necessary premise for his later claim that the living must take 'increased devotion' to 'the great task remaining.' Your paragraph must include at least one specific piece of evidence (a quote naming the claim at each stage) AND commentary explaining the logical relationship between the two stages and why building the argument in this order serves Lincoln's purpose. Do not quote-and-drop.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites both stages accurately — the early claim ('we can not dedicate — we can not consecrate — we can not hallow — this ground. The brave men, living and dead, who struggled here, have consecrated it') AND the later claim ('increased devotion,' 'the great task remaining before us,' or 'these dead shall not have died in vain'). Partial credit (1-2) for citing only one stage, or evidence present but vague/loosely connected. No credit for no evidence, misquoted evidence, or evidence irrelevant to the two claims.",
            modelResponse:
              "Lincoln first claims that the living 'can not dedicate — we can not consecrate — we can not hallow — this ground' because 'the brave men, living and dead, who struggled here, have consecrated it' already, far beyond the audience's 'poor power to add or detract'; he later builds on this to claim the living owe 'increased devotion' to 'the great task remaining before us.'",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains the LOGICAL RELATIONSHIP between the two stages — the first claim (the living's words are powerless next to the dead's sacrifice) functions as the necessary premise/warrant for the second (therefore the living owe not words but 'devotion' and action) — it is a claim that must be established FIRST for the second to have force; without first admitting words are insufficient, the demand for renewed devotion would feel like empty rhetoric rather than an earned obligation. AND explains WHY this order serves Lincoln's purpose — establishing the inadequacy of speech before calling for devotion makes the later demand feel like a logical necessity rather than a rhetorical flourish, strengthening the call to keep fighting. Partial credit for commentary that describes the relationship but not why the order matters to Lincoln's purpose, or that only restates each claim without connecting them. No credit for commentary absent or reduced to summary of each claim in isolation.",
            modelResponse:
              "The first claim — that the living's words cannot equal what the dead already did — functions as a necessary premise for the second: only after conceding that speech is insufficient can Lincoln credibly demand something more substantial, 'increased devotion' to unfinished work, without that demand sounding like empty rhetoric layered on top of a memorial address. By establishing the inadequacy of words BEFORE calling for renewed commitment, Lincoln makes the demand for continued sacrifice feel like a logical necessity flowing directly from the first claim, rather than a separate appeal — which is exactly what strengthens his case for the audience to keep fighting.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-list-vs-line',
      kind: 'misconception_check',
      question:
        'A student writes: "First the writer asks a question. Then the writer uses a metaphor. Then the writer ends with a strong statement." Is this an analysis of the line of reasoning?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating a chronological LIST of moves (first this happens, then this happens, then this happens) as if it were tracing a LINE OF REASONING — the unit\'s central trap.',
          correctsTo:
            "No — this is a sequence, not a line of reasoning. It says WHAT happens at each stage but never states the LOGICAL RELATIONSHIP between the stages: does the metaphor depend on the question having been asked? Does the final statement only work BECAUSE of what the metaphor established? A real line-of-reasoning analysis names what each stage CLAIMS and then explains how stage 2 builds on, depends on, or is made possible by stage 1 — for example, 'the question raises a possibility the metaphor then forecloses, which is what makes the final statement land as inevitable rather than abrupt.' The test: could you swap the order of your 'first... then... then...' sentence without changing its truth? If yes, you've described a sequence, not a chain of reasoning.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A line of reasoning is a cumulative chain: each claim functions as a premise or warrant the next claim depends on — not a list of disconnected clever moves.',
        'To trace it: state each stage\'s claim in one clause, then name the logical relationship (concession, pivot, escalation) connecting it to the next stage.',
        'Watch for connective tissue — "but," "yet," "therefore," a shift in address — these mark the joints where one stage hands off to the next.',
        'A common powerful shape: concession → pivot/turn → escalation.',
        'The trap: "first...then...then..." with no stated relationship between stages is a sequence, not a line of reasoning — always explain WHY the order matters, not just WHAT happens in order.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.4',
    cedTitle: 'Analyzing a Line of Reasoning',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '4',
        note: 'AP English Language and Composition Course and Exam Description, Unit 4 — tracing how a writer\'s claims build cumulatively across a whole text into a line of reasoning.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — anchor text for the concession-pivot-escalation arc.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — practice text for tracing the premise-to-demand chain in the closing movement.',
      },
    ],
  },
};
