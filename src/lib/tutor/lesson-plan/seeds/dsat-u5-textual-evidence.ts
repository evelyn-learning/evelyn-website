/**
 * Digital SAT — Reading & Writing: Command of Evidence (Textual).
 *
 * The digital SAT's textual Command of Evidence item: a short text
 * introduces a work (a story, a memoir, a letter collection, a research
 * study) and states a CLAIM about it. The question asks which of four
 * short quotations most effectively illustrates that claim. Focus on the
 * three recurring traps: on-topic-but-unspecific, background/atmosphere,
 * and quotations that contradict or reverse the claim's direction.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U5_TEXTUAL_EVIDENCE: LessonPlan = {
  id: 'evelyn.testprep.dsat.textual-evidence.v1',
  title: 'Command of Evidence: Textual',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.textual-evidence',
      standard: 'DSAT-5.2',
      description:
        'Match a stated claim about a text to the quotation that most directly and specifically illustrates it, rejecting on-topic-but-unspecific, background, and contradicting distractors.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Command of Evidence (Textual) as a recurring, learnable pattern within the Information and Ideas domain.',
      script:
        'Information and Ideas is roughly a quarter of the digital SAT Reading and Writing section, and Command of Evidence questions show up inside it several times per test. The textual version always follows the same shape: a claim about a text, then four quotations, and you pick the one that actually proves it. Learn to test each quotation against the exact claim, and this becomes one of the fastest patterns to recognize on the test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-pattern',
      kind: 'concept',
      goal: 'The recurring format, the isolate-and-test strategy, and the three named traps.',
      keyIdeas: [
        'THE FORMAT — a short text introduces a work (a story, a memoir, a letter collection, a research study) and states a CLAIM about it. The question asks: "Which quotation from the [work] most effectively illustrates this claim?" Four quotations follow as the choices.',
        'STEP 1 — ISOLATE THE CLAIM. Restate it in your own words before reading any choice. Name the exact, specific idea a quotation must prove — not just the general topic.',
        'STEP 2 — TEST EACH QUOTATION AGAINST THE CLAIM, not against the topic. A quotation can be about the right subject and still fail to prove the claim\'s specific point.',
        'TRAP 1 — ON-TOPIC BUT UNSPECIFIC. The most common wrong choice mentions the same person, event, or idea as the claim but supports a different point, or just describes it.',
        'TRAP 2 — BACKGROUND / ATMOSPHERE. Quotations that set a scene, give dates, or list biographical facts feel "textual" but prove nothing about the claim.',
        'TRAP 3 — CONTRADICTS OR REVERSES. A quotation can describe the OPPOSITE of the claim\'s direction (e.g., a public denial offered as evidence when the claim is about a private feeling) — read for direction, not just topic.',
        'THE BEST QUOTATION IS CONCRETE. Specific actions, exact repetition ("three nights running"), or a direct contrast are strong evidence; vague summary language is rarely the credited choice.',
        'Command of Evidence — Textual is distinct from its Quantitative sibling (data/graph support) and from Central Ideas questions (which ask about the passage\'s overall point, not proof of one claim).',
      ],
      vocabulary: [
        { term: 'claim', definition: 'the specific assertion a quotation must prove — not just a related topic.' },
        { term: 'illustrate', definition: 'to serve as a concrete example that directly demonstrates a claim.' },
        {
          term: 'command of evidence',
          definition: 'the reading skill of matching textual (or quantitative) support to a stated claim.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fiction',
      kind: 'worked_example',
      problem:
        'A student is writing about the novel Low Country, in which a lighthouse keeper named Odell grows to trust a shipwrecked stranger only after witnessing repeated small acts of honesty. Claim: the novel suggests Odell\'s trust is earned gradually through the stranger\'s consistent honesty, not through any single dramatic event. Which quotation from the novel most effectively illustrates this claim? (A) "Odell had never trusted anyone quickly, and he saw no reason to start now." (B) "Three nights running, the stranger returned exactly the coins he\'d been given, down to the last cent, though no one was watching." (C) "The storm rattled the windows, and Odell wondered if the lighthouse would hold." (D) "Odell\'s father had kept the light for forty years before him."',
      steps: [
        'Isolate the claim: trust is earned GRADUALLY, through REPEATED, CONSISTENT honesty — not one big moment.',
        '(A) describes Odell\'s general skepticism, not how trust is actually built. On-topic but unspecific — eliminate.',
        '(C) is scene-setting weather, and (D) is unrelated biographical background — neither touches trust or honesty. Eliminate both.',
        '(B) shows repetition ("three nights running") and an unwitnessed honest act — exactly the gradual, consistent pattern the claim describes.',
        'Answer: (B) — it is the only choice that is both specific to honesty AND shows repetition over time.',
      ],
      answer: '(B)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scholarly-trap',
      kind: 'worked_example',
      problem:
        'A student is writing about a linguistics study of bilingual children\'s "code-switching" during casual conversation. Claim: the study concludes that children code-switch strategically, choosing the language best suited to the specific listener, rather than mixing languages at random. Which quotation from the study most effectively illustrates this claim? (A) "Bilingual children in the study were observed in both home and school settings." (B) "When speaking with a monolingual grandparent, children used only the grandparent\'s language, but with a bilingual sibling, they freely mixed both." (C) "Code-switching has been studied in over a dozen language pairs worldwide." (D) "Some children in the study were as young as four years old."',
      steps: [
        'Isolate the claim: language choice tracks the SPECIFIC LISTENER — strategic, not random.',
        '(A) is a classic Trap 1: on-topic (mentions where children were observed) but says nothing about WHY they chose a given language. Eliminate.',
        '(C) and (D) are Trap 2: background facts about the study\'s scope and sample — neither shows strategic listener-matching. Eliminate both.',
        '(B) directly contrasts two listeners (monolingual grandparent vs. bilingual sibling) and shows the children\'s language choice changing to match each one — exactly "strategic, listener-suited" behavior.',
        'Answer: (B).',
      ],
      answer: '(B)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-story',
      kind: 'try_yourself',
      problem:
        'A student is writing about a short story titled "The Long Ledger," in which a shopkeeper named Priya insists on writing every transaction by hand, even after her town gets electricity. Claim: the story suggests Priya values the personal connection of face-to-face transactions over the efficiency of new technology. Which quotation from the story most effectively illustrates this claim?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The register hummed under the new lights, though Priya barely glanced at it, choosing instead to greet the boy by name before totaling his coins.',
          correct: true,
        },
        { id: 'b', text: 'The lights had been installed the previous spring, flickering unevenly during the first storms.' },
        { id: 'c', text: 'Priya\'s shop had stood on the corner for thirty years.' },
        { id: 'd', text: 'The new register could tally a sale in half the time it took Priya to write it by hand.' },
      ],
      expectedAnswer:
        'The register hummed under the new lights, though Priya barely glanced at it, choosing instead to greet the boy by name before totaling his coins.',
      hints: [
        'Isolate the claim: Priya values the PERSONAL connection over the EFFICIENT technology. Which quotation shows her choosing the personal option?',
        '(B) and (C) are background/atmosphere. (D) is a Trap 3-style reversal — it praises the technology\'s efficiency but never shows Priya valuing connection over it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-historian',
      kind: 'try_yourself',
      problem:
        'A student is writing about a historian\'s account of a 19th-century trade route. Claim: the historian argues that the route\'s success depended more on informal trust networks among merchants than on formal contracts. Which quotation from the historian\'s account most effectively illustrates this claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The trade route stretched nearly six hundred miles across difficult terrain.' },
        {
          id: 'b',
          text: 'Merchants who had never signed a single contract with one another still extended credit across hundreds of miles, relying on reputations passed along the route.',
          correct: true,
        },
        { id: 'c', text: 'Formal contracts were occasionally drawn up for the largest shipments of goods.' },
        { id: 'd', text: 'The route fell into disuse after the arrival of the railroad.' },
      ],
      expectedAnswer:
        'Merchants who had never signed a single contract with one another still extended credit across hundreds of miles, relying on reputations passed along the route.',
      hints: [
        'Isolate the claim: INFORMAL TRUST mattered MORE than formal contracts. You need a quotation that shows trust substituting for a contract.',
        '(A) and (D) are background/timeline facts. (C) is Trap 1 — it is about contracts, but it shows contracts being used, not being unnecessary.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-letters',
      kind: 'try_yourself',
      problem:
        'A student is writing about a poet\'s collected letters. Claim: the letters reveal that the poet, despite public claims of indifference to critics, was privately preoccupied with reviews of her work. Which quotation from the letters most effectively illustrates this claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I read the review only once, then set it aside without another thought, as I always do.' },
        {
          id: 'b',
          text: 'By the third rereading of the critic\'s paragraph, I had nearly memorized its harshest lines.',
          correct: true,
        },
        { id: 'c', text: 'The letter arrived on a rainy Tuesday, smudged at the corners.' },
        { id: 'd', text: 'She thanked her publisher for forwarding the week\'s correspondence.' },
      ],
      expectedAnswer: 'By the third rereading of the critic\'s paragraph, I had nearly memorized its harshest lines.',
      hints: [
        'Isolate the claim: PRIVATE preoccupation despite PUBLIC indifference. Watch for a choice that describes the public claim itself instead of the private truth.',
        '(A) is Trap 3 — it restates the public claim of indifference, the opposite of what you need. (C) and (D) are background details with no bearing on preoccupation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-on-topic',
      kind: 'misconception_check',
      question:
        'A claim states that a character grows more cautious after a betrayal. A student picks the quotation "The betrayal shook the whole village," reasoning that it "mentions the betrayal." Is this good evidence for the specific claim?',
      commonErrors: [
        {
          answer: 'Yes — it mentions the betrayal, so it fits.',
          misconception: 'Treating any on-topic mention as adequate evidence for a specific claim.',
          correctsTo:
            'No — the claim is specifically about the CHARACTER becoming more cautious. This quotation is about the village\'s reaction, not the character\'s behavior. Command of Evidence questions require the quotation to prove the exact claim, not just share its topic — this is Trap 1, on-topic but unspecific.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Isolate the claim in your own words before reading any choice — name the exact point a quotation must prove.',
        'Test each quotation against the claim itself, not the general topic.',
        'Watch for the three traps: on-topic-but-unspecific, background/atmosphere, and contradicts-or-reverses the claim\'s direction.',
        'The credited quotation is usually concrete and specific — repetition, direct contrast, or a precise action — not vague summary language.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Command of Evidence: Textual' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
