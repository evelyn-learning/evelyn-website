/**
 * College Intro — College Writing.
 *
 * Anchor plan for the freshman composition slot. Argument-driven essay
 * craft: thesis, evidence integration, paragraph logic, revision.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_ELA_COLLEGE_WRITING: LessonPlan = {
  id: 'evelyn.college.ela.college-writing.v1',
  title: 'College Writing — argument, evidence, revision',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'ela',
  topic: 'college-writing',
  locale: 'en',
  los: [
    {
      id: 'college.ela.composition',
      description: 'Plan, draft, and revise an argument-driven academic essay with a defensible thesis, integrated evidence, and disciplined paragraph logic.',
      standard: 'COLLEGE-FYC',
    },
  ],
  prerequisites: ['g912.ela.research-paper'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'College writing is not "longer high-school essays" — it is argument with stakes.',
      script: 'High-school five-paragraph templates collapse the moment a college reader asks "so what?". Today we move to the move that wins: a defensible thesis, evidence that earns each claim, paragraphs that argue rather than summarize, and revision that re-thinks rather than re-words.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-college-writing',
      kind: 'concept',
      goal: 'Thesis, evidence integration, paragraph logic, voice, revision.',
      keyIdeas: [
        'DEFENSIBLE THESIS: a thesis must be debatable. "The Civil War had many causes" is a fact. "Economic interdependence with Britain made Southern secession economically irrational, even on its own terms" is debatable — and worth defending.',
        'CLAIM → EVIDENCE → WARRANT → IMPLICATION: every paragraph asserts a claim, presents specific evidence, explains how the evidence supports the claim (the warrant), and ties it back to the thesis. Skip the warrant and your reader has to do your work.',
        'EVIDENCE INTEGRATION: do not "drop" quotes. Frame the source ("As Bourdieu argues..."), embed the quote inline if short, and follow with analysis longer than the quote itself.',
        'PARAGRAPH UNITY: one claim per paragraph. If your paragraph makes two claims, split it.',
        'TRANSITIONS as ARGUMENT: "Moreover" / "However" / "Therefore" tell the reader what move you are making. They are part of the argument, not decoration.',
        'VOICE: academic ≠ pretentious. Plain vocabulary deployed precisely beats elevated vocabulary deployed vaguely. Cut "in order to," "due to the fact that," "it should be noted that."',
        'REVISION ≠ EDITING: revision rethinks structure (does my thesis still match what I argued?). Editing fixes sentences. Do revision first, three times, before you touch the sentences.',
        'AUDIENCE: write for a peer in a related discipline who hasn\'t read your sources. They are smart but uninformed about your specifics.',
      ],
      vocabulary: [
        { term: 'warrant', definition: 'the (often unstated) assumption that links evidence to claim. Making warrants explicit is the move that distinguishes college writing from high-school writing.' },
        { term: 'thesis', definition: 'the central debatable claim of an essay; everything else exists to defend it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-thesis',
      kind: 'worked_example',
      problem: 'Take this weak thesis and improve it: "Social media has changed how teenagers communicate."',
      steps: [
        'Diagnose: the original is a fact, not a claim. Nobody disagrees. Nothing to defend.',
        'Sharpen the claim: what specifically about social media? what specifically about teen communication? what would the implication be?',
        'Better: "By replacing synchronous voice contact with asynchronous text and image, social media has made teen friendships less performatively emotional but more visually curated — a trade most teens accept because the curation is reciprocal."',
        'Why better: 1) specific causal mechanism (sync→async, voice→text/image), 2) specific outcome (less emotion, more curation), 3) takes a position (it is a trade, not a loss), 4) names the warrant (reciprocity).',
        'A reader can now disagree on grounds, evidence, or framing. That is what makes it worth reading.',
      ],
      answer: 'Specific, debatable, mechanism-bearing thesis replaces a fact.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Improve this thesis to make it defensible: "Online learning has both advantages and disadvantages."',
      expectedAnswer: 'Sample: "Online learning improves access for students who couldn\'t physically attend, but it strips out the unstructured peer contact where most identity formation happens — making it a clean win for credentialing and a hidden loss for development." (Names a specific tradeoff, takes a side, identifies a non-obvious mechanism.)',
      responseFormat: 'free',
      hints: [
        'A defensible thesis must take a side, not list both sides.',
        'Name a specific mechanism: WHAT changes, and WHY does that matter?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-quote-drop',
      kind: 'misconception_check',
      question: 'A student writes: "Bourdieu says cultural capital matters. \'Cultural capital exists in three forms\' (Bourdieu 245). This shows that cultural capital is important." Why does this paragraph fail?',
      commonErrors: [
        {
          answer: 'It quotes the source correctly',
          misconception: 'Treating quote integration as a mechanical citation requirement.',
          correctsTo: 'Three failures: 1) the quote is dropped without framing — no signal of why this source, in this paragraph, now. 2) The quote is shorter than no analysis at all — the writer never tells us what the three forms ARE, why they matter, or how they support the larger claim. 3) The "this shows" sentence restates the quote rather than analyzing it. Better: name the source\'s stake, embed the quote, then spend AT LEAST as many words analyzing as quoting. The reader should feel the writer earned the citation.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Thesis must be debatable, not factual.',
        'Claim → evidence → warrant → implication in every paragraph.',
        'Frame quotes; analyze longer than you quote.',
        'One claim per paragraph; transitions are argument.',
        'Plain language deployed precisely > elevated language deployed vaguely.',
        'Revise structure first, edit sentences second.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does academic writing reward making warrants explicit, while journalistic writing often hides them?',
      hint: 'Academic writing is judged partly on whether the chain of reasoning survives scrutiny — implicit warrants invite "but you assumed X" attacks. Journalism is judged on readability and persuasion within tight word counts; explicit warrants slow the reader and make the writing feel pedantic. Same evidence, different audiences, different conventions about which moves stay visible.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
