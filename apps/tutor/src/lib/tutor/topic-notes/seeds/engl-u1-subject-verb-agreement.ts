/**
 * HS English — Unit 1 CED 1.2: Subject-Verb Agreement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.subject-verb-agreement.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U1_SUBJECT_VERB_AGREEMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.subject-verb-agreement.v1',
  course: 'HS English',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Subject-Verb Agreement',
  planId: 'evelyn.hs.engl.subject-verb-agreement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.subject-verb-agreement.v1' }],
  theory: [
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'The two-step routine', content: `THE TWO-STEP ROUTINE — (1) find the verb, (2) ask "who or what actually does this?" That word is the TRUE subject, and the verb agrees with it — never with whatever noun happens to sit closest.` },
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'Interrupting phrases', content: `INTERRUPTING PHRASES — prepositional phrases ("of the players", "in the boxes") and asides ("along with", "as well as", "including") sit between subject and verb but NEVER change the number: "The basket of apples sits on the counter." Cross the interrupters out and the subject stands alone.` },
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'Compound subjects', content: `COMPOUND SUBJECTS — two subjects joined by "and" are plural ("Maya and Jordan run the club"). Joined by "or"/"nor", the verb agrees with the NEARER subject: "Neither the players nor the coach was ready." Flip the order and the verb flips: "Neither the coach nor the players were ready."` },
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'Indefinite pronouns', content: `INDEFINITE PRONOUNS — each, either, neither, everyone, everybody, nobody, anyone are SINGULAR even when an of-phrase follows: "Each of the drafts needs a title." Both, few, many, several are plural. Some, all, most, none take their number from the of-phrase noun.` },
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'Inverted order', content: `INVERTED ORDER — in sentences starting with "There is/There are" and in questions, the subject comes AFTER the verb. Find it before choosing: "There are a printer and two laptops in the lab" (subject = a printer and two laptops, plural).` },
    { loId: 'engl.subject-verb-agreement', kind: 'framework', title: 'Collective nouns', content: `COLLECTIVE NOUNS — team, committee, class, band act as one unit and usually take a singular verb in American English: "The team practices at dawn." The members-acting-separately plural is rare in school writing — default to singular.` },
    { loId: 'engl.subject-verb-agreement', kind: 'definition', title: 'true subject', content: `the word that actually performs the verb, found by asking "who or what does this?" — not the nearest noun.` },
    { loId: 'engl.subject-verb-agreement', kind: 'definition', title: 'interrupting phrase', content: `a phrase (often prepositional) between subject and verb that does not affect the verb number.` },
  ],
  methods: [
    {
      title: 'Worked interrupter',
      steps: [
        'Find the verb slot: (was / were) sold.',
        `Ask who or what was sold as a whole: the COLLECTION. "Of vintage movie posters" is a prepositional phrase describing the collection — cross it out.`,
        `With the interrupter gone the sentence reads "The collection ... sold at auction." The subject "collection" is singular.`,
        `Singular subject takes the singular verb: "The collection of vintage movie posters WAS sold at auction last spring." The nearby plural "posters" was bait.`,
      ],
      example: { problem: `Choose the correct verb: "The collection of vintage movie posters (was / were) sold at auction last spring."`, solution: 'was — the true subject is the singular "collection", not "posters"' },
      relatedLoIds: ['engl.subject-verb-agreement'],
    },
    {
      title: 'Worked nearest noun trap',
      steps: [
        `This sentence is INVERTED: it opens with "There is", so the subject comes after the verb. Never trust your ear on inverted sentences — find the subject first.`,
        `Ask what exists in the backpack: "a notebook AND two chargers" — a compound subject joined by "and", which makes it plural.`,
        `A plural subject needs the plural verb: "There ARE a notebook and two chargers in my backpack."`,
        `Why the ear fails: the singular "a notebook" sits right next to the verb, so "is" sounds natural. The routine — find the whole subject, then match — beats the ear every time.`,
      ],
      example: { problem: `A student writes: "There is a notebook and two chargers in my backpack." It sounds fine aloud. Is it correct?`, solution: `No — the compound subject "a notebook and two chargers" is plural: "There are a notebook and two chargers in my backpack."` },
      relatedLoIds: ['engl.subject-verb-agreement'],
    },
  ],
  pointers: [
    { content: `Proximity is irrelevant — "of trophies" is an interrupting prepositional phrase. The true subject is the singular "box": "The box of trophies WAS moved to the gym."`, kind: 'common-error' },
    { content: `Two-step routine: find the verb, then ask "who or what does this?" — the verb agrees with that true subject.`, kind: 'tip' },
    { content: `Interrupting phrases (of-phrases, "along with", "as well as") never change the subject number.`, kind: 'tip' },
    { content: `"And" makes compounds plural; "or"/"nor" agree with the nearer subject; each/neither/everyone are singular.`, kind: 'tip' },
    { content: `In "There is/are" sentences and questions, the subject comes AFTER the verb — find it before you match.`, kind: 'tip' },
    { content: `"Along with", "as well as", "including", and "together with" are NOT the word "and". They start interrupters, so the subject stays singular: "The debate team, along with its two coaches, **travels**." Only a real "and" builds a plural compound.`, kind: 'gotcha' },
    { content: `Say "true subject," not "the noun before the verb." The true subject is whoever/whatever performs the verb — proximity means nothing. In "The box of trophies ___ moved," the subject is *box*, not the neighboring *trophies*.`, kind: 'vocab-note' },
    { content: `Don't trust your ear on "There is/There are" sentences — the subject sits after the verb. "There **are** a notebook and two chargers" sounds odd but is correct. Rewrite mentally as "A notebook and two chargers are there" to hear it.`, kind: 'common-error' },
    { content: `With "or"/"nor", the verb matches the NEARER subject only — and the order can be flipped. "Neither the players nor the coach **was** ready" but "Neither the coach nor the players **were** ready." Check which subject actually touches the verb.`, kind: 'edge-case' },
    { content: `"Each, either, neither, everyone, everybody, nobody, anyone" stay singular even when a plural of-phrase follows: "Neither of the essay drafts **has** a strong opening." The of-phrase is an interrupter, not the subject.`, kind: 'common-error' },
    { content: `"Some, all, most, none" break the pattern — they take their number FROM the of-phrase: "Most of the pizza **is** gone" vs. "Most of the slices **are** gone." These are the exception to 'ignore the of-phrase.'`, kind: 'edge-case' },
    { content: `Collective nouns — team, committee, class, band, family, jury — act as one unit and take singular verbs in American English: "The committee **decides** today." Don't pluralize just because the group contains many people.`, kind: 'gotcha' },
    { content: `Self-check: physically cross out every phrase starting with of, in, on, with, from, along with, or as well as. Whatever subject is left standing decides the verb. If you can't find a subject after crossing out, you deleted too much.`, kind: 'tip' },
  ],
};
