/**
 * HS English — Unit 1 CED 1.4: Verb Tense & Form.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.verb-tense-and-form.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U1_VERB_TENSE_AND_FORM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.verb-tense-and-form.v1',
  course: 'HS English',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Verb Tense & Form',
  planId: 'evelyn.hs.engl.verb-tense-and-form.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.verb-tense-and-form.v1' }],
  theory: [
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Choose the tense the time relationship demands', content: `CHOOSE THE TENSE THE TIME RELATIONSHIP DEMANDS — before picking a verb, name when the action happens relative to everything else in the sentence. Simple past for a finished past event ("she trained all winter"), simple present for a habit or an ongoing truth ("she trains every winter"), future for what has not happened yet ("she will train next winter").` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Hold one tense across the passage', content: `HOLD ONE TENSE ACROSS THE PASSAGE — every verb describing the same stretch of time takes the same tense. A present-tense verb dropped into a past-tense narrative is an error, not a style choice: "Last spring we repainted the mural. First we SCRUB the bricks." (WRONG) versus "Last spring we repainted the mural. First we SCRUBBED the bricks." (CORRECT).` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Present perfect links past to now', content: `PRESENT PERFECT LINKS PAST TO NOW — "has/have + past participle" covers an action that started earlier and still continues or still matters: "I have written three drafts since Monday." Do not mix it into a narrative of a finished, dated event.` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Past perfect marks the earlier of two past events', content: `PAST PERFECT MARKS THE EARLIER OF TWO PAST EVENTS — "had + past participle" goes on whichever event happened first; the later, reference event stays simple past: "By the time the doors opened, the line HAD stretched around the block." This is the sequence-of-tenses rule.` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Signal words earn a shift', content: `SIGNAL WORDS EARN A SHIFT — now, today, currently, already, since, by the time, yesterday, and next year license a change of tense. With no such signal, the tense the passage has already established holds.` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Form is a separate check from tense', content: `FORM IS A SEPARATE CHECK FROM TENSE — after have, has, had, or will have, and in the passive with a form of "be", the verb must appear in its PAST PARTICIPLE form, never its simple past form: "had gone" and "was written" (CORRECT) versus "had went" and "was wrote" (WRONG).` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'Irregular verbs are where form breaks', content: `IRREGULAR VERBS ARE WHERE FORM BREAKS — learn all three shapes: go/went/gone, write/wrote/written, begin/began/begun, do/did/done, see/saw/seen, take/took/taken, break/broke/broken, choose/chose/chosen, ring/rang/rung. The middle shape stands alone; the third shape needs a helper in front of it.` },
    { loId: 'engl.verb-tense-and-form', kind: 'framework', title: 'The classic error', content: `THE CLASSIC ERROR — a wrong verb almost always sounds fine on its own. "She walks the dogs" is a perfectly normal sentence, and it is still wrong inside a paragraph that has been narrating last summer. Judge every verb against the timeline around it, never against how it sounds by itself.` },
    { loId: 'engl.verb-tense-and-form', kind: 'definition', title: 'past participle', content: `the third form of a verb (gone, written, broken), used after have, has, had, will have, or a form of "be" — often different from the simple past form.` },
    { loId: 'engl.verb-tense-and-form', kind: 'definition', title: 'tense consistency', content: `keeping every verb that describes the same stretch of time in the same tense unless a signal word justifies a shift.` },
    { loId: 'engl.verb-tense-and-form', kind: 'definition', title: 'past perfect', content: `"had + past participle" — marks the earlier of two past events, as in "had stretched" before "opened".` },
  ],
  methods: [
    {
      title: 'Worked hold the tense',
      steps: [
        `Name the timeline first. "All last winter" plus "coached" fixes the passage in a finished stretch of past time.`,
        `List the other verbs describing that same stretch: "ran" and "sorted". Both are simple past, so the passage has already established simple past.`,
        `Look for a signal word that would license a shift to the present — now, today, currently, these days. There is none.`,
        `Match the verb to the established tense: "and POSTED the results on the hallway board each Monday." The present-tense "posts" reads smoothly on its own, which is exactly why it is easy to miss.`,
      ],
      example: { problem: `Choose the correct verb: "All last winter, Devi coached the middle-school chess club. She ran the Saturday drills, sorted the boards after every match, and (posts / posted) the results on the hallway board each Monday."`, solution: `posted — the passage narrates a finished past winter, so every verb in it stays simple past` },
      relatedLoIds: ['engl.verb-tense-and-form'],
    },
    {
      title: 'Worked participle after helper',
      steps: [
        `Check the TENSE choice first, because it is actually correct here. "By the time" signals two past events in sequence, and the tryouts and the letter both came before the announcement, so past perfect ("had + participle") is the right tense.`,
        `The error is FORM, not tense. After the helper "had", a verb must appear in its past participle form.`,
        `"Went" is the simple past of go; the participle is "gone". "Wrote" is the simple past of write; the participle is "written".`,
        `WRONG: "had went ... had wrote." CORRECT: "By the time the coach announced the roster, Elena had gone to three tryouts and had written a letter asking for a spot."`,
        `Why writers land here: "she went" and "she wrote" are correct standing alone, so the ear approves them even after a helper. The helper is the tell — the moment you see have, has, had, or will have, switch to the third form.`,
      ],
      example: { problem: `A student writes: "By the time the coach announced the roster, Elena had went to three tryouts and had wrote a letter asking for a spot." Two verbs are wrong. Which ones, and why?`, solution: `The two forms after "had": WRONG "had went" and "had wrote"; CORRECT "had gone" and "had written."` },
      relatedLoIds: ['engl.verb-tense-and-form'],
    },
  ],
  pointers: [
    { content: `The first sentence sets a finished past timeline with "Last July" and "volunteered", and no signal word licenses a shift. WRONG: "I walk the dogs every afternoon and clean the kennels before closing." CORRECT: "I walked the dogs every afternoon and cleaned the kennels before closing." A verb that sounds fine alone can still break the passage it lives in.`, kind: 'common-error' },
    { content: `Name the time relationship first, then pick the tense — and hold that tense for every verb describing the same stretch of time.`, kind: 'tip' },
    { content: `Only a signal word (now, today, already, since, by the time, next year) earns a tense shift; without one, the established tense holds.`, kind: 'tip' },
    { content: `For two past events, the earlier one takes past perfect ("had + past participle") and the later reference event stays simple past.`, kind: 'tip' },
    { content: `Form is a separate check: after have, has, had, will have, or a form of "be", use the past participle — "had gone" and "was written", never "had went" or "was wrote".`, kind: 'tip' },
    { content: `A verb that sounds fine alone can still be wrong. "I walk the dogs" is a normal sentence — but not inside a paragraph that opened with "Last July I volunteered." Judge every verb against the passage's timeline, never against your ear.`, kind: 'common-error' },
    { content: `Don't confuse the simple past with the past participle. After **have, has, had, will have**, or any form of **be**, use the third form: "had gone," "was written" — never "had went," "was wrote."`, kind: 'vocab-note' },
    { content: `Run TWO checks on every verb, not one: (1) Is the tense right for the timeline? (2) Is the form right for the helper? A sentence can have the correct tense and still be wrong — "had went" is correct past perfect with a broken form.`, kind: 'tip' },
    { content: `In two-past-event sentences, put **had + participle** on the EARLIER action and leave the later reference event in simple past. "By the time the doors opened, the line had stretched" — not "had opened ... stretched." Ask which happened first.`, kind: 'gotcha' },
    { content: `Present perfect ("have/has written") links past to now; it does NOT belong in a narrative of a finished, dated event. "I have written it last Tuesday" is wrong — use "I wrote it last Tuesday."`, kind: 'edge-case' },
    { content: `A tense shift needs a *signal word* — now, today, currently, already, since, by the time, yesterday, next year. No signal, no shift. Changing tense just because a new sentence starts is an error, not a style choice.`, kind: 'common-error' },
    { content: `Present-tense passages follow the same rule as past ones. If a habitual passage runs "opens, set up, sort," the blank takes "show," not "showed" — consistency isn't a past-tense-only rule.`, kind: 'edge-case' },
    { content: `Memorize irregulars in all THREE shapes: begin/began/begun, ring/rang/rung, break/broke/broken, choose/chose/chosen, see/saw/seen. Two-form memory is what produces "had began" and "has rang."`, kind: 'tip' },
  ],
};
