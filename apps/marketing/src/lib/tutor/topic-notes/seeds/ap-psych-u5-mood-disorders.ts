/** AP Psychology — Unit 5 CED 5.4: Categories of Psychological Disorders: Depressive and Bipolar.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.mood-disorders.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_MOOD_DISORDERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.mood-disorders.v1',
  course: 'AP Psychology',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Categories of Psychological Disorders: Depressive and Bipolar',
  planId: 'evelyn.ap.psych.mood-disorders.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.mood-disorders.v1' }],
  theory: [
    { loId: 'appsych.mood-disorders', content: `MAJOR DEPRESSIVE DISORDER (MDD): at least FIVE symptoms for at least TWO WEEKS, and at least one must be either DEPRESSED MOOD or LOSS OF INTEREST/PLEASURE (ANHEDONIA). Other symptoms: significant weight/appetite change, sleep disturbance, fatigue, feelings of worthlessness or guilt, difficulty concentrating, psychomotor agitation or slowing, and suicidal ideation. It must IMPAIR functioning. Lifetime prevalence roughly 17 percent; about TWICE as common in women as men.` },
    { loId: 'appsych.mood-disorders', content: `PERSISTENT DEPRESSIVE DISORDER (DYSTHYMIA): LESS SEVERE than MDD but CHRONIC — depressed mood most days for at least TWO YEARS. The person is "always sad" rather than in acute crisis.` },
    { loId: 'appsych.mood-disorders', content: `BIPOLAR I DISORDER: defined by at least one full MANIC EPISODE — abnormally elevated or irritable mood with increased energy, DECREASED NEED FOR SLEEP, grandiosity, racing thoughts, and impulsive/risky behavior. Mania is severe and may require hospitalization or include psychosis. Manic episodes often alternate with depressive episodes. The PRESENCE OF MANIA is what separates bipolar from unipolar depression.` },
    { loId: 'appsych.mood-disorders', content: `BIPOLAR II DISORDER: HYPOMANIA (a milder, less impairing mood elevation) plus MAJOR DEPRESSIVE episodes. Hypomania is noticeable but does not cause the severe impairment or psychosis of full mania. CYCLOTHYMIA: chronic, less severe mood swings lasting at least two years.` },
    { loId: 'appsych.mood-disorders', content: `BIOLOGICAL EXPLANATIONS: genetics — heritability roughly 30 to 40 percent for MDD but much higher (about 70 percent) for BIPOLAR. Neurotransmitters — the SEROTONIN-deficit hypothesis (partial support, not the whole story), with norepinephrine and dopamine also implicated. Brain — hippocampal shrinkage in chronic depression; elevated CORTISOL; a possible inflammatory contribution. Bipolar shows a stronger genetic component and often emerges in the late teens or twenties.` },
    { loId: 'appsych.mood-disorders', content: `COGNITIVE EXPLANATIONS (Beck): the COGNITIVE TRIAD — persistent negative views of the SELF, the WORLD, and the FUTURE. Depressive distortions include catastrophizing, all-or-nothing thinking, and personalization. Nolen-Hoeksema's RUMINATION — repetitive dwelling on negative feelings — prolongs and deepens depression.` },
    { loId: 'appsych.mood-disorders', content: `BEHAVIORAL AND SOCIAL EXPLANATIONS: reduced positive reinforcement, isolation, and avoidance create a self-perpetuating cycle. LEARNED HELPLESSNESS (Seligman) — after repeated uncontrollable bad outcomes, people become passive and resigned even when escape becomes possible. Socially, life stress and losses (death, divorce, job loss) precipitate episodes, while SOCIAL SUPPORT is protective.` },
    { loId: 'appsych.mood-disorders', content: `SUICIDE RISK: depression accounts for roughly half of suicides. RISK FACTORS: prior attempt, family history, HOPELESSNESS, substance abuse, recent loss, access to means, social isolation, chronic illness. PROTECTIVE FACTORS: social connectedness, mental-health treatment, restricting access to means. INTERVENTION: ASK directly, LISTEN rather than lecture, REMOVE access to means, CONNECT to services. The U.S. Suicide and Crisis Lifeline is 988.` },
    { loId: 'appsych.mood-disorders', content: `TREATMENTS: psychotherapy — CBT (gold standard, evidence-based), Interpersonal Therapy (relationship focus), Behavioral Activation (increase reinforcing activities). Medications — SSRIs are first-line and take 4 to 6 WEEKS for effect; also SNRIs and older TCAs. For BIPOLAR: mood stabilizers, especially LITHIUM, plus anticonvulsants and atypical antipsychotics. Other options: exercise (comparable to medication for mild-moderate depression), light therapy for seasonal patterns, ECT and TMS for treatment-resistant cases, and rapid-acting ketamine.` },
    { loId: 'appsych.mood-disorders', kind: 'definition', title: 'major depressive disorder', content: `at least five symptoms for two or more weeks including depressed mood or anhedonia, causing functional impairment.` },
    { loId: 'appsych.mood-disorders', kind: 'definition', title: 'manic episode', content: `an abnormally elevated/irritable mood with high energy, reduced need for sleep, grandiosity, and impulsivity; its presence defines bipolar disorder.` },
    { loId: 'appsych.mood-disorders', kind: 'definition', title: 'cognitive triad', content: `Beck's model — persistent negative views of the self, the world, and the future that maintain depression.` },
    { loId: 'appsych.mood-disorders', kind: 'definition', title: 'learned helplessness', content: `Seligman's finding that repeated uncontrollable aversive outcomes produce passivity and resignation.` },
  ],
  methods: [
    {
      title: 'Diagnose major depressive disorder from a scenario',
      when_to_use: 'Vignettes listing mood and neurovegetative symptoms over a time window.',
      steps: [
        `STEP 1 — Count symptoms: you need FIVE or more, and at least one must be DEPRESSED MOOD or ANHEDONIA (loss of interest/pleasure).`,
        `STEP 2 — Check duration: symptoms present for at least TWO WEEKS (a chronic two-year low points to persistent depressive disorder instead).`,
        `STEP 3 — Confirm functional impairment (work, school, relationships).`,
        `STEP 4 — Screen for MANIA history: if there was ever a manic/hypomanic episode, it is BIPOLAR, not MDD — this changes treatment entirely.`,
        `STEP 5 — Assess suicide risk and plan treatment: CBT and behavioral activation, SSRI if severe/persistent, plus exercise, sleep hygiene, and social support.`,
      ],
      example: {
        problem: `A 28-year-old reports depressed mood, lost interest in hobbies, sleeping 12+ hours, 15 pounds lost, poor concentration, and worthlessness, beginning three months ago after a breakup. Diagnose and explain.`,
        solution: `MDD, single episode: six symptoms present (depressed mood, anhedonia, hypersomnia, weight loss, concentration difficulty, worthlessness) over three months — well past the two-week minimum — with work impairment; a relationship loss is a common precipitant. Treat with CBT plus a possible SSRI, add exercise and social support, and monitor suicide risk.`,
      },
      relatedLoIds: ['appsych.mood-disorders'],
    },
    {
      title: 'Distinguish bipolar from unipolar depression and explain the misdiagnosis danger',
      when_to_use: 'Items contrasting bipolar and MDD, or asking why the distinction matters clinically.',
      steps: [
        `STEP 1 — Anchor on MANIA: bipolar I requires at least one MANIC episode (elevated/irritable mood, reduced sleep need, grandiosity, impulsivity); MDD has depressive episodes ONLY, no mania ever.`,
        `STEP 2 — Explain the danger: prescribing an ANTIDEPRESSANT (SSRI) to an undiagnosed bipolar patient can TRIGGER a manic episode.`,
        `STEP 3 — Note the correct treatment: bipolar needs a MOOD STABILIZER (lithium/anticonvulsant); antidepressants alone can worsen the course.`,
        `STEP 4 — Explain why it is missed: patients in a depressive phase rarely report past mania (it felt good or productive), so clinicians must ask directly about prior high-energy, low-sleep episodes.`,
      ],
      example: {
        problem: `Why is it dangerous to misdiagnose bipolar disorder as major depression?`,
        solution: `Because treating it as unipolar depression with an SSRI alone can flip the patient into a dangerous manic episode (impulsive spending, risky behavior, sleeplessness, even psychosis). Bipolar requires a mood stabilizer such as lithium; without it the patient cycles uncontrollably. Since patients seldom volunteer past mania, clinicians must screen for it explicitly.`,
      },
      relatedLoIds: ['appsych.mood-disorders'],
    },
  ],
  pointers: [
    { content: 'MDD = 5+ symptoms for 2+ weeks, one being depressed mood or anhedonia; roughly 17 percent lifetime, 2x in women.', kind: 'tip' },
    { content: 'MANIA is the dividing line: its presence means bipolar, never unipolar MDD.', kind: 'tip' },
    { content: 'Never give an SSRI alone to a bipolar patient — it can trigger mania. Bipolar needs a mood stabilizer (lithium).', kind: 'tip' },
    { content: 'Beck cognitive triad (self/world/future) + Seligman learned helplessness are the classic depression theories.', kind: 'tip' },
    { content: 'Suicide intervention: ask directly, listen, remove means, connect to care; 988 lifeline.', kind: 'tip' },
    { content: 'SSRIs take 4 to 6 weeks to work — a common FRQ detail.', kind: 'tip' },
  ],
};
