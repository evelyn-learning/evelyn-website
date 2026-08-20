/**
 * Grade 7 ELA — Usage: Pronouns & Antecedents.
 *
 * Procedure-led (CCSS L.7.1). Two skills sit under one lesson. The first is
 * AGREEMENT: a pronoun matches its antecedent in number. The second, and the
 * one that actually damages student writing, is CLARITY: a pronoun that could
 * point at two different nouns, or that points at nothing at all.
 *
 * NOTE FOR FUTURE AUTHORS — two things this file deliberately does:
 * 1. Singular "they" is taught as CORRECT and standard, both for a person
 *    whose gender is unknown or unstated and after indefinite pronouns
 *    ("Somebody left their jacket"). Do not "fix" this file back to the old
 *    generic-he rule; modern usage abandoned it and so did we.
 * 2. Every ungrammatical or unclear example is labeled WRONG with the
 *    CORRECT version beside it. A tutor reads these aloud, and an unlabeled
 *    bad sentence would be presented to the student as a model.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U5_PRONOUNS_AND_ANTECEDENTS: LessonPlan = {
  id: 'evelyn.ms.m7ela.pronouns-and-antecedents.v1',
  title: 'Pronouns & Antecedents',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.pronouns-and-antecedents',
      standard: 'M7ELA-5.3',
      description:
        'Match every pronoun to an antecedent that agrees with it in number, and revise pronouns whose reference is ambiguous or missing so that a reader can point to exactly one noun the pronoun stands for (CCSS L.7.1).',
    },
  ],
  prerequisites: ['m7ela.subject-verb-agreement'],
  followUps: ['m7ela.verb-tense-consistency'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a pronoun with two possible owners is a real, everyday communication failure.',
      script:
        'Your cousin texts you this: "I told Sam he could borrow it until Friday." You read it twice. Borrow what? And who is he, Sam or somebody else? Now you have to send a message back just to find out what the first message meant. That is what a loose pronoun does. Pronouns are tiny words like she, he, they, it and this, and each one is standing in for a noun somewhere nearby. When the reader can point at that noun instantly, the sentence works. When the reader has to guess between two nouns, or cannot find a noun at all, the sentence stalls. Today you learn to run one quick check on every pronoun you write.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pronouns-and-antecedents',
      kind: 'concept',
      goal: 'Define antecedent, install number agreement, license singular they, then teach the two clarity failures and the point-at-it test.',
      keyIdeas: [
        'A PRONOUN STANDS IN FOR A NOUN, AND THAT NOUN IS THE ANTECEDENT. In "Marisol grabbed her helmet," the pronoun is "her" and the antecedent is "Marisol." The antecedent almost always comes first, which is what the word means: the thing that goes before. Every time you write a pronoun, some noun is doing the real work behind it.',
        'AGREEMENT IN NUMBER — one thing takes a singular pronoun, more than one takes a plural pronoun. WRONG: "The two goats got out of the pen, and it ate the tulips." CORRECT: "The two goats got out of the pen, and they ate the tulips." Two goats is plural, so the pronoun has to be plural. Check the antecedent, not whichever noun happens to sit closest to the pronoun.',
        'SINGULAR "THEY" IS CORRECT AND NORMAL. Use it for one person whose gender you do not know or have not been told: "Somebody left their jacket on the bleachers, and they never came back for it." Use it after the indefinite pronouns somebody, anybody, everybody, everyone, nobody and each: "Everyone should bring their own water bottle." The pronoun stays "they," and the verb that follows stays plural in form: "they were," never "they was." Never use "it" for a person. WRONG: "The new student forgot its lunch." CORRECT: "The new student forgot their lunch."',
        'CLARITY FAILURE ONE, TWO POSSIBLE OWNERS. If a pronoun could sensibly point at two different nouns, the reader has to guess, and half of them will guess wrong. WRONG: "When Maya met Priya, she was already late." Who was late? Both names are singular, both are people, and both are right there. THE FIX IS TO RENAME ONE OF THEM. CORRECT: "When Maya met Priya, Priya was already late." Repeating a name feels clumsy for one second and stays clear forever.',
        'CLARITY FAILURE TWO, NO ANTECEDENT AT ALL. A pronoun with no noun behind it is pointing at empty air. WRONG: "They say the pool opens Friday." Who is "they"? CORRECT: "The parks department says the pool opens Friday." The same trap catches a floating "it" and a floating "this." WRONG: "I lost my key and missed the bus. This ruined my morning." "This" has no noun to attach to, because a whole sentence is not a noun. CORRECT: "I lost my key and missed the bus. Those two mistakes ruined my morning."',
        'THE POINT-AT-IT TEST, AND WHEN TO RUN IT. For every pronoun, try to put your finger on the one noun it stands for. If you can find exactly one, keep the pronoun. If you find two, name the one you mean. If you find none, delete the pronoun and name the thing. Run this test hardest when two people of the same kind are in the sentence, and whenever a sentence starts with "they," "it" or "this."',
      ],
      vocabulary: [
        { term: 'pronoun', definition: 'a word such as she, he, they, it, this or who that stands in for a noun.' },
        { term: 'antecedent', definition: 'the noun a pronoun stands for, and the noun it must agree with in number.' },
        { term: 'indefinite pronoun', definition: 'a word such as somebody, everyone, nobody or each that names a person or thing without saying which one.' },
        { term: 'ambiguous reference', definition: 'a pronoun that could sensibly point at two different nouns, so the reader cannot tell which is meant.' },
        { term: 'vague reference', definition: 'a pronoun such as they, it or this with no noun behind it at all.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-agreement-check',
      kind: 'worked_example',
      problem:
        'Two sentences. Decide whether each pronoun agrees with its antecedent, and fix the one that does not. (1) "My two goldfish looked hungry, so I fed it before school." (2) "Each camper packed their own sleeping bag."',
      steps: [
        'Start with sentence 1. Find the pronoun: "it." Then find the antecedent by asking what the pronoun stands for. The thing being fed is the goldfish, so "goldfish" is the antecedent.',
        'Count the antecedent. "My two goldfish" is more than one, so the antecedent is plural, and a plural antecedent needs a plural pronoun.',
        '"It" is singular, so the sentence does not agree. WRONG: "My two goldfish looked hungry, so I fed it before school." CORRECT: "My two goldfish looked hungry, so I fed them before school."',
        'Notice what did not decide this. The noun sitting closest to the pronoun is "school," and nobody fed a school. Always find the antecedent by meaning, then count it.',
        'Now sentence 2. Find the pronoun: "their." Find the antecedent: "Each camper." That means one camper at a time, and the sentence has told you nothing about who that camper is.',
        'Sentence 2 is already correct, so leave it alone. "Their" is the standard pronoun for one person whose gender is unknown or unstated, and it is the standard pronoun after indefinite words such as each, everyone and somebody. Do not change it to "his," and do not stretch it into "his or her." CORRECT as written: "Each camper packed their own sleeping bag."',
      ],
      answer:
        'Sentence 1 needs a repair: CORRECT: "My two goldfish looked hungry, so I fed them before school." Sentence 2 needs no repair at all, because singular "their" is the standard choice after an indefinite word like each.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-possible-owners',
      kind: 'worked_example',
      problem:
        'Repair this sentence so a reader cannot guess wrong. WRONG: "When Maya met Priya, she was already late." Assume the writer means that Priya was late.',
      steps: [
        'Find the pronoun: "she." Now list every noun in the sentence that "she" could stand for. Maya. Priya. That is two, and both are singular people.',
        'Two candidates means the sentence is ambiguous. The reader picks one, has a fifty-fifty chance, and never finds out they picked wrong. Nearness does not settle it either, even though "Priya" is closer.',
        'Fix one, and the fix to reach for first: rename the person you mean. CORRECT: "When Maya met Priya, Priya was already late." The repeated name costs you one word and buys total clarity.',
        'Fix two, reorder the sentence so the pronoun has only one place to land. CORRECT: "Priya was already late when Maya met her." Here "her" cannot mean Maya, because Maya is the one doing the meeting, so only Priya is left.',
        'A fix that does NOT work is shuffling the words without naming anybody. WRONG: "She was already late when Maya met Priya." That is worse, because now the pronoun arrives before either name.',
        'A fix that changes your meaning is not a fix either. "When Maya met Priya, Maya was already late" is a perfectly clear sentence, but it reports the opposite fact. Always check that the name you drop in is the one you meant.',
      ],
      answer:
        'CORRECT: "When Maya met Priya, Priya was already late." (Also correct: "Priya was already late when Maya met her.")',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ambiguous-revision',
      kind: 'try_yourself',
      problem:
        'A student writes this line in a story: "Devon handed the water bottle to Luis while he was still catching his breath." The writer means that LUIS was catching his breath. Which revision makes that clear?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Devon handed the water bottle to Luis while Devon was still catching his breath.' },
        { id: 'b', text: 'Devon handed the water bottle to Luis while he himself was still catching his breath.' },
        { id: 'c', text: 'Devon handed the water bottle to Luis while Luis was still catching his breath.', correct: true },
        { id: 'd', text: 'Devon handed the water bottle to Luis while they were still catching their breath.' },
      ],
      expectedAnswer: 'Devon handed the water bottle to Luis while Luis was still catching his breath.',
      hints: [
        'List every noun the word "he" could point at. If you find two, the reader is guessing, and the repair is to name the person.',
        'Check two things about each revision: does it name exactly one person, and is that the person the writer said they meant?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-missing-antecedent',
      kind: 'try_yourself',
      problem:
        'A school flyer says: "They are moving the seventh-grade dance to the gym." The writer means the student council. Which revision fixes the pronoun problem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The student council is moving the seventh-grade dance to the gym.', correct: true },
        { id: 'b', text: 'They are moving it to the gym.' },
        { id: 'c', text: 'The seventh-grade dance is being moved to the gym by them.' },
        { id: 'd', text: 'It is moving the seventh-grade dance to the gym.' },
      ],
      expectedAnswer: 'The student council is moving the seventh-grade dance to the gym.',
      hints: [
        'Ask the point-at-it question about the word "they." Which noun in the flyer does it stand for? There is not one.',
        'When a pronoun has no antecedent anywhere, you cannot repair it by moving it or by swapping in a different pronoun. You have to name the thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-correct-one',
      kind: 'try_yourself',
      problem: 'Which sentence uses its pronouns correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My two rabbits knocked over its water bowl again this morning.' },
        { id: 'b', text: 'Everyone on the bus should keep their backpack on their lap.', correct: true },
        { id: 'c', text: 'When the new student arrived, our teacher asked me to show it around the school.' },
        { id: 'd', text: 'Marcus told Eli that he had won the raffle basket.' },
      ],
      expectedAnswer: 'Everyone on the bus should keep their backpack on their lap.',
      hints: [
        'Run both checks on every option. Does the pronoun match its antecedent in number, and can you point at exactly one noun it stands for?',
        'Watch for a plural antecedent handed a singular pronoun, an "it" used for a person, and a "he" with two names sitting in front of it. Remember that singular "their" after a word like everyone is correct.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-nearest-noun-and-writer-knows',
      kind: 'misconception_check',
      question:
        'A student writes: "Jenna passed the ball to Rosa right before she scored." A classmate asks who scored. The student answers, "Rosa is the closest name, so the sentence obviously means Rosa, and anyway I know what I meant." Where is that thinking wrong?',
      commonErrors: [
        {
          answer: 'The pronoun means Rosa, because Rosa is the noun closest to it.',
          misconception:
            'Believing that a pronoun automatically attaches to whatever noun sits nearest to it. Nearness is often how it works out, so the student promotes it into a rule.',
          correctsTo:
            'Nearness is not a rule, and it decides nothing. In "Jenna passed the ball to Rosa right before she scored," Jenna could easily have passed, gotten the ball back and scored. Both names are singular people, so both are live candidates, and the reader has no way to choose. Rename the one you mean. CORRECT: "Jenna passed the ball to Rosa right before Rosa scored." Nearness only appears to work when there is exactly one candidate in the first place, as in "Rosa grabbed her water bottle."',
        },
        {
          answer: 'The sentence is fine, because the writer knows who "she" is.',
          misconception:
            'Judging clarity from inside your own head. The writer is the one person who already has the answer, so the sentence sounds clear to the only reader who cannot test it.',
          correctsTo:
            'A reader has the words on the page and nothing else. The real test is to hand the sentence to somebody with no background and ask them to point at the one noun the pronoun stands for. If they hesitate, the sentence is broken, no matter how obvious it felt while you were writing it. The repair is always the same: name the person, or rebuild the sentence so only one candidate is left.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A pronoun stands in for a noun called its antecedent, and the two must match in number. WRONG: "The two goats got out, and it ate the tulips." CORRECT: "The two goats got out, and they ate the tulips."',
        'Singular "they" is correct and standard for one person whose gender is unknown or unstated, and after somebody, everyone, nobody and each: "Somebody left their jacket." Never use "it" for a person.',
        'If a pronoun could point at two nouns, the reader is guessing. WRONG: "When Maya met Priya, she was already late." CORRECT: "When Maya met Priya, Priya was already late." Rename one of them.',
        'If a pronoun points at nothing, name the thing instead. WRONG: "They say the pool opens Friday." CORRECT: "The parks department says the pool opens Friday."',
        'A whole sentence is not a noun, so a bare "this" cannot stand in for one. WRONG: "I lost my key and missed the bus. This ruined my morning." CORRECT: "Those two mistakes ruined my morning."',
        'Run the point-at-it test on every pronoun: find exactly one noun, and keep the pronoun. Find two, and name the one you mean. Find none, and name the thing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Pronouns & Antecedents' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
