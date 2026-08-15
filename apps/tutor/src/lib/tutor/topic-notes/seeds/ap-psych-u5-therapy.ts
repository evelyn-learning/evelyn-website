/** AP Psychology — Unit 5 CED 5.5: Treatment of Psychological Disorders.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.therapy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_THERAPY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.therapy.v1',
  course: 'AP Psychology',
  cedUnit: 5,
  cedTopic: '5.5',
  cedTitle: 'Treatment of Psychological Disorders',
  planId: 'evelyn.ap.psych.therapy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.therapy.v1' }],
  theory: [
    { loId: 'appsych.therapy', content: `PSYCHODYNAMIC THERAPY (Freud and neo-Freudians): aims to bring UNCONSCIOUS conflicts into consciousness. Signature TECHNIQUES: FREE ASSOCIATION, DREAM ANALYSIS, and TRANSFERENCE (the patient projects feelings about important people onto the therapist). Typically LONG-TERM (months to years). Evidence base is weaker than CBT, though short-term variants have some support.` },
    { loId: 'appsych.therapy', content: `HUMANISTIC THERAPY (Rogers, Maslow): PERSON-CENTERED / client-centered. The therapist provides UNCONDITIONAL POSITIVE REGARD, EMPATHY, and GENUINENESS. Goal: reduce the INCONGRUENCE between the real self and the ideal self. It is PATIENT-LED and NON-DIRECTIVE (the therapist reflects rather than advises). Best for mild-to-moderate distress; less effective for severe disorders.` },
    { loId: 'appsych.therapy', content: `BEHAVIORAL THERAPY: applies LEARNING PRINCIPLES (classical and operant conditioning). It ignores the "why" and targets what behavior must change and how. TECHNIQUES: SYSTEMATIC DESENSITIZATION (pair relaxation with a hierarchy of feared stimuli), EXPOSURE THERAPY (face fears directly), AVERSIVE CONDITIONING (pair an undesirable behavior with an unpleasant stimulus, e.g. disulfiram with alcohol), and TOKEN ECONOMIES (operant reinforcement systems). Especially effective for phobias, OCD, and addictions.` },
    { loId: 'appsych.therapy', content: `COGNITIVE THERAPY (Beck, Ellis): identify and CHANGE distorted thoughts. Beck targets the COGNITIVE TRIAD (negative views of self, world, future). Ellis's RATIONAL EMOTIVE BEHAVIOR THERAPY (REBT) directly challenges IRRATIONAL BELIEFS and disputes them.` },
    { loId: 'appsych.therapy', content: `COGNITIVE-BEHAVIORAL THERAPY (CBT) — the GOLD STANDARD: combines cognitive and behavioral techniques, is TIME-LIMITED (typically 12 to 20 sessions), and is evidence-based for depression, anxiety, OCD, PTSD, eating disorders, addiction, and insomnia. It works by identifying cognitive distortions, changing dysfunctional behaviors, and BUILDING SKILLS the patient can use independently. DIALECTICAL BEHAVIOR THERAPY (DBT) is a CBT adaptation for BPD; mindfulness-based cognitive therapy (MBCT) helps prevent depression relapse.` },
    { loId: 'appsych.therapy', content: `GROUP, FAMILY, AND COUPLES THERAPY: GROUP THERAPY has multiple patients meet with one therapist, offering peer support, modeling, and real-time interpersonal practice — and it is COST-EFFECTIVE. FAMILY THERAPY treats the family SYSTEM rather than the individual (valuable for adolescents, eating disorders, and severe mental illness). COUPLES THERAPY addresses relationship dynamics.` },
    { loId: 'appsych.therapy', content: `PSYCHOPHARMACOLOGY: ANTIDEPRESSANTS — SSRIs (Prozac, Zoloft, Lexapro), SNRIs (Effexor, Cymbalta), and older MAOIs (which require dietary restrictions). ANTIANXIETY — benzodiazepines (Xanax, Valium) work fast but are addictive, so SSRIs are preferred long-term. ANTIPSYCHOTICS — typical (haloperidol) and atypical (risperidone, olanzapine, clozapine). MOOD STABILIZERS for bipolar — lithium and anticonvulsants (Depakote, Lamictal). STIMULANTS for ADHD — methylphenidate (Ritalin) and amphetamines (Adderall). Most psychiatric medications take WEEKS to reach full effect.` },
    { loId: 'appsych.therapy', content: `BRAIN-BASED (SOMATIC) TREATMENTS: ECT (electroconvulsive therapy) induces a brief seizure under anesthesia for severe, treatment-resistant depression and bipolar — highly effective but underused due to stigma; the main side effect is often temporary memory loss. TMS (transcranial magnetic stimulation) delivers magnetic pulses to targeted brain regions, is FDA-approved for depression, less invasive than ECT, and effective for about half of treatment-resistant cases. PSYCHOSURGERY is now rare — the historical lobotomy is discredited; modern deep brain stimulation is used for severe OCD and depression.` },
    { loId: 'appsych.therapy', content: `EVALUATING TREATMENT: meta-analyses show psychotherapy helps most disorders (roughly 80 percent do better than untreated controls), CBT is especially evidence-based, and COMBINATION (medication plus therapy) is often most effective. The single strongest predictor of success across therapies is the THERAPEUTIC ALLIANCE — the quality of the patient-therapist relationship — which accounts for a large share of outcome variance (a "common factor" across schools). Patient motivation, a matched empirically supported approach, and cultural sensitivity also matter.` },
    { loId: 'appsych.therapy', content: `EVIDENCE-BASED PRACTICE integrates BEST RESEARCH EVIDENCE, CLINICAL EXPERTISE, and PATIENT VALUES/PREFERENCES. Persistent CHALLENGES to access include the mental-health TREATMENT GAP (most who need help do not get it), cost and insurance limits, STIGMA, provider shortages, and cultural barriers.` },
    { loId: 'appsych.therapy', kind: 'definition', title: 'CBT', content: `cognitive-behavioral therapy — the gold-standard, time-limited, evidence-based approach that changes both distorted thoughts and dysfunctional behaviors.` },
    { loId: 'appsych.therapy', kind: 'definition', title: 'systematic desensitization', content: `a behavioral technique pairing relaxation with a graded hierarchy of feared stimuli to extinguish a phobia.` },
    { loId: 'appsych.therapy', kind: 'definition', title: 'therapeutic alliance', content: `the quality of the patient-therapist relationship; the strongest single predictor of treatment success across therapies.` },
  ],
  methods: [
    {
      title: 'Identify the therapy school from a described technique',
      when_to_use: 'Vignettes describing what happens in a therapy session.',
      steps: [
        `STEP 1 — Free association, dream analysis, transference, focus on childhood/unconscious = PSYCHODYNAMIC.`,
        `STEP 2 — Unconditional positive regard, empathy, reflective non-directive listening = HUMANISTIC / client-centered (Rogers).`,
        `STEP 3 — Identifying and replacing distorted thoughts ("I'm worthless" -> "I'm struggling but capable") = COGNITIVE / CBT.`,
        `STEP 4 — Graded exposure, relaxation with a feared-stimulus hierarchy, token economies, aversion = BEHAVIORAL.`,
        `STEP 5 — Both thoughts AND behaviors targeted together, time-limited, skills-building = CBT.`,
      ],
      example: {
        problem: `Identify the approach: (a) patient free-associates about childhood on a couch; (b) therapist offers unconditional positive regard and reflects feelings; (c) patient relabels "I'm worthless" as a distortion; (d) patient gradually approaches feared elevators while staying calm.`,
        solution: `(a) Psychodynamic (free association). (b) Humanistic/client-centered (Rogers). (c) Cognitive/CBT (challenging distortions). (d) Behavioral (exposure/systematic desensitization).`,
      },
      relatedLoIds: ['appsych.therapy'],
    },
    {
      title: 'Design a CBT plan by splitting cognitive from behavioral techniques',
      when_to_use: 'Items asking how CBT would treat a specific anxiety or mood disorder.',
      steps: [
        `STEP 1 — COGNITIVE side: identify automatic negative thoughts, apply COGNITIVE RESTRUCTURING (challenge the evidence, decatastrophize), and reframe the cognitive triad.`,
        `STEP 2 — BEHAVIORAL side: build a graded EXPOSURE hierarchy, role-play, assign between-session HOMEWORK, run behavioral experiments to test predictions, and add relaxation training.`,
        `STEP 3 — Combine: CBT works because changing thoughts AND accumulating disconfirming experiences reinforce each other.`,
        `STEP 4 — Frame expectations: time-limited (roughly 12 to 16 sessions) and it leaves the patient with portable skills.`,
      ],
      example: {
        problem: `A patient with social anxiety disorder is prescribed CBT. What cognitive and behavioral techniques would the therapist use?`,
        solution: `Cognitive: identify automatic thoughts ("Everyone will think I'm an idiot"), challenge the evidence, decatastrophize, and reframe the cognitive triad. Behavioral: a graded exposure hierarchy from easy (saying hi) to hard (giving a presentation), role-play, homework, and relaxation. The combination — changing thoughts while building disconfirming experiences — is what makes CBT effective in a time-limited course.`,
      },
      relatedLoIds: ['appsych.therapy'],
    },
    {
      title: 'Match a disorder to its primary evidence-based treatment',
      when_to_use: 'Quick-match items pairing disorders with best-supported treatments.',
      steps: [
        `STEP 1 — Specific phobia -> EXPOSURE therapy / systematic desensitization (behavioral CBT), 80 to 90 percent effective.`,
        `STEP 2 — Major depression -> CBT plus SSRI (CBT alone often suffices for mild-moderate).`,
        `STEP 3 — Schizophrenia -> antipsychotic medication plus supportive/family therapy.`,
        `STEP 4 — BPD -> DBT (dialectical behavior therapy), a long-term commitment.`,
        `STEP 5 — ADHD -> stimulant medication plus behavioral therapy (combination most effective).`,
      ],
      example: {
        problem: `Name the primary evidence-based treatment for a specific phobia, MDD, schizophrenia, BPD, and ADHD.`,
        solution: `Phobia: exposure/systematic desensitization. MDD: CBT plus SSRI. Schizophrenia: antipsychotics plus family/supportive therapy. BPD: DBT. ADHD: stimulant medication plus behavioral therapy.`,
      },
      relatedLoIds: ['appsych.therapy'],
    },
  ],
  pointers: [
    { content: 'Match technique to school: free association = psychodynamic; unconditional positive regard = humanistic; distortions = cognitive; exposure = behavioral.', kind: 'tip' },
    { content: 'CBT is the gold standard for most disorders; DBT is the CBT adaptation for BPD.', kind: 'tip' },
    { content: 'Therapeutic alliance is the strongest single predictor of success across all therapies.', kind: 'tip' },
    { content: 'ECT and TMS are for treatment-resistant depression; ECT works but carries stigma and temporary memory loss.', kind: 'tip' },
    { content: 'Evidence-based practice = research evidence + clinical expertise + patient values.', kind: 'tip' },
    { content: 'Combination (medication + therapy) is often the most effective for moderate-to-severe cases.', kind: 'tip' },
  ],
};
