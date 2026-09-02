/**
 * Grade 6 ELA — Vocabulary in Context & Word Study: Word Relationships &
 * Analogies.
 *
 * CONCEPT-LED fan-out row. The student arrives with no procedure to
 * memorize a list against — the whole lesson builds one way of looking at
 * a pair of words: naming the connection between them (cause/effect,
 * part/whole, item/category, or degree along a shared scale) is itself
 * evidence about what each word means, not a separate puzzle format layered
 * on top of vocabulary (CCSS L.6.5b). Four traps this plan is built to
 * kill: treating a part as if it were a separate kind of the whole thing
 * (a yolk is not a kind of egg), reversing or flattening a category pair so
 * a whole member is mistaken for a piece, reading a cause/effect pair as if
 * the connection could run backward, and — the trap this row is most
 * exposed to — mistaking a degree pair (same idea, different strength) for
 * a pair that differs in attitude or feeling, which is a different lesson's
 * job entirely.
 *
 * SCOPE GUARD: Grade 6 row 7.4 uses the relationship between two particular
 * words — cause/effect, part/whole, item/category, or degree along one
 * shared scale — to sharpen the meaning of each word in the pair (CCSS
 * L.6.5b). DELIBERATELY EXCLUDED: distinguishing the shades of feeling or
 * judgment that separate near-synonyms sharing one denotation (row 7.3,
 * connotation and denotation, L.6.5c) — a degree pair in this file always
 * answers "how much of the same thing," never "how does a writer feel about
 * it," and this file's misconception check exists specifically to keep
 * that line visible rather than leaving it for row 7.3 to draw alone; using
 * a sentence's overall meaning or a word's position and function to infer
 * an unfamiliar word's sense (row 7.1, context clues, L.6.4a); deriving a
 * word's meaning from a Greek or Latin root, prefix or suffix (row 7.2,
 * L.6.4b); and identifying simile, metaphor, personification or hyperbole
 * inside a text (Unit 2.3, figurative language, RL.6.4) — no item in this
 * file analyzes figurative language in a passage, only the literal
 * relationship between two words named outright. Also excluded: drilling
 * the "A is to B as C is to __" analogy-test format. No item in this file
 * asks a student to complete a proportion; every item asks the student to
 * name a relationship in its own right and say what that relationship
 * reveals, because L.6.5b is a comprehension skill, not a test-taking
 * trick. No m7ela seed in this codebase teaches word relationships or
 * analogies, and m6ela-CURRICULUM.md's "Explicitly excluded" list names no
 * Grade 7 escalation for this row — unlike row 7.1 or row 7.2, there is no
 * shipped Grade 7 file this row risks colliding with. DELIBERATELY
 * ALLOWED, because row 7.3 sits immediately next door: this file's degree
 * relationship necessarily compares two words that name the same general
 * idea at different strengths, which is the same surface shape a
 * connotation pair has — two related words, side by side. What keeps the
 * two rows apart is what the comparison measures, amount versus attitude,
 * and every degree item and the misconception check in this file states
 * that distinction outright rather than assuming the student will infer it.
 *
 * NOTE FOR FUTURE AUTHORS: every scenario in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every word-relationship claim this file asserts
 * (a drought can cause wilting, a yolk is part of an egg, a trumpet is a
 * brass instrument, a guitar string is part of a guitar, furious names a
 * stronger degree of anger than annoyed) is a real claim about the world,
 * not an invented specific, and is checked in the claim ledger below —
 * treat that ledger as load-bearing for this file, not as a formality
 * carried over from an informational-passage row.
 *
 * CLAIM LEDGER (word-relationship claims):
 *   Claim                                    | Where               | Kind       | Grounds
 *   A sustained drought (long water shortage)| worked example 1    | REAL-WORLD | Long-settled plant biology: a
 *   can cause a plant to wilt                |                     |            | sustained water shortage lowers
 *                                             |                     |            | turgor pressure in plant cells,
 *                                             |                     |            | producing the drooping described
 *                                             |                     |            | as wilting.
 *   A yolk is one part of a whole egg, along | worked example 2    | REAL-WORLD | Definitional egg anatomy: a yolk
 *   with the white and the shell, and is     |                     |            | is a structural part of an egg and
 *   never a whole egg by itself              |                     |            | is never itself a complete egg.
 *   A trumpet is one specific kind of brass  | try-yourself 1      | REAL-WORLD | Standard musical-instrument
 *   instrument                               |                     |            | classification: brass instruments
 *                                             |                     |            | produce sound by lip vibration
 *                                             |                     |            | into a metal tube; the trumpet is
 *                                             |                     |            | a canonical example.
 *   A string is a physical part a guitar is  | try-yourself 2      | REAL-WORLD | Definitional guitar structure: a
 *   built from                               |                     |            | guitar needs strings to produce
 *                                             |                     |            | pitched sound.
 *   Furious names a stronger degree of anger | try-yourself 3 and  | REAL-WORLD | Standard dictionary gradation:
 *   than annoyed                             | misconception check |            | annoyed denotes mild irritation,
 *                                             |                     |            | furious denotes intense anger —
 *                                             |                     |            | the same emotion at different
 *                                             |                     |            | strengths.
 *   An engine is a part of a car and is never| misconception check | REAL-WORLD | Definitional car structure: an
 *   a separate kind of car                   |                     |            | engine is a component a car needs
 *                                             |                     |            | to run, never a complete car.
 *   Chilly and freezing both measure         | misconception check | REAL-WORLD | Standard dictionary gradation of
 *   temperature at different strengths       |                     |            | temperature words.
 *
 * NOTE ON prerequisites/followUps: this row's chain is
 * m6ela.connotation-and-denotation -> m6ela.word-relationships-and-analogies
 * -> m6ela.introducing-a-claim, per the lesson brief.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U7_WORD_RELATIONSHIPS_AND_ANALOGIES: LessonPlan = {
  id: 'evelyn.ms.m6ela.word-relationships-and-analogies.v1',
  title: 'Word Relationships & Analogies',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.word-relationships-and-analogies',
      standard: 'M6ELA-7.4',
      description:
        'Use the relationship between two particular words — cause/effect, part/whole, item/category, or degree along one shared scale — to sharpen the meaning of each word in the pair (CCSS L.6.5b).',
    },
  ],
  prerequisites: ['m6ela.connotation-and-denotation'],
  followUps: ['m6ela.introducing-a-claim'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already use word relationships to figure out an unfamiliar word, so the lesson names a habit rather than installing a brand-new one.',
      script:
        'Your friend tells you their new puppy is "a menace," and you have never heard that word before. Instead of looking it up, you ask one more question: what kind of animal is a puppy? A dog. And what do dogs sometimes do that gets them in trouble? Chew shoes, dig in the yard, knock things off the counter. Suddenly "menace" makes sense — it has to mean something that causes trouble, because that is exactly what your friend is describing right after using the word. You just used a relationship between two things you already understood to figure out something new. Today we do that on purpose, using pairs of words instead of puppies: one thing causing another, one thing being a piece of another, one thing belonging to a bigger group, and two words that measure the very same thing at different strengths. Naming how two words connect turns out to tell you something true about both of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-naming-word-relationships',
      kind: 'concept',
      goal: 'Install four relationship types as testable patterns and the idea that naming the relationship is evidence about meaning, not a label to memorize.',
      keyIdeas: [
        'A WORD RELATIONSHIP IS A CONNECTION BETWEEN TWO WORDS THAT CAN BE NAMED AND PROVEN, not just a feeling that the two words belong together. Four common relationships are cause/effect (one thing makes the other happen), part/whole (one thing is a piece of the other), item/category (one thing is a specific, complete member of a bigger group), and degree (both words name the same kind of thing, at different strengths). Naming which one connects a pair is the whole skill.',
        'CAUSE/EFFECT: ONE WORD MAKES THE OTHER HAPPEN, AND THE CONNECTION ONLY RUNS ONE DIRECTION. A drought can cause a plant to wilt, but a wilted plant cannot cause a drought — the arrow points one way, from cause to effect, and testing that direction is how you confirm the relationship.',
        'PART/WHOLE: ONE WORD NAMES A PIECE OF THE OTHER, NEVER A SEPARATE VERSION OF IT. A yolk is part of an egg, along with the white and the shell — it is never a whole egg by itself. That is exactly what separates part/whole from item/category: could the smaller word ever stand alone as a complete example of the bigger word? If not, it is a part.',
        'ITEM/CATEGORY: ONE WORD NAMES A GROUP, AND THE OTHER NAMES ONE FULL MEMBER THAT COULD STAND ALONE. A trumpet is one specific, complete kind of brass instrument, alongside trombones and tubas. Run the same test as above, expecting the opposite answer: could you point to a whole trumpet sitting by itself, with nothing missing? Yes — which is what makes it a member of a category rather than a piece of something bigger.',
        'DEGREE: BOTH WORDS NAME THE SAME KIND OF THING, AT DIFFERENT STRENGTHS ON ONE SCALE. Annoyed and furious both describe anger, but furious names a much stronger amount of it. Degree measures how much — never how someone feels about the idea, which is a different comparison entirely and belongs to a different lesson. If a pair only differs in the attitude or judgment it carries, it is not a degree pair.',
        'ONCE YOU NAME THE RELATIONSHIP, USE IT TO SHARPEN BOTH WORDS AT ONCE. Knowing that furious sits at the far end of the anger scale tells you it means something well past merely irritated. Knowing that a yolk is a part, not a version, tells you an egg has to include more than just the yolk. The relationship is evidence about meaning, not just a fact to file away.',
      ],
      vocabulary: [
        { term: 'word relationship', definition: 'a connection between two words that can be named and proven, such as one word causing the other or one being part of the other.' },
        { term: 'cause/effect', definition: 'a relationship in which one word names something that makes the other happen, and the connection runs in only one direction.' },
        { term: 'part/whole', definition: 'a relationship in which one word names a piece of the thing the other word names, never a separate whole version of it.' },
        { term: 'item/category', definition: 'a relationship in which one word names a whole group, and the other names one specific, complete member of that group.' },
        { term: 'degree', definition: 'a relationship in which two words name the same kind of thing at different strengths on one scale, measuring amount rather than attitude.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-relationship',
      kind: 'worked_example',
      problem:
        'Name the relationship between drought and wilt, and use it to explain exactly what each word means.\n\n"After six weeks without rain, the county issued a drought warning, and by the following Tuesday every unwatered tomato plant in Mr. Ferris\'s garden had begun to wilt."',
      steps: [
        'Notice the two words sitting close together and ask what kind of connection joins them: naming, part, category, cause, or degree. Six weeks without rain came first in the passage, and the wilting came after, in the very next sentence.',
        'Test whether one word could make the other one happen. A drought is a long stretch without water. Water is exactly what a plant needs to stay firm, so a long stretch without it is a plausible cause of a plant going limp.',
        'Name the relationship: cause/effect. Drought is the cause; wilt is the effect it produced in Mr. Ferris\'s garden.',
        'Use the relationship to sharpen drought: it means a shortage of water severe enough to actually change how a living plant looks, not just one dry week that nobody notices.',
        'Use the relationship to sharpen wilt: it means the drooping, limp look a plant gets specifically from losing water, not from cold, disease, or being stepped on.',
        'Check the relationship by reversing it. Does wilt ever cause a drought? No — wilting is something that happens to a plant, and a plant cannot change the weather. The connection only runs one way, from drought to wilt, which confirms this is cause/effect rather than some two-way link.',
      ],
      answer:
        'Drought and wilt are a cause/effect pair: the drought (a long shortage of water) is the cause, and wilt (a plant drooping from losing water) is the effect it produces. Naming that relationship shows that drought means specifically a water shortage bad enough to change a living plant, and wilt means specifically the drooping caused by losing water rather than by cold or disease.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-wrong-label',
      kind: 'worked_example',
      problem:
        'A student was asked to name the relationship between yolk and egg, and answered wrong. Find the mistake and repair it.\n\n"Grandma cracked the egg into the bowl, and the yolk slid out first, a round patch of yellow sitting in the middle of the clear egg white."\n\nStudent\'s answer: "Yolk and egg are an item/category pair — egg is the category, and yolk is one kind of egg, like a fried egg or a boiled egg."\n\nWhat went wrong, and what is the actual relationship?',
      steps: [
        'Test the student\'s claim against what an item/category relationship actually requires: a category is a group, and each item is a full, separate member of that group. Ask whether a yolk is a separate kind of egg, the way a fried egg and a boiled egg are both separate kinds of egg.',
        'It is not. A fried egg is still a whole egg, cooked one way. A yolk by itself is never a whole egg — the passage describes the yolk sitting inside the egg white, which is inside the egg.',
        'Notice the real clue the sentence gives: the yolk is described as "sitting in the middle of the clear egg white," which places it as one piece located inside a bigger structure, not as one version of the whole thing.',
        'Name the relationship correctly: part/whole. Yolk is a part; egg is the whole it belongs to, along with the white and the shell.',
        'Use the corrected relationship to sharpen each word: egg means the entire structure — shell, white, and yolk together — and yolk means specifically the round yellow part inside it, not the whole structure and not the clear part around it.',
        'WRONG: "Yolk and egg are an item/category pair — egg is the category, and yolk is one kind of egg, like a fried egg or a boiled egg." CORRECT: "Yolk and egg are a part/whole pair — yolk is one part of the whole egg, along with the white and the shell."',
      ],
      answer:
        'Yolk and egg are a part/whole pair, not an item/category pair. A fried egg and a boiled egg are both whole eggs cooked differently, which would fit item/category — but a yolk by itself is never a whole egg. It is the round yellow part sitting inside the white, which makes it part/whole. Naming the correct relationship shows that egg means the whole structure of shell, white, and yolk together, and yolk means specifically the yellow part inside it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-item-and-category',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose the statement that correctly explains how trumpet and brass instrument relate, and what that relationship tells you about the word trumpet.\n\n"Marcus wiped down his trumpet before returning it to the rack where the school keeps every brass instrument, from the trombones to the tubas."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Trumpet and brass instrument mean exactly the same thing, so any instrument in that rack, including the trombones, could just as accurately be called a trumpet as a brass instrument.' },
        { id: 'b', text: 'Brass instrument names the shiny metal material a trumpet happens to be made of, the same way silver or gold would, and it says nothing about which family of instruments a trumpet actually belongs to.' },
        { id: 'c', text: 'The sentence only shows that a trumpet and a trombone happen to be stored in the same rack after band practice, which is a detail about where instruments get kept and says nothing about how the two words relate.' },
        { id: 'd', text: 'Brass instrument names a whole group of instruments, and trumpet names one specific, complete instrument that belongs inside that group, along with the trombones and tubas the sentence also names.', correct: true },
      ],
      expectedAnswer: 'Brass instrument names a whole group of instruments, and trumpet names one specific, complete instrument that belongs inside that group, along with the trombones and tubas the sentence also names.',
      hints: [
        'Look for a word in the sentence that names a whole family of instruments, and a separate word that names one specific instrument sitting inside that family.',
        'The sentence lists trombones and tubas right alongside trumpet under one shared label. Ask what job that shared label is doing for all three instruments.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-part-and-whole',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose the statement that correctly explains how string and guitar relate, and what that relationship tells you about the word string.\n\n"When Elena\'s guitar string snapped in the middle of the song, she had to stop playing until her older brother replaced it before the next set."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'String names one physical part that a guitar is built from, so a guitar missing every string is missing something it needs in order to make sound.', correct: true },
        { id: 'b', text: 'String and guitar are just two regional names people use for the exact same instrument, depending on which part of the country they live in.' },
        { id: 'c', text: 'Guitar names a general category of loud instruments, and string is the specific brand name of the particular instrument in the sentence.' },
        { id: 'd', text: 'The sentence mainly shows that Elena\'s older brother is better at fixing instruments than Elena is, since he is the one who replaced the broken part.' },
      ],
      expectedAnswer: 'String names one physical part that a guitar is built from, so a guitar missing every string is missing something it needs in order to make sound.',
      hints: [
        'Ask whether a guitar could still make its regular sound with every string removed. What that answer tells you is the relationship.',
        'A part sits inside the bigger thing and cannot stand in for the whole of it. Check which choice treats string that way, instead of treating it as a nickname, a brand, or a fact about someone\'s skill at fixing things.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-degree-not-attitude',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose the statement that correctly explains how annoyed and furious relate, and what that relationship tells you about the word furious.\n\n"Being stuck behind one slow bus made Priya annoyed, but realizing she had left her only ticket to the concert on the seat when she jumped off left her furious."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Annoyed and furious describe two completely unrelated feelings, each one showing up for its own separate reason, that simply happen to appear back to back in the same sentence.' },
        { id: 'b', text: 'Both words describe anger, but furious names a much stronger degree of it than annoyed, which is why the bigger loss in the sentence earns the stronger word.', correct: true },
        { id: 'c', text: 'Furious is simply a more polite, grown-up way of saying annoyed, the way some adults choose fancier-sounding words for the same everyday feeling when they are speaking formally.' },
        { id: 'd', text: 'The sentence proves that any person who leaves a concert ticket behind will always end up furious afterward, since that is exactly how Priya reacted in this one particular story.' },
      ],
      expectedAnswer: 'Both words describe anger, but furious names a much stronger degree of it than annoyed, which is why the bigger loss in the sentence earns the stronger word.',
      hints: [
        'Ask what single thing both annoyed and furious are measuring, and whether that thing could be marked on a scale running from small to large.',
        'One choice tries to make this pair sound like a difference in politeness rather than a difference in amount. If both words are measuring the exact same feeling at two different strengths, politeness has nothing to do with it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-relationship-mixups',
      kind: 'misconception_check',
      question:
        'A student looks at the pair engine and car and says, "That is an item/category relationship — car is the category, and engine is one type of car." Then, looking at chilly and freezing, the same student says, "That works the same way as cheap and stingy — different attitudes about the same idea." What went wrong in each answer?',
      commonErrors: [
        {
          answer: 'That is an item/category relationship — car is the category, and engine is one type of car.',
          misconception:
            'Treating a piece of something as if it were a separate version of the whole thing. An engine sits inside a car, so it is easy to reach for the group-and-member pattern without testing whether an engine could ever stand alone as a whole, complete car.',
          correctsTo:
            'Test it the part/whole way: could you point to a whole engine sitting by itself and call it a car? No — an engine is one piece a car needs in order to run, the same way a yolk is one piece an egg needs. That makes engine and car a part/whole pair, with car as the whole and engine as one of its parts, not a category with engine as a member.',
        },
        {
          answer: 'That works the same way as cheap and stingy — different attitudes about the same idea.',
          misconception:
            'Confusing a difference in strength with a difference in feeling. Chilly and freezing, and cheap and stingy, both look like two words for one related idea, so it is tempting to sort them the same way.',
          correctsTo:
            'Chilly and freezing both measure the exact same thing, temperature, at different strengths — that is degree, and nobody\'s opinion about the weather changes which word describes the colder day. Cheap and stingy can describe the very same person spending the very same amount of money, but stingy adds a judgment that cheap does not carry. Degree changes how much; a difference in attitude changes how someone feels about it. Ask which question the pair answers: "how much" points to degree, and "what does this word suggest about the person" points to a different comparison that this lesson does not cover.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A word relationship is a connection between two words that can be named and proven, not just a feeling that they belong together.',
        'Cause/effect: one word makes the other happen, and the connection only runs one direction — a drought can cause a plant to wilt, but a wilted plant cannot cause a drought.',
        'Part/whole: one word names a piece of the other, and that piece is never a whole version by itself — a yolk is part of an egg, never a kind of egg.',
        'Item/category: one word names a group, and the other names a full member that could stand alone — a trumpet is one whole kind of brass instrument.',
        'Degree: both words measure the exact same thing at different strengths, and nobody\'s opinion changes which one is stronger — furious names a stronger degree of anger than annoyed.',
        'Naming the relationship is evidence about meaning: it tells you something true about both words at once, not just a label to memorize.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Word Relationships & Analogies' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
