/**
 * HS English — Reading Informational Texts: Ethos, Pathos & Logos.
 *
 * How arguments try to move you (CCSS RI.9-10.6, RI.9-10.8): the three
 * classical appeals, the identify-by-TARGET method, and the difference
 * between an appeal used well and one used to manipulate. All excerpts
 * are short ORIGINAL prose written for this lesson — invented speakers,
 * invented products, invented figures; no real campaigns or people.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U5_RHETORICAL_APPEALS: LessonPlan = {
  id: 'evelyn.hs.engl.rhetorical-appeals.v1',
  title: 'Ethos, Pathos & Logos',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.rhetorical-appeals',
      standard: 'ENGL-5.2',
      description:
        'Identify appeals to credibility (ethos), emotion (pathos), and logic (logos) in an argument and evaluate whether each appeal is used effectively or manipulatively to advance the speaker\'s purpose (CCSS RI.9-10.6, RI.9-10.8).',
    },
  ],
  prerequisites: ['engl.claims-and-evidence'],
  followUps: ['engl.logical-fallacies'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that persuasion surrounds the student daily, and that naming HOW it works is the defense.',
      script:
        'Count the arguments aimed at you before lunch tomorrow. An ad promising the shoes will change your season. A friend saying "come on, everyone else is going." A creator explaining that a sponsor genuinely changed their life. A fundraising speech that makes the room go quiet. Every one of those is doing the same three things in different proportions: asking you to trust the speaker, asking you to feel something, or asking you to follow a chain of reasoning. Today we learn to name which one is being used on us at any moment — because you cannot argue back with something you cannot see.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-appeals',
      kind: 'concept',
      goal: 'The three appeals with recognition cues, how they combine, the identify-by-TARGET method, and effective versus manipulative use of each.',
      keyIdeas: [
        'ETHOS — the appeal to CREDIBILITY. The speaker asks you to trust the source: "I have coached this team for eleven years," "as a nurse who worked that ward," "our formula was tested by an independent lab." Recognition cue: language about who the speaker IS, what they have done, or whose endorsement backs them.',
        'PATHOS — the appeal to EMOTION. The speaker asks you to feel something: pride, fear, guilt, hope, belonging. Recognition cue: vivid images, named individuals, sensory detail, second-person "imagine you," and loaded word choice ("abandoned," "thriving," "forgotten").',
        'LOGOS — the appeal to LOGIC. The speaker asks you to follow reasoning: data, causes and effects, comparisons, if-then chains. Recognition cue: numbers, studies, "because" and "therefore," and any claim you could in principle check.',
        'APPEALS COMBINE — real arguments almost never use one appeal alone. A single fundraising paragraph may open with the speaker\'s credentials (ethos), tell one family\'s story (pathos), and close with the cost per meal (logos). The useful question is which appeal DOMINATES a given sentence, not which single appeal the whole speech is.',
        'IDENTIFY BY TARGET — do not sort by topic; sort by what the sentence is trying to do to you. Ask: is this trying to make me TRUST the speaker (ethos), FEEL something (pathos), or ACCEPT a chain of reasoning (logos)? A statistic inside a sentence does not make it logos if its real job is to shock you; a personal story does not make it pathos if its real job is to establish that the speaker has relevant experience.',
        'EFFECTIVE VERSUS MANIPULATIVE PATHOS — pathos is honest when the emotion fits the facts and the audience is left free to decide: a true story about one family, told accurately, helps you understand what the numbers mean. Pathos turns manipulative when it manufactures fear or guilt that the evidence does not support, or when it substitutes for evidence entirely ("if you do not act tonight, it is on you").',
        'EFFECTIVE VERSUS MANIPULATIVE ETHOS — honest ethos offers relevant expertise you could verify. Manipulative ethos borrows authority that does not apply: fame instead of expertise, a credential in an unrelated field, or a vague appeal to "experts" and "studies" with no source you could ever check.',
        'EFFECTIVE VERSUS MANIPULATIVE LOGOS — honest logos gives evidence that actually supports the claim being made. Manipulative logos wears the costume of reasoning: a precise-sounding percentage from an unnamed source, a comparison between things that are not comparable, or one anecdote presented as if it proved a general rule.',
      ],
      vocabulary: [
        { term: 'ethos', definition: 'an appeal to the speaker\'s credibility, character, or authority, asking the audience to trust the source.' },
        { term: 'pathos', definition: 'an appeal to the audience\'s emotions, asking them to feel something that moves them toward the claim.' },
        { term: 'logos', definition: 'an appeal to logic and evidence, asking the audience to accept a claim because the reasoning holds.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify-ad',
      kind: 'worked_example',
      problem:
        'Classify the appeal in each sentence of this advertisement, then name which appeal dominates: "Every pair of Brightwell trainers is designed by three former college track coaches. In a twelve-week trial, 82 percent of our testers reported less knee pain. Stop limping home from the runs you used to love."',
      steps: [
        'Sentence 1 asks who made the shoe: former college track coaches. The target is TRUST in the source, so this is ethos.',
        'Sentence 2 offers a trial and a percentage, inviting you to reason from evidence to the claim that the shoe works. The target is your REASONING, so this is logos.',
        'Sentence 3 contains no data and no credentials — "the runs you used to love" is built to make you feel loss and longing. The target is your FEELINGS, so this is pathos.',
        'Weigh the dominance: the ad ends on the emotional turn and that is the line asking for the purchase, but the reader\'s judgment is meant to rest on sentence 2. Say so precisely: the ad layers all three, opening with ethos, resting its proof on logos, and closing with pathos to convert.',
        'Then evaluate quality, which is a separate question from classification: the logos here is unverifiable because the trial has no named source and "our testers" means the seller ran its own study.',
      ],
      answer:
        'Sentence 1 = ethos, sentence 2 = logos, sentence 3 = pathos; the ad layers all three and closes on pathos, and its logos is weak because the trial is self-reported and unsourced',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-anecdote-as-logos',
      kind: 'worked_example',
      problem:
        'A student labels this school-board excerpt as logos: "My neighbor\'s son moved to a school with a later start time, and his grades rose a full letter within a semester. The evidence on later start times is settled." Why is that label wrong, and what is actually happening?',
      steps: [
        'Apply the TARGET test to the first sentence: one named neighbor, one child, one vivid before-and-after. It works by making you picture a real kid succeeding, so its target is feeling, not reasoning — this is pathos.',
        'Notice why the label was tempting: the anecdote is placed where evidence belongs and is followed by the word "evidence," so it wears the costume of logos.',
        'Test it as reasoning anyway: one case cannot establish a general rule, and nothing rules out other causes — a new school, a new teacher, a growth spurt in maturity. As logos it fails immediately.',
        'Name the second sentence separately: "the evidence is settled" claims authority without producing any, so it is manipulative ethos — a borrowed appeal to unnamed experts.',
        'State the correct reading: the excerpt is pathos plus unsupported ethos dressed as logos. Real logos would need many cases, a named source, and a comparison group. Note the mirror-image error too — a statistic does not automatically make an argument good logos, because an unsourced or irrelevant number is still not proof.',
      ],
      answer:
        'It is not logos — a single anecdote is pathos placed where evidence belongs, followed by an appeal to unnamed authority (manipulative ethos); genuine logos would require multiple cases, a named source, and a comparison group',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-dominant',
      kind: 'try_yourself',
      problem:
        'Which appeal DOMINATES this excerpt from a speech at a community meeting? "Before you decide how to vote tonight, you should know that I have taught in this district for fifteen years and helped write the reading guide your children use every day."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ethos — the speaker establishes experience and qualifications so the audience will trust her', correct: true },
        { id: 'b', text: 'Pathos — the speaker stirs the audience\'s affection for their children' },
        { id: 'c', text: 'Logos — the sentence contains a number, fifteen, so it reasons from data' },
        { id: 'd', text: 'Pathos — the phrase "before you decide" pressures the audience with urgency' },
      ],
      expectedAnswer: 'Ethos — the speaker establishes experience and qualifications so the audience will trust her',
      hints: [
        'Run the TARGET test: is this sentence trying to make you trust the speaker, feel something, or follow a chain of reasoning?',
        'A number is not automatically logos. Ask what the fifteen years are evidence OF — the district policy, or the speaker herself?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-add-ethos',
      kind: 'try_yourself',
      problem:
        'A student proposal opens: "Our school should add a late bus. Students who stay for clubs currently have no way home." Which revision most clearly adds ETHOS to the argument?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Last Tuesday I watched a ninth grader wait alone in the rain for ninety minutes.' },
        { id: 'b', text: 'As the student who has run our after-school tutoring program for two years, I have signed out every late-staying club member myself.', correct: true },
        { id: 'c', text: 'I surveyed 212 club members, and 64 percent said transportation is the reason they quit an activity.' },
        { id: 'd', text: 'A late bus would cost less than one percent of the district transportation budget.' },
      ],
      expectedAnswer: 'As the student who has run our after-school tutoring program for two years, I have signed out every late-staying club member myself.',
      hints: [
        'Ethos answers "why should I believe YOU?" — look for the revision that establishes the writer\'s standing to speak.',
        'Two of these choices add data and one adds an image. Only one tells you who the writer is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-manipulative-pathos',
      kind: 'try_yourself',
      problem:
        'A fundraising letter for a meal-delivery charity contains the four sentences below. Which one uses pathos MANIPULATIVELY rather than legitimately?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Give tonight, or picture your own grandmother alone in a cold apartment all winter and know that you chose to do nothing.', correct: true },
        { id: 'b', text: 'Last winter our volunteers delivered 900 hot meals to residents living alone.' },
        { id: 'c', text: 'One of those residents told our driver he was the only person she had spoken to all week.' },
        { id: 'd', text: 'Each meal costs us eleven dollars, and anything above that goes toward fuel.' },
      ],
      expectedAnswer: 'Give tonight, or picture your own grandmother alone in a cold apartment all winter and know that you chose to do nothing.',
      hints: [
        'Legitimate pathos reports a true detail and lets you decide; manipulative pathos manufactures guilt or fear the evidence does not support.',
        'Two of these sentences are really logos. Of the two emotional ones, which invents a scenario about YOUR family and assigns you blame for a choice?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pathos-bad-logos-good',
      kind: 'misconception_check',
      question:
        'A student says: "Pathos means the writer is manipulating you, so any emotional appeal is a red flag. Logos is the honest one — once a speaker cites a statistic, the argument is sound." What went wrong in both halves of that claim?',
      commonErrors: [
        {
          answer: 'Pathos is a manipulation tactic, so an emotional appeal weakens an argument',
          misconception: 'Confusing the APPEAL with its misuse, and treating emotion as illegitimate in argument.',
          correctsTo:
            'Pathos is a tool, not a verdict. Emotion is honest when it fits the facts and helps an audience grasp what the evidence means — a true, accurately told story about one family makes a statistic about thousands comprehensible. Judge pathos by whether the feeling is earned by the facts and whether the audience is left free to decide, not by whether feeling is present.',
        },
        {
          answer: 'A statistic makes an argument logos, and logos makes it correct',
          misconception: 'Treating the presence of numbers as proof that the reasoning holds.',
          correctsTo:
            'Logos names the KIND of appeal, never its quality. A percentage from an unnamed source, a study the speaker paid for, or a number that does not actually bear on the claim is weak logos wearing the costume of proof. Ask what the number measures, where it came from, and whether it supports THIS claim before granting it any weight.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ethos targets trust in the speaker, pathos targets feeling, logos targets reasoning — three different jobs, one argument.',
        'Identify by TARGET, not topic: ask what this sentence is trying to make me trust, feel, or accept.',
        'Real arguments layer all three; name the appeal that dominates a given sentence rather than labeling a whole speech.',
        'No appeal is automatically good or bad — pathos can be honest and logos can be hollow, so evaluate whether the evidence, the credentials, or the emotion actually earns the claim.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Ethos, Pathos & Logos' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
