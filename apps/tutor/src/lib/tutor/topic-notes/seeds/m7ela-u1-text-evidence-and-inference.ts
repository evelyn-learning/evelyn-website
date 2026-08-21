/**
 * Grade 7 English Language Arts — Unit 1 CED 1.1: Text Evidence & Inference.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.text-evidence-and-inference.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U1_TEXT_EVIDENCE_AND_INFERENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.text-evidence-and-inference.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Text Evidence & Inference',
  planId: 'evelyn.ms.m7ela.text-evidence-and-inference.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.text-evidence-and-inference.v1' }],
  theory: [
    { loId: 'm7ela.text-evidence-and-inference', kind: 'framework', title: 'Explicit means the text says it outright', content: `EXPLICIT MEANS THE TEXT SAYS IT OUTRIGHT — if you can put your finger on a sentence and read the answer straight off the page, the meaning is explicit. "The gym was cold" is explicit. You do not have to work anything out; you only have to find it.` },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'framework', title: 'An inference is a conclusion the text lets you reach', content: `AN INFERENCE IS A CONCLUSION THE TEXT LETS YOU REACH — the words do not say it, but they hand you enough to build it. Inference = a detail from the text + what you already know about how the world works. "Her breath fogged in the gym" plus what you know about cold air gets you to the same conclusion, but nobody printed it.` },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'framework', title: 'Text evidence is the exact words, not your retelling', content: `TEXT EVIDENCE IS THE EXACT WORDS, NOT YOUR RETELLING — evidence means the wording that is really on the page, quoted or pointed at precisely. Saying "it says he was upset somewhere near the start" is not evidence. Saying he "shoved the paper into his bag without folding it" is.` },
    { loId: 'm7ela.text-evidence-and-inference', content: `THE FORMULA: CLAIM + BECAUSE + THE EXACT WORDS — say what you think, say "because", then give the wording that earned it. Not "I think the dog is scared." Instead: "The dog is scared, because she is hiding under the table and will not come out for food." If you cannot finish the sentence after "because", you do not have an inference yet.` },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'framework', title: 'Failure mode one, the guess', content: `FAILURE MODE ONE, THE GUESS — a guess is a claim with no line behind it. It can even be a very reasonable claim. The test is never "could this be true?" It is "does this text make me say it?" If the words never point there, the idea came from you, not from the page.` },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'framework', title: 'Failure mode two, the mismatched quote', content: `FAILURE MODE TWO, THE MISMATCHED QUOTE — this one is sneakier, because there IS a quotation attached. The quote is real, it just does not prove the claim it was stapled to. Test every quote on its own: read only that line, and ask whether it alone makes the claim true. If it does not, keep hunting for the line that does.` },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'definition', title: 'explicit', content: 'stated outright in the text, so you can point at the sentence and read it.' },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'definition', title: 'inference', content: 'a conclusion you build from a detail in the text plus what you already know.' },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'definition', title: 'text evidence', content: 'the exact words from the passage that support your claim.' },
    { loId: 'm7ela.text-evidence-and-inference', kind: 'definition', title: 'claim', content: 'the thing you are saying is true about the text, which then has to be backed up.' },
  ],
  methods: [
    {
      title: 'Worked explicit versus inference',
      steps: [
        `Start with the explicit part, which is anything you can read straight off the page. The text says Tia dropped her backpack, that the hook where the leash usually hangs is empty, that the gate is open, and that she started running.`,
        `Now list what the passage never says. It never says there is a dog. It never says the dog is gone. It never says where Tia is going or why she is in a hurry.`,
        `Pick the detail that is doing the most work. An empty leash hook and an open gate are sitting in the same sentence on purpose. A writer does not put those two side by side by accident.`,
        `Add what you already know: a leash belongs to an animal, a leash on its hook means the animal is home, and an open gate is how an animal gets out. That is ordinary knowledge, the kind everyone in the room shares.`,
        `Put it in the formula. The dog has gotten out and Tia has run after it, because the text says she looked at "the empty hook where the leash usually hung, then at the open gate" and then "was running before her mom finished the question."`,
        `Check the size of the step. The claim stops at the dog being out. It does not say the dog is lost, or hurt, or that Tia left the gate open herself. None of those has a line under it.`,
      ],
      example: { problem: `Sort this passage into what it SAYS and what it lets you CONCLUDE.

"Tia dropped her backpack by the door. She looked at the empty hook where the leash usually hung, then at the open gate. She was running before her mom finished the question."`, solution: `Explicit: the leash hook is empty, the gate is open, and Tia runs. Inference: the dog has gotten out and Tia is going after it, because the empty hook and the open gate appear together and she runs before her mom can finish asking.` },
      relatedLoIds: ['m7ela.text-evidence-and-inference'],
    },
    {
      title: 'Worked match the evidence',
      steps: [
        `Judge the claim and the evidence separately. That is the whole trick here. The claim, that Owen shares what he has, is fine. Something in this passage does support it.`,
        `Now test the quoted line by itself. Read only "carried the poster boards two at a time so the wet paint would not smudge" and ask what it proves. It proves Owen is being careful with wet paint. Careful is not the same as sharing.`,
        `So the quote is real but mismatched. This is failure mode two. The quotation marks made the answer look finished, and the line underneath does not hold the claim up.`,
        `Hunt for the line that does. Which sentence shows Owen giving something of his own to other people? "When the group ran out of tape, he pulled a fresh roll out of his own bag." Only that one involves his property going to the group.`,
        `WRONG: Owen shares what he has, because he "carried the poster boards two at a time." CORRECT: Owen shares what he has, because when the group ran out of tape "he pulled a fresh roll out of his own bag."`,
        `Keep the habit. Before you hand in a quote, cover the rest of the passage and read only that line. If the claim still stands, the evidence fits. If it does not, keep looking.`,
      ],
      example: { problem: `A student makes a good claim and then attaches the wrong line to it. Fix the evidence.

"Owen carried the poster boards two at a time so the wet paint would not smudge. When the group ran out of tape, he pulled a fresh roll out of his own bag. He was the last one to leave and did not mention it."

Student answer: Owen shares what he has, because he "carried the poster boards two at a time."`, solution: `The claim is fine, the evidence is not. The poster-board line shows Owen being careful, not sharing. The line that supports the claim is that when the group ran out of tape "he pulled a fresh roll out of his own bag."` },
      relatedLoIds: ['m7ela.text-evidence-and-inference'],
    },
  ],
  pointers: [
    { content: `Students often say "Priya is waiting for a friend who missed the bus." — Split the answer in two and test each half. "Priya is waiting for someone" survives, because her jacket "had been holding the seat next to her for twenty minutes" and she keeps checking the clock and the door. "Her friend missed the bus" has no line behind it at all. It could be true, and that is not the test. The test is whether the words on the page make you say it. Cut the half you cannot point at.`, kind: 'common-error' },
    { content: `Students often say "Priya is waiting for someone, because she "sat in the third row of the gym."" — Read the quoted line alone and ask whether it makes the claim true. Sitting in the third row tells you where Priya is, not that she is waiting for anybody. The lines that do the work are the saved seat and the checking: her jacket "had been holding the seat next to her for twenty minutes" while she "checked the clock, then the door, then the clock again." Same claim, correct evidence.`, kind: 'common-error' },
    { content: `Explicit means the text says it outright. An inference is a conclusion the text lets you build from a detail plus what you already know.`, kind: 'tip' },
    { content: `Text evidence is the exact wording on the page, not a rough memory of where it was.`, kind: 'tip' },
    { content: 'Use the formula every time: claim + "because" + the exact words.', kind: 'tip' },
    { content: `A guess is a claim with no line behind it. Ask "does this text make me say it?", not "could this be true?"`, kind: 'tip' },
    { content: `A quotation is not proof by itself. Read the line alone and check that it holds up the claim you attached it to.`, kind: 'tip' },
    { content: `The test for an inference is **"does this text make me say it?"** — not "could this be true?" Plenty of reasonable ideas (the friend missed the bus, the dog is hurt) have zero lines behind them. Reasonable is not the same as supported.`, kind: 'gotcha' },
    { content: `Quotation marks don't prove anything. Cover the rest of the passage, read ONLY your quoted line, and ask if that line alone makes your claim true. "Sat in the third row" is a real quote that proves nothing about waiting.`, kind: 'common-error' },
    { content: `Judge your claim and your evidence separately. A wrong quote does not mean your claim was wrong. Owen really does share — the poster-board line just wasn't the line that showed it. Keep the claim, hunt for a better sentence.`, kind: 'tip' },
    { content: `"Text evidence" means the words actually printed on the page, quoted or pointed at exactly. "It says somewhere near the beginning that he was mad" is a memory, not evidence. Go back and find the sentence.`, kind: 'vocab-note' },
    { content: `If your answer has two parts, test each part on its own. "Priya is waiting for someone" survives; "her friend missed the bus" doesn't. Cut the half you can't point at instead of throwing out the whole answer.`, kind: 'edge-case' },
    { content: `Watch the size of your step. The empty hook plus the open gate gets you to "the dog got out." It does not get you to "the dog is lost," "the dog is hurt," or "Tia left the gate open." Stop where the words stop.`, kind: 'gotcha' },
    { content: `Everyday background knowledge is allowed in an inference — leashes belong to animals, sweat means effort. Your personal story is not. "My dog ran away once, so..." is you, not the text.`, kind: 'edge-case' },
    { content: `If you can't finish the sentence after "because" with real words from the page, you don't have an inference yet — you have a feeling. Write claim + because + exact words every time, even when the answer feels obvious.`, kind: 'tip' },
  ],
};
