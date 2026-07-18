/** AP Psychology — Unit 5 CED 5.3: Explaining and Classifying Psychological Disorders.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.classifying-disorders.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_CLASSIFYING_DISORDERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.classifying-disorders.v1',
  course: 'AP Psychology',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Explaining and Classifying Psychological Disorders',
  planId: 'evelyn.ap.psych.classifying-disorders.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.classifying-disorders.v1' }],
  theory: [
    { loId: 'appsych.classifying-disorders', content: `DEFINING A PSYCHOLOGICAL DISORDER — the common criteria (often "the 3 Ds"): DEVIANCE (behavior is atypical or violates cultural norms), DISTRESS (causes significant suffering to the person), and DYSFUNCTION / maladaptiveness (interferes with daily functioning — work, relationships, self-care). NO SINGLE CRITERION IS SUFFICIENT ALONE. Being merely unusual (deviant) does not make someone disordered; distress and/or dysfunction must be present. Context and culture matter for every judgment.` },
    { loId: 'appsych.classifying-disorders', content: `CULTURAL AND HISTORICAL RELATIVITY: what counts as "disordered" varies ACROSS CULTURES and CHANGES OVER TIME — behaviors once labeled disorders have later been removed from the manuals. Judgments of abnormality are NOT purely objective; they reflect the norms of a time and place. AP loves this point: abnormality is partly a social judgment.` },
    { loId: 'appsych.classifying-disorders', content: `CLASSIFICATION SYSTEMS: the DSM-5-TR (Diagnostic and Statistical Manual of Mental Disorders, 5th edition, Text Revision; American Psychiatric Association) is the primary U.S. system. It DESCRIBES disorders and lists DIAGNOSTIC CRITERIA — it classifies, it does NOT explain causes. The ICD (International Classification of Diseases, published by the WHO) is used worldwide. Standardized criteria improve the RELIABILITY of diagnosis (different clinicians reach the same diagnosis) and enable communication and research.` },
    { loId: 'appsych.classifying-disorders', content: `THE BIOPSYCHOSOCIAL MODEL: the modern integrative framework. Disorders arise from the INTERACTION of BIOLOGICAL factors (genetics, brain chemistry, physiology), PSYCHOLOGICAL factors (thoughts, emotions, learning history), and SOCIAL-CULTURAL factors (environment, stressors, culture, relationships). No single level of analysis is sufficient — the model insists on interaction.` },
    { loId: 'appsych.classifying-disorders', content: `THE DIATHESIS-STRESS MODEL: a PREDISPOSITION or vulnerability (the DIATHESIS — often genetic/biological, sometimes psychological) combines with environmental STRESS to produce a disorder. NEITHER ALONE IS SUFFICIENT: a person with high vulnerability but low stress, or high stress but no vulnerability, may never develop the disorder. This is the mechanism-level companion to the biopsychosocial model.` },
    { loId: 'appsych.classifying-disorders', content: `PERSPECTIVES ON THE CAUSES OF DISORDERS: BIOLOGICAL/MEDICAL (brain structures, genes, neurochemistry), PSYCHODYNAMIC (unconscious conflict, often from childhood), BEHAVIORAL (maladaptive responses LEARNED via conditioning), COGNITIVE (maladaptive thought patterns and distorted interpretations), HUMANISTIC (blocked growth, incongruence), and SOCIOCULTURAL (social conditions, culture, stressors). Many clinicians take an ECLECTIC approach — drawing on several perspectives as the case demands.` },
    { loId: 'appsych.classifying-disorders', content: `BENEFITS OF DIAGNOSTIC LABELS: they GUIDE TREATMENT (matching evidence-based therapy to disorder), ENABLE RESEARCH (comparable groups across studies), and allow COMMUNICATION among clinicians and ACCESS TO CARE (insurance, services).` },
    { loId: 'appsych.classifying-disorders', content: `RISKS OF DIAGNOSTIC LABELS: STIGMA, SELF-FULFILLING PROPHECY, and BIAS in how others interpret the person's behavior. The ROSENHAN STUDY ("On Being Sane in Insane Places"): healthy pseudopatients were admitted to psychiatric hospitals after faking one symptom; once labeled, their completely NORMAL behavior was reinterpreted by staff to FIT the diagnosis, and the label was hard to shed. Lesson: labels can stick and distort perception.` },
    { loId: 'appsych.classifying-disorders', kind: 'definition', title: 'DSM-5-TR', content: `the American Psychiatric Association's manual that classifies psychological disorders and lists their diagnostic criteria; it DESCRIBES disorders, it does not explain their causes.` },
    { loId: 'appsych.classifying-disorders', kind: 'definition', title: 'biopsychosocial model', content: `the view that disorders result from INTERACTING biological, psychological, and social-cultural factors.` },
    { loId: 'appsych.classifying-disorders', kind: 'definition', title: 'diathesis-stress model', content: `a predisposition (diathesis) combines with environmental stress to produce a disorder; neither alone is sufficient.` },
  ],
  methods: [
    {
      title: 'Apply the "3 Ds" to decide whether behavior qualifies as a disorder',
      when_to_use: 'Any scenario asking whether a described behavior counts as a psychological disorder.',
      steps: [
        `STEP 1 — Check DEVIANCE: is the behavior atypical or norm-violating in its cultural context? (Necessary flag, never sufficient alone.)`,
        `STEP 2 — Check DISTRESS: does the behavior cause the person significant suffering (anxiety, misery, being unable to control it)?`,
        `STEP 3 — Check DYSFUNCTION: does it impair daily functioning — job, school, relationships, self-care, physical health?`,
        `STEP 4 — Combine: a behavior meeting deviance PLUS distress and/or dysfunction likely qualifies; a behavior that is merely unusual (deviant only) does NOT.`,
        `STEP 5 — Add the culture caveat: note that judgments depend on cultural and historical context — this earns the nuance point on FRQs.`,
      ],
      example: {
        problem: `A person spends two hours a day washing their hands until they bleed, feels intense uncontrollable anxiety, and has lost their job because of it. Why does this likely qualify as a disorder, while an unusual hobby like collecting bottle caps would not?`,
        solution: `The hand-washing shows DEVIANCE (atypical, excessive), DISTRESS (intense uncontrollable anxiety), and DYSFUNCTION (lost job, physical harm) — meeting the criteria together, it likely qualifies. The hobby is deviant at most: it causes no distress and no dysfunction, so it does not qualify. Deviance alone is never enough.`,
      },
      relatedLoIds: ['appsych.classifying-disorders'],
    },
    {
      title: 'Integrate competing causal explanations with biopsychosocial + diathesis-stress',
      when_to_use: 'FRQ-style items where two clinicians (or perspectives) explain the same disorder differently.',
      steps: [
        `STEP 1 — NAME each perspective: neurochemistry/genetics language signals BIOLOGICAL/MEDICAL; stressor-plus-vulnerability language signals a SOCIOCULTURAL/environmental framing (often diathesis-stress).`,
        `STEP 2 — Integrate with the BIOPSYCHOSOCIAL MODEL: treat the disorder as the product of INTERACTING biological, psychological, and social factors rather than any single cause.`,
        `STEP 3 — Specify the mechanism with DIATHESIS-STRESS: the predisposition (e.g. genes, low serotonin) combines with the environmental stressor (e.g. job loss) to trigger the disorder; state explicitly that neither alone suffices.`,
        `STEP 4 — If asked about labeling, name a RISK (stigma, self-fulfilling prophecy) and cite the ROSENHAN study as evidence that labels distort how behavior is interpreted.`,
      ],
      example: {
        problem: `One clinician attributes a patient's depression to low serotonin and family history; another points to a recent job loss interacting with the patient's vulnerability. Identify each perspective, integrate them, and name one labeling risk.`,
        solution: `Clinician 1 = BIOLOGICAL/MEDICAL (neurochemistry + genetics). Clinician 2 = sociocultural stressor interacting with vulnerability (diathesis-stress framing). The biopsychosocial model integrates them as interacting causes; diathesis-stress specifies that predisposition + the job-loss stress jointly triggered the depression. Labeling risk: stigma/self-fulfilling prophecy — Rosenhan showed normal behavior gets reinterpreted to fit a diagnosis.`,
      },
      relatedLoIds: ['appsych.classifying-disorders'],
    },
  ],
  pointers: [
    { content: 'The 3 Ds — deviance, distress, dysfunction. Deviance ALONE is never enough.', kind: 'tip' },
    { content: 'DSM-5-TR and ICD CLASSIFY and describe disorders; they do NOT explain causes.', kind: 'tip' },
    { content: 'Biopsychosocial = interacting bio + psych + social causes; diathesis-stress = predisposition + stress.', kind: 'tip' },
    { content: 'Rosenhan study = labeling risk: once labeled, normal behavior is misread to fit the diagnosis.', kind: 'tip' },
    { content: 'Abnormality is partly a cultural/historical judgment — norms change over time.', kind: 'tip' },
    { content: 'Labels help (treatment, research, communication) AND harm (stigma, self-fulfilling prophecy) — FRQs often want both sides.', kind: 'tip' },
  ],
};
