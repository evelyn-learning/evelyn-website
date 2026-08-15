/**
 * AP Psychology — CED Unit 5.3: Explaining and Classifying Psychological
 * Disorders.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_PSYCH_U5_CLASSIFYING_DISORDERS: LessonPlan = {
  id: 'evelyn.ap.psych.classifying-disorders.v1',
  title: 'U5.3 Explaining and Classifying Psychological Disorders',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.classifying-disorders',
      description:
        'Apply the criteria used to define a psychological disorder (deviance, distress, dysfunction); explain classification systems (DSM-5-TR, ICD) and the biopsychosocial model; compare theoretical perspectives on the causes of disorders; and evaluate the benefits and risks of diagnostic labeling.',
      standard: 'AP-PSYCH-5.3',
    },
  ],
  prerequisites: [],
  followUps: ['appsych.anxiety-disorders'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the hard question of where "normal" ends and "disorder" begins.',
      script:
        "Where is the line between an unusual personality and a psychological disorder? It's harder to draw than you'd think — and getting it wrong has real costs. Before we study any specific disorder, psychology needs rules for what COUNTS as a disorder and a system for classifying them. Those rules, and their pitfalls, are the foundation for the rest of this unit.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-classify',
      kind: 'concept',
      goal: 'Cover defining criteria, classification systems, the biopsychosocial model, perspectives, and labeling.',
      keyIdeas: [
        'DEFINING A PSYCHOLOGICAL DISORDER — the common criteria (often "the 3 Ds"): DEVIANCE (behavior is atypical/violates cultural norms), DISTRESS (causes significant suffering to the person), and DYSFUNCTION / maladaptiveness (interferes with daily functioning). No single criterion is sufficient alone — context and culture matter.',
        'CULTURAL & HISTORICAL RELATIVITY: what is considered "disordered" varies across cultures and changes over time (e.g. behaviors once labeled disorders later removed). Judgments of abnormality are not purely objective.',
        'CLASSIFICATION SYSTEMS: the DSM-5-TR (Diagnostic and Statistical Manual, 5th ed., Text Revision; American Psychiatric Association) is the primary U.S. system — it describes disorders and diagnostic criteria (it classifies, it does NOT explain causes). The ICD (International Classification of Diseases, WHO) is used worldwide. Standardized criteria improve reliability of diagnosis and communication among clinicians.',
        'THE BIOPSYCHOSOCIAL MODEL: disorders arise from the interaction of BIOLOGICAL (genetics, brain chemistry), PSYCHOLOGICAL (thoughts, emotions, learning), and SOCIAL-CULTURAL (environment, stressors, culture) factors. The modern integrative framework.',
        'THE DIATHESIS-STRESS MODEL: a predisposition/vulnerability (diathesis, often biological) combines with environmental STRESS to produce a disorder — neither alone is sufficient.',
        'PERSPECTIVES on the CAUSES of disorders: BIOLOGICAL/MEDICAL (brain, genes, neurochemistry), PSYCHODYNAMIC (unconscious conflict), BEHAVIORAL (learned maladaptive responses), COGNITIVE (maladaptive thought patterns), HUMANISTIC, and SOCIOCULTURAL. Many clinicians take an ECLECTIC approach, drawing on several.',
        'BENEFITS OF DIAGNOSTIC LABELS: guide treatment, enable research, allow communication and access to care. RISKS: STIGMA, self-fulfilling prophecy, and bias — the Rosenhan study ("On Being Sane in Insane Places") showed that once labeled, normal behavior was reinterpreted to fit the diagnosis. Labels can stick and distort perception.',
      ],
      vocabulary: [
        { term: 'DSM-5-TR', definition: 'the American Psychiatric Association\'s manual that classifies disorders and their diagnostic criteria (describes, does not explain causes).' },
        { term: 'biopsychosocial model', definition: 'disorders result from interacting biological, psychological, and social-cultural factors.' },
        { term: 'diathesis-stress model', definition: 'a predisposition combines with stress to produce a disorder.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'try-three-ds',
      kind: 'try_yourself',
      problem:
        'A person spends two hours a day washing their hands until they bleed, feels intense anxiety they cannot control, and has lost their job because of it. Use the criteria for defining a disorder to explain why this likely qualifies, and why an unusual hobby (e.g. collecting bottle caps) would not.',
      expectedAnswer:
        'Using the common criteria ("3 Ds"): the hand-washing shows DEVIANCE (atypical, excessive behavior), DISTRESS (intense, uncontrollable anxiety/suffering), and DYSFUNCTION/maladaptiveness (it impairs daily life — lost job, physical harm). Meeting these criteria together suggests it qualifies as a psychological disorder. An unusual HOBBY like collecting bottle caps may be DEVIANT (atypical) but it causes NO distress and NO dysfunction — it does not impair functioning or cause suffering — so it does NOT qualify. Strong answers explicitly apply deviance + distress + dysfunction and emphasize that deviance ALONE (being unusual) is not enough; distress and/or dysfunction are needed.',
      responseFormat: 'free',
      hints: [
        'Recall deviance, distress, dysfunction.',
        'Which criteria does the hand-washing meet?',
        'Being merely unusual (deviant) is not sufficient on its own.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-perspectives-synthesis',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Two clinicians explain the same case of depression differently: one points to low serotonin and a family history; the other points to a recent job loss interacting with the patient\'s vulnerability. (a) Identify the perspective each is using. (b) Explain how the biopsychosocial model and the diathesis-stress model integrate both. (c) Identify one risk of giving this patient a diagnostic label, referencing relevant research.',
      expectedAnswer:
        '(a) The first clinician uses the BIOLOGICAL/MEDICAL perspective (neurochemistry — low serotonin — and genetics/family history). The second emphasizes a SOCIOCULTURAL/environmental stressor (job loss) interacting with personal vulnerability, reflecting a diathesis-stress framing. (b) The BIOPSYCHOSOCIAL MODEL integrates them by treating the disorder as the product of INTERACTING biological (serotonin, genes), psychological, and social factors (job loss) rather than any single cause. The DIATHESIS-STRESS MODEL specifies the mechanism: a biological/psychological PREDISPOSITION (diathesis) combines with environmental STRESS (the job loss) to trigger the depression — neither alone would be sufficient. (c) RISK of labeling: STIGMA and self-fulfilling prophecy — once labeled "depressed," others (and the patient) may reinterpret ordinary behavior through the diagnosis. The ROSENHAN study ("On Being Sane in Insane Places") demonstrated that, once labeled, normal behaviors were misread to fit the diagnosis and the label was hard to shed. Strong answers (i) name both perspectives, (ii) use biopsychosocial AND diathesis-stress to integrate, and (iii) cite a labeling risk with the Rosenhan study.',
      responseFormat: 'frq',
      hints: [
        'Serotonin/genetics vs stressor-plus-vulnerability = two perspectives.',
        'Biopsychosocial = interacting causes; diathesis-stress = predisposition + stress.',
        'What did Rosenhan show about labels?',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Defining a disorder: deviance, distress, dysfunction (no one criterion alone; culture matters).',
        'DSM-5-TR / ICD classify and describe disorders (they don\'t explain causes).',
        'Biopsychosocial model: interacting biological, psychological, social-cultural causes.',
        'Diathesis-stress: predisposition + stress produces a disorder.',
        'Labels aid treatment/research but risk stigma and self-fulfilling prophecy (Rosenhan).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.3',
    cedTitle: 'Explaining and Classifying Psychological Disorders',
    sources: [
      { type: 'concept', book: 'feldman', chapter: '15', note: 'Defining/classifying disorders, biopsychosocial model, perspectives, labeling.' },
    ],
  },
};
