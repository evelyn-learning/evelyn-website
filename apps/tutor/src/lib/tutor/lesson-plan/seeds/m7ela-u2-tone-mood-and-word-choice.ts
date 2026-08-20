/**
 * Grade 7 ELA — Reading Literature: Tone, Mood & Word Choice.
 *
 * The word-choice lesson behind every later "how does the author make you
 * feel" question (CCSS RL.7.4). TONE is the writer's attitude toward the
 * subject; MOOD is the feeling handed to the reader; both are built out of
 * loaded words, and the gap between them is usually the point of the scene.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U2_TONE_MOOD_AND_WORD_CHOICE: LessonPlan = {
  id: 'evelyn.ms.m7ela.tone-mood-and-word-choice.v1',
  title: 'Tone, Mood & Word Choice',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.tone-mood-and-word-choice',
      standard: 'M7ELA-2.4',
      description:
        'Determine the tone a writer takes toward a subject and the mood a passage creates in the reader, explain how specific word choices build each one, and name both with a precise adjective supported by the exact words on the page (CCSS RL.7.4).',
    },
  ],
  prerequisites: ['m7ela.figurative-language'],
  followUps: ['m7ela.central-idea-and-supporting-details'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show with one word swap that the same event can be handed to a reader two completely different ways.',
      script:
        'Here is a text from a friend: "the whole team showed up at my house." Now here is the same text with the verb swapped: "the whole team descended on my house." Nothing about the facts moved. Same team, same house, same day. But the second one has a mood. You can almost hear the door banging. That is one word doing all of it. Writers pull that lever on purpose, in every sentence, and once you can see it you stop just feeling a story and start noticing how it was built. Today we learn two words for what that lever moves, and a method for pointing at the exact words that moved it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tone-and-mood',
      kind: 'concept',
      goal: 'Separate tone from mood, tie both to word choice, and install the three-step naming method plus a precise tone vocabulary.',
      keyIdeas: [
        'TONE IS THE WRITER\'S ATTITUDE toward the subject. Ask: how does the person telling this story seem to FEEL about what they are describing? Fond, impatient, admiring, bitter, amused. Tone belongs to the writer or the narrator, never to the reader.',
        'MOOD IS THE FEELING THE READER GETS from the passage. Ask: what does this make ME feel while I read it? Tense, cozy, lonely, hopeful, uneasy. Tone is the voice you hear; mood is the weather you stand in.',
        'THEY ARE OFTEN DIFFERENT, AND THE GAP IS THE POINT — a narrator can describe something terrible in a flat, matter-of-fact tone, and that flatness is exactly what makes the mood tense. When tone and mood pull apart, the writer did that on purpose, so it is the most interesting thing in the passage.',
        'BOTH ARE BUILT OUT OF WORD CHOICE — swap one word and both can move. "The crowd gathered outside the gym" is calm. "The crowd swarmed outside the gym" is not. The facts are identical; the loaded word did the work. Detail choice counts too: what a writer puts in and leaves out carries attitude.',
        'THE METHOD, THREE STEPS — first FIND the loaded words, the ones a writer picked over a plainer option. Second ASK what feeling each one carries. Third NAME the tone or mood with a specific adjective and say the words that earned it. "Sad" and "happy" are almost never the best answer available. Reach for uneasy, impatient, fond, wistful, bitter, proud, wry.',
        'ONE WORD IS NOT A VERDICT — tone is built by an accumulation of choices. Find two or three loaded words pointing the same direction before you name it. A single gloomy word inside a cheerful paragraph does not make the paragraph gloomy.',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the attitude the writer or narrator takes toward the subject, carried by word choice.' },
        { term: 'mood', definition: 'the feeling a passage creates in the reader.' },
        { term: 'word choice', definition: 'the writer\'s decision to use one word rather than another word that means almost the same thing.' },
        { term: 'loaded word', definition: 'a word that carries a feeling on top of its meaning, such as swarmed instead of gathered.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-find-the-loaded-words',
      kind: 'worked_example',
      problem:
        'Name the tone of this passage and point at the words that create it.\n\n"Every Saturday my grandmother\'s kitchen filled up with the smell of frying onions. And every Saturday she pretended to be surprised that I had shown up hungry."',
      steps: [
        'Step one is FIND THE LOADED WORDS. Go slowly and look for choices the writer made over a plainer option. "Filled up with the smell" was picked instead of "smelled". "Pretended to be surprised" was picked instead of "asked". And "every Saturday" is repeated, twice, in two short sentences.',
        'Step two is ASK WHAT FEELING EACH ONE CARRIES. "Filled up" is generous — the kitchen is not just warm, it is full. Repeating "every Saturday" turns one visit into a habit both people count on. "Pretended to be surprised" is the biggest one: she is not actually surprised, so this is a joke the two of them share on purpose.',
        'Step three is NAME IT WITH A SPECIFIC ADJECTIVE. Three loaded choices all point the same direction: warmth and a private joke. So the tone is fond and slightly amused. Notice that "happy" would be true but lazy — it misses the teasing.',
        'Now check the tone against the mood. Here they match: the narrator sounds fond, and a reader standing in that kitchen feels cozy. They do not always match, which is what the next example is about.',
        'Say the answer with the evidence attached: the tone is fond and amused, because the kitchen "filled up" with the smell, because "every Saturday" is repeated as a ritual, and because the grandmother only "pretended to be surprised".',
      ],
      answer:
        'The tone is fond and amused. Evidence: the kitchen "filled up with the smell", the phrase "every Saturday" is repeated to mark a shared ritual, and the grandmother "pretended to be surprised", which is a joke the two of them are in on together.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-tone-versus-mood-gap',
      kind: 'worked_example',
      problem:
        'The tone and the mood here are not the same. Name each one.\n\n"Coach read the list in alphabetical order. Ana. Brian. Curtis. My last name starts with D. He said, \'Elena.\'"',
      steps: [
        'Do the tone first, and remember tone belongs to the person telling it. Look at how this narrator writes. The sentences are short. The names are listed with periods and nothing else. There is not one feeling word in the whole passage — no "I was crushed", no "my stomach dropped".',
        'Name that tone precisely. A narrator who reports a hard moment in flat, clipped sentences and refuses to describe their own feelings has a controlled, matter-of-fact tone. That is not the same as not caring.',
        'Now do the mood, which is what the READER feels. Reading it, you count along with the alphabet. You know D is next. Then the writer skips it. The feeling that lands on you is dread and then a small drop.',
        'So the tone is flat and the mood is tense and disappointed. WRONG conclusion to avoid: "the tone is flat, so the narrator does not care." RIGHT conclusion: the narrator cares so much that they will not say it, and holding it back is exactly what makes the reader feel it.',
        'This is the gap, and it is a real move writers use. When a passage sounds calm but feels awful, do not choose one and throw the other away. Name both, and say what the flat wording is doing.',
        'State it fully: the tone is controlled and matter-of-fact, built from short listing sentences and zero feeling words; the mood is tense and then deflating, because the writer sets up the alphabet, hands the reader the letter D, and skips it.',
      ],
      answer:
        'Tone: controlled and matter-of-fact — short listing sentences, no feeling words at all. Mood: tense, then disappointed — the alphabet sets the reader up to expect D, and the writer skips straight to Elena. The flat tone is what makes the mood hit.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-versions',
      kind: 'try_yourself',
      problem:
        'Two writers describe the exact same moment.\n\nVersion 1: "At 3:15, forty students moved toward the gym doors. They went inside and sat down."\n\nVersion 2: "At 3:15, forty students swarmed the gym doors. They poured inside and grabbed seats."\n\nWhat changed between the two versions?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The events are the same, but the word choice in Version 2 gives the scene a wild, out-of-control mood.', correct: true },
        { id: 'b', text: 'The events are the same, but the word choice in Version 2 gives the scene a calm, orderly mood.' },
        { id: 'c', text: 'Version 2 describes a bigger group of students than Version 1 describes.' },
        { id: 'd', text: 'Version 2 is written in a more formal way than Version 1 is.' },
      ],
      expectedAnswer: 'The events are the same, but the word choice in Version 2 gives the scene a wild, out-of-control mood.',
      hints: [
        'Line the two versions up and mark only the words that are different. The time, the number of students, and what they did are identical in both.',
        'Swarmed is a word for insects. Poured is a word for water. Grabbed is a word for a scramble. Ask what feeling those three hand the reader.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-tone',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best description of the NARRATOR\'S tone.\n\n"Dad calls his ancient blue van the Blueberry. It rattles at every stop sign and the radio only plays one station. He washes it every Saturday, humming, like it is a race car. I have never once asked him to park around the corner."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Affectionate and amused — the narrator teases the van but has never asked Dad to hide it.', correct: true },
        { id: 'b', text: 'Proud — Dad is proud of the van, since he washes it every Saturday and hums while he does it.' },
        { id: 'c', text: 'Embarrassed — the narrator is ashamed of the rattling and the one radio station.' },
        { id: 'd', text: 'Neutral — the narrator only reports facts about the van and takes no attitude at all.' },
      ],
      expectedAnswer: 'Affectionate and amused — the narrator teases the van but has never asked Dad to hide it.',
      hints: [
        'The question asks for the tone of the person TELLING the story, not the feelings of a character inside it.',
        'The last sentence is the decisive one. Ask what "I have never once asked him to park around the corner" rules out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-mood',
      kind: 'try_yourself',
      problem:
        'Which word best names the MOOD of this passage — the feeling it gives the reader?\n\n"Nadia read her sister\'s message twice, then once more. The 4:40 bus had come and gone eleven minutes ago, and her sister had not been on it. Nadia stayed at the window with the phone still in her hand."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Uneasy', correct: true },
        { id: 'b', text: 'Impatient' },
        { id: 'c', text: 'Relieved' },
        { id: 'd', text: 'Bored' },
      ],
      expectedAnswer: 'Uneasy',
      hints: [
        'Nadia is not waiting for a bus. The bus already came. Ask what she is actually waiting for, and what that changes.',
        'Rereading a message three times and not putting the phone down is not annoyance about a delay. It is a person who cannot stop checking because something is wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tone-equals-mood',
      kind: 'misconception_check',
      question:
        'Two students read the passage about Coach reading the list. The first writes: "The tone and the mood are both sad." The second writes: "The tone is disappointed, because the narrator is disappointed." What went wrong in each answer?',
      commonErrors: [
        {
          answer: 'The tone and the mood are both sad.',
          misconception:
            'Treating tone and mood as one thing, and then naming that one thing with the vaguest available word.',
          correctsTo:
            'Tone and mood are two separate questions with two separate answers. Tone asks how the WRITER seems to feel about the subject; mood asks how the READER feels while reading. In that passage the tone is controlled and matter-of-fact — short sentences, a list of names, not one feeling word — while the mood is tense and then deflating. The gap between them is the whole move. And "sad" is too blunt for either one. Push for the precise word: flat, clipped and controlled for the tone; tense, then disappointed, for the mood.',
        },
        {
          answer: 'The tone is disappointed, because the narrator is disappointed.',
          misconception:
            'Confusing tone with a character\'s feelings. This student found an emotion inside the scene and reported it as the tone.',
          correctsTo:
            'Tone is the attitude in the WRITING — the way the words are chosen and arranged — not the emotion a character happens to be experiencing. A narrator can be devastated and still write in a completely flat tone, and that is exactly what happens here. Point at the wording, not at the character: the sentences are short, the names are listed, and no feeling is described. That wording is controlled and matter-of-fact. The disappointment is what the reader feels, so it belongs in the answer about mood.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tone is the writer\'s attitude toward the subject. Mood is the feeling the reader gets. Two questions, two answers.',
        'Tone and mood are often different, and when they pull apart the writer did it on purpose. A flat tone can build a tense mood.',
        'Both are built out of word choice. Swapping "gathered" for "swarmed" changes no facts and changes everything else.',
        'The method: find the loaded words, ask what feeling each one carries, then name it with a specific adjective and cite the words.',
        'Never settle for "sad" or "happy" — reach for uneasy, impatient, fond, wistful, bitter, wry — and never decide a tone from a single word.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Tone, Mood & Word Choice' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
