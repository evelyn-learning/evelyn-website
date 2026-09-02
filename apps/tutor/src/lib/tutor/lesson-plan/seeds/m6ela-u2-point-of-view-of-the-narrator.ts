/**
 * Grade 6 ELA — Theme, Point of View & Figurative Language: Point of View of
 * the Narrator.
 *
 * CONCEPT-LED lesson for the m6ela fan-out. The student learns to find ONE
 * narrator's position inside a single text: whose thoughts the narration
 * reports, what that one teller's position lets the reader know, and what it
 * keeps hidden (CCSS RL.6.6). Three traps this plan is built to kill: sorting
 * point of view by counting pronouns anywhere on the page instead of testing
 * the narration itself, mistaking a character's own quoted "I" for narration,
 * and the classic confusion of treating the narrator as the real author.
 *
 * SCOPE GUARD: Grade 6 row 2.2 explains how an author develops the point of
 * view of a SINGLE narrator or speaker inside one text — naming first person,
 * second person, third person limited and third person omniscient, and
 * stating what that one teller's position lets the reader know. DELIBERATELY
 * EXCLUDED: contrasting the points of view of two different narrators or two
 * different characters against each other, and analyzing how an author
 * develops and contrasts multiple points of view across a text — that is
 * RL.7.6, already taught end to end by the shipped m7ela-u2-point-of-view.ts,
 * and no item in this file prints two labeled versions of one moment or asks
 * the student to compare two tellers. DELIBERATELY ALLOWED, because the line
 * sits close: (a) a single excerpt in this file is third person OMNISCIENT,
 * which means one narrator reporting the thoughts of more than one character
 * inside the SAME account — that is naming a category this row's own scope
 * line asks for, not contrasting two tellers; (b) the classic Grade 6
 * confusion of treating the narrator as the real author is tested directly,
 * because RL.6.6 is exactly the standard that asks a sixth grader to tell a
 * narrator's position apart from the author's; (c) no excerpt here uses the
 * VERSION A / VERSION B format — that pattern belongs to row 4.4's comparison
 * of two authors' accounts and to the shipped Grade 7 lesson, not to this row.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or closely
 * paraphrased. Every phrase this file puts inside quotation marks appears
 * character-for-character in the excerpt above it; quote your own excerpt
 * exactly, never from memory. Two excerpts in this file include a line of
 * quoted character dialogue; the contraction inside that quoted line belongs
 * to the character speaking, not to the tutor, and is the deliberate
 * dialogue exemption to this course's no-contractions rule. The narration
 * surrounding every quoted line stays contraction-free.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U2_POINT_OF_VIEW_OF_THE_NARRATOR: LessonPlan = {
  id: 'evelyn.ms.m6ela.point-of-view-of-the-narrator.v1',
  title: 'Point of View of the Narrator',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.point-of-view-of-the-narrator',
      standard: 'M6ELA-2.2',
      description:
        'Explain how an author develops the point of view of a single narrator or speaker in a text, naming first person, second person, third person limited and third person omniscient and stating what that one teller\'s position lets the reader know, without yet contrasting two narrators\' or characters\' points of view against each other, the move RL.7.6 asks for next (CCSS RL.6.6).',
    },
  ],
  prerequisites: ['m6ela.theme-and-objective-summary'],
  followUps: ['m6ela.figurative-language'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that who tells an event, and how far inside that one head the reader gets to go, changes what comes through.',
      script:
        'Your friend texts you: "guess what happened at practice." You could answer as a plain play-by-play: "The ball rolled under the bleachers and the coach blew the whistle twice." Or you could answer the way you actually experienced it: "I could not believe it. I was so sure we had it in the bag, and then the ball just disappeared under the bleachers." Same event, same person telling it, but the second answer lets your friend into your head — what you felt, what you were sure of — and the first one does not. Every story a writer tells makes that same decision on purpose: who tells it, and how far inside that one teller\'s head the reader gets to go. Today we learn to spot that choice and say exactly what it lets the reader know.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-point-of-view-of-one-narrator',
      kind: 'concept',
      goal: 'Name first, second, third person limited and third person omniscient, install the whose-thoughts test and the narration-only rule, and warn against the narrator-is-the-author trap.',
      keyIdeas: [
        'POINT OF VIEW IS WHO IS TELLING THE STORY, and one test sorts every kind: WHOSE THOUGHTS DO YOU GET? Not which name shows up most, not which pronouns appear on the page — whose head does the narration go inside? Ask that question first, every time, and the point of view name follows from the answer.',
        'FIRST PERSON — the narrator is a character inside the story, speaking as I and we: "I checked the bus schedule twice before I believed it." The reader gets that one character\'s own thoughts and nothing more. Whatever happens somewhere that narrator is not, the reader never finds out.',
        'THIRD PERSON LIMITED — an outside voice narrates using he, she, they and names, and it opens exactly ONE character\'s thoughts: "Malik decided the shortcut was worth the risk. Across the street, his sister checked the time." The reader knows what Malik decided. His sister is only what could be seen from outside.',
        'THIRD PERSON OMNISCIENT — an outside voice that opens more than one character\'s thoughts inside the same account, and can tell the reader things no single character in the story knows on their own. Omniscient means all-knowing.',
        'SECOND PERSON is rare. It speaks straight to the reader as you: "You grab the last seat by the window because every other one is taken." And here is the trap that catches the most students: only the NARRATION decides the point of view. A third person story can be full of characters saying I out loud, because an I inside quotation marks belongs to the speaker, never to the narrator.',
        'THE NARRATOR IS NOT THE AUTHOR. A grown writer can narrate an entire story as a sixth grader, an old dog, or an object hanging on a classroom wall. Watch for a detail that plainly could not be true of the real, living author — that detail is proof the narrator is an invented voice, not the writer speaking directly.',
      ],
      vocabulary: [
        { term: 'point of view', definition: 'who is telling a story, and whose thoughts the reader is allowed to know.' },
        { term: 'narrator', definition: 'the voice telling the story. The narrator is a choice the author made, not the author.' },
        { term: 'first person', definition: 'narration by a character inside the story, using I and we.' },
        { term: 'third person limited', definition: 'narration by an outside voice that reports the thoughts of exactly one character.' },
        { term: 'omniscient', definition: 'all-knowing. Narration by an outside voice that reports the thoughts of more than one character.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-whose-thoughts-third-limited',
      kind: 'worked_example',
      problem:
        'Name the point of view of this excerpt, then say one thing the reader cannot find out.\n\n"Teo checked his backpack three times before the bus came. He was almost sure he had packed the permission slip, but a small worried feeling would not go away. Two seats up, Ms. Okafor graded papers and did not look back once."',
      steps: [
        'Do the rough sort with pronouns first. The narration says Teo, he, his, Ms. Okafor — no I and no you anywhere in the narration. That is as far as pronouns can take us: this is third person.',
        'Now run the real test: whose thoughts do you get? "He was almost sure he had packed the permission slip, but a small worried feeling would not go away" is Teo thinking. That is head number one.',
        'Test the second character before deciding. Ms. Okafor gets "graded papers and did not look back once." That is something Teo, or anyone else on the bus, could watch her do. No thought is reported for her at all.',
        'One head open means third person limited. Two or more heads open in the same account would have meant omniscient.',
        'Now answer the second part of the question: what does this choice hide? The reader never learns whether Ms. Okafor noticed Teo checking his bag, or what she thinks about it, because the narration never opens her thoughts.',
        'Say the whole answer, not just the label: third person limited, because the narration reports only Teo\'s thoughts, and it hides whatever Ms. Okafor is thinking.',
      ],
      answer:
        'Third person limited. The narration reports only Teo\'s thoughts — "he was almost sure he had packed the permission slip" — and Ms. Okafor is shown only from the outside, so the reader never finds out whether she noticed Teo or what she thinks about it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-naming-omniscient',
      kind: 'worked_example',
      problem:
        'Name the point of view of this excerpt.\n\n"Grandma Rosa set two mugs on the table and hoped Diego would finally ask what was bothering him. Diego stirred his cocoa and decided this was not the day to bring it up."',
      steps: [
        'Rough sort with pronouns: she, he and names, no I and no you. Third person again — but that alone does not say which kind.',
        'Check the first head. "Hoped Diego would finally ask what was bothering him" is a thought, and it belongs to Grandma Rosa. Head one is open.',
        'Check the second head before stopping. "Decided this was not the day to bring it up" is also a thought, and this one belongs to Diego. Head two is open, in the very same excerpt.',
        'Two heads open in one account means third person omniscient, not third person limited. If only Grandma Rosa\'s thought had been reported, this would have been limited.',
        'Say what that gives the reader: the reader knows something neither Grandma Rosa nor Diego knows about the other — that they are avoiding the same conversation for their own separate reasons.',
      ],
      answer:
        'Third person omniscient. The narration reports Grandma Rosa\'s hope and Diego\'s decision in the same passage, opening two characters\' thoughts rather than one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-narration-not-dialogue',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the point of view.\n\n"Jordan yanked his sneakers on by the door. \'I already walked the dog this morning, so it\'s your turn to feed her,\' his sister called from the couch, without looking up. He doubted that was true."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Third person limited', correct: true },
        { id: 'b', text: 'Third person omniscient' },
        { id: 'c', text: 'Second person' },
        { id: 'd', text: 'First person' },
      ],
      expectedAnswer: 'Third person limited',
      hints: [
        'Cover the words inside the quotation marks with a finger and read only what is left. That leftover part is the narration, and the narration is what decides point of view.',
        'Now ask whose thoughts the narration itself reports. You are told what Jordan doubted. Are you ever told what his sister is thinking, or only what she says out loud?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-first-person-lets-you-know',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose what the reader gets to know that a coach standing nearby would not.\n\n"I told my coach the ankle felt fine. The truth was it throbbed every time I took a step, but I was not about to say that out loud two days before the county track meet."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Everything that every other runner, the coach, and the officials at the track are thinking at that same moment.' },
        { id: 'b', text: 'That the narrator\'s ankle actually throbs, even though the narrator told the coach it felt fine.', correct: true },
        { id: 'c', text: 'What the coach is thinking about the narrator\'s ankle.' },
        { id: 'd', text: 'A description of the track from an outside, floating camera.' },
      ],
      expectedAnswer: 'That the narrator\'s ankle actually throbs, even though the narrator told the coach it felt fine.',
      hints: [
        'A first person narrator can only report what happens inside the narrator\'s own head. Find the one sentence where the narrator\'s real feeling does not match the words spoken out loud.',
        'The coach only hears "the ankle felt fine." The reader is told something the coach never gets to hear.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-narrator-is-not-the-author',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the best description of who is telling this story.\n\n"I have hung on the wall of Ms. Kwan\'s classroom for eleven years. I have watched two hundred backpacks come through that door in September and out again in June, and not one of them ever looked twice at me."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The author of the book, looking back and describing a real memory from their own school days in a classroom like Ms. Kwan\'s.' },
        { id: 'b', text: 'A third person narrator watching Ms. Kwan\'s classroom from a distance.' },
        { id: 'c', text: 'A narrator that is a made-up voice, something on the wall of the classroom and not a person at all.', correct: true },
        { id: 'd', text: 'A second person narrator speaking directly to the reader.' },
      ],
      expectedAnswer: 'A narrator that is a made-up voice, something on the wall of the classroom and not a person at all.',
      hints: [
        'Read every sentence and ask what kind of thing could actually say those exact words about itself.',
        'A person cannot hang on a wall for eleven years. Whatever this narrator is, its own words rule out a real, living author describing an actual school day.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-author-and-dialogue-traps',
      kind: 'misconception_check',
      question:
        'A student reads a story narrated by an old ship anchored at a dock, saying "I have watched every boat in this harbor for forty years." The student writes that the story is told in first person by the real author, who must be forty years old. A second student reads a story where a character says "I never even wanted to go" and calls the whole story first person. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The narrator is speaking as I, so the narrator must be the real author, and the author must be forty years old.',
          misconception:
            'Treating a first person narrator as the literal, real person who wrote the story, so every detail the narrator states about itself gets applied to the author.',
          correctsTo:
            'A narrator is a voice the author invents, the same way the author invents the setting and the events. An author can write as an old ship, a house cat, or a sixth grader without being any of those things. Check the narrator\'s own words for a fact a real author plainly is not — "I have watched every boat in this harbor for forty years" is a ship talking about being anchored at a dock, not a person describing a memory. When a detail like that shows up, the narrator is a made-up voice, not the author speaking directly.',
        },
        {
          answer: 'A character says "I never even wanted to go," so the whole story is first person.',
          misconception:
            'Classifying point of view by searching for the pronoun I anywhere on the page, including inside a character\'s own spoken words.',
          correctsTo:
            'Only the narration decides the point of view, never a line of dialogue. Cover the words inside quotation marks and read what is left. If the leftover narration uses names, he or she, the story is third person, no matter how many times a character says I out loud. A character talking about themselves is just a person talking. It says nothing about who is telling the story.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Point of view is who is telling the story. Ask whose thoughts the narration reports, not just which pronouns appear.',
        'First person uses I and we, and reports only one character\'s own thoughts, from inside that character\'s head.',
        'Third person limited uses names, he, she and they, and still opens only ONE character\'s thoughts. Third person omniscient opens more than one character\'s thoughts inside the same account.',
        'Second person is rare and speaks straight to the reader as you.',
        'The narrator is not the author. An author can invent a narrator that is a different age, a different person, or not even human, and the narrator\'s own words are often the proof.',
        'Only the narration counts when naming the point of view. A character saying I inside quotation marks is dialogue, not narration.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Point of View of the Narrator' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
