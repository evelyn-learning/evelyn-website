/**
 * Grade 7 ELA — Vocabulary Acquisition: Connotation & Denotation.
 *
 * The word-feeling lesson (CCSS L.7.5c). Denotation is the dictionary
 * meaning; connotation is the feeling a word carries on top of it. Students
 * sort near-synonyms three ways — positive, neutral, negative — and learn the
 * reading move behind it: the rung a writer picks tells you their attitude,
 * which is the same lever that built tone back in 2.4.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Items are built on objects, animals, weather and
 * behavior on purpose; do not write an item that asks a student to pin a
 * demeaning word on a person's body or looks.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U7_CONNOTATION_AND_DENOTATION: LessonPlan = {
  id: 'evelyn.ms.m7ela.connotation-and-denotation.v1',
  title: 'Connotation & Denotation',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.connotation-and-denotation',
      standard: 'M7ELA-7.3',
      description:
        'Separate a word\'s denotation from its connotation, sort near-synonyms such as thrifty, inexpensive and cheap as positive, neutral or negative, and explain what a writer\'s choice among them shows about their attitude toward the subject (CCSS L.7.5c).',
    },
  ],
  prerequisites: ['m7ela.roots-prefixes-and-suffixes'],
  followUps: ['m7ela.commonly-confused-words'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Prove in one swap that two words with the same meaning can hand a reader opposite verdicts.',
      script:
        'Your cousin cooks dinner for the first time and asks how it went. You could say the kitchen filled with a scent. You could say the kitchen filled with an odor. Look those two words up and you get almost the same definition: something you notice with your nose. But one of them gets you a second helping, and the other one gets you a look. Nothing about the dinner changed. Only the word did. That extra thing riding on top of a definition has a name, and writers pull on it in every sentence they write. Today we learn to hear it, so you stop getting surprised by your own word choices and start picking them on purpose.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-connotation',
      kind: 'concept',
      goal: 'Install denotation versus connotation, the positive/neutral/negative sort, the fact that connotation is shared, and the link from word choice back to tone.',
      keyIdeas: [
        'DENOTATION IS THE DICTIONARY MEANING — the definition you would find printed in an entry, with no feeling attached. The denotation of "house" is a building people live in. The denotation of "shack" is also a building people live in. On denotation alone, those two words are nearly the same word.',
        'CONNOTATION IS THE FEELING ATTACHED — the approval, the disapproval, or the plain nothing a word carries on top of its definition. "House" carries no verdict. "Shack" says the place is falling apart. Same denotation, different feeling, and the feeling is what the reader walks away with.',
        'SORT NEAR-SYNONYMS THREE WAYS: POSITIVE, NEUTRAL, NEGATIVE. Thrifty / inexpensive / cheap. Scent / smell / odor. Group / crowd / mob. Curious / interested / nosy. Determined / firm / stubborn. Confident / proud / arrogant. Slender / thin / scrawny. Every one of those rows means roughly one thing to a dictionary and three different things to a reader.',
        'CONNOTATION IS SHARED, NOT PRIVATE — it is not a matter of opinion with no right answer. Almost every reader hears praise in "thrifty" and a complaint in "cheap", and that agreement is exactly why the choice works. You may have your own memory tied to a word, and that is real, but on a question the test is what a typical reader hears, not what one person feels.',
        'THE RUNG A WRITER PICKS SHOWS THEIR ATTITUDE — this is the reading move, and it is the same lever that built tone. "A group of fans waited outside the arena" and "a mob of fans waited outside the arena" report the same event and argue opposite things. When you catch the swap, you are reading the writer, not just the facts.',
        'NEGATIVE IS NOT A BANNED RUNG — a negative word is not a bad word, it is a tool. If a writer wants readers to dislike how a meeting went, "nitpicking" is the right choice and "reviewing" is the wrong one. Decide the feeling you want first, then pick the rung that produces it.',
      ],
      vocabulary: [
        { term: 'denotation', definition: 'the literal dictionary meaning of a word, with no feeling attached.' },
        { term: 'connotation', definition: 'the positive, neutral or negative feeling a word carries on top of its dictionary meaning.' },
        { term: 'near-synonym', definition: 'a word that shares almost the same dictionary meaning as another word but not the same feeling.' },
        { term: 'neutral', definition: 'carrying no praise and no complaint, so the reader is left to judge for themselves.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pick-the-rung',
      kind: 'worked_example',
      problem:
        'A student is writing about the new bakery on Third Street for the school newsletter. She wants readers to want to go in. Which word belongs in the blank?\n\n"By seven in the morning the ___ of warm bread reaches the bus stop."\n\nOptions: scent, smell, odor, stench.',
      steps: [
        'Start with denotation. All four words name the same thing: something you notice with your nose. The dictionary cannot pick a winner here, so denotation is not the test.',
        'Sort the four by the feeling each one carries. "Scent" is pleasant, and it is the word used for flowers and clean laundry. "Smell" is plain and neutral. "Odor" leans unpleasant, because it is the word for a locker room or a garbage can. "Stench" is strongly negative and means a smell bad enough to make you back away.',
        'Decide the effect before choosing. The writer wants readers to WANT to walk into the bakery, so she needs the positive rung, not the neutral one and definitely not a negative one.',
        'Test the word inside the real sentence: "By seven in the morning the SCENT of warm bread reaches the bus stop." That sentence makes a reader hungry, which is the whole job.',
        'WRONG: "By seven in the morning the odor of warm bread reaches the bus stop." Every fact in that sentence is true, and it still tells readers something is off in that kitchen. CORRECT: "By seven in the morning the scent of warm bread reaches the bus stop."',
        'Say the rule you just used: when four words share a denotation, the choice is made by the feeling you want the reader to have.',
      ],
      answer:
        'scent — all four words denote a smell, and "scent" is the only rung that carries a pleasant feeling, which is the effect the writer wants.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-the-attitude',
      kind: 'worked_example',
      problem:
        'Two students describe the same twenty minutes at the skate park. What is different, and what does each writer think?\n\nVersion 1: "After school a group of kids filled the skate park. They stacked their boards by the fence and waited their turn at the ramp."\n\nVersion 2: "After school a mob of kids swarmed the skate park. They dumped their boards by the fence and waited their turn at the ramp."',
      steps: [
        'Line up the facts first, because that is the step students skip. Same place, same time, same kids, same boards, same ramp. The last seven words are identical in both versions: the kids waited their turn either way. Nothing that happened has changed.',
        'Now line up the words that did change. Group became mob. Filled became swarmed. Stacked became dumped. Three swaps, and every one of them is a near-synonym.',
        'Sort each pair. "Group" is neutral and "mob" is negative, because a mob is a group that is out of control. "Filled" is neutral and "swarmed" is negative, because swarming is what bees and wasps do. "Stacked" sounds tidy and "dumped" sounds careless.',
        'All three swaps point the same direction, and that is what lets you name an attitude. One negative word could be an accident. Three in two sentences is a decision. The second writer disapproves of those kids.',
        'Check the swap against the facts one more time, because this is the point of the whole lesson. The kids waited their turn in BOTH versions. So the disapproval is not in the events at all. The writer put it in with word choice.',
        'WRONG: "Version 2 shows that the kids behaved badly." The passage never says that, and the identical last clause proves it. CORRECT: Version 2 makes the very same behavior SOUND bad, because the writer chose loaded near-synonyms.',
      ],
      answer:
        'The facts are identical; only the connotation changed. Version 1 reports neutrally with "group", "filled" and "stacked". Version 2 uses the negative rungs "mob", "swarmed" and "dumped", so its writer disapproves of the kids even though the passage says they waited their turn.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-keep-it-neutral',
      kind: 'try_yourself',
      problem:
        'A reporter for the school paper is writing about the book fair. Readers should be left to decide for themselves what to think of it. Which word keeps this sentence neutral?\n\n"By nine in the morning a ___ of families was waiting at the gym doors."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'mob' },
        { id: 'b', text: 'crowd', correct: true },
        { id: 'c', text: 'horde' },
        { id: 'd', text: 'swarm' },
      ],
      expectedAnswer: 'crowd',
      hints: [
        'All four words denote a large group of people in one place, so the dictionary meaning cannot decide this. Ask which one adds no opinion.',
        'Three of the choices make the group sound wild, pushy or out of control. A reporter needs the plain one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-positive',
      kind: 'try_yourself',
      problem:
        'A student is writing a thank-you note about a neighbor who spent all Saturday helping rebuild the community garden fence. He wants readers to admire her. Which word belongs in the blank?\n\n"Mrs. Alvarez was ___ about getting every post straight before dark."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'fussy' },
        { id: 'b', text: 'picky' },
        { id: 'c', text: 'careful', correct: true },
        { id: 'd', text: 'obsessed' },
      ],
      expectedAnswer: 'careful',
      hints: [
        'Every choice describes someone paying very close attention to small details, so sort them by feeling instead of meaning.',
        'Three of the four make that attention sound like a problem. Only one of them counts it as a good thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-read-the-attitude',
      kind: 'try_yourself',
      problem:
        'Read this sentence from a made-up town newsletter, then choose what the writer\'s word choice shows.\n\n"The council spent forty minutes nitpicking every line of the summer pool schedule."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The writer thinks the council checked the schedule carefully and did a good job.' },
        { id: 'b', text: 'The writer thinks the council fussed over tiny details for too long.', correct: true },
        { id: 'c', text: 'The writer has no attitude here and is only reporting what happened.' },
        { id: 'd', text: 'The writer thinks the council refused to approve the pool schedule.' },
      ],
      expectedAnswer: 'The writer thinks the council fussed over tiny details for too long.',
      hints: [
        'Swap "nitpicking" for "checking" and read the sentence again. The facts stay the same, but the feeling does not.',
        'To nitpick is to pick at very small faults. The word carries a complaint inside it, so the writer is not neutral.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-synonyms-and-opinion',
      kind: 'misconception_check',
      question:
        'A student writes: "The thesaurus lists stubborn as a synonym for determined, so I can use either one about our dog. Anyway, connotation is just how a word makes ME feel, so there is no right answer." What went wrong?',
      commonErrors: [
        {
          answer: 'Stubborn and determined are synonyms, so either word can go in the same sentence.',
          misconception:
            'Treating a thesaurus list as a set of words that swap in freely, and checking only the denotation while ignoring the feeling each word carries.',
          correctsTo:
            'Near-synonyms share a denotation, not a feeling. "Our dog is determined to get through the gate" makes a reader root for the dog. "Our dog is stubborn about the gate" makes the same dog sound like a problem. Both sentences report the exact same behavior and hand the reader opposite verdicts. A thesaurus gives you a list of candidates to sort into positive, neutral and negative, never a list of equals, so try each one inside your actual sentence and keep the rung that matches the feeling you want.',
        },
        {
          answer: 'Connotation is just my personal opinion, so there is no right answer.',
          misconception:
            'Confusing a private memory attached to one word with the shared feeling that word carries for almost every reader.',
          correctsTo:
            'Connotation is the feeling most readers agree on. Nearly everyone hears praise in "thrifty" and a complaint in "cheap", and everyone hears the difference between a scent and a stench. That agreement is the only reason word choice works on a reader at all; if the feelings were private, no writer could ever aim one. You are allowed your own memory of a word, but on a question ask what a typical reader hears.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Denotation is the dictionary meaning. Connotation is the feeling the word carries on top of it.',
        'Words can share a denotation and split hard on feeling: scent, smell and odor all name the same thing.',
        'Sort near-synonyms three ways — positive, neutral, negative — then pick the rung that matches the effect you want. Negative is a tool, not a banned word.',
        'Connotation is shared, not private. Ask what a typical reader hears, not what one word happens to remind you of.',
        'The rung a writer picks shows their attitude. Changing "group" to "mob" changes no facts and changes every verdict.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Connotation & Denotation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
