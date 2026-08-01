/**
 * HS English — Reading Literature: Plot, Conflict & Structure.
 *
 * How stories are built and why they pull (CCSS RL.9-10.3, RL.9-10.5):
 * the five plot stages with the turning-point test, internal vs external
 * conflict, and the structural devices — flashback, foreshadowing,
 * cliffhanger — that manufacture tension. All excerpts are short ORIGINAL
 * prose written for this lesson — no copyrighted quotations, no external
 * passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U6_PLOT_AND_CONFLICT: LessonPlan = {
  id: 'evelyn.hs.engl.plot-and-conflict.v1',
  title: 'Plot, Conflict & Structure',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.plot-and-conflict',
      standard: 'ENGL-6.1',
      description:
        'Map a narrative onto its plot stages (exposition, rising action, climax, falling action, resolution), identify the central conflict as internal or external and by type, and analyze how structural choices such as flashback and foreshadowing build tension and shape meaning (CCSS RL.9-10.3, RL.9-10.5).',
    },
  ],
  prerequisites: ['engl.counterargument-and-rebuttal'],
  followUps: ['engl.characterization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Name the invisible architecture students already feel every time a story will not let them stop.',
      script:
        'Think about the last time you told a friend about a genuinely terrible day. You did not deliver it in order, evenly, like a police report. You set the scene fast, piled the disasters higher and higher, held the worst moment for last, and then let the ending land. That is structure, and you built it by instinct because you wanted a reaction. The same instinct is why a series ends an episode one second before the door opens. Today we take that instinct apart: the stages a story moves through, the conflict that pushes it forward, and the tricks writers use to make you unable to look away.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-plot-conflict-structure',
      kind: 'concept',
      goal: 'The five plot stages and the turning-point test, conflict types and the internal/external split, and how structural devices generate tension.',
      keyIdeas: [
        'THE FIVE STAGES — EXPOSITION sets up character, setting, and the situation before trouble; RISING ACTION stacks complications; CLIMAX is the turning point; FALLING ACTION is the fallout; RESOLUTION is the new normal the story leaves behind.',
        'THE TURNING-POINT TEST — the climax is the moment after which the outcome can no longer go the other way. Ask: before this moment, could the story still end either way? After it, is the ending locked in? The stage that flips that answer is the climax, loud or quiet.',
        'EXTERNAL CONFLICT — the struggle is between the character and something outside her: person vs person (a rival, a parent), person vs nature (a storm, an injury), person vs society (a rule, a custom, a system).',
        'INTERNAL CONFLICT — person vs self: the struggle happens inside one character, between two things she wants or between what she wants and what she believes is right. Signal words are thoughts, hesitation, and self-argument, not fists.',
        'CONFLICT DRIVES PLOT — the conflict is the engine, not the decoration. Every complication in the rising action is the conflict getting harder, and the climax is the moment the character finally acts on it. If you cannot state the conflict in one sentence, you cannot map the plot.',
        'STORIES USUALLY RUN BOTH — an external conflict often carries an internal one underneath. A character fighting for a spot on the team (person vs person) may also be fighting her own fear of failing in public (person vs self). Name both, then say which one the ending resolves.',
        'STRUCTURAL DEVICES — FLASHBACK interrupts the present to deliver earlier information, usually explaining a motive the reader could not otherwise see; FORESHADOWING plants a detail that pays off later, creating dread or anticipation; a CLIFFHANGER cuts away at maximum uncertainty so the tension carries across the break. Each one manipulates WHEN you learn something, and that timing is the tension.',
        'THE CLASSIC ERROR — the climax is not automatically the loudest, most exciting, or most violent scene. An explosion in the middle of the rising action is still rising action. Apply the turning-point test, not the volume test.',
      ],
      vocabulary: [
        { term: 'climax', definition: 'the turning point of a narrative, after which the outcome of the central conflict is decided.' },
        { term: 'foreshadowing', definition: 'an early detail that hints at a later event, building anticipation or dread before the payoff.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-map-the-arc',
      kind: 'worked_example',
      problem:
        'Map this mini-story onto the plot stages and name the conflict: "Every Saturday, Odalys sold bread at her family\'s market stall. When the city raised the vendor fee, her family fell three weeks behind, and the inspector began circling the stall. On the final Saturday, Odalys spent her saved concert money on the fee. The stall stayed open, and she taped the ticket stub to the register as a reminder."',
      steps: [
        'Find the exposition — the situation before trouble: Odalys sells bread at the family stall every Saturday. Character, setting, and routine, with no problem yet.',
        'Find the rising action — the complications that stack: the fee rises, the family falls three weeks behind, and the inspector starts circling. Each sentence raises the pressure on the same problem.',
        'Apply the turning-point test to find the climax: before Odalys spends her concert money, the stall could still close. After she spends it, the outcome is decided. That decision is the climax, even though nobody shouts.',
        'Sort the last sentence: the stall staying open is falling action (the fallout of her choice), and taping the ticket stub to the register is the resolution — the new normal she carries forward.',
        'Name the conflict: externally it is person vs society, since a city fee threatens the family business. Underneath runs person vs self, because Odalys must choose between her own plans and her family\'s livelihood. The ending resolves the internal one.',
      ],
      answer:
        'Exposition: the Saturday stall. Rising action: the fee increase, the three-week debt, the circling inspector. Climax: Odalys spends her concert money on the fee. Falling action: the stall stays open. Resolution: the taped ticket stub. Conflict: person vs society (the fee) carrying a person vs self choice',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-climax-error',
      kind: 'worked_example',
      problem:
        'A student reads this mini-story and calls the fire the climax: "Ruthie had wanted the head-cook job for two years. Midway through the dinner rush, a fryer caught fire and the kitchen was evacuated, though nobody was hurt. Afterward, the owner asked Ruthie to name the person responsible, and she said the mistake had been her own, though it had not been. She was passed over for the job and kept her friend." Where did the reasoning go wrong?',
      steps: [
        'Identify what the student used as the test: the fire is the loudest, most dramatic event, so it must be the peak. That is the volume test, not the turning-point test.',
        'Run the turning-point test on the fire: after the fryer burns and everyone leaves safely, could Ruthie still get the job? Yes. Nothing about her future is decided, so the fire is a complication — rising action.',
        'Run the same test on the moment she claims the mistake: before she speaks, she could still be promoted; after she speaks, she cannot. The outcome locks in there, so that quiet sentence is the climax.',
        'Name the conflict she resolves: person vs self. Ruthie wants the job she has chased for two years and also wants to protect her friend, and the climax is the moment she chooses between them. The fire only created the pressure that forced the choice.',
        'State the corrected map: the fire is rising action, the false confession is the climax, being passed over is falling action, and keeping the friend is the resolution.',
      ],
      answer:
        'The fire is rising action, not the climax — it is the loudest scene but decides nothing. The climax is Ruthie taking blame she does not deserve, because that is the moment the outcome is locked in, resolving a person vs self conflict',
      estimatedMinutes: 3,
    },
    {
      id: 'try-conflict-type',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The scholarship letter lay unopened for a week. Camila knew that taking it meant leaving her grandmother alone in the apartment, and every time she reached for the envelope she found something else that needed doing." What is the central conflict in this excerpt?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Internal — person vs self', correct: true },
        { id: 'b', text: 'External — person vs person' },
        { id: 'c', text: 'External — person vs society' },
        { id: 'd', text: 'External — person vs nature' },
      ],
      expectedAnswer: 'Internal — person vs self',
      hints: [
        'Nobody is arguing with Camila and nothing is blocking her. Ask where the struggle is actually happening.',
        'She avoids her own envelope. The obstacle is her own divided wanting, not another character or a rule.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plot-stage',
      kind: 'try_yourself',
      problem:
        'A story opens with Nabil training alone for the district swim trials, then adds three setbacks: a shoulder strain, a coach who quits, and a pool closure. Then comes this moment: "Nabil pulled the entry form out of his bag, signed it with his shoulder still aching, and slid it under the office door." The rest of the story shows the trial results and Nabil coaching a younger swimmer. Which plot stage does the signing moment belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Climax — after it, the outcome of the conflict is decided', correct: true },
        { id: 'b', text: 'Rising action — it is one more complication in a series' },
        { id: 'c', text: 'Exposition — it establishes who Nabil is' },
        { id: 'd', text: 'Falling action — it shows the fallout of an earlier decision' },
      ],
      expectedAnswer: 'Climax — after it, the outcome of the conflict is decided',
      hints: [
        'Do not ask which moment is most exciting. Ask which moment locks in the ending.',
        'The three setbacks build pressure toward one question: will he enter? The sentence that answers it is the turning point.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-foreshadowing-effect',
      kind: 'try_yourself',
      problem:
        'Read the excerpt from early in a story: "Every year the lake froze solid by December, and every year Ines\' father tested the ice with a long pole before letting anyone step out. This December he was working double shifts, and the pole stayed in the shed." What is the primary effect of the detail about the pole?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It foreshadows danger on the ice, creating dread before anything happens', correct: true },
        { id: 'b', text: 'It is a flashback that explains the father\'s past' },
        { id: 'c', text: 'It resolves the conflict by removing the obstacle' },
        { id: 'd', text: 'It is setting description with no effect on tension' },
      ],
      expectedAnswer: 'It foreshadows danger on the ice, creating dread before anything happens',
      hints: [
        'The narrator goes out of the way to tell you a safety ritual was skipped this year. Why mention it now?',
        'A planted detail that makes a later event feel inevitable is foreshadowing, and its job is dread.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-loudest-scene',
      kind: 'misconception_check',
      question:
        'A student says: "The climax is the most exciting part, so in any story it is the fight, the crash, or the big argument. That is just what climax means." What went wrong?',
      commonErrors: [
        {
          answer: 'The climax is whichever scene is loudest or most dramatic',
          misconception: 'Defining the climax by emotional volume instead of by structural function.',
          correctsTo:
            'The climax is defined by the turning-point test, not by noise. It is the moment after which the central conflict\'s outcome can no longer go the other way. A dramatic crash that changes nothing is still rising action, and a single quiet sentence can be the climax if the ending is locked in once it is spoken.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five stages: exposition, rising action, climax, falling action, resolution.',
        'The turning-point test finds the climax — after it, the outcome cannot go the other way. Volume is not the test.',
        'Conflict is external (person vs person, nature, society) or internal (person vs self), and most stories run one inside the other.',
        'Conflict is the engine: every complication is the conflict getting harder.',
        'Flashback, foreshadowing, and cliffhangers control WHEN you learn something — that timing is where tension comes from.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Plot, Conflict & Structure' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
