/**
 * Digital SAT — Unit 5 CED 5.4: Inferences.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.inferences.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U5_INFERENCES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.inferences.v1',
  course: 'Digital SAT',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Inferences',
  planId: 'evelyn.testprep.dsat.inferences.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.inferences.v1' }],
  theory: [
    { loId: 'dsat.inferences', kind: 'framework', title: 'Format', content: `FORMAT — a short original passage ends in "______", followed by "Which choice most logically completes the text?" and four completions. There is no separate question stem to interpret; the blank itself is the question.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'The necessity standard', content: `THE NECESSITY STANDARD — the correct choice must be logically REQUIRED by the stated facts (an entailment), not just a believable real-world guess. If you can imagine the passage's facts being true while the choice is false, that choice is wrong — no matter how sensible it sounds.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Strategy', content: `STRATEGY — before reading the choices, restate the passage's stated facts as premises and predict what MUST follow. Then match a choice to that prediction instead of judging each choice in isolation.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — "SOUNDS RIGHT." A choice offers a realistic causal or evaluative story (e.g., "caused X to happen," "was because of Y") that the passage never actually establishes — usually because the passage gives a correlation, not a stated cause.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — EXTREME / OVER-SCOPED. Words like "all," "every," "always," "will definitely," "never" push a choice beyond what the stated facts cover, even when the general direction is right.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — OUTSIDE INFORMATION. The choice introduces a comparison, motive, or fact the passage never mentions (a new entity, an unstated reason, a detail about "better" or "worse" conditions).` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Trap 4', content: `TRAP 4 — DIRECT CONTRADICTION. The choice states the opposite of what the passage says — usually the easiest trap to eliminate once you've made your own prediction first.` },
    { loId: 'dsat.inferences', kind: 'framework', title: 'Trap 5', content: `TRAP 5 — RESTATEMENT vs. COMPLETION. A correct choice can legitimately just restate a comparison the passage already sets up (that IS a valid necessary completion) — don't confuse this with a choice that repeats a premise but fails to answer what the blank is actually asking for.` },
    { loId: 'dsat.inferences', kind: 'definition', title: 'necessarily follows', content: `a completion that MUST be true given the stated facts — not merely likely or realistic.` },
    { loId: 'dsat.inferences', kind: 'definition', title: 'premise', content: 'a fact the passage states directly, used to build the required completion.' },
    { loId: 'dsat.inferences', kind: 'definition', title: 'scope', content: `how broad or narrow a claim is; a valid completion matches the scope the premises actually support.` },
  ],
  methods: [
    {
      title: 'Worked universal rule',
      steps: [
        `Predict first: the passage gives a universal rule — "every reef that never reached 30°C remained unbleached." Reef C is stated to have never reached 30°C, so Reef C falls inside that rule.`,
        '(A) contradicts the rule directly — eliminate.',
        `(C) introduces a comparison ("colder ocean region") the passage never makes — outside information, eliminate.`,
        `(D) invents a specific number ("below 25°C") the passage never states — eliminate.`,
        `(B) is exactly what the universal rule requires for any reef that never reached 30°C, including Reef C.`,
      ],
      example: { problem: `Read the passage: "Marine biologists tracked coral bleaching at three reefs. Every reef that spent at least four consecutive weeks above 30°C bleached within two months; every reef that never reached 30°C remained unbleached. Reef C never reached 30°C during the study." Question: Which choice most logically completes the text? Based on this information, Reef C ______ (A) bleached within two months. (B) remained unbleached during the study. (C) was located in a colder ocean region than the other reefs. (D) spent four consecutive weeks below 25°C.`, solution: '(B) remained unbleached during the study.' },
      relatedLoIds: ['dsat.inferences'],
    },
    {
      title: 'Worked correlation trap',
      steps: [
        `Predict first: the passage only reports a TIME-MATCHED comparison — foot traffic fell downtown while it rose nearby, over the same twelve months. It never measures spending, motive, or cause.`,
        `(A) is the "sounds right" trap: spending and foot traffic are different things, and the passage never establishes that the parking change CAUSED anything — only that the numbers moved together. A plausible story, not a required one.`,
        `(C) predicts the future — unsupported by data about what happens if parking is restored.`,
        `(D) is the extreme/over-scoped trap: "every shop equally" goes far beyond an aggregate foot-traffic percentage.`,
        `(B) sticks to exactly what was measured: the two traffic trends moving in opposite directions over the same period. That is the only claim the numbers force.`,
      ],
      example: { problem: `Read the passage: "A city removed all free parking near its downtown shops last year. In the following twelve months, downtown foot traffic dropped by eighteen percent, while foot traffic in a nearby shopping district that kept free parking rose by six percent over the same period." Question: Which choice most logically completes the text? Based on this comparison, the removal of free parking ______ (A) caused shoppers to spend less money overall. (B) coincided with a decline in downtown foot traffic relative to the nearby district. (C) will be reversed if free parking is restored. (D) affected every downtown shop equally.`, solution: `(B) coincided with a decline in downtown foot traffic relative to the nearby district.` },
      relatedLoIds: ['dsat.inferences'],
    },
  ],
  pointers: [
    { content: `The correct completion sticks to exactly what the numbers show: the hours reduction coincided with a revenue drop while the competitor's revenue rose over the same stretch. Any claim about WHY (customers switching to the competitor specifically) requires an assumption the passage never confirms — plausible, not necessary.`, kind: 'common-error' },
    { content: `The correct completion must be REQUIRED by the stated facts, not just believable or realistic.`, kind: 'tip' },
    { content: `Predict the completion from the passage's premises before reading the choices.`, kind: 'tip' },
    { content: `Eliminate choices that contradict the text, overreach in scope ("all," "every," "always"), add outside information, or need an unstated cause/motive.`, kind: 'tip' },
    { content: `Correlation is not causation — a plausible causal story is the single most common wrong answer.`, kind: 'tip' },
    { content: `Read the words right before the blank — they set the grammatical frame. "Based on this comparison, the removal of free parking ______" needs a verb phrase about the removal, not about shoppers. A choice that switches subjects mid-sentence is usually the outside-info trap.`, kind: 'tip' },
    { content: `"Every X did Y" only tells you about X. If the passage says every reef above 30°C bleached, a reef that stayed below 30°C is NOT covered — you can't conclude it didn't bleach. Check whether the item is inside the rule's stated group before applying it.`, kind: 'common-error' },
    { content: `The word "only" flips scope. "Only members received the discount" ≠ "all members received the discount." Underline *only*, *unless*, *never*, and *no* in the premises — the SAT hides the entire inference in one of these small words.`, kind: 'gotcha' },
    { content: `A boring, almost-obvious restatement is often the answer. If a choice sounds like it "doesn't say anything new," that's a feature — necessary inferences are weak claims. The exciting, informative choice is usually the one that overreached.`, kind: 'tip' },
    { content: `Hedged wording ("suggests," "may," "at least some," "in this study") makes a choice easier to prove, but it doesn't make it automatically right. It still has to be *required* — a hedged claim about something never measured is still out of scope.`, kind: 'edge-case' },
    { content: `Watch for choices that shift the *measure*: passage says foot traffic, choice says spending; passage says revenue, choice says customers; passage says reported breaches, choice says breaches. Same story, different quantity — that's outside information.`, kind: 'gotcha' },
    { content: `"Necessarily follows" is not "most likely" or "best explains." Don't import Command-of-Evidence habits here — you're not picking the choice a scientist would believe, you're picking the one that cannot be false if the passage is true.`, kind: 'vocab-note' },
    { content: `Any choice about the future ("will continue," "if restored, will reverse") or about intent ("in order to," "because officials wanted") is nearly always wrong — the passage reports past measurements, not predictions or motives.`, kind: 'common-error' },
  ],
};
