/**
 * AP Psychology — Unit 3 CED 3.9: Social, Cognitive, and Neurological Factors in Learning.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.observational-learning.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_OBSERVATIONAL_LEARNING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.observational-learning.v1',
  course: 'AP Psychology',
  cedUnit: 3,
  cedTopic: '3.9',
  cedTitle: 'Social, Cognitive, and Neurological Factors in Learning',
  planId: 'evelyn.ap.psych.observational-learning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.observational-learning.v1' }],
  theory: [
    { loId: 'appsych.observational-learning', content: `OBSERVATIONAL LEARNING (modeling): learning by WATCHING and IMITATING others — no direct reinforcement required. This is the third major learning framework after classical (association) and operant (consequence) conditioning, and it adds a COGNITIVE and SOCIAL dimension that strict behaviorism excluded.` },
    { loId: 'appsych.observational-learning', content: `BANDURA'S BOBO DOLL EXPERIMENT (1961): children aged 3-6 watched an adult interact with an inflatable Bobo doll. One condition saw an AGGRESSIVE model (hitting, kicking, yelling at the doll); the other saw a nonaggressive model who ignored it. When later allowed to play with the doll, children who had watched the aggressive model were FAR MORE likely to imitate the aggression — down to the SPECIFIC words and kicks. Conclusion: behavior can be LEARNED WITHOUT direct reinforcement, purely by observation.` },
    { loId: 'appsych.observational-learning', content: `BANDURA'S FOUR COMPONENTS of observational learning (memorize the order): (1) ATTENTION — the observer must actually watch the model; (2) RETENTION — the observer must remember what was observed; (3) REPRODUCTION — the observer must be physically capable of performing the action; (4) MOTIVATION — the observer must have a reason to perform it. All four are required; a failure at any step blocks imitation.` },
    { loId: 'appsych.observational-learning', content: `VICARIOUS REINFORCEMENT and VICARIOUS PUNISHMENT: seeing OTHERS rewarded or punished changes the observer's own likelihood of imitating. A model who is rewarded makes imitation MORE likely; a punished model makes it LESS likely. This feeds the MOTIVATION component — the observer learns the consequence secondhand.` },
    { loId: 'appsych.observational-learning', content: `REAL-WORLD IMPLICATIONS: children learn aggression, generosity, language, and manners largely by OBSERVING parents, peers, and media. Prosocial programming (Sesame Street, Mr. Rogers) builds positive behaviors through modeling. The violent-media debate: research suggests SOME increase in aggressive behavior from violent content, but the effect is MODEST and contested. CRITICISMS of Bobo: children may have inferred aggression toward a doll was permitted, demand characteristics, and a doll is not a person — but subsequent research confirmed observational learning is real.` },
    { loId: 'appsych.observational-learning', content: `LATENT LEARNING (Tolman): learning that occurs WITHOUT reinforcement and stays hidden until there is a reason to show it. Tolman's rats explored a maze for days with NO food reward; when food appeared at the end, they immediately ran the maze fast — they had formed COGNITIVE MAPS during unrewarded exploration. Punchline: reinforcement is necessary for PERFORMANCE, not for LEARNING. This directly challenges strict behaviorism.` },
    { loId: 'appsych.observational-learning', content: `INSIGHT LEARNING (Kohler): the SUDDEN realization of a solution — the "Aha!" moment — rather than gradual trial-and-error. Kohler's chimpanzees, facing a banana out of reach with boxes and sticks available, would pause, then abruptly stack the boxes or use the stick. Evidence of internal cognitive processing; brain imaging shows a spike of right-temporal-lobe activity at the moment of insight.` },
    { loId: 'appsych.observational-learning', content: `MIRROR NEURONS (Rizzolatti, 1990s, first in macaque monkeys): neurons in the MOTOR CORTEX that fire BOTH when an organism PERFORMS an action AND when it merely OBSERVES another performing the same action. Proposed neural mechanism for IMITATION, EMPATHY, and THEORY OF MIND — a plausible biological basis for observational learning. Caution for the exam: their EXISTENCE is well supported; some claimed implications (e.g. mirror-neuron dysfunction as the cause of autism) remain CONTROVERSIAL.` },
    { loId: 'appsych.observational-learning', content: `BIOLOGICAL CONSTRAINTS on learning: not all associations are equally learnable. PREPARED LEARNING — evolution makes some connections fast to acquire (taste aversion, fear of snakes and spiders) and others slow. Counter-conditioning works better with some stimulus pairings than others. Learning theories operate WITHIN biological limits.` },
    { loId: 'appsych.observational-learning', kind: 'definition', title: 'vicarious reinforcement', content: `an increase in the observer's imitation because the MODEL was seen being rewarded; vicarious punishment is the decrease when the model is punished.` },
    { loId: 'appsych.observational-learning', kind: 'definition', title: 'latent learning', content: `learning acquired without reinforcement that remains hidden until motivation makes demonstrating it worthwhile (Tolman's cognitive maps).` },
    { loId: 'appsych.observational-learning', kind: 'definition', title: 'mirror neurons', content: `motor-cortex neurons that fire both when performing an action and when observing another perform it; candidate neural basis for imitation and empathy.` },
  ],
  methods: [
    {
      title: 'Apply Bandura\'s four components to an imitation scenario',
      steps: [
        `STEP 1 — ATTENTION: confirm the observer actually watched the model's behavior.`,
        `STEP 2 — RETENTION: confirm the observer remembers the behavior-consequence sequence.`,
        `STEP 3 — REPRODUCTION: confirm the observer is physically capable of performing the action.`,
        `STEP 4 — MOTIVATION: identify the reason to perform — often VICARIOUS REINFORCEMENT (the model was rewarded) or vicarious punishment (which suppresses imitation).`,
        `STEP 5 — Predict the outcome: with all four present, expect imitation even WITHOUT any direct reinforcement of the observer.`,
      ],
      example: {
        problem: `A child sees a sibling get a cookie for sharing toys. Apply Bandura's observational learning.`,
        solution: `ATTENTION — child observes the sharing; RETENTION — remembers sharing led to a cookie; REPRODUCTION — can physically share toys; MOTIVATION — wants the same reward. The sibling's cookie is VICARIOUS REINFORCEMENT, so the child shares more in the future without ever being directly rewarded. Had the sibling been punished, imitation would drop (vicarious punishment).`,
      },
      relatedLoIds: ['appsych.observational-learning'],
    },
    {
      title: 'Distinguish latent learning, insight, and conditioning in a scenario',
      steps: [
        `STEP 1 — Ask whether learning happened WITHOUT reinforcement and appeared only once a reward was introduced → LATENT LEARNING (cognitive map formed earlier).`,
        `STEP 2 — Ask whether the solution arrived SUDDENLY after a pause, not by gradual trial-and-error → INSIGHT.`,
        `STEP 3 — Ask whether behavior changed because of paired stimuli (classical) or direct consequences (operant) → conditioning, not a cognitive account.`,
        `STEP 4 — State the theoretical stake: latent learning and insight show reinforcement is needed for PERFORMANCE, not LEARNING — a direct challenge to strict behaviorism (Skinner).`,
      ],
      example: {
        problem: `Tolman's rats explored a maze for 10 days with no food. On day 11 food appeared at the end, and they ran it faster than rats rewarded all along. What is this, and what does it show?`,
        solution: `LATENT LEARNING. The rats built COGNITIVE MAPS during unrewarded exploration; the food only motivated them to display the learning. Shows learning is cognitive and does not require reinforcement — reinforcement drives performance, challenging strict behaviorism.`,
      },
      relatedLoIds: ['appsych.observational-learning'],
    },
  ],
  pointers: [
    { content: `Bandura's four components in order: attention → retention → reproduction → motivation. All four required.`, kind: 'tip' },
    { content: `Bobo doll's punchline: learning without direct reinforcement — children imitated the model's exact words and kicks.`, kind: 'tip' },
    { content: `Vicarious reinforcement feeds the motivation step: a rewarded model gets imitated, a punished one does not.`, kind: 'tip' },
    { content: `Latent learning (Tolman): reinforcement is for PERFORMANCE, not learning — cognitive maps form without rewards.`, kind: 'tip' },
    { content: `Insight (Kohler's chimps) = sudden "Aha!" solution after a pause, not gradual trial-and-error.`, kind: 'tip' },
    { content: `Mirror neurons exist (strong evidence); sweeping claims like autism causation are controversial — hedge on the exam.`, kind: 'tip' },
  ],
};
