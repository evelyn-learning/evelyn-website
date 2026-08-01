/**
 * HS English — Reading Literature: Narrative Point of View.
 *
 * Who is telling this, and what can that teller know (CCSS RL.9-10.5,
 * RL.9-10.6): pronoun cues, the ACCESS test that separates third-person
 * limited from omniscient, and the flags that mark a narrator as
 * unreliable. All excerpts are short ORIGINAL prose written for this
 * lesson — no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U6_NARRATIVE_POINT_OF_VIEW: LessonPlan = {
  id: 'evelyn.hs.engl.narrative-point-of-view.v1',
  title: 'Narrative Point of View',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.narrative-point-of-view',
      standard: 'ENGL-6.3',
      description:
        'Identify first-person, second-person, third-person limited, and third-person omniscient narration, and analyze how the chosen point of view controls what a reader is allowed to know — including when a narrator proves unreliable (CCSS RL.9-10.5, RL.9-10.6).',
    },
  ],
  prerequisites: ['engl.characterization'],
  followUps: ['engl.theme'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that the teller, not the events, decides what a story means.',
      script:
        'Two friends have the same argument on Friday night. Ask each of them what happened on Monday and you get two different stories — same events, same room, two narrators. Neither one is lying, exactly. Each one simply has access to only one head, and each one is the hero of the version they tell. Authors choose a narrator the same way, and that single choice decides what you are allowed to see, what stays hidden, and whether you should believe a word of it. Today we learn to name the choice and read what it costs.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pov',
      kind: 'concept',
      goal: 'The four points of view, the ACCESS test, unreliability flags, and the pronoun-only shortcut trap.',
      keyIdeas: [
        'FIRST PERSON — the narrator is a character inside the story, using I and we: "I counted the stairs on the way down, the way I always do." You get that character\'s inner life in full, and nothing else first-hand.',
        'SECOND PERSON — the narrator addresses the reader as you: "You take the seat by the window because it is the only one left." Rare, unsettling, and used to pull the reader into the role of the character.',
        'THIRD PERSON LIMITED — an outside voice uses he, she, they, or names, but enters exactly ONE character\'s mind: "Kwame decided the noise was nothing. Across the hall, his roommate shut a drawer." We know what Kwame decided; the roommate is only what Kwame can observe.',
        'THIRD PERSON OMNISCIENT — an outside voice moves freely between minds and can report what no single character knows: "Kwame decided the noise was nothing. His roommate, three feet away, was deciding the opposite."',
        'THE ACCESS TEST — the one question that separates limited from omniscient: WHOSE HEAD CAN WE ENTER? Count the minds the narration reports from. Zero or one mind means first person or third limited; two or more means omniscient. Everything else about the passage is decoration.',
        'WHAT EACH POV CANNOT SHOW — first person cannot show what happens when the narrator leaves the room, or what anyone else truly thinks; third limited cannot cross into a second mind; omniscient can show almost anything, which is why suspense in an omniscient story comes from what characters do not know about each other rather than from what the reader is denied.',
        'UNRELIABLE NARRATOR FLAGS — first person narration invites doubt, and three signals raise it: the account is self-serving (the narrator always comes out reasonable); the narration contradicts the events it reports ("Nobody minded," said while describing a room emptying out); or the narrator admits limits — youth, memory gaps, a stake in the outcome. Unreliable does not mean lying; it means the gap between what the narrator says and what actually happened is itself the story.',
        'POV SHIFTS AND THE PRONOUN-ONLY ERROR — an author who switches narrators between chapters is doing it on purpose, usually to show the same event from a second angle, so ask what the new teller can see that the old one could not. And never classify by pronouns alone: an I inside quoted dialogue belongs to the SPEAKER, not the narrator. Judge the narration, not the conversation.',
      ],
      vocabulary: [
        { term: 'third-person limited', definition: 'an outside narrator who reports the inner thoughts of exactly one character and treats everyone else from the outside.' },
        { term: 'omniscient', definition: 'an outside narrator with access to more than one character\'s mind, and often to information no character has.' },
        { term: 'unreliable narrator', definition: 'a narrator whose account the reader has reason to doubt, because of self-interest, limited knowledge, or contradictions inside the telling.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify-access',
      kind: 'worked_example',
      problem:
        'Classify the point of view of this excerpt using the access test: "Dario counted the change twice before he handed it over. He wondered whether the cashier had noticed his hands shaking, but the cashier only stared past him toward the door."',
      steps: [
        'Check the pronouns first, as a rough sort: the narration uses he and him and a proper name, never I or you. That rules out first person and second person and leaves the two third-person options.',
        'Now run the ACCESS test — whose head can we enter? "He wondered whether the cashier had noticed" is Dario\'s inner thought, reported from inside. That is one mind.',
        'Test the second character. The cashier gets "only stared past him toward the door" — observable behavior, the kind of thing Dario himself could see. No thought, no feeling, no reason for the stare. That is not a second mind; that is a body seen from outside.',
        'One mind entered means limited, not omniscient. Note what the choice costs the reader: we do not learn whether the cashier noticed anything, and the tension in the excerpt depends entirely on that gap.',
      ],
      answer:
        'Third-person limited — the narration enters only Dario\'s mind and shows the cashier from the outside',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-limited-mistaken-for-omniscient',
      kind: 'worked_example',
      problem:
        'A student labels this excerpt third-person omniscient because it reports a character\'s thoughts: "Renata was certain the letter would change nothing. Across the table, her uncle folded his napkin into a smaller and smaller square and said nothing at all." What did the student get wrong?',
      steps: [
        'Name the reasoning behind the error: the student treated any reported thought as proof of omniscience. But reporting thoughts is exactly what third-person LIMITED does — that is the whole point of the mode.',
        'Apply the access test properly by counting minds, not thoughts. Mind one: Renata, whose certainty we are told directly.',
        'Test the uncle. We get folding, shrinking squares, and silence — all of it visible from Renata\'s chair. We are never told what the uncle believes about the letter, which is precisely the information an omniscient narrator would hand over.',
        'Correct the label and read the effect: this is third-person limited, and the uncle\'s unreadable silence is the excerpt\'s pressure. Omniscience would have dissolved that tension by telling us what the folding meant.',
      ],
      answer:
        'Reporting one character\'s thoughts is limited narration, not omniscience — omniscience requires entering a SECOND mind, and the uncle is shown only from the outside',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-two-minds',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The lighthouse keeper believed the storm would pass before dawn. Two miles inland, Mrs. Okafor lay awake in the dark, certain that it would not." What point of view is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Third-person omniscient', correct: true },
        { id: 'b', text: 'Third-person limited' },
        { id: 'c', text: 'First person' },
        { id: 'd', text: 'Second person' },
      ],
      expectedAnswer: 'Third-person omniscient',
      hints: [
        'Run the access test: count the minds the narration reports from.',
        'We are told what the keeper believed AND what Mrs. Okafor was certain of, from two miles apart. Neither one could know the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-narration-can-access',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "I told Bennett the tryout results did not matter to me. He nodded and changed the subject, and I did not ask what the nod was supposed to mean." What does this narration have access to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The narrator\'s own thoughts, plus only what the narrator can observe of Bennett from the outside', correct: true },
        { id: 'b', text: 'Both the narrator\'s thoughts and Bennett\'s thoughts' },
        { id: 'c', text: 'Bennett\'s thoughts, reported by an outside narrator' },
        { id: 'd', text: 'Every character\'s thoughts, plus information no character has' },
      ],
      expectedAnswer: 'The narrator\'s own thoughts, plus only what the narrator can observe of Bennett from the outside',
      hints: [
        'The narrator is a character in the scene. Which head is the narration speaking from?',
        'The last clause admits the narrator does not know what the nod meant — that admission marks the edge of the narration\'s access.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unreliable-signal',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Everyone at the party agreed that I was the only reasonable person in the room. I remember the whole evening perfectly, even though I left before most of them arrived." Which detail is the clearest signal that this narrator is unreliable?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The narration contradicts itself — the narrator reports what everyone agreed while admitting he left before most of them arrived', correct: true },
        { id: 'b', text: 'The narrator uses the pronoun I, which always signals unreliability' },
        { id: 'c', text: 'The excerpt describes a party instead of a serious event' },
        { id: 'd', text: 'The narration is written in the past tense rather than the present tense' },
      ],
      expectedAnswer: 'The narration contradicts itself — the narrator reports what everyone agreed while admitting he left before most of them arrived',
      hints: [
        'Unreliability shows up as a gap between what the narrator claims and what the narration itself reveals.',
        'Line up the two sentences. Could someone who left early know what everyone in the room agreed on?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dialogue-pronouns',
      kind: 'misconception_check',
      question:
        'A student reads this excerpt — Halvorsen leaned across the desk. "I have read your file," she said, "and I am not impressed." — and concludes it is first-person narration because of all the I pronouns. What went wrong?',
      commonErrors: [
        {
          answer: 'The excerpt is first person because the word I appears twice',
          misconception: 'Classifying point of view by counting pronouns anywhere on the page, including inside quoted dialogue.',
          correctsTo:
            'Point of view is set by the NARRATION, not by the characters\' speech. Cover the quoted lines and read what is left: "Halvorsen leaned across the desk," "she said." Those are third-person. The I belongs to Halvorsen as a speaker, and every story in every point of view contains characters who say I out loud.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four modes: first person (I), second person (you), third-person limited (one mind), third-person omniscient (many minds).',
        'The ACCESS test settles limited vs omniscient: count how many heads the narration enters, not how many thoughts it reports.',
        'Point of view is a set of walls — always ask what this narrator cannot show you, because the hidden part is usually where the tension lives.',
        'Doubt a first-person account when it is self-serving, when the narration contradicts the events, or when the narrator admits a gap.',
        'Classify the narration, never the dialogue: an I inside quotation marks belongs to the speaker.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Narrative Point of View' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
