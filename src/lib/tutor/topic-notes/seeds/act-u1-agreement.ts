/**
 * ACT — Unit 1 CED 1.3: Subject-Verb & Pronoun Agreement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.agreement.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_AGREEMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.agreement.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Subject-Verb & Pronoun Agreement',
  planId: 'evelyn.testprep.act.agreement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.agreement.v1' }],
  theory: [
    { loId: 'act.agreement', content: `FIND THE TRUE SUBJECT FIRST. Cross out prepositional phrases ("of the trophies," "along the wall") and participial phrases ("showing the trails") — the verb must agree with what is left, not with the closest noun.` },
    { loId: 'act.agreement', content: `AND vs OR/NOR. Subjects joined by "and" are plural ("Marcus and Priya were..."). Subjects joined by "or"/"nor" agree with the NEARER subject ("Either the coach or the players were...").` },
    { loId: 'act.agreement', content: `INDEFINITE PRONOUNS ARE SINGULAR. Everybody, everyone, someone, no one, each, neither, and either are always singular, even when they describe a crowd.` },
    { loId: 'act.agreement', content: `COLLECTIVE / ENTITY NOUNS ARE SINGULAR. A team, a company, a bakery, a committee acts as ONE unit — pair it with "is/has/its," not "are/have/their," unless members are described acting individually.` },
    { loId: 'act.agreement', content: `PRONOUNS NEED ONE CLEAR ANTECEDENT. If a pronoun could point to two different nouns ("Marcus told Coach Alvarez that he..."), the ACT flags it — swap in the specific noun instead.` },
    { loId: 'act.agreement', content: `TRAP: THE INTERVENING NOUN. The ACT loves burying a plural noun right before a singular verb (or vice versa) inside a modifying phrase — that nearby noun is bait, not the subject.` },
    { loId: 'act.agreement', content: `NO CHANGE IS A REAL ANSWER. If the sentence is already correct, do not force an edit — roughly a quarter of ACT English answers are NO CHANGE.` },
    { loId: 'act.agreement', kind: 'definition', title: 'antecedent', content: 'the noun a pronoun refers back to.' },
    { loId: 'act.agreement', kind: 'definition', title: 'indefinite pronoun', content: `a pronoun like everyone, each, or neither that doesn't name a specific person but is grammatically singular.` },
    { loId: 'act.agreement', kind: 'definition', title: 'collective noun', content: 'a singular noun that names a group acting as one unit (team, company, family).' },
    { loId: 'act.agreement', kind: 'definition', title: 'intervening phrase', content: `a prepositional or participial phrase sitting between the subject and verb that can disguise the true subject.` },
  ],
  methods: [
    {
      title: 'Worked true subject',
      steps: [
        `Strip the intervening phrases: "of trophies" and "along the back wall" are prepositional phrases, not the subject.`,
        'What is left is "row" — singular.',
        'A singular subject needs a singular verb: "GLEAM" (plural form, no -s) is wrong.',
        `Trap check: "trophies" sits right before the verb and is plural, which lures the eye — but it lives inside a prepositional phrase and can never be the subject.`,
      ],
      example: { problem: `From an essay about a debate team: "The row of trophies along the back wall 'GLEAM' under the classroom lights every afternoon." Is "GLEAM" the correct verb, and if not, what should replace it?`, solution: 'GLEAMS — the subject is the singular "row," not the plural "trophies."' },
      relatedLoIds: ['act.agreement'],
    },
    {
      title: 'Worked entity pronoun',
      steps: [
        'Find the antecedent: "their" is supposed to point back to "the bakery."',
        `"Bakery" names a single business — grammatically singular, even though people run it.`,
        'A singular antecedent needs a singular possessive pronoun: "its," not "their."',
        `Trap check: because a bakery is made of people, "their" feels natural in speech — but the noun itself is singular.`,
      ],
      example: { problem: `From an essay about a family bakery: "The bakery has built 'their' reputation on Saturday-morning cinnamon rolls that sell out by nine o'clock." Is "their" correct, or does the pronoun need to change?`, solution: `ITS — the bakery, a singular entity, needs the singular possessive "its," not "their."` },
      relatedLoIds: ['act.agreement'],
    },
  ],
  pointers: [
    { content: `These indefinite pronouns are grammatically singular no matter how many people they describe. The sentence should read "Everybody in the office IS working late tonight."`, kind: 'common-error' },
    { content: `Strip prepositional and participial phrases to find the sentence's TRUE subject before choosing a verb.`, kind: 'tip' },
    { content: `Compound subjects joined by "or"/"nor" agree with the NEARER noun; joined by "and" they are plural.`, kind: 'tip' },
    { content: `Indefinite pronouns (everybody, everyone, each, neither) and singular entities (a bakery, a company) take singular verbs and singular pronouns ("its," not "their").`, kind: 'tip' },
    { content: `A pronoun needs exactly ONE clear antecedent — if two nouns could be "he/she/it," name the specific noun instead.`, kind: 'tip' },
    { content: `Inverted sentences hide the subject *after* the verb: "Behind the bleachers **sit** three storage bins." Ignore word order — the subject is "bins." Same with "There is/are": in "There **are** several reasons," the subject is "reasons."`, kind: 'edge-case' },
    { content: `"As well as," "along with," "in addition to," "together with," and "including" do NOT create a plural subject. "The coach, along with the players, **is** boarding." Only the word *and* makes a compound plural.`, kind: 'gotcha' },
    { content: `Check verbs across a long underlined stretch, not just the word nearest the subject. If the answer choices differ only by **is/are** or **has/have** — or only by **it/they** or **its/their** — the question is testing agreement, nothing else. Read the choices before rereading the sentence.`, kind: 'tip' },
    { content: `Don't confuse **its** (possessive, no apostrophe) with **it's** (it is). Agreement questions often bundle in this spelling trap: "The company announced **its** merger" — never "it's." Same for **their / they're / there** and **whose / who's**.`, kind: 'common-error' },
    { content: `A pronoun can be ambiguous even when both nouns are grammatically fine. "Marcus told Coach Alvarez that **he** was late" is not a verb error — the fix is naming the person. If two same-gender nouns precede the pronoun, expect a rewrite among the choices.`, kind: 'gotcha' },
    { content: `Watch for a vague **this**, **that**, **which**, or **it** pointing at a whole previous clause rather than a noun. "Attendance dropped, which frustrated the board" is loose — the ACT often offers a version that names the thing: "a decline that frustrated the board."`, kind: 'edge-case' },
    { content: `With **or/nor**, rewrite mentally with the second element only: "Either the coach or the **players were**..." but "Either the players or the **coach was**..." Order matters. Flipping the two nouns flips the verb — the ACT tests both directions.`, kind: 'tip' },
    { content: `Fractions, percentages, and "a number of" follow the noun in the *of* phrase — the one exception to stripping. "Half of the cake **is** gone" vs. "Half of the cookies **are** gone." Note: "the number of students **is**," but "a number of students **are**."`, kind: 'edge-case' },
  ],
};
