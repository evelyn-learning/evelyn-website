/**
 * Grade 6 ELA — Theme, Point of View & Figurative Language: Word Choice &
 * Tone.
 *
 * CONCEPT-LED fan-out row for m6ela. The student arrives already able to spot
 * a simile or a metaphor (row 2.3); this lesson builds a different way of
 * reading on top of that: a writer can describe the same event with two
 * different words and hand the reader two different feelings about it, and
 * the reader's job is to name the specific word doing that work and prove it
 * with a swap test (CCSS RL.6.4). Three traps this plan is built to kill:
 * naming a general vibe from the plot ("the tone is sad because something bad
 * happened") instead of pointing at a word, picking the word that simply
 * names the topic instead of the word that colors it, and mistaking a
 * reader's personal reaction to the events for the tone the words create.
 *
 * SCOPE GUARD: Grade 6 row 2.4 analyzes the impact of one specific word
 * choice, already made by the writer, on a literary text's meaning and tone,
 * proving the effect with a swap-test comparison against a plain, neutral
 * synonym. DELIBERATELY EXCLUDED: identifying simile, metaphor,
 * personification or hyperbole and stating the figurative meaning each
 * creates — that is row 2.3, and no figure of speech is named or analyzed
 * anywhere in this file. Also excluded: choosing which of several near-
 * synonyms best fits a blank based on its shade of meaning — that is row 7.3
 * (`connotation-and-denotation`, L.6.5c), a word-selection task, not a
 * word-choice-impact task; every item here instead asks what an
 * already-printed word contributes to a passage the student cannot revise.
 * Also excluded: analyzing word choice's impact on tone in an INFORMATIONAL
 * text, which is RI.7.4 and out of this course entirely — every excerpt in
 * this file is narrative fiction. DELIBERATELY ALLOWED, because row 7.3 sits
 * close: this plan's vocabulary defines "connotation" and "denotation",
 * because RL.6.4 itself names connotative meaning as part of the skill, and
 * one item compares two wordings of the same line side by side. That is not
 * the same task as row 7.3's fill-in-the-blank word selection — nothing in
 * this file asks the student to pick a word for an empty slot.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U2_WORD_CHOICE_AND_TONE: LessonPlan = {
  id: 'evelyn.ms.m6ela.word-choice-and-tone.v1',
  title: 'Word Choice & Tone',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.word-choice-and-tone',
      standard: 'M6ELA-2.4',
      description:
        'Analyze the impact of a specific word choice on a text\'s meaning and tone, building on the figurative and connotative meanings established in the previous topic (CCSS RL.6.4).',
    },
  ],
  prerequisites: ['m6ela.figurative-language'],
  followUps: ['m6ela.central-idea-and-supporting-details'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already notices tone shifting with word choice in ordinary texting, before naming the skill.',
      script:
        'Your friend texts back one word: "Fine." You read it three times trying to decide if she is actually fine or quietly annoyed with you. Nothing about the message changes except which exact word she picked, and the feeling behind it shifts completely depending on that one choice. Writers do the same thing on purpose, all the time. Two writers can describe the identical event and, just by picking different words for it, hand the reader two different feelings about what happened. Today we hunt for the one word doing that work in a sentence, and we learn a test that finds it every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-word-choice-and-tone',
      kind: 'concept',
      goal: 'Define tone as the attitude specific words create, and install the swap test as the method for proving what one word contributes.',
      keyIdeas: [
        'TONE IS THE ATTITUDE THE WRITER\'S WORDS CREATE TOWARD THE SUBJECT — playful, tense, proud, gloomy, mocking, and so on. Tone lives in the specific words printed on the page, not in how a reader personally feels about the events being described.',
        'A WRITER PICKS ONE WORD OVER A PLAINER ONE ON PURPOSE. Two words can point at almost the same fact and still carry a very different feeling. "The hallway was quiet" and "the hallway was hushed" report almost the same fact, but "hushed" adds a hint of held breath that "quiet" does not.',
        'THE SWAP TEST FINDS WHAT ONE WORD IS DOING. Replace the word in question with a plain, neutral synonym, then read the sentence again. Whatever feeling disappears when the swap happens is the feeling that word alone was creating.',
        'LOOK FOR THE WORD THAT CARRIES THE FEELING, NOT THE WORD THAT NAMES THE PERSON, PLACE OR EVENT. In "Priya slammed her folder onto the desk," the event is putting a folder down. The word slammed is the one carrying anger. A tone question about that sentence is asking about slammed, not about folder or desk.',
        'PROVE THE TONE FROM ONE NAMED WORD, NOT FROM A GENERAL FEELING ABOUT THE STORY. Name the word, name the plain synonym you swapped in, and say exactly what feeling vanished. A tone answer that cannot point at one specific word is not finished.',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the attitude a writer\'s specific words create toward the subject, such as playful, tense or solemn.' },
        { term: 'word choice', definition: 'the specific words a writer selects, out of several possible options, to create a particular effect.' },
        { term: 'connotation', definition: 'the feeling or association a word carries beyond its dictionary meaning.' },
        { term: 'denotation', definition: 'the dictionary meaning of a word, separate from any feeling it carries.' },
        { term: 'neutral synonym', definition: 'a plain word close in meaning to another word but carrying far less feeling, useful for testing what a stronger word contributes.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-swap-test-one-word',
      kind: 'worked_example',
      problem:
        'Explain what the word "lurched" contributes to the tone of this sentence, using the swap test.\n\n"The bus lurched to a stop, and Talia grabbed the seat in front of her to keep from falling into the aisle."',
      steps: [
        'Name the exact word in question: lurched.',
        'Swap it for a plain, neutral synonym that reports about the same event: stopped. Read the sentence again with the swap in place: "The bus stopped, and Talia grabbed the seat in front of her to keep from falling into the aisle."',
        'Notice what breaks. A bus that simply "stopped" gives no reason for anyone to nearly fall. The sudden, jolting motion is gone, and with it goes the reason the rest of the sentence makes sense.',
        'Name exactly what disappeared: the abruptness and force of the stop. "Stopped" could describe a smooth, gentle halt. "Lurched" cannot.',
        'Connect the word to the tone of the whole sentence: it feels sudden and unsteady, which matches Talia grabbing the seat to keep from falling.',
        'State the answer by naming the word, the swap, and the feeling the swap removes.',
      ],
      answer:
        'The word "lurched" creates a sudden, unsteady feeling. Swapping it for the neutral word "stopped" removes the sense of abrupt, jolting motion, and that abruptness is exactly what explains why Talia had to grab the seat.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-tone-analysis',
      kind: 'worked_example',
      problem:
        'Repair this student\'s tone analysis so that it points at one specific word.\n\nSentence: "Coach Reyes barked the starting lineup without looking up from her clipboard."\n\nStudent analysis: "The tone is bad because the coach was mean."',
      steps: [
        'Notice the problem with the student\'s answer first: "bad" and "mean" describe a general impression of the coach, not a word from the sentence. A tone answer has to name a word.',
        'Hunt for the word that carries more feeling than a plain synonym would. Barked stands out. A plain, neutral synonym for the same action is said or called out.',
        'Run the swap test. Swap barked for said: "Coach Reyes said the starting lineup without looking up from her clipboard." The sharp, clipped feeling disappears. "Said" could sound warm, bored or gentle. "Barked" cannot.',
        'Name exactly what disappeared: the curt, impatient sharpness in how the lineup was delivered.',
        'Check the rest of the sentence for support. "Without looking up from her clipboard" adds to the same impatient feeling; it is a second detail, not the word doing the main work.',
        'WRONG: "The tone is bad because the coach was mean." CORRECT: "The word \'barked\' gives the coach a curt, impatient tone; a coach who \'said\' the lineup would sound far more neutral."',
      ],
      answer:
        'The word "barked" creates a curt, impatient tone. Swapping it for the neutral word "said" removes that sharpness, which shows that "barked" — not the coach\'s actions in general — is what is doing the work.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-word-doing-the-work',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose the word that does the most work creating its tone.\n\n"Elena\'s little brother snatched the last cookie off the plate before she could reach it, and grinned at her with crumbs on his chin."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'plate' },
        { id: 'b', text: 'cookie' },
        { id: 'c', text: 'snatched', correct: true },
        { id: 'd', text: 'chin' },
      ],
      expectedAnswer: 'snatched',
      hints: [
        'Three of these words simply name objects sitting in the scene. One word describes how an action happened, and that is where a feeling can live.',
        'Swap "snatched" for a plain word like "took" and notice what quick, sneaky feeling disappears from the sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compare-two-versions',
      kind: 'try_yourself',
      problem:
        'Compare the two versions of the same moment, then choose the sentence that best explains what changes.\n\nVERSION A: "\'Five minutes,\' Ms. Alvarez said, sliding a cart of books back onto the shelf."\nVERSION B: "\'Five minutes,\' Ms. Alvarez announced, sliding a cart of books back onto the shelf."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It makes Ms. Alvarez sound like she is speaking only to herself and not to the room, since "announced" is a quieter and more private word than "said."' },
        { id: 'b', text: 'It changes what Ms. Alvarez is holding, since "announced" suggests she is carrying a microphone.' },
        { id: 'c', text: 'It has no effect on the tone, since "said" and "announced" mean exactly the same thing.' },
        { id: 'd', text: 'It makes the warning sound more official and aimed at the whole room, since "announced" suggests speaking to everyone rather than to one person.', correct: true },
      ],
      expectedAnswer: 'It makes the warning sound more official and aimed at the whole room, since "announced" suggests speaking to everyone rather than to one person.',
      hints: [
        'Only one word changes between the two versions. Ask what that one word usually suggests about who is being spoken to.',
        'Rule out any choice that invents a detail neither version prints, and any choice that claims the two words mean precisely the same thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-supported-tone',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose the description of its tone that is best supported by the word choices.\n\n"The gym went silent except for the squeak of Priya\'s sneakers as she stepped toward the free-throw line, gripping the ball so tightly that her knuckles turned pale."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Tense and nervous, because words like "went silent," "gripping ... so tightly" and "knuckles turned pale" show controlled strain.', correct: true },
        { id: 'b', text: 'Excited and joyful, because the crowd is cheering loudly for Priya as she steps up to the free-throw line to take the winning shot.' },
        { id: 'c', text: 'Bored and indifferent, because the gym is quiet.' },
        { id: 'd', text: 'Confident and relaxed, because Priya already knows she will make the shot and has practiced this exact moment many times.' },
      ],
      expectedAnswer: 'Tense and nervous, because words like "went silent," "gripping ... so tightly" and "knuckles turned pale" show controlled strain.',
      hints: [
        'Look at three specific phrases: "went silent," "gripping the ball so tightly," and "knuckles turned pale." What single feeling do all three point toward?',
        'One choice invents a crowd this sentence never mentions, and two choices describe feelings that a tight, pale-knuckled grip cannot support.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plot-versus-word',
      kind: 'misconception_check',
      question:
        'A student reads a paragraph about a thunderstorm knocking out the neighborhood\'s power and writes: "The tone is scary because storms are scary." What went wrong, and what word-level fix does the answer need?',
      commonErrors: [
        {
          answer: 'The tone is scary because storms are scary.',
          misconception:
            'Naming a reaction to the topic instead of pointing at a word the writer chose. Storms genuinely can feel scary, so the sentence sounds reasonable, and nothing about it looks wrong at first.',
          correctsTo:
            'Tone comes from the specific words a writer picks, not from how a reader personally feels about the subject in general. Go back to the paragraph and find the word doing the work. A phrase like "the lights snapped off" creates a sudden, startling tone, while "the lights went out" would feel calmer even though the event is the same. Name that one word or phrase before naming a tone.',
        },
        {
          answer: 'The word responsible for the tone is "thunderstorm," since it is the biggest, most dramatic-sounding word in the paragraph.',
          misconception:
            'Picking the word that names the topic instead of the word that colors it. "Thunderstorm" names the event; by itself it does not carry the writer\'s attitude toward it.',
          correctsTo:
            'Run the swap test on the word in question. Swapping "thunderstorm" for the plain word "storm" changes almost nothing about the feeling of the sentence. Swapping a verb like "snapped" for a plain verb like "went" removes a real jolt. The word responsible for tone is the one whose swap changes the feeling, not the word that simply names the subject.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tone is the attitude the writer\'s specific words create, not the reader\'s personal reaction to the events.',
        'A writer can pick one word over a plainer word on purpose. Two words can point at almost the same fact and still feel different.',
        'The swap test finds what one word contributes: replace it with a plain, neutral synonym and notice what feeling disappears.',
        'Look for the word that carries the feeling, not the word that simply names a person, place or event.',
        'Prove a tone by naming the exact word and the neutral synonym you swapped in for it.',
        'WRONG: "The tone is bad because the coach was mean." CORRECT: "The word \'barked\' gives the coach a curt, impatient tone."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Word Choice & Tone' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
