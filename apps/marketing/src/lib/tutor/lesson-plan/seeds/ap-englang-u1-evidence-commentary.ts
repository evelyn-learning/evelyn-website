/**
 * AP English Language & Composition — CED Unit 1.4: Evidence and Commentary.
 *
 * Builds on 1.3 (writing a defensible thesis): a thesis alone earns almost no
 * points if the body paragraphs that follow don't back it. This topic teaches
 * the paragraph-level skill of choosing specific evidence AND explaining why
 * it matters — the "Row B" of the real AP Lang rubric and the biggest single
 * point-source on the exam. The most common paragraph-level failure is
 * "quote-and-drop": citing a quote, then moving on without ever explaining
 * what it proves.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = Evidence + Commentary parts summing to 6) this plan
 * follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is the
 * mechanics of evidence-then-commentary, not the historical conflict itself —
 * quotes below are limited to the short, structural rhetorical phrases (the
 * "we must fight" repetition, the closing declaration) already used as the
 * anchor evidence for this speech elsewhere in the unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U1_EVIDENCE_COMMENTARY: LessonPlan = {
  id: 'evelyn.ap.englang.evidence-commentary.v1',
  title: 'U1.4 Evidence and Commentary',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.evidence-commentary',
      description:
        "Build a body paragraph that selects specific textual evidence for a claim and supplies commentary explaining how that evidence works and why it serves the writer's purpose — not merely restating or dropping the quote.",
      standard: 'AP-ENGLANG-1.4',
    },
  ],
  prerequisites: ['apenglang.defensible-thesis'],
  followUps: ['apenglang.audience-context'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the gap between presenting evidence and explaining it, before naming "commentary."',
      script:
        "Imagine a lawyer stands up in court, holds up a bloody glove, says 'Exhibit A, the glove' — and sits back down. The jury is left thinking: okay, there's a glove... so what? A good lawyer doesn't just show the exhibit, they explain what it PROVES and why it matters to the case. Reading and writing about a text works the exact same way. Quoting a line from a speech is showing the exhibit. Explaining how that specific wording works, and why it serves the writer's purpose, is making the case. Most weak body paragraphs are all exhibit, no case — a quote, then silence. Today we build the second half.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-evidence-commentary',
      kind: 'concept',
      goal: "Define evidence and commentary, name the paragraph shape that reliably produces both, and flag the single most common failure.",
      keyIdeas: [
        "EVIDENCE is a specific textual detail — a quote, a rhetorical device, a structural choice — deliberately selected because it supports the paragraph's claim. Vague evidence ('the whole speech is emotional') isn't usable; specific evidence ('we must fight! I repeat it, sir, we must fight!') is.",
        "COMMENTARY is the explanation that connects the evidence to the paragraph's claim — the 'so what.' It answers: HOW does this specific wording/device work, and WHY does that serve the writer's purpose for this audience?",
        "THE #1 PARAGRAPH-LEVEL TRAP is 'QUOTE-AND-DROP': citing evidence, then moving straight to the next sentence or the next quote with no explanation in between. A quote never speaks for itself — the writer of the ANALYSIS has to make it speak.",
        "Strong commentary usually does more than restate the quote in other words — restating is not explaining. It traces a chain: what the device IS → what effect it has on the audience → why that effect serves the writer's larger purpose (tying back to the rhetorical situation from 1.1).",
        "A reliable paragraph shape: TOPIC SENTENCE (a mini-claim that supports the thesis) → EVIDENCE (a specific, accurately-quoted detail) → COMMENTARY (how it works + why it matters) → optionally a second evidence/commentary pair → a closing LINK back to the thesis.",
        "Commentary should be proportionally the LONGER part of the pairing — if a paragraph is mostly quotation with a one-clause explanation tacked on, that's a sign the analysis hasn't actually happened yet.",
        "Evidence doesn't have to be a direct quote — naming a structural choice (repetition, a shift in address, escalating short sentences) and citing where it occurs is equally valid evidence, and often the strongest kind because it shows pattern, not just a single line.",
        "The test for a finished evidence+commentary pair: could a reader who has NOT read the passage still understand, from your commentary alone, why this specific detail matters to your claim? If not, more commentary is needed.",
      ],
      vocabulary: [
        { term: 'evidence', definition: "a specific textual detail — a quote, device, or structural choice — selected because it supports a claim." },
        { term: 'commentary', definition: "the explanation connecting evidence to a claim: how a device works and why it serves the writer's purpose." },
        { term: 'quote-and-drop', definition: 'citing evidence with no explanation of what it proves — the most common paragraph-level failure.' },
        { term: 'line of reasoning', definition: 'the chain a paragraph builds from claim through evidence and commentary back to the thesis.' },
        { term: 'warrant', definition: 'the underlying logical link commentary supplies between a piece of evidence and the claim it is meant to support.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-paragraph-henry',
      kind: 'worked_example',
      problem:
        "Build one body paragraph supporting the claim that Henry manufactures a sense of urgency to make immediate action feel like the only rational choice, drawing on his 1775 speech (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1).",
      steps: [
        "WRITE THE TOPIC SENTENCE. State the mini-claim this paragraph will prove: Henry's repetition at the climax collapses the sense that time remains to decide.",
        "SELECT THE EVIDENCE. Choose a specific, quotable detail: the repeated declarative 'we must fight! I repeat it, sir, we must fight!' — note WHY this detail (not some other line) was chosen: it's the only moment the same clause is stated twice in immediate succession.",
        "NAME WHAT THE DEVICE IS. This is repetition of an imperative-toned declarative, doubled within a single breath, immediately following the flat statement 'There is no longer any room for hope.'",
        "EXPLAIN HOW IT WORKS ON THE AUDIENCE (the how). Repeating the identical clause rather than varying the wording removes any appearance of open deliberation — it performs certainty rather than argues for it, making continued debate itself feel already settled.",
        "EXPLAIN WHY THIS SERVES HENRY'S PURPOSE (the why, tied back to rhetorical situation). His purpose is to move a hesitant, still-deliberating Convention toward an irreversible vote; a device that makes the decision FEEL already made serves that purpose more directly than a calm, evidence-by-evidence case would.",
        "LINK BACK TO THE THESIS. Close by tying this specific paragraph's point back to the essay's overall claim about Henry manufacturing urgency to foreclose further deliberation.",
      ],
      answer:
        "Henry's repetition at the speech's climax collapses any remaining sense that time is left to decide. Immediately after declaring \"There is no longer any room for hope,\" he repeats the identical clause rather than varying it — \"If we wish to be free, we must fight! I repeat it, sir, we must fight!\" — and that exact repetition, rather than a fresh argument, performs certainty instead of arguing for it: the decision is made to sound already settled, not still open for debate. Because Henry's purpose is to move a hesitant Convention off the fence and toward an irreversible vote, a device that makes deliberation itself feel finished serves that purpose more directly than another calm, evidence-based appeal could — it removes the exit the audience might otherwise still feel they had.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-henry',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.henry-give-me-liberty.v1, write ONE body paragraph supporting this claim: Henry uses the extended metaphor of illusion and awakening ('the illusions of hope,' 'shut our eyes,' 'the song of that siren') to frame continued optimism about peace as a dangerous self-deception. Your paragraph must include at least one specific piece of evidence (a quote or a precisely-named device) AND commentary explaining how that evidence works and why it serves Henry's purpose. Do not quote-and-drop.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted or precisely-named evidence from the passage relevant to the illusion/awakening claim (e.g. 'the illusions of hope,' 'shut our eyes against a painful truth,' 'the song of that siren till she transforms us into beasts,' or the sensory imagery of sight/hearing across the opening paragraph). Partial credit (1-2) for evidence that is present but vague, only loosely connected to the stated claim, or only one weak reference where a stronger, more specific one was available. No credit for no evidence, evidence that misquotes/misattributes the passage, or evidence irrelevant to the claim.",
            modelResponse:
              "Henry opens by naming the danger directly as self-deception: \"it is natural to man to indulge in the illusions of hope,\" and warns his fellow delegates against continuing to \"shut our eyes against a painful truth, and listen to the song of that siren till she transforms us into beasts.\"",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW the cited evidence works (e.g. the siren image casts hope-for-peace as an active, seductive danger rather than a passive comfort; 'shut our eyes' frames continued optimism as a willful choice to avoid seeing, not innocent ignorance) AND WHY that serves Henry's purpose (making inaction itself feel like a moral failure the delegates are choosing, which pressures them toward his call to fight) — going beyond restating the quote in different words. Partial credit for commentary that explains the device's effect but doesn't connect it to Henry's purpose, or that mostly restates the quote without real analytical development. No credit for commentary absent, or reduced to a summary of what the words say with no explanation of how/why.",
            modelResponse:
              "By casting hope for peace as a siren's song rather than an innocent wish, Henry recasts continued optimism as an active, seductive danger the delegates must resist rather than a comfort they can passively enjoy; \"shut our eyes\" goes further, framing that optimism as something delegates are CHOOSING, not merely feeling. Together the images make inaction itself look like a willful failure of nerve — which is exactly the pressure Henry needs to move a hesitant Convention toward the fight he is arguing for.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-quote-and-drop',
      kind: 'misconception_check',
      question:
        'A student writes: "Henry says, \'we must fight! I repeat it, sir, we must fight!\' This shows that Henry wants to fight." Is this an acceptable evidence-and-commentary pairing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating a QUOTE-AND-DROP — citing evidence, then restating its literal content instead of explaining how the device works and why it serves the writer's purpose — as if it were commentary.",
          correctsTo:
            "No — \"this shows that Henry wants to fight\" restates what the quote says, it doesn't explain anything. Real commentary answers HOW the device works (why REPEATING the identical clause, rather than saying it once, has a different effect than a single statement would) and WHY that serves Henry's purpose (performing certainty to a still-deliberating audience, rather than only arguing for it). The test: strip the quote out — does the sentence that's left still make an analytical point, or does it just re-say the quote's content in your own words? If it just re-says the content, it's quote-and-drop, not commentary.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Evidence is a specific, deliberately-chosen textual detail; commentary is the explanation connecting it to the paragraph's claim — both are required, and neither substitutes for the other.",
        "Quote-and-drop — citing evidence with no explanation — is the #1 paragraph-level failure. Commentary should be the LONGER part of the pairing, not an afterthought.",
        "Good commentary explains HOW a device works on the audience and WHY that serves the writer's purpose — restating the quote in other words is not commentary.",
        "Reliable paragraph shape: topic sentence → evidence → commentary → (optional second pair) → link back to the thesis.",
        "Test: could a reader who never saw the passage understand, from your commentary alone, why this detail matters? If not, write more commentary.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.4',
    cedTitle: 'Evidence and Commentary',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '1',
        note: 'AP English Language and Composition Course and Exam Description, Unit 1 — selecting evidence and building commentary that explains how a device works and why it serves the writer\'s purpose (Row B of the AP Lang rubric).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — anchor text for paragraph-level evidence-and-commentary practice.',
      },
    ],
  },
};
