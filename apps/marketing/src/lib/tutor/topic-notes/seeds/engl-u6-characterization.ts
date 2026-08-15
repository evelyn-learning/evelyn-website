/**
 * HS English — Unit 6 CED 6.2: Direct & Indirect Characterization.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.characterization.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U6_CHARACTERIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.characterization.v1',
  course: 'HS English',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Direct & Indirect Characterization',
  planId: 'evelyn.hs.engl.characterization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.characterization.v1' }],
  theory: [
    { loId: 'engl.characterization', kind: 'framework', title: 'Direct characterization', content: `DIRECT CHARACTERIZATION — the narrator TELLS you a trait outright: "Old Mr. Herrera was a generous man." Fast, clear, and rare in strong fiction, because being told a fact is less convincing than discovering it.` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Indirect characterization', content: `INDIRECT CHARACTERIZATION — the author SHOWS evidence and you infer the trait. Five places to look, remembered as STEAL: Speech, Thoughts, Effect on others, Actions, Looks.` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Speech', content: `SPEECH — not just WHAT a character says but HOW: word choice, interruptions, what they avoid saying. A character who answers every question with one word is telling you something.` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Actions outweigh words', content: `ACTIONS OUTWEIGH WORDS — when speech and action conflict, trust the action: a character who says "I do not care about the award" while polishing the trophy case cares. Contradiction between STEAL categories is usually the author waving a flag.` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Effect on others', content: `EFFECT ON OTHERS — how people react around a character is evidence too: if the room goes quiet when Dana enters, the author has characterized Dana without her doing anything.` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Cite the line', content: `CITE THE LINE — a trait claim is only as good as its evidence. The move is always "trait + because + the specific words": not "Theo is nervous" but "Theo is nervous — he folds the same napkin three times while insisting he is fine."` },
    { loId: 'engl.characterization', kind: 'framework', title: 'Traits vs emotions', content: `TRAITS VS EMOTIONS — a trait is a stable pattern (patient, calculating, loyal); an emotion is a moment (startled, annoyed). One flash of anger does not make a character "an angry person" — look for repetition before claiming a trait.` },
    { loId: 'engl.characterization', kind: 'definition', title: 'direct characterization', content: 'the narrator explicitly states a character trait.' },
    { loId: 'engl.characterization', kind: 'definition', title: 'indirect characterization', content: `the author reveals a trait through speech, thoughts, effects on others, actions, or looks, leaving the inference to the reader.` },
  ],
  methods: [
    {
      title: 'Worked infer trait',
      steps: [
        `Sort the evidence into STEAL: answering early is an ACTION; glancing around for reactions points to the EFFECT she hopes to have on others.`,
        `Interpret the action: answering before the question ends signals eagerness and confidence in her knowledge — maybe impatience.`,
        `Interpret the glance: checking who noticed shows the answer was partly a performance; she wants recognition, not just correctness.`,
        `Combine into a trait claim with evidence: Marisol craves recognition — she answers before the question is even finished and immediately checks who noticed.`,
      ],
      example: { problem: `Read this excerpt and infer a character trait, citing the evidence: "Marisol answered before the teacher finished the question, then glanced around the room to see who had noticed."`, solution: `Marisol is eager for recognition — evidence: she answers early (action) and scans the room for a reaction (intended effect on others)` },
      relatedLoIds: ['engl.characterization'],
    },
    {
      title: 'Worked words vs actions',
      steps: [
        `Separate the STEAL categories: Devon SPEECH = generous offer ("Take the last seat, I insist"). Devon ACTION = taking the seat himself, before the offer can even be accepted.`,
        `The student built the trait claim from speech alone — the single least reliable STEAL category, because characters (like people) say things for effect.`,
        `When categories conflict, actions outweigh words: the action shows the offer was empty politeness.`,
        `Revised claim: Devon performs generosity he does not practice — the gap between his words and his action is the characterization. Authors engineer such gaps deliberately; finding them is close reading, not cynicism.`,
      ],
      example: { problem: `A student reads this excerpt and concludes Devon is selfless: "Take the last seat, I insist," Devon said, already lowering himself into it. What did the student miss?`, solution: `The action contradicts the speech: Devon takes the seat while offering it, so the excerpt characterizes him as insincere, not selfless` },
      relatedLoIds: ['engl.characterization'],
    },
  ],
  pointers: [
    { content: `Direct characterization comes from the NARRATOR. A character's claims about herself are speech — indirect evidence that can be sincere, mistaken, or strategic. Check it against her actions and thoughts before believing it.`, kind: 'common-error' },
    { content: `Direct = the narrator tells the trait; indirect = the author shows evidence and you infer it.`, kind: 'tip' },
    { content: `STEAL: Speech, Thoughts, Effect on others, Actions, Looks — the five places trait evidence lives.`, kind: 'tip' },
    { content: `When words and actions conflict, actions win — and the contradiction itself is usually the point.`, kind: 'tip' },
    { content: 'Every trait claim needs a cited line: trait + because + the specific words.', kind: 'tip' },
    { content: `Direct characterization comes from the **narrator**, never from a character's mouth. "I'm the honest one here," said Ruth = SPEECH (indirect evidence), not a stated fact. Ask "who is talking?" before you label it direct.`, kind: 'common-error' },
    { content: `Don't confuse a trait with an emotion. "Startled," "annoyed," "excited" are moments; "cautious," "loyal," "calculating" are patterns. If you only have one scene, say what the character *feels*, and look for repetition before claiming what they *are*.`, kind: 'vocab-note' },
    { content: `When speech and action conflict, the action wins — and don't just pick the action, name the gap. Devon isn't simply "selfish"; he *performs generosity he doesn't practice*. The contradiction is the characterization.`, kind: 'gotcha' },
    { content: `"E" in STEAL is Effect on others, not Emotions. If the room goes quiet when Dana walks in, that's E — evidence about Dana from other people's behavior, even when she does nothing.`, kind: 'vocab-note' },
    { content: `Quoting isn't citing. "Theo is nervous" plus a dropped quotation isn't an inference — write trait + **because** + the specific words: "Theo is nervous *because* he folds the same napkin three times while insisting he's fine."`, kind: 'tip' },
    { content: `Analyze **how** a character speaks, not just what they say: one-word answers, interruptions, hedging, and the question they refuse to answer are all speech evidence. Silence in a conversation is characterization too.`, kind: 'tip' },
    { content: `"Looks" means details the author *chose* to include — bitten nails, a spotless uniform, a coat worn indoors. Don't build a trait claim on hair or eye color alone unless the text ties it to behavior.`, kind: 'edge-case' },
    { content: `A passage can be both. "Mr. Herrera was generous; he left the tips in the jar for the busboys" gives you a direct statement *and* indirect proof. Label both, and check that the shown evidence actually matches the told trait — sometimes it doesn't.`, kind: 'edge-case' },
  ],
};
