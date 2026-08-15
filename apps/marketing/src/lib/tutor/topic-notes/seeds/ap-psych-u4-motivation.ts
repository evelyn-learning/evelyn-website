/**
 * AP Psychology — Unit 4 CED 4.6: Motivation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.motivation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_MOTIVATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.motivation.v1',
  course: 'AP Psychology',
  cedUnit: 4,
  cedTopic: '4.6',
  cedTitle: 'Motivation',
  planId: 'evelyn.ap.psych.motivation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.motivation.v1' }],
  theory: [
    { loId: 'appsych.motivation', content: `MOTIVATION = a need or desire that ENERGIZES and DIRECTS behavior. The theories each capture part of the truth: some behavior reduces a need, some seeks the right amount of stimulation, some chases rewards. The AP skill is applying the RIGHT theory to a given scenario.` },
    { loId: 'appsych.motivation', content: `INSTINCT THEORY: some behaviors are innate, unlearned FIXED PATTERNS. More useful for ANIMALS than humans — its weakness is that it NAMES behaviors without EXPLAINING them ("people fight because of an aggression instinct" is circular).` },
    { loId: 'appsych.motivation', content: `DRIVE-REDUCTION THEORY: a physiological NEED creates an aroused DRIVE that PUSHES the organism to reduce it and restore HOMEOSTASIS (internal balance). Chain: dehydration → thirst drive → drink → balance restored. Explains biological needs well, but CANNOT explain why we seek stimulation (thrill rides, curiosity) when all needs are already met.` },
    { loId: 'appsych.motivation', content: `AROUSAL THEORY: we are motivated to maintain an OPTIMAL level of arousal — sometimes SEEKING stimulation, not just reducing it. YERKES-DODSON LAW: performance is BEST at MODERATE arousal; too little = under-engaged, too much = anxiety impairs performance. CRITICAL REFINEMENT: the optimal level DEPENDS ON TASK DIFFICULTY — LOWER optimum for DIFFICULT tasks, HIGHER optimum for EASY or well-learned tasks. This inverted-U with task-difficulty shift is a heavily tested detail.` },
    { loId: 'appsych.motivation', content: `INCENTIVE THEORY: external rewards (incentives) PULL behavior, complementing the internal PUSH of drives. We are drawn TOWARD positive incentives and AWAY from negative ones. Contrast to remember: drive-reduction = push from inside; incentive = pull from outside. The smell of pizza tempting someone who is not even hungry is incentive at work.` },
    { loId: 'appsych.motivation', content: `MASLOW'S HIERARCHY OF NEEDS: a pyramid — PHYSIOLOGICAL → SAFETY → LOVE/BELONGING → ESTEEM → SELF-ACTUALIZATION (some versions add SELF-TRANSCENDENCE at the top). LOWER needs are generally prioritized before HIGHER ones: a starving person seeks food, not creative fulfillment. CRITIQUE: the strict ordering is NOT universal across cultures or individuals — artists create through poverty.` },
    { loId: 'appsych.motivation', content: `HUNGER — the case-study need. BIOLOGICAL signals: blood GLUCOSE levels; the hormone GHRELIN (secreted by an empty stomach, STIMULATES hunger) and LEPTIN (secreted by fat cells, SIGNALS FULLNESS); the HYPOTHALAMUS regulates appetite. PSYCHOSOCIAL factors: culture, learned taste preferences, external cues, portion size. SET POINT / settling point: the body defends a weight range, explaining weight regulation. Hunger questions want BOTH biology and psychology in the answer.` },
    { loId: 'appsych.motivation', content: `ACHIEVEMENT MOTIVATION: the desire to accomplish and master. INTRINSIC MOTIVATION — doing something for its OWN satisfaction. EXTRINSIC MOTIVATION — doing it for external rewards or to avoid punishment. OVERJUSTIFICATION EFFECT: rewarding an ALREADY-intrinsically-enjoyed activity can REDUCE intrinsic interest — pay a child to draw and drawing becomes "work."` },
    { loId: 'appsych.motivation', content: `MOTIVATIONAL CONFLICTS — three types: APPROACH-APPROACH — choose between TWO DESIRABLE options (two great restaurants). AVOIDANCE-AVOIDANCE — choose between TWO UNDESIRABLE options (do the chores or get grounded). APPROACH-AVOIDANCE — ONE option with BOTH attractive and unattractive features (a dream job in a city you hate). Count the options and their valence to classify.` },
    { loId: 'appsych.motivation', kind: 'definition', title: 'drive-reduction theory', content: `a physiological need creates a drive that motivates behavior to restore homeostasis.` },
    { loId: 'appsych.motivation', kind: 'definition', title: 'Yerkes-Dodson law', content: `performance peaks at moderate arousal; the optimal level is lower for hard tasks and higher for easy ones.` },
    { loId: 'appsych.motivation', kind: 'definition', title: 'overjustification effect', content: `rewarding an intrinsically enjoyable activity can undermine intrinsic motivation.` },
  ],
  methods: [
    {
      title: 'Apply Yerkes-Dodson to a performance scenario',
      steps: [
        `STEP 1 — Rate the AROUSAL level in the scenario (calm/bored = low; anxious/panicked = high).`,
        `STEP 2 — Rate the TASK DIFFICULTY (easy quiz vs hard final exam).`,
        `STEP 3 — Find the OPTIMUM for that task: easy/well-learned tasks tolerate (even benefit from) HIGH arousal; difficult/complex tasks need LOW-to-moderate arousal.`,
        `STEP 4 — Compare actual arousal to the optimum and predict performance. Calm on an easy quiz: low arousal is near-optimal for a simple task → performs well. Extremely anxious on a hard final: arousal far above the LOW optimum difficult tasks require → performance suffers.`,
        `STEP 5 — In your answer, EXPLICITLY tie task difficulty to the shifted optimum — that link is what graders look for.`,
      ],
      example: { problem: `A student is calm and bored during an easy quiz but performs well; on a hard final exam she is extremely anxious and performs poorly. Explain with arousal theory and the Yerkes-Dodson law.`, solution: `Performance peaks at an optimal arousal that depends on difficulty: high optimum for easy tasks, low for hard ones. Her low arousal suits the easy quiz; her extreme anxiety overshoots the low optimum the hard final requires, impairing complex cognitive work.` },
      relatedLoIds: ['appsych.motivation'],
    },
    {
      title: 'Match each scenario element to its motivation theory',
      steps: [
        `STEP 1 — Internal PUSH from an unmet physiological need ("driven to find food after not eating all day") → DRIVE-REDUCTION: the hunger need creates a drive to restore homeostasis.`,
        `STEP 2 — External PULL from a stimulus ("tempted by the smell of pizza") → INCENTIVE THEORY: the appealing smell pulls behavior beyond the internal push.`,
        `STEP 3 — Higher pursuits only AFTER basics are met ("thinks about a creative hobby once fed and safe") → MASLOW'S HIERARCHY: esteem/self-actualization wait on physiological and safety needs.`,
        `STEP 4 — Classify any CONFLICT by counting options and valence: two equally appealing restaurants = APPROACH-APPROACH (two desirable options).`,
      ],
      example: { problem: `A person who hasn't eaten all day (a) feels driven to find food, (b) is tempted by the smell of pizza, (c) only considers a creative hobby once fed and safe, and (d) must choose between two equally appealing restaurants. Name the theory or conflict for each.`, solution: `(a) Drive-reduction (internal push toward homeostasis). (b) Incentive theory (external pull). (c) Maslow's hierarchy (lower needs first). (d) Approach-approach conflict.` },
      relatedLoIds: ['appsych.motivation'],
    },
  ],
  pointers: [
    { content: `Drive-reduction = internal PUSH to restore homeostasis; incentive = external PULL of rewards. Many scenarios need both.`, kind: 'tip' },
    { content: `Yerkes-Dodson: inverted U — moderate arousal is best, and the optimum is LOWER for hard tasks, HIGHER for easy ones.`, kind: 'tip' },
    { content: `Hunger hormones: GHRELIN = growls/gets hungry; LEPTIN = fullness. Hypothalamus regulates both signals.`, kind: 'tip' },
    { content: `Overjustification: reward an activity someone already loves and intrinsic interest DROPS.`, kind: 'tip' },
    { content: `Conflicts: approach-approach (two goods), avoidance-avoidance (two bads), approach-avoidance (one option, mixed).`, kind: 'tip' },
    { content: `Instinct theory's flaw: it labels behavior without explaining it — a classic MCQ distractor.`, kind: 'tip' },
  ],
};
