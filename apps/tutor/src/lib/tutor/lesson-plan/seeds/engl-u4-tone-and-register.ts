/**
 * HS English — Language & Craft: Tone, Style & Register.
 *
 * The two questions every writer answers before the first sentence
 * (CCSS L.9-10.3, RI.9-10.4): what attitude do my words carry (TONE),
 * and how formal does this reader and this purpose require me to be
 * (REGISTER)? All excerpts are short ORIGINAL prose written for this
 * lesson — no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U4_TONE_AND_REGISTER: LessonPlan = {
  id: 'evelyn.hs.engl.tone-and-register.v1',
  title: 'Tone, Style & Register',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.tone-and-register',
      standard: 'ENGL-4.3',
      description:
        'Identify the tone a writer creates through word choice and selected detail, naming the specific words that carry it, and match the level of formality — the register — to a given audience and purpose, from an email to a principal to a message in a group chat (CCSS L.9-10.3, RI.9-10.4).',
    },
  ],
  prerequisites: ['engl.connotation-and-denotation'],
  followUps: ['engl.commonly-confused-words'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Same request, three readers, three different wordings — make tone and register feel like daily decisions before naming them.',
      script:
        'Send the same request to three different people and you will send three different messages. "Can you cover my shift?" reads as normal to a friend, a little abrupt to a manager, and almost rude to someone you barely know. And you already know the other half of this: a joke that is obviously a joke out loud can land as an insult once it is typed, because the reader cannot hear you. Writers make that same call on every line — which words carry my attitude, and how formal does this reader expect me to be. Today we learn to name the tone a piece of writing creates, point at the exact words that create it, and choose the level of formality a situation actually calls for.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tone-and-register',
      kind: 'concept',
      goal: 'Define tone and register, give students a working tone vocabulary, and install the evidence rule and the consistency rule.',
      keyIdeas: [
        'TONE IS ATTITUDE — tone is the writer\'s attitude toward the subject or the reader, carried by two things: WORD CHOICE and SELECTED DETAIL. Two writers can report the same event and sound admiring or contemptuous purely by which words and which details they use.',
        'NAME THE TONE WITH A REAL WORD — "good" and "negative" are not tones. Build a working list: admiring, affectionate, wry, sarcastic, urgent, detached, resigned, indignant, playful, cautious, nostalgic, matter-of-fact. Reach for the most specific word that fits.',
        'DETAIL IS A TONE CHOICE TOO — what a writer includes and leaves out signals attitude. Describing a new stadium by its cost per seat while never mentioning the team says something. The facts can be accurate and the tone still loaded.',
        'REGISTER IS FORMALITY LEVEL — register runs from intimate (a group chat: "u coming?") to casual to consultative (a teacher email) to formal (a scholarship letter, a lab report). Register is not about being correct or incorrect; each level is right somewhere and wrong somewhere else.',
        'AUDIENCE AND PURPOSE PICK THE REGISTER — ask two questions before drafting: who reads this, and what do I need it to do? A request to a principal needs formal register because the reader is an authority and the purpose is to be taken seriously. A plan with a friend needs casual, because formality there reads as cold or sarcastic.',
        'CONSISTENCY — register is a promise the writing makes in its first line and must keep to the last. One slangy phrase can break an otherwise formal piece: a careful three-paragraph request that ends "lmk!!" undoes itself. The break is what readers notice, not the ninety percent that was fine.',
        'THE EVIDENCE RULE — a tone claim is only as good as the words you can point at. Never stop at "the tone is sarcastic." The move is tone + because + the specific words: "the tone is sarcastic — the writer calls a forty-two-page schedule a thoughtful gift."',
        'FORMAL IS NOT STUFFY — formal register means no slang, no filler, complete sentences, and a respectful stance toward the reader. It does not mean long words. "Please let me know whether Thursday works" is fully formal; "I would be eternally indebted should you see fit to advise me" is just overdressed.',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the attitude a writer takes toward the subject or reader, created by word choice and selected detail.' },
        { term: 'register', definition: 'the level of formality a piece of writing maintains, chosen to fit its audience and purpose.' },
        { term: 'style', definition: 'the writer\'s recurring habits of diction, sentence length, and rhythm — the pattern that produces tone from line to line.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-tone',
      kind: 'worked_example',
      problem:
        'Name the tone of this excerpt and cite the words that create it: "The new schedule went up at last, all forty-two pages of it, in a font best appreciated by eagles. Someone had thoughtfully laminated the copy so that no one could mark it up."',
      steps: [
        'Start with the plain content: a schedule was posted, it is long, the print is small, and it is laminated. Nothing in the events themselves is hostile — so any attitude here is coming from the wording.',
        'Underline the loaded words: "at last" (impatience), "all forty-two pages of it" (the "all" makes the length an offense), "best appreciated by eagles" (a joke about print too small to read), "thoughtfully" (praise for something that helps no one).',
        'Test the key word: "thoughtfully" says one thing and means the opposite. That gap between the stated compliment and the obvious complaint is the definition of sarcasm.',
        'Name it and support it in one sentence: the tone is sarcastic and impatient, created by "at last," the exaggerated "all forty-two pages," the eagles joke, and the false compliment "thoughtfully."',
      ],
      answer:
        'Sarcastic and impatient — evidence: "at last," "all forty-two pages of it," "best appreciated by eagles," and the false praise in "thoughtfully"',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-register-break',
      kind: 'worked_example',
      problem:
        'A student sends this to the principal: "Dear Ms. Alvarez, I am writing on behalf of the robotics club to request the use of the media center on Thursday afternoons this spring. We would leave the room in order and finish by five. lmk if that works!!" The request was denied a second reading. What broke, and how should it be revised?',
      steps: [
        'Set the register from audience and purpose: the reader is an authority the writer does not know well, and the purpose is to be granted a resource. That combination calls for formal register — and the opening three sentences deliver it exactly.',
        'Locate the break: "lmk if that works!!" is a group-chat sign-off. The abbreviation and the doubled exclamation points belong to intimate register, and they arrive in the position a reader remembers best, the last line.',
        'Notice the cost. The problem is not that the sign-off is unclear — everyone knows what "lmk" means. The problem is that it contradicts the promise the first sentence made, so the whole message now reads as careless rather than serious.',
        'Revise only the break: "Please let me know whether that time is available. Thank you for considering the request." Formal register, same meaning, one line.',
        'Resist the overcorrection. Do not rewrite the earlier sentences into "It would be my profound privilege to be advised of your determination." That is a different failure — wordiness wearing a formal costume. Formal means clean and respectful, not inflated.',
      ],
      answer:
        'The closing "lmk if that works!!" drops into intimate register and breaks the formal promise of the opening; replace it with "Please let me know whether that time is available. Thank you for considering the request." and leave the rest alone',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-tone',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The committee has now spent four meetings selecting a font for the poster. Three more, and we may be ready to decide on the paper size." Which choice best names the tone and its evidence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Wry and impatient — the counted-up meetings and the mock forecast of three more make the delay absurd', correct: true },
        { id: 'b', text: 'Admiring — the writer praises the committee for its careful attention to detail' },
        { id: 'c', text: 'Neutral and factual — the sentences only report what the committee did' },
        { id: 'd', text: 'Anxious — the writer is worried that the poster will contain an error' },
      ],
      expectedAnswer: 'Wry and impatient — the counted-up meetings and the mock forecast of three more make the delay absurd',
      hints: [
        'Ask why the writer counted the meetings. A neutral report would not keep score.',
        'Weigh the size of the decisions (a font, a paper size) against the time spent. The mismatch is the joke, and the joke is the attitude.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-formal-revision',
      kind: 'try_yourself',
      problem:
        'You are emailing your principal to ask that the club fair be moved to March 14 because the gym is reserved for a band rehearsal that week. Which version best matches a formal register?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hey! Any chance we could bump the club fair to the 14th? The gym is booked lol.' },
        { id: 'b', text: 'I am writing to request that the club fair be moved to March 14, since the gym is reserved for a band rehearsal that week.', correct: true },
        { id: 'c', text: 'Move the club fair to March 14. The gym is taken.' },
        { id: 'd', text: 'I would be eternally indebted if you might see fit to relocate the aforementioned club fair to the fourteenth day of March.' },
      ],
      expectedAnswer: 'I am writing to request that the club fair be moved to March 14, since the gym is reserved for a band rehearsal that week.',
      hints: [
        'Two questions first: who is the reader, and what does the message need to accomplish? Then rule out anything slangy.',
        'Of the three that avoid slang, one is a bare command and one is padded with ceremony. Formal register is respectful and clean, not inflated.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-break',
      kind: 'try_yourself',
      problem:
        'This paragraph appears in a formal report to the student council. Which sentence breaks its register? (1) The recycling program has reduced cafeteria waste by nearly a third this year. (2) Volunteers sort the bins every Friday afternoon. (3) Honestly, the custodians were kind of blown away. (4) The council recommends expanding the program to the science wing next fall.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 1 — "The recycling program has reduced cafeteria waste by nearly a third this year."' },
        { id: 'b', text: 'Sentence 2 — "Volunteers sort the bins every Friday afternoon."' },
        { id: 'c', text: 'Sentence 3 — "Honestly, the custodians were kind of blown away."', correct: true },
        { id: 'd', text: 'Sentence 4 — "The council recommends expanding the program to the science wing next fall."' },
      ],
      expectedAnswer: 'Sentence 3 — "Honestly, the custodians were kind of blown away."',
      hints: [
        'Read the four sentences aloud and listen for the one that sounds like it was spoken to a friend rather than written to a council.',
        'Look for conversational filler and slang: an opener like "Honestly," a hedge like "kind of," and an informal phrase such as "blown away."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tone-is-content',
      kind: 'misconception_check',
      question:
        'A student reads the schedule excerpt and reports: "The tone is informational, because the paragraph is about a schedule being posted." A second student, revising an email to a teacher, replaces "I finished the essay" with "I have herewith completed the aforementioned composition" and calls it more formal. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The tone is informational because the passage is about a schedule',
          misconception: 'Confusing tone with subject matter — reporting WHAT the text is about instead of HOW the writer treats it.',
          correctsTo:
            'Tone is never the topic; it is the attitude the wording takes toward the topic. The same posted schedule could be described admiringly, neutrally, or, as here, sarcastically. Point at the words — "at last," "thoughtfully," the eagles joke — and let them name the tone.',
        },
        {
          answer: '"I have herewith completed the aforementioned composition" is more formal than "I finished the essay"',
          misconception: 'Equating formal register with long, archaic, or padded wording.',
          correctsTo:
            'Formal register means no slang, no filler, complete sentences, and respect for the reader. "I finished the essay" already meets every one of those. Swapping in "herewith" and "aforementioned" adds nothing but costume, and a reader hears it as stiff or even mocking.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tone is the writer\'s attitude, built from word choice and selected detail — not from the subject itself.',
        'Name the tone with a precise word (wry, urgent, admiring, detached) and cite the words that create it: tone + because + evidence.',
        'Register is formality level, and audience plus purpose decide it — the same request is worded one way to a friend and another to a principal.',
        'Keep register consistent: a single slangy phrase can undo an otherwise formal piece. And formal means clean and respectful, never padded.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Tone, Style & Register' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
