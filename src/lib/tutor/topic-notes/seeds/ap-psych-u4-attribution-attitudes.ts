/**
 * AP Psychology — Unit 4 CED 4.1-4.2: Attribution, Person Perception, and Attitudes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.attribution-attitudes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_ATTRIBUTION_ATTITUDES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.attribution-attitudes.v1',
  course: 'AP Psychology',
  cedUnit: 4,
  cedTopic: '4.1-4.2',
  cedTitle: 'Attribution, Person Perception, and Attitudes',
  planId: 'evelyn.ap.psych.attribution-attitudes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.attribution-attitudes.v1' }],
  theory: [
    { loId: 'appsych.attribution-attitudes', content: `ATTRIBUTION THEORY (Heider): we explain behavior using one of two causes. DISPOSITIONAL (internal) — personality, traits, character. SITUATIONAL (external) — circumstances, environment, role. Every attribution question on the AP exam reduces to identifying WHICH cause the person assigned and WHETHER the assignment is biased.` },
    { loId: 'appsych.attribution-attitudes', content: `FUNDAMENTAL ATTRIBUTION ERROR (FAE): the tendency to OVERESTIMATE dispositional and UNDERESTIMATE situational causes when explaining OTHERS' behavior. Example: a friend is late → "she's irresponsible" (dispositional) rather than "she got stuck in traffic" (situational). CULTURAL note: FAE is STRONGER in INDIVIDUALIST cultures (US, UK) and WEAKER in COLLECTIVIST cultures (East Asia). We do NOT make this error about ourselves — we attribute OUR OWN failures to the situation.` },
    { loId: 'appsych.attribution-attitudes', content: `ACTOR-OBSERVER BIAS: as OBSERVER (watching others), we make DISPOSITIONAL attributions; as ACTOR (doing the thing ourselves), we make SITUATIONAL attributions. Why: when observing others, THEIR ACTION is perceptually salient (foreground); when acting ourselves, the SITUATION is what we see.` },
    { loId: 'appsych.attribution-attitudes', content: `SELF-SERVING BIAS: we attribute our SUCCESSES to dispositional causes (our skill, intelligence) and our FAILURES to situational causes (bad luck, unfair test). Function: PROTECTS SELF-ESTEEM. In COLLECTIVIST cultures this is sometimes REVERSED — humble attributions for the self, generous attributions for others.` },
    { loId: 'appsych.attribution-attitudes', content: `JUST-WORLD HYPOTHESIS: the belief that the world is FAIR and people GET WHAT THEY DESERVE. It is comforting (good things happen to good people) but LEADS TO VICTIM-BLAMING — "they must have done something" — e.g., blaming poverty on personal failings rather than structural causes. Often NOT conscious; it serves to protect the belief in a fair world.` },
    { loId: 'appsych.attribution-attitudes', content: `ATTITUDES: beliefs and evaluations of objects, events, or people. THREE COMPONENTS — COGNITIVE (beliefs: chocolate is delicious), AFFECTIVE (feelings: I like chocolate), BEHAVIORAL (actions: I eat chocolate). The components can MISALIGN: "I should exercise" (cognitive) while sitting on the couch (behavioral). Misalignment between attitude and behavior is exactly what triggers dissonance.` },
    { loId: 'appsych.attribution-attitudes', content: `COGNITIVE DISSONANCE (Festinger, 1957): UNCOMFORTABLE psychological tension that arises when behavior CONTRADICTS beliefs or attitudes. THREE ways to reduce the tension: (1) CHANGE BEHAVIOR (quit smoking), (2) CHANGE ATTITUDE (decide smoking isn't that bad), (3) ADD JUSTIFICATION (rationalize: "everyone smokes," "I'll quit later"). Most people reach for (2) or (3) first because (1) is hardest.` },
    { loId: 'appsych.attribution-attitudes', content: `CLASSIC DISSONANCE EXPERIMENT (Festinger and Carlsmith, 1959): subjects performed a boring task, then were paid either ONE DOLLAR or TWENTY DOLLARS to tell the next subject it was fun. The twenty-dollar payment is SUFFICIENT external justification for the lie — no dissonance, NO attitude change. The one-dollar payment is INSUFFICIENT justification — dissonance! That group later REPORTED LIKING the task more (they changed their attitude to match their behavior). KEY COUNTER-INTUITIVE RESULT: the SMALLER reward produced the LARGER attitude change. When behavior feels freely chosen, people change beliefs to match it.` },
    { loId: 'appsych.attribution-attitudes', content: `FOOT-IN-THE-DOOR PHENOMENON: agreeing to a SMALL request makes you more likely to agree to a LARGE request later. Dissonance mechanism: "I helped before, so I must like helping" → bigger help. Persuasion techniques generally exploit dissonance and attribution biases — small, insufficient inducements create LASTING attitude change.` },
    { loId: 'appsych.attribution-attitudes', kind: 'definition', title: 'fundamental attribution error', content: `overestimating dispositional and underestimating situational factors when explaining OTHERS' behavior.` },
    { loId: 'appsych.attribution-attitudes', kind: 'definition', title: 'self-serving bias', content: `attributing one's successes internally (skill) and failures externally (luck, unfair circumstances).` },
    { loId: 'appsych.attribution-attitudes', kind: 'definition', title: 'cognitive dissonance', content: `tension when behavior contradicts attitudes; reduced by changing behavior, changing the attitude, or adding justification.` },
  ],
  methods: [
    {
      title: 'Apply FAE to a behavior and find the situational alternative',
      steps: [
        `STEP 1 — State the likely FAE attribution. A teacher sees a student fall asleep in class → "this student is LAZY / uninterested" (dispositional).`,
        `STEP 2 — Generate SITUATIONAL alternatives: student worked a night shift to support family; insomnia or medical issue; classroom too warm plus no breakfast; hidden circumstances we don't know.`,
        `STEP 3 — Trace the CONSEQUENCES of the error: student reprimanded for "laziness"; trust damaged; the real cause never addressed; relationship suffers.`,
        `STEP 4 — DEBIAS: assume situational factors FIRST; ask "why" privately instead of assuming. A situational mindset produces better outcomes.`,
      ],
      example: { problem: `A teacher sees a student fall asleep in class. Apply the fundamental attribution error to predict the teacher's attribution, and give the alternative.`, solution: `FAE → the teacher assumes disposition ("lazy"). The alternative is situational (night shift, illness, environment). Debias by asking, not assuming.` },
      relatedLoIds: ['appsych.attribution-attitudes'],
    },
    {
      title: 'Analyze a dissonance scenario (Festinger framework)',
      steps: [
        `STEP 1 — NAME the tension. A long-time smoker reads that smoking causes lung cancer and feels uncomfortable → that discomfort IS cognitive dissonance: belief ("I want to be healthy") contradicts behavior (smoking).`,
        `STEP 2 — List the THREE reduction routes: (1) CHANGE BEHAVIOR — quit smoking (hardest, most direct); (2) CHANGE ATTITUDE — "most studies are exaggerated," "my grandfather smoked into his eighties"; (3) ADD JUSTIFICATION — "everyone smokes," "stress kills more than cigarettes."`,
        `STEP 3 — PREDICT which route is taken. Most people initially choose (2) or (3) rather than (1), because changing behavior requires acknowledging the dissonance head-on.`,
        `STEP 4 — For experiment questions, check the EXTERNAL JUSTIFICATION: sufficient reward (twenty dollars) → no dissonance → no attitude change; insufficient reward (one dollar) → dissonance → attitude shifts to match behavior.`,
      ],
      example: { problem: `In Festinger's experiment, why did the group paid ONE dollar change their attitude toward the boring task while the group paid TWENTY dollars did not?`, solution: `The twenty-dollar group had sufficient external justification ("I lied for the money") — no dissonance. The one-dollar group could not rationalize the lie, felt dissonance, and resolved it by deciding the task wasn't so boring. Less external justification → more attitude change.` },
      relatedLoIds: ['appsych.attribution-attitudes'],
    },
  ],
  pointers: [
    { content: `Dispositional = personality/traits; situational = circumstances. FAE = overweighting disposition in OTHERS.`, kind: 'tip' },
    { content: `Self-serving bias: success internal, failure external. Protects self-esteem; sometimes reversed in collectivist cultures.`, kind: 'tip' },
    { content: `Just-world hypothesis → victim-blaming ("they must have deserved it").`, kind: 'tip' },
    { content: `Dissonance reduced 3 ways: change behavior, change attitude, add justification.`, kind: 'tip' },
    { content: `Festinger one-dollar vs twenty-dollar result is COUNTER-INTUITIVE: smaller reward → bigger attitude change.`, kind: 'tip' },
    { content: `Foot-in-the-door: small yes now → big yes later, via "I must like helping" self-attribution.`, kind: 'tip' },
  ],
};
