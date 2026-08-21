/**
 * Grade 7 English Language Arts — Unit 5 CED 5.3: Pronouns & Antecedents.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.pronouns-and-antecedents.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U5_PRONOUNS_AND_ANTECEDENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.pronouns-and-antecedents.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Pronouns & Antecedents',
  planId: 'evelyn.ms.m7ela.pronouns-and-antecedents.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.pronouns-and-antecedents.v1' }],
  theory: [
    { loId: 'm7ela.pronouns-and-antecedents', content: `A PRONOUN STANDS IN FOR A NOUN, AND THAT NOUN IS THE ANTECEDENT. In "Marisol grabbed her helmet," the pronoun is "her" and the antecedent is "Marisol." The antecedent almost always comes first, which is what the word means: the thing that goes before. Every time you write a pronoun, some noun is doing the real work behind it.` },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'framework', title: 'Agreement in number', content: `AGREEMENT IN NUMBER — one thing takes a singular pronoun, more than one takes a plural pronoun. WRONG: "The two goats got out of the pen, and it ate the tulips." CORRECT: "The two goats got out of the pen, and they ate the tulips." Two goats is plural, so the pronoun has to be plural. Check the antecedent, not whichever noun happens to sit closest to the pronoun.` },
    { loId: 'm7ela.pronouns-and-antecedents', content: `SINGULAR "THEY" IS CORRECT AND NORMAL. Use it for one person whose gender you do not know or have not been told: "Somebody left their jacket on the bleachers, and they never came back for it." Use it after the indefinite pronouns somebody, anybody, everybody, everyone, nobody and each: "Everyone should bring their own water bottle." The pronoun stays "they," and the verb that follows stays plural in form: "they were," never "they was." Never use "it" for a person. WRONG: "The new student forgot its lunch." CORRECT: "The new student forgot their lunch."` },
    { loId: 'm7ela.pronouns-and-antecedents', content: `CLARITY FAILURE ONE, TWO POSSIBLE OWNERS. If a pronoun could sensibly point at two different nouns, the reader has to guess, and half of them will guess wrong. WRONG: "When Maya met Priya, she was already late." Who was late? Both names are singular, both are people, and both are right there. THE FIX IS TO RENAME ONE OF THEM. CORRECT: "When Maya met Priya, Priya was already late." Repeating a name feels clumsy for one second and stays clear forever.` },
    { loId: 'm7ela.pronouns-and-antecedents', content: `CLARITY FAILURE TWO, NO ANTECEDENT AT ALL. A pronoun with no noun behind it is pointing at empty air. WRONG: "They say the pool opens Friday." Who is "they"? CORRECT: "The parks department says the pool opens Friday." The same trap catches a floating "it" and a floating "this." WRONG: "I lost my key and missed the bus. This ruined my morning." "This" has no noun to attach to, because a whole sentence is not a noun. CORRECT: "I lost my key and missed the bus. Those two mistakes ruined my morning."` },
    { loId: 'm7ela.pronouns-and-antecedents', content: `THE POINT-AT-IT TEST, AND WHEN TO RUN IT. For every pronoun, try to put your finger on the one noun it stands for. If you can find exactly one, keep the pronoun. If you find two, name the one you mean. If you find none, delete the pronoun and name the thing. Run this test hardest when two people of the same kind are in the sentence, and whenever a sentence starts with "they," "it" or "this."` },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'definition', title: 'pronoun', content: 'a word such as she, he, they, it, this or who that stands in for a noun.' },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'definition', title: 'antecedent', content: 'the noun a pronoun stands for, and the noun it must agree with in number.' },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'definition', title: 'indefinite pronoun', content: `a word such as somebody, everyone, nobody or each that names a person or thing without saying which one.` },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'definition', title: 'ambiguous reference', content: `a pronoun that could sensibly point at two different nouns, so the reader cannot tell which is meant.` },
    { loId: 'm7ela.pronouns-and-antecedents', kind: 'definition', title: 'vague reference', content: 'a pronoun such as they, it or this with no noun behind it at all.' },
  ],
  methods: [
    {
      title: 'Worked agreement check',
      steps: [
        `Start with sentence 1. Find the pronoun: "it." Then find the antecedent by asking what the pronoun stands for. The thing being fed is the goldfish, so "goldfish" is the antecedent.`,
        `Count the antecedent. "My two goldfish" is more than one, so the antecedent is plural, and a plural antecedent needs a plural pronoun.`,
        `"It" is singular, so the sentence does not agree. WRONG: "My two goldfish looked hungry, so I fed it before school." CORRECT: "My two goldfish looked hungry, so I fed them before school."`,
        `Notice what did not decide this. The noun sitting closest to the pronoun is "school," and nobody fed a school. Always find the antecedent by meaning, then count it.`,
        `Now sentence 2. Find the pronoun: "their." Find the antecedent: "Each camper." That means one camper at a time, and the sentence has told you nothing about who that camper is.`,
        `Sentence 2 is already correct, so leave it alone. "Their" is the standard pronoun for one person whose gender is unknown or unstated, and it is the standard pronoun after indefinite words such as each, everyone and somebody. Do not change it to "his," and do not stretch it into "his or her." CORRECT as written: "Each camper packed their own sleeping bag."`,
      ],
      example: { problem: `Two sentences. Decide whether each pronoun agrees with its antecedent, and fix the one that does not. (1) "My two goldfish looked hungry, so I fed it before school." (2) "Each camper packed their own sleeping bag."`, solution: `Sentence 1 needs a repair: CORRECT: "My two goldfish looked hungry, so I fed them before school." Sentence 2 needs no repair at all, because singular "their" is the standard choice after an indefinite word like each.` },
      relatedLoIds: ['m7ela.pronouns-and-antecedents'],
    },
    {
      title: 'Worked two possible owners',
      steps: [
        `Find the pronoun: "she." Now list every noun in the sentence that "she" could stand for. Maya. Priya. That is two, and both are singular people.`,
        `Two candidates means the sentence is ambiguous. The reader picks one, has a fifty-fifty chance, and never finds out they picked wrong. Nearness does not settle it either, even though "Priya" is closer.`,
        `Fix one, and the fix to reach for first: rename the person you mean. CORRECT: "When Maya met Priya, Priya was already late." The repeated name costs you one word and buys total clarity.`,
        `Fix two, reorder the sentence so the pronoun has only one place to land. CORRECT: "Priya was already late when Maya met her." Here "her" cannot mean Maya, because Maya is the one doing the meeting, so only Priya is left.`,
        `A fix that does NOT work is shuffling the words without naming anybody. WRONG: "She was already late when Maya met Priya." That is worse, because now the pronoun arrives before either name.`,
        `A fix that changes your meaning is not a fix either. "When Maya met Priya, Maya was already late" is a perfectly clear sentence, but it reports the opposite fact. Always check that the name you drop in is the one you meant.`,
      ],
      example: { problem: `Repair this sentence so a reader cannot guess wrong. WRONG: "When Maya met Priya, she was already late." Assume the writer means that Priya was late.`, solution: `CORRECT: "When Maya met Priya, Priya was already late." (Also correct: "Priya was already late when Maya met her.")` },
      relatedLoIds: ['m7ela.pronouns-and-antecedents'],
    },
  ],
  pointers: [
    { content: `Students often say "The pronoun means Rosa, because Rosa is the noun closest to it." — Nearness is not a rule, and it decides nothing. In "Jenna passed the ball to Rosa right before she scored," Jenna could easily have passed, gotten the ball back and scored. Both names are singular people, so both are live candidates, and the reader has no way to choose. Rename the one you mean. CORRECT: "Jenna passed the ball to Rosa right before Rosa scored." Nearness only appears to work when there is exactly one candidate in the first place, as in "Rosa grabbed her water bottle."`, kind: 'common-error' },
    { content: `Students often say "The sentence is fine, because the writer knows who "she" is." — A reader has the words on the page and nothing else. The real test is to hand the sentence to somebody with no background and ask them to point at the one noun the pronoun stands for. If they hesitate, the sentence is broken, no matter how obvious it felt while you were writing it. The repair is always the same: name the person, or rebuild the sentence so only one candidate is left.`, kind: 'common-error' },
    { content: `A pronoun stands in for a noun called its antecedent, and the two must match in number. WRONG: "The two goats got out, and it ate the tulips." CORRECT: "The two goats got out, and they ate the tulips."`, kind: 'tip' },
    { content: `Singular "they" is correct and standard for one person whose gender is unknown or unstated, and after somebody, everyone, nobody and each: "Somebody left their jacket." Never use "it" for a person.`, kind: 'tip' },
    { content: `If a pronoun could point at two nouns, the reader is guessing. WRONG: "When Maya met Priya, she was already late." CORRECT: "When Maya met Priya, Priya was already late." Rename one of them.`, kind: 'tip' },
    { content: `If a pronoun points at nothing, name the thing instead. WRONG: "They say the pool opens Friday." CORRECT: "The parks department says the pool opens Friday."`, kind: 'tip' },
    { content: `A whole sentence is not a noun, so a bare "this" cannot stand in for one. WRONG: "I lost my key and missed the bus. This ruined my morning." CORRECT: "Those two mistakes ruined my morning."`, kind: 'tip' },
    { content: `Run the point-at-it test on every pronoun: find exactly one noun, and keep the pronoun. Find two, and name the one you mean. Find none, and name the thing.`, kind: 'tip' },
    { content: `Don't let the closest noun decide the antecedent. In "My two goldfish looked hungry, so I fed it before school," the nearest noun is "school" — but the antecedent is "goldfish," so it must be "them." Find the antecedent by meaning, then count it.`, kind: 'common-error' },
    { content: `"Ambiguous" and "vague" are not the same problem. Ambiguous = the pronoun could point at TWO nouns ("When Maya met Priya, she was late"). Vague = it points at NONE ("They say the pool opens Friday"). Name which one you found when you explain a fix.`, kind: 'vocab-note' },
    { content: `"Everyone," "somebody," "nobody" and "each" are singular in meaning, but the standard pronoun after them is "their"/"they." Write "Everyone should bring their own water bottle." Don't switch to "his," and don't stretch it into "his or her."`, kind: 'gotcha' },
    { content: `Singular "they" keeps plural verb forms: "they were," "they have," never "they was." But the indefinite pronoun itself stays singular: "Everyone **is** bringing their lunch."`, kind: 'edge-case' },
    { content: `Never use "it" for a person, even when you don't know who they are. WRONG: "The new student forgot its lunch." CORRECT: "The new student forgot their lunch."`, kind: 'common-error' },
    { content: `A whole sentence is not a noun, so a bare "this" has nothing to stand for. WRONG: "I lost my key and missed the bus. This ruined my morning." Fix it by naming the thing: "Those two mistakes ruined my morning."`, kind: 'gotcha' },
    { content: `"I know what I meant" is not a test. You're the one reader who can't judge. Hand the sentence to someone with no background and ask them to point at the one noun. If they hesitate, revise — no matter how obvious it felt while writing.`, kind: 'tip' },
    { content: `When you rename to fix an ambiguous pronoun, check you dropped in the name you MEANT. "When Maya met Priya, Maya was already late" is perfectly clear — and reports the opposite fact. Clear plus wrong is still wrong.`, kind: 'edge-case' },
  ],
};
