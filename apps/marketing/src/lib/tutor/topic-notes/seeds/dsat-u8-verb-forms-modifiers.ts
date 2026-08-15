/**
 * Digital SAT — Unit 8 CED 8.3: Verb Tense, Verb Forms & Modifier Placement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.verb-forms-modifiers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U8_VERB_FORMS_MODIFIERS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.verb-forms-modifiers.v1',
  course: 'Digital SAT',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Verb Tense, Verb Forms & Modifier Placement',
  planId: 'evelyn.testprep.dsat.verb-forms-modifiers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.verb-forms-modifiers.v1' }],
  theory: [
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Test format', content: `TEST FORMAT — these questions give a short text with a blank or underlined portion and ask which choice is most logical or grammatically correct GIVEN THE SENTENCE'S OWN SIGNALS, not what "sounds natural."` },
    { loId: 'dsat.verb-forms-modifiers', content: `TENSE-SIGNAL WORDS decide the tense. Words like "since," "by the time," "already," "next year" anchor the timeline — find them before picking a verb.` },
    { loId: 'dsat.verb-forms-modifiers', content: `PAST PARTICIPLE vs SIMPLE PAST — after have/has/had, or in passive voice with "be," use the PAST PARTICIPLE, never simple past. "had gone" not "had went"; "was written" not "was wrote". Common irregulars: go/went/gone, write/wrote/written, begin/began/begun, do/did/done, see/saw/seen, eat/ate/eaten.` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Perfect tenses mark sequence', content: `PERFECT TENSES MARK SEQUENCE — "had + past participle" (past perfect) marks an action completed BEFORE another past event. "By the time she arrived, the meeting HAD ALREADY STARTED" — started first, arrived second. The later reference point in the sentence takes plain simple past, not another perfect form.` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Subjunctive mood', content: `SUBJUNCTIVE MOOD — hypothetical, contrary-to-fact "if" clauses use WERE for every subject, singular or plural: "If the museum WERE open..." (it isn't). Verbs of demand/recommendation (insist, require, recommend) + "that" take the base form: "The board insists that she SUBMIT the report" (not submits).` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Dangling modifier', content: `DANGLING MODIFIER — an introductory phrase (often ending in -ing or -ed) must logically describe the SUBJECT of the very next clause. If the noun right after the comma can't do the action, the modifier is dangling. Signature trap: "Walking to school, the rain soaked my backpack." Rain can't walk. Fix: "Walking to school, I got soaked by the rain."` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Misplaced modifier', content: `MISPLACED MODIFIER — limiting words (only, almost, just, even) and descriptive phrases change meaning depending on where they sit; they must sit next to the exact word they modify. "I almost failed every test" (didn't fail any) vs "I failed almost every test" (failed most of them).` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'framework', title: 'Trap to watch', content: `TRAP TO WATCH — every answer choice is usually a grammatically fine sentence in isolation. Only ONE matches the tense/sequence signals already present elsewhere in the text — scan the surrounding verbs before picking.` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'definition', title: 'past participle', content: `the verb form paired with have/has/had or passive "be" (gone, written, seen) — often different from the simple past form.` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'definition', title: 'dangling modifier', content: `an introductory phrase with no logical subject in the sentence for it to attach to.` },
    { loId: 'dsat.verb-forms-modifiers', kind: 'definition', title: 'subjunctive mood', content: `the verb form ("were," or the base form after demand verbs) used for hypothetical, contrary-to-fact, or demand statements.` },
  ],
  methods: [
    {
      title: 'Worked tense sequence',
      steps: [
        `Find the anchor clause: "more than three years HAD PASSED" — past perfect, meaning that stretch of time was already complete before some later past reference point.`,
        `The blank names that later reference point ("by the time the renovation ___"), so it needs plain SIMPLE PAST — stacking another perfect form ("had finished") leaves no reference point at all.`,
        `Eliminate "finishes" and "was finishing" — present tense and past progressive don't fit a narrative already anchored in the past by "had passed."`,
        `Correct: "finished." "By the time the renovation FINISHED, three years HAD PASSED since the announcement" — the perfect verb marks the earlier event, the simple past verb marks the reference point.`,
      ],
      example: { problem: `Read the text: "By the time the museum's renovation ___, more than three years had passed since the initial announcement. Curators say the new wing opens to the public next spring." Which choice most logically completes the blank: "finished," "had finished," "finishes," or "was finishing"?`, solution: 'finished' },
      relatedLoIds: ['dsat.verb-forms-modifiers'],
    },
    {
      title: 'Worked dangling modifier',
      steps: [
        `Identify the introductory modifier: "Walking to school." This phrase must describe whoever or whatever is named right after the comma.`,
        `Read the noun right after the comma: "the rain." Logical check — can rain walk to school? No.`,
        `DANGLING MODIFIER: as written, the sentence illogically claims the rain was walking.`,
        `Fix by making the modifier's true subject the sentence's grammatical subject: "Walking to school, Priya got her backpack soaked by the rain before she reached the front doors."`,
      ],
      example: { problem: `Read the sentence: "Walking to school, the rain soaked Priya's backpack before she reached the front doors." What is the error, and how should it be fixed?`, solution: `Dangling modifier — revise so "Priya" (the one walking) is the subject right after the comma: "Walking to school, Priya got her backpack soaked by the rain before she reached the front doors."` },
      relatedLoIds: ['dsat.verb-forms-modifiers'],
    },
  ],
  pointers: [
    { content: `This "if" clause is hypothetical and contrary-to-fact ("I" am not "you") — that always takes the SUBJUNCTIVE "were," no matter the subject. Correct: "If I WERE you, I would apply early." Save "was" for ordinary past-tense facts: "I was tired yesterday."`, kind: 'common-error' },
    { content: `Scan the sentence for its own time-signal words (since, by the time, already) — they decide the correct tense, not "what sounds right."`, kind: 'tip' },
    { content: `After have/has/had, or in passive voice, use the PAST PARTICIPLE, never simple past: had gone, was written — never had went, was wrote.`, kind: 'tip' },
    { content: `Hypothetical "if" clauses and demand verbs (insist that she go) take the SUBJUNCTIVE — "were" for every subject, base form after demand verbs.`, kind: 'tip' },
    { content: `An introductory modifier must logically describe the subject right after the comma. If that noun can't do the action, it's dangling — fix by making the modifier's true subject the sentence's subject.`, kind: 'tip' },
    { content: `"Since [a past point]" + an effect still running through now = **present perfect** (has/have risen), NOT past perfect. Reserve "had" for a timeline that ends before another *past* event. "Since their first survey" + "now link" → *has risen*.`, kind: 'gotcha' },
    { content: `Not every intro phrase before a comma is a modifier that must match the subject. If the phrase has its OWN subject ("Because the rain fell hard, my backpack got soaked"), nothing is dangling. Only subjectless phrases (-ing, -ed, "To do X") can dangle.`, kind: 'edge-case' },
    { content: `Dangling-modifier fixes often hide in the SUBJECT of the answer choices, not the modifier. All four choices may keep "Excited about the science fair," and differ only in the noun after the comma. Read the first word after the comma of each choice first.`, kind: 'tip' },
    { content: `Passive voice is the sneakiest participle trap: "was wrote," "were began," "is drank" sound almost fine when read fast. Any "be" verb (is/was/were/been/being) + verb = must be the -en/-ne/-un participle form.`, kind: 'common-error' },
    { content: `"Only" belongs immediately before the word it limits. "The lab only tested three samples" (they did nothing but test) vs. "The lab tested only three samples" (just three). If choices differ solely in where *only/just/almost/even* sits, meaning — not grammar — is the test.`, kind: 'gotcha' },
    { content: `After insist/demand/require/recommend/suggest/propose + **that**, use the BASE form for every subject — "requires that he *be* present," "recommends that the data *be* shared." The -s form ("requires that he is") is the planted wrong answer.`, kind: 'vocab-note' },
    { content: `"Were" is subjunctive only when the situation is contrary to fact. "If the sample **were** contaminated, results would differ" (hypothetical) vs. "If the sample **was** contaminated, that explains the results" (a real possibility being considered). Check for *would* in the other clause.`, kind: 'edge-case' },
    { content: `Before picking any verb, underline every other verb in the passage — the SAT anchors the timeline outside the sentence with the blank. All four choices will be grammatical alone; only one matches the surrounding tenses.`, kind: 'tip' },
  ],
};
