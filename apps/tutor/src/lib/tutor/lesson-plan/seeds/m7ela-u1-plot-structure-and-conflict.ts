/**
 * Grade 7 ELA — Reading Literature: Plot Structure & Conflict.
 *
 * The shape a story moves through (CCSS RL.7.3): the five stages, the
 * turning-point test that finds the climax, and the four conflict types.
 * Three misconceptions are named on purpose — the climax is not the loudest
 * or most violent scene, a conflict does not need a fight, and rising action
 * is not simply everything that happens before the end.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt and mini-story in this file is
 * original prose written for the item. This course carries no passage
 * machinery — no passageId, no shared texts — so each question must be
 * solvable from the sentences printed inside it, and no published work may
 * be quoted or closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U1_PLOT_STRUCTURE_AND_CONFLICT: LessonPlan = {
  id: 'evelyn.ms.m7ela.plot-structure-and-conflict.v1',
  title: 'Plot Structure & Conflict',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.plot-structure-and-conflict',
      standard: 'M7ELA-1.2',
      description:
        'Map a story onto its five plot stages, use the turning-point test to locate the climax, and name the central conflict as character vs character, character vs self, character vs nature or character vs society, explaining how that conflict drives the events (CCSS RL.7.3).',
    },
  ],
  prerequisites: ['m7ela.text-evidence-and-inference'],
  followUps: ['m7ela.characterization'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already builds plot structure by instinct whenever they tell a story out loud.',
      script:
        'Think about the last time you told a friend about something that went wrong. Maybe your dog got out. You did not say it in a flat list. You started with the normal part, the leash by the door and the walk you take every day. Then you piled it up: the gate was open, the dog was gone, it started raining, you could hear a truck. You saved the worst second for last on purpose, because you wanted your friend to lean in. Then you told them how it ended. That shape has names, and writers use the exact same shape you just used at lunch. Today we learn the five stages, we learn how to find the one moment everything turns on, and we learn what a conflict really is, which is not what most people think.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plot-and-conflict',
      kind: 'concept',
      goal: 'Name the five plot stages, the turning-point test for the climax, the four conflict types, and what rising action actually contains.',
      keyIdeas: [
        'THE FIVE STAGES — EXPOSITION is the normal life before the trouble starts, and it gives you the characters and the place. RISING ACTION is the trouble getting worse. CLIMAX is the moment everything turns on. FALLING ACTION is what happens because of that moment. RESOLUTION is the new normal the story leaves you with.',
        'THE TURNING-POINT TEST FINDS THE CLIMAX — ask two questions. Before this moment, could the story still end either way? After this moment, is the ending locked in? The moment that flips your answer from yes to no is the climax. It can be loud, and it can also be one quiet sentence.',
        'THE CLIMAX IS NOT THE MOST EXCITING PART — a crash, a fire or a shouting match can happen in the middle of the rising action and decide nothing at all. If the story could still go either way afterward, it is not the climax, no matter how big it sounds. Use the turning-point test, not the volume test.',
        'A CONFLICT IS A PROBLEM PULLING AGAINST THE MAIN CHARACTER, AND IT DOES NOT NEED A FIGHT — there are four kinds. CHARACTER VS CHARACTER is one person against another. CHARACTER VS SELF is a person against their own fear, habit, or a choice between two things they want. CHARACTER VS NATURE is a person against a storm, an animal, an injury, or the cold. CHARACTER VS SOCIETY is a person against a rule, a law, or the way things are usually done.',
        'CHARACTER VS SELF IS A REAL CONFLICT — a girl sitting alone deciding whether to tell the truth is in a conflict. Nobody yells and nobody swings. The struggle is between two things she wants, and the whole story can hang on which one wins. Look for hesitation, thinking, and a decision that keeps getting put off.',
        'RISING ACTION IS NOT EVERYTHING BEFORE THE END — it is only the events that make the CENTRAL conflict harder. The color of the house and the name of the dog are usually exposition. Ask of each event: does this make the main problem worse or harder to solve? If yes, it is rising action. If no, it is background.',
      ],
      vocabulary: [
        { term: 'plot', definition: 'the order of events in a story, and the shape those events make.' },
        { term: 'exposition', definition: 'the opening part of a story that shows normal life before the trouble starts.' },
        { term: 'rising action', definition: 'the events that make the central conflict harder as the story goes on.' },
        { term: 'climax', definition: 'the turning point, after which the outcome of the central conflict is decided.' },
        { term: 'conflict', definition: 'the problem pulling against the main character, which may be another person, themselves, nature, or society.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-map-the-stages',
      kind: 'worked_example',
      problem:
        'Map this mini-story onto the five stages, then name the conflict.\n\n"Priya walked the neighbor\'s dog every day after school and put the money in a jar. In November the neighbor moved away and the jar stopped filling, but Priya had already promised her little brother a bike for his birthday. On Saturday she sold her skateboard to a boy on the next street and bought the bike. Her brother rode it around the block until dinner. Priya peeled the stickers off the old board first and keeps them in the empty jar."',
      steps: [
        'Start with the exposition, which is the normal part before any trouble. Priya walks a dog after school and saves the money. That is her routine, and there is no problem in it yet.',
        'Find the rising action by asking which events make the main problem worse. The neighbor moves away, so the money stops. The promise to her brother is already made, so she cannot quietly drop it. Each of those tightens the same squeeze.',
        'Now use the turning-point test on the Saturday sentence. Before she sells the skateboard, the brother might get a bike and might not. After she sells it, the bike is bought and the board is gone. The answer flips there, so selling the skateboard is the climax.',
        'Sort what is left. The brother riding around the block until dinner happens because of her choice, so that is falling action. The stickers in the empty jar is the new normal she carries forward, so that is the resolution.',
        'Name the conflict. Nobody is fighting Priya. The neighbor did not move away to hurt her. The pull is between two things Priya wants, which are the skateboard she loves and the promise she made. That is character vs self.',
        'Notice what a weaker answer looks like: calling the neighbor the villain and saying character vs character. The neighbor never opposes Priya and never even appears after moving. A person who causes a problem by accident is not an opponent.',
      ],
      answer:
        'Exposition: the after-school dog walking and the money jar. Rising action: the neighbor moves away and the money stops, while the promise stands. Climax: Priya sells her skateboard and buys the bike. Falling action: her brother rides it until dinner. Resolution: the stickers kept in the empty jar. Conflict: character vs self.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-climax-not-the-loudest',
      kind: 'worked_example',
      problem:
        'A student reads this mini-story and says the blackout is the climax. Check that with the turning-point test.\n\n"Dev had never spoken in front of the whole school, and he signed up for the talent show anyway. For three weeks he practiced his song in the garage with the door shut. On show night the power cut out for ten minutes and the crowd screamed in the dark. When the lights came back, Dev walked to the microphone and sang. His hands shook for an hour afterward. He signed up again the next year."',
      steps: [
        'Ask what test the student used. The blackout is the loudest and most exciting thing in the story, so it feels like the peak. That is the volume test, and the volume test is not the rule.',
        'Run the real test on the blackout. Before the lights go out, Dev might sing and might walk away. After the lights come back, Dev might still sing and might still walk away. Nothing is locked in, so the blackout is only a complication. It belongs to the rising action.',
        'Run the same test on the next sentence. Before Dev walks to the microphone, the story can still end either way. Once he walks up and sings, the outcome cannot go the other way any more. That is the climax, and it is quiet.',
        'Sort the ending. His hands shaking for an hour is falling action, because it happens because of what he did. Signing up again the next year is the resolution, because it shows the new normal.',
        'Name the conflict. There is no rival, no storm and no rule. Dev is up against his own fear of the stage, so this is character vs self.',
        'WRONG answer: the blackout is the climax, because it is the most dramatic moment. CORRECT answer: Dev walking to the microphone and singing is the climax, because it is the moment the outcome stops being uncertain.',
      ],
      answer:
        'The blackout is rising action, not the climax. It is the loudest moment but it decides nothing. The climax is Dev walking to the microphone and singing, because the outcome is locked in only once he does. The conflict is character vs self.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-conflict-type',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then name the central conflict.\n\n"Nina had one spare concert ticket. She had promised it to Rosa weeks ago, before Jae moved to town and told her the band was the only thing he liked about his old city. Nina held her phone for twenty minutes and did not type anything."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Character vs self — Nina is pulled between two things she wants.', correct: true },
        { id: 'b', text: 'Character vs character — Nina and Rosa are fighting over the ticket.' },
        { id: 'c', text: 'Character vs society — a rule about tickets is stopping Nina.' },
        { id: 'd', text: 'There is no conflict here, because nobody argues or fights.' },
      ],
      expectedAnswer: 'Character vs self — Nina is pulled between two things she wants.',
      hints: [
        'Nobody in this excerpt argues with Nina, and nothing blocks her. Ask where the struggle is actually happening.',
        'She stares at her own phone for twenty minutes. The thing stopping her is her own divided wanting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-climax',
      kind: 'try_yourself',
      problem:
        'Read the story summary, then choose the climax.\n\n"Omar wanted to take the class hamster home for winter break. His mother said no pets in the apartment, and she said it three times. Then a storm knocked out the school power for a whole day, and the fire alarms blared until a technician shut them off. That evening Omar\'s teacher called and explained that the building would be locked and empty for two weeks. Omar\'s mother listened, and then she told Omar to go and get the cage. Omar carried it upstairs and set it by the sunny window."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Omar\'s mother tells him to go and get the cage.', correct: true },
        { id: 'b', text: 'The storm knocks out the school power and the fire alarms blare all day.' },
        { id: 'c', text: 'Omar\'s mother says no pets in the apartment for the first time.' },
        { id: 'd', text: 'Omar carries the cage upstairs and sets it by the sunny window.' },
      ],
      expectedAnswer: 'Omar\'s mother tells him to go and get the cage.',
      hints: [
        'Do not pick the most dramatic moment. Ask which moment locks the ending in.',
        'Before one sentence in this story, the hamster could still stay at school. After it, the hamster is going home.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rising-action',
      kind: 'try_yourself',
      problem:
        'Read the story summary. Which event is part of the RISING ACTION of the central conflict?\n\n"Talia has wanted a spot on the school garden crew since fifth grade. She lives on Pine Street with her aunt and two cats. In March she fills out the application. The office loses it and the deadline passes. Talia offers to come in on Saturdays and do the watering nobody else wants. The teacher says yes and adds a seventh name to the list."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The office loses the application and the deadline passes.', correct: true },
        { id: 'b', text: 'Talia lives on Pine Street with her aunt and two cats.' },
        { id: 'c', text: 'The teacher says yes and adds a seventh name to the list.' },
        { id: 'd', text: 'Talia has wanted a spot on the garden crew since fifth grade.' },
      ],
      expectedAnswer: 'The office loses the application and the deadline passes.',
      hints: [
        'Rising action is not everything before the end. Test each event with one question: does this make the main problem harder?',
        'Two of these are background about Talia before any trouble, and one of them ends the trouble instead of building it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-climax-and-conflict',
      kind: 'misconception_check',
      question:
        'A student says: "The climax is the most exciting part, so it is always the fight or the crash. And if nobody fights, the story has no conflict." What went wrong?',
      commonErrors: [
        {
          answer: 'The climax is whichever scene is the loudest or the most violent.',
          misconception:
            'Choosing the climax by how exciting it feels instead of by what it decides. This is the volume test standing in for the turning-point test.',
          correctsTo:
            'The climax is the turning point, which means the moment after which the outcome of the central conflict cannot go the other way. A fire alarm, a car crash or a screaming crowd can sit in the middle of the rising action and decide nothing, so all of that is still rising action. Meanwhile one quiet sentence, such as a boy walking to a microphone, can be the climax if the ending is locked in the second it happens. Run the two questions every time: could it still go either way before this moment, and is it settled after it.',
        },
        {
          answer: 'There is no conflict in this story, because nobody fights.',
          misconception:
            'Believing that conflict means violence or an argument, so a story built on one person\'s decision looks empty.',
          correctsTo:
            'A conflict is any problem pulling against the main character, and only one of the four kinds involves another person. Character vs self is a person against their own fear or against a choice between two things they want, and a girl staring at her phone for twenty minutes is in the middle of one. Character vs nature is a person against a storm or an injury. Character vs society is a person against a rule or the way things are usually done. Look for what the character wants and what is stopping them. If something is stopping them, there is a conflict, even in a silent room.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The five stages: exposition, rising action, climax, falling action, resolution.',
        'The turning-point test finds the climax. Could it still go either way before this moment, and is it locked in after it.',
        'The climax is not the loudest or most violent scene. A big explosion that decides nothing is still rising action.',
        'The four conflicts: character vs character, character vs self, character vs nature, character vs society. None of them requires a fight.',
        'Rising action is not everything before the end. It is only the events that make the central conflict harder.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Plot Structure & Conflict' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
