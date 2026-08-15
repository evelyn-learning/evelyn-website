/** AP Psychology — Unit 5 CED 5.4: Categories of Psychological Disorders: Anxiety, OCD, Trauma.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.anxiety-disorders.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_ANXIETY_DISORDERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.anxiety-disorders.v1',
  course: 'AP Psychology',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Categories of Psychological Disorders: Anxiety, OCD, Trauma',
  planId: 'evelyn.ap.psych.anxiety-disorders.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.anxiety-disorders.v1' }],
  theory: [
    { loId: 'appsych.anxiety-disorders', content: `GENERALIZED ANXIETY DISORDER (GAD): persistent, UNCONTROLLABLE worry about MULTIPLE areas of life lasting more than SIX MONTHS, with physical symptoms (muscle tension, fatigue, sleep disruption). The anxiety is FREE-FLOATING — not tied to any specific stimulus. Lifetime prevalence roughly 3 percent.` },
    { loId: 'appsych.anxiety-disorders', content: `PANIC DISORDER: recurrent SUDDEN PANIC ATTACKS — episodes of intense fear with strong physical symptoms (racing heart, difficulty breathing, dizziness, feelings of "going crazy" or dying), often misinterpreted as a heart attack. Key diagnostic marker: ANTICIPATORY ANXIETY about future attacks, which often leads to AVOIDANCE of places where attacks occurred. Lifetime prevalence roughly 3 percent.` },
    { loId: 'appsych.anxiety-disorders', content: `PHOBIAS: SPECIFIC phobias are irrational fears of a particular object or situation (spiders, flying, heights, blood) — the MOST COMMON anxiety disorder at about 12 percent lifetime. SOCIAL ANXIETY DISORDER (social phobia): fear of social judgment and scrutiny. AGORAPHOBIA: fear of places where escape is difficult (crowds, public transportation, being alone away from home) — often COMORBID with panic disorder.` },
    { loId: 'appsych.anxiety-disorders', content: `OBSESSIVE-COMPULSIVE DISORDER (OCD): OBSESSIONS are intrusive, recurrent THOUGHTS (germs, harm, order); COMPULSIONS are repetitive BEHAVIORS (washing, checking, counting) performed to reduce the anxiety the obsessions create. Patients KNOW the behavior is excessive but cannot stop; the ritual must be TIME-CONSUMING (over an hour a day) and impairing. Originally classified with anxiety disorders; now its OWN DSM-5 category. Prevalence roughly 1 to 2 percent.` },
    { loId: 'appsych.anxiety-disorders', content: `POST-TRAUMATIC STRESS DISORDER (PTSD): follows exposure to a TRAUMATIC event (combat, assault, disaster). Four symptom clusters: (1) INTRUSIVE memories — flashbacks, nightmares; (2) AVOIDANCE of trauma reminders; (3) NEGATIVE alterations in cognition and mood; (4) HYPERAROUSAL — jumpiness, irritability, sleep problems. Duration must exceed ONE MONTH after the trauma. Lifetime prevalence about 7 percent, far higher in combat veterans (15 to 30 percent).` },
    { loId: 'appsych.anxiety-disorders', content: `BIOLOGICAL EXPLANATIONS: genetics (heritability roughly 30 to 40 percent); neurotransmitters — LOW GABA (the calming inhibitory transmitter), HIGH norepinephrine (arousal), serotonin imbalances; brain-level — a HYPERACTIVE AMYGDALA (fear circuit) with DAMPENED PREFRONTAL regulation (weakened top-down control).` },
    { loId: 'appsych.anxiety-disorders', content: `COGNITIVE EXPLANATIONS (Beck): CATASTROPHIC THINKING and an ATTENTION BIAS TOWARD THREAT — anxious people over-interpret ambiguous events as dangerous. Distorted thinking patterns maintain the anxiety.` },
    { loId: 'appsych.anxiety-disorders', content: `BEHAVIORAL (LEARNING) EXPLANATIONS: fears are CLASSICALLY CONDITIONED (the Little Albert principle — a neutral stimulus paired with something aversive becomes fear-evoking), and avoidance is maintained by NEGATIVE REINFORCEMENT: avoiding the feared stimulus reduces anxiety, which STRENGTHENS the avoidance and prevents extinction. PSYCHODYNAMIC view (unresolved unconscious conflict) is noted but controversial; EVOLUTIONARY view — ancient threat-detection circuits now misfire on modern stimuli.` },
    { loId: 'appsych.anxiety-disorders', content: `TREATMENTS: CBT (cognitive-behavioral therapy) is the GOLD STANDARD for most anxiety disorders. EXPOSURE therapy — gradually facing fears until anxiety extinguishes (systematic desensitization). EXPOSURE AND RESPONSE PREVENTION (ERP) for OCD — face the trigger AND resist the compulsion. Medications: SSRIs and SNRIs. Also relaxation training and mindfulness-based therapies. For PTSD specifically: CBT, prolonged exposure, EMDR (eye movement desensitization and reprocessing), SSRIs.` },
    { loId: 'appsych.anxiety-disorders', kind: 'definition', title: 'obsessions vs compulsions', content: `obsessions = intrusive recurrent THOUGHTS; compulsions = repetitive BEHAVIORS performed to relieve the anxiety the obsessions cause.` },
    { loId: 'appsych.anxiety-disorders', kind: 'definition', title: 'panic attack', content: `a sudden surge of intense fear with autonomic symptoms (racing heart, breathlessness, dizziness) peaking within minutes; recurrent unexpected attacks + worry about more attacks = panic disorder.` },
    { loId: 'appsych.anxiety-disorders', kind: 'definition', title: 'PTSD', content: `disorder following trauma with intrusive memories, avoidance, negative mood/cognition changes, and hyperarousal lasting over one month.` },
  ],
  methods: [
    {
      title: 'Diagnose an anxiety-family disorder from a scenario',
      when_to_use: 'Any vignette asking which anxiety/OCD/trauma disorder is described.',
      steps: [
        `STEP 1 — Look for the SIGNATURE feature: broad chronic worry (over six months, many life areas) = GAD; sudden unexpected attacks with body symptoms = PANIC DISORDER; one specific feared object/situation = SPECIFIC PHOBIA; fear of judgment = SOCIAL ANXIETY; intrusive thoughts + rituals = OCD; identifiable trauma + flashbacks/avoidance/hyperarousal = PTSD.`,
        `STEP 2 — Confirm with duration and impairment: GAD needs over six months; PTSD needs over one month post-trauma; OCD rituals consume over an hour a day.`,
        `STEP 3 — Run the DIFFERENTIAL: rule out lookalikes explicitly (e.g. checking rituals are OCD, not GAD — the anxiety is specific; the patient's insight that it is irrational rules out psychosis).`,
        `STEP 4 — Name the mechanism if asked: obsession creates anxiety, compulsion relieves it, NEGATIVE REINFORCEMENT locks in the cycle.`,
        `STEP 5 — Attach the evidence-based treatment: ERP + SSRIs for OCD; exposure for phobias; CBT (+ SSRIs) for GAD and panic; CBT/EMDR/exposure + SSRIs for PTSD.`,
      ],
      example: {
        problem: `A patient says: "I can't leave my house without checking the stove 7 times. I know it's irrational, but if I don't, I feel intense anxiety." Diagnose and explain.`,
        solution: `OCD. Obsession = intrusive thought about the stove causing harm; compulsion = ritualistic checking. The compulsion temporarily reduces anxiety (negative reinforcement), which reinforces the cycle. Insight ("I know it's irrational") rules out psychosis; specificity rules out GAD. Treatment: exposure and response prevention (gold standard) plus SSRIs.`,
      },
      relatedLoIds: ['appsych.anxiety-disorders'],
    },
    {
      title: 'Explain an anxiety disorder from one biological and one psychological angle',
      when_to_use: 'FRQ items asking you to apply multiple perspectives to a case (classic with PTSD).',
      steps: [
        `STEP 1 — BIOLOGICAL: name a brain/chemical mechanism — hyperactive AMYGDALA primed by trauma, dampened PREFRONTAL regulation, or neurotransmitter changes (norepinephrine up, GABA down).`,
        `STEP 2 — BEHAVIORAL: apply CLASSICAL CONDITIONING — the trauma (unconditioned stimulus) was paired with situational cues (sounds, smells) that became conditioned stimuli triggering the fear response; then NEGATIVE REINFORCEMENT — avoiding triggers reduces anxiety and strengthens avoidance.`,
        `STEP 3 — COGNITIVE (alternative psychological angle): cite distortions like survivor guilt ("I should have done more") or "the world is unsafe."`,
        `STEP 4 — Integrate: biological vulnerability + traumatic experience + cognitive interpretation together produce the disorder; treatments pair medication (SSRIs) with psychotherapy (CBT, prolonged exposure, EMDR).`,
      ],
      example: {
        problem: `A combat veteran develops PTSD. Apply one biological and one psychological explanation.`,
        solution: `Biological: trauma primed a hyperactive amygdala with weakened prefrontal control, so triggers now fire an outsized fear response. Psychological: combat stimuli were classically conditioned to the trauma, and avoiding reminders is negatively reinforced (anxiety drops), maintaining the disorder. Integrated treatment: SSRIs plus exposure-based therapy or EMDR.`,
      },
      relatedLoIds: ['appsych.anxiety-disorders'],
    },
  ],
  pointers: [
    { content: 'GAD = broad chronic worry; panic = sudden attacks; phobia = one specific fear; OCD = thoughts + rituals; PTSD = trauma + intrusion/avoidance/hyperarousal.', kind: 'tip' },
    { content: 'Compulsions are negatively reinforced: they relieve obsession-anxiety, which locks in the cycle.', kind: 'tip' },
    { content: 'Anxiety chemistry: LOW GABA (calming), HIGH norepinephrine; hyperactive amygdala + weak prefrontal control.', kind: 'tip' },
    { content: 'CBT is the gold standard; ERP specifically for OCD; exposure for phobias — all work via extinction of conditioned fear.', kind: 'tip' },
    { content: 'Specific phobias are the MOST common anxiety disorder (about 12 percent lifetime).', kind: 'tip' },
    { content: 'Durations matter on the exam: GAD over 6 months, PTSD over 1 month, OCD rituals over 1 hour daily.', kind: 'tip' },
  ],
};
