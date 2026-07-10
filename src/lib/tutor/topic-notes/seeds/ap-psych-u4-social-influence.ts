/**
 * AP Psychology — Unit 4 CED 4.3: Psychology of Social Situations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.social-influence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_SOCIAL_INFLUENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.social-influence.v1',
  course: 'AP Psychology',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Psychology of Social Situations',
  planId: 'evelyn.ap.psych.social-influence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.social-influence.v1' }],
  theory: [
    { loId: 'appsych.social-influence', content: `CONFORMITY: changing behavior or beliefs to match a GROUP. ASCH'S LINE STUDY (1955): a real subject plus five to seven confederates compared three lines to a standard; the confederates unanimously gave the WRONG answer. On about 37 percent of trials, real subjects CONFORMED to the wrong answer, and about 75 percent of subjects conformed at least ONCE. Point: people conform even when the answer is OBVIOUSLY WRONG. Conformity is HIGHER when: the group has three to five or more members, the group is UNANIMOUS, there are NO ALLIES, the response is PUBLIC, and the task is AMBIGUOUS.` },
    { loId: 'appsych.social-influence', content: `TWO TYPES OF SOCIAL INFLUENCE: NORMATIVE — conform to FIT IN and avoid rejection; produces public compliance while private disagreement may persist. INFORMATIONAL — conform to BE RIGHT, accepting the group as a valid information source; produces private internalization. AP loves asking which type a scenario shows: check whether the person privately believes the group.` },
    { loId: 'appsych.social-influence', content: `OBEDIENCE: changing behavior in response to a DIRECT COMMAND from AUTHORITY. MILGRAM'S OBEDIENCE STUDY (1961-63): subjects were told to administer "shocks" to a "learner" (a confederate) for wrong answers, escalating from 15V to 450V. As shocks increased, the learner screamed, banged on the wall, and eventually went SILENT; the experimenter insisted "the experiment requires you continue." RESULT: 65 percent of subjects continued to the maximum 450V — even after the learner went silent. Many showed visible DISTRESS but continued. The experimenter's authority plus situational pressure overrode personal conscience. Conducted just after the Holocaust; it helped explain how ordinary people committed atrocities.` },
    { loId: 'appsych.social-influence', content: `OBEDIENCE FACTORS (what raises or lowers it): CLOSER VICTIM → less obedience. PHYSICAL DISTANCE FROM AUTHORITY → less obedience. PRESTIGE OF INSTITUTION → more obedience. A DISSENTING PEER → HUGE reduction in obedience (from 65 percent to roughly 10 percent with one defying peer). FOOT-IN-THE-DOOR gradual escalation makes refusal harder at every step.` },
    { loId: 'appsych.social-influence', content: `BYSTANDER EFFECT (Darley and Latane, 1968): the MORE bystanders present, the LESS LIKELY any individual is to help. Triggered by the 1964 Kitty Genovese case (allegedly 38 witnesses ignored the attack — details later disputed). TWO mechanisms: DIFFUSION OF RESPONSIBILITY — each person assumes someone else will help; PLURALISTIC IGNORANCE — seeing others' inaction, each interprets the situation as not requiring help. Numbers to know: a SOLO observer helps about 75 percent of the time; with five bystanders, only about 38 percent. OVERCOMING it: directly call on a SPECIFIC person ("YOU, in the blue shirt — call 911").` },
    { loId: 'appsych.social-influence', content: `SOCIAL FACILITATION: the presence of others IMPROVES performance on EASY or well-learned tasks but IMPAIRS performance on HARD or new tasks. SOCIAL LOAFING: people exert LESS effort in group tasks because each individual's contribution is less identifiable; bigger groups → less individual effort. Don't confuse them — facilitation is about an AUDIENCE affecting quality, loafing is about SHARED WORK reducing effort.` },
    { loId: 'appsych.social-influence', content: `DEINDIVIDUATION: LOSS OF SELF-AWARENESS in a group. Anonymity plus arousal → uncharacteristic behavior. Classic contexts: riots, mob violence, online trolling.` },
    { loId: 'appsych.social-influence', content: `GROUP POLARIZATION: discussion among LIKE-MINDED people INTENSIFIES their initial views — the group becomes MORE EXTREME than any individual started. Example: an online forum of conspiracy theorists radicalizes its members.` },
    { loId: 'appsych.social-influence', content: `GROUPTHINK (Janis): in cohesive groups, the desire for HARMONY OVERRIDES rational evaluation of alternatives. Historical cases: Bay of Pigs, Challenger disaster. Symptoms: illusion of invulnerability, rationalization, suppression of dissent, mindguarding. PROTECTIONS: assign a devil's advocate, invite outside experts, anonymous polling before discussion, leader withholds opinion until others speak, evaluate multiple alternative plans, run a pre-mortem.` },
    { loId: 'appsych.social-influence', kind: 'definition', title: 'conformity', content: `changing behavior or beliefs to match a group.` },
    { loId: 'appsych.social-influence', kind: 'definition', title: 'obedience', content: `compliance with a direct command from an authority figure.` },
    { loId: 'appsych.social-influence', kind: 'definition', title: 'bystander effect', content: `the larger the group of witnesses, the less likely any individual is to help (diffusion of responsibility plus pluralistic ignorance).` },
  ],
  methods: [
    {
      title: 'Predict obedience from a Milgram variant',
      steps: [
        `STEP 1 — Identify WHICH factor the variant changes: authority cues (lab coat, prestige), distance from victim, distance from authority, or presence of dissenting peers.`,
        `STEP 2 — Apply the direction: weaker authority cues → LESS obedience. In Milgram's actual variant, an experimenter in street clothes produced substantially lower obedience — AUTHORITY CUES, not just the authority figure, drive obedience.`,
        `STEP 3 — Dissenting PEERS are the strongest reducer: with one defying peer, obedience dropped from 65 percent to about 10 percent; two defying peers reduced it further. SOCIAL ALLIES enable individual courage — dissent creates permission to refuse.`,
        `STEP 4 — State the implication: ordinary people CAN resist if SUPPORTED. Resistance is contagious.`,
      ],
      example: { problem: `In Milgram's study, 65 percent of subjects went to 450V. Predict what happens if (a) the experimenter is present but not in a lab coat, and (b) two other "teachers" refuse to continue.`, solution: `(a) Less prestige → less obedience (street-clothes variant dropped substantially). (b) Dissenting peers dramatically reduce obedience — allies make refusal possible.` },
      relatedLoIds: ['appsych.social-influence'],
    },
    {
      title: 'Diagnose a group phenomenon from a scenario',
      steps: [
        `STEP 1 — Ask: is the group getting MORE EXTREME through discussion among like-minded members? → GROUP POLARIZATION.`,
        `STEP 2 — Is a COHESIVE group suppressing dissent to preserve harmony while making a bad decision? → GROUPTHINK.`,
        `STEP 3 — Are ANONYMOUS, aroused individuals losing self-awareness and acting uncharacteristically? → DEINDIVIDUATION.`,
        `STEP 4 — Is individual EFFORT dropping as group size grows because contributions aren't identifiable? → SOCIAL LOAFING. (If an audience changes performance quality on easy vs hard tasks, that's SOCIAL FACILITATION instead.)`,
        `STEP 5 — Is nobody HELPING in an emergency because others are present? → BYSTANDER EFFECT (diffusion of responsibility plus pluralistic ignorance).`,
      ],
      example: { problem: `Identify the phenomenon: (a) an online forum radicalizes members' views; (b) JFK's advisors all agreed to the Bay of Pigs despite private doubts; (c) an anonymous mob turns destructive; (d) a bigger project team means less effort per person.`, solution: `(a) Group polarization. (b) Groupthink. (c) Deindividuation. (d) Social loafing.` },
      relatedLoIds: ['appsych.social-influence'],
    },
  ],
  pointers: [
    { content: `Asch numbers: about 37 percent of trials conformed; about 75 percent of subjects conformed at least once.`, kind: 'tip' },
    { content: `Milgram number: 65 percent obeyed to the maximum 450V. One dissenting peer → about 10 percent.`, kind: 'tip' },
    { content: `Normative influence = fit in (public compliance); informational = be right (private acceptance).`, kind: 'tip' },
    { content: `Bystander effect = diffusion of responsibility + pluralistic ignorance. Beat it by singling out ONE person.`, kind: 'tip' },
    { content: `Facilitation: audience helps EASY tasks, hurts HARD ones. Loafing: group work shrinks individual effort.`, kind: 'tip' },
    { content: `Polarization = like-minded group grows more extreme; groupthink = harmony beats rational analysis.`, kind: 'tip' },
  ],
};
