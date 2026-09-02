/**
 * Grade 6 ELA — Vocabulary in Context & Word Study: Connotation &
 * Denotation.
 *
 * CONCEPT-LED fan-out row for m6ela. The student already knows what each
 * near-synonym in a set means; the new move is a two-step check on a word
 * that could fill a blank: does its DENOTATION even match what the sentence
 * needs, and if it does, does its CONNOTATION — positive, neutral or
 * negative — match the one detail the sentence supplies (CCSS L.6.5c). Three
 * traps this plan is built to kill: picking a word because it "sounds nicer"
 * or "sounds meaner" instead of because a detail forces it, mistaking a word
 * with a different core meaning entirely (an antonym-shaped word, not a true
 * near-synonym) for one that merely carries a different feeling, and letting
 * a detail that only proves denotation (a fact about size, age or amount) get
 * treated as if it had already decided connotation too.
 *
 * SCOPE GUARD: Grade 6 row 7.3 teaches ONE word-level skill: given a short
 * original sentence and several words that could fill its blank, first
 * confirm which of those words actually share the denotation the blank
 * needs, then choose the one whose connotation the sentence's own details
 * force (CCSS L.6.5c). DELIBERATELY EXCLUDED: analyzing what an
 * already-printed word contributes to a passage's meaning or tone, or
 * proving that effect with a swap-test comparison against a neutral synonym
 * — that is row 2.4 (`word-choice-and-tone`), and that row's own scope guard
 * names this fill-in-the-blank word-selection task as belonging here instead,
 * so the boundary is agreed on both sides. Nothing in this file analyzes a
 * whole passage's tone, and no item asks what a word already sitting in a
 * sentence contributes to it — every item here asks which word BELONGS in an
 * empty blank. Also excluded: using a relationship between two words — cause
 * and effect, part and whole, or item and category — to sharpen either
 * word's meaning; that is row 7.4 (`word-relationships-and-analogies`,
 * L.6.5b), a different mechanism from comparing shared-denotation words for
 * their connotation. Also excluded: inferring an unfamiliar word's meaning
 * from its position in a sentence (row 7.1, context clues) and using a
 * Greek or Latin root or affix as a meaning clue (row 7.2) — every word in
 * this file is one the student is assumed to already know the denotation of,
 * or can be told outright; no item asks the student to recover an unknown
 * word's meaning. This lesson also does not analyze how an author distinguishes
 * their own position from someone else's, and it never reaches how a word
 * choice reveals a writer's attitude across a whole text — the shipped
 * Grade 7 connotation lesson makes that reading move explicitly and this row
 * stops well short of it. DELIBERATELY ALLOWED, because two rows sit close:
 * every item in this file opens with a short two-to-three-sentence scenario
 * that supplies the ONE detail deciding connotation, which can look like a
 * 7.1 context-clue setup — it is allowed here because the scenario never asks
 * the student to recover an unfamiliar word's meaning, only to select among
 * words whose denotations are already known or stated outright in the
 * teaching. The vocabulary list also defines "denotation" and "connotation"
 * exactly as row 2.4 already does; both rows need the same two terms for two
 * different tasks, and defining them again here does not reach into 2.4's
 * swap-test method.
 *
 * NOTE FOR FUTURE AUTHORS: every scenario in this file is original prose
 * written for its item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory. Every near-synonym set in this file
 * compares words describing a THING, a BEHAVIOR toward money, or a GROUP's
 * conduct — never a person's body, looks, or fixed identity — so that a
 * connotation difference is always about the thing or behavior described,
 * not a judgment about who someone is.
 *
 * CLAIM LEDGER: none required. Every scenario in this file is invented
 * fiction (a bedroom, a bicycle, a bakery opening, a classmate's allowance),
 * true by construction, and none of them states a fact about the real world
 * that a reader could look up. Rows whose passages are INFORMATIONAL must
 * carry the three-column claim ledger described in the fan-out contract
 * instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U7_CONNOTATION_AND_DENOTATION: LessonPlan = {
  id: 'evelyn.ms.m6ela.connotation-and-denotation.v1',
  title: 'Connotation & Denotation',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.connotation-and-denotation',
      standard: 'M6ELA-7.3',
      description:
        'Distinguish among the connotations of words that share a similar denotation (e.g., stingy, thrifty, economical) and choose the word whose shade of meaning fits the context (CCSS L.6.5c).',
    },
  ],
  prerequisites: ['m6ela.greek-and-latin-roots-and-affixes'],
  followUps: ['m6ela.word-relationships-and-analogies'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Prove with one real choice that two words pointing at almost the same meaning can hand out opposite verdicts.',
      script:
        'Your friend Milo spends an entire Saturday making handmade birthday cards instead of buying gifts at the store, because he would rather save his allowance for something else. You could describe that choice two very different ways. You could say Milo is being thrifty. You could say Milo is being cheap. Look both of those words up in a dictionary, and you get almost the same definition: careful with money. But one of those words makes Milo sound smart with his allowance, and the other one makes it sound like he did not want to spend money on his friends. Same decision, two words, two completely different verdicts. Today we learn to catch words like that: words that point at almost the same dictionary meaning but hand out very different feelings the moment someone actually uses them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-denotation-and-connotation',
      kind: 'concept',
      goal: 'Separate denotation from connotation, install the check-meaning-then-check-feeling method, and generalize it beyond money words.',
      keyIdeas: [
        'DENOTATION IS THE DICTIONARY MEANING a word carries with no feeling attached — the exact idea a definition points at. "Thrifty," "stingy" and "cheap" can all point at the very same denotation: someone who is careful about spending money.',
        'CONNOTATION IS THE FEELING A WORD ADDS ON TOP of that shared denotation — positive, neutral or negative. "Thrifty" praises the same behavior "stingy" and "cheap" criticize. Same core meaning, three different feelings a reader walks away with.',
        'CHECK THE DENOTATION FIRST, BEFORE YOU EVER THINK ABOUT FEELING. A word that looks like it belongs in the group sometimes does not share the denotation at all. "Generous" does not mean careful with money — it means the opposite, willing to give freely. A word with the wrong denotation is wrong no matter how positive or negative it sounds.',
        'THE CONTEXT HAS TO FORCE YOUR ANSWER, NOT YOUR OWN FEELING ABOUT THE WORD. Never choose a word because it sounds nicer or sounds meaner. Find the specific detail in the sentence that a reader could point at, and let that detail rule out every word whose shade contradicts it.',
        'THE METHOD, IN ORDER: list the words that could fill the blank and confirm which ones truly share the denotation the sentence needs; cross out any word whose core meaning does not match; find the one detail in the context that shows a positive, neutral or negative feeling; cross out every remaining word whose shade contradicts that detail, until one word is left.',
        'THIS SAME PATTERN SHOWS UP FOR WORDS ABOUT SMELLS, SIZES, AGES AND GROUPS, NOT JUST MONEY. "Aroma," "odor" and "stench" all denote a smell. "Cozy" and "cramped" both denote a small space. "Vintage" and "outdated" both denote something old. Whatever the topic, the job is the same: match the denotation, then let the context pick the shade.',
      ],
      vocabulary: [
        { term: 'denotation', definition: 'the exact dictionary meaning of a word, with no feeling attached.' },
        { term: 'connotation', definition: 'the positive, neutral, or negative feeling a word carries in addition to its denotation.' },
        { term: 'near-synonyms', definition: 'words whose denotations are close enough to share almost the same dictionary definition, even though their connotations differ.' },
        { term: 'shade of meaning', definition: 'the particular positive, neutral, or negative feeling that sets one near-synonym apart from another that shares its denotation.' },
        { term: 'neutral', definition: 'carrying no clear positive or negative feeling — a plain, unjudging way to state a fact.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-spending-word',
      kind: 'worked_example',
      problem:
        'These four words can all describe someone careful about spending money, but a reader does not walk away with the same feeling from each one: thrifty, stingy, cheap, generous. Read the story, then pick the word the details force, and be ready to say why the other three do not fit.\n\nDara has saved most of her allowance for two years by packing her own lunch instead of buying one. When her class needed twenty dollars so a classmate could go on the field trip, Dara handed over the money the same afternoon, without being asked twice.\n\nDara is a ______ person.',
      steps: [
        'Check the denotation first. "Thrifty," "stingy" and "cheap" all describe someone careful with money or reluctant to spend it. "Generous" describes the opposite: someone who gives freely. Cross out any word whose denotation does not match before thinking about feeling at all. That removes "generous."',
        'What is left — thrifty, stingy, cheap — all share the denotation "careful with money," so the denotation test alone cannot pick one. The next question has to come from a detail.',
        'Find the detail that forces a shade. The passage does not stop at Dara saving her allowance. It adds a second fact: she "handed over the money the same afternoon, without being asked twice" when a classmate needed it.',
        '"Stingy" and "cheap" both describe someone who refuses to spend or share even when it would help someone else. That is the opposite of what Dara just did, so both words are ruled out by that second detail, not by a feeling about which word sounds nicer.',
        '"Thrifty" describes someone careful with money who still spends it when it matters. That matches both sentences together: careful saving, then quick generosity when it counted.',
        'The correct word is "thrifty," forced by two separate details: the saved allowance confirms the denotation, and the field-trip money rules out the two negative shades.',
      ],
      answer:
        'Thrifty. The denotation test removes "generous" because it names the opposite behavior. The detail that Dara handed over the money the same afternoon, without being asked twice, then removes "stingy" and "cheap," because both of those words describe someone who would not have done that.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-smell-word',
      kind: 'worked_example',
      problem:
        'These four words can all describe a smell, but a reader does not hear the same feeling in each one: aroma, odor, stench, flavor. Read the story, then pick the word the details force.\n\nThe school cafeteria was testing a new bread recipe, and by lunchtime the hallway outside the kitchen smelled so good that three classes stopped at the door before they even reached the cafeteria line.\n\nThe hallway was filled with the ______ of fresh bread.',
      steps: [
        'Check the denotation first. "Aroma," "odor" and "stench" are all words for something a nose detects. "Flavor" is detected by the tongue, not the nose, so its denotation does not match "smelled." That removes "flavor" before any question of feeling comes up.',
        'What is left — aroma, odor, stench — all share the denotation "a smell." Picking among them now has to come from a detail, not a guess.',
        'Find the detail. The passage says three classes "stopped at the door" because the hallway "smelled so good." That is a positive reaction, stated directly.',
        '"Stench" is a strongly negative word — it describes a smell people want to get away from. That contradicts three classes stopping to enjoy it, so "stench" is ruled out.',
        '"Odor" is closer to neutral; it is not built for a smell people stop and linger near on purpose, so it is a weaker fit than a word made for a good smell.',
        '"Aroma" is the word reserved for a smell a reader is meant to enjoy, which matches "smelled so good" and three classes choosing to stop for it.',
        'The correct word is "aroma," forced by two details: the sentence says the hallway smelled, which removes "flavor" on denotation, and says the smell made three classes stop at the door, which removes "stench" and outranks the neutral "odor."',
      ],
      answer:
        'Aroma. The word must denote a smell, which removes "flavor." The detail that three classes stopped at the door because the hallway "smelled so good" rules out "stench," which describes an unpleasant smell, and points past the neutral "odor" to "aroma," the word for a smell a reader is meant to enjoy.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bedroom-word',
      kind: 'try_yourself',
      problem:
        'Read about Priya\'s new bedroom, then choose the word whose shade of meaning the details force into the blank.\n\nPriya\'s new bedroom is barely big enough for her bed and a narrow dresser, and she has to slide sideways to reach her closet door. She does not mind one bit, because she picked that room on purpose so her window would look straight into her grandmother\'s garden, and she calls it her own little nook.\n\nPriya\'s bedroom is ______.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'spacious, because a bedroom needs plenty of open floor space before anyone could really enjoy living in it.' },
        { id: 'b', text: 'cluttered, because a room stuffed with too many belongings stops feeling comfortable no matter how good the view outside its window is.' },
        { id: 'c', text: 'cozy, because a small room that a person chooses on purpose and enjoys can feel comfortable rather than uncomfortable.', correct: true },
        { id: 'd', text: 'cramped, because a room a person can barely move around in without turning sideways is too tight to ever feel comfortable living in.' },
      ],
      expectedAnswer: 'cozy, because a small room that a person chooses on purpose and enjoys can feel comfortable rather than uncomfortable.',
      hints: [
        'Two of these words do not even describe a small room — one means the opposite size, and one is about mess, not size. Rule those out the same way you check denotation before you check feeling.',
        'Between the two words left, one describes a small room someone dislikes and one describes a small room someone chooses and likes. Which feeling matches "She does not mind one bit" and her own little nook?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bicycle-word',
      kind: 'try_yourself',
      problem:
        'Read about Jamal\'s bicycle, then choose the word whose shade of meaning the details force into the blank.\n\nJamal\'s older cousin gave him a bicycle that still has its original leather seat and a hand-painted number on the frame from a factory that closed fifty years ago. The gears shift a little stiffly, but every part still works, and three different neighbors have already asked if he would sell it.\n\nJamal\'s bicycle is a genuine ______.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'outdated, because a bicycle from a factory that closed fifty years ago cannot possibly keep up with a bicycle built with today\'s parts and technology.' },
        { id: 'b', text: 'broken, because gears that shift a little stiffly are proof that a bicycle has stopped working the way it is supposed to.' },
        { id: 'c', text: 'newfangled, because a bicycle with a hand-painted number and a leather seat is clearly built using ideas nobody had tried before.' },
        { id: 'd', text: 'vintage, because an old bicycle that still works and still has its original details can be valued for its age instead of held back by it.', correct: true },
      ],
      expectedAnswer: 'vintage, because an old bicycle that still works and still has its original details can be valued for its age instead of held back by it.',
      hints: [
        'One of these words means the bicycle no longer works, and one of them means the bicycle is brand new. Check whether either of those matches the story before you think about feeling.',
        'The two words left both describe something old, but they point in opposite directions about whether that is a good thing. Which one matches three neighbors asking to buy it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bakery-word',
      kind: 'try_yourself',
      problem:
        'Read about the bakery opening, then choose the word whose shade of meaning the details force into the blank.\n\nWhen the bakery announced that only the first fifty customers would get the free anniversary cupcakes, more than a hundred people showed up before it opened. The moment the doors unlocked, people shoved past each other and knocked over the sign to get to the counter first.\n\nA ______ pushed through the bakery\'s doors.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'mob, because a group that shoves past each other and knocks over a sign to get ahead of everyone else is acting in the disorderly way that word is specifically built to describe.', correct: true },
        { id: 'b', text: 'line, because a hundred people all waiting for the same thing are, by definition, standing together in one orderly row leading toward the counter.' },
        { id: 'c', text: 'gathering, because any large number of people brought together for one reason can be called that no matter how calm or chaotic they turn out to be once they arrive.' },
        { id: 'd', text: 'crowd, because a hundred people standing close together outside one set of doors are, at the very least, a large number of people in one place.' },
      ],
      expectedAnswer: 'mob, because a group that shoves past each other and knocks over a sign to get ahead of everyone else is acting in the disorderly way that word is specifically built to describe.',
      hints: [
        'One of these words describes people standing in a single orderly row. Check whether that matches people shoving past each other before you think about feeling.',
        'The other three words all describe a group of people together, but they disagree about how orderly that group is. Which one is built specifically for a group that pushes and knocks things over?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-detail-decides-feeling-not-fact',
      kind: 'misconception_check',
      question:
        'A student reads that Dara "handed over the money the same afternoon, without being asked twice" and fills the blank with "generous," since that feels like the nicest word for someone who helps a classmate. Separately, another student reads about Priya\'s tiny bedroom and picks "cramped" because sliding sideways to reach the closet sounds uncomfortable. What went wrong in each case, and what is the fix?',
      commonErrors: [
        {
          answer: 'generous',
          misconception:
            'Picking the word that sounds the most flattering for the situation, without first checking whether it shares the denotation the sentence actually needs. "Generous" means willing to give freely, which is close in feeling to what Dara did, but it is not the same core meaning as "careful with money," which the earlier sentence about her allowance sets up.',
          correctsTo:
            'Check denotation before feeling, every time. The blank needs a word that means careful with money, because the sentence already established that Dara saves her allowance. "Generous" fails that test no matter how well it fits the mood of the story. Among the words that do share the denotation, the detail about handing over the money without hesitating then points to the positive one, "thrifty," and rules out the negative ones, "stingy" and "cheap."',
        },
        {
          answer: 'cramped',
          misconception:
            'Noticing one physical detail — sliding sideways to reach the closet — and picking the word that matches how a tight space sounds, without reading the sentence that states how Priya feels about it. A detail about size only proves the denotation is right; it does not decide the connotation on its own.',
          correctsTo:
            'Denotation and connotation are two separate checks. The sliding-sideways detail only confirms the room is small, which fits both "cozy" and "cramped" equally well. The connotation has to come from a different detail. Here it is the sentence that says Priya "does not mind one bit" and calls the room her own little nook. That is the detail that rules out "cramped" and points to "cozy."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Denotation is the dictionary meaning a word carries with no feeling attached. Connotation is the positive, neutral, or negative feeling a word adds on top of that meaning.',
        'Check denotation first. A word that looks like it belongs in the group sometimes has a different core meaning entirely — generous does not mean careful with money, it means the opposite.',
        'Never choose a word because it sounds nicer or sounds meaner. Find the specific detail in the sentence that a reader could point at, and let that detail rule out every word whose shade contradicts it.',
        'The method: confirm the denotation matches, then find the one detail that reveals a positive, neutral, or negative feeling, then cross out every word whose shade contradicts that detail.',
        'A detail about size, age, or amount only proves the denotation is right. A separate detail, often about how someone reacts or behaves, is what decides the connotation.',
        'This pattern works the same way for words about money, smells, sizes, ages, and groups of people: match the meaning first, then let the context pick the feeling.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Connotation & Denotation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
