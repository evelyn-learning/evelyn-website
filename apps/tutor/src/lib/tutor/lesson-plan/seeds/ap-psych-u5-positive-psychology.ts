/**
 * AP Psychology — CED Unit 5.2: Positive Psychology.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U5_POSITIVE_PSYCHOLOGY: LessonPlan = {
  id: 'evelyn.ap.psych.positive-psychology.v1',
  title: 'U5.2 Positive Psychology',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.positive-psychology',
      description:
        'Explain the definition and goals of positive psychology; describe subjective well-being and its measurement; and identify factors that promote well-being and resilience (flow, signature character strengths and virtues, gratitude, and posttraumatic growth).',
      standard: 'AP-PSYCH-5.2',
    },
  ],
  prerequisites: ['appsych.stress-health'],
  followUps: ['appsych.classifying-disorders'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame positive psychology as the study of what makes life worth living, not just what goes wrong.',
      script:
        "Psychology spent much of its history studying what goes WRONG — disorders, dysfunction, distress. Positive psychology flips the question: what makes life go RIGHT? What lets people not just survive but flourish? This is a small but reliably tested corner of the exam, and the vocabulary is precise, so let's nail it down.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-positive',
      kind: 'concept',
      goal: 'Cover the definition/goals, subjective well-being, and the key positive-psychology constructs.',
      keyIdeas: [
        'POSITIVE PSYCHOLOGY: the scientific study of human FLOURISHING — strengths, well-being, and the conditions that let individuals and communities thrive. Associated with Martin Seligman and Mihaly Csikszentmihalyi.',
        'GOAL / CONTRAST: rather than only repairing what is broken (the "disease model"), positive psychology studies how to BUILD positive qualities and a good life. It complements, not replaces, the study of disorders.',
        'SUBJECTIVE WELL-BEING (SWB): a person\'s OWN evaluation of their life — life satisfaction plus the balance of positive over negative emotions. It is "subjective" because it is self-reported, not externally judged. Well-being is only weakly related to wealth above basic needs.',
        'FLOW (Csikszentmihalyi): a state of complete, energized absorption in an activity, where challenge and skill are well matched. Time seems to vanish; the activity is intrinsically rewarding. Too-easy → boredom; too-hard → anxiety; matched → flow.',
        'CHARACTER STRENGTHS AND VIRTUES: positive psychology catalogs SIGNATURE STRENGTHS (e.g. curiosity, gratitude, perseverance, kindness, hope) grouped under broad virtues. Using one\'s signature strengths is linked to greater well-being.',
        'GRATITUDE and other positive practices (savoring, acts of kindness, optimism) are studied as interventions that can raise well-being.',
        'RESILIENCE: the capacity to recover and adapt in the face of adversity. POSTTRAUMATIC GROWTH: positive psychological change some people experience AFTER struggling with highly challenging events (e.g. deeper relationships, new priorities) — distinct from merely returning to baseline.',
        'BROADEN-AND-BUILD (Fredrickson): positive emotions BROADEN our momentary thought-action range and BUILD lasting personal resources (social, intellectual, physical) over time.',
      ],
      vocabulary: [
        { term: 'subjective well-being', definition: 'a person\'s self-reported life satisfaction and balance of positive vs negative emotions.' },
        { term: 'flow', definition: 'complete absorption in an activity that matches challenge to skill (Csikszentmihalyi).' },
        { term: 'posttraumatic growth', definition: 'positive psychological change experienced after struggling with adversity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-flow',
      kind: 'try_yourself',
      problem:
        'A pianist loses all track of time while playing a piece that is challenging but within her ability, feeling fully absorbed and intrinsically rewarded. (a) Name this state. (b) What relationship between challenge and skill produces it? (c) What would she feel if the piece were far too hard, and far too easy?',
      expectedAnswer:
        '(a) This is FLOW (Csikszentmihalyi). (b) Flow arises when the CHALLENGE of the task is well MATCHED to the person\'s SKILL level — demanding enough to require full engagement but not beyond her ability. (c) If the piece were FAR TOO HARD (challenge ≫ skill), she would feel ANXIETY/frustration; if FAR TOO EASY (skill ≫ challenge), she would feel BOREDOM. Flow lives in the matched middle. Strong answers name flow, state the challenge-skill match explicitly, and correctly map too-hard → anxiety and too-easy → boredom.',
      responseFormat: 'free',
      hints: [
        'Absorbed, time vanishing, intrinsically rewarding = which state?',
        'It depends on the balance between challenge and skill.',
        'Too hard vs too easy produce two opposite feelings.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-resilience-synthesis',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. After a serious illness, a man reports that he has recovered and now feels deeper gratitude, closer relationships, and clearer priorities than before. A friend says, "He\'s just back to normal." (a) Distinguish resilience from posttraumatic growth and identify which the man shows. (b) Explain how this scenario reflects the GOALS of positive psychology. (c) Name one well-being practice from positive psychology he appears to be using.',
      expectedAnswer:
        '(a) RESILIENCE is the capacity to RECOVER and return to baseline functioning after adversity. POSTTRAUMATIC GROWTH goes further: POSITIVE psychological change BEYOND baseline (deeper relationships, new priorities, greater appreciation) resulting from the struggle. The man shows POSTTRAUMATIC GROWTH, not merely resilience — he is not just "back to normal" but reports growth, so the friend is mistaken. (b) This reflects positive psychology\'s GOAL of studying what helps people FLOURISH rather than only repairing dysfunction — focusing on strengths, growth, and well-being. (c) He appears to be practicing GRATITUDE (deeper appreciation/thankfulness), a positive-psychology practice associated with higher subjective well-being. (Savoring or using signature strengths would also be acceptable.) Strong answers (i) define both terms and pick posttraumatic growth, (ii) connect to the flourishing goal, and (iii) name a concrete practice such as gratitude.',
      responseFormat: 'frq',
      hints: [
        'Recovery to baseline vs growth beyond baseline — two different concepts.',
        'Positive psychology studies flourishing, not just repair.',
        'Which well-being practice involves appreciation/thankfulness?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Positive psychology = the scientific study of flourishing and strengths (Seligman, Csikszentmihalyi).',
        'Subjective well-being = self-reported life satisfaction + positive vs negative affect.',
        'Flow = absorption when challenge matches skill; too hard = anxiety, too easy = boredom.',
        'Signature strengths, gratitude, savoring build well-being.',
        'Resilience = recovery to baseline; posttraumatic growth = positive change beyond baseline.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2',
    cedTitle: 'Positive Psychology',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '12', note: 'Positive psychology: well-being, flow, strengths, resilience.' },
    ],
  },
};
