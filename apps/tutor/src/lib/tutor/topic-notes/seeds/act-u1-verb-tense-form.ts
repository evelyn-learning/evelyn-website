/**
 * ACT — Unit 1 CED 1.4: Verb Tense & Form.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.verb-tense-form.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_VERB_TENSE_FORM: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.verb-tense-form.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Verb Tense & Form',
  planId: 'evelyn.testprep.act.verb-tense-form.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.verb-tense-form.v1' }],
  theory: [
    { loId: 'act.verb-tense-form', content: `ESTABLISH THE TIMELINE FIRST. Before judging the underlined verb, read one sentence before and one sentence after. The tense used THERE — not how the underlined verb sounds alone — is the rule you're checking against.` },
    { loId: 'act.verb-tense-form', content: `SIMPLE PAST STAYS PAST. If a paragraph narrates a past event ("volunteered," "cleaned," "read"), every verb describing that same timeline must stay simple past, even if a present-tense version would be a perfectly grammatical sentence in isolation.` },
    { loId: 'act.verb-tense-form', content: `PRESENT PERFECT ("has/have + past participle") signals an action that started in the past and still matters or continues now. Don't mix it into a passage that is narrating a finished, dated past event.` },
    { loId: 'act.verb-tense-form', content: `PAST PERFECT ("had + past participle") marks the EARLIER of two past events — the "sequence of tenses" rule. When a sentence compares two things that both happened in the past, the one that happened first takes "had + participle"; the later, reference event stays simple past.` },
    { loId: 'act.verb-tense-form', content: `SIGNAL WORDS EARN A SHIFT. Words like "now," "today," "currently," "by the time," or "already" justify a tense change. No signal word present ⟹ no earned shift; the passage's tense holds.` },
    { loId: 'act.verb-tense-form', content: `VERB FORM IS A SEPARATE CHECK FROM TENSE. After an auxiliary like "has," "have," "had," or "will have," the verb must take its PAST PARTICIPLE form (written, gone, seen, done) — not the simple past form (wrote, went, saw, did). This trips students who know the right tense but plug in the wrong form.` },
    { loId: 'act.verb-tense-form', kind: 'framework', title: 'Trap', content: `TRAP — SOUNDS-RIGHT-ALONE: the ACT deliberately writes the underlined verb so it reads naturally as a stand-alone sentence. It is designed to pass a "does this sound okay?" check while failing the paragraph-timeline check.` },
    { loId: 'act.verb-tense-form', kind: 'framework', title: 'Trap', content: `TRAP — UNSIGNALED SHIFT: a passage that drifts from past to present (or back) with no signal word is an ERROR to fix, not a stylistic choice the author is allowed to make.` },
    { loId: 'act.verb-tense-form', kind: 'definition', title: 'tense consistency', content: `keeping every verb describing the same timeline in the same tense unless a signal word justifies a shift.` },
    { loId: 'act.verb-tense-form', kind: 'definition', title: 'past perfect', content: `"had + past participle" — marks the earlier of two past events (e.g., "had spread" before "arrived").` },
    { loId: 'act.verb-tense-form', kind: 'definition', title: 'sequence of tenses', content: `the rule governing which of two related events gets simple past and which gets past perfect, based on which happened first.` },
    { loId: 'act.verb-tense-form', kind: 'definition', title: 'verb form', content: `the specific shape a verb takes after an auxiliary (participle: written, gone, seen) versus its simple-past shape (wrote, went, saw).` },
  ],
  methods: [
    {
      title: 'Worked tense consistency',
      steps: [
        `Read the sentences around the underline: "volunteered," "cleaned," and "read" are all simple past — the paragraph has clearly established a past-tense, finished-summer timeline.`,
        `"WALKS" is present tense, breaking that established sequence — even though "She walks the dogs" is a perfectly fine sentence in isolation.`,
        `Check for a signal word that would justify a shift to present tense (now, today, currently). There is none.`,
        'The underlined verb must match "cleaned" and "read": simple past, "walked."',
      ],
      example: { problem: `Last summer, Maria volunteered at the animal shelter every weekend. She "WALKS" the dogs, cleaned the kennels, and read to the cats to help them get used to human voices. Which choice best fixes the underlined verb?`, solution: 'walked' },
      relatedLoIds: ['act.verb-tense-form'],
    },
    {
      title: 'Worked sequence of tenses',
      steps: [
        `Two past events are being compared: the trucks arriving, and the flames spreading. Both happened in the past, but not at the same time.`,
        `"By the time" and "already" are sequence-of-tenses signal words — they flag that one past event finished BEFORE another past event.`,
        '"Arrived" is the later, reference event, so it correctly stays simple past.',
        `The earlier event — the spreading — needs past perfect: "had spread." Trap: "spread" alone (NO CHANGE) reads fine as an isolated sentence, but it fails the two-events-in-sequence test.`,
      ],
      example: { problem: `By the time the fire trucks arrived, the flames already "SPREAD" to the roof next door. Which choice best fixes the underlined verb?`, solution: 'had spread' },
      relatedLoIds: ['act.verb-tense-form'],
    },
  ],
  pointers: [
    { content: `ACT verb tense/form questions are graded against the paragraph's established timeline, not the underlined sentence in isolation. Always read a sentence before and after, identify the tense already in use, and check for a signal word before allowing any shift.`, kind: 'common-error' },
    { content: `Read a sentence before AND after the underlined verb — the surrounding tense is the rule, not how the verb sounds alone.`, kind: 'tip' },
    { content: 'No signal word (now, today, by the time, already) means no earned tense shift.', kind: 'tip' },
    { content: `"Had + past participle" (past perfect) marks whichever of two past events happened FIRST; the later, reference event stays simple past.`, kind: 'tip' },
    { content: `Verb FORM is a separate check from tense: match the participle to the auxiliary (will have written, has gone), not the simple-past shape (wrote, went).`, kind: 'tip' },
    { content: `When the four choices differ ONLY in tense/form (walk / walks / walked / had walked), that's your cue to stop reading the underlined sentence alone and scan the sentences before and after for the timeline. Choices differing in -s only (walk vs. walks) are agreement, not tense.`, kind: 'tip' },
    { content: `Don't slap past perfect on every past-tense verb. "Had + participle" is only correct when a SECOND, later past event is present in the sentence or the one right before it. One past event standing alone = simple past. Extra "had"s are a wrong-answer flavor the ACT loves.`, kind: 'common-error' },
    { content: `Verb-form traps hide behind irregulars whose past and participle differ: had *gone* (not went), has *seen* (not saw), will have *written* (not wrote), had *begun*, had *drunk*, had *taken*. If an auxiliary sits before the underline, say the participle out loud before choosing.`, kind: 'gotcha' },
    { content: `A tense shift ACROSS paragraphs can be legitimate: a passage may narrate a person's past in past tense, then describe their current work in present. Match the verb to the timeline of the CONTENT it describes, not to whatever tense the essay opened with.`, kind: 'edge-case' },
    { content: `General truths, ongoing facts, and what a text/artwork "does" stay PRESENT even inside a past-tense narrative: "She realized that water *boils* at a lower altitude," "His 1902 essay *argues* that..." Don't drag these into past just to match the surrounding sentences.`, kind: 'edge-case' },
    { content: `Watch for choices that swap a finite verb for an -ing or having- form ("the flames spreading," "having spread"). Those aren't tense options — they kill the sentence's main verb and create a fragment. Check that a real verb still remains before scoring the tense.`, kind: 'gotcha' },
    { content: `Sequence signals usually sit at the START of the sentence, before the underline: "By the time," "Before," "After," "Once," "Until," "Previously," "already." Read from the sentence's first word, not from the underline, or you'll miss the cue that earns past perfect.`, kind: 'tip' },
    { content: `NO CHANGE is a real answer here. If the surrounding verbs are simple past and the underlined verb is simple past, stop and pick it — don't invent a reason to "upgrade" to present perfect or past perfect just because the question was asked.`, kind: 'common-error' },
  ],
};
