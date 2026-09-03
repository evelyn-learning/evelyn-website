/**
 * Grade 6 English Language Arts — Unit 4 CED 4.3: Tracing an Argument.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.tracing-an-argument.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U4_TRACING_AN_ARGUMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.tracing-an-argument.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Tracing an Argument',
  planId: 'evelyn.ms.m6ela.tracing-an-argument.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.tracing-an-argument.v1' }],
  theory: [
    { loId: 'm6ela.tracing-an-argument', content: `AN ARGUMENT IS BUILT OUT OF CLAIMS. A claim is a sentence the writer wants the reader to accept — an opinion, a recommendation, or a point meant to persuade. Most arguments make one MAIN CLAIM, the big ask the whole piece is arguing for, and then add several SPECIFIC CLAIMS along the way that are supposed to help convince the reader of it.` },
    { loId: 'm6ela.tracing-an-argument', content: `A SPECIFIC CLAIM COUNTS AS SUPPORTED WHEN A REASON AND EVIDENCE ARE ATTACHED TO IT. A reason explains why the claim should be believed, and evidence is the fact, count, or example that backs the reason up. If a sentence right around the claim is doing that work, sort the claim as supported.` },
    { loId: 'm6ela.tracing-an-argument', content: `A SPECIFIC CLAIM COUNTS AS NOT SUPPORTED WHEN THE TEXT STATES IT AND MOVES ON. No reason follows it, no fact backs it up, and the argument simply continues to its next point. This happens more often than it seems like it should, and the unsupported claim is not always small — sometimes it sits right where a strong finish is expected.` },
    { loId: 'm6ela.tracing-an-argument', content: `THIS IS A SORT, NOT A GRADE. The only question today is whether a specific claim has a reason and evidence attached, or does not. Deciding whether that reason truly makes sense, or whether the evidence is strong enough, is a skill for a later grade. For now: supported, or not supported, and nothing in between.` },
    { loId: 'm6ela.tracing-an-argument', content: `CONFIDENT WORDS ARE NOT EVIDENCE. A sentence can sound completely certain — everybody knows, obviously, clearly, the best choice — and still have no reason or fact anywhere near it. Sounding sure of itself is a tone, not a reason. Check for an actual reason and fact, never for how confident a sentence sounds.` },
    { loId: 'm6ela.tracing-an-argument', content: `TO SORT A CLAIM, FOLLOW THE SAME TWO STEPS EVERY TIME. Find the claim sentence, then read the sentence or two right around it. Ask: is a reason there, backed by a fact or example that is actually printed? If yes, the claim is supported. If the text has already moved on to its next point, the claim is not supported.` },
    { loId: 'm6ela.tracing-an-argument', kind: 'definition', title: 'claim', content: `a sentence in an argument that states something the writer wants the reader to accept, such as an opinion or a recommendation.` },
    { loId: 'm6ela.tracing-an-argument', kind: 'definition', title: 'reason', content: 'a sentence that explains why a claim should be believed.' },
    { loId: 'm6ela.tracing-an-argument', kind: 'definition', title: 'evidence', content: 'the specific fact, count, or example that backs up a reason.' },
    { loId: 'm6ela.tracing-an-argument', kind: 'definition', title: 'supported claim', content: 'a claim that has a reason and evidence attached to it somewhere in the text.' },
    { loId: 'm6ela.tracing-an-argument', kind: 'definition', title: 'unsupported claim', content: `a claim that the text states and then leaves alone, with no reason or evidence given for it.` },
  ],
  methods: [
    {
      title: 'Worked sort two claims',
      steps: [
        `Find the main claim first — the big ask, the sentence somebody could disagree with. "Riverbend Middle School should add a compost bin next to the cafeteria trash cans" is the main claim.`,
        `Find the first specific claim: "Composting the cafeteria's food scraps would keep them from producing the gas that makes landfills a problem for the planet." Check the next sentence for a reason and evidence.`,
        `They are there: "Food scraps that end up in a landfill break down without much oxygen around them, and that process releases methane, a gas that traps far more heat than carbon dioxide does." That names a cause and an effect, and it is a real fact about how landfills work, not just a feeling. This claim is SUPPORTED.`,
        `Find the second specific claim: "Composting is also the most fun part of taking care of the planet." Look at what comes before and after it in the paragraph — nothing does.`,
        `No reason follows this claim, no fact backs it up, and the paragraph simply ends there. This claim is NOT SUPPORTED, and notice it is not a small or careless sentence — it is placed last, right where a strong finish is expected.`,
        `Sort both specific claims: the methane claim is supported by a printed reason and fact, and the "most fun" claim has neither.`,
      ],
      example: { problem: `Trace this argument, then sort each of its two specific claims into SUPPORTED or NOT SUPPORTED.

"Riverbend Middle School should add a compost bin next to the cafeteria trash cans. Composting the cafeteria's food scraps would keep them from producing the gas that makes landfills a problem for the planet. Food scraps that end up in a landfill break down without much oxygen around them, and that process releases methane, a gas that traps far more heat than carbon dioxide does. Composting is also the most fun part of taking care of the planet."`, solution: `The specific claim that composting would stop landfill gas is SUPPORTED, backed by the reason that food scraps in a landfill break down without oxygen and release methane, a gas that traps far more heat than carbon dioxide. The specific claim that composting is the most fun part of taking care of the planet is NOT SUPPORTED — no reason or evidence is given for it anywhere in the text.` },
      relatedLoIds: ['m6ela.tracing-an-argument'],
    },
    {
      title: 'Worked confident words are not evidence',
      steps: [
        'Find the main claim: the school should install a water refill station.',
        `Find the first specific claim: "A refill station would cut down on the number of plastic bottles the school throws away." Check the next sentence for a reason and evidence: "Refill stations let students fill the same reusable bottle again and again, so fewer new plastic bottles ever get bought or thrown out in the first place." That explains the mechanism, so this claim is SUPPORTED.`,
        `Find the second specific claim: "Everybody knows a refill station is obviously the smartest choice a school could make." Words like everybody knows and obviously make this sentence sound settled, as though it must already be backed up.`,
        `Look for the reason or fact anyway, the same way as before. There is not one — no cause, no example, no count, nothing that explains why it is the smartest choice. The sentence only repeats how sure it sounds.`,
        `WRONG way to sort it: "It uses words like 'everybody knows,' so it must be well established." CORRECT way: check for an actual reason and fact, find none, and sort the claim as not supported no matter how confident it sounds.`,
        `Sort both specific claims: the plastic-bottle claim is supported by a printed reason, and the "obviously the smartest choice" claim is not — the confident wording is exactly what could fool a careless reader into thinking otherwise.`,
      ],
      example: { problem: `Trace this argument. One of its two specific claims sounds backed up because of the words around it — check whether it actually is.

"Westfield Middle School should install a water refill station in the front hallway. A refill station would cut down on the number of plastic bottles the school throws away. Refill stations let students fill the same reusable bottle again and again, so fewer new plastic bottles ever get bought or thrown out in the first place. Everybody knows a refill station is obviously the smartest choice a school could make."`, solution: `The specific claim that a refill station would cut down on plastic bottle waste is SUPPORTED, backed by the reason that the same reusable bottle gets refilled again and again instead of new bottles being bought and thrown out. The specific claim that "everybody knows" it is "obviously the smartest choice" is NOT SUPPORTED — no reason or evidence backs it up, only confident-sounding words.` },
      relatedLoIds: ['m6ela.tracing-an-argument'],
    },
  ],
  pointers: [
    { content: `Students often say "Flowers are obviously nice to look at, so the claim must be supported." — Sorting a claim only uses words that are actually printed in the text, never a reason the reader supplies. Reread the sentences right around the claim. If no reason and evidence are there, the claim is not supported, no matter how true or obvious the missing reason might seem to a reader.`, kind: 'common-error' },
    { content: `Students often say "Everybody knows that, so it must be supported." — A confident tone is not a reason. Words like everybody knows and obviously describe how sure a sentence sounds, not what backs it up. Check for an actual fact or example next to the claim; if the only thing there is confident wording, the claim is not supported.`, kind: 'common-error' },
    { content: `A claim is a sentence the writer wants the reader to accept. An argument usually has one main claim, plus several specific claims meant to support it.`, kind: 'tip' },
    { content: `A specific claim is SUPPORTED when a reason and evidence are attached to it somewhere in the text — a reason explaining why, backed by a fact or example.`, kind: 'tip' },
    { content: `A specific claim is NOT SUPPORTED when the text simply states it and moves on, with no reason and no evidence anywhere near it.`, kind: 'tip' },
    { content: `Sorting is not grading. The only question is whether a reason and evidence are attached, not whether they are strong enough — that comes in a later grade.`, kind: 'tip' },
    { content: `WRONG: "It sounds certain, so it must be supported." CORRECT: check for an actual reason and evidence right around the claim — a confident tone proves nothing on its own.`, kind: 'tip' },
    { content: `To sort any claim, find it, then read the sentences right around it. A printed reason and evidence there means supported; the argument moving on to its next point means not supported.`, kind: 'tip' },
    { content: `Don't confuse a reason that *feels true* with a reason the *text printed*. If you supply the reason from your own head, stop — reread the sentences around the claim. Only mark supported if the text itself has the reason and evidence right there.`, kind: 'common-error' },
    { content: `Confident words like "obviously," "everybody knows," and "clearly" are NOT evidence. They describe how sure a sentence sounds, not what backs it up. Always look for an actual fact or example, never trust the tone.`, kind: 'gotcha' },
    { content: `An unsupported claim can be big, important, or placed right at the end of a paragraph — size and placement don't matter. Check *all* specific claims the same way: reason and evidence nearby, or not supported.`, kind: 'edge-case' },
    { content: `When you find a claim, read the 1–2 sentences *right next to it* — before and after. If the reason and fact are buried three sentences away, that's not attached enough. Look for them close by or the claim is not supported.`, kind: 'tip' },
    { content: `A reason without evidence is not enough. A sentence that explains *why* (reason) must be paired with a *fact, count, or example* (evidence) before the claim counts as supported.`, kind: 'vocab-note' },
    { content: `Remember: you are NOT deciding if the reason makes sense or if the evidence is strong. You are ONLY sorting into two boxes: reason and evidence are there, or they are not. Save judgment for later.`, kind: 'tip' },
    { content: `The main claim is the big ask — the thing the whole piece is arguing for. Specific claims are smaller points meant to help convince you of the main claim. Sort only the specific claims, not the main one.`, kind: 'vocab-note' },
  ],
};
