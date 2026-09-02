/**
 * Grade 6 ELA — Reading Literature: Plot, Character & Structure: How a
 * Story's Plot Unfolds.
 *
 * CONCEPT-LED exemplar-style lesson for the m6ela fan-out. The student
 * arrives with no procedure to lean on, so the whole lesson builds one way
 * of reading: a story's plot moves through four stages, in order —
 * exposition, rising action, climax, resolution — and each stage does a
 * different job that a reader can name (CCSS RL.6.3). One misconception is
 * built to be caught: the climax is not the sentence where things FEEL the
 * most stressful, it is the single sentence where the outcome actually
 * turns.
 *
 * SCOPE GUARD: Grade 6 row 1.2 describes how a story's plot moves through
 * its four stages — exposition, rising action, climax, resolution —
 * identified by the job each stage does, using the stages themselves.
 * DELIBERATELY EXCLUDED: how a character responds to events or changes
 * across the plot (row 1.3, also CCSS RL.6.3 — that standard covers both
 * the plot's shape and the character's arc inside it, split here by
 * pedagogical stage: this lesson teaches the shape, row 1.3 teaches the
 * arc); how one sentence, chapter or scene fits a text's overall structure
 * or contributes to its development of theme, setting or plot (row 1.4,
 * RL.6.5); determining a theme or producing an objective summary (row 2.1,
 * RL.6.2); and any analysis of how one story element such as setting or
 * character SHAPES another element such as plot — the "elements interact"
 * treatment of RL.7.3, taught in the shipped Grade 7 Unit 1 lesson
 * `m7ela-u1-plot-structure-and-conflict.ts`. That file also introduces a
 * fifth stage (falling action, separate from resolution) and a four-part
 * conflict taxonomy (character vs character, self, nature, society); this
 * lesson uses four stages only and never classifies a conflict by type.
 * DELIBERATELY ALLOWED, because these neighbors sit close: (a) every
 * excerpt shows characters making choices and reacting to events, because a
 * plot cannot be shown without characters acting inside it — but no item
 * asks what a reaction reveals about a character, only which plot stage the
 * sentence belongs to; (b) the worked examples and the misconception check
 * each name a conflict inside their story, because rising action cannot be
 * identified without a conflict to build tension around, and naming that a
 * conflict exists is not the same as analyzing a character's response to it
 * or classifying the conflict by type.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt above it; quote your own
 * excerpt exactly, never from memory.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U1_HOW_A_STORYS_PLOT_UNFOLDS: LessonPlan = {
  id: 'evelyn.ms.m6ela.how-a-storys-plot-unfolds.v1',
  title: 'How a Story\'s Plot Unfolds',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.how-a-storys-plot-unfolds',
      standard: 'M6ELA-1.2',
      description:
        'Describe how a story\'s plot moves through a series of episodes — exposition, rising action, climax, resolution — using the stages themselves, not yet how one story element such as setting or character shapes another (CCSS RL.6.3).',
    },
  ],
  prerequisites: ['m6ela.text-evidence-and-inference'],
  followUps: ['m6ela.how-characters-respond-and-change'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already sort stories into stages without being taught to, then name the stages.',
      script:
        'Think about the last time you told a friend the whole story of something that happened over a weekend, not just one moment, the whole thing from start to finish. You probably did not just list five separate events in a random order. Without even trying, you probably set up the situation first, then told what went wrong, then got to the one moment where everything changed, and finally said how it all turned out. That shape is not an accident. Every story you read uses it too, and today we are giving each part of that shape its own name, so you can spot it fast in any story you read.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-stages-of-plot',
      kind: 'concept',
      goal: 'Install the four plot stages in order, what job each one does, and how to sort any sentence into its stage.',
      keyIdeas: [
        'A STORY\'S PLOT IS A SERIES OF CONNECTED EPISODES, not just a list of things that happened. It moves through four stages, always in this order: exposition, rising action, climax, resolution. Each stage does a different job, and naming the job tells you which stage you are reading.',
        'EXPOSITION SETS UP THE ORDINARY SITUATION, BEFORE ANY TROUBLE. It introduces the characters, the setting and the situation as it stands, before a conflict shows up. Nothing has gone wrong yet.',
        'RISING ACTION IS A SERIES OF COMPLICATIONS THAT BUILD TENSION. Once a conflict appears, one problem leads to another, and the tension keeps climbing. Rising action can stretch across more than one sentence, or even most of a story.',
        'THE CLIMAX IS ONE MOMENT, NOT THE MOST STRESSFUL MOMENT. It is the turning point, where the tension is highest and the outcome finally becomes decided. Watch for the sentence where something decisive HAPPENS — an action, a reveal, a choice — rather than the sentence that only feels the most tense leading up to it.',
        'RESOLUTION COMES AFTER THE OUTCOME IS ALREADY DECIDED. It settles the conflict and shows what things look like now that the turning point has happened.',
        'SORT ANY SENTENCE BY ASKING FOUR QUESTIONS IN ORDER. Has the trouble started yet? Is tension still building, with the outcome still uncertain? Is this the sentence where the outcome turns? Or is the outcome already decided? The first question you can answer yes to tells you the stage.',
      ],
      vocabulary: [
        { term: 'plot', definition: 'the connected series of events that make up a story, moving through four stages in order.' },
        { term: 'exposition', definition: 'the stage that introduces the characters, setting and situation before any conflict appears.' },
        { term: 'rising action', definition: 'the stage of complications that build tension after a conflict appears, often across more than one event.' },
        { term: 'climax', definition: 'the single turning point of a story, where the tension is highest and the outcome becomes decided.' },
        { term: 'resolution', definition: 'the stage after the climax that settles the conflict and shows how things turned out.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-map-the-four-stages',
      kind: 'worked_example',
      problem:
        'Sort this story into its four plot stages.\n\n"Every summer, the Ortiz family spent one week at a lake cabin, and every summer twelve-year-old Mateo tried to catch the biggest fish in the cove before his older cousin Dani did. This year Mateo borrowed his uncle\'s fishing rod without asking, and on the third day the reel jammed halfway through reeling in a fish neither of them could see. Dani grabbed the rod to help, and for a full minute the two of them wrestled the line together while it dragged their canoe sideways across the cove. When the fish finally broke the surface, it was smaller than either of them expected, but it was enough. Back at the cabin, Mateo cleaned the reel before his uncle noticed, and for the first time all week, nobody kept score of whose fish was bigger."',
      steps: [
        'Find the exposition first: the sentence that sets up the ordinary situation before any trouble starts. "Every summer, the Ortiz family spent one week at a lake cabin, and every summer twelve-year-old Mateo tried to catch the biggest fish in the cove before his older cousin Dani did." This introduces the characters, the setting and the ongoing rivalry, before anything goes wrong.',
        'Find where the complication appears and tension begins climbing. "This year Mateo borrowed his uncle\'s fishing rod without asking, and on the third day the reel jammed halfway through reeling in a fish neither of them could see." Two problems stack here: the rod was borrowed without asking, and then the reel jams. That is rising action starting.',
        'Check whether tension keeps building before any outcome is decided. "Dani grabbed the rod to help, and for a full minute the two of them wrestled the line together while it dragged their canoe sideways across the cove." The struggle continues and the outcome is still unknown, so this sentence is rising action too.',
        'Find the one sentence where the outcome actually turns. "When the fish finally broke the surface, it was smaller than either of them expected, but it was enough." This is the moment the uncertainty ends: the fish is finally seen, and the question the whole story has been building toward is answered. That makes it the climax.',
        'Find what happens after the outcome is already decided. "Back at the cabin, Mateo cleaned the reel before his uncle noticed, and for the first time all week, nobody kept score of whose fish was bigger." The conflict is settled, and this sentence shows what changed because of it. That is the resolution.',
        'Check the order: exposition, then rising action, then climax, then resolution. It matches the required shape.',
      ],
      answer:
        'Exposition: "Every summer, the Ortiz family spent one week at a lake cabin..." Rising action: "This year Mateo borrowed his uncle\'s fishing rod without asking..." and "Dani grabbed the rod to help..." Climax: "When the fish finally broke the surface, it was smaller than either of them expected, but it was enough." Resolution: "Back at the cabin, Mateo cleaned the reel before his uncle noticed..."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-plot-map',
      kind: 'worked_example',
      problem:
        'A student mapped the plot of this story, but one label is wrong. Find the mistake and fix it.\n\n"The fourth-grade class next door begged the sixth graders to run a lemonade stand for the school carnival, and Priya\'s group agreed to split the job three ways. On the morning of the carnival, the ice machine broke, and by noon every cup of lemonade had gone lukewarm. A line of thirsty kids started grumbling, and Priya\'s stand was about to lose every customer to the shaved-ice table across the aisle. Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line. The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing."\n\nStudent\'s plot map:\nExposition: "The fourth-grade class next door begged the sixth graders to run a lemonade stand for the school carnival, and Priya\'s group agreed to split the job three ways."\nRising action: "On the morning of the carnival, the ice machine broke, and by noon every cup of lemonade had gone lukewarm."\nClimax: "A line of thirsty kids started grumbling, and Priya\'s stand was about to lose every customer to the shaved-ice table across the aisle."\nResolution: "Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line. The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing."',
      steps: [
        'Check the exposition and rising action labels first, since those are the ones most likely to already be right. The exposition sentence sets up the job before any trouble, and the rising action sentence introduces the first complication, the broken ice machine. Both labels hold.',
        'Now test the climax label. Ask: does the outcome actually turn in this sentence, or is tension only building? "A line of thirsty kids started grumbling, and Priya\'s stand was about to lose every customer to the shaved-ice table across the aisle" describes the trouble getting worse, but nothing has happened yet to change the outcome. That is still rising action, at its peak, not the climax.',
        'Now test the resolution label. It has two sentences folded together. The first, "Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line," is a decisive action that actually turns the outcome. That sentence is the climax, mislabeled as resolution.',
        'The second sentence inside that label, "The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing," comes after the outcome is already decided. That sentence is the true resolution.',
        'WRONG: Climax = "A line of thirsty kids started grumbling, and Priya\'s stand was about to lose every customer to the shaved-ice table across the aisle." Resolution = "Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line. The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing." CORRECT: Rising action continues through "A line of thirsty kids started grumbling, and Priya\'s stand was about to lose every customer to the shaved-ice table across the aisle." Climax = "Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line." Resolution = "The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing."',
        'The mistake to remember: the sentence where trouble feels worst is not automatically the climax. Keep looking for the sentence where a decisive action actually turns the outcome.',
      ],
      answer:
        'The climax label was placed one sentence too early. The true climax is "Priya ran to the cafeteria, filled two buckets with ice from the freezer, and dumped both into the lemonade cooler in front of the whole line," because that is where the outcome turns. The grumbling-line sentence stays in rising action, and the resolution is only "The lemonade stayed cold for the rest of the carnival, and Priya\'s group sold out an hour before closing."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-climax',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the sentence that is the CLIMAX.\n\n"Every year, the talent show ended with the same magic trick from Mr. Alvarez, the science teacher, and everyone in the audience already knew how it worked. This year, the seventh grader before him, Wren, secretly swapped his props before the curtain went up. Mr. Alvarez pulled the tablecloth, expecting the dishes to stay in place the way they always had, and instead the whole stack slid onto the floor in front of three hundred students. He looked at the mess for a second, then bowed as if the crash had been the plan all along, and the audience gave him the loudest applause of the night."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'This year, the seventh grader before him, Wren, secretly swapped his props before the curtain went up.' },
        { id: 'b', text: 'He looked at the mess for a second, then bowed as if the crash had been the plan all along, and the audience gave him the loudest applause of the night.' },
        { id: 'c', text: 'Every year, the talent show ended with the same magic trick from Mr. Alvarez, the science teacher, and everyone in the audience already knew how it worked.' },
        { id: 'd', text: 'Mr. Alvarez pulled the tablecloth, expecting the dishes to stay in place the way they always had, and instead the whole stack slid onto the floor in front of three hundred students.', correct: true },
      ],
      expectedAnswer: 'Mr. Alvarez pulled the tablecloth, expecting the dishes to stay in place the way they always had, and instead the whole stack slid onto the floor in front of three hundred students.',
      hints: [
        'Match each sentence to a job first: which one sets up the ordinary situation, which one introduces a complication, which one is the turning point, and which one comes after the outcome is already decided.',
        'The climax is the one sentence where something decisive happens and the outcome stops being uncertain. Two of the other three sentences come before that point, and one comes after it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-rising-action',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the sentence that describes the RISING ACTION.\n\n"Every day after school, twin sisters Yara and Bibi jogged the same loop around their neighborhood, timing each other with their dad\'s old stopwatch. Two weeks before the school fun run, Yara sprained her ankle on the curb and could not run at all, so Bibi kept training loops by herself, worried she might have to run without her sister at the starting line. On race morning, Yara showed up anyway with her ankle taped, and the two of them crossed the finish line side by side, slower than either of them wanted but together. That night, they wrote the finish time on the stopwatch case so they would remember it the next time either of them wanted to quit."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Two weeks before the school fun run, Yara sprained her ankle on the curb and could not run at all, so Bibi kept training loops by herself, worried she might have to run without her sister at the starting line.', correct: true },
        { id: 'b', text: 'Every day after school, twin sisters Yara and Bibi jogged the same loop around their neighborhood, timing each other with their dad\'s old stopwatch.' },
        { id: 'c', text: 'On race morning, Yara showed up anyway with her ankle taped, and the two of them crossed the finish line side by side, slower than either of them wanted but together.' },
        { id: 'd', text: 'That night, they wrote the finish time on the stopwatch case so they would remember it the next time either of them wanted to quit.' },
      ],
      expectedAnswer: 'Two weeks before the school fun run, Yara sprained her ankle on the curb and could not run at all, so Bibi kept training loops by herself, worried she might have to run without her sister at the starting line.',
      hints: [
        'Match each sentence to a job first: which one sets up the ordinary routine, which one introduces a complication that builds tension, which one is the turning point, and which one comes after the outcome is decided.',
        'Rising action introduces a problem and builds tension, but the outcome is still uncertain by the end of it. Rule out the sentence that only sets the scene, the sentence where the outcome finally turns, and the sentence that comes after that turn.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-resolution',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the sentence that describes the RESOLUTION.\n\n"Renata spent a month building a papier-mache volcano for the fifth-grade science fair, and she was sure hers would win first place. The night before the fair, her little brother knocked the whole thing off the kitchen table, crushing one whole side of the volcano into a flat gray lump. Renata stayed up past midnight patching the dent with clay from an old art kit, and by morning the repaired side actually looked more like real rock than the rest of the volcano did. At the fair the next day, three judges stopped at her table just to ask about the patched side, and Renata explained exactly how she had fixed it."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Renata stayed up past midnight patching the dent with clay from an old art kit, and by morning the repaired side actually looked more like real rock than the rest of the volcano did.' },
        { id: 'b', text: 'At the fair the next day, three judges stopped at her table just to ask about the patched side, and Renata explained exactly how she had fixed it.', correct: true },
        { id: 'c', text: 'Renata spent a month building a papier-mache volcano for the fifth-grade science fair, and she was sure hers would win first place.' },
        { id: 'd', text: 'The night before the fair, her little brother knocked the whole thing off the kitchen table, crushing one whole side of the volcano into a flat gray lump.' },
      ],
      expectedAnswer: 'At the fair the next day, three judges stopped at her table just to ask about the patched side, and Renata explained exactly how she had fixed it.',
      hints: [
        'Match each sentence to a job first: which one sets up the situation, which one introduces the complication, which one is the turning point, and which one comes after the outcome is already settled.',
        'The resolution comes last: it is the sentence where the conflict is over and the outcome is already decided, not the sentence where the outcome gets decided.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-worst-moment-vs-turning-point',
      kind: 'misconception_check',
      question:
        'A student maps a story and labels the sentence where things feel the most stressful as the climax, even though nothing actually happens or changes in that sentence. The real turning point sits one sentence later. What went wrong?',
      commonErrors: [
        {
          answer: 'The climax is the sentence where a character feels the most worried or stressed.',
          misconception:
            'Treating the FEELING of tension as the marker for climax, rather than the turning-point action. The peak of worry often sits in rising action, right before the climax, and it can be easy to grab the emotional high point because it stands out.',
          correctsTo:
            'The climax is not the most stressed-out moment. It is the specific sentence where something decisive happens: an action taken, a secret revealed, a choice made, and the outcome stops being uncertain. Find the sentence where the tension actually turns, not the sentence where it merely feels highest. Rising action can feel just as tense right before the climax, so check whether the outcome is still uncertain, which means rising action, or has just been decided, which means climax.',
        },
        {
          answer: 'Everything after the exposition and before the very last line is the climax.',
          misconception:
            'Treating climax as a long stretch instead of one turning point. Rising action can run across several sentences, and it is tempting to lump all of that building tension under one label.',
          correctsTo:
            'The climax is a single moment, usually one sentence, where the outcome turns. Everything building toward it, even across several sentences, is rising action. Everything after it, once the outcome is already set, is resolution. Find that one hinge point and give it its own label instead of stretching the label across the whole middle of the story.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A story\'s plot moves through four stages, always in this order: exposition, rising action, climax, resolution.',
        'Exposition sets up the characters, the setting and the situation before any trouble starts.',
        'Rising action is a series of complications that build tension once a conflict appears, and it can stretch across more than one sentence.',
        'The climax is one moment, not the most stressful moment. It is the turning point where the outcome becomes decided.',
        'Resolution comes after the turning point and shows how the conflict settled.',
        'Sort any sentence by asking, in order: has the trouble started, is tension still building, is this the turning point, or is the outcome already decided?',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'How a Story\'s Plot Unfolds' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
