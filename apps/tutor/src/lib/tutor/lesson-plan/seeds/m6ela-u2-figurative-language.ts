/**
 * Grade 6 ELA — Theme, Point of View & Figurative Language: Figurative
 * Language.
 *
 * CONCEPT-LED fan-out row for m6ela. The student learns four ways writers say
 * one thing to mean another on purpose — simile, metaphor, personification,
 * hyperbole — and practices the half of the skill that actually counts:
 * stating the figurative MEANING each one creates, not just its name (CCSS
 * RL.6.4). Two traps this plan is built to kill: naming the device and
 * stopping there, and reading a personified object as if it were literally
 * alive with real feelings.
 *
 * SCOPE GUARD: Grade 6 row 2.3 identifies simile, metaphor, personification
 * and hyperbole in a text and states the figurative MEANING each one creates.
 * DELIBERATELY EXCLUDED: idiom. The shipped Grade 7 figurative-language
 * lessons (`g7-ela-figurative-language.ts` and `m7ela-u2-figurative-
 * language.ts`) both teach a five-figure set that adds idiom; this row's
 * curriculum line names four devices only, and the word "idiom" does not
 * appear anywhere in this file. Also excluded: the impact of a specific word
 * choice on tone or mood, which belongs to row 2.4 (`word-choice-and-tone`,
 * also RL.6.4) — no item in this file asks what feeling or atmosphere a
 * phrase creates, only what the figure of speech means. Word-level
 * connotation belongs to row 7.3 (`connotation-and-denotation`), not to this
 * row, and neither term appears here. Also excluded: analysis of rhyme or
 * other sound repetition in verse, a Grade 7 addition to RL.7.4 that this
 * course never reaches, and contrasting two narrators' or characters' points
 * of view (row 2.2's territory, RL.7.6) — this file never names or compares a
 * narrator. DELIBERATELY ALLOWED, because row 2.4 sits close on the very same
 * standard: every worked example and try_yourself item here asks the student
 * to state the literal idea a device is standing in for (arms that feel weak,
 * a bicycle too worn out to ride, a wildly exaggerated count) — that is this
 * row's whole job under RL.6.4's figurative-meaning half, and it is a
 * different question from what mood or tone a word choice sets, which is
 * 2.4's half.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.2 ->
 * 2.3 -> 2.4. Rows 2.2 (`point-of-view-of-the-narrator`) and 2.4
 * (`word-choice-and-tone`) are authored in the same fan-out batch as this
 * file and are not yet registered on disk, but the lesson brief for this row
 * fixes both loIds explicitly, so they are written in now rather than left
 * empty. `lint-ms-plans` checks the chain across the whole batch once the
 * controller registers all 40 rows together, not per file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U2_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.ms.m6ela.figurative-language.v1',
  title: 'Figurative Language',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.figurative-language',
      standard: 'M6ELA-2.3',
      description:
        'Identify simile, metaphor, personification and hyperbole in a text and state the figurative meaning each one creates, rather than stopping once the device is named (CCSS RL.6.4).',
    },
  ],
  prerequisites: ['m6ela.point-of-view-of-the-narrator'],
  followUps: ['m6ela.word-choice-and-tone'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already reads figurative language every day, and that naming the device is only half the job.',
      script:
        'Your little brother finishes an entire bowl of cereal in about ten seconds, then announces that he has not eaten in a hundred years. He has not, of course, and he knows it. He is stretching the truth on purpose so you understand exactly how hungry he felt. Writers do the exact same thing on purpose, all the time. Here is the part that trips people up. If someone asks what kind of figure of speech that is and you say "hyperbole," you have only done half the job. The real question is always what it actually tells you. Today we name four ways writers say one thing to mean another, and then we practice the harder half: pulling out the real meaning each one is hiding.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-figures-and-meaning',
      kind: 'concept',
      goal: 'Define the four devices with a working test for each, and make stating the figurative meaning the actual finish line.',
      keyIdeas: [
        'FIGURATIVE LANGUAGE SAYS ONE THING TO MEAN ANOTHER, ON PURPOSE. Naming the device is only step one. The finish line is always the same question: what is this line actually telling me? An answer that stops at "simile" or "personification" has not answered the question yet.',
        'SIMILE — a comparison between two things that uses the word like or the word as. "Her handwriting was as neat as a printed page." The signal word tells you a comparison is happening; the meaning comes from asking what the two things share.',
        'METAPHOR — a comparison that skips like and as and says one thing IS another. "The last five minutes of practice were a marathon." Check that the comparison could not be literally true. If a sentence with the word is could actually be true word for word, it is a plain fact, not a metaphor.',
        'PERSONIFICATION — giving a human quality, a feeling or a choice to something that is not human. The test is the quality itself, not just the verb: a machine can literally make noise, but only something with a mind can complain, refuse or worry. "The old furnace complained all winter" hands the furnace a human mood on purpose. Personification does not mean the object is actually alive; it borrows a human trait to describe something more vividly.',
        'HYPERBOLE — an exaggeration so large that nobody is meant to believe it. "I have told you a thousand times." Nobody counted to a thousand, and nobody is confused about that. Hyperbole is not a lie and not a mistake; the size of the stretch tells you the size of the feeling behind it.',
        'THE MEANING TEST — every time. Name what is being described. Name what it is compared to, or what is being stretched. Then say the one idea that connects them, in your own words, as a plain sentence. That plain sentence is the actual answer, and the device name is only the label on the front of it.',
      ],
      vocabulary: [
        { term: 'figurative language', definition: 'words that are not meant literally, used on purpose to say one thing by describing another.' },
        { term: 'simile', definition: 'a comparison between two things that uses the word like or the word as.' },
        { term: 'metaphor', definition: 'a comparison that says one thing is another, unlike thing, with no like or as.' },
        { term: 'personification', definition: 'giving a human quality, feeling or choice to something that is not human.' },
        { term: 'hyperbole', definition: 'an exaggeration so large that it is not meant to be believed, used to show how strongly someone feels.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-metaphor-meaning',
      kind: 'worked_example',
      problem:
        'Name the figurative device in the line below, then say what it actually means.\n\n"Ms. Alvarez\'s classroom was a beehive during the last ten minutes before the bell, with every table buzzing at once."',
      steps: [
        'Check for a signal word first, because that is the fastest split. There is no like and no as anywhere in the line, so this is not a simile.',
        'The line says the classroom WAS a beehive. Check whether that could be literally true. A classroom is a room, not an insect nest, so the two things are genuinely unlike, and a real comparison is happening. That makes it a metaphor.',
        'Name both sides out loud. The thing being described is the classroom. The thing it is compared to is a beehive.',
        'Ask what a beehive is like: full of bees, constant motion, a steady hum of noise that never fully stops.',
        'Match that to the classroom. "every table buzzing at once" extends the same picture: many small conversations running at the same time, the way bees move and hum inside a hive.',
        'Put the label and the meaning together. Naming "metaphor" alone would only be half the answer.',
      ],
      answer:
        'Metaphor. The classroom is compared to a beehive, and the meaning is that the room was loud and busy in the last ten minutes before the bell, with every student talking or moving at once, the way bees move and hum inside a hive.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-two-labels',
      kind: 'worked_example',
      problem:
        'A classmate labels two lines from a story about a school talent show. Check each label, fix any mistake, and add the figurative meaning if it is missing.\n\nLine 1: "The ancient microphone squealed and refused to cooperate right before Jonah\'s turn." Classmate\'s label: "Personification, because squealed is a sound."\n\nLine 2: "By the third act, the gym floor was a river of spilled lemonade." Classmate\'s label: "Simile, because it compares the floor to a river."',
      steps: [
        'Check line 1\'s device separately from the reason behind it. Personification needs a human quality — a feeling, a choice, a mind — not merely a sound. A microphone can literally squeal; that is just feedback, and it does not by itself prove personification.',
        'Look at the rest of the line. "refused to cooperate" gives the microphone a choice, and only something with a will can refuse. That is the human quality that actually makes this personification. WRONG: "Personification, because squealed is a sound." CORRECT: "Personification, because refused to cooperate gives the microphone a choice, which only a person can make."',
        'State the meaning for line 1. The microphone was not truly stubborn; it stopped working right when Jonah needed it, and describing it as refusing makes that failure feel deliberate and frustrating instead of just mechanical.',
        'Check line 2\'s device test. Read the line again for a signal word: there is no like and no as anywhere. The line says the floor WAS a river, a direct statement, so this is a metaphor, not a simile. WRONG: "Simile, because it compares the floor to a river." CORRECT: "Metaphor, because it says the floor was a river, with no like or as."',
        'State the meaning for line 2. A river is a large amount of liquid covering ground, so the meaning is that a huge amount of lemonade had spilled and spread across the gym floor by the third act.',
        'Put both corrected labels and their meanings together as the finished answer.',
      ],
      answer:
        'Line 1: personification is the right device, but the reason must be that refused to cooperate gives the microphone a human choice, not that it made a sound; the meaning is that the microphone stopped working at the worst possible moment, described as if it were being stubborn on purpose. Line 2: the device is a metaphor, not a simile, because there is no like or as; the meaning is that a huge amount of lemonade had spilled and spread across the gym floor by the third act.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-simile-meaning',
      kind: 'try_yourself',
      problem:
        'Read the lines, then choose what the simile tells the reader about Diego\'s arms.\n\n"After practice, Diego\'s arms felt like two pool noodles hanging from his shoulders. He could barely lift his backpack onto one arm."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Diego often uses pool noodles during his swim practice at the pool.' },
        { id: 'b', text: 'Diego\'s arms felt extremely weak and tired after practice.', correct: true },
        { id: 'c', text: 'This sentence compares two things using the word like.' },
        { id: 'd', text: 'Diego forgot to bring his backpack to practice.' },
      ],
      expectedAnswer: 'Diego\'s arms felt extremely weak and tired after practice.',
      hints: [
        'Naming that the sentence uses like tells you the device, not the meaning. The question asks what it tells you about Diego\'s arms specifically.',
        'A pool noodle is soft, floppy and hard to hold up straight. Ask what that quality says about how Diego\'s arms felt, and check it against him barely lifting his backpack.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-personification-meaning',
      kind: 'try_yourself',
      problem:
        'Read the lines, then choose what the personification tells the reader about the bicycle.\n\n"Grandma\'s old bicycle groaned and wobbled every time Marcus pedaled it up the driveway. He finally left it in the garage for good."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bicycle is brand new and has rarely been ridden before now.' },
        { id: 'b', text: 'Marcus enjoys riding the bicycle up the driveway.' },
        { id: 'c', text: 'The bicycle is old and worn out, making it hard to ride.', correct: true },
        { id: 'd', text: 'The bicycle actually complained out loud like a person.' },
      ],
      expectedAnswer: 'The bicycle is old and worn out, making it hard to ride.',
      hints: [
        'Personification borrows a human quality to describe something more vividly; it does not mean the object is actually alive or actually talking.',
        'Check the last sentence. Marcus finally leaves the bicycle in the garage for good. Ask what condition would make someone give up on riding it entirely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hyperbole-meaning',
      kind: 'try_yourself',
      problem:
        'Read the lines, then choose what the hyperbole tells the reader.\n\n"My little sister asked me the same question a thousand times before dinner, and she asked it two more times while we were eating."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My little sister was too shy to ask her question at dinner.' },
        { id: 'b', text: 'My little sister forgot she had already asked the question.' },
        { id: 'c', text: 'My little sister asked the exact same question one thousand and two separate times before the meal was over.' },
        { id: 'd', text: 'My little sister asked her question an unusually large number of times, showing how persistent she was.', correct: true },
      ],
      expectedAnswer: 'My little sister asked her question an unusually large number of times, showing how persistent she was.',
      hints: [
        'A thousand times is not a number anyone actually counted. Hyperbole is not meant to be taken literally.',
        'Notice that the writer follows "a thousand times" with a specific small number, two more times. That contrast is a clue that the big number is a stretch, not a count.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-label-only-and-literal-personification',
      kind: 'misconception_check',
      question:
        'Two students read "The wind howled through the broken window all night." Student one writes only: "Personification." Student two writes: "Personification, because the wind was actually alive and angry." What went wrong with each answer?',
      commonErrors: [
        {
          answer: 'Personification.',
          misconception:
            'Naming the device and treating that as the whole answer, because finding the right word feels like finishing the task.',
          correctsTo:
            'Naming the device is only half of the job. Ask what the human quality — howling, a wailing sound only a person or animal makes — actually tells you about the wind. Here it tells you the wind was loud and violent all night, strong enough to sound almost like a person crying out. A complete answer always states the figurative meaning, not just the device\'s name.',
        },
        {
          answer: 'Personification, because the wind was actually alive and angry.',
          misconception:
            'Reading the human quality as literally true, because giving a mood to something that is not human can sound like a plain fact once it is written down.',
          correctsTo:
            'The wind is not alive and does not feel angry. Personification borrows a human quality on purpose to describe something nonhuman more vividly. Howling only tells the reader that the wind was loud and sounded almost human, not that the wind is a living thing with real feelings.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Figurative language says one thing to mean another, on purpose. Naming the device is only half the answer; always follow it with the figurative meaning.',
        'Simile compares two things using like or as. Metaphor says one thing IS another, unlike thing, with no like or as, and it could not be literally true.',
        'Personification gives a human quality, feeling or choice to something that is not human. WRONG: "Personification means the object is actually alive." CORRECT: "Personification borrows a human quality to describe something more vividly."',
        'Hyperbole is an exaggeration so large that nobody is meant to believe it. It is not a lie, and the size of the stretch tells you the size of the feeling.',
        'The meaning test, every time: name what is being described, name what it is compared to or what is being stretched, then say the one plain idea that connects them.',
        'Stopping at "simile" or "personification" has not answered the question yet. Always finish with what the figure actually means.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Figurative Language' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
