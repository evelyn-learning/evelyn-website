/**
 * AP Psychology — Unit 2 CED 2.2+3.5: Thinking, Problem-Solving, and Language.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.thinking-language.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_THINKING_LANGUAGE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.thinking-language.v1',
  course: 'AP Psychology',
  cedUnit: 2,
  cedTopic: '2.2+3.5',
  cedTitle: 'Thinking, Problem-Solving, and Language',
  planId: 'evelyn.ap.psych.thinking-language.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.thinking-language.v1' }],
  theory: [
    { loId: 'appsych.thinking-language', content: `HUMANS ARE NOT FULLY RATIONAL. We lean on mental shortcuts (HEURISTICS) that work most of the time but fail in PREDICTABLE ways. This topic pairs problem-solving strategies with the cognitive biases that trip them up, plus the parallel story of how language develops and shapes thought.` },
    { loId: 'appsych.thinking-language', content: `PROBLEM-SOLVING STRATEGIES: an ALGORITHM is a step-by-step procedure GUARANTEED to reach a solution — slow but reliable (long division; checking every cabinet for lost keys). A HEURISTIC is a mental SHORTCUT — fast but fallible, right most of the time (looking only where you probably left the keys). INSIGHT is a sudden "Aha!" realization, associated with a burst of activity in the right temporal lobe.` },
    { loId: 'appsych.thinking-language', content: `OBSTACLES TO PROBLEM-SOLVING: CONFIRMATION BIAS (seeking evidence that supports a belief and ignoring what contradicts it); FIXATION (getting stuck on one approach); MENTAL SET (defaulting to a strategy that worked before even when it no longer fits); and FUNCTIONAL FIXEDNESS (failing to see an object used in a novel way — not seeing a screwdriver as a chisel).` },
    { loId: 'appsych.thinking-language', content: `REPRESENTATIVENESS HEURISTIC: judging probability by how well something matches a CATEGORY PROTOTYPE. It misleads when stereotypes outweigh BASE RATES. The Linda problem: told Linda is outspoken and concerned with justice, people rate "feminist bank teller" as more likely than "bank teller" — a CONJUNCTION FALLACY, since a subset can never be more probable than the whole set.` },
    { loId: 'appsych.thinking-language', content: `AVAILABILITY HEURISTIC: judging probability by how EASILY examples come to mind. Vivid, recent, or heavily reported events feel more likely — people overestimate plane crashes, shark attacks, and terrorism while underestimating mundane risks like car accidents. News coverage and recent personal experience both inflate availability.` },
    { loId: 'appsych.thinking-language', content: `ANCHORING: relying too heavily on the FIRST piece of information (the "anchor") when estimating. First offers dominate negotiations; initial listed prices bias what buyers will pay; even irrelevant numbers can pull judgments (a stated number nudging a sentencing decision).` },
    { loId: 'appsych.thinking-language', content: `MORE JUDGMENT BIASES: OVERCONFIDENCE (people are more confident than accurate — "90% sure" is often right closer to 75% of the time); FRAMING EFFECTS (identical information produces different choices depending on wording — a "90% survival rate" is accepted more readily than a "10% mortality rate"); and BELIEF PERSEVERANCE (clinging to a belief even after the evidence for it is discredited).` },
    { loId: 'appsych.thinking-language', content: `LANGUAGE BUILDING BLOCKS: PHONEMES are the smallest sound units (about 40 in English). MORPHEMES are the smallest MEANINGFUL units ("cats" = "cat" + "-s", two morphemes). SEMANTICS is the meaning of words and combinations. SYNTAX is the set of grammatical rules for ordering words.` },
    { loId: 'appsych.thinking-language', content: `LANGUAGE ACQUISITION STAGES: BABBLING (around 4 months — infants produce phonemes from many languages); ONE-WORD stage (around 12 months — mostly nouns like "ball"); TWO-WORD / TELEGRAPHIC stage (around 24 months — "want cookie"); and full SENTENCES with exploding vocabulary (around 3-4 years). A CRITICAL PERIOD around age 7 marks the window in which a language is learned to near-native fluency; learning after it is markedly harder.` },
    { loId: 'appsych.thinking-language', content: `THEORIES OF LANGUAGE AND THOUGHT: CHOMSKY proposed an innate LANGUAGE ACQUISITION DEVICE (LAD) and a UNIVERSAL GRAMMAR common to all languages. LINGUISTIC RELATIVITY (Sapir-Whorf) claims language shapes thought — the STRONG version says language DETERMINES what we can think, the WEAK version that it merely INFLUENCES thinking. Evidence (Russian speakers with two words for blue discriminating shades faster; bilinguals reporting shifts across languages) supports the WEAK version; the modern view is that thought is possible without language.` },
    { loId: 'appsych.thinking-language', kind: 'definition', title: 'heuristic', content: `a mental shortcut for problem-solving or judgment; fast but fallible.` },
    { loId: 'appsych.thinking-language', kind: 'definition', title: 'availability heuristic', content: `judging likelihood by how easily instances come to mind.` },
    { loId: 'appsych.thinking-language', kind: 'definition', title: 'linguistic relativity', content: `the hypothesis that language shapes thought; the weak (influences) version is supported.` },
  ],
  methods: [
    {
      title: 'Identify the cognitive bias in a scenario',
      steps: [
        `STEP 1 — ASK WHAT DROVE THE JUDGMENT. Was it similarity to a stereotype (REPRESENTATIVENESS), ease of recalling examples (AVAILABILITY), or an initial reference number (ANCHORING)?`,
        `STEP 2 — CHECK FOR BELIEF-PROTECTION. Selectively accepting supporting evidence and dismissing contradicting evidence → CONFIRMATION BIAS; refusing to update after disconfirmation → BELIEF PERSEVERANCE.`,
        `STEP 3 — CHECK FOR WORDING AND CONFIDENCE. A choice that flips with rephrasing → FRAMING; certainty exceeding accuracy → OVERCONFIDENCE.`,
        `STEP 4 — NAME the specific bias explicitly — AP rubrics award the labeled term plus a correct mechanism, not a vague description.`,
      ],
      example: {
        problem: `A person hears about three plane crashes in two months and becomes afraid to fly, even though the statistical risk has not changed. Name the heuristic and explain.`,
        solution: `AVAILABILITY HEURISTIC. Rare but dramatic, heavily covered crashes are easy to recall, so the brain estimates their probability by ease of retrieval and overrates the risk — even though driving the same distance is statistically more dangerous.`,
      },
      relatedLoIds: ['appsych.thinking-language'],
    },
    {
      title: 'Reason about language development and relativity',
      steps: [
        `STEP 1 — FOR A "why are children better?" PROMPT, invoke the CRITICAL PERIOD (peak brain plasticity to about age 7), early phoneme discrimination that narrows by age 1, greater exposure, and Chomsky's LAD being most active early.`,
        `STEP 2 — FOR LINGUISTIC RELATIVITY, cite concrete evidence (Russian blue-shade discrimination; color-naming effects on memory; bilinguals' cross-language shifts).`,
        `STEP 3 — DISTINGUISH the STRONG version (language determines thought — weakly supported) from the WEAK version (language influences thought — supported).`,
        `STEP 4 — CONCLUDE with the modern consensus: thought is possible without language, so the weak version is the defensible claim.`,
      ],
      example: {
        problem: `(a) Why are children better than adults at learning a new language? (b) Give one piece of evidence for linguistic relativity.`,
        solution: `(a) The CRITICAL PERIOD of brain plasticity to ~age 7, un-narrowed phoneme discrimination, more exposure, and an early-active LAD; adults must work harder and often retain an accent. (b) Russian speakers, whose language has two distinct words for light and dark blue, discriminate blue shades faster than English speakers — supporting the WEAK version of Sapir-Whorf.`,
      },
      relatedLoIds: ['appsych.thinking-language'],
    },
  ],
  pointers: [
    { content: 'Algorithm = guaranteed but slow; heuristic = fast shortcut but fallible.', kind: 'tip' },
    { content: 'Representativeness (fits a stereotype) vs availability (comes to mind easily) vs anchoring (first number sticks).', kind: 'tip' },
    { content: 'Functional fixedness, mental set, and fixation all block flexible problem-solving.', kind: 'tip' },
    { content: 'Language units: phonemes (sound) → morphemes (meaning) → semantics → syntax.', kind: 'tip' },
    { content: 'Critical period ~age 7; Chomsky = innate LAD + universal grammar.', kind: 'tip' },
    { content: 'Linguistic relativity: weak version (language influences thought) supported; strong version (determines) not.', kind: 'tip' },
  ],
};
