/**
 * AP Psychology — CED Unit 4.6: Motivation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U4_MOTIVATION: LessonPlan = {
  id: 'evelyn.ap.psych.motivation.v1',
  title: 'U4.6 Motivation',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.motivation',
      description:
        'Compare the major theories of motivation (instinct, drive-reduction, arousal/Yerkes-Dodson, incentive, and Maslow\'s hierarchy); apply them to hunger and achievement motivation; and distinguish intrinsic from extrinsic motivation and the three types of motivational conflict.',
      standard: 'AP-PSYCH-4.6',
    },
  ],
  prerequisites: [],
  followUps: ['appsych.emotion'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame motivation as the "why" behind behavior, with competing theories.',
      script:
        "Why do you do anything — eat, study, scroll, compete? Motivation is the engine behind behavior, and psychologists have several theories for it, each capturing part of the truth. Some behavior is about reducing a need, some about seeking just the right amount of stimulation, some about chasing rewards. Today we line up the theories so you can apply the right one to any scenario.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-motivation',
      kind: 'concept',
      goal: 'Cover the motivation theories, hunger, achievement motivation, and conflicts.',
      keyIdeas: [
        'MOTIVATION = a need or desire that ENERGIZES and DIRECTS behavior.',
        'INSTINCT THEORY: some behaviors are innate, unlearned fixed patterns (more useful for animals). Limited for humans — it names behaviors without explaining them.',
        'DRIVE-REDUCTION THEORY: a physiological NEED creates an aroused DRIVE that pushes the organism to reduce it and restore HOMEOSTASIS (balance). E.g. dehydration → thirst drive → drink → balance restored. Explains biological needs but not why we seek stimulation when needs are met.',
        'AROUSAL THEORY: we are motivated to maintain an OPTIMAL level of arousal — sometimes seeking stimulation (curiosity, thrill), not just reducing it. YERKES-DODSON LAW: performance is best at MODERATE arousal; too little = under-engaged, too much = anxiety impairs performance. Optimal arousal is LOWER for difficult tasks, HIGHER for easy/well-learned tasks.',
        'INCENTIVE THEORY: external rewards (incentives) PULL behavior, complementing the internal PUSH of drives. We are drawn toward positive incentives and away from negative ones.',
        'MASLOW\'S HIERARCHY OF NEEDS: needs arranged in a pyramid — PHYSIOLOGICAL → SAFETY → LOVE/BELONGING → ESTEEM → SELF-ACTUALIZATION (some versions add self-transcendence). Lower needs are generally prioritized before higher ones. Critique: the strict order is not universal across cultures or individuals.',
        'HUNGER as a case study: biological signals (blood glucose, the hormones GHRELIN [stimulates hunger] and LEPTIN [signals fullness]; the hypothalamus regulates appetite) AND psychosocial factors (culture, learned taste preferences, external cues, portion size). Set point / settling point ideas explain weight regulation.',
        'ACHIEVEMENT MOTIVATION: the desire to accomplish and master. INTRINSIC MOTIVATION (doing something for its own satisfaction) vs EXTRINSIC MOTIVATION (doing it for external rewards/avoiding punishment). The OVERJUSTIFICATION EFFECT: rewarding an already-intrinsically-enjoyed activity can REDUCE intrinsic interest.',
        'MOTIVATIONAL CONFLICTS: APPROACH-APPROACH (choose between two desirable options), AVOIDANCE-AVOIDANCE (choose between two undesirable options), APPROACH-AVOIDANCE (one option with both attractive and unattractive features).',
      ],
      vocabulary: [
        { term: 'drive-reduction theory', definition: 'a physiological need creates a drive that motivates restoring homeostasis.' },
        { term: 'Yerkes-Dodson law', definition: 'performance peaks at moderate arousal; optimal level is lower for hard tasks, higher for easy ones.' },
        { term: 'overjustification effect', definition: 'rewarding an intrinsically enjoyable activity can undermine intrinsic motivation.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'try-arousal',
      kind: 'try_yourself',
      problem:
        'A student is calm and bored during an easy quiz but performs well; on a hard final exam she is extremely anxious and performs poorly. Use arousal theory and the Yerkes-Dodson law to explain.',
      expectedAnswer:
        'AROUSAL THEORY says people perform best at an OPTIMAL level of arousal, and the YERKES-DODSON LAW specifies that this optimum DEPENDS ON TASK DIFFICULTY: optimal arousal is HIGHER for easy/well-learned tasks and LOWER for difficult/complex tasks. On the EASY quiz, even low arousal (calm/bored) is near-optimal for a simple task, so she performs well. On the HARD final, her EXTREMELY HIGH arousal (anxiety) is well above the LOW optimum that difficult tasks require, so performance suffers — too much arousal impairs complex cognitive work. Strong answers explicitly tie the difficulty of each task to the different optimal arousal levels (high optimum for easy, low optimum for hard).',
      responseFormat: 'free',
      hints: [
        'Performance is best at moderate arousal, not maximum.',
        'How does optimal arousal differ for easy vs hard tasks?',
        'Too much arousal hurts performance on difficult tasks.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-theories-synthesis',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A person who hasn\'t eaten all day (a) feels driven to find food, (b) is especially tempted by the smell of pizza, and (c) only starts thinking about a creative hobby once they\'re fed and safe. Identify the motivation theory that best explains each, and (d) classify the conflict if they must choose between two equally appealing restaurants.',
      expectedAnswer:
        '(a) "Driven to find food" by an unmet physiological need → DRIVE-REDUCTION THEORY: the hunger need creates a drive pushing them to restore homeostasis. (b) "Tempted by the smell of pizza" → INCENTIVE THEORY: an external stimulus (the appealing smell) PULLS behavior, beyond the internal push of hunger. (c) "Only pursues a creative hobby once fed and safe" → MASLOW\'S HIERARCHY: higher needs (esteem/self-actualization, e.g. a creative hobby) are pursued only after lower physiological and safety needs are met. (d) Choosing between two EQUALLY APPEALING restaurants = an APPROACH-APPROACH CONFLICT (two desirable options). Strong answers map each scenario to the correct theory (drive-reduction = internal push; incentive = external pull; Maslow = need ordering) and correctly name the approach-approach conflict.',
      responseFormat: 'frq',
      hints: [
        'Internal push from a need vs external pull from a reward — two different theories.',
        'Pursuing higher goals only after basics are met = whose hierarchy?',
        'Two desirable options = which conflict type?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Drive-reduction = internal push to restore homeostasis; incentive = external pull of rewards.',
        'Arousal theory + Yerkes-Dodson: best at moderate arousal; lower optimum for hard tasks.',
        'Maslow\'s hierarchy: physiological → safety → belonging → esteem → self-actualization.',
        'Hunger = biology (ghrelin/leptin, hypothalamus) + psychosocial cues.',
        'Intrinsic vs extrinsic motivation; overjustification effect; approach/avoidance conflicts.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.6',
    cedTitle: 'Motivation',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '11', note: 'Theories of motivation, hunger, achievement, conflicts.' },
    ],
  },
};
