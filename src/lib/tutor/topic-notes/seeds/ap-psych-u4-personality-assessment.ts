/**
 * AP Psychology — Unit 4 CED 4.5: Personality Assessment.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.personality-assessment.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_PERSONALITY_ASSESSMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.personality-assessment.v1',
  course: 'AP Psychology',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Personality Assessment',
  planId: 'evelyn.ap.psych.personality-assessment.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.personality-assessment.v1' }],
  theory: [
    { loId: 'appsych.personality-assessment', content: `TWO FAMILIES OF PERSONALITY TESTS: PROJECTIVE tests present AMBIGUOUS stimuli so subjects PROJECT unconscious thoughts and feelings onto them (Rorschach, TAT). OBJECTIVE tests use STANDARDIZED questions with OBJECTIVE scoring — agree/disagree, true/false, multiple choice (MMPI, Big Five inventories). Which family a test belongs to is the single most common assessment question on the exam.` },
    { loId: 'appsych.personality-assessment', content: `RORSCHACH INKBLOT TEST (1921): ten ambiguous inkblots; the subject describes what they see, and responses are interpreted for emotional themes, perceptions of reality, and defenses. CONTROVERSIAL: validity widely questioned and test-retest reliability POOR for many interpretations; scoring is subjective and culturally biased. Some research supports LIMITED use (e.g., thought-disorder detection), but it has largely fallen out of clinical use.` },
    { loId: 'appsych.personality-assessment', content: `THEMATIC APPERCEPTION TEST (TAT — Murray, 1935): the subject views ambiguous PICTURES and tells a STORY about each; stories are interpreted for themes, motives, and conflicts. Classic use: assessing ACHIEVEMENT MOTIVATION, fears, relational dynamics. More structured than the Rorschach, but scoring is STILL subjective.` },
    { loId: 'appsych.personality-assessment', content: `PROJECTIVE TESTS — the tradeoff: STRENGTHS — bypass conscious defenses, may reveal unconscious dynamics, holistic. WEAKNESSES — LOW RELIABILITY (different examiners, different interpretations), LOW VALIDITY (may not measure what they claim), SUBJECTIVE scoring, resistant to faking but also to objective verification. Modern psychometricians are largely SKEPTICAL.` },
    { loId: 'appsych.personality-assessment', content: `MINNESOTA MULTIPHASIC PERSONALITY INVENTORY (MMPI / MMPI-2): the MOST WIDELY USED clinical personality test — 567 true/false items scored on multiple CLINICAL SCALES (depression, anxiety, paranoia, schizophrenia, hysteria, and more). Strong RELIABILITY and VALIDITY for clinical purposes; used for psychiatric diagnosis, job screening (with legal limits), and mental-health assessment. Signature feature: VALIDITY SCALES that detect FAKING — items nearly everyone answers the same way, so unusual patterns flag dishonest responding.` },
    { loId: 'appsych.personality-assessment', content: `BIG FIVE INVENTORIES (NEO-PI, IPIP): measure the five-factor model dimensions (OCEAN). Used for research, hiring, and self-understanding; strong CROSS-CULTURAL validity; multiple lengths (from about fifty items up to 240). For research on normal personality, Big Five instruments are the standard.` },
    { loId: 'appsych.personality-assessment', content: `MYERS-BRIGGS TYPE INDICATOR (MBTI): popular but psychometrically WEAK. Problems: it forces CONTINUOUS traits into fixed CATEGORIES, so people score DIFFERENTLY on retest even soon after; predictive validity for life outcomes is weak; researchers rarely use it. It stays popular because people like categories, the descriptions flatter, and it is heavily marketed. The Big Five is the research-supported alternative.` },
    { loId: 'appsych.personality-assessment', content: `PSYCHOMETRIC PROPERTIES: RELIABILITY = CONSISTENCY — test-retest (same scores over time), internal consistency (items correlate with each other), inter-rater (different scorers agree). VALIDITY = the test MEASURES WHAT IT CLAIMS — predictive (predicts outcomes), construct (tracks the underlying construct), content (samples the relevant domain), plus convergent (correlates with related measures) and discriminant (does not correlate with unrelated ones). STANDARDIZATION: norming the test on a representative sample. A test can be RELIABLE without being VALID — consistency does not guarantee accuracy.` },
    { loId: 'appsych.personality-assessment', content: `USES AND ETHICS: uses — clinical diagnosis (MMPI), employment screening (cautiously; legal restrictions apply), research, self-exploration, legal/forensic contexts. CULTURAL AND ETHICAL ISSUES: tests developed in one culture may not generalize to others; risk of MISUSE in employment; diagnoses can STIGMATIZE; SELF-REPORT BIAS — people answer in socially desirable ways. BEHAVIORAL ASSESSMENT (direct observation of behavior) is a further objective option.` },
    { loId: 'appsych.personality-assessment', kind: 'definition', title: 'projective test', content: `a test using ambiguous stimuli to reveal unconscious content; e.g., Rorschach inkblots, TAT.` },
    { loId: 'appsych.personality-assessment', kind: 'definition', title: 'reliability', content: `the consistency of a test — across time (test-retest), across items (internal), and across scorers (inter-rater).` },
    { loId: 'appsych.personality-assessment', kind: 'definition', title: 'validity', content: `the degree to which a test measures what it claims to measure (predictive, construct, content).` },
  ],
  methods: [
    {
      title: 'Choose the right test for a purpose',
      steps: [
        `STEP 1 — Identify the PURPOSE: clinical diagnosis, large-scale hiring, cross-population research, or exploratory therapy.`,
        `STEP 2 — For CLINICAL DIAGNOSIS, pick the MMPI-2: objective (567 true/false, computer-scored), high test-retest and inter-rater reliability, empirically validated clinical scales, detects faking via validity scales, ethically defensible for consequential decisions.`,
        `STEP 3 — For HIRING or RESEARCH, pick a Big Five inventory: standardized scoring enables fair comparison across many people and cultures. Projective tests are unfair and impractical at scale.`,
        `STEP 4 — Reserve PROJECTIVE tests (Rorschach, TAT) for supplementary, historically psychoanalytic uses: subjective scoring, low reliability and validity rule them out as primary evidence. The Rorschach retains only narrow support (thought-disorder detection).`,
        `STEP 5 — Justify with PSYCHOMETRICS: name reliability and validity explicitly — that is what earns the FRQ point.`,
      ],
      example: { problem: `A clinical psychologist must assess a patient for psychiatric disorders. Compare the MMPI-2 and the Rorschach as tools for this job.`, solution: `MMPI-2: objective, reliable, empirically validated clinical scales, faking detection — the gold standard. Rorschach: projective, subjectively scored, low reliability and validity, largely out of clinical use. Choose the MMPI-2; the Rorschach at most supplements in narrow contexts.` },
      relatedLoIds: ['appsych.personality-assessment'],
    },
    {
      title: 'Evaluate a new test’s reliability and validity',
      steps: [
        `STEP 1 — RELIABILITY checks for a new "creativity" test: TEST-RETEST (same people weeks or months apart; correlations should be high), INTERNAL CONSISTENCY (creativity items correlate with each other), INTER-RATER (if judgment is involved, different scorers agree).`,
        `STEP 2 — VALIDITY checks: PREDICTIVE (scores correlate with real creative achievements — publications, awards), CONSTRUCT (correlates with established creativity measures such as the Torrance tests), CONTENT (items cover divergent thinking, originality, fluency), CONVERGENT and DISCRIMINANT (correlates with related measures, not unrelated traits).`,
        `STEP 3 — Apply the framework to critique: the MBTI fails RELIABILITY (retest flips categories because continuous traits are cut into boxes) and fails PREDICTIVE VALIDITY (weak for life outcomes) — which is why researchers prefer the Big Five.`,
      ],
      example: { problem: `A new personality test claims to measure creativity. How would you assess its reliability and its validity, and why is the MBTI said to have low validity?`, solution: `Reliability: test-retest, internal consistency, inter-rater agreement. Validity: predictive (creative achievements), construct (Torrance correlation), content coverage. MBTI: retest instability from forced categories over continuous traits and weak outcome prediction — low validity despite popularity.` },
      relatedLoIds: ['appsych.personality-assessment'],
    },
  ],
  pointers: [
    { content: `Projective = ambiguous stimulus (Rorschach, TAT); objective = standardized items (MMPI, Big Five).`, kind: 'tip' },
    { content: `MMPI-2 = 567 true/false + clinical scales + VALIDITY SCALES that catch faking. Gold standard for clinical work.`, kind: 'tip' },
    { content: `Reliability = consistency; validity = accuracy. A test can be reliable yet NOT valid.`, kind: 'tip' },
    { content: `Rorschach and TAT: bypass defenses in theory, but low reliability and validity — psychometricians are skeptical.`, kind: 'tip' },
    { content: `MBTI is popular but weak (categorical, unstable on retest); Big Five is the research-supported alternative.`, kind: 'tip' },
    { content: `Self-report bias: people answer in socially desirable ways — a limit on ALL questionnaire measures.`, kind: 'tip' },
  ],
};
