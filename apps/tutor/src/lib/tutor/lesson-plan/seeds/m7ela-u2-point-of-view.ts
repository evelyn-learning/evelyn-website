/**
 * Grade 7 ELA — Reading Literature: Point of View & Narrator.
 *
 * Who is telling this story, and what does that position let the reader see
 * (CCSS RL.7.6)? First person, third person limited, third person omniscient
 * and the rare second person, sorted by ONE test: whose thoughts do you get?
 * Then the step past labeling that RL.7.6 actually asks for — what this
 * narrator lets the reader know, and what the same narrator hides.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U2_POINT_OF_VIEW: LessonPlan = {
  id: 'evelyn.ms.m7ela.point-of-view.v1',
  title: 'Point of View & Narrator',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.point-of-view',
      standard: 'M7ELA-2.2',
      description:
        'Identify first person, second person, third person limited and third person omniscient narration by asking whose thoughts the narration reports, and analyze how an author develops and contrasts the points of view of different characters or narrators — what each teller lets the reader know and what that same teller hides (CCSS RL.7.6).',
    },
  ],
  prerequisites: ['m7ela.theme-and-summary'],
  followUps: ['m7ela.figurative-language'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that the teller, not the events, decides what the reader gets to know.',
      script:
        'Your little brother tells your parents what happened to the last slice of pizza. Then you tell them. Same kitchen, same pizza, two stories that do not match. Nobody has to lie for that to happen. Each of you can see inside exactly one head, and it is your own. Stories work the same way. Before a writer types a single sentence, they decide who gets to tell it, and that one decision settles what you are allowed to find out and what stays hidden from you the whole way through. Today we learn to name that choice, and then we do the harder part: we ask what the choice costs the reader.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-point-of-view',
      kind: 'concept',
      goal: 'Name the four points of view, install the whose-thoughts test, and push past labeling to what each narrator hides.',
      keyIdeas: [
        'POINT OF VIEW IS WHO IS TELLING THE STORY, and there is one test that sorts them all: WHOSE THOUGHTS DO YOU GET? Not whose name shows up most. Not which pronouns appear on the page. Whose head does the narration go inside? Ask that question first, every single time, and the label falls out of the answer.',
        'FIRST PERSON — the narrator is a character standing inside the story, using I and we: "I counted the stairs on the way down, the way I always do." You get that one character\'s thoughts in full, and nobody else\'s. Whatever happens in a room the narrator is not in does not make it into the book.',
        'THIRD PERSON LIMITED — an outside voice tells the story with he, she, they and names, and it goes inside exactly ONE character\'s head: "Kwame decided the noise was nothing. Down the hall, his sister shut a drawer." You know what Kwame decided. His sister is only what Kwame could watch her do.',
        'THIRD PERSON OMNISCIENT — an outside voice that can go inside every head, and can tell you things no character in the book knows: "Kwame decided the noise was nothing. Three feet away, his sister was deciding the opposite." Omniscient means all-knowing.',
        'SECOND PERSON is the rare fourth one. It talks straight to the reader as you: "You take the seat by the window because it is the only one left." And here is the rule that catches most people: only the NARRATION counts. A third person story can be stuffed with characters saying I out loud, because an I inside quotation marks belongs to the SPEAKER, not to the narrator.',
        'ALWAYS ASK WHAT THE NARRATOR HIDES. Every point of view is a set of walls. First person hides what everyone else is really thinking, and it hides every scene the narrator misses. Third person limited hides the second character\'s reasons, which is exactly where the tension usually lives. Omniscient hides almost nothing, so the suspense has to come from what the characters do not know about each other. One more wall: the narrator is not the author. A grown writer can tell a whole book as a twelve-year-old, a grandmother, or a dog.',
      ],
      vocabulary: [
        { term: 'point of view', definition: 'who is telling the story, and how much that teller is able to know.' },
        { term: 'narrator', definition: 'the voice telling the story. The narrator is a choice the author made, not the author.' },
        { term: 'first person', definition: 'narration by a character inside the story, using I and we.' },
        { term: 'third person limited', definition: 'narration by an outside voice that reports the thoughts of exactly one character.' },
        { term: 'omniscient', definition: 'all-knowing. An outside narrator who can report the thoughts of every character.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-whose-thoughts',
      kind: 'worked_example',
      problem:
        'Name the point of view, then say one thing the reader is not allowed to find out.\n\n"Devin read the note twice. He was almost sure it was a joke, but he folded it into his pocket anyway. Ms. Alvarez kept writing on the board and did not turn around."',
      steps: [
        'Do the rough sort with pronouns first. The narration says Devin, he, his, Ms. Alvarez. There is no I and no you anywhere in the narration, so this is third person. That is as far as pronouns can take us.',
        'Now run the real test: whose thoughts do you get? "He was almost sure it was a joke" is Devin thinking. That is head number one.',
        'Test the second character before you decide. Ms. Alvarez gets "kept writing on the board and did not turn around." Both of those are things Devin could see from his own desk. No thought, no feeling, no reason. That is a person watched from the outside, not a head we entered.',
        'One head means third person limited. Two or more heads would have meant omniscient.',
        'Now the part the standard actually asks for: what does this choice hide? We never learn whether Ms. Alvarez knows about the note, or what she thinks of Devin. The reader is stuck at Devin\'s desk, which is exactly why the moment feels tense.',
        'Say the whole answer, not just the label: third person limited, because the narration reports only Devin\'s thoughts, and it hides what Ms. Alvarez is thinking.',
      ],
      answer:
        'Third person limited. The narration goes inside Devin\'s head only, and Ms. Alvarez is shown from the outside, so the reader never finds out whether she noticed the note or what she thinks about it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-contrast-two-versions',
      kind: 'worked_example',
      problem:
        'Here is one moment written two ways. Which version is omniscient, and what does the reader gain and lose?\n\nVERSION A: "Ines slid the last brownie onto Marcus\'s plate. She had wanted it all afternoon. Marcus said thanks and ate it in two bites."\n\nVERSION B: "Ines slid the last brownie onto Marcus\'s plate. She had wanted it all afternoon. Marcus said thanks and ate it in two bites, wondering why she was being so nice."',
      steps: [
        'Both versions are third person. Both use she and he and names. So the pronouns cannot separate them, and anyone sorting by pronouns alone is stuck.',
        'Count heads in Version A. "She had wanted it all afternoon" is Ines thinking. Marcus gets "said thanks and ate it in two bites," which is only what Ines could watch him do. One head. Version A is third person limited.',
        'Count heads in Version B. Ines is still head one. Then "wondering why she was being so nice" is Marcus thinking, and Ines cannot hear that. Two heads. Version B is third person omniscient.',
        'Now compare what the reader gets. Version B hands you both sides at once. You know Ines gave up something she wanted, and you know Marcus is suspicious instead of grateful. The gap between the two is right there on the page.',
        'And compare what the reader loses. In Version A you are trapped with Ines, wondering along with her whether Marcus even noticed. That not-knowing is a feeling Version B deletes.',
        'This is what it means to say an author develops and contrasts points of view. The events did not change at all. The teller changed, and that changed what the moment means.',
      ],
      answer:
        'Version B is third person omniscient, because it reports Marcus\'s thoughts as well as Ines\'s. Version A is third person limited. B gains both sides of the moment at once. A keeps the reader inside Ines\'s uncertainty about whether Marcus noticed.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-i-in-dialogue',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the point of view.\n\n"Priya dropped her backpack by the door. \'I already fed the dog,\' her brother said from the couch, without looking up. She was almost sure he had not."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'First person' },
        { id: 'b', text: 'Second person' },
        { id: 'c', text: 'Third person limited', correct: true },
        { id: 'd', text: 'Third person omniscient' },
      ],
      expectedAnswer: 'Third person limited',
      hints: [
        'Cover the words inside the quotation marks with your thumb and read only what is left. That leftover part is the narration, and the narration is what you are classifying.',
        'Now ask whose thoughts you get. You are told what Priya was almost sure of. Are you ever told what her brother is thinking, or only what he says and does?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-first-person-access',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose what this narrator lets the reader know.\n\n"I told Jamal that losing the match did not bother me. He laughed once, then walked ahead of me the whole way home and did not say another word."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'You learn everything that happens in the story, including the parts the narrator is not there for.' },
        { id: 'b', text: 'You learn what the narrator is thinking and what Jamal is thinking.' },
        { id: 'c', text: 'You learn what Jamal is thinking, but not what the narrator is thinking.' },
        { id: 'd', text: 'You learn what the narrator says and notices, but you can only guess what Jamal is thinking.', correct: true },
      ],
      expectedAnswer: 'You learn what the narrator says and notices, but you can only guess what Jamal is thinking.',
      hints: [
        'The narrator is a person standing in the story. How many heads can a person standing in a story see inside?',
        'Look at what you are actually told about Jamal: he laughed, he walked ahead, he stayed quiet. Those are things you could watch from the sidewalk. Not one of them is a thought.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-make-it-omniscient',
      kind: 'try_yourself',
      problem:
        'This excerpt is third person limited.\n\n"Rosa checked the clock and decided she could still finish the poster before the bell. Across the table, Dev shoved his markers into his bag and stood up."\n\nWhich sentence, added to the end, would turn it into third person omniscient?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"I have to go," Dev said as he passed her chair.' },
        { id: 'b', text: 'Dev was not leaving because he was finished. He was leaving because he could not stand to watch Rosa win again.', correct: true },
        { id: 'c', text: 'Rosa wondered whether Dev was annoyed with her.' },
        { id: 'd', text: 'Dev walked out of the room without saying goodbye.' },
      ],
      expectedAnswer: 'Dev was not leaving because he was finished. He was leaving because he could not stand to watch Rosa win again.',
      hints: [
        'The narration already goes inside Rosa. To become omniscient it has to open a SECOND head.',
        'Three of these only add something you could see or hear from Rosa\'s chair, or one more of Rosa\'s own thoughts. One of them tells you the real reason Dev is leaving, and only Dev knows that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-narrator-and-pronouns',
      kind: 'misconception_check',
      question:
        'Two students slip up on the same page. One reads a novel whose narrator says "I" and writes that the narrator is the author. The other reads a story where a character says "I have to go" and writes that the story is first person. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The narrator says "I", so the narrator is the author.',
          misconception:
            'Treating the first person narrator as the real person who wrote the book, so every opinion in the story gets blamed on the author.',
          correctsTo:
            'The narrator is a character the author built, the same way they built the setting and the plot. A forty year old writer can narrate a whole novel as a twelve year old, a grandmother, a soldier, or a stray dog. The I on the page belongs to that invented teller. So when a narrator says something unfair or gets something wrong, that is not proof the author believes it. Very often the author put the mistake there on purpose so the reader would notice it.',
        },
        {
          answer: 'A character says "I have to go", so the story is first person.',
          misconception:
            'Classifying point of view by hunting for pronouns anywhere on the page, including inside quotation marks.',
          correctsTo:
            'Only the NARRATION decides the point of view, never the dialogue. Cover the quoted words and read what is left. If the leftover part says "Dev said" and "he stood up", the story is third person, no matter how many times a character says I out loud. Characters in every story talk about themselves. That is just people talking, and it tells you nothing about who is telling the story.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four points of view: first person (I), second person (you), third person limited (one head), third person omniscient (every head).',
        'The test is WHOSE THOUGHTS DO YOU GET. Limited and omniscient both use he, she and they, so the pronoun alone never decides between them.',
        'Only the narration counts. An I inside quotation marks belongs to the speaker, so a third person story can be full of characters saying I.',
        'Always ask what the narrator hides. First person hides everyone else\'s real thoughts and every scene the narrator misses. Limited hides the second character\'s reasons.',
        'The narrator is not the author. The narrator is a character the author chose, and changing that choice changes what the same events mean.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Point of View & Narrator' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
