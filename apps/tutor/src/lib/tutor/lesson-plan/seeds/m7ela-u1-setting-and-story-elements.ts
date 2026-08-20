/**
 * Grade 7 ELA — Reading Literature: How Setting Shapes a Story.
 *
 * Concept-led (CCSS RL.7.3). RL.7.3 is about how story ELEMENTS INTERACT, so
 * this lesson deliberately goes past "setting is where and when" to the three
 * jobs setting actually does: it creates the problem, it limits the options,
 * and it reveals a character through how they respond to it. The three
 * misconceptions targeted are (a) setting is skippable scenery, (b) setting
 * is only place, and (c) naming the setting counts as explaining its effect.
 * The answer format installed here is "the setting causes X, which forces the
 * character to Y".
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U1_SETTING_AND_STORY_ELEMENTS: LessonPlan = {
  id: 'evelyn.ms.m7ela.setting-and-story-elements.v1',
  title: 'How Setting Shapes a Story',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.setting-and-story-elements',
      standard: 'M7ELA-1.4',
      description:
        'Analyze how the setting of a story interacts with the other story elements — how the time, place and social situation create the problem, limit what a character can do, and reveal character through the way a character responds — and explain that effect in a sentence rather than only naming the setting (CCSS RL.7.3).',
    },
  ],
  prerequisites: ['m7ela.characterization'],
  followUps: ['m7ela.theme-and-summary'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that changing when and where a scene happens changes the whole story, so setting cannot be scenery.',
      script:
        'Picture this. You lose your house key. Now run it twice. First version: it is Saturday at two in the afternoon, it is warm, your neighbor is out watering the grass, and your mom answers her phone on the second ring. Second version: it is eleven at night, it is pouring, your phone is at four percent, and everyone in your family is on a plane. Same lost key. Two completely different stories. Nothing about you changed. The clock and the weather changed, and suddenly you have a real problem. That is what setting does in a book. It is not the wallpaper behind the characters. It is the thing that decides how hard their day is going to be. Today we learn to say exactly what a setting is doing, not just what it is.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-setting-jobs',
      kind: 'concept',
      goal: 'Define setting as time, place and social situation, then name the three jobs it does and the sentence format that proves it.',
      keyIdeas: [
        'SETTING IS WHEN AND WHERE, AND "WHEN" IS BIGGER THAN YOU THINK — the year or time period, the season, the weather, and the time of day are all part of when. A story set at noon and the same story set at three in the morning are not the same story. This is where readers slip most often, because they write down the place and stop there.',
        'SETTING ALSO INCLUDES THE SOCIAL SITUATION — the rules and expectations of the place a character is standing in. A first day at a new school, a family dinner with a strict rule about phones, a locker room after a loss: each one comes with its own rules about what you are allowed to say and do. That is setting too.',
        'SETTING IS NOT SCENERY YOU CAN SKIP — the story elements work on each other. Setting pushes on the plot, and the plot pushes on the character. When a question asks about setting, it is almost never asking you to describe the trees.',
        'SETTING DOES THREE JOBS. ONE, IT CREATES THE PROBLEM: the snow, the power outage, the fact that the store closes at six. TWO, IT LIMITS THE OPTIONS: no signal means no phone call, so the character has to solve it another way. THREE, IT REVEALS CHARACTER: put someone in a hard place and what they do next tells you who they are. Almost every setting question you meet is asking about one of those three.',
        'NAMING IS NOT EXPLAINING — "the setting is a farm in winter" is a label, and a label earns nothing. Use this sentence instead: THE SETTING CAUSES X, WHICH FORCES THE CHARACTER TO Y. For example, "the blizzard closes the road, which forces Ana to walk the last two miles." If you cannot fill in both halves, you have not answered the question yet.',
        'THE QUICK TEST — move the story. Change the time or the place in your head and ask what breaks. If the plot carries on exactly the same, the setting is doing very little. If the whole problem falls apart, you have just proved the setting is doing the work, and you can say why.',
      ],
      vocabulary: [
        { term: 'setting', definition: 'when and where a story happens, including the time period, the season, the time of day and the weather.' },
        { term: 'social setting', definition: 'the rules and expectations that come with a place, such as how people are meant to behave at a family dinner or in a classroom.' },
        { term: 'story elements', definition: 'the parts a story is built from — character, setting, plot and conflict — which all act on each other.' },
        { term: 'conflict', definition: 'the problem a character is up against, which the setting very often creates.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-setting-creates-problem',
      kind: 'worked_example',
      problem:
        'Explain what the setting is doing here. Use the sentence format from the lesson.\n\n"The power went out on the hottest afternoon in August and the freezer at Dario\'s ice cream cart went quiet. He wheeled the whole cart four blocks to the shaded lot behind the library and sold every bar for a dollar before the sun could get to them."',
      steps: [
        'Start by listing the setting properly, all of it. Where: an outdoor ice cream cart, then a shaded lot behind a library. When: an August afternoon, the hottest one, during a power outage. Notice that most of the useful information is in the WHEN half.',
        'Now ask job one: does the setting create the problem? Yes. Heat plus no electricity is exactly what makes the stock start melting. Neither one on its own would do it. A power outage in February is an inconvenience. A power outage in August at an ice cream cart is a disaster.',
        'Ask job two: does the setting limit the options? Yes again. With no power, Dario cannot refreeze anything and cannot wait for it to be fixed. The setting has taken the easy solutions off the table and left him one: get rid of the stock fast.',
        'Ask job three: does the response reveal character? It does. He does not stand there watching it melt and he does not panic. He moves the cart to shade and cuts the price to a dollar. That is quick thinking, and we only learned it because the heat put him in a corner.',
        'A weak answer would be "the setting is a hot day in August." That is a label. It names the setting and stops, so it does not say what the setting DID.',
        'Now write the strong version in the format: the setting causes X, which forces the character to Y. The August heat and the power outage cause the ice cream to start melting, which forces Dario to move the cart into the shade and sell everything cheap before it is lost.',
      ],
      answer:
        'The setting does all three jobs. The August heat plus the power outage cause the ice cream to start melting, which forces Dario to wheel the cart to the shaded lot and sell every bar for a dollar. His quick, calm response reveals that he thinks fast under pressure.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-social-setting-reveals',
      kind: 'worked_example',
      problem:
        'There is no weather and no disaster in this one. What is the setting, and what does it reveal about Kai?\n\n"At Nana\'s table nobody eats until every single person is sitting down. Kai\'s phone buzzed six times during dinner. He turned it face down on his knee and did not look at it once."',
      steps: [
        'First, resist the obvious answer. If you say "the setting is a house," you have named a building and learned nothing. Push on it.',
        'The real setting here is a social one. Nana\'s table comes with a rule: nobody eats until everyone is seated. That rule is not decoration. It tells you this is a house where being present at the table matters more than whatever else is going on.',
        'Add the time layer too. This is during dinner, which is the exact window when the rule is switched on. The same six buzzes an hour later would mean nothing.',
        'Now run job three. The setting puts Kai in a squeeze between two pulls: the phone buzzing on his knee and a table where attention is the whole point. What he does next is the answer to the question.',
        'He turns the phone face down and does not look. Face down is a choice, not an accident — he made it harder for himself on purpose. That is respect, and it is self-control.',
        'WRONG answer to avoid: "The setting is dinner at Nana\'s house." That is naming, not explaining, and it never mentions Kai. CORRECT answer: the rule at Nana\'s table causes a clash between the buzzing phone and the expectation to be present, which forces Kai to choose — and he chooses the table, which shows he is respectful and can control himself.',
      ],
      answer:
        'The setting is social: dinner at Nana\'s table, where the rule is that nobody eats until everyone is seated. That rule causes a clash with the buzzing phone, which forces Kai to choose between them. He turns the phone face down and never looks, revealing that he is respectful and has real self-control.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-setting-creates-problem',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best explanation of how the setting affects the story.\n\n"The bus for the science fair was leaving at seven. The storm had dropped so much snow overnight that the school lot was buried to the top of the curb. Priya stood at the window holding her project box and watched the plow go past the end of her street without turning in."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The snow is background description. The story would happen the same way on a clear day.' },
        { id: 'b', text: 'The setting is a snowy morning at a school in winter.' },
        { id: 'c', text: 'The snow proves that Priya is careless, because she did not check the weather before building her project.' },
        { id: 'd', text: 'The overnight snow buries the lot and the plow does not come, which creates Priya\'s problem: her ride to the science fair may never leave.', correct: true },
      ],
      expectedAnswer: 'The overnight snow buries the lot and the plow does not come, which creates Priya\'s problem: her ride to the science fair may never leave.',
      hints: [
        'Try the moving test. Put this exact scene on a warm, clear morning. Is there still a story?',
        'One choice names the setting and stops. Another says the setting does not matter. You want the one that says what the setting DID.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-setting-limits-options',
      kind: 'try_yourself',
      problem:
        'What does the setting reveal about Omar?\n\n"The rented cabin had no phone signal and the nearest neighbor was four miles down a dirt road. When the generator died at midnight, Omar did not wake his little sister. He carried the camp lantern to her side of the room, set it burning by her bed, and then sat down in the dark by the door until the sky went gray."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Omar is unkind to his sister, because he leaves her alone instead of waking her up.' },
        { id: 'b', text: 'Omar is afraid of the dark, because the first thing he does is light a lantern.' },
        { id: 'c', text: 'The setting is a cabin at midnight with the power off.' },
        { id: 'd', text: 'With no signal and no neighbor close by, Omar cannot call anyone for help, so he handles the dark himself and keeps his sister calm — he is steady in a crisis.', correct: true },
      ],
      expectedAnswer: 'With no signal and no neighbor close by, Omar cannot call anyone for help, so he handles the dark himself and keeps his sister calm — he is steady in a crisis.',
      hints: [
        'Look at the two details in the first sentence. What do they take away from Omar? List the things he now cannot do.',
        'Check who the lantern is for. He sets it by her bed and then sits in the dark himself, so it is not lit for him.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-time-period-setting',
      kind: 'try_yourself',
      problem:
        'Which statement best explains how the setting shapes what Rosalind does?\n\n"In 1925 the only telephone in the village sat behind the counter of the general store, and the store locked its doors at six. Rosalind\'s brother\'s fever climbed at nine that night, so she took the lantern off its hook and ran the two miles to the doctor\'s house herself."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The setting does not really matter, because a brother with a fever would be an emergency in any time or place.' },
        { id: 'b', text: 'The setting is a small village in 1925.' },
        { id: 'c', text: 'Only the place is setting. The year and the hour of the night are not part of the setting.' },
        { id: 'd', text: 'The setting causes the problem — in 1925 the village\'s one telephone is shut inside a closed store at nine at night — which forces Rosalind to run two miles for the doctor herself.', correct: true },
      ],
      expectedAnswer: 'The setting causes the problem — in 1925 the village\'s one telephone is shut inside a closed store at nine at night — which forces Rosalind to run two miles for the doctor herself.',
      hints: [
        'Three separate pieces of the setting gang up on her here: the year, the single telephone, and the hour. Say what each one takes away.',
        'Look for the choice that fills in both halves of the sentence: the setting causes X, which forces the character to Y.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-naming-not-explaining',
      kind: 'misconception_check',
      question:
        'A question asks how the setting affects the story. A student writes: "The setting is a forest." What went wrong, and what would a full answer look like?',
      commonErrors: [
        {
          answer: 'The setting is a forest.',
          misconception:
            'Naming the setting instead of explaining its effect. The student has answered the question "what is the setting", which is not the question that was asked.',
          correctsTo:
            'A label earns nothing on its own. The question asks what the setting DOES to the story, so the answer has to reach the plot or the character. Use the format: the setting causes X, which forces the character to Y. For example, "the forest has no path and the light is going, which forces Elena to give up on finding the lake and turn back." Same forest, but now it is doing a job you can point at. A good check: if your answer could be copied onto a postcard about the place, it is a label, not an analysis.',
        },
        {
          answer: 'Setting is just the background. You can skip it and still understand the story.',
          misconception:
            'Treating setting as decoration that sits behind the real story, rather than as a story element that acts on plot and character.',
          correctsTo:
            'Setting is not behind the story, it is inside it. It creates the problem, it limits what a character is able to do, and it reveals who a character is by the way they respond to it. Test it and see: take a story where a phone has no signal and hand the character a working phone, and the plot usually collapses in one sentence. Remember too that setting is not only place. The year, the season, the time of day and the social rules of the room all count, and the answer often hides in one of those.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Setting is when AND where. "When" covers the year, the season, the weather and the time of day, and the social rules of the place count too.',
        'Setting does three jobs: it creates the problem, it limits the options, and it reveals character through how a character responds.',
        'Naming the setting is not explaining it. Answer in the format: the setting causes X, which forces the character to Y.',
        'Story elements act on each other. Setting pushes on plot, and plot pushes on character.',
        'The quick test: move the story to another time or place. Whatever breaks is what the setting was doing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'How Setting Shapes a Story' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
