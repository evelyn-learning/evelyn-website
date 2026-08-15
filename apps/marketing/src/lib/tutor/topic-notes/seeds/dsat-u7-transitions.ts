/**
 * Digital SAT — Unit 7 CED 7.2: Transitions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.transitions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U7_TRANSITIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.transitions.v1',
  course: 'Digital SAT',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Transitions',
  planId: 'evelyn.testprep.dsat.transitions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.transitions.v1' }],
  theory: [
    { loId: 'dsat.transitions', kind: 'framework', title: 'The method', content: `THE METHOD — cover the blank with your thumb, read only the sentence before and the sentence after, and put the logical relationship into your own words BEFORE looking at the four choices. Match a choice to that relationship — never the other way around.` },
    { loId: 'dsat.transitions', content: `CONTINUATION (addition) — the second sentence extends or reinforces the same point as the first, adding a new but agreeing fact. Signal words: also, moreover, furthermore, in addition, likewise, similarly.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Contrast', content: `CONTRAST — the second sentence pushes back on, qualifies, or reverses the first. Signal words: however, nevertheless, yet, on the other hand, in contrast, still.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Cause and effect', content: `CAUSE AND EFFECT — the second sentence is a direct result or consequence of the first, with the causal link actually stated, not just implied. Signal words: therefore, thus, consequently, as a result, hence, so.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Example', content: `EXAMPLE — the second sentence illustrates the first with one specific, concrete case. Signal words: for example, for instance, specifically, namely, such as.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Sequence', content: `SEQUENCE — the second sentence is the next step in a timeline or process, not a logical outcome. Signal words: next, then, subsequently, meanwhile, after that. Don’t confuse this with cause/effect: "then" marks TIME, "therefore" marks a RESULT.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Trap', content: `TRAP — the sophistication trap. A fancy-sounding choice (nevertheless, furthermore) is planted as the wrong-CATEGORY distractor. Pick by relationship, never by how advanced or academic the word sounds.` },
    { loId: 'dsat.transitions', kind: 'framework', title: 'Trap', content: `TRAP — the half-sentence trap. The digital SAT often adds a qualifier AFTER the blank that changes the relationship (a result that turns out to be an error, a prediction that gets contradicted). Read the FULL second sentence, not just up to the first comma, before classifying.` },
    { loId: 'dsat.transitions', kind: 'definition', title: 'continuation transition', content: `signals the next sentence extends or agrees with the same idea (also, moreover, furthermore).` },
    { loId: 'dsat.transitions', kind: 'definition', title: 'contrast transition', content: `signals the next sentence opposes or qualifies the first (however, nevertheless, yet).` },
    { loId: 'dsat.transitions', kind: 'definition', title: 'cause-effect transition', content: `signals the next sentence is a stated consequence of the first (therefore, thus, as a result).` },
  ],
  methods: [
    {
      title: 'Worked cause effect',
      steps: [
        `Cover the blank. Sentence before: an assumption (vision-only navigation) is being complicated by a specific finding (octopuses still found the den after being blinded). Sentence after the blank: a broader claim that scent memory may matter more than sight.`,
        `Classify: the blank sentence is not a new example and not a reversal of the finding just given — it is a CONCLUSION drawn FROM that finding. That is cause-and-effect.`,
        `Test each choice against that relationship: (a) "For example" needs an illustrative case, but the blank sentence is a conclusion, not an instance. (b) "Similarly" needs a parallel case, and there isn’t one. (d) "However" needs a reversal, but the blank sentence continues the same direction as the finding, it doesn’t oppose it. (c) "Therefore" signals a conclusion drawn from evidence — exactly what the blank sentence is doing.`,
        'Match: (c) Therefore.',
      ],
      example: { problem: `Marine biologists have long assumed that octopuses navigate reefs using visual landmarks alone. Recent tracking data complicates that assumption: several octopuses continued reaching the same den after researchers temporarily blinded the reef’s most visible coral formations. ______, memory of scent trails may play a larger role in octopus navigation than sight does. Which choice completes the text with the most logical transition? (a) For example, (b) Similarly, (c) Therefore, (d) However`, solution: '(c) Therefore' },
      relatedLoIds: ['dsat.transitions'],
    },
    {
      title: 'Worked sophistication trap',
      steps: [
        `Cover the blank. Sentence before: hive permits have grown sharply. Sentence after the blank: cities are now offering a second, separate incentive that keeps the same trend going.`,
        `Classify: the blank sentence adds a new, AGREEING fact on top of the first — no reversal, no single illustrative case, no stated causal chain. That is continuation.`,
        `Reject (b) "Nevertheless" first — this is the sophistication trap. It sounds advanced, but it announces a contrast that the passage never sets up; nothing here is being opposed or walked back.`,
        `Reject (c) "For example" — the tax-incentive fact isn’t an illustration of the first sentence’s claim, it’s a separate supporting fact. Reject (d) "Consequently" — that would require the text to state that the hive increase CAUSED the incentive programs, which it never does.`,
        'Match: (a) Moreover — plain addition of a second supporting fact.',
      ],
      example: { problem: `Urban beekeeping has grown rapidly in dense cities over the past decade, with permitted hives increasing by more than 300 percent in some municipalities. ______, several cities have begun offering tax incentives to residents who install rooftop hives, further accelerating the trend. Which choice completes the text with the most logical transition? (a) Moreover, (b) Nevertheless, (c) For example, (d) Consequently`, solution: '(a) Moreover' },
      relatedLoIds: ['dsat.transitions'],
    },
  ],
  pointers: [
    { content: `Sentence 2 undercuts sentence 1: the initial results only "seemed to confirm" the hypothesis, and further trials showed that impression was wrong (a measurement error inflated the data). That is CONTRAST, not continuation. The correct choice is "However" — the reversal signal sits in the words "revealed a measurement error," which "Moreover" skips right past.`, kind: 'common-error' },
    { content: `Classify the relationship FIRST — continuation, contrast, cause-and-effect, example, or sequence — before you look at the four choices.`, kind: 'tip' },
    { content: `Read the FULL second sentence, not just up to the blank; the real relationship is often hidden in a qualifier that comes after it.`, kind: 'tip' },
    { content: `Ignore how sophisticated a word sounds — match by logic, not by vocabulary level.`, kind: 'tip' },
    { content: `Don’t confuse sequence (time order: then, next) with cause-and-effect (stated result: therefore, as a result).`, kind: 'tip' },
    { content: `When two choices are same-category synonyms (e.g., *however* and *nevertheless*, or *therefore* and *thus*), neither is the answer. The SAT never makes you split hairs between true equivalents — re-read and find the category all four choices don't share.`, kind: 'tip' },
    { content: `Topic overlap ≠ continuation. Two sentences can both be about the same experiment, city, or artist and still be in CONTRAST. Ask 'does sentence 2 agree with or push back on sentence 1?' — not 'are they about the same thing?'`, kind: 'common-error' },
    { content: `Hedging verbs in sentence 1 — *seemed*, *appeared*, *was long assumed*, *predicted*, *was expected* — are contrast bait. They pre-announce that the next sentence will overturn the impression. Spot them and lean toward *However/Yet/In fact*.`, kind: 'gotcha' },
    { content: `*In fact* and *indeed* are not plain continuations — they intensify or correct, often after a negative or a concession ('the drop was not small; **in fact**, it was record-breaking'). Don't pick them where a neutral *Moreover* fits.`, kind: 'vocab-note' },
    { content: `*For example* requires ONE specific instance — a named firm, one study, one species. If the sentence after the blank is another general claim or a second broad fact, it's continuation, not illustration.`, kind: 'edge-case' },
    { content: `Cause-effect only works if the passage actually states the causal link. If the second fact merely happens after the first, you need *Meanwhile/Then/Subsequently*, not *Consequently*. 'Later in time' is not 'because of.'`, kind: 'gotcha' },
    { content: `Direction of causation matters: *Therefore/As a result* mean sentence 2 comes FROM sentence 1. If sentence 2 explains WHY sentence 1 happened, you need *After all* or *Indeed* instead — reversing the arrow is a planted wrong answer.`, kind: 'common-error' },
    { content: `The blank may sit mid-sentence or at the end, not just at the start. Read the whole sentence containing the blank plus the one before it — the classification method doesn't change, but scanning only backward will misfire.`, kind: 'edge-case' },
  ],
};
