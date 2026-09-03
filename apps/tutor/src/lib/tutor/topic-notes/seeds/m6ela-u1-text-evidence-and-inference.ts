/**
 * Grade 6 English Language Arts — Unit 1 CED 1.1: Text Evidence & Inference.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.text-evidence-and-inference.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U1_TEXT_EVIDENCE_AND_INFERENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.text-evidence-and-inference.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Text Evidence & Inference',
  planId: 'evelyn.ms.m6ela.text-evidence-and-inference.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.text-evidence-and-inference.v1' }],
  theory: [
    { loId: 'm6ela.text-evidence-and-inference', content: `EXPLICIT MEANS THE TEXT SAYS IT IN PLAIN WORDS. If a fact is explicit, you can point to the exact sentence that states it, and nothing needs figuring out. "Marisol was thrilled when she saw her grade" explicitly states how Marisol felt.` },
    { loId: 'm6ela.text-evidence-and-inference', content: `INFERENCE MEANS THE TEXT DOES NOT SAY IT DIRECTLY, BUT THE DETAILS LEAD YOU THERE. An inference is a conclusion you build by combining two or more details in the text. It is not a guess pulled from nowhere, and it is not something stated outright either.` },
    { loId: 'm6ela.text-evidence-and-inference', content: `TEXTUAL EVIDENCE IS THE EXACT WORDS YOU POINT TO AS PROOF. Citing evidence means quoting or naming the specific detail from the text, not saying something vague like "the story shows it."` },
    { loId: 'm6ela.text-evidence-and-inference', content: `IF THE TEXT ALREADY SAYS IT, RESTATING IT IS NOT AN INFERENCE. Explicit fact: "Jamal told his sister he wanted to sign up." Repeating that same idea in different words is not an inference, because nothing needed to be figured out.` },
    { loId: 'm6ela.text-evidence-and-inference', content: `A GOOD INFERENCE STAYS INSIDE THE TEXT'S OWN DETAILS. An idea that depends on something the text never says — a rule you already believed, or a fact from outside the passage — is an assumption, not an inference.` },
    { loId: 'm6ela.text-evidence-and-inference', content: `TEST EVERY INFERENCE BY POINTING AT THE EVIDENCE. Before you trust an inference, name at least one exact phrase from the text that supports it. If you cannot point to anything, the inference is a guess.` },
    { loId: 'm6ela.text-evidence-and-inference', kind: 'definition', title: 'explicit', content: `stated in the text in plain words, with nothing left for the reader to figure out.` },
    { loId: 'm6ela.text-evidence-and-inference', kind: 'definition', title: 'inference', content: `a conclusion the reader builds by combining details the text gives, without the text stating that conclusion directly.` },
    { loId: 'm6ela.text-evidence-and-inference', kind: 'definition', title: 'textual evidence', content: 'the exact words or details from the text used to prove a claim about it.' },
    { loId: 'm6ela.text-evidence-and-inference', kind: 'definition', title: 'cite', content: 'to point to or quote the specific words from the text that back up an answer.' },
    { loId: 'm6ela.text-evidence-and-inference', kind: 'definition', title: 'assumption', content: `an idea a reader adds from outside the text — an outside belief or a rule — rather than something the text's details actually support.` },
  ],
  methods: [
    {
      title: 'Worked explicit vs inference',
      steps: [
        'Read the passage once for what happens, without deciding anything yet.',
        `Look for a sentence you could point to word for word, with nothing left to figure out. "Marcus set his lunch tray down at the end of the table, three seats away from his usual friends" states a fact directly. That is explicit.`,
        `Notice what the passage never says: it never states how Marcus feels. That gap is the sign an inference is needed.`,
        `Collect every detail that touches on his mood: he "did not look up when they called his name," he turned down a trade he would normally take, and he kept his passing quiz "tucked face-down under his tray, one corner sticking out."`,
        `Combine those details into one sentence: something is bothering Marcus, even though the passage never says so directly.`,
        `Name the exact evidence that supports it: "did not look up when they called his name," he "said 'no thank you'," and the quiz "tucked face-down under his tray, one corner sticking out."`,
        `Test the inference against the explicit-restatement trap: does any sentence in the passage already say Marcus is upset? No. So this is a real inference, built from clues, not a repeated fact.`,
      ],
      example: { problem: `Read the passage, then answer two questions about it: what does the text state EXPLICITLY, and what is a valid INFERENCE it supports?

"Marcus set his lunch tray down at the end of the table, three seats away from his usual friends. He did not look up when they called his name. When Priya asked if he wanted to trade her chips for his fruit cup, he said 'no thank you' and kept staring at his tray. He had aced the science quiz that morning, and it was tucked face-down under his tray, one corner sticking out."`, solution: `Explicit: Marcus set his lunch tray down three seats away from his usual friends and did not look up when they called his name. Inference: something is bothering Marcus, even though the passage never says so. Evidence: he turned down Priya's trade and said "no thank you," and he kept a quiz he had aced "tucked face-down under his tray, one corner sticking out."` },
      relatedLoIds: ['m6ela.text-evidence-and-inference'],
    },
    {
      title: 'Worked repair an inference',
      steps: [
        `Check the reason first. "Dogs are smart animals" is not something the passage says or shows. It is an idea the student already believed before reading, brought in from outside the text.`,
        `Separate the claim from the reason. The claim, that Bailey knows something about four o'clock, might still be worth keeping. The reason behind it is what needs to go.`,
        `Look for what the passage actually shows about Bailey and four o'clock. He "walked to the back door and sat down" at "exactly four o'clock," every afternoon, even with nobody home to let him in.`,
        `Look for the detail that explains why four o'clock might matter to him. Grandma "always arrived at four fifteen with a biscuit in her coat pocket."`,
        `Rebuild the inference using only those two details. WRONG: "Bailey knows how to tell time, because dogs are smart animals." CORRECT: "Bailey has learned that four o'clock means a visitor with a treat is coming soon, since he waits at the door at that exact time every day, right before Grandma arrives with a biscuit."`,
        `Test the repaired inference: point to the exact words that support it. "Walked to the back door and sat down" at "exactly four o'clock," and Grandma "arrived at four fifteen with a biscuit in her coat pocket," are both in the passage. No outside belief is needed anywhere in the repaired sentence.`,
      ],
      example: { problem: `Repair this inference so that it uses only evidence from the passage.

"Every afternoon at exactly four o'clock, Bailey the dog walked to the back door and sat down, even if no one was home to let him in. On the days Grandma visited, she always arrived at four fifteen with a biscuit in her coat pocket."

A student wrote: "Bailey knows how to tell time, because dogs are smart animals."`, solution: `WRONG: "Bailey knows how to tell time, because dogs are smart animals." CORRECT: "Bailey has learned that four o'clock means a visitor with a treat is coming soon, since he waits at the door at that exact time every day, right before Grandma arrives with a biscuit." Evidence: he "walked to the back door and sat down" at "exactly four o'clock," and Grandma "always arrived at four fifteen with a biscuit in her coat pocket."` },
      relatedLoIds: ['m6ela.text-evidence-and-inference'],
    },
  ],
  pointers: [
    { content: `Students often say "I can infer that Jamal wants to sign up for the talent show, since the text says he told his sister he wanted to sign up before Friday." — Before calling something an inference, check whether the text already says it directly. Here, the passage states outright that Jamal "told his older sister he wanted to sign up before Friday," so repeating that idea is not an inference, it is a restatement of an explicit line. A real inference from this passage would use clues the text does not state directly — for instance, "practicing his card tricks in the mirror instead of doing his math homework" supports the inference that Jamal cares more about the talent show right now than about his other schoolwork.`, kind: 'common-error' },
    { content: `Students often say "I can also infer that Jamal will win the whole show, because kids who practice really hard always win." — An inference has to be built only from details that are actually in the text, combined with logic, not from an outside rule the reader already believed. This passage never says anything about who wins the talent show, so no inference about winning can be drawn from it at all. Practicing hard is real evidence for something narrower: that Jamal is serious about doing well, not that he is guaranteed to win.`, kind: 'common-error' },
    { content: `Explicit means the text states it directly, in words you can point to. Nothing needs figuring out.`, kind: 'tip' },
    { content: `Inference means the text does not say it directly, but the details lead you there.`, kind: 'tip' },
    { content: `Citing evidence means quoting or pointing to the exact words that prove your answer, not gesturing at "the story."`, kind: 'tip' },
    { content: `If the text already says something outright, restating it is not an inference — it is an explicit fact repeated.`, kind: 'tip' },
    { content: `A good inference stays inside the text's own details. An idea built from an outside belief or rule is an assumption, not an inference.`, kind: 'tip' },
    { content: `Test every inference: name at least one exact phrase from the text that supports it. If you cannot, it is a guess.`, kind: 'tip' },
    { content: `Don't call it an inference if the text already says it word-for-word. Restating an explicit fact in different words is still just repeating — nothing was figured out. Always ask: does the passage state this directly?`, kind: 'common-error' },
    { content: `An inference needs at least two details from the text, combined. One detail alone is not enough — you need to connect clues to build a conclusion the text doesn't say outright.`, kind: 'tip' },
    { content: `If your inference depends on something you already believe (a rule, a fact you learned outside the text), it's an assumption, not an inference. Stick to what the passage actually gives you.`, kind: 'gotcha' },
    { content: `Before you trust an inference, point your finger at the exact words from the text that support it. If you can't name a phrase, it's a guess, not an inference.`, kind: 'tip' },
    { content: `Textual evidence is not 'the story shows' or 'you can tell' — it's the exact sentence or phrase. Quote it or name it precisely. Vague language is a red flag.`, kind: 'vocab-note' },
    { content: `Explicit and inference are opposites: if the text says it plainly, there's no inferring to do. If the text never says it directly, you can infer it from clues. Check which one you're dealing with before you answer.`, kind: 'edge-case' },
  ],
};
